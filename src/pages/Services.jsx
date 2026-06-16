import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, BookOpen, Clock, Users, Heart, X, Check, Gift, Sparkles, CheckCircle, Tag, ArrowRight, Share2 } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import customServiceImg from '../assets/images/new_portrait_3.jpg';

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
    tag: "Single-Side Wedding + Pre-Wedding + Drone",
    modalTag: "Premium Wedding",
    subtitle: "COMPLETE SINGLE-SIDE & DRONE",
    preweddingOffer: "FREE DRONE AERIAL COVERAGE + 100 PAGES ALBUM",
    desc: "Our comprehensive single-side coverage package. Designed for couples seeking complete pre-wedding story, wedding day, and reception coverage with aerial drone views and a premium handcrafted 100-page album.",
    setup: "Candid & Traditional Team + Drone + Pre-Wedding",
    images: ["/couple_traditional_red.jpg", "/deepak.jpg", "/anandha_lekshmi.jpg"],
    isSpecial: true,
    features: [
      "Pre-Wedding Photography & Videography (Save the Date)",
      "Wedding Day Candid & Traditional Photography",
      "Wedding Day Candid & Traditional Videography",
      "Grand Reception Candid & Traditional Coverage",
      "Helicam (Drone) Aerial Coverage",
      "One 100-Pages Premium layflat Album",
      "Highlights Video Film",
      "Full HD Wedding Video Film",
      "Engagement & Wedding Reels",
      "1 Customized Photo Calendar",
      "1 High-Speed USB Pen Drive",
      "2 Premium Wall Frames",
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

const Services = () => {
  const getRegularPrice = (priceStr) => {
    if (!priceStr) return "";
    const num = parseInt(priceStr.replace(/[^0-9]/g, ""));
    if (isNaN(num)) return "₹0";
    if (num === 39999) return "₹59,999";
    if (num === 54999) return "₹79,999";
    if (num === 69999) return "₹99,999";
    if (num === 110000) return "₹1,65,000";
    if (num === 19999) return "₹29,999";
    if (num === 28999) return "₹45,000";
    if (num === 79999) return "₹1,20,000";
    if (num === 10000) return "₹15,000";
    if (num === 15000) return "₹25,000";
    if (num === 28000) return "₹45,000";
    const calculated = Math.round((num * 1.5) / 5000) * 5000;
    return `₹${calculated.toLocaleString("en-IN")}`;
  };

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

  // Keyboard Escape listener to exit modal smoothly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActivePlan(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-play slideshow for active modal gallery
  useEffect(() => {
    if (activePlan === null) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [activePlan]);

  const toggleLike = (e, planId) => {
    e.stopPropagation();
    setLikedPlans((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

  const renderCard = (plan) => {
    const isSpecial = plan.title.toLowerCase().includes("luxury") || plan.title.toLowerCase().includes("candid");
    return (
      <motion.div
        key={plan.shareId}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8 }}
        onClick={() => {
          setActivePlan(plan);
          setCurrentSlide(0);
        }}
        className={`relative bg-white p-8 md:p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-700 border border-transparent cursor-pointer group flex flex-col justify-between ${isSpecial ? 'border-zinc-200 shadow-lg' : ''}`}
      >
        {/* Click hint inside card */}
        <div className="absolute top-4 left-8 text-[8px] font-bold tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity duration-300 text-zinc-500">
          ✨ Click for photos & details
        </div>

        <div>
          <div className="text-black mb-8 flex justify-center pt-2">
            {plan.title.toLowerCase().includes("haldi") ? <Video className="w-10 h-10" /> :
             plan.title.toLowerCase().includes("engagement") ? <Heart className="w-10 h-10" /> :
             <Camera className="w-10 h-10" />}
          </div>
          <h3 className="text-[26px] font-normal text-center mb-4 tracking-tight leading-tight">{plan.title}</h3>
          <div className="text-center mb-4 select-none">
            <span className="block text-[36px] font-bold text-red-650 leading-none mb-1 numbers-pro">{plan.price}</span>
            <span className="text-zinc-400 text-xs line-through leading-none">Reg: {getRegularPrice(plan.price)}</span>
          </div>

          {/* Urgency countdown timer bar inside card */}
          {plan.price && (
            <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl py-2 px-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-red-650 text-[9px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                <span>🔥 Offer Closing Soon</span>
              </div>
              <div className="text-zinc-800 font-mono text-[10px] font-bold tracking-wider flex items-center justify-center gap-1">
                <span className="text-[#1e3f20] bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="text-[#1e3f20] bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="text-[#1e3f20] bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          )}
          
          {/* Standalone Value Proposition Badge */}
          {plan.shareId.startsWith("pkgWedding") && !plan.shareId.includes("Standalone") && (
            <div className="mb-6 text-center select-none">
              <span className="inline-flex items-center gap-1.5 bg-[#1e3f20]/5 border border-[#1e3f20]/15 px-3 py-1.5 rounded-full text-[10px] font-medium text-[#1e3f20]">
                <span className="text-[#1e3f20] font-bold">Total Value:</span>
                <span className="font-semibold text-zinc-800">
                  {plan.shareId === "pkgWeddingBasicCard" ? "₹71,998" : 
                   plan.shareId === "pkgWeddingPreCard" ? "₹74,998" : 
                   plan.shareId === "pkgCandidCard" ? "₹89,998" : "₹1,24,998"}
                </span>
                <span className="text-zinc-300">|</span>
                <span className="text-[#9b1c1c] font-bold">
                  {plan.shareId === "pkgWeddingBasicCard" ? "Save 44%" : 
                   plan.shareId === "pkgWeddingPreCard" ? "Save 27%" : 
                   plan.shareId === "pkgCandidCard" ? "Save 22%" : "Save 12%"}
                </span>
              </span>
            </div>
          )}
          
          <ul className="space-y-4 mb-10">
            {plan.features.slice(0, 5).map((feat, idx) => (
              <li key={idx} className="flex gap-3 items-start text-[#66706a]">
                <Heart size={16} className="text-[#5d665f] shrink-0 mt-1" />
                <span className="numbers-pro font-light text-sm">{feat}</span>
              </li>
            ))}
            {plan.features.length > 5 && (
              <li className="text-[11px] font-bold tracking-wider uppercase text-center mt-2 text-[#5d665f]">
                + View ${plan.features.length - 5} More...
              </li>
            )}
          </ul>
        </div>
        
        <div className="text-center mt-auto">
          <Button to="/contact" variant={isSpecial ? 'primary' : 'outline'} className="w-full" onClick={(e) => e.stopPropagation()}>
            Book Now
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="pt-24 bg-[#f5f5f3] select-none">
      <SEO 
        title="Services & Packages"
        description="Explore our curated wedding storytelling packages (Silver, Gold Lite, Gold) and custom bespoke photography services in Trivandrum, Kerala."
      />
      <section className="py-24">
        <div className="container">
          <SectionHeader 
            subtitle="Our Offerings" 
            title="Curated Storytelling Packages" 
            description="Premium photography and cinematic videography tailored to your unique love story."
          />

          {/* Sticky Sub-navigation Bar (Light Theme) */}
          <div className="sticky top-[72px] md:top-[88px] z-30 py-4 bg-[#f5f5f3]/90 backdrop-blur-md border-b border-zinc-200 mb-16 select-none flex justify-center">
            <div className="flex gap-2 p-1 bg-white border border-zinc-200 rounded-full max-w-lg shadow-md">
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
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-all hover:bg-zinc-100 active:scale-95 cursor-pointer"
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          <div id="pricing-grid-container" className="space-y-32">
            {/* SECTION 1: WEDDING PACKAGES */}
            <div id="sec-wedding" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.2em] uppercase">Collections 01</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Wedding <span className="italic font-serif text-[#b4975a]">Collections</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
                {weddingPlans.map((plan) => renderCard(plan))}
              </div>

              {/* Standalone Wedding Row */}
              <div className="space-y-8 pt-12 border-t border-zinc-200">
                <div className="text-center space-y-2">
                  <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">Standalone Wedding Coverages</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                  {weddingStandalonePlans.map((plan) => renderCard(plan))}
                </div>
              </div>
            </div>

            {/* SECTION 2: ENGAGEMENT PACKAGES */}
            <div id="sec-engagement" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.2em] uppercase">Collections 02</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Engagement <span className="italic font-serif text-[#b4975a]">Collections</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                {engagementPlans.map((plan) => renderCard(plan))}
              </div>
            </div>

            {/* SECTION 3: HALDI PACKAGES */}
            <div id="sec-haldi" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.2em] uppercase">Collections 03</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Haldi <span className="italic font-serif text-[#b4975a]">Collections</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                {haldiPlans.map((plan) => renderCard(plan))}
              </div>
            </div>

            {/* SECTION 4: ADD-ONS */}
            <div id="sec-add-ons" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.25em] uppercase">Customizations</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Premium <span className="italic font-serif text-[#b4975a]">Add-ons</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
                {addOnPlans.map((addon, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[40px] border border-zinc-200/60 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:border-[#1e3f20]/25 group">
                    <div className="space-y-4">
                      <span className="inline-flex bg-[#1e3f20]/5 text-[#1e3f20] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">Add-on Option</span>
                      <h4 className="text-[20px] font-normal leading-tight text-zinc-900">{addon.title}</h4>
                      <p className="text-[28px] font-normal text-[#9b1c1c] numbers-pro">{addon.price}</p>
                      <p className="text-zinc-500 text-xs font-light leading-relaxed">{addon.desc}</p>
                      <div className="text-[10px] text-zinc-400 font-medium border-t border-zinc-100 pt-3">
                        {addon.details}
                      </div>
                    </div>
                    <Button to="/contact" variant="outline" className="w-full mt-8" onClick={(e) => e.stopPropagation()}>
                      Inquire Add-on
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* AI Photo Search Highlights Section */}
      <section className="w-full py-24 px-6 md:px-8 bg-zinc-950 text-white relative overflow-hidden">
        {/* Glow vector backdrops */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#881337]/5 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left Scan Illustration Mockup */}
          <div className="flex-1 relative w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-black/60 p-5 flex items-center justify-center">
              <div className="absolute inset-6 rounded-2xl border border-[#b4975a]/30 bg-zinc-900/60 overflow-hidden flex items-center justify-center shadow-inner">
                <img 
                  src="/ai_search_banner.png" 
                  alt="AI Face Scan Preview"
                  className="w-full h-full object-cover opacity-70"
                />
                {/* Glowing bounce laser */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce w-full" style={{ animationDuration: '4s' }}></div>
              </div>
              <div className="absolute bottom-10 left-10 right-10 bg-black/85 backdrop-blur-xl border border-white/5 rounded-xl p-3 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-300">Biometric Sync Active</span>
                </div>
                <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest">Confidence 99.2%</span>
              </div>
            </div>
          </div>

          {/* Right Text Contents */}
          <div className="flex-1 text-left space-y-8">
            <span className="text-[11px] font-bold uppercase tracking-[2.5px] text-[#b4975a] bg-[#b4975a]/10 px-4 py-2 rounded-full inline-block">
              ✨ Included in all packages
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl sm:text-5xl text-white font-light tracking-tight leading-none">
              AI Photo Search & <span className="italic font-serif text-[#b4975a]">Print Preserves</span>
            </h2>
            <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-lg">
              Empower your guests to skip scrolling through thousands of photos. By uploading a single portrait selfie, our high-precision facial scanner cross-references the wedding database to isolate their custom moments in milliseconds.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">⚡ Instant Selfie Scan</h4>
                <p className="text-[11px] text-zinc-500 font-light leading-relaxed">Guests scan in real-time with gold laser feedback & diagnostic logs.</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">🛍️ Archival Print Checkout</h4>
                <p className="text-[11px] text-zinc-500 font-light leading-relaxed">Direct size selection (8x12, 10x15, 12x18) with home dispatch.</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">🔒 Instagram Access Gate</h4>
                <p className="text-[11px] text-zinc-500 font-light leading-relaxed">Seamless lockscreen verification gate to grow social engagement.</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">📦 Real-time Dispatch Sync</h4>
                <p className="text-[11px] text-zinc-500 font-light leading-relaxed">Fulfilled and managed seamlessly in the central Dreamwed admin portal.</p>
              </div>
            </div>

            <div className="pt-4">
              <Button to="/ai-search/" variant="primary" className="px-10 py-4 text-xs tracking-widest uppercase font-bold">
                Experience AI Search Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC IMMERSIVE DETAILED MODAL */}
      <AnimatePresence>
        {activePlan !== null && (() => {
          const plan = activePlan;
          const imagesLength = plan.images && plan.images.length ? plan.images.length : 1;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              onClick={() => setActivePlan(null)}
            >
              <motion.div
                initial={{ scale: 0.93, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.93, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative w-full max-w-4xl rounded-[40px] bg-white border border-zinc-100 overflow-y-auto md:overflow-hidden max-h-[90vh] md:max-h-[650px] shadow-[0_30px_80px_rgba(0,0,0,0.4)] grid grid-cols-1 md:grid-cols-2 text-zinc-800"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Extremely Prominent Close Button */}
                <button
                  onClick={() => setActivePlan(null)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-black/75 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white shadow-2xl transition-all hover:rotate-90 hover:scale-105 duration-300 z-50 cursor-pointer"
                  title="Close popup"
                >
                  <X size={22} strokeWidth={2.5} />
                </button>

                {/* Left Side: Auto-playing Wedding Photo Gallery with Dynamic Blurred Backdrop */}
                <div className="relative aspect-[4/5] md:aspect-auto w-full h-full bg-zinc-950 overflow-hidden min-h-[300px] md:min-h-[550px] flex items-center justify-center group select-none">
                  
                  {/* Dynamic Auto-rotating slideshow wrapper */}
                  <div className="absolute inset-0 w-full h-full">
                    {/* Zoomed Blurred Background Layer */}
                    <motion.img
                      key={`bg-${plan.images[currentSlide % imagesLength]}`}
                      src={plan.images[currentSlide % imagesLength]}
                      alt=""
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-25 select-none pointer-events-none"
                    />
                    {/* Semi-transparent dark overlay to ensure dynamic color contrast and block clear leaks */}
                    <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

                    {/* Crisp Foreground Layer */}
                    <motion.img
                      key={`fg-${plan.images[currentSlide % imagesLength]}`}
                      src={plan.images[currentSlide % imagesLength]}
                      alt="Dreamwed Stories Actual Wedding Capture"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full h-full object-cover z-10" style={{ objectPosition: "center 30%" }}
                    />
                    {/* Subtle vignette shade overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none z-20" />
                  </div>

                  {/* Floating branding watermark */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-1 text-white z-10 pointer-events-none">
                    <span className="text-[#b4975a] text-[9px] font-bold tracking-[0.25em] uppercase block">Dreamwed Stories</span>
                    <h4 className="text-lg font-light tracking-tight text-white font-serif italic">
                      Actual Wedding Work Captures
                    </h4>
                    <p className="text-white/60 text-[9px] font-light">
                      Every pixel captured with high-fidelity professional optics.
                    </p>
                  </div>

                  {/* Slide indicator dots */}
                  <div className="absolute top-6 left-6 flex gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/5 z-10 pointer-events-none">
                    {plan.images && plan.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full transition-all duration-300 ${
                          (currentSlide % imagesLength) === i ? "bg-[#b4975a] scale-125" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Side: Package Inclusions and Booking Option (Redesigned with Fixed Headers/CTA & Dynamic Scroll checklist) */}
                <div className="p-6 sm:p-10 flex flex-col justify-between gap-5 md:h-[650px] md:overflow-hidden overflow-visible h-auto">
                  
                  {/* Header detail */}
                  <div className="space-y-2 select-none">
                    <span className="inline-flex items-center gap-1 bg-[#1e3f20]/5 text-[#1e3f20] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                      {plan.modalTag || plan.tag || "Collection"}
                    </span>
                    <h3 className="text-2xl sm:text-3xl text-zinc-900 font-semibold tracking-tight font-serif leading-tight">
                      {plan.title.toLowerCase().includes("package") ? plan.title : `${plan.title} Package`}
                    </h3>
                    {/* Dynamic Double Pricing & Countdown Timer Block */}
                    <div className="flex flex-col gap-2 bg-[#9b1c1c]/5 border border-[#9b1c1c]/15 p-4.5 rounded-2xl select-none text-left">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-red-650 text-3xl font-extrabold tracking-tight select-none">
                          Offer Price: {plan.price}/-
                        </span>
                        <span className="text-zinc-400 text-sm line-through decoration-zinc-400 select-none">
                          Regular: {getRegularPrice(plan.price)}/-
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 font-mono text-[11px] border-t border-zinc-100 pt-2.5 mt-0.5">
                        <span className="text-red-650 flex items-center gap-1 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                          ⏳ OFFER CLOSING IN:
                        </span>
                        <span className="text-[#1e3f20] bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded font-bold">
                          {String(timeLeft.hours).padStart(2, '0')}h
                        </span>
                        <span>:</span>
                        <span className="text-[#1e3f20] bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded font-bold">
                          {String(timeLeft.minutes).padStart(2, '0')}m
                        </span>
                        <span>:</span>
                        <span className="text-[#1e3f20] bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded font-bold animate-pulse">
                          {String(timeLeft.seconds).padStart(2, '0')}s
                        </span>
                      </div>
                    </div>

                    {/* Symbolic Animated Scroll Arrow for Mobile */}
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

                  {/* Main Scroll Stream (Checklist) */}
                  <div className="flex-grow md:overflow-y-auto pr-2 space-y-5 md:scrollbar-thin relative min-h-0 overflow-visible h-auto">
                    
                    {/* Short intro bio */}
                    <p className="text-zinc-500 font-light text-xs leading-relaxed select-none">
                      {plan.desc}
                    </p>

                    {/* Why Book This Package Highlights */}
                    <div className="border border-red-500/30 bg-red-50/70 p-4 rounded-2xl space-y-3 select-none text-left">
                      <span className="block text-red-650 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={11} className="animate-pulse text-red-650" />
                        Why Book This Package?
                      </span>
                      <div className="space-y-2.5 text-xs text-zinc-700">
                        <div className="flex gap-2.5 items-start">
                          <span className="text-red-600 mt-0.5 shrink-0">📁</span>
                          <div>
                            <strong className="text-zinc-900 block">Full Photos in Google Drive</strong>
                            <span className="text-zinc-650 font-light text-[11px] block mt-0.5">
                              Get 100% original, uncompressed high-resolution digital files instantly shared via Google Drive for lifetime backup.
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <span className="text-red-600 mt-0.5 shrink-0">🌐</span>
                          <div>
                            <strong className="text-zinc-900 block">Personal Couples Website Support</strong>
                            <span className="text-zinc-650 font-light text-[11px] block mt-0.5">
                              Receive a stunning, private online interactive gallery website to view, select, and share your photos with family.
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <span className="text-red-600 mt-0.5 shrink-0">💬</span>
                          <div>
                            <strong className="text-zinc-900 block">Direct WhatsApp Previews & Live Support</strong>
                            <span className="text-zinc-650 font-light text-[11px] block mt-0.5">
                              Optimized mobile previews and direct WhatsApp integration for sharing reels and highlights on the go.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Standalone Value Breakdown */}
                    {plan.shareId.startsWith("pkgWedding") && !plan.shareId.includes("Standalone") && (
                      <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl space-y-2.5 select-none text-left">
                        <span className="block text-[#1e3f20] text-[9.5px] font-bold uppercase tracking-wider">
                          💎 Combined Package Value Breakdown
                        </span>
                        <div className="space-y-1.5 text-xs text-zinc-600 font-light">
                          <div className="flex justify-between">
                            <span>Standalone Wedding Day Coverage</span>
                            <span className="font-semibold text-zinc-800">₹39,999</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Standalone Reception Day Coverage</span>
                            <span className="font-semibold text-zinc-800">₹19,999</span>
                          </div>
                          <div className="flex justify-between text-[#1e3f20] font-medium">
                            <span>Complimentary Pre-Wedding Shoot</span>
                            <span className="font-semibold">
                              {plan.shareId === "pkgWeddingBasicCard" ? "Worth ₹12,000" : "Worth ₹15,000"}
                            </span>
                          </div>
                          {plan.shareId === "pkgCandidCard" && (
                            <div className="flex justify-between text-zinc-500">
                              <span>Creative Candid Upgrade (3-Camera Setup)</span>
                              <span className="font-semibold text-zinc-800">Worth ₹15,000</span>
                            </div>
                          )}
                          {plan.shareId === "pkgLuxuryCard" && (
                            <>
                              <div className="flex justify-between text-zinc-500">
                                <span>Dual-Side 4-Camera Upgrade & Drone</span>
                                <span className="font-semibold text-zinc-800">Worth ₹35,000</span>
                              </div>
                              <div className="flex justify-between text-zinc-500">
                                <span>Custom Handcrafted Album Box & Extras</span>
                                <span className="font-semibold text-zinc-800">Worth ₹15,000</span>
                              </div>
                            </>
                          )}
                          <div className="h-px bg-zinc-200 my-1" />
                          <div className="flex justify-between text-zinc-800 font-medium">
                            <span>Total Standalone Value</span>
                            <span className="font-bold">
                              {plan.shareId === "pkgWeddingBasicCard" ? "₹71,998" :
                               plan.shareId === "pkgWeddingPreCard" ? "₹74,998" :
                               plan.shareId === "pkgCandidCard" ? "₹89,998" : "₹1,24,998"}
                            </span>
                          </div>
                          <div className="flex justify-between text-[#9b1c1c] font-semibold text-[11px] pt-1">
                            <span>Special Combined Deal Price</span>
                            <span className="font-bold font-mono">{plan.price}/-</span>
                          </div>
                        </div>
                        <div className="bg-[#1e3f20]/5 border border-[#1e3f20]/15 px-3 py-1.5 rounded-xl text-center text-[10px] text-[#1e3f20] font-bold uppercase tracking-wider mt-2">
                          🎉 INSTANT SAVINGS OF {
                            plan.shareId === "pkgWeddingBasicCard" ? "₹31,999 (44% OFF)" :
                            plan.shareId === "pkgWeddingPreCard" ? "₹19,999 (27% OFF)" :
                            plan.shareId === "pkgCandidCard" ? "₹19,999 (22% OFF)" :
                            "₹14,998 (12% OFF)"
                          }!
                        </div>
                      </div>
                    )}

                    {/* Bonus highlight box */}
                    {plan.preweddingOffer && (
                      <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-start gap-3 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.08)] select-none">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                          <Gift size={16} />
                        </div>
                        <div className="text-left">
                          <span className="block text-red-600 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            Special Inclusions
                          </span>
                          <span className="text-zinc-800 text-xs font-bold leading-snug block mt-0.5">
                            {plan.preweddingOffer} is fully included in this offer.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="w-full h-px bg-zinc-100" />

                    {/* Complete inclusions list */}
                    <div className="space-y-3.5 relative">
                      <span className="text-[10px] text-zinc-800 tracking-wider uppercase font-bold block select-none">
                        Complete Deliverables (Scroll for all {plan.features ? plan.features.length : 0} items 👇):
                      </span>
                      <div className="space-y-3">
                        {plan.features && plan.features.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 text-xs text-zinc-600 font-light leading-relaxed">
                            <span className="w-4.5 h-4.5 rounded-full bg-[#1e3f20]/10 text-[#1e3f20] flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={10} strokeWidth={3} />
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-4" />
                  </div>

                  <div className="w-full h-px bg-zinc-100 select-none" />

                  {/* Book Consultation button */}
                  <div className="space-y-3">
                    {/* Scroll Price Reminder */}
                    <div className="bg-[#9b1c1c]/10 border border-[#9b1c1c]/20 px-4 py-3 rounded-xl flex items-center justify-between text-xs select-none text-left">
                      <div className="space-y-0.5">
                        <span className="text-zinc-550 block text-[9px] uppercase font-bold tracking-wider">YOUR EXCLUSIVE PRICE</span>
                        <span className="text-zinc-455 text-[10px] line-through font-mono block leading-none">
                          Reg: {getRegularPrice(plan.price)}/-
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-red-600 font-black font-mono text-xl block leading-none">
                          {plan.price}/-
                        </span>
                        <span className="text-emerald-605 text-[9.5px] font-bold block mt-0.5 uppercase tracking-wider">
                          Special Promo Rate
                        </span>
                      </div>
                    </div>

                    <Button
                      to="/contact"
                      variant="primary"
                      className="w-full py-4 rounded-2xl text-center text-xs uppercase tracking-widest font-bold select-none"
                      onClick={() => setActivePlan(null)}
                    >
                      Book Now 🌟
                    </Button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Additional Info Section */}
      <section className="bg-white py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-[48px] md:text-[56px] leading-[1.1] tracking-[-0.04em] font-normal mb-8">
                Looking for <br /> Something Custom?
              </h2>
              <p className="text-[#66706a] text-[18px] md:text-[20px] mb-12 leading-relaxed font-light">
                Every wedding is unique, and sometimes a standard package doesn't quite fit your vision. We offer customizable add-ons and bespoke collections for destination weddings, multi-day celebrations, and elopements.
              </p>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
                {[
                  { icon: <Clock size={20} />, text: "Extra Hours" },
                  { icon: <Users size={20} />, text: "Addl. Shooters" },
                  { icon: <BookOpen size={20} />, text: "Luxury Albums" },
                  { icon: <Camera size={20} />, text: "Film Photos" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-[13px] font-bold uppercase tracking-widest text-black">
                    <div className="text-[#5d665f]">{item.icon}</div>
                    {item.text}
                  </li>
                ))}
              </ul>
              <Button to="/packages" variant="outline" className="px-12">Request Bespoke Quote</Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl bg-gray-50"
            >
              <img src={customServiceImg} alt="Process" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
