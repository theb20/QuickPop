import { useState } from 'react'
import { Search, X, CircleEllipsis, TrendingUp, Clock, FileText, Users, Briefcase } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function EnterpriseSearchZone() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const isCategoryPage = location.pathname === '/app/category'

  const trendingSearches = [
    'Rapports financiers Q4',
    'Politique RH 2024',
    'Guide compliance',
    'Procédures ISO'
  ]

  const recentSearches = [
    'Budget marketing',
    'Organigramme',
    'Plan stratégique'
  ]

  const handleClear = () => {
    setSearchQuery('')
  }

  return (
    <div className={isCategoryPage ? ' flex items-start justify-center pt-2' : 'p-8 flex items-start justify-center pt-20'}>
      <div className="w-full max-w-3xl">
        
        {/* Zone de recherche principale */}
        <div className="relative">
          <div className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 ${isFocused ? 'shadow-2xl ring-4 ring-red-200' : 'shadow-lg'}`}>
            <div className="flex items-center p-5">
              <Search className={`w-6 h-6 transition-colors duration-300 ${isFocused ? 'text-red-600' : 'text-gray-400'}`} />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder={isCategoryPage ? 'Recherche une vidéo' : "Explorer des vidéos de détartrage, de ruptures, de techniques et d’ADM ..."}
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
            {isFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* Recherches tendances */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Tendances</h3>
                  </div>
                  <div className="space-y-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                            {search}
                          </span>
                          <Search className="w-4 h-4 text-gray-300 group-hover:text-red-600 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

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
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          {search}
                        </span>
                        <X className="w-4 h-4 text-gray-300 hover:text-red-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                
              </div>
            )}
          </div>

          {/* Filtres de recherche */}

          {!isCategoryPage && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: FileText, label: 'Mutation sur adoria ' },
              { icon: Users, label: 'Rupture de drums' },
              { icon: Briefcase, label: 'Détartrage' },
              { icon: CircleEllipsis, label: '' },
            ].map((filter, index) => {
              const Icon = filter.icon
              return (
                <button
                  key={index}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-blue-50 text-sm text-gray-700 hover:text-blue-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-semibold border border-gray-200 hover:border-blue-200"
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              )
            })}
          </div>
          )}
        </div>

        {/* Résultats instantanés */}
        {searchQuery && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Résultats pour "{searchQuery}"
              </h3>
              <span className="text-sm text-gray-500 font-medium">124 résultats</span>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-gray-900">Documents</h4>
                  <span className="ml-auto text-sm text-gray-600 font-medium">45 fichiers</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        Rapport_Financier_Q{item}_2024.pdf
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">Modifié il y a 2 jours • Finance</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-600">2.4 MB</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Équipes */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-gray-900">Équipes</h4>
                  <span className="ml-auto text-sm text-gray-600 font-medium">12 équipes</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { name: 'Marketing Digital', members: 8, color: 'from-purple-500 to-pink-600' },
                  { name: 'Développement Produit', members: 12, color: 'from-blue-500 to-cyan-600' }
                ].map((team, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${team.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {team.name}
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">{team.members} membres actifs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}