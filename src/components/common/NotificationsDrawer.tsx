import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCheck, 
  Calendar, 
  UserPlus, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  Bell 
} from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const { 
    notifications, 
    notificationsDrawerOpen, 
    setNotificationsDrawerOpen, 
    markNotificationRead, 
    markAllNotificationsRead,
    setCurrentScreen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  if (!notificationsDrawerOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'reunion_alert':
        return <Calendar className="w-4 h-4 text-[#344B6B]" />;
      case 'connection_request':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'request_approved':
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'new_post':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-[#F5F6F8]" />;
      default:
        return <Bell className="w-4 h-4 text-[#A7AFBC]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#142238] h-full shadow-2xl border-l border-[#242831] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#242831] bg-[#142238] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#F5F6F8] font-display">Notifications</h2>
            {notifications.some(n => !n.read) && (
              <span className="w-2 h-2 rounded-full bg-[#344B6B]" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="p-1.5 text-xs font-medium text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#1B1E24] rounded-md flex items-center gap-1 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button
              onClick={() => setNotificationsDrawerOpen(false)}
              className="p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#1B1E24] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2 border-b border-[#242831] bg-[#1B1E24] flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-[#344B6B] text-[#F5F6F8]'
                : 'text-[#A7AFBC] hover:text-[#F5F6F8]'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'unread'
                ? 'bg-[#344B6B] text-[#F5F6F8]'
                : 'text-[#A7AFBC] hover:text-[#F5F6F8]'
            }`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-[#A7AFBC]">
              <Bell className="w-8 h-8 text-[#A7AFBC]/40 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#F5F6F8]">No notifications</p>
              <p className="text-xs text-[#A7AFBC] mt-0.5">You are all caught up with your batch circles.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.actionUrl) {
                    setCurrentScreen(notif.actionUrl);
                    setNotificationsDrawerOpen(false);
                  }
                }}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  notif.read
                    ? 'bg-[#1B1E24]/60 border-[#242831] text-[#A7AFBC]'
                    : 'bg-[#1B1E24] border-[#344B6B] text-[#F5F6F8]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-[#142238] border border-[#242831] shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-[#F5F6F8] truncate">{notif.title}</p>
                      <span className="text-[10px] font-mono text-[#A7AFBC] whitespace-nowrap">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#A7AFBC] mt-1 line-clamp-2 leading-relaxed">{notif.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
