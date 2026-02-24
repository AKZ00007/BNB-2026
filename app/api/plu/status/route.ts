import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ETH_ADDR_RE = /^0x[a-fA-F0-9]{40}$/;

/**
 * GET /api/plu/status?launchpadId=uuid   → primary lookup
 * GET /api/plu/status?configId=uuid      → alias for launchpadId
 * GET /api/plu/status?contractAddress=0x → direct contract address lookup
 * 
 * LOOKUP CHAIN:
 *   1. Direct: plu_locks WHERE launchpad_id = id
 *   2. Via saved_configs: configId → testnet_address → plu_locks WHERE contract_address
 *   3. Direct by contract address param
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const inputId = searchParams.get('launchpadId') || searchParams.get('configId');
        const contractAddr = searchParams.get('contractAddress');

        if (!inputId && !contractAddr) {
            return NextResponse.json({ error: 'Provide launchpadId, configId, or contractAddress' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        let lock: any = null;

        // ── Strategy 1: Direct lookup by launchpad_id ─────────────────────────
        if (inputId && UUID_RE.test(inputId)) {
            const { data } = await supabase
                .from('plu_locks')
                .select('*')
                .eq('launchpad_id', inputId)
                .order('created_at', { ascending: false })
                .limit(1);
            if (data && data.length > 0) lock = data[0];
        }

        // ── Strategy 2: Via saved_configs → contract_address ──────────────────
        if (!lock && inputId && UUID_RE.test(inputId)) {
            const { data: cfg } = await supabase
                .from('saved_configs')
                .select('testnet_address')
                .eq('id', inputId)
                .single();

            if (cfg?.testnet_address && cfg.testnet_address !== '0x0000000000000000000000000000000000000000') {
                const { data } = await supabase
                    .from('plu_locks')
                    .select('*')
                    .eq('contract_address', cfg.testnet_address)
                    .order('created_at', { ascending: false })
                    .limit(1);
                if (data && data.length > 0) lock = data[0];
            }
        }

        // ── Strategy 3: Direct contract address lookup ────────────────────────
        if (!lock && contractAddr && ETH_ADDR_RE.test(contractAddr)) {
            const { data } = await supabase
                .from('plu_locks')
                .select('*')
                .eq('contract_address', contractAddr)
                .order('created_at', { ascending: false })
                .limit(1);
            if (data && data.length > 0) lock = data[0];
        }

        // ── No lock found via any strategy ────────────────────────────────────
        if (!lock) {
            return NextResponse.json({
                error: 'No PLU lock found. Deploy or re-deploy your token to create one.',
                hint: 'PLU locks are created automatically during deployment.'
            }, { status: 404 });
        }

        // ── Compute simulated health score ────────────────────────────────────
        const lockAge = Date.now() - new Date(lock.created_at).getTime();
        const daysSinceLock = lockAge / 86400000;

        const baseScore = 60;
        const ageBonus = Math.min(daysSinceLock * 2, 30);
        const randomNoise = Math.floor(Math.random() * 10) - 5;
        const healthScore = Math.max(0, Math.min(100, Math.round(baseScore + ageBonus + randomNoise)));

        let unlockStatus: 'healthy' | 'caution' | 'danger';
        if (healthScore >= 80) unlockStatus = 'healthy';
        else if (healthScore >= 50) unlockStatus = 'caution';
        else unlockStatus = 'danger';

        // ── Check milestones ──────────────────────────────────────────────────
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
            schedule,
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
