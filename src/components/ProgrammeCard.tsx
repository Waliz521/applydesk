import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DateStatusBadge, FundingBadge, OpenBadge, PriorityBadge } from '@/components/Badges'
import { countriesInvolved } from '@/lib/countries'
import { fundingDetail, fundingScheme } from '@/lib/funding'
import { cycleState, daysUntil, deadlineUrgency, formatDate, urgencyClass } from '@/lib/dates'
import type { Programme, ProgrammeCycle } from '@/lib/types'

function latestCycle(programme: Programme): ProgrammeCycle | undefined {
  return programme.cycles?.[0]
}

function openDateLabel(cycle: ProgrammeCycle | undefined): string {
  if (cycle?.application_opens_on) return formatDate(cycle.application_opens_on)
  const note = cycle?.extra_dates?.opens_text?.trim()
  if (note) return note
  if (cycle?.scholarship_deadline) return 'Not published — apply until the deadline'
  return '—'
}

export function ProgrammeCard({
  programme,
  cycle,
  catalogueName,
  openState,
  onTrack,
  tracking,
  tracked,
}: {
  programme: Programme
  cycle?: ProgrammeCycle | null
  catalogueName?: string
  openState?: string
  onTrack?: () => void
  tracking?: boolean
  tracked?: boolean
}) {
  const [open, setOpen] = useState(false)
  const cy = cycle ?? latestCycle(programme)
  const extra = programme.extra
  const state = openState ?? (cy ? cycleState(cy) : 'unknown')
  const due = daysUntil(cy?.scholarship_deadline)
  const urgency = deadlineUrgency(cy?.scholarship_deadline)
  const href = programme.apply_url || programme.website
  const countries = countriesInvolved(programme)
  const scheme = fundingScheme(programme, catalogueName)

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div
        className={`h-1.5 shrink-0 ${
          programme.priority === 'A'
            ? 'bg-emerald-500'
            : programme.priority === 'A-'
              ? 'bg-sky'
              : programme.priority === 'B'
                ? 'bg-amber-400'
                : 'bg-slate-300'
        }`}
      />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="h-4 text-xs font-medium uppercase tracking-wide text-muted">
              {catalogueName || '\u00a0'}
            </p>
            <h3 className="mt-0.5 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-ink">
              {programme.acronym ? `${programme.acronym} · ` : ''}
              {programme.name}
            </h3>
            <p className="mt-0.5 h-5 text-sm text-muted">{cy?.label || '\u00a0'}</p>
          </div>
          <div className="flex max-w-[40%] shrink-0 flex-wrap justify-end gap-1.5">
            <PriorityBadge value={programme.priority} />
            <FundingBadge scheme={scheme} />
            <OpenBadge state={state} />
            {cy ? <DateStatusBadge status={cy.date_status} /> : null}
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-muted">Opens</dt>
            <dd className="line-clamp-2">{openDateLabel(cy)}</dd>
          </div>
          <div>
            <dt className="text-muted">Scholarship deadline</dt>
            <dd className={urgencyClass(urgency)}>
              {formatDate(cy?.scholarship_deadline)}
              {due !== null && due >= 0 ? <span className="ml-1 text-xs">({due}d)</span> : null}
            </dd>
          </div>
        </dl>

        <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm text-slate-600">
          {programme.fit_notes || '\u00a0'}
        </p>

        <div className="mt-4 flex flex-nowrap items-center gap-2">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg bg-sky px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-dark"
            >
              Official site
            </a>
          ) : null}
          {onTrack ? (
            <button
              type="button"
              disabled={tracking || tracked}
              onClick={onTrack}
              className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-100 disabled:text-emerald-800"
            >
              {tracked ? 'In tracker' : tracking ? 'Adding…' : 'Add to tracker'}
            </button>
          ) : (
            <Link to="/catalogue" className="shrink-0 text-sm font-medium text-sky hover:underline">
              Open in catalogue
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto shrink-0 text-sm font-medium text-slate-600 hover:text-ink"
          >
            {open ? 'Hide details' : 'Details'}
          </button>
        </div>

        {open ? (
          <div className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
            {fundingDetail(scheme) ? (
              <p>
                <span className="font-medium text-ink">Funding. </span>
                <span className="text-slate-600">{fundingDetail(scheme)}</span>
              </p>
            ) : null}
            {programme.coordinator ? (
              <p>
                <span className="font-medium text-ink">Consortium. </span>
                <span className="text-slate-600">{programme.coordinator}</span>
              </p>
            ) : null}
            <div>
              <p className="font-medium text-ink">Countries involved</p>
              {countries.length > 0 ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {countries.map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-sky/10 px-2.5 py-0.5 text-xs font-medium text-navy ring-1 ring-navy/15"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-slate-600">Not listed for this programme yet.</p>
              )}
            </div>
            {cy?.extra_dates?.deadline_text ? (
              <p>
                <span className="font-medium text-ink">Deadline note. </span>
                <span className="text-slate-600">{cy.extra_dates.deadline_text}</span>
              </p>
            ) : extra?.deadline_text ? (
              <p>
                <span className="font-medium text-ink">Deadline note. </span>
                <span className="text-slate-600">{extra.deadline_text}</span>
              </p>
            ) : null}
            {extra?.prepare ? (
              <p>
                <span className="font-medium text-ink">Prepare. </span>
                <span className="text-slate-600">{extra.prepare}</span>
              </p>
            ) : null}
            {extra?.watch_outs ? (
              <p>
                <span className="font-medium text-ink">Watch-outs. </span>
                <span className="text-slate-600">{extra.watch_outs}</span>
              </p>
            ) : null}
            {extra?.scholarships_text ? (
              <p>
                <span className="font-medium text-ink">Scholarships. </span>
                <span className="text-slate-600">{extra.scholarships_text}</span>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
