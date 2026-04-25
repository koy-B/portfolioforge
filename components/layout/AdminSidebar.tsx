'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/lib/site'
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
  Zap,
} from '@/lib/icons'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
]

interface AdminSidebarProps {
  name: string
  email: string
}

export function AdminSidebar({ name, email }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-brand-foreground bg-brand-foreground text-white">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-accent to-brand-accent-2">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">{APP_NAME}</p>
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-white/40">
              <Shield size={10} />
              Admin
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition',
                active ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-white/35'} />
              <span className="flex-1">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-3 border-t border-white/10 p-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-white/80">
            <Shield size={14} />
            <span className="text-sm font-semibold">Admin access</span>
          </div>
          <p className="text-sm leading-6 text-white/50">
            Manage users, roles, and manual premium subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-accent to-brand-accent-2 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{name}</p>
            <p className="truncate text-xs text-white/40">{email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl p-2 text-white/35 transition hover:bg-white/10 hover:text-white"
            aria-label="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
