import { findOrCreateCatalogue, upsertSeedProgrammes, type SeedRec } from '@/lib/seedShared'

const PROGRAMMES: SeedRec[] = [
  {
    slug: 'polyu-lsgs-rpg',
    acronym: 'POLY-LSGS',
    name: 'Research postgraduate (LSGS)',
    official_title: 'MPhil / PhD — Land Surveying and Geospatial Sciences',
    priority: 'A',
    coordinator: 'PolyU — Department of Land Surveying and Geospatial Sciences',
    countries: ['Hong Kong'],
    duration: 'MPhil ~2 yr · PhD 3–4 yr (direct entry rules apply)',
    website: 'https://www.polyu.edu.hk/lsg/',
    apply_url: 'https://www.polyu.edu.hk/study/pg/rpg/2027/lsgs',
    fit_notes:
      'InSAR, geodesy, RS, GIS. Supervisor-first: email potential advisors with CV + 1-page proposal before the online RPG file. See hong-kong-universities.md in the repo for outreach notes.',
    cycle_label: 'Sep 2027 intake',
    opens: '2026-09-01',
    scholarship: '2026-12-01',
    self_funded: '2027-05-31',
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'YES — target Sep 2027 after supervisor agreement. May 2027 intake closes 31 Jan 2027.',
      target_start: '1 September 2027 (recommended)',
      opens_text: 'PolyU RPG for Sep 2027: expected 1 Sep 2026 – 31 May 2027. LSGS follows the dept RPG page.',
      deadline_text:
        'EXPECTED 31 May 2027 (Sep 2027 LSGS). HKPFS nomination deadline EXPECTED 1 Dec 2026 — same application cycle.',
      tuition_text: 'RPG with studentship: tuition usually waived or covered by award. Without funding, RPG fees are not a taught-MSc-style HK$250k path — do not apply without a supervisor studentship plan.',
      self_funded_text:
        'Treat as funded-only. IPFS / dept quota / HKPFS require supervisor support — not a pay-your-own-tuition taught master.',
      scholarships_text:
        'HKPFS (PhD, highly competitive). PolyU IPFS auto-consider for eligible international PhD. Dept grants via supervisor. Jan 2027 intake window closes ~30 Sep 2026 — only if supervisor already committed.',
      prepare:
        'BS geospatial/GIS or related. IELTS/TOEFL per PolyU GS. Research proposal + CV for supervisor email before portal submission.',
      watch_outs:
        'GS Ambassador Programme is for current students only. Do not apply to RPG without contacting LSGS faculty first.',
      last_checked: '22 Sep 2026',
    },
  },
  {
    slug: 'hku-geog-rpg',
    acronym: 'HKU-GEOG',
    name: 'Research postgraduate (Geography)',
    official_title: 'MPhil / PhD — Department of Geography',
    priority: 'A',
    coordinator: 'HKU — Department of Geography',
    countries: ['Hong Kong'],
    duration: 'MPhil ~2 yr · PhD 3–4 yr (direct PhD possible)',
    website: 'https://geog.hku.hk/mphil-phd',
    apply_url: 'https://gradsch.hku.hk/prospective_students/how_to_apply',
    fit_notes:
      'Hydrology, RS, geospatial data science, urban/environment. Geography asks you to email supervisors before applying. Funded via HKPFS or PGS — not taught MSc tuition.',
    cycle_label: 'Sep 2027 / main cycle',
    opens: '2026-09-01',
    scholarship: '2026-12-01',
    self_funded: '2027-05-31',
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: true,
    funding_scheme: 'partial',
    extra: {
      apply: 'YES — research route only if you need stipend + fee waiver.',
      target_start: 'September 2027 (align with HKPFS)',
      opens_text: 'HKU Grad School main round typically opens Sep for the following academic year — confirm gradsch.hku.hk.',
      deadline_text: 'HKPFS: EXPECTED 1 Dec 2026. Department main round often Dec–Jan — confirm Geography + Grad School pages.',
      tuition_text: 'With PGS/HKPFS: stipend + fee waiver. Without award, research programmes are not affordable on self-pay for most international students.',
      self_funded_text: 'Same as funded-only planning — supervisor quota and PGS/HKPFS are the realistic paths.',
      scholarships_text:
        'HKPFS (~HK$28,700/month + travel + waiver). PGS stipend (lower, supervisor nomination). Pakistan eligible for university postgraduate schemes.',
      prepare: 'Email 1–2 faculty with tailored proposal. BS GIS + thesis/publications help. IELTS per Grad School minimum.',
      watch_outs: 'MSc(GeoDS) is a separate taught programme (~HK$250k) — listed separately as self-funded.',
      last_checked: '22 Sep 2026',
    },
  },
  {
    slug: 'hku-geods-msc',
    acronym: 'HKU-GeoDS',
    name: 'MSc Geospatial Data Science',
    official_title: 'Master of Science in Geospatial Data Science (taught)',
    priority: 'C',
    coordinator: 'HKU — Geography / GeoDS programme',
    countries: ['Hong Kong'],
    duration: '1 year full-time (taught)',
    website: 'https://www.geods.hku.hk/',
    apply_url: 'https://www.geods.hku.hk/admissions',
    fit_notes:
      'Strong GIS curriculum but ~HK$250k tuition + living. Dept scholarship ~HK$20k after semester 1 — not sufficient for self-funded international applicants needing full support.',
    cycle_label: '2027 intake',
    opens: '2026-09-01',
    scholarship: null,
    self_funded: '2027-03-31',
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: false,
    funding_scheme: 'self_funded',
    extra: {
      apply: 'WATCH — only if budget changes. Prefer HKU MPhil/PhD for funding.',
      target_start: 'September 2027',
      opens_text: 'Taught PG admissions — check geods.hku.hk for the next round.',
      deadline_text: 'EXPECTED spring 2027 for Sep intake — confirm programme site.',
      tuition_text: 'Programme fee ~HK$250,000 (plus living). Geospatial Data Sciences Scholarship up to HK$20,000 for ~2 students after 1st semester — need-based + grades.',
      self_funded_text: 'Default path for international taught MSc. Visa proof-of-funds required.',
      scholarships_text: 'No full entrance scholarship for GeoDS comparable to HKPFS. Research degrees are the funding path.',
      prepare: 'BS GIS fits academically; financial plan does not unless external sponsor.',
      watch_outs: 'Do not confuse with Geography MPhil/PhD.',
      last_checked: '22 Sep 2026',
    },
  },
  {
    slug: 'hk-hkpfs',
    acronym: 'HKPFS',
    name: 'Hong Kong PhD Fellowship Scheme',
    official_title: 'Government PhD fellowship (via HKU or PolyU nomination)',
    priority: 'A',
    coordinator: 'Research Grants Council — via host university Grad School',
    countries: ['Hong Kong'],
    duration: 'PhD funding period (typically 3–4 years)',
    website: 'https://www.gradsch.hku.hk/prospective_students/fees_scholarships_and_financial_support/hong_kong_phd_fellowship_scheme',
    apply_url: 'https://www.polyu.edu.hk/gs/prospective-students/',
    fit_notes:
      'Top funded PhD route in HK. Apply through the university RPG application — not a standalone RGC portal for candidates. Pakistan eligible. ~300 awards per year across all HK institutions.',
    cycle_label: '2027/28 fellowship cycle',
    opens: '2026-09-01',
    scholarship: '2026-12-01',
    self_funded: null,
    starts: '2027-09-01',
    date_status: 'expected',
    scholarships: true,
    funding_scheme: 'full',
    extra: {
      apply: 'YES — if pursuing PhD at HKU or PolyU with supervisor support.',
      target_start: 'Fellowship tied to Sep 2027 PhD admission',
      opens_text: 'EXPECTED 1 Sep 2026 — same window as university HKPFS nomination.',
      deadline_text: 'EXPECTED 1 Dec 2026 for 2027/28 intake — confirm PolyU GS + HKU Grad School.',
      tuition_text: 'Fee waiver component plus stipend ~HK$28,700/month (figures on Grad School pages; adjust for inflation yearly).',
      self_funded_text: 'N/A — this row is the fellowship only.',
      scholarships_text:
        'Presidential/ university top-ups may apply for awardees. MPhil candidates are not HKPFS-eligible — PhD only.',
      prepare: 'Strong proposal, grades, research output. Supervisor must support nomination in the RPG form.',
      watch_outs: 'Extremely competitive. Have PGS / dept backup if not shortlisted.',
      last_checked: '22 Sep 2026',
    },
  },
]

export async function seedHongKongCatalogue(opts: {
  userId?: string
  isAdmin?: boolean
}): Promise<{ error: string | null; count: number }> {
  const { error: catError, catalogueId } = await findOrCreateCatalogue({
    slug: 'hong-kong',
    name: 'Hong Kong',
    description:
      'HKU Geography and PolyU LSGS research degrees (MPhil/PhD) plus HKPFS. Taught MSc GeoDS is self-funded (~HK$250k). Supervisor email before RPG apply. Detailed outreach notes: hong-kong-universities.md in this repo.',
    userId: opts.userId,
    isAdmin: opts.isAdmin,
  })
  if (catError || !catalogueId) return { error: catError ?? 'No catalogue id', count: 0 }

  return upsertSeedProgrammes({
    catalogueId,
    programmes: PROGRAMMES,
    source: 'HKU Geography / Grad School, PolyU LSGS & GS pages, 22 Sep 2026',
  })
}
