import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  UserPlus, 
  UserCheck, 
  MessageSquare, 
  GraduationCap, 
  Building,
  ShieldCheck, 
  Calendar, 
  Sparkles
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { 
    activeProfileModal, 
    closeProfileModal, 
    toggleConnect, 
    setCurrentScreen, 
    setActiveChatId, 
    chats 
  } = useApp();

  if (!activeProfileModal) return null;

  const profile = activeProfileModal;

  const handleStartChat = () => {
    const existingChat = chats.find(c => c.participants.includes(profile.name));
    if (existingChat) {
      setActiveChatId(existingChat.id);
    }
    setCurrentScreen('chat');
    closeProfileModal();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'peer_confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Peer Confirmed
          </span>
        );
      case 'document_reviewed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#A7AFBC] bg-[#142238] px-2 py-0.5 rounded border border-[#242831]">
            Self-Declared
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-[#142238] rounded-xl border border-[#242831] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Cover */}
        <div className="relative h-24 bg-[#1B1E24] border-b border-[#242831] p-4 flex justify-end">
          <button
            onClick={closeProfileModal}
            className="w-7 h-7 rounded-md bg-[#142238] border border-[#242831] text-[#A7AFBC] hover:text-[#F5F6F8] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 pb-6 pt-0 -mt-10 flex-1 overflow-y-auto">
          <div className="flex items-end justify-between gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-18 h-18 rounded-xl object-cover border-2 border-[#142238] bg-[#1B1E24]"
            />
            <div className="flex items-center gap-2 pb-1">
              <button
                onClick={() => toggleConnect(profile.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  profile.isConnected
                    ? 'bg-[#1B1E24] border-[#242831] text-[#A7AFBC]'
                    : 'bg-[#344B6B] hover:bg-[#3d587c] border-[#344B6B] text-[#F5F6F8]'
                }`}
              >
                {profile.isConnected ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{profile.requestSent ? 'Pending' : 'Connect'}</span>
                  </>
                )}
              </button>
              <button
                onClick={handleStartChat}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#1B1E24] hover:bg-[#242831] border border-[#242831] text-[#F5F6F8] flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Name & Handle */}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#F5F6F8] font-display">{profile.name}</h2>
              <span className="text-xs text-[#A7AFBC]">{profile.handle}</span>
            </div>
            <p className="text-xs text-[#A7AFBC] mt-1 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Key Badges & Metadata */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-xs text-[#A7AFBC]">
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#344B6B]" />
              <span className="text-[#F5F6F8]">{profile.institution}</span>
            </div>
            <span aria-hidden="true" className="text-[#242831]">·</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#344B6B]" />
              <span>{profile.batch}</span>
            </div>
            {profile.employer && (
              <>
                <span aria-hidden="true" className="text-[#242831]">·</span>
                <div className="flex items-center gap-1 text-amber-300">
                  <Building className="w-3.5 h-3.5" />
                  <span>{profile.employer}</span>
                </div>
              </>
            )}
            {profile.apartmentCommunity && (
              <>
                <span aria-hidden="true" className="text-[#242831]">·</span>
                <div className="flex items-center gap-1 text-emerald-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.apartmentCommunity}</span>
                </div>
              </>
            )}
            <span aria-hidden="true" className="text-[#242831]">·</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#344B6B]" />
              <span>{profile.location}</span>
            </div>
            {profile.phoneVerified && (
              <>
                <span aria-hidden="true" className="text-[#242831]">·</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Phone Verified
                </span>
              </>
            )}
          </div>

          {/* Why Suggested & Mutual Connections */}
          {profile.sharedReason && (
            <div className="mt-4 p-3.5 rounded-lg bg-[#1B1E24] border border-[#242831] text-xs text-[#A7AFBC]">
              <div className="flex items-center gap-1 font-medium text-[11px] uppercase tracking-wider text-[#F5F6F8] mb-0.5">
                <Sparkles className="w-3 h-3 text-[#344B6B]" />
                Connection Rationale
              </div>
              <p className="mt-0.5 leading-relaxed">{profile.sharedReason}</p>
              {profile.mutualFriendsNames && profile.mutualFriendsNames.length > 0 && (
                <p className="text-[11px] text-[#A7AFBC] mt-1.5">
                  Mutual friends: <span className="text-[#F5F6F8]">{profile.mutualFriendsNames.join(', ')}</span>
                </p>
              )}
            </div>
          )}

          {/* Community Trust Indicator */}
          <div className="mt-4 p-3.5 rounded-lg bg-[#1B1E24] border border-[#242831] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#F5F6F8] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Community Trust Score
              </p>
              <p className="text-[11px] text-[#A7AFBC] mt-0.5">
                Verified via peer batch endorsements & educational records
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-[#F5F6F8]">
                {profile.trustScore}
              </span>
              <span className="text-xs text-[#A7AFBC] font-mono">/100</span>
            </div>
          </div>

          {/* Life Timeline Section */}
          <div className="mt-5">
            <h3 className="text-xs font-semibold text-[#F5F6F8] tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#344B6B]" />
              <span>Verified Life Timeline</span>
            </h3>

            {profile.timeline && profile.timeline.length > 0 ? (
              <div className="space-y-2.5">
                {profile.timeline.map((entry) => (
                  <div key={entry.id} className="p-3 rounded-lg bg-[#1B1E24] border border-[#242831]">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-medium text-[#F5F6F8]">{entry.institution}</span>
                      {getStatusBadge(entry.verificationStatus)}
                    </div>
                    <div className="text-[11px] font-mono text-[#A7AFBC] mt-0.5">
                      {entry.period}
                    </div>
                    <p className="text-xs text-[#A7AFBC] mt-1 leading-relaxed">
                      {entry.description}
                    </p>
                    {entry.peerEndorsementsCount && (
                      <p className="text-[11px] text-emerald-400 mt-1">
                        ✓ {entry.peerEndorsementsCount} peer batchmates endorsed this
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A7AFBC] italic">No timeline entries published.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
