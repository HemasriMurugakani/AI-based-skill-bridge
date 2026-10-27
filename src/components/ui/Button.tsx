import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  icon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-poppins font-semibold transition-all duration-150 cursor-pointer select-none rounded-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62B6E8] focus-visible:ring-offset-2 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 min-h-[40px]',
    lg: 'text-base px-5 py-2.5 min-h-[48px]',
  }[size];

  const variantStyles = {
    primary: disabled
      ? 'bg-[#E2E8F0] text-[#94A3B8]'
      : 'bg-[#62B6E8] text-[#173B67] hover:bg-[#4EB0E8] active:bg-[#389EDB] shadow-sm',
    secondary: disabled
      ? 'bg-white text-[#94A3B8] border border-[#E2E8F0]'
      : 'bg-white text-[#173B67] border border-[#173B67] hover:bg-[#D9EFFB] active:bg-[#C5E6F8]',
    ghost: disabled
      ? 'bg-transparent text-[#94A3B8]'
      : 'bg-transparent text-[#173B67] hover:bg-[#D9EFFB] active:bg-[#C5E6F8]',
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
