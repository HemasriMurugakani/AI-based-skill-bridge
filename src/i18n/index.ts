import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Language } from '../types';

// EN namespaces
import enChallenges from '../locales/en/challenges.json';
import enCoach from '../locales/en/coach.json';
import enCommon from '../locales/en/common.json';
import enErrors from '../locales/en/errors.json';
import enGapAnalysis from '../locales/en/gapAnalysis.json';
import enHome from '../locales/en/home.json';
import enOnboarding from '../locales/en/onboarding.json';
import enOpportunities from '../locales/en/opportunities.json';
import enPassport from '../locales/en/passport.json';
import enReadiness from '../locales/en/readiness.json';
import enResume from '../locales/en/resume.json';
import enRoadmap from '../locales/en/roadmap.json';
import enSkills from '../locales/en/skills.json';
import enStreaks from '../locales/en/streaks.json';

// TA namespaces
import taChallenges from '../locales/ta/challenges.json';
import taCoach from '../locales/ta/coach.json';
import taCommon from '../locales/ta/common.json';
import taErrors from '../locales/ta/errors.json';
import taGapAnalysis from '../locales/ta/gapAnalysis.json';
import taHome from '../locales/ta/home.json';
import taOnboarding from '../locales/ta/onboarding.json';
import taOpportunities from '../locales/ta/opportunities.json';
import taPassport from '../locales/ta/passport.json';
import taReadiness from '../locales/ta/readiness.json';
import taResume from '../locales/ta/resume.json';
import taRoadmap from '../locales/ta/roadmap.json';
import taSkills from '../locales/ta/skills.json';
import taStreaks from '../locales/ta/streaks.json';

// FR namespaces
import frChallenges from '../locales/fr/challenges.json';
import frCoach from '../locales/fr/coach.json';
import frCommon from '../locales/fr/common.json';
import frErrors from '../locales/fr/errors.json';
import frGapAnalysis from '../locales/fr/gapAnalysis.json';
import frHome from '../locales/fr/home.json';
import frOnboarding from '../locales/fr/onboarding.json';
import frOpportunities from '../locales/fr/opportunities.json';
import frPassport from '../locales/fr/passport.json';
import frReadiness from '../locales/fr/readiness.json';
import frResume from '../locales/fr/resume.json';
import frRoadmap from '../locales/fr/roadmap.json';
import frSkills from '../locales/fr/skills.json';
import frStreaks from '../locales/fr/streaks.json';

// HI namespaces
import hiChallenges from '../locales/hi/challenges.json';
import hiCoach from '../locales/hi/coach.json';
import hiCommon from '../locales/hi/common.json';
import hiErrors from '../locales/hi/errors.json';
import hiGapAnalysis from '../locales/hi/gapAnalysis.json';
import hiHome from '../locales/hi/home.json';
import hiOnboarding from '../locales/hi/onboarding.json';
import hiOpportunities from '../locales/hi/opportunities.json';
import hiPassport from '../locales/hi/passport.json';
import hiReadiness from '../locales/hi/readiness.json';
import hiResume from '../locales/hi/resume.json';
import hiRoadmap from '../locales/hi/roadmap.json';
import hiSkills from '../locales/hi/skills.json';
import hiStreaks from '../locales/hi/streaks.json';

export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    challenges: enChallenges,
    coach: enCoach,
    errors: enErrors,
    gapAnalysis: enGapAnalysis,
    onboarding: enOnboarding,
    opportunities: enOpportunities,
    passport: enPassport,
    readiness: enReadiness,
    resume: enResume,
    roadmap: enRoadmap,
    skills: enSkills,
    streaks: enStreaks,
    translation: enCommon, // backwards compatibility
  },
  ta: {
    common: taCommon,
    home: taHome,
    challenges: taChallenges,
    coach: taCoach,
    errors: taErrors,
    gapAnalysis: taGapAnalysis,
    onboarding: taOnboarding,
    opportunities: taOpportunities,
    passport: taPassport,
    readiness: taReadiness,
    resume: taResume,
    roadmap: taRoadmap,
    skills: taSkills,
    streaks: taStreaks,
    translation: taCommon,
  },
  fr: {
    common: frCommon,
    home: frHome,
    challenges: frChallenges,
    coach: frCoach,
    errors: frErrors,
    gapAnalysis: frGapAnalysis,
    onboarding: frOnboarding,
    opportunities: frOpportunities,
    passport: frPassport,
    readiness: frReadiness,
    resume: frResume,
    roadmap: frRoadmap,
    skills: frSkills,
    streaks: frStreaks,
    translation: frCommon,
  },
  hi: {
    common: hiCommon,
    home: hiHome,
    challenges: hiChallenges,
    coach: hiCoach,
    errors: hiErrors,
    gapAnalysis: hiGapAnalysis,
    onboarding: hiOnboarding,
    opportunities: hiOpportunities,
    passport: hiPassport,
    readiness: hiReadiness,
    resume: hiResume,
    roadmap: hiRoadmap,
    skills: hiSkills,
    streaks: hiStreaks,
    translation: hiCommon,
  },
};

/**
 * Detect initial language from localStorage, zustand persistence, or browser navigator.
 */
export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  try {
    const saved = localStorage.getItem('skillbridge-language');
    if (saved && (saved === 'en' || saved === 'ta' || saved === 'fr' || saved === 'hi')) {
      return saved as Language;
    }

    const rawPersist = localStorage.getItem('skillbridge-storage');
    if (rawPersist) {
      const parsed = JSON.parse(rawPersist);
      const stateLang = parsed?.state?.language;
      if (stateLang && (stateLang === 'en' || stateLang === 'ta' || stateLang === 'fr' || stateLang === 'hi')) {
        return stateLang as Language;
      }
    }
  } catch (e) {
    // ignore parsing errors
  }

  // Detect from browser navigator on first visit
  const navLang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase();
  if (navLang.startsWith('ta')) return 'ta';
  if (navLang.startsWith('fr')) return 'fr';
  if (navLang.startsWith('hi')) return 'hi';

  return 'en';
}

const initialLang = getInitialLanguage();

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    ns: [
      'common',
      'home',
      'challenges',
      'coach',
      'errors',
      'gapAnalysis',
      'onboarding',
      'opportunities',
      'passport',
      'readiness',
      'resume',
      'roadmap',
      'skills',
      'streaks',
      'translation',
    ],
    defaultNS: 'common',
    fallbackNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    missingKeyHandler: (lngs, ns, key) => {
      // In development, log any missing key for fast developer debugging
      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.warn(`[i18n:dev] Missing translation key "${key}" in namespace "${ns}" for language(s): ${Array.isArray(lngs) ? lngs.join(', ') : lngs}`);
      }
    },
    saveMissing: true,
  });

export default i18n;
