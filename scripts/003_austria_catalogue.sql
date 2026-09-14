-- Add Austria catalogue if missing (safe to re-run).
-- The app also writes this on first dashboard load via seedAustriaCatalogue().

insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'austria',
    'Austria (self-funded)',
    'Public Austrian GIS / geoinformation master’s in English. Degrees are self-funded (statutory tuition on each card). Austria has no Banach-style full master’s scholarship for Pakistan; Ernst Mach is a short research stay only. Salzburg’s Copernicus Master in Digital Earth (CDE) is in the Erasmus Mundus catalogue.',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);
