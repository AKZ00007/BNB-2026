import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const ETH_ADDR_RE = /^0x[a-fA-F0-9]{40}$/;

/**
 * GET /api/launchpads?wallet=0x...
 * Returns all launchpads created by this wallet.
 *
 * GET /api/launchpads?id=uuid
 * Returns a single launchpad by ID.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const wallet = searchParams.get('wallet');
        const id = searchParams.get('id');

        const supabase = getSupabaseAdmin();

        // ── Single launchpad by ID ────────────────────────────────────────────
        if (id) {
            const { data, error } = await supabase
                .from('launchpads')
                .select(`
                    id, token_name, token_symbol, total_supply, hardcap, softcap,
                    min_contribution, max_contribution, start_time, end_time, status,
                    contract_address, token_address, config, amm_config, plu_config,
                    category, description, created_at, updated_at
                `)
                .eq('id', id)
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 404 });
            return NextResponse.json({ success: true, launchpad: data });
        }

        // ── All launchpads for a wallet ────────────────────────────────────────
        if (!wallet || !ETH_ADDR_RE.test(wallet)) {
            return NextResponse.json(
                { error: 'Valid wallet address or launchpad id required' },
                { status: 400 }
            );
        }

        // Look up user ID
        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('wallet_address', wallet.toLowerCase())
            .single();

        if (!user) {
            return NextResponse.json({ success: true, launchpads: [] });
        }

        const { data, error } = await supabase
            .from('launchpads')
            .select(`
                id, token_name, token_symbol, total_supply, status,
                contract_address, category, created_at
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, launchpads: data });
    } catch (error) {
        console.error('[/api/launchpads] Error:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to fetch launchpads' },
            { status: 500 }
        );
    }
}
