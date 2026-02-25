'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Menu, X } from 'lucide-react';

const SECTIONS = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'why-guardian', label: 'Why Guardian' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'ai-token-wizard', label: 'AI Token Wizard' },
    { id: 'token-templates', label: 'Token Templates' },
    { id: 'launching-a-token', label: 'Launching a Token' },
    { id: 'safety-guarantees', label: 'Safety Guarantees' },
    { id: 'plu-dashboard', label: 'PLU Dashboard' },
    { id: 'amm-dashboard', label: 'AMM Dashboard' },
    { id: 'risk-scanner', label: 'AI Risk Scanner' },
    { id: 'attack-simulator', label: 'Attack Simulator' },
    { id: 'guardian-score', label: 'Guardian Score' },
    { id: 'glossary', label: 'Glossary' },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
    return (
        <h2 id={id} className="group flex items-center justify-between text-[22px] font-semibold text-gray-900 dark:text-gray-100 mt-12 mb-5 scroll-mt-24 pb-2 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <span>{children}</span>
            <a href={`#${id}`} className="text-gray-300 dark:text-gray-700 group-hover:text-cyan-500 transition-colors font-normal text-base">#</a>
        </h2>
    );
}

function H3({ children }: { children: React.ReactNode }) {
    return <h3 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-8 mb-3 transition-colors">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
    return <p className="text-[16px] text-gray-600 dark:text-gray-400 leading-7 mb-4 transition-colors">{children}</p>;
}

function Note({ type = 'info', children }: { type?: 'info' | 'warn' | 'tip'; children: React.ReactNode }) {
    const b = { info: 'border-cyan-500', warn: 'border-yellow-500', tip: 'border-green-500' }[type];
    const t = { info: 'text-cyan-700 dark:text-cyan-400', warn: 'text-yellow-700 dark:text-yellow-400', tip: 'text-green-700 dark:text-green-400' }[type];
    const l = { info: 'NOTE', warn: 'WARNING', tip: 'TIP' }[type];
    return (
        <div className={`border-l-4 ${b} pl-4 py-1 mb-6`}>
            <span className={`text-[10px] font-bold tracking-widest ${t} block mb-1`}>{l}</span>
            <p className={`text-[15px] leading-6 ${t}`}>{children}</p>
        </div>
    );
}

function Tbl({ headers, rows }: { headers: string[]; rows: string[][] }) {
    return (
        <div className="overflow-x-auto mb-6">
            <table className="w-full text-[15px] border-collapse">
                <thead>
                    <tr>{headers.map(h => <th key={h} className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-800 transition-colors">{h}</th>)}</tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800/60 transition-colors">
                            {row.map((cell, j) => <td key={j} className="py-3 px-3 text-gray-700 dark:text-gray-300 align-top leading-6 transition-colors">{cell}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Mono({ children }: { children: string }) {
    return <code className="font-mono text-[13px] bg-gray-100 dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded transition-colors">{children}</code>;
}

function Hr() { return <div className="my-10 border-t border-gray-100 dark:border-gray-800/60 transition-colors" />; }

function DiagramPanel({ children }: { children: React.ReactNode }) {
    return <div className="mb-6 bg-gray-950 border border-gray-800 rounded-sm overflow-x-auto p-2">{children}</div>;
}

function AttackFlowDiagram() {
    return (
        <DiagramPanel>
            <svg viewBox="0 0 700 100" className="w-full max-w-2xl" style={{ fontFamily: 'monospace' }}>
                {[
                    { x: 10, label: 'You click\n"Simulate"', fill: '#1e293b' },
                    { x: 160, label: 'Guardian runs\nthe attack', fill: '#164e63' },
                    { x: 310, label: 'Hits the token\ncontract live', fill: '#1e1b4b' },
                    { x: 460, label: 'Contract tests\n4 protection gates', fill: '#1e1b4b' },
                    { x: 560, label: 'Result returned\nto you', fill: '#14432a' },
                ].map(({ x, label, fill }) => (
                    <g key={x}>
                        <rect x={x} y={10} width={120} height={42} rx={4} fill={fill} stroke="#334155" strokeWidth={1} />
                        {label.split('\n').map((l, i) => <text key={i} x={x + 60} y={i === 0 ? 27 : 41} textAnchor="middle" fill="#94a3b8" fontSize={10}>{l}</text>)}
                    </g>
                ))}
                {[131, 281, 431, 531].map(x => (
                    <g key={x}>
                        <line x1={x} y1={31} x2={x + 28} y2={31} stroke="#22d3ee" strokeWidth={1.5} />
                        <polygon points={`${x + 28},27 ${x + 36},31 ${x + 28},35`} fill="#22d3ee" />
                    </g>
                ))}
                <text x={10} y={90} fill="#475569" fontSize={9} fontFamily="monospace">No wallet needed. No gas spent. No transaction signed. Result is what would happen in a real swap right now.</text>
            </svg>
        </DiagramPanel>
    );
}

export default function DocsPage() {
    const [active, setActive] = useState('introduction');
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
            { rootMargin: '-15% 0px -75% 0px' }
        );
        SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex pt-16">
            <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 w-56 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="px-5 py-6">
                    <div className="mb-6">
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">Guardian Launchpad</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">v1.0 · BNB Chain</p>
                    </div>
                    <p className="text-[10px] text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-2 font-semibold">Contents</p>
                    <nav>
                        {SECTIONS.map(({ id, label }) => (
                            <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)}
                                className={`block py-1.5 text-[14px] transition-colors leading-snug ${active === id ? 'font-semibold text-cyan-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                                {label}
                            </a>
                        ))}
                    </nav>
                    <div className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 font-semibold">Verified Contract</p>
                        <code className="text-[10px] text-cyan-500 break-all leading-relaxed block">0x1FfC364A0082E5F935CAdb7A944f2a22b05bCBba</code>
                        <a href="https://testnet.bscscan.com/address/0x1FfC364A0082E5F935CAdb7A944f2a22b05bCBba" target="_blank" rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-[12px] text-gray-400 hover:text-cyan-500 transition-colors">
                            View on BscScan <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </aside>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="fixed bottom-5 right-5 z-50 md:hidden bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <main className="md:ml-56 flex-1 min-w-0">
                <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-3 flex items-center gap-4 text-[14px] text-gray-400 dark:text-gray-500 sticky top-16 bg-white dark:bg-gray-950 z-30 transition-colors">
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">GROWUP AI</span>
                    <span className="text-gray-200 dark:text-gray-700">·</span>
                    <a href="#introduction" className="hover:text-cyan-500 transition-colors">Documentation</a>
                    <span className="text-gray-200 dark:text-gray-700 hidden sm:block">|</span>
                    <Link href="/scanner" className="hover:text-cyan-500 transition-colors hidden sm:block">Scanner</Link>
                    <Link href="/create" className="hover:text-cyan-500 transition-colors hidden sm:block">Launch Token</Link>
                    <Link href="/live" className="hover:text-cyan-500 transition-colors hidden sm:block">Simulator</Link>
                </div>

                <div className="px-8 md:px-14 py-10 max-w-4xl">
                    <p className="text-[13px] text-gray-400 dark:text-gray-500 font-mono mb-4">guardian-launchpad / documentation</p>
                    <h1 className="text-[32px] font-bold tracking-tight mb-2">GROWUP AI — Documentation</h1>
                    <p className="text-[17px] text-gray-500 dark:text-gray-400 mb-8">A rug-proof token launchpad with live transaction prediction on BNB Chain.</p>

                    {/* 1 */}
                    <H2 id="introduction">Introduction</H2>
                    <P>GROWUP AI is a token launchpad and DeFi safety platform built on BNB Chain. It combines two things that have never existed together in one product: a way to launch a token with legally-binding safety rules burned into the contract, and a tool that predicts exactly what will happen during any trade — before you sign or spend a single dollar.</P>
                    <P>The platform has two sides. If you are a <strong className="text-gray-900 dark:text-gray-100">token creator</strong>, you get an AI-powered wizard that designs your full token economy, deploys your token, and locks your liquidity under a health-based release system that builds investor trust automatically. If you are an <strong className="text-gray-900 dark:text-gray-100">investor or trader</strong>, you get a scanner and attack simulator that tell you in seconds whether a token will let you sell, block you, or drain your funds — before you touch it.</P>

                    <H3>What the platform provides</H3>
                    <Tbl
                        headers={['Tool', 'Who It Is For', 'What You Get']}
                        rows={[
                            ['AI Token Wizard', 'Token creators', 'Describe your project in plain English — AI designs the full token economy and deploys it in one flow'],
                            ['Token Templates', 'Token creators', 'Six pre-built token configurations for different use cases — launch in minutes without starting from scratch'],
                            ['PLU Dashboard', 'Token creators', 'A smart liquidity lock that releases your funds based on your project\'s health score, not just a timer'],
                            ['AMM Simulator', 'Token creators', 'Preview how your token\'s price will move before you deploy — test bull, base, and bear scenarios'],
                            ['AI Risk Scanner', 'Investors, traders', 'Scan any BNB Chain token and get a full safety report with a 0–100 score in under 5 seconds'],
                            ['Attack Simulator', 'Investors, traders', 'Simulate whale dumps, bot attacks, and mass sells against a token — see exactly what the contract does'],
                        ]}
                    />

                    <Hr />

                    {/* 2 */}
                    <H2 id="why-guardian">Why Guardian</H2>
                    <P>BNB Chain sees dozens of rug pulls and honeypot scams every day. The typical pattern is the same: a token launches with aggressive marketing, investors buy in, and then the developer either removes all the liquidity (rug pull) or activates a hidden setting that prevents anyone from selling (honeypot). By the time investors realize what happened, the money is gone.</P>
                    <P>The existing tools that try to detect this — block explorers, honeypot checkers, social media warnings — all share the same weakness: they work <em>after</em> the damage is done, or they check surface signals that can be faked. A project can pass every standard honeypot check and still rug.</P>
                    <P>Guardian takes a different approach entirely. Instead of checking if a contract <em>looks</em> dangerous, it actually <em>runs</em> the transaction against the live contract on the BNB Chain node and shows you the result. If a sell will revert, you see the exact error message before you sign anything. If a whale attack will be blocked, you see it blocked — live, on the real contract, not in a simulation environment.</P>
                    <Note type="tip">Guardian works on tokens it has never seen before, including tokens that have not yet been reviewed by any security team. You paste the address, and within seconds you have a complete risk picture from live on-chain data.</Note>

                    <Hr />

                    {/* 3 */}
                    <H2 id="getting-started">Getting Started</H2>
                    <P>You do not need to create an account. The Risk Scanner and Attack Simulator work without connecting a wallet at all — they only read from the blockchain, they never ask for any permissions. You only need a wallet if you want to deploy a token.</P>

                    <H3>To scan or simulate</H3>
                    <P>Go to the <Link href="/scanner" className="text-cyan-500 hover:underline">Risk Scanner</Link> or <Link href="/live" className="text-cyan-500 hover:underline">Attack Simulator</Link>. No wallet needed. Paste any BNB Chain token address and the analysis runs immediately.</P>

                    <H3>To launch a token</H3>
                    <Tbl
                        headers={['Step', 'What to Do']}
                        rows={[
                            ['1. Get a wallet', 'Install MetaMask or use any Web3 wallet. The platform also supports WalletConnect.'],
                            ['2. Switch to BSC Testnet', 'Add BSC Testnet to your wallet — Chain ID 97, RPC: data-seed-prebsc-1-s1.binance.org:8545. MetaMask can add this automatically.'],
                            ['3. Get testnet BNB', 'Visit faucet.quicknode.com/binance-smart-chain and claim free testnet BNB. You need a small amount to pay the deployment gas fee.'],
                            ['4. Connect your wallet', 'Click "Connect Wallet" in the top right corner and approve the connection in your wallet app.'],
                            ['5. Launch your token', 'Go to the AI Token Wizard, describe your project, and follow the steps.'],
                        ]}
                    />
                    <Note type="info">Everything on this platform currently runs on BSC Testnet — a practice network where BNB has no real monetary value. This means you can launch, test, and simulate everything for free with zero financial risk.</Note>

                    <Hr />

                    {/* 4 */}
                    <H2 id="ai-token-wizard">AI Token Wizard</H2>
                    <P>The AI Token Wizard at <Mono>/create</Mono> lets you describe your project in plain English and transforms that description into a complete, deployment-ready token configuration. You do not need to understand tokenomics, smart contracts, or DeFi mechanics — that is the AI's job.</P>

                    <H3>How it works</H3>
                    <P>You type a single sentence or a few words describing your token's purpose — for example: <em>"a governance token for my AI data marketplace with low trading tax and long team vesting"</em>. The AI reads that description and generates a complete token economy: the name, symbol, total supply, wallet limits, trading taxes, vesting schedule for team and investors, liquidity plan, and the safety unlock schedule for your locked funds.</P>
                    <P>Once the AI produces the configuration, you see a full preview screen on the right with every parameter explained. You can accept it as-is or adjust any individual setting using sliders — tax rates, supply size, wallet limits, anti-bot window, sell cooldown — before deploying.</P>

                    <H3>What the AI configures for you</H3>
                    <Tbl
                        headers={['Setting', 'What It Controls', 'Typical AI suggestion']}
                        rows={[
                            ['Token name and symbol', 'The displayed name and ticker your token will have on all DEXs forever', 'Created from your project description'],
                            ['Total supply', 'How many tokens will ever exist — no more can be created after launch', '1B for meme/community, 100M for utility, 100M for DAO'],
                            ['Buy and sell tax', 'A percentage taken from each trade and sent to your specified wallet', '1–2% buy tax, 2–5% sell tax'],
                            ['Anti-whale limit', 'The maximum percentage of total supply any one wallet can hold', '1–3% of total supply'],
                            ['Anti-bot window', 'A short period after launch (measured in blocks, ~3 seconds each) where only whitelisted wallets can trade', '1–5 blocks'],
                            ['Sell cooldown', 'The minimum time each wallet must wait between sells — prevents rapid bot farming', '10–60 seconds'],
                            ['Vesting schedule', 'How team, investor, and marketing tokens unlock over time — to prevent early dumps', 'Cliff of 3–6 months, linear over 12–24 months'],
                            ['Liquidity lock plan', 'How much of your liquidity is locked and when each portion becomes claimable', 'Based on health milestones, not a fixed date'],
                        ]}
                    />

                    <Note type="warn">Every parameter the AI suggests is a starting point, not a requirement. Use the sidebar sliders to adjust anything before you deploy. Once deployed to the blockchain, some parameters are permanently fixed and cannot be changed.</Note>

                    <Hr />

                    {/* 5 */}
                    <H2 id="token-templates">Token Templates</H2>
                    <P>If you already know what kind of token you need, skip the AI generation step and start from a template at <Mono>/templates</Mono>. Each template is a fully pre-configured token economy built around a specific use case. Select one and you jump straight to the preview screen where you can tweak any detail before deploying.</P>
                    <Tbl
                        headers={['Template', 'Best For', 'Key Characteristics']}
                        rows={[
                            ['AI Chatbot Token', 'Access tokens for AI products and APIs', 'Moderate supply, low trading tax, designed for utility rather than speculation'],
                            ['AI Agent Token', 'Autonomous agent economies and AI workflows', 'Balanced supply, moderate tax, longer team vesting to signal long-term commitment'],
                            ['Compute Token', 'GPU marketplace, infrastructure, resource access', 'Smaller supply, very low tax, minimal price volatility by design'],
                            ['Data Token', 'Data marketplaces and information economies', 'Stable mechanics, low tax, suited for consistent demand rather than speculation'],
                            ['Meme Token', 'Community-driven viral tokens', 'Very large supply, standard tax, optimized for maximum initial distribution'],
                            ['DAO Token', 'Governance, voting, and on-chain protocol management', 'No trading tax, larger per-wallet limits, extended team lockup to ensure long-term alignment'],
                        ]}
                    />

                    <Hr />

                    {/* 6 */}
                    <H2 id="launching-a-token">Launching a Token</H2>
                    <P>When you are satisfied with your configuration — whether from the AI or a template — clicking Deploy opens your wallet and asks you to confirm a single transaction. That transaction creates your token on the BNB Chain and immediately gives you full ownership.</P>

                    <H3>What happens during deployment</H3>
                    <P>Your token is created by the Guardian Factory contract. The factory builds a new token with all your chosen parameters written directly into the contract — your name, your supply, your taxes, your wallet limits. The full token supply is sent immediately to your wallet. Ownership of the contract is transferred to you. The factory records your token in a permanent on-chain registry so it is always auditable.</P>
                    <P>After the transaction confirms, you see a deployment success screen that shows your contract address and a direct link to view it on BscScan where anyone can verify the source code and all parameters.</P>

                    <H3>After deployment</H3>
                    <Tbl
                        headers={['Next Step', 'Where', 'What to Do']}
                        rows={[
                            ['View your token', '/dashboard', 'All your deployed tokens appear here — click any to see its live stats'],
                            ['Add liquidity', 'PancakeSwap', 'Go to PancakeSwap, add BNB + your token to create a trading pair'],
                            ['Lock liquidity', '/plu', 'Deposit your LP position into the PLU system to build investor trust'],
                            ['Monitor growth', '/growth', 'Track your token\'s holder growth, volume, and price over time'],
                        ]}
                    />

                    <Hr />

                    {/* 7 */}
                    <H2 id="safety-guarantees">Safety Guarantees for Investors</H2>
                    <P>A Guardian token is not just a regular BEP-20 with a promise from the developer. The safety rules are written into the smart contract itself — they are enforced by the blockchain, not by the team's goodwill. There is no admin panel, no backdoor, and no upgrade function that can change the rules after launch.</P>

                    <H3>What a token creator can and cannot do after deployment</H3>
                    <Tbl
                        headers={['Action', 'Can the creator do this?', 'Why']}
                        rows={[
                            ['Create more tokens (mint)', 'No — permanently impossible', 'The token has no mint function. Additional supply can never be created.'],
                            ['Block a wallet from selling (blacklist)', 'No — permanently impossible', 'There is no blacklist in the contract. No wallet can ever be trapped.'],
                            ['Increase the buy or sell tax', 'No — permanently impossible', 'Taxes can only ever go down. The contract rejects any attempt to raise them.'],
                            ['Tighten the anti-whale wallet limit', 'No — permanently impossible', 'The maximum wallet size is fixed at deploy time with no setter. It cannot be reduced to trap holders.'],
                            ['Extend the anti-bot window', 'No — permanently impossible', 'The anti-bot protection ends at a specific block number that was set when the contract was created.'],
                            ['Extend the sell cooldown', 'No — permanently impossible', 'Cooldown can only be reduced or eliminated — never extended after the fact.'],
                            ['Pause all trading', 'No — permanently impossible', 'There is no pause function in the contract.'],
                            ['Reduce or remove the buy tax', 'Yes — allowed', 'Creators can make their token cheaper to buy. This benefits holders.'],
                            ['Reduce or remove the sell cooldown', 'Yes — allowed', 'Creators can make selling easier over time. This benefits holders.'],
                            ['Renounce ownership entirely', 'Yes — allowed', 'The creator can give up all remaining admin rights, making the token fully decentralized.'],
                        ]}
                    />
                    <Note type="tip">Every limitation listed above is enforced by the blockchain itself. It does not matter if the developer claims they would never do something harmful — with a Guardian token, they are physically unable to do it.</Note>

                    <Hr />

                    {/* 8 */}
                    <H2 id="plu-dashboard">PLU Dashboard</H2>
                    <P>PLU stands for Progressive Liquidity Unlock. At <Mono>/plu</Mono>, token creators can lock their liquidity position (the BNB + token pool that enables trading) into a smart contract that releases funds progressively based on how healthy the project is — not on a fixed timer that can be gamed.</P>
                    <P>This matters for both sides. For investors, it means the developer genuinely cannot remove all the liquidity on day 30 even if they want to — the contract will not allow it unless the project earns it. For creators, it is a powerful trust signal that serious projects use to attract investor confidence.</P>

                    <H3>How the unlock system works</H3>
                    <P>Your locked liquidity is divided into milestones. Each milestone unlocks a portion of your LP position after a set number of days — but only if the project passes a health check at that moment. The health check evaluates how your token is actually performing: are prices stable? Is the holder base growing? Is there organic trading volume? Is the developer wallet behaving responsibly?</P>
                    <P>Based on that health score, three things can happen:</P>
                    <Tbl
                        headers={['Health Score', 'Outcome', 'What It Means']}
                        rows={[
                            ['80 or above — Healthy', 'Milestone unlocks normally', 'Your project is performing well. The scheduled LP amount is released to your wallet.'],
                            ['50 to 79 — Caution', 'Milestone delayed by 14 days', 'Something looks off — unusual volume, whale activity, or price instability. The unlock is postponed while the project stabilizes.'],
                            ['Below 50 — Danger', 'All future unlocks frozen indefinitely', 'Critical signals detected — possible coordinated selling, developer activity, or market manipulation. The LP remains locked until manually reviewed.'],
                        ]}
                    />

                    <H3>Dashboard panels explained</H3>
                    <Tbl
                        headers={['Panel', 'What It Shows You']}
                        rows={[
                            ['Your Tokens', 'All tokens you have deployed — select one to load its PLU status'],
                            ['Key Metrics', 'Total LP locked, total unlocked so far, percentage remaining, and milestones completed'],
                            ['Unlock Progress', 'A visual bar showing how much of your LP has been released versus how much is still locked'],
                            ['Milestone Tracker', 'A timeline of each unlock — date, amount, and whether it has completed, is pending, or was blocked'],
                            ['Lock Distribution', 'A breakdown showing unlocked, actively maturing, pending, and freely circulating portions'],
                            ['Unlock Schedule', 'A month-by-month projected chart of when each tranche of liquidity becomes available'],
                        ]}
                    />

                    <Hr />

                    {/* 9 */}
                    <H2 id="amm-dashboard">AMM Dashboard</H2>
                    <P>Before you deploy, it is worth modeling how your token's price and trading mechanics will behave in practice. The AMM Dashboard at <Mono>/amm</Mono> lets you stress-test your configuration against realistic market scenarios with no risk — no token deployed, no money involved.</P>

                    <H3>What you can model</H3>
                    <Tbl
                        headers={['Chart', 'What It Shows', 'How to Use It']}
                        rows={[
                            ['Bonding Curve', 'How the token price changes as trading volume increases — linear growth, exponential growth, or flat pricing', 'Use this to understand whether your token is more like a utility asset (flat) or a speculative asset (exponential). Match this to your audience.'],
                            ['Price Impact', 'How much a single large buy or sell moves the price based on your initial liquidity depth', 'Check this before launch. If a moderate trade moves price by 20%, you need more initial liquidity.'],
                            ['90-Day Scenarios', 'How price might evolve over 90 days under bull, base, and bear market conditions — including pressure from vesting unlocks', 'Run all three scenarios. If the bear case shows price going to zero in week 3, reconsider your sell tax or vesting schedule.'],
                        ]}
                    />
                    <P>Use the AMM dashboard alongside the AI Wizard. Run the wizard first, then plug those values into the AMM dashboard to see if the economics actually make sense before committing to a deployment.</P>

                    <Hr />

                    {/* 10 */}
                    <H2 id="risk-scanner">AI Risk Scanner</H2>
                    <P>The Risk Scanner at <Mono>/scanner</Mono> gives you a complete safety analysis of any BNB Chain token in under 5 seconds. Paste a contract address — any address, any token, even one you found 10 minutes ago — and the scanner fetches live data from the blockchain, runs it through an AI security analysis, and returns a full report.</P>
                    <P>You do not need to connect a wallet. You do not need to know anything about smart contracts or blockchain development. Paste the address and read the result.</P>

                    <H3>What the scanner checks</H3>
                    <Tbl
                        headers={['Dimension', 'What We Analyze', 'What Is a Red Flag']}
                        rows={[
                            ['Contract Code', 'Whether the contract source code is publicly visible, and whether it contains dangerous functions like minting, pausing, or blacklisting', 'Hidden source code, mint functions, pause buttons, blacklist capabilities, or the ability to upgrade the contract after launch'],
                            ['Ownership', 'Who controls the contract — a single wallet, a multi-signature setup, or no one (renounced)', 'A single anonymous wallet owns admin rights with no time locks or limits on what they can do'],
                            ['Liquidity', 'Whether trading liquidity is locked, how deep the pool is, and whether the pool could be drained quickly', 'Unlocked or very small LP that the developer can remove at any time'],
                            ['Holder Distribution', 'How concentrated token ownership is — what percentage the top wallets hold, and whether developer wallets show selling behavior', 'Three or fewer wallets controlling over half the supply, or developer wallets actively offloading tokens'],
                            ['Trading Activity', 'How old the token is, how trading volume is distributed, and whether buy/sell patterns look organic or manipulated', 'A spike in buys followed immediately by collapse in volume, or a sell/buy ratio that suggests mostly exits'],
                        ]}
                    />

                    <H3>The risk report</H3>
                    <P>After scanning, you see a clear written summary from the AI explaining what it found in plain language — no technical jargon. Below that is a score from 0 to 100, a rating label (SAFE, WARNING, or DANGEROUS), a list of specific risk flags, and the five-dimension breakdown above with individual risk levels for each area.</P>

                    <H3>Try a random token</H3>
                    <P>There is a shuffle button next to the address input. Click it and the scanner auto-loads a random token from BNB Chain's currently trending pairs — pulling live market data to pre-fill the address. This is real-time and changes with what is actually trending on the chain. Use it to explore what the scanner is capable of without needing to find an address yourself.</P>

                    <Hr />

                    {/* 11 */}
                    <H2 id="attack-simulator">Attack Simulator</H2>
                    <P>The Attack Simulator at <Mono>/live</Mono> is the most powerful tool on the platform. It lets you simulate three types of aggressive attacks against a live deployed Guardian token and see — in real time — exactly how the contract responds. No gas is spent, no transaction is signed, and no wallet is needed.</P>
                    <AttackFlowDiagram />
                    <P>The simulation does not use guesswork or pattern matching. It sends the exact same instruction a real swap would send, directly to the BNB Chain node, and captures the result. What you see is what would happen if someone actually tried the attack right now.</P>

                    <H3>The three attacks</H3>
                    <Tbl
                        headers={['Attack', 'What It Simulates', 'What Guardian Does']}
                        rows={[
                            ['Whale Attack', 'A single wallet attempts to buy 15% of the entire token supply in one transaction — the classic coordinated price manipulation move', 'The contract blocks the buy. The wallet would exceed the maximum holding limit. You see the exact rejection message returned by the contract.'],
                            ['Bot Attack', 'A wallet that just bought attempts to sell immediately — the behavior pattern of automated sniper bots that buy at launch and dump milliseconds later', 'The contract blocks the sell. The minimum time between trades has not elapsed. Bots cannot flip positions instantly on a Guardian token.'],
                            ['Dump Attack', 'A large holder attempts to sell a significant portion of their position at once — simulating a coordinated market dump', 'The sell is allowed but a tax is deducted. You see the exact output the seller would receive after the tax is applied. Guardian does not block selling — it taxes it and makes it progressively less profitable at scale.'],
                        ]}
                    />

                    <H3>What the Execution Proof means</H3>
                    <P>Below the simulation result is an Execution Proof panel. This confirms that the result came from the actual BNB Chain node — not from our servers, not from a pattern database, and not from a simulated test environment. The proof shows the full call path: starting from the swap router, through the liquidity pool, into the token contract, all the way to the specific check that passed or failed. Any independent developer can replicate this result themselves using the same public blockchain data.</P>

                    <Note type="info">The Attack Simulator works on the Guardian demo token by default. The token address is pre-loaded. You can see the live results change as real trading activity on the testnet updates the contract state.</Note>

                    <Hr />

                    {/* 12 */}
                    <H2 id="guardian-score">Guardian Score</H2>
                    <P>Every token scanned through the platform receives a Guardian Score from 0 to 100. This is a single number summarizing how safe a token is based on live data — not sentiment, not social media, not team claims.</P>
                    <P>The score starts at 100 and deductions are applied for each risk factor detected. No risk factors means a score of 100. Every additional red flag reduces the score by a weighted amount depending on how severe that flag is.</P>

                    <H3>What causes deductions</H3>
                    <Tbl
                        headers={['Risk Factor', 'Severity', 'Why It Matters']}
                        rows={[
                            ['Contract source code is hidden', 'Very high — 30 points', 'If you cannot read the code, you cannot verify it is safe. Unverified contracts should always be treated with maximum suspicion.'],
                            ['Owner can create new tokens (mint)', 'Very high — 25 points', 'A developer who can print unlimited tokens can destroy your investment instantly by inflating supply to zero value.'],
                            ['Sell tax above 10%', 'Very high — 25 points', 'Taxes above 10% make selling so expensive that in practice you often cannot exit. This is a common honeypot pattern.'],
                            ['Owner can pause all trading', 'High — 20 points', 'A pause button means the developer can freeze every wallet\'s ability to sell at any time. Classic trap mechanism.'],
                            ['Buy tax above 10%', 'High — 20 points', 'Extremely high buy taxes combined with sell restrictions are a hallmark of predatory token design.'],
                            ['Contract is upgradeable (proxy)', 'Moderate — 15 points', 'An upgradeable contract means the rules can change after you buy. The safety guarantees you saw at purchase may not exist tomorrow.'],
                            ['Tax can be increased after launch', 'Moderate — 15 points', 'If the developer can raise taxes after the token is live, they can turn a 2% tax into a 99% tax — effectively making your tokens worthless to sell.'],
                            ['Buy or sell tax between 5–10%', 'Moderate — 10 points', 'Not automatically dangerous, but meaningfully expensive. At 10% sell tax you lose 10 cents per dollar on exit.'],
                            ['No sell cooldown', 'Low — 10 points', 'Tokens without any sell cooldown are easier targets for automated bot manipulation.'],
                            ['No wallet holding limit', 'Low — 10 points', 'Without a cap on how much one wallet can hold, a single entity can accumulate a controlling position and dump it.'],
                        ]}
                    />

                    <H3>Score tiers</H3>
                    <Tbl
                        headers={['Score', 'Tier', 'What It Means for You']}
                        rows={[
                            ['90–100', 'Guardian Protected', 'No meaningful risk factors detected. This does not guarantee profit or project success — but the contract mechanics are clean.'],
                            ['70–89', 'Moderate Risk', 'Some risk flags are present. Investigate further — check LP lock status, team wallet behavior, and community credibility before committing.'],
                            ['50–69', 'High Risk', 'Multiple red flags. This token carries significant danger of partial or total loss. Only proceed with thorough independent research.'],
                            ['0–49', 'Danger / Likely Scam', 'Critical risk factors detected. This token shows strong signals of intentional harm — honeypot mechanics, hidden owner control, or active manipulation.'],
                        ]}
                    />
                    <Note type="warn">A high Guardian Score does not mean a token will increase in value or that the project will succeed. The score measures contract safety and risk mechanics only — not market performance, team reputation, or product quality.</Note>

                    <Hr />

                    {/* 13 */}
                    <H2 id="glossary">Glossary</H2>
                    <Tbl
                        headers={['Term', 'Plain English Definition']}
                        rows={[
                            ['PLU', 'Progressive Liquidity Unlock — a system where your locked LP funds are released based on your project\'s health, not just time passing'],
                            ['Guardian Token', 'A BEP-20 token deployed through this platform — with all safety rules written into the contract, not just promised by the team'],
                            ['Rug Pull', 'A scam where the developer removes all trading liquidity after investors buy in, collapsing the price to zero instantly'],
                            ['Honeypot', 'A token that lets you buy freely but silently blocks all sells — your balance shows tokens but you can never convert them back to BNB'],
                            ['AMM', 'Automated Market Maker — the system PancakeSwap uses to set prices based on how much of each token is in the liquidity pool'],
                            ['LP / Liquidity', 'The pool of BNB and tokens that makes trading possible. More liquidity = less price impact per trade.'],
                            ['LP Token', 'A special token you receive when you add liquidity — it represents your share of the pool and is what gets locked in the PLU system'],
                            ['Sell Cooldown', 'A time limit between sells for each wallet — prevents bots from making dozens of rapid trades to manipulate prices'],
                            ['Anti-Whale Limit', 'A cap on how many tokens any single wallet can hold — prevents one entity from controlling the market'],
                            ['Anti-Bot Window', 'A short period at launch (a few seconds) where only the deployer can trade — blocks automated bots from sniping the launch'],
                            ['Basis Points (bps)', 'A unit for tax rates — 100 bps equals 1%. A 2% tax is 200 bps. 1 bps is 0.01%.'],
                            ['Vesting', 'A schedule that controls when tokens are released — for example, a team allocation that unlocks gradually over 24 months prevents immediate selling by insiders'],
                            ['TGE', 'Token Generation Event — the moment a token launches and initial allocations are distributed according to the vesting schedule'],
                            ['BscScan', 'The public blockchain explorer for BNB Chain — where anyone can verify a contract\'s source code, transactions, and owner wallet activity'],
                            ['DEX', 'Decentralized Exchange — a trading platform like PancakeSwap that runs on the blockchain with no central company operating it'],
                            ['Guardian Score', 'A 0–100 safety rating computed from live on-chain data — higher is safer, based on what the contract actually does, not what the team claims'],
                        ]}
                    />

                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-[13px] text-gray-400 dark:text-gray-500 font-mono">// "We ask the chain what would happen before you sign."</p>
                        <p className="text-[12px] text-gray-300 dark:text-gray-700 mt-3">Built for BNB Chain Hackathon Bangalore 2026</p>
                        <div className="flex gap-3 mt-4">
                            <Link href="/scanner" className="text-[14px] text-cyan-500 hover:text-cyan-400 transition-colors">Try the Scanner</Link>
                            <span className="text-gray-300 dark:text-gray-700">·</span>
                            <Link href="/create" className="text-[14px] text-cyan-500 hover:text-cyan-400 transition-colors">Launch a Token</Link>
                            <span className="text-gray-300 dark:text-gray-700">·</span>
                            <Link href="/live" className="text-[14px] text-cyan-500 hover:text-cyan-400 transition-colors">Attack Simulator</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
