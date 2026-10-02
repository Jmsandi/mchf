import { z } from 'zod';
import { staff, canPublish, sameOrigin } from '@/lib/permissions';
import { database, logAction } from '@/lib/store';
import { supabaseConfigured, serverClient, requireResult } from '@/lib/supabase';
export async function PATCH(request: Request, { params }: {
    params: Promise<{
        id: string;
    }>;
}) { try {
    if (!sameOrigin(request))
        return Response.json({ error: 'Invalid origin.' }, { status: 403 });
    const user = await staff();
    if (!user || !canPublish(user.role))
        return Response.json({ error: 'Administrator access required.' }, { status: 403 });
    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success)
        return Response.json({ error: 'Invalid inquiry.' }, { status: 400 });
    const input = z.object({ status: z.enum(['new', 'reviewed', 'resolved']) }).safeParse(await request.json());
    if (!input.success)
        return Response.json({ error: 'Invalid status.' }, { status: 400 });
    if (supabaseConfigured()) {
        const rows = requireResult(await (await serverClient()).from('mchf_inquiries').update({ status: input.data.status }).eq('id', id).select('id'), 'Inquiry update');
        if (!rows?.length)
            return Response.json({ error: 'Inquiry not found.' }, { status: 404 });
    }
    else {
        const db = database();
        if (!await db.prepare('SELECT id FROM inquiries WHERE id=?').bind(id).first())
            return Response.json({ error: 'Inquiry not found.' }, { status: 404 });
        await db.prepare('UPDATE inquiries SET status=? WHERE id=?').bind(input.data.status, id).run();
        await logAction(user.email, 'inquiry:' + input.data.status, id, '');
    }
    return Response.json({ success: true });
}
catch {
    return Response.json({ error: 'Could not update the inquiry.' }, { status: 503 });
} }
