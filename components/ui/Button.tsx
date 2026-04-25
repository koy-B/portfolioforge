'use client'
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from '@/lib/icons'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
    const variants = {
      primary: 'bg-brand-foreground text-white hover:opacity-90 active:scale-[0.98]',
      secondary: 'bg-white text-brand-foreground border border-brand-border hover:bg-brand-background active:scale-[0.98]',
      ghost: 'text-brand-muted hover:bg-brand-background hover:text-brand-foreground active:scale-[0.98]',
      accent: 'bg-gradient-to-r from-brand-accent to-brand-accent-2 text-white hover:opacity-90 active:scale-[0.98] shadow-brand-md',
      danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-[0.98]',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
