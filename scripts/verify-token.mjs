// verify-token.mjs
// Verifies an already-deployed GuardianToken on BscScan Testnet
// Run: node scripts/verify-token.mjs

import { ethers } from "ethers";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── The newly deployed token ──────────────────────────────────────────────
const CONTRACT_ADDRESS = "0xeeada3DFAF1fD78D8889B296E2920Ed419040F37";
const API_KEY = process.env.BSCSCAN_API_KEY;
// BscScan V2 unified endpoint for BSC Testnet (chainid=97)
const BSCSCAN_V2 = "https://api.bscscan.com/v2/api?chainid=97";

// ── The EXACT same values used in deploy-token.mjs ───────────────────────
const NAME = "AIBotShield";
const SYMBOL = "AIBS";
const TOTAL_SUPPLY = 1_000_000_000n;
const MAX_WALLET_PCT = 2n;
const ANTI_BOT_BLOCKS = 3n;
const BUY_TAX_BPS = 200n;
const SELL_TAX_BPS = 500n;
const COOLDOWN_SEC = 60n;
const TAX_RECEIVER = "0x1cc2BC2DcCa9c51f83590463FC56DFf57F494E11"; // deployer

async function main() {
    // ABI encode constructor args
    const iface = new ethers.Interface([
        "constructor(string,string,uint256,uint256,uint256,uint256,uint256,uint256,address)"
    ]);
    const encodedArgs = iface.encodeDeploy([
        NAME, SYMBOL, TOTAL_SUPPLY, MAX_WALLET_PCT, ANTI_BOT_BLOCKS,
        BUY_TAX_BPS, SELL_TAX_BPS, COOLDOWN_SEC, TAX_RECEIVER
    ]).substring(2);

    console.log("Contract:", CONTRACT_ADDRESS);
    console.log("Constructor args (hex):", encodedArgs.substring(0, 80) + "...");

    // Load flattened source
    const sourceCode = readFileSync(path.join(__dirname, "..", "flattened_token.sol"), "utf8");
    console.log("Source code loaded:", sourceCode.length, "chars");

    // Submit to BscScan API V2
    console.log("\n🔍 Submitting verification to BscScan V2...");
    const params = new URLSearchParams({
        apikey: API_KEY,
        module: "contract",
        action: "verifysourcecode",
        contractaddress: CONTRACT_ADDRESS,
        sourceCode: sourceCode,
        codeformat: "solidity-single-file",
        contractname: "GuardianToken",
        compilerversion: "v0.8.20+commit.a1b79de6",
        optimizationUsed: "1",
        runs: "200",
        constructorArguements: encodedArgs,
        licenseType: "3",
        evmversion: "default",
    });

    const response = await fetch(BSCSCAN_V2, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });

    const rawText = await response.text();
    let result;
    try {
        result = JSON.parse(rawText);
    } catch {
        console.error("Non-JSON response:", rawText.substring(0, 500));
        return;
    }

    console.log("BscScan response:", JSON.stringify(result, null, 2));

    if (result.status === "1") {
        const guid = result.result;
        console.log("\n⏳ Verification submitted! GUID:", guid);
        console.log("Waiting 15 seconds for result...");
        await new Promise(r => setTimeout(r, 15000));

        const check = await fetch(`${BSCSCAN_V2}&module=contract&action=checkverifystatus&guid=${guid}&apikey=${API_KEY}`);
        const checkText = await check.text();
        let checkResult;
        try { checkResult = JSON.parse(checkText); } catch { console.log("Raw check response:", checkText); return; }
        console.log("Status:", checkResult.result);

        if (checkResult.result === "Pass - Verified") {
            console.log("\n🎉 CONTRACT VERIFIED!");
            console.log("https://testnet.bscscan.com/address/" + CONTRACT_ADDRESS + "#code");
        } else {
            console.log("Result:", checkResult.result);
            console.log("Check manually: https://testnet.bscscan.com/address/" + CONTRACT_ADDRESS);
        }
    } else {
        console.error("Failed:", result.result || result.message);
    }
}

main().catch(e => { console.error(e); process.exit(1); });
