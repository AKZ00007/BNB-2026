import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { analyzeTokenRisk } from '@/lib/gemini';
import { ethers } from 'ethers';

// Requires a server wallet to act as the Oracle
const ORACLE_PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { launchpadId, milestoneIndex } = body;

        if (!launchpadId) {
            return NextResponse.json({ error: 'launchpadId is required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // 1. Fetch lock data
        const { data: lock, error } = await supabase
            .from('plu_locks')
            .select('*')
            .eq('launchpad_id', launchpadId)
            .single();

        if (error || !lock) {
            return NextResponse.json({ error: 'PLU lock not found' }, { status: 404 });
        }

        // 2. Fetch token info to get the contract address
        const { data: lp } = await supabase
            .from('launchpads')
            .select('contract_address')
            .eq('id', launchpadId)
            .single();

        const tokenAddress = lp?.contract_address;
        if (!tokenAddress) {
            return NextResponse.json({ error: 'Token address not found' }, { status: 400 });
        }

        // 3. Compute real-time health score (simplified simulation for MVP)
        // In production, this would call BscScan + DexScreener + Groq for a real-time health score.
        // For the hackathon demo, we simulate a score based on age.
        const lockAge = Date.now() - new Date(lock.created_at).getTime();
        const daysSinceLock = lockAge / 86400000;

        // Base score 60. Add points for age up to 30. Add random noise.
        const simulatedScore = Math.max(0, Math.min(100, Math.round(60 + Math.min(daysSinceLock * 2, 30) + (Math.random() * 10 - 5))));

        // 4. Generate Oracle Signature (EIP-191 / personal_sign)
        // Message hash matching Solidity: keccak256(abi.encodePacked(projectToken, milestoneIndex, healthScore))
        const wallet = new ethers.Wallet(ORACLE_PRIVATE_KEY);

        // Use ethers.solidityPackedKeccak256 for exact match with smart contract abi.encodePacked
        const messageHash = ethers.solidityPackedKeccak256(
            ['address', 'uint256', 'uint256'],
            [tokenAddress, milestoneIndex, simulatedScore]
        );

        // Sign the pre-hashed message bytes
        const signature = await wallet.signMessage(ethers.getBytes(messageHash));

        // Let's determine human readable status so UI can react
        let status = 'DANGER';
        if (simulatedScore >= 80) status = 'HEALTHY';
        else if (simulatedScore >= 50) status = 'CAUTION';

        return NextResponse.json({
            success: true,
            projectToken: tokenAddress,
            milestoneIndex,
            healthScore: simulatedScore,
            status,
            signature, // The frontend will pass this `signature` into the `processUnlock` contract call
            oracleAddress: wallet.address
        });

    } catch (e: any) {
        console.error('[/api/plu/sign] Oracle error:', e);
        return NextResponse.json({ error: 'Oracle signature generation failed', details: e.message }, { status: 500 });
    }
}
