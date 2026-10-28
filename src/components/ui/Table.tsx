import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'

interface TableProps {
  children: ReactNode
  // Names the table for screen readers when there is no visible caption
  label?: string
}

// Scrolls horizontally on narrow screens instead of squashing columns
export function Table({ children, label }: TableProps) {
  return (
    // relative keeps absolutely positioned children (such as sr-only labels) inside the scroll box
    <div className="relative w-full overflow-x-auto">
      <table aria-label={label} className="w-full border-collapse text-left">
        {children}
      </table>
    </div>
  )
}

interface SectionProps {
  children: ReactNode
}

export function TableHead({ children }: SectionProps) {
  return <thead>{children}</thead>
}

export function TableBody({ children }: SectionProps) {
  return <tbody>{children}</tbody>
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  highlight?: boolean
}

export function TableRow({ highlight = false, className, ...rest }: TableRowProps) {
  return <tr className={cx(highlight && 'bg-accent-bg', className)} {...rest} />
}

interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  num?: boolean
}

export function TableHeaderCell({ num = false, className, ...rest }: TableHeaderCellProps) {
  return (
    <th
      scope="col"
      className={cx(
        'whitespace-nowrap border-b border-border p-3 font-sans text-caption font-semibold text-text-secondary first:pl-4 last:pr-4 md:first:pl-6 md:last:pr-6',
        num && 'text-right',
        className
      )}
      {...rest}
    />
  )
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  // Numbers: JetBrains Mono, right aligned
  num?: boolean
}

export function TableCell({ num = false, className, ...rest }: TableCellProps) {
  return (
    <td
      className={cx(
        'border-b border-border p-3 text-small text-text-primary first:pl-4 last:pr-4 md:first:pl-6 md:last:pr-6',
        num ? 'text-right font-mono tabular-nums' : 'font-sans',
        className
      )}
      {...rest}
    />
  )
}
