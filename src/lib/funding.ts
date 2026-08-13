import type { FundingScheme, Programme } from '@/lib/types'

export type { FundingScheme }

const STORED: FundingScheme[] = ['epos', 'study_scholarship', 'emjm', 'self_funded', 'nawa', 'none']

export function fundingScheme(programme: Programme, catalogueName?: string): FundingScheme {
  const stored = programme.extra?.funding_scheme
  if (stored && STORED.includes(stored)) return stored
  const cat = (catalogueName || '').toLowerCase()
  const slug = (programme.slug || '').toLowerCase()
  const acronym = (programme.acronym || '').toLowerCase()
  if (cat.includes('erasmus')) return 'emjm'
  if (cat.includes('poland') || cat.includes('self-funded')) {
    if (slug.includes('nawa') || acronym === 'nawa') return 'nawa'
    return 'self_funded'
  }
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
    case 'self_funded':
      return 'Self-funded · tuition'
    case 'nawa':
      return 'NAWA scholarship'
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
    case 'self_funded':
      return 'You pay tuition. This is not Erasmus Mundus or DAAD EPOS. Poland has no blocked account, but the Islamabad consulate still wants proof of funds and usually first-year tuition paid or shown. You may work after you are a full-time student at a public university; that is not a visa document.'
    case 'nawa':
      return 'Banach NAWA is a Polish government master’s scholarship, applied on the NAWA portal, separate from university admission. Pakistan was not on the 2026/27 country list (call closed 8 May 2026). Watch the next spring announcement before treating it as open to you.'
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
  if (scheme === 'nawa') return 'Scholarship deadline'
  return 'Scholarship deadline'
}
