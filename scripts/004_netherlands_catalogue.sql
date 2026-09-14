-- Add Netherlands catalogue if missing (safe to re-run).
-- The app also writes this on first dashboard load via seedNetherlandsCatalogue().

insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'netherlands',
    'Netherlands',
    'Dutch GIS / geoinformation master’s (ITC, Wageningen, GIMA, TU Delft) plus the scholarships still open to Pakistan. Orange Knowledge is closed. What remains is partial: NL Scholarship, ITC Excellence, Wageningen Excellence. GEM is in the Erasmus Mundus catalogue.',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);
