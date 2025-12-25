import { Navigate } from 'react-router-dom'
import { useAuth } from '../../config/hooks/auth.js'

const RequireAuth = ({ children }) => {
  const { user } = useAuth()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  if (!token) return <Navigate to="/login" replace />
  
  const active = user ? (user.is_active === true || user.is_active === 1) : true
  if (!active) return <Navigate to="/wait" replace />
  
  return children
}

export default RequireAuth
