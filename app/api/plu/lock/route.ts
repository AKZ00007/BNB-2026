import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ETH_ADDR_RE = /^0x[a-fA-F0-9]{40}$/;

/**
 * POST /api/plu/lock
 * Initializes a PLU lock record for a launchpad.
 * Usually called automatically by /api/deploy, but can be called separately.
 *
 * Body: { launchpadId, contractAddress, totalLocked }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const launchpadId = typeof body.launchpadId === 'string' ? body.launchpadId.trim() : '';
        const contractAddress = typeof body.contractAddress === 'string' ? body.contractAddress.trim() : '';
        const totalLocked = Number(body.totalLocked);

        // ── Validation ─────────────────────────────────────────────────────────
        if (!UUID_RE.test(launchpadId)) {
            return NextResponse.json({ error: 'Invalid launchpadId' }, { status: 400 });
        }
        if (!ETH_ADDR_RE.test(contractAddress)) {
            return NextResponse.json({ error: 'Invalid contractAddress' }, { status: 400 });
        }
        if (!totalLocked || totalLocked < 1 || totalLocked > 100) {
            return NextResponse.json({ error: 'totalLocked must be 1–100' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // ── Check launchpad exists ─────────────────────────────────────────────
        const { data: lp, error: lpErr } = await supabase
            .from('launchpads')
            .select('id, plu_config')
            .eq('id', launchpadId)
            .single();

        if (lpErr || !lp) {
            return NextResponse.json({ error: 'Launchpad not found' }, { status: 404 });
        }

        // ── Build unlock schedule from PLU config ──────────────────────────────
        const pluConfig = (lp.plu_config || {}) as {
            milestones?: Array<{ percent: number; afterDays: number; condition: string }>;
        };

        const milestones = pluConfig.milestones || [];
        const unlockSchedule = milestones.map((m) => ({
            percent: m.percent,
            date: new Date(Date.now() + m.afterDays * 86400000).toISOString(),
            milestone_type: 'health',
            condition: m.condition,
        }));

        const nextUnlock = unlockSchedule[0]?.date
            || new Date(Date.now() + 30 * 86400000).toISOString();

        // ── Check if lock already exists ────────────────────────────────────────
        const { data: existing } = await supabase
            .from('plu_locks')
            .select('id')
            .eq('launchpad_id', launchpadId)
            .limit(1);

        if (existing && existing.length > 0) {
            return NextResponse.json(
                { error: 'PLU lock already exists for this launchpad', lockId: existing[0].id },
                { status: 409 }
            );
        }

        // ── Insert ─────────────────────────────────────────────────────────────
        const { data: lock, error } = await supabase
            .from('plu_locks')
            .insert({
                launchpad_id: launchpadId,
                contract_address: contractAddress,
                total_locked: totalLocked,
                unlock_schedule: unlockSchedule,
                unlocked_percent: 0,
                next_unlock_date: nextUnlock,
                status: 'locked',
            })
            .select('id')
            .single();

        if (error) {
            console.error('[/api/plu/lock] Insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            lockId: lock.id,
            totalLocked,
            milestoneCount: unlockSchedule.length,
            nextUnlockDate: nextUnlock,
        });
    } catch (error) {
        console.error('[/api/plu/lock] Error:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to create PLU lock' },
            { status: 500 }
        );
    }
}
