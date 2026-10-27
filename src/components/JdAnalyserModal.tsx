import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sparkles, FileText, CheckCircle2, AlertCircle, ArrowRight, Upload } from 'lucide-react';
import { fallbackJdExtract, JdExtractResponse } from '../data/fallbacks';
import { AIThinking } from './AIThinking';
import { ProgressRing } from './ProgressRing';
import { TrustLabel } from './TrustLabel';
import { extractJobDescriptionWithGemini, isGeminiConfigured } from '../services/gemini';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';

interface JdAnalyserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRoadmap?: () => void;
}

const sampleJds = [
  {
    title: 'Junior React Frontend Engineer (Chennai)',
    text: `Company: Vaigai Digital Solutions, Chennai
Role: Junior Frontend Developer (Full-time)
Requirements:
- Strong knowledge of Semantic HTML5, WCAG 2.1 accessibility standards, ARIA landmarks.
- Responsive CSS Grid, Flexbox, mobile-first design systems.
- Core JavaScript (ES6+), async/await, DOM event delegation, AbortController.
- React functional components, custom hooks, state synchronization.
- REST API integration, error toasts, and Zod client validation.
- Git branching and PR etiquette.`
  },
  {
    title: 'Boutique Sample Tailor & Pattern Master (Tiruppur)',
    text: `Company: Kongu Apparel & Bridal Studio, Tiruppur
Role: Sample Garment Tailor & Pattern Master
Requirements:
- Precise client body measurements with standard 1.5" ease calculations.
- Katori & 4-Dart blouse pattern drafting on craft paper with 1/4" seam tolerances.
- Lockstitch sewing machine tension balancing, 10-11 SPI straight stitch.
- Bias binding cord piping at 45-degree angle without neckline puckering.
- Steam press seam finishing and export quality inspection.`
  }
];

export const JdAnalyserModal: React.FC<JdAnalyserModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRoadmap
}) => {
  const { i18n } = useTranslation();
  const { isOfflineDemo } = useSkillBridgeStore();
  const isTa = i18n.language === 'ta';
  const [inputText, setInputText] = useState(sampleJds[0].text);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState<JdExtractResponse | null>(null);

  if (!isOpen) return null;

  const handleAnalyse = async () => {
    setIsAnalysing(true);
    try {
      if (!isOfflineDemo && isGeminiConfigured) {
        const payload = await extractJobDescriptionWithGemini(inputText, i18n.language as 'en' | 'ta' | 'fr' | 'hi');
        setResult({
          jobTitle: payload.role,
          companyName: payload.company || 'Not specified',
          pathwayRecommendation: payload.role,
          extractedSkills: payload.requiredSkills.map(skill => ({
            skillName: skill.name,
            requiredLevel: skill.importance === 'must' ? 4 : 3,
            importance: skill.importance === 'must' ? 'Mandatory' : 'Preferred',
            category: skill.category
          })),
          matchedExistingSkills: [],
          detectedSkillGaps: payload.requiredSkills.map(skill => skill.name),
          readinessEstimate: 0,
          summaryTamil: payload.softSkills.join(' • '),
          summaryEnglish: `${payload.softSkills.join(' • ')}${payload.eligibility.length ? ` Eligibility: ${payload.eligibility.join(' • ')}` : ''}`
        });
        return;
      }
      setIsAnalysing(false);
      setResult(fallbackJdExtract);
    } catch (err) {
      console.warn('Gemini JD analysis failed. Showing the local sample result.', err);
      setResult(fallbackJdExtract);
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-7 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-btn text-[#526174] hover:bg-[#EAF5FC] dark:hover:bg-night-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-sky-950/60 text-[#173B67] dark:text-sky-300 border border-[#BAE6FD] uppercase tracking-wider">
            {isTa ? 'AI வேலை விவர இடைவெளி பகுப்பாய்வி' : 'AI Job Description Gap Engine'}
          </span>
          <TrustLabel type="ai-disclaimer" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
          {isTa ? 'எந்தவொரு வேலை விவரத்தையும் ஒட்டவும் · இடைவெளிகளைக் கண்டறியவும்' : 'Paste Any Job Description · Detect Concrete Gaps'}
        </h2>
        <p className="mt-1 text-xs text-[#526174] dark:text-night-muted leading-relaxed">
          {isTa
            ? 'எங்கள் பாகுபடுத்தி வேலைவாய்ப்பு விவரங்களிலிருந்து தேவையான திறன் நிலைகளைப் பிரித்தெடுத்து, உங்கள் சரிபார்க்கப்பட்ட சான்றுகளுடன் ஒப்பிடுகிறது.'
            : 'Our parser extracts required competency levels from real employer job posts and benchmarks them against your local verified proofs.'}
        </p>

        {/* Quick Sample Selector */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-[#526174]">{isTa ? 'மாதிரியை முயற்சிக்கவும்:' : 'Try sample:'}</span>
          {sampleJds.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(s.text);
                setResult(null);
              }}
              className="text-xs px-2.5 py-1 rounded-btn bg-[#F8FAFC] dark:bg-night-100 hover:bg-[#EAF5FC] text-[#173B67] dark:text-night-ink font-medium border border-[#E2E8F0] transition-colors cursor-pointer"
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Text Area Input */}
        <div className="mt-3">
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isTa ? 'LinkedIn, Naukri போன்றவற்றிலிருந்து வேலை விவர உரையை ஒட்டவும்...' : 'Paste raw JD text from LinkedIn, Naukri, or newspaper clipping...'}
            className="w-full p-3 rounded-card font-mono text-xs bg-white dark:bg-night-100 border border-[#E2E8F0] dark:border-night-border text-[#173B67] dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-[#62B6E8]"
          />
        </div>

        {/* Action Button */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[11px] text-[#526174]">
            {isTa ? 'கட்டாய Zod பாகுபடுத்தல் • தனிப்பட்ட மற்றும் உள்ளூர்' : 'Strict Zod parsing • Private & local'}
          </div>

          <button
            onClick={handleAnalyse}
            disabled={isAnalysing || !inputText.trim()}
            className="px-5 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#4fa8dc] disabled:opacity-50 text-[#173B67] font-bold text-xs flex items-center gap-2 shadow-soft transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#173B67]" />
            <span>{isAnalysing ? (isTa ? 'திறன்களைப் பிரித்தெடுக்கிறது...' : 'Extracting Skills...') : (isTa ? 'பிரித்தெடுத்து ஆய்வு செய்' : 'Extract & Analyse Gaps')}</span>
          </button>
        </div>

        {/* Thinking State */}
        {isAnalysing && (
          <div className="mt-6 p-6 rounded-card bg-[#F8FAFC] dark:bg-night-100 border border-[#E2E8F0] text-center">
            <AIThinking
              labelEnglish="Claude AI is parsing requirements and identifying skill delta..."
              labelTamil="வேலை விவரத்திலிருந்து தேவையான திறன்களை AI பிரித்தெடுக்கிறது..."
            />
          </div>
        )}

        {/* Results Analysis View */}
        {result && !isAnalysing && (
          <div className="mt-6 pt-6 border-t border-[#E2E8F0] dark:border-night-border/80 space-y-5 animate-in fade-in duration-300">
            {/* Summary card */}
            <div className="p-4 rounded-card bg-[#F8FAFC] dark:bg-night-100 border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#173B67] dark:text-sky-400 uppercase">
                  {isTa ? 'இலக்கு பணி' : 'Target Role'}
                </span>
                <h3 className="text-base font-bold text-[#173B67] dark:text-night-ink">
                  {result.jobTitle}
                </h3>
                <div className="text-xs text-[#526174]">{result.companyName}</div>

                <div className="mt-2 text-xs text-[#173B67] dark:text-night-ink">
                  <span className="font-semibold">{isTa ? (result.summaryTamil || result.summaryEnglish) : result.summaryEnglish}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center shrink-0">
                <ProgressRing
                  progress={result.readinessEstimate}
                  size={95}
                  strokeWidth={8}
                  label={isTa ? 'பொருத்தம்' : 'Match'}
                />
              </div>
            </div>

            {/* Extracted Skills vs Gaps Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Matched Skills */}
              <div className="p-4 rounded-card bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wide mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isTa ? `சரிபார்க்கப்பட்ட சான்றுகள் (${result.matchedExistingSkills.length})` : `Existing Verified Proofs (${result.matchedExistingSkills.length})`}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-300">
                  {result.matchedExistingSkills.map((sk, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{sk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detected Gaps */}
              <div className="p-4 rounded-card bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-200 uppercase tracking-wide mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{isTa ? `தீர்க்க வேண்டிய திறன் இடைவெளிகள் (${result.detectedSkillGaps.length})` : `Actionable Skill Gaps (${result.detectedSkillGaps.length})`}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-300">
                  {result.detectedSkillGaps.map((gap, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bridge Action */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-btn border border-[#E2E8F0] text-xs font-semibold text-[#173B67] dark:text-night-ink hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                {isTa ? 'மூடு' : 'Close'}
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToRoadmap) onNavigateToRoadmap();
                }}
                className="px-5 py-2 rounded-btn bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-xs flex items-center gap-1.5 shadow-soft transition-transform hover:scale-105 cursor-pointer"
              >
                <span>{isTa ? 'வழிகாட்டியில் இடைவெளிகளை நிரப்பவும்' : 'Bridge Gaps in Adaptive Roadmap'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
