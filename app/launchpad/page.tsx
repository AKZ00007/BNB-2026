'use client';

import { useState } from 'react';

/* ── Mock data ───────────────────────────────────────────────────────────── */

type ProjectStatus = 'upcoming' | 'live' | 'ended';

interface LaunchProject {
    id: string;
    name: string;
    symbol: string;
    logo: string;
    category: string;
    tagline: string;
    status: ProjectStatus;
    raised: number;
    hardCap: number;
    participants: number;
    startTime: string;
    endTime: string;
    price: string;
    pluScore: number;
    socialLinks: { twitter?: string; telegram?: string; website?: string };
    highlights: string[];
}

const PROJECTS: LaunchProject[] = [
    {
        id: 'neural-chain', name: 'NeuralChain', symbol: 'NRCH', logo: '🧠',
        category: 'AI Agent', tagline: 'Decentralized AI agents marketplace on BSC',
        status: 'live', raised: 42.5, hardCap: 75, participants: 312,
        startTime: '2025-02-20T12:00Z', endTime: '2025-02-27T12:00Z',
        price: '0.00015 BNB', pluScore: 9.2,
        socialLinks: { twitter: '#', telegram: '#', website: '#' },
        highlights: ['KYC Verified', 'Audit by CertiK', '60% PLU Locked'],
    },
    {
        id: 'data-vault', name: 'DataVault', symbol: 'DVT', logo: '🗄️',
        category: 'Data Marketplace', tagline: 'Privacy-first data exchange for AI training',
        status: 'live', raised: 28.7, hardCap: 50, participants: 198,
        startTime: '2025-02-18T12:00Z', endTime: '2025-02-25T12:00Z',
        price: '0.0002 BNB', pluScore: 8.7,
        socialLinks: { twitter: '#', telegram: '#', website: '#' },
        highlights: ['Multi-sig Treasury', 'Token Burn Mechanism'],
    },
    {
        id: 'compute-mesh', name: 'ComputeMesh', symbol: 'CMSH', logo: '⚡',
        category: 'Compute', tagline: 'Decentralized GPU compute network for AI inference',
        status: 'upcoming', raised: 0, hardCap: 100, participants: 0,
        startTime: '2025-03-01T12:00Z', endTime: '2025-03-08T12:00Z',
        price: '0.0001 BNB', pluScore: 8.4,
        socialLinks: { twitter: '#', website: '#' },
        highlights: ['4 GPU Partnerships', 'Working MVP', 'Doxxed Team'],
    },
    {
        id: 'meme-forge', name: 'MemeForge', symbol: 'MFRG', logo: '🔥',
        category: 'Meme', tagline: 'AI-generated meme ecosystem with staking rewards',
        status: 'upcoming', raised: 0, hardCap: 30, participants: 0,
        startTime: '2025-03-05T12:00Z', endTime: '2025-03-10T12:00Z',
        price: '0.00005 BNB', pluScore: 6.8,
        socialLinks: { twitter: '#', telegram: '#' },
        highlights: ['Community First', 'Fair Launch'],
    },
    {
        id: 'dao-council', name: 'DAOCouncil', symbol: 'DAOC', logo: '🏛️',
        category: 'DAO', tagline: 'Governance-as-a-service for BSC protocols',
        status: 'ended', raised: 65, hardCap: 65, participants: 487,
        startTime: '2025-02-01T12:00Z', endTime: '2025-02-08T12:00Z',
        price: '0.0003 BNB', pluScore: 9.0,
        socialLinks: { twitter: '#', telegram: '#', website: '#' },
        highlights: ['Sold Out in 4h', 'Launched on PancakeSwap'],
    },
    {
        id: 'chatai-token', name: 'ChatAI', symbol: 'CHAI', logo: '💬',
        category: 'AI Chatbot', tagline: 'Tokenized premium chatbot service',
        status: 'ended', raised: 40, hardCap: 40, participants: 356,
        startTime: '2025-01-15T12:00Z', endTime: '2025-01-22T12:00Z',
        price: '0.00025 BNB', pluScore: 8.5,
        socialLinks: { twitter: '#', website: '#' },
        highlights: ['3x from IDO Price', 'Active Product'],
    },
];

function StatusBadge({ status }: { status: ProjectStatus }) {
    const styles = {
        live: 'bg-green-400/10 text-green-400 border-green-400/20',
        upcoming: 'bg-gold/10 text-gold border-gold/20',
        ended: 'bg-white/5 text-text-tertiary border-white/10',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status === 'live' && '● '}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export default function LaunchpadPage() {
    const [filter, setFilter] = useState<'all' | ProjectStatus>('all');
    const [selectedProject, setSelectedProject] = useState<LaunchProject | null>(null);

    const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.status === filter);

    const stats = {
        totalRaised: PROJECTS.reduce((s, p) => s + p.raised, 0),
        totalParticipants: PROJECTS.reduce((s, p) => s + p.participants, 0),
        liveProjects: PROJECTS.filter((p) => p.status === 'live').length,
        avgPluScore: +(PROJECTS.reduce((s, p) => s + p.pluScore, 0) / PROJECTS.length).toFixed(1),
    };

    return (
        <main className="min-h-screen bg-bg-base text-text-primary overflow-hidden relative">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-gold/6 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/4 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-sm text-gold mb-4">
                            🚀 LaunchPad AI Platform
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-3">
                            Discover & Invest in{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold via-amber-300 to-gold">
                                AI-Powered Tokens
                            </span>
                        </h1>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Browse curated IDO launches with AI-verified tokenomics, PLU trust scores,
                            and milestone-based liquidity locks. Invest with confidence.
                        </p>
                    </div>

                    {/* Platform Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Raised', value: `${stats.totalRaised.toFixed(1)} BNB`, icon: '💰', color: 'text-gold' },
                            { label: 'Participants', value: stats.totalParticipants.toLocaleString(), icon: '👥', color: 'text-purple' },
                            { label: 'Live Projects', value: stats.liveProjects.toString(), icon: '🟢', color: 'text-green-400' },
                            { label: 'Avg PLU Score', value: `${stats.avgPluScore}/10`, icon: '🛡️', color: 'text-cyan-400' },
                        ].map((s) => (
                            <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">
                                <div className="text-xl mb-2">{s.icon}</div>
                                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                <div className="text-xs text-text-tertiary mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-8">
                        {(['all', 'live', 'upcoming', 'ended'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
                                        ? 'bg-gold/20 border border-gold/40 text-gold'
                                        : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10'
                                    }`}
                            >
                                {f === 'all' ? 'All Projects' : f.charAt(0).toUpperCase() + f.slice(1)}
                                {f !== 'all' && (
                                    <span className="ml-1.5 text-xs opacity-60">
                                        ({PROJECTS.filter((p) => p.status === f).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Project Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((project) => {
                            const progress = project.hardCap > 0 ? (project.raised / project.hardCap) * 100 : 0;
                            return (
                                <div
                                    key={project.id}
                                    className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5 cursor-pointer"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    {/* Header */}
                                    <div className="p-6 pb-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                                                    {project.logo}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-text-primary group-hover:text-gold transition-colors">
                                                        {project.name}
                                                    </h3>
                                                    <span className="text-xs text-text-tertiary">${project.symbol}</span>
                                                </div>
                                            </div>
                                            <StatusBadge status={project.status} />
                                        </div>
                                        <p className="text-sm text-text-secondary mb-3">{project.tagline}</p>

                                        {/* Highlights */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {project.highlights.map((h, i) => (
                                                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-tertiary">
                                                    {h}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Price & PLU */}
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                                <div className="text-xs text-text-tertiary">Price</div>
                                                <div className="text-xs font-bold text-gold">{project.price}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                                <div className="text-xs text-text-tertiary">PLU</div>
                                                <div className="text-xs font-bold text-cyan-400">{project.pluScore}/10</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                                <div className="text-xs text-text-tertiary">Category</div>
                                                <div className="text-xs font-bold text-purple">{project.category}</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-text-tertiary">
                                                    Raised: {project.raised} / {project.hardCap} BNB
                                                </span>
                                                <span className="text-gold">{progress.toFixed(0)}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-gold to-amber-300 transition-all"
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between text-xs text-text-tertiary">
                                        <span>👥 {project.participants} participants</span>
                                        {project.status === 'live' && (
                                            <span className="text-green-400 animate-pulse">● Accepting Contributions</span>
                                        )}
                                        {project.status === 'upcoming' && <span className="text-gold">Starts Soon</span>}
                                        {project.status === 'ended' && <span>IDO Completed</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <div className="rounded-2xl border border-gold/20 bg-gold/5 p-8 max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold mb-2">🚀 Launch Your Token on LaunchPad AI</h3>
                            <p className="text-sm text-text-secondary mb-4">
                                Create AI-optimized tokenomics, configure your IDO, and reach hundreds of investors on BSC.
                            </p>
                            <a
                                href="/create"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold/80 text-bg-base font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all"
                            >
                                Get Started — Free
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Project Detail Modal ── */}
            {selectedProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSelectedProject(null)}
                >
                    <div
                        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-bg-card shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-3xl">
                                    {selectedProject.logo}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                                        <StatusBadge status={selectedProject.status} />
                                    </div>
                                    <p className="text-text-secondary text-sm">${selectedProject.symbol} · {selectedProject.category}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-tertiary hover:text-text-primary"
                                >
                                    ✕
                                </button>
                            </div>

                            <p className="text-text-secondary text-sm mb-6">{selectedProject.tagline}</p>

                            {/* Key Info */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    { label: 'Token Price', value: selectedProject.price },
                                    { label: 'Hard Cap', value: `${selectedProject.hardCap} BNB` },
                                    { label: 'Raised', value: `${selectedProject.raised} BNB` },
                                    { label: 'PLU Score', value: `${selectedProject.pluScore}/10` },
                                ].map((item) => (
                                    <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                                        <div className="text-xs text-text-tertiary mb-1">{item.label}</div>
                                        <div className="text-sm font-bold text-gold">{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress */}
                            <div className="bg-white/5 rounded-xl p-4 mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-text-secondary">Fundraise Progress</span>
                                    <span className="text-gold font-bold">
                                        {((selectedProject.raised / selectedProject.hardCap) * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-gold to-amber-300"
                                        style={{ width: `${Math.min((selectedProject.raised / selectedProject.hardCap) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-text-tertiary mt-2">
                                    <span>{selectedProject.raised} BNB raised</span>
                                    <span>Hard Cap: {selectedProject.hardCap} BNB</span>
                                </div>
                            </div>

                            {/* Participate CTA */}
                            {selectedProject.status === 'live' && (
                                <div className="bg-green-400/5 border border-green-400/10 rounded-xl p-4 mb-4">
                                    <label className="text-xs text-text-secondary mb-1 block">Contribute BNB</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="0.5"
                                            className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-green-400/30"
                                        />
                                        <button className="px-5 py-2.5 rounded-xl bg-green-400 text-bg-base font-semibold text-sm hover:bg-green-500 transition-colors">
                                            Participate
                                        </button>
                                    </div>
                                    <p className="text-xs text-text-tertiary mt-2">Connect wallet to participate. Min: 0.1 BNB, Max: 5 BNB</p>
                                </div>
                            )}

                            {/* Highlights */}
                            <div className="flex flex-wrap gap-2">
                                {selectedProject.highlights.map((h, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full text-xs bg-white/5 text-text-secondary border border-white/10">
                                        {h}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
