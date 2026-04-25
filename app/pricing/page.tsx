'use client'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckCircle, Zap, ArrowRight, Sparkles } from '@/lib/icons'
import Link from 'next/link'
import { whatsappPremiumLink } from '@/lib/site'

const features = [
  'Unlimited portfolios',
  'All premium templates',
  'Remove PortfolioForge branding',
  'Advanced project showcasing',
  'Priority manual support',
  'Lifetime access (beta)',
]

const faqs = [
  { q: 'How do I upgrade?', a: 'Click the "Request Premium" button. It will open WhatsApp with a pre-filled message for our team. We manually activate your account within 24 hours.' },
  { q: 'Why WhatsApp?', a: "We believe in direct communication. This allows us to manually verify each premium user and provide personalized setup assistance." },
  { q: 'How long does it take?', a: "Once you send the message and complete the manual process, our admins activate your PREMIUM status, which is visible in your dashboard." },
  { q: 'Is it a subscription?', a: 'Currently, we offer manual activation for a 30-day period. Our admins can extend this manually upon request.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#e8673a] mb-3">Premium Access</p>
          <h1 className="text-5xl font-bold text-[#0f0e0d] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Elevate your portfolio
          </h1>
          <p className="text-[#6b6760] max-w-lg mx-auto mb-8 text-lg">
            Unlock the full power of PortfolioForge with manual premium activation. No complex subscriptions, just direct access.
          </p>
        </div>

        {/* Premium Card */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card padding="none" className="overflow-hidden border-[#e8e4df] shadow-2xl shadow-black/5 bg-white">
            <div className="grid md:grid-cols-[1fr_360px]">
              <div className="p-10 md:p-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e8673a] to-[#7c4fe0] flex items-center justify-center">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <span className="text-[#0f0e0d] font-bold text-2xl" style={{ fontFamily: 'Syne, sans-serif' }}>Premium Plan</span>
                </div>
                
                <h3 className="text-xl font-semibold text-[#0f0e0d] mb-6">Everything you need to stand out</h3>
                
                <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-8 mb-8">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-[#6b6760] font-medium">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href={whatsappPremiumLink('Guest')} target="_blank" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full">
                      Request Premium via WhatsApp
                      <Zap size={16} />
                    </Button>
                  </Link>
                  <p className="text-xs text-[#a8a49f] font-medium italic">
                    * Activation usually takes less than 24 hours
                  </p>
                </div>
              </div>

              <div className="bg-[#0f0e0d] p-10 md:p-12 text-white flex flex-col justify-center">
                <p className="text-white/45 uppercase tracking-[0.2em] text-xs mb-4">Manual Activation</p>
                <div className="mb-8">
                  <p className="text-5xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>$29</p>
                  <p className="text-white/60">One-time payment for 30 days of premium access.</p>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Zap size={14} className="text-[#e8673a]" />
                    </div>
                    <p className="text-sm text-white/80">Direct admin contact</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Zap size={14} className="text-[#e8673a]" />
                    </div>
                    <p className="text-sm text-white/80">No credit card required</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Workflow */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f0e0d]" style={{ fontFamily: 'Syne, sans-serif' }}>How it works</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { t: '1. Request', d: 'Click the button and send us your username on WhatsApp.' },
              { t: '2. Verify', d: 'Chat with our team to complete the manual process.' },
              { t: '3. Activate', d: 'Admin activates your account. Boom! You are premium.' },
            ].map(step => (
              <div key={step.t} className="bg-white rounded-3xl border border-[#e8e4df] p-6 text-center">
                <p className="font-bold text-[#0f0e0d] mb-2">{step.t}</p>
                <p className="text-sm text-[#6b6760] leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0f0e0d] text-center mb-10" style={{ fontFamily: 'Syne, sans-serif' }}>
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map(({ q, a }) => (
              <Card key={q} padding="md" className="border-[#e8e4df] bg-white">
                <p className="font-bold text-[#0f0e0d] mb-2 text-sm">{q}</p>
                <p className="text-sm text-[#6b6760] leading-relaxed">{a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
