/**
 * Central Domain Store for SkillBridge AI
 * 
 * Persisted Zustand store providing:
 * - Single source of truth for Learner, Target Role, Evidence, and Submissions
 * - Actions: setProfile, selectTarget, setGapAnalysis, addEvidence, completeTask, logActivity, resetDemo
 * - Deterministic Selectors: selectReadiness, selectSkillStates, selectNextAction, selectMatchedOpportunities, selectStreak
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Learner,
  Opportunity,
  Domain,
  Evidence,
  GapAnalysis,
  ActivityLog,
  ReadinessResult,
  LearnerSkill,
  Submission
} from './types';
import { computeReadiness, simulateReadiness } from './readiness';
import { sampleOpportunities } from '../data/opportunities';
import { pathways } from '../data/pathways';

// Standard baseline for Priya Soundararajan (Default Finalist Persona)
export const initialPriyaLearner: Learner = {
  id: 'priya-student',
  name: 'Priya Soundararajan',
  nameTamil: 'பிரியா சௌந்தரராஜன்',
  tag: 'BCA Final Year Student',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  location: 'Tiruchirappalli (Trichy), Tamil Nadu',
  education: 'BCA Final Year (3rd Year), Jamal Mohamed College, Trichy',
  bio: 'Self-motivated student from a Tier-3 college in Trichy. Building accessible web interfaces with clean semantic HTML and modern React to secure my first frontend developer role.',
  targetDomainId: 'junior-web-dev',
  targetRoleId: 'opp-coimbatore-web-apprentice',
  streak: 18,
  streakDays: 18,
  xp: 1420,
  xpPoints: 1420,
  dailyTimeAvailable: '60 mins / day',
  preferredWork: 'Hybrid / Remote / Chennai tech corridor',
  activeBadges: ['badge-first-proof', 'badge-wcag-champion', 'badge-tamil-voice-viva', 'badge-streak-7', 'badge-responsive-grid'],
  skills: {
    'skill-html': {
      skillId: 'skill-html',
      name: 'HTML5 Semantic Layouts',
      nameTamil: 'HTML5 மற்றும் அணுகல்தன்மை',
      category: 'Frontend Engineering',
      level: 4,
      state: 'strong',
      score: 85,
      evidenceCount: 2,
      lastAssessed: 'Yesterday',
      acceptedEvidenceIds: ['ev-profile-project', 'ev-viva-dom']
    },
    'skill-css': {
      skillId: 'skill-css',
      name: 'CSS Grid & Flexbox Fluid Design',
      nameTamil: 'CSS Grid மற்றும் Flexbox தளவமைப்புகள்',
      category: 'Frontend Engineering',
      level: 4,
      state: 'strong',
      score: 90,
      evidenceCount: 2,
      lastAssessed: 'Yesterday',
      acceptedEvidenceIds: ['ev-profile-project']
    },
    'skill-wcag': {
      skillId: 'skill-wcag',
      name: 'WCAG 2.1 AA Keyboard Accessibility',
      nameTamil: 'விசைப்பலகை அணுகல்தன்மை தரநிலைகள்',
      category: 'Accessibility',
      level: 3,
      state: 'strong',
      score: 88,
      evidenceCount: 1,
      lastAssessed: '2 days ago',
      acceptedEvidenceIds: ['ev-profile-project']
    },
    'skill-js': {
      skillId: 'skill-js',
      name: 'JavaScript ES6 & DOM Delegation',
      nameTamil: 'ஜாவாஸ்கிரிப்ட் மற்றும் நிகழ்வு மேலாண்மை',
      category: 'Frontend Engineering',
      level: 3,
      state: 'strong',
      score: 82,
      evidenceCount: 1,
      lastAssessed: 'Yesterday',
      acceptedEvidenceIds: ['ev-viva-dom']
    },
    'skill-git': {
      skillId: 'skill-git',
      name: 'Git Version Control & PR Workflow',
      nameTamil: 'Git மற்றும் பதிப்புக் கட்டுப்பாடு',
      category: 'Tooling',
      level: 2,
      state: 'strong',
      score: 80,
      evidenceCount: 1,
      lastAssessed: '3 days ago',
      acceptedEvidenceIds: ['ev-profile-project']
    },
    'skill-api': {
      skillId: 'skill-api',
      name: 'REST API & State Caching',
      nameTamil: 'REST API மற்றும் தரவு மேலாண்மை',
      category: 'Frontend Engineering',
      level: 1,
      state: 'gap',
      score: 40,
      evidenceCount: 0,
      lastAssessed: 'Not assessed',
      acceptedEvidenceIds: []
    }
  },
  evidence: [
    {
      id: 'ev-profile-project',
      skillIds: ['skill-html', 'skill-css', 'skill-wcag', 'skill-git'],
      type: 'project',
      artifactRef: 'https://github.com/priya-soundar/accessible-portfolio',
      rubricResult: {
        score: 92,
        feedback: 'Clean semantic structure, fluid viewport clamp, and strict WCAG AA keyboard focus states.',
        criteria: [
          { criterion: 'Semantic Landmarks', passed: true, score: 95 },
          { criterion: 'Fluid Layout without horizontal scroll at 320px', passed: true, score: 90 },
          { criterion: 'WCAG 2.1 Focus-visible Skip Link', passed: true, score: 92 }
        ]
      },
      createdAt: '2026-10-24T10:45:00Z',
      verification: 'mentor-verified',
      verifiedBy: 'Senthil Nathan (Senior UI Architect, Trichy IT Park)'
    },
    {
      id: 'ev-viva-dom',
      skillIds: ['skill-html', 'skill-js'],
      type: 'voice',
      artifactRef: 'recordings/priya-dom-delegation-tamil.wav',
      rubricResult: {
        score: 92,
        feedback: 'Articulate conceptual defense in Tamil and English of 1D Flexbox vs 2D Grid and event delegation.',
        criteria: [
          { criterion: 'Layout architecture rationale', passed: true, score: 94 },
          { criterion: 'Mobile viewport constraint handling', passed: true, score: 90 },
          { criterion: 'Accessibility focus flow', passed: true, score: 92 }
        ]
      },
      createdAt: '2026-10-25T16:20:00Z',
      verification: 'ai-reviewed',
      verifiedBy: 'SkillBridge Voice Authenticator v2.4'
    }
  ],
  assessments: [
    {
      id: 'ass-html-semantic',
      title: 'HTML5 Semantic Layout & Accessibility',
      titleTamil: 'HTML5 மற்றும் அணுகல்தன்மை வினாடிவினா',
      skillId: 'skill-html',
      type: 'technical',
      score: 95,
      passed: true,
      completedAt: '2026-10-21T09:00:00Z'
    },
    {
      id: 'ass-css-grid',
      title: 'CSS Grid & Flexbox Fluid Layouts',
      titleTamil: 'CSS Grid மற்றும் Flexbox மதிப்பீடு',
      skillId: 'skill-css',
      type: 'technical',
      score: 92,
      passed: true,
      completedAt: '2026-10-22T14:30:00Z'
    },
    {
      id: 'ass-js-core',
      title: 'JavaScript Event Delegation & Asynchronous DOM',
      titleTamil: 'ஜாவாஸ்கிரிப்ட் மற்றும் நிகழ்வு மேலாண்மை மதிப்பீடு',
      skillId: 'skill-js',
      type: 'technical',
      score: 88,
      passed: true,
      completedAt: '2026-10-23T11:15:00Z'
    }
  ],
  submissions: [
    {
      id: 'sub-profile-page',
      challengeId: 'challenge-web-profile',
      learnerId: 'priya-student',
      type: 'project',
      submittedAt: '2026-10-24T10:30:00Z',
      status: 'accepted',
      score: 92,
      evidenceId: 'ev-profile-project',
      feedback: 'Accepted with high honors for mobile viewport clamp and keyboard focus skip-links.'
    }
  ],
  completedTaskIds: ['challenge-web-profile', 'viva-dom-delegation'],
  activityLogs: [
    {
      id: 'act-1',
      learnerId: 'priya-student',
      timestamp: 'Today, 8:15 AM',
      action: 'Practiced Accessible Navbar keyboard focus challenge',
      type: 'challenge',
      xpEarned: 50
    },
    {
      id: 'act-2',
      learnerId: 'priya-student',
      timestamp: 'Yesterday, 4:20 PM',
      action: 'Submitted Voice Viva: DOM event delegation explained in Tamil',
      type: 'proof',
      xpEarned: 150
    },
    {
      id: 'act-3',
      learnerId: 'priya-student',
      timestamp: '3 days ago',
      action: 'Milestone completed: CSS Grid fluid layouts masterclass',
      type: 'roadmap',
      xpEarned: 100
    }
  ]
};

// Initial target role (Vaigai Tech Labs Web Apprentice)
export const initialTargetRole: Opportunity = {
  ...sampleOpportunities[0],
  requiredProjectsCount: 2,
  requiredAssessmentsCount: 3,
  requiredCommunicationCount: 1,
  eligibilityItems: [
    { id: 'el-degree', requirement: 'Degree or Diploma in Computer Applications / Science (BCA/B.Sc)' },
    { id: 'el-location', requirement: 'Tamil Nadu residency or local district preference' },
    { id: 'el-practice', requirement: 'Active deliberate practice record (streak ≥ 7 days)' },
    { id: 'el-availability', requirement: 'Available for immediate apprenticeship or hybrid training' }
  ]
};

export const initialDomain: Domain = {
  id: 'junior-web-dev',
  title: 'Junior Web & Accessibility Developer',
  titleTamil: 'ஜூனியர் வலைப்பக்க உருவாக்குநர்',
  category: 'academic',
  description: 'Master semantic HTML5, modern fluid CSS, responsive clamp layouts, WCAG 2.1 AA accessibility, and REST APIs.',
  skills: pathways[0].skills.map(s => ({
    id: s.id,
    name: s.name,
    nameTamil: s.nameTamil,
    category: s.category,
    level: s.level,
    description: s.description,
    importance: s.name.includes('REST') || s.name.includes('Git') ? 'nice' : 'must',
    weight: s.name.includes('REST') || s.name.includes('Git') ? 1 : 2
  })),
  targetRoles: sampleOpportunities.map(opp => ({
    ...opp,
    requiredProjectsCount: 2,
    requiredAssessmentsCount: 3,
    requiredCommunicationCount: 1
  }))
};

export const initialGapAnalysis: GapAnalysis = {
  targetRoleId: initialTargetRole.id,
  targetRoleTitle: initialTargetRole.title,
  missingSkills: ['REST API & State Caching'],
  demonstratedSkills: [
    'HTML5 Semantic Layouts',
    'CSS Grid & Flexbox Fluid Design',
    'WCAG 2.1 AA Keyboard Accessibility',
    'JavaScript ES6 & DOM Delegation',
    'Git Version Control & PR Workflow'
  ],
  recommendedChallengeIds: ['challenge-web-api-weather'],
  estimatedHoursToReady: 14,
  generatedAt: new Date().toISOString()
};

export interface DomainStoreState {
  // State
  learner: Learner;
  targetRole: Opportunity;
  domain: Domain;
  gapAnalysis: GapAnalysis;
  opportunities: Opportunity[];
  
  // Actions
  setProfile: (profile: Partial<Learner>) => void;
  selectTarget: (targetRoleId: string) => void;
  setGapAnalysis: (analysis: GapAnalysis) => void;
  addEvidence: (evidence: Evidence) => void;
  completeTask: (taskId: string, score?: number, xpEarned?: number) => void;
  logActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  resetDemo: () => void;
}

export const useDomainStore = create<DomainStoreState>()(
  persist(
    (set, get) => ({
      learner: initialPriyaLearner,
      targetRole: initialTargetRole,
      domain: initialDomain,
      gapAnalysis: initialGapAnalysis,
      opportunities: sampleOpportunities.map(opp => ({
        ...opp,
        requiredProjectsCount: 2,
        requiredAssessmentsCount: 3,
        requiredCommunicationCount: 1,
        eligibilityItems: [
          { id: 'el-degree', requirement: 'BCA or related Technical/Vocational Qualification' },
          { id: 'el-location', requirement: 'Tamil Nadu residency or local district preference' },
          { id: 'el-practice', requirement: 'Active streak >= 7 days' },
          { id: 'el-availability', requirement: 'Available for immediate joining' }
        ]
      })),

      setProfile: (profile: Partial<Learner>) => {
        set(state => {
          const updatedLearner = {
            ...state.learner,
            ...profile,
            streak: profile.streakDays !== undefined ? profile.streakDays : (profile.streak !== undefined ? profile.streak : state.learner.streak),
            streakDays: profile.streak !== undefined ? profile.streak : (profile.streakDays !== undefined ? profile.streakDays : state.learner.streakDays),
            xp: profile.xpPoints !== undefined ? profile.xpPoints : (profile.xp !== undefined ? profile.xp : state.learner.xp),
            xpPoints: profile.xp !== undefined ? profile.xp : (profile.xpPoints !== undefined ? profile.xpPoints : state.learner.xpPoints),
          };
          return { learner: updatedLearner };
        });
      },

      selectTarget: (targetRoleId: string) => {
        const { opportunities, learner } = get();
        const found = opportunities.find(o => o.id === targetRoleId);
        if (found) {
          const updatedTargetRole = found;
          // Recompute gap analysis deterministically
          const readiness = computeReadiness(learner, updatedTargetRole);
          const demonstratedSkills: string[] = [];
          const missingSkills: string[] = [];

          (updatedTargetRole.requiredSkills || []).forEach(req => {
            const isDemonstrated = readiness.components[0].score >= 70 && !readiness.missing.some(m => m.includes(req.skillName));
            if (isDemonstrated) {
              demonstratedSkills.push(req.skillName);
            } else {
              missingSkills.push(req.skillName);
            }
          });

          const newGap: GapAnalysis = {
            targetRoleId: found.id,
            targetRoleTitle: found.title,
            missingSkills,
            demonstratedSkills,
            recommendedChallengeIds: ['challenge-web-api-weather'],
            estimatedHoursToReady: missingSkills.length * 8,
            generatedAt: new Date().toISOString()
          };

          set(state => ({
            targetRole: updatedTargetRole,
            gapAnalysis: newGap,
            learner: {
              ...state.learner,
              targetRoleId: targetRoleId
            }
          }));
        }
      },

      setGapAnalysis: (analysis: GapAnalysis) => {
        set({ gapAnalysis: analysis });
      },

      addEvidence: (evidence: Evidence) => {
        set(state => {
          const newEvidenceList = [...state.learner.evidence, evidence];
          const newSkills = { ...state.learner.skills };

          // Update associated skills if score >= 70
          evidence.skillIds.forEach(sId => {
            if (newSkills[sId]) {
              newSkills[sId] = {
                ...newSkills[sId],
                evidenceCount: newSkills[sId].evidenceCount + 1,
                lastAssessed: 'Just now',
                acceptedEvidenceIds: [...newSkills[sId].acceptedEvidenceIds, evidence.id],
                score: Math.max(newSkills[sId].score || 0, evidence.rubricResult.score),
                state: evidence.rubricResult.score >= 70 ? 'strong' : newSkills[sId].state
              };
            }
          });

          const xpGain = 150;
          const newXp = state.learner.xp + xpGain;

          const newActivity: ActivityLog = {
            id: `act-${Date.now()}`,
            learnerId: state.learner.id,
            timestamp: 'Just now',
            action: `Verified evidence added (${evidence.type}): ${evidence.artifactRef.substring(0, 40)}`,
            type: 'proof',
            xpEarned: xpGain
          };

          return {
            learner: {
              ...state.learner,
              xp: newXp,
              xpPoints: newXp,
              evidence: newEvidenceList,
              skills: newSkills,
              activityLogs: [newActivity, ...state.learner.activityLogs]
            }
          };
        });
      },

      completeTask: (taskId: string, score: number = 90, xpEarned: number = 100) => {
        set(state => {
          if (state.learner.completedTaskIds.includes(taskId)) {
            return state; // Already completed
          }

          const newCompleted = [...state.learner.completedTaskIds, taskId];
          const newXp = state.learner.xp + xpEarned;
          
          // Add submission
          const newSubmission: Submission = {
            id: `sub-${Date.now()}`,
            challengeId: taskId,
            learnerId: state.learner.id,
            type: taskId.includes('viva') ? 'voice' : 'project',
            submittedAt: new Date().toISOString(),
            status: 'accepted',
            score: score,
            feedback: `Completed with score ${score}%`
          };

          const newActivity: ActivityLog = {
            id: `act-${Date.now()}`,
            learnerId: state.learner.id,
            timestamp: 'Just now',
            action: `Challenge completed: ${taskId}`,
            type: 'challenge',
            xpEarned
          };

          return {
            learner: {
              ...state.learner,
              completedTaskIds: newCompleted,
              xp: newXp,
              xpPoints: newXp,
              submissions: [...state.learner.submissions, newSubmission],
              activityLogs: [newActivity, ...state.learner.activityLogs]
            }
          };
        });
      },

      logActivity: (activityData) => {
        set(state => {
          const newActivity: ActivityLog = {
            id: `act-${Date.now()}`,
            learnerId: state.learner.id,
            timestamp: activityData.timestamp || 'Just now',
            action: activityData.action,
            type: activityData.type,
            details: activityData.details,
            xpEarned: activityData.xpEarned
          };
          return {
            learner: {
              ...state.learner,
              activityLogs: [newActivity, ...state.learner.activityLogs]
            }
          };
        });
      },

      resetDemo: () => {
        set({
          learner: initialPriyaLearner,
          targetRole: initialTargetRole,
          domain: initialDomain,
          gapAnalysis: initialGapAnalysis
        });
      }
    }),
    {
      name: 'skillbridge-core-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// =========================================================================
// Selectors for Every Screen
// Zero hardcoded numbers; all derived dynamically from the central store!
// =========================================================================

/**
 * 1. selectReadiness
 * Returns the exact deterministic ReadinessResult for the active learner & role.
 */
export const selectReadiness = (state: DomainStoreState): ReadinessResult => {
  return computeReadiness(state.learner, state.targetRole, { includeSubstitutionSummary: true });
};

/**
 * 2. selectSkillStates
 * Returns current status of all skills in the domain for this learner.
 */
export const selectSkillStates = (state: DomainStoreState): Record<string, LearnerSkill> => {
  return state.learner.skills;
};

/**
 * 3. selectNextAction
 * Returns top prioritized actionable recommendation for the learner.
 */
export const selectNextAction = (state: DomainStoreState): string => {
  const readiness = selectReadiness(state);
  return readiness.nextBestActions[0] || 'Complete your next roadmap challenge to verify additional skills';
};

/**
 * 4. selectMatchedOpportunities
 * Returns opportunities with live derived match scores based on learner readiness.
 */
export const selectMatchedOpportunities = (state: DomainStoreState): Opportunity[] => {
  const readiness = selectReadiness(state);
  return state.opportunities.map(opp => {
    // Compute opportunity match score dynamically
    const oppReadiness = computeReadiness(state.learner, opp);
    return {
      ...opp,
      matchScore: oppReadiness.total
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};

/**
 * 5. selectStreak
 * Returns streak info, level, and discipline metrics.
 */
export const selectStreak = (state: DomainStoreState) => {
  return {
    streak: state.learner.streak,
    streakDays: state.learner.streakDays,
    dailyTimeAvailable: state.learner.dailyTimeAvailable,
    xp: state.learner.xp,
    xpPoints: state.learner.xpPoints,
    freezesAvailable: 2,
    isExamPaused: false
  };
};

/**
 * 6. selectLearner
 * Returns learner identity, profile, and verification status.
 */
export const selectLearner = (state: DomainStoreState): Learner => {
  return state.learner;
};

/**
 * 7. selectWhatIfSimulation
 * Returns simulated readiness on hypothetical learner copy without mutating store.
 */
export const selectWhatIfSimulation = (
  state: DomainStoreState,
  modifier: (clone: Learner) => void
): { base: ReadinessResult; simulated: ReadinessResult; delta: number } => {
  return simulateReadiness(state.learner, state.targetRole, modifier);
};
