import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, Info } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'verified' | 'attention' | 'error' | 'neutral' | 'info';
  children: React.ReactNode;
  icon?: boolean | React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon = true,
  className = '',
  ...props
}) => {
  const variantConfig = {
    verified: {
      style: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
      defaultIcon: <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />,
    },
    attention: {
      style: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
      defaultIcon: <AlertTriangle className="w-3.5 h-3.5 text-[#F2B66D] shrink-0" />,
    },
    error: {
      style: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
      defaultIcon: <AlertCircle className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />,
    },
    neutral: {
      style: 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]',
      defaultIcon: <HelpCircle className="w-3.5 h-3.5 text-[#64748B] shrink-0" />,
    },
    info: {
      style: 'bg-[#EAF5FC] text-[#173B67] border-[#BAE6FD]',
      defaultIcon: <Info className="w-3.5 h-3.5 text-[#173B67] shrink-0" />,
    },
  }[variant];

  const renderIcon = () => {
    if (icon === false) return null;
    if (icon === true) return variantConfig.defaultIcon;
    return icon;
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-poppins font-semibold select-none shadow-2xs ${variantConfig.style} ${className}`}
      {...props}
    >
      {renderIcon()}
      <span>{children}</span>
    </span>
  );
};
