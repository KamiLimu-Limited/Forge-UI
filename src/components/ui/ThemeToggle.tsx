'use client'

import { useTheme } from '@/hooks/useTheme'
import { cx } from '@/lib/cx'
import type { ThemePreference } from '@/lib/theme'
import { Icon, type IconName } from './Icon'

const OPTIONS: { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: 'light', label: 'Light theme', icon: 'sun' },
  { value: 'dark', label: 'Dark theme', icon: 'moon' },
  { value: 'system', label: 'Match device theme', icon: 'monitor' },
]

interface ThemeToggleProps {
  className?: string
}

// Light, dark or device theme. Three 44px icon buttons in one bordered group.
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cx(
        'inline-flex gap-1 rounded-control border border-border bg-surface p-0.5',
        className
      )}
    >
      {OPTIONS.map((option) => {
        const isOn = theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isOn}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={cx(
              'flex size-control items-center justify-center rounded-md transition-colors duration-fast',
              isOn
                ? 'bg-accent-bg text-accent-text'
                : 'text-text-secondary hover:bg-background hover:text-text-primary'
            )}
          >
            <Icon name={option.icon} className="size-5" />
          </button>
        )
      })}
    </div>
  )
}
