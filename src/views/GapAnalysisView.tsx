import React, { useState, useEffect } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { extractJobDescription, JdExtractPayload } from '../services/api';
import { compareSkillsDeterministically, SkillComparisonResult, RadarDataPoint } from '../utils/skillMatcher';
import { SkillChip } from '../components/SkillChip';
import { ProgressRing } from '../components/ProgressRing';
import { StatusPill } from '../components/StatusPill';
import { TrustLabel } from '../components/TrustLabel';
import { AboutThisData } from '../components/ui/AboutThisData';
import { AIThinking } from '../components/AIThinking';
import { LiveIndicator } from '../components/LiveIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import confetti from 'canvas-confetti';
import {
  Search,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Layers,
  ShieldCheck,
  Code,
  Scissors,
  Zap,
  Clock,
  Compass
} from 'lucide-react';

const sampleJdTexts = {
  web_dev: `Company: Vaigai Digital Solutions, Chennai
Role: Junior React Frontend Engineering Intern
Location: Chennai / Hybrid (Guindy Industrial Estate)
Requirements:
- Strong knowledge of Semantic HTML5, WCAG 2.1 accessibility standards, ARIA landmarks.
- Responsive CSS Grid, Flexbox, mobile-first design systems.
- Core JavaScript (ES6+), async/await, DOM event delegation, AbortController.
- React functional components, custom hooks, state synchronization.
- REST API integration, error toasts, and Zod client validation.
- Git branching and PR etiquette.
Eligibility:
- BCA / B.Sc / B.E. or self-taught learner with reproducible proof.
- Portfolio of working projects prioritized.`,

  tailoring: `Company: Kongu Apparel & Bridal Studio, Tiruppur
Role: Boutique Sample Tailor & Pattern Assistant
Location: Tiruppur (Avinashi Road Garment Hub)
Requirements:
- Precise client body measurements with standard 1.5" ease calculations.
- Katori & 4-Dart blouse pattern drafting on craft paper with 1/4" seam tolerances.
- Lockstitch sewing machine tension balancing, 10-11 SPI straight stitch.
- Bias binding cord piping at 45-degree angle without neckline puckering.
- Steam press seam finishing and export quality inspection.
Eligibility:
- Self-help group member or state skill mission trainee.
- Photo proof of seam tension balance.`,

  electrician: `Company: Shevaroy Green Energy & Electricals, Salem
Role: Domestic Wireman & Solar Substation Helper
Location: Salem / Yercaud Foothills
Requirements:
- Electrical Safety & PPE (IS 5216), de-energizing protocols, LOTO compliance.
- PVC Conduit & Loop-in wiring, staircase two-way switch logic.
- Pipe/Plate Earthing and Megger earth resistance measurement under 5 ohms.
- Single-phase and 3-phase load calculation fundamentals.
Eligibility:
- ITI certificate or 1 year field apprenticeship.
- Photo proof of two-way switch wiring board.`
};

export const GapAnalysisView: React.FC = () => {
  const {
    getPersona,
    getCurrentPathway,
    isOfflineDemo,
    setActiveTab,
    pathways,
    setPersona
  } = useSkillBridgeStore();

  const { t } = useTranslation();
  const currentPersona = getPersona();
  const pathway = getCurrentPathway();

  const [jdInput, setJdInput] = useState(sampleJdTexts.web_dev);
  const [selectedSampleKey, setSelectedSampleKey] = useState<'web_dev' | 'tailoring' | 'electrician'>('web_dev');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [extractedPayload, setExtractedPayload] = useState<JdExtractPayload | null>(null);
  const [isLiveExtraction, setIsLiveExtraction] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<{
    results: SkillComparisonResult[];
    overallMatchScore: number;
    radarData: RadarDataPoint[];
    prioritizedList: SkillComparisonResult[];
  } | null>(null);

  const [animatedSkillsCount, setAnimatedSkillsCount] = useState(0);
  const [showRawJson, setShowRawJson] = useState(false);
  const [addedToRoadmapNotice, setAddedToRoadmapNotice] = useState<string | null>(null);

  // Auto-run initial analysis for interactive demonstration
  useEffect(() => {
    handleRunAnalysis();
  }, [selectedSampleKey, currentPersona.id]);

  const handleSelectSample = (key: 'web_dev' | 'tailoring' | 'electrician') => {
    setSelectedSampleKey(key);
    setJdInput(sampleJdTexts[key]);
    setExtractedPayload(null);
    setComparisonResults(null);
    setAddedToRoadmapNotice(null);

    // Contextually suggest matching persona if switching trade
    if (key === 'tailoring' && currentPersona.id !== 'lakshmi-vocational') {
      setPersona('lakshmi-vocational');
    } else if (key === 'web_dev' && currentPersona.id !== 'priya-student') {
      setPersona('priya-student');
    }
  };

  const handleRunAnalysis = async () => {
    if (!jdInput.trim()) return;

    setIsAnalysing(true);
    setExtractedPayload(null);
    setComparisonResults(null);
    setAnimatedSkillsCount(0);
    setAddedToRoadmapNotice(null);

    try {
      const { data, isLive } = await extractJobDescription(jdInput, isOfflineDemo);
      setExtractedPayload(data);
      setIsLiveExtraction(isLive);

      // Perform deterministic matching with learner's current pathway skills
      const comparison = compareSkillsDeterministically(data.requiredSkills, pathway.skills);
      setComparisonResults(comparison);

      // Animate skills appearing one by one
      data.requiredSkills.forEach((_, idx) => {
        setTimeout(() => {
          setAnimatedSkillsCount(prev => Math.min(data.requiredSkills.length, prev + 1));
        }, (idx + 1) * 160);
      });
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleAddToRoadmap = () => {
    if (!comparisonResults) return;

    const gapsCount = comparisonResults.results.filter(
      r => r.classification === 'gap' || r.classification === 'develop'
    ).length;

    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.7 },
      colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
    });

    setAddedToRoadmapNotice(
      `✓ Successfully integrated ${gapsCount} prioritized learning milestones into your active "${pathway.title}" roadmap!`
    );

    setTimeout(() => {
      setAddedToRoadmapNotice(null);
      setActiveTab('roadmap');
    }, 2400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-poppins">
      {/* Top Header */}
      <div className="p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#62B6E8]">
              AI Job Description Gap Engine
            </span>
            <LiveIndicator />
            <TrustLabel type="how-calculated" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B67] dark:text-white">
            Extract Requirements · Detect Precise Gaps
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#526174] dark:text-slate-300 max-w-2xl leading-relaxed">
            Paste any job description from LinkedIn, Naukri, or an apprenticeship circular. We parse strict requirements and deterministically benchmark against your verified proofs.
          </p>
        </div>

        <AboutThisData title="About this JD analysis">
          <p>
            Requirements are extracted from the text and benchmarked deterministically against your verified portfolio proofs.
          </p>
          <p className="font-semibold text-[#173B67] dark:text-white">
            Fairness guarantee: Unassessed skills are kept strictly neutral rather than marked as failures.
          </p>
        </AboutThisData>
      </div>

      {/* Main Split Grid: Left (JD Input) vs Right (Current Learner Skills) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Textarea & Sample Pickers (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#62B6E8]" />
                <span>Paste Any Job Description</span>
              </label>

              {/* Sample JD Selector Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#526174] font-medium">Try sample:</span>
                <button
                  type="button"
                  onClick={() => handleSelectSample('web_dev')}
                  className={`px-2.5 py-1 rounded-btn text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedSampleKey === 'web_dev'
                      ? 'bg-[#173B67] text-white shadow-soft'
                      : 'bg-[#EAF5FC] text-[#173B67] hover:bg-[#D9EFFB]'
                  }`}
                >
                  <Code className="w-3 h-3 text-[#62B6E8]" />
                  <span>Web Dev Intern</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('tailoring')}
                  className={`px-2.5 py-1 rounded-btn text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedSampleKey === 'tailoring'
                      ? 'bg-[#173B67] text-white shadow-soft'
                      : 'bg-[#EAF5FC] text-[#173B67] hover:bg-[#D9EFFB]'
                  }`}
                >
                  <Scissors className="w-3 h-3 text-[#62B6E8]" />
                  <span>Tailoring Assistant</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('electrician')}
                  className={`px-2.5 py-1 rounded-btn text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedSampleKey === 'electrician'
                      ? 'bg-[#173B67] text-white shadow-soft'
                      : 'bg-[#EAF5FC] text-[#173B67] hover:bg-[#D9EFFB]'
                  }`}
                >
                  <Zap className="w-3 h-3 text-[#62B6E8]" />
                  <span>Electrician Helper</span>
                </button>
              </div>
            </div>

            {/* Big Textarea */}
            <div id="gap-jd-input-card">
              <textarea
                rows={8}
                value={jdInput}
                onChange={(e) => setJdInput(e.target.value)}
                placeholder="Paste job description text here..."
                className="w-full p-4 rounded-btn font-mono text-xs bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#62B6E8] leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#526174]">
                Parsed via <span className="font-semibold text-[#173B67] dark:text-white">Claude 3.5 Sonnet</span> • Strict Zod schema
              </span>

              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalysing || !jdInput.trim()}
                className="px-5 py-2.5 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] disabled:opacity-50 text-[#173B67] font-semibold text-xs flex items-center gap-2 shadow-soft transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#173B67]" />
                <span>{isAnalysing ? 'Parsing Requirements...' : 'Analyse Job Description'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Learner's Current Skills Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#526174]">
                  Current Learner Portfolio
                </span>
                <h3 className="text-base font-bold text-[#173B67] dark:text-white">
                  {currentPersona.name}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#10B981]">
                  {currentPersona.readinessScore}% Readiness
                </span>
                <div className="text-[10px] text-[#526174]">{pathway.title}</div>
              </div>
            </div>

            <div className="text-xs text-[#526174] dark:text-slate-300 mb-3 leading-relaxed">
              Your verified competencies benchmarked in this comparison:
            </div>

            {/* List of Current Skills */}
            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
              {pathway.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2.5 rounded-btn bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#173B67] dark:text-white">{skill.name}</div>
                    <div className="text-[10px] text-[#526174]">
                      Level {skill.level}/5 • {skill.evidenceCount} verified {skill.evidenceCount === 1 ? 'proof' : 'proofs'}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      skill.state === 'strong'
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                        : skill.state === 'develop'
                        ? 'bg-[#FCF3E5] text-[#9A5B13] border border-[#F2B66D]/40'
                        : skill.state === 'gap'
                        ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                        : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                    }`}
                  >
                    {skill.state.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-slate-700 text-[11px] text-[#526174] flex items-center justify-between">
              <TrustLabel type="evidence-badge" />
              <span>{pathway.skills.length} Total Pathway Skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thinking State */}
      {isAnalysing && (
        <div className="p-8 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft text-center">
          <AIThinking
            labelEnglish="Calling /api/jd-extract: Parsing required skills, importance weights, and eligibility..."
            labelTamil="வேலை விவரத்திலிருந்து தேவையான திறன்களை மாதிரி ஆய்வு செய்கிறது..."
          />
        </div>
      )}

      {/* RESULTS SECTION */}
      {extractedPayload && comparisonResults && !isAnalysing && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Animated Skills Flying into Panel */}
          <section id="gap-extracted-requirements" className="p-6 sm:p-8 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#62B6E8]">
                    Extracted Requirements ({extractedPayload.requiredSkills.length} Total)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]">
                    Zod Validated
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
                  Target Role: {extractedPayload.role}
                </h2>
                {extractedPayload.company && (
                  <div className="text-xs text-[#526174]">{extractedPayload.company}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                  {extractedPayload.requiredSkills.filter(s => s.importance === 'must').length} Must-Have
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8FAFC] text-[#526174] border border-[#E2E8F0]">
                  {extractedPayload.requiredSkills.filter(s => s.importance === 'nice').length} Nice-to-Have
                </span>
              </div>
            </div>

            {/* Flying Chips Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              <AnimatePresence>
                {extractedPayload.requiredSkills.slice(0, animatedSkillsCount).map((skill) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 14, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 rounded-btn bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 shadow-soft flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-[#526174] uppercase">
                          {skill.category}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                            skill.importance === 'must'
                              ? 'bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]'
                              : 'bg-[#FCF3E5] text-[#9A5B13] border border-[#F2B66D]/40'
                          }`}
                        >
                          {skill.importance}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-[#173B67] dark:text-white">
                        {skill.name}
                      </div>
                      <div className="text-[10px] text-[#526174] mt-1 leading-snug">
                        {skill.why}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Deterministic Comparison Breakdown: Strong / Develop / Not Assessed / Gap */}
          <section className="p-6 sm:p-8 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#62B6E8]">
                  Deterministic Portfolio Comparison
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white mt-0.5">
                  Honest Competency Alignment
                </h3>
                <p className="text-xs text-[#526174] dark:text-slate-300 mt-1">
                  Rules-based alias matching against verified evidence in your portfolio. Unassessed skills are kept strictly neutral.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <ProgressRing
                  progress={comparisonResults.overallMatchScore}
                  size={95}
                  strokeWidth={8}
                  label="Match"
                />
              </div>
            </div>

            {/* List of Comparison Results */}
            <div className="space-y-3">
              {comparisonResults.results.map((item, idx) => {
                const statusStyle = {
                  strong: {
                    badge: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
                    dot: 'bg-[#10B981]',
                    label: 'Strong'
                  },
                  develop: {
                    badge: 'bg-[#FCF3E5] text-[#9A5B13] border-[#F2B66D]/40',
                    dot: 'bg-[#F2B66D]',
                    label: 'Develop'
                  },
                  not_assessed: {
                    badge: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]',
                    dot: 'bg-[#64748B]',
                    label: 'Not Assessed'
                  },
                  gap: {
                    badge: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
                    dot: 'bg-[#EF4444]',
                    label: 'Skill Gap'
                  }
                }[item.classification];

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-btn bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-soft"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: item.classification === 'strong' ? '#10B981' : item.classification === 'develop' ? '#F2B66D' : item.classification === 'gap' ? '#EF4444' : '#64748B' }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#173B67] dark:text-white">
                            {item.jdSkill.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle.badge}`}>
                            {statusStyle.label}
                          </span>
                          <span className="text-[10px] text-[#526174]">
                            ({item.jdSkill.importance.toUpperCase()})
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-[#526174] dark:text-slate-300 leading-relaxed">
                          {item.oneLineExplanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 sm:border-l sm:pl-4 border-[#E2E8F0]">
                      <div className="text-right">
                        <div className="text-[10px] text-[#526174] uppercase">Verified Proof</div>
                        <div className="font-bold text-sm text-[#173B67] dark:text-white">
                          {item.learnerScore}% / {item.requiredScore}%
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('challenges')}
                        className="px-3 py-1.5 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Prove Skill
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Split: Radar Chart (You vs Requirement) & Prioritise Next List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* RADAR CHART (5 Cols) */}
            <div id="gap-radar-chart" className="lg:col-span-5 p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#526174]">
                  Domain Competency Radar
                </span>
                <h4 className="text-base font-bold text-[#173B67] dark:text-white mt-0.5">
                  You vs Employer Requirement
                </h4>
                <div className="flex items-center gap-4 text-xs mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#62B6E8]" />
                    <span className="text-[#173B67] dark:text-white">Your Verified Level</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#F2B66D]" />
                    <span className="text-[#173B67] dark:text-white">Employer Target</span>
                  </span>
                </div>
              </div>

              {/* Radar Graphic using Recharts */}
              <div className="h-64 w-full my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={comparisonResults.radarData} margin={{ top: 10, right: 15, bottom: 10, left: 15 }}>
                    <PolarGrid stroke="#D4E7F5" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#173B67', fontSize: 10, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#D4E7F5" tick={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '11px',
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)'
                      }}
                    />
                    <Radar
                      name="Your Verified Score"
                      dataKey="learner"
                      stroke="#173B67"
                      fill="#62B6E8"
                      fillOpacity={0.45}
                    />
                    <Radar
                      name="Required Level"
                      dataKey="required"
                      stroke="#F2B66D"
                      fill="#F2B66D"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-[#526174] italic text-center">
                Radar averages competency across all extracted job requirements.
              </div>
            </div>

            {/* RANKED "PRIORITISE NEXT" LIST (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#62B6E8]">
                      Targeted Learning Order
                    </span>
                    <h4 className="text-base font-bold text-[#173B67] dark:text-white">
                      Ranked "Prioritise Next" Action Plan
                    </h4>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                    Highest ROI Bridges
                  </span>
                </div>

                <div className="space-y-3">
                  {comparisonResults.prioritizedList.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-btn bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#173B67] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#173B67] dark:text-white">
                              {item.jdSkill.name}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                                item.urgency === 'Immediate'
                                  ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                                  : 'bg-[#FCF3E5] text-[#9A5B13] border border-[#F2B66D]/40'
                              }`}
                            >
                              {item.urgency}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#526174] dark:text-slate-300 mt-1 leading-relaxed">
                            <span className="font-semibold text-[#173B67] dark:text-white">Reasoning:</span>{' '}
                            {item.jdSkill.importance === 'must' ? 'Mandatory qualification' : 'Preferred differentiator'}. {item.jdSkill.why}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('challenges')}
                        className="text-[#173B67] hover:text-[#62B6E8] font-semibold shrink-0 text-xs flex items-center gap-0.5 mt-0.5 cursor-pointer"
                      >
                        <span>Start</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Banner: Add to Roadmap (Max 1 primary button per section) */}
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-slate-700">
                {addedToRoadmapNotice ? (
                  <div className="p-3.5 rounded-btn bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-bold text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    <span>{addedToRoadmapNotice}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToRoadmap}
                    className="w-full py-3 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-xs shadow-soft flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#173B67]" />
                    <span>Add Prioritized Milestones to My Adaptive Roadmap</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Transparency: Collapsible "See What the AI Extracted" Panel */}
          <section className="p-5 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="w-full flex items-center justify-between text-left text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wide cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#62B6E8]" />
                <span>See What the AI Extracted (Strict Zod JSON Payload)</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                  Schema Valid
                </span>
              </div>
              {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRawJson && (
              <div className="mt-4 pt-3 border-t border-[#E2E8F0] animate-in fade-in duration-200">
                <pre className="p-4 rounded-btn font-mono text-[11px] bg-[#0F2035] text-[#BAE6FD] overflow-x-auto leading-relaxed border border-slate-700">
                  {JSON.stringify(extractedPayload, null, 2)}
                </pre>
                <div className="mt-2 text-[10px] text-[#526174] italic">
                  Extracted via /api/jd-extract • Validated strictly against Zod JdExtractSchema
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
