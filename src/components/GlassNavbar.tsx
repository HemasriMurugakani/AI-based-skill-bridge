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
    { id: 'home', label: t('nav.home') },
    { id: 'gap-analysis', label: t('nav.gapAnalysis') },
    { id: 'roadmap', label: t('nav.roadmap') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'challenges', label: t('nav.challenges') },
    { id: 'passport', label: t('nav.passport') },
    { id: 'progress', label: t('nav.progress') },
    { id: 'readiness', label: t('nav.readiness') },
    { id: 'opportunities', label: t('nav.opportunities') },
    { id: 'interview', label: t('nav.interview') },
    { id: 'resume', label: t('nav.resume') },
    { id: 'employer', label: t('nav.employer') },
    { id: 'institution', label: t('nav.institution') },
    { id: 'coach', label: t('nav.coach') },
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
      {/* 1. Live Ticker & Prototype Controls Strip (Deep Blue with Sky & Amber Accents) */}
      <div className="bg-[#173B67] text-white text-[11px] px-3 py-1.5 border-b border-deepblue-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Live indicator ticker */}
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <span className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-sky-400/20 border border-sky-400/40 text-sky-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-ping" />
              LIVE
            </span>
            <span className="truncate text-white/90 font-medium">
              {t('nav.liveTicker')}
            </span>
          </div>

          {/* Right strip controls: AI Mode Toggle, Low-Data Mode, Persona switcher, Reset demo */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Guided Demo (Shift+D) Launch Button */}
            <button
              type="button"
              aria-label="Start guided demo walkthrough"
              onClick={() => openGuidedDemo()}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#F2B66D] hover:bg-[#e59f45] text-[#173B67] shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Start 11-step Guided Demo walkthrough following Priya / Lakshmi story in < 4 mins (Shift+D)"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#173B67] fill-current" />
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
                  ? 'bg-[#62B6E8] text-[#173B67] font-extrabold shadow-xs'
                  : 'bg-white/10 text-white hover:text-white hover:bg-white/20 border border-white/20'
              }`}
              title="Toggle offline demo mode: 100% deterministic local fallback without network latency"
            >
              {isOfflineDemo ? <WifiOff className="w-3 h-3 text-[#173B67]" /> : <Wifi className="w-3 h-3 text-sky-300" />}
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
                  ? 'bg-[#F2B66D] text-[#173B67] font-extrabold shadow-xs'
                  : 'bg-white/10 text-white hover:text-white hover:bg-white/20 border border-white/20'
              }`}
              title="Low-data mode: removes heavy backgrounds and blurs for fast 2G/3G loading"
            >
              <Zap className="w-3 h-3 text-[#F2B66D]" />
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
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-colors"
              >
                <img
                  src={currentPersona.avatar}
                  alt=""
                  aria-hidden="true"
                  className="w-4 h-4 rounded-full object-cover border border-[#62B6E8]"
                />
                <span className="hidden sm:inline max-w-[100px] truncate">{currentPersona.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-sky-200" />
              </button>

              {isPersonaMenuOpen && (
                <div
                  role="menu"
                  aria-label="Persona options"
                  className="absolute right-0 mt-1.5 w-64 p-2 rounded-2xl bg-white dark:bg-night-card border border-sky-100 dark:border-night-border shadow-soft z-50 text-[#173B67] dark:text-night-ink"
                >
                  <div className="px-2 py-1 text-[11px] font-bold text-[#526174] dark:text-night-muted uppercase tracking-wider">
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
                          ? 'bg-[#EAF5FC] dark:bg-deepblue-900/60 font-semibold text-[#173B67] dark:text-sky-200'
                          : 'hover:bg-[#EAF5FC]/50 dark:hover:bg-night-100 text-[#173B67] dark:text-night-ink'
                      }`}
                    >
                      <img
                        src={p.avatar}
                        alt=""
                        aria-hidden="true"
                        className="w-7 h-7 rounded-full object-cover border border-[#62B6E8] shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-[10px] text-[#526174] dark:text-night-muted truncate">{p.tag}</div>
                      </div>
                      {p.id === currentPersonaId && (
                        <UserCheck className="w-4 h-4 text-[#173B67] dark:text-sky-300 ml-auto shrink-0" />
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
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full text-[11px] font-semibold text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
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
          {/* Brand Logo with Stylized Bridge */}
          <div
            onClick={() => handleTabSelect('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            {/* Signature Bridge Motif Icon in Deep Blue + Sky Blue */}
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-[#173B67] to-[#62B6E8] flex items-center justify-center shadow-soft border border-white/40 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M2 17 C6 8, 18 8, 22 17" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 17 V12 M12 17 V9 M17 17 V12" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="7" r="1.5" fill="currentColor" />
              </svg>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#173B67] dark:text-white group-hover:text-[#62B6E8] transition-colors">
                  SkillBridge
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#EAF5FC] text-[#173B67] dark:bg-sky-950 dark:text-sky-300 border border-[#62B6E8]/30">
                  AI
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#526174] dark:text-night-muted leading-normal truncate max-w-[140px]">
                {t('brand.subtitle')}
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 bg-white/90 dark:bg-night-100/70 p-1 rounded-full border border-sky-100 dark:border-night-border shadow-xs overflow-x-auto max-w-xl">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabSelect(link.id)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#173B67] text-white shadow-soft'
                      : 'text-[#173B67]/80 dark:text-night-ink/80 hover:text-[#173B67] dark:hover:text-white hover:bg-[#EAF5FC] dark:hover:bg-white/5'
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
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2B66D] hover:bg-[#e59f45] text-[#173B67] text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Launch Guided Demo walkthrough (Shift+D)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#173B67] fill-current" />
              <span className="hidden xl:inline">Guided Demo</span>
              <span className="text-[10px] bg-[#173B67]/15 px-1.5 py-0.5 rounded font-mono font-bold">Shift+D</span>
            </button>

            {/* Streak Flame (Clickable to open Streak & Mastery dashboard) */}
            <button
              type="button"
              aria-label={`${currentPersona.streakDays} day practice streak. Click to view progress dashboard.`}
              onClick={() => handleTabSelect('progress')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FCF3E5] dark:bg-amber-950/50 border border-[#F2B66D]/40 text-[#532F0D] dark:text-amber-300 text-xs font-bold hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title={`${currentPersona.streakDays} Day Practice Streak · Click to view Recovery & Heatmap`}
            >
              <Flame className="w-3.5 h-3.5 text-[#F2B66D] fill-[#F2B66D] animate-bounce" />
              <span>{currentPersona.streakDays}</span>
            </button>

            {/* XP Points */}
            <button
              type="button"
              aria-label={`${currentPersona.xpPoints} skill experience points. Click to view advancement criteria.`}
              onClick={() => handleTabSelect('progress')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF5FC] dark:bg-deepblue-950/60 border border-[#62B6E8]/40 text-[#173B67] dark:text-sky-200 text-xs font-bold hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title={`${currentPersona.xpPoints} Skill XP · Click to view Level Advancement Criteria`}
            >
              <Award className="w-3.5 h-3.5 text-[#62B6E8]" />
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
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-night-100 border border-sky-100 dark:border-night-border text-xs font-semibold text-[#173B67] dark:text-night-ink hover:border-[#62B6E8] transition-colors"
              >
                <span>
                  {language === 'ta' ? 'தமிழ்' : language === 'fr' ? 'Français' : language === 'hi' ? 'हिन्दी' : 'English'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isLangMenuOpen && (
                <div
                  role="menu"
                  aria-label="Language options"
                  className="absolute right-0 mt-1 w-36 p-1.5 rounded-2xl bg-white dark:bg-night-card border border-sky-100 dark:border-night-border shadow-soft z-50 text-[#173B67] dark:text-night-ink"
                >
                  <button
                    role="menuitem"
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full px-2.5 py-1 text-xs rounded-xl text-left font-medium ${
                      language === 'en' ? 'bg-[#173B67] text-white font-bold' : 'hover:bg-[#EAF5FC] dark:hover:bg-night-100'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => handleLanguageChange('ta')}
                    className={`w-full px-2.5 py-1 text-xs rounded-xl text-left font-tamil font-medium ${
                      language === 'ta' ? 'bg-[#173B67] text-white font-bold' : 'hover:bg-[#EAF5FC] dark:hover:bg-night-100'
                    }`}
                  >
                    தமிழ் (TA)
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => handleLanguageChange('fr')}
                    className={`w-full px-2.5 py-1 text-xs rounded-xl text-left font-medium ${
                      language === 'fr' ? 'bg-[#173B67] text-white font-bold' : 'hover:bg-[#EAF5FC] dark:hover:bg-night-100'
                    }`}
                  >
                    Français (FR)
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => handleLanguageChange('hi')}
                    className={`w-full px-2.5 py-1 text-xs rounded-xl text-left font-medium ${
                      language === 'hi' ? 'bg-[#173B67] text-white font-bold' : 'hover:bg-[#EAF5FC] dark:hover:bg-night-100'
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
              className="relative p-1.5 rounded-full text-[#526174] hover:text-[#173B67] dark:hover:text-sky-300 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#62B6E8] animate-pulse" />
              )}
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full text-[#526174] hover:text-[#173B67] dark:hover:text-sky-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F2B66D]" /> : <Moon className="w-4 h-4 text-[#173B67]" />}
            </button>

            {/* Deep Blue "Join free" Button */}
            <button
              type="button"
              onClick={() => handleTabSelect('onboarding')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#173B67] hover:bg-[#112C4E] text-white text-xs font-semibold shadow-soft transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
              className="lg:hidden p-1.5 rounded-xl text-[#173B67] dark:text-night-ink hover:bg-[#EAF5FC] dark:hover:bg-night-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-2 border-t border-sky-100 dark:border-night-border grid grid-cols-2 gap-1.5 pb-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleTabSelect(link.id)}
                className={`p-2 rounded-xl text-xs font-semibold text-left flex items-center justify-between ${
                  activeTab === link.id
                    ? 'bg-[#173B67] text-white'
                    : 'bg-[#EAF5FC] dark:bg-night-100/60 text-[#173B67] dark:text-night-ink'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
