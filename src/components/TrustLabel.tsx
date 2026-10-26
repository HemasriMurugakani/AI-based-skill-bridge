import React, { useState } from 'react';
import { ShieldCheck, Info, Sparkles, X, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface TrustLabelProps {
  type: 'evidence-badge' | 'sample-opportunity' | 'ai-disclaimer' | 'how-calculated';
  className?: string;
  explanationText?: string;
}

export const TrustLabel: React.FC<TrustLabelProps> = ({
  type,
  className = '',
  explanationText
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (type === 'how-calculated') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 text-xs text-maroon-700 dark:text-gold-400 hover:text-maroon-900 dark:hover:text-gold-300 font-medium underline underline-offset-2 transition-colors cursor-pointer ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t('skills.howCalculated')}</span>
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-md p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border dark:border-night-border shadow-warm-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gold-100 dark:bg-gold-950/60 text-gold-700 dark:text-gold-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-warm-ink dark:text-night-ink">
                    {t('skills.howCalculated')}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-warm-muted hover:bg-warm-100 dark:hover:bg-night-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs md:text-sm text-warm-muted dark:text-night-muted leading-relaxed">
                <p>
                  {explanationText || t('skills.howCalculatedExplanation')}
                </p>
                <div className="p-3 rounded-xl bg-parchment-200/70 dark:bg-night-100/60 border border-warm-border/60 text-xs">
                  <div className="font-semibold text-warm-ink dark:text-night-ink mb-1">
                    Guiding Fairness Principle:
                  </div>
                  <div>
                    Unassessed skills are kept strictly <span className="font-semibold text-warm-ink dark:text-night-ink">neutral ("Not assessed")</span>. They are never classified as "unqualified" or marked in red.
                  </div>
                </div>
                <div className="text-[11px] text-warm-subtle dark:text-night-muted italic">
                  Formula: 45% Submitted Proofs + 30% Viva Defenses + 15% Rubric Checks + 10% Habit Consistency.
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-maroon-700 text-white hover:bg-maroon-800 transition-colors shadow-warm-sm"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (type === 'evidence-badge') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-forest-50 dark:bg-forest-950/50 text-forest-800 dark:text-forest-300 border border-forest-200 dark:border-forest-800/60 ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
        <span>{t('trust.evidenceBacked')}</span>
      </span>
    );
  }

  if (type === 'sample-opportunity') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gold-100/90 dark:bg-gold-950/70 text-gold-900 dark:text-gold-200 border border-gold-300/80 dark:border-gold-700/60 uppercase tracking-wider ${className}`}
      >
        <Info className="w-3 h-3 text-gold-700 dark:text-gold-300" />
        <span>{t('trust.sampleOpportunity')}</span>
      </span>
    );
  }

  if (type === 'ai-disclaimer') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-parchment-200/60 dark:bg-night-100/60 text-warm-muted dark:text-night-muted border border-warm-border/80 dark:border-night-border ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-maroon-600 dark:text-gold-400 shrink-0" />
        <span>{t('trust.aiDisclaimer')}</span>
      </div>
    );
  }

  return null;
};
