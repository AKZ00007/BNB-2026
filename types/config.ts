/**
 * TokenConfig — the central schema for AI-generated tokenomics configs.
 * Matches the bsc_launch_data and saved_configs Supabase tables.
 */

export interface VestingEntry {
    label: string;       // e.g. "Team", "Marketing"
    percent: number;     // e.g. 15
    tgePercent: number;  // unlocked at TGE, e.g. 5
    cliffMonths: number; // months locked after TGE
    vestingMonths: number; // linear vesting duration after cliff
}

export interface PLUMilestone {
    percent: number;     // % of LP to unlock
    afterDays: number;   // days after launch
    condition: string;   // e.g. "Price above ATH for 7 days"
}

export interface AMMConfig {
    dex: 'PancakeSwap V2' | 'PancakeSwap V3';
    initialLiquidityPercent: number; // % of raised funds to LP
    buyTaxPercent: number;
    sellTaxPercent: number;
    antiWhaleMaxWalletPercent: number; // max wallet % of supply
    maxTxPercent: number;              // max single TX % of supply
    antiBotBlocks: number; // blocks to restrict bot sniping at launch
    cooldownSeconds: number;           // min seconds between trades per wallet
    dynamicTaxEnabled: boolean;        // escalating sell tax under pressure
    twapDeviationPercent: number;      // max allowed TWAP price deviation %
    bondingCurve: 'linear' | 'exponential' | 'flat';
}

export interface PLUConfig {
    totalLockPercent: number;    // % of LP tokens locked
    milestones: PLUMilestone[];
}

export interface RiskAssessment {
    score: number;         // 1–10 (10 = safest)
    flags: string[];       // e.g. ["High sell tax", "Short vesting"]
    suggestions: string[]; // e.g. ["Consider extending cliff to 6 months"]
}

export interface TokenConfig {
    // Identity
    tokenName: string;
    tokenSymbol: string;
    category: 'meme' | 'utility' | 'dao' | 'defi' | 'gaming' | 'ai' | 'general';
    description: string;

    // Supply
    totalSupply: number;
    decimals: 18;

    // TGE
    tgePercent: number;        // % of total supply at launch (e.g. 10)
    hardCapBnb: number;        // IDO hard cap in BNB
    softCapBnb: number;

    // Distribution
    vesting: VestingEntry[];

    // AMM
    amm: AMMConfig;

    // PLU
    plu: PLUConfig;

    // Risk
    risk: RiskAssessment;

    // Meta
    aiSummary: string;  // 1-sentence AI explanation
    generatedAt: string; // ISO timestamp
}

// Zod-compatible runtime type (imported in API route)
export type PartialTokenConfig = Partial<TokenConfig>;
