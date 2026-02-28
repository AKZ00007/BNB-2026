import { NextResponse } from 'next/server';
import { rankAirdropWallets, WalletAirdropStats } from '@/lib/gemini';

// Mock data demonstrating different wallet archetypes for the hackathon demo.
// In a production environment, this data would be fetched dynamically from BscScan.
const MOCK_WALLET_STATS: WalletAirdropStats[] = [
    {
        address: '0x1A2b3C4d5E6f7g8H9i0J1k2L3m4N5o6P7q8R9s0T',
        holdingDays: 45,
        balancePercent: 2.5,
        sellFrequency: 0,
        buyDuringDips: 3,
    },
    {
        address: '0x9S8r7Q6p5O4n3M2l1K0j9I8h7G6f5E4d3C2b1A0',
        holdingDays: 42,
        balancePercent: 1.2,
        sellFrequency: 1,
        buyDuringDips: 1,
    },
    {
        address: '0xZ1y2X3w4V5u6T7s8R9q0P1o2N3m4L5k6J7i8H9g',
        holdingDays: 5,
        balancePercent: 0.8,
        sellFrequency: 12,
        buyDuringDips: 0,
    },
    // Sybil Farmer Ring Demonstration (Identical patterns, funded by same source)
    {
        address: '0xSybil11111111111111111111111111111111111',
        holdingDays: 2,
        balancePercent: 0.5,
        sellFrequency: 0,
        buyDuringDips: 0,
        fundedBy: '0xFunderWallet999',
    },
    {
        address: '0xSybil22222222222222222222222222222222222',
        holdingDays: 2,
        balancePercent: 0.5,
        sellFrequency: 0,
        buyDuringDips: 0,
        fundedBy: '0xFunderWallet999',
    },
    {
        address: '0xSybil33333333333333333333333333333333333',
        holdingDays: 2,
        balancePercent: 0.5,
        sellFrequency: 0,
        buyDuringDips: 0,
        fundedBy: '0xFunderWallet999',
    }
];

export async function POST(req: Request) {
    try {
        // 1. In production, we would parse req and fetch from BscScan here.
        // For the hackathon demo, we use the curated mock data to guarantee a fast, 
        // impressive demonstration of Groq's classification abilities.

        // 2. Send the raw behavioral data to Groq for classification and Sybil detection
        const aiAnalysis = await rankAirdropWallets(MOCK_WALLET_STATS);

        // 3. Return the enriched, classified data to the frontend
        return NextResponse.json({
            success: true,
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
