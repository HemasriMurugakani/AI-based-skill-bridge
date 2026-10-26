import React, { useState } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { AIThinking } from '../components/AIThinking';
import { StreamingText } from '../components/StreamingText';
import { StatusPill } from '../components/StatusPill';
import { TrustLabel } from '../components/TrustLabel';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  CornerDownLeft
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  tamilText?: string;
  timestamp: string;
}

export const CoachView: React.FC = () => {
  const { getPersona, getCurrentPathway, isOfflineDemo } = useSkillBridgeStore();
  const { t } = useTranslation();
  const persona = getPersona();
  const pathway = getCurrentPathway();

  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Vanakkam ${persona.name.split(' ')[0]}! I am your SkillBridge AI Career & Technical Coach. How can I help you prove your abilities or bridge skill gaps in ${pathway.title} today?`,
      tamilText: `வணக்கம் ${persona.nameTamil.split(' ')[0]}! உங்கள் திறன் இடைவெளிகளை நீக்கி நல்ல வேலை வாய்ப்பைப் பெற நான் எவ்வாறு உதவட்டும்?`,
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    {
      label: 'Explain DOM Event Bubbling in Tamil',
      tamil: 'DOM நிகழ்வு பரிமாற்றம் தமிழில் விளக்கம்',
      prompt: 'Can you explain DOM event bubbling and delegation in simple Tamil with a real-world example?'
    },
    {
      label: 'How to fix blouse neckline puckering?',
      tamil: 'ரவிக்கை கழுத்து சுருக்கம் நீக்குவது எப்படி?',
      prompt: 'My neckline bias binding is puckering on chiffon fabric. What needle size and tension adjustments should I make?'
    },
    {
      label: 'Job Readiness Check for Chennai Trainee roles',
      tamil: 'சென்னை வேலைக்கு தயார்நிலை ஆய்வு',
      prompt: 'Check my readiness score for Junior Frontend Trainee roles in Chennai and tell me the fastest way to bridge gaps.'
    }
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let reply = '';
      let replyTamil = '';

      if (query.toLowerCase().includes('bubbling') || query.toLowerCase().includes('dom')) {
        reply = 'DOM Event Delegation works through event bubbling: instead of adding 500 event listeners on each item, you attach 1 listener to the parent <ul> container. When a user clicks, the event bubbles upward through parent elements. In event.target you read which exact item was clicked. This saves device memory, prevents memory leaks, and handles dynamically added items automatically!';
        replyTamil = 'பெற்றோர் <ul> பட்டியலில் ஒரே ஒரு listener வைப்பதன் மூலம் 500 உறுப்புகளுக்கும் மெமரி மிச்சமாகிறது. நிகழ்வு மேல்நோக்கி பரவுவதால் (bubbling) புதிய உறுப்புகள் வந்தாலும் தானாகவே செயல்படும்!';
      } else if (query.toLowerCase().includes('puckering') || query.toLowerCase().includes('blouse') || query.toLowerCase().includes('stitching')) {
        reply = 'To eliminate neck puckering in lightweight silk/chiffon: 1) Switch from standard 14/16 needle down to size 9 or 11 ball-point needle. 2) Cut the bias strip at strictly 45 degrees so the weave expands uniformly. 3) Loosen your upper thread tension dial by 1 full number, and place tissue paper beneath delicate fabric while stitching!';
        replyTamil = 'சுருக்கத்தை தவிர்க்க: ஊசி அளவு 9 அல்லது 11 ஆக மாற்றவும். துணியை சரியாக 45 டிகிரி கோணத்தில் வெட்டவும். நூல் அழுத்தத்தை குறைத்து, மெல்லிய காகிதத்தை அடியில் வைத்து தைக்கவும்!';
      } else {
        reply = `Based on your verified ${persona.readinessScore}% readiness score, your strongest assets are semantic accessibility and core craft accuracy. Your single immediate action is to bridge REST API caching with challenge #3 to push your match above 90% for Vaigai Digital Solutions!`;
        replyTamil = `உங்கள் 82% தயார்நிலை சென்னை நிறுவனங்களுக்கு போதுமானது. REST API சவாலை முடித்தால் உங்கள் வாய்ப்பு 90% க்கும் மேல் உயரும்!`;
      }

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        tamilText: replyTamil,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
              Bilingual AI Mentor
            </span>
            <StatusPill status="ai_reviewed" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heritage text-warm-ink dark:text-night-ink">
            SkillBridge AI Coach
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-warm-muted dark:text-night-muted max-w-xl">
            Ask technical questions, get viva coaching, or troubleshoot craft doubts in Tamil (தூய தமிழ் / தங்கிலீஷ்) or English.
          </p>
        </div>

        <TrustLabel type="ai-disclaimer" />
      </div>

      {/* Quick Prompts Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.prompt)}
            className="p-3 rounded-2xl bg-parchment-100/70 dark:bg-night-100 border border-warm-border/60 hover:border-gold-400 text-left transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-maroon-800 dark:text-gold-400 text-xs font-bold mb-0.5">
              <Lightbulb className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{qp.label}</span>
            </div>
            <div className="font-tamil text-[11px] text-warm-muted dark:text-night-muted truncate">
              {qp.tamil}
            </div>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-md flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAI
                      ? 'bg-maroon-800 text-gold-200 border border-gold-400'
                      : 'bg-gold-500 text-maroon-950 font-bold'
                  }`}
                >
                  {isAI ? <Sparkles className="w-4 h-4" /> : persona.name.charAt(0)}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'bg-parchment-100 dark:bg-night-100 text-warm-ink dark:text-night-ink border border-warm-border/60'
                      : 'bg-maroon-700 text-white shadow-warm-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.tamilText && (
                    <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 font-tamil text-xs text-maroon-800 dark:text-gold-300 font-medium">
                      {msg.tamilText}
                    </div>
                  )}
                  <div
                    className={`mt-1 text-[10px] text-right ${
                      isAI ? 'text-warm-muted' : 'text-white/70'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="p-4 max-w-md mr-auto rounded-2xl bg-parchment-100 dark:bg-night-100 border border-warm-border/60">
              <AIThinking
                labelEnglish="SkillBridge Coach is analyzing your query..."
                labelTamil="AI வழிகாட்டி ஆலோசனை தயாரிக்கிறது..."
              />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-warm-border/80 dark:border-night-border/80 bg-parchment-100/50 dark:bg-night-100/50 rounded-b-card-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask in English or தமிழில் கேளுங்கள்... (e.g. explain flexbox vs grid)"
              className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-white dark:bg-night-card border border-warm-border dark:border-night-border text-warm-ink dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-gold-500"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isThinking}
              className="px-4 py-2.5 rounded-full bg-maroon-700 hover:bg-maroon-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-warm-sm transition-all"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
