'use client'
import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

function Card({ className, hover = false, padding = 'md', children, ...props }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  return (
    <div
      className={cn(
        'bg-white rounded-brand border border-brand-border',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-md cursor-pointer',
        paddings[padding],
        className
      )}
      style={{ boxShadow: 'var(--shadow-brand-sm)' }}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props}>{children}</div>
}

function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-[#0f0e0d] font-[Syne,sans-serif]', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-[#6b6760]', className)} {...props}>{children}</div>
}

export { Card, CardHeader, CardTitle, CardContent }
