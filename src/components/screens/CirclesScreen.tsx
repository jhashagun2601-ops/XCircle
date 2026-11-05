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
  ArrowRight
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
    memories, 
    addMemory, 
    likeMemory, 
    currentUser, 
    openProfileModal, 
    radarProfiles, 
    openVerificationModal, 
    createCircle, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'memories' | 'reunion'>('feed');
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

  // Create circle modal state
  const [showCreateCircleModal, setShowCreateCircleModal] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleBatch, setNewCircleBatch] = useState('');
  const [newCircleType, setNewCircleType] = useState<'school' | 'college' | 'company' | 'alumni'>('school');
  const [newCircleDesc, setNewCircleDesc] = useState('');

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

  const handleCreateCircleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName) return;
    createCircle({
      name: newCircleName,
      batch: newCircleBatch || 'Class of 2024',
      type: newCircleType,
      description: newCircleDesc
    });
    setShowCreateCircleModal(false);
    setNewCircleName('');
    setNewCircleBatch('');
    setNewCircleDesc('');
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

        <button
          onClick={() => setShowCreateCircleModal(true)}
          className="px-3.5 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg font-medium flex items-center gap-1 shrink-0 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Circle</span>
        </button>
      </div>

      {/* Circle Header & Vibe */}
      <div className="bg-[#142238] border border-[#242831] rounded-xl overflow-hidden p-5 sm:p-6 space-y-4 shadow-xl">
        {/* Top details and badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#A7AFBC] uppercase tracking-wider">
              {activeCircle.institutionName || activeCircle.name}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F6F8] font-display tracking-tight mt-0.5">
              {activeCircle.batch || activeCircle.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Peer Confirmed
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#1B1E24] border border-[#242831] text-[#A7AFBC] text-xs font-mono">
              <Users className="w-3 h-3" />
              {activeCircle.membersCount || 128} members
            </span>

            <button
              onClick={() => openVerificationModal(activeCircle)}
              className="px-3 py-1 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify & Join</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pt-2 border-t border-[#242831]">
          {[
            { id: 'feed', label: 'Feed' },
            { id: 'members', label: 'Members' },
            { id: 'memories', label: 'Memories' },
            { id: 'reunion', label: 'Reunion' },
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  isTabActive
                    ? 'bg-[#344B6B] text-[#F5F6F8]'
                    : 'text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#1B1E24]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: COMMUNITY FEED */}
      {activeTab === 'feed' && (
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

      {/* Create New Circle Modal */}
      {showCreateCircleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#142238] border border-[#242831] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-[#F5F6F8] font-display">Create a New Circle</h3>
            <p className="text-xs text-[#A7AFBC] mt-0.5">
              Start a verified community for your school batch, college department, or alumni association.
            </p>

            <form onSubmit={handleCreateCircleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Circle Name</label>
                <input
                  type="text"
                  placeholder="e.g. Modern School Barakhamba — Batch 2018"
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Batch / Cohort</label>
                  <input
                    type="text"
                    placeholder="e.g. Class of 2018"
                    value={newCircleBatch}
                    onChange={(e) => setNewCircleBatch(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Category</label>
                  <select
                    value={newCircleType}
                    onChange={(e) => setNewCircleType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  >
                    <option value="school">School</option>
                    <option value="college">College</option>
                    <option value="university">University</option>
                    <option value="company">Company</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBC] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What is the purpose of this circle?"
                  value={newCircleDesc}
                  onChange={(e) => setNewCircleDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCircleModal(false)}
                  className="px-3.5 py-1.5 text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-medium rounded-lg transition-colors"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
