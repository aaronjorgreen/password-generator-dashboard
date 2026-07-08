type SliderProps = {
  id: string
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  description?: string
}

export function Slider({
  id,
  label,
  value,
  min,
  max,
  onChange,
  description,
}: SliderProps) {
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <div className="rounded-2xl border border-nordic-border bg-white/70 p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
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
        <span className="rounded-full bg-nordic-bg px-3 py-1 font-mono text-sm text-nordic-text">
          {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        aria-describedby={descriptionId}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 min-h-11 w-full cursor-pointer accent-nordic-accent"
      />
      <div className="mt-1 flex justify-between text-xs text-nordic-muted">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
