import React, { useState, useEffect, type ReactNode } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import { useTranslation } from 'react-i18next';
import { AIThinking } from '../components/AIThinking';
import { StatusPill } from '../components/StatusPill';
import { TrustLabel } from '../components/TrustLabel';
import { getCoachAnswerLive } from '../services/api';
import { Language } from '../types';
import {
  Send,
  Sparkles,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

function renderInlineMarkdown(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function renderCoachMessage(text: string): ReactNode {
  const normalizedText = text
    .replace(/\r\n/g, '\n')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/---\s*(?=###?)/g, '\n\n')
    .replace(/###\s*/g, '\n\n')
    .replace(/\*\*/g, '')
    .replace(/\]\s*(?=\[)/g, ']\n')
    .replace(/\s+\[\s*\]\s*/g, '\n- [ ] ')
    .replace(/\.\s+(?=\*\*[^*]+\*\*)/g, '.\n\n')
    .replace(/\s+(?=\*\*[^*]+\*\*)/g, '\n\n')
    .replace(/\s+\*(?!\*)\s*/g, '\n- ')
    .replace(/(^|[.!?:])\s*\*(?!\*)\s*(?=[A-Z0-9])/gm, '$1\n- ')
    .replace(/\s+(?=\d+\.\s+)/g, '\n')
    .replace(/([a-z)])(?=[A-Z][A-Za-z ]+:)/g, '$1\n')
    .replace(/\n{3,}/g, '\n\n');

  const lines = normalizedText.split('\n').map(line => line.trim()).filter(Boolean);
  const content: ReactNode[] = [];
  let bulletItems: string[] = [];
  let numberedItems: string[] = [];

  const flushBullets = () => {
    if (!bulletItems.length) return;
    content.push(
      <ul key={`bullets-${content.length}`} className="list-disc pl-5 space-y-2">
        {bulletItems.map((item, index) => (
          <li key={index}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>
    );
    bulletItems = [];
  };

  const flushNumbered = () => {
    if (!numberedItems.length) return;
    content.push(
      <ol key={`numbered-${content.length}`} className="list-decimal pl-5 space-y-2">
        {numberedItems.map((item, index) => (
          <li key={index}>{renderInlineMarkdown(item)}</li>
        ))}
      </ol>
    );
    numberedItems = [];
  };

  lines.forEach((line, index) => {
    if (line.startsWith('- ')) {
      flushNumbered();
      bulletItems.push(line.slice(2).trim());
      return;
    }
    const numberedMatch = line.match(/^\d+\.\s+(.+)/);
    if (numberedMatch) {
      flushBullets();
      numberedItems.push(numberedMatch[1].trim());
      return;
    }
    flushBullets();
    flushNumbered();
    content.push(
      <p key={`paragraph-${index}`} className={content.length ? 'mt-2' : undefined}>
        {renderInlineMarkdown(line)}
      </p>
    );
  });
  flushBullets();
  flushNumbered();

  return <div className="space-y-2.5">{content}</div>;
}

export const CoachView: React.FC = () => {
  const { getPersona, getCurrentPathway, isOfflineDemo } = useSkillBridgeStore();
  const { t, i18n } = useTranslation();
  const persona = getPersona();
  const pathway = getCurrentPathway();
  const currentLang = (i18n.language as Language) || 'en';

  const getGreeting = (lang: string) => {
    const firstName = lang === 'ta' ? persona.nameTamil.split(' ')[0] : persona.name.split(' ')[0];
    if (lang === 'ta') {
      return `வணக்கம் ${firstName}! நான் உங்கள் AI வழிகாட்டி. ${pathway.titleTamil || pathway.title} கற்றலில் உங்கள் திறன் இடைவெளிகளை நீக்கி நல்ல வேலை வாய்ப்பைப் பெற நான் எவ்வாறு உதவட்டும்?`;
    }
    if (lang === 'fr') {
      return `Bonjour ${firstName} ! Je suis votre coach technique SkillBridge IA. Comment puis-je vous aider à développer vos compétences et préparer vos opportunités dans ${pathway.title} aujourd'hui ?`;
    }
    if (lang === 'hi') {
      return `नमस्ते ${firstName}! मैं आपका SkillBridge AI करियर और तकनीकी कोच हूँ। ${pathway.title} में आपकी क्षमताओं को साबित करने और कौशल अंतरालों को पाटने में मैं कैसे मदद कर सकता हूँ?`;
    }
    return `Hello ${firstName}! I am your SkillBridge AI Career & Technical Coach. How can I help you prove your abilities or bridge skill gaps in ${pathway.title} today?`;
  };

  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: getGreeting(currentLang),
      timestamp: 'Just now'
    }
  ]);

  // Update greeting when language changes if no user messages yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'assistant') {
        return [
          {
            id: 'm-1',
            sender: 'assistant',
            text: getGreeting(currentLang),
            timestamp: 'Just now'
          }
        ];
      }
      return prev;
    });
  }, [currentLang]);

  const quickPrompts = [
    {
      label: t('coach.quickPrompts.label1', 'Explain DOM Event Bubbling'),
      prompt: t('coach.quickPrompts.prompt1', 'Can you explain DOM event bubbling and delegation with a clear real-world code example?')
    },
    {
      label: t('coach.quickPrompts.label2', 'How to fix neckline puckering?'),
      prompt: t('coach.quickPrompts.prompt2', 'My blouse neckline bias binding is puckering on chiffon fabric. What needle size and thread tension should I adjust?')
    },
    {
      label: t('coach.quickPrompts.label3', 'Job Readiness Check'),
      prompt: t('coach.quickPrompts.prompt3', 'Review my readiness score for Junior Frontend roles in Chennai and tell me the fastest way to bridge my missing gaps.')
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
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
    try {
      const { text: reply } = await getCoachAnswerLive(query, persona, currentLang, isOfflineDemo);
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to generate coach response:', err);
      const reason = err instanceof Error ? ` ${err.message}` : '';
      const errorMessage = currentLang === 'ta'
        ? `நேரடி Gemini AI பதில் கிடைக்கவில்லை.${reason} Offline mode-ஐ அணைத்து, Gemini API key-ஐ சரிபார்க்கவும்.`
        : currentLang === 'hi'
        ? `लाइव Gemini AI उत्तर उपलब्ध नहीं है।${reason} Offline mode बंद करें और Gemini API key जांचें।`
        : currentLang === 'fr'
        ? `La réponse Gemini en direct est indisponible.${reason} Désactivez le mode hors ligne et vérifiez la clé API Gemini.`
        : `No live Gemini response is available.${reason}${reason.includes('(503)') || reason.includes('(429)')
          ? ' Gemini is temporarily busy; please try again shortly.'
          : ' Check that Offline mode is OFF and your Gemini API key is configured.'}`;
      setMessages(prev => [...prev, {
        id: `e-${Date.now()}`,
        sender: 'assistant',
        text: errorMessage,
        timestamp: 'Just now'
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-card bg-white dark:bg-night-card border border-sky-100 dark:border-night-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-sky-300 px-2.5 py-0.5 rounded-full bg-[#EAF5FC] border border-[#62B6E8]/30">
              {t('coach.bilingualBadge', 'AI Mentor Assistant')}
            </span>
            <StatusPill status="ai_reviewed" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white">
            {t('coach.title', 'SkillBridge AI Coach')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#526174] dark:text-night-muted max-w-xl">
            {t('coach.subtitle', 'Ask technical questions, get viva coaching, or troubleshoot craft doubts in your preferred language.')}
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
            className="p-3.5 rounded-2xl bg-white dark:bg-night-100 border border-sky-100 hover:border-[#62B6E8] text-left transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[#173B67] dark:text-sky-300 text-xs font-bold mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-[#F2B66D] shrink-0" />
              <span className="truncate">{qp.label}</span>
            </div>
            <div className="text-[11px] text-[#526174] dark:text-night-muted line-clamp-2">
              {qp.prompt}
            </div>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="rounded-card bg-white dark:bg-night-card border border-sky-100 dark:border-night-border shadow-soft flex flex-col h-[520px]">
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
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                    isAI
                      ? 'bg-[#173B67] text-[#62B6E8] border border-[#62B6E8]/40'
                      : 'bg-[#62B6E8] text-white font-extrabold'
                  }`}
                >
                  {isAI ? <Sparkles className="w-4 h-4 text-[#F2B66D]" /> : persona.name.charAt(0)}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-card text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'bg-[#EAF5FC]/60 dark:bg-night-100 text-[#173B67] dark:text-night-ink border border-[#D4E7F5]'
                      : 'bg-[#173B67] text-white shadow-soft'
                  }`}
                >
                  {renderCoachMessage(msg.text)}
                  <div
                    className={`mt-1 text-[10px] text-right ${
                      isAI ? 'text-[#526174]' : 'text-white/70'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="p-4 max-w-md mr-auto rounded-card bg-[#F8FAFC] dark:bg-night-100 border border-[#E2E8F0] dark:border-night-border shadow-soft">
              <AIThinking
                label={t('coach.thinking', 'SkillBridge Coach is analyzing your query...')}
              />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-sky-100 dark:border-night-border/80 bg-white dark:bg-night-100/50 rounded-b-card">
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
              placeholder={t('coach.askPlaceholder', 'Ask a question in your preferred language...')}
              className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-[#EAF5FC]/50 dark:bg-night-card border border-sky-200 dark:border-night-border text-[#173B67] dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-[#62B6E8]"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isThinking}
              className="px-5 py-2.5 rounded-full bg-[#173B67] hover:bg-[#112C4E] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-soft transition-all cursor-pointer"
            >
              <span>{t('coach.sendBtn', 'Send')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
