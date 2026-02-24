'use client';

import { useState } from 'react';
import { Send, Settings2, Sparkles, Layers, ShieldCheck, Rocket, Shield } from 'lucide-react';
import type { TokenConfig, PLUMilestone } from '@/types/config';

/* ── PLU Milestone Preset Bundles ──────────────────────────────────── */
const MILESTONE_PRESETS: Record<string, PLUMilestone[]> = {
    standard: [
        { percent: 5, afterDays: 30, condition: 'Reach 500 unique holders' },
        { percent: 10, afterDays: 60, condition: 'Hit $500K market cap' },
        { percent: 10, afterDays: 90, condition: 'Achieve $50K daily volume' },
        { percent: 15, afterDays: 120, condition: 'Partnership integration live' },
        { percent: 20, afterDays: 365, condition: '12-month token age' },
    ],
    conservative: [
        { percent: 5, afterDays: 60, condition: 'Reach 1,000 unique holders' },
        { percent: 5, afterDays: 120, condition: 'Sustained $1M market cap for 30 days' },
        { percent: 10, afterDays: 180, condition: 'Achieve $100K daily volume' },
        { percent: 10, afterDays: 270, condition: 'Security audit completed' },
        { percent: 15, afterDays: 365, condition: '12-month token age' },
        { percent: 15, afterDays: 540, condition: '18-month token age' },
    ],
    aggressive: [
        { percent: 10, afterDays: 14, condition: 'Reach 200 unique holders' },
        { percent: 15, afterDays: 30, condition: 'Hit $250K market cap' },
        { percent: 15, afterDays: 60, condition: 'DEX listing confirmed' },
        { percent: 20, afterDays: 90, condition: 'Cross-chain bridge live' },
    ],
    meme: [
        { percent: 10, afterDays: 7, condition: 'Trending on DEXScreener' },
        { percent: 10, afterDays: 14, condition: 'Reach 1,000 holders' },
        { percent: 15, afterDays: 30, condition: '10K Twitter followers' },
        { percent: 15, afterDays: 60, condition: 'CEX listing announced' },
        { percent: 10, afterDays: 90, condition: 'Community DAO vote passed' },
    ],
};

function getPresetName(milestones: PLUMilestone[]): string {
    if (!milestones || milestones.length === 0) return 'standard';
    const first = milestones[0]?.condition || '';
    if (first.includes('1,000 unique holders')) return 'conservative';
    if (first.includes('200 unique holders')) return 'aggressive';
    if (first.includes('Trending')) return 'meme';
    return 'standard';
}

interface ConfigSidebarProps {
    config: TokenConfig;
    onUpdate: (newConfig: TokenConfig) => void;
}

export function ConfigSidebar({ config, onUpdate }: ConfigSidebarProps) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAIPrompt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isGenerating) return;

        setIsGenerating(true);
        // Simulate AI update
        setTimeout(() => {
            onUpdate({
                ...config,
                amm: { ...config.amm, buyTaxPercent: 0, sellTaxPercent: 0 }
            });
            setPrompt('');
            setIsGenerating(false);
        }, 1500);
    };

    const handleNestedChange = (category: keyof TokenConfig, field: string, value: string | number | boolean) => {
        onUpdate({
            ...config,
            [category]: {
                ...(config[category] as any),
                [field]: value
            }
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-[#0A0A0A] transition-colors">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-[#1F2937]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500 dark:text-[#22D3EE]" />
                    <h2 className="font-semibold text-slate-900 dark:text-white text-[13px] tracking-wide">AI Co-Pilot</h2>
                </div>
            </div>

            {/* Scrollable Tasks & Controls Area */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-8">

                {/* AI Chat Input */}
                <div className="mb-2">
                    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-xl p-3 shadow-sm dark:shadow-inner">
                        <form onSubmit={handleAIPrompt} className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="E.g. Remove the anti-bot lock and set taxes to 0..."
                                className="w-full h-20 bg-transparent text-[13px] text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 resize-none outline-none leading-relaxed"
                            />
                            <div className="absolute bottom-0 right-0">
                                <button
                                    type="submit"
                                    disabled={!prompt.trim() || isGenerating}
                                    className="p-1.5 bg-pink-100 dark:bg-[#22D3EE]/20 hover:bg-pink-200 dark:hover:bg-[#22D3EE]/30 text-pink-600 dark:text-[#22D3EE] rounded-lg transition-colors disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-gray-800 disabled:text-slate-400 dark:disabled:text-gray-500 flex items-center gap-1 text-[11px] font-bold"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Identity Settings */}
                <section>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-gray-500 tracking-wider uppercase mb-3 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" /> Identity
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-slate-600 dark:text-gray-400 mb-1 block font-medium">Token Name</label>
                            <input
                                type="text"
                                value={config.tokenName}
                                onChange={(e) => onUpdate({ ...config, tokenName: e.target.value })}
                                className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-[#22D3EE]/50 transition-colors shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600 dark:text-gray-400 mb-1 block font-medium">Ticker</label>
                            <input
                                type="text"
                                value={config.tokenSymbol}
                                onChange={(e) => onUpdate({ ...config, tokenSymbol: e.target.value.toUpperCase() })}
                                className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-[#22D3EE]/50 font-mono transition-colors shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600 dark:text-gray-400 mb-1 block font-medium">Total Supply</label>
                            <input
                                type="number"
                                value={config.totalSupply}
                                onChange={(e) => onUpdate({ ...config, totalSupply: Number(e.target.value) })}
                                className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-[#22D3EE]/50 font-mono transition-colors shadow-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* AMM & Taxes */}
                <section>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-gray-500 tracking-wider uppercase mb-3 flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5" /> Mechanics
                    </h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-slate-600 dark:text-gray-400 mb-1 block font-medium">Buy Tax (%)</label>
                                <input
                                    type="number"
                                    value={config.amm.buyTaxPercent}
                                    onChange={(e) => handleNestedChange('amm', 'buyTaxPercent', Number(e.target.value))}
                                    className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-[#22D3EE]/50 transition-colors shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600 dark:text-gray-400 mb-1 block font-medium">Sell Tax (%)</label>
                                <input
                                    type="number"
                                    value={config.amm.sellTaxPercent}
                                    onChange={(e) => handleNestedChange('amm', 'sellTaxPercent', Number(e.target.value))}
                                    className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-[#22D3EE]/50 transition-colors shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Toggle Anti-Bot */}
                        <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111111] cursor-pointer group hover:bg-slate-50 dark:hover:bg-[#151515] transition-colors mt-2 shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[13px] font-medium text-slate-800 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-white transition-colors">Anti-Bot Protection</span>
                                <span className="text-[10px] text-slate-500 dark:text-gray-500">Blocks sniper bots on block 0</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full transition-colors relative ${config.amm.antiBotBlocks > 0 ? 'bg-pink-500 dark:bg-[#22D3EE]' : 'bg-slate-300 dark:bg-[#374151]'}`}>
                                <div className={`absolute top-[2px] bottom-[2px] w-3 bg-white rounded-full transition-all ${config.amm.antiBotBlocks > 0 ? 'left-[18px]' : 'left-[2px]'}`} />
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={config.amm.antiBotBlocks > 0}
                                onChange={(e) => handleNestedChange('amm', 'antiBotBlocks', e.target.checked ? 3 : 0)}
                            />
                        </label>
                    </div>
                </section>

                {/* PLU — Progressive Liquidity Unlock */}
                <section>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-gray-500 tracking-wider uppercase mb-3 flex items-center gap-2">
                        <Rocket className="w-3.5 h-3.5" /> Liquidity Lock (PLU)
                    </h3>
                    <div className="space-y-3">
                        {/* PLU Toggle */}
                        <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111111] cursor-pointer group hover:bg-slate-50 dark:hover:bg-[#151515] transition-colors shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[13px] font-medium text-slate-800 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-white transition-colors">Enable PLU</span>
                                <span className="text-[10px] text-slate-500 dark:text-gray-500">Lock LP tokens with milestone-based unlocks</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full transition-colors relative ${config.plu?.totalLockPercent > 0 ? 'bg-pink-500 dark:bg-[#22D3EE]' : 'bg-slate-300 dark:bg-[#374151]'}`}>
                                <div className={`absolute top-[2px] bottom-[2px] w-3 bg-white rounded-full transition-all ${config.plu?.totalLockPercent > 0 ? 'left-[18px]' : 'left-[2px]'}`} />
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={config.plu?.totalLockPercent > 0}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        onUpdate({
                                            ...config,
                                            plu: {
                                                totalLockPercent: 60,
                                                milestones: MILESTONE_PRESETS['standard'],
                                            }
                                        });
                                    } else {
                                        onUpdate({
                                            ...config,
                                            plu: { totalLockPercent: 0, milestones: [] }
                                        });
                                    }
                                }}
                            />
                        </label>

                        {config.plu?.totalLockPercent > 0 && (
                            <>
                                {/* Lock Percentage */}
                                <div>
                                    <label className="text-xs text-slate-600 dark:text-gray-400 mb-1 block font-medium">Lock Percentage (%)</label>
                                    <input
                                        type="number"
                                        min={10}
                                        max={100}
                                        value={config.plu.totalLockPercent}
                                        onChange={(e) => onUpdate({
                                            ...config,
                                            plu: { ...config.plu, totalLockPercent: Math.max(10, Math.min(100, Number(e.target.value))) }
                                        })}
                                        className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-[#22D3EE]/50 font-mono transition-colors shadow-sm"
                                    />
                                </div>

                                {/* Milestone Preset */}
                                <div>
                                    <label className="text-xs text-slate-600 dark:text-gray-400 mb-1 block font-medium">Milestone Preset</label>
                                    <select
                                        value={getPresetName(config.plu.milestones)}
                                        onChange={(e) => {
                                            const key = e.target.value as keyof typeof MILESTONE_PRESETS;
                                            if (MILESTONE_PRESETS[key]) {
                                                onUpdate({
                                                    ...config,
                                                    plu: { ...config.plu, milestones: MILESTONE_PRESETS[key] }
                                                });
                                            }
                                        }}
                                        className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-[#22D3EE]/50 transition-colors shadow-sm appearance-none"
                                    >
                                        <option value="standard">Standard (Balanced)</option>
                                        <option value="conservative">Conservative (Slow Unlock)</option>
                                        <option value="aggressive">Aggressive (Fast Growth)</option>
                                        <option value="meme">Meme Token (Community-Driven)</option>
                                    </select>
                                </div>

                                {/* Selected Milestones Preview */}
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Milestones</span>
                                    {config.plu.milestones.map((m, i) => (
                                        <div key={i} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5">
                                            <span className="text-slate-700 dark:text-gray-300 truncate max-w-[160px]">{m.condition}</span>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-cyan-500 font-semibold">+{m.percent}%</span>
                                                <span className="text-slate-400 dark:text-gray-500">D{m.afterDays}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
                {/* Trading Guards (AMM Anti-Dump) */}
                <section>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-gray-500 tracking-wider uppercase mb-3 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Trading Guards
                    </h3>
                    <div className="space-y-3">
                        {/* Max TX Limit */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs text-slate-600 dark:text-gray-400 font-medium">Max TX Limit</label>
                                <span className="text-xs font-mono text-cyan-500">{config.amm?.maxTxPercent || 1.5}%</span>
                            </div>
                            <input
                                type="range"
                                min={0.5}
                                max={5}
                                step={0.5}
                                value={config.amm?.maxTxPercent || 1.5}
                                onChange={(e) => onUpdate({
                                    ...config,
                                    amm: { ...config.amm, maxTxPercent: Number(e.target.value) }
                                })}
                                className="w-full accent-cyan-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400"><span>0.5%</span><span>5%</span></div>
                        </div>

                        {/* Anti-Bot Blocks */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs text-slate-600 dark:text-gray-400 font-medium">Anti-Bot Delay</label>
                                <span className="text-xs font-mono text-cyan-500">{config.amm?.antiBotBlocks || 3} blocks</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={10}
                                step={1}
                                value={config.amm?.antiBotBlocks || 3}
                                onChange={(e) => onUpdate({
                                    ...config,
                                    amm: { ...config.amm, antiBotBlocks: Number(e.target.value) }
                                })}
                                className="w-full accent-cyan-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400"><span>0</span><span>10 blocks</span></div>
                        </div>

                        {/* Cooldown */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs text-slate-600 dark:text-gray-400 font-medium">Trade Cooldown</label>
                                <span className="text-xs font-mono text-cyan-500">{config.amm?.cooldownSeconds || 30}s</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={120}
                                step={5}
                                value={config.amm?.cooldownSeconds || 30}
                                onChange={(e) => onUpdate({
                                    ...config,
                                    amm: { ...config.amm, cooldownSeconds: Number(e.target.value) }
                                })}
                                className="w-full accent-cyan-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400"><span>0s</span><span>120s</span></div>
                        </div>

                        {/* TWAP Deviation */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs text-slate-600 dark:text-gray-400 font-medium">TWAP Deviation Limit</label>
                                <span className="text-xs font-mono text-cyan-500">{config.amm?.twapDeviationPercent || 15}%</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={30}
                                step={1}
                                value={config.amm?.twapDeviationPercent || 15}
                                onChange={(e) => onUpdate({
                                    ...config,
                                    amm: { ...config.amm, twapDeviationPercent: Number(e.target.value) }
                                })}
                                className="w-full accent-cyan-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400"><span>5%</span><span>30%</span></div>
                        </div>

                        {/* Dynamic Tax Toggle */}
                        <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111111] cursor-pointer group hover:bg-slate-50 dark:hover:bg-[#151515] transition-colors shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[13px] font-medium text-slate-800 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-white transition-colors">Dynamic Tax</span>
                                <span className="text-[10px] text-slate-500 dark:text-gray-500">Escalating sell tax under sell pressure</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full transition-colors relative ${config.amm?.dynamicTaxEnabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-[#374151]'}`}>
                                <div className={`absolute top-[2px] bottom-[2px] w-3 bg-white rounded-full transition-all ${config.amm?.dynamicTaxEnabled ? 'left-[18px]' : 'left-[2px]'}`} />
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={config.amm?.dynamicTaxEnabled || false}
                                onChange={(e) => onUpdate({
                                    ...config,
                                    amm: { ...config.amm, dynamicTaxEnabled: e.target.checked }
                                })}
                            />
                        </label>
                    </div>
                </section>

                {/* Advisory Note */}
                <div className="bg-[#9900FF]/10 border border-[#9900FF]/20 rounded-xl p-3 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#9900FF] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#9900FF]/80 leading-relaxed font-medium">
                        Advanced distribution changes require the Pro Dashboard after deployment.
                    </p>
                </div>
            </div>
        </div>
    );
}
