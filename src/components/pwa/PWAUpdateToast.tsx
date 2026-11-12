import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, CheckCircle2, X } from 'lucide-react';

export const PWAUpdateToast: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Optional periodic update check every 60 minutes
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('SW registration issue:', error);
    },
  });

  const closeOfflineReady = () => setOfflineReady(false);
  const closeNeedRefresh = () => setNeedRefresh(false);

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {needRefresh ? (
        <div className="bg-[#142238] border border-blue-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#F5F6F8]">
                XCircle Update Available
              </h4>
              <p className="text-xs text-[#A7AFBC] mt-1">
                A new version has been deployed. Reload to load the latest features and fixes.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => updateServiceWorker(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  Update & Reload
                </button>
                <button
                  onClick={closeNeedRefresh}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-[#A7AFBC] hover:text-[#F5F6F8] transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              onClick={closeNeedRefresh}
              className="text-[#A7AFBC] hover:text-[#F5F6F8] p-1 -mr-1 -mt-1 rounded"
              aria-label="Dismiss update notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : offlineReady ? (
        <div className="bg-[#142238] border border-emerald-500/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-[#F5F6F8]">
              XCircle is ready for offline browsing
            </span>
          </div>
          <button
            onClick={closeOfflineReady}
            className="text-[#A7AFBC] hover:text-[#F5F6F8] p-1 rounded"
            aria-label="Dismiss offline ready notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
