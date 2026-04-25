'use client'
import { cn } from '@/lib/utils'
import { X } from '@/lib/icons'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0f0e0d]/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl animate-fade-up',
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[#e8e4df]">
            <h2 className="text-lg font-semibold text-[#0f0e0d]" style={{ fontFamily: 'Syne, sans-serif' }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6b6760] hover:bg-[#f8f7f4] hover:text-[#0f0e0d] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
