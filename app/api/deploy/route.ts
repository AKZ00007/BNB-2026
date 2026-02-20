import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/deploy
 * Called by DeployFlow AFTER the tx is mined on BSC Testnet.
 * The client sends the real contractAddress + txHash returned by wagmi.
 * We update the saved_configs row to status='testnet'.
 */
export async function POST(request: Request) {
    try {
        const { configId, walletAddress, contractAddress, txHash } = await request.json() as {
            configId: string;
            walletAddress?: string;
            contractAddress?: string;
            txHash?: string;
        };

        if (!configId) {
            return NextResponse.json({ error: 'Missing configId' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, serviceKey);

        const { error } = await supabase
            .from('saved_configs')
            .update({
                status: 'testnet',
                testnet_address: contractAddress || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', configId);

        if (error) {
            console.error('[/api/deploy] Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            contractAddress,
            txHash,
            explorerUrl: contractAddress
                ? `https://testnet.bscscan.com/address/${contractAddress}`
                : null,
        });
    } catch (error) {
        console.error('[/api/deploy] Error:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Deploy registration failed' },
            { status: 500 }
        );
    }
}
