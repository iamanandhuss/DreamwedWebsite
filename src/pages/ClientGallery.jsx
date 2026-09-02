import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Download, 
  Share2, X, ChevronLeft, ChevronRight, RefreshCw, ZoomIn,
  Heart, Check, Sparkles, Filter, Search, Camera, Copy,
  LayoutGrid, Grid, User, Users, Mail, UserCheck, ShieldCheck,
  ChevronDown, Layers, Play, Pause, Calendar, MapPin, Film
} from "lucide-react";
import SEO from "../components/SEO";
import { downloadPhotosAsZip } from "../utils/zipDownloader";
import { curateWeddingStory, curateGuestThreeTierSections } from "../utils/aiCurator";

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
  { id: "Guest", label: "Guest", icon: "✨", color: "#b4975a" }
];

const getObjectPositionStyle = (val) => {
  if (val === "top" || val === 0 || val === "0") return "center 0%";
  if (val === "bottom" || val === 100 || val === "100") return "center 100%";
  if (val === "center" || val === 50 || val === "50" || !val) return "center 50%";
  const num = Number(String(val).replace("%", ""));
  if (!isNaN(num)) return `center ${num}%`;
  return "center 50%";
};

const formatTitleCase = (str) => {
  if (!str) return "";
  return String(str).replace(/\b\w/g, char => char.toUpperCase());
};

const ClientGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = typeof window !== "undefined" && window.location
    ? new URLSearchParams(location.search || window.location.search)
    : { get: () => null };

  const isDirectDownloadMode = searchParams.get("download") === "favorites" || 
                               searchParams.get("download") === "selections" || 
                               searchParams.get("mode") === "favorites";

  // Viewer profile & session
  const [viewerName, setViewerName] = useState(() => {
    try { return localStorage.getItem("dreamwed_viewer_name") || ""; } catch (e) { return ""; }
  });
  const [viewerEmail, setViewerEmail] = useState(() => {
    try { return localStorage.getItem("dreamwed_viewer_email") || ""; } catch (e) { return ""; }
  });
  const [viewerRole, setViewerRole] = useState(() => {
    try { return localStorage.getItem("dreamwed_viewer_role") || "Guest"; } catch (e) { return "Guest"; }
  });
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
  const [selectedPhotoIds, setSelectedPhotoIds] = useState(() => new Set());
  const [selectionsDetail, setSelectionsDetail] = useState([]);
  const [filterMode, setFilterMode] = useState("all");
  const [saveStatus, setSaveStatus] = useState("");
  const [zippingState, setZippingState] = useState(null);
  const [activeSectionView, setActiveSectionView] = useState("story"); // 'story' | 'archive' | 'highlights'
  const [gridCols, setGridCols] = useState(3); // 2 | 3 | 4
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(true);
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

  // Role permissions check
  const isCoupleSelectionMode = currentUser?.role === "Bride" || currentUser?.role === "Groom";
  const isGuestMode = !isCoupleSelectionMode;

  const allPhotos = gallery?.photos || meta?.photos || [];

  // Auto-curate story data if highlights is empty but photos are present
  useEffect(() => {
    if ((!storyData || !storyData.highlights || storyData.highlights.length === 0) && allPhotos.length > 0) {
      const curated = curateWeddingStory({
        photos: allPhotos,
        groomName: gallery?.groomName || meta?.groomName || "",
        brideName: gallery?.brideName || meta?.brideName || "",
        galleryName: gallery?.name || meta?.name || "Wedding Gallery"
      });
      setStoryData(curated);
    }
  }, [allPhotos.length, gallery?.id]);

  // Slideshow auto-advance timer
  useEffect(() => {
    let timer = null;
    if (isSlideshowActive && isSlideshowPlaying && allPhotos.length > 0) {
      timer = setInterval(() => {
        setSlideshowIndex(prev => (prev + 1) % allPhotos.length);
      }, 4500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSlideshowActive, isSlideshowPlaying, allPhotos.length]);

  // 2. Handle unlock with multi-tier passcode
  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    const cleanCode = passcode.trim();
    if (!cleanCode) {
      setError("Please enter the gallery access passcode.");
      return;
    }

    const lowerCode = cleanCode.toLowerCase();
    const isSelectionCode = lowerCode.includes("select") || (meta?.selectionCode && lowerCode === meta.selectionCode.toLowerCase());

    let targetRole = "Guest";
    if (isSelectionCode) {
      targetRole = viewerRole === "Groom" ? "Groom" : "Bride";
    } else if (lowerCode.includes("bride")) {
      targetRole = "Bride";
    } else if (lowerCode.includes("groom")) {
      targetRole = "Groom";
    } else {
      targetRole = "Guest";
    }

    let cleanName = viewerName.trim();
    if (!cleanName) {
      if (targetRole === "Bride") cleanName = meta?.brideName || "Bride";
      else if (targetRole === "Groom") cleanName = meta?.groomName || "Groom";
      else cleanName = "Guest";
    }

    setUnlocking(true);
    setError("");

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
         String(g.selectionCode || "").trim().toLowerCase() === lowerCode ||
         String(g.guestCode || "").trim().toLowerCase() === lowerCode ||
         String(g.brideCode || "").trim().toLowerCase() === lowerCode ||
         String(g.groomCode || "").trim().toLowerCase() === lowerCode ||
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
      setError(err.message || "Failed to unlock gallery. Please verify your passcode.");
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
    if (!photoId) return;

    if (isGuestMode) {
      alert("✨ Guest Viewing Mode Active\n\nPhoto selection for the wedding album is reserved for the 👰 Bride and 🤵 Groom using the Selection Passcode.");
      return;
    }

    const user = currentUser || { name: viewerName || (viewerRole === "Bride" ? "Bride" : "Groom"), email: viewerEmail || "", role: viewerRole || "Bride" };

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

  const heroImage = storyData?.heroImage || meta?.coverUrl || (allPhotos[0]?.url) || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600";
  const highlights = (storyData?.highlights && storyData.highlights.length > 0) 
    ? storyData.highlights 
    : (allPhotos.length > 0 ? allPhotos.slice(0, Math.min(28, allPhotos.length)) : []);
  const chapters = (storyData?.chapters && storyData.chapters.length > 0)
    ? storyData.chapters
    : (allPhotos.length > 0 ? [{
        id: "chapter-all",
        title: "The Wedding Story",
        subtitle: `${formatTitleCase(gallery?.name || meta?.name || "Wedding Highlights")}`,
        description: "A cinematic collection of cherished memories and timeless moments.",
        photos: allPhotos
      }] : []);

  // 3-Tier AI Sections exclusively for Guest Mode
  const guestTiers = React.useMemo(() => {
    return curateGuestThreeTierSections(allPhotos, formatTitleCase(gallery?.name || meta?.name || "Wedding"));
  }, [allPhotos, gallery?.name, meta?.name]);

  const scrollToGuestAct = (actId) => {
    const el = document.getElementById(actId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  // Mobile Touch Swipe Navigation (Left/Right)
  const [touchStartX, setTouchStartX] = useState(null);
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      setTouchStartX(e.touches[0].clientX);
    }
  };
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    if (e.changedTouches && e.changedTouches.length > 0) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (diff > 45) {
        handleNextPhoto(); // Swiped left -> Next
      } else if (diff < -45) {
        handlePrevPhoto(); // Swiped right -> Prev
      }
    }
    setTouchStartX(null);
  };

  // Editorial Bento Mosaic Card Renderer
  const renderMosaicCard = (photo, customClass = "h-full", isFocalHero = false, badgeText = "") => {
    if (!photo) return null;
    const isLiked = isLikedByMe(photo.id);

    return (
      <div 
        key={photo.id || photo.url}
        onClick={() => setActivePhoto(photo)}
        className={`group relative rounded-2xl overflow-hidden bg-zinc-900 border cursor-pointer shadow-xl transition-all duration-500 hover:border-[#b4975a]/70 hover:shadow-2xl active:scale-[0.99] select-none ${customClass} ${
          isFocalHero ? "border-[#b4975a]/40 ring-1 ring-[#b4975a]/25" : "border-zinc-800/80"
        }`}
      >
        <img 
          src={photo.url} 
          alt="Editorial Wedding Frame"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Left Badges: Key Moment & Member Selection attribution */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 items-center z-20 pointer-events-none max-w-[75%]">
          {(isFocalHero || badgeText) && (
            <span className="bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 font-mono">
              <Sparkles size={9} /> {badgeText || "Featured"}
            </span>
          )}

          {/* Member Selection Pills (Bride / Groom) */}
          {isCoupleSelectionMode && getUsersForPhoto(photo.id).length > 0 && (
            getUsersForPhoto(photo.id).map((u, uIdx) => (
              <span 
                key={uIdx}
                className={`text-[8px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border ${
                  u.role === 'Bride' ? 'bg-pink-600/95 text-white border-pink-400/50 shadow-pink-600/30' : 
                  u.role === 'Groom' ? 'bg-sky-600/95 text-white border-sky-400/50 shadow-sky-600/30' : 
                  'bg-red-600 text-white border-red-400/50'
                }`}
              >
                {u.role === 'Bride' ? '👰' : u.role === 'Groom' ? '🤵' : '❤️'} {u.name}
              </span>
            ))
          )}
        </div>

        {/* Heart Selection Button - Exclusive to Bride & Groom */}
        {isCoupleSelectionMode && (
          <button
            onClick={(e) => toggleHeartPhoto(photo.id, e)}
            title={isLiked ? "Remove from album picks" : `Select as ${currentUser?.role || "Couple"}`}
            className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-30 cursor-pointer shadow-xl ${
              isLiked 
                ? "bg-red-500 text-white scale-110 shadow-red-500/50" 
                : "bg-black/60 backdrop-blur-md text-white/80 hover:text-red-400 hover:scale-110 border border-white/10"
            }`}
          >
            <Heart size={14} className={isLiked ? "fill-white text-white" : "text-white"} />
          </button>
        )}

        {/* Hover / Touch to Fullscreen indicator */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5 pointer-events-none">
          <span className="text-[10px] text-zinc-300 font-mono">Tap for Fullscreen</span>
          <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/15">
            <ZoomIn size={11} /> View
          </span>
        </div>
      </div>
    );
  };

  // Dynamic Adaptive Editorial Bento Cluster Engine (Matches Luxury Photography Magazines)
  const renderBentoClusters = (photosList, sectionKey = "bento") => {
    if (!photosList || photosList.length === 0) return null;

    // Strict URL deduplication within this display container
    const seen = new Set();
    const uniqueList = [];
    for (const p of photosList) {
      if (!p || !p.url) continue;
      const key = String(p.url).trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueList.push(p);
      }
    }

    if (uniqueList.length === 0) return null;

    // 1 Photo: Grand Hero Feature
    if (uniqueList.length === 1) {
      return (
        <div key={`${sectionKey}-single`} className="max-w-4xl mx-auto h-[360px] sm:h-[500px]">
          {renderMosaicCard(uniqueList[0], "h-full", true, "⭐ Key Moment")}
        </div>
      );
    }

    // 2 Photos: Balanced Editorial Diptych Duo
    if (uniqueList.length === 2) {
      return (
        <div key={`${sectionKey}-diptych`} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
          <div className="h-[320px] sm:h-[440px]">{renderMosaicCard(uniqueList[0], "h-full", true, "⭐ Featured")}</div>
          <div className="h-[320px] sm:h-[440px]">{renderMosaicCard(uniqueList[1], "h-full", false, "Portrait")}</div>
        </div>
      );
    }

    // 3 Photos: Editorial Triptych
    if (uniqueList.length === 3) {
      return (
        <div key={`${sectionKey}-triptych`} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
          <div className="h-[300px] sm:h-[380px]">{renderMosaicCard(uniqueList[0], "h-full", true, "⭐ Featured")}</div>
          <div className="h-[300px] sm:h-[380px]">{renderMosaicCard(uniqueList[1], "h-full", false, "Portrait")}</div>
          <div className="h-[300px] sm:h-[380px]">{renderMosaicCard(uniqueList[2], "h-full", false, "Portrait")}</div>
        </div>
      );
    }

    // 4 Photos: 1 Grand Feature (Left) + 3-Grid (Right)
    if (uniqueList.length === 4) {
      return (
        <div key={`${sectionKey}-quad`} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5 items-stretch">
          <div className="col-span-12 md:col-span-7 h-[340px] sm:h-[420px]">
            {renderMosaicCard(uniqueList[0], "h-full", true, "⭐ Key Moment")}
          </div>
          <div className="col-span-12 md:col-span-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3.5 h-[340px] sm:h-[420px]">
            <div className="h-full">{renderMosaicCard(uniqueList[1], "h-full")}</div>
            <div className="h-full">{renderMosaicCard(uniqueList[2], "h-full")}</div>
            <div className="h-full">{renderMosaicCard(uniqueList[3], "h-full")}</div>
          </div>
        </div>
      );
    }

    // 5 Photos: 1 Grand Feature (Left) + 2x2 Grid (Right)
    if (uniqueList.length === 5) {
      return (
        <div key={`${sectionKey}-pent`} className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-stretch">
          <div className="col-span-12 lg:col-span-6 h-[340px] sm:h-[420px] lg:h-[480px]">
            {renderMosaicCard(uniqueList[0], "h-full", true, "⭐ Key Moment")}
          </div>
          <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-3.5 h-[340px] sm:h-[420px] lg:h-[480px]">
            <div className="h-full">{renderMosaicCard(uniqueList[1], "h-full")}</div>
            <div className="h-full">{renderMosaicCard(uniqueList[2], "h-full")}</div>
            <div className="h-full">{renderMosaicCard(uniqueList[3], "h-full")}</div>
            <div className="h-full">{renderMosaicCard(uniqueList[4], "h-full")}</div>
          </div>
        </div>
      );
    }

    // 6 Photos: 2 Large (Top) + 4 (Bottom)
    if (uniqueList.length === 6) {
      return (
        <div key={`${sectionKey}-hex`} className="space-y-3.5 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
            <div className="h-[280px] sm:h-[360px]">{renderMosaicCard(uniqueList[0], "h-full", true, "⭐ Key Moment")}</div>
            <div className="h-[280px] sm:h-[360px]">{renderMosaicCard(uniqueList[1], "h-full", false, "Featured")}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
            <div className="h-[180px] sm:h-[240px]">{renderMosaicCard(uniqueList[2], "h-full")}</div>
            <div className="h-[180px] sm:h-[240px]">{renderMosaicCard(uniqueList[3], "h-full")}</div>
            <div className="h-[180px] sm:h-[240px]">{renderMosaicCard(uniqueList[4], "h-full")}</div>
            <div className="h-[180px] sm:h-[240px]">{renderMosaicCard(uniqueList[5], "h-full")}</div>
          </div>
        </div>
      );
    }

    // 7+ Photos: Full 7-Photo 3-Column Magazine Bento Clusters
    const clusters = [];
    for (let i = 0; i < uniqueList.length; i += 7) {
      clusters.push(uniqueList.slice(i, i + 7));
    }

    return (
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {clusters.map((cluster, cIdx) => {
          const isAlternate = cIdx % 2 === 1;
          const p0 = cluster[0];
          const p1 = cluster[1];
          const p2 = cluster[2];
          const p3 = cluster[3];
          const p4 = cluster[4];
          const p5 = cluster[5];
          const p6 = cluster[6];

          if (cluster.length < 4) {
            return (
              <div key={`${sectionKey}-cluster-${cIdx}`} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {cluster.map((p, idx) => (
                  <div key={p.id || idx} className="h-[280px] sm:h-[340px]">
                    {renderMosaicCard(p, "h-full", idx === 0, idx === 0 ? "Featured" : "")}
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div 
              key={`${sectionKey}-bento-cluster-${cIdx}`} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5 items-stretch"
            >
              {/* COLUMN 1: Large Featured Card (Top) + 2 Sub-Cards (Bottom) */}
              <div className={`col-span-1 md:col-span-2 lg:col-span-6 xl:col-span-5 flex flex-col gap-3.5 sm:gap-4 lg:gap-5 ${isAlternate ? "lg:order-3" : "lg:order-1"}`}>
                {p0 && (
                  <div className="h-[260px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
                    {renderMosaicCard(p0, "h-full", true, "⭐ Key Moment")}
                  </div>
                )}
                {(p1 || p2) && (
                  <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px]">
                    {p1 && renderMosaicCard(p1, "h-full")}
                    {p2 && renderMosaicCard(p2, "h-full")}
                  </div>
                )}
              </div>

              {/* COLUMN 2: Top Landscape + Bottom Tall Portrait */}
              <div className="col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-3.5 xl:col-span-3 flex flex-col gap-3.5 sm:gap-4 lg:gap-5 lg:order-2">
                {p3 && (
                  <div className="h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px]">
                    {renderMosaicCard(p3, "h-full")}
                  </div>
                )}
                {p4 && (
                  <div className="h-[260px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
                    {renderMosaicCard(p4, "h-full", false, "Portrait")}
                  </div>
                )}
              </div>

              {/* COLUMN 3: Top Landscape + Bottom Tall Portrait */}
              <div className={`col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-4 flex flex-col gap-3.5 sm:gap-4 lg:gap-5 ${isAlternate ? "lg:order-1" : "lg:order-3"}`}>
                {p5 && (
                  <div className="h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px]">
                    {renderMosaicCard(p5, "h-full")}
                  </div>
                )}
                {p6 && (
                  <div className="h-[260px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
                    {renderMosaicCard(p6, "h-full", false, "Portrait")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
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
          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            {/* Passcode input with dynamic code-type indicator */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Gallery Passcode <span className="text-red-400">*</span>
                </label>
                <span className="text-[9px] font-medium" style={{ color: activeColor }}>
                  {(meta?.selectionCode && passcode.trim() === String(meta.selectionCode).trim()) || passcode.toLowerCase().includes("select")
                    ? "💍 Selection Passcode Detected"
                    : ((meta?.guestCode && passcode.trim() === String(meta.guestCode).trim()) || (meta?.accessCode && passcode.trim() === String(meta.accessCode).trim()) || passcode.toLowerCase().includes("guest")
                      ? "✨ Guest Passcode Detected"
                      : "Enter Passcode")}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); if (error) setError(""); }}
                  placeholder="e.g. 4821 or 8392"
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#b4975a] font-mono tracking-wider font-bold"
                  required
                  autoFocus
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

            {/* If and ONLY IF Selection Code is typed, ask for Bride or Groom */}
            {(passcode.trim().toLowerCase().includes("select") || 
              (meta?.selectionCode && passcode.trim().toLowerCase() === meta.selectionCode.toLowerCase())) && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-gradient-to-br from-pink-950/30 via-zinc-900 to-sky-950/30 border border-pink-700/40 rounded-2xl space-y-2"
              >
                <label className="text-[9px] uppercase font-bold text-pink-300 tracking-wider block text-center">
                  💍 Album Selection Lounge &bull; Who is selecting?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setViewerRole("Bride")}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      viewerRole === "Bride"
                        ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md shadow-pink-600/30 scale-102"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>👰 Bride</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerRole("Groom")}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      viewerRole === "Groom"
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-400 shadow-md shadow-sky-600/30 scale-102"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>🤵 Groom</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Name input */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">
                {(passcode.trim().toLowerCase().includes("select") || (meta?.selectionCode && passcode.trim().toLowerCase() === meta.selectionCode.toLowerCase()))
                  ? "Your Name (Bride / Groom)"
                  : "Your Name (Optional for Guests)"}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={viewerName}
                  onChange={(e) => { setViewerName(e.target.value); if (error) setError(""); }}
                  placeholder={(passcode.trim().toLowerCase().includes("select") || (meta?.selectionCode && passcode.trim().toLowerCase() === meta.selectionCode.toLowerCase()))
                    ? (viewerRole === "Bride" ? "e.g. Parvathi (Bride)" : "e.g. Akash (Groom)")
                    : "e.g. Rahul (Guest)"}
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#b4975a]"
                />
                <User size={14} className="absolute right-3.5 text-zinc-500 pointer-events-none" />
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
              disabled={unlocking || !passcode.trim()}
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
                ? `${formatTitleCase(gallery.groomName)} & ${formatTitleCase(gallery.brideName)}` 
                : formatTitleCase(gallery?.name || "Wedding Gallery")}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ color: activeColor }} className="text-[9px] font-bold uppercase tracking-wider">
                Dreamwed Stories
              </span>
              {currentUser && (
                <span className="text-[9px] bg-zinc-900 text-zinc-300 px-2.5 py-0.5 rounded-full border border-zinc-800 flex items-center gap-1 shadow-sm">
                  <span>{USER_ROLES.find(r => r.id === currentUser.role)?.icon || "👤"}</span>
                  <strong className="text-white">
                    {currentUser.name && currentUser.name.toLowerCase() !== currentUser.role?.toLowerCase() && currentUser.name.toLowerCase() !== "guest"
                      ? `${currentUser.name} (${currentUser.role})`
                      : currentUser.role || "Guest"}
                  </strong>
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
              className={`px-3.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                activeSectionView === "story" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Cinematic Story
            </button>

            {isGuestMode ? (
              <>
                {guestTiers.couplePortraits.length > 0 && (
                  <button
                    onClick={() => { setActiveSectionView("story"); scrollToGuestAct("guest-act-1"); }}
                    className="px-3 py-1 rounded-lg transition-all cursor-pointer font-bold text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/60"
                  >
                    👑 Couple &amp; Solo ({guestTiers.couplePortraits.length})
                  </button>
                )}
                {guestTiers.functionGroupPhotos.length > 0 && (
                  <button
                    onClick={() => { setActiveSectionView("story"); scrollToGuestAct("guest-act-2"); }}
                    className="px-3 py-1 rounded-lg transition-all cursor-pointer font-bold text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/60"
                  >
                    💍 Ceremony &amp; Groups ({guestTiers.functionGroupPhotos.length})
                  </button>
                )}
                {guestTiers.restOfPhotos.length > 0 && (
                  <button
                    onClick={() => { setActiveSectionView("story"); scrollToGuestAct("guest-act-3"); }}
                    className="px-3 py-1 rounded-lg transition-all cursor-pointer font-bold text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/60"
                  >
                    📸 All Memories ({guestTiers.restOfPhotos.length})
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveSectionView("highlights")}
                  className={`px-3.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                    activeSectionView === "highlights" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Editorial Highlights ({highlights.length})
                </button>
                <button
                  onClick={() => setActiveSectionView("archive")}
                  className={`px-3.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                    activeSectionView === "archive" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  💍 Selection Lounge ({selectedPhotoIds.size})
                </button>
              </>
            )}
          </div>

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

      {/* ========================================================= */}
      {/* 2.0. PRODUCTION & EDITOR LOUNGE (DIRECT SHARE LINK ONLY) */}
      {/* ========================================================= */}
      {isDirectDownloadMode && (
        <div className="bg-gradient-to-r from-amber-950/90 via-zinc-900 to-amber-950/90 border-b border-amber-500/30 px-4 sm:px-8 py-3.5 sticky top-[57px] z-30 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <span>🎨</span> Production &amp; Editor Portal
              </span>
              <p className="text-xs text-zinc-300 font-light">
                Client Selected Photos for Album Design &amp; Retouching ({selectedPhotoIds.size} Total Favorites)
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {bridePicks.length > 0 && (
                <button
                  disabled={zippingState?.isZipping}
                  onClick={() => handleDownloadZipPackage(bridePicks, "Bride_Selections")}
                  className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Download size={12} /> 👰 Bride ZIP ({bridePicks.length})
                </button>
              )}

              {groomPicks.length > 0 && (
                <button
                  disabled={zippingState?.isZipping}
                  onClick={() => handleDownloadZipPackage(groomPicks, "Groom_Selections")}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Download size={12} /> 🤵 Groom ZIP ({groomPicks.length})
                </button>
              )}

              <button
                disabled={zippingState?.isZipping || selectedPhotoIds.size === 0}
                onClick={() => {
                  const allSelected = allPhotos.filter(p => selectedPhotoIds.has(p.id));
                  handleDownloadZipPackage(allSelected, "All_Client_Selections");
                }}
                className="px-4 py-1.5 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                <Download size={13} /> ⚡ Download All Selections ZIP ({selectedPhotoIds.size})
              </button>
            </div>
          </div>
        </div>
      )}

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
            className="text-4xl sm:text-7xl md:text-8xl text-white font-light tracking-wide leading-tight capitalize"
          >
            {gallery?.groomName && gallery?.brideName ? (
              <>
                <span>{formatTitleCase(gallery.groomName)}</span>{" "}
                <span style={{ color: activeColor }} className="italic font-serif">&amp;</span>{" "}
                <span>{formatTitleCase(gallery.brideName)}</span>
              </>
            ) : (
              formatTitleCase(gallery?.name || "Dreamwed Stories")
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
            className="pt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={scrollToStory}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-zinc-950 border border-white/25 backdrop-blur-md transition-all text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2.5 cursor-pointer shadow-2xl"
            >
              <span>Explore The Story</span>
              <ChevronDown size={14} />
            </button>

            <button
              onClick={() => {
                setSlideshowIndex(0);
                setIsSlideshowPlaying(true);
                setIsSlideshowActive(true);
              }}
              className="px-6 py-3.5 rounded-full bg-[#b4975a]/20 hover:bg-[#b4975a] text-white hover:text-zinc-950 border border-[#b4975a]/40 backdrop-blur-md transition-all text-xs font-bold uppercase tracking-[0.18em] flex items-center gap-2 cursor-pointer shadow-2xl"
            >
              <Play size={13} className="fill-current" />
              <span>Play Slideshow</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2.2. MAIN STORY PRESENTATION                               */}
      {/* GUEST MODE: 3 AI Curated Acts (10% Couple, Groups, Rest)   */}
      {/* SELECTION MODE: Editorial Highlights + Chapters (Couple)  */}
      {/* ========================================================= */}
      <div ref={storyRef} className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-16">
        {isGuestMode ? (
          /* ========================================================= */
          /* GUEST MODE: 3 DEDICATED AI-CURATED SECTIONS              */
          /* 1. ~10% Couple & Solo Portraits First (AI)               */
          /* 2. Function & Ceremony + Group & Family Photos Next (AI)  */
          /* 3. The Complete Celebration Canvas / Rest of Photos (AI)  */
          /* ========================================================= */
          <div className="space-y-28">
            {/* TIER 1: Couple & Solo Portraits (~10% Top Moments) */}
            {guestTiers.couplePortraits.length > 0 && (
              <div id="guest-act-1" className="space-y-8 scroll-mt-24">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span style={{ color: activeColor }} className="text-[10px] uppercase font-bold tracking-[0.3em] flex items-center justify-center gap-1.5 font-mono">
                    <Sparkles size={11} /> AI Curated &bull; Act I (Top Moments &bull; 10%)
                  </span>
                  <h2 style={{ fontFamily: activeFontFamily }} className="text-3xl sm:text-5xl text-white font-light">
                    The Couple &amp; <span style={{ color: activeColor }} className="italic font-serif">Solo Portraits</span>
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                    Breathtaking romantic couple frames and intimate solo bridal &amp; groom portraits chosen by AI for exquisite visual resonance.
                  </p>
                  <div style={{ backgroundColor: `${activeColor}80` }} className="w-12 h-[1px] mx-auto mt-4" />
                </div>

                {renderBentoClusters(guestTiers.couplePortraits, "guest-tier-couple")}
              </div>
            )}

            {/* TIER 2: Function, Ceremony, Stage & Group Photos */}
            {guestTiers.functionGroupPhotos.length > 0 && (
              <div id="guest-act-2" className="space-y-8 pt-12 border-t border-zinc-850/80 scroll-mt-24">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span style={{ color: activeColor }} className="text-[10px] uppercase font-bold tracking-[0.3em] flex items-center justify-center gap-1.5 font-mono">
                    <Users size={12} /> AI Curated &bull; Act II (Ceremonies &amp; Groups)
                  </span>
                  <h2 style={{ fontFamily: activeFontFamily }} className="text-3xl sm:text-5xl text-white font-light">
                    Rituals, Stage &amp; <span style={{ color: activeColor }} className="italic font-serif">Group Memories</span>
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                    The sacred vows, arrival ceremonies, family blessings, and cherished group portraits with all honored guests.
                  </p>
                  <div style={{ backgroundColor: `${activeColor}80` }} className="w-12 h-[1px] mx-auto mt-4" />
                </div>

                {renderBentoClusters(guestTiers.functionGroupPhotos, "guest-tier-function")}
              </div>
            )}

            {/* TIER 3: Rest of the Wedding Photos & Atmosphere */}
            {guestTiers.restOfPhotos.length > 0 && (
              <div id="guest-act-3" className="space-y-8 pt-12 border-t border-zinc-850/80 scroll-mt-24">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span style={{ color: activeColor }} className="text-[10px] uppercase font-bold tracking-[0.3em] flex items-center justify-center gap-1.5 font-mono">
                    <Camera size={12} /> AI Curated &bull; Act III (Complete Story)
                  </span>
                  <h2 style={{ fontFamily: activeFontFamily }} className="text-3xl sm:text-5xl text-white font-light">
                    The Full <span style={{ color: activeColor }} className="italic font-serif">Celebration Canvas</span>
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                    Every joyful laugh, party celebration, candid expression, and timeless memory across the entire wedding journey.
                  </p>
                  <div style={{ backgroundColor: `${activeColor}80` }} className="w-12 h-[1px] mx-auto mt-4" />
                </div>

                {renderBentoClusters(guestTiers.restOfPhotos, "guest-tier-rest")}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* COUPLE SELECTION MODE: Highlights + Chapters (Unaffected) */
          /* ========================================================= */
          <>
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

            {/* Asymmetric Editorial Bento Highlights Mosaic */}
            {renderBentoClusters(highlights, "highlights")}

            {/* Cinematic Story Chapters */}
            {chapters.length > 0 && (
              <div className="space-y-24 pt-10">
                {chapters.map((chapter, cIdx) => (
                  <div key={chapter.id || cIdx} className="space-y-8">
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

                    {renderBentoClusters(chapter.photos, `chapter-${cIdx}`)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* 2.4. FULL WEDDING ARCHIVE (EXCLUSIVE TO BRIDE & GROOM SELECTION) */}
        {/* ========================================================= */}
        {isCoupleSelectionMode && (
          <div className="space-y-8 pt-12 border-t border-zinc-850">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span style={{ color: activeColor }} className="text-[10px] uppercase font-bold tracking-[0.25em]">
                Album Selection Lounge
              </span>
              <h3 style={{ fontFamily: activeFontFamily }} className="text-3xl sm:text-4xl text-white font-light">
                Select Your <span style={{ color: activeColor }} className="italic font-serif">Album Picks</span>
              </h3>
              <p className="text-zinc-400 text-xs font-light">
                Logged in as {currentUser?.role || "Couple"} &bull; Tap the heart on photos you want in your final wedding album.
              </p>
            </div>

            {/* Filter Pills & Grid Layout Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
              {/* Filter Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => setFilterMode("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterMode === "all" ? "bg-white text-black shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  All ({allPhotos.length})
                </button>

                <button
                  onClick={() => setFilterMode("highlights")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterMode === "highlights" ? "bg-amber-400 text-zinc-950 shadow-md font-bold" : "bg-zinc-900 text-zinc-400 hover:text-amber-400 border border-zinc-800"
                  }`}
                >
                  <span>✨ Highlights ({highlights.length})</span>
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
                  Couple Picks ({selectedPhotoIds.size})
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

              {/* Grid Column Layout Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Layout:</span>
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setGridCols(2)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${gridCols === 2 ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"}`}
                    title="2-Column View"
                  >
                    2 Col
                  </button>
                  <button
                    onClick={() => setGridCols(3)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${gridCols === 3 ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"}`}
                    title="3-Column View"
                  >
                    3 Col
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${gridCols === 4 ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"}`}
                    title="4-Column Grid"
                  >
                    4 Col
                  </button>
                </div>
              </div>
            </div>

            {/* Archive Grid */}
            {displayedPhotos.length > 0 ? (
              <div className={
                gridCols === 2
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                  : gridCols === 4
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
              }>
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
                        <span className="text-[10px] text-zinc-300 font-light font-mono">#{index + 1}</span>
                        <span className="text-[10px] text-zinc-400 font-light flex items-center gap-1">
                          <ZoomIn size={12} /> View
                        </span>
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
        )}
      </div>

      {/* Floating Status Pill - Active for Bride & Groom */}
      {isCoupleSelectionMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-full px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-3 text-xs">
          <span className="text-zinc-300 flex items-center gap-1.5">
            <Heart size={14} className="fill-red-500 text-red-500" />
            <strong>{myPicks.length}</strong> {currentUser?.role || "My"} picks &bull; <strong>{selectedPhotoIds.size}</strong> couple total
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
      )}

      {/* ========================================================= */}
      {/* 3. FULLSCREEN SHOWCASE VIEWER */}
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
            <div className="p-3 sm:p-4 sm:px-8 flex justify-between items-center text-white z-30 w-full bg-gradient-to-b from-black/95 to-transparent border-b border-white/5">
              {/* ⊞ DEDICATED BACK TO STORY BUTTON */}
              <button 
                onClick={() => setActivePhoto(null)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-zinc-900/95 hover:bg-[#b4975a] hover:text-zinc-950 text-white border border-zinc-750/90 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-2xl group active:scale-95 shrink-0"
                title="Return to Story (Esc)"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Story</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono font-bold">
                  {displayedPhotos ? `${displayedPhotos.findIndex(p => p.id === activePhoto.id) + 1} / ${displayedPhotos.length}` : ""}
                </span>
                {getUsersForPhoto(activePhoto.id).length > 0 && isCoupleSelectionMode && (
                  <span className="text-[10px] bg-red-950/60 border border-red-800/50 text-red-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                    ❤️ {getUsersForPhoto(activePhoto.id).map(u => u.name).join(", ")}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {isCoupleSelectionMode ? (
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
                ) : (
                  <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded-xl font-mono">
                    ✨ Guest View
                  </span>
                )}

                {/* Download is Strictly Disabled for Guests */}
                {isCoupleSelectionMode && (
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
                )}
                
                <button 
                  onClick={() => setActivePhoto(null)}
                  className="p-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Showcase View with Touch Swiping */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative flex-grow flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none"
            >
              {/* Previous Photo Button */}
              <button 
                onClick={handlePrevPhoto}
                title="Previous Photo (Left Arrow)"
                className="absolute left-2 sm:left-6 z-30 w-11 h-11 sm:w-14 sm:h-14 bg-zinc-950/85 hover:bg-[#b4975a] hover:text-zinc-950 text-white border border-zinc-700/80 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] cursor-pointer transition-all flex items-center justify-center backdrop-blur-md group active:scale-90"
              >
                <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
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

              {/* Next Photo Button */}
              <button 
                onClick={handleNextPhoto}
                title="Next Photo (Right Arrow)"
                className="absolute right-2 sm:right-6 z-30 w-11 h-11 sm:w-14 sm:h-14 bg-zinc-950/85 hover:bg-[#b4975a] hover:text-zinc-950 text-white border border-zinc-700/80 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] cursor-pointer transition-all flex items-center justify-center backdrop-blur-md group active:scale-90"
              >
                <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Touch Navigation Quick Bar */}
            <div className="flex sm:hidden items-center justify-between w-full px-4 py-2 bg-zinc-950/95 border-t border-zinc-850 z-30">
              <button 
                onClick={handlePrevPhoto}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-bold active:scale-95"
              >
                <ChevronLeft size={15} /> Prev
              </button>

              <span className="text-xs text-zinc-400 font-mono font-bold">
                {displayedPhotos ? `${displayedPhotos.findIndex(p => p.id === activePhoto.id) + 1} / ${displayedPhotos.length}` : ""}
              </span>

              <button 
                onClick={handleNextPhoto}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-bold active:scale-95"
              >
                Next <ChevronRight size={15} />
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

      {/* ========================================================= */}
      {/* 4. FULLSCREEN AMBIENT CINEMA SLIDESHOW PLAYER */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isSlideshowActive && allPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col justify-between select-none"
          >
            {/* Top Bar */}
            <div className="p-4 sm:px-8 flex justify-between items-center text-white z-20 bg-gradient-to-b from-black/90 to-transparent">
              <div className="flex items-center gap-3">
                <span style={{ color: activeColor }} className="text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-2">
                  <Film size={14} /> Cinema Slideshow
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {slideshowIndex + 1} / {allPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                  className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-750 text-white transition-all cursor-pointer"
                  title={isSlideshowPlaying ? "Pause" : "Play"}
                >
                  {isSlideshowPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button
                  onClick={() => setIsSlideshowActive(false)}
                  className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-750 text-white transition-all cursor-pointer"
                  title="Exit Slideshow"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Center Slide Image with Ambient Fade */}
            <div className="relative flex-grow flex items-center justify-center p-4 overflow-hidden">
              <motion.img
                key={slideshowIndex}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                src={allPhotos[slideshowIndex]?.url}
                alt={`Slide ${slideshowIndex + 1}`}
                className="max-h-[82vh] max-w-[94vw] object-contain rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Bottom Progress & Prev/Next */}
            <div className="p-4 sm:px-8 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between z-20">
              <button
                onClick={() => setSlideshowIndex(prev => (prev - 1 + allPhotos.length) % allPhotos.length)}
                className="p-3 rounded-full bg-zinc-900/80 hover:bg-[#b4975a] hover:text-zinc-950 text-white border border-zinc-800 transition-all cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="w-64 max-w-[50vw] bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                <div 
                  className="bg-[#b4975a] h-full transition-all duration-300"
                  style={{ width: `${((slideshowIndex + 1) / allPhotos.length) * 100}%` }}
                />
              </div>

              <button
                onClick={() => setSlideshowIndex(prev => (prev + 1) % allPhotos.length)}
                className="p-3 rounded-full bg-zinc-900/80 hover:bg-[#b4975a] hover:text-zinc-950 text-white border border-zinc-800 transition-all cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientGallery;
