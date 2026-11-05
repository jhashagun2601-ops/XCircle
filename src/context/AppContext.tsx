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
  RequestStatus
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
  INITIAL_NOTIFICATIONS 
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
  posts: CommunityPost[];
  addPost: (content: string, tag?: CommunityPost['tag'], image?: string) => void;
  likePost: (postId: string) => void;
  reactToPost: (postId: string, reaction: 'heart' | 'nostalgia' | 'highFive') => void;
  addComment: (postId: string, text: string) => void;
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
  
  // Modals & Overlays
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
    return saved ? JSON.parse(saved) : INITIAL_CIRCLES;
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

  const [adminMode, setAdminMode] = useState<boolean>(false);

  // Modals
  const [activeProfileModal, setActiveProfileModal] = useState<UserProfile | null>(null);
  const [verificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
  const [verificationTargetCircle, setVerificationTargetCircle] = useState<Circle | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState<boolean>(false);
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

  const createCircle = (circleData: Partial<Circle>) => {
    const newCircle: Circle = {
      id: `circle_${Date.now()}`,
      name: circleData.name || 'New Community Circle',
      batch: circleData.batch || 'Class of 2024',
      membersCount: 1,
      type: circleData.type || 'school',
      verificationStatus: 'peer_confirmed',
      description: circleData.description || 'A gathering place for shared memories.',
      coverImage: circleData.coverImage || '/src/assets/images/xcircle_community_campus_1793604164603.jpg',
      establishedYear: new Date().getFullYear().toString(),
      isJoined: true,
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
    showToast(`Circle "${newCircle.name}" created!`);
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
        posts,
        addPost,
        likePost,
        reactToPost,
        addComment,
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
