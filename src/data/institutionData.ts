export interface FunnelStage {
  id: string;
  stageName: string;
  stageNameTamil: string;
  learnersCount: number;
  conversionRate: number; // percentage from start
  dropoffRate: number; // percentage dropped from previous stage
  diagnosticInsight: string;
  diagnosticInsightTamil: string;
  actionRecommendation: string;
}

export interface HeatmapCell {
  skillId: string;
  skillName: string;
  skillNameTamil: string;
  cohortId: string;
  cohortName: string;
  score: number; // 0-100
  status: 'strong' | 'moderate' | 'gap';
  gapSize: number; // 100 - score
  affectedCount: number;
  remediationAction: string;
}

export interface AtRiskLearner {
  id: string;
  name: string;
  nameTamil: string;
  avatar: string;
  district: string;
  cohortName: string;
  pathwayId: string;
  pathwayTitle: string;
  stalledMilestone: string;
  stalledMilestoneTamil: string;
  daysStalled: number;
  currentRubricScore: number;
  riskLevel: 'high' | 'moderate';
  suggestedIntervention: string;
  suggestedInterventionTamil: string;
  interventionType: 'peer_pairing' | 'bilingual_walkthrough' | 'mentor_viva' | 'offline_lab';
  interventionTriggered: boolean;
}

export interface DistrictCohortOverview {
  district: string;
  districtTamil: string;
  totalLearners: number;
  activeThisWeek: number;
  activePercentage: number;
  completionRate: number;
  avgReadiness: number;
  vivaAuthenticityRate: number;
  funnel: FunnelStage[];
  atRiskCount: number;
}

export const districtOverviews: Record<string, DistrictCohortOverview> = {
  'all': {
    district: 'All Districts (Tamil Nadu)',
    districtTamil: 'அனைத்து மாவட்டங்கள் (தமிழ்நாடு)',
    totalLearners: 2840,
    activeThisWeek: 2190,
    activePercentage: 77.1,
    completionRate: 68.4,
    avgReadiness: 76.2,
    vivaAuthenticityRate: 91.5,
    atRiskCount: 8,
    funnel: [
      {
        id: 'stage-1',
        stageName: 'Enrolled & Diagnostic Completed',
        stageNameTamil: 'பதிவு & தொடக்க மதிப்பீடு',
        learnersCount: 2840,
        conversionRate: 100,
        dropoffRate: 0,
        diagnosticInsight: 'Baseline onboarded: 100% of cohort successfully completed Tamil/English diagnostic skill tree.',
        diagnosticInsightTamil: 'அனைத்து மாணவர்களும் தொடக்க திறன் வரைபடத்தை வெற்றிகரமாக முடித்தனர்.',
        actionRecommendation: 'Maintain fast onboarding momentum with instant milestone 1 prompt.'
      },
      {
        id: 'stage-2',
        stageName: 'Milestone 1 Proof Submitted',
        stageNameTamil: 'மைல்கல் 1 சான்று சமர்ப்பிப்பு',
        learnersCount: 2390,
        conversionRate: 84.2,
        dropoffRate: 15.8,
        diagnosticInsight: 'High engagement on initial HTML semantics and fabric measurement calibration.',
        diagnosticInsightTamil: 'ஆரம்ப HTML மற்றும் ஆடை அளவீட்டு சான்றுகளில் சிறப்பான ஈடுபாடு.',
        actionRecommendation: 'Send nudge to 450 learners who have drafted code but not submitted.'
      },
      {
        id: 'stage-3',
        stageName: 'Oral Defense / Viva Voce Completed',
        stageNameTamil: 'வாய்மொழி விளக்கம் / நேர்காணல் நிறைவு',
        learnersCount: 2030,
        conversionRate: 71.5,
        dropoffRate: 15.1,
        diagnosticInsight: 'Spoken confidence strong in bilingual Tamil/English; minor hesitation on architectural tradeoffs.',
        diagnosticInsightTamil: 'இருமொழி வாய்மொழி விளக்கத்தில் நல்ல தன்னம்பிக்கை காணப்படுகிறது.',
        actionRecommendation: 'Provide 30-second practice warm-up via /interview before live defense.'
      },
      {
        id: 'stage-4',
        stageName: 'Multi-File Project Rubric Passed',
        stageNameTamil: 'முழுமையான திட்டப்பணி தேர்ச்சி',
        learnersCount: 1670,
        conversionRate: 58.8,
        dropoffRate: 17.7,
        diagnosticInsight: 'Largest drop-off drop point: Learners struggle with REST API caching and complex seam tolerances.',
        diagnosticInsightTamil: 'அதிக இடைவெளி: REST API சேமிப்பு மற்றும் சிக்கலான தையல் முறையில் மாணவர்கள் சிரமப்படுகின்றனர்.',
        actionRecommendation: 'Deploy micro-tutorial on debounced fetch and 320px flex wrapping.'
      },
      {
        id: 'stage-5',
        stageName: 'Workplace Ready / Opportunity Matched',
        stageNameTamil: 'பணித்தயார்நிலை & வாய்ப்பு பொருத்தம்',
        learnersCount: 1310,
        conversionRate: 46.2,
        dropoffRate: 21.6,
        diagnosticInsight: '1,310 candidates hold 75%+ readiness scores and are shortlisted for local district jobs and apprenticeships.',
        diagnosticInsightTamil: '1,310 மாணவர்கள் 75%+ தயார்நிலை மதிப்பெண்ணுடன் வேலைவாய்ப்பிற்கு தகுதி பெற்றுள்ளனர்.',
        actionRecommendation: 'Connect cohort directly with Skill India and NAPS industrial partners.'
      }
    ]
  },
  'trichy': {
    district: 'Tiruchirappalli (Trichy)',
    districtTamil: 'திருச்சிராப்பள்ளி (திருச்சி)',
    totalLearners: 580,
    activeThisWeek: 465,
    activePercentage: 80.2,
    completionRate: 72.1,
    avgReadiness: 78.4,
    vivaAuthenticityRate: 93.0,
    atRiskCount: 2,
    funnel: [
      { id: 't-1', stageName: 'Enrolled & Diagnostic Completed', stageNameTamil: 'பதிவு & தொடக்க மதிப்பீடு', learnersCount: 580, conversionRate: 100, dropoffRate: 0, diagnosticInsight: 'Trichy BCA and Govt ITI cohort baseline complete.', diagnosticInsightTamil: 'திருச்சி கல்லூரி மாணவர்கள் அனைவரும் பதிவு செய்தனர்.', actionRecommendation: 'Maintain steady progress.' },
      { id: 't-2', stageName: 'Milestone 1 Proof Submitted', stageNameTamil: 'மைல்கல் 1 சான்று சமர்ப்பிப்பு', learnersCount: 510, conversionRate: 87.9, dropoffRate: 12.1, diagnosticInsight: 'Strong responsive web submissions.', diagnosticInsightTamil: 'வலைப்பக்க வடிவமைப்பில் நல்ல தேர்ச்சி.', actionRecommendation: 'Peer pairing with Priya Soundararajan.' },
      { id: 't-3', stageName: 'Oral Defense / Viva Voce Completed', stageNameTamil: 'வாய்மொழி விளக்கம் நிறைவு', learnersCount: 450, conversionRate: 77.6, dropoffRate: 11.8, diagnosticInsight: 'High authenticity in Tamil technical articulation.', diagnosticInsightTamil: 'தமிழில் தொழில்நுட்ப விளக்கம் சிறப்பு.', actionRecommendation: 'Encourage technical interview sessions.' },
      { id: 't-4', stageName: 'Multi-File Project Rubric Passed', stageNameTamil: 'முழுமையான திட்டப்பணி தேர்ச்சி', learnersCount: 380, conversionRate: 65.5, dropoffRate: 15.6, diagnosticInsight: 'REST API integration needs peer review.', diagnosticInsightTamil: 'REST API திட்டங்களில் கூடுதல் உதவி தேவை.', actionRecommendation: 'Organize college weekend code lab.' },
      { id: 't-5', stageName: 'Workplace Ready / Opportunity Matched', stageNameTamil: 'பணித்தயார்நிலை & வாய்ப்பு பொருத்தம்', learnersCount: 320, conversionRate: 55.2, dropoffRate: 15.8, diagnosticInsight: '320 candidates ready for Chennai/Trichy tech corridor roles.', diagnosticInsightTamil: '320 மாணவர்கள் பணிக்கு தயார்.', actionRecommendation: 'Dispatch verified Skill Passports.' }
    ]
  },
  'tiruppur': {
    district: 'Tiruppur',
    districtTamil: 'திருப்பூர்',
    totalLearners: 640,
    activeThisWeek: 515,
    activePercentage: 80.5,
    completionRate: 74.5,
    avgReadiness: 81.2,
    vivaAuthenticityRate: 94.2,
    atRiskCount: 2,
    funnel: [
      { id: 'tp-1', stageName: 'Enrolled & Diagnostic Completed', stageNameTamil: 'பதிவு & தொடக்க மதிப்பீடு', learnersCount: 640, conversionRate: 100, dropoffRate: 0, diagnosticInsight: 'Vocational garment cluster enrollment 100%.', diagnosticInsightTamil: 'ஆடை வடிவமைப்பு கிளஸ்டர் பதிவு நிறைவு.', actionRecommendation: 'Standardize tape measures across centers.' },
      { id: 'tp-2', stageName: 'Milestone 1 Proof Submitted', stageNameTamil: 'மைல்கல் 1 சான்று சமர்ப்பிப்பு', learnersCount: 560, conversionRate: 87.5, dropoffRate: 12.5, diagnosticInsight: 'Photographic inspection proofs verified.', diagnosticInsightTamil: 'புகைப்பட சான்றுகள் சரிபார்க்கப்பட்டன.', actionRecommendation: 'Approve ease charts.' },
      { id: 'tp-3', stageName: 'Oral Defense / Viva Voce Completed', stageNameTamil: 'வாய்மொழி விளக்கம் நிறைவு', learnersCount: 490, conversionRate: 76.6, dropoffRate: 12.5, diagnosticInsight: 'Master pattern cutters articulate grain lines with high precision.', diagnosticInsightTamil: 'துணி இழை வடிவமைப்பு விளக்கம் மிக நன்று.', actionRecommendation: 'Mentor endorsement by K. Senthil Nathan.' },
      { id: 'tp-4', stageName: 'Multi-File Project Rubric Passed', stageNameTamil: 'முழுமையான திட்டப்பணி தேர்ச்சி', learnersCount: 420, conversionRate: 65.6, dropoffRate: 14.3, diagnosticInsight: 'Collar piping and tension balance passed.', diagnosticInsightTamil: 'காலர் பைப்பிங் மற்றும் இழுவிசை சோதனை தேர்ச்சி.', actionRecommendation: 'Export house quality control test.' },
      { id: 'tp-5', stageName: 'Workplace Ready / Opportunity Matched', stageNameTamil: 'பணித்தயார்நிலை & வாய்ப்பு பொருத்தம்', learnersCount: 360, conversionRate: 56.3, dropoffRate: 14.3, diagnosticInsight: '360 artisans matched with Tiruppur export apparel units.', diagnosticInsightTamil: '360 கைவினைஞர்கள் ஆடை நிறுவனங்களுடன் இணைக்கப்பட்டனர்.', actionRecommendation: 'Direct boutique and SHG contracts.' }
    ]
  },
  'coimbatore': {
    district: 'Coimbatore',
    districtTamil: 'கோயம்புத்தூர்',
    totalLearners: 520,
    activeThisWeek: 395,
    activePercentage: 76.0,
    completionRate: 66.8,
    avgReadiness: 75.8,
    vivaAuthenticityRate: 90.8,
    atRiskCount: 2,
    funnel: [
      { id: 'cb-1', stageName: 'Enrolled & Diagnostic Completed', stageNameTamil: 'பதிவு & தொடக்க மதிப்பீடு', learnersCount: 520, conversionRate: 100, dropoffRate: 0, diagnosticInsight: 'Data analytics & industrial electrical cohorts enrolled.', diagnosticInsightTamil: 'தரவு ஆய்வாளர் மற்றும் தொழில்துறை பயிற்சி மாணவர்கள்.', actionRecommendation: 'Deliver SQL starter kit.' },
      { id: 'cb-2', stageName: 'Milestone 1 Proof Submitted', stageNameTamil: 'மைல்கல் 1 சான்று சமர்ப்பிப்பு', learnersCount: 430, conversionRate: 82.7, dropoffRate: 17.3, diagnosticInsight: 'SQL queries submitted with window functions.', diagnosticInsightTamil: 'SQL வினவல்கள் சமர்ப்பிக்கப்பட்டன.', actionRecommendation: 'Resolve Cartesian product errors.' },
      { id: 'cb-3', stageName: 'Oral Defense / Viva Voce Completed', stageNameTamil: 'வாய்மொழி விளக்கம் நிறைவு', learnersCount: 360, conversionRate: 69.2, dropoffRate: 16.3, diagnosticInsight: 'Good rationale defense for sales discrepancy scripts.', diagnosticInsightTamil: 'விற்பனை தரவு முரண்பாடு விளக்கம் நன்று.', actionRecommendation: 'Mock technical interview sessions.' },
      { id: 'cb-4', stageName: 'Multi-File Project Rubric Passed', stageNameTamil: 'முழுமையான திட்டப்பணி தேர்ச்சி', learnersCount: 290, conversionRate: 55.8, dropoffRate: 19.4, diagnosticInsight: 'Dashboard integration requires optimization.', diagnosticInsightTamil: 'டாஷ்போர்டு ஒருங்கிணைப்புக்கு பயிற்சி தேவை.', actionRecommendation: 'Host Coimbatore mentor clinic.' },
      { id: 'cb-5', stageName: 'Workplace Ready / Opportunity Matched', stageNameTamil: 'பணித்தயார்நிலை & வாய்ப்பு பொருத்தம்', learnersCount: 220, conversionRate: 42.3, dropoffRate: 24.1, diagnosticInsight: '220 analysts matched with local operations hubs.', diagnosticInsightTamil: '220 மாணவர்கள் பணிக்கு தயார்.', actionRecommendation: 'Connect with district IT corridor.' }
    ]
  },
  'madurai': {
    district: 'Madurai',
    districtTamil: 'மதுரை',
    totalLearners: 460,
    activeThisWeek: 345,
    activePercentage: 75.0,
    completionRate: 64.2,
    avgReadiness: 73.5,
    vivaAuthenticityRate: 89.5,
    atRiskCount: 1,
    funnel: [
      { id: 'm-1', stageName: 'Enrolled & Diagnostic Completed', stageNameTamil: 'பதிவு & தொடக்க மதிப்பீடு', learnersCount: 460, conversionRate: 100, dropoffRate: 0, diagnosticInsight: 'Govt Polytechnic Madurai cohort.', diagnosticInsightTamil: 'மதுரை பாலிடெக்னிக் மாணவர்கள்.', actionRecommendation: 'Onboard to mobile layout challenges.' },
      { id: 'm-2', stageName: 'Milestone 1 Proof Submitted', stageNameTamil: 'மைல்கல் 1 சான்று சமர்ப்பிப்பு', learnersCount: 380, conversionRate: 82.6, dropoffRate: 17.4, diagnosticInsight: 'DOM manipulation submissions on track.', diagnosticInsightTamil: 'DOM கையாளுதல் சமர்ப்பிப்புகள் நன்று.', actionRecommendation: 'Monitor event delegation.' },
      { id: 'm-3', stageName: 'Oral Defense / Viva Voce Completed', stageNameTamil: 'வாய்மொழி விளக்கம் நிறைவு', learnersCount: 310, conversionRate: 67.4, dropoffRate: 18.4, diagnosticInsight: 'Viva voce completed in Tamil.', diagnosticInsightTamil: 'தமிழில் வாய்மொழி தேர்வு நிறைவு.', actionRecommendation: 'Practice English terminology.' },
      { id: 'm-4', stageName: 'Multi-File Project Rubric Passed', stageNameTamil: 'முழுமையான திட்டப்பணி தேர்ச்சி', learnersCount: 250, conversionRate: 54.3, dropoffRate: 19.4, diagnosticInsight: 'React state machine challenges stalled.', diagnosticInsightTamil: 'ரியாக்ட் நிலை மேலாண்மையில் தாமதம்.', actionRecommendation: 'Assign peer mentors.' },
      { id: 'm-5', stageName: 'Workplace Ready / Opportunity Matched', stageNameTamil: 'பணித்தயார்நிலை & வாய்ப்பு பொருத்தம்', learnersCount: 190, conversionRate: 41.3, dropoffRate: 24.0, diagnosticInsight: '190 learners workplace ready.', diagnosticInsightTamil: '190 மாணவர்கள் பணிக்கு தயார்.', actionRecommendation: 'Schedule local job fair interviews.' }
    ]
  },
  'chennai': {
    district: 'Chennai',
    districtTamil: 'சென்னை',
    totalLearners: 640,
    activeThisWeek: 470,
    activePercentage: 73.4,
    completionRate: 63.8,
    avgReadiness: 75.0,
    vivaAuthenticityRate: 90.0,
    atRiskCount: 1,
    funnel: [
      { id: 'ch-1', stageName: 'Enrolled & Diagnostic Completed', stageNameTamil: 'பதிவு & தொடக்க மதிப்பீடு', learnersCount: 640, conversionRate: 100, dropoffRate: 0, diagnosticInsight: 'Chennai metro university & vocational cohort.', diagnosticInsightTamil: 'சென்னை கல்லூரி மற்றும் தொழிற்பயிற்சி மாணவர்கள்.', actionRecommendation: 'Set benchmark standards.' },
      { id: 'ch-2', stageName: 'Milestone 1 Proof Submitted', stageNameTamil: 'மைல்கல் 1 சான்று சமர்ப்பிப்பு', learnersCount: 510, conversionRate: 79.7, dropoffRate: 20.3, diagnosticInsight: 'Accessibility form submissions high quality.', diagnosticInsightTamil: 'படிவ அணுகல்தன்மை சமர்ப்பிப்புகள் நன்று.', actionRecommendation: 'Expand automated rubrics.' },
      { id: 'ch-3', stageName: 'Oral Defense / Viva Voce Completed', stageNameTamil: 'வாய்மொழி விளக்கம் நிறைவு', learnersCount: 420, conversionRate: 65.6, dropoffRate: 17.6, diagnosticInsight: 'English and bilingual articulation strong.', diagnosticInsightTamil: 'இருமொழி விளக்கம் சிறப்பு.', actionRecommendation: 'Link to tech employer pipeline.' },
      { id: 'ch-4', stageName: 'Multi-File Project Rubric Passed', stageNameTamil: 'முழுமையான திட்டப்பணி தேர்ச்சி', learnersCount: 330, conversionRate: 51.6, dropoffRate: 21.4, diagnosticInsight: 'Full-stack caching challenges have drop-offs.', diagnosticInsightTamil: 'முழுமையான வலைப்பக்க திட்டங்களில் சில சவால்கள்.', actionRecommendation: 'Conduct weekend hackathon clinics.' },
      { id: 'ch-5', stageName: 'Workplace Ready / Opportunity Matched', stageNameTamil: 'பணித்தயார்நிலை & வாய்ப்பு பொருத்தம்', learnersCount: 220, conversionRate: 34.4, dropoffRate: 33.3, diagnosticInsight: '220 candidates verified for junior dev roles.', diagnosticInsightTamil: '220 மாணவர்கள் பணிக்கு தகுதி பெற்றுள்ளனர்.', actionRecommendation: 'Share portfolios with tech corridor.' }
    ]
  }
};

// Skill-Gap Heatmap Matrix: Skills (Rows) × Cohort Groups (Columns)
export const heatmapCohortGroups = [
  { id: 'c-trichy-bca', name: 'BCA Batch 2026 (Trichy)', district: 'Tiruchirappalli (Trichy)' },
  { id: 'c-madurai-poly', name: 'Govt Polytechnic (Madurai)', district: 'Madurai' },
  { id: 'c-tiruppur-shg', name: 'Rural SHG Garments (Tiruppur)', district: 'Tiruppur' },
  { id: 'c-coimbatore-data', name: 'B.Com Transitioners (Coimbatore)', district: 'Coimbatore' },
  { id: 'c-chennai-cs', name: 'B.Sc CS Fast-Track (Chennai)', district: 'Chennai' },
  { id: 'c-salem-iti', name: 'Govt ITI Solar Wiremen (Salem)', district: 'Salem' }
];

export const heatmapSkills = [
  { id: 'sk-html', name: 'Semantic HTML & Accessibility', nameTamil: 'அர்த்தமுள்ள HTML & அணுகல்தன்மை', track: 'Technical' },
  { id: 'sk-css', name: 'Responsive CSS & 320px Overflow', nameTamil: 'நெகிழ்வான CSS மற்றும் கட்டமைப்பு', track: 'Technical' },
  { id: 'sk-dom', name: 'JavaScript DOM & Event Loop', nameTamil: 'DOM & நிகழ்வு பரிமாற்றம்', track: 'Technical' },
  { id: 'sk-react', name: 'React Hooks & State Reconciliation', nameTamil: 'React ஹூக்ஸ் பயன்பாடு', track: 'Technical' },
  { id: 'sk-api', name: 'REST API Caching & Error Retries', nameTamil: 'REST API & தரவு சேமிப்பு', track: 'Technical' },
  { id: 'sk-ease', name: 'Body Measurement & Ease Tolerances', nameTamil: 'உடல் அளவீடு & தையல் தளர்வு', track: 'Vocational' },
  { id: 'sk-katori', name: 'Katori Bias Curvature Drafting', nameTamil: 'கடோரி வடிவமைப்பு வெட்டுதல்', track: 'Vocational' },
  { id: 'sk-sql', name: 'SQL Window Functions & Aggregations', nameTamil: 'SQL வினவல்கள் & கணக்கீடு', track: 'Data & Ops' }
];

// Matrix mapping score for each (skillId × cohortId)
export const heatmapData: HeatmapCell[] = [
  // Semantic HTML
  { skillId: 'sk-html', skillName: 'Semantic HTML & Accessibility', skillNameTamil: 'அர்த்தமுள்ள HTML & அணுகல்தன்மை', cohortId: 'c-trichy-bca', cohortName: 'BCA Batch 2026 (Trichy)', score: 88, status: 'strong', gapSize: 12, affectedCount: 22, remediationAction: 'Peer pairing with Priya Soundararajan' },
  { skillId: 'sk-html', skillName: 'Semantic HTML & Accessibility', skillNameTamil: 'அர்த்தமுள்ள HTML & அணுகல்தன்மை', cohortId: 'c-madurai-poly', cohortName: 'Govt Polytechnic (Madurai)', score: 82, status: 'strong', gapSize: 18, affectedCount: 34, remediationAction: 'Focus on ARIA landmark validation' },
  { skillId: 'sk-html', skillName: 'Semantic HTML & Accessibility', skillNameTamil: 'அர்த்தமுள்ள HTML & அணுகல்தன்மை', cohortId: 'c-tiruppur-shg', cohortName: 'Rural SHG Garments (Tiruppur)', score: 71, status: 'moderate', gapSize: 29, affectedCount: 45, remediationAction: 'Basic digital catalog entry module' },
  { skillId: 'sk-html', skillName: 'Semantic HTML & Accessibility', skillNameTamil: 'அர்த்தமுள்ள HTML & அணுகல்தன்மை', cohortId: 'c-coimbatore-data', cohortName: 'B.Com Transitioners (Coimbatore)', score: 75, status: 'strong', gapSize: 25, affectedCount: 28, remediationAction: 'Data visualization web embedding' },
  { skillId: 'sk-html', skillName: 'Semantic HTML & Accessibility', skillNameTamil: 'அர்த்தமுள்ள HTML & அணுகல்தன்மை', cohortId: 'c-chennai-cs', cohortName: 'B.Sc CS Fast-Track (Chennai)', score: 91, status: 'strong', gapSize: 9, affectedCount: 15, remediationAction: 'Advanced WCAG 2.1 AAA audit' },
  { skillId: 'sk-html', skillName: 'Semantic HTML & Accessibility', skillNameTamil: 'அர்த்தமுள்ள HTML & அணுகல்தன்மை', cohortId: 'c-salem-iti', cohortName: 'Govt ITI Solar Wiremen (Salem)', score: 68, status: 'moderate', gapSize: 32, affectedCount: 52, remediationAction: 'Digital electrical report forms' },

  // Responsive CSS & 320px Overflow
  { skillId: 'sk-css', skillName: 'Responsive CSS & 320px Overflow', skillNameTamil: 'நெகிழ்வான CSS மற்றும் கட்டமைப்பு', cohortId: 'c-trichy-bca', cohortName: 'BCA Batch 2026 (Trichy)', score: 74, status: 'moderate', gapSize: 26, affectedCount: 58, remediationAction: 'Deploy micro-tutorial on clamp() fluid typography' },
  { skillId: 'sk-css', skillName: 'Responsive CSS & 320px Overflow', skillNameTamil: 'நெகிழ்வான CSS மற்றும் கட்டமைப்பு', cohortId: 'c-madurai-poly', cohortName: 'Govt Polytechnic (Madurai)', score: 70, status: 'moderate', gapSize: 30, affectedCount: 65, remediationAction: 'Audit horizontal scroll at 320px width' },
  { skillId: 'sk-css', skillName: 'Responsive CSS & 320px Overflow', skillNameTamil: 'நெகிழ்வான CSS மற்றும் கட்டமைப்பு', cohortId: 'c-tiruppur-shg', cohortName: 'Rural SHG Garments (Tiruppur)', score: 62, status: 'moderate', gapSize: 38, affectedCount: 60, remediationAction: 'Mobile craft catalog responsiveness' },
  { skillId: 'sk-css', skillName: 'Responsive CSS & 320px Overflow', skillNameTamil: 'நெகிழ்வான CSS மற்றும் கட்டமைப்பு', cohortId: 'c-coimbatore-data', cohortName: 'B.Com Transitioners (Coimbatore)', score: 66, status: 'moderate', gapSize: 34, affectedCount: 48, remediationAction: 'Responsive table layout strategies' },
  { skillId: 'sk-css', skillName: 'Responsive CSS & 320px Overflow', skillNameTamil: 'நெகிழ்வான CSS மற்றும் கட்டமைப்பு', cohortId: 'c-chennai-cs', cohortName: 'B.Sc CS Fast-Track (Chennai)', score: 86, status: 'strong', gapSize: 14, affectedCount: 20, remediationAction: 'Container query layout challenge' },
  { skillId: 'sk-css', skillName: 'Responsive CSS & 320px Overflow', skillNameTamil: 'நெகிழ்வான CSS மற்றும் கட்டமைப்பு', cohortId: 'c-salem-iti', cohortName: 'Govt ITI Solar Wiremen (Salem)', score: 58, status: 'gap', gapSize: 42, affectedCount: 78, remediationAction: 'Mobile solar inverter dashboard check' },

  // JavaScript DOM & Event Loop
  { skillId: 'sk-dom', skillName: 'JavaScript DOM & Event Loop', skillNameTamil: 'DOM & நிகழ்வு பரிமாற்றம்', cohortId: 'c-trichy-bca', cohortName: 'BCA Batch 2026 (Trichy)', score: 85, status: 'strong', gapSize: 15, affectedCount: 30, remediationAction: 'Asynchronous event loop memory profiling' },
  { skillId: 'sk-dom', skillName: 'JavaScript DOM & Event Loop', skillNameTamil: 'DOM & நிகழ்வு பரிமாற்றம்', cohortId: 'c-madurai-poly', cohortName: 'Govt Polytechnic (Madurai)', score: 76, status: 'strong', gapSize: 24, affectedCount: 42, remediationAction: 'Event delegation on dynamic link list' },
  { skillId: 'sk-dom', skillName: 'JavaScript DOM & Event Loop', skillNameTamil: 'DOM & நிகழ்வு பரிமாற்றம்', cohortId: 'c-tiruppur-shg', cohortName: 'Rural SHG Garments (Tiruppur)', score: 52, status: 'gap', gapSize: 48, affectedCount: 82, remediationAction: 'Basic order tracking scripts' },
  { skillId: 'sk-dom', skillName: 'JavaScript DOM & Event Loop', skillNameTamil: 'DOM & நிகழ்வு பரிமாற்றம்', cohortId: 'c-coimbatore-data', cohortName: 'B.Com Transitioners (Coimbatore)', score: 78, status: 'strong', gapSize: 22, affectedCount: 36, remediationAction: 'DOM data table pagination' },
  { skillId: 'sk-dom', skillName: 'JavaScript DOM & Event Loop', skillNameTamil: 'DOM & நிகழ்வு பரிமாற்றம்', cohortId: 'c-chennai-cs', cohortName: 'B.Sc CS Fast-Track (Chennai)', score: 88, status: 'strong', gapSize: 12, affectedCount: 18, remediationAction: 'Closure and microtask queue challenge' },
  { skillId: 'sk-dom', skillName: 'JavaScript DOM & Event Loop', skillNameTamil: 'DOM & நிகழ்வு பரிமாற்றம்', cohortId: 'c-salem-iti', cohortName: 'Govt ITI Solar Wiremen (Salem)', score: 48, status: 'gap', gapSize: 52, affectedCount: 94, remediationAction: 'Introductory event handling basics' },

  // React Hooks & State Reconciliation
  { skillId: 'sk-react', skillName: 'React Hooks & State Reconciliation', skillNameTamil: 'React ஹூக்ஸ் பயன்பாடு', cohortId: 'c-trichy-bca', cohortName: 'BCA Batch 2026 (Trichy)', score: 68, status: 'moderate', gapSize: 32, affectedCount: 72, remediationAction: 'Code review on useEffect dependencies' },
  { skillId: 'sk-react', skillName: 'React Hooks & State Reconciliation', skillNameTamil: 'React ஹூக்ஸ் பயன்பாடு', cohortId: 'c-madurai-poly', cohortName: 'Govt Polytechnic (Madurai)', score: 64, status: 'moderate', gapSize: 36, affectedCount: 80, remediationAction: 'State co-location workshop' },
  { skillId: 'sk-react', skillName: 'React Hooks & State Reconciliation', skillNameTamil: 'React ஹூக்ஸ் பயன்பாடு', cohortId: 'c-tiruppur-shg', cohortName: 'Rural SHG Garments (Tiruppur)', score: 45, status: 'gap', gapSize: 55, affectedCount: 90, remediationAction: 'Not required for vocational track' },
  { skillId: 'sk-react', skillName: 'React Hooks & State Reconciliation', skillNameTamil: 'React ஹூக்ஸ் பயன்பாடு', cohortId: 'c-coimbatore-data', cohortName: 'B.Com Transitioners (Coimbatore)', score: 60, status: 'moderate', gapSize: 40, affectedCount: 65, remediationAction: 'React dashboard state management' },
  { skillId: 'sk-react', skillName: 'React Hooks & State Reconciliation', skillNameTamil: 'React ஹூக்ஸ் பயன்பாடு', cohortId: 'c-chennai-cs', cohortName: 'B.Sc CS Fast-Track (Chennai)', score: 84, status: 'strong', gapSize: 16, affectedCount: 22, remediationAction: 'Custom hook abstraction exercise' },
  { skillId: 'sk-react', skillName: 'React Hooks & State Reconciliation', skillNameTamil: 'React ஹூக்ஸ் பயன்பாடு', cohortId: 'c-salem-iti', cohortName: 'Govt ITI Solar Wiremen (Salem)', score: 40, status: 'gap', gapSize: 60, affectedCount: 110, remediationAction: 'Not required for electrical track' },

  // REST API Caching & Error Retries (Highest system-wide gap!)
  { skillId: 'sk-api', skillName: 'REST API Caching & Error Retries', skillNameTamil: 'REST API & தரவு சேமிப்பு', cohortId: 'c-trichy-bca', cohortName: 'BCA Batch 2026 (Trichy)', score: 48, status: 'gap', gapSize: 52, affectedCount: 115, remediationAction: 'Bilingual Tamil walkthrough on optimistic UI and Zod' },
  { skillId: 'sk-api', skillName: 'REST API Caching & Error Retries', skillNameTamil: 'REST API & தரவு சேமிப்பு', cohortId: 'c-madurai-poly', cohortName: 'Govt Polytechnic (Madurai)', score: 44, status: 'gap', gapSize: 56, affectedCount: 130, remediationAction: 'Dedicated REST caching lab session' },
  { skillId: 'sk-api', skillName: 'REST API Caching & Error Retries', skillNameTamil: 'REST API & தரவு சேமிப்பு', cohortId: 'c-tiruppur-shg', cohortName: 'Rural SHG Garments (Tiruppur)', score: 38, status: 'gap', gapSize: 62, affectedCount: 95, remediationAction: 'API overview for inventory sync' },
  { skillId: 'sk-api', skillName: 'REST API Caching & Error Retries', skillNameTamil: 'REST API & தரவு சேமிப்பு', cohortId: 'c-coimbatore-data', cohortName: 'B.Com Transitioners (Coimbatore)', score: 55, status: 'gap', gapSize: 45, affectedCount: 88, remediationAction: 'Fetch API error handling and token refresh' },
  { skillId: 'sk-api', skillName: 'REST API Caching & Error Retries', skillNameTamil: 'REST API & தரவு சேமிப்பு', cohortId: 'c-chennai-cs', cohortName: 'B.Sc CS Fast-Track (Chennai)', score: 68, status: 'moderate', gapSize: 32, affectedCount: 45, remediationAction: 'TanStack Query / SWR caching patterns' },
  { skillId: 'sk-api', skillName: 'REST API Caching & Error Retries', skillNameTamil: 'REST API & தரவு சேமிப்பு', cohortId: 'c-salem-iti', cohortName: 'Govt ITI Solar Wiremen (Salem)', score: 35, status: 'gap', gapSize: 65, affectedCount: 120, remediationAction: 'Telemetry data API polling' },

  // Body Measurement & Ease Tolerances (Vocational)
  { skillId: 'sk-ease', skillName: 'Body Measurement & Ease Tolerances', skillNameTamil: 'உடல் அளவீடு & தையல் தளர்வு', cohortId: 'c-trichy-bca', cohortName: 'BCA Batch 2026 (Trichy)', score: 60, status: 'moderate', gapSize: 40, affectedCount: 40, remediationAction: 'Optional cross-vocational exposure' },
  { skillId: 'sk-ease', skillName: 'Body Measurement & Ease Tolerances', skillNameTamil: 'உடல் அளவீடு & தையல் தளர்வு', cohortId: 'c-madurai-poly', cohortName: 'Govt Polytechnic (Madurai)', score: 65, status: 'moderate', gapSize: 35, affectedCount: 35, remediationAction: 'Cross-functional engineering measurement' },
  { skillId: 'sk-ease', skillName: 'Body Measurement & Ease Tolerances', skillNameTamil: 'உடல் அளவீடு & தையல் தளர்வு', cohortId: 'c-tiruppur-shg', cohortName: 'Rural SHG Garments (Tiruppur)', score: 94, status: 'strong', gapSize: 6, affectedCount: 10, remediationAction: 'Mentor endorsement by Lakshmi Arumugam' },
  { skillId: 'sk-ease', skillName: 'Body Measurement & Ease Tolerances', skillNameTamil: 'உடல் அளவீடு & தையல் தளர்வு', cohortId: 'c-coimbatore-data', cohortName: 'B.Com Transitioners (Coimbatore)', score: 58, status: 'gap', gapSize: 42, affectedCount: 50, remediationAction: 'Not applicable to finance track' },
  { skillId: 'sk-ease', skillName: 'Body Measurement & Ease Tolerances', skillNameTamil: 'உடல் அளவீடு & தையல் தளர்வு', cohortId: 'c-chennai-cs', cohortName: 'B.Sc CS Fast-Track (Chennai)', score: 55, status: 'gap', gapSize: 45, affectedCount: 45, remediationAction: 'Not applicable to software track' },
  { skillId: 'sk-ease', skillName: 'Body Measurement & Ease Tolerances', skillNameTamil: 'உடல் அளவீடு & தையல் தளர்வு', cohortId: 'c-salem-iti', cohortName: 'Govt ITI Solar Wiremen (Salem)', score: 82, status: 'strong', gapSize: 18, affectedCount: 22, remediationAction: 'Industrial safety harness sizing' },

  // Katori Bias Curvature Drafting
  { skillId: 'sk-katori', skillName: 'Katori Bias Curvature Drafting', skillNameTamil: 'கடோரி வடிவமைப்பு வெட்டுதல்', cohortId: 'c-trichy-bca', cohortName: 'BCA Batch 2026 (Trichy)', score: 50, status: 'gap', gapSize: 50, affectedCount: 60, remediationAction: 'Vocational craft exposure' },
  { skillId: 'sk-katori', skillName: 'Katori Bias Curvature Drafting', skillNameTamil: 'கடோரி வடிவமைப்பு வெட்டுதல்', cohortId: 'c-madurai-poly', cohortName: 'Govt Polytechnic (Madurai)', score: 55, status: 'gap', gapSize: 45, affectedCount: 50, remediationAction: 'CAD pattern drafting crossover' },
  { skillId: 'sk-katori', skillName: 'Katori Bias Curvature Drafting', skillNameTamil: 'கடோரி வடிவமைப்பு வெட்டுதல்', cohortId: 'c-tiruppur-shg', cohortName: 'Rural SHG Garments (Tiruppur)', score: 92, status: 'strong', gapSize: 8, affectedCount: 14, remediationAction: 'Boutique sample cutting master certification' },
  { skillId: 'sk-katori', skillName: 'Katori Bias Curvature Drafting', skillNameTamil: 'கடோரி வடிவமைப்பு வெட்டுதல்', cohortId: 'c-coimbatore-data', cohortName: 'B.Com Transitioners (Coimbatore)', score: 48, status: 'gap', gapSize: 52, affectedCount: 55, remediationAction: 'Not applicable to business track' },
  { skillId: 'sk-katori', skillName: 'Katori Bias Curvature Drafting', skillNameTamil: 'கடோரி வடிவமைப்பு வெட்டுதல்', cohortId: 'c-chennai-cs', cohortName: 'B.Sc CS Fast-Track (Chennai)', score: 45, status: 'gap', gapSize: 55, affectedCount: 60, remediationAction: 'Not applicable to software track' },
  { skillId: 'sk-katori', skillName: 'Katori Bias Curvature Drafting', skillNameTamil: 'கடோரி வடிவமைப்பு வெட்டுதல்', cohortId: 'c-salem-iti', cohortName: 'Govt ITI Solar Wiremen (Salem)', score: 70, status: 'moderate', gapSize: 30, affectedCount: 38, remediationAction: 'Solar array layout geometric cutting' },

  // SQL Window Functions & Aggregations
  { skillId: 'sk-sql', skillName: 'SQL Window Functions & Aggregations', skillNameTamil: 'SQL வினவல்கள் & கணக்கீடு', cohortId: 'c-trichy-bca', cohortName: 'BCA Batch 2026 (Trichy)', score: 78, status: 'strong', gapSize: 22, affectedCount: 35, remediationAction: 'PostgreSQL window function challenge' },
  { skillId: 'sk-sql', skillName: 'SQL Window Functions & Aggregations', skillNameTamil: 'SQL வினவல்கள் & கணக்கீடு', cohortId: 'c-madurai-poly', cohortName: 'Govt Polytechnic (Madurai)', score: 72, status: 'moderate', gapSize: 28, affectedCount: 48, remediationAction: 'Practice indexed join queries' },
  { skillId: 'sk-sql', skillName: 'SQL Window Functions & Aggregations', skillNameTamil: 'SQL வினவல்கள் & கணக்கீடு', cohortId: 'c-tiruppur-shg', cohortName: 'Rural SHG Garments (Tiruppur)', score: 58, status: 'gap', gapSize: 42, affectedCount: 68, remediationAction: 'Inventory ledger database entry' },
  { skillId: 'sk-sql', skillName: 'SQL Window Functions & Aggregations', skillNameTamil: 'SQL வினவல்கள் & கணக்கீடு', cohortId: 'c-coimbatore-data', cohortName: 'B.Com Transitioners (Coimbatore)', score: 89, status: 'strong', gapSize: 11, affectedCount: 16, remediationAction: 'Multi-store sales reconciliation audit' },
  { skillId: 'sk-sql', skillName: 'SQL Window Functions & Aggregations', skillNameTamil: 'SQL வினவல்கள் & கணக்கீடு', cohortId: 'c-chennai-cs', cohortName: 'B.Sc CS Fast-Track (Chennai)', score: 86, status: 'strong', gapSize: 14, affectedCount: 20, remediationAction: 'Query execution plan EXPLAIN ANALYZE' },
  { skillId: 'sk-sql', skillName: 'SQL Window Functions & Aggregations', skillNameTamil: 'SQL வினவல்கள் & கணக்கீடு', cohortId: 'c-salem-iti', cohortName: 'Govt ITI Solar Wiremen (Salem)', score: 62, status: 'moderate', gapSize: 38, affectedCount: 55, remediationAction: 'Solar generation logging queries' }
];

// At-Risk Learners with Concrete Suggested Interventions
export const initialAtRiskLearners: AtRiskLearner[] = [
  {
    id: 'risk-01',
    name: 'Karthik Muthusamy',
    nameTamil: 'கார்த்திக் முத்துசாமி',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    district: 'Tiruchirappalli (Trichy)',
    cohortName: 'BCA Batch 2026 (Trichy)',
    pathwayId: 'junior-web-dev',
    pathwayTitle: 'Junior Web Developer',
    stalledMilestone: 'REST API Caching & Zod Validation',
    stalledMilestoneTamil: 'REST API & Zod சரிபார்ப்பு',
    daysStalled: 14,
    currentRubricScore: 42,
    riskLevel: 'high',
    suggestedIntervention: 'Assign peer pairing with Priya Soundararajan (91% demonstrated score); trigger step-by-step bilingual Tamil fetch() guide.',
    suggestedInterventionTamil: 'பிரியா சௌந்தரராஜனுடன் சக மாணவர் இணைத்தல்; தமிழில் API கையேட்டை அனுப்புதல்.',
    interventionType: 'peer_pairing',
    interventionTriggered: false
  },
  {
    id: 'risk-02',
    name: 'Revathi Balakrishnan',
    nameTamil: 'ரேவதி பாலகிருஷ்ணன்',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    district: 'Tiruchirappalli (Trichy)',
    cohortName: 'BCA Batch 2026 (Trichy)',
    pathwayId: 'junior-web-dev',
    pathwayTitle: 'Junior Web Developer',
    stalledMilestone: 'Responsive CSS Grid clamp() Scaling',
    stalledMilestoneTamil: 'CSS clamp() திரையளவு சீரமைப்பு',
    daysStalled: 9,
    currentRubricScore: 56,
    riskLevel: 'moderate',
    suggestedIntervention: 'Trigger interactive visual calculator showing 320px zero-overflow flex wrap examples.',
    suggestedInterventionTamil: '320px மொபைல் திரையளவுக்கான ஊடாடும் காட்சி விளக்கக் கையேட்டை அனுப்புதல்.',
    interventionType: 'bilingual_walkthrough',
    interventionTriggered: false
  },
  {
    id: 'risk-03',
    name: 'Suresh Kandasamy',
    nameTamil: 'சுரேஷ் கந்தசாமி',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    district: 'Tiruppur',
    cohortName: 'Rural SHG Garments (Tiruppur)',
    pathwayId: 'tailoring-craft',
    pathwayTitle: 'Tailoring & Garment Construction',
    stalledMilestone: 'Collar Bias Piping & Seam Balance',
    stalledMilestoneTamil: 'காலர் பைப்பிங் & தையல் இடைவெளி',
    daysStalled: 11,
    currentRubricScore: 54,
    riskLevel: 'high',
    suggestedIntervention: 'Schedule 15-minute hands-on diagnostic workshop with Master Mentor K. Senthil Nathan at Tiruppur skill hub.',
    suggestedInterventionTamil: 'வழிகாட்டி செந்தில் நாதனுடன் 15 நிமிட நேரடிப் பயிலரங்கம் ஏற்பாடு செய்தல்.',
    interventionType: 'mentor_viva',
    interventionTriggered: false
  },
  {
    id: 'risk-04',
    name: 'Banu Priya S.',
    nameTamil: 'பானு பிரியா',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    district: 'Tiruppur',
    cohortName: 'Rural SHG Garments (Tiruppur)',
    pathwayId: 'tailoring-craft',
    pathwayTitle: 'Tailoring & Garment Construction',
    stalledMilestone: '1.5-inch Ease Allowance QC Photo Upload',
    stalledMilestoneTamil: '1.5 அங்குல தையல் தளர்வு புகைப்பட சான்று',
    daysStalled: 8,
    currentRubricScore: 61,
    riskLevel: 'moderate',
    suggestedIntervention: 'Peer inspection with Lakshmi Arumugam (94% photo QC score) on measurement tape alignment.',
    suggestedInterventionTamil: 'லட்சுமி ஆறுமுகத்துடன் இணைந்து அளவீட்டு நாடா சீரமைப்பை சரிபார்த்தல்.',
    interventionType: 'peer_pairing',
    interventionTriggered: false
  },
  {
    id: 'risk-05',
    name: 'Aravind Swaminathan',
    nameTamil: 'அரவிந்த் சுவாமிநாதன்',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    district: 'Coimbatore',
    cohortName: 'B.Com Transitioners (Coimbatore)',
    pathwayId: 'data-analyst',
    pathwayTitle: 'Data Analyst & Business Reporting',
    stalledMilestone: 'SQL Window Functions & Running Totals',
    stalledMilestoneTamil: 'SQL விண்டோ செயல்பாடுகள் & கூட்டுத் தொகை',
    daysStalled: 15,
    currentRubricScore: 46,
    riskLevel: 'high',
    suggestedIntervention: 'Pair with Murugan Palanisamy (89% SQL score) to debug partitioned aggregation query plans.',
    suggestedInterventionTamil: 'முருகன் பழனிசாமியுடன் இணைந்து SQL வினவல் திட்டங்களை சரிசெய்தல்.',
    interventionType: 'peer_pairing',
    interventionTriggered: false
  },
  {
    id: 'risk-06',
    name: 'Kavitha Dharmalingam',
    nameTamil: 'கவிதா தர்மலிங்கம்',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    district: 'Coimbatore',
    cohortName: 'B.Com Transitioners (Coimbatore)',
    pathwayId: 'data-analyst',
    pathwayTitle: 'Data Analyst & Business Reporting',
    stalledMilestone: 'Excel Automation & Pivot Modeling',
    stalledMilestoneTamil: 'எக்செல் ஆட்டோமேஷன் & பிவட் அட்டவணை',
    daysStalled: 7,
    currentRubricScore: 63,
    riskLevel: 'moderate',
    suggestedIntervention: 'Send interactive Tamil spreadsheet template with automated anomaly highlighting formula.',
    suggestedInterventionTamil: 'தானியங்கி முரண்பாடு கண்டறியும் எக்செல் மாதிரியை வழங்குதல்.',
    interventionType: 'bilingual_walkthrough',
    interventionTriggered: false
  },
  {
    id: 'risk-07',
    name: 'Vasanth Rajan',
    nameTamil: 'வசந்த் ராஜன்',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    district: 'Madurai',
    cohortName: 'Govt Polytechnic (Madurai)',
    pathwayId: 'junior-web-dev',
    pathwayTitle: 'Junior Web Developer',
    stalledMilestone: 'React State Machine & Hook Dependencies',
    stalledMilestoneTamil: 'React ஹூக்ஸ் பயன்பாடு & நிலை மேலாண்மை',
    daysStalled: 13,
    currentRubricScore: 49,
    riskLevel: 'high',
    suggestedIntervention: 'Trigger diagnostic live viva check-in with AI Coach to clarify useEffect dependency cleanups.',
    suggestedInterventionTamil: 'AI வழிகாட்டியுடன் useEffect பயன்பாட்டுக்கான உடனடி நேரலை கலந்துரையாடல்.',
    interventionType: 'mentor_viva',
    interventionTriggered: false
  },
  {
    id: 'risk-08',
    name: 'Deepa Natarajan',
    nameTamil: 'தீபா நடராஜன்',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    district: 'Chennai',
    cohortName: 'B.Sc CS Fast-Track (Chennai)',
    pathwayId: 'junior-web-dev',
    pathwayTitle: 'Junior Web Developer',
    stalledMilestone: 'Optimistic UI Updates & Error Boundaries',
    stalledMilestoneTamil: 'பிழை மேலாண்மை & UI புதுப்பித்தல்',
    daysStalled: 10,
    currentRubricScore: 58,
    riskLevel: 'moderate',
    suggestedIntervention: 'Dispatch offline coding sandbox with unit test harness for React ErrorBoundary fallbacks.',
    suggestedInterventionTamil: 'பிழை மேலாண்மைக்கான சோதனை குறியீட்டு மாதிரியை வழங்குதல்.',
    interventionType: 'offline_lab',
    interventionTriggered: false
  }
];
