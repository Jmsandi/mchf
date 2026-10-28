import {reviewImages} from '@/lib/review-images';
import {stockImages} from '@/lib/stock-images';
export type PageVisual = {tone:'blue'|'green'|'teal'|'gold'|'clay';image?:string;alt?:string;caption?:string};

export function pageVisual(path:string):PageVisual {
 if(['privacy','accessibility','image-credits','search'].includes(path))return {tone:'blue'};
 if(path.includes('immunization'))return {tone:'green',...stockImages.vaccination};
 if(path.includes('rmnch'))return {tone:'blue',...reviewImages.newborn};
 if(path.includes('community'))return {tone:'teal',...stockImages.community};
 if(path==='stories')return {tone:'teal',...stockImages.hero};
 if(path==='get-involved')return {tone:'teal',...stockImages.community};
 if(path.includes('research')||path.includes('evidence-to-action'))return {tone:'blue',...stockImages.evidence};
 if(path==='publications'||path==='knowledge')return {tone:'blue',...stockImages.academic};
 if(path.includes('health-systems')||path.includes('stronger-systems'))return {tone:'clay',...stockImages.healthSystems};
 if(path==='how-we-work')return {tone:'clay',...stockImages.connectedCare};
 if(path==='partnerships'||path==='careers')return {tone:'teal',...stockImages.partnerships};
 if(path==='contact')return {tone:'teal',...stockImages.maternal};
 if(path.startsWith('audiences/')){
  if(path.endsWith('health-institutions'))return {tone:'teal',...stockImages.healthSystems};
  if(path.endsWith('academic-institutions'))return {tone:'blue',...stockImages.academic};
  return {tone:'teal',...stockImages.partnerships};
 }
 if(path==='strategic-plan-2027-2031')return {tone:'gold',...stockImages.academic};
 if(path==='impact'||path.startsWith('about/'))return {tone:'gold',...stockImages.healthSystems};
 if(path==='about')return {tone:'green',...stockImages.communityLearning};
 if(path==='programmes'||path==='our-work')return {tone:'blue',...stockImages.hero};
 if(path==='news')return {tone:'green',...stockImages.communityFeature};
 if(path==='events')return {tone:'green',...stockImages.communityLearning};
 return {tone:'blue'};
}
