import { Check, Copy, ListPlus, RefreshCw, WandSparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { copyToClipboard } from '../lib/clipboard'
import type { StrengthInfo } from '../types/password'
import { StrengthIndicator } from './StrengthIndicator'
import { Button } from './ui/Button'

type OutputPanelProps = {
  password: string
  strength: StrengthInfo
  poolSize: number
  canGenerate: boolean
  hasGeneratedPassword: boolean
  error: string | null
  onGenerate: () => void
  onRegenerate: () => void
  onGenerateMultiple: () => void
}

export function OutputPanel({
  password,
  strength,
  poolSize,
  canGenerate,
  hasGeneratedPassword,
  error,
  onGenerate,
  onRegenerate,
  onGenerateMultiple,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeoutId)
  }, [copied])

  async function handleCopy() {
    if (!password) {
      return
    }

    await copyToClipboard(password)
    setCopied(true)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-nordic-border bg-nordic-bg p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-nordic-text">Generated password</p>
          <Button type="button" variant="ghost" disabled={!password} onClick={handleCopy}>
            {copied ? (
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
        <div className="min-h-20 overflow-x-auto rounded-2xl border border-nordic-border bg-nordic-surface p-4 font-mono text-lg tracking-wide text-nordic-text">
          {password || (
            <span className="font-sans text-sm tracking-normal text-nordic-muted">
              Your first password will appear here automatically.
            </span>
          )}
        </div>
      </div>

      <StrengthIndicator strength={strength} poolSize={poolSize} />

      {error ? (
        <p className="rounded-2xl border border-nordic-danger bg-[rgba(184,92,92,0.1)] px-4 py-3 text-sm text-nordic-danger">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="primary" disabled={!canGenerate} onClick={onGenerate}>
          <span className="inline-flex items-center gap-2">
            <WandSparkles size={16} aria-hidden="true" />
            Generate
          </span>
        </Button>
        <Button
          type="button"
          disabled={!canGenerate || !hasGeneratedPassword}
          onClick={onRegenerate}
        >
          <span className="inline-flex items-center gap-2">
            <RefreshCw size={16} aria-hidden="true" />
            Regenerate
          </span>
        </Button>
        <Button
          type="button"
          className="sm:col-span-2"
          disabled={!canGenerate}
          onClick={onGenerateMultiple}
        >
          <span className="inline-flex items-center gap-2">
            <ListPlus size={16} aria-hidden="true" />
            Generate Multiple (10)
          </span>
        </Button>
      </div>

      {!canGenerate ? (
        <p className="text-sm text-nordic-muted">
          Generation actions are disabled until at least one character type is selected.
        </p>
      ) : !hasGeneratedPassword ? (
        <p className="text-sm text-nordic-muted">
          Regenerate becomes available after the first password exists.
        </p>
      ) : null}
    </div>
  )
}
