import { z } from 'zod';
import { sameOrigin, staff } from '@/lib/permissions';
import { supabaseConfigured, serverClient } from '@/lib/supabase';
import { fingerprint, consumeRateLimit } from '@/lib/analytics';
export async function POST(request: Request) { try {
    if (!sameOrigin(request))
        return Response.json({ error: 'Please sign in from the MCHF website.' }, { status: 403 });
    if (!supabaseConfigured())
        return Response.json({ error: 'Supabase has not been connected yet.' }, { status: 503 });
    if (Number(request.headers.get('content-length') || 0) > 3000)
        return Response.json({ error: 'Request is too large.' }, { status: 413 });
    const input = z.object({ action: z.enum(['login', 'logout']), email: z.string().email().max(150).optional(), password: z.string().min(1).max(200).optional() }).safeParse(await request.json());
    if (!input.success)
        return Response.json({ error: 'Enter a valid email and password.' }, { status: 400 });
    const c = await serverClient();
    if (input.data.action === 'logout') {
        await c.auth.signOut({ scope: 'local' });
        return Response.json({ success: true });
    }
    if (!input.data.email || !input.data.password)
        return Response.json({ error: 'Enter your email and password.' }, { status: 400 });
    if (!await consumeRateLimit('login:' + await fingerprint(request, 'login'), 8, 900))
        return Response.json({ error: 'Too many attempts. Please try again in 15 minutes.' }, { status: 429 });
    const { error } = await c.auth.signInWithPassword({ email: input.data.email, password: input.data.password });
    if (error)
        return Response.json({ error: 'The email or password is incorrect.' }, { status: 401 });
    if (!await staff()) {
        await c.auth.signOut({ scope: 'local' });
        return Response.json({ error: 'This account does not have staff access. Contact the MCHF administrator.' }, { status: 403 });
    }
    return Response.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
}
catch {
    return Response.json({ error: 'Sign-in is temporarily unavailable. Please try again.' }, { status: 503 });
} }
