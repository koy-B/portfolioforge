'use client'

import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/site'
import { 
  Check, 
  RefreshCw, 
  Shield, 
  Sparkles, 
  Users, 
  MessageCircle, 
  Menu, 
  Search, 
  Filter, 
  CreditCard, 
  FileText, 
  Clock,
} from '@/lib/icons'
import type { Subscription } from '@prisma/client'
import type { SafeUser } from '@/lib/auth'

type PremiumRequest = {
  id: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED'
  message: string
  templatePreference: string | null
  createdAt: string
  updatedAt: string
  handledAt: string | null
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

type AdminLog = {
  id: string
  type: string
  message: string
  createdAt: string
  admin: { id: string; name: string } | null
  user: { id: string; name: string; email: string } | null
}

interface AdminDashboardClientProps {
  admin: SafeUser
  stats: {
    totalUsers: number
    totalPortfolios: number
    totalPremiumUsers: number
    totalPendingRequests: number
  }
  users: Array<SafeUser & { 
    profile: { type: string; bio: string; avatarUrl: string } | null; 
    subscription: Subscription | null; 
    portfolios: { id: string }[] 
  }>
  requests: PremiumRequest[]
  logs: AdminLog[]
}

type TabType = 'overview' | 'users' | 'requests' | 'logs'

export function AdminDashboardClient({ admin, stats, users, requests, logs }: AdminDashboardClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  // States
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  
  // Search & Filtering States
  const [userSearch, setUserSearch] = useState('')
  type UserRoleFilter = 'ALL' | 'USER' | 'ADMIN'
  type UserSubFilter = 'ALL' | 'FREE' | 'PREMIUM'

  const [userRoleFilter, setUserRoleFilter] = useState<UserRoleFilter>('ALL')
  const [userSubFilter, setUserSubFilter] = useState<UserSubFilter>('ALL')
  
  const [logSearch, setLogSearch] = useState('')
  const [logTypeFilter, setLogTypeFilter] = useState<string>('ALL')

  // Mutation Helper
  async function mutate(endpoint: string, options?: RequestInit, successMessage?: string) {
    setBusyKey(endpoint)
    try {
      const response = await fetch(endpoint, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Request failed')
      }

      if (successMessage) {
        toast(successMessage, 'success')
      }

      router.refresh()
    } catch (error) {
      toast((error as Error).message || 'Unable to complete the admin action.', 'error')
    } finally {
      setBusyKey(null)
    }
  }

  // Filtered Users Memo
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
      
      const matchesRole = 
        userRoleFilter === 'ALL' || 
        user.role === userRoleFilter
      
      const matchesSub = 
        userSubFilter === 'ALL' ||
        (userSubFilter === 'PREMIUM' && user.subscription?.status === 'PREMIUM') ||
        (userSubFilter === 'FREE' && (!user.subscription || user.subscription.status === 'FREE'))
      
      return matchesSearch && matchesRole && matchesSub
    })
  }, [users, userSearch, userRoleFilter, userSubFilter])

  // Filtered Logs Memo
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
        (log.user?.name && log.user.name.toLowerCase().includes(logSearch.toLowerCase())) ||
        (log.user?.email && log.user.email.toLowerCase().includes(logSearch.toLowerCase()))
      
      const matchesType = 
        logTypeFilter === 'ALL' || 
        log.type === logTypeFilter
      
      return matchesSearch && matchesType
    })
  }, [logs, logSearch, logTypeFilter])

  // Unique Log Types List for Filtering
  const logTypes = useMemo(() => {
    const types = new Set(logs.map(l => l.type))
    return Array.from(types)
  }, [logs])

  // Fast Navigation & Filtering to Logs
  const handleInspectUserLogs = (email: string) => {
    setLogSearch(email)
    setLogTypeFilter('ALL')
    setActiveTab('logs')
  }

  return (
    <div className="relative flex min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(124,79,224,0.04),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(232,103,58,0.04),transparent_30%),linear-gradient(180deg,#faf9f6_0%,#ffffff_100%)] font-sans antialiased text-brand-foreground">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <AdminSidebar name={admin.name} email={admin.email} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 flex-1 flex flex-col min-h-screen">
        {/* Modern Glassmorphic Header */}
        <header className="sticky top-0 z-30 border-b border-brand-border bg-white/75 backdrop-blur-xl transition-all duration-300">
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden rounded-2xl border border-brand-border bg-white p-2.5 text-brand-muted hover:bg-neutral-50 hover:text-black transition"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-subtle">ADMINISTRATION CONSOLE</p>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 mt-0.5">Control Tower</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => {
                  mutate('/api/admin/overview', {}, 'Stats updated successfully')
                }}
                className="h-9 px-3 text-xs bg-white border border-brand-border hover:bg-neutral-50 shadow-sm"
              >
                <RefreshCw size={12} className={busyKey ? 'animate-spin' : ''} />
                Sync
              </Button>
              <Badge variant="premium" className="h-9 px-4 py-0 flex items-center gap-1.5 rounded-full border border-[#7c4fe0]/20 bg-[#7c4fe0]/5 text-[#7c4fe0] text-xs font-semibold">
                <Shield size={13} className="text-[#e8673a]" />
                Superuser
              </Badge>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-8 px-6 py-8 lg:px-10 lg:py-10 max-w-7xl w-full mx-auto">
          {/* Glowing Stats Section */}
          <section className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Active Users', value: stats.totalUsers, icon: Users, gradient: 'from-[#7c4fe0]/10 to-indigo-500/5', border: 'border-[#7c4fe0]/15', text: 'text-[#7c4fe0]' },
              { label: 'Portfolios Generated', value: stats.totalPortfolios, icon: Sparkles, gradient: 'from-[#e8673a]/10 to-orange-500/5', border: 'border-[#e8673a]/15', text: 'text-[#e8673a]' },
              { label: 'Premium (Pro)', value: stats.totalPremiumUsers, icon: CreditCard, gradient: 'from-emerald-500/10 to-green-500/5', border: 'border-emerald-500/15', text: 'text-emerald-600' },
              { label: 'Pending Requests', value: stats.totalPendingRequests, icon: MessageCircle, gradient: 'from-amber-500/10 to-yellow-500/5', border: 'border-amber-500/15', text: 'text-amber-600' },
            ].map(({ label, value, icon: Icon, gradient, border, text }) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-3xl border border-brand-border p-6 shadow-[0_4px_20px_rgba(15,14,13,0.02)] flex items-center justify-between gap-4 overflow-hidden relative`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} blur-2xl rounded-full pointer-events-none`} />
                <div className="space-y-2 relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-subtle">{label}</p>
                  <p className="text-3xl font-black tracking-tight text-neutral-900">{value}</p>
                </div>
                <div className={`rounded-2xl border ${border} p-3.5 bg-white shadow-sm relative z-10 ${text}`}>
                  <Icon size={18} />
                </div>
              </motion.div>
            ))}
          </section>

          {/* Premium Tabbed Navigation */}
          <div className="flex border-b border-brand-border pb-px gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Dashboard Overview', count: null },
              { id: 'users', label: 'User Directory', count: filteredUsers.length },
              { id: 'requests', label: 'Pro Upgrade Requests', count: requests.length },
              { id: 'logs', label: 'Activity Logs', count: filteredLogs.length },
            ].map(tab => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative px-5 py-3 text-xs uppercase tracking-wider font-semibold transition-all duration-300 rounded-t-2xl border-t border-x border-transparent ${
                    active 
                      ? 'text-neutral-900 bg-white border-brand-border shadow-sm' 
                      : 'text-brand-subtle hover:text-neutral-900 hover:bg-neutral-50/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {tab.label}
                    {tab.count !== null && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${active ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-brand-muted'}`}>
                        {tab.count}
                      </span>
                    )}
                  </span>
                  {active && (
                    <motion.div 
                      layoutId="activeTabUnderline" 
                      className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#e8673a]" 
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab Render Content */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card padding="lg" className="rounded-3xl border border-brand-border bg-white p-8 space-y-6 shadow-sm">
                      <div className="flex items-center justify-between border-b border-brand-border pb-4">
                        <div>
                          <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wider">Upgrade Queue</h2>
                          <p className="text-xs text-brand-subtle mt-0.5">Quickly review pending member requests</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setActiveTab('requests')}
                          className="text-xs text-[#e8673a] font-semibold hover:bg-[#e8673a]/5 rounded-xl"
                        >
                          View All ({requests.length})
                        </Button>
                      </div>

                      {requests.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-brand-border bg-neutral-50/50 p-12 text-center space-y-2">
                          <Check className="mx-auto text-emerald-500" size={32} />
                          <p className="font-semibold text-neutral-800 text-sm">All caught up!</p>
                          <p className="text-xs text-brand-muted">No pending premium application logs detected.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {requests.slice(0, 3).map((req) => (
                            <div key={req.id} className="rounded-2xl border border-brand-border bg-white p-5 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center hover:shadow-sm transition-shadow">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-neutral-900 text-sm">{req.user.name}</span>
                                  <Badge variant="free" className="text-[10px] px-2 py-0">PRO REQUEST</Badge>
                                </div>
                                <p className="text-xs text-brand-muted">{req.user.email}</p>
                                <p className="text-xs text-neutral-500 italic mt-2">&ldquo;{req.message || 'No additional note provided'}&rdquo;</p>
                              </div>
                              <div className="flex gap-2 w-full md:w-auto">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  loading={busyKey === `/api/admin/premium-requests/${req.id}`}
                                  onClick={() => mutate(
                                    `/api/admin/premium-requests/${req.id}`,
                                    { method: 'PATCH', body: JSON.stringify({ action: 'approve' }) },
                                    `Upgraded ${req.user.name} to Pro`
                                  )}
                                  className="w-full md:w-auto text-xs bg-black text-white hover:bg-neutral-800"
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  loading={busyKey === `/api/admin/premium-requests/${req.id}`}
                                  onClick={() => mutate(
                                    `/api/admin/premium-requests/${req.id}`,
                                    { method: 'PATCH', body: JSON.stringify({ action: 'decline' }) },
                                    `Declined request`
                                  )}
                                  className="w-full md:w-auto text-xs text-red-600 bg-red-50 hover:bg-red-100 border-none"
                                >
                                  Refuse
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>

                    <Card padding="lg" className="rounded-3xl border border-brand-border bg-white p-8 space-y-6 shadow-sm">
                      <div className="flex items-center justify-between border-b border-brand-border pb-4">
                        <div>
                          <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wider">Latest Actions</h2>
                          <p className="text-xs text-brand-subtle mt-0.5">Live platform activity monitoring</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setActiveTab('logs')}
                          className="text-xs text-[#e8673a] font-semibold hover:bg-[#e8673a]/5 rounded-xl"
                        >
                          View Logs
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {logs.slice(0, 4).map((log) => (
                          <div key={log.id} className="rounded-2xl border border-brand-border bg-neutral-50/20 p-4 space-y-2 flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <span className="inline-block rounded-md bg-neutral-900 text-white font-mono text-[9px] px-2 py-0.5">
                                {log.type.replace(/_/g, ' ')}
                              </span>
                              <p className="text-xs text-neutral-800 font-medium">{log.message}</p>
                              {log.user && (
                                <p className="text-[10px] text-brand-subtle">Target: {log.user.name} ({log.user.email})</p>
                              )}
                            </div>
                            <span className="text-[9px] font-mono text-brand-subtle">{formatDate(log.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* 2. USER MANAGEMENT TAB */}
                {activeTab === 'users' && (
                  <Card padding="none" className="rounded-3xl border border-brand-border bg-white shadow-sm overflow-hidden space-y-6">
                    {/* Integrated Search & Advanced Filters */}
                    <div className="p-6 border-b border-brand-border bg-neutral-50/40 grid gap-4 md:grid-cols-[1.5fr_1fr_1fr] items-center">
                      <div className="relative">
                        <Search size={15} className="absolute left-4 top-3.5 text-brand-subtle" />
                        <input
                          type="text"
                          placeholder="Search users by name, email..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="w-full rounded-2xl border border-brand-border bg-white pl-10 pr-4 py-2.5 text-xs text-neutral-800 placeholder-brand-subtle focus:outline-none focus:border-[#7c4fe0] transition-colors"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Filter size={12} className="text-brand-subtle shrink-0" />
                        <select
                          value={userRoleFilter}
                          onChange={(e) => setUserRoleFilter(e.currentTarget.value as UserRoleFilter)}
                          className="w-full rounded-2xl border border-brand-border bg-white px-4 py-2.5 text-xs text-neutral-800 focus:outline-none"
                        >
                          <option value="ALL">All Roles</option>
                          <option value="USER">Regular Users</option>
                          <option value="ADMIN">Administrators</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard size={12} className="text-brand-subtle shrink-0" />
                        <select
                          value={userSubFilter}
                          onChange={(e) => setUserSubFilter(e.currentTarget.value as UserSubFilter)}
                          className="w-full rounded-2xl border border-brand-border bg-white px-4 py-2.5 text-xs text-neutral-800 focus:outline-none"
                        >
                          <option value="ALL">All Plans</option>
                          <option value="FREE">Free Tier</option>
                          <option value="PREMIUM">Premium (Pro)</option>
                        </select>
                      </div>
                    </div>

                    {/* Highly Polished Responsive Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-brand-border">
                        <thead className="bg-neutral-50/50">
                          <tr>
                            {['Member', 'Email', 'Role', 'Status', 'Portfolios', 'System Logs', 'Quick Actions'].map((h) => (
                              <th key={h} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-brand-subtle border-b border-brand-border">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border bg-white">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-12 text-center text-xs text-brand-muted">
                                No registered users found matching selected query criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((user) => {
                              const isAdmin = user.role === 'ADMIN'
                              const isPremium = user.subscription?.status === 'PREMIUM'
                              const portfoliosCount = user.portfolios.length

                              return (
                                <tr key={user.id} className="transition-colors hover:bg-neutral-50/30">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white font-bold text-xs uppercase">
                                        {user.name.slice(0, 2)}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-neutral-900 text-xs">{user.name}</p>
                                        <p className="text-[10px] text-brand-subtle">Joined {formatDate(user.createdAt)}</p>
                                      </div>
                                    </div>
                                  </td>
                                  
                                  <td className="px-6 py-4 text-xs text-neutral-600 whitespace-nowrap">
                                    {user.email}
                                  </td>
                                  
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={isAdmin ? 'premium' : 'free'} className="text-[10px] font-semibold">
                                      {user.role}
                                    </Badge>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={isPremium ? 'success' : 'free'} className="text-[10px] font-semibold">
                                      {isPremium ? 'PRO (PREMIUM)' : 'FREE'}
                                    </Badge>
                                  </td>

                                  <td className="px-6 py-4 text-xs font-bold text-neutral-900 whitespace-nowrap">
                                    {portfoliosCount}
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleInspectUserLogs(user.email)}
                                      className="text-xs text-[#7c4fe0] hover:bg-[#7c4fe0]/5 rounded-xl h-8 px-3 gap-1 border border-transparent hover:border-[#7c4fe0]/20"
                                    >
                                      <FileText size={11} />
                                      Inspect Logs
                                    </Button>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      {/* Quick Toggle PRO Button - Fulfills user request */}
                                      <Button
                                        variant={isPremium ? 'danger' : 'secondary'}
                                        size="sm"
                                        loading={busyKey === `/api/admin/subscriptions/${user.id}/premium`}
                                        onClick={() => mutate(
                                          `/api/admin/subscriptions/${user.id}/premium`,
                                          {
                                            method: 'PATCH',
                                            body: JSON.stringify({ action: isPremium ? 'deactivate' : 'activate' })
                                          },
                                          `${user.name} Pro status changed successfully.`
                                        )}
                                        className={`text-[10px] uppercase font-bold tracking-wider rounded-xl h-8 px-3.5 shadow-sm border border-brand-border ${
                                          isPremium 
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border-none' 
                                            : 'bg-white hover:bg-neutral-50 text-neutral-800'
                                        }`}
                                      >
                                        {isPremium ? 'Downgrade' : 'Upgrade to PRO'}
                                      </Button>

                                      {/* Toggle Admin Privilege */}
                                      {!isAdmin && (
                                        <Button
                                          variant="secondary"
                                          size="sm"
                                          loading={busyKey === `/api/admin/users/${user.id}/role`}
                                          onClick={() => mutate(
                                            `/api/admin/users/${user.id}/role`,
                                            {
                                              method: 'PATCH',
                                              body: JSON.stringify({ role: 'ADMIN' })
                                            },
                                            `${user.name} promoted to Admin`
                                          )}
                                          className="text-[10px] uppercase font-bold tracking-wider rounded-xl h-8 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-white"
                                        >
                                          Promote Admin
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}

                {/* 3. PREMIUM REQUESTS TAB */}
                {activeTab === 'requests' && (
                  <Card padding="lg" className="rounded-3xl border border-brand-border bg-white shadow-sm p-8 space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wider">Premium Access Request Center</h2>
                      <p className="text-xs text-brand-subtle mt-0.5">Approve applications to unlock templates and advanced layout customizers</p>
                    </div>

                    {requests.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-brand-border bg-neutral-50/50 p-16 text-center space-y-3">
                        <Check className="mx-auto text-emerald-500" size={36} />
                        <h3 className="font-bold text-neutral-800 text-sm">Inbox Fully Clear</h3>
                        <p className="text-xs text-brand-muted max-w-sm mx-auto">All users have been processed. New upgrade requests will appear here dynamically.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-brand-border">
                          <thead className="bg-neutral-50/50">
                            <tr>
                              {['User Detail', 'Email Address', 'Requested Template', 'User Message', 'Actions'].map((h) => (
                                <th key={h} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-brand-subtle border-b border-brand-border">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border bg-white">
                            {requests.map((request) => (
                              <tr key={request.id} className="transition-colors hover:bg-neutral-50/30">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <p className="font-semibold text-neutral-900 text-xs">{request.user.name}</p>
                                    <p className="text-[10px] text-brand-subtle">{formatDate(request.createdAt)}</p>
                                  </div>
                                </td>
                                
                                <td className="px-6 py-4 text-xs text-neutral-600 whitespace-nowrap">
                                  {request.user.email}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="premium" className="text-[10px] font-mono">
                                    {request.templatePreference ?? 'ANY_TEMPLATE'}
                                  </Badge>
                                </td>

                                <td className="px-6 py-4 text-xs text-brand-muted max-w-md break-words">
                                  {request.message || 'No written explanation provided.'}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex gap-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      loading={busyKey === `/api/admin/premium-requests/${request.id}`}
                                      onClick={() => mutate(
                                        `/api/admin/premium-requests/${request.id}`,
                                        {
                                          method: 'PATCH',
                                          body: JSON.stringify({ action: 'approve' })
                                        },
                                        `${request.user.name} elevated to premium status`
                                      )}
                                      className="text-xs bg-black text-white hover:bg-neutral-800 rounded-xl"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      loading={busyKey === `/api/admin/premium-requests/${request.id}`}
                                      onClick={() => mutate(
                                        `/api/admin/premium-requests/${request.id}`,
                                        {
                                          method: 'PATCH',
                                          body: JSON.stringify({ action: 'decline' })
                                        },
                                        `Application declined`
                                      )}
                                      className="text-xs text-red-600 bg-red-50 hover:bg-red-100 border-none rounded-xl"
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                )}

                {/* 4. ACTIVITY LOGS TAB */}
                {activeTab === 'logs' && (
                  <Card padding="lg" className="rounded-3xl border border-brand-border bg-white shadow-sm p-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-6">
                      <div>
                        <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wider">System Audit Trail</h2>
                        <p className="text-xs text-brand-subtle mt-0.5">Inspect automated event transcripts and security actions</p>
                      </div>

                      {/* Filter Controls */}
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        <div className="relative">
                          <Search size={13} className="absolute left-3 top-3 text-brand-subtle" />
                          <input
                            type="text"
                            placeholder="Filter logs by user..."
                            value={logSearch}
                            onChange={(e) => setLogSearch(e.target.value)}
                            className="w-full md:w-52 rounded-xl border border-brand-border bg-white pl-8 pr-4 py-2 text-xs text-neutral-800 focus:outline-none"
                          />
                        </div>

                        <select
                          value={logTypeFilter}
                          onChange={(e) => setLogTypeFilter(e.target.value)}
                          className="rounded-xl border border-brand-border bg-white px-3 py-2 text-xs text-neutral-800 focus:outline-none"
                        >
                          <option value="ALL">All Event Types</option>
                          {logTypes.map((type) => (
                            <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {filteredLogs.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-brand-border py-12 text-center text-xs text-brand-muted">
                          No audit transcript records found matching active filter metrics.
                        </div>
                      ) : (
                        filteredLogs.map((log) => (
                          <div 
                            key={log.id} 
                            className="rounded-2xl border border-brand-border bg-white p-5 space-y-3 shadow-sm hover:border-brand-subtle/50 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="inline-block rounded-md bg-[#7c4fe0]/5 text-[#7c4fe0] font-mono text-[9px] font-bold px-2 py-0.5 border border-[#7c4fe0]/10">
                                {log.type.replace(/_/g, ' ')}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-subtle">
                                <Clock size={10} />
                                {formatDate(log.createdAt)}
                              </div>
                            </div>

                            <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
                              {log.message}
                            </p>

                            <div className="pt-2 border-t border-neutral-50 flex flex-wrap gap-4 text-[10px] text-brand-subtle font-mono">
                              {log.user && (
                                <span>TARGET_USER: <span className="text-neutral-800 font-bold">{log.user.name} ({log.user.email})</span></span>
                              )}
                              {log.admin && (
                                <span>TRIGGERED_BY: <span className="text-[#e8673a] font-bold">{log.admin.name}</span></span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}
