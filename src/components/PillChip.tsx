import React from 'react';

export interface PillChipProps {
  label: string;
  labelTamil?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'maroon' | 'gold' | 'forest' | 'terracotta' | 'outline';
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
    default: 'bg-parchment-200/90 text-warm-ink border border-warm-border dark:bg-night-100 dark:text-night-ink dark:border-night-border',
    maroon: 'bg-maroon-50 text-maroon-800 border border-maroon-200 dark:bg-maroon-950/60 dark:text-maroon-200 dark:border-maroon-800/60',
    gold: 'bg-gold-50 text-gold-900 border border-gold-200 dark:bg-gold-950/60 dark:text-gold-200 dark:border-gold-800/60',
    forest: 'bg-forest-50 text-forest-800 border border-forest-200 dark:bg-forest-950/60 dark:text-forest-200 dark:border-forest-800/60',
    terracotta: 'bg-terracotta-50 text-terracotta-800 border border-terracotta-200 dark:bg-terracotta-950/60 dark:text-terracotta-200 dark:border-terracotta-800/60',
    outline: 'bg-transparent text-warm-muted border border-warm-border dark:border-night-border dark:text-night-muted'
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
        isClickable ? 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-warm-sm' : ''
      } ${className}`}
    >
      {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
      <span className="truncate">
        {labelTamil ? (
          <span className="inline-flex flex-col text-left leading-normal py-0.5">
            <span className="font-tamil text-[10px] text-warm-muted dark:text-night-muted font-normal leading-normal">{labelTamil}</span>
            <span className="leading-tight">{label}</span>
          </span>
        ) : (
          label
        )}
      </span>
    </span>
  );
};
