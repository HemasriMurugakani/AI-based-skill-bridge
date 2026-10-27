import React from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';

interface HeritageBackgroundProps {
  className?: string;
  variant?: 'hero' | 'footer' | 'subtle';
}

export const HeritageBackground: React.FC<HeritageBackgroundProps> = ({
  className = '',
  variant = 'hero'
}) => {
  const { isLowDataMode } = useSkillBridgeStore();

  // Low-data mode: zero heavy background SVGs or decorative patterns
  if (isLowDataMode) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Soft subtle atmospheric tint for clean, modern product depth */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#EAF5FC] blur-3xl opacity-80" />
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-[#EAF5FC] blur-3xl opacity-60" />
    </div>
  );
};
