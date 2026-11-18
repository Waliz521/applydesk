import { findOrCreateCatalogue, removeProgrammesBySlug, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'
import { supabase } from '@/lib/supabase'

export const PLUS_AGI_SLUG = 'plus-applied-geoinformatics'

function plusAgiSeedExpectation(): { opens: string; label: string; selfFunded: string } {
  const rec = PROGRAMMES.find((p) => p.slug === PLUS_AGI_SLUG)!
  return {
    opens: rec.opens!,
    label: rec.cycle_label,
    selfFunded: rec.self_funded!,
  }
}

/** True when PLUS-AGI cycle dates in Supabase still match old winter-2027 seed (or row missing). */
export async function austriaSeedNeedsRefresh(): Promise<boolean> {
  const expected = plusAgiSeedExpectation()
  const { data, error } = await supabase
    .from('programmes')
    .select('cycles:programme_cycles(application_opens_on, label, self_funded_deadline)')
    .eq('slug', PLUS_AGI_SLUG)
    .maybeSingle()
  if (error || !data) return true
  const cycles = (data.cycles ?? []) as {
    application_opens_on: string | null
    label: string
    self_funded_deadline: string | null
  }[]
  if (cycles.length === 0) return true
  const cycle = cycles.find((c) => c.label === expected.label) ?? cycles[0]
  return (
    cycle.application_opens_on !== expected.opens ||
    cycle.label !== expected.label ||
    cycle.self_funded_deadline !== expected.selfFunded
  )
}

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'plus-applied-geoinformatics',
    acronym: 'PLUS-AGI',
    name: 'Applied Geoinformatics',
    official_title: 'MSc Applied Geoinformatics',
    priority: 'A',
    coordinator: 'Paris Lodron University of Salzburg (PLUS) — Department of Geoinformatics Z_GIS',
    countries: ['Austria'],
    duration: '24 months / 4 semesters / 120 ECTS',
    website: 'https://www.plus.ac.at/studium/studienangebot/masterstudien/applied-geoinformatics/?lang=en',
    apply_url: 'https://www.plus.ac.at/geoinformatik/education/agi/students/admission/?lang=en',
    fit_notes:
      'Best English GIS master’s in Austria. Z_GIS: spatial analysis, geo-application development, SDI, modelling. BS GIS / cartography / geomatics is admitted without extra coursework.',
    cycle_label: '2027 summer intake',
    opens: '2025-10-01',
    scholarship: null,
    self_funded: '2027-01-10',
    starts: '2027-03-01',
    date_status: 'confirmed',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES — Sommersemester 2027: complete file by 10 Jan 2027 (non-EU). Studienabteilung contact form + Z_GIS preselection. Winter 2027/28: non-EU docs by 10 Aug 2026 was prior intake.',
      target_start: '1 March 2027 (summer). Next winter: 1 October 2027.',
      opens_text: 'Summer intake: apply from the previous October. Winter: from ~May before the October start.',
      deadline_text:
        '10 January 2027 for non-EU complete documents (summer SS 2027). Winter 2027/28 non-EU: 10 August 2027. plus.ac.at/studium/important-dates-and-deadlines',
      tuition_text: '€726.72 / semester + ÖH ~€25 · ~€3,000 total (~Rs 9.6 lac). Living in Salzburg is the real cost.',
      self_funded_text:
        'Self-funded. Austrian student visa wants proof of funds (monthly rate on oead.at) and often tuition shown. No German blocked account.',
      scholarships_text:
        'No EMJM on this degree. Watch OeAD Erhard Busek (university nomination, no 2026/27 call planned). After you hold a Salzburg student residence permit, AAI One World is €500/month during the semester. CDE is the Salzburg Erasmus course — Erasmus Mundus catalogue.',
      prepare:
        'English C1 (IELTS Academic 6.5 / TOEFL iBT 95). Legalised degree + transcript + passport (Pakistan: HEC/MOFA + Austrian mission). Internship is compulsory in the curriculum.',
      watch_outs:
        'Document legalisation is the bottleneck, not the fee. CDE (Erasmus) is a different application from this residential AGI degree.',
      last_checked: '20 Oct 2026',
    },
  },
]
const DESCRIPTION =
  "MSc Applied Geoinformatics at the University of Salzburg. TU Wien was set aside. CDE sits in the Erasmus Mundus catalogue."

export async function seedAustriaCatalogue(opts?: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const removed = await removeProgrammesBySlug([
    'oead-busek',
    'aai-one-world',
    'oead-ernst-mach',
    'tuw-geodesy-geoinformation',
  ])
  if (removed) return { error: removed, count: 0 }
  const created = await findOrCreateCatalogue({
    slug: 'austria',
    name: 'Austria',
    description: DESCRIPTION,
    userId: opts?.userId,
    isAdmin: opts?.isAdmin,
  })
  if (created.error || !created.catalogueId) return { error: created.error ?? 'Could not create Austria catalogue', count: 0 }

  return upsertSeedProgrammes({
    catalogueId: created.catalogueId,
    programmes: PROGRAMMES,
    source: 'PLUS / Z_GIS / TU Wien pages, 20 Oct 2026',
  })
}
