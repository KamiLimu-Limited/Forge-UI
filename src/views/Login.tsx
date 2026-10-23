'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ApiError } from '@/types/auth'

// =============================================================================
// Left panel — brand identity
// =============================================================================

function ForgeIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mountain peak */}
      <path
        d="M14 3L26 23H2L14 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Book / forge lines inside the mountain */}
      <line x1="8" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="19.5" x2="18" y2="19.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function BrandPanel() {
  return (
    <div
      className="relative hidden md:flex flex-col justify-between p-10 lg:p-16 overflow-hidden"
      style={{
        backgroundColor: 'var(--color-black)',
        background: [
          'radial-gradient(ellipse 70% 60% at 20% 55%, rgba(0,180,194,0.13) 0%, transparent 70%)',
          'linear-gradient(rgba(0,180,194,0.04) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(0,180,194,0.04) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: 'auto, 48px 48px, 48px 48px',
        backgroundPosition: 'center, -1px -1px, -1px -1px',
      }}
    >
      {/* Content sits above the grid */}
      <div className="relative z-raised flex flex-col gap-8">
        {/* Logo lockup */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-teal-500">
            <ForgeIcon />
            <span className="font-mono text-title font-bold tracking-tight">Forge</span>
          </div>
          <span className="font-mono text-body font-semibold tracking-[0.25em] uppercase text-text-muted pl-12">
            by KamiLimu
          </span>
        </div>

        {/* Divider + programme tag */}
        <div className="flex flex-col gap-3">
          <div className="h-px w-10 bg-teal-500" />
          <span className="font-mono text-body font-semibold tracking-[0.2em] uppercase text-text-muted">
            Mentorship Management
          </span>
        </div>

        {/* Hero headline */}
        <div className="flex flex-col gap-5 max-w-md">
          <h1 className="font-mono text-title font-bold leading-tight text-text-primary">
            Professionals are not born.{' '}
            <span className="text-teal-500">They are forged.</span>
          </h1>
          <p className="font-sans text-subheading text-text-secondary leading-relaxed">
            Forge is the operational backbone of the KamiLimu mentorship programme — tracking
            sessions, attendance, points, and growth across every cohort.
          </p>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="relative z-raised flex gap-10">
        <Stat value="101" label="sessions per cohort" />
        <Stat value="8" label="programme months" />
        <Stat value="6" label="learning tracks" />
      </div> */}
    </div>
  )
}


// =============================================================================
// Step indicator
// =============================================================================

interface StepIndicatorProps {
  currentStep: 1 | 2
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div
          className={[
            'h-0.5 transition-all duration-normal',
            currentStep >= 1 ? 'w-12 bg-teal-500' : 'w-6 bg-border',
          ].join(' ')}
        />
        <div
          className={[
            'h-0.5 transition-all duration-normal',
            currentStep >= 2 ? 'w-12 bg-teal-500' : 'w-6 bg-border',
          ].join(' ')}
        />
      </div>
      <span className="font-mono text-body font-semibold tracking-[0.2em] uppercase text-teal-500">
        Step 0{currentStep} —{' '}
        <span className="text-text-muted">{currentStep === 1 ? 'Identity' : 'Verification'}</span>
      </span>
    </div>
  )
}

// =============================================================================
// Step 1 — email
// =============================================================================

interface Step1Props {
  email: string
  onChange: (v: string) => void
  onSubmit: (e: FormEvent) => void
  error: string | null
}

function StepIdentity({ email, onChange, onSubmit, error }: Step1Props) {
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-mono text-title font-bold text-text-primary">Welcome to Forge.</h2>
        <p className="font-sans text-quote text-text-secondary leading-relaxed">
          Your account is set up by your programme admin. Enter your email address to sign in.
        </p>
      </div>

      <Input
        label="Email Address"
        type="email"
        id="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        error={error ?? undefined}
        autoComplete="email"
        autoFocus
        required
      />

      <Button type="submit" fullWidth size="lg">
        Continue
      </Button>

      <p className="font-sans text-body text-text-muted text-center">
        Forgot your password?{' '}
        <Link href="/forgot-password" className="text-teal-500 hover:text-teal-300">
          Reset it here
        </Link>
      </p>
    </form>
  )
}

// =============================================================================
// Step 2 — password
// =============================================================================

interface Step2Props {
  email: string
  password: string
  onChange: (v: string) => void
  onSubmit: (e: FormEvent) => void
  onBack: () => void
  isLoading: boolean
  error: string | null
}

function StepVerification({
  email,
  password,
  onChange,
  onSubmit,
  onBack,
  isLoading,
  error,
}: Step2Props) {
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-mono text-title font-bold text-text-primary">
          Welcome back.
        </h2>
        <p className="font-sans text-quote text-text-secondary">
          Signing in as{' '}
          <span className="text-teal-500 font-semibold">{email}</span>
        </p>
      </div>

      <Input
        label="Password"
        type="password"
        id="password"
        placeholder="············"
        value={password}
        onChange={(e) => onChange(e.target.value)}
        error={error ?? undefined}
        autoComplete="current-password"
        autoFocus
        required
      />

      <div className="flex flex-col gap-3">
        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          Sign In
        </Button>
        <Button type="button" variant="ghost" fullWidth size="lg" onClick={onBack}>
          Back
        </Button>
      </div>

      <p className="font-sans text-body text-text-muted text-center">
        Forgot your password?{' '}
        <Link href="/forgot-password" className="text-teal-500 hover:text-teal-300">
          Reset it here
        </Link>
      </p>
    </form>
  )
}

// =============================================================================
// Login page
// =============================================================================

export function Login() {
  const { login } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleEmailSubmit(e: FormEvent) {
    e.preventDefault()
    setFieldError(null)
    if (!email.trim() || !email.includes('@')) {
      setFieldError('Enter a valid email address.')
      return
    }
    setStep(2)
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    setFieldError(null)
    if (!password) {
      setFieldError('Enter your password.')
      return
    }
    setIsSubmitting(true)
    try {
      await login(email.trim(), password)
      router.replace('/dashboard')
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldError(err.body.error)
      } else {
        setFieldError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleBack() {
    setStep(1)
    setPassword('')
    setFieldError(null)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left — brand panel */}
      <div className="md:flex-1">
        <BrandPanel />
      </div>

      {/* Vertical divider */}
      <div className="hidden md:block w-px bg-border" />

      {/* Right — auth form */}
      <div
        className="flex flex-1 flex-col justify-center px-6 py-12 md:px-12 lg:px-16"
        style={{ backgroundColor: 'var(--color-black)' }}
      >
        <div className="w-full max-w-md mx-auto flex flex-col gap-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 text-teal-500 md:hidden">
            <ForgeIcon />
            <span className="font-mono text-section font-bold">Forge</span>
          </div>

          <StepIndicator currentStep={step} />

          {step === 1 ? (
            <StepIdentity
              email={email}
              onChange={(v) => {
                setEmail(v)
                setFieldError(null)
              }}
              onSubmit={handleEmailSubmit}
              error={fieldError}
            />
          ) : (
            <StepVerification
              email={email}
              password={password}
              onChange={(v) => {
                setPassword(v)
                setFieldError(null)
              }}
              onSubmit={(e) => { void handlePasswordSubmit(e) }}
              onBack={handleBack}
              isLoading={isSubmitting}
              error={fieldError}
            />
          )}
        </div>
      </div>
    </div>
  )
}
