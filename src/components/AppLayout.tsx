import React from 'react';
import { GlassNavbar } from './GlassNavbar';
import { HeritageBackground } from './HeritageBackground';
import { OfflineBanner } from './OfflineBanner';
import { KolamDivider } from './KolamDivider';
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
  PhoneCall,
  Heart,
  Search
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { activeTab, setActiveTab, getPersona } = useSkillBridgeStore();
  const { t } = useTranslation();
  const currentPersona = getPersona();

  const navigationItems = [
    { id: 'home', label: t('nav.home'), tamil: 'முகப்பு', icon: Home },
    { id: 'gap-analysis', label: 'JD Gap Analysis', tamil: 'வேலை பகுப்பாய்வு', icon: Search },
    { id: 'roadmap', label: t('nav.roadmap'), tamil: 'வரைபடம்', icon: Map },
    { id: 'skills', label: t('nav.skills'), tamil: 'திறன்கள்', icon: Layers },
    { id: 'challenges', label: t('nav.challenges'), tamil: 'சவால்கள்', icon: Compass },
    { id: 'passport', label: t('nav.passport'), tamil: 'கடவுச்சீட்டு', icon: FileCheck2 },
    { id: 'readiness', label: t('nav.readiness'), tamil: 'தயார்நிலை', icon: Gauge },
    { id: 'opportunities', label: t('nav.opportunities'), tamil: 'வாய்ப்புகள்', icon: Briefcase },
    { id: 'coach', label: t('nav.coach'), tamil: 'AI வழிகாட்டி', icon: BotMessageSquare },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-parchment text-warm-ink dark:bg-night dark:text-night-ink transition-colors duration-300">
      {/* Skip to Main Content Link for Keyboard and Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-maroon-800 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-warm-lg focus:outline-none focus:ring-2 focus:ring-gold-400 text-xs"
      >
        Skip to main content • முக்கிய பகுதிக்குச் செல்
      </a>

      {/* Background heritage illustrations & kolam motifs */}
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
          className="hidden lg:flex flex-col w-64 shrink-0 py-6 pr-6 border-r border-warm-border/60 dark:border-night-border/60"
        >
          {/* Active Persona Compact Profile Card */}
          <div className="p-3.5 mb-6 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
            <div className="flex items-center gap-3">
              <img
                src={currentPersona.avatar}
                alt={`${currentPersona.name} profile`}
                className="w-11 h-11 rounded-full object-cover border-2 border-gold-400 shadow-xs"
              />
              <div className="truncate">
                <h4 className="text-sm font-bold text-warm-ink dark:text-night-ink truncate">
                  {currentPersona.name}
                </h4>
                <div className="font-tamil text-[10px] text-warm-muted dark:text-night-muted truncate leading-normal">
                  {currentPersona.nameTamil}
                </div>
                <div className="text-[10px] font-semibold text-maroon-700 dark:text-gold-400 truncate">
                  {currentPersona.tag}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-warm-border/60 dark:border-night-border/60 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-1 rounded-lg bg-parchment-200/50 dark:bg-night-100/50">
                <div className="text-[10px] text-warm-muted dark:text-night-muted">Readiness</div>
                <div className="font-bold text-forest-700 dark:text-forest-400">
                  {currentPersona.readinessScore}%
                </div>
              </div>
              <div className="p-1 rounded-lg bg-parchment-200/50 dark:bg-night-100/50">
                <div className="text-[10px] text-warm-muted dark:text-night-muted">Streak</div>
                <div className="font-bold text-terracotta-700 dark:text-terracotta-400">
                  {currentPersona.streakDays} Days
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav aria-label="Desktop primary navigation" className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group text-left cursor-pointer ${
                    isActive
                      ? 'bg-maroon-700 text-white shadow-warm-sm translate-x-1'
                      : 'text-warm-ink/80 dark:text-night-ink/80 hover:bg-parchment-200/70 dark:hover:bg-night-100/80 hover:text-maroon-900 dark:hover:text-gold-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-gold-200' : 'text-warm-muted dark:text-night-muted group-hover:text-maroon-700 dark:group-hover:text-gold-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className={`font-tamil text-[10px] font-normal leading-normal ${isActive ? 'text-white/80' : 'text-warm-muted dark:text-night-muted'}`}>
                    {item.tamil}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Proof-to-Progress Motif Banner */}
          <div className="mt-auto pt-6">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-950 text-white text-xs border border-gold-500/30 shadow-warm-md">
              <div className="flex items-center gap-1.5 text-gold-300 font-bold text-[11px] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proof-to-Progress</span>
              </div>
              <p className="text-[11px] text-warm-border/90 leading-relaxed">
                Prove ability with code & physical photos. Unlocks verified opportunities.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('challenges')}
                className="mt-2.5 w-full py-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-maroon-950 font-bold text-[11px] transition-colors cursor-pointer"
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

      {/* Dark Photographic CTA Band with Overlay Text (on non-home views) */}
      {activeTab !== 'home' && (
        <>
          <section className="relative mt-12 bg-maroon-950 text-white overflow-hidden border-t-2 border-gold-500/40">
            <div className="absolute inset-0 bg-[radial-gradient(#B8761A_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Skill-to-Opportunity Engine for Tamil Nadu</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heritage text-white">
                  கற்றனைத் தூறும் அறிவு — <span className="text-gold-400">Prove Your Skills.</span>
                </h2>
                <p className="mt-2 text-sm sm:text-base text-parchment-200/90 leading-relaxed">
                  Whether you are an engineering student in Trichy or a master tailoring artisan in Tiruppur, SkillBridge provides evidence-backed validation that opens doors.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('challenges')}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-maroon-950 font-bold text-sm shadow-warm-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Start Free Proof Challenge
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('passport')}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-maroon-800/80 hover:bg-maroon-800 border border-gold-500/40 text-gold-200 font-semibold text-sm transition-colors cursor-pointer"
                >
                  View Skill Passport
                </button>
              </div>
            </div>
          </section>

          {/* Footer with Heritage Kolam & Civic Details */}
          <footer role="contentinfo" className="bg-parchment-200/80 dark:bg-night-100 border-t border-warm-border/80 dark:border-night-border text-warm-muted dark:text-night-muted text-xs py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-heritage font-bold text-maroon-900 dark:text-gold-300">
                  SkillBridge AI
                </span>
                <span>•</span>
                <span className="font-tamil font-semibold">திறன் பாலம்</span>
                <span>•</span>
                <span className="italic">"Learn a skill. Prove your ability. Unlock your next opportunity."</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <span>No real data stored • Local demo mode</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-maroon-700 dark:text-gold-400">
                  <Heart className="w-3 h-3 fill-current" /> Crafted for Tamil Nadu Learners
                </span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Mobile Bottom Navigation Bar (Fixed for thumb navigation on <lg) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-parchment-50/95 dark:bg-night-card/95 backdrop-blur-md border-t border-warm-border dark:border-night-border px-2 py-1.5 shadow-warm-lg"
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
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer ${
                  isActive
                    ? 'text-maroon-700 dark:text-gold-400 font-bold'
                    : 'text-warm-muted dark:text-night-muted font-medium'
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
