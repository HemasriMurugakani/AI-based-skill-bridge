// Web Speech API utility for Speech-to-Text and Text-to-Speech
import { Language } from '../types';

export type SpeechLang = 'ta-IN' | 'en-IN' | 'fr-FR' | 'hi-IN';

// Speech Recognition Type Definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const isSpeechSynthesisSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
};

/**
 * Map app Language ('en' | 'ta' | 'fr' | 'hi') to standard BCP-47 speech recognition & synthesis locale.
 */
export const mapLanguageToSpeechLang = (lang: Language): SpeechLang => {
  switch (lang) {
    case 'ta':
      return 'ta-IN';
    case 'fr':
      return 'fr-FR';
    case 'hi':
      return 'hi-IN';
    case 'en':
    default:
      return 'en-IN';
  }
};

export class SpeechInputController {
  private recognition: any = null;
  private isListening = false;

  constructor(
    private lang: SpeechLang = 'en-IN',
    private onResult: (text: string) => void = () => {},
    private onStateChange: (listening: boolean) => void = () => {},
    private onError: (err: string) => void = () => {}
  ) {
    if (isSpeechRecognitionSupported()) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.lang;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStateChange(true);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onStateChange(false);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        this.onStateChange(false);
        this.onError(event.error || 'Speech recognition failed');
      };

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          this.onResult(transcript);
        }
      };
    }
  }

  setLang(lang: SpeechLang) {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  start() {
    if (!this.recognition) {
      this.onError('Speech recognition not supported in this browser. Works best in Chrome.');
      return;
    }
    try {
      this.recognition.start();
    } catch (e) {
      // already started or aborted
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignored
      }
    }
  }

  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }
}

/**
 * Text to speech helper with graceful voice fallback.
 */
export const speakInstruction = (
  text: string,
  lang: SpeechLang = 'en-IN',
  onEnd?: () => void
) => {
  if (!isSpeechSynthesisSupported()) return;

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // slightly slower for maximum clarity
    utterance.pitch = 1.0;

    // Gracefully select available voice for requested locale if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const exactMatch = voices.find((v) => v.lang === lang || v.lang.replace('_', '-') === lang);
      if (exactMatch) {
        utterance.voice = exactMatch;
      } else {
        const prefix = lang.split('-')[0];
        const prefixMatch = voices.find((v) => v.lang.startsWith(prefix));
        if (prefixMatch) {
          utterance.voice = prefixMatch;
        }
      }
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    // Graceful fallback if speech synthesis throws
    if (onEnd) onEnd();
  }
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      // ignored
    }
  }
};

export const speakText = (
  text: string,
  lang: Language | SpeechLang = 'en-IN',
  onEnd?: () => void
) => {
  const speechLang: SpeechLang =
    lang === 'ta'
      ? 'ta-IN'
      : lang === 'en'
        ? 'en-IN'
        : lang === 'fr'
          ? 'fr-FR'
          : lang === 'hi'
            ? 'hi-IN'
            : (lang as SpeechLang);
  speakInstruction(text, speechLang, onEnd);
};
