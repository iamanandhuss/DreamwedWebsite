import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Check, CheckCircle, ChevronRight, Download, Edit2, FileCheck, FileText,
  Heart, Image as ImageIcon, Info, Menu, Phone, Printer, Send, Share2, Star, Trash2, X, Plus, Minus,
  Sparkles, Sliders, Smartphone, Laptop, Lock, ShieldCheck, GripVertical, Home
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

// Available images in project for customizer selection
const AVAILABLE_IMAGES = [
  { url: "/couple_traditional_red.jpg", label: "Traditional Red Couple" },
  { url: "/uploaded_couple_blackwhite.jpg", label: "B&W Editorial Couple" },
  { url: "/couple_fun_glasses.jpg", label: "Fun Sunglasses Couple" },
  { url: "/uploaded_bride_traditional.jpg", label: "Kerala Bride Traditional" },
  { url: "/uploaded_bride_gold.jpg", label: "Gold Jewelry Bride" },
  { url: "/uploaded_bride_yellow.jpg", label: "Yellow Beetle Wedding Party" },
  { url: "/kochi_couple.jpg", label: "Kochi Couple Portrait" },
  { url: "/kochi_couple_carry.jpg", label: "Kochi Groom Carrying Bride" }
];

const resolveAssetPath = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  // Strip leading slash if running under file protocol, or inside a subdirectory (e.g. Live Server)
  const isLocalFile = window.location.protocol === "file:";
  const isSubdirectory = window.location.pathname !== "/" && !window.location.pathname.startsWith("/proposal");
  
  if (isLocalFile || isSubdirectory) {
    return path.startsWith("/") ? path.substring(1) : path;
  }
  return path;
};

// Website Packages
const WEBSITE_PACKAGES = [
  {
    name: "Wedding Photography (₹39,999)",
    price: "39,999",
    weddingCandidPhoto: 0,
    weddingTradPhoto: 1,
    weddingCandidVideo: 0,
    weddingTradVideo: 1,
    evePhoto: 0,
    eveVideo: 0,
    prewedPhoto: 0,
    prewedVideo: 0,
    hasDrone: false,
    hasPreweddingVideo: false,
    hasLedWall: false,
    hasHaldi: false,
    deliverables: [
      "One 70 Pages Premium Album (12x18 inches)",
      "Highlights Video Film",
      "Full HD Wedding Video Film",
      "Wedding Reel",
      "All Raw & High-Resolution Edited Images",
      "High-Speed USB Pen Drive + Digital Link"
    ],
    complimentary: [
      "1 x Customized Photo Calendar",
      "2 x Premium Wall Frames",
      "Free Pre-Wedding Photo (Worth ₹12,000)"
    ]
  },
  {
    name: "Wedding Photo & Pre-Wedding (₹54,999)",
    price: "54,999",
    weddingCandidPhoto: 0,
    weddingTradPhoto: 1,
    weddingCandidVideo: 0,
    weddingTradVideo: 1,
    evePhoto: 0,
    eveVideo: 0,
    prewedPhoto: 1,
    prewedVideo: 1,
    hasDrone: false,
    hasPreweddingVideo: true,
    hasLedWall: false,
    hasHaldi: false,
    deliverables: [
      "One 80 Pages Premium Album (12x18 inches)",
      "80 Pages Miniature Album for Parents",
      "Highlights Video Film",
      "Full HD Wedding Video Film",
      "Wedding Reel",
      "All Raw & High-Resolution Edited Images",
      "High-Speed USB Pen Drive + Digital Link"
    ],
    complimentary: [
      "1 x Customized Photo Calendar",
      "2 x Premium Wall Frames",
      "Free Pre-Wedding Photo & Video (Worth ₹15,000)"
    ]
  },
  {
    name: "Candid Photo & Videography (₹69,999)",
    price: "69,999",
    weddingCandidPhoto: 1,
    weddingTradPhoto: 1,
    weddingCandidVideo: 0,
    weddingTradVideo: 1,
    evePhoto: 0,
    eveVideo: 0,
    prewedPhoto: 1,
    prewedVideo: 1,
    hasDrone: false,
    hasPreweddingVideo: true,
    hasLedWall: false,
    hasHaldi: false,
    deliverables: [
      "One 80 Pages Premium Album (12x18 inches)",
      "80 Pages Miniature Album for Parents",
      "Highlights Video Film",
      "Full HD Wedding Video Film",
      "Wedding Reel",
      "All Raw & High-Resolution Edited Images",
      "High-Speed USB Pen Drive + Digital Link"
    ],
    complimentary: [
      "1 x Customized Photo Calendar",
      "2 x Premium Wall Frames"
    ]
  },
  {
    name: "Premium Candid Package (₹79,999)",
    price: "79,999",
    weddingCandidPhoto: 1,
    weddingTradPhoto: 1,
    weddingCandidVideo: 1,
    weddingTradVideo: 1,
    evePhoto: 1,
    eveVideo: 1,
    prewedPhoto: 1,
    prewedVideo: 1,
    hasDrone: true,
    hasPreweddingVideo: true,
    hasLedWall: false,
    hasHaldi: false,
    deliverables: [
      "One 100-Pages Premium layflat Album",
      "Highlights Video Film",
      "Full HD Wedding Video Film",
      "Engagement & Wedding Reels",
      "All Raw & High-Resolution Edited Images",
      "High-Speed USB Pen Drive + Digital Link"
    ],
    complimentary: [
      "1 x Customized Photo Calendar",
      "2 x Premium Wall Frames",
      "Free Drone Aerial Coverage"
    ]
  },
  {
    name: "Bride & Groom Luxury Package (₹1,10,000)",
    price: "1,10,000",
    weddingCandidPhoto: 2,
    weddingTradPhoto: 1,
    weddingCandidVideo: 1,
    weddingTradVideo: 1,
    evePhoto: 1,
    eveVideo: 1,
    prewedPhoto: 1,
    prewedVideo: 1,
    hasDrone: true,
    hasPreweddingVideo: true,
    hasLedWall: false,
    hasHaldi: false,
    deliverables: [
      "One 80-Pages Premium Album with Handcrafted Album Box",
      "One 80-Pages Miniature Album for Parents",
      "Cinematic Highlights Film & Instagram Reels",
      "Full HD Wedding Video Film",
      "All Raw & High-Resolution Edited Images",
      "High-Speed USB Pen Drive + Digital Link"
    ],
    complimentary: [
      "2 x Premium Wall Frames",
      "1 x Customized Photo Calendar",
      "Free Drone Aerial Coverage & Premium Custom Album Box"
    ]
  },
  {
    name: "Standalone Wedding Day (₹39,999)",
    price: "39,999",
    weddingCandidPhoto: 0,
    weddingTradPhoto: 1,
    weddingCandidVideo: 0,
    weddingTradVideo: 1,
    evePhoto: 0,
    eveVideo: 0,
    prewedPhoto: 0,
    prewedVideo: 0,
    hasDrone: false,
    hasPreweddingVideo: false,
    hasLedWall: false,
    hasHaldi: false,
    deliverables: [
      "Premium 70-Page Layflat Album",
      "Full HD Video Film + Reels",
      "Edited Photos & High-speed Pendrive"
    ],
    complimentary: [
      "Free Desktop Calendar"
    ]
  },
  {
    name: "Standalone Reception (₹19,999)",
    price: "19,999",
    weddingCandidPhoto: 0,
    weddingTradPhoto: 1,
    weddingCandidVideo: 0,
    weddingTradVideo: 1,
    evePhoto: 0,
    eveVideo: 0,
    prewedPhoto: 0,
    prewedVideo: 0,
    hasDrone: false,
    hasPreweddingVideo: false,
    hasLedWall: false,
    hasHaldi: false,
    deliverables: [
      "Premium 50-Page Layflat Album",
      "Full HD Video Film + Highlights",
      "Edited Photos & High-speed Pendrive"
    ],
    complimentary: [
      "Free Desktop Calendar"
    ]
  },
  {
    name: "Engagement Photography (₹12,000)",
    price: "12,000",
    weddingCandidPhoto: 0,
    weddingTradPhoto: 0,
    weddingCandidVideo: 0,
    weddingTradVideo: 0,
    evePhoto: 1,
    eveVideo: 0,
    prewedPhoto: 0,
    prewedVideo: 0,
    hasDrone: false,
    hasPreweddingVideo: false,
    hasLedWall: false,
    hasHaldi: false,
    deliverables: [
      "Photos in Google Drive"
    ],
    complimentary: [
      "Free High-Res Digital Album Access"
    ]
  },
  {
    name: "Bride or Groom Engagement Package (₹28,999)",
    price: "28,999",
    weddingCandidPhoto: 0,
    weddingTradPhoto: 0,
    weddingCandidVideo: 0,
    weddingTradVideo: 0,
    evePhoto: 1,
    eveVideo: 1,
    prewedPhoto: 0,
    prewedVideo: 0,
    hasDrone: false,
    hasPreweddingVideo: false,
    hasLedWall: false,
    hasHaldi: false,
    deliverables: [
      "Edited High-Res Photos",
      "Premium Layflat Panoramic Album (50 Pages)",
      "Cinematic Engagement Reel",
      "Engagement Full HD Video",
      "1 High-Speed USB Pen Drive"
    ],
    complimentary: [
      "1 x Tabletop Calendar",
      "2 x Premium Photo Frames"
    ]
  },
  {
    name: "Haldi Photography (Only) (₹10,000)",
    price: "10,000",
    weddingCandidPhoto: 0,
    weddingTradPhoto: 0,
    weddingCandidVideo: 0,
    weddingTradVideo: 0,
    evePhoto: 0,
    eveVideo: 0,
    prewedPhoto: 0,
    prewedVideo: 0,
    hasDrone: false,
    hasPreweddingVideo: false,
    hasLedWall: false,
    hasHaldi: true,
    deliverables: [
      "Edited High-Res Photos"
    ],
    complimentary: [
      "Free High-Res Digital Access"
    ]
  },
  {
    name: "Haldi Photography with Album (₹15,000)",
    price: "15,000",
    weddingCandidPhoto: 0,
    weddingTradPhoto: 0,
    weddingCandidVideo: 0,
    weddingTradVideo: 0,
    evePhoto: 0,
    eveVideo: 0,
    prewedPhoto: 0,
    prewedVideo: 0,
    hasDrone: false,
    hasPreweddingVideo: false,
    hasLedWall: false,
    hasHaldi: true,
    deliverables: [
      "Edited High-Res Photos",
      "Custom Layflat Panoramic Album (30 Pages)"
    ],
    complimentary: [
      "Free Complimentary Wall Frame"
    ]
  },
  {
    name: "Haldi Photo & Videography (₹28,000)",
    price: "28,000",
    weddingCandidPhoto: 0,
    weddingTradPhoto: 0,
    weddingCandidVideo: 0,
    weddingTradVideo: 0,
    evePhoto: 0,
    eveVideo: 0,
    prewedPhoto: 0,
    prewedVideo: 0,
    hasDrone: false,
    hasPreweddingVideo: false,
    hasLedWall: false,
    hasHaldi: true,
    deliverables: [
      "Edited High-Res Photos",
      "Cinematic Haldi Highlight Reel",
      "Full HD Event Video Film"
    ],
    complimentary: [
      "Free Haldi Teaser Highlight Reel"
    ]
  }
];

export default function DigitalProposal() {
  // Page Configuration State (Customizable in real-time)
  const [brideName, setBrideName] = useState("ANJANA");
  const [groomName, setGroomName] = useState("ASWIN");
  const [proposalId, setProposalId] = useState("DW-2026-843");
  const [proposalDate, setProposalDate] = useState("June 21, 2026");
  const [weddingDate, setWeddingDate] = useState("September 15, 2026");
  const [weddingLocation, setWeddingLocation] = useState("Trivandrum, Kerala");
  const [price, setPrice] = useState("1,10,000");
  const [leadPhotographer, setLeadPhotographer] = useState("Unni Krishnan");
  const [selectedPackageIndex, setSelectedPackageIndex] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [themeColor, setThemeColor] = useState("#b4975a");

  // Drag and Drop & In-place Edit States & Handlers for Deliverables and Complimentary lists
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragSource, setDragSource] = useState(null); // 'deliverables' or 'complimentary'
  const [draggableItem, setDraggableItem] = useState(null); // { index, source }

  const handleDragStart = (e, index, source) => {
    setDraggedIndex(index);
    setDragSource(source);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index, source) => {
    e.preventDefault();
    if (draggedIndex === null || dragSource !== source || draggedIndex === index) return;
    
    const list = source === 'deliverables' ? deliverables : complimentary;
    const setList = source === 'deliverables' ? setDeliverables : setComplimentary;
    
    const newList = [...list];
    const draggedItemVal = newList[draggedIndex];
    newList.splice(draggedIndex, 1);
    newList.splice(index, 0, draggedItemVal);
    
    setDraggedIndex(index);
    setList(newList);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragSource(null);
  };

  const handleEditItem = (index, value, source) => {
    if (source === 'deliverables') {
      const newList = [...deliverables];
      newList[index] = value;
      setDeliverables(newList);
    } else if (source === 'complimentary') {
      const newList = [...complimentary];
      newList[index] = value;
      setComplimentary(newList);
    }
  };

  const formatEventDate = (dateVal) => {
    if (!dateVal) return '';
    const parts = dateVal.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dateObj = new Date(year, month, day);
      return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return dateVal;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getFormattedEventDates = () => {
    if (eventsList && eventsList.length > 0) {
      const dates = eventsList
        .map(ev => formatEventDate(ev.date))
        .filter(d => d !== '');
      const uniqueDates = [...new Set(dates)];
      if (uniqueDates.length > 0) {
        if (uniqueDates.length === 2) {
          return `${uniqueDates[0]} & ${uniqueDates[1]}`;
        }
        return uniqueDates.join(" & ");
      }
    }
    return weddingDate;
  };

  const handleSelectPackageTemplate = (index) => {
    setSelectedPackageIndex(index);
    const pkg = WEBSITE_PACKAGES[index];
    if (!pkg) return;
    
    setPrice(pkg.price);
    setWeddingCandidPhoto(pkg.weddingCandidPhoto);
    setWeddingTradPhoto(pkg.weddingTradPhoto);
    setWeddingCandidVideo(pkg.weddingCandidVideo);
    setWeddingTradVideo(pkg.weddingTradVideo);
    setEvePhoto(pkg.evePhoto);
    setEveVideo(pkg.eveVideo);
    setPrewedPhoto(pkg.prewedPhoto);
    setPrewedVideo(pkg.prewedVideo);
    setHasDrone(pkg.hasDrone);
    setHasPreweddingVideo(pkg.hasPreweddingVideo);
    setHasLedWall(pkg.hasLedWall);
    setHasHaldi(pkg.hasHaldi);
    setDeliverables([...pkg.deliverables]);
    setComplimentary([...pkg.complimentary]);
  };
  
  // Image Crop & Alignment Positions & Zoom
  const [coverPositionX, setCoverPositionX] = useState(50);
  const [coverPositionY, setCoverPositionY] = useState(50);
  const [coverScale, setCoverScale] = useState(100);
  
  const [packagePositionX, setPackagePositionX] = useState(50);
  const [packagePositionY, setPackagePositionY] = useState(50);
  const [packageScale, setPackageScale] = useState(100);
  
  const [philosophyPositionX, setPhilosophyPositionX] = useState(50);
  const [philosophyPositionY, setPhilosophyPositionY] = useState(50);
  const [philosophyScale, setPhilosophyScale] = useState(100);
  
  // Package staff counts
  const [weddingCandidPhoto, setWeddingCandidPhoto] = useState(1);
  const [weddingTradPhoto, setWeddingTradPhoto] = useState(1);
  const [weddingCandidVideo, setWeddingCandidVideo] = useState(1);
  const [weddingTradVideo, setWeddingTradVideo] = useState(1);
  
  const [evePhoto, setEvePhoto] = useState(1);
  const [eveVideo, setEveVideo] = useState(1);
  
  const [prewedPhoto, setPrewedPhoto] = useState(1);
  const [prewedVideo, setPrewedVideo] = useState(1);

  // Add-on states
  const [hasDrone, setHasDrone] = useState(false);
  const [hasLedWall, setHasLedWall] = useState(false);
  const [hasPreweddingVideo, setHasPreweddingVideo] = useState(false);
  const [hasHaldi, setHasHaldi] = useState(false);
  const [customAddons, setCustomAddons] = useState([]);
  const [newCustomAddonName, setNewCustomAddonName] = useState("");
  const [includePackages, setIncludePackages] = useState(false);
  const [packagesLink, setPackagesLink] = useState(`${window.location.origin}/packages`);

  const addCustomAddon = () => {
    if (newCustomAddonName.trim()) {
      const newAddon = {
        id: Date.now().toString(),
        name: newCustomAddonName.trim(),
        enabled: true
      };
      setCustomAddons([...customAddons, newAddon]);
      setNewCustomAddonName("");
    }
  };

  const removeCustomAddon = (id) => {
    setCustomAddons(customAddons.filter((addon) => addon.id !== id));
  };

  const toggleCustomAddon = (id) => {
    setCustomAddons(
      customAddons.map((addon) =>
        addon.id === id ? { ...addon, enabled: !addon.enabled } : addon
      )
    );
  };

  // Compile active addons list
  const activeAddons = [];
  if (hasDrone) activeAddons.push("Aerial Drone (Helicam) Coverage");
  if (hasLedWall) activeAddons.push("LED Wall Setup");
  if (hasPreweddingVideo) activeAddons.push("Pre-Wedding Video / Film");
  if (hasHaldi) activeAddons.push("Haldi Ceremony Coverage");
  customAddons.forEach(addon => {
    if (addon.enabled) activeAddons.push(addon.name);
  });

  const hasAddons = activeAddons.length > 0;

  // Lists
  const [deliverables, setDeliverables] = useState([
    "50 Page Premium Layflat Main Album (12x18 inches)",
    "Miniature Copy of the Main Album for Parents",
    "25 Leaf (50 Pages) Fine-Art Imported Matte Paper",
    "All Raw & High-Resolution Edited Images",
    "Pen Drive for Edited Full Videos + Digital Link"
  ]);
  
  const [complimentary, setComplimentary] = useState([
    "2 x Table Top Miniature Calendars",
    "2 x Cinematic Reels (Instagram-Ready)",
    "Pre-Wedding Consultation Session",
    "Save The Date Photoshoot"
  ]);

  const [testimonials, setTestimonials] = useState([
    {
      name: "Dr. Athulraj",
      type: "Wedding Photos",
      initials: "DA",
      review: "The photos came out much better than expected, especially the low-light shots! You didn't miss a single moment of the wedding, and I don't think anyone else can provide such incredible quality in this budget. Thank you so much guys ❤️"
    },
    {
      name: "Chindu",
      type: "Cinematic Video",
      initials: "C",
      review: "What you did is one of the best I have seen so far. I've been searching for 7 months... the cinematic video you guys did is one of the best! All my friends and office colleagues are showering with praises."
    },
    {
      name: "Anandha Lekshmi",
      type: "Wedding Ceremony",
      initials: "AL",
      review: "Thank you so much to the whole team for the beautiful photo frame and for capturing our big day perfectly! ❤️❤️"
    },
    {
      name: "Deepak Kollam",
      type: "Candid Portraits",
      initials: "DK",
      review: "Superb work bro! We had a great experience with the team. I am someone who doesn't pose for photos at all, but you guys managed to capture such incredible shots and made me feel so comfortable."
    }
  ]);

  // Styling
  const [coverImage, setCoverImage] = useState("/couple_traditional_red.jpg");
  const [packageImage, setPackageImage] = useState("/uploaded_bride_yellow.jpg");
  const [philosophyImage, setPhilosophyImage] = useState("/uploaded_couple_blackwhite.jpg");

  // UI States
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop"); // "desktop" | "mobile"
  const [activeTab, setActiveTab] = useState("details"); // customizer tabs: "details" | "package" | "deliverables" | "design"
  
  // URL Share & Client View states
  const [isClientView, setIsClientView] = useState(false);
  const [copiedClient, setCopiedClient] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);

  useEffect(() => {
    let search = window.location.search;
    if (!search && window.location.hash.includes('?')) {
      search = window.location.hash.substring(window.location.hash.indexOf('?'));
    }
    const params = new URLSearchParams(search);
    setIsClientView(params.get("client") === "true");
    if (params.get("theme")) {
      setThemeColor(params.get("theme"));
    }
    
    // Load individual parameters first as default/fallback
    if (params.get("bride")) setBrideName(params.get("bride"));
    if (params.get("groom")) setGroomName(params.get("groom"));
    if (params.get("id")) setProposalId(params.get("id"));
    if (params.get("pdate")) setProposalDate(params.get("pdate"));
    if (params.get("wdate")) setWeddingDate(params.get("wdate"));
    if (params.get("loc")) setWeddingLocation(params.get("loc"));
    if (params.get("price")) setPrice(params.get("price"));
    if (params.get("lead")) setLeadPhotographer(params.get("lead"));
    
    if (params.get("wcp")) setWeddingCandidPhoto(parseInt(params.get("wcp")) || 0);
    if (params.get("wtp")) setWeddingTradPhoto(parseInt(params.get("wtp")) || 0);
    if (params.get("wcv")) setWeddingCandidVideo(parseInt(params.get("wcv")) || 0);
    if (params.get("wtv")) setWeddingTradVideo(parseInt(params.get("wtv")) || 0);
    
    if (params.get("ep")) setEvePhoto(parseInt(params.get("ep")) || 0);
    if (params.get("ev")) setEveVideo(parseInt(params.get("ev")) || 0);
    
    if (params.get("pp")) setPrewedPhoto(parseInt(params.get("pp")) || 0);
    if (params.get("pv")) setPrewedVideo(parseInt(params.get("pv")) || 0);
    
    if (params.get("drone")) setHasDrone(params.get("drone") === "true");
    if (params.get("led")) setHasLedWall(params.get("led") === "true");
    if (params.get("previd")) setHasPreweddingVideo(params.get("previd") === "true");
    if (params.get("haldi")) setHasHaldi(params.get("haldi") === "true");
    
    if (params.get("caddons")) {
      const addonNames = params.get("caddons").split(",");
      const addons = addonNames.map((name, i) => ({
        id: `url-${i}`,
        name: name,
        enabled: true
      }));
      setCustomAddons(addons);
    }
    
    if (params.get("incpkg")) setIncludePackages(params.get("incpkg") === "true");
    if (params.get("pkglnk")) setPackagesLink(params.get("pkglnk"));
    
    if (params.get("cimg")) setCoverImage(params.get("cimg"));
    if (params.get("cpx")) setCoverPositionX(parseInt(params.get("cpx")) || 50);
    if (params.get("cpy")) setCoverPositionY(parseInt(params.get("cpy")) || 50);
    if (params.get("cs")) setCoverScale(parseInt(params.get("cs")) || 100);
    
    if (params.get("pimg")) setPackageImage(params.get("pimg"));
    if (params.get("ppx")) setPackagePositionX(parseInt(params.get("ppx")) || 50);
    if (params.get("ppy")) setPackagePositionY(parseInt(params.get("ppy")) || 50);
    if (params.get("ps")) setPackageScale(parseInt(params.get("ps")) || 100);
    
    if (params.get("phimg")) setPhilosophyImage(params.get("phimg"));
    if (params.get("phpx")) setPhilosophyPositionX(parseInt(params.get("phpx")) || 50);
    if (params.get("phpy")) setPhilosophyPositionY(parseInt(params.get("phpy")) || 50);
    if (params.get("phs")) setPhilosophyScale(parseInt(params.get("phs")) || 100);
    
    if (params.get("deliv")) {
      try {
        setDeliverables(JSON.parse(params.get("deliv")));
      } catch (e) {
        console.error("Failed to parse deliverables from URL parameter", e);
      }
    }
    if (params.get("compl")) {
      try {
        setComplimentary(JSON.parse(params.get("compl")));
      } catch (e) {
        console.error("Failed to parse complimentary list from URL parameter", e);
      }
    }

    // Load and override from JSON payload if 'data' is present
    const dataParam = params.get("data");
    if (dataParam) {
      try {
        const payload = JSON.parse(decodeURIComponent(dataParam));
        
        // 1. clientName (split into groomName and brideName)
        const name = payload.clientName || 'Wedding Couple';
        let groom = '';
        let bride = '';
        if (name.includes('&')) {
          const parts = name.split('&');
          groom = parts[0].trim();
          bride = parts[1].trim();
        } else if (name.toLowerCase().includes(' and ')) {
          const parts = name.split(/ and /i);
          groom = parts[0].trim();
          bride = parts[1].trim();
        } else {
          groom = name;
          bride = '';
        }
        setGroomName(groom.toUpperCase());
        setBrideName(bride.toUpperCase());

        // 2. id / proposalId
        if (payload.id) {
          setProposalId(payload.id);
        } else {
          setProposalId("DW-" + new Date().getFullYear() + "-" + Math.floor(100 + Math.random() * 900));
        }

        // 2b. eventsList
        if (payload.eventsList && Array.isArray(payload.eventsList)) {
          setEventsList(payload.eventsList);
        }
        
        // 3. date / weddingDate
        if (payload.date) {
          setWeddingDate(formatEventDate(payload.date));
        }
        
        // 4. location / weddingLocation
        if (payload.location) {
          setWeddingLocation(payload.location);
        }
        
        // 5. price
        if (payload.packagePrice !== undefined) {
          const priceNum = Number(payload.packagePrice);
          setPrice(isNaN(priceNum) ? payload.packagePrice : priceNum.toLocaleString('en-IN'));
        }

        // 6. photographers & videographers count mapping
        let wcp = 0; // wedding candid photo
        let wtp = 0; // wedding traditional photo
        let wcv = 0; // wedding candid video
        let wtv = 0; // wedding traditional video
        let ep = 0;  // reception photo
        let ev = 0;  // reception video
        let pp = 0;  // pre-wedding photo
        let pv = 0;  // pre-wedding video

        const currentEvents = payload.eventsList || [];

        if (Array.isArray(payload.photographers)) {
          payload.photographers.forEach(p => {
            const nameLower = (p.name || '').toLowerCase();
            
            // If eventId exists and is in currentEvents, map by event ID index
            if (p.eventId && currentEvents.some(ev => ev.id === p.eventId)) {
              const idx = currentEvents.findIndex(ev => ev.id === p.eventId);
              if (idx === 0) {
                if (nameLower.includes('candid')) {
                  wcp++;
                } else {
                  wtp++;
                }
              } else if (idx === 1) {
                ep++;
              } else if (idx === 2) {
                pp++;
              }
            } else {
              // Backward compatible text fallback
              const isPrewed = nameLower.includes('pre-wedding') || nameLower.includes('prewed') || nameLower.includes('outdoor');
              const isReception = nameLower.includes('reception') || nameLower.includes('engagement') || nameLower.includes('eve');

              if (isPrewed) {
                pp++;
              } else if (isReception) {
                ep++;
              } else {
                if (nameLower.includes('candid')) {
                  wcp++;
                } else {
                  wtp++;
                }
              }
            }
          });
        }

        if (Array.isArray(payload.videographers)) {
          payload.videographers.forEach(v => {
            const nameLower = (v.name || '').toLowerCase();
            
            // If eventId exists and is in currentEvents, map by event ID index
            if (v.eventId && currentEvents.some(ev => ev.id === v.eventId)) {
              const idx = currentEvents.findIndex(ev => ev.id === v.eventId);
              if (idx === 0) {
                if (nameLower.includes('candid') || nameLower.includes('cinematic')) {
                  wcv++;
                } else {
                  wtv++;
                }
              } else if (idx === 1) {
                ev++;
              } else if (idx === 2) {
                pv++;
              }
            } else {
              // Backward compatible text fallback
              const isPrewed = nameLower.includes('pre-wedding') || nameLower.includes('prewed') || nameLower.includes('outdoor');
              const isReception = nameLower.includes('reception') || nameLower.includes('engagement') || nameLower.includes('eve');

              if (isPrewed) {
                pv++;
              } else if (isReception) {
                ev++;
              } else {
                if (nameLower.includes('candid') || nameLower.includes('cinematic')) {
                  wcv++;
                } else {
                  wtv++;
                }
              }
            }
          });
        }

        setWeddingCandidPhoto(wcp);
        setWeddingTradPhoto(wtp);
        setWeddingCandidVideo(wcv);
        setWeddingTradVideo(wtv);
        setEvePhoto(ep);
        setEveVideo(ev);
        setPrewedPhoto(pp);
        setPrewedVideo(pv);

        // 7. Drone
        setHasDrone(payload.droneCharge > 0);

        // 8. Deliverables & Complimentary
        const newDeliverables = [];
        
        // Save the Date Shoot inclusion
        if (payload.stdPhotoQty > 0 || payload.stdPhotoCharge > 0 || payload.stdVideoCharge > 0 || payload.stdEditingCharge > 0 || payload.stdPerPhotoCharge > 0) {
          const stdTypes = [];
          if (payload.stdPhotoCharge > 0 || payload.stdPhotoQty > 0 || payload.stdPerPhotoCharge > 0) stdTypes.push("Photo");
          if (payload.stdVideoCharge > 0 || payload.stdEditingCharge > 0) stdTypes.push("Video");
          
          let stdDetail = `Pre-Wedding Save the Date Shoot (${stdTypes.join(" & ") || "Photo & Video"})`;
          if (payload.stdPhotoQty > 0) {
            stdDetail += ` with ${payload.stdPhotoQty} Edited Photos`;
          }
          newDeliverables.push(stdDetail);
        }

        if (payload.albumQty > 0) {
          const leafsText = payload.albumLeafs ? ` (${payload.albumLeafs} Leafs / ${payload.albumLeafs * 2} Pages)` : '';
          newDeliverables.push(`${payload.albumQty} x Premium Layflat Main Album${leafsText}`);
          if (payload.albumQty > 1) {
            newDeliverables.push(`Miniature Copy of the Main Album for Parents`);
          }
        }
        if (payload.includeHdHighlight !== false) {
          newDeliverables.push("4K/HD Cinematic Highlights Video Film");
        }
        if (payload.includeFullHd !== false) {
          newDeliverables.push("Full HD Wedding Video Film (Traditional Document)");
        }
        newDeliverables.push("All Raw & High-Resolution Edited Images");
        if (payload.pendriveCharge > 0 || payload.includeFullHd !== false) {
          newDeliverables.push("High-Speed USB Pen Drive + Online Digital Link");
        } else {
          newDeliverables.push("Online Digital Gallery Access Link");
        }
        setDeliverables(newDeliverables);

        const newComplimentary = [];
        if (payload.include2Frames !== false) {
          newComplimentary.push("2 x Premium Wall Frames (12x18 inches)");
        }
        if (payload.includeReel !== false) {
          newComplimentary.push("2 x Cinematic Reels (Instagram-Ready)");
        }
        newComplimentary.push("Pre-Wedding Consultation & Planning Session");
        setComplimentary(newComplimentary);

        // 9. Addons
        const addons = [];
        if (Array.isArray(payload.frames) && payload.frames.length > 0) {
          payload.frames.forEach(f => {
            if (f.qty > 0) {
              addons.push({
                id: f.id || `frame-${f.size}`,
                name: `${f.qty} x Custom Wall Frame (${f.size} inches)`,
                enabled: true
              });
            }
          });
        }
        if (Array.isArray(payload.customExpenses)) {
          payload.customExpenses.forEach(exp => {
            if (exp.name) {
              addons.push({
                id: exp.id || `custom-${exp.name}`,
                name: exp.name,
                enabled: true
              });
            }
          });
        }
        setCustomAddons(addons);

      } catch (err) {
        console.error("Failed to parse data parameter", err);
      }
    }
  }, []);

  const generateShareableLink = (isClient) => {
    const params = new URLSearchParams();
    params.set("bride", brideName);
    params.set("groom", groomName);
    params.set("id", proposalId);
    params.set("pdate", proposalDate);
    params.set("wdate", weddingDate);
    params.set("loc", weddingLocation);
    params.set("price", price);
    params.set("lead", leadPhotographer);
    
    params.set("wcp", weddingCandidPhoto);
    params.set("wtp", weddingTradPhoto);
    params.set("wcv", weddingCandidVideo);
    params.set("wtv", weddingTradVideo);
    
    params.set("ep", evePhoto);
    params.set("ev", eveVideo);
    
    params.set("pp", prewedPhoto);
    params.set("pv", prewedVideo);
    
    params.set("drone", hasDrone);
    params.set("led", hasLedWall);
    params.set("previd", hasPreweddingVideo);
    params.set("haldi", hasHaldi);
    
    const enabledCustomAddons = customAddons.filter(a => a.enabled).map(a => a.name);
    if (enabledCustomAddons.length > 0) {
      params.set("caddons", enabledCustomAddons.join(","));
    }
    
    params.set("incpkg", includePackages);
    params.set("pkglnk", packagesLink);
    
    params.set("cimg", coverImage);
    params.set("cpx", coverPositionX);
    params.set("cpy", coverPositionY);
    params.set("cs", coverScale);
    
    params.set("pimg", packageImage);
    params.set("ppx", packagePositionX);
    params.set("ppy", packagePositionY);
    params.set("ps", packageScale);
    
    params.set("phimg", philosophyImage);
    params.set("phpx", philosophyPositionX);
    params.set("phpy", philosophyPositionY);
    params.set("phs", philosophyScale);
    
    params.set("deliv", JSON.stringify(deliverables));
    params.set("compl", JSON.stringify(complimentary));
    params.set("theme", themeColor);
    
    if (isClient) {
      params.set("client", "true");
    }
    
    const shareableUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareableUrl);
    if (isClient) {
      setCopiedClient(true);
      setTimeout(() => setCopiedClient(false), 2000);
    } else {
      setCopiedEdit(true);
      setTimeout(() => setCopiedEdit(false), 2000);
    }
  };
  


  // New list inputs
  const [newDeliverable, setNewDeliverable] = useState("");
  const [newComplimentary, setNewComplimentary] = useState("");



  // Add items
  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const addComplimentary = () => {
    if (newComplimentary.trim()) {
      setComplimentary([...complimentary, newComplimentary.trim()]);
      setNewComplimentary("");
    }
  };

  // Remove items
  const removeDeliverable = (index) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const removeComplimentary = (index) => {
    setComplimentary(complimentary.filter((_, i) => i !== index));
  };

  // Handle PDF Export
  const handlePrint = () => {
    window.print();
  };

  // Generate prefilled WhatsApp Link
  const getWhatsAppLink = () => {
    const addonText = activeAddons.length > 0 ? `\n- Add-ons: ${activeAddons.join(', ')}` : '';
    const packagesText = includePackages ? `\n\nYou can also check our website packages here: ${packagesLink}` : '';
    
    const weddingDetails = [];
    if (weddingCandidPhoto > 0) weddingDetails.push(`${weddingCandidPhoto} Candid Photo${weddingCandidPhoto > 1 ? 's' : ''}`);
    if (weddingTradPhoto > 0) weddingDetails.push(`${weddingTradPhoto} Trad Photo${weddingTradPhoto > 1 ? 's' : ''}`);
    if (weddingCandidVideo > 0) weddingDetails.push(`${weddingCandidVideo} Candid Video${weddingCandidVideo > 1 ? 's' : ''}`);
    if (weddingTradVideo > 0) weddingDetails.push(`${weddingTradVideo} Trad Video${weddingTradVideo > 1 ? 's' : ''}`);
    
    const receptionDetails = [];
    if (evePhoto > 0) receptionDetails.push(`${evePhoto} Photographer${evePhoto > 1 ? 's' : ''}`);
    if (eveVideo > 0) receptionDetails.push(`${eveVideo} Videographer${eveVideo > 1 ? 's' : ''}`);
    
    const prewedDetails = [];
    if (prewedPhoto > 0) prewedDetails.push(`${prewedPhoto} Photographer${prewedPhoto > 1 ? 's' : ''}`);
    if (prewedVideo > 0) prewedDetails.push(`${prewedVideo} Videographer${prewedVideo > 1 ? 's' : ''}`);
    
    const label0 = eventsList[0] ? `${eventsList[0].name} Coverage` : "Wedding Coverage";
    const label1 = eventsList[1] ? `${eventsList[1].name} Coverage` : "Reception Coverage";
    const label2 = eventsList[2] ? `${eventsList[2].name} Coverage` : "Pre-Wedding Coverage";

    let detailsText = "";
    if (weddingDetails.length > 0) detailsText += `\n- ${label0}: ${weddingDetails.join(', ')}`;
    if (receptionDetails.length > 0) detailsText += `\n- ${label1}: ${receptionDetails.join(', ')}`;
    if (prewedDetails.length > 0) detailsText += `\n- ${label2}: ${prewedDetails.join(', ')}`;

    const clientText = brideName ? `${groomName} & ${brideName}` : groomName;
    const message = `Hello Dreamwed Stories! I have reviewed and approved our Digital Proposal (${proposalId}) for our wedding event(s) on ${getFormattedEventDates()}. \n\nClient: ${clientText}\nLocation: ${weddingLocation}\n\nSelected Package Details:${detailsText}${addonText}\n- Total Price: ₹${price} INR${packagesText}\n\nLooking forward to capturing our big day!`;
    return `https://wa.me/919995412955?text=${encodeURIComponent(message)}`;
  };

  const showWeddingCol = (weddingCandidPhoto > 0 || weddingTradPhoto > 0 || weddingCandidVideo > 0 || weddingTradVideo > 0);
  const showReceptionCol = (evePhoto > 0 || eveVideo > 0);
  const showPrewedCol = (prewedPhoto > 0 || prewedVideo > 0);
  const visibleColsCount = (showWeddingCol ? 1 : 0) + (showReceptionCol ? 1 : 0) + (showPrewedCol ? 1 : 0);

  return (
    <div className="bg-[#0e0e11] text-white min-h-screen font-sans selection:bg-[#d1a852] selection:text-black proposal-root-container">
      <style dangerouslySetInnerHTML={{ __html: `
        /* Theme Accent Color Overrides */
        .text-\\[\\#b4975a\\] { color: ${themeColor} !important; }
        .text-\\[\\#967d45\\] { color: ${themeColor}dd !important; }
        .bg-\\[\\#b4975a\\] { background-color: ${themeColor} !important; }
        .hover\\:bg-\\[\\#967d45\\]:hover { background-color: ${themeColor}cc !important; }
        .bg-\\[\\#b4975a\\]\\/10 { background-color: ${themeColor}1a !important; }
        .bg-\\[\\#b4975a\\]\\/5 { background-color: ${themeColor}0d !important; }
        .border-\\[\\#b4975a\\]\\/20 { border-color: ${themeColor}33 !important; }
        .border-\\[\\#b4975a\\]\\/10 { border-color: ${themeColor}1a !important; }
        .border-\\[\\#b4975a\\]\\/30 { border-color: ${themeColor}4d !important; }
        .fill-\\[\\#b4975a\\]\\/20 { fill: ${themeColor}33 !important; }
        .stroke-\\[\\#b4975a\\] { stroke: ${themeColor} !important; }
        .fill-\\[\\#b4975a\\] { fill: ${themeColor} !important; }
        
        /* Customizer UI Accent Overrides */
        .text-\\[\\#d1a852\\] { color: ${themeColor} !important; }
        .border-\\[\\#d1a852\\] { border-color: ${themeColor} !important; }
        .bg-\\[\\#d1a852\\] { background-color: ${themeColor} !important; }
        .hover\\:bg-\\[\\#b08d41\\]:hover { background-color: ${themeColor}dd !important; }
        .accent-\\[\\#d1a852\\] { accent-color: ${themeColor} !important; }
        .focus\\:border-\\[\\#d1a852\\]:focus { border-color: ${themeColor} !important; }
        
        /* SVG Icons Attribute Fallbacks */
        svg[fill="#b4975a"] { fill: ${themeColor} !important; }
        svg[stroke="#b4975a"] { stroke: ${themeColor} !important; }
      ` }} />
      <SEO
        title={`Digital Proposal: ${groomName}${brideName ? ` & ${brideName}` : ""} | Dreamwed PDF Generator`}
        description={`Customized wedding photography and cinematography proposal for ${groomName}${brideName ? ` & ${brideName}` : ""} by Dreamwed PDF Generator.`}
      />

      {/* FIXED WORKSPACE BAR (Hidden in print) */}
      <div className="no-print sticky top-0 left-0 right-0 z-40 bg-[#121216]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 md:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          {window.location.protocol === 'file:' ? (
            <a href="../landing.html" className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold mr-2">
              <Home size={14} className="text-[#d1a852]" />
              <span>Hub Menu</span>
            </a>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#d1a852] fill-[#d1a852]/20" />
              <span className="font-serif tracking-widest text-sm font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent uppercase">
                Dreamwed PDF Generator
              </span>
            </Link>
          )}
          <span className="hidden md:inline text-[11px] text-zinc-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-mono">
            {proposalId}
          </span>
        </div>

        {/* Dynamic header info */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/60 py-1 px-3 rounded-full border border-white/5 font-light">
          <span className="text-[#d1a852]">Presented For:</span>
          <span className="font-semibold uppercase tracking-wider">{groomName}{brideName ? ` & ${brideName}` : ""}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex bg-zinc-900 border border-white/5 p-0.5 rounded-lg mr-2">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-1.5 rounded-md transition-colors ${previewMode === "desktop" ? "bg-[#d1a852]/20 text-[#d1a852]" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Desktop Presentation Mode"
            >
              <Laptop size={15} />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-1.5 rounded-md transition-colors ${previewMode === "mobile" ? "bg-[#d1a852]/20 text-[#d1a852]" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Instagram/Mobile Mock Mode"
            >
              <Smartphone size={15} />
            </button>
          </div>

          {!isClientView && (
            <button
              onClick={() => setCustomizerOpen(true)}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-300 text-xs px-3 py-2 rounded-lg transition-colors font-medium"
            >
              <Sliders size={14} className="text-[#d1a852]" />
              <span className="hidden sm:inline">Customize</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#d1a852] hover:bg-[#b08d41] text-black text-xs px-3.5 py-2 rounded-lg font-semibold shadow-md shadow-[#d1a852]/10 transition-all active:scale-95"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className={`proposal-main-wrapper mx-auto transition-all duration-500 ${
        previewMode === "mobile" 
          ? "md:max-w-[430px] md:my-6 md:border-[8px] md:border-zinc-800 md:rounded-[45px] md:shadow-2xl md:overflow-hidden md:bg-black w-full" 
          : "md:max-w-[850px] md:my-8 md:shadow-2xl md:border md:border-zinc-200/50 md:rounded-2xl w-full"
      }`}>
        <div className="proposal-print-container bg-[#ffffff]">
          
          {/* ======================================================== */}
          {/* PAGE 1: COVER SLIDE */}
          {/* ======================================================== */}
          <section className="proposal-page relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#ffffff]">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <img
                src={resolveAssetPath(coverImage)}
                alt="Timeless Wedding Moment"
                className="w-full h-full object-cover opacity-75"
                style={{
                  objectPosition: `${coverPositionX}% ${coverPositionY}%`,
                  transform: `scale(${coverScale / 100})`,
                }}
              />
              {/* Luxury dark/light gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-transparent to-black/20" />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Top Logo Block */}
            <div className="relative z-10 p-6 md:p-12 flex justify-between items-start">
              <div>
                <span className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase font-bold text-[#d1a852] block mb-2 font-mono">
                  Fine Art & Cinematic Films
                </span>
                <h2 className="font-serif tracking-[0.2em] text-lg md:text-xl font-light uppercase text-white">
                  DREAMWED STORIES
                </h2>
              </div>
              <div className="text-right font-mono text-[9px] md:text-[10px] text-zinc-400/80 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
                PROPOSAL NO: {proposalId}
              </div>
            </div>

            {/* Bottom Glassmorphic Label (AS IN SCREENSHOT 1) */}
            <div className="relative z-10 p-6 md:p-12 mb-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="rounded-2xl md:rounded-[24px] border border-white/40 p-6 md:p-8 max-w-xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-lg bg-white/85"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#b4975a]/10 rounded-full blur-xl pointer-events-none" />
                <div className="text-center space-y-3">
                  <span className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-bold text-zinc-500 block">
                    Presented For
                  </span>
                  
                  {/* Elegant double line separator */}
                  <div className="w-12 h-[1px] bg-[#b4975a]/30 mx-auto" />
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl leading-none font-serif tracking-widest text-zinc-900 font-light uppercase my-4">
                    {groomName} {brideName && <><span className="italic text-[#b4975a] font-normal">&</span> {brideName}</>}
                  </h1>
                  
                  <div className="w-12 h-[1px] bg-[#b4975a]/30 mx-auto" />

                  <p className="text-[10px] md:text-[11px] text-zinc-500 font-mono tracking-widest uppercase pt-2">
                    {getFormattedEventDates()} &bull; {weddingLocation}
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* PAGE 2: CLIENT LOVE (AS IN SCREENSHOT 1) */}
          {/* ======================================================== */}
          <section className="proposal-page proposal-text-page relative w-full min-h-screen py-12 md:py-24 px-4 md:px-16 flex flex-col justify-between bg-[#f9f9fb] border-t border-zinc-100">
            
            <div className="max-w-5xl mx-auto w-full space-y-12 my-auto">
              
              <div className="text-center space-y-3">
                <span className="inline-block px-4 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] tracking-[0.3em] uppercase font-bold font-mono">
                  Testimonials
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-light text-zinc-900 tracking-wide">
                  Client <span className="italic text-[#b4975a] font-normal font-serif">Love</span>
                </h2>
                <div className="w-12 h-[1px] bg-[#b4975a]/30 mx-auto mt-4" />
              </div>

              {/* Dynamic client love testimonials grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {testimonials.map((item, idx) => (
                  <div key={idx} className="bg-white border border-zinc-100 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-between min-h-[260px] shadow-xl shadow-zinc-200/40 hover:border-[#b4975a]/30 transition-all duration-300">
                    <div className="space-y-4">
                      {/* Stars */}
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} fill="#b4975a" stroke="#b4975a" />
                        ))}
                      </div>
                      <p className="text-zinc-600 text-xs md:text-sm font-light leading-relaxed italic">
                        "{item.review}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-zinc-100">
                      <div className="w-9 h-9 rounded-full bg-zinc-50 border border-[#b4975a]/20 flex items-center justify-center font-serif text-sm font-semibold text-[#b4975a]">
                        {item.initials}
                      </div>
                      <div>
                        <h4 className="text-zinc-900 text-xs md:text-sm font-semibold">{item.name}</h4>
                        <p className="text-zinc-400 text-[10px] md:text-[11px] mt-0.5">{item.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Page Indicator */}
            <div className="text-center font-mono text-[10px] text-zinc-400 mt-8">
              PAGE 2 OF 5 &bull; DREAMWED STORIES
            </div>
          </section>

          {/* ======================================================== */}
          {/* PAGE 3: PACKAGE INCLUDES (AS IN SCREENSHOT 2/3) */}
          {/* ======================================================== */}
          <section className="proposal-page relative w-full min-h-screen bg-[#ffffff] border-t border-zinc-100">
            {/* Header Image with stacked big bold title */}
            <div className="relative h-[250px] md:h-[350px] overflow-hidden flex items-end">
              <div className="absolute inset-0 z-0">
                <img
                  src={resolveAssetPath(packageImage)}
                  alt="Wedding Party Yellow Beetle"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${packagePositionX}% ${packagePositionY}%`,
                    transform: `scale(${packageScale / 100})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              
              <div className="relative z-10 w-full px-6 md:px-12 pb-6 md:pb-10 max-w-6xl mx-auto">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl sm:text-5xl md:text-7xl font-sans font-black tracking-tighter text-white leading-none uppercase"
                >
                  PACKAGE <br />
                  <span className="text-[#d1a852]">INCLUDES</span>
                </motion.h2>
              </div>
            </div>

            {/* Coverage details grid */}
            <div className="max-w-6xl mx-auto px-4 md:px-12 py-8 md:py-16 space-y-8 md:space-y-12">
              
              {/* Event columns */}
              {visibleColsCount > 0 && (
                <div className={`grid grid-cols-1 gap-8 md:gap-10 ${
                  visibleColsCount === 3 ? "md:grid-cols-3" :
                  visibleColsCount === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" :
                  "max-w-md mx-auto"
                }`}>
                  
                  {/* COLUMN 1: WEDDING */}
                  {showWeddingCol && (
                    <div className="space-y-4">
                      <h3 className="text-xs tracking-[0.2em] font-semibold text-zinc-500 uppercase border-b border-zinc-200 pb-1 truncate">
                        {eventsList[0] ? `${eventsList[0].name.toUpperCase()} COVERAGE` : "WEDDING COVERAGE"}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-400">
                        {eventsList[0] ? formatEventDate(eventsList[0].date) : weddingDate}
                      </p>
                      <ul className="space-y-3 text-xs md:text-sm font-light text-zinc-800">
                        {weddingCandidPhoto > 0 && (
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b4975a] shrink-0" />
                            <span>{weddingCandidPhoto} CANDID PHOTOGRAPHER{weddingCandidPhoto > 1 ? 'S' : ''}</span>
                          </li>
                        )}
                        {weddingTradPhoto > 0 && (
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b4975a] shrink-0" />
                            <span>{weddingTradPhoto} TRADITIONAL PHOTOGRAPHER{weddingTradPhoto > 1 ? 'S' : ''}</span>
                          </li>
                        )}
                        {weddingCandidVideo > 0 && (
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b4975a] shrink-0" />
                            <span>{weddingCandidVideo} CANDID VIDEOGRAPHER{weddingCandidVideo > 1 ? 'S' : ''}</span>
                          </li>
                        )}
                        {weddingTradVideo > 0 && (
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b4975a] shrink-0" />
                            <span>{weddingTradVideo} TRADITIONAL VIDEOGRAPHER{weddingTradVideo > 1 ? 'S' : ''}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* COLUMN 2: RECEPTION */}
                  {showReceptionCol && (
                    <div className="space-y-4">
                      <h3 className="text-xs tracking-[0.2em] font-semibold text-zinc-500 uppercase border-b border-zinc-200 pb-1 truncate">
                        {eventsList[1] ? `${eventsList[1].name.toUpperCase()} COVERAGE` : "RECEPTION COVERAGE"}
                      </h3>
                      {(eventsList[1] && eventsList[1].date) && (
                        <p className="text-[10px] font-mono text-zinc-400">
                          {formatEventDate(eventsList[1].date)}
                        </p>
                      )}
                      <ul className="space-y-3 text-xs md:text-sm font-light text-zinc-800">
                        {evePhoto > 0 && (
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b4975a] shrink-0" />
                            <span>{evePhoto} PHOTOGRAPHER{evePhoto > 1 ? 'S' : ''}</span>
                          </li>
                        )}
                        {eveVideo > 0 && (
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b4975a] shrink-0" />
                            <span>{eveVideo} VIDEOGRAPHER{eveVideo > 1 ? 'S' : ''}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* COLUMN 3: PRE-WEDDING */}
                  {showPrewedCol && (
                    <div className="space-y-4">
                      <h3 className="text-xs tracking-[0.2em] font-semibold text-zinc-500 uppercase border-b border-zinc-200 pb-1 truncate">
                        {eventsList[2] ? `${eventsList[2].name.toUpperCase()} COVERAGE` : "PRE-WEDDING COVERAGE"}
                      </h3>
                      {(eventsList[2] && eventsList[2].date) && (
                        <p className="text-[10px] font-mono text-zinc-400">
                          {formatEventDate(eventsList[2].date)}
                        </p>
                      )}
                      <ul className="space-y-3 text-xs md:text-sm font-light text-zinc-800">
                        {prewedPhoto > 0 && (
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b4975a] shrink-0" />
                            <span>{prewedPhoto} PHOTOGRAPHER{prewedPhoto > 1 ? 'S' : ''}</span>
                          </li>
                        )}
                        {prewedVideo > 0 && (
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b4975a] shrink-0" />
                            <span>{prewedVideo} VIDEOGRAPHER{prewedVideo > 1 ? 'S' : ''}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ADDITIONAL SERVICES & ADD-ONS */}
              {hasAddons && (
                <div className="border-t border-zinc-200 pt-8">
                  <h3 className="text-xs tracking-[0.25em] font-semibold text-zinc-500 uppercase border-b border-zinc-200 pb-2 mb-4">
                    ADDITIONAL SERVICES & ADD-ONS
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {activeAddons.map((addon, index) => (
                      <div key={index} className="flex items-center gap-2 bg-[#b4975a]/10 border border-[#b4975a]/20 text-[#b4975a] text-xs px-3.5 py-1.5 rounded-full font-medium">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" size={13} />
                        <span>{addon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DELIVERABLES & COMPLIMENTARY ROWS */}
              <div className="border-t border-zinc-200 pt-10">
                <h3 className="text-xs tracking-[0.3em] font-bold text-center text-zinc-400 uppercase mb-8">
                  DELIVERABLES & EXTRAS
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                  
                  {/* Deliverables Column */}
                  <div className="space-y-4">
                    <span className="text-[10px] tracking-widest font-mono text-zinc-400 block uppercase">
                      Physical & Digital Assets
                    </span>
                    <ul className="space-y-3.5">
                      {deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-600 font-light">
                          <Check className="h-4.5 w-4.5 text-[#b4975a] mt-0.5 shrink-0" size={14} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Complimentary Column */}
                  <div className="space-y-4">
                    <span className="text-[10px] tracking-widest font-mono text-[#b4975a] block uppercase font-bold">
                      Complimentary Items
                    </span>
                    <ul className="space-y-3.5">
                      {complimentary.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-600 font-light">
                          <Sparkles className="h-4.5 w-4.5 text-[#b4975a] mt-0.5 shrink-0" size={14} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Pricing banner */}
              <div className="space-y-3">
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Investment Details</p>
                    <p className="text-zinc-600 text-xs mt-1">Package price (excludes travel & accommodation)</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-zinc-400 text-xs font-mono">TOTAL ESTIMATED VALUE</span>
                    <p className="text-2xl md:text-3xl font-serif text-[#b4975a] font-semibold tracking-wide">
                      ₹{price} <span className="text-xs font-sans text-zinc-500 font-normal">INR</span>
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400/80 text-right italic font-light px-2">
                  * Note: Travel & accommodation charges for the crew are excluded and will be extra.
                </p>
              </div>

            </div>

            {/* Bottom Page Indicator */}
            <div className="text-center font-mono text-[10px] text-zinc-400 pb-6">
              PAGE 3 OF 5 &bull; DREAMWED STORIES
            </div>
          </section>

          {/* ======================================================== */}
          {/* PAGE 4: WELCOME LETTER */}
          {/* ======================================================== */}
          <section className="proposal-page proposal-text-page relative w-full min-h-screen py-12 md:py-24 px-4 md:px-16 flex flex-col justify-between bg-[#f9f9fb] border-t border-zinc-100">
            <div className="max-w-4xl mx-auto flex flex-col justify-center h-full space-y-12">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1 rounded-full bg-[#b4975a]/5 border border-[#b4975a]/10 text-[#b4975a] text-[10px] tracking-[0.3em] uppercase font-bold">
                  Our Philosophy
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-zinc-900 leading-tight">
                  Capturing the Poetry of <br />
                  <span className="italic text-[#b4975a] font-normal font-serif font-light">Your Love Story</span>
                </h2>
              </div>

              {/* Grid with letter and secondary black/white photo */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                <div className="md:col-span-7 space-y-6 text-zinc-600 text-sm md:text-base font-light leading-relaxed">
                  <p>
                    Dear {groomName}{brideName ? ` & ${brideName}` : ""},
                  </p>
                  <p>
                    Your wedding day is not just a schedule of events; it is a tapestry of quiet glances, unchoreographed laughter, and raw emotions. At <strong className="text-zinc-950 font-semibold">Dreamwed Stories</strong>, we dedicate our lenses to documenting your legacy with a mixture of fine-art photography and cinematic storytelling.
                  </p>
                  <p>
                    We believe in an unobtrusive approach. We blend into your celebrations, allowing you to live fully in the moment while we capture the fleeting details that standard photography often misses. This digital proposal outlines a tailored collection built specifically for your milestones.
                  </p>
                  <div className="pt-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#b4975a]/10 flex items-center justify-center font-serif text-lg text-[#b4975a] font-semibold">
                      {leadPhotographer ? leadPhotographer.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-zinc-900 font-serif font-medium text-sm leading-none">{leadPhotographer} & Team</p>
                      <p className="text-zinc-400 text-[11px] mt-1">Lead Photographer & Director, Dreamwed Stories</p>
                    </div>
                  </div>
                </div>

                {/* Secondary Image Card */}
                <div className="md:col-span-5 relative group rounded-2xl overflow-hidden border border-zinc-100 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                  <img
                    src={resolveAssetPath(philosophyImage)}
                    alt="Couple Portrait"
                    className="w-full h-[280px] md:h-[350px] object-cover filter grayscale transition-transform duration-300"
                    style={{
                      objectPosition: `${philosophyPositionX}% ${philosophyPositionY}%`,
                      transform: `scale(${philosophyScale / 100})`,
                    }}
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-[10px] font-mono tracking-widest text-[#b4975a] uppercase">DW Capture</p>
                    <p className="text-white font-serif italic text-sm mt-0.5">"Timeless, honest, fine-art"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Page Indicator */}
            <div className="text-center font-mono text-[10px] text-zinc-400 mt-8">
              PAGE 4 OF 5 &bull; DREAMWED STORIES
            </div>
          </section>

          {/* ======================================================== */}
          {/* PAGE 5: BOOKING & ACCEPTANCE */}
          {/* ======================================================== */}
          <section className="proposal-page proposal-text-page relative w-full min-h-screen py-12 md:py-20 px-4 md:px-16 flex flex-col justify-between bg-[#ffffff] border-t border-zinc-100">
            
            <div className="max-w-4xl mx-auto w-full my-auto space-y-8">
              
              <div className="text-center space-y-3">
                <span className="inline-block px-4 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-bold font-mono">
                  Final Step
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-zinc-900 tracking-wide">
                  Lock in <span className="italic text-[#b4975a] font-normal font-serif font-light">Your Date</span>
                </h2>
                <p className="text-zinc-500 text-xs md:text-sm font-light max-w-md mx-auto">
                  To approve this proposal, review the details and click the WhatsApp booking button below to lock your draft.
                </p>
              </div>

              {/* Centered booking steps */}
              <div className="max-w-xl mx-auto w-full pt-4">
                {/* Booking & UPI Steps */}
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-xs">
                  
                  <div className="space-y-4">
                    <h3 className="text-zinc-900 font-medium text-sm flex items-center gap-2">
                      <Lock size={16} className="text-[#b4975a]" />
                      <span>Secure Booking Steps</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-mono text-[10px] text-[#b4975a] shrink-0 font-bold shadow-xs">1</div>
                        <div>
                          <p className="text-zinc-800 text-xs font-semibold">Verify Configuration</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Ensure pricing, coverage staff, and deliverables are correct.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-mono text-[10px] text-[#b4975a] shrink-0 font-bold shadow-xs">2</div>
                        <div>
                          <p className="text-zinc-800 text-xs font-semibold">Draft Advance Payment</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Transfer 10% booking advance to: <strong className="text-zinc-900 font-semibold">dreamwedstories@okaxis</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-mono text-[10px] text-[#b4975a] shrink-0 font-bold shadow-xs">3</div>
                        <div>
                          <p className="text-zinc-800 text-xs font-semibold">Send WhatsApp Confirmation</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Click approval button to send booking parameters to our team.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox for requesting website packages */}
                  <div className="no-print flex flex-col gap-2 bg-zinc-50 border border-zinc-150 p-3 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        id="includePackagesCheckbox"
                        checked={includePackages}
                        onChange={(e) => setIncludePackages(e.target.checked)}
                        className="rounded border-zinc-300 text-[#b4975a] focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer animate-pulse-subtle"
                      />
                      <span className="text-zinc-700 text-xs select-none font-semibold leading-snug">
                        Include standard website packages link in my WhatsApp message
                      </span>
                    </label>
                    {includePackages && (
                      <div className="text-[10px] text-zinc-400 border-t border-zinc-200/50 pt-2 px-1 space-y-1">
                        <span className="block font-mono">Link to send:</span>
                        <a href={packagesLink} target="_blank" rel="noopener noreferrer" className="text-[#b4975a] underline break-all hover:text-[#967d45] font-mono leading-relaxed">
                          {packagesLink}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Approve Action Button */}
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-print w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 bg-[#b4975a] hover:bg-[#967d45] text-white shadow-lg shadow-[#b4975a]/10 hover:scale-[1.02]"
                  >
                    <Send size={14} />
                    <span>Approve Proposal & Chat</span>
                  </a>

                </div>
              </div>

              {/* Guarantees */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 bg-zinc-50 border border-zinc-100 rounded-xl p-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2.5 text-zinc-600 text-xs">
                  <ShieldCheck size={16} className="text-[#b4975a]" />
                  <span>Licensed Photography Team</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-600 text-xs">
                  <Star size={16} className="text-[#b4975a]" />
                  <span>5-Star Rated Service</span>
                </div>
              </div>

            </div>

            {/* Bottom Page Indicator */}
            <div className="text-center font-mono text-[10px] text-zinc-400 pb-4">
              PAGE 5 OF 5 &bull; DREAMWED STORIES
            </div>
          </section>

        </div>
      </div>

      {/* ======================================================== */}
      {/* SIDEBAR CUSTOMIZER PANEL (Hidden in print) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {customizerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizerOpen(false)}
              className="no-print fixed inset-0 z-40 bg-black backdrop-blur-xs"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="no-print fixed top-0 right-0 bottom-0 z-50 w-full max-w-[400px] bg-[#121216] border-l border-white/10 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-[#d1a852]" />
                  <h3 className="font-semibold text-white text-sm">Proposal Customizer</h3>
                </div>
                <button
                  onClick={() => setCustomizerOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tabs list */}
              <div className="flex border-b border-white/5 bg-zinc-900/60 p-1">
                {["details", "package", "deliverables", "design"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 text-[10px] font-mono uppercase rounded-md tracking-wider transition-colors ${activeTab === tab ? "bg-zinc-800 text-[#d1a852] font-semibold border border-white/5" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content Form Scroll */}
              <div className="flex-grow overflow-y-auto p-5 space-y-6">
                
                {/* TAB 1: DETAILS */}
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Client & Event Info</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-mono block">Groom Name</label>
                        <input
                          type="text"
                          value={groomName}
                          onChange={(e) => setGroomName(e.target.value.toUpperCase())}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-mono block">Bride Name</label>
                        <input
                          type="text"
                          value={brideName}
                          onChange={(e) => setBrideName(e.target.value.toUpperCase())}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono block">Lead Photographer</label>
                      <input
                        type="text"
                        value={leadPhotographer}
                        onChange={(e) => setLeadPhotographer(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors"
                      />
                    </div>

                    {eventsList.length > 0 ? (
                      eventsList.map((evt, idx) => (
                        <div key={evt.id || idx} className="space-y-1.5 animate-fadeIn">
                          <label className="text-[10px] text-zinc-400 font-mono block">{evt.name} Date</label>
                          <input
                            type="text"
                            value={evt.date}
                            onChange={(e) => {
                              const newEvents = [...eventsList];
                              newEvents[idx].date = e.target.value;
                              setEventsList(newEvents);
                              if (idx === 0) setWeddingDate(formatEventDate(e.target.value));
                            }}
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-mono block">Wedding Date</label>
                        <input
                          type="text"
                          value={weddingDate}
                          onChange={(e) => setWeddingDate(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono block">Location</label>
                      <input
                        type="text"
                        value={weddingLocation}
                        onChange={(e) => setWeddingLocation(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-mono block">Proposal Code</label>
                        <input
                          type="text"
                          value={proposalId}
                          onChange={(e) => setProposalId(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-mono block">Proposal Date</label>
                        <input
                          type="text"
                          value={proposalDate}
                          onChange={(e) => setProposalDate(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2.5 border-t border-white/5">
                      <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePackages}
                          onChange={(e) => setIncludePackages(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-950 text-[#d1a852] focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
                        />
                        <span>Include Packages Link in WhatsApp</span>
                      </label>
                      
                      {includePackages && (
                        <div className="space-y-1.5 pl-6 animate-fadeIn">
                          <label className="text-[10px] text-zinc-400 font-mono block">Website Packages URL (Add Link Here)</label>
                          <input
                            type="text"
                            value={packagesLink}
                            onChange={(e) => setPackagesLink(e.target.value)}
                            placeholder="e.g. https://dreamwedstories.com/packages"
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors font-mono text-zinc-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: PACKAGE STAFF */}
                {activeTab === "package" && (
                  <div className="space-y-6">
                    {/* Website Package Template Selector */}
                    <div className="space-y-1.5 pb-4 border-b border-white/10">
                      <label className="text-[10px] text-zinc-400 font-mono block">Load Website Package Template</label>
                      <select
                        value={selectedPackageIndex}
                        onChange={(e) => handleSelectPackageTemplate(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#d1a852] outline-none transition-colors text-white cursor-pointer"
                      >
                        <option value="" disabled>-- Select website package --</option>
                        <optgroup label="Wedding Packages" className="bg-[#121216]">
                          <option value="0">Wedding Photography (₹39,999)</option>
                          <option value="1">Wedding Photo & Pre-Wedding (₹54,999)</option>
                          <option value="2">Candid Photo & Videography (₹69,999)</option>
                          <option value="3">Premium Candid Package (₹79,999)</option>
                          <option value="4">Bride & Groom Luxury Package (₹1,10,000)</option>
                        </optgroup>
                        <optgroup label="Standalone Wedding Coverages" className="bg-[#121216]">
                          <option value="5">Standalone Wedding Day (₹39,999)</option>
                          <option value="6">Standalone Reception (₹19,999)</option>
                        </optgroup>
                        <optgroup label="Engagement Collections" className="bg-[#121216]">
                          <option value="7">Engagement Photography (₹12,000)</option>
                          <option value="8">Bride or Groom Engagement Package (₹28,999)</option>
                        </optgroup>
                        <optgroup label="Haldi Collections" className="bg-[#121216]">
                          <option value="9">Haldi Photography (Only) (₹10,000)</option>
                          <option value="10">Haldi Photography with Album (₹15,000)</option>
                          <option value="11">Haldi Photo & Videography (₹28,000)</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Wedding Staff</span>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                          <span className="text-zinc-400 font-mono">Candid Photographer</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setWeddingCandidPhoto(Math.max(0, weddingCandidPhoto - 1))} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Minus size={10} /></button>
                            <span className="w-5 text-center font-mono font-bold text-white">{weddingCandidPhoto}</span>
                            <button onClick={() => setWeddingCandidPhoto(weddingCandidPhoto + 1)} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Plus size={10} /></button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                          <span className="text-zinc-400 font-mono">Traditional Photographer</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setWeddingTradPhoto(Math.max(0, weddingTradPhoto - 1))} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Minus size={10} /></button>
                            <span className="w-5 text-center font-mono font-bold text-white">{weddingTradPhoto}</span>
                            <button onClick={() => setWeddingTradPhoto(weddingTradPhoto + 1)} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Plus size={10} /></button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                          <span className="text-zinc-400 font-mono">Candid Videographer</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setWeddingCandidVideo(Math.max(0, weddingCandidVideo - 1))} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Minus size={10} /></button>
                            <span className="w-5 text-center font-mono font-bold text-white">{weddingCandidVideo}</span>
                            <button onClick={() => setWeddingCandidVideo(weddingCandidVideo + 1)} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Plus size={10} /></button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                          <span className="text-zinc-400 font-mono">Traditional Videographer</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setWeddingTradVideo(Math.max(0, weddingTradVideo - 1))} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Minus size={10} /></button>
                            <span className="w-5 text-center font-mono font-bold text-white">{weddingTradVideo}</span>
                            <button onClick={() => setWeddingTradVideo(weddingTradVideo + 1)} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Plus size={10} /></button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Reception Staff</span>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                          <span className="text-zinc-400 font-mono">Photographer</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEvePhoto(Math.max(0, evePhoto - 1))} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Minus size={10} /></button>
                            <span className="w-5 text-center font-mono font-bold text-white">{evePhoto}</span>
                            <button onClick={() => setEvePhoto(evePhoto + 1)} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Plus size={10} /></button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                          <span className="text-zinc-400 font-mono">Videographer</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEveVideo(Math.max(0, eveVideo - 1))} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Minus size={10} /></button>
                            <span className="w-5 text-center font-mono font-bold text-white">{eveVideo}</span>
                            <button onClick={() => setEveVideo(eveVideo + 1)} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Plus size={10} /></button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Pre-Wedding Staff</span>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                          <span className="text-zinc-400 font-mono">Photographer</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setPrewedPhoto(Math.max(0, prewedPhoto - 1))} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Minus size={10} /></button>
                            <span className="w-5 text-center font-mono font-bold text-white">{prewedPhoto}</span>
                            <button onClick={() => setPrewedPhoto(prewedPhoto + 1)} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Plus size={10} /></button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                          <span className="text-zinc-400 font-mono">Videographer</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setPrewedVideo(Math.max(0, prewedVideo - 1))} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Minus size={10} /></button>
                            <span className="w-5 text-center font-mono font-bold text-white">{prewedVideo}</span>
                            <button onClick={() => setPrewedVideo(prewedVideo + 1)} className="p-1 bg-zinc-800 rounded hover:bg-zinc-700"><Plus size={10} /></button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SERVICES & ADD-ONS */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Services & Add-ons</span>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer bg-zinc-900/60 p-2.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                          <input
                            type="checkbox"
                            checked={hasDrone}
                            onChange={(e) => setHasDrone(e.target.checked)}
                            className="rounded border-zinc-700 bg-zinc-950 text-[#d1a852] focus:ring-0 focus:ring-offset-0 h-4 w-4"
                          />
                          <span>Aerial Drone (Helicam)</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer bg-zinc-900/60 p-2.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                          <input
                            type="checkbox"
                            checked={hasLedWall}
                            onChange={(e) => setHasLedWall(e.target.checked)}
                            className="rounded border-zinc-700 bg-zinc-950 text-[#d1a852] focus:ring-0 focus:ring-offset-0 h-4 w-4"
                          />
                          <span>LED Wall Setup</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer bg-zinc-900/60 p-2.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                          <input
                            type="checkbox"
                            checked={hasPreweddingVideo}
                            onChange={(e) => setHasPreweddingVideo(e.target.checked)}
                            className="rounded border-zinc-700 bg-zinc-950 text-[#d1a852] focus:ring-0 focus:ring-offset-0 h-4 w-4"
                          />
                          <span>Pre-Wedding Video</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer bg-zinc-900/60 p-2.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                          <input
                            type="checkbox"
                            checked={hasHaldi}
                            onChange={(e) => setHasHaldi(e.target.checked)}
                            className="rounded border-zinc-700 bg-zinc-950 text-[#d1a852] focus:ring-0 focus:ring-offset-0 h-4 w-4"
                          />
                          <span>Haldi Ceremony Coverage</span>
                        </label>
                      </div>
                    </div>

                    {/* CUSTOM SERVICES / ADD-ONS */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Custom Option (Add-on)</span>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Sangeet, Live Stream..."
                          value={newCustomAddonName}
                          onChange={(e) => setNewCustomAddonName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCustomAddon()}
                          className="flex-grow bg-zinc-900 border border-white/10 rounded-lg py-1.5 px-3 text-xs outline-none focus:border-[#d1a852] text-white"
                        />
                        <button
                          onClick={addCustomAddon}
                          className="bg-zinc-800 text-white p-2 rounded-lg border border-white/10 hover:bg-zinc-700 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {customAddons.length > 0 && (
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                          {customAddons.map((addon) => (
                            <div key={addon.id} className="flex items-center justify-between gap-2 bg-zinc-900/60 p-2 rounded border border-white/5">
                              <label className="flex items-center gap-2.5 text-[11px] text-zinc-300 cursor-pointer truncate flex-grow leading-tight">
                                <input
                                  type="checkbox"
                                  checked={addon.enabled}
                                  onChange={() => toggleCustomAddon(addon.id)}
                                  className="rounded border-zinc-700 bg-zinc-950 text-[#d1a852] focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5"
                                />
                                <span className="truncate">{addon.name}</span>
                              </label>
                              <button
                                onClick={() => removeCustomAddon(addon.id)}
                                className="text-zinc-600 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: DELIVERABLES & PRICE */}
                {activeTab === "deliverables" && (
                  <div className="space-y-6">
                    {/* Price Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono block">Package Price (INR)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-[#d1a852] font-semibold text-xs">₹</span>
                        <input
                          type="text"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 pl-6 pr-3 text-xs focus:border-[#d1a852] outline-none transition-colors font-bold font-mono"
                        />
                      </div>
                    </div>

                    {/* Deliverables List editor */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Deliverables</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add new deliverable..."
                          value={newDeliverable}
                          onChange={(e) => setNewDeliverable(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addDeliverable()}
                          className="flex-grow bg-zinc-900 border border-white/10 rounded-lg py-1.5 px-3 text-xs outline-none focus:border-[#d1a852]"
                        />
                        <button
                          onClick={addDeliverable}
                          className="bg-zinc-800 text-white p-2 rounded-lg border border-white/10 hover:bg-zinc-700 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {deliverables.map((item, idx) => (
                          <div
                            key={idx}
                            draggable={draggableItem?.index === idx && draggableItem?.source === 'deliverables'}
                            onDragStart={(e) => handleDragStart(e, idx, 'deliverables')}
                            onDragOver={(e) => handleDragOver(e, idx, 'deliverables')}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center justify-between gap-2 bg-zinc-900/60 p-2 rounded border border-white/5 transition-all ${
                              draggedIndex === idx && dragSource === 'deliverables' ? 'opacity-40 bg-zinc-800' : ''
                            }`}
                          >
                            <div className="flex items-center gap-1.5 flex-grow min-w-0">
                              <GripVertical
                                size={11}
                                className="text-zinc-600 shrink-0 cursor-grab active:cursor-grabbing"
                                onMouseEnter={() => setDraggableItem({ index: idx, source: 'deliverables' })}
                                onMouseLeave={() => setDraggableItem(null)}
                              />
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleEditItem(idx, e.target.value, 'deliverables')}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === "Escape") {
                                    e.target.blur();
                                  }
                                }}
                                className="text-[11px] text-zinc-400 bg-transparent border-0 outline-none w-full focus:text-white focus:bg-zinc-800/40 rounded px-1 -mx-1"
                              />
                            </div>
                            <button
                              onClick={() => removeDeliverable(idx)}
                              className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Complimentary List editor */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Complimentary Extras</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add complimentary item..."
                          value={newComplimentary}
                          onChange={(e) => setNewComplimentary(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addComplimentary()}
                          className="flex-grow bg-zinc-900 border border-white/10 rounded-lg py-1.5 px-3 text-xs outline-none focus:border-[#d1a852]"
                        />
                        <button
                          onClick={addComplimentary}
                          className="bg-zinc-800 text-white p-2 rounded-lg border border-white/10 hover:bg-zinc-700 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {complimentary.map((item, idx) => (
                          <div
                            key={idx}
                            draggable={draggableItem?.index === idx && draggableItem?.source === 'complimentary'}
                            onDragStart={(e) => handleDragStart(e, idx, 'complimentary')}
                            onDragOver={(e) => handleDragOver(e, idx, 'complimentary')}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center justify-between gap-2 bg-zinc-900/60 p-2 rounded border border-white/5 transition-all ${
                              draggedIndex === idx && dragSource === 'complimentary' ? 'opacity-40 bg-zinc-800' : ''
                            }`}
                          >
                            <div className="flex items-center gap-1.5 flex-grow min-w-0">
                              <GripVertical
                                size={11}
                                className="text-zinc-600 shrink-0 cursor-grab active:cursor-grabbing"
                                onMouseEnter={() => setDraggableItem({ index: idx, source: 'complimentary' })}
                                onMouseLeave={() => setDraggableItem(null)}
                              />
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleEditItem(idx, e.target.value, 'complimentary')}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === "Escape") {
                                    e.target.blur();
                                  }
                                }}
                                className="text-[11px] text-zinc-400 bg-transparent border-0 outline-none w-full focus:text-white focus:bg-zinc-800/40 rounded px-1 -mx-1"
                              />
                            </div>
                            <button
                              onClick={() => removeComplimentary(idx)}
                              className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: DESIGN & STYLES */}
                {activeTab === "design" && (
                  <div className="space-y-6">
                    {/* Cover photo selection */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Cover Image</span>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            onClick={() => setCoverImage(img.url)}
                            className={`relative rounded-lg overflow-hidden border-2 h-14 bg-zinc-900 transition-colors ${coverImage === img.url ? "border-[#d1a852]" : "border-white/5 hover:border-white/20"}`}
                          >
                            <img src={resolveAssetPath(img.url)} alt={img.label} className="w-full h-full object-cover" />
                            {coverImage === img.url && (
                              <div className="absolute top-1 right-1 bg-[#d1a852] text-black p-0.5 rounded-full"><Check size={8} /></div>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Cover Alignment & Scale Slider */}
                      <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/5 space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                            <span>Vertical Align (Y)</span>
                            <span>{coverPositionY}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={coverPositionY}
                            onChange={(e) => setCoverPositionY(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#d1a852]"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                            <span>Horizontal Align (X)</span>
                            <span>{coverPositionX}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={coverPositionX}
                            onChange={(e) => setCoverPositionX(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#d1a852]"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                            <span>Zoom Scale</span>
                            <span>{coverScale}%</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="200"
                            value={coverScale}
                            onChange={(e) => setCoverScale(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#d1a852]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Package photo selection */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Package Image</span>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            onClick={() => setPackageImage(img.url)}
                            className={`relative rounded-lg overflow-hidden border-2 h-14 bg-zinc-900 transition-colors ${packageImage === img.url ? "border-[#d1a852]" : "border-white/5 hover:border-white/20"}`}
                          >
                            <img src={resolveAssetPath(img.url)} alt={img.label} className="w-full h-full object-cover" />
                            {packageImage === img.url && (
                              <div className="absolute top-1 right-1 bg-[#d1a852] text-black p-0.5 rounded-full"><Check size={8} /></div>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Package Alignment & Scale Slider */}
                      <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/5 space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                            <span>Vertical Align (Y)</span>
                            <span>{packagePositionY}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={packagePositionY}
                            onChange={(e) => setPackagePositionY(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#d1a852]"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                            <span>Horizontal Align (X)</span>
                            <span>{packagePositionX}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={packagePositionX}
                            onChange={(e) => setPackagePositionX(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#d1a852]"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                            <span>Zoom Scale</span>
                            <span>{packageScale}%</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="200"
                            value={packageScale}
                            onChange={(e) => setPackageScale(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#d1a852]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Secondary photo selection */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Philosophy Image</span>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            onClick={() => setPhilosophyImage(img.url)}
                            className={`relative rounded-lg overflow-hidden border-2 h-14 bg-zinc-900 transition-colors ${philosophyImage === img.url ? "border-[#d1a852]" : "border-white/5 hover:border-white/20"}`}
                          >
                            <img src={resolveAssetPath(img.url)} alt={img.label} className="w-full h-full object-cover filter grayscale" />
                            {philosophyImage === img.url && (
                              <div className="absolute top-1 right-1 bg-[#d1a852] text-black p-0.5 rounded-full"><Check size={8} /></div>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Philosophy Alignment & Scale Slider */}
                      <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/5 space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                            <span>Vertical Align (Y)</span>
                            <span>{philosophyPositionY}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={philosophyPositionY}
                            onChange={(e) => setPhilosophyPositionY(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#d1a852]"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                            <span>Horizontal Align (X)</span>
                            <span>{philosophyPositionX}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={philosophyPositionX}
                            onChange={(e) => setPhilosophyPositionX(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#d1a852]"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                            <span>Zoom Scale</span>
                            <span>{philosophyScale}%</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="200"
                            value={philosophyScale}
                            onChange={(e) => setPhilosophyScale(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#d1a852]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Theme Accent Color Selection */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Accent Theme Color</span>
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Gold", hex: "#b4975a" },
                          { name: "Rose Gold", hex: "#e0a899" },
                          { name: "Emerald", hex: "#4e7e60" },
                          { name: "Sapphire", hex: "#4a6fa5" },
                          { name: "Amethyst", hex: "#8c7bb8" },
                          { name: "Crimson", hex: "#b85c5c" }
                        ].map((preset) => (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => setThemeColor(preset.hex)}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-medium border transition-all bg-zinc-900 hover:border-white/10"
                            style={{
                              borderColor: themeColor === preset.hex ? themeColor : 'rgba(255,255,255,0.05)',
                              color: themeColor === preset.hex ? themeColor : '#a1a1aa'
                            }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.hex }} />
                            <span>{preset.name}</span>
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom Color Input */}
                      <div className="flex items-center gap-2 bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                        <span className="text-[10px] text-zinc-400 font-mono flex-grow">Custom Color Code</span>
                        <div className="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded border border-white/10">
                          <input
                            type="color"
                            value={themeColor}
                            onChange={(e) => setThemeColor(e.target.value)}
                            className="w-5 h-5 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={themeColor.toUpperCase()}
                            onChange={(e) => {
                              if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                                setThemeColor(e.target.value);
                              }
                            }}
                            className="w-14 bg-transparent border-0 outline-none text-[10px] text-zinc-300 font-mono font-bold uppercase p-0"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Footer Save close & Copy Link */}
              <div className="p-5 border-t border-white/10 bg-zinc-900/60 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => generateShareableLink(true)}
                    className="flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition-colors uppercase tracking-wider"
                    title="Copy a clean proposal link for the client (Customizer hidden)"
                  >
                    {copiedClient ? (
                      <>
                        <Check size={12} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={12} />
                        <span>Client Link</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => generateShareableLink(false)}
                    className="flex items-center justify-center gap-1.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold rounded-lg transition-colors uppercase tracking-wider border border-white/5"
                    title="Copy proposal link with customization controls enabled"
                  >
                    {copiedEdit ? (
                      <>
                        <Check size={12} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Edit2 size={12} />
                        <span>Edit Link</span>
                      </>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setCustomizerOpen(false)}
                  className="w-full py-2.5 bg-[#d1a852] hover:bg-[#b08d41] text-black text-xs font-semibold rounded-lg shadow-md transition-colors uppercase tracking-wider"
                >
                  Save & Apply Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
