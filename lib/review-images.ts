import {stockImages, stockImageFor} from './stock-images';

export const reviewImages = {
  healthSystems: stockImages.healthSystems,
  connectedCare: {
    image: '/images/review/connected-care.jpg',
    alt: 'Health workers joining gloved hands in a circle to represent coordinated care',
    caption: 'Care, coordination and collaboration',
  },
  community: stockImages.community,
  evidence: stockImages.evidence,
  newborn: {
    image: '/images/review/newborn-care.jpg',
    alt: 'A newborn on an examination surface, with a caregiver supporting the baby’s hand',
    caption: 'Care at the beginning of life',
  },
} as const;

export function reviewImageFor(image?: string) {
  return Object.values(reviewImages).find(asset => asset.image === image) || stockImageFor(image);
}
