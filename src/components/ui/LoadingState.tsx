import { Spinner } from './Spinner'

interface LoadingStateProps {
  // Announced to screen readers, for example "Loading sessions"
  label?: string
}

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" label={label} />
    </div>
  )
}
