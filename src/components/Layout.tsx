import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const STORAGE_KEY = 'applydesk.sidebar.collapsed'

const links = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/applications', label: 'Tracker', icon: 'tracker' },
  { to: '/catalogue', label: 'Catalogues', icon: 'catalogues' },
  { to: '/documents', label: 'Documents', icon: 'documents' },
] as const

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function Icon({ name }: { name: (typeof links)[number]['icon'] | 'out' | 'panel' | 'menu' | 'scholarship' }) {
  const common = {
    viewBox: '0 0 24 24',
    'aria-hidden': true,
    className: 'h-5 w-5 shrink-0',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (name === 'dashboard') {
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    )
  }
  if (name === 'tracker') {
    return (
      <svg {...common}>
        <path d="M9 6.5h11M9 12h11M9 17.5h11" />
        <path d="m3.5 6.5 1.4 1.4 2.2-2.4M3.5 12l1.4 1.4 2.2-2.4M3.5 17.5l1.4 1.4 2.2-2.4" />
      </svg>
    )
  }
  if (name === 'catalogues') {
    return (
      <svg {...common}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  }
  if (name === 'documents') {
    return (
      <svg {...common}>
        <path d="M14 2H6.5A1.5 1.5 0 0 0 5 3.5v17A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </svg>
    )
  }
  if (name === 'out') {
    return (
      <svg {...common}>
        <path d="M9 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3H9" />
        <path d="m16 16 4-4-4-4M20 12H9" />
      </svg>
    )
  }
  if (name === 'menu') {
    return (
      <svg {...common}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    )
  }
  if (name === 'scholarship') {
    return (
      <svg {...common}>
        <path d="m3 10 9-5 9 5-9 5-9-5z" />
        <path d="M7 12.5V17c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5" />
        <path d="M21 10v6" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M9 4v16M14.5 9.5 12 12l2.5 2.5" />
    </svg>
  )
}

export function Layout() {
  const { profile, user, signOut } = useAuth()
  const location = useLocation()
  const name = profile?.full_name || profile?.display_name || user?.email || 'You'
  const initial = name.trim().charAt(0).toUpperCase() || 'Y'
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore private-mode storage failures */
    }
  }, [collapsed])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <div className="min-h-svh bg-paper">
      <div className="flex min-h-svh">
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-ink/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <aside
          id="app-sidebar"
          className={`fixed top-0 left-0 z-40 flex h-svh w-64 flex-col overflow-hidden overscroll-none bg-sidebar text-white transition-[width,transform] duration-200 ease-out motion-reduce:transition-none md:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } ${collapsed ? 'md:w-[4.75rem]' : 'md:w-64'}`}
        >
          <div className={`flex shrink-0 items-center gap-3 border-b border-white/10 px-3 py-4 ${collapsed ? 'md:flex-col md:px-2' : ''}`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
              <Icon name="scholarship" />
            </span>
            <div className={`min-w-0 flex-1 ${collapsed ? 'md:hidden' : ''}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">ApplyDesk</p>
              <h1 className="truncate text-base font-semibold">Scholarship HQ</h1>
            </div>
            <button
              type="button"
              onClick={() => setCollapsed((open) => !open)}
              aria-expanded={!collapsed}
              aria-controls="app-sidebar"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 md:inline-flex"
            >
              <span className={collapsed ? 'rotate-180' : ''}>
                <Icon name="panel" />
              </span>
            </button>
          </div>

          <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden p-3" aria-label="Main">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                title={link.label}
                className={({ isActive }) =>
                  `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    collapsed ? 'md:justify-center md:px-0' : ''
                  } ${
                    isActive
                      ? 'bg-white/10 text-white shadow-[inset_3px_0_0_0_var(--color-gold)]'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-gold' : ''}>
                      <Icon name={link.icon} />
                    </span>
                    <span className={collapsed ? 'md:sr-only' : ''}>{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className={`shrink-0 border-t border-white/10 p-3 ${collapsed ? 'md:px-2' : ''}`}>
            <div className={`flex items-center gap-2 ${collapsed ? 'md:justify-center' : ''}`}>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-gold ${collapsed ? 'md:hidden' : ''}`}>
                {initial}
              </span>
              <p className={`min-w-0 flex-1 truncate text-xs ${collapsed ? 'md:hidden' : ''}`} title={name}>
                {name}
              </p>
              <button
                type="button"
                onClick={() => void signOut()}
                title="Sign out"
                aria-label="Sign out"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white focus-visible:bg-white/10"
              >
                <Icon name="out" />
              </button>
            </div>
          </div>
        </aside>

        <div
          className={`flex min-w-0 flex-1 flex-col transition-[padding] duration-200 ease-out motion-reduce:transition-none ${
            collapsed ? 'md:pl-[4.75rem]' : 'md:pl-64'
          }`}
        >
          <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 md:hidden">
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="app-sidebar"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-paper"
            >
              <Icon name="menu" />
            </button>
            <span className="font-semibold text-navy">ApplyDesk</span>
          </header>
          <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
