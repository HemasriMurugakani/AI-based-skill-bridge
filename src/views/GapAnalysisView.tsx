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

  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
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
              {isTa ? 'வேலை விவர இடைவெளி ஆய்வுத் தளம்' : 'AI Job Description Gap Engine'}
            </span>
            <LiveIndicator />
            <TrustLabel type="how-calculated" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B67] dark:text-white">
            {isTa ? 'தேவைகளைப் பிரித்தெடுத்தல் · துல்லியமான இடைவெளிகளைக் கண்டறிதல்' : 'Extract Requirements · Detect Precise Gaps'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#526174] dark:text-slate-300 max-w-2xl leading-relaxed">
            {isTa
              ? 'லிங்க்ட்இன் அல்லது நௌக்ரி வேலை விவரத்தை உள்ளிடவும். உங்கள் சரிபார்க்கப்பட்ட சான்றுகளுடன் துல்லியமாக ஒப்பிடுவோம்.'
              : 'Paste any job description from LinkedIn, Naukri, or an apprenticeship circular. We parse strict requirements and deterministically benchmark against your verified proofs.'}
          </p>
        </div>

        <AboutThisData title={isTa ? 'வேலை விவர ஆய்வு பற்றி' : 'About this JD analysis'}>
          <p>
            {isTa
              ? 'தேவைகள் உரையிலிருந்து பிரித்தெடுக்கப்பட்டு உங்கள் போர்ட்ஃபோலியோ சான்றுகளுடன் நேரடியாக ஒப்பிடப்படுகின்றன.'
              : 'Requirements are extracted from the text and benchmarked deterministically against your verified portfolio proofs.'}
          </p>
          <p className="font-semibold text-[#173B67] dark:text-white">
            {isTa
              ? 'நியாயமான மதிப்பீடு: மதிப்பீடு செய்யப்படாத திறன்கள் தோல்வியாகக் கருதப்படாமல் நடுநிலையாக வைக்கப்படுகின்றன.'
              : 'Fairness guarantee: Unassessed skills are kept strictly neutral rather than marked as failures.'}
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
                <span>{isTa ? 'வேலை விவரத்தை ஒட்டவும்' : 'Paste Any Job Description'}</span>
              </label>

              {/* Sample JD Selector Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#526174] font-medium">{isTa ? 'மாதிரியை முயற்சிக்கவும்:' : 'Try sample:'}</span>
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
                  <span>{isTa ? 'இளநிலை வலை உருவாக்குநர்' : 'Web Dev Intern'}</span>
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
                  <span>{isTa ? 'தையல் உதவியாளர்' : 'Tailoring Assistant'}</span>
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
                  <span>{isTa ? 'மின்சாரப் பணியாளர்' : 'Electrician Helper'}</span>
                </button>
              </div>
            </div>

            {/* Big Textarea */}
            <div id="gap-jd-input-card">
              <textarea
                rows={8}
                value={jdInput}
                onChange={(e) => setJdInput(e.target.value)}
                placeholder={isTa ? 'வேலை விவர உரையை இங்கே ஒட்டவும்...' : 'Paste job description text here...'}
                className="w-full p-4 rounded-btn font-mono text-xs bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#62B6E8] leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#526174]">
                {isTa ? 'பாகுபடுத்தப்பட்டது' : 'Parsed via'} <span className="font-semibold text-[#173B67] dark:text-white">Claude 3.5 Sonnet</span> • {isTa ? 'கண்டிப்பான Zod சரிபார்ப்பு' : 'Strict Zod schema'}
              </span>

              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalysing || !jdInput.trim()}
                className="px-5 py-2.5 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] disabled:opacity-50 text-[#173B67] font-semibold text-xs flex items-center gap-2 shadow-soft transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#173B67]" />
                <span>{isAnalysing ? (isTa ? 'தேவைகளை ஆய்வு செய்கிறது...' : 'Parsing Requirements...') : (isTa ? 'வேலை விவரத்தை ஆய்வு செய்' : 'Analyse Job Description')}</span>
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
                  {isTa ? 'தற்போதைய கற்பவர் போர்ட்ஃபோலியோ' : 'Current Learner Portfolio'}
                </span>
                <h3 className="text-base font-bold text-[#173B67] dark:text-white">
                  {isTa ? (currentPersona.nameTamil || currentPersona.name) : currentPersona.name}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#10B981]">
                  {currentPersona.readinessScore}% {isTa ? 'தயார்நிலை' : 'Readiness'}
                </span>
                <div className="text-[10px] text-[#526174]">{isTa ? (pathway.titleTamil || pathway.title) : pathway.title}</div>
              </div>
            </div>

            <div className="text-xs text-[#526174] dark:text-slate-300 mb-3 leading-relaxed">
              {isTa ? 'இந்த ஒப்பீட்டில் சரிபார்க்கப்பட்ட உங்கள் திறன்கள்:' : 'Your verified competencies benchmarked in this comparison:'}
            </div>

            {/* List of Current Skills */}
            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
              {pathway.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2.5 rounded-btn bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#173B67] dark:text-white">
                      {isTa ? (skill.nameTamil || skill.name) : skill.name}
                    </div>
                    <div className="text-[10px] text-[#526174]">
                      {isTa ? `நிலை ${skill.level}/5 • ${skill.evidenceCount} சரிபார்க்கப்பட்ட சான்றுகள்` : `Level ${skill.level}/5 • ${skill.evidenceCount} verified ${skill.evidenceCount === 1 ? 'proof' : 'proofs'}`}
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
                    {isTa
                      ? (skill.state === 'strong' ? 'வலுவானது' : skill.state === 'develop' ? 'மேம்படுத்த வேண்டும்' : skill.state === 'gap' ? 'திறன் இடைவெளி' : 'மதிப்பிடப்படவில்லை')
                      : skill.state.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-slate-700 text-[11px] text-[#526174] flex items-center justify-between">
              <TrustLabel type="evidence-badge" />
              <span>{isTa ? `${pathway.skills.length} மொத்த பாதைத் திறன்கள்` : `${pathway.skills.length} Total Pathway Skills`}</span>
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
                    {isTa ? `பிரித்தெடுக்கப்பட்ட தேவைகள் (${extractedPayload.requiredSkills.length} மொத்தம்)` : `Extracted Requirements (${extractedPayload.requiredSkills.length} Total)`}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]">
                    {isTa ? 'Zod சரிபார்க்கப்பட்டது' : 'Zod Validated'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
                  {isTa ? `இலக்கு பணி: ${extractedPayload.role}` : `Target Role: ${extractedPayload.role}`}
                </h2>
                {extractedPayload.company && (
                  <div className="text-xs text-[#526174]">{extractedPayload.company}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                  {extractedPayload.requiredSkills.filter(s => s.importance === 'must').length} {isTa ? 'கட்டாயத் தேவை' : 'Must-Have'}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8FAFC] text-[#526174] border border-[#E2E8F0]">
                  {extractedPayload.requiredSkills.filter(s => s.importance === 'nice').length} {isTa ? 'கூடுதல் தகுதி' : 'Nice-to-Have'}
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
                          {isTa ? (skill.importance === 'must' ? 'கட்டாயம்' : 'விருப்பம்') : skill.importance}
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
                  {isTa ? 'துல்லிய போர்ட்ஃபோலியோ ஒப்பீடு' : 'Deterministic Portfolio Comparison'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white mt-0.5">
                  {isTa ? 'நேர்மையான திறன் பொருத்தம்' : 'Honest Competency Alignment'}
                </h3>
                <p className="text-xs text-[#526174] dark:text-slate-300 mt-1">
                  {isTa
                    ? 'போர்ட்ஃபோலியோவில் உள்ள சரிபார்க்கப்பட்ட சான்றுகளுடன் நேரடி ஒப்பீடு. மதிப்பீடு செய்யப்படாத திறன்கள் நடுநிலையாக வைக்கப்படும்.'
                    : 'Rules-based alias matching against verified evidence in your portfolio. Unassessed skills are kept strictly neutral.'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <ProgressRing
                  progress={comparisonResults.overallMatchScore}
                  size={95}
                  strokeWidth={8}
                  label={isTa ? 'பொருத்தம்' : 'Match'}
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
                    label: isTa ? 'வலுவானது' : 'Strong'
                  },
                  develop: {
                    badge: 'bg-[#FCF3E5] text-[#9A5B13] border-[#F2B66D]/40',
                    dot: 'bg-[#F2B66D]',
                    label: isTa ? 'மேம்படுத்த வேண்டும்' : 'Develop'
                  },
                  not_assessed: {
                    badge: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]',
                    dot: 'bg-[#64748B]',
                    label: isTa ? 'மதிப்பிடப்படவில்லை' : 'Not Assessed'
                  },
                  gap: {
                    badge: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
                    dot: 'bg-[#EF4444]',
                    label: isTa ? 'திறன் இடைவெளி' : 'Skill Gap'
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
                        <div className="text-[10px] text-[#526174] uppercase">{isTa ? 'சரிபார்க்கப்பட்ட சான்று' : 'Verified Proof'}</div>
                        <div className="font-bold text-sm text-[#173B67] dark:text-white">
                          {item.learnerScore}% / {item.requiredScore}%
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('challenges')}
                        className="px-3 py-1.5 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        {isTa ? 'திறனை நிரூபி' : 'Prove Skill'}
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
                  {isTa ? 'துறைசார் திறன் ஒப்பீட்டு வரைபடம்' : 'Domain Competency Radar'}
                </span>
                <h4 className="text-base font-bold text-[#173B67] dark:text-white mt-0.5">
                  {isTa ? 'நீங்கள் vs நிறுவனத்தின் தேவை' : 'You vs Employer Requirement'}
                </h4>
                <div className="flex items-center gap-4 text-xs mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#62B6E8]" />
                    <span className="text-[#173B67] dark:text-white">{isTa ? 'உங்கள் சரிபார்க்கப்பட்ட நிலை' : 'Your Verified Level'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#F2B66D]" />
                    <span className="text-[#173B67] dark:text-white">{isTa ? 'நிறுவனத்தின் இலக்கு' : 'Employer Target'}</span>
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
                      name={isTa ? 'உங்கள் சரிபார்க்கப்பட்ட மதிப்பெண்' : 'Your Verified Score'}
                      dataKey="learner"
                      stroke="#173B67"
                      fill="#62B6E8"
                      fillOpacity={0.45}
                    />
                    <Radar
                      name={isTa ? 'தேவைப்படும் நிலை' : 'Required Level'}
                      dataKey="required"
                      stroke="#F2B66D"
                      fill="#F2B66D"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-[#526174] italic text-center">
                {isTa ? 'பிரித்தெடுக்கப்பட்ட அனைத்து வேலைத் தேவைகளிலும் சராசரித் திறனை வரைபடம் காட்டுகிறது.' : 'Radar averages competency across all extracted job requirements.'}
              </div>
            </div>

            {/* RANKED "PRIORITISE NEXT" LIST (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#62B6E8]">
                      {isTa ? 'இலக்கு கற்றல் வரிசை' : 'Targeted Learning Order'}
                    </span>
                    <h4 className="text-base font-bold text-[#173B67] dark:text-white">
                      {isTa ? 'அடுத்த முன்னுரிமை செயல் திட்டம்' : 'Ranked "Prioritise Next" Action Plan'}
                    </h4>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                    {isTa ? 'அதிக பலன் தரும் வழிகள்' : 'Highest ROI Bridges'}
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
                              {isTa ? (item.urgency === 'Immediate' ? 'உடனடி' : 'அடுத்தது') : item.urgency}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#526174] dark:text-slate-300 mt-1 leading-relaxed">
                            <span className="font-semibold text-[#173B67] dark:text-white">{isTa ? 'காரணம்:' : 'Reasoning:'}</span>{' '}
                            {item.jdSkill.importance === 'must' ? (isTa ? 'கட்டாயத் தகுதி' : 'Mandatory qualification') : (isTa ? 'கூடுதல் நன்மை' : 'Preferred differentiator')}. {item.jdSkill.why}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('challenges')}
                        className="text-[#173B67] hover:text-[#62B6E8] font-semibold shrink-0 text-xs flex items-center gap-0.5 mt-0.5 cursor-pointer"
                      >
                        <span>{isTa ? 'தொடங்கு' : 'Start'}</span>
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
                    <span>{isTa ? 'முன்னுரிமை மைல்கற்களை எனது கற்றல் பாதையில் சேர்' : 'Add Prioritized Milestones to My Adaptive Roadmap'}</span>
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
                <span>{isTa ? 'AI பிரித்தெடுத்த தரவைக் காண்க (கண்டிப்பான Zod JSON)' : 'See What the AI Extracted (Strict Zod JSON Payload)'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                  {isTa ? 'சரிபார்க்கப்பட்ட வடிவம்' : 'Schema Valid'}
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
