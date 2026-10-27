import { CohortMetric } from '../types';

export const cohortMetrics: CohortMetric[] = [
  {
    district: 'Chennai',
    totalLearners: 12450,
    vocationalRatio: 38,
    skillsVerified: 48920,
    placedOrMatched: 8940,
    topSkills: ['React & TypeScript', 'Accessibility (WCAG)', 'REST APIs', 'SQL Database']
  },
  {
    district: 'Coimbatore',
    totalLearners: 8920,
    vocationalRatio: 52,
    skillsVerified: 36240,
    placedOrMatched: 6810,
    topSkills: ['Industrial Machine Operation', 'Frontend Dev', 'SQL Queries', 'Safety Standards']
  },
  {
    district: 'Tiruppur',
    totalLearners: 7430,
    vocationalRatio: 78,
    skillsVerified: 29800,
    placedOrMatched: 6150,
    topSkills: ['Garment Construction', 'Pattern Cutting', 'Bias Piping', 'Export QC']
  },
  {
    district: 'Madurai',
    totalLearners: 6840,
    vocationalRatio: 64,
    skillsVerified: 24150,
    placedOrMatched: 4920,
    topSkills: ['Domestic Wiring', 'Blouse Drafting', 'React UI', 'Measurement Systems']
  },
  {
    district: 'Tiruchirappalli (Trichy)',
    totalLearners: 5910,
    vocationalRatio: 46,
    skillsVerified: 21300,
    placedOrMatched: 4210,
    topSkills: ['JavaScript DOM', 'Semantic HTML', 'Solar Maintenance', 'MIS Excel']
  },
  {
    district: 'Salem',
    totalLearners: 4820,
    vocationalRatio: 61,
    skillsVerified: 17400,
    placedOrMatched: 3450,
    topSkills: ['Conduit Wiring', 'PowerBI Analytics', 'Apparel Stitching', 'Safety IS 5216']
  },
  {
    district: 'Tirunelveli',
    totalLearners: 3950,
    vocationalRatio: 58,
    skillsVerified: 14200,
    placedOrMatched: 2890,
    topSkills: ['Wind Substation Wiring', 'Pattern Drafting', 'Web Layouts', 'SQL Aggregations']
  }
];

export const platformStats = {
  category: 'Demo cohort (sample)',
  totalLearnersActive: 50320,
  evidenceProofsVerified: 192010,
  status: 'Illustrative',
  districtsCovered: 38,
  avgTimeToFirstProof: '3.8 days (Sample)',
  mentorEndorsements: 14280,
  vocationalToTechRatio: '56% / 44%'
};
