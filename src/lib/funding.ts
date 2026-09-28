import type { FundingScheme, Programme } from '@/lib/types'

export type { FundingScheme }

const STORED: FundingScheme[] = [
  'epos',
  'study_scholarship',
  'emjm',
  'self_funded',
  'nawa',
  'oead',
  'partial',
  'full',
  'none',
]

export function fundingScheme(programme: Programme, catalogueName?: string): FundingScheme {
  const stored = programme.extra?.funding_scheme
  if (stored && STORED.includes(stored)) return stored
  const cat = (catalogueName || '').toLowerCase()
  const slug = (programme.slug || '').toLowerCase()
  const acronym = (programme.acronym || '').toLowerCase()
  if (cat.includes('erasmus')) return 'emjm'
  if (
    cat.includes('poland') ||
    cat.includes('austria') ||
    cat.includes('netherlands') ||
    cat.includes('hong kong') ||
    cat.includes('self-funded')
  ) {
    if (slug.includes('nawa') || acronym === 'nawa') return 'nawa'
    if (slug.includes('busek') || acronym === 'oead' || acronym === 'busek') return 'oead'
    if (slug.includes('hkpfs') || acronym === 'hkpfs') return 'full'
    if (
      slug.includes('scholarship') ||
      slug.includes('excellence') ||
      slug.includes('one-world') ||
      slug.includes('ernst-mach') ||
      slug.includes('okp')
    ) {
      return 'partial'
    }
    if (slug.includes('bleumink')) return 'full'
    if (slug.includes('geods')) return 'self_funded'
    if (slug.includes('rpg') || slug.includes('geog-rpg') || slug.includes('lsgs')) return 'partial'
    return 'self_funded'
  }
  if (slug.includes('eagle') || acronym === 'eagle') return 'study_scholarship'
  if (slug.includes('study-scholarship') || acronym.includes('study')) return 'study_scholarship'
  if (cat.includes('daad')) return 'epos'
  return 'none'
}

/** EPOS scholarships need 2 years' work after bachelor — hidden from lists when ineligible. */
export function isEposProgramme(programme: Programme, catalogueName?: string): boolean {
  if (programme.extra?.work_years_required === true) return true
  return fundingScheme(programme, catalogueName) === 'epos'
}

export function fundingLabel(scheme: FundingScheme): string | null {
  switch (scheme) {
    case 'epos':
      return 'EPOS · 2 yr work'
    case 'study_scholarship':
      return 'Not EPOS'
    case 'emjm':
      return 'EMJM scholarship'
    case 'self_funded':
      return 'Self-funded · tuition'
    case 'nawa':
      return 'NAWA scholarship'
    case 'oead':
      return 'OeAD · Busek'
    case 'partial':
      return 'Partial scholarship'
    case 'full':
      return 'Full university grant'
    default:
      return null
  }
}

export function fundingClass(scheme: FundingScheme): string {
  switch (scheme) {
    case 'epos':
      return 'bg-orange-600 text-white'
    case 'study_scholarship':
      return 'bg-teal-700 text-white'
    case 'emjm':
      return 'bg-indigo-600 text-white'
    case 'self_funded':
      return 'bg-slate-800 text-white'
    case 'nawa':
      return 'bg-rose-700 text-white'
    case 'oead':
      return 'bg-rose-700 text-white'
    case 'partial':
      return 'bg-violet-700 text-white'
    case 'full':
      return 'bg-emerald-800 text-white'
    default:
      return 'bg-slate-200 text-slate-700'
  }
}

export function fundingDetail(scheme: FundingScheme): string | null {
  switch (scheme) {
    case 'epos':
      return 'DAAD EPOS. Apply to this German course, not to DAAD. The scholarship needs two years of relevant work after your bachelor, already completed on the deadline. You can still apply to the course without EPOS (self-funded + blocked account for Germany).'
    case 'study_scholarship':
      return 'Not DAAD EPOS — no two-year work rule for this course. DAAD Pakistan’s master’s list (Aug 2026) does not include Study Scholarships for all disciplines (those listed are architecture/arts). GIS funding here is usually self-funded or another scholarship. Recheck daad.pk with origin Pakistan before treating a DAAD portal scheme as open to you.'
    case 'emjm':
      return 'Erasmus Mundus Joint Master (EMJM). Apply on each programme website (no single EU form). Pakistan is a Partner Country and is eligible. Typical award: €1,400/month for up to 24 months (€33,600) plus tuition/participation covered; travel/installation rules vary by consortium. No two-year work rule. Geographic caps apply (usually ≤10% of awards to one nationality across editions). Cartography has no EMJM after 2025 — self-funded only. Confirm visa proof-of-funds with the host that issues the first visa.'
    case 'self_funded':
      return 'You pay tuition (amount on the card). This is not a full Erasmus Mundus or DAAD EPOS award. Visa proof-of-funds still applies: Austria and Poland want bank evidence and often first-year tuition shown; the Netherlands invoices first-year tuition and living before IND; a German first semester usually means a blocked account.'
    case 'nawa':
      return 'Banach NAWA is a Polish government master’s scholarship, applied on the NAWA portal, separate from university admission. Pakistan was not on the 2026/27 country list (call closed 8 May 2026). Watch the next spring announcement before treating it as open to you.'
    case 'oead':
      return 'OeAD Erhard Busek Grant. Pakistan is on the country list. It is a full two-year master’s award (€1,300/month + travel, tuition waived by the university) when a call is open. You cannot apply to OeAD directly — the Austrian university must nominate you after unconditional admission. OeAD currently says no further call is planned after 2025/26. Recheck oead.at / grants.at before treating it as open.'
    case 'partial':
      return 'Partial award only. It does not replace tuition + living the way Erasmus Mundus or DAAD EPOS can. Read the card for the remaining amount you must still pay, and for visa proof-of-funds. Apply to the university (or the named portal) after or with admission — not as a standalone government fellowship unless the card says so.'
    case 'full':
      return 'University-funded full master’s (tuition + living). Not Erasmus Mundus and not DAAD. There is usually no separate scholarship form — complete the master’s admission by the date on the card and wait to be nominated. Places are few.'
    default:
      return null
  }
}

export function tuitionText(programme: Programme): string | null {
  const value = programme.extra?.tuition_text?.trim()
  return value || null
}

export function deadlineFieldLabel(scheme: FundingScheme): string {
  if (scheme === 'self_funded') return 'Admission deadline'
  if (scheme === 'nawa' || scheme === 'oead' || scheme === 'partial' || scheme === 'full') return 'Scholarship deadline'
  return 'Scholarship deadline'
}
