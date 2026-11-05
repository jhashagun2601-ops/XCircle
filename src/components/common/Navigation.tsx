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
  User 
} from 'lucide-react';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Navigation: React.FC = () => {
  const { currentScreen, setCurrentScreen, requests, chats } = useApp();

  const pendingRequestsCount = requests.filter(r => r.status === 'pending' || r.status === 'reviewing').length;
  const unreadMessagesCount = chats.reduce((acc, c) => acc + c.unreadCount, 0);

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

      {/* Mobile Floating Bottom Capsule Navigation Bar */}
      <nav className="md:hidden fixed bottom-2 left-0 right-0 z-40 px-3 pb-safe pointer-events-none">
        <div className="max-w-md mx-auto bg-[#142238] border border-[#242831] text-[#F5F6F8] rounded-xl p-1.5 shadow-2xl flex items-center justify-around pointer-events-auto">
          {navItems.filter(item => item.id !== 'explore').map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#344B6B] text-[#F5F6F8]'
                    : 'text-[#A7AFBC] hover:text-[#F5F6F8]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                    isActive ? 'bg-[#101827] text-[#F5F6F8]' : 'bg-[#344B6B] text-[#F5F6F8]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
