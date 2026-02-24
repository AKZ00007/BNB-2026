import { ethers } from "ethers";

// Default configuration used in the demo token creation wizard
const tokenName = "AIBotShield";
const tokenSymbol = "AIBS";
const totalSupplyWhole = 1000000000; // 1 Billion

// Trading Guard Parameters
const maxWalletPct = 2; // 2%
const antiBotBlocks = 3; // 3 blocks
const buyTaxBps = 500; // 5%
const sellTaxBps = 500; // 5%
const cooldownSec = 60; // 60 seconds

// Deployer Address
// NOTE TO USER: If this fails, replace this with your exact MetaMask address used to deploy the token!
const userMetaMaskAddress = "0x0000000000000000000000000000000000000000"; // Fallback address format

async function generateArgs() {
    try {
        console.log("Generating BscScan ABI Encoded Constructor Arguments...\n");

        // As per DeployFlow.tsx line 131: ethers.parseUnits(config.totalSupply.toString(), 18)
        // Note: The frontend app multiplies totalSupply by 10^18 before sending it to the factory!
        const supplyPassedToFactory = ethers.parseUnits(totalSupplyWhole.toString(), 18);

        const tokenAbi = [
            "constructor(string name_, string symbol_, uint256 totalSupplyWhole, uint256 maxWalletPct, uint256 antiBotBlocks, uint256 buyTaxBps_, uint256 sellTaxBps_, uint256 cooldownSec, address taxReceiver_)"
        ];
        const tokenIface = new ethers.Interface(tokenAbi);

        const tokenArgs = [
            tokenName,
            tokenSymbol,
            supplyPassedToFactory,
            maxWalletPct,
            antiBotBlocks,
            buyTaxBps,
            sellTaxBps,
            cooldownSec,
            userMetaMaskAddress
        ];

        const encodedConstructor = tokenIface.encodeDeploy(tokenArgs);

        console.log("==================================================");
        console.log("             BSCSCAN CONSTRUCTOR ARGS             ");
        console.log("==================================================");
        console.log(encodedConstructor.substring(2)); // Strip the 0x
        console.log("==================================================");
        console.log("\nIf verification fails with 'Wrong constructor arguments', it means");
        console.log("you changed a value (like the Total Supply or Tax) during the wizard.");

    } catch (e) {
        console.error("Error:", e);
    }
}

generateArgs();
