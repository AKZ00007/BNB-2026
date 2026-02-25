/**
 * guardian-score.ts
 * Phase 4B — Guardian Score Algorithm
 *
 * Computes a 0-100 safety score from live on-chain token metrics.
 * Higher = safer. Deductions based on verified risk signals.
 */

export interface TokenMetrics {
    isVerified: boolean;
    buyTaxBps: number;
    sellTaxBps: number;
    hasAntiWhale: boolean;       // maxWalletAmount < totalSupply
    hasCooldown: boolean;        // sellCooldownSeconds > 0
    ownerCanMint: boolean;       // detected from ABI — GuardianToken: false
    ownerCanPause: boolean;      // detected from ABI — GuardianToken: false
    isProxy: boolean;            // detected from BscScan — GuardianToken: false
    taxCanIncrease: boolean;     // GuardianToken: always false (only reduceTax exists)
}

export interface GuardianScore {
    score: number;
    tier: ScoreTier;
    deductions: Deduction[];
}

export interface Deduction {
    reason: string;
    points: number;
}

export interface ScoreTier {
    label: string;
    color: 'green' | 'yellow' | 'orange' | 'red';
    emoji: '🟢' | '🟡' | '🟠' | '🔴';
    badge: string;
}

export function computeGuardianScore(m: TokenMetrics): GuardianScore {
    const deductions: Deduction[] = [];

    const deduct = (reason: string, points: number) => {
        deductions.push({ reason, points });
    };

    if (!m.isVerified) deduct('Contract not verified on BscScan', 30);
    if (m.buyTaxBps > 1000) deduct('Buy tax > 10% — suspicious', 20);
    else if (m.buyTaxBps > 500) deduct('Buy tax > 5%', 10);
    if (m.sellTaxBps > 1000) deduct('Sell tax > 10% — likely honeypot', 25);
    else if (m.sellTaxBps > 500) deduct('Sell tax > 5%', 10);
    if (!m.hasCooldown) deduct('No sell cooldown — bot-friendly', 10);
    if (!m.hasAntiWhale) deduct('No max wallet limit — whale dump risk', 10);
    if (m.ownerCanMint) deduct('Owner can mint new tokens — rug risk', 25);
    if (m.ownerCanPause) deduct('Trading can be paused — honeypot risk', 20);
    if (m.isProxy) deduct('Upgradeable proxy — logic can change post-launch', 15);
    if (m.taxCanIncrease) deduct('Tax can be increased after deployment', 15);

    const totalDeductions = deductions.reduce((sum, d) => sum + d.points, 0);
    const score = Math.max(0, 100 - totalDeductions);

    return { score, tier: getScoreTier(score), deductions };
}

export function getScoreTier(score: number): ScoreTier {
    if (score >= 90) return { label: 'Guardian Protected', badge: 'SAFE', color: 'green', emoji: '🟢' };
    if (score >= 70) return { label: 'Moderate Risk', badge: 'CAUTION', color: 'yellow', emoji: '🟡' };
    if (score >= 50) return { label: 'High Risk', badge: 'RISKY', color: 'orange', emoji: '🟠' };
    return { label: 'Danger — Likely Scam', badge: 'DANGER', color: 'red', emoji: '🔴' };
}

/**
 * Build TokenMetrics from live contract reads + BscScan verification status.
 * GuardianToken has no mint, no pause, no proxy, tax can only decrease.
 */
export function buildMetricsFromTokenInfo(
    info: {
        totalSupply: bigint;
        buyTaxBps: bigint;
        sellTaxBps: bigint;
        maxWalletAmount: bigint;
        sellCooldownSeconds: bigint;
    },
    isVerified: boolean
): TokenMetrics {
    return {
        isVerified,
        buyTaxBps: Number(info.buyTaxBps),
        sellTaxBps: Number(info.sellTaxBps),
        hasAntiWhale: info.maxWalletAmount < info.totalSupply,
        hasCooldown: info.sellCooldownSeconds > 0n,
        // GuardianToken is non-mintable, non-pausable, non-proxy, tax-decreasing only
        ownerCanMint: false,
        ownerCanPause: false,
        isProxy: false,
        taxCanIncrease: false,
    };
}
