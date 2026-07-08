import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { copyToClipboard } from '../lib/clipboard'
import type { HistoryEntry } from '../types/password'
import { Button } from './ui/Button'

type PasswordHistoryProps = {
  history: HistoryEntry[]
}

function getMaskedPreview(password: string): string {
  if (password.length <= 8) {
    return '*'.repeat(password.length)
  }

  return `${password.slice(0, 4)}****${password.slice(-2)}`
}

function getRelativeTime(value: string): string {
  const timestamp = new Date(value).getTime()
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000))

  if (diffSeconds < 60) {
    return 'just now'
  }

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function PasswordHistory({ history }: PasswordHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!copiedId) {
      return
    }

    const timeoutId = window.setTimeout(() => setCopiedId(null), 2000)
    return () => window.clearTimeout(timeoutId)
  }, [copiedId])

  async function handleCopy(entry: HistoryEntry) {
    await copyToClipboard(entry.password)
    setCopiedId(entry.id)
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-nordic-border bg-nordic-bg p-5 text-sm text-nordic-muted">
        Generated passwords will appear here, newest first. Your last 10 are
        stored locally in this browser.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => (
        <div
          key={entry.id}
          className="group flex flex-col gap-3 rounded-2xl border border-nordic-border bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <p className="font-mono text-sm text-nordic-text">
              <span className="group-hover:hidden group-focus-within:hidden">
                {getMaskedPreview(entry.password)}
              </span>
              <span className="hidden break-all group-hover:inline group-focus-within:inline">
                {entry.password}
              </span>
            </p>
            <p className="text-xs text-nordic-muted">{getRelativeTime(entry.createdAt)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            aria-label="Copy history password"
            onClick={() => handleCopy(entry)}
          >
            {copiedId === entry.id ? (
              <span className="inline-flex items-center gap-2">
                <Check size={16} aria-hidden="true" />
                Copied
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Copy size={16} aria-hidden="true" />
                Copy
              </span>
            )}
          </Button>
        </div>
      ))}
    </div>
  )
}
