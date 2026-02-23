'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertTriangle, TerminalSquare } from 'lucide-react';
import { InteractiveDemo } from '@/components/dashboard/InteractiveDemo';
import type { TokenConfig } from '@/types/config';

interface ConfigRow {
    id: string;
    config: TokenConfig;
}

export default function DemoSandboxPage() {
    const { id } = useParams<{ id: string }>();
    const [row, setRow] = useState<ConfigRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        fetch(`/api/config?id=${id}`)
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setRow(d.config);
                else setError(d.error || 'Config not found');
            })
            .catch(() => setError('Network error'))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-gray-900 overflow-hidden relative">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            <div className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={`/dashboard/${id}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gold text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Token Details
                    </Link>
                    <div className="px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <TerminalSquare className="w-3.5 h-3.5" /> Simulation Sandbox
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                ) : error ? (
                    <div className="glass-card-prominent rounded-2xl p-8 text-center max-w-lg mx-auto">
                        <AlertTriangle className="w-10 h-10 text-error mx-auto mb-3" />
                        <p className="text-error mb-4">{error}</p>
                        <Link href="/dashboard" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black transition-colors">
                            Return to Dashboard
                        </Link>
                    </div>
                ) : row ? (
                    <div>
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Guardian Defense Simulator</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Run localized, algorithmic execution paths against <strong className="text-gold">${row.config.tokenSymbol}</strong>'s strict rulesets. This terminal evaluates outcomes without interacting with the live BSC node.
                            </p>
                        </div>
                        <InteractiveDemo config={row.config} />
                    </div>
                ) : null}
            </div>
        </main>
    );
}
