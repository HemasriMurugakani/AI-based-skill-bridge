import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { SkillChip } from '../components/SkillChip';
import { TrustLabel } from '../components/TrustLabel';
import { SkillState } from '../types';
import { Layers, CheckCircle2, AlertCircle, HelpCircle, ArrowUpRight, ArrowRight } from 'lucide-react';

export const SkillsView: React.FC = () => {
  const { getCurrentPathway, setActiveTab } = useSkillBridgeStore();
  const { t } = useTranslation();
  const pathway = getCurrentPathway();

  const [activeFilter, setActiveFilter] = useState<'all' | SkillState>('all');

  const filteredSkills = pathway.skills.filter(s => {
    if (activeFilter === 'all') return true;
    return s.state === activeFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
                Skills Assessment Matrix
              </span>
              <TrustLabel type="how-calculated" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
              Competency & Rubric Portfolio
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-warm-muted dark:text-night-muted max-w-2xl">
              Skills are measured through verified code, physical photo inspections, and viva defenses. Unassessed skills remain strictly neutral.
            </p>
          </div>

          <TrustLabel type="evidence-badge" />
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-warm-border/60 dark:border-night-border/60">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-maroon-700 text-white shadow-warm-sm'
                : 'bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink hover:bg-parchment-300'
            }`}
          >
            All Skills ({pathway.skills.length})
          </button>
          <button
            onClick={() => setActiveFilter('strong')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'strong'
                ? 'bg-forest-700 text-white shadow-warm-sm'
                : 'bg-forest-50 dark:bg-forest-950/60 text-forest-800 dark:text-forest-200 border border-forest-200'
            }`}
          >
            Strong ({pathway.skills.filter(s => s.state === 'strong').length})
          </button>
          <button
            onClick={() => setActiveFilter('develop')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'develop'
                ? 'bg-gold-600 text-white shadow-warm-sm'
                : 'bg-gold-50 dark:bg-gold-950/60 text-gold-900 dark:text-gold-200 border border-gold-200'
            }`}
          >
            Develop ({pathway.skills.filter(s => s.state === 'develop').length})
          </button>
          <button
            onClick={() => setActiveFilter('gap')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'gap'
                ? 'bg-terracotta-700 text-white shadow-warm-sm'
                : 'bg-terracotta-50 dark:bg-terracotta-950/60 text-terracotta-900 dark:text-terracotta-200 border border-terracotta-200'
            }`}
          >
            Skill Gaps ({pathway.skills.filter(s => s.state === 'gap').length})
          </button>
          <button
            onClick={() => setActiveFilter('not_assessed')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'not_assessed'
                ? 'bg-warm-muted text-white shadow-warm-sm'
                : 'bg-warm-100 dark:bg-night-100 text-warm-muted border border-warm-border'
            }`}
          >
            Not Assessed ({pathway.skills.filter(s => s.state === 'not_assessed').length})
          </button>
        </div>
      </div>

      {/* Grid of Detailed Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-card bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-warm-muted dark:text-night-muted uppercase tracking-wider">
                  {skill.category}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-parchment-200/80 dark:bg-night-100">
                  Level {skill.level} of 5
                </span>
              </div>

              <h3 className="text-base font-bold text-warm-ink dark:text-night-ink">
                {skill.name}
              </h3>
              {skill.nameTamil && (
                <div className="font-tamil text-xs text-warm-muted dark:text-night-muted">
                  {skill.nameTamil}
                </div>
              )}

              <p className="mt-2 text-xs text-warm-muted dark:text-night-muted leading-relaxed">
                {skill.description}
              </p>

              {/* Rubric Checkpoints */}
              <div className="mt-4">
                <div className="text-[11px] font-bold text-warm-ink dark:text-night-ink mb-1.5">
                  Evaluation Rubric Criteria:
                </div>
                <ul className="space-y-1 text-xs text-warm-muted dark:text-night-muted">
                  {skill.rubricCriteria.map((c, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-warm-border/60 dark:border-night-border/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-warm-muted uppercase block">Status</span>
                <span className={`text-xs font-bold capitalize ${
                  skill.state === 'strong' ? 'text-forest-700 dark:text-forest-400' :
                  skill.state === 'develop' ? 'text-gold-700 dark:text-gold-400' :
                  skill.state === 'gap' ? 'text-terracotta-700 dark:text-terracotta-400' :
                  'text-warm-muted'
                }`}>
                  {skill.state.replace('_', ' ')} {skill.score ? `(${skill.score}%)` : ''}
                </span>
              </div>

              <button
                onClick={() => setActiveTab('challenges')}
                className="px-3.5 py-1.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-warm-sm"
              >
                <span>Take Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
