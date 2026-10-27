import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateVivaQuestions,
  scoreVivaAnswer,
  VivaQuestion,
  VivaScoreAnswerResponse
} from '../services/api';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { SpeechInputController, SpeechLang, isSpeechRecognitionSupported, speakText } from '../utils/speech';
import { TrustLabel } from './TrustLabel';
import { StatusPill } from './StatusPill';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  X,
  FileCheck2,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickVivaModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
  challengeTitle: string;
  challengeTitleTamil?: string;
  pathwayId: string;
  submissionSummary?: {
    projectUrl?: string;
    screenshotUrl?: string;
    writtenExplanation?: string;
    audioTranscript?: string;
  };
  onComplete?: (confidence: 'Consistent' | 'Needs follow-up', averageScore: number) => void;
}

interface QuestionEvaluationState {
  question: VivaQuestion;
  answer: string;
  evaluated: boolean;
  score?: number;
  note?: string;
}

export const QuickVivaModal: React.FC<QuickVivaModalProps> = ({
  isOpen,
  onClose,
  challengeId,
  challengeTitle,
  challengeTitleTamil,
  pathwayId,
  submissionSummary,
  onComplete
}) => {
  const { isOfflineDemo, recordVivaCompletion, setActiveTab } = useSkillBridgeStore();

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<VivaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Per-question state
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [evaluations, setEvaluations] = useState<Record<number, VivaScoreAnswerResponse>>({});
  const [isScoringAnswer, setIsScoringAnswer] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLang, setVoiceLang] = useState<SpeechLang>('en-IN');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const speechControllerRef = useRef<SpeechInputController | null>(null);
  const timerRef = useRef<any>(null);

  // Final summary state
  const [isFinished, setIsFinished] = useState(false);

  // Initialize Speech Controller
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      speechControllerRef.current = new SpeechInputController(
        voiceLang,
        (transcript) => {
          setAnswers((prev) => {
            const current = prev[currentQuestionIndex] || '';
            return {
              ...prev,
              [currentQuestionIndex]: current ? `${current} ${transcript}` : transcript
            };
          });
        },
        (listening) => {
          setIsRecording(listening);
          if (listening) {
            setRecordingSeconds(0);
            timerRef.current = setInterval(() => {
              setRecordingSeconds((s) => s + 1);
            }, 1000);
          } else {
            clearInterval(timerRef.current);
          }
        },
        (error) => {
          console.warn('Viva speech recognition issue:', error);
          setIsRecording(false);
          clearInterval(timerRef.current);
        }
      );
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (speechControllerRef.current) speechControllerRef.current.stop();
    };
  }, [voiceLang, currentQuestionIndex]);

  // Load Viva Questions from /api/viva on open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingQuestions(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setEvaluations({});
    setIsFinished(false);

    generateVivaQuestions(
      {
        challengeId,
        submission: submissionSummary
      },
      isOfflineDemo
    )
      .then((res) => {
        if (!isMounted) return;
        setQuestions(res.data.questions);
      })
      .catch((err) => {
        console.error('Failed to load viva questions:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingQuestions(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, challengeId]);

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex] || '';
  const currentEval = evaluations[currentQuestionIndex];

  const handleToggleVoice = () => {
    if (!speechControllerRef.current) {
      alert('Voice recording uses the Web Speech API (best experienced in Chrome). You can type or use the test fill buttons.');
      return;
    }
    speechControllerRef.current.toggle();
  };

  const handleScoreCurrentAnswer = async () => {
    if (!currentQ || !currentAnswer.trim()) return;

    setIsScoringAnswer(true);
    try {
      const res = await scoreVivaAnswer(
        {
          challengeId,
          questionId: currentQ.id,
          questionText: currentQ.question,
          answer: currentAnswer,
          language: voiceLang
        },
        isOfflineDemo
      );

      setEvaluations((prev) => ({
        ...prev,
        [currentQuestionIndex]: res.data
      }));
    } catch (err) {
      console.error('Failed to score viva answer:', err);
    } finally {
      setIsScoringAnswer(false);
    }
  };

  const handleNextOrFinish = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate overall confidence
      const scores = Object.values(evaluations).map((e) => e.score);
      const total = scores.reduce((sum, s) => sum + s, 0);
      const avg = Math.round(total / (scores.length || 1));
      const confidence: 'Consistent' | 'Needs follow-up' = avg >= 75 ? 'Consistent' : 'Needs follow-up';

      // Attach result to the evidence in the passport as "Viva completed"
      const vivaRecord = {
        challengeId,
        challengeTitle,
        pathwayId,
        vivaStatus: 'Viva completed' as const,
        authenticityConfidence: confidence,
        averageScore: avg,
        completedAt: 'Just now',
        qa: questions.map((q, idx) => ({
          question: q.question,
          questionTamil: q.questionTamil,
          answer: answers[idx] || 'No answer submitted',
          score: evaluations[idx]?.score || 60,
          note: evaluations[idx]?.note || 'Baseline review completed.'
        }))
      };

      recordVivaCompletion(vivaRecord);
      setIsFinished(true);

      if (confidence === 'Consistent') {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
        });
      }

      if (onComplete) {
        onComplete(confidence, avg);
      }
    }
  };

  const handleQuickFillAuthentic = () => {
    if (!currentQ) return;
    let sample = '';
    if (challengeId.includes('comm')) {
      if (currentQuestionIndex === 0) {
        sample = 'Citing 92% rubric proof gives verifiable data points instead of vague claims. Recruiters can independently inspect my accessibility score.';
      } else if (currentQuestionIndex === 1) {
        sample = 'I spent 5s on greeting, 20s explaining my validated CSS & React proof, and 15s on an actionable apprenticeship closing ask.';
      } else {
        sample = "Starting with 'வணக்கம்' builds immediate cultural respect and shows pride in Tamil heritage while connecting with local Chennai engineering teams.";
      }
    } else if (challengeId.includes('tailor')) {
      if (currentQuestionIndex === 0) {
        sample = 'I added 1.5 inches of ease to allow freedom of arm movement while maintaining a clean fitted silhouette on the blouse.';
      } else if (currentQuestionIndex === 1) {
        sample = 'I calibrated bobbin thread tension with a test scrap until the top and bottom interlocking loops met precisely in the fabric core at 10 SPI.';
      } else {
        sample = 'A true 45-degree bias grain provides maximum elastic recovery and prevents puckering along the curved neck seam.';
      }
    } else {
      // Web Profile
      if (currentQuestionIndex === 0) {
        sample = 'I chose flexbox for the header because navigation items are a one-dimensional row. Grid would introduce unnecessary 2D track overhead.';
      } else if (currentQuestionIndex === 1) {
        sample = 'I eliminated rigid min-width values and combined fluid clamp(12px, 3vw, 24px) padding with flex: 1 1 280px and min-width: 0 on the card.';
      } else {
        sample = 'The skip-link allows keyboard users and screen readers to bypass repetitive navigation links directly into main content with a visible 3px focus ring.';
      }
    }
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: sample }));
  };

  const handleQuickFillVague = () => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: 'I just followed a tutorial online and copied what seemed to work. I dunno the exact CSS details.'
    }));
  };

  const handleSpeakQuestion = () => {
    if (!currentQ) return;
    const textToSpeak = voiceLang === 'ta-IN' && currentQ.questionTamil ? currentQ.questionTamil : currentQ.question;
    speakText(textToSpeak, voiceLang === 'ta-IN' ? 'ta' : 'en');
  };

  // Compute overall score for summary
  const scores = Object.values(evaluations).map((e) => e.score);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const overallConfidence: 'Consistent' | 'Needs follow-up' = avgScore >= 75 ? 'Consistent' : 'Needs follow-up';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white dark:bg-night-card rounded-card border border-sky-100 dark:border-night-border shadow-soft overflow-hidden my-6"
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-[#E2E8F0] dark:border-night-border/80 flex items-start justify-between gap-4 bg-[#F8FAFC] dark:bg-night-100/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF5FC] dark:bg-sky-950/70 border border-[#BAE6FD] text-[#173B67] dark:text-sky-200 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#62B6E8]" />
              <span>Authenticity Defense</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#173B67] dark:text-white">
              Quick viva: prove this is your work
            </h2>
            <div className="font-tamil text-xs text-[#526174] dark:text-night-muted mt-0.5">
              விரைவு வாய்மொழி விளக்கம்: இது உங்கள் சொந்த உழைப்பு என்பதை நிரூபியுங்கள்
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-btn hover:bg-[#EAF5FC] dark:hover:bg-night-200 text-[#526174] hover:text-[#173B67] transition-colors cursor-pointer"
            aria-label="Close viva modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandated Screen Explanation: "Why we ask: skills should be yours, not copied." */}
        <div className="px-5 py-3 bg-[#EAF5FC] dark:bg-sky-950/40 border-b border-[#BAE6FD] dark:border-sky-800/60 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#62B6E8] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-extrabold text-[#173B67] dark:text-sky-200">
              Why we ask: skills should be yours, not copied.
            </span>
            <div className="font-tamil text-[11px] text-[#173B67]/90 dark:text-sky-300 font-medium">
              ஏன் கேட்கிறோம்: திறன்கள் உங்களுடையதாக இருக்க வேண்டும், நகலெடுக்கப்பட்டதாக அல்ல.
            </div>
            <div className="text-[#526174] dark:text-night-muted text-[11px] mt-0.5">
              No intrusive webcams or surveillance. We simply ask 3 quick questions about the specific trade-offs in your submitted code so employers can trust your authentic understanding.
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {isLoadingQuestions ? (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block w-8 h-8 border-3 border-[#62B6E8] border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-bold text-[#173B67] dark:text-white">
                Inspecting your submission code & generating 3 viva questions...
              </div>
              <div className="text-xs text-[#526174]">Calling /api/viva with project evidence</div>
            </div>
          ) : isFinished ? (
            /* FINAL COMPLETED RESULT VIEW */
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 mx-auto rounded-card bg-[#EAF5FC] dark:bg-sky-950/80 border border-[#BAE6FD] flex items-center justify-center text-[#173B67] dark:text-sky-300 shadow-soft">
                <FileCheck2 className="w-8 h-8" />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#526174]">
                  Defense Evaluation Complete
                </div>
                <h3 className="text-2xl font-bold text-[#173B67] dark:text-white mt-1">
                  Viva Completed & Attached to Passport
                </h3>
                <div className="font-tamil text-xs text-[#526174] mt-0.5">
                  வாய்மொழித் தேர்வு முடிந்தது · திறன் கடவுச்சீட்டில் இணைக்கப்பட்டது
                </div>
              </div>

              {/* Authenticity Confidence Indicator (NEVER CHEATER) */}
              <div
                className={`p-5 rounded-card border text-left shadow-soft ${
                  overallConfidence === 'Consistent'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-600'
                    : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-600'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {overallConfidence === 'Consistent' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    )}
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#526174]">
                      Authenticity Confidence Indicator
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-btn text-xs font-bold shadow-xs ${
                      overallConfidence === 'Consistent'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    Authenticity confidence: {overallConfidence}
                  </span>
                </div>

                <div className="text-sm font-bold text-[#173B67] dark:text-white">
                  {overallConfidence === 'Consistent'
                    ? 'Consistent: Your explanations directly align with the submitted implementation.'
                    : 'Needs follow-up: Some technical trade-offs were brief. A mentor check-in is recommended.'}
                </div>

                <div className="font-tamil text-xs text-[#526174] mt-0.5">
                  {overallConfidence === 'Consistent'
                    ? 'தங்களின் விளக்கங்கள் சமர்ப்பிக்கப்பட்ட படைப்புடன் முழுமையாகப் பொருந்துகின்றன.'
                    : 'விளக்கங்கள் சுருக்கமாக உள்ளன. வழிகாட்டியுடன் கூடுதல் உரையாடல் பரிந்துரைக்கப்படுகிறது.'}
                </div>

                <div className="mt-3 pt-3 border-t border-[#E2E8F0] dark:border-night-border/60 flex items-center justify-between text-xs text-[#526174]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Status in Passport:</span>
                    <span className="px-2 py-0.5 rounded-btn bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[11px]">
                      Viva completed
                    </span>
                  </div>
                  <div>Average Understanding: <span className="font-bold">{avgScore}%</span></div>
                </div>
              </div>

              {/* Question-by-Question Recap */}
              <div className="space-y-2 text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-[#526174]">
                  Evaluated Answers Summary ({questions.length} questions)
                </div>
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-card bg-[#F8FAFC] dark:bg-night-100/60 border border-[#E2E8F0] dark:border-night-border text-xs space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2 font-bold text-[#173B67] dark:text-night-ink">
                      <span>Q{idx + 1}: {q.question}</span>
                      <span className="text-[#173B67] dark:text-sky-300 font-bold shrink-0">
                        {evaluations[idx]?.score}%
                      </span>
                    </div>
                    <div className="text-[#526174] italic">"{answers[idx]}"</div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      ✓ {evaluations[idx]?.note}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveTab('passport');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-btn bg-[#62B6E8] hover:bg-[#4fa8dc] text-[#173B67] font-bold text-xs shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
                >
                  <FileCheck2 className="w-4 h-4 text-[#173B67]" />
                  <span>View in Verified Skill Passport →</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-btn bg-white dark:bg-night-100 border border-[#E2E8F0] text-[#173B67] dark:text-night-ink font-semibold text-xs hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Close & Return to Workspace
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE QUESTION VIEW */
            currentQ && (
              <div className="space-y-4">
                {/* Step indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentQuestionIndex
                            ? 'w-8 bg-[#62B6E8]'
                            : idx < currentQuestionIndex
                            ? 'w-4 bg-emerald-600'
                            : 'w-4 bg-slate-200 dark:bg-night-100'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-bold text-[#526174]">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>

                {/* Question Box */}
                <div className="p-4 sm:p-5 rounded-card bg-[#EAF5FC] dark:bg-night-100/80 border border-[#BAE6FD] dark:border-night-border shadow-soft space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#173B67] dark:text-white leading-snug">
                        {currentQ.question}
                      </h4>
                      {currentQ.questionTamil && (
                        <div className="font-tamil text-xs text-[#173B67]/90 dark:text-sky-300 mt-1">
                          {currentQ.questionTamil}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSpeakQuestion}
                      title="Listen in Tamil or English"
                      className="p-2 rounded-btn bg-white hover:bg-slate-50 text-[#173B67] border border-[#BAE6FD] transition-colors shrink-0 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {currentQ.context && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white dark:bg-night-100/60 border border-[#BAE6FD] text-[10px] font-semibold text-[#526174]">
                      <span>Focus:</span>
                      <span>{currentQ.context}</span>
                    </div>
                  )}
                </div>

                {/* Answer Area: Text or Voice */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-[#173B67] dark:text-white">
                      Your Explanation (Text or Spoken Voice)
                    </label>

                    {/* Language Switcher for Voice */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[#526174]">Voice:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setVoiceLang('en-IN');
                          if (speechControllerRef.current) speechControllerRef.current.setLang('en-IN');
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          voiceLang === 'en-IN'
                            ? 'bg-[#173B67] text-white'
                            : 'bg-slate-100 dark:bg-night-100 text-[#526174]'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVoiceLang('ta-IN');
                          if (speechControllerRef.current) speechControllerRef.current.setLang('ta-IN');
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-tamil cursor-pointer transition-colors ${
                          voiceLang === 'ta-IN'
                            ? 'bg-[#173B67] text-white'
                            : 'bg-slate-100 dark:bg-night-100 text-[#526174]'
                        }`}
                      >
                        தமிழ்
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      rows={3}
                      value={currentAnswer}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQuestionIndex]: e.target.value
                        }))
                      }
                      placeholder={
                        voiceLang === 'ta-IN'
                          ? 'உங்கள் விளக்கத்தை இங்கே தட்டச்சு செய்யவும் அல்லது கீழே உள்ள மைக்ரோஃபோனை அழுத்திப் பேசவும்...'
                          : 'Explain the reason for this decision in your own words, or click the mic below to speak...'
                      }
                      className="w-full p-3.5 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border text-xs text-[#173B67] dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-[#62B6E8] transition-all font-mono"
                    />

                    {/* Live recording indicator banner */}
                    {isRecording && (
                      <div className="absolute top-2 right-2 flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>Listening ({recordingSeconds}s)...</span>
                      </div>
                    )}
                  </div>

                  {/* Mic and Fast Test Helpers */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`px-3.5 py-1.5 rounded-btn text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isRecording
                          ? 'bg-rose-700 text-white shadow-soft scale-105'
                          : 'bg-[#EAF5FC] dark:bg-night-100 hover:bg-[#d8eefc] text-[#173B67] dark:text-night-ink border border-[#BAE6FD]'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#173B67]" />}
                      <span>{isRecording ? 'Stop Recording' : 'Speak Answer (Tamil/English)'}</span>
                    </button>

                    {/* Rapid Evaluator Testing Buttons */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={handleQuickFillAuthentic}
                        className="px-2.5 py-1 rounded-btn bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300/60 cursor-pointer"
                        title="Simulate high-understanding authentic learner response"
                      >
                        ✨ Authentic Answer
                      </button>
                      <button
                        type="button"
                        onClick={handleQuickFillVague}
                        className="px-2.5 py-1 rounded-btn bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300/60 cursor-pointer"
                        title="Simulate vague response triggering 'Needs follow-up'"
                      >
                        ⚡ Vague Answer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Answer Feedback / Score Display (Once scored) */}
                {currentEval && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-card border text-xs space-y-1 ${
                      currentEval.score >= 75
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700'
                        : 'bg-amber-50/90 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Understanding Score: {currentEval.score}%</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#526174]">
                        Evaluated via /api/viva
                      </span>
                    </div>
                    <p className="text-[#173B67] dark:text-night-ink text-[11px]">
                      {currentEval.note}
                    </p>
                  </motion.div>
                )}

                {/* Bottom Buttons */}
                <div className="pt-3 border-t border-[#E2E8F0] dark:border-night-border flex items-center justify-between">
                  <div className="text-[11px] text-[#526174]">
                    {currentQuestionIndex + 1} of {questions.length} completed
                  </div>

                  {!currentEval ? (
                    <button
                      type="button"
                      disabled={!currentAnswer.trim() || isScoringAnswer}
                      onClick={handleScoreCurrentAnswer}
                      className="px-5 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#4fa8dc] disabled:opacity-50 text-[#173B67] font-bold text-xs shadow-soft flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                    >
                      {isScoringAnswer ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-[#173B67] border-t-transparent rounded-full animate-spin" />
                          <span>Scoring Understanding...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#173B67]" />
                          <span>Submit Answer to /api/viva</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextOrFinish}
                      className="px-5 py-2 rounded-btn bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-xs shadow-soft flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                    >
                      <span>
                        {currentQuestionIndex < questions.length - 1
                          ? 'Next Question →'
                          : 'View Authenticity Confidence →'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};
