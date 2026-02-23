'use client'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { BlurText } from '@/components/shared/BlurText'
import { BlurFade } from '@/components/ui/blur-fade'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { ArrowRightIcon, Ghost, TrendingDown, Skull, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

const challenges = [
    {
        icon: <TrendingDown className="w-8 h-8 text-red-500" />,
        title: 'Pump & Dumps',
        desc: 'Tokens launch with zero liquidity protection. Devs hold massive wallets and remove LP at will, leaving investors with worthless bags.'
    },
    {
        icon: <Skull className="w-8 h-8 text-gray-400" />,
        title: 'Malicious Smart Contracts',
        desc: 'Hidden mint functions, targeted blacklists, and honeypot code trap retail investors before they even realize what happened.'
    },
    {
        icon: <Ghost className="w-8 h-8 text-primary" />,
        title: 'Zero Post-Launch Intelligence',
        desc: 'Once a token is live, users are flying blind. There are no early AI warnings before a massive dev sell-off drops the price 90%.'
    }
]

export function Problem() {
    return (
        <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden transition-colors duration-300">
            <div className="max-w-[1200px] mx-auto px-8">
                <div className="z-10 flex mb-8 items-center justify-center">
                    <div className={cn(
                        "group rounded-full border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    )}>
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 transition ease-out hover:text-neutral-600 dark:hover:text-neutral-300 hover:duration-300">
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5"><Megaphone className="w-4 h-4 text-primary" /> Announcement → Introducing the new GROWUP AI</span>
                            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                        </AnimatedShinyText>
                    </div>
                </div>

                <div className="text-center max-w-[680px] mx-auto mb-16">
                    <SectionLabel>The Problem</SectionLabel>
                    <BlurText
                        text="Launching a token on BSC shouldn't feel like a gamble."
                        className="text-4xl md:text-5xl font-extrabold text-[#111827] dark:text-gray-100 mb-6 tracking-tight leading-tight transition-colors"
                    />
                    <BlurFade delay={0.2} inView>
                        <p className="text-lg text-[#6B7280] dark:text-gray-400 transition-colors">
                            90% of tokens launched on BNB Chain are designed to fail—whether through malicious smart contracts, instant liquidity drains, or zero post-launch transparency.
                        </p>
                    </BlurFade>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {challenges.map((item, i) => (
                        <BlurFade key={i} delay={0.3 + (i * 0.1)} inView className="bg-[#F9FAFB] dark:bg-gray-900 rounded-2xl p-8 border border-[#E5E7EB] dark:border-gray-800 hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300">
                            <div className="mb-6 bg-white dark:bg-gray-800 w-16 h-16 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">{item.icon}</div>
                            <h3 className="text-xl font-bold text-[#111827] dark:text-gray-100 mb-3 transition-colors">{item.title}</h3>
                            <p className="text-[15px] text-[#6B7280] dark:text-gray-400 leading-relaxed transition-colors">{item.desc}</p>
                        </BlurFade>
                    ))}
                </div>
            </div>
        </section>
    )
}
