import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { SkillChip } from '../components/SkillChip';
import { TrustLabel } from '../components/TrustLabel';
import { SkillState } from '../types';
import { Layers, CheckCircle2, AlertCircle, HelpCircle, ArrowUpRight, ArrowRight } from 'lucide-react';

export const SkillsView: React.FC = () => {
  const { getCurrentPathway, setActiveTab } = useSkillBridgeStore();
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const pathway = getCurrentPathway();

  const [activeFilter, setActiveFilter] = useState<'all' | SkillState>('all');

  const filteredSkills = pathway.skills.filter(s => {
    if (activeFilter === 'all') return true;
    return s.state === activeFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-sky-300 px-3 py-1 rounded-full bg-[#EAF5FC] border border-[#BAE6FD]">
                {isTa ? 'திறன் மதிப்பீட்டு அணி' : 'Skills Assessment Matrix'}
              </span>
              <TrustLabel type="how-calculated" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
              {isTa ? 'தகுதி & விதிமுறை தொகுப்பு' : 'Competency & Rubric Portfolio'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#526174] dark:text-night-muted max-w-2xl">
              {isTa
                ? 'சரிபார்க்கப்பட்ட குறியீடு, நேரடி புகைப்பட ஆய்வுகள் மற்றும் வாய்மொழி தேர்வுகள் மூலம் திறன்கள் அளவிடப்படுகின்றன. மதிப்பீடு செய்யப்படாத திறன்கள் நடுநிலையாகவே இருக்கும்.'
                : 'Skills are measured through verified code, physical photo inspections, and viva defenses. Unassessed skills remain strictly neutral.'}
            </p>
          </div>

          <TrustLabel type="evidence-badge" />
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-[#E2E8F0] dark:border-night-border/60">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#173B67] text-white shadow-soft'
                : 'bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 hover:bg-[#D9EFFB]'
            }`}
          >
            {isTa ? 'அனைத்து திறன்களும்' : 'All Skills'} ({pathway.skills.length})
          </button>
          <button
            onClick={() => setActiveFilter('strong')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'strong'
                ? 'bg-[#10B981] text-white shadow-soft'
                : 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#065F46] dark:text-emerald-200 border border-[#A7F3D0]'
            }`}
          >
            {isTa ? 'வலுவானவை' : 'Strong'} ({pathway.skills.filter(s => s.state === 'strong').length})
          </button>
          <button
            onClick={() => setActiveFilter('develop')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'develop'
                ? 'bg-[#F2B66D] text-[#173B67] font-bold shadow-soft'
                : 'bg-[#FFFBEB] dark:bg-amber-950/60 text-[#B45309] dark:text-amber-200 border border-[#FDE68A]'
            }`}
          >
            {isTa ? 'வளர்க்க வேண்டியவை' : 'Develop'} ({pathway.skills.filter(s => s.state === 'develop').length})
          </button>
          <button
            onClick={() => setActiveFilter('gap')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'gap'
                ? 'bg-[#EF4444] text-white shadow-soft'
                : 'bg-[#FEF2F2] dark:bg-red-950/60 text-[#991B1B] dark:text-red-200 border border-[#FECACA]'
            }`}
          >
            {isTa ? 'திறன் இடைவெளிகள்' : 'Skill Gaps'} ({pathway.skills.filter(s => s.state === 'gap').length})
          </button>
          <button
            onClick={() => setActiveFilter('not_assessed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'not_assessed'
                ? 'bg-[#64748B] text-white shadow-soft'
                : 'bg-[#F8FAFC] dark:bg-night-100 text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            {isTa ? 'மதிப்பிடப்படாதவை' : 'Not Assessed'} ({pathway.skills.filter(s => s.state === 'not_assessed').length})
          </button>
        </div>
      </div>

      {/* Grid of Detailed Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft flex flex-col justify-between hover:border-[#62B6E8] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#526174] dark:text-night-muted uppercase tracking-wider">
                  {skill.category}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-sky-200 border border-[#BAE6FD]">
                  {isTa ? 'நிலை' : 'Level'} {skill.level} {isTa ? '/ 5' : 'of 5'}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#173B67] dark:text-white">
                {isTa ? (skill.nameTamil || skill.name) : skill.name}
              </h3>

              <p className="mt-2 text-xs text-[#526174] dark:text-night-muted leading-relaxed">
                {skill.description}
              </p>

              {/* Rubric Checkpoints */}
              <div className="mt-4">
                <div className="text-[11px] font-bold text-[#173B67] dark:text-white mb-1.5">
                  {isTa ? 'மதிப்பீட்டு விதிமுறை அளவுகோல்கள்:' : 'Evaluation Rubric Criteria:'}
                </div>
                <ul className="space-y-1 text-xs text-[#526174] dark:text-night-muted">
                  {skill.rubricCriteria.map((c, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#62B6E8]" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-night-border/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#526174] uppercase block">{isTa ? 'நிலை' : 'Status'}</span>
                <span className={`text-xs font-bold capitalize ${
                  skill.state === 'strong' ? 'text-[#10B981]' :
                  skill.state === 'develop' ? 'text-[#D97706]' :
                  skill.state === 'gap' ? 'text-[#EF4444]' :
                  'text-[#64748B]'
                }`}>
                  {skill.state === 'strong' ? (isTa ? 'வலுவானது' : 'Strong') :
                   skill.state === 'develop' ? (isTa ? 'வளரும் நிலை' : 'Develop') :
                   skill.state === 'gap' ? (isTa ? 'இடைவெளி' : 'Gap') :
                   (isTa ? 'மதிப்பிடப்படவில்லை' : 'Not Assessed')} {skill.score ? `(${skill.score}%)` : ''}
                </span>
              </div>

              <button
                onClick={() => setActiveTab('challenges')}
                className="px-4 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-soft cursor-pointer"
              >
                <span>{isTa ? 'சவாலில் பங்கேற்க' : 'Take Challenge'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
