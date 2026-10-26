import React from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import {
  Home,
  Map,
  Compass,
  FileCheck2,
  Search,
  Sparkles,
  ArrowLeft,
  BotMessageSquare,
  FileText
} from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const { setActiveTab } = useSkillBridgeStore();

  const quickLinks = [
    { id: 'home', label: 'Home Dashboard', tamil: 'முகப்பு', icon: Home, desc: 'Return to your main progress overview' },
    { id: 'roadmap', label: 'Adaptive Roadmap', tamil: 'திறன் வரைபடம்', icon: Map, desc: 'Diagnostic quizzes and customized milestones' },
    { id: 'challenges', label: 'Proof Challenges', tamil: 'செய்முறை சவால்கள்', icon: Compass, desc: 'Rubric-evaluated code & physical craft tasks' },
    { id: 'gap-analysis', label: 'JD Gap Analysis', tamil: 'வேலை பகுப்பாய்வு', icon: Search, desc: 'Extract skills and match requirements via AI' },
    { id: 'passport', label: 'Skill Passport', tamil: 'கடவுச்சீட்டு', icon: FileCheck2, desc: 'Tamper-evident verifiable proofs & QR share' },
    { id: 'resume', label: '1-Page Resume', tamil: '1-பக்க ரெஸ்யூமே', icon: FileText, desc: 'Verified, printable portfolio resume sheet' },
    { id: 'coach', label: 'AI Voice Coach', tamil: 'AI வழிகாட்டி', icon: BotMessageSquare, desc: 'Bilingual voice coaching and viva preparation' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      {/* 404 Visual Header */}
      <div className="relative inline-block mb-4">
        <div className="text-8xl sm:text-9xl font-black font-heritage tracking-tight text-maroon-700/20 dark:text-gold-400/20 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 py-1.5 rounded-full bg-gold-400/20 dark:bg-gold-500/20 border border-gold-400/60 text-maroon-900 dark:text-gold-300 font-bold text-sm sm:text-base flex items-center gap-2 shadow-warm-xs backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-gold-600 dark:text-gold-400 animate-spin" />
            <span>பாதை கண்டறியப்படவில்லை • Route Not Found</span>
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-warm-ink dark:text-night-ink tracking-tight">
        Lost along the skill path?
      </h1>
      <div className="font-tamil text-base sm:text-lg font-semibold text-warm-muted dark:text-night-muted mt-1">
        நீங்கள் தேடும் பக்கம் கிடைக்கவில்லை
      </div>

      <p className="mt-3 text-sm sm:text-base text-warm-muted dark:text-night-muted max-w-xl mx-auto leading-relaxed">
        The route or resource you requested is unavailable. You can jump directly to any of the core SkillBridge modules below.
      </p>

      {/* Main Back to Home CTA */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-warm-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home (முகப்புக்குத் திரும்பு)</span>
        </button>
      </div>

      {/* Quick Access to Tier A Features */}
      <div className="mt-12 text-left">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-warm-muted dark:text-night-muted">
            Explore Core SkillBridge Modules
          </h2>
          <span className="font-tamil text-xs text-warm-muted dark:text-night-muted">
            முக்கிய தொகுதிகள்
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className="p-4 rounded-2xl bg-parchment-50 dark:bg-night-card hover:bg-white dark:hover:bg-night-100 border border-warm-border/80 dark:border-night-border hover:border-gold-400 transition-all text-left group shadow-warm-xs hover:shadow-warm-md hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-maroon-50 dark:bg-maroon-950/60 text-maroon-700 dark:text-gold-300 flex items-center justify-center border border-maroon-100 dark:border-maroon-900 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-warm-ink dark:text-night-ink group-hover:text-maroon-700 dark:group-hover:text-gold-300 transition-colors truncate">
                      {item.label}
                    </div>
                    <div className="font-tamil text-[11px] text-warm-muted dark:text-night-muted truncate">
                      {item.tamil}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-warm-muted dark:text-night-muted line-clamp-2">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
