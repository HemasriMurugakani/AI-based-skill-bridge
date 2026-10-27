import React from 'react';
import { SearchX, Sparkles, RefreshCw } from 'lucide-react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  titleTamil?: string;
  description: string;
  descriptionTamil?: string;
  actionLabel?: string;
  actionLabelTamil?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = SearchX,
  title,
  titleTamil,
  description,
  descriptionTamil,
  actionLabel,
  actionLabelTamil,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  const { language } = useSkillBridgeStore();
  const isTa = language === 'ta';

  const displayTitle = isTa && titleTamil ? titleTamil : title;
  const displayDesc = isTa && descriptionTamil ? descriptionTamil : description;
  const displayAction = isTa && actionLabelTamil ? actionLabelTamil : actionLabel;

  return (
    <div
      role="region"
      aria-label={displayTitle}
      className={`p-8 sm:p-12 text-center rounded-card bg-white border border-[#E2E8F0] dark:bg-night-card dark:border-night-border max-w-2xl mx-auto my-6 shadow-soft ${className}`}
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-btn bg-[#EAF5FC] dark:bg-night-100 flex items-center justify-center text-[#173B67] dark:text-sky-300 border border-[#BAE6FD] dark:border-night-border">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className={`text-xl font-bold font-poppins text-[#173B67] dark:text-white ${isTa && titleTamil ? 'font-tamil' : ''}`}>
        {displayTitle}
      </h3>

      <p className={`mt-2 text-sm text-[#526174] dark:text-night-muted leading-relaxed max-w-lg mx-auto ${isTa && descriptionTamil ? 'font-tamil' : ''}`}>
        {displayDesc}
      </p>

      {(onAction || onSecondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onAction && displayAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#4EB0E8] text-[#173B67] font-semibold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className={isTa && actionLabelTamil ? 'font-tamil' : ''}>{displayAction}</span>
            </button>
          )}

          {onSecondaryAction && secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-white dark:bg-night-100 text-[#173B67] dark:text-white hover:bg-[#D9EFFB] border border-[#173B67] font-semibold text-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F2B66D]" />
              <span>{secondaryActionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
