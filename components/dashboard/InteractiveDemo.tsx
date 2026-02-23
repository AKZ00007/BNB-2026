'use client';

import { useEffect, useState, useRef } from 'react';
import { Play, ShieldAlert, TrendingDown, TerminalSquare, AlertTriangle, ShieldCheck, Database, RefreshCw } from 'lucide-react';
import type { TokenConfig } from '@/types/config';

interface InteractiveDemoProps {
    config: TokenConfig;
}

type LogType = 'info' | 'success' | 'warning' | 'error';
interface LogEntry {
    time: string;
    text: string;
    type: LogType;
}

export function InteractiveDemo({ config }: InteractiveDemoProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [healthScore, setHealthScore] = useState(85);
    const [lockState, setLockState] = useState<'ACTIVE' | 'FROZEN'>('ACTIVE');
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const addLog = (text: string, type: LogType = 'info') => {
        setLogs(prev => [...prev, {
            time: new Date().toLocaleTimeString([], { hour12: false }),
            text,
            type
        }]);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const simNormalTrade = async () => {
        setIsSimulating(true);
        addLog(`Initiating standard user purchase of ${config.tokenSymbol}...`, 'info');
        await sleep(600);
        addLog(`Analyzing transaction size: 0.5% of total supply. Limit is ${config.amm.antiWhaleMaxWalletPercent}%.`, 'info');
        await sleep(800);
        addLog(`✅ SUCCESS: Transaction confirmed in block. Sender balance updated.`, 'success');
        setIsSimulating(false);
    };

    const simWhaleBuy = async () => {
        setIsSimulating(true);
        addLog(`🚨 WARNING: Unusually large transaction detected on Mempool.`, 'warning');
        await sleep(800);
        addLog(`Processing purchase request for 3.5% of total supply...`, 'info');
        await sleep(1000);
        addLog(`Checking Anti-Whale constraints. Max Wallet Allowed: ${config.amm.antiWhaleMaxWalletPercent}%.`, 'info');
        await sleep(800);
        addLog(`❌ REVERTED: Smart contract blocked transaction. Reason: "GuardianToken: exceeds max wallet"`, 'error');
        setIsSimulating(false);
    };

    const simDevDump = async () => {
        setIsSimulating(true);
        addLog(`🚨 CRITICAL: Deployer wallet initiating mass sell-off!`, 'error');
        await sleep(1000);
        addLog(`AI Oracle re-calculating holistic token health...`, 'warning');

        // Fast counter down to 24
        let score = 85;
        const interval = setInterval(() => {
            score -= 4;
            if (score <= 24) {
                score = 24;
                clearInterval(interval);
            }
            setHealthScore(score);
        }, 100);

        await sleep(1500);
        addLog(`Health Score plummeted to 24. Threshold breached (< 50).`, 'error');
        await sleep(800);
        addLog(`Progressive Liquidity Controller (PLU) intercepted logic.`, 'warning');

        setLockState('FROZEN');
        addLog(`🛡️ DEFENSE ENGAGED: emergencyFreeze() called. All LP tokens locked indefinitely.`, 'success');
        setIsSimulating(false);
    };

    const resetDemo = () => {
        setLogs([]);
        setHealthScore(85);
        setLockState('ACTIVE');
        addLog('Environment reset. Virtual blockchain ready.', 'info');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Control Panel */}
            <div className="lg:col-span-5 space-y-6">
                <div className="glass-card-prominent rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <TerminalSquare className="w-5 h-5 text-gold" />
                        Simulation Sandbox
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                        Execute virtual transactions against your Guardian configuration to prove security features.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={simNormalTrade}
                            disabled={isSimulating || lockState === 'FROZEN'}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-gold/50 hover:shadow-sm transition-all text-left disabled:opacity-50"
                        >
                            <div>
                                <p className="font-semibold text-gray-900">Simulate Normal Trade</p>
                                <p className="text-xs text-gray-500">Buys 0.5% supply. Should succeed.</p>
                            </div>
                            <Play className="w-4 h-4 text-gray-400" />
                        </button>

                        <button
                            onClick={simWhaleBuy}
                            disabled={isSimulating || lockState === 'FROZEN'}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-gold/50 hover:shadow-sm transition-all text-left disabled:opacity-50"
                        >
                            <div>
                                <p className="font-semibold text-gray-900">Test Anti-Whale Limit</p>
                                <p className="text-xs text-gray-500">Tries to buy 3.5% supply (Max is {config.amm.antiWhaleMaxWalletPercent}%).</p>
                            </div>
                            <ShieldAlert className="w-4 h-4 text-warning" />
                        </button>

                        <button
                            onClick={simDevDump}
                            disabled={isSimulating || lockState === 'FROZEN'}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-error/20 bg-error/5 hover:border-error/40 hover:bg-error/10 transition-all text-left disabled:opacity-50"
                        >
                            <div>
                                <p className="font-semibold text-error">Simulate Dev Dump (Rugpull)</p>
                                <p className="text-xs text-error/80">Triggers AI freeze to protect Liquidity.</p>
                            </div>
                            <TrendingDown className="w-4 h-4 text-error" />
                        </button>
                    </div>
                </div>

                {/* State Visualizer */}
                <div className="glass-card-prominent rounded-2xl p-6 border-gold/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full" />

                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Live Contract State</h3>

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">AI Health Score</span>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${healthScore >= 50 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                            }`}>
                            {healthScore >= 50 ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            {healthScore} / 100
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">PLU Liquidity Lock</span>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${lockState === 'ACTIVE' ? 'bg-blue-500/10 text-blue-600' : 'bg-purple/10 text-purple border border-purple/20'
                            }`}>
                            <Database className="w-4 h-4" />
                            {lockState}
                        </div>
                    </div>

                    {lockState === 'FROZEN' && (
                        <button onClick={resetDemo} className="mt-6 w-full flex items-center justify-center gap-2 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-black transition-colors">
                            <RefreshCw className="w-4 h-4" /> Reset Environment
                        </button>
                    )}
                </div>
            </div>

            {/* Console Output Log */}
            <div className="lg:col-span-7 bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl flex flex-col h-[600px] overflow-hidden">
                <div className="border-b border-gray-800 px-4 py-3 bg-[#111111] flex items-center gap-2">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-error border border-error/50"></div>
                        <div className="w-3 h-3 rounded-full bg-warning border border-warning/50"></div>
                        <div className="w-3 h-3 rounded-full bg-success border border-success/50"></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-4 font-mono">hardhat-local-node ~/project</span>
                </div>

                <div className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-3">
                    {logs.length === 0 ? (
                        <p className="text-gray-600 italic">Blockchain initialized. Ready for simulation events...</p>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="text-gray-600 shrink-0">[{log.time}]</span>
                                <span className={
                                    log.type === 'success' ? 'text-success font-semibold' :
                                        log.type === 'warning' ? 'text-warning' :
                                            log.type === 'error' ? 'text-error font-semibold' :
                                                'text-gray-300'
                                }>
                                    {log.text}
                                </span>
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}
