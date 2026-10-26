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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
        isPlaying
          ? 'bg-maroon-700 text-white border-maroon-800 ring-2 ring-gold-400 animate-pulse'
          : 'bg-parchment-200/90 dark:bg-night-100 hover:bg-gold-100 text-warm-ink dark:text-night-ink border-warm-border/80'
      } ${className}`}
    >
      {isPlaying ? (
        <VolumeX className="w-3.5 h-3.5 text-gold-300" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-maroon-700 dark:text-gold-400" />
      )}
      <span>{isPlaying ? 'Stop' : label}</span>
    </button>
  );
};
