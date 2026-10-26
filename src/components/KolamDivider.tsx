import React from 'react';

interface KolamDividerProps {
  className?: string;
  showLabels?: boolean;
}

export const KolamDivider: React.FC<KolamDividerProps> = ({
  className = '',
  showLabels = false
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center my-8 ${className}`}>
      <div className="w-full flex items-center justify-center gap-3">
        {/* Left gold decorative line */}
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-warm-border to-gold-400 dark:via-night-border dark:to-gold-500" />

        {/* Center Kolam Arch Motif */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-parchment-200/80 dark:bg-night-100/80 border border-gold-300/40 dark:border-gold-600/30 shadow-warm-sm">
          <svg className="w-6 h-6 text-maroon-700 dark:text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {/* Kolam central flower / knot */}
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <path d="M12 3C8 8 3 8 3 12C3 16 8 16 12 21C16 16 21 16 21 12C21 8 16 8 12 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="0.75" fill="currentColor" />
            <circle cx="12" cy="17" r="0.75" fill="currentColor" />
            <circle cx="7" cy="12" r="0.75" fill="currentColor" />
            <circle cx="17" cy="12" r="0.75" fill="currentColor" />
          </svg>

          {/* Mini Bridge Arch */}
          <svg className="w-8 h-4 text-gold-600 dark:text-gold-400" viewBox="0 0 40 16" fill="none">
            <path d="M2 14 C10 4, 30 4, 38 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 14 V10 M20 14 V6 M30 14 V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right gold decorative line */}
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-warm-border to-gold-400 dark:via-night-border dark:to-gold-500" />
      </div>

      {showLabels && (
        <div className="flex items-center gap-6 mt-2 text-[11px] font-medium uppercase tracking-wider text-warm-muted dark:text-night-muted">
          <span className="flex items-center gap-1.5 text-maroon-700 dark:text-maroon-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-maroon-600" /> 1. Identify
          </span>
          <span className="text-gold-400">→</span>
          <span className="flex items-center gap-1.5 text-gold-700 dark:text-gold-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-600" /> 2. Learn & Practise
          </span>
          <span className="text-gold-400">→</span>
          <span className="flex items-center gap-1.5 text-forest-700 dark:text-forest-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-600" /> 3. Prove
          </span>
          <span className="text-gold-400">→</span>
          <span className="flex items-center gap-1.5 text-maroon-700 dark:text-gold-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-maroon-700" /> 4. Adapt
          </span>
        </div>
      )}
    </div>
  );
};
