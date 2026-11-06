import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Circle, CircleMajorCategory } from '../../types';
import { 
  Search, 
  Sparkles, 
  Users, 
  GraduationCap, 
  Building2, 
  Home, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  SlidersHorizontal, 
  Check, 
  Clock, 
  Layers, 
  Award,
  Lock,
  Compass,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

export const ExploreScreen: React.FC = () => {
  const { 
    circles, 
    setActiveCircleId, 
    setCurrentScreen, 
    openVerificationModal,
    requests
  } = useApp();

  // Major Category Tab: 'all' | 'academic' | 'employer' | 'apartment_local'
  const [selectedMajorCategory, setSelectedMajorCategory] = useState<'all' | CircleMajorCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedMembershipFilter, setSelectedMembershipFilter] = useState<'all' | 'joined' | 'not_joined'>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // The 3 Major Categories + All
  const majorCategories = [
    {
      id: 'all' as const,
      label: 'All Communities',
      icon: Sparkles,
      description: 'Discover across Academic, Employer, and Local residential networks',
      badge: `${circles.length} Circles`,
    },
    {
      id: 'academic' as const,
      label: 'Academic Circles',
      icon: GraduationCap,
      description: 'Schools, colleges, universities, batches, and degree departments',
      badge: `${circles.filter(c => c.category === 'academic').length} Circles`,
    },
    {
      id: 'employer' as const,
      label: 'Employer Circles',
      icon: Building2,
      description: 'Workplace clans, companies, tech alumni, and departmental batches',
      badge: `${circles.filter(c => c.category === 'employer').length} Circles`,
    },
    {
      id: 'apartment_local' as const,
      label: 'Apartment & Local Circles',
      icon: Home,
      description: 'Residential societies, neighborhoods & gated communities (privacy-first)',
      badge: `${circles.filter(c => c.category === 'apartment_local').length} Circles`,
    },
  ];

  // User pending requests count
  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'reviewing');

  const filteredCircles = useMemo(() => {
    return circles.filter((c) => {
      // 1. Major Category Filter
      if (selectedMajorCategory !== 'all' && c.category !== selectedMajorCategory) {
        return false;
      }

      // 2. Search Query Filter (Searches Name, Institution, Company, Locality, Batch, Description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesInst = c.institutionName?.toLowerCase().includes(q) || false;
        const matchesCompany = c.companyName?.toLowerCase().includes(q) || false;
        const matchesLocality = c.locality?.toLowerCase().includes(q) || false;
        const matchesBatch = c.batch.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);

        if (!matchesName && !matchesInst && !matchesCompany && !matchesLocality && !matchesBatch && !matchesDesc) {
          return false;
        }
      }

      // 3. Verification Status Filter
      if (selectedVerification !== 'all' && c.verificationStatus !== selectedVerification) {
        return false;
      }

      // 4. Community Size Filter
      if (selectedSize === 'large' && c.membersCount < 200) return false;
      if (selectedSize === 'medium' && (c.membersCount < 50 || c.membersCount >= 200)) return false;
      if (selectedSize === 'small' && c.membersCount >= 50) return false;

      // 5. Membership Filter
      if (selectedMembershipFilter === 'joined' && !c.isJoined) return false;
      if (selectedMembershipFilter === 'not_joined' && c.isJoined) return false;

      return true;
    });
  }, [circles, selectedMajorCategory, searchQuery, selectedVerification, selectedSize, selectedMembershipFilter]);

  const handleOpenCommunity = (circleId: string) => {
    setActiveCircleId(circleId);
    setCurrentScreen('circles');
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'peer_confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Peer Confirmed
          </span>
        );
      case 'document_reviewed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            Document Reviewed
          </span>
        );
      case 'document_submitted':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
            <Award className="w-3 h-3 text-purple-400" />
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

  const getCategoryBadge = (category: CircleMajorCategory) => {
    switch (category) {
      case 'academic':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
            <GraduationCap className="w-3 h-3" />
            Academic Circle
          </span>
        );
      case 'employer':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            <Building2 className="w-3 h-3" />
            Employer Circle
          </span>
        );
      case 'apartment_local':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <Home className="w-3 h-3" />
            Apartment & Local Circle
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Editorial Mission */}
      <div className="relative pt-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#344B6B]/20 text-[#A7AFBC] text-xs font-mono uppercase tracking-wider mb-2 border border-[#344B6B]/30">
              <Compass className="w-3 h-3 text-[#344B6B]" />
              Community Discovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F6F8] font-display tracking-tight">
              Find Your People
            </h1>
            <p className="text-[#A7AFBC] text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
              Discover authentic communities connected to your schools, universities, workplaces, and residential societies. Reconnect with the people who share your journey.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                showFilters 
                  ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]' 
                  : 'bg-[#142238] hover:bg-[#1B1E24] text-[#A7AFBC] border-[#242831]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {showFilters ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>

        {/* Pending Requests Alert Banner */}
        {pendingRequests.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-[#142238] border border-[#344B6B]/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[#F5F6F8]">
                You have <strong>{pendingRequests.length}</strong> active community join request{pendingRequests.length > 1 ? 's' : ''} under review.
              </span>
            </div>
            <button
              onClick={() => setCurrentScreen('requests')}
              className="text-xs text-[#344B6B] hover:text-[#4c6a94] font-medium flex items-center gap-1 underline"
            >
              <span>Track Requests</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Discovery Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-[#A7AFBC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities by school, college, company, residential society, batch, or locality..."
            className="w-full pl-10 pr-16 py-2.5 bg-[#142238] border border-[#242831] rounded-lg text-xs sm:text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
            >
              Clear
            </button>
          )}
        </div>

        {/* =========================================================================
            THREE MAJOR CATEGORIES BAR
            Academic Circles + Employer Circles + Apartment & Local Circles
            ========================================================================= */}
        <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {majorCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedMajorCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedMajorCategory(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#344B6B] border-[#4c6a94] text-[#F5F6F8] shadow-lg'
                    : 'bg-[#142238] border-[#242831] hover:border-[#344B6B] text-[#A7AFBC] hover:text-[#F5F6F8]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'bg-[#1B1E24] text-[#344B6B]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isActive ? 'bg-white/15 text-white' : 'bg-[#1B1E24] text-[#A7AFBC] border border-[#242831]'
                  }`}>
                    {cat.badge}
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className={`text-xs font-bold font-display ${isActive ? 'text-white' : 'text-[#F5F6F8]'}`}>
                    {cat.label}
                  </h3>
                  <p className={`text-[11px] line-clamp-1 mt-0.5 ${isActive ? 'text-white/80' : 'text-[#A7AFBC]'}`}>
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Collapsible Smart Filters */}
        {showFilters && (
          <div className="mt-3 p-3.5 bg-[#142238] rounded-lg border border-[#242831] flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#A7AFBC]">Verification:</span>
              <select
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
                className="px-2.5 py-1 bg-[#1B1E24] border border-[#242831] rounded-md text-[#F5F6F8] text-xs focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">All Verification Statuses</option>
                <option value="peer_confirmed">Peer Confirmed</option>
                <option value="document_reviewed">Document Reviewed</option>
                <option value="document_submitted">Document Verified</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#A7AFBC]">Community Size:</span>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="px-2.5 py-1 bg-[#1B1E24] border border-[#242831] rounded-md text-[#F5F6F8] text-xs focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">Any Size</option>
                <option value="large">Large (200+ members)</option>
                <option value="medium">Medium (50–200 members)</option>
                <option value="small">Small (&lt;50 members)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#A7AFBC]">Membership:</span>
              <select
                value={selectedMembershipFilter}
                onChange={(e) => setSelectedMembershipFilter(e.target.value as any)}
                className="px-2.5 py-1 bg-[#1B1E24] border border-[#242831] rounded-md text-[#F5F6F8] text-xs focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">All Circles</option>
                <option value="joined">Circles I've Joined</option>
                <option value="not_joined">Open to Join</option>
              </select>
            </div>

            {(selectedVerification !== 'all' || selectedSize !== 'all' || selectedMembershipFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedVerification('all');
                  setSelectedSize('all');
                  setSelectedMembershipFilter('all');
                  setSearchQuery('');
                }}
                className="text-[#A7AFBC] hover:text-[#F5F6F8] underline text-xs ml-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          COMMUNITY CARDS GRID
          Tailored to Academic, Employer, and Apartment/Local Categories
          ========================================================================= */}
      {filteredCircles.length === 0 ? (
        <div className="bg-[#142238] rounded-xl p-12 text-center border border-[#242831] shadow-xl">
          <Layers className="w-10 h-10 text-[#A7AFBC]/40 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-[#F5F6F8]">No matching communities found</h3>
          <p className="text-xs text-[#A7AFBC] mt-1 max-w-sm mx-auto">
            Try adjusting your search query or exploring across Academic, Employer, or Apartment circle categories.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredCircles.map((circle, index) => {
            const isTall = circle.cardHeight === 'tall' || index % 3 === 0;
            const isMedium = circle.cardHeight === 'medium' || index % 3 === 1;

            // Check if there is a pending request for this circle
            const userRequest = requests.find(r => r.circleId === circle.id);

            return (
              <div
                key={circle.id}
                className="break-inside-avoid bg-[#142238] rounded-xl overflow-hidden border border-[#242831] hover:border-[#344B6B] transition-colors group flex flex-col cursor-pointer shadow-lg"
                onClick={() => handleOpenCommunity(circle.id)}
              >
                {/* Visual Cover Photograph */}
                <div 
                  className={`relative overflow-hidden bg-[#1B1E24] ${
                    isTall ? 'aspect-4/3' : isMedium ? 'aspect-16/10' : 'aspect-16/9'
                  }`}
                >
                  <img
                    src={circle.coverImage}
                    alt={circle.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101827]/90 via-[#101827]/35 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
                    {getCategoryBadge(circle.category)}
                    {getVerificationBadge(circle.verificationStatus)}
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[#F5F6F8]">
                    <p className="text-xs font-semibold text-[#F5F6F8] truncate">
                      {circle.companyName || circle.institutionName || circle.societyName || circle.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#A7AFBC] mt-0.5 font-mono">
                      <span>{circle.batch}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#A7AFBC]" />
                        {circle.membersCount} Members
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content Tailored by Category */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F6F8] font-display group-hover:text-white transition-colors leading-snug">
                      {circle.name}
                    </h3>
                    <p className="text-xs text-[#A7AFBC] mt-1 leading-relaxed line-clamp-2">
                      {circle.description}
                    </p>
                  </div>

                  {/* CATEGORY A: EMPLOYER SPECIFICS */}
                  {circle.category === 'employer' && (
                    <div className="p-2.5 rounded-lg bg-[#1B1E24] border border-[#242831] space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-[#A7AFBC]">
                        <span className="flex items-center gap-1 text-[#F5F6F8] font-medium">
                          <Building2 className="w-3 h-3 text-[#344B6B]" />
                          {circle.companyName}
                        </span>
                        {circle.workplaceDomain && (
                          <span className="font-mono text-[10px] text-amber-300">
                            @{circle.workplaceDomain}
                          </span>
                        )}
                      </div>
                      {circle.employeeCommunity && (
                        <p className="text-[#A7AFBC] text-[10px] truncate">
                          {circle.employeeCommunity}
                        </p>
                      )}
                    </div>
                  )}

                  {/* CATEGORY B: APARTMENT & LOCAL SPECIFICS (Privacy-First) */}
                  {circle.category === 'apartment_local' && (
                    <div className="p-2.5 rounded-lg bg-[#1B1E24] border border-[#242831] space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-[#A7AFBC]">
                        <span className="flex items-center gap-1 text-[#F5F6F8] font-medium">
                          <Home className="w-3 h-3 text-emerald-400" />
                          {circle.locality}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {circle.city}
                        </span>
                      </div>
                      {circle.privacyNotice && (
                        <div className="flex items-center gap-1 text-[10px] text-[#A7AFBC] leading-tight">
                          <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          <span className="line-clamp-1">{circle.privacyNotice}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CATEGORY C: ACADEMIC SPECIFICS */}
                  {circle.category === 'academic' && circle.recentActivity && (
                    <div className="p-2 rounded-md bg-[#1B1E24] border border-[#242831] text-[11px] text-[#A7AFBC] leading-snug">
                      <span className="text-[#F5F6F8] font-medium">Latest: </span>
                      {circle.recentActivity}
                    </div>
                  )}

                  {/* Action Strip: Join Request & View Status */}
                  <div className="pt-2.5 border-t border-[#242831] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#A7AFBC]">
                      {circle.isJoined ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                          Joined
                        </span>
                      ) : userRequest ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          {userRequest.status === 'reviewing' ? 'Under Review' : 'Pending'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#A7AFBC]">Open Circle</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!circle.isJoined && !userRequest && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openVerificationModal(circle);
                          }}
                          className="px-2.5 py-1 rounded-md bg-[#1B1E24] hover:bg-[#242831] text-[#F5F6F8] border border-[#242831] text-xs font-medium transition-colors"
                        >
                          Request Join
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCommunity(circle.id);
                        }}
                        className="px-2.5 py-1 rounded-md bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <span>{circle.isJoined ? 'Enter' : 'View'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Discovery Philosophy Callout Banner */}
      <div className="mt-8 p-6 rounded-xl bg-[#142238] border border-[#242831] text-[#F5F6F8] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <span className="text-xs font-mono text-[#344B6B] uppercase tracking-wider">
            Reconnection Ecosystem
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-display">
            "Three Circles of Life: Academic · Employer · Local Community"
          </h2>
          <p className="text-[#A7AFBC] text-xs leading-relaxed">
            Whether reconnecting with your high school canteen friends, exploring startup alumni networks, or meeting verified neighbors in your apartment society — XCircle connects you with privacy and peer verification.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveCircleId(circles[0].id);
            setCurrentScreen('circles');
          }}
          className="px-4 py-2 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium transition-colors self-start md:self-auto shrink-0 flex items-center gap-2"
        >
          <span>Go to My Circles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
