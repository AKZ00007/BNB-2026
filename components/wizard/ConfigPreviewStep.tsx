'use client';

import { useState } from 'react';
import {
    Shield, Settings, Coins, BarChart3, AlertTriangle, CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import type { TokenConfig, VestingEntry, PLUMilestone } from '@/types/config';

interface ConfigPreviewStepProps {
    config: TokenConfig;
    onSave: (config: TokenConfig) => void;
    onBack: () => void;
}

function RiskBadge({ score }: { score: number }) {
    const color = score >= 7 ? 'text-success border-success/30 bg-success/10'
        : score >= 4 ? 'text-warning border-warning/30 bg-warning/10'
            : 'text-error border-error/30 bg-error/10';
    const label = score >= 7 ? 'Low Risk' : score >= 4 ? 'Medium Risk' : 'High Risk';
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
            {score >= 7 ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {label} — {score}/10
        </span>
    );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="glass-card rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between p-5 hover:bg-white transition-colors"
            >
                <div className="flex items-center gap-3 font-semibold text-gray-900">
                    <span className="text-gold">{icon}</span>
                    {title}
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
        </div>
    );
}

function Row({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
            <span className="text-gray-600 text-sm">{label}</span>
            <span className={`text-sm font-mono font-medium ${highlight ? 'text-gold' : 'text-gray-900'}`}>
                {value}
            </span>
        </div>
    );
}

export function ConfigPreviewStep({ config, onSave, onBack }: ConfigPreviewStepProps) {
    const [editedConfig, setEditedConfig] = useState(config);

    const fmt = (n: number) => n.toLocaleString();

    return (
        <div className="max-w-2xl mx-auto w-full animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-4">
                    <BarChart3 className="w-4 h-4" />
                    <span>AI-Generated Config — Step 2 of 3</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                    Your{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-purple-400">
                        Tokenomics
                    </span>
                </h2>
                <p className="text-gray-600">{editedConfig.aiSummary}</p>
            </div>

            {/* Risk + Identity */}
            <div className="glass-card-prominent rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                        <div className="text-2xl font-bold">{editedConfig.tokenName}</div>
                        <div className="text-gray-600 font-mono">${editedConfig.tokenSymbol}</div>
                    </div>
                    <RiskBadge score={editedConfig.risk.score} />
                </div>
                <Row label="Category" value={editedConfig.category.toUpperCase()} />
                <Row label="Total Supply" value={fmt(editedConfig.totalSupply)} highlight />
                <Row label="TGE Unlock" value={`${editedConfig.tgePercent}%`} highlight />
                <Row label="Hard Cap" value={`${editedConfig.hardCapBnb} BNB`} />
                <Row label="Soft Cap" value={`${editedConfig.softCapBnb} BNB`} />
            </div>

            {/* Vesting */}
            <Card title="Vesting Schedule" icon={<Coins className="w-4 h-4" />}>
                {editedConfig.vesting.map((v: VestingEntry, i: number) => (
                    <div key={i} className="py-2 border-b border-white/5 last:border-0">
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-900 font-medium">{v.label}</span>
                            <span className="text-gold font-mono font-medium">{v.percent}%</span>
                        </div>
                        <div className="text-gray-400 text-xs space-x-3">
                            <span>TGE: {v.tgePercent}%</span>
                            <span>Cliff: {v.cliffMonths}mo</span>
                            <span>Vesting: {v.vestingMonths}mo</span>
                        </div>
                    </div>
                ))}
            </Card>

            {/* AMM */}
            <Card title="AMM Configuration" icon={<Settings className="w-4 h-4" />}>
                <Row label="DEX" value={editedConfig.amm.dex} />
                <Row label="Initial Liquidity" value={`${editedConfig.amm.initialLiquidityPercent}% of raise`} highlight />
                <Row label="Buy Tax" value={`${editedConfig.amm.buyTaxPercent}%`} />
                <Row label="Sell Tax" value={`${editedConfig.amm.sellTaxPercent}%`} />
                <Row label="Anti-Whale Limit" value={`${editedConfig.amm.antiWhaleMaxWalletPercent}% max wallet`} />
                <Row label="Anti-Bot Blocks" value={editedConfig.amm.antiBotBlocks} />
                <Row label="Bonding Curve" value={editedConfig.amm.bondingCurve} />
            </Card>

            {/* PLU */}
            <Card title="Progressive Liquidity Unlock" icon={<Shield className="w-4 h-4" />}>
                <Row label="Total LP Locked" value={`${editedConfig.plu.totalLockPercent}%`} highlight />
                {editedConfig.plu.milestones.map((m: PLUMilestone, i: number) => (
                    <div key={i} className="py-2 border-b border-white/5 last:border-0">
                        <div className="flex justify-between mb-0.5">
                            <span className="text-gray-600 text-sm">Unlock {m.percent}%</span>
                            <span className="text-gray-400 font-mono text-xs">Day {m.afterDays}</span>
                        </div>
                        <p className="text-gray-400 text-xs">{m.condition}</p>
                    </div>
                ))}
            </Card>

            {/* Risk flags */}
            {(editedConfig.risk.flags.length > 0 || editedConfig.risk.suggestions.length > 0) && (
                <div className="glass-card rounded-xl p-5 mt-4 space-y-3">
                    {editedConfig.risk.flags.length > 0 && (
                        <div>
                            <p className="text-warning text-sm font-medium mb-2 flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4" /> Warnings
                            </p>
                            <ul className="space-y-1">
                                {editedConfig.risk.flags.map((f: string, i: number) => (
                                    <li key={i} className="text-gray-600 text-sm">• {f}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {editedConfig.risk.suggestions.length > 0 && (
                        <div>
                            <p className="text-success text-sm font-medium mb-2 flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4" /> Suggestions
                            </p>
                            <ul className="space-y-1">
                                {editedConfig.risk.suggestions.map((s: string, i: number) => (
                                    <li key={i} className="text-gray-600 text-sm">• {s}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-8">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 rounded-xl border border-[var(--border-gray-300, #D1D5DB)] text-gray-600 hover:text-gray-900 hover:border-white/40 transition-all font-semibold"
                >
                    ← Regenerate
                </button>
                <button
                    onClick={() => onSave(editedConfig)}
                    className="flex-2 flex-grow-[2] py-4 rounded-xl font-semibold text-bg-base transition-all hover:scale-[1.02] animate-pulse-glow"
                    style={{ background: 'linear-gradient(135deg, #F0B90B 0%, #8B5CF6 100%)' }}
                >
                    Save Config →
                </button>
            </div>
        </div>
    );
}
