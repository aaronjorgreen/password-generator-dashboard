import type { HistoryEntry } from '../types/password'

const HISTORY_KEY = 'password-generator-history'
const HISTORY_LIMIT = 10

let memoryHistory: HistoryEntry[] = []

function canUseLocalStorage(): boolean {
  try {
    const testKey = `${HISTORY_KEY}-test`
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.password === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

export function trimHistory(entries: HistoryEntry[]): HistoryEntry[] {
  return entries.slice(0, HISTORY_LIMIT)
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined' || !canUseLocalStorage()) {
    return memoryHistory
  }

  try {
    const rawHistory = window.localStorage.getItem(HISTORY_KEY)
    if (!rawHistory) {
      return []
    }

    const parsed: unknown = JSON.parse(rawHistory)
    if (!Array.isArray(parsed)) {
      return []
    }

    return trimHistory(parsed.filter(isHistoryEntry))
  } catch {
    return []
  }
}

export function saveHistory(entries: HistoryEntry[]): HistoryEntry[] {
  const nextHistory = trimHistory(entries)
  memoryHistory = nextHistory

  if (typeof window === 'undefined' || !canUseLocalStorage()) {
    return nextHistory
  }

  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
  } catch {
    // Keep the in-memory history so the UI still works when storage is blocked.
  }

  return nextHistory
}

export function createHistoryEntry(password: string): HistoryEntry {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${password}`,
    password,
    createdAt: new Date().toISOString(),
  }
}
