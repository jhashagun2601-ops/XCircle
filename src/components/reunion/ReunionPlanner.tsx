import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Check, 
  Users, 
  Clock, 
  Plus, 
  Vote, 
  Sparkles,
  PartyPopper,
  Share2
} from 'lucide-react';

export const ReunionPlanner: React.FC = () => {
  const { reunion, voteReunionDate, rsvpReunion, showToast, currentUser } = useApp();
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [newDateStr, setNewDateStr] = useState('');
  const [newLocationStr, setNewLocationStr] = useState('');

  const totalVotes = reunion.proposedDates.reduce((acc, opt) => acc + opt.votes, 0);

  const handleSuggestDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateStr) return;
    showToast('Suggested date proposal submitted to batch committee!');
    setShowSuggestModal(false);
    setNewDateStr('');
    setNewLocationStr('');
  };

  return (
    <div className="space-y-5">
      {/* Prominent Reunion Due Announcement Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#142238] border border-[#344B6B] text-[#F5F6F8] p-6 shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#344B6B]/20 text-[#A7AFBC] border border-[#344B6B]/30 text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#344B6B]" />
            <span>REUNION MILESTONE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight leading-tight text-[#F5F6F8]">
            Batch turns 7 next year. <br className="hidden sm:inline" />
            Start planning with one tap.
          </h2>

          <p className="text-[#A7AFBC] text-xs sm:text-sm max-w-xl leading-relaxed">
            {reunion.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#rsvp-section"
              className="px-4 py-2 rounded-lg bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <PartyPopper className="w-4 h-4" />
              <span>RSVP: {reunion.userRsvp ? `You are ${reunion.userRsvp.toUpperCase()}` : 'Confirm Attendance'}</span>
            </a>

            <button
              onClick={() => {
                navigator.clipboard?.writeText?.(window.location.href);
                showToast('Reunion invitation link copied to clipboard!');
              }}
              className="px-4 py-2 rounded-lg bg-[#1B1E24] hover:bg-[#242831] border border-[#242831] text-[#F5F6F8] text-xs font-medium transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share with Batch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Voting & Poll Section */}
      <div className="bg-[#142238] border border-[#242831] rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#242831]">
          <div>
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-[#344B6B]" />
              <h3 className="text-base font-bold text-[#F5F6F8] font-display">
                Vote for Batch Reunion Date
              </h3>
            </div>
            <p className="text-xs text-[#A7AFBC] mt-0.5">
              Cast your vote so the organizing committee can secure the campus amphitheater & hall permits.
            </p>
          </div>

          <button
            onClick={() => setShowSuggestModal(true)}
            className="px-3 py-1.5 rounded-lg border border-[#242831] hover:border-[#344B6B] text-[#F5F6F8] bg-[#1B1E24] text-xs font-medium flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Suggest Date</span>
          </button>
        </div>

        {/* Voting Options */}
        <div className="space-y-3">
          {reunion.proposedDates.map((opt) => {
            const hasVoted = opt.voterNames.includes(currentUser.name);
            const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

            return (
              <div
                key={opt.id}
                onClick={() => voteReunionDate(opt.id)}
                className={`p-4 rounded-lg border transition-colors cursor-pointer relative overflow-hidden ${
                  hasVoted
                    ? 'bg-[#1B1E24] border-[#344B6B]'
                    : 'bg-[#1B1E24]/60 border-[#242831] hover:border-[#344B6B]'
                }`}
              >
                {/* Background progress fill */}
                <div 
                  className="absolute inset-y-0 left-0 bg-[#344B6B]/20 transition-all duration-300 pointer-events-none"
                  style={{ width: `${percentage}%` }}
                />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#F5F6F8]">{opt.dateStr}</span>
                      {hasVoted && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Your Vote
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#A7AFBC]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{opt.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-[#F5F6F8]">
                        {opt.votes}
                      </span>
                      <span className="text-xs text-[#A7AFBC] ml-1 font-mono">({percentage}%)</span>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        hasVoted
                          ? 'bg-[#344B6B] text-[#F5F6F8]'
                          : 'bg-[#142238] border border-[#242831] text-[#A7AFBC] hover:text-[#F5F6F8]'
                      }`}
                    >
                      {hasVoted ? 'Voted' : 'Vote'}
                    </button>
                  </div>
                </div>

                <div className="relative z-10 mt-2 pt-2 border-t border-[#242831]/60 text-[11px] text-[#A7AFBC]">
                  Voted by: <span className="text-[#F5F6F8]">{opt.voterNames.join(', ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RSVP & Attendance Confirmation */}
      <div id="rsvp-section" className="bg-[#142238] border border-[#242831] rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-[#F5F6F8] font-display flex items-center gap-2">
            <Users className="w-4 h-4 text-[#344B6B]" />
            <span>Attendance & Headcount</span>
          </h3>
          <p className="text-xs text-[#A7AFBC] mt-0.5">
            Let everyone know if you can make it back to campus for our reunion.
          </p>
        </div>

        {/* RSVP Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'going', label: "I'm Going! 🎉", count: reunion.rsvps.going },
            { id: 'maybe', label: 'Maybe 🤔', count: reunion.rsvps.maybe },
            { id: 'cantGo', label: "Can't Go 😢", count: reunion.rsvps.cantGo },
          ].map((item) => {
            const isSelected = reunion.userRsvp === item.id;
            return (
              <button
                key={item.id}
                onClick={() => rsvpReunion(item.id as any)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  isSelected 
                    ? 'bg-[#344B6B] border-[#344B6B] text-[#F5F6F8]' 
                    : 'bg-[#1B1E24] border-[#242831] text-[#A7AFBC] hover:border-[#344B6B] hover:text-[#F5F6F8]'
                }`}
              >
                <div className="text-xs font-medium">{item.label}</div>
                <div className="text-lg font-bold font-mono mt-1 text-[#F5F6F8]">
                  {item.count}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider block mt-0.5 text-[#A7AFBC]">
                  confirmed
                </span>
              </button>
            );
          })}
        </div>

        {/* Event Schedule Outline */}
        <div className="pt-3 border-t border-[#242831]">
          <p className="text-xs font-semibold text-[#F5F6F8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#344B6B]" />
            <span>Tentative Reunion Day Schedule</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#1B1E24] rounded-lg border border-[#242831]">
              <span className="font-mono text-[11px] text-[#A7AFBC]">11:00 AM – 01:00 PM</span>
              <p className="font-semibold text-[#F5F6F8] mt-1">Campus Walk & Canteen Chai</p>
              <p className="text-[11px] text-[#A7AFBC] mt-0.5">Relive classrooms, corridors, and iconic snack tables.</p>
            </div>
            <div className="p-3 bg-[#1B1E24] rounded-lg border border-[#242831]">
              <span className="font-mono text-[11px] text-[#A7AFBC]">02:30 PM – 05:00 PM</span>
              <p className="font-semibold text-[#F5F6F8] mt-1">Amphitheater Throwback & Photos</p>
              <p className="text-[11px] text-[#A7AFBC] mt-0.5">Recreating our batch photograph with everyone.</p>
            </div>
            <div className="p-3 bg-[#1B1E24] rounded-lg border border-[#242831]">
              <span className="font-mono text-[11px] text-[#A7AFBC]">07:00 PM Onwards</span>
              <p className="font-semibold text-[#F5F6F8] mt-1">Alumni Banquet Dinner & Jam</p>
              <p className="text-[11px] text-[#A7AFBC] mt-0.5">Live acoustic jam and catching up into the night.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggest Date Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-[#F5F6F8] font-display">Suggest a Reunion Date</h3>
            <p className="text-xs text-[#A7AFBC] mt-0.5">
              Have a weekend that works better for batchmates traveling from out-of-town?
            </p>

            <form onSubmit={handleSuggestDate} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Proposed Date</label>
                <input
                  type="text"
                  placeholder="e.g. Saturday, August 15, 2026"
                  value={newDateStr}
                  onChange={(e) => setNewDateStr(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Preferred Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. School Courtyard & Delhi Golf Club"
                  value={newLocationStr}
                  onChange={(e) => setNewLocationStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSuggestModal(false)}
                  className="px-3.5 py-1.5 text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium rounded-lg transition-colors"
                >
                  Submit Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
