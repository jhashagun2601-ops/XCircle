import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  AdminRole, 
  CircleMajorCategory, 
  Circle, 
  UserProfile, 
  RequestStatus, 
  ReportedContent 
} from '../../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Layers, 
  Lock, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Trash2, 
  Edit3, 
  UserCheck, 
  UserX, 
  Clock, 
  Activity, 
  ChevronRight, 
  Sparkles, 
  ExternalLink, 
  AlertOctagon, 
  Info, 
  Archive, 
  CornerDownRight,
  Shield,
  MessageSquare
} from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    updateUserRole, 
    toggleUserSuspension, 
    currentUserRole, 
    switchPreviewRole,
    circles, 
    updateCircle, 
    archiveCircle, 
    deleteCircle, 
    approveCircle, 
    rejectCircle, 
    requests, 
    updateRequestStatus, 
    posts, 
    deletePost, 
    reportedContent, 
    resolveReport, 
    removeReportedContent, 
    auditLogs, 
    addAuditLog,
    openProfileModal, 
    setActiveCircleId, 
    setCurrentScreen, 
    showToast 
  } = useApp();

  const { isSupabaseConfigured } = useAuth();

  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'circles' | 'requests' | 'moderation' | 'logs'>('overview');

  // Confirmation Modals State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    isDestructive: boolean;
    onConfirm: () => void;
  } | null>(null);

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | AdminRole>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Circle Management State
  const [circleSearchQuery, setCircleSearchQuery] = useState('');
  const [circleCategoryFilter, setCircleCategoryFilter] = useState<'all' | CircleMajorCategory>('all');
  const [circleVisibilityFilter, setCircleVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [editingCircle, setEditingCircle] = useState<Circle | null>(null);

  // Join Request Management State
  const [requestStatusFilter, setRequestStatusFilter] = useState<'all' | RequestStatus>('all');
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState<{ [reqId: string]: string }>({});

  // Moderation State
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [reportSearchQuery, setReportSearchQuery] = useState('');

  // Audit Logs State
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState<'all' | 'user' | 'circle' | 'post' | 'request' | 'system'>('all');

  // RBAC Permission Gates
  const isSuperAdmin = currentUserRole === 'super_admin';
  const isAdmin = currentUserRole === 'admin' || isSuperAdmin;
  const isModerator = currentUserRole === 'moderator' || isAdmin;

  // Overview Metrics Computations
  const totalUsersCount = allUsers.length;
  const activeUsersCount = allUsers.filter(u => u.status !== 'suspended').length;
  const suspendedUsersCount = allUsers.filter(u => u.status === 'suspended').length;
  const totalCirclesCount = circles.length;
  const publicCirclesCount = circles.filter(c => !c.isPrivate).length;
  const privateCirclesCount = circles.filter(c => c.isPrivate).length;
  const pendingRequestsCount = requests.filter(r => r.status === 'pending' || r.status === 'reviewing').length;
  const totalPostsCount = posts.length;
  const activeReportsCount = reportedContent.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner & Role Simulator */}
      <div className="bg-[#142238] border border-[#242831] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#344B6B]/20 text-[#344B6B] border border-[#344B6B]/40">
              <ShieldCheck className="w-6 h-6 text-[#344B6B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F8] font-display">
                  Platform Administration & Governance
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#344B6B]/20 text-[#A7AFBC] border border-[#344B6B]/40 font-semibold">
                  RBAC Active
                </span>
              </div>
              <p className="text-xs text-[#A7AFBC] mt-0.5">
                Central control panel for users, verified circle categories, membership approvals, content moderation, and audit logs.
              </p>
            </div>
          </div>

          {/* Role Preview Switcher for Testing */}
          <div className="bg-[#101827] border border-[#242831] rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0">
            <div className="text-[11px] text-[#A7AFBC]">
              <span className="font-medium text-[#F5F6F8]">Preview as Role:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { role: 'super_admin' as AdminRole, label: 'Super Admin' },
                { role: 'admin' as AdminRole, label: 'Admin' },
                { role: 'moderator' as AdminRole, label: 'Moderator' },
                { role: 'circle_admin' as AdminRole, label: 'Circle Admin' },
                { role: 'member' as AdminRole, label: 'Member' }
              ].map(item => (
                <button
                  key={item.role}
                  onClick={() => switchPreviewRole(item.role)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    currentUserRole === item.role
                      ? 'bg-[#344B6B] text-[#F5F6F8] shadow-sm'
                      : 'bg-[#142238] text-[#A7AFBC] hover:text-[#F5F6F8] border border-[#242831]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real Security Architecture Notice */}
        <div className="p-3 rounded-xl bg-[#1B1E24] border border-[#242831] flex items-start gap-2.5 text-xs text-[#A7AFBC]">
          <Info className="w-4 h-4 text-[#344B6B] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[#F5F6F8] font-semibold">Server-Side Security Enforcement:</span>
            <p className="text-[11px] leading-relaxed">
              XCircle enforces role permissions across all mutation methods. In full production with Supabase connected ({isSupabaseConfigured ? '✓ Active' : 'Offline / Preview Mode'}), database security policies (Row Level Security / RLS) validate user roles via JWT claims on every query so client-side state manipulation cannot compromise private circles or administrative actions.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#242831]">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: Activity, count: undefined },
            { id: 'users', label: 'User Governance', icon: Users, count: totalUsersCount },
            { id: 'circles', label: 'Circle Management', icon: Layers, count: totalCirclesCount },
            { id: 'requests', label: 'Join Requests', icon: ShieldAlert, count: pendingRequestsCount },
            { id: 'moderation', label: 'Content Moderation', icon: AlertOctagon, count: activeReportsCount },
            { id: 'logs', label: 'Audit Trail', icon: FileText, count: auditLogs.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isTabActive
                    ? 'bg-[#344B6B] text-[#F5F6F8] shadow-sm'
                    : 'text-[#A7AFBC] hover:text-[#F5F6F8] hover:bg-[#1B1E24]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-[#F5F6F8]' : 'text-[#A7AFBC]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isTabActive ? 'bg-[#101827] text-[#F5F6F8]' : 'bg-[#101827] text-[#A7AFBC] border border-[#242831]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & DASHBOARD METRICS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#142238] border border-[#242831] rounded-2xl p-4.5 space-y-1 shadow-md">
              <div className="flex items-center justify-between text-[#A7AFBC]">
                <span className="text-xs font-medium">Total Registered Users</span>
                <Users className="w-4 h-4 text-[#344B6B]" />
              </div>
              <p className="text-2xl font-bold text-[#F5F6F8] font-display">{totalUsersCount}</p>
              <p className="text-[11px] text-emerald-400 font-medium">{activeUsersCount} active · {suspendedUsersCount} suspended</p>
            </div>

            <div className="bg-[#142238] border border-[#242831] rounded-2xl p-4.5 space-y-1 shadow-md">
              <div className="flex items-center justify-between text-[#A7AFBC]">
                <span className="text-xs font-medium">Discovered Circles</span>
                <Layers className="w-4 h-4 text-[#344B6B]" />
              </div>
              <p className="text-2xl font-bold text-[#F5F6F8] font-display">{totalCirclesCount}</p>
              <p className="text-[11px] text-[#A7AFBC] font-medium">{publicCirclesCount} public · {privateCirclesCount} private</p>
            </div>

            <div className="bg-[#142238] border border-[#242831] rounded-2xl p-4.5 space-y-1 shadow-md">
              <div className="flex items-center justify-between text-[#A7AFBC]">
                <span className="text-xs font-medium">Pending Join Requests</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-[#F5F6F8] font-display">{pendingRequestsCount}</p>
              <p className="text-[11px] text-amber-400 font-medium">Awaiting peer/admin verification</p>
            </div>

            <div className="bg-[#142238] border border-[#242831] rounded-2xl p-4.5 space-y-1 shadow-md">
              <div className="flex items-center justify-between text-[#A7AFBC]">
                <span className="text-xs font-medium">Content Reports</span>
                <AlertOctagon className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl font-bold text-[#F5F6F8] font-display">{activeReportsCount}</p>
              <p className="text-[11px] text-rose-300 font-medium">Pending moderation review</p>
            </div>
          </div>

          {/* Quick Access Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Circle Distribution by Category */}
            <div className="bg-[#142238] border border-[#242831] rounded-2xl p-5 space-y-3 shadow-md">
              <h3 className="text-xs font-bold text-[#F5F6F8] uppercase tracking-wider">
                Circle Categories Breakdown
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { cat: 'academic', label: 'Academic Circles', count: circles.filter(c => c.category === 'academic').length, color: 'bg-sky-500' },
                  { cat: 'employer', label: 'Employer & Workplaces', count: circles.filter(c => c.category === 'employer').length, color: 'bg-amber-500' },
                  { cat: 'apartment_local', label: 'Apartments & Societies', count: circles.filter(c => c.category === 'apartment_local').length, color: 'bg-emerald-500' },
                  { cat: 'interest', label: 'Interest & Hobby Hubs', count: circles.filter(c => c.category === 'interest').length, color: 'bg-purple-500' },
                  { cat: 'location', label: 'Regional & City Chapters', count: circles.filter(c => c.category === 'location').length, color: 'bg-teal-500' }
                ].map(item => (
                  <div key={item.cat} className="flex items-center justify-between p-2 rounded-xl bg-[#1B1E24] border border-[#242831]">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[#F5F6F8] font-medium">{item.label}</span>
                    </div>
                    <span className="font-mono text-[#A7AFBC]">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Requests Quick Actions */}
            <div className="bg-[#142238] border border-[#242831] rounded-2xl p-5 space-y-3 shadow-md md:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#F5F6F8] uppercase tracking-wider">
                  Pending Verifications & Join Requests
                </h3>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-xs text-[#344B6B] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>View All ({requests.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {pendingRequestsCount === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#1B1E24] border border-[#242831] text-[#A7AFBC] text-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="font-medium text-[#F5F6F8]">All join requests reviewed</p>
                  <p className="text-[11px] mt-0.5">No pending candidate verifications requiring immediate attention.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {requests.filter(r => r.status === 'pending').slice(0, 3).map(req => (
                    <div key={req.id} className="p-3 rounded-xl bg-[#1B1E24] border border-[#242831] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={req.applicantAvatar} alt={req.applicantName} className="w-8 h-8 rounded-lg object-cover border border-[#242831]" />
                        <div>
                          <p className="font-bold text-[#F5F6F8]">{req.applicantName}</p>
                          <p className="text-[11px] text-[#A7AFBC]">Applying to: <span className="text-[#F5F6F8]">{req.circleName}</span> · {req.batch}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateRequestStatus(req.id, 'approved', 'Approved from Overview Dashboard')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'rejected', 'Declined from Overview Dashboard')}
                          className="px-3 py-1 bg-[#142238] hover:bg-rose-500/20 text-rose-300 border border-[#242831] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Recent System Activity Stream */}
          <div className="bg-[#142238] border border-[#242831] rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#F5F6F8] uppercase tracking-wider">
                Recent Administrative Activity Audit Trail
              </h3>
              <button
                onClick={() => setActiveTab('logs')}
                className="text-xs text-[#344B6B] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Full Audit Log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#242831] text-xs">
              {auditLogs.slice(0, 5).map(log => (
                <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      log.result === 'success' ? 'bg-emerald-400' : log.result === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    <div>
                      <p className="font-medium text-[#F5F6F8]">
                        <span className="font-bold text-[#344B6B]">{log.action}:</span> {log.targetName}
                      </p>
                      <p className="text-[11px] text-[#A7AFBC]">{log.details}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-[#A7AFBC]">{log.timestamp}</span>
                    <p className="text-[10px] text-[#A7AFBC]/80">{log.adminName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: USER GOVERNANCE & ROLES */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-[#142238] border border-[#242831] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#F5F6F8] font-display">User Directory & Roles</h2>
              <p className="text-xs text-[#A7AFBC]">Assign governance privileges, inspect verification credentials, and manage suspensions.</p>
            </div>

            {/* User Search & Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#A7AFBC]" />
                <input
                  type="text"
                  placeholder="Search user, email, handle..."
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="circle_admin">Circle Admin</option>
                <option value="member">Member</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={e => setUserStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-xl border border-[#242831]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101827] text-[#A7AFBC] uppercase text-[10px] font-mono tracking-wider">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Institution / Batch</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242831] bg-[#142238]/70 text-[#F5F6F8]">
                {allUsers
                  .filter(u => {
                    const matchQ = 
                      !userSearchQuery.trim() || 
                      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      u.handle.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      (u.email && u.email.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
                      u.institution.toLowerCase().includes(userSearchQuery.toLowerCase());
                    const matchRole = userRoleFilter === 'all' || (u.role || 'member') === userRoleFilter;
                    const matchStatus = userStatusFilter === 'all' || (u.status || 'active') === userStatusFilter;
                    return matchQ && matchRole && matchStatus;
                  })
                  .map(u => {
                    const activeRole = u.role || 'member';
                    const activeStatus = u.status || 'active';
                    return (
                      <tr key={u.id} className="hover:bg-[#1B1E24]/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover border border-[#242831]" />
                            <div>
                              <p className="font-bold text-[#F5F6F8] leading-tight">{u.name}</p>
                              <p className="text-[11px] text-[#A7AFBC]">{u.handle}</p>
                              {u.email && <p className="text-[10px] text-[#A7AFBC]/70">{u.email}</p>}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-medium text-[#F5F6F8]">{u.institution}</p>
                          <p className="text-[11px] text-[#A7AFBC]">{u.batch} · Trust {u.trustScore}</p>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{u.phoneVerified ? 'Phone Verified' : 'Peer Confirmed'}</span>
                            </span>
                            {u.phoneNumber && (
                              <p className="text-[10px] text-[#A7AFBC] font-mono">{u.phoneCountryCode || '+91'} {u.phoneNumber}</p>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {isAdmin ? (
                            <select
                              value={activeRole}
                              onChange={e => updateUserRole(u.id, e.target.value as AdminRole)}
                              className="px-2 py-1 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] font-semibold focus:outline-none focus:border-[#344B6B]"
                            >
                              <option value="super_admin">Super Admin</option>
                              <option value="admin">Admin</option>
                              <option value="moderator">Moderator</option>
                              <option value="circle_admin">Circle Admin</option>
                              <option value="member">Member</option>
                            </select>
                          ) : (
                            <span className="font-semibold uppercase text-[10px] font-mono text-[#A7AFBC]">
                              {activeRole.replace('_', ' ')}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded ${
                            activeStatus === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {activeStatus.toUpperCase()}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openProfileModal(u)}
                              className="p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] bg-[#1B1E24] border border-[#242831] rounded-lg transition-colors"
                              title="View full candidate profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {isAdmin && u.id !== currentUser.id && (
                              <button
                                onClick={() => {
                                  setConfirmModal({
                                    isOpen: true,
                                    title: activeStatus === 'active' ? `Suspend Account: ${u.name}?` : `Reactivate Account: ${u.name}?`,
                                    description: activeStatus === 'active' 
                                      ? 'Suspended users are blocked from publishing posts, joining circles, or sending messages.'
                                      : 'Reactivating will restore full platform community privileges.',
                                    confirmText: activeStatus === 'active' ? 'Suspend Account' : 'Reactivate',
                                    isDestructive: activeStatus === 'active',
                                    onConfirm: () => {
                                      toggleUserSuspension(u.id);
                                      setConfirmModal(null);
                                    }
                                  });
                                }}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  activeStatus === 'active'
                                    ? 'text-rose-400 hover:bg-rose-500/20 border-[#242831]'
                                    : 'text-emerald-400 hover:bg-emerald-500/20 border-[#242831]'
                                }`}
                                title={activeStatus === 'active' ? 'Suspend User' : 'Reactivate User'}
                              >
                                {activeStatus === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CIRCLE MANAGEMENT & GOVERNANCE */}
      {/* ========================================================================= */}
      {activeTab === 'circles' && (
        <div className="bg-[#142238] border border-[#242831] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#F5F6F8] font-display">Circle Directory & Lifecycle</h2>
              <p className="text-xs text-[#A7AFBC]">Review newly created circles, manage visibility, edit rules, or archive deprecated communities.</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#A7AFBC]" />
                <input
                  type="text"
                  placeholder="Search circle, company, locality..."
                  value={circleSearchQuery}
                  onChange={e => setCircleSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <select
                value={circleCategoryFilter}
                onChange={e => setCircleCategoryFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="employer">Employer</option>
                <option value="apartment_local">Apartment & Local</option>
                <option value="interest">Interest</option>
                <option value="location">Location Chapter</option>
              </select>

              <select
                value={circleVisibilityFilter}
                onChange={e => setCircleVisibilityFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">All Visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Circle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {circles
              .filter(c => {
                const matchQ = 
                  !circleSearchQuery.trim() || 
                  c.name.toLowerCase().includes(circleSearchQuery.toLowerCase()) ||
                  (c.companyName && c.companyName.toLowerCase().includes(circleSearchQuery.toLowerCase())) ||
                  (c.locality && c.locality.toLowerCase().includes(circleSearchQuery.toLowerCase())) ||
                  (c.institutionName && c.institutionName.toLowerCase().includes(circleSearchQuery.toLowerCase()));
                const matchCat = circleCategoryFilter === 'all' || c.category === circleCategoryFilter;
                const matchVis = circleVisibilityFilter === 'all' || 
                  (circleVisibilityFilter === 'private' ? Boolean(c.isPrivate) : !c.isPrivate);
                return matchQ && matchCat && matchVis;
              })
              .map(circle => (
                <div key={circle.id} className="bg-[#1B1E24] border border-[#242831] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-md hover:border-[#344B6B]/40 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        circle.category === 'employer' 
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          : circle.category === 'apartment_local'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : circle.category === 'interest'
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                          : 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                      }`}>
                        {circle.category.replace('_', ' ')}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {circle.isPrivate ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
                            <Lock className="w-3 h-3" />
                            <span>Private</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                            <Globe className="w-3 h-3" />
                            <span>Public</span>
                          </span>
                        )}

                        {circle.status === 'archived' && (
                          <span className="text-[10px] font-mono bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 font-bold">
                            Archived
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-[#F5F6F8] text-sm leading-snug line-clamp-1">{circle.name}</h3>
                    <p className="text-[11px] text-[#A7AFBC] line-clamp-2 leading-relaxed">{circle.description}</p>
                    
                    <div className="text-[11px] text-[#A7AFBC] space-y-0.5 pt-1 border-t border-[#242831]">
                      <p>Members: <span className="text-[#F5F6F8] font-mono">{circle.membersCount || circle.members?.length || 1}</span></p>
                      {circle.locality && <p>Locality: <span className="text-[#F5F6F8]">{circle.locality}</span></p>}
                      {circle.companyName && <p>Company: <span className="text-[#F5F6F8]">{circle.companyName}</span></p>}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-[#242831] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setActiveCircleId(circle.id);
                        setCurrentScreen('circles');
                      }}
                      className="text-xs text-[#344B6B] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Open Circle</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => setEditingCircle(circle)}
                            className="p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] bg-[#142238] border border-[#242831] rounded-lg transition-colors"
                            title="Edit Circle Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: `Archive Circle: "${circle.name}"?`,
                                description: 'Archiving unlists the circle from public explore and marks it as read-only.',
                                confirmText: 'Archive Circle',
                                isDestructive: true,
                                onConfirm: () => {
                                  archiveCircle(circle.id);
                                  setConfirmModal(null);
                                }
                              });
                            }}
                            className="p-1.5 text-amber-400 hover:bg-amber-500/20 bg-[#142238] border border-[#242831] rounded-lg transition-colors"
                            title="Archive Circle"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {isSuperAdmin && (
                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: `Permanently Delete Circle: "${circle.name}"?`,
                              description: 'Warning: This action permanently deletes all associated community posts, members, and memories.',
                              confirmText: 'Delete Permanently',
                              isDestructive: true,
                              onConfirm: () => {
                                deleteCircle(circle.id);
                                setConfirmModal(null);
                              }
                            });
                          }}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/20 bg-[#142238] border border-[#242831] rounded-lg transition-colors"
                          title="Delete Circle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Edit Circle Modal */}
          {editingCircle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-[#142238] border border-[#242831] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#242831] pb-3">
                  <h3 className="text-base font-bold text-[#F5F6F8]">Edit Circle Settings</h3>
                  <button onClick={() => setEditingCircle(null)} className="text-[#A7AFBC] hover:text-[#F5F6F8]">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#A7AFBC] mb-1">Circle Name</label>
                    <input
                      type="text"
                      value={editingCircle.name}
                      onChange={e => setEditingCircle({ ...editingCircle, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A7AFBC] mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingCircle.description}
                      onChange={e => setEditingCircle({ ...editingCircle, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B] resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#1B1E24] border border-[#242831]">
                    <div>
                      <p className="font-semibold text-[#F5F6F8]">Private Circle Gate</p>
                      <p className="text-[11px] text-[#A7AFBC]">Require approval before new members can view feed.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(editingCircle.isPrivate)}
                      onChange={e => setEditingCircle({ ...editingCircle, isPrivate: e.target.checked })}
                      className="w-4 h-4 accent-[#344B6B]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#242831]">
                  <button
                    onClick={() => setEditingCircle(null)}
                    className="px-4 py-2 text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateCircle(editingCircle.id, editingCircle);
                      setEditingCircle(null);
                    }}
                    className="px-5 py-2 text-xs bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-xl font-semibold shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: JOIN REQUEST MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'requests' && (
        <div className="bg-[#142238] border border-[#242831] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#F5F6F8] font-display">Candidate Join Requests & Verification</h2>
              <p className="text-xs text-[#A7AFBC]">Review candidate gesture selfies, yearbook answers, and document submissions.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={requestStatusFilter}
                onChange={e => setRequestStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">All Request Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewing">In Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {requests.filter(r => requestStatusFilter === 'all' || r.status === requestStatusFilter).length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-[#1B1E24] border border-[#242831] text-xs text-[#A7AFBC]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-[#F5F6F8] text-sm">No applications matching filter</p>
              <p className="text-[11px] mt-0.5">All pending candidate requests have been processed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests
                .filter(r => requestStatusFilter === 'all' || r.status === requestStatusFilter)
                .map(req => (
                  <div key={req.id} className="p-4 rounded-2xl bg-[#1B1E24] border border-[#242831] space-y-3 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242831] pb-3">
                      <div className="flex items-center gap-3">
                        <img src={req.applicantAvatar} alt={req.applicantName} className="w-10 h-10 rounded-xl object-cover border border-[#242831]" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#F5F6F8] text-sm">{req.applicantName}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              req.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#A7AFBC]">
                            Requesting to join: <strong className="text-[#F5F6F8]">{req.circleName}</strong> · Batch {req.batch} · Submitted {req.submittedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status !== 'approved' && (
                          <button
                            onClick={() => updateRequestStatus(req.id, 'approved', adminNoteInput[req.id] || 'Verified and approved')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Candidate</span>
                          </button>
                        )}
                        {req.status !== 'rejected' && (
                          <button
                            onClick={() => updateRequestStatus(req.id, 'rejected', adminNoteInput[req.id] || 'Verification declined')}
                            className="px-3.5 py-1.5 bg-[#142238] hover:bg-rose-500/20 text-rose-300 border border-[#242831] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Verification Details: Quiz, Gesture, Document */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#142238] border border-[#242831] space-y-1">
                        <span className="font-semibold text-[#F5F6F8] block">Yearbook Memory Quiz:</span>
                        {req.memoryAnswers && req.memoryAnswers.length > 0 ? (
                          req.memoryAnswers.map((ans, idx) => (
                            <p key={idx} className="text-[11px] text-[#A7AFBC] truncate">
                              Q: {ans.question} → <span className={ans.isCorrect ? 'text-emerald-400' : 'text-amber-400'}>{ans.answer}</span>
                            </p>
                          ))
                        ) : (
                          <p className="text-[11px] text-[#A7AFBC]">Standard admission quiz passed</p>
                        )}
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#142238] border border-[#242831] space-y-1">
                        <span className="font-semibold text-[#F5F6F8] block">Live Gesture Selfie:</span>
                        <p className="text-[11px] text-[#A7AFBC] flex items-center gap-1">
                          {req.gestureVerified ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Two-Finger Peace Sign Verified
                            </span>
                          ) : (
                            <span className="text-amber-400 font-medium">Pending live verification</span>
                          )}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#142238] border border-[#242831] space-y-1">
                        <span className="font-semibold text-[#F5F6F8] block">Attached Credential:</span>
                        <p className="text-[11px] text-[#A7AFBC] font-mono truncate">
                          {req.documentAttached || 'ID_Card_Batch_2019_Scan.pdf'}
                        </p>
                      </div>
                    </div>

                    {/* Admin Notes Field */}
                    <div className="flex gap-2 items-center pt-1">
                      <input
                        type="text"
                        placeholder="Add administrative review notes (e.g. Verified against yearbook register)..."
                        value={adminNoteInput[req.id] !== undefined ? adminNoteInput[req.id] : (req.adminNotes || '')}
                        onChange={e => setAdminNoteInput({ ...adminNoteInput, [req.id]: e.target.value })}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#142238] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                      />
                      <button
                        onClick={() => {
                          const note = adminNoteInput[req.id];
                          if (note) updateRequestStatus(req.id, req.status, note);
                        }}
                        className="px-3 py-1.5 bg-[#142238] border border-[#242831] hover:bg-[#1B1E24] text-[#F5F6F8] text-xs font-medium rounded-xl transition-colors"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CONTENT MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'moderation' && (
        <div className="bg-[#142238] border border-[#242831] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#F5F6F8] font-display">Content Moderation & Flagged Items</h2>
              <p className="text-xs text-[#A7AFBC]">Review reported posts, unconstructive comments, spam circles, and violation reports.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={reportStatusFilter}
                onChange={e => setReportStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">All Report Statuses</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {reportedContent
              .filter(r => reportStatusFilter === 'all' || r.status === reportStatusFilter)
              .map(rep => (
                <div key={rep.id} className="p-4 rounded-2xl bg-[#1B1E24] border border-[#242831] space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242831] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          rep.severity === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          rep.severity === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        }`}>
                          {rep.severity} Severity
                        </span>
                        <span className="text-[10px] font-mono text-[#A7AFBC] uppercase">
                          Type: {rep.type}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          rep.status === 'resolved' ? 'text-emerald-400 bg-emerald-500/10' :
                          rep.status === 'dismissed' ? 'text-[#A7AFBC] bg-[#101827]' :
                          'text-amber-400 bg-amber-500/10'
                        }`}>
                          {rep.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#F5F6F8] text-sm mt-1">{rep.targetTitle}</h4>
                      <p className="text-xs text-[#A7AFBC] mt-0.5">
                        Reported by: <span className="text-[#F5F6F8] font-medium">{rep.reportedBy}</span> ({rep.reportedAt})
                        {rep.circleName && <span> · Circle: <strong className="text-[#F5F6F8]">{rep.circleName}</strong></span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {rep.status === 'pending' && isModerator && (
                        <>
                          <button
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: `Remove Reported Content: "${rep.targetTitle}"?`,
                                description: 'This will remove the violating post/item and mark the report as resolved.',
                                confirmText: 'Remove & Resolve',
                                isDestructive: true,
                                onConfirm: () => {
                                  removeReportedContent(rep.id);
                                  setConfirmModal(null);
                                }
                              });
                            }}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Content</span>
                          </button>

                          <button
                            onClick={() => resolveReport(rep.id, 'warned', 'Official warning issued to author')}
                            className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Warn User</span>
                          </button>

                          <button
                            onClick={() => resolveReport(rep.id, 'dismissed', 'Report evaluated as false positive')}
                            className="px-3 py-1.5 bg-[#142238] hover:bg-[#101827] text-[#A7AFBC] border border-[#242831] rounded-xl text-xs font-semibold transition-colors"
                          >
                            Dismiss Report
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#142238] border border-[#242831] text-xs text-[#F5F6F8]">
                    <span className="text-[#A7AFBC] font-medium block text-[11px] mb-0.5">Report Reason:</span>
                    <p className="leading-relaxed">{rep.reason}</p>
                    {rep.notes && (
                      <p className="mt-2 pt-2 border-t border-[#242831] text-[11px] text-emerald-400 font-medium">
                        Resolution Note: {rep.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: AUDIT TRAIL & SYSTEM LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="bg-[#142238] border border-[#242831] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#F5F6F8] font-display">Administrative Activity & Security Log</h2>
              <p className="text-xs text-[#A7AFBC]">Immutable audit trail recording governance decisions, role alterations, and moderation records.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logTypeFilter}
                onChange={e => setLogTypeFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
              >
                <option value="all">All Targets</option>
                <option value="user">User Actions</option>
                <option value="circle">Circle Actions</option>
                <option value="request">Join Requests</option>
                <option value="post">Posts & Moderation</option>
                <option value="system">System / RBAC</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#242831]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101827] text-[#A7AFBC] uppercase text-[10px] font-mono tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242831] bg-[#142238]/70 text-[#F5F6F8]">
                {auditLogs
                  .filter(l => logTypeFilter === 'all' || l.targetType === logTypeFilter)
                  .map(log => (
                    <tr key={log.id} className="hover:bg-[#1B1E24]/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#A7AFBC] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#F5F6F8]">
                        {log.adminName}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#344B6B] whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#F5F6F8]">{log.targetName}</span>
                        <span className="text-[10px] text-[#A7AFBC] block uppercase font-mono">{log.targetType}</span>
                      </td>
                      <td className="py-3 px-4 text-[#A7AFBC] text-[11px] max-w-xs truncate">
                        {log.details || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          log.result === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          log.result === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {log.result.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Global Confirmation Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#142238] border border-[#242831] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                confirmModal.isDestructive ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F5F6F8] font-display">{confirmModal.title}</h3>
                <p className="text-xs text-[#A7AFBC] mt-0.5">{confirmModal.description}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#242831]">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-xs font-semibold text-[#A7AFBC] hover:text-[#F5F6F8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-lg transition-colors ${
                  confirmModal.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-[#344B6B] hover:bg-[#3d587c] text-white'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
