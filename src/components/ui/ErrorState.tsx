import { Button } from './Button'
import { Icon } from './Icon'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-danger-bg text-danger-text">
        <Icon name="alert" className="size-6" />
      </span>
      <p role="alert" className="max-w-md font-sans text-body text-danger-text">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
