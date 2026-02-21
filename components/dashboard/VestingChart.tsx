'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { useMemo } from 'react';
import type { TokenConfig } from '@/types/config';

interface VestingChartProps {
    config: TokenConfig;
}

const COLORS = [
    '#F0B90B', '#8B5CF6', '#22C55E', '#3B82F6',
    '#F59E0B', '#EF4444', '#06B6D4', '#EC4899',
];

export function VestingChart({ config }: VestingChartProps) {
    // Build monthly cumulative unlock per allocation
    const MONTHS = 24;

    const data = useMemo(() => {
        const months = Array.from({ length: MONTHS + 1 }, (_, m) => {
            const row: Record<string, number | string> = { month: `M${m}` };
            for (const vest of config.vesting) {
                let unlocked = 0;
                if (m === 0) {
                    unlocked = vest.percent * (vest.tgePercent / 100);
                } else if (m >= vest.cliffMonths) {
                    const monthsVested = Math.min(m - vest.cliffMonths, vest.vestingMonths);
                    const vestFrac =
                        vest.vestingMonths > 0 ? monthsVested / vest.vestingMonths : 1;
                    unlocked =
                        vest.percent * (vest.tgePercent / 100) +
                        vest.percent * (1 - vest.tgePercent / 100) * vestFrac;
                } else {
                    unlocked = vest.percent * (vest.tgePercent / 100);
                }
                row[vest.label] = parseFloat(unlocked.toFixed(2));
            }
            return row;
        });
        return months;
    }, [config.vesting]);

    return (
        <div className="glass-card-prominent rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Vesting Timeline</h3>
            <p className="text-gray-600 text-sm mb-6">Cumulative % unlocked per allocation</p>

            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="month"
                        stroke="#71717A"
                        tick={{ fontSize: 10 }}
                        interval={2}
                    />
                    <YAxis
                        stroke="#71717A"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => `${v}%`}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(26,26,34,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '12px',
                        }}
                        formatter={(v: number, name: string) => [`${v.toFixed(1)}%`, name]}
                    />
                    {config.vesting.map((vest, i) => (
                        <Bar key={vest.label} dataKey={vest.label} stackId="a" fill={COLORS[i % COLORS.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-4">
                {config.vesting.map((vest, i) => (
                    <span
                        key={vest.label}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs text-gray-600 bg-white border border-gray-200"
                    >
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: COLORS[i % COLORS.length] }}
                        />
                        {vest.label} ({vest.percent}%)
                    </span>
                ))}
            </div>
        </div>
    );
}
