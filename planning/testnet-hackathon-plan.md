# BSC Testnet Hackathon Execution Plan

This document outlines the step-by-step process for deploying and verifying the GROWUP AI core features on the live Binance Smart Chain (BSC) Testnet, strictly following the hackathon winning criteria.

## Phase 1: Environment & Wallet Setup
1. **Configure Hardhat for Testnet:** Update `hardhat.config.cjs` to include the BSC Testnet network details (RPC URL, chain ID 97) and load the deployment wallet's private key from `.env.local`.
2. **Fund Wallet:** Verify the deployer wallet has sufficient Testnet BNB ($tBNB) from a faucet.

## Phase 2: Feature 1 — Token Launchpad (Safe Deployment)
1. **Deploy Contract:** Use a Hardhat deployment script (or the frontend UI if fully wired to a wallet provider like Wagmi) to deploy a new GuardianToken to the BSC Testnet.
2. **Verify on BscScan:**
   - Wait for block confirmation.
   - Programmatically verify the contract source code on BscScan via Hardhat so it displays the green checkmark and "Read/Write Contract" tabs.
   - Manually check BscScan Read Contract tab to verify:
     - `mintingEnabled()` == false
     - `blacklistEnabled()` == false
     - `maxWalletPercent()` == 200 (2%)
     - `owner()` == 0x0...0 (renounced) or the Guardian Contract address.
3. **Manual Break Attempt:**
   - Connect a different wallet to BscScan "Write Contract".
   - Attempt to call `mint()` or `enableBlacklist()`.
   - **Goal:** Capture screenshot of the transaction reverting with "not authorized".
4. **Anti-Whale Swap Test:**
   - Attempt to transfer or swap >2% of the total supply to a single wallet.
   - **Goal:** Capture screenshot of the failed transaction on BscScan.

## Phase 3: Feature 2 — Progressive Liquidity Unlock (PLU)
1. **Add & Lock Liquidity:**
   - Deploy the `LiquidityController` contract on Testnet.
   - Add initial LP (Liquidity Provider) tokens on PancakeSwap Testnet.
   - Lock the LP tokens in the `LiquidityController`.
   - **Verify:** Use BscScan Read Contract -> `getUnlockSchedule()` to confirm the lock date, amount, and health score.
2. **Healthy Unlock Demo:**
   - Simulate a healthy state via Oracle signature in a script.
   - Call `processUnlock()` on the Testnet contract.
   - **Verify:** Show a successful BscScan transaction where a small percentage of LP is transferred back.
3. **The Freeze Demo (The "Wow" Factor):**
   - Execute a massive sell transaction from the dev wallet (dumping).
   - Trigger the backend or test script to generate a critical health score (<50).
   - Call `processUnlock()` or a specific `updateHealth()` endpoint with the critical score.
   - **Verify:** Show the `emergencyFreeze()` event triggered on BscScan, and `getUnlockSchedule()` now reflects the FROZEN state. Capture Before/After side-by-side screenshots.
4. **UI Reflection:**
   - Ensure the frontend dashboard accurately reflects the live Testnet FROZEN state by reading from the contract.

## Phase 4: Feature 3 — AMM Customization (Anti-Dump Trading Guard)
1. **Normal Trading:**
   - Execute a small buy (<1% supply) using a secondary test wallet.
   - **Verify:** Show successful transaction on BscScan.
2. **Large Sell Detection:**
   - Using the secondary wallet, attempt to sell >2% of the supply in one transaction.
   - **Verify:** Show the transaction reverting or entering RESTRICTED MODE on BscScan.
3. **Sniper Bot Simulation:**
   - Write a specific Hardhat script to submit a "Buy" and "Sell" transaction for the same wallet within the exact same block (or sequential blocks if exact block is too hard to force on live testnet).
   - **Verify:** The contract should detect the delta block interval is too low and revert the sell, flagging the wallet.
4. **UI State Transitions:**
   - Demonstrate the frontend correctly displaying NORMAL → CAUTION → RESTRICTED modes based on on-chain events.

## Phase 5: Feature 4 — AI Tools (Risk Scanner + Live Warnings)
*(Note: The AI scanner inherently works on Mainnet data, but we will demonstrate it perfectly).*
1. **Scan Known Scam:**
   - Go to UI -> Scanner. Paste a known BSC mainnet rug pull address (e.g., from TokenSniffer).
   - **Verify:** AI returns DANGEROUS with specific reasons.
2. **Scan Our Guardian Token:**
   - Paste the newly deployed Testnet GuardianToken address (or a similarly safe Mainnet mock if the scanner is rigidly locked to Mainnet BSCScan APIs).
   - **Verify:** Returns SAFE. Visual side-by-side comparison for judges.
3. **Scan Honeypot:**
   - Paste a known honeypot address.
   - **Verify:** AI clearly flags tax manipulation/blacklist functions.
4. **Live Warning Demo (The Showstopper):**
   - Set up two screens (or split screen).
   - Execute the large dev dump from Phase 3 on Screen 1.
   - Within 10 seconds, Screen 2 (running the frontend live feed) flashes: "Top holder sold X% of supply — dump risk detected." This requires WebSockets or fast polling linking the blockchain to the frontend.

## Next Immediate Steps
1. Make sure your `.env.local` has a funded BSC Testnet private key and a BscScan API key for contract verification.
2. Update `hardhat.config.cjs` for `bscTestnet`.
3. We will begin by executing **Phase 1 and Phase 2 (Deploying and Verifying the Token)** live on the testnet.
