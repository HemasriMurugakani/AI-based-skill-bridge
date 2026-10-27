import React, { useState, useMemo } from 'react';
import {
  districtOverviews,
  heatmapCohortGroups,
  heatmapSkills,
  heatmapData,
  initialAtRiskLearners,
  HeatmapCell,
  AtRiskLearner
} from '../data/institutionData';
import { EmptyState } from '../components/EmptyState';
import {
  Building2,
  Users,
  TrendingUp,
  Award,
  AlertTriangle,
  Download,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Info,
  Check,
  Send,
  X,
  Layers
} from 'lucide-react';

export const InstitutionView: React.FC = () => {
  // 1. District Filter State
  const [selectedDistrictKey, setSelectedDistrictKey] = useState<string>('all');

  // 2. Heatmap Selected Cell for Modal / Detail Popover
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<HeatmapCell | null>(null);

  // 3. At-Risk Learners State & Interventions
  const [atRiskLearners, setAtRiskLearners] = useState<AtRiskLearner[]>(initialAtRiskLearners);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active district metrics
  const activeOverview = useMemo(() => {
    return districtOverviews[selectedDistrictKey] || districtOverviews['all'];
  }, [selectedDistrictKey]);

  // Filtered cohorts for heatmap
  const filteredCohortGroups = useMemo(() => {
    if (selectedDistrictKey === 'all') return heatmapCohortGroups;
    const distName = activeOverview.district;
    return heatmapCohortGroups.filter(c => distName.includes(c.district) || c.district.includes(distName));
  }, [selectedDistrictKey, activeOverview]);

  // Filtered at-risk learners
  const filteredAtRiskLearners = useMemo(() => {
    if (selectedDistrictKey === 'all') return atRiskLearners;
    const distName = activeOverview.district;
    return atRiskLearners.filter(l => distName.includes(l.district) || l.district.includes(distName));
  }, [selectedDistrictKey, atRiskLearners, activeOverview]);

  // Handle Trigger Intervention for an At-Risk Learner
  const handleTriggerIntervention = (learnerId: string, learnerName: string, intervention: string) => {
    setAtRiskLearners(prev =>
      prev.map(l => (l.id === learnerId ? { ...l, interventionTriggered: true } : l))
    );

    setToastMessage(`✓ Intervention Dispatched: "${intervention}" simulated for ${learnerName}.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Export Cohort Data as real downloadable CSV
  const handleExportCSV = () => {
    const headers = [
      'Learner ID',
      'Name',
      'Tamil Name',
      'District',
      'Cohort Group',
      'Pathway Track',
      'Stalled Milestone',
      'Days Stalled',
      'Current Rubric Score (%)',
      'Risk Level',
      'Suggested Intervention',
      'Intervention Dispatched'
    ];

    const rows = filteredAtRiskLearners.map(l => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.nameTamil}"`,
      `"${l.district}"`,
      `"${l.cohortName}"`,
      `"${l.pathwayTitle}"`,
      `"${l.stalledMilestone}"`,
      l.daysStalled,
      l.currentRubricScore,
      `"${l.riskLevel}"`,
      `"${l.suggestedIntervention.replace(/"/g, '""')}"`,
      l.interventionTriggered ? 'Yes' : 'Pending'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `skillbridge_${selectedDistrictKey}_cohort_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`✓ CSV Report "${link.getAttribute('download')}" downloaded successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* =========================================================================
          MANDATORY "DEMO DATA" LABEL & INSTITUTION DASHBOARD HEADER
          ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-card bg-white dark:bg-night-card border border-sky-100 dark:border-night-border shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {/* STRICT REQUIREMENT: Label "Demo data" */}
              <span className="px-3 py-1 rounded-full bg-amber-100/70 dark:bg-amber-950/80 border border-amber-300 text-[#173B67] dark:text-amber-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F2B66D]" />
                <span>Demo data · Simulated Institutional Cohort Analytics</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-deepblue-950 text-[#173B67] dark:text-sky-300 border border-[#62B6E8]/30 text-xs font-bold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#62B6E8]" />
                <span>College & Skill Mission Portal</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#173B67] dark:text-white">
              Institutional Cohort Governance & Interventions
            </h1>
            <div className="font-tamil text-xs text-[#526174] dark:text-night-muted">
              கல்லூரி மற்றும் மாவட்ட அளவிலான மாணவர்கள் முன்னேற்ற கண்காணிப்பு தளம்
            </div>
          </div>

          {/* District Filter & CSV Export Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* District Filter Dropdown (STRICT REQUIREMENT) */}
            <div className="flex items-center gap-1.5 bg-[#EAF5FC] dark:bg-night-100 p-1.5 rounded-btn border border-sky-200 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#173B67] dark:text-sky-300 ml-1.5" />
              <select
                value={selectedDistrictKey}
                onChange={(e) => setSelectedDistrictKey(e.target.value)}
                className="text-xs font-bold bg-transparent text-[#173B67] dark:text-night-ink focus:outline-none cursor-pointer pr-2"
              >
                <option value="all">All Districts (Tamil Nadu)</option>
                <option value="trichy">Tiruchirappalli (Trichy)</option>
                <option value="tiruppur">Tiruppur</option>
                <option value="coimbatore">Coimbatore</option>
                <option value="madurai">Madurai</option>
                <option value="chennai">Chennai</option>
              </select>
            </div>

            {/* Export as CSV Button (STRICT REQUIREMENT) */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67] font-bold text-xs shadow-soft transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export as CSV</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-[#526174] dark:text-night-muted leading-relaxed">
          Aggregates reproducible project submissions, viva voce authentications, and rubric milestone transitions for academic institutions and state vocational skill clusters.
        </p>
      </div>

      {/* =========================================================================
          COHORT OVERVIEW KPIS (LEARNERS, ACTIVE THIS WEEK, COMPLETION)
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Learners (Sample Data) */}
        <div className="p-4 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-1">
          <div className="flex items-center justify-between text-[#526174]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Demo Cohort (Sample)</span>
            <Users className="w-4 h-4 text-[#173B67] dark:text-sky-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            {activeOverview.totalLearners.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold truncate">
            Illustrative sample • {activeOverview.district}
          </div>
        </div>

        {/* Active This Week */}
        <div className="p-4 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-1">
          <div className="flex items-center justify-between text-[#526174]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active This Week</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {activeOverview.activeThisWeek.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">
            {activeOverview.activePercentage}% Weekly Activity Rate
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-4 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-1">
          <div className="flex items-center justify-between text-[#526174]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Milestone Completion</span>
            <Award className="w-4 h-4 text-[#F2B66D]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            {activeOverview.completionRate}%
          </div>
          <div className="text-[10px] text-[#526174]">
            On track to workplace readiness
          </div>
        </div>

        {/* Avg Readiness Score */}
        <div className="p-4 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-1">
          <div className="flex items-center justify-between text-[#526174]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Readiness</span>
            <ShieldCheck className="w-4 h-4 text-[#173B67] dark:text-sky-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            {activeOverview.avgReadiness}
            <span className="text-sm font-normal text-[#526174]">/100</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">
            {activeOverview.vivaAuthenticityRate}% Viva Authenticity
          </div>
        </div>

        {/* At-Risk Count */}
        <div className="p-4 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#526174]">
            <span className="text-[11px] font-bold uppercase tracking-wider">At-Risk Learners</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {filteredAtRiskLearners.length}
          </div>
          <div className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
            Actionable interventions ready
          </div>
        </div>
      </div>

      {/* =========================================================================
          DROP-OFF FUNNEL BY ROADMAP MILESTONE (STRICT REQUIREMENT)
          ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0] dark:border-night-border">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#173B67] dark:text-night-ink flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#173B67] dark:text-sky-300" />
              <span>Drop-Off Funnel by Roadmap Milestone</span>
            </h2>
            <div className="text-xs text-[#526174] font-tamil">
              மைல்கல் வாரியான மாணவர்கள் தொடர்ச்சி மற்றும் இடைவெளி பகுப்பாய்வு
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-300 border border-[#BAE6FD] dark:border-night-border">
              Demo data
            </span>
          </div>
        </div>

        {/* Visual Progressive Funnel Bars */}
        <div className="space-y-3 pt-1">
          {activeOverview.funnel.map((stage, idx) => {
            const widthPercentage = Math.max(15, stage.conversionRate);

            return (
              <div
                key={stage.id}
                className="p-3.5 rounded-card bg-[#F8FAFC] dark:bg-night-100/60 border border-[#E2E8F0] dark:border-night-border space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#173B67] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-[#173B67] dark:text-night-ink">
                        {stage.stageName}
                      </span>
                      <span className="font-tamil text-xs text-[#526174] ml-2">
                        {stage.stageNameTamil}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
                    <span className="font-extrabold text-sm text-[#173B67] dark:text-sky-400">
                      {stage.learnersCount.toLocaleString()} learners
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                      {stage.conversionRate}% retained
                    </span>
                    {stage.dropoffRate > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[11px]">
                        -{stage.dropoffRate}% drop-off
                      </span>
                    )}
                  </div>
                </div>

                {/* Funnel Visual Bar */}
                <div className="w-full h-2.5 bg-[#EAF5FC] dark:bg-night-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#173B67] via-[#62B6E8] to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>

                {/* AI Diagnostic Insight & Recommendation */}
                <div className="pt-1.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-[11px] text-[#526174]">
                  <div className="flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#62B6E8] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#173B67] dark:text-night-ink">Diagnostic:</strong> {stage.diagnosticInsight}
                    </span>
                  </div>
                  <div className="text-[#173B67] dark:text-sky-300 font-semibold shrink-0">
                    → Action: {stage.actionRecommendation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SKILL-GAP HEATMAP (SKILLS × COHORT GROUPS - STRICT REQUIREMENT)
          ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0] dark:border-night-border">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#173B67] dark:text-night-ink flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#62B6E8] dark:text-sky-300" />
              <span>Skill-Gap Heatmap (Skills × Cohort Groups)</span>
            </h2>
            <div className="text-xs text-[#526174] font-tamil">
              திறன் வாரியான தேர்ச்சி மற்றும் இடைவெளி வெப்ப வரைபடம்
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-[11px] text-[#526174]">Strong (≥75%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#F2B66D]" />
              <span className="text-[11px] text-[#526174]">Moderate (60-74%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <span className="text-[11px] text-[#526174]">Skill Gap (&lt;60%)</span>
            </span>
          </div>
        </div>

        {/* Matrix Grid Table */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-night-border text-[#526174]">
                <th className="p-2.5 font-bold uppercase tracking-wider text-[11px] min-w-[220px]">
                  Competency Track & Skill
                </th>
                {filteredCohortGroups.map(cohort => (
                  <th
                    key={cohort.id}
                    className="p-2.5 font-bold uppercase tracking-wider text-[10px] text-center min-w-[130px]"
                  >
                    <div>{cohort.name}</div>
                    <div className="text-[9px] font-normal text-[#94A3B8]">{cohort.district}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-night-border/60">
              {heatmapSkills.map(skill => (
                <tr key={skill.id} className="hover:bg-[#F8FAFC] dark:hover:bg-night-100/40 transition-colors">
                  <td className="p-2.5">
                    <div className="font-bold text-[#173B67] dark:text-night-ink">{skill.name}</div>
                    <div className="font-tamil text-[10px] text-[#526174]">{skill.nameTamil}</div>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-300 border border-[#BAE6FD] dark:border-night-border">
                      {skill.track}
                    </span>
                  </td>

                  {filteredCohortGroups.map(cohort => {
                    const cell = heatmapData.find(
                      d => d.skillId === skill.id && d.cohortId === cohort.id
                    );

                    if (!cell) {
                      return (
                        <td key={cohort.id} className="p-2.5 text-center text-[#526174]">
                          —
                        </td>
                      );
                    }

                    // Heatmap color logic
                    let cellBg = 'bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 border border-rose-200';
                    if (cell.status === 'strong') {
                      cellBg = 'bg-emerald-50 dark:bg-forest-950/70 text-emerald-900 dark:text-forest-200 border border-emerald-200';
                    } else if (cell.status === 'moderate') {
                      cellBg = 'bg-[#FFFBEB] dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-200';
                    }

                    return (
                      <td key={cohort.id} className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedHeatmapCell(cell)}
                          className={`w-full py-2 px-1.5 rounded-btn border text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-soft ${cellBg}`}
                          title={`Click to inspect gap remediation for ${cohort.name}`}
                        >
                          <div>{cell.score}%</div>
                          <div className="text-[9px] font-normal opacity-80">
                            {cell.status === 'gap' ? 'Gap' : cell.status === 'strong' ? 'Pass' : 'Dev'}
                          </div>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-[#526174] italic text-center">
          💡 Click any heatmap cell to inspect cohort breakdown and trigger immediate remediation actions.
        </p>
      </div>

      {/* =========================================================================
          AT-RISK LEARNERS LIST WITH SUGGESTED INTERVENTIONS (STRICT REQUIREMENT)
          ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0] dark:border-night-border">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base sm:text-lg font-bold text-[#173B67] dark:text-night-ink">
                At-Risk Learners & Suggested Interventions ({filteredAtRiskLearners.length})
              </h2>
            </div>
            <div className="text-xs text-[#526174] font-tamil">
              பின்தங்கிய மாணவர்களுக்கான வழிகாட்டல் மற்றும் மேம்பாட்டு பரிந்துரைகள்
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-300 border border-[#BAE6FD] dark:border-night-border">
              Demo data
            </span>
          </div>
        </div>

        {/* At-Risk Learners Cards */}
        <div className="space-y-3 pt-1">
          {filteredAtRiskLearners.length === 0 ? (
            <EmptyState
              title="All learners currently on track"
              titleTamil="மாணவர்கள் அனைவரும் சீராக முன்னேறுகின்றனர்"
              description="No at-risk learners identified for the selected district filter. Skill acquisition and viva scores are above threshold."
              descriptionTamil="தேர்வு செய்த மாவட்ட வடிகட்டியில் பின்தங்கிய மாணவர்கள் எவருமில்லை. தேர்ச்சி நிலைகள் திருப்திகரமாக உள்ளன."
              actionLabel="View all districts"
              actionLabelTamil="அனைத்து மாவட்டங்களையும் காண்க"
              onAction={() => setSelectedDistrictKey('all')}
            />
          ) : (
            filteredAtRiskLearners.map(learner => (
              <div
                key={learner.id}
                className="p-4 rounded-card bg-[#F8FAFC] dark:bg-night-100/60 border border-[#E2E8F0] dark:border-night-border space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={learner.avatar}
                      alt={learner.name}
                      className="w-11 h-11 rounded-lg object-cover border border-[#E2E8F0] dark:border-night-border shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#173B67] dark:text-night-ink">
                          {learner.name}
                        </span>
                        <span className="font-tamil text-xs text-[#526174]">
                          {learner.nameTamil}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            learner.riskLevel === 'high'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {learner.riskLevel === 'high' ? 'High Risk · Stalled' : 'Moderate Risk · Gap'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#526174] mt-0.5">
                        {learner.cohortName} • {learner.district} • {learner.pathwayTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <div className="text-right">
                      <div className="font-extrabold text-sm text-rose-700 dark:text-rose-400">
                        {learner.currentRubricScore}% Score
                      </div>
                      <div className="text-[10px] text-[#526174]">
                        Stalled for {learner.daysStalled} days
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stalled Milestone & Suggested Intervention Card */}
                <div className="p-3 rounded-lg bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-[#173B67] dark:text-night-ink flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Stalled Milestone: {learner.stalledMilestone}</span>
                    </div>
                    <span className="text-[10px] text-[#526174] font-tamil">
                      {learner.stalledMilestoneTamil}
                    </span>
                  </div>

                  {/* SUGGESTED INTERVENTION */}
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E2E8F0] dark:border-night-border">
                    <div className="text-emerald-900 dark:text-emerald-300 font-medium leading-relaxed">
                      <strong>Suggested Intervention:</strong> {learner.suggestedIntervention}
                    </div>

                    <button
                      type="button"
                      disabled={learner.interventionTriggered}
                      onClick={() => handleTriggerIntervention(learner.id, learner.name, learner.suggestedIntervention)}
                      className={`px-3.5 py-1.5 rounded-btn text-xs font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                        learner.interventionTriggered
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                          : 'bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] shadow-soft'
                      }`}
                    >
                      {learner.interventionTriggered ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Intervention Dispatched</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Trigger Intervention</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =========================================================================
          HEATMAP CELL INSPECTION MODAL
          ========================================================================= */}
      {selectedHeatmapCell && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedHeatmapCell(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-night-card rounded-card shadow-2xl border border-[#E2E8F0] dark:border-night-border p-5 space-y-4 z-10 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0] dark:border-night-border">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD] font-bold uppercase">
                  Skill Gap Remediation Detail
                </span>
                <h3 className="text-base font-bold text-[#173B67] dark:text-night-ink mt-1">
                  {selectedHeatmapCell.skillName}
                </h3>
                <div className="text-xs text-[#526174] font-tamil">
                  {selectedHeatmapCell.skillNameTamil} • {selectedHeatmapCell.cohortName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHeatmapCell(null)}
                className="p-1 rounded-full text-[#526174] hover:text-[#173B67]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-card bg-[#F8FAFC] dark:bg-night-100 border border-[#E2E8F0] dark:border-night-border text-center">
                <div className="text-[10px] uppercase font-bold text-[#526174]">Cohort Competency</div>
                <div className="font-extrabold text-2xl text-[#173B67] dark:text-sky-400">
                  {selectedHeatmapCell.score}%
                </div>
                <div className="text-[10px] text-[#526174]">Rubric Average</div>
              </div>

              <div className="p-3 rounded-card bg-[#F8FAFC] dark:bg-night-100 border border-[#E2E8F0] dark:border-night-border text-center">
                <div className="text-[10px] uppercase font-bold text-[#526174]">Affected Learners</div>
                <div className="font-extrabold text-2xl text-rose-700">
                  {selectedHeatmapCell.affectedCount}
                </div>
                <div className="text-[10px] text-[#526174]">Learners needing help</div>
              </div>
            </div>

            <div className="p-3.5 rounded-card bg-[#EAF5FC] dark:bg-night-100/60 border border-[#BAE6FD] dark:border-night-border space-y-1.5">
              <div className="font-bold text-[#173B67] dark:text-sky-300 uppercase text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />
                <span>Recommended Remediation Intervention:</span>
              </div>
              <p className="text-[#173B67] dark:text-night-ink leading-relaxed">
                {selectedHeatmapCell.remediationAction}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedHeatmapCell(null)}
                className="px-4 py-2 rounded-btn bg-[#F8FAFC] dark:bg-night-100 font-semibold text-[#173B67] border border-[#E2E8F0] dark:border-night-border hover:bg-[#EAF5FC]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setToastMessage(`✓ Remediation task dispatched to ${selectedHeatmapCell.cohortName}.`);
                  setSelectedHeatmapCell(null);
                  setTimeout(() => setToastMessage(null), 3500);
                }}
                className="px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold shadow-soft cursor-pointer"
              >
                Dispatch Cohort Remediation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ANIMATED TOAST NOTIFICATION
          ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] sm:w-full animate-in slide-in-from-bottom duration-300">
          <div className="p-3.5 rounded-card bg-[#EAF5FC] dark:bg-night-card border border-[#BAE6FD] dark:border-night-border shadow-soft flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#173B67] dark:text-sky-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-[#526174] hover:text-[#173B67] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
