import type { NextConfig } from 'next'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

// A production build bakes NEXT_PUBLIC_API_BASE_URL into the client bundle,
// so building without it would ship an app that cannot reach the API.
function assertApiBaseUrl(): void {
  if (process.env.NEXT_PUBLIC_API_BASE_URL?.trim()) return
  throw new Error(
    [
      'NEXT_PUBLIC_API_BASE_URL is not set, so the build cannot know which API to call.',
      'On Vercel: set it under Settings > Environment Variables for Production and Preview, then redeploy.',
      'Locally: add NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 to .env.local (see .env.example).',
    ].join('\n')
  )
}

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) assertApiBaseUrl()
  return {
    reactStrictMode: true,
  }
}
