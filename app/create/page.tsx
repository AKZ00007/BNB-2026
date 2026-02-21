'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoalInputStep } from '@/components/wizard/GoalInputStep';
import { AILoadingStep } from '@/components/wizard/AILoadingStep';
import { ConfigPreviewStep } from '@/components/wizard/ConfigPreviewStep';
import { SaveStep } from '@/components/wizard/SaveStep';
import type { TokenConfig } from '@/types/config';

type Step = 'input' | 'loading' | 'preview' | 'save';

export default function CreateTokenPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 transition-colors duration-300" />}>
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

    const handleSave = (finalConfig: TokenConfig) => {
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
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden relative transition-colors duration-300">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-gold/4 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple/8 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-gold/3 rounded-full blur-[100px]" />
            </div>

            {/* Step progress indicator */}
            <div className="relative z-10 pt-24 pb-6 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-10">
                        {(['input', 'preview', 'save'] as const).map((s, i) => {
                            const stepNum = i + 1;
                            const isCurrent = step === s || (step === 'loading' && s === 'input');
                            const isCompleted =
                                (s === 'input' && (step === 'preview' || step === 'save')) ||
                                (s === 'preview' && step === 'save');

                            return (
                                <div key={s} className="flex items-center gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isCompleted
                                                ? 'bg-gold text-bg-base dark:text-gray-900'
                                                : isCurrent
                                                    ? 'bg-gold/20 border-2 border-gold text-gold'
                                                    : 'bg-white dark:bg-gray-900 border border-[var(--border-gray-300, #D1D5DB)] dark:border-gray-800 text-gray-400 dark:text-gray-500'
                                            }`}
                                    >
                                        {isCompleted ? '✓' : stepNum}
                                    </div>
                                    <span
                                        className={`text-sm font-medium hidden sm:block transition-colors ${isCurrent ? 'text-gold' : isCompleted ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'
                                            }`}
                                    >
                                        {s === 'input' ? 'Your Vision' : s === 'preview' ? 'Review Config' : 'Save'}
                                    </span>
                                    {i < 2 && (
                                        <div className={`w-10 h-px sm:w-16 lg:w-24 transition-colors ${isCompleted ? 'bg-gold' : 'bg-gray-100 dark:bg-gray-800'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Template Banner */}
                    {templateName && (
                        <div className="mb-6 p-4 rounded-xl bg-purple/10 dark:bg-purple/20 border border-purple/20 text-sm flex items-center gap-3 transition-colors">
                            <span className="text-lg">✨</span>
                            <span className="text-gray-600 dark:text-gray-300 transition-colors">
                                Template applied: <strong className="text-purple dark:text-purple/80">{templateName}</strong> — review and customize below, then save.
                            </span>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Step Renderer */}
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
    );
}
