// Script: deploy-and-verify.cjs
// Deploys a fresh GuardianToken directly and verifies it on BscScan in one go.
// Run: npx hardhat run scripts/deploy-and-verify.cjs --network bscTestnet

const hre = require("hardhat");

async function main() {
    // ── Token Parameters ─────────────────────────────────────────────────────
    // Change these if you want different settings.
    const NAME = "AIBotShield";
    const SYMBOL = "AIBS";
    const TOTAL_SUPPLY_WHOLE = 1_000_000_000; // 1 Billion (no decimals here)
    const MAX_WALLET_PCT = 2;    // 2%
    const ANTI_BOT_BLOCKS = 3;
    const BUY_TAX_BPS = 200;     // 2% (200 = 2.00%)
    const SELL_TAX_BPS = 500;    // 5% (500 = 5.00%)
    const COOLDOWN_SEC = 60;     // 60 seconds
    // Tax receiver = the deployer wallet automatically
    const [deployer] = await hre.ethers.getSigners();
    const TAX_RECEIVER = deployer.address;

    console.log("Deploying from wallet:", deployer.address);
    console.log("────────────────────────────────────────");

    // ── Deploy ────────────────────────────────────────────────────────────────
    const GuardianToken = await hre.ethers.getContractFactory("GuardianToken");
    const token = await GuardianToken.deploy(
        NAME,
        SYMBOL,
        TOTAL_SUPPLY_WHOLE,
        MAX_WALLET_PCT,
        ANTI_BOT_BLOCKS,
        BUY_TAX_BPS,
        SELL_TAX_BPS,
        COOLDOWN_SEC,
        TAX_RECEIVER
    );

    await token.waitForDeployment();
    const address = await token.getAddress();
    console.log("✅ GuardianToken deployed to:", address);
    console.log("────────────────────────────────────────");
    console.log("Waiting 10 seconds for BscScan to index...");
    await new Promise((r) => setTimeout(r, 10000));

    // ── Verify ────────────────────────────────────────────────────────────────
    console.log("Verifying on BscScan...");
    try {
        await hre.run("verify:verify", {
            address: address,
            constructorArguments: [
                NAME,
                SYMBOL,
                TOTAL_SUPPLY_WHOLE,
                MAX_WALLET_PCT,
                ANTI_BOT_BLOCKS,
                BUY_TAX_BPS,
                SELL_TAX_BPS,
                COOLDOWN_SEC,
                TAX_RECEIVER,
            ],
        });
        console.log("✅ Contract verified successfully on BscScan!");
        console.log("View at: https://testnet.bscscan.com/address/" + address);
    } catch (e) {
        if (e.message.includes("Already Verified")) {
            console.log("✅ Already verified!");
        } else {
            console.error("Verification failed:", e.message);
        }
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
