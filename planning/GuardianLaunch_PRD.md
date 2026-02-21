# GuardianLaunch — Product Requirements Document

**Version:** 1.0 — MVP
**Target Chain:** BNB Chain (BEP-20)
**Context:** Hackathon Submission
**Status:** In Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Goals](#3-product-vision--goals)
4. [System Architecture](#4-system-architecture)
5. [Control Layer — Rug-Proof Token Infrastructure](#5-control-layer--rug-proof-token-infrastructure)
6. [Intelligence Layer — Chain-Wide AI Protection](#6-intelligence-layer--chain-wide-ai-protection)
7. [MVP Feature Checklist](#7-mvp-feature-checklist)
8. [User Flows](#8-user-flows)
9. [Technical Specifications](#9-technical-specifications)
10. [Phase 2 — AI Agent Token System](#10-phase-2--ai-agent-token-system-post-hackathon)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Glossary](#12-glossary)

---

## 1. Executive Summary

GuardianLaunch is a two-layer AI-powered token launch protocol built on BNB Chain. It solves one of the most damaging problems in crypto: rug pulls and scam token launches that destroy retail investor value.

The platform operates on two distinct layers:

> **LAYER 1 — Control Layer (Your Tokens)**
> Prevents scams at the source by enforcing safe behavior in every token launched through GuardianLaunch.

> **LAYER 2 — Intelligence Layer (Any Token on BNB Chain)**
> Monitors the entire chain and warns users about risks in tokens they interact with, regardless of origin.

This dual-layer approach maps directly to the hackathon tracks:

| Track | Layer |
|---|---|
| Progressive Liquidity Unlock | Control Layer |
| AMM Customization | Control Layer |
| Post-launch Tools | Intelligence Layer |
| AI Tools | Intelligence Layer |

---

## 2. Problem Statement

### 2.1 The Rug Pull Epidemic

Token launches on BNB Chain are plagued by malicious actors. Current launchpads (Pump.fun clones, PinkSale, etc.) provide zero protection mechanisms — they simply deploy a contract and collect fees.

| Problem | Impact |
|---|---|
| Unlimited dev wallet sells | Instant price crash after launch |
| No liquidity protection | LP removed at will, token worthless |
| Hidden mint functions | Dev can inflate supply silently |
| Blacklist capabilities | Investors trapped, cannot sell |
| Sniper bot manipulation | Price never reflects real demand |
| Zero post-launch monitoring | Users have no warning before a dump |

### 2.2 What Users Actually Need

- **Protection before they buy** — know if a token is safe
- **Protection during launch** — prevent manipulation at the contract level
- **Protection after launch** — real-time alerts when danger signals appear
- **Trustworthy launch infrastructure** — a platform where scams cannot exist by design

---

## 3. Product Vision & Goals

### 3.1 Vision Statement

> *"Make rug pulls structurally impossible for tokens launched on GuardianLaunch, and give every BNB Chain user AI-powered intelligence to protect themselves anywhere on chain."*

### 3.2 Primary Goals

| Goal | Metric | Timeline |
|---|---|---|
| Deploy Guardian Token system | 1 working token on testnet | Hackathon demo |
| Progressive Liquidity Unlock live | PLU contract deployed + demo | Hackathon demo |
| AI Risk Scanner functional | Scan any BNB address in < 5s | Hackathon demo |
| Live warning system | Real-time event detection running | Hackathon demo |

---

## 4. System Architecture

### 4.1 High-Level Overview

```
User (Browser / Mobile)
       │
       ▼
Frontend Launchpad (React + Wagmi / ethers.js)
       │
       ▼
Backend Watcher + AI Analyzer (Node.js / Python)
       │                    │
       ▼                    ▼
BNB RPC Node           AI API (Claude / OpenAI)
(live blockchain feed)
       │
       ▼
Smart Contracts
├── Guardian Token Template (ERC20 + safety rules)
└── Liquidity Controller (PLU logic + AMM hooks)
```

### 4.2 Component Breakdown

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | React, Wagmi, ethers.js, Tailwind | Launchpad UI, token scanner, live feed |
| Backend Watcher | Node.js / Python, WebSockets | Listen to chain events, trigger AI, call contracts |
| Smart Contracts | Solidity 0.8.x, OpenZeppelin | Guardian Token, Liquidity Controller |
| AI Analyzer | Claude API / OpenAI API | Contract analysis, human-readable alerts |
| BNB RPC | QuickNode / Alchemy WebSocket | Live blockchain data feed |

---

## 5. Control Layer — Rug-Proof Token Infrastructure

The Control Layer applies exclusively to tokens deployed through GuardianLaunch. It makes scams structurally impossible at the smart contract level — not as a policy, but as code.

---

### 5.1 Safe Token Deployment — Guardian Token Template

#### 5.1.1 Overview

Instead of deploying a vanilla ERC20/BEP20, GuardianLaunch deploys a **Guardian Token** — a pre-audited contract template with safety rules baked in. Token creators cannot remove or bypass these rules.

#### 5.1.2 Built-in Safety Rules

| Rule | Default Setting | Purpose |
|---|---|---|
| Trading Cooldown | First 3 blocks after launch | Block same-block sniper bots |
| Max Wallet Limit | 2% of total supply | Prevent whale accumulation |
| Max Sell Per TX | 1% of total supply | Prevent sudden large dumps |
| Owner Mint Disabled | Permanent — cannot re-enable | Prevent hidden supply inflation |
| Blacklist Disabled | Permanent — cannot re-enable | Prevent investor trapping |
| Emergency Pause | Guardian contract only | Platform-level safety valve |
| Ownership Renounced | Auto-renounced at launch | Remove dev control post-launch |

#### 5.1.3 Contract Interface

```solidity
// GuardianToken.sol — Core Functions
function deploy(string name, string symbol, uint256 supply) external
function setTradingCooldown(uint256 blocks) external onlyGuardian
function setMaxWallet(uint256 bps) external onlyGuardian       // basis points
function setMaxSellPerTx(uint256 bps) external onlyGuardian
function emergencyPause() external onlyGuardian
function renounceOwnership() external onlyOwner

// Immutable at deployment — no setter functions exist:
// mintEnabled = false | blacklistEnabled = false
```

#### 5.1.4 Token Deployment Flow

1. Creator fills launch form: name, symbol, supply, description
2. Frontend calls `GuardianFactory.deployToken()` with parameters
3. Factory deploys Guardian Token with all safety rules active
4. Token listed on GuardianLaunch with verified **SAFE** badge
5. Backend watcher begins monitoring the new token immediately

---

### 5.2 AMM Protection Logic — Anti-Dump Trading Guard

#### 5.2.1 Overview

Once liquidity is added to PancakeSwap, the Guardian Token contract intercepts every transfer and applies real-time AMM protection logic. This is the **Anti-Dump Trading Guard** — a custom AMM hook layer.

#### 5.2.2 Detection Triggers

| Trigger Condition | Threshold | Response |
|---|---|---|
| Large single sell | > 2% supply in one TX | Temporary sell restriction (10 min) |
| Same-block sell pattern | 3+ sells in same block | Block for next 5 blocks |
| Sniper bot pattern | Buy + sell within 2 blocks | Restrict wallet for 30 min |
| Cascade sell (chain) | > 5% supply sold in 5 min | Emergency slowdown mode |

#### 5.2.3 Restriction Modes

```
NORMAL MODE     → All trading allowed within standard limits
CAUTION MODE    → Sell cooldown increased to 5 minutes per wallet
RESTRICTED MODE → Max sell reduced to 0.5% per TX, 30 min between sells
FROZEN MODE     → No sells allowed — Guardian contract can lift manually
```

---

### 5.3 Progressive Liquidity Unlock (PLU)

#### 5.3.1 Overview

PLU is the flagship hackathon feature. Instead of a fixed lock period ("LP locked for 6 months"), liquidity unlocks based on the **health of the token** — not just time. Healthy tokens unlock faster. Suspicious tokens extend their lock automatically.

#### 5.3.2 Health Metrics

| Metric | Healthy Signal | Warning Signal |
|---|---|---|
| Price stability | < 20% swing in 24h | > 50% swing in 24h |
| Holder distribution | > 100 unique holders | Top 3 hold > 60% |
| Trading volume pattern | Consistent organic volume | Sudden volume spike then drop |
| Dev wallet activity | No large sells | Dev wallet sold > 10% |
| Liquidity depth | LP value stable | LP value dropped > 30% |

#### 5.3.3 Unlock Logic

```
Health Score = weighted average of all metrics (0–100)

Score 80–100 (HEALTHY):
  → Unlock 5% of LP per 7-day period
  → Standard schedule maintained

Score 50–79 (CAUTION):
  → Unlock paused — lock period extended by 14 days
  → Alert: "Unlock delayed — monitoring health"

Score 0–49 (DANGER):
  → Emergency lock engaged — all unlock stopped
  → Guardian contract freezes LP withdrawals
  → Alert: "LP frozen — abnormal activity detected"
```

#### 5.3.4 Unlock Contract Interface

```solidity
// LiquidityController.sol
function lockLP(address token, uint256 amount) external
function calculateHealthScore(address token) public view returns (uint256)
function processUnlock(address token) external onlyWatcher
function emergencyFreeze(address token) external onlyGuardian
function getUnlockSchedule(address token) external view
  returns (uint256 nextUnlockDate, uint256 unlockAmount, uint256 healthScore)
```

---

### 5.4 Live Protection Trigger — On-Chain Reaction System

#### 5.4.1 Overview

The backend watcher continuously monitors on-chain events and can call Guardian contract functions in real time. This proves an **on-chain reactive security system** — a key differentiator for the hackathon.

#### 5.4.2 Reaction Scenarios

| Detected Event | Backend Action | Contract Action |
|---|---|---|
| Dev wallet sells 40%+ supply | Flag as CRITICAL | Increase cooldown + restrict mode |
| LP removal attempt detected | Alert + log | Freeze unlock if health < 50 |
| 5+ sells in 60 seconds | Trigger caution mode | Apply sell cooldown to all wallets |
| New whale buys 10%+ supply | Monitor closely | Flag wallet for enhanced tracking |
| Price drops 40% in 10 min | EMERGENCY alert | Freeze all sells, notify holders |

---

## 6. Intelligence Layer — Chain-Wide AI Protection

The Intelligence Layer requires no control over a token. It works on **any contract address** on BNB Chain, making GuardianLaunch useful even for users interacting with tokens they found elsewhere.

---

### 6.1 Risk Scanner — Pre-Interaction AI Analysis

#### 6.1.1 Overview

When a user pastes any token contract address, the Risk Scanner analyzes the contract code, holder data, and deployment patterns to produce a risk score and human-readable assessment in **under 5 seconds**.

#### 6.1.2 Analysis Dimensions

| Dimension | What We Check | Risk Flags |
|---|---|---|
| Contract Code | Mint function, tax change, blacklist, hidden owner | Any enabled = WARNING |
| Ownership | Renounced? Multisig? Single wallet? | Single EOA owner = CAUTION |
| Liquidity | LP locked? Where? How long? | No lock = DANGEROUS |
| Holder Distribution | Top holders %, dev wallet % | > 20% single wallet = WARNING |
| Trading History | Age, volume pattern, sell/buy ratio | Abnormal patterns = CAUTION |
| Similarity Matching | Known scam contract fingerprints | Match found = DANGEROUS |

#### 6.1.3 Risk Score Display

| Score | Rating | Meaning |
|---|---|---|
| 80–100 | ✅ SAFE | No critical flags. Standard caution applies. |
| 50–79 | ⚠️ WARNING | Notable risk factors present. Proceed carefully and verify. |
| 0–49 | 🚨 DANGEROUS | Critical flags detected. High probability of scam or rug. |

#### 6.1.4 AI Explanation Sample Output

```
Risk Score: 24 / 100 — DANGEROUS

Critical findings:
• Owner wallet controls 35% of total supply
• Mint function is active and callable by owner
• Liquidity pool has no lock — removable at any time
• Contract matches fingerprint of 3 known rug pull contracts

Plain-language summary (AI generated):
"This token is almost certainly a scam. The developer can create unlimited
 new tokens and drain the liquidity pool at any moment. Similar contract
 code has been used in 3 confirmed rugs in the last 30 days. Avoid."
```

---

### 6.2 Live Monitoring — Post-Launch Event Detection

#### 6.2.1 Overview

The backend watcher subscribes to BNB Chain WebSocket events and continuously monitors all tracked tokens — both GuardianLaunch tokens and any token a user has searched. Events trigger AI analysis and human-readable alerts within seconds.

#### 6.2.2 Monitored Event Types

| Event Category | Specific Signal | Alert Severity |
|---|---|---|
| Whale Activity | Single wallet accumulates > 5% in 1 hour | MEDIUM |
| Dev Wallet Activity | Known dev wallet initiates sell | HIGH |
| Liquidity Removal | LP tokens moved / burned unexpectedly | CRITICAL |
| Price Manipulation | Price drops > 30% in under 10 minutes | HIGH |
| Volume Anomaly | 10x normal volume spike detected | MEDIUM |
| Holder Flight | Top 10 holders reducing positions fast | HIGH |

---

### 6.3 Human Explanation Layer — AI Alert Translation

#### 6.3.1 Overview

Raw blockchain events are meaningless to most users. The AI translation layer converts event data into **plain-language warnings** that any retail user can understand and act on immediately.

#### 6.3.2 Example Alert Translations

| Raw On-Chain Event | AI Human Translation |
|---|---|
| Wallet 0x7f3... transferred 2.8M tokens to DEX | "Top holder sold 28% of supply in 2 minutes — high dump risk" |
| LP token transfer from deployer wallet | "Developer is removing liquidity — possible rug pull in progress" |
| 5 transactions in same block, sell direction | "Coordinated selling detected — possible wash trade or bot attack" |
| Owner called `setTax(50)` on contract | "Trading tax just changed from 5% to 50% — this is a honeypot trap" |

---

## 7. MVP Feature Checklist

The following 6 core features constitute a complete, demo-ready hackathon submission. All other features are out of scope until these are complete and tested.

### 7.1 Control Layer — Must Ship

| Status | Feature |
|---|---|
| ✅ | Deploy a Guardian Token via the launchpad UI — safe rules enforced at contract level |
| ✅ | Add liquidity to PancakeSwap via the platform UI — LP locked in LiquidityController |
| ✅ | Backend detects a large sell event (> 2% supply) within 10 seconds |
| ✅ | Contract automatically restricts trading upon detection — no manual intervention |
| ✅ | PLU contract processes an unlock based on health score — not just time |

### 7.2 Intelligence Layer — Must Ship

| Status | Feature |
|---|---|
| ✅ | User pastes any BNB token address — risk scan completes in < 5 seconds |
| ✅ | Risk score displayed with SAFE / WARNING / DANGEROUS label and explanation |
| ✅ | Live warning appears in UI when a monitored token triggers a danger event |

### 7.3 Explicitly Out of Scope for MVP

> ⛔ The following features will **NOT** be built during the hackathon MVP phase:
> - Staking pools and yield farming
> - Airdrop tools
> - Marketing and social media integrations
> - Complex ML models (rule-based AI is sufficient for demo)
> - Advanced charting and analytics dashboards
> - AI Agent Token utility system (Phase 2 — see Section 10)
> - Mobile app

---

## 8. User Flows

### 8.1 Token Creator Flow

1. Creator connects wallet (MetaMask / WalletConnect) to GuardianLaunch
2. Fills launch form: token name, symbol, total supply, description
3. Reviews safety rules that will be applied (displayed as checklist)
4. Signs deployment transaction — Guardian Token deployed on BNB Chain
5. Adds liquidity (BNB + token) — LP auto-locked in LiquidityController
6. Token live on GuardianLaunch with **VERIFIED SAFE** badge
7. Backend watcher begins monitoring token automatically

### 8.2 Investor Risk Check Flow

1. User navigates to Risk Scanner tab
2. Pastes any BNB Chain token contract address
3. System fetches contract code, holder data, LP status from chain
4. AI analyzes all dimensions and generates risk score + explanation
5. User sees: score badge, breakdown table, AI plain-language verdict
6. Option to 'Watch' token — adds it to live monitoring feed

### 8.3 Live Alert Flow

1. Backend watcher detects a dangerous event on a monitored token
2. AI translates raw event into human-readable warning message
3. Alert appears in live feed on UI (WebSocket push — no refresh needed)
4. For GuardianLaunch tokens: contract action triggered simultaneously

---

## 9. Technical Specifications

### 9.1 Smart Contracts

| Contract | Language / Framework | Key Dependencies |
|---|---|---|
| `GuardianFactory.sol` | Solidity 0.8.20 | OpenZeppelin Clones |
| `GuardianToken.sol` | Solidity 0.8.20 | OZ ERC20, Ownable, Pausable |
| `LiquidityController.sol` | Solidity 0.8.20 | OZ ReentrancyGuard, IPancakeRouter |
| `GuardianOracle.sol` | Solidity 0.8.20 | Chainlink (health data feed) |

### 9.2 Backend

| Module | Technology | Purpose |
|---|---|---|
| Chain Watcher | Node.js + ethers.js WebSocket | Subscribe to BNB Chain events |
| AI Analyzer | Python + Claude API / OpenAI | Contract analysis & alert text |
| Alert Engine | Node.js + Socket.io | Push alerts to frontend in real-time |
| Guardian Caller | Node.js + ethers.js | Call contract functions from backend |
| Risk API | FastAPI (Python) | REST endpoint for risk score queries |

### 9.3 Frontend

| Feature | Framework / Library | Notes |
|---|---|---|
| Core UI | React + TypeScript | Vite build |
| Styling | Tailwind CSS | Dark theme, mobile-responsive |
| Wallet Integration | Wagmi v2 + RainbowKit | MetaMask, WalletConnect |
| Contract Calls | ethers.js v6 | Direct frontend contract interaction |
| Live Feed | Socket.io client | Real-time alert display |
| State | Zustand | Lightweight global state |

### 9.4 Infrastructure

- **Chain:** BNB Chain Testnet (BSC Testnet) for demo, Mainnet for production
- **RPC:** QuickNode or Alchemy BSC WebSocket endpoint (for event subscriptions)
- **Deployment:** Remix IDE for contracts, Vercel for frontend, Railway for backend
- **Contract Verification:** BscScan auto-verify via Hardhat verify plugin

---

## 10. Phase 2 — AI Agent Token System (Post-Hackathon)

> ⚠️ **NOTE:** This section describes features to be built **ONLY** after all MVP features in Section 7 are complete, tested, and demo-ready. Do not begin Phase 2 work until the hackathon MVP is locked and verified.

### 10.1 Concept

Phase 2 transforms GuardianLaunch from a safe launchpad into a **programmable tokenized AI service generator**. Users can launch tokens where the token is not just a speculative asset but an access key to a real AI service — creating genuine economic utility.

### 10.2 How It Works

1. Creator launches a token and selects an AI agent type (auditor, trading bot, research assistant, etc.)
2. A token page is created with a "Use this AI" button
3. Backend checks: does user wallet hold ≥ X tokens? If yes → allow AI usage
4. Backend calls AI API (Claude / OpenAI) with the user's prompt
5. Token demand = AI service demand → creates real economic loop

### 10.3 AI Agent Token Categories

| Category | Example Agent | Token Use Case |
|---|---|---|
| Security | Smart Contract Auditor | Pay-per-audit via token balance |
| Finance | Trading Signal Bot | Access signals by holding tokens |
| Research | Crypto Research Assistant | Token = research credit |
| Data | Onchain Analytics Agent | Data access gated by holdings |
| Development | Solidity Code Generator | Usage metered by token spend |

### 10.4 Phase 2 Technical Requirements

- Universal token contract extension: add `payForUsage()` and `balanceGate()` functions
- Usage Meter backend: track per-wallet API usage and enforce token-holding requirement
- Agent marketplace UI: browse available AI agent tokens, their purpose and pricing
- Token factory upgrade: creator selects agent type during launch, auto-configures backend
- Revenue distribution: platform takes 5% of token supply at launch

### 10.5 Example — Resume Review AI Token

> A creator launches **"Resume Review AI Token"**.
> Students must hold 50 tokens to use the AI resume analyzer.
> The creator earns value because demand for the service = demand for the token.
> This is a functional tokenized SaaS — not a speculative pump-and-dump.

---

## 11. Risks & Mitigations

| Risk | Probability | Mitigation |
|---|---|---|
| Smart contract bug exploited | Medium | Use OpenZeppelin audited base contracts; testnet first |
| Backend watcher misses events | Low | WebSocket reconnect logic + polling fallback |
| AI API rate limit during demo | Medium | Cache common analyses; have offline demo backup |
| False positive risk alerts | Medium | Tunable thresholds; show confidence level with score |
| PLU health score gamed by creator | Low | Multiple uncorrelated metrics; time-weighted scoring |
| BNB RPC node downtime | Low | Multiple RPC providers with automatic failover |

---

## 12. Glossary

| Term | Definition |
|---|---|
| PLU | Progressive Liquidity Unlock — health-based LP release mechanism |
| Guardian Token | ERC20/BEP20 token with safety rules enforced at contract level |
| LP | Liquidity Pool — paired token + BNB deposited into PancakeSwap |
| Rug Pull | Scam where dev removes all liquidity after investors buy in |
| Honeypot | Token contract that allows buying but blocks all selling |
| AMM | Automated Market Maker — algorithmic price setting (PancakeSwap) |
| Health Score | Composite metric (0–100) measuring token ecosystem safety |
| EOA | Externally Owned Account — a regular crypto wallet (not a contract) |
| BEP-20 | Token standard on BNB Chain (equivalent to ERC-20 on Ethereum) |
| Guardian Watcher | Backend service that monitors chain events and triggers contract actions |

---

*GuardianLaunch PRD v1.0 — Built for BNB Chain Hackathon*
