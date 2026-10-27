import React, { useState, useEffect, useRef } from 'react';
import { Challenge } from '../types';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { StatusPill } from './StatusPill';
import { TrustLabel } from './TrustLabel';
import { AIThinking } from './AIThinking';
import { evaluateRubricFeedback, RubricFeedback } from '../services/api';
import { useTranslation } from 'react-i18next';
import { SpeechInputController, SpeechLang, isSpeechRecognitionSupported } from '../utils/speech';
import { QuickVivaModal } from './QuickVivaModal';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Code,
  Mic,
  MicOff,
  Camera,
  Link as LinkIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Clock,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  FileText,
  Volume2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Play,
  Video
} from 'lucide-react';

interface ChallengeWorkspaceProps {
  challenge: Challenge;
  onBack: () => void;
}

export const ChallengeWorkspace: React.FC<ChallengeWorkspaceProps> = ({
  challenge,
  onBack
}) => {
  const {
    completeChallenge,
    unlockBadge,
    updateSkillState,
    isOfflineDemo,
    vivaRecords,
    setActiveTab
  } = useSkillBridgeStore();
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  const isWebProfile = challenge.id === 'challenge-web-profile';
  const isCommIntro = challenge.id === 'challenge-comm-intro';
  const existingViva = vivaRecords[challenge.id];

  // Submission inputs
  const [projectUrl, setProjectUrl] = useState(
    isWebProfile ? 'https://github.com/priya-dev/handloom-artisan-profile' : ''
  );
  const [screenshotUrl, setScreenshotUrl] = useState(
    isWebProfile
      ? 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
      : ''
  );
  const [writtenExplanation, setWrittenExplanation] = useState('');
  const [audioTranscript, setAudioTranscript] = useState('');

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingLang, setRecordingLang] = useState<SpeechLang>('ta-IN');
  const [recordingTime, setRecordingTime] = useState(0);
  const speechControllerRef = useRef<SpeechInputController | null>(null);
  const timerRef = useRef<any>(null);

  // Submission & evaluation state
  const [currentVersion, setCurrentVersion] = useState<1 | 2>(1);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [v1Feedback, setV1Feedback] = useState<RubricFeedback | null>(null);
  const [v2Feedback, setV2Feedback] = useState<RubricFeedback | null>(null);
  const [activeFeedback, setActiveFeedback] = useState<RubricFeedback | null>(null);
  const [badgeUnlockedId, setBadgeUnlockedId] = useState<string | null>(null);
  const [showDeltaComparison, setShowDeltaComparison] = useState(false);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = useState(true);

  // Initialize Speech Controller for voice challenges
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      speechControllerRef.current = new SpeechInputController(
        recordingLang,
        (transcript) => {
          setAudioTranscript((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        (listening) => {
          setIsRecording(listening);
          if (listening) {
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
              setRecordingTime((t) => t + 1);
            }, 1000);
          } else {
            clearInterval(timerRef.current);
          }
        },
        (error) => {
          console.warn('Speech recognition warning:', error);
          setIsRecording(false);
          clearInterval(timerRef.current);
        }
      );
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (speechControllerRef.current) speechControllerRef.current.stop();
    };
  }, [recordingLang]);

  // Pre-fill sample values on initial load
  useEffect(() => {
    if (isWebProfile) {
      loadV1WebDraft();
    } else if (isCommIntro) {
      loadV1CommDraft();
    } else {
      setWrittenExplanation('Detailed breakdown of implementation aligning with IS and WCAG accessibility standards.');
    }
  }, [challenge.id]);

  const loadV1WebDraft = () => {
    setCurrentVersion(1);
    setProjectUrl('https://github.com/priya-dev/handloom-artisan-profile');
    setScreenshotUrl('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80');
    setWrittenExplanation(
      `// v1 Draft: Implemented semantic landmarks and flex layout
<header role="banner">
  <a href="#content" class="skip-link">Skip to Content</a>
  <nav aria-label="Main Navigation">
    <ul><li><a href="/">Artisan Profile</a></li></ul>
  </nav>
</header>
<main id="content">
  <!-- Note: Has fixed width: 480px on card and min-width: 360px causing 320px mobile overflow -->
  <section class="profile-card" style="width: 480px; min-width: 360px;">
    <h2>Lakshmi · Master Silk Weaver</h2>
    <p style="color: #999;">Salem Silk Cluster Specialist</p>
  </section>
</main>`
    );
  };

  const loadV2WebRevised = () => {
    setCurrentVersion(2);
    setProjectUrl('https://github.com/priya-dev/handloom-artisan-profile-v2');
    setScreenshotUrl('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80');
    setWrittenExplanation(
      `// v2 Revised: Fixed 320px overflow using clamp() and fluid flexbox
<header role="banner">
  <a href="#content" class="skip-link focus-ring">Skip to Content</a>
  <nav aria-label="Main Navigation">
    <ul><li><a href="/" class="focus-ring">Artisan Profile</a></li></ul>
  </nav>
</header>
<main id="content">
  <!-- Resolved: Removed rigid width; implemented clamp(14px, 3vw, 24px) padding & flex: 1 1 280px -->
  <section class="profile-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); width: 100%; max-width: 900px; padding: clamp(12px, 3vw, 24px);">
    <article class="profile-card" style="max-width: 100%; min-width: 0;">
      <h2 style="font-size: clamp(1.25rem, 2.5vw, 1.75rem); color: #173B67;">Lakshmi · Master Silk Weaver</h2>
      <p style="color: #526174;">Salem Silk Cluster Specialist · 6.5:1 contrast</p>
    </article>
  </section>
</main>`
    );
  };

  const loadV1CommDraft = () => {
    setCurrentVersion(1);
    setWrittenExplanation('Target: Prospective tech employers in Chennai and local artisan cooperatives.');
    setAudioTranscript(
      'வணக்கம்... என் பெயர் பிரியா. நான் சேலத்தில் இருக்கிறேன். Basically I want to become a frontend engineer and tailor. I did some courses online. I am looking for a job to prove my skills. Thank you very much.'
    );
  };

  const loadV2CommRevised = () => {
    setCurrentVersion(2);
    setWrittenExplanation('Target: Frontend Apprenticeship Reviewer / Chennai Tech Collective.');
    setAudioTranscript(
      'வணக்கம்! என் பெயர் பிரியா. சேலம் மாவட்டத்தைச் சேர்ந்த நான், SkillBridge AI தளத்தில் Semantic HTML மற்றும் Responsive CSS பிரிவில் 92% சான்றளிக்கப்பட்ட மதிப்பெண் பெற்றுள்ளேன். சேலம் பட்டு நெசவாளர்களுக்காக பூஜ்ஜிய-பிழை கொண்ட இணையதளத்தை உருவாக்கியுள்ளேன். சென்னை அல்லது தொலைதூர தொழில்பழகுநர் வாய்ப்பை உடனடியாக ஏற்கத் தயாராக உள்ளேன். நன்றி!'
    );
  };

  const toggleVoiceRecording = () => {
    if (!speechControllerRef.current) {
      alert('Voice recording requires Web Speech API (best in Chrome). You can also type or use the sample buttons.');
      return;
    }
    speechControllerRef.current.toggle();
  };

  const handleSubmitForReview = async () => {
    setIsEvaluating(true);

    try {
      const response = await evaluateRubricFeedback(
        {
          challengeId: challenge.id,
          submission: {
            projectUrl,
            screenshotUrl,
            writtenExplanation,
            audioTranscript,
            version: currentVersion
          }
        },
        isOfflineDemo
      );

      const feedback = response.data;
      setActiveFeedback(feedback);

      if (currentVersion === 1) {
        setV1Feedback(feedback);
      } else {
        setV2Feedback(feedback);
        setShowDeltaComparison(true);
      }

      // If passing score (>= 80%)
      if (feedback.overall >= 80) {
        completeChallenge(challenge.id, feedback.overall);
        updateSkillState(challenge.pathwayId, challenge.skillId, 'strong', feedback.overall);

        // Determine badge to unlock
        const badgeIdToUnlock = isWebProfile
          ? 'badge-responsive-profile'
          : isCommIntro
          ? 'badge-professional-pitch'
          : 'badge-wcag-champion';

        unlockBadge(badgeIdToUnlock);
        setBadgeUnlockedId(badgeIdToUnlock);

        // Confetti celebration
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
        });
      }

      // After any challenge submission, show "Quick viva: prove this is your work"
      setIsVivaModalOpen(true);
    } catch (err) {
      console.error('Rubric feedback error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleStartRevisionV2 = () => {
    if (isWebProfile) {
      loadV2WebRevised();
    } else if (isCommIntro) {
      loadV2CommRevised();
    } else {
      setCurrentVersion(2);
      setWrittenExplanation((prev) => `${prev}\n\n// Revision v2: Addressed rubric feedback checkpoints.`);
    }
    setActiveFeedback(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header with Breadcrumb & Status */}
      <div className="p-6 rounded-card bg-white border border-[#E2E8F0] shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#526174] hover:text-[#173B67] transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTa ? 'அனைத்து சவால்களுக்கும் திரும்புக' : 'Back to All Challenges'}</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill status="ai_reviewed" />
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF5FC] border border-[#BAE6FD] text-[#173B67] font-bold capitalize">
              {challenge.difficulty}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              +{challenge.points} XP
            </span>
            <TrustLabel type="ai-disclaimer" />
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-wider text-[#62B6E8] mb-1">
            {isTa ? 'சவால் பணியிடம்' : 'Challenge Workspace'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67]">
            {isTa ? (challenge.titleTamil || challenge.title) : challenge.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#526174] leading-relaxed">
            {challenge.description}
          </p>
        </div>
      </div>

      {/* 2. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requirements, Rubric & Guidelines (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Required Skills Card */}
          <div className="p-5 rounded-card bg-white border border-[#E2E8F0] shadow-soft space-y-3">
            <div className="text-xs font-bold text-[#173B67] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#173B67]" />
              <span>Required Competencies</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                {challenge.skillName}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                WCAG 2.1 AA
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                Rubric-Verified
              </span>
            </div>
          </div>

          {/* Curated Challenge Study Video */}
          {challenge.videoResource && (
            <div className="rounded-card bg-white border border-[#E2E8F0] shadow-soft overflow-hidden">
              <button
                type="button"
                onClick={() => setIsVideoExpanded(!isVideoExpanded)}
                className="w-full p-4 bg-gradient-to-r from-[#173B67] to-[#1e487d] text-white flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#BAE6FD] block">
                      {isTa ? 'செய்முறை வழிகாட்டி காணொளி' : 'Challenge Study Video'}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {isTa ? (challenge.videoResource.titleTamil || challenge.videoResource.title) : challenge.videoResource.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {challenge.videoResource.duration}
                  </span>
                  {isVideoExpanded ? (
                    <ChevronDown className="w-4 h-4 text-white/80" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white/80" />
                  )}
                </div>
              </button>

              {isVideoExpanded && (
                <div>
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${challenge.videoResource.youtubeId}?rel=0&modestbranding=1`}
                      title={challenge.videoResource.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#526174]">
                      <span className="font-semibold">
                        <span className="text-[#173B67] font-bold">{isTa ? 'பயிற்றுநர்:' : 'Channel:'}</span> {challenge.videoResource.channel}
                      </span>
                      <a
                        href={`https://www.youtube.com/watch?v=${challenge.videoResource.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#173B67] hover:underline flex items-center gap-1 font-semibold text-[10px]"
                      >
                        <span>{isTa ? 'YouTube-ல் பார்க்க' : 'Watch on YouTube'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {challenge.videoResource.keyTopics && (
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        {challenge.videoResource.keyTopics.map((topic, tidx) => (
                          <span
                            key={tidx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#173B67] border border-[#E2E8F0] font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submission Instructions */}
          <div className="p-5 rounded-card bg-white border border-[#E2E8F0] shadow-soft space-y-3">
            <div className="text-xs font-bold text-[#173B67] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#173B67]" />
              <span>Submission Deliverables</span>
            </div>
            <ul className="space-y-2 text-xs text-[#526174]">
              {challenge.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EAF5FC] text-[#173B67] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VISIBLE Rubric Table */}
          <div className="p-5 rounded-card bg-white border border-[#E2E8F0] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#173B67] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Visible Rubric Table</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Passing: ≥80%
              </span>
            </div>

            <p className="text-[11px] text-[#526174] leading-relaxed">
              Every submission is evaluated transparently against these weighted criteria by /api/rubric-feedback.
            </p>

            <div className="space-y-2 pt-1">
              {challenge.rubric.map((r, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#173B67]">
                      {r.criterion}
                    </span>
                    <span className="font-extrabold text-[#173B67] px-1.5 py-0.5 rounded bg-[#EAF5FC] border border-[#BAE6FD] text-[11px]">
                      {r.weight}% Weight
                    </span>
                  </div>
                  <div className="text-[11px] text-[#526174] leading-relaxed">
                    {r.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Modal Evidence Input or Feedback Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Evaluator Simulation Buttons */}
          <div className="p-4 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#62B6E8] shrink-0" />
              <div>
                <span className="font-bold text-[#173B67]">
                  Hackathon Evaluation Bar:
                </span>
                <span className="text-[11px] text-[#526174] ml-1">
                  Test v1 (fails with feedback) vs v2 (revised with delta)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isWebProfile && (
                <>
                  <button
                    type="button"
                    onClick={loadV1WebDraft}
                    className={`px-3 py-1 rounded-btn text-[11px] font-bold border transition-colors cursor-pointer ${
                      currentVersion === 1
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-white text-[#173B67] border-[#E2E8F0] hover:bg-[#EAF5FC]'
                    }`}
                  >
                    Load v1 Draft (74%)
                  </button>
                  <button
                    type="button"
                    onClick={loadV2WebRevised}
                    className={`px-3 py-1 rounded-btn text-[11px] font-bold border transition-colors cursor-pointer ${
                      currentVersion === 2
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white text-[#173B67] border-[#E2E8F0] hover:bg-[#EAF5FC]'
                    }`}
                  >
                    Load v2 Revised (98%)
                  </button>
                </>
              )}

              {isCommIntro && (
                <>
                  <button
                    type="button"
                    onClick={loadV1CommDraft}
                    className={`px-3 py-1 rounded-btn text-[11px] font-bold border transition-colors cursor-pointer ${
                      currentVersion === 1
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-white text-[#173B67] border-[#E2E8F0] hover:bg-[#EAF5FC]'
                    }`}
                  >
                    Load v1 Draft (72%)
                  </button>
                  <button
                    type="button"
                    onClick={loadV2CommRevised}
                    className={`px-3 py-1 rounded-btn text-[11px] font-bold border transition-colors cursor-pointer ${
                      currentVersion === 2
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white text-[#173B67] border-[#E2E8F0] hover:bg-[#EAF5FC]'
                    }`}
                  >
                    Load v2 Polished (96%)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Evaluating Thinking State */}
          {isEvaluating && (
            <div className="p-8 rounded-card bg-white border border-[#E2E8F0] shadow-soft text-center">
              <AIThinking
                stage="evaluating_proof"
                labelEnglish="Calling /api/rubric-feedback: Parsing code landmarks, viewport constraints, and rubric weights..."
                labelTamil="சான்றுகளை AI மாதிரி ஆய்வு செய்து மதிப்பெண்களை கணக்கிடுகிறது..."
              />
            </div>
          )}

          {/* Interactive Evidence Input Form (When not evaluating and no active feedback view) */}
          {!isEvaluating && !activeFeedback && (
            <div id="workspace-submission-card" className="p-6 rounded-card bg-white border border-[#E2E8F0] shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#173B67] flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#173B67]" />
                  <span>Submit Proof Evidence (Version {currentVersion})</span>
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5FC] border border-[#BAE6FD] text-[#173B67]">
                  {currentVersion === 1 ? 'Initial Submission' : 'Revised Submission (v2)'}
                </span>
              </div>

              {/* 1. Project Link Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#173B67] flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#173B67]" />
                  <span>Project Link (GitHub Repository / Live Deploy URL)</span>
                </label>
                <input
                  type="text"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full px-3.5 py-2.5 rounded-btn text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#173B67] focus:outline-none focus:ring-2 focus:ring-[#62B6E8] font-mono"
                />
              </div>

              {/* 2. Screenshot Upload / Preview */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#173B67] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Visual Screenshot / Craft Inspection Photo</span>
                  </span>
                  <span className="text-[10px] text-[#526174]">Verified aspect containment</span>
                </label>

                {screenshotUrl ? (
                  <div className="relative rounded-card overflow-hidden border border-[#E2E8F0] bg-black/5">
                    <img
                      src={screenshotUrl}
                      alt="Submission screenshot preview"
                      className="w-full h-44 object-cover object-top"
                    />
                    <div className="absolute bottom-2 left-2 right-2 p-2 rounded-btn bg-black/75 backdrop-blur-xs text-white text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Screenshot Attached</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setScreenshotUrl('')}
                        className="text-[10px] text-white/80 hover:text-white"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      setScreenshotUrl(
                        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="p-6 rounded-card border-2 border-dashed border-[#E2E8F0] text-center hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <Upload className="w-6 h-6 text-[#526174] mx-auto mb-1" />
                    <span className="text-xs font-semibold text-[#173B67]">
                      Click to attach demonstration screenshot
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Written Code / Technical Explanation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#173B67] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#62B6E8]" />
                    <span>Technical Architecture & Layout Explanation</span>
                  </span>
                  <span className="text-[10px] text-[#526174] font-mono">HTML / CSS / Markdown</span>
                </label>
                <textarea
                  rows={6}
                  value={writtenExplanation}
                  onChange={(e) => setWrittenExplanation(e.target.value)}
                  placeholder="Explain your responsive fluid design choices, ARIA landmark tagging, and how you ensured zero side-scroll..."
                  className="w-full p-3 rounded-btn text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#173B67] focus:outline-none focus:ring-2 focus:ring-[#62B6E8] font-mono leading-relaxed"
                />
              </div>

              {/* 4. Voice-Recorded Intro (Highlighted for communication challenge) */}
              <div className="p-4 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#173B67]" />
                    <span className="text-xs font-bold text-[#173B67]">
                      Voice Defense or Spoken Pitch (Web Speech API)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setRecordingLang('ta-IN')}
                      className={`px-2 py-0.5 rounded-btn font-tamil ${
                        recordingLang === 'ta-IN'
                          ? 'bg-[#173B67] text-white'
                          : 'text-[#526174] hover:text-[#173B67]'
                      }`}
                    >
                      தமிழ்
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecordingLang('en-IN')}
                      className={`px-2 py-0.5 rounded-btn ${
                        recordingLang === 'en-IN'
                          ? 'bg-[#173B67] text-white'
                          : 'text-[#526174] hover:text-[#173B67]'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`px-4 py-2 rounded-btn text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-600 text-white shadow-soft animate-pulse ring-4 ring-rose-200'
                        : 'bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67] font-extrabold'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? `Recording... (${recordingTime}s)` : 'Record Voice Intro'}</span>
                  </button>

                  {/* Animated Waveform Bars when recording */}
                  {isRecording && (
                    <div className="flex items-center gap-1 h-5">
                      {[12, 24, 16, 28, 14, 22].map((height, i) => (
                        <div
                          key={i}
                          className="w-1 bg-rose-600 rounded-full animate-bounce"
                          style={{
                            height: `${height}px`,
                            animationDelay: `${i * 120}ms`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <textarea
                  rows={3}
                  value={audioTranscript}
                  onChange={(e) => setAudioTranscript(e.target.value)}
                  placeholder="Spoken transcript appears here in real-time. You can also edit manually in Tamil or English..."
                  className="w-full p-3 rounded-btn text-xs bg-white border border-[#E2E8F0] text-[#173B67] focus:outline-none focus:ring-2 focus:ring-[#62B6E8] leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmitForReview}
                className="w-full py-3.5 rounded-btn bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67] font-extrabold text-xs shadow-soft flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#173B67]" />
                <span>Submit for AI Rubric Evaluation ({currentVersion === 1 ? 'v1' : 'v2'})</span>
              </button>
            </div>
          )}

          {/* 3. Feedback Results View (After Submit) */}
          {!isEvaluating && activeFeedback && (
            <div id="workspace-rubric-card" className="space-y-6 animate-in fade-in duration-300">
              {/* Header Score Card */}
              <div
                className={`p-6 rounded-card border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  activeFeedback.overall >= 80
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-rose-50 border-rose-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-card flex items-center justify-center font-black text-2xl text-white shadow-soft shrink-0 ${
                      activeFeedback.overall >= 80 ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  >
                    {activeFeedback.overall}%
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <StatusPill status="ai_reviewed" />
                      <span className="text-xs font-bold uppercase tracking-wide text-[#526174]">
                        Version {activeFeedback.version || currentVersion} Evaluation
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#173B67] mt-0.5">
                      {activeFeedback.overall >= 80
                        ? 'Mastery Proof Verified!'
                        : 'Needs Revision & Resubmission'}
                    </h3>
                    <p className="text-xs text-[#526174]">
                      {activeFeedback.overall >= 80
                        ? 'Congratulations! Submission met all production accessibility & rubric standards.'
                        : 'Identified specific layout fixes. Apply the recommendations below to unlock your badge!'}
                    </p>
                  </div>
                </div>

                {activeFeedback.overall < 80 && (
                  <button
                    type="button"
                    onClick={handleStartRevisionV2}
                    className="px-5 py-2.5 rounded-btn bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67] font-bold text-xs shadow-soft flex items-center gap-1.5 transition-transform hover:scale-105 shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Revise & Resubmit (v2)</span>
                  </button>
                )}
              </div>

              {/* Quick Viva Defense Card */}
              <div className="p-5 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] shadow-soft space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF5FC] border border-[#BAE6FD] text-[#173B67] text-[10px] font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3 text-[#62B6E8]" />
                      <span>{isTa ? 'உண்மைத்தன்மை பாதுகாப்பு' : 'Authenticity Defense'}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-[#173B67]">
                      {isTa ? 'விரைவு வாய்மொழி விளக்கம்: இது உங்கள் சொந்த உழைப்பு என்பதை நிரூபியுங்கள்' : 'Quick viva: prove this is your work'}
                    </h4>
                  </div>

                  {existingViva ? (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{isTa ? 'வாய்மொழி நிறைவடைந்தது' : 'Viva completed'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsVivaModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-btn bg-white border border-[#E2E8F0] text-xs font-semibold hover:bg-[#EAF5FC] text-[#173B67] transition-colors cursor-pointer"
                      >
                        {isTa ? 'விளக்கத்தை மறுபார்வை செய்' : 'Review Defense'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsVivaModalOpen(true)}
                      className="px-5 py-2.5 rounded-btn bg-[#62B6E8] hover:bg-[#4ea8dc] text-[#173B67] font-bold text-xs shadow-soft flex items-center gap-1.5 transition-transform hover:scale-105 shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#173B67]" />
                      <span>{isTa ? 'விரைவு வாய்மொழித் தேர்வைத் தொடங்கு (3 கேள்விகள்) →' : 'Start Quick Viva (3 Questions) →'}</span>
                    </button>
                  )}
                </div>

                {/* Mandated Screen Explanation */}
                <div className="p-3 rounded-card bg-[#EAF5FC] border border-[#BAE6FD] text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#62B6E8] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-[#173B67]">
                      {isTa ? 'ஏன் கேட்கிறோம்: திறன்கள் உங்களுடையதாக இருக்க வேண்டும், நகலெடுக்கப்பட்டதாக அல்ல.' : 'Why we ask: skills should be yours, not copied.'}
                    </div>
                    <div className="text-[11px] text-[#526174] mt-0.5">
                      {isTa
                        ? 'உங்கள் வடிவமைப்பு மற்றும் குறியீட்டுத் தேர்வுகள் குறித்த 3 விரைவான கேள்விகளுக்கு உரை அல்லது குரல் மூலம் பதிலளிக்கவும். முடிவுகள் உங்கள் திறன் கடவுச்சீட்டில் இணைக்கப்படும்.'
                        : 'Answer 3 rapid questions about your design and code choices by text or voice. Results are attached to your Skill Passport.'}
                    </div>
                  </div>
                </div>

                {existingViva && (
                  <div className="p-3 rounded-btn bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#173B67]">Authenticity confidence:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          existingViva.authenticityConfidence === 'Consistent'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {existingViva.authenticityConfidence}
                      </span>
                      <span className="text-[#526174]">• Average understanding: {existingViva.averageScore}%</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('passport')}
                      className="text-xs font-bold text-[#62B6E8] hover:text-[#173B67] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View in Passport</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Version 1 vs Version 2 Improvement Delta (When v2 exists) */}
              {showDeltaComparison && v1Feedback && v2Feedback && (
                <div className="p-5 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#62B6E8]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#173B67]">
                        Version 1 vs Version 2 Improvement Delta
                      </span>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                      +{v2Feedback.overall - v1Feedback.overall}% Score Delta
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-btn bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#526174]">v1 Overall</div>
                      <div className="text-base font-bold text-rose-600">{v1Feedback.overall}%</div>
                    </div>
                    <div className="p-2.5 rounded-btn bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#526174]">v2 Revised</div>
                      <div className="text-base font-bold text-emerald-600">{v2Feedback.overall}%</div>
                    </div>
                    <div className="p-2.5 rounded-btn bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#526174]">Skills Upgraded</div>
                      <div className="text-base font-bold text-[#173B67]">Strong ✓</div>
                    </div>
                    <div className="p-2.5 rounded-btn bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#526174]">Status</div>
                      <div className="text-base font-bold text-emerald-600">Verified Seal</div>
                    </div>
                  </div>
                </div>
              )}

              {badgeUnlockedId && (
                <div className="p-5 rounded-card bg-[#EAF5FC] border-2 border-[#BAE6FD] shadow-soft flex items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#62B6E8] text-[#173B67] flex items-center justify-center font-bold shadow-soft shrink-0 ring-4 ring-[#BAE6FD]">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#173B67]">
                        ⭐ Official Badge Unlocked!
                      </div>
                      <h4 className="text-sm font-extrabold text-[#173B67]">
                        {isWebProfile
                          ? 'Profile Craftsman Badge'
                          : isCommIntro
                          ? 'Professional Voice Communicator Badge'
                          : 'WCAG Accessibility Champion'}
                      </h4>
                      <p className="text-[11px] text-[#526174]">
                        Evidence backed: Authenticated with tamper-evident cryptographic hash in Skill Passport.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#173B67] text-white shrink-0">
                    Passport Updated
                  </span>
                </div>
              )}

              {/* Animated Per-Criterion Progress Bars */}
              <div className="p-6 rounded-card bg-white border border-[#E2E8F0] shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#173B67] uppercase tracking-wider">
                    Per-Criterion Rubric Breakdown
                  </h4>
                  <span className="text-[10px] text-[#526174]">Animated Score Weighting</span>
                </div>

                <div className="space-y-4">
                  {activeFeedback.criteria.map((c, idx) => {
                    const percentage = Math.round((c.score / c.max) * 100);
                    const isPassing = percentage >= 80;

                    return (
                      <div key={idx} className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#173B67]">
                            {c.name}
                          </span>
                          <span className="font-extrabold text-[#173B67]">
                            {c.score} / {c.max} ({percentage}%)
                          </span>
                        </div>

                        {/* Animated Bar */}
                        <div className="h-2.5 w-full rounded-full bg-[#EAF5FC] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.15 }}
                            className={`h-full rounded-full ${
                              isPassing
                                ? 'bg-emerald-600'
                                : percentage >= 60
                                ? 'bg-[#62B6E8]'
                                : 'bg-rose-500'
                            }`}
                          />
                        </div>

                        {/* Evidence & Fix Note */}
                        <div className="p-2.5 rounded-btn bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] space-y-1 mt-1.5">
                          <div className="text-[#526174] leading-relaxed">
                            <strong className="text-[#173B67]">Evidence detected: </strong>
                            <span>{c.evidence}</span>
                          </div>
                          <div className="text-[#62B6E8] font-medium leading-relaxed">
                            <strong>Actionable fix: </strong>
                            <span>{c.fix}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Plain-Language Fixes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-card bg-emerald-50 border border-emerald-300 text-xs space-y-2">
                  <div className="font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-emerald-900 text-[11px]">
                    {activeFeedback.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plain-Language Fixes */}
                <div className="p-4 rounded-card bg-rose-50 border border-rose-300 text-xs space-y-2">
                  <div className="font-bold text-rose-950 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Plain-Language Specific Fixes</span>
                  </div>
                  <ul className="space-y-1.5 text-rose-900 dark:text-rose-300 text-[11px]">
                    {activeFeedback.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Viva Defense Modal */}
      <QuickVivaModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
        challengeId={challenge.id}
        challengeTitle={challenge.title}
        challengeTitleTamil={challenge.titleTamil}
        pathwayId={challenge.pathwayId}
        submissionSummary={{
          projectUrl,
          screenshotUrl,
          writtenExplanation,
          audioTranscript
        }}
      />
    </div>
  );
};
