import React from 'react';
import { motion } from 'framer-motion';

export interface AIThinkingProps {
  labelEnglish?: string;
  labelTamil?: string;
  stage?: 'analyzing' | 'evaluating_proof' | 'synthesizing_bridge' | 'adapting';
  className?: string;
}

export const AIThinking: React.FC<AIThinkingProps> = ({
  labelEnglish = "SkillBridge AI is evaluating rubric criteria...",
  labelTamil = "திறன் பாலம் AI சான்றுகளை ஆய்வு செய்கிறது...",
  className = ''
}) => {
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
            className="text-warm-border dark:text-night-border"
            strokeLinecap="round"
          />

          {/* Three Kolam Pillar Nodes */}
          {/* Left Pillar: Learn */}
          <circle cx="30" cy="70" r="5" className="fill-maroon-700" />
          <line x1="30" y1="70" x2="30" y2="35" stroke="#7A1A12" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Middle Pillar: Prove */}
          <circle cx="100" cy="70" r="5" className="fill-forest-600" />
          <line x1="100" y1="70" x2="100" y2="20" stroke="#2F7D4F" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Right Pillar: Opportunity */}
          <circle cx="170" cy="70" r="5" className="fill-gold-600" />
          <line x1="170" y1="70" x2="170" y2="35" stroke="#B8761A" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Kolam Suspension Arch Bridge Path 1 (Left to Center) */}
          <motion.path
            d="M 30 35 Q 65 15 100 20"
            stroke="#8B1E14"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Kolam Suspension Arch Bridge Path 2 (Center to Right) */}
          <motion.path
            d="M 100 20 Q 135 15 170 35"
            stroke="#B8761A"
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
            fill="#E8B23A"
            className="filter drop-shadow-[0_0_8px_rgba(232,178,58,0.8)]"
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

          {/* Kolam Geometric Accent dots */}
          <circle cx="65" cy="45" r="2" className="fill-gold-500/40" />
          <circle cx="135" cy="45" r="2" className="fill-gold-500/40" />
        </svg>
      </div>

      {/* Bridge Pillar Stages */}
      <div className="flex items-center gap-6 mt-1 text-[10px] font-bold uppercase tracking-wider text-warm-muted dark:text-night-muted">
        <span className="text-maroon-700 dark:text-maroon-400">1. Learn</span>
        <span className="text-forest-700 dark:text-forest-400">2. Prove</span>
        <span className="text-gold-700 dark:text-gold-400">3. Opportunity</span>
      </div>

      {/* Bilingual Text */}
      <div className="mt-3">
        {labelTamil && (
          <div className="font-tamil text-xs font-semibold text-maroon-800 dark:text-maroon-300">
            {labelTamil}
          </div>
        )}
        <div className="text-xs text-warm-muted dark:text-night-muted mt-0.5 animate-pulse font-medium">
          {labelEnglish}
        </div>
      </div>
    </div>
  );
};
