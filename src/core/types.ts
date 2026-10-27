/**
 * Core Domain Types for SkillBridge AI
 * Single source of truth for Learner, Domain, Skills, Evidence, and Deterministic Readiness
 */

export type VerificationType = 'self-reported' | 'ai-reviewed' | 'mentor-verified';
export type EvidenceType = 'project' | 'assessment' | 'photo' | 'written' | 'voice';
export type SkillImportance = 'must' | 'nice';
export type ComponentKey = 'skills' | 'projects' | 'assessments' | 'communication' | 'requirements';
export type ReadinessStatus = 'not_yet_assessed' | 'needs_work' | 'moderate' | 'strong';

export interface RubricCriterionResult {
  criterion: string;
  passed: boolean;
  score?: number;
  feedback?: string;
}

export interface RubricResult {
  score: number; // 0 to 100
  maxScore?: number;
  feedback?: string;
  criteria?: RubricCriterionResult[];
}

export interface Evidence {
  id: string;
  skillIds: string[];
  type: EvidenceType;
  artifactRef: string;
  rubricResult: RubricResult;
  createdAt: string;
  verification: VerificationType;
  verifiedBy?: string;
}

export interface Skill {
  id: string;
  name: string;
  nameTamil?: string;
  category: string;
  level: number; // 1 to 5
  description: string;
  importance?: SkillImportance;
  weight?: number; // must = 2, nice = 1
}

export interface LearnerSkill {
  skillId: string;
  name: string;
  nameTamil?: string;
  category: string;
  level: number;
  state: 'strong' | 'develop' | 'not_assessed' | 'gap';
  score?: number;
  evidenceCount: number;
  lastAssessed?: string;
  acceptedEvidenceIds: string[];
}

export interface Challenge {
  id: string;
  title: string;
  titleTamil?: string;
  domainId?: string;
  pathwayId?: string;
  skillId: string;
  skillName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  type: 'code' | 'photo_upload' | 'viva' | 'quiz' | 'project';
  description: string;
  instructions: string[];
  rubric: {
    criterion: string;
    weight: number;
    description: string;
  }[];
  points: number;
  completed?: boolean;
  score?: number;
}

export interface Submission {
  id: string;
  challengeId: string;
  learnerId: string;
  type: EvidenceType;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'accepted';
  score: number; // 0 to 100
  evidenceId?: string;
  feedback?: string;
}

export interface Assessment {
  id: string;
  title: string;
  titleTamil?: string;
  skillId?: string;
  type: 'technical' | 'communication' | 'workplace';
  score: number; // 0 to 100
  maxScore?: number;
  passed: boolean;
  completedAt: string;
  evidenceId?: string;
}

export interface RequiredSkillRequirement {
  id?: string;
  skillName: string;
  skillNameTamil?: string;
  requiredLevel: number;
  importance?: SkillImportance; // must = 2, nice = 1
  userLevel?: number;
  met?: boolean;
}

export interface EligibilityItem {
  id: string;
  requirement: string;
  requirementTamil?: string;
  satisfied?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  titleTamil?: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Apprenticeship' | 'Contract' | 'Rural Hub';
  category: 'technical' | 'vocational';
  stipendOrSalary: string;
  matchScore?: number;
  pathwayId?: string;
  domainId?: string;
  requiredSkills: RequiredSkillRequirement[];
  requiredProjectsCount?: number;
  requiredAssessmentsCount?: number;
  requiredCommunicationCount?: number;
  eligibilityItems?: EligibilityItem[];
  description: string;
  descriptionTamil?: string;
  postedDate?: string;
  nextAction?: string;
  nextActionTamil?: string;
  isSample?: boolean;
}

export interface Domain {
  id: string;
  title: string;
  titleTamil?: string;
  category?: 'academic' | 'vocational';
  description: string;
  skills: Skill[];
  targetRoles: Opportunity[];
}

export interface ActivityLog {
  id: string;
  learnerId: string;
  timestamp: string;
  action: string;
  type: 'challenge' | 'proof' | 'roadmap' | 'assessment' | 'streak';
  details?: string;
  xpEarned?: number;
}

export interface ReadinessComponentResult {
  key: ComponentKey;
  symbol: 'S' | 'P' | 'A' | 'C' | 'Q';
  name: string;
  nameTamil?: string;
  weight: number; // 0.30, 0.25, 0.20, 0.15, 0.10
  score: number; // 0 to 100
  points: number; // weight * score
  status: ReadinessStatus;
  explanation: string;
  explanationTamil?: string;
  hasEvidence: boolean;
  evaluatedCount?: number;
  requiredCount?: number;
}

export interface ReadinessResult {
  total: number; // 0 to 100
  components: ReadinessComponentResult[];
  missing: string[];
  nextBestActions: string[];
  evidenceCoverage: number; // fraction 0 to 1 (components with >= 1 piece of evidence / 5)
  formulaSummary?: {
    formula: string;
    substitution: string;
    result: string;
  };
}

export interface GapAnalysis {
  targetRoleId: string;
  targetRoleTitle: string;
  missingSkills: string[];
  demonstratedSkills: string[];
  recommendedChallengeIds: string[];
  estimatedHoursToReady: number;
  generatedAt: string;
}

export interface Learner {
  id: string;
  name: string;
  nameTamil?: string;
  tag: string;
  avatar: string;
  location: string;
  education: string;
  bio: string;
  targetDomainId: string;
  targetRoleId: string;
  streak: number; // canonical streak
  streakDays: number; // compatibility alias
  xp: number; // canonical xp
  xpPoints: number; // compatibility alias
  dailyTimeAvailable: string;
  preferredWork: string;
  activeBadges: string[];
  skills: Record<string, LearnerSkill>;
  evidence: Evidence[];
  submissions: Submission[];
  assessments: Assessment[];
  completedTaskIds: string[];
  activityLogs: ActivityLog[];
  eligibilityOverrides?: Record<string, boolean>;
}
