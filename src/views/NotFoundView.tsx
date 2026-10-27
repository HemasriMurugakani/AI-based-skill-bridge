import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  const quickLinks = [
    {
      id: 'home',
      label: 'Home Dashboard',
      labelTamil: 'முகப்பு கட்டுப்பாட்டுப் பலகை',
      icon: Home,
      desc: 'Return to your main progress overview',
      descTamil: 'உங்கள் முதன்மை முன்னேற்றப் பகுதிக்குத் திரும்புங்கள்'
    },
    {
      id: 'roadmap',
      label: 'Adaptive Roadmap',
      labelTamil: 'தகவமைப்பு கற்றல் பாதை',
      icon: Map,
      desc: 'Diagnostic quizzes and customized milestones',
      descTamil: 'கண்டறிதல் வினாடி வினா மற்றும் மைல்கற்கள்'
    },
    {
      id: 'challenges',
      label: 'Proof Challenges',
      labelTamil: 'செய்முறை சவால்கள்',
      icon: Compass,
      desc: 'Rubric-evaluated code & physical craft tasks',
      descTamil: 'ரூப்ரிக் மதிப்பீட்டு செய்முறை மற்றும் கைவினைப் பணிகள்'
    },
    {
      id: 'gap-analysis',
      label: 'JD Gap Analysis',
      labelTamil: 'வேலை விவர இடைவெளி ஆய்வு',
      icon: Search,
      desc: 'Extract skills and match requirements via AI',
      descTamil: 'வேலைத் தேவைகளைப் பிரித்தெடுத்து பொருத்துங்கள்'
    },
    {
      id: 'passport',
      label: 'Skill Passport',
      labelTamil: 'திறன் கடவுச்சீட்டு',
      icon: FileCheck2,
      desc: 'Tamper-evident verifiable proofs & QR share',
      descTamil: 'சரிபார்க்கக்கூடிய சான்றுகள் மற்றும் QR பகிர்வு'
    },
    {
      id: 'resume',
      label: '1-Page Resume',
      labelTamil: '1-பக்க ரெஸ்யூமே',
      icon: FileText,
      desc: 'Verified, printable portfolio resume sheet',
      descTamil: 'சரிபார்க்கப்பட்ட அச்சிடக்கூடிய ரெஸ்யூமே தாள்'
    },
    {
      id: 'coach',
      label: 'AI Voice Coach',
      labelTamil: 'AI குரல் வழிகாட்டி',
      icon: BotMessageSquare,
      desc: 'Voice coaching and oral viva defense preparation',
      descTamil: 'குரல் வழிகாட்டுதல் மற்றும் நேர்முகப் பாதுகாப்பு பயிற்சி'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      {/* 404 Visual Header */}
      <div className="relative inline-block mb-4">
        <div className="text-8xl sm:text-9xl font-black tracking-tight text-[#173B67]/15 dark:text-sky-400/20 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 py-1.5 rounded-full bg-[#EAF5FC] dark:bg-deepblue-950/80 border border-[#62B6E8]/60 text-[#173B67] dark:text-sky-300 font-bold text-sm sm:text-base flex items-center gap-2 shadow-soft backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#F2B66D] animate-spin" />
            <span>{isTa ? 'பாதை கண்டறியப்படவில்லை' : 'Route Not Found'}</span>
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-[#173B67] dark:text-white tracking-tight">
        {isTa ? 'நீங்கள் தேடும் பக்கம் கிடைக்கவில்லை' : 'Lost along the skill path?'}
      </h1>

      <p className="mt-3 text-sm sm:text-base text-[#526174] dark:text-night-muted max-w-xl mx-auto leading-relaxed">
        {isTa
          ? 'நீங்கள் கோரிய பக்கம் அல்லது ஆதாரம் கிடைக்கவில்லை. கீழே உள்ள முக்கிய தொகுதிகளுக்கு நேரடியாக செல்லலாம்.'
          : 'The route or resource you requested is unavailable. You can jump directly to any of the core SkillBridge modules below.'}
      </p>

      {/* Main Back to Home CTA */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-sm shadow-soft transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTa ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'}</span>
        </button>
      </div>

      {/* Quick Access to Core Features */}
      <div className="mt-12 text-left">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#526174] dark:text-night-muted">
            {isTa ? 'முக்கிய தொகுதிகள்' : 'Explore Core SkillBridge Modules'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className="p-4 rounded-card bg-white dark:bg-night-card hover:bg-[#F8FAFC] dark:hover:bg-night-100 border border-[#E2E8F0] dark:border-night-border hover:border-[#62B6E8] shadow-soft transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-300 flex items-center justify-center border border-[#BAE6FD] dark:border-night-border group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#173B67] dark:text-night-ink group-hover:text-[#62B6E8] transition-colors truncate">
                      {isTa ? item.labelTamil : item.label}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-[#526174] dark:text-night-muted line-clamp-2">
                  {isTa ? item.descTamil : item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
