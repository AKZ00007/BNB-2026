'use client';

import { motion, useTransform, MotionValue } from 'framer-motion';
import Link from 'next/link';

interface Props {
    scrollYProgress: MotionValue<number>;
}

export default function NarrativeBlocks({ scrollYProgress }: Props) {

    // 0-15%: Hero
    const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.2], [1, 1, 0, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

    // 15-40%: "Data-Driven Tokenomics"
    const explodeOpacity = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
    const explodeY = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [50, 0, 0, -50]);

    // 40-60%: "3 Survival Scenarios"
    const peakOpacity = useTransform(scrollYProgress, [0.38, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
    const peakY = useTransform(scrollYProgress, [0.38, 0.45, 0.55, 0.6], [50, 0, 0, -50]);

    // 60-78%: "1-Click BSC Deployment"
    const deployOpacity = useTransform(scrollYProgress, [0.58, 0.65, 0.73, 0.78], [0, 1, 1, 0]);
    const deployY = useTransform(scrollYProgress, [0.58, 0.65, 0.73, 0.78], [50, 0, 0, -50]);

    // 78-100%: Final CTA — stays visible until fully scrolled past
    const finalOpacity = useTransform(scrollYProgress, [0.78, 0.85, 1], [0, 1, 1]);
    const finalY = useTransform(scrollYProgress, [0.78, 0.85, 1], [50, 0, 0]);

    return (
        <>
            {/* 0-15% Hero */}
            <motion.div
                style={{ opacity: heroOpacity, y: heroY }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-2xl">
                    GROWUP AI
                </h1>
                <p className="mt-6 text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-gold to-cyan font-medium">
                    AI-Powered Token Launches
                </p>
                <p className="mt-8 text-white/50 text-lg md:text-xl max-w-lg">
                    Crash-proof tokenomics. <br /> Deploy in 3 minutes.
                </p>
            </motion.div>

            {/* 15-40% Engineering Reveal */}
            <motion.div
                style={{ opacity: explodeOpacity, y: explodeY }}
                className="absolute inset-0 flex flex-col justify-center px-[10%] md:px-[15%]"
            >
                <div className="max-w-xl text-left">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        Layer 1: <br /> Built-in Safety
                    </h2>
                    <p className="text-xl md:text-2xl text-white/60 leading-relaxed">
                        Guardian Token Templates. Structurally immune to snipers, hidden mints, and honeypots.
                    </p>
                </div>
            </motion.div>

            {/* 40-60% Simulations & Security */}
            <motion.div
                style={{ opacity: peakOpacity, y: peakY }}
                className="absolute inset-0 flex flex-col justify-center items-end px-[10%] md:px-[15%] text-right"
            >
                <div className="max-w-xl">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
                        Layer 2: <br /> AI Intelligence
                    </h2>
                    <ul className="space-y-6 text-xl text-white/70">
                        <li className="flex items-center justify-end gap-3">
                            <span className="text-cyan">Sub-5 second AI Risk Scans</span>
                        </li>
                        <li className="flex items-center justify-end gap-3">
                            <span className="text-gold">Live BNB Chain Feed</span>
                        </li>
                        <li className="flex items-center justify-end gap-3">
                            <span className="text-white">Human-readable AI warnings</span>
                        </li>
                    </ul>
                </div>
            </motion.div>

            {/* 60-78% Deployment */}
            <motion.div
                style={{ opacity: deployOpacity, y: deployY }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                    Progressive Liquidity Unlock
                </h2>
                <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto">
                    Health-based LP unlocks. Healthy tokens unlock. Scams freeze.
                </p>
            </motion.div>

            {/* 78-100% Final CTA */}
            <motion.div
                style={{ opacity: finalOpacity, y: finalY }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-brand-charcoal/30 backdrop-blur-sm"
            >
                <h2 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl">
                    End 80% Memecoin Crashes
                </h2>
                <p className="text-xl md:text-2xl text-gold/90 mb-12">
                    Built for BNB Hackathon: PLU & AI Tracks
                </p>

                <div className="flex flex-col sm:flex-row gap-6 items-center pointer-events-auto">
                    <Link
                        href="/create"
                        className="relative group px-10 py-5 rounded-full overflow-hidden font-bold text-lg text-brand-charcoal shadow-xl shadow-gold/20 hover:shadow-cyan/40 transition-shadow duration-500"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold to-cyan transition-transform duration-500 group-hover:scale-105" />
                        <span className="relative drop-shadow-sm text-brand-charcoal">Launch Token Now</span>
                    </Link>

                    <Link
                        href="/templates"
                        className="px-10 py-5 rounded-full font-semibold text-lg text-white border border-white/20 hover:bg-white/5 transition-colors duration-300"
                    >
                        View Templates
                    </Link>
                </div>
            </motion.div>
        </>
    );
}
