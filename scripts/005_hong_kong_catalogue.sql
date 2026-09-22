-- Add Hong Kong catalogue if missing (safe to re-run).
-- The app also writes this on first dashboard load via seedHongKongCatalogue().

insert into public.catalogues (owner_user_id, slug, name, description, is_system)
select *
from (
  values (
    null::uuid,
    'hong-kong',
    'Hong Kong',
    'HKU Geography and PolyU LSGS research degrees (MPhil/PhD) plus HKPFS. Taught MSc GeoDS is self-funded (~HK$250k). Supervisor email before RPG apply. See hong-kong-universities.md in the repo for planning notes.',
    true
  )
) as v(owner_user_id, slug, name, description, is_system)
where not exists (
  select 1 from public.catalogues c
  where c.slug = v.slug and c.owner_user_id is null
);
