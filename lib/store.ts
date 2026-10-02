import { env } from 'cloudflare:workers';
import { baseRecords, ContentRecord } from './content';
import { isPublicRecord } from './content-policy';
import { supabaseConfigured, publicClient, serverClient, serviceClient, requireResult } from './supabase';
export function database() { if (!env.DB)
    throw new Error('Content service unavailable'); return env.DB; }
export function parseRecord(r: any): ContentRecord { return { ...r, updatedAt: r.updated_at || r.updatedAt, meta: typeof r.meta === 'string' ? JSON.parse(r.meta) : r.meta || {} }; }
export function toSupabaseRecord(r: ContentRecord, actor: string) { return { id: r.id, kind: r.kind, slug: r.slug, title: r.title, summary: r.summary, body: r.body, status: r.status, programme: r.programme, year: r.year, topic: r.topic, location: r.location, image: r.image, file: r.file, source: r.source, meta: r.meta, publish_at: r.meta.publishAt || null, updated_by: actor, updated_at: new Date().toISOString() }; }
export async function getContent(all = false): Promise<ContentRecord[]> {
    if (supabaseConfigured()) {
        const client = all ? await serverClient() : publicClient();
        const rows: any[] = [];
        for (let start = 0;; start += 500) {
            const batch = requireResult(await client.from('mchf_content').select('*').order('updated_at', { ascending: false }).order('id', { ascending: true }).range(start, start + 499), 'Content lookup') || [];
            rows.push(...batch);
            if (batch.length < 500)
                break;
        }
        if (!rows.length) {
            const ready = all ? false : requireResult(await publicClient().rpc('mchf_content_ready'), 'Content readiness');
            if (!ready)
                return baseRecords.filter(r => all || isPublicRecord(r));
        }
        return rows.map(parseRecord).filter(r => all || isPublicRecord(r));
    }
    const rows = await database().prepare('SELECT * FROM content ORDER BY updated_at DESC').all();
    const map = new Map(baseRecords.map(r => [r.id, r]));
    for (const row of rows.results)
        map.set(String(row.id), parseRecord(row));
    return [...map.values()].filter(r => all || isPublicRecord(r)).sort((a, b) => Date.parse(b.updatedAt || '1970-01-01') - Date.parse(a.updatedAt || '1970-01-01'));
}
export async function initializeContent(actor: string) { if (!supabaseConfigured())
    return; const c = serviceClient(); const existing = requireResult(await c.from('mchf_content').select('id').in('id', baseRecords.map(r => r.id)), 'Website import check') || []; const ids = new Set(existing.map(r => r.id)); const missing = baseRecords.filter(r => !ids.has(r.id)); if (missing.length)
    requireResult(await c.from('mchf_content').upsert(missing.map(r => toSupabaseRecord(r, actor)), { onConflict: 'id', ignoreDuplicates: true }), 'Website content import'); }
export async function publicContent() { try {
    return { records: await getContent(), unavailable: false };
}
catch {
    return { records: baseRecords.filter(r => isPublicRecord(r)), unavailable: true };
} }
export async function saveContent(r: ContentRecord, actor: string) {
    if (supabaseConfigured()) {
        requireResult(await (await serverClient()).from('mchf_content').upsert(toSupabaseRecord(r, actor), { onConflict: 'id' }), 'Content save');
        return;
    }
    const cols = ['id', 'kind', 'slug', 'title', 'summary', 'body', 'status', 'programme', 'year', 'topic', 'location', 'image', 'file', 'source', 'meta', 'updated_by', 'updated_at'];
    const now = new Date().toISOString();
    await database().batch([database().prepare(`INSERT INTO content (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')}) ON CONFLICT(id) DO UPDATE SET ${cols.slice(1).map(c => `${c}=excluded.${c}`).join(',')}`).bind(r.id, r.kind, r.slug, r.title, r.summary, r.body, r.status, r.programme, r.year, r.topic, r.location, r.image, r.file, r.source, JSON.stringify(r.meta), actor, now), database().prepare('INSERT INTO audit (id,actor,action,record_id,details,created_at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(), actor, 'save:' + r.status, r.id, JSON.stringify({ title: r.title, kind: r.kind }), now)]);
}
export async function adminData(role: string) {
    const admin = ['super_admin', 'administrator'].includes(role);
    if (supabaseConfigured()) {
        const c = await serverClient();
        const q = await Promise.all([c.from('mchf_media').select('*').order('created_at', { ascending: false }), admin ? c.from('mchf_inquiries').select('*').order('created_at', { ascending: false }).limit(200) : Promise.resolve({ data: [], error: null }), role === 'super_admin' ? c.from('mchf_members').select('id,email,role') : Promise.resolve({ data: [], error: null }), admin ? c.from('mchf_audit').select('actor,action,record_id,created_at').order('created_at', { ascending: false }).limit(100) : Promise.resolve({ data: [], error: null })]);
        return { media: requireResult(q[0], 'Media lookup'), inquiries: requireResult(q[1], 'Inbox lookup'), members: requireResult(q[2], 'Team lookup'), audit: requireResult(q[3], 'Activity lookup') };
    }
    const db = database();
    const [media, inquiries, members, audit] = await Promise.all([db.prepare('SELECT * FROM media ORDER BY created_at DESC').all(), admin ? db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 200').all() : Promise.resolve({ results: [] }), role === 'super_admin' ? db.prepare('SELECT id,email,role FROM members').all() : Promise.resolve({ results: [] }), admin ? db.prepare('SELECT actor,action,record_id,created_at FROM audit ORDER BY created_at DESC LIMIT 100').all() : Promise.resolve({ results: [] })]);
    return { media: media.results, inquiries: inquiries.results, members: members.results, audit: audit.results };
}
export async function logAction(actor: string, action: string, recordId: string, details: string) { if (supabaseConfigured()) {
    requireResult(await serviceClient().from('mchf_audit').insert({ actor, action, record_id: recordId, details }), 'Activity save');
    return;
} await database().prepare('INSERT INTO audit (id,actor,action,record_id,details,created_at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(), actor, action, recordId, details, new Date().toISOString()).run(); }
