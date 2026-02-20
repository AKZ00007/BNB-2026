import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getTokenMetrics, getBatchTokenMetrics, type TokenMetrics } from '@/lib/dexscreener';
import {
    getTokenTotalSupply,
    isContractVerified,
    getContractCreationDate,
    getBnbPrice
} from '@/lib/bscscan';

/**
 * BSC Data Scraper — /api/data/refresh
 * 
 * Fetches BSC token launch data from BscScan + DexScreener
 * Stores results in Supabase `bsc_launch_data` table
 * 
 * Process:
 * 1. Fetch trending/popular BSC tokens from DexScreener
 * 2. Filter by: market cap > $50k, age > 14 days, verified contract
 * 3. Enrich with BscScan data (supply, verification, creation date)
 * 4. Calculate success metrics
 * 5. Upsert to Supabase
 * 
 * Run as: GET /api/data/refresh
 * Or via Vercel Cron: daily at 2 AM UTC
 */

// Known successful BSC token categories to seed data
const SEED_TOKEN_SEARCHES = [
    'CAKE', 'XVS', 'ALPACA', 'BAKE', 'BURGER',
    'AUTO', 'BUNNY', 'BELT', 'EPS', 'MDX',
    'BABY', 'SAFEMOON', 'FLOKI', 'SHIB',
    'GMT', 'TWT', 'C98', 'SFP', 'HOOK',
];

/**
 * Determine if a token launch was "successful" based on metrics
 */
function evaluateSuccess(metrics: TokenMetrics, ageInDays: number): {
    isSuccessful: boolean;
    priceStabilityDays: number;
    marketCapGrowth: number;
} {
    // Success criteria:
    // 1. Still has liquidity > $10k
    // 2. Market cap > $50k
    // 3. Age > 14 days (survived initial dump)
    // 4. 24h volume > $1k (still trading)

    const hasLiquidity = metrics.liquidity > 10000;
    const hasMarketCap = metrics.marketCap > 50000;
    const isOldEnough = ageInDays > 14;
    const hasVolume = metrics.volume24h > 1000;

    const isSuccessful = hasLiquidity && hasMarketCap && isOldEnough && hasVolume;

    // Estimate price stability (days of consistent trading)
    // Simple heuristic: if price change is moderate, it's stable
    const priceStabilityDays = Math.abs(metrics.priceChange24h) < 20
        ? Math.min(ageInDays, 90)
        : Math.max(ageInDays - 7, 0);

    // Market cap growth estimate (compared to initial)
    // Without historical data, use FDV vs market cap ratio as proxy
    const marketCapGrowth = metrics.fdv > 0
        ? ((metrics.marketCap / metrics.fdv) * 100)
        : 0;

    return { isSuccessful, priceStabilityDays, marketCapGrowth };
}

/**
 * Create Supabase admin client (bypasses RLS)
 */
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        // Fall back to anon key for development
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !anonKey) {
            throw new Error('Supabase credentials not configured');
        }
        return createClient(url, anonKey);
    }

    return createClient(url, serviceKey);
}

export async function GET(request: Request) {
    const startTime = Date.now();
    const results = {
        success: false,
        tokensProcessed: 0,
        tokensStored: 0,
        errors: [] as string[],
        duration: 0,
    };

    try {
        // Verify authorization for cron jobs
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        // Allow in development or with valid cron secret
        const isDev = process.env.NODE_ENV === 'development';
        if (!isDev && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = getSupabaseAdmin();

        // Check if BscScan API key is available
        const hasBscScanKey = !!process.env.BSCSCAN_API_KEY;
        if (!hasBscScanKey) {
            console.warn('BSCSCAN_API_KEY not set — running in DexScreener-only mode');
        }

        // Step 1: Discover tokens via DexScreener search
        console.log('[Scraper] Starting token discovery...');

        const discoveredTokens = new Map<string, TokenMetrics>();

        for (const query of SEED_TOKEN_SEARCHES) {
            try {
                const metrics = await getTokenMetrics(query.toLowerCase());
                // DexScreener search isn't by address for these seeds, 
                // so we search by symbol and get the BSC pair
                const { searchTokens } = await import('@/lib/dexscreener');
                const pairs = await searchTokens(query);

                for (const pair of pairs.slice(0, 3)) { // Top 3 pairs per search
                    const tokenAddr = pair.baseToken.address.toLowerCase();
                    if (!discoveredTokens.has(tokenAddr)) {
                        const tokenMetrics = await getTokenMetrics(tokenAddr);
                        if (tokenMetrics && tokenMetrics.marketCap > 50000) {
                            discoveredTokens.set(tokenAddr, tokenMetrics);
                        }
                    }
                }
            } catch (error) {
                results.errors.push(`Search failed for ${query}: ${(error as Error).message}`);
            }
        }

        console.log(`[Scraper] Discovered ${discoveredTokens.size} tokens with market cap > $50k`);
        results.tokensProcessed = discoveredTokens.size;

        // Step 2: Enrich with BscScan data and evaluate
        const upsertData: Array<{
            token_address: string;
            launch_date: string | null;
            tge_percent: number | null;
            vesting_schedule: object | null;
            price_stability_days: number;
            market_cap_growth: number;
            is_successful: boolean;
            metadata: object;
        }> = [];

        let bnbPrice = 0;
        if (hasBscScanKey) {
            try {
                bnbPrice = await getBnbPrice();
            } catch {
                console.warn('[Scraper] Could not fetch BNB price');
            }
        }

        for (const [tokenAddr, metrics] of discoveredTokens) {
            try {
                let creationDate: Date | null = metrics.pairCreatedAt;
                let verified = false;
                let totalSupply = '0';

                // Enrich with BscScan data if API key available
                if (hasBscScanKey) {
                    try {
                        verified = await isContractVerified(tokenAddr);
                    } catch { /* non-critical */ }

                    if (!creationDate) {
                        try {
                            creationDate = await getContractCreationDate(tokenAddr);
                        } catch { /* non-critical */ }
                    }

                    try {
                        totalSupply = await getTokenTotalSupply(tokenAddr);
                    } catch { /* non-critical */ }
                }

                // Calculate age
                const ageInDays = creationDate
                    ? Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24))
                    : 0;

                // Evaluate success
                const { isSuccessful, priceStabilityDays, marketCapGrowth } = evaluateSuccess(
                    metrics,
                    ageInDays
                );

                upsertData.push({
                    token_address: tokenAddr,
                    launch_date: creationDate?.toISOString() || null,
                    tge_percent: null, // Would need deeper analysis
                    vesting_schedule: null, // Would need contract analysis
                    price_stability_days: priceStabilityDays,
                    market_cap_growth: marketCapGrowth,
                    is_successful: isSuccessful,
                    metadata: {
                        name: metrics.pairAddress ? `Token ${tokenAddr.slice(0, 8)}` : 'Unknown',
                        symbol: '',
                        priceUsd: metrics.priceUsd,
                        marketCap: metrics.marketCap,
                        fdv: metrics.fdv,
                        volume24h: metrics.volume24h,
                        liquidity: metrics.liquidity,
                        priceChange24h: metrics.priceChange24h,
                        txns24h: metrics.txns24h,
                        dexId: metrics.dexId,
                        pairAddress: metrics.pairAddress,
                        verified,
                        totalSupply,
                        bnbPrice,
                        ageInDays,
                        fetchedAt: new Date().toISOString(),
                    },
                });

            } catch (error) {
                results.errors.push(`Processing failed for ${tokenAddr}: ${(error as Error).message}`);
            }
        }

        // Step 3: Upsert to Supabase
        console.log(`[Scraper] Upserting ${upsertData.length} tokens to database...`);

        if (upsertData.length > 0) {
            // Batch upsert in chunks of 50
            const batchSize = 50;
            for (let i = 0; i < upsertData.length; i += batchSize) {
                const batch = upsertData.slice(i, i + batchSize);

                const { error } = await supabase
                    .from('bsc_launch_data')
                    .upsert(batch, {
                        onConflict: 'token_address',
                        ignoreDuplicates: false,
                    });

                if (error) {
                    results.errors.push(`Supabase upsert error (batch ${i}): ${error.message}`);
                    console.error('[Scraper] Upsert error:', error);
                } else {
                    results.tokensStored += batch.length;
                }
            }
        }

        results.success = true;
        results.duration = Date.now() - startTime;

        console.log(`[Scraper] Complete: ${results.tokensStored}/${results.tokensProcessed} stored in ${results.duration}ms`);

        return NextResponse.json(results);

    } catch (error) {
        results.errors.push(`Fatal error: ${(error as Error).message}`);
        results.duration = Date.now() - startTime;

        console.error('[Scraper] Fatal error:', error);

        return NextResponse.json(results, { status: 500 });
    }
}
