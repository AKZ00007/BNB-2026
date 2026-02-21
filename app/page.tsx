'use client';

import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import ScrollytellingCanvas from '@/components/hero/ScrollytellingCanvas';
import NarrativeBlocks from '@/components/hero/NarrativeBlocks';

// New SaaS Marketing Components
import { LogoTicker } from '@/components/marketing/LogoTicker';
import { Problem } from '@/components/marketing/Problem';
import { Solution } from '@/components/marketing/Solution';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Features } from '@/components/marketing/Features';
import { TestimonialsWall } from '@/components/marketing/TestimonialsWall';
import { Pricing } from '@/components/marketing/Pricing';
import { FAQ } from '@/components/marketing/FAQ';
import { CTABanner } from '@/components/marketing/CTABanner';

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end end'],
    });

    return (
        <>
            {/* ─── Scrollytelling Hero with BNB Coin Animation ─────────────────── */}
            <div ref={heroRef} className="relative bg-brand-charcoal text-white" style={{ height: '600vh' }}>
                {/* Single sticky viewport — sticks to top during scroll, scrolls away when hero ends */}
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {/* Canvas layer — behind everything */}
                    <div className="absolute inset-0 z-0">
                        <ScrollytellingCanvas scrollYProgress={scrollYProgress} />
                    </div>

                    {/* Narrative text layer — on top of canvas */}
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <NarrativeBlocks scrollYProgress={scrollYProgress} />
                    </div>
                </div>
            </div>

            {/* ─── Hero to SaaS Transition layer ─────── */}
            <div className="h-48 bg-gradient-to-b from-brand-charcoal to-[#FAFAFA] dark:to-gray-950 relative z-20 pointer-events-none transition-colors duration-300" />

            {/* ─── Content sections that appear AFTER the scroll experience ─────── */}
            <div className="relative z-20 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <LogoTicker />
                <Problem />
                <Solution />
                <HowItWorks />
                <Features />
                <TestimonialsWall />
                <Pricing />
                <FAQ />
                <CTABanner />
            </div>
        </>
    );
}
