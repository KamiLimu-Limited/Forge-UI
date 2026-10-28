'use client'

// =============================================================================
// useToast: short confirmation and error messages after a write.
// <ToastProvider> is mounted in src/app/providers.tsx.
// =============================================================================

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { ToastViewport, type ToastItem, type ToastVariant } from '@/components/ui/Toast'

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS = 5000

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message, variant }])
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS)
    },
    [dismiss]
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return createElement(
    ToastContext.Provider,
    { value },
    children,
    createElement(ToastViewport, { toasts, onDismiss: dismiss })
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
