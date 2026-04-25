'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { APP_NAME, whatsappPremiumLink } from '@/lib/site'
import {
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  Zap,
} from '@/lib/icons'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Portfolios', href: '/dashboard/portfolios', icon: FolderOpen },
  { label: 'Builder', href: '/builder', icon: Plus },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  name: string
  email: string
  username: string
  premium: boolean
}

export function Sidebar({ name, email, username, premium }: SidebarProps) {
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
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-brand-border bg-white/90 backdrop-blur-xl">
      <div className="flex h-16 items-center border-b border-brand-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#101010] to-brand-accent">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-foreground">{APP_NAME}</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-brand-subtle">Workspace</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition',
                active
                  ? 'bg-brand-foreground text-white shadow-lg shadow-black/10'
                  : 'text-brand-muted hover:bg-brand-background hover:text-brand-foreground',
              )}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-brand-subtle'} />
              <span className="flex-1">{label}</span>
              {active ? <ChevronRight size={14} className="text-white/60" /> : null}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-3 border-t border-brand-background p-4">
        <div className="rounded-3xl border border-brand-border bg-[linear-gradient(160deg,#0f0e0d,#221f1c)] p-4 text-white shadow-xl">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={15} className="text-brand-accent" />
            <span className="text-sm font-semibold">Go Premium</span>
          </div>
          <p className="text-sm leading-6 text-white/60">
            {premium
              ? 'Premium access is active on your account.'
              : 'Manual activation by admin with 30-day premium access.'}
          </p>
          <Link href={whatsappPremiumLink(username)} target="_blank" className="mt-4 block">
            <Button variant="accent" size="sm" className="w-full">
              Request upgrade
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-background px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-foreground to-brand-accent text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-brand-foreground">{name}</p>
            <p className="truncate text-xs text-brand-muted">{email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl p-2 text-brand-subtle transition hover:bg-white hover:text-brand-foreground"
            aria-label="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
