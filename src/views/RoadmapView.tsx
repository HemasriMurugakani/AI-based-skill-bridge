import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { initialRoadmaps, MilestoneNode, PathwayRoadmap } from '../data/roadmapData';
import { adaptRoadmap } from '../services/api';
import { CssQuizModal } from '../components/CssQuizModal';
import { LessonDrawer } from '../components/LessonDrawer';
import { AIThinking } from '../components/AIThinking';
import { StatusPill } from '../components/StatusPill';
import { TrustLabel } from '../components/TrustLabel';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Map,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  BookOpen,
  Shuffle,
  ShieldCheck,
  ChevronRight,
  Layers,
  HelpCircle,
  Zap,
  Flame,
  Award,
  RefreshCw,
  Plus,
  Download
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const {
    currentPersonaId,
    getPersona,
    setActiveTab,
    pathways,
    isOfflineDemo,
    isLessonsDownloaded,
    downloadLessonsOffline,
    lessonsDownloadProgress
  } = useSkillBridgeStore();

  const { t } = useTranslation();
  const persona = getPersona();

  // Active pathway key: default to persona's pathway
  const [selectedPathwayKey, setSelectedPathwayKey] = useState<string>(
    persona.pathwayId in initialRoadmaps ? persona.pathwayId : 'junior-web-dev'
  );

  // Roadmaps state
  const [roadmaps, setRoadmaps] = useState<Record<string, PathwayRoadmap>>(initialRoadmaps);
  const currentRoadmap = roadmaps[selectedPathwayKey] || roadmaps['junior-web-dev'];

  // Modals & Drawers state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeLessonMilestone, setActiveLessonMilestone] = useState<MilestoneNode | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);
  const [newlyAddedNodeId, setNewlyAddedNodeId] = useState<string | null>(null);

  // Changelog entries
  const [changelog, setChangelog] = useState<string[]>([
    "Initial diagnostic benchmark: Semantic HTML milestone verified with 92% project proof."
  ]);

  const handleQuizCompleted = async (score: number) => {
    setIsQuizOpen(false);

    if (score < 60) {
      // Trigger live AI adaptation via /api/roadmap-adapt (with fallback)
      setIsAdapting(true);
      try {
        const response = await adaptRoadmap(
          {
            pathwayId: selectedPathwayKey,
            quizScore: score,
            quizTopic: 'Flexbox'
          },
          isOfflineDemo
        );

        const remedialNode: MilestoneNode = {
          ...response.data.insertedNode,
          transferable: false
        };

        setRoadmaps(prev => {
          const cur = prev['junior-web-dev'];
          const updated = [...cur.milestones];
          // Insert after milestone 2 (step 2)
          const insertIdx = updated.findIndex(m => m.stepNumber === 2);
          if (insertIdx !== -1) {
            updated.splice(insertIdx + 1, 0, remedialNode);
          } else {
            updated.splice(2, 0, remedialNode);
          }
          return {
            ...prev,
            'junior-web-dev': {
              ...cur,
              milestones: updated
            }
          };
        });

        setNewlyAddedNodeId(remedialNode.id);

        // Required changelog entry: "Added because you scored 40% on Flexbox"
        const entryText = score === 40
          ? "Added because you scored 40% on Flexbox"
          : `Added because you scored ${score}% on Flexbox`;

        setChangelog(prev => [
          `⚡ ${entryText} (திருக்குறள் 616: முயற்சி திருவினையாக்கும்)`,
          ...prev
        ]);
      } catch (err) {
        console.error('Adaptation call error:', err);
      } finally {
        setIsAdapting(false);
      }
    } else {
      // High score passed
      setChangelog(prev => [
        `✓ Passed CSS Diagnostic Quiz with ${score}%! Milestone 2 verified.`,
        ...prev
      ]);
    }
  };

  const handleFinishedEarly = () => {
    setIsAdapting(true);
    setTimeout(() => {
      setIsAdapting(false);

      const isWeb = selectedPathwayKey === 'junior-web-dev';
      const stretchNode: MilestoneNode = {
        id: `stretch-${Date.now()}`,
        stepNumber: 3.5,
        title: isWeb
          ? 'Bonus Stretch: Container Queries & Micro-Animations'
          : 'Bonus Stretch: Aari & Zardozi Bridal Blouse Embroidery',
        titleTamil: isWeb
          ? 'கூடுதல் பாடம்: மைக்ரோ-அனிமேஷன் & கன்டெய்னர் வினவல்கள்'
          : 'கூடுதல் பாடம்: ஆரி & ஜர்தோசி மணப்பெண் எம்பிராய்டரி',
        activity: isWeb
          ? 'Build interactive state micro-animations with Framer Motion and container queries.'
          : 'Craft decorative metallic zardozi border motifs on raw silk fabric.',
        timeEstimate: '45 mins',
        whyThisStep: 'Unlocked early because you completed preceding milestones ahead of pace! Adds premium portfolio points.',
        status: 'stretch',
        adaptiveReason: 'Bonus Stretch Node unlocked for early milestone completion.',
        lessonContent: {
          overview: 'Mastery extension module designed to propel you into the top 10% of portfolio applicants.',
          overviewTamil: 'உங்கள் போர்ட்ஃபோலியோவை அடுத்த நிலைக்கு எடுத்துச் செல்லும் கூடுதல் சிறப்புப் பாடம்.',
          keyTakeaways: [
            'Differentiates your portfolio from average entry-level applicants.',
            'Validated directly by senior tech leads and master boutique artisans.'
          ],
          audioTranscript: 'Congratulations on finishing early! Enjoy this bonus stretch milestone.',
          audioTranscriptTamil: 'முன்கூட்டியே முடித்ததற்கு வாழ்த்துகள்! இந்த கூடுதல் பாடத்தை அனுபவித்து பயிலுங்கள்.',
          handsOnPrompt: 'Execute bonus design demonstration.'
        }
      };

      setRoadmaps(prev => {
        const cur = prev[selectedPathwayKey];
        const updated = [...cur.milestones];
        updated.splice(3, 0, stretchNode);
        return {
          ...prev,
          [selectedPathwayKey]: {
            ...cur,
            milestones: updated
          }
        };
      });

      setNewlyAddedNodeId(stretchNode.id);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7A1A12', '#B8761A', '#E8B23A', '#2F7D4F']
      });

      setChangelog(prev => [
        `⭐ Bonus Stretch Node Unlocked: Added because you finished early ahead of pace!`,
        ...prev
      ]);
    }, 1000);
  };

  const handleChangeGoal = () => {
    const targetKey = selectedPathwayKey === 'junior-web-dev' ? 'tailoring-craft' : 'junior-web-dev';
    setIsAdapting(true);

    setTimeout(() => {
      setIsAdapting(false);
      setSelectedPathwayKey(targetKey);

      // Reusing transferable milestones:
      // When switching, ensure transferable milestone 1 is recognized and credited as transferred!
      setRoadmaps(prev => {
        const targetRoadmap = prev[targetKey];
        const updatedMilestones = targetRoadmap.milestones.map(m => {
          if (m.transferable && m.stepNumber === 1) {
            return {
              ...m,
              status: 'completed' as const,
              score: 95,
              transferNote: targetKey === 'tailoring-craft'
                ? 'Reused Transferable Milestone: Metric precision and structural discipline transferred from Web Developer track'
                : 'Reused Transferable Milestone: Measurement precision and structural layout habits transferred from Tailoring track'
            };
          }
          return m;
        });

        return {
          ...prev,
          [targetKey]: {
            ...targetRoadmap,
            milestones: updatedMilestones
          }
        };
      });

      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#B8761A', '#2F7D4F', '#7A1A12']
      });

      setChangelog(prev => [
        `🔄 Goal Morphed to "${initialRoadmaps[targetKey].title}": Preserved transferable foundational habits and measurement standards!`,
        ...prev
      ]);
    }, 1200);
  };

  const handleCompleteMilestone = (milestoneId: string) => {
    setRoadmaps(prev => {
      const cur = prev[selectedPathwayKey];
      const updated = cur.milestones.map(m =>
        m.id === milestoneId ? { ...m, status: 'completed' as const, score: 90 } : m
      );
      return {
        ...prev,
        [selectedPathwayKey]: { ...cur, milestones: updated }
      };
    });
    setActiveLessonMilestone(null);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#7A1A12', '#B8761A', '#E8B23A', '#2F7D4F']
    });

    setChangelog(prev => [
      `✓ Milestone "${milestoneId}" marked complete with verified score!`,
      ...prev
    ]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Pathway Switcher */}
      <div className="p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
              Adaptive Winding Transit Roadmap
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 font-bold capitalize">
              {currentRoadmap.category} Track
            </span>
            <TrustLabel type="how-calculated" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
            {currentRoadmap.title}
          </h1>
          <div className="font-tamil text-sm text-warm-muted dark:text-night-muted">
            {currentRoadmap.titleTamil}
          </div>
          <p className="mt-2 text-xs sm:text-sm text-warm-muted dark:text-night-muted max-w-xl leading-relaxed">
            A 5-station metro pathway adapting to your diagnostic scores. Click any station to open the interactive lesson drawer with voice read-aloud and 2G text-only mode.
          </p>
        </div>

        {/* Pathway Switcher Tabs */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center p-1 rounded-full bg-parchment-200 dark:bg-night-100 border border-warm-border/80">
            <button
              onClick={() => setSelectedPathwayKey('junior-web-dev')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedPathwayKey === 'junior-web-dev'
                  ? 'bg-maroon-700 text-white shadow-xs'
                  : 'text-warm-muted hover:text-warm-ink'
              }`}
            >
              Web Dev (Academic)
            </button>
            <button
              onClick={() => setSelectedPathwayKey('tailoring-craft')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedPathwayKey === 'tailoring-craft'
                  ? 'bg-gold-600 text-white shadow-xs'
                  : 'text-warm-muted hover:text-warm-ink'
              }`}
            >
              Tailoring (Vocational)
            </button>
          </div>

          {/* Quick Trigger Demo Buttons */}
          <div className="flex items-center gap-1.5 justify-end">
            {selectedPathwayKey === 'junior-web-dev' && (
              <button
                id="roadmap-quiz-trigger"
                type="button"
                onClick={() => setIsQuizOpen(true)}
                className="px-3 py-1 rounded-full text-[11px] font-bold bg-maroon-100 text-maroon-800 border border-maroon-300 hover:bg-maroon-200 cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-maroon-700" />
                <span>Take CSS Quiz</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleFinishedEarly}
              className="px-3 py-1 rounded-full text-[11px] font-bold bg-gold-100 text-gold-900 border border-gold-300 hover:bg-gold-200 cursor-pointer flex items-center gap-1"
            >
              <Award className="w-3 h-3 text-gold-700" />
              <span>Finished Early</span>
            </button>

            <button
              type="button"
              onClick={handleChangeGoal}
              className="px-3 py-1 rounded-full text-[11px] font-bold bg-parchment-200 text-warm-ink border border-warm-border hover:bg-parchment-300 cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Change Goal</span>
            </button>

            {/* Download Lessons for Offline Button */}
            <button
              type="button"
              onClick={downloadLessonsOffline}
              className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer flex items-center gap-1 transition-all ${
                isLessonsDownloaded
                  ? 'bg-forest-100 text-forest-800 border border-forest-300 dark:bg-forest-950 dark:text-forest-200'
                  : 'bg-forest-700 hover:bg-forest-800 text-white shadow-xs'
              }`}
              title="Pre-cache roadmap modules, code prompts, and transcripts for 100% offline learning"
            >
              <Download className="w-3 h-3" />
              <span>
                {isLessonsDownloaded
                  ? 'Offline Ready (4.2 MB)'
                  : lessonsDownloadProgress > 0 && lessonsDownloadProgress < 100
                  ? `Caching ${lessonsDownloadProgress}%...`
                  : 'Download Lessons for Offline'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Thinking state when adapting */}
      {isAdapting && (
        <div className="p-8 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border dark:border-night-border shadow-warm-md text-center">
          <AIThinking
            stage="adapting"
            labelEnglish="Calling /api/roadmap-adapt: Restructuring metro nodes and inserting targeted milestones..."
            labelTamil="வழிகாட்டி வரைபடத்தில் புதிய மைல்கற்களை AI சேர்க்கிறது..."
          />
        </div>
      )}

      {/* 2. LIVE CHANGELOG BANNER */}
      <div className="p-4 rounded-2xl bg-parchment-100/90 dark:bg-night-100/90 border border-gold-300/60 dark:border-gold-700/60 shadow-xs flex items-start gap-3 text-xs">
        <div className="p-1.5 rounded-xl bg-gold-200 dark:bg-gold-800 text-gold-900 dark:text-gold-100 mt-0.5 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-warm-ink dark:text-night-ink uppercase tracking-wide text-[10px]">
            Adaptive Roadmap Audit Trail & Changelog
          </div>
          <div className="mt-1 space-y-1">
            {changelog.slice(0, 3).map((log, idx) => (
              <div key={idx} className="text-warm-muted dark:text-night-muted leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. WINDING METRO-LINE TRANSIT MAP (Interactive Stations) */}
      <section id="roadmap-milestones-tree" className="relative p-6 sm:p-10 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-md overflow-hidden">
        {/* Kolam background texture */}
        <div className="absolute inset-0 kolam-pattern-bg opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
              Station by Station Proof Transit
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heritage text-warm-ink dark:text-night-ink">
              The {currentRoadmap.title} Line
            </h2>
          </div>

          {/* Winding Metro Track with Alternating Left-Right Curve Stations */}
          <div className="relative space-y-8 sm:space-y-12">
            {/* Metro Center Track Spine Line (Vertical Transit Line) */}
            <div
              className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1.5 -translate-x-1/2 rounded-full pointer-events-none"
              style={{
                backgroundColor: currentRoadmap.color,
                opacity: 0.35
              }}
            />

            {currentRoadmap.milestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              const isCompleted = milestone.status === 'completed';
              const isCurrent = milestone.status === 'current';
              const isRemedial = milestone.status === 'adaptive_remedial';
              const isStretch = milestone.status === 'stretch';
              const isNewlyAdded = milestone.id === newlyAddedNodeId;

              return (
                <div
                  key={milestone.id}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-6 ${
                    isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Station Card (Left or Right on Desktop with Slide-in animation) */}
                  <motion.div
                    initial={isNewlyAdded ? { opacity: 0, x: isEven ? -60 : 60, scale: 0.95 } : false}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.55, type: 'spring' }}
                    onClick={() => setActiveLessonMilestone(milestone)}
                    className={`w-full sm:w-[calc(50%-2rem)] p-5 rounded-2xl border transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-warm-md ${
                      isNewlyAdded || isRemedial
                        ? 'bg-terracotta-50/90 dark:bg-terracotta-950/70 border-terracotta-500 ring-4 ring-terracotta-400/70 shadow-warm-lg animate-pulse'
                        : isCompleted
                        ? 'bg-forest-50/80 dark:bg-forest-950/40 border-forest-300 dark:border-forest-800'
                        : isStretch
                        ? 'bg-gold-50/90 dark:bg-gold-950/70 border-gold-400 ring-4 ring-gold-400/60 shadow-warm-md'
                        : isCurrent
                        ? 'bg-parchment-100 dark:bg-night-100 border-gold-400 dark:border-gold-600 ring-2 ring-gold-400/50 shadow-warm-md'
                        : 'bg-white/70 dark:bg-night-card border-warm-border/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-parchment-200 dark:bg-night-100 uppercase tracking-wide">
                          Station {milestone.stepNumber < 10 ? `0${milestone.stepNumber}` : milestone.stepNumber}
                        </span>
                        <span className="text-[10px] font-semibold text-warm-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {milestone.timeEstimate}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isNewlyAdded && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-terracotta-600 text-white animate-bounce">
                            ⚡ Just Added
                          </span>
                        )}

                        {milestone.transferable && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gold-100 text-gold-900 border border-gold-300">
                            Transferable
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-warm-ink dark:text-night-ink group-hover:text-maroon-700 transition-colors">
                      {milestone.title}
                    </h3>
                    <div className="font-tamil text-xs text-warm-muted dark:text-night-muted mt-0.5">
                      {milestone.titleTamil}
                    </div>

                    <p className="mt-2 text-xs text-warm-muted dark:text-night-muted leading-relaxed">
                      {milestone.activity}
                    </p>

                    {/* "Why this step" evidence line */}
                    <div className="mt-3 p-2.5 rounded-xl bg-white/80 dark:bg-black/30 border border-warm-border/60 text-[11px] leading-snug">
                      <span className="font-bold text-maroon-800 dark:text-gold-400">Why this step: </span>
                      <span className="text-warm-muted dark:text-night-muted">{milestone.whyThisStep}</span>
                    </div>

                    {/* Transferable Reused Milestone Note */}
                    {milestone.transferNote && (
                      <div className="mt-2.5 p-2 rounded-xl bg-gold-100/80 dark:bg-gold-950/60 border border-gold-300/80 text-[10px] text-gold-900 dark:text-gold-200 flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span>{milestone.transferNote}</span>
                      </div>
                    )}

                    {/* Bottom Status / Score */}
                    <div className="mt-3 pt-2.5 border-t border-warm-border/50 flex items-center justify-between text-xs">
                      <span className="font-bold capitalize flex items-center gap-1">
                        {isCompleted ? (
                          <span className="text-forest-700 dark:text-forest-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed ({milestone.score}%)
                          </span>
                        ) : isRemedial ? (
                          <span className="text-terracotta-700 font-bold flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            Adaptive Practice Node
                          </span>
                        ) : isStretch ? (
                          <span className="text-gold-700 font-bold flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            Bonus Stretch Station
                          </span>
                        ) : isCurrent ? (
                          <span className="text-maroon-700 dark:text-gold-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Current Focus Station
                          </span>
                        ) : (
                          <span className="text-warm-muted flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            Locked
                          </span>
                        )}
                      </span>

                      <span className="text-maroon-700 dark:text-gold-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        <span>Open Lesson</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>

                  {/* Center Metro Station Hub Icon */}
                  <div
                    onClick={() => setActiveLessonMilestone(milestone)}
                    className={`absolute left-6 sm:left-1/2 -translate-x-1/2 w-11 h-11 rounded-full border-4 border-white dark:border-night-card shadow-warm-md flex items-center justify-center font-bold text-xs cursor-pointer transition-transform hover:scale-125 z-10 ${
                      isCompleted
                        ? 'bg-forest-600 text-white'
                        : isRemedial
                        ? 'bg-terracotta-600 text-white ring-4 ring-terracotta-300 animate-bounce'
                        : isStretch
                        ? 'bg-gold-500 text-maroon-950 ring-4 ring-gold-300'
                        : isCurrent
                        ? 'bg-maroon-700 text-white ring-4 ring-gold-400 animate-pulse'
                        : 'bg-warm-200 dark:bg-night-100 text-warm-muted'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span>{milestone.stepNumber}</span>
                    )}
                  </div>

                  {/* Empty Spacer on opposite side for desktop symmetry */}
                  <div className="hidden sm:block w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Lesson Drawer Modal */}
      <LessonDrawer
        milestone={activeLessonMilestone}
        onClose={() => setActiveLessonMilestone(null)}
        onCompleteMilestone={handleCompleteMilestone}
        onTakeChallenge={() => setActiveTab('challenges')}
      />

      {/* 5. CSS Quiz Modal */}
      <CssQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onQuizCompleted={handleQuizCompleted}
      />
    </div>
  );
};
