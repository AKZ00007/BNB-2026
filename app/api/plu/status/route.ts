import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/plu/status?launchpadId=uuid
 * Returns PLU lock status including health score simulation and next unlock.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const launchpadId = searchParams.get('launchpadId');

        if (!launchpadId || !UUID_RE.test(launchpadId)) {
            return NextResponse.json({ error: 'Valid launchpadId required' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // ── Fetch PLU lock ─────────────────────────────────────────────────────
        const { data: lock, error } = await supabase
            .from('plu_locks')
            .select('*')
            .eq('launchpad_id', launchpadId)
            .single();

        if (error || !lock) {
            return NextResponse.json({ error: 'No PLU lock found for this launchpad' }, { status: 404 });
        }

        // ── Compute simulated health score ─────────────────────────────────────
        // In production this would come from on-chain data (holder count, price stability, etc.)
        // For the MVP demo, we simulate a realistic score based on lock age.
        const lockAge = Date.now() - new Date(lock.created_at).getTime();
        const daysSinceLock = lockAge / 86400000;

        // Simulate a health score that starts cautious and grows over time
        const baseScore = 60;
        const ageBonus = Math.min(daysSinceLock * 2, 30); // +2 per day, max +30
        const randomNoise = Math.floor(Math.random() * 10) - 5; // ±5
        const healthScore = Math.max(0, Math.min(100, Math.round(baseScore + ageBonus + randomNoise)));

        // ── Determine unlock eligibility ───────────────────────────────────────
        let unlockStatus: 'healthy' | 'caution' | 'danger';
        if (healthScore >= 80) unlockStatus = 'healthy';
        else if (healthScore >= 50) unlockStatus = 'caution';
        else unlockStatus = 'danger';

        // ── Check for due milestones ───────────────────────────────────────────
        const schedule = (lock.unlock_schedule || []) as Array<{
            percent: number;
            date: string;
            condition: string;
        }>;

        const now = new Date().toISOString();
        const dueMilestones = schedule.filter(m => m.date <= now);
        const pendingMilestones = schedule.filter(m => m.date > now);

        return NextResponse.json({
            success: true,
            lock: {
                id: lock.id,
                launchpadId: lock.launchpad_id,
                contractAddress: lock.contract_address,
                totalLocked: lock.total_locked,
                unlockedPercent: lock.unlocked_percent,
                status: lock.status,
                nextUnlockDate: lock.next_unlock_date,
                extendedUntil: lock.extended_until,
                createdAt: lock.created_at,
            },
            healthScore,
            unlockStatus,
            dueMilestones,
            pendingMilestones,
            summary: unlockStatus === 'healthy'
                ? `Health score ${healthScore}/100 — Unlock proceeding on schedule.`
                : unlockStatus === 'caution'
                    ? `Health score ${healthScore}/100 — Unlock paused, lock period extended by 14 days.`
                    : `Health score ${healthScore}/100 — EMERGENCY: LP frozen, abnormal activity detected.`,
        });
    } catch (error) {
        console.error('[/api/plu/status] Error:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to fetch PLU status' },
            { status: 500 }
        );
    }
}
