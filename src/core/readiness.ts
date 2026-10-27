/**
 * Central Deterministic Readiness Calculator for SkillBridge AI
 * 
 * Implements the canonical formula:
 *   R = 0.30·S + 0.25·P + 0.20·A + 0.15·C + 0.10·Q
 * 
 * Each component is normalized to 0–100:
 *   S = share of required skills with accepted evidence (weighted by importance: must=2, nice=1)
 *   P = projects/practical submissions score vs the number required for the role
 *   A = average assessment score across required-skill assessments taken
 *   C = communication/workplace assessments completed vs required
 *   Q = fraction of role requirements/eligibility items satisfied
 * 
 * Missing data rule:
 *   A component with no evidence contributes 0 points to R but is flagged "not_yet_assessed"
 *   (never shown as failed), and evidenceCoverage = (components with ≥1 piece of evidence) / 5.
 */

import {
  Learner,
  Opportunity,
  ReadinessResult,
  ReadinessComponentResult,
  ReadinessStatus,
  SkillImportance,
  Evidence
} from './types';

export const COMPONENT_WEIGHTS = {
  skills: 0.30,
  projects: 0.25,
  assessments: 0.20,
  communication: 0.15,
  requirements: 0.10
} as const;

export interface ComputeReadinessOptions {
  includeSubstitutionSummary?: boolean;
}

/**
 * Checks if a given piece of evidence is accepted.
 * Accepted evidence is either AI-reviewed, mentor-verified, or has a passing rubric score (>= 70).
 */
export function isEvidenceAccepted(evidence: Evidence): boolean {
  if (evidence.verification === 'mentor-verified' || evidence.verification === 'ai-reviewed') {
    return true;
  }
  if (evidence.rubricResult && evidence.rubricResult.score >= 70) {
    return true;
  }
  return false;
}

/**
 * Normalizes status string based on component score and evidence presence.
 */
function resolveStatus(hasEvidence: boolean, score: number): ReadinessStatus {
  if (!hasEvidence) return 'not_yet_assessed';
  if (score >= 75) return 'strong';
  if (score >= 50) return 'moderate';
  return 'needs_work';
}

/**
 * Main Pure Function: computeReadiness(learner, targetRole)
 * Single source of truth across Profile, Dashboard, Passport, Readiness Page, and Employer View.
 */
export function computeReadiness(
  learner: Learner,
  targetRole?: Opportunity | null,
  options?: ComputeReadinessOptions
): ReadinessResult {
  const missing: string[] = [];
  const nextBestActions: string[] = [];

  // =========================================================================
  // 1. S: Skills Demonstrated (Weight = 0.30)
  // Share of required skills with accepted evidence (must=2, nice=1)
  // =========================================================================
  const requiredSkills = targetRole?.requiredSkills && targetRole.requiredSkills.length > 0
    ? targetRole.requiredSkills
    : [
        { skillName: 'HTML5 Semantic Layouts', requiredLevel: 4, importance: 'must' as SkillImportance },
        { skillName: 'CSS Grid & Flexbox Fluid Design', requiredLevel: 4, importance: 'must' as SkillImportance },
        { skillName: 'WCAG 2.1 AA Keyboard Accessibility', requiredLevel: 3, importance: 'must' as SkillImportance },
        { skillName: 'JavaScript ES6 & DOM Delegation', requiredLevel: 3, importance: 'must' as SkillImportance },
        { skillName: 'Git Version Control & PR Workflow', requiredLevel: 2, importance: 'nice' as SkillImportance },
        { skillName: 'REST API & State Caching', requiredLevel: 3, importance: 'nice' as SkillImportance }
      ];

  const learnerEvidenceList = learner.evidence || [];
  const acceptedEvidence = learnerEvidenceList.filter(isEvidenceAccepted);

  // Set of skills verified via accepted evidence or marked strong in learner.skills
  const verifiedSkillNames = new Set<string>();
  acceptedEvidence.forEach(ev => {
    ev.skillIds.forEach(id => verifiedSkillNames.add(id.toLowerCase()));
  });
  if (learner.skills) {
    Object.values(learner.skills).forEach(ls => {
      if (ls.state === 'strong' || (ls.score !== undefined && ls.score >= 70)) {
        verifiedSkillNames.add(ls.name.toLowerCase());
        verifiedSkillNames.add(ls.skillId.toLowerCase());
      }
    });
  }

  let totalSkillWeight = 0;
  let demonstratedSkillWeight = 0;
  const missingSkillsList: string[] = [];

  requiredSkills.forEach(req => {
    const weight = req.importance === 'nice' ? 1 : 2;
    totalSkillWeight += weight;
    const reqNameLower = req.skillName.toLowerCase();
    
    // Check if verified
    const isDemonstrated = Array.from(verifiedSkillNames).some(v => 
      v === reqNameLower || 
      reqNameLower.includes(v) || 
      v.includes(reqNameLower)
    );

    if (isDemonstrated) {
      demonstratedSkillWeight += weight;
    } else {
      missingSkillsList.push(req.skillName);
      missing.push(
        req.importance === 'nice'
          ? `Recommended skill: ${req.skillName} (nice-to-have)`
          : `Core skill gap: ${req.skillName} (must-have)`
      );
    }
  });

  const hasAnySkillEvidence = acceptedEvidence.length > 0 || (learner.skills && Object.keys(learner.skills).length > 0);
  const sScore = totalSkillWeight > 0 && hasAnySkillEvidence
    ? Math.min(100, Math.max(0, (demonstratedSkillWeight / totalSkillWeight) * 100))
    : 0;
  const sPoints = Number((COMPONENT_WEIGHTS.skills * sScore).toFixed(2));
  const sStatus = resolveStatus(hasAnySkillEvidence, sScore);

  const skillsComponent: ReadinessComponentResult = {
    key: 'skills',
    symbol: 'S',
    name: 'Skills Demonstrated',
    nameTamil: 'நிரூபிக்கப்பட்ட திறன்கள்',
    weight: COMPONENT_WEIGHTS.skills,
    score: Number(sScore.toFixed(1)),
    points: sPoints,
    status: sStatus,
    hasEvidence: Boolean(hasAnySkillEvidence),
    evaluatedCount: demonstratedSkillWeight,
    requiredCount: totalSkillWeight,
    explanation: hasAnySkillEvidence
      ? `Weighted evidence coverage: ${demonstratedSkillWeight} / ${totalSkillWeight} points (must=2x, nice=1x).`
      : 'No verified skill evidence has been submitted yet.',
    explanationTamil: hasAnySkillEvidence
      ? `எடையிடப்பட்ட சான்று பாதுகாப்பு: ${demonstratedSkillWeight} / ${totalSkillWeight} புள்ளிகள்.`
      : 'சரிபார்க்கப்பட்ட திறன் சான்றுகள் இதுவரை சமர்ப்பிக்கப்படவில்லை.'
  };

  // =========================================================================
  // 2. P: Practical Projects (Weight = 0.25)
  // Submissions score vs required number of projects for role
  // =========================================================================
  const requiredProjects = targetRole?.requiredProjectsCount || 2;
  const projectEvidence = acceptedEvidence.filter(e => e.type === 'project');
  const projectSubmissions = (learner.submissions || []).filter(s => s.type === 'project' && s.status === 'accepted');

  const hasProjectEvidence = projectEvidence.length > 0 || projectSubmissions.length > 0;
  let totalProjectScoreSum = 0;

  projectEvidence.forEach(e => {
    totalProjectScoreSum += (e.rubricResult?.score || 80);
  });
  // Add any accepted submissions not counted in evidence
  projectSubmissions.forEach(s => {
    if (!projectEvidence.some(e => e.id === s.evidenceId)) {
      totalProjectScoreSum += s.score;
    }
  });

  const pScore = hasProjectEvidence && requiredProjects > 0
    ? Math.min(100, Math.max(0, totalProjectScoreSum / requiredProjects))
    : 0;
  const pPoints = Number((COMPONENT_WEIGHTS.projects * pScore).toFixed(2));
  const pStatus = resolveStatus(hasProjectEvidence, pScore);

  if (!hasProjectEvidence) {
    missing.push(`Practical project: 0 of ${requiredProjects} portfolio projects submitted`);
    nextBestActions.push(`Submit practical challenge project for ${requiredSkills[0]?.skillName || 'core pathway'}`);
  } else if (projectEvidence.length < requiredProjects) {
    missing.push(`Second portfolio project required (${projectEvidence.length}/${requiredProjects} completed)`);
    nextBestActions.push('Complete REST API integration project to maximize project points');
  }

  const projectsComponent: ReadinessComponentResult = {
    key: 'projects',
    symbol: 'P',
    name: 'Practical Projects',
    nameTamil: 'நடைமுறை திட்டப்பணிகள்',
    weight: COMPONENT_WEIGHTS.projects,
    score: Number(pScore.toFixed(1)),
    points: pPoints,
    status: pStatus,
    hasEvidence: hasProjectEvidence,
    evaluatedCount: projectEvidence.length,
    requiredCount: requiredProjects,
    explanation: hasProjectEvidence
      ? `${projectEvidence.length} of ${requiredProjects} verified projects completed (Cumulative score: ${totalProjectScoreSum}%).`
      : 'No practical portfolio projects submitted yet.',
    explanationTamil: hasProjectEvidence
      ? `${requiredProjects}-ல் ${projectEvidence.length} சரிபார்க்கப்பட்ட திட்டப்பணிகள் நிறைவு.`
      : 'நடைமுறை திட்டப்பணிகள் இன்னும் சமர்ப்பிக்கப்படவில்லை.'
  };

  // =========================================================================
  // 3. A: Assessments (Weight = 0.20)
  // Average score across technical assessments taken
  // =========================================================================
  const learnerAssessments = learner.assessments || [];
  const assessmentEvidence = acceptedEvidence.filter(e => e.type === 'assessment');
  const hasAssessmentEvidence = learnerAssessments.length > 0 || assessmentEvidence.length > 0;

  let totalAssessmentScore = 0;
  let assessmentCount = 0;

  learnerAssessments.forEach(a => {
    totalAssessmentScore += a.score;
    assessmentCount += 1;
  });
  assessmentEvidence.forEach(e => {
    if (!learnerAssessments.some(a => a.id === e.id || a.evidenceId === e.id)) {
      totalAssessmentScore += (e.rubricResult?.score || 80);
      assessmentCount += 1;
    }
  });

  const aScore = hasAssessmentEvidence && assessmentCount > 0
    ? Math.min(100, Math.max(0, totalAssessmentScore / assessmentCount))
    : 0;
  const aPoints = Number((COMPONENT_WEIGHTS.assessments * aScore).toFixed(2));
  const aStatus = resolveStatus(hasAssessmentEvidence, aScore);

  if (!hasAssessmentEvidence) {
    missing.push('Assessments: Technical quiz or rubric evaluations not yet taken');
  }

  const assessmentsComponent: ReadinessComponentResult = {
    key: 'assessments',
    symbol: 'A',
    name: 'Skill Assessments',
    nameTamil: 'திறன் மதிப்பீடுகள்',
    weight: COMPONENT_WEIGHTS.assessments,
    score: Number(aScore.toFixed(1)),
    points: aPoints,
    status: aStatus,
    hasEvidence: hasAssessmentEvidence,
    evaluatedCount: assessmentCount,
    explanation: hasAssessmentEvidence
      ? `Average score across ${assessmentCount} verified assessments: ${Math.round(aScore)}%.`
      : 'No technical assessments completed yet.',
    explanationTamil: hasAssessmentEvidence
      ? `${assessmentCount} மதிப்பீடுகளின் சராசரி மதிப்பெண்: ${Math.round(aScore)}%.`
      : 'தொழில்நுட்ப மதிப்பீடுகள் இன்னும் செய்யப்படவில்லை.'
  };

  // =========================================================================
  // 4. C: Communication & Workplace (Weight = 0.15)
  // Workplace/viva assessments completed vs required
  // =========================================================================
  const requiredCommCount = targetRole?.requiredCommunicationCount || 1;
  const commEvidence = acceptedEvidence.filter(e => e.type === 'voice' || e.type === 'written');
  const commAssessments = (learner.assessments || []).filter(a => a.type === 'communication');
  const hasCommEvidence = commEvidence.length > 0 || commAssessments.length > 0;

  let totalCommScore = 0;
  commEvidence.forEach(e => {
    totalCommScore += (e.rubricResult?.score || 85);
  });
  commAssessments.forEach(a => {
    if (!commEvidence.some(e => e.id === a.evidenceId)) {
      totalCommScore += a.score;
    }
  });

  const cScore = hasCommEvidence && requiredCommCount > 0
    ? Math.min(100, Math.max(0, totalCommScore / requiredCommCount))
    : 0;
  const cPoints = Number((COMPONENT_WEIGHTS.communication * cScore).toFixed(2));
  const cStatus = resolveStatus(hasCommEvidence, cScore);

  if (!hasCommEvidence) {
    missing.push('Communication: Voice viva defense / oral explanation not yet recorded');
    nextBestActions.push('Record 2-minute Tamil/English viva explaining DOM delegation');
  }

  const communicationComponent: ReadinessComponentResult = {
    key: 'communication',
    symbol: 'C',
    name: 'Workplace Communication',
    nameTamil: 'பணித்தள தொடர்பு மற்றும் வாய்மொழி',
    weight: COMPONENT_WEIGHTS.communication,
    score: Number(cScore.toFixed(1)),
    points: cPoints,
    status: cStatus,
    hasEvidence: hasCommEvidence,
    evaluatedCount: commEvidence.length + commAssessments.length,
    requiredCount: requiredCommCount,
    explanation: hasCommEvidence
      ? `Completed ${commEvidence.length + commAssessments.length} oral/written defense(s) with ${Math.round(cScore)}% score.`
      : 'No voice viva or workplace defense recorded yet.',
    explanationTamil: hasCommEvidence
      ? `${commEvidence.length + commAssessments.length} வாய்மொழி/தொடர்பு சான்றுகள் ${Math.round(cScore)}% மதிப்பெண்ணுடன் சரிபார்க்கப்பட்டன.`
      : 'வாய்மொழித் தேர்வு இன்னும் சமர்ப்பிக்கப்படவில்லை.'
  };

  // =========================================================================
  // 5. Q: Role Requirements & Eligibility (Weight = 0.10)
  // Fraction of role requirements/eligibility items satisfied
  // =========================================================================
  const eligibilityItems = targetRole?.eligibilityItems && targetRole.eligibilityItems.length > 0
    ? targetRole.eligibilityItems
    : [
        { id: 'el-degree', requirement: 'Degree or Diploma in Computer Applications / Science / Craft' },
        { id: 'el-state', requirement: 'Tamil Nadu residency or local district preference' },
        { id: 'el-practice', requirement: 'Active deliberate practice record (streak ≥ 7 days)' },
        { id: 'el-joining', requirement: 'Available for immediate apprenticeship or hybrid training' }
      ];

  // Evaluate each eligibility criterion
  let satisfiedEligibilityCount = 0;
  const hasEvaluatedEligibility = Boolean(learner.education || learner.location || learner.streak > 0);

  if (hasEvaluatedEligibility) {
    eligibilityItems.forEach(item => {
      // Check manual override in learner record
      if (learner.eligibilityOverrides && learner.eligibilityOverrides[item.id] !== undefined) {
        if (learner.eligibilityOverrides[item.id]) satisfiedEligibilityCount += 1;
        return;
      }
      
      const reqLower = item.requirement.toLowerCase();
      if (reqLower.includes('degree') || reqLower.includes('diploma') || reqLower.includes('bca')) {
        const eduLower = (learner.education || '').toLowerCase();
        if (eduLower.includes('bca') || eduLower.includes('b.sc') || eduLower.includes('b.com') || eduLower.includes('sslc') || eduLower.includes('diploma')) {
          satisfiedEligibilityCount += 1;
        }
      } else if (reqLower.includes('tamil nadu') || reqLower.includes('district') || reqLower.includes('residency')) {
        const locLower = (learner.location || '').toLowerCase();
        if (locLower.includes('tamil nadu') || locLower.includes('trichy') || locLower.includes('coimbatore') || locLower.includes('tiruppur') || locLower.includes('chennai')) {
          satisfiedEligibilityCount += 1;
        }
      } else if (reqLower.includes('practice') || reqLower.includes('streak')) {
        if ((learner.streak || learner.streakDays || 0) >= 7) {
          satisfiedEligibilityCount += 1;
        }
      } else if (reqLower.includes('immediate') || reqLower.includes('joining')) {
        // If learner is still in final year / active student, immediate corporate joining is pending degree completion
        const eduLower = (learner.education || '').toLowerCase();
        const tagLower = (learner.tag || '').toLowerCase();
        const isStillStudent = eduLower.includes('final year') || eduLower.includes('student') || tagLower.includes('student');
        if (!isStillStudent) {
          satisfiedEligibilityCount += 1;
        } else {
          missing.push('Immediate corporate joining: Pending final year college graduation');
        }
      } else {
        satisfiedEligibilityCount += 1; // Default satisfied if pre-matched
      }
    });
  }

  const qScore = hasEvaluatedEligibility && eligibilityItems.length > 0
    ? Math.min(100, Math.max(0, (satisfiedEligibilityCount / eligibilityItems.length) * 100))
    : 0;
  const qPoints = Number((COMPONENT_WEIGHTS.requirements * qScore).toFixed(2));
  const qStatus = resolveStatus(hasEvaluatedEligibility, qScore);

  if (!hasEvaluatedEligibility) {
    missing.push('Role eligibility: Educational verification and location matching required');
  }

  const requirementsComponent: ReadinessComponentResult = {
    key: 'requirements',
    symbol: 'Q',
    name: 'Role Requirements',
    nameTamil: 'பணித்தகுதி மற்றும் தகுதிகள்',
    weight: COMPONENT_WEIGHTS.requirements,
    score: Number(qScore.toFixed(1)),
    points: qPoints,
    status: qStatus,
    hasEvidence: hasEvaluatedEligibility,
    evaluatedCount: satisfiedEligibilityCount,
    requiredCount: eligibilityItems.length,
    explanation: hasEvaluatedEligibility
      ? `${satisfiedEligibilityCount} of ${eligibilityItems.length} role requirements and eligibility benchmarks met.`
      : 'Learner profile prerequisites not yet assessed.',
    explanationTamil: hasEvaluatedEligibility
      ? `${eligibilityItems.length}-ல் ${satisfiedEligibilityCount} தகுதிகள் பூர்த்தி செய்யப்பட்டன.`
      : 'சுயவிவர முன்நிபந்தனைகள் இன்னும் சரிபார்க்கப்படவில்லை.'
  };

  // =========================================================================
  // Total Calculation and Synthesis
  // R = 0.30·S + 0.25·P + 0.20·A + 0.15·C + 0.10·Q
  // =========================================================================
  const components = [
    skillsComponent,
    projectsComponent,
    assessmentsComponent,
    communicationComponent,
    requirementsComponent
  ];

  const rawTotal = sPoints + pPoints + aPoints + cPoints + qPoints;
  const total = Math.min(100, Math.max(0, Math.round(rawTotal * 10) / 10));

  // Evidence coverage: (components with >= 1 piece of evidence) / 5
  const componentsWithEvidence = components.filter(c => c.hasEvidence).length;
  const evidenceCoverage = Number((componentsWithEvidence / 5).toFixed(2));

  // Synthesize Next Best Actions if not already added
  if (missingSkillsList.length > 0 && nextBestActions.length < 2) {
    nextBestActions.push(`Demonstrate evidence for ${missingSkillsList[0]} (+${Math.round(COMPONENT_WEIGHTS.skills * (2 / totalSkillWeight) * 100)} pts)`);
  }

  const result: ReadinessResult = {
    total: Math.round(total), // integer readiness index for display
    components,
    missing,
    nextBestActions,
    evidenceCoverage,
    formulaSummary: options?.includeSubstitutionSummary
      ? {
          formula: 'R = 0.30·S + 0.25·P + 0.20·A + 0.15·C + 0.10·Q',
          substitution: `R = 0.30(${sScore.toFixed(1)}) + 0.25(${pScore.toFixed(1)}) + 0.20(${aScore.toFixed(1)}) + 0.15(${cScore.toFixed(1)}) + 0.10(${qScore.toFixed(1)})`,
          result: `${total}%`
        }
      : undefined
  };

  return result;
}

/**
 * Convenience helper to calculate readiness with a hypothetical learner clone.
 * Never mutates original learner. Perfect for What-If simulator.
 */
export function simulateReadiness(
  learner: Learner,
  targetRole: Opportunity | null | undefined,
  modifier: (clone: Learner) => void
): { base: ReadinessResult; simulated: ReadinessResult; delta: number } {
  const base = computeReadiness(learner, targetRole);
  
  // Create deep clone
  const clone: Learner = JSON.parse(JSON.stringify(learner));
  modifier(clone);
  
  const simulated = computeReadiness(clone, targetRole);
  const delta = Math.round((simulated.total - base.total) * 10) / 10;
  
  return {
    base,
    simulated,
    delta
  };
}
