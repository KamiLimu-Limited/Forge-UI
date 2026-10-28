// =============================================================================
// Runtime configuration
// The API address comes only from NEXT_PUBLIC_API_BASE_URL. Next.js inlines it
// at build time, so it must be read as process.env.NEXT_PUBLIC_API_BASE_URL in
// full (no destructuring or dynamic keys).
// =============================================================================

const DEV_FALLBACK_API_BASE_URL = 'http://localhost:8000'

function resolveApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()
  if (value) return value.replace(/\/+$/, '')

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `NEXT_PUBLIC_API_BASE_URL is not set. Using ${DEV_FALLBACK_API_BASE_URL} for development. Add it to .env.local to silence this warning.`
    )
    return DEV_FALLBACK_API_BASE_URL
  }

  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL is not set. Set it in .env.local, or in Vercel under Settings > Environment Variables, then rebuild.'
  )
}

export const API_BASE_URL = resolveApiBaseUrl()
