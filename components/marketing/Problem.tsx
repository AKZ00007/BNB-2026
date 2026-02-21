'use client'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { BlurText } from '@/components/shared/BlurText'
import { BlurFade } from '@/components/ui/blur-fade'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { ArrowRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const challenges = [
    {
        icon: '😭',
        title: 'Bots Drain Your Liquidity',
        desc: 'MEV bots and snipers routinely drain 40%+ of initial liquidity within block 1. Without exponential tax protocols, your launch is doomed.'
    },
    {
        icon: '📉',
        title: 'Flawed Tokenomics',
        desc: 'Copy-pasting SafeMoon contracts leaves critical logical gaps in liquidity routing, causing the notorious "slow bleed" chart.'
    },
    {
        icon: '💀',
        title: 'High Dev Costs',
        desc: 'Hiring a solidity dev to write a secure vesting schedule and anti-whale protocol costs $5k-10k and takes weeks to audit.'
    }
]

export function Problem() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-8">
                <div className="z-10 flex mb-8 items-center justify-center">
                    <div className={cn(
                        "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200"
                    )}>
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 transition ease-out hover:text-neutral-600 hover:duration-300">
                            <span className="text-sm font-semibold">📣 Announcement → Introducing the new BNB Launchpad</span>
                            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                        </AnimatedShinyText>
                    </div>
                </div>

                <div className="text-center max-w-[680px] mx-auto mb-16">
                    <SectionLabel>The Problem</SectionLabel>
                    <BlurText
                        text="Launching a token on BSC shouldn't feel like a gamble."
                        className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight leading-tight"
                    />
                    <BlurFade delay={0.2} inView>
                        <p className="text-lg text-[#6B7280]">
                            90% of new tokens fail not because the community is dead, but because the underlying math and smart contract infrastructure was built to fail.
                        </p>
                    </BlurFade>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {challenges.map((item, i) => (
                        <BlurFade key={i} delay={0.3 + (i * 0.1)} inView className="bg-[#F9FAFB] rounded-2xl p-8 border border-[#E5E7EB] hover:shadow-lg transition-shadow duration-300">
                            <div className="text-4xl mb-6">{item.icon}</div>
                            <h3 className="text-xl font-bold text-[#111827] mb-3">{item.title}</h3>
                            <p className="text-[15px] text-[#6B7280] leading-relaxed">{item.desc}</p>
                        </BlurFade>
                    ))}
                </div>
            </div>
        </section>
    )
}
