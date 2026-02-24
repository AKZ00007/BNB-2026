/**
 * AI Client — Token Config Generation via Groq
 * Uses llama-3.3-70b-versatile with JSON mode for structured tokenomics output.
 * NOTE: File kept as gemini.ts to avoid import changes across the codebase.
 */

import Groq from 'groq-sdk';
import type { TokenConfig } from '@/types/config';

const MODEL = 'llama-3.3-70b-versatile';

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set');
  return new Groq({ apiKey });
}

// ─── Prompt Builder ────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are an expert tokenomics designer specializing in BNB Chain (BSC) token launches.
You have analyzed 50+ successful BSC token launches and know exactly what makes tokens succeed or fail.

KEY INSIGHTS FROM SUCCESSFUL LAUNCHES:
- TGE% under 20% gives 3x better 30-day price stability
- Anti-whale limits under 2% reduce dump risk by 60%
- PLU locked 6+ months earns 40% more investor trust
- Sell tax above 10% kills trading volume within 2 weeks
- Team/advisor cliff of 3+ months prevents early dumps

You ALWAYS return a valid JSON object matching the exact schema provided. No extra text, no markdown, just JSON.`;
}

function buildUserPrompt(userGoal: string): string {
  return `Generate a complete tokenomics configuration for this token goal:

"${userGoal}"

Return a JSON object with EXACTLY this structure (no extra fields, no missing fields):
{
  "tokenName": "string - creative name matching the goal",
  "tokenSymbol": "string - 3-5 uppercase letters",
  "category": "meme|utility|dao|defi|gaming|ai|general",
  "description": "string - one sentence description for investors",
  "totalSupply": number between 1000000 and 1000000000000,
  "decimals": 18,
  "tgePercent": number between 5 and 30,
  "hardCapBnb": number between 50 and 5000,
  "softCapBnb": number (50-80% of hardCap),
  "vesting": [
    {
      "label": "string - allocation name e.g. Team, Marketing, Public Sale, Liquidity",
      "percent": number,
      "tgePercent": number between 0 and 30,
      "cliffMonths": number between 0 and 12,
      "vestingMonths": number between 0 and 36
    }
  ],
  "amm": {
    "dex": "PancakeSwap V2",
    "initialLiquidityPercent": number between 30 and 60,
    "buyTaxPercent": number between 0 and 5,
    "sellTaxPercent": number between 0 and 8,
    "antiWhaleMaxWalletPercent": number between 1 and 3,
    "maxTxPercent": number between 0.5 and 3,
    "antiBotBlocks": number between 1 and 5,
    "cooldownSeconds": number between 10 and 60,
    "dynamicTaxEnabled": true or false,
    "twapDeviationPercent": number between 10 and 25,
    "bondingCurve": "linear|exponential|flat"
  },
  "plu": {
    "totalLockPercent": number between 50 and 100,
    "milestones": [
      {
        "percent": number,
        "afterDays": number,
        "condition": "string - unlock condition description"
      }
    ]
  },
  "risk": {
    "score": number between 1 and 10 (10 is safest),
    "flags": ["array of warning strings"],
    "suggestions": ["array of improvement suggestions"]
  },
  "aiSummary": "string - one sentence summary for investors",
  "generatedAt": "${new Date().toISOString()}"
}

RULES:
- vesting percentages MUST sum to exactly 100
- plu milestones percentages MUST sum to totalLockPercent
- hardCapBnb must be greater than softCapBnb
- Return ONLY the JSON object, no markdown, no explanation`;
}

// ─── Main Generator ────────────────────────────────────────────────────────────

export async function generateTokenConfig(userGoal: string): Promise<TokenConfig> {
  const client = getClient();

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(userGoal) },
    ],
    temperature: 0.7,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('Groq returned an empty response');

  let config: TokenConfig;
  try {
    config = JSON.parse(text);
  } catch {
    throw new Error(`Groq returned invalid JSON: ${text.slice(0, 200)}`);
  }

  // Ensure required fields
  if (!config.tokenName || !config.tokenSymbol) {
    throw new Error('AI response missing required fields (tokenName, tokenSymbol)');
  }

  config.generatedAt = config.generatedAt || new Date().toISOString();
  return config;
}

// ─── Risk Scanner — Intelligence Layer ─────────────────────────────────────────

export interface RiskScanResult {
  score: number;           // 0–100
  rating: 'SAFE' | 'WARNING' | 'DANGEROUS';
  summary: string;         // AI-generated plain-language verdict
  flags: string[];         // e.g. ["Mint function active", "No LP lock"]
  details: {
    contractCode: { risk: string; notes: string };
    ownership: { risk: string; notes: string };
    liquidity: { risk: string; notes: string };
    holders: { risk: string; notes: string };
    trading: { risk: string; notes: string };
  };
  analyzedAt: string;
}

export interface TokenScanInput {
  contractAddress: string;
  tokenName?: string;
  tokenSymbol?: string;
  isVerified: boolean;
  sourceCode?: string;
  creationDate?: string;
  totalSupply?: string;
}

export interface DexScanInput {
  priceUsd?: number;
  marketCap?: number;
  liquidity?: number;
  volume24h?: number;
  priceChange24h?: number;
  txns24h?: { buys: number; sells: number };
  pairCreatedAt?: string;
}

export async function analyzeTokenRisk(
  token: TokenScanInput,
  dex: DexScanInput | null
): Promise<RiskScanResult> {
  const client = getClient();

  const systemPrompt = `You are GuardianLaunch AI — a blockchain security analyst specialized in BNB Chain (BSC) token safety.
Your job is to analyze token contracts and market data to produce a risk assessment.

You ALWAYS return a valid JSON object. No extra text, no markdown.

Risk scoring rules:
- 80–100 = SAFE — no critical flags, standard caution
- 50–79 = WARNING — notable risk factors, proceed carefully
- 0–49 = DANGEROUS — critical flags, high probability of scam

Analysis dimensions:
1. Contract Code: mint functions, tax modification, blacklists, hidden owners, proxy patterns
2. Ownership: renounced? multisig? single EOA?
3. Liquidity: LP locked? depth? concentration?
4. Holder Distribution: top holders %, dev wallet %
5. Trading History: age, volume patterns, buy/sell ratio anomalies`;

  const userPrompt = `Analyze this BNB Chain token for rug pull risk:

CONTRACT INFO:
- Address: ${token.contractAddress}
- Name: ${token.tokenName || 'Unknown'}
- Symbol: ${token.tokenSymbol || 'Unknown'}
- Verified on BscScan: ${token.isVerified ? 'YES' : 'NO'}
- Total Supply: ${token.totalSupply || 'Unknown'}
- Creation Date: ${token.creationDate || 'Unknown'}
- Source Code Available: ${token.sourceCode ? 'YES (' + token.sourceCode.length + ' chars)' : 'NO — unverified contract'}
${token.sourceCode ? `\nSOURCE CODE (first 3000 chars):\n${token.sourceCode.slice(0, 3000)}` : ''}

DEX MARKET DATA:
${dex ? `- Price: $${dex.priceUsd || 'N/A'}
- Market Cap: $${dex.marketCap || 'N/A'}
- Liquidity: $${dex.liquidity || 'N/A'}
- 24h Volume: $${dex.volume24h || 'N/A'}
- 24h Price Change: ${dex.priceChange24h || 'N/A'}%
- 24h Transactions: ${dex.txns24h ? `${dex.txns24h.buys} buys / ${dex.txns24h.sells} sells` : 'N/A'}
- Pair Created: ${dex.pairCreatedAt || 'N/A'}` : 'No DEX data available — token may not be traded yet.'}

Return this exact JSON structure:
{
  "score": <number 0-100>,
  "rating": "<SAFE|WARNING|DANGEROUS>",
  "summary": "<2-3 sentence plain-language verdict for retail investors>",
  "flags": ["<array of specific risk findings>"],
  "details": {
    "contractCode": { "risk": "<LOW|MEDIUM|HIGH|CRITICAL>", "notes": "<finding>" },
    "ownership": { "risk": "<LOW|MEDIUM|HIGH|CRITICAL>", "notes": "<finding>" },
    "liquidity": { "risk": "<LOW|MEDIUM|HIGH|CRITICAL>", "notes": "<finding>" },
    "holders": { "risk": "<LOW|MEDIUM|HIGH|CRITICAL>", "notes": "<finding>" },
    "trading": { "risk": "<LOW|MEDIUM|HIGH|CRITICAL>", "notes": "<finding>" }
  }
}`;

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3, // Lower temperature = more deterministic security analysis
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('Groq returned an empty response for risk analysis');

  let result: RiskScanResult;
  try {
    const parsed = JSON.parse(text);
    result = {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 50)),
      rating: ['SAFE', 'WARNING', 'DANGEROUS'].includes(parsed.rating) ? parsed.rating : 'WARNING',
      summary: String(parsed.summary || 'Analysis complete.'),
      flags: Array.isArray(parsed.flags) ? parsed.flags.map(String) : [],
      details: parsed.details || {
        contractCode: { risk: 'MEDIUM', notes: 'Could not analyze' },
        ownership: { risk: 'MEDIUM', notes: 'Could not analyze' },
        liquidity: { risk: 'MEDIUM', notes: 'Could not analyze' },
        holders: { risk: 'MEDIUM', notes: 'Could not analyze' },
        trading: { risk: 'MEDIUM', notes: 'Could not analyze' },
      },
      analyzedAt: new Date().toISOString(),
    };
  } catch {
    throw new Error(`Groq returned invalid JSON for risk analysis: ${text.slice(0, 200)}`);
  }

  return result;
}
