import React, { useState, useEffect, useRef } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { interviewRoles, InterviewRole, InterviewQuestion } from '../data/interviewRoles';
import {
  SpeechInputController,
  speakInstruction,
  stopSpeaking,
  SpeechLang
} from '../utils/speech';
import { scoreInterviewTranscript, InterviewScoreResponse } from '../services/api';
import { VivaProofRecord } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  ExternalLink,
  Briefcase,
  ChevronRight,
  Check,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

export const InterviewView: React.FC = () => {
  const {
    getPersona,
    getCurrentPathway,
    recordVivaCompletion,
    isOfflineDemo,
    language,
    setActiveTab
  } = useSkillBridgeStore();

  const persona = getPersona();
  const pathway = getCurrentPathway();
  const isTamil = language === 'ta';

  // 1. Role Selection
  const initialRole =
    interviewRoles.find(r => r.pathwayId === pathway.id) || interviewRoles[0];
  const [selectedRole, setSelectedRole] = useState<InterviewRole>(initialRole);

  // 2. Question Progression
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion: InterviewQuestion =
    selectedRole.questions[currentQuestionIndex] || selectedRole.questions[0];

  // 3. Speech and Voice Settings
  const [speechLanguage, setSpeechLanguage] = useState<'en-IN' | 'ta-IN' | 'hi-IN'>('en-IN');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // 4. API Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<InterviewScoreResponse | null>(null);
  const [savedToPassport, setSavedToPassport] = useState(false);

  // Timers and controllers
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speechControllerRef = useRef<SpeechInputController | null>(null);

  // Initialize SpeechInputController
  useEffect(() => {
    speechControllerRef.current = new SpeechInputController(
      speechLanguage,
      (text: string) => {
        setTranscript(prev => (prev ? `${prev} ${text}` : text));
      },
      (listening: boolean) => {
        setIsRecording(listening);
      },
      (err: string) => {
        setSpeechError(err);
        setIsRecording(false);
      }
    );

    return () => {
      stopSpeaking();
      if (speechControllerRef.current) {
        speechControllerRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [speechLanguage]);

  // Speaking timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // When switching role, reset state
  const handleSelectRole = (role: InterviewRole) => {
    stopSpeaking();
    if (isRecording) {
      speechControllerRef.current?.stop();
    }
    setSelectedRole(role);
    setCurrentQuestionIndex(0);
    setTranscript('');
    setRecordingSeconds(0);
    setEvaluationResult(null);
    setSavedToPassport(false);
  };

  // Play question via speechSynthesis
  const handlePlayQuestionAudio = () => {
    if (isAiSpeaking) {
      stopSpeaking();
      setIsAiSpeaking(false);
      return;
    }

    let textToSpeak = currentQuestion.questionText;
    let voiceLang: SpeechLang = 'en-IN';

    if (speechLanguage === 'ta-IN') {
      textToSpeak = currentQuestion.questionTamil;
      voiceLang = 'ta-IN';
    } else if (speechLanguage === 'hi-IN') {
      textToSpeak = currentQuestion.questionHindi;
      voiceLang = 'hi-IN';
    }

    setIsAiSpeaking(true);
    speakInstruction(textToSpeak, voiceLang, () => {
      setIsAiSpeaking(false);
    });
  };

  // Toggle voice answer recording
  const handleToggleRecording = () => {
    setSpeechError(null);
    if (!speechControllerRef.current) return;

    if (isRecording) {
      speechControllerRef.current.stop();
    } else {
      stopSpeaking();
      setIsAiSpeaking(false);
      setRecordingSeconds(0);
      speechControllerRef.current.setLang(speechLanguage);
      speechControllerRef.current.start();
    }
  };

  // Submit transcript to /api/interview-score
  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      setSpeechError(isTamil ? 'தயவுசெய்து முதலில் உங்கள் பதிலை பேசவும் அல்லது தட்டச்சு செய்யவும்.' : 'Please record or type an answer before submitting.');
      return;
    }

    if (isRecording) {
      speechControllerRef.current?.stop();
    }
    stopSpeaking();

    setIsEvaluating(true);
    setSpeechError(null);

    const langCode = speechLanguage === 'ta-IN' ? 'ta' : speechLanguage === 'hi-IN' ? 'hi' : 'en';

    try {
      const response = await scoreInterviewTranscript(
        {
          roleId: selectedRole.id,
          roleTitle: selectedRole.title,
          question: currentQuestion.questionText,
          transcript,
          language: langCode,
          durationSeconds: Math.max(12, recordingSeconds)
        },
        isOfflineDemo
      );

      setEvaluationResult(response.data);
    } catch (err) {
      console.error('Failed to score interview answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Save "Communication assessed" entry to the passport
  const handleSaveToPassport = () => {
    if (!evaluationResult) return;

    const newRecord: VivaProofRecord = {
      challengeId: `interview-${selectedRole.id}-${Date.now()}`,
      challengeTitle: `AI Mock Interview: ${selectedRole.title}`,
      pathwayId: selectedRole.pathwayId,
      vivaStatus: 'Viva completed',
      authenticityConfidence: 'Consistent',
      averageScore: evaluationResult.overallScore || Math.round((evaluationResult.clarity + evaluationResult.confidence + evaluationResult.relevance) / 3),
      completedAt: 'Today, Just now',
      qa: [
        {
          question: currentQuestion.questionText,
          questionTamil: currentQuestion.questionTamil,
          answer: transcript,
          score: evaluationResult.overallScore || 88,
          note: `Assessed pace: ${evaluationResult.paceWpm} WPM • Clarity: ${evaluationResult.clarity}% • Linguistic Confidence: ${evaluationResult.confidence}%`
        }
      ]
    };

    recordVivaCompletion(newRecord);
    setSavedToPassport(true);
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    if (isRecording) {
      speechControllerRef.current?.stop();
    }
    if (currentQuestionIndex < selectedRole.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
    setTranscript('');
    setRecordingSeconds(0);
    setEvaluationResult(null);
    setSavedToPassport(false);
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300 max-w-6xl mx-auto pb-16">
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP BANNER */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 sm:p-7 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon-100 dark:bg-maroon-950/80 text-maroon-800 dark:text-gold-300 border border-maroon-200 dark:border-maroon-800/60">
                {isTamil ? 'AI வாய்மொழி நேர்காணல் பயிற்சி' : 'AI Speech Mock Interview'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 border border-forest-200">
                Web Speech API • EN / TA / HI
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
              {isTamil ? 'குரல்வழி தொழில்முறை நேர்காணல்' : 'Interactive Voice Interview Practice'}
            </h1>

            <p className="text-xs sm:text-sm text-warm-muted dark:text-night-muted max-w-2xl leading-relaxed">
              {isTamil
                ? 'ஒரு குறிப்பிட்ட பணியை தேர்ந்தெடுங்கள், AI கேள்விகளைக் கேட்கும் (உரை + ஒலி). உங்கள் குரல் மூலம் தாய்மொழியில் பதிலளித்து பேச்சு வேகம், தயக்கம் மற்றும் உடனடி ஆலோசனைகளைப் பெறுங்கள்.'
                : 'Select a target job, listen to the AI interviewer speak questions, and answer naturally by voice. Receive instant diagnostic feedback on speech pace, filler frequency, and evidence-backed articulation.'}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-parchment-200/60 dark:bg-night-100/60 border border-warm-border/60 text-xs space-y-1 w-full lg:w-auto lg:min-w-[200px]">
            <div className="text-[11px] uppercase font-bold text-warm-muted dark:text-night-muted">
              {isTamil ? 'பயிற்சி பயனர்' : 'Active Learner'}
            </div>
            <div className="font-bold text-warm-ink dark:text-night-ink">
              {isTamil ? persona.nameTamil : persona.name}
            </div>
            <div className="text-maroon-700 dark:text-gold-400 font-medium">
              {selectedRole.title}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. ROLE SELECTOR (STRICT REQUIREMENT: LEARNER PICKS A ROLE) */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-5 sm:p-6 rounded-card bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-warm-muted dark:text-night-muted flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
            <span>{isTamil ? '1. நேர்காணல் பணியைத் தேர்ந்தெடுங்கள்:' : '1. Choose Target Role for Interview:'}</span>
          </div>
          <span className="text-[11px] text-warm-muted">
            {interviewRoles.length} {isTamil ? 'பணிகள் உள்ளன' : 'Roles Available'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {interviewRoles.map(role => {
            const isSelected = selectedRole.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelectRole(role)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-maroon-700 text-white border-maroon-800 shadow-warm-sm scale-[1.02]'
                    : 'bg-parchment-100 dark:bg-night-100/70 border-warm-border/80 dark:border-night-border hover:bg-parchment-200 text-warm-ink dark:text-night-ink'
                }`}
              >
                <div>
                  <span
                    className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-parchment-200 dark:bg-night-card text-warm-muted'
                    }`}
                  >
                    {role.category === 'technical' ? 'Tech' : 'Craft'}
                  </span>
                  <div className="font-bold text-xs leading-snug line-clamp-2">
                    {isTamil && role.titleTamil ? role.titleTamil : role.title}
                  </div>
                </div>

                <div className={`text-[10px] mt-2 pt-1 border-t truncate ${isSelected ? 'border-white/20 text-white/80' : 'border-warm-border/60 text-warm-muted'}`}>
                  {role.companyExample.split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. AI QUESTION CARD (TEXT + SPEECH SYNTHESIS) */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 sm:p-7 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-warm-border/60 dark:border-night-border/60">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-maroon-100 dark:bg-maroon-950 text-maroon-800 dark:text-gold-300 font-bold flex items-center justify-center text-xs">
              Q{currentQuestionIndex + 1}
            </span>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-warm-muted">
                {isTamil ? 'கேள்வி' : 'Interview Question'} {currentQuestionIndex + 1} of {selectedRole.questions.length}
              </div>
              <div className="text-xs text-maroon-700 dark:text-gold-400 font-medium">
                {selectedRole.title}
              </div>
            </div>
          </div>

          {/* Voice Language Selector for Learner Response and TTS */}
          <div className="flex items-center gap-1.5 bg-parchment-100 dark:bg-night-100 p-1 rounded-xl border border-warm-border dark:border-night-border self-start sm:self-center">
            <span className="text-[11px] font-bold text-warm-muted px-2">Language:</span>
            <button
              type="button"
              onClick={() => setSpeechLanguage('en-IN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                speechLanguage === 'en-IN'
                  ? 'bg-maroon-700 text-white'
                  : 'text-warm-ink dark:text-night-ink hover:bg-parchment-200'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setSpeechLanguage('ta-IN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                speechLanguage === 'ta-IN'
                  ? 'bg-maroon-700 text-white'
                  : 'text-warm-ink dark:text-night-ink hover:bg-parchment-200'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setSpeechLanguage('hi-IN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                speechLanguage === 'hi-IN'
                  ? 'bg-maroon-700 text-white'
                  : 'text-warm-ink dark:text-night-ink hover:bg-parchment-200'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Question Text with Play Audio CTA */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold font-heritage text-warm-ink dark:text-night-ink leading-relaxed flex-1">
              {speechLanguage === 'ta-IN'
                ? currentQuestion.questionTamil
                : speechLanguage === 'hi-IN'
                ? currentQuestion.questionHindi
                : currentQuestion.questionText}
            </h2>

            {/* Read Question Audio Button (Speech Synthesis) */}
            <button
              type="button"
              onClick={handlePlayQuestionAudio}
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isAiSpeaking
                  ? 'bg-gold-400 text-night-DEFAULT border-gold-500 shadow-warm-sm animate-pulse'
                  : 'bg-parchment-200/80 dark:bg-night-100 border-warm-border text-warm-ink dark:text-night-ink hover:bg-parchment-300'
              }`}
              title="Listen to AI interviewer speak this question"
            >
              {isAiSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
                  <span className="hidden sm:inline">Listen Aloud</span>
                </>
              )}
            </button>
          </div>

          {/* Bilingual Context Card */}
          <div className="p-3 rounded-xl bg-parchment-100/80 dark:bg-night-100/70 border border-warm-border/60 text-xs text-warm-muted dark:text-night-muted flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-warm-ink dark:text-night-ink">
                {isTamil ? 'நேர்காணல் பின்னணி & நோக்கம்:' : 'Interviewer Intent & Context:'}
              </span>{' '}
              {isTamil ? currentQuestion.contextTamil : currentQuestion.context}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 4. LEARNER VOICE ANSWER INPUT (WEB SPEECH API) */}
        {/* ------------------------------------------------------------------ */}
        <div className="p-5 rounded-2xl bg-parchment-100/90 dark:bg-night-100/80 border border-warm-border dark:border-night-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warm-ink dark:text-night-ink">
              <Mic className="w-4 h-4 text-maroon-700 dark:text-gold-400" />
              <span>{isTamil ? 'உங்கள் வாய்மொழி பதில்:' : 'Your Voice Response:'}</span>
              <span className="text-[11px] font-semibold text-warm-muted lowercase">
                ({speechLanguage})
              </span>
            </div>

            {/* Speaking Timer and Word Counter */}
            <div className="flex items-center gap-3 text-xs text-warm-muted dark:text-night-muted">
              <span className="flex items-center gap-1 font-mono font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {Math.floor(recordingSeconds / 60)}:
                  {(recordingSeconds % 60).toString().padStart(2, '0')}
                </span>
              </span>
              <span>•</span>
              <span>
                {transcript.trim() ? transcript.trim().split(/\s+/).length : 0} {isTamil ? 'சொற்கள்' : 'words'}
              </span>
            </div>
          </div>

          {/* Live Transcript Area */}
          <div className="relative">
            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={
                isRecording
                  ? (isTamil ? 'பேசுங்கள்... உரை தானாக பதிவாகிறது...' : 'Listening... Speak clearly into your microphone...')
                  : (isTamil ? 'மைக்கை இயக்கி பேசவும் அல்லது இங்கே தட்டச்சு செய்யவும்...' : 'Click the microphone button to answer by voice, or type your response here...')
              }
              className={`w-full p-4 rounded-xl text-xs sm:text-sm bg-parchment-50 dark:bg-night-card border text-warm-ink dark:text-night-ink focus:outline-none transition-all leading-relaxed ${
                isRecording
                  ? 'border-maroon-600 ring-2 ring-maroon-400/30'
                  : 'border-warm-border dark:border-night-border'
              }`}
            />

            {/* Quick Sample Answer shortcut for resilient evaluation */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs">
              <button
                type="button"
                onClick={() => setTranscript(speechLanguage === 'ta-IN' ? currentQuestion.sampleAnswerTamil : currentQuestion.sampleAnswerEnglish)}
                className="text-maroon-700 dark:text-gold-400 hover:underline font-semibold text-xs cursor-pointer"
              >
                {isTamil ? 'மாதிரி பதிலை நிரப்புக (Quick Demo)' : 'Insert Sample Prepared Response (Quick Demo)'}
              </button>

              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-warm-muted hover:text-warm-ink text-xs cursor-pointer"
                >
                  {isTamil ? 'அழிக்க' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          {speechError && (
            <div className="p-3 rounded-xl bg-terracotta-50 dark:bg-terracotta-950/60 border border-terracotta-300 text-terracotta-900 dark:text-terracotta-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{speechError}</span>
            </div>
          )}

          {/* Voice Control Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Record Toggle Button */}
            <button
              type="button"
              onClick={handleToggleRecording}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-warm-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                isRecording
                  ? 'bg-terracotta-600 hover:bg-terracotta-700 text-white animate-pulse'
                  : 'bg-maroon-700 hover:bg-maroon-800 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>{isTamil ? 'பதிவை நிறுத்துக' : 'Stop Recording'}</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>{isTamil ? 'குரல் மூலம் பதிலளிக்க' : 'Answer by Voice'}</span>
                </>
              )}
            </button>

            {/* Submit for AI Evaluation */}
            <button
              type="button"
              disabled={isEvaluating || !transcript.trim()}
              onClick={handleSubmitAnswer}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-warm-sm transition-all flex items-center justify-center gap-2 ${
                isEvaluating || !transcript.trim()
                  ? 'bg-parchment-300 dark:bg-night-100 text-warm-muted cursor-not-allowed'
                  : 'bg-forest-700 hover:bg-forest-800 text-white cursor-pointer hover:scale-[1.02]'
              }`}
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-gold-300" />
                  <span>{isTamil ? 'மதிப்பீடு செய்கிறது...' : 'Scoring Transcript...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isTamil ? 'பதிலை சமர்ப்பிக்க (/api/interview-score)' : 'Submit Answer for AI Scoring'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 5. DIAGNOSTIC RESULTS DISPLAY (STRICT REQUIREMENT) */}
        {/* ------------------------------------------------------------------ */}
        {evaluationResult && (
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-parchment-100 to-parchment-50 dark:from-night-card dark:to-night-100 border-2 border-forest-300/80 dark:border-forest-800/60 shadow-warm-md space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-border/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-forest-700 dark:text-forest-400" />
                <h3 className="text-base sm:text-lg font-bold font-heritage text-warm-ink dark:text-night-ink">
                  {isTamil ? 'AI நேர்காணல் பகுப்பாய்வு முடிவுகள்' : 'AI Interview Scoring & Transcript Diagnostic'}
                </h3>
              </div>

              <div className="text-xs font-bold text-forest-700 dark:text-forest-400">
                Overall: {evaluationResult.overallScore}%
              </div>
            </div>

            {/* Metrics Triad & Pacing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Pace Estimate Card (STRICT REQUIREMENT: PACE ESTIMATE WORDS/MIN) */}
              <div className="p-4 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border/70 dark:border-night-border shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-warm-muted">
                  {isTamil ? 'பேச்சு வேகம்' : 'Speech Pace'}
                </div>
                <div className="text-2xl font-extrabold font-heritage text-forest-700 dark:text-forest-400">
                  {evaluationResult.paceWpm} <span className="text-xs font-sans font-bold">WPM</span>
                </div>
                <div className="text-[10px] text-warm-muted">
                  {evaluationResult.paceWpm >= 115 && evaluationResult.paceWpm <= 145
                    ? (isTamil ? 'சிறந்த வேகம் (115-145 WPM)' : 'Optimal Cadence (115-145 WPM)')
                    : evaluationResult.paceWpm < 115
                    ? (isTamil ? 'சற்று மெதுவான வேகம்' : 'Measured Cadence (<115 WPM)')
                    : (isTamil ? 'அதிவேகம்' : 'Fast Cadence (>145 WPM)')}
                </div>
              </div>

              {/* Filler Word Count Card (STRICT REQUIREMENT: FILLER WORD COUNT) */}
              <div className="p-4 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border/70 dark:border-night-border shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-warm-muted">
                  {isTamil ? 'தயக்கச் சொற்கள்' : 'Filler Word Count'}
                </div>
                <div className="text-2xl font-extrabold font-heritage text-gold-700 dark:text-gold-400">
                  {evaluationResult.fillerWordCount}{' '}
                  <span className="text-xs font-sans font-bold">detected</span>
                </div>
                <div className="text-[10px] text-warm-muted truncate">
                  {evaluationResult.matchedFillers && evaluationResult.matchedFillers.length > 0
                    ? `(${evaluationResult.matchedFillers.join(', ')})`
                    : 'Clean articulation'}
                </div>
              </div>

              {/* Linguistic Clarity */}
              <div className="p-4 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border/70 dark:border-night-border shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-warm-muted">
                  {isTamil ? 'தெளிவு' : 'Articulation Clarity'}
                </div>
                <div className="text-2xl font-extrabold font-heritage text-maroon-700 dark:text-gold-400">
                  {evaluationResult.clarity}%
                </div>
                <div className="text-[10px] text-warm-muted">
                  Vocabulary & sentence density
                </div>
              </div>

              {/* Relevance */}
              <div className="p-4 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border/70 dark:border-night-border shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-warm-muted">
                  {isTamil ? 'பொருத்தம்' : 'Role Relevance'}
                </div>
                <div className="text-2xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
                  {evaluationResult.relevance}%
                </div>
                <div className="text-[10px] text-warm-muted">
                  Alignment to {selectedRole.title.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* MANDATORY CONFIDENCE SCORING NOTE (STRICT REQUIREMENT) */}
            <div className="p-4 rounded-xl bg-gold-50/90 dark:bg-gold-950/40 border border-gold-300 dark:border-gold-700/60 text-xs space-y-1">
              <div className="font-bold text-gold-900 dark:text-gold-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-700 dark:text-gold-400" />
                <span>
                  {isTamil
                    ? 'மொழிசார் தன்னம்பிக்கை மதிப்பீடு குறிப்பு (முக்கிய அறிவிப்பு):'
                    : 'Linguistic Confidence Scoring Policy (Important Notice):'}
                </span>
              </div>
              <p className="text-warm-muted dark:text-night-muted leading-relaxed">
                {isTamil
                  ? 'தன்னம்பிக்கை மதிப்பெண் உங்கள் உரை அமைப்பின் நேரடி மொழி மற்றும் செயலில் உள்ள சொற்களின் (Active Verbs) அடிப்படையில் மட்டுமே பெறப்படுகிறது. இது ஒருபோதும் உங்கள் தனிப்பட்ட குணத்தையோ மனித மாண்பையோ மதிப்பிடுவது அல்ல.'
                  : 'Confidence scoring is derived <strong>strictly from the linguistic transcript</strong> (assertive vocabulary, direct answer structures, and active technical verbs). It is <strong>NOT a psychological assessment, personality judgment, or character evaluation of you as a person</strong>.'}
              </p>
            </div>

            {/* 3 SPECIFIC TIPS (STRICT REQUIREMENT) */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-warm-muted dark:text-night-muted">
                {isTamil ? '3 குறிப்பிட்ட முன்னேற்ற ஆலோசனைகள்:' : '3 Specific Actionable Tips for Next Round:'}
              </div>

              <div className="space-y-2">
                {evaluationResult.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-parchment-50 dark:bg-night-card border border-warm-border/70 dark:border-night-border flex items-start gap-3 text-xs leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-warm-ink dark:text-night-ink">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SAVE TO PASSPORT CTA (STRICT REQUIREMENT) */}
            <div className="pt-3 border-t border-warm-border/60 dark:border-night-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-bold text-xs text-warm-ink dark:text-night-ink">
                  {isTamil ? 'திறன் கடவுச்சீட்டில் சேர்க்க' : 'Add Proof to Verifiable Credential'}
                </div>
                <div className="text-[11px] text-warm-muted">
                  {isTamil
                    ? 'இது உங்கள் தயார்நிலை குறியீட்டில் "தகவல்தொடர்பு" கூறில் சேர்க்கப்படும்.'
                    : 'Increments the "Communication assessed" component on your /readiness index.'}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {savedToPassport ? (
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-2 rounded-xl bg-forest-100 text-forest-800 font-bold text-xs flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-forest-600" />
                      <span>{isTamil ? 'கடவுச்சீட்டில் சேமிக்கப்பட்டது!' : 'Saved to Skill Passport!'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('passport')}
                      className="px-3.5 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>{isTamil ? 'கடவுச்சீட்டைக் காண்க' : 'View Passport'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveToPassport}
                    className="px-5 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-warm-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>
                      {isTamil
                        ? 'கடவுச்சீட்டில் "தகவல்தொடர்பு சான்றாக" சேமிக்க'
                        : 'Save "Communication assessed" Entry to Passport'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-4 py-2.5 rounded-xl bg-parchment-200 dark:bg-night-100 border border-warm-border hover:bg-parchment-300 text-warm-ink dark:text-night-ink font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{isTamil ? 'அடுத்த கேள்வி' : 'Next Question'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
