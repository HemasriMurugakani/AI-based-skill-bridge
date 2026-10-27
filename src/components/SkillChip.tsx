import React from 'react';
import { SkillState } from '../types';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SkillChipProps {
  name: string;
  nameTamil?: string;
  state: SkillState;
  score?: number;
  level?: number;
  evidenceCount?: number;
  showEvidenceBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SkillChip: React.FC<SkillChipProps> = ({
  name,
  nameTamil,
  state,
  score,
  level = 1,
  evidenceCount = 0,
  showEvidenceBadge = true,
  className = '',
  onClick
}) => {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  const config = {
    strong: {
      label: t('skills.strong'),
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800/80',
      dotColor: 'bg-emerald-600 dark:bg-emerald-400',
    },
    develop: {
      label: t('skills.develop'),
      icon: <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800/80',
      dotColor: 'bg-amber-500 dark:bg-amber-400',
    },
    not_assessed: {
      label: t('skills.notAssessed'),
      icon: <HelpCircle className="w-3.5 h-3.5 text-[#526174] dark:text-night-muted" />,
      badgeBg: 'bg-[#F8FAFC] text-[#526174] border-[#E2E8F0] dark:bg-night-100 dark:text-night-muted dark:border-night-border',
      dotColor: 'bg-slate-400 dark:bg-night-muted',
    },
    gap: {
      label: t('skills.gap'),
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
      badgeBg: 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800/80',
      dotColor: 'bg-rose-500 dark:bg-rose-400',
    }
  }[state];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`inline-flex flex-col p-2.5 rounded-card border transition-all duration-200 ${
        config.badgeBg
      } ${
        onClick ? 'cursor-pointer hover:shadow-soft hover:scale-[1.02] active:scale-[0.98]' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {config.icon}
          <span className="text-[11px] font-semibold tracking-wide uppercase">{config.label}</span>
        </div>

        {score !== undefined && (
          <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-black/40 shadow-xs">
            {score}%
          </span>
        )}
      </div>

      <div className="mt-1">
        <div className={`text-sm font-semibold text-[#173B67] dark:text-white line-clamp-1 ${isTa ? 'font-tamil' : ''}`}>
          {isTa ? (nameTamil || name) : name}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-black/5 dark:border-white/5">
        {/* Level indicator dots */}
        <div className="flex items-center gap-1" title={`${isTa ? 'நிலை' : 'Level'} ${level} of 5`}>
          <span className="text-[10px] text-[#526174] dark:text-night-muted mr-1">{isTa ? `நிலை ${level}` : `Lvl ${level}`}</span>
          {[1, 2, 3, 4, 5].map((dot) => (
            <span
              key={dot}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                dot <= level ? config.dotColor : 'bg-black/10 dark:bg-white/10'
              }`}
            />
          ))}
        </div>

        {showEvidenceBadge && evidenceCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> {evidenceCount} {isTa ? 'சான்றுகள்' : (evidenceCount === 1 ? 'proof' : 'proofs')}
          </span>
        )}
      </div>
    </div>
  );
};
