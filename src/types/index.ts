export type SkillState = 'strong' | 'develop' | 'not_assessed' | 'gap';
export type VerificationStatus = 'ai_reviewed' | 'mentor_verified' | 'pending_mentor';
export type PathwayCategory = 'academic' | 'vocational';
export type Language = 'en' | 'ta' | 'fr' | 'hi';

export interface SkillItem {
  id: string;
  name: string;
  nameTamil?: string;
  category: string;
  level: number; // 1 to 5
  state: SkillState;
  score?: number; // 0 to 100
  evidenceCount: number;
  lastAssessed?: string;
  description: string;
  rubricCriteria: string[];
}

export interface Pathway {
  id: string;
  title: string;
  titleTamil: string;
  category: PathwayCategory;
  tagline: string;
  description: string;
  totalModules: number;
  estimatedWeeks: number;
  skills: SkillItem[];
  color: string;
  iconName: string;
  isStub?: boolean;
  targetRoles: string[];
}

export interface Challenge {
  id: string;
  title: string;
  titleTamil: string;
  pathwayId: string;
  skillId: string;
  skillName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  type: 'code' | 'photo_upload' | 'viva' | 'quiz';
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

export interface Badge {
  id: string;
  title: string;
  titleTamil: string;
  category: 'proof' | 'streak' | 'mentor' | 'craft' | 'mastery';
  description: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  icon: string;
  evidenceNotes: string;
  level: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export type ApplicationTrackerStage = 'saved' | 'preparing' | 'ready' | 'applied';

export interface Opportunity {
  id: string;
  title: string;
  titleTamil: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Apprenticeship' | 'Contract' | 'Rural Hub';
  category: 'technical' | 'vocational';
  isSample: true; // Strictly sample opportunity
  stipendOrSalary: string;
  matchScore: number; // 0 to 100
  pathwayId: string;
  eligibility: string;
  eligibilityTamil?: string;
  nextAction: string;
  nextActionTamil?: string;
  requiredSkills: {
    skillName: string;
    skillNameTamil?: string;
    requiredLevel: number;
    userLevel?: number;
    met: boolean;
  }[];
  description: string;
  descriptionTamil?: string;
  postedDate: string;
  aiExplanation?: {
    strengths: string;
    strengthsTamil?: string;
    gaps: string;
    gapsTamil?: string;
    roadmapAction: string;
    roadmapActionTamil?: string;
    recommendedChallengeId?: string;
  };
}

export interface Persona {
  id: string;
  name: string;
  nameTamil: string;
  tag: string;
  avatar: string;
  location: string;
  pathwayId: string;
  bio: string;
  educationOrBackground: string;
  dailyTimeAvailable: string; // e.g. "45 mins/day"
  preferredWork: string; // e.g. "Remote / Local District"
  streakDays: number;
  xpPoints: number;
  readinessScore: number;
  skillsAssessed: number;
  skillsGap: number;
  activeBadges: string[];
  recentActivity: {
    date: string;
    action: string;
    type: 'proof' | 'challenge' | 'roadmap';
  }[];
}

export interface StreakDay {
  date: string;
  active: boolean;
  minutesSpent: number;
  tasksCompleted: number;
}

export interface CohortMetric {
  district: string;
  totalLearners: number;
  vocationalRatio: number; // percentage
  skillsVerified: number;
  placedOrMatched: number;
  topSkills: string[];
}

export interface VivaProofRecord {
  challengeId: string;
  challengeTitle: string;
  pathwayId: string;
  vivaStatus: 'Viva completed';
  authenticityConfidence: 'Consistent' | 'Needs follow-up';
  averageScore: number;
  completedAt: string;
  qa: {
    question: string;
    questionTamil?: string;
    answer: string;
    score: number;
    note: string;
  }[];
}

