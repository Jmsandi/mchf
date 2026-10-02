import { z } from 'zod';
import { staff, roles, sameOrigin } from '@/lib/permissions';
import { database, logAction } from '@/lib/store';
import { supabaseConfigured, serviceClient, requireResult } from '@/lib/supabase';
export async function POST(request: Request) { try {
    if (!sameOrigin(request))
        return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
    const user = await staff();
    if (user?.role !== 'super_admin')
        return Response.json({ error: 'Super administrator access required.' }, { status: 403 });
    const parsed = z.object({ email: z.string().email().max(150), role: z.enum(roles as [
            string,
            ...string[]
        ]) }).safeParse(await request.json());
    if (!parsed.success)
        return Response.json({ error: 'Enter a valid email and role.' }, { status: 400 });
    const email = parsed.data.email.toLowerCase(), role = parsed.data.role;
    if (email === user.email.toLowerCase() && role !== 'super_admin')
        return Response.json({ error: 'You cannot remove your own super administrator access.' }, { status: 400 });
    if (supabaseConfigured()) {
        requireResult(await serviceClient().from('mchf_members').upsert({ email, role, created_by: user.email }, { onConflict: 'email' }), 'Team update');
    }
    else {
        await database().prepare('INSERT INTO members (id,email,role,created_by,created_at) VALUES (?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET role=excluded.role').bind(crypto.randomUUID(), email, role, user.email, new Date().toISOString()).run();
        await logAction(user.email, 'assign-role', email, role);
    }
    return Response.json({ success: true });
}
catch {
    return Response.json({ error: 'Could not update team access.' }, { status: 503 });
} }
