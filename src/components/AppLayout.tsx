import React from 'react';
import { GlassNavbar } from './GlassNavbar';
import { HeritageBackground } from './HeritageBackground';
import { OfflineBanner } from './OfflineBanner';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Map,
  Layers,
  Compass,
  FileCheck2,
  Gauge,
  Briefcase,
  BotMessageSquare,
  ShieldCheck,
  Sparkles,
  Heart,
  Search
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { activeTab, setActiveTab, getPersona } = useSkillBridgeStore();
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const currentPersona = getPersona();

  const navigationItems = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'gap-analysis', label: t('nav.gapAnalysis'), icon: Search },
    { id: 'roadmap', label: t('nav.roadmap'), icon: Map },
    { id: 'skills', label: t('nav.skills'), icon: Layers },
    { id: 'challenges', label: t('nav.challenges'), icon: Compass },
    { id: 'passport', label: t('nav.passport'), icon: FileCheck2 },
    { id: 'readiness', label: t('nav.readiness'), icon: Gauge },
    { id: 'opportunities', label: t('nav.opportunities'), icon: Briefcase },
    { id: 'coach', label: t('nav.coach'), icon: BotMessageSquare },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-[#173B67] dark:bg-[#0B1726] dark:text-white transition-colors duration-300 font-poppins">
      {/* Skip to Main Content Link for Keyboard and Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#173B67] focus:text-white focus:font-semibold focus:rounded-btn focus:shadow-soft focus:outline-none focus:ring-2 focus:ring-[#62B6E8] text-xs font-poppins"
      >
        Skip to main content
      </a>

      {/* Background illustrations & soft glowing accents */}
      <HeritageBackground variant="hero" />

      {/* Offline & PWA Notification Strip */}
      <OfflineBanner />

      {/* Top Sticky Frosted Glass Navbar */}
      <GlassNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Layout with Desktop Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar (hidden on mobile, visible on lg) */}
        <aside
          aria-label="Sidebar navigation"
          className="hidden lg:flex flex-col w-64 shrink-0 py-6 pr-6 border-r border-[#E2E8F0] dark:border-slate-800"
        >
          {/* Active Persona Compact Profile Card */}
          <div className="p-4 mb-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3">
              <img
                src={currentPersona.avatar}
                alt={`${currentPersona.name} profile`}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#62B6E8] shadow-xs"
              />
              <div className="truncate">
                <h4 className="text-sm font-bold text-[#173B67] dark:text-white truncate">
                  {isTa ? currentPersona.nameTamil : currentPersona.name}
                </h4>
                <div className="text-[10px] font-semibold text-[#62B6E8] truncate">
                  {isTa && currentPersona.tagTamil ? currentPersona.tagTamil : currentPersona.tag}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#E2E8F0] dark:border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-1.5 rounded-btn bg-[#EAF5FC] dark:bg-slate-800">
                <div className="text-[10px] text-[#526174] dark:text-slate-400 font-medium">{t('persona.readiness')}</div>
                <div className="font-bold text-[#10B981]">
                  {currentPersona.readinessScore}%
                </div>
              </div>
              <div className="p-1.5 rounded-btn bg-[#FCF3E5] dark:bg-slate-800">
                <div className="text-[10px] text-[#526174] dark:text-slate-400 font-medium">{t('persona.streak')}</div>
                <div className="font-bold text-[#F2B66D]">
                  {currentPersona.streakDays}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav aria-label="Desktop primary navigation" className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-btn text-xs font-semibold transition-colors duration-150 group text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#173B67] text-white shadow-soft'
                      : 'text-[#173B67] hover:bg-[#D9EFFB] hover:text-[#173B67] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#62B6E8]' : 'text-[#526174] group-hover:text-[#173B67] dark:text-slate-400 dark:group-hover:text-[#62B6E8]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Proof-to-Progress Motif Banner */}
          <div className="mt-auto pt-6">
            <div className="p-4 rounded-card bg-[#173B67] text-white text-xs border border-[#62B6E8]/30 shadow-soft">
              <div className="flex items-center gap-1.5 text-[#F2B66D] font-bold text-[11px] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proof-to-Progress</span>
              </div>
              <p className="text-[11px] text-white/90 leading-relaxed">
                Prove ability with code & physical photos. Unlocks verified opportunities.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('challenges')}
                className="mt-3 w-full py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-xs transition-colors cursor-pointer shadow-soft"
              >
                Take a Challenge
              </button>
            </div>
          </div>
        </aside>

        {/* Main Routed Page Container */}
        <main
          id="main-content"
          tabIndex={-1}
          role="main"
          className="flex-1 min-w-0 py-6 px-3 sm:px-6 pb-28 sm:pb-32 lg:pb-12 focus:outline-none"
        >
          {children}
        </main>
      </div>

      {/* CTA Band with Overlay Text (on non-home views) */}
      {activeTab !== 'home' && (
        <>
          <section className="relative mt-12 bg-[#173B67] text-white overflow-hidden border-t border-[#62B6E8]/30">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FC]/15 text-[#62B6E8] border border-[#62B6E8]/30 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('brand.subtitle')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-poppins">
                  {t('brand.tagline')}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed font-poppins">
                  {t('brand.motto')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('challenges')}
                  className="w-full sm:w-auto px-6 py-3 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-sm shadow-soft transition-colors cursor-pointer"
                >
                  {t('actions.takeChallenge')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('passport')}
                  className="w-full sm:w-auto px-6 py-3 rounded-btn bg-white hover:bg-[#EAF5FC] text-[#173B67] font-semibold text-sm transition-colors cursor-pointer border border-[#E2E8F0]"
                >
                  {t('actions.viewPassport')}
                </button>
              </div>
            </div>
          </section>

          {/* Footer with Civic Details & Global Shared Disclosure */}
          <footer role="contentinfo" className="bg-[#F8FAFC] dark:bg-[#0B1726] border-t border-[#E2E8F0] dark:border-slate-800 text-[#526174] dark:text-slate-400 text-xs py-8 px-4 sm:px-6 font-poppins">
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#173B67] dark:text-white">
                    {t('brand.name')}
                  </span>
                  <span>•</span>
                  <span className="italic">{t('brand.tagline')}</span>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span>{t('footer.demoMode')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#173B67] dark:text-sky-300 font-medium">
                    <Heart className="w-3 h-3 fill-current text-[#62B6E8]" /> {t('footer.craftedWith')}
                  </span>
                </div>
              </div>

              {/* Centralized Global Data Disclosure */}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800/80 text-[11px] text-[#526174] dark:text-slate-500 text-center md:text-left leading-relaxed">
                <span className="font-semibold text-[#173B67] dark:text-slate-300">Data Transparency Disclosure:</span> {t('trust.dataTransparency')}
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Mobile Bottom Navigation Bar (Fixed for thumb navigation on <lg) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0F2035]/95 backdrop-blur-md border-t border-[#E2E8F0] dark:border-slate-800 px-2 py-1.5 shadow-soft"
      >
        <div className="grid grid-cols-5 gap-1">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-btn transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#173B67] dark:text-sky-300 font-bold bg-[#EAF5FC] dark:bg-slate-800'
                    : 'text-[#526174] dark:text-slate-400 font-medium hover:text-[#173B67]'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
