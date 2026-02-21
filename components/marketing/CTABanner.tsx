import { Button } from '@/components/ui/button'

export function CTABanner() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1200px] mx-auto px-8">
                <div className="bg-[#FFF0F0] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden flex flex-col items-center">
                    {/* Subtle bg glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-primary/5 blur-3xl pointer-events-none" />

                    <h2 className="text-4xl md:text-6xl font-extrabold text-[#111827] mb-6 tracking-tight relative z-10 max-w-2xl">
                        Launch your token the right way.
                    </h2>
                    <p className="text-lg text-[#6B7280] mb-10 max-w-xl relative z-10">
                        Stop relying on unverified copy-pasters. Generate safe, audited, and optimized token contracts in seconds with AI.
                    </p>
                    <div className="relative z-10 flex gap-4">
                        <Button size="lg" className="px-10 text-lg">Start Building Free</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
