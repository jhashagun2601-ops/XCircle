import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ScreenId, 
  UserProfile, 
  Circle, 
  CommunityPost, 
  MemoryItem, 
  ReunionEvent, 
  CircleJoinRequest, 
  ChatThread, 
  NotificationItem, 
  TimelineEntry,
  RequestStatus,
  AdminRole,
  UserAccountStatus,
  ReportedContent,
  AdminAuditLog
} from '../types';
import { 
  CURRENT_USER, 
  INITIAL_RADAR_PROFILES, 
  INITIAL_CIRCLES, 
  INITIAL_POSTS, 
  INITIAL_MEMORIES, 
  INITIAL_REUNION, 
  INITIAL_REQUESTS, 
  INITIAL_CHATS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTED_CONTENT,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

interface AppContextType {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  currentUser: UserProfile;
  updateCurrentUser: (profile: Partial<UserProfile>) => void;
  radarProfiles: UserProfile[];
  toggleConnect: (profileId: string) => void;
  circles: Circle[];
  activeCircleId: string;
  setActiveCircleId: (id: string) => void;
  createCircle: (circleData: Partial<Circle>) => void;
  updateCircle: (circleId: string, data: Partial<Circle>) => void;
  archiveCircle: (circleId: string) => void;
  deleteCircle: (circleId: string) => void;
  approveCircle: (circleId: string) => void;
  rejectCircle: (circleId: string) => void;
  posts: CommunityPost[];
  addPost: (content: string, tag?: CommunityPost['tag'], image?: string) => void;
  likePost: (postId: string) => void;
  reactToPost: (postId: string, reaction: 'heart' | 'nostalgia' | 'highFive') => void;
  addComment: (postId: string, text: string) => void;
  deletePost: (postId: string) => void;
  memories: MemoryItem[];
  addMemory: (title: string, year: string, image: string, caption: string, eventTag: string) => void;
  likeMemory: (memoryId: string) => void;
  reunion: ReunionEvent;
  voteReunionDate: (optionId: string) => void;
  rsvpReunion: (status: 'going' | 'maybe' | 'cantGo') => void;
  requests: CircleJoinRequest[];
  submitJoinRequest: (circleId: string, circleName: string, batch: string, memoryAnswers: any[], gestureVerified: boolean, documentAttached?: string) => void;
  cancelRequest: (requestId: string) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus, notes?: string) => void;
  adminMode: boolean;
  toggleAdminMode: () => void;
  chats: ChatThread[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  sendMessage: (chatId: string, text: string, image?: string) => void;
  setChatWallpaper: (chatId: string, wallpaper: ChatThread['wallpaper']) => void;
  reactToMessage: (chatId: string, messageId: string, emoji: string) => void;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addTimelineEntry: (entry: Omit<TimelineEntry, 'id'>) => void;
  deleteTimelineEntry: (id: string) => void;

  // User Management & Roles
  allUsers: UserProfile[];
  updateUserRole: (userId: string, newRole: AdminRole) => void;
  toggleUserSuspension: (userId: string) => void;
  currentUserRole: AdminRole;
  switchPreviewRole: (role: AdminRole) => void;

  // Moderation & Reporting
  reportedContent: ReportedContent[];
  reportItem: (item: Omit<ReportedContent, 'id' | 'reportedAt' | 'status'>) => void;
  resolveReport: (reportId: string, actionTaken: 'removed' | 'dismissed' | 'warned', notes?: string) => void;
  removeReportedContent: (reportId: string) => void;

  // Admin Audit Log
  auditLogs: AdminAuditLog[];
  addAuditLog: (action: string, targetType: AdminAuditLog['targetType'], targetId: string, targetName: string, details?: string, result?: AdminAuditLog['result']) => void;

  // Privacy & Access Helpers
  canAccessCircleContent: (circle: Circle) => boolean;
  isCircleAdmin: (circleId: string) => boolean;
  
  // Modals & Overlays
  isCreateMenuOpen: boolean;
  openCreateMenu: () => void;
  closeCreateMenu: () => void;
  isCreateCircleModalOpen: boolean;
  openCreateCircleModal: () => void;
  closeCreateCircleModal: () => void;
  activeCircleTab: 'feed' | 'members' | 'memories' | 'reunion' | 'info' | 'announcements' | 'requests' | 'settings';
  setActiveCircleTab: (tab: 'feed' | 'members' | 'memories' | 'reunion' | 'info' | 'announcements' | 'requests' | 'settings') => void;
  activeProfileModal: UserProfile | null;
  openProfileModal: (profile: UserProfile) => void;
  closeProfileModal: () => void;
  verificationModalOpen: boolean;
  verificationTargetCircle: Circle | null;
  openVerificationModal: (circle?: Circle) => void;
  closeVerificationModal: () => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  notificationsDrawerOpen: boolean;
  setNotificationsDrawerOpen: (open: boolean) => void;
  isPWAInstallModalOpen: boolean;
  openPWAInstallModal: () => void;
  closePWAInstallModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  
  // State initialization with localStorage fallback
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('xcircle_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [radarProfiles, setRadarProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('xcircle_radar');
    return saved ? JSON.parse(saved) : INITIAL_RADAR_PROFILES;
  });

  const [circles, setCircles] = useState<Circle[]>(() => {
    const saved = localStorage.getItem('xcircle_circles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((c: any) => c.id));
          const newDefaults = INITIAL_CIRCLES.filter(c => !existingIds.has(c.id));
          return [...parsed, ...newDefaults];
        }
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_CIRCLES;
  });

  const [activeCircleId, setActiveCircleId] = useState<string>('circle_dps_2019');

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('xcircle_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    const saved = localStorage.getItem('xcircle_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });

  const [reunion, setReunion] = useState<ReunionEvent>(() => {
    const saved = localStorage.getItem('xcircle_reunion');
    return saved ? JSON.parse(saved) : INITIAL_REUNION;
  });

  const [requests, setRequests] = useState<CircleJoinRequest[]>(() => {
    const saved = localStorage.getItem('xcircle_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [chats, setChats] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('xcircle_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState<string>('chat_batch_2019');

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('xcircle_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Admin and Moderation State
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('xcircle_all_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [CURRENT_USER, ...INITIAL_RADAR_PROFILES];
  });

  const [reportedContent, setReportedContent] = useState<ReportedContent[]>(() => {
    const saved = localStorage.getItem('xcircle_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_REPORTED_CONTENT;
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('xcircle_audit_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [previewRole, setPreviewRole] = useState<AdminRole>(() => {
    return currentUser.role || 'super_admin';
  });

  const currentUserRole: AdminRole = previewRole;

  const [adminMode, setAdminMode] = useState<boolean>(true);

  // Modals & Menu
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState<boolean>(false);
  const openCreateMenu = () => setIsCreateMenuOpen(true);
  const closeCreateMenu = () => setIsCreateMenuOpen(false);

  const [isCreateCircleModalOpen, setIsCreateCircleModalOpen] = useState<boolean>(false);
  const openCreateCircleModal = () => setIsCreateCircleModalOpen(true);
  const closeCreateCircleModal = () => setIsCreateCircleModalOpen(false);

  const [activeCircleTab, setActiveCircleTab] = useState<'feed' | 'members' | 'memories' | 'reunion' | 'info' | 'announcements' | 'requests' | 'settings'>('feed');

  const [activeProfileModal, setActiveProfileModal] = useState<UserProfile | null>(null);
  const [verificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
  const [verificationTargetCircle, setVerificationTargetCircle] = useState<Circle | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState<boolean>(false);
  const [isPWAInstallModalOpen, setIsPWAInstallModalOpen] = useState<boolean>(false);
  const openPWAInstallModal = () => setIsPWAInstallModalOpen(true);
  const closePWAInstallModal = () => setIsPWAInstallModalOpen(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('xcircle_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('xcircle_radar', JSON.stringify(radarProfiles));
  }, [radarProfiles]);

  useEffect(() => {
    localStorage.setItem('xcircle_circles', JSON.stringify(circles));
  }, [circles]);

  useEffect(() => {
    localStorage.setItem('xcircle_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('xcircle_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('xcircle_reunion', JSON.stringify(reunion));
  }, [reunion]);

  useEffect(() => {
    localStorage.setItem('xcircle_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('xcircle_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('xcircle_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('xcircle_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('xcircle_reports', JSON.stringify(reportedContent));
  }, [reportedContent]);

  useEffect(() => {
    localStorage.setItem('xcircle_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const updateCurrentUser = (data: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
    showToast('Profile updated successfully');
  };

  const toggleConnect = (profileId: string) => {
    setRadarProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        const nextState = !p.isConnected;
        const nextSent = !nextState;
        showToast(nextState ? `Connected with ${p.name}` : `Connection request sent to ${p.name}`);
        return {
          ...p,
          isConnected: nextState,
          requestSent: nextSent
        };
      }
      return p;
    }));
  };

  const addAuditLog = (
    action: string, 
    targetType: AdminAuditLog['targetType'], 
    targetId: string, 
    targetName: string, 
    details?: string, 
    result: AdminAuditLog['result'] = 'success'
  ) => {
    const newLog: AdminAuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser.id,
      adminName: `${currentUser.name} (${currentUserRole.replace('_', ' ').toUpperCase()})`,
      adminRole: currentUserRole,
      action,
      targetType,
      targetId,
      targetName,
      timestamp: 'Just now',
      result,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const createCircle = (circleData: Partial<Circle>) => {
    const newCircle: Circle = {
      id: `circle_${Date.now()}`,
      name: circleData.name || 'New Community Circle',
      batch: circleData.batch || (circleData.category === 'apartment_local' ? 'Residents Guild' : 'Class of 2026'),
      membersCount: 1,
      type: circleData.type || (circleData.category === 'employer' ? 'company' : circleData.category === 'academic' ? 'school' : 'fellowship'),
      category: circleData.category || 'academic',
      subtype: circleData.subtype,
      isPrivate: Boolean(circleData.isPrivate),
      interests: circleData.interests || [],
      guidelines: circleData.guidelines || [
        'Respect all community members',
        'No spam, commercial ads, or harassment',
        'Verify facts before sharing sensitive info'
      ],
      companyName: circleData.companyName,
      companyInfo: circleData.companyInfo,
      departmentOrCohort: circleData.departmentOrCohort,
      workplaceDomain: circleData.workplaceDomain,
      locality: circleData.locality,
      city: circleData.city,
      societyName: circleData.societyName,
      communityRules: circleData.communityRules || (circleData.locality ? [
        'Locality verification required',
        'Privacy First: Never share exact flat/unit numbers',
        'Respect neighbor quiet hours'
      ] : undefined),
      privacyNotice: circleData.isPrivate 
        ? 'Private Circle: Content, discussions and member list are restricted to approved members only.' 
        : (circleData.locality ? 'Privacy Shield: Exact apartment numbers are never displayed publicly.' : undefined),
      verificationStatus: circleData.isPrivate ? 'document_reviewed' : 'peer_confirmed',
      description: circleData.description || 'A gathering place for shared memories and connections.',
      coverImage: circleData.coverImage || '/src/assets/images/xcircle_community_campus_1793604164603.jpg',
      establishedYear: new Date().getFullYear().toString(),
      isJoined: true,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      status: 'active',
      members: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: 'admin',
          batch: currentUser.batch,
          verificationStatus: 'peer_confirmed',
          joinedDate: 'Just now'
        }
      ]
    };

    setCircles(prev => [newCircle, ...prev]);
    setActiveCircleId(newCircle.id);
    setCurrentScreen('circles');
    addAuditLog(
      'Created Circle', 
      'circle', 
      newCircle.id, 
      newCircle.name, 
      `Created ${newCircle.category} circle (${newCircle.isPrivate ? 'Private' : 'Public'})`, 
      'success'
    );
    showToast(`Circle "${newCircle.name}" created! You are the circle administrator.`);
  };

  const updateCircle = (circleId: string, data: Partial<Circle>) => {
    setCircles(prev => prev.map(c => c.id === circleId ? { ...c, ...data } : c));
    const target = circles.find(c => c.id === circleId);
    addAuditLog('Updated Circle Details', 'circle', circleId, target?.name || 'Circle', 'Modified circle settings', 'success');
    showToast('Circle details updated');
  };

  const archiveCircle = (circleId: string) => {
    setCircles(prev => prev.map(c => c.id === circleId ? { ...c, status: 'archived', archivedAt: new Date().toLocaleDateString() } : c));
    const target = circles.find(c => c.id === circleId);
    addAuditLog('Archived Circle', 'circle', circleId, target?.name || 'Circle', 'Archived community from public search', 'warning');
    showToast('Circle archived');
  };

  const deleteCircle = (circleId: string) => {
    const target = circles.find(c => c.id === circleId);
    setCircles(prev => prev.filter(c => c.id !== circleId));
    if (activeCircleId === circleId) {
      const remaining = circles.filter(c => c.id !== circleId);
      if (remaining.length > 0) setActiveCircleId(remaining[0].id);
    }
    addAuditLog('Deleted Circle', 'circle', circleId, target?.name || 'Circle', 'Permanently removed circle', 'warning');
    showToast('Circle removed');
  };

  const approveCircle = (circleId: string) => {
    setCircles(prev => prev.map(c => c.id === circleId ? { ...c, status: 'active', verificationStatus: 'peer_confirmed' } : c));
    const target = circles.find(c => c.id === circleId);
    addAuditLog('Approved Circle', 'circle', circleId, target?.name || 'Circle', 'Moderation review passed', 'success');
    showToast('Circle approved & published');
  };

  const rejectCircle = (circleId: string) => {
    setCircles(prev => prev.map(c => c.id === circleId ? { ...c, status: 'rejected' } : c));
    const target = circles.find(c => c.id === circleId);
    addAuditLog('Rejected Circle', 'circle', circleId, target?.name || 'Circle', 'Failed moderation verification guidelines', 'warning');
    showToast('Circle rejected');
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast('Post removed');
  };

  const addPost = (content: string, tag: CommunityPost['tag'] = 'General', image?: string) => {
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      circleId: activeCircleId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorBatch: currentUser.batch,
      content,
      tag,
      image,
      createdAt: 'Just now',
      likes: 1,
      isLiked: true,
      reactions: { heart: 1, nostalgia: 0, highFive: 0 },
      userReaction: 'heart',
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    showToast('Post published to Circle Feed');
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const nextLiked = !post.isLiked;
        return {
          ...post,
          isLiked: nextLiked,
          likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
        };
      }
      return post;
    }));
  };

  const reactToPost = (postId: string, reaction: 'heart' | 'nostalgia' | 'highFive') => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentReaction = post.userReaction;
        const newReactions = { ...post.reactions };
        
        if (currentReaction) {
          newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
        }

        if (currentReaction === reaction) {
          return {
            ...post,
            userReaction: null,
            reactions: newReactions
          };
        } else {
          newReactions[reaction] = (newReactions[reaction] || 0) + 1;
          return {
            ...post,
            userReaction: reaction,
            reactions: newReactions
          };
        }
      }
      return post;
    }));
  };

  const addComment = (postId: string, text: string) => {
    const comment = {
      id: `comm_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text,
      createdAt: 'Just now',
      likes: 0
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, comment]
        };
      }
      return p;
    }));
    showToast('Comment added');
  };

  const addMemory = (title: string, year: string, image: string, caption: string, eventTag: string) => {
    const newMemory: MemoryItem = {
      id: `mem_${Date.now()}`,
      circleId: activeCircleId,
      title,
      year,
      image,
      caption,
      uploadedBy: currentUser.name,
      likes: 1,
      isLiked: true,
      eventTag
    };

    setMemories(prev => [newMemory, ...prev]);
    showToast('Memory added to the Vault!');
  };

  const likeMemory = (memoryId: string) => {
    setMemories(prev => prev.map(m => {
      if (m.id === memoryId) {
        const nextLiked = !m.isLiked;
        return {
          ...m,
          isLiked: nextLiked,
          likes: nextLiked ? m.likes + 1 : Math.max(0, m.likes - 1)
        };
      }
      return m;
    }));
  };

  const voteReunionDate = (optionId: string) => {
    setReunion(prev => {
      return {
        ...prev,
        proposedDates: prev.proposedDates.map(opt => {
          if (opt.id === optionId) {
            const hasVoted = opt.voterNames.includes(currentUser.name);
            return {
              ...opt,
              votes: hasVoted ? opt.votes - 1 : opt.votes + 1,
              voterNames: hasVoted 
                ? opt.voterNames.filter(n => n !== currentUser.name)
                : [...opt.voterNames, currentUser.name]
            };
          }
          return opt;
        })
      };
    });
    showToast('Reunion vote updated!');
  };

  const rsvpReunion = (status: 'going' | 'maybe' | 'cantGo') => {
    setReunion(prev => {
      const prevStatus = prev.userRsvp;
      const nextRsvps = { ...prev.rsvps };
      if (prevStatus) {
        nextRsvps[prevStatus] = Math.max(0, nextRsvps[prevStatus] - 1);
      }
      nextRsvps[status] = (nextRsvps[status] || 0) + 1;
      return {
        ...prev,
        userRsvp: status,
        rsvps: nextRsvps
      };
    });
    showToast(`RSVP set to ${status === 'going' ? 'Going! 🎉' : status}`);
  };

  const submitJoinRequest = (
    circleId: string, 
    circleName: string, 
    batch: string, 
    memoryAnswers: any[], 
    gestureVerified: boolean, 
    documentAttached?: string
  ) => {
    const newRequest: CircleJoinRequest = {
      id: `req_${Date.now()}`,
      circleId,
      circleName,
      batch,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantAvatar: currentUser.avatar,
      submittedAt: 'Just now',
      status: 'pending',
      memoryAnswers,
      gestureVerified,
      documentAttached,
      adminNotes: 'Submitted via multi-step verification protocol.'
    };

    setRequests(prev => [newRequest, ...prev]);
    showToast('Verification submitted! Application is now PENDING review.');
  };

  const cancelRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    showToast('Request cancelled');
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus, notes?: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          adminNotes: notes || r.adminNotes
        };
      }
      return r;
    }));

    showToast(`Request updated to ${status.toUpperCase()}`);
  };

  const toggleAdminMode = () => {
    setAdminMode(prev => {
      const next = !prev;
      showToast(next ? 'Admin Mode enabled: you can review and approve pending verification requests.' : 'Admin Mode disabled');
      return next;
    });
  };

  const sendMessage = (chatId: string, text: string, image?: string) => {
    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: text || (image ? '📷 Sent a photo' : ''),
          lastTimestamp: 'Just now',
          messages: [...chat.messages, newMsg]
        };
      }
      return chat;
    }));
  };

  const setChatWallpaper = (chatId: string, wallpaper: ChatThread['wallpaper']) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, wallpaper };
      }
      return chat;
    }));
    showToast(`Wallpaper changed to ${wallpaper}`);
  };

  const reactToMessage = (chatId: string, messageId: string, emoji: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(m => {
            if (m.id === messageId) {
              return {
                ...m,
                reaction: m.reaction === emoji ? undefined : emoji
              };
            }
            return m;
          })
        };
      }
      return chat;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const addTimelineEntry = (entry: Omit<TimelineEntry, 'id'>) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: `tl_${Date.now()}`
    };

    setCurrentUser(prev => ({
      ...prev,
      timeline: [newEntry, ...prev.timeline],
      trustScore: Math.min(100, prev.trustScore + (entry.verificationStatus === 'document_submitted' ? 4 : 2))
    }));
    showToast('Experience added to your Life Timeline');
  };

  const deleteTimelineEntry = (id: string) => {
    setCurrentUser(prev => ({
      ...prev,
      timeline: prev.timeline.filter(t => t.id !== id)
    }));
    showToast('Timeline entry removed');
  };

  const openProfileModal = (profile: UserProfile) => {
    setActiveProfileModal(profile);
  };

  const closeProfileModal = () => {
    setActiveProfileModal(null);
  };

  const openVerificationModal = (circle?: Circle) => {
    setVerificationTargetCircle(circle || circles.find(c => c.id === activeCircleId) || circles[0]);
    setVerificationModalOpen(true);
  };

  const closeVerificationModal = () => {
    setVerificationModalOpen(false);
    setVerificationTargetCircle(null);
  };

  const updateUserRole = (userId: string, newRole: AdminRole) => {
    if (currentUserRole !== 'super_admin' && currentUserRole !== 'admin') {
      showToast('Permission denied: Only Administrators can modify roles');
      return;
    }
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
      setPreviewRole(newRole);
    }
    const targetUser = allUsers.find(u => u.id === userId);
    addAuditLog('Updated User Role', 'user', userId, targetUser?.name || 'User', `Assigned role ${newRole}`, 'success');
    showToast(`Role updated to ${newRole.replace('_', ' ').toUpperCase()}`);
  };

  const toggleUserSuspension = (userId: string) => {
    if (currentUserRole !== 'super_admin' && currentUserRole !== 'admin') {
      showToast('Permission denied: Only Administrators can suspend accounts');
      return;
    }
    const targetUser = allUsers.find(u => u.id === userId);
    const willSuspend = targetUser?.status !== 'suspended';
    const nextStatus: UserAccountStatus = willSuspend ? 'suspended' : 'active';
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    addAuditLog(willSuspend ? 'Suspended Account' : 'Reactivated Account', 'user', userId, targetUser?.name || 'User', `Status changed to ${nextStatus}`, 'warning');
    showToast(`Account ${willSuspend ? 'SUSPENDED' : 'REACTIVATED'}`);
  };

  const switchPreviewRole = (role: AdminRole) => {
    setPreviewRole(role);
    showToast(`Role preview switched to: ${role.replace('_', ' ').toUpperCase()}`);
    addAuditLog('Switched Role Preview', 'system', currentUser.id, currentUser.name, `Simulating interface as ${role}`, 'success');
  };

  const reportItem = (item: Omit<ReportedContent, 'id' | 'reportedAt' | 'status'>) => {
    const newReport: ReportedContent = {
      ...item,
      id: `rep_${Date.now()}`,
      reportedAt: 'Just now',
      status: 'pending'
    };
    setReportedContent(prev => [newReport, ...prev]);
    showToast('Report submitted to Community Moderation team.');
  };

  const resolveReport = (reportId: string, actionTaken: 'removed' | 'dismissed' | 'warned', notes?: string) => {
    setReportedContent(prev => prev.map(r => r.id === reportId ? { ...r, status: actionTaken === 'dismissed' ? 'dismissed' : 'resolved', notes } : r));
    const rep = reportedContent.find(r => r.id === reportId);
    const targetType = rep?.type === 'circle' ? 'circle' : rep?.type === 'user' ? 'user' : rep?.type === 'comment' ? 'comment' : 'post';
    addAuditLog(`Resolved Report (${actionTaken.toUpperCase()})`, targetType, rep?.targetId || 'item', rep?.targetTitle || 'Item', notes || `Action: ${actionTaken}`, 'success');
    showToast(`Report marked as ${actionTaken.toUpperCase()}`);
  };

  const removeReportedContent = (reportId: string) => {
    const rep = reportedContent.find(r => r.id === reportId);
    if (!rep) return;
    if (rep.type === 'post') {
      deletePost(rep.targetId);
    }
    resolveReport(reportId, 'removed', 'Content removed by administrator');
  };

  const canAccessCircleContent = (circle: Circle): boolean => {
    if (!circle.isPrivate) return true;
    if (currentUserRole === 'super_admin' || currentUserRole === 'admin') return true;
    if (circle.isJoined) return true;
    if (circle.members?.some(m => m.userId === currentUser.id)) return true;
    return false;
  };

  const isCircleAdmin = (circleId: string): boolean => {
    if (currentUserRole === 'super_admin' || currentUserRole === 'admin') return true;
    const circle = circles.find(c => c.id === circleId);
    if (!circle) return false;
    if (circle.creatorId === currentUser.id) return true;
    return circle.members?.some(m => m.userId === currentUser.id && m.role === 'admin') || false;
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        currentUser,
        updateCurrentUser,
        radarProfiles,
        toggleConnect,
        circles,
        activeCircleId,
        setActiveCircleId,
        createCircle,
        updateCircle,
        archiveCircle,
        deleteCircle,
        approveCircle,
        rejectCircle,
        posts,
        addPost,
        likePost,
        reactToPost,
        addComment,
        deletePost,
        memories,
        addMemory,
        likeMemory,
        reunion,
        voteReunionDate,
        rsvpReunion,
        requests,
        submitJoinRequest,
        cancelRequest,
        updateRequestStatus,
        adminMode,
        toggleAdminMode,
        chats,
        activeChatId,
        setActiveChatId,
        sendMessage,
        setChatWallpaper,
        reactToMessage,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        addTimelineEntry,
        deleteTimelineEntry,
        allUsers,
        updateUserRole,
        toggleUserSuspension,
        currentUserRole,
        switchPreviewRole,
        reportedContent,
        reportItem,
        resolveReport,
        removeReportedContent,
        auditLogs,
        addAuditLog,
        canAccessCircleContent,
        isCircleAdmin,
        isCreateMenuOpen,
        openCreateMenu,
        closeCreateMenu,
        isCreateCircleModalOpen,
        openCreateCircleModal,
        closeCreateCircleModal,
        activeCircleTab,
        setActiveCircleTab,
        activeProfileModal,
        openProfileModal,
        closeProfileModal,
        verificationModalOpen,
        verificationTargetCircle,
        openVerificationModal,
        closeVerificationModal,
        searchModalOpen,
        setSearchModalOpen,
        notificationsDrawerOpen,
        setNotificationsDrawerOpen,
        isPWAInstallModalOpen,
        openPWAInstallModal,
        closePWAInstallModal,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
