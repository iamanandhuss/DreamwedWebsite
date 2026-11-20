import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Share2, 
  X, 
  ChevronUp, 
  PhoneCall,
  Sparkles,
  Heart
} from "lucide-react";
import SEO from "../components/SEO";

// Curated 7 diverse editorial album sections with UNIQUE collage layouts
const SECTIONS = [
  // SECTION 1: Classic Reference Triptych (1 Hero Top + 3 Portraits Bottom)
  {
    id: 1,
    type: "hero_triptych",
    scriptTitle: "Fall in Love",
    names: "SANDEEP & SANDRA",
    subtitle: "Dreamwed Wedding Stories",
    hero: { url: "/images/album/sandeep-sandra/DSC09959.jpg", alt: "Sandeep & Sandra Walking Hand in Hand" },
    photos: [
      { url: "/images/album/sandeep-sandra/DSC09989.jpg", alt: "Beach Romance" },
      { url: "/images/album/sandeep-sandra/DSC00017.jpg", alt: "Traditional Ceremony Portrait" },
      { url: "/images/album/sandeep-sandra/DSC00154.jpg", alt: "Gentle Gaze" }
    ]
  },

  // SECTION 2: Asymmetric Magazine Mosaic (1 Tall Portrait Left + 2 Stacked Right + 1 Wide Underneath)
  {
    id: 2,
    type: "asymmetric_mosaic",
    scriptTitle: "Mark The Date",
    names: "SANDEEP & SANDRA",
    subtitle: "November 15, 2026 • Trivandrum",
    tall: { url: "/images/album/sandeep-sandra/DSC09795.jpg", alt: "The Sacred Beginning" },
    stackedTop: { url: "/images/album/sandeep-sandra/DSC09854.jpg", alt: "Intimate Smile" },
    stackedBottom: { url: "/images/album/sandeep-sandra/DSC09893.jpg", alt: "Gentle Embrace" },
    bottomWide: { url: "/images/album/sandeep-sandra/DSC09948.jpg", alt: "Together by the Shore" }
  },

  // SECTION 3: Editorial Diptych (2 Grand Side-by-Side Portraits)
  {
    id: 3,
    type: "diptych_duo",
    scriptTitle: "Two of Us",
    names: "SANDEEP & SANDRA",
    subtitle: "Intimate Couple Portraits",
    quote: "In the quiet space between moments, the world paused just for the two of us.",
    left: { url: "/images/album/sandeep-sandra/DSC00176.jpg", alt: "Two of Us in Harmony" },
    right: { url: "/images/album/sandeep-sandra/DSC00311.jpg", alt: "Grace & Warmth" }
  },

  // SECTION 4: Quad Mosaic (4-Photo Dynamic 2x2 Grid)
  {
    id: 4,
    type: "quad_grid",
    scriptTitle: "Timeless Melody",
    names: "SANDEEP & SANDRA",
    subtitle: "Heritage & Traditional Splendor",
    photos: [
      { url: "/images/album/sandeep-sandra/DSC00387.jpg", alt: "Candid Laughter" },
      { url: "/images/album/sandeep-sandra/DSC00438.jpg", alt: "Romantic Gaze" },
      { url: "/images/album/sandeep-sandra/DSC00472.jpg", alt: "Veena Melody & Red Saree" },
      { url: "/images/album/sandeep-sandra/DSC00496.jpg", alt: "Heritage Backdrop" }
    ]
  },

  // SECTION 5: Panoramic Feature + 2 Offset Portrait Cards
  {
    id: 5,
    type: "panoramic_cards",
    scriptTitle: "Together Forever",
    names: "SANDEEP & SANDRA",
    subtitle: "Promises of a Lifetime",
    panoramic: { url: "/images/album/sandeep-sandra/DSC00514.jpg", alt: "Sacred Traditional Charm" },
    card1: { url: "/images/album/sandeep-sandra/DSC00574.jpg", alt: "Love in Tradition" },
    card2: { url: "/images/album/sandeep-sandra/DSC00640.jpg", alt: "Pure Happiness Together" }
  },

  // SECTION 6: 5-Photo Story Mosaic (2 Dynamic Top + 3 Triptych Bottom)
  {
    id: 6,
    type: "five_photo_story",
    scriptTitle: "Golden Memories",
    names: "SANDEEP & SANDRA",
    subtitle: "Celebration, Love & Laughter",
    topWide: { url: "/images/album/sandeep-sandra/DSC00776.jpg", alt: "Hand in Hand Walk" },
    topSquare: { url: "/images/album/sandeep-sandra/DSC00832.jpg", alt: "Joyful Connection" },
    bottomRow: [
      { url: "/images/album/sandeep-sandra/DSC00900.jpg", alt: "Candid Glance" },
      { url: "/images/album/sandeep-sandra/DSC00969.jpg", alt: "Golden Hour Glow" },
      { url: "/images/album/sandeep-sandra/DSC00981.jpg", alt: "Sunset Reflections" }
    ]
  },

  // SECTION 7: Signature Grand Finale (Centerpiece + 2 Companion Frames)
  {
    id: 7,
    type: "grand_finale",
    scriptTitle: "Ever After",
    names: "SANDEEP & SANDRA",
    subtitle: "Captured Forever • Dreamwed Stories",
    centerpiece: { url: "/images/album/sandeep-sandra/DSC01251.jpg", alt: "Happily Ever After" },
    leftFrame: { url: "/images/album/sandeep-sandra/DSC01080.jpg", alt: "Unscripted Joy" },
    rightFrame: { url: "/images/album/sandeep-sandra/DSC01123.jpg", alt: "Timeless Together" }
  }
];

const DigitalAlbum = () => {
  const navigate = useNavigate();
  const [lightboxImage, setLightboxImage] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard close for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && lightboxImage) {
        setLightboxImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Sandeep & Sandra • Digital Wedding Album",
        text: "Experience the bespoke wedding album of Sandeep & Sandra by Dreamwed Stories.",
        url: window.location.href
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reusable Section Typography Header
  const renderTypography = (scriptTitle, names, subtitle) => (
    <div className="pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 text-center select-none">
      <h2 
        style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
        className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-wide text-zinc-900"
      >
        {scriptTitle}
      </h2>
      <div 
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-zinc-800 mt-2"
      >
        {names}
      </div>
      {subtitle && (
        <p className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-light text-zinc-500 mt-1.5">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-zinc-900 selection:bg-[#b4975a] selection:text-white pb-24">
      <SEO 
        title="Sandeep & Sandra • Digital Wedding Album | Dreamwed Stories"
        description="Experience the bespoke editorial wedding album of Sandeep & Sandra, beautifully crafted with timeless candids by Dreamwed Stories."
      />

      {/* STICKY TOP FLOATING MOBILE APP BAR */}
      <header className="sticky top-0 z-40 w-full bg-[#fcfcf9]/90 backdrop-blur-xl border-b border-zinc-200/80 px-4 sm:px-6 py-3 transition-all duration-300">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          
          {/* Back Button */}
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-800 hover:text-black hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
            title="Go back"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Center Title */}
          <div className="text-center px-2">
            <h1 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
              Sandeep & Sandra
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-[#b4975a] font-medium mt-0.5">
              Dreamwed Digital Album
            </p>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-800 hover:text-black hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
            title="Share Album"
            aria-label="Share Album"
          >
            <Share2 size={16} />
          </button>

        </div>
      </header>

      {/* COPIED TOAST */}
      <AnimatePresence>
        {shareCopied && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-2xl flex items-center gap-2"
          >
            <Sparkles size={14} className="text-[#b4975a]" />
            <span>Album Link Copied!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIVERSE EDITORIAL ALBUM FEED (CONTINUOUS MOBILE SCROLL-DOWN) */}
      <main className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-10 sm:space-y-16">
        
        {SECTIONS.map((sec, index) => {

          // ========================================================
          // LAYOUT 1: CLASSIC TRIPTYCH (Hero Top + 3 Portraits Bottom)
          // ========================================================
          if (sec.type === "hero_triptych") {
            return (
              <article 
                key={sec.id}
                className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div 
                  className="w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden relative cursor-pointer bg-zinc-100 group"
                  onClick={() => setLightboxImage(sec.hero)}
                >
                  <img 
                    src={sec.hero.url}
                    alt={sec.hero.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {renderTypography(sec.scriptTitle, sec.names, sec.subtitle)}

                <div className="px-3 sm:px-6 pb-5 sm:pb-8">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                    {sec.photos.map((item, pIdx) => (
                      <div
                        key={pIdx}
                        className="aspect-[3/4] sm:aspect-[4/5] rounded-sm sm:rounded overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                        onClick={() => setLightboxImage(item)}
                      >
                        <img 
                          src={item.url}
                          alt={item.alt}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          }

          // ========================================================
          // LAYOUT 2: ASYMMETRIC MAGAZINE MOSAIC (1 Tall Left + 2 Stacked Right + 1 Wide Underneath)
          // ========================================================
          if (sec.type === "asymmetric_mosaic") {
            return (
              <article 
                key={sec.id}
                className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] p-3.5 sm:p-6 transition-all duration-300"
              >
                {renderTypography(sec.scriptTitle, sec.names, sec.subtitle)}

                {/* Top Split: 1 Tall Portrait + 2 Stacked Photos */}
                <div className="grid grid-cols-12 gap-2.5 sm:gap-4 items-stretch mb-2.5 sm:mb-4">
                  {/* Tall Left Frame (7 cols on desktop, 6 on mobile) */}
                  <div 
                    className="col-span-7 sm:col-span-7 aspect-[3/4] sm:aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                    onClick={() => setLightboxImage(sec.tall)}
                  >
                    <img 
                      src={sec.tall.url}
                      alt={sec.tall.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  {/* 2 Stacked Right Frames (5 cols) */}
                  <div className="col-span-5 sm:col-span-5 flex flex-col gap-2.5 sm:gap-4 justify-between">
                    <div 
                      className="h-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                      onClick={() => setLightboxImage(sec.stackedTop)}
                    >
                      <img 
                        src={sec.stackedTop.url}
                        alt={sec.stackedTop.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    <div 
                      className="h-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                      onClick={() => setLightboxImage(sec.stackedBottom)}
                    >
                      <img 
                        src={sec.stackedBottom.url}
                        alt={sec.stackedBottom.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Bottom Panoramic Anchor Photo */}
                <div 
                  className="w-full aspect-[21/9] sm:aspect-[16/7] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                  onClick={() => setLightboxImage(sec.bottomWide)}
                >
                  <img 
                    src={sec.bottomWide.url}
                    alt={sec.bottomWide.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              </article>
            );
          }

          // ========================================================
          // LAYOUT 3: EDITORIAL DIPTYCH (2 Grand Side-by-Side Portraits)
          // ========================================================
          if (sec.type === "diptych_duo") {
            return (
              <article 
                key={sec.id}
                className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] p-3.5 sm:p-6 transition-all duration-300"
              >
                {renderTypography(sec.scriptTitle, sec.names, sec.subtitle)}

                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-4">
                  <div 
                    className="aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                    onClick={() => setLightboxImage(sec.left)}
                  >
                    <img 
                      src={sec.left.url}
                      alt={sec.left.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  <div 
                    className="aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                    onClick={() => setLightboxImage(sec.right)}
                  >
                    <img 
                      src={sec.right.url}
                      alt={sec.right.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                </div>

                {sec.quote && (
                  <p className="text-center text-[11px] sm:text-xs italic text-zinc-500 font-serif max-w-sm mx-auto px-4 pt-1">
                    "{sec.quote}"
                  </p>
                )}
              </article>
            );
          }

          // ========================================================
          // LAYOUT 4: QUAD GRID (4-Photo Dynamic 2x2 Grid)
          // ========================================================
          if (sec.type === "quad_grid") {
            return (
              <article 
                key={sec.id}
                className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] p-3.5 sm:p-6 transition-all duration-300"
              >
                {renderTypography(sec.scriptTitle, sec.names, sec.subtitle)}

                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  {sec.photos.map((item, pIdx) => (
                    <div 
                      key={pIdx}
                      className="aspect-square sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                      onClick={() => setLightboxImage(item)}
                    >
                      <img 
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ))}
                </div>
              </article>
            );
          }

          // ========================================================
          // LAYOUT 5: PANORAMIC + 2 OFFSET PORTRAIT CARDS
          // ========================================================
          if (sec.type === "panoramic_cards") {
            return (
              <article 
                key={sec.id}
                className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                {/* 1. Panoramic Full-Bleed Banner */}
                <div 
                  className="w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden relative cursor-pointer bg-zinc-100 group"
                  onClick={() => setLightboxImage(sec.panoramic)}
                >
                  <img 
                    src={sec.panoramic.url}
                    alt={sec.panoramic.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {renderTypography(sec.scriptTitle, sec.names, sec.subtitle)}

                {/* 2. Side-by-Side Floating Portrait Pair */}
                <div className="px-3.5 sm:px-6 pb-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-lg mx-auto">
                    <div 
                      className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                      onClick={() => setLightboxImage(sec.card1)}
                    >
                      <img 
                        src={sec.card1.url}
                        alt={sec.card1.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    <div 
                      className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                      onClick={() => setLightboxImage(sec.card2)}
                    >
                      <img 
                        src={sec.card2.url}
                        alt={sec.card2.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  </div>
                </div>
              </article>
            );
          }

          // ========================================================
          // LAYOUT 6: 5-PHOTO STORY MOSAIC (2 Dynamic Top + 3 Triptych Bottom)
          // ========================================================
          if (sec.type === "five_photo_story") {
            return (
              <article 
                key={sec.id}
                className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] p-3.5 sm:p-6 transition-all duration-300"
              >
                {renderTypography(sec.scriptTitle, sec.names, sec.subtitle)}

                {/* Top Row: 60/40 Asymmetric Pair */}
                <div className="grid grid-cols-12 gap-2.5 sm:gap-3.5 mb-2.5 sm:mb-3.5">
                  <div 
                    className="col-span-7 aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                    onClick={() => setLightboxImage(sec.topWide)}
                  >
                    <img 
                      src={sec.topWide.url}
                      alt={sec.topWide.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  <div 
                    className="col-span-5 aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                    onClick={() => setLightboxImage(sec.topSquare)}
                  >
                    <img 
                      src={sec.topSquare.url}
                      alt={sec.topSquare.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                </div>

                {/* Bottom Row: 3-Photo Triptych */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                  {sec.bottomRow.map((item, pIdx) => (
                    <div 
                      key={pIdx}
                      className="aspect-[3/4] sm:aspect-[4/5] rounded-sm sm:rounded overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                      onClick={() => setLightboxImage(item)}
                    >
                      <img 
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ))}
                </div>
              </article>
            );
          }

          // ========================================================
          // LAYOUT 7: GRAND FINALE (Centerpiece + 2 Companion Frames)
          // ========================================================
          if (sec.type === "grand_finale") {
            return (
              <article 
                key={sec.id}
                className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                {/* 1. Grand Centerpiece */}
                <div 
                  className="w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden relative cursor-pointer bg-zinc-100 group"
                  onClick={() => setLightboxImage(sec.centerpiece)}
                >
                  <img 
                    src={sec.centerpiece.url}
                    alt={sec.centerpiece.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {renderTypography(sec.scriptTitle, sec.names, sec.subtitle)}

                {/* 2. Two Companion Portraits Side-by-Side */}
                <div className="px-3.5 sm:px-6 pb-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-lg mx-auto">
                    <div 
                      className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                      onClick={() => setLightboxImage(sec.leftFrame)}
                    >
                      <img 
                        src={sec.leftFrame.url}
                        alt={sec.leftFrame.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    <div 
                      className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                      onClick={() => setLightboxImage(sec.rightFrame)}
                    >
                      <img 
                        src={sec.rightFrame.url}
                        alt={sec.rightFrame.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  </div>
                </div>
              </article>
            );
          }

          return null;
        })}

        {/* CLOSING CREDITS & CTA */}
        <section className="text-center pt-8 pb-12 px-4 space-y-4">
          <div className="w-12 h-0.5 bg-[#b4975a] mx-auto rounded-full" />
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-800">
            Dreamwed Stories
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
            Preserving sacred celebrations with emotion, elegance, and timeless fine-art photography in Kerala.
          </p>

          <div className="pt-2 flex justify-center">
            <a
              href="https://wa.me/918138060591?text=Hi%20Dreamwed,%20I%20loved%20the%20Sandeep%20%26%20Sandra%20Digital%20Album!%20I'd%20like%20to%20inquire%20for%20my%20wedding."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#b4975a] hover:bg-[#c4a96a] text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <PhoneCall size={14} />
              <span>Book Your Wedding Story</span>
            </a>
          </div>
        </section>

      </main>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-zinc-900 text-white shadow-2xl border border-zinc-800 flex items-center justify-center hover:bg-black active:scale-95 transition-all cursor-pointer"
            title="Scroll to top"
            aria-label="Back to Top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* FULLSCREEN LIGHTBOX POPUP */}
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
