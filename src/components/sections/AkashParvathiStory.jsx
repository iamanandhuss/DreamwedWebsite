import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Heart, 
  MapPin, 
  Sparkles, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  ArrowRight,
  Star,
  Quote
} from "lucide-react";

// All 7 photographs from Akash & Parvathi's Engagement in Trivandrum
const storyPhotos = [
  {
    id: 1,
    src: "/images/stories/akash_parvathi/ring_celebration.jpg",
    title: "The Forever Promise",
    category: "Ring Ceremony",
    desc: "A quiet moment in the heritage corridor as Parvathi displays her diamond engagement ring, tenderly embraced by Akash.",
    camera: "Sony Alpha A7R V • 50mm f/1.2 GM",
    badge: "Featured Moment",
    tag: "Corridor Architecture"
  },
  {
    id: 2,
    src: "/images/stories/akash_parvathi/corridor_walk.jpg",
    title: "A Walk to Forever",
    category: "Hand in Hand",
    desc: "Akash & Parvathi strolling together down the serene white heritage corridor, sharing quiet smiles and loving glances.",
    camera: "Sony Alpha A7R V • 50mm f/1.2 GM",
    badge: "Timeless Stroll",
    tag: "Heritage Walk"
  },
  {
    id: 3,
    src: "/images/stories/akash_parvathi/playful_glance.jpg",
    title: "Playful Romance",
    category: "Candid Expressions",
    desc: "A playful peep and infectious smiles set against lush tropical greenery, celebrating unscripted joy and sweet connection.",
    camera: "Sony Alpha A7R V • 85mm f/1.4 GM",
    badge: "Joyful Connection",
    tag: "Tropical Palms"
  },
  {
    id: 4,
    src: "/images/stories/akash_parvathi/parvathi_portrait.jpg",
    title: "Heritage Elegance",
    category: "Bridal Preparation",
    desc: "Parvathi resplendent in handcrafted temple gold jewelry, intricate jhumkas, and traditional Kerala ivory kasavu couture.",
    camera: "Sony Alpha A7R V • 85mm f/1.4 GM",
    badge: "Traditional Grace",
    tag: "Kasavu & Gold"
  },
  {
    id: 5,
    src: "/images/stories/akash_parvathi/intimate_embrace.jpg",
    title: "Golden Hour Whispers",
    category: "Intimate Portraiture",
    desc: "A gentle touch and quiet glance in the warm Trivandrum sunlight as promises are spoken without words.",
    camera: "Sony Alpha A7R V • 85mm f/1.4 GM",
    badge: "Golden Hour",
    tag: "Intimate Glow"
  },
  {
    id: 6,
    src: "/images/stories/akash_parvathi/outdoor_laughter.jpg",
    title: "Unscripted Joy",
    category: "Candid Moments",
    desc: "Spontaneous laughter echoing among lush tropical palms in Trivandrum — raw, joyful, and authentic love in motion.",
    camera: "Sony Alpha A7R V • 35mm f/1.4 GM",
    badge: "Tropical Greenery",
    tag: "Pure Candid"
  },
  {
    id: 7,
    src: "/images/stories/akash_parvathi/couple_smile.jpg",
    title: "Together Forever",
    category: "Couple Celebration",
    desc: "Two radiant souls with beaming smiles celebrating the beginning of their grandest adventure together.",
    camera: "Sony Alpha A7R V • 50mm f/1.2 GM",
    badge: "Radiant Smiles",
    tag: "Celebration"
  }
];

const AkashParvathiStory = ({ dark = false }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : storyPhotos.length - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev < storyPhotos.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex]);

  // Spotlight photos for Top Row (Walking Stroll, Center Ring Reveal, Playful Peep)
  const spotlightPhotos = [storyPhotos[1], storyPhotos[0], storyPhotos[2]];
  // Detail photos for Bottom Row (Bridal Portrait, Intimate Embrace, Outdoor Laughter, Couple Smiles)
  const detailPhotos = [storyPhotos[3], storyPhotos[4], storyPhotos[5], storyPhotos[6]];

  return (
    <section className={`relative w-full py-20 md:py-28 px-4 sm:px-6 lg:px-12 overflow-hidden ${
      dark 
        ? "bg-[#0a0a0c] text-white border-t border-b border-white/10" 
        : "bg-[#fbfbfa] text-stone-900 border-t border-b border-stone-200/80"
    }`}>
      {/* Background Decorative Blurs */}
      <div className={`absolute top-10 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10 ${
        dark ? "bg-amber-500/10" : "bg-amber-100/40"
      }`} />
      <div className={`absolute bottom-10 left-10 w-80 h-80 rounded-full blur-3xl pointer-events-none -z-10 ${
        dark ? "bg-zinc-800/30" : "bg-stone-200/50"
      }`} />

      <div className="max-w-7xl mx-auto">
        {/* ========================================================================= */}
        {/* SECTION HEADER: TITLE, NAMES & STORY DETAILS */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl">
            {/* Tag Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-4 ${
              dark 
                ? "bg-white/5 border border-white/10 text-[#d1a852]" 
                : "bg-[#ececea] border border-[#dcdcd8] text-[#5d665f]"
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#b4975a]" />
              <span>Real Engagement Story • Trivandrum</span>
            </div>

            {/* Couple Names */}
            <h2 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-normal tracking-tight leading-[1.05] ${
                dark ? "text-white" : "text-stone-900"
              }`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Akash <span className="font-light italic text-[#b4975a]">&</span> Parvathi
            </h2>

            <p className={`mt-4 text-base md:text-lg font-light leading-relaxed max-w-xl ${
              dark ? "text-zinc-400" : "text-stone-600"
            }`}>
              An unforgettable engagement celebration amidst the heritage charm of Trivandrum, Kerala. Handcrafted kasavu traditions, spontaneous laughter, and timeless corridor promises captured in 7 candid frames.
            </p>
          </div>

          {/* Details Metadata Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto">
            <div className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-center ${
              dark ? "bg-zinc-900/80 border-white/10" : "bg-white border-stone-200"
            }`}>
              <div className="flex items-center gap-1.5 text-[#b4975a] text-xs font-semibold uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location</span>
              </div>
              <p className={`font-medium text-sm md:text-base ${dark ? "text-white" : "text-stone-900"}`}>
                Trivandrum, Kerala
              </p>
            </div>

            <div className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-center ${
              dark ? "bg-zinc-900/80 border-white/10" : "bg-white border-stone-200"
            }`}>
              <div className="flex items-center gap-1.5 text-[#b4975a] text-xs font-semibold uppercase tracking-wider mb-1">
                <Heart className="w-3.5 h-3.5" />
                <span>Celebration</span>
              </div>
              <p className={`font-medium text-sm md:text-base ${dark ? "text-white" : "text-stone-900"}`}>
                Engagement Ceremony
              </p>
            </div>

            <div className={`col-span-2 sm:col-span-1 p-4 rounded-2xl border shadow-sm flex flex-col justify-center ${
              dark ? "bg-zinc-900/80 border-white/10" : "bg-white border-stone-200"
            }`}>
              <div className="flex items-center gap-1.5 text-[#b4975a] text-xs font-semibold uppercase tracking-wider mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Collection</span>
              </div>
              <p className={`font-medium text-sm md:text-base ${dark ? "text-white" : "text-stone-900"}`}>
                7 Moments Captured
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP EDITORIAL MAGAZINE SPREAD (7 PHOTOS: 3 SPOTLIGHT + 4 DETAILS) */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex flex-col gap-6">
          {/* ROW 1: 3 SPOTLIGHT CARDS (Walk Stroll, Center Ring Reveal, Playful Peep) */}
          <div className="grid grid-cols-3 gap-5 items-stretch">
            {spotlightPhotos.map((photo) => {
              const actualIdx = storyPhotos.findIndex((p) => p.id === photo.id);
              const isCenterHero = photo.id === 1; // Ring ceremony
              return (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(actualIdx)}
                  className={`group relative rounded-2xl xl:rounded-3xl overflow-hidden cursor-pointer border transition-all duration-500 flex flex-col justify-end aspect-[3/4.2] ${
                    dark ? "bg-zinc-900" : "bg-stone-100"
                  } ${
                    isCenterHero 
                      ? "border-[#b4975a]/70 shadow-xl hover:shadow-2xl ring-2 ring-[#b4975a]/25 scale-[1.02]" 
                      : `${dark ? "border-white/10" : "border-stone-200"} shadow-sm hover:shadow-xl hover:-translate-y-1.5`
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm ${
                      isCenterHero 
                        ? "bg-[#b4975a] text-white" 
                        : "bg-white/90 backdrop-blur-md text-stone-900"
                    }`}>
                      {photo.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Bottom Caption */}
                  <div className="relative p-5 xl:p-6 text-white z-10">
                    <span className="text-[11px] uppercase tracking-widest text-[#d8c393] font-medium block mb-1">
                      {photo.category}
                    </span>
                    <h4 
                      className="text-2xl font-normal leading-tight mb-1 text-white group-hover:text-amber-100 transition-colors"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {photo.title}
                    </h4>
                    <p className="text-xs text-stone-300 font-light line-clamp-2 leading-relaxed mb-3">
                      {photo.desc}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-white/15 pt-2.5">
                      <span className="truncate">{photo.tag}</span>
                      <span className="text-[#b4975a] font-medium flex items-center gap-1">
                        View Photo <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ROW 2: 4 EDITORIAL DETAIL CARDS (Bridal, Intimate, Greenery Laughter, Radiant Smiles) */}
          <div className="grid grid-cols-4 gap-5 items-stretch">
            {detailPhotos.map((photo) => {
              const actualIdx = storyPhotos.findIndex((p) => p.id === photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(actualIdx)}
                  className={`group relative rounded-2xl xl:rounded-3xl overflow-hidden cursor-pointer border shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-end aspect-[3/4.2] ${
                    dark ? "bg-zinc-900 border-white/10" : "bg-stone-100 border-stone-200"
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                      photo.id === 6 ? "object-[center_15%]" : "object-top"
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm bg-white/90 backdrop-blur-md text-stone-900">
                      {photo.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="relative p-5 text-white z-10">
                    <span className="text-[10px] uppercase tracking-widest text-[#d8c393] font-medium block mb-1">
                      {photo.category}
                    </span>
                    <h4 
                      className="text-xl font-normal leading-tight mb-1 text-white group-hover:text-amber-100 transition-colors"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {photo.title}
                    </h4>
                    <p className="text-xs text-stone-300 font-light line-clamp-2 leading-relaxed mb-3">
                      {photo.desc}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-stone-400 border-t border-white/15 pt-2">
                      <span className="truncate">{photo.tag}</span>
                      <span className="text-[#b4975a] font-medium flex items-center gap-1">
                        View Photo <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TABLET LAYOUT (768px - 1023px: 3 CARDS TOP + 4 CARDS BELOW) */}
        {/* ========================================================================= */}
        <div className="hidden md:flex lg:hidden flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {spotlightPhotos.map((photo) => {
              const actualIdx = storyPhotos.findIndex((p) => p.id === photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(actualIdx)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-end aspect-[3/4] ${
                    dark ? "bg-zinc-900 border-white/10" : "bg-stone-100 border-stone-200"
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] font-bold uppercase rounded-full">
                      {photo.badge}
                    </span>
                  </div>
                  <div className="relative p-4 text-white z-10">
                    <p className="text-[10px] uppercase tracking-wider text-[#d8c393] font-medium">
                      {photo.category}
                    </p>
                    <h4 className="text-lg font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {photo.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {detailPhotos.map((photo) => {
              const actualIdx = storyPhotos.findIndex((p) => p.id === photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(actualIdx)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-end aspect-[4/3] ${
                    dark ? "bg-zinc-900 border-white/10" : "bg-stone-100 border-stone-200"
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] font-bold uppercase rounded-full">
                      {photo.badge}
                    </span>
                  </div>
                  <div className="relative p-4 text-white z-10">
                    <p className="text-[10px] uppercase tracking-wider text-[#d8c393] font-medium">
                      {photo.category}
                    </p>
                    <h4 className="text-lg font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {photo.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE LAYOUT (<768px: RESPONSIVE CARDS & TAP-TO-VIEW COLLAGE) */}
        {/* ========================================================================= */}
        <div className="md:hidden flex flex-col gap-4">
          {/* Mobile Featured Ring Hero Card */}
          <div
            onClick={() => setLightboxIndex(0)}
            className={`relative rounded-2xl overflow-hidden aspect-[4/5] border-2 border-[#b4975a]/50 shadow-md cursor-pointer active:scale-[0.99] transition-transform ${
              dark ? "bg-zinc-900" : "bg-stone-100"
            }`}
          >
            <img
              src={storyPhotos[0].src}
              alt={storyPhotos[0].title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-[#b4975a] text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow">
                Featured Moment
              </span>
            </div>
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-5 text-white">
              <p className="text-[11px] uppercase tracking-wider text-[#d8c393] font-medium">
                {storyPhotos[0].category}
              </p>
              <h3 className="text-2xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {storyPhotos[0].title}
              </h3>
              <p className="text-xs text-stone-200 mt-1 line-clamp-2 font-light">
                {storyPhotos[0].desc}
              </p>
            </div>
          </div>

          {/* 2-Column Grid for Remaining 6 Photos */}
          <div className="grid grid-cols-2 gap-3">
            {storyPhotos.slice(1).map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(idx + 1)}
                className={`relative rounded-xl overflow-hidden aspect-[3/4] border shadow-sm cursor-pointer active:scale-[0.98] transition-transform ${
                  dark ? "bg-zinc-900 border-white/10" : "bg-stone-100 border-stone-200"
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className={`w-full h-full object-cover ${
                    photo.id === 6 ? "object-[center_15%]" : "object-top"
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-stone-900 text-[9px] font-semibold uppercase tracking-wider rounded-full">
                    {photo.badge}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 text-white">
                  <h5 className="text-sm font-medium leading-tight truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {photo.title}
                  </h5>
                  <p className="text-[10px] text-[#e0cfab] truncate">
                    {photo.category}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tap hint for mobile */}
          <p className={`text-center text-xs italic ${dark ? "text-zinc-500" : "text-stone-400"}`}>
            Tap any photo to view full-screen gallery (7 moments)
          </p>
        </div>

        {/* ========================================================================= */}
        {/* COUPLE QUOTE & CTA BAR */}
        {/* ========================================================================= */}
        <div className={`mt-10 md:mt-14 p-6 md:p-8 rounded-2xl md:rounded-3xl border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 ${
          dark ? "bg-zinc-900/70 border-white/10" : "bg-white border-stone-200/90"
        }`}>
          <div className="flex items-start sm:items-center gap-4 text-left">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              dark 
                ? "bg-amber-950/40 border border-amber-500/20 text-[#d1a852]" 
                : "bg-amber-50 border border-amber-200/60 text-[#b4975a]"
            }`}>
              <Quote className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className={`text-xs ml-1 font-medium ${dark ? "text-zinc-400" : "text-stone-400"}`}>
                  5.0 Star Engagement Experience
                </span>
              </div>
              <p className={`text-sm md:text-base font-normal italic ${dark ? "text-zinc-200" : "text-stone-800"}`}>
                “Dreamwed captured our authentic smiles, the sacred temple jewels, and the laughter under the Trivandrum palms effortlessly.”
              </p>
              <p className={`text-xs mt-1 uppercase tracking-wider ${dark ? "text-zinc-500" : "text-stone-400"}`}>
                — Akash & Parvathi, Trivandrum Engagement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              to="/contact"
              className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all shadow-sm hover:shadow ${
                dark 
                  ? "bg-[#b4975a] text-black hover:bg-[#c5a767] font-semibold" 
                  : "bg-stone-900 text-white hover:bg-stone-800"
              }`}
            >
              <span>Book Your Shoot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/packages"
              className={`flex-1 lg:flex-none inline-flex items-center justify-center px-5 py-3.5 rounded-full text-sm font-medium transition-all ${
                dark 
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/10" 
                  : "bg-stone-100 hover:bg-stone-200 text-stone-800"
              }`}
            >
              View Packages
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN INTERACTIVE LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 md:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Bar */}
            <div 
              className="flex items-center justify-between text-white z-20 max-w-6xl mx-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <span className="text-[#b4975a] text-xs uppercase tracking-widest font-semibold block">
                  Trivandrum Engagement Story
                </span>
                <h3 className="text-lg md:text-2xl font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Akash & Parvathi • {storyPhotos[lightboxIndex].title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-stone-400 text-xs md:text-sm font-mono tracking-wider">
                  {lightboxIndex + 1} / {storyPhotos.length}
                </span>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                  title="Close gallery (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Stage (Image Display + Arrows) */}
            <div 
              className="relative flex-1 flex items-center justify-center my-3 overflow-hidden max-w-6xl mx-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev > 0 ? prev - 1 : storyPhotos.length - 1));
                }}
                className="absolute left-1 sm:left-4 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
                title="Previous photo (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Active Image */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative max-w-4xl max-h-[72vh] flex items-center justify-center"
              >
                <img
                  src={storyPhotos[lightboxIndex].src}
                  alt={storyPhotos[lightboxIndex].title}
                  className="max-h-[72vh] max-w-full w-auto object-contain rounded-xl shadow-2xl border border-white/10"
                />
              </motion.div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev < storyPhotos.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-1 sm:right-4 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
                title="Next photo (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Bar (Caption & Thumbnails) */}
            <div 
              className="flex flex-col md:flex-row items-center justify-between gap-4 z-20 max-w-6xl mx-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center md:text-left text-white max-w-md">
                <p className="text-xs uppercase tracking-widest text-[#d8c393] font-medium">
                  {storyPhotos[lightboxIndex].category}
                </p>
                <p className="text-xs md:text-sm text-stone-300 font-light mt-0.5">
                  {storyPhotos[lightboxIndex].desc}
                </p>
              </div>

              {/* Thumbnail Strip (All 7 Photos) */}
              <div className="flex items-center gap-2 overflow-x-auto py-1.5 px-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-md max-w-full">
                {storyPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      lightboxIndex === idx
                        ? "border-[#b4975a] scale-105 shadow-md ring-2 ring-[#b4975a]/50"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AkashParvathiStory;
