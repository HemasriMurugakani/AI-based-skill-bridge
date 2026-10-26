import { Persona, Pathway, Challenge, VivaProofRecord } from '../types';

export interface ComponentItem {
  id: string;
  name: string;
  nameTamil?: string;
  status: 'completed' | 'in_progress' | 'missing';
  score?: number;
  details: string;
  detailsTamil?: string;
}

export interface ReadinessComponent {
  id: 'skills' | 'assessments' | 'projects' | 'communication' | 'missingRequirements';
  title: string;
  titleTamil: string;
  count: number;
  total: number;
  unit: string;
  unitTamil: string;
  percentage: number; // 0 to 100
  weight: number; // fraction e.g. 0.30
  weightPercentage: number; // 30%
  weightedContribution: number; // percentage * weight
  status: 'strong' | 'moderate' | 'needs_work';
  formulaStr: string;
  substitutionStr: string;
  explanationEnglish: string;
  explanationTamil: string;
  items: ComponentItem[];
  // For simulation diffing
  simulatedCount?: number;
  simulatedPercentage?: number;
  simulatedContribution?: number;
}

export interface SimulationScenario {
  id: string;
  label: string;
  labelTamil: string;
  description: string;
  impactSummary: string;
  targetComponent: 'skills' | 'assessments' | 'projects' | 'communication' | 'missingRequirements';
  challengeId?: string;
}

export interface NextStepRecommendation {
  challengeId: string;
  title: string;
  titleTamil: string;
  category: string;
  timeEstimate: string;
  plainLanguageTitle: string;
  plainLanguageTitleTamil: string;
  plainLanguageSummary: string;
  plainLanguageSummaryTamil: string;
  whyItMatters: string;
  whyItMattersTamil: string;
  expectedOutcome: string;
  expectedOutcomeTamil: string;
  impactGain: number; // Guidance point gain
  points: number;
}

export interface ReadinessCalculationResult {
  overallScore: number;
  baseOverallScore: number;
  isSimulated: boolean;
  activeSimulationIds: string[];
  components: ReadinessComponent[];
  weights: {
    skills: number;
    projects: number;
    assessments: number;
    communication: number;
    missingRequirements: number;
  };
  formulaSummary: {
    formula: string;
    substitution: string;
    result: string;
  };
  availableScenarios: SimulationScenario[];
  nextStep: NextStepRecommendation;
}

/**
 * Deterministically compute readiness metrics with 100% transparent formulas
 */
export function calculateReadiness(
  persona: Persona,
  pathway: Pathway,
  challenges: Challenge[],
  vivaRecords: Record<string, VivaProofRecord>,
  activeSimulations: string[] = []
): ReadinessCalculationResult {
  const isSimulated = activeSimulations.length > 0;

  // Simulation flags
  const simJsChallenge = activeSimulations.includes('sim-complete-js-challenge');
  const simRestApiProject = activeSimulations.includes('sim-submit-rest-api-project');
  const simVivaDefense = activeSimulations.includes('sim-complete-viva');
  const simGitAssessment = activeSimulations.includes('sim-pass-git-assessment');

  // -------------------------------------------------------------
  // 1. SKILLS DEMONSTRATED (Weight: 30%)
  // -------------------------------------------------------------
  const pathwaySkills = pathway.skills || [];
  const totalSkillsCount = pathwaySkills.length || 6;

  // Base demonstrated: state === 'strong' OR score >= 70
  const baseDemonstratedItems: ComponentItem[] = pathwaySkills.map(skill => {
    const isDemonstrated = skill.state === 'strong' || (skill.score !== undefined && skill.score >= 70);
    return {
      id: skill.id,
      name: skill.name,
      nameTamil: skill.nameTamil,
      status: isDemonstrated ? 'completed' : skill.state === 'gap' ? 'missing' : 'in_progress',
      score: skill.score,
      details: isDemonstrated
        ? `Verified with ${skill.evidenceCount || 1} rubric submissions (Score: ${skill.score || 80}%)`
        : skill.state === 'gap'
        ? `Skill gap detected (Score: ${skill.score || 40}% - Needs score ≥ 70%)`
        : `Assessment in progress (Level ${skill.level})`,
      detailsTamil: isDemonstrated
        ? `${skill.evidenceCount || 1} சான்றுகளுடன் சரிபார்க்கப்பட்டது (மதிப்பெண்: ${skill.score || 80}%)`
        : skill.state === 'gap'
        ? `இடைவெளி உள்ளது (மதிப்பெண்: ${skill.score || 40}% - இலக்கு: 70%)`
        : `மதிப்பீட்டில் உள்ளது (நிலை ${skill.level})`
    };
  });

  const baseDemonstratedCount = baseDemonstratedItems.filter(i => i.status === 'completed').length;
  let simulatedSkillsCount = baseDemonstratedCount;
  if (simJsChallenge && simulatedSkillsCount < totalSkillsCount) simulatedSkillsCount += 1;
  if (simRestApiProject && simulatedSkillsCount < totalSkillsCount) simulatedSkillsCount += 1;

  const skillsCount = isSimulated ? simulatedSkillsCount : baseDemonstratedCount;
  const skillsPercentage = Number(((skillsCount / totalSkillsCount) * 100).toFixed(1));
  const skillsWeight = 0.30;
  const skillsContribution = Number((skillsPercentage * skillsWeight).toFixed(2));

  const skillsComponent: ReadinessComponent = {
    id: 'skills',
    title: 'Skills Demonstrated',
    titleTamil: 'நிரூபிக்கப்பட்ட திறன்கள்',
    count: skillsCount,
    total: totalSkillsCount,
    unit: 'skills verified',
    unitTamil: 'திறன்கள் சரிபார்க்கப்பட்டன',
    percentage: skillsPercentage,
    weight: skillsWeight,
    weightPercentage: 30,
    weightedContribution: skillsContribution,
    status: skillsPercentage >= 75 ? 'strong' : skillsPercentage >= 45 ? 'moderate' : 'needs_work',
    formulaStr: '(Demonstrated Skills / Total Pathway Skills) × 100',
    substitutionStr: `(${skillsCount} / ${totalSkillsCount}) × 100 = ${skillsPercentage}%`,
    explanationEnglish: `Counts pathway skills with verified rubric evidence achieving score ≥ 70%. Out of ${totalSkillsCount} core skills, you have demonstrated ${skillsCount}.`,
    explanationTamil: `70%-க்கு மேல் சான்றளிக்கப்பட்ட திறன்களின் எண்ணிக்கை. மொத்தம் உள்ள ${totalSkillsCount} திறன்களில், நீங்கள் ${skillsCount} திறன்களை நிரூபித்துள்ளீர்கள்.`,
    items: baseDemonstratedItems,
    simulatedCount: isSimulated ? simulatedSkillsCount : undefined,
    simulatedPercentage: isSimulated ? skillsPercentage : undefined,
    simulatedContribution: isSimulated ? skillsContribution : undefined,
  };

  // -------------------------------------------------------------
  // 2. ASSESSMENTS COMPLETED (Weight: 20%)
  // -------------------------------------------------------------
  const totalAssessments = 5;
  const baseAssessmentsItems: ComponentItem[] = [
    {
      id: 'as-01',
      name: pathway.category === 'vocational' ? 'Tool Safety & Measurement Accuracy Check' : 'Semantic HTML & Accessibility Benchmark',
      nameTamil: pathway.category === 'vocational' ? 'பாதுகாப்பு & அளவீட்டு சரிபார்ப்பு' : 'HTML அணுகல்தன்மை தேர்வு',
      status: 'completed',
      score: 92,
      details: 'Scored 92% on WCAG AA keyboard focus indicators & skip links',
      detailsTamil: 'விசைப்பலகை வழிசெலுத்தல் தேர்வில் 92% தேர்ச்சி'
    },
    {
      id: 'as-02',
      name: pathway.category === 'vocational' ? 'Pattern Cutting Precision Quiz' : 'Responsive CSS & Mobile Viewport Quiz',
      nameTamil: pathway.category === 'vocational' ? 'துணி வெட்டுதல் துல்லியம்' : 'CSS மொபைல் திரை வடிவமைப்பு',
      status: 'completed',
      score: 88,
      details: 'Scored 88% on zero-overflow flexbox clamp layouts',
      detailsTamil: '320px மொபைல் திரை தேர்வில் 88% தேர்ச்சி'
    },
    {
      id: 'as-03',
      name: pathway.category === 'vocational' ? 'Machine Stitching & Tension Inspection' : 'JavaScript DOM Manipulation & Event Loop Check',
      nameTamil: pathway.category === 'vocational' ? 'தையல் இயந்திர இழுவிசை சோதனை' : 'DOM & நிகழ்வு பரிமாற்ற சோதனை',
      status: 'completed',
      score: 85,
      details: 'Scored 85% on event delegation and memory leak prevention',
      detailsTamil: 'நினைவக கசிவு தடுப்பு தேர்வில் 85% தேர்ச்சி'
    },
    {
      id: 'as-04',
      name: pathway.category === 'vocational' ? 'Collar & Seam Alignment Review' : 'React State Management & Hook Dependencies Check',
      nameTamil: pathway.category === 'vocational' ? 'காலர் & தையல் சீரமைப்பு' : 'React ஹூக்ஸ் பயன்பாட்டு சோதனை',
      status: simJsChallenge || simRestApiProject ? 'completed' : 'in_progress',
      score: simJsChallenge || simRestApiProject ? 86 : 64,
      details: simJsChallenge || simRestApiProject
        ? 'Passed with 86% on reactive component state flow'
        : 'In progress - need to verify custom hooks and useEffect cleanup',
      detailsTamil: simJsChallenge || simRestApiProject
        ? '86% மதிப்பெண்ணுடன் வெற்றிகரமாக முடிக்கப்பட்டது'
        : 'முன்னேற்றத்தில் உள்ளது - ஹூக்ஸ் சோதனை நிலுவை'
    },
    {
      id: 'as-05',
      name: pathway.category === 'vocational' ? 'Garment Finishing & Press Inspection' : 'REST API Integration & Resilient Caching Audit',
      nameTamil: pathway.category === 'vocational' ? 'ஆடை இறுதி மெருகூட்டல்' : 'REST API & தரவு சேமிப்பு சோதனை',
      status: simRestApiProject ? 'completed' : 'missing',
      score: simRestApiProject ? 90 : undefined,
      details: simRestApiProject
        ? 'Passed with 90% on pagination, caching, and retry logic'
        : 'Not yet started - required for junior engineering roles',
      detailsTamil: simRestApiProject
        ? '90% மதிப்பெண்ணுடன் வெற்றிகரமாக தேர்ச்சி'
        : 'இன்னும் தொடங்கப்படவில்லை'
    }
  ];

  const baseAssessmentsCount = 3;
  let simulatedAssessmentsCount = baseAssessmentsCount;
  if (simJsChallenge) simulatedAssessmentsCount += 1;
  if (simRestApiProject && simulatedAssessmentsCount < totalAssessments) simulatedAssessmentsCount += 1;

  const assessmentsCount = isSimulated ? simulatedAssessmentsCount : baseAssessmentsCount;
  const assessmentsPercentage = Number(((assessmentsCount / totalAssessments) * 100).toFixed(1));
  const assessmentsWeight = 0.20;
  const assessmentsContribution = Number((assessmentsPercentage * assessmentsWeight).toFixed(2));

  const assessmentsComponent: ReadinessComponent = {
    id: 'assessments',
    title: 'Assessments Completed',
    titleTamil: 'முடிக்கப்பட்ட தேர்வுகள்',
    count: assessmentsCount,
    total: totalAssessments,
    unit: 'tests passed',
    unitTamil: 'தேர்வுகள் தேர்ச்சி',
    percentage: assessmentsPercentage,
    weight: assessmentsWeight,
    weightPercentage: 20,
    weightedContribution: assessmentsContribution,
    status: assessmentsPercentage >= 75 ? 'strong' : assessmentsPercentage >= 50 ? 'moderate' : 'needs_work',
    formulaStr: '(Passed Technical & Rubric Checks / Total Benchmark Assessments) × 100',
    substitutionStr: `(${assessmentsCount} / ${totalAssessments}) × 100 = ${assessmentsPercentage}%`,
    explanationEnglish: `Measures technical tests, automated quizzes, and rubric checks passed with a grade ≥ 75%. You have completed ${assessmentsCount} of ${totalAssessments}.`,
    explanationTamil: `75%-க்கு மேல் தேர்ச்சி பெற்ற தொழில்முறை தேர்வுகள். மொத்தம் ${totalAssessments} தேர்வுகளில், ${assessmentsCount} முடிக்கப்பட்டுள்ளன.`,
    items: baseAssessmentsItems,
    simulatedCount: isSimulated ? simulatedAssessmentsCount : undefined,
    simulatedPercentage: isSimulated ? assessmentsPercentage : undefined,
    simulatedContribution: isSimulated ? assessmentsContribution : undefined,
  };

  // -------------------------------------------------------------
  // 3. PROJECTS SUBMITTED (Weight: 25%)
  // -------------------------------------------------------------
  const totalProjects = 4;
  const baseProjectItems: ComponentItem[] = [
    {
      id: 'pr-01',
      name: pathway.category === 'vocational' ? 'Boutique Blouse Measurement Sheet' : 'Accessible Artisan Collective Navbar & Layout',
      nameTamil: pathway.category === 'vocational' ? 'தையல் அளவீட்டு தாள்' : 'கைவினைஞர் இணையதள தலைப்பு',
      status: 'completed',
      score: 92,
      details: 'Reviewed and verified by AI rubric evaluator (No errors, clean ARIA)',
      detailsTamil: 'AI மதிப்பீட்டாளரால் சரிபார்க்கப்பட்டது'
    },
    {
      id: 'pr-02',
      name: pathway.category === 'vocational' ? '4-Dart Katori Blouse Cut Fabric Piece' : 'Responsive Profile Page with Zero 320px Overflow',
      nameTamil: pathway.category === 'vocational' ? 'கட்டோரி பிளவுஸ் வெட்டுதல்' : '320px நெகிழ்வான சுயவிவரப் பக்கம்',
      status: 'completed',
      score: 94,
      details: 'Verified code PR with fluid clamp() typography and keyboard focus rings',
      detailsTamil: 'நெகிழ்வான வடிவமைப்புடன் குறியீடு சமர்ப்பிக்கப்பட்டது'
    },
    {
      id: 'pr-03',
      name: pathway.category === 'vocational' ? 'Straight Seam & Tension Calibrated Fabric Swatch' : 'Interactive DOM Shopping Cart with Event Delegation',
      nameTamil: pathway.category === 'vocational' ? 'நேர்கோட்டு தையல் மாதிரி' : 'ஊடாடும் வணிக கூடை (DOM)',
      status: simJsChallenge ? 'completed' : 'in_progress',
      score: simJsChallenge ? 92 : undefined,
      details: simJsChallenge
        ? 'Verified submission: Event bubbling, zero memory leaks, local state persistence'
        : 'Draft started - challenge ready in workspace (35 mins estimate)',
      detailsTamil: simJsChallenge
        ? 'வெற்றிகரமாக சமர்ப்பிக்கப்பட்டு சரிபார்க்கப்பட்டது'
        : 'வரைவு நிலையில் உள்ளது (மதிப்பிடப்பட்ட நேரம்: 35 நிமிடம்)'
    },
    {
      id: 'pr-04',
      name: pathway.category === 'vocational' ? 'Piped Neckline & Export Quality Blouse Sample' : 'Full-Stack React & REST API District Directory',
      nameTamil: pathway.category === 'vocational' ? 'பைப்பிங் கழுத்து ஆடை மாதிரி' : 'React & REST API முழு-அடுக்கு செயலி',
      status: simRestApiProject ? 'completed' : 'missing',
      score: simRestApiProject ? 88 : undefined,
      details: simRestApiProject
        ? 'Verified submission: Debounced search, Zod schema validation, optimistic UI updates'
        : 'Milestone project: Required for senior junior developer tiers',
      detailsTamil: simRestApiProject
        ? 'முழுமையாக சரிபார்க்கப்பட்டது'
        : 'இன்னும் சமர்ப்பிக்கப்படவில்லை'
    }
  ];

  const baseProjectsCount = 2;
  let simulatedProjectsCount = baseProjectsCount;
  if (simJsChallenge) simulatedProjectsCount += 1;
  if (simRestApiProject && simulatedProjectsCount < totalProjects) simulatedProjectsCount += 1;

  const projectsCount = isSimulated ? simulatedProjectsCount : baseProjectsCount;
  const projectsPercentage = Number(((projectsCount / totalProjects) * 100).toFixed(1));
  const projectsWeight = 0.25;
  const projectsContribution = Number((projectsPercentage * projectsWeight).toFixed(2));

  const projectsComponent: ReadinessComponent = {
    id: 'projects',
    title: 'Projects Submitted',
    titleTamil: 'சமர்ப்பிக்கப்பட்ட திட்டப்பணிகள்',
    count: projectsCount,
    total: totalProjects,
    unit: 'projects verified',
    unitTamil: 'திட்டப்பணிகள் சரிபார்க்கப்பட்டன',
    percentage: projectsPercentage,
    weight: projectsWeight,
    weightPercentage: 25,
    weightedContribution: projectsContribution,
    status: projectsPercentage >= 75 ? 'strong' : projectsPercentage >= 50 ? 'moderate' : 'needs_work',
    formulaStr: '(Verified Multi-File Projects & PRs / Total Benchmark Projects) × 100',
    substitutionStr: `(${projectsCount} / ${totalProjects}) × 100 = ${projectsPercentage}%`,
    explanationEnglish: `Multi-file GitHub PRs, sandbox projects, or photographic proofs verified by automated rubrics and mentors. You have submitted ${projectsCount} of ${totalProjects}.`,
    explanationTamil: `சரிபார்க்கப்பட்ட திட்டப்பணிகள் மற்றும் குறியீடு சான்றுகள். மொத்தம் ${totalProjects} பணிகளில், நீங்கள் ${projectsCount} பணிகளை சமர்ப்பித்துள்ளீர்கள்.`,
    items: baseProjectItems,
    simulatedCount: isSimulated ? simulatedProjectsCount : undefined,
    simulatedPercentage: isSimulated ? projectsPercentage : undefined,
    simulatedContribution: isSimulated ? projectsContribution : undefined,
  };

  // -------------------------------------------------------------
  // 4. COMMUNICATION ASSESSED (Weight: 15%)
  // -------------------------------------------------------------
  const totalCommunication = 2;
  const interviewRecord = Object.values(vivaRecords).find(r => r.challengeId.startsWith('interview-'));
  const hasInterviewSaved = Boolean(interviewRecord);
  const actualVivaCount = Math.min(totalCommunication, Math.max(1, Object.keys(vivaRecords).length));
  const baseVivaCount = actualVivaCount;
  const vivaRecord = vivaRecords['challenge-web-profile'];

  const baseCommunicationItems: ComponentItem[] = [
    {
      id: 'comm-01',
      name: 'Architecture & Layout Tradeoff Oral Defense',
      nameTamil: 'கட்டமைப்பு தேர்வுக்கான வாய்மொழி விளக்கம்',
      status: 'completed',
      score: vivaRecord ? vivaRecord.averageScore : 92,
      details: vivaRecord
        ? `Completed oral defense in Tamil & English (Authenticity: ${vivaRecord.authenticityConfidence}, Score: ${vivaRecord.averageScore}%)`
        : 'Completed oral defense in Tamil & English (Score: 92%)',
      detailsTamil: 'தமிழ் மற்றும் ஆங்கிலத்தில் வாய்மொழி விளக்கம் வெற்றிகரமாக நிறைவுற்றது'
    },
    {
      id: 'comm-02',
      name: interviewRecord ? interviewRecord.challengeTitle : 'Bilingual AI Mock Interview & Role Defense',
      nameTamil: interviewRecord ? 'AI மாதிரி நேர்காணல் மதிப்பீடு' : '45 வினாடி இருமொழி தொழில்முறை அறிமுகம்',
      status: (simVivaDefense || hasInterviewSaved) ? 'completed' : 'in_progress',
      score: (simVivaDefense || hasInterviewSaved) ? (interviewRecord?.averageScore ?? 88) : undefined,
      details: interviewRecord
        ? `Completed role interview (${interviewRecord.authenticityConfidence}, Score: ${interviewRecord.averageScore}%)`
        : simVivaDefense
        ? 'Completed 45-second pitch: Cites verified SkillBridge proof scores with professional warmth'
        : 'Ready to record in Tamil, English, or Hindi via /interview',
      detailsTamil: interviewRecord
        ? 'AI மாதிரி நேர்காணல் வெற்றிகரமாக நிறைவுற்றது'
        : simVivaDefense
        ? 'இருமொழி அறிமுக உரை வெற்றிகரமாக பதிவு செய்யப்பட்டது'
        : 'பதிவு செய்யத் தயார் (/interview)'
    }
  ];

  let simulatedVivaCount = baseVivaCount;
  if (simVivaDefense && simulatedVivaCount < totalCommunication) simulatedVivaCount += 1;

  const communicationCount = isSimulated ? simulatedVivaCount : baseVivaCount;
  const communicationPercentage = Number(((communicationCount / totalCommunication) * 100).toFixed(1));
  const communicationWeight = 0.15;
  const communicationContribution = Number((communicationPercentage * communicationWeight).toFixed(2));

  const communicationComponent: ReadinessComponent = {
    id: 'communication',
    title: 'Communication Assessed',
    titleTamil: 'தகவல்தொடர்பு திறன் மதிப்பீடு',
    count: communicationCount,
    total: totalCommunication,
    unit: 'viva defenses completed',
    unitTamil: 'வாய்மொழி தேர்வுகள் நிறைவுற்றன',
    percentage: communicationPercentage,
    weight: communicationWeight,
    weightPercentage: 15,
    weightedContribution: communicationContribution,
    status: communicationPercentage >= 75 ? 'strong' : communicationPercentage >= 50 ? 'moderate' : 'needs_work',
    formulaStr: '(Authenticated Viva Defenses Completed / Total Required Defenses) × 100',
    substitutionStr: `(${communicationCount} / ${totalCommunication}) × 100 = ${communicationPercentage}%`,
    explanationEnglish: `Verifies your oral ability to articulate technical tradeoffs comfortably in your mother tongue (Tamil or English) through AI viva voce defense. You have completed ${communicationCount} of ${totalCommunication}.`,
    explanationTamil: `உங்கள் தாய்மொழியில் (தமிழ் அல்லது ஆங்கிலம்) தொழில்நுட்ப காரணங்களை தெளிவாக விளக்கும் வாய்மொழி தேர்வு. மொத்தம் ${totalCommunication} தேர்வுகளில், ${communicationCount} நிறைவு பெற்றுள்ளது.`,
    items: baseCommunicationItems,
    simulatedCount: isSimulated ? simulatedVivaCount : undefined,
    simulatedPercentage: isSimulated ? communicationPercentage : undefined,
    simulatedContribution: isSimulated ? communicationContribution : undefined,
  };

  // -------------------------------------------------------------
  // 5. REQUIREMENTS STILL MISSING (Weight: 10%)
  // -------------------------------------------------------------
  // Total milestones benchmark: 10
  const totalMilestones = 10;
  
  // Outstanding requirements
  const allMissingList: ComponentItem[] = [
    {
      id: 'req-01',
      name: 'Interactive DOM Shopping Cart Challenge',
      nameTamil: 'ஊடாடும் DOM வணிக கூடை சவால்',
      status: simJsChallenge ? 'completed' : 'missing',
      details: simJsChallenge
        ? 'Requirement cleared via simulated submission'
        : 'Proves vanilla JS DOM manipulation & event delegation (Estimated time: 35 mins)',
      detailsTamil: simJsChallenge
        ? 'தேவை பூர்த்தி செய்யப்பட்டது'
        : 'DOM கையாளுதல் திறனை நிரூபிக்க அவசியம் (35 நிமிடம்)'
    },
    {
      id: 'req-02',
      name: 'REST API & State Caching Bridge',
      nameTamil: 'REST API & தரவு சேமிப்பு சவால்',
      status: simRestApiProject ? 'completed' : 'missing',
      details: simRestApiProject
        ? 'Requirement cleared via simulated submission'
        : 'Current score 42% - requires score ≥ 70% to satisfy junior frontend benchmark',
      detailsTamil: simRestApiProject
        ? 'தேவை பூர்த்தி செய்யப்பட்டது'
        : 'தற்போதைய மதிப்பெண் 42% - இலக்கு 70%'
    },
    {
      id: 'req-03',
      name: 'Git Version Control & PR Etiquette Verification',
      nameTamil: 'கிட் பதிப்புக் கட்டுப்பாடு சரிபார்ப்பு',
      status: simGitAssessment ? 'completed' : 'missing',
      details: simGitAssessment
        ? 'Requirement cleared via simulated submission'
        : 'Currently unassessed - complete the branching & conventional commits checklist',
      detailsTamil: simGitAssessment
        ? 'தேவை பூர்த்தி செய்யப்பட்டது'
        : 'இன்னும் மதிப்பிடப்படவில்லை - கிட் பணிப்பாய்வு சோதனை தேவை'
    }
  ];

  // Count active missing requirements
  const currentMissingCount = allMissingList.filter(r => r.status === 'missing').length;
  const fulfilledMilestones = totalMilestones - currentMissingCount;
  const requirementsPercentage = Number(((fulfilledMilestones / totalMilestones) * 100).toFixed(1));
  const requirementsWeight = 0.10;
  const requirementsContribution = Number((requirementsPercentage * requirementsWeight).toFixed(2));

  const requirementsComponent: ReadinessComponent = {
    id: 'missingRequirements',
    title: 'Requirements Still Missing',
    titleTamil: 'இன்னும் பூர்த்தி செய்ய வேண்டிய தேவைகள்',
    count: currentMissingCount,
    total: totalMilestones,
    unit: 'outstanding requirements',
    unitTamil: 'நிலுவை தேவைகள்',
    percentage: requirementsPercentage,
    weight: requirementsWeight,
    weightPercentage: 10,
    weightedContribution: requirementsContribution,
    status: currentMissingCount === 0 ? 'strong' : currentMissingCount <= 2 ? 'moderate' : 'needs_work',
    formulaStr: '((Total Benchmark Milestones - Outstanding Requirements) / Total Benchmark Milestones) × 100',
    substitutionStr: `((${totalMilestones} - ${currentMissingCount}) / ${totalMilestones}) × 100 = ${requirementsPercentage}%`,
    explanationEnglish: `Direct count of key job benchmark criteria not yet satisfied. Currently, you have ${currentMissingCount} outstanding requirements out of ${totalMilestones} total milestones (${fulfilledMilestones} satisfied).`,
    explanationTamil: `வேலைவாய்ப்பிற்கு இன்னும் பூர்த்தி செய்யப்படாத முக்கிய தேவைகளின் எண்ணிக்கை. மொத்தம் ${totalMilestones} மைல்கற்களில், ${currentMissingCount} தேவைகள் நிலுவையில் உள்ளன (${fulfilledMilestones} பூர்த்தியாகியுள்ளன).`,
    items: allMissingList,
    simulatedCount: isSimulated ? currentMissingCount : undefined,
    simulatedPercentage: isSimulated ? requirementsPercentage : undefined,
    simulatedContribution: isSimulated ? requirementsContribution : undefined,
  };

  const components = [
    skillsComponent,
    projectsComponent,
    assessmentsComponent,
    communicationComponent,
    requirementsComponent,
  ];

  // -------------------------------------------------------------
  // OVERALL GUIDANCE SCORE (Sum of weighted contributions)
  // -------------------------------------------------------------
  const sumContribution = components.reduce((acc, c) => acc + c.weightedContribution, 0);
  const overallScore = Math.min(100, Math.max(0, Math.round(sumContribution)));

  // Calculate base score (without simulation) for comparison
  const baseSum = (50.0 * 0.30) + (50.0 * 0.25) + (60.0 * 0.20) + (50.0 * 0.15) + (70.0 * 0.10);
  const baseOverallScore = Math.round(baseSum); // 54

  // Formula summary strings
  const formulaStr =
    'Overall Guidance = (Skills % × 0.30) + (Projects % × 0.25) + (Assessments % × 0.20) + (Communication % × 0.15) + (Milestones % × 0.10)';
  const substitutionStr =
    `(${skillsPercentage}% × 0.30) + (${projectsPercentage}% × 0.25) + (${assessmentsPercentage}% × 0.20) + (${communicationPercentage}% × 0.15) + (${requirementsPercentage}% × 0.10)`;
  const resultStr =
    `${skillsContribution} + ${projectsContribution} + ${assessmentsContribution} + ${communicationContribution} + ${requirementsContribution} = ${overallScore}%`;

  // -------------------------------------------------------------
  // SIMULATION SCENARIOS
  // -------------------------------------------------------------
  const availableScenarios: SimulationScenario[] = [
    {
      id: 'sim-complete-js-challenge',
      label: 'Complete JS Challenge',
      labelTamil: 'ஜாவாஸ்கிரிப்ட் சவாலை முடித்தல்',
      description: 'Submit the Interactive DOM Shopping Cart code & event delegation test (ch-web-03)',
      impactSummary: '+16.3% overall readiness, solves 1 missing requirement, lifts Skills to 66.7%',
      targetComponent: 'projects',
      challengeId: 'ch-web-03'
    },
    {
      id: 'sim-submit-rest-api-project',
      label: 'Submit REST API Project',
      labelTamil: 'REST API திட்டப்பணியை சமர்ப்பித்தல்',
      description: 'Bridge the REST API skill gap (42% → 85%) and submit the District Directory PR (ch-web-04)',
      impactSummary: '+12.5% overall readiness, resolves API gap, adds 1 verified project',
      targetComponent: 'projects',
      challengeId: 'ch-web-04'
    },
    {
      id: 'sim-complete-viva',
      label: 'Record Bilingual Voice Viva',
      labelTamil: 'இருமொழி வாய்மொழி தேர்வு பதிவு',
      description: 'Record a 45-second bilingual elevator pitch in Tamil or English (challenge-comm-intro)',
      impactSummary: '+7.5% overall readiness, brings Communication to 100%',
      targetComponent: 'communication',
      challengeId: 'challenge-comm-intro'
    },
    {
      id: 'sim-pass-git-assessment',
      label: 'Verify Git & PR Etiquette',
      labelTamil: 'கிட் பணிப்பாய்வை சரிபார்த்தல்',
      description: 'Complete conventional commit branching & merge conflict resolution checklist',
      impactSummary: '+5.0% overall readiness, removes final missing dev-tool requirement',
      targetComponent: 'missingRequirements'
    }
  ];

  // -------------------------------------------------------------
  // "YOUR NEXT STEP" IN PLAIN LANGUAGE
  // -------------------------------------------------------------
  const nextStep: NextStepRecommendation = {
    challengeId: 'ch-web-03',
    title: 'Interactive DOM Shopping Cart with Event Delegation',
    titleTamil: 'ஊடாடும் DOM வணிக கூடை சவால்',
    category: 'Core Logic & UI State',
    timeEstimate: '35 mins',
    plainLanguageTitle: 'Complete the Interactive JavaScript Shopping Cart Challenge',
    plainLanguageTitleTamil: 'ஜாவாஸ்கிரிப்ட் வணிக கூடை பயிற்சியை நிறைவு செய்தல்',
    plainLanguageSummary:
      'You already have solid accessibility and layout proofs. Local software teams in Tamil Nadu look for evidence that you can handle user clicks, update quantities on the fly, and prevent memory leaks without relying on templates. Finishing this 35-minute exercise immediately demonstrates that ability.',
    plainLanguageSummaryTamil:
      'உங்களிடம் ஏற்கனவே சிறந்த HTML மற்றும் CSS சான்றுகள் உள்ளன. டெம்ப்ளேட்களை நம்பாமல் சுயமாக பயனர் கிளிக்குகளை கையாள்வதும், மெமரி கசிவு இல்லாமல் எண்களை மாற்றுவதும் உங்களுக்கு தெரியும் என்பதை நிரூபிக்க இந்த 35 நிமிட பயிற்சி உதவும்.',
    whyItMatters:
      'This single action directly improves 4 of your 5 readiness components at once: it counts as 1 verified project, passes 1 assessment, demonstrates your JavaScript skill, and removes 1 missing requirement.',
    whyItMattersTamil:
      'இந்த ஒரு பயிற்சி உங்கள் தயார்நிலையின் 4 கூறுகளை ஒரே நேரத்தில் உயர்த்துகிறது: 1 திட்டப்பணி, 1 தேர்வு, 1 நிரூபிக்கப்பட்ட திறன் மற்றும் 1 நிலுவைத் தேவையை நீக்குகிறது.',
    expectedOutcome: 'Lifts your Overall Guidance Indicator from 54% to ~70% (+16.3 pts) and unlocks 8 junior frontend job matches in Trichy and Chennai.',
    expectedOutcomeTamil: 'உங்கள் தயார்நிலை வழிகாட்டியை 54%-லிருந்து 70%-ஆக (+16.3%) உயர்த்தி திருச்சி மற்றும் சென்னையில் 8 வேலை வாய்ப்புகளுக்கு வழிவகுக்கும்.',
    impactGain: 16.3,
    points: 150
  };

  return {
    overallScore,
    baseOverallScore,
    isSimulated,
    activeSimulationIds: activeSimulations,
    components,
    weights: {
      skills: 30,
      projects: 25,
      assessments: 20,
      communication: 15,
      missingRequirements: 10,
    },
    formulaSummary: {
      formula: formulaStr,
      substitution: substitutionStr,
      result: resultStr,
    },
    availableScenarios,
    nextStep,
  };
}
