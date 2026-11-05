import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestStatus } from '../../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  PlusCircle, 
  ChevronLeft,
  Users
} from 'lucide-react';

export const RequestsScreen: React.FC = () => {
  const { 
    requests, 
    cancelRequest, 
    updateRequestStatus, 
    adminMode, 
    toggleAdminMode,
    openVerificationModal,
    circles,
    setCurrentScreen
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewing' | 'approved'>('all');

  const filteredRequests = requests.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className="w-9 h-9 rounded-lg bg-[#142238] border border-[#242831] hover:border-[#344B6B] flex items-center justify-center text-[#F5F6F8] transition-colors"
            title="Back to Home"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F8] font-display uppercase tracking-tight">
            Requests & Verification
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Mode toggle */}
          <button
            onClick={toggleAdminMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              adminMode 
                ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]' 
                : 'bg-[#142238] text-[#A7AFBC] border-[#242831] hover:text-[#F5F6F8]'
            }`}
          >
            Admin {adminMode ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => openVerificationModal(circles[0])}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Apply to Circle</span>
          </button>
        </div>
      </div>

      {/* Admin Mode Notice Banner */}
      {adminMode && (
        <div className="p-3 bg-[#142238] border border-[#344B6B] rounded-lg text-xs text-[#F5F6F8] flex items-center justify-between">
          <span className="font-medium text-[#F5F6F8]">Administrator Review Active: Review, approve, or reject applications below.</span>
        </div>
      )}

      {/* Request Cards */}
      <div className="space-y-4">
        {filteredRequests.map((req) => {
          const isReviewing = req.status === 'reviewing' || req.status === 'pending';
          const isApproved = req.status === 'approved';
          const letter = req.circleName.includes('DPS') ? 'D' : req.circleName.includes('DELHI') || req.circleName.includes('DU') ? 'U' : req.circleName.charAt(0);

          return (
            <div
              key={req.id}
              className="p-5 bg-[#142238] border border-[#242831] rounded-xl space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1B1E24] border border-[#242831] flex items-center justify-center font-bold text-sm text-[#F5F6F8] shrink-0">
                    {letter}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F6F8] font-display">
                      {req.circleName}
                    </h3>
                    <p className="text-xs text-[#A7AFBC]">
                      Applied on {req.submittedAt}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isReviewing ? (
                    <span className="inline-block text-[11px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded px-2.5 py-0.5">
                      Reviewing
                    </span>
                  ) : isApproved ? (
                    <span className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded px-2.5 py-0.5">
                      Approved
                    </span>
                  ) : (
                    <span className="inline-block text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded px-2.5 py-0.5">
                      Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Verification Answer Summary */}
              <div className="p-3 bg-[#1B1E24] rounded-lg border border-[#242831] text-xs text-[#A7AFBC] flex items-center justify-between">
                <div>
                  <span className="text-[#F5F6F8] font-medium">Trivia Check: </span>
                  <span>{req.memoryAnswers[0]?.answer || 'Chole Bhature with pickled onion'}</span>
                </div>
                {req.gestureVerified && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Gesture Verified ✓
                  </span>
                )}
              </div>

              {/* Admin Actions or Cancel Button */}
              <div className="flex items-center justify-between pt-1 border-t border-[#242831] text-xs">
                {adminMode ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateRequestStatus(req.id, 'approved', 'Approved by administrator')}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req.id, 'reviewing', 'Flagged for peer check')}
                      className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                    >
                      Mark Reviewing
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req.id, 'rejected', 'Verification documents did not match')}
                      className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#A7AFBC]">
                    {req.status === 'approved' ? 'Verified circle member' : 'Community admin review in progress'}
                  </span>
                )}

                {req.status !== 'approved' && !adminMode && (
                  <button
                    onClick={() => cancelRequest(req.id)}
                    className="text-[#A7AFBC] hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel Request</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Waiting for Batch Milestone */}
      <div className="pt-8 pb-4 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#142238] border border-[#242831] flex items-center justify-center mx-auto text-[#344B6B]">
          <Users className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-base font-bold text-[#F5F6F8] font-display tracking-tight uppercase">
            Waiting for Your Batch
          </h2>
          <p className="text-xs text-[#A7AFBC] max-w-sm mx-auto mt-1 leading-relaxed">
            When classmates and batchmates join, your connection score updates automatically.
          </p>
        </div>
      </div>
    </div>
  );
};
