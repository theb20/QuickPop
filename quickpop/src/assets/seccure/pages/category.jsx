import React, { useState } from 'react';
import { Search, Star, Play, Plus, Info, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../seccure/components/search.jsx'

export default function MoviesCategory() {
  const [selectedGenre, setSelectedGenre] = useState('tous');
  const navigate = useNavigate();

  const movies = [
    {
      id: 1,
      title: "Dune: Part Two",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
      rating: 8.5,
      year: "2024",
      duration: "2h 46min",
      genre: "Science-Fiction",
      trending: true,
      description: "Paul Atreides s'unit à Chani et aux Fremen pour mener la révolte contre ceux qui ont détruit sa famille."
    },
    {
      id: 2,
      title: "Oppenheimer",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
      rating: 8.9,
      year: "2023",
      duration: "3h 00min",
      genre: "Drame",
      trending: false,
      description: "L'histoire du physicien J. Robert Oppenheimer et son rôle dans le développement de la bombe atomique."
    },
    {
      id: 3,
      title: "The Batman",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
      rating: 7.8,
      year: "2022",
      duration: "2h 56min",
      genre: "Action",
      trending: false,
      description: "Batman s'aventure dans les bas-fonds de Gotham City pour traquer un tueur qui cible l'élite."
    },
    {
      id: 4,
      title: "Inception",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
      rating: 8.8,
      year: "2010",
      duration: "2h 28min",
      genre: "Thriller",
      trending: true,
      description: "Un voleur qui s'infiltre dans les rêves se voit offrir une chance de retrouver sa vie d'avant."
    },
    {
      id: 5,
      title: "Interstellar",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
      rating: 8.6,
      year: "2014",
      duration: "2h 49min",
      genre: "Science-Fiction",
      trending: false,
      description: "Une équipe d'explorateurs voyage à travers un trou de ver pour assurer la survie de l'humanité."
    },
    {
      id: 6,
      title: "Parasite",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
      rating: 8.5,
      year: "2019",
      duration: "2h 12min",
      genre: "Thriller",
      trending: false,
      description: "Une famille pauvre s'introduit progressivement dans la vie d'une famille riche avec des conséquences inattendues."
    },
    {
      id: 7,
      title: "The Godfather",
      image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
      rating: 9.2,
      year: "1972",
      duration: "2h 55min",
      genre: "Drame",
      trending: true,
      description: "Le parrain vieillissant d'une dynastie criminelle transfère le contrôle de son empire à son fils réticent."
    },
    {
      id: 8,
      title: "Mad Max: Fury Road",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
      rating: 8.1,
      year: "2015",
      duration: "2h 00min",
      genre: "Action",
      trending: false,
      description: "Dans un désert post-apocalyptique, Max s'allie à Furiosa pour échapper à un tyran."
    },
    {
      id: 9,
      title: "Blade Runner 2049",
      image: "https://images.unsplash.com/photo-1574267432644-f610f53e6a6f?w=400&h=600&fit=crop",
      rating: 8.0,
      year: "2017",
      duration: "2h 44min",
      genre: "Science-Fiction",
      trending: false,
      description: "Un blade runner découvre un secret qui pourrait plonger la société dans le chaos."
    }
  ];

  const genres = ['Tous', 'Détartrages', 
'Ruptures',
'Technique',
'ADM'];

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
      <div id="category-sticky" className=" top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre.toLowerCase())}
                className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
                  selectedGenre === genre.toLowerCase()
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{movies.length} vidéos disponibles</h2>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 hover:text-gray-900 transition">
              Les mieux notés
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 transition">
              Les plus récents
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group cursor-pointer"
            >
              <div className="relative rounded-lg overflow-hidden mb-3 aspect-[2/3] bg-gray-100 shadow-md">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                  <button onClick={() => navigate(`/app/info`)} className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition transform hover:scale-110 shadow-lg">
                    <Play className="w-5 h-5 ml-1 text-white" fill="white" />
                  </button>
                  
                  <div className="flex gap-2">
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition border border-gray-300">
                      <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition border border-gray-300">
                      <Info className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-700 text-center line-clamp-3">
                    {movie.description}
                  </p>
                </div>
                
                {/* Trending Badge */}
                {movie.trending && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                    TENDANCE
                  </div>
                )}
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-900">{movie.rating}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition line-clamp-1">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span>{movie.duration}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{movie.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
