'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Button } from './Button'
import { Modal } from './Modal'
import { Textarea } from './Textarea'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  confirmLabel: string
  cancelLabel?: string
  variant?: 'primary' | 'danger'
  // When set, a reason field is shown. `required` blocks confirming until it has text.
  reason?: {
    label: string
    placeholder?: string
    hint?: string
    required?: boolean
  }
  isLoading?: boolean
  // An error from the API, shown above the buttons
  error?: string | null
  onConfirm: (reason: string) => void
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'primary',
  reason,
  isLoading = false,
  error,
  onConfirm,
}: ConfirmDialogProps) {
  const [text, setText] = useState('')
  const [showMissing, setShowMissing] = useState(false)

  // Start each opening with an empty reason
  useEffect(() => {
    if (isOpen) {
      setText('')
      setShowMissing(false)
    }
  }, [isOpen])

  const isMissing = Boolean(reason?.required) && text.trim() === ''

  const confirm = () => {
    if (isMissing) {
      setShowMissing(true)
      return
    }
    onConfirm(text.trim())
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => undefined : onClose}
      title={title}
      width="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={confirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {children && (
          <div className="flex flex-col gap-3 font-sans text-body text-text-secondary">
            {children}
          </div>
        )}
        {reason && (
          <Textarea
            label={reason.label}
            placeholder={reason.placeholder}
            hint={reason.hint}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setShowMissing(false)
            }}
            error={showMissing ? 'Add a reason before you continue.' : undefined}
            required={reason.required}
          />
        )}
        {error && (
          <p role="alert" className="font-sans text-small text-danger-text">
            {error}
          </p>
        )}
      </div>
    </Modal>
  )
}
