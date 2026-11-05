import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  Search, 
  Users, 
  MapPin, 
  UserPlus, 
  UserCheck, 
  MessageSquare,
  GraduationCap,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  Eye
} from 'lucide-react';

export const RadarScreen: React.FC = () => {
  const { 
    radarProfiles, 
    toggleConnect, 
    openProfileModal, 
    setCurrentScreen, 
    setActiveChatId, 
    chats 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [minMutuals, setMinMutuals] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'trust' | 'connections'>('relevance');

  const filteredProfiles = useMemo(() => {
    return radarProfiles.filter(profile => {
      // Query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          profile.name.toLowerCase().includes(q) ||
          profile.institution.toLowerCase().includes(q) ||
          profile.batch.toLowerCase().includes(q) ||
          (profile.sharedReason && profile.sharedReason.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Institution type filter
      if (selectedType !== 'all') {
        const inst = profile.institution.toLowerCase();
        if (selectedType === 'school' && !inst.includes('dps') && !inst.includes('school')) return false;
        if (selectedType === 'college' && !inst.includes('college') && !inst.includes('nid')) return false;
        if (selectedType === 'university' && !inst.includes('university') && !inst.includes('bits') && !inst.includes('iit')) return false;
      }

      // Batch filter
      if (selectedBatch !== 'all' && !profile.batch.includes(selectedBatch)) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all' && !profile.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // Mutuals filter
      if (minMutuals && (!profile.mutualFriendsCount || profile.mutualFriendsCount < 4)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'trust') return b.trustScore - a.trustScore;
      if (sortBy === 'connections') return (b.mutualFriendsCount || 0) - (a.mutualFriendsCount || 0);
      return 0; // relevance
    });
  }, [radarProfiles, searchQuery, selectedType, selectedBatch, selectedLocation, minMutuals, sortBy]);

  const handleStartMessage = (name: string) => {
    const chat = chats.find(c => c.participants.includes(name));
    if (chat) {
      setActiveChatId(chat.id);
    }
    setCurrentScreen('chat');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Radar Discovery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#344B6B]/20 text-[#A7AFBC] text-xs font-mono uppercase tracking-wider border border-[#344B6B]/30">
            <Radio className="w-3.5 h-3.5 text-[#344B6B] animate-pulse" />
            <span>BACKGROUND RADAR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F6F8] font-display tracking-tight mt-1.5">
            Radar Background Discovery
          </h1>
          <p className="text-xs sm:text-sm text-[#A7AFBC] mt-1 max-w-2xl leading-relaxed">
            Find and reconnect with classmates, college friends, alumni, and former colleagues based on verified educational, batch, and workplace history.
          </p>
        </div>

        {/* Total found badge */}
        <div className="bg-[#142238] px-4 py-2.5 rounded-lg border border-[#242831] text-right shrink-0">
          <span className="text-[10px] font-mono text-[#A7AFBC] uppercase tracking-wider block">Matched Profiles</span>
          <span className="text-2xl font-bold font-mono text-[#F5F6F8]">
            {filteredProfiles.length}
          </span>
        </div>
      </div>

      {/* Discovery Filters Bar */}
      <div className="bg-[#142238] border border-[#242831] rounded-xl p-4 sm:p-5 space-y-4 shadow-xl">
        {/* Search input & Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A7AFBC] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, school, college, department or background..."
              className="w-full pl-9 pr-4 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-xs sm:text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#A7AFBC]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-xs text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
            >
              <option value="relevance">Sort: Most Shared Backgrounds</option>
              <option value="trust">Sort: Highest Trust Score</option>
              <option value="connections">Sort: Mutual Connections</option>
            </select>
          </div>
        </div>

        {/* Filter Pills / Segments */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#242831] text-xs">
          {/* Institution Type Filter */}
          <div className="flex items-center gap-1 bg-[#1B1E24] p-1 rounded-lg border border-[#242831]">
            {[
              { id: 'all', label: 'All' },
              { id: 'school', label: 'School' },
              { id: 'college', label: 'College' },
              { id: 'university', label: 'University' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedType === type.id
                    ? 'bg-[#344B6B] text-[#F5F6F8]'
                    : 'text-[#A7AFBC] hover:text-[#F5F6F8]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Batch Selector */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-2.5 py-1.5 bg-[#1B1E24] border border-[#242831] rounded-lg text-xs text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
          >
            <option value="all">Any Batch / Year</option>
            <option value="2019">Batch 2019</option>
            <option value="2020">Batch 2020</option>
            <option value="2024">Batch 2024</option>
          </select>

          {/* Shared Location Selector */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-2.5 py-1.5 bg-[#1B1E24] border border-[#242831] rounded-lg text-xs text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
          >
            <option value="all">Any Location</option>
            <option value="Noida">Noida / NCR</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
          </select>

          {/* High mutuals toggle */}
          <button
            onClick={() => setMinMutuals(!minMutuals)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              minMutuals
                ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]'
                : 'bg-[#1B1E24] text-[#A7AFBC] border-[#242831] hover:text-[#F5F6F8]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4+ Mutual Connections</span>
          </button>

          {(selectedType !== 'all' || selectedBatch !== 'all' || selectedLocation !== 'all' || minMutuals || searchQuery) && (
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedBatch('all');
                setSelectedLocation('all');
                setMinMutuals(false);
                setSearchQuery('');
              }}
              className="text-[#A7AFBC] hover:text-[#F5F6F8] px-2 py-1 text-xs underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Discovery Privacy Clarification */}
      <div className="p-3 bg-[#142238] rounded-lg border border-[#242831] flex items-center justify-between text-xs text-[#A7AFBC]">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Radar relies on voluntarily declared education, batch, and workplace backgrounds. GPS location access is never required.</span>
        </span>
      </div>

      {/* Radar Cards Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="bg-[#142238] rounded-xl p-12 text-center border border-[#242831]">
          <Radio className="w-8 h-8 text-[#A7AFBC]/40 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-[#F5F6F8]">No radar matches found</h3>
          <p className="text-xs text-[#A7AFBC] mt-1 max-w-sm mx-auto">
            Try loosening your filters or searching with a different batch year or institution name.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-[#142238] border border-[#242831] hover:border-[#344B6B] rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-colors shadow-lg"
            >
              <div>
                {/* Avatar & Trust Score Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#242831]"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-[#142238]" />
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#A7AFBC] uppercase tracking-wider block">Trust Score</span>
                    <span className="text-sm font-bold font-mono text-[#F5F6F8]">
                      {profile.trustScore} / 100
                    </span>
                  </div>
                </div>

                {/* Identity & Institution */}
                <h3 className="text-base font-semibold text-[#F5F6F8] font-display">
                  {profile.name}
                </h3>
                <p className="text-xs text-[#A7AFBC] mt-0.5 font-medium">
                  {profile.institution} · <span className="font-mono">{profile.batch}</span>
                </p>

                {/* Reconnection Reason Highlight */}
                <div className="mt-3 p-2.5 bg-[#1B1E24] rounded-lg border border-[#242831] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#F5F6F8]">
                    <Sparkles className="w-3 h-3 text-[#344B6B]" />
                    <span>Shared Background</span>
                  </div>
                  <p className="text-[11px] text-[#A7AFBC] leading-relaxed">
                    {profile.sharedReason || 'Shared educational and batch background'}
                  </p>
                </div>

                {/* Mutuals and Location */}
                <div className="mt-3 flex items-center justify-between text-xs text-[#A7AFBC]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{profile.mutualFriendsCount} mutual friends</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{profile.location}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3.5 mt-3.5 border-t border-[#242831] flex items-center gap-2">
                <button
                  onClick={() => openProfileModal(profile)}
                  className="flex-1 py-1.5 px-3 rounded-md bg-[#1B1E24] hover:bg-[#242831] text-[#F5F6F8] text-xs font-medium border border-[#242831] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                {profile.isConnected ? (
                  <button
                    onClick={() => handleStartMessage(profile.name)}
                    className="flex-1 py-1.5 px-3 rounded-md bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                ) : (
                  <button
                    onClick={() => toggleConnect(profile.id)}
                    className="flex-1 py-1.5 px-3 rounded-md bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
