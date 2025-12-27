import React, { useState, useEffect } from 'react';
import { Play, Plus, Share2, Star, Calendar, Globe, Award, Users, Film, X, EyeOff, CheckCircle, Clock, ChevronLeft, Download, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getVideo, getVideos } from '../../config/services/videos.js';
import { getCategory } from '../../config/services/category.js';
import { saveOfflineVideo, removeOfflineVideo, isVideoOffline } from '../../config/services/offline.js';
import Nav from '../components/Nav.jsx'
import Badge from '../components/badge.jsx';

export default function MovieDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOffline, setIsOffline] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedMovie, setFetchedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [watchStatus, setWatchStatus] = useState('unwatched');

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setFetchedMovie(null);
      setSimilarMovies([]);
      try {
        const data = await getVideo(id);
        setFetchedMovie(data);
      } catch (err) {
        console.error("Failed to fetch video details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id]);

  useEffect(() => {
    if (fetchedMovie?.id) {
      isVideoOffline(fetchedMovie.id).then(setIsOffline);
      
      const savedTime = localStorage.getItem(`video-progress-${fetchedMovie.id}`);
      if (savedTime) {
        const time = parseFloat(savedTime);
        const duration = fetchedMovie.duration || 0;
        
        if ((duration > 0 && time > duration * 0.9) || (duration > 0 && duration - time < 30)) {
           setWatchStatus('watched');
        } else if (time > 10) {
           setWatchStatus('watching');
        } else {
           setWatchStatus('unwatched');
        }
      } else {
        setWatchStatus('unwatched');
      }
    }
  }, [fetchedMovie]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleShare = async () => {
    const shareData = {
      title: movie.title,
      text: `Regarde ${movie.title} sur QuickPop !`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
           console.error('Error sharing:', err);
           setNotification({ type: 'error', message: 'Erreur lors du partage' });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setNotification({ type: 'success', message: 'Lien copié' });
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        setNotification({ type: 'error', message: 'Impossible de copier le lien' });
      }
    }
  };

  useEffect(() => {
    if (fetchedMovie?.category_id) {
      const fetchSimilar = async () => {
        try {
          const videos = await getVideos({ category_id: fetchedMovie.category_id, limit: 10 });
          const filtered = videos.filter(v => v.id !== fetchedMovie.id);
          const formatted = filtered.slice(0, 4).map(v => {
             const views = v.views || v.views_count || 0;
             
             // Calculate Match Score
             let matchScore = 80; // Base score for same category
             
             // Duration similarity (within 20%)
             if (v.duration && fetchedMovie.duration) {
               const diff = Math.abs(v.duration - fetchedMovie.duration);
               if (diff < (fetchedMovie.duration * 0.2)) matchScore += 10;
               else if (diff < (fetchedMovie.duration * 0.4)) matchScore += 5;
             }

             // View count similarity (popularity tier)
             const currentViews = fetchedMovie.views || fetchedMovie.views_count || 0;
             if (Math.abs(views - currentViews) < 100) matchScore += 5;

             // Cap at 98%
             matchScore = Math.min(matchScore, 98);
             // Ensure min 60%
             matchScore = Math.max(matchScore, 60);

             // Calculate Newness (last 30 days)
             const created = new Date(v.created_at);
             const now = new Date();
             const diffTime = Math.abs(now - created);
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
             const isNew = diffDays <= 30;

             return {
              id: v.id,
              title: v.title,
              image: v.thumbnail_url || "https://images.unsplash.com/photo-1574267432644-f610f53e6a6f?w=300&h=450&fit=crop",
              rating: views ? (Math.min(views / 100, 10)).toFixed(1) : "N/A",
              matchScore,
              isNew,
              created_at: v.created_at
            };
          });
          setSimilarMovies(formatted);
        } catch (err) {
          console.error("Failed to fetch similar videos", err);
        }
      }
      fetchSimilar();
    }
  }, [fetchedMovie]);

  const formatDuration = (seconds) => {
    if (!seconds) return "0min";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Inconnue";
    return new Date(dateString).getFullYear().toString();
  };

  const movie = fetchedMovie ? {
    title: fetchedMovie.title,
    originalTitle: fetchedMovie.title,
    tagline: fetchedMovie.description ? fetchedMovie.description.substring(0, 100) + "..." : "",
    year: formatDate(fetchedMovie.created_at),
    rating: 0,
    votes: `${fetchedMovie.views || fetchedMovie.views_count || 0} vues`,
    duration: formatDuration(fetchedMovie.duration),
    genres: ["Formation"],
    language: "Français",
    country: "France",
    synopsis: fetchedMovie.description || "Aucune description disponible pour cette formation.",
    posterUrl: fetchedMovie.thumbnail_url,
    backdropUrl: fetchedMovie.thumbnail_url,
  } : {
      title: "Chargement...",
      year: "",
      duration: "",
      genres: [],
      synopsis: "",
      posterUrl: "",
      backdropUrl: "",
  };

  const handleToggleOffline = async () => {
    if (!fetchedMovie) return;
    try {
      if (isOffline) {
        await removeOfflineVideo(fetchedMovie.id);
        setIsOffline(false);
        setNotification({ type: 'success', message: 'Retiré des téléchargements' });
      } else {
        setIsDownloading(true);
        setDownloadProgress(0);
        let categoryName = 'Autres';
        if (fetchedMovie.category_id) {
          try {
            const cat = await getCategory(fetchedMovie.category_id);
            if (cat && cat.name) categoryName = cat.name;
          } catch (error) {
             console.log(error);
          }
        }
        await saveOfflineVideo({
          id: fetchedMovie.id,
          title: fetchedMovie.title,
          video_url: fetchedMovie.video_url,
          thumbnail_url: fetchedMovie.thumbnail_url,
          duration: fetchedMovie.duration,
          category_id: fetchedMovie.category_id,
          category_name: categoryName,
          created_at: fetchedMovie.created_at
        }, (progress) => setDownloadProgress(progress));
        setIsOffline(true);
        setNotification({ type: 'success', message: 'Téléchargé avec succès' });
      }
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: 'Erreur lors du téléchargement' });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const cast = [
    { name: "Admin", role: "QuickPop", image: "/imgs/logo.png" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 z-[100] px-6 py-3 rounded-full shadow-xl border flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'
            }`}
          >
             {notification.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
             <span className="font-medium text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
        <button onClick={() => navigate(-1)} className="pointer-events-auto w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow-sm transition">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div className="pointer-events-auto">
          <Nav />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src={movie.backdropUrl} 
            alt="Backdrop" 
            className="w-full h-full object-cover"
          />
          {/* Light Theme Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
        </motion.div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 lg:px-24 pb-12 md:pb-16 z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Metadata Badges */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 mb-4 text-sm font-semibold">
               <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">98% recommandé</span>
               <span className="text-gray-600">{movie.year}</span>
               <span className="w-1 h-1 rounded-full bg-gray-300"></span>
               <span className="text-gray-600">{movie.duration}</span>
               <span className="w-1 h-1 rounded-full bg-gray-300"></span>
               <span className="border border-gray-300 px-1 rounded text-xs text-gray-500 uppercase">HD</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[0.95] mb-6 drop-shadow-sm"
            >
              {movie.title}
            </motion.h1>

            {/* Action Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (fetchedMovie?.id) {
                    navigate(`/app/play?id=${fetchedMovie.id}`, { 
                      state: { videoUrl: fetchedMovie.video_url, videoId: fetchedMovie.id, title: movie.title } 
                    });
                  }
                }}
                className="bg-red-600 text-white px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg shadow-red-600/20 flex items-center gap-2 transform active:scale-95"
              >
                <Play className="fill-current w-5 h-5" />
                {watchStatus === 'watching' ? 'Reprendre' : 'Lecture'}
              </button>

              <button
                onClick={handleToggleOffline}
                className="bg-white/80 backdrop-blur text-gray-900 border border-gray-200 px-6 py-3.5 rounded-lg font-bold text-lg hover:bg-white transition flex items-center gap-2 transform active:scale-95"
              >
                {isDownloading ? (
                   <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"/>
                ) : isOffline ? (
                   <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                   <Plus className="w-5 h-5" />
                )}
                <span>{isDownloading ? `${Math.round(downloadProgress)}%` : (isOffline ? 'Téléchargé' : 'Ma liste')}</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Content Section Below Fold */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-24">
          
          {/* Main Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-6 text-gray-600 border-b border-gray-100 pb-6">
               <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Note</span>
                  <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {fetchedMovie?.average_rating ? Number(fetchedMovie.average_rating).toFixed(1) : "N/A"}
                  </div>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Vues</span>
                  <span className="text-lg font-bold text-gray-900">{fetchedMovie?.views || 0}</span>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Langue</span>
                  <span className="text-lg font-bold text-gray-900">FR</span>
               </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Synopsis</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {movie.synopsis}
              </p>
            </div>
          </div>

          {/* Sidebar / Extra Info */}
          <div className="space-y-8">
            <div>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Distribution</h3>
               <div className="space-y-3">
                 {cast.map((actor, idx) => (
                   <div key={idx} className="flex items-center gap-3">
                     <img src={actor.image} alt={actor.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                     <div>
                       <p className="text-sm font-bold text-gray-900">{actor.name}</p>
                       <p className="text-xs text-gray-500">{actor.role}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Partager</h3>
               <button onClick={handleShare} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition font-medium">
                 <Share2 className="w-5 h-5" />
                 Partager ce contenu
               </button>
            </div>
          </div>

        </div>

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Contenus similaires</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarMovies.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/app/info/${item.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-300">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 text-red-600 fill-current" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-green-600 border border-green-200 bg-green-50 px-1.5 rounded">{item.matchScore}% match</span>
                    {item.isNew ? (
                      <span className="text-xs text-red-500 font-medium border border-red-100 bg-red-50 px-1.5 rounded">Nouveauté</span>
                    ) : (
                      <span className="text-xs text-gray-400">{new Date(item.created_at).getFullYear()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
