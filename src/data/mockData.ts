import { 
  UserProfile, 
  Circle, 
  CommunityPost, 
  MemoryItem, 
  ReunionEvent, 
  CircleJoinRequest, 
  ChatThread, 
  NotificationItem 
} from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'usr_me',
  name: 'Aastha',
  handle: '@aastha',
  avatar: '/src/assets/images/xcircle_profile_riya_1793604162630.jpg',
  bio: 'DPS Noida Batch 2019 alumna. Geography Honours & LAMP Fellowship 2026. Reconnecting with batchmates.',
  institution: 'DPS Noida · Delhi University',
  batch: 'Batch 2019',
  location: 'New Delhi / NCR',
  trustScore: 82,
  connectionsCount: 84,
  circlesCount: 6,
  privacySetting: 'public',
  timeline: [
    {
      id: 'tl_1',
      period: '2012–2019',
      institution: 'DPS Noida — Batch 2019',
      type: 'school',
      description: 'Completed High School with Humanities & Economics. Lead editor for the yearbook and debating society.',
      verificationStatus: 'peer_confirmed',
      peerEndorsementsCount: 14
    },
    {
      id: 'tl_2',
      period: '2019–2020',
      institution: 'XYZ Coaching',
      type: 'coaching',
      description: 'Foundation courses in critical reasoning & civil service aptitude.',
      verificationStatus: 'document_reviewed',
      documentName: 'Enrollment_Certificate_XYZ.pdf'
    },
    {
      id: 'tl_3',
      period: '2022',
      institution: 'Geography Honours',
      type: 'college',
      description: 'Undergraduate thesis on urban transit corridors and regional settlement geography.',
      verificationStatus: 'self_declared'
    },
    {
      id: 'tl_4',
      period: '2026',
      institution: 'LAMP Fellowship',
      type: 'fellowship',
      description: 'Legislative Assistants to Members of Parliament Fellowship. Working on national technology policy & public data rights.',
      verificationStatus: 'document_submitted',
      documentName: 'LAMP_Acceptance_2026.pdf'
    }
  ]
};

export const INITIAL_RADAR_PROFILES: UserProfile[] = [
  {
    id: 'usr_riya',
    name: 'Riya Sharma',
    handle: '@riyasharma',
    avatar: '/src/assets/images/xcircle_profile_riya_1793604162630.jpg',
    bio: 'Brand strategist, amateur botanist, DPS Noida Class of 2019. Always up for filter coffee.',
    institution: 'DPS Noida',
    batch: 'Batch 2019',
    location: 'Noida / Gurgaon',
    trustScore: 89,
    connectionsCount: 112,
    circlesCount: 4,
    sharedReason: 'DPS Noida 2019 · Same high school batch',
    mutualFriendsCount: 12,
    mutualFriendsNames: ['Aman Gupta', 'Tanvi Roy', 'Arjun Verma'],
    isConnected: false,
    requestSent: false,
    timeline: [
      {
        id: 'tl_riya_1',
        period: '2013–2019',
        institution: 'DPS Noida — Batch 2019',
        type: 'school',
        description: 'Arts & Media wing captain. Head of school photography club.',
        verificationStatus: 'peer_confirmed',
        peerEndorsementsCount: 22
      },
      {
        id: 'tl_riya_2',
        period: '2019–2022',
        institution: 'Lady Shri Ram College',
        type: 'college',
        description: 'B.A. Journalism Honours. Editor of campus publication.',
        verificationStatus: 'document_reviewed'
      }
    ]
  },
  {
    id: 'usr_aman',
    name: 'Aman Gupta',
    handle: '@amangupta',
    avatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
    bio: 'Software engineer at FinTech startup. Badminton enthusiast. DPS Noida classmate.',
    institution: 'DPS Noida · BITS Pilani',
    batch: 'Batch 2019',
    location: 'Bengaluru, India',
    trustScore: 94,
    connectionsCount: 148,
    circlesCount: 5,
    sharedReason: '4 mutual connections · Shared 2 circles',
    mutualFriendsCount: 4,
    mutualFriendsNames: ['Riya Sharma', 'Zoya Khan', 'Nikhil Rao', 'Priya S.'],
    isConnected: true,
    requestSent: false,
    timeline: [
      {
        id: 'tl_aman_1',
        period: '2014–2019',
        institution: 'DPS Noida — Batch 2019',
        type: 'school',
        description: 'Science Stream (PCM-CS). Robotics club secretary.',
        verificationStatus: 'peer_confirmed',
        peerEndorsementsCount: 29
      },
      {
        id: 'tl_aman_2',
        period: '2019–2023',
        institution: 'BITS Pilani',
        type: 'university',
        description: 'B.E. Computer Science. Graduated with First Class.',
        verificationStatus: 'document_reviewed'
      }
    ]
  },
  {
    id: 'usr_priya',
    name: 'Priya Sen',
    handle: '@priyasen',
    avatar: '/src/assets/images/xcircle_profile_priya_1793604164049.jpg',
    bio: 'Policy analyst & researcher. Former DU classmate, loves heritage walks.',
    institution: 'Delhi University',
    batch: 'Batch 2024',
    location: 'New Delhi',
    trustScore: 78,
    connectionsCount: 63,
    circlesCount: 2,
    sharedReason: 'Same college department · Delhi University 2024',
    mutualFriendsCount: 3,
    mutualFriendsNames: ['Kabir Mehta', 'Aman Gupta', 'Neha Kapoor'],
    isConnected: false,
    requestSent: false,
    timeline: [
      {
        id: 'tl_priya_1',
        period: '2021–2024',
        institution: 'Delhi University',
        type: 'college',
        description: 'M.A. Public Policy & Governance. Research scholar.',
        verificationStatus: 'peer_confirmed',
        peerEndorsementsCount: 8
      }
    ]
  },
  {
    id: 'usr_kunal',
    name: 'Kunal Singhania',
    handle: '@kunalsingh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Co-founder at GreenGrid. Formerly DPS Noida junior batch.',
    institution: 'DPS Noida · IIT Delhi',
    batch: 'Batch 2020',
    location: 'Gurgaon, India',
    trustScore: 86,
    connectionsCount: 95,
    circlesCount: 3,
    sharedReason: 'DPS Noida Alumni Network · Tech founder circuit',
    mutualFriendsCount: 5,
    mutualFriendsNames: ['Riya Sharma', 'Aman Gupta'],
    isConnected: false,
    requestSent: false,
    timeline: [
      {
        id: 'tl_kunal_1',
        period: '2013–2020',
        institution: 'DPS Noida — Batch 2020',
        type: 'school',
        description: 'Student Council vice president & physics club coordinator.',
        verificationStatus: 'peer_confirmed',
        peerEndorsementsCount: 19
      }
    ]
  },
  {
    id: 'usr_ananya',
    name: 'Ananya Deshmukh',
    handle: '@ananyad',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Product Designer at Canva. Passionate about nostalgia archives and typography.',
    institution: 'NID Ahmedabad · DPS Noida',
    batch: 'Batch 2019',
    location: 'Mumbai / Remote',
    trustScore: 91,
    connectionsCount: 130,
    circlesCount: 4,
    sharedReason: 'DPS Noida 2019 · Classmate in Section B',
    mutualFriendsCount: 8,
    mutualFriendsNames: ['Riya Sharma', 'Aman Gupta', 'Kabir Mehta'],
    isConnected: false,
    requestSent: false,
    timeline: [
      {
        id: 'tl_ananya_1',
        period: '2012–2019',
        institution: 'DPS Noida — Batch 2019',
        type: 'school',
        description: 'Section B. Art prodigy award recipient in 11th grade.',
        verificationStatus: 'peer_confirmed',
        peerEndorsementsCount: 31
      }
    ]
  }
];

export const INITIAL_CIRCLES: Circle[] = [
  {
    id: 'circle_dps_2019',
    name: 'DPS Noida — Batch 2019',
    institutionName: 'Delhi Public School, Noida',
    batch: 'Class of 2019',
    membersCount: 128,
    type: 'school',
    categoryTag: 'Schools',
    verificationStatus: 'peer_confirmed',
    description: 'The official batch circle for Delhi Public School Noida, graduating class of 2019. Preserving canteen memories, annual day stories, and organizing our upcoming 7-year reunion.',
    coverImage: '/src/assets/images/xcircle_community_campus_1793604164603.jpg',
    establishedYear: '2019',
    isJoined: true,
    reunionDue: true,
    recentActivity: 'Reunion poll active: July 18 leading with 42 votes',
    cardHeight: 'tall',
    announcements: [
      {
        id: 'ann_1',
        title: '7-Year Batch Reunion Date Finalization',
        date: 'Nov 1, 2026',
        content: 'Campus amphitheater permits submitted for July 18, 2026. Vote on the Reunion Planner tab.'
      },
      {
        id: 'ann_2',
        title: 'Memory Vault Opening for Class of 2019',
        date: 'Oct 24, 2026',
        content: 'Over 40 high-resolution farewell and sports day scans digitized and uploaded.'
      }
    ],
    members: [
      {
        userId: 'usr_me',
        name: 'Kabir Mehta',
        avatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        role: 'moderator',
        batch: '2019',
        verificationStatus: 'peer_confirmed',
        joinedDate: 'Joined Oct 2024'
      },
      {
        userId: 'usr_riya',
        name: 'Riya Sharma',
        avatar: '/src/assets/images/xcircle_profile_riya_1793604162630.jpg',
        role: 'admin',
        batch: '2019',
        verificationStatus: 'peer_confirmed',
        joinedDate: 'Joined Sep 2024'
      },
      {
        userId: 'usr_aman',
        name: 'Aman Gupta',
        avatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        role: 'member',
        batch: '2019',
        verificationStatus: 'peer_confirmed',
        joinedDate: 'Joined Sep 2024'
      },
      {
        userId: 'usr_ananya',
        name: 'Ananya Deshmukh',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        role: 'member',
        batch: '2019',
        verificationStatus: 'peer_confirmed',
        joinedDate: 'Joined Nov 2024'
      }
    ]
  },
  {
    id: 'circle_du_2024',
    name: 'Delhi University — Class of 2024',
    institutionName: 'University of Delhi',
    batch: 'Class of 2024',
    membersCount: 412,
    type: 'university',
    categoryTag: 'Universities',
    verificationStatus: 'document_reviewed',
    description: 'Central campus circle uniting North & South campus graduates across Arts, Sciences and Commerce. Sharing career opportunities, master applications, and reunion dinners.',
    coverImage: '/src/assets/images/xcircle_graduation_celebration_1793605572003.jpg',
    establishedYear: '2024',
    isJoined: true,
    reunionDue: false,
    recentActivity: '28 members discussing postgrad fellowships in New Delhi',
    cardHeight: 'medium',
    announcements: [
      {
        id: 'ann_du_1',
        title: 'Winter Alumni Networking Mixer',
        date: 'Oct 28, 2026',
        content: 'North Campus arts facade gathering scheduled for next month.'
      }
    ],
    members: []
  },
  {
    id: 'circle_modern_school',
    name: 'Modern School — Alumni Network',
    institutionName: 'Modern School Barakhamba Road',
    batch: 'All Alumni & Batches',
    membersCount: 530,
    type: 'school',
    categoryTag: 'Alumni',
    verificationStatus: 'peer_confirmed',
    description: 'Heritage circle for Old Sanawarians and Modernites. Preserving legacy inter-house competitions, debate trophies, and centennial community programs.',
    coverImage: '/src/assets/images/xcircle_campus_modern_school_1793605570820.jpg',
    establishedYear: '1995',
    isJoined: false,
    reunionDue: true,
    recentActivity: 'Centennial archival photograph series published today',
    cardHeight: 'tall',
    announcements: [],
    members: []
  },
  {
    id: 'circle_xyz_cs',
    name: 'XYZ College — Computer Science',
    institutionName: 'XYZ Institute of Technology',
    batch: 'CS & Engineering Alumni',
    membersCount: 248,
    type: 'college',
    categoryTag: 'Colleges',
    verificationStatus: 'peer_confirmed',
    description: 'Coding marathons, late-night hostel lab stories, algorithm meetups, and founder alumni building global open-source infrastructure.',
    coverImage: '/src/assets/images/xcircle_community_campus_1793604164603.jpg',
    establishedYear: '2016',
    isJoined: false,
    reunionDue: false,
    recentActivity: 'Hackathon batch retrospectives and tech referrals',
    cardHeight: 'compact',
    announcements: [],
    members: []
  },
  {
    id: 'circle_st_xaviers_2022',
    name: "St. Xavier's — Batch 2022",
    institutionName: "St. Xavier's College",
    batch: 'Class of 2022',
    membersCount: 194,
    type: 'college',
    categoryTag: 'Colleges',
    verificationStatus: 'peer_confirmed',
    description: 'The quadrangle memories, Malhar fest organizers, library foyer debates, and lifelong connections from the class of 2022.',
    coverImage: '/src/assets/images/xcircle_st_xaviers_quad_1793605572018.jpg',
    establishedYear: '2022',
    isJoined: false,
    reunionDue: false,
    recentActivity: 'Malhar throwback photo collection uploaded by Rhea P.',
    cardHeight: 'tall',
    announcements: [],
    members: []
  },
  {
    id: 'circle_former_colleagues',
    name: 'Former Colleagues — Company Community',
    institutionName: 'Fintech & Startup Alumni Clan',
    batch: 'Founding & Growth Cohorts',
    membersCount: 88,
    type: 'company',
    categoryTag: 'Workplaces',
    verificationStatus: 'peer_confirmed',
    description: 'Ex-colleagues and team alumni who built together during the hypergrowth years. Founder catchups, mentorship, and weekend badminton sessions.',
    coverImage: '/src/assets/images/xcircle_tech_alumni_colleagues_1793605572315.jpg',
    establishedYear: '2021',
    isJoined: true,
    reunionDue: false,
    recentActivity: 'Alumni coffee meetup in Indiranagar planned for Saturday',
    cardHeight: 'medium',
    announcements: [],
    members: []
  },
  {
    id: 'circle_lamp_fellows',
    name: 'LAMP Fellowship — 2026 Cohort',
    institutionName: 'PRS Legislative Research',
    batch: 'Cohort 2026',
    membersCount: 48,
    type: 'fellowship',
    categoryTag: 'Batches',
    verificationStatus: 'document_submitted',
    description: 'Legislative Assistants to Members of Parliament 2026 cohort circle. Policy briefs, parliamentary updates, and collaborative research.',
    coverImage: '/src/assets/images/xcircle_graduation_celebration_1793605572003.jpg',
    establishedYear: '2026',
    isJoined: true,
    reunionDue: false,
    recentActivity: 'New policy brief on digital public infrastructure posted',
    cardHeight: 'compact',
    announcements: [],
    members: []
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    circleId: 'circle_dps_2019',
    authorId: 'usr_riya',
    authorName: 'Riya Sharma',
    authorAvatar: '/src/assets/images/xcircle_profile_riya_1793604162630.jpg',
    authorBatch: 'Batch 2019 · Section A',
    content: 'Can you believe it has almost been 7 years since we walked out of Gate 3 on the last board exam day? Found our old class photo album from Sports Day 2018! Dropping it into the Memory Vault below. Who remembers the canteen chole bhature queue?',
    image: '/src/assets/images/xcircle_memory_school_1793604165373.jpg',
    tag: 'Throwback',
    createdAt: '3 hours ago',
    likes: 38,
    isLiked: false,
    reactions: {
      heart: 24,
      nostalgia: 31,
      highFive: 12
    },
    userReaction: null,
    comments: [
      {
        id: 'comm_1',
        authorId: 'usr_aman',
        authorName: 'Aman Gupta',
        authorAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        text: 'That chole bhature was legendary! I still think about the ₹20 plate. We need to book the amphitheater for next summer.',
        createdAt: '2 hours ago',
        likes: 9
      },
      {
        id: 'comm_2',
        authorId: 'usr_me',
        authorName: 'Kabir Mehta',
        authorAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        text: 'Look at all of us! Let us finalize the date on the Reunion Planner tab so everyone can take leave in advance.',
        createdAt: '45 mins ago',
        likes: 5
      }
    ]
  },
  {
    id: 'post_2',
    circleId: 'circle_dps_2019',
    authorId: 'usr_aman',
    authorName: 'Aman Gupta',
    authorAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
    authorBatch: 'Batch 2019 · Section C',
    content: 'Official Poll is live on the Reunion Planner! Please vote whether July 18 or August 1st works best. We have already contacted the school alumni coordinator for special campus grounds permission!',
    tag: 'Announcement',
    createdAt: 'Yesterday',
    likes: 42,
    isLiked: true,
    reactions: {
      heart: 18,
      nostalgia: 14,
      highFive: 28
    },
    userReaction: 'highFive',
    comments: [
      {
        id: 'comm_3',
        authorId: 'usr_riya',
        authorName: 'Riya Sharma',
        authorAvatar: '/src/assets/images/xcircle_profile_riya_1793604162630.jpg',
        text: 'Already voted for July! Can not wait!',
        createdAt: 'Yesterday',
        likes: 4
      }
    ]
  }
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem_1',
    circleId: 'circle_dps_2019',
    title: 'Class of 2019 — Senior Amphitheater Afternoon',
    year: '2019',
    image: '/src/assets/images/xcircle_memory_school_1793604165373.jpg',
    caption: 'Right after the farewell rehearsal. Guitar chords, yearbook signatures, and promises that we would all stay close.',
    uploadedBy: 'Riya Sharma',
    likes: 47,
    isLiked: true,
    eventTag: 'Farewell'
  },
  {
    id: 'mem_2',
    circleId: 'circle_dps_2019',
    title: 'The Iconic Courtyard & Red Brick Corridors',
    year: '2018',
    image: '/src/assets/images/xcircle_community_campus_1793604164603.jpg',
    caption: 'Running through these corridors before the second bell. The fountain circle where we traded homework notes.',
    uploadedBy: 'Aman Gupta',
    likes: 31,
    isLiked: false,
    eventTag: 'Campus Life'
  }
];

export const INITIAL_REUNION: ReunionEvent = {
  id: 'reunion_dps_2019_7yr',
  circleId: 'circle_dps_2019',
  title: '7-Year Batch Reunion: DPS Noida 2019',
  tagline: 'Seven Years, Countless Stories, One Circle.',
  milestoneYears: 7,
  location: 'DPS Noida Campus Grounds & Senior Common Hall',
  description: 'Our batch marks 7 years since graduation next summer! A full day of campus walkthroughs, recreating the classic amphitheater photo, evening dinner, and catching up with our favorite teachers.',
  confirmedDate: 'July 18, 2026',
  proposedDates: [
    {
      id: 'opt_1',
      dateStr: 'Saturday, July 18, 2026',
      location: 'Main School Auditorium & Campus Lawns',
      votes: 42,
      voterNames: ['Riya Sharma', 'Kabir Mehta', 'Aman Gupta', 'Tanvi Roy', '+38 more']
    },
    {
      id: 'opt_2',
      dateStr: 'Saturday, August 1, 2026',
      location: 'Main School Auditorium & Campus Lawns',
      votes: 21,
      voterNames: ['Kunal Singhania', 'Ananya Deshmukh', '+19 more']
    },
    {
      id: 'opt_3',
      dateStr: 'Saturday, September 5, 2026 (Teachers Day)',
      location: 'Amphitheater & Alumni Banquet',
      votes: 16,
      voterNames: ['Priya Sen', '+15 more']
    }
  ],
  rsvps: {
    going: 64,
    maybe: 28,
    cantGo: 3
  },
  userRsvp: 'going',
  organizer: 'DPS 2019 Core Reunion Committee',
  bannerImage: '/src/assets/images/xcircle_community_campus_1793604164603.jpg'
};

export const INITIAL_REQUESTS: CircleJoinRequest[] = [
  {
    id: 'req_1',
    circleId: 'circle_dps_2019',
    circleName: 'DPS Noida — Batch 2019',
    batch: 'Batch 2019',
    applicantId: 'usr_vikram',
    applicantName: 'Vikramaditya Roy',
    applicantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    submittedAt: 'Today, 11:20 AM',
    status: 'reviewing',
    memoryAnswers: [
      {
        question: "What was the canteen's most famous snack?",
        answer: 'Chole Bhature with special pickled onion',
        isCorrect: true
      },
      {
        question: 'Who was the head of the physics department in 2018?',
        answer: 'Mr. S. K. Sharma',
        isCorrect: true
      }
    ],
    gestureVerified: true,
    documentAttached: 'Vikram_Class12_AdmitCard.pdf',
    adminNotes: 'Attended Section A, recognized by 3 peer members.'
  },
  {
    id: 'req_2',
    circleId: 'circle_dps_2019',
    circleName: 'DPS Noida — Batch 2019',
    batch: 'Batch 2019',
    applicantId: 'usr_meera',
    applicantName: 'Meera Chawla',
    applicantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    submittedAt: 'Yesterday, 4:15 PM',
    status: 'pending',
    memoryAnswers: [
      {
        question: "What was the canteen's most famous snack?",
        answer: 'Chole Bhature with special pickled onion',
        isCorrect: true
      }
    ],
    gestureVerified: true,
    documentAttached: 'DPSN_Graduation_Certificate_2019.jpg'
  },
  {
    id: 'req_3',
    circleId: 'circle_iit_delhi',
    circleName: 'IIT Delhi — Alumni Tech Circle',
    batch: 'Batch 2021',
    applicantId: 'usr_me',
    applicantName: 'Kabir Mehta',
    applicantAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
    submittedAt: '3 days ago',
    status: 'approved',
    memoryAnswers: [
      {
        question: 'Main campus landmark near hostel block 4?',
        answer: 'Wind Tunnel Building',
        isCorrect: true
      }
    ],
    gestureVerified: true,
    documentAttached: 'Alumni_Membership_ID_882.pdf',
    adminNotes: 'Verified via alumni directory database.'
  }
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chat_batch_2019',
    title: 'DPS Noida 2019 — Core Group',
    type: 'group',
    avatar: '/src/assets/images/xcircle_community_campus_1793604164603.jpg',
    circleBadge: 'DPS Noida 2019',
    participants: ['Riya Sharma', 'Aman Gupta', 'Kabir Mehta', 'Ananya Deshmukh'],
    lastMessage: 'Count me in! Booking flights soon.',
    lastTimestamp: '10:42 AM',
    unreadCount: 2,
    wallpaper: 'stars',
    messages: [
      {
        id: 'm1',
        senderId: 'usr_riya',
        senderName: 'Riya Sharma',
        senderAvatar: '/src/assets/images/xcircle_profile_riya_1793604162630.jpg',
        text: 'Guys, batch 2019 reunion kab?',
        timestamp: '10:35 AM',
        reaction: '❤️'
      },
      {
        id: 'm2',
        senderId: 'usr_aman',
        senderName: 'Aman Gupta',
        senderAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        text: 'Next summer! Sab aa rahe hain. July 18th is leading the poll by a mile.',
        timestamp: '10:38 AM',
        reaction: '🔥'
      },
      {
        id: 'm3',
        senderId: 'usr_me',
        senderName: 'Kabir Mehta',
        senderAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        text: 'Count me in! Already blocked my calendar.',
        timestamp: '10:42 AM',
        reaction: '🙌'
      }
    ]
  },
  {
    id: 'chat_riya',
    title: 'Riya Sharma',
    type: 'direct',
    avatar: '/src/assets/images/xcircle_profile_riya_1793604162630.jpg',
    circleBadge: 'DPS Noida 2019',
    participants: ['Riya Sharma', 'Kabir Mehta'],
    lastMessage: 'Did you see the amphitheater picture from 2018?',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    wallpaper: 'stamps1',
    messages: [
      {
        id: 'm_r1',
        senderId: 'usr_riya',
        senderName: 'Riya Sharma',
        senderAvatar: '/src/assets/images/xcircle_profile_riya_1793604162630.jpg',
        text: 'Hey Kabir! Saw your LAMP fellowship update on your Life Timeline. Huge congratulations!',
        timestamp: 'Yesterday 6:30 PM'
      },
      {
        id: 'm_r2',
        senderId: 'usr_me',
        senderName: 'Kabir Mehta',
        senderAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        text: 'Thanks so much Riya! Are you coming to the Delhi meet this weekend?',
        timestamp: 'Yesterday 6:45 PM'
      },
      {
        id: 'm_r3',
        senderId: 'usr_riya',
        senderName: 'Riya Sharma',
        senderAvatar: '/src/assets/images/xcircle_profile_riya_1793604162630.jpg',
        text: 'Did you see the amphitheater picture from 2018? Yes, let us grab coffee at Khan Market!',
        timestamp: 'Yesterday 7:02 PM'
      }
    ]
  },
  {
    id: 'chat_aman',
    title: 'Aman Gupta',
    type: 'direct',
    avatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
    circleBadge: '4 Mutuals',
    participants: ['Aman Gupta', 'Kabir Mehta'],
    lastMessage: 'Will bring the old football jersey to the reunion haha',
    lastTimestamp: 'Oct 28',
    unreadCount: 0,
    wallpaper: 'stamps2',
    messages: [
      {
        id: 'm_a1',
        senderId: 'usr_aman',
        senderName: 'Aman Gupta',
        senderAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        text: 'Kabir, are you in Bangalore next week?',
        timestamp: 'Oct 28 2:15 PM'
      },
      {
        id: 'm_a2',
        senderId: 'usr_me',
        senderName: 'Kabir Mehta',
        senderAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        text: 'Yes! Landing on Wednesday for the policy summit.',
        timestamp: 'Oct 28 2:30 PM'
      },
      {
        id: 'm_a3',
        senderId: 'usr_aman',
        senderName: 'Aman Gupta',
        senderAvatar: '/src/assets/images/xcircle_profile_aman_1793604162607.jpg',
        text: 'Will bring the old football jersey to the reunion haha',
        timestamp: 'Oct 28 2:40 PM'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'reunion_alert',
    title: 'Reunion Poll Leading: July 18, 2026',
    description: '42 batchmates voted for Saturday, July 18 in DPS Noida Batch 2019 circle.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: 'circles'
  },
  {
    id: 'notif_2',
    type: 'connection_request',
    title: 'New Connection Request',
    description: 'Priya Sen (Delhi University 2024) sent you a connection request.',
    timestamp: '5 hours ago',
    read: false,
    actionUrl: 'radar'
  },
  {
    id: 'notif_3',
    type: 'request_approved',
    title: 'Membership Approved',
    description: 'Your verification for IIT Delhi — Alumni Tech Circle was approved.',
    timestamp: '1 day ago',
    read: true,
    actionUrl: 'requests'
  },
  {
    id: 'notif_4',
    type: 'new_post',
    title: 'Riya Sharma added a throwback memory',
    description: 'View "Class of 2019 — Senior Amphitheater Afternoon" in Memory Vault.',
    timestamp: '2 days ago',
    read: true,
    actionUrl: 'circles'
  }
];

export const CANTEEN_TRIVIA_QUESTIONS = [
  {
    question: "What was the canteen's most famous snack?",
    options: [
      'Chole Bhature with special pickled onion',
      'Double Cheese Grilled Sandwich',
      'Crispy Spring Rolls',
      'Veg Hakka Noodles'
    ],
    correctAnswer: 'Chole Bhature with special pickled onion'
  },
  {
    question: "Which tree stood right at the center of the middle courtyard?",
    options: [
      'The Old Banyan Tree',
      'Gulmohar Tree with red flowers',
      'Eucalyptus Tree',
      'Neem Tree'
    ],
    correctAnswer: 'Gulmohar Tree with red flowers'
  },
  {
    question: "What was the signature morning assembly hymn sung on Mondays?",
    options: [
      'Service Before Self',
      'Lead Kindly Light',
      'Where the Mind is Without Fear',
      'Morning Has Broken'
    ],
    correctAnswer: 'Service Before Self'
  }
];
