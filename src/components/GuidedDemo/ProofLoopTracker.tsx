import React from 'react';
import { DemoStep } from './demoStepsData';
import {
  Mic,
  FileText,
  Sparkles,
  PieChart,
  Compass,
  Camera,
  Bot,
  UserCheck,
  QrCode,
  Gauge,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface ProofLoopTrackerProps {
  steps: DemoStep[];
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  isCompact?: boolean;
}

const STAGE_ICONS: Record<number, React.ElementType> = {
  1: Mic,
  2: FileText,
  3: Sparkles,
  4: PieChart,
  5: Compass,
  6: Camera,
  7: Bot,
  8: UserCheck,
  9: QrCode,
  10: Gauge,
  11: Briefcase
};

export const ProofLoopTracker: React.FC<ProofLoopTrackerProps> = ({
  steps,
  currentStepIndex,
  onSelectStep,
  isCompact = false
}) => {
  const currentStep = steps[currentStepIndex];

  // Calculate cumulative stats up to current step
  const accumulatedXp = steps
    .slice(0, currentStepIndex + 1)
    .reduce((acc, s) => acc + s.xpReward, 0);

  const startReadiness = steps[0].readinessScore;
  const currentReadiness = currentStep.readinessScore;
  const readinessGain = currentReadiness - startReadiness;

  return (
    <div className="w-full bg-parchment-50/95 dark:bg-night-card/95 backdrop-blur-md rounded-2xl border border-warm-border/80 dark:border-night-border shadow-warm-lg p-3 sm:p-4 text-warm-ink dark:text-night-ink transition-all">
      {/* Top Banner: Stage Metric Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-warm-border/60 dark:border-night-border/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-ping" />
          <span className="font-extrabold uppercase tracking-wider text-[11px] text-maroon-800 dark:text-gold-300">
            Proof-to-Progress Loop
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-maroon-100 dark:bg-maroon-950/80 text-maroon-800 dark:text-gold-400 font-bold border border-maroon-200 dark:border-maroon-800">
            Stage {currentStep.stepNumber} of 11: {currentStep.stageName}
          </span>
        </div>

        {/* Live Loop Metrics */}
        <div className="flex items-center gap-4 text-[11px] font-semibold">
          <div className="flex items-center gap-1.5 text-terracotta-700 dark:text-terracotta-400">
            <Award className="w-3.5 h-3.5" />
            <span>XP: +{accumulatedXp}</span>
          </div>

          <div className="flex items-center gap-1.5 text-forest-700 dark:text-forest-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Readiness: {currentReadiness}% {readinessGain > 0 ? `(+${readinessGain}%)` : ''}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-gold-700 dark:text-gold-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tamper-Evident</span>
          </div>
        </div>
      </div>

      {/* Horizontal Steps Pipeline Track */}
      <div className="pt-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[700px] gap-1 relative px-1">
          {/* Continuous Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-warm-border/60 dark:bg-night-border/60 -z-0" />
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-gradient-to-r from-maroon-700 via-gold-500 to-forest-600 transition-all duration-500 -z-0"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 96}%`
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = STAGE_ICONS[step.stepNumber] || Sparkles;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep(idx)}
                title={`Step ${step.stepNumber}: ${step.stageName}`}
                className={`relative z-10 flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 ${
                  isCurrent ? 'scale-110' : ''
                }`}
              >
                {/* Stage Node Icon Badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-br from-gold-400 to-amber-600 text-maroon-950 font-bold ring-4 ring-gold-400/40 shadow-warm-md'
                      : isCompleted
                      ? 'bg-forest-600 text-white shadow-xs'
                      : 'bg-parchment-200 dark:bg-night-100 text-warm-muted dark:text-night-muted border border-warm-border/80'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Step Stage Label (truncated for high-density view) */}
                <span
                  className={`mt-1.5 text-[9px] font-bold text-center leading-tight whitespace-nowrap max-w-[64px] truncate transition-colors ${
                    isCurrent
                      ? 'text-maroon-900 dark:text-gold-300 font-extrabold'
                      : isCompleted
                      ? 'text-forest-700 dark:text-forest-400 font-semibold'
                      : 'text-warm-muted dark:text-night-muted'
                  }`}
                >
                  {step.stepNumber}. {step.stageName.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
