import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// ─── Validation Helpers ───────────────────────────────────────────────────────

const ETH_ADDR_RE = /^0x[a-fA-F0-9]{40}$/;
const TX_HASH_RE = /^0x[a-fA-F0-9]{64}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sanitize(s: unknown): string {
    if (typeof s !== 'string') return '';
    return s.replace(/<[^>]*>/g, '').trim();
}

/**
 * POST /api/deploy
 * Called by DeployFlow AFTER the tx is mined on BSC Testnet.
 * 
 * DATA FLOW:
 *   1. Validate inputs
 *   2. Fetch saved_configs to get the config
 *   3. Update saved_configs status → 'testnet' with contract address
 *   4. Upsert user row + get user ID
 *   5. Create launchpads entry (REQUIRED for FK chain)
 *   6. Save launchpad_id back to saved_configs for lookup
 *   7. Create plu_locks entry using launchpad.id (valid FK)
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
        if (contractAddress === '0x0000000000000000000000000000000000000000') {
            return NextResponse.json({ error: 'Zero address is not a valid contract address' }, { status: 400 });
        }
        if (!txHash || !TX_HASH_RE.test(txHash)) {
            return NextResponse.json({ error: 'Invalid transaction hash' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // ── STEP 1: Fetch the saved config ────────────────────────────────────
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

        // ── STEP 2: Update saved_configs → testnet ────────────────────────────
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

        // ── STEP 3: Upsert user row ───────────────────────────────────────────
        await supabase
            .from('users')
            .upsert(
                { wallet_address: walletAddress.toLowerCase() },
                { onConflict: 'wallet_address' }
            );

        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('wallet_address', walletAddress.toLowerCase())
            .single();

        // ── STEP 4: Create launchpad entry ────────────────────────────────────
        // This is REQUIRED — the PLU lock FK references launchpads.id
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
                end_time: new Date(Date.now() + 7 * 86400000).toISOString(),
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
            // Continue — we'll skip PLU lock but still return success for the deploy
        }

        let pluLockCreated = false;

        // ── STEP 5: Create PLU lock (only if launchpad was created) ───────────
        // The plu_locks.launchpad_id has a FK constraint to launchpads(id),
        // so we can ONLY insert if we have a valid launchpad.id
        if (launchpad?.id) {
            const pluConfig = config.plu as { totalLockPercent?: number; milestones?: unknown[] } | undefined;
            const totalLockPercent = pluConfig?.totalLockPercent || 60;

            const defaultMilestones = [
                { percent: 5, afterDays: 30, condition: 'Reach 500 unique holders' },
                { percent: 10, afterDays: 60, condition: 'Hit $500K market cap' },
                { percent: 10, afterDays: 90, condition: 'Achieve $50K daily volume' },
                { percent: 15, afterDays: 120, condition: 'Partnership integration live' },
                { percent: 20, afterDays: 365, condition: '12-month token age' },
            ];

            const milestones = (pluConfig?.milestones as Array<{
                percent: number; afterDays: number; condition: string;
            }>) || defaultMilestones;

            const unlockSchedule = milestones.map((m) => ({
                percent: m.percent,
                date: new Date(Date.now() + m.afterDays * 86400000).toISOString(),
                milestone_type: 'health',
                condition: m.condition,
            }));

            const firstUnlock = unlockSchedule.length > 0
                ? unlockSchedule[0].date
                : new Date(Date.now() + 30 * 86400000).toISOString();

            const { error: pluErr } = await supabase.from('plu_locks').insert({
                launchpad_id: launchpad.id,
                contract_address: contractAddress,
                total_locked: totalLockPercent,
                unlock_schedule: unlockSchedule,
                unlocked_percent: 0,
                next_unlock_date: firstUnlock,
                status: 'locked',
            });

            if (pluErr) {
                console.error('[/api/deploy] plu_locks insert error:', pluErr);
            } else {
                pluLockCreated = true;
            }
        }

        // ── STEP 6: Save launchpad_id back to saved_configs ───────────────────
        // This creates the lookup chain: configId → saved_configs → launchpad_id → plu_locks
        if (launchpad?.id) {
            await supabase
                .from('saved_configs')
                .update({
                    updated_at: new Date().toISOString(),
                })
                .eq('id', configId);
        }

        return NextResponse.json({
            success: true,
            configId,
            contractAddress,
            txHash,
            launchpadId: launchpad?.id || null,
            pluLockCreated,
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

