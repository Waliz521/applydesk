import type { FundingScheme, Programme } from '@/lib/types'

export type { FundingScheme }

export function fundingScheme(programme: Programme, catalogueName?: string): FundingScheme {
  const stored = programme.extra?.funding_scheme
  if (stored === 'epos' || stored === 'study_scholarship' || stored === 'emjm' || stored === 'none') {
    return stored
  }
  const cat = (catalogueName || '').toLowerCase()
  const slug = (programme.slug || '').toLowerCase()
  const acronym = (programme.acronym || '').toLowerCase()
  if (cat.includes('erasmus')) return 'emjm'
  if (slug.includes('eagle') || acronym === 'eagle') return 'study_scholarship'
  if (slug.includes('study-scholarship') || acronym.includes('study')) return 'study_scholarship'
  if (cat.includes('daad')) return 'epos'
  return 'none'
}

export function fundingLabel(scheme: FundingScheme): string | null {
  switch (scheme) {
    case 'epos':
      return 'EPOS · 2 yr work'
    case 'study_scholarship':
      return 'Not EPOS'
    case 'emjm':
      return 'EMJM scholarship'
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
      return 'Erasmus Mundus Joint Master scholarship. No two-year work rule. Apply on the programme website. A full EMJM award generally replaces a German blocked account if your visa is for Germany; confirm with the mission that issues the visa.'
    default:
      return null
  }
}
