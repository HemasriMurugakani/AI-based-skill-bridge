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
    <div className={`relative flex flex-col items-center justify-center my-6 ${className}`}>
      <div className="w-full flex items-center justify-center gap-3">
        {/* Left subtle rule */}
        <div className="h-[1px] flex-1 bg-[#E2E8F0] dark:bg-night-border" />

        {/* Center Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-night-100 border border-[#E2E8F0] shadow-soft text-xs font-semibold text-[#173B67] dark:text-sky-300">
          <span className="w-2 h-2 rounded-full bg-[#62B6E8]" />
          <span>Skill-to-Opportunity Bridge</span>
        </div>

        {/* Right subtle rule */}
        <div className="h-[1px] flex-1 bg-[#E2E8F0] dark:bg-night-border" />
      </div>

      {showLabels && (
        <div className="flex items-center gap-6 mt-2 text-[11px] font-medium uppercase tracking-wider text-[#526174] dark:text-night-muted">
          <span className="flex items-center gap-1.5 text-deepblue-700 dark:text-sky-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-deepblue-600" /> 1. Identify
          </span>
          <span className="text-sky-400">→</span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 2. Learn & Practise
          </span>
          <span className="text-sky-400">→</span>
          <span className="flex items-center gap-1.5 text-forest-700 dark:text-forest-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-600" /> 3. Prove
          </span>
          <span className="text-sky-400">→</span>
          <span className="flex items-center gap-1.5 text-deepblue-700 dark:text-sky-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-deepblue-700" /> 4. Adapt
          </span>
        </div>
      )}
    </div>
  );
};
