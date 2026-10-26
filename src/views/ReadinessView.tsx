import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { ProgressRing } from '../components/ProgressRing';
import { calculateReadiness } from '../utils/readinessCalculator';
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Calculator,
  RotateCcw,
  ShieldCheck,
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Target,
  Mic,
  Code,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';

export const ReadinessView: React.FC = () => {
  const {
    getPersona,
    getCurrentPathway,
    challenges,
    vivaRecords,
    streakHistory,
    setActiveTab,
    language
  } = useSkillBridgeStore();

  const persona = getPersona();
  const pathway = getCurrentPathway();

  // Expanded formula states
  const [isOverallFormulaOpen, setIsOverallFormulaOpen] = useState(false);
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});

  // What-If Simulation State
  const [activeSimulations, setActiveSimulations] = useState<string[]>([]);
  const [isGuidanceDisclaimerOpen, setIsGuidanceDisclaimerOpen] = useState(false);

  // Compute readiness deterministically
  const readiness = calculateReadiness(
    persona,
    pathway,
    challenges,
    vivaRecords,
    activeSimulations
  );

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRowIds(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const toggleSimulation = (scenarioId: string) => {
    setActiveSimulations(prev =>
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const resetSimulations = () => {
    setActiveSimulations([]);
  };

  const handleStartChallenge = (challengeId: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/challenges/${challengeId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setActiveTab('challenges');
  };

  const isTamil = language === 'ta';

  return (
    <div className="space-y-7 animate-in fade-in duration-300 max-w-6xl mx-auto pb-12">
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER & TRANSPARENCY NOTICE */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 sm:p-7 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon-100 dark:bg-maroon-950/80 text-maroon-800 dark:text-gold-300 border border-maroon-200 dark:border-maroon-800/60">
                {isTamil ? 'வேலைத்தள தயார்நிலை குறியீடு' : 'Workplace Readiness Index'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 border border-forest-200 dark:border-forest-800/60 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isTamil ? 'சான்று அடிப்படையிலானது' : '100% Evidence-Backed'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
              {isTamil ? 'முழுமையான வெளிப்படையான தயார்நிலை' : 'Transparent Workplace Readiness'}
            </h1>

            <p className="text-xs sm:text-sm text-warm-muted dark:text-night-muted max-w-2xl leading-relaxed">
              {isTamil
                ? 'மறைக்கப்பட்ட சூத்திரங்கள் அல்லது தன்னிச்சையான சதவீதங்கள் இல்லை. உங்கள் சமர்ப்பிக்கப்பட்ட குறியீடு, மதிப்பீடுகள், திட்டப்பணிகள் மற்றும் வாய்மொழி பதில்களின் அடிப்படையில் மட்டுமே கணக்கிடப்படுகிறது.'
                : 'Zero unexplained percentages. Every score is directly derived from concrete counts of verified skill rubrics, passed assessments, multi-file code submissions, and authenticated oral defenses.'}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-warm-muted dark:text-night-muted">
              <span className="font-semibold text-warm-ink dark:text-night-ink">
                {isTamil ? 'தற்போதைய பயனர்:' : 'Active Learner:'} {isTamil ? persona.nameTamil : persona.name}
              </span>
              <span>•</span>
              <span className="text-maroon-700 dark:text-gold-400 font-medium">
                {isTamil ? pathway.titleTamil : pathway.title}
              </span>
              <span>•</span>
              <span className="italic">{persona.location}</span>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-row lg:flex-col items-center justify-around lg:justify-center p-4 rounded-xl bg-parchment-200/60 dark:bg-night-100/60 border border-warm-border/60 dark:border-night-border min-w-[220px]">
            <div className="text-center">
              <div className="text-xs uppercase font-bold text-warm-muted dark:text-night-muted">
                {isTamil ? 'நிரூபிக்கப்பட்ட சான்றுகள்' : 'Verified Proofs'}
              </div>
              <div className="text-2xl font-extrabold font-heritage text-maroon-700 dark:text-gold-400 mt-0.5">
                {readiness.components[0].count + readiness.components[1].count + readiness.components[2].count}
              </div>
            </div>
            <div className="h-8 w-px bg-warm-border dark:bg-night-border lg:w-full lg:h-px lg:my-2" />
            <div className="text-center">
              <div className="text-xs uppercase font-bold text-warm-muted dark:text-night-muted">
                {isTamil ? 'நிலுவை தேவைகள்' : 'Missing Criteria'}
              </div>
              <div className="text-2xl font-extrabold font-heritage text-terracotta-700 dark:text-terracotta-400 mt-0.5">
                {readiness.components[4].count}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. OVERALL GUIDANCE INDICATOR CARD (STRICT REQUIREMENT) */}
      {/* ------------------------------------------------------------------ */}
      <section className="p-6 sm:p-7 rounded-card-lg bg-gradient-to-br from-parchment-50 to-parchment-100 dark:from-night-card dark:to-night-100 border-2 border-gold-300/80 dark:border-gold-800/60 shadow-warm-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Title, Required Disclaimer Label, and Weights */}
          <div className="space-y-3 flex-1">
            {/* MANDATORY LABEL: "Guidance, not a guarantee of employment" */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-100 dark:bg-gold-950/80 border border-gold-300 dark:border-gold-700/60 text-gold-900 dark:text-gold-200">
              <ShieldCheck className="w-4 h-4 text-gold-700 dark:text-gold-400 shrink-0" />
              <span className="text-xs font-bold tracking-wide">
                {isTamil ? 'வழிகாட்டல் மட்டுமே, வேலை உத்தரவாதம் அல்ல' : 'Guidance, not a guarantee of employment'}
              </span>
              <button
                type="button"
                onClick={() => setIsGuidanceDisclaimerOpen(!isGuidanceDisclaimerOpen)}
                className="ml-1 text-gold-700 dark:text-gold-300 hover:text-gold-900 p-0.5 rounded cursor-pointer"
                title="Read full guidance disclaimer"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Disclaimer modal / expandable banner */}
            {isGuidanceDisclaimerOpen && (
              <div className="p-3.5 rounded-xl bg-gold-50/90 dark:bg-gold-950/40 border border-gold-200 dark:border-gold-800/60 text-xs text-warm-ink dark:text-night-ink animate-in fade-in duration-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-gold-800 dark:text-gold-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Fairness & Transparency Policy</span>
                </div>
                <p className="text-warm-muted dark:text-night-muted leading-relaxed">
                  This readiness index is a self-assessment feedback tool based solely on your verifiable rubric proofs, submitted PRs, and oral defenses. It is designed to guide your daily practice and prepare you for technical interviews. It is <strong>never</strong> a promise, guarantee, or contractual offer of hiring or employment by any company or institution.
                </p>
              </div>
            )}

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                {isTamil ? 'ஒட்டுமொத்த தயார்நிலை வழிகாட்டி' : 'Overall Readiness Guidance Indicator'}
              </h2>
              <p className="text-xs text-warm-muted dark:text-night-muted mt-1 max-w-xl">
                {isTamil
                  ? 'கீழே உள்ள 5 கூறுகளின் எடையிடப்பட்ட கூட்டல் மட்டுமே இந்த மதிப்பெண்ணை உருவாக்குகிறது:'
                  : 'Computed exclusively as the weighted sum of your 5 verified components. All component weights are fully transparent:'}
              </p>
            </div>

            {/* DISPLAY WEIGHTS CLEARLY (STRICT REQUIREMENT) */}
            <div className="pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-warm-muted dark:text-night-muted mb-2">
                {isTamil ? 'கூறு எடைகள் (மொத்தம் 100%):' : 'Component Weights (Sum = 100%):'}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-parchment-200/90 dark:bg-night-50 border border-warm-border dark:border-night-border font-medium text-warm-ink dark:text-night-ink">
                  {isTamil ? 'திறன்கள்' : 'Skills'}: <strong className="text-maroon-700 dark:text-gold-400">30%</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-parchment-200/90 dark:bg-night-50 border border-warm-border dark:border-night-border font-medium text-warm-ink dark:text-night-ink">
                  {isTamil ? 'திட்டப்பணிகள்' : 'Projects'}: <strong className="text-forest-700 dark:text-forest-400">25%</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-parchment-200/90 dark:bg-night-50 border border-warm-border dark:border-night-border font-medium text-warm-ink dark:text-night-ink">
                  {isTamil ? 'தேர்வுகள்' : 'Assessments'}: <strong className="text-gold-700 dark:text-gold-400">20%</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-parchment-200/90 dark:bg-night-50 border border-warm-border dark:border-night-border font-medium text-warm-ink dark:text-night-ink">
                  {isTamil ? 'தகவல்தொடர்பு' : 'Communication'}: <strong className="text-terracotta-700 dark:text-terracotta-400">15%</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-parchment-200/90 dark:bg-night-50 border border-warm-border dark:border-night-border font-medium text-warm-ink dark:text-night-ink">
                  {isTamil ? 'மைல்கற்கள்' : 'Requirements'}: <strong className="text-warm-ink dark:text-night-ink">10%</strong>
                </span>
              </div>
            </div>

            {/* Expandable "How is this calculated?" for Overall Guidance */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsOverallFormulaOpen(!isOverallFormulaOpen)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon-700 dark:text-gold-400 hover:text-maroon-900 dark:hover:text-gold-300 underline underline-offset-4 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>
                  {isOverallFormulaOpen
                    ? (isTamil ? 'கணக்கீட்டு சூத்திரத்தை மறைக்க' : 'Hide overall formula breakdown')
                    : (isTamil ? 'ஒட்டுமொத்த சூத்திரம் எவ்வாறு கணக்கிடப்படுகிறது?' : 'How is this calculated? (View exact formula)')}
                </span>
                {isOverallFormulaOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Right Column: Visual Gauge & Score */}
          <div id="readiness-hero-ring" className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-parchment-100 dark:bg-night-card border border-warm-border dark:border-night-border shrink-0 text-center">
            <ProgressRing
              progress={readiness.overallScore}
              size={140}
              strokeWidth={11}
              label={readiness.isSimulated ? (isTamil ? 'மாதிரி' : 'Simulated') : (isTamil ? 'வழிகாட்டல்' : 'Guidance')}
              sublabel={readiness.overallScore >= 70 ? (isTamil ? 'தயார்நிலை' : 'Benchmark Near') : (isTamil ? 'வளர்ச்சி' : 'In Progress')}
            />

            {readiness.isSimulated && (
              <div className="mt-2 text-xs font-bold text-forest-700 dark:text-forest-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>
                  +{readiness.overallScore - readiness.baseOverallScore}% {isTamil ? 'அதிகரிப்பு' : 'projected gain'}
                </span>
              </div>
            )}

            <div className="text-[11px] text-warm-muted dark:text-night-muted mt-1 max-w-[150px]">
              {isTamil ? 'எடையிடப்பட்ட கலவை' : 'Weighted composite indicator'}
            </div>
          </div>
        </div>

        {/* EXPANDABLE OVERALL FORMULA SECTION */}
        {isOverallFormulaOpen && (
          <div className="mt-5 pt-5 border-t border-warm-border/80 dark:border-night-border animate-in fade-in duration-200 space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
              <h4 className="text-xs sm:text-sm font-bold text-warm-ink dark:text-night-ink">
                {isTamil ? 'கணித சூத்திரம் மற்றும் மாற்று எண்கள்' : 'Exact Formula & Arithmetic Substitution'}
              </h4>
            </div>

            {/* Formula Block */}
            <div className="p-3.5 rounded-xl bg-parchment-200/90 dark:bg-night-100 font-mono text-xs text-warm-ink dark:text-night-ink border border-warm-border/60 dark:border-night-border space-y-2 overflow-x-auto">
              <div className="text-warm-muted dark:text-night-muted">
                // 1. General Algebraic Formula
              </div>
              <div className="font-semibold text-maroon-800 dark:text-gold-300">
                {readiness.formulaSummary.formula}
              </div>

              <div className="text-warm-muted dark:text-night-muted pt-1">
                // 2. Exact Substitution of Your Current Numbers
              </div>
              <div className="text-warm-ink dark:text-night-ink">
                = {readiness.formulaSummary.substitution}
              </div>

              <div className="text-warm-muted dark:text-night-muted pt-1">
                // 3. Term Contributions & Final Sum
              </div>
              <div className="font-bold text-forest-700 dark:text-forest-400 text-sm">
                = {readiness.formulaSummary.result}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
              {readiness.components.map(comp => (
                <div
                  key={comp.id}
                  className="p-2.5 rounded-lg bg-parchment-100 dark:bg-night-card border border-warm-border/60 dark:border-night-border"
                >
                  <div className="font-bold text-warm-ink dark:text-night-ink truncate">
                    {comp.title}
                  </div>
                  <div className="text-warm-muted dark:text-night-muted">
                    {comp.percentage}% × {comp.weightPercentage}%
                  </div>
                  <div className="text-xs font-extrabold text-maroon-700 dark:text-gold-400 mt-1">
                    +{comp.weightedContribution} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. "YOUR NEXT STEP" CARD IN PLAIN LANGUAGE (STRICT REQUIREMENT) */}
      {/* ------------------------------------------------------------------ */}
      <section className="p-6 sm:p-7 rounded-card-lg bg-gradient-to-r from-forest-50/90 via-parchment-50 to-gold-50/60 dark:from-night-card dark:via-night-card dark:to-forest-950/30 border-2 border-forest-300/80 dark:border-forest-800/60 shadow-warm-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-forest-300 border border-forest-200 dark:border-forest-800/60 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>{isTamil ? 'உங்கள் அடுத்த சிறந்த நடவடிக்கை' : 'Your Next Highest-Impact Step'}</span>
              </span>
              <span className="text-xs font-semibold text-warm-muted dark:text-night-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{readiness.nextStep.timeEstimate}</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
              {isTamil ? readiness.nextStep.plainLanguageTitleTamil : readiness.nextStep.plainLanguageTitle}
            </h3>

            {/* Plain language explanation */}
            <p className="text-xs sm:text-sm text-warm-muted dark:text-night-muted leading-relaxed">
              {isTamil ? readiness.nextStep.plainLanguageSummaryTamil : readiness.nextStep.plainLanguageSummary}
            </p>

            {/* Why it matters in plain language */}
            <div className="p-3.5 rounded-xl bg-parchment-200/80 dark:bg-night-100/70 border border-warm-border/60 dark:border-night-border text-xs space-y-1.5">
              <div className="font-bold text-warm-ink dark:text-night-ink flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                <span>{isTamil ? 'இது ஏன் முக்கியமானது (எளிய வார்த்தைகளில்):' : 'Why this matters (in plain words):'}</span>
              </div>
              <p className="text-warm-muted dark:text-night-muted leading-relaxed">
                {isTamil ? readiness.nextStep.whyItMattersTamil : readiness.nextStep.whyItMatters}
              </p>
            </div>

            {/* Expected outcome pill */}
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <span className="font-bold text-forest-700 dark:text-forest-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>+{readiness.nextStep.impactGain}% {isTamil ? 'உடனடி தயார்நிலை உயர்வு' : 'Readiness Gain'}</span>
              </span>
              <span>•</span>
              <span className="text-warm-muted dark:text-night-muted">
                {isTamil ? readiness.nextStep.expectedOutcomeTamil : readiness.nextStep.expectedOutcome}
              </span>
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0 min-w-[210px]">
            <button
              type="button"
              onClick={() => handleStartChallenge(readiness.nextStep.challengeId)}
              className="px-5 py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm shadow-warm-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isTamil ? 'சவாலை தொடங்குக →' : 'Start Next Step Now →'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSimulation('sim-complete-js-challenge')}
              className={`px-4 py-2.5 rounded-xl border font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSimulations.includes('sim-complete-js-challenge')
                  ? 'bg-gold-100 dark:bg-gold-950/80 border-gold-400 text-gold-900 dark:text-gold-200'
                  : 'bg-parchment-100 dark:bg-night-100 border-warm-border dark:border-night-border text-warm-ink dark:text-night-ink hover:bg-parchment-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
              <span>
                {activeSimulations.includes('sim-complete-js-challenge')
                  ? (isTamil ? 'மாதிரி இயக்கத்தில் உள்ளது' : 'Simulating in What-If')
                  : (isTamil ? 'மாதிரி உருவகப்படுத்துக' : 'Simulate in What-If')}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. WHAT-IF SIMULATOR ("complete JS challenge" -> see changes) */}
      {/* ------------------------------------------------------------------ */}
      <section className="p-6 sm:p-7 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gold-100 dark:bg-gold-950/80 text-gold-700 dark:text-gold-300">
                <Zap className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold font-heritage text-warm-ink dark:text-night-ink">
                {isTamil ? 'என்ன நடக்கும்? மாதிரி உருவகப்படுத்துதல்' : 'What-If Simulator: Preview Impact on Exact Formulas'}
              </h3>
            </div>
            <p className="text-xs text-warm-muted dark:text-night-muted mt-1">
              {isTamil
                ? 'நேரத்தை செலவழிக்கும் முன் செயல்களின் தாக்கத்தை சோதிக்கவும். கீழேயுள்ள உருவகப்படுத்துதலைத் தேர்ந்தெடுத்து 5 கூறுகளின் மாற்றங்களைப் பார்க்கவும்.'
                : 'Test hypothetical accomplishments before spending time. Click any action below to see real-time updates across all component counts and mathematical formulas.'}
            </p>
          </div>

          {activeSimulations.length > 0 && (
            <button
              type="button"
              onClick={resetSimulations}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-warm-muted hover:text-warm-ink dark:hover:text-night-ink border border-warm-border dark:border-night-border hover:bg-parchment-200 dark:hover:bg-night-100 transition-colors cursor-pointer self-start md:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isTamil ? 'உருவகப்படுத்துதலை மீட்டமைக்க' : 'Reset Simulator'}</span>
            </button>
          )}
        </div>

        {/* Active Simulation Notification Banner */}
        {activeSimulations.length > 0 && (
          <div className="mb-4 p-3.5 rounded-xl bg-forest-50 dark:bg-forest-950/40 border border-forest-200 dark:border-forest-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-forest-800 dark:text-forest-300">
              <Sparkles className="w-4 h-4 shrink-0 text-forest-600 dark:text-forest-400" />
              <div>
                <span className="font-bold">
                  {isTamil ? 'மாதிரி உருவகப்படுத்துதல் இயங்குகிறது:' : 'Simulation Active:'}
                </span>{' '}
                {readiness.baseOverallScore}% → <strong className="text-forest-700 dark:text-forest-300 text-sm">{readiness.overallScore}%</strong>{' '}
                (+{readiness.overallScore - readiness.baseOverallScore}% gain). {isTamil ? 'உங்கள் உண்மையான சுயவிவரம் மாறவில்லை.' : 'Your saved profile is untouched.'}
              </div>
            </div>
            <span className="text-[11px] text-forest-700 dark:text-forest-400 font-semibold italic">
              {isTamil ? 'கீழே உள்ள கூறுகள் புதுப்பிக்கப்பட்டுள்ளன' : 'Component formulas updated below ↓'}
            </span>
          </div>
        )}

        {/* Scenario Toggle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {readiness.availableScenarios.map(scenario => {
            const isSelected = activeSimulations.includes(scenario.id);
            return (
              <div
                key={scenario.id}
                onClick={() => toggleSimulation(scenario.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gold-50 dark:bg-gold-950/40 border-gold-400 dark:border-gold-700 shadow-warm-sm scale-[1.01]'
                    : 'bg-parchment-100/70 dark:bg-night-100/60 border-warm-border/70 dark:border-night-border hover:bg-parchment-200/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs text-warm-ink dark:text-night-ink">
                      {isTamil ? scenario.labelTamil : scenario.label}
                    </span>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-forest-700 dark:text-forest-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-warm-muted dark:text-night-muted shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-warm-muted dark:text-night-muted leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-warm-border/60 dark:border-night-border flex items-center justify-between text-[11px]">
                  <span className={`font-semibold ${isSelected ? 'text-forest-700 dark:text-forest-300' : 'text-warm-muted'}`}>
                    {scenario.impactSummary.split(',')[0]}
                  </span>
                  {scenario.challengeId && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleStartChallenge(scenario.challengeId!);
                      }}
                      className="text-maroon-700 dark:text-gold-400 hover:underline font-bold text-[11px]"
                    >
                      {isTamil ? 'தொடங்க' : 'Start'} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. COMPONENT ROWS (STRICT REQUIREMENT: 5 DISTINCT ROWS WITH COUNTS & FORMULA) */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-heritage text-warm-ink dark:text-night-ink">
              {isTamil ? 'தயார்நிலையின் 5 முக்கிய கூறுகள்' : 'Readiness Component Breakdown (All 5 Rows)'}
            </h3>
            <p className="text-xs text-warm-muted dark:text-night-muted">
              {isTamil
                ? 'ஒவ்வொரு கூறும் சரியான எண்ணிக்கை மற்றும் விரிவாக்கக்கூடிய சூத்திரத்துடன் காட்டப்பட்டுள்ளது.'
                : 'Each row displays exact counts, percentage, weight contribution, and step-by-step formula derivation.'}
            </p>
          </div>
        </div>

        {/* The 5 Component Rows */}
        <div className="space-y-3.5">
          {readiness.components.map((comp, idx) => {
            const isExpanded = !!expandedRowIds[comp.id];
            const hasSimulatedDiff = comp.simulatedCount !== undefined && comp.simulatedCount !== comp.count;

            // Row icons
            const getRowIcon = () => {
              switch (comp.id) {
                case 'skills':
                  return <Code className="w-5 h-5 text-maroon-700 dark:text-gold-400" />;
                case 'projects':
                  return <FileCode className="w-5 h-5 text-forest-700 dark:text-forest-400" />;
                case 'assessments':
                  return <CheckCircle2 className="w-5 h-5 text-gold-700 dark:text-gold-400" />;
                case 'communication':
                  return <Mic className="w-5 h-5 text-terracotta-700 dark:text-terracotta-400" />;
                case 'missingRequirements':
                  return <AlertCircle className="w-5 h-5 text-maroon-600 dark:text-gold-300" />;
                default:
                  return <Layers className="w-5 h-5 text-warm-muted" />;
              }
            };

            return (
              <div
                key={comp.id}
                className="rounded-card bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm overflow-hidden transition-all"
              >
                {/* Main Row Bar */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Icon, Title, and Counts */}
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="p-2.5 rounded-xl bg-parchment-200/80 dark:bg-night-100 border border-warm-border/60 shrink-0">
                      {getRowIcon()}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-warm-muted uppercase">
                          {idx + 1}. {isTamil ? comp.titleTamil : comp.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink border border-warm-border/60">
                          {isTamil ? 'எடை:' : 'Weight:'} {comp.weightPercentage}%
                        </span>
                        {comp.id === 'missingRequirements' && comp.count > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta-100 dark:bg-terracotta-950/60 text-terracotta-800 dark:text-terracotta-300">
                            {comp.count} {isTamil ? 'நிலுவை' : 'Missing'}
                          </span>
                        )}
                      </div>

                      {/* Explicit Counts (STRICT REQUIREMENT) */}
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
                          {comp.count} / {comp.total}
                        </span>
                        <span className="text-xs text-warm-muted dark:text-night-muted">
                          {isTamil ? comp.unitTamil : comp.unit}
                        </span>

                        {hasSimulatedDiff && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300 border border-forest-300 dark:border-forest-700">
                            Simulated: {comp.simulatedCount}/{comp.total}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-warm-muted dark:text-night-muted leading-relaxed max-w-xl">
                        {isTamil ? comp.explanationTamil : comp.explanationEnglish}
                      </p>
                    </div>
                  </div>

                  {/* Right: Progress Metric and Expandable Formula Toggle */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 shrink-0 min-w-[200px]">
                    <div className="w-full sm:w-44 md:w-48 space-y-1 text-right">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-warm-muted dark:text-night-muted">
                          {comp.id === 'missingRequirements'
                            ? (isTamil ? 'நிறைவு:' : 'Fulfillment:')
                            : (isTamil ? 'மதிப்பீடு:' : 'Progress:')}
                        </span>
                        <span className="text-warm-ink dark:text-night-ink text-sm">
                          {comp.percentage}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-parchment-200 dark:bg-night-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            comp.id === 'missingRequirements'
                              ? 'bg-gradient-to-r from-terracotta-500 to-forest-600'
                              : 'bg-gradient-to-r from-maroon-700 to-gold-500'
                          }`}
                          style={{ width: `${comp.percentage}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-warm-muted dark:text-night-muted text-right">
                        {isTamil ? 'பங்களிப்பு:' : 'Contribution:'}{' '}
                        <strong className="text-maroon-700 dark:text-gold-400">
                          +{comp.weightedContribution} pts
                        </strong>
                      </div>
                    </div>

                    {/* EXPANDABLE "HOW IS THIS CALCULATED?" BUTTON (STRICT REQUIREMENT) */}
                    <button
                      type="button"
                      onClick={() => toggleRowExpansion(comp.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-maroon-700 dark:text-gold-400 hover:text-maroon-900 dark:hover:text-gold-300 underline underline-offset-2 cursor-pointer pt-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>
                        {isExpanded
                          ? (isTamil ? 'சூத்திரத்தை மறை' : 'Hide Formula')
                          : (isTamil ? 'இது எவ்வாறு கணக்கிடப்படுகிறது?' : 'How is this calculated?')}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* EXPANDED ACCORDION: EXACT FORMULA & ITEM BREAKDOWN */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-night-100/80 border-t border-warm-border/70 dark:border-night-border animate-in fade-in duration-200 space-y-4">
                    {/* Exact Formula Block */}
                    <div className="p-3.5 rounded-xl bg-parchment-200/90 dark:bg-night-card border border-warm-border/60 dark:border-night-border font-mono text-xs space-y-1.5 overflow-x-auto">
                      <div className="text-warm-muted dark:text-night-muted font-sans font-bold flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-maroon-700 dark:text-gold-400" />
                        <span>{isTamil ? 'சரியான கணித சூத்திரம்:' : 'Exact Formula & Step-by-Step Derivation:'}</span>
                      </div>
                      <div className="text-maroon-800 dark:text-gold-300 font-semibold">
                        {comp.formulaStr}
                      </div>
                      <div className="text-warm-ink dark:text-night-ink">
                        = {comp.substitutionStr}
                      </div>
                      <div className="text-forest-700 dark:text-forest-400 font-bold pt-1">
                        Weighted Contribution = {comp.percentage}% × {comp.weightPercentage}% = +{comp.weightedContribution} points to overall guidance
                      </div>
                    </div>

                    {/* Itemized Evidence List */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-warm-muted dark:text-night-muted mb-2">
                        {isTamil ? 'சரிபார்க்கப்பட்ட சான்றுகளின் முழுப் பட்டியல்:' : 'Itemized Evidence Breakdown & Status:'}
                      </div>

                      <div className="space-y-2">
                        {comp.items.map(item => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border/60 dark:border-night-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-start gap-2.5">
                              {item.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-forest-400 shrink-0 mt-0.5" />
                              ) : item.status === 'missing' ? (
                                <AlertCircle className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400 shrink-0 mt-0.5" />
                              ) : (
                                <Clock className="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <div className="font-bold text-warm-ink dark:text-night-ink">
                                  {isTamil && item.nameTamil ? item.nameTamil : item.name}
                                </div>
                                <div className="text-warm-muted dark:text-night-muted text-[11px] mt-0.5">
                                  {isTamil && item.detailsTamil ? item.detailsTamil : item.details}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              {item.score !== undefined && (
                                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink">
                                  {item.score}%
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase tracking-wider ${
                                  item.status === 'completed'
                                    ? 'bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300'
                                    : item.status === 'missing'
                                    ? 'bg-terracotta-100 text-terracotta-800 dark:bg-terracotta-950 dark:text-terracotta-300'
                                    : 'bg-gold-100 text-gold-800 dark:bg-gold-950 dark:text-gold-300'
                                }`}
                              >
                                {item.status === 'completed'
                                  ? (isTamil ? 'சரிபார்க்கப்பட்டது' : 'Verified')
                                  : item.status === 'missing'
                                  ? (isTamil ? 'நிலுவை' : 'Missing')
                                  : (isTamil ? 'செயலில்' : 'In Progress')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. 60-DAY PRACTICE HABIT CONSISTENCY HEATMAP */}
      {/* ------------------------------------------------------------------ */}
      <section className="p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold font-heritage text-warm-ink dark:text-night-ink flex items-center gap-2">
              <Flame className="w-5 h-5 text-terracotta-600" />
              <span>{isTamil ? '60-நாள் பயிற்சி வரலாறு' : '60-Day Habit & Practice Consistency'}</span>
            </h3>
            <div className="text-xs text-warm-muted dark:text-night-muted mt-0.5">
              {isTamil ? 'தொடர் பயிற்சி:' : 'Current active streak:'}{' '}
              <strong className="text-terracotta-700 dark:text-terracotta-400">
                {persona.streakDays} {isTamil ? 'நாட்கள் தொடர்ச்சி' : 'consecutive days'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-warm-muted">
            <span>{isTamil ? 'குறைவு' : 'Less'}</span>
            <div className="w-3 h-3 rounded-sm bg-parchment-200 dark:bg-night-100" />
            <div className="w-3 h-3 rounded-sm bg-gold-300" />
            <div className="w-3 h-3 rounded-sm bg-gold-500" />
            <div className="w-3 h-3 rounded-sm bg-maroon-700" />
            <span>{isTamil ? 'அதிகம்' : 'More'}</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-12 sm:grid-cols-20 gap-1.5 pt-1">
          {streakHistory.map((day, idx) => {
            const heatColor = !day.active
              ? 'bg-parchment-200/70 dark:bg-night-100'
              : day.minutesSpent > 60
              ? 'bg-maroon-700'
              : day.minutesSpent > 40
              ? 'bg-gold-500'
              : 'bg-gold-300';

            return (
              <div
                key={idx}
                title={`${day.date}: ${day.active ? `${day.minutesSpent} mins (${day.tasksCompleted} tasks)` : 'Rest day'}`}
                className={`h-5 rounded-sm transition-transform hover:scale-125 cursor-pointer ${heatColor}`}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};
