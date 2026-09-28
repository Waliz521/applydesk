import { findCatalogueBySlug, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'
import { supabase } from '@/lib/supabase'

const PROGRAMME: SeedRec = {
  slug: 'cartography',
  acronym: 'Cartography',
  name: 'Cartography M.Sc.',
  official_title: 'Erasmus Mundus Master of Science in Cartography: Mapping for a Sustainable World',
  priority: 'A',
  coordinator:
    'Technical University of Munich (DE), coordinator — with TU Wien (AT) and TU Dresden (DE). University of Twente / ITC is not in the 2027 thesis rotation.',
  countries: ['Germany', 'Austria'],
  duration: '24 months / 4 semesters / 120 ECTS',
  website: 'https://cartographymaster.eu/',
  apply_url: 'https://cartographymaster.eu/how-to-apply/',
  fit_notes:
    'The missing core GIS / cartography joint master’s: maps, geovisualisation, geoinformatics. Semester 1 Munich, 2 Vienna, 3 Dresden. Matches a BS GIS + cartography concentration.',
  cycle_label: '2027 intake',
  opens: '2027-01-01',
  scholarship: null,
  self_funded: '2027-05-31',
  starts: '2027-10-01',
  date_status: 'expected',
  scholarships: false,
  funding_scheme: 'self_funded',
  extra: {
    apply: 'Watch — 2026 intake closed (1 Jan–31 May 2026). 2027 portal is expected to open 1 January.',
    target_start: '1 October 2027',
    opens_text: 'Application opens 1 January every year via TUMonline. International applicants also need a uni-assist VPD.',
    deadline_text:
      'EXPECTED 31 May 2027 (same window as 2026). Recheck cartographymaster.eu/how-to-apply before treating the date as confirmed.',
    tuition_text:
      'No EMJM award. Non-EU programme fees are mainly TUM semester contribution (~€97) each term + TU Wien €726.72 + TU Dresden ~€338 · roughly €1,450 total. Munich living and a German blocked account are the expensive parts.',
    self_funded_text:
      'Self-funded only. First semester is Germany, so plan a blocked account / proof of funds for the German visa. Semester 2 in Vienna uses the Austrian student-residence rules.',
    scholarships_text:
      'No Erasmus Mundus scholarships after the 2025 intake (programme said so in the student handbook). They still enrol self-funded students. Do not treat the EMJM badge on other cards as applying here.',
    prepare:
      'uni-assist VPD + TUMonline. IELTS/TOEFL. CV. Motivation letter (their 5 questions). Two recommendation letters. Map/visualisation portfolio strongly recommended (PDF or link to info@cartographymaster.eu).',
    watch_outs:
      'Still branded Erasmus Mundus, but there is no scholarship for 2026 or 2027. ITC/Twente thesis option ends after the 2026 cohort.',
    last_checked: '28 Sep 2026',
  },
}

export async function seedCartographyProgramme(opts?: {
  userId?: string
  force?: boolean
}): Promise<{ error: string | null; count: number; added: boolean }> {
  const found = await findCatalogueBySlug('erasmus-mundus', opts?.userId)
  if (found.error) return { error: found.error, count: 0, added: false }
  if (!found.catalogueId) return { error: null, count: 0, added: false }

  if (!opts?.force) {
    const { data: existing } = await supabase
      .from('programmes')
      .select('id')
      .eq('catalogue_id', found.catalogueId)
      .eq('slug', PROGRAMME.slug)
      .maybeSingle()
    if (existing?.id) return { error: null, count: 0, added: false }
  }

  const result = await upsertSeedProgrammes({
    catalogueId: found.catalogueId,
    programmes: [PROGRAMME],
    source: 'cartographymaster.eu handbook and apply pages, 28 Sep 2026',
  })
  return { ...result, added: !result.error && result.count > 0 }
}
