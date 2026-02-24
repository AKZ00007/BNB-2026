// deploy-token.mjs
// Deploys GuardianToken directly to BSC Testnet using ethers.js
// and then immediately submits source code verification to BscScan via API
//
// Run: node scripts/deploy-token.mjs

import { ethers } from "ethers";
import { readFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Token Parameters ────────────────────────────────────────────────────────
const NAME = "AIBotShield";
const SYMBOL = "AIBS";
const TOTAL_SUPPLY = 1_000_000_000n;  // 1 Billion (whole tokens)
const MAX_WALLET_PCT = 2n;              // 2%
const ANTI_BOT_BLOCKS = 3n;
const BUY_TAX_BPS = 200n;           // 2%
const SELL_TAX_BPS = 500n;           // 5%
const COOLDOWN_SEC = 60n;            // 60 seconds

// ── Setup ───────────────────────────────────────────────────────────────────
const RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_KEY = process.env.BSCSCAN_API_KEY;

if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY not found in .env.local");
if (!API_KEY) throw new Error("BSCSCAN_API_KEY not found in .env.local");

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

console.log("Deployer wallet:", wallet.address);

// ── Load Artifact ───────────────────────────────────────────────────────────
const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "GuardianToken.sol", "GuardianToken.json");
let artifact;
try {
    artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
} catch (e) {
    console.error("❌ Artifact not found! Run: npx hardhat compile --config hardhat.config.cjs first");
    process.exit(1);
}

const TAX_RECEIVER = wallet.address;

async function main() {
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "BNB");
    if (balance < ethers.parseEther("0.01")) {
        throw new Error("❌ Insufficient BNB balance. Need at least 0.01 BNB for deployment.");
    }

    // Deploy
    console.log("\n🚀 Deploying GuardianToken...");
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const contract = await factory.deploy(
        NAME, SYMBOL, TOTAL_SUPPLY, MAX_WALLET_PCT, ANTI_BOT_BLOCKS,
        BUY_TAX_BPS, SELL_TAX_BPS, COOLDOWN_SEC, TAX_RECEIVER
    );

    console.log("TX hash:", contract.deploymentTransaction().hash);
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    console.log("\n✅ Token deployed to:", address);
    console.log("View on BscScan: https://testnet.bscscan.com/address/" + address);

    // Wait for indexing
    console.log("\n⏳ Waiting 15 seconds for BscScan to index...");
    await new Promise(r => setTimeout(r, 15000));

    // Load flattened source
    let sourceCode;
    try {
        sourceCode = readFileSync(path.join(__dirname, "..", "flattened_token.sol"), "utf8");
    } catch {
        console.error("❌ flattened_token.sol not found! Run the flatten command first.");
        process.exit(1);
    }

    // ABI encode the exact constructor arguments used
    const iface = new ethers.Interface([
        "constructor(string,string,uint256,uint256,uint256,uint256,uint256,uint256,address)"
    ]);
    const encodedArgs = iface.encodeDeploy([
        NAME, SYMBOL, TOTAL_SUPPLY, MAX_WALLET_PCT, ANTI_BOT_BLOCKS,
        BUY_TAX_BPS, SELL_TAX_BPS, COOLDOWN_SEC, TAX_RECEIVER
    ]).substring(2); // remove 0x prefix

    // Submit to BscScan API
    console.log("\n🔍 Submitting verification to BscScan...");
    const params = new URLSearchParams({
        apikey: API_KEY,
        module: "contract",
        action: "verifysourcecode",
        contractaddress: address,
        sourceCode: sourceCode,
        codeformat: "solidity-single-file",
        contractname: "GuardianToken",
        compilerversion: "v0.8.20+commit.a1b79de6",
        optimizationUsed: "1",
        runs: "200",
        constructorArguements: encodedArgs,
        licenseType: "3", // MIT
        evmversion: "default",
    });

    const response = await fetch("https://api-testnet.bscscan.com/api/v2", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });
    const result = await response.json();
    console.log("BscScan response:", JSON.stringify(result, null, 2));

    if (result.status === "1") {
        const guid = result.result;
        console.log("\n⏳ Verification submitted (GUID:", guid, "). Checking status...");
        await new Promise(r => setTimeout(r, 10000));

        const check = await fetch(`https://api-testnet.bscscan.com/api/v2?module=contract&action=checkverifystatus&guid=${guid}&apikey=${API_KEY}`);
        const checkResult = await check.json();
        console.log("Verification status:", checkResult.result);

        if (checkResult.result === "Pass - Verified") {
            console.log("\n🎉 Contract fully verified!");
            console.log("https://testnet.bscscan.com/address/" + address + "#code");
        }
    } else {
        console.error("❌ Verification failed:", result.result);
        console.log("\nYou can try manual verification with these details:");
        console.log("  Address:", address);
        console.log("  Compiler: v0.8.20+commit.a1b79de6");
        console.log("  Optimization: Yes, 200 runs");
        console.log("  Constructor Args:", encodedArgs);
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
