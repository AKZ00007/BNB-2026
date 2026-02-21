'use client';

import { useState } from 'react';
import {
    useAccount,
    useChainId,
    useSwitchChain,
    useDeployContract,
    useWaitForTransactionReceipt,
} from 'wagmi';
import { AlertTriangle, CheckCircle2, ExternalLink, Loader2, Rocket, Wallet, Sparkles } from 'lucide-react';
import type { TokenConfig } from '@/types/config';
import { SIMPLE_TOKEN_ABI, SIMPLE_TOKEN_BYTECODE } from '@/lib/contracts/SimpleToken';

interface DeployFlowProps {
    configId: string;
    config: TokenConfig;
    onDeployed?: (address: string) => void;
}

const BSC_TESTNET_ID = 97;

type Step = 'idle' | 'wrong-chain' | 'deploying' | 'confirming' | 'success' | 'error';

export function DeployFlow({ configId, config, onDeployed }: DeployFlowProps) {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const {
        deployContractAsync,
        data: deployTxHash,
    } = useDeployContract();

    const [step, setStep] = useState<Step>('idle');
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
    const [contractAddress, setContractAddress] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const isOnTestnet = chainId === BSC_TESTNET_ID;

    // Wait for the tx to be mined
    const { data: receipt } = useWaitForTransactionReceipt({
        hash: txHash,
        query: { enabled: !!txHash && step === 'confirming' },
    });

    // When receipt arrives, update Supabase and show success
    const handleReceipt = async (addr: string, hash: `0x${string}`) => {
        try {
            await fetch('/api/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    configId,
                    walletAddress: address,
                    contractAddress: addr,
                    txHash: hash,
                }),
            });
        } catch { /* Supabase update is best-effort */ }
        setContractAddress(addr);
        setStep('success');
        onDeployed?.(addr);
    };

    // Watch for receipt
    if (receipt?.contractAddress && step === 'confirming') {
        handleReceipt(receipt.contractAddress, txHash!);
    }

    async function handleDeploy() {
        if (!isConnected) return;
        if (!isOnTestnet) { setStep('wrong-chain'); return; }

        setStep('deploying');
        setErrorMsg('');

        try {
            const hash = await deployContractAsync({
                abi: SIMPLE_TOKEN_ABI,
                bytecode: SIMPLE_TOKEN_BYTECODE,
                args: [
                    config.tokenName,
                    config.tokenSymbol,
                    BigInt(config.totalSupply),
                ],
            });
            setTxHash(hash);
            setStep('confirming');
        } catch (e: any) {
            setErrorMsg(e?.shortMessage || e?.message || 'Transaction rejected');
            setStep('error');
        }
    }

    async function switchToTestnet() {
        try {
            await switchChain({ chainId: BSC_TESTNET_ID });
            setStep('idle');
        } catch { /* user rejected */ }
    }

    // ── Not connected ─────────────────────────────────────────────────────────
    if (!isConnected) {
        return (
            <div className="glass-card-prominent rounded-2xl p-6 text-center">
                <Wallet className="w-10 h-10 text-gold mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary mb-1">Connect Your Wallet</h3>
                <p className="text-text-secondary text-sm">Connect MetaMask to deploy to BSC Testnet.</p>
            </div>
        );
    }

    // ── Success ───────────────────────────────────────────────────────────────
    if (step === 'success') {
        return (
            <div className="glass-card-prominent rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-success" />
                </div>
                <h3 className="font-bold text-xl text-text-primary mb-1 flex items-center justify-center gap-2">Deployed! <Sparkles className="w-5 h-5 text-gold animate-pulse-glow" /></h3>
                <p className="text-text-secondary text-sm mb-5">
                    {config.tokenName} (${config.tokenSymbol}) is live on BSC Testnet.
                </p>

                <div className="space-y-2 text-left mb-5">
                    {[
                        { label: 'Contract', href: `https://testnet.bscscan.com/address/${contractAddress}`, value: contractAddress },
                        { label: 'Tx Hash', href: `https://testnet.bscscan.com/tx/${txHash}`, value: txHash || '' },
                    ].map(({ label, href, value }) => (
                        <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-sm">
                            <span className="text-text-secondary">{label}</span>
                            <a href={href} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-gold hover:underline font-mono text-xs">
                                {value.slice(0, 10)}…{value.slice(-8)}
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    ))}
                </div>

                <a href={`https://testnet.bscscan.com/address/${contractAddress}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-success/15 border border-success/30 text-success hover:bg-success/20 transition-all">
                    View on BscScan Testnet <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        );
    }

    // ── Default: deploy form ──────────────────────────────────────────────────
    return (
        <div className="glass-card-prominent rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-gold" />
                </div>
                <div>
                    <h3 className="font-semibold text-text-primary">Deploy to BSC Testnet</h3>
                    <p className="text-text-secondary text-sm">Real ERC-20 on-chain — no real BNB needed</p>
                </div>
            </div>

            {/* Deploy params */}
            <div className="space-y-2 mb-5">
                {[
                    { label: 'Token Name', value: config.tokenName },
                    { label: 'Symbol', value: `$${config.tokenSymbol}` },
                    { label: 'Total Supply', value: Number(config.totalSupply).toLocaleString() },
                    { label: 'Decimals', value: '18' },
                    { label: 'Network', value: 'BSC Testnet (Chain 97)' },
                    { label: 'Deployer', value: `${address?.slice(0, 6)}…${address?.slice(-4)}` },
                ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center text-sm py-1.5 border-b border-white/5">
                        <span className="text-text-secondary">{label}</span>
                        <span className="text-text-primary font-medium">{value}</span>
                    </div>
                ))}
            </div>

            {/* Wrong chain */}
            {step === 'wrong-chain' && !isOnTestnet && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/10 border border-warning/20 text-warning text-sm mb-4">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                        Wrong network detected. You need BSC Testnet.
                        <button onClick={switchToTestnet} className="ml-2 underline font-medium">Switch now</button>
                    </div>
                </div>
            )}

            {/* Confirming */}
            {step === 'confirming' && txHash && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-info/10 border border-info/20 text-info text-sm mb-4">
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <div className="min-w-0">
                        Waiting for confirmation…
                        <a href={`https://testnet.bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                            className="ml-2 underline font-mono text-xs truncate">
                            {txHash.slice(0, 14)}…
                        </a>
                    </div>
                </div>
            )}

            {/* Error */}
            {step === 'error' && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm mb-4">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {errorMsg}
                </div>
            )}

            {/* CTA */}
            <button
                onClick={handleDeploy}
                disabled={step === 'deploying' || step === 'confirming'}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-bg-base transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] animate-pulse-glow"
                style={{ background: 'linear-gradient(135deg, #F0B90B 0%, #8B5CF6 100%)' }}
            >
                {step === 'deploying' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending tx…</>
                ) : step === 'confirming' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Confirming on-chain…</>
                ) : (
                    <><Rocket className="w-4 h-4" /> Deploy ERC-20 to BSC Testnet</>
                )}
            </button>

            <p className="text-text-tertiary text-xs text-center mt-3">
                ✦ Requires test BNB —{' '}
                <a href="https://testnet.bnbchain.org/faucet-smart" target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
                    get it free from the faucet
                </a>
            </p>
        </div>
    );
}
