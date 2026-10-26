import React, { useState } from 'react';
import { X, Volume2, VolumeX, ShieldCheck, Clock, CheckCircle2, Wifi, WifiOff, ArrowRight } from 'lucide-react';
import { MilestoneNode } from '../data/roadmapData';
import { speakInstruction, stopSpeaking, isSpeechSynthesisSupported, SpeechLang } from '../utils/speech';

interface LessonDrawerProps {
  milestone: MilestoneNode | null;
  onClose: () => void;
  onCompleteMilestone: (id: string) => void;
  onTakeChallenge?: () => void;
}

export const LessonDrawer: React.FC<LessonDrawerProps> = ({
  milestone,
  onClose,
  onCompleteMilestone,
  onTakeChallenge
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLang, setAudioLang] = useState<SpeechLang>('ta-IN');
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  if (!milestone) return null;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = audioLang === 'ta-IN'
        ? `${milestone.lessonContent.audioTranscriptTamil}. ${milestone.lessonContent.overviewTamil}`
        : `${milestone.lessonContent.audioTranscript}. ${milestone.lessonContent.overview}`;

      speakInstruction(textToRead, audioLang, () => setIsPlayingAudio(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 flex justify-end">
      <div className="relative w-full max-w-xl h-full bg-parchment-50 dark:bg-night-card border-l border-warm-border dark:border-night-border shadow-warm-lg flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-6 border-b border-warm-border/80 dark:border-night-border/80 bg-parchment-100/60 dark:bg-night-100/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-maroon-700 text-white uppercase tracking-wider">
                Station 0{milestone.stepNumber}
              </span>
              <span className="text-xs font-semibold text-warm-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {milestone.timeEstimate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Low-Bandwidth Text-Only Toggle */}
              <button
                type="button"
                onClick={() => setIsLowBandwidth(!isLowBandwidth)}
                title={isLowBandwidth ? 'Switch to Rich Media mode' : 'Switch to Low-Bandwidth 2G/3G text-only mode'}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                  isLowBandwidth
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-parchment-200 dark:bg-night-100 text-warm-muted hover:text-warm-ink'
                }`}
              >
                {isLowBandwidth ? <WifiOff className="w-3 h-3 text-amber-700" /> : <Wifi className="w-3 h-3" />}
                <span>{isLowBandwidth ? '2G Text-Only' : 'Rich Mode'}</span>
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  onClose();
                }}
                className="p-1 rounded-xl text-warm-muted hover:bg-warm-100 dark:hover:bg-night-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold font-heritage text-warm-ink dark:text-night-ink">
            {milestone.title}
          </h2>
          <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
            {milestone.titleTamil}
          </div>

          {/* Audio Lesson Bar */}
          <div className="mt-4 flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-night-card border border-warm-border/80 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-maroon-700 text-white shadow-warm-sm ring-2 ring-gold-400 animate-pulse'
                    : 'bg-gold-500 hover:bg-gold-400 text-maroon-950'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Stop Audio' : 'Listen to Audio Lesson'}</span>
              </button>

              <div className="flex items-center gap-1 text-[11px] font-bold">
                <button
                  onClick={() => setAudioLang('ta-IN')}
                  className={`px-2 py-0.5 rounded font-tamil ${
                    audioLang === 'ta-IN' ? 'bg-maroon-700 text-white' : 'text-warm-muted hover:text-warm-ink'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => setAudioLang('en-IN')}
                  className={`px-2 py-0.5 rounded ${
                    audioLang === 'en-IN' ? 'bg-maroon-700 text-white' : 'text-warm-muted hover:text-warm-ink'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setAudioLang('hi-IN')}
                  className={`px-2 py-0.5 rounded font-hindi ${
                    audioLang === 'hi-IN' ? 'bg-maroon-700 text-white' : 'text-warm-muted hover:text-warm-ink'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <span className="text-[10px] text-warm-muted hidden sm:inline">
              Web SpeechSynthesis
            </span>
          </div>

          {/* Low-Bandwidth Status Banner */}
          {isLowBandwidth && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                <strong>Low-Bandwidth 2G/3G Mode:</strong> Heavy media disabled. Pure high-contrast text for rural connectivity in Tamil Nadu districts.
              </span>
            </div>
          )}
        </div>

        {/* Drawer Body */}
        <div className={`p-6 space-y-6 ${isLowBandwidth ? 'bg-white dark:bg-black font-sans text-black dark:text-white' : ''}`}>
          {/* Why This Step Callout */}
          <div className="p-4 rounded-2xl bg-gold-50/80 dark:bg-gold-950/40 border border-gold-300/80 dark:border-gold-700/60 text-xs">
            <div className="font-bold text-gold-900 dark:text-gold-200 uppercase tracking-wide flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-gold-600" />
              <span>Evidence-Backed: Why This Step?</span>
            </div>
            <p className="text-gold-950 dark:text-gold-300 leading-relaxed">
              {milestone.whyThisStep}
            </p>
          </div>

          {/* Lesson Overview */}
          <div>
            <h4 className="text-xs font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-2">
              Concept Overview:
            </h4>
            <p className="text-xs sm:text-sm text-warm-muted dark:text-night-muted leading-relaxed">
              {milestone.lessonContent.overview}
            </p>
            <div className="mt-2 font-tamil text-xs text-maroon-800 dark:text-gold-300 leading-relaxed">
              {milestone.lessonContent.overviewTamil}
            </div>
          </div>

          {/* Key Takeaways */}
          <div>
            <h4 className="text-xs font-bold text-warm-ink dark:text-night-ink uppercase tracking-wider mb-2">
              Core Principles & Rubric Checkpoints:
            </h4>
            <div className="space-y-2">
              {milestone.lessonContent.keyTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-parchment-100/70 dark:bg-night-100/60 border border-warm-border/60 text-xs flex items-start gap-2.5"
                >
                  <span className="w-4 h-4 rounded-full bg-forest-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-warm-ink dark:text-night-ink leading-relaxed">
                    {takeaway}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Hands-On Exercise */}
          <div className="p-4 rounded-2xl bg-parchment-100 dark:bg-night-100 border border-warm-border/80 text-xs space-y-2">
            <div className="font-bold text-warm-ink dark:text-night-ink uppercase tracking-wide">
              Hands-On Proof Prompt:
            </div>
            <p className="text-warm-muted leading-relaxed">
              {milestone.lessonContent.handsOnPrompt}
            </p>
          </div>
        </div>

        {/* Drawer Actions Footer */}
        <div className="p-6 border-t border-warm-border/80 dark:border-night-border/80 bg-parchment-100/60 dark:bg-night-100/60 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={() => onCompleteMilestone(milestone.id)}
            className="px-4 py-2.5 rounded-full border border-warm-border text-xs font-bold text-warm-ink dark:text-night-ink hover:bg-parchment-200 transition-colors"
          >
            Mark Milestone Done
          </button>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
              if (onTakeChallenge) onTakeChallenge();
            }}
            className="px-6 py-2.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-extrabold shadow-warm-sm flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span>Take Proof Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
