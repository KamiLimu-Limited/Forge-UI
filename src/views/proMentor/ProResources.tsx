'use client'

import { useProResources } from '@/hooks/useProMentor'
import { ProResourcesScreen } from './ProResourcesScreen'

export function ProResources() {
  const resources = useProResources()
  return (
    <ProResourcesScreen
      data={resources.data}
      isLoading={resources.isLoading}
      error={resources.error}
      onRetry={resources.refetch}
      linkFor={resources.linkFor}
      onLinkChange={resources.setLink}
      onSave={resources.save}
      savingId={resources.savingId}
      fieldErrors={resources.fieldErrors}
    />
  )
}
