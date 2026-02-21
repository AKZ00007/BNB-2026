'use client'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { BlurFade } from '@/components/ui/blur-fade'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import { Link2, ShieldAlert, Cpu, Lock } from 'lucide-react'

const features = [
    {
        icon: <Cpu className="w-5 h-5 text-primary" />,
        title: 'AI Risk Scanner',
        desc: 'Before you buy any BEP-20 token, our AI analyzes the contract, holder distribution, and liquidity in under 5 seconds to provide a clear safety score.'
    },
    {
        icon: <ShieldAlert className="w-5 h-5 text-primary" />,
        title: 'Guardian Token Templates',
        desc: 'Launch tokens using pre-audited templates with immutable safety rules. Structural immunity to snipers, hidden mints, and honeypots.'
    },
    {
        icon: <Lock className="w-5 h-5 text-primary" />,
        title: 'Progressive Liquidity Unlock (PLU)',
        desc: 'Liquidity unlocks are driven by real-time project health scores, not just time. Healthy tokens unlock smoothly; scams trigger emergency freezes.'
    },
    {
        icon: <Link2 className="w-5 h-5 text-primary" />,
        title: 'Live Monitoring Network',
        desc: 'Continuous chain-wide monitoring. Our AI translates complex on-chain dumps and malicious dev transactions into plain-language early warnings.'
    }
]

export function Solution() {
    return (
        <section className="py-24 bg-[#F9FAFB] dark:bg-[#0a0a0c] border-t border-[#E5E7EB] dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-[1200px] mx-auto px-8 relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Text */}
                    <div>
                        <SectionLabel className="!text-left">The Solution</SectionLabel>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] dark:text-gray-100 mb-6 tracking-tight leading-tight transition-colors">
                            An enterprise-grade launchpad powered by AI.
                        </h2>
                        <p className="text-lg text-[#6B7280] dark:text-gray-400 mb-8 transition-colors">
                            A dual-layer protocol. The <strong>Control Layer</strong> makes scams structurally impossible for tokens deployed here. The <strong>Intelligence Layer</strong> gives you chain-wide AI protection anywhere on BNB Chain.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {features.map((feature, i) => (
                                <BlurFade key={i} delay={0.1 * i} inView className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FEE2E2] dark:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111827] dark:text-gray-100 mb-1 text-[15px] transition-colors">{feature.title}</h4>
                                        <p className="text-[14px] text-[#6B7280] dark:text-gray-400 leading-snug transition-colors">{feature.desc}</p>
                                    </div>
                                </BlurFade>
                            ))}
                        </div>
                    </div>

                    {/* Right Hero Video Graphic */}
                    <BlurFade delay={0.4} inView className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/20 blur-3xl rounded-full translate-x-10 translate-y-10 transition-colors" />
                        <div className="relative">
                            <HeroVideoDialog
                                className="block dark:hidden"
                                animationStyle="from-center"
                                videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                                thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                                thumbnailAlt="BNB Launchpad Hero Video"
                            />
                            <HeroVideoDialog
                                className="hidden dark:block"
                                animationStyle="from-center"
                                videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                                thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                                thumbnailAlt="BNB Launchpad Hero Video"
                            />
                        </div>
                    </BlurFade>

                </div>
            </div>
        </section>
    )
}
