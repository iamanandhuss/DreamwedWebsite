import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  X, 
  Share2, 
  Download,
  BookOpen
} from "lucide-react";
import SEO from "../components/SEO";

// Curated 7 luxury album spreads using the 25 Sandeep & Sandra client photos
const SPREADS = [
  {
    id: 1,
    scriptTitle: "Fall in Love",
    names: "SANDEEP & SANDRA",
    subtitle: "Dreamwed Wedding Stories",
    hero: {
      url: "/images/album/sandeep-sandra/DSC09959.jpg",
      alt: "Sandeep & Sandra Holding Hands"
    },
    triptych: [
      { url: "/images/album/sandeep-sandra/DSC09989.jpg", alt: "Sandeep & Sandra Beach Moment 1" },
      { url: "/images/album/sandeep-sandra/DSC00017.jpg", alt: "Traditional Ceremony Portrait" },
      { url: "/images/album/sandeep-sandra/DSC00154.jpg", alt: "Sandeep & Sandra Beach Moment 2" }
    ]
  },
  {
    id: 2,
    scriptTitle: "Mark The Date",
    names: "SANDEEP & SANDRA",
    subtitle: "November 15, 2026 • Trivandrum",
    hero: {
      url: "/images/album/sandeep-sandra/DSC09795.jpg",
      alt: "The Sacred Beginning"
    },
    triptych: [
      { url: "/images/album/sandeep-sandra/DSC09854.jpg", alt: "Intimate Smile" },
      { url: "/images/album/sandeep-sandra/DSC09893.jpg", alt: "Gentle Embrace" },
      { url: "/images/album/sandeep-sandra/DSC09948.jpg", alt: "Together by the Shore" }
    ]
  },
  {
    id: 3,
    scriptTitle: "Two of Us",
    names: "SANDEEP & SANDRA",
    subtitle: "Intimate Couple Portraits",
    hero: {
      url: "/images/album/sandeep-sandra/DSC00176.jpg",
      alt: "Two of Us in Harmony"
    },
    triptych: [
      { url: "/images/album/sandeep-sandra/DSC00311.jpg", alt: "Grace & Warmth" },
      { url: "/images/album/sandeep-sandra/DSC00387.jpg", alt: "Candid Laughter" },
      { url: "/images/album/sandeep-sandra/DSC00438.jpg", alt: "Romantic Gaze" }
    ]
  },
  {
    id: 4,
    scriptTitle: "Timeless Melody",
    names: "SANDEEP & SANDRA",
    subtitle: "Heritage & Traditional Splendor",
    hero: {
      url: "/images/album/sandeep-sandra/DSC00472.jpg",
      alt: "Veena Melody & Red Saree"
    },
    triptych: [
      { url: "/images/album/sandeep-sandra/DSC00496.jpg", alt: "Heritage Backdrop" },
      { url: "/images/album/sandeep-sandra/DSC00514.jpg", alt: "Sacred Traditional Charm" },
      { url: "/images/album/sandeep-sandra/DSC00574.jpg", alt: "Love in Tradition" }
    ]
  },
  {
    id: 5,
    scriptTitle: "Together Forever",
    names: "SANDEEP & SANDRA",
    subtitle: "Promises of a Lifetime",
    hero: {
      url: "/images/album/sandeep-sandra/DSC00640.jpg",
      alt: "Pure Happiness Together"
    },
    triptych: [
      { url: "/images/album/sandeep-sandra/DSC00776.jpg", alt: "Hand in Hand Walk" },
      { url: "/images/album/sandeep-sandra/DSC00832.jpg", alt: "Joyful Connection" },
      { url: "/images/album/sandeep-sandra/DSC00900.jpg", alt: "Candid Glance" }
    ]
  },
  {
    id: 6,
    scriptTitle: "Golden Memories",
    names: "SANDEEP & SANDRA",
    subtitle: "Celebration, Love & Laughter",
    hero: {
      url: "/images/album/sandeep-sandra/DSC00969.jpg",
      alt: "Golden Hour Glow"
    },
    triptych: [
      { url: "/images/album/sandeep-sandra/DSC00981.jpg", alt: "Sunset Reflections" },
      { url: "/images/album/sandeep-sandra/DSC01080.jpg", alt: "Unscripted Joy" },
      { url: "/images/album/sandeep-sandra/DSC01123.jpg", alt: "Timeless Together" }
    ]
  },
  {
    id: 7,
    scriptTitle: "Ever After",
    names: "SANDEEP & SANDRA",
    subtitle: "Captured Forever • Dreamwed Stories",
    hero: {
      url: "/images/album/sandeep-sandra/DSC01251.jpg",
      alt: "Happily Ever After"
    },
    triptych: [
      { url: "/images/album/sandeep-sandra/DSC00017.jpg", alt: "Signature Portrait" },
      { url: "/images/album/sandeep-sandra/DSC00472.jpg", alt: "Classical Melody" },
      { url: "/images/album/sandeep-sandra/DSC00969.jpg", alt: "Cherished Forever" }
    ]
  }
];

const DigitalAlbum = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Touch swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const activeSpread = SPREADS[currentSpreadIndex];

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxImage) {
        if (e.key === "Escape") setLightboxImage(null);
        return;
      }
      if (e.key === "ArrowRight") nextSpread();
      if (e.key === "ArrowLeft") prevSpread();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSpreadIndex, lightboxImage]);

  const nextSpread = () => {
    if (currentSpreadIndex < SPREADS.length - 1) {
      setDirection(1);
      setCurrentSpreadIndex((prev) => prev + 1);
    } else {
      // Loop back to beginning
      setDirection(1);
      setCurrentSpreadIndex(0);
    }
  };

  const prevSpread = () => {
    if (currentSpreadIndex > 0) {
      setDirection(-1);
      setCurrentSpreadIndex((prev) => prev - 1);
    } else {
      // Loop to end
      setDirection(-1);
      setCurrentSpreadIndex(SPREADS.length - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSpread();
      else prevSpread();
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  // Theme styles
  const bgClass = isDarkMode ? "bg-zinc-950 text-white" : "bg-[#fbfbf9] text-zinc-900";
  const cardBgClass = isDarkMode ? "bg-zinc-900 text-white border-zinc-800" : "bg-white text-zinc-900 border-zinc-200/80";
  const titleColor = isDarkMode ? "text-amber-200" : "text-zinc-900";
  const namesColor = isDarkMode ? "text-zinc-200" : "text-zinc-800";
  const subtitleColor = isDarkMode ? "text-zinc-400" : "text-zinc-500";

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen ${bgClass} transition-colors duration-500 flex flex-col items-center justify-between selection:bg-[#b4975a] selection:text-white select-none overflow-x-hidden`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <SEO 
        title="Sandeep & Sandra • Digital Wedding Album | Dreamwed Stories"
        description="Experience the bespoke editorial wedding album of Sandeep & Sandra, beautifully crafted with timeless candids by Dreamwed Stories."
      />

      {/* TOP FLOATING NAVIGATION BAR */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-30 sticky top-0 backdrop-blur-md bg-opacity-80">
        {/* Back Button */}
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
            isDarkMode 
              ? "bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800" 
              : "bg-white/95 border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-black/5"
          }`}
          title="Back"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Center Album Indicator */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-medium tracking-wider uppercase backdrop-blur-lg shadow-sm transition-all">
          <BookOpen size={13} className="text-[#b4975a]" />
          <span className="font-semibold">Spread {activeSpread.id} of {SPREADS.length}</span>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer hover:scale-105 ${
              isDarkMode ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white" : "bg-white border border-zinc-200 text-zinc-700 hover:text-black"
            }`}
            title={shareCopied ? "Link Copied!" : "Share Album Link"}
          >
            <Share2 size={15} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer hover:scale-105 ${
              isDarkMode ? "bg-zinc-900 border border-zinc-800 text-amber-400" : "bg-white border border-zinc-200 text-zinc-700"
            }`}
            title={isDarkMode ? "Switch to Classic White Album" : "Switch to Luxury Dark Album"}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center transition-all shadow-sm cursor-pointer hover:scale-105 ${
              isDarkMode ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white" : "bg-white border border-zinc-200 text-zinc-700 hover:text-black"
            }`}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      {/* COPIED TOAST NOTIFICATION */}
      <AnimatePresence>
        {shareCopied && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-18 z-50 px-4 py-2 bg-[#b4975a] text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-xl"
          >
            ✓ Album Link Copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN EDITORIAL ALBUM SPREAD CONTAINER */}
      <main className="w-full flex-grow flex items-center justify-center px-3 sm:px-6 md:px-8 py-2 md:py-6">
        <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl relative">
          
          {/* SPREAD CARD WITH FRAMER-MOTION SMOOTH SLIDE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSpread.id}
              initial={{ opacity: 0, x: direction * 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -direction * 40, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full rounded-2xl md:rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 ${cardBgClass}`}
              style={{
                boxShadow: isDarkMode 
                  ? "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 1px rgba(255, 255, 255, 0.1)" 
                  : "0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.08)"
              }}
            >
              
              {/* 1. TOP HERO PHOTO (Full Width with subtle hover zoom) */}
              <div 
                className="w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden relative cursor-pointer group bg-black/5"
                onClick={() => setLightboxImage(activeSpread.hero)}
              >
                <img 
                  src={activeSpread.hero.url}
                  alt={activeSpread.hero.alt}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <span className="absolute bottom-2 right-2 text-[9px] uppercase tracking-wider text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Tap to expand
                </span>
              </div>

              {/* 2. MIDDLE TYPOGRAPHIC SPREAD HEADER */}
              <div className="pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 text-center">
                {/* Romantic Cursive Script Heading (Matching screenshot) */}
                <h2 
                  style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
                  className={`text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.1] mb-1 tracking-wide ${titleColor}`}
                >
                  {activeSpread.scriptTitle}
                </h2>

                {/* Couple Names (Clean, spaced uppercase serif/sans) */}
                <div 
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className={`text-xs sm:text-sm md:text-base font-light tracking-[0.28em] sm:tracking-[0.35em] uppercase mt-2 ${namesColor}`}
                >
                  {activeSpread.names}
                </div>

                {/* Subtitle / Studio Branding */}
                <p className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-light mt-1.5 opacity-85 ${subtitleColor}`}>
                  {activeSpread.subtitle}
                </p>
              </div>

              {/* 3. BOTTOM TRIPTYCH GRID (3 Vertical Portraits Side-by-Side) */}
              <div className="px-3 sm:px-6 pb-6 sm:pb-8">
                <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                  {activeSpread.triptych.map((item, idx) => (
                    <div
                      key={idx}
                      className="aspect-[3/4] sm:aspect-[4/5] rounded-sm sm:rounded overflow-hidden bg-black/5 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                      onClick={() => setLightboxImage(item)}
                    >
                      <img 
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* SIDE FLIP CONTROLS (DESKTOP) */}
          <button
            onClick={prevSpread}
            className={`hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer ${
              isDarkMode ? "bg-zinc-900 border border-zinc-800 text-white" : "bg-white border border-zinc-200 text-zinc-800"
            }`}
            aria-label="Previous Spread"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextSpread}
            className={`hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer ${
              isDarkMode ? "bg-zinc-900 border border-zinc-800 text-white" : "bg-white border border-zinc-200 text-zinc-800"
            }`}
            aria-label="Next Spread"
          >
            <ChevronRight size={22} />
          </button>

        </div>
      </main>

      {/* BOTTOM ACTION BAR & SPREAD THUMBNAILS */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col items-center gap-3 z-30">
        
        {/* Spread Navigation Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {SPREADS.map((spread, idx) => (
            <button
              key={spread.id}
              onClick={() => {
                setDirection(idx > currentSpreadIndex ? 1 : -1);
                setCurrentSpreadIndex(idx);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentSpreadIndex
                  ? "w-8 h-2 bg-[#b4975a]"
                  : `w-2 h-2 ${isDarkMode ? "bg-zinc-800 hover:bg-zinc-600" : "bg-zinc-300 hover:bg-zinc-400"}`
              }`}
              title={`Jump to Spread ${spread.id}: ${spread.scriptTitle}`}
              aria-label={`Jump to Spread ${spread.id}`}
            />
          ))}
        </div>

        {/* Mobile Next / Rotate Button matching the screenshot icons */}
        <div className="w-full flex items-center justify-between sm:justify-center gap-4 text-xs">
          <button
            onClick={prevSpread}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-medium transition-all cursor-pointer ${
              isDarkMode ? "border-zinc-800 hover:bg-zinc-900 text-zinc-300" : "border-zinc-300 hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          {/* Quick Flip / Next Button (Matching rotate icon in screenshot) */}
          <button
            onClick={nextSpread}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b4975a] hover:bg-[#c4a96a] text-black font-bold uppercase tracking-wider text-[11px] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Next Spread</span>
            <RotateCw size={14} className="hover:rotate-180 transition-transform duration-500" />
          </button>

          {/* Mobile Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className={`sm:hidden w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              isDarkMode ? "border-zinc-800 bg-zinc-900 text-zinc-300" : "border-zinc-300 bg-white text-zinc-700"
            }`}
            title="Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </footer>

      {/* FULLSCREEN LIGHTBOX POPUP FOR IMAGE EXPANSION */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/50 p-3 rounded-full border border-white/10 transition-all cursor-pointer"
              title="Close"
              aria-label="Close photo preview"
            >
              <X size={20} />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={lightboxImage.url}
              alt={lightboxImage.alt}
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="mt-4 text-center text-white/80 text-xs font-light tracking-widest uppercase">
              {lightboxImage.alt}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DigitalAlbum;
