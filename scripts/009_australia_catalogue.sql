-- Australia research master's: Sydney MPhil, Monash Master's by Research, ANU Fenner MPhil.
-- RTP only (full tuition + living stipend). Safe to re-run: updates the same slugs.
-- Run the whole script in one go in the Supabase SQL editor.

begin;

insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'australia',
    'Australia',
    'Australian research master''s that pay full tuition and a living stipend (RTP). Sydney MPhil (Science), Monash Master''s by Research, and ANU Fenner MPhil. A supervisor has to agree before you lodge. Coursework GIS degrees and fee cuts with no living allowance are not listed.',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);

update public.catalogues
set
  name = 'Australia',
  description = 'Australian research master''s that pay full tuition and a living stipend (RTP). Sydney MPhil (Science), Monash Master''s by Research, and ANU Fenner MPhil. A supervisor has to agree before you lodge. Coursework GIS degrees and fee cuts with no living allowance are not listed.',
  is_system = true
where slug = 'australia'
  and owner_user_id is null;

-- Sydney
insert into public.programmes (
  catalogue_id, slug, acronym, name, official_title, coordinator, consortium,
  countries, duration, language, website, apply_url, degree_level, priority, fit_notes, extra
)
select
  c.id,
  'sydney-mphil-science',
  'USYD-MPHIL',
  'Master of Philosophy (Science)',
  'Master of Philosophy (Science) — University of Sydney',
  'University of Sydney — Faculty of Science',
  'University of Sydney — Faculty of Science',
  array['Australia'],
  'Up to 2 years full time',
  'English',
  'https://www.sydney.edu.au/courses/courses/pr/master-of-philosophy-science0.html',
  'https://www.sydney.edu.au/study/applying/how-to-apply/postgraduate-research.html',
  'masters',
  'A',
  'Research master''s, not a PhD. Pitch is GIS and remote sensing. RTP stipend includes the tuition offset; the university stipend (USYDIS) is the same package if RTP places are full. Do not lodge until a supervisor has agreed.',
  jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'RTP stipend',
    'work_years_required', false,
    'source', 'Sydney / Monash / ANU RTP pages, 13 Nov 2026',
    'apply', 'YES for Research Periods 3 and 4, 2027, only after a supervisor agrees. The supervisor email is not the application. One A$150 fee covers applications for a year and is not refunded.',
    'target_start', 'Research Periods 3 and 4, 2027',
    'opens_text', 'No separate published open date. Write the proposal, then email a supervisor, then lodge.',
    'deadline_text', '18 December 2026. Outcomes from 26 February 2027. Sydney''s estimate for offshore applicants is 18 May 2027.',
    'tuition_text', 'RTP, or USYDIS if RTP places are full: full tuition, living allowance A$44,293 a year, plus relocation and thesis allowances. On a research master''s the stipend runs for up to two years.',
    'self_funded_text', 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
    'scholarships_text', 'Australian Government Research Training Program (international). The tuition offset is awarded with the stipend. Scholarship page: sydney.edu.au/scholarships/australian-government-research-training-program/rtp-international.html',
    'prepare', 'Proposal first (Faculty of Science: up to 2,000 words), then email a supervisor with background, the topic, and the fit, attaching a CV, transcripts, and that proposal. After they agree: final proposal, the agreement email, two referee reports on Sydney''s forms, transcripts plus an English translation, proof of English, CV, passport biodata, and the scholarship form in the same application. Pay A$150. First GIS / remote-sensing contact who lists research supervision: Eleanor Bruce (Geosciences).',
    'watch_outs', 'Bachelor with first or second-class honours, or an equivalent with enough research. Do not apply for the PhD on the bachelor alone. Coursework fee cuts are not this award.',
    'last_checked', '13 Nov 2026'
  )
from public.catalogues c
where c.slug = 'australia' and c.owner_user_id is null
  and not exists (
    select 1 from public.programmes p
    where p.catalogue_id = c.id and p.slug = 'sydney-mphil-science'
  );

update public.programmes p
set
  acronym = 'USYD-MPHIL',
  name = 'Master of Philosophy (Science)',
  official_title = 'Master of Philosophy (Science) — University of Sydney',
  coordinator = 'University of Sydney — Faculty of Science',
  consortium = 'University of Sydney — Faculty of Science',
  countries = array['Australia'],
  duration = 'Up to 2 years full time',
  language = 'English',
  website = 'https://www.sydney.edu.au/courses/courses/pr/master-of-philosophy-science0.html',
  apply_url = 'https://www.sydney.edu.au/study/applying/how-to-apply/postgraduate-research.html',
  degree_level = 'masters',
  priority = 'A',
  fit_notes = 'Research master''s, not a PhD. Pitch is GIS and remote sensing. RTP stipend includes the tuition offset; the university stipend (USYDIS) is the same package if RTP places are full. Do not lodge until a supervisor has agreed.',
  extra = jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'RTP stipend',
    'work_years_required', false,
    'source', 'Sydney / Monash / ANU RTP pages, 13 Nov 2026',
    'apply', 'YES for Research Periods 3 and 4, 2027, only after a supervisor agrees. The supervisor email is not the application. One A$150 fee covers applications for a year and is not refunded.',
    'target_start', 'Research Periods 3 and 4, 2027',
    'opens_text', 'No separate published open date. Write the proposal, then email a supervisor, then lodge.',
    'deadline_text', '18 December 2026. Outcomes from 26 February 2027. Sydney''s estimate for offshore applicants is 18 May 2027.',
    'tuition_text', 'RTP, or USYDIS if RTP places are full: full tuition, living allowance A$44,293 a year, plus relocation and thesis allowances. On a research master''s the stipend runs for up to two years.',
    'self_funded_text', 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
    'scholarships_text', 'Australian Government Research Training Program (international). The tuition offset is awarded with the stipend. Scholarship page: sydney.edu.au/scholarships/australian-government-research-training-program/rtp-international.html',
    'prepare', 'Proposal first (Faculty of Science: up to 2,000 words), then email a supervisor with background, the topic, and the fit, attaching a CV, transcripts, and that proposal. After they agree: final proposal, the agreement email, two referee reports on Sydney''s forms, transcripts plus an English translation, proof of English, CV, passport biodata, and the scholarship form in the same application. Pay A$150. First GIS / remote-sensing contact who lists research supervision: Eleanor Bruce (Geosciences).',
    'watch_outs', 'Bachelor with first or second-class honours, or an equivalent with enough research. Do not apply for the PhD on the bachelor alone. Coursework fee cuts are not this award.',
    'last_checked', '13 Nov 2026'
  )
from public.catalogues c
where c.slug = 'australia' and c.owner_user_id is null
  and p.catalogue_id = c.id and p.slug = 'sydney-mphil-science';

insert into public.programme_cycles (
  programme_id, label, starts_on, application_opens_on, scholarship_deadline,
  self_funded_deadline, date_status, scholarships_available, extra_dates
)
select
  p.id,
  'Research Periods 3 and 4, 2027',
  null,
  null,
  '2026-12-18',
  null,
  'confirmed',
  true,
  jsonb_build_object(
    'opens_text', 'No separate published open date. Write the proposal, then email a supervisor, then lodge.',
    'deadline_text', '18 December 2026. Outcomes from 26 February 2027. Sydney''s estimate for offshore applicants is 18 May 2027.',
    'self_funded_text', 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
    'target_start', 'Research Periods 3 and 4, 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where c.slug = 'australia' and c.owner_user_id is null and p.slug = 'sydney-mphil-science'
  and not exists (select 1 from public.programme_cycles cy where cy.programme_id = p.id);

update public.programme_cycles cy
set
  label = 'Research Periods 3 and 4, 2027',
  starts_on = null,
  application_opens_on = null,
  scholarship_deadline = '2026-12-18',
  self_funded_deadline = null,
  date_status = 'confirmed',
  scholarships_available = true,
  extra_dates = jsonb_build_object(
    'opens_text', 'No separate published open date. Write the proposal, then email a supervisor, then lodge.',
    'deadline_text', '18 December 2026. Outcomes from 26 February 2027. Sydney''s estimate for offshore applicants is 18 May 2027.',
    'self_funded_text', 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
    'target_start', 'Research Periods 3 and 4, 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where cy.programme_id = p.id
  and c.slug = 'australia' and c.owner_user_id is null and p.slug = 'sydney-mphil-science';

-- Monash
insert into public.programmes (
  catalogue_id, slug, acronym, name, official_title, coordinator, consortium,
  countries, duration, language, website, apply_url, degree_level, priority, fit_notes, extra
)
select
  c.id,
  'monash-mres-eae',
  'MONASH-MRES',
  'Master''s by Research',
  'Master''s by Research — School of Earth, Atmosphere and Environment',
  'Monash University — School of Earth, Atmosphere and Environment',
  'Monash University — School of Earth, Atmosphere and Environment',
  array['Australia'],
  'Up to 2 years full time',
  'English',
  'https://www.monash.edu/graduate-research/study/apply',
  'https://www.monash.edu/graduate-research/study/apply',
  'masters',
  'A',
  'Research master''s in earth, atmosphere, and environment: GIS, remote sensing, earth observation, spatial data science. Not the coursework Master of Geographical Information Science and Technology (S6007).',
  jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'RTP stipend',
    'work_years_required', false,
    'source', 'Sydney / Monash / ANU RTP pages, 13 Nov 2026',
    'apply', 'YES — International Round 1. One application per round. Name the faculty, the research degree, and the supervisor before submitting. No application fee on the graduate research page.',
    'target_start', 'July–December 2027',
    'opens_text', 'No separate published open date. A supervisor has to be named on the form.',
    'deadline_text', '28 February 2027 (International Round 1).',
    'tuition_text', 'RTP stipend packaged with a tuition scholarship for international students. Living allowance A$41,100 a year. On a research master''s the stipend runs for up to two years.',
    'self_funded_text', 'Not pursued without the stipend. The coursework GIS master''s (S6007) does not pay a living allowance.',
    'scholarships_text', 'RTP international stipend plus tuition. Assessed with the graduate research application.',
    'prepare', 'Faculty, research degree, and supervisor named before submit. Proof of English and transcripts as Monash graduate research requires.',
    'watch_outs', 'Do not file S6007. A coursework fee cut is not this card.',
    'last_checked', '13 Nov 2026'
  )
from public.catalogues c
where c.slug = 'australia' and c.owner_user_id is null
  and not exists (
    select 1 from public.programmes p
    where p.catalogue_id = c.id and p.slug = 'monash-mres-eae'
  );

update public.programmes p
set
  acronym = 'MONASH-MRES',
  name = 'Master''s by Research',
  official_title = 'Master''s by Research — School of Earth, Atmosphere and Environment',
  coordinator = 'Monash University — School of Earth, Atmosphere and Environment',
  consortium = 'Monash University — School of Earth, Atmosphere and Environment',
  countries = array['Australia'],
  duration = 'Up to 2 years full time',
  language = 'English',
  website = 'https://www.monash.edu/graduate-research/study/apply',
  apply_url = 'https://www.monash.edu/graduate-research/study/apply',
  degree_level = 'masters',
  priority = 'A',
  fit_notes = 'Research master''s in earth, atmosphere, and environment: GIS, remote sensing, earth observation, spatial data science. Not the coursework Master of Geographical Information Science and Technology (S6007).',
  extra = jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'RTP stipend',
    'work_years_required', false,
    'source', 'Sydney / Monash / ANU RTP pages, 13 Nov 2026',
    'apply', 'YES — International Round 1. One application per round. Name the faculty, the research degree, and the supervisor before submitting. No application fee on the graduate research page.',
    'target_start', 'July–December 2027',
    'opens_text', 'No separate published open date. A supervisor has to be named on the form.',
    'deadline_text', '28 February 2027 (International Round 1).',
    'tuition_text', 'RTP stipend packaged with a tuition scholarship for international students. Living allowance A$41,100 a year. On a research master''s the stipend runs for up to two years.',
    'self_funded_text', 'Not pursued without the stipend. The coursework GIS master''s (S6007) does not pay a living allowance.',
    'scholarships_text', 'RTP international stipend plus tuition. Assessed with the graduate research application.',
    'prepare', 'Faculty, research degree, and supervisor named before submit. Proof of English and transcripts as Monash graduate research requires.',
    'watch_outs', 'Do not file S6007. A coursework fee cut is not this card.',
    'last_checked', '13 Nov 2026'
  )
from public.catalogues c
where c.slug = 'australia' and c.owner_user_id is null
  and p.catalogue_id = c.id and p.slug = 'monash-mres-eae';

insert into public.programme_cycles (
  programme_id, label, starts_on, application_opens_on, scholarship_deadline,
  self_funded_deadline, date_status, scholarships_available, extra_dates
)
select
  p.id,
  'International Round 1, 2027',
  '2027-07-01',
  null,
  '2027-02-28',
  null,
  'confirmed',
  true,
  jsonb_build_object(
    'opens_text', 'No separate published open date. A supervisor has to be named on the form.',
    'deadline_text', '28 February 2027 (International Round 1).',
    'self_funded_text', 'Not pursued without the stipend. The coursework GIS master''s (S6007) does not pay a living allowance.',
    'target_start', 'July–December 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where c.slug = 'australia' and c.owner_user_id is null and p.slug = 'monash-mres-eae'
  and not exists (select 1 from public.programme_cycles cy where cy.programme_id = p.id);

update public.programme_cycles cy
set
  label = 'International Round 1, 2027',
  starts_on = '2027-07-01',
  application_opens_on = null,
  scholarship_deadline = '2027-02-28',
  self_funded_deadline = null,
  date_status = 'confirmed',
  scholarships_available = true,
  extra_dates = jsonb_build_object(
    'opens_text', 'No separate published open date. A supervisor has to be named on the form.',
    'deadline_text', '28 February 2027 (International Round 1).',
    'self_funded_text', 'Not pursued without the stipend. The coursework GIS master''s (S6007) does not pay a living allowance.',
    'target_start', 'July–December 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where cy.programme_id = p.id
  and c.slug = 'australia' and c.owner_user_id is null and p.slug = 'monash-mres-eae';

-- ANU
insert into public.programmes (
  catalogue_id, slug, acronym, name, official_title, coordinator, consortium,
  countries, duration, language, website, apply_url, degree_level, priority, fit_notes, extra
)
select
  c.id,
  'anu-mphil-fenner',
  'ANU-MPHIL',
  'Master of Philosophy (Fenner)',
  'Master of Philosophy — Fenner School (8065XMPHIL)',
  'Australian National University — Fenner School of Environment and Society',
  'Australian National University — Fenner School of Environment and Society',
  array['Australia'],
  'Up to 2 years full time',
  'English',
  'https://programsandcourses.anu.edu.au/program/8065xmphil',
  'https://fennerschool.anu.edu.au/study/phd-mphil',
  'masters',
  'A',
  'Research master''s in environment, geography, water, and spatial analysis. Not a GIS-technology degree. RTP is assessed automatically with the admission application. No HDR application fee.',
  jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'RTP stipend',
    'work_years_required', false,
    'source', 'Sydney / Monash / ANU RTP pages, 13 Nov 2026',
    'apply', 'YES — Round 2. Lodge about two to three weeks before the deadline so referee reports arrive in time. No separate scholarship form.',
    'target_start', 'By the end of August 2027',
    'opens_text', 'No separate published open date. Referees are emailed from the application.',
    'deadline_text', '15 April 2027 (Round 2). Referee reports must arrive before this date, so lodge about two to three weeks earlier.',
    'tuition_text', 'RTP stipend with the fee offset. Living allowance A$40,475 a year. On a research master''s the stipend runs for up to two years.',
    'self_funded_text', 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
    'scholarships_text', 'RTP is assessed automatically with the HDR admission application. No application fee for an HDR application.',
    'prepare', 'MPhil admission asks for a bachelor at distinction level, or an equivalent, or a mix of qualifications and experience. The PhD asks for honours — this card is the MPhil. Line up two referees before you lodge.',
    'watch_outs', 'A late lodge can miss the scholarship because the referees have not replied yet.',
    'last_checked', '13 Nov 2026'
  )
from public.catalogues c
where c.slug = 'australia' and c.owner_user_id is null
  and not exists (
    select 1 from public.programmes p
    where p.catalogue_id = c.id and p.slug = 'anu-mphil-fenner'
  );

update public.programmes p
set
  acronym = 'ANU-MPHIL',
  name = 'Master of Philosophy (Fenner)',
  official_title = 'Master of Philosophy — Fenner School (8065XMPHIL)',
  coordinator = 'Australian National University — Fenner School of Environment and Society',
  consortium = 'Australian National University — Fenner School of Environment and Society',
  countries = array['Australia'],
  duration = 'Up to 2 years full time',
  language = 'English',
  website = 'https://programsandcourses.anu.edu.au/program/8065xmphil',
  apply_url = 'https://fennerschool.anu.edu.au/study/phd-mphil',
  degree_level = 'masters',
  priority = 'A',
  fit_notes = 'Research master''s in environment, geography, water, and spatial analysis. Not a GIS-technology degree. RTP is assessed automatically with the admission application. No HDR application fee.',
  extra = jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'RTP stipend',
    'work_years_required', false,
    'source', 'Sydney / Monash / ANU RTP pages, 13 Nov 2026',
    'apply', 'YES — Round 2. Lodge about two to three weeks before the deadline so referee reports arrive in time. No separate scholarship form.',
    'target_start', 'By the end of August 2027',
    'opens_text', 'No separate published open date. Referees are emailed from the application.',
    'deadline_text', '15 April 2027 (Round 2). Referee reports must arrive before this date, so lodge about two to three weeks earlier.',
    'tuition_text', 'RTP stipend with the fee offset. Living allowance A$40,475 a year. On a research master''s the stipend runs for up to two years.',
    'self_funded_text', 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
    'scholarships_text', 'RTP is assessed automatically with the HDR admission application. No application fee for an HDR application.',
    'prepare', 'MPhil admission asks for a bachelor at distinction level, or an equivalent, or a mix of qualifications and experience. The PhD asks for honours — this card is the MPhil. Line up two referees before you lodge.',
    'watch_outs', 'A late lodge can miss the scholarship because the referees have not replied yet.',
    'last_checked', '13 Nov 2026'
  )
from public.catalogues c
where c.slug = 'australia' and c.owner_user_id is null
  and p.catalogue_id = c.id and p.slug = 'anu-mphil-fenner';

insert into public.programme_cycles (
  programme_id, label, starts_on, application_opens_on, scholarship_deadline,
  self_funded_deadline, date_status, scholarships_available, extra_dates
)
select
  p.id,
  'Round 2, 2027',
  '2027-08-31',
  null,
  '2027-04-15',
  null,
  'confirmed',
  true,
  jsonb_build_object(
    'opens_text', 'No separate published open date. Referees are emailed from the application.',
    'deadline_text', '15 April 2027 (Round 2). Referee reports must arrive before this date, so lodge about two to three weeks earlier.',
    'self_funded_text', 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
    'target_start', 'By the end of August 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where c.slug = 'australia' and c.owner_user_id is null and p.slug = 'anu-mphil-fenner'
  and not exists (select 1 from public.programme_cycles cy where cy.programme_id = p.id);

update public.programme_cycles cy
set
  label = 'Round 2, 2027',
  starts_on = '2027-08-31',
  application_opens_on = null,
  scholarship_deadline = '2027-04-15',
  self_funded_deadline = null,
  date_status = 'confirmed',
  scholarships_available = true,
  extra_dates = jsonb_build_object(
    'opens_text', 'No separate published open date. Referees are emailed from the application.',
    'deadline_text', '15 April 2027 (Round 2). Referee reports must arrive before this date, so lodge about two to three weeks earlier.',
    'self_funded_text', 'Not pursued without the stipend. Admission alone leaves tuition and living unpaid.',
    'target_start', 'By the end of August 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where cy.programme_id = p.id
  and c.slug = 'australia' and c.owner_user_id is null and p.slug = 'anu-mphil-fenner';

commit;
