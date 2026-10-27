import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { TrustLabel } from '../components/TrustLabel';
import { Opportunity, ApplicationTrackerStage } from '../types';
import { governmentSchemes } from '../data/schemes';
import {
  Briefcase,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
  Search,
  Sparkles,
  Clock,
  X,
  Bookmark,
  Send,
  Landmark,
  Target,
  ArrowLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const OpportunitiesView: React.FC = () => {
  const {
    opportunities,
    getPersona,
    setActiveTab,
    language,
    trackerStages,
    setTrackerStage,
    roadmapFocusSkills,
    addMissingSkillsToRoadmap
  } = useSkillBridgeStore();
  const persona = getPersona();
  const isTamil = language === 'ta';

  // Navigation tab state
  const [activeMainTab, setActiveMainTab] = useState<'opportunities' | 'schemes' | 'tracker'>('opportunities');

  // Filters state
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'technical' | 'vocational'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Drawer state
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [addedSkillsToast, setAddedSkillsToast] = useState<string | null>(null);

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    // Location filter
    const matchesLocation =
      selectedLocation === 'all' ||
      opp.location.toLowerCase().includes(selectedLocation.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategory === 'all' || opp.category === selectedCategory;

    // Search query
    const matchesSearch =
      !searchQuery ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.requiredSkills.some(s => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLocation && matchesCategory && matchesSearch;
  });

  const handleOpenDrawer = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
  };

  const handleCloseDrawer = () => {
    setSelectedOpportunity(null);
  };

  const handleAddSkillsToRoadmap = (skillNames: string[]) => {
    addMissingSkillsToRoadmap(skillNames);
    setAddedSkillsToast(
      isTamil
        ? `"${skillNames.join(', ')}" உங்கள் கற்றல் வரைபடத்தில் சேர்க்கப்பட்டது!`
        : `Added "${skillNames.join(', ')}" to your active roadmap focus!`
    );
    setTimeout(() => {
      setAddedSkillsToast(null);
    }, 4500);
  };

  const handleStageChange = (oppId: string, newStage: ApplicationTrackerStage) => {
    setTrackerStage(oppId, newStage);
  };

  const handleStartChallenge = (challengeId: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/challenges/${challengeId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setActiveTab('challenges');
  };

  // Group opportunities by tracker stages
  const trackerColumns: { stage: ApplicationTrackerStage; label: string; labelTamil: string; icon: React.ReactNode; color: string }[] = [
    {
      stage: 'saved',
      label: 'Saved',
      labelTamil: 'சேமிக்கப்பட்டவை',
      icon: <Bookmark className="w-4 h-4 text-warm-ink dark:text-gold-300" />,
      color: 'border-warm-border/80 dark:border-night-border'
    },
    {
      stage: 'preparing',
      label: 'Preparing',
      labelTamil: 'தயாராகுதல்',
      icon: <Clock className="w-4 h-4 text-gold-600 dark:text-gold-400" />,
      color: 'border-gold-300 dark:border-gold-700/60'
    },
    {
      stage: 'ready',
      label: 'Ready to Apply',
      labelTamil: 'விண்ணப்பிக்க தயார்',
      icon: <CheckCircle2 className="w-4 h-4 text-forest-600 dark:text-forest-400" />,
      color: 'border-forest-300 dark:border-forest-700/60'
    },
    {
      stage: 'applied',
      label: 'Passport Sent',
      labelTamil: 'விண்ணப்பம் அனுப்பப்பட்டது',
      icon: <Send className="w-4 h-4 text-maroon-700 dark:text-gold-300" />,
      color: 'border-maroon-300 dark:border-maroon-800/60'
    }
  ];

  const getStageOppList = (stage: ApplicationTrackerStage) => {
    return opportunities.filter(opp => {
      const currentStage = trackerStages[opp.id] || 'saved';
      return currentStage === stage;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto pb-12">
      {/* ------------------------------------------------------------------ */}
      {/* TOP HEADER */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 sm:p-7 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon-100 dark:bg-maroon-950/80 text-maroon-800 dark:text-gold-300 border border-maroon-200 dark:border-maroon-800/60">
                {isTamil ? 'வேலைவாய்ப்பு வழிகாட்டல்' : 'Opportunity Discovery & Guidance'}
              </span>
              <TrustLabel type="sample-opportunity" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
              {isTamil ? 'மாவட்ட வாய்ப்புகள் & அரசுத் திட்டங்கள்' : 'District Opportunities & Govt Schemes'}
            </h1>

            <p className="text-xs sm:text-sm text-warm-muted dark:text-night-muted max-w-2xl leading-relaxed">
              {isTamil
                ? 'அனைத்து வாய்ப்புகளும் மாதிரி உதாரணங்கள் மட்டுமே. உங்கள் சரிபார்க்கப்பட்ட குறியீடு, செய்முறை சான்றுகள் மற்றும் அரசு தொழிற்பழகுநர் திட்டங்களை இணைக்க உதவும் வழிகாட்டி.'
                : 'All opportunities listed are strictly labeled demonstration samples. Discover realistic hiring criteria, bridge skill gaps, learn about official apprenticeships, and track your mock preparation.'}
            </p>
          </div>

          {/* Persona context */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-parchment-200/60 dark:bg-night-100/60 border border-warm-border/60 text-xs space-y-1 w-full lg:w-auto lg:min-w-[200px]">
            <div className="text-[11px] uppercase font-bold text-warm-muted dark:text-night-muted">
              {isTamil ? 'பயிற்சி பயனர்' : 'Active Profile'}
            </div>
            <div className="font-bold text-warm-ink dark:text-night-ink">
              {isTamil ? persona.nameTamil : persona.name}
            </div>
            <div className="text-maroon-700 dark:text-gold-400 font-medium">
              {persona.location}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-warm-border/60 dark:border-night-border/60">
          <button
            type="button"
            onClick={() => setActiveMainTab('opportunities')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'opportunities'
                ? 'bg-maroon-700 text-white shadow-warm-sm'
                : 'bg-parchment-200/80 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{isTamil ? 'மாதிரி வாய்ப்புகள் (10)' : 'Sample Opportunities (10)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('schemes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'schemes'
                ? 'bg-maroon-700 text-white shadow-warm-sm'
                : 'bg-parchment-200/80 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>{isTamil ? 'அரசு திட்டங்கள் (Skill India & NAPS)' : 'Government Schemes (Skill India & NAPS)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('tracker')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'tracker'
                ? 'bg-maroon-700 text-white shadow-warm-sm'
                : 'bg-parchment-200/80 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>{isTamil ? 'விண்ணப்ப கண்காணிப்பாளர்' : 'Application Tracker'}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {addedSkillsToast && (
        <div className="p-3.5 rounded-xl bg-forest-100 dark:bg-forest-950/80 border border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-200 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-warm-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-forest-400 shrink-0" />
            <span>{addedSkillsToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className="text-forest-800 dark:text-forest-300 underline underline-offset-2 hover:text-forest-950 text-xs cursor-pointer"
          >
            {isTamil ? 'வரைபடத்தைக் காண்க →' : 'View Roadmap →'}
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: 10 SAMPLE OPPORTUNITIES (TECHNICAL + VOCATIONAL) */}
      {/* ------------------------------------------------------------------ */}
      {activeMainTab === 'opportunities' && (
        <div className="space-y-5">
          {/* Filter & Search Bar */}
          <div className="p-4 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted" />
              <input
                type="text"
                placeholder={isTamil ? 'நிறுவனம், வேலை அல்லது திறன் தேடுக...' : 'Search role, company, location, or skill...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-parchment-100 dark:bg-night-100 border border-warm-border dark:border-night-border text-warm-ink dark:text-night-ink focus:outline-none focus:ring-1 focus:ring-maroon-700"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-maroon-700 text-white'
                    : 'bg-parchment-200/80 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
                }`}
              >
                {isTamil ? 'அனைத்து துறைகளும் (10)' : 'All Roles (10)'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('technical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'technical'
                    ? 'bg-maroon-700 text-white'
                    : 'bg-parchment-200/80 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
                }`}
              >
                {isTamil ? 'தொழில்நுட்பம் (5)' : 'Technical (5)'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('vocational')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'vocational'
                    ? 'bg-maroon-700 text-white'
                    : 'bg-parchment-200/80 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
                }`}
              >
                {isTamil ? 'தொழிற்கல்வி & கைவினை (5)' : 'Vocational & Craft (5)'}
              </button>
            </div>
          </div>

          {/* District Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-warm-muted dark:text-night-muted mr-1">
              {isTamil ? 'மாவட்டம்:' : 'District:'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedLocation('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                selectedLocation === 'all'
                  ? 'bg-maroon-700 text-white shadow-warm-sm'
                  : 'bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
              }`}
            >
              All Districts
            </button>
            {['Chennai', 'Coimbatore', 'Tiruppur', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'].map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => setSelectedLocation(dist)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  selectedLocation === dist
                    ? 'bg-maroon-700 text-white shadow-warm-sm'
                    : 'bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>

          {/* 10 Opportunities Grid or Empty State */}
          {filteredOpportunities.length === 0 ? (
            <EmptyState
              title={isTamil ? 'வாய்ப்புகள் எதுவும் பொருந்தவில்லை' : 'No matching opportunities found'}
              titleTamil="வடிகட்டி அல்லது தேடலை மாற்றவும்"
              description={`No sample opportunities matched "${searchQuery || selectedLocation || selectedCategory}". Try clearing your search keyword or switching to "All Roles" or "All Districts".`}
              descriptionTamil="உங்கள் தேடல் அல்லது மாவட்ட வடிப்பானை மாற்றி மீண்டும் முயற்சிக்கவும்."
              actionLabel="Show All Roles & Districts"
              actionLabelTamil="அனைத்தையும் காட்டு"
              onAction={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredOpportunities.map((opp) => {
                const matchedCount = opp.requiredSkills.filter(s => s.met).length;
                const totalCount = opp.requiredSkills.length;
                const currentTrackerStage = trackerStages[opp.id] || 'saved';

              return (
                <div
                  key={opp.id}
                  id={opp.id === 'opp-chennai-frontend-trainee' ? 'opportunity-spotlight-card' : `opportunity-card-${opp.id}`}
                  className={`relative p-5 sm:p-6 rounded-card bg-parchment-50 dark:bg-night-card border shadow-warm-sm hover:shadow-warm-md transition-all overflow-hidden ${
                    opp.id === 'opp-chennai-frontend-trainee'
                      ? 'border-2 border-gold-400 dark:border-gold-500 ring-2 ring-gold-400/30'
                      : 'border-warm-border/80 dark:border-night-border'
                  }`}
                >
                  {/* "Sample · not a real vacancy" ribbon (STRICT REQUIREMENT) */}
                  <div className="absolute top-0 right-0 bg-gold-400 dark:bg-gold-600 text-night-DEFAULT dark:text-night-ink text-[10px] font-extrabold uppercase tracking-widest px-4 py-0.5 rounded-bl-xl shadow-xs border-b border-l border-gold-500">
                    {isTamil ? 'மாதிரி · நேரடி வேலைவாய்ப்பு அல்ல' : 'Sample · not a real vacancy'}
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    {/* Left: Role Info & Skills */}
                    <div className="space-y-3 flex-1 pr-0 lg:pr-6">
                      <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                        {opp.id === 'opp-chennai-frontend-trainee' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-gold-500/30 to-amber-500/25 border border-gold-500 text-gold-950 dark:text-gold-200 text-xs font-black shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                            <span>⚡ ONLY JAVASCRIPT MISSING (88% MATCH)</span>
                          </span>
                        )}
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink border border-warm-border/60">
                          {opp.type}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-maroon-50 dark:bg-maroon-950/60 text-maroon-800 dark:text-gold-300 border border-maroon-200 dark:border-maroon-900/60">
                          {opp.category === 'technical' ? (isTamil ? 'தொழில்நுட்பம்' : 'Technical') : (isTamil ? 'தொழிற்கல்வி' : 'Vocational')}
                        </span>
                        <span className="text-xs text-warm-muted dark:text-night-muted">
                          {opp.postedDate}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                          {opp.title}
                        </h3>
                        {opp.titleTamil && (
                          <div className="text-xs text-warm-muted dark:text-night-muted font-tamil mt-0.5">
                            {opp.titleTamil}
                          </div>
                        )}
                      </div>

                      {/* Company & Location & Stipend */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-warm-muted dark:text-night-muted">
                        <span className="flex items-center gap-1 font-semibold text-warm-ink dark:text-night-ink">
                          <Building className="w-3.5 h-3.5 text-maroon-700 dark:text-gold-400" />
                          {opp.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-warm-subtle" />
                          {opp.location}
                        </span>
                        <span className="font-bold text-forest-700 dark:text-forest-400">
                          {opp.stipendOrSalary}
                        </span>
                      </div>

                      <p className="text-xs text-warm-muted dark:text-night-muted leading-relaxed max-w-2xl">
                        {isTamil && opp.descriptionTamil ? opp.descriptionTamil : opp.description}
                      </p>

                      {/* ELIGIBILITY (STRICT REQUIREMENT) */}
                      <div className="p-2.5 rounded-xl bg-parchment-100 dark:bg-night-100/70 border border-warm-border/60 text-xs">
                        <span className="font-bold text-warm-ink dark:text-night-ink">
                          {isTamil ? 'தகுதி வரம்பு:' : 'Eligibility:'}
                        </span>{' '}
                        <span className="text-warm-muted dark:text-night-muted">
                          {isTamil && opp.eligibilityTamil ? opp.eligibilityTamil : opp.eligibility}
                        </span>
                      </div>

                      {/* REQUIRED SKILLS: SKILLS YOU HAVE (GREEN) vs MISSING (GOLD) (STRICT REQUIREMENT) */}
                      <div>
                        <div className="text-[11px] font-bold text-warm-ink dark:text-night-ink uppercase tracking-wide mb-1.5 flex items-center gap-2">
                          <span>
                            {isTamil ? 'தேவைப்படும் திறன்கள்:' : 'Required Competencies'} ({matchedCount}/{totalCount} {isTamil ? 'சரிபார்க்கப்பட்டது' : 'Verified'}):
                          </span>
                          <span className="text-[10px] text-warm-muted font-normal">
                            ({isTamil ? 'பச்சை = உங்களிடம் உள்ளது, பொன் = இடைவெளி' : 'Green = You Have, Gold = Missing'})
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {opp.requiredSkills.map((sk, sIdx) => (
                            <span
                              key={sIdx}
                              className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                                sk.met
                                  ? 'bg-forest-50 dark:bg-forest-950/70 text-forest-800 dark:text-forest-300 border border-forest-300 dark:border-forest-700/80'
                                  : 'bg-gold-50 dark:bg-gold-950/70 text-gold-900 dark:text-gold-200 border border-gold-300 dark:border-gold-700/80 font-bold'
                              }`}
                            >
                              {sk.met ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400 shrink-0" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400 shrink-0" />
                              )}
                              <span>
                                {sk.skillName} (Lvl {sk.requiredLevel})
                              </span>
                              {!sk.met && (
                                <span className="text-[10px] uppercase font-bold text-gold-700 dark:text-gold-400">
                                  [{isTamil ? 'இடைவெளி' : 'Missing'}]
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* NEXT ACTION (STRICT REQUIREMENT) */}
                      <div className="text-xs pt-1 flex items-center gap-2 text-warm-muted dark:text-night-muted">
                        <span className="font-bold text-warm-ink dark:text-night-ink">
                          {isTamil ? 'அடுத்த நடவடிக்கை:' : 'Next Action:'}
                        </span>
                        <span className="text-maroon-700 dark:text-gold-400 font-semibold">
                          {isTamil && opp.nextActionTamil ? opp.nextActionTamil : opp.nextAction}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Match Score, Tracker Stage, and Detail Action */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 lg:min-w-[190px] pt-4 lg:pt-0 border-t lg:border-t-0 border-warm-border/60">
                      <div className="text-left lg:text-right">
                        <div className="text-[11px] uppercase font-bold text-warm-muted">
                          {isTamil ? 'சான்று பொருத்தம்' : 'Proof Match'}
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold font-heritage text-maroon-800 dark:text-gold-400">
                          {opp.matchScore}%
                        </div>
                        <div className="text-[10px] text-warm-muted dark:text-night-muted">
                          {matchedCount} of {totalCount} verified
                        </div>
                      </div>

                      {/* Current Tracker Stage Indicator */}
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="text-[10px] uppercase font-bold text-warm-muted dark:text-night-muted">
                          {isTamil ? 'கண்காணிப்பு நிலை:' : 'Tracker Stage:'}
                        </div>
                        <select
                          value={currentTrackerStage}
                          onChange={(e) => handleStageChange(opp.id, e.target.value as ApplicationTrackerStage)}
                          className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-parchment-100 dark:bg-night-100 border border-warm-border dark:border-night-border text-warm-ink dark:text-night-ink cursor-pointer focus:outline-none"
                        >
                          <option value="saved">{isTamil ? 'சேமிக்கப்பட்டது' : 'Saved'}</option>
                          <option value="preparing">{isTamil ? 'தயாராகுதல்' : 'Preparing'}</option>
                          <option value="ready">{isTamil ? 'விண்ணப்பிக்க தயார்' : 'Ready to Apply'}</option>
                          <option value="applied">{isTamil ? 'விண்ணப்பம் அனுப்பப்பட்டது' : 'Passport Sent'}</option>
                        </select>
                      </div>

                      {/* Open Detail Drawer Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenDrawer(opp)}
                        className="w-full px-4 py-2.5 rounded-xl font-bold text-xs bg-maroon-700 hover:bg-maroon-800 text-white shadow-warm-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                        <span>{isTamil ? 'பொருத்தம் & விவரங்கள்' : 'View Match Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: GOVERNMENT SCHEMES (SKILL INDIA, NAPS, NAAN MUDHALVAN) */}
      {/* ------------------------------------------------------------------ */}
      {activeMainTab === 'schemes' && (
        <div className="space-y-6">
          {/* Informational Disclaimer Banner (STRICT COMPLIANCE REQUIREMENT) */}
          <div className="p-5 rounded-card-lg bg-gold-50 dark:bg-gold-950/40 border-2 border-gold-300 dark:border-gold-700/60 shadow-warm-sm space-y-2">
            <div className="flex items-center gap-2 text-gold-900 dark:text-gold-200">
              <ShieldCheck className="w-5 h-5 text-gold-700 dark:text-gold-400 shrink-0" />
              <h3 className="text-sm font-bold tracking-wide">
                {isTamil ? 'அரசுத் திட்டங்கள் பொது தகவல் அறிவிப்பு' : 'Public Informational Guidance & Non-Affiliation Notice'}
              </h3>
            </div>
            <p className="text-xs text-warm-muted dark:text-night-muted leading-relaxed">
              {isTamil
                ? 'இந்த வழிகாட்டல் விழிப்புணர்வு நோக்கத்திற்காக மட்டுமே வழங்கப்படுகிறது. SkillBridge AI எந்த அரசுத் துறையுடனும் நேரடியாக இணைக்கப்படவில்லை, தகுதி முடிவுகளை எடுப்பதில்லை, அல்லது அரசு உதவித்தொகைகளை வழங்குவதில்லை. அதிகாரப்பூர்வ தகவல்களுக்கு அரசு இணையதளங்களை நேரடியாக பார்வையிடவும்.'
                : 'This section provides educational information regarding central and state skilling initiatives. SkillBridge AI is an independent civic learning assistant and is <strong>not affiliated with, nor does it make eligibility determinations or process official applications</strong> for any government agency. Official registration, eligibility verification, and stipend disbursement are handled exclusively through the respective official government portals.'}
            </p>
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {governmentSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="p-5 sm:p-6 rounded-card bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col justify-between space-y-4 hover:shadow-warm-md transition-shadow"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-100 dark:bg-gold-950/60 text-gold-800 dark:text-gold-300 border border-gold-300">
                      {scheme.badgeTag}
                    </span>
                    <Landmark className="w-4 h-4 text-maroon-700 dark:text-gold-400 shrink-0" />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-heritage text-warm-ink dark:text-night-ink">
                      {scheme.name}
                    </h3>
                    <div className="text-xs text-warm-muted dark:text-night-muted font-tamil">
                      {scheme.nameTamil}
                    </div>
                  </div>

                  <div className="text-[11px] text-maroon-700 dark:text-gold-400 font-semibold">
                    {scheme.ministryOrAuthority}
                  </div>

                  <p className="text-xs text-warm-muted dark:text-night-muted leading-relaxed">
                    {isTamil ? scheme.descriptionTamil : scheme.description}
                  </p>

                  {/* Beneficiary Pill */}
                  <div className="p-2.5 rounded-xl bg-parchment-100 dark:bg-night-100/70 border border-warm-border/60 text-xs">
                    <span className="font-bold text-warm-ink dark:text-night-ink">
                      {isTamil ? 'பயனாளிகள்:' : 'Target Beneficiaries:'}
                    </span>{' '}
                    <span className="text-warm-muted dark:text-night-muted">
                      {isTamil ? scheme.targetBeneficiariesTamil : scheme.targetBeneficiaries}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-warm-muted">
                      {isTamil ? 'முக்கிய நன்மைகள்:' : 'Key Highlights:'}
                    </div>
                    <ul className="space-y-1 text-xs text-warm-muted dark:text-night-muted">
                      {(isTamil ? scheme.keyHighlightsTamil : scheme.keyHighlights).map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-forest-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* External Link Out (STRICT REQUIREMENT: "Learn about", opens in new tab, no integration implied) */}
                <div className="pt-3 border-t border-warm-border/60 dark:border-night-border/60">
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-parchment-200/90 dark:bg-night-100 hover:bg-parchment-300 dark:hover:bg-night-50 text-maroon-800 dark:text-gold-300 border border-warm-border dark:border-night-border transition-colors cursor-pointer"
                  >
                    <span>{isTamil ? scheme.learnMoreCtaTextTamil : scheme.learnMoreCtaText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <div className="text-[10px] text-center text-warm-muted dark:text-night-muted mt-1.5">
                    {isTamil ? 'அதிகாரப்பூர்வ அரசு இணையதளத்திற்குச் செல்கிறது' : 'Opens official government portal in a new tab'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: MOCK APPLICATION TRACKER (Saved → Preparing → Ready → Applied) */}
      {/* ------------------------------------------------------------------ */}
      {activeMainTab === 'tracker' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-warm-ink dark:text-night-ink text-sm">
                {isTamil ? 'மாதிரி விண்ணப்ப மேலாண்மை பலகை' : 'Mock Application Pipeline (4 Stages)'}
              </div>
              <div className="text-warm-muted dark:text-night-muted">
                {isTamil
                  ? 'சேமிக்கப்பட்டது → தயார் நிலை → விண்ணப்பிக்க தயார் → கடவுச்சீட்டு அனுப்பப்பட்டது'
                  : 'Track your preparation progress from bookmarking to submitting your verifiable SkillBridge Passport.'}
              </div>
            </div>
            <div className="text-[11px] text-warm-muted italic">
              {isTamil ? 'நிலைகளை மாற்ற அட்டை பொத்தான்களை அழுத்தவும்' : 'Click buttons on any card to move between stages'}
            </div>
          </div>

          {/* 4 Columns Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trackerColumns.map((col) => {
              const items = getStageOppList(col.stage);

              return (
                <div
                  key={col.stage}
                  className={`rounded-card-lg bg-parchment-100/60 dark:bg-night-100/50 border ${col.color} p-4 space-y-3 flex flex-col min-h-[420px]`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-warm-border/60 dark:border-night-border/60">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-warm-ink dark:text-night-ink">
                      {col.icon}
                      <span>{isTamil ? col.labelTamil : col.label}</span>
                    </div>
                    <span className="w-5 h-5 rounded-full bg-parchment-300/80 dark:bg-night-card font-bold text-[11px] flex items-center justify-center text-warm-ink dark:text-night-ink">
                      {items.length}
                    </span>
                  </div>

                  {/* Column Items */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-warm-border text-center text-xs text-warm-muted dark:text-night-muted">
                        {isTamil ? 'வாய்ப்புகள் இல்லை' : 'No roles in this stage'}
                      </div>
                    ) : (
                      items.map((opp) => (
                        <div
                          key={opp.id}
                          className="p-3.5 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border/70 dark:border-night-border shadow-warm-sm space-y-2.5 transition-all hover:shadow-warm-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-xs text-warm-ink dark:text-night-ink leading-snug">
                                {opp.title}
                              </div>
                              <div className="text-[11px] text-maroon-700 dark:text-gold-400 font-medium">
                                {opp.company}
                              </div>
                            </div>
                            <span className="font-bold text-xs text-forest-700 dark:text-forest-400 shrink-0">
                              {opp.matchScore}%
                            </span>
                          </div>

                          <div className="text-[11px] text-warm-muted dark:text-night-muted flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-warm-subtle shrink-0" />
                            <span className="truncate">{opp.location}</span>
                          </div>

                          {/* Stage Transition Controls */}
                          <div className="pt-2 border-t border-warm-border/50 dark:border-night-border/50 flex items-center justify-between gap-1 text-[10px]">
                            {col.stage === 'saved' && (
                              <button
                                type="button"
                                onClick={() => handleStageChange(opp.id, 'preparing')}
                                className="w-full py-1.5 px-2 rounded-lg bg-gold-100 hover:bg-gold-200 text-gold-900 font-bold flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>Move to Preparing</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {col.stage === 'preparing' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStageChange(opp.id, 'saved')}
                                  className="py-1 px-1.5 rounded text-warm-muted hover:text-warm-ink cursor-pointer"
                                  title="Move Back"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStageChange(opp.id, 'ready')}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-forest-100 hover:bg-forest-200 text-forest-900 font-bold flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>Mark Ready</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </>
                            )}

                            {col.stage === 'ready' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStageChange(opp.id, 'preparing')}
                                  className="py-1 px-1.5 rounded text-warm-muted hover:text-warm-ink cursor-pointer"
                                  title="Move Back"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStageChange(opp.id, 'applied')}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-white font-bold flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Send Passport</span>
                                </button>
                              </>
                            )}

                            {col.stage === 'applied' && (
                              <div className="w-full flex items-center justify-between text-forest-700 dark:text-forest-400 font-bold">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Passport Logged</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleStageChange(opp.id, 'ready')}
                                  className="text-warm-muted hover:text-warm-ink text-[10px] underline cursor-pointer"
                                >
                                  Reset
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* DETAIL DRAWER WITH AI-STYLE MATCH EXPLANATION (STRICT REQUIREMENT) */}
      {/* ------------------------------------------------------------------ */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg h-full bg-parchment-50 dark:bg-night-card border-l border-warm-border dark:border-night-border shadow-warm-lg p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-warm-border/70 dark:border-night-border/70">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gold-400 text-night-DEFAULT">
                    Sample Vacancy
                  </span>
                  <span className="text-xs text-warm-muted">
                    {selectedOpportunity.type}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-heritage text-warm-ink dark:text-night-ink">
                  {selectedOpportunity.title}
                </h2>
                <div className="text-xs font-semibold text-maroon-700 dark:text-gold-400 mt-0.5">
                  {selectedOpportunity.company} • {selectedOpportunity.location}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="p-1 rounded-lg text-warm-muted hover:bg-parchment-200 dark:hover:bg-night-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compensation & Match Rating */}
            <div className="p-4 rounded-xl bg-parchment-100 dark:bg-night-100/80 border border-warm-border/60 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase font-bold text-warm-muted">Estimated Stipend / Pay</div>
                <div className="text-base font-bold text-forest-700 dark:text-forest-400">
                  {selectedOpportunity.stipendOrSalary}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase font-bold text-warm-muted">Proof Match</div>
                <div className="text-2xl font-extrabold font-heritage text-maroon-800 dark:text-gold-400">
                  {selectedOpportunity.matchScore}%
                </div>
              </div>
            </div>

            {/* AI-STYLE EXPLANATION OF THE MATCH (STRICT REQUIREMENT) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-gold-50/80 via-parchment-100 to-forest-50/50 dark:from-night-100 dark:via-night-100 dark:to-forest-950/20 border-2 border-gold-300 dark:border-gold-700/60 shadow-warm-sm space-y-3">
              <div className="flex items-center gap-2 text-gold-900 dark:text-gold-200">
                <Sparkles className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {isTamil ? 'AI பொருத்தம் பகுப்பாய்வு' : 'AI Match Explanation & Reasoning'}
                </h4>
              </div>

              {selectedOpportunity.aiExplanation && (
                <div className="space-y-2.5 text-xs">
                  {/* Verified Strengths */}
                  <div className="space-y-1">
                    <div className="font-bold text-forest-800 dark:text-forest-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isTamil ? 'நிரூபிக்கப்பட்ட பலங்கள்:' : 'Your Verified Strengths:'}</span>
                    </div>
                    <p className="text-warm-muted dark:text-night-muted leading-relaxed pl-5">
                      {isTamil && selectedOpportunity.aiExplanation.strengthsTamil
                        ? selectedOpportunity.aiExplanation.strengthsTamil
                        : selectedOpportunity.aiExplanation.strengths}
                    </p>
                  </div>

                  {/* Detected Gaps */}
                  <div className="space-y-1">
                    <div className="font-bold text-gold-900 dark:text-gold-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{isTamil ? 'இடைவெளி பகுப்பாய்வு:' : 'Identified Skill Gaps:'}</span>
                    </div>
                    <p className="text-warm-muted dark:text-night-muted leading-relaxed pl-5">
                      {isTamil && selectedOpportunity.aiExplanation.gapsTamil
                        ? selectedOpportunity.aiExplanation.gapsTamil
                        : selectedOpportunity.aiExplanation.gaps}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="space-y-1 pt-1">
                    <div className="font-bold text-maroon-800 dark:text-gold-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>{isTamil ? 'பரிந்துரைக்கப்பட்ட நடவடிக்கை:' : 'Recommended Action:'}</span>
                    </div>
                    <p className="text-warm-muted dark:text-night-muted leading-relaxed pl-5">
                      {isTamil && selectedOpportunity.aiExplanation.roadmapActionTamil
                        ? selectedOpportunity.aiExplanation.roadmapActionTamil
                        : selectedOpportunity.aiExplanation.roadmapAction}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* BUTTON: "Add missing skills to roadmap" (STRICT REQUIREMENT) */}
            {selectedOpportunity.requiredSkills.some(s => !s.met) && (() => {
              const missingSkills = selectedOpportunity.requiredSkills
                .filter(s => !s.met)
                .map(s => s.skillName);
              const isAlreadyOnRoadmap =
                missingSkills.length > 0 &&
                missingSkills.every(m => roadmapFocusSkills.includes(m));

              return (
                <button
                  type="button"
                  disabled={isAlreadyOnRoadmap}
                  onClick={() => handleAddSkillsToRoadmap(missingSkills)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-warm-sm transition-all flex items-center justify-center gap-2 ${
                    isAlreadyOnRoadmap
                      ? 'bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300 border border-forest-300 dark:border-forest-700 cursor-default'
                      : 'bg-gold-400 hover:bg-gold-500 text-night-DEFAULT cursor-pointer'
                  }`}
                >
                  {isAlreadyOnRoadmap ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>
                    {isAlreadyOnRoadmap
                      ? (isTamil ? 'திறன்கள் கற்றல் வரைபடத்தில் உள்ளன' : 'Skills active on your roadmap')
                      : (isTamil ? 'விடுபட்ட திறன்களை வரைபடத்தில் சேர்க்கவும்' : 'Add missing skills to roadmap')}
                  </span>
                </button>
              );
            })()}

            {/* Required Skills Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-warm-muted">
                {isTamil ? 'திறன் சரிபார்ப்பு நிலை:' : 'Competency Verification Status:'}
              </div>
              <div className="space-y-1.5">
                {selectedOpportunity.requiredSkills.map((sk, idx) => {
                  const onRoadmap = roadmapFocusSkills.includes(sk.skillName);

                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-parchment-100 dark:bg-night-100/70 border border-warm-border/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {sk.met ? (
                          <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gold-600 shrink-0" />
                        )}
                        <span className="font-semibold text-warm-ink dark:text-night-ink">
                          {sk.skillName}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          sk.met
                            ? 'bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300'
                            : onRoadmap
                            ? 'bg-gold-100 text-gold-900 dark:bg-gold-950 dark:text-gold-200 border border-gold-300'
                            : 'bg-gold-100 text-gold-800 dark:bg-gold-950 dark:text-gold-300'
                        }`}
                      >
                        {sk.met
                          ? 'Verified (Lvl ' + sk.requiredLevel + ')'
                          : onRoadmap
                          ? 'On Roadmap Focus'
                          : 'Missing'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Challenge Action if recommended */}
            {selectedOpportunity.aiExplanation?.recommendedChallengeId && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleStartChallenge(selectedOpportunity.aiExplanation!.recommendedChallengeId!);
                    handleCloseDrawer();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-forest-700 hover:bg-forest-800 text-white shadow-warm-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Target className="w-4 h-4" />
                  <span>
                    {isTamil ? 'பரிந்துரைக்கப்பட்ட சவாலைத் தொடங்குக →' : 'Start Recommended Challenge in Workspace →'}
                  </span>
                </button>
              </div>
            )}

            {/* Generate Verified Resume CTA */}
            <div className="pt-2 border-t border-warm-border/60">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('resume');
                  handleCloseDrawer();
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-parchment-200 dark:bg-night-100 hover:bg-parchment-300 border border-warm-border text-warm-ink dark:text-night-ink shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
                <span>
                  {isTamil ? 'சரிபார்க்கப்பட்ட ஒற்றைப் பக்க ரெஸ்யூமே காண்க →' : 'View Verified 1-Page Resume for this Role →'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
