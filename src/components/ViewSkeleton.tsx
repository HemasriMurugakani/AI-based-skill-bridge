import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton, SkeletonCard } from './Skeleton';
import { Sparkles } from 'lucide-react';

export const ViewSkeleton: React.FC<{ title?: string; titleTamil?: string }> = ({
  title = 'Loading SkillBridge Module...',
  titleTamil = 'திறன் பாலம் தொகுதியை ஏற்றுகிறது...',
}) => {
  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="space-y-6 max-w-7xl mx-auto px-1 py-4 animate-fadeIn"
    >
      {/* Top Banner Skeleton */}
      <div className="p-6 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2.5 max-w-xl w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FC] text-[#173B67] dark:bg-sky-950/60 dark:text-sky-300 text-xs font-bold border border-[#BAE6FD]">
            <Sparkles className="w-3.5 h-3.5 text-[#62B6E8] animate-spin" />
            <span>{isTa ? titleTamil : title}</span>
          </div>
          <Skeleton variant="text" className="w-3/4 h-8" />
          <Skeleton variant="text" className="w-5/6 h-4" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Skeleton variant="rectangular" className="w-28 h-10 rounded-full" />
          <Skeleton variant="rectangular" className="w-32 h-10 rounded-full" />
        </div>
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
      </div>

      <span className="sr-only">Content is loading. Please wait.</span>
    </div>
  );
};
