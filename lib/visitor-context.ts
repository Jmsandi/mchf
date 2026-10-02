/** Only use address and country headers supplied by the hosting platform. */
export function visitorContext(request: Request, platform: 'vercel' | 'cloudflare' | 'local') {
  let address = 'local';
  let country = '';
  if (platform === 'vercel') {
    address = (request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
    country = request.headers.get('x-vercel-ip-country') || '';
  } else if (platform === 'cloudflare') {
    address = request.headers.get('cf-connecting-ip') || 'local';
    country = (request as Request & {cf?: {country?: string}}).cf?.country || request.headers.get('cf-ipcountry') || '';
  }
  country = country.toUpperCase();
  return {address, country: /^[A-Z]{2}$/.test(country) ? country : ''};
}
