import { Check } from 'lucide-react';

interface ProgressStepperProps {
    currentStep: 'input' | 'loading' | 'preview' | 'save';
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
    const steps = [
        { id: 'input', label: 'Your Vision', num: 1 },
        { id: 'preview', label: 'Review Config', num: 2 },
        { id: 'save', label: 'Save', num: 3 },
    ];

    const getStepState = (stepId: string, index: number) => {
        if (currentStep === stepId) return 'active';
        if (currentStep === 'loading' && stepId === 'input') return 'active'; // keep 1 active while loading

        const currentIndex = steps.findIndex(s => s.id === currentStep || (currentStep === 'loading' && s.id === 'input'));
        if (index < currentIndex) return 'completed';

        return 'inactive';
    };

    return (
        <div className="w-[400px] mx-auto flex items-center justify-between mb-12">
            {steps.map((step, i) => {
                const state = getStepState(step.id, i);

                return (
                    <div key={step.id} className="flex items-center">
                        {/* Step Circle & Label */}
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${state === 'completed'
                                    ? 'bg-pink-500 text-white dark:bg-[#F0B90B] dark:text-[#111827]'
                                    : state === 'active'
                                        ? 'bg-pink-100 border border-pink-500 text-pink-600 dark:bg-[#F0B90B]/20 dark:border-[#F0B90B] dark:text-[#F0B90B]'
                                        : 'bg-slate-100 border border-slate-300 text-slate-400 dark:bg-[#1F2937] dark:border-[#374151] dark:text-gray-500'
                                    }`}
                            >
                                {state === 'completed' ? <Check className="w-3 h-3" /> : step.num}
                            </div>
                            <span
                                className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${state === 'active'
                                    ? 'text-pink-600 dark:text-[#F0B90B]'
                                    : state === 'completed'
                                        ? 'text-slate-800 dark:text-gray-300'
                                        : 'text-slate-400 dark:text-gray-500'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connecting Line (except for last item) */}
                        {i < steps.length - 1 && (
                            <div className="mx-4 w-16 h-[1px] bg-slate-200 dark:bg-[#1F2937]"></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
