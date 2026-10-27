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
          colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
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
      <div className="relative w-full max-w-xl p-6 rounded-card bg-white dark:bg-night-card border border-[#E2E8F0] dark:border-night-border shadow-soft space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#173B67] dark:text-sky-400">
                Diagnostic Assessment
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD] font-bold">
                CSS & Flexbox
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#173B67] dark:text-white mt-0.5">
              CSS Responsive Layout Quiz
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!isFinished && (
              <button
                type="button"
                onClick={handleSimulateFortyPercent}
                className="px-2.5 py-1 rounded-btn text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 cursor-pointer"
                title="Instant test for Hackathon judges: Triggers 40% score and live roadmap adaptation"
              >
                ⚡ Test 40% (Fail Flexbox)
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-btn text-[#526174] hover:bg-[#EAF5FC] dark:hover:bg-night-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isFinished ? (
          <div className="space-y-4">
            {/* Progress indicators */}
            <div className="flex items-center justify-between text-xs text-[#526174]">
              <span>Question {currentIdx + 1} of {cssQuizQuestions.length}</span>
              <div className="flex items-center gap-1">
                {cssQuizQuestions.map((q, idx) => (
                  <span
                    key={q.id}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentIdx
                        ? 'bg-[#62B6E8] ring-2 ring-[#BAE6FD]'
                        : selectedAnswers[q.id] !== undefined
                        ? 'bg-emerald-600'
                        : 'bg-slate-200 dark:bg-night-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-card bg-[#F8FAFC] dark:bg-night-100 border border-[#E2E8F0] space-y-1">
              <h4 className="text-sm font-bold text-[#173B67] dark:text-white">
                {currentQ.question}
              </h4>
              <div className="font-tamil text-xs text-[#526174] dark:text-sky-300">
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
                    className={`w-full p-3 rounded-btn text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                      isPicked
                        ? 'bg-[#173B67] text-white border-[#173B67] shadow-soft'
                        : 'bg-white dark:bg-night-card border-[#E2E8F0] text-[#173B67] dark:text-night-ink hover:bg-[#EAF5FC]'
                    }`}
                  >
                    <span>{opt}</span>
                    {isPicked && <CheckCircle2 className="w-4 h-4 text-sky-300" />}
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#526174] italic">
                Tip: Score below 60% to demonstrate live AI roadmap adaptation!
              </span>

              <button
                type="button"
                onClick={handleNextOrFinish}
                disabled={!isSelected}
                className="px-5 py-2 rounded-btn bg-[#62B6E8] hover:bg-[#4fa8dc] disabled:opacity-40 text-[#173B67] font-bold text-xs shadow-soft flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
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
              className={`p-5 rounded-card border flex items-center gap-4 ${
                scorePercentage < 60
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0 ${
                  scorePercentage < 60 ? 'bg-amber-600' : 'bg-emerald-600'
                }`}
              >
                {scorePercentage}%
              </div>

              <div>
                <h4 className="font-bold text-base text-[#173B67] dark:text-white">
                  {scorePercentage < 60
                    ? 'Adaptive Remedial Triggered!'
                    : 'Milestone Assessment Passed!'}
                </h4>
                <p className="text-xs text-[#526174] dark:text-night-muted mt-0.5">
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
                className="px-4 py-2 rounded-btn border border-[#E2E8F0] text-[#173B67] text-xs font-semibold flex items-center gap-1 hover:bg-[#F8FAFC] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retake Quiz</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-btn bg-[#173B67] text-white font-bold text-xs shadow-soft hover:bg-[#112C4E] cursor-pointer"
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
