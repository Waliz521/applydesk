import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/applications', label: 'Tracker' },
  { to: '/catalogue', label: 'Catalogues' },
  { to: '/documents', label: 'Documents' },
]

export function Layout() {
  const { profile, user, signOut } = useAuth()
  const name = profile?.full_name || profile?.display_name || user?.email || 'You'

  return (
    <div className="min-h-svh bg-paper">
      <div className="flex min-h-svh">
        <aside className="hidden w-60 shrink-0 bg-navy text-white md:flex md:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">ApplyDesk</p>
            <h1 className="mt-1 text-lg font-semibold">Scholarship HQ</h1>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-sky text-white' : 'text-slate-200 hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <p className="truncate text-sm font-medium">{name}</p>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-2 text-sm text-slate-300 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3 md:hidden">
            <span className="font-semibold text-navy">ApplyDesk</span>
            <button type="button" onClick={() => void signOut()} className="text-sm text-muted">
              Sign out
            </button>
          </header>
          <nav className="flex gap-1 overflow-x-auto border-b border-line bg-white px-2 py-2 md:hidden">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
                    isActive ? 'bg-navy text-white' : 'text-slate-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
