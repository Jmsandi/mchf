export const reviewImages = {
  healthSystems: {
    image: '/images/review/health-systems-partnerships.jpg',
    alt: 'Programme illustration showing collaboration between health workers, communities and institutional partners',
    caption: 'Stronger health systems through strategic partnerships',
    kind: 'illustration',
  },
  connectedCare: {
    image: '/images/review/connected-care.jpg',
    alt: 'Health workers joining gloved hands in a circle to represent coordinated care',
    caption: 'Care, coordination and collaboration',
    kind: 'photograph',
  },
  community: {
    image: '/images/review/community-partnerships.jpg',
    alt: 'Community partnership illustration featuring a pregnant woman in conversation with a health worker',
    caption: 'Communities are partners in change',
    kind: 'illustration',
  },
  evidence: {
    image: '/images/review/evidence-to-action.jpg',
    alt: 'Programme illustration of a health worker discussing information on a tablet with a mother holding her baby',
    caption: 'From local evidence to better programme decisions',
    kind: 'illustration',
  },
  newborn: {
    image: '/images/review/newborn-care.jpg',
    alt: 'A newborn on an examination surface, with a caregiver supporting the baby’s hand',
    caption: 'Care at the beginning of life',
    kind: 'photograph',
  },
} as const;

export function reviewImageFor(image?: string) {
  return Object.values(reviewImages).find(asset => asset.image === image);
}
