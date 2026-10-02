import {env} from '@/lib/runtime-env';

export function siteUrl() {
  for (const candidate of [env.SITE_URL, env.VERCEL_PROJECT_PRODUCTION_URL, env.VERCEL_URL]) {
    if (typeof candidate !== 'string' || !candidate.trim()) continue;
    try {
      const url = new URL(candidate.includes('://') ? candidate : `https://${candidate}`);
      if (url.protocol === 'https:' || url.protocol === 'http:') return url.origin;
    } catch {
      // Try the next hosting-provided URL if this setting is invalid.
    }
  }
  return 'https://mchf-health-foundation.salty-tick-4448.chatgpt.site';
}
