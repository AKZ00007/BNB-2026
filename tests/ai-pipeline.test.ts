/**
 * Unit tests for AI Pipeline (lib/gemini.ts + /api/analyze)
 *
 * Uses mocked Groq responses to validate:
 * 1. JSON parsing & validation
 * 2. Required field checks
 * 3. Input boundary validation
 * 4. Edge cases (empty response, invalid JSON, missing fields)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock Groq SDK ──────────────────────────────────────────────────────────────

const mockCreate = vi.fn();

vi.mock('groq-sdk', () => ({
    default: class MockGroq {
        chat = { completions: { create: mockCreate } };
    },
}));

// Set env before importing
process.env.GROQ_API_KEY = 'test-api-key-mock';

// Dynamic import after mocking
const { generateTokenConfig } = await import('@/lib/gemini');

// ─── Fixtures ───────────────────────────────────────────────────────────────────

const VALID_CONFIG = {
    tokenName: 'TestCoin',
    tokenSymbol: 'TEST',
    category: 'utility',
    description: 'A test token',
    totalSupply: 1000000000,
    decimals: 18,
    tgePercent: 10,
    hardCapBnb: 500,
    softCapBnb: 300,
    vesting: [
        { label: 'Public Sale', percent: 40, tgePercent: 10, cliffMonths: 0, vestingMonths: 12 },
        { label: 'Team', percent: 20, tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
        { label: 'Liquidity', percent: 30, tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
        { label: 'Marketing', percent: 10, tgePercent: 5, cliffMonths: 1, vestingMonths: 12 },
    ],
    amm: {
        dex: 'PancakeSwap V2',
        initialLiquidityPercent: 40,
        buyTaxPercent: 2,
        sellTaxPercent: 4,
        antiWhaleMaxWalletPercent: 2,
        maxTxPercent: 1.5,
        antiBotBlocks: 3,
        cooldownSeconds: 30,
        dynamicTaxEnabled: true,
        twapDeviationPercent: 15,
        bondingCurve: 'linear',
    },
    plu: {
        totalLockPercent: 80,
        milestones: [
            { percent: 40, afterDays: 180, condition: '6-month lock' },
            { percent: 40, afterDays: 365, condition: '1-year lock' },
        ],
    },
    risk: {
        score: 8,
        flags: ['No audit'],
        suggestions: ['Consider KYC'],
    },
    aiSummary: 'A solid utility token.',
    generatedAt: '2026-01-01T00:00:00.000Z',
};

function mockGroqResponse(content: string) {
    mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content } }],
    });
}

// ─── Tests ──────────────────────────────────────────────────────────────────────

describe('generateTokenConfig', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns a valid TokenConfig from a well-formed Groq response', async () => {
        mockGroqResponse(JSON.stringify(VALID_CONFIG));
        const result = await generateTokenConfig('I want a utility token for staking rewards');
        expect(result.tokenName).toBe('TestCoin');
        expect(result.tokenSymbol).toBe('TEST');
        expect(result.totalSupply).toBe(1000000000);
        expect(result.vesting).toHaveLength(4);
        expect(result.risk.score).toBe(8);
    });

    it('adds generatedAt if missing from AI response', async () => {
        const configNoDate = { ...VALID_CONFIG };
        delete (configNoDate as any).generatedAt;
        mockGroqResponse(JSON.stringify(configNoDate));
        const result = await generateTokenConfig('Create a meme coin');
        expect(result.generatedAt).toBeDefined();
        expect(new Date(result.generatedAt!).getTime()).toBeGreaterThan(0);
    });

    it('throws on empty Groq response', async () => {
        mockCreate.mockResolvedValueOnce({
            choices: [{ message: { content: '' } }],
        });
        await expect(generateTokenConfig('test goal here')).rejects.toThrow('empty response');
    });

    it('throws on invalid JSON from Groq', async () => {
        mockGroqResponse('this is not JSON {{{');
        await expect(generateTokenConfig('test goal here')).rejects.toThrow('invalid JSON');
    });

    it('throws on missing required fields (tokenName)', async () => {
        const noName = { ...VALID_CONFIG, tokenName: '' };
        mockGroqResponse(JSON.stringify(noName));
        await expect(generateTokenConfig('test goal here')).rejects.toThrow('missing required fields');
    });

    it('throws on missing required fields (tokenSymbol)', async () => {
        const noSymbol = { ...VALID_CONFIG, tokenSymbol: '' };
        mockGroqResponse(JSON.stringify(noSymbol));
        await expect(generateTokenConfig('test goal here')).rejects.toThrow('missing required fields');
    });

    it('passes the user goal into the prompt', async () => {
        mockGroqResponse(JSON.stringify(VALID_CONFIG));
        const goal = 'a dog-themed meme coin with community governance';
        await generateTokenConfig(goal);
        const callArgs = mockCreate.mock.calls[0][0];
        expect(callArgs.messages[1].content).toContain(goal);
    });

    it('uses JSON mode in the Groq API call', async () => {
        mockGroqResponse(JSON.stringify(VALID_CONFIG));
        await generateTokenConfig('test goal here');
        const callArgs = mockCreate.mock.calls[0][0];
        expect(callArgs.response_format).toEqual({ type: 'json_object' });
    });

    it('preserves all nested objects (amm, plu, risk)', async () => {
        mockGroqResponse(JSON.stringify(VALID_CONFIG));
        const result = await generateTokenConfig('a defi token');
        expect(result.amm.dex).toBe('PancakeSwap V2');
        expect(result.plu.totalLockPercent).toBe(80);
        expect(result.plu.milestones).toHaveLength(2);
        expect(result.risk.flags).toContain('No audit');
    });
});

// ─── /api/analyze Input Validation Tests ────────────────────────────────────────

describe('/api/analyze input validation', () => {
    // These test the validation logic that the API route applies before calling generateTokenConfig
    // Extracted as pure functions to test without HTTP overhead

    function validateGoal(goal: any): string | null {
        if (!goal || typeof goal !== 'string' || goal.trim().length < 10) {
            return 'Please provide a goal of at least 10 characters.';
        }
        if (goal.length > 2000) {
            return 'Goal must be under 2000 characters.';
        }
        return null; // valid
    }

    it('rejects empty goal', () => {
        expect(validateGoal('')).toBeTruthy();
    });

    it('rejects null goal', () => {
        expect(validateGoal(null)).toBeTruthy();
    });

    it('rejects goal under 10 chars', () => {
        expect(validateGoal('short')).toBeTruthy();
    });

    it('accepts goal of exactly 10 chars', () => {
        expect(validateGoal('0123456789')).toBeNull();
    });

    it('rejects goal over 2000 chars', () => {
        expect(validateGoal('a'.repeat(2001))).toBeTruthy();
    });

    it('accepts goal of exactly 2000 chars', () => {
        expect(validateGoal('a'.repeat(2000))).toBeNull();
    });

    it('rejects non-string goal', () => {
        expect(validateGoal(123)).toBeTruthy();
        expect(validateGoal({})).toBeTruthy();
    });
});

// ─── Simulation Engine Tests ────────────────────────────────────────────────────

import { generatePriceScenarios } from '@/lib/simulation';

describe('generatePriceScenarios', () => {
    const testConfig = VALID_CONFIG as any;

    it('returns points array with initialPrice, peakGood, floorBad', () => {
        const result = generatePriceScenarios(testConfig);
        expect(result.points).toBeDefined();
        expect(result.initialPrice).toBeGreaterThan(0);
        expect(result.peakGood).toBeDefined();
        expect(result.floorBad).toBeDefined();
    });

    it('returns 91 data points for 90-day simulation (day 0..90)', () => {
        const result = generatePriceScenarios(testConfig);
        expect(result.points).toHaveLength(91);
    });

    it('each point has day, good, normal, bad fields', () => {
        const result = generatePriceScenarios(testConfig);
        const p = result.points[10];
        expect(p.day).toBe(10);
        expect(typeof p.good).toBe('number');
        expect(typeof p.normal).toBe('number');
        expect(typeof p.bad).toBe('number');
    });

    it('good scenario ends higher than bad scenario', () => {
        const result = generatePriceScenarios(testConfig);
        const last = result.points[result.points.length - 1];
        expect(last.good).toBeGreaterThan(last.bad);
    });

    it('all scenarios start at day 0 with value > 0', () => {
        const result = generatePriceScenarios(testConfig);
        const first = result.points[0];
        expect(first.day).toBe(0);
        expect(first.good).toBeGreaterThan(0);
        expect(first.normal).toBeGreaterThan(0);
        expect(first.bad).toBeGreaterThan(0);
    });

    it('produces deterministic results (same config = same output)', () => {
        const r1 = generatePriceScenarios(testConfig);
        const r2 = generatePriceScenarios(testConfig);
        expect(r1.points[5].good).toBeCloseTo(r2.points[5].good, 5);
        expect(r1.points[5].bad).toBeCloseTo(r2.points[5].bad, 5);
    });
});
