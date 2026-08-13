import { useEffect, useId, useRef, useState } from 'react'
import type { Catalogue } from '@/lib/types'

export function CatalogueSelect({
  catalogues,
  value,
  onChange,
}: {
  catalogues: Catalogue[]
  value: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = value === 'all' ? null : catalogues.find((c) => c.id === value)
  const label = selected?.name ?? 'All catalogues'

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const options = [{ id: 'all', name: 'All catalogues' }, ...catalogues.map((c) => ({ id: c.id, name: c.name }))]

  return (
    <div ref={rootRef} className="relative w-full sm:w-72">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Catalogue</p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5 text-left text-sm font-medium text-ink shadow-sm hover:border-sky/40 focus:border-sky focus:outline-none"
      >
        <span className="truncate">{label}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-72 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-lg"
        >
          {options.map((opt) => {
            const active = opt.id === value
            return (
              <li key={opt.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.id)
                    setOpen(false)
                  }}
                  className={`flex w-full px-3.5 py-2 text-left text-sm ${
                    active ? 'bg-navy font-medium text-white' : 'text-ink hover:bg-slate-50'
                  }`}
                >
                  {opt.name}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
