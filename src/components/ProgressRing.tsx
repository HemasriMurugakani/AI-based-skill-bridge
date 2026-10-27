import React, { useEffect, useState } from 'react';

export interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  gradientVariant?: 'primary' | 'emerald' | 'amber' | 'maroon-gold' | 'forest' | 'terracotta';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 110,
  strokeWidth = 9,
  label,
  sublabel,
  gradientVariant = 'primary',
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
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {gradientVariant === 'forest' || gradientVariant === 'emerald' || animatedValue === 100 ? (
              <>
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </>
            ) : gradientVariant === 'terracotta' || gradientVariant === 'amber' ? (
              <>
                <stop offset="0%" stopColor="#F2B66D" />
                <stop offset="100%" stopColor="#D97706" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#62B6E8" />
                <stop offset="100%" stopColor="#173B67" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          className="dark:stroke-night-border"
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
          style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
        />
      </svg>

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {showPercentage && (
          <span className="text-xl md:text-2xl font-extrabold font-poppins tracking-tight text-[#173B67] dark:text-white">
            {animatedValue}%
          </span>
        )}
        {label && (
          <span className="text-[10px] md:text-xs font-semibold font-poppins text-[#526174] dark:text-night-muted uppercase tracking-wider">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[10px] font-poppins text-[#526174] dark:text-night-muted line-clamp-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
