import React, { useRef, useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from "framer-motion";

import Search from './search.jsx'

const defaultItems = [
  { 
    title: 'QuickPop', 
    description: 'Les vidéos essentielles sélectionnées pour toi.', 
    video: '/vs/quick.mp4', 
    poster: '/imgs/logo-mb.png'
  }
];

export default function NetflixHeroSection({ items = defaultItems }) {
  const MotionH2 = motion.h2;
  const [hasError, setHasError] = useState(false);
  
  // Si une erreur survient (ex: quota Backblaze) ou si aucune vidéo n'est fournie, on bascule sur les items par défaut (locaux)
  const safeItems = (hasError || !Array.isArray(items) || items.length === 0) ? defaultItems : items;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const currentItem = safeItems[currentIndex] || safeItems[0];

  // Reset error state if items change (e.g. initial load vs fetched data)
  // But if we already detected an error with these items, don't reset immediately unless items actually changed content
  useEffect(() => {
    if (items && items.length > 0 && items !== defaultItems) {
       if (hasError) {
         const timer = setTimeout(() => setHasError(false), 0);
         return () => clearTimeout(timer);
       }
    }
  }, [items, hasError]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i === safeItems.length - 1 ? 0 : i + 1));
    }, 6000);
    return () => clearInterval(id);
  }, [isPaused, safeItems.length]);


  return (
    <div className="bg-black h-screen text-white relative">

      {/* Hero Section */}
      <section
        className="relative h-screen w-full "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >

        {/* VIDÉO DE FOND */}
        <video
          key={`${currentItem.video}-${hasError ? 'err' : 'ok'}`}
          ref={videoRef}
          src={currentItem.video}
          poster={currentItem.poster}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            console.warn("Video Load Error in Hero, switching to default.", e);
            if (!hasError) {
                setHasError(true);
                setCurrentIndex(0);
            }
          }}
        />

        {/* OVERLAY GRADIENT NETFLIX */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-red-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        {/* CONTENU */}
        <div className="relative w-full z-10 h-full flex flex-col justify-center px-6 md:px-20">

          
          <MotionH2
            className="w-full text-center font-black mb-4 drop-shadow-xl text-6xl md:text-9xl"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 1,
            }}
            whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgb(255,255,255)" }}
          >
            {currentItem.title}
          </MotionH2>

          <p className="text-gray-200 w-full text-center text-base md:text-2xl max-w-xl leading-relaxed mx-auto">
            {currentItem.description}
          </p>

          <Search />

        </div>

       
      </section>
    </div>
  );
}
