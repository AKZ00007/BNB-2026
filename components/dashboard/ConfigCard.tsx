'use client';

import Link from 'next/link';
import { Shield, TrendingUp, Clock, ChevronRight, Zap } from 'lucide-react';
import type { TokenConfig } from '@/types/config';

interface ConfigCardProps {
    id: string;
    config: TokenConfig;
    status: 'saved' | 'testnet' | 'mainnet';
    createdAt: string;
}

const STATUS_STYLES = {
    saved: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400',
    testnet: 'bg-info/10 border-info/20 text-info',
    mainnet: 'bg-success/10 border-success/20 text-success',
};

const STATUS_LABELS = {
    saved: '● Saved',
    testnet: '⬡ Testnet',
    mainnet: '✦ Mainnet',
};

function RiskBadge({ score }: { score: number }) {
    const color =
        score >= 7 ? 'text-success bg-success/10 border-success/20' :
            score >= 5 ? 'text-warning bg-warning/10 border-warning/20' :
                'text-error bg-error/10 border-error/20';
    const label =
        score >= 7 ? 'Low Risk' : score >= 5 ? 'Med Risk' : 'High Risk';

    return (
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
            <Shield className="w-3 h-3" />
            {label} {score}/10
        </span>
    );
}

export function ConfigCard({ id, config, status, createdAt }: ConfigCardProps) {
    const date = new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        <Link href={`/dashboard/${id}`}>
            <div className="glass-card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-gold/30 dark:hover:border-gold/30 hover:bg-white dark:hover:bg-gray-900 transition-all group cursor-pointer">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gold transition-colors">
                            {config.tokenName}
                        </h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm transition-colors">${config.tokenSymbol}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gold group-hover:translate-x-0.5 transition-all mt-1" />
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed transition-colors">
                    {config.aiSummary || config.description}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
                    <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-gold" />
                        TGE {config.tgePercent}%
                    </span>
                    <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-purple" />
                        {Number(config.hardCapBnb).toLocaleString()} BNB cap
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                        {config.category}
                    </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800 transition-colors">
                    <RiskBadge score={config.risk.score} />
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs border font-medium transition-colors ${STATUS_STYLES[status]}`}>
                            {STATUS_LABELS[status]}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 transition-colors">
                            <Clock className="w-3 h-3" />
                            {date}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
