import { isDevelopment, supportsPlatformAuth, runtimePlatform } from '@/lib/runtime-env';
import { matchesRequestOrigin } from './request-origin';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from './store';
import { runtimeValue, supabaseConfigured, serverClient, serviceClient, serviceConfigured, requireResult } from './supabase';
export { roles, canEdit, canPublish, canSaveStatus } from './content-policy';
export async function staff() {
    if (supabaseConfigured()) {
        const client = await serverClient();
        const { data: { user }, error } = await client.auth.getUser();
        if (error || !user?.email)
            return null;
        let member = requireResult(await client.from('mchf_members').select('role').eq('email', user.email.toLowerCase()).maybeSingle(), 'Staff lookup');
        const owners = runtimeValue('ADMIN_EMAILS').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        if (!member && owners.includes(user.email.toLowerCase()) && serviceConfigured()) {
            requireResult(await serviceClient().from('mchf_members').insert({ email: user.email.toLowerCase(), role: 'super_admin', created_by: user.email.toLowerCase() }), 'Administrator setup');
            member = { role: 'super_admin' };
        }
        return member ? { userId: user.id, email: user.email.toLowerCase(), displayName: user.user_metadata?.full_name || user.email, role: member.role, provider: 'supabase' } : null;
    }
    if (!supportsPlatformAuth) return null;
    const user = await getChatGPTUser();
    if (!user)
        return null;
    const allow = runtimeValue('ADMIN_EMAILS').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    if (allow.includes(user.email.toLowerCase()) || (isDevelopment && user.email === 'seedy@sites.test'))
        return { ...user, role: 'super_admin', provider: 'local' };
    const member = await database().prepare('SELECT role FROM members WHERE email=?').bind(user.email.toLowerCase()).first<{
        role: string;
    }>();
    return member ? { ...user, role: member.role, provider: 'local' } : null;
}
export function sameOrigin(request: Request) { return matchesRequestOrigin(request, runtimePlatform === 'vercel'); }
