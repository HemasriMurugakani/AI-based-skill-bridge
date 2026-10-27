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
import { AboutThisData } from '../components/ui/AboutThisData';
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
  Download,
  Play
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
          handsOnPrompt: 'Execute bonus design demonstration.',
          videoResource: {
            youtubeId: isWeb ? '1PnVor36_40' : 'wTBnFX7NKVA',
            title: isWeb ? 'Learn Modern CSS in 20 Minutes' : 'ஆரி ஒர்க் பிளவுஸ் தைப்பது எப்படி? (Aari Work Tutorial)',
            titleTamil: isWeb ? '20 நிமிடங்களில் நவீன CSS பாடம்' : 'ஆரி ஒர்க் பிளவுஸ் தைக்கும் எளிய நுணுக்கங்கள்',
            channel: isWeb ? 'Web Dev Simplified' : 'Laksh Designers',
            duration: isWeb ? '20:15' : '15:42'
          }
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
        colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
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
        colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
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
      colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
    });

    setChangelog(prev => [
      `✓ Milestone "${milestoneId}" marked complete with verified score!`,
      ...prev
    ]);
  };

    const { i18n } = useTranslation();
    const currentLang = i18n.language || 'en';
    const isTa = currentLang === 'ta';

    return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Pathway Switcher */}
      <div className="p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#62B6E8]">
              {isTa ? 'வளரும் கற்றல் வரைபடம்' : 'Adaptive Learning Roadmap'}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] font-semibold border border-[#BAE6FD] capitalize">
              {currentRoadmap.category} {isTa ? 'வழித்தடம்' : 'Track'}
            </span>
            <AboutThisData
              title={isTa ? 'வரைபட தகவமைப்பு பற்றி' : 'About Roadmap Adaptation'}
              description={isTa
                ? 'உங்கள் வினாடி வினா மதிப்பெண்கள் மற்றும் வேகத்திற்கு ஏற்ப மைல்கற்கள் தகவமைக்கப்படுகின்றன.'
                : 'Milestones dynamically adapt based on diagnostic quiz scores, speed of completion, and transferred foundational skills. Nodes marked transferable can be preserved when pivoting career pathways.'}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B67] dark:text-white">
            {isTa ? (currentRoadmap.titleTamil || currentRoadmap.title) : currentRoadmap.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#526174] dark:text-slate-300 max-w-xl leading-relaxed">
            {isTa
              ? 'உங்கள் தேர்வுத் திறனுக்கு ஏற்ப மாறும் திறன் வரைபடம். பாடங்களைக் காண ஏதேனும் ஒரு மைல்கல்லைத் தேர்ந்தெடுக்கவும்.'
              : 'A flexible skill journey adapting to your diagnostic performance. Click any milestone to open interactive guided lessons with voice read-aloud and low-bandwidth mode.'}
          </p>
        </div>

        {/* Pathway Switcher Tabs */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center p-1 rounded-full bg-[#EAF5FC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700">
            <button
              onClick={() => setSelectedPathwayKey('junior-web-dev')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedPathwayKey === 'junior-web-dev'
                  ? 'bg-[#62B6E8] text-[#173B67] shadow-soft'
                  : 'text-[#526174] dark:text-slate-300 hover:text-[#173B67]'
              }`}
            >
              {isTa ? 'இணையதள உருவாக்கம் (கல்வி)' : 'Web Dev (Academic)'}
            </button>
            <button
              onClick={() => setSelectedPathwayKey('tailoring-craft')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedPathwayKey === 'tailoring-craft'
                  ? 'bg-[#62B6E8] text-[#173B67] shadow-soft'
                  : 'text-[#526174] dark:text-slate-300 hover:text-[#173B67]'
              }`}
            >
              {isTa ? 'ஆடைத் தையல் (தொழிற்கல்வி)' : 'Tailoring (Vocational)'}
            </button>
          </div>

          {/* Quick Trigger Demo Buttons */}
          <div className="flex items-center gap-1.5 justify-end flex-wrap">
            {selectedPathwayKey === 'junior-web-dev' && (
              <button
                id="roadmap-quiz-trigger"
                type="button"
                onClick={() => setIsQuizOpen(true)}
                className="px-3 py-1 rounded-btn text-xs font-semibold bg-[#EAF5FC] hover:bg-[#D9EFFB] text-[#173B67] border border-[#BAE6FD] cursor-pointer flex items-center gap-1 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-[#62B6E8]" />
                <span>{isTa ? 'CSS தேர்வு எழுதுக' : 'Take CSS Quiz'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleFinishedEarly}
              className="px-3 py-1 rounded-btn text-xs font-semibold bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-[#F2B66D]" />
              <span>{isTa ? 'முன்னதாக முடித்தேன்' : 'Finished Early'}</span>
            </button>

            <button
              type="button"
              onClick={handleChangeGoal}
              className="px-3 py-1 rounded-btn text-xs font-semibold bg-[#EAF5FC] hover:bg-[#D9EFFB] text-[#173B67] border border-[#BAE6FD] cursor-pointer flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#62B6E8]" />
              <span>{isTa ? 'இலக்கை மாற்றுக' : 'Change Goal'}</span>
            </button>

            {/* Download Lessons for Offline Button */}
            <button
              type="button"
              onClick={downloadLessonsOffline}
              className={`px-3 py-1 rounded-btn text-xs font-semibold cursor-pointer flex items-center gap-1 transition-all ${
                isLessonsDownloaded
                  ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                  : 'bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] shadow-soft'
              }`}
              title={isTa ? 'ஆஃப்லைன் கற்றலுக்காகப் பாடங்களை சேமிக்கவும்' : 'Pre-cache roadmap modules, code prompts, and transcripts for 100% offline learning'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isLessonsDownloaded
                  ? (isTa ? 'ஆஃப்லைனில் தயார் (4.2 MB)' : 'Offline Ready (4.2 MB)')
                  : lessonsDownloadProgress > 0 && lessonsDownloadProgress < 100
                  ? `${isTa ? 'பதிவிறக்கம்' : 'Caching'} ${lessonsDownloadProgress}%...`
                  : (isTa ? 'ஆஃப்லைனுக்காக பதிவிறக்குக' : 'Download Lessons for Offline')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Thinking state when adapting */}
      {isAdapting && (
        <div className="p-8 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] dark:border-slate-800 shadow-soft text-center">
          <AIThinking
            stage="adapting"
            labelEnglish="Calling /api/roadmap-adapt: Restructuring milestone nodes and inserting targeted pathways..."
            labelTamil="வழிகாட்டி வரைபடத்தில் புதிய மைல்கற்களை AI சேர்க்கிறது..."
          />
        </div>
      )}

      {/* 2. LIVE CHANGELOG BANNER */}
      <div className="p-4 rounded-card bg-[#EAF5FC] dark:bg-[#0F2035] border border-[#BAE6FD] dark:border-slate-700 shadow-soft flex items-start gap-3 text-xs">
        <div className="p-1.5 rounded-btn bg-[#62B6E8]/20 text-[#173B67] dark:text-[#62B6E8] mt-0.5 shrink-0">
          <Sparkles className="w-4 h-4 text-[#173B67] dark:text-[#62B6E8]" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-[#173B67] dark:text-white uppercase tracking-wider text-[11px]">
            Adaptive Roadmap Audit Trail & Changelog
          </div>
          <div className="mt-1 space-y-1">
            {changelog.slice(0, 3).map((log, idx) => (
              <div key={idx} className="text-[#526174] dark:text-slate-300 leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. WINDING TRANSIT MAP (Interactive Stations) */}
      <section id="roadmap-milestones-tree" className="relative p-6 sm:p-10 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#62B6E8]">
              Milestone by Milestone Progression
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
              The {currentRoadmap.title} Pathway
            </h2>
          </div>

          {/* Winding Metro Track with Alternating Left-Right Curve Stations */}
          <div className="relative space-y-8 sm:space-y-12">
            {/* Metro Center Track Spine Line (Vertical Transit Line) */}
            <div
              className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1.5 -translate-x-1/2 rounded-full pointer-events-none"
              style={{
                backgroundColor: '#62B6E8',
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
                    className={`w-full sm:w-[calc(50%-2rem)] p-5 rounded-card border transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-soft ${
                      isNewlyAdded || isRemedial
                        ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 border-[#F87171] ring-2 ring-[#FCA5A5]/60 shadow-soft'
                        : isCompleted
                        ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/20 border-[#A7F3D0] dark:border-[#059669]'
                        : isStretch
                        ? 'bg-[#FFFBEB] dark:bg-[#78350F]/20 border-[#FCD34D] ring-2 ring-[#FDE68A]/60 shadow-soft'
                        : isCurrent
                        ? 'bg-[#EAF5FC] dark:bg-[#0C4A6E]/30 border-[#62B6E8] ring-2 ring-[#62B6E8]/40 shadow-soft'
                        : 'bg-white dark:bg-[#0F2035] border-[#E2E8F0] dark:border-slate-800 opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-slate-800 text-[#173B67] dark:text-[#62B6E8] uppercase tracking-wide border border-[#BAE6FD] dark:border-slate-700">
                          {isTa ? 'நிலை' : 'Station'} {milestone.stepNumber < 10 ? `0${milestone.stepNumber}` : milestone.stepNumber}
                        </span>
                        <span className="text-[10px] font-semibold text-[#526174] dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#526174]" />
                          {milestone.timeEstimate}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isNewlyAdded && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#EF4444] text-white animate-pulse">
                            {isTa ? '⚡ இப்போது சேர்க்கப்பட்டது' : '⚡ Just Added'}
                          </span>
                        )}

                        {milestone.lessonContent.videoResource && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50 flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>{isTa ? 'காணொளி பாடம்' : 'Video Lesson'}</span>
                          </span>
                        )}

                        {milestone.transferable && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                            {isTa ? 'பரிமாற்றக்கூடியது' : 'Transferable'}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#173B67] dark:text-white group-hover:text-[#62B6E8] transition-colors">
                      {isTa ? (milestone.titleTamil || milestone.title) : milestone.title}
                    </h3>

                    <p className="mt-2 text-xs text-[#526174] dark:text-slate-300 leading-relaxed">
                      {milestone.activity}
                    </p>

                    {/* "Why this step" evidence line */}
                    <div className="mt-3 p-2.5 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[11px] leading-snug">
                      <span className="font-bold text-[#173B67] dark:text-[#62B6E8]">{isTa ? 'ஏன் இந்த படி: ' : 'Why this step: '}</span>
                      <span className="text-[#526174] dark:text-slate-300">{milestone.whyThisStep}</span>
                    </div>

                    {/* Transferable Reused Milestone Note */}
                    {milestone.transferNote && (
                      <div className="mt-2.5 p-2 rounded-btn bg-[#EAF5FC] dark:bg-slate-800 border border-[#BAE6FD] dark:border-slate-700 text-[10px] text-[#173B67] dark:text-[#62B6E8] flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-[#62B6E8] shrink-0" />
                        <span>{milestone.transferNote}</span>
                      </div>
                    )}

                    {/* Bottom Status / Score */}
                    <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-bold capitalize flex items-center gap-1">
                        {isCompleted ? (
                          <span className="text-[#065F46] dark:text-[#10B981] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            {isTa ? 'முடிந்தது' : 'Completed'} ({milestone.score}%)
                          </span>
                        ) : isRemedial ? (
                          <span className="text-[#DC2626] dark:text-[#F87171] font-semibold flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            {isTa ? 'தகவமைப்பு பயிற்சி நிலை' : 'Adaptive Practice Node'}
                          </span>
                        ) : isStretch ? (
                          <span className="text-[#B45309] dark:text-[#F2B66D] font-semibold flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            {isTa ? 'கூடுதல் சிறப்பு நிலை' : 'Bonus Stretch Station'}
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[#173B67] dark:text-[#62B6E8] font-semibold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />
                            {isTa ? 'தற்போதைய கவனம் நிலை' : 'Current Focus Station'}
                          </span>
                        ) : (
                          <span className="text-[#526174] dark:text-slate-400 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            {isTa ? 'பூட்டப்பட்டுள்ளது' : 'Locked'}
                          </span>
                        )}
                      </span>

                      <span className="text-[#173B67] dark:text-[#62B6E8] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        <span>{isTa ? 'பாடம் திறக்க' : 'Open Lesson'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>

                  {/* Center Metro Station Hub Icon */}
                  <div
                    onClick={() => setActiveLessonMilestone(milestone)}
                    className={`absolute left-6 sm:left-1/2 -translate-x-1/2 w-11 h-11 rounded-full border-4 border-white dark:border-[#0F2035] shadow-soft flex items-center justify-center font-bold text-xs cursor-pointer transition-transform hover:scale-110 z-10 ${
                      isCompleted
                        ? 'bg-[#10B981] text-white'
                        : isRemedial
                        ? 'bg-[#EF4444] text-white ring-4 ring-[#FCA5A5]'
                        : isStretch
                        ? 'bg-[#F2B66D] text-[#173B67] ring-4 ring-[#FEF3C7]'
                        : isCurrent
                        ? 'bg-[#62B6E8] text-[#173B67] ring-4 ring-[#BAE6FD]'
                        : 'bg-[#E2E8F0] dark:bg-slate-800 text-[#526174]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
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
