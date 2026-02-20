'use client';

import { useState } from 'react';
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
    const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

    const totalLockPercent = 60;
    const totalUnlocked = PLU_MILESTONES.filter((m) => m.status === 'completed').reduce((s, m) => s + m.percent, 0);
    const remainingLocked = totalLockPercent - totalUnlocked;

    return (
        <main className="min-h-screen bg-bg-base text-text-primary overflow-hidden relative">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/4 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-gold/4 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-sm text-cyan-400 mb-4">
                            🔒 Proof of Liquidity Utility
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                            PLU{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                Dashboard
                            </span>
                        </h1>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Track milestone-based liquidity unlocks. PLU ensures tokens are only released
                            when real project milestones are achieved — building trust with holders.
                        </p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Locked', value: `${totalLockPercent}%`, icon: '🔒', color: 'text-cyan-400' },
                            { label: 'Unlocked', value: `${totalUnlocked}%`, icon: '🔓', color: 'text-green-400' },
                            { label: 'Remaining', value: `${remainingLocked}%`, icon: '⏳', color: 'text-gold' },
                            { label: 'Milestones Met', value: `${PLU_MILESTONES.filter((m) => m.status === 'completed').length}/${PLU_MILESTONES.length}`, icon: '✅', color: 'text-purple' },
                        ].map((m) => (
                            <div key={m.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">
                                <div className="text-xl mb-2">{m.icon}</div>
                                <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                                <div className="text-xs text-text-tertiary mt-1">{m.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Lock Progress Bar */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-8">
                        <h3 className="text-sm font-semibold text-text-primary mb-4">📊 Unlock Progress</h3>
                        <div className="h-6 rounded-full bg-white/5 overflow-hidden flex">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                                style={{ width: `${(totalUnlocked / totalLockPercent) * 100}%` }}
                            />
                            <div
                                className="h-full bg-gold/30 transition-all duration-700"
                                style={{ width: `${(10 / totalLockPercent) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-text-tertiary">
                            <span>0% (Fully Locked)</span>
                            <span className="text-green-400">{totalUnlocked}% Unlocked</span>
                            <span>{totalLockPercent}% (Total Lock)</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                        {/* Milestones Timeline */}
                        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                            <h3 className="text-sm font-semibold text-text-primary mb-6">🎯 Milestone Tracker</h3>
                            <div className="space-y-1">
                                {PLU_MILESTONES.map((m, i) => (
                                    <div
                                        key={m.id}
                                        className={`relative pl-10 pb-6 cursor-pointer group ${i === PLU_MILESTONES.length - 1 ? '' : ''
                                            }`}
                                        onClick={() => setSelectedMilestone(selectedMilestone === m.id ? null : m.id)}
                                    >
                                        {/* Vertical line */}
                                        {i < PLU_MILESTONES.length - 1 && (
                                            <div className={`absolute left-[14px] top-8 bottom-0 w-px ${m.status === 'completed' ? 'bg-green-400/30' : 'bg-white/10'
                                                }`} />
                                        )}

                                        {/* Dot */}
                                        <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${m.status === 'completed'
                                                ? 'bg-green-400/20 text-green-400 border-2 border-green-400'
                                                : m.status === 'active'
                                                    ? 'bg-gold/20 text-gold border-2 border-gold animate-pulse'
                                                    : 'bg-white/5 text-text-tertiary border-2 border-white/20'
                                            }`}>
                                            {m.status === 'completed' ? '✓' : m.id}
                                        </div>

                                        {/* Content */}
                                        <div className={`rounded-xl p-4 transition-all ${selectedMilestone === m.id
                                                ? 'bg-white/[0.06] border border-white/10'
                                                : 'group-hover:bg-white/[0.03]'
                                            }`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-sm font-medium ${m.status === 'completed' ? 'text-green-400' : m.status === 'active' ? 'text-gold' : 'text-text-secondary'
                                                    }`}>
                                                    {m.condition}
                                                </span>
                                                <span className="text-xs text-text-tertiary">+{m.percent}%</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-text-tertiary">
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

                        {/* Pie Chart */}
                        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                            <h3 className="text-sm font-semibold text-text-primary mb-4">🥧 Lock Distribution</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={LOCK_DISTRIBUTION}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {LOCK_DISTRIBUTION.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                        formatter={(v: number) => [`${v}%`, 'Share']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-3">
                                {LOCK_DISTRIBUTION.map((d) => (
                                    <div key={d.name} className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                                            <span className="text-text-secondary">{d.name}</span>
                                        </span>
                                        <span className="text-text-primary font-medium">{d.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Unlock Schedule Chart */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-8">
                        <h3 className="text-sm font-semibold text-text-primary mb-4">📅 Unlock Schedule</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={UNLOCK_SCHEDULE}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickFormatter={(v) => `${v}%`} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                    formatter={(v: number) => [`${v}%`, '']}
                                />
                                <Bar dataKey="unlocked" name="Unlocked" fill="#4ade80" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="locked" name="Locked" fill="#64748b" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* PLU Trust Score */}
                    <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl flex-shrink-0">
                                🛡️
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gold mb-2">PLU Trust Score: 8.5 / 10</h4>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    This project has a <strong className="text-text-primary">high PLU trust score</strong>.
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
