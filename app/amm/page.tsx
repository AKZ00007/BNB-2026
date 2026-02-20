'use client';

import { useState, useMemo, useCallback } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
} from 'recharts';

/* ── Types ────────────────────────────────────────────────────────────────── */

type CurveType = 'linear' | 'exponential' | 'sigmoid' | 'flat';

interface AMMSettings {
    curveType: CurveType;
    initialPrice: number;
    buyTax: number;
    sellTax: number;
    taxSplit: { lp: number; treasury: number; burn: number; holders: number };
    maxWalletPercent: number;
    maxTxPercent: number;
    cooldownBlocks: number;
    initialLiquidityBnb: number;
    totalSupply: number;
}

/* ── Curve math ──────────────────────────────────────────────────────────── */

function computeCurve(type: CurveType, supply: number, maxSupply: number, basePrice: number) {
    const ratio = supply / maxSupply;
    switch (type) {
        case 'linear':
            return basePrice * (1 + ratio * 2);
        case 'exponential':
            return basePrice * Math.pow(1 + ratio, 3);
        case 'sigmoid':
            return basePrice * (1 + 2 / (1 + Math.exp(-8 * (ratio - 0.5))));
        case 'flat':
            return basePrice * (1 + ratio * 0.2);
    }
}

function generateCurveData(type: CurveType, basePrice: number, totalSupply: number) {
    const points = 100;
    return Array.from({ length: points + 1 }, (_, i) => {
        const supply = (i / points) * totalSupply;
        return {
            supply: Math.round(supply / 1_000_000),
            price: +computeCurve(type, supply, totalSupply, basePrice).toFixed(6),
        };
    });
}

function generateImpactData(
    type: CurveType,
    basePrice: number,
    totalSupply: number,
    buyTax: number,
    sellTax: number
) {
    // Simulates buy/sell pressure impact at different volumes
    const volumes = [1, 2, 5, 10, 20, 50]; // % of supply
    return volumes.map((vol) => {
        const supplyBought = totalSupply * (vol / 100);
        const priceAfterBuy = computeCurve(type, supplyBought, totalSupply, basePrice);
        const buyImpact = ((priceAfterBuy - basePrice) / basePrice) * 100;
        const sellImpact = buyImpact * -0.6; // simplified sell pressure
        return {
            volume: `${vol}%`,
            buyImpact: +(buyImpact * (1 - buyTax / 100)).toFixed(2),
            sellImpact: +(sellImpact * (1 + sellTax / 100)).toFixed(2),
        };
    });
}

/* ── Slider component ────────────────────────────────────────────────────── */

function SliderField({
    label,
    value,
    min,
    max,
    step,
    unit,
    color,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    color: string;
    onChange: (v: number) => void;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">{label}</span>
                <span className={`text-sm font-bold ${color}`}>
                    {value}
                    {unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(+e.target.value)}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-gold bg-white/10"
            />
        </div>
    );
}

/* ── Curve Selector ──────────────────────────────────────────────────────── */

const CURVES: { type: CurveType; icon: string; desc: string }[] = [
    { type: 'linear', icon: '📈', desc: 'Steady price increase proportional to supply sold' },
    { type: 'exponential', icon: '🚀', desc: 'Rapid price acceleration as supply sells out' },
    { type: 'sigmoid', icon: '📐', desc: 'Slow start, fast middle, plateaus at high supply' },
    { type: 'flat', icon: '➡️', desc: 'Nearly stable price, minimal supply impact' },
];

/* ── Main Component ──────────────────────────────────────────────────────── */

export default function AMMPage() {
    const [settings, setSettings] = useState<AMMSettings>({
        curveType: 'linear',
        initialPrice: 0.001,
        buyTax: 2,
        sellTax: 4,
        taxSplit: { lp: 40, treasury: 30, burn: 20, holders: 10 },
        maxWalletPercent: 2,
        maxTxPercent: 1,
        cooldownBlocks: 3,
        initialLiquidityBnb: 10,
        totalSupply: 1_000_000_000,
    });

    const update = useCallback(
        <K extends keyof AMMSettings>(key: K, value: AMMSettings[K]) =>
            setSettings((s) => ({ ...s, [key]: value })),
        []
    );

    const updateTaxSplit = useCallback(
        (key: keyof AMMSettings['taxSplit'], value: number) =>
            setSettings((s) => ({
                ...s,
                taxSplit: { ...s.taxSplit, [key]: value },
            })),
        []
    );

    const curveData = useMemo(
        () => generateCurveData(settings.curveType, settings.initialPrice, settings.totalSupply),
        [settings.curveType, settings.initialPrice, settings.totalSupply]
    );

    const impactData = useMemo(
        () =>
            generateImpactData(
                settings.curveType,
                settings.initialPrice,
                settings.totalSupply,
                settings.buyTax,
                settings.sellTax
            ),
        [settings.curveType, settings.initialPrice, settings.totalSupply, settings.buyTax, settings.sellTax]
    );

    // Normalize tax split to 100%
    const taxTotal = settings.taxSplit.lp + settings.taxSplit.treasury + settings.taxSplit.burn + settings.taxSplit.holders;

    return (
        <main className="min-h-screen bg-bg-base text-text-primary overflow-hidden relative">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-gold/4 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple/6 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-sm text-gold mb-4">
                            ⚙️ AMM Customization
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                            Design Your Token&apos;s{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-purple">
                                Trading Mechanics
                            </span>
                        </h1>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Configure bonding curves, fee structures, and anti-whale protections.
                            Preview how price reacts to buy/sell pressure before you deploy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ── Left Column: Controls ── */}
                        <div className="space-y-6">
                            {/* Bonding Curve Selector */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                <h3 className="text-sm font-semibold text-text-primary mb-4">📈 Bonding Curve</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {CURVES.map((c) => (
                                        <button
                                            key={c.type}
                                            onClick={() => update('curveType', c.type)}
                                            className={`p-3 rounded-xl text-left transition-all ${settings.curveType === c.type
                                                    ? 'bg-gold/15 border border-gold/40 shadow-lg shadow-gold/5'
                                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="text-lg mb-1">{c.icon}</div>
                                            <div className="text-xs font-semibold capitalize text-text-primary">
                                                {c.type}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-text-tertiary mt-3">
                                    {CURVES.find((c) => c.type === settings.curveType)?.desc}
                                </p>
                            </div>

                            {/* Tax Configuration */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-text-primary">💰 Tax Configuration</h3>
                                <SliderField
                                    label="Buy Tax"
                                    value={settings.buyTax}
                                    min={0}
                                    max={10}
                                    step={0.5}
                                    unit="%"
                                    color="text-green-400"
                                    onChange={(v) => update('buyTax', v)}
                                />
                                <SliderField
                                    label="Sell Tax"
                                    value={settings.sellTax}
                                    min={0}
                                    max={10}
                                    step={0.5}
                                    unit="%"
                                    color="text-red-400"
                                    onChange={(v) => update('sellTax', v)}
                                />

                                {/* Tax Split */}
                                <div className="pt-3 border-t border-white/5">
                                    <div className="text-xs text-text-tertiary mb-3">
                                        Tax Allocation Split{' '}
                                        <span className={taxTotal !== 100 ? 'text-red-400' : 'text-green-400'}>
                                            ({taxTotal}%)
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        {(
                                            [
                                                { key: 'lp', label: '🔄 LP', color: 'text-blue-400' },
                                                { key: 'treasury', label: '🏦 Treasury', color: 'text-gold' },
                                                { key: 'burn', label: '🔥 Burn', color: 'text-orange-400' },
                                                { key: 'holders', label: '👥 Holders', color: 'text-purple' },
                                            ] as const
                                        ).map((item) => (
                                            <div key={item.key} className="bg-white/5 rounded-lg p-2">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-text-tertiary">{item.label}</span>
                                                    <span className={item.color}>{settings.taxSplit[item.key]}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={100}
                                                    step={5}
                                                    value={settings.taxSplit[item.key]}
                                                    onChange={(e) => updateTaxSplit(item.key, +e.target.value)}
                                                    className="w-full h-1 rounded-full appearance-none cursor-pointer accent-gold bg-white/10"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Anti-Whale Controls */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-text-primary">🐋 Anti-Whale Protection</h3>
                                <SliderField
                                    label="Max Wallet"
                                    value={settings.maxWalletPercent}
                                    min={0.5}
                                    max={10}
                                    step={0.5}
                                    unit="% of supply"
                                    color="text-cyan-400"
                                    onChange={(v) => update('maxWalletPercent', v)}
                                />
                                <SliderField
                                    label="Max Transaction"
                                    value={settings.maxTxPercent}
                                    min={0.1}
                                    max={5}
                                    step={0.1}
                                    unit="% of supply"
                                    color="text-cyan-400"
                                    onChange={(v) => update('maxTxPercent', v)}
                                />
                                <SliderField
                                    label="Cooldown"
                                    value={settings.cooldownBlocks}
                                    min={0}
                                    max={10}
                                    step={1}
                                    unit=" blocks"
                                    color="text-amber-400"
                                    onChange={(v) => update('cooldownBlocks', v)}
                                />
                            </div>

                            {/* Liquidity Settings */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-text-primary">💧 Initial Liquidity</h3>
                                <SliderField
                                    label="Initial Price"
                                    value={settings.initialPrice}
                                    min={0.0001}
                                    max={0.01}
                                    step={0.0001}
                                    unit=" BNB"
                                    color="text-gold"
                                    onChange={(v) => update('initialPrice', v)}
                                />
                                <SliderField
                                    label="Paired BNB"
                                    value={settings.initialLiquidityBnb}
                                    min={1}
                                    max={100}
                                    step={1}
                                    unit=" BNB"
                                    color="text-gold"
                                    onChange={(v) => update('initialLiquidityBnb', v)}
                                />
                                <div className="bg-gold/5 border border-gold/10 rounded-lg p-3 text-xs text-text-secondary">
                                    💡 Starting market cap:{' '}
                                    <strong className="text-gold">
                                        {(settings.initialPrice * settings.totalSupply).toLocaleString()} BNB
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* ── Right Column: Charts ── */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Bonding Curve Chart */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-text-primary">
                                        Price vs. Supply — {settings.curveType.charAt(0).toUpperCase() + settings.curveType.slice(1)} Curve
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                                        <span className="w-3 h-3 rounded-full bg-gold" /> Price (BNB)
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={curveData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis
                                            dataKey="supply"
                                            stroke="rgba(255,255,255,0.3)"
                                            fontSize={11}
                                            tickFormatter={(v) => `${v}M`}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.3)"
                                            fontSize={11}
                                            tickFormatter={(v) => v.toFixed(4)}
                                            width={65}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(15,15,30,0.95)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                            }}
                                            formatter={(value: number) => [`${value.toFixed(6)} BNB`, 'Price']}
                                            labelFormatter={(label) => `Supply: ${label}M tokens`}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#F0B90B"
                                            strokeWidth={2.5}
                                            dot={false}
                                            activeDot={{ fill: '#F0B90B', r: 5, stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Buy/Sell Impact Simulation */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-text-primary">
                                        📊 Buy / Sell Price Impact
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                                        <span className="flex items-center gap-1">
                                            <span className="w-3 h-3 rounded-full bg-green-400" /> Buy Impact
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-3 h-3 rounded-full bg-red-400" /> Sell Impact
                                        </span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={impactData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="volume" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.3)"
                                            fontSize={11}
                                            tickFormatter={(v) => `${v}%`}
                                            width={50}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(15,15,30,0.95)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                            }}
                                            formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
                                            labelFormatter={(label) => `Trade Volume: ${label} of supply`}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                                        <Bar dataKey="buyImpact" name="Buy Impact" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                        <Bar
                                            dataKey="sellImpact"
                                            name="Sell Impact"
                                            fill="#f87171"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    {
                                        label: 'Starting Price',
                                        value: `${settings.initialPrice} BNB`,
                                        icon: '💰',
                                        color: 'text-gold',
                                    },
                                    {
                                        label: 'Curve Type',
                                        value: settings.curveType,
                                        icon: '📈',
                                        color: 'text-purple',
                                    },
                                    {
                                        label: 'Total Tax',
                                        value: `${settings.buyTax}% / ${settings.sellTax}%`,
                                        icon: '💸',
                                        color: 'text-amber-400',
                                    },
                                    {
                                        label: 'Max Wallet',
                                        value: `${settings.maxWalletPercent}%`,
                                        icon: '🐋',
                                        color: 'text-cyan-400',
                                    },
                                ].map((card) => (
                                    <div
                                        key={card.label}
                                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center"
                                    >
                                        <div className="text-xl mb-1">{card.icon}</div>
                                        <div className="text-xs text-text-tertiary mb-1">{card.label}</div>
                                        <div className={`text-sm font-bold capitalize ${card.color}`}>{card.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* AI Recommendation */}
                            <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-xl flex-shrink-0">
                                        🤖
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gold mb-2">AI Recommendation</h4>
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            Based on similar BSC launches, we recommend a{' '}
                                            <strong className="text-text-primary">linear bonding curve</strong> with{' '}
                                            <strong className="text-text-primary">2% buy / 4% sell tax</strong> and a{' '}
                                            <strong className="text-text-primary">2% max wallet limit</strong>. This
                                            configuration provides moderate price stability while discouraging large dumps.
                                            The sell tax premium helps build the LP over time.
                                        </p>
                                        <button
                                            onClick={() => {
                                                update('curveType', 'linear');
                                                update('buyTax', 2);
                                                update('sellTax', 4);
                                                update('maxWalletPercent', 2);
                                                update('maxTxPercent', 1);
                                                update('cooldownBlocks', 3);
                                            }}
                                            className="mt-3 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/20 transition-colors"
                                        >
                                            ✨ Apply Recommended Settings
                                        </button>
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
