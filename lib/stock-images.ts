export type StockPhoto = {
  image: string;
  alt: string;
  caption: string;
  photographer: string;
  source: string;
  download: string;
  license: string;
  licenseLabel: string;
  location: string;
  year: string;
  kind: 'documentary' | 'stock';
};

/** Sierra Leone documentary photographs and licensed stock photography, with explicit source context. */
export const stockImages = {
  "maternal": {
    "image": "/images/sierra-leone/mother-and-child.jpg",
    "alt": "A mother holding her child outdoors in Sierra Leone",
    "caption": "Families and community life · Sierra Leone",
    "photographer": "Alicia Clark / USAID",
    "source": "https://commons.wikimedia.org/wiki/File:Sierra_Leone_Ebola_Recovery,_Community_Engagment_and_Health_Posts_(25166400034).jpg",
    "download": "https://upload.wikimedia.org/wikipedia/commons/6/68/Sierra_Leone_Ebola_Recovery%2C_Community_Engagment_and_Health_Posts_%2825166400034%29.jpg",
    "license": "https://commons.wikimedia.org/wiki/File:Sierra_Leone_Ebola_Recovery,_Community_Engagment_and_Health_Posts_(25166400034).jpg#Licensing",
    "licenseLabel": "Public domain",
    "location": "Sierra Leone",
    "year": "2016",
    "kind": "documentary"
  },
  "vaccination": {
    "image": "/images/sierra-leone/rural-health-promotion.jpg",
    "alt": "Health promoters with a bicycle used to reach rural communities in Sierra Leone",
    "caption": "Community health promotion · Sierra Leone",
    "photographer": "P. Nshimirimana / USAID",
    "source": "https://commons.wikimedia.org/wiki/File:Rural_health_care_(8329317253).jpg",
    "download": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Rural_health_care_%288329317253%29.jpg",
    "license": "https://commons.wikimedia.org/wiki/File:Rural_health_care_(8329317253).jpg#Licensing",
    "licenseLabel": "Public domain",
    "location": "Sierra Leone",
    "year": "2012",
    "kind": "documentary"
  },
  "communityLearning": {
    "image": "/images/sierra-leone/community-theatre-mile-91.jpg",
    "alt": "An audience attending a community health theatre performance in Mile 91, Sierra Leone",
    "caption": "Community health education · Mile 91",
    "photographer": "Annabel Symington",
    "source": "https://commons.wikimedia.org/wiki/File:Flickr_-_stringer_bel_-_Community_theatre_in_Mile_91,_Sierra_Leone.jpg",
    "download": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Flickr_-_stringer_bel_-_Community_theatre_in_Mile_91%2C_Sierra_Leone.jpg",
    "license": "https://creativecommons.org/licenses/by/2.0",
    "licenseLabel": "CC BY 2.0",
    "location": "Mile 91, Tonkolili District",
    "year": "2009",
    "kind": "documentary"
  },
  "researchLearning": {
    "image": "/images/stock/microscope-research.jpg",
    "alt": "Black scientist examining a sample through a microscope",
    "caption": "Learning through careful investigation",
    "photographer": "Artem Podrez",
    "source": "https://www.pexels.com/photo/a-man-looking-through-the-microscope-5726708/",
    "download": "https://images.pexels.com/photos/5726708/pexels-photo-5726708.jpeg",
    "license": "https://www.pexels.com/license/",
    "licenseLabel": "Pexels licence",
    "location": "Stock photography; location not specified",
    "year": "2020",
    "kind": "stock"
  },
  "clinicalCare": {
    "image": "/images/sierra-leone/koidu-newborn-care.jpg",
    "alt": "A nurse caring for a baby in the Special Care Baby Unit at Koidu Government Hospital, Sierra Leone",
    "caption": "Newborn care · Koidu",
    "photographer": "John Green / vlogbrothers",
    "source": "https://commons.wikimedia.org/wiki/File:Baby_unit_of_Koidu_Government_Hospital_Sierra_Leone_02.png",
    "download": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Baby_unit_of_Koidu_Government_Hospital_Sierra_Leone_02.png",
    "license": "https://creativecommons.org/licenses/by/3.0",
    "licenseLabel": "CC BY 3.0",
    "location": "Koidu, Kono District",
    "year": "2023",
    "kind": "documentary"
  },
  "healthSystems": {
    "image": "/images/sierra-leone/koidu-health-workers.jpg",
    "alt": "Health workers reviewing information inside Koidu Government Hospital in Sierra Leone",
    "caption": "Frontline health workers · Koidu",
    "photographer": "John Green / vlogbrothers",
    "source": "https://commons.wikimedia.org/wiki/File:Koidu_Government_Hospital_Sierra_Leone_2020_04.png",
    "download": "https://upload.wikimedia.org/wikipedia/commons/5/50/Koidu_Government_Hospital_Sierra_Leone_2020_04.png",
    "license": "https://creativecommons.org/licenses/by/3.0",
    "licenseLabel": "CC BY 3.0",
    "location": "Koidu, Kono District",
    "year": "2020",
    "kind": "documentary"
  },
  "community": {
    "image": "/images/sierra-leone/community-dialogue.jpg",
    "alt": "Community members gathered outdoors for a discussion in Sierra Leone",
    "caption": "Community dialogue · Sierra Leone",
    "photographer": "Alicia Clark / USAID",
    "source": "https://commons.wikimedia.org/wiki/File:Sierra_Leone_Ebola_Recovery,_Community_Engagment_and_Health_Posts_(25770814266).jpg",
    "download": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Sierra_Leone_Ebola_Recovery%2C_Community_Engagment_and_Health_Posts_%2825770814266%29.jpg",
    "license": "https://commons.wikimedia.org/wiki/File:Sierra_Leone_Ebola_Recovery,_Community_Engagment_and_Health_Posts_(25770814266).jpg#Licensing",
    "licenseLabel": "Public domain",
    "location": "Sierra Leone",
    "year": "2016",
    "kind": "documentary"
  },
  "evidence": {
    "image": "/images/stock/laboratory-research.jpg",
    "alt": "Black researcher in safety glasses working with a pipette and sample in a laboratory",
    "caption": "Research and scientific evidence",
    "photographer": "RF._.studio",
    "source": "https://www.pexels.com/photo/focused-african-american-researcher-conducting-biochemical-experiment-in-clinic-3825434/",
    "download": "https://images.pexels.com/photos/3825434/pexels-photo-3825434.jpeg",
    "license": "https://www.pexels.com/license/",
    "licenseLabel": "Pexels licence",
    "location": "Stock photography; location not specified",
    "year": "2020",
    "kind": "stock"
  },
  "hero": {
    "image": "/images/hero.jpg",
    "alt": "A mother and child at a gathering outside a children’s hospital in Sierra Leone",
    "caption": "Families and access to care · Sierra Leone",
    "photographer": "Robert Yates / DFID",
    "source": "https://commons.wikimedia.org/wiki/File:Maternal_health_(4798750001).jpg",
    "download": "https://live.staticflickr.com/4115/4798750001_aaeefe7620_o.jpg",
    "license": "https://creativecommons.org/licenses/by/2.0/",
    "licenseLabel": "CC BY 2.0",
    "location": "Sierra Leone",
    "year": "2010",
    "kind": "documentary"
  },
  "connectedCare": {
    "image": "/images/stock/frontline-nurse.jpg",
    "alt": "Black health professional in scrubs reviewing information on a tablet",
    "caption": "Frontline care and coordination",
    "photographer": "Laura James",
    "source": "https://www.pexels.com/photo/black-physician-in-uniform-with-clipboard-at-work-6097761/",
    "download": "https://images.pexels.com/photos/6097761/pexels-photo-6097761.jpeg",
    "license": "https://www.pexels.com/license/",
    "licenseLabel": "Pexels licence",
    "location": "Stock photography; location not specified",
    "year": "2020",
    "kind": "stock"
  },
  "communityFeature": {
    "image": "/images/stock/women-conversation.jpg",
    "alt": "Three Black women sharing ideas in a group discussion",
    "caption": "Community voices and shared decisions",
    "photographer": "PICHA Stock",
    "source": "https://www.pexels.com/photo/women-talking-to-each-other-3894383/",
    "download": "https://images.pexels.com/photos/3894383/pexels-photo-3894383.jpeg",
    "license": "https://www.pexels.com/license/",
    "licenseLabel": "Pexels licence",
    "location": "Stock photography; location not specified",
    "year": "2020",
    "kind": "stock"
  },
  "partnerships": {
    "image": "/images/stock/women-meeting.jpg",
    "alt": "Black women exchanging ideas together in a bright shared workspace",
    "caption": "Collaboration and shared purpose",
    "photographer": "PICHA Stock",
    "source": "https://www.pexels.com/photo/women-having-a-conversation-3869641/",
    "download": "https://images.pexels.com/photos/3869641/pexels-photo-3869641.jpeg",
    "license": "https://www.pexels.com/license/",
    "licenseLabel": "Pexels licence",
    "location": "Stock photography; location not specified",
    "year": "2020",
    "kind": "stock"
  },
  "participation": {
    "image": "/images/stock/women-collaboration.jpg",
    "alt": "Four Black women listening and talking together around a table",
    "caption": "Listening, participation and inclusion",
    "photographer": "PICHA Stock",
    "source": "https://www.pexels.com/photo/women-sitting-on-a-couch-3894375/",
    "download": "https://images.pexels.com/photos/3894375/pexels-photo-3894375.jpeg",
    "license": "https://www.pexels.com/license/",
    "licenseLabel": "Pexels licence",
    "location": "Stock photography; location not specified",
    "year": "2020",
    "kind": "stock"
  },
  "academic": {
    "image": "/images/stock/research-notes.jpg",
    "alt": "Black researcher writing and reviewing scientific notes at a desk",
    "caption": "Knowledge, learning and innovation",
    "photographer": "RF._.studio",
    "source": "https://www.pexels.com/photo/focused-african-american-teenage-chemist-working-on-formula-in-scientific-center-3825461/",
    "download": "https://images.pexels.com/photos/3825461/pexels-photo-3825461.jpeg",
    "license": "https://www.pexels.com/license/",
    "licenseLabel": "Pexels licence",
    "location": "Stock photography; location not specified",
    "year": "2020",
    "kind": "stock"
  },
  "evidenceStory": {
    "image": "/images/stock/laboratory-experiment.jpg",
    "alt": "Black scientist carefully examining a laboratory experiment",
    "caption": "From investigation to useful evidence",
    "photographer": "Kindel Media",
    "source": "https://www.pexels.com/photo/man-in-white-coat-doing-an-experiment-8326492/",
    "download": "https://images.pexels.com/photos/8326492/pexels-photo-8326492.jpeg",
    "license": "https://www.pexels.com/license/",
    "licenseLabel": "Pexels licence",
    "location": "Stock photography; location not specified",
    "year": "2021",
    "kind": "stock"
  },
  "preventionLearning": {
    "image": "/images/stock/prevention-learning.jpg",
    "alt": "Smiling Black health professional wearing a white coat and holding a notebook",
    "caption": "Clear information from health professionals",
    "photographer": "Tessy Agbonome",
    "source": "https://www.pexels.com/photo/smiling-doctor-sitting-in-a-chair-18828742/",
    "download": "https://images.pexels.com/photos/18828742/pexels-photo-18828742.jpeg",
    "license": "https://www.pexels.com/license/",
    "licenseLabel": "Pexels licence",
    "location": "Stock photography; location not specified",
    "year": "2023",
    "kind": "stock"
  },
  "systemsLearning": {
    "image": "/images/sierra-leone/kenema-health-worker-transport.jpg",
    "alt": "Motorcycles distributed for health workers by the district health team in Kenema, Sierra Leone",
    "caption": "Supporting health-worker transport · Kenema",
    "photographer": "Paul Lamin Musa",
    "source": "https://commons.wikimedia.org/wiki/File:IMotor_Bikes_for_Health_Workers_01.jpg",
    "download": "https://upload.wikimedia.org/wikipedia/commons/f/f7/IMotor_Bikes_for_Health_Workers_01.jpg",
    "license": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "licenseLabel": "CC0",
    "location": "Kenema District",
    "year": "2026",
    "kind": "documentary"
  }
} satisfies Record<string, StockPhoto>;

export function stockImageFor(image?: string) {
  return Object.values(stockImages).find(photo => photo.image === image);
}

export const retiredImageReplacements: Record<string, StockPhoto> = {
  '/images/sierra-leone/port-loko-laboratory.jpg': stockImages.evidence,
  '/images/learning-rmnch.jpg': stockImages.maternal,
  '/images/learning-immunization.jpg': stockImages.vaccination,
  '/images/learning-community-health.jpg': stockImages.communityLearning,
  '/images/learning-research-innovation.jpg': stockImages.researchLearning,
  '/images/learning-health-systems.jpg': stockImages.clinicalCare,
  '/images/review/health-systems-partnerships.jpg': stockImages.healthSystems,
  '/images/review/community-partnerships.jpg': stockImages.community,
  '/images/review/evidence-to-action.jpg': stockImages.evidence,
  "/images/stock/maternal-care.jpg": stockImages.maternal,
  "/images/stock/vaccination.jpg": stockImages.vaccination,
  "/images/stock/community-learning.jpg": stockImages.communityLearning,
  "/images/stock/research-learning.jpg": stockImages.researchLearning,
  "/images/stock/clinical-care.jpg": stockImages.clinicalCare,
  "/images/stock/health-system-team.jpg": stockImages.healthSystems,
  "/images/stock/community-partnerships.jpg": stockImages.community,
  "/images/stock/evidence-research.jpg": stockImages.evidence,
  "/images/mother-child.jpg": stockImages.maternal,
  "/images/immunization.jpg": stockImages.vaccination,
  "/images/health-worker.jpg": stockImages.clinicalCare,
  "/images/review/newborn-care.jpg": stockImages.clinicalCare,
  "/images/review/connected-care.jpg": stockImages.community,
};
