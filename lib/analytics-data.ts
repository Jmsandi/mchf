import type { AudienceReport } from '@/components/site/admin-overview';
export type Visit = {
    id: string;
    path: string;
    visitor_hash: string;
    referrer: string;
    device: string;
    country: string;
    duration: number;
    occurred_at: string;
    last_seen: string;
};
export function aggregateAudience(events: Visit[], days: number, now = new Date()): AudienceReport {
    const today = now.toISOString().slice(0, 10);
    const first = new Date(today + 'T00:00:00Z');
    first.setUTCDate(first.getUTCDate() - days + 1);
    const data = events.filter(e => Date.parse(e.occurred_at) >= first.getTime() && Date.parse(e.occurred_at) <= now.getTime());
    const daily = Array.from({ length: days }, (_, i) => { const d = new Date(first); d.setUTCDate(d.getUTCDate() + i); const date = d.toISOString().slice(0, 10), rows = data.filter(e => e.occurred_at.slice(0, 10) === date); return { date, views: rows.length, visitors: new Set(rows.map(e => e.visitor_hash)).size }; });
    const grouped = (field: 'referrer' | 'device' | 'country') => { const map = new Map<string, number>(); for (const e of data) {
        const key = e[field] || (field === 'referrer' ? 'Direct / internal' : field === 'country' ? 'Unknown' : 'desktop');
        map.set(key, (map.get(key) || 0) + 1);
    } return [...map].sort((a, b) => b[1] - a[1]).map(([key, views]) => ({ [field === 'referrer' ? 'source' : field]: key, views })); };
    const paths = [...new Set(data.map(e => e.path))].map(path => { const rows = data.filter(e => e.path === path); return { path, views: rows.length, visitors: new Set(rows.map(e => e.visitor_hash)).size }; }).sort((a, b) => b.views - a.views).slice(0, 20);
    return { summary: { visitorsToday: daily.at(-1)?.visitors || 0, viewsToday: daily.at(-1)?.views || 0, visitorsPeriod: daily.reduce((s, d) => s + d.visitors, 0), viewsPeriod: data.length, activeNow: new Set(data.filter(e => Date.parse(e.last_seen) >= now.getTime() - 300000).map(e => e.visitor_hash)).size, averageEngagement: data.length ? Math.round(data.reduce((n, e) => n + e.duration, 0) / data.length) : 0 }, daily, pages: paths, referrers: grouped('referrer') as AudienceReport['referrers'], devices: grouped('device') as AudienceReport['devices'], countries: grouped('country') as AudienceReport['countries'] };
}
export function publicAnalyticsPath(path: string) { return /^\/(?!\/)/.test(path) && !/^\/(admin|api|signin-with-chatgpt|signout-with-chatgpt|auth|callback)(\/|$)/.test(path) && !path.includes('?') && !path.includes('#') && path.length <= 300; }
