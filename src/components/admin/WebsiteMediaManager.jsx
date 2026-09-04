import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Image as ImageIcon, Check, Copy, RefreshCw, 
  Trash2, ExternalLink, Sparkles, Sliders, Layers, 
  Eye, CheckCircle2, AlertCircle, Save, ArrowUpRight
} from "lucide-react";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUploader";
import { getWebsiteMedia, saveWebsiteMediaCustomization } from "../../data/websiteMedia";

const WebsiteMediaManager = () => {
  const [mediaConfig, setMediaConfig] = useState(() => getWebsiteMedia());
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [activeSectionTab, setActiveSectionTab] = useState("hero"); // hero | bento | portraits | services | all_media
  const [selectedSlot, setSelectedSlot] = useState(null); // { section, key }
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setMediaConfig(getWebsiteMedia());
    window.addEventListener("dreamwed_media_updated", handleUpdate);
    return () => window.removeEventListener("dreamwed_media_updated", handleUpdate);
  }, []);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(10);

    try {
      const newItems = [];
      const newMap = { ...mediaConfig.mediaMap };

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImageToCloudinary(file, (p) => {
          setUploadProgress(Math.round(((i + p / 100) / files.length) * 100));
        });

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

        // If a slot was active, auto-assign
        if (selectedSlot) {
          handleAssignImage(selectedSlot.section, selectedSlot.key, res.url);
          setSelectedSlot(null);
        }
      }

      const updated = {
        ...mediaConfig,
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
  };

  const copyLink = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(""), 2500);
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
            Website Media <span className="italic text-[#d4af37]">Manager</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed font-light">
            Upload and manage images across the entire website. All media is automatically converted to next-gen WebP/AVIF with global CDN delivery.
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

      {/* Cloudinary Drag & Drop Uploader */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className={`p-8 rounded-[28px] border-2 border-dashed transition-all text-center relative overflow-hidden ${
          dragOver 
            ? "border-[#d4af37] bg-[#d4af37]/5 scale-[1.01]" 
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/60"
        }`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*,video/*"
          id="website-file-upload" 
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
            {uploading ? <RefreshCw size={28} className="animate-spin" /> : <Upload size={28} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {uploading ? "Uploading to Cloudinary CDN..." : "Upload New Website Media"}
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Drag & drop high-res images here, or click to browse files
            </p>
          </div>

          {uploading ? (
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
              <div 
                className="bg-[#d4af37] h-full transition-all duration-300 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          ) : (
            <label
              htmlFor="website-file-upload"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-zinc-700 shadow-md"
            >
              <ImageIcon size={14} />
              <span>Browse Images</span>
            </label>
          )}
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 overflow-x-auto">
        {[
          { id: "hero", label: "🌟 Hero Banner", count: "1 Slot" },
          { id: "bento", label: "🍱 Experience Bento", count: "7 Slots" },
          { id: "portraits", label: "👰 Portrait Showcase", count: "4 Slots" },
          { id: "services", label: "📸 Services & Stories", count: "5 Slots" },
          { id: "all_media", label: "📁 Cloudinary Media Library", count: `${(mediaConfig.mediaList || []).length} Files` }
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

      {/* 1. HERO BANNER CONFIG */}
      {activeSectionTab === "hero" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🌟</span> Hero Background Image
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              This high-res cover image appears as the full-screen cinematic background on the homepage.
            </p>

            <div className="aspect-video rounded-2xl overflow-hidden bg-black relative border border-zinc-800 shadow-xl group">
              <img 
                src={mediaConfig.sections?.hero?.backgroundImage || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200"} 
                alt="Hero Cover" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <a 
                  href={mediaConfig.sections?.hero?.backgroundImage} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                  title="View Full Size"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                Custom Cloudinary Image URL
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={mediaConfig.sections?.hero?.backgroundImage || ""} 
                  onChange={(e) => handleAssignImage("hero", "backgroundImage", e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  onClick={() => copyLink(mediaConfig.sections?.hero?.backgroundImage)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all shrink-0"
                >
                  {copiedUrl === mediaConfig.sections?.hero?.backgroundImage ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🎥</span> Desktop Cinematic Loop Video
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

      {/* 2. EXPERIENCE BENTO CONFIG */}
      {activeSectionTab === "bento" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { key: "card1", label: "Bento Card 1 (Right Showcase)", defaultVal: mediaConfig.sections?.experienceBento?.card1 },
            { key: "card2", label: "User Avatar 1", defaultVal: mediaConfig.sections?.experienceBento?.card2 },
            { key: "card3", label: "User Avatar 2", defaultVal: mediaConfig.sections?.experienceBento?.card3 },
            { key: "card4", label: "User Avatar 3", defaultVal: mediaConfig.sections?.experienceBento?.card4 },
          ].map((item) => (
            <div key={item.key} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
              <span className="text-xs font-bold text-white block truncate">{item.label}</span>
              <div className="aspect-square rounded-2xl overflow-hidden bg-black relative border border-zinc-800">
                <img src={item.defaultVal} alt={item.label} className="w-full h-full object-cover" />
              </div>
              <input 
                type="text" 
                value={item.defaultVal || ""} 
                onChange={(e) => handleAssignImage("experienceBento", item.key, e.target.value)}
                placeholder="Cloudinary URL"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-[11px] text-white focus:border-[#d4af37]"
              />
            </div>
          ))}
        </div>
      )}

      {/* 3. PORTRAIT SHOWCASE CONFIG */}
      {activeSectionTab === "portraits" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { key: "portrait1", title: "1. The Regal Bride", defaultVal: mediaConfig.sections?.portraits?.portrait1 },
            { key: "portrait2", title: "2. Eternal Journey", defaultVal: mediaConfig.sections?.portraits?.portrait2 },
            { key: "portrait3", title: "3. Whispered Promises", defaultVal: mediaConfig.sections?.portraits?.portrait3 },
            { key: "portrait4", title: "4. Garden Rhapsody", defaultVal: mediaConfig.sections?.portraits?.portrait4 },
          ].map((p) => (
            <div key={p.key} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
              <span className="text-xs font-bold text-white block truncate">{p.title}</span>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black relative border border-zinc-800 shadow-md">
                <img src={p.defaultVal} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <input 
                type="text" 
                value={p.defaultVal || ""} 
                onChange={(e) => handleAssignImage("portraits", p.key, e.target.value)}
                placeholder="Cloudinary URL"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-[11px] text-white focus:border-[#d4af37]"
              />
            </div>
          ))}
        </div>
      )}

      {/* 4. SERVICES & STORIES */}
      {activeSectionTab === "services" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { key: "pic1", title: "Traditional Weddings", defaultVal: mediaConfig.sections?.services?.pic1 },
            { key: "pic2", title: "Destination Stories", defaultVal: mediaConfig.sections?.services?.pic2 },
            { key: "pic3", title: "Engagement / Pre-wedding", defaultVal: mediaConfig.sections?.services?.pic3 },
            { key: "pic4", title: "Cinematic Highlights", defaultVal: mediaConfig.sections?.services?.pic4 },
            { key: "fin", title: "Grand Finale", defaultVal: mediaConfig.sections?.services?.fin },
          ].map((s) => (
            <div key={s.key} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 space-y-2.5">
              <span className="text-[11px] font-bold text-white block truncate">{s.title}</span>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-black relative border border-zinc-800">
                <img src={s.defaultVal} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <input 
                type="text" 
                value={s.defaultVal || ""} 
                onChange={(e) => handleAssignImage("services", s.key, e.target.value)}
                placeholder="Cloudinary URL"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-[10px] text-white focus:border-[#d4af37]"
              />
            </div>
          ))}
        </div>
      )}

      {/* 5. ALL CLOUDINARY MEDIA LIBRARY */}
      {activeSectionTab === "all_media" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Uploaded Assets ({ (mediaConfig.mediaList || []).length })
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(mediaConfig.mediaList || []).map((item, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-2 group hover:border-[#d4af37]/40 transition-colors">
                <div className="aspect-square rounded-xl overflow-hidden bg-black relative">
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <button
                    onClick={() => copyLink(item.url)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white hover:bg-black transition-colors"
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
    </div>
  );
};

export default WebsiteMediaManager;
