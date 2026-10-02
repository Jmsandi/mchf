/** Server runtime for Next.js / Vercel. The Cloudflare build replaces this module. */
type RuntimeEnvironment = Record<string, unknown> & {DB?: D1Database; BUCKET?: R2Bucket};
export const env: RuntimeEnvironment = process.env;
export const isDevelopment = process.env.NODE_ENV === 'development';
export const runtimePlatform = process.env.VERCEL === '1' ? 'vercel' : 'local';
// Vercel requests cannot authenticate with the Sites platform's forwarded headers.
export const supportsPlatformAuth = false;
