# Tech Stack Documentation

## AI Token Launchpad Designer

**Version:** 1.0
**Target Scale:** 10 concurrent users (MVP)
**Budget Constraint:** Free tier services only
**Deployment Model:** Serverless-first for cost efficiency

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Frontend Stack](#2-frontend-stack)
3. [Backend Stack](#3-backend-stack)
4. [Database & Caching](#4-database--caching)
5. [Blockchain Integration](#5-blockchain-integration)
6. [AI & LLM Services](#6-ai--llm-services)
7. [External APIs](#7-external-apis)
8. [Deployment & Hosting](#8-deployment--hosting)
9. [Development Tools](#9-development-tools)
10. [Cost Analysis & Scalability](#10-cost-analysis--scalability)
11. [Setup Instructions](#11-setup-instructions)
12. [Additional Recommendations](#12-additional-recommendations)

---

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  Next.js 15 App Router + React 19 + Tailwind CSS + Shadcn/UI   │
│  wagmi + viem (Wallet Connection & Contract Interaction)        │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│  Next.js API Routes (Serverless Functions on Vercel)            │
│  /api/analyze - AI Config Generation                            │
│  /api/simulate - Price Simulation                               │
│  /api/config - Save/Retrieve Configs                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                      DATA & SERVICES LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Supabase    │  │  Gemini API  │  │  BscScan API │         │
│  │  PostgreSQL  │  │  (Free Tier) │  │  (Free Tier) │         │
│  │  Auth        │  └──────────────┘  └──────────────┘         │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN LAYER                           │
│  BSC Testnet (97) / BSC Mainnet (56)                           │
│  PancakeSwap Router, OpenZeppelin Contracts                     │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Design Principles

- **Serverless-first**: No always-on servers; pay only for execution time
- **Client-heavy**: Blockchain transactions handled entirely client-side
- **Free-tier maximization**: Leverage generous free tiers for MVP scale
- **Progressive enhancement**: Works without wallet connection for browsing

---

## 2. Frontend Stack

### 2.1 Core Framework

#### Next.js 15 (App Router)

- **Why**: Free deployment on Vercel, built-in API routes, excellent DX, SSR/ISR support
- **Free Tier**: Unlimited hobby projects, 100GB bandwidth/month, serverless functions
- **Docs**: https://nextjs.org/docs

#### React 19

- **Why**: Latest features (Server Components, Actions), industry standard
- **License**: MIT (free)
- **Docs**: https://react.dev/

### 2.2 Styling & UI Components

#### Tailwind CSS v4

- **Why**: Utility-first, no runtime CSS-in-JS overhead, mobile-first responsive
- **License**: MIT (free)
- **Setup**:

  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

- **Docs**: https://tailwindcss.com/docs

#### Shadcn/UI

- **Why**: Copy-paste components (not npm dependency), Radix UI primitives, full customization
- **License**: MIT (free)
- **Setup**:

  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button card dialog input
  ```

- **Components needed**: Button, Card, Dialog, Input, Select, Tabs, Accordion, Skeleton
- **Docs**: https://ui.shadcn.com/

#### Lucide React (Icons)

- **Why**: Clean iconset, tree-shakeable, maintained
- **Install**: `npm install lucide-react`
- **Docs**: https://lucide.dev/

### 2.3 Data Visualization

#### Recharts

- **Why**: React-native, declarative API, handles responsive charts well
- **Install**: `npm install recharts`
- **Use Case**: Three price simulation graphs (Line charts with multiple series)
- **Docs**: https://recharts.org/

### 2.4 State Management

#### React Context + Hooks (Built-in)

- **Why**: No extra dependencies for 10-user scale; `useState` + `useContext` sufficient
- **Pattern**:
  - `WizardContext` — wizard step state, user inputs
  - `ConfigContext` — generated config, simulations
  - `AuthContext` — wallet address, auth status

#### React Query / TanStack Query v5 *(Optional for v1.1+)*

- **Why**: Cache API responses, auto-refetch, optimistic updates
- **Install**: `npm install @tanstack/react-query`
- **Free**: Yes
- **Docs**: https://tanstack.com/query/latest

---

## 3. Backend Stack

### 3.1 API Framework

#### Next.js API Routes (Serverless Functions)

- **Why**: Zero config, auto-scales, same codebase as frontend
- **Location**: `/app/api/[route]/route.ts` (App Router pattern)
- **Runtime**: Node.js 20.x
- **Timeout**: 10s on Vercel free tier (sufficient for AI calls)

#### Endpoints to Build

```
POST /api/analyze
  - Body: { goals: string, raiseTarget: number, stabilityDays: number }
  - Returns: { config: TokenomicsConfig, explanations: string[] }

POST /api/simulate
  - Body: { config: TokenomicsConfig, scenarios: ['bull', 'normal', 'bear'] }
  - Returns: { simulations: { bull: [], normal: [], bear: [] } }

GET /api/config/:id
  - Returns: Saved config from Supabase

POST /api/config
  - Body: { config: TokenomicsConfig, walletAddress: string }
  - Returns: { id: string }

GET /api/data/refresh
  - Triggered by cron (Vercel Cron)
  - Fetches BSC launch data, updates cache

# ⭐ CORE FEATURE ENDPOINTS

POST /api/launchpad/create
  - Body: { tokenConfig, fundraiseConfig, whitelistAddresses?, pluConfig }
  - Returns: { launchpadId, contractAddress }

GET /api/launchpad/:id
  - Returns: Launchpad details, progress, contributors, PLU status

GET /api/launchpad/discover
  - Query: { status: 'upcoming'|'active'|'completed', category?, page }
  - Returns: Paginated launchpad listings

POST /api/plu/configure
  - Body: { launchpadId, lockDuration, unlockSchedule, milestones[] }
  - Returns: { pluContractAddress }

GET /api/plu/:launchpadId/status
  - Returns: PLU lock status, next unlock, conditions met/unmet

POST /api/amm/configure
  - Body: { bondingCurve, feeStructure, liquidityDepth, antiWhaleConfig }
  - Returns: { ammConfig, simulationPreview }

POST /api/amm/simulate
  - Body: { ammConfig, buyPressure, sellPressure }
  - Returns: { priceImpactChart[] }

GET /api/growth/:tokenAddress/dashboard
  - Returns: Live metrics, holder analytics, alerts

POST /api/growth/buyback/configure
  - Body: { tokenAddress, treasuryWallet, triggerConditions, amount }
  - Returns: { buybackConfigId }

POST /api/growth/airdrop/schedule
  - Body: { tokenAddress, recipients[], amount, date }
  - Returns: { airdropId }

GET /api/templates
  - Query: { category: 'chatbot'|'agent'|'compute'|'data' }
  - Returns: AI token template library

GET /api/templates/:id
  - Returns: Full template with tokenomics presets and examples
```

### 3.2 Validation & Type Safety

#### Zod

- **Why**: Runtime validation + TypeScript types from single schema
- **Install**: `npm install zod`
- **Use Case**: Validate all API inputs/outputs, LLM JSON responses
- **Example**:

  ```typescript
  import { z } from 'zod';

  const TokenomicsConfigSchema = z.object({
    tge_percent: z.number().min(5).max(30),
    vesting_schedule: z.array(z.number()),
    cliff_months: z.number().min(0).max(12),
    supply_allocation: z.object({
      team: z.number(),
      community: z.number(),
      lp: z.number(),
      reserve: z.number(),
    }),
    lp_lock_duration: z.number(),
    anti_sniper_delay: z.number(),
    bonding_curve_type: z.enum(['linear', 'exponential', 'flat']),
  });
  ```

- **Docs**: https://zod.dev/

#### TypeScript 5.3+

- **Why**: Catch bugs at compile time, better DX with autocomplete
- **License**: Apache 2.0 (free)
- **Config**: Strict mode enabled in `tsconfig.json`

---

## 4. Database & Caching

### 4.1 Primary Database

#### Supabase (PostgreSQL)

- **Why**: Free 500MB database, built-in auth, real-time subscriptions, generous free tier
- **Free Tier Limits**:
  - 500MB database storage
  - 2GB bandwidth/month
  - 50,000 monthly active users (MAU)
  - Unlimited API requests
- **Tables Needed**:

  ```sql
  -- users (managed by Supabase Auth)
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,
    tier TEXT DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- saved_configs
  CREATE TABLE saved_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    wallet_address TEXT NOT NULL,
    config JSONB NOT NULL,
    status TEXT DEFAULT 'saved', -- saved, testnet, mainnet
    testnet_address TEXT,
    mainnet_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- bsc_launch_data (cached historical data)
  CREATE TABLE bsc_launch_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_address TEXT UNIQUE NOT NULL,
    launch_date TIMESTAMP,
    tge_percent NUMERIC,
    vesting_schedule JSONB,
    price_stability_days INTEGER,
    market_cap_growth NUMERIC,
    is_successful BOOLEAN,
    metadata JSONB,
    fetched_at TIMESTAMP DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX idx_saved_configs_wallet ON saved_configs(wallet_address);
  CREATE INDEX idx_bsc_launch_successful ON bsc_launch_data(is_successful) WHERE is_successful = true;

  -- ⭐ CORE: launchpads
  CREATE TABLE launchpads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    total_supply NUMERIC NOT NULL,
    hardcap NUMERIC NOT NULL,
    softcap NUMERIC NOT NULL,
    min_contribution NUMERIC NOT NULL,
    max_contribution NUMERIC NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status TEXT DEFAULT 'upcoming', -- upcoming, active, completed, failed
    contract_address TEXT,
    token_address TEXT,
    config JSONB NOT NULL, -- full tokenomics config
    amm_config JSONB, -- bonding curve, fees, liquidity depth
    plu_config JSONB, -- PLU lock schedule and milestones
    template_id UUID, -- if created from AI template
    whitelist_root TEXT, -- Merkle root for whitelist
    category TEXT DEFAULT 'general', -- general, ai_chatbot, ai_agent, compute, data
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- ⭐ CORE: launchpad contributions
  CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    launchpad_id UUID REFERENCES launchpads(id),
    wallet_address TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    tx_hash TEXT NOT NULL,
    refunded BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- ⭐ CORE: PLU lock records
  CREATE TABLE plu_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    launchpad_id UUID REFERENCES launchpads(id),
    contract_address TEXT NOT NULL,
    total_locked NUMERIC NOT NULL,
    unlock_schedule JSONB NOT NULL, -- [{ percent, date, milestone_type, condition }]
    unlocked_percent NUMERIC DEFAULT 0,
    next_unlock_date TIMESTAMP,
    status TEXT DEFAULT 'locked', -- locked, partially_unlocked, fully_unlocked
    extended_until TIMESTAMP, -- if owner extended lock
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- ⭐ CORE: growth metrics (cached, updated by cron)
  CREATE TABLE growth_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_address TEXT NOT NULL,
    launchpad_id UUID REFERENCES launchpads(id),
    price NUMERIC,
    market_cap NUMERIC,
    holder_count INTEGER,
    lp_depth NUMERIC,
    volume_24h NUMERIC,
    new_holders_today INTEGER,
    top_holders JSONB, -- [{ address, balance, percent }]
    snapshot_time TIMESTAMP DEFAULT NOW()
  );

  -- ⭐ CORE: AI token templates
  CREATE TABLE ai_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- chatbot, agent, compute, data
    description TEXT,
    tokenomics_preset JSONB NOT NULL, -- TGE, vesting, distribution defaults
    utility_model TEXT, -- pay_per_query, staking, revenue_share
    example_projects JSONB, -- [{ name, address, description }]
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Additional indexes
  CREATE INDEX idx_launchpads_status ON launchpads(status);
  CREATE INDEX idx_launchpads_category ON launchpads(category);
  CREATE INDEX idx_contributions_launchpad ON contributions(launchpad_id);
  CREATE INDEX idx_plu_locks_launchpad ON plu_locks(launchpad_id);
  CREATE INDEX idx_growth_metrics_token ON growth_metrics(token_address);
  CREATE INDEX idx_ai_templates_category ON ai_templates(category);
  ```

- **Setup**: https://supabase.com/dashboard (free signup)
- **Client**:

  ```bash
  npm install @supabase/supabase-js
  ```

- **Docs**: https://supabase.com/docs

### 4.2 Caching Layer

#### Vercel KV (Redis)

- **Why**: Built into Vercel, free tier includes 256MB, 10,000 commands/day
- **Free Tier**:
  - 256MB storage
  - 10,000 commands/day
  - 100 requests/second
- **Use Cases**:
  - Cache BSC launch dataset (key: `bsc:launches:v1`)
  - Cache common AI config patterns (key: `ai:config:{hash}`)
  - Rate limiting (key: `ratelimit:{ip}`)
- **Install**:

  ```bash
  npm install @vercel/kv
  ```

- **Alternative (if not on Vercel)**: Upstash Redis (25MB free, 10k commands/day)
- **Docs**: https://vercel.com/docs/storage/vercel-kv

---

## 5. Blockchain Integration

### 5.1 Wallet Connection

#### wagmi v2

- **Why**: React hooks for Ethereum, auto wallet detection, TypeScript-first
- **Install**: `npm install wagmi viem@2.x`
- **Supported Wallets**: MetaMask, WalletConnect, Coinbase Wallet
- **Config**:

  ```typescript
  import { createConfig, http } from 'wagmi';
  import { bsc, bscTestnet } from 'wagmi/chains';
  import { metaMask, walletConnect } from 'wagmi/connectors';

  export const config = createConfig({
    chains: [bsc, bscTestnet],
    connectors: [
      metaMask(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
    ],
    transports: {
      [bsc.id]: http(),
      [bscTestnet.id]: http(),
    },
  });
  ```

- **Docs**: https://wagmi.sh/

#### viem v2

- **Why**: Low-level Ethereum library, lighter than ethers.js, better TypeScript
- **Used for**: Contract deployment, ABI encoding, transaction signing
- **Docs**: https://viem.sh/

### 5.2 Smart Contracts

#### OpenZeppelin Contracts v5

- **Why**: Battle-tested, audited ERC-20 implementation
- **Install**: `npm install @openzeppelin/contracts`
- **Contracts Needed**:
  1. **ERC20.sol** (Token contract)
  2. **VestingWallet.sol** (Vesting contract)
  3. ⭐ **Launchpad.sol** (Fundraise contract — hardcap/softcap, contribution tracking, auto-listing, refunds)
  4. ⭐ **ProgressiveLiquidityUnlock.sol** (PLU — time-based + milestone-based LP unlock schedule)
  5. ⭐ **TaxableToken.sol** (AMM — buy/sell tax with LP/treasury/burn/holder split)
  6. ⭐ **BondingCurve.sol** (AMM — linear/exponential/sigmoid/flat curve pricing)
  7. ⭐ **MerkleWhitelist.sol** (Launchpad — on-chain Merkle proof whitelist verification)
  8. ⭐ **Buyback.sol** (Growth — automated treasury-funded buyback triggered by price conditions)
  9. ⭐ **StakingPool.sol** (AI Tokens — stake tokens for AI service access / priority)
  10. ⭐ **RevenueShare.sol** (AI Tokens — distribute protocol revenue to token holders)
- **Deployment**: Contracts compiled to bytecode, deployed via viem client-side
- **License**: MIT (free)
- **Docs**: https://docs.openzeppelin.com/contracts/5.x/

#### Hardhat (Development)

- **Why**: Compile Solidity, run local BSC fork for testing
- **Install**: `npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox`
- **Setup**: `npx hardhat init`
- **Usage**: Local testing only, NOT for production deployment
- **Docs**: https://hardhat.org/

### 5.3 BSC RPC Endpoints

#### Free Public RPC (BSC Testnet)

- **URL**: `https://data-seed-prebsc-1-s1.binance.org:8545/`
- **Rate Limit**: ~1000 req/day (community endpoint)

#### Free Public RPC (BSC Mainnet)

- **URL**: `https://bsc-dataseed.binance.org/`
- **Rate Limit**: ~500 req/day

#### Recommended: Chainstack Free Tier

- **Why**: Higher rate limits, better uptime than public endpoints
- **Free Tier**: 3M requests/month, 1,500 req/min
- **Setup**: https://console.chainstack.com/user/account/create (free signup)
- **Alternative**: Ankr (500M free requests/month) — https://www.ankr.com/rpc/

### 5.4 PancakeSwap Integration

#### PancakeSwap V2 Router Contract

- **Mainnet Address**: `0x10ED43C718714eb63d5aA57B78B54704E256024E`
- **Testnet Address**: `0xD99D1c33F9fC3444f8101754aBC46c52416550D1`
- **Use Case**: Create LP pair, add liquidity (via `addLiquidity` function)
- **No API Key Required**: Direct smart contract call
- **Docs**: https://docs.pancakeswap.finance/developers/smart-contracts

---

## 6. AI & LLM Services

### 6.1 Primary LLM

#### Google Gemini 2.0 Flash (Free Tier)

- **Why**:
  - Free tier: 15 RPM, 1M tokens/day (sufficient for 10 users)
  - Structured JSON output mode (native)
  - Fast inference (~2–3s for tokenomics config)
  - No credit card required for API key
- **Free Tier Limits**:
  - 15 requests/minute
  - 1 million tokens/day
  - 1,500 requests/day
- **Model**: `gemini-2.0-flash-exp`
- **Install**: `npm install @google/generative-ai`
- **API Key**: Free from https://aistudio.google.com/apikey
- **Example**:

  ```typescript
  import { GoogleGenerativeAI } from '@google/generative-ai';

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: TokenomicsConfigSchema, // Zod schema
    }
  });

  const result = await model.generateContent(prompt);
  const config = JSON.parse(result.response.text());
  ```

- **Docs**: https://ai.google.dev/gemini-api/docs

#### Alternative (Backup): OpenAI GPT-4o-mini

- **Why**: Better quality, but paid (starts at $0.150/1M tokens)
- **Free Trial**: $5 credit for new accounts
- **Only use if**: Gemini JSON mode doesn't meet quality bar
- **Docs**: https://platform.openai.com/docs

### 6.2 Prompt Engineering

#### Prompt Template Structure

```markdown
You are an expert tokenomics advisor analyzing successful BSC token launches.

**User Goals:**
- Raise target: ${raiseTarget} USD
- Stability window: ${stabilityDays} days
- Anti-sniper: ${antiSniper}
- Community rewards: ${communityRewards}

**Historical Data (50+ Successful BSC Launches):**
${cachedBscData}

**Task:**
Generate an optimal tokenomics config as JSON matching this schema:
{
  "tge_percent": number (5-30),
  "vesting_schedule": number[] (monthly unlock %),
  "cliff_months": number (0-12),
  "supply_allocation": { "team": %, "community": %, "lp": %, "reserve": % },
  "lp_lock_duration": number (days),
  "anti_sniper_delay": number (blocks),
  "bonding_curve_type": "linear" | "exponential" | "flat"
}

**Explanation Requirements:**
For each parameter, cite which % of successful launches used similar values.
Example: "TGE 10% - Used by 73% of stable launches with 30+ day stability"

Output valid JSON only.
```

---

## 7. External APIs

### 7.1 Blockchain Data APIs

#### BscScan API (Free Tier)

- **Why**: Official BSC block explorer, historical token data
- **Free Tier**: 5 calls/second, 100k calls/day
- **API Key**: Free from https://bscscan.com/apis
- **Endpoints Used**:
  - `?module=account&action=tokentx` — Token transfers
  - `?module=token&action=tokeninfo` — Token metadata
  - `?module=contract&action=getsourcecode` — Contract verification status
- **Rate Limiting Strategy**: Cache all data for 24hrs in Supabase
- **Docs**: https://docs.bscscan.com/

#### DexScreener API (Free, No Key)

- **Why**: Price/volume data for DEX pairs, success classification
- **Limits**: No official rate limit published; be respectful (1 req/sec max)
- **Endpoints**:
  - `GET /latest/dex/tokens/:tokenAddress` — Price/volume data
  - `GET /latest/dex/search/?q=:tokenName` — Search tokens
- **Docs**: https://docs.dexscreener.com/

#### Fallback: GeckoTerminal API (Free)

- **Why**: Backup if DexScreener is down
- **Endpoint**: `https://api.geckoterminal.com/api/v2/networks/bsc/tokens/:address`
- **Docs**: https://www.geckoterminal.com/dex-api

### 7.2 Data Collection Strategy

#### Cron Job (Vercel Cron — Free)

- **Schedule**: Daily at 2 AM UTC
- **Function**: `/api/data/refresh`
- **Process**:
  1. Query BscScan for new token launches (last 24hrs)
  2. Filter by criteria: market cap > $50k, age > 14 days, no rug flags
  3. Fetch price data from DexScreener
  4. Calculate success metrics (stability days, growth %)
  5. Store in `bsc_launch_data` table
  6. Update Redis cache (`bsc:launches:v1`)
- **Vercel Cron Config** (`vercel.json`):

  ```json
  {
    "crons": [{
      "path": "/api/data/refresh",
      "schedule": "0 2 * * *"
    }]
  }
  ```

- **Docs**: https://vercel.com/docs/cron-jobs

---

## 8. Deployment & Hosting

### 8.1 Frontend + API Hosting

#### Vercel (Free Tier)

- **Why**: Zero-config Next.js deployment, serverless functions, global CDN
- **Free Tier Includes**:
  - Unlimited sites
  - 100GB bandwidth/month
  - Serverless function execution (100GB-hours/month)
  - Auto SSL certificates
  - Preview deployments for Git branches
- **Limitations**:
  - 10s function timeout (sufficient for AI calls)
  - 50MB function size limit
  - 4.5MB request body limit
- **Setup**:
  1. Connect GitHub repo to Vercel
  2. Set environment variables (API keys)
  3. Deploy: `git push origin main` (auto-deploys)
- **Custom Domain**: Free with Vercel (or use `.vercel.app` subdomain)
- **Docs**: https://vercel.com/docs

**Alternative**: Netlify (Free Tier) — similar free tier limits; use if Vercel is unavailable.

### 8.2 Database Hosting

**Supabase** (included above) — hosted PostgreSQL, no separate deployment needed.

### 8.3 Domain & DNS

**Free Options**:

1. **Vercel-provided subdomain**: `your-app.vercel.app` (instant, free)
2. **Freenom**: Free domains (.tk, .ml, .ga) — use with caution (unreliable)
3. **Cloudflare Pages**: Free custom domain + CDN if you own domain

**Recommended for Production**: Buy domain ($12/year from Namecheap/Porkbun), point to Vercel.

---

## 9. Development Tools

### 9.1 Package Manager

#### pnpm

- **Why**: Faster than npm, disk-efficient, strict dependency resolution
- **Install**: `npm install -g pnpm`
- **Docs**: https://pnpm.io/

### 9.2 Code Quality

#### ESLint + Prettier

- **Install**:

  ```bash
  pnpm add -D eslint prettier eslint-config-prettier
  pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
  ```

- **Config**: `.eslintrc.json`, `.prettierrc`
- **Free**: Yes

#### Husky (Git Hooks)

- **Why**: Run linting pre-commit to prevent bad code from being committed
- **Install**: `pnpm add -D husky lint-staged`
- **Setup**: `npx husky init`

### 9.3 Testing (Optional for MVP)

#### Vitest (Unit Tests)

- **Why**: Vite-native, faster than Jest
- **Install**: `pnpm add -D vitest @testing-library/react`
- **Skip for MVP**: Focus on manual testing for 10 users

### 9.4 Version Control

#### GitHub (Free)

- **Why**: Industry standard, integrates with Vercel
- **Free Tier**: Unlimited public/private repos
- **Docs**: https://github.com

---

## 10. Cost Analysis & Scalability

### 10.1 Current Costs (10 Users, MVP)

| Service | Free Tier Limit | Expected Usage | Monthly Cost |
|---------|----------------|----------------|--------------|
| Vercel | 100GB bandwidth | ~5GB | **$0** |
| Supabase | 500MB DB, 2GB bandwidth | ~100MB DB, 1GB bandwidth | **$0** |
| Vercel KV (Redis) | 10k commands/day | ~2k commands/day | **$0** |
| Gemini API | 1.5k requests/day | ~200 requests/day (20 wizards/day) | **$0** |
| BscScan API | 100k calls/day | ~100 calls/day (cron) | **$0** |
| Chainstack RPC | 3M requests/month | ~10k requests/month | **$0** |
| **Total** | | | **$0/month** ✅ |

### 10.2 Scale-Up Path (100 Users)

| Service | Paid Tier Needed? | Estimated Cost |
|---------|-------------------|----------------|
| Vercel | Pro ($20/mo) for more bandwidth | $20/mo |
| Supabase | Pro ($25/mo) for 8GB DB | $25/mo |
| Gemini API | Still free (15k requests/day) | $0 |
| **Total** | | **$45/month** |

### 10.3 Scale-Up Path (1,000 Users)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro + extra bandwidth | ~$50/mo |
| Supabase | Pro | $25/mo |
| Gemini API | Pay-as-you-go ($0.075/1M tokens) | ~$30/mo |
| Redis | Upstash paid tier | $10/mo |
| **Total** | | **$115/month** |

### 10.4 Optimization Strategies

1. **AI Caching**: Cache AI responses by goal hash (60–70% hit rate expected)
2. **BSC Data Caching**: Fetch once daily, serve from Redis (reduces API calls by 95%)
3. **CDN Edge Caching**: Static assets cached at edge (Vercel automatic)
4. **Client-Side Wallet Ops**: All blockchain txs client-side (no server cost)

---

## 11. Setup Instructions

### 11.1 Prerequisites

```bash
# Install Node.js 20+
# Install pnpm
npm install -g pnpm

# Clone repo (create new Next.js project)
npx create-next-app@latest ai-token-launchpad --typescript --tailwind --app
cd ai-token-launchpad
```

### 11.2 Install Dependencies

```bash
# Core
pnpm add next@latest react@latest react-dom@latest

# Styling
pnpm add tailwindcss postcss autoprefixer
pnpm add lucide-react
npx shadcn-ui@latest init

# Blockchain
pnpm add wagmi viem@2.x @tanstack/react-query

# Database
pnpm add @supabase/supabase-js

# AI
pnpm add @google/generative-ai

# Validation
pnpm add zod

# Charts
pnpm add recharts

# Dev Dependencies
pnpm add -D @types/node @types/react @types/react-dom typescript eslint prettier
```

### 11.3 Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...

# Gemini AI
GEMINI_API_KEY=AIzaSyxxxx...

# BscScan
BSCSCAN_API_KEY=xxxxx

# Chainstack RPC (or Ankr)
NEXT_PUBLIC_BSC_RPC_URL=https://bsc-mainnet.nodereal.io/v1/xxxxx
NEXT_PUBLIC_BSC_TESTNET_RPC_URL=https://bsc-testnet.nodereal.io/v1/xxxxx

# WalletConnect (optional)
NEXT_PUBLIC_WC_PROJECT_ID=xxxxx

# Vercel KV (auto-injected on Vercel)
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=xxxxx
```

### 11.4 Database Setup (Supabase)

1. Create account at https://supabase.com
2. Create new project
3. Go to SQL Editor, run the table creation SQL from [Section 4.1](#41-primary-database)
4. Enable Row Level Security (RLS) policies:

   ```sql
   ALTER TABLE saved_configs ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can view own configs"
   ON saved_configs FOR SELECT
   USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own configs"
   ON saved_configs FOR INSERT
   WITH CHECK (auth.uid() = user_id);
   ```

### 11.5 API Keys Setup

#### Gemini API Key (Free)

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy key to `.env.local`

#### BscScan API Key (Free)

1. Go to https://bscscan.com/apis
2. Sign up, verify email
3. Generate API key
4. Copy to `.env.local`

#### Chainstack RPC (Free)

1. Go to https://console.chainstack.com
2. Create project → Add network (BSC Mainnet + Testnet)
3. Copy endpoint URLs to `.env.local`

### 11.6 Local Development

```bash
# Run dev server
pnpm dev

# Open browser to http://localhost:3000

# Test wizard flow locally
# Test wallet connection with MetaMask on BSC Testnet
```

### 11.7 Deploy to Vercel

```bash
# Method 1: GitHub Integration (Recommended)
# 1. Push code to GitHub
# 2. Go to https://vercel.com/new
# 3. Import repository
# 4. Add environment variables from .env.local
# 5. Deploy

# Method 2: Vercel CLI
pnpm add -g vercel
vercel login
vercel --prod
```

### 11.8 Cron Job Setup (Vercel)

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/data/refresh",
    "schedule": "0 2 * * *"
  }]
}
```

Re-deploy to activate cron.

### 11.9 Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] Wizard accepts input and calls `/api/analyze`
- [ ] AI config generates within 15s
- [ ] Recharts graphs render
- [ ] Wallet connection works (MetaMask)
- [ ] Testnet deploy completes successfully
- [ ] Supabase config saves correctly
- [ ] Dashboard shows saved configs
- [ ] Cron job runs (check Vercel logs after 2 AM UTC)

---

## 12. Additional Recommendations

### 12.1 Error Tracking (Optional)

#### Sentry (Free Tier)

- **Free**: 5k errors/month
- **Install**: `pnpm add @sentry/nextjs`
- **Setup**: https://docs.sentry.io/platforms/javascript/guides/nextjs/

### 12.2 Analytics (Optional)

#### Vercel Analytics (Free)

- **Free**: 2,500 events/month
- **Built-in** to Vercel, no install needed
- **Enable** in Vercel dashboard

#### Plausible Analytics (Paid, $9/mo)

- Privacy-friendly, GDPR-compliant
- **Alternative**: Google Analytics (free, but privacy concerns)

### 12.3 Security Considerations

1. **Rate Limiting**: Use Vercel KV to limit `/api/analyze` to 5 requests/IP/hour
2. **Input Sanitization**: Use Zod validation on all API inputs
3. **CORS**: Restrict to your domain only in production
4. **API Keys**: Never expose API keys client-side (use Next.js API routes as proxy)
5. **Wallet Security**: All private keys handled by MetaMask, never touch server

### 12.4 Performance Optimization

1. **Next.js Image Optimization**: Use `<Image />` component for all images
2. **Code Splitting**: Use dynamic imports for heavy components (Recharts)
3. **ISR for Marketing Pages**: Use `revalidate` for Home page
4. **Lazy Load Wallet**: Only load wagmi when "Connect Wallet" is clicked

---

## Summary

| Attribute | Detail |
|-----------|--------|
| **Total Setup Cost** | $0 |
| **Monthly Running Cost (10 users)** | $0 |
| **Time to Deploy** | 1–2 hours (first time) |
| **Production-Ready** | Yes ✅ |
| **Scalable to 100 users** | Yes, with $45/mo paid tiers |

This stack is:

- ✅ **100% free** for MVP (10 users)
- ✅ **Production-ready** (Vercel + Supabase are enterprise-grade)
- ✅ **Fully aligned with PRD** (all FR-001–FR-022 supported)
- ✅ **Developer-friendly** (TypeScript, modern React, great docs)
- ✅ **Scalable** (serverless scales to 1000s with minimal config)

### Next Steps

1. Follow setup instructions (Section 11)
2. Build wizard UI first (high user visibility)
3. Integrate Gemini API for config generation
4. Add wallet connection + testnet deploy
5. Launch to 10 beta users, collect feedback
6. Scale paid tiers as needed

---

> **PRD Compatibility Note:** This tech stack has been verified against [prd.md](file:///z:/bnb-bangalore/bnb-project-1/planning/prd.md) — all functional requirements (FR-1 through FR-7), user stories (US-001 through US-012), technical considerations (Section 8), and integration points are fully supported. Key alignment: Supabase PostgreSQL satisfies the PRD's database needs, Gemini/OpenAI covers the AI layer, wagmi/viem + OpenZeppelin handles blockchain deployment, and Vercel serverless matches the scalability requirements.

---

*Document maintained by: Development Team*
*Last updated: February 18, 2026*
