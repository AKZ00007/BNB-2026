'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TokenConfig } from '@/types/config';

interface TokenDistributionChartProps {
    config: TokenConfig;
}

const COLORS = [
    '#F0B90B', '#8B5CF6', '#22C55E', '#3B82F6',
    '#F59E0B', '#EF4444', '#06B6D4', '#EC4899',
];

const RADIAN = Math.PI / 180;

function renderCustomLabel({
    cx, cy, midAngle, innerRadius, outerRadius, percent,
}: any) {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontWeight={600}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

export function TokenDistributionChart({ config }: TokenDistributionChartProps) {
    const data = config.vesting.map((v) => ({ name: v.label, value: v.percent }));

    return (
        <div className="glass-card-prominent rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-1">Token Distribution</h3>
            <p className="text-text-secondary text-sm mb-4">Allocation breakdown</p>

            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomLabel}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(0,0,0,0.3)" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(26,26,34,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '12px',
                        }}
                        formatter={(v: number) => [`${v}%`]}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-1.5 mt-2">
                {data.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="truncate">{item.name}</span>
                        <span className="ml-auto text-text-primary font-medium">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
