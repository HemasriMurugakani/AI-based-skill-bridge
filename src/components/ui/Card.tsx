import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-card border transition-all duration-200 text-[#173B67]';

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding];

  const variantStyles = {
    default: 'bg-white border-[#E2E8F0] shadow-soft',
    highlight: 'bg-[#EAF5FC] border-[#BAE6FD] shadow-soft',
    interactive: 'bg-white border-[#E2E8F0] shadow-soft hover:border-[#62B6E8] hover:shadow-soft cursor-pointer hover:-translate-y-0.5',
  }[variant];

  return (
    <div
      className={`${baseStyles} ${paddingStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
