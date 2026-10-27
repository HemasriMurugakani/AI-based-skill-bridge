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
      color: 'text-[#173B67] dark:text-sky-300',
      action: 'Run JD Analyser'
    },
    learn: {
      title: '2. Learn & Practise (பயில்)',
      desc: 'Micro-modules adapted to your daily time. Practice hands-on with real craft and code swatches.',
      color: 'text-[#173B67] dark:text-sky-300',
      action: 'View Roadmap'
    },
    prove: {
      title: '3. Prove (நிரூபி)',
      desc: 'Upload code repositories, take photo reviews with measuring tape/coins, and explain concepts in Tamil or English voice viva.',
      color: 'text-[#10B981] dark:text-emerald-400',
      action: 'Take Proof Challenge'
    },
    adapt: {
      title: '4. Adapt (உயர்)',
      desc: 'The AI re-indexes your pathway based on rubric feedback and upgrades your Skill Passport for direct workplace hiring.',
      color: 'text-[#173B67] dark:text-sky-300',
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
              <span>CIVIC · SKILLS PLATFORM</span>
            </div>

            {/* Tamil Proverb (Avvaiyar) with Italic English Translation */}
            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-night-100/80 border border-sky-100 dark:border-night-border/70 shadow-soft">
              <div className="font-tamil text-sm sm:text-base font-bold text-[#173B67] dark:text-sky-200">
                "கற்றது கை மண் அளவு, கல்லாதது உலகளவு"
              </div>
              <div className="text-xs sm:text-sm italic text-[#526174] dark:text-night-muted mt-0.5">
                "What you have learned is a mere handful of sand; what you haven't learned is the size of the world."
              </div>
            </div>

            {/* Two-Tone Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#173B67] dark:text-white leading-[1.12]">
              Learn a skill. <br />
              <span className="text-[#62B6E8]">
                Prove it. Unlock the next step.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-[#526174] dark:text-night-muted leading-relaxed max-w-xl">
              The AI Skill-to-Opportunity engine bridging academic and vocational talent across Tamil Nadu. Identify precise skill gaps, practice adaptively, prove competence through verifiable code and craft inspections, and match verified opportunities.
            </p>

            {/* "What do you want to become?" Row */}
            <div className="pt-2">
              <div className="text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#62B6E8]" />
                <span>What do you want to become?</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {rolePills.map((pill) => {
                  const isSelected = selectedRolePill === pill.title;
                  return (
                    <button
                      key={pill.title}
                      onClick={() => setSelectedRolePill(pill.title)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#173B67] text-white shadow-soft ring-2 ring-[#62B6E8] scale-105'
                          : 'bg-white dark:bg-night-100 text-[#173B67] dark:text-night-ink border border-sky-100 hover:border-[#62B6E8]'
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
                className="px-6 py-3 rounded-full bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-sm shadow-soft flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Start my journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsJdModalOpen(true)}
                className="px-5 py-3 rounded-full bg-white dark:bg-night-100 border border-sky-200 dark:border-night-border hover:border-[#62B6E8] text-[#173B67] dark:text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4 text-[#62B6E8]" />
                <span>Try the JD analyser</span>
              </button>
            </div>

            {/* Trust Line */}
            <div className="text-[11px] text-[#526174] dark:text-night-muted flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
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
      <section className="p-6 sm:p-8 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-deepblue-950/70 text-[#173B67] dark:text-sky-200 text-xs font-bold uppercase tracking-wider mb-2 border border-[#62B6E8]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />
            <span>The Skill-to-Opportunity Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] dark:text-night-muted mt-1 leading-relaxed">
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
                className={`p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EAF5FC] dark:bg-night-100 border-[#62B6E8] shadow-soft ring-2 ring-[#62B6E8]/40'
                    : 'bg-white dark:bg-night-card border-sky-100 dark:border-night-border hover:bg-[#EAF5FC]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-2xl bg-[#173B67] text-white font-bold text-xs flex items-center justify-center">
                      0{step.step}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#62B6E8]' : 'text-[#526174]'}`} />
                  </div>

                  <h3 className="text-xs font-bold text-[#173B67] dark:text-white">
                    {step.title}
                  </h3>
                  <div className="font-tamil text-[10px] text-[#526174] dark:text-night-muted mt-0.5 line-clamp-1">
                    {step.titleTamil}
                  </div>
                </div>

                <p className="text-[11px] text-[#526174] dark:text-night-muted mt-2 leading-relaxed">
                  {step.summary}
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
                Continuously Adaptive Learning Loop
              </span>
              <h3 className="text-xl font-bold text-[#173B67] dark:text-white mt-0.5">
                The Proof-to-Progress Cycle
              </h3>
              <p className="text-xs text-[#526174] dark:text-night-muted mt-1 leading-relaxed">
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
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#173B67] text-white shadow-soft scale-105'
                        : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 hover:bg-[#D9EFFB]'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-5 rounded-card bg-white dark:bg-night-100/70 border border-[#E2E8F0] dark:border-night-border/70 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className={`text-sm font-bold ${loopDetails[activeLoopStep].color}`}>
                {loopDetails[activeLoopStep].title}
              </h4>
              <p className="text-xs text-[#173B67] dark:text-night-ink mt-1 max-w-2xl leading-relaxed">
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
              className="px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] text-xs font-semibold shadow-soft flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105 cursor-pointer"
            >
              <span>{loopDetails[activeLoopStep].action}</span>
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
            <span>Why SkillBridge Is Different</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            Beyond Standard Courses
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] dark:text-night-muted mt-1 leading-relaxed">
            Most platforms give paper completion certificates. SkillBridge delivers verifiable evidence of ability that employers trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beyondCards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={idx}
                className="p-5 rounded-card bg-[#F8FAFC] dark:bg-night-100/50 border border-[#E2E8F0] dark:border-night-border/70 shadow-xs hover:shadow-soft hover:border-[#62B6E8] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-btn bg-[#EAF5FC] dark:bg-night-card text-[#173B67] dark:text-sky-300 border border-[#BAE6FD]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-night-card text-[#173B67] dark:text-sky-200 border border-[#BAE6FD] uppercase tracking-wide">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#173B67] dark:text-white">
                    {card.title}
                  </h3>
                  <div className="font-tamil text-xs text-[#526174] dark:text-night-muted mt-0.5">
                    {card.titleTamil}
                  </div>

                  <p className="text-xs text-[#526174] dark:text-night-muted mt-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-night-border/50 flex items-center justify-between text-xs">
                  <TrustLabel type="evidence-badge" />
                  <span className="font-semibold text-[#62B6E8] hover:text-[#173B67] transition-colors">Verified →</span>
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
                Real-World Impact
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 border border-[#BAE6FD] uppercase">
                Illustrative Persona Profiles
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
              Learner Stories from Tamil Nadu
            </h2>
          </div>

          <div className="text-xs text-[#526174] max-w-xs">
            Switch persona to test the prototype with different career trajectories and daily time limits.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((p) => {
            const isCurrentActive = p.id === currentPersona.id;

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
                      alt={p.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#62B6E8] shadow-soft shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-[#173B67] dark:text-white">
                        {p.name}
                      </h3>
                      <div className="font-tamil text-xs text-[#526174] dark:text-night-muted">
                        {p.nameTamil}
                      </div>
                      <div className="text-xs text-[#62B6E8] font-bold mt-0.5">
                        {p.tag}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#526174] dark:text-night-muted leading-relaxed line-clamp-3">
                    "{p.bio}"
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-[#EAF5FC]/50 dark:bg-night-card border border-sky-100/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#526174]">District:</span>
                      <span className="font-semibold text-[#173B67] dark:text-night-ink">{p.location.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#526174]">Time available:</span>
                      <span className="font-semibold text-[#10B981]">{p.dailyTimeAvailable}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#526174]">Readiness:</span>
                      <span className="font-bold text-[#173B67] dark:text-sky-300">{p.readinessScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#526174]">Practice Streak:</span>
                      <span className="font-bold text-[#F2B66D]">{p.streakDays} Days</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sky-100/60 dark:border-night-border/60 flex items-center justify-between">
                  <span className="text-[10px] text-[#526174] uppercase">Sample Story</span>
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
      <section className="relative rounded-card bg-gradient-to-br from-[#0B1C33] via-[#173B67] to-[#112C4E] text-white overflow-hidden border-2 border-[#62B6E8]/40 p-8 sm:p-12 shadow-soft">
        {/* Sky geometric radial background */}
        <div className="absolute inset-0 bg-[radial-gradient(#62B6E8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          {/* Tamil Line */}
          <div className="font-tamil text-sm sm:text-base text-[#F2B66D] font-semibold">
            "தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக் கற்றனைத் தூறும் அறிவு"
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to prove your skills and unlock opportunities?
          </h2>

          <p className="text-xs sm:text-sm text-sky-100/90 max-w-xl mx-auto leading-relaxed">
            Join thousands of academic and vocational learners across Tamil Nadu turning hands-on ability into verifiable careers.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="px-6 py-3 rounded-full bg-[#F2B66D] hover:bg-[#e59f45] text-[#173B67] font-extrabold text-sm shadow-soft transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Create Free Account (or Start Free)
            </button>
            <button
              onClick={() => setIsJdModalOpen(true)}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Try JD Analyser Demo
            </button>
          </div>

          <div className="pt-2 text-[11px] text-sky-200/80 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>100% Free for Learners · Zero personal data collection · Open Civic Initiative</span>
          </div>
        </div>
      </section>

      {/* 6. EXTENDED 4-COLUMN FOOTER WITH PLANNED INTEGRATIONS */}
      <footer className="pt-8 pb-4 border-t border-[#E2E8F0] dark:border-night-border/80 text-[#526174] dark:text-night-muted">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
              Learn & Prove
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('roadmap')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Adaptive Roadmaps</button></li>
              <li><button onClick={() => setActiveTab('challenges')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Code Challenges</button></li>
              <li><button onClick={() => setActiveTab('challenges')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Photo Proof for Crafts</button></li>
              <li><button onClick={() => setActiveTab('coach')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Voice Viva in Tamil</button></li>
              <li><button onClick={() => setActiveTab('skills')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Rubric Library</button></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
              Opportunities
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('opportunities')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">District Job Boards</button></li>
              <li><button onClick={() => setActiveTab('opportunities')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Govt NATS Apprenticeships</button></li>
              <li><button onClick={() => setActiveTab('opportunities')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Rural BPO & Tailoring Hubs</button></li>
              <li><button onClick={() => setActiveTab('passport')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Verifiable Skill Passport</button></li>
              <li><button onClick={() => setActiveTab('readiness')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Readiness Scorecards</button></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
              For Employers & Mentors
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('passport')} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Instant QR Verification</button></li>
              <li><button onClick={() => setIsJdModalOpen(true)} className="hover:text-[#62B6E8] dark:hover:text-sky-300 transition-colors">Post Role for JD Parsing</button></li>
              <li><span className="text-slate-400">District Skill Mission Hubs</span></li>
              <li><span className="text-slate-400">Artisan Master Sign-Off</span></li>
              <li><span className="text-slate-400">Evidence-Based Screening</span></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold text-[#173B67] dark:text-white uppercase tracking-wider mb-3">
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
        <div className="pt-6 border-t border-[#E2E8F0] dark:border-night-border/60 p-4 rounded-card bg-[#EAF5FC]/60 dark:bg-night-100/40 border border-[#BAE6FD] dark:border-night-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#173B67] dark:text-white">
              Planned Civic & National Integrations:
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
              Planned
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
