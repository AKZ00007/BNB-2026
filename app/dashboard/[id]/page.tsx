'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PriceSimulator } from '@/components/dashboard/PriceSimulator';
import { VestingChart } from '@/components/dashboard/VestingChart';
import { TokenDistributionChart } from '@/components/dashboard/TokenDistributionChart';
import { DeployFlow } from '@/components/deployer/DeployFlow';
import { LiquidityFlow } from '@/components/deployer/LiquidityFlow';
import { ExportButton } from '@/components/dashboard/ExportButton';
import {
    ArrowLeft, Shield, Loader2, AlertTriangle,
    Coins, Percent, TrendingUp, Droplets
} from 'lucide-react';
import type { TokenConfig } from '@/types/config';

interface ConfigRow {
    id: string;
    config: TokenConfig;
    status: 'saved' | 'testnet' | 'mainnet';
    testnet_address?: string;
    created_at: string;
}

function StatPill({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-gold" />
            </div>
            <div>
                <p className="text-gray-400 text-xs">{label}</p>
                <p className="text-gray-900 font-semibold text-sm">{value}</p>
            </div>
        </div>
    );
}

export default function ConfigDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [row, setRow] = useState<ConfigRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deployed, setDeployed] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/config?id=${id}`)
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setRow(d.config);
                else setError(d.error || 'Config not found');
            })
            .catch(() => setError('Network error'))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-gray-900 overflow-hidden relative">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple/10 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            <div className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gold text-sm mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                ) : error ? (
                    <div className="glass-card-prominent rounded-2xl p-8 text-center">
                        <AlertTriangle className="w-10 h-10 text-error mx-auto mb-3" />
                        <p className="text-error">{error}</p>
                    </div>
                ) : row ? (
                    <>
                        {/* Token header */}
                        <div className="glass-card-prominent rounded-2xl p-6 mb-8 flex items-start justify-between flex-wrap gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {row.config.tokenName}
                                    </h1>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gold/10 border border-gold/20 text-gold">
                                        ${row.config.tokenSymbol}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs capitalize bg-white border border-gray-200 text-gray-600">
                                        {row.config.category}
                                    </span>
                                </div>
                                <p className="text-gray-600 max-w-2xl">{row.config.aiSummary || row.config.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <ExportButton config={row.config} />
                                <div className="flex items-center gap-2">
                                    <Shield className={`w-4 h-4 ${row.config.risk.score >= 7 ? 'text-success' : row.config.risk.score >= 5 ? 'text-warning' : 'text-error'}`} />
                                    <span className={`text-sm font-semibold ${row.config.risk.score >= 7 ? 'text-success' : row.config.risk.score >= 5 ? 'text-warning' : 'text-error'}`}>
                                        {row.config.risk.score >= 7 ? 'Low' : row.config.risk.score >= 5 ? 'Medium' : 'High'} Risk — {row.config.risk.score}/10
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Key stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                            <StatPill label="Total Supply" value={Number(row.config.totalSupply).toLocaleString()} icon={Coins} />
                            <StatPill label="TGE Unlock" value={`${row.config.tgePercent}%`} icon={Percent} />
                            <StatPill label="Hard Cap" value={`${Number(row.config.hardCapBnb).toLocaleString()} BNB`} icon={TrendingUp} />
                            <StatPill label="Initial Liquidity" value={`${row.config.amm.initialLiquidityPercent}%`} icon={Droplets} />
                        </div>

                        {/* Charts grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="lg:col-span-2">
                                <PriceSimulator config={row.config} />
                            </div>
                            <VestingChart config={row.config} />
                            <TokenDistributionChart config={row.config} />
                        </div>

                        {/* Deploy & Liquidity section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    {row.status === 'testnet' ? '✅ Deployed to Testnet' : '🚀 Deploy to BSC Testnet'}
                                </h2>
                                {row.status === 'testnet' && row.testnet_address ? (
                                    <div className="glass-card-prominent rounded-2xl p-5 text-sm">
                                        <p className="text-gray-600 mb-2">Contract Address:</p>
                                        <a
                                            href={`https://testnet.bscscan.com/address/${row.testnet_address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gold hover:underline font-mono break-all"
                                        >
                                            {row.testnet_address}
                                        </a>
                                    </div>
                                ) : (
                                    <DeployFlow
                                        configId={row.id}
                                        config={row.config}
                                        onDeployed={() => setDeployed(true)}
                                    />
                                )}
                            </div>

                            {/* PancakeSwap Liquidity — only shows after deploy */}
                            {row.status === 'testnet' && row.testnet_address && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        💧 Add PancakeSwap Liquidity
                                    </h2>
                                    <LiquidityFlow
                                        contractAddress={row.testnet_address as `0x${string}`}
                                        config={row.config}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </main>
    );
}
