'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Button } from './Button'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import type { IconName } from './Icon'
import { Icon } from './Icon'
import { LoadingState } from './LoadingState'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  // Makes the column sortable by this value
  sortValue?: (row: T) => string | number
  num?: boolean
  // Right-aligns a non-numeric column, such as row actions
  alignEnd?: boolean
  className?: string
}

export interface DataTablePagination {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  // Names the table for screen readers
  label: string
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  empty: { title: string; description?: string; icon?: IconName; action?: ReactNode }
  pagination?: DataTablePagination
  highlightRow?: (row: T) => boolean
  initialSort?: { key: string; direction: SortDirection }
}

type SortDirection = 'asc' | 'desc'

// "1 to 20 of 134"
export function rangeLabel(page: number, pageSize: number, total: number): string {
  if (total === 0) return '0 of 0'
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return `${from} to ${to} of ${total}`
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  label,
  isLoading = false,
  error,
  onRetry,
  empty,
  pagination,
  highlightRow,
  initialSort,
}: DataTableProps<T>) {
  const [sort, setSort] = useState(initialSort ?? null)

  const sortedRows = useMemo(() => {
    const column = sort && columns.find((c) => c.key === sort.key)
    if (!sort || !column?.sortValue) return rows
    const value = column.sortValue
    const factor = sort.direction === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = value(a)
      const bv = value(b)
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor
      return String(av).localeCompare(String(bv)) * factor
    })
  }, [rows, columns, sort])

  if (isLoading) return <LoadingState label={`Loading ${label.toLowerCase()}`} />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (rows.length === 0) return <EmptyState {...empty} />

  const toggleSort = (key: string) => {
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    )
  }

  const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize)) : 1

  return (
    <>
      <Table label={label}>
        <TableHead>
          <TableRow>
            {columns.map((column) => {
              const isSorted = sort?.key === column.key
              const ariaSort = isSorted
                ? sort.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : undefined
              return (
                <TableHeaderCell
                  key={column.key}
                  num={column.num}
                  aria-sort={column.sortValue ? (ariaSort ?? 'none') : undefined}
                  className={cx(column.alignEnd && 'text-right', column.className)}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className={cx(
                        "relative inline-flex items-center gap-1 font-semibold hover:text-text-primary before:absolute before:-inset-x-2 before:-inset-y-3 before:content-['']",
                        isSorted && 'text-text-primary'
                      )}
                    >
                      {column.header}
                      <Icon
                        name={isSorted && sort.direction === 'desc' ? 'chevron-down' : 'chevron-up'}
                        className={cx('size-3.5', !isSorted && 'opacity-40')}
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHeaderCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow key={rowKey(row)} highlight={highlightRow?.(row)}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  num={column.num}
                  className={cx(column.alignEnd && 'text-right', column.className)}
                >
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <p className="font-sans text-small text-text-secondary">
            {rangeLabel(pagination.page, pagination.pageSize, pagination.total)}
          </p>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
