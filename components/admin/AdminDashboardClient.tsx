'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/site'
import { Check, RefreshCw, Shield, Sparkles, Users } from '@/lib/icons'
import type { Subscription } from '@prisma/client'
import type { SafeUser } from '@/lib/auth'

interface AdminDashboardClientProps {
  admin: SafeUser
  stats: {
    totalUsers: number
    totalPortfolios: number
    totalPremiumUsers: number
  }
  users: Array<SafeUser & { profile: { type: string; bio: string; avatarUrl: string } | null; subscription: Subscription | null; portfolios: { id: string }[] }>
  subscriptions: Array<Subscription & { user: Pick<SafeUser, 'id' | 'email' | 'name' | 'role'> }>
}

export function AdminDashboardClient({ admin, stats, users, subscriptions }: AdminDashboardClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [busyKey, setBusyKey] = useState<string | null>(null)

  async function mutate(endpoint: string, options?: RequestInit, successMessage?: string) {
    setBusyKey(endpoint)
    try {
      const response = await fetch(endpoint, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      if (successMessage) {
        toast(successMessage, 'success')
      }

      router.refresh()
    } catch {
      toast('Unable to complete the admin action.', 'error')
    } finally {
      setBusyKey(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(232,103,58,0.08),transparent_30%),linear-gradient(180deg,#f8f7f4_0%,#fdfcfb_100%)]">
      <AdminSidebar name={admin.name} email={admin.email} />

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-brand-border bg-white/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle">Admin console</p>
              <h1 className="text-lg font-semibold text-brand-foreground">Overview</h1>
            </div>
            <Badge variant="premium">
              <Shield size={12} />
              Admin
            </Badge>
          </div>
        </header>

        <div className="space-y-8 px-6 py-8 lg:px-8">
          <section className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Total users', value: stats.totalUsers, icon: Users },
              { label: 'Total portfolios', value: stats.totalPortfolios, icon: Sparkles },
              { label: 'Premium users', value: stats.totalPremiumUsers, icon: Check },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} padding="lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle">{label}</p>
                    <p className="mt-3 text-3xl font-semibold text-brand-foreground">{value}</p>
                  </div>
                  <div className="rounded-2xl bg-brand-background p-3 text-brand-foreground">
                    <Icon size={18} />
                  </div>
                </div>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-brand-background px-6 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle">Users</p>
                  <h2 className="text-lg font-semibold text-brand-foreground">User management</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.refresh()}>
                  <RefreshCw size={14} />
                  Refresh
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-background">
                  <thead className="bg-brand-background">
                    <tr>
                      {['User', 'Email', 'Role', 'Portfolio count', 'Actions'].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-brand-subtle"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-background bg-white">
                    {users.map((user) => {
                      const isAdmin = user.role === 'ADMIN'
                      const count = user.portfolios.length

                      return (
                        <tr key={user.id} className="transition hover:bg-brand-background">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-brand-foreground">{user.name}</p>
                              <p className="text-xs text-brand-subtle">{formatDate(user.createdAt)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-brand-muted">{user.email}</td>
                          <td className="px-6 py-4">
                            <Badge variant={isAdmin ? 'premium' : 'free'}>{user.role}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-[#0f0e0d]">{count}</td>
                          <td className="px-6 py-4">
                            <Button
                              variant={isAdmin ? 'secondary' : 'primary'}
                              size="sm"
                              disabled={isAdmin}
                              loading={busyKey === `/api/admin/users/${user.id}/role`}
                              onClick={() =>
                                mutate(
                                  `/api/admin/users/${user.id}/role`,
                                  {
                                    method: 'PATCH',
                                    body: JSON.stringify({ role: 'ADMIN' }),
                                  },
                                  `${user.name} promoted to admin`,
                                )
                              }
                            >
                              Promote to admin
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card padding="none" className="overflow-hidden">
              <div className="border-b border-brand-background px-6 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle">Subscriptions</p>
                <h2 className="text-lg font-semibold text-brand-foreground">Premium activation</h2>
              </div>
              <div className="divide-y divide-brand-background">
                {subscriptions.map((subscription) => {
                  const premium = subscription.status === 'PREMIUM'

                  return (
                    <div key={subscription.id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div>
                        <p className="font-medium text-brand-foreground">{subscription.user.name}</p>
                        <p className="text-xs text-brand-subtle">{subscription.user.email}</p>
                        <p className="mt-2 text-xs text-brand-muted">
                          {premium ? `${formatDate(subscription.startDate)} - ${formatDate(subscription.endDate)}` : 'Free plan'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={premium ? 'premium' : 'free'}>{subscription.status}</Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            loading={busyKey === `/api/admin/subscriptions/${subscription.userId}/premium`}
                            onClick={() =>
                              mutate(
                                `/api/admin/subscriptions/${subscription.userId}/premium`,
                                {
                                  method: 'PATCH',
                                  body: JSON.stringify({ action: 'activate' }),
                                },
                                `${subscription.user.name} upgraded to premium`,
                              )
                            }
                          >
                            Activate
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            loading={busyKey === `/api/admin/subscriptions/${subscription.userId}/premium`}
                            onClick={() =>
                              mutate(
                                `/api/admin/subscriptions/${subscription.userId}/premium`,
                                {
                                  method: 'PATCH',
                                  body: JSON.stringify({ action: 'deactivate' }),
                                },
                                `${subscription.user.name} downgraded to free`,
                              )
                            }
                          >
                            Deactivate
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
