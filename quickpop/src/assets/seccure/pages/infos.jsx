import React, { useState, useEffect } from 'react';
import { Play, Plus, Share2, Star, Calendar, Globe, Award, Users, Film, X, EyeOff, CheckCircle, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVideo, getVideos, rateVideo } from '../../config/services/videos.js';
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
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [fetchedMovie, setFetchedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [ratingHover, setRatingHover] = useState(0);
  const [watchStatus, setWatchStatus] = useState('unwatched'); // unwatched, watching, watched

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
      
      // Check watch status from localStorage
      const savedTime = localStorage.getItem(`video-progress-${fetchedMovie.id}`);
      if (savedTime) {
        const time = parseFloat(savedTime);
        const duration = fetchedMovie.duration || 0;
        
        // If progress is > 90% or within last 30 seconds, consider watched
        if ((duration > 0 && time > duration * 0.9) || (duration > 0 && duration - time < 30)) {
           setWatchStatus('watched');
        } else if (time > 10) { // Consider watching if more than 10 seconds
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
        setNotification({ type: 'success', message: 'Lien copié dans le presse-papier' });
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
          // Filter out current video
          const filtered = videos.filter(v => v.id !== fetchedMovie.id);
          // Map to display format and take top 4
          const formatted = filtered.slice(0, 4).map(v => {
             const views = v.views || v.views_count || 0;
             return {
              id: v.id,
              title: v.title,
              image: v.thumbnail_url || "https://images.unsplash.com/photo-1574267432644-f610f53e6a6f?w=300&h=450&fit=crop",
              rating: views ? (Math.min(views / 100, 10)).toFixed(1) : "N/A"
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
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Inconnue";
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getYear = (dateString) => {
    if (!dateString) return "2024";
    return new Date(dateString).getFullYear().toString();
  };
  
  const movie = fetchedMovie ? {
    title: fetchedMovie.title,
    originalTitle: fetchedMovie.title,
    tagline: fetchedMovie.description, // No tagline in DB
    year: getYear(fetchedMovie.created_at),
    rating: 0, // No rating in DB yet, maybe use views?
    votes: `${fetchedMovie.views || fetchedMovie.views_count || 0} vues`,
    duration: formatDuration(fetchedMovie.duration),
    releaseDate: formatDate(fetchedMovie.created_at),
    genres: ["Vidéo"], // We only have category_id, would need another fetch or store cat name
    language: "Français", // Assumption
    country: "France", // Assumption
    budget: "-",
    boxOffice: "-",
    director: "QuickPop", // or uploader
    writers: [],
    synopsis: fetchedMovie.description || "Aucune description disponible.",
    posterUrl: fetchedMovie.thumbnail_url ,
    backdropUrl: fetchedMovie.thumbnail_url ,
  } : {
      title: "Chargement...",
      originalTitle: "",
      tagline: "",
      year: "",
      rating: 0,
      votes: "",
      duration: "",
      releaseDate: "",
      genres: [],
      language: "",
      country: "",
      budget: "",
      boxOffice: "",
      director: "",
      writers: [],
      synopsis: "",
      posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=750&fit=crop",
      backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
  };

  const handleRate = async (score) => {
    try {
      const res = await rateVideo(fetchedMovie.id, score);
      if (res.success) {
        setFetchedMovie(prev => ({
          ...prev,
          average_rating: res.average,
          total_rating_score: res.total_score
        }));
      }
    } catch (err) {
      console.error("Error rating video:", err);
    }
  };

  const movieDetails = fetchedMovie || movie;
  const rating = movieDetails?.average_rating ? Number(movieDetails.average_rating).toFixed(1) : "N/A";
  const likes = movieDetails?.total_rating_score || 0;
  const views = movieDetails?.views || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }


  const handleToggleOffline = async () => {
    if (!fetchedMovie) return;
    
    try {
      if (isOffline) {
        await removeOfflineVideo(fetchedMovie.id);
        setIsOffline(false);
        setNotification({ type: 'success', message: 'Vidéo supprimée du mode hors ligne' });
      } else {
        setIsDownloading(true);
        setDownloadProgress(0);

        let categoryName = 'Autres';
        if (fetchedMovie.category_id) {
          try {
            const cat = await getCategory(fetchedMovie.category_id);
            if (cat && cat.name) categoryName = cat.name;
          } catch (e) {
            console.error('Failed to fetch category name for offline storage', e);
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
        }, (progress) => {
          setDownloadProgress(progress);
        });
        
        setIsOffline(true);
        setNotification({ type: 'success', message: 'Vidéo téléchargée avec succès' });
      }
    } catch (error) {
      console.error('Offline toggle failed:', error);
      setNotification({ type: 'error', message: 'Erreur lors du téléchargement. Vérifiez votre connexion.' });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const cast = [
    { name: "Place de Clichy", role: "Quick", image: "https://www.cfnewsimmo.net/var/cfnews/storage/images/9/1/8/4/13754819-1-fre-FR/49516-image.jpg" },
    { name: "Sebastopol", role: "Quick", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/64/a6/8a/photo-restaurant.jpg?w=900&h=500&s=1" },
    { name: "Opéra", role: "Quick", image: "https://static.actu.fr/uploads/2023/12/quick.jpg" },
    { name: "Barbès", role: "Gurney Halleck", image: "https://media.licdn.com/dms/image/v2/D4D22AQHs7LgsFmDWug/feedshare-shrink_800/B4DZPfoLDpGkAg-/0/1734623671347?e=2147483647&v=beta&t=nv9653k290hZ3w6Nxa_GaHtvvmW0qsBPfHl83BOjG-E" },
    { name: "Gare du Nord", role: "Quick", image: "https://i.pinimg.com/736x/bf/69/eb/bf69eb28164fd39f11bdee25af23fdeb.jpg" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 transition-all duration-500 transform translate-y-0 opacity-100 border ${
          notification.type === 'success' 
            ? 'bg-white border-green-100 text-green-800' 
            : 'bg-white border-red-100 text-red-800'
        }`}>
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
             {notification.type === 'success' ? <Plus className="w-5 h-5 transform rotate-45 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
          </div>
          <span className="font-semibold text-sm">{notification.message}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url(${movie.backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
        </div>
        
        {/* Nav Positioned Absolute */}
        <div className="absolute top-6 right-6 z-50">
           <Nav />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-48 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Poster & Actions */}
          <div className="flex-shrink-0 flex flex-col items-center lg:items-start gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="relative w-64 md:w-80 rounded-2xl shadow-2xl object-cover aspect-[2/3] ring-1 ring-gray-900/5"
              />
              
              {/* Floating Status Badge */}
              {watchStatus === 'watched' ? (
                <>
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-green-500/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-green-400/30 shadow-lg z-20">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-xs font-bold tracking-wide">Regardé</span>
                  </div>
                  {/* Certification Badge centered on poster */}
                  <Badge />
                </>
              ) : watchStatus === 'watching' ? (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-orange-500/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-orange-400/30 shadow-lg z-20">
                  <Clock className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-bold tracking-wide">En cours</span>
                </div>
              ) : (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg z-20">
                  <EyeOff className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-white text-xs font-bold tracking-wide">Non regardé</span>
                </div>
              )}
            </div>

            {/* Primary Actions (Mobile/Desktop split) */}
            <div className="w-full space-y-3">
               <button
                  disabled={!fetchedMovie?.id}
                  onClick={() => {
                    if (fetchedMovie?.id) {
                      navigate(`/app/play?id=${fetchedMovie.id}`, { 
                        state: { 
                          videoUrl: fetchedMovie.video_url, 
                          videoId: fetchedMovie.id, 
                          title: movie.title 
                        } 
                      });
                    }
                  }}
                  className={`w-full py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-600/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 ${!fetchedMovie?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Play className="w-6 h-6 fill-current" />
                  Regarder
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleToggleOffline}
                    disabled={isDownloading}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                      isOffline
                        ? 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                     {isDownloading ? (
                       <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                     ) : isOffline ? (
                       <X className="w-4 h-4" />
                     ) : (
                       <Plus className="w-4 h-4" />
                     )}
                     {isDownloading ? `${Math.round(downloadProgress)}%` : (isOffline ? 'Supprimer' : 'Ma liste')}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>
            </div>
          </div>

          {/* Right Column: Info & Details */}
          <div className="flex-1 pt-4 lg:pt-16">
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none mb-4">
                {movie.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 font-medium italic leading-relaxed">
                "{movie.tagline}"
              </p>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
               {movie.genres.map((genre, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-200/50 text-gray-700 text-sm font-bold rounded-lg uppercase tracking-wider">
                    {genre}
                  </span>
               ))}
               <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
               <span className="text-gray-600 font-medium">{movie.year}</span>
               <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
               <span className="text-gray-600 font-medium">{movie.duration}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
               <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-yellow-200 transition-colors">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold text-gray-900">{rating}</span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Note Moyenne</span>
               </div>
               <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-green-200 transition-colors">
                  <Award className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold text-gray-900">{likes}</span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Popularité</span>
               </div>
               <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-blue-200 transition-colors">
                  <Users className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold text-gray-900">{views}</span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Vues</span>
               </div>
               <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-purple-200 transition-colors">
                  <Globe className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xl font-bold text-gray-900 truncate max-w-full">{movie.language}</span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Langue</span>
               </div>
            </div>

            {/* Rate It */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div>
                  <h3 className="text-lg font-bold text-gray-900">Votre avis compte</h3>
                  <p className="text-gray-500 text-sm">Notez cette vidéo pour améliorer les recommandations</p>
               </div>
               <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setRatingHover(star)}
                    onMouseLeave={() => setRatingHover(0)}
                    className="focus:outline-none transition-transform hover:scale-110 p-1"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        star <= (ratingHover || Math.round(Number(rating) || 0))
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
                          : 'text-gray-200'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                {['overview', 'cast'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`pb-4 px-2 font-bold text-sm uppercase tracking-wider transition-colors relative ${
                      selectedTab === tab
                        ? 'text-red-600'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab === 'overview' && 'Synopsis & Infos'}
                    {tab === 'cast' && 'Distribution'}
                    {selectedTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in-up">
               {selectedTab === 'overview' && (
                  <div className="space-y-8">
                     <div>
                        <p className="text-lg text-gray-700 leading-8 text-justify">
                           {movie.synopsis}
                        </p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                           <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Film className="w-5 h-5 text-gray-700" />
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-gray-900">Réalisateur</h4>
                              <p className="text-gray-600">{movie.director}</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                           <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Calendar className="w-5 h-5 text-gray-700" />
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-gray-900">Date de sortie</h4>
                              <p className="text-gray-600">{movie.releaseDate}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {selectedTab === 'cast' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {cast.slice(0, 8).map((actor, idx) => (
                      <div key={idx} className="group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                           <img src={actor.image} alt={actor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="p-3 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 text-white">
                          <p className="font-bold text-sm truncate">{actor.name}</p>
                          <p className="text-xs text-gray-300 truncate">{actor.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               )}
            </div>

          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {similarMovies.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {similarMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/app/info/${movie.id}`)}
                >
                  <div className="relative rounded-2xl overflow-hidden mb-3 aspect-[2/3] bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-900">{movie.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-gray-900 font-bold group-hover:text-red-600 transition-colors line-clamp-1">{movie.title}</h3>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}