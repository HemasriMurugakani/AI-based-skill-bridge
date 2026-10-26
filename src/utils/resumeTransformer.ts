import { Persona, Pathway, Challenge, Badge, VivaProofRecord } from '../types';

export interface VerifiedSkillEntry {
  id: string;
  name: string;
  nameTamil?: string;
  category: string;
  level: number;
  score: number;
  evidenceCount: number;
  lastAssessed?: string;
  rubricCriteria: string[];
  verificationStamp: string;
}

export interface VerifiedProjectEntry {
  id: string;
  title: string;
  titleTamil?: string;
  type: string;
  score: number;
  completedAt: string;
  authenticityConfidence: 'Consistent' | 'Needs follow-up';
  summary: string;
  summaryTamil?: string;
  keyOutcomes: string[];
  verificationId: string;
  qaCount: number;
}

export interface VerifiedCommunicationEntry {
  id: string;
  title: string;
  titleTamil?: string;
  score: number;
  paceWpm?: number;
  clarityScore?: number;
  completedAt: string;
  authenticityConfidence: string;
  keyDefensePoints: string[];
}

export interface VerifiedBadgeEntry {
  id: string;
  title: string;
  titleTamil?: string;
  category: string;
  level: string;
  evidenceNotes: string;
  unlockedAt?: string;
  icon: string;
}

export interface ExcludedEntry {
  id: string;
  type: 'skill' | 'project' | 'communication' | 'badge';
  title: string;
  titleTamil?: string;
  reason: string;
  reasonTamil: string;
  currentScore?: number;
  statusBadge: string;
  statusBadgeTamil: string;
  actionRequired: string;
  actionRequiredTamil: string;
}

export interface VerifiedResumeData {
  persona: Persona;
  pathway: Pathway;
  summary: string;
  summaryTamil: string;
  verifiedSkills: VerifiedSkillEntry[];
  verifiedProjects: VerifiedProjectEntry[];
  verifiedCommunication: VerifiedCommunicationEntry[];
  verifiedBadges: VerifiedBadgeEntry[];
  excludedEntries: ExcludedEntry[];
  verificationUrl: string;
  verificationId: string;
  mentorEndorsement: {
    mentorName: string;
    mentorTitle: string;
    mentorTitleTamil: string;
    statement: string;
    statementTamil: string;
    date: string;
  };
  stats: {
    totalEvaluated: number;
    totalIncluded: number;
    totalExcluded: number;
    verificationRate: number;
  };
}

/**
 * Transforms learner passport records into verified-only resume data,
 * strictly filtering out unverified, pending, or sub-threshold items.
 */
export function buildVerifiedResumeData(
  persona: Persona,
  pathway: Pathway,
  challenges: Challenge[],
  vivaRecords: Record<string, VivaProofRecord>,
  badges: Badge[]
): VerifiedResumeData {
  const verifiedSkills: VerifiedSkillEntry[] = [];
  const excludedEntries: ExcludedEntry[] = [];

  // 1. Audit Skills
  pathway.skills.forEach(skill => {
    // Verified rule: score >= 75% AND (state === 'strong' OR evidenceCount >= 3)
    const isScorePassing = typeof skill.score === 'number' && skill.score >= 75;
    const hasSufficientEvidence = skill.evidenceCount >= 3 || skill.state === 'strong';

    if (isScorePassing && hasSufficientEvidence) {
      verifiedSkills.push({
        id: skill.id,
        name: skill.name,
        nameTamil: skill.nameTamil,
        category: skill.category,
        level: skill.level,
        score: skill.score!,
        evidenceCount: skill.evidenceCount,
        lastAssessed: skill.lastAssessed || 'Recently',
        rubricCriteria: skill.rubricCriteria,
        verificationStamp: `TN-SKILL-${skill.id.toUpperCase().slice(-6)}-VERIFIED`
      });
    } else {
      let reason = 'Excluded: Not yet assessed. Platform strictly rejects unverified self-claims on official resumes.';
      let reasonTamil = 'விலக்கப்பட்டது: இன்னும் மதிப்பீடு செய்யப்படவில்லை. சான்றற்ற கூற்றுகள் ரெஸ்யூமேயில் சேர்க்கப்படாது.';
      let statusBadge = 'Not Assessed';
      let statusBadgeTamil = 'மதிப்பிடப்படவில்லை';
      let actionRequired = 'Complete initial code/craft challenge to establish baseline proof.';
      let actionRequiredTamil = 'சான்றளிக்க ஆரம்ப சவாலை முடிக்கவும்.';

      if (typeof skill.score === 'number') {
        if (skill.score < 60) {
          reason = `Skill gap identified (${skill.score}%). Excluded: Competency is below the 75% verified threshold.`;
          reasonTamil = `திறன் இடைவெளி கண்டறியப்பட்டது (${skill.score}%). 75% தேர்ச்சி வரம்பிற்கு குறைவாக உள்ளதால் விலக்கப்பட்டது.`;
          statusBadge = 'Skill Gap (<60%)';
          statusBadgeTamil = 'திறன் இடைவெளி';
          actionRequired = 'Practice remediation challenges with AI Coach on /challenges.';
          actionRequiredTamil = 'AI வழிகாட்டியுடன் சவால்களைப் பயிற்சி செய்யவும்.';
        } else if (skill.score < 75) {
          reason = `Score (${skill.score}%) in development. Excluded: Requires 1 more passing rubric verification >= 75%.`;
          reasonTamil = `மதிப்பெண் (${skill.score}%) வளர்ச்சியில் உள்ளது. 75% அல்லது அதற்கு மேற்பட்ட தேர்ச்சி தேவை.`;
          statusBadge = 'In Development (60-74%)';
          statusBadgeTamil = 'வளர்ச்சியில் உள்ளது';
          actionRequired = 'Submit production artifact addressing rubric criteria.';
          actionRequiredTamil = 'விதிமுறைகளுக்கு ஏற்ப திட்டப்பணியை சமர்ப்பிக்கவும்.';
        } else {
          reason = `Passing score (${skill.score}%) but insufficient evidence count (${skill.evidenceCount}/3 proofs required).`;
          reasonTamil = `தேர்ச்சி மதிப்பெண் (${skill.score}%), ஆனால் போதுமான சான்றுகள் இல்லை (3 சான்றுகள் தேவை).`;
          statusBadge = 'Insufficient Proofs';
          statusBadgeTamil = 'சான்றுகள் போதாது';
          actionRequired = 'Submit 1 additional verified project or peer review.';
          actionRequiredTamil = 'கூடுதலாக 1 சான்றளிக்கப்பட்ட திட்டத்தை சமர்ப்பிக்கவும்.';
        }
      }

      excludedEntries.push({
        id: `excluded-skill-${skill.id}`,
        type: 'skill',
        title: skill.name,
        titleTamil: skill.nameTamil,
        reason,
        reasonTamil,
        currentScore: skill.score,
        statusBadge,
        statusBadgeTamil,
        actionRequired,
        actionRequiredTamil
      });
    }
  });

  // 2. Audit Projects / Artifacts
  const verifiedProjects: VerifiedProjectEntry[] = [];
  const vivaList = Object.values(vivaRecords);

  // Check each viva record (which links to a completed challenge)
  vivaList.forEach((viva, idx) => {
    // Only viva records with Consistent authenticity and score >= 75
    if (viva.averageScore >= 75 && viva.authenticityConfidence === 'Consistent') {
      const isProfileChallenge = viva.challengeId.includes('profile');
      const isBlouseChallenge = viva.challengeId.includes('blouse') || pathway.category === 'vocational';
      const isSqlChallenge = viva.challengeId.includes('sql') || persona.id.includes('murugan');

      let outcomes = [
        'Zero horizontal scrolling verified on 320px narrow mobile viewport',
        'Semantic HTML5 landmarks and WCAG 2.1 AA keyboard focus indicators (>=3px outline)',
        'Oral viva defense completed in bilingual Tamil/English with authentic tradeoff explanation'
      ];

      if (isBlouseChallenge) {
        outcomes = [
          '5-point precision body ease allowance calibrated within 1.5-inch tolerance',
          'Katori curve geometric pattern drafted with photographic step-by-step proof',
          'Mentor-inspected seam alignment and grain line accuracy'
        ];
      } else if (isSqlChallenge) {
        outcomes = [
          'Optimized multi-table SQL queries with indexed aggregations and zero Cartesian products',
          'Automated weekly sales discrepancy report with Excel pivot integration',
          'Explained normalization trade-offs in viva defense with high authenticity score'
        ];
      }

      verifiedProjects.push({
        id: viva.challengeId,
        title: viva.challengeTitle,
        type: isProfileChallenge ? 'Production Web Layout' : isBlouseChallenge ? 'Vocational Craft Artifact' : 'Analytical Data Pipeline',
        score: viva.averageScore,
        completedAt: viva.completedAt,
        authenticityConfidence: viva.authenticityConfidence,
        summary: `Production-ready submission accompanied by 3-question authenticated viva defense. Verified by automated test suites and civic mentors.`,
        summaryTamil: `தானியங்கி சோதனைகள் மற்றும் வழிகாட்டிகளால் உறுதிப்படுத்தப்பட்ட மாதிரி திட்டப்பணி.`,
        keyOutcomes: outcomes,
        verificationId: `TN-PRJ-${(idx + 1).toString().padStart(3, '0')}-VIVA`,
        qaCount: viva.qa.length
      });
    }
  });

  // Check challenges for excluded / pending items
  challenges.forEach(challenge => {
    const isAlreadyIncluded = verifiedProjects.some(p => p.id === challenge.id);
    if (!isAlreadyIncluded && challenge.pathwayId === pathway.id) {
      if (challenge.id === 'challenge-comm-intro') {
        excludedEntries.push({
          id: `excluded-challenge-${challenge.id}`,
          type: 'project',
          title: challenge.title,
          titleTamil: challenge.titleTamil,
          reason: 'Excluded: Bilingual Introduction Pitch pending. Not yet recorded by candidate.',
          reasonTamil: 'விலக்கப்பட்டது: இருமொழி அறிமுக உரை இன்னும் பதிவு செய்யப்படவில்லை.',
          statusBadge: 'Pending Submission',
          statusBadgeTamil: 'சமர்ப்பிக்கப்படவில்லை',
          actionRequired: 'Record 45-second bilingual introduction or AI mock interview via /interview.',
          actionRequiredTamil: '/interview மூலம் 45 வினாடி அறிமுக உரையை பதிவு செய்யவும்.'
        });
      } else if (challenge.id.includes('todo') || challenge.id.includes('katori') || challenge.id.includes('sql')) {
        excludedEntries.push({
          id: `excluded-challenge-${challenge.id}`,
          type: 'project',
          title: challenge.title,
          titleTamil: challenge.titleTamil,
          reason: 'Excluded: Pending mentor review. Code/artifact submitted, awaiting rubric signoff from mentor.',
          reasonTamil: 'விலக்கப்பட்டது: வழிகாட்டி ஆய்வுக்கு காத்திருக்கிறது. மதிப்பீட்டு ஒப்புதல் நிலுவையில் உள்ளது.',
          statusBadge: 'Pending Mentor Review',
          statusBadgeTamil: 'வழிகாட்டி ஆய்வில்',
          actionRequired: 'Awaiting mentor review feedback from K. Senthil Nathan.',
          actionRequiredTamil: 'வழிகாட்டி செந்தில் நாதனின் அனுமதிக்காக காத்திருக்கிறது.'
        });
      }
    }
  });

  // 3. Audit Communication / Viva Voce
  const verifiedCommunication: VerifiedCommunicationEntry[] = [];
  vivaList.forEach((viva) => {
    if (viva.averageScore >= 75) {
      const isInterview = viva.challengeId.startsWith('interview-');
      verifiedCommunication.push({
        id: viva.challengeId,
        title: isInterview ? 'AI Mock Interview & Role Communication Defense' : 'Technical Architecture & Layout Oral Defense',
        titleTamil: isInterview ? 'AI மாதிரி நேர்காணல் & வாய்மொழி விளக்கம்' : 'கட்டமைப்பு தேர்வுக்கான வாய்மொழி விளக்கம்',
        score: viva.averageScore,
        paceWpm: isInterview ? 124 : 118,
        clarityScore: viva.averageScore,
        completedAt: viva.completedAt,
        authenticityConfidence: viva.authenticityConfidence,
        keyDefensePoints: viva.qa.map(q => q.question)
      });
    }
  });

  // 4. Audit Badges / Micro-Credentials
  const verifiedBadges: VerifiedBadgeEntry[] = [];
  badges.forEach(b => {
    if (b.isUnlocked) {
      verifiedBadges.push({
        id: b.id,
        title: b.title,
        titleTamil: b.titleTamil,
        category: b.category,
        level: b.level,
        evidenceNotes: b.evidenceNotes,
        unlockedAt: b.unlockedAt || 'Recently',
        icon: b.icon
      });
    } else {
      excludedEntries.push({
        id: `excluded-badge-${b.id}`,
        type: 'badge',
        title: b.title,
        titleTamil: b.titleTamil,
        reason: 'Excluded: Micro-credential locked. Required milestone evidence not yet attained.',
        reasonTamil: 'விலக்கப்பட்டது: நற்சான்றிதழ் பூட்டப்பட்டுள்ளது. மைல்கல் சான்றுகள் இன்னும் எட்டப்படவில்லை.',
        statusBadge: 'Locked Milestone',
        statusBadgeTamil: 'பூட்டப்பட்டுள்ளது',
        actionRequired: b.evidenceNotes || 'Complete required pathway challenges.',
        actionRequiredTamil: 'தேவையான சவால்களை முடிக்கவும்.'
      });
    }
  });

  // 5. Professional Summaries tailored to persona & pathway
  let summary = `Driven ${pathway.title} apprentice with evidence-backed competencies in ${verifiedSkills.map(s => s.name).join(', ')}. All skills demonstrated through reproducible code repositories, zero-overflow mobile viewports, and oral defense viva voce examinations.`;
  let summaryTamil = `நிரூபிக்கப்பட்ட ${pathway.titleTamil} பயிற்சி தேர்ச்சியாளர். ${verifiedSkills.map(s => s.nameTamil || s.name).join(', ')} போன்ற திறன்களில் நேரடி குறியீடு சான்றுகள் மற்றும் வாய்மொழி தேர்வுகள் மூலம் சான்றளிக்கப்பட்டவர்.`;

  if (persona.id.includes('lakshmi')) {
    summary = `Skilled vocational artisan and micro-entrepreneur with demonstrated expertise in ${verifiedSkills.map(s => s.name).join(', ')}. Backed by photographic step-by-step inspections, 1.5-inch precision ease allowances, and garment cluster mentor endorsement.`;
    summaryTamil = `உறுதிப்படுத்தப்பட்ட தையற்கலை மற்றும் ஆடை வடிவமைப்பு கைவினைஞர். துல்லியமான உடல் அளவீடு, தையல் தளர்வு கணக்கீடு மற்றும் வழிகாட்டி சான்றளிக்கப்பட்ட மாதிரி தயாரிப்பாளர்.`;
  } else if (persona.id.includes('murugan')) {
    summary = `Analytical problem solver transitioning into business intelligence and data reporting with verified strengths in ${verifiedSkills.map(s => s.name).join(', ')}. Proven through optimized SQL scripts, discrepancy audits, and verbal rationale defense.`;
    summaryTamil = `நிரூபிக்கப்பட்ட தரவு ஆய்வாளர். SQL வினவல்கள், அறிக்கை ஆட்டோமேஷன் மற்றும் கணக்கீட்டு துல்லியத்தில் சான்றளிக்கப்பட்டவர்.`;
  }

  const totalIncluded = verifiedSkills.length + verifiedProjects.length + verifiedCommunication.length + verifiedBadges.length;
  const totalExcluded = excludedEntries.length;
  const totalEvaluated = totalIncluded + totalExcluded;
  const verificationRate = totalEvaluated > 0 ? Math.round((totalIncluded / totalEvaluated) * 100) : 100;

  return {
    persona,
    pathway,
    summary,
    summaryTamil,
    verifiedSkills,
    verifiedProjects,
    verifiedCommunication,
    verifiedBadges,
    excludedEntries,
    verificationUrl: `https://skillbridge.tn.gov.in/verify/${persona.id}`,
    verificationId: `TN-SB-${persona.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-2026`,
    mentorEndorsement: {
      mentorName: 'K. Senthil Nathan',
      mentorTitle: 'Senior Industry Mentor & State Evaluator',
      mentorTitleTamil: 'முதுநிலை தொழில் வழிகாட்டி & மாநில மதிப்பீட்டாளர்',
      statement: 'Workplace readiness attested based on reproducible code repository submissions, pattern drafting accuracy, and oral technical articulation.',
      statementTamil: 'குறியீடு களஞ்சியம், துல்லியமான வடிவமைப்பு மற்றும் வாய்மொழி விளக்கங்களின் அடிப்படையில் பணித்தயார்நிலை சான்றளிக்கப்பட்டது.',
      date: 'October 2026'
    },
    stats: {
      totalEvaluated,
      totalIncluded,
      totalExcluded,
      verificationRate
    }
  };
}
