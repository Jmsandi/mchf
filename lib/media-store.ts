import { env } from '@/lib/runtime-env';
import { database, logAction } from './store';
import { supabaseConfigured, serverClient, serviceClient, publicClient, requireResult } from './supabase';
export async function saveMedia(row: {
    id: string;
    key: string;
    filename: string;
    mime: string;
    size: number;
    alt: string;
    uploaded_by: string;
}, bytes: Uint8Array) {
    if (supabaseConfigured()) {
        const c = serviceClient();
        requireResult(await c.storage.from('mchf-media').upload(row.key, bytes, { contentType: row.mime, upsert: false }), 'File upload');
        const result = await (await serverClient()).from('mchf_media').insert(row);
        if (result.error) {
            await c.storage.from('mchf-media').remove([row.key]);
            throw new Error('File metadata could not be saved.');
        }
        return;
    }
    if (!env.BUCKET)
        throw new Error('Storage unavailable');
    await env.BUCKET.put(row.key, bytes, { httpMetadata: { contentType: row.mime } });
    try {
        await database().prepare('INSERT INTO media (id,key,filename,mime,size,alt,uploaded_by,created_at) VALUES (?,?,?,?,?,?,?,?)').bind(row.id, row.key, row.filename, row.mime, row.size, row.alt, row.uploaded_by, new Date().toISOString()).run();
        await logAction(row.uploaded_by, 'upload', row.id, row.filename);
    }
    catch (e) {
        await env.BUCKET.delete(row.key);
        throw e;
    }
}
export async function readMedia(id: string, authenticated: boolean) { if (supabaseConfigured()) {
    const c = authenticated ? await serverClient() : publicClient();
    return requireResult(await c.from('mchf_media').select('*').eq('id', id).maybeSingle(), 'File lookup');
} return database().prepare('SELECT * FROM media WHERE id=?').bind(id).first<any>(); }
export async function publishedMedia(id: string) { const url = '/api/media/' + id; if (supabaseConfigured()) {
    const row = requireResult(await publicClient().from('mchf_content').select('id').or('image.eq.' + url + ',file.eq.' + url).limit(1), 'Publication lookup');
    return Boolean(row?.length);
} return Boolean(await database().prepare("SELECT id,meta FROM content WHERE status='published' AND (image=? OR file=?)").bind(url, url).all().then(r => r.results.some((r: any) => { const m = typeof r.meta === 'string' ? JSON.parse(r.meta) : r.meta; return !m?.publishAt || Date.parse(m.publishAt) <= Date.now(); }))); }
export async function mediaBytes(key: string) { if (supabaseConfigured()) {
    const blob = requireResult(await serviceClient().storage.from('mchf-media').download(key), 'File delivery');
    return blob?.stream();
} const object = await env.BUCKET?.get(key); return object?.body; }
