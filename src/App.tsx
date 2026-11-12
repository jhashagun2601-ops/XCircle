import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { ProfileModal } from './components/common/ProfileModal';
import { VerificationModal } from './components/verification/VerificationModal';
import { CreateActionMenu } from './components/common/CreateActionMenu';
import { CreateCircleModal } from './components/circles/CreateCircleModal';
import { EmailVerificationBanner } from './components/auth/EmailVerificationBanner';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PWAUpdateToast } from './components/pwa/PWAUpdateToast';
import { PWAInstallModal } from './components/pwa/PWAInstallModal';

import { SignInScreen } from './components/auth/SignInScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { ForgotPasswordScreen } from './components/auth/ForgotPasswordScreen';
import { AuthCallbackScreen } from './components/auth/AuthCallbackScreen';
import { CompleteProfileScreen } from './components/auth/CompleteProfileScreen';

import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { RadarScreen } from './components/screens/RadarScreen';
import { CirclesScreen } from './components/screens/CirclesScreen';
import { RequestsScreen } from './components/screens/RequestsScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AdminScreen } from './components/screens/AdminScreen';

import { CheckCircle2, Loader2 } from 'lucide-react';
import { Logo } from './components/common/Logo';

const AppContent: React.FC = () => {
  const { 
    currentScreen, 
    toastMessage, 
    isCreateCircleModalOpen, 
    closeCreateCircleModal,
    isPWAInstallModalOpen,
    closePWAInstallModal
  } = useApp();
  const { user, profile, loading } = useAuth();

  // Browser Pathname State
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#101827] flex flex-col items-center justify-center p-4">
        <div className="bg-[#142238] border border-[#242831] rounded-xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#A7AFBC]">
            <Loader2 className="w-4 h-4 animate-spin text-[#344B6B]" />
            <span>Restoring session...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Auth Routes (/auth/callback, /signup, /forgot-password, /signin)
  if (
    currentRoute === '/auth/callback' || 
    window.location.search.includes('code=') || 
    window.location.search.includes('type=recovery') || 
    window.location.hash.includes('access_token') ||
    window.location.hash.includes('type=recovery')
  ) {
    return <AuthCallbackScreen onNavigate={navigate} />;
  }

  if (currentRoute === '/signup') {
    if (user) {
      navigate('/');
    } else {
      return <SignUpScreen onNavigate={navigate} />;
    }
  }

  if (currentRoute === '/forgot-password') {
    return <ForgotPasswordScreen onNavigate={navigate} />;
  }

  if (currentRoute === '/signin') {
    if (user) {
      navigate('/');
    } else {
      return <SignInScreen onNavigate={navigate} />;
    }
  }

  // 3. Protected Route Guard: If user is not authenticated, prompt sign-in
  if (!user) {
    return <SignInScreen onNavigate={navigate} />;
  }

  // 4. Registration Completion Guard (For Google OAuth & Magic Link users)
  if (currentRoute === '/complete-profile' || (profile && profile.isProfileCompleted === false)) {
    return <CompleteProfileScreen onNavigate={navigate} />;
  }

  // 5. Authenticated Application
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'radar':
        return <RadarScreen />;
      case 'circles':
        return <CirclesScreen />;
      case 'requests':
        return <RequestsScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        return <AdminScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#101827] text-[#F5F6F8] flex flex-col font-sans selection:bg-[#344B6B] selection:text-white">
      {/* Real Email Verification Banner (shows when email unverified) */}
      <EmailVerificationBanner />

      {/* Top Header */}
      <Header />

      {/* Navigation Bars (Sub-header on desktop + bottom tab bar on mobile) */}
      <Navigation />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 md:pb-8">
        {renderScreen()}
      </main>

      {/* Footer */}
      <footer className="hidden sm:block border-t border-[#242831] bg-[#142238]/60 py-5 text-xs text-[#A7AFBC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F5F6F8] font-display">XCircle</span>
            <span aria-hidden="true" className="text-[#242831]">·</span>
            <span className="text-[#A7AFBC]">Community & Reconnection Platform</span>
            <span aria-hidden="true" className="text-[#242831]">·</span>
            <span className="text-[#A7AFBC]/70">"People change, places change, connections remain."</span>
          </div>
          <div className="flex items-center gap-4 text-[#A7AFBC] text-[11px]">
            <span>Verified Peer Circles</span>
            <span aria-hidden="true" className="text-[#242831]">·</span>
            <span>Batch Archives</span>
            <span aria-hidden="true" className="text-[#242831]">·</span>
            <span>Privacy First</span>
          </div>
        </div>
      </footer>

      {/* Create Action Menu (Triggered by Centre Navigation Button) */}
      <CreateActionMenu />

      {/* PWA Offline Banner & Update Toast */}
      <OfflineIndicator />
      <PWAUpdateToast />

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <NotificationsDrawer />
      <ProfileModal />
      <VerificationModal />
      <CreateCircleModal
        isOpen={isCreateCircleModalOpen}
        onClose={closeCreateCircleModal}
      />
      <PWAInstallModal
        isOpen={isPWAInstallModalOpen}
        onClose={closePWAInstallModal}
      />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#142238] text-[#F5F6F8] text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-[#242831]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
