import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env.local
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function main() {
    console.log("🚀 Initializing BSC Testnet Deployment (Pure Ethers.js)...");

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("❌ PRIVATE_KEY missing in .env.local");
    }

    // Connect to BSC Testnet public RPC
    const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
    const deployer = new ethers.Wallet(privateKey, provider);

    console.log(`📡 Deploying from account: ${deployer.address}`);
    const balance = await provider.getBalance(deployer.address);
    console.log(`💰 Account balance: ${ethers.formatEther(balance)} tBNB`);

    // Load compiled contract artifacts manually
    const loadArtifact = (contractName: string) => {
        const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", `${contractName}.sol`, `${contractName}.json`);
        const { abi, bytecode } = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
        return { abi, bytecode };
    };

    // 1. Deploy the Liquidity Controller (PLU)
    console.log("\nDeploying LiquidityController (PLU Guardian)...");
    const { abi: pluAbi, bytecode: pluBytecode } = loadArtifact("LiquidityController");
    const LiquidityControllerFactory = new ethers.ContractFactory(pluAbi, pluBytecode, deployer);
    const liquidityController = await LiquidityControllerFactory.deploy(deployer.address);
    await liquidityController.waitForDeployment();
    const pluAddress = await liquidityController.getAddress();
    console.log(`✅ LiquidityController deployed to: ${pluAddress}`);

    // 2. Deploy Guardian Factory
    console.log("\nDeploying GuardianFactory...");
    const { abi: factoryAbi, bytecode: factoryBytecode } = loadArtifact("GuardianFactory");
    const GuardianFactoryContract = new ethers.ContractFactory(factoryAbi, factoryBytecode, deployer);
    const guardianFactory = await GuardianFactoryContract.deploy();
    await guardianFactory.waitForDeployment();
    const factoryAddress = await guardianFactory.getAddress();
    console.log(`✅ GuardianFactory deployed to: ${factoryAddress}`);

    // Generate frontend ABI constants file
    const constantsContent = `export const GUARDIAN_FACTORY_ABI = ${JSON.stringify(factoryAbi, null, 4)} as const;

// Live testnet deployed address
export const GUARDIAN_FACTORY_ADDRESS = "${factoryAddress}" as const;
`;

    const constantsPath = path.join(__dirname, "..", "lib", "contracts", "GuardianFactory.ts");
    fs.writeFileSync(constantsPath, constantsContent);
    console.log(`\n📝 Updated frontend constants at: ${constantsPath}`);

    console.log("\n⏳ To verify these on BscScan, run:");
    console.log(`npx hardhat verify --network bscTestnet ${pluAddress} ${deployer.address}`);
    console.log(`npx hardhat verify --network bscTestnet ${factoryAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
