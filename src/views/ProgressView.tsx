import React, { useState, useMemo } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import {
  levelDefinitions,
  xpRewardRules,
  activityVsMasteryHistory,
  catchUpTasks,
} from '../data/gamificationData';
import { PracticeHeatmap } from '../components/PracticeHeatmap';
import {
  Flame,
  Award,
  Calendar,
  Snowflake,
  PauseCircle,
  PlayCircle,
  Bell,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Clock,
  Layers,
  Zap,
  Phone,
  BookmarkCheck,
  TrendingUp,
  X,
  Target,
  CheckCircle2
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const {
    getPersona,
    streakFreezesAvailable,
    consumeStreakFreeze,
    isExamPaused,
    examPauseReason,
    examPauseDaysRemaining,
    toggleExamPause,
    reminderTime,
    setReminderTime,
    inAppReminderEnabled,
    setInAppReminderEnabled,
    streakMissedSimulated,
    simulateMissedDay,
    completeCatchUpTask,
    setActiveTab,
    language
  } = useSkillBridgeStore();

  const isTamil = language === 'ta';
  const currentPersona = getPersona();

  // Catch-up Diagnostic Quiz State
  const currentCatchUpTask = useMemo(() => {
    const task = catchUpTasks.find(t => t.pathwayId === currentPersona.pathwayId);
    return task || catchUpTasks[0];
  }, [currentPersona.pathwayId]);

  const [selectedCatchUpOption, setSelectedCatchUpOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [showCelebrationToast, setShowCelebrationToast] = useState(false);

  // In-App Reminder Test Banner
  const [showReminderToast, setShowReminderToast] = useState(false);

  // Exam Pause Modal
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseReasonInput, setPauseReasonInput] = useState('Anna University Semester Exams');
  const [pauseDurationInput, setPauseDurationInput] = useState(12);

  // Streak Freeze Toast
  const [freezeToastMessage, setFreezeToastMessage] = useState<string | null>(null);

  // Active Level computation
  const currentLevel = useMemo(() => {
    return (
      levelDefinitions.find(
        lvl => currentPersona.xpPoints >= lvl.minXp && currentPersona.xpPoints <= lvl.maxXp
      ) || levelDefinitions[2]
    );
  }, [currentPersona.xpPoints]);

  const nextLevel = useMemo(() => {
    const nextIdx = levelDefinitions.findIndex(l => l.level === currentLevel.level) + 1;
    return nextIdx < levelDefinitions.length ? levelDefinitions[nextIdx] : null;
  }, [currentLevel]);

  const levelProgressPercent = useMemo(() => {
    const span = currentLevel.maxXp - currentLevel.minXp;
    const progress = currentPersona.xpPoints - currentLevel.minXp;
    return Math.min(Math.max(Math.round((progress / span) * 100), 5), 100);
  }, [currentLevel, currentPersona.xpPoints]);

  // Handle Catch-Up Quiz Submit
  const handleCatchUpSubmit = () => {
    if (selectedCatchUpOption === null) return;
    setQuizSubmitted(true);
    if (selectedCatchUpOption === currentCatchUpTask.correctAnswerIndex) {
      setQuizSuccess(true);
      completeCatchUpTask(currentCatchUpTask.rewardXp);
      setShowCelebrationToast(true);
      setTimeout(() => setShowCelebrationToast(false), 5000);
    } else {
      setQuizSuccess(false);
    }
  };

  const handleUseFreeze = () => {
    const success = consumeStreakFreeze();
    if (success) {
      setFreezeToastMessage('Streak Freeze applied! Tomorrow is safely protected with 0 penalty.');
    } else {
      setFreezeToastMessage('No streak freezes remaining this month (2/2 already used).');
    }
    setTimeout(() => setFreezeToastMessage(null), 4500);
  };

  const handleTriggerReminderTest = () => {
    setShowReminderToast(true);
    setTimeout(() => setShowReminderToast(false), 6000);
  };

  const dayOfWeekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Toast Notifications */}
      {showCelebrationToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-forest-700 text-white shadow-warm-lg flex items-center gap-3 border border-forest-500 animate-slideUp">
          <Sparkles className="w-6 h-6 text-gold-300 animate-bounce" />
          <div>
            <div className="font-bold text-sm">Streak Rescued & Preserved!</div>
            <div className="text-xs text-forest-100">
              +{currentCatchUpTask.rewardXp} XP awarded. Your {currentPersona.streakDays}-day streak is active!
            </div>
          </div>
        </div>
      )}

      {freezeToastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-cyan-900 text-cyan-100 shadow-warm-lg flex items-center gap-3 border border-cyan-700 animate-slideUp">
          <Snowflake className="w-5 h-5 text-cyan-300 animate-spin" />
          <div className="text-xs font-semibold">{freezeToastMessage}</div>
        </div>
      )}

      {showReminderToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md p-4 rounded-2xl bg-maroon-900 text-gold-100 shadow-warm-xl border border-gold-400/50 flex items-start gap-3 animate-slideDown">
          <Bell className="w-5 h-5 text-gold-300 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-gold-400">
              In-App Daily Reminder ({reminderTime})
            </div>
            <div className="text-sm font-semibold text-white">
              Priya, your 15-minute deliberate practice session is ready!
            </div>
            <div className="text-xs text-parchment-200">
              Today's recommended topic: CSS clamp() fluid scaling. Keep your {currentPersona.streakDays}-day streak alive!
            </div>
            <button
              onClick={() => setActiveTab('challenges')}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500 hover:bg-gold-400 text-maroon-950 font-bold text-xs shadow-sm transition-transform hover:scale-105"
            >
              <span>Start 15m Practice</span>
            </button>
          </div>
          <button
            onClick={() => setShowReminderToast(false)}
            className="text-gold-300/70 hover:text-white ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-maroon-900 via-maroon-800 to-terracotta-900 text-white shadow-warm-xl overflow-hidden border border-gold-400/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Civic Gamification · Meaningful Work Only</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heritage tracking-tight text-gold-100">
              Streak & Mastery Dashboard
            </h1>
            <p className="text-sm text-parchment-200 leading-relaxed">
              Tamil Nadu Civic Skill Engine gamification rewards deliberate, tamper-evident proof—not vanity clicks or mindless scrolling. Your streak is protected with recovery tools so unexpected life events never wipe out honest dedication.
            </p>
          </div>

          {/* Quick Simulation & Testing Tools Strip */}
          <div className="flex flex-wrap items-center gap-2 bg-black/20 p-2.5 rounded-2xl border border-white/10 backdrop-blur-sm shrink-0">
            <span className="text-[11px] font-bold text-gold-300 uppercase tracking-wider px-1">
              Prototype Controls:
            </span>
            <button
              onClick={() => simulateMissedDay(!streakMissedSimulated)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                streakMissedSimulated
                  ? 'bg-amber-500 text-maroon-950 shadow-md ring-2 ring-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{streakMissedSimulated ? 'Missed Day Active' : 'Simulate Missed Day'}</span>
            </button>
            <button
              onClick={handleUseFreeze}
              disabled={streakFreezesAvailable <= 0}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-700/80 hover:bg-cyan-600 text-white disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <Snowflake className="w-3.5 h-3.5" />
              <span>Use 1 Freeze ({streakFreezesAvailable}/2)</span>
            </button>
            <button
              onClick={() => setIsPauseModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-700/80 hover:bg-indigo-600 text-white transition-all flex items-center gap-1.5"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>{isExamPaused ? 'Manage Pause' : 'Exams / Work Pause'}</span>
            </button>
          </div>
        </div>

        {/* Hero KPIs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-white/15">
          {/* Current Streak */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between text-xs text-parchment-200 mb-1">
              <span>Current Streak</span>
              <Flame className="w-4 h-4 text-terracotta-400 fill-terracotta-400 animate-bounce" />
            </div>
            <div className="text-2xl font-bold font-heritage text-white">
              {currentPersona.streakDays}{' '}
              <span className="text-xs font-normal text-gold-300">Days</span>
            </div>
            <div className="text-[10px] text-forest-300 font-semibold mt-0.5">
              {streakMissedSimulated ? '⚠️ Recovery Mode' : isExamPaused ? '🛡️ Safely Paused' : '✓ Active Today'}
            </div>
          </div>

          {/* Best Streak */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between text-xs text-parchment-200 mb-1">
              <span>Best Streak</span>
              <Target className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl font-bold font-heritage text-white">
              24 <span className="text-xs font-normal text-gold-300">Days</span>
            </div>
            <div className="text-[10px] text-parchment-300 mt-0.5">
              Personal Record (Aug 2026)
            </div>
          </div>

          {/* Consistency Multiplier */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between text-xs text-parchment-200 mb-1">
              <span>XP Multiplier</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-heritage text-gold-300">
              1.25x
            </div>
            <div className="text-[10px] text-parchment-300 mt-0.5">
              14+ Day Habit Tier (+25%)
            </div>
          </div>

          {/* Verified XP */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between text-xs text-parchment-200 mb-1">
              <span>Meaningful XP</span>
              <Award className="w-4 h-4 text-gold-300" />
            </div>
            <div className="text-2xl font-bold font-heritage text-white">
              {currentPersona.xpPoints}
            </div>
            <div className="text-[10px] text-forest-300 mt-0.5">
              5 Proofs + 1 Oral Viva
            </div>
          </div>

          {/* Current Level */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between text-xs text-parchment-200 mb-1">
              <span>Current Level</span>
              <span className="text-base">{currentLevel.badgeIcon}</span>
            </div>
            <div className="text-base font-bold font-heritage text-gold-200 truncate">
              L{currentLevel.level}: {currentLevel.title.split(' ')[0]}
            </div>
            <div className="text-[10px] text-parchment-300 font-tamil truncate">
              {currentLevel.titleTamil}
            </div>
          </div>

          {/* Monthly Freezes */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between text-xs text-parchment-200 mb-1">
              <span>Freezes Left</span>
              <Snowflake className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-2xl font-bold font-heritage text-cyan-200">
              {streakFreezesAvailable} / 2
            </div>
            <div className="text-[10px] text-cyan-300 mt-0.5">
              Refreshes Nov 1, 2026
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Alert Banner (When Missed Day is Simulated) */}
      {streakMissedSimulated && (
        <div className="rounded-3xl p-6 sm:p-8 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600 shadow-warm-lg space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-maroon-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Flame className="w-6 h-6 text-maroon-950" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs font-bold">
                  <span>Recovery-Friendly Mode Active</span>
                </div>
                <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100">
                  Missed Yesterday? Keep Your {currentPersona.streakDays}-Day Streak Alive!
                </h3>
                <p className="text-xs text-amber-900/80 dark:text-amber-200/80 max-w-3xl leading-relaxed">
                  Power cuts, college submissions, or family responsibilities shouldn't penalize honest effort.
                  Instead of resetting your streak to 0, solve this quick 5-minute diagnostic catch-up question to restore your streak immediately and earn +{currentCatchUpTask.rewardXp} XP.
                </p>
              </div>
            </div>
            <button
              onClick={() => simulateMissedDay(false)}
              className="text-amber-800 dark:text-amber-400 hover:text-amber-950 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40"
            >
              Dismiss
            </button>
          </div>

          {/* Interactive Catch-up Diagnostic Card */}
          <div className="bg-white dark:bg-night-card p-5 sm:p-6 rounded-2xl border border-amber-300 dark:border-amber-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs text-warm-muted dark:text-night-muted">
              <span className="font-bold text-maroon-900 dark:text-gold-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                5-Minute Pathway Diagnostic ({currentCatchUpTask.title})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-800 dark:text-gold-200 font-bold">
                +{currentCatchUpTask.rewardXp} XP Reward
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-warm-ink dark:text-night-ink leading-relaxed">
                {currentCatchUpTask.question}
              </p>
              <p className="text-xs text-warm-muted dark:text-night-muted font-tamil mt-1">
                {currentCatchUpTask.questionTamil}
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {currentCatchUpTask.options.map((option, idx) => {
                const isSelected = selectedCatchUpOption === idx;
                const isCorrect = idx === currentCatchUpTask.correctAnswerIndex;
                let optionStyle =
                  'border-warm-border dark:border-night-border hover:border-gold-400 hover:bg-parchment-100 dark:hover:bg-night-100 text-warm-ink dark:text-night-ink';

                if (quizSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-forest-500 bg-forest-50 dark:bg-forest-950/40 text-forest-900 dark:text-forest-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-maroon-600 bg-maroon-50 dark:bg-maroon-950/50 text-maroon-900 dark:text-maroon-100 font-semibold ring-1 ring-maroon-500';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={quizSubmitted && quizSuccess}
                    onClick={() => {
                      setSelectedCatchUpOption(idx);
                      setQuizSubmitted(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <span>{option}</span>
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Submit & Result Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-warm-border/40 dark:border-night-border/40">
              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={selectedCatchUpOption === null}
                  onClick={handleCatchUpSubmit}
                  className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 disabled:opacity-40 text-white font-bold text-xs shadow-warm-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 justify-center"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Verify Answer & Restore Streak</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  {quizSuccess ? (
                    <div className="flex items-center gap-2 text-forest-700 dark:text-forest-300 font-bold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>Streak restored! +{currentCatchUpTask.rewardXp} XP added to your passport.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                      <RotateCcw className="w-4 h-4" />
                      <span>Incorrect answer. Try again to protect your streak!</span>
                    </div>
                  )}
                </div>
              )}

              {quizSubmitted && (
                <div className="text-xs text-warm-muted dark:text-night-muted max-w-md">
                  <span className="font-bold">Explanation:</span> {currentCatchUpTask.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Paused Streak Notice (If Exam / Work Pause Active) */}
      {isExamPaused && (
        <div className="rounded-3xl p-5 sm:p-6 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
              <PauseCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm">
                Streak Safely Paused: {examPauseReason}
              </div>
              <div className="text-xs text-indigo-800 dark:text-indigo-300 mt-0.5">
                {examPauseDaysRemaining} days remaining in pause window. Your {currentPersona.streakDays}-day streak is locked and will not reset.
              </div>
            </div>
          </div>
          <button
            onClick={() => toggleExamPause(false)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 justify-center"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Resume Practice Now</span>
          </button>
        </div>
      )}

      {/* SECTION: 16-Week Heatmap Calendar */}
      <PracticeHeatmap isTamil={isTamil} streakDays={currentPersona.streakDays} />

      {/* SECTION: Activity vs Mastery Progress Chart */}
      <section className="bg-parchment-50 dark:bg-night-card rounded-3xl p-6 sm:p-8 border border-warm-border dark:border-night-border shadow-warm-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />
              <h2 className="text-xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                Activity vs Mastery Progress
              </h2>
            </div>
            <p className="text-xs text-warm-muted dark:text-night-muted max-w-2xl">
              Employers and civic mentors distinguish <strong className="text-warm-ink dark:text-night-ink">Effort (Activity)</strong> from <strong className="text-warm-ink dark:text-night-ink">Demonstrated Competency (Mastery)</strong>. Activity measures practice volume; Mastery measures strict rubric compliance (≥75%) and authentic viva defense.
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-500" />
              <span className="text-warm-ink dark:text-night-ink">Activity Index (Effort: 94%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-forest-600" />
              <span className="text-warm-ink dark:text-night-ink">Mastery Index (Rubric: {currentPersona.readinessScore}%)</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Comparison Chart (Week-by-Week) */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-night-100 border border-warm-border dark:border-night-border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {activityVsMasteryHistory.map((point, idx) => {
              const effectiveMastery = idx === activityVsMasteryHistory.length - 1 ? currentPersona.readinessScore : point.masteryIndex;
              return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-parchment-100/60 dark:bg-night-200/50 border border-warm-border/60 dark:border-night-border/60 flex flex-col justify-between space-y-3"
              >
                <div className="text-center">
                  <div className="text-xs font-bold text-warm-ink dark:text-night-ink">
                    {point.week}
                  </div>
                  <div className="text-[10px] text-warm-muted dark:text-night-muted">
                    {point.practiceMinutes}m · {point.proofsVerified} Proofs
                  </div>
                </div>

                {/* Side-by-side vertical progress bars */}
                <div className="h-32 flex items-end justify-center gap-3 py-1">
                  {/* Activity Bar */}
                  <div className="w-4 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400">
                      {point.activityIndex}%
                    </span>
                    <div
                      className="w-full bg-amber-500 rounded-t-md transition-all duration-500"
                      style={{ height: `${point.activityIndex}%` }}
                      title={`Activity Index: ${point.activityIndex}%`}
                    />
                  </div>

                  {/* Mastery Bar */}
                  <div className="w-4 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-forest-700 dark:text-forest-400">
                      {effectiveMastery}%
                    </span>
                    <div
                      className="w-full bg-forest-600 rounded-t-md transition-all duration-500"
                      style={{ height: `${effectiveMastery}%` }}
                      title={`Mastery Index: ${effectiveMastery}%`}
                    />
                  </div>
                </div>

                <div className="text-center text-[10px] font-semibold text-warm-muted dark:text-night-muted border-t border-warm-border/50 dark:border-night-border/50 pt-1.5">
                  Gap: {point.activityIndex - effectiveMastery}%
                </div>
              </div>
            );
            })}
          </div>

          {/* Educational Callout */}
          <div className="p-4 rounded-xl bg-parchment-200/50 dark:bg-night-200/30 border border-warm-border/60 dark:border-night-border/60 flex items-start gap-3 text-xs text-warm-ink/90 dark:text-night-ink/90">
            <TrendingUp className="w-5 h-5 text-maroon-700 dark:text-gold-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-maroon-900 dark:text-gold-200">
                Understanding the {Math.max(0, 94 - currentPersona.readinessScore)}% Activity-to-Mastery Delta:
              </span>{' '}
              Your activity level (94%) shows outstanding discipline and practice consistency. The mastery index ({currentPersona.readinessScore}%) reflects rigorous rubric hurdles like zero-overflow viewport clamp and WCAG keyboard focus. High deliberate practice volume creates the foundation for mastery to crystallize over the coming 2 weeks.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: XP and Levels with Explicit Criteria */}
      <section className="bg-parchment-50 dark:bg-night-card rounded-3xl p-6 sm:p-8 border border-warm-border dark:border-night-border shadow-warm-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-600" />
              <h2 className="text-xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                XP & Levels with Explicit Criteria
              </h2>
            </div>
            <p className="text-xs text-warm-muted dark:text-night-muted">
              Advance through 5 civic levels. Criteria are transparent, reproducible, and strictly tied to verified evidence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-warm-muted dark:text-night-muted">
              Current Status:
            </span>
            <span className="px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/50 text-gold-900 dark:text-gold-200 font-bold text-xs">
              Level {currentLevel.level} · {currentLevel.title}
            </span>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-night-100 border border-warm-border dark:border-night-border space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-warm-ink dark:text-night-ink">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentLevel.badgeIcon}</span>
              <span>
                Level {currentLevel.level}: {currentLevel.title} ({currentPersona.xpPoints} XP)
              </span>
            </div>
            {nextLevel && (
              <div className="flex items-center gap-2 text-warm-muted dark:text-night-muted">
                <span>Next: Level {nextLevel.level}: {nextLevel.title}</span>
                <span className="text-lg">{nextLevel.badgeIcon}</span>
              </div>
            )}
          </div>

          <div className="w-full h-3.5 bg-parchment-200 dark:bg-night-200 rounded-full overflow-hidden p-0.5 border border-warm-border/60">
            <div
              className="h-full bg-gradient-to-r from-maroon-700 via-gold-500 to-forest-500 rounded-full transition-all duration-700"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-warm-muted dark:text-night-muted">
            <span>{currentLevel.minXp} XP (Base)</span>
            <span className="font-bold text-maroon-800 dark:text-gold-300">
              {currentLevel.maxXp - currentPersona.xpPoints} XP to Level {nextLevel?.level || 5}
            </span>
            <span>{currentLevel.maxXp} XP (Target)</span>
          </div>
        </div>

        {/* Explicit Criteria Checklist for Next Level */}
        {nextLevel && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-night-100 border border-warm-border dark:border-night-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-warm-ink dark:text-night-ink flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                Explicit Requirements to Unlock Level {nextLevel.level} ({nextLevel.title}):
              </h3>
              <span className="text-xs text-warm-muted dark:text-night-muted font-tamil">
                {nextLevel.titleTamil}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {nextLevel.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                    req.met
                      ? 'bg-forest-50 dark:bg-forest-950/40 border-forest-300 dark:border-forest-800'
                      : 'bg-parchment-100/50 dark:bg-night-200/40 border-warm-border dark:border-night-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-warm-ink dark:text-night-ink leading-snug">
                      {req.label}
                    </span>
                    {req.met ? (
                      <span className="text-forest-600 shrink-0 font-bold text-xs">✓ Done</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 shrink-0 text-xs font-semibold">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-warm-muted dark:text-night-muted font-tamil">
                    {req.labelTamil}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transparent Meaningful XP Reward Table */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-night-100 border border-warm-border dark:border-night-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-warm-ink dark:text-night-ink">
              Transparent XP Reward Table (Meaningful Work Only)
            </h3>
            <span className="text-xs text-warm-muted dark:text-night-muted">
              Zero points for vanity clicks or passive browsing
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-warm-border dark:border-night-border text-warm-muted dark:text-night-muted">
                  <th className="py-2 font-semibold">Demonstrated Action</th>
                  <th className="py-2 font-semibold">Tamil</th>
                  <th className="py-2 font-semibold">Category</th>
                  <th className="py-2 font-semibold">Rubric Validation Rule</th>
                  <th className="py-2 font-semibold text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-border/40 dark:divide-night-border/40">
                {xpRewardRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-parchment-100/50 dark:hover:bg-night-200/30">
                    <td className="py-2.5 font-bold text-warm-ink dark:text-night-ink">
                      {rule.action}
                    </td>
                    <td className="py-2.5 font-tamil text-warm-muted dark:text-night-muted">
                      {rule.actionTamil}
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-parchment-200 dark:bg-night-200 text-warm-ink dark:text-night-ink uppercase font-bold text-[9px]">
                        {rule.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-warm-muted dark:text-night-muted max-w-xs">
                      {rule.description}
                    </td>
                    <td className="py-2.5 text-right font-bold text-forest-700 dark:text-forest-300">
                      +{rule.xpPoints} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION: Reminder Settings */}
      <section className="bg-parchment-50 dark:bg-night-card rounded-3xl p-6 sm:p-8 border border-warm-border dark:border-night-border shadow-warm-md space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-maroon-700 dark:text-gold-400" />
            <h2 className="text-xl font-bold font-heritage text-warm-ink dark:text-night-ink">
              Reminder & Practice Schedule Settings
            </h2>
          </div>
          <p className="text-xs text-warm-muted dark:text-night-muted">
            Configure your preferred daily 15-minute practice window. Receive in-app gentle prompts that protect your streak without intrusive spam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: In-App Reminder Preferred Time */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-night-100 border border-warm-border dark:border-night-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-maroon-800 dark:text-gold-300" />
                <h3 className="text-sm font-bold text-warm-ink dark:text-night-ink">
                  Preferred Practice Time
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={inAppReminderEnabled}
                  onChange={e => setInAppReminderEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-parchment-300 peer-focus:outline-none rounded-full peer dark:bg-night-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-600" />
              </label>
            </div>

            <p className="text-xs text-warm-muted dark:text-night-muted">
              Choose when you'd like your daily practice nudge to appear inside the SkillBridge app.
            </p>

            {/* Time Picker and Presets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={reminderTime}
                  onChange={e => setReminderTime(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-warm-border dark:border-night-border bg-parchment-50 dark:bg-night-card text-warm-ink dark:text-night-ink font-bold text-sm focus:border-gold-400 focus:outline-none"
                />
                <span className="text-xs text-warm-muted dark:text-night-muted">
                  (IST / Tamil Nadu Local Time)
                </span>
              </div>

              {/* Time Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: 'Morning (07:30 AM)', val: '07:30' },
                  { label: 'Afternoon (01:30 PM)', val: '13:30' },
                  { label: 'Evening (07:30 PM)', val: '19:30' },
                  { label: 'Night (09:30 PM)', val: '21:30' }
                ].map(preset => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setReminderTime(preset.val)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      reminderTime === preset.val
                        ? 'bg-maroon-700 text-white shadow-sm'
                        : 'bg-parchment-100 dark:bg-night-200 text-warm-ink dark:text-night-ink hover:bg-parchment-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Simulation Button */}
            <div className="pt-3 border-t border-warm-border/50 dark:border-night-border/50">
              <button
                type="button"
                onClick={handleTriggerReminderTest}
                className="w-full px-4 py-2.5 rounded-xl bg-parchment-200 hover:bg-parchment-300 dark:bg-night-200 dark:hover:bg-night-300 text-warm-ink dark:text-night-ink font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-maroon-800 dark:text-gold-300" />
                <span>Test In-App Reminder Alert Now</span>
              </button>
            </div>
          </div>

          {/* Card 2: WhatsApp / SMS Reminders (Mock with "Coming soon") */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-night-100 border border-warm-border dark:border-night-border space-y-4 opacity-90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-forest-600" />
                <h3 className="text-sm font-bold text-warm-ink dark:text-night-ink">
                  WhatsApp & SMS Alerts
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-[10px] font-bold uppercase tracking-wider">
                Coming soon
              </span>
            </div>

            <p className="text-xs text-warm-muted dark:text-night-muted leading-relaxed">
              Opt-in to daily WhatsApp or SMS reminders via the Tamil Nadu State Skill Mission SMS gateway. (Scheduled for Phase 2 state integration).
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-warm-muted dark:text-night-muted uppercase tracking-wider block mb-1">
                  Mobile Number (Mock)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-warm-muted dark:text-night-muted" />
                  <input
                    type="tel"
                    disabled
                    placeholder="+91 98400 12345"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-warm-border dark:border-night-border bg-parchment-100/60 dark:bg-night-200/40 text-warm-muted dark:text-night-muted cursor-not-allowed text-xs font-mono"
                  />
                </div>
              </div>

              {/* Disabled Coming Soon Toggle */}
              <div className="p-3 rounded-xl bg-parchment-100 dark:bg-night-200/50 border border-warm-border/50 dark:border-night-border/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-warm-ink dark:text-night-ink">
                    Enable WhatsApp Practice Bot
                  </div>
                  <div className="text-[10px] text-warm-muted dark:text-night-muted">
                    Automated practice link sent daily at your chosen time
                  </div>
                </div>
                <div className="relative inline-flex items-center opacity-50 cursor-not-allowed">
                  <div className="w-11 h-6 bg-parchment-300 dark:bg-night-300 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5" />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-warm-muted dark:text-night-muted italic pt-2">
              Note: SMS and WhatsApp integration is strictly simulated. All daily reminders function directly within the in-app view.
            </div>
          </div>
        </div>
      </section>

      {/* Exam / Work Pause Modal */}
      {isPauseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-night-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-warm-border dark:border-night-border shadow-warm-xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <PauseCircle className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-bold font-heritage text-warm-ink dark:text-night-ink">
                  Exams or Work Streak Pause
                </h3>
              </div>
              <button
                onClick={() => setIsPauseModalOpen(false)}
                className="text-warm-muted hover:text-warm-ink dark:text-night-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-warm-muted dark:text-night-muted leading-relaxed">
              In Tamil Nadu, semester university exams, Tiruppur garment shifts, or agricultural harvest seasons demand full focus. Safely lock your streak for up to 14 days without penalty.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-warm-ink dark:text-night-ink block mb-1">
                  Reason for Pause
                </label>
                <select
                  value={pauseReasonInput}
                  onChange={e => setPauseReasonInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-warm-border dark:border-night-border bg-parchment-50 dark:bg-night-100 text-xs text-warm-ink dark:text-night-ink focus:outline-none"
                >
                  <option value="Anna University Semester Exams">Anna University / Polytechnic Semester Exams</option>
                  <option value="Tiruppur Garment Factory Shift Overtime">Tiruppur Garment Factory Shift Overtime</option>
                  <option value="Agricultural Harvest Season / Monsoon">Agricultural Harvest Season / Monsoon</option>
                  <option value="Family Function / Travel">Family Function / Travel</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-warm-ink dark:text-night-ink block mb-1">
                  Pause Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[7, 14].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setPauseDurationInput(days)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        pauseDurationInput === days
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                          : 'bg-parchment-100 dark:bg-night-100 text-warm-ink dark:text-night-ink border-warm-border dark:border-night-border'
                      }`}
                    >
                      {days} Days Safe Pause
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-warm-border/50 dark:border-night-border/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPauseModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-warm-muted hover:text-warm-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleExamPause(true, pauseReasonInput, pauseDurationInput);
                  setIsPauseModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-warm-sm transition-transform hover:scale-105"
              >
                Activate Safe Pause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
