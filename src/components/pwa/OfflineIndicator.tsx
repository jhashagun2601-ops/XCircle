import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CloudOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  if (showReconnected) {
    return (
      <aside aria-label="Network status" className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs shadow-xl backdrop-blur-md">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">Connection restored — live sync active</span>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="Network status" className="fixed top-16 left-0 right-0 z-40 bg-amber-950/95 border-b border-amber-500/30 text-amber-200 px-4 py-2 backdrop-blur-md animate-in slide-in-from-top duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">
            You are currently offline. Viewing cached app shell.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-amber-300/80 text-[11px]">
          <CloudOff className="w-3.5 h-3.5" />
          <span>New messages and updates will sync once connection is restored</span>
        </div>
      </div>
    </aside>
  );
};
