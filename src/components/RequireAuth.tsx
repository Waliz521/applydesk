import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Layout } from '@/components/Layout'

export function RequireAuth() {
  const { session, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted">
        Loading…
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />
  return <Layout />
}
