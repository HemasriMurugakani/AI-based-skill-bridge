import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, MapPin } from 'lucide-react';

interface ProofEvent {
  name: string;
  skill: string;
  location: string;
  score: string;
  timeAgo: string;
}

const mockProofEvents: ProofEvent[] = [
  { name: 'Lakshmi', skill: 'Tailoring', location: 'Salem', score: 'blouse stitching rubric 82%', timeAgo: 'Just now' },
  { name: 'Karthik S.', skill: 'Junior Web Dev', location: 'Chennai', score: 'WCAG keyboard nav 94%', timeAgo: '1m ago' },
  { name: 'Selvan M.', skill: 'Electrician', location: 'Madurai', score: 'staircase wiring photo proof 88%', timeAgo: '3m ago' },
  { name: 'Anitha R.', skill: 'Kanchipuram Silk Weave', location: 'Kanchipuram', score: 'warp tension check 91%', timeAgo: '5m ago' },
  { name: 'Priya S.', skill: 'Frontend UI', location: 'Tiruchirappalli', score: 'DOM event delegation viva 89%', timeAgo: '6m ago' },
  { name: 'Murugan P.', skill: 'Data Analyst', location: 'Coimbatore', score: 'SQL window function test 92%', timeAgo: '8m ago' },
  { name: 'Meena K.', skill: 'Pattern Drafting', location: 'Tiruppur', score: 'Katori cup curve 87%', timeAgo: '11m ago' },
];

export const LiveProofTicker: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockProofEvents.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const current = mockProofEvents[currentIndex];

  return (
    <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-parchment-200/90 dark:bg-night-100/90 border border-gold-300/60 dark:border-gold-700/50 shadow-warm-sm text-xs ${className}`}>
      <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-forest-600/15 border border-forest-600/30 text-forest-800 dark:text-forest-300 font-bold text-[10px]">
        <span className="w-2 h-2 rounded-full bg-forest-500 animate-ping" />
        LIVE PROOF
      </div>

      <div className="truncate flex items-center gap-2 text-warm-ink dark:text-night-ink transition-all duration-300">
        <span className="font-bold text-maroon-800 dark:text-gold-300">{current.name}</span>
        <span className="text-warm-subtle">•</span>
        <span className="font-semibold text-warm-ink dark:text-night-ink">{current.skill}</span>
        <span className="text-warm-subtle">•</span>
        <span className="flex items-center gap-0.5 text-warm-muted dark:text-night-muted">
          <MapPin className="w-3 h-3 text-gold-600" />
          {current.location}
        </span>
        <span className="text-warm-subtle">•</span>
        <span className="font-bold text-forest-700 dark:text-forest-400 bg-forest-50 dark:bg-forest-950/60 px-1.5 py-0.2 rounded border border-forest-300/40">
          {current.score}
        </span>
        <span className="text-[10px] text-warm-subtle hidden sm:inline">({current.timeAgo})</span>
      </div>
    </div>
  );
};
