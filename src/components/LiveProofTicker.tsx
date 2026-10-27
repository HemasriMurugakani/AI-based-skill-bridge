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
    <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-card bg-white dark:bg-night-card border border-sky-100 dark:border-night-border shadow-soft text-xs ${className}`}>
      <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[10px]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        LIVE PROOF
      </div>

      <div className="truncate flex items-center gap-2 text-[#173B67] dark:text-night-ink transition-all duration-300">
        <span className="font-bold text-[#173B67] dark:text-sky-300">{current.name}</span>
        <span className="text-slate-300 dark:text-night-border">•</span>
        <span className="font-semibold text-[#173B67] dark:text-white">{current.skill}</span>
        <span className="text-slate-300 dark:text-night-border">•</span>
        <span className="flex items-center gap-0.5 text-[#526174] dark:text-night-muted">
          <MapPin className="w-3 h-3 text-[#62B6E8]" />
          {current.location}
        </span>
        <span className="text-slate-300 dark:text-night-border">•</span>
        <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-300/40">
          {current.score}
        </span>
        <span className="text-[10px] text-[#526174] hidden sm:inline">({current.timeAgo})</span>
      </div>
    </div>
  );
};
