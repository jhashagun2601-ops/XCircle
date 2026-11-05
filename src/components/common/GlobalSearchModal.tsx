import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  X, 
  School, 
  Building2, 
  Users, 
  GraduationCap, 
  ArrowRight
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    searchModalOpen, 
    setSearchModalOpen, 
    radarProfiles, 
    circles, 
    openProfileModal, 
    setActiveCircleId, 
    setCurrentScreen 
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'people' | 'circles' | 'institutions'>('all');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  useEffect(() => {
    if (!searchModalOpen) {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [searchModalOpen]);

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { people: [], circles: [], institutions: [] };

    const people = radarProfiles.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.institution.toLowerCase().includes(q) ||
      p.batch.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      (p.sharedReason && p.sharedReason.toLowerCase().includes(q))
    );

    const matchedCircles = circles.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.batch.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q)
    );

    const institutionNames = [
      { name: 'DPS Noida (Delhi Public School)', type: 'School · Sector 30, Noida', count: '128 alumni on XCircle' },
      { name: 'Delhi University (DU)', type: 'University · New Delhi', count: '86 alumni on XCircle' },
      { name: 'BITS Pilani', type: 'Institute · Pilani Campus', count: '54 alumni on XCircle' },
      { name: 'IIT Delhi', type: 'Institute · Hauz Khas', count: '342 alumni on XCircle' },
      { name: 'LAMP Fellowship', type: 'Policy Cohort · PRS India', count: '48 fellows' }
    ].filter(inst => 
      inst.name.toLowerCase().includes(q) || 
      inst.type.toLowerCase().includes(q)
    );

    return {
      people: selectedCategory === 'all' || selectedCategory === 'people' ? people : [],
      circles: selectedCategory === 'all' || selectedCategory === 'circles' ? matchedCircles : [],
      institutions: selectedCategory === 'all' || selectedCategory === 'institutions' ? institutionNames : []
    };
  }, [query, selectedCategory, radarProfiles, circles]);

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#142238] rounded-xl border border-[#242831] shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-[#242831] bg-[#142238] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#A7AFBC] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search school batches, alumni names, circles, colleagues..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#A7AFBC] hover:text-[#F5F6F8] px-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1 rounded-md text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#1B1E24]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2 bg-[#1B1E24] border-b border-[#242831] flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'people', label: 'People' },
            { id: 'circles', label: 'Circles' },
            { id: 'institutions', label: 'Schools & Colleges' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#344B6B] text-[#F5F6F8]'
                  : 'text-[#A7AFBC] hover:text-[#F5F6F8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Stream */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-[#A7AFBC]">
              <p>Type to search across schools, alumni, colleagues and verified batch circles.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {['DPS Noida', 'Batch 2019', 'Delhi University', 'BITS Pilani', 'Riya S.'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-md bg-[#1B1E24] border border-[#242831] text-xs text-[#F5F6F8] hover:border-[#344B6B]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* People Results */}
              {searchResults.people.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#A7AFBC] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#344B6B]" />
                    <span>People ({searchResults.people.length})</span>
                  </h3>
                  <div className="space-y-1.5">
                    {searchResults.people.map(person => (
                      <div
                        key={person.id}
                        onClick={() => {
                          openProfileModal(person);
                          setSearchModalOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-[#1B1E24] border border-[#242831] hover:border-[#344B6B] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={person.avatar}
                            alt={person.name}
                            className="w-8 h-8 rounded-md object-cover border border-[#242831]"
                          />
                          <div>
                            <p className="text-xs font-medium text-[#F5F6F8]">{person.name}</p>
                            <p className="text-[11px] text-[#A7AFBC]">{person.institution} · {person.batch}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A7AFBC]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Circles Results */}
              {searchResults.circles.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#A7AFBC] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#344B6B]" />
                    <span>Circles ({searchResults.circles.length})</span>
                  </h3>
                  <div className="space-y-1.5">
                    {searchResults.circles.map(circle => (
                      <div
                        key={circle.id}
                        onClick={() => {
                          setActiveCircleId(circle.id);
                          setCurrentScreen('circles');
                          setSearchModalOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-[#1B1E24] border border-[#242831] hover:border-[#344B6B] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-medium text-[#F5F6F8]">{circle.name}</p>
                          <p className="text-[11px] text-[#A7AFBC]">{circle.membersCount} members · {circle.batch}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A7AFBC]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Institutions Results */}
              {searchResults.institutions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#A7AFBC] flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-[#344B6B]" />
                    <span>Institutions ({searchResults.institutions.length})</span>
                  </h3>
                  <div className="space-y-1.5">
                    {searchResults.institutions.map(inst => (
                      <div
                        key={inst.name}
                        onClick={() => {
                          setSearchModalOpen(false);
                          setCurrentScreen('explore');
                        }}
                        className="p-2.5 rounded-lg bg-[#1B1E24] border border-[#242831] hover:border-[#344B6B] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-medium text-[#F5F6F8]">{inst.name}</p>
                          <p className="text-[11px] text-[#A7AFBC]">{inst.type} · {inst.count}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A7AFBC]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.people.length === 0 && searchResults.circles.length === 0 && searchResults.institutions.length === 0 && (
                <div className="py-8 text-center text-xs text-[#A7AFBC]">
                  No matching results found for "{query}".
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
