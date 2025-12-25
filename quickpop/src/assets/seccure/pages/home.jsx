import React, { useState, useEffect } from 'react';
import { Play, Search, Star, Info, Plus, ChevronRight, Volume2, VolumeX, Eye, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeAnimate from '../components/homeAnimate.jsx';
import api from '../../config/api.js';

export default function StreamingHomepage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await api.get('/videos/latest-by-category?limit=6');
        const formatted = data.map(video => ({
          id: video.id,
          title: video.title,
          description: video.description || "Découvrez ce contenu exclusif sur QuickPop.",
          video: video.video_url,
          poster: video.thumbnail_url,
          rating: parseFloat(video.average_rating || 0).toFixed(1),
          views: video.views || 0,
          likes: video.total_rating_score || 0, // Calculated from stars as requested
          year: new Date(video.created_at).getFullYear(),
          runtime: video.duration ? `${Math.floor(video.duration/60)}min` : '',
          genres: [video.category_name || 'Général'],
          thumb: "from-purple-900 via-fuchsia-800 to-pink-900", // Fallback gradient
          thumbnail_url: video.thumbnail_url
        }));
        setLatestVideos(formatted);
      } catch (err) {
        console.error("Failed to fetch latest videos:", err);
      }
    };

    const fetchFeatured = async () => {
      try {
        const data = await api.get('/videos/featured?limit=6');
        const formatted = data.map(video => ({
          id: video.id,
          title: video.title,
          description: video.description || "Découvrez ce contenu exclusif sur QuickPop.",
          video: video.video_url,
          poster: video.thumbnail_url,
          rating: parseFloat(video.average_rating || 0).toFixed(1),
          views: video.views || 0,
          likes: video.total_rating_score || 0,
          year: new Date(video.created_at).getFullYear(),
          runtime: video.duration ? `${Math.floor(video.duration/60)}min` : '',
          genres: [video.category_name || 'Général'],
          thumb: "from-purple-900 via-fuchsia-800 to-pink-900", // Fallback gradient
          thumbnail_url: video.thumbnail_url
        }));
        setFeaturedVideos(formatted);
      } catch (err) {
        console.error("Failed to fetch featured videos:", err);
      }
    };

    const fetchTrending = async () => {
      try {
        const data = await api.get('/videos/trending?limit=8');
        const formatted = data.map((video, index) => ({
          id: video.id,
          title: video.title,
          episodes: video.duration ? `${Math.floor(video.duration/60)} min` : 'Nouveau',
          thumb: index % 2 === 0 ? "from-indigo-600 to-purple-700" : "from-amber-600 to-red-700",
          thumbnail_url: video.thumbnail_url,
          rating: parseFloat(video.average_rating || 0).toFixed(1),
          views: video.views || 0,
          likes: video.total_rating_score || 0,
        }));
        setTrendingVideos(formatted);
      } catch (err) {
        console.error("Failed to fetch trending videos:", err);
      }
    };

    fetchLatest();
    fetchFeatured();
    fetchTrending();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const stagger = {
    show: { transition: { staggerChildren: 0.12 } }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative z-20 h-screen w-full ">
        <HomeAnimate items={latestVideos.length > 0 ? latestVideos : undefined} />
      </section>

      {/* Featured Section */}
      <motion.section
        className="relative mt-12 z-10 pb-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight">À la une</h2>
              <p className="text-sm text-gray-400">Mis à jour récemment</p>
            </div>
            <button onClick={() => { navigate('/app/category'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center justify-center space-x-2 text-sm font-semibold text-gray-400 hover:text-white transition group">
              <span className="tracking-wide p-0">Voir plus</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform p-0" />
            </button>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            variants={stagger}
          >
            {featuredVideos.map((item, index) => (
              <motion.div
                variants={fadeUp}
                key={item.id}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(`/app/info/${item.id}`)}
              >
                <div className={`relative rounded-lg aspect-[2/3] overflow-hidden shadow-2xl transform transition-all duration-500 ${hoveredCard === item.id ? 'scale-105 shadow-3xl' : ''}`}>
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.thumb}`} />
                  )}
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

                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs text-white font-bold tabular-nums">{item.views}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      <ThumbsUp className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-white font-bold tabular-nums">{item.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs text-white font-bold tabular-nums">{item.rating}</span>
                    </div>
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Trending Section */}
      <motion.section
        className="pb-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Tendance</h2>
              <p className="text-gray-500 text-sm tracking-wide">Les vidéos les plus populaires du moment</p>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={stagger}
          >
            {trendingVideos.map((item) => (
              <motion.div
                variants={fadeUp}
                key={item.id}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/app/info/${item.id}`)}
              >
                <div className={`relative bg-gradient-to-br ${item.thumb} rounded-xl aspect-video overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105`}>
                  {item.thumbnail_url && (
                    <img src={item.thumbnail_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                      <Play className="w-7 h-7 text-black fill-black ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-red-600 rounded text-xs font-bold tracking-wider">
                      POPULAIRE
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs text-white font-bold tabular-nums">{item.views}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      <ThumbsUp className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-white font-bold tabular-nums">{item.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs text-white font-bold tabular-nums">{item.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-lg mb-1 tracking-tight group-hover:text-gray-300 transition">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.episodes}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
