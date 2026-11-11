'use client'

import type { FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Notice } from '@/components/ui/Notice'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Textarea } from '@/components/ui/Textarea'
import type { ObjectiveType } from '@/types/objective'

interface AddObjectiveDialogProps {
  isOpen: boolean
  onClose: () => void
  type: ObjectiveType
  onTypeChange: (type: ObjectiveType) => void
  text: string
  onTextChange: (text: string) => void
  textError?: string | null
  onSave: () => void
  isSaving?: boolean
  saveError?: string | null
}

const TYPES: { value: ObjectiveType; label: string }[] = [
  { value: 'human', label: 'Human' },
  { value: 'technical', label: 'Technical' },
]

const FORM_ID = 'add-objective'

export function AddObjectiveDialog({
  isOpen,
  onClose,
  type,
  onTypeChange,
  text,
  onTextChange,
  textError = null,
  onSave,
  isSaving = false,
  saveError = null,
}: AddObjectiveDialogProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSave()
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add an objective"
      width="md"
      footer={
        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={isSaving}>
            Add objective
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {saveError && <Notice variant="danger">{saveError}</Notice>}
        <div className="flex flex-col gap-2">
          <span className="font-sans text-small font-semibold text-text-primary">Type</span>
          <SegmentedControl<ObjectiveType>
            label="Objective type"
            options={TYPES}
            value={type}
            onChange={onTypeChange}
          />
        </div>
        <Textarea
          label="Objective"
          placeholder="For example, present confidently to a group"
          maxLength={2000}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          error={textError ?? undefined}
        />
      </form>
    </Modal>
  )
}
