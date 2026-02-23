'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Terminal, FileCode2, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

const STEPS = [
    { text: 'Parsing vision and token utility...', icon: Terminal },
    { text: 'Calculating supply and vesting ratios...', icon: Database },
    { text: 'Injecting anti-sniper mechanics...', icon: ShieldCheck },
    { text: 'Generating BEP-20 smart contract...', icon: FileCode2 },
];

export function AILoadingStep() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((i) => Math.min(i + 1, STEPS.length - 1));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full min-h-full flex items-center justify-center overflow-y-auto custom-scrollbar py-12">

            {/* Ambient Background Gradients (Lovable style continuous) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-[#09090b] transition-colors">
                <div className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#9900FF]/15 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[10%] right-[20%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#00CCFF]/15 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }} />
            </div>

            <div className="w-full max-w-[500px] px-4 sm:px-6 animate-fade-in z-10 relative">

                {/* AI Thought Console */}
                <div className="bg-white/80 dark:bg-[rgba(15,15,15,0.7)] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col transition-colors">

                    {/* Header bar */}
                    <div className="bg-slate-100/50 dark:bg-black/40 border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2.5">
                            <Sparkles className="w-4 h-4 text-[#22D3EE] animate-spin-slow" style={{ animationDuration: '3s' }} />
                            <span className="text-[13px] font-semibold text-slate-800 dark:text-gray-200 tracking-wide">AI Co-Pilot is thinking...</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-gray-500 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
                            0x{(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}
                        </div>
                    </div>

                    {/* Step list */}
                    <div className="p-6 sm:p-8 space-y-6">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            let statusColor = 'text-slate-300 dark:text-gray-600';
                            let iconUi = <Icon className="w-[18px] h-[18px] opacity-50" strokeWidth={1.5} />;
                            let textClass = 'text-slate-400 dark:text-gray-500 font-medium';

                            if (i < activeStep) {
                                statusColor = 'text-[#10B981]';
                                iconUi = <CheckCircle2 className="w-[18px] h-[18px]" strokeWidth={2} />;
                                textClass = 'text-slate-500 dark:text-gray-400 font-medium';
                            } else if (i === activeStep) {
                                statusColor = 'text-pink-500 dark:text-[#22D3EE]';
                                iconUi = <Icon className="w-[18px] h-[18px] animate-pulse" strokeWidth={1.5} />;
                                textClass = 'text-slate-900 dark:text-white font-semibold flex items-center gap-2';
                            }

                            return (
                                <div key={i} className={`flex items-start gap-4 transition-all duration-700 ${i > activeStep ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
                                    <div className={`mt-0.5 ${statusColor}`}>
                                        {iconUi}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-[14px] ${textClass}`}>
                                            {step.text}
                                            {i === activeStep && <span className="flex gap-0.5 mt-1 ml-2"><span className="animate-bounce inline-block w-1 h-1 bg-pink-500 dark:bg-[#22D3EE] rounded-full"></span><span className="animate-bounce inline-block w-1 h-1 bg-pink-500 dark:bg-[#22D3EE] rounded-full" style={{ animationDelay: '100ms' }}></span><span className="animate-bounce inline-block w-1 h-1 bg-pink-500 dark:bg-[#22D3EE] rounded-full" style={{ animationDelay: '200ms' }}></span></span>}
                                        </p>

                                        {/* Activity skeletons for current step */}
                                        {i === activeStep && (
                                            <div className="mt-3 space-y-2.5 animate-pulse opacity-60">
                                                <div className="h-1.5 bg-gradient-to-r from-slate-200 dark:from-gray-700 to-transparent rounded-full w-3/4"></div>
                                                <div className="h-1.5 bg-gradient-to-r from-slate-200 dark:from-gray-700 to-transparent rounded-full w-1/2"></div>
                                                <div className="h-1.5 bg-gradient-to-r from-slate-200 dark:from-gray-700 to-transparent rounded-full w-5/6"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
