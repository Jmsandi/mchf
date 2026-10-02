import {programmes,listingRoutes,routeFor} from '@/lib/content';
import {publicContent} from '@/lib/store';
import {siteUrl} from '@/lib/site-url';
export const dynamic='force-dynamic';
export default async function sitemap(){
  const root=siteUrl();
  const {records}=await publicContent();
  const paths=new Set(['','/about','/about/governance','/about/leadership','/programmes',...programmes.map(p=>'/programmes/'+p.slug),'/strategic-plan-2027-2031','/how-we-work','/partnerships','/contact','/get-involved',...Object.keys(listingRoutes).map(p=>'/'+p)]);
  for(const r of records){if(['activity','intervention','contact','setting'].includes(r.kind))continue;paths.add(routeFor(r)==='/'?'':routeFor(r));}
  return [...paths].map(path=>({url:root+path}));
}
