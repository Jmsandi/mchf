import { z } from 'zod';
import { staff, canPublish, sameOrigin } from '@/lib/permissions';
import { fingerprint, consumeRateLimit, recordVisit, audienceReport } from '@/lib/analytics';
import { publicAnalyticsPath } from '@/lib/analytics-data';
const schema = z.object({ id: z.string().uuid(), path: z.string().refine(publicAnalyticsPath), event: z.enum(['pageview', 'engagement']), duration: z.number().int().min(0).max(7200).default(0), referrer: z.string().max(253).regex(/^[a-zA-Z0-9.-]*$/).default(''), device: z.enum(['desktop', 'tablet', 'mobile']).default('desktop') }).strict();
export async function GET(request: Request) { try {
    const user = await staff();
    if (!user || !canPublish(user.role))
        return Response.json({ error: 'Administrator access required.' }, { status: 403 });
    const days = Number(new URL(request.url).searchParams.get('days') || 30);
    if (![7, 30, 90].includes(days))
        return Response.json({ error: 'Choose 7, 30 or 90 days.' }, { status: 400 });
    return Response.json(await audienceReport(days), { headers: { 'Cache-Control': 'no-store' } });
}
catch {
    return Response.json({ error: 'Visitor reports are temporarily unavailable.' }, { status: 503 });
} }
export async function POST(request: Request) { try {
    if (!sameOrigin(request))
        return new Response(null, { status: 403 });
    if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1' || /bot|crawler|spider|headless|preview|slurp/i.test(request.headers.get('user-agent') || ''))
        return new Response(null, { status: 204 });
    if (Number(request.headers.get('content-length') || 0) > 3000)
        return new Response(null, { status: 413 });
    const result = schema.safeParse(await request.json());
    if (!result.success)
        return Response.json({ error: 'Invalid visitor event.' }, { status: 400 });
    const data = result.data, hash = await fingerprint(request, 'analytics');
    if (!await consumeRateLimit('analytics:' + hash, 300, 3600))
        return new Response(null, { status: 429 });
    const country = ((request as Request & {
        cf?: {
            country?: string;
        };
    }).cf?.country || request.headers.get('cf-ipcountry') || '').toUpperCase();
    await recordVisit({ ...data, visitorHash: hash, country: /^[A-Z]{2}$/.test(country) ? country : '' });
    return new Response(null, { status: 204 });
}
catch {
    return new Response(null, { status: 503 });
} }
