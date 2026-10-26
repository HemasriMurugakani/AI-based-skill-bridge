import React, { useState, useEffect } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { extractJobDescription, JdExtractPayload } from '../services/api';
import { compareSkillsDeterministically, SkillComparisonResult, RadarDataPoint } from '../utils/skillMatcher';
import { SkillChip } from '../components/SkillChip';
import { ProgressRing } from '../components/ProgressRing';
import { StatusPill } from '../components/StatusPill';
import { TrustLabel } from '../components/TrustLabel';
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
      colors: ['#7A1A12', '#B8761A', '#E8B23A', '#2F7D4F']
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
              AI Job Description Gap Engine
            </span>
            <LiveIndicator />
            <TrustLabel type="how-calculated" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
            Extract Requirements · Detect Precise Gaps
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-warm-muted dark:text-night-muted max-w-2xl leading-relaxed">
            Paste any job description from LinkedIn, Naukri, or an apprenticeship circular. We parse strict requirements and deterministically benchmark against your verified proofs.
          </p>
        </div>

        <TrustLabel type="ai-disclaimer" />
      </div>

      {/* Main Split Grid: Left (JD Input) vs Right (Current Learner Skills) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Textarea & Sample Pickers (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-warm-ink dark:text-night-ink flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
                <span>Paste Any Job Description</span>
              </label>

              {/* Sample JD Selector Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-warm-muted font-medium">Try sample:</span>
                <button
                  type="button"
                  onClick={() => handleSelectSample('web_dev')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedSampleKey === 'web_dev'
                      ? 'bg-maroon-700 text-white shadow-xs'
                      : 'bg-parchment-200 dark:bg-night-100 text-warm-ink hover:bg-gold-100'
                  }`}
                >
                  <Code className="w-3 h-3" />
                  <span>Web Dev Intern</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('tailoring')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedSampleKey === 'tailoring'
                      ? 'bg-maroon-700 text-white shadow-xs'
                      : 'bg-parchment-200 dark:bg-night-100 text-warm-ink hover:bg-gold-100'
                  }`}
                >
                  <Scissors className="w-3 h-3" />
                  <span>Tailoring Assistant</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('electrician')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedSampleKey === 'electrician'
                      ? 'bg-maroon-700 text-white shadow-xs'
                      : 'bg-parchment-200 dark:bg-night-100 text-warm-ink hover:bg-gold-100'
                  }`}
                >
                  <Zap className="w-3 h-3" />
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
                className="w-full p-4 rounded-xl font-mono text-xs bg-parchment-100 dark:bg-night-100 border border-warm-border dark:border-night-border text-warm-ink dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-gold-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-warm-subtle">
                Parsed via <span className="font-semibold text-warm-ink dark:text-night-ink">Claude 3.5 Sonnet</span> • Strict Zod schema
              </span>

              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalysing || !jdInput.trim()}
                className="px-5 py-2.5 rounded-full bg-maroon-700 hover:bg-maroon-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-warm-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gold-300" />
                <span>{isAnalysing ? 'Parsing Requirements...' : 'Analyse Job Description'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Learner's Current Skills Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-warm-muted">
                  Current Learner Portfolio
                </span>
                <h3 className="text-base font-bold font-heritage text-warm-ink dark:text-night-ink">
                  {currentPersona.name}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-forest-700 dark:text-forest-400">
                  {currentPersona.readinessScore}% Readiness
                </span>
                <div className="text-[10px] text-warm-muted">{pathway.title}</div>
              </div>
            </div>

            <div className="text-xs text-warm-muted dark:text-night-muted mb-3 leading-relaxed">
              Your verified competencies benchmarked in this comparison:
            </div>

            {/* List of Current Skills */}
            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
              {pathway.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2.5 rounded-xl bg-parchment-100/70 dark:bg-night-100/60 border border-warm-border/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-warm-ink dark:text-night-ink">{skill.name}</div>
                    <div className="text-[10px] text-warm-muted">
                      Level {skill.level}/5 • {skill.evidenceCount} verified {skill.evidenceCount === 1 ? 'proof' : 'proofs'}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      skill.state === 'strong'
                        ? 'bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300'
                        : skill.state === 'develop'
                        ? 'bg-gold-100 dark:bg-gold-950 text-gold-900 dark:text-gold-200'
                        : skill.state === 'gap'
                        ? 'bg-terracotta-100 text-terracotta-800'
                        : 'bg-warm-200 text-warm-muted'
                    }`}
                  >
                    {skill.state.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-warm-border/60 text-[11px] text-warm-muted flex items-center justify-between">
              <TrustLabel type="evidence-badge" />
              <span>{pathway.skills.length} Total Pathway Skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thinking State */}
      {isAnalysing && (
        <div className="p-8 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border dark:border-night-border shadow-warm-md text-center">
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
          <section id="gap-extracted-requirements" className="p-6 sm:p-8 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
                    Extracted Requirements ({extractedPayload.requiredSkills.length} Total)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 font-bold">
                    Zod Validated
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                  Target Role: {extractedPayload.role}
                </h2>
                {extractedPayload.company && (
                  <div className="text-xs text-warm-muted">{extractedPayload.company}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-parchment-200 dark:bg-night-100 border border-warm-border">
                  {extractedPayload.requiredSkills.filter(s => s.importance === 'must').length} Must-Have
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-parchment-200 dark:bg-night-100 border border-warm-border">
                  {extractedPayload.requiredSkills.filter(s => s.importance === 'nice').length} Nice-to-Have
                </span>
              </div>
            </div>

            {/* Flying Chips Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              <AnimatePresence>
                {extractedPayload.requiredSkills.slice(0, animatedSkillsCount).map((skill, idx) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 14, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 rounded-xl bg-white dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-warm-muted uppercase">
                          {skill.category}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                            skill.importance === 'must'
                              ? 'bg-maroon-100 dark:bg-maroon-950 text-maroon-800 dark:text-maroon-200 border border-maroon-300'
                              : 'bg-gold-100 text-gold-900 border border-gold-300'
                          }`}
                        >
                          {skill.importance}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-warm-ink dark:text-night-ink">
                        {skill.name}
                      </div>
                      <div className="text-[10px] text-warm-muted mt-1 leading-snug">
                        {skill.why}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Deterministic Comparison Breakdown: Strong / Develop / Not Assessed / Gap */}
          <section className="p-6 sm:p-8 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
                  Deterministic Portfolio Comparison (NOT AI Hallucination)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink mt-0.5">
                  Honest Competency Alignment
                </h3>
                <p className="text-xs text-warm-muted dark:text-night-muted mt-1">
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
                    badge: 'bg-forest-100 text-forest-800 border-forest-300',
                    dot: 'bg-forest-600',
                    label: 'Strong'
                  },
                  develop: {
                    badge: 'bg-gold-100 text-gold-900 border-gold-300',
                    dot: 'bg-gold-600',
                    label: 'Develop'
                  },
                  not_assessed: {
                    badge: 'bg-warm-100 text-warm-muted border-warm-border',
                    dot: 'bg-warm-muted',
                    label: 'Not Assessed'
                  },
                  gap: {
                    badge: 'bg-terracotta-100 text-terracotta-900 border-terracotta-300',
                    dot: 'bg-terracotta-600',
                    label: 'Skill Gap'
                  }
                }[item.classification];

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-night-card border border-warm-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.classification === 'strong' ? '#2F7D4F' : item.classification === 'develop' ? '#B8761A' : item.classification === 'gap' ? '#C8553D' : '#9A8E85' }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-warm-ink dark:text-night-ink">
                            {item.jdSkill.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${statusStyle.badge}`}>
                            {statusStyle.label}
                          </span>
                          <span className="text-[10px] text-warm-muted">
                            ({item.jdSkill.importance.toUpperCase()})
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-warm-muted dark:text-night-muted leading-relaxed">
                          {item.oneLineExplanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 sm:border-l sm:pl-4 border-warm-border/60">
                      <div className="text-right">
                        <div className="text-[10px] text-warm-muted uppercase">Verified Proof</div>
                        <div className="font-bold text-sm text-warm-ink dark:text-night-ink">
                          {item.learnerScore}% / {item.requiredScore}%
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('challenges')}
                        className="px-3 py-1.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-[11px] transition-colors"
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
            <div id="gap-radar-chart" className="lg:col-span-5 p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-warm-muted">
                  Domain Competency Radar
                </span>
                <h4 className="text-base font-bold font-heritage text-warm-ink dark:text-night-ink mt-0.5">
                  You vs Employer Requirement
                </h4>
                <div className="flex items-center gap-4 text-xs mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-forest-600" />
                    <span>Your Verified Level</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-gold-500" />
                    <span>Employer Target</span>
                  </span>
                </div>
              </div>

              {/* Radar Graphic using Recharts */}
              <div className="h-64 w-full my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={comparisonResults.radarData} margin={{ top: 10, right: 15, bottom: 10, left: 15 }}>
                    <PolarGrid stroke="#E8DECE" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#665B54', fontSize: 10, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#E8DECE" tick={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FBF7F0',
                        borderRadius: '12px',
                        border: '1px solid #E8DECE',
                        fontSize: '11px'
                      }}
                    />
                    <Radar
                      name="Your Verified Score"
                      dataKey="learner"
                      stroke="#2F7D4F"
                      fill="#2F7D4F"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Required Level"
                      dataKey="required"
                      stroke="#B8761A"
                      fill="#E8B23A"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-warm-muted italic text-center">
                Radar averages competency across all extracted job requirements.
              </div>
            </div>

            {/* RANKED "PRIORITISE NEXT" LIST (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
                      Targeted Learning Order
                    </span>
                    <h4 className="text-base font-bold font-heritage text-warm-ink dark:text-night-ink">
                      Ranked "Prioritise Next" Action Plan
                    </h4>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900">
                    Highest ROI Bridges
                  </span>
                </div>

                <div className="space-y-3">
                  {comparisonResults.prioritizedList.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-parchment-100/70 dark:bg-night-100/60 border border-warm-border/70 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-maroon-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-warm-ink dark:text-night-ink">
                              {item.jdSkill.name}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                item.urgency === 'Immediate'
                                  ? 'bg-terracotta-100 text-terracotta-800'
                                  : 'bg-gold-100 text-gold-900'
                              }`}
                            >
                              {item.urgency}
                            </span>
                          </div>
                          <p className="text-[11px] text-warm-muted dark:text-night-muted mt-1 leading-relaxed">
                            <span className="font-semibold text-warm-ink dark:text-night-ink">Reasoning:</span>{' '}
                            {item.jdSkill.importance === 'must' ? 'Mandatory qualification' : 'Preferred differentiator'}. {item.jdSkill.why}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('challenges')}
                        className="text-maroon-700 dark:text-gold-400 font-bold hover:underline shrink-0 text-xs flex items-center gap-0.5 mt-0.5"
                      >
                        <span>Start</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Banner: Add to Roadmap */}
              <div className="mt-6 pt-4 border-t border-warm-border/60">
                {addedToRoadmapNotice ? (
                  <div className="p-3.5 rounded-xl bg-forest-100 text-forest-900 border border-forest-300 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-forest-700" />
                    <span>{addedToRoadmapNotice}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToRoadmap}
                    className="w-full py-3 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-extrabold text-xs shadow-warm-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-gold-300" />
                    <span>Add Prioritized Milestones to My Adaptive Roadmap</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Transparency: Collapsible "See What the AI Extracted" Panel */}
          <section className="p-5 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 shadow-warm-sm">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="w-full flex items-center justify-between text-left text-xs font-bold text-warm-ink dark:text-night-ink uppercase tracking-wide cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
                <span>See What the AI Extracted (Strict Zod JSON Payload)</span>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-forest-100 text-forest-800">
                  Schema Valid
                </span>
              </div>
              {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRawJson && (
              <div className="mt-4 pt-3 border-t border-warm-border/60 animate-in fade-in duration-200">
                <pre className="p-4 rounded-xl font-mono text-[11px] bg-night-100 text-gold-200 overflow-x-auto leading-relaxed border border-night-border">
                  {JSON.stringify(extractedPayload, null, 2)}
                </pre>
                <div className="mt-2 text-[10px] text-warm-muted italic">
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
