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
import { AboutThisData } from '../components/ui/AboutThisData';
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
          colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
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
          CIVIC EMPLOYER HEADER WITH ABOUT THIS DATA POPOVER
          ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] dark:border-slate-800 shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD] text-xs font-semibold flex items-center gap-1.5 shadow-soft">
                <ShieldCheck className="w-3.5 h-3.5 text-[#62B6E8]" />
                <span>Ranked by Demonstrated Skills</span>
              </span>
              <AboutThisData
                title="About Employer Talent & Ranking Data"
                description="Candidate profiles, rubric scores, and code verification checksums are simulated for platform demonstration. Candidates are ranked strictly by verified artifacts, step-by-step inspections, and oral viva voce defenses."
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
              Employer Practical Challenge & Talent Engine
            </h1>
            <div className="font-tamil text-xs text-[#526174] dark:text-slate-400">
              நிரூபிக்கப்பட்ட திறன்கள் மூலம் தகுதியான பணியாளர்களைத் தேர்ந்தெடுக்கும் தளம்
            </div>
          </div>

          {/* Action Header CTAs (Max 1 primary button per section) */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Shortlist Badge Counter - Secondary Button */}
            <button
              type="button"
              onClick={() => setShortlistedOnly(prev => !prev)}
              className={`px-3.5 py-2 rounded-btn text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                shortlistedOnly
                  ? 'bg-[#EAF5FC] text-[#173B67] border-[#62B6E8] shadow-soft'
                  : 'bg-white dark:bg-[#0F2035] border-[#E2E8F0] hover:bg-[#EAF5FC] text-[#173B67] dark:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#F2B66D]" />
              <span>Shortlisted ({shortlistedIds.length})</span>
            </button>

            {/* Create Practical Challenge Button - Primary Action */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-xs shadow-soft transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Practical Challenge</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-[#526174] dark:text-slate-300 leading-relaxed">
          Platform policy: Candidates are ranked strictly by verified code pull requests, step-by-step photographic QC inspections, and oral viva voce defenses. No self-reported CV fluff or college tier bias.
        </p>
      </div>

      {/* =========================================================================
          ACTIVE PRACTICAL CHALLENGE SELECTOR & RUBRIC SUMMARY
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-[#526174] uppercase tracking-wider">
              Selected Practical Challenge (Defines Candidate Ranking)
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Briefcase className="w-4 h-4 text-[#62B6E8]" />
              <h2 className="text-base sm:text-lg font-bold text-[#173B67] dark:text-white">
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
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeChallengeId === ch.id
                    ? 'bg-[#62B6E8] text-[#173B67] shadow-soft'
                    : 'bg-[#EAF5FC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#526174] hover:text-[#173B67]'
                }`}
              >
                {ch.role}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#526174] dark:text-slate-300 leading-relaxed">
          {activeChallenge.description}
        </p>

        {/* Required Skills & Rubric Criteria Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
          <div>
            <div className="text-[11px] font-bold text-[#526174] uppercase tracking-wider mb-2">
              Required Demonstrated Competencies ({activeChallenge.requiredSkills.length}):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeChallenge.requiredSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-btn bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white text-xs font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-[#10B981]" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#526174] uppercase tracking-wider mb-2">
              Challenge Evaluation Rubric ({activeChallenge.rubric.length} Criteria):
            </div>
            <div className="space-y-1.5">
              {activeChallenge.rubric.map(r => (
                <div
                  key={r.id}
                  className="p-2 rounded-btn bg-[#F8FAFC] dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-[#173B67] dark:text-white truncate max-w-[280px]">
                    {r.criterion}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD] text-[10px] font-semibold shrink-0">
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
      <div className="p-4 rounded-card bg-[#F8FAFC] dark:bg-[#0F2035] border border-[#E2E8F0] dark:border-slate-800 shadow-soft space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#526174] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate by name, district, or verified skill..."
              className="w-full pl-9 pr-4 py-2 rounded-btn text-xs bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white placeholder:text-[#526174] focus:outline-none focus:border-[#62B6E8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#526174] hover:text-[#173B67]"
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
              className="px-3 py-2 rounded-btn bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white font-medium focus:outline-none cursor-pointer"
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
              className="px-3 py-2 rounded-btn bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white font-medium focus:outline-none cursor-pointer"
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
              className="px-3 py-2 rounded-btn bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value={0}>Any Proof Count</option>
              <option value={3}>3+ Verified Proofs</option>
              <option value={5}>5+ Verified Proofs</option>
            </select>

            {/* Mentor Verified Toggle */}
            <button
              type="button"
              onClick={() => setMentorVerifiedOnly(prev => !prev)}
              className={`px-3 py-2 rounded-btn font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                mentorVerifiedOnly
                  ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                  : 'bg-white dark:bg-slate-900 text-[#526174] border-[#E2E8F0] dark:border-slate-700 hover:text-[#173B67]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Mentor-Verified Only</span>
            </button>
          </div>
        </div>

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between text-[11px] text-[#526174] pt-1">
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
              className="text-[#173B67] dark:text-[#62B6E8] font-semibold hover:underline cursor-pointer"
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
                className={`group p-4 sm:p-5 rounded-card bg-white dark:bg-[#0F2035] border transition-all cursor-pointer shadow-soft hover:shadow-soft-lg hover:border-[#62B6E8] relative ${
                  isShortlisted
                    ? 'border-[#62B6E8] bg-[#EAF5FC]/40 dark:bg-[#0C4A6E]/20'
                    : 'border-[#E2E8F0] dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Avatar, Rank, Name, Details */}
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-btn bg-[#EAF5FC] dark:bg-slate-800 border border-[#BAE6FD] dark:border-slate-700 font-bold text-sm text-[#173B67] dark:text-[#62B6E8] shrink-0">
                      <span>#{rankIndex + 1}</span>
                      <span className="text-[7px] uppercase tracking-tighter text-[#526174]">Rank</span>
                    </div>

                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-14 h-14 rounded-card object-cover border border-[#E2E8F0] shadow-soft shrink-0"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-[#173B67] dark:text-white group-hover:text-[#62B6E8] transition-colors">
                          {candidate.name}
                        </h3>
                        <span className="font-tamil text-xs text-[#526174]">
                          {candidate.nameTamil}
                        </span>

                        {candidate.mentorVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] font-semibold text-[10px] flex items-center gap-1 border border-[#A7F3D0]">
                            <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                            <span>Mentor-Verified</span>
                          </span>
                        )}

                        {isShortlisted && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] font-semibold text-[10px] flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            <span>Shortlisted</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#526174]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#526174]" />
                          <span>{candidate.district}</span>
                        </span>
                        <span>•</span>
                        <span>{candidate.education}</span>
                        <span>•</span>
                        <span className="text-[#065F46] font-medium">
                          Oral Defense: {candidate.vivaConfidence} ({candidate.vivaScore}%)
                        </span>
                      </div>

                      {/* Demonstrated Skills Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {candidate.demonstratedSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-btn bg-[#F8FAFC] dark:bg-slate-800 text-[#173B67] dark:text-white text-[11px] font-medium flex items-center gap-1 border border-[#E2E8F0] dark:border-slate-700"
                          >
                            <span className="text-[#10B981] font-bold">✓</span>
                            <span>{sk.skillName}</span>
                            <span className="font-mono text-[#526174] text-[10px]">({sk.score}%)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Demonstrated Metrics & Shortlist Button */}
                  <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#E2E8F0]">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase font-bold text-[#526174]">
                        Demonstrated Match
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-[#173B67] dark:text-white">
                        {candidate.compositeScore}%
                      </div>
                      <div className="text-[11px] text-[#065F46] dark:text-[#10B981] font-semibold flex items-center md:justify-end gap-1">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>{candidate.evidenceCount} Verified Artifacts</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Shortlist Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleShortlist(candidate, e)}
                        className={`px-4 py-2 rounded-btn text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-soft ${
                          isShortlisted
                            ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] hover:bg-[#D1FAE5]'
                            : 'bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67]'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                      </button>

                      {/* View Evidence Drawer Icon */}
                      <span className="p-2 rounded-btn bg-[#EAF5FC] dark:bg-slate-800 text-[#173B67] dark:text-[#62B6E8] group-hover:bg-[#62B6E8] group-hover:text-[#173B67] transition-colors">
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
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F2035] shadow-soft-lg border-l border-[#E2E8F0] dark:border-slate-800 h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between gap-3 bg-[#F8FAFC] dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-12 h-12 rounded-card object-cover border border-[#E2E8F0]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-[#173B67] dark:text-white">
                      {selectedCandidate.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] font-semibold border border-[#BAE6FD]">
                      Verified Profile
                    </span>
                  </div>
                  <div className="text-xs text-[#526174] font-tamil">
                    {selectedCandidate.nameTamil} • {selectedCandidate.district}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-full text-[#526174] hover:text-[#173B67] hover:bg-[#EAF5FC] transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-[#526174]">Demonstrated</div>
                  <div className="font-bold text-xl text-[#173B67] dark:text-white">
                    {selectedCandidate.demonstratedScore}%
                  </div>
                  <div className="text-[10px] text-[#065F46] font-medium">Rubric Avg</div>
                </div>
                <div className="p-3 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-[#526174]">Verified Proofs</div>
                  <div className="font-bold text-xl text-[#10B981]">
                    {selectedCandidate.evidenceCount}
                  </div>
                  <div className="text-[10px] text-[#526174]">Artifacts</div>
                </div>
                <div className="p-3 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-[#526174]">Viva Voce</div>
                  <div className="font-bold text-xl text-[#62B6E8]">
                    {selectedCandidate.vivaConfidence}
                  </div>
                  <div className="text-[10px] text-[#526174]">{selectedCandidate.vivaCadenceWpm} WPM</div>
                </div>
              </div>

              {/* SECTION 1: VERIFIED CODE & ARTIFACT SUBMISSIONS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#E2E8F0] dark:border-slate-800">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#173B67] dark:text-white flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-[#62B6E8]" />
                    <span>Verified Reproducible Artifacts ({selectedCandidate.artifacts.length})</span>
                  </h4>
                  <span className="text-[10px] text-[#065F46] font-semibold">100% Cryptographically Verified</span>
                </div>

                <div className="space-y-3">
                  {selectedCandidate.artifacts.map((art) => (
                    <div
                      key={art.id}
                      className="p-4 rounded-card bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-[#173B67] dark:text-white">
                            {art.title}
                          </div>
                          <div className="text-[10px] text-[#526174] font-mono">
                            Checksum: {art.verificationHash}
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] font-bold text-xs border border-[#A7F3D0]">
                          ✓ {art.rubricScore}%
                        </span>
                      </div>

                      <p className="text-[#526174] dark:text-slate-300 leading-relaxed text-[11px]">
                        {art.summary}
                      </p>

                      {/* Criteria Met */}
                      <div className="space-y-1 pt-1 border-t border-[#E2E8F0] dark:border-slate-800">
                        <div className="text-[10px] font-bold text-[#526174] uppercase">Rubric Criteria Met:</div>
                        {art.criteriaMet.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[#065F46] text-[11px]">
                            <span className="text-[#10B981] font-bold">✓</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-[#526174]">
                        <span>Submitted {art.completedAt}</span>
                        <a
                          href={art.sampleOutputOrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#173B67] dark:text-[#62B6E8] font-semibold hover:underline flex items-center gap-1"
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
                <div className="flex items-center justify-between pb-1 border-b border-[#E2E8F0] dark:border-slate-800">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#173B67] dark:text-white flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#62B6E8]" />
                    <span>Spoken Defense & Viva Voce Transcript</span>
                  </h4>
                  <span className="text-[10px] text-[#065F46] font-semibold">
                    Cadence: {selectedCandidate.vivaCadenceWpm} WPM • Clarity: {selectedCandidate.vivaClarity}%
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedCandidate.vivaQAs.map((qa, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-card bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-1.5 text-xs shadow-soft"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-[#173B67] dark:text-white">
                          Q{idx + 1}: {qa.question}
                        </span>
                        <span className="text-[#173B67] dark:text-[#62B6E8] font-bold">
                          {qa.score}%
                        </span>
                      </div>
                      {qa.questionTamil && (
                        <div className="font-tamil text-[11px] text-[#526174]">
                          {qa.questionTamil}
                        </div>
                      )}
                      <div className="p-2.5 rounded-btn bg-[#EAF5FC] dark:bg-slate-800 text-[11px] text-[#173B67] dark:text-slate-200 italic">
                        "{qa.answer}"
                      </div>
                      <div className="text-[10px] text-[#065F46] font-semibold">
                        ✓ {qa.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: MENTOR ENDORSEMENT STATEMENT */}
              <div className="p-4 rounded-card bg-[#EAF5FC] dark:bg-slate-800 border border-[#BAE6FD] dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#173B67] dark:text-white uppercase tracking-wider text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-[#62B6E8]" />
                  <span>State Industry Mentor Endorsement:</span>
                </div>
                <blockquote className="italic text-[11px] text-[#173B67] dark:text-slate-200 pl-2 border-l-2 border-[#62B6E8]">
                  "{selectedCandidate.mentorStatement}"
                </blockquote>
                <div className="text-[10px] text-[#526174] font-medium pt-1">
                  Signed: {selectedCandidate.mentorName} • State Civic Skill Evaluation Panel
                </div>
              </div>
            </div>

            {/* Drawer Bottom Action Bar */}
            <div className="p-4 border-t border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[#173B67] dark:text-white">
                  Ready to connect with {selectedCandidate.name}?
                </div>
                <div className="text-[10px] text-[#526174]">
                  Shortlisting alerts candidate via their verified SkillBridge portal.
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleToggleShortlist(selectedCandidate, e)}
                className={`px-5 py-2.5 rounded-btn font-semibold text-xs shadow-soft transition-all flex items-center gap-1.5 cursor-pointer ${
                  shortlistedIds.includes(selectedCandidate.id)
                    ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                    : 'bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67]'
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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Dialog */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F2035] rounded-card shadow-soft-lg border border-[#E2E8F0] dark:border-slate-800 p-6 space-y-5 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-[#173B67] dark:text-white">
                  Create Practical Challenge & Ranking Rubric
                </h3>
                <p className="text-xs text-[#526174] dark:text-slate-300">
                  Define a real-world task. Candidates will be ranked based on verifiable code, photo QC, and oral defense submissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-[#526174] hover:text-[#173B67]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishChallenge} className="space-y-4 text-xs">
              {/* Challenge Title */}
              <div className="space-y-1">
                <label className="font-semibold text-[#173B67] dark:text-white">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Build an Accessible Multi-Step Checkout with Form Validation"
                  className="w-full px-3 py-2 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white focus:outline-none focus:border-[#62B6E8]"
                />
              </div>

              {/* Target Role & Pathway */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#173B67] dark:text-white">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Junior React Frontend Trainee"
                    className="w-full px-3 py-2 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white focus:outline-none focus:border-[#62B6E8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#173B67] dark:text-white">
                    Pathway Track *
                  </label>
                  <select
                    value={newPathwayId}
                    onChange={(e) => setNewPathwayId(e.target.value)}
                    className="w-full px-3 py-2 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white font-medium focus:outline-none cursor-pointer"
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
                  <label className="font-semibold text-[#173B67] dark:text-white">
                    Required Competencies (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSkillsStr}
                    onChange={(e) => setNewSkillsStr(e.target.value)}
                    placeholder="Semantic HTML, Responsive CSS, JavaScript DOM, React"
                    className="w-full px-3 py-2 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white focus:outline-none focus:border-[#62B6E8]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#173B67] dark:text-white">
                    Time Estimate
                  </label>
                  <input
                    type="text"
                    value={newTimeEstimate}
                    onChange={(e) => setNewTimeEstimate(e.target.value)}
                    placeholder="e.g. 45 mins"
                    className="w-full px-3 py-2 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white focus:outline-none focus:border-[#62B6E8]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-semibold text-[#173B67] dark:text-white">
                  Brief Challenge Brief & Instructions
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain what practical artifact the learner must produce and defend..."
                  className="w-full px-3 py-2 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white focus:outline-none focus:border-[#62B6E8]"
                />
              </div>

              {/* Rubric Criteria Builder */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-[#173B67] dark:text-white">
                    Evaluation Rubric ({rubricRows.length} criteria)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRubricRow}
                    className="text-[#173B67] dark:text-[#62B6E8] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Criterion</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {rubricRows.map((row, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={row.criterion}
                          onChange={(e) => handleUpdateRubricRow(idx, 'criterion', e.target.value)}
                          placeholder="Criterion title (e.g. Zero 320px overflow)"
                          className="flex-1 px-2.5 py-1.5 rounded-btn bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#173B67] dark:text-white"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            min={5}
                            max={100}
                            value={row.weight}
                            onChange={(e) => handleUpdateRubricRow(idx, 'weight', Number(e.target.value))}
                            className="w-16 px-2 py-1.5 rounded-btn bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-center font-bold text-[#173B67] dark:text-white"
                          />
                          <span className="text-[10px] text-[#526174]">%</span>
                        </div>
                        {rubricRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRubricRow(idx)}
                            className="text-[#526174] hover:text-[#EF4444] p-1"
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
                        className="w-full px-2.5 py-1 rounded-btn bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[11px] text-[#526174]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-btn bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 font-semibold hover:bg-[#EAF5FC] text-[#173B67] dark:text-white cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold shadow-soft transition-all cursor-pointer"
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
          <div className="p-4 rounded-card bg-white dark:bg-[#0F2035] border border-[#62B6E8] shadow-soft-lg flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-btn text-white shrink-0 ${
                notificationToast.action === 'added' ? 'bg-[#10B981]' : 'bg-[#F2B66D]'
              }`}>
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-[#173B67] dark:text-white text-sm">
                  {notificationToast.action === 'added'
                    ? '🎉 Candidate Shortlisted!'
                    : 'Candidate Removed from Shortlist'}
                </div>
                <div className="text-[#526174] dark:text-slate-300 leading-relaxed">
                  <strong>{notificationToast.candidateName}</strong> {notificationToast.action === 'added' ? 'added to your interview queue for' : 'removed from shortlist for'}{' '}
                  <strong>{notificationToast.role}</strong>.
                </div>
                <div className="text-[10px] text-[#065F46] dark:text-[#10B981] font-semibold pt-0.5">
                  ✓ Simulated alert sent to learner's SkillBridge portal.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotificationToast(null)}
              className="text-[#526174] hover:text-[#173B67] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
