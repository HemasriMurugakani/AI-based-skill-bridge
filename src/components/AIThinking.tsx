import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface AIThinkingProps {
  label?: string;
  labelEnglish?: string;
  labelTamil?: string;
  stage?: 'analyzing' | 'evaluating_proof' | 'synthesizing_bridge' | 'adapting';
  className?: string;
}

export const AIThinking: React.FC<AIThinkingProps> = ({
  label,
  labelEnglish = "SkillBridge AI is evaluating rubric criteria...",
  labelTamil = "திறன் பாலம் AI சான்றுகளை ஆய்வு செய்கிறது...",
  className = ''
}) => {
  const { i18n } = useTranslation();
  const activeLabel =
    label ||
    (i18n.language === 'ta' && labelTamil
      ? labelTamil
      : labelEnglish);

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
      {/* Animated Bridge Structure */}
      <div className="relative w-48 h-20 flex items-center justify-center">
        <svg
          viewBox="0 0 200 80"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bridge Foundation Base Line */}
          <line
            x1="10"
            y1="70"
            x2="190"
            y2="70"
            stroke="currentColor"
            strokeWidth="3"
            className="text-[#E2E8F0] dark:text-night-border"
            strokeLinecap="round"
          />

          {/* Three Pillar Nodes */}
          {/* Left Pillar: Learn */}
          <circle cx="30" cy="70" r="5" className="fill-[#173B67]" />
          <line x1="30" y1="70" x2="30" y2="35" stroke="#173B67" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Middle Pillar: Prove */}
          <circle cx="100" cy="70" r="5" className="fill-[#62B6E8]" />
          <line x1="100" y1="70" x2="100" y2="20" stroke="#62B6E8" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Right Pillar: Opportunity */}
          <circle cx="170" cy="70" r="5" className="fill-[#F2B66D]" />
          <line x1="170" y1="70" x2="170" y2="35" stroke="#F2B66D" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Bridge Path 1 (Left to Center) */}
          <motion.path
            d="M 30 35 Q 65 15 100 20"
            stroke="#173B67"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Bridge Path 2 (Center to Right) */}
          <motion.path
            d="M 100 20 Q 135 15 170 35"
            stroke="#62B6E8"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Traveling AI Energy Orb along the bridge */}
          <motion.circle
            r="4.5"
            fill="#F2B66D"
            className="filter drop-shadow-[0_0_8px_rgba(242,182,109,0.8)]"
            animate={{
              cx: [30, 100, 170, 100, 30],
              cy: [35, 20, 35, 20, 35],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Geometric Accent dots */}
          <circle cx="65" cy="45" r="2" className="fill-[#62B6E8]/40" />
          <circle cx="135" cy="45" r="2" className="fill-[#F2B66D]/40" />
        </svg>
      </div>

      {/* Bridge Pillar Stages */}
      <div className="flex items-center gap-6 mt-1 text-[10px] font-bold uppercase tracking-wider text-[#526174] dark:text-night-muted">
        <span className="text-[#173B67] dark:text-sky-400">1. Learn</span>
        <span className="text-emerald-700 dark:text-emerald-400">2. Prove</span>
        <span className="text-amber-700 dark:text-amber-400">3. Opportunity</span>
      </div>

      {/* Single Language Status Text */}
      <div className="mt-3">
        <div className="text-xs text-[#173B67] dark:text-sky-300 animate-pulse font-medium">
          {activeLabel}
        </div>
      </div>
    </div>
  );
};
