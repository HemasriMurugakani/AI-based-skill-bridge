import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakInstruction, stopSpeaking, isSpeechSynthesisSupported, SpeechLang } from '../utils/speech';

interface ReadAloudButtonProps {
  text: string;
  lang?: SpeechLang;
  label?: string;
  className?: string;
}

export const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({
  text,
  lang = 'ta-IN',
  label = 'Listen',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const supported = isSpeechSynthesisSupported();

  if (!supported) return null;

  const handleToggle = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakInstruction(text, lang, () => setIsPlaying(false));
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isPlaying ? 'Stop voice readout' : `Read aloud (${lang})`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-btn text-xs font-semibold border transition-all cursor-pointer ${
        isPlaying
          ? 'bg-[#173B67] text-white border-[#173B67] ring-2 ring-[#62B6E8] animate-pulse'
          : 'bg-[#EAF5FC] hover:bg-[#D9EFFB] text-[#173B67] border border-[#BAE6FD]'
      } ${className}`}
    >
      {isPlaying ? (
        <VolumeX className="w-3.5 h-3.5 text-[#62B6E8]" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-[#173B67]" />
      )}
      <span>{isPlaying ? 'Stop' : label}</span>
    </button>
  );
};
