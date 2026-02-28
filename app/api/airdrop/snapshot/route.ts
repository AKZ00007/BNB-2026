import { NextResponse } from 'next/server';
import { rankAirdropWallets, WalletAirdropStats } from '@/lib/gemini';
import { GUARDIAN_TOKEN_ADDRESS } from '@/lib/contracts/guardian-token';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.BSCSCAN_API_KEY;
        if (!apiKey) {
            throw new Error('BSCSCAN_API_KEY is missing from .env.local');
        }

        // 1. Fetch live transfer events for the Guardian Testnet Token (Limit 100 for speed)
        const url = `https://api-testnet.bscscan.com/api?module=account&action=tokentx&contractaddress=${GUARDIAN_TOKEN_ADDRESS}&page=1&offset=150&sort=desc&apikey=${apiKey}`;
        const bscRes = await fetch(url);
        const bscData = await bscRes.json();

        if (bscData.status !== '1' || !bscData.result) {
            throw new Error(bscData.result || 'Failed to fetch BscScan data');
        }

        const txs: any[] = bscData.result;

        // 2. Aggregate transactions to calculate wallet behavioral statistics
        const walletMap = new Map<string, WalletAirdropStats>();
        const now = Math.floor(Date.now() / 1000);

        for (const tx of txs) {
            const from = tx.from.toLowerCase();
            const to = tx.to.toLowerCase();
            const value = parseFloat(tx.value) / (10 ** parseInt(tx.tokenDecimal));
            const timeStamp = parseInt(tx.timeStamp);

            // Skip zero address (minting/burning)
            if (from === '0x0000000000000000000000000000000000000000' || to === '0x0000000000000000000000000000000000000000') continue;
            // Skip automated LP pairs/routers for individual airdrops
            if (from === '0xd99d1c33f9fc3444f8101754abc46c52416550d1'.toLowerCase() || to === '0xd99d1c33f9fc3444f8101754abc46c52416550d1'.toLowerCase()) continue;

            // Track Receiver (Buyer/Holder)
            if (!walletMap.has(to)) {
                walletMap.set(to, {
                    address: to,
                    holdingDays: 0,
                    balancePercent: 0,
                    sellFrequency: 0,
                    buyDuringDips: 0,
                    fundedBy: from // Track initial funder for Sybil detection
                });
            }

            const receiver = walletMap.get(to)!;
            receiver.balancePercent += value; // Rough balance proxy
            receiver.buyDuringDips += 1;

            // Calculate holding days (using oldest receive tx)
            const daysAgo = (now - timeStamp) / 86400;
            if (receiver.holdingDays === 0 || daysAgo > receiver.holdingDays) {
                receiver.holdingDays = Math.floor(daysAgo);
            }

            // Track Sender (Seller)
            if (walletMap.has(from)) {
                const sender = walletMap.get(from)!;
                sender.balancePercent -= value;
                sender.sellFrequency += 1;
            }
        }

        // 3. Filter to active wallets that still have a balance, limit to 10 for AI speed
        const liveWallets = Array.from(walletMap.values())
            .filter(w => w.balancePercent > 0)
            .sort((a, b) => b.balancePercent - a.balancePercent)
            .slice(0, 10);

        // Normalize balances to percentages (relative to this top 10 pool)
        const totalSampleBalance = liveWallets.reduce((sum, w) => sum + w.balancePercent, 0);
        liveWallets.forEach(w => {
            w.balancePercent = parseFloat(((w.balancePercent / totalSampleBalance) * 100).toFixed(2));
        });

        // 4. Send the completely authentic, live on-chain behavioral data to Groq for classification
        const aiAnalysis = await rankAirdropWallets(liveWallets);

        // 5. Return the enriched, classified data to the frontend
        return NextResponse.json({
            success: true,
            data: aiAnalysis,
        });

    } catch (error: any) {
        console.error('Airdrop AI Analysis Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to analyze live wallets' },
            { status: 500 }
        );
    }
}
