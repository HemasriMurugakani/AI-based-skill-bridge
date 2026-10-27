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
          className={`inline-flex items-center gap-1.5 text-xs text-[#173B67] hover:text-[#62B6E8] font-medium font-poppins underline underline-offset-2 transition-colors cursor-pointer ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#62B6E8]" />
          <span>{t('skills.howCalculated')}</span>
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-md p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] dark:border-slate-700 shadow-soft font-poppins">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-btn bg-[#EAF5FC] text-[#173B67]">
                    <ShieldCheck className="w-5 h-5 text-[#62B6E8]" />
                  </div>
                  <h3 className="text-base font-bold text-[#173B67] dark:text-white">
                    {t('skills.howCalculated')}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-btn text-[#526174] hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs md:text-sm text-[#526174] dark:text-slate-300 leading-relaxed">
                <p>
                  {explanationText || t('skills.howCalculatedExplanation')}
                </p>
                <div className="p-3 rounded-btn bg-[#EAF5FC]/60 dark:bg-slate-800/60 border border-[#BAE6FD]/60 text-xs">
                  <div className="font-semibold text-[#173B67] dark:text-white mb-1">
                    Guiding Fairness Principle:
                  </div>
                  <div>
                    Unassessed skills are kept strictly <span className="font-semibold text-[#173B67] dark:text-white">neutral ("Not assessed")</span>. They are never classified as "unqualified" or marked in red.
                  </div>
                </div>
                <div className="text-[11px] text-[#526174] dark:text-slate-400 italic">
                  Formula: 45% Submitted Proofs + 30% Viva Defenses + 15% Rubric Checks + 10% Habit Consistency.
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-btn text-xs font-semibold bg-[#62B6E8] text-[#173B67] hover:bg-[#50a7dc] transition-colors shadow-soft cursor-pointer"
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
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium font-poppins bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
        <span>{t('trust.evidenceBacked')}</span>
      </span>
    );
  }

  if (type === 'sample-opportunity') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-poppins bg-[#FCF3E5] text-[#9A5B13] border border-[#F2B66D]/40 uppercase tracking-wider ${className}`}
      >
        <Info className="w-3 h-3 text-[#F2B66D]" />
        <span>{t('trust.sampleOpportunity')}</span>
      </span>
    );
  }

  if (type === 'ai-disclaimer') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-btn text-xs font-poppins bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD] ${className}`}
      >
        <Info className="w-3.5 h-3.5 text-[#62B6E8] shrink-0" />
        <span>{t('trust.aiDisclaimer')}</span>
      </div>
    );
  }

  return null;
};
