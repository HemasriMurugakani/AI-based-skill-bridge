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
      <div className="relative w-full max-w-xl h-full bg-white border-l border-[#E2E8F0] shadow-soft flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E2E8F0] bg-white sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF5FC] border border-[#BAE6FD] text-[#173B67] uppercase tracking-wider">
                Station 0{milestone.stepNumber}
              </span>
              <span className="text-xs font-semibold text-[#526174] flex items-center gap-1">
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
                className={`px-2.5 py-1 rounded-btn text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                  isLowBandwidth
                    ? 'bg-[#EAF5FC] text-[#173B67] border-[#BAE6FD]'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#526174] hover:text-[#173B67]'
                }`}
              >
                {isLowBandwidth ? <WifiOff className="w-3 h-3 text-[#173B67]" /> : <Wifi className="w-3 h-3" />}
                <span>{isLowBandwidth ? '2G Text-Only' : 'Rich Mode'}</span>
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  onClose();
                }}
                className="p-1 rounded-btn text-[#526174] hover:bg-[#F8FAFC] hover:text-[#173B67]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#173B67]">
            {milestone.title}
          </h2>
          <div className="font-tamil text-xs text-[#526174]">
            {milestone.titleTamil}
          </div>

          {/* Audio Lesson Bar */}
          <div className="mt-4 flex items-center justify-between gap-3 p-3 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`p-2.5 rounded-btn font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-[#173B67] text-white shadow-soft ring-2 ring-[#62B6E8] animate-pulse'
                    : 'bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67]'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Stop Audio' : 'Listen to Audio Lesson'}</span>
              </button>

              <div className="flex items-center gap-1 text-[11px] font-bold">
                <button
                  onClick={() => setAudioLang('ta-IN')}
                  className={`px-2 py-0.5 rounded-btn font-tamil ${
                    audioLang === 'ta-IN' ? 'bg-[#173B67] text-white' : 'text-[#526174] hover:text-[#173B67]'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => setAudioLang('en-IN')}
                  className={`px-2 py-0.5 rounded-btn ${
                    audioLang === 'en-IN' ? 'bg-[#173B67] text-white' : 'text-[#526174] hover:text-[#173B67]'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setAudioLang('hi-IN')}
                  className={`px-2 py-0.5 rounded-btn font-hindi ${
                    audioLang === 'hi-IN' ? 'bg-[#173B67] text-white' : 'text-[#526174] hover:text-[#173B67]'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <span className="text-[10px] text-[#526174] hidden sm:inline">
              Web SpeechSynthesis
            </span>
          </div>

          {/* Low-Bandwidth Status Banner */}
          {isLowBandwidth && (
            <div className="mt-3 p-2.5 rounded-card bg-[#EAF5FC] border border-[#BAE6FD] text-[11px] text-[#173B67] flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-[#173B67] shrink-0" />
              <span>
                <strong>Low-Bandwidth 2G/3G Mode:</strong> Heavy media disabled. Pure high-contrast text for rural connectivity in Tamil Nadu districts.
              </span>
            </div>
          )}
        </div>

        {/* Drawer Body */}
        <div className={`p-6 space-y-6 ${isLowBandwidth ? 'bg-white font-sans text-black' : ''}`}>
          {/* Why This Step Callout */}
          <div className="p-4 rounded-card bg-[#EAF5FC] border border-[#BAE6FD] text-xs">
            <div className="font-bold text-[#173B67] uppercase tracking-wide flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#62B6E8]" />
              <span>Evidence-Backed: Why This Step?</span>
            </div>
            <p className="text-[#173B67] leading-relaxed">
              {milestone.whyThisStep}
            </p>
          </div>

          {/* Lesson Overview */}
          <div>
            <h4 className="text-xs font-bold text-[#173B67] uppercase tracking-wider mb-2">
              Concept Overview:
            </h4>
            <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
              {milestone.lessonContent.overview}
            </p>
            <div className="mt-2 font-tamil text-xs text-[#173B67] leading-relaxed">
              {milestone.lessonContent.overviewTamil}
            </div>
          </div>

          {/* Key Takeaways */}
          <div>
            <h4 className="text-xs font-bold text-[#173B67] uppercase tracking-wider mb-2">
              Core Principles & Rubric Checkpoints:
            </h4>
            <div className="space-y-2">
              {milestone.lessonContent.keyTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-btn bg-[#F8FAFC] border border-[#E2E8F0] text-xs flex items-start gap-2.5"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-[#173B67] leading-relaxed">
                    {takeaway}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Hands-On Exercise */}
          <div className="p-4 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-2">
            <div className="font-bold text-[#173B67] uppercase tracking-wide">
              Hands-On Proof Prompt:
            </div>
            <p className="text-[#526174] leading-relaxed">
              {milestone.lessonContent.handsOnPrompt}
            </p>
          </div>
        </div>

        {/* Drawer Actions Footer */}
        <div className="p-6 border-t border-[#E2E8F0] bg-white flex items-center justify-between gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={() => onCompleteMilestone(milestone.id)}
            className="px-4 py-2.5 rounded-btn border border-[#E2E8F0] text-xs font-bold text-[#526174] hover:text-[#173B67] hover:bg-[#F8FAFC] transition-colors"
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
            className="px-6 py-2.5 rounded-btn bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67] text-xs font-extrabold shadow-soft flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span>Take Proof Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
