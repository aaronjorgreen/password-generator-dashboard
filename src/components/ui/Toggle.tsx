type ToggleProps = {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

export function Toggle({ id, label, checked, onChange, description }: ToggleProps) {
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-nordic-border bg-white/70 p-4">
      <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-medium text-nordic-text">
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="text-xs leading-5 text-nordic-muted">
            {description}
          </p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descriptionId}
        onClick={() => onChange(!checked)}
        className={`relative h-7 min-h-7 w-12 shrink-0 rounded-full border transition-colors ${
          checked
            ? 'border-nordic-accent bg-nordic-accent'
            : 'border-nordic-border bg-slate-200'
        }`}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}
