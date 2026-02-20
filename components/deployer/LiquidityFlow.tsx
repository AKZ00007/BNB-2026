'use client';

import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { Droplets, ExternalLink, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { TokenConfig } from '@/types/config';
import { SIMPLE_TOKEN_ABI } from '@/lib/contracts/SimpleToken';

/**
 * PancakeSwap Router V2 on BSC Testnet
 * https://docs.pancakeswap.finance/developers/smart-contracts/pancakeswap-exchange/v2-contracts
 */
const PANCAKE_ROUTER_TESTNET = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1' as const;
const BSC_TESTNET_ID = 97;

// Minimal PancakeSwap Router V2 ABI — only addLiquidityETH
const PANCAKE_ROUTER_ABI = [
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
] as const;

interface LiquidityFlowProps {
    contractAddress: `0x${string}`;
    config: TokenConfig;
}

type Step = 'idle' | 'approving' | 'adding' | 'confirming' | 'success' | 'error';

export function LiquidityFlow({ contractAddress, config }: LiquidityFlowProps) {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    const [step, setStep] = useState<Step>('idle');
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
    const [errorMsg, setErrorMsg] = useState('');
    const [bnbAmount, setBnbAmount] = useState('0.01');

    const isOnTestnet = chainId === BSC_TESTNET_ID;

    // Calc token amount: LP% of total supply
    const lpPercent = config.amm?.initialLiquidityPercent || 40;
    const tokenAmount = BigInt(Math.floor(Number(config.totalSupply) * lpPercent / 100));
    const tokenAmountWei = tokenAmount * BigInt(10 ** 18);

    const { data: receipt } = useWaitForTransactionReceipt({
        hash: txHash,
        query: { enabled: !!txHash && step === 'confirming' },
    });

    if (receipt && step === 'confirming') {
        setStep('success');
    }

    async function handleAddLiquidity() {
        if (!isConnected || !address) return;
        if (!isOnTestnet) {
            try { await switchChain({ chainId: BSC_TESTNET_ID }); } catch { return; }
        }

        setErrorMsg('');

        try {
            // Step 1: Approve router to spend tokens
            setStep('approving');
            await writeContractAsync({
                address: contractAddress,
                abi: SIMPLE_TOKEN_ABI,
                functionName: 'approve',
                args: [PANCAKE_ROUTER_TESTNET, tokenAmountWei],
            });

            // Step 2: Add liquidity via PancakeSwap Router V2
            setStep('adding');
            const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 min
            const hash = await writeContractAsync({
                address: PANCAKE_ROUTER_TESTNET,
                abi: PANCAKE_ROUTER_ABI,
                functionName: 'addLiquidityETH',
                args: [
                    contractAddress,
                    tokenAmountWei,
                    BigInt(0), // amountTokenMin (accept any slippage on testnet)
                    BigInt(0), // amountETHMin
                    address,
                    deadline,
                ],
                value: parseEther(bnbAmount),
            });
            setTxHash(hash);
            setStep('confirming');
        } catch (e: any) {
            setErrorMsg(e?.shortMessage || e?.message || 'Transaction rejected');
            setStep('error');
        }
    }

    if (!isConnected) return null;

    if (step === 'success') {
        return (
            <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-bold text-lg text-text-primary mb-1">Liquidity Added! 💧</h3>
                <p className="text-text-secondary text-sm mb-4">
                    {lpPercent}% of supply + {bnbAmount} BNB paired on PancakeSwap V2
                </p>
                <a
                    href={`https://testnet.bscscan.com/tx/${txHash}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold text-sm hover:underline"
                >
                    View Tx <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-text-primary text-sm">Add PancakeSwap Liquidity</h3>
                    <p className="text-text-tertiary text-xs">Pair {lpPercent}% tokens with BNB on PancakeSwap V2</p>
                </div>
            </div>

            {/* BNB input */}
            <div className="mb-4">
                <label className="text-text-secondary text-xs mb-1 block">BNB Amount to Pair</label>
                <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={bnbAmount}
                    onChange={(e) => setBnbAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm outline-none focus:border-gold/30"
                />
            </div>

            {/* Summary */}
            <div className="space-y-1.5 mb-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-text-tertiary">Tokens</span>
                    <span className="text-text-primary font-medium">{tokenAmount.toLocaleString()} {config.tokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-text-tertiary">Paired With</span>
                    <span className="text-text-primary font-medium">{bnbAmount} BNB</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-text-tertiary">DEX</span>
                    <span className="text-text-primary font-medium">PancakeSwap V2 (Testnet)</span>
                </div>
            </div>

            {step === 'error' && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm mb-3">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {errorMsg}
                </div>
            )}

            <button
                onClick={handleAddLiquidity}
                disabled={step === 'approving' || step === 'adding' || step === 'confirming'}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all disabled:opacity-60"
            >
                {step === 'approving' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Approving tokens…</>
                ) : step === 'adding' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Adding liquidity…</>
                ) : step === 'confirming' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Confirming…</>
                ) : (
                    <><Droplets className="w-4 h-4" /> Add Liquidity to PancakeSwap</>
                )}
            </button>

            <p className="text-text-tertiary text-xs text-center mt-2">
                Router: PancakeSwap V2 Testnet
            </p>
        </div>
    );
}
