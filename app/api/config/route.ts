import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { TokenConfig } from '@/types/config';

/**
 * POST /api/config
 * Saves a generated TokenConfig to Supabase saved_configs table.
 * Body: { config: TokenConfig, walletAddress: string }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { config, walletAddress } = body as {
            config: TokenConfig;
            walletAddress?: string;
        };

        if (!config || !config.tokenName) {
            return NextResponse.json({ error: 'Missing config' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, serviceKey);

        // If wallet address provided, upsert user row first
        if (walletAddress) {
            await supabase
                .from('users')
                .upsert({ wallet_address: walletAddress.toLowerCase() }, { onConflict: 'wallet_address' });
        }

        // Insert saved config
        const { data, error } = await supabase
            .from('saved_configs')
            .insert({
                wallet_address: walletAddress?.toLowerCase() || 'anonymous',
                config: config as unknown as Record<string, unknown>,
                status: 'saved',
            })
            .select('id')
            .single();

        if (error) {
            console.error('[/api/config] Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data.id });
    } catch (error) {
        console.error('[/api/config] Error:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to save config' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/config?wallet=0x...   → list configs for a wallet
 * GET /api/config?id=uuid        → fetch single config by ID
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const wallet = searchParams.get('wallet');
        const id = searchParams.get('id');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, serviceKey);

        // Fetch single config by ID
        if (id) {
            const { data, error } = await supabase
                .from('saved_configs')
                .select('id, config, status, wallet_address, testnet_address, created_at')
                .eq('id', id)
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 404 });
            return NextResponse.json({ success: true, config: data });
        }

        // Fetch all configs for a wallet
        if (!wallet) {
            return NextResponse.json({ error: 'wallet or id query param required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('saved_configs')
            .select('id, config, status, testnet_address, created_at')
            .eq('wallet_address', wallet.toLowerCase())
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, configs: data });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
