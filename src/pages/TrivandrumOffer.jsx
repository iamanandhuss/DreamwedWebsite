import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Clock, Check, Star, ArrowRight, Gift, Flame, 
  Heart, Camera, ShieldCheck, Mail, Phone, Calendar, User, MessageSquare, AlertCircle, X, Tv, Tag
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa6";
import SEO from "../components/SEO";
import Button from "../components/ui/Button";

// Local image imports for ad & Instagram consistency
import pic1 from "../assets/images/pic1.jpeg";
import pic2 from "../assets/images/pic2.jpeg";
import pic3 from "../assets/images/pic3.jpeg";
import pic4 from "../assets/images/pic4.jpeg";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzy15y5t2F5uM9NiYPimHvlS6xDw2N1Z5oTHF3SQnR6AI_fxo6y6mhIepsUj-kav31g/exec";

const TrivandrumOffer = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", date: "", receptionDate: "", sameDate: true, message: "" });
  const [likedPacks, setLikedPacks] = useState({});

  const toggleLikePack = (e, packId) => {
    e.stopPropagation();
    setLikedPacks((prev) => ({ ...prev, [packId]: !prev[packId] }));
  };
  const [status, setStatus] = useState("idle"); 
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAlbumVideoModalOpen, setIsAlbumVideoModalOpen] = useState(false);
  const [isAddonsModalOpen, setIsAddonsModalOpen] = useState(false);
  const [activeDetailPackage, setActiveDetailPackage] = useState(null);
  const [addonsForPackage, setAddonsForPackage] = useState(null); // null, 1, 2, or 3

  // Addons configuration state
  const [selectedAddons, setSelectedAddons] = useState({
    drone: false,
    prewedVideo: false,
    ledScreen: "none" // "none", "single" (14999), "double" (24999)
  });

  const [isConfirmBookingOpen, setIsConfirmBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("Wedding Photography");
  const [selectedPackagePrice, setSelectedPackagePrice] = useState(39999);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    venue: "",
    notes: "",
    transaction_id: "",
    screenshot_file_data: ""
  });
  const [bookingStatus, setBookingStatus] = useState("idle");
  const [formErrors, setFormErrors] = useState({});

  // Automatically reset pre-wedding video if selected package already includes it (Pack 03 includes both photo and video)
  useEffect(() => {
    if (addonsForPackage === 3) {
      setSelectedAddons((prev) => ({ ...prev, prewedVideo: false }));
    }
  }, [addonsForPackage]);

  // Keyboard Escape listener to exit modals smoothly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsVideoModalOpen(false);
        setIsAlbumVideoModalOpen(false);
        setIsAddonsModalOpen(false);
        setActiveDetailPackage(null);
        setAddonsForPackage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Countdown timer that resets dynamically to midnight
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      else setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    }
    setTouchStartX(null);
  };

  const carouselImages = [
    { src: "/uploaded_bride_yellow.jpg", alt: "Dreamwed Stories Premium Portrait — Radiant Smile & Sacred Ties", position: "center 30%", fit: "object-cover" },
    { src: "/uploaded_bride_traditional.jpg", alt: "Traditional Kerala Bridal Grace — Capturing Authentic Moments", position: "center 30%", fit: "object-cover" },
    { src: "/uploaded_bride_gold.jpg", alt: "Golden Hour Traditional Splendor — Smiling Bride", position: "center 25%", fit: "object-cover" },
    { src: "/uploaded_couple_blackwhite.jpg", alt: "Breathtaking Intimate Couple Portraiture", position: "center 25%", fit: "object-cover" },
    { src: pic1, alt: "Emerald Elegance — Dancing Joyfully Hand-in-Hand", position: "center", fit: "object-cover" },
    { src: pic2, alt: "Golden Hour Romance — Holding Hands Forever", position: "center", fit: "object-cover" },
    { src: pic3, alt: "Bridal Tradition — Pure Intimacy & Whispered Promises", position: "center", fit: "object-contain" },
    { src: pic4, alt: "Cliffside Love Story — Breathtaking Wind-blown Romance", position: "center", fit: "object-contain" }
  ];

  const weddingPlans = [
    {
      id: 1,
      shareId: "pkgWeddingBasicCard",
      title: "Wedding Photography",
      subtitle: "Essential Single-Side",
      regularPrice: "60,000",
      offerPrice: "39,999",
      bonus: "LIMITED TIME OFFER",
      bonusDesc: "Save ₹20,001! Essential single-side coverage at an unbeatable price.",
      images: ["/uploaded_bride_39k_1.jpg", "/uploaded_bride_39k_2.jpg", "/uploaded_bride_39k_3.jpg", "/uploaded_bride_39k_4.jpg"],
      imagePositions: ["center 30%", "center 35%", "center 28%", "center 28%"],
      details: [
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
      ],
      description: "Our highly sought-after single-side coverage package. Designed to capture every detail of your celebrations with elite creative precision and beautiful physical heirlooms."
    },
    {
      id: 2,
      shareId: "pkgWeddingPreCard",
      title: "Wedding Photo & Pre-Wedding",
      subtitle: "Pre-Wedding & Photo",
      regularPrice: "75,000",
      offerPrice: "54,999",
      bonus: "LIMITED TIME OFFER",
      bonusDesc: "Save ₹20,001! Includes both Pre-wedding session and Wedding day coverage.",
      images: ["/prewedding_54k_1.jpg", "/prewedding_54k_2.jpg", "/prewedding_54k_3.jpg", "/prewedding_54k_4.jpg"],
      imagePositions: ["center 30%", "center 22%", "center 32%", "center 32%"],
      details: [
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
      ],
      description: "Perfect for capturing your beautiful pre-wedding love story and the complete wedding day celebrations. Includes comprehensive coverage and professional deliverables."
    },
    {
      id: 3,
      shareId: "pkgCandidCard",
      title: "Candid Photo & Videography",
      subtitle: "Artistic Candid Shots",
      regularPrice: "75,000",
      offerPrice: "69,999",
      bonus: "LIMITED TIME OFFER",
      bonusDesc: "Save ₹5,001! Professional Candid coverage for artistic wedding stories.",
      images: ["/candid_69k_1.jpg", "/candid_69k_2.jpg", "/candid_69k_3.jpg", "/candid_69k_4.jpg", "/candid_69k_5.jpg"],
      imagePositions: ["center 30%", "center 22%", "center 25%", "center 25%", "center 30%"],
      details: [
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
      ],
      description: "Our creative 3-camera setup featuring dedicated candid photography. Ideal for couples who want artistic, natural, and unstaged storytelling of their special day."
    },
    {
      id: 5,
      shareId: "pkgLuxuryCard",
      title: "Bride & Groom Luxury Package",
      subtitle: "4-Camera Dual-Side Luxury Coverage",
      regularPrice: "1,30,000",
      offerPrice: "1,10,000",
      bonus: "LIMITED TIME OFFER",
      bonusDesc: "Save ₹20,000! Ultimate luxury package with helicam, custom album boxes, and complete dual-side coverage.",
      images: ["/luxury_110k_1.jpg", "/luxury_110k_2.jpg", "/luxury_110k_3.jpg", "/luxury_110k_4.jpg"],
      imagePositions: ["center 70%", "center 28%", "center 28%", "center 28%"],
      details: [
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
      ],
      description: "Our ultimate dual-side wedding collection. Features comprehensive coverage, drone photography, and physical custom boxes for your handcrafted albums."
    }
  ];

  const weddingStandalonePlans = [
    {
      id: 10,
      shareId: "pkgWeddingStandaloneDay",
      title: "Standalone Wedding Day",
      subtitle: "8-Hour Wedding Day Only",
      regularPrice: "50,000",
      offerPrice: "39,999",
      bonus: "STANDALONE DAY ONLY",
      bonusDesc: "Professional photography & videography team for your wedding ceremony day coverage.",
      images: ["/uploaded_couple_blackwhite.jpg"],
      details: [
        "Professional Photo & Video Team",
        "Up to 8 Hours Event Coverage",
        "Premium 70-Page Layflat Album",
        "Full HD Video Film + Reels",
        "Edited Photos & High-speed Pendrive"
      ],
      description: "Dedicated professional photography & videography team for your wedding ceremony day coverage."
    },
    {
      id: 11,
      shareId: "pkgWeddingStandaloneReception",
      title: "Standalone Reception",
      subtitle: "5-Hour Reception Day Only",
      regularPrice: "40,000",
      offerPrice: "19,999",
      bonus: "RECEPTION ONLY",
      bonusDesc: "Sleek professional photo & video coverage optimized for your grand reception event.",
      images: ["/kochi_couple.jpg"],
      details: [
        "Professional Photo & Video Team",
        "Up to 5 Hours Reception Coverage",
        "Premium 50-Page Layflat Album",
        "Full HD Video Film + Highlights",
        "Edited Photos & High-speed Pendrive"
      ],
      description: "Sleek professional photo & video coverage optimized for your grand reception event."
    }
  ];

  const engagementPlans = [
    {
      id: 20,
      shareId: "pkgEngagementBasicCard",
      title: "Engagement Photography",
      subtitle: "Essential Single-Side",
      regularPrice: "20,000",
      offerPrice: "12,000",
      bonus: "Photo Only",
      bonusDesc: "Single-side photography coverage for your engagement ceremony.",
      images: ["/uploaded_bride_yellow.jpg"],
      details: [
        "Dedicated Candid & Traditional Photographer",
        "4 Hours Coverage",
        "Edited High-Res Photos"
      ],
      description: "Dedicated candid & traditional photographer coverage for your engagement ceremony."
    },
    {
      id: 21,
      shareId: "pkgEngagementPreCard",
      title: "Bride or Groom Engagement Package",
      subtitle: "Complete Single-Side Coverage",
      regularPrice: "45,000",
      offerPrice: "28,999",
      bonus: "Single-Side Photo + Video + Album",
      bonusDesc: "Our complete single-side engagement package including cinematic video, album, and reels.",
      images: ["/couple_fun_glasses.jpg"],
      details: [
        "1 Photographer + 1 Videographer",
        "4 Hours Full Event Coverage",
        "Edited High-Res Photos",
        "Premium Layflat Panoramic Album (50 Pages)",
        "Cinematic Engagement Reel",
        "Engagement Full HD Video",
        "1 Tabletop Calendar",
        "2 Premium Photo Frames",
        "1 USB Pen Drive"
      ],
      description: "Our complete single-side engagement package including cinematic video, premium layflat album, and creative reels."
    },
    {
      id: 4,
      shareId: "pkgPremiumCandidCard",
      title: "Premium Candid Package",
      subtitle: "Complete Single-Side & Drone",
      regularPrice: "1,20,000",
      offerPrice: "79,999",
      bonus: "Wedding + Pre-Wedding + Drone",
      bonusDesc: "Save ₹40,001! Complete single-side coverage including pre-wedding and aerial drone views.",
      images: ["/couple_traditional_red.jpg", pic1, pic2],
      isSpecial: true,
      details: [
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
      ],
      description: "Our comprehensive single-side coverage package. Designed for couples seeking complete pre-wedding story, wedding day, and reception coverage with aerial drone views and a premium handcrafted 100-page album."
    }
  ];

  const haldiPlans = [
    {
      id: 30,
      shareId: "pkgHaldiBasicCard",
      title: "Haldi Photography (Only)",
      subtitle: "Essential Haldi",
      regularPrice: "15,000",
      offerPrice: "10,000",
      bonus: "Photo Only",
      bonusDesc: "Dedicated single photographer capturing the vibrant colors of your Haldi ceremony.",
      images: [pic3],
      details: [
        "Dedicated Candid & Traditional Photographer",
        "4 Hours Coverage",
        "Edited High-Res Photos"
      ],
      description: "Dedicated single photographer capturing the vibrant colors and joy of your Haldi ceremony."
    },
    {
      id: 31,
      shareId: "pkgHaldiAlbumCard",
      title: "Haldi Photography with Album",
      subtitle: "Haldi with Heirloom",
      regularPrice: "22,000",
      offerPrice: "15,000",
      bonus: "Photo + Album",
      bonusDesc: "Premium Haldi photography including a beautifully printed layflat album.",
      images: ["/anandha_lekshmi.jpg"],
      details: [
        "Dedicated Candid & Traditional Photographer",
        "4 Hours Coverage",
        "Edited High-Res Photos",
        "Custom Layflat Panoramic Album (30 Pages)"
      ],
      description: "Premium Haldi photography including a beautifully printed customized layflat panoramic album."
    },
    {
      id: 32,
      shareId: "pkgHaldiPhotoVideoCard",
      title: "Haldi Photo & Videography",
      subtitle: "Haldi Photo + Video",
      regularPrice: "38,000",
      offerPrice: "28,000",
      bonus: "Complete Coverage",
      bonusDesc: "Full-spectrum cinematic and traditional coverage of your Haldi celebrations.",
      images: ["/kochi_couple.jpg"],
      details: [
        "1 Photographer + 1 Videographer",
        "4 Hours Full Haldi Coverage",
        "Edited High-Res Photos",
        "Cinematic Haldi Highlight Reel",
        "Full HD Event Video Film"
      ],
      description: "Full-spectrum cinematic and traditional coverage of your Haldi celebrations."
    }
  ];

  const addOnPlans = [
    {
      shareId: "addonLedWall",
      title: "LED Wall Setup",
      subtitle: "Receptions & Events",
      regularPrice: "22,000",
      offerPrice: "14,999",
      bonus: "Premium Live Feeds",
      desc: "Massive high-definition modular LED screen setup for receptions, displaying live feeds and cinematic videos.",
      details: "Single 8x10ft high-density LED screen with live mixer setup."
    },
    {
      shareId: "addonLiveStream",
      title: "Live Streaming Service",
      subtitle: "Global Broadcast",
      regularPrice: "18,000",
      offerPrice: "12,000",
      bonus: "HD Streaming",
      desc: "Multi-camera YouTube live streaming of your ceremony in full HD, allowing remote family to join.",
      details: "High-stability broadcast link with overlay graphics."
    },
    {
      shareId: "addonDrone",
      title: "Aerial Drone (Helicam) Coverage",
      subtitle: "Cinematic Drone",
      regularPrice: "12,000",
      offerPrice: "8,000",
      bonus: "4K Drone Views",
      desc: "Stunning 4K aerial drone coverage of your venue, entrance, and outdoor shoots.",
      details: "Licensed operator, full day event coverage."
    },
    {
      shareId: "addonPreWedding",
      title: "Cinematic Pre-Wedding Shoot",
      subtitle: "Save The Date",
      regularPrice: "15,000",
      offerPrice: "9,999",
      bonus: "Teaser Film Extra",
      desc: "A romantic cinematic pre-wedding photo and video session including edited teaser film.",
      details: "Full day shoot, cinematic output."
    }
  ];

  // Auto play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const triggerBookingModal = (packageName, packagePrice) => {
    setSelectedPackage(packageName);
    setSelectedPackagePrice(packagePrice);
    setBookingForm(prev => ({
      ...prev,
      name: formData.name || prev.name,
      phone: formData.phone || prev.phone,
      email: formData.email || prev.email,
      date: formData.date || prev.date,
      venue: formData.message || prev.venue
    }));
    setIsConfirmBookingOpen(true);
    // Silently ping the backend to pre-warm Render server before user submits
    const _apiBase = localStorage.getItem("dreamwed_api_base") || import.meta.env.VITE_API_BASE_URL || "https://dreamwed-backend.onrender.com";
    fetch(`${_apiBase}/api/health`).catch(() => {});
  };

  const handleConfirmBookingSubmit = async (e) => {
    e.preventDefault();

    // --- Validate required fields ---
    const errors = {};
    if (!bookingForm.name.trim())  errors.name  = "Please enter your full name";
    if (!bookingForm.phone.trim()) errors.phone = "Please enter your WhatsApp number";
    if (!bookingForm.email.trim()) errors.email = "Please enter your email address";
    if (!bookingForm.date.trim())  errors.date  = "Please select your wedding date";
    if (!bookingForm.venue.trim()) errors.venue = "Please enter the event venue";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to first error field
      const firstKey = Object.keys(errors)[0];
      document.getElementById(`bfield-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setFormErrors({});
    setBookingStatus("loading");
    
    const isPack04 = selectedPackage === "Candid Photo & Videography" && selectedPackagePrice === 79999;
    const selectedAddonsList = [];
    if (!isPack04 && selectedAddons.prewedVideo) {
      selectedAddonsList.push({ name: "Cinematic Pre-Wedding Shoot", price: 9999 });
    }
    if (selectedAddons.drone) {
      selectedAddonsList.push({ name: "Aerial Drone Coverage", price: 8000 });
    }
    if (selectedAddons.ledScreen === "single") {
      selectedAddonsList.push({ name: "Single LED Screen setup", price: 14999 });
    } else if (selectedAddons.ledScreen === "double") {
      selectedAddonsList.push({ name: "Double LED Screen setup", price: 24999 });
    }
    
    const addonsSum = selectedAddonsList.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = selectedPackagePrice + addonsSum;
    const advancePaid = 5000;
    
    const bookingPayload = {
      customer_name: bookingForm.name,
      customer_phone: bookingForm.phone,
      customer_email: bookingForm.email,
      event_date: bookingForm.date,
      event_venue: bookingForm.venue,
      package_name: selectedPackage,
      package_price: selectedPackagePrice,
      add_ons: selectedAddonsList,
      total_price: totalPrice,
      advance_paid: advancePaid,
      status: "pending",
      transaction_id: bookingForm.transaction_id || "",
      screenshot_file_data: bookingForm.screenshot_file_data || ""
    };

    // Google Sheets Backup Sync
    try {
      const gForm = new FormData();
      gForm.append("name", bookingForm.name);
      gForm.append("email", bookingForm.email);
      gForm.append("phone", bookingForm.phone);
      gForm.append("date", bookingForm.date);
      gForm.append("reception_date", "Wedding Booking Order");
      
      const addonsStr = selectedAddonsList.map(a => `${a.name}(₹${a.price})`).join(", ");
      gForm.append("message", `[CONFIRMED BOOKING ORDER] Package: ${selectedPackage} (₹${selectedPackagePrice}). Add-ons: [${addonsStr || 'None'}]. Venue: ${bookingForm.venue}. Notes: ${bookingForm.notes}`);
      gForm.append("timestamp", new Date().toLocaleString());
      
      fetch(SCRIPT_URL, { method: "POST", body: gForm, mode: "no-cors" }).catch(e => console.log('AppsScript backup sync error ignored'));
    } catch (gErr) {
      console.log('AppsScript payload err', gErr);
    }
    
    const API_BASE = localStorage.getItem("dreamwed_api_base") || import.meta.env.VITE_API_BASE_URL || "https://dreamwed-backend.onrender.com";
    
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });
      
      if (res.ok) {
        setBookingStatus("success");
        setTimeout(() => {
          setIsConfirmBookingOpen(false);
          setBookingStatus("idle");
          setBookingForm({ name: "", phone: "", email: "", date: "", venue: "", notes: "", transaction_id: "", screenshot_file_data: "" });
        }, 5000);
      } else {
        throw new Error(`Server error: ${res.status}`);
      }
    } catch (err) {
      console.error("Booking API error:", err);
      // Fallback: save to localStorage so booking isn't lost
      try {
        const existing = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
        const fallbackBooking = { ...bookingPayload, id: `local_${Date.now()}`, created_at: new Date().toISOString() };
        existing.push(fallbackBooking);
        localStorage.setItem("dreamwed_bookings", JSON.stringify(existing));
        setBookingStatus("success");
        setTimeout(() => {
          setIsConfirmBookingOpen(false);
          setBookingStatus("idle");
          setBookingForm({ name: "", phone: "", email: "", date: "", venue: "", notes: "", transaction_id: "", screenshot_file_data: "" });
        }, 5000);
      } catch (localErr) {
        setBookingStatus("error");
        setTimeout(() => setBookingStatus("idle"), 8000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("date", formData.date);
      form.append("reception_date", formData.sameDate ? "Same as Wedding Date" : formData.receptionDate);
      
      const dateInfo = formData.sameDate 
        ? `[Wedding & Reception: ${formData.date}]` 
        : `[Wedding: ${formData.date}] [Reception: ${formData.receptionDate}]`;

      form.append("message", `${dateInfo} [TRIVANDRUM META PACK 01/02/03/04 ₹49K-₹1.59L INQUIRY] ${formData.message}`);
      form.append("timestamp", new Date().toLocaleString());

      await fetch(SCRIPT_URL, { method: "POST", body: form, mode: "no-cors" });
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", date: "", receptionDate: "", sameDate: true, message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  const scrollToForm = () => {
    document.getElementById("booking-form").scrollIntoView({ behavior: "smooth" });
  };

  const renderPackageCard = (pack, idx) => {
    const isBestDeal = pack.isSpecial || pack.id === 3;
    const inclusionLabel =
      pack.id === 1 ? "1 Photographer · Single Side"
      : pack.id === 4 ? "🚁 Drone + 4 Camera Dual"
      : "4 Camera · Multi-Angle";
    const savePercent =
      pack.shareId === "pkgWeddingBasicCard" ? "Save 44%" :
      pack.shareId === "pkgWeddingPreCard"  ? "Save 27%" :
      pack.shareId === "pkgCandidCard"      ? "Save 22%" : "Save 12%";

    return (
      <motion.div
        key={pack.shareId || pack.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className={`group relative rounded-[28px] overflow-hidden flex flex-col cursor-pointer shadow-2xl hover:shadow-[0_32px_80px_rgba(0,0,0,0.28)] transition-all duration-700 ${
          isBestDeal
            ? "border-2 border-[#b4975a] ring-1 ring-[#b4975a]/20"
            : "border border-zinc-200/60"
        }`}
        style={{ background: "#0d0d0d" }}
      >
        {/* ── COVER IMAGE (top 60%) ── */}
        <div className="relative w-full" style={{ paddingBottom: "62%" }}>
          <img
            src={pack.images[0]}
            alt={pack.title}
            style={{ objectPosition: (pack.imagePositions && pack.imagePositions[0]) || pack.imagePosition || "center 30%" }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105"
          />
          {/* Gradient fade into dark card bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0d0d0d]" />

          {/* Badge top-left */}
          {isBestDeal ? (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-[#b4975a] text-black px-3 py-1 rounded-full text-[8px] font-extrabold uppercase tracking-widest shadow-lg">
              <Star size={9} className="fill-black" /> BEST DEAL
            </div>
          ) : (
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm text-white/80 border border-white/10 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
              ✦ {pack.bonus}
            </div>
          )}

          {/* Heart wishlist top-right */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleLikePack(e, pack.shareId || pack.id); }}
            className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer"
          >
            <Heart size={15} className={likedPacks[pack.shareId || pack.id] ? "fill-red-500 stroke-red-500" : "stroke-white"} />
          </button>

          {/* Click hint */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10">
            <span className="bg-[#b4975a] text-black text-[8px] font-extrabold tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-[#b4975a]/20 animate-pulse group-hover:bg-[#b4975a] group-hover:text-black transition-all">
              ✨ Tap Card to Open Photos & Details
            </span>
          </div>
        </div>

        {/* ── DETAILS PANEL (bottom 40%) ── */}
        <div
          className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-3"
          onClick={() => { setActiveDetailPackage(pack); setCurrentSlide(0); }}
        >
          {/* Title block */}
          <div>
            <p className="text-[#b4975a] text-[9px] font-black tracking-[0.22em] uppercase mb-0.5">{pack.subtitle}</p>
            <h3 className="text-white text-lg font-light leading-[1.15] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              {pack.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-[10px] font-light leading-relaxed line-clamp-2">{pack.description}</p>

          {/* Key inclusions row */}
          <div className="flex flex-wrap gap-1.5">
            {(pack.includes || []).slice(0, 3).map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-white/5 border border-white/8 text-white/70 px-2.5 py-1 rounded-full text-[8.5px] font-medium">
                <Check size={8} className="text-[#b4975a] shrink-0" />
                {typeof item === "string" ? item.split("(")[0].trim() : item}
              </span>
            ))}
            {(pack.includes || []).length > 3 && (
              <span className="inline-flex items-center bg-[#b4975a]/10 border border-[#b4975a]/20 text-[#b4975a] px-2.5 py-1 rounded-full text-[8.5px] font-bold">
                +{(pack.includes || []).length - 3} more
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/8" />

          {/* Price + Save row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-zinc-500 text-[9px] line-through font-light">₹{pack.regularPrice}</p>
              <p className="text-white text-xl font-extrabold leading-tight">₹{pack.offerPrice}<span className="text-[10px] font-normal text-zinc-400">/-</span></p>
              <span className="inline-block mt-0.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{savePercent}</span>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-zinc-500 font-light mb-0.5">{inclusionLabel}</p>
              {/* Countdown */}
              <div className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-red-400 font-mono text-[9px] font-bold">
                  {String(timeLeft.hours).padStart(2,"0")}:{String(timeLeft.minutes).padStart(2,"0")}:{String(timeLeft.seconds).padStart(2,"0")}
                </span>
              </div>
              <p className="text-[8px] text-zinc-600 font-light">offer closing</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerBookingModal(pack.title, parseInt(pack.offerPrice.replace(/[^0-9]/g, "")));
            }}
            className="w-full py-3 rounded-2xl font-bold text-[11px] tracking-widest uppercase transition-all duration-300 cursor-pointer active:scale-95"
            style={{
              background: isBestDeal
                ? "linear-gradient(135deg, #b4975a 0%, #d4b06a 50%, #b4975a 100%)"
                : "rgba(255,255,255,0.08)",
              color: isBestDeal ? "#0d0d0d" : "#fff",
              border: isBestDeal ? "none" : "1px solid rgba(255,255,255,0.12)",
              boxShadow: isBestDeal ? "0 8px 24px rgba(180,151,90,0.35)" : "none"
            }}
          >
            {isBestDeal ? "⭐ Secure Best Deal" : "Secure This Offer"}
          </button>
        </div>
      </motion.div>
    );
  };


  return (
    <div className="bg-[#fbfbfa] text-zinc-800 min-h-screen select-none overflow-hidden pb-20 font-sans">
      <SEO 
        title="Exclusive Bride & Groom Wedding Packages"
        description="Premium 4-Camera Wedding Photography Packages start @ Rs. 49,999/- only. Claim your slot today and receive a FREE pre-wedding shoot for a limited duration."
      />

      {/* 1. TOP STICKY URGENCY BAR */}
      <div className="fixed top-[72px] md:top-[88px] left-0 w-full bg-[#9b1c1c] text-white py-2.5 z-40 flex justify-center items-center gap-3 px-6 shadow-md border-b border-red-800">
        <span className="flex items-center gap-1.5 text-[9px] md:text-xs font-extrabold tracking-[0.15em] uppercase">
          <Flame size={12} className="fill-current text-white animate-pulse" /> Limited Time Offer
        </span>
        <span className="text-[10px] md:text-xs opacity-50">|</span>
        <span className="text-[9px] md:text-xs font-bold tracking-[0.05em] uppercase flex items-center gap-2">
          FREE Pre-Wedding Shoot expires in: 
          <span className="bg-black text-white px-2 py-0.5 rounded font-mono text-[10px] md:text-xs">
            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </span>
      </div>

      {/* 2. HERO HEADER SECTION (Vibrant Light & Soft Organic Theme) */}
      <section className="relative pt-44 pb-16 px-6 overflow-hidden bg-white border-b border-zinc-100">
        {/* Red Angled Ribbon in top-left (Matches the ad creative perfectly!) */}
        <div className="absolute top-36 left-[-60px] w-[240px] bg-[#9b1c1c] text-white py-2 text-center text-[10px] font-bold tracking-widest uppercase rotate-[-35deg] shadow-md z-10 hidden lg:block">
          Special Deal
        </div>

        {/* Soft emerald background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1e3f20]/5 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#1e3f20]/5 border border-[#1e3f20]/10 px-5 py-2 rounded-full text-[#1e3f20] text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase"
          >
            <Sparkles size={12} className="text-[#b4975a]" /> Exclusively for Trivandrum Couples
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-4xl sm:text-6xl md:text-7xl text-zinc-900 font-light tracking-tight leading-[1.1]"
          >
            Wedding Photography <br className="hidden sm:block" />
            <span className="font-serif italic font-light text-[#b4975a]">Package Redefined</span>
          </motion.h1>

          {/* Malayalam Quote (From the ad creative) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto pt-2"
          >
            <p className="text-zinc-500 font-serif italic text-base sm:text-lg leading-relaxed">
              " ചില നിമിഷങ്ങൾ എന്നും ഓർമ്മയിൽ സൂക്ഷിക്കാൻ ഉള്ളതാണ് "
            </p>
            <span className="block text-zinc-400 text-[10px] tracking-widest uppercase font-bold mt-1.5">— Some moments are meant to be preserved forever</span>
          </motion.div>

          {/* Redesigned Sliding Photo Carousel */}
          <div
            className="relative max-w-lg mx-auto aspect-[3/4] rounded-[32px] overflow-hidden border-4 border-white shadow-[0_25px_60px_rgba(0,0,0,0.1)] bg-zinc-100 group select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentSlide}
                src={carouselImages[currentSlide].src}
                alt={carouselImages[currentSlide].alt}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ objectPosition: carouselImages[currentSlide].position || "center" }}
                className={`w-full h-full ${carouselImages[currentSlide].fit || "object-cover"} select-none pointer-events-none bg-zinc-900`}
              />
            </AnimatePresence>

            {/* Left/Right Nav Buttons — always visible on mobile, hover-only on desktop */}
            <button 
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-md flex items-center justify-center text-zinc-800 shadow-md opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto z-20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-md flex items-center justify-center text-zinc-800 shadow-md opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto z-20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Floating Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
              {/* Image Description Tag */}
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-[9px] font-bold tracking-widest uppercase">
                {carouselImages[currentSlide].alt.split(" — ")[0]}
              </div>
              
              {/* Dot Indicators */}
              <div className="flex gap-1.5 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/5">
                {carouselImages.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide ? "bg-[#b4975a] scale-125" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Top Red Urgency Badge inside Carousel */}
            <div className="absolute top-4 left-4 bg-[#9b1c1c] text-white px-3.5 py-1.5 rounded-full text-[9px] font-extrabold tracking-widest uppercase shadow-md pointer-events-none z-10 animate-pulse">
              Special Offer
            </div>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={scrollToForm}
              className="w-full sm:w-auto px-12 py-5 bg-[#9b1c1c] hover:bg-[#801414] text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_10px_35px_rgba(155,28,28,0.25)] text-xs tracking-widest uppercase"
            >
              Book Your Slots Now <ArrowRight size={14} className="inline ml-2" />
            </button>
            <button 
              onClick={() => document.getElementById("reels-wow").scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto px-12 py-5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 text-xs tracking-widest uppercase"
            >
              Watch Video Teaser
            </button>
          </motion.div>
        </div>
      </section>

      {/* 3. CORE PACKAGE DETAILS (Dual-Column side-by-side grid) */}
      <section className="py-24 px-6 bg-white border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          
          {/* Urgency Announcement */}
          <div className="mb-16 bg-[#1e3f20]/5 border border-[#1e3f20]/20 p-6 sm:p-8 rounded-[28px] max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#1e3f20]/10 flex items-center justify-center text-[#1e3f20] shrink-0">
              <Gift size={26} />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <span className="inline-block bg-[#1e3f20] text-white px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">Special Launch Bonus</span>
              <h3 className="text-xl sm:text-2xl text-[#1e3f20] font-medium tracking-tight">FREE Pre-Wedding Shoot Included!</h3>
              <p className="text-zinc-600 text-xs sm:text-sm font-light leading-relaxed">
                When you secure our Special Bride or Groom packages in the next 2 slots, we will include a completely **FREE Pre-Wedding session** worth up to ₹30,000!
              </p>
            </div>
          </div>

          <div className="text-center mb-16 space-y-4">
            <span className="text-[#b4975a] text-xs font-bold tracking-[0.2em] uppercase">Premium Offer Packages</span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Claim Your <span className="italic font-serif text-[#b4975a]">Exclusive Pricing</span>
            </h2>
            <p className="text-zinc-500 font-light text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Compare our wedding packages and lock in your special discount today! All packages include a professional setup and premium deliverables.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-[#b4975a]/10 border border-[#b4975a]/20 px-5 py-2.5 rounded-full text-[#b4975a] text-[11px] font-bold uppercase tracking-wider animate-pulse">
              💡 Tip: Click or tap any package card to view actual photos & full details!
            </div>
            
            {/* Highly interactive Add-ons badge trigger */}
            <button 
              onClick={() => { setActiveDetailPackage(1); setCurrentSlide(0); }}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1e3f20] to-[#2d5c30] text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_4px_15px_rgba(30,63,32,0.2)] cursor-pointer select-none"
            >
              ✨ Customize with Premium Add-ons <Sparkles size={11} className="animate-pulse" />
            </button>
          </div>

          {/* Sticky Sub-navigation Bar (Light Theme) */}
          <div className="sticky top-[72px] md:top-[88px] z-30 py-4 bg-[#fbfbfa]/90 backdrop-blur-md border-b border-zinc-200 mb-16 select-none flex justify-center">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
                {weddingPlans.map((pack, idx) => renderPackageCard(pack, idx))}
              </div>

              {/* Standalone Wedding Row */}
              <div className="space-y-8 pt-12 border-t border-zinc-200">
                <div className="text-center space-y-2">
                  <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">Standalone Wedding Coverages</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
                  {weddingStandalonePlans.map((pack, idx) => renderPackageCard(pack, idx))}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                {engagementPlans.map((pack, idx) => renderPackageCard(pack, idx))}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                {haldiPlans.map((pack, idx) => renderPackageCard(pack, idx))}
              </div>
            </div>

            {/* SECTION 4: ADD-ONS */}
            <div id="sec-add-ons" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.2em] uppercase">Customizations</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Premium <span className="italic font-serif text-[#b4975a]">Add-ons</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
                {addOnPlans.map((addon) => (
                  <div key={addon.shareId} className="bg-white p-6 sm:p-8 rounded-[32px] border border-zinc-200/60 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:border-[#1e3f20]/25 group">
                    <div className="space-y-4">
                      <span className="inline-flex bg-[#1e3f20]/5 text-[#1e3f20] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">Add-on Option</span>
                      <h4 className="text-[20px] font-normal leading-tight text-zinc-900">{addon.title}</h4>
                      <p className="text-[28px] font-normal text-[#9b1c1c] numbers-pro">{addon.offerPrice}</p>
                      <p className="text-zinc-500 text-xs font-light leading-relaxed">{addon.desc}</p>
                      <div className="text-[10px] text-zinc-400 font-medium border-t border-zinc-100 pt-3">
                        {addon.details}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, message: `Hi! I am interested in adding the ${addon.title} (${addon.offerPrice}) to my package.` }); scrollToForm(); }}
                      className="w-full py-3 mt-8 bg-gradient-to-r from-zinc-50 to-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-[10px] tracking-widest uppercase font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] select-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Add to Booking
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PREMIUM HANDCRAFTED ALBUMS SHOWCASE */}
      <section className="py-24 px-6 bg-white border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[#1e3f20] text-xs font-bold tracking-[0.25em] uppercase">
              ✦ Handcrafted Heirloom Art — Click to Play Video
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-5xl text-zinc-900 font-light tracking-tight">
              Our Premium <span className="italic font-serif text-[#b4975a]">Layflat Wedding Albums</span>
            </h2>
            <p className="text-zinc-500 font-light text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Every couple receives our premium signature album package—handcrafted with layflat panoramic spreads, organic leatherette textures, and lifetime archival guarantees.
            </p>
          </div>

          <div className="bg-[#fbfbfa] rounded-[36px] border border-zinc-200 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Real-life Album Cover Mockup */}
            <div className="relative group flex flex-col items-center">
              {/* Main Album Card */}
              <div 
                onClick={() => setIsAlbumVideoModalOpen(true)}
                className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-zinc-100 transform -rotate-1 group-hover:rotate-0 transition-transform duration-500 cursor-pointer hover:shadow-emerald-950/10"
              >
                <img 
                  src="/anandha_lekshmi.jpg" 
                  alt="Ananthalakshmi & Deepak Premium Album Cover" 
                  className="w-full h-full object-cover filter brightness-[0.85] group-hover:brightness-[0.75] transition-all duration-500" 
                />
                
                {/* Glowing, pulsing play button overlay in the center */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#9b1c1c] text-white flex items-center justify-center shadow-[0_0_35px_rgba(155,28,28,0.5)] border border-red-500/25 relative"
                  >
                    <span className="absolute inset-0 rounded-full bg-[#9b1c1c] opacity-35 animate-ping pointer-events-none" style={{ animationDuration: "2s" }} />
                    <svg className="w-5 h-5 fill-current text-white translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>

                {/* Album Gutter Line Shadow (gives the real book layflat feel) */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-black/20 shadow-xl" />
                
                {/* Embossed Text Overlay (matches the real cover text from your story highlight!) */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 text-center shadow-lg transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-500">
                  <span className="block font-serif text-sm sm:text-base text-zinc-800 tracking-wide font-medium">Ananthalakshmi & Deepak</span>
                  <span className="block text-[8px] sm:text-[9px] text-[#b4975a] font-bold tracking-widest uppercase mt-0.5">27 January 2024 — Layflat Heirloom</span>
                </div>
              </div>

              {/* Behind/Floating Mini Album replica shadow card */}
              <div className="absolute top-4 -right-4 -z-10 aspect-[4/3] w-[80%] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-zinc-200 transform rotate-3 opacity-60 hidden sm:block">
                <img 
                  src="/anandha_lekshmi.jpg" 
                  alt="Mini Album Replica" 
                  className="w-full h-full object-cover filter blur-[0.5px]" 
                />
              </div>

              {/* Help Caption below album card */}
              <span className="text-[10px] text-zinc-400 font-serif italic mt-5 block tracking-wide select-none group-hover:text-zinc-600 transition-colors animate-pulse">
                *Click the album cover to watch our physical layflat albums reel!
              </span>
            </div>

            {/* Right Side: Album Features Description List */}
            <div className="space-y-6">
              <div className="space-y-2 pb-4 border-b border-zinc-100">
                <span className="text-[#b4975a] text-[10px] font-bold tracking-widest uppercase block">Uncompromising Quality</span>
                <h3 className="text-2xl sm:text-3xl text-zinc-900 font-normal tracking-tight">The Story Highlight Standard</h3>
                <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">
                  As shown in our Instagram highlights, we do not cut corners. Your digital memories are translated into handcrafted physical luxury art.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Archival Matte Fine-Art Papers", desc: "Chemical-free papers imported to ensure vivid colors and moisture resistance for over 100 years." },
                  { title: "Seamless Layflat Panoramic Binding", desc: "No middle gutter cut-offs or stitch-marks—allowing beautiful spreads to breathe across double pages." },
                  { title: "Direct Mini Album Replicas", desc: "Pocket-sized exact replicas of your main album cover, handcrafted specifically for parents." },
                  { title: "Premium Protective Leather Case", desc: "Includes custom felt album bags and handcrafted luxury cases to protect from external dust." }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-[#1e3f20]/10 text-[#1e3f20] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <div>
                      <span className="block text-zinc-800 text-xs sm:text-sm font-bold">{item.title}</span>
                      <span className="block text-zinc-500 text-[11px] sm:text-xs font-light leading-relaxed mt-0.5">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. THE "WOW" PRE-WEDDING FILM SHOWCASE (Immersive Active Cover Card & Cinematic Modal) */}
      <section id="reels-wow" className="py-24 px-6 bg-[#fbfbfa] relative">
        {/* Soft elegant glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1e3f20]/5 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[#1e3f20] text-xs font-bold tracking-[0.25em] uppercase">
              <Gift size={12} className="text-[#b4975a]" /> Experience The Wow Factor
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl sm:text-5xl md:text-6xl text-zinc-900 font-light tracking-tight">
              Watch Our <span className="italic font-serif text-[#b4975a]">Cinematic Storytelling</span>
            </h2>
            <p className="text-zinc-500 font-light text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Experience the breath-taking moments of our custom color-graded couples. We edit and frame your memories into high-end romance films.
            </p>
          </div>

          {/* Immersive white player card with actual screenshots/visuals matching ad creative */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            onClick={() => setIsVideoModalOpen(true)}
            className="relative w-full rounded-[36px] overflow-hidden border border-zinc-200 shadow-[0_30px_70px_rgba(0,0,0,0.06)] bg-white p-3 md:p-4 z-10 cursor-pointer group select-none hover:shadow-[0_35px_80px_rgba(30,63,32,0.08)] transition-shadow duration-500"
          >
            {/* Elegant inner wrapper with pre-wedding couple background */}
            <div className="relative aspect-video w-full rounded-[24px] overflow-hidden bg-zinc-900 shadow-inner">
              <img 
                src={pic2} 
                alt="Dreamwed Stories Cinematic Prewed" 
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
              />
              
              {/* Soft overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/40" />

              {/* A. BRAND BADGE (TOP LEFT) - Matches your modern prewed theme perfectly */}
              <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-3 z-20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg font-serif text-white font-bold text-xs sm:text-sm tracking-tighter">
                  DW
                </div>
                <div className="text-left select-none">
                  <span className="block text-white font-extrabold text-xs sm:text-base tracking-tight uppercase leading-tight">
                    modern prewed
                  </span>
                  <span className="block text-zinc-300 text-[8px] sm:text-[10px] font-bold tracking-wider uppercase">
                    Dreamwed stories
                  </span>
                </div>
              </div>

              {/* B. GLOWING PULSING PLAY BUTTON (CENTER) */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#9b1c1c] text-white flex items-center justify-center shadow-[0_0_40px_rgba(155,28,28,0.55)] transition-all duration-300 border border-red-500/25 relative"
                >
                  <span className="absolute inset-0 rounded-full bg-[#9b1c1c] opacity-35 animate-ping pointer-events-none" style={{ animationDuration: "2s" }} />
                  <svg className="w-5 h-5 sm:w-7 sm:h-7 fill-current text-white translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
              </div>

              {/* C. PREMIUM STATS OVERLAY CARD (BOTTOM OVERFLOW) */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 bg-white/95 backdrop-blur-md px-4 py-4 sm:py-6 rounded-[22px] border border-zinc-200/50 flex justify-around items-center text-center shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-20 select-none transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-500">
                <div className="flex-1">
                  <span className="block text-[#1e3f20] font-extrabold text-sm sm:text-2xl leading-none">124,500+</span>
                  <span className="text-zinc-400 text-[7px] sm:text-[9px] tracking-wider uppercase font-extrabold mt-1 sm:mt-1.5 block">Instagram Views</span>
                </div>
                <div className="w-px h-6 sm:h-8 bg-zinc-200/80" />
                <div className="flex-1">
                  <span className="block text-[#1e3f20] font-extrabold text-sm sm:text-2xl leading-none">12,450+</span>
                  <span className="text-zinc-400 text-[7px] sm:text-[9px] tracking-wider uppercase font-extrabold mt-1 sm:mt-1.5 block">Likes Received</span>
                </div>
                <div className="w-px h-6 sm:h-8 bg-zinc-200/80" />
                <div className="flex-1">
                  <span className="block text-[#1e3f20] font-extrabold text-sm sm:text-2xl leading-none">99.8%</span>
                  <span className="text-zinc-400 text-[7px] sm:text-[9px] tracking-wider uppercase font-extrabold mt-1 sm:mt-1.5 block">Couple Love Score</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Testimonial Quote */}
          <div className="mt-20 text-center max-w-2xl mx-auto space-y-4">
            <p className="text-zinc-600 font-serif italic text-base sm:text-xl leading-relaxed">
              "The cinematic pre-wedding film on the boat made our entire family cry! The shots look like a high-budget Bollywood movie. Simply spectacular work!"
            </p>
            <span className="block text-zinc-500 text-[10px] tracking-widest font-bold uppercase">— Chindu & Athira (Destination Couple)</span>
          </div>

        </div>
      </section>


      {/* 6. DYNAMIC HIGH-CONVERTING BOOKING FORM (Clean White Card Layout) */}
      <section id="booking-form" className="py-24 px-6 bg-[#fbfbfa] relative">
        <div className="max-w-xl mx-auto space-y-10 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-[#b4975a] text-xs font-semibold tracking-[0.2em] uppercase">Claim Your Slot</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl md:text-5xl text-zinc-900 font-light tracking-tight">
              Lock In <span className="italic font-serif text-[#b4975a]">Your Wedding Date</span>
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">
              Verify our availability for your wedding day. Secure your special ₹39,999/-, ₹54,999/-, ₹69,999/- or ₹79,999/- ad package and claim your **FREE Pre-Wedding Shoot** bonus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 sm:p-10 rounded-[32px] border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative">
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  required
                  placeholder="Athulraj"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 text-zinc-800 text-sm focus:border-[#9b1c1c] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 9995412955"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 text-zinc-800 text-sm focus:border-[#9b1c1c] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Wedding Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 text-zinc-800 text-sm focus:border-[#9b1c1c] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={formData.sameDate}
                    onChange={(e) => setFormData({ ...formData, sameDate: e.target.checked })}
                    className="accent-[#9b1c1c] w-4.5 h-4.5 rounded cursor-pointer"
                  />
                  <span className="text-[10px] sm:text-[11px] text-zinc-600 font-light">Reception and Wedding are on the same date</span>
                </label>
              </div>
            </div>

            {/* Conditionally reveal Reception Date with standard clean animation */}
            <AnimatePresence>
              {!formData.sameDate && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Reception Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      type="date" 
                      required={!formData.sameDate}
                      value={formData.receptionDate}
                      onChange={(e) => setFormData({ ...formData, receptionDate: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 text-zinc-800 text-sm focus:border-[#9b1c1c] focus:outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="email" 
                  required
                  placeholder="athul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 text-zinc-800 text-sm focus:border-[#9b1c1c] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Event Venue & Details</label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-4 top-5 text-zinc-400" />
                <textarea 
                  rows="3"
                  placeholder="Please specify your wedding hall/venue in Trivandrum..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 text-zinc-800 text-sm focus:border-[#9b1c1c] focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 bg-[#9b1c1c] text-white font-bold rounded-xl hover:bg-[#801414] active:scale-98 transition-all text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2"
            >
              {status === "loading" ? "Submitting Inquiry..." : "Lock in My Special Offer"}
            </button>

            <AnimatePresence>
              {status === "success" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs text-center flex items-center gap-2"
                >
                  <Check size={16} className="shrink-0 text-green-600" />
                  🎉 Success! Details submitted. Our team will contact you within 2 hours to confirm availability and claim your FREE Pre-Wedding shoot!
                </motion.div>
              )}
              {status === "error" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs text-center flex items-center gap-2"
                >
                  <AlertCircle size={16} className="shrink-0 text-red-600" />
                  ⚠️ Error submitting. Please click the WhatsApp button below to message us directly!
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Direct WhatsApp Call options */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
            <a 
              href="https://wa.me/919995412955?text=Hello%20Dreamwed%20Stories,%20I%20would%20like%20to%20claim%20the%20Bride%20and%20Groom%20Special%20Offer!"
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#1ebd57] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 text-xs tracking-wider uppercase"
            >
              <FaWhatsapp size={18} /> Chat on WhatsApp
            </a>
            <a 
              href="tel:+919995412955"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-200 border border-zinc-300 hover:bg-zinc-300 text-zinc-800 font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 text-xs tracking-wider uppercase"
            >
              Call +91 9995412955
            </a>
          </div>

        </div>
      </section>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/919995412955?text=Hello%20Dreamwed%20Stories,%20I%20would%20like%20to%20claim%20the%20Bride%20and%20Groom%20Special%20Offer!"
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#1ebd57] hover:scale-110 active:scale-95 transition-all duration-300 rounded-full flex items-center justify-center text-white shadow-2xl z-50 animate-bounce"
        style={{ animationDuration: "3s" }}
      >
        <FaWhatsapp size={28} />
      </a>

      {/* 8. INTERACTIVE BOOKING CONFIRMATION MODAL */}
      <AnimatePresence>
        {isConfirmBookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setIsConfirmBookingOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl rounded-[32px] bg-white p-8 border border-zinc-200 shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden text-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsConfirmBookingOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/50 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-all hover:rotate-90 duration-300 z-10 cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[#b4975a] text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">Secure Your Wedding Offer</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-zinc-900 font-light tracking-tight">
                    Confirm Your <span className="italic font-serif text-[#b4975a]">Booking Request</span>
                  </h3>
                  <p className="text-zinc-500 text-[11px] font-light mt-1">
                    Fill out the reservation form below. We will check availability for your date, save a pending invoice, and send a coordinator to confirm details.
                  </p>
                </div>

                {/* Pre-selected package card summary */}
                <div className="bg-[#fbfbfa] border border-zinc-200/60 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b4975a]">Package Chosen</span>
                      <h4 className="text-base font-semibold text-zinc-900 mt-0.5">{selectedPackage}</h4>
                    </div>
                    <span className="text-base font-bold text-[#9b1c1c]">₹{selectedPackagePrice.toLocaleString("en-IN")}</span>
                  </div>
                  
                  {/* Real-time Dynamic Add-ons Selector */}
                  <div className="border-t border-zinc-200/60 pt-3 mt-2 space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Customize Optional Add-ons</span>
                    
                    {/* Cinematic Pre-wedding check (Unless it's Pack 04, which includes it free) */}
                    {!(selectedPackage === "Candid Photo & Videography" && selectedPackagePrice === 79999) ? (
                      <label className="flex items-center justify-between text-xs text-zinc-600 cursor-pointer py-1 hover:text-zinc-900 select-none">
                        <span className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={selectedAddons.prewedVideo}
                            onChange={(e) => setSelectedAddons({ ...selectedAddons, prewedVideo: e.target.checked })}
                            className="accent-[#9b1c1c] w-4.5 h-4.5 rounded cursor-pointer"
                          />
                          <span>Cinematic Pre-Wedding Shoot Add-on</span>
                        </span>
                        <span className="font-semibold text-zinc-800">+ ₹9,999</span>
                      </label>
                    ) : (
                      <div className="flex justify-between text-xs text-emerald-700 py-1 font-medium bg-emerald-50/50 px-3 rounded-lg border border-emerald-100">
                        <span>Cinematic Pre-Wedding shoot</span>
                        <span className="uppercase text-[9px] tracking-wider font-bold">Included Free</span>
                      </div>
                    )}

                    <label className="flex items-center justify-between text-xs text-zinc-600 cursor-pointer py-1 hover:text-zinc-900 select-none">
                      <span className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedAddons.drone}
                          onChange={(e) => setSelectedAddons({ ...selectedAddons, drone: e.target.checked })}
                          className="accent-[#9b1c1c] w-4.5 h-4.5 rounded cursor-pointer"
                        />
                        <span>Aerial Drone Coverage</span>
                      </span>
                      <span className="font-semibold text-zinc-800">+ ₹8,000</span>
                    </label>

                    <div className="flex items-center justify-between text-xs text-zinc-600 py-1">
                      <span className="flex items-center gap-2">
                        <Tv size={14} className="text-zinc-400" />
                        <span>Rental LED Screen Setup</span>
                      </span>
                      <select
                        value={selectedAddons.ledScreen}
                        onChange={(e) => setSelectedAddons({ ...selectedAddons, ledScreen: e.target.value })}
                        className="bg-zinc-50 border border-zinc-200 rounded px-2 py-0.5 text-zinc-800 font-medium text-xs focus:outline-none"
                      >
                        <option value="none">No LED Screen</option>
                        <option value="single">Single screen (+₹14,999)</option>
                        <option value="double">Double screen (+₹24,999)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated live total */}
                  <div className="border-t border-zinc-200/60 pt-3 flex justify-between items-center text-sm font-bold">
                    <span className="text-zinc-800">Total Booking Value:</span>
                    <span className="text-lg text-[#9b1c1c]">
                      ₹{(
                        selectedPackagePrice + 
                        (!(selectedPackage === "Candid Photo & Videography" && selectedPackagePrice === 79999) && selectedAddons.prewedVideo ? 9999 : 0) + 
                        (selectedAddons.drone ? 8000 : 0) + 
                        (selectedAddons.ledScreen === "single" ? 14999 : selectedAddons.ledScreen === "double" ? 24999 : 0)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handleConfirmBookingSubmit} className="space-y-4" noValidate>

                  {/* Row 1: Name + Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1" id="bfield-name">
                      <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">
                        Full Names <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={bookingForm.name}
                        onChange={(e) => { setBookingForm({ ...bookingForm, name: e.target.value }); if (formErrors.name) setFormErrors(p => ({...p, name: ""})); }}
                        placeholder="Athul & Priya"
                        className={`w-full bg-zinc-50 border rounded-xl py-3 px-4 text-zinc-800 text-xs focus:outline-none transition-colors ${formErrors.name ? "border-red-400 bg-red-50 focus:border-red-500" : "border-zinc-200 focus:border-[#9b1c1c]"}`}
                      />
                      {formErrors.name && <p className="text-red-500 text-[9px] font-medium flex items-center gap-1"><AlertCircle size={9} /> {formErrors.name}</p>}
                    </div>
                    <div className="space-y-1" id="bfield-phone">
                      <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={bookingForm.phone}
                        onChange={(e) => { setBookingForm({ ...bookingForm, phone: e.target.value }); if (formErrors.phone) setFormErrors(p => ({...p, phone: ""})); }}
                        placeholder="+91 9995412955"
                        className={`w-full bg-zinc-50 border rounded-xl py-3 px-4 text-zinc-800 text-xs focus:outline-none transition-colors ${formErrors.phone ? "border-red-400 bg-red-50 focus:border-red-500" : "border-zinc-200 focus:border-[#9b1c1c]"}`}
                      />
                      {formErrors.phone && <p className="text-red-500 text-[9px] font-medium flex items-center gap-1"><AlertCircle size={9} /> {formErrors.phone}</p>}
                    </div>
                  </div>

                  {/* Row 2: Email + Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1" id="bfield-email">
                      <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => { setBookingForm({ ...bookingForm, email: e.target.value }); if (formErrors.email) setFormErrors(p => ({...p, email: ""})); }}
                        placeholder="athul@example.com"
                        className={`w-full bg-zinc-50 border rounded-xl py-3 px-4 text-zinc-800 text-xs focus:outline-none transition-colors ${formErrors.email ? "border-red-400 bg-red-50 focus:border-red-500" : "border-zinc-200 focus:border-[#9b1c1c]"}`}
                      />
                      {formErrors.email && <p className="text-red-500 text-[9px] font-medium flex items-center gap-1"><AlertCircle size={9} /> {formErrors.email}</p>}
                    </div>
                    <div className="space-y-1" id="bfield-date">
                      <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">
                        Wedding Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => { setBookingForm({ ...bookingForm, date: e.target.value }); if (formErrors.date) setFormErrors(p => ({...p, date: ""})); }}
                        className={`w-full bg-zinc-50 border rounded-xl py-3 px-4 text-zinc-800 text-xs focus:outline-none transition-colors ${formErrors.date ? "border-red-400 bg-red-50 focus:border-red-500" : "border-zinc-200 focus:border-[#9b1c1c]"}`}
                      />
                      {formErrors.date && <p className="text-red-500 text-[9px] font-medium flex items-center gap-1"><AlertCircle size={9} /> {formErrors.date}</p>}
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="space-y-1" id="bfield-venue">
                    <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">
                      Event Venue & Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingForm.venue}
                      onChange={(e) => { setBookingForm({ ...bookingForm, venue: e.target.value }); if (formErrors.venue) setFormErrors(p => ({...p, venue: ""})); }}
                      placeholder="e.g. Al Saj Convention Centre, Trivandrum"
                      className={`w-full bg-zinc-50 border rounded-xl py-3 px-4 text-zinc-800 text-xs focus:outline-none transition-colors ${formErrors.venue ? "border-red-400 bg-red-50 focus:border-red-500" : "border-zinc-200 focus:border-[#9b1c1c]"}`}
                    />
                    {formErrors.venue && <p className="text-red-500 text-[9px] font-medium flex items-center gap-1"><AlertCircle size={9} /> {formErrors.venue}</p>}
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Additional Notes / Special Requests</label>
                    <textarea
                      rows="2"
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      placeholder="Any customized album requirements, coverage times, etc..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-800 text-xs focus:border-[#9b1c1c] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* ── UPI Payment Section (OPTIONAL) ── */}
                  <div className="bg-gradient-to-br from-[#fffdf7] to-[#fdf8ed] border border-[#e2c97e]/60 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#b4975a]/15 flex items-center justify-center shrink-0">
                          <span className="text-sm">💳</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9b6f1e]">Send Advance ₹5,000 to Lock Your Date</p>
                          <p className="text-[9px] text-zinc-400 font-light mt-0.5">Upload proof after sending — speeds up approval</p>
                        </div>
                      </div>
                      <span className="shrink-0 inline-block bg-zinc-100 border border-zinc-200 text-zinc-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Optional</span>
                    </div>
                    <div className="bg-white border border-[#e2c97e]/50 rounded-xl px-4 py-2.5 text-center shadow-sm">
                      <p className="text-[9px] text-zinc-400 font-medium mb-0.5 uppercase tracking-widest">UPI ID</p>
                      <p className="text-sm font-extrabold text-zinc-900 font-mono tracking-widest select-all">dreamwedstories@okaxis</p>
                      <p className="text-[9px] text-zinc-400 mt-0.5">Google Pay · PhonePe · Paytm · Any UPI</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase flex items-center gap-1">
                          UPI Transaction ID <span className="text-[8px] text-zinc-300 normal-case font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={bookingForm.transaction_id}
                          onChange={(e) => setBookingForm({ ...bookingForm, transaction_id: e.target.value })}
                          placeholder="e.g. 3209xxxxxxxx"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none transition-colors font-mono placeholder:text-zinc-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase flex items-center gap-1">
                          Payment Screenshot <span className="text-[8px] text-zinc-300 normal-case font-normal">(optional)</span>
                        </label>
                        <label className={`w-full border border-dashed rounded-xl py-2.5 px-3 text-[10px] flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          bookingForm.screenshot_file_data
                            ? "bg-green-50 border-green-300 text-green-700"
                            : "bg-zinc-50 border-zinc-300 hover:border-[#b4975a] text-zinc-400"
                        }`}>
                          {bookingForm.screenshot_file_data
                            ? <><span className="font-bold text-base leading-none">✓</span><span className="font-semibold">Attached</span></>
                            : <><Camera size={12} /><span>Upload</span></>}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => setBookingForm(prev => ({ ...prev, screenshot_file_data: ev.target.result }));
                            reader.readAsDataURL(file);
                          }} />
                        </label>
                      </div>
                    </div>
                    {bookingForm.screenshot_file_data && (
                      <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-2.5">
                        <img src={bookingForm.screenshot_file_data} alt="Payment proof" className="w-12 h-12 rounded-lg object-cover border border-green-200 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-green-700">Screenshot attached ✓</p>
                          <p className="text-[9px] text-green-500 font-light">Admin will verify before approval</p>
                        </div>
                        <button type="button" onClick={() => setBookingForm(prev => ({ ...prev, screenshot_file_data: "" }))} className="text-red-400 hover:text-red-600 text-[10px] font-bold cursor-pointer shrink-0">✕</button>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={bookingStatus === "loading"}
                    className="w-full py-4 bg-[#9b1c1c] text-white font-bold rounded-xl hover:bg-[#801414] active:scale-98 transition-all text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    {bookingStatus === "loading" ? "Submitting Booking..." : "Confirm Booking Request"}
                  </button>
                </form>

                <AnimatePresence>
                  {bookingStatus === "success" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs text-center flex items-center gap-2"
                    >
                      <Check size={16} className="shrink-0 text-green-600" />
                      🎉 Booking submitted successfully! Our coordinator will contact you on WhatsApp to confirm details, and your printable pending invoice is registered!
                    </motion.div>
                  )}
                  {bookingStatus === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs text-center flex items-center gap-2"
                    >
                      <AlertCircle size={16} className="shrink-0 text-red-600" />
                      ⚠️ Server connection error. We have backup synced your details! Please WhatsApp us directly to confirm dates immediately.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CINEMATIC THEATER MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl rounded-[32px] overflow-hidden bg-zinc-950 p-2 sm:p-3 border border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button with circular layout */}
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all hover:rotate-90 duration-300 z-50 cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* 16:9 Aspect Video Embed Container */}
              <div className="relative aspect-video w-full rounded-[24px] overflow-hidden bg-black shadow-inner">
                <iframe
                  src="https://www.youtube.com/embed/S9-SrdnKsMs?autoplay=1&mute=0&loop=1&playlist=S9-SrdnKsMs&controls=1&modestbranding=1&rel=0"
                  title="Cinematic pre-wedding film"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ border: 0 }}
                ></iframe>
              </div>

              {/* Theater footer details */}
              <div className="pt-4 pb-2 px-4 flex justify-between items-center text-zinc-400 text-[10px] sm:text-xs font-semibold tracking-wider uppercase select-none">
                <span>Dreamwed Stories — Cinematic Pre-Wedding Film</span>
                <span className="hidden sm:inline opacity-60">Press ESC to close theater</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HANDCRAFTED LAYFLAT ALBUMS REEL MODAL */}
      <AnimatePresence>
        {isAlbumVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsAlbumVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md rounded-[32px] overflow-hidden bg-zinc-950 p-2 sm:p-3 border border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button with circular layout */}
              <button
                onClick={() => setIsAlbumVideoModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all hover:rotate-90 duration-300 z-50 cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Vertical 9:16 Aspect Video Embed Container */}
              <div className="relative aspect-[9/16] w-full rounded-[24px] overflow-hidden bg-black shadow-inner">
                <iframe
                  src="https://www.instagram.com/reel/C428oQZpPJb/embed/"
                  title="Handcrafted Layflat Albums Showcase Reel"
                  allowTransparency="true"
                  frameBorder="0"
                  scrolling="no"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ border: 0 }}
                ></iframe>
              </div>

              {/* Theater footer details */}
              <div className="pt-4 pb-2 px-4 flex justify-between items-center text-zinc-400 text-[10px] sm:text-xs font-semibold tracking-wider uppercase select-none">
                <span>Dreamwed Stories — Premium Layflat Albums Reel</span>
                <span className="hidden sm:inline opacity-60">Press ESC to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM PACKAGE CUSTOM ADD-ONS MODAL */}
      <AnimatePresence>
        {isAddonsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setIsAddonsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg rounded-[36px] bg-white border border-zinc-100 p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.2)] flex flex-col gap-6 text-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsAddonsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/50 flex items-center justify-center text-zinc-600 transition-all hover:rotate-90 duration-300 z-50 cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Modal Header */}
              <div className="space-y-1.5 pr-6">
                <span className="inline-flex items-center gap-1 bg-[#1e3f20]/10 text-[#1e3f20] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                  Premium Extras
                </span>
                <h3 className="text-2xl text-zinc-900 font-semibold tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Customize Your Package
                </h3>
                <p className="text-zinc-500 font-light text-xs leading-relaxed">
                  Add premium cinematic extras to take your wedding films and presentation to the next level.
                </p>
              </div>

              <div className="w-full h-px bg-zinc-100" />

              {/* Interactive Add-on Items list */}
              <div className="space-y-4">
                
                {/* DRONE REMOVED — included in larger packs */}
                
                {/* ITEM 2: PRE-WEDDING CINEMATIC VIDEO */}
                <div 
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    selectedAddons.prewedVideo
                      ? "bg-[#1e3f20]/5 border-[#1e3f20]/40 shadow-sm" 
                      : "bg-zinc-50/50 border-zinc-200 hover:border-zinc-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm text-zinc-900">Pre-Wedding Cinematic Video</span>
                    <span className="font-extrabold text-xs text-zinc-500 italic">Optional Add-on</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-light leading-relaxed block mb-4">
                    High-end romantic video shoot before the wedding, capturing a stunning cinematic film to share or play at your reception.
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: false, label: "No Video", price: "—" },
                      { value: true, label: "Add Video Film", price: "₹9,999" }
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedAddons({ ...selectedAddons, prewedVideo: opt.value })}
                        className={`py-2.5 px-1 rounded-xl text-center flex flex-col gap-0.5 border cursor-pointer transition-all duration-300 ${
                          selectedAddons.prewedVideo === opt.value
                            ? "bg-[#1e3f20] border-[#1e3f20] text-white shadow-md scale-[1.02]"
                            : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                        }`}
                      >
                        <span className="text-[10px] font-bold select-none">{opt.label}</span>
                        <span className={`text-[9px] font-extrabold ${selectedAddons.prewedVideo === opt.value ? "text-amber-300" : "text-[#9b1c1c]"}`}>
                          {opt.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ITEM 3: LED SCREEN SETUP */}
                <div 
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    selectedAddons.ledScreen !== "none" 
                      ? "bg-[#1e3f20]/5 border-[#1e3f20]/40 shadow-sm" 
                      : "bg-zinc-50/50 border-zinc-200 hover:border-zinc-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm text-zinc-900">Premium LED Screen Setup</span>
                    <span className="font-extrabold text-xs text-zinc-500 italic">Optional Add-on</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-light leading-relaxed block mb-4">
                    Massive panoramic live-stream displays for receptions, allowing everyone to see the candid joy in high definition.
                  </span>
                  
                  {/* Options Segmented Pill selection */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "none", label: "No Screen", price: "—" },
                      { value: "single", label: "Single (8x10ft)", price: "₹14,999" },
                      { value: "double", label: "Double Side", price: "₹24,999" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedAddons({ ...selectedAddons, ledScreen: opt.value })}
                        className={`py-2.5 px-1 rounded-xl text-center flex flex-col gap-0.5 border cursor-pointer transition-all duration-300 ${
                          selectedAddons.ledScreen === opt.value
                            ? "bg-[#1e3f20] border-[#1e3f20] text-white shadow-md scale-[1.02]"
                            : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                        }`}
                      >
                        <span className="text-[10px] font-bold select-none">{opt.label}</span>
                        <span className={`text-[9px] font-extrabold ${selectedAddons.ledScreen === opt.value ? "text-amber-300" : "text-[#9b1c1c]"}`}>
                          {opt.price}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Direct Book Now Button below the LED selector */}
                  <div className="mt-4 pt-1 select-none">
                    <button
                      type="button"
                      onClick={() => {
                        let extras = [];

                        if (selectedAddons.prewedVideo) extras.push("Pre-Wedding Cinematic Video (₹9,999)");
                        if (selectedAddons.ledScreen === "single") extras.push("Single 8x10ft LED Screen (₹14,999)");
                        if (selectedAddons.ledScreen === "double") extras.push("Double Side Dual-LED Display (₹24,999)");

                        let messageStr = "Hi! I would like to lock in the special package slot.";
                        if (extras.length > 0) {
                          messageStr += ` I am interested in adding these custom Add-ons: [${extras.join(", ")}]. Please contact me to secure this!`;
                        }

                        setFormData({
                          ...formData,
                          message: messageStr
                        });
                        setIsAddonsModalOpen(false);
                        setTimeout(() => {
                          scrollToForm();
                        }, 200);
                      }}
                      className="w-full py-3 bg-[#9b1c1c] hover:bg-[#801414] text-white font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs tracking-widest uppercase shadow-sm cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <span>Book Package Now</span>
                      <span>🌟</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* LIVE PRICE SUMMARY CONTAINER */}
              <div className="bg-[#fbfbfa] border border-zinc-200 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 select-none">
                  <span>Selected Add-ons Total:</span>
                  <span className="text-[#9b1c1c] font-extrabold text-sm">
                    + ₹{(
                      (selectedAddons.ledScreen === "single" ? 14999 : selectedAddons.ledScreen === "double" ? 24999 : 0) +
                      (selectedAddons.prewedVideo ? 9999 : 0)
                    ).toLocaleString("en-IN")}/-
                  </span>
                </div>
                <div className="text-[9px] text-zinc-400 font-light select-none">
                  *Prices will be added to your selected base packages. Secure slot discounts now!
                </div>
              </div>

              {/* CTA: Secure Packages & Auto-fill Form */}
              <button
                onClick={() => {
                  // Generate a custom request details message
                  let extras = [];

                  if (selectedAddons.prewedVideo) extras.push("Pre-Wedding Cinematic Video (₹9,999)");
                  if (selectedAddons.ledScreen === "single") extras.push("Single 8x10ft LED Screen (₹14,999)");
                  if (selectedAddons.ledScreen === "double") extras.push("Double Side Dual-LED Display (₹24,999)");

                  let messageStr = "Hi! I would like to lock in the special package slot.";
                  if (extras.length > 0) {
                    messageStr += ` I am interested in adding these custom Add-ons: [${extras.join(", ")}]. Please contact me to secure this!`;
                  }

                  setFormData({
                    ...formData,
                    message: messageStr
                  });
                  
                  setIsAddonsModalOpen(false);
                  setTimeout(() => {
                    scrollToForm();
                  }, 200);
                }}
                className="w-full py-4 bg-[#9b1c1c] hover:bg-[#801414] text-white font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs tracking-widest uppercase shadow-md cursor-pointer text-center"
              >
                Apply Extras & Book Offer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED PACKAGE DETAILS & WEDDING GALLERY MODAL */}
      <AnimatePresence>
        {activeDetailPackage !== null && (() => {
          const pack = activeDetailPackage;
          const imagesLength = pack.images && pack.images.length ? pack.images.length : 1;
          const hasPrewed = /Pre-Wedding|Candid|Luxury/i.test(pack.title);

          // Dynamic calculation of final price inside the AnimatePresence closure
          const basePriceNum = parseInt(pack.offerPrice.replace(/[^0-9]/g, ""));
          const addonPrice = 
            (selectedAddons.ledScreen === "single" ? 14999 : selectedAddons.ledScreen === "double" ? 24999 : 0) +
            ((selectedAddons.prewedVideo && !hasPrewed) ? 9999 : 0);
          const finalCalculatedPrice = basePriceNum + addonPrice;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              onClick={() => setActiveDetailPackage(null)}
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
                  onClick={() => setActiveDetailPackage(null)}
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
                      key={`bg-${pack.images[currentSlide % imagesLength]}`}
                      src={pack.images[currentSlide % imagesLength]}
                      alt=""
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-25 select-none pointer-events-none"
                    />
                    {/* Semi-transparent dark overlay to ensure dynamic color contrast and block leaks */}
                    <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

                    {/* Crisp Foreground Layer */}
                    <motion.img
                      key={`fg-${pack.images[currentSlide % imagesLength]}`}
                      src={pack.images[currentSlide % imagesLength]}
                      alt="Dreamwed Stories Actual Wedding Capture"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full h-full object-cover z-10" style={{ objectPosition: (pack.imagePositions && pack.imagePositions[currentSlide % imagesLength]) || pack.imagePosition || "center 30%" }}
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
                    {pack.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full transition-all duration-300 ${
                          (currentSlide % imagesLength) === i ? "bg-[#b4975a] scale-125" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Side: Package Inclusions and Booking Option (Redesigned with Fixed Headers/CTA & Unified Scroll Stream) */}
                <div className="p-6 sm:p-10 flex flex-col justify-between gap-5 md:h-[650px] md:overflow-hidden overflow-visible h-auto">
                  
                  {/* Header detail */}
                  <div className="space-y-2 select-none">
                    <span className="inline-flex items-center gap-1 bg-[#1e3f20]/10 text-[#1e3f20] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                      {pack.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl text-zinc-900 font-semibold tracking-tight leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {pack.title.toLowerCase().includes("package") ? pack.title : `${pack.title} Package`}
                    </h3>
                    {/* Dynamic Double Pricing & Countdown Timer Block */}
                    <div className="flex flex-col gap-2 bg-[#9b1c1c]/5 border border-[#9b1c1c]/15 p-4.5 rounded-2xl select-none text-left w-full">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-red-600 text-3xl font-extrabold tracking-tight select-none">
                          Offer Price: Rs. {pack.offerPrice}/-
                        </span>
                        <span className="text-zinc-400 text-sm line-through decoration-zinc-400 select-none">
                          Regular: Rs. {pack.regularPrice}/-
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-650 font-mono text-[11px] border-t border-zinc-100 pt-2.5 mt-0.5">
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

                  {/* Main Scroll Stream (Checklist + Integrated Add-ons) */}
                  <div className="flex-1 md:overflow-y-auto pr-2 space-y-6 md:scrollbar-thin relative min-h-0 overflow-visible h-auto">
                    
                    {/* Short intro bio */}
                    <p className="text-zinc-500 font-light text-xs leading-relaxed select-none">
                      {pack.description}
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
                              Get 100% original, uncompressed high-resolution digital files instantly shared via Google Drive with 1-year backup support.
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
                    {pack.shareId && pack.shareId.startsWith("pkgWedding") && !pack.shareId.includes("Standalone") && (
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
                              {pack.shareId === "pkgWeddingBasicCard" ? "Worth ₹12,000" : "Worth ₹15,000"}
                            </span>
                          </div>
                          {pack.shareId === "pkgCandidCard" && (
                            <div className="flex justify-between text-zinc-500">
                              <span>Creative Candid Upgrade (3-Camera Setup)</span>
                              <span className="font-semibold text-zinc-800">Worth ₹15,000</span>
                            </div>
                          )}
                          {pack.shareId === "pkgLuxuryCard" && (
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
                              {pack.shareId === "pkgWeddingBasicCard" ? "₹71,998" :
                               pack.shareId === "pkgWeddingPreCard" ? "₹74,998" :
                               pack.shareId === "pkgCandidCard" ? "₹89,998" : "₹1,24,998"}
                            </span>
                          </div>
                          <div className="flex justify-between text-[#9b1c1c] font-semibold text-[11px] pt-1">
                            <span>Special Combined Deal Price</span>
                            <span className="font-bold font-mono">Rs. {pack.offerPrice}/-</span>
                          </div>
                        </div>
                        <div className="bg-[#1e3f20]/5 border border-[#1e3f20]/15 px-3 py-1.5 rounded-xl text-center text-[10px] text-[#1e3f20] font-bold uppercase tracking-wider mt-2">
                          🎉 INSTANT SAVINGS OF {
                            pack.shareId === "pkgWeddingBasicCard" ? "₹31,999 (44% OFF)" :
                            pack.shareId === "pkgWeddingPreCard" ? "₹19,999 (27% OFF)" :
                            pack.shareId === "pkgCandidCard" ? "₹19,999 (22% OFF)" :
                            "₹14,998 (12% OFF)"
                          }!
                        </div>
                      </div>
                    )}

                    {/* Bonus highlight box */}
                    {hasPrewed && (
                      <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-start gap-3 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.08)]">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                          <Gift size={16} />
                        </div>
                        <div className="text-left">
                          <span className="block text-red-600 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            Free Pre-Wedding Shoot
                          </span>
                          <span className="text-zinc-800 text-xs font-bold leading-snug block mt-0.5">
                            Free Pre-Wedding (Save the date photography) is included with this package.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* What's Included list */}
                    <div className="space-y-4 pt-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 select-none">
                        <span>🎁 What's Included ({pack.details ? pack.details.length : 0} Inclusions):</span>
                      </div>
                      <ul className="grid grid-cols-1 gap-2.5">
                        {pack.details && pack.details.map((item, index) => (
                          <li key={index} className="flex gap-2.5 items-start text-xs text-zinc-600 hover:text-zinc-900 transition-colors">
                            <CheckCircle size={15} className="text-[#1e3f20] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-full h-px bg-zinc-100" />

                    {/* INTEGRATED ADD-ONS SECTION (Scroll completely down to reveal) */}
                    <div className="space-y-4 pt-1">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 bg-[#1e3f20]/10 text-[#1e3f20] px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase select-none">
                          Step 2
                        </span>
                        <h4 className="text-sm font-bold text-zinc-900 select-none">
                          ✨ Customize with Premium Extras (Optional):
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {/* ITEM 2: PRE-WEDDING CINEMATIC VIDEO */}
                        {hasPrewed ? (
                          <div className="p-3.5 rounded-2xl border bg-[#1e3f20]/5 border-[#1e3f20]/20">
                            <div className="flex justify-between items-center mb-2 select-none">
                              <span className="font-bold text-xs text-[#1e3f20]">Pre-Wedding Cinematic Video</span>
                              <span className="text-[9px] font-extrabold bg-[#1e3f20] text-white px-2 py-0.5 rounded uppercase">Included Free</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-light leading-relaxed block select-none">
                              Save ₹35,000! Pre-wedding cinematic video film is fully included free in this cinematic package!
                            </span>
                          </div>
                        ) : (
                          <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${selectedAddons.prewedVideo ? 'bg-[#1e3f20]/5 border-[#1e3f20]/30 shadow-sm' : 'bg-zinc-50/50 border-zinc-200'}`}>
                            <div className="flex justify-between items-center mb-2 select-none">
                              <span className="font-bold text-xs text-zinc-900">Pre-Wedding Cinematic Video</span>
                              <span className="text-[9px] font-semibold text-zinc-500">Romantic Film Extra</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-light leading-relaxed block mb-3 select-none">
                              High-end cinematic video shoot before the wedding, creating a beautiful romantic story film.
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { value: false, label: "No Video", price: "—" },
                                { value: true, label: "Add Video Film", price: "₹9,999" }
                              ].map((opt) => (
                                <button
                                  key={opt.label}
                                  type="button"
                                  onClick={() => setSelectedAddons({ ...selectedAddons, prewedVideo: opt.value })}
                                  className={`py-2 px-1 rounded-xl text-center flex flex-col gap-0.5 border cursor-pointer transition-all duration-300 select-none ${
                                    selectedAddons.prewedVideo === opt.value
                                      ? "bg-[#1e3f20] border-[#1e3f20] text-white shadow-sm scale-[1.02]"
                                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                                  }`}
                                >
                                  <span className="text-[10px] font-bold">{opt.label}</span>
                                  <span className={`text-[9px] font-extrabold ${selectedAddons.prewedVideo === opt.value ? "text-amber-300" : "text-[#9b1c1c]"}`}>
                                    {opt.price}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ITEM 3: LED SCREEN SETUP */}
                        <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${selectedAddons.ledScreen !== "none" ? 'bg-[#1e3f20]/5 border-[#1e3f20]/30 shadow-sm' : 'bg-zinc-50/50 border-zinc-200'}`}>
                          <div className="flex justify-between items-center mb-2 select-none">
                            <span className="font-bold text-xs text-zinc-900">Premium LED Screen Setup</span>
                            <span className="text-[9px] font-semibold text-zinc-500">Live Broadcast Extra</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-light leading-relaxed block mb-3 select-none">
                            High-definition modular live video streaming screen for receptions.
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: "none", label: "No Screen", price: "—" },
                              { value: "single", label: "Single (8x10ft)", price: "₹14,999" },
                              { value: "double", label: "Double Side", price: "₹24,999" }
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setSelectedAddons({ ...selectedAddons, ledScreen: opt.value })}
                                className={`py-2 px-1 rounded-xl text-center flex flex-col gap-0.5 border cursor-pointer transition-all duration-300 select-none ${
                                  selectedAddons.ledScreen === opt.value
                                    ? "bg-[#1e3f20] border-[#1e3f20] text-white shadow-sm scale-[1.02]"
                                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                                }`}
                              >
                                <span className="text-[10px] font-bold">{opt.label}</span>
                                <span className={`text-[9px] font-extrabold ${selectedAddons.ledScreen === opt.value ? "text-amber-300" : "text-[#9b1c1c]"}`}>
                                  {opt.price}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Direct Book Now Button below the LED selector */}
                          <div className="mt-4 pt-1 select-none">
                            <button
                              type="button"
                              onClick={() => {
                                let extras = [];

                                if (selectedAddons.prewedVideo && !hasPrewed) extras.push("Pre-Wedding Cinematic Video (₹9,999)");
                                if (selectedAddons.ledScreen === "single") extras.push("Single 8x10ft LED Screen (₹14,999)");
                                if (selectedAddons.ledScreen === "double") extras.push("Double Side Dual-LED Display (₹24,999)");

                                let messageStr = `Hi! I would like to book the special package slot: [${pack.title} - Rs. ${pack.offerPrice}/-]`;
                                if (extras.length > 0) {
                                  messageStr += ` customized with these Add-ons: [${extras.join(", ")}]. Total Calculated Investment: Rs. ${finalCalculatedPrice.toLocaleString("en-IN")}/-.`;
                                } else {
                                  messageStr += ".";
                                }
                                messageStr += " Please contact me to secure this offer!";

                                setFormData({
                                  ...formData,
                                  message: messageStr
                                });
                                setActiveDetailPackage(null);
                                setTimeout(() => {
                                  scrollToForm();
                                }, 200);
                              }}
                              className="w-full py-3 bg-[#9b1c1c] hover:bg-[#801414] text-white font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs tracking-widest uppercase shadow-sm cursor-pointer text-center flex items-center justify-center gap-2"
                            >
                              <span>Book Package Now</span>
                              <span>🌟</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="h-6" />
                  </div>

                  {/* Absolute subtle bottom fade for active scroll stream */}
                  <div className="w-full h-px bg-zinc-100 select-none" />

                  {/* Anchored CTA Button at the bottom (Static & Dynamically updating price) */}
                  <div className="space-y-3">
                    {/* Scroll Price Reminder */}
                    <div className="bg-[#9b1c1c]/10 border border-[#9b1c1c]/20 px-4 py-3 rounded-xl flex items-center justify-between text-xs select-none text-left">
                      <div className="space-y-0.5">
                        <span className="text-zinc-555 block text-[9px] uppercase font-bold tracking-wider">YOUR COMBINED INVESTMENT</span>
                        <span className="text-zinc-455 text-[10px] line-through font-mono block leading-none">
                          Reg: Rs. {pack.regularPrice}/-
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-red-600 font-black font-mono text-xl block leading-none">
                          Rs. {finalCalculatedPrice.toLocaleString("en-IN")}/-
                        </span>
                        <span className="text-emerald-605 text-[9.5px] font-bold block mt-0.5 uppercase tracking-wider">
                          Special Promo Rate
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        let extras = [];

                        if (selectedAddons.prewedVideo && !hasPrewed) extras.push("Pre-Wedding Cinematic Video (₹9,999)");
                        if (selectedAddons.ledScreen === "single") extras.push("Single 8x10ft LED Screen (₹14,999)");
                        if (selectedAddons.ledScreen === "double") extras.push("Double Side Dual-LED Display (₹24,999)");

                        let messageStr = `Hi! I would like to book the special package slot: [${pack.title} - Rs. ${pack.offerPrice}/-]`;
                        if (extras.length > 0) {
                          messageStr += ` customized with these Add-ons: [${extras.join(", ")}]. Total Calculated Investment: Rs. ${finalCalculatedPrice.toLocaleString("en-IN")}/-.`;
                        } else {
                          messageStr += ".";
                        }
                        messageStr += " Please contact me to secure this offer!";

                        setFormData({
                          ...formData,
                          message: messageStr
                        });
                        setActiveDetailPackage(null);
                        setTimeout(() => {
                          scrollToForm();
                        }, 200);
                      }}
                      className="w-full py-4 bg-[#9b1c1c] hover:bg-[#801414] text-white font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs tracking-widest uppercase shadow-md cursor-pointer text-center select-none"
                    >
                      Secure Slot (Total: Rs. ${finalCalculatedPrice.toLocaleString("en-IN")}/-) 🌟
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default TrivandrumOffer;
