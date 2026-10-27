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
        className={`relative flex items-center justify-center rounded-btn transition-all duration-200 cursor-pointer ${
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
        } ${
          isListening
            ? 'bg-[#173B67] text-white shadow-soft scale-105 ring-2 ring-[#62B6E8]'
            : 'bg-[#EAF5FC] hover:bg-[#D9EFFB] text-[#173B67] border border-[#BAE6FD]'
        }`}
      >
        {isListening ? (
          <Mic className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} animate-pulse text-[#62B6E8]`} />
        ) : (
          <Mic className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-[#173B67]`} />
        )}

        {/* Pulsing indicator when listening */}
        {isListening && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white animate-ping" />
        )}
      </button>

      {/* Language Selector Pill */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="px-2 py-1 rounded-btn text-[11px] font-bold bg-[#EAF5FC] hover:bg-[#D9EFFB] border border-[#BAE6FD] text-[#173B67] flex items-center gap-1"
        >
          <span>{langLabels[selectedLang]}</span>
        </button>

        {showLangMenu && (
          <div className="absolute left-0 mt-1 w-28 p-1.5 rounded-card bg-white border border-[#E2E8F0] shadow-soft z-50 text-xs">
            <button
              type="button"
              onClick={() => handleSelectLang('ta-IN')}
              className={`w-full text-left px-2 py-1 rounded-btn font-tamil ${
                selectedLang === 'ta-IN' ? 'bg-[#173B67] text-white font-bold' : 'hover:bg-[#EAF5FC] text-[#173B67]'
              }`}
            >
              தமிழ் (ta-IN)
            </button>
            <button
              type="button"
              onClick={() => handleSelectLang('hi-IN')}
              className={`w-full text-left px-2 py-1 rounded-btn ${
                selectedLang === 'hi-IN' ? 'bg-[#173B67] text-white font-bold' : 'hover:bg-[#EAF5FC] text-[#173B67]'
              }`}
            >
              हिन्दी (hi-IN)
            </button>
            <button
              type="button"
              onClick={() => handleSelectLang('en-IN')}
              className={`w-full text-left px-2 py-1 rounded-btn ${
                selectedLang === 'en-IN' ? 'bg-[#173B67] text-white font-bold' : 'hover:bg-[#EAF5FC] text-[#173B67]'
              }`}
            >
              English (en-IN)
            </button>
          </div>
        )}
      </div>

      {/* Live Waveform Indicator when listening */}
      {isListening && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#173B67] text-white border border-[#BAE6FD] text-[10px] font-bold shadow-soft animate-in fade-in duration-200">
          <span className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-[#62B6E8] animate-pulse" />
            <span className="w-0.5 h-3 bg-[#62B6E8] animate-pulse delay-75" />
            <span className="w-0.5 h-1.5 bg-[#62B6E8] animate-pulse delay-150" />
            <span className="w-0.5 h-2.5 bg-[#62B6E8] animate-pulse delay-100" />
          </span>
          <span className="truncate">Listening ({langLabels[selectedLang]})...</span>
        </div>
      )}

      {/* Unsupported or Error Tooltip */}
      {errorMsg && (
        <div className="absolute top-full left-0 mt-1.5 p-2 rounded-btn bg-white text-[#173B67] border border-[#E2E8F0] shadow-soft text-[11px] flex items-center gap-1.5 z-50 whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
