import { describe, it, expect } from 'vitest';
import { computeReadiness, COMPONENT_WEIGHTS, simulateReadiness } from './readiness';
import { Learner, Opportunity, Evidence } from './types';

// Standard mock target role
const mockTargetRole: Opportunity = {
  id: 'opp-frontend-apprentice',
  title: 'Junior Web Apprentice',
  company: 'Vaigai Tech Labs',
  location: 'Coimbatore, Tamil Nadu',
  type: 'Apprenticeship',
  category: 'technical',
  stipendOrSalary: '₹18,000 / month',
  requiredProjectsCount: 2,
  requiredAssessmentsCount: 3,
  requiredCommunicationCount: 1,
  requiredSkills: [
    { skillName: 'HTML5 Semantic Layouts', requiredLevel: 4, importance: 'must' }, // weight 2
    { skillName: 'CSS Grid & Flexbox Fluid Design', requiredLevel: 4, importance: 'must' }, // weight 2
    { skillName: 'WCAG 2.1 AA Keyboard Accessibility', requiredLevel: 3, importance: 'must' }, // weight 2
    { skillName: 'JavaScript ES6 & DOM Delegation', requiredLevel: 3, importance: 'must' }, // weight 2
    { skillName: 'Git Version Control & PR Workflow', requiredLevel: 2, importance: 'nice' }, // weight 1
    { skillName: 'REST API & State Caching', requiredLevel: 3, importance: 'nice' } // weight 1
  ], // Total weight = 2 + 2 + 2 + 2 + 1 + 1 = 10
  eligibilityItems: [
    { id: 'el-degree', requirement: 'BCA or Computer Science Degree' },
    { id: 'el-location', requirement: 'Tamil Nadu residency' },
    { id: 'el-practice', requirement: 'Active streak >= 7 days' },
    { id: 'el-availability', requirement: 'Available for immediate joining' }
  ],
  description: 'Apprentice role for aspiring frontend engineers.'
};

const createEmptyLearner = (): Learner => ({
  id: 'learner-empty',
  name: 'Empty Learner',
  tag: 'New Candidate',
  avatar: '',
  location: '',
  education: '',
  bio: '',
  targetDomainId: 'web-dev',
  targetRoleId: 'opp-frontend-apprentice',
  streak: 0,
  streakDays: 0,
  xp: 0,
  xpPoints: 0,
  dailyTimeAvailable: '0 mins',
  preferredWork: 'Remote',
  activeBadges: [],
  skills: {},
  evidence: [],
  submissions: [],
  assessments: [],
  completedTaskIds: [],
  activityLogs: []
});

describe('Deterministic Readiness Calculator (computeReadiness)', () => {
  // 1. Weight Sum Rule
  it('1. verifies component weights sum exactly to 1.000', () => {
    const sum =
      COMPONENT_WEIGHTS.skills +
      COMPONENT_WEIGHTS.projects +
      COMPONENT_WEIGHTS.assessments +
      COMPONENT_WEIGHTS.communication +
      COMPONENT_WEIGHTS.requirements;

    expect(Number(sum.toFixed(4))).toBe(1.0);
    expect(COMPONENT_WEIGHTS.skills).toBe(0.30);
    expect(COMPONENT_WEIGHTS.projects).toBe(0.25);
    expect(COMPONENT_WEIGHTS.assessments).toBe(0.20);
    expect(COMPONENT_WEIGHTS.communication).toBe(0.15);
    expect(COMPONENT_WEIGHTS.requirements).toBe(0.10);
  });

  // 2. Empty Learner Case
  it('2. evaluates empty learner with zero score, coverage 0, and not_yet_assessed status', () => {
    const emptyLearner = createEmptyLearner();
    const result = computeReadiness(emptyLearner, mockTargetRole);

    expect(result.total).toBe(0);
    expect(result.evidenceCoverage).toBe(0);
    expect(result.missing.length).toBeGreaterThan(0);

    // Missing data rule: NEVER shown as failed, only not_yet_assessed
    result.components.forEach(comp => {
      expect(comp.hasEvidence).toBe(false);
      expect(comp.score).toBe(0);
      expect(comp.points).toBe(0);
      expect(comp.status).toBe('not_yet_assessed');
      expect(comp.status).not.toBe('failed' as any);
    });
  });

  // 3. Full Learner Case
  it('3. evaluates full learner with 100% across all components and coverage 1.0', () => {
    const fullLearner: Learner = {
      ...createEmptyLearner(),
      education: 'BCA Graduate, Jamal Mohamed College, Trichy',
      tag: 'Certified Graduate',
      location: 'Tiruchirappalli, Tamil Nadu',
      streak: 30,
      streakDays: 30,
      dailyTimeAvailable: '60 mins / day',
      skills: {
        'html': { skillId: 'html', name: 'HTML5 Semantic Layouts', category: 'web', level: 4, state: 'strong', score: 100, evidenceCount: 3, acceptedEvidenceIds: ['ev-1'] },
        'css': { skillId: 'css', name: 'CSS Grid & Flexbox Fluid Design', category: 'web', level: 4, state: 'strong', score: 100, evidenceCount: 3, acceptedEvidenceIds: ['ev-2'] },
        'wcag': { skillId: 'wcag', name: 'WCAG 2.1 AA Keyboard Accessibility', category: 'web', level: 3, state: 'strong', score: 100, evidenceCount: 2, acceptedEvidenceIds: ['ev-3'] },
        'js': { skillId: 'js', name: 'JavaScript ES6 & DOM Delegation', category: 'web', level: 3, state: 'strong', score: 100, evidenceCount: 2, acceptedEvidenceIds: ['ev-4'] },
        'git': { skillId: 'git', name: 'Git Version Control & PR Workflow', category: 'tools', level: 2, state: 'strong', score: 100, evidenceCount: 2, acceptedEvidenceIds: ['ev-5'] },
        'api': { skillId: 'api', name: 'REST API & State Caching', category: 'web', level: 3, state: 'strong', score: 100, evidenceCount: 2, acceptedEvidenceIds: ['ev-6'] }
      },
      evidence: [
        {
          id: 'proj-1',
          skillIds: ['html', 'css'],
          type: 'project',
          artifactRef: 'https://github.com/learner/responsive-portfolio',
          rubricResult: { score: 100 },
          createdAt: '2026-10-20',
          verification: 'mentor-verified'
        },
        {
          id: 'proj-2',
          skillIds: ['js', 'api'],
          type: 'project',
          artifactRef: 'https://github.com/learner/api-dashboard',
          rubricResult: { score: 100 },
          createdAt: '2026-10-22',
          verification: 'mentor-verified'
        },
        {
          id: 'viva-1',
          skillIds: ['html', 'js'],
          type: 'voice',
          artifactRef: 'audio/viva-1.wav',
          rubricResult: { score: 100 },
          createdAt: '2026-10-23',
          verification: 'ai-reviewed'
        }
      ],
      assessments: [
        { id: 'ass-1', title: 'HTML5 & Semantics', score: 100, passed: true, completedAt: '2026-10-20', type: 'technical' },
        { id: 'ass-2', title: 'CSS Grid Mastery', score: 100, passed: true, completedAt: '2026-10-21', type: 'technical' },
        { id: 'ass-3', title: 'JS & DOM Concepts', score: 100, passed: true, completedAt: '2026-10-22', type: 'technical' }
      ]
    };

    const result = computeReadiness(fullLearner, mockTargetRole);

    expect(result.total).toBe(100);
    expect(result.evidenceCoverage).toBe(1.0);
    expect(result.components.find(c => c.key === 'skills')?.score).toBe(100);
    expect(result.components.find(c => c.key === 'projects')?.score).toBe(100);
    expect(result.components.find(c => c.key === 'assessments')?.score).toBe(100);
    expect(result.components.find(c => c.key === 'communication')?.score).toBe(100);
    expect(result.components.find(c => c.key === 'requirements')?.score).toBe(100);
  });

  // 4. Partial Learner Known Calculation
  it('4. computes exact known partial math: S=100%, A=80%, other components unassessed (Total = 46%)', () => {
    const partialLearner: Learner = {
      ...createEmptyLearner(),
      skills: {
        'html': { skillId: 'html', name: 'HTML5 Semantic Layouts', category: 'web', level: 4, state: 'strong', score: 100, evidenceCount: 1, acceptedEvidenceIds: ['ev-1'] },
        'css': { skillId: 'css', name: 'CSS Grid & Flexbox Fluid Design', category: 'web', level: 4, state: 'strong', score: 100, evidenceCount: 1, acceptedEvidenceIds: ['ev-2'] },
        'wcag': { skillId: 'wcag', name: 'WCAG 2.1 AA Keyboard Accessibility', category: 'web', level: 3, state: 'strong', score: 100, evidenceCount: 1, acceptedEvidenceIds: ['ev-3'] },
        'js': { skillId: 'js', name: 'JavaScript ES6 & DOM Delegation', category: 'web', level: 3, state: 'strong', score: 100, evidenceCount: 1, acceptedEvidenceIds: ['ev-4'] },
        'git': { skillId: 'git', name: 'Git Version Control & PR Workflow', category: 'tools', level: 2, state: 'strong', score: 100, evidenceCount: 1, acceptedEvidenceIds: ['ev-5'] },
        'api': { skillId: 'api', name: 'REST API & State Caching', category: 'web', level: 3, state: 'strong', score: 100, evidenceCount: 1, acceptedEvidenceIds: ['ev-6'] }
      },
      assessments: [
        { id: 'ass-1', title: 'Core Skill Assessment', score: 80, passed: true, completedAt: '2026-10-20', type: 'technical' }
      ]
    };

    const result = computeReadiness(partialLearner, mockTargetRole);

    // Expected:
    // S = 100% * 0.30 = 30.0 pts
    // P = 0% * 0.25 = 0.0 pts (not_yet_assessed)
    // A = 80% * 0.20 = 16.0 pts
    // C = 0% * 0.15 = 0.0 pts (not_yet_assessed)
    // Q = 0% * 0.10 = 0.0 pts (not_yet_assessed)
    // Total = 30 + 16 = 46.0 pts
    expect(result.total).toBe(46);
    expect(result.evidenceCoverage).toBe(0.4); // 2 of 5 components have evidence
    expect(result.components.find(c => c.key === 'skills')?.points).toBe(30);
    expect(result.components.find(c => c.key === 'assessments')?.points).toBe(16);
    expect(result.components.find(c => c.key === 'projects')?.status).toBe('not_yet_assessed');
    expect(result.components.find(c => c.key === 'communication')?.status).toBe('not_yet_assessed');
  });

  // 5. Missing Components Flagged Rule
  it('5. flags missing components as "not_yet_assessed" and populates missing list', () => {
    const learnerWithNoVoice = createEmptyLearner();
    const result = computeReadiness(learnerWithNoVoice, mockTargetRole);

    const commComp = result.components.find(c => c.key === 'communication');
    expect(commComp?.status).toBe('not_yet_assessed');
    expect(commComp?.hasEvidence).toBe(false);

    // Missing array must list project and communication requirements
    expect(result.missing.some(m => m.toLowerCase().includes('communication') || m.toLowerCase().includes('viva'))).toBe(true);
    expect(result.missing.some(m => m.toLowerCase().includes('project'))).toBe(true);
  });

  // 6. Monotonicity Rule
  it('6. guarantees strict monotonicity: adding valid evidence never decreases readiness', () => {
    const baseLearner: Learner = {
      ...createEmptyLearner(),
      education: 'BCA Final Year',
      location: 'Trichy, Tamil Nadu',
      streak: 10,
      dailyTimeAvailable: '45 mins',
      skills: {
        'html': { skillId: 'html', name: 'HTML5 Semantic Layouts', category: 'web', level: 3, state: 'strong', score: 80, evidenceCount: 1, acceptedEvidenceIds: [] }
      }
    };

    const initialResult = computeReadiness(baseLearner, mockTargetRole);

    // Add Project Evidence
    const projectEvidence: Evidence = {
      id: 'ev-new-proj',
      skillIds: ['html', 'css'],
      type: 'project',
      artifactRef: 'https://github.com/learner/accessible-card',
      rubricResult: { score: 90 },
      createdAt: '2026-10-24',
      verification: 'mentor-verified'
    };
    const step1Learner: Learner = {
      ...baseLearner,
      evidence: [...baseLearner.evidence, projectEvidence]
    };
    const step1Result = computeReadiness(step1Learner, mockTargetRole);
    expect(step1Result.total).toBeGreaterThanOrEqual(initialResult.total);

    // Add Voice Viva Evidence
    const vivaEvidence: Evidence = {
      id: 'ev-new-viva',
      skillIds: ['html'],
      type: 'voice',
      artifactRef: 'audio/defense.wav',
      rubricResult: { score: 92 },
      createdAt: '2026-10-25',
      verification: 'ai-reviewed'
    };
    const step2Learner: Learner = {
      ...step1Learner,
      evidence: [...step1Learner.evidence, vivaEvidence]
    };
    const step2Result = computeReadiness(step2Learner, mockTargetRole);
    expect(step2Result.total).toBeGreaterThanOrEqual(step1Result.total);

    // Add Technical Assessment
    const step3Learner: Learner = {
      ...step2Learner,
      assessments: [
        { id: 'ass-1', title: 'CSS Fluid Clamp Quiz', score: 95, passed: true, completedAt: '2026-10-26', type: 'technical' }
      ]
    };
    const step3Result = computeReadiness(step3Learner, mockTargetRole);
    expect(step3Result.total).toBeGreaterThanOrEqual(step2Result.total);
  });

  // 7. Priya Baseline Calibration
  it('7. evaluates Priya Soundararajan calibrated baseline to exactly 78% readiness', () => {
    const priyaLearner: Learner = {
      ...createEmptyLearner(),
      id: 'priya-student',
      name: 'Priya Soundararajan',
      education: 'BCA Final Year (3rd Year), Jamal Mohamed College, Trichy',
      location: 'Tiruchirappalli (Trichy), Tamil Nadu',
      streak: 18,
      streakDays: 18,
      dailyTimeAvailable: '60 mins / day',
      preferredWork: 'Hybrid / Remote / Chennai tech corridor',
      skills: {
        'html': { skillId: 'html', name: 'HTML5 Semantic Layouts', category: 'web', level: 4, state: 'strong', score: 85, evidenceCount: 2, acceptedEvidenceIds: ['ev-p1'] },
        'css': { skillId: 'css', name: 'CSS Grid & Flexbox Fluid Design', category: 'web', level: 4, state: 'strong', score: 90, evidenceCount: 2, acceptedEvidenceIds: ['ev-p1'] },
        'wcag': { skillId: 'wcag', name: 'WCAG 2.1 AA Keyboard Accessibility', category: 'web', level: 3, state: 'strong', score: 88, evidenceCount: 1, acceptedEvidenceIds: ['ev-p1'] },
        'js': { skillId: 'js', name: 'JavaScript ES6 & DOM Delegation', category: 'web', level: 3, state: 'strong', score: 82, evidenceCount: 1, acceptedEvidenceIds: ['ev-p2'] },
        'git': { skillId: 'git', name: 'Git Version Control & PR Workflow', category: 'tools', level: 2, state: 'strong', score: 80, evidenceCount: 1, acceptedEvidenceIds: ['ev-p3'] }
        // Note: 'REST API & State Caching' is the known 1 gap skill!
      },
      evidence: [
        {
          id: 'ev-p1',
          skillIds: ['html', 'css', 'wcag'],
          type: 'project',
          artifactRef: 'https://github.com/priya/accessible-profile',
          rubricResult: { score: 92 },
          createdAt: '2026-10-24',
          verification: 'mentor-verified'
        },
        {
          id: 'ev-p2',
          skillIds: ['js'],
          type: 'voice',
          artifactRef: 'audio/dom-delegation.wav',
          rubricResult: { score: 92 },
          createdAt: '2026-10-25',
          verification: 'ai-reviewed'
        }
      ],
      assessments: [
        { id: 'ass-p1', title: 'Semantic HTML & Layouts', score: 95, passed: true, completedAt: '2026-10-21', type: 'technical' },
        { id: 'ass-p2', title: 'CSS Grid Fluid Design', score: 92, passed: true, completedAt: '2026-10-22', type: 'technical' },
        { id: 'ass-p3', title: 'JavaScript Fundamentals', score: 88, passed: true, completedAt: '2026-10-23', type: 'technical' }
      ]
    };

    const result = computeReadiness(priyaLearner, mockTargetRole);

    expect(result.total).toBe(78);
    // S: 4 musts + 1 nice = 9/10 = 90% -> 0.30 * 90 = 27.0 pts
    // P: 1 project @ 92% / 2 = 46% -> 0.25 * 46 = 11.5 pts
    // A: avg(95, 92, 88) = 91.67% -> 0.20 * 91.67 = 18.33 pts
    // C: 1 viva @ 92% / 1 = 92% -> 0.15 * 92 = 13.8 pts
    // Q: 3 of 4 eligibility criteria met = 75% -> 0.10 * 75 = 7.5 pts
    // Total = 27.0 + 11.5 + 18.33 + 13.8 + 7.5 = 78.13 => 78%
    expect(result.total).toBe(78);
    expect(result.evidenceCoverage).toBe(1.0);
    expect(result.missing.some(m => m.includes('REST API'))).toBe(true);
    expect(result.missing.some(m => m.includes('Second portfolio project'))).toBe(true);
  });

  // 8. What-If Simulation on Hypothetical Learner Copy
  it('8. executes What-If simulation on a hypothetical learner copy without mutating original', () => {
    const priyaLearner: Learner = {
      ...createEmptyLearner(),
      id: 'priya-student',
      name: 'Priya Soundararajan',
      education: 'BCA Final Year (3rd Year), Jamal Mohamed College, Trichy',
      location: 'Tiruchirappalli (Trichy), Tamil Nadu',
      streak: 18,
      streakDays: 18,
      dailyTimeAvailable: '60 mins / day',
      skills: {
        'html': { skillId: 'html', name: 'HTML5 Semantic Layouts', category: 'web', level: 4, state: 'strong', score: 85, evidenceCount: 2, acceptedEvidenceIds: [] },
        'css': { skillId: 'css', name: 'CSS Grid & Flexbox Fluid Design', category: 'web', level: 4, state: 'strong', score: 90, evidenceCount: 2, acceptedEvidenceIds: [] },
        'wcag': { skillId: 'wcag', name: 'WCAG 2.1 AA Keyboard Accessibility', category: 'web', level: 3, state: 'strong', score: 88, evidenceCount: 1, acceptedEvidenceIds: [] },
        'js': { skillId: 'js', name: 'JavaScript ES6 & DOM Delegation', category: 'web', level: 3, state: 'strong', score: 82, evidenceCount: 1, acceptedEvidenceIds: [] },
        'git': { skillId: 'git', name: 'Git Version Control & PR Workflow', category: 'tools', level: 2, state: 'strong', score: 80, evidenceCount: 1, acceptedEvidenceIds: [] }
      },
      evidence: [
        {
          id: 'ev-p1',
          skillIds: ['html', 'css', 'wcag'],
          type: 'project',
          artifactRef: 'https://github.com/priya/accessible-profile',
          rubricResult: { score: 92 },
          createdAt: '2026-10-24',
          verification: 'mentor-verified'
        },
        {
          id: 'ev-p2',
          skillIds: ['js'],
          type: 'voice',
          artifactRef: 'audio/dom-delegation.wav',
          rubricResult: { score: 92 },
          createdAt: '2026-10-25',
          verification: 'ai-reviewed'
        }
      ],
      assessments: [
        { id: 'ass-p1', title: 'HTML', score: 95, passed: true, completedAt: '2026-10-21', type: 'technical' },
        { id: 'ass-p2', title: 'CSS', score: 92, passed: true, completedAt: '2026-10-22', type: 'technical' },
        { id: 'ass-p3', title: 'JS', score: 88, passed: true, completedAt: '2026-10-23', type: 'technical' }
      ]
    };

    const initialEvidenceCount = priyaLearner.evidence.length;

    // Simulate completing the 2nd project (REST API Caching with score 94%)
    const simResult = simulateReadiness(priyaLearner, mockTargetRole, clone => {
      clone.evidence.push({
        id: 'ev-sim-rest-api',
        skillIds: ['api'],
        type: 'project',
        artifactRef: 'https://github.com/priya/simulated-rest-api',
        rubricResult: { score: 94 },
        createdAt: '2026-10-26',
        verification: 'ai-reviewed'
      });
      clone.skills['api'] = {
        skillId: 'api',
        name: 'REST API & State Caching',
        category: 'web',
        level: 3,
        state: 'strong',
        score: 94,
        evidenceCount: 1,
        acceptedEvidenceIds: ['ev-sim-rest-api']
      };
    });

    // Check that original learner was NOT mutated
    expect(priyaLearner.evidence.length).toBe(initialEvidenceCount);
    expect(priyaLearner.skills['api']).toBeUndefined();

    // Check base vs simulated
    expect(simResult.base.total).toBe(78);
    expect(simResult.simulated.total).toBeGreaterThan(simResult.base.total);
    expect(simResult.delta).toBeGreaterThan(10); // Big jump from second project + bridging last gap!
    expect(simResult.simulated.total).toBeGreaterThanOrEqual(92);
  });
});
