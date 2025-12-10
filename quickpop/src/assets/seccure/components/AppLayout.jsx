import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Cookie from './cookie.jsx'

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1">
        <div className=" w-full">
          <Outlet />
        </div>
      </main>
      <Cookie />
      <Footer />
    </div>
  )
}
