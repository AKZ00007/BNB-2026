'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { GoalInputStep } from '@/components/wizard/GoalInputStep';
import { AILoadingStep } from '@/components/wizard/AILoadingStep';
import { ConfigPreviewStep } from '@/components/wizard/ConfigPreviewStep';
import { SaveStep } from '@/components/wizard/SaveStep';
import { WizardSidebar } from '@/components/wizard/WizardSidebar';
import { ProgressStepper } from '@/components/wizard/ProgressStepper';
import type { TokenConfig } from '@/types/config';

type Step = 'input' | 'loading' | 'preview' | 'save';

export default function CreateTokenPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors" />}>
            <CreateTokenInner />
        </Suspense>
    );
}

function CreateTokenInner() {
    const [step, setStep] = useState<Step>('input');
    const [config, setConfig] = useState<TokenConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [templateName, setTemplateName] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const { address } = useAccount();

    // Lock body scroll — this page is a full-screen IDE layout, no outer scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Load template config from sessionStorage if redirected from /templates
    useEffect(() => {
        if (searchParams.get('template') === 'true') {
            try {
                const stored = sessionStorage.getItem('template_config');
                const name = sessionStorage.getItem('template_name');
                if (stored) {
                    setConfig(JSON.parse(stored) as TokenConfig);
                    setTemplateName(name);
                    setStep('preview');
                    sessionStorage.removeItem('template_config');
                    sessionStorage.removeItem('template_name');
                }
            } catch {
                // ignore parse errors
            }
        }
    }, [searchParams]);

    const handleGoalSubmit = async (goal: string) => {
        setError(null);
        setStep('loading');

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'AI generation failed');

            setConfig(data.config);
            setTemplateName(null);
            setStep('preview');
        } catch (err) {
            setError((err as Error).message);
            setStep('input');
        }
    };

    const handleSave = async (finalConfig: TokenConfig) => {
        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    config: finalConfig,
                    walletAddress: address
                })
            });
            const data = await res.json();
            if (data.success && data.id) {
                try {
                    const existing: string[] = JSON.parse(localStorage.getItem('bnb_config_ids') || '[]');
                    if (!existing.includes(data.id)) {
                        localStorage.setItem('bnb_config_ids', JSON.stringify([data.id, ...existing].slice(0, 50)));
                    }
                } catch { /* ignore */ }
            }
        } catch (err) {
            console.error('Failed to save config to DB:', err);
        }

        setConfig(finalConfig);
        setStep('save');
    };

    const handleReset = () => {
        setConfig(null);
        setError(null);
        setTemplateName(null);
        setStep('input');
    };

    return (
        <div className="flex h-[calc(100vh-64px)] w-full bg-white dark:bg-[#0A0A0A] text-slate-800 dark:text-gray-100 overflow-hidden font-sans transition-colors">
            {/* Left Panel: Fixed Navigation */}
            <WizardSidebar />

            {/* Right Panel: Main Content Area */}
            <main className="flex-1 flex flex-col relative h-full overflow-y-auto custom-scrollbar">

                {/* Ambient dynamic background lighting */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-[#F0B90B]/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8B5CF6]/5 rounded-full blur-[100px]" />
                </div>

                {/* Top/Center Workspace Container */}
                <div className="relative z-10 w-full flex-1 flex flex-col pt-16 pb-12 px-8 min-h-0">

                    {/* Stepper only shows on Input and Load steps */}
                    {(step === 'input' || step === 'loading') && (
                        <ProgressStepper currentStep={step} />
                    )}

                    {/* Template Banner */}
                    {templateName && step === 'input' && (
                        <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-sm flex items-center gap-3">
                            <span className="text-lg">✨</span>
                            <span className="text-gray-300">
                                Template applied: <strong className="text-[#8B5CF6]">{templateName}</strong>
                            </span>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Dynamic Step Router */}
                    <div className="w-full flex-1 flex flex-col items-center">
                        {step === 'input' && <GoalInputStep onSubmit={handleGoalSubmit} />}
                        {step === 'loading' && <AILoadingStep />}
                        {step === 'preview' && config && (
                            <ConfigPreviewStep config={config} onSave={handleSave} onBack={handleReset} />
                        )}
                        {step === 'save' && config && (
                            <SaveStep config={config} onCreateAnother={handleReset} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
