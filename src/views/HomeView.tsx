import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { KolamDivider } from '../components/KolamDivider';
import { IndiaSkillsMap } from '../components/IndiaSkillsMap';
import { LiveProofTicker } from '../components/LiveProofTicker';
import { JdAnalyserModal } from '../components/JdAnalyserModal';
import { SkillChip } from '../components/SkillChip';
import { ProgressRing } from '../components/ProgressRing';
import { BadgeMedal } from '../components/BadgeMedal';
import { StatusPill } from '../components/StatusPill';
import { TrustLabel } from '../components/TrustLabel';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  FileCheck2,
  Camera,
  Mic,
  Code,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Briefcase,
  UserCheck,
  Info,
  Check
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    getPersona,
    getCurrentPathway,
    setActiveTab,
    badges,
    personas,
    setPersona,
    pathways
  } = useSkillBridgeStore();

  const { t } = useTranslation();
  const currentPersona = getPersona();
  const pathway = getCurrentPathway();

  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [selectedRolePill, setSelectedRolePill] = useState('Web developer');
  const [activePipelineStep, setActivePipelineStep] = useState(1);
  const [activeLoopStep, setActiveLoopStep] = useState<'identify' | 'learn' | 'prove' | 'adapt'>('identify');

  const rolePills = [
    { title: 'Web developer', id: 'junior-web-dev', category: 'academic' },
    { title: 'Tailor', id: 'tailoring-craft', category: 'vocational' },
    { title: 'Electrician', id: 'electrician-trade', category: 'vocational' },
    { title: 'Data analyst', id: 'data-analyst', category: 'academic' },
    { title: 'Designer', id: 'ui-design', category: 'academic' },
    { title: 'Solar Technician', id: 'solar-tech', category: 'vocational' },
    { title: 'Automobile Mechanic', id: 'auto-mechanic', category: 'vocational' },
  ];

  const pipelineSteps = [
    {
      step: 1,
      title: 'Understand Learner',
      titleTamil: 'கற்பவரின் நோக்கத்தை அறிதல்',
      summary: 'Captures your daily time commitment (30-90 mins), local district preference, and baseline skills without tedious logins.',
      icon: Users
    },
    {
      step: 2,
      title: 'Detect Gaps',
      titleTamil: 'திறன் இடைவெளிகளைக் கண்டறிதல்',
      summary: 'Parses live employer job descriptions with Claude AI to extract exact rubric criteria and diagnostic skill deltas.',
      icon: Search
    },
    {
      step: 3,
      title: 'Adaptive Roadmap',
      titleTamil: 'மாறும் வழிகாட்டி வரைபடம்',
      summary: 'Dynamically reorders modules and generates micro-challenges focused strictly on bridging detected skill gaps.',
      icon: Compass
    },
    {
      step: 4,
      title: 'Prove Skills with Real Work',
      titleTamil: 'நடைமுறை சான்றுகளுடன் நிரூபித்தல்',
      summary: 'Submit reproducible code, photo inspections of physical craft, and bilingual voice vivas graded against strict rubrics.',
      icon: Camera
    },
    {
      step: 5,
      title: 'Match Opportunities',
      titleTamil: 'நல்வாய்ப்புகளுடன் இணைத்தல்',
      summary: 'Direct matching with verified district jobs, MSME boutique contracts, and Govt NATS apprenticeships backed by your QR Passport.',
      icon: Briefcase
    }
  ];

  const loopDetails = {
    identify: {
      title: '1. Identify (அறி)',
      desc: 'Benchmark your starting point. Unassessed skills stay strictly neutral ("Not assessed"). Real job requirements are extracted automatically.',
      color: 'text-maroon-700 dark:text-maroon-300',
      action: 'Run JD Analyser'
    },
    learn: {
      title: '2. Learn & Practise (பயில்)',
      desc: 'Micro-modules adapted to your daily time. Practice hands-on with real craft and code swatches.',
      color: 'text-gold-700 dark:text-gold-300',
      action: 'View Roadmap'
    },
    prove: {
      title: '3. Prove (நிரூபி)',
      desc: 'Upload code repositories, take photo reviews with measuring tape/coins, and explain concepts in Tamil or English voice viva.',
      color: 'text-forest-700 dark:text-forest-300',
      action: 'Take Proof Challenge'
    },
    adapt: {
      title: '4. Adapt (உயர்)',
      desc: 'The AI re-indexes your pathway based on rubric feedback and upgrades your Skill Passport for direct workplace hiring.',
      color: 'text-terracotta-700 dark:text-terracotta-300',
      action: 'Check Readiness'
    }
  };

  const beyondCards = [
    {
      title: 'JD Gap Analysis',
      titleTamil: 'வேலை விவர இடைவெளி பகுப்பாய்வு',
      desc: 'Compares your actual verified portfolio against real job descriptions using strict AI parsing—not a generic course syllabus.',
      icon: Search,
      badge: 'Zero Fluff'
    },
    {
      title: 'Photo Evidence for Trades',
      titleTamil: 'தொழில்முறை புகைப்பட சான்றுகள்',
      desc: 'Computer vision and rubric models inspect stitch density (10 SPI), seam margins, and wire conduits from your phone camera.',
      icon: Camera,
      badge: 'Vocational First'
    },
    {
      title: 'AI Viva & Voice Defense',
      titleTamil: 'AI வாய்மொழித் தேர்வு முறை',
      desc: 'Answer conversational questions in natural language. Defend your code choices or craft decisions without written exam stress.',
      icon: Mic,
      badge: 'Oral Mastery'
    },
    {
      title: 'Voice & Nuance in Tamil',
      titleTamil: 'தமிழ் மற்றும் தங்கிலீஷ் ஆதரவு',
      desc: 'Rural and local learners explain technical ideas freely in Tamil (தூய தமிழ் அல்லது தங்கிலீஷ்). Language is never a barrier.',
      icon: Sparkles,
      badge: 'Bilingual Civic'
    },
    {
      title: 'Skill Passport with QR',
      titleTamil: 'QR குறியீட்டுடன் கூடிய கடவுச்சீட்டு',
      desc: 'Cryptographically verifiable digital credential with live proof links and rubrics that employers can inspect in one scan.',
      icon: FileCheck2,
      badge: 'Tamper Evident'
    },
    {
      title: 'Mentor Verification Seal',
      titleTamil: 'வழிகாட்டி மற்றும் நிபுணர் சான்றளிப்பு',
      desc: 'Transparent multi-tier trust: AI-reviewed, Mentor-verified, and Pending mentor review. Transparent and honest.',
      icon: ShieldCheck,
      badge: 'Dual Trust'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden p-6 sm:p-8 lg:p-10 rounded-card-lg bg-gradient-to-br from-parchment-100 via-parchment to-parchment-200 dark:from-night-card dark:via-night dark:to-night-100 border border-warm-border/80 dark:border-night-border shadow-warm-md">
        {/* Subtle Heritage Gopuram Silhouette Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5 pointer-events-none select-none flex items-center justify-end overflow-hidden">
          <svg viewBox="0 0 400 400" className="w-full h-full text-maroon-950 dark:text-gold-400" fill="currentColor">
            <path d="M 180 380 L 190 320 L 185 320 L 195 270 L 190 270 L 200 220 L 195 220 L 205 180 L 200 180 L 210 140 L 207 140 L 213 100 L 220 140 L 217 140 L 227 180 L 222 180 L 232 220 L 227 220 L 237 270 L 232 270 L 242 320 L 237 320 L 247 380 Z" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Small Gold Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100/90 dark:bg-gold-950/70 text-gold-900 dark:text-gold-200 border border-gold-300/80 dark:border-gold-700/60 text-xs font-extrabold uppercase tracking-widest shadow-xs">
              <span className="w-2 h-2 rounded-full bg-gold-600 animate-pulse" />
              <span>INDIA · SKILLS PLATFORM</span>
            </div>

            {/* Tamil Proverb (Avvaiyar) with Italic English Translation */}
            <div className="p-3.5 rounded-2xl bg-parchment-200/80 dark:bg-night-100/80 border border-warm-border/70 dark:border-night-border/70 shadow-warm-sm">
              <div className="font-tamil text-sm sm:text-base font-bold text-maroon-900 dark:text-gold-300">
                "கற்றது கை மண் அளவு, கல்லாதது உலகளவு"
              </div>
              <div className="text-xs sm:text-sm italic text-warm-muted dark:text-night-muted mt-0.5">
                "What you have learned is a mere handful of sand; what you haven't learned is the size of the world."
              </div>
            </div>

            {/* Two-Tone Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heritage text-warm-ink dark:text-night-ink leading-[1.12]">
              Learn a skill. <br />
              <span className="gradient-heading-maroon-gold">
                Prove it. Unlock the next step.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-warm-muted dark:text-night-muted leading-relaxed max-w-xl">
              The AI Skill-to-Opportunity engine bridging academic and vocational talent across Tamil Nadu. Identify precise skill gaps, practice adaptively, prove competence through verifiable code and craft inspections, and match verified opportunities.
            </p>

            {/* "What do you want to become?" Row */}
            <div className="pt-2">
              <div className="text-xs font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-maroon-700 dark:text-gold-400" />
                <span>What do you want to become?</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {rolePills.map((pill) => {
                  const isSelected = selectedRolePill === pill.title;
                  return (
                    <button
                      key={pill.title}
                      onClick={() => setSelectedRolePill(pill.title)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-maroon-700 text-white shadow-warm-sm ring-2 ring-gold-400 scale-105'
                          : 'bg-parchment-200/90 dark:bg-night-100 text-warm-ink dark:text-night-ink border border-warm-border/80 hover:border-gold-400'
                      }`}
                    >
                      {pill.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('onboarding')}
                className="px-6 py-3 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-warm-md flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Start my journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsJdModalOpen(true)}
                className="px-5 py-3 rounded-full bg-parchment-200/90 dark:bg-night-100 border border-warm-border dark:border-night-border hover:border-gold-400 text-warm-ink dark:text-night-ink font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
                <span>Try the JD analyser</span>
              </button>
            </div>

            {/* Trust Line */}
            <div className="text-[11px] text-warm-subtle dark:text-night-muted flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
              <span>No login needed · No personal data · Works completely offline or with live AI</span>
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
      <section className="p-6 sm:p-8 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-maroon-100 dark:bg-maroon-950/70 text-maroon-900 dark:text-maroon-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-maroon-700 dark:text-gold-400" />
            <span>The Skill-to-Opportunity Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-warm-muted dark:text-night-muted mt-1 leading-relaxed">
            From initial aspirations to verified employment through real, evidence-backed milestones.
          </p>
        </div>

        {/* 5-Step Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-10">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const isSelected = activePipelineStep === step.step;

            return (
              <div
                key={step.step}
                onClick={() => setActivePipelineStep(step.step)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-parchment-100 dark:bg-night-100 border-gold-400 dark:border-gold-600 shadow-warm-md ring-1 ring-gold-400/50'
                    : 'bg-white/60 dark:bg-night-card border-warm-border/60 hover:bg-parchment-100/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-xl bg-maroon-700 text-white font-bold text-xs flex items-center justify-center">
                      0{step.step}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-maroon-700 dark:text-gold-400' : 'text-warm-muted'}`} />
                  </div>

                  <h3 className="text-xs font-bold text-warm-ink dark:text-night-ink">
                    {step.title}
                  </h3>
                  <div className="font-tamil text-[10px] text-warm-muted dark:text-night-muted mt-0.5 line-clamp-1">
                    {step.titleTamil}
                  </div>
                </div>

                <p className="text-[11px] text-warm-muted dark:text-night-muted mt-2 leading-relaxed">
                  {step.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Circular Proof-to-Progress Loop (Interactive) */}
        <div className="pt-6 border-t border-warm-border/60 dark:border-night-border/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
                Continuously Adaptive Learning Loop
              </span>
              <h3 className="text-xl font-bold font-heritage text-warm-ink dark:text-night-ink mt-0.5">
                The Proof-to-Progress Cycle
              </h3>
              <p className="text-xs text-warm-muted dark:text-night-muted mt-1 leading-relaxed">
                Click any stage of the cycle to see how learning continuously verifies ability and adapts to employer expectations.
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
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-maroon-700 text-white shadow-warm-sm scale-105'
                        : 'bg-parchment-200 dark:bg-night-100 text-warm-muted hover:text-warm-ink'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-parchment-100/70 dark:bg-night-100/70 border border-warm-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className={`text-sm font-bold ${loopDetails[activeLoopStep].color}`}>
                {loopDetails[activeLoopStep].title}
              </h4>
              <p className="text-xs text-warm-ink dark:text-night-ink mt-1 max-w-2xl leading-relaxed">
                {loopDetails[activeLoopStep].desc}
              </p>
            </div>

            <button
              onClick={() => {
                if (activeLoopStep === 'identify') setIsJdModalOpen(true);
                else if (activeLoopStep === 'learn') setActiveTab('roadmap');
                else if (activeLoopStep === 'prove') setActiveTab('challenges');
                else setActiveTab('readiness');
              }}
              className="px-4 py-2 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-bold shadow-warm-sm flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105 cursor-pointer"
            >
              <span>{loopDetails[activeLoopStep].action}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION: BEYOND COURSES (6 Rich Distinction Cards) */}
      <section className="p-6 sm:p-8 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950 text-gold-900 dark:text-gold-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-gold-600" />
            <span>Why SkillBridge Is Different</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
            Beyond Standard Courses
          </h2>
          <p className="text-xs sm:text-sm text-warm-muted dark:text-night-muted mt-1 leading-relaxed">
            Most platforms give paper completion certificates. SkillBridge delivers verifiable evidence of ability that employers trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beyondCards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-parchment-100/60 dark:bg-night-100/50 border border-warm-border/70 dark:border-night-border/70 shadow-xs hover:shadow-warm-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-parchment-200 dark:bg-night-card text-maroon-700 dark:text-gold-400 border border-warm-border/60">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-200/60 dark:bg-gold-950 text-gold-900 dark:text-gold-300 border border-gold-300/50 uppercase">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-warm-ink dark:text-night-ink">
                    {card.title}
                  </h3>
                  <div className="font-tamil text-xs text-warm-muted dark:text-night-muted mt-0.5">
                    {card.titleTamil}
                  </div>

                  <p className="text-xs text-warm-muted dark:text-night-muted mt-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-warm-border/50 dark:border-night-border/50 flex items-center justify-between text-xs">
                  <TrustLabel type="evidence-badge" />
                  <span className="font-bold text-maroon-700 dark:text-gold-400">Verified →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION: LEARNER STORIES (3 Personas, Labelled "Illustrative") */}
      <section className="p-6 sm:p-8 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
                Real-World Impact
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warm-200 dark:bg-night-100 text-warm-muted uppercase">
                Illustrative Persona Profiles
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
              Learner Stories from Tamil Nadu
            </h2>
          </div>

          <div className="text-xs text-warm-muted max-w-xs">
            Switch persona to test the prototype with different career trajectories and daily time limits.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((p) => {
            const isCurrentActive = p.id === currentPersona.id;

            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isCurrentActive
                    ? 'bg-parchment-100 dark:bg-night-100 border-gold-400 dark:border-gold-600 shadow-warm-md ring-2 ring-gold-400/40'
                    : 'bg-white/70 dark:bg-night-card border-warm-border/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-gold-400 shadow-warm-sm shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-warm-ink dark:text-night-ink">
                        {p.name}
                      </h3>
                      <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
                        {p.nameTamil}
                      </div>
                      <div className="text-xs text-maroon-700 dark:text-gold-400 font-semibold mt-0.5">
                        {p.tag}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-warm-muted dark:text-night-muted leading-relaxed line-clamp-3">
                    "{p.bio}"
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-parchment-200/70 dark:bg-night-card border border-warm-border/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-warm-muted">District:</span>
                      <span className="font-semibold text-warm-ink dark:text-night-ink">{p.location.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-warm-muted">Time available:</span>
                      <span className="font-semibold text-forest-700 dark:text-forest-400">{p.dailyTimeAvailable}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-warm-muted">Readiness:</span>
                      <span className="font-bold text-maroon-800 dark:text-gold-400">{p.readinessScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-warm-muted">Practice Streak:</span>
                      <span className="font-bold text-terracotta-700 dark:text-terracotta-400">{p.streakDays} Days</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-warm-border/60 flex items-center justify-between">
                  <span className="text-[10px] text-warm-subtle uppercase">Sample Story</span>
                  <button
                    onClick={() => {
                      setPersona(p.id);
                      setActiveTab('passport');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isCurrentActive
                        ? 'bg-maroon-700 text-white shadow-xs'
                        : 'bg-parchment-200 dark:bg-night-card text-warm-ink hover:bg-gold-100'
                    }`}
                  >
                    <span>{isCurrentActive ? 'Active Profile' : 'Test This Profile'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DARK PHOTOGRAPHIC CTA BAND */}
      <section className="relative rounded-card-lg bg-maroon-950 text-white overflow-hidden border-2 border-gold-500/50 p-8 sm:p-12 shadow-warm-lg">
        {/* Kolam geometric radial background */}
        <div className="absolute inset-0 bg-[radial-gradient(#E8B23A_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          {/* Tamil Line */}
          <div className="font-tamil text-sm sm:text-base text-gold-300 font-semibold">
            "தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக் கற்றனைத் தூறும் அறிவு"
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-heritage text-white">
            Ready to prove your skills and unlock opportunities?
          </h2>

          <p className="text-xs sm:text-sm text-parchment-200/90 max-w-xl mx-auto leading-relaxed">
            Join thousands of academic and vocational learners across Tamil Nadu turning hands-on ability into verifiable careers.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-maroon-950 font-extrabold text-sm shadow-warm-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Create Free Account (or Start Free)
            </button>
            <button
              onClick={() => setIsJdModalOpen(true)}
              className="px-6 py-3 rounded-full bg-maroon-800/90 hover:bg-maroon-800 border border-gold-400/50 text-gold-200 font-bold text-sm transition-colors cursor-pointer"
            >
              Try JD Analyser Demo
            </button>
          </div>

          <div className="pt-2 text-[11px] text-warm-subtle flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-400" />
            <span>100% Free for Learners · Zero personal data collection · Open Civic Initiative</span>
          </div>
        </div>
      </section>

      {/* 6. EXTENDED 4-COLUMN FOOTER WITH PLANNED INTEGRATIONS */}
      <footer className="pt-8 pb-4 border-t border-warm-border/80 dark:border-night-border/80 text-warm-muted dark:text-night-muted">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-3">
              Learn & Prove
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('roadmap')} className="hover:text-maroon-700 dark:hover:text-gold-300">Adaptive Roadmaps</button></li>
              <li><button onClick={() => setActiveTab('challenges')} className="hover:text-maroon-700 dark:hover:text-gold-300">Code Challenges</button></li>
              <li><button onClick={() => setActiveTab('challenges')} className="hover:text-maroon-700 dark:hover:text-gold-300">Photo Proof for Crafts</button></li>
              <li><button onClick={() => setActiveTab('coach')} className="hover:text-maroon-700 dark:hover:text-gold-300">Voice Viva in Tamil</button></li>
              <li><button onClick={() => setActiveTab('skills')} className="hover:text-maroon-700 dark:hover:text-gold-300">Rubric Library</button></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-3">
              Opportunities
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('opportunities')} className="hover:text-maroon-700 dark:hover:text-gold-300">District Job Boards</button></li>
              <li><button onClick={() => setActiveTab('opportunities')} className="hover:text-maroon-700 dark:hover:text-gold-300">Govt NATS Apprenticeships</button></li>
              <li><button onClick={() => setActiveTab('opportunities')} className="hover:text-maroon-700 dark:hover:text-gold-300">Rural BPO & Tailoring Hubs</button></li>
              <li><button onClick={() => setActiveTab('passport')} className="hover:text-maroon-700 dark:hover:text-gold-300">Verifiable Skill Passport</button></li>
              <li><button onClick={() => setActiveTab('readiness')} className="hover:text-maroon-700 dark:hover:text-gold-300">Readiness Scorecards</button></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-3">
              For Employers & Mentors
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('passport')} className="hover:text-maroon-700 dark:hover:text-gold-300">Instant QR Verification</button></li>
              <li><button onClick={() => setIsJdModalOpen(true)} className="hover:text-maroon-700 dark:hover:text-gold-300">Post Role for JD Parsing</button></li>
              <li><span className="text-warm-subtle">District Skill Mission Hubs</span></li>
              <li><span className="text-warm-subtle">Artisan Master Sign-Off</span></li>
              <li><span className="text-warm-subtle">Evidence-Based Screening</span></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-3">
              Explore & Heritage
            </h4>
            <ul className="space-y-2">
              <li><span className="font-tamil">காஞ்சிபுரம் பட்டு நெசவு</span></li>
              <li><span className="font-tamil">சுவாமிமலை வெண்கலச் சிற்பம்</span></li>
              <li><span className="font-tamil">சேலம் வெண்பட்டு கைவினை</span></li>
              <li><span className="font-tamil">திருப்பூர் பின்னலாடை கலை</span></li>
              <li><span className="font-tamil">மதுரை சுங்குடிச் சேலை</span></li>
            </ul>
          </div>
        </div>

        {/* Planned Integrations Banner */}
        <div className="pt-6 border-t border-warm-border/60 dark:border-night-border/60 p-4 rounded-2xl bg-parchment-200/50 dark:bg-night-100/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-warm-ink dark:text-night-ink">
              Planned Civic & National Integrations:
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/40">
              Planned
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-warm-ink dark:text-night-ink">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" /> DigiLocker
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" /> Open Badges 3.0
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" /> Skill India Digital
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" /> NAPS / NATS Portal
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
