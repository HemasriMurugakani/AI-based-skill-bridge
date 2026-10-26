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
  const { t } = useTranslation();

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
      <div className="p-6 sm:p-8 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
              Hands-On Proof Engine · Tamil Nadu
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-900 font-bold">
              12 Active Challenges
            </span>
            <TrustLabel type="evidence-badge" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
            Prove Real-World Competence
          </h1>
          <div className="font-tamil text-sm text-warm-muted dark:text-night-muted mt-0.5">
            நடைமுறை சான்றுகள் மூலம் உங்கள் உண்மையான திறனை நிரூபியுங்கள்
          </div>

          <p className="mt-2 text-xs sm:text-sm text-warm-muted dark:text-night-muted max-w-xl leading-relaxed">
            Move beyond certificates. Submit live code links, craft inspection photos, or voice-recorded defenses to receive instant per-criterion AI rubric feedback.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-parchment-100 dark:bg-night-100 border border-gold-300/60 dark:border-gold-700/60 shrink-0 text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-warm-muted">
            Evaluation Protocol
          </div>
          <div className="text-lg font-black text-maroon-700 dark:text-gold-400 mt-0.5">
            Transparent Rubric
          </div>
          <div className="text-[11px] text-warm-muted mt-1">
            Status: <span className="font-bold text-forest-700">AI-reviewed</span>
          </div>
        </div>
      </div>

      {/* 2. TWO FULLY IMPLEMENTED FEATURED CHALLENGES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
              Interactive Rubric Workspaces
            </span>
            <h2 className="text-xl font-bold font-heritage text-warm-ink dark:text-night-ink">
              Featured Flagship Challenges
            </h2>
          </div>
          <span className="text-xs font-semibold text-warm-muted">
            Fully implemented with v1 vs v2 revision delta
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flagship 1: Build a responsive profile page */}
          {featuredWebProfile && (
            <div id="challenge-card-web-profile" className="p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border-2 border-maroon-700/40 dark:border-gold-600/40 shadow-warm-md flex flex-col justify-between relative overflow-hidden group hover:border-maroon-700 transition-all">
              <div className="absolute top-0 right-0 bg-maroon-700 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Technical Challenge
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-maroon-100 dark:bg-maroon-950 text-maroon-800 dark:text-gold-400">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">
                      {featuredWebProfile.difficulty} • {featuredWebProfile.timeEstimate}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StatusPill status="ai_reviewed" />
                      <span className="text-xs font-extrabold text-gold-700 dark:text-gold-400">
                        +{featuredWebProfile.points} XP
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-heritage text-warm-ink dark:text-night-ink mt-2 group-hover:text-maroon-700 transition-colors">
                  {featuredWebProfile.title}
                </h3>
                <div className="font-tamil text-xs text-warm-muted dark:text-night-muted mt-0.5">
                  {featuredWebProfile.titleTamil}
                </div>

                <p className="mt-3 text-xs text-warm-muted dark:text-night-muted leading-relaxed">
                  {featuredWebProfile.description}
                </p>

                {/* Rubric Preview Badge */}
                <div className="mt-4 p-3 rounded-xl bg-parchment-100/70 dark:bg-night-100/60 border border-warm-border/60 text-xs space-y-1.5">
                  <div className="font-bold text-warm-ink dark:text-night-ink flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                      <span>Visible Rubric Criteria:</span>
                    </span>
                    <span className="text-forest-700 font-semibold">4 Weighted Checkpoints</span>
                  </div>
                  <div className="text-[11px] text-warm-muted">
                    Landmarks (25%) • Fluid Grid (30%) • Mobile 320px Overflow (25%) • Focus Visible (20%)
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-warm-border/60 flex items-center justify-between">
                <span className="text-xs text-warm-muted flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span>Supports v1 vs v2 revision delta</span>
                </span>

                <button
                  onClick={() => handleOpenChallenge(featuredWebProfile.id)}
                  className="px-4 py-2 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-warm-sm flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>Open Challenge Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Flagship 2: Write a professional introduction */}
          {featuredCommIntro && (
            <div className="p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border-2 border-gold-600/40 shadow-warm-md flex flex-col justify-between relative overflow-hidden group hover:border-gold-600 transition-all">
              <div className="absolute top-0 right-0 bg-gold-600 text-maroon-950 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Communication Challenge
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-gold-100 dark:bg-gold-950 text-gold-800 dark:text-gold-300">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">
                      {featuredCommIntro.difficulty} • {featuredCommIntro.timeEstimate}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StatusPill status="ai_reviewed" />
                      <span className="text-xs font-extrabold text-gold-700 dark:text-gold-400">
                        +{featuredCommIntro.points} XP
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-heritage text-warm-ink dark:text-night-ink mt-2 group-hover:text-gold-600 transition-colors">
                  {featuredCommIntro.title}
                </h3>
                <div className="font-tamil text-xs text-warm-muted dark:text-night-muted mt-0.5">
                  {featuredCommIntro.titleTamil}
                </div>

                <p className="mt-3 text-xs text-warm-muted dark:text-night-muted leading-relaxed">
                  {featuredCommIntro.description}
                </p>

                {/* Rubric Preview Badge */}
                <div className="mt-4 p-3 rounded-xl bg-parchment-100/70 dark:bg-night-100/60 border border-warm-border/60 text-xs space-y-1.5">
                  <div className="font-bold text-warm-ink dark:text-night-ink flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                      <span>Visible Rubric Criteria:</span>
                    </span>
                    <span className="text-forest-700 font-semibold">Web Speech & Microphone</span>
                  </div>
                  <div className="text-[11px] text-warm-muted">
                    Clarity (25%) • Evidence Citation (30%) • Cultural Warmth (25%) • Brevity (20%)
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-warm-border/60 flex items-center justify-between">
                <span className="text-xs text-warm-muted flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span>Supports voice waveform & speech API</span>
                </span>

                <button
                  onClick={() => handleOpenChallenge(featuredCommIntro.id)}
                  className="px-4 py-2 rounded-full bg-gold-600 hover:bg-gold-500 text-maroon-950 font-extrabold text-xs shadow-warm-sm flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>Open Voice Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Filter & Search Controls */}
      <div className="p-4 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-maroon-700 text-white shadow-xs'
                : 'bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
            }`}
          >
            All Proofs ({challenges.length})
          </button>
          <button
            onClick={() => setActiveFilter('code')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'code'
                ? 'bg-maroon-700 text-white shadow-xs'
                : 'bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setActiveFilter('photo_upload')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'photo_upload'
                ? 'bg-maroon-700 text-white shadow-xs'
                : 'bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Photo Craft Review</span>
          </button>
          <button
            onClick={() => setActiveFilter('viva')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'viva'
                ? 'bg-maroon-700 text-white shadow-xs'
                : 'bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>Voice Vivas</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-warm-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search challenges by skill..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full text-xs bg-parchment-100 dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* 4. Grid of Other Challenges or Empty State */}
      {otherChallenges.length === 0 ? (
        <EmptyState
          title="No challenges found matching your filter"
          titleTamil="தேடலுக்குரிய சவால்கள் எதுவும் கிடைக்கவில்லை"
          description={`No challenges matched "${searchQuery || activeFilter}". Try clearing your search keyword or switching back to "All Proofs".`}
          descriptionTamil="வடிப்பானை மீட்டமைத்து அனைத்து செய்முறை சவால்களையும் பார்க்கவும்."
          actionLabel="Show All Challenges"
          actionLabelTamil="அனைத்து சவால்களையும் காட்டு"
          onAction={() => {
            setActiveFilter('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherChallenges.map((challenge) => {
            const typeIcon = {
              code: <Code className="w-4 h-4 text-maroon-700 dark:text-gold-400" />,
              photo_upload: <Camera className="w-4 h-4 text-forest-600 dark:text-forest-400" />,
              viva: <Mic className="w-4 h-4 text-gold-600 dark:text-gold-400" />,
              quiz: <Sparkles className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />
            }[challenge.type];

            return (
              <div
                key={challenge.id}
                className="p-5 rounded-card bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border hover:shadow-warm-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      {typeIcon}
                      <span className="text-[10px] font-bold text-warm-muted uppercase tracking-wider">
                        {challenge.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <StatusPill status="ai_reviewed" />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-parchment-200 dark:bg-night-100 text-warm-ink">
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-warm-ink dark:text-night-ink line-clamp-2">
                    {challenge.title}
                  </h3>
                  {challenge.titleTamil && (
                    <div className="font-tamil text-[11px] text-warm-muted dark:text-night-muted mt-0.5 line-clamp-1">
                      {challenge.titleTamil}
                    </div>
                  )}

                  <p className="mt-2 text-xs text-warm-muted dark:text-night-muted line-clamp-2 leading-relaxed">
                    {challenge.description}
                  </p>

                  {/* Cached Feedback Callout */}
                  <div className="mt-3 p-2.5 rounded-xl bg-parchment-100/70 dark:bg-night-100/70 border border-warm-border/60 text-[11px] text-warm-muted leading-snug">
                    <span className="font-bold text-forest-700 dark:text-forest-400">Cached review: </span>
                    <span>
                      {challenge.score
                        ? `Evaluated against ${challenge.rubric.length}-tier rubric (${challenge.score}% pass).`
                        : `Standard ${challenge.rubric.length}-tier rubric ready for automated feedback.`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-warm-border/60 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-semibold text-gold-700 dark:text-gold-400">
                    <Award className="w-3.5 h-3.5" />
                    +{challenge.points} XP
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenChallenge(challenge.id)}
                    className="px-3.5 py-1.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-warm-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  >
                    <span>Open Workspace</span>
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
