import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Radio, 
  Layers, 
  ChevronRight,
  Compass
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    currentUser, 
    circles, 
    radarProfiles, 
    setCurrentScreen, 
    setActiveCircleId, 
    openProfileModal, 
    setSearchModalOpen,
    toggleConnect
  } = useApp();

  const [searchHeroText, setSearchHeroText] = useState('');

  const featuredCircles = circles.slice(0, 4);
  const recommendedCircles = circles.filter(c => !c.isJoined).slice(0, 3);

  const handleOpenCircle = (circleId: string) => {
    setActiveCircleId(circleId);
    setCurrentScreen('circles');
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHeroText.trim()) {
      setSearchModalOpen(true);
    } else {
      setCurrentScreen('explore');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* =========================================================================
          SECTION A: WELCOME OVERVIEW & METRICS
          ========================================================================= */}
      <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Top greeting with avatar */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#A7AFBC] uppercase tracking-wider">
              <span>Welcome Back</span>
              <span className="text-[#344B6B]">✦</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#F5F6F8] font-display tracking-tight mt-1">
              {currentUser.name}
            </h1>
          </div>

          <button 
            onClick={() => setCurrentScreen('profile')}
            className="w-12 h-12 rounded-xl bg-[#1B1E24] border border-[#242831] hover:border-[#344B6B] flex items-center justify-center transition-colors"
            title="View Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          </button>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleHeroSearch} className="relative">
          <input
            type="text"
            value={searchHeroText}
            onChange={(e) => setSearchHeroText(e.target.value)}
            placeholder="Search school, college, batch, alumni or company..."
            className="w-full pl-4 pr-11 py-3 bg-[#1B1E24] border border-[#242831] rounded-lg text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/60 focus:outline-none focus:border-[#344B6B] transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] flex items-center justify-center transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card 1: 6 My Circles */}
          <div
            onClick={() => setCurrentScreen('circles')}
            className="p-5 bg-[#1B1E24] border border-[#242831] hover:border-[#344B6B] rounded-lg transition-colors cursor-pointer flex flex-col justify-between"
          >
            <span className="text-3xl sm:text-5xl font-bold font-display text-[#F5F6F8] tracking-tight">
              6
            </span>
            <div className="mt-3 flex items-center justify-between text-xs sm:text-sm text-[#A7AFBC]">
              <span className="font-medium text-[#F5F6F8]">My Circles</span>
              <ChevronRight className="w-4 h-4 text-[#A7AFBC]" />
            </div>
          </div>

          {/* Card 2: 7 Radar matches */}
          <div
            onClick={() => setCurrentScreen('radar')}
            className="p-5 bg-[#1B1E24] border border-[#242831] hover:border-[#344B6B] rounded-lg transition-colors cursor-pointer flex flex-col justify-between"
          >
            <span className="text-3xl sm:text-5xl font-bold font-display text-[#F5F6F8] tracking-tight">
              7
            </span>
            <div className="mt-3 flex items-center justify-between text-xs sm:text-sm text-[#A7AFBC]">
              <span className="font-medium text-[#F5F6F8]">Radar Matches</span>
              <ChevronRight className="w-4 h-4 text-[#A7AFBC]" />
            </div>
          </div>
        </div>

        {/* RADAR PREVIEW */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#F5F6F8] font-display tracking-wider uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#344B6B]" />
              <span>Radar Discoveries</span>
            </h2>
            <button
              onClick={() => setCurrentScreen('radar')}
              className="text-xs text-[#A7AFBC] hover:text-[#F5F6F8] transition-colors"
            >
              See all
            </button>
          </div>

          <div className="space-y-2.5">
            {radarProfiles.slice(0, 3).map((profile) => (
              <div
                key={profile.id}
                onClick={() => openProfileModal(profile)}
                className="p-3.5 bg-[#1B1E24] border border-[#242831] hover:border-[#344B6B] rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#142238] border border-[#242831] flex items-center justify-center font-bold text-sm text-[#F5F6F8]">
                    {profile.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#F5F6F8] font-display">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-[#A7AFBC]">
                      {profile.sharedReason || 'Shared educational and batch background'}
                    </p>
                    <div className="mt-1">
                      <span className="inline-block text-[10px] font-mono text-[#A7AFBC] bg-[#142238] border border-[#242831] rounded px-2 py-0.5">
                        {profile.batch} · {profile.institution}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleConnect(profile.id);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    profile.isConnected 
                      ? 'bg-[#142238] text-[#A7AFBC] border border-[#242831]' 
                      : 'bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8]'
                  }`}
                >
                  {profile.isConnected ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION B: REUNION PLANNER BANNER
          ========================================================================= */}
      <section className="p-6 rounded-xl bg-[#142238] border border-[#242831] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A7AFBC] uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#344B6B]" />
            <span>Reunion Milestone</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#F5F6F8] font-display">
            Batch turns 7 next year. Collaborative dates and venues are active.
          </h2>
          <p className="text-xs text-[#A7AFBC] max-w-xl">
            DPS Noida Class of 2019 summer reunion polls are live on the Reunion Planner.
          </p>
        </div>

        <button
          onClick={() => handleOpenCircle('circle_dps_2019')}
          className="px-4 py-2.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Plan Reunion</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* =========================================================================
          SECTION C: FEATURED COMMUNITIES
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#F5F6F8] font-display tracking-tight">
              Featured Communities
            </h2>
            <p className="text-xs text-[#A7AFBC] mt-0.5">
              Explore school, college, and alumni networks looking for their batchmates.
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('explore')}
            className="px-3 py-1.5 rounded-lg bg-[#142238] hover:bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#344B6B]" />
            <span>Explore All</span>
          </button>
        </div>

        {/* Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCircles.map((circle) => (
            <div
              key={circle.id}
              onClick={() => handleOpenCircle(circle.id)}
              className="group bg-[#142238] border border-[#242831] hover:border-[#344B6B] rounded-xl overflow-hidden transition-colors flex flex-col justify-between cursor-pointer shadow-lg"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-[#1B1E24] border-b border-[#242831]">
                  <img
                    src={circle.coverImage}
                    alt={circle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono text-[#F5F6F8] uppercase tracking-wider bg-[#101827]/80 backdrop-blur-md border border-[#242831] px-2 py-0.5 rounded">
                      {circle.category === 'employer' ? 'Employer Circle' : circle.category === 'apartment_local' ? 'Apartment & Local' : (circle.categoryTag || 'Academic')}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="text-sm font-semibold text-[#F5F6F8] font-display group-hover:text-[#F5F6F8] transition-colors line-clamp-1">
                    {circle.name}
                  </h3>
                  <p className="text-xs text-[#A7AFBC] line-clamp-2 leading-relaxed">
                    {circle.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between text-xs text-[#A7AFBC] border-t border-[#242831]/50 mt-2">
                <span className="text-[11px] font-mono">{circle.membersCount} Members</span>
                <span className="text-xs font-medium text-[#F5F6F8] group-hover:text-white flex items-center gap-0.5">
                  Open Circle →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION D: RECOMMENDED FOR YOU
          ========================================================================= */}
      <section className="bg-[#142238] border border-[#242831] rounded-xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242831] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#344B6B]" />
              <h2 className="text-lg font-bold text-[#F5F6F8] font-display">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs text-[#A7AFBC] mt-0.5">
              Matched automatically to your DPS Noida background and Delhi University alumni degree.
            </p>
          </div>
          <span className="text-xs font-mono text-[#A7AFBC]">Verified Match</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCircles.map((circle) => (
            <div
              key={circle.id}
              onClick={() => handleOpenCircle(circle.id)}
              className="p-4 rounded-lg bg-[#1B1E24] border border-[#242831] hover:border-[#344B6B] transition-colors cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#142238] border border-[#242831] shrink-0">
                    <img src={circle.coverImage} alt={circle.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Peer Confirmed
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[#F5F6F8] mt-2 font-display">
                  {circle.name}
                </h3>
                <p className="text-xs text-[#A7AFBC] font-mono mt-0.5">{circle.batch}</p>

                <div className="mt-2.5 p-2 bg-[#142238] rounded-md text-[11px] text-[#A7AFBC] leading-snug border border-[#242831]">
                  <span className="text-[#F5F6F8] font-medium">Why Recommended: </span>
                  {circle.name.includes('Modern') 
                    ? '14 alumni from your NCR school circuit are members'
                    : circle.name.includes('Xavier')
                    ? 'Shared inter-college debate circuit and 8 mutual batchmates'
                    : 'Matches your technology fellowship & university alumni network'}
                </div>
              </div>

              <div className="pt-2 border-t border-[#242831] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#A7AFBC] font-mono">{circle.membersCount} Members</span>
                <span className="text-xs font-medium text-[#F5F6F8] hover:underline">
                  View Community →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
