/**
 * GET /api/live
 *
 * Server-Sent Events (SSE) endpoint — the "Guardian Watcher" simulation.
 * Streams realistic on-chain monitoring events to the frontend in real-time.
 *
 * The frontend connects via `new EventSource('/api/live')` and receives
 * JSON events every 3–8 seconds simulating BNB Chain activity.
 *
 * Event types match the PRD Section 6.2:
 * - whale_activity   (MEDIUM)
 * - dev_wallet       (HIGH)
 * - lp_removal       (CRITICAL)
 * - price_drop       (HIGH)
 * - volume_anomaly   (MEDIUM)
 * - holder_flight    (HIGH)
 * - guardian_action   (INFO — for Control Layer tokens)
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ─── Realistic Mock Data ──────────────────────────────────────────────────────

const MOCK_TOKENS = [
    { address: '0x7f3d...a1c9', name: 'NeuralChain', symbol: 'NRCH', isGuardian: true },
    { address: '0xc4e2...b3f7', name: 'DataVault', symbol: 'DVT', isGuardian: true },
    { address: '0x91ab...d4e8', name: 'MoonRocket', symbol: 'MOON', isGuardian: false },
    { address: '0x5f8c...e2a1', name: 'SafeYield', symbol: 'SYD', isGuardian: false },
    { address: '0xa3d7...f9b2', name: 'ComputeMesh', symbol: 'CMSH', isGuardian: true },
    { address: '0xe1f4...c6d3', name: 'MemeFarm', symbol: 'MFARM', isGuardian: false },
];

const WALLETS = [
    '0x7f3d...a1c9', '0x4b2e...8f3a', '0x9c1d...2e7b', '0x3a5f...c4d2',
    '0x6e8b...1f9c', '0x2d7a...5e3f', '0xf1c4...8b2d', '0x8a3e...6d1f',
];

interface MonitorEvent {
    id: string;
    timestamp: string;
    type: string;
    severity: 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    token: typeof MOCK_TOKENS[0];
    title: string;
    description: string;
    aiTranslation: string;
    wallet?: string;
    value?: string;
    contractAction?: string;
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateEvent(): MonitorEvent {
    const token = randomItem(MOCK_TOKENS);
    const wallet = randomItem(WALLETS);
    const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = new Date().toISOString();

    const eventGenerators: Array<() => MonitorEvent> = [
        // ── Whale Activity (MEDIUM) ───────────────────────────────────────────
        () => {
            const pct = randomBetween(5, 15);
            const amount = Math.round(pct * 10000);
            return {
                id, timestamp, type: 'whale_activity', severity: 'MEDIUM', token,
                title: `Whale Accumulating ${token.symbol}`,
                description: `Wallet ${wallet} acquired ${amount.toLocaleString()} ${token.symbol} (${pct}% of supply) in the last hour.`,
                aiTranslation: `A large wallet just accumulated ${pct}% of ${token.name}'s total supply. This could indicate a major buy-in or a setup for a coordinated dump. Monitor closely.`,
                wallet, value: `${pct}%`,
            };
        },

        // ── Dev Wallet Sell (HIGH) ────────────────────────────────────────────
        () => {
            const pct = randomBetween(8, 40);
            return {
                id, timestamp, type: 'dev_wallet', severity: 'HIGH', token,
                title: `Dev Wallet Selling ${token.symbol}`,
                description: `Known deployer wallet sold ${pct}% of their holdings in 2 minutes.`,
                aiTranslation: `The developer behind ${token.name} just sold ${pct}% of their tokens. This is a strong warning signal — developers selling large amounts often precede a rug pull.`,
                wallet, value: `${pct}%`,
                contractAction: token.isGuardian ? 'Sell cooldown increased to 5 minutes' : undefined,
            };
        },

        // ── LP Removal (CRITICAL) ─────────────────────────────────────────────
        () => ({
            id, timestamp, type: 'lp_removal', severity: 'CRITICAL', token,
            title: `LP Removal Detected — ${token.symbol}`,
            description: `LP tokens transferred from deployer wallet to an unknown address.`,
            aiTranslation: `The developer is removing liquidity from ${token.name}'s trading pool. This is the #1 indicator of an imminent rug pull. If you hold this token, consider exiting immediately.`,
            wallet, value: 'LP transfer detected',
            contractAction: token.isGuardian ? 'PLU freeze activated — LP withdrawals blocked' : undefined,
        }),

        // ── Price Drop (HIGH) ─────────────────────────────────────────────────
        () => {
            const drop = randomBetween(30, 65);
            return {
                id, timestamp, type: 'price_drop', severity: 'HIGH', token,
                title: `${token.symbol} Price Crashed ${drop}%`,
                description: `Price dropped ${drop}% in under 10 minutes. Cascade selling detected.`,
                aiTranslation: `${token.name} just lost ${drop}% of its value in minutes. This pattern matches coordinated dumping — multiple wallets selling simultaneously. Extreme caution advised.`,
                value: `-${drop}%`,
                contractAction: token.isGuardian ? 'Emergency sell restriction activated' : undefined,
            };
        },

        // ── Volume Anomaly (MEDIUM) ───────────────────────────────────────────
        () => {
            const multiplier = Math.round(randomBetween(5, 20));
            return {
                id, timestamp, type: 'volume_anomaly', severity: 'MEDIUM', token,
                title: `${multiplier}x Volume Spike on ${token.symbol}`,
                description: `Trading volume surged to ${multiplier}x normal levels in the last 30 minutes.`,
                aiTranslation: `${token.name} is seeing unusual trading activity — volume is ${multiplier}x higher than normal. This could be organic hype, or it could be wash trading to create fake demand before a dump.`,
                value: `${multiplier}x normal`,
            };
        },

        // ── Holder Flight (HIGH) ──────────────────────────────────────────────
        () => {
            const count = Math.round(randomBetween(3, 8));
            return {
                id, timestamp, type: 'holder_flight', severity: 'HIGH', token,
                title: `Top Holders Exiting ${token.symbol}`,
                description: `${count} of the top 10 holders reduced positions by 50%+ in the last hour.`,
                aiTranslation: `Smart money is leaving ${token.name}. When multiple large holders sell simultaneously, it's usually because they know something others don't. This is a strong sell signal.`,
                value: `${count}/10 top holders selling`,
            };
        },

        // ── Guardian Contract Action (INFO) ───────────────────────────────────
        () => {
            const actions = [
                { action: 'Anti-sniper bot activated — 3 block cooldown enforced', detail: 'Same-block buy+sell pattern detected from 4 wallets' },
                { action: 'Max sell reduced to 0.5% per TX', detail: 'Cascade sell threshold exceeded (>5% in 5 min)' },
                { action: 'Sell cooldown set to 5 minutes per wallet', detail: '3+ sells detected in same block' },
                { action: 'Wallet restricted for 30 minutes', detail: 'Buy+sell within 2 blocks (sniper pattern)' },
            ];
            const a = randomItem(actions);
            return {
                id, timestamp, type: 'guardian_action', severity: 'INFO',
                token: { ...randomItem(MOCK_TOKENS.filter(t => t.isGuardian)), isGuardian: true },
                title: `Guardian Protection Triggered`,
                description: a.detail,
                aiTranslation: `GuardianLaunch's on-chain protection system automatically responded to suspicious activity. Action taken: ${a.action}. No manual intervention required.`,
                contractAction: a.action,
            };
        },
    ];

    return randomItem(eventGenerators)();
}

// ─── SSE Handler ──────────────────────────────────────────────────────────────

export async function GET() {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            // Send initial connection event
            const welcome = {
                type: 'connected',
                message: 'GuardianLaunch Watcher connected. Monitoring BNB Chain events...',
                monitoredTokens: MOCK_TOKENS.length,
                timestamp: new Date().toISOString(),
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(welcome)}\n\n`));

            // Stream events at random intervals (3–8 seconds)
            let running = true;
            const maxRun = 5 * 60 * 1000; // 5 minutes max per connection
            const startTime = Date.now();

            const sendEvent = () => {
                if (!running || Date.now() - startTime > maxRun) {
                    controller.close();
                    return;
                }

                try {
                    const event = generateEvent();
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
                    );
                } catch {
                    // Ignore encoding errors
                }

                // Schedule next event at a random interval
                const delay = 3000 + Math.random() * 5000; // 3–8 seconds
                setTimeout(sendEvent, delay);
            };

            // Start after a short initial delay
            setTimeout(sendEvent, 1500);
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
