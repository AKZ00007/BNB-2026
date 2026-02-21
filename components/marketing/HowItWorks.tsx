'use client'
import * as Accordion from '@radix-ui/react-accordion'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { BlurFade } from '@/components/ui/blur-fade'
import { useState } from 'react'

const steps = [
    {
        id: 'step-1',
        title: '1. Describe your vision',
        content: 'Type in plain English what you want to achieve. E.g., "A governance token with a 5% marketing tax and anti-whale measures."'
    },
    {
        id: 'step-2',
        title: '2. AI generates tokenomics',
        content: 'Our models instantly simulate thousands of liquidity events to output the optimal configurations and OpenZeppelin contract drafts.'
    },
    {
        id: 'step-3',
        title: '3. Testnet Simulation',
        content: 'We dry-run your contract against simulated sniper bots to ensure your exponential tax routing holds up before going live.'
    },
    {
        id: 'step-4',
        title: '4. 1-Click BSC Deployment',
        content: 'Connect your EVM wallet via RainbowKit and deploy directly to the Binance Smart Chain. Verification happens automatically.'
    }
]

export function HowItWorks() {
    const [activeStep, setActiveStep] = useState('step-1')

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-[1200px] mx-auto px-8">
                <BlurFade inView>
                    <div className="text-center mb-16">
                        <SectionLabel>How It Works</SectionLabel>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight">
                            From idea to deployment in 4 steps.
                        </h2>
                    </div>
                </BlurFade>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Radix Accordion */}
                    <Accordion.Root
                        type="single"
                        defaultValue="step-1"
                        collapsible
                        onValueChange={(val) => val && setActiveStep(val)}
                        className="flex flex-col gap-4"
                    >
                        {steps.map((step, i) => (
                            <Accordion.Item
                                key={step.id}
                                value={step.id}
                                className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden data-[state=open]:border-primary transition-colors focus-within:ring-2 focus-within:ring-primary/20"
                            >
                                <Accordion.Header>
                                    <Accordion.Trigger className="w-full text-left px-6 py-5 flex items-center justify-between group">
                                        <span className="font-bold text-lg text-[#111827] group-data-[state=open]:text-primary transition-colors">
                                            {step.title}
                                        </span>
                                        <span className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] group-data-[state=open]:bg-primary group-data-[state=open]:border-primary group-data-[state=open]:text-white transition-all">
                                            {activeStep === step.id ? '−' : '+'}
                                        </span>
                                    </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content className="px-6 pb-6 pt-0 text-[#6B7280] leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                                    {step.content}
                                </Accordion.Content>
                            </Accordion.Item>
                        ))}
                    </Accordion.Root>

                    {/* Right: Mockup Image/Graphic changing based on state */}
                    <div className="relative sticky top-32 lg:h-[400px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-8 overflow-hidden flex flex-col items-center justify-center">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#F3F4F6] to-transparent pointer-events-none" />

                        {/* Simple visual mockups reacting to state */}
                        {activeStep === 'step-1' && (
                            <div className="w-full max-w-[300px] bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-4 animate-fade-in">
                                <div className="w-full h-8 bg-gray-100 rounded mb-2 flex items-center px-2 text-xs text-gray-400">Describe tokenomics...</div>
                                <div className="w-32 h-8 bg-primary rounded" />
                            </div>
                        )}

                        {activeStep === 'step-2' && (
                            <div className="w-full max-w-[300px] grid grid-cols-2 gap-4 animate-fade-in">
                                <div className="h-24 bg-white rounded-xl shadow-lg border border-primary/20 p-4 border-l-4 border-l-primary flex flex-col justify-center">
                                    <div className="text-primary font-bold text-xl">5%</div>
                                    <div className="text-xs text-gray-500">Marketing Tax</div>
                                </div>
                                <div className="h-24 bg-white rounded-xl shadow border border-gray-200 p-4 border-l-4 border-l-gray-400 flex flex-col justify-center">
                                    <div className="text-gray-900 font-bold text-xl">2%</div>
                                    <div className="text-xs text-gray-500">Auto-Burn</div>
                                </div>
                            </div>
                        )}

                        {activeStep === 'step-3' && (
                            <div className="w-full max-w-[300px] bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-4 text-xs font-mono animate-fade-in">
                                <div className="text-green-500 mb-1">✓ Bot #2293 blocked</div>
                                <div className="text-green-500 mb-1">✓ Bot #4401 taxed 99%</div>
                                <div className="text-green-500">✓ Liquidity locked securely</div>
                            </div>
                        )}

                        {activeStep === 'step-4' && (
                            <div className="w-48 h-48 rounded-full border-8 border-[#F0B90B] flex flex-col items-center justify-center bg-white shadow-xl animate-scale-in">
                                <div className="text-[#F0B90B] text-4xl mb-2">🚀</div>
                                <div className="font-bold text-gray-900">Deployed</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
