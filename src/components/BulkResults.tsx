import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { copyToClipboard } from '../lib/clipboard'
import { Button } from './ui/Button'

type BulkResultsProps = {
  passwords: string[]
}

export function BulkResults({ passwords }: BulkResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (copiedIndex === null) {
      return
    }

    const timeoutId = window.setTimeout(() => setCopiedIndex(null), 2000)
    return () => window.clearTimeout(timeoutId)
  }, [copiedIndex])

  async function handleCopy(password: string, index: number) {
    await copyToClipboard(password)
    setCopiedIndex(index)
  }

  return (
    <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
      {passwords.map((password, index) => (
        <div
          key={`${password}-${index}`}
          className="flex flex-col gap-3 rounded-2xl border border-nordic-border bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="min-w-0 break-all font-mono text-sm text-nordic-text">
            {password}
          </p>
          <Button
            type="button"
            variant="ghost"
            aria-label={`Copy bulk password ${index + 1}`}
            onClick={() => handleCopy(password, index)}
          >
            {copiedIndex === index ? (
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
