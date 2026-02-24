'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertTriangle, TerminalSquare, Sparkles } from 'lucide-react';
import { InteractiveDemo } from '@/components/dashboard/InteractiveDemo';
import type { TokenConfig } from '@/types/config';

interface ConfigRow {
    id: string;
    config: TokenConfig;
    testnet_address?: string;
}

/* ── Fallback demo config (used when Supabase is unreachable) ────── */
const DEMO_FALLBACK_CONFIG: TokenConfig = {
    tokenName: 'GuardianToken Demo',
    tokenSymbol: 'GUARD',
    category: 'ai',
    description: 'Demo token for Guardian Defense Simulator testing',
    totalSupply: 1000000000,
    decimals: 18,
    tgePercent: 10,
    hardCapBnb: 500,
    softCapBnb: 250,
    vesting: [
        { label: 'Public Sale', percent: 30, tgePercent: 15, cliffMonths: 0, vestingMonths: 12 },
        { label: 'Team', percent: 15, tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
        { label: 'Liquidity', percent: 25, tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
        { label: 'Ecosystem', percent: 20, tgePercent: 0, cliffMonths: 3, vestingMonths: 36 },
        { label: 'Marketing', percent: 10, tgePercent: 10, cliffMonths: 1, vestingMonths: 12 },
    ],
    amm: {
        dex: 'PancakeSwap V2',
        initialLiquidityPercent: 45,
        buyTaxPercent: 2,
        sellTaxPercent: 4,
        antiWhaleMaxWalletPercent: 2,
        maxTxPercent: 1.5,
        antiBotBlocks: 3,
        cooldownSeconds: 30,
        dynamicTaxEnabled: true,
        twapDeviationPercent: 15,
        bondingCurve: 'linear',
    },
    plu: {
        totalLockPercent: 80,
        milestones: [
            { percent: 20, afterDays: 90, condition: '90-day lock period' },
            { percent: 30, afterDays: 180, condition: '1,000+ active users' },
            { percent: 30, afterDays: 365, condition: '12-month maturity' },
        ],
    },
    risk: { score: 8, flags: ['Strong PLU lock'], suggestions: ['Add token burn'] },
    aiSummary: 'Demo token with full Guardian protection suite enabled.',
    generatedAt: new Date().toISOString(),
};

export default function DemoSandboxPage() {
    const { id } = useParams<{ id: string }>();
    const [row, setRow] = useState<ConfigRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/config?id=${id}`)
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setRow(d.config);  // d.config includes testnet_address from API
                else {
                    // Use fallback demo config
                    setUsingFallback(true);
                    setRow({ id: id as string, config: DEMO_FALLBACK_CONFIG });
                }
            })
            .catch(() => {
                // Network error — use fallback
                setUsingFallback(true);
                setRow({ id: id as string, config: DEMO_FALLBACK_CONFIG });
            })
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden relative transition-colors">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            <div className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={`/dashboard/${id}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gold text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Token Details
                    </Link>
                    <div className="px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <TerminalSquare className="w-3.5 h-3.5" /> Simulation Sandbox
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                ) : row ? (
                    <div>
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Guardian Defense Simulator</h1>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Run attack simulations against <strong className="text-gold">{row.config.tokenSymbol}</strong>&apos;s trading guards. Select individual attacks or run all to test the full defense suite.
                            </p>
                            {usingFallback && (
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-600 dark:text-amber-400">
                                    <Sparkles className="w-3 h-3" />
                                    Using demo config (database unavailable). Deploy a token to test with real config.
                                </div>
                            )}
                        </div>
                        <InteractiveDemo config={row.config} contractAddress={row.testnet_address} />
                    </div>
                ) : null}
            </div>
        </main>
    );
}
