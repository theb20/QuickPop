import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import AppLayout from './assets/seccure/components/AppLayout.jsx'

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



function App() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const goOffline = () => {
      if (location.pathname !== '/offline') {
        navigate('/offline', { replace: true })
      }
      if (location.pathname !== '/help') {
        navigate('/help', { replace: true })
      }
    }

    // Redirige immédiatement si l’état réseau est hors ligne
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      goOffline()
    }

    // Écoute les changements d’état réseau
    const handleOffline = () => goOffline()
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('offline', handleOffline)
    }
  }, [navigate, location.pathname])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/wait" element={<Wait />} />
      <Route path="/terms" element={<Terms />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="category" element={<Category />} />
        <Route path="info" element={<Info />} />
        <Route path="play" element={<Play />} />
        <Route path="help" element={<Help />} />
        <Route path="account" element={<Account/>}/>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="offline" element={<OffLine />} />
      <Route path="backoffice" element={<Backoffice />} />
      
    </Routes>
  )
}

export default App
