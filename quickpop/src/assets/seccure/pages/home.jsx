import React, { useState } from 'react';
import { Play, Search, Star, Info, Plus, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomeAnimate from '../components/homeAnimate.jsx';

export default function StreamingHomepage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const trending = [
    { id: 1, title: "Neon Requiem", rating: 9.1, year: 2024, runtime: "52min", genres: ["Drama", "Sci-Fi"], thumb: "from-purple-900 via-fuchsia-800 to-pink-900" },
    { id: 2, title: "The Silent Protocol", rating: 8.9, year: 2024, runtime: "2h 18min", genres: ["Thriller", "Action"], thumb: "from-slate-900 via-gray-800 to-zinc-900" },
    { id: 3, title: "Quantum Hearts", rating: 9.3, year: 2023, runtime: "48min", genres: ["Romance", "Sci-Fi"], thumb: "from-cyan-900 via-blue-800 to-indigo-900" },
    { id: 4, title: "Crimson Valley", rating: 8.7, year: 2024, runtime: "1h 45min", genres: ["Western", "Drama"], thumb: "from-red-900 via-orange-800 to-amber-900" },
    { id: 5, title: "Eclipse Protocol", rating: 9.0, year: 2024, runtime: "55min", genres: ["Mystery", "Thriller"], thumb: "from-emerald-900 via-teal-800 to-cyan-900" },
    { id: 6, title: "Fractured Minds", rating: 8.8, year: 2024, runtime: "2h 5min", genres: ["Psychological", "Drama"], thumb: "from-violet-900 via-purple-800 to-fuchsia-900" }
  ];

  const originals = [
    { id: 7, title: "Urban Legends", episodes: 8, thumb: "from-indigo-600 to-purple-700" },
    { id: 8, title: "Beyond the Horizon", episodes: 10, thumb: "from-amber-600 to-red-700" },
    { id: 9, title: "The Last Archive", episodes: 6, thumb: "from-teal-600 to-cyan-700" },
    { id: 10, title: "Midnight Protocol", episodes: 12, thumb: "from-rose-600 to-pink-700" }
  ];

  return (
    <div className="min-h-screen bg-white text-black">     
      {/* Hero Section */}
      <section className="relative h-screen w-full ">
        <HomeAnimate title="Tendances" />
      </section>

      {/* Trending Now */}
      <section className="relative mt-12 z-10 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div className="">
            <h2 className="text-3xl font-black tracking-tight">À la une</h2>
            <p className="text-sm text-gray-400">Mis à jour récemment</p>
            </div>
            <button onClick={() => { navigate('/app/category'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center justify-center space-x-2 text-sm font-semibold text-gray-400 hover:text-white transition group">
              <span className="tracking-wide p-0">Voir plus</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform p-0" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trending.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`relative bg-gradient-to-br ${item.thumb} rounded-lg aspect-[2/3] overflow-hidden shadow-2xl transform transition-all duration-500 ${hoveredCard === item.id ? 'scale-105 shadow-3xl' : ''}`}>
                  <div className={`absolute inset-0 bg-black transition-all duration-500 ${hoveredCard === item.id ? 'bg-opacity-40' : 'bg-opacity-0'}`}>
                    <div className={`absolute inset-0 flex flex-col items-center justify-center transform transition-all duration-500 ${hoveredCard === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                      <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform shadow-2xl">
                        <Play className="w-7 h-7 text-black fill-black ml-1" />
                      </button>
                      <div className="flex items-center space-x-2">
                        <button className="w-10 h-10 bg-black/60 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-black/80 transition">
                          <Plus color='white' className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 bg-black/60 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-black/80 transition">
                          <Info color='white' className="w-5 h-5 " />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4">
                    <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                      <span className="text-lg text-white font-black">{index + 1}</span>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs text-white font-bold">{item.rating}</span>
                  </div>
                </div>

                <div className={`mt-4 transition-all duration-300 ${hoveredCard === item.id ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'}`}>
                  <h3 className="font-bold text-base mb-1 tracking-tight">{item.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{item.year}</span>
                    <span>•</span>
                    <span>{item.runtime}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {item.genres.slice(0, 2).map((genre, i) => (
                      <span key={i} className="text-xs text-gray-400 font-medium">{genre}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Original Series */}
      <section className="pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>

              <h2 className="text-3xl font-black tracking-tight mb-2">Les plus important</h2>
              <p className="text-gray-500 text-sm tracking-wide">Les contenus essentiels à voir en priorité</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {originals.map((item) => (
              <div key={item.id} className="group relative cursor-pointer">
                <div className={`relative bg-gradient-to-br ${item.thumb} rounded-xl aspect-video overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105`}>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                      <Play className="w-7 h-7 text-black fill-black ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-red-600 rounded text-xs font-bold tracking-wider">
                      ORIGINAL
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-lg mb-1 tracking-tight group-hover:text-gray-300 transition">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.episodes} Episodes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
