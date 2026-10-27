import React, { useState } from 'react';
import { X, Mic, Volume2, Globe, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  SpeechLang,
  speakInstruction,
  stopSpeaking,
  SpeechInputController
} from '../utils/speech';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const [testLang, setTestLang] = useState<SpeechLang>('ta-IN');
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isPlayingTts, setIsPlayingTts] = useState(false);

  if (!isOpen) return null;

  const recognitionSupported = isSpeechRecognitionSupported();
  const synthesisSupported = isSpeechSynthesisSupported();

  const handleStartSpeechTest = () => {
    if (!recognitionSupported) return;
    setTranscribedText('');
    const controller = new SpeechInputController(
      testLang,
      (text) => setTranscribedText(text),
      (listening) => setIsListening(listening),
      (err) => setTranscribedText(`Error: ${err}`)
    );
    controller.start();
  };

  const handleTestTts = () => {
    const sampleSentences: Record<SpeechLang, string> = {
      'ta-IN': 'வணக்கம்! திறன் பாலம் குரல் வழிகாட்டல் வெற்றிகரமாக இயங்குகிறது.',
      'hi-IN': 'नमस्ते! स्किलब्रिज एआई वॉइस सहायता ठीक से काम कर रही है।',
      'en-IN': 'Hello! SkillBridge AI voice assistant is operating with full clarity.'
    };

    if (isPlayingTts) {
      stopSpeaking();
      setIsPlayingTts(false);
    } else {
      setIsPlayingTts(true);
      speakInstruction(sampleSentences[testLang], testLang, () => setIsPlayingTts(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-card bg-white border border-[#E2E8F0] shadow-soft space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#62B6E8]">
              Browser Diagnostics
            </div>
            <h3 className="text-lg font-bold text-[#173B67]">
              Voice & Audio Settings
            </h3>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1 rounded-btn text-[#526174] hover:bg-[#F8FAFC] hover:text-[#173B67]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Capability Diagnostic */}
        <div className="p-3.5 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#173B67]">
              Speech Recognition (Mic Input):
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 ${
                recognitionSupported
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {recognitionSupported ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Supported
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-600" /> Chrome Only
                </>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#173B67]">
              Speech Synthesis (Read Aloud):
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 ${
                synthesisSupported
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {synthesisSupported ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Supported
                </>
              ) : (
                'Unavailable'
              )}
            </span>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-xs font-bold text-[#173B67] uppercase tracking-wide mb-1.5">
            Select Voice Language
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ta-IN' as const, label: 'தமிழ்', tag: 'Tamil' },
              { id: 'hi-IN' as const, label: 'हिन्दी', tag: 'Hindi' },
              { id: 'en-IN' as const, label: 'English', tag: 'Indian EN' }
            ].map((lg) => (
              <button
                key={lg.id}
                onClick={() => setTestLang(lg.id)}
                className={`p-2 rounded-btn text-center border text-xs font-bold transition-all cursor-pointer ${
                  testLang === lg.id
                    ? 'bg-[#62B6E8] text-[#173B67] border-[#62B6E8] shadow-soft'
                    : 'bg-white text-[#173B67] border-[#E2E8F0] hover:bg-[#EAF5FC]'
                }`}
              >
                <div>{lg.label}</div>
                <div className="text-[10px] font-normal opacity-75">{lg.tag}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Mic Test Box */}
        <div className="p-3.5 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#173B67]">
              1. Microphone Speech-to-Text Test
            </span>
            <button
              onClick={handleStartSpeechTest}
              disabled={!recognitionSupported || isListening}
              className="px-3 py-1 rounded-btn bg-[#62B6E8] hover:bg-[#4ea8dc] disabled:opacity-50 text-[#173B67] text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Mic className="w-3 h-3" />
              <span>{isListening ? 'Listening...' : 'Test Mic'}</span>
            </button>
          </div>

          <div className="p-2.5 rounded-btn bg-white border border-[#E2E8F0] min-h-[50px] text-xs font-medium text-[#173B67] italic">
            {transcribedText || (isListening ? 'Listening... Speak now...' : 'Click "Test Mic" and say something...')}
          </div>
        </div>

        {/* Read Aloud Test Box */}
        <div className="p-3.5 rounded-card bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#173B67]">
              2. Text-to-Speech Read Aloud Test
            </span>
            <button
              onClick={handleTestTts}
              disabled={!synthesisSupported}
              className={`px-3 py-1 rounded-btn text-xs font-bold flex items-center gap-1 cursor-pointer ${
                isPlayingTts
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#EAF5FC] hover:bg-[#D9EFFB] text-[#173B67] border border-[#BAE6FD]'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>{isPlayingTts ? 'Stop' : 'Play Audio'}</span>
            </button>
          </div>
          <div className="text-[11px] text-[#526174]">
            Plays a clear voice sample in {testLang}.
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            stopSpeaking();
            onClose();
          }}
          className="w-full py-2.5 rounded-btn bg-[#62B6E8] text-[#173B67] text-xs font-bold shadow-soft hover:bg-[#4ea8dc] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
