import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Download, 
  Share2, X, ChevronLeft, ChevronRight, RefreshCw, ZoomIn
} from "lucide-react";
import SEO from "../components/SEO";

const ClientGallery = () => {
  const { id } = useParams();
  const [isLocked, setIsLocked] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  
  // Gallery states
  const [meta, setMeta] = useState(null); // Locked state metadata
  const [gallery, setGallery] = useState(null); // Full gallery after unlock
  const [activePhoto, setActivePhoto] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const API_BASE = typeof window !== "undefined"
    ? (localStorage.getItem("dreamwed_api_base") || import.meta.env.VITE_API_BASE_URL || "https://dreamwed-backend.onrender.com")
    : "https://dreamwed-backend.onrender.com";

  // 1. Fetch public info on mount
  useEffect(() => {
    const fetchPublicInfo = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/public/galleries/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? "Gallery not found" : "Failed to load gallery info");
        }
        const data = await res.json();
        setMeta(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicInfo();
  }, [id, API_BASE]);

  // 2. Handle unlock with access code
  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    
    setUnlocking(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/public/galleries/${id}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: passcode.trim() })
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid access code. Please try again.");
        }
        throw new Error("Failed to unlock gallery");
      }
      
      const data = await res.json();
      setGallery(data);
      setIsLocked(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUnlocking(false);
    }
  };

  // 3. Navigation inside Lightbox
  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    if (!gallery || !gallery.photos || !activePhoto) return;
    const currentIndex = gallery.photos.findIndex(p => p.id === activePhoto.id);
    if (currentIndex > 0) {
      setActivePhoto(gallery.photos[currentIndex - 1]);
    } else {
      setActivePhoto(gallery.photos[gallery.photos.length - 1]); // Loop back to end
    }
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    if (!gallery || !gallery.photos || !activePhoto) return;
    const currentIndex = gallery.photos.findIndex(p => p.id === activePhoto.id);
    if (currentIndex < gallery.photos.length - 1) {
      setActivePhoto(gallery.photos[currentIndex + 1]);
    } else {
      setActivePhoto(gallery.photos[0]); // Loop back to start
    }
  };

  // Keybindings for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activePhoto) return;
      if (e.key === "ArrowLeft") handlePrevPhoto(e);
      if (e.key === "ArrowRight") handleNextPhoto(e);
      if (e.key === "Escape") setActivePhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, gallery]);

  // Share functionality
  const handleShareGallery = () => {
    if (navigator.share) {
      navigator.share({
        title: `${meta?.name || "Dreamwed"} Client Gallery`,
        text: `Browse the gorgeous photo gallery of ${meta?.name || "Wedding"}.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("📋 Gallery link copied to clipboard!");
    }
  };

  // Render Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-light">
        <RefreshCw size={36} className="animate-spin text-[#d4af37] mb-4" />
        <p className="text-zinc-400 text-xs tracking-widest uppercase">Loading Private Gallery...</p>
      </div>
    );
  }

  // Render Error state (if gallery doesn't exist)
  if (error && !meta) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center text-white">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light mb-2">Gallery Unavailable</h2>
        <p className="text-zinc-500 text-sm max-w-md mb-6">{error}</p>
        <Link to="/" className="px-6 py-3 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col select-none selection:bg-[#b4975a]/30">
      <SEO 
        title={`${meta?.name || "Private"} Gallery | Dreamwed Stories`}
        description="View private high-quality client photos protected by Dreamwed Stories."
      />

      <AnimatePresence mode="wait">
        {/* LOCK / INTRO SCREEN */}
        {isLocked ? (
          <motion.div 
            key="lock-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex-grow flex items-center justify-center p-6 min-h-screen overflow-hidden"
          >
            {/* Immersive blurred cover background */}
            <div 
              className="absolute inset-0 bg-cover bg-center scale-105 filter blur-md brightness-50 opacity-40 transition-all duration-1000"
              style={{ backgroundImage: `url(${meta?.coverUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

            {/* Lock Box container */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 sm:p-10 rounded-[32px] shadow-2xl text-center space-y-8"
            >
              {/* Branding */}
              <div className="space-y-2">
                <span className="text-[#b4975a] uppercase font-bold tracking-widest text-[9px] block">Dreamwed Stories</span>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl text-white font-light leading-none">
                  {meta?.name}
                </h1>
                <p className="text-zinc-400 text-xs tracking-wider font-light mt-1">Wedding Photography Gallery</p>
              </div>

              {/* Lock Indicator */}
              <div className="w-16 h-16 bg-zinc-800/40 border border-zinc-700/50 rounded-full flex items-center justify-center mx-auto text-[#b4975a]">
                <Lock size={22} className="animate-pulse" />
              </div>

              <p className="text-zinc-300 text-xs font-light px-4 leading-relaxed">
                This digital gallery is private. Please enter the secure access code sent by the admin to unlock the memories.
              </p>

              {/* Form */}
              <form onSubmit={handleUnlock} className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px] block ml-1">Access Code</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter 4-digit code"
                      className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-[#b4975a] text-center text-white tracking-[0.25em] font-mono rounded-2xl py-3.5 px-4 focus:outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-650 text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/40 text-red-400 text-[11px] rounded-xl font-light"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={unlocking}
                  className="w-full py-4 bg-[#b4975a] hover:bg-[#c5a86b] disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#b4975a]/10"
                >
                  {unlocking ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    "Unlock Gallery"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        ) : (
          /* UNLOCKED GALLERY VIEW */
          <motion.div 
            key="gallery-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-grow flex flex-col"
          >
            {/* Gallery Header */}
            <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 z-40 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Link to="/" className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-all cursor-pointer">
                  <ArrowLeft size={16} />
                </Link>
                <div>
                  <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-white font-medium leading-none">
                    {gallery?.name}
                  </h1>
                  <span className="text-[9px] text-[#b4975a] font-bold uppercase tracking-wider block mt-1">Dreamwed Stories Gallery</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleShareGallery}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl border border-zinc-800 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Share2 size={12} /> Share
                </button>
              </div>
            </header>

            {/* Gallery Grid */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2.5">
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light">
                  Capturing Your <span className="italic font-serif text-[#b4975a]">Love Story</span>
                </h2>
                <p className="text-zinc-500 text-xs font-light leading-relaxed">
                  Thank you for letting Dreamwed Stories capture your memories. Here are your high-resolution wedding deliverables. Feel free to browse, preview, and download.
                </p>
                <div className="w-10 h-[1px] bg-[#b4975a]/50 mx-auto mt-4" />
              </div>

              {gallery?.photos && gallery.photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
                  {gallery.photos.map((photo, index) => (
                    <motion.div 
                      key={photo.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.5 }}
                      className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-zoom-in aspect-[4/5] shadow-lg shadow-black/20"
                      onClick={() => setActivePhoto(photo)}
                    >
                      <img 
                        src={photo.url} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        loading="lazy"
                        alt={`Wedding Deliverable ${index + 1}`}
                      />
                      
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-end justify-between p-4" />
                      
                      <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-350">
                        <span className="text-[10px] text-zinc-300 font-light">Photo {index + 1}</span>
                      </div>
                      
                      <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-350">
                        <a 
                          href={photo.url} 
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()} 
                          className="p-2 bg-zinc-950/80 hover:bg-[#b4975a] hover:text-zinc-950 border border-zinc-800 rounded-xl text-white transition-all cursor-pointer block"
                          title="Open HD Original"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-zinc-800 rounded-3xl text-zinc-500 font-light text-sm">
                  This gallery is empty. The images might still be synchronizing from Google Drive.
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col justify-between"
            onClick={() => setActivePhoto(null)}
          >
            {/* Lightbox Header */}
            <div className="p-4 flex justify-between items-center text-white z-10 w-full bg-gradient-to-b from-black/60 to-transparent">
              <span className="text-xs text-zinc-400 font-light ml-2">
                {gallery?.photos ? `${gallery.photos.findIndex(p => p.id === activePhoto.id) + 1} / ${gallery.photos.length}` : ""}
              </span>
              
              <div className="flex items-center gap-4">
                <a 
                  href={activePhoto.url} 
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 bg-zinc-900/80 hover:bg-[#b4975a] hover:text-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Download size={14} /> Download HD
                </a>
                
                <button 
                  onClick={() => setActivePhoto(null)}
                  className="p-2.5 bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Lightbox Main View */}
            <div className="relative flex-grow flex items-center justify-center p-4">
              {/* Prev Button */}
              <button 
                onClick={handlePrevPhoto}
                className="absolute left-6 p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-white rounded-2xl cursor-pointer hover:border-[#b4975a] transition-all"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Photo */}
              <motion.img 
                key={activePhoto.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={activePhoto.url} 
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg border border-zinc-900 shadow-2xl select-none"
                onClick={(e) => e.stopPropagation()}
                alt="Fullscreen Preview"
              />

              {/* Next Button */}
              <button 
                onClick={handleNextPhoto}
                className="absolute right-6 p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-white rounded-2xl cursor-pointer hover:border-[#b4975a] transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Lightbox Footer */}
            <div className="p-4 text-center text-zinc-500 text-[10px] font-light bg-gradient-to-t from-black/60 to-transparent">
              Use your Left &amp; Right arrow keys to navigate, Esc to close.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientGallery;
