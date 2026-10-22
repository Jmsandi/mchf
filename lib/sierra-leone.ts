export const geographySource = 'https://www.statistics.sl/images/StatisticsSL/Documents/Census/MTPHC_Preliminary_Report/Final_Preliminary_Report_2021_MTPHC.pdf';

/** Administrative regions and districts, checked against Statistics Sierra Leone. */
export const regions = [
  {id: 'eastern', name: 'Eastern', districts: ['Kailahun', 'Kenema', 'Kono']},
  {id: 'northern', name: 'Northern', districts: ['Bombali', 'Falaba', 'Koinadugu', 'Tonkolili']},
  {id: 'north-western', name: 'North Western', districts: ['Kambia', 'Karene', 'Port Loko']},
  {id: 'southern', name: 'Southern', districts: ['Bo', 'Bonthe', 'Moyamba', 'Pujehun']},
  {id: 'western-area', name: 'Western Area', districts: ['Western Area Rural', 'Western Area Urban']},
] as const;

export const districtCount = regions.reduce((total, region) => total + region.districts.length, 0);

export const sierraLeoneSummaries: Record<string, string> = {
  home: 'A Sierra Leone foundation connecting community voices, public-health learning and stronger systems, with a national focus across all five regions.',
  about: 'Rooted in Sierra Leone, with a shared commitment to the health of women, children, young people and communities in every region.',
  'sierra-leone': 'Five regions. Sixteen districts. A shared national focus, shaped by the priorities of Sierra Leone’s communities.',
  'our-work': 'Follow the development of MCHF’s programme priorities in Sierra Leone. Confirmed projects identify the districts, communities and partners involved.',
  research: 'Questions from Sierra Leone’s communities, learning with local institutions, and evidence that can inform better programme decisions.',
  news: 'Institutional announcements, programme developments and perspectives from MCHF’s work in Sierra Leone.',
  insights: 'Public-health ideas and practical perspectives for Sierra Leone’s communities, health workers and partners.',
  events: 'Learning, dialogue and collaboration for Sierra Leone. Confirmed events include their district, venue and participation details.',
  stories: 'Space for Sierra Leone’s community voices, shared with consent and respect for local experience.',
  careers: 'Bring your skills to a Sierra Leone foundation focused on community participation, useful evidence and stronger health systems.',
  impact: 'Verified findings from Sierra Leone, with the district, period, source and method behind each published result.',
  publications: 'Institutional documents and learning resources for public health in Sierra Leone, openly shared with communities and partners.',
  knowledge: 'Learning guides for Sierra Leone’s communities, health workers and institutions, connecting information with local priorities.',
  'how-we-work': 'Community voices, local institutions and evidence connect MCHF’s approach to equitable health across Sierra Leone.',
  partnerships: 'Connect with MCHF around local priorities in any of Sierra Leone’s five regions, through community, research and institutional collaboration.',
  contact: 'Based in Freetown. Open to conversations with communities, health workers, researchers and partners from every district in Sierra Leone.',
  'get-involved': 'Bring local knowledge, skills and ideas from any district in Sierra Leone to a shared vision for better health.',
  'strategic-plan-2027-2031': 'A five-year framework for Sierra Leone, connecting community participation, evidence and stronger health systems through five programme areas.',
};

export const programmeContext: Record<string, {intro: string; points: [string, string][]}> = {
  rmnch: {
    intro: 'In Sierra Leone, a connected approach brings family and community perspectives into conversations about care through adolescence, pregnancy, birth and childhood.',
    points: [['Listen to women and young people', 'Start with the questions, experiences and priorities people share in their own communities.'], ['Connect local services', 'Consider how community health workers, peripheral health units and referral facilities can support continuity.'], ['Plan for different settings', 'Include rural, island, border and urban communities when exploring practical barriers to access.']],
  },
  immunization: {
    intro: 'The prevention agenda in Sierra Leone starts with listening, clear information and coordination with the health services responsible for vaccination.',
    points: [['Make room for questions', 'Use respectful community discussions to understand concerns and avoid assumptions about why people miss services.'], ['Keep service information local', 'Confirm current service arrangements with the relevant health facility and district health team.'], ['Include people who are missed', 'Explore distance, communication and practical access barriers with caregivers and community representatives.']],
  },
  'community-health': {
    intro: 'Every Sierra Leonean community brings its own knowledge and priorities. Participation should make space for people to influence decisions, as well as receive information.',
    points: [['Use language people understand', 'Plan communication in Krio and relevant local languages, with accessible formats and opportunities to ask questions.'], ['Bring different voices together', 'Include women’s groups, young people, people with disabilities, local leaders and people who are often left out.'], ['Close the feedback loop', 'Explain how community suggestions inform planning and share what can realistically happen next.']],
  },
  'research-innovation': {
    intro: 'Useful evidence begins with questions that matter in Sierra Leone, developed with communities, health workers and local research institutions.',
    points: [['Ask locally relevant questions', 'Explore how the setting, district and delivery arrangements affect a programme question.'], ['Respect people and their information', 'Plan appropriate ethical review, consent and responsible data handling before undertaking a study.'], ['Share findings in useful ways', 'Discuss findings and limitations with the people and institutions who can use the learning.']],
  },
  'health-systems': {
    intro: 'Stronger connections between communities, peripheral health units, hospitals and district health teams are central to a locally grounded approach in Sierra Leone.',
    points: [['Work with local institutions', 'Develop proposals with the relevant district health management team and service partners.'], ['Support frontline learning', 'Identify capacity and coordination needs with the people delivering care.'], ['Build for continuity', 'Consider referral communication, local ownership and the resources needed to sustain an improvement.']],
  },
};
