import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../types';
import confetti from 'canvas-confetti';
import * as Icons from 'lucide-react';
import { Lock, ShieldCheck } from 'lucide-react';

export interface BadgeMedalProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
  onSelect?: (badge: Badge) => void;
}

export const BadgeMedal: React.FC<BadgeMedalProps> = ({
  badge,
  size = 'md',
  showDetails = true,
  className = '',
  onSelect
}) => {
  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const triggerConfetti = (e: React.MouseEvent) => {
    if (badge.isUnlocked) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x, y },
        colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
      });
    }
    if (onSelect) onSelect(badge);
  };

  // Dynamic Lucide icon lookup
  // @ts-ignore
  const IconComponent = Icons[badge.icon] || Icons.Award;

  const medalStyles = {
    bronze: {
      rim: 'border-amber-700/60 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100',
      glow: 'shadow-[0_0_15px_rgba(180,83,9,0.25)]',
      ribbon: 'bg-amber-800'
    },
    silver: {
      rim: 'border-slate-300 bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 text-slate-900',
      glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]',
      ribbon: 'bg-slate-700'
    },
    gold: {
      rim: 'border-amber-400 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-amber-950',
      glow: 'shadow-[0_0_15px_rgba(242,182,109,0.3)]',
      ribbon: 'bg-[#173B67]'
    },
    diamond: {
      rim: 'border-cyan-300 bg-gradient-to-br from-cyan-100 via-sky-300 to-blue-600 text-blue-950',
      glow: 'shadow-[0_0_20px_rgba(56,189,248,0.4)]',
      ribbon: 'bg-indigo-900'
    }
  }[badge.level];

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  return (
    <div
      onClick={triggerConfetti}
      className={`group relative flex flex-col items-center text-center p-3.5 rounded-card border transition-all duration-300 cursor-pointer ${
        badge.isUnlocked
          ? 'bg-white dark:bg-night-card border-[#E2E8F0] dark:border-night-border hover:shadow-soft hover:-translate-y-1'
          : 'bg-slate-50 dark:bg-night-100/30 border-[#E2E8F0]/40 opacity-60 grayscale hover:grayscale-0'
      } ${className}`}
    >
      {/* Medal Medallion */}
      <div className="relative mb-2">
        {/* Ribbon banner on top */}
        <div
          className={`mx-auto w-6 h-3 rounded-t-sm ${medalStyles.ribbon} opacity-80`}
          aria-hidden="true"
        />

        <div
          className={`relative flex items-center justify-center rounded-full border-2 p-2 ${
            sizeClasses[size]
          } ${medalStyles.rim} ${badge.isUnlocked ? medalStyles.glow : ''}`}
        >
          {badge.isUnlocked ? (
            <IconComponent className="w-6 h-6 stroke-[2.2] drop-shadow-sm" />
          ) : (
            <Lock className="w-5 h-5 text-[#526174]" />
          )}

          {/* Concentric ring accents */}
          <div className="absolute inset-0.5 rounded-full border border-white/30 pointer-events-none" />
        </div>
      </div>

      {showDetails && (
        <div className="flex flex-col items-center max-w-[160px]">
          <h4 className={`text-xs font-bold text-[#173B67] dark:text-white line-clamp-1 ${isTa ? 'font-tamil' : ''}`}>
            {isTa ? (badge.titleTamil || badge.title) : badge.title}
          </h4>

          {/* Trust Principle Badge Note */}
          <div className="mt-1 flex items-center gap-1 text-[9px] text-[#526174] dark:text-night-muted">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="italic truncate" title={isTa ? 'சான்று அடிப்படையிலானது' : 'Evidence-backed, not a formal certification'}>
              {isTa ? 'சான்றுடையது' : 'Evidence-backed'}
            </span>
          </div>

          {badge.unlockedAt && (
            <span className="mt-1 text-[10px] text-[#62B6E8] font-semibold">
              {isTa ? 'திறக்கப்பட்டது' : 'Unlocked'} {badge.unlockedAt}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
