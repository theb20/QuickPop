import React, { useState } from 'react';
import { Play, Plus, Share2, Heart, Star, Clock, Calendar, Globe, ChevronRight, Award, Users, Film, X, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MovieDetailsPage() {
  const navigate = useNavigate();
  const [inList, setInList] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  const movie = {
    title: "Dune: Part Two",
    originalTitle: "Dune: Part Two",
    tagline: "Long live the fighters",
    year: "2024",
    rating: 8.5,
    votes: "245K",
    duration: "2h 46min",
    releaseDate: "1 Mars 2024",
    genres: ["Science-Fiction", "Aventure", "Drame"],
    language: "Anglais",
    country: "États-Unis",
    budget: "$190M",
    boxOffice: "$711M",
    director: "Denis Villeneuve",
    writers: ["Denis Villeneuve", "Jon Spaihts"],
    synopsis: "Paul Atreides s'unit à Chani et aux Fremen pour mener la révolte contre ceux qui ont détruit sa famille. Confronté à un choix entre l'amour de sa vie et le destin de l'univers connu, il s'efforce d'empêcher un terrible futur que lui seul peut prévoir.",
    posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=750&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
  };

  const cast = [
    { name: "Timothée Chalamet", role: "Paul Atreides", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" },
    { name: "Zendaya", role: "Chani", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
    { name: "Rebecca Ferguson", role: "Lady Jessica", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop" },
    { name: "Josh Brolin", role: "Gurney Halleck", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
    { name: "Austin Butler", role: "Feyd-Rautha", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" },
    { name: "Florence Pugh", role: "Princesse Irulan", image: "https://images.unsplash.com/photo-1502767089025-6572583495f9?w=200&h=200&fit=crop" },
  ];

  const similarMovies = [
    { id: 1, title: "Blade Runner 2049", image: "https://images.unsplash.com/photo-1574267432644-f610f53e6a6f?w=300&h=450&fit=crop", rating: 8.0 },
    { id: 2, title: "Interstellar", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=450&fit=crop", rating: 8.6 },
    { id: 3, title: "Arrival", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop", rating: 7.9 },
    { id: 4, title: "Mad Max: Fury Road", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop", rating: 8.1 },
  ];

  const REVIEWS = [
    { id: 1, author: "John D.", rating: 9, date: "Il y a 2 jours", text: "Un chef-d'œuvre visuel ! Denis Villeneuve a encore frappé fort. Les scènes d'action sont à couper le souffle." },
    { id: 2, author: "Sarah M.", rating: 8.5, date: "Il y a 1 semaine", text: "Épique de bout en bout. La musique de Hans Zimmer est parfaite. Une suite digne de son prédécesseur." },
    { id: 3, author: "Mike R.", rating: 8, date: "Il y a 2 semaines", text: "Visuellement impressionnant avec une histoire captivante. Quelques longueurs mais globalement excellent." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Backdrop */}
      <div className="relative bg-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${movie.backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img 
                src={movie.posterUrl} 
                alt={movie.title}
                className="w-64 md:w-80 rounded-xl shadow-xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4 border border-red-200">
                <EyeOff className="w-4 h-4 text-red-600" />
                <span className="text-red-700 text-sm font-semibold">Non regardé</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-3">
                {movie.title}
              </h1>

              <p className="text-xl text-gray-600 italic mb-6">
                "{movie.tagline}"
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-yellow-800 text-yellow-800" />
                  <span className="text-yellow-900 font-bold text-lg">{movie.rating}</span>
                  <span className="text-yellow-800 text-sm">({movie.votes})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">{movie.year}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{movie.duration}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex gap-3 mb-8">
                {movie.genres.map((genre, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 border border-gray-200"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/app/play')}
                  className="px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg shadow-md hover:bg-red-700"
                >
                  <span className="flex items-center gap-3">
                    <Play className="w-6 h-6" fill="white" />
                    Regarder la vidéo
                  </span>
                </button>

                <button 
                  onClick={() => setInList(!inList)}
                  className={`px-6 py-4 rounded-full font-bold text-lg border-2 shadow-md flex items-center gap-3 ${
                    inList 
                      ? 'bg-red-600 border-red-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  aria-pressed={inList}
                >
                  {inList 
                    ? <X className="w-6 h-6 text-white" /> 
                    : <Plus className="w-6 h-6 text-gray-700" />}
                  {inList ? 'Supprimer de ma liste' : 'Enregistrer hors ligne'}
                </button>

                <button className="w-16 h-16 bg-white rounded-full font-bold border-2 border-gray-300 hover:border-gray-400 shadow-md flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {['overview', 'cast', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-4 px-2 font-semibold whitespace-nowrap ${
                  selectedTab === tab
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'overview' && 'Aperçu'}
                {tab === 'cast' && 'Distribution'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-12">
            {/* Synopsis */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {movie.synopsis}
              </p>
            </section>

            {/* Details Grid */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Détails</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Film className="w-5 h-5 text-red-600" />
                    <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Réalisateur</h3>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">{movie.director}</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-red-600" />
                    <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Scénaristes</h3>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">{movie.writers.join(', ')}</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Date de sortie</h3>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">{movie.releaseDate}</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-red-600" />
                    <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Langue</h3>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">{movie.language}</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-red-600" />
                    <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Budget</h3>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">{movie.budget}</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-red-600" />
                    <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Box Office</h3>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">{movie.boxOffice}</p>
                </div>
              </div>
            </section>

            {/* Cast Preview */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Distribution principale</h2>
                <button 
                  onClick={() => setSelectedTab('cast')}
                  className="text-red-600 hover:text-red-700 flex items-center gap-2 font-semibold"
                >
                  Voir tout
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {cast.slice(0, 6).map((actor, idx) => (
                  <div 
                    key={idx}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3 aspect-square shadow-md">
                      <img 
                        src={actor.image} 
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-gray-900 font-semibold text-sm mb-1">{actor.name}</h3>
                    <p className="text-gray-600 text-xs">{actor.role}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Cast Tab */}
        {selectedTab === 'cast' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Distribution complète</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {cast.map((actor, idx) => (
                <div 
                  key={idx}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg mb-3 aspect-square bg-gray-100 shadow-md">
                    <img 
                      src={actor.image} 
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-1">{actor.name}</h3>
                  <p className="text-gray-600 text-sm">{actor.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        

        {/* Similar Movies */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Autres vidéos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarMovies.map((movie) => (
              <div 
                key={movie.id}
                className="group cursor-pointer"
              >
                <div className="relative rounded-lg overflow-hidden mb-3 aspect-[2/3] bg-gray-100 shadow-md">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold text-gray-900">{movie.rating}</span>
                  </div>
                </div>
                <h3 className="text-gray-900 font-semibold">{movie.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>

      
    </div>
  );
}
