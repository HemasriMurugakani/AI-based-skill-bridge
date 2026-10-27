import React from 'react';

export interface PillChipProps {
  label: string;
  labelTamil?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'sky' | 'amber' | 'emerald' | 'rose' | 'outline' | 'maroon' | 'gold' | 'forest' | 'terracotta';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const PillChip: React.FC<PillChipProps> = ({
  label,
  labelTamil,
  icon,
  variant = 'default',
  size = 'md',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs md:text-sm px-3.5 py-1 gap-2',
    lg: 'text-sm px-4 py-1.5 gap-2.5'
  };

  const variantClasses = {
    default: 'bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD] dark:bg-deepblue-950/60 dark:text-sky-200 dark:border-sky-800/60',
    primary: 'bg-[#173B67] text-white border border-[#173B67] dark:bg-[#173B67] dark:text-white',
    sky: 'bg-sky-50 text-sky-900 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800/60',
    maroon: 'bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD] dark:bg-deepblue-950/60 dark:text-sky-200 dark:border-sky-800/60',
    gold: 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800/60',
    amber: 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800/60',
    forest: 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800/60',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800/60',
    terracotta: 'bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800/60',
    rose: 'bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800/60',
    outline: 'bg-transparent text-[#526174] border border-[#E2E8F0] dark:border-night-border dark:text-night-muted'
  };

  const isClickable = !!onClick;

  return (
    <span
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`inline-flex items-center rounded-full font-medium transition-all duration-200 select-none ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        isClickable ? 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-soft' : ''
      } ${className}`}
    >
      {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
      <span className="truncate">
        {labelTamil ? (
          <span className="inline-flex flex-col text-left leading-normal py-0.5">
            <span className="font-tamil text-[10px] text-[#526174] dark:text-night-muted font-normal leading-normal">{labelTamil}</span>
            <span className="leading-tight">{label}</span>
          </span>
        ) : (
          label
        )}
      </span>
    </span>
  );
};
