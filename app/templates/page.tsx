'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TOKEN_TEMPLATES, TEMPLATE_CATEGORIES, type TokenTemplate } from '@/lib/templates';

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
        <main className="min-h-screen bg-[#FAFAFA] text-gray-900 overflow-hidden relative">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple/6 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-gold/4 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple/10 border border-purple/20 text-sm text-purple mb-4">
                            ✨ AI-Optimized Templates
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Launch{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold via-gold to-purple">
                                Smarter
                            </span>
                            {' '}with Templates
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Pre-built tokenomics configurations optimized for specific project categories.
                            Choose a template, customize it, and deploy — all in under 5 minutes.
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {TEMPLATE_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id
                                        ? 'bg-gold/20 border border-gold/40 text-gold shadow-lg shadow-gold/5'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Template Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((template) => (
                            <div
                                key={template.id}
                                className="group relative rounded-2xl border border-gray-200 bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5 cursor-pointer"
                                onClick={() => setSelectedTemplate(template)}
                            >
                                {/* Gradient top bar */}
                                <div className={`h-1.5 bg-gradient-to-r ${template.gradient}`} />

                                <div className="p-6">
                                    {/* Icon & Title */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl">
                                                {template.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-gold transition-colors">
                                                    {template.name}
                                                </h3>
                                                <span className="text-xs text-gray-400 uppercase tracking-wide">
                                                    {template.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tagline */}
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {template.tagline}
                                    </p>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <div className="bg-white rounded-lg p-2 text-center">
                                            <div className="text-xs text-gray-400">TGE</div>
                                            <div className="text-sm font-bold text-gold">{template.config.tgePercent}%</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 text-center">
                                            <div className="text-xs text-gray-400">PLU Lock</div>
                                            <div className="text-sm font-bold text-green-400">{template.config.plu.totalLockPercent}%</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 text-center">
                                            <div className="text-xs text-gray-400">Risk</div>
                                            <div className="text-sm font-bold text-cyan-400">{template.config.risk.score}/10</div>
                                        </div>
                                    </div>

                                    {/* Examples */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {template.examples.map((ex, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white text-gray-400">
                                                {ex}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 mb-4">Don&apos;t see what you need?</p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold/80 text-bg-base font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all"
                        >
                            🤖 Build Custom Config with AI
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Detail Modal ── */}
            {selectedTemplate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSelectedTemplate(null)}
                >
                    <div
                        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-bg-card shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Gradient bar */}
                        <div className={`h-2 bg-gradient-to-r ${selectedTemplate.gradient}`} />

                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-3xl">
                                    {selectedTemplate.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                                    <p className="text-gray-600 text-sm">{selectedTemplate.tagline}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="ml-auto w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <p className="text-gray-600 text-sm mb-6">{selectedTemplate.description}</p>

                            {/* Config Details */}
                            <div className="space-y-4">
                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { label: 'Total Supply', value: selectedTemplate.config.totalSupply.toLocaleString() },
                                        { label: 'TGE Unlock', value: `${selectedTemplate.config.tgePercent}%` },
                                        { label: 'Hard Cap', value: `${selectedTemplate.config.hardCapBnb} BNB` },
                                        { label: 'Risk Score', value: `${selectedTemplate.config.risk.score}/10` },
                                    ].map((m) => (
                                        <div key={m.label} className="bg-white rounded-xl p-3 text-center">
                                            <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                                            <div className="text-sm font-bold text-gold">{m.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Vesting Distribution */}
                                <div className="bg-white rounded-xl p-4">
                                    <h4 className="text-sm font-semibold mb-3 text-gray-900">📊 Token Distribution</h4>
                                    <div className="space-y-2">
                                        {selectedTemplate.config.vesting.map((v, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">{v.label}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-gold to-purple"
                                                            style={{ width: `${v.percent}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-gray-900 font-medium w-10 text-right">{v.percent}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AMM Config */}
                                <div className="bg-white rounded-xl p-4">
                                    <h4 className="text-sm font-semibold mb-3 text-gray-900">⚙️ AMM Settings</h4>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">DEX</span>
                                            <span className="text-gray-900">{selectedTemplate.config.amm.dex}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Bonding Curve</span>
                                            <span className="text-gray-900 capitalize">{selectedTemplate.config.amm.bondingCurve}</span>
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
                                            <span className="text-gray-900">{selectedTemplate.config.amm.initialLiquidityPercent}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Max Wallet</span>
                                            <span className="text-gray-900">{selectedTemplate.config.amm.antiWhaleMaxWalletPercent}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* PLU Milestones */}
                                <div className="bg-white rounded-xl p-4">
                                    <h4 className="text-sm font-semibold mb-3 text-gray-900">
                                        🔒 PLU Lock — {selectedTemplate.config.plu.totalLockPercent}% Locked
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedTemplate.config.plu.milestones.map((m, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm">
                                                <div className="w-6 h-6 rounded-full bg-green-400/10 text-green-400 flex items-center justify-center text-xs font-bold">
                                                    {i + 1}
                                                </div>
                                                <span className="text-gray-600 flex-1">{m.condition}</span>
                                                <span className="text-gold font-medium">{m.percent}%</span>
                                                <span className="text-gray-400 text-xs">Day {m.afterDays}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Summary */}
                                <div className="bg-gold/5 border border-gold/10 rounded-xl p-4">
                                    <p className="text-sm text-gray-600 italic">
                                        💡 &quot;{selectedTemplate.config.aiSummary}&quot;
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="px-5 py-2.5 rounded-xl bg-white text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleApplyTemplate(selectedTemplate)}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold/80 text-bg-base font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all text-sm"
                                >
                                    🚀 Use This Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
