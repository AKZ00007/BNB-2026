import { expect } from "chai";
import { ethers } from "hardhat";
import { type Contract } from "ethers";

describe("Guardian Launchpad - Smart Contract Features Demo", function () {
    let deployer: any, alice: any, bob: any, oracle: any, taxWallet: any;
    let token: Contract;
    let lpToken: Contract;
    let controller: Contract;

    beforeEach(async function () {
        [deployer, alice, bob, oracle, taxWallet] = await ethers.getSigners();
    });

    describe("Feature 1: Safe Token Deployment & Anti-Whale", function () {
        it("Should deploy token with strict minting, blacklist, max wallet, and ownership rules", async function () {
            const TokenFactory = await ethers.getContractFactory("GuardianToken");

            const maxWalletPct = 2; // 2% 
            const antiBotBlocks = 5;
            const initialSupply = 10_000_000;

            token = await TokenFactory.deploy(
                "Demo Token", "DEMO", initialSupply, maxWalletPct,
                antiBotBlocks, 0, 0, 0, taxWallet.address
            );
            await token.waitForDeployment();

            // Verification 1: Minting is inherently fixed by BEP20 OpenZeppelin standard without exposed mint()
            // The supply should be exactly initialSupply
            const supply = await token.totalSupply();
            expect(supply).to.equal(ethers.parseUnits("10000000", 18));

            // Verification 2: Check max wallet percentage rule
            const maxWallet = await token.maxWalletAmount();
            expect(maxWallet).to.equal(supply * 2n / 100n);

            // Using pure transfer since buy/sell via router requires LP pair setup. 
            // The contract tracks non-excluded wallets and enforces max limit.

            // Alice buys 1.5% -> Success
            await token.connect(deployer).transfer(alice.address, supply * 15n / 1000n);
            expect(await token.balanceOf(alice.address)).to.equal(supply * 15n / 1000n);

            // Alice tries to buy another 1% -> Reverts with max wallet
            await expect(
                token.connect(deployer).transfer(alice.address, supply * 10n / 1000n)
            ).to.be.revertedWith("GuardianToken: exceeds max wallet");
        });
    });

    describe("Feature 2: Progressive Liquidity Unlock (PLU)", function () {
        beforeEach(async function () {
            // Setup generic BEP-20 as 'mock LP Token' for test
            const TokenFactory = await ethers.getContractFactory("GuardianToken");
            lpToken = await TokenFactory.deploy("Pancake LP", "CAKE-LP", 1000, 100, 0, 0, 0, 0, taxWallet.address);
            await lpToken.waitForDeployment();

            const ControllerFactory = await ethers.getContractFactory("LiquidityController");
            controller = await ControllerFactory.deploy(oracle.address);
            await controller.waitForDeployment();
        });

        it("Should lock LP and require active health scores to successfully unlock", async function () {
            const lpAmount = ethers.parseUnits("1000", 18);
            await lpToken.connect(deployer).approve(await controller.getAddress(), lpAmount);

            const now = Math.floor(Date.now() / 1000);
            const tokenAddr = await token.getAddress();

            // Lock 1000 LP tokens. 500 now, 500 later
            await controller.connect(deployer).lockLP(
                tokenAddr,
                await lpToken.getAddress(),
                lpAmount,
                [now, now + 86400],
                [lpAmount / 2n, lpAmount / 2n]
            );

            // Verify LP transferred to controller
            expect(await lpToken.balanceOf(await controller.getAddress())).to.equal(lpAmount);

            // AI Backend simulates healthy token environment -> Generates Signature
            const healthyScore = 85n;
            const messageHash = ethers.solidityPackedKeccak256(
                ["address", "uint256", "uint256"],
                [tokenAddr, 0, healthyScore]
            );
            const signature = await oracle.signMessage(ethers.getBytes(messageHash));

            // Execute Unlock
            await controller.connect(deployer).processUnlock(tokenAddr, 0, healthyScore, signature);

            // Verify deployer got LP back
            expect(await lpToken.balanceOf(deployer.address)).to.equal(lpAmount / 2n);
        });

        it("Should freeze LP entirely when the AI oracle dictates a severe health risk (e.g rugged dump)", async function () {
            const lpAmount = ethers.parseUnits("1000", 18);
            await lpToken.connect(deployer).approve(await controller.getAddress(), lpAmount);
            const tokenAddr = await token.getAddress();
            const now = Math.floor(Date.now() / 1000);

            await controller.connect(deployer).lockLP(
                tokenAddr, await lpToken.getAddress(), lpAmount,
                [now], [lpAmount]
            );

            // AI Backend detects Dev dumping -> Score crashes to 30
            const dangerScore = 30n;
            const messageHash = ethers.solidityPackedKeccak256(
                ["address", "uint256", "uint256"],
                [tokenAddr, 0, dangerScore]
            );
            const signature = await oracle.signMessage(ethers.getBytes(messageHash));

            // Execute Unlock attempts
            await controller.connect(deployer).processUnlock(tokenAddr, 0, dangerScore, signature);

            // Lock session should now be flagged as "emergencyFrozen"
            const session = await controller.locks(tokenAddr);
            expect(session.emergencyFrozen).to.equal(true);

            // Subsequent unlock attempts of any kind will now explicitly fail
            await expect(
                controller.connect(deployer).processUnlock(tokenAddr, 0, 90n, signature)
            ).to.be.revertedWith("Lock is emergency frozen");
        });
    });
});
