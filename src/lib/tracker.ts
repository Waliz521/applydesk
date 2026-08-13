import { supabase } from '@/lib/supabase'
import { applyByDate } from '@/lib/dates'
import { fundingScheme } from '@/lib/funding'
import type { Programme, ProgrammeCycle } from '@/lib/types'

function trackerScholarshipName(programme: Programme): string {
  switch (fundingScheme(programme)) {
    case 'epos':
      return 'DAAD EPOS'
    case 'study_scholarship':
      return 'DAAD (not EPOS)'
    case 'self_funded':
      return 'Self-funded (tuition)'
    case 'nawa':
      return 'Banach NAWA'
    case 'emjm':
      return 'Erasmus Mundus Joint Master'
    default:
      return 'Scholarship / admission'
  }
}

export async function addProgrammeToTracker(input: {
  userId: string
  programme: Programme
  cycle?: ProgrammeCycle | null
  catalogueId?: string | null
}): Promise<{ error: string | null; already: boolean }> {
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('programme_id', input.programme.id)
    .limit(1)
  if (existing && existing.length > 0) return { error: null, already: true }

  const { data: statuses } = await supabase.from('application_statuses').select('id, slug')
  const watching = statuses?.find((s) => s.slug === 'watching') ?? statuses?.[0]
  const { error } = await supabase.from('applications').insert({
    user_id: input.userId,
    programme_id: input.programme.id,
    cycle_id: input.cycle?.id ?? null,
    catalogue_id: input.catalogueId ?? input.programme.catalogue_id,
    university: input.programme.coordinator,
    program_name: input.programme.acronym
      ? `${input.programme.acronym} — ${input.programme.name}`
      : input.programme.name,
    scholarship_name: trackerScholarshipName(input.programme),
    portal_url: input.programme.apply_url || input.programme.website,
    deadline: applyByDate(input.cycle) ?? null,
    status_id: watching?.id ?? null,
    notes: input.programme.fit_notes,
  })
  return { error: error?.message ?? null, already: false }
}
