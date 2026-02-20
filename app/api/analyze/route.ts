import { NextResponse } from 'next/server';
import { generateTokenConfig } from '@/lib/gemini';

/**
 * POST /api/analyze
 * Body: { goal: string }
 * Response: TokenConfig JSON
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { goal } = body as { goal: string };

        if (!goal || typeof goal !== 'string' || goal.trim().length < 10) {
            return NextResponse.json(
                { error: 'Please provide a goal of at least 10 characters.' },
                { status: 400 }
            );
        }

        if (goal.length > 2000) {
            return NextResponse.json(
                { error: 'Goal must be under 2000 characters.' },
                { status: 400 }
            );
        }

        const config = await generateTokenConfig(goal.trim());

        return NextResponse.json({ success: true, config });
    } catch (error) {
        console.error('[/api/analyze] Error:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to generate config' },
            { status: 500 }
        );
    }
}
