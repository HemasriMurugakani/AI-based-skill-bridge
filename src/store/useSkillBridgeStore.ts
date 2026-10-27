import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { pathways as initialPathways } from '../data/pathways';
import { challenges as initialChallenges } from '../data/challenges';
import { badges as initialBadges } from '../data/badges';
import { sampleOpportunities as initialOpportunities } from '../data/opportunities';
import { personas as initialPersonas } from '../data/personas';
import { streakHistory as initialStreakHistory } from '../data/streakHistory';
import { Pathway, Challenge, Badge, Opportunity, Persona, StreakDay, SkillState, Language, VivaProofRecord, ApplicationTrackerStage } from '../types';
import { getDeterministicReadinessScore } from '../utils/readinessCalculator';
import i18n from '../i18n';

export const initialTrackerStages: Record<string, ApplicationTrackerStage> = {
  'opp-coimbatore-web-apprentice': 'ready',
  'opp-chennai-frontend-trainee': 'preparing',
  'opp-trichy-rural-hub-web': 'saved',
  'opp-madurai-junior-dev': 'saved',
  'opp-tiruppur-garment-sample': 'applied',
};

export const initialVivaRecords: Record<string, VivaProofRecord> = {
  'challenge-web-profile': {
    challengeId: 'challenge-web-profile',
    challengeTitle: 'Build a responsive profile page',
    pathwayId: 'junior-web-dev',
    vivaStatus: 'Viva completed',
    authenticityConfidence: 'Consistent',
    averageScore: 92,
    completedAt: 'Yesterday, 4:20 PM',
    qa: [
      {
        question: 'Why did you choose flex over grid for the header and navigation links?',
        questionTamil: 'தலைப்பு மற்றும் வழிசெலுத்தல் இணைப்புகளுக்கு கிரிட்டிற்குப் பதிலாக ஃப்ளெக்ஸ் அமைப்பை ஏன் தேர்ந்தெடுத்தீர்கள்?',
        answer: 'I chose flexbox because the header is a one-dimensional linear row with space-between alignment. Grid adds multi-track complexity that is unnecessary for a horizontal link list.',
        score: 94,
        note: 'Demonstrates authentic understanding of 1D vs 2D layout semantics.'
      },
      {
        question: "How did you ensure the profile layout doesn't horizontally scroll on a 320px mobile viewport?",
        questionTamil: '320 பிக்சல் மொபைல் திரையில் கிடைமட்டமாக உருளாமல் இருக்க என்ன செய்தீர்கள்?',
        answer: 'I removed the rigid min-width and used fluid clamp(12px, 3vw, 24px) padding combined with flex: 1 1 280px and min-width: 0 on the card container.',
        score: 90,
        note: 'Directly addresses mobile viewport constraint handling.'
      },
      {
        question: 'What role does the visible :focus-visible skip-link play for accessibility and screen reader users?',
        questionTamil: 'விசைப்பலகை வழிசெலுத்தலில் skip-link இணைப்பின் முக்கிய பங்கு என்ன?',
        answer: 'It allows keyboard-only and screen reader users to bypass repetitive header navigation and jump straight into the main semantic content with a 3px gold high-contrast outline.',
        score: 92,
        note: 'Confirms WCAG 2.1 AA keyboard accessibility understanding.'
      }
    ]
  }
};

interface SkillBridgeState {
  // Core state
  currentPersonaId: string;
  personas: Persona[];
  pathways: Pathway[];
  challenges: Challenge[];
  badges: Badge[];
  opportunities: Opportunity[];
  streakHistory: StreakDay[];
  vivaRecords: Record<string, VivaProofRecord>;
  trackerStages: Record<string, ApplicationTrackerStage>;
  roadmapFocusSkills: string[];
  
  // Gamification & Reminders
  streakFreezesAvailable: number;
  isExamPaused: boolean;
  examPauseReason: string;
  examPauseDaysRemaining: number;
  reminderTime: string;
  inAppReminderEnabled: boolean;
  streakMissedSimulated: boolean;
  
  // App preferences
  theme: 'light' | 'dark';
  language: Language;
  isOfflineDemo: boolean;
  activeTab: string;
  hasUnreadNotifications: boolean;

  // Actions
  setPersona: (personaId: string) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleOfflineDemo: () => void;
  setActiveTab: (tab: string) => void;
  completeChallenge: (challengeId: string, score: number) => void;
  recordVivaCompletion: (record: VivaProofRecord) => void;
  unlockBadge: (badgeId: string) => void;
  updateSkillState: (pathwayId: string, skillId: string, state: SkillState, score?: number) => void;
  setTrackerStage: (oppId: string, stage: ApplicationTrackerStage) => void;
  addMissingSkillsToRoadmap: (skillNames: string[]) => void;
  consumeStreakFreeze: () => boolean;
  toggleExamPause: (paused: boolean, reason?: string, days?: number) => void;
  simulateMissedDay: (missed: boolean) => void;
  completeCatchUpTask: (rewardXp: number) => void;
  setReminderTime: (time: string) => void;
  setInAppReminderEnabled: (enabled: boolean) => void;
  awardXp: (amount: number, reason: string) => void;
  
  // Offline, PWA & Low-Data Mode
  isLowDataMode: boolean;
  isOffline: boolean;
  isLessonsDownloaded: boolean;
  lessonsDownloadProgress: number;
  offlineCacheSizeMB: number;
  toggleLowDataMode: () => void;
  setOfflineStatus: (offline: boolean) => void;
  downloadLessonsOffline: () => Promise<void>;

  // Guided Demo
  isGuidedDemoOpen: boolean;
  openGuidedDemo: (personaId?: string) => void;
  closeGuidedDemo: () => void;
  setIsOfflineDemo: (offline: boolean) => void;

  resetDemo: () => void;
  getPersona: () => Persona;
  getCurrentPathway: () => Pathway;
}

export const useSkillBridgeStore = create<SkillBridgeState>()(
  persist(
    (set, get) => ({
      currentPersonaId: 'priya-student',
      personas: initialPersonas,
      pathways: initialPathways,
      challenges: initialChallenges,
      badges: initialBadges,
      opportunities: initialOpportunities,
      streakHistory: initialStreakHistory,
      vivaRecords: initialVivaRecords,
      trackerStages: initialTrackerStages,
      roadmapFocusSkills: ['REST API & State Caching'],
      streakFreezesAvailable: 2,
      isExamPaused: false,
      examPauseReason: 'Anna University Semester Exams',
      examPauseDaysRemaining: 12,
      reminderTime: '19:30',
      inAppReminderEnabled: true,
      streakMissedSimulated: false,
      isLowDataMode: false,
      isOffline: false,
      isLessonsDownloaded: false,
      lessonsDownloadProgress: 0,
      offlineCacheSizeMB: 4.2,
      theme: 'light',
      language: 'en',
      isOfflineDemo: false,
      isGuidedDemoOpen: false,
      activeTab: 'home',
      hasUnreadNotifications: true,

      openGuidedDemo: (personaId?: string) => {
        if (personaId) {
          const selected = get().personas.find(p => p.id === personaId);
          if (selected) {
            set({ currentPersonaId: personaId });
          }
        }
        set({ isGuidedDemoOpen: true });
      },

      closeGuidedDemo: () => {
        set({ isGuidedDemoOpen: false });
      },

      setIsOfflineDemo: (offline: boolean) => {
        set({ isOfflineDemo: offline });
      },

      setPersona: (personaId: string) => {
        const selected = get().personas.find(p => p.id === personaId);
        if (selected) {
          set({ currentPersonaId: personaId });
        }
      },

      setLanguage: (lang: Language) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('skillbridge-language', lang);
          } catch (e) {
            // ignore
          }
        }
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang;
        }
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      toggleOfflineDemo: () => {
        set(state => ({ isOfflineDemo: !state.isOfflineDemo }));
      },

      setActiveTab: (tab: string) => {
        set({ activeTab: tab });
      },

      completeChallenge: (challengeId: string, score: number) => {
        set(state => {
          const updatedChallenges = state.challenges.map(c => 
            c.id === challengeId ? { ...c, completed: true, score } : c
          );
          
          // Also reward points to current persona
          const updatedPersonas = state.personas.map(p => {
            if (p.id === state.currentPersonaId) {
              return {
                ...p,
                xpPoints: p.xpPoints + 150,
                recentActivity: [
                  {
                    date: 'Just now',
                    action: `Completed challenge: ${challengeId} (Score ${score}%)`,
                    type: 'challenge' as const
                  },
                  ...p.recentActivity
                ]
              };
            }
            return p;
          });

          return { challenges: updatedChallenges, personas: updatedPersonas };
        });
      },

      recordVivaCompletion: (record: VivaProofRecord) => {
        set(state => {
          const updatedVivaRecords = {
            ...state.vivaRecords,
            [record.challengeId]: record
          };

          const updatedPersonas = state.personas.map(p => {
            if (p.id === state.currentPersonaId) {
              return {
                ...p,
                xpPoints: p.xpPoints + 100,
                recentActivity: [
                  {
                    date: 'Just now',
                    action: `Quick Viva: ${record.challengeTitle} (${record.authenticityConfidence}, Score ${record.averageScore}%)`,
                    type: 'proof' as const
                  },
                  ...p.recentActivity
                ]
              };
            }
            return p;
          });

          return {
            vivaRecords: updatedVivaRecords,
            personas: updatedPersonas
          };
        });
      },

      unlockBadge: (badgeId: string) => {
        set(state => {
          const updatedBadges = state.badges.map(b =>
            b.id === badgeId ? { ...b, isUnlocked: true, unlockedAt: 'Just now' } : b
          );
          
          const updatedPersonas = state.personas.map(p => {
            if (p.id === state.currentPersonaId && !p.activeBadges.includes(badgeId)) {
              return {
                ...p,
                activeBadges: [...p.activeBadges, badgeId]
              };
            }
            return p;
          });

          return { badges: updatedBadges, personas: updatedPersonas };
        });
      },

      updateSkillState: (pathwayId: string, skillId: string, newState: SkillState, score?: number) => {
        set(state => {
          const updatedPathways = state.pathways.map(p => {
            if (p.id === pathwayId) {
              const updatedSkills = p.skills.map(s => {
                if (s.id === skillId) {
                  return {
                    ...s,
                    state: newState,
                    score: score !== undefined ? score : s.score,
                    evidenceCount: s.evidenceCount + 1,
                    lastAssessed: 'Just now'
                  };
                }
                return s;
              });
              return { ...p, skills: updatedSkills };
            }
            return p;
          });
          return { pathways: updatedPathways };
        });
      },

      setTrackerStage: (oppId: string, stage: ApplicationTrackerStage) => {
        set(state => ({
          trackerStages: {
            ...state.trackerStages,
            [oppId]: stage
          }
        }));
      },

      addMissingSkillsToRoadmap: (skillNames: string[]) => {
        set(state => ({
          roadmapFocusSkills: Array.from(new Set([...state.roadmapFocusSkills, ...skillNames]))
        }));
      },

      consumeStreakFreeze: () => {
        const { streakFreezesAvailable } = get();
        if (streakFreezesAvailable > 0) {
          set({ streakFreezesAvailable: streakFreezesAvailable - 1 });
          return true;
        }
        return false;
      },

      toggleExamPause: (paused: boolean, reason = 'Anna University Semester Exams', days = 12) => {
        set({
          isExamPaused: paused,
          examPauseReason: reason,
          examPauseDaysRemaining: days
        });
      },

      simulateMissedDay: (missed: boolean) => {
        set({ streakMissedSimulated: missed });
      },

      completeCatchUpTask: (rewardXp: number) => {
        set(state => {
          const updatedPersonas = state.personas.map(p => {
            if (p.id === state.currentPersonaId) {
              return {
                ...p,
                streakDays: p.streakDays + 1,
                xpPoints: p.xpPoints + rewardXp,
                recentActivity: [
                  {
                    date: 'Just now',
                    action: `Completed 5-min Catch-up Task (+${rewardXp} XP, streak preserved)`,
                    type: 'challenge' as const
                  },
                  ...p.recentActivity
                ]
              };
            }
            return p;
          });

          return {
            streakMissedSimulated: false,
            personas: updatedPersonas
          };
        });
      },

      setReminderTime: (time: string) => {
        set({ reminderTime: time });
      },

      setInAppReminderEnabled: (enabled: boolean) => {
        set({ inAppReminderEnabled: enabled });
      },

      awardXp: (amount: number, reason: string) => {
        set(state => {
          const updatedPersonas = state.personas.map(p => {
            if (p.id === state.currentPersonaId) {
              return {
                ...p,
                xpPoints: p.xpPoints + amount,
                recentActivity: [
                  {
                    date: 'Just now',
                    action: `${reason} (+${amount} XP)`,
                    type: 'proof' as const
                  },
                  ...p.recentActivity
                ]
              };
            }
            return p;
          });
          return { personas: updatedPersonas };
        });
      },

      toggleLowDataMode: () => {
        set(state => {
          const next = !state.isLowDataMode;
          if (typeof document !== 'undefined') {
            if (next) {
              document.documentElement.classList.add('low-data-mode');
            } else {
              document.documentElement.classList.remove('low-data-mode');
            }
          }
          return { isLowDataMode: next };
        });
      },

      setOfflineStatus: (offline: boolean) => {
        set({ isOffline: offline });
      },

      downloadLessonsOffline: async () => {
        set({ lessonsDownloadProgress: 20 });
        await new Promise(r => setTimeout(r, 200));
        set({ lessonsDownloadProgress: 55 });
        await new Promise(r => setTimeout(r, 250));
        set({ lessonsDownloadProgress: 90 });
        await new Promise(r => setTimeout(r, 200));

        try {
          const offlinePack = {
            pathways: get().pathways,
            challenges: get().challenges,
            timestamp: new Date().toISOString(),
            version: '2.0.0-pwa',
            cachedSizeMB: 4.2
          };
          localStorage.setItem('skillbridge_offline_pack', JSON.stringify(offlinePack));
        } catch {
          // ignore storage error
        }

        set({
          lessonsDownloadProgress: 100,
          isLessonsDownloaded: true,
          offlineCacheSizeMB: 4.2
        });
      },

      resetDemo: () => {
        localStorage.removeItem('skillbridge-storage');
        localStorage.removeItem('skillbridge_offline_pack');
        set({
          currentPersonaId: 'priya-student',
          personas: initialPersonas,
          pathways: initialPathways,
          challenges: initialChallenges,
          badges: initialBadges,
          opportunities: initialOpportunities,
          streakHistory: initialStreakHistory,
          vivaRecords: initialVivaRecords,
          trackerStages: initialTrackerStages,
          roadmapFocusSkills: ['REST API & State Caching'],
          streakFreezesAvailable: 2,
          isExamPaused: false,
          examPauseReason: 'Anna University Semester Exams',
          examPauseDaysRemaining: 12,
          reminderTime: '19:30',
          inAppReminderEnabled: true,
          streakMissedSimulated: false,
          isLowDataMode: false,
          isOffline: false,
          isLessonsDownloaded: false,
          lessonsDownloadProgress: 0,
          offlineCacheSizeMB: 4.2,
          theme: 'light',
          language: 'en',
          isOfflineDemo: false,
          activeTab: 'home',
          hasUnreadNotifications: true,
        });
        i18n.changeLanguage('en');
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.remove('low-data-mode');
          document.documentElement.lang = 'en';
        }
      },

      getPersona: () => {
        const { currentPersonaId, personas, pathways, challenges, vivaRecords } = get();
        const persona = personas.find(p => p.id === currentPersonaId) || personas[0];
        const pathway = pathways.find(p => p.id === persona.pathwayId) || pathways[0];
        const calculatedScore = getDeterministicReadinessScore(persona, pathway, challenges, vivaRecords);
        return {
          ...persona,
          readinessScore: calculatedScore
        };
      },

      getCurrentPathway: () => {
        const persona = get().getPersona();
        const { pathways } = get();
        return pathways.find(p => p.id === persona.pathwayId) || pathways[0];
      }
    }),
    {
      name: 'skillbridge-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
