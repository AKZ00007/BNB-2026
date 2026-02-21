'use client';

import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import Link from 'next/link';
import {
    Sparkles, BarChart3, Rocket, Shield, Settings, Zap,
    ArrowRight, ChevronRight, Globe, Github, Twitter,
    MessageSquare, LineChart
} from 'lucide-react';
import ScrollytellingCanvas from '@/components/hero/ScrollytellingCanvas';
import NarrativeBlocks from '@/components/hero/NarrativeBlocks';

const features = [
    {
        icon: Sparkles,
        gradient: 'from-gold to-gold/20',
        title: 'AI Configuration',
        desc: 'Describe your goals in plain English. Our AI analyzes 50+ successful launches to generate crash-proof tokenomics.',
    },
    {
        icon: BarChart3,
        gradient: 'from-purple to-purple/20',
        title: 'Price Simulations',
        desc: 'See 3 price scenarios (Good, Normal, Bad) before launch. Understand exactly how your token will behave.',
    },
    {
        icon: Rocket,
        gradient: 'from-[#22C55E] to-[#22C55E]/20',
        title: '1-Click Deploy',
        desc: 'Connect MetaMask → mint token → deploy vesting → create LP. All automated on BSC Testnet.',
    },
    {
        icon: Shield,
        gradient: 'from-[#3B82F6] to-[#3B82F6]/20',
        title: 'Progressive Liquidity Unlock',
        desc: 'Prevent rug pulls with milestone-based LP unlocks. Build investor trust with on-chain verified schedules.',
    },
    {
        icon: Settings,
        gradient: 'from-[#F59E0B] to-[#F59E0B]/20',
        title: 'AMM Customization',
        desc: 'Configure bonding curves, fee structures, and anti-whale limits for PancakeSwap.',
    },
    {
        icon: LineChart,
        gradient: 'from-[#EF4444] to-[#EF4444]/20',
        title: 'Post-Launch Growth',
        desc: 'Real-time analytics, vesting dashboards, and export tools. Grow your token\'s health after deployment.',
    },
];

const steps = [
    {
        num: '01',
        title: 'Describe Your Vision',
        desc: 'Tell the AI what kind of token you want — community meme coin, DeFi utility token, or NFT-backed DAO.',
        icon: MessageSquare,
    },
    {
        num: '02',
        title: 'AI Generates Tokenomics',
        desc: 'In seconds, receive a complete config: supply, TGE%, vesting schedule, AMM settings, and a risk score.',
        icon: Sparkles,
    },
    {
        num: '03',
        title: 'Simulate & Deploy',
        desc: 'View price simulations, export your config, and deploy a real ERC-20 to BSC Testnet in one click.',
        icon: Rocket,
    },
];

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

            {/* ─── Content sections that appear AFTER the scroll experience ─────── */}
            <div className="relative z-20 bg-bg-base text-text-primary">

                {/* ─── How It Works ─────────────────────────────────────────────── */}
                <section className="py-24 px-6 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,214,255,0.06),transparent_60%)]" />
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium mb-4">
                                <Zap className="w-3.5 h-3.5" />
                                3 Simple Steps
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                                How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-cyan">Works</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {steps.map(({ num, title, desc, icon: Icon }, i) => (
                                <div key={num} className="relative glass-card rounded-2xl p-8 group hover:glass-card-prominent transition-all">
                                    {/* Connector line */}
                                    {i < 2 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-white/15" />
                                    )}
                                    <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white/15 to-transparent mb-4 select-none">
                                        {num}
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6 text-gold" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-text-primary">{title}</h3>
                                    <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/create"
                                className="inline-flex items-center gap-2 text-gold font-semibold hover:underline"
                            >
                                Try it now — it&apos;s free <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ─── Features ────────────────────────────────────────────────── */}
                <section className="py-24 px-6 bg-bg-surface">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-4">
                                <Sparkles className="w-3.5 h-3.5" />
                                Feature-Rich
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                                Everything You Need to{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-cyan">
                                    Launch Successfully
                                </span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map(({ icon: Icon, gradient, title, desc }) => (
                                <div key={title} className="glass-card rounded-2xl p-7 hover:glass-card-prominent transition-all group">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-text-primary">{title}</h3>
                                    <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Tech Stack Banner ───────────────────────────────────────── */}
                <section className="py-16 px-6 border-y border-white/5">
                    <div className="max-w-5xl mx-auto">
                        <p className="text-center text-text-tertiary text-sm mb-8 uppercase tracking-wider font-medium">
                            Built With
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 text-text-secondary text-sm font-medium">
                            {['BNB Chain', 'Gemini AI', 'Next.js 15', 'OpenZeppelin', 'PancakeSwap', 'wagmi/viem', 'Recharts', 'Supabase'].map(t => (
                                <span key={t} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:text-gold hover:border-gold/20 transition-all">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Final CTA ───────────────────────────────────────────────── */}
                <section className="py-24 px-6 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(240,185,11,0.08),transparent_60%)]" />
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
                            Ready to Launch?
                        </h2>
                        <p className="text-lg text-text-secondary mb-10">
                            Stop guessing. Let AI design your tokenomics, simulate outcomes, and deploy to BSC — all in one flow.
                        </p>
                        <Link
                            href="/create"
                            className="group inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-brand-charcoal rounded-xl transition-all hover:scale-105 animate-pulse-glow"
                            style={{ background: 'linear-gradient(135deg, #F0B90B 0%, #00D6FF 100%)' }}
                        >
                            <Rocket className="w-6 h-6" />
                            Create Your Token — Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-text-tertiary text-sm mt-4">
                            No sign-up required. Just connect your wallet.
                        </p>
                    </div>
                </section>

                {/* ─── Footer ──────────────────────────────────────────────────── */}
                <footer className="border-t border-white/10 py-12 px-6 bg-bg-surface">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F0B90B, #00D6FF)' }}>
                                        <Rocket className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-bold text-lg text-text-primary">BNB Launchpad</span>
                                </div>
                                <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
                                    AI-powered tokenomics designer for the BNB Chain ecosystem. Generate, simulate, and deploy tokens with confidence.
                                </p>
                            </div>

                            {/* Links */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 text-text-tertiary uppercase tracking-wider">Product</h4>
                                <ul className="space-y-2">
                                    {[
                                        { label: 'Create Token', href: '/create' },
                                        { label: 'Templates', href: '/templates' },
                                        { label: 'Explorer', href: '/explorer' },
                                        { label: 'Dashboard', href: '/dashboard' },
                                    ].map(l => (
                                        <li key={l.label}>
                                            <Link href={l.href} className="text-text-secondary text-sm hover:text-gold transition-colors">
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Social */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 text-text-tertiary uppercase tracking-wider">Connect</h4>
                                <div className="flex gap-3">
                                    {[
                                        { icon: Github, href: '#', label: 'GitHub' },
                                        { icon: Twitter, href: '#', label: 'Twitter' },
                                        { icon: Globe, href: '#', label: 'Website' },
                                    ].map(({ icon: Icon, href, label }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={label}
                                            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold/20 transition-all"
                                        >
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-text-tertiary text-xs">
                            <p>© 2026 BNB Launchpad. Built for BNB Chain.</p>
                            <p className="flex items-center gap-1">
                                Made with <span className="text-gold">♥</span> for the BNB Bangalore Hackathon
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
