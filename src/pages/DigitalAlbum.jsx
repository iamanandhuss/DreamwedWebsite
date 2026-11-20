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

      {/* EDITORIAL ALBUM FEED (CONTINUOUS MOBILE SCROLL-DOWN) */}
      <main className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-10 sm:space-y-16">
        
        {SPREADS.map((spread, index) => (
          <article 
            key={spread.id}
            className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-300"
          >
            {/* 1. TOP HERO PHOTO (Full Width) */}
            <div 
              className="w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden relative cursor-pointer bg-zinc-100 group"
              onClick={() => setLightboxImage(spread.hero)}
            >
              <img 
                src={spread.hero.url}
                alt={spread.hero.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* 2. MIDDLE TYPOGRAPHIC SPREAD HEADER */}
            <div className="pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 text-center select-none">
              {/* Romantic Cursive Script Heading (1:1 with reference) */}
              <h2 
                style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
                className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-wide text-zinc-900"
              >
                {spread.scriptTitle}
              </h2>

              {/* Couple Names (Spaced Uppercase) */}
              <div 
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-zinc-800 mt-2"
              >
                {spread.names}
              </div>

              {/* Subtitle / Studio Branding */}
              <p className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-light text-zinc-500 mt-1.5">
                {spread.subtitle}
              </p>
            </div>

            {/* 3. BOTTOM TRIPTYCH GRID (3 Vertical Portraits Side-by-Side) */}
            <div className="px-3 sm:px-6 pb-5 sm:pb-8">
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                {spread.triptych.map((item, photoIdx) => (
                  <div
                    key={photoIdx}
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
        ))}

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
