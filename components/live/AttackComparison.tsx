'use client';

import { Shield, ShieldAlert, Bot, Waves, TrendingDown, ArrowRight } from 'lucide-react';

const SCAM_RESULTS = [
    {
        name: 'The Whale Attack',
        icon: Waves,
        scam: 'Allowed: Attacker buys 15% of supply',
        guardian: 'Blocked: Exceeds max wallet limit',
    },
    {
        name: 'The Bot Snipe',
        icon: Bot,
        scam: 'Allowed: Buy and immediate sell in same block',
        guardian: 'Blocked: Sell cooldown active',
    },
    {
        name: 'The Team Dump',
        icon: TrendingDown,
        scam: 'Allowed: Drops price by 80%',
        guardian: 'Penalized: 10% dynamic sell tax applied',
    },
    {
        name: 'The Infinite Mint',
        icon: ShieldAlert,
        scam: 'Allowed: Deployer mints 1,000,000 new tokens',
        guardian: 'Blocked: Minting disabled / Renounced',
    },
];

export function AttackComparison() {
    return (
        <div className="mt-12 mb-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400 inline-block mb-2">
                    Why Guardian Matters
                </h2>
                <p className="text-sm text-gray-500 max-w-lg mx-auto">
                    A side-by-side comparison of how a typical testnet scam behaves versus a Guardian-protected token during identical attacks.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Scam Side */}
                <div className="glass-card rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-500/10">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-400">Standard Meme Token</h3>
                            <p className="text-xs text-red-400/70">No built-in protections</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {SCAM_RESULTS.map((r, i) => (
                            <div key={i} className="flex gap-3">
                                <r.icon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-xs font-semibold text-gray-300 mb-1">{r.name}</div>
                                    <div className="text-sm text-red-400 font-medium">❌ {r.scam}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guardian Side */}
                <div className="glass-card-prominent rounded-2xl p-6 border border-green-500/30 bg-green-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full pointer-events-none" />

                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-green-500/10 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-400">Guardian Token</h3>
                            <p className="text-xs text-green-400/70">On-chain transaction oracle</p>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {SCAM_RESULTS.map((r, i) => (
                            <div key={i} className="flex gap-3">
                                <r.icon className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-xs font-semibold text-gray-300 mb-1">{r.name}</div>
                                    <div className="text-sm text-green-400 font-medium">✅ {r.guardian}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
                    Run the simulations above to verify <ArrowRight className="w-3 h-3" />
                </div>
            </div>
        </div>
    );
}
