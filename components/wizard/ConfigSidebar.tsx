'use client';

import { useState } from 'react';
import { Send, Settings2, Sparkles, Layers, ShieldCheck, Rocket } from 'lucide-react';
import type { TokenConfig } from '@/types/config';

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
        <div className="flex flex-col h-full w-full bg-[#0A0A0A]">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#1F2937]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#22D3EE]" />
                    <h2 className="font-semibold text-white text-[13px] tracking-wide">AI Co-Pilot</h2>
                </div>
            </div>

            {/* Scrollable Tasks & Controls Area */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-8">

                {/* AI Chat Input */}
                <div className="mb-2">
                    <div className="bg-[#111111] border border-white/5 rounded-xl p-3 shadow-inner">
                        <form onSubmit={handleAIPrompt} className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="E.g. Remove the anti-bot lock and set taxes to 0..."
                                className="w-full h-20 bg-transparent text-[13px] text-gray-200 placeholder-gray-500 resize-none outline-none leading-relaxed"
                            />
                            <div className="absolute bottom-0 right-0">
                                <button
                                    type="submit"
                                    disabled={!prompt.trim() || isGenerating}
                                    className="p-1.5 bg-[#22D3EE]/20 hover:bg-[#22D3EE]/30 text-[#22D3EE] rounded-lg transition-colors disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500 flex items-center gap-1 text-[11px] font-bold"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Identity Settings */}
                <section>
                    <h3 className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-3 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" /> Identity
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block font-medium">Token Name</label>
                            <input
                                type="text"
                                value={config.tokenName}
                                onChange={(e) => onUpdate({ ...config, tokenName: e.target.value })}
                                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block font-medium">Ticker</label>
                            <input
                                type="text"
                                value={config.tokenSymbol}
                                onChange={(e) => onUpdate({ ...config, tokenSymbol: e.target.value.toUpperCase() })}
                                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#22D3EE]/50 font-mono transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block font-medium">Total Supply</label>
                            <input
                                type="number"
                                value={config.totalSupply}
                                onChange={(e) => onUpdate({ ...config, totalSupply: Number(e.target.value) })}
                                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#22D3EE]/50 font-mono transition-colors"
                            />
                        </div>
                    </div>
                </section>

                {/* AMM & Taxes */}
                <section>
                    <h3 className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-3 flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5" /> Mechanics
                    </h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block font-medium">Buy Tax (%)</label>
                                <input
                                    type="number"
                                    value={config.amm.buyTaxPercent}
                                    onChange={(e) => handleNestedChange('amm', 'buyTaxPercent', Number(e.target.value))}
                                    className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block font-medium">Sell Tax (%)</label>
                                <input
                                    type="number"
                                    value={config.amm.sellTaxPercent}
                                    onChange={(e) => handleNestedChange('amm', 'sellTaxPercent', Number(e.target.value))}
                                    className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Toggle Anti-Bot */}
                        <label className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[#111111] cursor-pointer group hover:bg-[#151515] transition-colors mt-2">
                            <div className="flex flex-col">
                                <span className="text-[13px] font-medium text-gray-300 group-hover:text-white transition-colors">Anti-Bot Protection</span>
                                <span className="text-[10px] text-gray-500">Blocks sniper bots on block 0</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full transition-colors relative ${config.amm.antiBotBlocks > 0 ? 'bg-[#22D3EE]' : 'bg-[#374151]'}`}>
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
