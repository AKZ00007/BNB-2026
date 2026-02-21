/**
 * Supabase Admin Client — uses the service-role key.
 * Only use this server-side (API routes, server actions).
 * Bypasses RLS for admin operations.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
    if (_admin) return _admin;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error('Missing Supabase environment variables (URL or key)');
    }

    _admin = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    return _admin;
}
