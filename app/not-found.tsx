import Link from 'next/link'
import { Zap, ArrowRight } from '@/lib/icons'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e8673a] to-[#7c4fe0] flex items-center justify-center mb-8 shadow-lg">
        <Zap size={28} className="text-white" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-[#e8673a] mb-3">404 Not Found</p>
      <h1 className="text-5xl font-bold text-[#0f0e0d] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
        Page not found
      </h1>
      <p className="text-[#6b6760] max-w-sm mb-10">
        The page you&apos;re looking for doesn&apos;t exist, or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#0f0e0d] text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-[#2a2926] transition-colors group"
        >
          Back to home
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-white border border-[#e8e4df] text-[#0f0e0d] rounded-xl px-6 py-3 text-sm font-medium hover:bg-[#f8f7f4] transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
