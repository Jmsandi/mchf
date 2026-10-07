export type StockPhoto = {
  image: string;
  alt: string;
  caption: string;
  photographer: string;
  source: string;
  download: string;
  license: string;
};

const license = 'https://www.pexels.com/license/';

/** Licensed photographs downloaded on 7 October 2026 and resized for local delivery. */
export const stockImages = {
  maternal: {
    image: '/images/stock/maternal-care.jpg',
    alt: 'A smiling mother holding her baby in a bright room',
    caption: 'Care through the stages of life',
    photographer: 'William Fortunato',
    source: 'https://www.pexels.com/photo/smiling-mother-and-baby-looking-at-camera-6393377/',
    download: 'https://images.pexels.com/photos/6393377/pexels-photo-6393377.jpeg',
    license,
  },
  vaccination: {
    image: '/images/stock/vaccination.jpg',
    alt: 'A health professional administering a vaccination to a seated woman, both wearing masks',
    caption: 'Prevention through trusted care',
    photographer: 'Gustavo Fring',
    source: 'https://www.pexels.com/photo/a-woman-getting-vaccinated-8770701/',
    download: 'https://images.pexels.com/photos/8770701/pexels-photo-8770701.jpeg',
    license,
  },
  communityLearning: {
    image: '/images/stock/community-learning.jpg',
    alt: 'Women exchanging ideas around a meeting table',
    caption: 'Participation starts with listening',
    photographer: 'RDNE Stock project',
    source: 'https://www.pexels.com/photo/office-indoors-diversity-collaboration-7490884/',
    download: 'https://images.pexels.com/photos/7490884/pexels-photo-7490884.jpeg',
    license,
  },
  researchLearning: {
    image: '/images/stock/research-learning.jpg',
    alt: 'Researchers working with laboratory equipment and sample containers',
    caption: 'Learning through careful investigation',
    photographer: 'Polina Tankilevitch',
    source: 'https://www.pexels.com/photo/scientists-in-laboratory-3735780/',
    download: 'https://images.pexels.com/photos/3735780/pexels-photo-3735780.jpeg',
    license,
  },
  clinicalCare: {
    image: '/images/stock/clinical-care.jpg',
    alt: 'A clinician discussing a care document with a patient in a clinic hallway',
    caption: 'Clear communication, connected care',
    photographer: 'Klaus Nielsen',
    source: 'https://www.pexels.com/photo/doctor-showing-diagnosis-to-black-woman-patient-in-hallway-of-clinic-6303645/',
    download: 'https://images.pexels.com/photos/6303645/pexels-photo-6303645.jpeg',
    license,
  },
  healthSystems: {
    image: '/images/stock/health-system-team.jpg',
    alt: 'Health workers reviewing information together in a bright clinic',
    caption: 'Stronger health systems through collaboration',
    photographer: 'Kaboompics',
    source: 'https://www.pexels.com/photo/health-care-workers-working-together-6627926/',
    download: 'https://images.pexels.com/photos/6627926/pexels-photo-6627926.jpeg',
    license,
  },
  community: {
    image: '/images/stock/community-partnerships.jpg',
    alt: 'A group of women sharing ideas and planning together around a table',
    caption: 'Communities are partners in change',
    photographer: 'Yan Krukau',
    source: 'https://www.pexels.com/photo/women-discussing-a-work-together-8837496/',
    download: 'https://images.pexels.com/photos/8837496/pexels-photo-8837496.jpeg',
    license,
  },
  evidence: {
    image: '/images/stock/evidence-research.jpg',
    alt: 'A researcher wearing safety glasses examining a sample in a laboratory',
    caption: 'Evidence that informs better decisions',
    photographer: 'RF._.studio',
    source: 'https://www.pexels.com/photo/focused-african-american-researcher-conducting-biochemical-experiment-in-clinic-3825434/',
    download: 'https://images.pexels.com/photos/3825434/pexels-photo-3825434.jpeg',
    license,
  },
} satisfies Record<string, StockPhoto>;

export function stockImageFor(image?: string) {
  return Object.values(stockImages).find(photo => photo.image === image);
}

/** Replace exact retired asset URLs in previously saved CMS records. */
export const retiredImageReplacements: Record<string, StockPhoto> = {
  '/images/learning-rmnch.jpg': stockImages.maternal,
  '/images/learning-immunization.jpg': stockImages.vaccination,
  '/images/learning-community-health.jpg': stockImages.communityLearning,
  '/images/learning-research-innovation.jpg': stockImages.researchLearning,
  '/images/learning-health-systems.jpg': stockImages.clinicalCare,
  '/images/review/health-systems-partnerships.jpg': stockImages.healthSystems,
  '/images/review/community-partnerships.jpg': stockImages.community,
  '/images/review/evidence-to-action.jpg': stockImages.evidence,
};
