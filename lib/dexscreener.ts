/**
 * DexScreener API Client
 * Fetches token price, volume, and liquidity data
 * Rate limit: ~300 req/min (no API key required)
 * Docs: https://docs.dexscreener.com/api
 */

const DEXSCREENER_BASE_URL = 'https://api.dexscreener.com/latest/dex';

export interface DexPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: {
        address: string;
        name: string;
        symbol: string;
    };
    quoteToken: {
        address: string;
        name: string;
        symbol: string;
    };
    priceNative: string;
    priceUsd: string;
    txns: {
        m5: { buys: number; sells: number };
        h1: { buys: number; sells: number };
        h6: { buys: number; sells: number };
        h24: { buys: number; sells: number };
    };
    volume: {
        m5: number;
        h1: number;
        h6: number;
        h24: number;
    };
    priceChange: {
        m5: number;
        h1: number;
        h6: number;
        h24: number;
    };
    liquidity: {
        usd: number;
        base: number;
        quote: number;
    };
    fdv: number;
    marketCap: number;
    pairCreatedAt: number;
    info?: {
        imageUrl?: string;
        websites?: Array<{ label: string; url: string }>;
        socials?: Array<{ type: string; url: string }>;
    };
}

export interface TokenMetrics {
    priceUsd: number;
    marketCap: number;
    fdv: number;
    volume24h: number;
    liquidity: number;
    priceChange24h: number;
    txns24h: { buys: number; sells: number };
    pairAddress: string;
    dexId: string;
    pairCreatedAt: Date | null;
}

/**
 * Sleep helper for rate limiting
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get token pairs from DexScreener by token address
 * Chain: BSC (bsc)
 */
export async function getTokenPairs(tokenAddress: string): Promise<DexPair[]> {
    try {
        const response = await fetch(
            `${DEXSCREENER_BASE_URL}/tokens/${tokenAddress}`
        );

        if (!response.ok) {
            console.warn(`DexScreener error for ${tokenAddress}: ${response.status}`);
            return [];
        }

        const data = await response.json();

        // Rate limit: wait 200ms between calls
        await sleep(200);

        // Filter to BSC pairs only
        const pairs = (data.pairs || []) as DexPair[];
        return pairs.filter((p) => p.chainId === 'bsc');
    } catch (error) {
        console.error(`DexScreener fetch failed for ${tokenAddress}:`, error);
        return [];
    }
}

/**
 * Get the best (highest liquidity) pair metrics for a token
 */
export async function getTokenMetrics(tokenAddress: string): Promise<TokenMetrics | null> {
    const pairs = await getTokenPairs(tokenAddress);

    if (pairs.length === 0) {
        return null;
    }

    // Sort by liquidity (highest first)
    const bestPair = pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];

    return {
        priceUsd: parseFloat(bestPair.priceUsd) || 0,
        marketCap: bestPair.marketCap || 0,
        fdv: bestPair.fdv || 0,
        volume24h: bestPair.volume?.h24 || 0,
        liquidity: bestPair.liquidity?.usd || 0,
        priceChange24h: bestPair.priceChange?.h24 || 0,
        txns24h: bestPair.txns?.h24 || { buys: 0, sells: 0 },
        pairAddress: bestPair.pairAddress,
        dexId: bestPair.dexId,
        pairCreatedAt: bestPair.pairCreatedAt
            ? new Date(bestPair.pairCreatedAt)
            : null,
    };
}

/**
 * Search for tokens on DexScreener by query string
 */
export async function searchTokens(query: string): Promise<DexPair[]> {
    try {
        const response = await fetch(
            `${DEXSCREENER_BASE_URL}/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        await sleep(200);

        const pairs = (data.pairs || []) as DexPair[];
        return pairs.filter((p) => p.chainId === 'bsc');
    } catch (error) {
        console.error(`DexScreener search failed for "${query}":`, error);
        return [];
    }
}

/**
 * Batch fetch metrics for multiple tokens
 * DexScreener supports up to 30 addresses per call
 */
export async function getBatchTokenMetrics(
    tokenAddresses: string[]
): Promise<Map<string, TokenMetrics>> {
    const results = new Map<string, TokenMetrics>();
    const batchSize = 30;

    for (let i = 0; i < tokenAddresses.length; i += batchSize) {
        const batch = tokenAddresses.slice(i, i + batchSize);
        const addressList = batch.join(',');

        try {
            const response = await fetch(
                `${DEXSCREENER_BASE_URL}/tokens/${addressList}`
            );

            if (!response.ok) {
                console.warn(`DexScreener batch error: ${response.status}`);
                continue;
            }

            const data = await response.json();
            const pairs = (data.pairs || []) as DexPair[];

            // Group by base token and pick best pair per token
            const grouped = new Map<string, DexPair[]>();
            for (const pair of pairs) {
                if (pair.chainId !== 'bsc') continue;
                const addr = pair.baseToken.address.toLowerCase();
                if (!grouped.has(addr)) grouped.set(addr, []);
                grouped.get(addr)!.push(pair);
            }

            for (const [addr, tokenPairs] of grouped) {
                const bestPair = tokenPairs.sort(
                    (a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
                )[0];

                results.set(addr, {
                    priceUsd: parseFloat(bestPair.priceUsd) || 0,
                    marketCap: bestPair.marketCap || 0,
                    fdv: bestPair.fdv || 0,
                    volume24h: bestPair.volume?.h24 || 0,
                    liquidity: bestPair.liquidity?.usd || 0,
                    priceChange24h: bestPair.priceChange?.h24 || 0,
                    txns24h: bestPair.txns?.h24 || { buys: 0, sells: 0 },
                    pairAddress: bestPair.pairAddress,
                    dexId: bestPair.dexId,
                    pairCreatedAt: bestPair.pairCreatedAt
                        ? new Date(bestPair.pairCreatedAt)
                        : null,
                });
            }

            // Rate limit between batches
            await sleep(1000);
        } catch (error) {
            console.error(`DexScreener batch fetch failed:`, error);
        }
    }

    return results;
}
