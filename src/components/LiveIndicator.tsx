import React from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { Cpu, HardDrive } from 'lucide-react';

interface LiveIndicatorProps {
  className?: string;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ className = '' }) => {
  const { isOfflineDemo, toggleOfflineDemo } = useSkillBridgeStore();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleOfflineDemo}
      title={isOfflineDemo ? 'Click to switch to Live AI (Claude)' : 'Click to switch to Cached Offline Mode'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer select-none ${
        isOfflineDemo
          ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-300/80 dark:border-amber-700/60 hover:bg-amber-500/20'
          : 'bg-forest-500/10 text-forest-800 dark:text-forest-300 border-forest-300/80 dark:border-forest-700/60 hover:bg-forest-500/20'
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOfflineDemo ? 'bg-amber-500' : 'animate-ping bg-forest-500'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOfflineDemo ? 'bg-amber-600' : 'bg-forest-600'
          }`}
        />
      </span>

      {isOfflineDemo ? (
        <span className="flex items-center gap-1 text-[11px] font-semibold">
          <HardDrive className="w-3 h-3 opacity-70" />
          <span>{t('nav.cachedDemo')}</span>
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[11px] font-semibold">
          <Cpu className="w-3 h-3 text-forest-600 dark:text-forest-400" />
          <span>{t('nav.liveAi')}</span>
        </span>
      )}
    </button>
  );
};
