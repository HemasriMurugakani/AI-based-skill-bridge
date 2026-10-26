import React, { useEffect, useState } from 'react';

export interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  gradientVariant?: 'maroon-gold' | 'forest' | 'terracotta';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 110,
  strokeWidth = 9,
  label,
  sublabel,
  gradientVariant = 'maroon-gold',
  showPercentage = true,
  className = ''
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  // Smooth count-up
  useEffect(() => {
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressFraction = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progressFraction, 3);
      const currentVal = Math.round(start + (progress - start) * ease);
      setAnimatedValue(currentVal);

      if (progressFraction < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  const gradientId = `ring-grad-${gradientVariant}-${size}`;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 origin-center"
        aria-hidden="true"
      >
        <defs>
          {gradientVariant === 'maroon-gold' && (
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7A1A12" />
              <stop offset="60%" stopColor="#B8761A" />
              <stop offset="100%" stopColor="#E8B23A" />
            </linearGradient>
          )}
          {gradientVariant === 'forest' && (
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B4F30" />
              <stop offset="70%" stopColor="#2F7D4F" />
              <stop offset="100%" stopColor="#5FB47F" />
            </linearGradient>
          )}
          {gradientVariant === 'terracotta' && (
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A3320" />
              <stop offset="70%" stopColor="#C8553D" />
              <stop offset="100%" stopColor="#DE735C" />
            </linearGradient>
          )}
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-warm-border/60 dark:text-night-border"
          fill="transparent"
        />

        {/* Animated Progress fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
        />
      </svg>

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {showPercentage && (
          <span className="text-xl md:text-2xl font-bold font-heritage tracking-tight text-warm-ink dark:text-night-ink">
            {animatedValue}%
          </span>
        )}
        {label && (
          <span className="text-[10px] md:text-xs font-semibold text-warm-muted dark:text-night-muted uppercase tracking-wider">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[9px] text-warm-subtle dark:text-night-muted line-clamp-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
