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
      icon: <Sparkles className="w-3.5 h-3.5 text-maroon-700 dark:text-gold-400" />,
      style: 'bg-maroon-50 text-maroon-800 border-maroon-200/80 dark:bg-maroon-950/60 dark:text-maroon-200 dark:border-maroon-800/60',
      description: 'Validated via AI rubric parsing model'
    },
    mentor_verified: {
      label: mentorName ? `${t('statuses.mentorVerified')} (${mentorName})` : t('statuses.mentorVerified'),
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />,
      style: 'bg-forest-50 text-forest-800 border-forest-200/80 dark:bg-forest-950/60 dark:text-forest-200 dark:border-forest-800/60',
      description: 'Endorsed by accredited industry or master artisan'
    },
    pending_mentor: {
      label: t('statuses.pendingMentor'),
      icon: <Clock className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />,
      style: 'bg-gold-50 text-gold-800 border-gold-200/80 dark:bg-gold-950/60 dark:text-gold-200 dark:border-gold-800/60',
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
