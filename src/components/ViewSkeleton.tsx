import React from 'react';
import { Skeleton, SkeletonCard } from './Skeleton';
import { Sparkles } from 'lucide-react';

export const ViewSkeleton: React.FC<{ title?: string; titleTamil?: string }> = ({
  title = 'Loading SkillBridge Module...',
  titleTamil = 'திறன் பாலம் தொகுதியை ஏற்றுகிறது...',
}) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="space-y-6 max-w-7xl mx-auto px-1 py-4 animate-fadeIn"
    >
      {/* Top Banner Skeleton */}
      <div className="p-6 rounded-3xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2.5 max-w-xl w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/15 text-gold-800 dark:text-gold-300 text-xs font-bold border border-gold-400/30">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{title}</span>
            <span className="font-tamil text-[11px] opacity-80">({titleTamil})</span>
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
