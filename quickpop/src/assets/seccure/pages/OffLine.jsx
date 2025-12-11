import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Play, Blinds, ChevronRight, CheckCircle, HardDrive, Search, X, Home, Film, Tv, TrendingUp, Star, User, HelpCircle, ChevronDown, Menu } from 'lucide-react'

export default function OfflineDownloads() {
    const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('completed')
  const [selectedItems, setSelectedItems] = useState([])
  const [menu, setMenu] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const [sortBy, setSortBy] = useState('recent')

  const downloading = [
    { 
      id: 1, 
      title: 'Cyber Horizon', 
      type: 'Film',
      quality: '4K',
      progress: 67, 
      size: '4.2 GB',
      downloaded: '2.8 GB',
      speed: '12.4 MB/s',
      timeLeft: '2 min',
      status: 'downloading',
      thumbnail: 'bg-gradient-to-br from-blue-100 to-indigo-100'
    },
    { 
      id: 2, 
      title: 'Ocean Deep - S02E05', 
      type: 'Série',
      quality: '1080p',
      progress: 34, 
      size: '1.8 GB',
      downloaded: '612 MB',
      speed: '8.2 MB/s',
      timeLeft: '4 min',
      status: 'downloading',
      thumbnail: 'bg-gradient-to-br from-cyan-100 to-blue-100'
    },
    { 
      id: 3, 
      title: 'Urban Legends', 
      type: 'Film',
      quality: '1080p',
      progress: 0, 
      size: '2.1 GB',
      downloaded: '0 MB',
      speed: '0 MB/s',
      timeLeft: 'En attente',
      status: 'queued',
      thumbnail: 'bg-gradient-to-br from-slate-100 to-gray-100'
    },
  ]

  const completed = [
    { 
      id: 4, 
      title: 'Neon City', 
      type: 'Film',
      quality: '4K',
      size: '5.8 GB',
      downloadDate: 'Il y a 2h',
      duration: '2h 15min',
      thumbnail: 'bg-gradient-to-br from-purple-100 to-pink-100'
    },
    { 
      id: 5, 
      title: 'The Last Kingdom - S03', 
      type: 'Série',
      quality: '1080p',
      size: '12.4 GB',
      downloadDate: 'Hier',
      duration: '8 épisodes',
      thumbnail: 'bg-gradient-to-br from-amber-100 to-orange-100'
    },
    { 
      id: 6, 
      title: 'Space Odyssey', 
      type: 'Film',
      quality: '4K',
      size: '6.2 GB',
      downloadDate: '3 jours',
      duration: '2h 12min',
      thumbnail: 'bg-gradient-to-br from-indigo-100 to-violet-100'
    },
    { 
      id: 7, 
      title: 'Crystal Dreams', 
      type: 'Film',
      quality: '1080p',
      size: '2.9 GB',
      downloadDate: '1 semaine',
      duration: '2h 15min',
      thumbnail: 'bg-gradient-to-br from-pink-100 to-rose-100'
    },
    { 
      id: 8, 
      title: 'Quantum Reality - S02', 
      type: 'Série',
      quality: '1080p',
      size: '8.7 GB',
      downloadDate: '1 semaine',
      duration: '6 épisodes',
      thumbnail: 'bg-gradient-to-br from-violet-100 to-fuchsia-100'
    },
  ]

  const toggleSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    const allIds = activeTab === 'completed' 
      ? completed.map(item => item.id)
      : downloading.map(item => item.id)
    setSelectedItems(allIds)
  }

  const clearSelection = () => setSelectedItems([])

  const totalStorage = 50
  const usedStorage = 38.2
  const storagePercent = (usedStorage / totalStorage) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl lg:text-2xl text-gray-900 font-black tracking-tight">
            Quick <span className="text-red-600">Pop</span>
          </h1>
          <button 
            onClick={() => setSidebar(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-medium text-sm">Vue d'ensemble</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Film className="w-5 h-5" />
            <span className="font-medium text-sm">Catégorie 1</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Tv className="w-5 h-5" />
            <span className="font-medium text-sm">Catégorie 2</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium text-sm">Catégorie 3</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Star className="w-5 h-5" />
            <span className="font-medium text-sm">Catégorie 4</span>
          </a>
          
          <div className="pt-4 pb-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paramètres</h3>
          </div>

          {/* Storage Info in Sidebar */}
          <div className="mt-6 mx-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="w-4 h-4 text-red-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">Stockage</span>
                  <span className="text-xs text-gray-600">{Math.round(storagePercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full transition-all duration-500"
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600">{usedStorage} / {totalStorage} GB</p>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-1">
          <div className="pt-3 mt-3 relative border-t border-gray-200">
            <div
              onClick={() => setMenu(!menu)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-semibold">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Jean Dupont</p>
                <p className="text-xs text-gray-500">3456</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${menu ? 'rotate-180' : ''}`} />
            </div>

            {menu && (
              <div className="absolute left-0 bottom-20 w-full z-20">
                <div className="mx-3 mt-1 p-3 rounded-lg bg-white/90 backdrop-blur-md shadow-lg border border-gray-100">
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-gray-900 transition-colors cursor-pointer">
                      <span className="flex items-center gap-3">
                        <User className="w-5 h-5" />
                        <span className="font-medium text-sm">Mon compte</span>
                      </span>
                      <ChevronRight size={16} />
                    </li>
                    <li onClick={() => navigate('/app/help')} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-gray-900 transition-colors cursor-pointer">
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5" />
                        <span className="font-medium text-sm">Aide</span>
                      </span>
                      <ChevronRight size={16} />
                    </li>
                    <li onClick={() => navigate('/app')} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-gray-900 transition-colors cursor-pointer">
                      <span className="flex items-center gap-3">
                        <Blinds className="w-5 h-5" />
                        <span className="font-medium text-sm">Accueil</span>
                      </span>
                      <ChevronRight size={16} />
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 lg:py-5">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSidebar(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Hors Ligne</h1>
                  <p className="text-gray-500 text-xs lg:text-sm hidden sm:block">Gérez votre contenu</p>
                </div>
              </div>

              <div className="flex hidden lg:block items-center gap-2">
               
                <div className="relative ">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-red-500 focus:bg-white transition-colors w-48 lg:w-64"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        {selectedItems.length > 0 && (
          <div className="bg-red-600 px-4 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4 text-white">
              <span className="font-semibold text-sm lg:text-base">{selectedItems.length} sélectionné(s)</span>
              <button onClick={clearSelection} className="text-xs lg:text-sm underline hover:no-underline">
                Effacer
              </button>
            </div>
            <button className="px-3 lg:px-4 py-1.5 lg:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs lg:text-sm text-white font-medium flex items-center gap-2 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Supprimer</span>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-4 lg:px-8 py-4 lg:py-6">
            {/* Actions Bar */}
            <div className="space-y-4 mb-4 lg:mb-6">
              {/* Search Bar - Full Width */}
              <div className="lg:hidden block relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher dans vos téléchargements..."
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between gap-3">
                <button 
                  onClick={selectAll}
                  className="px-3 lg:px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs lg:text-sm font-medium text-gray-700 transition-colors"
                >
                  Tout sélectionner
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs lg:text-sm text-gray-600 hidden sm:inline">Trier:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none cursor-pointer text-gray-700 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="recent">Plus récent</option>
                    <option value="name">Nom</option>
                    <option value="size">Taille</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Completed Downloads */}
            {activeTab === 'completed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {completed.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`
                      relative rounded-xl lg:rounded-2xl backdrop-blur-sm bg-white/70 
                      shadow-sm hover:shadow-xl transition-all cursor-pointer 
                      overflow-hidden group border
                      ${selectedItems.includes(item.id) ? 'border-red-500 shadow-md scale-[1.02]' : 'border-gray-200'}
                    `}
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden h-32 sm:h-36 lg:h-40 w-full">
                      <div className={`w-full h-full ${item.thumbnail} transition-transform duration-500 group-hover:scale-110`} />

                      {/* Overlay */}
                      <div className={`
                        absolute inset-0 flex items-center justify-center 
                        transition-all duration-300
                        ${selectedItems.includes(item.id) 
                          ? 'bg-red-600/70 opacity-100' 
                          : 'bg-black/40 opacity-0 group-hover:opacity-100'}
                      `}>
                        {selectedItems.includes(item.id) ? (
                          <CheckCircle className="w-10 lg:w-12 h-10 lg:h-12 text-white drop-shadow-lg" />
                        ) : (
                          <div className="w-14 lg:w-16 h-14 lg:h-16 bg-white/90 backdrop-blur-2xl rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl">
                            <Play className="w-6 lg:w-7 h-6 lg:h-7 text-blue-600" />
                          </div>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-white/90 backdrop-blur-sm px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-xs font-bold text-gray-700 shadow">
                        {item.quality}
                      </div>

                      <div className="absolute top-2 lg:top-3 left-2 lg:left-3 rounded-full text-xs text-white font-semibold shadow flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />  
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="p-3 lg:p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 text-xs lg:text-sm line-clamp-1">
                        {item.title}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{item.type}</span>
                        <span>{item.size}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{item.downloadDate}</span>
                        <span className="hidden sm:inline">{item.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}