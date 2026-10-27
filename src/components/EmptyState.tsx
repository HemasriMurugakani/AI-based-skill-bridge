import React from 'react';
import { SearchX, Sparkles, RefreshCw } from 'lucide-react';

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
  return (
    <div
      role="region"
      aria-label={title}
      className={`p-8 sm:p-12 text-center rounded-card bg-white border border-[#E2E8F0] dark:bg-night-card dark:border-night-border max-w-2xl mx-auto my-6 shadow-soft ${className}`}
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-btn bg-[#EAF5FC] dark:bg-night-100 flex items-center justify-center text-[#173B67] dark:text-sky-300 border border-[#BAE6FD] dark:border-night-border">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold font-poppins text-[#173B67] dark:text-white">
        {title}
      </h3>
      {titleTamil && (
        <div className="font-tamil text-sm font-semibold text-[#526174] dark:text-night-muted mt-0.5">
          {titleTamil}
        </div>
      )}

      <p className="mt-2 text-sm text-[#526174] dark:text-night-muted leading-relaxed max-w-lg mx-auto">
        {description}
      </p>
      {descriptionTamil && (
        <p className="font-tamil text-xs text-[#526174]/80 dark:text-night-muted/80 mt-1 leading-relaxed max-w-lg mx-auto">
          {descriptionTamil}
        </p>
      )}

      {(onAction || onSecondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onAction && actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#4EB0E8] text-[#173B67] font-semibold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{actionLabel}</span>
              {actionLabelTamil && (
                <span className="font-tamil text-xs opacity-85">({actionLabelTamil})</span>
              )}
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
