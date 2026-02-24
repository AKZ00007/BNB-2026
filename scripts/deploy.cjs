const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Initializing BSC Testnet Deployment...");

    const [deployer] = await hre.ethers.getSigners();
    if (!deployer) {
        throw new Error("No deployer account found. Ensure PRIVATE_KEY is in .env.local");
    }

    console.log(`📡 Deploying from account: ${deployer.address}`);
    console.log(`💰 Account balance: ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} tBNB`);

    // 1. Deploy the Liquidity Controller (PLU)
    console.log("\nDeploying LiquidityController (PLU Guardian)...");
    const LiquidityController = await hre.ethers.getContractFactory("LiquidityController");
    const liquidityController = await LiquidityController.deploy(deployer.address);
    await liquidityController.waitForDeployment();
    const pluAddress = await liquidityController.getAddress();
    console.log(`✅ LiquidityController deployed to: ${pluAddress}`);

    // 2. Deploy Guardian Factory
    console.log("\nDeploying GuardianFactory...");
    const GuardianFactory = await hre.ethers.getContractFactory("GuardianFactory");
    const guardianFactory = await GuardianFactory.deploy(pluAddress);
    await guardianFactory.waitForDeployment();
    const factoryAddress = await guardianFactory.getAddress();
    console.log(`✅ GuardianFactory deployed to: ${factoryAddress}`);

    // Generate frontend ABI constants file
    const constantsContent = `export const GUARDIAN_FACTORY_ABI = ${JSON.stringify(GuardianFactory.interface.fragments, null, 4)} as const;

// Live testnet deployed address
export const GUARDIAN_FACTORY_ADDRESS = "${factoryAddress}" as const;
`;

    const constantsPath = path.join(__dirname, "..", "lib", "contracts", "GuardianFactory.ts");
    fs.writeFileSync(constantsPath, constantsContent);
    console.log(`\n📝 Updated frontend constants at: ${constantsPath}`);

    // Wait for Etherscan indexing
    console.log("\n⏳ Waiting 30 seconds for BscScan to index the contracts before verifying...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    console.log("\n🔍 Verifying contracts on BscScan...");

    try {
        await hre.run("verify:verify", {
            address: pluAddress,
            constructorArguments: [deployer.address],
        });
        console.log(`✅ LiquidityController verified on BscScan!`);
    } catch (e) {
        console.warn(`⚠️ Verification failed (or already verified) for PLU: ${e.message}`);
    }

    try {
        await hre.run("verify:verify", {
            address: factoryAddress,
            constructorArguments: [pluAddress],
        });
        console.log(`✅ GuardianFactory verified on BscScan!`);
    } catch (e) {
        console.warn(`⚠️ Verification failed (or already verified) for Factory: ${e.message}`);
    }

    console.log("\n🎉 Deployment Complete! The frontend is now natively hooked to BSC Testnet.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
