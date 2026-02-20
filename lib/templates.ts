/**
 * AI Token Launch Templates
 * Pre-built tokenomics configurations optimized for specific project categories.
 * Each template provides a complete TokenConfig that can be applied to the wizard with one click.
 */

import type { TokenConfig } from '@/types/config';

export interface TokenTemplate {
    id: string;
    name: string;
    category: 'chatbot' | 'agent' | 'compute' | 'data' | 'defi' | 'meme' | 'dao' | 'gaming';
    tagline: string;
    description: string;
    icon: string; // emoji
    gradient: string; // tailwind gradient classes
    examples: string[]; // real-world examples for reference
    config: TokenConfig;
}

export const TOKEN_TEMPLATES: TokenTemplate[] = [
    // ─── AI Chatbot Token ──────────────────────────────────────────────────────
    {
        id: 'ai-chatbot',
        name: 'AI Chatbot Utility',
        category: 'chatbot',
        tagline: 'Pay-per-query token for AI chatbot services',
        description:
            'Optimized for AI chatbot platforms where users spend tokens to access conversational AI. Features low TGE to prevent dumps, staking-friendly vesting, and moderate anti-whale protection.',
        icon: '🤖',
        gradient: 'from-blue-500 to-cyan-400',
        examples: ['ChatGPT-style services', 'Customer support bots', 'AI writing assistants'],
        config: {
            tokenName: 'ChatAI Token',
            tokenSymbol: 'CHAI',
            category: 'ai',
            description: 'Utility token powering pay-per-query AI chatbot interactions',
            totalSupply: 500000000,
            decimals: 18,
            tgePercent: 8,
            hardCapBnb: 1000,
            softCapBnb: 500,
            vesting: [
                { label: 'Public Sale', percent: 30, tgePercent: 15, cliffMonths: 0, vestingMonths: 12 },
                { label: 'Team & Advisors', percent: 15, tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
                { label: 'Liquidity Pool', percent: 25, tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
                { label: 'Ecosystem / Staking', percent: 20, tgePercent: 0, cliffMonths: 3, vestingMonths: 36 },
                { label: 'Marketing', percent: 10, tgePercent: 10, cliffMonths: 1, vestingMonths: 12 },
            ],
            amm: {
                dex: 'PancakeSwap V2',
                initialLiquidityPercent: 40,
                buyTaxPercent: 2,
                sellTaxPercent: 4,
                antiWhaleMaxWalletPercent: 2,
                antiBotBlocks: 3,
                bondingCurve: 'linear',
            },
            plu: {
                totalLockPercent: 80,
                milestones: [
                    { percent: 20, afterDays: 90, condition: '90-day lock period' },
                    { percent: 30, afterDays: 180, condition: '1,000+ active users milestone' },
                    { percent: 30, afterDays: 365, condition: '12-month maturity' },
                ],
            },
            risk: {
                score: 8,
                flags: ['Low TGE unlock reduces dump risk'],
                suggestions: ['Consider KYC for team tokens', 'Add token burn mechanism per query'],
            },
            aiSummary: 'Conservative AI utility token with long vesting, ideal for subscription-based AI chatbot services.',
            generatedAt: new Date().toISOString(),
        },
    },

    // ─── AI Agent Token ─────────────────────────────────────────────────────────
    {
        id: 'ai-agent',
        name: 'AI Agent Network',
        category: 'agent',
        tagline: 'Stake-to-access token for autonomous AI agents',
        description:
            'Designed for AI agent platforms where token holders stake to deploy autonomous agents. Higher staking allocation, longer cliffs for team, and milestone-based PLU tied to agent activity metrics.',
        icon: '🕵️',
        gradient: 'from-purple-500 to-pink-400',
        examples: ['Auto-GPT ecosystems', 'Trading agents', 'Research assistants'],
        config: {
            tokenName: 'AgentVerse Token',
            tokenSymbol: 'AGNT',
            category: 'ai',
            description: 'Stake tokens to deploy and operate autonomous AI agents on-chain',
            totalSupply: 1000000000,
            decimals: 18,
            tgePercent: 5,
            hardCapBnb: 2000,
            softCapBnb: 1000,
            vesting: [
                { label: 'Public Sale', percent: 25, tgePercent: 10, cliffMonths: 0, vestingMonths: 12 },
                { label: 'Team & Advisors', percent: 18, tgePercent: 0, cliffMonths: 9, vestingMonths: 30 },
                { label: 'Liquidity Pool', percent: 20, tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
                { label: 'Agent Staking Rewards', percent: 25, tgePercent: 0, cliffMonths: 1, vestingMonths: 36 },
                { label: 'Treasury', percent: 12, tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
            ],
            amm: {
                dex: 'PancakeSwap V2',
                initialLiquidityPercent: 35,
                buyTaxPercent: 1,
                sellTaxPercent: 5,
                antiWhaleMaxWalletPercent: 1.5,
                antiBotBlocks: 5,
                bondingCurve: 'exponential',
            },
            plu: {
                totalLockPercent: 90,
                milestones: [
                    { percent: 20, afterDays: 120, condition: '500+ active agents deployed' },
                    { percent: 35, afterDays: 270, condition: '$1M daily agent transaction volume' },
                    { percent: 35, afterDays: 365, condition: '12-month maturity' },
                ],
            },
            risk: {
                score: 9,
                flags: ['Very conservative TGE', 'Strong PLU commitment'],
                suggestions: ['Agent governance DAO recommended at 6 months'],
            },
            aiSummary: 'High-conviction AI agent token with 90% PLU lock and staking-first distribution for long-term builders.',
            generatedAt: new Date().toISOString(),
        },
    },

    // ─── Compute Network Token ────────────────────────────────────────────────
    {
        id: 'compute-network',
        name: 'Decentralized Compute',
        category: 'compute',
        tagline: 'Pay-per-compute GPU marketplace token',
        description:
            'For decentralized GPU/compute networks. Token is spent to rent compute and earned by node operators. Features balanced distribution between compute providers and users.',
        icon: '⚡',
        gradient: 'from-amber-500 to-orange-400',
        examples: ['Render Network', 'Akash', 'GPU rental markets'],
        config: {
            tokenName: 'ComputeX Token',
            tokenSymbol: 'CMPX',
            category: 'ai',
            description: 'Utility token for decentralized GPU compute network — pay to compute, earn to provide',
            totalSupply: 2000000000,
            decimals: 18,
            tgePercent: 10,
            hardCapBnb: 3000,
            softCapBnb: 1500,
            vesting: [
                { label: 'Public Sale', percent: 20, tgePercent: 12, cliffMonths: 0, vestingMonths: 10 },
                { label: 'Team & Advisors', percent: 15, tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
                { label: 'Liquidity Pool', percent: 20, tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
                { label: 'Node Operator Rewards', percent: 30, tgePercent: 5, cliffMonths: 0, vestingMonths: 48 },
                { label: 'Ecosystem Fund', percent: 15, tgePercent: 0, cliffMonths: 3, vestingMonths: 24 },
            ],
            amm: {
                dex: 'PancakeSwap V2',
                initialLiquidityPercent: 45,
                buyTaxPercent: 1,
                sellTaxPercent: 3,
                antiWhaleMaxWalletPercent: 2,
                antiBotBlocks: 3,
                bondingCurve: 'linear',
            },
            plu: {
                totalLockPercent: 85,
                milestones: [
                    { percent: 25, afterDays: 90, condition: '100+ compute nodes online' },
                    { percent: 30, afterDays: 180, condition: '10,000 compute hours processed' },
                    { percent: 30, afterDays: 365, condition: '12-month network maturity' },
                ],
            },
            risk: {
                score: 8,
                flags: ['Heavy node operator allocation ensures network growth'],
                suggestions: ['Add compute-to-earn mechanism', 'Consider node staking requirements'],
            },
            aiSummary: 'Infrastructure token with 30% allocated to compute providers — built for GPU network economies.',
            generatedAt: new Date().toISOString(),
        },
    },

    // ─── Data Marketplace Token ───────────────────────────────────────────────
    {
        id: 'data-marketplace',
        name: 'AI Data Marketplace',
        category: 'data',
        tagline: 'Token for buying & selling training data',
        description:
            'Powers an AI data marketplace where datasets are tokenized. Data providers earn tokens, AI companies spend tokens to access curated training data.',
        icon: '📊',
        gradient: 'from-emerald-500 to-teal-400',
        examples: ['Ocean Protocol', 'SingularityNET', 'Data DAOs'],
        config: {
            tokenName: 'DataVault Token',
            tokenSymbol: 'DVLT',
            category: 'ai',
            description: 'Marketplace token for buying, selling, and staking AI training datasets',
            totalSupply: 750000000,
            decimals: 18,
            tgePercent: 12,
            hardCapBnb: 1500,
            softCapBnb: 800,
            vesting: [
                { label: 'Public Sale', percent: 25, tgePercent: 15, cliffMonths: 0, vestingMonths: 8 },
                { label: 'Team & Advisors', percent: 12, tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
                { label: 'Liquidity Pool', percent: 22, tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
                { label: 'Data Provider Rewards', percent: 28, tgePercent: 5, cliffMonths: 1, vestingMonths: 36 },
                { label: 'DAO Treasury', percent: 13, tgePercent: 0, cliffMonths: 3, vestingMonths: 18 },
            ],
            amm: {
                dex: 'PancakeSwap V2',
                initialLiquidityPercent: 40,
                buyTaxPercent: 2,
                sellTaxPercent: 3,
                antiWhaleMaxWalletPercent: 2.5,
                antiBotBlocks: 2,
                bondingCurve: 'linear',
            },
            plu: {
                totalLockPercent: 75,
                milestones: [
                    { percent: 25, afterDays: 60, condition: '100+ datasets listed' },
                    { percent: 25, afterDays: 150, condition: '$500k marketplace volume' },
                    { percent: 25, afterDays: 300, condition: '10-month maturity' },
                ],
            },
            risk: {
                score: 7,
                flags: ['Moderate TGE — acceptable for marketplace tokens'],
                suggestions: ['Add dataset staking for quality assurance', 'Consider data provider badges'],
            },
            aiSummary: 'Marketplace token with 28% for data providers and DAO governance — built for AI data economies.',
            generatedAt: new Date().toISOString(),
        },
    },

    // ─── Community Meme Coin ─────────────────────────────────────────────────
    {
        id: 'community-meme',
        name: 'Community Meme Coin',
        category: 'meme',
        tagline: 'Fair-launch meme token with anti-rug protections',
        description:
            'A meme coin template with crash-proof defaults: high LP allocation, strong anti-whale limits, and aggressive PLU to build community trust. Designed to avoid the 80% failure rate of typical meme launches.',
        icon: '🐸',
        gradient: 'from-green-400 to-lime-400',
        examples: ['DOGE-style community tokens', 'Viral meme projects', 'Charity memes'],
        config: {
            tokenName: 'MoonFrog Token',
            tokenSymbol: 'MFROG',
            category: 'meme',
            description: 'Community-driven meme token with anti-rug protection and fair launch mechanics',
            totalSupply: 100000000000,
            decimals: 18,
            tgePercent: 20,
            hardCapBnb: 200,
            softCapBnb: 100,
            vesting: [
                { label: 'Public Sale', percent: 45, tgePercent: 25, cliffMonths: 0, vestingMonths: 3 },
                { label: 'Team', percent: 5, tgePercent: 0, cliffMonths: 3, vestingMonths: 12 },
                { label: 'Liquidity Pool', percent: 35, tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
                { label: 'Community Rewards', percent: 15, tgePercent: 10, cliffMonths: 0, vestingMonths: 6 },
            ],
            amm: {
                dex: 'PancakeSwap V2',
                initialLiquidityPercent: 55,
                buyTaxPercent: 1,
                sellTaxPercent: 3,
                antiWhaleMaxWalletPercent: 1,
                antiBotBlocks: 5,
                bondingCurve: 'flat',
            },
            plu: {
                totalLockPercent: 95,
                milestones: [
                    { percent: 30, afterDays: 180, condition: 'Price stable above launch for 30+ days' },
                    { percent: 35, afterDays: 270, condition: '5,000+ holders' },
                    { percent: 30, afterDays: 365, condition: '12-month full maturity' },
                ],
            },
            risk: {
                score: 7,
                flags: ['High TGE for meme liquidity', '95% PLU lock is very strong'],
                suggestions: ['Add community vote for PLU extensions', 'Consider 0% buy tax for virality'],
            },
            aiSummary: 'Anti-rug meme coin: 55% LP, 95% PLU lock, 1% max wallet — designed for sustainable community growth.',
            generatedAt: new Date().toISOString(),
        },
    },

    // ─── DeFi Governance DAO ──────────────────────────────────────────────────
    {
        id: 'defi-dao',
        name: 'DeFi Governance DAO',
        category: 'dao',
        tagline: 'Governance token for DeFi protocol DAOs',
        description:
            'DAO governance token with voting power proportional to staked holdings. Long vesting ensures committed governance participants. Revenue-sharing built into smart contract.',
        icon: '🏛️',
        gradient: 'from-indigo-500 to-violet-400',
        examples: ['Uniswap-style governance', 'Compound DAO', 'Protocol treasuries'],
        config: {
            tokenName: 'GovernX Token',
            tokenSymbol: 'GVX',
            category: 'dao',
            description: 'Governance token for DeFi protocol — stake to vote, earn from protocol revenue',
            totalSupply: 100000000,
            decimals: 18,
            tgePercent: 7,
            hardCapBnb: 2500,
            softCapBnb: 1200,
            vesting: [
                { label: 'Public Sale', percent: 20, tgePercent: 10, cliffMonths: 0, vestingMonths: 12 },
                { label: 'Team & Advisors', percent: 20, tgePercent: 0, cliffMonths: 12, vestingMonths: 36 },
                { label: 'Liquidity Pool', percent: 15, tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
                { label: 'DAO Treasury', percent: 30, tgePercent: 0, cliffMonths: 3, vestingMonths: 48 },
                { label: 'Grants & Ecosystem', percent: 15, tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
            ],
            amm: {
                dex: 'PancakeSwap V2',
                initialLiquidityPercent: 30,
                buyTaxPercent: 0,
                sellTaxPercent: 2,
                antiWhaleMaxWalletPercent: 3,
                antiBotBlocks: 3,
                bondingCurve: 'linear',
            },
            plu: {
                totalLockPercent: 85,
                milestones: [
                    { percent: 25, afterDays: 180, condition: '100+ governance proposals submitted' },
                    { percent: 30, afterDays: 365, condition: '$5M TVL in protocol' },
                    { percent: 30, afterDays: 730, condition: '24-month DAO maturity' },
                ],
            },
            risk: {
                score: 9,
                flags: ['Very conservative — 12-month team cliff', '30% DAO treasury ensures longevity'],
                suggestions: ['Implement vote-escrowed staking (veToken model)'],
            },
            aiSummary: 'Battle-tested DAO governance template with 12-month team cliff, 30% treasury, and 85% PLU lock.',
            generatedAt: new Date().toISOString(),
        },
    },
];

export const TEMPLATE_CATEGORIES = [
    { id: 'all', label: 'All Templates', icon: '✨' },
    { id: 'chatbot', label: 'AI Chatbot', icon: '🤖' },
    { id: 'agent', label: 'AI Agent', icon: '🕵️' },
    { id: 'compute', label: 'Compute', icon: '⚡' },
    { id: 'data', label: 'Data Market', icon: '📊' },
    { id: 'meme', label: 'Meme', icon: '🐸' },
    { id: 'dao', label: 'DAO', icon: '🏛️' },
] as const;
