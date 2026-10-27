import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { interviewRoles, InterviewRole, InterviewQuestion } from '../data/interviewRoles';
import {
  SpeechInputController,
  speakInstruction,
  stopSpeaking,
  SpeechLang,
  mapLanguageToSpeechLang
} from '../utils/speech';
import { scoreInterviewTranscript, InterviewScoreResponse } from '../services/api';
import { VivaProofRecord, Language } from '../types';
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

  const { t } = useTranslation();
  const persona = getPersona();
  const pathway = getCurrentPathway();
  const currentLang = language as Language;

  // 1. Role Selection
  const initialRole =
    interviewRoles.find(r => r.pathwayId === pathway.id) || interviewRoles[0];
  const [selectedRole, setSelectedRole] = useState<InterviewRole>(initialRole);

  // 2. Question Progression
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion: InterviewQuestion =
    selectedRole.questions[currentQuestionIndex] || selectedRole.questions[0];

  // 3. Speech and Voice Settings - strictly mapped from active app language
  const speechLanguage: SpeechLang = mapLanguageToSpeechLang(currentLang);
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

  const getQuestionText = (q: InterviewQuestion) => {
    if (currentLang === 'ta' && q.questionTamil) return q.questionTamil;
    if (currentLang === 'hi' && q.questionHindi) return q.questionHindi;
    return q.questionText;
  };

  const getQuestionContext = (q: InterviewQuestion) => {
    if (currentLang === 'ta' && q.contextTamil) return q.contextTamil;
    return q.context;
  };

  const getRoleTitle = (r: InterviewRole) => {
    if (currentLang === 'ta' && r.titleTamil) return r.titleTamil;
    return r.title;
  };

  const getSampleAnswer = (q: InterviewQuestion) => {
    if (currentLang === 'ta' && q.sampleAnswerTamil) return q.sampleAnswerTamil;
    return q.sampleAnswerEnglish;
  };

  // Play question via speechSynthesis
  const handlePlayQuestionAudio = () => {
    if (isAiSpeaking) {
      stopSpeaking();
      setIsAiSpeaking(false);
      return;
    }

    const textToSpeak = getQuestionText(currentQuestion);

    setIsAiSpeaking(true);
    speakInstruction(textToSpeak, speechLanguage, () => {
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
      setSpeechError(
        currentLang === 'ta'
          ? 'தயவுசெய்து முதலில் உங்கள் பதிலை பேசவும் அல்லது தட்டச்சு செய்யவும்.'
          : currentLang === 'fr'
          ? 'Veuillez d\'abord enregistrer ou saisir votre réponse.'
          : currentLang === 'hi'
          ? 'कृपया सबमिट करने से पहले अपना उत्तर बोलें या टाइप करें।'
          : 'Please record or type an answer before submitting.'
      );
      return;
    }

    if (isRecording) {
      speechControllerRef.current?.stop();
    }
    stopSpeaking();

    setIsEvaluating(true);
    setSpeechError(null);

    try {
      const response = await scoreInterviewTranscript(
        {
          roleId: selectedRole.id,
          roleTitle: selectedRole.title,
          question: getQuestionText(currentQuestion),
          transcript,
          language: currentLang,
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
      challengeTitle: `AI Mock Interview: ${getRoleTitle(selectedRole)}`,
      pathwayId: selectedRole.pathwayId,
      vivaStatus: 'Viva completed',
      authenticityConfidence: 'Consistent',
      averageScore: evaluationResult.overallScore || Math.round((evaluationResult.clarity + evaluationResult.confidence + evaluationResult.relevance) / 3),
      completedAt: 'Today, Just now',
      qa: [
        {
          question: getQuestionText(currentQuestion),
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
      <div className="p-6 sm:p-7 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EAF5FC] dark:bg-deepblue-950/80 text-[#173B67] dark:text-sky-300 border border-[#BAE6FD]">
                {currentLang === 'ta'
                  ? 'AI வாய்மொழி நேர்காணல் பயிற்சி'
                  : currentLang === 'fr'
                  ? 'Entretien blanc vocal IA'
                  : currentLang === 'hi'
                  ? 'AI मौखिक साक्षात्कार अभ्यास'
                  : 'AI Speech Mock Interview'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                Web Speech API • {speechLanguage}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
              {currentLang === 'ta'
                ? 'குரல்வழி தொழில்முறை நேர்காணல்'
                : currentLang === 'fr'
                ? 'Pratique d\'entretien professionnel vocal'
                : currentLang === 'hi'
                ? 'इंटरएक्टिव वॉयस इंटरव्यू अभ्यास'
                : 'Interactive Voice Interview Practice'}
            </h1>

            <p className="text-xs sm:text-sm text-[#526174] dark:text-night-muted max-w-2xl leading-relaxed">
              {currentLang === 'ta'
                ? 'ஒரு குறிப்பிட்ட பணியை தேர்ந்தெடுங்கள், AI கேள்விகளைக் கேட்கும். உங்கள் குரல் மூலம் பதிலளித்து பேச்சு வேகம், தயக்கம் மற்றும் உடனடி ஆலோசனைகளைப் பெறுங்கள்.'
                : currentLang === 'fr'
                ? 'Sélectionnez un rôle cible, écoutez l\'intervieweur IA poser des questions et répondez naturellement à la voix pour obtenir un diagnostic instantané.'
                : currentLang === 'hi'
                ? 'लक्षित भूमिका चुनें, AI साक्षात्कारकर्ता के प्रश्नों को सुनें और स्वाभाविक रूप से बोलकर उत्तर दें। तुरंत गति और भाषा पर डायग्नोस्टिक प्रतिक्रिया पाएं।'
                : 'Select a target job, listen to the AI interviewer speak questions, and answer naturally by voice. Receive instant diagnostic feedback on speech pace, filler frequency, and evidence-backed articulation.'}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-btn bg-[#EAF5FC] dark:bg-night-100/60 border border-[#BAE6FD] text-xs space-y-1 w-full lg:w-auto lg:min-w-[200px]">
            <div className="text-[11px] uppercase font-bold text-[#526174] dark:text-night-muted">
              {currentLang === 'ta' ? 'பயிற்சி பயனர்' : currentLang === 'fr' ? 'Profil actif' : currentLang === 'hi' ? 'सक्रिय शिक्षार्थी' : 'Active Learner'}
            </div>
            <div className="font-bold text-[#173B67] dark:text-white">
              {currentLang === 'ta' ? persona.nameTamil : persona.name}
            </div>
            <div className="text-[#62B6E8] font-medium">
              {getRoleTitle(selectedRole)}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. ROLE SELECTOR */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-5 sm:p-6 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-sky-300 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#62B6E8]" />
            <span>
              {currentLang === 'ta'
                ? '1. நேர்காணல் பணியைத் தேர்ந்தெடுங்கள்:'
                : currentLang === 'fr'
                ? '1. Choisissez le poste cible pour l\'entretien :'
                : currentLang === 'hi'
                ? '1. साक्षात्कार के लिए लक्षित भूमिका चुनें:'
                : '1. Choose Target Role for Interview:'}
            </span>
          </div>
          <span className="text-[11px] text-[#526174]">
            {interviewRoles.length}{' '}
            {currentLang === 'ta'
              ? 'பணிகள் உள்ளன'
              : currentLang === 'fr'
              ? 'postes disponibles'
              : currentLang === 'hi'
              ? 'भूमिकाएं उपलब्ध'
              : 'Roles Available'}
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
                className={`p-3 rounded-card border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#173B67] text-white border-[#173B67] shadow-soft scale-[1.02]'
                    : 'bg-[#EAF5FC]/50 dark:bg-night-100/70 border-[#BAE6FD] dark:border-night-border hover:bg-[#EAF5FC] text-[#173B67] dark:text-night-ink'
                }`}
              >
                <div>
                  <span
                    className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#EAF5FC] dark:bg-night-card text-[#173B67] border border-[#BAE6FD]'
                    }`}
                  >
                    {role.category === 'technical' ? 'Tech' : 'Craft'}
                  </span>
                  <div className="font-bold text-xs leading-snug line-clamp-2">
                    {getRoleTitle(role)}
                  </div>
                </div>

                <div className={`text-[10px] mt-2 pt-1 border-t truncate ${isSelected ? 'border-white/20 text-white/80' : 'border-[#E2E8F0] text-[#526174]'}`}>
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
      <div className="p-6 sm:p-7 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0] dark:border-night-border/60">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#173B67] text-white font-bold flex items-center justify-center text-xs">
              Q{currentQuestionIndex + 1}
            </span>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-[#173B67] dark:text-white">
                {currentLang === 'ta' ? 'கேள்வி' : currentLang === 'fr' ? 'Question' : currentLang === 'hi' ? 'प्रश्न' : 'Interview Question'} {currentQuestionIndex + 1} / {selectedRole.questions.length}
              </div>
              <div className="text-xs text-[#62B6E8] font-medium">
                {getRoleTitle(selectedRole)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#526174] bg-[#EAF5FC] dark:bg-night-100 px-3 py-1.5 rounded-full border border-[#BAE6FD] dark:border-night-border">
            <span>Voice Locale:</span>
            <span className="font-mono text-[#173B67] dark:text-sky-300 font-bold">{speechLanguage}</span>
          </div>
        </div>

        {/* Question Text with Play Audio CTA */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#173B67] dark:text-white leading-relaxed flex-1">
              {getQuestionText(currentQuestion)}
            </h2>

            {/* Read Question Audio Button (Speech Synthesis) */}
            <button
              type="button"
              onClick={handlePlayQuestionAudio}
              className={`p-3 rounded-btn border flex items-center gap-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isAiSpeaking
                  ? 'bg-[#EAF5FC] text-[#173B67] border-[#BAE6FD] shadow-soft animate-pulse'
                  : 'bg-white dark:bg-night-100 border-[#E2E8F0] text-[#173B67] dark:text-night-ink hover:bg-[#EAF5FC]'
              }`}
              title="Listen to AI interviewer speak this question"
            >
              {isAiSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-[#173B67]" />
                  <span className="hidden sm:inline">Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#62B6E8]" />
                  <span className="hidden sm:inline">Listen Aloud</span>
                </>
              )}
            </button>
          </div>

          {/* Context Card */}
          <div className="p-3 rounded-btn bg-[#F8FAFC] dark:bg-night-100/70 border border-[#E2E8F0] text-xs text-[#526174] dark:text-night-muted flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#62B6E8] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#173B67] dark:text-white">
                {currentLang === 'ta' ? 'நேர்காணல் பின்னணி & நோக்கம்:' : currentLang === 'fr' ? 'Intention du recruteur :' : currentLang === 'hi' ? 'साक्षात्कारकर्ता का उद्देश्य:' : 'Interviewer Intent & Context:'}
              </span>{' '}
              {getQuestionContext(currentQuestion)}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 4. LEARNER VOICE ANSWER INPUT (WEB SPEECH API) */}
        {/* ------------------------------------------------------------------ */}
        <div className="p-5 rounded-card bg-[#F8FAFC] dark:bg-night-100/80 border border-[#E2E8F0] dark:border-night-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-white">
              <Mic className="w-4 h-4 text-[#62B6E8]" />
              <span>
                {currentLang === 'ta'
                  ? 'உங்கள் வாய்மொழி பதில்:'
                  : currentLang === 'fr'
                  ? 'Votre réponse vocale :'
                  : currentLang === 'hi'
                  ? 'आपका मौखिक उत्तर:'
                  : 'Your Voice Response:'}
              </span>
              <span className="text-[11px] font-semibold text-[#526174] lowercase">
                ({speechLanguage})
              </span>
            </div>

            {/* Speaking Timer and Word Counter */}
            <div className="flex items-center gap-3 text-xs text-[#526174] dark:text-night-muted">
              <span className="flex items-center gap-1 font-mono font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {Math.floor(recordingSeconds / 60)}:
                  {(recordingSeconds % 60).toString().padStart(2, '0')}
                </span>
              </span>
              <span>•</span>
              <span>
                {transcript.trim() ? transcript.trim().split(/\s+/).length : 0}{' '}
                {currentLang === 'ta' ? 'சொற்கள்' : currentLang === 'fr' ? 'mots' : currentLang === 'hi' ? 'शब्द' : 'words'}
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
                  ? (currentLang === 'ta'
                      ? 'பேசுங்கள்... உரை தானாக பதிவாகிறது...'
                      : currentLang === 'fr'
                      ? 'À l\'écoute... Parlez distinctement dans votre micro...'
                      : currentLang === 'hi'
                      ? 'सुन रहा है... माइक्रोफ़ोन में स्पष्ट रूप से बोलें...'
                      : 'Listening... Speak clearly into your microphone...')
                  : (currentLang === 'ta'
                      ? 'மைக்கை இயக்கி பேசவும் அல்லது இங்கே தட்டச்சு செய்யவும்...'
                      : currentLang === 'fr'
                      ? 'Cliquez sur le microphone pour répondre à la voix, ou saisissez votre réponse ici...'
                      : currentLang === 'hi'
                      ? 'माइक दबाकर बोलें या यहाँ उत्तर टाइप करें...'
                      : 'Click the microphone button to answer by voice, or type your response here...')
              }
              className={`w-full p-4 rounded-btn text-xs sm:text-sm bg-white dark:bg-night-card border text-[#173B67] dark:text-white focus:outline-none transition-all leading-relaxed ${
                isRecording
                  ? 'border-[#62B6E8] ring-2 ring-[#62B6E8]/30'
                  : 'border-[#E2E8F0] dark:border-night-border'
              }`}
            />

            {/* Quick Sample Answer shortcut for resilient evaluation */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs">
              <button
                type="button"
                onClick={() => setTranscript(getSampleAnswer(currentQuestion))}
                className="text-[#62B6E8] hover:underline font-semibold text-xs cursor-pointer"
              >
                {currentLang === 'ta'
                  ? 'மாதிரி பதிலை நிரப்புக (Quick Demo)'
                  : currentLang === 'fr'
                  ? 'Insérer un exemple de réponse (Démo rapide)'
                  : currentLang === 'hi'
                  ? 'तैयार नमूना उत्तर भरें (त्वरित डेमो)'
                  : 'Insert Sample Prepared Response (Quick Demo)'}
              </button>

              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-[#526174] hover:text-[#173B67] text-xs cursor-pointer"
                >
                  {currentLang === 'ta' ? 'அழிக்க' : currentLang === 'fr' ? 'Effacer' : currentLang === 'hi' ? 'साफ़ करें' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          {speechError && (
            <div className="p-3 rounded-btn bg-[#FEF2F2] dark:bg-red-950/60 border border-[#FECACA] text-[#991B1B] dark:text-red-200 text-xs flex items-center gap-2">
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
              className={`w-full sm:w-auto px-5 py-3 rounded-btn font-bold text-xs sm:text-sm shadow-soft transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                isRecording
                  ? 'bg-[#EF4444] hover:bg-[#dc2626] text-white animate-pulse'
                  : 'bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67]'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>
                    {currentLang === 'ta'
                      ? 'பதிவை நிறுத்துக'
                      : currentLang === 'fr'
                      ? 'Arrêter l\'enregistrement'
                      : currentLang === 'hi'
                      ? 'रिकॉर्डिंग रोकें'
                      : 'Stop Recording'}
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>
                    {currentLang === 'ta'
                      ? 'குரல் மூலம் பதிலளிக்க'
                      : currentLang === 'fr'
                      ? 'Répondre à la voix'
                      : currentLang === 'hi'
                      ? 'आवाज़ द्वारा उत्तर दें'
                      : 'Answer by Voice'}
                  </span>
                </>
              )}
            </button>

            {/* Submit for AI Evaluation */}
            <button
              type="button"
              disabled={isEvaluating || !transcript.trim()}
              onClick={handleSubmitAnswer}
              className={`w-full sm:w-auto px-6 py-3 rounded-btn font-bold text-xs sm:text-sm shadow-soft transition-all flex items-center justify-center gap-2 ${
                isEvaluating || !transcript.trim()
                  ? 'bg-[#E2E8F0] dark:bg-night-100 text-[#94A3B8] cursor-not-allowed'
                  : 'bg-[#10B981] hover:bg-[#059669] text-white cursor-pointer hover:scale-[1.02]'
              }`}
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#173B67]" />
                  <span>
                    {currentLang === 'ta'
                      ? 'மதிப்பீடு செய்கிறது...'
                      : currentLang === 'fr'
                      ? 'Évaluation en cours...'
                      : currentLang === 'hi'
                      ? 'मूल्यांकन जारी है...'
                      : 'Scoring Transcript...'}
                  </span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {currentLang === 'ta'
                      ? 'பதிலை சமர்ப்பிக்க'
                      : currentLang === 'fr'
                      ? 'Soumettre la réponse'
                      : currentLang === 'hi'
                      ? 'उत्तर जमा करें'
                      : 'Submit Answer for AI Scoring'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 5. DIAGNOSTIC RESULTS DISPLAY */}
        {/* ------------------------------------------------------------------ */}
        {evaluationResult && (
          <div className="p-6 sm:p-7 rounded-card bg-white dark:bg-night-card border border-[#BAE6FD] dark:border-night-border shadow-soft space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-base sm:text-lg font-bold text-[#173B67] dark:text-white">
                  {currentLang === 'ta'
                    ? 'AI நேர்காணல் பகுப்பாய்வு முடிவுகள்'
                    : currentLang === 'fr'
                    ? 'Résultats du diagnostic d\'entretien IA'
                    : currentLang === 'hi'
                    ? 'AI साक्षात्कार स्कोरिंग और डायग्नोस्टिक'
                    : 'AI Interview Scoring & Transcript Diagnostic'}
                </h3>
              </div>

              <div className="text-xs font-bold text-[#10B981]">
                Overall: {evaluationResult.overallScore}%
              </div>
            </div>

            {/* Metrics Triad & Pacing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Pace Estimate Card */}
              <div className="p-4 rounded-card bg-[#F8FAFC] dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#526174]">
                  {currentLang === 'ta' ? 'பேச்சு வேகம்' : currentLang === 'fr' ? 'Débit de parole' : currentLang === 'hi' ? 'बोलने की गति' : 'Speech Pace'}
                </div>
                <div className="text-2xl font-extrabold text-[#10B981]">
                  {evaluationResult.paceWpm} <span className="text-xs font-sans font-bold">WPM</span>
                </div>
                <div className="text-[10px] text-[#526174]">
                  {evaluationResult.paceWpm >= 115 && evaluationResult.paceWpm <= 145
                    ? (currentLang === 'ta' ? 'சிறந்த வேகம் (115-145 WPM)' : currentLang === 'fr' ? 'Cadence optimale (115-145 MPM)' : currentLang === 'hi' ? 'उत्तम गति (115-145 WPM)' : 'Optimal Cadence (115-145 WPM)')
                    : evaluationResult.paceWpm < 115
                    ? (currentLang === 'ta' ? 'சற்று மெதுவான வேகம்' : currentLang === 'fr' ? 'Cadence mesurée (<115 MPM)' : currentLang === 'hi' ? 'धीमी गति (<115 WPM)' : 'Measured Cadence (<115 WPM)')
                    : (currentLang === 'ta' ? 'அதிவேகம்' : currentLang === 'fr' ? 'Cadence rapide (>145 MPM)' : currentLang === 'hi' ? 'तेज़ गति (>145 WPM)' : 'Fast Cadence (>145 WPM)')}
                </div>
              </div>

              {/* Filler Word Count Card */}
              <div className="p-4 rounded-card bg-[#F8FAFC] dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#526174]">
                  {currentLang === 'ta' ? 'தயக்கச் சொற்கள்' : currentLang === 'fr' ? 'Mots de remplissage' : currentLang === 'hi' ? 'भराव शब्द' : 'Filler Word Count'}
                </div>
                <div className="text-2xl font-extrabold text-[#D97706]">
                  {evaluationResult.fillerWordCount}{' '}
                  <span className="text-xs font-sans font-bold">detected</span>
                </div>
                <div className="text-[10px] text-[#526174] truncate">
                  {evaluationResult.matchedFillers && evaluationResult.matchedFillers.length > 0
                    ? `(${evaluationResult.matchedFillers.join(', ')})`
                    : 'Clean articulation'}
                </div>
              </div>

              {/* Linguistic Clarity */}
              <div className="p-4 rounded-card bg-[#F8FAFC] dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#526174]">
                  {currentLang === 'ta' ? 'தெளிவு' : currentLang === 'fr' ? 'Clarté linguistique' : currentLang === 'hi' ? 'भाषाई स्पष्टता' : 'Articulation Clarity'}
                </div>
                <div className="text-2xl font-extrabold text-[#173B67] dark:text-sky-300">
                  {evaluationResult.clarity}%
                </div>
                <div className="text-[10px] text-[#526174]">
                  Vocabulary & sentence density
                </div>
              </div>

              {/* Relevance */}
              <div className="p-4 rounded-card bg-[#F8FAFC] dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#526174]">
                  {currentLang === 'ta' ? 'பொருத்தம்' : currentLang === 'fr' ? 'Pertinence au rôle' : currentLang === 'hi' ? 'भूमिका प्रासंगिकता' : 'Role Relevance'}
                </div>
                <div className="text-2xl font-extrabold text-[#173B67] dark:text-white">
                  {evaluationResult.relevance}%
                </div>
                <div className="text-[10px] text-[#526174]">
                  Alignment to {selectedRole.title.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* MANDATORY CONFIDENCE SCORING NOTE */}
            <div className="p-4 rounded-card bg-[#EAF5FC] dark:bg-deepblue-950/40 border border-[#BAE6FD] text-xs space-y-1">
              <div className="font-bold text-[#173B67] dark:text-sky-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#62B6E8]" />
                <span>
                  {currentLang === 'ta'
                    ? 'மொழிசார் தன்னம்பிக்கை மதிப்பீடு அறிவிப்பு:'
                    : currentLang === 'fr'
                    ? 'Politique d\'évaluation linguistique de confiance :'
                    : currentLang === 'hi'
                    ? 'भाषाई आत्मविश्वास स्कोरिंग नीति:'
                    : 'Linguistic Confidence Scoring Policy (Important Notice):'}
                </span>
              </div>
              <p className="text-[#526174] dark:text-night-muted leading-relaxed">
                {evaluationResult.disclaimer ||
                  'Confidence scoring is derived strictly from linguistic transcript structure and assertive vocabulary. It is not a psychological assessment or judgment of the person.'}
              </p>
            </div>

            {/* 3 SPECIFIC TIPS */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#526174] dark:text-night-muted">
                {currentLang === 'ta'
                  ? '3 குறிப்பிட்ட முன்னேற்ற ஆலோசனைகள்:'
                  : currentLang === 'fr'
                  ? '3 conseils concrets pour le tour suivant :'
                  : currentLang === 'hi'
                  ? 'अगले दौर के लिए 3 विशिष्ट सुझाव:'
                  : '3 Specific Actionable Tips for Next Round:'}
              </div>

              <div className="space-y-2">
                {evaluationResult.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-btn bg-[#F8FAFC] dark:bg-night-card border border-[#E2E8F0] dark:border-night-border flex items-start gap-3 text-xs leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#065F46] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-[#173B67] dark:text-night-ink">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SAVE TO PASSPORT CTA */}
            <div className="pt-3 border-t border-[#E2E8F0] dark:border-night-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-bold text-xs text-[#173B67] dark:text-white">
                  {currentLang === 'ta'
                    ? 'திறன் கடவுச்சீட்டில் சேர்க்க'
                    : currentLang === 'fr'
                    ? 'Ajouter la preuve au passeport'
                    : currentLang === 'hi'
                    ? 'सत्यापनीय क्रेडेंशियल में प्रमाण जोड़ें'
                    : 'Add Proof to Verifiable Credential'}
                </div>
                <div className="text-[11px] text-[#526174]">
                  {currentLang === 'ta'
                    ? 'இது உங்கள் தயார்நிலை குறியீட்டில் "தகவல்தொடர்பு" கூறில் சேர்க்கப்படும்.'
                    : currentLang === 'fr'
                    ? 'Incrémente la composante "Communication" sur votre indice de préparation.'
                    : currentLang === 'hi'
                    ? 'यह आपके तैयारी सूचकांक में संचार घटक को अपडेट करता है।'
                    : 'Increments the "Communication assessed" component on your /readiness index.'}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {savedToPassport ? (
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-2 rounded-btn bg-[#ECFDF5] text-[#065F46] font-bold text-xs flex items-center gap-1.5 border border-[#A7F3D0]">
                      <Check className="w-4 h-4 text-[#10B981]" />
                      <span>
                        {currentLang === 'ta'
                          ? 'கடவுச்சீட்டில் சேமிக்கப்பட்டது!'
                          : currentLang === 'fr'
                          ? 'Enregistré dans le passeport !'
                          : currentLang === 'hi'
                          ? 'कौशल पासपोर्ट में सहेजा गया!'
                          : 'Saved to Skill Passport!'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('passport')}
                      className="px-3.5 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-bold text-xs cursor-pointer flex items-center gap-1 shadow-soft"
                    >
                      <span>
                        {currentLang === 'ta'
                          ? 'கடவுச்சீட்டைக் காண்க'
                          : currentLang === 'fr'
                          ? 'Voir le passeport'
                          : currentLang === 'hi'
                          ? 'पासपोर्ट देखें'
                          : 'View Passport'}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveToPassport}
                    className="px-5 py-2.5 rounded-btn bg-[#62B6E8] hover:bg-[#50a7dc] text-[#173B67] font-bold text-xs shadow-soft transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>
                      {currentLang === 'ta'
                        ? 'கடவுச்சீட்டில் சேமிக்க'
                        : currentLang === 'fr'
                        ? 'Enregistrer dans le passeport'
                        : currentLang === 'hi'
                        ? 'पासपोर्ट में प्रमाण सहेजें'
                        : 'Save to Verifiable Passport'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-4 py-2.5 rounded-btn bg-white hover:bg-[#EAF5FC] border border-[#E2E8F0] text-[#173B67] font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>
                    {currentLang === 'ta'
                      ? 'அடுத்த கேள்வி'
                      : currentLang === 'fr'
                      ? 'Question suivante'
                      : currentLang === 'hi'
                      ? 'अगला प्रश्न'
                      : 'Next Question'}
                  </span>
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
