import { supabase } from '@/lib/supabase'

type SeedRec = {
  slug: string
  acronym: string
  name: string
  official_title: string
  priority: string
  coordinator: string
  duration: string
  website: string
  apply_url: string
  fit_notes: string
  opens: string | null
  scholarship: string | null
  self_funded: string | null
  starts: string | null
  date_status: string
  scholarships: boolean
  funding_scheme: 'self_funded' | 'nawa'
  extra: Record<string, string | boolean | null>
}

const CYCLE_LABEL = '2026/27 intake'

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'agh-remote-sensing-geo-informatics',
    acronym: 'AGH-RSGI',
    name: 'Remote Sensing and Geo Informatics',
    official_title: 'MSc Remote Sensing and Geo Informatics',
    priority: 'A',
    coordinator: 'AGH University of Krakow — Faculty of Geo-Data Science, Geodesy and Environmental Engineering',
    duration: '24 months / 4 semesters',
    website: 'https://www.international.agh.edu.pl/en/studies/education-offer-master-studies',
    apply_url: 'https://www.international.agh.edu.pl/en/studies/education-offer-master-studies',
    fit_notes:
      'Best English GIS match in Poland: Sentinel/Copernicus, Python for RS, time series, ML, geo-tools, hazards, urban/environment. Accepts a bachelor, not only an engineer.',
    opens: '2026-06-01',
    scholarship: null,
    self_funded: '2026-09-15',
    starts: '2026-10-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES if 2026/27 second round is still open — confirm this week',
      target_start: '1 October 2026 (next cycle October 2027)',
      opens_text: 'Summer recruitment: June–September, with an online entrance exam.',
      deadline_text: 'EXPECTED mid-September 2026 for October 2026 start. Confirm with international.students@agh.edu.pl.',
      tuition_text: '€1,650 / semester · €6,600 total (~Rs 21 lac). First year €3,300 (~Rs 11 lac).',
      self_funded_text: 'Self-funded. Islamabad visa usually wants first-year tuition paid or shown, plus living money. No German blocked account.',
      scholarships_text: 'No EMJM/DAAD on this degree. Banach NAWA 2026 did not include Pakistan.',
      prepare: 'Entrance exam (image processing, NDVI, map scale, stats). IELTS/B2. Legalised degree + transcript.',
      watch_outs: 'Kraków living is the expensive part, not the tuition.',
      last_checked: '13 Aug 2026',
    },
  },
  {
    slug: 'puls-geoinformation-spatial-management',
    acronym: 'PULS-GEO',
    name: 'Geoinformation and Spatial Management',
    official_title: 'MSc Geoinformation and Spatial Management',
    priority: 'A-',
    coordinator: 'Poznań University of Life Sciences — Faculty of Environmental and Mechanical Engineering',
    duration: '24 months / 4 semesters',
    website: 'https://wisim.up.poznan.pl/wydzial/study-english/msc/msc-geo',
    apply_url: 'https://wisim.up.poznan.pl/wydzial/study-english/msc/msc-geo',
    fit_notes:
      'GIS + Earth observation for environment, UAV, spatial planning. Cheapest English GIS-shaped master’s. Fits Forest Dept / water-environment.',
    opens: '2026-06-01',
    scholarship: null,
    self_funded: '2026-09-15',
    starts: '2026-10-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'YES — cheapest public GIS option if 2026/27 is still recruiting',
      target_start: 'October 2026',
      opens_text: 'Winter semester start. Confirm the foreign-student deadline on the faculty site.',
      deadline_text: 'EXPECTED September 2026. Recheck wisim.up.poznan.pl.',
      tuition_text: '€4,200 total (~Rs 13.6 lac). €1,100 × 3 + €900. Enrolment fee €65 (non-EU).',
      self_funded_text: 'Self-funded. Year 1 is about €2,200 (~Rs 7 lac) plus visa show-money.',
      scholarships_text: 'No built-in EM scholarship. Banach NAWA 2026 did not include Pakistan.',
      prepare: 'BSc GIS / geography / environment. English B2.',
      watch_outs: 'Less pure web GIS than AGH. Poznań living is cheaper than Kraków/Warsaw.',
      last_checked: '13 Aug 2026',
    },
  },
  {
    slug: 'wut-mobile-mapping-navigation',
    acronym: 'WUT-MMNS',
    name: 'Mobile Mapping and Navigation Systems',
    official_title: 'MSc Geodesy and Cartography — Mobile Mapping and Navigation Systems',
    priority: 'B',
    coordinator: 'Warsaw University of Technology — Faculty of Geodesy and Cartography',
    duration: '18 months / 3 semesters',
    website: 'https://zk.gik.pw.edu.pl/mmns',
    apply_url: 'https://www.students.pw.edu.pl/index.php/Studies-Offer/M.Sc.-offer',
    fit_notes:
      'GNSS/INS, UAV and mobile mapping. Strong tech; weaker classic GIS than AGH. February start if you miss October.',
    opens: '2026-11-01',
    scholarship: null,
    self_funded: '2027-01-15',
    starts: '2027-02-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'Watch — February 2027 start',
      target_start: 'February 2027',
      opens_text: 'WUT 2026/27 MSc offer lists a February start. Confirm on students.pw.edu.pl.',
      deadline_text: 'EXPECTED January 2027.',
      tuition_text: '€1,800 / semester · €5,400 total (~Rs 17 lac) for 3 semesters.',
      self_funded_text: 'Self-funded. Warsaw living is at the high end of Poland.',
      scholarships_text: 'No EMJM. Banach NAWA 2026 did not include Pakistan.',
      prepare: 'Often wants geodesy/geoinformatics first cycle. Your 4-year BS GIS may need individual assessment.',
      watch_outs: 'More surveying/navigation than environmental GIS. Shorter programme.',
      last_checked: '13 Aug 2026',
    },
  },
  {
    slug: 'uwm-geodesy-geoinformatics',
    acronym: 'UWM-GiK',
    name: 'Geodesy and Geoinformatics',
    official_title: 'MSc Geodesy and Cartography — Geodesy and Geoinformatics',
    priority: 'B',
    coordinator: 'University of Warmia and Mazury in Olsztyn — Faculty of Geoengineering',
    duration: '18 months / 3 semesters',
    website: 'https://irk.uwm.edu.pl/pl/offer/REK_25_26_OBCE/programme/08_SMU_GiK_ANG/?from=field%3A08',
    apply_url: 'https://irk.uwm.edu.pl/pl/offer/REK_25_26_OBCE/programme/08_SMU_GiK_ANG/?from=field%3A08',
    fit_notes: 'Historic geoengineering faculty. GNSS, satellite RS, GIS programming. Cheapest tuition; smaller city.',
    opens: '2026-06-01',
    scholarship: null,
    self_funded: '2026-09-15',
    starts: '2026-10-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'Optional cheap public option',
      target_start: 'October 2026',
      opens_text: 'Foreign-student IRK rounds. Confirm the current English GiK window.',
      deadline_text: 'EXPECTED September 2026. Recheck UWM IRK.',
      tuition_text: '5,000 PLN / semester · 15,000 PLN total (~Rs 11 lac) for 3 semesters.',
      self_funded_text: 'Self-funded. Lowest tuition; Olsztyn living is cheaper than Kraków/Warsaw.',
      scholarships_text: 'No EMJM. Banach NAWA 2026 did not include Pakistan.',
      prepare: 'English B2. Related bachelor (geodesy, geoinformatics, geography).',
      watch_outs: 'Weaker web-GIS story than AGH. Use if budget is the constraint.',
      last_checked: '13 Aug 2026',
    },
  },
  {
    slug: 'pwr-geodesy-cartography',
    acronym: 'PWr-GiK',
    name: 'Geodesy and Cartography',
    official_title: 'MSc Geodesy and Cartography (English) / Geomatics for Mineral Resources',
    priority: 'B',
    coordinator: 'Wrocław University of Science and Technology — Faculty of Geoengineering, Mining and Geology',
    duration: '18–24 months',
    website: 'https://wggg.pwr.edu.pl/en/candidates/msc-studies/geodesy-and-cartography',
    apply_url: 'https://wggg.pwr.edu.pl/en/candidates/msc-studies/geodesy-and-cartography',
    fit_notes:
      'Spatial data, GIS, remote sensing, ML. Mining geomatics track can include a double degree with Freiberg or Leoben.',
    opens: '2026-06-01',
    scholarship: null,
    self_funded: '2026-09-15',
    starts: '2026-10-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'Yes if you want Wrocław + possible DE/AT semester',
      target_start: 'October 2026',
      opens_text: 'Winter intake via PWr IRK.',
      deadline_text: 'EXPECTED September 2026. Recheck admission@pwr.edu.pl.',
      tuition_text: 'About €2,000 / semester (non-EU). Confirm the 2026/27 table.',
      self_funded_text: 'Self-funded. EU students often pay nothing; you do not.',
      scholarships_text: 'No EMJM. Banach NAWA 2026 did not include Pakistan.',
      prepare: 'Bachelor in geodesy, mining/geology, or related. IELTS 6.5 listed on older pages.',
      watch_outs: 'Mining flavour on the geomatics specialisation.',
      last_checked: '13 Aug 2026',
    },
  },
  {
    slug: 'nawa-banach',
    acronym: 'NAWA',
    name: 'Banach NAWA scholarship (Poland master’s)',
    official_title: 'Stefan Banach NAWA Programme — second-cycle studies in Poland',
    priority: 'C',
    coordinator: 'Polish National Agency for Academic Exchange (NAWA)',
    duration: 'Master’s + optional preparatory year',
    website: 'https://nawa.gov.pl/en/',
    apply_url: 'https://programs.nawa.gov.pl/login',
    fit_notes:
      'Polish government master’s scholarship. Separate from university admission. Pakistan was not on the 36-country list for 2026/27 (closed 8 May 2026).',
    opens: null,
    scholarship: null,
    self_funded: null,
    starts: '2027-10-01',
    date_status: 'expected',
    scholarships: true,
    funding_scheme: 'nawa',
    extra: {
      apply: 'NO for 2026/27 — Pakistan not listed. Watch the 2027 call.',
      target_start: 'October 2027 if Pakistan is added',
      opens_text: '2026 call closed 8 May 2026. Next call typically spring.',
      deadline_text: 'EXPECTED spring 2027 for 2027/28 — only if Pakistan appears on that year’s list.',
      tuition_text: 'If awarded: NAWA stipend + public university place. If not: pay the tuition on the degree cards.',
      self_funded_text: 'This row is the scholarship, not a degree. Still apply to AGH/PULS/etc. separately.',
      scholarships_text: 'Pakistan not eligible in 2026. Recheck nawa.gov.pl for the 2027 announcement.',
      prepare: 'If a future call includes Pakistan: NAWA portal + university admission proof, English B2.',
      watch_outs: 'Do not treat NAWA as an open GIS scholarship this year.',
      last_checked: '13 Aug 2026',
    },
  },
]

const DESCRIPTION =
  'Public Polish GIS / geodesy master’s in English. These degrees are self-funded (tuition on each card). Banach NAWA is a separate scholarship; Pakistan was not eligible in 2026/27.'

export async function seedPolandCatalogue(): Promise<{ error: string | null; count: number }> {
  const { data: existingCat, error: catLookupError } = await supabase
    .from('catalogues')
    .select('id')
    .eq('slug', 'poland')
    .is('owner_user_id', null)
    .maybeSingle()
  if (catLookupError) return { error: catLookupError.message, count: 0 }

  let catalogueId = existingCat?.id as string | undefined
  if (!catalogueId) {
    const { data: created, error: createError } = await supabase
      .from('catalogues')
      .insert({
        owner_user_id: null,
        slug: 'poland',
        name: 'Poland (self-funded)',
        description: DESCRIPTION,
        is_system: true,
      })
      .select('id')
      .single()
    if (createError) return { error: createError.message, count: 0 }
    catalogueId = created.id
  } else {
    await supabase
      .from('catalogues')
      .update({ name: 'Poland (self-funded)', description: DESCRIPTION })
      .eq('id', catalogueId)
  }

  const { data: existingRows } = await supabase
    .from('programmes')
    .select('id, slug')
    .eq('catalogue_id', catalogueId)
  const bySlug = new Map((existingRows ?? []).map((row) => [row.slug as string, row.id as string]))

  let count = 0
  for (const rec of PROGRAMMES) {
    const extra = {
      ...rec.extra,
      funding_scheme: rec.funding_scheme,
      work_years_required: false,
      source: 'AGH / PULS / WUT / UWM / PWr / NAWA pages, 13 Aug 2026',
    }
    const payload = {
      catalogue_id: catalogueId,
      slug: rec.slug,
      acronym: rec.acronym,
      name: rec.name,
      official_title: rec.official_title,
      coordinator: rec.coordinator,
      consortium: rec.coordinator,
      countries: ['Poland'],
      duration: rec.duration,
      language: 'English',
      website: rec.website,
      apply_url: rec.apply_url,
      degree_level: 'masters',
      priority: rec.priority,
      fit_notes: rec.fit_notes,
      extra,
    }
    let programmeId = bySlug.get(rec.slug)
    if (programmeId) {
      const { error } = await supabase.from('programmes').update(payload).eq('id', programmeId)
      if (error) return { error: error.message, count }
    } else {
      const { data, error } = await supabase.from('programmes').insert(payload).select('id').single()
      if (error) return { error: error.message, count }
      programmeId = data.id
    }

    const { data: cycles } = await supabase
      .from('programme_cycles')
      .select('id')
      .eq('programme_id', programmeId)
      .eq('label', CYCLE_LABEL)
    const cyclePayload = {
      programme_id: programmeId,
      label: CYCLE_LABEL,
      starts_on: rec.starts,
      application_opens_on: rec.opens,
      scholarship_deadline: rec.scholarship,
      self_funded_deadline: rec.self_funded,
      date_status: rec.date_status,
      scholarships_available: rec.scholarships,
      extra_dates: {
        opens_text: rec.extra.opens_text,
        deadline_text: rec.extra.deadline_text,
        self_funded_text: rec.extra.self_funded_text,
        target_start: rec.extra.target_start,
      },
    }
    if (cycles && cycles.length > 0) {
      const { error } = await supabase.from('programme_cycles').update(cyclePayload).eq('id', cycles[0].id)
      if (error) return { error: error.message, count }
    } else {
      const { error } = await supabase.from('programme_cycles').insert(cyclePayload)
      if (error) return { error: error.message, count }
    }
    count += 1
  }
  return { error: null, count }
}
