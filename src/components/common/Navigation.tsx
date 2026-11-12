import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';
import { 
  Home, 
  Sparkles,
  Radio, 
  Layers, 
  ShieldAlert, 
  MessageCircle, 
  User,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Navigation: React.FC = () => {
  const { currentScreen, setCurrentScreen, openCreateMenu, requests, chats, currentUserRole, reportedContent } = useApp();

  const pendingRequestsCount = requests.filter(r => r.status === 'pending' || r.status === 'reviewing').length;
  const unreadMessagesCount = chats.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeReportsCount = reportedContent.filter(r => r.status === 'pending').length;

  const isPrivileged = currentUserRole && currentUserRole !== 'member';

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Sparkles },
    { id: 'circles', label: 'Circles', icon: Layers },
    { id: 'radar', label: 'Radar', icon: Radio },
    { 
      id: 'requests', 
      label: 'Requests', 
      icon: ShieldAlert,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined
    },
    { 
      id: 'chat', 
      label: 'Chat', 
      icon: MessageCircle,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    { id: 'profile', label: 'Me', icon: User },
    ...(isPrivileged ? [{
      id: 'admin' as ScreenId,
      label: 'Admin',
      icon: ShieldCheck,
      badge: (pendingRequestsCount + activeReportsCount) > 0 ? (pendingRequestsCount + activeReportsCount) : undefined
    }] : [])
  ];

  return (
    <>
      {/* Desktop Sub-Header Navigation Bar */}
      <nav className="hidden md:block bg-[#101827]/80 backdrop-blur-md border-b border-[#242831] sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1.5 py-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors relative ${
                    isActive
                      ? 'bg-[#344B6B] text-[#F5F6F8] shadow-sm'
                      : 'text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#142238]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F5F6F8]' : 'text-[#A7AFBC]'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#101827] text-[#F5F6F8]' : 'bg-[#1B1E24] text-[#A7AFBC] border border-[#242831]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Floating Bottom Capsule Navigation Bar (Desktop & Mobile Responsive) */}
      <nav className="fixed bottom-3 sm:bottom-4 left-0 right-0 z-40 px-3 pb-safe pointer-events-none flex justify-center">
        <div className="w-full max-w-md sm:max-w-lg bg-[#142238]/95 backdrop-blur-md border border-[#242831] text-[#F5F6F8] rounded-2xl p-1.5 shadow-2xl flex items-center justify-between pointer-events-auto">
          {/* Left Navigation Items */}
          <div className="flex items-center justify-around flex-1">
            {navItems.filter(item => ['home', 'circles'].includes(item.id)).map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#344B6B] text-[#F5F6F8] shadow-sm'
                      : 'text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#1B1E24]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Unified Centre Green (+) Create Action Button */}
          <div className="flex items-center justify-center px-2 sm:px-3 shrink-0">
            <button
              onClick={openCreateMenu}
              className="w-11 h-11 -my-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-xl shadow-emerald-950/60 ring-4 ring-[#101827] hover:ring-[#142238] transition-all cursor-pointer group"
              title="Create & Share (+)"
              aria-label="Create new item"
            >
              <Plus className="w-6 h-6 stroke-[2.75] transition-transform duration-200 group-hover:rotate-90" />
            </button>
          </div>

          {/* Right Navigation Items */}
          <div className="flex items-center justify-around flex-1">
            {navItems.filter(item => ['radar', 'chat', 'profile'].includes(item.id)).map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#344B6B] text-[#F5F6F8] shadow-sm'
                      : 'text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#1B1E24]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center ${
                      isActive ? 'bg-[#101827] text-[#F5F6F8]' : 'bg-[#344B6B] text-[#F5F6F8]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
