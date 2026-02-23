'use client';

import { useState } from 'react';
import type { TokenConfig } from '@/types/config';
import { ConfigSidebar } from './ConfigSidebar';
import { RiskScoreGauge } from './RiskScoreGauge';
import { VestingBar } from './VestingBar';
import { ArrowLeft, History, Database, ShieldCheck, TrendingUp, Lock, ArrowUpRight } from 'lucide-react';

interface ConfigPreviewStepProps {
    config: TokenConfig;
    onSave: (config: TokenConfig) => void;
    onBack: () => void;
}

export function ConfigPreviewStep({ config: initialConfig, onSave, onBack }: ConfigPreviewStepProps) {
    const [config, setConfig] = useState(initialConfig);
    const [isDeploying, setIsDeploying] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleDeploy = () => {
        setIsDeploying(true);
        // Simulate network deploy
        setTimeout(() => {
            onSave(config);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-[#050505] text-gray-100 font-sans animate-fade-in relative z-10 w-full overflow-hidden">

            {/* Top Header Bar */}
            <header className="flex items-center justify-between h-14 border-b border-[#1F2937]/50 bg-[#0A0A0A] px-4 flex-shrink-0 z-20">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Start Over">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
                    {/* View Toggles */}
                    <div className="hidden sm:flex bg-[#111111] border border-white/5 rounded-lg p-0.5">
                        <button className="px-3 py-1 text-xs font-medium text-white bg-[#1a1a1a] rounded-md shadow-sm">Preview</button>
                        <button className="px-3 py-1 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors">Code</button>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden px-3 py-1.5 text-[11px] font-bold text-gray-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                    >
                        Modify
                    </button>
                    <button className="hidden sm:flex px-3 py-1.5 text-[13px] font-medium text-gray-400 hover:text-white items-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <History className="w-4 h-4" /> History
                    </button>
                    <div className="hidden sm:block h-4 w-px bg-white/10 mx-1" />
                    <button className="px-3 py-1.5 text-xs font-bold text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/20 hover:bg-[#22D3EE]/20 rounded-lg transition-colors">
                        Upgrade
                    </button>
                    <button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="px-4 py-1.5 text-xs font-bold text-black bg-white hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                        {isDeploying ? 'Deploying...' : 'Deploy'} <span className="hidden sm:inline">Contract</span>
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Workspace Area */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Interaction Pane (AI Chat & Tweaks) Desktop */}
                <div className="hidden lg:flex flex-col w-[340px] border-r border-[#1F2937]/50 bg-[#0A0A0A] flex-shrink-0 relative z-10 transition-transform">
                    <ConfigSidebar config={config} onUpdate={setConfig} />
                </div>

                {/* Interaction Pane Mobile */}
                <div className={`fixed inset-y-0 left-0 z-50 w-[300px] border-r border-[#1F2937]/50 bg-[#0A0A0A] transform transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-end p-2 bg-[#0A0A0A] border-b border-[#1F2937]/50">
                        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white text-xs p-1">Close X</button>
                    </div>
                    <div className="h-[calc(100vh-40px)]">
                        <ConfigSidebar config={config} onUpdate={setConfig} />
                    </div>
                </div>

                {/* Preview Area (Dashboard content) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-10 relative">

                    {/* Background glows behind the preview frame */}
                    <div className="absolute inset-0 pointer-events-none -z-10 bg-[#050505]">
                        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#00CCFF]/5 blur-[120px] rounded-full mix-blend-screen" />
                        <div className="absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-[#9900FF]/5 blur-[120px] rounded-full mix-blend-screen" />
                    </div>

                    {/* Fake Browser/Canvas Frame */}
                    <div className="max-w-[1000px] mx-auto bg-[#0A0A0A] border border-white/5 shadow-2xl rounded-2xl p-6 lg:p-8 relative ring-1 ring-white/5">
                        <div className="absolute top-3 right-4 flex gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-white/10"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-white/10"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-white/10"></span>
                        </div>

                        <div className="mt-4 mb-8">
                            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                {config.tokenName}
                                <span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-mono border border-[#10B981]/20 tracking-widest hidden sm:inline-block">
                                    COMPILED
                                </span>
                            </h2>
                            <p className="text-lg text-[#22D3EE] font-mono mt-1">${config.tokenSymbol}</p>
                            <div className="flex items-center gap-4 text-[13px] text-gray-400 mt-4 flex-wrap">
                                <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> BEP-20 Standard</span>
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Audited</span>
                                <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">View Contract <ArrowUpRight className="w-3 h-3" /></a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
                            {/* Top Stats Column */}
                            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                                <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Total Supply</p>
                                    <p className="text-2xl font-mono text-white group-hover:text-[#22D3EE] transition-colors truncate">
                                        {config.totalSupply.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">TGE Unlock</p>
                                    <p className="text-2xl font-mono text-white group-hover:text-[#22D3EE] transition-colors">
                                        {config.tgePercent}%
                                    </p>
                                </div>
                            </div>

                            {/* Risk Gauge */}
                            <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/10 rounded-full blur-2xl" />
                                <RiskScoreGauge score={config.risk.score} />
                            </div>
                        </div>

                        {/* Vesting Visualization Row */}
                        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                    <Lock strokeWidth={1.5} className="w-4 h-4 text-gray-400" /> Token Distribution & Vesting
                                </h3>
                                <button className="text-[10px] text-[#22D3EE] hover:underline font-bold tracking-widest uppercase ml-2 text-right">
                                    View Schedule
                                </button>
                            </div>
                            <VestingBar teams={config.vesting} />
                        </div>

                        {/* Mechanics & Security Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* PLU Mechanics */}
                            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-3xl transition-opacity" />
                                <h3 className="text-[15px] font-semibold text-white flex items-center gap-2 mb-4">
                                    <TrendingUp strokeWidth={1.5} className="w-4 h-4 text-blue-400" /> Progressive Liquidity
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Initial Setup</p>
                                            <p className="text-[13px] text-gray-300 mt-1">LP Lock / Yield</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[13px] font-mono text-white">{config.plu.totalLockPercent}% LP Lock</p>
                                            <p className="text-[11px] font-mono text-gray-500">Total</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Unlock Milestones</p>
                                        <ul className="space-y-2">
                                            {config.plu.milestones.map((m, i) => (
                                                <li key={i} className="flex justify-between items-center text-[13px] bg-[#0A0A0A] p-2.5 rounded-lg border border-white/5">
                                                    <span className="text-gray-400 truncate max-w-[65%]">{m.condition}</span>
                                                    <span className="text-blue-400 font-mono whitespace-nowrap">Unlock {m.percent}%</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Security Features Checklist */}
                            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                                <h3 className="text-[15px] font-semibold text-white flex items-center gap-2 mb-4">
                                    <ShieldCheck strokeWidth={1.5} className="w-4 h-4 text-[#10B981]" /> Automated Security
                                </h3>
                                <ul className="space-y-3 shrink-0 relative z-10">
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center shrink-0">
                                            <CheckIcon className="w-3 h-3 text-[#10B981]" />
                                        </div>
                                        <span className="text-[13px] text-gray-300">Renounce Ownership (Optional)</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center shrink-0">
                                            <CheckIcon className="w-3 h-3 text-[#10B981]" />
                                        </div>
                                        <span className="text-[13px] text-gray-300">Liquidity Automatically Locked</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${config.amm.antiBotBlocks > 0 ? 'bg-[#10B981]/20' : 'bg-[#EF4444]/20'}`}>
                                            {config.amm.antiBotBlocks > 0 ? <CheckIcon className="w-3 h-3 text-[#10B981]" /> : <XIcon className="w-3 h-3 text-[#EF4444]" />}
                                        </div>
                                        <span className="text-[13px] text-gray-300">Anti-Sniper Bot Protection</span>
                                    </li>
                                    <li className="flex items-center gap-3 flex-wrap">
                                        <div className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center shrink-0">
                                            <CheckIcon className="w-3 h-3 text-[#10B981]" />
                                        </div>
                                        <span className="text-[13px] text-gray-300">Max Tx Limit: {config.amm.antiWhaleMaxWalletPercent}%</span>
                                    </li>
                                </ul>

                                <div className="mt-6 pt-5 flex flex-wrap justify-between items-center bg-[#0A0A0A] p-4 rounded-xl border border-white/5 relative z-10 shrink-0">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Trading Taxes</p>
                                        <div className="flex gap-4 mt-1.5 flex-wrap">
                                            <span className="text-[13px] font-mono text-red-400">Buy: {config.amm.buyTaxPercent}%</span>
                                            <span className="text-[13px] font-mono text-green-400">Sell: {config.amm.sellTaxPercent}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper simple icons for checklist
function CheckIcon(props: any) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>
}
function XIcon(props: any) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
}
