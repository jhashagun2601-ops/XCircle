import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Plus, 
  Layers, 
  Camera, 
  Calendar, 
  MessageSquarePlus, 
  Compass, 
  ChevronRight,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const CreateActionMenu: React.FC = () => {
  const { 
    isCreateMenuOpen, 
    closeCreateMenu, 
    openCreateCircleModal, 
    setCurrentScreen, 
    setActiveCircleTab,
    showToast 
  } = useApp();

  // Keyboard Escape support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCreateMenuOpen) {
        closeCreateMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateMenuOpen, closeCreateMenu]);

  if (!isCreateMenuOpen) return null;

  const creationOptions = [
    {
      id: 'create_circle',
      title: 'New Circle / Community',
      description: 'Start an Interest club, School batch, College department, Company clan, or Private circle',
      icon: Layers,
      accentColor: 'text-[#25D366]',
      bgAccent: 'bg-[#25D366]/15 border-[#25D366]/40',
      badge: 'Main Option',
      badgeColor: 'bg-[#25D366]/15 border-[#25D366]/30 text-[#25D366]',
      action: () => {
        closeCreateMenu();
        openCreateCircleModal();
      }
    },
    {
      id: 'share_post',
      title: 'Post to Circle Feed',
      description: 'Share a throwback, discussion topic, memory, or announcement with your peers',
      icon: MessageSquarePlus,
      accentColor: 'text-sky-400',
      bgAccent: 'bg-sky-500/15 border-sky-500/30',
      badge: 'Discussion',
      badgeColor: 'bg-sky-500/10 border-sky-500/20 text-sky-300',
      action: () => {
        closeCreateMenu();
        setCurrentScreen('circles');
        setActiveCircleTab('feed');
        showToast('Switched to Circle Feed. Click "Share a memory" to publish a post.');
      }
    },
    {
      id: 'upload_memory',
      title: 'Upload to Memory Vault',
      description: 'Preserve vintage campus photographs, farewell scans, and batch trip moments',
      icon: Camera,
      accentColor: 'text-rose-400',
      bgAccent: 'bg-rose-500/15 border-rose-500/30',
      badge: 'Archive',
      badgeColor: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
      action: () => {
        closeCreateMenu();
        setCurrentScreen('circles');
        setActiveCircleTab('memories');
        showToast('Opening Memory Vault. Click "Add Memory" to upload old photos.');
      }
    },
    {
      id: 'plan_reunion',
      title: 'Plan Batch Reunion',
      description: 'Coordinate milestone dates, poll venue suggestions, and collect attendee RSVPs',
      icon: Calendar,
      accentColor: 'text-amber-400',
      bgAccent: 'bg-amber-500/15 border-amber-500/30',
      badge: 'Milestone',
      badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      action: () => {
        closeCreateMenu();
        setCurrentScreen('circles');
        setActiveCircleTab('reunion');
        showToast('Opening Reunion Planner for your batch.');
      }
    },
    {
      id: 'explore_circles',
      title: 'Explore & Join Communities',
      description: 'Discover existing circles for your schools, colleges, workplaces, and neighborhoods',
      icon: Compass,
      accentColor: 'text-purple-400',
      bgAccent: 'bg-purple-500/15 border-purple-500/30',
      badge: 'Discover',
      badgeColor: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
      action: () => {
        closeCreateMenu();
        setCurrentScreen('explore');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={closeCreateMenu}
        aria-hidden="true"
      />

      <div className="bg-[#142238] border border-[#242831] rounded-t-3xl sm:rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242831] bg-[#101827]/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-950/40">
              <Plus className="w-5 h-5 stroke-[2.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F5F6F8] font-display">
                  Create & Share
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-bold">
                  Main Action
                </span>
              </div>
              <p className="text-xs text-[#A7AFBC]">
                Choose what you would like to create or contribute
              </p>
            </div>
          </div>

          <button
            onClick={closeCreateMenu}
            className="p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] rounded-lg hover:bg-[#1B1E24] transition-colors"
            aria-label="Close creation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-4 sm:p-5 space-y-2.5 max-h-[65vh] overflow-y-auto">
          {creationOptions.map((opt) => {
            const Icon = opt.icon;
            const isPrimary = opt.id === 'create_circle';
            return (
              <button
                key={opt.id}
                onClick={opt.action}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between gap-3.5 transition-all group cursor-pointer ${
                  isPrimary
                    ? 'bg-[#18283f] border-[#25D366]/40 hover:border-[#25D366] hover:bg-[#1c304d] shadow-sm'
                    : 'bg-[#1B1E24] border-[#242831] hover:border-[#344B6B] hover:bg-[#1e232c]'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${opt.bgAccent} ${opt.accentColor} border flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#F5F6F8] truncate group-hover:text-white">
                        {opt.title}
                      </h4>
                      {opt.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded border font-semibold ${opt.badgeColor}`}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A7AFBC] mt-0.5 leading-relaxed line-clamp-2">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-[#A7AFBC] group-hover:text-[#F5F6F8] group-hover:translate-x-0.5 transition-all shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info notice */}
        <div className="px-6 py-3 border-t border-[#242831] bg-[#101827]/40 flex items-center justify-between text-[11px] text-[#A7AFBC]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Peer Community</span>
          </div>
          <span className="text-[10px] font-mono text-[#A7AFBC]/70">XCircle Platform</span>
        </div>
      </div>
    </div>
  );
};
