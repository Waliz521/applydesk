import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { daysUntil, formatDate } from '@/lib/dates'
import type { DocumentType, UserDocument } from '@/lib/types'

export function DocumentsPage() {
  const { user } = useAuth()
  const [types, setTypes] = useState<DocumentType[]>([])
  const [docs, setDocs] = useState<UserDocument[]>([])
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    const [t, d] = await Promise.all([
      supabase.from('document_types').select('*').order('sort_order'),
      supabase.from('documents').select('*').order('created_at', { ascending: false }),
    ])
    if (d.error) setError(d.error.message)
    setTypes((t.data ?? []) as DocumentType[])
    setDocs((d.data ?? []) as UserDocument[])
  }

  useEffect(() => {
    void reload()
  }, [])

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    const form = new FormData(e.currentTarget)
    const { error: insertError } = await supabase.from('documents').insert({
      user_id: user.id,
      title: String(form.get('title') || ''),
      document_type_id: String(form.get('document_type_id') || '') || null,
      issued_on: String(form.get('issued_on') || '') || null,
      expires_on: String(form.get('expires_on') || '') || null,
      notes: String(form.get('notes') || '') || null,
    })
    if (insertError) {
      setError(insertError.message)
      return
    }
    e.currentTarget.reset()
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

      <form onSubmit={(e) => void onCreate(e)} className="grid gap-3 rounded-2xl border border-line bg-white p-5">
        <label className="text-sm font-medium">
          Title
          <input name="title" required placeholder="IELTS Academic — January 2026" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </label>
        <label className="text-sm font-medium">
          Type
          <select name="document_type_id" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm">
            <option value="">Select</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
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
        <button type="submit" className="rounded-lg bg-sky px-4 py-2 text-sm font-semibold text-white">
          Add document
        </button>
      </form>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
        {docs.length === 0 ? (
          <li className="p-6 text-sm text-muted">No documents yet. Add your IELTS from January 2026 first.</li>
        ) : (
          docs.map((d) => (
            <li key={d.id} className="p-4">
              <p className="font-medium">{d.title}</p>
              <p className="text-sm text-muted">
                Issued {formatDate(d.issued_on)}
                {d.expires_on ? (
                  <>
                    {' · '}
                    <span className={expiryClass(d.expires_on)}>Expires {formatDate(d.expires_on)}</span>
                  </>
                ) : (
                  ' · No expiry'
                )}
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
