/**
 * Price Simulation Engine
 * Generates Good / Normal / Bad 90-day price scenarios from a TokenConfig.
 * Uses a seeded PRNG so the same config always renders the same chart.
 */

import type { TokenConfig } from '@/types/config';

export interface PricePoint {
    day: number;
    good: number;
    normal: number;
    bad: number;
}

export interface SimulationResult {
    points: PricePoint[];
    initialPrice: number; // USD (estimated)
    peakGood: number;
    floorBad: number;
}

// ─── Seeded pseudo-random (mulberry32) ────────────────────────────────────────
function makeRng(seed: number) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hashString(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

function clamp(v: number, min = 0.001, max = 100) {
    return Math.max(min, Math.min(max, v));
}

// ─── Day-by-day unlock pressure ────────────────────────────────────────────────
function buildUnlockPressure(config: TokenConfig, days: number): number[] {
    const pressure = new Array<number>(days + 1).fill(0);

    for (const vest of config.vesting) {
        const tgeFrac = vest.tgePercent / 100;
        const allocFrac = vest.percent / 100;

        // TGE unlock on day 0
        pressure[0] += allocFrac * tgeFrac;

        const cliffDay = Math.round(vest.cliffMonths * 30);
        const vestDays = vest.vestingMonths * 30;
        const remainingFrac = allocFrac * (1 - tgeFrac);

        if (vestDays === 0) {
            // All remaining at cliff
            if (cliffDay <= days) pressure[cliffDay] += remainingFrac;
        } else {
            // Linear daily drip after cliff
            const dailyFrac = remainingFrac / vestDays;
            for (let d = cliffDay + 1; d <= cliffDay + vestDays && d <= days; d++) {
                pressure[d] += dailyFrac;
            }
        }
    }
    return pressure;
}

// ─── Main simulator ───────────────────────────────────────────────────────────
export function generatePriceScenarios(
    config: TokenConfig,
    days = 90
): SimulationResult {
    const rng = makeRng(hashString(config.tokenName + config.tokenSymbol));

    // Estimate initial price: hardCapBnb / circulating supply at TGE
    // Assuming 1 BNB ≈ $300 for display purposes
    const BNB_USD = 300;
    const circulatingAtTGE = config.totalSupply * (config.tgePercent / 100);
    const initialPrice =
        circulatingAtTGE > 0
            ? (config.hardCapBnb * BNB_USD) / circulatingAtTGE
            : 0.001;

    // Stability modifiers from config
    const sellTaxBonus = 1 + config.amm.sellTaxPercent * 0.02; // higher tax → more stable
    const antiWhaleBonus = 1 + (3 - config.amm.antiWhaleMaxWalletPercent) * 0.05;
    const pluBonus = 1 + (config.plu.totalLockPercent / 100) * 0.15;
    const stabilityMultiplier = sellTaxBonus * antiWhaleBonus * pluBonus;

    // Per-day unlock pressure
    const unlockPressure = buildUnlockPressure(config, days);

    // Growth targets (multipliers at day 90)
    const goodTarget = 1.5 * stabilityMultiplier;
    const normalTarget = 1.05;
    const badTarget = 0.7;

    const points: PricePoint[] = [];
    let good = 1;
    let normal = 1;
    let bad = 1;

    let peakGood = 1;
    let floorBad = 1;

    for (let day = 0; day <= days; day++) {
        if (day > 0) {
            const t = day / days;
            const noise = () => (rng() - 0.5) * 0.035;

            // Sell pressure from vesting unlocks (fraction of supply entering market)
            const sellImpact = unlockPressure[day] * 0.25; // 25% of unlocked assumed sold

            // Drift toward target
            const goodDrift = ((goodTarget - 1) / days) * (1 + (rng() - 0.4) * 0.3);
            const normalDrift = ((normalTarget - 1) / days) * (1 + (rng() - 0.5) * 0.5);
            const badDrift = ((badTarget - 1) / days) * (1 + (rng() - 0.3) * 0.2);

            good = clamp(good + goodDrift - sellImpact + noise());
            normal = clamp(normal + normalDrift - sellImpact * 0.5 + noise() * 0.5);
            bad = clamp(bad + badDrift - sellImpact * 0.3 + noise() * 0.3);

            if (good > peakGood) peakGood = good;
            if (bad < floorBad) floorBad = bad;
        }

        points.push({
            day,
            good: parseFloat(good.toFixed(4)),
            normal: parseFloat(normal.toFixed(4)),
            bad: parseFloat(bad.toFixed(4)),
        });
    }

    return { points, initialPrice, peakGood, floorBad };
}
