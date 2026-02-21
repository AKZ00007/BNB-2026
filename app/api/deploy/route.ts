import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// ─── Validation Helpers ───────────────────────────────────────────────────────

const ETH_ADDR_RE = /^0x[a-fA-F0-9]{40}$/;
const TX_HASH_RE = /^0x[a-fA-F0-9]{64}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sanitize(s: unknown): string {
    if (typeof s !== 'string') return '';
    // Strip any HTML/script tags
    return s.replace(/<[^>]*>/g, '').trim();
}

/**
 * POST /api/deploy
 * Called by DeployFlow AFTER the tx is mined on BSC Testnet.
 * 1. Updates saved_configs status → 'testnet'
 * 2. Creates a launchpad row for tracking
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const configId = sanitize(body.configId);
        const walletAddress = sanitize(body.walletAddress);
        const contractAddress = sanitize(body.contractAddress);
        const txHash = sanitize(body.txHash);

        // ── Input Validation ──────────────────────────────────────────────────
        if (!configId || !UUID_RE.test(configId)) {
            return NextResponse.json({ error: 'Invalid or missing configId (UUID expected)' }, { status: 400 });
        }
        if (!walletAddress || !ETH_ADDR_RE.test(walletAddress)) {
            return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
        }
        if (!contractAddress || !ETH_ADDR_RE.test(contractAddress)) {
            return NextResponse.json({ error: 'Invalid contract address' }, { status: 400 });
        }
        if (!txHash || !TX_HASH_RE.test(txHash)) {
            return NextResponse.json({ error: 'Invalid transaction hash' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // ── 1. Fetch the saved config ─────────────────────────────────────────
        const { data: savedConfig, error: fetchErr } = await supabase
            .from('saved_configs')
            .select('id, config, wallet_address')
            .eq('id', configId)
            .single();

        if (fetchErr || !savedConfig) {
            return NextResponse.json(
                { error: 'Config not found. Save your config before deploying.' },
                { status: 404 }
            );
        }

        const config = savedConfig.config as Record<string, unknown>;

        // ── 2. Update saved_configs → testnet ─────────────────────────────────
        const { error: updateErr } = await supabase
            .from('saved_configs')
            .update({
                status: 'testnet',
                testnet_address: contractAddress,
                updated_at: new Date().toISOString(),
            })
            .eq('id', configId);

        if (updateErr) {
            console.error('[/api/deploy] saved_configs update error:', updateErr);
            return NextResponse.json({ error: updateErr.message }, { status: 500 });
        }

        // ── 3. Upsert user row ────────────────────────────────────────────────
        await supabase
            .from('users')
            .upsert(
                { wallet_address: walletAddress.toLowerCase() },
                { onConflict: 'wallet_address' }
            );

        // Get user ID for the launchpad FK
        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('wallet_address', walletAddress.toLowerCase())
            .single();

        // ── 4. Create launchpad entry ─────────────────────────────────────────
        const tokenName = (config.tokenName as string) || 'Unnamed Token';
        const tokenSymbol = (config.tokenSymbol as string) || 'TKN';
        const totalSupply = Number(config.totalSupply) || 1_000_000;
        const hardCap = Number(config.hardCapBnb) || 100;
        const softCap = Number(config.softCapBnb) || 50;

        const { data: launchpad, error: lpErr } = await supabase
            .from('launchpads')
            .insert({
                user_id: userData?.id || null,
                token_name: tokenName,
                token_symbol: tokenSymbol,
                total_supply: totalSupply,
                hardcap: hardCap,
                softcap: softCap,
                min_contribution: 0.01,
                max_contribution: hardCap * 0.1,
                start_time: new Date().toISOString(),
                end_time: new Date(Date.now() + 7 * 86400000).toISOString(), // +7 days
                status: 'active',
                contract_address: contractAddress,
                token_address: contractAddress,
                config: config,
                amm_config: (config.amm as Record<string, unknown>) || null,
                plu_config: (config.plu as Record<string, unknown>) || null,
                category: (config.category as string) || 'general',
                description: (config.description as string) || '',
            })
            .select('id')
            .single();

        if (lpErr) {
            console.error('[/api/deploy] launchpads insert error:', lpErr);
            // Non-fatal — config was already updated
        }

        // ── 5. Auto-initialize PLU lock if config has PLU ─────────────────────
        const pluConfig = config.plu as { totalLockPercent?: number; milestones?: unknown[] } | undefined;
        if (launchpad?.id && pluConfig?.totalLockPercent) {
            const milestones = (pluConfig.milestones || []) as Array<{
                percent: number;
                afterDays: number;
                condition: string;
            }>;

            const unlockSchedule = milestones.map((m) => ({
                percent: m.percent,
                date: new Date(Date.now() + m.afterDays * 86400000).toISOString(),
                milestone_type: 'health',
                condition: m.condition,
            }));

            const firstUnlock = unlockSchedule.length > 0
                ? unlockSchedule[0].date
                : new Date(Date.now() + 30 * 86400000).toISOString();

            await supabase.from('plu_locks').insert({
                launchpad_id: launchpad.id,
                contract_address: contractAddress,
                total_locked: pluConfig.totalLockPercent,
                unlock_schedule: unlockSchedule,
                unlocked_percent: 0,
                next_unlock_date: firstUnlock,
                status: 'locked',
            });
        }

        return NextResponse.json({
            success: true,
            configId,
            contractAddress,
            txHash,
            launchpadId: launchpad?.id || null,
            explorerUrl: `https://testnet.bscscan.com/address/${contractAddress}`,
        });
    } catch (error) {
        console.error('[/api/deploy] Error:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Deploy registration failed' },
            { status: 500 }
        );
    }
}
