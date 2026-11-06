import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TimelineEntry, VerificationBadgeType } from '../../types';
import { ProfilePhotoModal } from '../profile/ProfilePhotoModal';
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  Mail,
  Sparkles,
  Camera,
  Phone,
  Building2,
  Home
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { 
    currentUser, 
    updateCurrentUser, 
    addTimelineEntry, 
    deleteTimelineEntry, 
    setCurrentScreen 
  } = useApp();

  const { user, profile, logout, isDevPreview } = useAuth();

  const activeName = profile?.displayName || user?.displayName || currentUser.name;
  const activeInstitution = profile?.institution || currentUser.institution;
  const activeBatch = profile?.batch || currentUser.batch;
  const activeTrust = profile?.trustScore || currentUser.trustScore;
  const activeAvatar = profile?.avatar || user?.photoURL || currentUser.avatar;
  const activePhone = profile?.phoneNumber || currentUser.phoneNumber;
  const activeCountryCode = profile?.phoneCountryCode || currentUser.phoneCountryCode || '+91';
  const activeEmployer = profile?.employer || currentUser.employer;
  const activeApartment = profile?.apartmentCommunity || currentUser.apartmentCommunity;

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editLocation, setEditLocation] = useState(currentUser.location);
  const [editEmployer, setEditEmployer] = useState(currentUser.employer || '');
  const [editApartment, setEditApartment] = useState(currentUser.apartmentCommunity || '');
  const [editPrivacy, setEditPrivacy] = useState<'public' | 'circles_only' | 'connections_only'>(currentUser.privacySetting || 'public');

  // Add Experience modal state
  const [showAddExpModal, setShowAddExpModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newExpType, setNewExpType] = useState<TimelineEntry['type']>('college');
  const [newDescription, setNewDescription] = useState('');
  const [newVerificationStatus, setNewVerificationStatus] = useState<VerificationBadgeType>('peer_confirmed');
  const [newDocumentName, setNewDocumentName] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: editName,
      bio: editBio,
      location: editLocation,
      employer: editEmployer,
      apartmentCommunity: editApartment,
      privacySetting: editPrivacy
    });
    setIsEditingProfile(false);
  };

  const handleAddExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstitution || !newPeriod) return;
    addTimelineEntry({
      period: newPeriod,
      institution: newInstitution,
      type: newExpType,
      description: newDescription || 'Academic milestone & peer verified batch record.',
      verificationStatus: newVerificationStatus,
      documentName: newDocumentName || undefined,
      peerEndorsementsCount: newVerificationStatus === 'peer_confirmed' ? 5 : undefined
    });
    setShowAddExpModal(false);
    setNewPeriod('');
    setNewInstitution('');
    setNewDescription('');
    setNewDocumentName('');
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="p-6 bg-[#142238] border border-[#242831] rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar with Camera Overlay Trigger */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-xl bg-[#1B1E24] border border-[#242831] overflow-hidden">
                <img
                  src={activeAvatar}
                  alt={activeName}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-medium gap-0.5"
                title="Change or take profile photo"
              >
                <Camera className="w-4 h-4" />
                <span>Update</span>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F8] font-display">
                  {activeName}
                </h1>
                {isDevPreview && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#344B6B]/20 text-[#A7AFBC] border border-[#344B6B]/30">
                    DEV PREVIEW
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="inline-block text-xs font-mono text-[#F5F6F8] bg-[#1B1E24] border border-[#242831] rounded px-2.5 py-0.5">
                  Trust Score {activeTrust}
                </span>

                {activePhone && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Phone Verified ({activeCountryCode} ••••••{activePhone.slice(-4)})
                  </span>
                )}

                {user && (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border ${
                    user.emailVerified 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  }`}>
                    {user.emailVerified ? '✓ Verified Email' : 'Unverified Email'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowPhotoModal(true)}
              className="px-3 py-1.5 rounded-lg border border-[#242831] text-xs font-medium bg-[#1B1E24] text-[#F5F6F8] hover:border-[#344B6B] transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-[#344B6B]" />
              <span>Photo</span>
            </button>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3 py-1.5 rounded-lg border border-[#242831] text-xs font-medium bg-[#1B1E24] text-[#F5F6F8] hover:border-[#344B6B] transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
            </button>

            {user && (
              <button
                onClick={() => logout()}
                className="px-3 py-1.5 rounded-lg border border-[#242831] text-xs font-medium bg-[#1B1E24] hover:bg-rose-500/10 text-[#A7AFBC] hover:text-rose-400 hover:border-rose-500/30 transition-colors flex items-center gap-1.5"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-[#A7AFBC] leading-relaxed">
          {currentUser.bio}
        </p>

        {/* Community Affiliation Strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#A7AFBC] pt-1 border-t border-[#242831]/60">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-[#344B6B]" />
            <span className="text-[#F5F6F8]">{activeInstitution}</span> · {activeBatch}
          </span>
          {activeEmployer && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#344B6B]" />
                <span className="text-[#F5F6F8]">{activeEmployer}</span>
              </span>
            </>
          )}
          {activeApartment && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-[#344B6B]" />
                <span className="text-[#F5F6F8]">{activeApartment}</span>
              </span>
            </>
          )}
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#344B6B]" />
            {currentUser.location}
          </span>
          {user?.email && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-[#A7AFBC]">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Drawer */}
      {isEditingProfile && (
        <form onSubmit={handleSaveProfile} className="p-5 bg-[#142238] rounded-xl border border-[#242831] space-y-3 text-xs shadow-xl animate-in fade-in">
          <h3 className="text-sm font-semibold text-[#F5F6F8] font-display">Edit Profile Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A7AFBC] mb-1">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              />
            </div>
            <div>
              <label className="block text-[#A7AFBC] mb-1">Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#A7AFBC] mb-1">Bio</label>
            <textarea
              rows={2}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B] resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-3 py-1.5 text-[#A7AFBC] hover:text-[#F5F6F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg font-medium transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      )}

      {/* MY LIFE TIMELINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#F5F6F8] font-display uppercase tracking-tight flex items-center gap-2">
            <span>Verified Timeline</span>
          </h2>

          <button
            onClick={() => setShowAddExpModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Experience</span>
          </button>
        </div>

        {/* Vertical Nodes & Cards */}
        <div className="space-y-3">
          {currentUser.timeline.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#344B6B] border border-[#101827] shrink-0" />

              <div className="flex-1 p-4 bg-[#142238] border border-[#242831] hover:border-[#344B6B] rounded-xl transition-colors shadow-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs text-[#A7AFBC] tracking-tight block">
                      {entry.period}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-[#F5F6F8] font-display mt-0.5">
                      {entry.institution}
                    </h3>
                    <p className="text-xs text-[#A7AFBC] mt-0.5">
                      {entry.verificationStatus === 'peer_confirmed'
                        ? 'Peer Confirmed'
                        : entry.verificationStatus === 'document_reviewed'
                        ? 'Document Reviewed'
                        : entry.verificationStatus === 'self_declared'
                        ? 'Self-Declared'
                        : 'Document Submitted'}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTimelineEntry(entry.id)}
                    className="p-1 text-[#A7AFBC] hover:text-rose-400 transition-colors"
                    title="Remove entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Experience Modal */}
      {showAddExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#142238] rounded-xl p-6 max-w-md w-full border border-[#242831] shadow-2xl">
            <h3 className="text-base font-bold text-[#F5F6F8] font-display">Add Experience to Timeline</h3>
            <p className="text-xs text-[#A7AFBC] mt-1">
              Add your school, college, internship, or fellowship milestone.
            </p>

            <form onSubmit={handleAddExperienceSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[#A7AFBC] mb-1">Time Period</label>
                <input
                  type="text"
                  placeholder="e.g. 2012–2019 or 2026"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div>
                <label className="block text-[#A7AFBC] mb-1">Institution or Degree</label>
                <input
                  type="text"
                  placeholder="e.g. DPS NOIDA - BATCH 2019"
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div>
                <label className="block text-[#A7AFBC] mb-1">Status</label>
                <select
                  value={newVerificationStatus}
                  onChange={(e) => setNewVerificationStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                >
                  <option value="peer_confirmed">Peer Confirmed</option>
                  <option value="document_reviewed">Document Reviewed</option>
                  <option value="document_submitted">Document Submitted</option>
                  <option value="self_declared">Self-Declared</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpModal(false)}
                  className="px-3 py-2 text-[#A7AFBC] hover:text-[#F5F6F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] font-medium rounded-lg transition-colors"
                >
                  Add Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Photo Upload & Camera Modal */}
      <ProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
      />
    </div>
  );
};
