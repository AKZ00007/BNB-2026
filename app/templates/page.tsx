'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Bot, PieChart, Settings, Lock, Lightbulb, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKEN_TEMPLATES, TEMPLATE_CATEGORIES, type TokenTemplate } from '@/lib/templates';
import { Dock, DockIcon } from '@/components/magicui/dock';
import { MagicBento, ParticleCard } from '@/components/magicui/magic-bento';

export default function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState<TokenTemplate | null>(null);
    const router = useRouter();

    const filtered =
        activeCategory === 'all'
            ? TOKEN_TEMPLATES
            : TOKEN_TEMPLATES.filter((t) => t.category === activeCategory);

    const handleApplyTemplate = (template: TokenTemplate) => {
        // Store config in sessionStorage so the create page can pick it up
        sessionStorage.setItem('template_config', JSON.stringify(template.config));
        sessionStorage.setItem('template_name', template.name);
        router.push('/create?template=true');
    };

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden relative transition-colors duration-300">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple/6 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-gold/4 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple/10 border border-purple/20 text-sm text-purple mb-4">
                            <Sparkles className="w-4 h-4" /> AI-Optimized Templates
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Launch{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold via-gold to-purple">
                                Smarter
                            </span>
                            {' '}with Templates
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-colors">
                            Pre-built tokenomics configurations optimized for specific project categories.
                            Choose a template, customize it, and deploy — all in under 5 minutes.
                        </p>
                    </div>

                    {/* Category Tabs (Magic UI Dock with Expanding Pill) */}
                    <div className="flex justify-center mb-10">
                        <Dock direction="middle" iconSize={48} className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
                            {TEMPLATE_CATEGORIES.map((cat) => (
                                <DockIcon
                                    key={cat.id}
                                    label={cat.label}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`transition-all ${activeCategory === cat.id
                                        ? 'bg-gold/20 text-gold shadow-lg shadow-gold/10'
                                        : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {cat.icon}
                                </DockIcon>
                            ))}
                        </Dock>
                    </div>

                    {/* Template Grid with Magic Bento Effect */}
                    <div className="mx-auto flex justify-center w-full max-w-6xl">
                        <MagicBento
                            enableStars={true}
                            enableSpotlight={true}
                            enableBorderGlow={true}
                            enableTilt={true}
                            enableMagnetism={true}
                            clickEffect={true}
                            particleCount={16}
                            glowColor="243, 186, 47" // BNB Yellow
                        >
                            {filtered.map((template) => (
                                <ParticleCard
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className="card card--border-glow group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-white/[0.03] backdrop-blur-md overflow-hidden hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 cursor-pointer max-w-full"
                                    enableTilt={true}
                                    enableMagnetism={true}
                                    clickEffect={true}
                                    disableAnimations={false}
                                >
                                    <motion.div layoutId={`card-${template.id}`} className="w-full h-full relative z-10">
                                        {/* Gradient top bar */}
                                        <div className={`h-1.5 bg-gradient-to-r ${template.gradient} relative z-10 w-full`} />

                                        <div className="p-6 relative z-10 w-full">
                                            {/* Icon & Title */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <motion.div layoutId={`icon-${template.id}`} className="w-12 h-12 shrink-0 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-2xl transition-colors">
                                                        {template.icon}
                                                    </motion.div>
                                                    <div className="min-w-0">
                                                        <motion.h3 layoutId={`title-${template.id}`} className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-gold transition-colors truncate m-0">
                                                            {template.name}
                                                        </motion.h3>
                                                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                                                            {template.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tagline */}
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 transition-colors">
                                                {template.tagline}
                                            </p>

                                            {/* Quick Stats */}
                                            <div className="grid grid-cols-3 gap-2 mb-4">
                                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-center transition-colors">
                                                    <div className="text-xs text-gray-400">TGE</div>
                                                    <div className="text-sm font-bold text-gold">{template.config.tgePercent}%</div>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-center transition-colors">
                                                    <div className="text-xs text-gray-400">PLU Lock</div>
                                                    <div className="text-sm font-bold text-green-400">{template.config.plu.totalLockPercent}%</div>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-center transition-colors">
                                                    <div className="text-xs text-gray-400">Risk</div>
                                                    <div className="text-sm font-bold text-cyan-400">{template.config.risk.score}/10</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">
                                                {template.examples.map((ex, i) => (
                                                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 transition-colors">
                                                        {ex}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </ParticleCard>
                            ))}
                        </MagicBento>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 mb-4">Don&apos;t see what you need?</p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold/80 text-bg-base font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all"
                        >
                            <Bot className="w-5 h-5" /> Build Custom Config with AI
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Detail Modal (Animated) ── */}
            <AnimatePresence>
                {selectedTemplate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedTemplate(null)}
                    >
                        <motion.div
                            layoutId={`card-${selectedTemplate.id}`}
                            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Gradient bar */}
                            <div className={`h-2 bg-gradient-to-r ${selectedTemplate.gradient} w-full`} />

                            <div className="p-8">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <motion.div layoutId={`icon-${selectedTemplate.id}`} className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-3xl transition-colors">
                                        {selectedTemplate.icon}
                                    </motion.div>
                                    <div>
                                        <motion.h2 layoutId={`title-${selectedTemplate.id}`} className="text-2xl font-bold dark:text-gray-100 transition-colors m-0">{selectedTemplate.name}</motion.h2>
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-gray-600 dark:text-gray-400 text-sm transition-colors"
                                        >
                                            {selectedTemplate.tagline}
                                        </motion.p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTemplate(null)}
                                        className="ml-auto w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15, duration: 0.4 }}
                                >
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 transition-colors">{selectedTemplate.description}</p>
                                </motion.div>

                                {/* Config Details */}
                                <div className="space-y-4">
                                    {/* Key Metrics */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                                    >
                                        {[
                                            { label: 'Total Supply', value: selectedTemplate.config.totalSupply.toLocaleString() },
                                            { label: 'TGE Unlock', value: `${selectedTemplate.config.tgePercent}%` },
                                            { label: 'Hard Cap', value: `${selectedTemplate.config.hardCapBnb} BNB` },
                                            { label: 'Risk Score', value: `${selectedTemplate.config.risk.score}/10` },
                                        ].map((m) => (
                                            <div key={m.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center transition-colors">
                                                <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                                                <div className="text-sm font-bold text-gold">{m.value}</div>
                                            </div>
                                        ))}
                                    </motion.div>

                                    {/* Vesting Distribution */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25, duration: 0.4 }}
                                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors"
                                    >
                                        <h4 className="text-sm font-semibold mb-3 text-gray-900 flex items-center gap-1.5"><PieChart className="w-4 h-4" /> Token Distribution</h4>
                                        <div className="space-y-2">
                                            {selectedTemplate.config.vesting.map((v, i) => (
                                                <div key={i} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400 transition-colors">{v.label}</span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-24 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden transition-colors">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-gold to-purple"
                                                                style={{ width: `${v.percent}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-gray-900 dark:text-gray-100 font-medium w-10 text-right transition-colors">{v.percent}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* AMM Config */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors"
                                    >
                                        <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100 transition-colors flex items-center gap-1.5"><Settings className="w-4 h-4" /> AMM Settings</h4>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">DEX</span>
                                                <span className="text-gray-900 dark:text-gray-100 transition-colors">{selectedTemplate.config.amm.dex}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Bonding Curve</span>
                                                <span className="text-gray-900 dark:text-gray-100 transition-colors capitalize">{selectedTemplate.config.amm.bondingCurve}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Buy Tax</span>
                                                <span className="text-green-400">{selectedTemplate.config.amm.buyTaxPercent}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Sell Tax</span>
                                                <span className="text-red-400">{selectedTemplate.config.amm.sellTaxPercent}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">LP Allocation</span>
                                                <span className="text-gray-900 dark:text-gray-100 transition-colors">{selectedTemplate.config.amm.initialLiquidityPercent}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Max Wallet</span>
                                                <span className="text-gray-900 dark:text-gray-100 transition-colors">{selectedTemplate.config.amm.antiWhaleMaxWalletPercent}%</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* PLU Milestones */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35, duration: 0.4 }}
                                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors"
                                    >
                                        <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100 transition-colors flex items-center gap-1.5">
                                            <Lock className="w-4 h-4" /> PLU Lock — {selectedTemplate.config.plu.totalLockPercent}% Locked
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedTemplate.config.plu.milestones.map((m, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-green-400/10 text-green-400 flex items-center justify-center text-xs font-bold">
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-gray-600 dark:text-gray-400 flex-1 transition-colors">{m.condition}</span>
                                                    <span className="text-gold font-medium">{m.percent}%</span>
                                                    <span className="text-gray-400 text-xs">Day {m.afterDays}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* AI Summary */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="bg-gold/5 border border-gold/10 rounded-xl p-4"
                                    >
                                        <p className="text-sm text-gray-600 dark:text-gray-400 italic transition-colors flex items-start gap-1.5">
                                            <Lightbulb className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" /> &quot;{selectedTemplate.config.aiSummary}&quot;
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Actions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45, duration: 0.4 }}
                                    className="mt-6 flex justify-end gap-3"
                                >
                                    <button
                                        onClick={() => setSelectedTemplate(null)}
                                        className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                                    >
                                        Close
                                    </button>
                                    <motion.button
                                        onClick={() => handleApplyTemplate(selectedTemplate)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold/80 text-bg-base font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all text-sm"
                                    >
                                        <Rocket className="w-4 h-4 inline-block mr-1.5" /> Use This Template
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
