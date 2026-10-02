/** Next.js can expose an internal request URL; browser submissions use the public Host. */
export function matchesRequestOrigin(request: Request, trustedProxy = false) {
  try {
    const url = new URL(request.url);
    const host = request.headers.get('host') || url.host;
    const forwardedProtocol = trustedProxy ? request.headers.get('x-forwarded-proto') : null;
    const protocol = forwardedProtocol === 'https' || forwardedProtocol === 'http' ? `${forwardedProtocol}:` : url.protocol;
    return request.headers.get('origin') === new URL(`${protocol}//${host}`).origin;
  } catch {
    return false;
  }
}
