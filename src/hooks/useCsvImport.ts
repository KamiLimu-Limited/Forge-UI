'use client'

import { useCallback, useState } from 'react'
import { api } from '@/lib/api'
import { buildUploadFile, parseImport, type ParsedImport } from '@/lib/csvImport'
import { errorMessage } from '@/lib/errors'
import type { BulkInviteResponse } from '@/types/auth'

interface UseCsvImportReturn {
  fileName: string | null
  parsed: ParsedImport | null
  readyCount: number
  problemCount: number
  readFile: (file: File) => Promise<void>
  reset: () => void
  send: () => Promise<BulkInviteResponse | null>
  isSending: boolean
  sendError: string | null
  result: BulkInviteResponse | null
}

// Reads a CSV in the browser, checks every row, then sends the ready rows to
// POST /auth/bulk-invite/csv with the cohort
export function useCsvImport(cohortId: string | null): UseCsvImportReturn {
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsed, setParsed] = useState<ParsedImport | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [result, setResult] = useState<BulkInviteResponse | null>(null)

  const ready = parsed?.rows.filter((r) => r.problems.length === 0) ?? []

  const readFile = useCallback(async (file: File) => {
    setResult(null)
    setSendError(null)
    setFileName(file.name)
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setParsed({ rows: [], ignoredColumns: [], fileError: 'Choose a .csv file.' })
      return
    }
    setParsed(parseImport(await file.text()))
  }, [])

  const reset = useCallback(() => {
    setFileName(null)
    setParsed(null)
    setResult(null)
    setSendError(null)
  }, [])

  const send = async () => {
    if (ready.length === 0 || !fileName) return null
    setIsSending(true)
    setSendError(null)
    try {
      const response = await api.auth.bulkInviteCsv(buildUploadFile(ready, fileName), cohortId)
      setResult(response)
      return response
    } catch (err: unknown) {
      setSendError(errorMessage(err, "The invitations weren't sent. Try again."))
      return null
    } finally {
      setIsSending(false)
    }
  }

  return {
    fileName,
    parsed,
    readyCount: ready.length,
    problemCount: (parsed?.rows.length ?? 0) - ready.length,
    readFile,
    reset,
    send,
    isSending,
    sendError,
    result,
  }
}
