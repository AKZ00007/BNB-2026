'use client'
import { Marquee } from '@/components/ui/marquee'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { Highlighter } from '@/components/ui/highlighter'

const testimonials = [
    { name: '0xGhost', title: 'DAO Founder', text: <>I used to pay audits 10k. Now I press deploy on BNB Launchpad and sleep like a baby. <Highlighter action="highlight" color="#FEE2E2">The anti-whale protections are flawless.</Highlighter></> },
    { name: 'Sarah', title: 'Token Dev', text: <>The customizable OpenZeppelin vesting schedules took literally 4 clicks. <Highlighter action="highlight" color="#FEE2E2">This is the future of smart contract deployment.</Highlighter></> },
    { name: 'Abe', title: 'Degen Trader', text: <>Tokens launched here don't get sniped on block 1 because of the exponential tax. <Highlighter action="highlight" color="#FEE2E2">Finally, a fair launchpad.</Highlighter></> },
    { name: 'DeFi_Dan', title: 'Yield Farmer', text: <>The AMM optimization tools saved us months of math. The UI is gorgeous, the code is solid.</> },
    { name: 'CryptoJane', title: 'Community Lead', text: <>We launched our memecoin here. Zero technical knowledge needed. <Highlighter action="highlight" color="#FEE2E2">The community feels so much safer knowing it's verified.</Highlighter></> },
    { name: 'Mike_T', title: 'Fund Manager', text: <>If a token isn't launched through this protocol, I don't even look at it anymore. The standard has been raised.</> }
]

function ReviewCard({ name, title, text }: { name: string, title: string, text: React.ReactNode }) {
    return (
        <div className="w-[380px] bg-white dark:bg-gray-900 rounded-3xl p-8 border border-[#E5E7EB] dark:border-gray-800 shadow-sm flex flex-col justify-between hover:shadow-md dark:hover:shadow-primary/5 transition-shadow">
            <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <div className="text-[16px] text-[#374151] dark:text-gray-300 leading-relaxed mb-6 font-medium transition-colors">{text}</div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FEE2E2] dark:from-primary/20 to-[#F1F5F9] dark:to-gray-800 border border-[#E5E7EB] dark:border-gray-700 flex items-center justify-center font-bold text-primary transition-colors">
                    {name[0]}
                </div>
                <div>
                    <h4 className="font-bold text-[#111827] dark:text-gray-100 text-sm transition-colors">{name}</h4>
                    <p className="text-xs text-[#6B7280] dark:text-gray-400 transition-colors">{title}</p>
                </div>
            </div>
        </div>
    )
}

export function TestimonialsWall() {
    const row1 = testimonials.slice(0, 3)
    const row2 = testimonials.slice(3, 6)
    const row3 = [...testimonials.slice(1, 4)]

    return (
        <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-300">
            <div className="text-center mb-16 px-8">
                <SectionLabel>Wall of Love</SectionLabel>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] dark:text-gray-100 mb-6 transition-colors">Built for builders.</h2>
                <p className="text-lg text-[#6B7280] dark:text-gray-400 transition-colors">Join hundreds of founders who launched their tokens safely on BSC.</p>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {row1.map((item, i) => (
                        <ReviewCard key={i} {...item} />
                    ))}
                </Marquee>

                <Marquee reverse pauseOnHover className="[--duration:40s]">
                    {row2.map((item, i) => (
                        <ReviewCard key={i} {...item} />
                    ))}
                </Marquee>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-gray-950 to-transparent transition-colors duration-300" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-gray-950 to-transparent transition-colors duration-300" />
            </div>
        </section>
    )
}
