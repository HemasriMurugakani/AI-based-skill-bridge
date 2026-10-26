import React, { useState, useEffect } from 'react';

export interface StreamingTextProps {
  text: string;
  speedMs?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  speedMs = 18,
  className = '',
  onComplete,
  showCursor = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsFinished(false);

    if (!text) return;

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, speedMs, onComplete]);

  return (
    <span className={`inline ${className}`}>
      {displayedText}
      {!isFinished && showCursor && (
        <span className="inline-block w-1.5 h-4 ml-0.5 bg-maroon-700 dark:bg-gold-400 animate-pulse align-middle" />
      )}
    </span>
  );
};
