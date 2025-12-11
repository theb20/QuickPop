import { Search, ChevronDown, User, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

export default function RestaurantHeader() {
  const navigate = useNavigate()
  const size = 18
  const location = useLocation()
  const [hidden, setHidden] = useState(false)
  const shouldHideOnScroll = location.pathname.startsWith('/app/category')

  useEffect(() => {
    if (!shouldHideOnScroll) return

    const stickyEl = document.getElementById('category-sticky')
    const stickyTop = stickyEl ? (stickyEl.getBoundingClientRect().top + window.scrollY) : Number.POSITIVE_INFINITY
    // last scroll position no longer needed

    const handleScroll = () => {
      const y = window.scrollY
      const stuck = y >= stickyTop
      setHidden(stuck)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shouldHideOnScroll])

  const IsInfo = location.pathname === '/app/info';
  const IsPlay = location.pathname === '/app/play';
  const IsHelp = location.pathname === '/app/help';
  const IsAccount = location.pathname === '/app/account';

  return (
    <div className={`p-4 md:p-6 fixed flex items-center justify-center top-0 left-0 right-0 z-50 transition-transform transition-opacity duration-300 ${shouldHideOnScroll && hidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
      {!IsInfo && !IsPlay && !IsHelp && !IsAccount && (
      <header className="transition-all max-w-[1000px] rounded-full duration-300 bg-white/95 backdrop-blur-lg shadow-xl border border-amber-100">

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-8 lg:space-x-12">

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden p-2">
                  <img src="/imgs/logo-mb.png" className='object-cover w-full h-full' alt="" />
                </div>
                <div className="text-2xl text-gray-900 font-black tracking-tight pe-9 md:pe-0 sm:pe-9">
                  Quick <span className="text-red-600">Pop</span>
                </div>
              </div>
              
              <nav className="hidden lg:flex items-center space-x-2  rounded-2xl">
                <NavLink
                  to="/app"
                  className="relative px-4 py-2 text-sm font-bold text-gray-900 group overflow-hidden rounded-xl"
                >
                  {({ isActive }) => (
                    <>
                      <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>Accueil</span>
                      <span className={`absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform transition-transform duration-300 origin-left rounded-xl ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                    </>
                  )}
                </NavLink>
                
                <div className="relative group pt-2">
                  <NavLink
                    to="/app/categories"
                    className="relative px-4 py-2 flex items-center gap-1.5 text-sm font-semibold text-gray-600 group overflow-hidden rounded-xl"
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>Catégorie</span>
                        <ChevronDown size={16} className={`relative z-10 transition-all duration-300 ${isActive ? 'text-white rotate-180' : 'group-hover:text-white group-hover:rotate-180'}`} />
                        <span className={`absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform transition-transform duration-300 origin-left rounded-xl ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                      </>
                    )}
                  </NavLink>

                  <div className="absolute left-0 top-full w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-amber-100 p-2 hidden group-hover:block group-focus-within:block z-50">
                    <a href="#" className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-red-50">Action</a>
                    <a href="#" className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-red-50">Drame</a>
                    <a href="#" className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-red-50">Sci‑Fi</a>
                    <a href="#" className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-red-50">Comédie</a>
                    <a href="#" className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-red-50">Thriller</a>
                  </div>
                </div>
                
                <NavLink
                  to="/app/docs"
                  className="relative px-4 py-2 text-sm font-semibold text-gray-600 group overflow-hidden rounded-xl"
                >
                  {({ isActive }) => (
                    <>
                      <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>Documentation</span>
                      <span className={`absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform transition-transform duration-300 origin-left rounded-xl ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                    </>
                  )}
                </NavLink>
                
               
              </nav>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-3 lg:space-x-4">
             
              {/* Cart */}
              <button className="relative p-2.5 bg-amber-50 hover:bg-red-100 rounded-xl transition-colors group">
                <ShoppingBag size={size} className="text-gray-700 group-hover:text-red-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User */}
              <button onClick={() => navigate('/app/account')} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold">
                <User size={size} />
                <span className="hidden lg:inline text-sm">Compte</span>
              </button>
            </div>

          </div>
        </div>

      </header>
      )}
    </div>
  )
}
