import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Download, 
  Share2, X, ChevronLeft, ChevronRight, RefreshCw, ZoomIn,
  Heart, Check, Sparkles, Filter, Search, Camera, Copy,
  LayoutGrid, Grid
} from "lucide-react";
import SEO from "../components/SEO";
import { downloadPhotosAsZip } from "../utils/zipDownloader";

const FONT_MAP = {
  cormorant: "'Cormorant Garamond', serif",
  playfair: "'Playfair Display', serif",
  cinzel: "'Cinzel', serif",
  greatvibes: "'Great Vibes', cursive",
  alexbrush: "'Alex Brush', cursive",
  inter: "'Inter', sans-serif"
};

const getObjectPositionStyle = (val) => {
  if (val === "top" || val === 0 || val === "0") return "center 0%";
  if (val === "bottom" || val === 100 || val === "100") return "center 100%";
  if (val === "center" || val === 50 || val === "50" || !val) return "center 50%";
  const num = Number(String(val).replace("%", ""));
  if (!isNaN(num)) return `center ${num}%`;
  return "center 50%";
};

const TEXT_ALIGN_MAP = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end"
};

const ClientGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if opened via shareable download link (?download=favorites or ?mode=selections)
  const searchParams = new URLSearchParams(location.search);
  const isDirectDownloadMode = searchParams.get("download") === "favorites" || 
                               searchParams.get("download") === "selections" || 
                               searchParams.get("mode") === "favorites";

  const [isLocked, setIsLocked] = useState(!isDirectDownloadMode);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  
  // Gallery states
  const [meta, setMeta] = useState(null); // Locked state metadata
  const [gallery, setGallery] = useState(null); // Full gallery after unlock
  const [selectedPhotosData, setSelectedPhotosData] = useState(null); // When in direct download mode
  const [activePhoto, setActivePhoto] = useState(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState(new Set());
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'favorites'
  const [saveStatus, setSaveStatus] = useState(""); // '', 'saving', 'saved'
  const [zippingState, setZippingState] = useState(null); // { isZipping: bool, percent: number, status: string }
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

      // If in direct shareable download mode, fetch the selected photos directly
      if (isDirectDownloadMode) {
        try {
          // Check local storage first
          const localGals = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
          const localMatch = localGals.find(g => 
            g.id === id || 
            g.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id ||
            g.accessCode === id
          );

          if (localMatch && isMounted) {
            setMeta(localMatch);
            const favIds = new Set(localMatch.selectedPhotoIds || []);
            const favPhotos = (localMatch.photos || []).filter(p => favIds.has(p.id));
            setSelectedPhotosData({
              galleryId: localMatch.id,
              galleryName: localMatch.name,
              groomName: localMatch.groomName || "",
              brideName: localMatch.brideName || "",
              coverUrl: localMatch.coverUrl,
              coverAlign: localMatch.coverAlign || "center",
              coverTextAlign: localMatch.coverTextAlign || "center",
              coverFont: localMatch.coverFont || "cormorant",
              coverColor: localMatch.coverColor || "#b4975a",
              count: favPhotos.length,
              photos: favPhotos
            });
            setLoading(false);
          }

          // Fetch from backend public selected photos endpoint
          const res = await fetch(`${API_BASE}/api/public/galleries/${id}/selected-photos`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setSelectedPhotosData(data);
              setMeta(data);
              setLoading(false);
            }
          }
        } catch (err) {
          console.error("Direct download fetch error:", err);
        }
        return;
      }

      // Normal locked gallery flow
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
  }, [id, API_BASE, isDirectDownloadMode]);

  // 2. Handle unlock with access code
  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    const cleanCode = passcode.trim();
    if (!cleanCode) {
      setError("Please enter the gallery access code.");
      return;
    }

    setUnlocking(true);
    setError("");

    // 2a. Check localStorage first
    try {
      const localGals = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
      const localMatch = localGals.find(g => 
        (g.id === id || !id) && 
        (String(g.accessCode).trim().toLowerCase() === cleanCode.toLowerCase() ||
         String(g.id).toLowerCase() === cleanCode.toLowerCase())
      );

      if (localMatch) {
        setGallery(localMatch);
        setMeta(localMatch);
        setSelectedPhotoIds(new Set(localMatch.selectedPhotoIds || []));
        setIsLocked(false);
        setUnlocking(false);
        if (!id) navigate(`/gallery/${localMatch.id}`, { replace: true });
        return;
      }
    } catch (e) {}

    // 2b. If no local match, authenticate with backend
    try {
      const targetId = id || cleanCode;
      const res = await fetch(`${API_BASE}/api/public/galleries/${targetId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: cleanCode })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Incorrect access code. Please try again.");
      }

      const galData = await res.json();
      setGallery(galData);
      setMeta(galData);
      setSelectedPhotoIds(new Set(galData.selectedPhotoIds || []));
      setIsLocked(false);
      if (!id) navigate(`/gallery/${galData.id}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to unlock gallery. Verify your access code.");
    } finally {
      setUnlocking(false);
    }
  };

  // 3. Heart selection toggle & background auto-sync
  const syncSelectionsToBackend = (newSet) => {
    setSaveStatus("saving");
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(async () => {
      const selectedArray = Array.from(newSet);
      
      // Update local storage copy
      try {
        const localGals = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
        const updated = localGals.map(g => {
          if (g.id === gallery?.id || g.id === id) {
            return { ...g, selectedPhotoIds: selectedArray };
          }
          return g;
        });
        localStorage.setItem("dreamwed_galleries", JSON.stringify(updated));
      } catch (e) {}

      // Sync with backend API
      try {
        const targetId = gallery?.id || id;
        if (targetId) {
          await fetch(`${API_BASE}/api/public/galleries/${targetId}/selections`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedPhotoIds: selectedArray })
          });
        }
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

  // 1-Click ZIP Downloader
  const handleDownloadZipPackage = async (photosToDownload) => {
    if (!photosToDownload || photosToDownload.length === 0) {
      alert("No photos to download.");
      return;
    }

    try {
      setZippingState({ isZipping: true, percent: 5, status: `Packaging ${photosToDownload.length} photos into ZIP...` });
      await downloadPhotosAsZip({
        photos: photosToDownload,
        galleryName: meta?.name || gallery?.name || "Dreamwed_Wedding",
        groomName: meta?.groomName || gallery?.groomName || "",
        brideName: meta?.brideName || gallery?.brideName || "",
        apiBase: API_BASE,
        onProgress: (p) => setZippingState({ isZipping: true, percent: p.percent, status: p.status })
      });
      setZippingState({ isZipping: false, percent: 100, status: "✅ ZIP Downloaded Successfully!" });
      setTimeout(() => setZippingState(null), 3500);
    } catch (err) {
      console.error("ZIP Error:", err);
      alert("Failed to create ZIP: " + err.message);
      setZippingState(null);
    }
  };

  // Active theme styling properties
  const activeColor = (isLocked ? meta?.coverColor : (gallery?.coverColor || meta?.coverColor)) || "#b4975a";
  const activeFontKey = (isLocked ? meta?.coverFont : (gallery?.coverFont || meta?.coverFont)) || "cormorant";
  const activeFontFamily = FONT_MAP[activeFontKey] || FONT_MAP.cormorant;
  const rawAlign = (isLocked ? meta?.coverAlign : (gallery?.coverAlign || meta?.coverAlign)) ?? "50%";
  const activePositionStyle = getObjectPositionStyle(rawAlign);
  const activeTextAlign = TEXT_ALIGN_MAP[(isLocked ? meta?.coverTextAlign : (gallery?.coverTextAlign || meta?.coverTextAlign)) || "center"] || "text-center items-center";

  // Computed gallery photos
  const allPhotos = isDirectDownloadMode 
    ? (selectedPhotosData?.photos || [])
    : (gallery?.photos || []);

  const displayedPhotos = filterMode === "favorites" && !isDirectDownloadMode
    ? allPhotos.filter(p => selectedPhotoIds.has(p.id))
    : allPhotos;

  // 4. Navigation inside Single Photo Showcase View
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

  // Keybindings for single photo view
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

  // Loading indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-light p-6">
        <RefreshCw size={36} className="animate-spin text-[#b4975a] mb-4" />
        <p className="text-zinc-400 text-xs tracking-widest uppercase font-mono">Loading Private Gallery...</p>
      </div>
    );
  }

  // =========================================================
  // SPECIAL VIEW: SHAREABLE CLIENT SELECTIONS DOWNLOAD HUB
  // (Triggered when someone opens link with ?download=favorites)
  // =========================================================
  if (isDirectDownloadMode && selectedPhotosData) {
    const photos = selectedPhotosData.photos || [];
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-[#b4975a] selection:text-black">
        <SEO 
          title={`Download Selections: ${selectedPhotosData.galleryName || "Wedding"} | Dreamwed Stories`}
          description="Download all approved and favorited high-res wedding deliverables from Dreamwed Stories in 1-click."
        />

        {/* Top Header */}
        <header className="border-b border-zinc-850/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              to={`/gallery/${id}`}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Open full interactive gallery"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 style={{ fontFamily: activeFontFamily }} className="text-xl text-white font-medium leading-none">
                {selectedPhotosData.groomName && selectedPhotosData.brideName 
                  ? `${selectedPhotosData.groomName} & ${selectedPhotosData.brideName}`
                  : selectedPhotosData.galleryName}
              </h1>
              <span style={{ color: activeColor }} className="text-[9px] font-bold uppercase tracking-wider block mt-1">
                Client Selections Repository
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const urls = photos.map(p => p.url).join("\n");
                navigator.clipboard.writeText(urls);
                alert(`📋 Copied ${photos.length} photo URLs to clipboard!`);
              }}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Copy size={13} /> Copy Links
            </button>

            <button
              disabled={zippingState?.isZipping || photos.length === 0}
              onClick={() => handleDownloadZipPackage(photos)}
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 disabled:opacity-50 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 transition-all"
            >
              <Download size={14} className={zippingState?.isZipping ? "animate-bounce" : ""} />
              {zippingState?.isZipping ? "Zipping Photos..." : `⚡ Download All ZIP (${photos.length})`}
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
          {/* Cover Hero Banner */}
          {selectedPhotosData.coverUrl && (
            <div className="relative h-64 sm:h-80 w-full rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl group">
              <img 
                src={selectedPhotosData.coverUrl} 
                alt="Wedding Cover"
                style={{ objectPosition: activePositionStyle }}
                className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 ${activeTextAlign}`}>
                <span style={{ color: activeColor }} className="text-[10px] uppercase font-bold tracking-[0.25em] mb-1 block">
                  Approved Deliverables Package
                </span>
                <h2 style={{ fontFamily: activeFontFamily }} className="text-3xl sm:text-5xl text-white font-light leading-tight">
                  {selectedPhotosData.groomName && selectedPhotosData.brideName ? (
                    <>
                      <span>{selectedPhotosData.groomName}</span>{" "}
                      <span style={{ color: activeColor }} className="italic font-serif">&amp;</span>{" "}
                      <span>{selectedPhotosData.brideName}</span>
                    </>
                  ) : (
                    selectedPhotosData.galleryName
                  )}
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-light mt-1.5">
                  {photos.length} selected photos ready for download and album layout. Tap any photo to view full size.
                </p>
              </div>
            </div>
          )}

          {/* Real-time Progress Bar */}
          {zippingState && (
            <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-2 max-w-2xl mx-auto shadow-xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-300 font-medium flex items-center gap-2">
                  <RefreshCw size={13} className="animate-spin text-[#b4975a]" /> {zippingState.status}
                </span>
                <span className="text-[#b4975a] font-mono font-bold">{zippingState.percent}%</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                <div 
                  className="bg-gradient-to-r from-[#b4975a] via-amber-400 to-amber-200 h-full rounded-full transition-all duration-300"
                  style={{ width: `${zippingState.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Selected Photos Grid */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
              {photos.map((photo, index) => (
                <div 
                  key={photo.id || index}
                  onClick={() => setActivePhoto(photo)}
                  className="group relative bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden aspect-[4/5] shadow-lg shadow-black/20 cursor-pointer"
                >
                  <img 
                    src={photo.url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy"
                    alt={`Selection ${index + 1}`}
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-zinc-300 border border-white/10">
                    #{index + 1}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-end justify-between p-4">
                    <span className="text-[10px] text-zinc-300 font-light">Photo {index + 1}</span>
                    <a 
                      href={photo.url} 
                      target="_blank" 
                      rel="noreferrer"
                      download={`selected_photo_${index + 1}.jpg`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 bg-zinc-950/80 hover:bg-[#b4975a] hover:text-zinc-950 border border-zinc-800 rounded-xl text-white transition-all cursor-pointer block"
                      title="Download Single HD Photo"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-zinc-800 rounded-3xl text-zinc-500 font-light text-sm">
              No photos have been favorited yet in this gallery.
            </div>
          )}
        </main>

        {/* SINGLE PHOTO SHOWCASE VIEW (LIGHTBOX WITH DEDICATED BACK TO GRID BUTTON) */}
        <AnimatePresence>
          {activePhoto && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between"
            >
              {/* Top Navigation Bar with Dedicated 'Back to Grid' Button */}
              <div className="p-4 sm:px-8 flex justify-between items-center text-white z-20 w-full bg-gradient-to-b from-black/90 to-transparent border-b border-white/5">
                {/* ⊞ DEDICATED BACK TO GRID BUTTON */}
                <button 
                  onClick={() => setActivePhoto(null)}
                  className="px-4 py-2.5 bg-zinc-900/90 hover:bg-[#b4975a] hover:text-zinc-950 border border-zinc-700/80 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg group active:scale-95"
                  title="Return to Grid View"
                >
                  <LayoutGrid size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Back to Grid</span>
                </button>

                <span className="text-xs text-zinc-400 font-mono">
                  {displayedPhotos ? `${displayedPhotos.findIndex(p => p.id === activePhoto.id) + 1} / ${displayedPhotos.length}` : ""}
                </span>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <a 
                    href={activePhoto.url} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ borderColor: activeColor }}
                    className="px-3.5 py-2 bg-zinc-900/80 hover:brightness-110 border rounded-xl text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Download size={14} /> <span className="hidden sm:inline">Download HD</span>
                  </a>
                  
                  <button 
                    onClick={() => setActivePhoto(null)}
                    className="p-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
                    title="Close (Esc)"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Showcase Photo Main View */}
              <div className="relative flex-grow flex items-center justify-center p-2 sm:p-6 overflow-hidden">
                <button 
                  onClick={handlePrevPhoto}
                  title="Previous Photo (Left Arrow)"
                  className="absolute left-3 sm:left-6 z-30 p-3 sm:p-4 bg-zinc-950/80 hover:bg-[#b4975a] hover:text-zinc-950 text-white border border-zinc-700/60 rounded-full shadow-2xl cursor-pointer transition-all flex items-center justify-center backdrop-blur-md group"
                >
                  <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <motion.img 
                  key={activePhoto.id || activePhoto.url}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  src={activePhoto.url} 
                  className="max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] object-contain rounded-2xl border border-zinc-800/80 shadow-2xl select-none z-10"
                  alt="Fullscreen Showcase"
                />

                <button 
                  onClick={handleNextPhoto}
                  title="Next Photo (Right Arrow)"
                  className="absolute right-3 sm:right-6 z-30 p-3 sm:p-4 bg-zinc-950/80 hover:bg-[#b4975a] hover:text-zinc-950 text-white border border-zinc-700/60 rounded-full shadow-2xl cursor-pointer transition-all flex items-center justify-center backdrop-blur-md group"
                >
                  <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Bottom Filmstrip Thumbnails */}
              <div className="p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent border-t border-white/5 flex flex-col items-center gap-2 z-20">
                <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-4 no-scrollbar">
                  {displayedPhotos.map((p, pIdx) => (
                    <button
                      key={p.id || pIdx}
                      onClick={() => setActivePhoto(p)}
                      className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        p.id === activePhoto.id
                          ? "border-[#b4975a] scale-110 ring-2 ring-[#b4975a]/50 opacity-100"
                          : "border-zinc-800 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={p.url} alt={`Thumb ${pIdx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500 font-light">
                  Use Left / Right arrow keys or tap thumbnails. Click <strong>Back to Grid</strong> to return.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            className="absolute inset-0 bg-cover scale-105 filter blur-[4px] brightness-40 opacity-50 transition-all duration-1000"
            style={{ 
              backgroundImage: `url(${meta?.coverUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200"})`,
              backgroundPosition: activePositionStyle
            }}
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
                  style={{ objectPosition: activePositionStyle }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90" 
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
              <div className="space-y-1">
                <h2 style={{ fontFamily: activeFontFamily }} className="text-3xl text-white font-light tracking-wide">
                  Private Wedding Gallery
                </h2>
                <p className="text-zinc-400 text-xs font-light">
                  Enter your personalized passcode to access your high-resolution wedding deliverables.
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Gallery Access Passcode
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="e.g. akash2026"
                    className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl px-4 py-3.5 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#b4975a] focus:ring-1 focus:ring-[#b4975a] transition-all font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-950/40 border border-red-800/50 p-3 rounded-xl flex items-center gap-2 text-red-300 text-xs text-left"
                >
                  <AlertCircle size={14} className="flex-shrink-0 text-red-400" />
                  <span>{error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={unlocking || !passcode.trim()}
                style={{
                  backgroundColor: activeColor,
                  color: "#09090b"
                }}
                className="w-full py-4 font-bold rounded-2xl text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                {unlocking ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Enter Private Gallery</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-zinc-850/80 text-[11px] text-zinc-500 font-light flex items-center justify-center gap-1.5">
              <span>Protected with 256-bit Dreamwed Client Security</span>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* 2. UNLOCKED GALLERY MAIN EXPERIENCE (GRID VIEW) */
        /* ========================================================= */
        <div className="min-h-screen flex flex-col">
          {/* Top Sticky Header */}
          <header className="border-b border-zinc-850/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                to="/"
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Return to Home"
              >
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

            <div className="flex items-center gap-2.5">
              {/* If user has favorites, show 1-click ZIP download button in header */}
              {selectedPhotoIds.size > 0 && (
                <button
                  disabled={zippingState?.isZipping}
                  onClick={() => {
                    const favs = allPhotos.filter(p => selectedPhotoIds.has(p.id));
                    handleDownloadZipPackage(favs);
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/30 transition-all"
                >
                  <Download size={13} className={zippingState?.isZipping ? "animate-bounce" : ""} />
                  {zippingState?.isZipping ? "Zipping..." : `Download ZIP (${selectedPhotoIds.size})`}
                </button>
              )}

              <button 
                onClick={handleShareGallery}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl border border-zinc-800 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Share2 size={12} /> Share
              </button>
            </div>
          </header>

          {/* Real-time ZIP Compression Progress Banner */}
          {zippingState && (
            <div className="bg-zinc-900/95 border-b border-zinc-800 px-6 py-3 sticky top-[65px] z-20 shadow-xl">
              <div className="max-w-xl mx-auto space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-200 font-medium flex items-center gap-2">
                    <RefreshCw size={12} className="animate-spin text-[#b4975a]" /> {zippingState.status}
                  </span>
                  <span className="text-[#b4975a] font-mono font-bold">{zippingState.percent}%</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div 
                    className="bg-gradient-to-r from-[#b4975a] to-amber-300 h-full rounded-full transition-all duration-300"
                    style={{ width: `${zippingState.percent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

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
                Tap on any photo to open full showcase view. Click the ❤️ heart button to favorite photos for your wedding album.
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
                      className="group relative bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden cursor-pointer aspect-[4/5] shadow-lg shadow-black/20 hover:border-[#b4975a]/50 transition-all duration-300"
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

      {/* ========================================================= */}
      {/* 3. SINGLE PHOTO SHOWCASE VIEW (WITH DEDICATED BACK TO GRID BUTTON) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between"
          >
            {/* Top Navigation Bar with Dedicated 'Back to Grid' Button */}
            <div className="p-4 sm:px-8 flex justify-between items-center text-white z-20 w-full bg-gradient-to-b from-black/90 to-transparent border-b border-white/5">
              {/* ⊞ DEDICATED BACK TO GRID BUTTON */}
              <button 
                onClick={() => setActivePhoto(null)}
                className="px-4 py-2.5 bg-zinc-900/90 hover:bg-[#b4975a] hover:text-zinc-950 border border-zinc-700/80 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg group active:scale-95"
                title="Return to Grid View"
              >
                <LayoutGrid size={16} className="group-hover:scale-110 transition-transform" />
                <span>Back to Grid</span>
              </button>

              <span className="text-xs text-zinc-400 font-mono">
                {displayedPhotos ? `${displayedPhotos.findIndex(p => p.id === activePhoto.id) + 1} / ${displayedPhotos.length}` : ""}
              </span>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Heart Button in Showcase View */}
                <button
                  onClick={(e) => toggleHeartPhoto(activePhoto.id, e)}
                  className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
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
                  className="px-3.5 py-2 bg-zinc-900/80 hover:brightness-110 border rounded-xl text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Download size={14} /> <span className="hidden sm:inline">Download HD</span>
                </a>
                
                <button 
                  onClick={() => setActivePhoto(null)}
                  className="p-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Showcase Main Photo Container */}
            <div className="relative flex-grow flex items-center justify-center p-2 sm:p-6 overflow-hidden">
              {/* Prev Button */}
              <button 
                onClick={handlePrevPhoto}
                title="Previous Photo (Left Arrow)"
                className="absolute left-3 sm:left-6 z-30 p-3 sm:p-4 bg-zinc-950/80 hover:bg-[#b4975a] hover:text-zinc-950 text-white border border-zinc-700/60 rounded-full shadow-2xl cursor-pointer transition-all flex items-center justify-center backdrop-blur-md group"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Photo with smooth transition */}
              <motion.img 
                key={activePhoto.id || activePhoto.url}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                src={activePhoto.url} 
                className="max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] object-contain rounded-2xl border border-zinc-800/80 shadow-2xl select-none z-10"
                alt="Fullscreen Showcase"
              />

              {/* Next Button */}
              <button 
                onClick={handleNextPhoto}
                title="Next Photo (Right Arrow)"
                className="absolute right-3 sm:right-6 z-30 p-3 sm:p-4 bg-zinc-950/80 hover:bg-[#b4975a] hover:text-zinc-950 text-white border border-zinc-700/60 rounded-full shadow-2xl cursor-pointer transition-all flex items-center justify-center backdrop-blur-md group"
              >
                <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Bottom Filmstrip Thumbnails Navigation */}
            <div className="p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent border-t border-white/5 flex flex-col items-center gap-2 z-20">
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-4 no-scrollbar">
                {displayedPhotos.map((p, pIdx) => (
                  <button
                    key={p.id || pIdx}
                    onClick={() => setActivePhoto(p)}
                    className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      p.id === activePhoto.id
                        ? "border-[#b4975a] scale-110 ring-2 ring-[#b4975a]/50 opacity-100"
                        : "border-zinc-800 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={p.url} alt={`Thumb ${pIdx + 1}`} className="w-full h-full object-cover" />
                    {selectedPhotoIds.has(p.id) && (
                      <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-white" />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-zinc-500 font-light">
                Use Left / Right arrow keys or tap thumbnails. Click <strong>Back to Grid</strong> to return.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientGallery;
