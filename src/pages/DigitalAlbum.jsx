import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Share2, 
  X, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  Sparkles
} from "lucide-react";
import SEO from "../components/SEO";
import ClientGallery from "./ClientGallery";

// The 25 Sandeep & Sandra client photos organized into 10 alternating bento rows
// Replicates the modern "Photo Gallery" bento mosaic layout:
// Row 1: [Wide Landscape 65% + Portrait 35%]
// Row 2: [Portrait 33% + Centerpiece 33% + Portrait 33%]
// Row 3: [Portrait 35% + Wide Landscape 65%]
// Row 4: [Portrait 33% + Centerpiece 33% + Portrait 33%]
// ... alternating seamlessly across all 25 photos
const BENTO_ROWS = [
  // ROW 1 (2 Photos: Wide Landscape Left + Portrait Right)
  {
    id: 1,
    type: "two_col_wide_left",
    left: { url: "/images/album/sandeep-sandra/DSC09959.jpg", alt: "Sandeep & Sandra • Walking Hand in Hand" },
    right: { url: "/images/album/sandeep-sandra/DSC09989.jpg", alt: "Beach Romance" }
  },

  // ROW 2 (3 Photos: Trio Balance)
  {
    id: 2,
    type: "three_col",
    col1: { url: "/images/album/sandeep-sandra/DSC00017.jpg", alt: "Traditional Ceremony Portrait" },
    col2: { url: "/images/album/sandeep-sandra/DSC00154.jpg", alt: "Gentle Gaze" },
    col3: { url: "/images/album/sandeep-sandra/DSC09795.jpg", alt: "The Sacred Beginning" }
  },

  // ROW 3 (2 Photos: Portrait Left + Wide Landscape Right)
  {
    id: 3,
    type: "two_col_wide_right",
    left: { url: "/images/album/sandeep-sandra/DSC09854.jpg", alt: "Intimate Smile" },
    right: { url: "/images/album/sandeep-sandra/DSC09948.jpg", alt: "Together by the Shore" }
  },

  // ROW 4 (3 Photos: Trio Balance)
  {
    id: 4,
    type: "three_col",
    col1: { url: "/images/album/sandeep-sandra/DSC09893.jpg", alt: "Gentle Embrace" },
    col2: { url: "/images/album/sandeep-sandra/DSC00176.jpg", alt: "Two of Us in Harmony" },
    col3: { url: "/images/album/sandeep-sandra/DSC00311.jpg", alt: "Grace & Warmth" }
  },

  // ROW 5 (2 Photos: Wide Landscape Left + Portrait Right)
  {
    id: 5,
    type: "two_col_wide_left",
    left: { url: "/images/album/sandeep-sandra/DSC00514.jpg", alt: "Sacred Traditional Charm" },
    right: { url: "/images/album/sandeep-sandra/DSC00387.jpg", alt: "Candid Laughter" }
  },

  // ROW 6 (3 Photos: Trio Balance)
  {
    id: 6,
    type: "three_col",
    col1: { url: "/images/album/sandeep-sandra/DSC00438.jpg", alt: "Romantic Gaze" },
    col2: { url: "/images/album/sandeep-sandra/DSC00472.jpg", alt: "Veena Melody & Red Saree" },
    col3: { url: "/images/album/sandeep-sandra/DSC00496.jpg", alt: "Heritage Backdrop" }
  },

  // ROW 7 (2 Photos: Portrait Left + Wide Landscape Right)
  {
    id: 7,
    type: "two_col_wide_right",
    left: { url: "/images/album/sandeep-sandra/DSC00574.jpg", alt: "Love in Tradition" },
    right: { url: "/images/album/sandeep-sandra/DSC00776.jpg", alt: "Hand in Hand Walk" }
  },

  // ROW 8 (3 Photos: Trio Balance)
  {
    id: 8,
    type: "three_col",
    col1: { url: "/images/album/sandeep-sandra/DSC00640.jpg", alt: "Pure Happiness Together" },
    col2: { url: "/images/album/sandeep-sandra/DSC00832.jpg", alt: "Joyful Connection" },
    col3: { url: "/images/album/sandeep-sandra/DSC00900.jpg", alt: "Candid Glance" }
  },

  // ROW 9 (2 Photos: Wide Landscape Left + Portrait Right)
  {
    id: 9,
    type: "two_col_wide_left",
    left: { url: "/images/album/sandeep-sandra/DSC00981.jpg", alt: "Sunset Reflections" },
    right: { url: "/images/album/sandeep-sandra/DSC00969.jpg", alt: "Golden Hour Glow" }
  },

  // ROW 10 (3 Photos: Grand Finale Trio)
  {
    id: 10,
    type: "three_col",
    col1: { url: "/images/album/sandeep-sandra/DSC01080.jpg", alt: "Unscripted Joy" },
    col2: { url: "/images/album/sandeep-sandra/DSC01251.jpg", alt: "Happily Ever After" },
    col3: { url: "/images/album/sandeep-sandra/DSC01123.jpg", alt: "Timeless Together" }
  }
];

// Flat list of all 25 photos for full-screen lightbox stepper
const ALL_PHOTOS = [
  { url: "/images/album/sandeep-sandra/DSC09959.jpg", alt: "Sandeep & Sandra • Walking Hand in Hand" },
  { url: "/images/album/sandeep-sandra/DSC09989.jpg", alt: "Beach Romance" },
  { url: "/images/album/sandeep-sandra/DSC00017.jpg", alt: "Traditional Ceremony Portrait" },
  { url: "/images/album/sandeep-sandra/DSC00154.jpg", alt: "Gentle Gaze" },
  { url: "/images/album/sandeep-sandra/DSC09795.jpg", alt: "The Sacred Beginning" },
  { url: "/images/album/sandeep-sandra/DSC09854.jpg", alt: "Intimate Smile" },
  { url: "/images/album/sandeep-sandra/DSC09948.jpg", alt: "Together by the Shore" },
  { url: "/images/album/sandeep-sandra/DSC09893.jpg", alt: "Gentle Embrace" },
  { url: "/images/album/sandeep-sandra/DSC00176.jpg", alt: "Two of Us in Harmony" },
  { url: "/images/album/sandeep-sandra/DSC00311.jpg", alt: "Grace & Warmth" },
  { url: "/images/album/sandeep-sandra/DSC00514.jpg", alt: "Sacred Traditional Charm" },
  { url: "/images/album/sandeep-sandra/DSC00387.jpg", alt: "Candid Laughter" },
  { url: "/images/album/sandeep-sandra/DSC00438.jpg", alt: "Romantic Gaze" },
  { url: "/images/album/sandeep-sandra/DSC00472.jpg", alt: "Veena Melody & Red Saree" },
  { url: "/images/album/sandeep-sandra/DSC00496.jpg", alt: "Heritage Backdrop" },
  { url: "/images/album/sandeep-sandra/DSC00574.jpg", alt: "Love in Tradition" },
  { url: "/images/album/sandeep-sandra/DSC00776.jpg", alt: "Hand in Hand Walk" },
  { url: "/images/album/sandeep-sandra/DSC00640.jpg", alt: "Pure Happiness Together" },
  { url: "/images/album/sandeep-sandra/DSC00832.jpg", alt: "Joyful Connection" },
  { url: "/images/album/sandeep-sandra/DSC00900.jpg", alt: "Candid Glance" },
  { url: "/images/album/sandeep-sandra/DSC00981.jpg", alt: "Sunset Reflections" },
  { url: "/images/album/sandeep-sandra/DSC00969.jpg", alt: "Golden Hour Glow" },
  { url: "/images/album/sandeep-sandra/DSC01080.jpg", alt: "Unscripted Joy" },
  { url: "/images/album/sandeep-sandra/DSC01251.jpg", alt: "Happily Ever After" },
  { url: "/images/album/sandeep-sandra/DSC01123.jpg", alt: "Timeless Together" }
];

const DigitalAlbum = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If a client query exists on /gallery (e.g., ?code= or ?view=guest), render the client portal
  const searchParams = new URLSearchParams(location.search);
  const isClientPortalQuery = searchParams.has("code") || 
                              searchParams.has("passcode") || 
                              searchParams.has("accessCode") || 
                              searchParams.has("view") || 
                              searchParams.has("download");

  if (isClientPortalQuery) {
    return <ClientGallery />;
  }

  const [lightboxIndex, setLightboxIndex] = useState(null);
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev + 1) % ALL_PHOTOS.length);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Photo Gallery • Dreamwed Stories",
        text: "Captured moments from our wedding stories & scenic routes by Dreamwed Stories.",
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

  const openLightboxByUrl = (url) => {
    const idx = ALL_PHOTOS.findIndex((p) => p.url === url);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#b4975a] selection:text-white pb-24">
      <SEO 
        title="Photo Gallery • Captured Moments | Dreamwed Stories"
        description="Captured moments from our wedding stories & scenic routes. Experience the bespoke photography and candid moments by Dreamwed Stories."
      />

      {/* MINIMAL STICKY APP BAR */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-zinc-100 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Back Button */}
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            className="inline-flex items-center gap-2 text-zinc-700 hover:text-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            title="Go back"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Clean Studio Emblem */}
          <Link to="/" className="text-center group">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-zinc-950 group-hover:text-[#b4975a] transition-colors">
              Dreamwed Stories
            </span>
          </Link>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-zinc-700 hover:text-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            title="Share Gallery"
            aria-label="Share Gallery"
          >
            <span className="hidden sm:inline">Share</span>
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
            <span>Link Copied!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 lg:px-12 pt-6 sm:pt-10">
        
        {/* HEADER BLOCK (Matching Reference Design) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 pb-6 sm:pb-8 mb-4 sm:mb-6 border-b border-zinc-100">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 font-sans">
              Photo Gallery
            </h1>
          </div>
          <div className="sm:text-right">
            <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">
              Captured moments from our<br className="hidden sm:inline" />
              {" "}wedding stories & scenic routes.
            </p>
          </div>
        </div>

        {/* BENTO MOSAIC GRID (10 Alternating Rows, 25 Photos, Rounded Corners) */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {BENTO_ROWS.map((row) => {

            // ========================================================
            // LAYOUT 1: 2-COLUMN [WIDE LANDSCAPE 65% + PORTRAIT 35%]
            // ========================================================
            if (row.type === "two_col_wide_left") {
              return (
                <div 
                  key={row.id} 
                  className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 h-[220px] xs:h-[260px] sm:h-[350px] md:h-[450px] lg:h-[520px]"
                >
                  {/* Wide Left Image */}
                  <div 
                    className="col-span-7 sm:col-span-8 h-full rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-pointer group bg-zinc-100 shadow-sm"
                    onClick={() => openLightboxByUrl(row.left.url)}
                  >
                    <img 
                      src={row.left.url}
                      alt={row.left.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>

                  {/* Portrait Right Image */}
                  <div 
                    className="col-span-5 sm:col-span-4 h-full rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-pointer group bg-zinc-100 shadow-sm"
                    onClick={() => openLightboxByUrl(row.right.url)}
                  >
                    <img 
                      src={row.right.url}
                      alt={row.right.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>
                </div>
              );
            }

            // ========================================================
            // LAYOUT 2: 3-COLUMN [PORTRAIT 33% + CENTERPIECE 33% + PORTRAIT 33%]
            // ========================================================
            if (row.type === "three_col") {
              return (
                <div 
                  key={row.id} 
                  className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 h-[190px] xs:h-[230px] sm:h-[310px] md:h-[400px] lg:h-[460px]"
                >
                  <div 
                    className="col-span-4 h-full rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-pointer group bg-zinc-100 shadow-sm"
                    onClick={() => openLightboxByUrl(row.col1.url)}
                  >
                    <img 
                      src={row.col1.url}
                      alt={row.col1.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>

                  <div 
                    className="col-span-4 h-full rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-pointer group bg-zinc-100 shadow-sm"
                    onClick={() => openLightboxByUrl(row.col2.url)}
                  >
                    <img 
                      src={row.col2.url}
                      alt={row.col2.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>

                  <div 
                    className="col-span-4 h-full rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-pointer group bg-zinc-100 shadow-sm"
                    onClick={() => openLightboxByUrl(row.col3.url)}
                  >
                    <img 
                      src={row.col3.url}
                      alt={row.col3.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>
                </div>
              );
            }

            // ========================================================
            // LAYOUT 3: 2-COLUMN [PORTRAIT 35% + WIDE LANDSCAPE 65%]
            // ========================================================
            if (row.type === "two_col_wide_right") {
              return (
                <div 
                  key={row.id} 
                  className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 h-[220px] xs:h-[260px] sm:h-[350px] md:h-[450px] lg:h-[520px]"
                >
                  {/* Portrait Left Image */}
                  <div 
                    className="col-span-5 sm:col-span-4 h-full rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-pointer group bg-zinc-100 shadow-sm"
                    onClick={() => openLightboxByUrl(row.left.url)}
                  >
                    <img 
                      src={row.left.url}
                      alt={row.left.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>

                  {/* Wide Right Image */}
                  <div 
                    className="col-span-7 sm:col-span-8 h-full rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-pointer group bg-zinc-100 shadow-sm"
                    onClick={() => openLightboxByUrl(row.right.url)}
                  >
                    <img 
                      src={row.right.url}
                      alt={row.right.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* BOTTOM INQUIRY / BOOKING CTA */}
        <div className="pt-12 pb-16 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-0.5 bg-[#b4975a] rounded-full" />
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 font-sans">
            Ready to Capture Your Story?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
            Connect with our creative team to reserve your wedding date and craft an unforgettable visual legacy.
          </p>
          <a
            href="https://wa.me/919995412955?text=Hi%20Dreamwed,%20I%20loved%20the%20Photo%20Gallery!%20I'd%20like%20to%20inquire%20for%20my%20wedding."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#b4975a] hover:bg-[#c4a96a] text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer mt-2"
          >
            <PhoneCall size={15} />
            <span>Book Your Wedding Story</span>
          </a>
        </div>

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

      {/* FULLSCREEN LIGHTBOX CAROUSEL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 select-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Bar with Counter and Close Button */}
            <div className="absolute top-4 left-0 right-0 px-6 flex items-center justify-between text-white/80 z-10 pointer-events-none">
              <span className="text-xs uppercase tracking-widest font-mono pointer-events-auto bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                {lightboxIndex + 1} / {ALL_PHOTOS.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="pointer-events-auto text-white/80 hover:text-white bg-black/50 hover:bg-black/80 p-3 rounded-full border border-white/10 transition-all cursor-pointer"
                title="Close (Esc)"
                aria-label="Close photo preview"
              >
                <X size={20} />
              </button>
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length);
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/80 p-3 sm:p-4 rounded-full border border-white/10 transition-all cursor-pointer z-10"
              title="Previous Photo"
              aria-label="Previous Photo"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % ALL_PHOTOS.length);
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/80 p-3 sm:p-4 rounded-full border border-white/10 transition-all cursor-pointer z-10"
              title="Next Photo"
              aria-label="Next Photo"
            >
              <ChevronRight size={24} />
            </button>

            {/* Active Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={ALL_PHOTOS[lightboxIndex].url}
              alt={ALL_PHOTOS[lightboxIndex].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DigitalAlbum;