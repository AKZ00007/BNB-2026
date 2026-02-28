import { NextResponse } from 'next/server';
import { rankAirdropWallets, WalletAirdropStats } from '@/lib/gemini';
import { GUARDIAN_TOKEN_ADDRESS } from '@/lib/contracts/guardian-token';

// Curated mock wallets that demonstrate every classification tier + Sybil detection.
// Used as fallback when BscScan API is unavailable (testnet API deprecated).
const DEMO_WALLET_STATS: WalletAirdropStats[] = [
    {
        address: '0x1cc2BC2DcCa9c51f83590463FC56DFf57F494E11',
        holdingDays: 45,
        balancePercent: 32.5,
        sellFrequency: 0,
        buyDuringDips: 4,
    },
    {
        address: '0xAe13d989daC2f0debf460ac112a837C89BAa7cd7',
        holdingDays: 30,
        balancePercent: 18.2,
        sellFrequency: 1,
        buyDuringDips: 2,
    },
    {
        address: '0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47',
        holdingDays: 12,
        balancePercent: 8.1,
        sellFrequency: 6,
        buyDuringDips: 0,
    },
    {
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        holdingDays: 22,
        balancePercent: 14.7,
        sellFrequency: 2,
        buyDuringDips: 1,
    },
    // Sybil Farmer Ring — Identical patterns, funded by same source
    {
        address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        holdingDays: 2,
        balancePercent: 3.5,
        sellFrequency: 0,
        buyDuringDips: 0,
        fundedBy: '0xBadActorFunder999999999999999999999999',
    },
    {
        address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
        holdingDays: 2,
        balancePercent: 3.5,
        sellFrequency: 0,
        buyDuringDips: 0,
        fundedBy: '0xBadActorFunder999999999999999999999999',
    },
    {
        address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
        holdingDays: 2,
        balancePercent: 3.5,
        sellFrequency: 0,
        buyDuringDips: 0,
        fundedBy: '0xBadActorFunder999999999999999999999999',
    },
];

async function fetchLiveWallets(apiKey: string): Promise<WalletAirdropStats[] | null> {
    try {
        // Etherscan V2 unified API — chainid 97 = BSC Testnet
        const url = `https://api.etherscan.io/v2/api?chainid=97&module=account&action=tokentx&contractaddress=${GUARDIAN_TOKEN_ADDRESS}&page=1&offset=150&sort=desc&apikey=${apiKey}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        const data = await res.json();

        if (data.status !== '1' || !Array.isArray(data.result) || data.result.length === 0) {
            return null; // API unavailable or no data
        }

        const txs: any[] = data.result;
        const walletMap = new Map<string, WalletAirdropStats>();
        const now = Math.floor(Date.now() / 1000);

        for (const tx of txs) {
            const from = tx.from.toLowerCase();
            const to = tx.to.toLowerCase();
            const value = parseFloat(tx.value) / (10 ** parseInt(tx.tokenDecimal));
            const timeStamp = parseInt(tx.timeStamp);

            if (from === '0x0000000000000000000000000000000000000000' || to === '0x0000000000000000000000000000000000000000') continue;
            if (from === '0xd99d1c33f9fc3444f8101754abc46c52416550d1' || to === '0xd99d1c33f9fc3444f8101754abc46c52416550d1') continue;

            if (!walletMap.has(to)) {
                walletMap.set(to, { address: to, holdingDays: 0, balancePercent: 0, sellFrequency: 0, buyDuringDips: 0, fundedBy: from });
            }
            const receiver = walletMap.get(to)!;
            receiver.balancePercent += value;
            receiver.buyDuringDips += 1;
            const daysAgo = (now - timeStamp) / 86400;
            if (receiver.holdingDays === 0 || daysAgo > receiver.holdingDays) {
                receiver.holdingDays = Math.floor(daysAgo);
            }

            if (walletMap.has(from)) {
                const sender = walletMap.get(from)!;
                sender.balancePercent -= value;
                sender.sellFrequency += 1;
            }
        }

        const liveWallets = Array.from(walletMap.values())
            .filter(w => w.balancePercent > 0)
            .sort((a, b) => b.balancePercent - a.balancePercent)
            .slice(0, 10);

        if (liveWallets.length === 0) return null;

        const totalSampleBalance = liveWallets.reduce((sum, w) => sum + w.balancePercent, 0);
        liveWallets.forEach(w => {
            w.balancePercent = parseFloat(((w.balancePercent / totalSampleBalance) * 100).toFixed(2));
        });

        return liveWallets;
    } catch {
        return null; // Network/timeout error — fall back to demo data
    }
}

export async function POST(req: Request) {
    try {
        const apiKey = process.env.BSCSCAN_API_KEY || '';

        // Try live BscScan data first, fall back to demo wallets if API is unavailable
        let wallets: WalletAirdropStats[];
        let source: 'live' | 'demo';

        const liveWallets = apiKey ? await fetchLiveWallets(apiKey) : null;

        if (liveWallets) {
            wallets = liveWallets;
            source = 'live';
        } else {
            wallets = DEMO_WALLET_STATS;
            source = 'demo';
        }

        // Send behavioral data to Groq for AI classification + Sybil detection
        const aiAnalysis = await rankAirdropWallets(wallets);

        return NextResponse.json({
            success: true,
            source,
            data: aiAnalysis,
        });

    } catch (error: any) {
        console.error('Airdrop AI Analysis Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to analyze wallets' },
            { status: 500 }
        );
    }
}
