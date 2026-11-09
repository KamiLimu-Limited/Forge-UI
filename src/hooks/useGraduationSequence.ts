'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadSequence, sequenceSteps } from '@/lib/graduation'
import type { SequenceStep, SequenceView } from '@/types/graduation'
import { useApiQuery } from './useApiQuery'
import { useReducedMotion } from './useReducedMotion'

// How long each part stays up while playing. The closing stays until someone acts.
const STEP_MS: Record<SequenceStep['kind'], number | null> = {
  opening: 7000,
  numbers: 9000,
  reveal: 4500,
  mentors: 11000,
  closing: null,
}

export interface UseGraduationSequenceReturn {
  data: SequenceView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  step: SequenceStep | null
  index: number
  count: number
  isPlaying: boolean
  reducedMotion: boolean
  isFullscreen: boolean
  next: () => void
  previous: () => void
  togglePlay: () => void
  replay: () => void
  toggleFullscreen: () => void
}

// Plays the five parts in order, advancing on its own, with keyboard control: arrows to
// move, space to pause, F for full screen
export function useGraduationSequence(cohortId: string): UseGraduationSequenceReturn {
  const query = useApiQuery(() => loadSequence(cohortId), [cohortId], {
    fallbackError: "We couldn't load the graduation sequence. Try again.",
  })
  const reducedMotion = useReducedMotion()
  const steps = useMemo(() => (query.data ? sequenceSteps(query.data) : []), [query.data])
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const last = steps.length - 1
  const step = steps[index] ?? null

  const next = useCallback(() => setIndex((current) => Math.min(last, current + 1)), [last])
  const previous = useCallback(() => setIndex((current) => Math.max(0, current - 1)), [])
  const togglePlay = useCallback(() => setIsPlaying((playing) => !playing), [])
  const replay = useCallback(() => {
    setIndex(0)
    setIsPlaying(true)
  }, [])
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen().catch(() => undefined)
  }, [])

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    if (!isPlaying || !step || index >= last) return
    const wait = STEP_MS[step.kind]
    if (wait === null) return
    const timer = window.setTimeout(next, wait)
    return () => window.clearTimeout(timer)
  }, [isPlaying, step, index, last, next])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') next()
      else if (event.key === 'ArrowLeft') previous()
      else if (event.key === ' ') {
        event.preventDefault()
        togglePlay()
      } else if (event.key.toLowerCase() === 'f') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, previous, togglePlay, toggleFullscreen])

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    step,
    index,
    count: steps.length,
    isPlaying,
    reducedMotion,
    isFullscreen,
    next,
    previous,
    togglePlay,
    replay,
    toggleFullscreen,
  }
}
