import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Gift, Sparkles, Heart, Tag, Camera, Plane, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

const weddingPlans = [
  {
    shareId: "pkgWeddingBasicCard",
    title: "Wedding Photography",
    price: "₹39,999",
    tag: "+ LIMITED TIME OFFER",
    modalTag: "Essential",
    subtitle: "ESSENTIAL SINGLE-SIDE",
    preweddingOffer: "FREE PRE-WEDDING PHOTO (WORTH ₹12,000)",
    desc: "Our highly sought-after single-side coverage package. Designed to capture every detail of your celebrations with elite creative precision and beautiful physical heirlooms.",
    setup: "1 Photographer + 1 Videographer",
    images: ["/uploaded_bride_yellow.jpg", "/athulraj.jpg", "/anandha_lekshmi.jpg"],
    features: [
      "Wedding Reception Photography",
      "Wedding Reception Videography",
      "Wedding Day Photography",
      "Wedding Day Videography",
      "One 70 Pages Premium Album",
      "Highlights Video",
      "Full HD Wedding Video",
      "Wedding Reel",
      "1 Photographer Setup",
      "1 Videographer Setup",
      "1 Calendar",
      "1 Pen Drive",
      "2 Wall Frames",
      "Edited Photos & High-speed Pendrive"
    ]
  },
  {
    shareId: "pkgWeddingPreCard",
    title: "Wedding Photo & Pre-Wedding",
    price: "₹54,999",
    tag: "+ FREE PRE-WEDDING PHOTO & VIDEO (LIMITED TIME)",
    modalTag: "Premium",
    subtitle: "PRE-WEDDING & PHOTO",
    preweddingOffer: "FREE PRE-WEDDING PHOTO & VIDEO (WORTH ₹15,000)",
    desc: "Perfect for capturing your beautiful pre-wedding love story and the complete wedding day celebrations. Includes comprehensive coverage and professional deliverables.",
    setup: "1 Photographer + 1 Videographer",
    images: ["/couple_fun_glasses.jpg", "/uploaded_couple_blackwhite.jpg", "/kochi_couple_carry.jpg"],
    features: [
      "Pre-Wedding Photo + Video (Save The Date)",
      "Wedding Reception Photography",
      "Wedding Reception Videography",
      "Wedding Day Photography",
      "Wedding Day Videography",
      "One 80 Pages Premium Album",
      "80 Pages Mini Album",
      "Highlights Video",
      "Full HD Wedding Video",
      "Wedding Reel",
      "1 Photographer Setup",
      "1 Videographer Setup",
      "1 Calendar",
      "1 Pen Drive",
      "2 Wall Frames",
      "Edited Photos & High-speed Pendrive"
    ]
  },
  {
    shareId: "pkgCandidCard",
    title: "Candid Photo & Videography",
    price: "₹69,999",
    tag: "+ LIMITED TIME OFFER",
    modalTag: "Signature",
    subtitle: "ARTISTIC CANDID SHOTS",
    preweddingOffer: "FREE PHOTO CALENDAR + 1 WALL FRAME",
    desc: "Our creative 3-camera setup featuring dedicated candid photography. Ideal for couples who want artistic, natural, and unstaged storytelling of their special day.",
    setup: "1 Photographer + 1 Candid Photographer + 1 Videographer",
    images: ["/uploaded_bride_traditional.jpg", "/uploaded_bride_gold.jpg", "/chindu.jpg"],
    features: [
      "Pre-Wedding Photo + Video (Save The Date)",
      "Wedding Reception Photography",
      "Wedding Reception Videography",
      "Wedding Day Photography",
      "Wedding Day Candid-Photography",
      "Wedding Day Videography",
      "One 80 Pages Premium Album",
      "80 Pages Mini Album",
      "Highlights Video",
      "Full HD Wedding Video",
      "Wedding Reel",
      "1 Photographer Setup",
      "1 Candid Photographer Setup",
      "1 Videographer Setup",
      "1 Calendar",
      "1 Pen Drive",
      "2 Wall Frames",
      "Edited Photos & High-speed Pendrive"
    ]
  },
  {
    shareId: "pkgLuxuryCard",
    title: "Bride & Groom Luxury Package",
    price: "₹1,10,000",
    tag: "+ LIMITED TIME OFFER",
    modalTag: "Signature Luxury",
    subtitle: "4-CAMERA DUAL-SIDE LUXURY COVERAGE",
    preweddingOffer: "FREE DRONE + PREMIUM CUSTOM ALBUM BOX",
    desc: "Our ultimate dual-side wedding collection. Features comprehensive coverage, drone photography, and physical custom boxes for your handcrafted albums.",
    setup: "2 Photographers + 2 Videographers + Drone + Custom Album Box",
    images: ["/bride_christian_white.jpg", "/uploaded_couple_blackwhite.jpg", "/kochi_couple_carry.jpg"],
    features: [
      "Pre-Wedding Photography & Videography (Save the Date)",
      "Wedding & Reception Photography (Dual-side)",
      "Wedding & Reception Videography (Dual-side)",
      "Wedding Candid Photography & Videography",
      "Helicam (Drone) Aerial Coverage",
      "One 80-Pages Premium Album with Handcrafted Album Box",
      "One 80-Pages Mini Album",
      "Cinematic Highlights Film & Instagram Reels",
      "Full HD Wedding Video Film",
      "2 Premium Wall Frames",
      "1 Customized Photo Calendar",
      "1 High-Speed USB Pen Drive",
      "Edited Photos & High-speed Pendrive"
    ]
  }
];

const weddingStandalonePlans = [
  {
    shareId: "pkgWeddingStandaloneDay",
    title: "Standalone Wedding Day",
    price: "₹39,999",
    tag: "Wedding Day Only",
    modalTag: "Standalone",
    subtitle: "8-HOUR WEDDING DAY ONLY",
    preweddingOffer: "FREE COMPLIMENTARY DESKTOP CALENDAR",
    desc: "Dedicated professional photography & videography team for your wedding ceremony day coverage.",
    setup: "1 Photographer + 1 Videographer Team",
    images: ["/uploaded_couple_blackwhite.jpg"],
    features: [
      "Professional Photo & Video Team",
      "Up to 8 Hours Event Coverage",
      "Premium 70-Page Layflat Album",
      "Full HD Video Film + Reels",
      "Edited Photos & High-speed Pendrive"
    ]
  },
  {
    shareId: "pkgWeddingStandaloneReception",
    title: "Standalone Reception",
    price: "₹19,999",
    tag: "Reception Only",
    modalTag: "Standalone",
    subtitle: "5-HOUR RECEPTION DAY ONLY",
    preweddingOffer: "FREE COMPLIMENTARY DESKTOP CALENDAR",
    desc: "Sleek professional photo & video coverage optimized for your grand reception event.",
    setup: "1 Photographer + 1 Videographer Team",
    images: ["/kochi_couple.jpg"],
    features: [
      "Professional Photo & Video Team",
      "Up to 5 Hours Reception Coverage",
      "Premium 50-Page Layflat Album",
      "Full HD Video Film + Highlights",
      "Edited Photos & High-speed Pendrive"
    ]
  }
];

const engagementPlans = [
  {
    shareId: "pkgEngagementBasicCard",
    title: "Engagement Photography",
    price: "₹12,000",
    tag: "Photo Only",
    modalTag: "Essential Engagement",
    subtitle: "ESSENTIAL SINGLE-SIDE",
    preweddingOffer: "FREE HIGH-RES DIGITAL ALBUM ACCESS",
    desc: "Dedicated candid & traditional photographer coverage for your engagement ceremony.",
    setup: "1 Dedicated Photographer",
    images: ["/uploaded_bride_yellow.jpg"],
    features: [
      "Dedicated Candid & Traditional Photographer",
      "4 Hours Coverage",
      "Edited High-Res Photos"
    ]
  },
  {
    shareId: "pkgEngagementPreCard",
    title: "Bride or Groom Engagement Package",
    price: "₹28,999",
    tag: "Single-Side Photo + Video + Album",
    modalTag: "Standard Engagement",
    subtitle: "COMPLETE SINGLE-SIDE COVERAGE",
    preweddingOffer: "FREE TABLETOP CALENDAR + 2 WALL FRAMES",
    desc: "Our complete single-side engagement package including cinematic video, premium layflat album, and creative reels.",
    setup: "1 Photographer + 1 Videographer",
    images: ["/couple_fun_glasses.jpg"],
    features: [
      "1 Photographer + 1 Videographer",
      "4 Hours Full Event Coverage",
      "Edited High-Res Photos",
      "Premium Layflat Panoramic Album (50 Pages)",
      "Cinematic Engagement Reel",
      "Engagement Full HD Video",
      "1 Tabletop Calendar",
      "2 Premium Photo Frames",
      "1 USB Pen Drive"
    ]
  },
  {
    shareId: "pkgPremiumCandidCard",
    title: "Premium Candid Package",
    price: "₹79,999",
    tag: "Ultimate Engagement Coverage",
    modalTag: "Premium Engagement",
    subtitle: "4-CAMERA DUAL-SIDE & HELICAM",
    preweddingOffer: "FREE DRONE AERIAL COVERAGE + MINI ALBUM",
    desc: "Our ultimate premium engagement coverage. Designed for couples seeking elite dual-side candid & traditional coverage with aerial drone views and premium handcrafted dual-side albums.",
    setup: "1 Candid Photo + 1 Candid Video + 1 Traditional Photo + 1 Traditional Video + Drone",
    images: ["/couple_traditional_red.jpg", "/deepak.jpg", "/anandha_lekshmi.jpg"],
    isSpecial: true,
    features: [
      "Engagement Day Candid Photography",
      "Engagement Day Candid Videography",
      "Engagement Day Traditional Photography",
      "Engagement Day Traditional Videography",
      "Helicam (Drone) Aerial Coverage",
      "1 Premium 80-Page Album for Groom (with Complimentary Mini Album)",
      "1 Premium 80-Page Album for Bride (with Complimentary Mini Album)",
      "Highlights Video Film",
      "Full HD Engagement Video",
      "Engagement Reels",
      "1 Tabletop Calendar",
      "1 USB Pen Drive",
      "2 Premium Photo Frames",
      "Edited Photos & High-speed Pendrive"
    ]
  }
];

const haldiPlans = [
  {
    shareId: "pkgHaldiBasicCard",
    title: "Haldi Photography (Only)",
    price: "₹10,000",
    tag: "Photo Only",
    modalTag: "Essential Haldi",
    subtitle: "ESSENTIAL HALDI COVERAGE",
    preweddingOffer: "FREE HIGH-RES DIGITAL ACCESS",
    desc: "Dedicated single photographer capturing the vibrant colors and joy of your Haldi ceremony.",
    setup: "1 Photographer",
    images: ["/athulraj.jpg"],
    features: [
      "Dedicated Candid & Traditional Photographer",
      "4 Hours Coverage",
      "Edited High-Res Photos"
    ]
  },
  {
    shareId: "pkgHaldiAlbumCard",
    title: "Haldi Photography with Album",
    price: "₹15,000",
    tag: "Photo + Album",
    modalTag: "Standard Haldi",
    subtitle: "HALDI WITH HEIRLOOM",
    preweddingOffer: "FREE COMPLIMENTARY WALL FRAME",
    desc: "Premium Haldi photography including a beautifully printed customized layflat panoramic album.",
    setup: "1 Photographer + Premium Album",
    images: ["/anandha_lekshmi.jpg"],
    features: [
      "Dedicated Candid & Traditional Photographer",
      "4 Hours Coverage",
      "Edited High-Res Photos",
      "Custom Layflat Panoramic Album (30 Pages)"
    ]
  },
  {
    shareId: "pkgHaldiPhotoVideoCard",
    title: "Haldi Photo & Videography",
    price: "₹28,000",
    tag: "Complete Coverage",
    modalTag: "Premium Haldi",
    subtitle: "HALDI PHOTO + VIDEO",
    preweddingOffer: "FREE HALDI TEASER HIGHLIGHT REEL",
    desc: "Full-spectrum cinematic and traditional coverage of your Haldi celebrations.",
    setup: "1 Photographer + 1 Videographer",
    images: ["/kochi_couple.jpg"],
    features: [
      "1 Photographer + 1 Videographer",
      "4 Hours Full Haldi Coverage",
      "Edited High-Res Photos",
      "Cinematic Haldi Highlight Reel",
      "Full HD Event Video Film"
    ]
  }
];

const addOnPlans = [
  {
    shareId: "addonLedWall",
    title: "LED Wall Setup",
    price: "₹14,999",
    tag: "Receptions & Events",
    desc: "Massive high-definition modular LED screen setup for receptions, displaying live feeds and cinematic videos for your guests.",
    details: "Single 8x10ft high-density LED screen with live mixer setup."
  },
  {
    shareId: "addonLiveStream",
    title: "Live Streaming Service",
    price: "₹12,000",
    tag: "Global Broadcast",
    desc: "Multi-camera YouTube live streaming of your wedding ceremony in full HD, allowing remote family and friends to join in real-time.",
    details: "High-stability broadcast link with overlay graphics."
  },
  {
    shareId: "addonDrone",
    title: "Aerial Drone (Helicam) Coverage",
    price: "₹8,000",
    tag: "Cinematic Drone",
    desc: "Stunning 4K aerial drone coverage of your venue, entrance, and outdoor shoots for breathtaking grand perspectives.",
    details: "Licensed operator, full day event coverage."
  },
  {
    shareId: "addonPreWedding",
    title: "Cinematic Pre-Wedding Shoot",
    price: "₹9,999",
    tag: "Save The Date",
    desc: "A romantic cinematic pre-wedding photo and video session at your choice of location, including edited teaser film.",
    details: "Full day shoot, cinematic output."
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1, 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    },
  }),
};

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likedPlans, setLikedPlans] = useState({});
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 56 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 14, seconds: 56 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleLike = (e, planId) => {
    e.stopPropagation();
    setLikedPlans((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActivePlan(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (activePlan === null) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [activePlan]);

  const handleShare = (e, plan) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/${plan.shareId}.html`;
    const featuresList = plan.features ? plan.features.slice(0, 5).map(f => `• ${f}`).join('\n') : "";
    const message = `📸 *DREAMWED STORIES — Premium Package* \n\n` +
                    `📦 *${plan.title}* (${plan.subtitle || ''})\n` +
                    `💰 *Price:* ${plan.price} Net\n` +
                    (plan.setup ? `⚙️ *Setup:* ${plan.setup}\n\n` : `\n`) +
                    `🎁 *EXCLUSIVE OFFER:* \n` +
                    `⭐ ${plan.tag || plan.preweddingOffer}\n\n` +
                    (featuresList ? `📜 *Key Inclusions:* \n${featuresList}\n\n` : '') +
                    `Explore details, custom add-ons & our actual wedding work portfolio here:\n` +
                    `🔗 ${shareUrl}`;
                    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pkgParam = params.get("pkg");
    if (pkgParam !== null) {
      const allPlans = [...weddingPlans, ...weddingStandalonePlans, ...engagementPlans, ...haldiPlans];
      const matchedPlan = allPlans.find(p => p.shareId === pkgParam);
      if (matchedPlan) {
        setActivePlan(matchedPlan);
        setTimeout(() => {
          const element = document.getElementById("pricing-grid-container");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    }
  }, []);

  const renderCard = (plan, isGridOfFour = false) => {
    const isSpecial = plan.isSpecial || false;
    
    const getSplitTitle = (title) => {
      if (title === "Wedding Photography") return ["Wedding", "Photography"];
      if (title === "Wedding Photo & Pre-Wedding") return ["Wedding Photo &", "Pre-Wedding"];
      if (title === "Candid Photo & Videography") return ["Candid Photo &", "Videography"];
      if (title === "Premium Candid Package") return ["Premium Candid", "Package"];
      if (title === "Bride & Groom Luxury Package") return ["Bride & Groom", "Luxury Package"];
      if (title === "Bride or Groom Engagement Package") return ["Bride or Groom", "Engagement Package"];
      return [title, ""];
    };

    const [titleLine1, titleLine2] = getSplitTitle(plan.title);

    return (
      <motion.div
        key={plan.shareId}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        onClick={() => {
          setActivePlan(plan);
          setCurrentSlide(0);
        }}
        className={`relative rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col transition-all duration-700 ease-[0.22, 1, 0.36, 1] group cursor-pointer hover:scale-[1.02] ${
          isSpecial 
            ? "border-[3px] border-[#d1a852] shadow-[0_0_35px_rgba(209,168,82,0.3),_0_20px_50px_rgba(0,0,0,0.4)]" 
            : "border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
        } aspect-[9/17.2] min-h-[580px] md:min-h-[640px] ${isGridOfFour ? "w-full" : ""}`}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={plan.images[0]}
            alt={plan.title}
            style={{ objectPosition: "center 30%" }}
            className="w-full h-full object-cover transition-transform duration-1000 ease-[0.16, 1, 0.3, 1] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-black/95 z-10 pointer-events-none" />
        </div>

        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
          <div className={`px-3.5 py-1.5 rounded-full text-[8.5px] font-extrabold tracking-widest uppercase flex items-center gap-1 backdrop-blur-md transition-all duration-300 ${
            isSpecial 
              ? "bg-gradient-to-r from-[#d1a852] to-[#b8903b] text-black border border-[#d1a852] shadow-[0_0_15px_rgba(209,168,82,0.45)]" 
              : "bg-black/50 border border-[#d1a852]/35 text-[#d1a852] shadow-[0_0_10px_rgba(209,168,82,0.2)]"
          }`}>
            {plan.tag}
          </div>

          <button
            onClick={(e) => toggleLike(e, plan.shareId)}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
            title="Add to wishlist"
          >
            <Heart
              size={16}
              className={`transition-colors duration-300 ${likedPlans[plan.shareId] ? "fill-red-500 stroke-red-500" : "stroke-white"}`}
            />
          </button>
        </div>

        <div className={`absolute ${isSpecial ? "top-[150px]" : "top-20"} left-0 right-0 z-20 text-center flex items-center justify-center gap-1.5 text-[8.5px] font-bold tracking-[0.2em] text-white/50 group-hover:text-white/90 transition-colors duration-300`}>
          <span className="text-amber-400">✈</span> CLICK FOR PHOTOS & DETAILS
        </div>

        {isSpecial && (
          <div className="absolute top-[70px] left-6 right-6 z-20 bg-black/80 border border-[#d1a852]/50 backdrop-blur-md px-3.5 py-2.5 rounded-2xl text-center space-y-1.5 shadow-[0_0_25px_rgba(209,168,82,0.25)]">
            <div className="flex items-center justify-center gap-1.5 text-[#d1a852] text-[8.5px] font-black tracking-[0.15em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
              <span>🔥 Special limited offer</span>
            </div>
            <div className="text-white font-mono text-[9px] font-bold tracking-widest flex items-center justify-center gap-1">
              <span className="opacity-75">⏳ Closes in:</span>
              <span className="text-[#d1a852] bg-white/5 border border-white/10 px-1 py-0.5 rounded">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="text-[#d1a852] bg-white/5 border border-white/10 px-1 py-0.5 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="text-[#d1a852] bg-white/5 border border-white/10 px-1 py-0.5 rounded animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full justify-end p-6 md:p-8 mt-auto select-none">
          <h3 className="text-[26px] sm:text-[28px] md:text-[32px] leading-tight font-serif text-white font-light text-center mb-1">
            {titleLine1}
            {titleLine2 && <span className="block mt-0.5">{titleLine2}</span>}
          </h3>

          <p className="text-[#d1a852] text-[9.5px] md:text-[10px] tracking-[0.2em] font-semibold uppercase text-center mb-3">
            {plan.subtitle}
          </p>

          <p className="text-zinc-400 text-[11px] md:text-[12px] font-light text-center max-w-[255px] mx-auto mb-4 line-clamp-2 leading-relaxed">
            {plan.desc}
          </p>

          {plan.preweddingOffer && (
            <div className="mb-4 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d1a852]/12 via-[#d1a852]/3 to-transparent border border-[#d1a852]/30 backdrop-blur-md flex items-center justify-center gap-1.5 max-w-[260px] mx-auto shadow-[0_0_15px_rgba(209,168,82,0.08)]">
              <Sparkles size={10} className="text-[#d1a852] animate-pulse flex-shrink-0" />
              <span className="text-[#d1a852] text-[8.5px] font-bold tracking-[0.12em] uppercase text-center leading-tight">
                {plan.preweddingOffer}
              </span>
            </div>
          )}

          {/* Standalone Value Proposition Badge */}
          {plan.shareId.startsWith("pkgWedding") && !plan.shareId.includes("Standalone") && (
            <div className="mb-4 text-center select-none">
              <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] font-medium text-zinc-350">
                <span className="text-[#d1a852] font-bold">Total Value:</span>
                <span>
                  {plan.shareId === "pkgWeddingBasicCard" ? "₹71,998" : 
                   plan.shareId === "pkgWeddingPreCard" ? "₹74,998" : 
                   plan.shareId === "pkgCandidCard" ? "₹89,998" : "₹1,24,998"}
                </span>
                <span className="text-zinc-500">|</span>
                <span className="text-emerald-400 font-bold">
                  {plan.shareId === "pkgWeddingBasicCard" ? "Save 44%" : 
                   plan.shareId === "pkgWeddingPreCard" ? "Save 27%" : 
                   plan.shareId === "pkgCandidCard" ? "Save 22%" : "Save 12%"}
                </span>
              </span>
            </div>
          )}

          {isSpecial && (
            <div className="mb-4 max-w-[240px] mx-auto w-full space-y-1.5 bg-black/45 border border-white/10 p-3 rounded-2xl backdrop-blur-md shadow-lg">
              <div className="flex justify-between text-[8px] font-black tracking-widest uppercase">
                <span className="text-zinc-400">SLOTS RESERVED</span>
                <span className="text-[#d1a852] animate-pulse">92% SECURED</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div className="h-full bg-gradient-to-r from-[#d1a852] via-[#b8903b] to-red-500 rounded-full w-[92%] shadow-[0_0_8px_rgba(209,168,82,0.4)]" />
              </div>
              <span className="block text-center text-[7.5px] font-bold tracking-wider text-red-400 uppercase select-none">
                ⚠️ 1 Slot Left - May Sell Out Shortly!
              </span>
            </div>
          )}

          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-light">
              <Tag size={12} className="text-[#d1a852]" />
              <span>from <strong className="font-semibold text-white">{plan.price}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 text-white/90 text-xs font-light">
              <Camera size={12} className="text-zinc-300" />
              <span>{plan.setup}</span>
            </div>
          </div>

          <Link
            to={`/booking?package=${encodeURIComponent(plan.title)}&price=${encodeURIComponent(plan.price.replace(/[^\d]/g, ""))}`}
            className="py-3.5 px-8 w-full max-w-[170px] mx-auto rounded-[20px] bg-white text-black hover:bg-[#b4975a] hover:text-white hover:shadow-lg transition-all duration-300 text-[11px] font-extrabold tracking-[0.2em] flex flex-col items-center justify-center leading-tight shadow-md select-none cursor-pointer uppercase"
            onClick={(e) => e.stopPropagation()}
          >
            <span>BOOK</span>
            <span>NOW</span>
          </Link>

          <button
            onClick={(e) => handleShare(e, plan)}
            className="mt-3.5 py-2 px-6 w-full max-w-[170px] mx-auto rounded-[16px] bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer"
          >
            <span className="text-emerald-400">📲</span> Share Package
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="w-full bg-[#0a0a0c] text-white py-24 md:py-32 px-4 md:px-6 overflow-hidden relative">
      <div className="absolute top-[-100px] left-1/4 w-[600px] h-[600px] bg-[#d1a852]/5 rounded-full blur-[150px] pointer-events-none select-none" />
      <div className="absolute bottom-[200px] right-1/4 w-[600px] h-[600px] bg-[#b8903b]/3 rounded-full blur-[180px] pointer-events-none select-none" />

      <div className="container relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#d1a852] text-[10px] md:text-[11px] tracking-[0.4em] uppercase font-extrabold block mb-4">
              Timeless Stories
            </span>
            <h2 className="text-[40px] sm:text-[52px] md:text-[68px] leading-[1.05] tracking-[-0.03em] font-serif text-white font-light mb-6 text-balance">
              Exclusive <span className="italic text-[#d1a852]">Dreamwed Collections</span>
            </h2>
            <p className="text-[15px] md:text-[18px] leading-relaxed text-zinc-400 max-w-xl mx-auto font-light">
              Tailored for couples seeking unmatched cinematic artistry. Every package delivers physical heirlooms and full-spectrum digital storytelling.
            </p>
          </motion.div>
        </div>

        {/* Sticky Sub-navigation Bar */}
        <div className="sticky top-[72px] md:top-[88px] z-30 py-4 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/5 mb-16 select-none flex justify-center">
          <div className="flex gap-2 p-1 bg-[#121215] border border-white/5 rounded-full max-w-lg shadow-2xl">
            {["Wedding", "Engagement", "Haldi", "Add-ons"].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  const id = `sec-${sec.toLowerCase().replace(" ", "-")}`;
                  const target = document.getElementById(id);
                  if (target) {
                    const yOffset = -150;
                    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Restructured Sections */}
        <div id="pricing-grid-container" className="space-y-32">
          
          {/* SECTION 1: WEDDING PACKAGES */}
          <div id="sec-wedding" className="scroll-mt-36 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[#d1a852] text-xs font-extrabold tracking-[0.3em] uppercase">Collections 01</span>
              <h3 className="text-3xl sm:text-4xl text-white font-normal font-serif italic">Wedding Collections</h3>
            </div>
            
            {/* Wedding Premium Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
              {weddingPlans.map((plan) => renderCard(plan, true))}
            </div>

            {/* Standalone Wedding Row */}
            <div className="space-y-8 pt-12 border-t border-white/5">
              <div className="text-center space-y-2">
                <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">Standalone Wedding Coverages</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
                {weddingStandalonePlans.map((plan) => renderCard(plan))}
              </div>
            </div>
          </div>

          {/* SECTION 2: ENGAGEMENT PACKAGES */}
          <div id="sec-engagement" className="scroll-mt-36 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[#d1a852] text-xs font-extrabold tracking-[0.3em] uppercase">Collections 02</span>
              <h3 className="text-3xl sm:text-4xl text-white font-normal font-serif italic">Engagement Collections</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
              {engagementPlans.map((plan) => renderCard(plan))}
            </div>
          </div>

          {/* SECTION 3: HALDI PACKAGES */}
          <div id="sec-haldi" className="scroll-mt-36 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[#d1a852] text-xs font-extrabold tracking-[0.3em] uppercase">Collections 03</span>
              <h3 className="text-3xl sm:text-4xl text-white font-normal font-serif italic">Haldi Collections</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
              {haldiPlans.map((plan) => renderCard(plan))}
            </div>
          </div>

          {/* SECTION 4: ADD-ONS */}
          <div id="sec-add-ons" className="scroll-mt-36 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[#d1a852] text-xs font-extrabold tracking-[0.3em] uppercase">Customizations</span>
              <h3 className="text-3xl sm:text-4xl text-white font-normal font-serif italic">Premium Add-ons</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
              {addOnPlans.map((addon) => (
                <div key={addon.shareId} className="bg-[#121215] p-6 sm:p-8 rounded-[32px] border border-white/5 shadow-2xl flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(209,168,82,0.06)] transition-all duration-500 hover:border-[#d1a852]/40 group">
                  <div className="space-y-4">
                    <span className="inline-flex bg-white/5 text-[#d1a852] border border-[#d1a852]/20 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">Add-on Option</span>
                    <h4 className="text-[20px] font-normal leading-tight text-white">{addon.title}</h4>
                    <p className="text-[28px] font-normal text-[#d1a852] numbers-pro">{addon.price}</p>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">{addon.desc}</p>
                    <div className="text-[10px] text-zinc-500 font-medium border-t border-white/5 pt-3">
                      {addon.details}
                    </div>
                  </div>
                  <Link to={`/booking?package=${encodeURIComponent(addon.title)}&price=${encodeURIComponent(addon.price.replace(/[^\d]/g, ""))}`} className="mt-8 py-3 w-full rounded-[16px] border border-white/10 text-white hover:bg-[#b4975a] hover:text-white hover:border-[#b4975a] transition-all text-center text-xs font-bold uppercase tracking-wider block">
                    Book This Pack
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lock Rates Callout */}
        <div className="mt-24 max-w-4xl mx-auto px-4 select-none">
          <div className="bg-[#d1a852]/5 border border-dashed border-[#d1a852]/20 rounded-[32px] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden">
            <span className="inline-flex items-center gap-1.5 text-[#d1a852] text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-bold mb-4">
              <Lock size={12} className="text-[#d1a852]" /> Lock Current Promo Rates
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-light text-white mb-3 leading-tight">
              Secure Your Date with Just <span className="text-[#d1a852] font-normal">₹5,000/-</span>
            </h3>
            <p className="text-[13px] text-zinc-400 font-light max-w-xl mx-auto leading-relaxed mb-6">
              Reserve your date now to protect against seasonal price increases. The booking fee is fully adjustable to any package. Balance payment is required only on the wedding day.
            </p>
            <Link
              to="/booking?package=Promo%20Rates%20Booking&price=5000"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[16px] bg-[#d1a852] hover:bg-[#b8903b] text-black text-xs uppercase tracking-widest font-bold transition-all shadow-[0_10px_25px_rgba(209,168,82,0.2)] hover:scale-[1.02]"
            >
              Secure My Promo Rates Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* DYNAMIC IMMERSIVE DETAILED MODAL */}
      <AnimatePresence>
        {activePlan !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setActivePlan(null)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-4xl rounded-[40px] bg-[#121215] border border-white/5 overflow-y-auto md:overflow-hidden max-h-[90vh] md:max-h-[650px] shadow-[0_30px_80px_rgba(0,0,0,0.7)] grid grid-cols-1 md:grid-cols-2 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActivePlan(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-black/65 hover:bg-black/85 border border-white/10 flex items-center justify-center text-white shadow-2xl transition-all hover:rotate-90 hover:scale-105 duration-300 z-50 cursor-pointer"
                title="Close popup"
              >
                <X size={22} strokeWidth={2.5} />
              </button>

              {/* Left Side Gallery */}
              <div className="relative aspect-[4/5] md:aspect-auto w-full h-full bg-zinc-950 overflow-hidden min-h-[300px] md:min-h-[550px] flex items-center justify-center group select-none">
                <div className="absolute inset-0 w-full h-full">
                  <motion.img
                    key={`bg-${activePlan.images[currentSlide % activePlan.images.length]}`}
                    src={activePlan.images[currentSlide % activePlan.images.length]}
                    alt=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-25 select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

                  <motion.img
                    key={`fg-${activePlan.images[currentSlide % activePlan.images.length]}`}
                    src={activePlan.images[currentSlide % activePlan.images.length]}
                    alt="Dreamwed Stories Capture"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover z-10" style={{ objectPosition: "center 30%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none z-20" />
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-1 text-white z-10 pointer-events-none">
                  <span className="text-[#b4975a] text-[9px] font-bold tracking-[0.25em] uppercase block">Dreamwed Stories</span>
                  <h4 className="text-lg font-light tracking-tight text-white font-serif italic">
                    {activePlan.title.toLowerCase().includes("engagement") ? "Actual Engagement Captures" : activePlan.title.toLowerCase().includes("haldi") ? "Actual Haldi Captures" : "Actual Wedding Work Captures"}
                  </h4>
                  <p className="text-white/60 text-[9px] font-light">
                    Every pixel captured with high-fidelity professional optics.
                  </p>
                </div>

                <div className="absolute top-6 left-6 flex gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/5 z-10 pointer-events-none">
                  {activePlan.images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-1 rounded-full transition-all duration-300 ${
                        (currentSlide % activePlan.images.length) === i ? "bg-[#b4975a] scale-125" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Side Detail */}
              <div className="p-6 sm:p-10 flex flex-col justify-between gap-5 md:h-[650px] md:overflow-hidden overflow-visible h-auto">
                <div className="space-y-2 select-none">
                  <span className="inline-flex items-center gap-1 bg-white/5 text-[#d1a852] border border-[#d1a852]/20 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                    {activePlan.modalTag || "Premium"} Collection
                  </span>
                  <h3 className="text-2xl sm:text-3xl text-white font-semibold tracking-tight font-serif">
                    {activePlan.title.toLowerCase().includes("package") ? activePlan.title : `${activePlan.title} Package`}
                  </h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-[#d1a852]">{activePlan.price}/-</span>
                  </div>

                  <div className="md:hidden flex justify-center pt-2 select-none pointer-events-none">
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="text-[#b4975a] flex flex-col items-center gap-1"
                    >
                      <span className="text-[9px] font-semibold tracking-[0.25em] uppercase opacity-75">Scroll</span>
                      <svg className="w-5 h-5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                <div className="flex-grow md:overflow-y-auto pr-2 space-y-5 md:scrollbar-thin relative min-h-0 overflow-visible h-auto">
                  <p className="text-zinc-400 font-light text-xs leading-relaxed select-none">
                    {activePlan.desc}
                  </p>

                  {/* Standalone Value Breakdown */}
                  {activePlan.shareId.startsWith("pkgWedding") && !activePlan.shareId.includes("Standalone") && (
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2.5 select-none">
                      <span className="block text-[#d1a852] text-[9.5px] font-bold uppercase tracking-wider">
                        💎 Combined Package Value Breakdown
                      </span>
                      <div className="space-y-1.5 text-xs text-zinc-400 font-light">
                        <div className="flex justify-between">
                          <span>Standalone Wedding Day Coverage</span>
                          <span className="font-semibold text-zinc-200">₹39,999</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standalone Reception Day Coverage</span>
                          <span className="font-semibold text-zinc-200">₹19,999</span>
                        </div>
                        <div className="flex justify-between text-[#b8903b] font-medium">
                          <span>Complimentary Pre-Wedding Shoot</span>
                          <span className="font-semibold">
                            {activePlan.shareId === "pkgWeddingBasicCard" ? "Worth ₹12,000" : "Worth ₹15,000"}
                          </span>
                        </div>
                        {activePlan.shareId === "pkgCandidCard" && (
                          <div className="flex justify-between text-zinc-400">
                            <span>Creative Candid Upgrade (3-Camera Setup)</span>
                            <span className="font-semibold text-zinc-200">Worth ₹15,000</span>
                          </div>
                        )}
                        {activePlan.shareId === "pkgLuxuryCard" && (
                          <>
                            <div className="flex justify-between text-zinc-400">
                              <span>Dual-Side 4-Camera Upgrade & Drone</span>
                              <span className="font-semibold text-zinc-200">Worth ₹35,000</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                              <span>Custom Handcrafted Album Box & Extras</span>
                              <span className="font-semibold text-zinc-200">Worth ₹15,000</span>
                            </div>
                          </>
                        )}
                        <div className="h-px bg-white/10 my-1" />
                        <div className="flex justify-between text-zinc-200 font-medium">
                          <span>Total Standalone Value</span>
                          <span className="font-bold">
                            {activePlan.shareId === "pkgWeddingBasicCard" ? "₹71,998" :
                             activePlan.shareId === "pkgWeddingPreCard" ? "₹74,998" :
                             activePlan.shareId === "pkgCandidCard" ? "₹89,998" : "₹1,24,998"}
                          </span>
                        </div>
                        <div className="flex justify-between text-[#d1a852] font-semibold text-[11px] pt-1">
                          <span>Special Combined Deal Price</span>
                          <span className="font-bold font-mono">{activePlan.price}/-</span>
                        </div>
                      </div>
                      <div className="bg-[#d1a852]/10 border border-[#d1a852]/20 px-3 py-1.5 rounded-xl text-center text-[10px] text-[#d1a852] font-black uppercase tracking-wider">
                        🎉 INSTANT SAVINGS OF {
                          activePlan.shareId === "pkgWeddingBasicCard" ? "₹31,999 (44% OFF)" :
                          activePlan.shareId === "pkgWeddingPreCard" ? "₹19,999 (27% OFF)" :
                          activePlan.shareId === "pkgCandidCard" ? "₹19,999 (22% OFF)" :
                          "₹14,998 (12% OFF)"
                        }!
                      </div>
                    </div>
                  )}

                  {activePlan.preweddingOffer && (
                    <div className="bg-red-500/10 border-2 border-red-500/40 p-4 rounded-2xl flex items-start gap-3 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                        <Gift size={16} />
                      </div>
                      <div>
                        <span className="block text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          Special Promo Highlight
                        </span>
                        <span className="text-zinc-200 text-xs font-bold leading-snug block mt-0.5">
                          {activePlan.preweddingOffer}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="w-full h-px bg-white/5" />

                  <div className="space-y-3.5 relative">
                    <span className="text-[10px] text-zinc-100 tracking-wider uppercase font-bold block select-none">
                      Complete Deliverables (Scroll for all {activePlan.features.length} items 👇):
                    </span>
                    <div className="space-y-3">
                      {activePlan.features.map((item, index) => {
                        const isFree = item.toLowerCase().includes("free") || item.toLowerCase().includes("pre-wedding");
                        return (
                          <div key={index} className={`flex items-start gap-3 text-xs leading-relaxed ${
                            isFree ? "font-semibold text-[#b8903b]" : "text-zinc-400 font-light"
                          }`}>
                            <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isFree ? "bg-[#d1a852]/25 text-[#b8903b] shadow-[0_0_8px_rgba(209,168,82,0.2)] animate-pulse" : "bg-white/5 text-zinc-400"
                            }`}>
                              {isFree ? (
                                <Sparkles size={10} strokeWidth={3} />
                              ) : (
                                <Check size={10} strokeWidth={3} />
                              )}
                            </span>
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-4" />
                </div>

                <div className="w-full h-px bg-white/5 select-none" />

                <div className="space-y-3">
                  <Button
                    to={`/booking?package=${encodeURIComponent(activePlan?.title || "")}&price=${encodeURIComponent((activePlan?.price || "").replace(/[^\d]/g, ""))}`}
                    variant="primary"
                    className="w-full py-4.5 rounded-2xl text-center text-xs uppercase tracking-widest font-bold select-none"
                    onClick={() => setActivePlan(null)}
                  >
                    Book Now 🌟
                  </Button>
                  <button
                    onClick={(e) => handleShare(e, activePlan)}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.25)] select-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.719-1.465zm9.882-2.51c1.56.929 3.085 1.454 4.553 1.456 4.887 0 8.862-3.973 8.865-8.87.001-2.373-.921-4.604-2.597-6.282s-3.91-2.597-6.285-2.599c-4.895 0-8.868 3.977-8.871 8.874-.001 1.666.449 3.29 1.306 4.7l-.993 3.626zm12.39-7.235c-.26-.13-1.53-.755-1.77-.84-.23-.085-.4-.13-.57.13-.17.26-.65.82-.8 1-.15.17-.3.19-.56.06-.26-.13-1.1-.4-2.1-1.3-.77-.69-1.3-1.54-1.45-1.8-.15-.26-.016-.4.115-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.3-.02-.43-.06-.13-.57-1.37-.78-1.88-.2-.5-.41-.43-.57-.44-.15-.008-.32-.01-.5-.01-.17 0-.46.06-.7.33-.24.27-.92.9-1.09 1.1-.17.2-.32.41-.53.5-.21.09-1.12.37-1.92-1.07-.63-.56-1.05-1.25-1.17-1.46-.12-.21-.01-.33.12-.46.12-.11.26-.26.39-.39.13-.13.17-.22.26-.36.09-.15.04-.28-.02-.41-.06-.13-.57-1.37-.78-1.88-.21-.51-.43-.43-.58-.44-.15-.01-.32-.01-.5-.01s-.46.07-.7.33c-.24.26-.92.9-1.09 1.1-.17.2-.32.41-.53.5-.21.09-1.12.37-1.92-1.07zm-1.8 1.48c.18-.09.38-.19.59-.29-.2-.31-.4-.63-.59-.95-.19-.32-.37-.64-.54-.97a6.22 6.22 0 0 1-.41-.85c-.07-.18-.1-.36-.08-.54.02-.18.1-.36.22-.47c.5-.53 1.01-1.07 1.5-1.6c.49-.53.97-1.07 1.44-1.61.16-.18.31-.37.45-.56.12-.16.2-.33.22-.52c.02-.19-.04-.38-.17-.53c-.33-.37-.67-.74-1.01-1.11a24.32 24.32 0 0 0-2.31-2.42c-.15-.14-.33-.23-.53-.25c-.2-.02-.4.04-.55.17a32.96 32.96 0 0 0-3.32 3.19c-.19.2-.34.42-.45.66c-.11.24-.16.5-.16.76c.01.26.07.51.19.74c.24.47.53.92.85 1.36c.64.88 1.41 1.68 2.27 2.37c.86.69 1.83 1.25 2.87 1.66c.52.2 1.06.36 1.62.46c.28.05.57.06.85.04c.28-.02.55-.1.79-.24z"/>
                    </svg>
                    Share Package on WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PricingSection;
