import { env, isDevelopment } from '@/lib/runtime-env';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
export function runtimeValue(key: string) { return String((env as unknown as Record<string, unknown>)[key] || ''); }
export function supabaseConfigured() { return Boolean(runtimeValue('SUPABASE_URL') && runtimeValue('SUPABASE_PUBLISHABLE_KEY')); }
export function serviceConfigured() { return supabaseConfigured() && Boolean(runtimeValue('SUPABASE_SECRET_KEY')); }
export function publicClient() { if (!supabaseConfigured())
    throw new Error('Supabase is not connected.'); return createClient(runtimeValue('SUPABASE_URL'), runtimeValue('SUPABASE_PUBLISHABLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }); }
export function serviceClient() { if (!serviceConfigured())
    throw new Error('Supabase server access is not configured.'); return createClient(runtimeValue('SUPABASE_URL'), runtimeValue('SUPABASE_SECRET_KEY'), { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }); }
export async function serverClient() { const jar = await cookies(); return createServerClient(runtimeValue('SUPABASE_URL'), runtimeValue('SUPABASE_PUBLISHABLE_KEY'), { cookieOptions: { httpOnly: true, secure: !isDevelopment, sameSite: 'lax', path: '/' }, cookies: { getAll: () => jar.getAll(), setAll(values) { try {
            values.forEach(({ name, value, options }) => jar.set(name, value, options));
        }
        catch { /* Pages cannot set cookies; API requests refresh them. */ } } } }); }
export function requireResult<T>(result: {
    data: T;
    error: {
        message: string;
        code?: string;
    } | null;
}, operation: string): T { if (result.error)
    throw new Error(operation + ' failed (' + (result.error.code || 'service unavailable') + ').'); return result.data; }
