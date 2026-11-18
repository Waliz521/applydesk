-- Keep only the programmes in the application notes.
-- Tracker rows stay and are unlinked. Safe to re-run.
-- Run this after the app build that adds Groningen EIP and CUHK is live.

begin;

update public.applications
set programme_id = null,
    cycle_id = null
where programme_id in (
  select id from public.programmes
  where slug in (
    'itc-mgeo',
    'uu-gima',
    'tud-geomatics',
    'hku-geog-rpg',
    'hku-geods-msc',
    'tuw-geodesy-geoinformation',
    'ruc-environmental-science',
    'aarhus-geoscience',
    'agh-remote-sensing-geo-informatics',
    'uwm-geodesy-geoinformatics',
    'pwr-geodesy-cartography',
    'imt-pm3e',
    'aalto-geoinformatics',
    'helsinki-geography',
    'geotech',
    'sufonama',
    'msc-ef'
  )
  or catalogue_id in (select id from public.catalogues where slug = 'daad')
);

delete from public.programme_cycles
where programme_id in (
  select id from public.programmes
  where slug in (
    'itc-mgeo',
    'uu-gima',
    'tud-geomatics',
    'hku-geog-rpg',
    'hku-geods-msc',
    'tuw-geodesy-geoinformation',
    'ruc-environmental-science',
    'aarhus-geoscience',
    'agh-remote-sensing-geo-informatics',
    'uwm-geodesy-geoinformatics',
    'pwr-geodesy-cartography',
    'imt-pm3e',
    'aalto-geoinformatics',
    'helsinki-geography',
    'geotech',
    'sufonama',
    'msc-ef'
  )
  or catalogue_id in (select id from public.catalogues where slug = 'daad')
);

delete from public.programmes
where slug in (
  'itc-mgeo',
  'uu-gima',
  'tud-geomatics',
  'hku-geog-rpg',
  'hku-geods-msc',
  'tuw-geodesy-geoinformation',
  'ruc-environmental-science',
  'aarhus-geoscience',
  'agh-remote-sensing-geo-informatics',
  'uwm-geodesy-geoinformatics',
  'pwr-geodesy-cartography',
  'imt-pm3e',
  'aalto-geoinformatics',
  'helsinki-geography',
  'geotech',
  'sufonama',
  'msc-ef'
)
or catalogue_id in (select id from public.catalogues where slug = 'daad');

commit;
