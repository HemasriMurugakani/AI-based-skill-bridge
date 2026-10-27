import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  employerCandidates,
  EmployerCandidate,
  initialPracticalChallenges,
  PracticalChallenge
} from '../data/employerCandidates';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { EmptyState } from '../components/EmptyState';
import {
  Briefcase,
  Search,
  Plus,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
  MapPin,
  FileCheck2,
  Check,
  Volume2,
  Trash2,
  UserCheck
} from 'lucide-react';

export const EmployerView: React.FC = () => {
  const { getPersona, challenges, vivaRecords } = useSkillBridgeStore();
  const currentPersona = getPersona();

  // 1. Practical Challenges State
  const [challengesList, setChallengesList] = useState<PracticalChallenge[]>(initialPracticalChallenges);
  const [activeChallengeId, setActiveChallengeId] = useState<string>(initialPracticalChallenges[0].id);

  // 2. Active Practical Challenge
  const activeChallenge = useMemo(() => {
    return challengesList.find(c => c.id === activeChallengeId) || challengesList[0];
  }, [challengesList, activeChallengeId]);

  // 3. Shortlist State
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['priya-soundararajan']);
  const [notificationToast, setNotificationToast] = useState<{
    visible: boolean;
    candidateName: string;
    role: string;
    action: 'added' | 'removed';
  } | null>(null);

  // 4. Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [pathwayFilter, setPathwayFilter] = useState<string>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [minEvidenceFilter, setMinEvidenceFilter] = useState<number>(0);
  const [mentorVerifiedOnly, setMentorVerifiedOnly] = useState(false);
  const [shortlistedOnly, setShortlistedOnly] = useState(false);

  // 5. Drawer Inspection State
  const [selectedCandidate, setSelectedCandidate] = useState<EmployerCandidate | null>(null);

  // 6. "Create Practical Challenge" Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPathwayId, setNewPathwayId] = useState('junior-web-dev');
  const [newDescription, setNewDescription] = useState('');
  const [newSkillsStr, setNewSkillsStr] = useState('Semantic HTML & Accessibility, Responsive CSS & Flex/Grid');
  const [newTimeEstimate, setNewTimeEstimate] = useState('45 mins');
  const [rubricRows, setRubricRows] = useState<{ criterion: string; weight: number; description: string }[]>([
    { criterion: 'Semantic Landmarks & ARIA Compliance', weight: 35, description: 'Correct HTML5 layout structures and accessible tab order.' },
    { criterion: 'Mobile Responsive Scaling (Zero 320px Overflow)', weight: 35, description: 'Fluid typography and flex wrapping without horizontal scroll.' },
    { criterion: 'Spoken Rationale Defense (Viva Voce)', weight: 30, description: 'Candidate comfortably defends tradeoffs in Tamil/English.' }
  ]);

  // Handle Shortlist action with animated notification and confetti
  const handleToggleShortlist = (candidate: EmployerCandidate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isAlreadyShortlisted = shortlistedIds.includes(candidate.id);

    if (isAlreadyShortlisted) {
      setShortlistedIds(prev => prev.filter(id => id !== candidate.id));
      setNotificationToast({
        visible: true,
        candidateName: candidate.name,
        role: activeChallenge.role,
        action: 'removed'
      });
    } else {
      setShortlistedIds(prev => [...prev, candidate.id]);
      setNotificationToast({
        visible: true,
        candidateName: candidate.name,
        role: activeChallenge.role,
        action: 'added'
      });

      // Celebratory Confetti Burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#7A1A12', '#B8761A', '#2F7D4F', '#E8B23A']
        });
      } catch {
        // Fallback gracefully if confetti unavailable
      }
    }

    // Auto-dismiss toast after 4.5 seconds
    setTimeout(() => {
      setNotificationToast(prev => (prev?.candidateName === candidate.name ? null : prev));
    }, 4500);
  };

  // Add a rubric row in challenge creation
  const handleAddRubricRow = () => {
    setRubricRows(prev => [
      ...prev,
      { criterion: '', weight: 20, description: '' }
    ]);
  };

  // Remove a rubric row
  const handleRemoveRubricRow = (idx: number) => {
    setRubricRows(prev => prev.filter((_, i) => i !== idx));
  };

  // Update rubric row field
  const handleUpdateRubricRow = (idx: number, field: 'criterion' | 'weight' | 'description', value: string | number) => {
    setRubricRows(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  // Save new practical challenge
  const handlePublishChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newRole.trim()) return;

    const parsedSkills = newSkillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const createdChallenge: PracticalChallenge = {
      id: `pc-custom-${Date.now()}`,
      title: newTitle.trim(),
      role: newRole.trim(),
      pathwayId: newPathwayId,
      description: newDescription.trim() || 'Practical hands-on assessment challenge.',
      requiredSkills: parsedSkills.length > 0 ? parsedSkills : ['Technical Competency'],
      minScoreThreshold: 75,
      rubric: rubricRows.map((r, i) => ({
        id: `r-new-${i}`,
        criterion: r.criterion.trim() || `Criterion ${i + 1}`,
        weight: Number(r.weight) || 25,
        description: r.description.trim() || 'Evaluated against verified evidence artifact.'
      })),
      timeEstimate: newTimeEstimate,
      createdAt: 'Just now',
      applicantCount: employerCandidates.length
    };

    setChallengesList(prev => [createdChallenge, ...prev]);
    setActiveChallengeId(createdChallenge.id);
    setIsCreateModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewRole('');
    setNewDescription('');

    // Trigger success notification
    setNotificationToast({
      visible: true,
      candidateName: `Challenge Published: "${createdChallenge.title}"`,
      role: createdChallenge.role,
      action: 'added'
    });
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Candidates ranking algorithm based on DEMONSTRATED skills for the active challenge
  const rankedCandidates = useMemo(() => {
    const requiredSkillsLower = activeChallenge.requiredSkills.map(s => s.toLowerCase());

    return employerCandidates
      .map(rawCandidate => {
        const candidate = rawCandidate.id === 'priya-soundararajan' && currentPersona.id === 'priya-student'
          ? {
              ...rawCandidate,
              name: currentPersona.name,
              nameTamil: currentPersona.nameTamil,
              avatar: currentPersona.avatar,
              education: currentPersona.educationOrBackground,
              readinessScore: currentPersona.readinessScore,
              streakDays: currentPersona.streakDays,
              evidenceCount: Math.max(rawCandidate.evidenceCount, challenges.filter(c => c.completed).length + Object.keys(vivaRecords).length)
            }
          : rawCandidate;

        // Find matching demonstrated skills
        const matchingSkills = candidate.demonstratedSkills.filter(sk =>
          requiredSkillsLower.some(req => req.includes(sk.skillName.toLowerCase()) || sk.skillName.toLowerCase().includes(req))
        );

        const matchCount = matchingSkills.length;
        const totalRequired = activeChallenge.requiredSkills.length;

        // Demonstrated score: average of matching skills (or candidate's overall demonstrated score)
        const avgMatchingScore =
          matchingSkills.length > 0
            ? Math.round(matchingSkills.reduce((acc, s) => acc + s.score, 0) / matchingSkills.length)
            : candidate.demonstratedScore;

        // Weighted algorithm:
        // 50% demonstrated rubric score + 20% evidence volume + 15% oral defense viva + 15% mentor verified
        const evidenceBonus = Math.min(20, candidate.evidenceCount * 4);
        const vivaBonus = candidate.vivaConfidence === 'Consistent' ? 15 : 8;
        const mentorBonus = candidate.mentorVerified ? 15 : 5;

        const compositeScore = Math.min(
          99,
          Math.round((avgMatchingScore * 0.50) + evidenceBonus + (vivaBonus * 0.15) + (mentorBonus * 0.15))
        );

        return {
          ...candidate,
          matchingSkills,
          matchCount,
          totalRequired,
          avgMatchingScore,
          compositeScore
        };
      })
      // Apply filters
      .filter(candidate => {
        // Pathway filter
        if (pathwayFilter !== 'all' && candidate.pathwayId !== pathwayFilter) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = candidate.name.toLowerCase().includes(q) || candidate.nameTamil.includes(q);
          const matchesDistrict = candidate.district.toLowerCase().includes(q);
          const matchesSkill = candidate.demonstratedSkills.some(s => s.skillName.toLowerCase().includes(q));
          if (!matchesName && !matchesDistrict && !matchesSkill) return false;
        }

        // Min score filter
        if (minScoreFilter > 0 && candidate.demonstratedScore < minScoreFilter) {
          return false;
        }

        // Min evidence filter
        if (minEvidenceFilter > 0 && candidate.evidenceCount < minEvidenceFilter) {
          return false;
        }

        // Mentor verified filter
        if (mentorVerifiedOnly && !candidate.mentorVerified) {
          return false;
        }

        // Shortlisted filter
        if (shortlistedOnly && !shortlistedIds.includes(candidate.id)) {
          return false;
        }

        return true;
      })
      // Sort strictly by composite demonstrated rank
      .sort((a, b) => b.compositeScore - a.compositeScore);
  }, [
    activeChallenge,
    searchQuery,
    pathwayFilter,
    minScoreFilter,
    minEvidenceFilter,
    mentorVerifiedOnly,
    shortlistedOnly,
    shortlistedIds
  ]);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* =========================================================================
          MANDATORY "DEMO DATA" LABEL & CIVIC EMPLOYER HEADER
          ========================================================================= */}
      <div className="p-4 sm:p-6 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {/* STRICT REQUIREMENT: Label "Demo data" */}
              <span className="px-2.5 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950/80 border border-gold-400 text-maroon-900 dark:text-gold-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Demo data · Simulated for Employer Demonstration</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                <span>Ranked by Demonstrated Skills</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
              Employer Practical Challenge & Talent Engine
            </h1>
            <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
              நிரூபிக்கப்பட்ட திறன்கள் மூலம் தகுதியான பணியாளர்களைத் தேர்ந்தெடுக்கும் தளம்
            </div>
          </div>

          {/* Action Header CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Shortlist Badge Counter */}
            <button
              type="button"
              onClick={() => setShortlistedOnly(prev => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                shortlistedOnly
                  ? 'bg-maroon-700 text-white border-maroon-800 shadow-warm-sm'
                  : 'bg-parchment-100 dark:bg-night-100 border-warm-border hover:bg-parchment-200 text-warm-ink dark:text-night-ink'
              }`}
            >
              <UserCheck className="w-4 h-4 text-gold-500" />
              <span>Shortlisted ({shortlistedIds.length})</span>
            </button>

            {/* Create Practical Challenge Button */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-warm-sm transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Practical Challenge</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-warm-muted dark:text-night-muted leading-relaxed">
          Platform policy: Candidates are ranked strictly by verified code pull requests, step-by-step photographic QC inspections, and oral viva voce defenses. No self-reported CV fluff or college tier bias.
        </p>
      </div>

      {/* =========================================================================
          ACTIVE PRACTICAL CHALLENGE SELECTOR & RUBRIC SUMMARY
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-warm-muted uppercase tracking-wider">
              Selected Practical Challenge (Defines Candidate Ranking)
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Briefcase className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
              <h2 className="text-base sm:text-lg font-bold font-heritage text-warm-ink dark:text-night-ink">
                {activeChallenge.title}
              </h2>
            </div>
          </div>

          {/* Quick Challenge Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {challengesList.map(ch => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChallengeId(ch.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeChallengeId === ch.id
                    ? 'bg-maroon-700 text-white shadow-xs font-bold'
                    : 'bg-parchment-100 dark:bg-night-100 border border-warm-border text-warm-muted hover:text-warm-ink'
                }`}
              >
                {ch.role}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-warm-ink/90 dark:text-night-ink/90">
          {activeChallenge.description}
        </p>

        {/* Required Skills & Rubric Criteria Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-warm-border/60">
          <div>
            <div className="text-[11px] font-bold text-warm-muted uppercase tracking-wider mb-2">
              Required Demonstrated Competencies ({activeChallenge.requiredSkills.length}):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeChallenge.requiredSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-parchment-100 dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink text-xs font-semibold flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-forest-600" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-warm-muted uppercase tracking-wider mb-2">
              Challenge Evaluation Rubric ({activeChallenge.rubric.length} Criteria):
            </div>
            <div className="space-y-1.5">
              {activeChallenge.rubric.map(r => (
                <div
                  key={r.id}
                  className="p-2 rounded-lg bg-parchment-50 dark:bg-night-100/60 border border-warm-border/60 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-warm-ink dark:text-night-ink truncate max-w-[280px]">
                    {r.criterion}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950 text-maroon-900 dark:text-gold-200 text-[10px] font-bold shrink-0">
                    {r.weight}% Weight
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FILTERS & SEARCH BAR
          ========================================================================= */}
      <div className="p-4 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-warm-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate by name, district, or verified skill..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink placeholder:text-warm-muted focus:outline-none focus:border-maroon-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-warm-ink"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Pathway Category */}
            <select
              value={pathwayFilter}
              onChange={(e) => setPathwayFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Pathways</option>
              <option value="junior-web-dev">Junior Web Dev</option>
              <option value="tailoring-craft">Tailoring & Craft</option>
              <option value="data-analyst">Data Analyst</option>
            </select>

            {/* Min Rubric Score */}
            <select
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-white dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink font-semibold focus:outline-none cursor-pointer"
            >
              <option value={0}>Any Rubric Score</option>
              <option value={80}>≥ 80% Rubric Avg</option>
              <option value={85}>≥ 85% Rubric Avg</option>
              <option value={90}>≥ 90% Rubric Avg</option>
            </select>

            {/* Min Evidence Count */}
            <select
              value={minEvidenceFilter}
              onChange={(e) => setMinEvidenceFilter(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-white dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink font-semibold focus:outline-none cursor-pointer"
            >
              <option value={0}>Any Proof Count</option>
              <option value={3}>3+ Verified Proofs</option>
              <option value={5}>5+ Verified Proofs</option>
            </select>

            {/* Mentor Verified Toggle */}
            <button
              type="button"
              onClick={() => setMentorVerifiedOnly(prev => !prev)}
              className={`px-3 py-2 rounded-xl font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                mentorVerifiedOnly
                  ? 'bg-forest-100 text-forest-800 border-forest-300'
                  : 'bg-white dark:bg-night-100 text-warm-muted border-warm-border hover:text-warm-ink'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mentor-Verified Only</span>
            </button>
          </div>
        </div>

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between text-[11px] text-warm-muted pt-1">
          <span>
            Showing <strong>{rankedCandidates.length}</strong> candidates ranked by demonstrated proof for "{activeChallenge.role}"
          </span>
          {(searchQuery || pathwayFilter !== 'all' || minScoreFilter > 0 || minEvidenceFilter > 0 || mentorVerifiedOnly || shortlistedOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPathwayFilter('all');
                setMinScoreFilter(0);
                setMinEvidenceFilter(0);
                setMentorVerifiedOnly(false);
                setShortlistedOnly(false);
              }}
              className="text-maroon-700 dark:text-gold-400 font-bold hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          CANDIDATES RANKED BY DEMONSTRATED SKILLS LIST
          ========================================================================= */}
      <div className="space-y-3.5">
        {rankedCandidates.length === 0 ? (
          <EmptyState
            title="No candidates meet the selected filter criteria"
            titleTamil="தேர்வு செய்த நிபந்தனைகளில் விண்ணப்பதாரர்கள் இல்லை"
            description="Try relaxing your minimum rubric score, experience level, or evidence count thresholds to inspect available talent."
            descriptionTamil="குறைந்தபட்ச மதிப்பீட்டு மதிப்பெண் அல்லது சான்றுகளின் எண்ணிக்கையைத் தளர்த்திப் பார்க்கவும்."
            actionLabel="Reset filters"
            actionLabelTamil="வடிகட்டிகளை மீட்டமை"
            onAction={() => {
              setSearchQuery('');
              setPathwayFilter('all');
              setMinScoreFilter(0);
              setMinEvidenceFilter(0);
              setMentorVerifiedOnly(false);
              setShortlistedOnly(false);
            }}
          />
        ) : (
          rankedCandidates.map((candidate, rankIndex) => {
            const isShortlisted = shortlistedIds.includes(candidate.id);

            return (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className={`group p-4 sm:p-5 rounded-2xl bg-white dark:bg-night-card border transition-all cursor-pointer shadow-xs hover:shadow-warm-md hover:border-gold-400/80 relative ${
                  isShortlisted
                    ? 'border-gold-400/80 bg-gold-50/20 dark:bg-gold-950/20'
                    : 'border-warm-border/80 dark:border-night-border/80'
                }`}
              >
                {/* Demo Data Tag */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-parchment-100 dark:bg-night-100 text-warm-muted border border-warm-border/60">
                    Demo data
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Avatar, Rank, Name, Details */}
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-parchment-100 dark:bg-night-100 border border-gold-400/60 font-heritage font-extrabold text-sm text-maroon-800 dark:text-gold-300 shrink-0">
                      <span>#{rankIndex + 1}</span>
                      <span className="text-[7px] uppercase tracking-tighter text-warm-muted">Rank</span>
                    </div>

                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-gold-400/60 shadow-xs shrink-0"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold font-heritage text-warm-ink dark:text-night-ink group-hover:text-maroon-700 dark:group-hover:text-gold-300 transition-colors">
                          {candidate.name}
                        </h3>
                        <span className="font-tamil text-xs text-warm-muted">
                          {candidate.nameTamil}
                        </span>

                        {candidate.mentorVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300 font-bold text-[10px] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-forest-600" />
                            <span>Mentor-Verified</span>
                          </span>
                        )}

                        {isShortlisted && (
                          <span className="px-2 py-0.5 rounded-full bg-gold-400 text-maroon-950 font-bold text-[10px] flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            <span>Shortlisted</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-warm-muted">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-warm-subtle" />
                          <span>{candidate.district}</span>
                        </span>
                        <span>•</span>
                        <span>{candidate.education}</span>
                        <span>•</span>
                        <span className="text-forest-700 font-medium">
                          Oral Defense: {candidate.vivaConfidence} ({candidate.vivaScore}%)
                        </span>
                      </div>

                      {/* Demonstrated Skills Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {candidate.demonstratedSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-parchment-100 dark:bg-night-100 text-warm-ink dark:text-night-ink text-[11px] font-semibold flex items-center gap-1 border border-warm-border/60"
                          >
                            <span className="text-forest-600 font-bold">✓</span>
                            <span>{sk.skillName}</span>
                            <span className="font-mono text-warm-muted text-[10px]">({sk.score}%)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Demonstrated Metrics & Shortlist Button */}
                  <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-warm-border/60">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase font-bold text-warm-muted">
                        Demonstrated Match
                      </div>
                      <div className="text-2xl sm:text-3xl font-heritage font-extrabold text-maroon-800 dark:text-gold-400">
                        {candidate.compositeScore}%
                      </div>
                      <div className="text-[11px] text-forest-700 dark:text-forest-400 font-semibold flex items-center md:justify-end gap-1">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>{candidate.evidenceCount} Verified Artifacts</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Shortlist Button (STRICT REQUIREMENT: animates notification) */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleShortlist(candidate, e)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isShortlisted
                            ? 'bg-forest-100 text-forest-800 border border-forest-300 hover:bg-forest-200'
                            : 'bg-maroon-700 hover:bg-maroon-800 text-white hover:scale-[1.02]'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                      </button>

                      {/* View Evidence Drawer Icon */}
                      <span className="p-2 rounded-xl bg-parchment-100 dark:bg-night-100 text-warm-muted group-hover:text-warm-ink transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================================
          CANDIDATE EVIDENCE DRAWER (SLIDE-OVER INSPECTION MODAL)
          ========================================================================= */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedCandidate(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-night-card shadow-2xl border-l border-warm-border h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-warm-border flex items-center justify-between gap-3 bg-parchment-50 dark:bg-night-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-gold-400"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heritage font-bold text-lg text-warm-ink dark:text-night-ink">
                      {selectedCandidate.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 font-bold">
                      Demo data
                    </span>
                  </div>
                  <div className="text-xs text-warm-muted font-tamil">
                    {selectedCandidate.nameTamil} • {selectedCandidate.district}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-full text-warm-muted hover:text-warm-ink hover:bg-parchment-200 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border text-center">
                  <div className="text-[10px] uppercase font-bold text-warm-muted">Demonstrated</div>
                  <div className="font-heritage font-extrabold text-xl text-maroon-800 dark:text-gold-400">
                    {selectedCandidate.demonstratedScore}%
                  </div>
                  <div className="text-[10px] text-forest-700 font-medium">Rubric Avg</div>
                </div>
                <div className="p-3 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border text-center">
                  <div className="text-[10px] uppercase font-bold text-warm-muted">Verified Proofs</div>
                  <div className="font-heritage font-extrabold text-xl text-forest-700">
                    {selectedCandidate.evidenceCount}
                  </div>
                  <div className="text-[10px] text-warm-muted">Artifacts</div>
                </div>
                <div className="p-3 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border text-center">
                  <div className="text-[10px] uppercase font-bold text-warm-muted">Viva Voce</div>
                  <div className="font-heritage font-extrabold text-xl text-[#7A1A12] dark:text-gold-300">
                    {selectedCandidate.vivaConfidence}
                  </div>
                  <div className="text-[10px] text-warm-muted">{selectedCandidate.vivaCadenceWpm} WPM</div>
                </div>
              </div>

              {/* SECTION 1: VERIFIED CODE & ARTIFACT SUBMISSIONS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-warm-border">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-warm-ink dark:text-night-ink flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
                    <span>Verified Reproducible Artifacts ({selectedCandidate.artifacts.length})</span>
                  </h4>
                  <span className="text-[10px] text-forest-700 font-semibold">100% Cryptographically Verified</span>
                </div>

                <div className="space-y-3">
                  {selectedCandidate.artifacts.map((art) => (
                    <div
                      key={art.id}
                      className="p-4 rounded-xl bg-parchment-50 dark:bg-night-100/60 border border-warm-border space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-warm-ink dark:text-night-ink">
                            {art.title}
                          </div>
                          <div className="text-[10px] text-warm-muted font-mono">
                            Checksum: {art.verificationHash}
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 font-extrabold text-xs">
                          ✓ {art.rubricScore}%
                        </span>
                      </div>

                      <p className="text-warm-ink/80 dark:text-night-ink/80 leading-relaxed text-[11px]">
                        {art.summary}
                      </p>

                      {/* Criteria Met */}
                      <div className="space-y-1 pt-1 border-t border-warm-border/60">
                        <div className="text-[10px] font-bold text-warm-muted uppercase">Rubric Criteria Met:</div>
                        {art.criteriaMet.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-forest-800 text-[11px]">
                            <span className="text-forest-600 font-bold">✓</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-warm-muted">
                        <span>Submitted {art.completedAt}</span>
                        <a
                          href={art.sampleOutputOrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-maroon-700 dark:text-gold-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Inspect Artifact Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: SPOKEN VIVA VOCE & ORAL DEFENSE AUDIT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-warm-border">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-warm-ink dark:text-night-ink flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
                    <span>Spoken Defense & Viva Voce Transcript</span>
                  </h4>
                  <span className="text-[10px] text-forest-700 font-semibold">
                    Cadence: {selectedCandidate.vivaCadenceWpm} WPM • Clarity: {selectedCandidate.vivaClarity}%
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedCandidate.vivaQAs.map((qa, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-night-100 border border-warm-border space-y-1.5 text-xs shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-warm-ink dark:text-night-ink">
                          Q{idx + 1}: {qa.question}
                        </span>
                        <span className="font-heritage text-maroon-800 dark:text-gold-400 font-bold">
                          {qa.score}%
                        </span>
                      </div>
                      {qa.questionTamil && (
                        <div className="font-tamil text-[11px] text-warm-muted">
                          {qa.questionTamil}
                        </div>
                      )}
                      <div className="p-2.5 rounded-lg bg-parchment-100/70 dark:bg-night-200/50 text-[11px] text-warm-ink dark:text-night-ink italic">
                        "{qa.answer}"
                      </div>
                      <div className="text-[10px] text-forest-700 font-semibold">
                        ✓ {qa.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: MENTOR ENDORSEMENT STATEMENT */}
              <div className="p-4 rounded-xl bg-gold-50/70 dark:bg-gold-950/40 border border-gold-300 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-maroon-900 dark:text-gold-200 uppercase tracking-wider text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>State Industry Mentor Endorsement:</span>
                </div>
                <blockquote className="italic text-[11px] text-warm-ink dark:text-night-ink pl-2 border-l-2 border-maroon-700">
                  "{selectedCandidate.mentorStatement}"
                </blockquote>
                <div className="text-[10px] text-warm-muted font-semibold pt-1">
                  Signed: {selectedCandidate.mentorName} • State Civic Skill Evaluation Panel
                </div>
              </div>
            </div>

            {/* Drawer Bottom Action Bar */}
            <div className="p-4 border-t border-warm-border bg-parchment-50 dark:bg-night-100 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-warm-ink dark:text-night-ink">
                  Ready to connect with {selectedCandidate.name}?
                </div>
                <div className="text-[10px] text-warm-muted">
                  Shortlisting alerts candidate via their verified SkillBridge portal.
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleToggleShortlist(selectedCandidate, e)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-warm-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  shortlistedIds.includes(selectedCandidate.id)
                    ? 'bg-forest-100 text-forest-800 border border-forest-300'
                    : 'bg-maroon-700 hover:bg-maroon-800 text-white hover:scale-[1.02]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {shortlistedIds.includes(selectedCandidate.id)
                    ? 'Shortlisted in Queue'
                    : 'Shortlist Candidate'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CREATE PRACTICAL CHALLENGE MODAL (STRICT REQUIREMENT)
          ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Dialog */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-night-card rounded-2xl shadow-2xl border border-warm-border p-6 space-y-5 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-warm-border">
              <div>
                <h3 className="text-lg font-bold font-heritage text-warm-ink dark:text-night-ink">
                  Create Practical Challenge & Ranking Rubric
                </h3>
                <p className="text-xs text-warm-muted">
                  Define a real-world task. Candidates will be ranked based on verifiable code, photo QC, and oral defense submissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-warm-muted hover:text-warm-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishChallenge} className="space-y-4 text-xs">
              {/* Challenge Title */}
              <div className="space-y-1">
                <label className="font-bold text-warm-ink dark:text-night-ink">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Build an Accessible Multi-Step Checkout with Form Validation"
                  className="w-full px-3 py-2 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink focus:outline-none focus:border-maroon-700"
                />
              </div>

              {/* Target Role & Pathway */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-warm-ink dark:text-night-ink">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Junior React Frontend Trainee"
                    className="w-full px-3 py-2 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink focus:outline-none focus:border-maroon-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-warm-ink dark:text-night-ink">
                    Pathway Track *
                  </label>
                  <select
                    value={newPathwayId}
                    onChange={(e) => setNewPathwayId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="junior-web-dev">Junior Web Developer</option>
                    <option value="tailoring-craft">Tailoring & Garment Construction</option>
                    <option value="data-analyst">Data Analyst & Business Reporting</option>
                  </select>
                </div>
              </div>

              {/* Required Skills & Time Estimate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-warm-ink dark:text-night-ink">
                    Required Competencies (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSkillsStr}
                    onChange={(e) => setNewSkillsStr(e.target.value)}
                    placeholder="Semantic HTML, Responsive CSS, JavaScript DOM, React"
                    className="w-full px-3 py-2 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink focus:outline-none focus:border-maroon-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-warm-ink dark:text-night-ink">
                    Time Estimate
                  </label>
                  <input
                    type="text"
                    value={newTimeEstimate}
                    onChange={(e) => setNewTimeEstimate(e.target.value)}
                    placeholder="e.g. 45 mins"
                    className="w-full px-3 py-2 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink focus:outline-none focus:border-maroon-700"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-warm-ink dark:text-night-ink">
                  Brief Challenge Brief & Instructions
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain what practical artifact the learner must produce and defend..."
                  className="w-full px-3 py-2 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border text-warm-ink dark:text-night-ink focus:outline-none focus:border-maroon-700"
                />
              </div>

              {/* Rubric Criteria Builder */}
              <div className="space-y-2 pt-2 border-t border-warm-border">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-warm-ink dark:text-night-ink">
                    Evaluation Rubric ({rubricRows.length} criteria)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRubricRow}
                    className="text-maroon-700 dark:text-gold-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Criterion</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {rubricRows.map((row, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-parchment-50 dark:bg-night-100 border border-warm-border space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={row.criterion}
                          onChange={(e) => handleUpdateRubricRow(idx, 'criterion', e.target.value)}
                          placeholder="Criterion title (e.g. Zero 320px overflow)"
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-night-card border border-warm-border text-warm-ink dark:text-night-ink"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            min={5}
                            max={100}
                            value={row.weight}
                            onChange={(e) => handleUpdateRubricRow(idx, 'weight', Number(e.target.value))}
                            className="w-16 px-2 py-1.5 rounded-lg bg-white dark:bg-night-card border border-warm-border text-center font-bold"
                          />
                          <span className="text-[10px] text-warm-muted">%</span>
                        </div>
                        {rubricRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRubricRow(idx)}
                            className="text-warm-muted hover:text-maroon-700 p-1"
                            aria-label="Remove criterion"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => handleUpdateRubricRow(idx, 'description', e.target.value)}
                        placeholder="Brief scoring guide description..."
                        className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-night-card border border-warm-border text-[11px] text-warm-muted"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-warm-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-parchment-200 dark:bg-night-100 border border-warm-border font-semibold hover:bg-parchment-300 text-warm-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold shadow-warm-sm transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Publish & Rank Candidates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          ANIMATED SHORTLIST NOTIFICATION TOAST (STRICT REQUIREMENT)
          ========================================================================= */}
      {notificationToast && notificationToast.visible && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] sm:w-full animate-in slide-in-from-bottom duration-300">
          <div className="p-4 rounded-2xl bg-white dark:bg-night-card border-2 border-gold-400 shadow-2xl flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl text-white shrink-0 ${
                notificationToast.action === 'added' ? 'bg-forest-600' : 'bg-amber-600'
              }`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-warm-ink dark:text-night-ink text-sm">
                  {notificationToast.action === 'added'
                    ? '🎉 Candidate Shortlisted!'
                    : 'Candidate Removed from Shortlist'}
                </div>
                <div className="text-warm-muted leading-relaxed">
                  <strong>{notificationToast.candidateName}</strong> {notificationToast.action === 'added' ? 'added to your interview queue for' : 'removed from shortlist for'}{' '}
                  <strong>{notificationToast.role}</strong>.
                </div>
                <div className="text-[10px] text-forest-700 dark:text-forest-400 font-semibold pt-0.5">
                  ✓ Simulated alert sent to learner's SkillBridge portal.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotificationToast(null)}
              className="text-warm-muted hover:text-warm-ink p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
