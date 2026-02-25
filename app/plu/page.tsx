'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useAccount } from 'wagmi';
import { Lock, Unlock, Hourglass, CheckCircle2, BarChart2, Target, PieChart as PieChartIcon, Calendar, Shield, Coins, Search, Wallet } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

/* ── Mock data ───────────────────────────────────────────────────────────── */

const PLU_MILESTONES = [
    { id: 1, condition: 'Reach 500 unique holders', percent: 5, afterDays: 30, status: 'completed' as const, completedDate: '2025-01-15' },
    { id: 2, condition: 'Hit $500K market cap', percent: 10, afterDays: 60, status: 'completed' as const, completedDate: '2025-02-10' },
    { id: 3, condition: 'Achieve $50K daily volume', percent: 10, afterDays: 90, status: 'active' as const, completedDate: null },
    { id: 4, condition: 'Partnership integration live', percent: 15, afterDays: 120, status: 'pending' as const, completedDate: null },
    { id: 5, condition: '12-month token age', percent: 20, afterDays: 365, status: 'pending' as const, completedDate: null },
];

const LOCK_DISTRIBUTION = [
    { name: 'Unlocked', value: 15, color: '#4ade80' },
    { name: 'Active Milestone', value: 10, color: '#F0B90B' },
    { name: 'Pending', value: 35, color: '#64748b' },
    { name: 'Circulating', value: 40, color: '#a78bfa' },
];

const UNLOCK_SCHEDULE = [
    { month: 'M1', unlocked: 5, locked: 55 },
    { month: 'M2', unlocked: 15, locked: 45 },
    { month: 'M3', unlocked: 25, locked: 35 },
    { month: 'M6', unlocked: 25, locked: 35 },
    { month: 'M9', unlocked: 40, locked: 20 },
    { month: 'M12', unlocked: 60, locked: 0 },
];

/* ── Main Component ──────────────────────────────────────────────────────── */

export default function PLUPage() {
    const { resolvedTheme } = useTheme();
    const { address, isConnected } = useAccount();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted ? resolvedTheme === 'dark' : false;

    const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
    const [searchId, setSearchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [realStatus, setRealStatus] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Auto-fetch user's deployed tokens
    const [deployedTokens, setDeployedTokens] = useState<any[]>([]);
    const [tokensLoading, setTokensLoading] = useState(false);
    const [selectedToken, setSelectedToken] = useState<any>(null);

    useEffect(() => {
        if (!isConnected || !address) return;
        setTokensLoading(true);
        fetch(`/api/config?wallet=${address}`)
            .then(r => r.json())
            .then(d => {
                if (d.success && d.configs) {
                    setDeployedTokens(d.configs);
                }
            })
            .catch(() => { })
            .finally(() => setTokensLoading(false));
    }, [address, isConnected]);

    const handleSearch = async (overrideId?: string, overrideAddr?: string) => {
        const id = overrideId || searchId;
        const addr = overrideAddr || '';
        if (!id && !addr) return;
        setLoading(true);
        setErrorMsg('');
        setRealStatus(null);
        try {
            // Build query params — use all available identifiers for max lookup reliability
            const params = new URLSearchParams();
            if (id) params.set('configId', id);
            if (addr) params.set('contractAddress', addr);

            const r = await fetch(`/api/plu/status?${params.toString()}`);
            const d = await r.json();
            if (d.success) setRealStatus(d);
            else setErrorMsg(d.error || 'PLU lock not found.');
        } catch (e: any) {
            setErrorMsg('Network error.');
        }
        setLoading(false);
    };

    const handleSelectToken = (token: any) => {
        setSelectedToken(token);
        setErrorMsg('');
        setRealStatus(null);
        if (token.id) {
            setSearchId(token.id);
        }
        // Auto-trigger search with both configId and contractAddress
        handleSearch(token.id, token.testnet_address || '');
    };

    // ── Dynamic Data Calculation ──────────────────────────────────────────

    // 1. Compute Milestones
    const displayMilestones = useMemo(() => {
        if (!realStatus?.schedule || realStatus.schedule.length === 0) return PLU_MILESTONES;

        const now = new Date().getTime();
        return realStatus.schedule.map((m: any, i: number) => {
            const milestoneTime = new Date(m.date).getTime();
            const createdTime = new Date(realStatus.lock.createdAt || now).getTime();
            const afterDays = Math.round((milestoneTime - createdTime) / 86400000);

            let status = 'pending';
            let completedDate = null;

            if (milestoneTime <= now) {
                status = 'completed';
                completedDate = new Date(m.date).toISOString().split('T')[0];
            } else if (i === 0 || new Date(realStatus.schedule[i - 1].date).getTime() <= now) {
                // This is the next active milestone
                status = 'active';
            }

            return {
                id: i + 1,
                condition: m.condition || `Milestone ${i + 1}`,
                percent: m.percent,
                afterDays: Math.max(0, afterDays),
                status: status as 'completed' | 'active' | 'pending',
                completedDate
            };
        });
    }, [realStatus]);

    // 2. Compute Lock Stats
    const totalLockPercent = realStatus ? realStatus.lock.totalLocked : 60;
    const totalUnlocked = realStatus
        ? realStatus.lock.unlockedPercent
        : displayMilestones.filter((m: { status: string; percent: number }) => m.status === 'completed').reduce((s: number, m: { status: string; percent: number }) => s + m.percent, 0);
    const textRemainingLocked = totalLockPercent - totalUnlocked;
    const remainingToUnlockChart = 100 - totalUnlocked; // for circulating math

    // 3. Compute Pie Chart Distribution
    const displayLockDist = useMemo(() => {
        if (!realStatus) return LOCK_DISTRIBUTION;

        const activeMilestone = displayMilestones.find((m: { status: string; percent: number }) => m.status === 'active')?.percent || 0;
        const pendingValue = textRemainingLocked - activeMilestone;
        const circulating = 100 - totalLockPercent;

        return [
            { name: 'Unlocked', value: totalUnlocked, color: '#4ade80' },
            { name: 'Active Milestone', value: activeMilestone, color: '#F0B90B' },
            { name: 'Pending', value: pendingValue, color: '#64748b' },
            { name: 'Circulating', value: circulating, color: '#a78bfa' },
        ].filter(d => d.value > 0);
    }, [realStatus, displayMilestones, totalUnlocked, textRemainingLocked, totalLockPercent]);

    // 4. Compute Unlock Schedule (Bar Chart)
    const displayUnlockSchedule = useMemo(() => {
        if (!realStatus?.schedule || realStatus.schedule.length === 0) return UNLOCK_SCHEDULE;

        let cumulative = 0;
        return realStatus.schedule.map((m: any, i: number) => {
            cumulative += m.percent;
            const createdTime = new Date(realStatus.lock.createdAt).getTime();
            const milestoneTime = new Date(m.date).getTime();
            const months = Math.max(1, Math.round((milestoneTime - createdTime) / (30 * 86400000)));

            return {
                month: `M${months}`,
                unlocked: cumulative,
                locked: totalLockPercent - cumulative
            };
        });
    }, [realStatus, totalLockPercent]);

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden relative transition-colors duration-300">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/4 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-gold/4 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-400 mb-4">
                            <Lock className="w-4 h-4" /> Proof of Liquidity Utility
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 transition-colors">
                            PLU{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                Dashboard
                            </span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors">
                            Track milestone-based liquidity unlocks. PLU ensures tokens are only released
                            when real project milestones are achieved — building trust with holders.
                        </p>
                    </div>

                    {/* Your Deployed Tokens */}
                    {mounted && isConnected && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2 transition-colors">
                                <Wallet className="w-4 h-4" /> Your Deployed Tokens
                            </h3>
                            {tokensLoading ? (
                                <div className="text-sm text-gray-400 text-center py-6">Loading your tokens...</div>
                            ) : deployedTokens.length === 0 ? (
                                <div className="text-sm text-gray-400 text-center py-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                                    No deployed tokens found. Deploy a token first from the <a href="/create" className="text-cyan-400 underline">Token Wizard</a>.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {deployedTokens.map((token: any) => (
                                        <button
                                            key={token.id}
                                            onClick={() => handleSelectToken(token)}
                                            className={`text-left p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${selectedToken?.id === token.id
                                                ? 'border-cyan-400 bg-cyan-500/5 ring-1 ring-cyan-400/30'
                                                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] hover:border-gray-300 dark:hover:border-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 flex items-center justify-center">
                                                    <Coins className="w-4 h-4 text-cyan-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate transition-colors">
                                                        {token.config?.tokenName || 'Unnamed Token'}
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-mono">
                                                        ${token.config?.tokenSymbol || 'TKN'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className={`px-2 py-0.5 rounded-full font-medium ${token.status === 'testnet'
                                                    ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'
                                                    }`}>
                                                    {token.status === 'testnet' ? 'Deployed' : 'Saved'}
                                                </span>
                                                <span className="text-gray-400 font-mono">
                                                    {token.testnet_address
                                                        ? `${token.testnet_address.slice(0, 6)}...${token.testnet_address.slice(-4)}`
                                                        : 'Not deployed'}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mb-10">
                        <p className="text-xs text-gray-400 text-center mb-2">Or search by Config ID</p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Paste Config ID..."
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                />
                            </div>
                            <button
                                onClick={() => handleSearch()}
                                disabled={loading}
                                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : 'Search'}
                            </button>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="max-w-md mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {errorMsg}
                        </div>
                    )}

                    {/* Real Data Banner (if fetched) */}
                    {realStatus && (
                        <div className={`mb-8 p-5 rounded-2xl border flex items-center justify-between
                            ${realStatus.unlockStatus === 'healthy' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' :
                                realStatus.unlockStatus === 'caution' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                                    'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Real-time PLU Oracle Status</h4>
                                    <p className="text-sm opacity-90">{realStatus.summary}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm opacity-80 mb-1">AI Health Score</div>
                                <div className="text-2xl font-black">{realStatus.healthScore}/100</div>
                            </div>
                        </div>
                    )}



                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Locked', value: `${totalLockPercent}%`, icon: <Lock className="w-5 h-5" />, color: 'text-cyan-400' },
                            { label: 'Unlocked', value: `${totalUnlocked}%`, icon: <Unlock className="w-5 h-5" />, color: 'text-green-400' },
                            { label: 'Remaining', value: `${textRemainingLocked}%`, icon: <Hourglass className="w-5 h-5" />, color: 'text-gold' },
                            { label: 'Milestones Met', value: `${displayMilestones.filter((m: any) => m.status === 'completed').length}/${displayMilestones.length}`, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-purple' },
                        ].map((stat: any, i: number) => (
                            <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 flex items-center gap-4 transition-colors">
                                <div className={`w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center ${stat.color} transition-colors`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hero Graphic & Main Progress */}
                    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-8 mb-8 transition-colors">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors flex items-center gap-2"><BarChart2 className="w-4 h-4 text-cyan-400" /> Unlock Progress</h3>
                        <div className="relative h-12 rounded-2xl bg-gray-100 dark:bg-gray-800/50 overflow-hidden flex transition-colors">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                                style={{ width: `${(totalUnlocked / totalLockPercent) * 100}%` }}
                            />
                            <div
                                className="h-full bg-gold/30 transition-all duration-700"
                                style={{ width: `${((displayMilestones.find((m: any) => m.status === 'active')?.percent || 0) / totalLockPercent) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span>0% (Fully Locked)</span>
                            <span className="text-green-400">{totalUnlocked}% Unlocked</span>
                            <span>{totalLockPercent}% (Total Lock)</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Milestones */}
                        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-8 transition-colors">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-6 transition-colors flex items-center gap-2"><Target className="w-4 h-4 text-red-500" /> Milestone Tracker</h3>
                            <div className="space-y-1">
                                {displayMilestones.map((m: any, i: number) => (
                                    <div
                                        key={m.id}
                                        className={`relative pl-10 pb-6 cursor-pointer group ${i === displayMilestones.length - 1 ? '' : ''
                                            }`}
                                        onClick={() => setSelectedMilestone(selectedMilestone === m.id ? null : m.id)}
                                    >
                                        {/* Vertical line */}
                                        {i < displayMilestones.length - 1 && (
                                            <div className={`absolute left-[14px] top-8 bottom-0 w-px transition-colors ${m.status === 'completed' ? 'bg-green-400/30' : 'bg-gray-200 dark:bg-gray-800'
                                                }`} />
                                        )}

                                        {/* Dot */}
                                        <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${m.status === 'completed'
                                            ? 'bg-green-400/20 text-green-400 border-2 border-green-400'
                                            : m.status === 'active'
                                                ? 'bg-gold/20 text-gold border-2 border-gold animate-pulse'
                                                : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-2 border-gray-300 dark:border-gray-700'
                                            }`}>
                                            {m.status === 'completed' ? '✓' : m.id}
                                        </div>

                                        {/* Content */}
                                        <div className={`rounded-xl p-4 transition-all ${selectedMilestone === m.id
                                            ? 'bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-gray-700'
                                            : 'group-hover:bg-gray-50 dark:group-hover:bg-white/[0.03] border border-transparent'
                                            }`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-sm font-medium transition-colors ${m.status === 'completed' ? 'text-green-400' : m.status === 'active' ? 'text-gold' : 'text-gray-600 dark:text-gray-300'
                                                    }`}>
                                                    {m.condition}
                                                </span>
                                                <span className="text-xs text-gray-400">+{m.percent}%</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span>Unlock after day {m.afterDays}</span>
                                                {m.status === 'completed' && m.completedDate && (
                                                    <span className="text-green-400/60">Completed {m.completedDate}</span>
                                                )}
                                                {m.status === 'active' && (
                                                    <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Allocation Pie */}
                        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-8 min-h-[400px] flex flex-col transition-colors">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors flex items-center gap-2"><PieChartIcon className="w-4 h-4 text-purple" /> Lock Distribution</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={displayLockDist}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {displayLockDist.map((entry: any, i: number) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: isDark ? 'rgba(15,15,30,0.95)' : 'rgba(255,255,255,0.95)',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            color: isDark ? '#fff' : '#000'
                                        }}
                                        formatter={(v: number) => [`${v}%`, 'Share']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-3">
                                {displayLockDist.map((d: any) => (
                                    <div key={d.name} className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                                            <span className="text-gray-600 dark:text-gray-400 transition-colors">{d.name}</span>
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-100 font-medium transition-colors">{d.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Unlock Schedule Chart */}
                    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-8 transition-colors">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors flex items-center gap-2"><Calendar className="w-4 h-4 text-gold" /> Unlock Schedule</h3>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={displayUnlockSchedule}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                                <XAxis dataKey="month" stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize={12} />
                                <YAxis stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize={11} tickFormatter={(v) => `${v}%`} />
                                <Tooltip
                                    contentStyle={{
                                        background: isDark ? 'rgba(15,15,30,0.95)' : 'rgba(255,255,255,0.95)',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        color: isDark ? '#fff' : '#000'
                                    }}
                                    formatter={(v: number) => [`${v}%`, '']}
                                />
                                <Bar dataKey="unlocked" name="Unlocked" fill="#4ade80" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="locked" name="Locked" fill="#64748b" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* PLU Trust Score */}
                    <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gold mb-2">PLU Trust Score: 8.5 / 10</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                                    This project has a <strong className="text-gray-900 dark:text-gray-100 transition-colors">high PLU trust score</strong>.
                                    60% of the supply is locked with milestone-based releases, 2 of 5 milestones have been
                                    completed on schedule, and 1 milestone is currently in progress. The gradual unlock
                                    schedule spanning 12 months demonstrates strong commitment to long-term value.
                                </p>
                                <div className="flex gap-3 mt-3">
                                    <div className="px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20 text-green-400 text-xs font-medium">
                                        ✓ On-Schedule Unlocks
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-medium">
                                        ✓ Audited Contract
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-purple/10 border border-purple/20 text-purple text-xs font-medium">
                                        ✓ Multi-sig Required
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
