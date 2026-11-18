-- Drop scholarship-only cards. Degree programmes stay.
-- Tracker rows are kept and unlinked from the deleted card.
-- Safe to re-run. Run the whole script.

begin;

update public.applications
set programme_id = null,
    cycle_id = null
where programme_id in (
  select id from public.programmes
  where slug in (
    'nl-scholarship',
    'itc-excellence',
    'wur-excellence',
    'eric-bleumink',
    'okp-closed',
    'hk-hkpfs',
    'nawa-banach',
    'oead-busek',
    'aai-one-world',
    'oead-ernst-mach',
    'finland-tuition-waivers',
    'dk-government-scholarship'
  )
);

delete from public.programme_cycles
where programme_id in (
  select id from public.programmes
  where slug in (
    'nl-scholarship',
    'itc-excellence',
    'wur-excellence',
    'eric-bleumink',
    'okp-closed',
    'hk-hkpfs',
    'nawa-banach',
    'oead-busek',
    'aai-one-world',
    'oead-ernst-mach',
    'finland-tuition-waivers',
    'dk-government-scholarship'
  )
);

delete from public.programmes
where slug in (
  'nl-scholarship',
  'itc-excellence',
  'wur-excellence',
  'eric-bleumink',
  'okp-closed',
  'hk-hkpfs',
  'nawa-banach',
  'oead-busek',
  'aai-one-world',
  'oead-ernst-mach',
  'finland-tuition-waivers',
  'dk-government-scholarship'
);

commit;
