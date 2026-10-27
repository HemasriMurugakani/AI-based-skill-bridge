import React, { useState, useEffect } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { Challenge } from '../types';
import { StatusPill } from '../components/StatusPill';
import { TrustLabel } from '../components/TrustLabel';
import { ChallengeWorkspace } from '../components/ChallengeWorkspace';
import { EmptyState } from '../components/EmptyState';
import {
  Code,
  Camera,
  Mic,
  Clock,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Layers,
  Search,
  ExternalLink,
  Zap
} from 'lucide-react';

export const ChallengesView: React.FC = () => {
  const { challenges } = useSkillBridgeStore();
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  // Selected challenge state (for /challenges/:id)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/challenges/') && path.length > '/challenges/'.length) {
        return path.replace('/challenges/', '');
      }
    }
    return null;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'code' | 'photo_upload' | 'viva'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize browser history and popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/challenges/') && path.length > '/challenges/'.length) {
        setSelectedChallengeId(path.replace('/challenges/', ''));
      } else {
        setSelectedChallengeId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenChallenge = (challengeId: string) => {
    setSelectedChallengeId(challengeId);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/challenges/${challengeId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedChallengeId(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/challenges');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If a challenge is selected, render the dedicated Challenge Workspace
  const activeChallenge = challenges.find((c) => c.id === selectedChallengeId);
  if (selectedChallengeId && activeChallenge) {
    return (
      <ChallengeWorkspace
        challenge={activeChallenge}
        onBack={handleBackToCatalog}
      />
    );
  }

  // The 2 featured challenges
  const featuredWebProfile = challenges.find((c) => c.id === 'challenge-web-profile');
  const featuredCommIntro = challenges.find((c) => c.id === 'challenge-comm-intro');

  // Filtered list of remaining challenges
  const otherChallenges = challenges.filter((c) => {
    if (c.id === 'challenge-web-profile' || c.id === 'challenge-comm-intro') {
      return false;
    }
    if (activeFilter !== 'all' && c.type !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        (c.titleTamil && c.titleTamil.toLowerCase().includes(q)) ||
        c.skillName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-sky-300 px-3 py-1 rounded-full bg-[#EAF5FC] border border-[#BAE6FD]">
              {isTa ? 'செய்முறைச் சான்று தளம் · தமிழ்நாடு' : 'Hands-On Proof Engine · Tamil Nadu'}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD] font-bold">
              {challenges.length} {isTa ? 'செயலில் உள்ள சவால்கள்' : 'Active Challenges'}
            </span>
            <TrustLabel type="evidence-badge" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            {isTa ? 'நடைமுறை சான்றுகள் மூலம் உங்கள் உண்மையான திறனை நிரூபியுங்கள்' : 'Prove Real-World Competence'}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-[#526174] dark:text-night-muted max-w-xl leading-relaxed">
            {isTa
              ? 'சான்றிதழ்களுக்கு அப்பால் செல்லுங்கள். உடனடி AI மதிப்பீட்டுப் பரிந்துரைகளைப் பெற நேரடி நிரல் இணைப்புகள், தயாரிப்புப் புகைப்படங்கள் அல்லது குரல் பதிவுகளைச் சமர்ப்பிக்கவும்.'
              : 'Move beyond certificates. Submit live code links, craft inspection photos, or voice-recorded defenses to receive instant per-criterion AI rubric feedback.'}
          </p>
        </div>

        <div className="p-4 rounded-card bg-[#EAF5FC]/70 dark:bg-night-100 border border-[#BAE6FD] dark:border-night-border shrink-0 text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#526174]">
            {isTa ? 'மதிப்பீட்டு நெறிமுறை' : 'Evaluation Protocol'}
          </div>
          <div className="text-lg font-black text-[#173B67] dark:text-white mt-0.5">
            {isTa ? 'வெளிப்படையான விதிமுறை' : 'Transparent Rubric'}
          </div>
          <div className="text-[11px] text-[#526174] mt-1">
            {isTa ? 'நிலை: ' : 'Status: '}<span className="font-bold text-[#10B981]">{isTa ? 'AI-ஆய்வு செய்யப்பட்டது' : 'AI-reviewed'}</span>
          </div>
        </div>
      </div>

      {/* 2. TWO FULLY IMPLEMENTED FEATURED CHALLENGES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#62B6E8] dark:text-sky-400">
              {isTa ? 'ஊடாடும் விதிமுறை பணியிடங்கள்' : 'Interactive Rubric Workspaces'}
            </span>
            <h2 className="text-xl font-bold text-[#173B67] dark:text-white">
              {isTa ? 'சிறப்பு முதன்மை சவால்கள்' : 'Featured Flagship Challenges'}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#526174]">
            {isTa ? 'v1 மற்றும் v2 திருத்த ஒப்பீட்டுடன் முழுமையாக செயல்படுத்தப்பட்டது' : 'Fully implemented with v1 vs v2 revision delta'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flagship 1: Build a responsive profile page */}
          {featuredWebProfile && (
            <div id="challenge-card-web-profile" className="p-6 rounded-card bg-white dark:bg-night-card border-2 border-[#BAE6FD] dark:border-night-border shadow-soft flex flex-col justify-between relative overflow-hidden group hover:border-[#62B6E8] transition-all">
              <div className="absolute top-0 right-0 bg-[#EAF5FC] text-[#173B67] border-l border-b border-[#BAE6FD] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                {isTa ? 'தொழில்நுட்ப சவால்' : 'Technical Challenge'}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-btn bg-[#EAF5FC] dark:bg-night-card text-[#173B67] dark:text-sky-300 border border-[#BAE6FD]">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#526174] uppercase tracking-wider">
                      {featuredWebProfile.difficulty} • {featuredWebProfile.timeEstimate}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StatusPill status="ai_reviewed" />
                      <span className="text-xs font-extrabold text-[#D97706]">
                        +{featuredWebProfile.points} XP
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#173B67] dark:text-white mt-2 group-hover:text-[#62B6E8] transition-colors">
                  {isTa ? (featuredWebProfile.titleTamil || featuredWebProfile.title) : featuredWebProfile.title}
                </h3>

                <p className="mt-3 text-xs text-[#526174] dark:text-night-muted leading-relaxed">
                  {featuredWebProfile.description}
                </p>

                {/* Rubric Preview Badge */}
                <div className="mt-4 p-3 rounded-btn bg-[#F8FAFC] dark:bg-night-100/60 border border-[#E2E8F0] text-xs space-y-1.5">
                  <div className="font-bold text-[#173B67] dark:text-white flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{isTa ? 'வெளிப்படையான விதிமுறை அளவுகோல்கள்:' : 'Visible Rubric Criteria:'}</span>
                    </span>
                    <span className="text-[#10B981] font-semibold">{isTa ? '4 எடையிடப்பட்ட அளவுகோல்கள்' : '4 Weighted Checkpoints'}</span>
                  </div>
                  <div className="text-[11px] text-[#526174]">
                    Landmarks (25%) • Fluid Grid (30%) • Mobile 320px Overflow (25%) • Focus Visible (20%)
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs text-[#526174] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />
                  <span>{isTa ? 'v1 vs v2 திருத்த ஒப்பீட்டை ஆதரிக்கிறது' : 'Supports v1 vs v2 revision delta'}</span>
                </span>

                <button
                  onClick={() => handleOpenChallenge(featuredWebProfile.id)}
                  className="px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-xs shadow-soft flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>{isTa ? 'சவால் பணியிடத்தைத் திற' : 'Open Challenge Workspace'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Flagship 2: Write a professional introduction */}
          {featuredCommIntro && (
            <div className="p-6 rounded-card bg-white dark:bg-night-card border-2 border-[#BAE6FD] dark:border-night-border shadow-soft flex flex-col justify-between relative overflow-hidden group hover:border-[#62B6E8] transition-all">
              <div className="absolute top-0 right-0 bg-[#FFFBEB] text-[#B45309] border-l border-b border-[#FDE68A] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                {isTa ? 'தொடர்பு திறன் சவால்' : 'Communication Challenge'}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-btn bg-[#FFFBEB] dark:bg-night-card text-[#B45309] dark:text-amber-300 border border-[#FDE68A]">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#526174] uppercase tracking-wider">
                      {featuredCommIntro.difficulty} • {featuredCommIntro.timeEstimate}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StatusPill status="ai_reviewed" />
                      <span className="text-xs font-extrabold text-[#D97706]">
                        +{featuredCommIntro.points} XP
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#173B67] dark:text-white mt-2 group-hover:text-[#62B6E8] transition-colors">
                  {isTa ? (featuredCommIntro.titleTamil || featuredCommIntro.title) : featuredCommIntro.title}
                </h3>

                <p className="mt-3 text-xs text-[#526174] dark:text-night-muted leading-relaxed">
                  {featuredCommIntro.description}
                </p>

                {/* Rubric Preview Badge */}
                <div className="mt-4 p-3 rounded-btn bg-[#F8FAFC] dark:bg-night-100/60 border border-[#E2E8F0] text-xs space-y-1.5">
                  <div className="font-bold text-[#173B67] dark:text-white flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{isTa ? 'வெளிப்படையான விதிமுறை அளவுகோல்கள்:' : 'Visible Rubric Criteria:'}</span>
                    </span>
                    <span className="text-[#10B981] font-semibold">{isTa ? 'வலைப் பேச்சு மற்றும் ஒலிவாங்கி' : 'Web Speech & Microphone'}</span>
                  </div>
                  <div className="text-[11px] text-[#526174]">
                    Clarity (25%) • Evidence Citation (30%) • Cultural Warmth (25%) • Brevity (20%)
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs text-[#526174] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />
                  <span>{isTa ? 'குரல் அலைவரிசை மற்றும் பேச்சு API ஐ ஆதரிக்கிறது' : 'Supports voice waveform & speech API'}</span>
                </span>

                <button
                  onClick={() => handleOpenChallenge(featuredCommIntro.id)}
                  className="px-4 py-2 rounded-btn bg-white hover:bg-[#EAF5FC] border border-[#173B67] text-[#173B67] font-semibold text-xs shadow-soft flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>{isTa ? 'குரல் பணியிடத்தைத் திற' : 'Open Voice Workspace'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Filter & Search Controls */}
      <div className="p-4 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
        {/* Type Tabs */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#173B67] text-white shadow-soft'
                : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 hover:bg-[#D9EFFB]'
            }`}
          >
            {isTa ? 'அனைத்து சான்றுகளும்' : 'All Proofs'} ({challenges.length})
          </button>
          <button
            onClick={() => setActiveFilter('code')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'code'
                ? 'bg-[#173B67] text-white shadow-soft'
                : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 hover:bg-[#D9EFFB]'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>{isTa ? 'குறியீடு' : 'Code'}</span>
          </button>
          <button
            onClick={() => setActiveFilter('photo_upload')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'photo_upload'
                ? 'bg-[#173B67] text-white shadow-soft'
                : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 hover:bg-[#D9EFFB]'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>{isTa ? 'கைவினை புகைப்பட ஆய்வு' : 'Photo Craft Review'}</span>
          </button>
          <button
            onClick={() => setActiveFilter('viva')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'viva'
                ? 'bg-[#173B67] text-white shadow-soft'
                : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 hover:bg-[#D9EFFB]'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>{isTa ? 'வாய்மொழித் தேர்வுகள்' : 'Voice Vivas'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#526174] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTa ? 'திறன் மூலம் சவால்களைத் தேடுங்கள்...' : 'Search challenges by skill...'}
            className="w-full pl-8 pr-3 py-1.5 rounded-full text-xs bg-[#F8FAFC] dark:bg-night-100 border border-[#E2E8F0] text-[#173B67] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#62B6E8]"
          />
        </div>
      </div>

      {/* 4. Grid of Other Challenges or Empty State */}
      {otherChallenges.length === 0 ? (
        <EmptyState
          title={isTa ? 'தேடலுக்குரிய சவால்கள் எதுவும் கிடைக்கவில்லை' : 'No challenges found matching your filter'}
          description={isTa ? 'வடிப்பானை மீட்டமைத்து அனைத்து செய்முறை சவால்களையும் பார்க்கவும்.' : `No challenges matched "${searchQuery || activeFilter}". Try clearing your search keyword or switching back to "All Proofs".`}
          actionLabel={isTa ? 'அனைத்து சவால்களையும் காட்டு' : 'Show All Challenges'}
          onAction={() => {
            setActiveFilter('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherChallenges.map((challenge) => {
            const typeIcon = {
              code: <Code className="w-4 h-4 text-[#173B67] dark:text-sky-300" />,
              photo_upload: <Camera className="w-4 h-4 text-[#10B981] dark:text-emerald-400" />,
              viva: <Mic className="w-4 h-4 text-[#62B6E8] dark:text-sky-400" />,
              quiz: <Sparkles className="w-4 h-4 text-[#F2B66D] dark:text-amber-400" />
            }[challenge.type];

            return (
              <div
                key={challenge.id}
                className="p-5 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border hover:shadow-soft hover:border-[#62B6E8] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      {typeIcon}
                      <span className="text-[10px] font-bold text-[#526174] uppercase tracking-wider">
                        {challenge.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <StatusPill status="ai_reviewed" />
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 border border-[#BAE6FD]">
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#173B67] dark:text-white line-clamp-2">
                    {isTa ? (challenge.titleTamil || challenge.title) : challenge.title}
                  </h3>

                  <p className="mt-2 text-xs text-[#526174] dark:text-night-muted line-clamp-2 leading-relaxed">
                    {challenge.description}
                  </p>

                  {/* Cached Feedback Callout */}
                  <div className="mt-3 p-2.5 rounded-btn bg-[#F8FAFC] dark:bg-night-100/70 border border-[#E2E8F0] text-[11px] text-[#526174] leading-snug">
                    <span className="font-bold text-[#10B981]">{isTa ? 'மதிப்பாய்வு விவரம்: ' : 'Cached review: '}</span>
                    <span>
                      {challenge.score
                        ? `Evaluated against ${challenge.rubric.length}-tier rubric (${challenge.score}% pass).`
                        : `Standard ${challenge.rubric.length}-tier rubric ready for automated feedback.`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-semibold text-[#D97706]">
                    <Award className="w-3.5 h-3.5" />
                    +{challenge.points} XP
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenChallenge(challenge.id)}
                    className="px-3.5 py-1.5 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-xs shadow-soft flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  >
                    <span>{isTa ? 'பணியிடத்தைத் திற' : 'Open Workspace'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
