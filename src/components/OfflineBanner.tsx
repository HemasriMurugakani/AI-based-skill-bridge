import React, { useState, useEffect } from 'react';
import { useSkillBridgeStore } from '../store/useSkillBridgeStore';
import {
  WifiOff,
  Wifi,
  Download,
  CheckCircle2,
  Zap,
  Smartphone,
  X
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const OfflineBanner: React.FC = () => {
  const {
    isOffline,
    setOfflineStatus,
    isLowDataMode,
    toggleLowDataMode,
    isLessonsDownloaded,
    lessonsDownloadProgress,
    downloadLessonsOffline,
    offlineCacheSizeMB
  } = useSkillBridgeStore();

  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => setOfflineStatus(false);
    const handleOffline = () => setOfflineStatus(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOfflineStatus(true);
    }

    // PWA Install prompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [setOfflineStatus]);

  // Combined offline flag: real browser offline or prototype simulation
  const effectiveOffline = isOffline || isSimulatedOffline;

  const handleDownload = async () => {
    setIsDownloading(true);
    await downloadLessonsOffline();
    setIsDownloading(false);
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 4500);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install SkillBridge AI: tap the browser menu (⋮ or Share) and select "Add to Home Screen" / "Install SkillBridge".');
    }
  };

  return (
    <>
      {/* Toast Notification on successful download */}
      {showDownloadToast && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-forest-700 text-white shadow-warm-xl flex items-center gap-3 border border-forest-500 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-gold-300 shrink-0" />
          <div>
            <div className="text-xs font-bold">Lessons & Roadmaps Downloaded!</div>
            <div className="text-[11px] text-forest-100">
              All 4 pathways and 18 interactive modules cached ({offlineCacheSizeMB} MB). Ready for 100% offline use.
            </div>
          </div>
        </div>
      )}

      {/* 1. Offline Notification Strip (Shows when offline) */}
      {effectiveOffline && !bannerDismissed && (
        <aside
          role="status"
          aria-live="polite"
          className="bg-gradient-to-r from-amber-700 via-amber-800 to-maroon-900 text-gold-100 px-4 py-2 border-b border-amber-600/80 shadow-sm"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-full bg-amber-500/30 border border-amber-400/60 text-amber-200 shrink-0">
                <WifiOff className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <span className="font-bold text-white">
                  Offline Mode Active · இணைய இணைப்பு இல்லை:
                </span>{' '}
                <span className="text-amber-100/90">
                  {isLessonsDownloaded
                    ? 'All lessons, roadmaps, and local rubrics are cached and 100% functional without internet.'
                    : 'App shell is active. Download the offline pack below to save all lesson transcripts and rubrics.'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isLessonsDownloaded ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-3 py-1 rounded-full bg-gold-500 hover:bg-gold-400 text-maroon-950 font-bold text-xs shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? `Caching ${lessonsDownloadProgress}%...` : 'Download Lessons'}</span>
                </button>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-forest-600/60 border border-forest-400 text-forest-200 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-forest-300" />
                  <span>Offline Ready ({offlineCacheSizeMB} MB)</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                className="text-amber-200 hover:text-white p-1 rounded-lg"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

    </>
  );
};
