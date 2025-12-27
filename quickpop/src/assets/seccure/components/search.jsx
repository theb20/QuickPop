import { useState, useEffect } from 'react'
import { Search, X, Clock, Play, Folder, Film } from 'lucide-react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { getCategories } from '../../config/services/category.js'
import api from '../../config/api.js'

export default function EnterpriseSearchZone() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [displayText, setDisplayText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch (e) {
      console.error("Erreur chargement historique", e);
      return [];
    }
  });

  const addToHistory = (term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    // Garder les 5 dernières recherches uniques
    const newHistory = [cleanTerm, ...recentSearches.filter(t => t !== cleanTerm)].slice(0, 5);
    setRecentSearches(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const removeFromHistory = (e, term) => {
    e.stopPropagation(); // Empêcher le déclenchement de la recherche
    const newHistory = recentSearches.filter(t => t !== term);
    setRecentSearches(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const placeholders = [
    "Rechercher une procédure...",
    "Comment nettoyer le grill...",
    "Formation hygiène...",
    "Préparation des commandes..."
  ];

  useEffect(() => {
    // Si la recherche est vide, on efface les résultats mais on ne fait rien d'autre
    if (!searchQuery.trim()) {
      const t = setTimeout(() => {
        if (results) setResults(null)
      }, 0)
      return () => clearTimeout(t)
    }

    // Fonction de recherche immédiate
    const performSearch = () => {
      setLoading(true)
      api.get(`/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => {
          setResults(res)
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }

    // Debounce léger pour éviter trop d'appels pendant la frappe rapide, 
    // mais suffisamment court pour paraître "live"
    const timer = setTimeout(performSearch, 150)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const currentPlaceholder = placeholders[placeholderIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPlaceholder.length) {
          setDisplayText(currentPlaceholder.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, placeholderIndex]);

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

  const isCategoryPage = location.pathname.startsWith('/app/category')

  const handleClear = () => {
    setSearchQuery('')
  }
  
  const videos = results?.videos || []
  const searchCategories = results?.categories || []
  const totalResults = videos.length + searchCategories.length

  const handleResultClick = (path) => {
    addToHistory(searchQuery);
    navigate(path);
  }

  return (
    <div className={isCategoryPage ? ' flex items-start justify-center pt-2' : 'p-8 flex items-start justify-center pt-20'}>
      <div className="relative z-50 w-full max-w-3xl">
        
        {/* Zone de recherche principale */}
        <div className="relative">
          <div className={`relative bg-white rounded-full shadow-lg transition-all duration-300 ${isFocused ? 'shadow-2xl ring-4 ring-red-200' : 'shadow-lg'}`}>
            <div className="flex items-center p-5">
              <Search className={`w-6 h-6 transition-colors duration-300 ${isFocused ? 'text-red-600' : 'text-gray-400'}`} />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder={isCategoryPage ? 'Recherche une vidéo' : displayText}
                className="flex-1 ml-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {isFocused && !searchQuery && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                
                {/* Recherches récentes */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Récent</h3>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onMouseDown={(e) => {
                           e.preventDefault(); // Empêche la perte de focus avant le click
                           setSearchQuery(search);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          {search}
                        </span>
                        <div 
                          onClick={(e) => removeFromHistory(e, search)}
                          className="p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-300 hover:text-red-500 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filtres de recherche (Catégories rapides) */}
          {!isCategoryPage && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {categories.length > 0 ? (
                categories.map((category, index) => {
                  const isActive = location.pathname === `/app/category/${category.id}`;
                  return (
                    <Link
                      to={`/app/category/${category.id}`}
                      key={category.id || index}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors
                        ${isActive 
                          ? 'bg-red-50 text-gray-800 font-medium' 
                          : 'bg-white text-black hover:bg-red-600 hover:text-white'
                        }`}
                    >
                      <Film
                        className={`w-4 h-4 inline-block mr-2
                          ${isActive ? 'text-gray-600' : ' hover:text-white'}
                        `}
                      />
                      {category.name}
                    </Link>
                  )
                })
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">Chargement...</div>
              )}
          </div>
          )}
        </div>

        {/* Résultats instantanés */}
        {searchQuery && (
          <div className="mt-8 flex items-center justify-between flex-col w-full absolute z-100 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            

            {/* Vidéos */}
            {videos.length > 0 && (
            <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-gray-900">Vidéos</h4>
                  <span className="ml-auto text-sm text-gray-600 font-medium">{videos.length} vidéos</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleResultClick(`/app/info/${video.id}`)}
                    className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                       {video.thumbnail_url ? (
                         <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                       ) : (
                         <Play className="w-6 h-6 text-gray-400" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                        {video.title}
                      </h5>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{video.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-600">{video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Catégories */}
            {searchCategories.length > 0 && (
            <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-gray-900">Catégories</h4>
                  <span className="ml-auto text-sm text-gray-600 font-medium">{searchCategories.length} catégories</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {searchCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleResultClick(`/app/category/${cat.id}`)}
                    className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {cat.name}
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
            
            {!loading && totalResults === 0 && (
              <div className="text-center py-10 text-gray-500">
                Aucun résultat trouvé pour "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
