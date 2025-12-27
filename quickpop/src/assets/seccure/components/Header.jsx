import { ChevronDown, User, ShoppingBag, ShoppingCart, Film, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom'
import Notif from '../components/notif.jsx'
import { getCategories } from '../../config/services/category.js'
import { useSocket } from '../../config/context/useSocket'

export default function RestaurantHeader() {
  const navigate = useNavigate()
  const size = 18
  const location = useLocation()
  const [hidden, setHidden] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const shouldHideOnScroll = location.pathname.startsWith('/app/category')
  const { notifications, markNotificationAsRead } = useSocket()
  
  const unreadCount = notifications.filter(n => !n.read_at).length;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data || [])
      } catch (err) {
        console.error('Failed to fetch categories', err)
      }
    }
    fetchCategories()
  }, [])

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

  const IsInfo = location.pathname.startsWith('/app/info');
  const IsPlay = location.pathname === '/app/play';
  const IsHelp = location.pathname === '/app/help';
  const IsAccount = location.pathname === '/app/account';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicking inside the notification dropdown, do nothing
      if (notifOpen && event.target.closest('.notif-dropdown')) {
        return;
      }
      
      // If clicking the bell button, do nothing (onClick handles it)
      if (notifOpen && event.target.closest('.notif-btn')) {
        return;
      }

      // Otherwise, if open, close it
      if (notifOpen) {
        setNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  return (
    <>
    <div className={`p-4 md:p-6 fixed z-[100] flex items-center justify-center top-0 left-0 right-0 transition-transform transition-opacity duration-300 ${shouldHideOnScroll && hidden && !mobileMenuOpen ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
      {!IsInfo && !IsPlay && !IsHelp && !IsAccount && (
      <div className="transition-all duration-300 rounded-full p-[2px] conic-border w-full max-w-[850px]">

        <header className="transition-all w-full rounded-full duration-300 bg-white/95 backdrop-blur-lg shadow-xl">

          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-center justify-between h-20">
              
              {/* Logo & Navigation */}
              <div className="flex items-center space-x-8 lg:space-x-12">

                <div onClick={() => navigate('/app')} className="flex items-center gap-3">
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
                    end
                    className="relative px-4 py-2 text-sm font-bold text-gray-900 group overflow-hidden rounded-xl"
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>Accueil</span>
                        <span className={`absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform transition-transform duration-300 origin-left rounded-xl ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                      </>
                    )}
                  </NavLink>
                  
                  <div 
                    className="relative group"
                    onMouseEnter={() => setCategoryMenuOpen(true)}
                    onMouseLeave={() => setCategoryMenuOpen(false)}
                  >
                    <NavLink
                      to="/app/category"
                      className="relative px-4 py-2 flex items-center gap-1.5 text-sm font-semibold text-gray-600 group overflow-hidden rounded-xl"
                      onClick={() => setCategoryMenuOpen(false)}
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>Catégorie</span>
                          <ChevronDown size={16} className={`relative z-10 transition-all duration-300 ${isActive ? 'text-white rotate-180' : 'group-hover:text-white group-hover:rotate-180'}`} />
                          <span className={`absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform transition-transform duration-300 origin-left rounded-xl ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </>
                      )}
                    </NavLink>

                    <div className={`absolute left-0 top-full w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-amber-100 p-2 z-[100] mt-1 transition-all duration-200 origin-top ${categoryMenuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}>

                    {categories.length > 0 ? (
                      categories.map((category, index) => {
                        const isActive = location.pathname === `/app/category/${category.id}`;
                        return (
                          <Link 
                            to={`/app/category/${category.id}`} 
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-800 hover:bg-red-50'}`}
                            key={category.id || index}
                            onClick={() => setCategoryMenuOpen(false)}
                          >
                            <Film className={`w-4 h-4 inline-block mr-2 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                            {category.name || category.title || 'Catégorie'}
                          </Link>
                        )
                      })
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">Chargement...</div>
                    )}

                    </div>
                  </div>
                  
                  <NavLink
                    to="/app/help"
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
              
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setNotifOpen(v => !v)}
                    className="notif-btn relative p-2.5 bg-amber-50 hover:bg-red-100 rounded-xl transition-colors group"
                    aria-haspopup="dialog"
                    aria-expanded={notifOpen ? 'true' : 'false'}
                  >
                    <ShoppingBag size={size} className="text-gray-700 group-hover:text-red-600 transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="notif-dropdown fixed left-4 right-4 top-24 sm:absolute sm:left-auto sm:right-1 sm:top-full sm:mt-7 z-[100] sm:w-96 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-100 p-2 space-y-2">
                       {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 text-sm">Aucune notification</div>
                       ) : (
                          notifications.map((notif) => (
                            <Notif 
                              key={notif.id}
                              type={notif.type || 'info'}
                              title={notif.title} 
                              message={notif.body}
                              date={notif.created_at}
                              onClose={!notif.read_at ? () => markNotificationAsRead(notif.id) : undefined}
                            />
                          ))
                       )}
                    </div>
                  )}
                </div>
                {/* User */}
                <button onClick={() => navigate('/app/account')} className=" hidden lg:flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl  font-semibold">
                  <User size={size} />
                  <span className=" text-sm">Compte</span>
                </button>

                {/* Mobile Menu Button */}
                <button 
                  className="lg:hidden p-2.5 bg-gray-100 hover:bg-red-600 rounded-xl transition-colors text-gray-700 hover:text-gray-100"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={size} /> : <Menu size={size} />}
                </button>
              </div>

            </div>
          </div>

        </header>

      </div>
      )}
    </div>

      {/* Mobile Menu Overlay - AI/Futuristic "Fluid Hub" Design */}
      <div className={`lg:hidden fixed inset-0 z-[200] overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        
        {/* Animated Backdrop with Gradient */}
        <div 
          className={`absolute inset-0 bg-black/80 backdrop-blur-3xl transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Subtle animated gradient blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-400/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-300/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        {/* Content Container */}
        <div className={`relative h-full flex flex-col pt-24 px-6 pb-10 transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          
          {/* Close Button - Floating */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white shadow-xl shadow-red-100/50 rounded-full text-gray-500 hover:text-red-600 transition-transform hover:scale-110 active:scale-95"
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
              
              {/* Menu Items with Staggered Entry */}
              {[
                { to: "/app", label: "Accueil", icon: null, delay: "100ms" },
                // Categories is special, handled below
                { to: "/app/help", label: "Documentation", icon: null, delay: "200ms" },
                { to: "/app/account", label: "Mon compte", icon: null, delay: "300ms" }
              ].map((item) => {
                 if (item.label === "Accueil") {
                    return (
                      <NavLink 
                        key={item.to}
                        to={item.to} 
                        end 
                        onClick={() => setMobileMenuOpen(false)} 
                        style={{ transitionDelay: mobileMenuOpen ? item.delay : '0ms' }}
                        className={({isActive}) => `
                          group relative flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500
                          ${isActive 
                            ? 'bg-gradient-to-br from-red-600 to-red-500 text-white border-transparent shadow-xl shadow-red-500/30 scale-100 translate-x-0' 
                            : 'bg-white border-white/50 text-gray-600 shadow-lg shadow-gray-200/50 hover:scale-[1.02] hover:shadow-xl'
                          }
                          ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                        `} 
                      >
                        {({ isActive }) => (
                          <>
                            <span className="text-xl font-bold tracking-tight">{item.label}</span>
                            <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                               <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-ping' : 'bg-gray-400'}`} />
                            </div>
                          </>
                        )}
                      </NavLink>
                    )
                 }
                 // Render other simple links later
                 return null;
              })}

              {/* Categories - Special Expandable Card */}
              <div 
                style={{ transitionDelay: mobileMenuOpen ? '150ms' : '0ms' }}
                className={`
                  relative rounded-[2rem] bg-white border border-white/50 shadow-lg shadow-gray-200/50 overflow-hidden transition-all duration-500
                  ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                `}
              >
                 <div 
                    className="flex items-center justify-between p-6 cursor-pointer"
                    onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                 >
                    <span className="text-xl font-bold text-gray-700">Catégories</span>
                    <div className={`p-2 rounded-full bg-gray-50 transition-transform duration-500 ${categoryMenuOpen ? 'rotate-180 bg-red-50 text-red-600' : 'text-gray-400'}`}>
                      <ChevronDown size={24} />
                    </div>
                 </div>

                 {/* Animated Height Container */}
                 <div className={`transition-all  duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${categoryMenuOpen ? 'max-h-[1900px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-6 h-[1900px] overflow-auto space-y-2">
                        {categories.map((category) => ( 
                          <NavLink 
                              key={category.id} 
                              to={`/app/category/${category.id}`} 
                              onClick={() => setMobileMenuOpen(false)} 
                              className={({isActive}) => `flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-gray-50 text-gray-500'}`}
                          > 
                              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
                                <Film size={18} />
                              </div>
                              <span className="text-lg">{category.name || category.title}</span> 
                          </NavLink> 
                        ))} 
                    </div>
                 </div>
              </div>

              {/* Other Links */}
               <NavLink 
                  to="/app/help" 
                  onClick={() => setMobileMenuOpen(false)} 
                  style={{ transitionDelay: mobileMenuOpen ? '200ms' : '0ms' }}
                  className={({isActive}) => `
                    group relative flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500
                    ${isActive 
                      ? 'bg-gradient-to-br from-red-600 to-red-500 text-white border-transparent shadow-xl shadow-red-500/30 scale-100' 
                      : 'bg-white border-white/50 text-gray-600 shadow-lg shadow-gray-200/50 hover:scale-[1.02] hover:shadow-xl'
                    }
                    ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                  `} 
                >
                  {({ isActive }) => (
                    <>
                      <span className="text-xl font-bold tracking-tight">Documentation</span>
                      <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-ping' : 'bg-gray-400'}`} />
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink 
                  to="/app/account" 
                  onClick={() => setMobileMenuOpen(false)} 
                  style={{ transitionDelay: mobileMenuOpen ? '250ms' : '0ms' }}
                  className={({isActive}) => `
                    group relative flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500
                    ${isActive 
                      ? 'bg-gradient-to-br from-red-600 to-red-500 text-white border-transparent shadow-xl shadow-red-500/30 scale-100' 
                      : 'bg-white border-white/50 text-gray-600 shadow-lg shadow-gray-200/50 hover:scale-[1.02] hover:shadow-xl'
                    }
                    ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                  `} 
                >
                  {({ isActive }) => (
                    <>
                      <span className="text-xl font-bold tracking-tight">Mon compte</span>
                      <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-ping' : 'bg-gray-400'}`} />
                      </div>
                    </>
                  )}
                </NavLink>

          </div>
          
          {/* Footer Info */}
          <div 
             style={{ transitionDelay: mobileMenuOpen ? '350ms' : '0ms' }}
             className={`mt-6 text-center transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
             <p className="text-sm text-gray-400 font-medium">QuickPop v1.0</p>
          </div>

        </div>
      </div>
    </>
  )
}