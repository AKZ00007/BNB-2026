'use client';

import { useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts';

/* ── Mock data generators ────────────────────────────────────────────────── */

function generatePriceHistory(days: number) {
    let price = 0.0015;
    return Array.from({ length: days }, (_, i) => {
        const change = (Math.random() - 0.45) * 0.0002;
        price = Math.max(0.0005, price + change);
        return {
            day: `Day ${i + 1}`,
            price: +price.toFixed(6),
        };
    });
}

function generateHolderTrend(days: number) {
    let holders = 85;
    return Array.from({ length: days }, (_, i) => {
        holders += Math.floor(Math.random() * 15) + 2;
        return {
            day: `Day ${i + 1}`,
            holders,
            newHolders: Math.floor(Math.random() * 12) + 3,
        };
    });
}

const TOP_HOLDERS = [
    { rank: 1, address: '0x7a25...f3e1', balance: '12,500,000', percent: 2.5, tag: 'LP Pool' },
    { rank: 2, address: '0x9b3c...a8d2', balance: '8,750,000', percent: 1.75, tag: 'Team (Locked)' },
    { rank: 3, address: '0x4f1e...c9b3', balance: '6,200,000', percent: 1.24, tag: '' },
    { rank: 4, address: '0xd2a7...8f4e', balance: '5,100,000', percent: 1.02, tag: '' },
    { rank: 5, address: '0x1c8b...e5a9', balance: '4,300,000', percent: 0.86, tag: '' },
    { rank: 6, address: '0xe6f3...b2c1', balance: '3,800,000', percent: 0.76, tag: 'Staking' },
    { rank: 7, address: '0x83d9...f7a4', balance: '3,200,000', percent: 0.64, tag: '' },
    { rank: 8, address: '0xa5b2...d1e8', balance: '2,900,000', percent: 0.58, tag: '' },
    { rank: 9, address: '0x2f7c...a3b6', balance: '2,400,000', percent: 0.48, tag: '' },
    { rank: 10, address: '0x6e1d...c8f2', balance: '2,100,000', percent: 0.42, tag: '' },
];

const HOLDER_DISTRIBUTION = [
    { name: '1–1K tokens', value: 45, color: '#4ade80' },
    { name: '1K–10K', value: 28, color: '#38bdf8' },
    { name: '10K–100K', value: 15, color: '#a78bfa' },
    { name: '100K–1M', value: 8, color: '#F0B90B' },
    { name: '1M+', value: 4, color: '#f87171' },
];

/* ── Stat Card ───────────────────────────────────────────────────────────── */

function StatCard({
    icon,
    label,
    value,
    change,
    changePositive,
}: {
    icon: string;
    label: string;
    value: string;
    change: string;
    changePositive: boolean;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl">
                    {icon}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <div className={`text-xs font-medium ${changePositive ? 'text-green-400' : 'text-red-400'}`}>
                {changePositive ? '↑' : '↓'} {change}
            </div>
        </div>
    );
}

/* ── Scheduler Card ──────────────────────────────────────────────────────── */

function SchedulerCard({
    icon,
    title,
    description,
    fields,
    buttonLabel,
    buttonColor,
}: {
    icon: string;
    title: string;
    description: string;
    fields: { label: string; placeholder: string; type?: string }[];
    buttonLabel: string;
    buttonColor: string;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{icon}</span>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">{description}</p>
            <div className="space-y-3">
                {fields.map((f) => (
                    <div key={f.label}>
                        <label className="text-xs text-gray-600 mb-1 block">{f.label}</label>
                        <input
                            type={f.type || 'text'}
                            placeholder={f.placeholder}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gold/30 transition-colors"
                        />
                    </div>
                ))}
            </div>
            <button
                className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${buttonColor}`}
            >
                {buttonLabel}
            </button>
        </div>
    );
}

/* ── Alert Card ──────────────────────────────────────────────────────────── */

function AlertItem({
    label,
    condition,
    active,
    onToggle,
}: {
    label: string;
    condition: string;
    active: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
            <div>
                <div className="text-sm text-gray-900">{label}</div>
                <div className="text-xs text-gray-400">{condition}</div>
            </div>
            <button
                onClick={onToggle}
                className={`w-10 h-5 rounded-full transition-colors relative ${active ? 'bg-gold' : 'bg-gray-100'
                    }`}
            >
                <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                />
            </button>
        </div>
    );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */

export default function GrowthPage() {
    const [timeRange, setTimeRange] = useState<30 | 60 | 90>(30);
    const [alerts, setAlerts] = useState({
        holders: true,
        price: true,
        volume: false,
        whale: true,
    });

    const priceData = useMemo(() => generatePriceHistory(timeRange), [timeRange]);
    const holderData = useMemo(() => generateHolderTrend(timeRange), [timeRange]);

    const toggleAlert = (key: keyof typeof alerts) =>
        setAlerts((a) => ({ ...a, [key]: !a[key] }));

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-gray-900 overflow-hidden relative">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-green-500/3 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple/6 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-400/10 border border-green-400/20 text-sm text-green-400 mb-4">
                            🌱 Post-Launch Growth
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                            Grow Your Token{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                                After Launch
                            </span>
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Real-time analytics, holder growth tools, automated buyback mechanisms,
                            and community incentive programs — all in one dashboard.
                        </p>
                    </div>

                    {/* Time Range Selector */}
                    <div className="flex justify-center gap-2 mb-8">
                        {([30, 60, 90] as const).map((d) => (
                            <button
                                key={d}
                                onClick={() => setTimeRange(d)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === d
                                        ? 'bg-gold/20 border border-gold/40 text-gold'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {d}D
                            </button>
                        ))}
                    </div>

                    {/* Live Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard icon="💰" label="Price" value="0.00187 BNB" change="12.3% (7d)" changePositive />
                        <StatCard icon="📊" label="Market Cap" value="$1.87M" change="8.5% (7d)" changePositive />
                        <StatCard icon="👥" label="Holders" value="1,247" change="+83 (7d)" changePositive />
                        <StatCard icon="📈" label="24h Volume" value="$47.2K" change="3.1% (24h)" changePositive={false} />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Price Chart */}
                        <div className="rounded-2xl border border-gray-200 bg-white/[0.03] p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">💰 Price History</h3>
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={priceData}>
                                    <defs>
                                        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#F0B90B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} interval={Math.floor(timeRange / 6)} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(v) => v.toFixed(4)} width={55} />
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                        formatter={(v: number) => [`${v.toFixed(6)} BNB`, 'Price']}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#F0B90B" strokeWidth={2} fill="url(#priceGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Holder Growth Chart */}
                        <div className="rounded-2xl border border-gray-200 bg-white/[0.03] p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">👥 Holder Growth</h3>
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={holderData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} interval={Math.floor(timeRange / 6)} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} width={45} />
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                    />
                                    <Line type="monotone" dataKey="holders" stroke="#4ade80" strokeWidth={2} dot={false} name="Total Holders" />
                                    <Line type="monotone" dataKey="newHolders" stroke="#a78bfa" strokeWidth={1.5} dot={false} name="New / Day" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Holder Analytics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Wallet Distribution Pie */}
                        <div className="rounded-2xl border border-gray-200 bg-white/[0.03] p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">🥧 Wallet Distribution</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={HOLDER_DISTRIBUTION}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {HOLDER_DISTRIBUTION.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                        formatter={(v: number) => [`${v}%`, 'Share']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {HOLDER_DISTRIBUTION.map((d) => (
                                    <span key={d.name} className="text-xs flex items-center gap-1 text-gray-400">
                                        <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                                        {d.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Top Holders Table */}
                        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white/[0.03] p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">🏆 Top 10 Holders</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-400 text-xs border-b border-white/5">
                                            <th className="text-left py-2 font-medium">#</th>
                                            <th className="text-left py-2 font-medium">Address</th>
                                            <th className="text-right py-2 font-medium">Balance</th>
                                            <th className="text-right py-2 font-medium">%</th>
                                            <th className="text-right py-2 font-medium">Tag</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TOP_HOLDERS.map((h) => (
                                            <tr key={h.rank} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                                <td className="py-2.5 text-gray-400">{h.rank}</td>
                                                <td className="py-2.5 font-mono text-gray-900">{h.address}</td>
                                                <td className="py-2.5 text-right text-gray-600">{h.balance}</td>
                                                <td className="py-2.5 text-right text-gold">{h.percent}%</td>
                                                <td className="py-2.5 text-right">
                                                    {h.tag && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs bg-white text-gray-400">
                                                            {h.tag}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Growth Tools Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <SchedulerCard
                            icon="🔄"
                            title="Automated Buyback"
                            description="Configure treasury-funded buybacks triggered by price drops"
                            fields={[
                                { label: 'Treasury Wallet', placeholder: '0x...' },
                                { label: 'Trigger (% price drop)', placeholder: '10', type: 'number' },
                                { label: 'Buyback Amount (BNB)', placeholder: '0.5', type: 'number' },
                            ]}
                            buttonLabel="💰 Enable Buyback"
                            buttonColor="bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20"
                        />
                        <SchedulerCard
                            icon="🎁"
                            title="Airdrop Scheduler"
                            description="Distribute tokens to holders on a scheduled basis"
                            fields={[
                                { label: 'CSV Address List', placeholder: 'Upload or paste addresses' },
                                { label: 'Tokens per Address', placeholder: '1000', type: 'number' },
                                { label: 'Distribution Date', placeholder: 'YYYY-MM-DD', type: 'date' },
                            ]}
                            buttonLabel="🎁 Schedule Airdrop"
                            buttonColor="bg-purple/10 text-purple border border-purple/20 hover:bg-purple/20"
                        />
                        <SchedulerCard
                            icon="🔥"
                            title="Token Burn Scheduler"
                            description="Configure periodic burns from a designated wallet"
                            fields={[
                                { label: 'Burn Wallet', placeholder: '0x...' },
                                { label: 'Burn Amount per Period', placeholder: '500000', type: 'number' },
                                { label: 'Period (days)', placeholder: '30', type: 'number' },
                            ]}
                            buttonLabel="🔥 Schedule Burns"
                            buttonColor="bg-orange-400/10 text-orange-400 border border-orange-400/20 hover:bg-orange-400/20"
                        />
                    </div>

                    {/* Growth Alerts */}
                    <div className="rounded-2xl border border-gray-200 bg-white/[0.03] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">🔔 Growth Alerts</h3>
                            <span className="text-xs text-gray-400">
                                {Object.values(alerts).filter(Boolean).length} active
                            </span>
                        </div>
                        <AlertItem
                            label="Holder Milestone"
                            condition="Notify when holders reach 2,000"
                            active={alerts.holders}
                            onToggle={() => toggleAlert('holders')}
                        />
                        <AlertItem
                            label="Price Target"
                            condition="Notify when price crosses 0.003 BNB"
                            active={alerts.price}
                            onToggle={() => toggleAlert('price')}
                        />
                        <AlertItem
                            label="Volume Spike"
                            condition="Notify when 24h volume exceeds $100K"
                            active={alerts.volume}
                            onToggle={() => toggleAlert('volume')}
                        />
                        <AlertItem
                            label="Whale Alert"
                            condition="Notify when a single wallet buys >1% supply"
                            active={alerts.whale}
                            onToggle={() => toggleAlert('whale')}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
