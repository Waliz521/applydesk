# ApplyDesk

Personal scholarship dashboard. Track Erasmus Mundus, DAAD, Chevening, and other funding families separately from the applications you are actually working on. Catalogues hold programmes and yearly dates. The tracker is your own shortlist. Documents (IELTS, transcripts, letters) are stored once and reused.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS** v4
- **React Router**
- **Supabase** (Auth, Postgres, Row Level Security)
- Hosted as a static SPA (`dist/`)

Required env (see `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
