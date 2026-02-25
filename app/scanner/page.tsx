'use client';

import { useState } from 'react';
import {
    Search, Shield, ShieldAlert, ShieldX, Loader2, AlertTriangle,
    CheckCircle2, XCircle, Info, ExternalLink, Clock, Activity,
    Lock, Users, Code2, BarChart3, Zap, Terminal, Shuffle,
} from 'lucide-react';
import { readTokenInfo, parseRevertReason, EXECUTION_PROOF, type TokenInfo } from '@/lib/contracts/guardian-token';
import { buildMetricsFromTokenInfo, computeGuardianScore } from '@/lib/guardian-score';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RiskDetail {
    risk: string;
    notes: string;
}

interface ScanResult {
    success: boolean;
    score: number;
    rating: 'SAFE' | 'WARNING' | 'DANGEROUS';
    summary: string;
    flags: string[];
    details: {
        contractCode: RiskDetail;
        ownership: RiskDetail;
        liquidity: RiskDetail;
        holders: RiskDetail;
        trading: RiskDetail;
    };
    token: {
        address: string;
        name: string;
        symbol: string;
        verified: boolean;
    };
    meta: {
        analysisTimeMs: number;
        dataSourcesUsed: {
            bscScan: boolean;
            dexScreener: boolean;
            aiModel: string;
        };
    };
    analyzedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRatingConfig(rating: string) {
    switch (rating) {
        case 'SAFE':
            return {
                color: 'text-green-400',
                bg: 'bg-green-400/10',
                border: 'border-green-400/20',
                icon: Shield,
                label: 'SAFE',
                glow: 'shadow-green-400/20',
            };
        case 'WARNING':
            return {
                color: 'text-yellow-400',
                bg: 'bg-yellow-400/10',
                border: 'border-yellow-400/20',
                icon: ShieldAlert,
                label: 'WARNING',
                glow: 'shadow-yellow-400/20',
            };
        default:
            return {
                color: 'text-red-400',
                bg: 'bg-red-400/10',
                border: 'border-red-400/20',
                icon: ShieldX,
                label: 'DANGEROUS',
                glow: 'shadow-red-400/20',
            };
    }
}

function getRiskColor(risk: string) {
    switch (risk) {
        case 'LOW': return 'text-green-400';
        case 'MEDIUM': return 'text-yellow-400';
        case 'HIGH': return 'text-orange-400';
        case 'CRITICAL': return 'text-red-400';
        default: return 'text-gray-400';
    }
}

const DIMENSION_ICONS: Record<string, typeof Code2> = {
    contractCode: Code2,
    ownership: Lock,
    liquidity: Activity,
    holders: Users,
    trading: BarChart3,
};

const DIMENSION_LABELS: Record<string, string> = {
    contractCode: 'Contract Code',
    ownership: 'Ownership',
    liquidity: 'Liquidity',
    holders: 'Holder Distribution',
    trading: 'Trading History',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScannerPage() {
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState('');
    const [guardianInfo, setGuardianInfo] = useState<TokenInfo | null>(null);
    const [guardianScore, setGuardianScore] = useState<ReturnType<typeof computeGuardianScore> | null>(null);
    const [guardianLoading, setGuardianLoading] = useState(false);

    async function fetchGuardianData(addr: string, isVerified: boolean) {
        setGuardianLoading(true);
        try {
            const info = await readTokenInfo(addr);
            setGuardianInfo(info);
            const metrics = buildMetricsFromTokenInfo(info, isVerified);
            setGuardianScore(computeGuardianScore(metrics));
        } catch {
            // Guardian data unavailable — non-guardian token, fail silently
            setGuardianInfo(null);
            setGuardianScore(null);
        } finally {
            setGuardianLoading(false);
        }
    }

    async function loadRandomToken() {
        try {
            const res = await fetch('https://api.dexscreener.com/latest/dex/tokens/BSC');
            const data = await res.json();
            const pairs = data?.pairs ?? [];
            if (pairs.length > 0) {
                const random = pairs[Math.floor(Math.random() * pairs.length)];
                const addr = random?.baseToken?.address;
                if (addr) {
                    setAddress(addr);
                    setResult(null);
                    setGuardianInfo(null);
                    setGuardianScore(null);
                }
            }
        } catch { /* silently ignore */ }
    }

    async function handleScan() {
        const trimmed = address.trim();
        if (!trimmed) return;

        if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
            setError('Invalid address. Expected 0x followed by 40 hex characters.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);
        setGuardianInfo(null);
        setGuardianScore(null);

        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contractAddress: trimmed }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Scan failed (${res.status})`);
            }

            setResult(data as ScanResult);
            // Fetch live on-chain guardian data in parallel (silent fail)
            fetchGuardianData(trimmed, data.token?.verified ?? false);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    const ratingConfig = result ? getRatingConfig(result.rating) : null;

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative z-10 pt-28 pb-20 px-6 max-w-4xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-sm text-cyan-400 mb-4">
                        <Shield className="w-4 h-4" /> AI Risk Scanner
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Scan Any{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                            BNB Token
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto transition-colors">
                        Paste any BNB Chain contract address. Our AI analyzes the contract code,
                        ownership, liquidity, and trading patterns to detect rug pull risk in seconds.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="glass-card-prominent rounded-2xl p-4 mb-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors">
                            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                                placeholder="0x... paste any BNB Chain token address"
                                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none font-mono transition-colors"
                                disabled={loading}
                            />
                        </div>
                        <button
                            onClick={loadRandomToken}
                            title="Try a random trending BSC token"
                            className="px-4 py-3 rounded-xl text-sm font-semibold border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all flex items-center gap-2"
                            disabled={loading}
                        >
                            <Shuffle className="w-4 h-4" /> Random
                        </button>
                        <button
                            onClick={handleScan}
                            disabled={loading || !address.trim()}
                            className="px-6 py-3 rounded-xl text-sm font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #8B5CF6 100%)' }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Scan Token
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-4 animate-pulse">
                        <div className="glass-card rounded-2xl p-8 flex flex-col items-center">
                            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                            <p className="text-gray-400 text-sm">Fetching on-chain data from BscScan & DexScreener…</p>
                            <p className="text-gray-500 text-xs mt-1">AI analyzing contract code, ownership, and trading patterns…</p>
                        </div>
                    </div>
                )}

                {/* Results */}
                {result && ratingConfig && !loading && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Score Card */}
                        <div className={`glass-card-prominent rounded-2xl p-6 border ${ratingConfig.border} shadow-lg ${ratingConfig.glow}`}>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {/* Score circle */}
                                <div className={`relative w-28 h-28 rounded-full border-4 ${ratingConfig.border} flex items-center justify-center flex-shrink-0`}>
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${ratingConfig.color}`}>{result.score}</div>
                                        <div className="text-gray-500 text-xs">/100</div>
                                    </div>
                                </div>

                                {/* Rating + Summary */}
                                <div className="flex-1 text-center sm:text-left">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${ratingConfig.bg} ${ratingConfig.color} text-sm font-bold mb-2`}>
                                        <ratingConfig.icon className="w-4 h-4" />
                                        {ratingConfig.label}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors">{result.summary}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {result.meta.analysisTimeMs}ms
                                        </span>
                                        <span>{result.token.name} ({result.token.symbol})</span>
                                        {result.token.verified && (
                                            <span className="flex items-center gap-1 text-green-400">
                                                <CheckCircle2 className="w-3 h-3" /> Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Guardian Safety Panel (live on-chain data) ── */}
                        {(guardianInfo || guardianLoading) && (
                            <div className="glass-card rounded-2xl p-5 border border-cyan-400/20">
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-cyan-400" />
                                    Guardian Safety Panel
                                    <span className="ml-auto text-xs text-cyan-400/60 flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> Live from BSC Node
                                    </span>
                                </h3>

                                {guardianLoading && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Reading on-chain data…
                                    </div>
                                )}

                                {guardianInfo && guardianScore && (
                                    <>
                                        {/* Score row */}
                                        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                            <div className={`text-2xl font-bold ${guardianScore.score >= 90 ? 'text-green-400' :
                                                    guardianScore.score >= 70 ? 'text-yellow-400' :
                                                        guardianScore.score >= 50 ? 'text-orange-400' : 'text-red-400'
                                                }`}>{guardianScore.score}<span className="text-sm text-gray-500">/100</span></div>
                                            <div>
                                                <div className="text-sm font-semibold">{guardianScore.tier.emoji} {guardianScore.tier.label}</div>
                                                <div className="text-xs text-gray-500">Guardian Score · computed from live contract</div>
                                            </div>
                                        </div>

                                        {/* Live stats grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                                            {[
                                                { label: 'Buy Tax', value: `${Number(guardianInfo.buyTaxBps) / 100}%`, ok: guardianInfo.buyTaxBps <= 500n },
                                                { label: 'Sell Tax', value: `${Number(guardianInfo.sellTaxBps) / 100}%`, ok: guardianInfo.sellTaxBps <= 1000n },
                                                { label: 'Sell Cooldown', value: `${guardianInfo.sellCooldownSeconds}s`, ok: guardianInfo.sellCooldownSeconds > 0n },
                                                { label: 'Anti-Whale', value: guardianInfo.maxWalletAmount < guardianInfo.totalSupply ? 'Active' : 'None', ok: guardianInfo.maxWalletAmount < guardianInfo.totalSupply },
                                                { label: 'Verified', value: result.token.verified ? 'Yes ✓' : 'No', ok: result.token.verified },
                                                { label: 'Data Source', value: 'eth_call', ok: true },
                                            ].map(({ label, value, ok }) => (
                                                <div key={label} className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                                    <div className="text-xs text-gray-500">{label}</div>
                                                    <div className={`text-sm font-semibold ${ok ? 'text-green-400' : 'text-red-400'}`}>{value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Execution Proof card (Gap 1) */}
                                        <div className="p-3 rounded-xl bg-gray-900/80 border border-cyan-400/20 font-mono text-xs">
                                            <div className="flex items-center gap-2 text-cyan-400 mb-2">
                                                <Terminal className="w-3 h-3" />
                                                <span className="font-semibold">How Guardian Works — Not a Scanner</span>
                                            </div>
                                            <div className="text-gray-400 space-y-1">
                                                <div>Execution Source: <span className="text-green-400">{EXECUTION_PROOF.source}</span></div>
                                                <div>Simulation Depth: <span className="text-green-400">{EXECUTION_PROOF.depth}</span></div>
                                                <div>Call Stack:</div>
                                                {EXECUTION_PROOF.callStack.map((s, i) => (
                                                    <div key={i} className="pl-3 text-purple-300">{i > 0 ? '→ ' : '  '}{s}</div>
                                                ))}
                                                <div className="mt-2 pt-2 border-t border-gray-800 space-y-0.5">
                                                    {EXECUTION_PROOF.guarantees.map((g, i) => (
                                                        <div key={i} className="text-green-400">✔ {g}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Flags */}
                        {result.flags.length > 0 && (
                            <div className="glass-card rounded-2xl p-5">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-400" /> Risk Flags ({result.flags.length})
                                </h3>
                                <div className="space-y-2">
                                    {result.flags.map((flag, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm">
                                            <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 transition-colors">{flag}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dimension Breakdown */}
                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                <Info className="w-4 h-4 text-cyan-400" /> Analysis Breakdown
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(result.details).map(([key, detail]) => {
                                    const Icon = DIMENSION_ICONS[key] || Info;
                                    const label = DIMENSION_LABELS[key] || key;
                                    return (
                                        <div
                                            key={key}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 transition-colors">
                                                <Icon className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium">{label}</span>
                                                    <span className={`text-xs font-bold ${getRiskColor(detail.risk)}`}>{detail.risk}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{detail.notes}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Token Info & Links */}
                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-cyan-400" /> Token Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href={`https://bscscan.com/address/${result.token.address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-cyan-400/30 transition-all text-sm"
                                >
                                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                                    <span className="truncate font-mono text-xs">{result.token.address}</span>
                                </a>
                                <a
                                    href={`https://dexscreener.com/bsc/${result.token.address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-cyan-400/30 transition-all text-sm"
                                >
                                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                                    View on DexScreener
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Default state — instructions */}
                {!result && !loading && !error && (
                    <div className="glass-card rounded-2xl p-10 text-center">
                        <div className="w-16 h-16 bg-cyan-400/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Shield className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">How it works</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 text-left">
                            {[
                                {
                                    step: '1',
                                    title: 'Paste Address',
                                    desc: 'Enter any BNB Chain (BEP-20) token contract address above.',
                                },
                                {
                                    step: '2',
                                    title: 'AI Analyzes',
                                    desc: 'We fetch contract code, LP data, and holder distribution, then run AI analysis.',
                                },
                                {
                                    step: '3',
                                    title: 'Get Verdict',
                                    desc: 'Receive a SAFE / WARNING / DANGEROUS score with plain-language explanation.',
                                },
                            ].map((s) => (
                                <div key={s.step} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
                                        {s.step}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm mb-1">{s.title}</div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
