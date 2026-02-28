# Guardian — Incentive Suite Architecture & Plan
**Hackathon 10-Hour Implementation Guide**

This document outlines the architecture, data flow, and UI requirements for the three feasible features of the Incentive Suite. The core philosophy of this implementation is to keep the heavy lifting (data fetching, scoring logic) off-chain in the Next.js backend, while keeping smart contracts simple and secure.

---

## 1. Smart Snapshot Loyalty Airdrops
*Estimated time: 3.5 Hours*

**The What:** Automating token airdrops to the most loyal holders based on a calculated "Loyalty Score" (Holding Duration & Sell Frequency), replacing the manual CSV upload.

**Architecture: ~80% Off-Chain / 20% On-Chain**
*   **Off-Chain (Backend):** The backend API (`app/api/airdrop/snapshot.ts`) fetches all token transfer events via BscScan API, calculates the Loyalty Score per wallet using the formula `(Days * Balance) / (Sells + 1)`, and outputs a JSON array of the top wallets and their reward amounts.
*   **On-Chain (Contract):** A simple `BulkDistributor.sol` contract exposes a `bulkTransfer(address[] recipients, uint256[] amounts)` function to distribute the tokens in a single transaction.

**UI Requirements:**
*   **Modify Existing Card:** In `app/growth/page.tsx`, replace the "CSV Address List" input field on the "Airdrop Scheduler" card with a "Run Smart Snapshot" button.
*   **New Review Modal/Table:** When the snapshot runs, show a modal displaying the Top N Holders, their Loyalty Scores, and the proposed token distribution amounts so the creator can review and authorize the on-chain transaction.

---

## 2. Stability Staking
*Estimated time: 4.5 Hours*

**The What:** Users lock tokens to earn yield. If the project exhibits low volatility (is stable), the yield multiplier is higher, incentivizing the community not to dump.

**Architecture: ~60% On-Chain / 40% On-Chain**
*   **On-Chain (Contract):** `StabilityStaking.sol` handles standard staking logic (deposit, lock durations: 30/60/90 days, withdraw, claimRewards). Crucially, the `claimRewards` function requires a cryptographic signature from the backend (Oracle pattern).
*   **Off-Chain (Backend):** The API (`app/api/staking/volatility.ts`) calculates the current Volatility Score. When a user claims rewards, the API signs the score and returns the signature to be used in the contract call.

**UI Requirements:**
*   **New Staking Dashboard:** (Does not currently exist)
    1.  **Staking Input UI:** Allow users to input token amounts and select lock duration (30, 60, or 90 days).
    2.  **Live APY Display:** A dynamic text element that updates the APY percentage based on the backend's current Volatility Score.
    3.  **Active Positions Dashboard:** A table showing current locked positions, time remaining, and a "Claim Rewards / Withdraw" button.

---

## 3. Liquidity Loyalty Rewards
*Estimated time: 2 Hours*

**The What:** Airdropping bonus tokens to users who have held Liquidity Provider (LP) tokens for sustained periods (e.g., 30+ days).

**Architecture: ~80% Off-Chain / 20% On-Chain**
*   **Off-Chain (Backend):** Similar to Feature 1, an API (`app/api/lp/snapshot.ts`) queries BscScan for transfers of the PancakeSwap LP Token to measure how long each wallet has held it.
*   **On-Chain (Contract):** Reuses the exact same `BulkDistributor.sol` contract built for Feature 1.

**UI Requirements:**
*   **New LP Loyalty Dashboard:** (Does not currently exist)
    1.  **Status Card:** Displays the user's current LP standing (e.g., "pooling liquidity for 42 days").
    2.  **Tier Progress Bar:** A visual indicator showing the current reward tier (30-60 days, 60-120 days) and a countdown to the next multiplier tier.

---

## Summary of the 10-Hour Plan
*   **Solidity needed:** One basic `BulkDistributor.sol` and one `StabilityStaking.sol`.
*   **Backend needed:** 3 Next.js API Routes (`snapshot.ts`, `volatility.ts`, `lp_snapshot.ts`).
*   **Frontend needed:** Hooking up `wagmi` transactions to existing UI patterns and building the new Staking/LP tracking dashboards.
