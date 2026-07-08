import type { StrengthInfo } from '../types/password'

type StrengthIndicatorProps = {
  strength: StrengthInfo
  poolSize: number
}

const levelColors: Record<StrengthInfo['level'], string> = {
  disabled: 'bg-slate-300',
  weak: 'bg-nordic-danger',
  medium: 'bg-nordic-warning',
  strong: 'bg-nordic-success',
  'very-strong': 'bg-nordic-success',
}

export function StrengthIndicator({ strength, poolSize }: StrengthIndicatorProps) {
  const entropyText =
    strength.level === 'disabled' ? '0 bits' : `${strength.entropyBits.toFixed(1)} bits`

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-nordic-text">Strength</p>
          <p className="text-xs text-nordic-muted">Based on current settings</p>
        </div>
        <span className="rounded-full bg-nordic-bg px-3 py-1 text-sm font-medium text-nordic-text">
          {strength.label}
        </span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full bg-slate-200"
        role="meter"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(strength.percent)}
        aria-valuetext={`${strength.label}, ${entropyText}`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-200 ${levelColors[strength.level]}`}
          style={{ width: `${strength.percent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-nordic-bg p-3">
          <p className="text-xs text-nordic-muted">Entropy</p>
          <p className="font-mono text-nordic-text">{entropyText}</p>
        </div>
        <div className="rounded-2xl bg-nordic-bg p-3">
          <p className="text-xs text-nordic-muted">Pool size</p>
          <p className="font-mono text-nordic-text">{poolSize}</p>
        </div>
      </div>
    </div>
  )
}
