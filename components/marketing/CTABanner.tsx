import { Button } from '@/components/ui/button'

export function CTABanner() {
    return (
        <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
            <div className="max-w-[1200px] mx-auto px-8">
                <div className="bg-[#FFF0F0] dark:bg-gray-900 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden flex flex-col items-center border border-transparent dark:border-gray-800 transition-colors">
                    {/* Subtle bg glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-primary/5 blur-3xl pointer-events-none" />

                    <h2 className="text-4xl md:text-6xl font-extrabold text-[#111827] dark:text-gray-100 mb-6 tracking-tight relative z-10 max-w-2xl transition-colors">
                        Two layers of absolute protection.
                    </h2>
                    <p className="text-lg text-[#6B7280] dark:text-gray-400 mb-10 max-w-xl relative z-10 transition-colors">
                        Generate safe tokens instantly via our Control Layer, and scan any address on BNB Chain with our AI Intelligence Layer.
                    </p>
                    <div className="relative z-10 flex gap-4">
                        <Button size="lg" className="px-10 text-lg">Launch Your Token</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
