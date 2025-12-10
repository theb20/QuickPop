import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Play, Loader, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Pause } from "lucide-react";

export default function NetflixVideoPlayer({ 
  isOpen = true, 
  onClose, 
  videoUrl = '/videos/quick.mp4',
  title = "Vidéo",
  episode = null,
  nextEpisode = null
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsPlaying(true);
    }
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const next = !videoRef.current.muted;
      videoRef.current.muted = next;
      setIsMuted(next);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const skip = useCallback((seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      switch(e.key) {
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          } else {
            handleClose();
          }
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isFullscreen, handleClose, togglePlayPause, toggleFullscreen, toggleMute, skip, exitFullscreen]);

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black"
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Overlay gradient en haut */}
      <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-white">
            <h2 className="text-xl font-semibold">{title}</h2>
            {episode && <p className="text-sm text-gray-300">{episode}</p>}
          </div>
          
          <div className="w-10" />
        </div>
      </div>

      {/* Vidéo */}
      <div className="relative w-full h-full flex items-center justify-center">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <Loader className="w-16 h-16 text-red-600 animate-spin" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-center px-4">
              <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-10 h-10 text-red-600" />
              </div>
              <p className="text-white text-xl font-semibold mb-2">Une erreur est survenue</p>
              <p className="text-gray-400 mb-6">Impossible de lire cette vidéo</p>
              <button 
                onClick={handleClose}
                className="px-6 py-3 bg-white text-black rounded font-semibold hover:bg-gray-200 transition"
              >
                Retour
              </button>
            </div>
          </div>
        )}

        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            className="w-full h-full object-contain cursor-pointer"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlayPause}
            preload="auto"
            controlsList="nodownload noplaybackrate nofullscreen"
            disablePictureInPicture
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        )}

        {/* Bouton Play/Pause central */}
        {!isPlaying && !isLoading && !hasError && (
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center z-10 group"
          >
            <div className="w-24 h-24 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-black/80 transition-all group-hover:scale-110 border-4 border-white/30">
              <Play className="w-12 h-12 text-white ml-2" fill="white" />
            </div>
          </button>
        )}
      </div>

      {/* Contrôles en bas */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        {/* Barre de progression */}
        <div 
          className="h-1 bg-gray-700 cursor-pointer group relative"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-red-600 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="bg-gradient-to-t from-black via-black/95 to-transparent px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Gauche - Play/Pause + Temps */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayPause}
                className="text-white hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" fill="white" />
                ) : (
                  <Play className="w-8 h-8" fill="white" />
                )}
              </button>

              <button
                onClick={() => skip(-10)}
                className="text-white hover:scale-110 transition-transform"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={() => skip(10)}
                className="text-white hover:scale-110 transition-transform"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={toggleMute}
                className="text-white hover:scale-110 transition-transform"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>

              <div className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Droite - Plein écran */}
            <div className="flex items-center gap-4">
              {nextEpisode && (
                <button className="px-4 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 transition text-sm">
                  Épisode suivant
                </button>
              )}
              
              <button
                onClick={toggleFullscreen}
                className="text-white hover:scale-110 transition-transform"
              >
                {isFullscreen ? (
                  <Minimize className="w-6 h-6" />
                ) : (
                  <Maximize className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
