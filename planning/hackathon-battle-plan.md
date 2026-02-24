# 🛡️ Guardian Launchpad — Hackathon Battle Plan
*Last updated: 25 Feb 2026 — Post BscScan Verification*

---

## ✅ What's Already Done (Status Check)

| Area | Status | Detail |
|---|---|---|
| Next.js Frontend | ✅ Live | Pages: Home, Create, Dashboard, AMM, Launchpad, PLU, Scanner, Growth, Templates |
| AI Token Wizard | ✅ Working | Gemini-powered, generates full tokenomics from plain English |
| Token Templates | ✅ Working | 6 templates (AI Chatbot, Agent, Compute, DAO, Meme, Data) |
| Price Simulation | ✅ Working | 90-day bull/bear/base scenarios with vesting unlock pressure |
| AMM Dashboard | ✅ Working | Bonding curve, tax sliders, impact simulator |
| BscScan API lib | ✅ Built | `lib/bscscan.ts` — contract info, tx history, verification status |
| DexScreener lib | ✅ Built | `lib/dexscreener.ts` — live price/volume feeds |
| Wagmi Web3 | ✅ Configured | `lib/wagmi.ts` — wallet connect ready |
| Supabase Backend | ✅ Connected | Database for saved configs and launchpad projects |
| GuardianToken.sol | ✅ Verified | Deployed + verified on BSC Testnet: `0x1FfC364A0082E5F935CAdb7A944f2a22b05bCBba` |
| GuardianFactory.sol | ✅ Deployed | Factory for creating GuardianTokens via UI |
| LiquidityController.sol | ✅ Deployed | PLU milestone-based lock/release mechanism |
| API Routes | ✅ Built | `/api/deploy`, `/api/scan`, `/api/analyze`, `/api/scanner` |

---

## 🎯 The Core Differentiator (What Judges Must See)

> **You are NOT building a token launcher. You are building a Protected Token Standard.**
>
> Every token created through your platform has **on-chain guardian logic baked in** —
> anti-whale, anti-bot, sell cooldown, and dynamic tax enforcement at the contract level.
> PancakeSwap sees a normal ERC-20. Attackers see a wall.

```
User → PancakeSwap Router → LP Pair → GuardianToken._transfer() → GUARDIAN LOGIC → Execute / Revert
```

---

## 🚀 Next 5 Steps — Do These In Order

---

### STEP 1 — Save the Verified ABI (30 minutes)

**Why:** Your frontend needs the ABI to call token functions (read tax, read maxWallet, etc.)

**What to do:**

1. Open `artifacts-novir/contracts-token-only/GuardianToken.sol/GuardianToken.json`
2. Copy just the `"abi": [...]` array content
3. Save it as `lib/contracts/GuardianTokenABI.json`
4. Create `lib/contracts/guardian-token.ts`:

```typescript
// lib/contracts/guardian-token.ts
import GUARDIAN_ABI from './GuardianTokenABI.json';
import { createPublicClient, http } from 'viem';
import { bscTestnet } from 'viem/chains';

const client = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

export async function readTokenInfo(tokenAddress: string) {
  const [name, symbol, totalSupply, buyTaxBps, sellTaxBps, maxWallet, taxReceiver] = await Promise.all([
    client.readContract({ address: tokenAddress as `0x${string}`, abi: GUARDIAN_ABI, functionName: 'name' }),
    client.readContract({ address: tokenAddress as `0x${string}`, abi: GUARDIAN_ABI, functionName: 'symbol' }),
    client.readContract({ address: tokenAddress as `0x${string}`, abi: GUARDIAN_ABI, functionName: 'totalSupply' }),
    client.readContract({ address: tokenAddress as `0x${string}`, abi: GUARDIAN_ABI, functionName: 'buyTaxBps' }),
    client.readContract({ address: tokenAddress as `0x${string}`, abi: GUARDIAN_ABI, functionName: 'sellTaxBps' }),
    client.readContract({ address: tokenAddress as `0x${string}`, abi: GUARDIAN_ABI, functionName: 'maxWalletAmount' }),
    client.readContract({ address: tokenAddress as `0x${string}`, abi: GUARDIAN_ABI, functionName: 'taxReceiver' }),
  ]);
  return { name, symbol, totalSupply, buyTaxBps, sellTaxBps, maxWallet, taxReceiver };
}
```

**Verified token address:** `0x1FfC364A0082E5F935CAdb7A944f2a22b05bCBba`

---

### STEP 2 — Add Liquidity on PancakeSwap Testnet (1 hour)

**Why:** Without an LP pair, all the on-chain protections are invisible. Trading must exist for the demo.

**What to do:**

1. Get PancakeSwap Testnet: `https://pancake.kiemtienonline360.com/#/add`
   (or use PancakeSwap V2 testnet router: `0xD99D1c33F9fC3444f8101754aBC46c52416550d1`)

2. Add liquidity:
   - Token A: WBNB (use testnet BNB)
   - Token B: `0x1FfC364A0082E5F935CAdb7A944f2a22b05bCBba` (AIBotShield)
   - Amount: ~0.05 BNB + proportional tokens

3. Record the **Pair Address** BscScan shows after the tx

4. Save the pair address in `.env.local`:
   ```
   NEXT_PUBLIC_AIBS_TOKEN=0x1FfC364A0082E5F935CAdb7A944f2a22b05bCBba
   NEXT_PUBLIC_AIBS_PAIR=<pair_address_here>
   ```

**After this:** Anti-bot and cooldown logic become testable. Buy from a second wallet → try to sell within 60 seconds → it reverts. That's your demo moment.

---

### STEP 3 — Connect Token Data to Your Frontend (2 hours)

**Why:** The demo needs to SHOW live on-chain data — not mock data. Judges will check.

**The Token Safety Panel** — add to your dashboard/scanner pages:

```
┌─────────────────────────────────────────┐
│  🛡️ Guardian Token Safety Panel        │
│                                         │
│  AIBotShield (AIBS)                     │
│  ✅ Contract Verified on BscScan        │
│                                         │
│  Buy Tax:    2.00%   ✅ Low             │
│  Sell Tax:   5.00%   ✅ Acceptable      │
│  Max Wallet: 2% of supply               │
│  Anti-Bot:   Active (3 blocks)          │
│  Sell Cooldown: 60 seconds              │
│                                         │
│  Guardian Score: 91 / 100   🟢 Safe     │
└─────────────────────────────────────────┘
```

**Wire it up:**
1. `app/scanner/page.tsx` → call `readTokenInfo()` with real address
2. Replace mock/static values with live contract reads
3. Show BscScan verified badge (green ✅ if `isVerified === true` from `lib/bscscan.ts`)

**This is your #1 hackathon differentiator.** No other team will have real on-chain data in their UI.

---

### STEP 4 — Build the Live Attack Demo (2 hours)

**Why:** Showing protections FIRE in real-time is your "wow moment" for judges.

**What to build — `app/live/page.tsx` (Demo Mode):**

```
[DEMO CONTROL PANEL]

[🐋 Simulate Whale Attack]  → Tries to buy 15% of supply at once
                              → Contract reverts with "exceeds max wallet"
                              → UI shows: ❌ WHALE BLOCKED

[🤖 Simulate Bot Attack]    → Buys then immediately tries to sell
                              → Contract reverts with "sell cooldown active"
                              → UI shows: ❌ BOT BLOCKED — 47s remaining

[📉 Simulate Dump Attack]   → Tries to sell 10% in one tx
                              → High sell tax applied (5%)
                              → UI shows: ⚠️ TAX APPLIED — Dumper paid 5% penalty

[📊 Live Guardian Score]    → Updates in real-time based on attack activity
```

**How it works technically:**
- Each button calls a testnet transaction using a second test wallet
- The revert message is caught and displayed as a "Guardian blocked this" notification
- Use `wagmi` + `publicClient.simulateContract()` to preview tx without sending gas
- Or use a pre-recorded simulation (faster for hackathon)

---

### STEP 5 — Polish the Guardian Score Algorithm (1 hour)

**Why:** The "score" is what makes this feel like a product, not a demo.

**Guardian Score Formula:**

```typescript
export function computeGuardianScore(token: TokenInfo): number {
  let score = 100;
  
  // Deductions
  if (!token.isVerified)        score -= 30;  // Unverified = huge red flag
  if (token.buyTaxBps > 500)    score -= 15;  // Buy tax > 5% suspicious
  if (token.sellTaxBps > 1000)  score -= 20;  // Sell tax > 10% = likely honeypot
  if (token.sellTaxBps > 500)   score -= 10;
  if (!token.hasCooldown)       score -= 10;  // No cooldown = bot-friendly
  if (!token.hasAntiWhale)      score -= 10;  // No max wallet = whale friendly
  if (token.ownerCanMint)       score -= 25;  // Hidden mint = rug risk
  if (token.ownerCanPause)      score -= 20;  // Pausable = honeypot risk
  if (token.isProxy)            score -= 15;  // Upgradeable = can rug post-launch
  
  return Math.max(0, score);
}
```

**Display tiers:**
- 90-100: 🟢 Safe (Guardian Protected)
- 70-89:  🟡 Moderate Risk
- 50-69:  🟠 High Risk
- 0-49:   🔴 Danger / Likely Scam

---

## 🏗️ Architecture Reminder

```
                    ┌─────────────────────────────┐
                    │     FRONTEND (Next.js)       │
                    │                              │
                    │  AI Wizard → Deploy Flow     │
                    │  Token Scanner               │
                    │  Live Demo Panel             │
                    │  Growth Dashboard            │
                    └────────────┬────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
    ┌──────────────┐  ┌──────────────────┐  ┌─────────────┐
    │  BSC Testnet │  │   BscScan API    │  │  Supabase   │
    │              │  │  (lib/bscscan)   │  │  (backend)  │
    │ GuardianToken│  │  - Verification  │  │             │
    │   (verified) │  │  - Tx history    │  │  - Configs  │
    │ GuardianFact │  │  - Source code   │  │  - Launches │
    │ LiquidityCon │  └──────────────────┘  └─────────────┘
    └──────────────┘
           │
           ▼ (through viem/wagmi in browser)
    User's MetaMask Wallet
```

---

## 🔮 On-Chain Upgrades (If Time Allows)

These make the contract smarter but are NOT required for the demo.

### Dynamic Sell Tax (High Impact)
Change from fixed 5% to pressure-aware tax:

```solidity
function getDynamicTax(uint256 sellAmount, uint256 lpBalance) internal view returns (uint256) {
    uint256 sellPercent = (sellAmount * 10000) / lpBalance;
    if (sellPercent < 50)   return 300;   // < 0.5% of LP → 3% tax
    if (sellPercent < 200)  return 1000;  // 0.5–2% of LP → 10% tax
    return 2500;                          // > 2% of LP → 25% tax (expensive dump)
}
```

### Volume Spike Protection (High Impact)
Track 30-second rolling sell volume. If > 5% of LP sold collectively → activate protection mode (reduce maxTx).

---

## 📊 What Judges Will See (Demo Script)

```
1. [0:00] Open website — Show landing page with Guardian branding
2. [0:30] AI Wizard — Type "meme token with anti-bot protection" → AI generates config
3. [1:00] Deploy — Click deploy → MetaMask → token live on testnet in 30 seconds
4. [1:30] Scanner — Paste AIBotShield address → see 91/100 score with details
5. [2:00] Demo Panel — Click "Whale Attack" → see BLOCKED notification
6. [2:20] Demo Panel — Click "Bot Attack" → see COOLDOWN notification + timer
7. [2:40] Live Data — Show real BscScan verified badge, live tax values from chain
8. [3:00] Pitch — "Every token on our platform is protected by default. Not optional."
```

---

## ⏰ Time Estimate

| Step | Work | Time |
|---|---|---|
| Step 1: Save ABI | Medium | 30 min |
| Step 2: Add Liquidity | Manual | 30 min |
| Step 3: Connect frontend | Hard | 2 hours |
| Step 4: Attack demo panel | Medium | 2 hours |
| Step 5: Guardian score | Easy | 1 hour |
| Polish + rehearse | - | 1 hour |
| **Total** | | **~7 hours** |

---

## 🔑 Key Addresses (Save These)

```
Verified Token (AIBotShield / AIBS):
  0x1FfC364A0082E5F935CAdb7A944f2a22b05bCBba

Previous Token (eeada3 - not verified, ignore):
  0xeeada3DFAF1fD78D8889B296E2920Ed419040F37

Deployer Wallet:
  0x1cc2BC2DcCa9c51f83590463FC56DFf57F494E11

Network: BSC Testnet (Chain ID: 97)
Explorer: https://testnet.bscscan.com
```

---

*Built for BNB Hackathon Bangalore 2026 🇮🇳 — Guardian Token Standard*
