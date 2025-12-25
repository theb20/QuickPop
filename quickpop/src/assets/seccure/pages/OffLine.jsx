import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Play, Blinds, ChevronRight, CheckCircle, HardDrive, Search, X, Home, Film, Tv, TrendingUp, Star, User, HelpCircle, ChevronDown, Menu } from 'lucide-react'
import { getOfflineVideos, removeOfflineVideo } from '../../config/services/offline.js'
import { useAuth } from '../../config/hooks/auth.js';

export default function OfflineDownloads() {
  const navigate = useNavigate()
  const [activeTab] = useState('completed')
  const [selectedItems, setSelectedItems] = useState([])
  const [menu, setMenu] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [offlineVideos, setOfflineVideos] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [storageValues, setStorageValues] = useState({ used: '0', total: '0', percent: 0, unit: 'Go' })

  const { user } = useAuth();

  useEffect(() => {
    const updateStorage = async () => {
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const { usage, quota } = await navigator.storage.estimate()
          
          let usedVal, totalVal, unitVal = 'Go'
          
          if (quota < 1024 * 1024 * 1024) {
             usedVal = (usage / (1024 * 1024)).toFixed(1)
             totalVal = (quota / (1024 * 1024)).toFixed(0)
             unitVal = 'Mo'
          } else {
             usedVal = (usage / (1024 * 1024 * 1024)).toFixed(2)
             totalVal = (quota / (1024 * 1024 * 1024)).toFixed(0)
             unitVal = 'Go'
          }

          setStorageValues({
            used: usedVal,
            total: totalVal,
            percent: quota > 0 ? (usage / quota) * 100 : 0,
            unit: unitVal
          })
        } catch (e) {
          console.error('Storage estimate error', e)
        }
      }
    }
    updateStorage()
  }, [offlineVideos])

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      const videos = await getOfflineVideos()
      const formatted = videos.map(v => ({
        id: v.id,
        title: v.title,
        type: 'Vidéo',
        quality: 'HD',
        size: v.size ? `${(v.size / (1024 * 1024)).toFixed(1)} MB` : 'Unknown',
        rawSize: v.size || 0,
        downloadDate: new Date(v.downloadedAt).toLocaleDateString(),
        duration: v.duration ? `${Math.floor(v.duration / 60)} min` : 'Unknown',
        thumbnail: v.thumbnailBlob ? URL.createObjectURL(v.thumbnailBlob) : v.thumbnail_url,
        video_url: v.video_url,
        blob: v.blob,
        category_name: v.category_name || 'Autres'
      }))
      setOfflineVideos(formatted)
    } catch (err) {
      console.error('Failed to load offline videos', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayVideo = (video) => {
    if (video.blob) {
      // Ensure blob has a type for playback compatibility
      const blobToPlay = video.blob.type ? video.blob : new Blob([video.blob], { type: 'video/mp4' });
      const blobUrl = URL.createObjectURL(blobToPlay);
      
      navigate('/app/play', { 
        state: { 
          videoUrl: blobUrl, 
          videoId: video.id,
          title: video.title
        } 
      })
    } else {
      navigate('/app/play', { state: { videoUrl: video.video_url, videoId: video.id } })
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedItems.map(id => removeOfflineVideo(id)))
      setSelectedItems([])
      loadVideos()
    } catch (err) {
      console.error('Failed to delete videos', err)
    }
  }

  const uniqueCategories = ['all', ...new Set(offlineVideos.map(v => v.category_name))].filter(Boolean).sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return a.localeCompare(b);
  });

  const getCategoryCount = (category) => {
    if (category === 'all') return offlineVideos.length;
    return offlineVideos.filter(v => v.category_name === category).length;
  };

  const getFilteredVideos = () => {
    let videos = offlineVideos;
    
    if (selectedCategory !== 'all') {
      videos = videos.filter(v => v.category_name === selectedCategory);
    }
    
    if (sortBy === 'name') {
      return [...videos].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'size') {
      return [...videos].sort((a, b) => b.rawSize - a.rawSize);
    } else {
      return videos;
    }
  };

  const downloading = []
  const completed = getFilteredVideos()

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

  const totalStorage = `${storageValues.total} ${storageValues.unit}`
  const usedStorage = `${storageValues.used} ${storageValues.unit}`
  const storagePercent = storageValues.percent

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
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

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button 
            onClick={() => { setSelectedCategory('all'); setSidebar(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${selectedCategory === 'all' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <Home className={`w-5 h-5 ${selectedCategory === 'all' ? 'text-red-600' : 'text-gray-500'}`} />
              <span className="font-medium text-sm">Vue d'ensemble</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
              {getCategoryCount('all')}
            </span>
          </button>
          
          {[...new Set(uniqueCategories)].filter(c => c !== 'all').map((cat) => (
             <button
               key={cat}
               onClick={() => { setSelectedCategory(cat); setSidebar(false); }}
               className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
             >
               <div className="flex items-center gap-3">
                 <Film className={`w-5 h-5 ${selectedCategory === cat ? 'text-red-600' : 'text-gray-500'}`} />
                 <span className="font-medium text-sm">{cat}</span>
               </div>
               <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                 {getCategoryCount(cat)}
               </span>
             </button>
          ))}
          
          <div className="pt-4 pb-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paramètres</h3>
          </div>

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
            <p className="text-xs text-gray-600">{usedStorage} / {totalStorage}</p>
          </div>
        </nav>

        <div className="p-3 space-y-1">
          <div className="pt-3 mt-3 relative border-t border-gray-200">
            <div
              onClick={() => setMenu(!menu)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-semibold">
{user?.fullname ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullname || 'Utilisateur'}</p>
                <p className="text-xs text-gray-500">{user?.restaurant}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${menu ? 'rotate-180' : ''}`} />
            </div>

            {menu && (
              <div className="absolute left-0 bottom-20 w-full z-20">
                <div className="mx-3 mt-1 p-3 rounded-lg bg-white/90 backdrop-blur-md shadow-lg border border-gray-100">
                  <ul className="flex flex-col gap-2">
                    <li onClick={() => navigate('/app/account')}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-gray-900 transition-colors cursor-pointer">
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

      <div className="flex-1 flex flex-col min-w-0">
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

        {selectedItems.length > 0 && (
          <div className="bg-red-600 px-4 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4 text-white">
              <span className="font-semibold text-sm lg:text-base">{selectedItems.length} sélectionné(s)</span>
              <button onClick={clearSelection} className="text-xs lg:text-sm underline hover:no-underline">
                Effacer
              </button>
            </div>
            <button onClick={handleDeleteSelected} className="px-3 lg:px-4 py-1.5 lg:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs lg:text-sm text-white font-medium flex items-center gap-2 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Supprimer</span>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {loading ? (
             <div className="flex items-center justify-center h-full">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
             </div>
          ) : (
          <div className="px-4 lg:px-8 py-4 lg:py-6">
            <div className="space-y-4 mb-4 lg:mb-6">
              <div className="lg:hidden block relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher dans vos téléchargements..."
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>

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

            {activeTab === 'completed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {completed.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`
                      relative rounded-xl lg:rounded-2xl backdrop-blur-sm bg-white/70 
                      max-w-sm
                      shadow-sm hover:shadow-xl transition-all cursor-pointer 
                      overflow-hidden group border
                      ${selectedItems.includes(item.id) ? 'border-red-500 shadow-md scale-[1.02]' : 'border-gray-200'}
                    `}
                  >
                    <div className="relative overflow-hidden h-32 sm:h-36 lg:h-40 w-full">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />

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
                          <div 
                            onClick={(e) => { e.stopPropagation(); handlePlayVideo(item); }}
                            className="w-14 lg:w-16 h-14 lg:h-16 bg-white/90 backdrop-blur-2xl rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer">
                            <Play className="w-6 lg:w-7 h-6 lg:h-7 text-blue-600" />
                          </div>
                        )}
                      </div>

                      <div className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-white/90 backdrop-blur-sm px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-xs font-bold text-gray-700 shadow">
                        {item.quality}
                      </div>

                      <div className="absolute top-2 lg:top-3 left-2 lg:left-3 rounded-full text-xs text-white font-semibold shadow flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />  
                      </div>
                    </div>

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
          )}
        </div>
      </div>
    </div>
  )
}
