import {test} from 'node:test';
import assert from 'node:assert/strict';
import {visitorContext} from '../lib/visitor-context';
import {matchesRequestOrigin} from '../lib/request-origin';

test('Vercel visitors use Vercel headers, so different addresses remain distinct on a shared browser agent', () => {
  const request = (address: string) => new Request('https://mchf.vercel.app', {headers: {
    'x-vercel-forwarded-for': address,
    'x-forwarded-for': '198.51.100.3',
    'x-vercel-ip-country': 'sl',
    'cf-connecting-ip': '198.51.100.4',
    'cf-ipcountry': 'GB',
    'user-agent': 'Same browser',
  }});
  assert.deepEqual(visitorContext(request('203.0.113.1'), 'vercel'), {address: '203.0.113.1', country: 'SL'});
  assert.notEqual(visitorContext(request('203.0.113.1'), 'vercel').address, visitorContext(request('203.0.113.2'), 'vercel').address);
});

test('Cloudflare keeps its platform headers and local requests do not trust forwarded headers', () => {
  const request = new Request('http://localhost:5173', {headers: {
    'cf-connecting-ip': '203.0.113.1', 'cf-ipcountry': 'SL',
    'x-vercel-forwarded-for': '198.51.100.1', 'x-vercel-ip-country': 'GB',
  }});
  assert.deepEqual(visitorContext(request, 'cloudflare'), {address: '203.0.113.1', country: 'SL'});
  assert.deepEqual(visitorContext(request, 'local'), {address: 'local', country: ''});
  assert.equal(visitorContext(new Request('https://mchf.vercel.app', {headers: {'x-vercel-ip-country': 'invalid'}}), 'vercel').country, '');
});

test('Production form origins match the public host while external and missing origins stay blocked', () => {
  const request = (origin?: string, extra: Record<string, string> = {}) => new Request('http://localhost:5181/api/auth', {headers: {
    host: 'mchf.vercel.app', 'x-forwarded-proto': 'https', ...extra, ...(origin ? {origin} : {}),
  }});
  assert.equal(matchesRequestOrigin(request('https://mchf.vercel.app'), true), true);
  assert.equal(matchesRequestOrigin(request('https://attacker.example'), true), false);
  assert.equal(matchesRequestOrigin(request(undefined), true), false);
  assert.equal(matchesRequestOrigin(request('https://attacker.example', {'x-forwarded-host': 'attacker.example'}), true), false);
  assert.equal(matchesRequestOrigin(request('https://mchf.vercel.app')), false);
  assert.equal(matchesRequestOrigin(new Request('http://localhost:5181/api/auth', {headers: {host: '127.0.0.1:5181', origin: 'http://127.0.0.1:5181'}})), true);
});
