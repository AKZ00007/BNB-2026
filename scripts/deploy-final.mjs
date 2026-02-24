// deploy-final.mjs
// Deploys GuardianToken compiled WITHOUT viaIR — works with BscScan single-file verification
// Run: node scripts/deploy-final.mjs

import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Token Parameters (these will also be the exact constructor args for BscScan) ──
const NAME = "AIBotShield";
const SYMBOL = "AIBS";
const TOTAL_SUPPLY = 1_000_000_000n;  // 1 Billion (whole tokens, no decimals here)
const MAX_WALLET_PCT = 2n;
const ANTI_BOT_BLOCKS = 3n;
const BUY_TAX_BPS = 200n;            // 2%
const SELL_TAX_BPS = 500n;            // 5%
const COOLDOWN_SEC = 60n;

// ── Setup ───────────────────────────────────────────────────────────────────
const RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY not found in .env.local");

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const TAX_RECEIVER = wallet.address;

console.log("Deployer wallet:", wallet.address);

// Load the NO-viaIR artifact
const artifactPath = path.join(__dirname, "..", "artifacts-novir", "contracts-token-only", "GuardianToken.sol", "GuardianToken.json");
const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));

async function main() {
    const balance = await provider.getBalance(wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "BNB");

    // Deploy
    console.log("\n🚀 Deploying GuardianToken (no-viaIR)...");
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const contract = await factory.deploy(
        NAME, SYMBOL, TOTAL_SUPPLY, MAX_WALLET_PCT, ANTI_BOT_BLOCKS,
        BUY_TAX_BPS, SELL_TAX_BPS, COOLDOWN_SEC, TAX_RECEIVER
    );

    console.log("TX hash:", contract.deploymentTransaction().hash);
    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log("\n✅ Token deployed to:", address);
    console.log("View: https://testnet.bscscan.com/address/" + address);

    // Generate the exact ABI-encoded constructor args
    const iface = new ethers.Interface([
        "constructor(string,string,uint256,uint256,uint256,uint256,uint256,uint256,address)"
    ]);
    const encodedArgs = iface.encodeDeploy([
        NAME, SYMBOL, TOTAL_SUPPLY, MAX_WALLET_PCT, ANTI_BOT_BLOCKS,
        BUY_TAX_BPS, SELL_TAX_BPS, COOLDOWN_SEC, TAX_RECEIVER
    ]).substring(2);

    // Write the verification info to a file
    const verifyInfo = {
        address,
        compilerVersion: "v0.8.20+commit.a1b79de6",
        optimization: "Yes",
        runs: 200,
        viaIR: false,
        license: "MIT",
        constructorArgs: encodedArgs,
        taxReceiver: TAX_RECEIVER,
        parameters: {
            name: NAME, symbol: SYMBOL,
            totalSupply: TOTAL_SUPPLY.toString(),
            maxWalletPct: MAX_WALLET_PCT.toString(),
            antiBotBlocks: ANTI_BOT_BLOCKS.toString(),
            buyTaxBps: BUY_TAX_BPS.toString(),
            sellTaxBps: SELL_TAX_BPS.toString(),
            cooldownSec: COOLDOWN_SEC.toString(),
        }
    };

    const outPath = path.join(__dirname, "..", "verify-info.json");
    writeFileSync(outPath, JSON.stringify(verifyInfo, null, 2));

    console.log("\n════════════════════════════════════════════════════");
    console.log("          BscScan Verification Details              ");
    console.log("════════════════════════════════════════════════════");
    console.log("Contract Address :", address);
    console.log("Compiler Version : v0.8.20+commit.a1b79de6");
    console.log("Optimization     : Yes");
    console.log("Runs             : 200");
    console.log("viaIR            : NO (leave unchecked)");
    console.log("License          : MIT");
    console.log("\nConstructor Arguments ABI-encoded:");
    console.log(encodedArgs);
    console.log("════════════════════════════════════════════════════");
    console.log("\nAll details saved to verify-info.json");
}

main().catch(e => { console.error(e); process.exit(1); });
