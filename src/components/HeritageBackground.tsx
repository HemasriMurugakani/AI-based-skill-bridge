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
      {/* Kolam geometric grid dots */}
      <div className="absolute inset-0 kolam-pattern-bg" />

      {/* Heritage Sepia Pencil-and-Ink Architectural Sketch Texture */}
      <div
        className="absolute inset-0 bg-cover bg-top opacity-[0.07] dark:opacity-[0.04] mix-blend-multiply dark:mix-blend-screen transition-opacity duration-1000 pointer-events-none"
        style={{ backgroundImage: "url('/heritage-backdrop.jpg')" }}
      />

      {/* Stylized Gopuram & Shore Temple SVG Silhouette */}
      <svg
        className={`absolute w-full h-auto text-maroon-900/5 dark:text-gold-400/5 transition-opacity duration-700 ${
          variant === 'hero' ? 'bottom-0 translate-y-4' : 'top-0'
        }`}
        viewBox="0 0 1440 320"
        fill="currentColor"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Western Ghats rolling hills */}
        <path d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,213.3C672,213,768,171,864,160C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        
        {/* Tanjore / Madurai Gopuram architectural stepped silhouette (Center-Left) */}
        <path
          d="M 220 220 
             L 230 180 L 225 180 L 235 150 L 230 150 L 240 120 L 235 120 L 245 95 L 240 95 L 250 70 L 248 70 L 252 50 L 256 70 L 254 70 L 264 95 L 259 95 L 269 120 L 264 120 L 274 150 L 269 150 L 279 180 L 274 180 L 284 220 Z"
          fill="currentColor"
          opacity="0.6"
        />

        {/* Shore Temple (Mamallapuram) stepped pagoda silhouette (Right) */}
        <path
          d="M 1120 215 
             L 1130 175 L 1126 175 L 1136 140 L 1132 140 L 1142 110 L 1138 110 L 1146 80 L 1150 80 L 1158 110 L 1154 110 L 1164 140 L 1160 140 L 1170 175 L 1166 175 L 1176 215 Z"
          fill="currentColor"
          opacity="0.5"
        />

        {/* Coastal Palmyra Palm Groves (Tamil Nadu State Tree) */}
        {/* Palm 1 */}
        <path
          d="M 120 230 Q 125 170 135 140 Q 115 130 100 135 M 135 140 Q 130 115 138 105 M 135 140 Q 155 125 165 130 M 135 140 Q 150 150 160 160"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Palm 2 */}
        <path
          d="M 1260 225 Q 1265 175 1272 145 Q 1250 135 1238 142 M 1272 145 Q 1270 120 1278 112 M 1272 145 Q 1290 130 1302 138 M 1272 145 Q 1285 155 1295 168"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Kolam geometric lotus arch bridge in foreground */}
        <path
          d="M 620 240 Q 720 190 820 240 Q 720 220 620 240 Z"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>

      {/* Warm parchment gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-parchment/60 via-transparent to-parchment dark:from-night/60 dark:to-night" />
    </div>
  );
};
