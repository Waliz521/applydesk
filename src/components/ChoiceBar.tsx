type Choice = { id: string; label: string }

export function ChoiceBar({
  label,
  options,
  value,
  onChange,
  wrap,
}: {
  label?: string
  options: readonly Choice[]
  value: string
  onChange: (id: string) => void
  /** Longer labels wrap onto equal rows. Short sets stay on one row. */
  wrap?: boolean
}) {
  if (options.length === 0) return null
  return (
    <div className="space-y-1.5">
      {label ? <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/70">{label}</p> : null}
      <div className={`rounded-xl border border-line bg-white p-1.5 shadow-[inset_3px_0_0_0_var(--color-gold)] ${wrap ? 'flex flex-wrap justify-center gap-1.5' : `grid gap-1.5 ${columnClass(options.length)}`}`}>
        {options.map((opt) => {
          const active = value === opt.id
          const cols = perRow(options.length)
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              aria-pressed={active}
              style={wrap ? { width: `calc((100% - ${(cols - 1) * 6}px) / ${cols})` } : undefined}
              className={`flex min-h-10 items-center justify-center rounded-lg px-2 py-2 text-center text-xs leading-snug ${
                active ? 'bg-navy font-medium text-white' : 'text-navy/80 hover:bg-navy/5'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function columnClass(count: number): string {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-2'
  if (count === 3) return 'grid-cols-3'
  if (count === 4) return 'grid-cols-2 sm:grid-cols-4'
  return 'grid-cols-5'
}

function perRow(count: number): number {
  if (count <= 5) return count
  let best = 3
  let bestEmpty = count
  for (const cols of [5, 4, 3]) {
    const empty = (cols - (count % cols)) % cols
    if (empty < bestEmpty) {
      best = cols
      bestEmpty = empty
    }
  }
  return best
}
