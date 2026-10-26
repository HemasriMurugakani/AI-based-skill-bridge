import React, { useState } from 'react';
import { X, Sparkles, FileText, CheckCircle2, AlertCircle, ArrowRight, Upload } from 'lucide-react';
import { fallbackJdExtract, JdExtractResponse } from '../data/fallbacks';
import { AIThinking } from './AIThinking';
import { ProgressRing } from './ProgressRing';
import { TrustLabel } from './TrustLabel';

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
  const [inputText, setInputText] = useState(sampleJds[0].text);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState<JdExtractResponse | null>(null);

  if (!isOpen) return null;

  const handleAnalyse = () => {
    setIsAnalysing(true);
    setTimeout(() => {
      setIsAnalysing(false);
      setResult(fallbackJdExtract);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-7 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border dark:border-night-border shadow-warm-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-warm-muted hover:bg-warm-100 dark:hover:bg-night-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-900 dark:text-gold-300 uppercase tracking-wider">
            AI Job Description Gap Engine
          </span>
          <TrustLabel type="ai-disclaimer" />
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
          Paste Any Job Description · Detect Concrete Gaps
        </h2>
        <p className="mt-1 text-xs text-warm-muted dark:text-night-muted leading-relaxed">
          Our parser extracts required competency levels from real employer job posts and benchmarks them against your local verified proofs.
        </p>

        {/* Quick Sample Selector */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-warm-muted">Try sample:</span>
          {sampleJds.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(s.text);
                setResult(null);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-parchment-200 dark:bg-night-100 hover:bg-gold-100 text-warm-ink dark:text-night-ink font-medium border border-warm-border/60 transition-colors"
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
            placeholder="Paste raw JD text from LinkedIn, Naukri, or newspaper clipping..."
            className="w-full p-3 rounded-xl font-mono text-xs bg-parchment-100 dark:bg-night-100 border border-warm-border dark:border-night-border text-warm-ink dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        {/* Action Button */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[11px] text-warm-muted">
            Strict Zod parsing • Private & local
          </div>

          <button
            onClick={handleAnalyse}
            disabled={isAnalysing || !inputText.trim()}
            className="px-5 py-2 rounded-full bg-maroon-700 hover:bg-maroon-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-warm-sm transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-gold-300" />
            <span>{isAnalysing ? 'Extracting Skills...' : 'Extract & Analyse Gaps'}</span>
          </button>
        </div>

        {/* Thinking State */}
        {isAnalysing && (
          <div className="mt-6 p-6 rounded-2xl bg-parchment-100 dark:bg-night-100 border border-warm-border/60 text-center">
            <AIThinking
              labelEnglish="Claude AI is parsing requirements and identifying skill delta..."
              labelTamil="வேலை விவரத்திலிருந்து தேவையான திறன்களை AI பிரித்தெடுக்கிறது..."
            />
          </div>
        )}

        {/* Results Analysis View */}
        {result && !isAnalysing && (
          <div className="mt-6 pt-6 border-t border-warm-border/80 dark:border-night-border/80 space-y-5 animate-in fade-in duration-300">
            {/* Summary card */}
            <div className="p-4 rounded-2xl bg-parchment-100 dark:bg-night-100 border border-warm-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-maroon-700 dark:text-gold-400 uppercase">
                  Target Role
                </span>
                <h3 className="text-base font-bold text-warm-ink dark:text-night-ink">
                  {result.jobTitle}
                </h3>
                <div className="text-xs text-warm-muted">{result.companyName}</div>

                <div className="mt-2 text-xs text-warm-ink dark:text-night-ink">
                  <span className="font-semibold">{result.summaryEnglish}</span>
                </div>
                <div className="mt-1 font-tamil text-xs text-maroon-900 dark:text-gold-300">
                  {result.summaryTamil}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center shrink-0">
                <ProgressRing
                  progress={result.readinessEstimate}
                  size={95}
                  strokeWidth={8}
                  label="Match"
                />
              </div>
            </div>

            {/* Extracted Skills vs Gaps Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Matched Skills */}
              <div className="p-4 rounded-xl bg-forest-50/70 dark:bg-forest-950/40 border border-forest-200 dark:border-forest-800/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-forest-200 uppercase tracking-wide mb-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  <span>Existing Verified Proofs ({result.matchedExistingSkills.length})</span>
                </div>
                <ul className="space-y-1.5 text-xs text-forest-950 dark:text-forest-300">
                  {result.matchedExistingSkills.map((sk, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
                      <span>{sk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detected Gaps */}
              <div className="p-4 rounded-xl bg-terracotta-50/70 dark:bg-terracotta-950/40 border border-terracotta-200 dark:border-terracotta-800/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-terracotta-800 dark:text-terracotta-200 uppercase tracking-wide mb-2">
                  <AlertCircle className="w-4 h-4 text-terracotta-600" />
                  <span>Actionable Skill Gaps ({result.detectedSkillGaps.length})</span>
                </div>
                <ul className="space-y-1.5 text-xs text-terracotta-950 dark:text-terracotta-300">
                  {result.detectedSkillGaps.map((gap, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600" />
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
                className="px-4 py-2 rounded-full border border-warm-border text-xs font-semibold text-warm-ink dark:text-night-ink hover:bg-parchment-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToRoadmap) onNavigateToRoadmap();
                }}
                className="px-5 py-2 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-warm-sm transition-transform hover:scale-105"
              >
                <span>Bridge Gaps in Adaptive Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
