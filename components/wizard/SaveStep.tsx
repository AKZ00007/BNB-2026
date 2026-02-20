'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, Wallet, ArrowRight, Plus } from 'lucide-react';
import { useAccount } from 'wagmi';
import type { TokenConfig } from '@/types/config';

interface SaveStepProps {
    config: TokenConfig;
    onCreateAnother: () => void;
}

export function SaveStep({ config, onCreateAnother }: SaveStepProps) {
    const { address, isConnected } = useAccount();
    const [saving, setSaving] = useState(false);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    config,
                    walletAddress: address || 'anonymous',
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Save failed');
            // Persist ID to localStorage so dashboard shows it even without wallet
            try {
                const existing: string[] = JSON.parse(localStorage.getItem('bnb_config_ids') || '[]');
                if (!existing.includes(data.id)) {
                    localStorage.setItem('bnb_config_ids', JSON.stringify([data.id, ...existing].slice(0, 50)));
                }
            } catch { /* ignore */ }
            setSavedId(data.id);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    // ── Saved state ──────────────────────────────────────────────────────────────
    if (savedId) {
        return (
            <div className="max-w-lg mx-auto w-full text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-success" />
                </div>

                <h2 className="text-3xl font-bold mb-2">Config Saved! 🎉</h2>
                <p className="text-text-secondary mb-2">
                    <strong className="text-gold">{config.tokenName}</strong> ({config.tokenSymbol}) tokenomics config
                    has been saved to your account.
                </p>
                <p className="text-text-tertiary text-sm font-mono mb-8">ID: {savedId}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => window.location.href = `/dashboard/${savedId}`}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-bg-base transition-all hover:scale-[1.02]"
                        style={{ background: 'linear-gradient(135deg, #F0B90B 0%, #8B5CF6 100%)' }}
                    >
                        View Simulations &amp; Deploy <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onCreateAnother}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border border-white/20 text-text-secondary hover:text-text-primary hover:border-white/40 transition-all font-semibold"
                    >
                        <Plus className="w-4 h-4" /> Create Another
                    </button>
                </div>
            </div>
        );
    }

    // ── Save state ───────────────────────────────────────────────────────────────
    return (
        <div className="max-w-lg mx-auto w-full animate-fade-in">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-4">
                    <CheckCircle className="w-4 h-4" />
                    <span>Almost Done — Step 3 of 3</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">Save Your Config</h2>
                <p className="text-text-secondary">Your tokenomics are ready. Save them to your account.</p>
            </div>

            {/* Config summary */}
            <div className="glass-card-prominent rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-xl font-bold">{config.tokenName}</div>
                        <div className="text-text-secondary font-mono text-sm">${config.tokenSymbol}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-gold font-bold">Risk: {config.risk.score}/10</div>
                        <div className="text-text-tertiary text-xs">{config.category}</div>
                    </div>
                </div>
                <p className="text-text-secondary text-sm">{config.aiSummary}</p>
            </div>

            {/* Wallet note */}
            {!isConnected && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20 mb-6">
                    <Wallet className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                        <p className="text-warning text-sm font-medium">Wallet not connected</p>
                        <p className="text-text-secondary text-xs mt-0.5">
                            Config will be saved as anonymous. Connect your wallet to link it to your account.
                        </p>
                    </div>
                </div>
            )}

            {isConnected && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success/10 border border-success/20 mb-6">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-success text-sm font-medium">
                        Saving to {address?.slice(0, 6)}…{address?.slice(-4)}
                    </span>
                </div>
            )}

            {error && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm mb-4">
                    {error}
                </div>
            )}

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-xl font-semibold text-bg-base text-lg transition-all disabled:opacity-60 enabled:hover:scale-[1.02] enabled:animate-pulse-glow"
                style={{ background: 'linear-gradient(135deg, #F0B90B 0%, #8B5CF6 100%)' }}
            >
                {saving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving…
                    </>
                ) : (
                    <>
                        <CheckCircle className="w-5 h-5" />
                        Save Tokenomics Config
                    </>
                )}
            </button>
        </div>
    );
}
