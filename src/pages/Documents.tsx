import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ChoiceBar } from '@/components/ChoiceBar'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { daysUntil, formatDate } from '@/lib/dates'
import type { DocumentType, UserDocument } from '@/lib/types'

export function DocumentsPage() {
  const { user } = useAuth()
  const [types, setTypes] = useState<DocumentType[]>([])
  const [docs, setDocs] = useState<UserDocument[]>([])
  const [error, setError] = useState<string | null>(null)
  const [docType, setDocType] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  async function reload() {
    const [t, d] = await Promise.all([
      supabase.from('document_types').select('*').order('sort_order'),
      supabase.from('documents').select('*').order('created_at', { ascending: false }),
    ])
    if (t.error) setError(t.error.message)
    if (d.error) setError(d.error.message)
    setTypes((t.data ?? []) as DocumentType[])
    setDocs((d.data ?? []) as UserDocument[])
  }

  useEffect(() => {
    void reload()
  }, [])

  const typeById = useMemo(() => new Map(types.map((t) => [t.id, t])), [types])
  const visible = docs.filter((d) => typeFilter === 'all' || d.document_type_id === typeFilter)

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    const form = new FormData(e.currentTarget)
    const { error: insertError } = await supabase.from('documents').insert({
      user_id: user.id,
      title: String(form.get('title') || ''),
      document_type_id: docType || null,
      issued_on: String(form.get('issued_on') || '') || null,
      expires_on: String(form.get('expires_on') || '') || null,
      notes: String(form.get('notes') || '') || null,
    })
    if (insertError) {
      setError(insertError.message)
      return
    }
    e.currentTarget.reset()
    setDocType('')
    await reload()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Documents</h1>
        <p className="mt-1 text-sm text-muted">
          One IELTS, one transcript, reused across applications. File upload to Storage can be added next.
        </p>
      </div>

      <form
        onSubmit={(e) => void onCreate(e)}
        className="grid gap-3 rounded-xl border border-line bg-white p-5 shadow-[inset_3px_0_0_0_var(--color-gold)]"
      >
        <label className="text-sm font-medium">
          Title
          <input name="title" required placeholder="IELTS Academic — January 2026" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </label>
        <ChoiceBar
          label="Type"
          wrap
          options={types.map((t) => ({ id: t.id, label: t.label }))}
          value={docType}
          onChange={setDocType}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Issued
            <input name="issued_on" type="date" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
          </label>
          <label className="text-sm font-medium">
            Expires
            <input name="expires_on" type="date" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
          </label>
        </div>
        <label className="text-sm font-medium">
          Notes
          <input name="notes" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </label>
        <button type="submit" className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90">
          Add document
        </button>
      </form>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {types.length > 0 ? (
        <ChoiceBar
          wrap
          options={[{ id: 'all', label: 'All' }, ...types.map((t) => ({ id: t.id, label: t.label }))]}
          value={typeFilter}
          onChange={setTypeFilter}
        />
      ) : null}

      <ul className="overflow-hidden rounded-xl border border-line bg-white shadow-[inset_3px_0_0_0_var(--color-gold)]">
        {visible.length === 0 ? (
          <li className="p-6 text-sm text-muted">
            {docs.length === 0
              ? 'No documents yet. Add your IELTS from January 2026 first.'
              : 'No documents of this type.'}
          </li>
        ) : (
          visible.map((d) => (
            <li
              key={d.id}
              className="grid grid-cols-1 gap-1 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_8.5rem_8.5rem] sm:items-center"
            >
              <p className="font-medium">{d.title}</p>
              <p className="text-sm text-navy/70">{typeById.get(d.document_type_id ?? '')?.label ?? '—'}</p>
              <p className="text-sm text-muted">Issued {formatDate(d.issued_on)}</p>
              <p className={`text-sm ${d.expires_on ? expiryClass(d.expires_on) : 'text-muted'}`}>
                {d.expires_on ? `Expires ${formatDate(d.expires_on)}` : 'No expiry'}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

function expiryClass(value: string): string {
  const due = daysUntil(value)
  if (due === null) return ''
  if (due < 0) return 'font-semibold text-red-700'
  if (due <= 90) return 'font-semibold text-amber-700'
  return 'text-muted'
}
