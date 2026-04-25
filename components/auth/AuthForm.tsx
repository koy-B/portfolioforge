'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from '@/lib/icons'

type Mode = 'login' | 'register'

interface AuthFormProps {
  mode: Mode
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setErrors({})

    const payload =
      mode === 'register'
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('The server returned an unexpected response. Please try again or check the logs.')
      }

      let data
      try {
        data = await response.json()
      } catch {
        throw new Error('Failed to parse server response.')
      }

      if (!response.ok) {
        const fieldErrors = data?.details?.fieldErrors ?? {}
        const flattened: Record<string, string> = {}
        for (const key of Object.keys(fieldErrors)) {
          const firstError = fieldErrors[key]?.[0]
          if (firstError) flattened[key] = firstError
        }
        setErrors(flattened)
        throw new Error(data?.error ?? 'Something went wrong')
      }

      toast(mode === 'register' ? 'Account created successfully.' : 'Welcome back.', 'success')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message, 'error')
      } else {
        toast('Unable to complete the request.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {mode === 'register' ? (
        <Input
          label="Full name"
          icon={User}
          placeholder="Jane Doe"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          error={errors.name}
          autoComplete="name"
        />
      ) : null}
      <Input
        label="Email"
        icon={Mail}
        placeholder="you@example.com"
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        error={errors.email}
        autoComplete="email"
        type="email"
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-foreground">Password</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle">
            <Lock size={16} />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'register' ? 'Minimum 8 characters' : '••••••••'}
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-xl border border-brand-border bg-white py-2.5 pl-10 pr-10 text-sm text-brand-foreground placeholder:text-brand-subtle transition focus:border-brand-foreground focus:ring-2 focus:ring-brand-foreground/10"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle transition hover:text-brand-foreground"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password ? <p className="text-xs text-red-500 mt-1">{errors.password}</p> : null}
      </div>

      <Button type="submit" size="lg" loading={loading} variant="accent" className="w-full group h-12">
        {mode === 'register' ? 'Create account' : 'Sign in'}
        {!loading ? <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /> : null}
      </Button>
    </form>
  )
}
