import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSkillBridgeStore } from '../../store/useSkillBridgeStore';
import { priyaStory, lakshmiStory, DemoStep, PersonaStory } from './demoStepsData';
import { ProofLoopTracker } from './ProofLoopTracker';
import { PhoneScannerModal } from './PhoneScannerModal';
import { speakText, stopSpeaking } from '../../utils/speech';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Wifi,
  WifiOff,
  User,
  RotateCcw,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  ArrowRight,
  ExternalLink,
  Smartphone
} from 'lucide-react';

export const GuidedDemoModal: React.FC = () => {
  const {
    isGuidedDemoOpen,
    closeGuidedDemo,
    openGuidedDemo,
    isOfflineDemo,
    toggleOfflineDemo,
    currentPersonaId,
    setPersona,
    setActiveTab,
    awardXp,
    unlockBadge
  } = useSkillBridgeStore();

  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  // Selected persona narrative (Priya by default, toggleable to Lakshmi)
  const [activeStory, setActiveStory] = useState<PersonaStory>(
    currentPersonaId === 'lakshmi-vocational' ? lakshmiStory : priyaStory
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 1.5 | 2>(1);
  const [stepSecondsElapsed, setStepSecondsElapsed] = useState(0);
  const [isLoopTrackerExpanded, setIsLoopTrackerExpanded] = useState(true);
  const [isPhoneScannerOpen, setIsPhoneScannerOpen] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const timerRef = useRef<any>(null);
  const currentStep: DemoStep = activeStory.steps[currentStepIndex];

  // Calculate total demo duration
  const totalDemoSeconds = activeStory.steps.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalElapsedSeconds = activeStory.steps
    .slice(0, currentStepIndex)
    .reduce((acc, s) => acc + s.durationSeconds, 0) + stepSecondsElapsed;

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Sync persona changes
  useEffect(() => {
    if (currentPersonaId === 'lakshmi-vocational') {
      setActiveStory(lakshmiStory);
    } else {
      setActiveStory(priyaStory);
    }
  }, [currentPersonaId]);

  // Global Keyboard Shortcuts (Shift+D, Space, Left, Right, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift+D toggles demo
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        if (isGuidedDemoOpen) {
          closeGuidedDemo();
        } else {
          openGuidedDemo();
        }
        return;
      }

      if (!isGuidedDemoOpen) return;

      // Space: Play/Pause
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeGuidedDemo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuidedDemoOpen, closeGuidedDemo, openGuidedDemo]);

  // Navigate view & calculate target spotlight rect
  const syncStepViewAndTarget = useCallback(() => {
    if (!currentStep) return;

    // 1. Switch active app tab
    setActiveTab(currentStep.tab);

    // 2. Persona sync
    if (activeStory.personaId !== currentPersonaId) {
      setPersona(activeStory.personaId);
    }

    // 3. Trigger phone scanner modal if step 9
    if (currentStep.actionType === 'phone_scan') {
      setIsPhoneScannerOpen(true);
    } else {
      setIsPhoneScannerOpen(false);
    }

    // 4. Calculate spotlight rect
    setTimeout(() => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        // Scroll into view gently
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    }, 250);

    // 5. Speak narration if audio is unmuted
    if (!isAudioMuted) {
      stopSpeaking();
      speakText(currentStep.voiceSpeechTa || currentStep.voiceSpeechEn, 'ta');
    }
  }, [currentStep, activeStory, currentPersonaId, setActiveTab, setPersona, isAudioMuted]);

  // Trigger when step changes or demo opens
  useEffect(() => {
    if (isGuidedDemoOpen) {
      setStepSecondsElapsed(0);
      syncStepViewAndTarget();
    } else {
      stopSpeaking();
    }
  }, [isGuidedDemoOpen, currentStepIndex, activeStory, syncStepViewAndTarget]);

  // Auto-play timer loop
  useEffect(() => {
    if (!isGuidedDemoOpen || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = 1000 / speedMultiplier;
    timerRef.current = setInterval(() => {
      setStepSecondsElapsed(prev => {
        if (prev + 1 >= currentStep.durationSeconds) {
          // Advance to next step
          if (currentStepIndex < activeStory.steps.length - 1) {
            setCurrentStepIndex(i => i + 1);
            return 0;
          } else {
            // Finished loop!
            setIsPlaying(false);
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
            return prev;
          }
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGuidedDemoOpen, isPlaying, currentStep, currentStepIndex, activeStory, speedMultiplier]);

  // Step Navigation Controls
  const handleNextStep = () => {
    if (currentStepIndex < activeStory.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setStepSecondsElapsed(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setStepSecondsElapsed(0);
    }
  };

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    setStepSecondsElapsed(0);
  };

  const handleToggleStoryPersona = (personaId: 'priya-student' | 'lakshmi-vocational') => {
    if (personaId === 'priya-student') {
      setActiveStory(priyaStory);
      setPersona('priya-student');
    } else {
      setActiveStory(lakshmiStory);
      setPersona('lakshmi-vocational');
    }
    setCurrentStepIndex(0);
    setStepSecondsElapsed(0);
  };

  const handleToggleMute = () => {
    if (!isAudioMuted) {
      stopSpeaking();
      setIsAudioMuted(true);
    } else {
      setIsAudioMuted(false);
      speakText(currentStep.voiceSpeechTa || currentStep.voiceSpeechEn, 'ta');
    }
  };

  if (!isGuidedDemoOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex flex-col justify-between overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* 1. DARK SPOTLIGHT BACKDROP OVERLAY */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 pointer-events-none" />

      {/* SVG Spotlight Cutout Window if targetRect exists */}
      {targetRect && (
        <div
          className="absolute rounded-3xl pointer-events-none border-2 border-[#62B6E8] shadow-[0_0_60px_rgba(98,182,232,0.5)] transition-all duration-300 z-10"
          style={{
            top: `${Math.max(10, targetRect.top - 8)}px`,
            left: `${Math.max(10, targetRect.left - 8)}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`
          }}
        >
          <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-[#F2B66D] text-[#173B67] text-[10px] font-black uppercase tracking-wider shadow-soft flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#173B67]" />
            <span>Spotlight · Step {currentStep.stepNumber}</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. TOP FLOATING PROOF-TO-PROGRESS LOOP TRACKER */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-30 max-w-6xl w-full mx-auto px-4 pt-4">
        <div className="relative">
          {/* Header Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/95 dark:bg-night-card/95 backdrop-blur-md border border-sky-100 dark:border-night-border shadow-soft mb-2 text-[#173B67] dark:text-night-ink text-xs">
            {/* Title & Shortcut Hint */}
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full bg-[#173B67] text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-soft">
                <Sparkles className="w-3.5 h-3.5 text-[#F2B66D]" />
                <span>Guided Demo</span>
                <span className="hidden sm:inline opacity-75 font-mono text-[10px]">(Shift+D)</span>
              </div>

              {/* Persona Story Selector: Priya vs Lakshmi */}
              <div className="flex items-center bg-[#EAF5FC]/80 dark:bg-night-100 p-0.5 rounded-xl border border-sky-100 dark:border-night-border">
                <button
                  type="button"
                  onClick={() => handleToggleStoryPersona('priya-student')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeStory.personaId === 'priya-student'
                      ? 'bg-[#173B67] text-white shadow-xs'
                      : 'text-[#526174] hover:text-[#173B67]'
                  }`}
                >
                  <img
                    src={priyaStory.avatar}
                    alt={priyaStory.personaName}
                    className="w-4 h-4 rounded-full object-cover border border-[#62B6E8]"
                  />
                  <span>{isTa ? 'பிரியா (தொழில்நுட்பம்)' : 'Priya (Tech)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStoryPersona('lakshmi-vocational')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeStory.personaId === 'lakshmi-vocational'
                      ? 'bg-[#173B67] text-white shadow-xs'
                      : 'text-[#526174] hover:text-[#173B67]'
                  }`}
                >
                  <img
                    src={lakshmiStory.avatar}
                    alt={lakshmiStory.personaName}
                    className="w-4 h-4 rounded-full object-cover border border-[#62B6E8]"
                  />
                  <span>{isTa ? 'லட்சுமி (கைவினை)' : 'Lakshmi (Craft)'}</span>
                </button>
              </div>
            </div>

            {/* Middle: Timer & Under 4 Minutes Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5FC] dark:bg-night-100 border border-[#BAE6FD] font-mono text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-[#173B67] dark:text-sky-300" />
                <span>{formatTime(totalElapsedSeconds)} / {formatTime(totalDemoSeconds)}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-sans ml-1">
                  ({isTa ? '< 4 நிமிடங்கள்' : '< 4 mins'})
                </span>
              </div>

              {/* Offline Demo Mode Toggle Button (STRICT REQUIREMENT) */}
              <button
                type="button"
                onClick={toggleOfflineDemo}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isOfflineDemo
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700 shadow-xs'
                    : 'bg-[#F8FAFC] dark:bg-night-100 text-[#173B67] dark:text-night-ink border-[#E2E8F0]'
                }`}
                title="Toggle offline demo mode: 100% deterministic local fallback without network latency"
              >
                {isOfflineDemo ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{isTa ? 'ஆஃப்லைன் செயல்முறை: இயக்கு' : 'Offline Demo: ON'}</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-[#526174]" />
                    <span>{isTa ? 'நேரலை AI முறை' : 'Live AI Mode'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Controls: Tracker Expand & Close */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsLoopTrackerExpanded(!isLoopTrackerExpanded)}
                className="p-1.5 rounded-lg text-[#526174] hover:text-[#173B67] dark:hover:text-night-ink hover:bg-[#EAF5FC] transition-colors"
                title="Toggle Proof-to-Progress loop timeline"
              >
                {isLoopTrackerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={closeGuidedDemo}
                className="p-1.5 rounded-lg bg-[#EAF5FC] dark:bg-night-100 hover:bg-[#d8eefc] text-[#173B67] hover:text-[#112C4E] transition-colors cursor-pointer"
                title="Exit Demo (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Proof-to-Progress Loop Tracker Widget */}
          {isLoopTrackerExpanded && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <ProofLoopTracker
                steps={activeStory.steps}
                currentStepIndex={currentStepIndex}
                onSelectStep={handleSelectStep}
              />
            </div>
          )}
        </div>
      </div>
      {/* ------------------------------------------------------------------ */}
      {/* 3. CENTER FLOATING SPOTLIGHT NARRATION TOOLTIP */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-30 max-w-3xl w-full mx-auto px-4 my-auto pointer-events-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-night-card/95 backdrop-blur-md border-2 border-[#62B6E8] dark:border-sky-500 shadow-2xl text-[#173B67] dark:text-night-ink transition-all">
          {/* Tooltip Header */}
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-sky-100 dark:border-night-border/60">
            <div className="flex items-center gap-3">
              <img
                src={activeStory.avatar}
                alt={activeStory.personaName}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#62B6E8] shadow-soft shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#173B67] dark:text-sky-300">
                    {isTa ? `படி ${currentStep.stepNumber} / 11 · ${currentStep.stageName}` : `Step ${currentStep.stepNumber} of 11 · ${currentStep.stageName}`}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#EAF5FC] text-[#173B67] border border-[#62B6E8]/40">
                    XP +{currentStep.xpReward}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#173B67] dark:text-white">
                  {isTa ? (currentStep.titleTamil || currentStep.title) : currentStep.title}
                </h3>
              </div>
            </div>

            {/* Audio Speech Button */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isAudioMuted
                    ? 'bg-[#F2B66D] text-[#173B67] font-black shadow-soft'
                    : 'bg-[#EAF5FC] dark:bg-night-100 text-[#526174]'
                }`}
                title={isAudioMuted ? 'Unmute Audio' : 'Mute Voice Narration'}
              >
                {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{!isAudioMuted ? (isTa ? 'குரல் ஆன்' : 'Voice ON') : (isTa ? 'அமைதி' : 'Muted')}</span>
              </button>
            </div>
          </div>

          {/* Single-Language Narration Caption Box */}
          <div className="py-4">
            <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              isTa
                ? 'bg-[#FCF3E5]/60 dark:bg-amber-950/30 border border-[#F2B66D]/40 dark:border-amber-800/60 text-[#173B67] dark:text-amber-200 font-tamil'
                : 'bg-[#EAF5FC]/60 dark:bg-night-100/80 border border-sky-100/60 text-[#173B67] dark:text-white'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#526174] dark:text-night-muted mb-1 font-sans">
                {isTa ? 'கதை விளக்கம்' : 'Story Narration'}
              </div>
              {isTa ? (currentStep.narrativeTa || currentStep.narrativeEn) : currentStep.narrativeEn}
            </div>
          </div>

          {/* Step Action Pill Hint */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#526174] dark:text-night-muted text-[11px]">
              <span className="font-semibold text-[#173B67] dark:text-night-ink">{isTa ? 'செயலில் உள்ள தாவல்:' : 'Active Tab:'}</span>
              <span className="capitalize px-2 py-0.5 rounded-md bg-[#EAF5FC] dark:bg-night-100 font-mono text-[#173B67] dark:text-sky-300">
                /{currentStep.tab}
              </span>
              <span>•</span>
              <span>{isTa ? 'தயார்நிலை:' : 'Readiness:'} <strong className="text-[#10B981]">{currentStep.readinessScore}%</strong></span>
            </div>

            {currentStep.actionType === 'phone_scan' && (
              <button
                type="button"
                onClick={() => setIsPhoneScannerOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#F2B66D] hover:bg-[#e59f45] text-[#173B67] text-xs font-bold flex items-center gap-1.5 shadow-soft cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isTa ? 'மொபைல் ஸ்கேனரைத் திற' : 'Open Phone Scanner'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. BOTTOM DOCK CONTROLS (PLAY / PAUSE / PREV / NEXT / SPEED) */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-30 max-w-4xl w-full mx-auto px-4 pb-6">
        <div className="p-3.5 sm:p-4 rounded-3xl bg-[#173B67]/95 text-white backdrop-blur-md border border-sky-400/30 shadow-2xl">
          {/* Step Progress Bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#62B6E8] via-[#F2B66D] to-white transition-all duration-300"
              style={{
                width: `${((currentStepIndex + stepSecondsElapsed / currentStep.durationSeconds) / activeStory.steps.length) * 100}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Left: Step Info */}
            <div className="text-xs">
              <div className="font-bold text-[#F2B66D]">
                {isTa ? `படி ${currentStep.stepNumber} / 11: ${currentStep.stageName}` : `Step ${currentStep.stepNumber} of 11: ${currentStep.stageName}`}
              </div>
              <div className="text-[11px] text-sky-200">
                {isTa
                  ? `${Math.max(0, currentStep.durationSeconds - stepSecondsElapsed)}வி-ல் அடுத்த படிக்கு நகரும்`
                  : `Auto-advancing in ${Math.max(0, currentStep.durationSeconds - stepSecondsElapsed)}s`}
              </div>
            </div>

            {/* Center: Main Playback Deck */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-colors cursor-pointer"
                title="Previous step (Left Arrow)"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3.5 rounded-full bg-[#F2B66D] hover:bg-[#e59f45] text-[#173B67] font-black shadow-lg hover:scale-105 transition-transform cursor-pointer"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={currentStepIndex === activeStory.steps.length - 1}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-colors cursor-pointer"
                title="Next step (Right Arrow)"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Speed Multiplier */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-300">
              <span className="text-[10px] text-slate-500 uppercase px-1">{isTa ? 'வேகம்' : 'Speed'}</span>
              {([1, 1.5, 2] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                    speedMultiplier === s
                      ? 'bg-amber-400 text-slate-950 font-extrabold'
                      : 'hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 5. INTERACTIVE PHONE SCANNER POPUP MODAL (FOR STEP 9) */}
      {/* ------------------------------------------------------------------ */}
      <PhoneScannerModal
        isOpen={isPhoneScannerOpen}
        onClose={() => setIsPhoneScannerOpen(false)}
        personaName={activeStory.personaName}
        personaTamilName={activeStory.personaNameTamil}
        personaAvatar={activeStory.avatar}
        location={activeStory.location}
        pathwayTitle="Junior Web Developer"
        credentialId="TN-SB-PRIYA-STUDENT-2026"
        verifyUrl="https://skillbridge.tn.gov.in/verify/priya-student"
      />
    </div>
  );
};
