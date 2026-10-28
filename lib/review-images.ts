import {stockImages, stockImageFor} from './stock-images';

export const reviewImages = {
  healthSystems: stockImages.healthSystems,
  connectedCare: stockImages.connectedCare,
  community: stockImages.community,
  evidence: stockImages.evidence,
  newborn: stockImages.clinicalCare,
} as const;

export function reviewImageFor(image?: string) {
  return Object.values(reviewImages).find(asset => asset.image === image) || stockImageFor(image);
}
