# 🛡️ GUARDIAN — Incentive Suite
## Product Requirements Document
**Version 1.0 · Hackathon Build · February 2026**

---

| Field | Details |
|---|---|
| **Product** | Guardian — Token Launchpad & Safety Platform |
| **Module** | Incentive Suite (`app/growth/`) |
| **Status** | UI Shell Exists — Backend & Contracts Not Implemented |
| **Scope** | 4 Features: Snapshot Loyalty Airdrops, Stability Staking, AI-Triggered Community Rewards, Liquidity Loyalty Rewards |
| **Chain** | BNB Smart Chain (BSC) |

---

## 1. Executive Summary

Guardian is a token launchpad that prioritizes safety, transparency, and long-term project health. The Incentive Suite is the module that completes this vision: once a token launches safely, Guardian must also provide the infrastructure for it to **survive and grow**.

Most tokens fail not because of bad technology, but because of misaligned incentives — holders dump early, liquidity evaporates, communities lose interest. The Guardian Incentive Suite addresses this with four targeted, product-grade features that reward loyalty, stability, and long-term participation.

> **Core Thesis:** Guardian is not just protecting users from rug pulls. It is engineering token longevity — from launch to sustained community health.

---

## 2. Problem Statement

### 2.1 The Token Lifecycle Failure Pattern

The majority of tokens launched on BSC follow a predictable failure arc:

- **Week 1:** Launch hype drives price up. Early buyers hold.
- **Week 2–4:** Early buyers begin selling for profit. No mechanism exists to reward them for holding.
- **Month 2:** Liquidity thins, price drops, community loses confidence.
- **Month 3+:** Project is effectively dead despite potentially legitimate technology.

This is not a technology failure. It is an **incentive design failure.**

### 2.2 Current State of the Codebase

The existing `app/growth/page.tsx` contains an "Airdrop Scheduler" UI that accepts a CSV of wallet addresses, a token amount, and a scheduled date. However:

- No backend API exists to parse or process the uploaded CSV.
- No smart contract function exists to execute bulk token distribution.
- No on-chain logic exists for loyalty scoring, staking, LP tracking, or AI-triggered rewards.

> The UI is a promise. The Incentive Suite is the fulfillment of that promise.

---

## 3. Goals & Non-Goals

### 3.1 Goals

- Build 4 functional, product-grade incentive features deployable in a hackathon timeframe.
- Connect Guardian's existing AI health scoring system to reward distribution logic.
- Replace manual CSV-based airdrops with automated, behavior-weighted distribution.
- Provide token creators with a no-code incentive management dashboard.
- Demonstrate that safety infrastructure and growth infrastructure can live in the same platform.

### 3.2 Non-Goals

- Complex DeFi yield farming protocols (out of hackathon scope).
- Multi-chain deployment in v1 (BSC only).
- Governance/voting systems (separate module).
- Real-time price oracle integration beyond basic volatility tracking.

---

## 4. User Personas

| Persona | Role | Primary Need |
|---|---|---|
| Token Creator / Founder | Deploys token on Guardian | Reward loyal holders without writing custom scripts |
| Token Holder / Community Member | Buys and holds the token | Earn rewards for loyalty and long-term holding |
| Liquidity Provider | Provides token + BNB to LP pool | Earn bonus tokens for sustained LP contribution |

---

## 5. Feature Overview

| # | Feature | Core Mechanic | Uniqueness Factor |
|---|---|---|---|
| 1 | Smart Snapshot Loyalty Airdrops | Behavior-weighted on-chain scoring | Rewards loyalty, not just holdings |
| 2 | Stability Staking | Volatility-linked reward multiplier | Community earns more when price is stable |
| 3 | AI-Triggered Community Rewards | AI health score unlocks bonus pool | Ethical behavior = automatic community reward |
| 4 | Liquidity Loyalty Rewards | LP token duration tracking | Rewards LPs who don't abandon the pool |

---

## 6. Detailed Feature Specifications

---

### 📸 Feature 1: Smart Snapshot Loyalty Airdrops
*Behavior-weighted rewards for long-term holders*

#### 6.1.1 Overview

The existing Airdrop Scheduler UI in `app/growth/page.tsx` accepts manual CSV inputs. This feature replaces that manual flow with automated, on-chain behavior analysis. Guardian fetches holder data, calculates a **Loyalty Score** per wallet, and distributes tokens to the top-ranked holders automatically.

#### 6.1.2 User Story

> As a token creator, I want to automatically reward my most loyal holders based on how long they hold and how rarely they sell, so that I can incentivize long-term holding without manually building airdrop scripts.

#### 6.1.3 Loyalty Score Formula

```
Loyalty Score = (Holding Days × Token Balance) ÷ (Sell Frequency + 1)
```

- **Holding Days:** Days since wallet first acquired the token.
- **Token Balance:** Current balance normalized as % of total supply.
- **Sell Frequency:** Number of outbound transfers in the past 90 days.

Top N wallets (configurable by creator, e.g., top 50 or top 100) receive the airdrop.

#### 6.1.4 Holding Duration Multiplier

| Holding Duration | Reward Multiplier |
|---|---|
| 1 – 30 days | 1.0x (base) |
| 30 – 90 days | 1.5x |
| 90+ days | 2.0x |

#### 6.1.5 Technical Implementation

- **Backend (`app/api/airdrop/snapshot.ts`):** Fetch all token transfer events via BSCScan API. Calculate Loyalty Score per wallet. Return sorted top-N list with airdrop amounts.
- **Smart Contract:** `BulkDistributor.sol` — accepts array of addresses + amounts, executes `transferFrom` in a single batched call. Gas-optimized using Multicall pattern.
- **Frontend:** Replace CSV upload UI with "Run Smart Snapshot" button. Show ranked holder table before confirming distribution.

#### 6.1.6 Acceptance Criteria

- Snapshot runs within 30 seconds for tokens with up to 10,000 holders.
- Loyalty Score calculation is transparent and visible to creator before distribution.
- `BulkDistributor` contract successfully distributes to 100+ wallets in a single transaction.
- Creator can configure: snapshot date, reward pool size, top-N recipients, multiplier tiers.

---

### 🔒 Feature 2: Stability Staking
*Anti-dump lock with volatility-linked reward multipliers*

#### 6.2.1 Overview

Users lock tokens in a Guardian Staking Contract for a fixed duration (30, 60, or 90 days). Their yield is not fixed — it is dynamically adjusted based on the token's current volatility score, which is already calculated by Guardian's existing AI health monitoring system. When the community maintains price stability, **everyone earns more.**

#### 6.2.2 User Story

> As a token holder, I want to stake my tokens and earn higher rewards when the community is behaving responsibly, so that I am financially incentivized to not panic-sell and to discourage others from dumping.

#### 6.2.3 Reward Mechanics

| Lock Duration | Base APY | Stability Bonus (if volatility low) |
|---|---|---|
| 30 days | 5% | +5% → **10% APY** |
| 60 days | 8% | +10% → **18% APY** |
| 90 days | 12% | +20% → **32% APY** |

#### 6.2.4 Volatility Score Integration

Guardian's AI already produces a Health Score (0–100) for each token. The Stability Staking module reads a derived Volatility Score from this system:

- **Volatility Score < 30 (stable):** Full stability bonus applied.
- **Volatility Score 30–60 (moderate):** 50% of stability bonus applied.
- **Volatility Score > 60 (unstable):** No stability bonus; base APY only.
- **Whale dump detected:** Emergency cooldown — rewards temporarily paused for 24 hours.

> This is what makes Stability Staking unique: it uses Guardian's existing AI infrastructure as a live input to the reward system. No new AI pipeline is needed.

#### 6.2.5 Technical Implementation

- **Smart Contract:** `StabilityStaking.sol` — accepts token deposits, records lock timestamp, calculates rewards on withdrawal. Reads volatility multiplier from a backend-signed oracle value.
- **Backend:** Volatility oracle endpoint (`app/api/staking/volatility.ts`) that signs the current multiplier. Contract verifies signature before applying bonus.
- **Frontend:** Staking dashboard showing current lock positions, time remaining, and projected APY based on live volatility.

#### 6.2.6 Acceptance Criteria

- Users can stake tokens in three duration tiers.
- APY display updates in real-time when volatility score changes.
- Rewards are correctly calculated and claimable upon lock expiry.
- Whale dump detection triggers the 24-hour reward cooldown correctly.
- Early withdrawal is permitted with forfeiture of pending rewards (principal returned).

---

### 🧠 Feature 3: AI-Triggered Community Rewards
*Automated reward pool unlocked by responsible project behavior*

#### 6.3.1 Overview

This is Guardian's most differentiated feature. A **Community Bonus Pool** is pre-funded by the token creator at launch. It remains locked unless Guardian's AI Health Score sustains above a defined threshold for a consecutive period. When unlocked, it is distributed to all qualifying holders proportionally. This turns ethical project behavior into a direct community benefit.

#### 6.3.2 User Story

> As a token holder, I want to automatically receive bonus rewards when the project maintains healthy behavior for 14+ days, so that I am rewarded for holding in projects that actually act responsibly.

#### 6.3.3 Unlock Logic

| Condition | Trigger Action |
|---|---|
| AI Health Score > 85 for 14 consecutive days | Unlock Tier 1: 30% of Community Pool distributed |
| AI Health Score > 85 for 30 consecutive days | Unlock Tier 2: Additional 40% distributed |
| AI Health Score > 90 for 60 consecutive days | Unlock Tier 3: Final 30% distributed — Full Pool Distributed |
| Health Score drops below 70 at any point | Timer resets. Streak broken. Pool remains locked. |

#### 6.3.4 What the AI Health Score Tracks

The existing Guardian AI Health Score already monitors:

- Developer wallet activity (no dev dumping)
- Liquidity depth and stability
- Contract interaction anomalies
- Volume patterns (wash trading detection)
- Price volatility relative to volume

No new AI infrastructure is required. The Community Reward trigger is a **new consumer** of the existing score.

#### 6.3.5 Technical Implementation

- **Backend Job:** Daily cron (`app/jobs/rewardChecker.ts`) reads Health Score from AI module. Increments consecutive-day counter. Calls reward contract when threshold is met.
- **Smart Contract:** `CommunityRewardPool.sol` — holds pre-funded token pool. Has an authorized caller (backend oracle) that can trigger Tier unlocks. Distributes to current holder snapshot at trigger time.
- **Frontend:** Health streak progress bar on token page showing days until next reward unlock. Holders can see how close the project is to triggering a bonus.

#### 6.3.6 Acceptance Criteria

- Community Pool funding UI available to token creator at launch or post-launch.
- Health streak counter is visible to all token holders on the project page.
- Tier 1 unlock correctly distributes to all wallets holding tokens at trigger time.
- Streak reset works correctly when Health Score drops below threshold.
- Pool distribution is proportional to holder balance, not uniform.

---

### 🌊 Feature 4: Liquidity Loyalty Rewards
*Bonus airdrops for long-term liquidity providers*

#### 6.4.1 Overview

Liquidity providers (LPs) who add token + BNB to a PancakeSwap pool receive LP tokens. Most LP incentive systems are complex yield farms. This feature is intentionally simpler: Guardian snapshots LP token holders periodically and distributes bonus token rewards to those who have held LP tokens for **30+ days**. Deep, sustained liquidity is rewarded.

#### 6.4.2 User Story

> As a liquidity provider, I want to earn bonus token rewards for keeping my liquidity in the pool long-term, so that I am incentivized to not remove liquidity when the market gets volatile.

#### 6.4.3 Reward Tiers

| LP Holding Duration | Bonus Airdrop | Distribution Frequency |
|---|---|---|
| 30 – 60 days | 0.5% of LP reward pool | Monthly snapshot |
| 60 – 120 days | 1.0% of LP reward pool | Monthly snapshot |
| 120+ days | 2.0% of LP reward pool | Monthly snapshot |

#### 6.4.4 Technical Implementation

- **Backend:** Monthly snapshot job fetches LP token holders from PancakeSwap subgraph. Cross-references with first acquisition timestamp. Calculates duration and assigns tier. Calls `BulkDistributor` contract.
- **Smart Contract:** Reuses `BulkDistributor.sol` from Feature 1. LP Reward Pool is a separate funding wallet managed by the token creator.
- **Frontend:** LP dashboard showing: your LP position, holding duration, current tier, estimated next reward, and days until tier upgrade.

#### 6.4.5 Acceptance Criteria

- LP token holding duration is tracked accurately using on-chain first-acquisition timestamp.
- Monthly snapshot executes automatically via scheduled backend job.
- LP holders can see their current tier and next reward estimate on the dashboard.
- `BulkDistributor` correctly sends to all eligible LP holders in a single transaction.
- Creator can configure LP reward pool size and funding cadence.

---

## 7. System Architecture

### 7.1 Component Diagram

```
Frontend (Next.js — app/growth/)
    ↓  API calls
Backend API Layer (app/api/)
    ├── airdrop/snapshot.ts      → Loyalty Score calc + BSCScan fetch
    ├── staking/volatility.ts    → Signs current volatility multiplier
    ├── rewards/healthCheck.ts   → Reads AI Health Score, increments streak
    └── lp/snapshot.ts           → LP duration tracking via subgraph
    ↓  Contract calls (ethers.js)
Smart Contract Layer (contracts/)
    ├── BulkDistributor.sol        → Used by Features 1 + 4
    ├── StabilityStaking.sol       → Feature 2 — lock, earn, withdraw
    └── CommunityRewardPool.sol   → Feature 3 — tiered AI-triggered unlock
    ↓
BNB Smart Chain
```

### 7.2 Smart Contracts Summary

| Contract | Used By | Key Functions |
|---|---|---|
| `BulkDistributor.sol` | Features 1, 4 | `bulkTransfer(address[], uint256[])`, `setAuthorizedCaller()` |
| `StabilityStaking.sol` | Feature 2 | `stake(uint256, uint8 tier)`, `withdraw()`, `claimRewards()`, `updateVolatilityMultiplier()` |
| `CommunityRewardPool.sol` | Feature 3 | `fundPool(uint256)`, `triggerTierUnlock(uint8)`, `distributeToSnapshot(address[])` |

---

## 8. Hackathon Build Plan

### 8.1 Priority Order

| Priority | Feature | Effort | Impact | Dependencies |
|---|---|---|---|---|
| P0 | BulkDistributor Contract | Low | Enables Features 1 & 4 | None |
| P1 | Smart Snapshot Airdrops | Medium | Most visible, judges love it | BSCScan API + BulkDistributor |
| P2 | AI-Triggered Rewards | Medium | Most unique, ties AI to incentives | AI Health Score module |
| P3 | Stability Staking | Medium-High | Strong product differentiator | Volatility oracle endpoint |
| P4 | LP Loyalty Rewards | Low | Completes the suite | BulkDistributor + Subgraph |

### 8.2 Time Estimate

| Component | Estimated Hours | Notes |
|---|---|---|
| `BulkDistributor.sol` | 3–4 hrs | Reusable, deploy once |
| `StabilityStaking.sol` | 6–8 hrs | Most complex contract |
| `CommunityRewardPool.sol` | 4–5 hrs | Tiered logic |
| Backend API endpoints | 5–6 hrs | 4 route files |
| Frontend dashboard updates | 4–5 hrs | Build on existing UI shell |
| Integration + Testing | 3–4 hrs | BSC testnet |
| **TOTAL** | **25–32 hrs** | **Feasible in 2-day hackathon** |

---

## 9. Success Metrics

| Feature | Hackathon Demo Metric | Post-Launch Product Metric |
|---|---|---|
| Smart Snapshot Airdrops | Successfully distribute to 10+ wallets on testnet with correct loyalty scoring | Average time-to-dump decreases by 40%+ vs tokens without loyalty airdrops |
| Stability Staking | APY adjusts live when volatility score changes in demo | TVL in staking contracts > 15% of circulating supply within 30 days |
| AI Community Rewards | Health streak counter visible on UI; Tier 1 trigger demo works | Projects using Community Rewards retain 2x more holders at 90 days |
| LP Loyalty Rewards | LP snapshot correctly identifies 30-day holders | Average LP duration increases from 14 days to 45+ days |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| BSCScan API rate limits slow snapshot | Delayed airdrop execution | Cache holder data; use BSCScan Pro key; implement pagination |
| Reward pool inflation hurts token price | Holder value dilution | Cap reward pools as % of total supply; enforce funding-first workflow |
| Sybil attacks: one person, many wallets | Loyalty Score gaming | Minimum holding threshold (e.g., 0.01% supply); wallet-age weighting |
| AI Health Score unavailable during contract call | Feature 3 stalls | Backend signs last-known score; contract uses time-bounded cached value |
| Gas costs for bulk distribution too high | Unusable for large holder bases | Batch in groups of 200; use merkle-proof claim pattern for large airdrops |

---

## 11. Future Roadmap (Post-Hackathon)

### Phase 2 — Governance Integration
- Holders with high Loyalty Scores get weighted voting power.
- Community Reward Pool funding voted on by DAO.

### Phase 3 — Cross-Chain Expansion
- Deploy Incentive Suite on Ethereum, Polygon, and Arbitrum.
- Unified loyalty score across chains.

### Phase 4 — AI Recommendation Engine
- AI actively recommends: *"Increase APY — liquidity thinning"* or *"Pause rewards — treasury low"*.
- Incentive design becomes autonomous and self-optimizing.

---

*Guardian — Incentive Suite PRD · Confidential · Hackathon Build · Version 1.0*
