import React, { useState, useEffect } from 'react';
import { Play, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeAnimate from '../components/homeAnimate.jsx';
import api from '../../config/api.js';

export default function StreamingHomepage() {
  const navigate = useNavigate();
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
      <section className="relative -z-2 h-screen w-full ">
        <HomeAnimate 
          items={latestVideos.length > 0 ? latestVideos : undefined} 
          key={latestVideos.length} 
        />
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Featured Section */}
      <motion.section
        className="relative mt-8  pb-12"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">À la une</h2>
            </div>
            <button onClick={() => { navigate('/app/category'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sm font-semibold text-red-600 hover:text-red-700 transition">
              Voir tout
            </button>
          </div>

          <div className="relative group">
            <motion.div
              className="flex gap-4  overflow-x-auto pb-6 -ms-1 py-6 lg:mx-0 lg:px-0 no-scrollbar snap-x snap-mandatory"
              variants={stagger}
            >
              {featuredVideos.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="min-w-[160px] md:min-w-[200px] lg:min-w-[220px] snap-start"
                  onClick={() => navigate(`/app/info/${item.id}`)}
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group/card">
                     {item.thumbnail_url ? (
                        <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.thumb}`} />
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover/card:scale-100 transition-transform duration-300">
                            <Play className="w-5 h-5 text-black fill-black ml-1" />
                         </div>
                      </div>
                      
                      {/* Top Left Rank/Badge */}
                       <div className="absolute top-2 left-2">
                        <div className="w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                          <span className="text-xs text-white font-bold">{index + 1}</span>
                        </div>
                      </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{item.year}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400"/> {item.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Trending Section */}
      <motion.section
        className="pb-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
           <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Tendance</h2>
              <p className="text-gray-500 text-sm">Les pépites du moment</p>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {trendingVideos.slice(0, 5).map((item, index) => {
               const isFirst = index === 0;
               return (
                <motion.div
                  key={item.id}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group ${isFirst ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'}`}
                  onClick={() => navigate(`/app/info/${item.id}`)}
                >
                   {item.thumbnail_url ? (
                      <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.thumb}`} />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                       {isFirst && <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold rounded mb-2">TOP TENDANCE</span>}
                       <h3 className={`font-bold text-white mb-1 leading-tight ${isFirst ? 'text-2xl' : 'text-base'}`}>{item.title}</h3>
                       <div className="flex items-center gap-3 text-white/80 text-xs font-medium">
                          <span>{item.episodes}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {item.views}</span>
                       </div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                           <Play className="w-5 h-5 text-white fill-white ml-1" />
                        </div>
                    </div>
                </motion.div>
               )
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
