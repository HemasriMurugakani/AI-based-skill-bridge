import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

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

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[50vh] flex items-center justify-center p-6 text-center"
        >
          <div className="max-w-lg w-full p-8 rounded-3xl bg-parchment-50 dark:bg-night-card border border-terracotta-400/50 shadow-warm-lg space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-terracotta-100 dark:bg-terracotta-950/60 text-terracotta-700 dark:text-terracotta-300 flex items-center justify-center border border-terracotta-300 dark:border-terracotta-800">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-warm-ink dark:text-night-ink">
                Something didn't load smoothly
              </h2>
              <div className="font-tamil text-sm font-semibold text-terracotta-700 dark:text-terracotta-400 mt-1">
                தொகுதி ஏற்றுவதில் சிறு பிழை ஏற்பட்டது
              </div>
              <p className="mt-2 text-xs sm:text-sm text-warm-muted dark:text-night-muted leading-relaxed">
                SkillBridge encountered an unexpected state. Don't worry, your verified proofs, streak history, and local progress are securely stored in your browser.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-parchment-200/60 dark:bg-night-100 font-mono text-[11px] text-left text-warm-muted dark:text-night-muted overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs shadow-warm-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Module (மீண்டும் ஏற்று)</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-parchment-200 dark:bg-night-100 text-warm-ink dark:text-night-ink border border-warm-border dark:border-night-border font-medium text-xs hover:border-gold-400 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
