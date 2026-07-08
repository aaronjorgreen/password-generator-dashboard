import { useCallback, useState } from 'react'
import {
  createHistoryEntry,
  loadHistory,
  saveHistory,
  trimHistory,
} from '../lib/storage'
import type { HistoryEntry } from '../types/password'

export function usePasswordHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())

  const replaceHistory = useCallback((entries: HistoryEntry[]) => {
    const nextHistory = saveHistory(trimHistory(entries))
    setHistory(nextHistory)
    return nextHistory
  }, [])

  const addPassword = useCallback(
    (password: string) => {
      const entry = createHistoryEntry(password)
      setHistory((currentHistory) => saveHistory([entry, ...currentHistory]))
      return entry
    },
    [],
  )

  const addPasswords = useCallback(
    (passwords: string[]) => {
      const entries = passwords.map(createHistoryEntry)
      setHistory((currentHistory) => saveHistory([...entries, ...currentHistory]))
      return entries
    },
    [],
  )

  const clearHistory = useCallback(() => {
    replaceHistory([])
  }, [replaceHistory])

  return {
    history,
    addPassword,
    addPasswords,
    clearHistory,
  }
}
