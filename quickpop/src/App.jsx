import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './assets/seccure/components/AppLayout.jsx'

import Login from './assets/pages/login.jsx'
import Category from './assets/seccure/pages/category.jsx'
import Home from './assets/seccure/pages/home.jsx'
import Info from './assets/seccure/pages/infos.jsx'
import Play from './assets/seccure/pages/play.jsx'



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="category" element={<Category />} />
        <Route path="info" element={<Info />} />
        <Route path="play" element={<Play />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
