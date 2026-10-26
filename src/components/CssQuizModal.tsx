import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { cssQuizQuestions } from '../data/roadmapData';
import confetti from 'canvas-confetti';

interface CssQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizCompleted: (scorePercentage: number) => void;
}

export const CssQuizModal: React.FC<CssQuizModalProps> = ({
  isOpen,
  onClose,
  onQuizCompleted
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [scorePercentage, setScorePercentage] = useState(0);

  if (!isOpen) return null;

  const currentQ = cssQuizQuestions[currentIdx];
  const isSelected = selectedAnswers[currentQ.id] !== undefined;

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optIdx
    });
  };

  const handleNextOrFinish = () => {
    if (currentIdx < cssQuizQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Compute score
      let correctCount = 0;
      cssQuizQuestions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctIndex) {
          correctCount++;
        }
      });
      const pct = Math.round((correctCount / cssQuizQuestions.length) * 100);
      setScorePercentage(pct);
      setIsFinished(true);

      if (pct >= 60) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#7A1A12', '#B8761A', '#E8B23A', '#2F7D4F']
        });
      }

      onQuizCompleted(pct);
    }
  };

  const handleSimulateFortyPercent = () => {
    // 2 out of 5 correct = 40% (fails flexbox)
    setSelectedAnswers({ 1: 0, 2: 1, 3: 1, 4: 1, 5: 1 });
    setScorePercentage(40);
    setIsFinished(true);
    onQuizCompleted(40);
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border dark:border-night-border shadow-warm-lg space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-700 dark:text-gold-400">
                Diagnostic Assessment
              </span>
              <span className="text-xs px-2 py-0.2 rounded-full bg-gold-100 text-gold-900 font-bold">
                CSS & Flexbox
              </span>
            </div>
            <h3 className="text-lg font-bold font-heritage text-warm-ink dark:text-night-ink mt-0.5">
              CSS Responsive Layout Quiz
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!isFinished && (
              <button
                type="button"
                onClick={handleSimulateFortyPercent}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-terracotta-100 text-terracotta-900 border border-terracotta-300 hover:bg-terracotta-200 cursor-pointer"
                title="Instant test for Hackathon judges: Triggers 40% score and live roadmap adaptation"
              >
                ⚡ Test 40% (Fail Flexbox)
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-warm-muted hover:bg-warm-100 dark:hover:bg-night-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isFinished ? (
          <div className="space-y-4">
            {/* Progress indicators */}
            <div className="flex items-center justify-between text-xs text-warm-muted">
              <span>Question {currentIdx + 1} of {cssQuizQuestions.length}</span>
              <div className="flex items-center gap-1">
                {cssQuizQuestions.map((q, idx) => (
                  <span
                    key={q.id}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentIdx
                        ? 'bg-maroon-700 ring-2 ring-gold-400'
                        : selectedAnswers[q.id] !== undefined
                        ? 'bg-forest-600'
                        : 'bg-warm-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-2xl bg-parchment-100 dark:bg-night-100 border border-warm-border/70 space-y-1">
              <h4 className="text-sm font-bold text-warm-ink dark:text-night-ink">
                {currentQ.question}
              </h4>
              <div className="font-tamil text-xs text-maroon-900 dark:text-gold-300">
                {currentQ.questionTamil}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, optIdx) => {
                const isPicked = selectedAnswers[currentQ.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                      isPicked
                        ? 'bg-maroon-700 text-white border-maroon-800 shadow-warm-sm'
                        : 'bg-white dark:bg-night-card border-warm-border/80 text-warm-ink dark:text-night-ink hover:bg-gold-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {isPicked && <CheckCircle2 className="w-4 h-4 text-gold-300" />}
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-warm-muted italic">
                Tip: Score below 60% to demonstrate live AI roadmap adaptation!
              </span>

              <button
                type="button"
                onClick={handleNextOrFinish}
                disabled={!isSelected}
                className="px-5 py-2 rounded-full bg-maroon-700 hover:bg-maroon-800 disabled:opacity-40 text-white font-bold text-xs shadow-warm-sm flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <span>{currentIdx === cssQuizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Quiz Results View */
          <div className="space-y-5 animate-in fade-in duration-300">
            <div
              className={`p-5 rounded-2xl border flex items-center gap-4 ${
                scorePercentage < 60
                  ? 'bg-terracotta-50 dark:bg-terracotta-950/60 border-terracotta-300'
                  : 'bg-forest-50 dark:bg-forest-950/60 border-forest-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0 ${
                  scorePercentage < 60 ? 'bg-terracotta-700' : 'bg-forest-700'
                }`}
              >
                {scorePercentage}%
              </div>

              <div>
                <h4 className="font-bold text-base text-warm-ink dark:text-night-ink">
                  {scorePercentage < 60
                    ? 'Adaptive Remedial Triggered!'
                    : 'Milestone Assessment Passed!'}
                </h4>
                <p className="text-xs text-warm-muted dark:text-night-muted mt-0.5">
                  {scorePercentage < 60
                    ? 'Scored below 60%. Triggering /api/roadmap-adapt to insert targeted CSS Layout Practice node.'
                    : 'Excellent responsive layout fundamentals! You are ready to advance to JavaScript.'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-full border border-warm-border text-xs font-semibold flex items-center gap-1 hover:bg-parchment-200"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retake Quiz</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-maroon-700 text-white font-bold text-xs shadow-warm-sm hover:bg-maroon-800"
              >
                <span>{scorePercentage < 60 ? 'See Adapted Roadmap' : 'Continue'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
