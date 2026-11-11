'use client'

import { useAuth } from '@/hooks/useAuth'
import { useConfirmFields, useGraduationPreview } from '@/hooks/useGraduation'
import { isProgramLead } from '@/lib/roles'
import { GraduationScreen } from './GraduationScreen'

export function Graduation() {
  const { user } = useAuth()
  const preview = useGraduationPreview()
  const confirm = useConfirmFields()
  return (
    <GraduationScreen
      data={preview.data}
      isLoading={preview.isLoading}
      error={preview.error}
      onRetry={preview.refetch}
      hasCohort={preview.hasCohort}
      isProgramLead={isProgramLead(user)}
      search={preview.search}
      onSearch={preview.setSearch}
      graduates={preview.graduates}
      canGraduate={preview.canGraduate}
      onRefresh={() => void preview.refresh()}
      isRefreshing={preview.isRefreshing}
      onGraduate={preview.graduate}
      isGraduating={preview.isGraduating}
      graduateError={preview.graduateError}
      onCloseCohort={preview.close}
      isClosing={preview.isClosing}
      closeError={preview.closeError}
      confirmFields={confirm.fields}
      onConfirmFieldsChange={confirm.setFields}
      onResetConfirm={confirm.reset}
    />
  )
}
