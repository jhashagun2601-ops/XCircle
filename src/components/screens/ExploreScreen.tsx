import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Circle } from '../../types';
import { 
  Search, 
  Sparkles, 
  Users, 
  School, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  SlidersHorizontal, 
  Check, 
  Layers, 
  Award
} from 'lucide-react';

export const ExploreScreen: React.FC = () => {
  const { 
    circles, 
    setActiveCircleId, 
    setCurrentScreen, 
    openVerificationModal 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const categories = [
    { id: 'All', label: 'All Communities', icon: Sparkles },
    { id: 'Schools', label: 'Schools', icon: School },
    { id: 'Colleges', label: 'Colleges', icon: GraduationCap },
    { id: 'Universities', label: 'Universities', icon: Building2 },
    { id: 'Alumni', label: 'Alumni Networks', icon: Award },
    { id: 'Workplaces', label: 'Workplaces', icon: Briefcase },
    { id: 'Batches', label: 'Batches & Cohorts', icon: Layers },
  ];

  const filteredCircles = useMemo(() => {
    return circles.filter((c) => {
      // Category filter
      if (activeCategory !== 'All') {
        if (activeCategory === 'Schools' && c.type !== 'school') return false;
        if (activeCategory === 'Colleges' && c.type !== 'college') return false;
        if (activeCategory === 'Universities' && c.type !== 'university') return false;
        if (activeCategory === 'Alumni' && c.categoryTag !== 'Alumni' && !c.name.toLowerCase().includes('alumni')) return false;
        if (activeCategory === 'Workplaces' && c.type !== 'company' && c.categoryTag !== 'Workplaces') return false;
        if (activeCategory === 'Batches' && c.categoryTag !== 'Batches' && !c.batch.toLowerCase().includes('cohort')) return false;
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesInst = c.institutionName?.toLowerCase().includes(q) || false;
        const matchesBatch = c.batch.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        if (!matchesName && !matchesInst && !matchesBatch && !matchesDesc) return false;
      }

      // Verification filter
      if (selectedVerification !== 'all' && c.verificationStatus !== selectedVerification) {
        return false;
      }

      // Size filter
      if (selectedSize === 'large' && c.membersCount < 200) return false;
      if (selectedSize === 'medium' && (c.membersCount < 50 || c.membersCount >= 200)) return false;
      if (selectedSize === 'small' && c.membersCount >= 50) return false;

      return true;
    });
  }, [circles, activeCategory, searchQuery, selectedVerification, selectedSize]);

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
            Document Verified
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
    <div className="space-y-6 pb-20">
      {/* Header & Editorial Mission */}
      <div className="relative pt-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#344B6B]/20 text-[#A7AFBC] text-xs font-mono uppercase tracking-wider mb-2 border border-[#344B6B]/30">
              <Sparkles className="w-3 h-3 text-[#344B6B]" />
              Community Discovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F6F8] font-display tracking-tight">
              Find Your People
            </h1>
            <p className="text-[#A7AFBC] text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
              Explore authentic communities connected to your schools, universities, batches, and former workplaces. Reconnect with the people who share your journey.
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
              <span>Smart Filters {showFilters ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>

        {/* Discovery Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-[#A7AFBC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities by school, college, batch 2019, alumni network or company..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#142238] border border-[#242831] rounded-lg text-xs sm:text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B] transition-colors"
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

        {/* Categories Bar */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#344B6B] text-[#F5F6F8]'
                    : 'bg-[#142238] hover:bg-[#1B1E24] text-[#A7AFBC] border border-[#242831]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F5F6F8]' : 'text-[#A7AFBC]'}`} />
                <span>{cat.label}</span>
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
                <option value="document_submitted">Document Submitted</option>
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

            {(selectedVerification !== 'all' || selectedSize !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedVerification('all');
                  setSelectedSize('all');
                  setSearchQuery('');
                }}
                className="text-[#A7AFBC] hover:text-[#F5F6F8] underline text-xs"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* PINTEREST-INSPIRED MASONRY COMMUNITY CARDS GRID */}
      {filteredCircles.length === 0 ? (
        <div className="bg-[#142238] rounded-xl p-12 text-center border border-[#242831]">
          <Layers className="w-10 h-10 text-[#A7AFBC]/40 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-[#F5F6F8]">No matching communities found</h3>
          <p className="text-xs text-[#A7AFBC] mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or exploring across all institution categories.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredCircles.map((circle, index) => {
            const isTall = circle.cardHeight === 'tall' || index % 3 === 0;
            const isMedium = circle.cardHeight === 'medium' || index % 3 === 1;

            return (
              <div
                key={circle.id}
                className="break-inside-avoid bg-[#142238] rounded-xl overflow-hidden border border-[#242831] hover:border-[#344B6B] transition-colors group flex flex-col cursor-pointer shadow-lg"
                onClick={() => handleOpenCommunity(circle.id)}
              >
                {/* Visual Cover Photograph with subtle hover zoom */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101827]/90 via-[#101827]/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-mono text-[#F5F6F8] uppercase tracking-wider bg-[#101827]/80 backdrop-blur-md px-2 py-0.5 rounded border border-[#242831]">
                      {circle.categoryTag || circle.type}
                    </span>

                    {getVerificationBadge(circle.verificationStatus)}
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[#F5F6F8]">
                    <p className="text-xs font-semibold text-[#F5F6F8]">
                      {circle.institutionName || circle.name}
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

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F6F8] font-display group-hover:text-white transition-colors leading-snug">
                      {circle.name}
                    </h3>
                    <p className="text-xs text-[#A7AFBC] mt-1 leading-relaxed line-clamp-2">
                      {circle.description}
                    </p>
                  </div>

                  {/* Recent Activity Highlight */}
                  {circle.recentActivity && (
                    <div className="p-2 rounded-md bg-[#1B1E24] border border-[#242831] text-[11px] text-[#A7AFBC] leading-snug">
                      <span className="text-[#F5F6F8] font-medium">Latest: </span>
                      {circle.recentActivity}
                    </div>
                  )}

                  {/* Card Action Strip */}
                  <div className="pt-2.5 border-t border-[#242831] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#A7AFBC]">
                      {circle.isJoined ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                          Joined
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#A7AFBC]">Open Circle</span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCommunity(circle.id);
                      }}
                      className="px-2.5 py-1 rounded-md bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
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
            Alumni Reconnection
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-display">
            "Find your people. Rediscover your circle."
          </h2>
          <p className="text-[#A7AFBC] text-xs leading-relaxed">
            Every circle on XCircle is built on real shared memories, verified peer milestones, and lifelong alumni bonds. Can't find your batch? Start a new Circle in seconds.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveCircleId(circles[0].id);
            setCurrentScreen('circles');
          }}
          className="px-4 py-2 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium transition-colors self-start md:self-auto shrink-0 flex items-center gap-2"
        >
          <span>Create or Join Circle</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
