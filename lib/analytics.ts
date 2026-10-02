import { database } from './store';
import { aggregateAudience, Visit } from './analytics-data';
import { runtimeValue, supabaseConfigured, serverClient, serviceClient, requireResult } from './supabase';
import type { AudienceReport } from '@/components/site/admin-overview';
export async function fingerprint(request: Request, purpose: string) { const secret = runtimeValue('ANALYTICS_SECRET') || runtimeValue('SUPABASE_SECRET_KEY') || (import.meta.env.DEV ? 'mchf-local-preview' : ''); if (!secret)
    throw new Error('Visitor tracking is not configured.'); const day = new Date().toISOString().slice(0, 10); const message = purpose + '|' + day + '|' + (request.headers.get('cf-connecting-ip') || 'local') + '|' + (request.headers.get('user-agent') || '').slice(0, 300); const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)))).map(b => b.toString(16).padStart(2, '0')).join(''); }
export async function consumeRateLimit(key: string, maximum: number, seconds: number) { if (supabaseConfigured())
    return Boolean(requireResult(await serviceClient().rpc('mchf_consume_rate_limit', { p_key: key, p_max: maximum, p_seconds: seconds }), 'Rate limit')); const now = Date.now(); const row = await database().prepare('INSERT INTO rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires < ? THEN 1 ELSE count+1 END, expires=CASE WHEN expires < ? THEN ? ELSE expires END RETURNING count').bind(key, now + seconds * 1000, now, now, now + seconds * 1000).first<{
    count: number;
}>(); return (row?.count || 0) <= maximum; }
export async function recordVisit(input: {
    id: string;
    path: string;
    referrer: string;
    device: string;
    country: string;
    visitorHash: string;
    duration: number;
    event: string;
}) {
    const { id, path, referrer, device, country, visitorHash, duration, event } = input;
    if (supabaseConfigured()) {
        requireResult(await serviceClient().rpc('mchf_record_visit', { p_id: id, p_path: path, p_visitor_hash: visitorHash, p_referrer: referrer, p_device: device, p_country: country, p_duration: duration, p_event: event }), 'Visitor event');
        return;
    }
    const now = new Date().toISOString();
    const db = database();
    if (event === 'pageview')
        await db.prepare('INSERT OR IGNORE INTO analytics_events (id,path,visitor_hash,referrer,device,country,duration,occurred_at,last_seen) VALUES (?,?,?,?,?,?,0,?,?)').bind(id, path, visitorHash, referrer, device, country, now, now).run();
    else
        await db.prepare('UPDATE analytics_events SET duration=MAX(duration,?),last_seen=? WHERE id=? AND visitor_hash=? AND path=?').bind(duration, now, id, visitorHash, path).run();
    const cutoff = new Date(Date.now() - 90 * 86400000).toISOString();
    await db.prepare('DELETE FROM analytics_events WHERE occurred_at < ?').bind(cutoff).run();
}
export async function audienceReport(days = 30): Promise<AudienceReport> { if (supabaseConfigured())
    return requireResult(await (await serverClient()).rpc('mchf_analytics_report', { p_days: days }), 'Visitor report') as AudienceReport; const cutoff = new Date(); cutoff.setUTCHours(0, 0, 0, 0); cutoff.setUTCDate(cutoff.getUTCDate() - days + 1); const rows = await database().prepare('SELECT * FROM analytics_events WHERE occurred_at>=?').bind(cutoff.toISOString()).all(); return aggregateAudience(rows.results as Visit[], days); }
