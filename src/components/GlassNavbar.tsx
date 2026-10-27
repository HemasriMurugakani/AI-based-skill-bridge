import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { LiveIndicator } from './LiveIndicator';
import {
  Flame,
  Award,
  Bell,
  Sun,
  Moon,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Zap,
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Language } from '../types';

interface GlassNavbarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  activeTab,
  onTabChange
}) => {
  const {
    currentPersonaId,
    personas,
    setPersona,
    resetDemo,
    theme,
    setTheme,
    language,
    setLanguage,
    getPersona,
    hasUnreadNotifications,
    isLowDataMode,
    toggleLowDataMode,
    isOfflineDemo,
    toggleOfflineDemo,
    openGuidedDemo
  } = useSkillBridgeStore();

  const { t } = useTranslation();
  const currentPersona = getPersona();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('nav.home'), tamil: 'முகப்பு' },
    { id: 'gap-analysis', label: 'JD Gaps', tamil: 'வேலை ஆய்வு' },
    { id: 'roadmap', label: t('nav.roadmap'), tamil: 'வரைபடம்' },
    { id: 'skills', label: t('nav.skills'), tamil: 'திறன்கள்' },
    { id: 'challenges', label: t('nav.challenges'), tamil: 'சவால்கள்' },
    { id: 'passport', label: t('nav.passport'), tamil: 'கடவுச்சீட்டு' },
    { id: 'progress', label: 'Streak & XP', tamil: 'முன்னேற்றம்' },
    { id: 'readiness', label: t('nav.readiness'), tamil: 'தயார்நிலை' },
    { id: 'opportunities', label: t('nav.opportunities'), tamil: 'வாய்ப்புகள்' },
    { id: 'interview', label: t('nav.interview', 'AI Interview'), tamil: 'நேர்காணல்' },
    { id: 'resume', label: t('nav.resume', '1-Page Resume'), tamil: 'ரெஸ்யூமே' },
    { id: 'employer', label: t('nav.employer', 'Employer'), tamil: 'பணியமர்த்துநர்' },
    { id: 'institution', label: t('nav.institution', 'Institution'), tamil: 'கல்வி நிறுவனம்' },
    { id: 'coach', label: t('nav.coach'), tamil: 'AI வழிகாட்டி' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* 1. Live Ticker & Prototype Controls Strip */}
      <div className="bg-maroon-900 text-gold-100 text-[11px] px-3 py-1.5 border-b border-maroon-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Live indicator ticker */}
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <span className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-forest-600/30 border border-forest-500/50 text-forest-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-ping" />
              LIVE
            </span>
            <span className="hidden sm:inline truncate text-warm-border/90 font-medium">
              Tamil Nadu Civic Skill Engine • <span className="text-gold-300 font-semibold">50,320</span> learners • <span className="text-gold-300 font-semibold">81.4%</span> verified hire rate
            </span>
            <span className="sm:hidden truncate text-warm-border/90 font-medium text-[10px]">
              TN Civic Engine • <span className="text-gold-300 font-semibold">50k+</span>
            </span>
          </div>

          {/* Right strip controls: AI Mode Toggle, Low-Data Mode, Persona switcher, Reset demo */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Guided Demo (Shift+D) Launch Button */}
            <button
              type="button"
              aria-label="Start guided demo walkthrough"
              onClick={() => openGuidedDemo()}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-gradient-to-r from-amber-400 via-gold-400 to-amber-500 text-maroon-950 shadow-warm-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Start 11-step Guided Demo walkthrough following Priya / Lakshmi story in < 4 mins (Shift+D)"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-maroon-950 fill-current" />
              <span className="hidden xs:inline">Guided Demo</span>
              <span className="xs:hidden">Demo</span>
            </button>

            {/* Offline Demo Mode Toggle */}
            <button
              type="button"
              aria-label={`Toggle offline demo mode, currently ${isOfflineDemo ? 'on' : 'off'}`}
              onClick={toggleOfflineDemo}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                isOfflineDemo
                  ? 'bg-forest-500 text-white font-extrabold shadow-xs'
                  : 'bg-maroon-800 text-gold-200 hover:text-white hover:bg-maroon-700 border border-maroon-700'
              }`}
              title="Toggle offline demo mode: 100% deterministic local fallback without network latency"
            >
              {isOfflineDemo ? <WifiOff className="w-3 h-3 text-forest-200" /> : <Wifi className="w-3 h-3 text-gold-300" />}
              <span>Offline: {isOfflineDemo ? 'ON' : 'OFF'}</span>
            </button>

            <LiveIndicator />

            {/* Low-Data Mode Toggle */}
            <button
              type="button"
              aria-label={`Toggle low data mode, currently ${isLowDataMode ? 'on' : 'off'}`}
              onClick={toggleLowDataMode}
              className={`hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                isLowDataMode
                  ? 'bg-amber-400 text-maroon-950 font-extrabold shadow-xs'
                  : 'bg-maroon-800 text-gold-200 hover:text-white hover:bg-maroon-700 border border-maroon-700'
              }`}
              title="Low-data mode: removes heavy backgrounds and blurs for fast 2G/3G loading"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Low-Data: {isLowDataMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Persona Switcher Quick Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-label={`Switch persona. Current persona is ${currentPersona.name}`}
                aria-expanded={isPersonaMenuOpen}
                aria-haspopup="true"
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-maroon-800/80 hover:bg-maroon-700 text-white text-xs font-medium border border-maroon-700/80 transition-colors"
              >
                <img
                  src={currentPersona.avatar}
                  alt=""
                  aria-hidden="true"
                  className="w-4 h-4 rounded-full object-cover border border-gold-400"
                />
                <span className="hidden sm:inline max-w-[100px] truncate">{currentPersona.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-gold-300" />
              </button>

              {isPersonaMenuOpen && (
                <div
                  role="menu"
                  aria-label="Persona options"
                  className="absolute right-0 mt-1.5 w-64 p-2 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border dark:border-night-border shadow-warm-lg z-50 text-warm-ink dark:text-night-ink"
                >
                  <div className="px-2 py-1 text-[11px] font-bold text-warm-muted dark:text-night-muted uppercase tracking-wider">
                    {t('nav.switchPersona')}
                  </div>
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      role="menuitem"
                      onClick={() => {
                        setPersona(p.id);
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                        p.id === currentPersonaId
                          ? 'bg-maroon-50 dark:bg-maroon-950/60 font-semibold text-maroon-900 dark:text-maroon-200'
                          : 'hover:bg-warm-100 dark:hover:bg-night-100 text-warm-ink dark:text-night-ink'
                      }`}
                    >
                      <img
                        src={p.avatar}
                        alt=""
                        aria-hidden="true"
                        className="w-7 h-7 rounded-full object-cover border border-gold-400 shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-[10px] text-warm-muted dark:text-night-muted truncate">{p.tag}</div>
                      </div>
                      {p.id === currentPersonaId && (
                        <UserCheck className="w-4 h-4 text-forest-600 dark:text-forest-400 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Demo Button */}
            <button
              type="button"
              aria-label="Reset demo data to initial state"
              onClick={resetDemo}
              title="Reset demo data to initial prototype state"
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full text-[11px] font-semibold text-gold-200 hover:text-white hover:bg-maroon-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">{t('nav.resetDemo')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Frosted Glass Main Navigation Bar */}
      <nav className="glass-nav px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo with Stylized Kolam Bridge */}
          <div
            onClick={() => handleTabSelect('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            {/* Signature Bridge Motif Icon */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-maroon-800 via-maroon-700 to-gold-600 flex items-center justify-center shadow-warm-sm border border-gold-400/40 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-gold-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {/* Bridge Arch with central lotus node */}
                <path d="M2 17 C6 8, 18 8, 22 17" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 17 V12 M12 17 V9 M17 17 V12" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="7" r="1.5" fill="currentColor" />
              </svg>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-forest-500 border border-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heritage text-base sm:text-lg font-bold tracking-tight text-maroon-900 dark:text-gold-200 group-hover:text-maroon-700 transition-colors">
                  SkillBridge
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-gold-400/20 text-gold-800 dark:text-gold-300 border border-gold-400/40">
                  AI
                </span>
              </div>
              <div className="font-tamil text-[10px] sm:text-[11px] font-semibold text-warm-muted dark:text-night-muted leading-normal">
                திறன் பாலம்
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 bg-parchment-200/50 dark:bg-night-100/50 p-1 rounded-full border border-warm-border/60 dark:border-night-border/60 overflow-x-auto max-w-xl">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabSelect(link.id)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-maroon-700 text-white shadow-warm-sm'
                      : 'text-warm-ink/80 dark:text-night-ink/80 hover:text-maroon-900 dark:hover:text-gold-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Tools: Streak, Points, Bell, Language, Theme, CTA */}
          <div className="flex items-center gap-2">
            {/* Guided Demo Shortcut Button */}
            <button
              type="button"
              onClick={() => openGuidedDemo()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-gold-400 to-amber-500 text-maroon-950 text-xs font-black shadow-warm-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Launch Guided Demo walkthrough (Shift+D)"
            >
              <Sparkles className="w-3.5 h-3.5 text-maroon-950 fill-current" />
              <span className="hidden xl:inline">Guided Demo</span>
              <span className="text-[10px] bg-maroon-950/20 px-1.5 py-0.2 rounded font-mono font-bold">Shift+D</span>
            </button>

            {/* Streak Flame (Clickable to open Streak & Mastery dashboard) */}
            <button
              type="button"
              aria-label={`${currentPersona.streakDays} day practice streak. Click to view progress dashboard.`}
              onClick={() => handleTabSelect('progress')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-terracotta-50 dark:bg-terracotta-950/60 border border-terracotta-200 dark:border-terracotta-800/60 text-terracotta-800 dark:text-terracotta-300 text-xs font-bold hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title={`${currentPersona.streakDays} Day Practice Streak · Click to view Recovery & Heatmap`}
            >
              <Flame className="w-3.5 h-3.5 text-terracotta-600 fill-terracotta-500 animate-bounce" />
              <span>{currentPersona.streakDays}</span>
            </button>

            {/* XP Points (Clickable to open Level criteria & XP rules) */}
            <button
              type="button"
              aria-label={`${currentPersona.xpPoints} skill experience points. Click to view advancement criteria.`}
              onClick={() => handleTabSelect('progress')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-50 dark:bg-gold-950/60 border border-gold-200 dark:border-gold-800/60 text-gold-900 dark:text-gold-200 text-xs font-bold hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title={`${currentPersona.xpPoints} Skill XP · Click to view Level Advancement Criteria`}
            >
              <Award className="w-3.5 h-3.5 text-gold-600" />
              <span>{currentPersona.xpPoints}</span>
            </button>

            {/* Language Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                aria-label={`Change application language. Current language: ${language.toUpperCase()}`}
                aria-expanded={isLangMenuOpen}
                aria-haspopup="true"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-parchment-200/80 dark:bg-night-100 border border-warm-border dark:border-night-border text-xs font-semibold text-warm-ink dark:text-night-ink hover:border-gold-400 transition-colors"
              >
                <span className="font-tamil">{language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिन्दी' : 'EN'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isLangMenuOpen && (
                <div
                  role="menu"
                  aria-label="Language options"
                  className="absolute right-0 mt-1 w-28 p-1.5 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border dark:border-night-border shadow-warm-md z-50"
                >
                  <button
                    role="menuitem"
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full px-2.5 py-1 text-xs rounded-lg text-left font-medium ${
                      language === 'en' ? 'bg-maroon-700 text-white font-bold' : 'hover:bg-warm-100 dark:hover:bg-night-100'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => handleLanguageChange('ta')}
                    className={`w-full px-2.5 py-1 text-xs rounded-lg text-left font-tamil font-medium ${
                      language === 'ta' ? 'bg-maroon-700 text-white font-bold' : 'hover:bg-warm-100 dark:hover:bg-night-100'
                    }`}
                  >
                    தமிழ் (TA)
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => handleLanguageChange('hi')}
                    className={`w-full px-2.5 py-1 text-xs rounded-lg text-left font-medium ${
                      language === 'hi' ? 'bg-maroon-700 text-white font-bold' : 'hover:bg-warm-100 dark:hover:bg-night-100'
                    }`}
                  >
                    हिन्दी (HI)
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative p-1.5 rounded-full text-warm-muted hover:text-maroon-800 dark:hover:text-gold-300 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-maroon-600 animate-pulse" />
              )}
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full text-warm-muted hover:text-maroon-800 dark:hover:text-gold-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-warm-ink" />}
            </button>

            {/* Maroon "Join free" Button */}
            <button
              type="button"
              onClick={() => handleTabSelect('onboarding')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-semibold shadow-warm-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{t('nav.joinFree')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-warm-ink dark:text-night-ink hover:bg-warm-100 dark:hover:bg-night-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-2 border-t border-warm-border/60 dark:border-night-border/60 grid grid-cols-2 gap-1.5 pb-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleTabSelect(link.id)}
                className={`p-2 rounded-xl text-xs font-semibold text-left flex items-center justify-between ${
                  activeTab === link.id
                    ? 'bg-maroon-700 text-white'
                    : 'bg-warm-100/60 dark:bg-night-100/60 text-warm-ink dark:text-night-ink'
                }`}
              >
                <span>{link.label}</span>
                <span className="font-tamil text-[10px] opacity-70">{link.tamil}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
