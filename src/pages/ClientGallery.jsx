import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Download, 
  Share2, X, ChevronLeft, ChevronRight, RefreshCw, ZoomIn,
  Heart, Check, Sparkles, Filter, Search, Camera, Copy,
  LayoutGrid, Grid, User, Users, Mail, UserCheck, ShieldCheck,
  ChevronDown, Layers, Play, Calendar, MapPin, Film
} from "lucide-react";
import SEO from "../components/SEO";
import { downloadPhotosAsZip } from "../utils/zipDownloader";
import { curateWeddingStory } from "../utils/aiCurator";

const FONT_MAP = {
  cormorant: "'Cormorant Garamond', serif",
  playfair: "'Playfair Display', serif",
  cinzel: "'Cinzel', serif",
  greatvibes: "'Great Vibes', cursive",
  alexbrush: "'Alex Brush', cursive",
  inter: "'Inter', sans-serif"
};

const USER_ROLES = [
  { id: "Bride", label: "Bride", icon: "👰", color: "#e0a899" },
  { id: "Groom", label: "Groom", icon: "🤵", color: "#38bdf8" },
  { id: "BrideFamily", label: "Bride's Family", icon: "👨‍👩‍👧", color: "#f472b6" },
  { id: "GroomFamily", label: "Groom's Family", icon: "👨‍👩‍👦", color: "#60a5fa" },
  { id: "Guest", label: "Friend / Guest", icon: "✨", color: "#b4975a" }
];

const getObjectPositionStyle = (val) => {
  if (val === "top" || val === 0 || val === "0") return "center 0%";
  if (val === "bottom" || val === 100 || val === "100") return "center 100%";
  if (val === "center" || val === 50 || val === "50" || !val) return "center 50%";
  const num = Number(String(val).replace("%", ""));
  if (!isNaN(num)) return `center ${num}%`;
  return "center 50%";
};

const ClientGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isDirectDownloadMode = searchParams.get("download") === "favorites" || 
                               searchParams.get("download") === "selections" || 
                               searchParams.get("mode") === "favorites";

  // Viewer profile & session
  const [viewerName, setViewerName] = useState(() => localStorage.getItem("dreamwed_viewer_name") || "");
  const [viewerEmail, setViewerEmail] = useState(() => localStorage.getItem("dreamwed_viewer_email") || "");
  const [viewerRole, setViewerRole] = useState(() => localStorage.getItem("dreamwed_viewer_role") || "Bride");
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`dreamwed_viewer_user_${id}`) || "null");
    } catch (e) {
      return null;
    }
  });

  const [isLocked, setIsLocked] = useState(!isDirectDownloadMode && !currentUser);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  
  // Gallery states
  const [meta, setMeta] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [storyData, setStoryData] = useState(null);
  const [selectedPhotosData, setSelectedPhotosData] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState(new Set());
  const [selectionsDetail, setSelectionsDetail] = useState([]);
  const [filterMode, setFilterMode] = useState("all");
  const [saveStatus, setSaveStatus] = useState("");
  const [zippingState, setZippingState] = useState(null);
  const [activeSectionView, setActiveSectionView] = useState("story"); // 'story' | 'archive' | 'highlights'
  const syncTimeoutRef = useRef(null);
  const storyRef = useRef(null);

  const API_BASE = typeof window !== "undefined"
    ? (localStorage.getItem("dreamwed_api_base") || import.meta.env.VITE_API_BASE_URL || "https://dreamwed-backend.onrender.com")
    : "https://dreamwed-backend.onrender.com";

  // 1. Fetch gallery info on mount
  useEffect(() => {
    let isMounted = true;
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchGallery = async () => {
      setLoading(true);
      setError("");

      // Check local storage first
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
          setSelectedPhotoIds(new Set(localMatch.selectedPhotoIds || []));
          setSelectionsDetail(localMatch.selectionsDetail || []);
          
          // Generate or load AI story data
          if (localMatch.storyData) {
            setStoryData(localMatch.storyData);
          } else if (localMatch.photos && localMatch.photos.length > 0) {
            const curated = curateWeddingStory({
              photos: localMatch.photos,
              groomName: localMatch.groomName,
              brideName: localMatch.brideName,
              galleryName: localMatch.name
            });
            setStoryData(curated);
          }
          setLoading(false);
        }
      } catch (e) {}

      // Direct download link mode
      if (isDirectDownloadMode) {
        try {
          const res = await fetch(`${API_BASE}/api/public/galleries/${id}/selected-photos`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setSelectedPhotosData(data);
              setMeta(data);
              setLoading(false);
            }
          }
        } catch (e) {}
        return;
      }

      // Fetch from API
      try {
        const res = await fetch(`${API_BASE}/api/public/galleries/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setMeta(data);
            setGallery(data);
            setSelectedPhotoIds(new Set(data.selectedPhotoIds || []));
            setSelectionsDetail(data.selectionsDetail || []);
            
            if (data.storyData) {
              setStoryData(data.storyData);
            } else if (data.photos && data.photos.length > 0) {
              const curated = curateWeddingStory({
                photos: data.photos,
                groomName: data.groomName,
                brideName: data.brideName,
                galleryName: data.name
              });
              setStoryData(curated);
            }
            setLoading(false);
          }
        }
      } catch (err) {
        if (isMounted && !hadLocal) setError(err.message || "Failed to load gallery.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGallery();
    return () => { isMounted = false; };
  }, [id, API_BASE, isDirectDownloadMode]);

  // 2. Handle unlock with multi-tier passcode
  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    const cleanCode = passcode.trim();
    const cleanName = viewerName.trim();

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }
    if (!cleanCode) {
      setError("Please enter the gallery access passcode.");
      return;
    }

    setUnlocking(true);
    setError("");

    // Infer role from code prefix if applicable
    let targetRole = viewerRole;
    const lowerCode = cleanCode.toLowerCase();
    if (lowerCode.includes("bride")) targetRole = "Bride";
    else if (lowerCode.includes("groom")) targetRole = "Groom";
    else if (lowerCode.includes("guest")) targetRole = "Guest";

    const activeUserProfile = {
      name: cleanName,
      email: viewerEmail.trim(),
      role: targetRole
    };

    localStorage.setItem("dreamwed_viewer_name", cleanName);
    localStorage.setItem("dreamwed_viewer_email", viewerEmail.trim());
    localStorage.setItem("dreamwed_viewer_role", targetRole);
    if (id) localStorage.setItem(`dreamwed_viewer_user_${id}`, JSON.stringify(activeUserProfile));

    // Local check
    try {
      const localGals = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
      const localMatch = localGals.find(g => 
        (g.id === id || !id) && 
        (String(g.accessCode).trim().toLowerCase() === lowerCode ||
         String(g.brideCode || "").trim().toLowerCase() === lowerCode ||
         String(g.groomCode || "").trim().toLowerCase() === lowerCode ||
         String(g.guestCode || "").trim().toLowerCase() === lowerCode ||
         String(g.id).toLowerCase() === lowerCode)
      );

      if (localMatch) {
        setGallery(localMatch);
        setMeta(localMatch);
        setSelectedPhotoIds(new Set(localMatch.selectedPhotoIds || []));
        setSelectionsDetail(localMatch.selectionsDetail || []);
        
        if (localMatch.storyData) {
          setStoryData(localMatch.storyData);
        } else if (localMatch.photos && localMatch.photos.length > 0) {
          const curated = curateWeddingStory({
            photos: localMatch.photos,
            groomName: localMatch.groomName,
            brideName: localMatch.brideName,
            galleryName: localMatch.name
          });
          setStoryData(curated);
        }

        setCurrentUser(activeUserProfile);
        setIsLocked(false);
        setUnlocking(false);
        if (!id) navigate(`/gallery/${localMatch.id}`, { replace: true });
        return;
      }
    } catch (e) {}

    // Backend unlock
    try {
      const targetId = id || cleanCode;
      const res = await fetch(`${API_BASE}/api/public/galleries/${targetId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          accessCode: cleanCode,
          user: activeUserProfile
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Incorrect access passcode.");
      }

      const galData = await res.json();
      setGallery(galData);
      setMeta(galData);
      setSelectedPhotoIds(new Set(galData.selectedPhotoIds || []));
      setSelectionsDetail(galData.selectionsDetail || []);
      
      if (galData.storyData) {
        setStoryData(galData.storyData);
      } else if (galData.photos && galData.photos.length > 0) {
        const curated = curateWeddingStory({
          photos: galData.photos,
          groomName: galData.groomName,
          brideName: galData.brideName,
          galleryName: galData.name
        });
        setStoryData(curated);
      }

      const finalUser = {
        ...activeUserProfile,
        role: galData.viewerRole || targetRole
      };
      setCurrentUser(finalUser);
      setIsLocked(false);
      if (!id) navigate(`/gallery/${galData.id}`, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to unlock gallery.");
    } finally {
      setUnlocking(false);
    }
  };

  const handleSwitchPerson = () => {
    if (id) localStorage.removeItem(`dreamwed_viewer_user_${id}`);
    setCurrentUser(null);
    setIsLocked(true);
    setPasscode("");
  };

  // 3. Selection sync
  const syncSelectionsToBackend = (newIdsSet, newDetailList) => {
    setSaveStatus("saving");
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(async () => {
      const selectedArray = Array.from(newIdsSet);
      
      try {
        const localGals = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
        const updated = localGals.map(g => {
          if (g.id === gallery?.id || g.id === id) {
            return { 
              ...g, 
              selectedPhotoIds: selectedArray,
              selectionsDetail: newDetailList
            };
          }
          return g;
        });
        localStorage.setItem("dreamwed_galleries", JSON.stringify(updated));
      } catch (e) {}

      try {
        const targetId = gallery?.id || id;
        if (targetId) {
          await fetch(`${API_BASE}/api/public/galleries/${targetId}/selections`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              selectedPhotoIds: selectedArray,
              selectionsDetail: newDetailList
            })
          });
        }
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (e) {
        setSaveStatus("");
      }
    }, 600);
  };

  const toggleHeartPhoto = (photoId, e) => {
    if (e) e.stopPropagation();
    const user = currentUser || { name: viewerName || "Guest", email: viewerEmail || "", role: viewerRole || "Guest" };

    const alreadyLikedByMe = selectionsDetail.some(s => 
      s.photoId === photoId && 
      (s.user?.name?.toLowerCase() === user.name?.toLowerCase() || (s.user?.email && s.user?.email === user.email))
    );

    let nextDetail = [];
    if (alreadyLikedByMe) {
      nextDetail = selectionsDetail.filter(s => 
        !(s.photoId === photoId && (s.user?.name?.toLowerCase() === user.name?.toLowerCase() || (s.user?.email && s.user?.email === user.email)))
      );
    } else {
      nextDetail = [
        ...selectionsDetail,
        { photoId, user, timestamp: new Date().toISOString() }
      ];
    }

    setSelectionsDetail(nextDetail);
    const nextIdsSet = new Set(nextDetail.map(s => s.photoId));
    setSelectedPhotoIds(nextIdsSet);
    syncSelectionsToBackend(nextIdsSet, nextDetail);
  };

  const getUsersForPhoto = (photoId) => {
    return selectionsDetail.filter(s => s.photoId === photoId).map(s => s.user).filter(Boolean);
  };

  const isLikedByMe = (photoId) => {
    if (!currentUser) return selectedPhotoIds.has(photoId);
    return selectionsDetail.some(s => 
      s.photoId === photoId && 
      (s.user?.name?.toLowerCase() === currentUser.name?.toLowerCase() || (s.user?.email && s.user?.email === currentUser.email))
    );
  };

  // 1-Click ZIP Downloader
  const handleDownloadZipPackage = async (photosToDownload, zipPrefix = "") => {
    if (!photosToDownload || photosToDownload.length === 0) {
      alert("No photos to download.");
      return;
    }

    try {
      setZippingState({ isZipping: true, percent: 5, status: `Packaging ${photosToDownload.length} photos into ZIP...` });
      await downloadPhotosAsZip({
        photos: photosToDownload,
        galleryName: (meta?.name || gallery?.name || "Dreamwed_Wedding") + (zipPrefix ? `_${zipPrefix}` : ""),
        groomName: meta?.groomName || gallery?.groomName || "",
        brideName: meta?.brideName || gallery?.brideName || "",
        apiBase: API_BASE,
        onProgress: (p) => setZippingState({ isZipping: true, percent: p.percent, status: p.status })
      });
      setZippingState({ isZipping: false, percent: 100, status: "✅ ZIP Downloaded Successfully!" });
      setTimeout(() => setZippingState(null), 3500);
    } catch (err) {
      alert("Failed to create ZIP: " + err.message);
      setZippingState(null);
    }
  };

  // Active theme styling
  const activeColor = (isLocked ? meta?.coverColor : (gallery?.coverColor || meta?.coverColor)) || "#b4975a";
  const activeFontKey = (isLocked ? meta?.coverFont : (gallery?.coverFont || meta?.coverFont)) || "cormorant";
  const activeFontFamily = FONT_MAP[activeFontKey] || FONT_MAP.cormorant;
  const rawAlign = (isLocked ? meta?.coverAlign : (gallery?.coverAlign || meta?.coverAlign)) ?? "50%";
  const activePositionStyle = getObjectPositionStyle(rawAlign);

  const allPhotos = gallery?.photos || meta?.photos || [];
  const heroImage = storyData?.heroImage || meta?.coverUrl || (allPhotos[0]?.url) || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600";
  const highlights = storyData?.highlights || allPhotos.slice(0, 16);
  const chapters = storyData?.chapters || [];

  const myPicks = allPhotos.filter(p => isLikedByMe(p.id));
  const bridePicks = allPhotos.filter(p => selectionsDetail.some(s => s.photoId === p.id && s.user?.role === "Bride"));
  const groomPicks = allPhotos.filter(p => selectionsDetail.some(s => s.photoId === p.id && s.user?.role === "Groom"));

  let displayedPhotos = allPhotos;
  if (filterMode === "my") displayedPhotos = myPicks;
  else if (filterMode === "all-favorites") displayedPhotos = allPhotos.filter(p => selectedPhotoIds.has(p.id));
  else if (filterMode === "Bride") displayedPhotos = bridePicks;
  else if (filterMode === "Groom") displayedPhotos = groomPicks;
  else if (filterMode === "highlights") displayedPhotos = highlights;

  // Single Photo Showcase Navigation
  const handlePrevPhoto = (e) => {
    if (e) e.stopPropagation();
    if (!displayedPhotos || displayedPhotos.length === 0 || !activePhoto) return;
    const currentIndex = displayedPhotos.findIndex(p => p.id === activePhoto.id);
    if (currentIndex > 0) setActivePhoto(displayedPhotos[currentIndex - 1]);
    else setActivePhoto(displayedPhotos[displayedPhotos.length - 1]);
  };

  const handleNextPhoto = (e) => {
    if (e) e.stopPropagation();
    if (!displayedPhotos || displayedPhotos.length === 0 || !activePhoto) return;
    const currentIndex = displayedPhotos.findIndex(p => p.id === activePhoto.id);
    if (currentIndex < displayedPhotos.length - 1) setActivePhoto(displayedPhotos[currentIndex + 1]);
    else setActivePhoto(displayedPhotos[0]);
  };

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

  const scrollToStory = () => {
    if (storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShareGallery = () => {
    if (navigator.share) {
      navigator.share({
        title: `${meta?.name || "Dreamwed"} Wedding Gallery`,
        text: `Experience the private wedding story of ${meta?.name || "Dreamwed Stories"}.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("📋 Gallery link copied to clipboard!\nShare this with family & friends to explore the cinematic story.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-light p-6">
        <RefreshCw size={36} className="animate-spin text-[#b4975a] mb-4" />
        <p className="text-zinc-400 text-xs tracking-widest uppercase font-mono">Curating Cinematic Wedding Story...</p>
      </div>
    );
  }

  // =========================================================
  // 1. LOCK SCREEN / GUEST, BRIDE & GROOM MULTI-TIER LOGIN
  // =========================================================
  if (isLocked) {
    return (
      <div className="relative min-h-screen bg-zinc-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#b4975a] selection:text-black">
        <SEO 
          title={`${meta?.name || "Private"} Gallery | Dreamwed Stories`}
          description="View private cinematic wedding deliverables curated by Dreamwed Stories."
        />

        {/* Cinematic Backdrop */}
        <div 
          className="absolute inset-0 bg-cover scale-105 filter blur-[6px] brightness-30 opacity-60 transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: activePositionStyle
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-zinc-950/85" />

        {/* Lock Modal */}
        <div className="relative w-full max-w-lg bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/80 p-6 sm:p-9 rounded-[36px] shadow-[0_20px_70px_rgba(0,0,0,0.85)] text-center space-y-5 z-10">
          <div className="flex flex-col items-center space-y-2">
            <img 
              src="/appIcon.png" 
              alt="Dreamwed Stories" 
              className="w-14 h-14 object-contain filter drop-shadow-[0_4px_20px_rgba(255,255,255,0.25)]" 
            />
            <span style={{ color: activeColor }} className="uppercase font-bold tracking-[0.3em] text-[9px] block">
              Dreamwed Stories &bull; Cinematic Gallery
            </span>
          </div>

          {/* Couple Cover Banner */}
          <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-zinc-800/80 shadow-inner group">
            <img 
              src={heroImage} 
              alt="Wedding Hero" 
              style={{ objectPosition: activePositionStyle }}
              className="w-full h-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-5 text-center items-center">
              <span style={{ color: activeColor }} className="text-[8px] uppercase font-bold tracking-[0.25em] mb-1 block">
                Private Wedding Experience
              </span>
              <h2 style={{ fontFamily: activeFontFamily }} className="text-2xl sm:text-3xl text-white font-light leading-tight">
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
              {meta?.weddingDate && (
                <span className="text-zinc-400 text-[10px] tracking-wider mt-1">
                  {meta.weddingDate}
                </span>
              )}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleUnlock} className="space-y-3.5 text-left">
            {/* Role quick selector */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider flex items-center justify-between">
                <span>Who is viewing?</span>
                <span className="text-[#b4975a] font-normal">Select your relationship</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {USER_ROLES.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setViewerRole(r.id)}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      viewerRole === r.id
                        ? "bg-[#b4975a] text-zinc-950 font-bold border-[#b4975a] shadow-md scale-102"
                        : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
                    }`}
                  >
                    <span className="text-sm">{r.icon}</span>
                    <span className="text-[8px] leading-tight truncate w-full">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name input */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">
                Your Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={viewerName}
                  onChange={(e) => { setViewerName(e.target.value); if (error) setError(""); }}
                  placeholder="e.g. Parvathi (Bride) or Akash (Groom)"
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#b4975a]"
                  required
                />
                <User size={14} className="absolute right-3.5 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Passcode input */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">
                Passcode (Bride / Groom / Guest Code) <span className="text-red-400">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); if (error) setError(""); }}
                  placeholder="e.g. BRIDE-2026 or akash2026"
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#b4975a] font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/40 border border-red-800/50 p-2.5 rounded-xl flex items-center gap-2 text-red-300 text-xs"
              >
                <AlertCircle size={13} className="flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={unlocking || !passcode.trim() || !viewerName.trim()}
              style={{ backgroundColor: activeColor, color: "#09090b" }}
              className="w-full py-3.5 font-bold rounded-xl text-xs uppercase tracking-[0.18em] transition-all duration-300 disabled:opacity-50 hover:brightness-110 shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {unlocking ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Unlocking Cinematic Gallery...</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Enter Wedding Story</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================
  // 2. MAIN CINEMATIC CLIENT EXPERIENCE
  // =========================================================
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-[#b4975a] selection:text-black">
      <SEO 
        title={`${gallery?.groomName && gallery?.brideName ? `${gallery.groomName} & ${gallery.brideName}` : (gallery?.name || "Wedding")} | Dreamwed Stories`}
        description="A cinematic wedding photography journey curated by Dreamwed Stories."
      />

      {/* Sticky Top Luxury Header */}
      <header className="border-b border-zinc-850/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link 
            to="/"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0"
            title="Home"
          >
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 
              style={{ fontFamily: activeFontFamily }} 
              className="text-lg sm:text-xl text-white font-medium leading-none truncate max-w-[180px] sm:max-w-md"
            >
              {gallery?.groomName && gallery?.brideName 
                ? `${gallery.groomName} & ${gallery.brideName}` 
                : (gallery?.name || "Wedding Gallery")}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ color: activeColor }} className="text-[9px] font-bold uppercase tracking-wider">
                Dreamwed Stories
              </span>
              {currentUser && (
                <span className="text-[9px] bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-800 flex items-center gap-1">
                  <span>{USER_ROLES.find(r => r.id === currentUser.role)?.icon || "👤"}</span>
                  <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Switcher Tabs & Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => { setActiveSectionView("story"); scrollToStory(); }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                activeSectionView === "story" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Cinematic Story
            </button>
            <button
              onClick={() => setActiveSectionView("highlights")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                activeSectionView === "highlights" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Highlights ({highlights.length})
            </button>
            <button
              onClick={() => setActiveSectionView("archive")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                activeSectionView === "archive" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Full Archive ({allPhotos.length})
            </button>
          </div>

          {selectedPhotoIds.size > 0 && (
            <button
              disabled={zippingState?.isZipping}
              onClick={() => {
                const favs = allPhotos.filter(p => selectedPhotoIds.has(p.id));
                handleDownloadZipPackage(favs, "Selected_Photos");
              }}
              className="px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/30 transition-all shrink-0"
            >
              <Download size={13} className={zippingState?.isZipping ? "animate-bounce" : ""} />
              <span className="hidden sm:inline">ZIP</span> ({selectedPhotoIds.size})
            </button>
          )}

          <button 
            onClick={handleShareGallery}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl border border-zinc-800 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Share gallery link"
          >
            <Share2 size={12} /> <span className="hidden sm:inline">Invite</span>
          </button>

          <button
            onClick={handleSwitchPerson}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 text-[10px] transition-all cursor-pointer shrink-0"
            title="Switch User / Log Out"
          >
            <User size={13} />
          </button>
        </div>
      </header>

      {/* Real-time ZIP Compression Progress Bar */}
      {zippingState && (
        <div className="bg-zinc-900/95 border-b border-zinc-800 px-6 py-3 sticky top-[57px] z-30 shadow-xl">
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

      {/* ========================================================= */}
      {/* 2.1. CINEMATIC HERO OPENING */}
      {/* ========================================================= */}
      <section className="relative h-[92vh] sm:h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Full-bleed hero image with slow zoom effect */}
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center brightness-75"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: activePositionStyle
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/60" />

        {/* Luxury Typography Overlay */}
        <div className="relative z-10 text-center max-w-4xl px-6 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ color: activeColor }}
            className="uppercase font-bold tracking-[0.35em] text-[10px] sm:text-xs block"
          >
            The Wedding Journey
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: activeFontFamily }} 
            className="text-4xl sm:text-7xl md:text-8xl text-white font-light tracking-wide leading-tight"
          >
            {gallery?.groomName && gallery?.brideName ? (
              <>
                <span>{gallery.groomName}</span>{" "}
                <span style={{ color: activeColor }} className="italic font-serif">&amp;</span>{" "}
                <span>{gallery.brideName}</span>
              </>
            ) : (
              gallery?.name || "Dreamwed Stories"
            )}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 text-xs text-zinc-300 font-light"
          >
            {gallery?.weddingDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} style={{ color: activeColor }} />
                {gallery.weddingDate}
              </span>
            )}
            {gallery?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={13} style={{ color: activeColor }} />
                {gallery.location}
              </span>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-8"
          >
            <button
              onClick={scrollToStory}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-zinc-950 border border-white/25 backdrop-blur-md transition-all text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2.5 mx-auto cursor-pointer group shadow-2xl"
            >
              <span>Explore The Story</span>
              <ChevronDown size={15} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2.2. BEST MOMENTS (EDITORIAL HIGHLIGHTS) */}
      {/* ========================================================= */}
      <div ref={storyRef} className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span style={{ color: activeColor }} className="text-[10px] uppercase font-bold tracking-[0.3em]">
            Editorial Highlights
          </span>
          <h2 style={{ fontFamily: activeFontFamily }} className="text-3xl sm:text-5xl text-white font-light">
            Best <span style={{ color: activeColor }} className="italic font-serif">Moments</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
            A curated selection of the most meaningful, emotionally resonant frames from the entire celebration.
          </p>
          <div style={{ backgroundColor: `${activeColor}80` }} className="w-12 h-[1px] mx-auto mt-4" />
        </div>

        {/* Asymmetric Highlights Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {highlights.slice(0, 7).map((photo, idx) => {
            const isLiked = isLikedByMe(photo.id);
            // Dynamic asymmetric column spans for editorial rhythm
            let colSpan = "md:col-span-4";
            let aspect = "aspect-[4/5]";
            if (idx === 0) { colSpan = "md:col-span-8"; aspect = "aspect-[16/10]"; }
            else if (idx === 1) { colSpan = "md:col-span-4"; aspect = "aspect-[4/5]"; }
            else if (idx === 2 || idx === 3 || idx === 4) { colSpan = "md:col-span-4"; aspect = "aspect-[4/5]"; }
            else if (idx === 5) { colSpan = "md:col-span-6"; aspect = "aspect-[16/11]"; }
            else if (idx === 6) { colSpan = "md:col-span-6"; aspect = "aspect-[16/11]"; }

            return (
              <div 
                key={photo.id || idx}
                onClick={() => setActivePhoto(photo)}
                className={`group relative rounded-[28px] overflow-hidden bg-zinc-900 border border-zinc-800/80 cursor-pointer shadow-2xl transition-all duration-500 hover:border-[#b4975a]/60 ${colSpan} ${aspect}`}
              >
                <img 
                  src={photo.url} 
                  alt={`Highlight ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Heart Selection Button */}
                <button
                  onClick={(e) => toggleHeartPhoto(photo.id, e)}
                  title={isLiked ? "Remove from my picks" : `Select as ${currentUser?.name || "Member"}`}
                  className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 z-30 cursor-pointer shadow-xl ${
                    isLiked 
                      ? "bg-red-500 text-white scale-110 shadow-red-500/50" 
                      : "bg-black/60 backdrop-blur-md text-white/80 hover:text-red-400 hover:scale-110 border border-white/10"
                  }`}
                >
                  <Heart size={15} className={isLiked ? "fill-white text-white" : "text-white"} />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-end justify-between p-5 pointer-events-none">
                  <span className="text-xs text-zinc-300 font-light">Highlight #{idx + 1}</span>
                  <a 
                    href={photo.url} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-zinc-950/90 text-white hover:bg-[#b4975a] hover:text-zinc-950 rounded-xl transition-all pointer-events-auto"
                    title="Download HD"
                  >
                    <Download size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 2.3. CINEMATIC STORY CHAPTERS */}
        {/* ========================================================= */}
        {chapters.length > 0 && (
          <div className="space-y-24 pt-10">
            {chapters.map((chapter, cIdx) => (
              <div key={chapter.id || cIdx} className="space-y-8">
                {/* Chapter Heading & Narrative Quote */}
                <div className="border-l-2 border-[#b4975a] pl-5 space-y-1.5 max-w-2xl">
                  <span style={{ color: activeColor }} className="text-[10px] uppercase font-bold tracking-[0.25em] block">
                    Chapter 0{cIdx + 1} &bull; {chapter.subtitle}
                  </span>
                  <h3 style={{ fontFamily: activeFontFamily }} className="text-2xl sm:text-4xl text-white font-light">
                    {chapter.title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm font-light italic leading-relaxed pt-1">
                    "{chapter.description}"
                  </p>
                </div>

                {/* Chapter Photo Layout (Asymmetric Pairs / Triptychs / Masonry) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {chapter.photos.map((photo, pIdx) => {
                    const isLiked = isLikedByMe(photo.id);
                    return (
                      <div 
                        key={photo.id || pIdx}
                        onClick={() => setActivePhoto(photo)}
                        className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 aspect-[4/5] cursor-pointer shadow-xl hover:border-[#b4975a]/50 transition-all duration-300"
                      >
                        <img 
                          src={photo.url} 
                          alt={`Chapter ${cIdx + 1} - Photo ${pIdx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Heart Button */}
                        <button
                          onClick={(e) => toggleHeartPhoto(photo.id, e)}
                          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-30 cursor-pointer shadow-xl ${
                            isLiked 
                              ? "bg-red-500 text-white scale-110 shadow-red-500/50" 
                              : "bg-black/60 backdrop-blur-md text-white/80 hover:text-red-400 border border-white/10"
                          }`}
                        >
                          <Heart size={14} className={isLiked ? "fill-white text-white" : "text-white"} />
                        </button>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
                          <span className="text-[10px] text-zinc-300 font-mono">0{cIdx + 1}.{pIdx + 1}</span>
                          <a 
                            href={photo.url} 
                            target="_blank" 
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-zinc-950/90 text-white hover:bg-[#b4975a] hover:text-zinc-950 rounded-xl transition-all pointer-events-auto"
                            title="Download HD"
                          >
                            <Download size={13} />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2.4. FULL WEDDING ARCHIVE WITH ROLE FILTERS */}
        {/* ========================================================= */}
        <div className="space-y-8 pt-12 border-t border-zinc-850">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span style={{ color: activeColor }} className="text-[10px] uppercase font-bold tracking-[0.25em]">
              Complete Collection
            </span>
            <h3 style={{ fontFamily: activeFontFamily }} className="text-3xl sm:text-4xl text-white font-light">
              Explore The Full <span style={{ color: activeColor }} className="italic font-serif">Archive</span>
            </h3>
            <p className="text-zinc-400 text-xs font-light">
              Filter by favorites or explore all {allPhotos.length} high-resolution photographs.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterMode === "all" ? "bg-white text-black shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              All Archive ({allPhotos.length})
            </button>

            <button
              onClick={() => setFilterMode("my")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMode === "my" ? "bg-red-500 text-white shadow-md shadow-red-500/30" : "bg-zinc-900 text-zinc-400 hover:text-red-400 border border-zinc-800"
              }`}
            >
              <Heart size={12} className={myPicks.length > 0 ? "fill-current" : ""} />
              My Picks ({myPicks.length})
            </button>

            <button
              onClick={() => setFilterMode("all-favorites")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMode === "all-favorites" ? "bg-[#b4975a] text-zinc-950 shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-[#b4975a] border border-zinc-800"
              }`}
            >
              <Users size={12} />
              Group Picks ({selectedPhotoIds.size})
            </button>

            {bridePicks.length > 0 && (
              <button
                onClick={() => setFilterMode("Bride")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filterMode === "Bride" ? "bg-pink-600 text-white shadow-md" : "bg-zinc-900 text-pink-300 hover:text-white border border-pink-900/40"
                }`}
              >
                <span>👰 Bride ({bridePicks.length})</span>
              </button>
            )}

            {groomPicks.length > 0 && (
              <button
                onClick={() => setFilterMode("Groom")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filterMode === "Groom" ? "bg-sky-600 text-white shadow-md" : "bg-zinc-900 text-sky-300 hover:text-white border border-sky-900/40"
                }`}
              >
                <span>🤵 Groom ({groomPicks.length})</span>
              </button>
            )}
          </div>

          {/* Archive Grid */}
          {displayedPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayedPhotos.map((photo, index) => {
                const usersWhoLiked = getUsersForPhoto(photo.id);
                const likedByMe = isLikedByMe(photo.id);

                return (
                  <div 
                    key={photo.id || index}
                    className={`group relative bg-zinc-900 border rounded-2xl overflow-hidden cursor-pointer aspect-[4/5] shadow-lg transition-all duration-300 ${
                      likedByMe ? "border-red-500/60 ring-1 ring-red-500/30" : "border-zinc-800/80 hover:border-[#b4975a]/50"
                    }`}
                    onClick={() => setActivePhoto(photo)}
                  >
                    <img 
                      src={photo.url} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      loading="lazy"
                      alt={`Archive photo ${index + 1}`}
                    />

                    {/* ❤️ Heart Favorite Button */}
                    <button
                      onClick={(e) => toggleHeartPhoto(photo.id, e)}
                      className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-30 cursor-pointer shadow-xl ${
                        likedByMe 
                          ? "bg-red-500 text-white scale-110 shadow-red-500/50" 
                          : "bg-black/60 backdrop-blur-md text-white/80 hover:text-red-400 border border-white/10"
                      }`}
                    >
                      <Heart size={14} className={likedByMe ? "fill-white text-white" : "text-white"} />
                    </button>

                    {/* Member Pills */}
                    {usersWhoLiked.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[70%] z-20 pointer-events-none">
                        {usersWhoLiked.slice(0, 2).map((u, uIdx) => (
                          <span 
                            key={uIdx} 
                            className="bg-black/80 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded-full border border-white/15 shadow-sm"
                          >
                            {u.role === 'Bride' ? '👰' : (u.role === 'Groom' ? '🤵' : '❤️')} {u.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5 pointer-events-none">
                      <span className="text-[10px] text-zinc-300 font-light">#{index + 1}</span>
                      <a 
                        href={photo.url} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()} 
                        className="p-2 bg-zinc-950/90 hover:bg-[#b4975a] hover:text-zinc-950 border border-zinc-800 rounded-xl text-white transition-all cursor-pointer pointer-events-auto"
                        title="Download HD"
                      >
                        <Download size={13} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 border border-zinc-800 rounded-3xl text-zinc-500 font-light text-sm">
              No photos found under this filter.
            </div>
          )}
        </div>
      </div>

      {/* Floating Status Pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-full px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-3 text-xs">
        <span className="text-zinc-300 flex items-center gap-1.5">
          <Heart size={14} className="fill-red-500 text-red-500" />
          <strong>{myPicks.length}</strong> my picks &bull; <strong>{selectedPhotoIds.size}</strong> group total
        </span>

        {saveStatus === "saving" && (
          <span style={{ color: activeColor }} className="text-[10px] font-bold uppercase tracking-wider pl-2 border-l border-zinc-800 flex items-center gap-1">
            <RefreshCw size={11} className="animate-spin" /> Syncing...
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider pl-2 border-l border-zinc-800 flex items-center gap-1">
            <Check size={11} /> Saved
          </span>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. FULLSCREEN SHOWCASE VIEWER (WITH DEDICATED BACK TO GRID BUTTON) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="p-4 sm:px-8 flex justify-between items-center text-white z-20 w-full bg-gradient-to-b from-black/90 to-transparent border-b border-white/5">
              {/* ⊞ DEDICATED BACK TO GRID BUTTON */}
              <button 
                onClick={() => setActivePhoto(null)}
                className="px-4 py-2.5 bg-zinc-900/90 hover:bg-[#b4975a] hover:text-zinc-950 border border-zinc-700/80 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg group active:scale-95"
                title="Return to Gallery"
              >
                <LayoutGrid size={16} className="group-hover:scale-110 transition-transform" />
                <span>Back to Story</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">
                  {displayedPhotos ? `${displayedPhotos.findIndex(p => p.id === activePhoto.id) + 1} / ${displayedPhotos.length}` : ""}
                </span>
                {getUsersForPhoto(activePhoto.id).length > 0 && (
                  <span className="text-[10px] bg-red-950/60 border border-red-800/50 text-red-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    ❤️ {getUsersForPhoto(activePhoto.id).map(u => u.name).join(", ")}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={(e) => toggleHeartPhoto(activePhoto.id, e)}
                  className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                    isLikedByMe(activePhoto.id)
                      ? "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 border-zinc-800"
                  }`}
                >
                  <Heart size={14} className={isLikedByMe(activePhoto.id) ? "fill-white" : ""} />
                  <span className="hidden sm:inline">
                    {isLikedByMe(activePhoto.id) ? "My Pick" : "Select Photo"}
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

            {/* Main Showcase View */}
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
                {displayedPhotos.map((p, pIdx) => {
                  const pLiked = selectedPhotoIds.has(p.id);
                  return (
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
                      {pLiked && (
                        <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-1 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] text-zinc-500 font-light">
                Use Left / Right arrow keys or tap thumbnails. Click <strong>Back to Story</strong> to return.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientGallery;
