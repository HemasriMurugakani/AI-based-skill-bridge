import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Globe, AlertCircle } from 'lucide-react';
import { SpeechInputController, isSpeechRecognitionSupported, SpeechLang } from '../utils/speech';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  lang?: SpeechLang;
  onLangChange?: (lang: SpeechLang) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  lang = 'ta-IN',
  onLangChange,
  className = '',
  size = 'md'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState<SpeechLang>(lang);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const controllerRef = useRef<SpeechInputController | null>(null);

  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    if (supported) {
      controllerRef.current = new SpeechInputController(
        selectedLang,
        (text) => onTranscript(text),
        (listening) => setIsListening(listening),
        (err) => {
          setErrorMsg(err);
          setTimeout(() => setErrorMsg(null), 3500);
        }
      );
    }
  }, [supported, selectedLang, onTranscript]);

  const toggleMic = () => {
    if (!supported) {
      setErrorMsg('Voice input works best in Google Chrome.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    controllerRef.current?.toggle();
  };

  const handleSelectLang = (newLang: SpeechLang) => {
    setSelectedLang(newLang);
    if (onLangChange) onLangChange(newLang);
    if (controllerRef.current) {
      controllerRef.current.setLang(newLang);
    }
    setShowLangMenu(false);
  };

  const langLabels = {
    'ta-IN': 'தமிழ்',
    'hi-IN': 'हिन्दी',
    'en-IN': 'English'
  };

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {/* Mic Action Button */}
      <button
        type="button"
        onClick={toggleMic}
        title={
          supported
            ? isListening
              ? 'Click to stop listening'
              : `Click to speak (${langLabels[selectedLang]})`
            : 'Voice works best in Chrome'
        }
        className={`relative flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
        } ${
          isListening
            ? 'bg-maroon-700 text-white shadow-maroon-glow scale-105 ring-2 ring-gold-400'
            : 'bg-parchment-200/90 dark:bg-night-100 hover:bg-gold-100 dark:hover:bg-night-border text-warm-ink dark:text-night-ink border border-warm-border/80'
        }`}
      >
        {isListening ? (
          <Mic className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} animate-pulse text-gold-300`} />
        ) : (
          <Mic className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-maroon-700 dark:text-gold-400`} />
        )}

        {/* Pulsing indicator when listening */}
        {isListening && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-forest-500 border border-white animate-ping" />
        )}
      </button>

      {/* Language Selector Pill */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="px-2 py-1 rounded-lg text-[11px] font-bold bg-parchment-200/80 dark:bg-night-100 border border-warm-border/70 hover:border-gold-400 text-warm-ink dark:text-night-ink flex items-center gap-1"
        >
          <span>{langLabels[selectedLang]}</span>
        </button>

        {showLangMenu && (
          <div className="absolute left-0 mt-1 w-28 p-1.5 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border dark:border-night-border shadow-warm-md z-50 text-xs">
            <button
              type="button"
              onClick={() => handleSelectLang('ta-IN')}
              className={`w-full text-left px-2 py-1 rounded-lg font-tamil ${
                selectedLang === 'ta-IN' ? 'bg-maroon-700 text-white font-bold' : 'hover:bg-warm-100 dark:hover:bg-night-100'
              }`}
            >
              தமிழ் (ta-IN)
            </button>
            <button
              type="button"
              onClick={() => handleSelectLang('hi-IN')}
              className={`w-full text-left px-2 py-1 rounded-lg ${
                selectedLang === 'hi-IN' ? 'bg-maroon-700 text-white font-bold' : 'hover:bg-warm-100 dark:hover:bg-night-100'
              }`}
            >
              हिन्दी (hi-IN)
            </button>
            <button
              type="button"
              onClick={() => handleSelectLang('en-IN')}
              className={`w-full text-left px-2 py-1 rounded-lg ${
                selectedLang === 'en-IN' ? 'bg-maroon-700 text-white font-bold' : 'hover:bg-warm-100 dark:hover:bg-night-100'
              }`}
            >
              English (en-IN)
            </button>
          </div>
        )}
      </div>

      {/* Live Waveform Indicator when listening */}
      {isListening && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-maroon-900 text-gold-200 text-[10px] font-bold shadow-warm-sm animate-in fade-in duration-200">
          <span className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-gold-400 animate-pulse" />
            <span className="w-0.5 h-3 bg-gold-300 animate-pulse delay-75" />
            <span className="w-0.5 h-1.5 bg-gold-400 animate-pulse delay-150" />
            <span className="w-0.5 h-2.5 bg-gold-200 animate-pulse delay-100" />
          </span>
          <span className="truncate">Listening ({langLabels[selectedLang]})...</span>
        </div>
      )}

      {/* Unsupported or Error Tooltip */}
      {errorMsg && (
        <div className="absolute top-full left-0 mt-1.5 p-2 rounded-xl bg-night-card text-gold-200 border border-gold-500/50 shadow-warm-md text-[11px] flex items-center gap-1.5 z-50 whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
