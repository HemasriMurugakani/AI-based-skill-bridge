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
    <div className="w-full bg-white/95 dark:bg-night-card/95 backdrop-blur-md rounded-2xl border border-sky-100 dark:border-night-border shadow-soft p-3 sm:p-4 text-[#173B67] dark:text-night-ink transition-all">
      {/* Top Banner: Stage Metric Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sky-100 dark:border-night-border/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#62B6E8] animate-ping" />
          <span className="font-extrabold uppercase tracking-wider text-[11px] text-[#173B67] dark:text-sky-300">
            Proof-to-Progress Loop
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-deepblue-950/80 text-[#173B67] dark:text-sky-300 font-bold border border-[#62B6E8]/30">
            Stage {currentStep.stepNumber} of 11: {currentStep.stageName}
          </span>
        </div>

        {/* Live Loop Metrics */}
        <div className="flex items-center gap-4 text-[11px] font-semibold">
          <div className="flex items-center gap-1.5 text-[#F2B66D]">
            <Award className="w-3.5 h-3.5" />
            <span>XP: +{accumulatedXp}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#10B981] font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Readiness: {currentReadiness}% {readinessGain > 0 ? `(+${readinessGain}%)` : ''}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[#62B6E8]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tamper-Evident</span>
          </div>
        </div>
      </div>

      {/* Horizontal Steps Pipeline Track */}
      <div className="pt-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[700px] gap-1 relative px-1">
          {/* Continuous Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-sky-100 dark:bg-night-border/60 -z-0" />
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-gradient-to-r from-[#173B67] via-[#62B6E8] to-[#F2B66D] transition-all duration-500 -z-0"
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
                      ? 'bg-gradient-to-br from-[#F2B66D] to-[#e59f45] text-[#173B67] font-bold ring-4 ring-[#62B6E8]/30 shadow-soft'
                      : isCompleted
                      ? 'bg-[#173B67] text-white shadow-xs'
                      : 'bg-[#EAF5FC] dark:bg-night-100 text-[#526174] dark:text-night-muted border border-sky-100 dark:border-night-border'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#62B6E8]" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Step Stage Label (truncated for high-density view) */}
                <span
                  className={`mt-1.5 text-[9px] font-bold text-center leading-tight whitespace-nowrap max-w-[64px] truncate transition-colors ${
                    isCurrent
                      ? 'text-[#173B67] dark:text-sky-300 font-extrabold'
                      : isCompleted
                      ? 'text-[#173B67] dark:text-white font-semibold'
                      : 'text-[#526174] dark:text-night-muted'
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
