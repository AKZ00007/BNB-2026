'use client'
import * as Switch from '@radix-ui/react-switch'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { Button } from '@/components/ui/button'
import { BorderBeam } from '@/components/ui/border-beam'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Pricing() {
    const [isAnnual, setIsAnnual] = useState(false)

    const plans = [
        {
            name: 'Starter',
            desc: 'Perfect for experimental memecoins.',
            price: isAnnual ? '$0' : '$0',
            period: 'always free',
            features: ['Basic ERC20 Generation', 'Standard 5% Tax', 'No initial vesting', 'Community Discord Access'],
            cta: 'Deploy Free',
            highlight: false
        },
        {
            name: 'Pro',
            desc: 'For serious utility tokens and DAOs.',
            price: isAnnual ? '$79' : '$99',
            period: 'per deployment',
            features: ['AI Tokenomics Generator', 'Anti-Sniper Block 1-3', 'OpenZeppelin Vesting', 'Priority Email Support'],
            cta: 'Get Pro',
            highlight: true
        },
        {
            name: 'Enterprise',
            desc: 'For massive scale protocols.',
            price: 'Custom',
            period: 'contact sales',
            features: ['Custom AMM Integrations', 'Dedicated Solidity Dev', 'Certik Audit Fast-Track', '24/7 Phone Support'],
            cta: 'Contact Us',
            highlight: false
        }
    ]

    return (
        <section className="py-24 bg-[#F9FAFB] relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />

            <div className="max-w-[1200px] mx-auto px-8 relative">
                <div className="text-center mb-16">
                    <SectionLabel>Pricing</SectionLabel>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-8">
                        Simple, transparent pricing.
                    </h2>

                    <div className="flex items-center justify-center gap-4">
                        <span className={cn("text-sm font-semibold", !isAnnual ? "text-[#111827]" : "text-[#6B7280]")}>Pay per launch</span>
                        <Switch.Root
                            className="w-[42px] h-[24px] bg-[#E5E7EB] rounded-full relative data-[state=checked]:bg-primary outline-none cursor-pointer transition-colors"
                            checked={isAnnual}
                            onCheckedChange={setIsAnnual}
                        >
                            <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-100 translate-x-[2px] will-change-transform data-[state=checked]:translate-x-[19px] shadow-sm" />
                        </Switch.Root>
                        <span className={cn("text-sm font-semibold flex items-center gap-2", isAnnual ? "text-[#111827]" : "text-[#6B7280]")}>
                            Annual Pass <span className="bg-[#FEE2E2] text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">Save 20%</span>
                        </span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={cn(
                                "relative bg-white rounded-3xl p-8 border flex flex-col hover:scale-[1.02] transition-transform duration-300",
                                plan.highlight ? "border-primary shadow-[0_24px_64px_rgba(232,0,29,0.12)] z-10" : "border-[#E5E7EB] shadow-sm"
                            )}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-[#111827] mb-2">{plan.name}</h3>
                                <p className="text-[#6B7280] text-sm h-10">{plan.desc}</p>
                            </div>
                            <div className="mb-8 flex items-end gap-2">
                                <span className="text-5xl font-extrabold text-[#111827] tracking-tight">{plan.price}</span>
                                <span className="text-[#6B7280] text-sm mb-2">{plan.period}</span>
                            </div>
                            <Button variant={plan.highlight ? 'primary' : 'outline'} className="w-full mb-8" size="lg">
                                {plan.cta}
                            </Button>
                            <ul className="flex flex-col gap-4 mt-auto">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex gap-3 text-sm text-[#374151]">
                                        <Check className="w-5 h-5 text-primary shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            {plan.highlight && (
                                <BorderBeam duration={8} size={100} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
