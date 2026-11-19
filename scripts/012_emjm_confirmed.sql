-- Confirmed 2027 EMJM cards: add GeoTech, SUFONAMA, and MSc EF.
-- Remove FloodRISK and WAVES. Tracker rows stay, unlinked.
-- Safe to re-run. Run the whole script.

begin;

update public.applications
set programme_id = null,
    cycle_id = null
where programme_id in (
  select id from public.programmes
  where slug in ('floodrisk', 'waves')
);

delete from public.programme_cycles
where programme_id in (
  select id from public.programmes
  where slug in ('floodrisk', 'waves')
);

delete from public.programmes
where slug in ('floodrisk', 'waves');

insert into public.programmes (
  catalogue_id, slug, acronym, name, official_title, coordinator, consortium,
  countries, duration, language, website, apply_url, degree_level, priority, fit_notes, extra
)
select
  c.id,
  v.slug,
  v.acronym,
  v.name,
  v.official_title,
  v.coordinator,
  v.coordinator,
  v.countries,
  v.duration,
  'English',
  v.website,
  v.apply_url,
  'masters',
  v.priority,
  v.fit_notes,
  v.extra
from public.catalogues c
join (
  values
    (
      'geotech',
      'GeoTech',
      'Geospatial Technologies',
      'Erasmus Mundus Joint Master in Geospatial Technologies',
      'University of Münster, with NOVA IMS Lisbon and Universitat Jaume I',
      array['Germany', 'Portugal', 'Spain'],
      '18 months',
      'https://mastergeotech.info/',
      'https://mastergeotech.info/how-to-apply/dates-and-deadlines/',
      'A',
      'GIS, Earth observation, and GeoAI joint master. Register as a Partner Country student. The degree must already be finished by the scholarship deadline.',
      jsonb_build_object(
        'funding_scheme', 'emjm',
        'work_years_required', false,
        'source', 'Official EMJM sites, 19 Nov 2026',
        'apply', 'Scholarship applications are open until 7 January 2027, 18:00 CET. Apply as a Partner Country student.',
        'target_start', 'September 2027',
        'opens_text', 'Scholarship applications are open.',
        'deadline_text', 'Confirmed: 7 January 2027, 18:00 CET, for the Erasmus Mundus scholarship.',
        'tuition_text', 'EMJM: tuition covered and €1,400/month for 18 months.',
        'self_funded_text', 'Self-funded applications open only after the scholarship deadline.',
        'scholarships_text', 'Erasmus Mundus scholarships are open. The programme page lists about 19 partner-country awards and about 2 programme-country awards per edition.',
        'prepare', 'Two recommenders. The portal emails them and they must upload before 7 January 2027, 18:00 CET. Public motivation video of at most 2 minutes. European CV with no gaps over the last 5.5 years.',
        'watch_outs', 'A Partner Country applicant whose first degree is unfinished on 7 January 2027 is not eligible for the scholarship.',
        'last_checked', '19 Nov 2026'
      )
    ),
    (
      'sufonama',
      'SUFONAMA',
      'Sustainable Forest and Nature Management',
      'Erasmus Mundus Joint Master in Sustainable Forest and Nature Management',
      'University of Copenhagen, with Bangor, Göttingen, SLU Alnarp, and Padova',
      array['Denmark', 'United Kingdom', 'Germany', 'Sweden', 'Italy'],
      '24 months / 120 ECTS',
      'https://sufonama-em.eu/',
      'https://sufonama-em.eu/application/',
      'A-',
      'Forest and nature management. Year 1 is in Copenhagen. Year 2 is a binding specialisation at Bangor, Göttingen, Alnarp, or Padova.',
      jsonb_build_object(
        'funding_scheme', 'emjm',
        'work_years_required', false,
        'source', 'Official EMJM sites, 19 Nov 2026',
        'apply', 'Outside the EU/EEA/Switzerland the portal is open. The scholarship is a question on the admission form.',
        'target_start', 'September 2027',
        'opens_text', 'Outside EU/EEA/Switzerland: portal opens 15 November 2026, 23:59 CET. EU/EEA/Switzerland: 16 January 2027.',
        'deadline_text', 'Confirmed: outside EU/EEA/Switzerland, 15 January 2027, 23:59 CET. EU/EEA/Switzerland: 1 March 2027, 23:59 CET.',
        'tuition_text', 'Non-EU tuition is €33,600 for two years. An Erasmus Mundus award waives it and pays €1,400/month for up to 24 months.',
        'self_funded_text', 'Admission without the scholarship is possible on the same form. First-semester tuition is due 15 April.',
        'scholarships_text', 'Erasmus Mundus scholarship. No application fee. Two signed letters on letterhead are required, at least one from a teacher.',
        'prepare', 'Europass CV, a motivation letter of about 500 words, and two recommendation letters.',
        'watch_outs', 'The year-2 university is chosen on the form and is binding.',
        'last_checked', '19 Nov 2026'
      )
    ),
    (
      'msc-ef',
      'MSc EF',
      'European Forestry',
      'Master of Science in European Forestry',
      'University of Eastern Finland, Joensuu',
      array['Finland'],
      '24 months',
      'https://sites.uef.fi/europeanforestry/',
      'https://sites.uef.fi/europeanforestry/how-to-apply/',
      'A-',
      'Erasmus Mundus forestry master. A bachelor in forestry or a related field is the published entry. Every complete file is considered for the scholarship.',
      jsonb_build_object(
        'funding_scheme', 'emjm',
        'work_years_required', false,
        'source', 'Official EMJM sites, 19 Nov 2026',
        'apply', 'The call opens 2 December 2026 on Studyinfo. There is no separate scholarship form.',
        'target_start', 'August 2027',
        'opens_text', 'Confirmed: the call opens 2 December 2026 at 08:00 UTC+2.',
        'deadline_text', 'Confirmed: 13 January 2027, 23:59 UTC+2. The 3-minute motivation video is due 20 January 2027, 23:59 Helsinki time.',
        'tuition_text', 'EMJM scholars: tuition covered and the monthly allowance. Results by 31 May 2027.',
        'self_funded_text', 'The same call also considers applicants who are not awarded the scholarship.',
        'scholarships_text', 'Erasmus Mundus scholarship. The admission file does not ask for a recommendation letter.',
        'prepare', 'Degree, transcript, English certificate, CV, passport photo, and a 3-minute motivation video. No recommendation letter.',
        'watch_outs', 'Submit the Studyinfo form before recording the video. A missing video means the file cannot be selected.',
        'last_checked', '19 Nov 2026'
      )
    )
) as v(
  slug, acronym, name, official_title, coordinator, countries, duration,
  website, apply_url, priority, fit_notes, extra
) on true
where c.slug = 'erasmus-mundus'
  and c.owner_user_id is null
  and not exists (
    select 1 from public.programmes p
    where p.catalogue_id = c.id and p.slug = v.slug
  );

update public.programmes p
set
  acronym = v.acronym,
  name = v.name,
  official_title = v.official_title,
  coordinator = v.coordinator,
  consortium = v.coordinator,
  countries = v.countries,
  duration = v.duration,
  website = v.website,
  apply_url = v.apply_url,
  priority = v.priority,
  fit_notes = v.fit_notes,
  extra = v.extra
from public.catalogues c
join (
  values
    (
      'geotech',
      'GeoTech',
      'Geospatial Technologies',
      'Erasmus Mundus Joint Master in Geospatial Technologies',
      'University of Münster, with NOVA IMS Lisbon and Universitat Jaume I',
      array['Germany', 'Portugal', 'Spain'],
      '18 months',
      'https://mastergeotech.info/',
      'https://mastergeotech.info/how-to-apply/dates-and-deadlines/',
      'A',
      'GIS, Earth observation, and GeoAI joint master. Register as a Partner Country student. The degree must already be finished by the scholarship deadline.',
      jsonb_build_object(
        'funding_scheme', 'emjm',
        'work_years_required', false,
        'source', 'Official EMJM sites, 19 Nov 2026',
        'apply', 'Scholarship applications are open until 7 January 2027, 18:00 CET. Apply as a Partner Country student.',
        'target_start', 'September 2027',
        'opens_text', 'Scholarship applications are open.',
        'deadline_text', 'Confirmed: 7 January 2027, 18:00 CET, for the Erasmus Mundus scholarship.',
        'tuition_text', 'EMJM: tuition covered and €1,400/month for 18 months.',
        'self_funded_text', 'Self-funded applications open only after the scholarship deadline.',
        'scholarships_text', 'Erasmus Mundus scholarships are open. The programme page lists about 19 partner-country awards and about 2 programme-country awards per edition.',
        'prepare', 'Two recommenders. The portal emails them and they must upload before 7 January 2027, 18:00 CET. Public motivation video of at most 2 minutes. European CV with no gaps over the last 5.5 years.',
        'watch_outs', 'A Partner Country applicant whose first degree is unfinished on 7 January 2027 is not eligible for the scholarship.',
        'last_checked', '19 Nov 2026'
      )
    ),
    (
      'sufonama',
      'SUFONAMA',
      'Sustainable Forest and Nature Management',
      'Erasmus Mundus Joint Master in Sustainable Forest and Nature Management',
      'University of Copenhagen, with Bangor, Göttingen, SLU Alnarp, and Padova',
      array['Denmark', 'United Kingdom', 'Germany', 'Sweden', 'Italy'],
      '24 months / 120 ECTS',
      'https://sufonama-em.eu/',
      'https://sufonama-em.eu/application/',
      'A-',
      'Forest and nature management. Year 1 is in Copenhagen. Year 2 is a binding specialisation at Bangor, Göttingen, Alnarp, or Padova.',
      jsonb_build_object(
        'funding_scheme', 'emjm',
        'work_years_required', false,
        'source', 'Official EMJM sites, 19 Nov 2026',
        'apply', 'Outside the EU/EEA/Switzerland the portal is open. The scholarship is a question on the admission form.',
        'target_start', 'September 2027',
        'opens_text', 'Outside EU/EEA/Switzerland: portal opens 15 November 2026, 23:59 CET. EU/EEA/Switzerland: 16 January 2027.',
        'deadline_text', 'Confirmed: outside EU/EEA/Switzerland, 15 January 2027, 23:59 CET. EU/EEA/Switzerland: 1 March 2027, 23:59 CET.',
        'tuition_text', 'Non-EU tuition is €33,600 for two years. An Erasmus Mundus award waives it and pays €1,400/month for up to 24 months.',
        'self_funded_text', 'Admission without the scholarship is possible on the same form. First-semester tuition is due 15 April.',
        'scholarships_text', 'Erasmus Mundus scholarship. No application fee. Two signed letters on letterhead are required, at least one from a teacher.',
        'prepare', 'Europass CV, a motivation letter of about 500 words, and two recommendation letters.',
        'watch_outs', 'The year-2 university is chosen on the form and is binding.',
        'last_checked', '19 Nov 2026'
      )
    ),
    (
      'msc-ef',
      'MSc EF',
      'European Forestry',
      'Master of Science in European Forestry',
      'University of Eastern Finland, Joensuu',
      array['Finland'],
      '24 months',
      'https://sites.uef.fi/europeanforestry/',
      'https://sites.uef.fi/europeanforestry/how-to-apply/',
      'A-',
      'Erasmus Mundus forestry master. A bachelor in forestry or a related field is the published entry. Every complete file is considered for the scholarship.',
      jsonb_build_object(
        'funding_scheme', 'emjm',
        'work_years_required', false,
        'source', 'Official EMJM sites, 19 Nov 2026',
        'apply', 'The call opens 2 December 2026 on Studyinfo. There is no separate scholarship form.',
        'target_start', 'August 2027',
        'opens_text', 'Confirmed: the call opens 2 December 2026 at 08:00 UTC+2.',
        'deadline_text', 'Confirmed: 13 January 2027, 23:59 UTC+2. The 3-minute motivation video is due 20 January 2027, 23:59 Helsinki time.',
        'tuition_text', 'EMJM scholars: tuition covered and the monthly allowance. Results by 31 May 2027.',
        'self_funded_text', 'The same call also considers applicants who are not awarded the scholarship.',
        'scholarships_text', 'Erasmus Mundus scholarship. The admission file does not ask for a recommendation letter.',
        'prepare', 'Degree, transcript, English certificate, CV, passport photo, and a 3-minute motivation video. No recommendation letter.',
        'watch_outs', 'Submit the Studyinfo form before recording the video. A missing video means the file cannot be selected.',
        'last_checked', '19 Nov 2026'
      )
    )
) as v(
  slug, acronym, name, official_title, coordinator, countries, duration,
  website, apply_url, priority, fit_notes, extra
) on true
where c.slug = 'erasmus-mundus'
  and c.owner_user_id is null
  and p.catalogue_id = c.id
  and p.slug = v.slug;

insert into public.programme_cycles (
  programme_id, label, starts_on, application_opens_on, scholarship_deadline,
  self_funded_deadline, date_status, scholarships_available, extra_dates
)
select
  p.id,
  '2027 intake',
  v.starts_on::date,
  v.opens_on::date,
  v.scholarship::date,
  v.self_funded::date,
  'confirmed',
  true,
  v.extra_dates
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
join (
  values
    (
      'geotech',
      '2027-09-01',
      '2026-10-01',
      '2027-01-07',
      null::text,
      jsonb_build_object(
        'opens_text', 'Scholarship applications are open.',
        'deadline_text', 'Confirmed: 7 January 2027, 18:00 CET, for the Erasmus Mundus scholarship.',
        'target_start', 'September 2027'
      )
    ),
    (
      'sufonama',
      '2027-09-01',
      '2026-11-15',
      '2027-01-15',
      '2027-01-15',
      jsonb_build_object(
        'opens_text', 'Outside EU/EEA/Switzerland: portal opens 15 November 2026, 23:59 CET.',
        'deadline_text', 'Confirmed: outside EU/EEA/Switzerland, 15 January 2027, 23:59 CET.',
        'target_start', 'September 2027'
      )
    ),
    (
      'msc-ef',
      '2027-08-01',
      '2026-12-02',
      '2027-01-13',
      '2027-01-13',
      jsonb_build_object(
        'opens_text', 'Confirmed: the call opens 2 December 2026 at 08:00 UTC+2.',
        'deadline_text', 'Confirmed: 13 January 2027, 23:59 UTC+2. The 3-minute motivation video is due 20 January 2027, 23:59 Helsinki time.',
        'target_start', 'August 2027'
      )
    )
) as v(slug, starts_on, opens_on, scholarship, self_funded, extra_dates) on true
where c.slug = 'erasmus-mundus'
  and c.owner_user_id is null
  and p.slug = v.slug
  and not exists (
    select 1 from public.programme_cycles cy where cy.programme_id = p.id
  );

update public.programme_cycles cy
set
  label = '2027 intake',
  starts_on = v.starts_on::date,
  application_opens_on = v.opens_on::date,
  scholarship_deadline = v.scholarship::date,
  self_funded_deadline = v.self_funded::date,
  date_status = 'confirmed',
  scholarships_available = true,
  extra_dates = coalesce(cy.extra_dates, '{}'::jsonb) || v.extra_dates
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
join (
  values
    ('geotech', '2027-09-01', '2026-10-01', '2027-01-07', null::text,
      jsonb_build_object('deadline_text', 'Confirmed: 7 January 2027, 18:00 CET, for the Erasmus Mundus scholarship.', 'target_start', 'September 2027')),
    ('sufonama', '2027-09-01', '2026-11-15', '2027-01-15', '2027-01-15',
      jsonb_build_object('deadline_text', 'Confirmed: outside EU/EEA/Switzerland, 15 January 2027, 23:59 CET.', 'target_start', 'September 2027')),
    ('msc-ef', '2027-08-01', '2026-12-02', '2027-01-13', '2027-01-13',
      jsonb_build_object('deadline_text', 'Confirmed: 13 January 2027, 23:59 UTC+2. The 3-minute motivation video is due 20 January 2027, 23:59 Helsinki time.', 'target_start', 'August 2027'))
) as v(slug, starts_on, opens_on, scholarship, self_funded, extra_dates) on true
where cy.programme_id = p.id
  and c.slug = 'erasmus-mundus'
  and c.owner_user_id is null
  and p.slug = v.slug;

commit;
