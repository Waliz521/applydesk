export type FundingScheme = 'epos' | 'study_scholarship' | 'emjm' | 'self_funded' | 'nawa' | 'none'

export type ProgrammeExtra = {
  apply?: string | null
  target_start?: string | null
  opens_text?: string | null
  deadline_text?: string | null
  self_funded_text?: string | null
  scholarships_text?: string | null
  tuition_text?: string | null
  prepare?: string | null
  watch_outs?: string | null
  last_checked?: string | null
  funding_scheme?: FundingScheme | null
  work_years_required?: boolean | null
}

export type CycleExtraDates = {
  opens_text?: string | null
  deadline_text?: string | null
  self_funded_text?: string | null
  target_start?: string | null
}

export type Catalogue = {
  id: string
  slug: string
  name: string
  description: string | null
  is_system: boolean
  is_archived: boolean
}

export type Programme = {
  id: string
  catalogue_id: string
  slug?: string | null
  acronym: string | null
  name: string
  official_title: string | null
  coordinator: string | null
  consortium?: string | null
  countries?: string[]
  duration?: string | null
  language?: string | null
  website: string | null
  apply_url: string | null
  priority: string | null
  fit_notes: string | null
  extra?: ProgrammeExtra | null
  cycles?: ProgrammeCycle[]
}

export type ProgrammeCycle = {
  id: string
  programme_id: string
  label: string
  starts_on: string | null
  application_opens_on: string | null
  scholarship_deadline: string | null
  self_funded_deadline: string | null
  date_status: string
  scholarships_available: boolean | null
  extra_dates?: CycleExtraDates | null
}

export type OpenRow = ProgrammeCycle & {
  programme: Programme
  catalogue: Catalogue
  open_state: 'open' | 'upcoming' | 'closed' | 'unknown'
}

export type ApplicationStatus = {
  id: string
  slug: string
  label: string
  color: string | null
  sort_order: number
}

export type Application = {
  id: string
  user_id: string
  programme_id: string | null
  cycle_id: string | null
  catalogue_id: string | null
  status_id: string | null
  university: string | null
  program_name: string | null
  scholarship_name: string | null
  country: string | null
  point_of_entry: string | null
  portal_url: string | null
  deadline: string | null
  applied_on: string | null
  notes: string | null
}

export type DocumentType = {
  id: string
  slug: string
  label: string
  typically_expires: boolean
}

export type UserDocument = {
  id: string
  title: string
  document_type_id: string | null
  issued_on: string | null
  expires_on: string | null
  storage_path: string | null
  notes: string | null
}

export type ChecklistItem = {
  id: string
  application_id: string
  label: string
  is_done: boolean
  is_required: boolean
  due_on: string | null
}

export type Profile = {
  id: string
  display_name: string | null
  full_name: string | null
  is_admin: boolean
}
