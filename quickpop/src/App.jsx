import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import AppLayout from './assets/seccure/components/AppLayout.jsx'
import RequireAuth from './assets/seccure/components/RequireAuth.jsx'

import Login from './assets/pages/login.jsx'
import Category from './assets/seccure/pages/category.jsx'
import Home from './assets/seccure/pages/home.jsx'
import Info from './assets/seccure/pages/infos.jsx'
import Play from './assets/seccure/pages/play.jsx'
import OffLine from './assets/seccure/pages/OffLine.jsx'
import Help from './assets/seccure/pages/help.jsx'
import Backoffice from './assets/seccure/pages/Backoffice.jsx/index.jsx'
import Account from './assets/seccure/pages/account.jsx'
import Wait from './assets/pages/Wait.jsx'
import Terms from './assets/pages/Terms.jsx'
import Reset from './assets/pages/reset.jsx'
import Support from './assets/pages/Support.jsx'


function App() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleOffline = () => {
      if (location.pathname !== '/offline') {
        navigate('/offline', { state: { from: location.pathname }, replace: true })
      }
    }

    const handleOnline = () => {
      // Optionnel : rediriger vers l'accueil ou la page précédente
      if (location.pathname === '/offline') {
        const from = location.state?.from || '/app'
        navigate(from, { replace: true })
      }
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    // Vérification initiale
    if (typeof navigator !== 'undefined' && !navigator.onLine && location.pathname !== '/offline') {
      handleOffline()
    }
    
    // Si on est en ligne mais sur la page offline (ex: après refresh), on redirige
    if (typeof navigator !== 'undefined' && navigator.onLine && location.pathname === '/offline') {
      handleOnline()
    }

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [navigate, location.pathname, location.state])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/wait" element={<Wait />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/support" element={<Support />} />

      <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route index element={<Home />} />
        <Route path="category" element={<Category />} />
        <Route path="category/:id" element={<Category />} />
        <Route path="info" element={<Info />} />
        <Route path="info/:id" element={<Info />} />
        <Route path="play" element={<Play />} />
        <Route path="help" element={<Help />} />
        <Route path="account" element={<Account/>}/>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="offline" element={<OffLine />} />
      <Route path="backoffice" element={<RequireAuth><Backoffice /></RequireAuth>} />
      
    </Routes>
  )
}

export default App
