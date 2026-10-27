import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, CheckCircle2, MapPin } from 'lucide-react';

interface ProofEvent {
  name: string;
  nameTamil: string;
  skill: string;
  skillTamil: string;
  location: string;
  locationTamil: string;
  score: string;
  scoreTamil: string;
  timeAgo: string;
  timeAgoTamil: string;
}

const mockProofEvents: ProofEvent[] = [
  {
    name: 'Lakshmi',
    nameTamil: 'லட்சுமி',
    skill: 'Tailoring',
    skillTamil: 'ஆடைத் தையல்',
    location: 'Salem',
    locationTamil: 'சேலம்',
    score: 'blouse stitching rubric 82%',
    scoreTamil: 'ரूब்ரிக் மதிப்பெண் 82%',
    timeAgo: 'Just now',
    timeAgoTamil: 'சற்றுமுன்'
  },
  {
    name: 'Karthik S.',
    nameTamil: 'கார்த்திக் எஸ்.',
    skill: 'Junior Web Dev',
    skillTamil: 'இணையதள உருவாக்கம்',
    location: 'Chennai',
    locationTamil: 'சென்னை',
    score: 'WCAG keyboard nav 94%',
    scoreTamil: 'விசைப்பலகை இயக்கம் 94%',
    timeAgo: '1m ago',
    timeAgoTamil: '1 நிமிடம் முன்'
  },
  {
    name: 'Selvan M.',
    nameTamil: 'செல்வன் எம்.',
    skill: 'Electrician',
    skillTamil: 'மின் பணியாளர்',
    location: 'Madurai',
    locationTamil: 'மதுரை',
    score: 'staircase wiring photo proof 88%',
    scoreTamil: 'படிக்கட்டு வயரிங் சான்று 88%',
    timeAgo: '3m ago',
    timeAgoTamil: '3 நிமிடம் முன்'
  },
  {
    name: 'Anitha R.',
    nameTamil: 'அனிதா ஆர்.',
    skill: 'Kanchipuram Silk Weave',
    skillTamil: 'காஞ்சி பட்டு நெசவு',
    location: 'Kanchipuram',
    locationTamil: 'காஞ்சிபுரம்',
    score: 'warp tension check 91%',
    scoreTamil: 'நெசவு பதற்றம் 91%',
    timeAgo: '5m ago',
    timeAgoTamil: '5 நிமிடம் முன்'
  },
  {
    name: 'Priya S.',
    nameTamil: 'பிரியா எஸ்.',
    skill: 'Frontend UI',
    skillTamil: 'வலை இடைமுகம்',
    location: 'Tiruchirappalli',
    locationTamil: 'திருச்சி',
    score: 'DOM event delegation viva 89%',
    scoreTamil: 'DOM வாய்மொழித் தேர்வு 89%',
    timeAgo: '6m ago',
    timeAgoTamil: '6 நிமிடம் முன்'
  },
  {
    name: 'Murugan P.',
    nameTamil: 'முருகன் பி.',
    skill: 'Data Analyst',
    skillTamil: 'தரவு ஆய்வாளர்',
    location: 'Coimbatore',
    locationTamil: 'கோயம்புத்தூர்',
    score: 'SQL window function test 92%',
    scoreTamil: 'SQL வினாடி வினா 92%',
    timeAgo: '8m ago',
    timeAgoTamil: '8 நிமிடம் முன்'
  },
  {
    name: 'Meena K.',
    nameTamil: 'மீனா கே.',
    skill: 'Pattern Drafting',
    skillTamil: 'பேட்டர்ன் கட்டிங்',
    location: 'Tiruppur',
    locationTamil: 'திருப்பூர்',
    score: 'Katori cup curve 87%',
    scoreTamil: 'கட்டோரி வளைவு 87%',
    timeAgo: '11m ago',
    timeAgoTamil: '11 நிமிடம் முன்'
  },
];

export const LiveProofTicker: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
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
        {isTa ? 'நேரலை சான்று' : 'LIVE PROOF'}
      </div>

      <div className="truncate flex items-center gap-2 text-[#173B67] dark:text-night-ink transition-all duration-300">
        <span className="font-bold text-[#173B67] dark:text-sky-300">
          {isTa ? current.nameTamil : current.name}
        </span>
        <span className="text-slate-300 dark:text-night-border">•</span>
        <span className="font-semibold text-[#173B67] dark:text-white">
          {isTa ? current.skillTamil : current.skill}
        </span>
        <span className="text-slate-300 dark:text-night-border">•</span>
        <span className="flex items-center gap-0.5 text-[#526174] dark:text-night-muted">
          <MapPin className="w-3 h-3 text-[#62B6E8]" />
          {isTa ? current.locationTamil : current.location}
        </span>
        <span className="text-slate-300 dark:text-night-border">•</span>
        <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-300/40">
          {isTa ? current.scoreTamil : current.score}
        </span>
        <span className="text-[10px] text-[#526174] hidden sm:inline">
          ({isTa ? current.timeAgoTamil : current.timeAgo})
        </span>
      </div>
    </div>
  );
};
