export type PageVisual = {tone:'blue'|'green'|'teal'|'gold'|'clay';image?:string;alt?:string;caption?:string};
const community={image:'/images/hero.jpg',alt:'Mother and child at a community gathering in Sierra Leone',caption:'Community health · Sierra Leone'};
const family={image:'/images/mother-child.jpg',alt:'A mother with her young child in Malawi',caption:'Maternal & child health · Malawi'};
const care={image:'/images/health-worker.jpg',alt:'A nurse caring for newborns at Koidu Government Hospital in Sierra Leone',caption:'Frontline care · Sierra Leone'};
const prevention={image:'/images/immunization.jpg',alt:'A child receiving an immunization in Ethiopia',caption:'Immunization & prevention · Ethiopia'};
export function pageVisual(path:string):PageVisual {
 if(['privacy','accessibility','image-credits','search'].includes(path))return {tone:'blue'};
 if(path.includes('immunization'))return {tone:'green',...prevention};
 if(path.includes('rmnch'))return {tone:'blue',...family};
 if(path.includes('community')||path==='stories'||path==='get-involved')return {tone:'teal',...community};
 if(path.includes('research')||path==='publications'||path==='knowledge'||path.includes('evidence-to-action'))return {tone:'blue',...care};
 if(path.includes('health-systems')||path.includes('stronger-systems')||path==='how-we-work')return {tone:'clay',...care};
 if(path==='partnerships'||path==='contact'||path.startsWith('audiences/'))return {tone:'teal',...community};
 if(path==='strategic-plan-2027-2031'||path==='impact'||path.startsWith('about/'))return {tone:'gold',...care};
 if(path==='about')return {tone:'green',...family};
 if(path==='programmes'||path==='our-work')return {tone:'blue',...community};
 if(path==='news'||path==='events'||path==='careers')return {tone:'green',...community};
 return {tone:'blue'};
}
