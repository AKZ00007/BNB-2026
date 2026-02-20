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
    "antiBotBlocks": number between 1 and 5,
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
