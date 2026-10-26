import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'card':
        return 'rounded-2xl border border-warm-border/60 dark:border-night-border/60 p-4';
      case 'text':
        return 'rounded-md h-4 my-1';
      case 'rectangular':
      default:
        return 'rounded-xl';
    }
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      style={style}
      aria-hidden="true"
      className={`relative overflow-hidden bg-parchment-300/60 dark:bg-night-100/70 animate-pulse ${getVariantStyles()} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
    </div>
  );
};

export const SkeletonCard: React.FC<{ lines?: number; hasAvatar?: boolean; className?: string }> = ({
  lines = 3,
  hasAvatar = true,
  className = '',
}) => {
  return (
    <div className={`p-5 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border/70 dark:border-night-border shadow-warm-sm space-y-4 ${className}`}>
      {hasAvatar && (
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="w-12 h-12 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4 h-4" />
            <Skeleton variant="text" className="w-1/2 h-3" />
          </div>
        </div>
      )}
      <div className="space-y-2 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            className={i === lines - 1 ? 'w-4/5 h-3.5' : 'w-full h-3.5'}
          />
        ))}
      </div>
      <div className="pt-2 flex items-center justify-between gap-3">
        <Skeleton variant="rectangular" className="w-24 h-8 rounded-full" />
        <Skeleton variant="rectangular" className="w-20 h-8 rounded-full" />
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number; columns?: string; className?: string }> = ({
  count = 6,
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  className = '',
}) => {
  return (
    <div className={`grid ${columns} gap-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
