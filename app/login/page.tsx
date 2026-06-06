'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { t } from '@/lib/translations'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.email || !formData.password) {
      setError(t('errors.required'))
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('errors.loginFailed'))
      }

      // Success - refresh user context and redirect
      await refreshUser()
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            src="/ship-logo.svg"
            alt="ShipApp"
            title="ShipApp logo"
            className="mx-auto h-14 w-14"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            {t('auth.loginTitle')}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              data-testid="error-message"
              className="error-message bg-nord-aurora-red/20 border border-destructive text-destructive px-4 py-3 rounded"
            >
              {error}
            </div>
          )}

          <div className="bg-muted p-6 rounded-lg shadow border border-border space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                data-testid="email-input"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-3 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"
                placeholder={t('placeholders.enterEmail')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                data-testid="password-input"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-3 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"
                placeholder={t('placeholders.enterPassword')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              data-testid="login-button"
              className="login-button w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-nord-polar-0 bg-primary hover:bg-nord-frost-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-nord-polar-3 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('auth.login')}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t('auth.dontHaveAccount')}{' '}
          <Link href="/register" className="font-medium text-primary hover:text-nord-frost-3">
            {t('auth.registerHere')}
          </Link>
        </p>
      </div>
    </div>
  )
}
