/**
 * XCircle Type Definitions
 */

export type ScreenId = 'home' | 'explore' | 'circles' | 'radar' | 'requests' | 'chat' | 'profile';

export type VerificationBadgeType = 
  | 'peer_confirmed' 
  | 'document_reviewed' 
  | 'self_declared' 
  | 'document_submitted';

export type RequestStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface TimelineEntry {
  id: string;
  period: string; // e.g. "2012–2019"
  institution: string; // e.g. "DPS Noida — Batch 2019"
  type: 'school' | 'college' | 'university' | 'coaching' | 'company' | 'fellowship';
  description: string;
  verificationStatus: VerificationBadgeType;
  documentName?: string;
  peerEndorsementsCount?: number;
}

export type CircleMajorCategory = 'academic' | 'employer' | 'apartment_local';

export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export interface SsoOrganization {
  id: string;
  name: string;
  domain: string;
  protocol: 'saml' | 'oidc';
  logo?: string;
  ssoConfigured: boolean;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  institution: string;
  batch: string;
  location: string;
  trustScore: number;
  connectionsCount: number;
  circlesCount: number;
  timeline: TimelineEntry[];
  sharedReason?: string;
  mutualFriendsCount?: number;
  mutualFriendsNames?: string[];
  privacySetting?: 'public' | 'circles_only' | 'connections_only';
  isConnected?: boolean;
  requestSent?: boolean;
  
  // Registration & Phone Verification fields
  phoneNumber?: string;
  phoneCountryCode?: string;
  phoneVerified?: boolean;
  academicYear?: string;
  joiningYear?: string;
  employer?: string;
  apartmentCommunity?: string;
  isProfileCompleted?: boolean;
  authProvider?: 'google' | 'magic_link' | 'sso' | 'password';
}

export interface CircleMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'member' | 'admin' | 'moderator';
  batch: string;
  verificationStatus: VerificationBadgeType;
  joinedDate: string;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface CommunityPost {
  id: string;
  circleId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBatch: string;
  content: string;
  image?: string;
  tag?: 'Announcement' | 'Throwback' | 'General' | 'Question';
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  reactions: {
    heart: number;
    nostalgia: number;
    highFive: number;
  };
  userReaction?: 'heart' | 'nostalgia' | 'highFive' | null;
  comments: PostComment[];
}

export interface MemoryItem {
  id: string;
  circleId: string;
  title: string;
  year: string;
  image: string;
  caption: string;
  uploadedBy: string;
  likes: number;
  isLiked?: boolean;
  eventTag: string;
}

export interface ReunionOption {
  id: string;
  dateStr: string;
  location: string;
  votes: number;
  voterNames: string[];
}

export interface ReunionEvent {
  id: string;
  circleId: string;
  title: string;
  tagline: string;
  milestoneYears: number; // e.g. 7 years
  proposedDates: ReunionOption[];
  confirmedDate?: string;
  location: string;
  description: string;
  rsvps: {
    going: number;
    maybe: number;
    cantGo: number;
  };
  userRsvp?: 'going' | 'maybe' | 'cantGo' | null;
  organizer: string;
  bannerImage?: string;
}

export interface Circle {
  id: string;
  name: string;
  institutionName?: string;
  batch: string;
  membersCount: number;
  type: 'school' | 'college' | 'university' | 'company' | 'alumni' | 'fellowship';
  category: CircleMajorCategory; // Major category: 'academic' | 'employer' | 'apartment_local'
  categoryTag?: string; // e.g. "Schools", "Colleges", "Alumni", "Workplaces", "Batches", "Apartments"
  verificationStatus: VerificationBadgeType;
  description: string;
  coverImage?: string;
  establishedYear: string;
  members: CircleMember[];
  isJoined: boolean;
  reunionDue?: boolean;
  recentActivity?: string;
  cardHeight?: 'tall' | 'medium' | 'compact';
  announcements?: {
    id: string;
    title: string;
    date: string;
    content: string;
  }[];

  // Employer Circle Specifics
  companyName?: string;
  companyInfo?: string;
  employeeCommunity?: string;
  departmentOrCohort?: string;
  workplaceDomain?: string;

  // Apartment & Local Circle Specifics (Privacy-First)
  locality?: string;
  city?: string;
  societyName?: string;
  communityRules?: string[];
  privacyNotice?: string;
}

export interface CircleJoinRequest {
  id: string;
  circleId: string;
  circleName: string;
  batch: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  submittedAt: string;
  status: RequestStatus;
  memoryAnswers: {
    question: string;
    answer: string;
    isCorrect: boolean;
  }[];
  gestureVerified: boolean;
  documentAttached?: string;
  adminNotes?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  image?: string;
  reaction?: string;
}

export interface ChatThread {
  id: string;
  title: string;
  type: 'direct' | 'group' | 'circle';
  avatar: string;
  circleBadge?: string;
  participants: string[];
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
  wallpaper: 'stars' | 'stamps1' | 'stamps2' | 'ivory';
}

export interface NotificationItem {
  id: string;
  type: 'connection_request' | 'request_approved' | 'new_post' | 'reunion_alert' | 'message' | 'verification_update';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: ScreenId;
  metadata?: {
    avatar?: string;
    entityId?: string;
  };
}
