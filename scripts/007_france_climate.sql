-- France Excellence Pakistan – Climate Change (2027).
-- Adds IMT PM3E and Avignon MAFEN to the France catalogue.
-- Safe to run again: it updates the same slugs instead of inserting a second copy.
-- Run the whole script in one go.

begin;

update public.catalogues
set description = 'Études en France master’s. France Excellence Pakistan Climate Change is IMT PM3E and Avignon MAFEN, cart by 18 November 2026. Grenoble IMAGERS, Nantes Earth and Planetary Sciences, and Aix-Marseille IMG are not on that scholarship.'
where slug = 'france'
  and owner_user_id is null;

insert into public.programmes (
  catalogue_id, slug, acronym, name, official_title, coordinator, consortium,
  countries, duration, language, website, apply_url, degree_level, priority, fit_notes, extra
)
select
  c.id,
  'imt-pm3e',
  'PM3E',
  'Project management for environmental and energy engineering',
  'MSc Process and Bioprocess Engineering — track Project Management for Environmental and Energy Engineering',
  'IMT Atlantique — Nantes',
  'IMT Atlantique — Nantes',
  array['France'],
  '2 years (M1, Bac+4)',
  'English',
  'https://www.imt-atlantique.fr/en/study/masters/msc/pbpe-pm3e',
  'https://www.imt-atlantique.fr/en/study/masters/msc/pbpe-pm3e/apply',
  'masters',
  'A',
  'On the 2027 France Excellence Pakistan Climate Change list. Fully English, Nantes, September start. The embassy award needs both the Études en France cart and the IMT application before 18 November 2026. M1 asks for a science or engineering bachelor, preferably mechanical, chemical, energy, or environmental engineering, with mathematics, chemistry, physics, and fluids. A GIS bachelor is outside that list. IELTS 6.5 is the floor they print.',
  jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'France Excellence',
    'work_years_required', false,
    'source', 'Campus France Pakistan climate call and IMT PM3E, 7 Nov 2026',
    'apply', 'OPEN. Études en France (Bac+4) and the IMT form. Campus France says only files on both platforms are eligible for this scholarship. The IMT page itself stays open until 30 April 2027, which is too late for the embassy award.',
    'target_start', 'September 2027',
    'opens_text', 'Campus France Pakistan opened the 2027 candidature on 1 October 2026. The IMT September 2027 round opened in October 2026.',
    'deadline_text', 'France Excellence Pakistan Climate Change closes 18 November 2026. The IMT selection form closes 30 April 2027.',
    'tuition_text', '€9,000 a year on the IMT page. The climate award covers tuition if you are selected.',
    'self_funded_text', 'Without the embassy award the fee is €9,000 a year. The IMT page does not offer an Eiffel nomination on this MSc. The school form can still be filed until 30 April 2027.',
    'scholarships_text', 'France Excellence Pakistan – Climate Change, the embassy award for this programme only. It covers tuition, a monthly living allowance, one return ticket, social security, French classes before departure, and reimbursement of the Études en France fee after the award. Pakistani nationality, age 28 or under at application, a four-year HEC bachelor with CGPA at least 3.0/4, and no more than two years since the bachelor. File the Études en France cart by 18 November 2026. IMG and Grenoble are not on this list.',
    'prepare', 'CV, motivation letter on environment and energy projects, transcripts, bachelor certificate, IELTS, TOEFL, TOEIC, Cambridge, or Duolingo, and reference letters. IELTS 6.5, TOEFL iBT 80, TOEIC 750, or Duolingo 120. French is not required.',
    'watch_outs', 'Preferred backgrounds are mechanical, chemical, energy, environmental, civil, or electrical engineering. A GIS bachelor does not meet that list. Two years, with a 5- to 6-month internship. Confirmed on the Campus France Pakistan climate page and the IMT apply page, 7 November 2026.',
    'last_checked', '7 Nov 2026'
  )
from public.catalogues c
where c.slug = 'france'
  and c.owner_user_id is null
  and not exists (
    select 1 from public.programmes p
    where p.catalogue_id = c.id and p.slug = 'imt-pm3e'
  );

update public.programmes p
set
  acronym = 'PM3E',
  name = 'Project management for environmental and energy engineering',
  official_title = 'MSc Process and Bioprocess Engineering — track Project Management for Environmental and Energy Engineering',
  coordinator = 'IMT Atlantique — Nantes',
  consortium = 'IMT Atlantique — Nantes',
  countries = array['France'],
  duration = '2 years (M1, Bac+4)',
  language = 'English',
  website = 'https://www.imt-atlantique.fr/en/study/masters/msc/pbpe-pm3e',
  apply_url = 'https://www.imt-atlantique.fr/en/study/masters/msc/pbpe-pm3e/apply',
  degree_level = 'masters',
  priority = 'A',
  fit_notes = 'On the 2027 France Excellence Pakistan Climate Change list. Fully English, Nantes, September start. The embassy award needs both the Études en France cart and the IMT application before 18 November 2026. M1 asks for a science or engineering bachelor, preferably mechanical, chemical, energy, or environmental engineering, with mathematics, chemistry, physics, and fluids. A GIS bachelor is outside that list. IELTS 6.5 is the floor they print.',
  extra = jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'France Excellence',
    'work_years_required', false,
    'source', 'Campus France Pakistan climate call and IMT PM3E, 7 Nov 2026',
    'apply', 'OPEN. Études en France (Bac+4) and the IMT form. Campus France says only files on both platforms are eligible for this scholarship. The IMT page itself stays open until 30 April 2027, which is too late for the embassy award.',
    'target_start', 'September 2027',
    'opens_text', 'Campus France Pakistan opened the 2027 candidature on 1 October 2026. The IMT September 2027 round opened in October 2026.',
    'deadline_text', 'France Excellence Pakistan Climate Change closes 18 November 2026. The IMT selection form closes 30 April 2027.',
    'tuition_text', '€9,000 a year on the IMT page. The climate award covers tuition if you are selected.',
    'self_funded_text', 'Without the embassy award the fee is €9,000 a year. The IMT page does not offer an Eiffel nomination on this MSc. The school form can still be filed until 30 April 2027.',
    'scholarships_text', 'France Excellence Pakistan – Climate Change, the embassy award for this programme only. It covers tuition, a monthly living allowance, one return ticket, social security, French classes before departure, and reimbursement of the Études en France fee after the award. Pakistani nationality, age 28 or under at application, a four-year HEC bachelor with CGPA at least 3.0/4, and no more than two years since the bachelor. File the Études en France cart by 18 November 2026. IMG and Grenoble are not on this list.',
    'prepare', 'CV, motivation letter on environment and energy projects, transcripts, bachelor certificate, IELTS, TOEFL, TOEIC, Cambridge, or Duolingo, and reference letters. IELTS 6.5, TOEFL iBT 80, TOEIC 750, or Duolingo 120. French is not required.',
    'watch_outs', 'Preferred backgrounds are mechanical, chemical, energy, environmental, civil, or electrical engineering. A GIS bachelor does not meet that list. Two years, with a 5- to 6-month internship. Confirmed on the Campus France Pakistan climate page and the IMT apply page, 7 November 2026.',
    'last_checked', '7 Nov 2026'
  )
from public.catalogues c
where c.slug = 'france'
  and c.owner_user_id is null
  and p.catalogue_id = c.id
  and p.slug = 'imt-pm3e';

insert into public.programme_cycles (
  programme_id, label, starts_on, application_opens_on, scholarship_deadline,
  self_funded_deadline, date_status, scholarships_available, extra_dates
)
select
  p.id,
  'Sep 2027 · France Excellence',
  '2027-09-01',
  '2026-10-01',
  '2026-11-18',
  '2027-04-30',
  'confirmed',
  true,
  jsonb_build_object(
    'opens_text', 'Campus France Pakistan opened the 2027 candidature on 1 October 2026. The IMT September 2027 round opened in October 2026.',
    'deadline_text', 'France Excellence Pakistan Climate Change closes 18 November 2026. The IMT selection form closes 30 April 2027.',
    'self_funded_text', 'Without the embassy award the fee is €9,000 a year. The IMT page does not offer an Eiffel nomination on this MSc. The school form can still be filed until 30 April 2027.',
    'target_start', 'September 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where c.slug = 'france'
  and c.owner_user_id is null
  and p.slug = 'imt-pm3e'
  and not exists (
    select 1 from public.programme_cycles cy where cy.programme_id = p.id
  );

update public.programme_cycles cy
set
  label = 'Sep 2027 · France Excellence',
  starts_on = '2027-09-01',
  application_opens_on = '2026-10-01',
  scholarship_deadline = '2026-11-18',
  self_funded_deadline = '2027-04-30',
  date_status = 'confirmed',
  scholarships_available = true,
  extra_dates = jsonb_build_object(
    'opens_text', 'Campus France Pakistan opened the 2027 candidature on 1 October 2026. The IMT September 2027 round opened in October 2026.',
    'deadline_text', 'France Excellence Pakistan Climate Change closes 18 November 2026. The IMT selection form closes 30 April 2027.',
    'self_funded_text', 'Without the embassy award the fee is €9,000 a year. The IMT page does not offer an Eiffel nomination on this MSc. The school form can still be filed until 30 April 2027.',
    'target_start', 'September 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where cy.programme_id = p.id
  and c.slug = 'france'
  and c.owner_user_id is null
  and p.slug = 'imt-pm3e';

insert into public.programmes (
  catalogue_id, slug, acronym, name, official_title, coordinator, consortium,
  countries, duration, language, website, apply_url, degree_level, priority, fit_notes, extra
)
select
  c.id,
  'avignon-mafen',
  'MAFEN',
  'Agriculture, food, environment and nutrition',
  'Master in Agriculture, Food Sciences, Environment and Nutrition',
  'Avignon Université — Implanteus Graduate School',
  'Avignon Université — Implanteus Graduate School',
  array['France'],
  '2 years (M1, Bac+4)',
  'English',
  'https://implanteus.univ-avignon.fr/en/master-in-agriculture-food-sciences-environment-and-nutrition-mafen/',
  'https://etudesenfrance.diplomatie.gouv.fr/mon-espace-etudiant',
  'masters',
  'A',
  'On the 2027 France Excellence Pakistan Climate Change list. Research master, taught in English, at Avignon. Campus France says apply only through Études en France. The school page admits an M1 student with a bachelor in chemistry or biology. A GIS bachelor is outside that list. The jury may check English in an interview.',
  jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'France Excellence',
    'work_years_required', false,
    'source', 'Campus France Pakistan climate call and Avignon MAFEN, 7 Nov 2026',
    'apply', 'OPEN. Études en France only (Bac+4). There is no second university form. Choose the Agronomy option or the Food and Health Sciences option in the motivation letter.',
    'target_start', 'September 2027',
    'opens_text', 'Campus France Pakistan opened the 2027 candidature on 1 October 2026.',
    'deadline_text', 'France Excellence Pakistan Climate Change, and the Études en France cart, close on 18 November 2026. The file fee is due by 30 November 2026.',
    'tuition_text', 'Avignon says it covers most of the €3,879 non-EU fee. The student rate printed for 2025–26 is €254 a year plus CVEC €105. They say 2026–27 may change slightly. The climate award covers tuition if you are selected.',
    'self_funded_text', 'There is no separate self-funded deadline. The only application route is Études en France, which locks on 18 November 2026.',
    'scholarships_text', 'France Excellence Pakistan – Climate Change, the embassy award for this programme only. It covers tuition, a monthly living allowance, one return ticket, social security, French classes before departure, and reimbursement of the Études en France fee after the award. Pakistani nationality, age 28 or under at application, a four-year HEC bachelor with CGPA at least 3.0/4, and no more than two years since the bachelor. File the Études en France cart by 18 November 2026. IMG and Grenoble are not on this list.',
    'prepare', 'Bachelor transcripts, CV, motivation letter, and a document showing English. The school asks for chemistry or biology. HEC-attested degree and transcript, and IBCC matric and intermediate, for the Pakistan file.',
    'watch_outs', 'M1 entry on the Avignon page is a bachelor in chemistry or biology, with fundamentals in chemistry, biochemistry, or biology. A GIS bachelor does not meet that wording. Two research internships, about 10 months in total. Confirmed on the Campus France Pakistan climate page and the Implanteus page, 7 November 2026.',
    'last_checked', '7 Nov 2026'
  )
from public.catalogues c
where c.slug = 'france'
  and c.owner_user_id is null
  and not exists (
    select 1 from public.programmes p
    where p.catalogue_id = c.id and p.slug = 'avignon-mafen'
  );

update public.programmes p
set
  acronym = 'MAFEN',
  name = 'Agriculture, food, environment and nutrition',
  official_title = 'Master in Agriculture, Food Sciences, Environment and Nutrition',
  coordinator = 'Avignon Université — Implanteus Graduate School',
  consortium = 'Avignon Université — Implanteus Graduate School',
  countries = array['France'],
  duration = '2 years (M1, Bac+4)',
  language = 'English',
  website = 'https://implanteus.univ-avignon.fr/en/master-in-agriculture-food-sciences-environment-and-nutrition-mafen/',
  apply_url = 'https://etudesenfrance.diplomatie.gouv.fr/mon-espace-etudiant',
  degree_level = 'masters',
  priority = 'A',
  fit_notes = 'On the 2027 France Excellence Pakistan Climate Change list. Research master, taught in English, at Avignon. Campus France says apply only through Études en France. The school page admits an M1 student with a bachelor in chemistry or biology. A GIS bachelor is outside that list. The jury may check English in an interview.',
  extra = jsonb_build_object(
    'funding_scheme', 'full',
    'funding_label', 'France Excellence',
    'work_years_required', false,
    'source', 'Campus France Pakistan climate call and Avignon MAFEN, 7 Nov 2026',
    'apply', 'OPEN. Études en France only (Bac+4). There is no second university form. Choose the Agronomy option or the Food and Health Sciences option in the motivation letter.',
    'target_start', 'September 2027',
    'opens_text', 'Campus France Pakistan opened the 2027 candidature on 1 October 2026.',
    'deadline_text', 'France Excellence Pakistan Climate Change, and the Études en France cart, close on 18 November 2026. The file fee is due by 30 November 2026.',
    'tuition_text', 'Avignon says it covers most of the €3,879 non-EU fee. The student rate printed for 2025–26 is €254 a year plus CVEC €105. They say 2026–27 may change slightly. The climate award covers tuition if you are selected.',
    'self_funded_text', 'There is no separate self-funded deadline. The only application route is Études en France, which locks on 18 November 2026.',
    'scholarships_text', 'France Excellence Pakistan – Climate Change, the embassy award for this programme only. It covers tuition, a monthly living allowance, one return ticket, social security, French classes before departure, and reimbursement of the Études en France fee after the award. Pakistani nationality, age 28 or under at application, a four-year HEC bachelor with CGPA at least 3.0/4, and no more than two years since the bachelor. File the Études en France cart by 18 November 2026. IMG and Grenoble are not on this list.',
    'prepare', 'Bachelor transcripts, CV, motivation letter, and a document showing English. The school asks for chemistry or biology. HEC-attested degree and transcript, and IBCC matric and intermediate, for the Pakistan file.',
    'watch_outs', 'M1 entry on the Avignon page is a bachelor in chemistry or biology, with fundamentals in chemistry, biochemistry, or biology. A GIS bachelor does not meet that wording. Two research internships, about 10 months in total. Confirmed on the Campus France Pakistan climate page and the Implanteus page, 7 November 2026.',
    'last_checked', '7 Nov 2026'
  )
from public.catalogues c
where c.slug = 'france'
  and c.owner_user_id is null
  and p.catalogue_id = c.id
  and p.slug = 'avignon-mafen';

insert into public.programme_cycles (
  programme_id, label, starts_on, application_opens_on, scholarship_deadline,
  self_funded_deadline, date_status, scholarships_available, extra_dates
)
select
  p.id,
  'Sep 2027 · France Excellence',
  '2027-09-01',
  '2026-10-01',
  '2026-11-18',
  '2026-11-18',
  'confirmed',
  true,
  jsonb_build_object(
    'opens_text', 'Campus France Pakistan opened the 2027 candidature on 1 October 2026.',
    'deadline_text', 'France Excellence Pakistan Climate Change, and the Études en France cart, close on 18 November 2026. The file fee is due by 30 November 2026.',
    'self_funded_text', 'There is no separate self-funded deadline. The only application route is Études en France, which locks on 18 November 2026.',
    'target_start', 'September 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where c.slug = 'france'
  and c.owner_user_id is null
  and p.slug = 'avignon-mafen'
  and not exists (
    select 1 from public.programme_cycles cy where cy.programme_id = p.id
  );

update public.programme_cycles cy
set
  label = 'Sep 2027 · France Excellence',
  starts_on = '2027-09-01',
  application_opens_on = '2026-10-01',
  scholarship_deadline = '2026-11-18',
  self_funded_deadline = '2026-11-18',
  date_status = 'confirmed',
  scholarships_available = true,
  extra_dates = jsonb_build_object(
    'opens_text', 'Campus France Pakistan opened the 2027 candidature on 1 October 2026.',
    'deadline_text', 'France Excellence Pakistan Climate Change, and the Études en France cart, close on 18 November 2026. The file fee is due by 30 November 2026.',
    'self_funded_text', 'There is no separate self-funded deadline. The only application route is Études en France, which locks on 18 November 2026.',
    'target_start', 'September 2027'
  )
from public.programmes p
join public.catalogues c on c.id = p.catalogue_id
where cy.programme_id = p.id
  and c.slug = 'france'
  and c.owner_user_id is null
  and p.slug = 'avignon-mafen';

commit;
