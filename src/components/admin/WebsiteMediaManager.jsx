import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Image as ImageIcon, Check, Copy, RefreshCw, 
  Trash2, ExternalLink, Sparkles, Sliders, Layers, 
  Eye, CheckCircle2, AlertCircle, Save, ArrowUpRight,
  Camera, FolderOpen, X, Search, CheckCheck, BookOpen,
  Film, Star, LayoutGrid, Tag, FileText, Info
} from "lucide-react";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUploader";
import { getWebsiteMedia, saveWebsiteMediaCustomization } from "../../data/websiteMedia";

const WebsiteMediaManager = () => {
  const [mediaConfig, setMediaConfig] = useState(() => getWebsiteMedia());
  const [uploading, setUploading] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState(null); // { section, key }
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [activeSectionTab, setActiveSectionTab] = useState("portraits");
  const [pickerModalSlot, setPickerModalSlot] = useState(null); // { section, key, currentUrl, title }
  const [librarySearch, setLibrarySearch] = useState("");
  const [dragOverGlobal, setDragOverGlobal] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setMediaConfig(getWebsiteMedia());
    window.addEventListener("dreamwed_media_updated", handleUpdate);
    return () => window.removeEventListener("dreamwed_media_updated", handleUpdate);
  }, []);

  // 1. Upload files to Cloudinary and optionally assign to a specific slot
  const handleFileUpload = async (files, targetSlot = null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    if (targetSlot) setUploadingSlot(targetSlot);
    setUploadProgress(10);

    try {
      const newItems = [];
      const newMap = { ...mediaConfig.mediaMap };
      let lastUploadedUrl = "";

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImageToCloudinary(file, (p) => {
          setUploadProgress(Math.round(((i + p / 100) / files.length) * 100));
        });

        lastUploadedUrl = res.url;
        newMap[file.name] = res.url;
        newItems.push({
          id: res.id,
          filename: file.name,
          name: file.name.split(".")[0],
          url: res.url,
          rawUrl: res.rawUrl,
          format: res.format,
          width: res.width,
          height: res.height,
          bytes: res.bytes,
          uploadedAt: res.created_at || new Date().toISOString()
        });
      }

      let updatedSections = { ...mediaConfig.sections };
      if (targetSlot && lastUploadedUrl) {
        updatedSections[targetSlot.section] = {
          ...(updatedSections[targetSlot.section] || {}),
          [targetSlot.key]: lastUploadedUrl
        };
      }

      const updated = {
        ...mediaConfig,
        sections: updatedSections,
        mediaMap: newMap,
        mediaList: [...newItems, ...(mediaConfig.mediaList || [])]
      };

      setMediaConfig(updated);
      saveWebsiteMediaCustomization(updated);
      setSaveStatus("uploaded");
      setTimeout(() => setSaveStatus(""), 3500);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      setUploadingSlot(null);
      setUploadProgress(0);
    }
  };

  const handleAssignImage = (section, key, url) => {
    const updated = {
      ...mediaConfig,
      sections: {
        ...mediaConfig.sections,
        [section]: {
          ...(mediaConfig.sections?.[section] || {}),
          [key]: url
        }
      }
    };
    setMediaConfig(updated);
    saveWebsiteMediaCustomization(updated);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus(""), 3000);
    if (pickerModalSlot) setPickerModalSlot(null);
  };

  const copyLink = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(""), 2500);
  };

  const filteredLibrary = (mediaConfig.mediaList || []).filter(item => {
    if (!librarySearch) return true;
    const term = librarySearch.toLowerCase();
    return (item.filename || "").toLowerCase().includes(term) || (item.name || "").toLowerCase().includes(term);
  });

  const MediaSlotCard = ({ section, slotKey, title, currentUrl, aspect = "aspect-[3/4]" }) => {
    const fileInputRef = useRef(null);
    const [cardDrag, setCardDrag] = useState(false);
    const isThisSlotUploading = uploadingSlot && uploadingSlot.section === section && uploadingSlot.key === slotKey;

    return (
      <div 
        onDragOver={(e) => { e.preventDefault(); setCardDrag(true); }}
        onDragLeave={() => setCardDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setCardDrag(false);
          handleFileUpload(e.dataTransfer.files, { section, key: slotKey });
        }}
        className={`bg-zinc-900 border rounded-3xl p-5 space-y-3 relative group transition-all ${
          cardDrag ? "border-[#d4af37] bg-[#d4af37]/10 scale-[1.02]" : "border-zinc-800 hover:border-zinc-700"
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files, { section, key: slotKey });
            }
          }}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white block truncate">{title}</span>
          {currentUrl && (
            <button
              onClick={() => copyLink(currentUrl)}
              className="p-1 rounded-md text-zinc-500 hover:text-white transition-colors cursor-pointer"
              title="Copy Image URL"
            >
              {copiedUrl === currentUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          )}
        </div>

        {/* Image Preview & Hover Actions */}
        <div className={`${aspect} rounded-2xl overflow-hidden bg-black relative border border-zinc-800 shadow-md`}>
          {currentUrl ? (
            <img 
              src={currentUrl} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
              No Image Assigned
            </div>
          )}

          {isThisSlotUploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 p-4 text-center z-20">
              <RefreshCw size={24} className="animate-spin text-[#d4af37]" />
              <span className="text-[11px] text-white font-bold">Uploading...</span>
            </div>
          )}

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-3 z-10">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-xl bg-[#d4af37] hover:bg-[#c49f27] text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Camera size={13} />
              <span>Upload New</span>
            </button>

            <button
              onClick={() => setPickerModalSlot({ section, key: slotKey, currentUrl, title })}
              className="w-full py-2 px-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-zinc-700 active:scale-95 transition-all cursor-pointer"
            >
              <FolderOpen size={13} />
              <span>Pick From Library</span>
            </button>
          </div>
        </div>

        {/* Action Buttons underneath for instant access */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-2 px-2.5 rounded-xl bg-zinc-800 hover:bg-[#d4af37] text-zinc-300 hover:text-zinc-950 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-750"
          >
            <Upload size={12} />
            <span>Upload</span>
          </button>
          <button
            onClick={() => setPickerModalSlot({ section, key: slotKey, currentUrl, title })}
            className="py-2 px-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-750"
          >
            <FolderOpen size={12} />
            <span>Choose</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="p-6 md:p-8 rounded-[28px] bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
              <Sparkles size={12} /> Cloudinary Edge CDN
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider">
              ● Connected: jisf5zce
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl md:text-4xl text-white font-light">
            All Website Media <span className="italic text-[#d4af37]">Manager</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed font-light">
            Click <strong>Upload</strong> or <strong>Choose</strong> on any slot below to change photos across every section of your entire website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3.5 py-2 rounded-xl">
              <CheckCircle2 size={14} />
              <span>{saveStatus === "uploaded" ? "Uploaded & Live!" : "Changes Live!"}</span>
            </motion.div>
          )}
          <button
            onClick={() => {
              saveWebsiteMediaCustomization(mediaConfig);
              setSaveStatus("saved");
              setTimeout(() => setSaveStatus(""), 3000);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c49f27] text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Save size={14} />
            <span>Save Changes Live</span>
          </button>
        </div>
      </div>

      {/* Global Cloudinary Upload Box */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragOverGlobal(true); }}
        onDragLeave={() => setDragOverGlobal(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverGlobal(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className={`p-8 rounded-[28px] border-2 border-dashed transition-all text-center relative overflow-hidden ${
          dragOverGlobal 
            ? "border-[#d4af37] bg-[#d4af37]/5 scale-[1.01]" 
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/60"
        }`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*,video/*"
          id="website-file-upload-global" 
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
            {uploading && !uploadingSlot ? <RefreshCw size={28} className="animate-spin" /> : <Upload size={28} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {uploading && !uploadingSlot ? "Uploading to Cloudinary CDN..." : "Upload Any Photo to Media Library"}
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Drag & drop photos here to store them on Cloudinary for use anywhere on the website
            </p>
          </div>

          {uploading && !uploadingSlot ? (
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
              <div 
                className="bg-[#d4af37] h-full transition-all duration-300 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          ) : (
            <label
              htmlFor="website-file-upload-global"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-zinc-700 shadow-md"
            >
              <ImageIcon size={14} />
              <span>Browse Photos</span>
            </label>
          )}
        </div>
      </div>

      {/* Comprehensive Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 overflow-x-auto">
        {[
          { id: "portraits", label: "👰 Portrait Showcase", count: "4 Slots" },
          { id: "hero", label: "🌟 Hero Banner", count: "2 Slots" },
          { id: "bento", label: "🍱 Experience Bento", count: "7 Slots" },
          { id: "scrollShowcase", label: "🎞 Scroll Showcase", count: "3 Slots" },
          { id: "about", label: "📖 About & Legacy", count: "2 Slots" },
          { id: "services", label: "📸 Services & Pricing", count: "6 Slots" },
          { id: "blog", label: "📰 Blog Articles", count: "4 Slots" },
          { id: "offer", label: "🏷 Special Offers", count: "4 Slots" },
          { id: "all_media", label: "📁 Cloudinary Library", count: `${(mediaConfig.mediaList || []).length} Files` }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSectionTab(t.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSectionTab === t.id
                ? "bg-[#d4af37] text-zinc-950 shadow-md shadow-[#d4af37]/20"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            <span>{t.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeSectionTab === t.id ? "bg-zinc-950/20 text-zinc-950" : "bg-zinc-800 text-zinc-400"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* 1. PORTRAIT SHOWCASE CONFIG */}
      {activeSectionTab === "portraits" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>👰</span> 3D Portrait Showcase (4 Interactive Cards)
            </h3>
            <span className="text-xs text-zinc-500 font-light">Hover any card to Upload or Pick from Library</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MediaSlotCard section="portraits" slotKey="portrait1" title="1. The Regal Bride" currentUrl={mediaConfig.sections?.portraits?.portrait1} />
            <MediaSlotCard section="portraits" slotKey="portrait2" title="2. Eternal Journey" currentUrl={mediaConfig.sections?.portraits?.portrait2} />
            <MediaSlotCard section="portraits" slotKey="portrait3" title="3. Whispered Promises" currentUrl={mediaConfig.sections?.portraits?.portrait3} />
            <MediaSlotCard section="portraits" slotKey="portrait4" title="4. Garden Rhapsody" currentUrl={mediaConfig.sections?.portraits?.portrait4} />
          </div>
        </div>
      )}

      {/* 2. HERO BANNER CONFIG */}
      {activeSectionTab === "hero" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🌟</span> Hero Background Cover Photo
            </h3>
            <MediaSlotCard 
              section="hero" 
              slotKey="backgroundImage" 
              title="Homepage Hero Cover" 
              currentUrl={mediaConfig.sections?.hero?.backgroundImage} 
              aspect="aspect-video"
            />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🎥</span> Desktop Cinematic Background Video
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Looping background video on desktop screens for the luxury cinematic experience.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                YouTube Embed or Direct Video URL
              </label>
              <input 
                type="text" 
                value={mediaConfig.sections?.hero?.videoUrl || ""} 
                onChange={(e) => handleAssignImage("hero", "videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPERIENCE BENTO CONFIG */}
      {activeSectionTab === "bento" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🍱</span> Experience Bento Grid (7 Slots)
            </h3>
            <span className="text-xs text-zinc-500 font-light">Hover any card to Upload or Pick</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MediaSlotCard section="experienceBento" slotKey="card1" title="Showcase Card (Right)" currentUrl={mediaConfig.sections?.experienceBento?.card1} aspect="aspect-square" />
            <MediaSlotCard section="experienceBento" slotKey="card2" title="User Avatar 1" currentUrl={mediaConfig.sections?.experienceBento?.card2} aspect="aspect-square" />
            <MediaSlotCard section="experienceBento" slotKey="card3" title="User Avatar 2" currentUrl={mediaConfig.sections?.experienceBento?.card3} aspect="aspect-square" />
            <MediaSlotCard section="experienceBento" slotKey="card4" title="User Avatar 3" currentUrl={mediaConfig.sections?.experienceBento?.card4} aspect="aspect-square" />
            <MediaSlotCard section="experienceBento" slotKey="card5" title="Bento Item 4" currentUrl={mediaConfig.sections?.experienceBento?.card5} aspect="aspect-square" />
            <MediaSlotCard section="experienceBento" slotKey="card6" title="Bento Item 5" currentUrl={mediaConfig.sections?.experienceBento?.card6} aspect="aspect-square" />
            <MediaSlotCard section="experienceBento" slotKey="card7" title="Bento Item 6" currentUrl={mediaConfig.sections?.experienceBento?.card7} aspect="aspect-square" />
          </div>
        </div>
      )}

      {/* 4. SCROLL SHOWCASE */}
      {activeSectionTab === "scrollShowcase" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🎞</span> Horizontal Scroll Showcase (3 Wide Panoramas)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MediaSlotCard section="scrollShowcase" slotKey="scroll1" title="Scroll Card 1" currentUrl={mediaConfig.sections?.scrollShowcase?.scroll1} aspect="aspect-[16/10]" />
            <MediaSlotCard section="scrollShowcase" slotKey="scroll2" title="Scroll Card 2" currentUrl={mediaConfig.sections?.scrollShowcase?.scroll2} aspect="aspect-[16/10]" />
            <MediaSlotCard section="scrollShowcase" slotKey="scroll3" title="Scroll Card 3" currentUrl={mediaConfig.sections?.scrollShowcase?.scroll3} aspect="aspect-[16/10]" />
          </div>
        </div>
      )}

      {/* 5. ABOUT US & FOUNDER */}
      {activeSectionTab === "about" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>📖</span> About Us & Founder Legacy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <MediaSlotCard section="about" slotKey="founderImage" title="About Page Founder Photo" currentUrl={mediaConfig.sections?.about?.founderImage} aspect="aspect-[4/5]" />
            <MediaSlotCard section="about" slotKey="storyImage" title="Secondary Story Photo" currentUrl={mediaConfig.sections?.about?.storyImage} aspect="aspect-[4/5]" />
          </div>
        </div>
      )}

      {/* 6. SERVICES & PRICING */}
      {activeSectionTab === "services" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>📸</span> Photography Packages & Services (6 Slots)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <MediaSlotCard section="services" slotKey="pic1" title="Traditional Weddings" currentUrl={mediaConfig.sections?.services?.pic1} aspect="aspect-[4/5]" />
            <MediaSlotCard section="services" slotKey="pic2" title="Destination Stories" currentUrl={mediaConfig.sections?.services?.pic2} aspect="aspect-[4/5]" />
            <MediaSlotCard section="services" slotKey="pic3" title="Engagement / Pre-wedding" currentUrl={mediaConfig.sections?.services?.pic3} aspect="aspect-[4/5]" />
            <MediaSlotCard section="services" slotKey="pic4" title="Cinematic Highlights" currentUrl={mediaConfig.sections?.services?.pic4} aspect="aspect-[4/5]" />
            <MediaSlotCard section="services" slotKey="fin" title="Grand Finale" currentUrl={mediaConfig.sections?.services?.fin} aspect="aspect-[4/5]" />
            <MediaSlotCard section="services" slotKey="customServiceImg" title="Custom Package Header" currentUrl={mediaConfig.sections?.services?.customServiceImg} aspect="aspect-[4/5]" />
          </div>
        </div>
      )}

      {/* 7. BLOG & ARTICLES */}
      {activeSectionTab === "blog" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>📰</span> Blog Post Covers & Article Media (4 Slots)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MediaSlotCard section="blog" slotKey="post1" title="Blog Post 1 Cover" currentUrl={mediaConfig.sections?.blog?.post1} aspect="aspect-[4/3]" />
            <MediaSlotCard section="blog" slotKey="post2" title="Blog Post 2 Cover" currentUrl={mediaConfig.sections?.blog?.post2} aspect="aspect-[4/3]" />
            <MediaSlotCard section="blog" slotKey="post3" title="Blog Post 3 Cover" currentUrl={mediaConfig.sections?.blog?.post3} aspect="aspect-[4/3]" />
            <MediaSlotCard section="blog" slotKey="post4" title="Blog Post 4 Cover" currentUrl={mediaConfig.sections?.blog?.post4} aspect="aspect-[4/3]" />
          </div>
        </div>
      )}

      {/* 8. SPECIAL OFFERS */}
      {activeSectionTab === "offer" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🏷</span> Trivandrum Wedding Offers (4 Slots)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MediaSlotCard section="offer" slotKey="pic1" title="Offer Showcase 1" currentUrl={mediaConfig.sections?.offer?.pic1} aspect="aspect-[3/4]" />
            <MediaSlotCard section="offer" slotKey="pic2" title="Offer Showcase 2" currentUrl={mediaConfig.sections?.offer?.pic2} aspect="aspect-[3/4]" />
            <MediaSlotCard section="offer" slotKey="pic3" title="Offer Showcase 3" currentUrl={mediaConfig.sections?.offer?.pic3} aspect="aspect-[3/4]" />
            <MediaSlotCard section="offer" slotKey="pic4" title="Offer Showcase 4" currentUrl={mediaConfig.sections?.offer?.pic4} aspect="aspect-[3/4]" />
          </div>
        </div>
      )}

      {/* 9. ALL CLOUDINARY MEDIA LIBRARY */}
      {activeSectionTab === "all_media" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Uploaded Assets ({ (mediaConfig.mediaList || []).length })
            </h3>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search images..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredLibrary.map((item, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-2 group hover:border-[#d4af37]/40 transition-colors">
                <div className="aspect-square rounded-xl overflow-hidden bg-black relative">
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <button
                    onClick={() => copyLink(item.url)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white hover:bg-black transition-colors cursor-pointer"
                    title="Copy CDN Link"
                  >
                    {copiedUrl === item.url ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-white block truncate">{item.filename}</span>
                  <span className="text-[9px] text-zinc-500 font-mono block">
                    {item.format?.toUpperCase()} • {item.width}x{item.height}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Choose from Cloudinary Library */}
      <AnimatePresence>
        {pickerModalSlot && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPickerModalSlot(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Choose Photo from Cloudinary Library</h3>
                  <p className="text-xs text-zinc-400 font-light">Assigning to: <span className="text-[#d4af37] font-semibold">{pickerModalSlot.title}</span></p>
                </div>
                <button 
                  onClick={() => setPickerModalSlot(null)}
                  className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Search uploaded files..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Grid of images */}
              <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-1">
                {filteredLibrary.map((item, idx) => {
                  const isSelected = item.url === pickerModalSlot.currentUrl;
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleAssignImage(pickerModalSlot.section, pickerModalSlot.key, item.url)}
                      className={`aspect-square rounded-xl overflow-hidden bg-black relative border-2 cursor-pointer transition-all group ${
                        isSelected ? "border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-95" : "border-zinc-800 hover:border-[#d4af37]/60"
                      }`}
                    >
                      <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-[#d4af37] text-zinc-950 shadow-md">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-[9px] text-white block truncate">{item.filename}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2 border-t border-zinc-800">
                <button
                  onClick={() => setPickerModalSlot(null)}
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebsiteMediaManager;
