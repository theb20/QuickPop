import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  SkipBack, SkipForward, ChevronLeft, Loader, AlertCircle, Award, Heart
} from 'lucide-react';
import api from '../../config/api';
import { updateVideoProgress } from '../../config/services/videos.js';
import { getOfflineVideo } from '../../config/services/offline.js';
import { getLikes, createLike, deleteLike } from '../../config/services/likes.js';
import { useAuth } from '../../config/hooks/auth.js';
import CertificationSuccess from '../components/CertificationSuccess.jsx';

export default function VideoPlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // États des données
  const [videoUrl, setVideoUrl] = useState(location.state?.videoUrl || '');
  const [videoId] = useState(location.state?.videoId || searchParams.get('id'));
  const [title, setTitle] = useState(location.state?.title || '');
  const [isLoading, setIsLoading] = useState(!location.state?.videoUrl);
  const [error, setError] = useState(null);

  // États du lecteur
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCertModal, setShowCertModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [retriedOffline, setRetriedOffline] = useState(false);
  const controlsTimeoutRef = useRef(null);
  const certificateAwardedRef = useRef(false);

  // Reset state when videoId changes
  useEffect(() => {
    setRetriedOffline(false);
    setError(null);
    setIsPlaying(false);
    setProgress(0);
    setShowCertModal(false);
  }, [videoId]);

  // 0. Check Like Status
  useEffect(() => {
    if (videoId && user && navigator.onLine) {
      getLikes({ video_id: videoId, user_id: user.id })
        .then(likes => {
          if (likes && likes.length > 0) {
            setIsLiked(true);
            setLikeId(likes[0].id);
          } else {
            setIsLiked(false);
            setLikeId(null);
          }
        })
        .catch(err => console.error("Error fetching likes:", err));
    }
  }, [videoId, user]);

  // 0. Increment Views
  useEffect(() => {
    if (videoId && !isLoading && navigator.onLine) {
      api.post(`/videos/${videoId}/views`).catch(err => console.error("Error incrementing views:", err));
    }
  }, [videoId, isLoading]);

  // 1. Chargement des données si nécessaire
  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId) {
        setError("Aucun identifiant de vidéo fourni");
        setIsLoading(false);
        return;
      }

      if (!videoUrl) {
        setIsLoading(true);
        try {
          if (navigator.onLine) {
            const response = await api.get(`/videos/${videoId}`);
            if (response) {
              let url = response.video_url;
              // Fix for localhost URLs when accessing from IP (mobile testing)
              // Replace localhost with current hostname to allow access from other devices
              if (url && url.includes('localhost') && window.location.hostname !== 'localhost') {
                 url = url.replace('localhost', window.location.hostname);
              }
              setVideoUrl(url);
              setTitle(response.title);
              setIsLoading(false);
              return;
            }
          }
          throw new Error("Try offline");
        } catch (error) {
          console.log("Online fetch failed, trying offline storage...", error);
          try {
            // Try both string and number ID formats
            let offlineVid = await getOfflineVideo(videoId);
            if (!offlineVid && !isNaN(Number(videoId))) {
               offlineVid = await getOfflineVideo(Number(videoId));
            }

            if (offlineVid && offlineVid.blob) {
              const blobToPlay = offlineVid.blob.type ? offlineVid.blob : new Blob([offlineVid.blob], { type: 'video/mp4' });
              const blobUrl = URL.createObjectURL(blobToPlay);
              setVideoUrl(blobUrl);
              setTitle(offlineVid.title);
              setError(null);
            } else {
              setError("Vidéo introuvable (hors ligne)");
            }
          } catch (offlineErr) {
            console.error("Offline load error:", offlineErr);
            setError("Erreur lors du chargement de la vidéo");
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    fetchVideoData();
  }, [videoId, videoUrl]);

  // 2. Sauvegarde/Restauration de la progression
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoId) return;

    const savedTime = localStorage.getItem(`video-progress-${videoId}`);
    if (savedTime) {
      video.currentTime = Number(savedTime);
    }

    const saveProgress = () => {
      localStorage.setItem(`video-progress-${videoId}`, video.currentTime);
    };

    video.addEventListener('timeupdate', saveProgress);
    return () => video.removeEventListener('timeupdate', saveProgress);
  }, [videoId, isLoading]);

  // 3. Gestion des contrôles (Auto-hide)
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('click', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleMouseMove);
      }
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Helpers pour l'URL (Proxy Dropbox/Drive/Backblaze)
  const getSourceUrl = (url) => {
    if (!url) return '';
    
    // Si l'URL est déjà proxifiée ou locale, on la retourne
    if (url.startsWith('http://localhost') || url.startsWith('/')) return url;

    // Détection Backblaze B2 pour passer par le proxy si besoin ou direct
    if (url.includes('backblazeb2.com')) {
       // Si c'est un bucket privé, on doit passer par notre proxy pour signer l'URL ou streamer
       // Ou utiliser l'URL signée retournée par le backend si elle l'est déjà
       // Dans notre cas, le backend renvoie souvent l'URL brute S3.
       // On va forcer le passage par le proxy vidéo pour gérer les headers et la sécurité
       
       // Extraire la clé du fichier (le path après le nom de domaine)
       // Ex: https://s3.eu-central-003.backblazeb2.com/quickpop-videos/ma-video.mp4
       // Key: ma-video.mp4 (si à la racine du bucket)
       
       // Simplification : On envoie l'URL complète au proxy qui saura quoi faire
       const baseUrl = api.defaults.baseURL || '';
       const encodedUrl = encodeURIComponent(url);
       return `${baseUrl}/videos/proxy/stream?url=${encodedUrl}&provider=backblaze`;
    }

    // Détection Dropbox ou Google Drive pour passer par le proxy backend
    // Cela contourne les problèmes de CORS et de range requests
    if (url.includes('dropbox.com') || url.includes('drive.google.com')) {
      const baseUrl = api.defaults.baseURL || '';
      const encodedUrl = encodeURIComponent(url);
      const provider = url.includes('dropbox.com') ? 'dropbox' : 'google_drive';
      
      // Construction de l'URL proxy: /videos/proxy/external
      // Note: api.defaults.baseURL contient déjà le host et le port (ex: http://localhost:3000)
      return `${baseUrl}/videos/proxy/external?url=${encodedUrl}&provider=${provider}`;
    }

    return url;
  };

  // Handlers Vidéo
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const pct = Math.round((current / duration) * 100); // Round to integer
      setProgress((current / duration) * 100); // Keep smooth progress bar

      // Sync progress with server every 10 seconds (approx)
      if (user && videoId && Math.floor(current) % 10 === 0 && current > 0 && navigator.onLine) {
         updateVideoProgress(videoId, pct, current, duration)
           .then(res => {
             if (res && res.certificateAwarded) {
               certificateAwardedRef.current = true;
             }
           })
           .catch(() => console.log('Offline progress sync skipped'));
      }
    }
  };

  const handleVideoEnd = async () => {
    setIsPlaying(false);
    if (user && videoId && videoRef.current) {
        const duration = videoRef.current.duration;
        if (navigator.onLine) {
            try {
                const res = await updateVideoProgress(videoId, 100, duration, duration);
                if ((res && res.certificateAwarded) || certificateAwardedRef.current) {
                    setShowCertModal(true);
                }
            } catch (error) {
                console.log('Offline completion sync skipped', error);
            }
        }
    }
  };

  const handleLikeToggle = async () => {
    if (!user) return;
    try {
        if (isLiked) {
            if (likeId) await deleteLike(likeId);
            setIsLiked(false);
            setLikeId(null);
        } else {
            const newLike = await createLike({ video_id: videoId, user_id: user.id });
            setIsLiked(true);
            setLikeId(newLike.id);
        }
    } catch (err) {
        console.error("Error toggling like:", err);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const seekTime = (e.target.value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress(e.target.value);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/app');
    }
  };

  // 4. Bloquer l'inspecteur (F12, Clic Droit)
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      // Bloquer F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Rendu : Chargement
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white z-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-xl font-semibold">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  // Rendu : Erreur
  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white z-50">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <h2 className="text-2xl font-bold mb-2">Oups !</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={handleBack}
            className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition mx-auto"
          >
            <ChevronLeft size={20} />
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center group overflow-hidden"
    >
      {/* Back Button (Always visible on hover or when controls are shown) */}
      <button
        onClick={handleBack}
        className={`absolute top-6 left-6 z-[60] text-white bg-black/50 p-3 rounded-full hover:bg-black/80 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
      >
        <ChevronLeft size={28} />
      </button>

      <video
        ref={videoRef}
        key={videoUrl}
        src={getSourceUrl(videoUrl)}
        className="w-full h-full object-contain"
        playsInline
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleVideoEnd}
        onClick={togglePlay}
        onError={async (e) => {
          console.error("Video Error Details:", e.target.error);
          
          if (!retriedOffline && videoId) {
             console.log("Attempting offline recovery due to playback error...");
             setRetriedOffline(true);
             try {
                let offlineVid = await getOfflineVideo(videoId);
                if (!offlineVid && !isNaN(Number(videoId))) {
                    offlineVid = await getOfflineVideo(Number(videoId));
                }
                
                if (offlineVid && offlineVid.blob) {
                    const blobToPlay = offlineVid.blob.type ? offlineVid.blob : new Blob([offlineVid.blob], { type: 'video/mp4' });
                    const blobUrl = URL.createObjectURL(blobToPlay);
                    console.log("Recovered blob URL:", blobUrl);
                    setVideoUrl(blobUrl);
                    setError(null);
                    return; 
                }
             } catch (recoveryErr) {
                console.error("Recovery failed:", recoveryErr);
             }

             // 🚨 FALLBACK MODE TEST (DESACTIVÉ)
             // Si Backblaze est bloqué (quota), on utilise une vidéo de test pour ne pas bloquer le dév
             // console.log("⚠️ Fallback to Demo Video (Quota Exceeded Mode)");
             // const demoVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
             // setVideoUrl(demoVideo);
             // setError(null);
             // return;
          }

          let msg = "Impossible de lire la vidéo.";
          if (e.target.error) {
             msg += ` (Code: ${e.target.error.code})`;
          }
          setError(msg);
        }}
      />

      {/* Overlay Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 pb-8 pt-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div className="relative w-full h-1 bg-gray-600 cursor-pointer group/progress mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          />
          <div 
            className="absolute left-0 top-0 h-full bg-red-600 transition-all"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute h-3 w-3 bg-red-600 rounded-full top-1/2 -translate-y-1/2 shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={togglePlay} className="text-white hover:text-gray-300 transition">
              {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
            </button>

            <button 
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime -= 10;
              }}
              className="text-white hover:text-gray-300 transition"
            >
              <SkipBack size={24} />
            </button>

            <button 
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime += 10;
              }}
              className="text-white hover:text-gray-300 transition"
            >
              <SkipForward size={24} />
            </button>

            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="text-white hover:text-gray-300 transition">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (videoRef.current) {
                    videoRef.current.volume = val;
                    setIsMuted(val === 0);
                  }
                }}
                className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <span className="text-white font-medium ml-4">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleLikeToggle} className="text-white hover:text-red-500 transition group">
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-red-600" : "group-hover:text-red-500"} />
            </button>
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition">
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Certification Modal - AI Animation */}
      {showCertModal && (
        <CertificationSuccess 
          title={title}
          onClose={() => setShowCertModal(false)}
          onGoToProfile={() => navigate('/app/account', { state: { activeTab: 'certifications' } })}
        />
      )}
    </div>
  );
}
