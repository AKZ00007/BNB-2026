'use client';

import { useState } from 'react';
import { TokenConfig, VestingEntry } from '@/types/config';

interface VestingBarProps {
    teams: VestingEntry[];
}

// Map team roles to specific colors matching the dark theme layout
const ROLE_COLORS: Record<string, string> = {
    'Core Team': '#8B5CF6',     // Purple
    'Advisors': '#F0B90B',      // Gold
    'Community/Airdrop': '#10B981', // Green
    'Liquidity': '#3B82F6',     // Blue
    'Treasury': '#F43F5E',      // Rose
    'Marketing': '#EC4899',     // Pink
};

const DEFAULT_COLOR = '#6B7280'; // Gray

export function VestingBar({ teams }: VestingBarProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Filter out 0% allocations just in case
    const activeTeams = teams.filter(t => t.percent > 0);

    return (
        <div className="w-full flex flex-col gap-4">
            {/* The Horizontal Bar */}
            <div className="relative h-6 w-full bg-slate-200 dark:bg-[#1F2937] rounded-full overflow-hidden flex shadow-inner">
                {activeTeams.map((team: VestingEntry, index: number) => {
                    const color = ROLE_COLORS[team.label] || DEFAULT_COLOR;
                    const isHovered = hoveredIndex === index;
                    const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

                    return (
                        <div
                            key={index}
                            className="h-full transition-all duration-300 relative group cursor-pointer border-r border-white dark:border-[#0A0A0A] last:border-r-0"
                            style={{
                                width: `${team.percent}%`,
                                backgroundColor: color,
                                opacity: isOtherHovered ? 0.3 : 1
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Inner Highlight for 3D effect */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Floating Tooltip strictly for narrow segments that can't fit text */}
                            {isHovered && team.percent < 15 && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-[#1F2937] text-white text-xs px-2 py-1 rounded shadow-xl whitespace-nowrap z-10 border border-slate-700 dark:border-[#374151]">
                                    {team.label}: {team.percent}%
                                </div>
                            )}

                            {/* Center Text if segment is wide enough */}
                            {team.percent >= 15 && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-bold text-white/90 drop-shadow-md truncate px-1">
                                        {team.percent}%
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* The Legend / Details Table */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {activeTeams.map((team: VestingEntry, index: number) => {
                    const color = ROLE_COLORS[team.label] || DEFAULT_COLOR;
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={index}
                            className={`flex items-start gap-2 p-2 rounded-lg transition-colors cursor-pointer ${isHovered ? 'bg-slate-100 dark:bg-[#1F2937]' : 'hover:bg-slate-50 dark:hover:bg-[#111827]'
                                }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Color Dot */}
                            <div
                                className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                                style={{ backgroundColor: color }}
                            />
                            {/* Info */}
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-slate-700 dark:text-gray-200 truncate">{team.label}</span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{team.percent}%</span>
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {team.cliffMonths > 0 ? `${team.cliffMonths}m cliff, ` : ''}
                                    {team.vestingMonths}m vest
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
