import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';
import { Search, Bell, ShieldCheck, LogOut, Sparkles, Download } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    currentScreen,
    setCurrentScreen, 
    unreadNotificationsCount, 
    setNotificationsDrawerOpen,
    setSearchModalOpen,
    openPWAInstallModal,
    adminMode,
    toggleAdminMode
  } = useApp();

  const { isInstalled } = usePWA();
  const { user, profile, logout, isDevPreview } = useAuth();

  const activeDisplayName = profile?.displayName || user?.displayName || currentUser.name;
  const activeAvatar = profile?.avatar || user?.photoURL || currentUser.avatar;
  const activeTrust = profile?.trustScore || currentUser.trustScore;

  return (
    <header className="sticky top-0 z-30 bg-[#101827]/90 backdrop-blur-md border-b border-[#242831] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="text-left focus:outline-none rounded-lg p-1 -m-1"
            title="Go to Home"
          >
            <Logo size="md" />
          </button>

          {isDevPreview && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#344B6B]/20 text-[#A7AFBC] border border-[#344B6B]/40">
              <Sparkles className="w-2.5 h-2.5 text-[#344B6B]" />
              DEV PREVIEW
            </span>
          )}
        </div>

        {/* Zone 2: Global Search Bar trigger */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs sm:text-sm text-[#A7AFBC] bg-[#142238] border border-[#242831] hover:border-[#344B6B] rounded-lg transition-colors focus:outline-none"
          >
            <span className="flex items-center gap-2.5 truncate">
              <Search className="w-3.5 h-3.5 text-[#A7AFBC] shrink-0" />
              <span className="truncate text-xs text-[#A7AFBC]">Search schools, batches, alumni, circles...</span>
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#A7AFBC] bg-[#1B1E24] rounded border border-[#242831]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Zone 3: Actions & Profile & Real Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* PWA Install Button */}
          {!isInstalled && (
            <button
              onClick={openPWAInstallModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors shadow-sm"
              title="Install XCircle App on your phone or desktop"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Install App</span>
            </button>
          )}

          {/* Admin Dashboard Navigation */}
          <button
            onClick={() => setCurrentScreen('admin')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              currentScreen === 'admin' 
                ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B] shadow-sm' 
                : 'text-[#A7AFBC] bg-[#142238] border-[#242831] hover:bg-[#1B1E24] hover:text-[#F5F6F8]'
            }`}
            title="Open Platform Administration Panel"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#344B6B]" />
            <span>Admin Panel</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setNotificationsDrawerOpen(true)}
            className="relative p-2 text-[#A7AFBC] hover:text-[#F5F6F8] bg-[#142238] hover:bg-[#1B1E24] border border-[#242831] rounded-lg transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold text-[#F5F6F8] bg-[#344B6B] border border-[#101827] rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile trigger */}
          <button
            onClick={() => setCurrentScreen('profile')}
            className="flex items-center gap-2 p-1.5 rounded-lg bg-[#142238] hover:bg-[#1B1E24] border border-[#242831] transition-colors focus:outline-none"
            title="View Profile"
          >
            <img
              src={activeAvatar}
              alt={activeDisplayName}
              className="w-6 h-6 rounded-md object-cover border border-[#242831]"
            />
            <div className="hidden lg:block text-left text-xs pr-1 leading-tight">
              <p className="font-medium text-[#F5F6F8] truncate max-w-[85px]">{activeDisplayName}</p>
              <p className="text-[#A7AFBC] text-[10px] font-mono">Trust {activeTrust}</p>
            </div>
          </button>

          {/* Real Logout Button */}
          {user && (
            <button
              onClick={() => logout()}
              className="p-2 text-[#A7AFBC] hover:text-rose-400 bg-[#142238] hover:bg-rose-500/10 border border-[#242831] rounded-lg transition-colors focus:outline-none"
              title="Sign Out of XCircle"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
