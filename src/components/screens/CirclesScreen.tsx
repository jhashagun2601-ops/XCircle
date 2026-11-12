import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReunionPlanner } from '../reunion/ReunionPlanner';
import { 
  Users, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Plus, 
  Send, 
  Image, 
  Calendar, 
  Search, 
  ShieldCheck, 
  Eye,
  Camera,
  ArrowRight,
  Lock,
  Globe,
  Info,
  FileText,
  Megaphone,
  Settings,
  ShieldAlert,
  AlertTriangle,
  Flag,
  Trash2,
  XCircle
} from 'lucide-react';

export const CirclesScreen: React.FC = () => {
  const { 
    circles, 
    activeCircleId, 
    setActiveCircleId, 
    posts, 
    addPost, 
    reactToPost, 
    addComment, 
    deletePost,
    memories, 
    addMemory, 
    likeMemory, 
    currentUser, 
    openProfileModal, 
    radarProfiles, 
    openVerificationModal, 
    updateCircle,
    requests,
    updateRequestStatus,
    canAccessCircleContent,
    isCircleAdmin,
    openCreateCircleModal,
    activeCircleTab,
    setActiveCircleTab,
    reportItem,
    showToast 
  } = useApp();

  const activeTab = activeCircleTab || 'feed';
  const setActiveTab = setActiveCircleTab;
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState<'General' | 'Throwback' | 'Announcement' | 'Question'>('General');
  const [newPostImage, setNewPostImage] = useState<string | undefined>(undefined);
  const [commentInputMap, setCommentInputMap] = useState<{ [postId: string]: string }>({});

  // Memory upload modal state
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [newMemoryTitle, setNewMemoryTitle] = useState('');
  const [newMemoryYear, setNewMemoryYear] = useState('2019');
  const [newMemoryCaption, setNewMemoryCaption] = useState('');
  const [newMemoryTag, setNewMemoryTag] = useState('Farewell');
  const [newMemoryImage, setNewMemoryImage] = useState('/src/assets/images/xcircle_memory_school_1793604165373.jpg');

  // New Announcement state
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');

  // Report post state
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportReasonText, setReportReasonText] = useState('');

  // Find currently active circle
  const activeCircle = circles.find(c => c.id === activeCircleId) || circles[0];

  const circlePosts = posts.filter(p => p.circleId === activeCircle.id);
  const circleMemories = memories.filter(m => m.circleId === activeCircle.id);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addPost(newPostContent, newPostTag, newPostImage);
    setNewPostContent('');
    setNewPostImage(undefined);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputMap[postId]?.trim();
    if (!text) return;
    addComment(postId, text);
    setCommentInputMap(prev => ({ ...prev, [postId]: '' }));
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryTitle) return;
    addMemory(newMemoryTitle, newMemoryYear, newMemoryImage, newMemoryCaption, newMemoryTag);
    setShowMemoryModal(false);
    setNewMemoryTitle('');
    setNewMemoryCaption('');
  };

  const isCircleAdminUser = isCircleAdmin(activeCircle.id);
  const canAccess = canAccessCircleContent(activeCircle);

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
    const newAnn = {
      id: `ann_${Date.now()}`,
      title: newAnnTitle.trim(),
      date: 'Just now',
      content: newAnnContent.trim()
    };
    updateCircle(activeCircle.id, {
      announcements: [newAnn, ...(activeCircle.announcements || [])]
    });
    setShowAnnouncementModal(false);
    setNewAnnTitle('');
    setNewAnnContent('');
    showToast('Announcement posted to circle');
  };

  const handleReportPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPostId || !reportReasonText.trim()) return;
    const targetPost = posts.find(p => p.id === reportingPostId);
    reportItem({
      type: 'post',
      targetId: reportingPostId,
      targetTitle: targetPost ? (targetPost.content.slice(0, 40) + '...') : 'Community Post',
      targetAuthorName: targetPost?.authorName,
      targetAuthorId: targetPost?.authorId,
      circleId: activeCircle.id,
      circleName: activeCircle.name,
      reason: reportReasonText.trim(),
      reportedBy: currentUser.name,
      severity: 'medium'
    });
    setReportingPostId(null);
    setReportReasonText('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Circle Selector Strip */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-2">
          {circles.map((circle) => {
            const isSelected = circle.id === activeCircle.id;
            return (
              <button
                key={circle.id}
                onClick={() => setActiveCircleId(circle.id)}
                className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#344B6B] text-[#F5F6F8] shadow-sm'
                    : 'bg-[#142238] text-[#A7AFBC] hover:text-[#F5F6F8] border border-[#242831]'
                }`}
              >
                <span>{circle.name}</span>
                {circle.reunionDue && (
                  <span className="w-2 h-2 rounded-full bg-[#344B6B] ring-1 ring-white/20" />
                )}
              </button>
            );
          })}
        </div>

        {/* WhatsApp-Style Plus Button in Strip */}
        <button
          onClick={openCreateCircleModal}
          className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white rounded-lg font-semibold flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-950/40 border border-emerald-400/40 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          title="Create a New Circle (+)"
        >
          <Plus className="w-4 h-4 stroke-[2.75]" />
          <span>+ Create Circle</span>
        </button>
      </div>

      {/* WhatsApp Community Inspiration Banner */}
      <div className="bg-gradient-to-r from-[#142238] via-[#172942] to-[#142238] border border-[#242831] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
            <Plus className="w-6 h-6 stroke-[2.75]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-500/20">
                Community Builder
              </span>
              <span className="text-xs text-[#A7AFBC]">WhatsApp Inspired</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#F5F6F8] font-display mt-0.5">
              Want to start your own circle?
            </h3>
            <p className="text-xs text-[#A7AFBC] mt-0.5 max-w-xl leading-relaxed">
              Click the <strong className="text-emerald-400">+ Plus button</strong> anytime to launch the circle creation wizard and provide the required information for your batch, neighborhood, or hobby circle.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateCircleModal}
          className="self-start sm:self-auto px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 border border-emerald-400/40 transition-all hover:scale-104 active:scale-96 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.75]" />
          <span>+ Create Circle Now</span>
        </button>
      </div>

      {/* Circle Header & Vibe */}
      <div className="bg-[#142238] border border-[#242831] rounded-xl overflow-hidden p-5 sm:p-6 space-y-4 shadow-xl">
        {/* Top details and badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#A7AFBC] uppercase tracking-wider">
              <span>{activeCircle.companyName || activeCircle.institutionName || activeCircle.locality || activeCircle.name}</span>
              <span>·</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                activeCircle.category === 'employer'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : activeCircle.category === 'apartment_local'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
              }`}>
                {activeCircle.category === 'employer' ? 'Employer Circle' : activeCircle.category === 'apartment_local' ? 'Apartment & Local' : 'Academic Circle'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F6F8] font-display tracking-tight mt-0.5">
              {activeCircle.name}
            </h1>
            <p className="text-xs text-[#A7AFBC] mt-1 max-w-2xl leading-relaxed">
              {activeCircle.description}
            </p>
            {activeCircle.category === 'apartment_local' && activeCircle.communityRules && (
              <div className="mt-2.5 p-2.5 rounded-lg bg-[#1B1E24] border border-[#242831] text-[11px] text-[#A7AFBC] space-y-1">
                <span className="font-semibold text-[#F5F6F8] block">🛡️ Community Rules & Privacy Policy:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                  {activeCircle.communityRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeCircle.verificationStatus === 'peer_confirmed' ? 'Peer Confirmed' : 'Verified'}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#1B1E24] border border-[#242831] text-[#A7AFBC] text-xs font-mono">
              <Users className="w-3 h-3" />
              {activeCircle.membersCount || 128} members
            </span>

            {!activeCircle.isJoined && (
              <button
                onClick={() => openVerificationModal(activeCircle)}
                className="px-3 py-1 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify & Join</span>
              </button>
            )}

            {activeCircle.isPrivate && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Private Circle</span>
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pt-2 border-t border-[#242831]">
          {[
            { id: 'feed', label: 'Feed' },
            { id: 'members', label: 'Members' },
            { id: 'memories', label: 'Memories' },
            { id: 'reunion', label: 'Reunion' },
            { id: 'info', label: 'Guidelines & About' },
            { id: 'announcements', label: 'Announcements' },
            ...(isCircleAdminUser ? [
              { id: 'requests', label: 'Join Requests' },
              { id: 'settings', label: 'Settings' }
            ] : [])
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isTabActive
                    ? 'bg-[#344B6B] text-[#F5F6F8]'
                    : 'text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#1B1E24]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'requests' && requests.filter(r => r.circleId === activeCircle.id && r.status === 'pending').length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                    {requests.filter(r => r.circleId === activeCircle.id && r.status === 'pending').length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRIVATE CIRCLE CONTENT LOCK GATE */}
      {activeCircle.isPrivate && !canAccess && ['feed', 'members', 'memories', 'reunion'].includes(activeTab) ? (
        <div className="bg-[#142238] border border-[#242831] rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-2xl my-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
              Private Community
            </span>
            <h3 className="text-xl font-bold text-[#F5F6F8] font-display mt-2">
              {activeCircle.name} is Private
            </h3>
            <p className="text-xs text-[#A7AFBC] mt-1.5 leading-relaxed">
              Discussions, memory vaults, member profiles, and reunion planning in this circle are strictly restricted to verified and approved members.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openVerificationModal(activeCircle)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Request to Join Circle</span>
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#1B1E24] hover:bg-[#101827] text-[#A7AFBC] hover:text-[#F5F6F8] text-xs font-medium rounded-xl border border-[#242831] transition-colors"
            >
              View Guidelines
            </button>
          </div>

          <div className="pt-3 border-t border-[#242831] text-[10px] text-[#A7AFBC] space-y-1">
            <p>🛡️ Zero Unauthorised Access: Content is hidden until an administrator or peer endorses your membership.</p>
            <p className="text-[10px] text-[#A7AFBC]/70">Security note: Enforced via client state in preview and server RLS in production.</p>
          </div>
        </div>
      ) : null}

      {/* TAB 1: COMMUNITY FEED */}
      {(!activeCircle.isPrivate || canAccess) && activeTab === 'feed' && (
        <div className="space-y-4">
          {/* Reunion Due Notification Card */}
          <div 
            onClick={() => setActiveTab('reunion')}
            className="bg-[#142238] border border-[#344B6B] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#1B1E24] transition-colors shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎉</span>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#F5F6F8] leading-snug">
                  Reunion due! Batch turns 7 next year. Collaborative dates & venue polls are live.
                </p>
                <p className="text-[11px] text-[#A7AFBC] mt-0.5">
                  Vote on dates, RSVP, and propose venue options.
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-[#344B6B] flex items-center justify-center shrink-0 text-[#F5F6F8]">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Create Post Box */}
          <div className="bg-[#142238] border border-[#242831] rounded-xl p-4 sm:p-5 space-y-3 shadow-lg">
            <div className="flex items-start gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-lg object-cover border border-[#242831] shrink-0"
              />
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={`Share a memory, update or question in ${activeCircle.name}...`}
                  className="w-full text-xs sm:text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 bg-[#1B1E24] rounded-lg p-3 border border-[#242831] focus:outline-none focus:border-[#344B6B] resize-none"
                />

                {/* Post Options & Submit */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#242831]">
                  <div className="flex items-center gap-1.5 text-xs">
                    {(['General', 'Throwback', 'Announcement', 'Question'] as const).map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setNewPostTag(tag)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          newPostTag === tag
                            ? 'bg-[#344B6B] text-[#F5F6F8]'
                            : 'bg-[#1B1E24] text-[#A7AFBC] hover:text-[#F5F6F8]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setNewPostImage(
                          newPostImage 
                            ? undefined 
                            : '/src/assets/images/xcircle_memory_school_1793604165373.jpg'
                        );
                      }}
                      className={`px-2.5 py-1 rounded-md border text-[11px] font-medium flex items-center gap-1 transition-colors ${
                        newPostImage
                          ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]'
                          : 'bg-[#1B1E24] text-[#A7AFBC] border-[#242831] hover:text-[#F5F6F8]'
                      }`}
                    >
                      <Image className="w-3.5 h-3.5" />
                      <span>{newPostImage ? 'Photo Attached' : 'Attach Photo'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="px-3.5 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] disabled:opacity-40 text-[#F5F6F8] rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span>Post</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            {circlePosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#142238] border border-[#242831] rounded-xl p-5 space-y-4 shadow-lg"
              >
                {/* Author Info & Tag */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1B1E24] border border-[#242831] flex items-center justify-center font-bold text-[#F5F6F8] shrink-0 text-sm">
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F5F6F8] font-display">
                        {post.authorName}
                      </p>
                      <p className="text-xs text-[#A7AFBC]">
                        {post.authorBatch} · {post.createdAt}
                      </p>
                    </div>
                  </div>

                  {post.tag && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#1B1E24] text-[#A7AFBC] border border-[#242831]">
                      {post.tag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-[#F5F6F8] leading-relaxed">
                  {post.content}
                </p>

                {/* Post Image Container */}
                {post.image && (
                  <div className="rounded-lg overflow-hidden border border-[#242831] bg-[#1B1E24] max-h-96">
                    <img
                      src={post.image}
                      alt="Attached throwback"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Multi-Reaction Bar & Like */}
                <div className="pt-3 border-t border-[#242831] flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => reactToPost(post.id, 'heart')}
                      className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1.5 transition-colors ${
                        post.userReaction === 'heart'
                          ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]'
                          : 'bg-[#1B1E24] text-[#A7AFBC] border-[#242831] hover:text-[#F5F6F8]'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>{post.reactions.heart}</span>
                    </button>

                    <button
                      onClick={() => reactToPost(post.id, 'nostalgia')}
                      className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1.5 transition-colors ${
                        post.userReaction === 'nostalgia'
                          ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]'
                          : 'bg-[#1B1E24] text-[#A7AFBC] border-[#242831] hover:text-[#F5F6F8]'
                      }`}
                    >
                      <span>🥺 Nostalgia</span>
                      <span>{post.reactions.nostalgia}</span>
                    </button>

                    <button
                      onClick={() => reactToPost(post.id, 'highFive')}
                      className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1.5 transition-colors ${
                        post.userReaction === 'highFive'
                          ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]'
                          : 'bg-[#1B1E24] text-[#A7AFBC] border-[#242831] hover:text-[#F5F6F8]'
                      }`}
                    >
                      <span>🙌 High-Five</span>
                      <span>{post.reactions.highFive}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText?.(window.location.href);
                        showToast('Post link copied to clipboard');
                      }}
                      className="p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] rounded-md border border-[#242831] bg-[#1B1E24]"
                      title="Share post"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setReportingPostId(post.id)}
                      className="p-1.5 text-[#A7AFBC] hover:text-amber-400 rounded-md border border-[#242831] bg-[#1B1E24]"
                      title="Report content to moderators"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>

                    {(isCircleAdminUser || post.authorId === currentUser.id) && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 text-[#A7AFBC] hover:text-rose-400 rounded-md border border-[#242831] bg-[#1B1E24]"
                        title="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="pt-3 border-t border-[#242831] space-y-2.5">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                      <div className="w-6 h-6 rounded-md bg-[#1B1E24] border border-[#242831] flex items-center justify-center font-bold text-[#F5F6F8] shrink-0 mt-0.5 text-[11px]">
                        {comment.authorName.charAt(0)}
                      </div>
                      <div className="flex-1 bg-[#1B1E24] rounded-lg p-2.5 border border-[#242831]">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#F5F6F8]">{comment.authorName}</span>
                          <span className="text-[10px] text-[#A7AFBC]">{comment.createdAt}</span>
                        </div>
                        <p className="text-[#A7AFBC] mt-1 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputMap[post.id] || ''}
                      onChange={(e) => setCommentInputMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      className="flex-1 text-xs px-3 py-2 bg-[#1B1E24] rounded-lg border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-2 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg text-xs font-medium transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MEMBERS DIRECTORY */}
      {activeTab === 'members' && (
        <div className="bg-[#142238] border border-[#242831] rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#F5F6F8] font-display">
                Circle Members Directory
              </h2>
              <p className="text-xs text-[#A7AFBC]">
                Verified classmates and alumni belonging to {activeCircle.name}.
              </p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search directory..."
                className="pl-8 pr-3 py-1.5 text-xs bg-[#1B1E24] border border-[#242831] rounded-lg text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeCircle.members && activeCircle.members.length > 0 ? (
              activeCircle.members.map((member) => (
                <div
                  key={member.userId}
                  className="p-3 rounded-lg border border-[#242831] bg-[#1B1E24] hover:border-[#344B6B] flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 rounded-md object-cover border border-[#242831] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#F5F6F8] truncate">{member.name}</p>
                      <p className="text-[11px] text-[#A7AFBC] font-mono">
                        {member.role.toUpperCase()} · Batch {member.batch}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-mono">✓ Peer Confirmed</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const profile = radarProfiles.find(p => p.id === member.userId) || {
                        id: member.userId,
                        name: member.name,
                        handle: `@${member.name.toLowerCase().replace(' ', '')}`,
                        avatar: member.avatar,
                        bio: `Member of ${activeCircle.name}`,
                        institution: activeCircle.name,
                        batch: member.batch,
                        location: 'New Delhi / NCR',
                        trustScore: 88,
                        connectionsCount: 42,
                        circlesCount: 2,
                        timeline: []
                      };
                      openProfileModal(profile as any);
                    }}
                    className="p-1.5 rounded-md bg-[#142238] border border-[#242831] text-[#A7AFBC] hover:text-[#F5F6F8]"
                    title="View Profile"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#A7AFBC] italic">No members found.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MEMORY VAULT */}
      {activeTab === 'memories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#F5F6F8] font-display flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#344B6B]" />
                Memory Vault & Vintage Albums
              </h2>
              <p className="text-xs text-[#A7AFBC]">
                Preserving sports days, class trips, and farewell moments.
              </p>
            </div>

            <button
              onClick={() => setShowMemoryModal(true)}
              className="px-3.5 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {circleMemories.map((mem) => (
              <div
                key={mem.id}
                className="bg-[#142238] border border-[#242831] rounded-xl overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="aspect-16/10 overflow-hidden bg-[#1B1E24] relative group border-b border-[#242831]">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#101827]/80 backdrop-blur-md text-[#F5F6F8] border border-[#242831] text-[10px] font-mono px-2 py-0.5 rounded">
                      {mem.year}
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-mono text-[#344B6B] uppercase tracking-wider block">
                      {mem.eventTag}
                    </span>
                    <h3 className="text-sm font-semibold text-[#F5F6F8] font-display">
                      {mem.title}
                    </h3>
                    <p className="text-xs text-[#A7AFBC] leading-relaxed">
                      {mem.caption}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-3 pt-2 flex items-center justify-between text-xs border-t border-[#242831]">
                  <span className="text-[11px] text-[#A7AFBC]">Uploaded by {mem.uploadedBy}</span>
                  <button
                    onClick={() => likeMemory(mem.id)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                      mem.isLiked
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                        : 'text-[#A7AFBC] bg-[#1B1E24] border-[#242831] hover:text-[#F5F6F8]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${mem.isLiked ? 'fill-current' : ''}`} />
                    <span>{mem.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REUNION PLANNER */}
      {activeTab === 'reunion' && (
        <ReunionPlanner />
      )}

      {/* TAB 5: GUIDELINES & ABOUT */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          <div className="bg-[#142238] border border-[#242831] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#242831]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#344B6B] font-bold">
                  About Community
                </span>
                <h2 className="text-xl font-bold text-[#F5F6F8] font-display mt-0.5">
                  {activeCircle.name}
                </h2>
                <p className="text-xs text-[#A7AFBC] mt-1 max-w-xl">
                  {activeCircle.description || 'Welcome to this circle. Connect, reminisce, and collaborate with your peers.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border ${
                  activeCircle.isPrivate
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  {activeCircle.isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                  <span>{activeCircle.isPrivate ? 'Private Circle' : 'Public Community'}</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#1B1E24] border border-[#242831] text-[#A7AFBC]">
                  {activeCircle.membersCount || activeCircle.members.length} Members
                </span>
              </div>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#1B1E24] p-3.5 rounded-xl border border-[#242831]">
                <span className="text-[10px] text-[#A7AFBC] uppercase font-mono">Category</span>
                <p className="text-sm font-semibold text-[#F5F6F8] capitalize mt-0.5">
                  {activeCircle.category === 'apartment_local' ? 'Society & Local' : (activeCircle.category || 'Academic')}
                </p>
              </div>

              <div className="bg-[#1B1E24] p-3.5 rounded-xl border border-[#242831]">
                <span className="text-[10px] text-[#A7AFBC] uppercase font-mono">Cohort / Batch</span>
                <p className="text-sm font-semibold text-[#F5F6F8] mt-0.5">
                  {activeCircle.batch ? `Batch ${activeCircle.batch}` : (activeCircle.locality || 'General')}
                </p>
              </div>

              <div className="bg-[#1B1E24] p-3.5 rounded-xl border border-[#242831]">
                <span className="text-[10px] text-[#A7AFBC] uppercase font-mono">Circle Creator</span>
                <p className="text-sm font-semibold text-[#F5F6F8] mt-0.5 truncate">
                  {activeCircle.creatorName || 'Founding Admin'}
                </p>
              </div>

              <div className="bg-[#1B1E24] p-3.5 rounded-xl border border-[#242831]">
                <span className="text-[10px] text-[#A7AFBC] uppercase font-mono">Access Policy</span>
                <p className="text-sm font-semibold text-[#F5F6F8] mt-0.5">
                  {activeCircle.isPrivate ? 'Approval Required' : 'Open / Verified'}
                </p>
              </div>
            </div>

            {/* Interests & Focus Tags */}
            {activeCircle.interests && activeCircle.interests.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#A7AFBC]">
                  Focus Tags & Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeCircle.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs bg-[#1B1E24] border border-[#242831] text-[#F5F6F8]"
                    >
                      #{interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Community Rules & Guidelines */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-[#F5F6F8] font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#344B6B]" />
                Community Guidelines & Code of Conduct
              </h4>
              <p className="text-xs text-[#A7AFBC]">
                All members must uphold these standards to keep discussions respectful, authentic, and constructive.
              </p>

              <div className="space-y-2.5">
                {(activeCircle.guidelines && activeCircle.guidelines.length > 0
                  ? activeCircle.guidelines
                  : [
                      'Treat every alumnus, classmate, and resident with dignity and mutual respect.',
                      'No unapproved promotions, spam, sales solicitation, or mass DMs.',
                      'Preserve privacy: Do not export internal batch discussions, phone numbers, or photos without consent.',
                      'Keep memories and reunions safe and welcoming for all members.'
                    ]
                ).map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#1B1E24] border border-[#242831]"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#344B6B]/30 border border-[#344B6B] text-[10px] font-mono text-[#F5F6F8] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-[#F5F6F8] leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Transparency Notice */}
            <div className="p-4 rounded-xl bg-[#1B1E24]/60 border border-[#242831] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-[#F5F6F8]">
                  Verified Data & Privacy Architecture
                </p>
                <p className="text-[#A7AFBC] leading-relaxed text-[11px]">
                  XCircle secures membership records using cryptographic identity verification. Private circles enforce strict database-level Row Level Security (RLS) policies so unauthorized requests cannot access posts, members, or memories.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#F5F6F8] font-display flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#344B6B]" />
                Official Circle Announcements
              </h2>
              <p className="text-xs text-[#A7AFBC]">
                Broadcast notices from verified circle admins, committee members, and organizers.
              </p>
            </div>

            {isCircleAdminUser && (
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-3.5 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Announcement</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {activeCircle.announcements && activeCircle.announcements.length > 0 ? (
              activeCircle.announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-[#142238] border border-[#242831] rounded-xl p-5 space-y-2 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold uppercase">
                        Announcement
                      </span>
                      <h3 className="text-sm font-bold text-[#F5F6F8] font-display">
                        {ann.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#A7AFBC]">{ann.date}</span>
                  </div>
                  <p className="text-xs text-[#A7AFBC] leading-relaxed whitespace-pre-wrap">
                    {ann.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-[#142238] border border-[#242831] rounded-xl p-8 text-center text-[#A7AFBC] space-y-2">
                <Megaphone className="w-8 h-8 mx-auto text-[#A7AFBC]/40" />
                <p className="text-sm font-semibold text-[#F5F6F8]">No announcements yet</p>
                <p className="text-xs max-w-sm mx-auto">
                  Circle administrators haven't posted any official broadcasts to this circle.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: CIRCLE JOIN REQUESTS (ADMIN ONLY) */}
      {activeTab === 'requests' && isCircleAdminUser && (
        <div className="bg-[#142238] border border-[#242831] rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#242831]">
            <div>
              <h2 className="text-base font-bold text-[#F5F6F8] font-display flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Pending Join & Verification Requests
              </h2>
              <p className="text-xs text-[#A7AFBC]">
                Review applications for {activeCircle.name}. Validate alumni quizzes and identities before granting access.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-[#1B1E24] border border-[#242831] rounded-lg text-[#F5F6F8]">
              {requests.filter(r => r.circleId === activeCircle.id && r.status === 'pending').length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {requests.filter(r => r.circleId === activeCircle.id).length > 0 ? (
              requests
                .filter(r => r.circleId === activeCircle.id)
                .map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-[#1B1E24] border border-[#242831] space-y-3 hover:border-[#344B6B] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.applicantAvatar}
                          alt={req.applicantName}
                          className="w-10 h-10 rounded-lg object-cover border border-[#242831]"
                        />
                        <div>
                          <p className="text-sm font-bold text-[#F5F6F8]">{req.applicantName}</p>
                          <p className="text-xs text-[#A7AFBC]">
                            Batch {req.batch} · Applied {req.submittedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase font-bold border ${
                          req.status === 'pending'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : req.status === 'approved'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}>
                          {req.status}
                        </span>

                        {req.status === 'pending' && (
                          <div className="flex items-center gap-1.5 ml-2">
                            <button
                              onClick={() => {
                                updateRequestStatus(req.id, 'approved');
                                showToast(`Approved ${req.applicantName} into circle`);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                updateRequestStatus(req.id, 'rejected');
                                showToast(`Declined ${req.applicantName}`);
                              }}
                              className="px-3 py-1.5 bg-[#142238] hover:bg-rose-950/40 text-rose-300 border border-[#242831] hover:border-rose-800 rounded-lg text-xs transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Applicant Answers & Verification Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1 border-t border-[#242831]/60">
                      <div className="bg-[#142238] p-2.5 rounded-lg border border-[#242831]/80">
                        <span className="text-[10px] text-[#A7AFBC] block font-mono">Verification Status</span>
                        <span className="text-[#F5F6F8] font-mono">
                          {req.gestureVerified ? '✓ Identity Gesture Confirmed' : 'ID Document Scanned'}
                        </span>
                      </div>
                      <div className="bg-[#142238] p-2.5 rounded-lg border border-[#242831]/80">
                        <span className="text-[10px] text-[#A7AFBC] block font-mono">Alumni Memory Answers</span>
                        <span className="text-[#F5F6F8]">
                          {req.memoryAnswers && req.memoryAnswers.length > 0 
                            ? `${req.memoryAnswers.filter(a => a.isCorrect).length}/${req.memoryAnswers.length} correct responses`
                            : 'Verified Alumnus Record'}
                        </span>
                      </div>
                    </div>

                    {req.adminNotes && (
                      <p className="text-[11px] text-amber-300/80 bg-amber-500/5 border border-amber-500/20 px-3 py-1.5 rounded-lg font-mono">
                        System Note: {req.adminNotes}
                      </p>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-xs text-[#A7AFBC] italic text-center py-6">
                No join requests for this circle.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: CIRCLE SETTINGS (ADMIN ONLY) */}
      {activeTab === 'settings' && isCircleAdminUser && (
        <div className="bg-[#142238] border border-[#242831] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="pb-4 border-b border-[#242831]">
            <h2 className="text-base font-bold text-[#F5F6F8] font-display flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#344B6B]" />
              Circle Governance & Settings
            </h2>
            <p className="text-xs text-[#A7AFBC]">
              Configure privacy level, circle metadata, and community guidelines.
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Circle Name</label>
              <input
                type="text"
                defaultValue={activeCircle.name}
                onBlur={(e) => {
                  if (e.target.value.trim() && e.target.value !== activeCircle.name) {
                    updateCircle(activeCircle.id, { name: e.target.value.trim() });
                    showToast('Circle name updated');
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Circle Description</label>
              <textarea
                rows={3}
                defaultValue={activeCircle.description}
                onBlur={(e) => {
                  if (e.target.value !== activeCircle.description) {
                    updateCircle(activeCircle.id, { description: e.target.value });
                    showToast('Description updated');
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B] resize-none"
              />
            </div>

            {/* Privacy Toggle */}
            <div className="p-4 rounded-xl bg-[#1B1E24] border border-[#242831] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#F5F6F8] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Private Circle Mode</span>
                </p>
                <p className="text-[11px] text-[#A7AFBC] mt-0.5">
                  When enabled, non-members cannot read posts, members directory, or memory vault.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newIsPrivate = !activeCircle.isPrivate;
                  updateCircle(activeCircle.id, { isPrivate: newIsPrivate });
                  showToast(`Circle is now ${newIsPrivate ? 'Private' : 'Public'}`);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  activeCircle.isPrivate ? 'bg-[#344B6B]' : 'bg-[#242831]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    activeCircle.isPrivate ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Danger Zone: Archive */}
            <div className="pt-4 border-t border-[#242831] space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase font-mono">Danger Zone</h4>
              <p className="text-xs text-[#A7AFBC]">
                Archiving will hide this circle from search and disable new posts and requests.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to archive "${activeCircle.name}"?`)) {
                    updateCircle(activeCircle.id, { status: 'archived', archivedAt: new Date().toISOString() });
                    showToast('Circle has been archived');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-medium transition-colors"
              >
                Archive Circle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memory Upload Modal */}
      {showMemoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-[#F5F6F8] font-display">Add Memory to Vault</h3>
            <p className="text-xs text-[#A7AFBC] mt-0.5">
              Share an old photograph, classroom scan, or trip memory with your batch circle.
            </p>

            <form onSubmit={handleSaveMemory} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Sports Day Relay Race 2018"
                  value={newMemoryTitle}
                  onChange={(e) => setNewMemoryTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Year</label>
                  <input
                    type="text"
                    value={newMemoryYear}
                    onChange={(e) => setNewMemoryYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Tag / Occasion</label>
                  <input
                    type="text"
                    value={newMemoryTag}
                    onChange={(e) => setNewMemoryTag(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Caption / Story</label>
                <textarea
                  rows={2}
                  placeholder="What was happening when this was clicked?"
                  value={newMemoryCaption}
                  onChange={(e) => setNewMemoryCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMemoryModal(false)}
                  className="px-3.5 py-1.5 text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium rounded-lg transition-colors"
                >
                  Upload Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-[#F5F6F8] font-display flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#344B6B]" />
              Post Circle Announcement
            </h3>
            <p className="text-xs text-[#A7AFBC] mt-0.5">
              Send an official notice to all members of {activeCircle.name}.
            </p>

            <form onSubmit={handleAddAnnouncement} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Alumni Meet 2026 Registration Open"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Announcement Body</label>
                <textarea
                  rows={4}
                  placeholder="Provide all details, deadlines, links, or contact points..."
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-3.5 py-1.5 text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium rounded-lg transition-colors"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Post Modal */}
      {reportingPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-[#F5F6F8] font-display flex items-center gap-2">
              <Flag className="w-5 h-5 text-rose-400" />
              Report Content to Admins
            </h3>
            <p className="text-xs text-[#A7AFBC] mt-0.5">
              Flag this post for review by circle moderators and platform administrators.
            </p>

            <form onSubmit={handleReportPostSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Reason for Report</label>
                <div className="space-y-1.5 mb-2">
                  {[
                    'Spam or commercial promotion',
                    'Harassment or personal attack',
                    'Privacy violation / Personal data leak',
                    'Misinformation or fake profile activity',
                    'Other violation of community guidelines'
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setReportReasonText(preset)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                        reportReasonText === preset
                          ? 'bg-[#344B6B]/30 border-[#344B6B] text-[#F5F6F8]'
                          : 'bg-[#1B1E24] border-[#242831] text-[#A7AFBC] hover:text-[#F5F6F8]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  placeholder="Additional context (optional)..."
                  value={reportReasonText}
                  onChange={(e) => setReportReasonText(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportingPostId(null)}
                  className="px-3.5 py-1.5 text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

