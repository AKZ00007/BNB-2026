'use client';

import { useEffect, useState, useRef } from 'react';
import { TokenConfig } from '@/types/config';
import { CheckCircle2, Copy, ExternalLink, ArrowRight, LayoutGrid, Rocket, Droplet } from 'lucide-react';
import Link from 'next/link';
import { saveProject } from '@/lib/projects-store';

interface SaveStepProps {
    config: TokenConfig;
    onCreateAnother: () => void;
}

export function SaveStep({ config, onCreateAnother }: SaveStepProps) {
    const [copied, setCopied] = useState(false);
    const mockContractAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Mock Address
    const hasSaved = useRef(false);

    // Persist this token to localStorage so it appears in My Projects
    useEffect(() => {
        if (!hasSaved.current) {
            saveProject(config, mockContractAddress);
            hasSaved.current = true;
        }
    }, [config, mockContractAddress]);

    const handleCopy = () => {
        navigator.clipboard.writeText(mockContractAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-[640px] mx-auto animate-fade-in flex flex-col items-center mt-8">

            {/* Ambient Success Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#10B981] opacity-[0.05] blur-[100px] pointer-events-none" />

            {/* Success Header Icon */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#10B981] rounded-full blur-[20px] opacity-20 animate-pulse" />
                <CheckCircle2 className="w-20 h-20 text-[#10B981] relative z-10" />
            </div>

            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight text-center">
                Launch Successful!
            </h1>
            <p className="text-gray-400 text-center mb-10 max-w-md">
                <strong className="text-white">{config.tokenName} ({config.ticker})</strong> is now deployed on the BNB Smart Chain Testnet.
            </p>

            {/* Contract Address Box */}
            <div className="w-full bg-[#111827] border border-[#1F2937] rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0B90B] opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity" />

                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Official Contract Address</h3>
                <div className="flex items-center justify-between bg-[#0A0A0A] border border-[#374151] rounded-xl p-3">
                    <code className="text-[#F0B90B] font-mono text-sm sm:text-base truncate mr-4">
                        {mockContractAddress}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="flex-shrink-0 p-2 bg-[#1F2937] hover:bg-[#374151] rounded-lg transition-colors flex items-center gap-2 text-gray-300 hover:text-white"
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                        <span className="text-xs font-semibold hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                </div>
            </div>

            {/* Next Steps Grid */}
            <div className="w-full mb-10">
                <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                    Required Next Steps <ArrowRight className="w-4 h-4 text-[#F0B90B]" />
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Add Liquidity Card */}
                    <div className="bg-[#111827] border border-[#1F2937] hover:border-[#10B981]/50 rounded-xl p-5 cursor-pointer transition-all group flex flex-col justify-between min-h-[140px]">
                        <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Droplet className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm mb-1">Seed Liquidity Pool</h4>
                            <p className="text-xs text-gray-500">Provide initial BNB to enable trading and activate PLU mechanics.</p>
                        </div>
                    </div>

                    {/* Dashboard Card */}
                    <Link href="/dashboard" className="bg-[#111827] border border-[#1F2937] hover:border-[#F0B90B]/50 rounded-xl p-5 cursor-pointer transition-all group flex flex-col justify-between min-h-[140px]">
                        <div className="w-10 h-10 rounded-lg bg-[#F0B90B]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <LayoutGrid className="w-5 h-5 text-[#F0B90B]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm mb-1">Manage Dashboard</h4>
                            <p className="text-xs text-gray-500">View live metrics, renounce ownership, or manage team vesting.</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-6 items-center">
                <button
                    onClick={onCreateAnother}
                    className="text-sm font-semibold text-gray-500 hover:text-white transition-colors"
                >
                    Launch Another Token
                </button>
                <a
                    href={`https://testnet.bscscan.com/address/${mockContractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#F0B90B] hover:text-[#F3BA2F] transition-colors flex items-center gap-1.5"
                >
                    View on BscScan <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>

        </div>
    );
}
