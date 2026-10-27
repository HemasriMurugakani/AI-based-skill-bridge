import React from 'react';
import { VerificationStatus } from '../types';
import { Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface StatusPillProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
  className?: string;
  mentorName?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = 'md',
  className = '',
  mentorName
}) => {
  const { t } = useTranslation();

  const configs = {
    ai_reviewed: {
      label: t('statuses.aiReviewed'),
      icon: <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />,
      style: 'bg-[#EAF5FC] text-[#173B67] border-[#BAE6FD] dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800/60',
      description: 'Validated via AI rubric parsing model'
    },
    mentor_verified: {
      label: mentorName ? `${t('statuses.mentorVerified')} (${mentorName})` : t('statuses.mentorVerified'),
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      style: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800/60',
      description: 'Endorsed by accredited industry or master artisan'
    },
    pending_mentor: {
      label: t('statuses.pendingMentor'),
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      style: 'bg-amber-50 text-amber-900 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800/60',
      description: 'Submitted to mentor verification queue'
    }
  }[status];

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium select-none shadow-xs transition-colors ${
        configs.style
      } ${sizeClasses} ${className}`}
      title={configs.description}
    >
      <span className="shrink-0">{configs.icon}</span>
      <span className="font-semibold">{configs.label}</span>
    </span>
  );
};
