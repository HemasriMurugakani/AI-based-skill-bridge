import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import i18n from '../i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SkillBridge ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isTa = i18n.language === 'ta';

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[50vh] flex items-center justify-center p-6 text-center"
        >
          <div className="max-w-lg w-full p-8 rounded-card bg-white dark:bg-night-card border border-rose-300 dark:border-rose-900/50 shadow-soft space-y-5">
            <div className="w-16 h-16 mx-auto rounded-card bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 flex items-center justify-center border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#173B67] dark:text-white">
                {isTa ? 'தொகுதி ஏற்றுவதில் சிறு பிழை ஏற்பட்டது' : "Something didn't load smoothly"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#526174] dark:text-night-muted leading-relaxed">
                {isTa
                  ? 'எதிர்பாராத பிழை ஏற்பட்டது. கவலை வேண்டாம், உங்கள் சரிபார்க்கப்பட்ட சான்றுகள் மற்றும் முன்னேற்றம் பாதுகாப்பாக உள்ளன.'
                  : "SkillBridge encountered an unexpected state. Don't worry, your verified proofs, streak history, and local progress are securely stored in your browser."}
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-card bg-[#F8FAFC] dark:bg-night-100 font-mono text-[11px] text-left text-[#526174] dark:text-night-muted overflow-x-auto max-h-24 border border-[#E2E8F0]">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-[#173B67] hover:bg-[#112C4E] text-white font-semibold text-xs shadow-soft transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isTa ? 'மீண்டும் ஏற்று' : 'Reload Module'}</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-btn bg-[#EAF5FC] dark:bg-night-100 text-[#173B67] dark:text-night-ink border border-[#BAE6FD] dark:border-night-border font-medium text-xs hover:bg-[#d8eefc] transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isTa ? 'முகப்பிற்குத் திரும்பு' : 'Return to Home'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
