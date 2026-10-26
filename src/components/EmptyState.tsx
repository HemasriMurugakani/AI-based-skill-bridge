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
      className={`p-8 sm:p-12 text-center rounded-3xl bg-parchment-50/80 dark:bg-night-card border border-dashed border-warm-border/90 dark:border-night-border/90 max-w-2xl mx-auto my-6 shadow-warm-xs ${className}`}
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-parchment-200/70 dark:bg-night-100 flex items-center justify-center text-maroon-700 dark:text-gold-400 border border-warm-border dark:border-night-border shadow-warm-xs">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-warm-ink dark:text-night-ink">
        {title}
      </h3>
      {titleTamil && (
        <div className="font-tamil text-sm font-semibold text-warm-muted dark:text-night-muted mt-0.5">
          {titleTamil}
        </div>
      )}

      <p className="mt-2.5 text-xs sm:text-sm text-warm-muted dark:text-night-muted leading-relaxed max-w-lg mx-auto">
        {description}
      </p>
      {descriptionTamil && (
        <p className="font-tamil text-xs text-warm-muted/80 dark:text-night-muted/80 mt-1 leading-relaxed max-w-lg mx-auto">
          {descriptionTamil}
        </p>
      )}

      {(onAction || onSecondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onAction && actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs shadow-warm-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{actionLabel}</span>
              {actionLabelTamil && (
                <span className="font-tamil text-[11px] opacity-85">({actionLabelTamil})</span>
              )}
            </button>
          )}

          {onSecondaryAction && secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:border-gold-400 border border-warm-border dark:border-night-border font-medium text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>{secondaryActionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
