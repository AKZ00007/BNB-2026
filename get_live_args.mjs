import { ethers } from "ethers";

// The BscScan API URL for the transaction the user just made
// txhash: 0xa2ec712ded7e8edddf912ae05d6cb4fcdcbdcdbbcb68ff1895a940f8fa5535da
// We will use the public RPC to get the transaction input data
const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
const txHash = "0xa2ec712ded7e8edddf912ae05d6cb4fcdcbdcdbbcb68ff1895a940f8fa5535da";

async function main() {
    try {
        console.log("Fetching transaction data from BSC Testnet...");
        const tx = await provider.getTransaction(txHash);

        if (!tx) {
            console.log("Transaction not found on this RPC.");
            return;
        }

        // The transaction was made to the GuardianFactory `createGuardianToken` function.
        // We need to decode the factory arguments to get the exact values passed to the token constructor.

        const factoryAbi = [
            "function createGuardianToken(string name_, string symbol_, uint256 totalSupply_, uint256 maxWalletPct_, uint256 antiBotBlocks_, uint256 buyTaxBps_, uint256 sellTaxBps_, uint256 cooldownSec_, address taxReceiver_)"
        ];
        const factoryIface = new ethers.Interface(factoryAbi);

        // Decode the input data of the factory call
        const decoded = factoryIface.decodeFunctionData("createGuardianToken", tx.data);

        console.log("--------------------------------------------------");
        console.log("Exact values used in deployment:");
        console.log("Name:", decoded[0]);
        console.log("Symbol:", decoded[1]);
        console.log("Total Supply (Wei):", decoded[2].toString());
        console.log("Max Wallet %:", decoded[3].toString());
        console.log("Anti-Bot Blocks:", decoded[4].toString());
        console.log("Buy Tax BPS:", decoded[5].toString());
        console.log("Sell Tax BPS:", decoded[6].toString());
        console.log("Cooldown Sec:", decoded[7].toString());
        console.log("Tax Receiver:", decoded[8]);

        // Now, re-encode these EXACT values for the GuardianToken constructor
        // Important: GuardianToken constructor takes `totalSupplyWhole`, but the factory passes `totalSupply_` as WEI.
        // Let's check the GuardianToken.sol constructor again:
        // constructor(string name_, string symbol_, uint256 totalSupplyWhole, uint256 maxWalletPct, uint256 antiBotBlocks, uint256 buyTaxBps_, uint256 sellTaxBps_, uint256 cooldownSec, address taxReceiver_)
        // Wait, DeployFlow.tsx passes wei: `ethers.parseUnits(config.totalSupply.toString(), 18)`
        // But the token expects `totalSupplyWhole` and does: `uint256 supply = totalSupplyWhole * 10 ** decimals();`
        // THIS MEANS THE SUPPLY MIGHT BE MULTIPLIED BY 10^18 TWICE! 

        const tokenAbi = [
            "constructor(string name_, string symbol_, uint256 totalSupplyWhole, uint256 maxWalletPct, uint256 antiBotBlocks, uint256 buyTaxBps_, uint256 sellTaxBps_, uint256 cooldownSec, address taxReceiver_)"
        ];
        const tokenIface = new ethers.Interface(tokenAbi);

        const tokenArgs = [
            decoded[0], // name
            decoded[1], // symbol
            decoded[2], // totalSupply (which was passed as Wei from frontend)
            decoded[3],
            decoded[4],
            decoded[5],
            decoded[6],
            decoded[7],
            decoded[8]
        ];

        const encodedConstructor = tokenIface.encodeDeploy(tokenArgs);

        console.log("--------------------------------------------------");
        console.log("ABI Encoded Constructor Arguments for BscScan:");
        console.log("Copy and paste this exact string:");
        console.log("--------------------------------------------------");
        console.log(encodedConstructor.substring(2));
        console.log("--------------------------------------------------");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
