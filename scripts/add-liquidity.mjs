/**
 * add-liquidity.mjs
 * 
 * One-command script to:
 *   1. Check deployer wallet tBNB balance
 *   2. Check deployer GuardianToken balance
 *   3. Approve PancakeSwap Router to spend tokens
 *   4. Call addLiquidityETH to create the LP pair
 *   5. Print the LP pair address for .env.local
 *
 * Usage:
 *   node scripts/add-liquidity.mjs
 *
 * Requirements:
 *   - PRIVATE_KEY set in .env.local (raw hex, no 0x prefix)
 *   - Deployer wallet has ≥ 0.05 tBNB
 *   - Deployer wallet holds GuardianTokens
 */

import { createPublicClient, createWalletClient, http, parseEther, formatEther, formatUnits } from 'viem';
import { bscTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Load .env.local manually (no dotenv dependency needed) ──────────────────
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
        envVars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
}

const PRIVATE_KEY = envVars.PRIVATE_KEY;
if (!PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY not found in .env.local');
    process.exit(1);
}

// ── Constants ───────────────────────────────────────────────────────────────
const GUARDIAN_TOKEN = '0x1FfC364A0082E5F935CAdb7A944f2a22b05bCBba';
const PANCAKE_ROUTER = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1';
const PANCAKE_FACTORY = '0x6725F303b657a9451d8BA641348b6761A6CC7a17'; // V2 factory on testnet
const WBNB = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';

// How much BNB to pair (testnet — keep it small)
const BNB_AMOUNT = '0.01'; // 0.01 tBNB
// How many tokens to pair (e.g., 1% of supply to avoid anti-whale limits)
const TOKEN_PERCENT = 1; // 1% of total supply

// ── ABIs (minimal) ──────────────────────────────────────────────────────────
const ERC20_ABI = [
    {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'totalSupply',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'symbol',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'string' }],
    },
];

const ROUTER_ABI = [
    {
        name: 'addLiquidityETH',
        type: 'function',
        stateMutability: 'payable',
        inputs: [
            { name: 'token', type: 'address' },
            { name: 'amountTokenDesired', type: 'uint256' },
            { name: 'amountTokenMin', type: 'uint256' },
            { name: 'amountETHMin', type: 'uint256' },
            { name: 'to', type: 'address' },
            { name: 'deadline', type: 'uint256' },
        ],
        outputs: [
            { name: 'amountToken', type: 'uint256' },
            { name: 'amountETH', type: 'uint256' },
            { name: 'liquidity', type: 'uint256' },
        ],
    },
    {
        name: 'factory',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'address' }],
    },
];

const FACTORY_ABI = [
    {
        name: 'getPair',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'tokenA', type: 'address' },
            { name: 'tokenB', type: 'address' },
        ],
        outputs: [{ name: 'pair', type: 'address' }],
    },
];

// ── Setup ───────────────────────────────────────────────────────────────────
const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

const publicClient = createPublicClient({
    chain: bscTestnet,
    transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
});

const walletClient = createWalletClient({
    chain: bscTestnet,
    transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
    account,
});

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
    console.log('');
    console.log('🛡️  Guardian Liquidity — PancakeSwap V2 Testnet');
    console.log('═══════════════════════════════════════════════');
    console.log(`  Wallet:  ${account.address}`);
    console.log(`  Token:   ${GUARDIAN_TOKEN}`);
    console.log(`  Router:  ${PANCAKE_ROUTER}`);
    console.log(`  BNB:     ${BNB_AMOUNT} tBNB`);
    console.log('');

    // ── Step 0: Pre-flight checks ───────────────────────────────────────────
    console.log('🔍 Step 0: Pre-flight checks...');

    const [bnbBalance, tokenBalance, totalSupply, symbol] = await Promise.all([
        publicClient.getBalance({ address: account.address }),
        publicClient.readContract({
            address: GUARDIAN_TOKEN,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [account.address],
        }),
        publicClient.readContract({
            address: GUARDIAN_TOKEN,
            abi: ERC20_ABI,
            functionName: 'totalSupply',
        }),
        publicClient.readContract({
            address: GUARDIAN_TOKEN,
            abi: ERC20_ABI,
            functionName: 'symbol',
        }),
    ]);

    console.log(`  tBNB balance:  ${formatEther(bnbBalance)} tBNB`);
    console.log(`  Token balance: ${formatUnits(tokenBalance, 18)} ${symbol}`);
    console.log(`  Total supply:  ${formatUnits(totalSupply, 18)} ${symbol}`);

    const requiredBnb = parseEther(BNB_AMOUNT);
    if (bnbBalance < requiredBnb + parseEther('0.005')) { // extra for gas
        console.error(`\n❌ Not enough tBNB! Need at least ${BNB_AMOUNT} + 0.005 for gas.`);
        console.error(`   Get testnet BNB: https://testnet.bnbchain.org/faucet-smart`);
        process.exit(1);
    }

    const tokenAmount = (totalSupply * BigInt(TOKEN_PERCENT)) / 100n;
    console.log(`  Tokens to pair: ${formatUnits(tokenAmount, 18)} ${symbol} (${TOKEN_PERCENT}% of supply)`);

    if (tokenBalance < tokenAmount) {
        console.error(`\n❌ Not enough tokens! Have ${formatUnits(tokenBalance, 18)} but need ${formatUnits(tokenAmount, 18)}`);
        process.exit(1);
    }

    // ── Check if pair already exists ────────────────────────────────────────
    const factoryAddress = await publicClient.readContract({
        address: PANCAKE_ROUTER,
        abi: ROUTER_ABI,
        functionName: 'factory',
    });
    console.log(`  Factory:  ${factoryAddress}`);

    const existingPair = await publicClient.readContract({
        address: factoryAddress,
        abi: FACTORY_ABI,
        functionName: 'getPair',
        args: [GUARDIAN_TOKEN, WBNB],
    });

    if (existingPair !== '0x0000000000000000000000000000000000000000') {
        console.log(`\n⚠️  LP pair already exists: ${existingPair}`);
        console.log(`   Add this to .env.local:`);
        console.log(`   NEXT_PUBLIC_AIBS_PAIR=${existingPair}`);
        console.log(`\n   If you want to add MORE liquidity, the script will continue.`);
        console.log(`   Press Ctrl+C to cancel, or wait 5 seconds to continue...`);
        await new Promise(r => setTimeout(r, 5000));
    }

    console.log('\n✅ Pre-flight checks passed!\n');

    // ── Step 1: Approve Router ──────────────────────────────────────────────
    console.log('📝 Step 1: Approving PancakeSwap Router to spend tokens...');

    const currentAllowance = await publicClient.readContract({
        address: GUARDIAN_TOKEN,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [account.address, PANCAKE_ROUTER],
    });

    if (currentAllowance >= tokenAmount) {
        console.log('  ✅ Already approved (sufficient allowance)');
    } else {
        const approveHash = await walletClient.writeContract({
            address: GUARDIAN_TOKEN,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [PANCAKE_ROUTER, tokenAmount],
        });
        console.log(`  Tx submitted: ${approveHash}`);
        console.log('  Waiting for confirmation...');

        const approveReceipt = await publicClient.waitForTransactionReceipt({ hash: approveHash });
        if (approveReceipt.status !== 'success') {
            console.error('❌ Approve transaction failed!');
            console.error(`  Check: https://testnet.bscscan.com/tx/${approveHash}`);
            process.exit(1);
        }
        console.log(`  ✅ Approved! Block: ${approveReceipt.blockNumber}`);
    }

    // ── Step 2: Add Liquidity ───────────────────────────────────────────────
    console.log('\n💧 Step 2: Adding liquidity to PancakeSwap V2...');
    console.log(`  Token: ${formatUnits(tokenAmount, 18)} ${symbol}`);
    console.log(`  BNB:   ${BNB_AMOUNT} tBNB`);

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes

    const addLiqHash = await walletClient.writeContract({
        address: PANCAKE_ROUTER,
        abi: ROUTER_ABI,
        functionName: 'addLiquidityETH',
        args: [
            GUARDIAN_TOKEN,       // token address
            tokenAmount,          // amountTokenDesired
            0n,                   // amountTokenMin (accept any slippage on testnet)
            0n,                   // amountETHMin (accept any slippage on testnet)
            account.address,      // LP tokens go to deployer
            deadline,             // 20 min deadline
        ],
        value: requiredBnb,
    });

    console.log(`  Tx submitted: ${addLiqHash}`);
    console.log('  Waiting for confirmation...');

    const addLiqReceipt = await publicClient.waitForTransactionReceipt({ hash: addLiqHash });
    if (addLiqReceipt.status !== 'success') {
        console.error('❌ addLiquidityETH failed!');
        console.error(`  Check: https://testnet.bscscan.com/tx/${addLiqHash}`);
        process.exit(1);
    }
    console.log(`  ✅ Liquidity added! Block: ${addLiqReceipt.blockNumber}`);

    // ── Step 3: Get Pair Address ────────────────────────────────────────────
    console.log('\n🔍 Step 3: Finding LP pair address...');

    const pairAddress = await publicClient.readContract({
        address: factoryAddress,
        abi: FACTORY_ABI,
        functionName: 'getPair',
        args: [GUARDIAN_TOKEN, WBNB],
    });

    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('🎉 SUCCESS! Liquidity added to PancakeSwap V2');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log(`  LP Pair:    ${pairAddress}`);
    console.log(`  Token:      ${GUARDIAN_TOKEN}`);
    console.log(`  Approve Tx: https://testnet.bscscan.com/tx/${typeof currentAllowance === 'bigint' && currentAllowance >= tokenAmount ? 'already-approved' : 'see-above'}`);
    console.log(`  AddLiq Tx:  https://testnet.bscscan.com/tx/${addLiqHash}`);
    console.log(`  Pair:       https://testnet.bscscan.com/address/${pairAddress}`);
    console.log('');
    console.log('📋 Add this to your .env.local:');
    console.log('');
    console.log(`  NEXT_PUBLIC_AIBS_PAIR=${pairAddress}`);
    console.log('');
    console.log('Now all PancakeSwap router-path attack simulations will work! 🛡️');
    console.log('');
}

main().catch(err => {
    console.error('\n❌ Script failed:', err.message || err);
    process.exit(1);
});
