import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Download, 
  Share2, X, ChevronLeft, ChevronRight, RefreshCw, ZoomIn,
  Heart, Check, Sparkles, Filter, Search, Camera
} from "lucide-react";
import SEO from "../components/SEO";

const FONT_MAP = {
  cormorant: "'Cormorant Garamond', serif",
  playfair: "'Playfair Display', serif",
  cinzel: "'Cinzel', serif",
  greatvibes: "'Great Vibes', cursive",
  alexbrush: "'Alex Brush', cursive",
  inter: "'Inter', sans-serif"
};

const ALIGN_MAP = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom"
};

const TEXT_ALIGN_MAP = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end"
};

const ClientGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLocked, setIsLocked] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  
  // Gallery states
  const [meta, setMeta] = useState(null); // Locked state metadata
  const [gallery, setGallery] = useState(null); // Full gallery after unlock
  const [activePhoto, setActivePhoto] = useState(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState(new Set());
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'favorites'
  const [saveStatus, setSaveStatus] = useState(""); // '', 'saving', 'saved'
  const syncTimeoutRef = useRef(null);

  const API_BASE = typeof window !== "undefined"
    ? (localStorage.getItem("dreamwed_api_base") || import.meta.env.VITE_API_BASE_URL || "https://dreamwed-backend.onrender.com")
    : "https://dreamwed-backend.onrender.com";

  // 1. Fetch gallery info on mount if ID is present
  useEffect(() => {
    let isMounted = true;
    
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchPublicInfo = async () => {
      setLoading(true);
      setError("");

      // 1a. Instant check local storage
      let hadLocal = false;
      try {
        const localGals = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
        const localMatch = localGals.find(g => 
          g.id === id || 
          g.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id ||
          g.accessCode === id
        );
        if (localMatch && isMounted) {
          hadLocal = true;
          setMeta(localMatch);
          setGallery(localMatch);
          setLoading(false);
        }
      } catch (e) {}

      // 1b. Fetch from backend API
      try {
        const res = await fetch(`${API_BASE}/api/public/galleries/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setMeta(data);
            setLoading(false);
          }
        } else if (!hadLocal) {
          if (isMounted) {
            throw new Error(res.status === 404 ? "Gallery not found on server" : "Failed to load gallery info");
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted && !hadLocal) {
          setError(err.message || "Failed to load gallery.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchPublicInfo();
    return () => { isMounted = false; };
  }, [id, API_BASE]);

  // 2. Handle unlock with access code
  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    const cleanCode = passcode.trim();
    if (!cleanCode) return;
    
    setUnlocking(true);
    setError("");

    // Check local fallback first
    try {
      const localGals = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
      const localMatch = localGals.find(g => 
        (id ? (g.id === id || g.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id) : true) && 
        String(g.accessCode).trim() === cleanCode
      );
      if (localMatch) {
        setMeta(localMatch);
        setGallery(localMatch);
        if (localMatch.selectedPhotoIds && Array.isArray(localMatch.selectedPhotoIds)) {
          setSelectedPhotoIds(new Set(localMatch.selectedPhotoIds));
        }
        setIsLocked(false);
        setUnlocking(false);
        if (!id) {
          navigate(`/gallery/${localMatch.id}`, { replace: true });
        }
        return;
      }
    } catch (e) {}

    // Fetch from backend
    const targetGalleryId = id || meta?.id;
    if (targetGalleryId) {
      try {
        const res = await fetch(`${API_BASE}/api/public/galleries/${targetGalleryId}/unlock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessCode: cleanCode })
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Invalid access code. Please check and try again.");
          }
          throw new Error("Failed to unlock gallery");
        }
        
        const data = await res.json();
        setGallery(data);
        setMeta(data);
        if (data.selectedPhotoIds && Array.isArray(data.selectedPhotoIds)) {
          setSelectedPhotoIds(new Set(data.selectedPhotoIds));
        }
        setIsLocked(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setUnlocking(false);
      }
    } else {
      // Direct search by access code across backend
      try {
        const res = await fetch(`${API_BASE}/api/galleries`);
        if (res.ok) {
          const list = await res.json();
          const match = list.find(g => String(g.accessCode).trim() === cleanCode);
          if (match) {
            // Unlock match
            const unlockRes = await fetch(`${API_BASE}/api/public/galleries/${match.id}/unlock`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessCode: cleanCode })
            });
            if (unlockRes.ok) {
              const fullData = await unlockRes.json();
              setGallery(fullData);
              setMeta(fullData);
              if (fullData.selectedPhotoIds && Array.isArray(fullData.selectedPhotoIds)) {
                setSelectedPhotoIds(new Set(fullData.selectedPhotoIds));
              }
              setIsLocked(false);
              navigate(`/gallery/${match.id}`, { replace: true });
              return;
            }
          }
        }
        throw new Error("No gallery found matching this access code.");
      } catch (err) {
        console.error(err);
        setError(err.message || "Invalid passcode.");
      } finally {
        setUnlocking(false);
      }
    }
  };

  // 3. Sync favorite hearts to backend
  const syncSelectionsToBackend = (idsSet) => {
    const currentGalId = gallery?.id || id;
    if (!currentGalId) return;

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    setSaveStatus("saving");
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/api/public/galleries/${currentGalId}/selections`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedPhotoIds: Array.from(idsSet) })
        });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (e) {
        console.error("Failed to sync selections:", e);
        setSaveStatus("");
      }
    }, 600);
  };

  const toggleHeartPhoto = (photoId, e) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIds(prev => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      syncSelectionsToBackend(next);
      return next;
    });
  };

  // Computed gallery photos
  const allPhotos = gallery?.photos || [];
  const displayedPhotos = filterMode === "favorites"
    ? allPhotos.filter(p => selectedPhotoIds.has(p.id))
    : allPhotos;

  // 4. Navigation inside Lightbox
  const handlePrevPhoto = (e) => {
    if (e) e.stopPropagation();
    if (!displayedPhotos || displayedPhotos.length === 0 || !activePhoto) return;
    const currentIndex = displayedPhotos.findIndex(p => p.id === activePhoto.id);
    if (currentIndex > 0) {
      setActivePhoto(displayedPhotos[currentIndex - 1]);
    } else {
      setActivePhoto(displayedPhotos[displayedPhotos.length - 1]);
    }
  };

  const handleNextPhoto = (e) => {
    if (e) e.stopPropagation();
    if (!displayedPhotos || displayedPhotos.length === 0 || !activePhoto) return;
    const currentIndex = displayedPhotos.findIndex(p => p.id === activePhoto.id);
    if (currentIndex < displayedPhotos.length - 1) {
      setActivePhoto(displayedPhotos[currentIndex + 1]);
    } else {
      setActivePhoto(displayedPhotos[0]);
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
  }, [activePhoto, displayedPhotos]);

  // Share functionality
  const handleShareGallery = () => {
    if (navigator.share) {
      navigator.share({
        title: `${meta?.name || "Dreamwed"} Client Gallery`,
        text: `Browse the private wedding photo gallery of ${meta?.name || "Dreamwed Stories"}.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("📋 Gallery link copied to clipboard!");
    }
  };

  // Active theme styling properties
  const activeColor = (isLocked ? meta?.coverColor : (gallery?.coverColor || meta?.coverColor)) || "#b4975a";
  const activeFontKey = (isLocked ? meta?.coverFont : (gallery?.coverFont || meta?.coverFont)) || "cormorant";
  const activeFontFamily = FONT_MAP[activeFontKey] || FONT_MAP.cormorant;
  const activeAlignClass = ALIGN_MAP[(isLocked ? meta?.coverAlign : (gallery?.coverAlign || meta?.coverAlign)) || "center"] || "object-center";
  const activeTextAlign = TEXT_ALIGN_MAP[(isLocked ? meta?.coverTextAlign : (gallery?.coverTextAlign || meta?.coverTextAlign)) || "center"] || "text-center items-center";

  // Loading indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-light p-6">
        <RefreshCw size={36} className="animate-spin text-[#b4975a] mb-4" />
        <p className="text-zinc-400 text-xs tracking-widest uppercase font-mono">Loading Private Gallery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-[#b4975a] selection:text-black">
      <SEO 
        title={`${meta?.name || "Private"} Gallery | Dreamwed Stories`}
        description="View private high-quality client photos protected by Dreamwed Stories."
      />

      {/* ========================================================= */}
      {/* 1. LOCK SCREEN / PORTAL GATEWAY */}
      {/* ========================================================= */}
      {isLocked ? (
        <div className="relative flex-grow flex items-center justify-center p-4 sm:p-6 min-h-screen overflow-hidden">
          {/* Cinematic Cover Background */}
          <div 
            className={`absolute inset-0 bg-cover bg-center ${activeAlignClass} scale-105 filter blur-[4px] brightness-40 opacity-50 transition-all duration-1000`}
            style={{ backgroundImage: `url(${meta?.coverUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200"})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/80" />

          {/* Lock Card Container */}
          <div className="relative w-full max-w-lg bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800/80 p-6 sm:p-10 rounded-[36px] shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-center space-y-6 z-10">
            {/* Monogram Brand Header */}
            <div className="flex flex-col items-center space-y-2">
              <img 
                src="/appIcon.png" 
                alt="Dreamwed Stories" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain filter drop-shadow-[0_4px_20px_rgba(255,255,255,0.25)]" 
              />
              <span 
                style={{ color: activeColor }}
                className="uppercase font-bold tracking-[0.3em] text-[10px] block"
              >
                Dreamwed Stories
              </span>
            </div>

            {/* If specific gallery metadata exists, show live cover card */}
            {meta?.coverUrl ? (
              <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-zinc-800/80 shadow-inner group">
                <img 
                  src={meta.coverUrl} 
                  alt="Wedding Cover" 
                  className={`w-full h-full object-cover ${activeAlignClass} group-hover:scale-105 transition-transform duration-700 brightness-90`} 
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 ${activeTextAlign}`}>
                  <span 
                    style={{ color: activeColor }}
                    className="text-[9px] uppercase font-bold tracking-widest block mb-1"
                  >
                    Wedding Deliverables
                  </span>
                  <h2 
                    style={{ fontFamily: activeFontFamily }} 
                    className="text-2xl sm:text-3xl text-white font-light leading-tight"
                  >
                    {meta?.groomName && meta?.brideName ? (
                      <>
                        <span>{meta.groomName}</span>{" "}
                        <span style={{ color: activeColor }} className="italic font-serif">&amp;</span>{" "}
                        <span>{meta.brideName}</span>
                      </>
                    ) : (
                      meta?.name || "Dreamwed Wedding"
                    )}
                  </h2>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-1 text-center">
                <span className="text-[#b4975a] text-[10px] font-bold uppercase tracking-widest">Client Photo Portal</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-white font-light">
                  Find Your Wedding Gallery
                </h2>
              </div>
            )}

            {/* Passcode Lock Notice */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-zinc-300 text-xs font-light">
                <Lock size={13} style={{ color: activeColor }} />
                <span>Private Gallery • 4-Digit Passcode Required</span>
              </div>
            </div>

            {/* Unlock Form */}
            <form onSubmit={handleUnlock} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[9px] block ml-1">
                  Enter 4-Digit Passcode
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="e.g., 3493"
                    autoFocus
                    className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#b4975a] text-center text-white tracking-[0.3em] font-mono rounded-2xl py-3.5 px-4 focus:outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-650 text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-900/40 text-red-400 text-[11px] rounded-xl font-light">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={unlocking}
                style={{ backgroundColor: activeColor }}
                className="w-full py-4 text-zinc-950 font-bold rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:brightness-110 disabled:opacity-50"
              >
                {unlocking ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  "Unlock & Enter Gallery"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* 2. UNLOCKED GALLERY VIEW WITH HEART SELECTIONS */
        /* ========================================================= */
        <div className="flex-grow flex flex-col pb-24">
          {/* Gallery Sticky Header */}
          <header className="sticky top-0 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-900 z-40 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-all cursor-pointer">
                <ArrowLeft size={16} />
              </Link>
              <div>
                <h1 
                  style={{ fontFamily: activeFontFamily }} 
                  className="text-xl text-white font-medium leading-none"
                >
                  {gallery?.groomName && gallery?.brideName 
                    ? `${gallery.groomName} & ${gallery.brideName}` 
                    : (gallery?.name || "Dreamwed Gallery")}
                </h1>
                <span 
                  style={{ color: activeColor }}
                  className="text-[9px] font-bold uppercase tracking-wider block mt-1"
                >
                  Dreamwed Stories Gallery
                </span>
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

          {/* Gallery Photo Grid */}
          <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2.5">
              <h2 
                style={{ fontFamily: activeFontFamily }} 
                className="text-3xl sm:text-4xl text-white font-light"
              >
                Capturing Your <span style={{ color: activeColor }} className="italic font-serif">Love Story</span>
              </h2>
              <p className="text-zinc-400 text-xs font-light leading-relaxed">
                Click the ❤️ heart button on any photo to favorite and select photos for your album. Your selections are automatically saved for the Dreamwed team.
              </p>
              <div 
                style={{ backgroundColor: `${activeColor}80` }}
                className="w-10 h-[1px] mx-auto mt-4" 
              />
            </div>

            {displayedPhotos && displayedPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
                {displayedPhotos.map((photo, index) => {
                  const isFavorited = selectedPhotoIds.has(photo.id);
                  return (
                    <div 
                      key={photo.id || index}
                      className="group relative bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden cursor-zoom-in aspect-[4/5] shadow-lg shadow-black/20"
                      onClick={() => setActivePhoto(photo)}
                    >
                      <img 
                        src={photo.url} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        loading="lazy"
                        alt={`Wedding Deliverable ${index + 1}`}
                      />
                      
                      {/* ❤️ Heart Favorite Button */}
                      <button
                        onClick={(e) => toggleHeartPhoto(photo.id, e)}
                        title={isFavorited ? "Remove from Favorites" : "Add to Favorites (Love)"}
                        className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-30 cursor-pointer shadow-xl ${
                          isFavorited 
                            ? "bg-red-500 text-white scale-110 shadow-red-500/50" 
                            : "bg-black/60 backdrop-blur-md text-white/80 hover:text-red-400 hover:scale-110 hover:bg-black/90 border border-white/10"
                        }`}
                      >
                        <Heart size={16} className={isFavorited ? "fill-white text-white" : "text-white"} />
                      </button>

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-end justify-between p-4 pointer-events-none" />
                      
                      <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-350">
                        <span className="text-[10px] text-zinc-300 font-light">Photo {index + 1}</span>
                      </div>
                      
                      <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-350">
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
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 border border-zinc-800 rounded-3xl text-zinc-500 font-light text-sm">
                {filterMode === "favorites" 
                  ? "No photos have been favorited yet. Click the ❤️ heart button on any picture to select it."
                  : "This gallery is empty. The images might still be synchronizing from Google Drive."}
              </div>
            )}
          </main>

          {/* Floating Selection Filter Pill */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-full px-4 sm:px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-3 text-xs">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                filterMode === "all" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              All ({allPhotos.length})
            </button>
            <button
              onClick={() => setFilterMode("favorites")}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                filterMode === "favorites" ? "bg-red-500 text-white font-bold" : "text-zinc-400 hover:text-red-400"
              }`}
            >
              <Heart size={14} className={selectedPhotoIds.size > 0 ? "fill-current" : ""} />
              Favorites ({selectedPhotoIds.size})
            </button>

            {saveStatus === "saving" && (
              <span 
                style={{ color: activeColor }}
                className="text-[10px] font-bold uppercase tracking-wider pl-2 border-l border-zinc-800 flex items-center gap-1"
              >
                <RefreshCw size={11} className="animate-spin" /> Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider pl-2 border-l border-zinc-800 flex items-center gap-1">
                <Check size={11} /> Saved
              </span>
            )}
          </div>
        </div>
      )}

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
                {displayedPhotos ? `${displayedPhotos.findIndex(p => p.id === activePhoto.id) + 1} / ${displayedPhotos.length}` : ""}
              </span>
              
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Heart Button in Lightbox */}
                <button
                  onClick={(e) => toggleHeartPhoto(activePhoto.id, e)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                    selectedPhotoIds.has(activePhoto.id)
                      ? "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 border-zinc-800"
                  }`}
                >
                  <Heart size={14} className={selectedPhotoIds.has(activePhoto.id) ? "fill-white" : ""} />
                  <span className="hidden sm:inline">
                    {selectedPhotoIds.has(activePhoto.id) ? "Favorited" : "Favorite"}
                  </span>
                </button>

                <a 
                  href={activePhoto.url} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ borderColor: activeColor }}
                  className="p-2.5 bg-zinc-900/80 hover:brightness-110 border rounded-xl text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Download size={14} /> <span className="hidden sm:inline">Download HD</span>
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
                title="Previous Photo (Left Arrow key)"
                className="absolute left-2 sm:left-6 z-30 p-3 sm:p-4 bg-zinc-950/80 hover:brightness-125 text-white border border-zinc-700/60 rounded-full shadow-2xl cursor-pointer transition-all flex items-center justify-center backdrop-blur-md group"
              >
                <ChevronLeft size={26} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Photo */}
              <img 
                src={activePhoto.url} 
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg border border-zinc-900 shadow-2xl select-none z-10"
                onClick={(e) => e.stopPropagation()}
                alt="Fullscreen Preview"
              />

              {/* Next Button */}
              <button 
                onClick={handleNextPhoto}
                title="Next Photo (Right Arrow key)"
                className="absolute right-2 sm:right-6 z-30 p-3 sm:p-4 bg-zinc-950/80 hover:brightness-125 text-white border border-zinc-700/60 rounded-full shadow-2xl cursor-pointer transition-all flex items-center justify-center backdrop-blur-md group"
              >
                <ChevronRight size={26} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Lightbox Footer */}
            <div className="p-4 text-center text-zinc-500 text-[10px] font-light bg-gradient-to-t from-black/60 to-transparent">
              Use Left &amp; Right arrow keys to navigate, Esc to close.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientGallery;
