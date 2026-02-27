'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ConfigCard } from '@/components/dashboard/ConfigCard';
import { Sparkles, Plus, Loader2, Search, Rocket } from 'lucide-react';
import Link from 'next/link';
import type { TokenConfig } from '@/types/config';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/auth-provider';

interface SavedConfig {
    id: string;
    config: TokenConfig;
    status: 'saved' | 'testnet' | 'mainnet';
    testnet_address?: string;
    created_at: string;
}

// Persist an ID to localStorage
function persistId(id: string) {
    try {
        const existing: string[] = JSON.parse(localStorage.getItem('bnb_config_ids') || '[]');
        if (!existing.includes(id)) {
            localStorage.setItem('bnb_config_ids', JSON.stringify([id, ...existing].slice(0, 50)));
        }
    } catch { /* ignore */ }
}

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const { displayName } = useAuth();
    const [configs, setConfigs] = useState<SavedConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [recoverInput, setRecoverInput] = useState('');
    const [recoverLoading, setRecoverLoading] = useState(false);
    const [recoverError, setRecoverError] = useState('');

    async function loadConfigs() {
        setLoading(true);
        const results: SavedConfig[] = [];
        const seenIds = new Set<string>();

        // 1. Read all IDs from localStorage
        let localIds: string[] = [];
        try {
            localIds = JSON.parse(localStorage.getItem('bnb_config_ids') || '[]');
        } catch { /* ignore */ }

        await Promise.all(
            localIds.map(async (id) => {
                try {
                    const r = await fetch(`/api/config?id=${id}`);
                    const d = await r.json();
                    if (d.success && d.config && !seenIds.has(d.config.id)) {
                        seenIds.add(d.config.id);
                        results.push(d.config as SavedConfig);
                    }
                } catch { /* skip bad IDs */ }
            })
        );

        // 2. If wallet connected, also merge wallet-linked configs
        if (isConnected && address) {
            try {
                const r = await fetch(`/api/config?wallet=${address}`);
                const d = await r.json();
                if (d.success) {
                    for (const c of (d.configs || [])) {
                        if (!seenIds.has(c.id)) {
                            seenIds.add(c.id);
                            results.push(c);
                            persistId(c.id); // keep localStorage in sync
                        }
                    }
                }
            } catch { /* ignore */ }
        }

        results.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setConfigs(results);
        setLoading(false);
    }

    useEffect(() => {
        loadConfigs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, isConnected]);

    // Recover a config by pasting its ID
    async function handleRecover() {
        const id = recoverInput.trim();
        if (!id) return;
        setRecoverLoading(true);
        setRecoverError('');
        try {
            const r = await fetch(`/api/config?id=${id}`);
            const d = await r.json();
            if (!d.success) throw new Error(d.error || 'Config not found');
            persistId(id);
            setRecoverInput('');
            await loadConfigs(); // refresh list
        } catch (e) {
            setRecoverError((e as Error).message);
        } finally {
            setRecoverLoading(false);
        }
    }

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden relative transition-colors duration-300">
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple/10 rounded-full blur-[120px] animate-pulse-slow" />
                </div>

                <div className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto">
                    {/* Page header */}
                    <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                My Configs
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                                {displayName ? (
                                    <>Ready to build, <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-purple-400">{displayName}</span>?</>
                                ) : (
                                    <>Token{' '}<span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-purple-400">Dashboard</span></>
                                )}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                                {configs.length > 0
                                    ? `${configs.length} config${configs.length !== 1 ? 's' : ''} saved`
                                    : 'Your saved token configs appear here'}
                            </p>
                        </div>

                        <Link
                            href="/create"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-bg-base transition-all hover:scale-105 animate-pulse-glow"
                            style={{ background: 'linear-gradient(135deg, #F0B90B 0%, #8B5CF6 100%)' }}
                        >
                            <Plus className="w-4 h-4" />
                            New Token
                        </Link>
                    </div>

                    {/* Recover by ID — always visible at top */}
                    <div className="glass-card rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors">
                            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors" />
                            <input
                                suppressHydrationWarning
                                value={recoverInput}
                                onChange={(e) => setRecoverInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRecover()}
                                placeholder="Paste a config ID to recover it (e.g. b469416d-...)"
                                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleRecover}
                            disabled={!recoverInput.trim() || recoverLoading}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-bg-base disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #F0B90B 0%, #8B5CF6 100%)' }}
                        >
                            {recoverLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Recover'}
                        </button>
                    </div>
                    {recoverError && (
                        <p className="text-error text-sm mb-4 px-1">{recoverError}</p>
                    )}

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-8 h-8 text-gold animate-spin" />
                        </div>
                    ) : configs.length === 0 ? (
                        <div className="glass-card-prominent rounded-2xl p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-5 animate-pulse-glow">
                                <Rocket className="w-8 h-8 text-gold" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">No configs yet</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
                                Create a new token above, or paste a config ID in the recover box.
                            </p>
                            <Link
                                href="/create"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-bg-base"
                                style={{ background: 'linear-gradient(135deg, #F0B90B 0%, #8B5CF6 100%)' }}
                            >
                                <Sparkles className="w-4 h-4" />
                                Create your first token
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {configs.map((c) => (
                                <ConfigCard
                                    key={c.id}
                                    id={c.id}
                                    config={c.config}
                                    status={c.status}
                                    createdAt={c.created_at}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
