'use client'
import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef, type ComponentType } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ComponentType<{ size?: number; className?: string }>
  iconRight?: ComponentType<{ size?: number; className?: string }>
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, iconRight: IconRight, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-brand-foreground">{label}</label>
        )}
        <div className="relative">
          {Icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle pointer-events-none">
              <Icon size={16} />
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-foreground placeholder:text-brand-subtle',
              'transition-all duration-200 focus:border-brand-foreground focus:ring-2 focus:ring-brand-foreground/10',
              error && 'border-red-400 focus:border-red-400 focus:ring-red-400/10',
              Icon && 'pl-10',
              IconRight && 'pr-10',
              className
            )}
            {...props}
          />
          {IconRight && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle pointer-events-none">
              <IconRight size={16} />
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export { Input }
