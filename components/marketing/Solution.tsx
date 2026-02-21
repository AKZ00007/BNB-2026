'use client'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { BlurFade } from '@/components/ui/blur-fade'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import { Link2, ShieldAlert, Cpu, Lock } from 'lucide-react'

const features = [
    {
        icon: <Cpu className="w-5 h-5 text-primary" />,
        title: 'AI Smart Configs',
        desc: 'Tell the AI what your project does (e.g. "Deflationary DAO token"). It instantly generates the perfect liquidity ratios and tax splits.'
    },
    {
        icon: <ShieldAlert className="w-5 h-5 text-primary" />,
        title: 'Auto Anti-Sniper',
        desc: 'Block 1-3 MEV attack mitigation built-in. Dynamic tax automatically punishes block-zero buyers to protect real investors.'
    },
    {
        icon: <Lock className="w-5 h-5 text-primary" />,
        title: 'OpenZeppelin Verified',
        desc: 'Contracts are built from secure OpenZeppelin foundations. Team tokens are automatically locked into algorithmic vesting schedules.'
    },
    {
        icon: <Link2 className="w-5 h-5 text-primary" />,
        title: '1-Click BSC Deploy',
        desc: 'Connect your wallet via RainbowKit, hit deploy, and boom—your tokens and AMM pool are officially live on BNB Smart Chain.'
    }
]

export function Solution() {
    return (
        <section className="py-24 bg-[#F9FAFB] border-t border-[#E5E7EB]">
            <div className="max-w-[1200px] mx-auto px-8 relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Text */}
                    <div>
                        <SectionLabel className="!text-left">The Solution</SectionLabel>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight leading-tight">
                            An enterprise-grade launchpad powered by AI.
                        </h2>
                        <p className="text-lg text-[#6B7280] mb-8">
                            We took the $10,000 auditing process and compressed it into a single AI prompt. Generate, simulate, and deploy battle-tested tokenomics without writing a single line of Solidity.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {features.map((feature, i) => (
                                <BlurFade key={i} delay={0.1 * i} inView className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111827] mb-1 text-[15px]">{feature.title}</h4>
                                        <p className="text-[14px] text-[#6B7280] leading-snug">{feature.desc}</p>
                                    </div>
                                </BlurFade>
                            ))}
                        </div>
                    </div>

                    {/* Right Hero Video Graphic */}
                    <BlurFade delay={0.4} inView className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full translate-x-10 translate-y-10" />
                        <div className="relative">
                            <HeroVideoDialog
                                className="block"
                                animationStyle="from-center"
                                videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                                thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                                thumbnailAlt="BNB Launchpad Hero Video"
                            />
                        </div>
                    </BlurFade>

                </div>
            </div>
        </section>
    )
}
