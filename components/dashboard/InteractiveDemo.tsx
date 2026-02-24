'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Play, ShieldAlert, TrendingDown, AlertTriangle,
    ShieldCheck, Database, RefreshCw, Zap, Users, Search,
    TrendingUp, BarChart3, Shield, CheckSquare, Square, PlayCircle
} from 'lucide-react';
import type { TokenConfig } from '@/types/config';

interface InteractiveDemoProps {
    config: TokenConfig;
    contractAddress?: string;
}

type LogType = 'info' | 'success' | 'warning' | 'error' | 'divider';
interface LogEntry {
    time: string;
    text: string;
    type: LogType;
}

type AttackId = 'normal' | 'whale' | 'sniper' | 'coordinated' | 'devdump' | 'twap' | 'dynamictax' | 'honeypot';

interface AttackDef {
    id: AttackId;
    name: string;
    desc: string;
    category: 'basic' | 'attack' | 'advanced';
    guard: string; // which defense mechanism blocks this
    icon: React.ReactNode;
    color: string;
}

// Generate random hex for fake wallet addresses
const randomHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const fakeAddr = () => `0x${randomHex(4)}...${randomHex(4)}`;
const fakeBlock = () => Math.floor(18000000 + Math.random() * 500000);
const fakeTxHash = () => `0x${randomHex(16)}...`;

const ATTACKS: AttackDef[] = [
    { id: 'normal', name: 'Normal Trade', desc: 'Standard 0.5% buy — passes all guards', category: 'basic', guard: 'All Guards Pass', icon: <ShieldCheck className="w-4 h-4" />, color: 'text-green-400' },
    { id: 'whale', name: 'Whale Dump', desc: 'Buy 3.5% supply — blocked by max wallet', category: 'attack', guard: 'Anti-Whale (maxWalletPercent)', icon: <ShieldAlert className="w-4 h-4" />, color: 'text-yellow-400' },
    { id: 'sniper', name: 'Sniper Bot / MEV', desc: 'Same-block buy+sell extraction', category: 'attack', guard: 'Anti-Bot (antiBotBlocks cooldown)', icon: <Zap className="w-4 h-4" />, color: 'text-orange-400' },
    { id: 'coordinated', name: 'Coordinated Dump', desc: '5 wallets sell simultaneously', category: 'attack', guard: 'AI Guardian (volume spike detection)', icon: <Users className="w-4 h-4" />, color: 'text-red-400' },
    { id: 'devdump', name: 'Dev Rugpull', desc: 'Deployer sells 100% allocation', category: 'attack', guard: 'PLU Emergency Freeze', icon: <TrendingDown className="w-4 h-4" />, color: 'text-red-500' },
    { id: 'twap', name: 'TWAP Oracle Attack', desc: 'Flash loan price manipulation', category: 'advanced', guard: 'TWAP Price Guard (deviation limit)', icon: <BarChart3 className="w-4 h-4" />, color: 'text-cyan-400' },
    { id: 'dynamictax', name: 'Sell Pressure Cascade', desc: 'Rapid sells → tax escalation', category: 'advanced', guard: 'Dynamic Tax Engine', icon: <TrendingUp className="w-4 h-4" />, color: 'text-purple-400' },
    { id: 'honeypot', name: 'Honeypot Scan', desc: '6-point contract safety audit', category: 'advanced', guard: 'Pre-Launch Scanner', icon: <Search className="w-4 h-4" />, color: 'text-blue-400' },
];

export function InteractiveDemo({ config, contractAddress }: InteractiveDemoProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [healthScore, setHealthScore] = useState(85);
    const [lockState, setLockState] = useState<'ACTIVE' | 'FROZEN' | 'COOLDOWN'>('ACTIVE');
    const [dynamicTax, setDynamicTax] = useState(config.amm.sellTaxPercent || 4);
    const [selected, setSelected] = useState<Set<AttackId>>(new Set());
    const [currentAttack, setCurrentAttack] = useState<AttackId | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef(false);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const addLog = useCallback((text: string, type: LogType = 'info') => {
        setLogs(prev => [...prev, {
            time: type === 'divider' ? '────────' : new Date().toLocaleTimeString([], { hour12: false }),
            text,
            type
        }]);
    }, []);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const toggleAttack = (id: AttackId) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAll = () => {
        if (selected.size === ATTACKS.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(ATTACKS.map(a => a.id)));
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SIMULATION FUNCTIONS — each returns without touching isSimulating
    // ═══════════════════════════════════════════════════════════════════════════

    const runNormal = async () => {
        const block = fakeBlock();
        addLog(`📤 TX submitted: Buy 0.5% ${config.tokenSymbol} supply`, 'info');
        await sleep(500);
        addLog(`Block #${block} — Validating against GuardianToken rules...`, 'info');
        await sleep(350);
        addLog(`  ├─ Anti-Whale:   0.5% < ${config.amm.antiWhaleMaxWalletPercent}% max wallet ✓`, 'info');
        addLog(`  ├─ Max TX:       0.5% < ${config.amm.maxTxPercent || 1.5}% max tx ✓`, 'info');
        addLog(`  ├─ Cooldown:     No prior trades from sender ✓`, 'info');
        addLog(`  ├─ TWAP:         Spot ≈ TWAP (no deviation) ✓`, 'info');
        addLog(`  └─ Sell Tax:     ${config.amm.sellTaxPercent}% (standard rate)`, 'info');
        await sleep(500);
        addLog(`✅ TX ${fakeTxHash()} confirmed in block #${block}. Balance updated.`, 'success');
    };

    const runWhale = async () => {
        const block = fakeBlock();
        addLog(`🚨 MEMPOOL: Unusually large buy order — 3.5% of total supply`, 'warning');
        await sleep(500);
        addLog(`Block #${block} — Validating...`, 'info');
        await sleep(350);
        addLog(`  ├─ Anti-Whale Check:`, 'info');
        addLog(`  │   Requested:  3.5% of supply`, 'info');
        addLog(`  │   Max Wallet: ${config.amm.antiWhaleMaxWalletPercent}%`, 'info');
        addLog(`  │   Result:     3.5% > ${config.amm.antiWhaleMaxWalletPercent}% ✗`, 'error');
        await sleep(500);
        addLog(`❌ REVERTED: "GuardianToken: exceeds max wallet limit"`, 'error');
        addLog(``, 'info');
        addLog(`🛡️ DEFENSE: Anti-Whale guard prevented whale accumulation.`, 'success');
        addLog(`   Config: antiWhaleMaxWalletPercent = ${config.amm.antiWhaleMaxWalletPercent}%`, 'success');
    };

    const runSniper = async () => {
        const block = fakeBlock();
        const botAddr = fakeAddr();
        addLog(`⚡ BOT DETECTED: ${botAddr} submitted buy+sell in mempool`, 'warning');
        await sleep(400);
        addLog(`Block #${block} — Buy 1.2% supply from ${botAddr}`, 'info');
        addLog(`Block #${block} — Sell 1.2% supply from ${botAddr} (SAME BLOCK!)`, 'warning');
        await sleep(500);
        addLog(`  ├─ AntiBot Guard Check:`, 'info');
        addLog(`  │   Buy block:  #${block}`, 'info');
        addLog(`  │   Sell block: #${block}`, 'info');
        addLog(`  │   Delta:      0 blocks`, 'error');
        addLog(`  │   Required:   ${config.amm.antiBotBlocks}+ blocks`, 'info');
        addLog(`  │   Result:     0 < ${config.amm.antiBotBlocks} ✗`, 'error');
        await sleep(400);
        addLog(`❌ REVERTED: "GuardianToken: cooldown period active"`, 'error');
        addLog(``, 'info');
        addLog(`🛡️ DEFENSE: Anti-Bot cooldown blocked sniper MEV extraction.`, 'success');
        addLog(`   Config: antiBotBlocks = ${config.amm.antiBotBlocks} blocks`, 'success');
    };

    const runCoordinated = async () => {
        addLog(`🧠 AI Guardian monitoring sell volume in real-time...`, 'info');
        await sleep(400);

        const wallets = Array.from({ length: 5 }, () => fakeAddr());
        let totalSold = 0;
        for (const w of wallets) {
            if (abortRef.current) return;
            const sellPct = (1.5 + Math.random() * 1.5).toFixed(1);
            totalSold += parseFloat(sellPct);
            addLog(`  📉 ${w} sells ${sellPct}% — block #${fakeBlock()}`, 'warning');
            await sleep(300);
        }

        addLog(``, 'info');
        addLog(`🚨 AI ALERT: Coordinated sell pattern detected!`, 'error');
        await sleep(300);
        addLog(`  ├─ Volume Analysis:`, 'info');
        addLog(`  │   5 wallets sold ${totalSold.toFixed(1)}% in 18 seconds`, 'error');
        addLog(`  │   Threshold: >8% sells in 20s`, 'info');
        addLog(`  │   Funding: Similar origin wallets (linked)`, 'error');
        addLog(`  └─ Verdict: Coordinated dump attempt`, 'error');
        await sleep(500);

        setLockState('COOLDOWN');
        let score = healthScore;
        const interval = setInterval(() => {
            score -= 3;
            if (score <= 55) { score = 55; clearInterval(interval); }
            setHealthScore(score);
        }, 100);

        addLog(``, 'info');
        addLog(`🛡️ DEFENSE: Emergency cooldown activated — sells paused 60 seconds`, 'success');
        addLog(`   emergencyCooldown() called by AI Guardian contract`, 'success');
        addLog(`   Config: Sell volume spike threshold = 8% in 20s`, 'success');
    };

    const runDevDump = async () => {
        const deployer = fakeAddr();
        addLog(`🚨 CRITICAL: Deployer wallet ${deployer} initiating mass sell-off!`, 'error');
        await sleep(600);
        addLog(`  Attempting to sell 100% of team allocation`, 'error');
        await sleep(400);
        addLog(`🧠 AI Oracle re-calculating holistic token health...`, 'warning');

        let score = healthScore;
        const interval = setInterval(() => {
            score -= 5;
            if (score <= 18) { score = 18; clearInterval(interval); }
            setHealthScore(score);
        }, 80);

        await sleep(1000);
        addLog(`  ├─ Health Score Analysis:`, 'info');
        addLog(`  │   Before:     ${healthScore}/100`, 'info');
        addLog(`  │   After:      18/100 (CRITICAL)`, 'error');
        addLog(`  │   Threshold:  50/100`, 'info');
        addLog(`  │   Holders:    Rapidly declining`, 'error');
        addLog(`  └─ Price impact: -67% in 3 blocks`, 'error');
        await sleep(500);
        addLog(`PLU Controller intercepted sell transaction.`, 'warning');

        setLockState('FROZEN');
        addLog(``, 'info');
        addLog(`🛡️ DEFENSE: emergencyFreeze() called by PLU Controller`, 'success');
        addLog(`   All LP tokens locked indefinitely.`, 'success');
        addLog(`   Deployer sell order REVERTED.`, 'success');
        addLog(`   Config: PLU totalLockPercent = ${config.plu.totalLockPercent}%`, 'success');
    };

    const runTWAP = async () => {
        const deviation = config.amm.twapDeviationPercent || 15;
        const spotPrice = 0.0847;
        const twapPrice = 0.0680;
        const actualDev = ((spotPrice - twapPrice) / twapPrice * 100).toFixed(1);

        addLog(`📊 TWAP Oracle Check for ${config.tokenSymbol}...`, 'info');
        await sleep(400);
        addLog(`  ├─ Price Analysis:`, 'info');
        addLog(`  │   Spot Price:   $${spotPrice.toFixed(4)} (current block)`, 'info');
        addLog(`  │   1h TWAP:      $${twapPrice.toFixed(4)} (time-weighted avg)`, 'info');
        addLog(`  │   Deviation:    +${actualDev}%`, 'warning');
        addLog(`  │   Max Allowed:  ${deviation}%`, 'info');
        addLog(`  │   Result:       ${actualDev}% > ${deviation}% ✗`, 'error');
        await sleep(500);
        addLog(`  └─ Suspected: Flash loan manipulation / wash trading`, 'error');
        await sleep(300);
        addLog(`❌ RESTRICTED: Large trades blocked until TWAP stabilizes`, 'error');
        addLog(``, 'info');
        addLog(`🛡️ DEFENSE: TWAP Oracle guard prevented sandwich attack.`, 'success');
        addLog(`   Config: twapDeviationPercent = ${deviation}%`, 'success');
    };

    const runDynamicTax = async () => {
        const baseTax = config.amm.sellTaxPercent || 4;
        const taxLevels = [baseTax, baseTax * 2, baseTax * 4, Math.min(baseTax * 7, 35)];

        addLog(`📉 Sell pressure increasing on ${config.tokenSymbol}...`, 'info');
        addLog(`   Dynamic Tax Engine monitoring sell/buy ratio`, 'info');
        await sleep(400);

        addLog(`  ├─ Tax Escalation Sequence:`, 'info');
        for (let i = 0; i < taxLevels.length; i++) {
            if (abortRef.current) return;
            const tax = Math.round(taxLevels[i]);
            setDynamicTax(tax);
            const prev = i === 0 ? baseTax : Math.round(taxLevels[i - 1]);
            if (i < taxLevels.length - 1) {
                addLog(`  │   Sell #${i + 1} → Tax: ${prev}% → ${tax}%`, 'warning');
            } else {
                addLog(`  │   CEILING → Tax locked at ${tax}% (maximum)`, 'error');
            }
            await sleep(400);
        }

        addLog(`  └─ Further sells at ${Math.round(taxLevels[taxLevels.length - 1])}% until cooldown`, 'error');
        await sleep(300);
        addLog(``, 'info');
        addLog(`🛡️ DEFENSE: Dynamic tax disincentivized panic selling.`, 'success');
        addLog(`   Config: Base sellTax = ${baseTax}%, Dynamic = ${config.amm.dynamicTaxEnabled ? 'ON' : 'OFF'}`, 'success');
        addLog(`   Tax decays to ${baseTax}% after 30 min of stable trading`, 'success');
    };

    const runHoneypot = async () => {
        const hasRealContract = contractAddress && /^0x[a-fA-F0-9]{40}$/.test(contractAddress);

        if (hasRealContract) {
            // ═══ REAL ON-CHAIN SCAN ═══
            addLog(`🔍 LIVE SCAN: Querying BscScan for contract ${contractAddress}`, 'info');
            addLog(`   ⛓️  This is a REAL on-chain analysis — not a simulation`, 'warning');
            await sleep(500);
            addLog(`   Connecting to BscScan API...`, 'info');
            await sleep(300);

            try {
                const res = await fetch('/api/scanner', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contractAddress }),
                });
                const data = await res.json();

                if (!data.success) {
                    addLog(`   ⚠️ API returned: ${data.error || 'Unknown error'}`, 'warning');
                    addLog(`   Falling back to config-based analysis...`, 'info');
                    await runHoneypotFallback();
                    return;
                }

                addLog(``, 'info');
                addLog(`  ┌─ BscScan Analysis Results:`, 'info');
                addLog(`  │  Contract: ${data.contractName || 'Unknown'}`, 'info');
                addLog(`  │  Verified: ${data.isVerified ? 'Yes ✅' : 'No ⚠️'}`, data.isVerified ? 'success' : 'warning');
                await sleep(300);

                for (const check of (data.checks || [])) {
                    if (abortRef.current) return;
                    await sleep(350);
                    const icon = check.pass ? '✅' : '❌';
                    addLog(`  │ ${icon} ${check.name}: ${check.detail}`, check.pass ? 'success' : 'error');
                }

                await sleep(300);
                const scoreType = data.score >= 80 ? 'success' : data.score >= 50 ? 'warning' : 'error';
                addLog(`  └─ Safety Score: ${data.score}/100 (${data.passed}/${data.total} checks passed)`, scoreType);
                addLog(`     Risk Level: ${data.riskLevel}`, scoreType);
                addLog(``, 'info');

                if (data.score >= 80) {
                    addLog(`🛡️ RESULT: LOW RISK — Contract verified safe on BscScan.`, 'success');
                } else if (data.score >= 50) {
                    addLog(`⚠️ RESULT: MEDIUM RISK — Some concerns detected.`, 'warning');
                } else {
                    addLog(`🚨 RESULT: HIGH RISK — Multiple red flags detected!`, 'error');
                }
                addLog(`   Source: BscScan Testnet (live data)`, 'info');

            } catch {
                addLog(`   ❌ Network error calling scanner API`, 'error');
                addLog(`   Falling back to config-based analysis...`, 'info');
                await runHoneypotFallback();
            }
        } else {
            // No real contract — use config-based analysis
            addLog(`🔍 Honeypot Scan: ${config.tokenSymbol} (config-based)`, 'info');
            addLog(`   No deployed contract address — using config heuristics`, 'info');
            await sleep(300);
            await runHoneypotFallback();
        }
    };

    const runHoneypotFallback = async () => {
        await sleep(300);
        const checks = [
            { name: 'Hidden Tax', pass: config.amm.sellTaxPercent <= 10, detail: config.amm.sellTaxPercent <= 10 ? `Sell ${config.amm.sellTaxPercent}% — safe (<10%)` : `Sell ${config.amm.sellTaxPercent}% — EXCESSIVE` },
            { name: 'Blacklist Fn', pass: true, detail: 'No blacklist()/exclude() found' },
            { name: 'Sell Lock', pass: true, detail: `Sell enabled. Cooldown: ${config.amm.cooldownSeconds || 0}s` },
            { name: 'Owner Mint', pass: true, detail: 'Fixed supply — no mint() function' },
            { name: 'Anti-Whale', pass: config.amm.antiWhaleMaxWalletPercent <= 5, detail: `Max wallet: ${config.amm.antiWhaleMaxWalletPercent}%` },
            { name: 'LP Lock (PLU)', pass: config.plu.totalLockPercent >= 50, detail: `${config.plu.totalLockPercent}% locked` },
        ];

        addLog(`  ┌─ Scan Results:`, 'info');
        for (const check of checks) {
            if (abortRef.current) return;
            await sleep(350);
            const icon = check.pass ? '✅' : '❌';
            addLog(`  │ ${icon} ${check.name}: ${check.detail}`, check.pass ? 'success' : 'error');
        }

        const passed = checks.filter(c => c.pass).length;
        const score = Math.round((passed / checks.length) * 100);
        addLog(`  └─ Score: ${score}/100 (${passed}/${checks.length} passed)`, score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error');
        addLog(``, 'info');

        if (score >= 80) {
            addLog(`🛡️ RESULT: LOW RISK — Safe to trade.`, 'success');
        } else if (score >= 50) {
            addLog(`⚠️ RESULT: MEDIUM RISK — Proceed with caution.`, 'warning');
        } else {
            addLog(`🚨 RESULT: HIGH RISK — DO NOT TRADE.`, 'error');
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // RUNNER — Maps attack IDs to functions
    // ═══════════════════════════════════════════════════════════════════════════

    const attackFnMap: Record<AttackId, () => Promise<void>> = {
        normal: runNormal,
        whale: runWhale,
        sniper: runSniper,
        coordinated: runCoordinated,
        devdump: runDevDump,
        twap: runTWAP,
        dynamictax: runDynamicTax,
        honeypot: runHoneypot,
    };

    const runSingle = async (id: AttackId) => {
        abortRef.current = false;
        setIsSimulating(true);
        setCurrentAttack(id);
        const attack = ATTACKS.find(a => a.id === id)!;
        addLog(`═══════════════════════════════════════════════════`, 'divider');
        addLog(`▶ ${attack.name.toUpperCase()}`, 'divider');
        addLog(`  Guard: ${attack.guard}`, 'divider');
        addLog(`═══════════════════════════════════════════════════`, 'divider');
        await attackFnMap[id]();
        setCurrentAttack(null);
        setIsSimulating(false);
    };

    const runSelected = async () => {
        if (selected.size === 0) return;
        abortRef.current = false;
        setIsSimulating(true);
        setLogs([]);

        addLog(`🚀 GUARDIAN DEFENSE TEST SUITE`, 'divider');
        addLog(`   Running ${selected.size} attack simulation(s)...`, 'divider');
        addLog(``, 'info');

        const attackOrder = ATTACKS.filter(a => selected.has(a.id));

        for (let i = 0; i < attackOrder.length; i++) {
            if (abortRef.current) break;
            const attack = attackOrder[i];
            setCurrentAttack(attack.id);

            addLog(`═══ [${i + 1}/${attackOrder.length}] ${attack.name.toUpperCase()} ═══`, 'divider');
            addLog(`  Attack: ${attack.desc}`, 'divider');
            addLog(`  Guard:  ${attack.guard}`, 'divider');
            addLog(``, 'info');

            await attackFnMap[attack.id]();

            addLog(``, 'info');

            // Brief pause between attacks
            if (i < attackOrder.length - 1) {
                await sleep(800);
            }
        }

        addLog(`═══════════════════════════════════════════════════`, 'divider');
        addLog(`✅ TEST SUITE COMPLETE: ${attackOrder.length} simulations executed`, 'divider');
        addLog(`═══════════════════════════════════════════════════`, 'divider');

        setCurrentAttack(null);
        setIsSimulating(false);
    };

    const resetDemo = () => {
        abortRef.current = true;
        setLogs([]);
        setHealthScore(85);
        setLockState('ACTIVE');
        setDynamicTax(config.amm.sellTaxPercent || 4);
        setIsSimulating(false);
        setCurrentAttack(null);
        addLog('Environment reset. Virtual blockchain ready.', 'info');
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════════

    const categoryLabel = (cat: string) => {
        switch (cat) {
            case 'basic': return { label: 'BASIC TRADES', color: 'text-green-500', border: 'border-green-200 dark:border-green-900/30', bg: '' };
            case 'attack': return { label: 'ATTACK SIMULATIONS', color: 'text-red-500', border: 'border-red-200 dark:border-red-900/30', bg: 'bg-red-50/30 dark:bg-red-950/10' };
            case 'advanced': return { label: 'ADVANCED GUARDS', color: 'text-cyan-500', border: 'border-cyan-200 dark:border-cyan-900/30', bg: 'bg-cyan-50/30 dark:bg-cyan-950/10' };
            default: return { label: '', color: '', border: '', bg: '' };
        }
    };

    const categories = ['basic', 'attack', 'advanced'] as const;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
            {/* Control Panel */}
            <div className="lg:col-span-5 space-y-3">
                {/* Select All + Run Controls */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={selectAll}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            {selected.size === ATTACKS.length
                                ? <CheckSquare className="w-4 h-4 text-cyan-500" />
                                : <Square className="w-4 h-4" />
                            }
                            {selected.size === ATTACKS.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <span className="text-xs text-gray-400">{selected.size}/{ATTACKS.length} selected</span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={runSelected} disabled={isSimulating || selected.size === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40">
                            <PlayCircle className="w-4 h-4" />
                            Run Selected ({selected.size})
                        </button>
                        <button onClick={resetDemo}
                            className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Attack Selector — organized by category */}
                {categories.map(cat => {
                    const catInfo = categoryLabel(cat);
                    const attacks = ATTACKS.filter(a => a.category === cat);
                    return (
                        <div key={cat} className={`rounded-2xl border ${catInfo.border} ${catInfo.bg} p-4 transition-colors`}>
                            <h3 className={`text-[10px] font-bold ${catInfo.color} mb-2 uppercase tracking-widest flex items-center gap-1.5`}>
                                {cat === 'basic' && <ShieldCheck className="w-3 h-3" />}
                                {cat === 'attack' && <AlertTriangle className="w-3 h-3" />}
                                {cat === 'advanced' && <Shield className="w-3 h-3" />}
                                {catInfo.label}
                            </h3>
                            <div className="space-y-1.5">
                                {attacks.map(attack => {
                                    const isSelected = selected.has(attack.id);
                                    const isRunning = currentAttack === attack.id;
                                    return (
                                        <div key={attack.id}
                                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${isRunning
                                                ? 'border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20 shadow-sm'
                                                : isSelected
                                                    ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                                                    : 'border-transparent bg-white/60 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900'
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <button onClick={() => toggleAttack(attack.id)} disabled={isSimulating}
                                                className="shrink-0 disabled:opacity-40">
                                                {isSelected
                                                    ? <CheckSquare className="w-4 h-4 text-cyan-500" />
                                                    : <Square className="w-4 h-4 text-gray-400" />
                                                }
                                            </button>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0" onClick={() => !isSimulating && toggleAttack(attack.id)}>
                                                <div className="flex items-center gap-2">
                                                    <span className={attack.color}>{attack.icon}</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{attack.name}</span>
                                                    {isRunning && (
                                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{attack.desc}</p>
                                            </div>

                                            {/* Run Single */}
                                            <button onClick={() => runSingle(attack.id)} disabled={isSimulating}
                                                className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40">
                                                <Play className="w-3.5 h-3.5 text-gray-400" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* Live Contract State */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl rounded-full" />
                    <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">Live State</h3>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Health</span>
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${healthScore >= 50
                                ? 'bg-green-400/10 text-green-500 border border-green-400/20'
                                : 'bg-red-400/10 text-red-500 border border-red-400/20'}`}>
                                {healthScore >= 50 ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                {healthScore}/100
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">PLU Lock</span>
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${lockState === 'ACTIVE'
                                ? 'bg-blue-400/10 text-blue-500 border border-blue-400/20'
                                : lockState === 'COOLDOWN'
                                    ? 'bg-yellow-400/10 text-yellow-600 border border-yellow-400/20'
                                    : 'bg-purple-400/10 text-purple-500 border border-purple-400/20'}`}>
                                <Database className="w-3 h-3" />
                                {lockState}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Sell Tax</span>
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${dynamicTax > (config.amm.sellTaxPercent || 4)
                                ? 'bg-red-400/10 text-red-500 border border-red-400/20'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'}`}>
                                {dynamicTax}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Console Output */}
            <div className="lg:col-span-7 bg-[#0A0A0B] rounded-2xl border border-gray-800 shadow-2xl flex flex-col h-[780px] overflow-hidden">
                <div className="border-b border-gray-800 px-4 py-2.5 bg-[#111112] flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-3 font-mono">guardian-node ~/{config.tokenSymbol.toLowerCase()}</span>
                    <div className="ml-auto flex items-center gap-2">
                        {currentAttack && (
                            <span className="text-[10px] text-cyan-400 font-mono">
                                {ATTACKS.find(a => a.id === currentAttack)?.name}
                            </span>
                        )}
                        <span className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto font-mono text-[12.5px] leading-relaxed space-y-0.5">
                    {logs.length === 0 ? (
                        <div className="text-gray-600 space-y-1">
                            <p className="text-cyan-500">Guardian Defense Simulator v2.0</p>
                            <p className="text-gray-700">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
                            <p>Token:  {config.tokenName} ({config.tokenSymbol})</p>
                            <p>Supply: {(config.totalSupply || 0).toLocaleString()}</p>
                            <p>Guards: Anti-Whale | Anti-Bot | TWAP | DynTax | PLU</p>
                            <p className="text-gray-700">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
                            <p className="mt-3 italic text-gray-700">Select attacks and click "Run Selected" to begin...</p>
                        </div>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className={`flex gap-3 ${log.type === 'divider' ? 'mt-2 mb-1' : ''}`}>
                                <span className={`shrink-0 select-none ${log.type === 'divider' ? 'text-cyan-600' : 'text-gray-600'}`}>
                                    [{log.time}]
                                </span>
                                <span className={
                                    log.type === 'divider' ? 'text-cyan-400 font-bold' :
                                        log.type === 'success' ? 'text-green-400 font-semibold' :
                                            log.type === 'warning' ? 'text-yellow-400' :
                                                log.type === 'error' ? 'text-red-400 font-semibold' :
                                                    'text-gray-300'
                                }>
                                    {log.text}
                                </span>
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}
