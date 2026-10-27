import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { JdAnalyserModal } from '../components/JdAnalyserModal';
import { StatusPill } from '../components/StatusPill';
import { TrustLabel } from '../components/TrustLabel';
import { IndiaSkillsMap } from '../components/IndiaSkillsMap';
import { LiveProofTicker } from '../components/LiveProofTicker';
import {
  Compass,
  Search,
  Camera,
  Mic,
  Award,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Briefcase,
  FileCheck2,
  CheckCircle2,
  Lock,
  Code
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    getPersona,
    getCurrentPathway,
    setActiveTab,
    personas,
    setPersona
  } = useSkillBridgeStore();

  const { t, i18n } = useTranslation();
  const currentPersona = getPersona();
  const pathway = getCurrentPathway();
  const currentLang = i18n.language || 'en';
  const isTa = currentLang === 'ta';

  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [selectedRolePill, setSelectedRolePill] = useState('webDev');
  const [activePipelineStep, setActivePipelineStep] = useState(1);
  const [activeLoopStep, setActiveLoopStep] = useState<'identify' | 'learn' | 'prove' | 'adapt'>('identify');

  const rolePills = [
    { key: 'webDev', id: 'junior-web-dev', category: 'academic' },
    { key: 'tailor', id: 'tailoring-craft', category: 'vocational' },
    { key: 'electrician', id: 'electrician-trade', category: 'vocational' },
    { key: 'dataAnalyst', id: 'data-analyst', category: 'academic' },
    { key: 'designer', id: 'ui-design', category: 'academic' },
    { key: 'solarTech', id: 'solar-tech', category: 'vocational' },
    { key: 'autoMechanic', id: 'auto-mechanic', category: 'vocational' },
  ];

  const pipelineIcons = [Users, Search, Compass, Camera, Briefcase];

  const beyondCardConfigs = [
    { key: 'jdGap' as const, icon: Search },
    { key: 'photoTrade' as const, icon: Camera },
    { key: 'aiViva' as const, icon: Mic },
    { key: 'voiceTamil' as const, icon: Sparkles },
    { key: 'skillPassport' as const, icon: FileCheck2 },
    { key: 'mentorSeal' as const, icon: ShieldCheck },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden p-6 sm:p-8 lg:p-10 rounded-card bg-gradient-to-br from-white via-[#EAF5FC]/70 to-white dark:from-night-card dark:via-night dark:to-night-100 border border-sky-100 dark:border-night-border shadow-soft">
        {/* Subtle Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5 pointer-events-none select-none flex items-center justify-end overflow-hidden">
          <svg viewBox="0 0 400 400" className="w-full h-full text-[#173B67] dark:text-sky-300" fill="currentColor">
            <path d="M 180 380 L 190 320 L 185 320 L 195 270 L 190 270 L 200 220 L 195 220 L 205 180 L 200 180 L 210 140 L 207 140 L 213 100 L 220 140 L 217 140 L 227 180 L 222 180 L 232 220 L 227 220 L 237 270 L 232 270 L 242 320 L 237 320 L 247 380 Z" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FC] dark:bg-deepblue-950/70 text-[#173B67] dark:text-sky-200 border border-[#62B6E8]/40 text-xs font-extrabold uppercase tracking-widest shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#62B6E8] animate-pulse" />
              <span>{t('home:hero.eyebrow')}</span>
            </div>

            {/* Localized Proverb / Motto (Single Language Display) */}
            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-night-100/80 border border-sky-100 dark:border-night-border/70 shadow-soft">
              <div className="text-sm sm:text-base font-bold text-[#173B67] dark:text-sky-200">
                {currentLang === 'ta'
                  ? '"கற்றது கை மண் அளவு, கல்லாதது உலகளவு"'
                  : currentLang === 'fr'
                  ? '"Ce que l\'on sait est une poignée de sable, ce que l\'on ignore est de la taille du monde."'
                  : currentLang === 'hi'
                  ? '"जो हमने सीखा वह मुट्ठी भर रेत है; जो नहीं सीखा वह पूरे संसार के बराबर है।"'
                  : '"What you have learned is a mere handful of sand; what you haven\'t learned is the size of the world."'}
              </div>
              <div className="text-xs text-[#526174] dark:text-night-muted mt-0.5 font-medium">
                {t('brand.motto')}
              </div>
            </div>

            {/* Two-Tone Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#173B67] dark:text-white leading-[1.12]">
              {t('home:hero.headline1')} <br />
              <span className="text-[#62B6E8]">
                {t('home:hero.headline2')}
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-[#526174] dark:text-night-muted leading-relaxed max-w-xl">
              {t('home:hero.subtext')}
            </p>

            {/* "What do you want to become?" Row */}
            <div className="pt-2">
              <div className="text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#62B6E8]" />
                <span>{t('home:hero.whatDoYouWant')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {rolePills.map((pill) => {
                  const isSelected = selectedRolePill === pill.key;
                  return (
                    <button
                      key={pill.key}
                      onClick={() => setSelectedRolePill(pill.key)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#173B67] text-white shadow-soft ring-2 ring-[#62B6E8] scale-105'
                          : 'bg-white dark:bg-night-100 text-[#173B67] dark:text-night-ink border border-sky-100 hover:border-[#62B6E8]'
                      }`}
                    >
                      {t(`home:roles.${pill.key}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('onboarding')}
                className="px-6 py-3 rounded-full bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-sm shadow-soft flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{t('home:hero.startJourney')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsJdModalOpen(true)}
                className="px-5 py-3 rounded-full bg-white dark:bg-night-100 border border-sky-200 dark:border-night-border hover:border-[#62B6E8] text-[#173B67] dark:text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4 text-[#62B6E8]" />
                <span>{t('home:hero.tryJd')}</span>
              </button>
            </div>

            {/* Trust Line */}
            <div className="text-[11px] text-[#526174] dark:text-night-muted flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{t('home:hero.trustLine')}</span>
            </div>
          </div>

          {/* Right Column: Interactive India Skills Map & LIVE Ticker */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <IndiaSkillsMap />
            <LiveProofTicker />
          </div>
        </div>
      </section>

      {/* 2. SECTION: HOW IT WORKS (5-Step Pipeline + Circular Proof-to-Progress Loop) */}
      <section className="p-6 sm:p-8 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-deepblue-950/70 text-[#173B67] dark:text-sky-200 text-xs font-bold uppercase tracking-wider mb-2 border border-[#62B6E8]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />
            <span>{t('home:howItWorks.eyebrow')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            {t('home:howItWorks.title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] dark:text-night-muted mt-1 leading-relaxed">
            {t('home:howItWorks.subtitle')}
          </p>
        </div>

        {/* 5-Step Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-10">
          {[1, 2, 3, 4, 5].map((stepNum) => {
            const Icon = pipelineIcons[stepNum - 1];
            const isSelected = activePipelineStep === stepNum;

            return (
              <div
                key={stepNum}
                onClick={() => setActivePipelineStep(stepNum)}
                className={`p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EAF5FC] dark:bg-night-100 border-[#62B6E8] shadow-soft ring-2 ring-[#62B6E8]/40'
                    : 'bg-white dark:bg-night-card border-sky-100 dark:border-night-border hover:bg-[#EAF5FC]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-2xl bg-[#173B67] text-white font-bold text-xs flex items-center justify-center">
                      0{stepNum}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#62B6E8]' : 'text-[#526174]'}`} />
                  </div>

                  <h3 className="text-xs font-bold text-[#173B67] dark:text-white leading-snug">
                    {t(`home:howItWorks.step${stepNum}Title`)}
                  </h3>
                </div>

                <p className="text-[11px] text-[#526174] dark:text-night-muted mt-2 leading-relaxed">
                  {t(`home:howItWorks.step${stepNum}Summary`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Circular Proof-to-Progress Loop (Interactive) */}
        <div className="pt-6 border-t border-[#E2E8F0] dark:border-night-border/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#62B6E8] dark:text-sky-400">
                {t('home:cycle.eyebrow')}
              </span>
              <h3 className="text-xl font-bold text-[#173B67] dark:text-white mt-0.5">
                {t('home:cycle.title')}
              </h3>
              <p className="text-xs text-[#526174] dark:text-night-muted mt-1 leading-relaxed">
                {t('home:cycle.subtitle')}
              </p>
            </div>

            {/* Interactive Stage Selector Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(['identify', 'learn', 'prove', 'adapt'] as const).map((stage) => {
                const isCurrent = activeLoopStep === stage;
                return (
                  <button
                    key={stage}
                    onClick={() => setActiveLoopStep(stage)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#173B67] text-white shadow-soft scale-105'
                        : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 hover:bg-[#D9EFFB]'
                    }`}
                  >
                    {t(`home:cycle.stages.${stage}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-5 rounded-card bg-white dark:bg-night-100/70 border border-[#E2E8F0] dark:border-night-border/70 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#173B67] dark:text-sky-300">
                {t(`home:cycle.details.${activeLoopStep}Title`)}
              </h4>
              <p className="text-xs text-[#173B67] dark:text-night-ink mt-1 max-w-2xl leading-relaxed">
                {t(`home:cycle.details.${activeLoopStep}Desc`)}
              </p>
            </div>

            <button
              onClick={() => {
                if (activeLoopStep === 'identify') setIsJdModalOpen(true);
                else if (activeLoopStep === 'learn') setActiveTab('roadmap');
                else if (activeLoopStep === 'prove') setActiveTab('challenges');
                else setActiveTab('readiness');
              }}
              className="px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] text-xs font-semibold shadow-soft flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105 cursor-pointer"
            >
              <span>{t(`home:cycle.details.${activeLoopStep}Action`)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION: BEYOND COURSES (6 Rich Distinction Cards) */}
      <section className="p-6 sm:p-8 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5FC] dark:bg-deepblue-950 text-[#173B67] dark:text-sky-200 border border-[#BAE6FD] text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-[#62B6E8]" />
            <span>{t('home:beyondMcq.eyebrow')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            {t('home:beyondMcq.title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] dark:text-night-muted mt-1 leading-relaxed">
            {t('home:beyondMcq.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beyondCardConfigs.map((cfg) => {
            const Icon = cfg.icon;

            return (
              <div
                key={cfg.key}
                className="p-5 rounded-card bg-[#F8FAFC] dark:bg-night-100/50 border border-[#E2E8F0] dark:border-night-border/70 shadow-xs hover:shadow-soft hover:border-[#62B6E8] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-btn bg-[#EAF5FC] dark:bg-night-card text-[#173B67] dark:text-sky-300 border border-[#BAE6FD]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-night-card text-[#173B67] dark:text-sky-200 border border-[#BAE6FD] uppercase tracking-wide">
                      {t(`home:beyondMcq.cards.${cfg.key}.badge`)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#173B67] dark:text-white">
                    {t(`home:beyondMcq.cards.${cfg.key}.title`)}
                  </h3>

                  <p className="text-xs text-[#526174] dark:text-night-muted mt-2 leading-relaxed">
                    {t(`home:beyondMcq.cards.${cfg.key}.desc`)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-night-border/50 flex items-center justify-between text-xs">
                  <TrustLabel type="evidence-badge" />
                  <span className="font-semibold text-[#62B6E8] hover:text-[#173B67] transition-colors">
                    {t('actions.viewDetails')} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION: LEARNER STORIES (3 Personas, Labelled "Illustrative") */}
      <section className="p-6 sm:p-8 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#62B6E8] dark:text-sky-400">
                {t('home:personas.eyebrow')}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 border border-[#BAE6FD] uppercase">
                Illustrative Persona Profiles
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
              {t('home:personas.title')}
            </h2>
          </div>

          <div className="text-xs text-[#526174] max-w-xs">
            {t('home:personas.subtitle')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((p) => {
            const isCurrentActive = p.id === currentPersona.id;
            const displayName = isTa ? p.nameTamil : p.name;
            const displayTag = isTa && p.tagTamil ? p.tagTamil : p.tag;
            const displayBio = isTa && p.bioTamil ? p.bioTamil : p.bio;
            const displayLocation = isTa && p.locationTamil ? p.locationTamil : p.location;

            return (
              <div
                key={p.id}
                className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  isCurrentActive
                    ? 'bg-[#EAF5FC] dark:bg-night-100 border-[#62B6E8] shadow-soft ring-2 ring-[#62B6E8]/40'
                    : 'bg-white dark:bg-night-card border-sky-100 dark:border-night-border'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={p.avatar}
                      alt={displayName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#62B6E8] shadow-soft shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-[#173B67] dark:text-white">
                        {displayName}
                      </h3>
                      <div className="text-xs text-[#62B6E8] font-bold mt-0.5">
                        {displayTag}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#526174] dark:text-night-muted leading-relaxed line-clamp-3">
                    "{displayBio}"
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-[#EAF5FC]/50 dark:bg-night-card border border-sky-100/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#526174]">District:</span>
                      <span className="font-semibold text-[#173B67] dark:text-night-ink">{displayLocation.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#526174]">Time available:</span>
                      <span className="font-semibold text-[#10B981]">{p.dailyTimeAvailable}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#526174]">{t('persona.readiness')}:</span>
                      <span className="font-bold text-[#173B67] dark:text-sky-300">{p.readinessScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#526174]">{t('persona.streak')}:</span>
                      <span className="font-bold text-[#F2B66D]">{p.streakDays} Days</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sky-100/60 dark:border-night-border/60 flex items-center justify-between">
                  <span className="text-[10px] text-[#526174] uppercase">{t('home:personas.sampleStory')}</span>
                  <button
                    onClick={() => {
                      setPersona(p.id);
                      setActiveTab('passport');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isCurrentActive
                        ? 'bg-[#173B67] text-white shadow-xs'
                        : 'bg-[#EAF5FC] dark:bg-night-card text-[#173B67] dark:text-sky-200 hover:bg-sky-100'
                    }`}
                  >
                    <span>{isCurrentActive ? t('home:personas.activeProfile') : t('home:personas.testProfile')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DARK PHOTOGRAPHIC CTA BAND */}
      <section className="relative rounded-card bg-gradient-to-br from-[#0B1C33] via-[#173B67] to-[#112C4E] text-white overflow-hidden border-2 border-[#62B6E8]/40 p-8 sm:p-12 shadow-soft">
        <div className="absolute inset-0 bg-[radial-gradient(#62B6E8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          {/* Localized Quote */}
          <div className="text-sm sm:text-base text-[#F2B66D] font-semibold">
            {currentLang === 'ta'
              ? '"தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக் கற்றனைத் தூறும் அறிவு"'
              : currentLang === 'fr'
              ? '"Comme l\'eau sourd du puits sablonneux à mesure qu\'on creuse, ainsi jaillit le savoir à mesure qu\'on apprend."'
              : currentLang === 'hi'
              ? '"जैसे-जैसे रेत का कुआं खोदा जाता है पानी निकलता है, वैसे ही सीखने से ज्ञान बढ़ता है।"'
              : '"As the sand-well yields water as deep as it is dug, so wisdom flows as deep as one learns."'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t('home:cta.title')}
          </h2>

          <p className="text-xs sm:text-sm text-sky-100/90 max-w-xl mx-auto leading-relaxed">
            {t('home:cta.subtitle')}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="px-6 py-3 rounded-full bg-[#F2B66D] hover:bg-[#e59f45] text-[#173B67] font-extrabold text-sm shadow-soft transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t('home:cta.startFree')}
            </button>
            <button
              onClick={() => setIsJdModalOpen(true)}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {t('home:cta.tryJdDemo')}
            </button>
          </div>

          <div className="pt-2 text-[11px] text-sky-200/80 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>{t('home:cta.trustLine')}</span>
          </div>
        </div>
      </section>

      {/* 6. EXTENDED 4-COLUMN FOOTER WITH PLANNED INTEGRATIONS */}
      <footer className="pt-8 pb-4 border-t border-[#E2E8F0] dark:border-night-border/80 text-[#526174] dark:text-night-muted">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
              {t('home:footer.col1Title')}
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('roadmap')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col1Links.roadmaps')}</button></li>
              <li><button onClick={() => setActiveTab('challenges')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col1Links.challenges')}</button></li>
              <li><button onClick={() => setActiveTab('challenges')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col1Links.photoInspection')}</button></li>
              <li><button onClick={() => setActiveTab('coach')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col1Links.oralViva')}</button></li>
              <li><button onClick={() => setActiveTab('passport')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col1Links.passports')}</button></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
              {t('home:footer.col2Title')}
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('gap-analysis')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col2Links.jdAnalysis')}</button></li>
              <li><button onClick={() => setActiveTab('opportunities')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col2Links.opportunities')}</button></li>
              <li><button onClick={() => setActiveTab('opportunities')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col2Links.boutiques')}</button></li>
              <li><button onClick={() => setActiveTab('opportunities')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col2Links.nats')}</button></li>
              <li><button onClick={() => setActiveTab('resume')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col2Links.resume')}</button></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
              {t('home:footer.col3Title')}
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('institution')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col3Links.institutionHub')}</button></li>
              <li><button onClick={() => setActiveTab('home')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col3Links.districtMaps')}</button></li>
              <li><button onClick={() => setActiveTab('home')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col3Links.lowData')}</button></li>
              <li><button onClick={() => setActiveTab('home')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">{t('home:footer.col3Links.offlineEngine')}</button></li>
              <li><span className="text-slate-400">{t('home:footer.col3Links.zeroTracking')}</span></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
              {t('home:footer.col4Title')}
            </h4>
            <ul className="space-y-2">
              <li><span>{t('home:footer.col4Links.kanchipuram')}</span></li>
              <li><span>{t('home:footer.col4Links.swamimalai')}</span></li>
              <li><span>{t('home:footer.col4Links.salem')}</span></li>
              <li><span>{t('home:footer.col4Links.tiruppur')}</span></li>
              <li><span>{t('home:footer.col4Links.madurai')}</span></li>
            </ul>
          </div>
        </div>

        {/* Planned Integrations Banner */}
        <div className="pt-6 border-t border-[#E2E8F0] dark:border-night-border/60 p-4 rounded-card bg-[#EAF5FC]/60 dark:bg-night-100/40 border border-[#BAE6FD] dark:border-night-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#173B67] dark:text-white">
              {isTa ? 'திட்டமிடப்பட்ட குடிமை & தேசிய இணைப்புகள்:' : 'Planned Civic & National Integrations:'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
              {isTa ? 'திட்டமிடப்பட்டது' : 'Planned'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#173B67] dark:text-white">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#62B6E8]" /> DigiLocker
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#62B6E8]" /> Open Badges 3.0
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#62B6E8]" /> Skill India Digital
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#62B6E8]" /> NAPS / NATS Portal
            </span>
          </div>
        </div>
      </footer>

      {/* JD Analyser Modal */}
      <JdAnalyserModal
        isOpen={isJdModalOpen}
        onClose={() => setIsJdModalOpen(false)}
        onNavigateToRoadmap={() => {
          setIsJdModalOpen(false);
          setActiveTab('roadmap');
        }}
      />
    </div>
  );
};
