import { staff } from '@/lib/permissions';
import { readMedia, publishedMedia, mediaBytes } from '@/lib/media-store';
export async function GET(request: Request, { params }: {
    params: Promise<{
        id: string;
    }>;
}) { try {
    const { id } = await params;
    if (!/^[a-f0-9-]{36}$/i.test(id))
        return new Response('File not found', { status: 404 });
    const published = await publishedMedia(id);
    const user = published ? null : await staff();
    if (!published && !user)
        return new Response('File not published', { status: 404 });
    const row = await readMedia(id, Boolean(user));
    if (!row)
        return new Response('File not found', { status: 404 });
    const bytes = await mediaBytes(row.key);
    if (!bytes)
        return new Response('File not found', { status: 404 });
    return new Response(bytes, { headers: { 'Content-Type': row.mime, 'Content-Disposition': `${row.mime.startsWith('image/') || row.mime === 'application/pdf' ? 'inline' : 'attachment'}; filename="${row.filename.replace(/["\r\n]/g, '')}"`, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': published ? 'public, max-age=60' : 'private, no-store', 'Content-Security-Policy': "sandbox; default-src 'none'" } });
}
catch {
    return new Response('File service unavailable', { status: 503 });
} }
