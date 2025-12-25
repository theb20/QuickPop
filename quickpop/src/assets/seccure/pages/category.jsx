import React, { useState, useEffect } from 'react';
import { Search, Star, Play, Plus, Info, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../../seccure/components/search.jsx'

import { getCategories } from '../../config/services/category.js'
import { getVideos } from '../../config/services/videos.js'

export default function MoviesCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const selectedGenre = id || 'tous';

  const [categories, setCategories] = useState([])
  const [videos, setVideos] = useState([])
  const [sortOrder, setSortOrder] = useState('none') // 'none' | 'oldest' | 'newest'

  useEffect(() => {
    getCategories()
      .then((data) => {
        const list = Array.isArray(data) ? data : (Array.isArray(data?.categories) ? data.categories : [])
        setCategories(list)
      })
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    getVideos()
      .then((data) => {
        const list = Array.isArray(data) ? data : (Array.isArray(data?.videos) ? data.videos : [])
        setVideos(list)
      })
      .catch(() => setVideos([]))
  }, [])

  const normalizedVideos = Array.isArray(videos) ? videos : []
  const displayVideos = [...normalizedVideos]
    .filter(v => {
      if (selectedGenre === 'tous') return true
      return Number(v?.category_id) === Number(selectedGenre)
    })
    .sort((a, b) => {
      const da = new Date(a?.created_at || 0).getTime()
      const db = new Date(b?.created_at || 0).getTime()
      if (sortOrder === 'newest') return db - da
      if (sortOrder === 'oldest') return da - db
      return 0
    })

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-b from-blue-50 to-white ">
        <div className="absolute inset-0 bg-[url('/imgs/wall_cat.jpg')] bg-cover bg-center ">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-red-500/20 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <span className="text-red-500 font-semibold uppercase text-sm tracking-wide">3 Vidéos ajoutées récemment</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">Tout savoir</h1>
            <p className="text-lg text-white/80 font-light opacity-60 mb-6">Découvrez toutes les formations disponibles sur QuickPop.</p>
                        
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <SearchBar/>
            </div>
          </div>
        </div>
      </div>

      {/* Genre Filters */}
      <div id="category-sticky" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            <button
              key="tous"
              onClick={() => navigate('/app/category')}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
                selectedGenre === 'tous'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            {(Array.isArray(categories) ? categories : []).map((cat, idx) => {
              const name = typeof cat === 'string' ? cat : (cat?.name)
              const key = cat?.id ?? name ?? idx
              const id = typeof cat === 'object' ? (cat?.id ?? idx) : idx
              return (
                <button
                  key={key}
                  onClick={() => navigate(`/app/category/${id}`)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
                    Number(selectedGenre) === Number(id)
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {name || 'Catégorie'}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{displayVideos.length} vidéos disponibles</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSortOrder('oldest')}
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              les plus anciens
            </button>
            <button
              onClick={() => setSortOrder('newest')}
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Les plus récents
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayVideos.map((movie) => (
  <div key={movie.id} className="group cursor-pointer">
    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">

      {/* Image */}
      <img
        src={movie.thumbnail_url}
        alt={movie.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Top badges */}
      <div className="absolute top-2 left-2 flex items-center gap-2 z-20">
        {movie.trending && (
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
            TENDANCE
          </span>
        )}
      </div>

      {/* Logo */}
      <div className="absolute top-0 left-0 z-20">
        <img src="/imgs/logo.png" className="w-11 opacity-90" alt="logo" />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col justify-center items-center gap-4 px-4 text-center">

        <button
          onClick={() => navigate(`/app/info/${movie.id}`)}
          className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 hover:scale-110 transition"
        >
          <Play className="w-6 h-6 text-white ml-1" fill="white" />
        </button>

        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/info/${movie.id}`);
            }}
            className="w-10 h-10 rounded-full border border-gray-300 bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
          >
            <Info className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <p className="text-xs text-gray-700 line-clamp-4">
          {movie.description}
        </p>
      </div>

      {/* Bottom info gradient */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 py-2 text-white">
        <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center gap-2 text-[11px] text-gray-200 mt-1">
          <span>{movie.year}</span>
          <span>•</span>
          <span>{movie.duration}</span>
        </div>

        <p className="text-[11px] text-gray-300 mt-0.5 line-clamp-1">
          {movie.category_name}
        </p>
      </div>

    </div>
  </div>
))}

        </div>
      </main>
    </div>
  );
}
