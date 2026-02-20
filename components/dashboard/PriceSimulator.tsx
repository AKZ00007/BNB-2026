'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { generatePriceScenarios } from '@/lib/simulation';
import type { TokenConfig } from '@/types/config';

interface PriceSimulatorProps {
    config: TokenConfig;
}

const SCENARIO_META = [
    { key: 'good', label: 'Good (+50%)', color: '#22C55E', Icon: TrendingUp },
    { key: 'normal', label: 'Normal (Stable)', color: '#F0B90B', Icon: Minus },
    { key: 'bad', label: 'Bad (−30%)', color: '#EF4444', Icon: TrendingDown },
] as const;

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-card-prominent rounded-xl p-3 text-sm border border-white/10">
            <p className="text-text-secondary mb-1">Day {label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
                    {p.name}: {p.value.toFixed(3)}x
                </p>
            ))}
        </div>
    );
}

export function PriceSimulator({ config }: PriceSimulatorProps) {
    const [horizon, setHorizon] = useState<30 | 90>(90);
    const [hidden, setHidden] = useState<Set<string>>(new Set());

    const { points, initialPrice, peakGood, floorBad } = useMemo(
        () => generatePriceScenarios(config, 90),
        [config]
    );

    const displayPoints = horizon === 30 ? points.slice(0, 31) : points;

    const toggleScenario = (key: string) => {
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    return (
        <div className="glass-card-prominent rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">Price Simulation</h3>
                    <p className="text-text-secondary text-sm mt-0.5">
                        Est. initial price:{' '}
                        <span className="text-gold font-medium">
                            ${initialPrice < 0.01 ? initialPrice.toFixed(6) : initialPrice.toFixed(4)}
                        </span>
                    </p>
                </div>

                {/* Horizon toggle */}
                <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
                    {([30, 90] as const).map((h) => (
                        <button
                            key={h}
                            onClick={() => setHorizon(h)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${horizon === h
                                    ? 'bg-gold text-bg-base'
                                    : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {h}d
                        </button>
                    ))}
                </div>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-sm">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Peak Good: {((peakGood - 1) * 100).toFixed(0)}%
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-error/10 border border-error/20 text-error text-sm">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Floor Bad: −{((1 - floorBad) * 100).toFixed(0)}%
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={displayPoints} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="day"
                        stroke="#71717A"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(d) => `D${d}`}
                    />
                    <YAxis
                        stroke="#71717A"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `${v.toFixed(1)}x`}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {SCENARIO_META.map(({ key, label, color }) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            name={label}
                            stroke={color}
                            strokeWidth={hidden.has(key) ? 0 : 2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* Legend toggles */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {SCENARIO_META.map(({ key, label, color, Icon }) => (
                    <button
                        key={key}
                        onClick={() => toggleScenario(key)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${hidden.has(key)
                                ? 'border-white/10 text-text-tertiary bg-transparent opacity-40'
                                : 'border-white/20 text-text-primary bg-white/5'
                            }`}
                    >
                        <span className="w-3 h-0.5 rounded-full" style={{ background: color }} />
                        <Icon className="w-3 h-3" style={{ color }} />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
