import { NextResponse } from 'next/server';
import { getContractInfo, getTokenTotalSupply, isContractVerified, getContractCreationDate } from '@/lib/bscscan';
import { getTokenMetrics } from '@/lib/dexscreener';
import { analyzeTokenRisk, type TokenScanInput, type DexScanInput } from '@/lib/gemini';

// ─── Rate Limiting (in-memory MVP) ─────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;     // 10 scans per minute

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX) return false;
    entry.count++;
    return true;
}

// ─── Validation ────────────────────────────────────────────────────────────────
const ETH_ADDR_RE = /^0x[a-fA-F0-9]{40}$/;

/**
 * POST /api/scan
 * Body: { contractAddress: "0x..." }
 *
 * The Intelligence Layer's core endpoint.
 * Analyzes any BNB Chain token for rug pull risk in < 5 seconds.
 */
export async function POST(request: Request) {
    const startTime = Date.now();

    try {
        // ── Rate Limit ────────────────────────────────────────────────────────
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Max 10 scans per minute.' },
                { status: 429 }
            );
        }

        // ── Parse & Validate ──────────────────────────────────────────────────
        const body = await request.json();
        const contractAddress = typeof body.contractAddress === 'string'
            ? body.contractAddress.trim()
            : '';

        if (!ETH_ADDR_RE.test(contractAddress)) {
            return NextResponse.json(
                { error: 'Invalid BNB Chain contract address. Expected 0x followed by 40 hex characters.' },
                { status: 400 }
            );
        }

        // ── Fetch On-Chain Data (BscScan) ─────────────────────────────────────
        const [contractInfo, verified, totalSupply, creationDate] = await Promise.all([
            getContractInfo(contractAddress).catch(() => null),
            isContractVerified(contractAddress).catch(() => false),
            getTokenTotalSupply(contractAddress).catch(() => '0'),
            getContractCreationDate(contractAddress).catch(() => null),
        ]);

        const tokenInput: TokenScanInput = {
            contractAddress,
            tokenName: contractInfo?.ContractName || undefined,
            tokenSymbol: undefined, // BscScan doesn't return symbol directly
            isVerified: verified,
            sourceCode: contractInfo?.SourceCode || undefined,
            creationDate: creationDate?.toISOString() || undefined,
            totalSupply,
        };

        // ── Fetch DEX Data (DexScreener) ──────────────────────────────────────
        let dexInput: DexScanInput | null = null;
        try {
            const metrics = await getTokenMetrics(contractAddress);
            if (metrics) {
                // Populate token name/symbol from DEX data if available
                tokenInput.tokenName = tokenInput.tokenName || undefined;
                dexInput = {
                    priceUsd: metrics.priceUsd,
                    marketCap: metrics.marketCap,
                    liquidity: metrics.liquidity,
                    volume24h: metrics.volume24h,
                    priceChange24h: metrics.priceChange24h,
                    txns24h: metrics.txns24h,
                    pairCreatedAt: metrics.pairCreatedAt?.toISOString() || undefined,
                };
            }
        } catch (err) {
            console.warn('[/api/scan] DexScreener fetch failed, continuing without DEX data:', err);
        }

        // ── AI Analysis (Groq) ────────────────────────────────────────────────
        const result = await analyzeTokenRisk(tokenInput, dexInput);

        const elapsed = Date.now() - startTime;

        return NextResponse.json({
            success: true,
            ...result,
            token: {
                address: contractAddress,
                name: tokenInput.tokenName || 'Unknown',
                symbol: tokenInput.tokenSymbol || 'Unknown',
                verified: verified,
            },
            meta: {
                analysisTimeMs: elapsed,
                dataSourcesUsed: {
                    bscScan: true,
                    dexScreener: !!dexInput,
                    aiModel: 'llama-3.3-70b-versatile',
                },
            },
        });
    } catch (error) {
        const elapsed = Date.now() - startTime;
        console.error(`[/api/scan] Error after ${elapsed}ms:`, error);
        return NextResponse.json(
            { error: (error as Error).message || 'Risk scan failed', analysisTimeMs: elapsed },
            { status: 500 }
        );
    }
}
