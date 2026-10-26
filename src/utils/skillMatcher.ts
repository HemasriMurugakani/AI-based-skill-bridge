import { SkillItem, SkillState } from '../types';
import { JdSkillItemSchema } from '../services/api';
import { z } from 'zod';

type JdSkillItem = z.infer<typeof JdSkillItemSchema>;

export interface SkillComparisonResult {
  jdSkill: JdSkillItem;
  learnerSkillMatch?: SkillItem;
  classification: SkillState;
  oneLineExplanation: string;
  learnerScore: number;
  requiredScore: number;
  priorityRank: number;
  urgency: 'Immediate' | 'Next Step' | 'Solid';
}

export interface RadarDataPoint {
  category: string;
  learner: number;
  required: number;
  fullMark: number;
}

// Alias dictionary for deterministic matching
const aliasDictionary: Record<string, string[]> = {
  // Web Dev
  'web-html-semantics': ['semantic html', 'accessibility', 'html5', 'wcag', 'a11y', 'landmarks'],
  'web-responsive-css': ['responsive css', 'flexbox', 'css grid', 'tailwind', 'mobile-first', 'fluid layouts'],
  'web-javascript-dom': ['javascript', 'dom', 'es6', 'async/await', 'closures', 'event delegation'],
  'web-react-components': ['react', 'react.js', 'react components', 'hooks', 'jsx', 'frontend engineering'],
  'web-rest-apis': ['rest api', 'fetch', 'axios', 'state caching', 'caching', 'api integration'],
  'web-git-workflows': ['git', 'version control', 'github', 'pull requests', 'prs'],
  
  // Tailoring
  'tailor-body-measurement': ['body measurement', 'ease allowance', 'tape measurement', 'client measurement'],
  'tailor-blouse-drafting': ['blouse drafting', 'katori', 'paper pattern', 'pattern drafting', '4-dart'],
  'tailor-machine-stitching': ['lockstitch', 'sewing machine', 'tension control', '10 spi', 'straight stitch'],
  'tailor-piping-finishing': ['bias binding', 'neckline piping', 'cord piping', '45 degree', 'piping'],
  'tailor-press-ironing': ['steam pressing', 'seam opening', 'ironing', 'garment finishing'],

  // Electrical
  'elec-safety-tools': ['electrical safety', 'ppe', 'is 5216', 'loto', 'safety standard'],
  'elec-conduit-wiring': ['conduit wiring', 'pvc conduit', 'staircase switch', 'loop-in', 'two-way switch'],
  'elec-earthing-testing': ['earthing', 'megger', 'earth resistance', 'pipe earthing', 'plate earthing']
};

/**
 * Deterministically find best matching learner skill from alias dictionary
 */
function findLearnerSkillMatch(jdName: string, learnerSkills: SkillItem[]): SkillItem | undefined {
  const normalizedJd = jdName.toLowerCase();

  // 1. Direct name substring check
  const directMatch = learnerSkills.find(ls => 
    ls.name.toLowerCase().includes(normalizedJd) || normalizedJd.includes(ls.name.toLowerCase())
  );
  if (directMatch) return directMatch;

  // 2. Alias dictionary check
  for (const [skillId, aliases] of Object.entries(aliasDictionary)) {
    const hasAlias = aliases.some(alias => normalizedJd.includes(alias) || alias.includes(normalizedJd));
    if (hasAlias) {
      const match = learnerSkills.find(ls => ls.id === skillId);
      if (match) return match;
    }
  }

  return undefined;
}

/**
 * Deterministic comparison engine (NOT AI)
 * Classifies as Strong / Develop / Not assessed / Gap with honest, non-judgmental explanations
 */
export function compareSkillsDeterministically(
  jdSkills: JdSkillItem[],
  learnerSkills: SkillItem[]
): {
  results: SkillComparisonResult[];
  overallMatchScore: number;
  radarData: RadarDataPoint[];
  prioritizedList: SkillComparisonResult[];
} {
  const results: SkillComparisonResult[] = [];

  jdSkills.forEach((jdSkill, index) => {
    const matched = findLearnerSkillMatch(jdSkill.name, learnerSkills);
    const requiredScore = jdSkill.importance === 'must' ? 85 : 70;

    let classification: SkillState = 'not_assessed';
    let explanation = 'Not assessed: no evidence yet, this is not a weakness.';
    let learnerScore = 0;
    let urgency: 'Immediate' | 'Next Step' | 'Solid' = 'Next Step';

    if (matched) {
      learnerScore = matched.score || (matched.level * 20);

      if (matched.state === 'strong' || learnerScore >= 80) {
        classification = 'strong';
        explanation = `Strong: you passed the ${matched.name} assessment with verified project evidence (Score ${learnerScore}%).`;
        urgency = 'Solid';
      } else if (matched.state === 'develop' || (learnerScore >= 50 && learnerScore < 80)) {
        classification = 'develop';
        explanation = `Develop: partial evidence, completed ${matched.evidenceCount} verified milestone (Score ${learnerScore}%).`;
        urgency = jdSkill.importance === 'must' ? 'Immediate' : 'Next Step';
      } else if (matched.state === 'gap') {
        classification = 'gap';
        explanation = `Skill Gap: marked must-have by employer (${jdSkill.why}); immediate challenge practice recommended.`;
        urgency = 'Immediate';
      } else {
        classification = 'not_assessed';
        explanation = 'Not assessed: unassessed skill kept neutral. Ready for diagnostic challenge.';
        urgency = jdSkill.importance === 'must' ? 'Immediate' : 'Next Step';
      }
    } else {
      // Not in learner's active pathway yet
      classification = 'not_assessed';
      explanation = 'Not assessed: no evidence submitted yet. This is an unassessed skill, never a demerit.';
      urgency = jdSkill.importance === 'must' ? 'Immediate' : 'Next Step';
    }

    results.push({
      jdSkill,
      learnerSkillMatch: matched,
      classification,
      oneLineExplanation: explanation,
      learnerScore,
      requiredScore,
      priorityRank: index + 1,
      urgency
    });
  });

  // Calculate overall match score
  const totalWeight = results.reduce((sum, r) => sum + (r.jdSkill.importance === 'must' ? 1.5 : 1), 0);
  const earnedWeight = results.reduce((sum, r) => {
    const weight = r.jdSkill.importance === 'must' ? 1.5 : 1;
    const ratio = Math.min(1, r.learnerScore / r.requiredScore);
    return sum + (ratio * weight);
  }, 0);
  const overallMatchScore = Math.round((earnedWeight / totalWeight) * 100);

  // Build Radar Data across distinct categories
  const categories = Array.from(new Set(results.map(r => r.jdSkill.category)));
  const radarData: RadarDataPoint[] = categories.map(cat => {
    const catResults = results.filter(r => r.jdSkill.category === cat);
    const avgLearner = Math.round(
      catResults.reduce((sum, r) => sum + r.learnerScore, 0) / catResults.length
    );
    const avgRequired = Math.round(
      catResults.reduce((sum, r) => sum + r.requiredScore, 0) / catResults.length
    );
    return {
      category: cat,
      learner: avgLearner,
      required: avgRequired,
      fullMark: 100
    };
  });

  // Ranked "Prioritise next" list:
  // Sort by: Gaps & Develop on 'must' skills first, then 'must' not-assessed, then 'nice' skills
  const prioritizedList = [...results].sort((a, b) => {
    const urgencyScore = (item: SkillComparisonResult) => {
      if (item.jdSkill.importance === 'must' && (item.classification === 'gap' || item.classification === 'develop')) return 4;
      if (item.jdSkill.importance === 'must' && item.classification === 'not_assessed') return 3;
      if (item.jdSkill.importance === 'nice' && item.classification === 'develop') return 2;
      return 1;
    };
    return urgencyScore(b) - urgencyScore(a);
  });

  return {
    results,
    overallMatchScore,
    radarData,
    prioritizedList
  };
}
