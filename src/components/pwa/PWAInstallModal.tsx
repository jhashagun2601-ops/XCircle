import React from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  MoreVertical, 
  Share, 
  PlusSquare, 
  Sparkles, 
  Zap, 
  WifiOff, 
  X,
  ShieldCheck
} from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, platform, promptInstall, hasPrompt } = usePWA();
  const [installSuccess, setInstallSuccess] = React.useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (hasPrompt) {
      const outcome = await promptInstall();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#142238] border border-[#242831] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="pwa-install-title"
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-[#242831] bg-gradient-to-b from-[#1E2D4A]/50 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] rounded-lg hover:bg-[#1B2940] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#101827] border border-[#344B6B]/40 p-2 flex items-center justify-center shadow-lg relative shrink-0">
              <img 
                src="/pwa-192x192.png" 
                alt="XCircle App Icon" 
                className="w-full h-full object-contain rounded-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#101827] flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="pwa-install-title" className="text-lg font-bold text-[#F5F6F8]">
                  Install XCircle
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PWA
                </span>
              </div>
              <p className="text-xs text-[#A7AFBC] mt-0.5">
                Fast, native app experience on your phone
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {isInstalled || installSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-emerald-300">
                XCircle is Installed!
              </h4>
              <p className="text-xs text-emerald-200/80">
                You can launch XCircle directly from your Home Screen or App Drawer with full standalone screen display.
              </p>
            </div>
          ) : (
            <>
              {/* Feature Highlights */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#101827] border border-[#242831] text-center">
                  <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
                  <div className="text-[11px] font-semibold text-[#F5F6F8]">Instant Launch</div>
                  <div className="text-[10px] text-[#A7AFBC]">Zero loading delay</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#101827] border border-[#242831] text-center">
                  <WifiOff className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
                  <div className="text-[11px] font-semibold text-[#F5F6F8]">Offline Ready</div>
                  <div className="text-[10px] text-[#A7AFBC]">App shell cached</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#101827] border border-[#242831] text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
                  <div className="text-[11px] font-semibold text-[#F5F6F8]">100% Private</div>
                  <div className="text-[10px] text-[#A7AFBC]">No app store bloat</div>
                </div>
              </div>

              {/* Direct Install Button if supported by browser */}
              {isInstallable && (
                <div className="space-y-2">
                  <button
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install XCircle App Now</span>
                  </button>
                  <p className="text-[11px] text-center text-[#A7AFBC]">
                    Direct 1-tap installation supported on this device
                  </p>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A7AFBC] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {platform === 'ios' ? 'Installation Guide for iPhone / iPad' : 'Installation Guide for Android Devices'}
                  </span>
                </h4>

                {platform === 'ios' ? (
                  <ol className="space-y-2.5 text-xs text-[#F5F6F8]">
                    <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#101827] border border-[#242831]">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                      <div>
                        <span>Open in <strong>Safari</strong> and tap the <strong>Share</strong> button</span>
                        <div className="flex items-center gap-1 text-[11px] text-[#A7AFBC] mt-0.5">
                          <Share className="w-3 h-3 text-blue-400 inline" /> at the bottom of the screen
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#101827] border border-[#242831]">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                      <div>
                        <span>Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong></span>
                        <div className="flex items-center gap-1 text-[11px] text-[#A7AFBC] mt-0.5">
                          <PlusSquare className="w-3 h-3 text-blue-400 inline" /> with the plus square icon
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#101827] border border-[#242831]">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                      <div>
                        <span>Tap <strong>Add</strong> in the top-right corner to complete installation</span>
                      </div>
                    </li>
                  </ol>
                ) : (
                  <ol className="space-y-2.5 text-xs text-[#F5F6F8]">
                    <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#101827] border border-[#242831]">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                      <div>
                        <span>Open <strong>Chrome</strong> (or Edge/Samsung Internet) and tap the <strong>3 dots menu</strong></span>
                        <div className="flex items-center gap-1 text-[11px] text-[#A7AFBC] mt-0.5">
                          <MoreVertical className="w-3 h-3 text-emerald-400 inline" /> located at the top-right
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#101827] border border-[#242831]">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                      <div>
                        <span>Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong></span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#101827] border border-[#242831]">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                      <div>
                        <span>Confirm <strong>&quot;Install&quot;</strong>. The app icon will appear directly on your home screen!</span>
                      </div>
                    </li>
                  </ol>
                )}
              </div>
            </>
          )}

          {/* App Specifications */}
          <div className="pt-2 border-t border-[#242831] flex items-center justify-between text-[11px] text-[#A7AFBC]">
            <span>App: XCircle Progressive Web App</span>
            <span className="font-mono">v1.2.0 · Standalone</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#101827] border-t border-[#242831] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[#1E2D4A] hover:bg-[#2A3E66] text-[#F5F6F8] transition-colors"
          >
            {isInstalled ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
