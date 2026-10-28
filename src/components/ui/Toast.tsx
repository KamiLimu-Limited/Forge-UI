'use client'

import { cx } from '@/lib/cx'
import { Icon } from './Icon'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

const variantClasses: Record<ToastVariant, string> = {
  success: 'border-success bg-success-bg text-success-text',
  error: 'border-auburn bg-danger-bg text-danger-text',
  info: 'border-info bg-info-bg text-info-text',
}

const variantIcons: Record<ToastVariant, 'check' | 'alert'> = {
  success: 'check',
  error: 'alert',
  info: 'alert',
}

interface ToastProps {
  toast: ToastItem
  onDismiss: (id: number) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={cx(
        'pointer-events-auto flex w-full items-center gap-3 rounded-control border py-1 pl-4 pr-1 shadow-card',
        variantClasses[toast.variant]
      )}
    >
      <Icon name={variantIcons[toast.variant]} className="size-5" />
      <p className="flex-1 py-2 font-sans text-small font-semibold">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="flex size-control shrink-0 items-center justify-center rounded-md hover:bg-surface"
      >
        <Icon name="close" className="size-4" />
      </button>
    </div>
  )
}

interface ToastViewportProps {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}

// Bottom of the screen on phones, bottom right from md up
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-toast flex flex-col gap-2 p-4 md:left-auto md:w-full md:max-w-md"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
