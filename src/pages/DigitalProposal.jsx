import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import {
  Camera, CheckCircle, Check, Gift, Film, Sparkles,
  ArrowLeft, Upload, Image as ImageIcon, Edit2, Share2,
  Printer, Send, ShieldCheck, Star, Lock, Save, X, Plus, Trash2,
  Move, ZoomIn, Sliders, ChevronDown, FolderOpen
} from "lucide-react";
import SEO from "../components/SEO";
import {
  PARVATHY_SAMPLE_PROPOSAL,
  AVAILABLE_STOCK_PHOTOS,
  DEFAULT_PHOTOS,
  parseProposalWithAI
} from "../utils/pdfProposalParser";

// Helper to construct events list from Budget Tracker payload
function buildEventsFromTrackerData(temp) {
  let events = [];
  const eventsList = temp.eventsList || [];
  const photographers = temp.photographers || [];
  const videographers = temp.videographers || [];

  const hasStdPhotos = (temp.stdPhotoCharge > 0) || (temp.stdPhotoQty > 0) || (temp.stdPerPhotoCharge > 0);
  const hasStdVideos = (temp.stdVideoCharge > 0) || (temp.stdEditingCharge > 0);
  const hasPrewedIndicators = hasStdPhotos || hasStdVideos ||
    photographers.some(p => {
      const n = (p.name || "").toLowerCase();
      return n.includes("prewed") || n.includes("pre-wedding") || n.includes("outdoor") || n.includes("save the date") || n.includes("save-the-date");
    }) ||
    videographers.some(v => {
      const n = (v.name || "").toLowerCase();
      return n.includes("prewed") || n.includes("pre-wedding") || n.includes("outdoor") || n.includes("save the date") || n.includes("save-the-date");
    }) ||
    eventsList.some(ev => {
      const n = (ev.name || "").toLowerCase();
      return n.includes("prewed") || n.includes("pre-wedding") || n.includes("outdoor") || n.includes("save the date") || n.includes("save-the-date");
    });

  // 1. If eventsList has items, map them
  if (eventsList.length > 0) {
    events = eventsList.map((ev) => {
      const evPhotos = photographers.filter(p => p.eventId === ev.id);
      const evVideos = videographers.filter(v => v.eventId === ev.id);
      
      const crew = [];
      evPhotos.forEach(p => {
        crew.push(p.name ? p.name.toUpperCase() : "1 PHOTOGRAPHER");
      });
      evVideos.forEach(v => {
        crew.push(v.name ? v.name.toUpperCase() : "1 VIDEOGRAPHER");
      });

      // Default fallback if no specific crew attached
      if (crew.length === 0) {
        if (ev.name.toLowerCase().includes("reception")) {
          crew.push("1 PHOTOGRAPHER", "1 VIDEOGRAPHER");
        } else if (ev.name.toLowerCase().includes("prewed") || ev.name.toLowerCase().includes("pre-wedding")) {
          crew.push("1 PHOTOGRAPHER", "1 VIDEOGRAPHER", "20 EDITED MASTER PHOTOS");
        } else {
          crew.push("1 TRADITIONAL PHOTOGRAPHER", "1 TRADITIONAL VIDEOGRAPHER");
        }
      }

      return {
        eventTag: ev.name.toUpperCase(),
        title: ev.name.toUpperCase().includes("COVERAGE") ? ev.name.toUpperCase() : `${ev.name.toUpperCase()} COVERAGE`,
        subhead: ev.date || temp.date || "",
        crew: crew,
        description: ev.description || ""
      };
    });
  }

  // 2. Check if Pre-Wedding is already in events
  const hasPrewedEvent = events.some(e => 
    e.title.toLowerCase().includes("pre-wedding") || 
    e.title.toLowerCase().includes("prewedding") || 
    e.title.toLowerCase().includes("save the date")
  );

  // If Pre-Wedding indicators exist and not already in events, add it
  if (hasPrewedIndicators && !hasPrewedEvent) {
    const prewedCrew = [];
    if (hasStdPhotos) prewedCrew.push("1 CANDID PHOTOGRAPHER");
    if (hasStdVideos) prewedCrew.push("1 CINEMATIC VIDEOGRAPHER");
    if (temp.stdPhotoQty > 0) {
      prewedCrew.push(`${temp.stdPhotoQty} EDITED MASTER PHOTOS`);
    } else {
      prewedCrew.push("20 EDITED MASTER PHOTOS");
    }

    events.unshift({
      eventTag: "PRE-WEDDING",
      title: "PRE-WEDDING COVERAGE",
      subhead: "Pre-Wedding Shoot & Save The Date",
      crew: prewedCrew.length > 0 ? prewedCrew : ["1 PHOTOGRAPHER", "1 VIDEOGRAPHER", "20 EDITED MASTER PHOTOS"],
      description: "Outdoor couple portrait & cinematic video session capturing candid storytelling."
    });
  }

  // 3. Fallback if events is empty
  if (events.length === 0) {
    events = [
      {
        eventTag: "WEDDING",
        title: "WEDDING COVERAGE",
        subhead: temp.date || "December 3, 2026",
        crew: ["1 TRADITIONAL PHOTOGRAPHER", "1 TRADITIONAL VIDEOGRAPHER"]
      },
      {
        eventTag: "RECEPTION",
        title: "RECEPTION COVERAGE",
        subhead: "Reception Celebration",
        crew: ["1 PHOTOGRAPHER", "1 VIDEOGRAPHER"]
      }
    ];
  }

  return events;
}

export const SREENIDHI_SAMPLE_PROPOSAL = {
  id: "proposal_sreenidhi",
  proposalNo: "DW-SREENIDHI-2026",
  clientName: "Sreenidhi",
  eventDate: "October 2, 2026 & October 5, 2026",
  venue: "Guruvayoor",
  price: "94,999",
  packageTitle: "Bespoke Two-Day Wedding & Intimate Celebration",
  packageSubtitle: "Fine Art Photography & Master 4K Cinematic Films",
  phone: "9995412955",
  photos: {
    ...DEFAULT_PHOTOS,
    coverAlign: { x: 50, y: 50, scale: 100 },
    bannerAlign: { x: 50, y: 30, scale: 100 },
    philosophyAlign: { x: 50, y: 50, scale: 100 }
  },
  addons: ["Lead Photographer (Me)", "Traditional Wedding & Intimate Coverage", "40 Leaf Archival Layflat Album"],
  events: [
    {
      eventTag: "WEDDING",
      title: "WEDDING CEREMONY COVERAGE",
      subhead: "October 2, 2026",
      crew: ["1 LEAD PHOTOGRAPHER", "1 VIDEOGRAPHER"],
      description: "Full traditional ceremony, sacred rituals, and family storytelling portraiture."
    },
    {
      eventTag: "INTIMATE WEDDING",
      title: "INTIMATE WEDDING COVERAGE",
      subhead: "October 5, 2026",
      crew: ["1 LEAD PHOTOGRAPHER", "1 VIDEOGRAPHER"],
      description: "Intimate gathering, couple fine art portraits, and heartfelt celebratory moments."
    }
  ],
  deliverables: {
    albums: [
      { tag: "INCLUDED", title: "1 x Premium Layflat Main Album (40 Leafs / 80 Pages)", desc: "Archival matte paper, custom embossed presentation box" },
      { tag: "INCLUDED", title: "Miniature Companion Copy for Parents", desc: "80 Pages companion replica album" }
    ],
    films: [
      { tag: "INCLUDED", title: "4K/HD Cinematic Highlights Video Film", desc: "5-7 mins narrative video film" },
      { tag: "INCLUDED", title: "Full HD Wedding Video Film (Traditional Document)", desc: "Complete ceremony document" },
      { tag: "INCLUDED", title: "All Raw & High-Resolution Edited Images", desc: "Digital Master Collection" },
      { tag: "INCLUDED", title: "High-Speed USB Pen Drive + Online Digital Link", desc: "Direct Cloud Gallery" }
    ],
    complimentary: [
      { tag: "GIFT", title: "2 x Premium Wall Frames (12x18 inches)", desc: "Silk matte wooden finish" },
      { tag: "GIFT", title: "2 x Cinematic Reels (Instagram-Ready)", desc: "Vertical reels format" },
      { tag: "GIFT", title: "Pre-Wedding Consultation & Planning Session", desc: "1-on-1 creative session" }
    ]
  },
  testimonials: PARVATHY_SAMPLE_PROPOSAL.testimonials,
  directorNote: PARVATHY_SAMPLE_PROPOSAL.directorNote,
  studioInfo: PARVATHY_SAMPLE_PROPOSAL.studioInfo
};

export default function DigitalProposal() {
  const [searchParams] = useSearchParams();
  const { id: paramId } = useParams();

  // Proposal State
  const [proposal, setProposal] = useState(PARVATHY_SAMPLE_PROPOSAL);
  const [editMode, setEditMode] = useState(false);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [activePhotoSlot, setActivePhotoSlot] = useState(null);
  const [alignModalOpen, setAlignModalOpen] = useState(false);
  const [activeAlignSlot, setActiveAlignSlot] = useState("coverAlign");
  const [savedProposalsModalOpen, setSavedProposalsModalOpen] = useState(false);
  const [savedProposalsList, setSavedProposalsList] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Load proposal from localStorage or URL
  useEffect(() => {
    async function loadProposal() {
      try {
        const targetId = paramId || searchParams.get("id");
        const clientQuery = searchParams.get("client") || searchParams.get("groom");
        const priceParam = searchParams.get("price");
        const locParam = searchParams.get("loc");
        const wdateParam = searchParams.get("wdate");
        const isFromTracker = searchParams.get("from_ipc") === "true" || searchParams.get("from_storage") === "true";

        // Check budget tracker transfer data (localStorage or Electron IPC)
        let tempJson = localStorage.getItem("temp_proposal_data");
        if (window.electronAPI && typeof window.electronAPI.getTempProposal === "function") {
          try {
            const ipcData = await window.electronAPI.getTempProposal();
            if (ipcData) tempJson = ipcData;
          } catch (e) {
            console.warn("Could not get IPC temp proposal:", e);
          }
        }

        let tempProposal = null;
        if (tempJson) {
          try {
            const temp = typeof tempJson === "string" 
              ? JSON.parse(tempJson.replace(/"\/images\//g, '"./images/').replace(/"\/videos\//g, '"./videos/'))
              : tempJson;

            if (temp.clientName || clientQuery) {
              const mappedEvents = buildEventsFromTrackerData(temp);

              const hasPrewed = (temp.stdPhotoCharge > 0) || (temp.stdVideoCharge > 0) || (temp.stdPhotoQty > 0) ||
                mappedEvents.some(e => e.title.toLowerCase().includes("pre-wedding") || e.title.toLowerCase().includes("prewedding") || e.title.toLowerCase().includes("save the date"));

              const albumsList = [
                { tag: "INCLUDED", title: `${temp.albumQty || 1} x Premium Layflat Main Album (${temp.albumLeafs || 40} Leafs / ${(temp.albumLeafs || 40) * 2} Pages)`, desc: "Archival matte paper, custom embossed presentation box" },
                { tag: "INCLUDED", title: "Miniature Copy of Main Album for Parents", desc: "80 Pages companion replica album" }
              ];

              if (hasPrewed) {
                albumsList.push({
                  tag: "INCLUDED",
                  title: "Pre-Wedding Save the Date Shoot (Photo & Video)",
                  desc: "High-resolution edited master photographs & cinematic video session"
                });
              }

              tempProposal = {
                ...PARVATHY_SAMPLE_PROPOSAL,
                id: temp.id || targetId || "proposal_custom",
                clientName: temp.clientName || clientQuery || "Dr. Sreehari .B",
                eventDate: temp.date || wdateParam || "December 3, 2026 & December 5, 2026",
                venue: temp.location || locParam || "Kottarakara",
                price: temp.packagePrice ? Number(temp.packagePrice).toLocaleString("en-IN") : (priceParam || "64,999"),
                addons: temp.droneCharge > 0 ? ["Aerial Drone (Helicam) Coverage"] : ["Standard Package"],
                events: mappedEvents,
                deliverables: {
                  albums: albumsList,
                  films: [
                    { tag: "INCLUDED", title: "4K/HD Cinematic Highlights Video Film", desc: "5-7 mins narrative video film" },
                    { tag: "INCLUDED", title: "Full HD Wedding Video Film (Traditional Document)", desc: "Complete ceremony document" },
                    { tag: "INCLUDED", title: "All Raw & High-Resolution Edited Images", desc: "Digital Master Collection" },
                    { tag: "INCLUDED", title: "High-Speed USB Pen Drive + Online Digital Link", desc: "Direct Cloud Gallery" }
                  ],
                  complimentary: [
                    { tag: "GIFT", title: "2 x Premium Wall Frames (12x18 inches)", desc: "Silk matte wooden finish" },
                    { tag: "GIFT", title: "2 x Cinematic Reels (Instagram-Ready)", desc: "Vertical reels format" },
                    { tag: "GIFT", title: "Pre-Wedding Consultation & Planning Session", desc: "1-on-1 creative session" }
                  ]
                }
              };
            }
          } catch (e) {
            console.warn("Could not parse temp_proposal_data:", e);
          }
        }

        let savedList = JSON.parse(
          (localStorage.getItem("dreamwed_vip_proposals_list") || "[]")
            .replace(/"\/images\//g, '"./images/')
            .replace(/"\/videos\//g, '"./videos/')
        );

        // Ensure Sreenidhi is always available in savedList
        if (!savedList.some(p => p.id === "proposal_sreenidhi" || p.clientName?.toLowerCase().includes("sreenidhi"))) {
          savedList = [SREENIDHI_SAMPLE_PROPOSAL, ...savedList];
          try {
            localStorage.setItem("dreamwed_vip_proposals_list", JSON.stringify(savedList));
          } catch(e){}
        }

        let matched = null;

        // If coming directly from budget tracker, prioritize tempProposal with latest events and pricing
        if (isFromTracker && tempProposal) {
          const existing = savedList.find(
            (p) => p.id === tempProposal.id || p.clientName?.toLowerCase() === tempProposal.clientName?.toLowerCase()
          );
          if (existing && existing.photos) {
            tempProposal.photos = { ...DEFAULT_PHOTOS, ...existing.photos };
          }
          matched = tempProposal;
        } else {
          if (targetId) {
            matched = savedList.find((p) => p.id === targetId);
          } else if (clientQuery) {
            matched = savedList.find(
              (p) => p.clientName?.toLowerCase() === clientQuery.toLowerCase()
            );
          }

          if (!matched && tempProposal) {
            matched = tempProposal;
          }
        }

        if (!matched) {
          const activeSaved = localStorage.getItem("active_vip_proposal");
          if (activeSaved) {
            matched = JSON.parse(
              activeSaved.replace(/"\/images\//g, '"./images/').replace(/"\/videos\//g, '"./videos/')
            );
          }
        }

        // Fallback to Sreenidhi if requested or default
        if (!matched && (targetId === "proposal_sreenidhi" || (clientQuery && clientQuery.toLowerCase().includes("sreenidhi")))) {
          matched = SREENIDHI_SAMPLE_PROPOSAL;
        }

      if (matched) {
        const photos = {
          ...DEFAULT_PHOTOS,
          ...(matched.photos || {}),
          coverAlign: matched.photos?.coverAlign || { x: 50, y: 50, scale: 100 },
          bannerAlign: matched.photos?.bannerAlign || { x: 50, y: 30, scale: 100 },
          philosophyAlign: matched.photos?.philosophyAlign || { x: 50, y: 50, scale: 100 }
        };
        matched.photos = photos;
        setProposal(matched);
      } else {
        const defaultProp = {
          ...PARVATHY_SAMPLE_PROPOSAL,
          photos: {
            ...DEFAULT_PHOTOS,
            coverAlign: { x: 50, y: 50, scale: 100 },
            bannerAlign: { x: 50, y: 30, scale: 100 },
            philosophyAlign: { x: 50, y: 50, scale: 100 }
          }
        };
        setProposal(defaultProp);
      }
    } catch (e) {
      console.warn("Could not load stored proposal, using default:", e);
      setProposal(PARVATHY_SAMPLE_PROPOSAL);
    }
    }

    loadProposal();
  }, [paramId, searchParams]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSaveProposal = () => {
    localStorage.setItem("active_vip_proposal", JSON.stringify(proposal));
    const savedList = JSON.parse(localStorage.getItem("dreamwed_vip_proposals_list") || "[]");
    const updatedList = [proposal, ...savedList.filter((p) => p.id !== proposal.id && p.clientName?.toLowerCase() !== proposal.clientName?.toLowerCase())];
    localStorage.setItem("dreamwed_vip_proposals_list", JSON.stringify(updatedList));

    // CRITICAL BIDIRECTIONAL SYNC: Automatically write back to vows_and_values_events in Dreamwed Office
    try {
      const storedEvents = JSON.parse(localStorage.getItem("vows_and_values_events") || "[]");
      const numPrice = parseFloat(String(proposal.price || "0").replace(/[^0-9.]/g, "")) || 65000;
      
      const existingIdx = storedEvents.findIndex(
        (e) => (e.id && proposal.id && e.id === proposal.id) ||
               (e.clientName && proposal.clientName && e.clientName.toLowerCase() === proposal.clientName.toLowerCase())
      );

      const mappedEvent = {
        id: proposal.id || ("proposal_" + (proposal.clientName || "client").replace(/\s+/g, "_")),
        clientName: proposal.clientName || "Client",
        location: proposal.venue || "Wedding Venue",
        date: proposal.eventDate || "",
        packagePrice: numPrice,
        travelCharge: existingIdx !== -1 ? (storedEvents[existingIdx].travelCharge || 2000) : 2000,
        travelPaidByCustomer: false,
        stayExpense: existingIdx !== -1 ? (storedEvents[existingIdx].stayExpense || 0) : 0,
        foodExpense: existingIdx !== -1 ? (storedEvents[existingIdx].foodExpense || 0) : 0,
        budgetMode: "standard",
        targetProfit: 0,
        droneCharge: (proposal.addons || []).some(a => (a || "").toLowerCase().includes("drone")) ? 5000 : 0,
        stdPhotoCharge: 0,
        stdPhotoIsMe: false,
        stdVideoCharge: 0,
        stdVideoIsMe: false,
        stdPerPhotoCharge: 0,
        stdPhotoQty: 0,
        stdEditingCharge: 0,
        albumQty: 1,
        albumCoverCharge: 2500,
        albumLeafs: 40,
        albumLeafCharge: 75,
        albumDesigningCharge: 100,
        videoEditingCharge: 8000,
        pendriveCharge: 500,
        includeHdHighlight: true,
        includeReel: true,
        includeFullHd: true,
        include2Frames: true,
        eventsList: (proposal.events || []).map((ev, idx) => ({
          id: "_prop_ev_" + idx,
          name: ev.eventTag || ev.title || `Event #${idx + 1}`,
          date: ev.subhead || proposal.eventDate || ""
        })),
        photographers: existingIdx !== -1 ? (storedEvents[existingIdx].photographers || []) : [],
        videographers: existingIdx !== -1 ? (storedEvents[existingIdx].videographers || []) : [],
        frames: [{ id: "_prop_f1", size: "12*18", qty: 2, charge: 350 }],
        customExpenses: [],
        createdAt: existingIdx !== -1 ? (storedEvents[existingIdx].createdAt || new Date().toISOString()) : new Date().toISOString()
      };

      if (existingIdx !== -1) {
        storedEvents[existingIdx] = { ...storedEvents[existingIdx], ...mappedEvent };
      } else {
        storedEvents.unshift(mappedEvent);
      }

      localStorage.setItem("vows_and_values_events", JSON.stringify(storedEvents));
      
      // Also sync temp_proposal_data
      localStorage.setItem("temp_proposal_data", JSON.stringify({
        ...mappedEvent,
        events: proposal.events,
        price: proposal.price
      }));
    } catch (e) {
      console.warn("Could not sync proposal to vows_and_values_events:", e);
    }

    showToast("💾 Proposal & Dreamwed Office synced successfully!");
  };

  const copyClientLink = () => {
    const url = window.location.origin + "/proposal?id=" + proposal.id;
    navigator.clipboard.writeText(url);
    showToast("✨ Client Proposal link copied to clipboard!");
  };

  const handlePrint = () => {
    // Guarantees proposal is saved into Dreamwed Office before printing/saving PDF
    handleSaveProposal();

    if (window.electronAPI && typeof window.electronAPI.exportToPDF === "function") {
      window.electronAPI.exportToPDF({
        landscape: false,
        pageSize: "A4",
        printBackground: true,
        defaultName: `Wedding_Proposal_${(proposal.clientName || "Client").replace(/\s+/g, "_")}.pdf`
      });
    } else {
      window.print();
    }
  };

  // Photo Swapping
  const openPhotoPickerFor = (slotKey) => {
    setActivePhotoSlot(slotKey);
    setPhotoPickerOpen(true);
  };

  const handleSelectPhoto = (photoUrl) => {
    if (!activePhotoSlot) return;
    const updatedProposal = { ...proposal };
    const photos = { ...updatedProposal.photos };

    if (activePhotoSlot === "coverPhoto") {
      photos.coverPhoto = photoUrl;
    } else if (activePhotoSlot === "packageBanner") {
      photos.packageBannerPhoto = photoUrl;
    } else if (activePhotoSlot === "philosophy") {
      photos.philosophyPhoto = photoUrl;
    } else {
      photos[activePhotoSlot] = photoUrl;
    }

    updatedProposal.photos = photos;
    setProposal(updatedProposal);
    localStorage.setItem("active_vip_proposal", JSON.stringify(updatedProposal));
    setPhotoPickerOpen(false);
    showToast("🖼️ Photo updated successfully!");
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      handleSelectPhoto(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Photo Alignment Controls
  const openAlignModalFor = (slotKey) => {
    setActiveAlignSlot(slotKey);
    setAlignModalOpen(true);
  };

  const updateAlignment = (slotKey, axis, value) => {
    setProposal((prev) => {
      const photos = { ...prev.photos };
      const currentAlign = photos[slotKey] || { x: 50, y: 50, scale: 100 };
      photos[slotKey] = { ...currentAlign, [axis]: Number(value) };
      return { ...prev, photos };
    });
  };

  const setAlignPreset = (slotKey, x, y) => {
    setProposal((prev) => {
      const photos = { ...prev.photos };
      const currentAlign = photos[slotKey] || { x: 50, y: 50, scale: 100 };
      photos[slotKey] = { ...currentAlign, x, y };
      return { ...prev, photos };
    });
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAiProcessing(true);
    showToast("🤖 AI reading proposal PDF with Gemini 2.5 Flash...");
    try {
      const parsed = await parseProposalWithAI(file, file.name);
      setProposal(parsed);
      localStorage.setItem("active_vip_proposal", JSON.stringify(parsed));
      const savedList = JSON.parse(localStorage.getItem("dreamwed_vip_proposals_list") || "[]");
      const updatedList = [parsed, ...savedList.filter((p) => p.id !== parsed.id)];
      localStorage.setItem("dreamwed_vip_proposals_list", JSON.stringify(updatedList));
      showToast("🎉 AI successfully built proposal for " + parsed.clientName + "!");
    } catch (err) {
      console.error(err);
      alert("Error parsing PDF: " + err.message);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const updateField = (field, value) => {
    setProposal((prev) => ({ ...prev, [field]: value }));
  };

  const updateEventField = (evIdx, field, value) => {
    setProposal((prev) => {
      const newEvents = [...(prev.events || [])];
      newEvents[evIdx] = { ...newEvents[evIdx], [field]: value };
      return { ...prev, events: newEvents };
    });
  };

  const updateCrewMember = (evIdx, cIdx, value) => {
    setProposal((prev) => {
      const newEvents = [...(prev.events || [])];
      const newCrew = [...(newEvents[evIdx].crew || [])];
      newCrew[cIdx] = value;
      newEvents[evIdx] = { ...newEvents[evIdx], crew: newCrew };
      return { ...prev, events: newEvents };
    });
  };

  const addCrewMember = (evIdx) => {
    setProposal((prev) => {
      const newEvents = [...(prev.events || [])];
      newEvents[evIdx] = {
        ...newEvents[evIdx],
        crew: [...(newEvents[evIdx].crew || []), "1 NEW CREW MEMBER"]
      };
      return { ...prev, events: newEvents };
    });
  };

  const removeCrewMember = (evIdx, cIdx) => {
    setProposal((prev) => {
      const newEvents = [...(prev.events || [])];
      const newCrew = [...(newEvents[evIdx].crew || [])];
      newCrew.splice(cIdx, 1);
      newEvents[evIdx] = { ...newEvents[evIdx], crew: newCrew };
      return { ...prev, events: newEvents };
    });
  };

  const addPreWeddingEvent = () => {
    setProposal((prev) => {
      const events = [...(prev.events || [])];
      const alreadyHas = events.some(e => e.title.toLowerCase().includes("pre-wedding") || e.title.toLowerCase().includes("prewedding"));
      if (alreadyHas) {
        showToast("Pre-Wedding coverage is already in the list!");
        return prev;
      }
      events.unshift({
        eventTag: "PRE-WEDDING",
        title: "PRE-WEDDING COVERAGE",
        subhead: "Pre-Wedding Shoot & Save The Date",
        crew: ["1 CANDID PHOTOGRAPHER", "1 CINEMATIC VIDEOGRAPHER", "20 EDITED MASTER PHOTOS"],
        description: "Outdoor couple portrait & video session capturing authentic storytelling."
      });
      showToast("✨ Added Pre-Wedding Coverage column!");
      return { ...prev, events };
    });
  };

  const addCustomEvent = () => {
    setProposal((prev) => {
      const events = [...(prev.events || [])];
      events.push({
        eventTag: "EVENT",
        title: "NEW EVENT COVERAGE",
        subhead: proposal.eventDate || "Event Date",
        crew: ["1 PHOTOGRAPHER", "1 VIDEOGRAPHER"],
        description: "Coverage for additional wedding ceremony event."
      });
      return { ...prev, events };
    });
  };

  const removeEvent = (evIdx) => {
    setProposal((prev) => {
      const events = [...(prev.events || [])];
      events.splice(evIdx, 1);
      return { ...prev, events };
    });
  };

  const updateDeliverableItem = (category, idx, value) => {
    setProposal((prev) => {
      const newDeliv = { ...(prev.deliverables || {}) };
      const list = [...(newDeliv[category] || [])];
      if (typeof list[idx] === "string") {
        list[idx] = value;
      } else {
        list[idx] = { ...list[idx], title: value };
      }
      newDeliv[category] = list;
      return { ...prev, deliverables: newDeliv };
    });
  };

  const addDeliverableItem = (category) => {
    setProposal((prev) => {
      const newDeliv = { ...(prev.deliverables || {}) };
      const list = [...(newDeliv[category] || [])];
      list.push({ tag: "INCLUDED", title: "New Deliverable Item", desc: "" });
      newDeliv[category] = list;
      return { ...prev, deliverables: newDeliv };
    });
  };

  const removeDeliverableItem = (category, idx) => {
    setProposal((prev) => {
      const newDeliv = { ...(prev.deliverables || {}) };
      const list = [...(newDeliv[category] || [])];
      list.splice(idx, 1);
      newDeliv[category] = list;
      return { ...prev, deliverables: newDeliv };
    });
  };

  const getWhatsAppLink = () => {
    const phone = proposal.phone || "9995412955";
    const text = encodeURIComponent(
      `Hello Unni Krishnan & Dreamwed Stories Team,\n\nI have reviewed the personalized wedding proposal for ${proposal.clientName} (${proposal.packageTitle || "Photography & Cinematography Package"}, ₹${proposal.price} INR).\n\nWe would like to confirm our wedding date (${proposal.eventDate} at ${proposal.venue}) and proceed with the 10% token advance.\n\nProposal Link: ${window.location.origin}/proposal?id=${proposal.id}`
    );
    return `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${text}`;
  };

  const normalizeItem = (item) => {
    if (typeof item === "string") return { title: item, desc: "" };
    return { title: item.title || item.desc || "", desc: item.desc || "" };
  };

  // Alignments
  const coverAlign = proposal.photos?.coverAlign || { x: 50, y: 50, scale: 100 };
  const bannerAlign = proposal.photos?.bannerAlign || { x: 50, y: 30, scale: 100 };
  const philosophyAlign = proposal.photos?.philosophyAlign || { x: 50, y: 50, scale: 100 };

  return (
    <div className="min-h-screen bg-[#EDE8E1] text-stone-900 font-sans antialiased selection:bg-[#c5a880]/30 selection:text-[#8c6a23]">
      <SEO
        title={`${proposal.clientName} — Luxury Wedding Photography Proposal | Dreamwed Stories`}
        description={`Bespoke wedding photography and cinematic film proposal for ${proposal.clientName} by Dreamwed Stories.`}
      />

      {/* ================= TOP TOOLBAR (NO-PRINT) ================= */}
      <header className="w-full bg-[#161B22] text-white sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between shadow-xl border-b border-white/10 no-print">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <img src="./images/dreamwed_logo.png" alt="Logo" className="w-5 h-5 object-contain" />
            <span className="text-xs tracking-wider uppercase font-semibold text-stone-200">
              Dreamwed Stories • Editorial Proposal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Mode Toggle */}
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              editMode
                ? "bg-amber-500 text-stone-950 border-amber-400 font-bold"
                : "bg-white/10 border-white/15 text-stone-200 hover:bg-white/20"
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{editMode ? "Edit Mode: ON" : "Edit Proposal"}</span>
          </button>

          {/* Dedicated Photo Alignment Button */}
          <button
            onClick={() => {
              setActiveAlignSlot("coverAlign");
              setAlignModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Adjust photo focal point alignment & zoom"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Align Photos</span>
          </button>

          {/* Quick Pre-Wedding Add Button */}
          <button
            onClick={addPreWeddingEvent}
            className="px-3 py-1.5 rounded-xl border border-amber-400/40 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Add Pre-Wedding Coverage column"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">+ Pre-Wedding</span>
          </button>

          {/* Upload PDF */}
          <label className="cursor-pointer px-3 py-1.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs">
            <Upload className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">
              {isAiProcessing ? "AI Reading..." : "Upload PDF"}
            </span>
            <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
          </label>

          {/* Saved Proposals Modal Toggle */}
          <button
            onClick={() => {
              const saved = JSON.parse(localStorage.getItem("dreamwed_vip_proposals_list") || "[]");
              setSavedProposalsList(saved);
              setSavedProposalsModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Browse all saved proposals"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Proposals</span>
          </button>

          {/* Save Proposal Button */}
          <button
            onClick={handleSaveProposal}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Print / Export PDF */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-[#D1A852] hover:bg-[#b8913e] text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>

          {/* Share Link */}
          <button
            onClick={copyClientLink}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Copy proposal link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-amber-200 border border-amber-400/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold no-print">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6-PAGE EDITORIAL PROPOSAL                                                */}
      {/* ========================================================================= */}
      <div className="py-10 px-2 sm:px-6 flex flex-col items-center print:p-0 print:m-0 print:bg-white">

        {/* --------------------------------------------------------------------- */}
        {/* PAGE 1: COVER (FULL-BLEED REAL <img> + SIGNATURE GLASS CARD)          */}
        {/* --------------------------------------------------------------------- */}
        <section
          id="page-1-cover"
          className="proposal-page relative w-full max-w-[850px] min-h-[1130px] rounded-sm overflow-hidden shadow-2xl flex flex-col justify-between p-10 sm:p-14 select-none mb-12 print:mb-0 print:shadow-none print:min-h-screen print:h-screen print:p-12 print:rounded-none bg-[#FAF8F5]"
        >
          {/* Real foreground <img> element: 100% UNTOUCHED ORIGINAL COLOR GRADING */}
          <img
            src={proposal.photos?.coverPhoto || "./images/parvathy_cloudinary_cover.jpg"}
            alt="Cover"
            className="cover-img-tag absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            style={{
              objectPosition: `${coverAlign.x}% ${coverAlign.y}%`,
              transform: `scale(${coverAlign.scale / 100})`,
              transformOrigin: `${coverAlign.x}% ${coverAlign.y}%`
            }}
          />

          {/* Photo Customization Controls (Upload + Alignment) */}
          <div className="absolute top-6 right-6 z-30 flex items-center gap-2 no-print">
            <button
              onClick={() => openAlignModalFor("coverAlign")}
              className="px-3.5 py-2 rounded-full bg-black/70 hover:bg-[#D1A852] hover:text-stone-950 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
              title="Adjust photo focal point & zoom"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Align Photo</span>
            </button>
            <button
              onClick={() => openPhotoPickerFor("coverPhoto")}
              className="px-3.5 py-2 rounded-full bg-black/70 hover:bg-[#D1A852] hover:text-stone-950 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Cover Photo</span>
            </button>
          </div>

          {/* Top Header Branding in elegant frosted glass pill */}
          <div className="relative z-20 flex items-start justify-between w-full">
            <div className="px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-lg">
              <span className="text-[10.5px] font-mono font-bold tracking-[0.35em] text-[#D1A852] uppercase block">
                F I N E &nbsp; A R T &nbsp; & &nbsp; C I N E M A T I C &nbsp; F I L M S
              </span>
              <h2 className="text-xl sm:text-2xl font-serif tracking-[0.25em] font-light text-white uppercase mt-0.5">
                DREAMWED STORIES
              </h2>
            </div>
            <div className="hidden sm:block">
              <span className="px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-mono tracking-widest uppercase shadow-lg inline-block">
                PROPOSAL NO: {proposal.proposalNo || proposal.id || "proposal_default"}
              </span>
            </div>
          </div>

          {/* Signature Elevated White Presented For Card */}
          <div className="relative z-20 w-full max-w-xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-7 sm:p-9 shadow-2xl border border-stone-200/80 text-center space-y-3">
              <span className="text-[10.5px] uppercase tracking-[0.3em] font-bold text-stone-500 font-mono block">
                P R E S E N T E D &nbsp; F O R
              </span>

              <div className="w-16 h-[1px] bg-[#B4975A]/50 mx-auto" />

              {editMode ? (
                <input
                  type="text"
                  value={proposal.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  className="w-full text-center text-3xl sm:text-4xl font-serif tracking-widest font-light uppercase text-stone-900 bg-amber-50/50 border-b-2 border-[#D1A852] outline-none"
                />
              ) : (
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-widest font-light uppercase text-stone-900 my-2 leading-none">
                  {proposal.clientName}
                </h1>
              )}

              <div className="w-16 h-[1px] bg-[#B4975A]/50 mx-auto" />

              {editMode ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1 text-xs font-mono text-stone-700">
                  <input
                    type="text"
                    value={proposal.eventDate}
                    onChange={(e) => updateField("eventDate", e.target.value)}
                    placeholder="Event Dates"
                    className="text-center bg-amber-50/50 border border-stone-300 rounded px-2 py-0.5 outline-none"
                  />
                  <span>•</span>
                  <input
                    type="text"
                    value={proposal.venue}
                    onChange={(e) => updateField("venue", e.target.value)}
                    placeholder="Venue / Location"
                    className="text-center bg-amber-50/50 border border-stone-300 rounded px-2 py-0.5 outline-none"
                  />
                </div>
              ) : (
                <p className="text-[11px] sm:text-xs font-mono tracking-widest uppercase text-stone-600 pt-1 font-medium">
                  {proposal.eventDate} • {proposal.venue}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------------- */}
        {/* PAGE 2: TESTIMONIALS (CLIENT LOVE 2x2 GRID)                          */}
        {/* --------------------------------------------------------------------- */}
        <section
          id="page-2-testimonials"
          className="proposal-page relative w-full max-w-[850px] min-h-[1130px] bg-[#FAF8F5] rounded-sm shadow-2xl flex flex-col justify-between p-10 sm:p-14 mb-12 print:mb-0 print:shadow-none print:min-h-screen print:h-screen print:p-12 print:rounded-none"
        >
          {/* Top Testimonials Header */}
          <div className="text-center space-y-2 pt-4">
            <span className="inline-block px-4 py-1 rounded-full border border-[#B4975A]/50 bg-[#B4975A]/10 text-[#8C6A23] text-[10px] tracking-[0.3em] uppercase font-bold font-mono">
              T E S T I M O N I A L S
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-light tracking-wide text-stone-900 mt-2">
              Client <span className="italic font-normal text-[#B4975A]">Love</span>
            </h2>
            <div className="w-12 h-[1px] bg-[#B4975A]/40 mx-auto mt-2" />
          </div>

          {/* 4 Review Cards (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 my-auto py-6">
            {(proposal.testimonials || [
              {
                initials: "DA",
                name: "Dr. Athulraj",
                event: "Wedding Photos",
                text: "The photos came out much better than expected, especially the low-light shots! You didn't miss a single moment of the wedding, and I don't think anyone else can provide such incredible quality in this budget. Thank you so much guys ❤️"
              },
              {
                initials: "C",
                name: "Chindu",
                event: "Cinematic Video",
                text: "What you did is one of the best I have seen so far. I've been searching for 7 months... the cinematic video you guys did is one of the best! All my friends and office colleagues are showering with praises."
              },
              {
                initials: "AL",
                name: "Anandha Lekshmi",
                event: "Wedding Ceremony",
                text: "Thank you so much to the whole team for the beautiful photo frame and for capturing our big day perfectly! ❤️❤️"
              },
              {
                initials: "DK",
                name: "Deepak Kollam",
                event: "Candid Portraits",
                text: "Superb work bro! We had a great experience with the team. I am someone who doesn't pose for photos at all, but you guys managed to capture such incredible shots and made me feel so comfortable."
              }
            ]).map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[22px] p-6 sm:p-7 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#D1A852]/60 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D1A852] text-[#D1A852]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-[13px] italic font-serif text-stone-700 leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-stone-200 text-[#8C6A23] font-serif text-xs font-bold flex items-center justify-center shrink-0">
                    {t.initials || (t.name ? t.name.charAt(0) : "C")}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-[13px] font-bold text-stone-900 leading-none">
                      {t.name}
                    </h5>
                    <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                      {t.event}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-4 text-center font-mono text-[10px] text-stone-400 tracking-widest">
            PAGE 2 OF 6 • DREAMWED STORIES
          </div>
        </section>

        {/* --------------------------------------------------------------------- */}
        {/* PAGE 3: PACKAGE INCLUDES (BANNER + PRE-WEDDING & WEDDING COLUMNS)    */}
        {/* --------------------------------------------------------------------- */}
        <section
          id="page-3-package"
          className="proposal-page relative w-full max-w-[850px] min-h-[1130px] bg-[#FAF8F5] rounded-sm shadow-2xl flex flex-col justify-between p-10 sm:p-14 mb-12 print:mb-0 print:shadow-none print:min-h-screen print:h-screen print:p-12 print:rounded-none"
        >
          {/* Panoramic Couple Banner Photo with Overlay Typography & Real Foreground <img> (ORIGINAL COLORS 100% PRESERVED) */}
          <div className="relative w-full h-72 sm:h-80 rounded-[24px] overflow-hidden shadow-lg group bg-stone-100">
            <img
              src={proposal.photos?.packageBannerPhoto || proposal.photos?.event1Photo || "./images/parvathy_cloudinary_package.jpg"}
              alt="Package Header"
              className="w-full h-full object-cover pointer-events-none"
              style={{
                objectPosition: `${bannerAlign.x}% ${bannerAlign.y}%`,
                transform: `scale(${bannerAlign.scale / 100})`,
                transformOrigin: `${bannerAlign.x}% ${bannerAlign.y}%`
              }}
            />
            {/* Subtle bottom-only gradient behind typography - couples faces and colors are 100% untouched */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

            {/* Banner Photo Controls */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2 no-print">
              <button
                onClick={() => openAlignModalFor("bannerAlign")}
                className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-[#D1A852] hover:text-stone-950 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 shadow-md cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Align Banner</span>
              </button>
              <button
                onClick={() => openPhotoPickerFor("packageBanner")}
                className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-[#D1A852] hover:text-stone-950 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 shadow-md cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Change Banner</span>
              </button>
            </div>

            <div className="absolute bottom-6 left-8 right-8 text-white drop-shadow-md">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase font-bold text-[#D1A852] block drop-shadow-sm">
                Curated Coverage Blueprint
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-light uppercase tracking-wider leading-none mt-1">
                PACKAGE <span className="italic text-[#D1A852] font-normal">INCLUDES</span>
              </h2>
            </div>
          </div>

          {/* Event Columns Header Actions in Edit Mode */}
          {editMode && (
            <div className="flex flex-wrap items-center justify-end gap-2 pt-4 no-print">
              <button
                onClick={addPreWeddingEvent}
                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[#8C6A23] border border-[#B4975A]/40 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pre-Wedding Event</span>
              </button>
              <button
                onClick={addCustomEvent}
                className="px-3 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event Column</span>
              </button>
            </div>
          )}

          {/* Clean Event Columns matching PDF Page 3 */}
          <div className="my-auto py-8">
            <div className={`grid grid-cols-1 ${
              (proposal.events || []).length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"
            } gap-8 sm:gap-10`}>
              {(proposal.events || []).map((ev, evIdx) => (
                <div key={evIdx} className="space-y-4 relative group/col">
                  {editMode && (
                    <button
                      onClick={() => removeEvent(evIdx)}
                      className="absolute -top-3 right-0 text-red-500 hover:text-red-700 p-1 text-xs font-bold flex items-center gap-1 no-print"
                      title="Delete event column"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}

                  <div className="border-b border-stone-200 pb-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => updateEventField(evIdx, "title", e.target.value)}
                        className="text-xs sm:text-sm tracking-[0.2em] font-bold uppercase font-serif text-stone-900 bg-amber-50/50 border border-stone-300 rounded px-2 py-0.5 w-full outline-none"
                      />
                    ) : (
                      <h3 className="text-xs sm:text-sm tracking-[0.2em] font-bold uppercase font-serif text-stone-900">
                        {ev.title}
                      </h3>
                    )}

                    {editMode ? (
                      <input
                        type="text"
                        value={ev.subhead || ev.date || ""}
                        onChange={(e) => updateEventField(evIdx, "subhead", e.target.value)}
                        placeholder="Event Date / Subtitle"
                        className="text-[11px] font-mono uppercase tracking-wider text-stone-500 bg-amber-50/50 border border-stone-300 rounded px-2 py-0.5 w-full mt-1 outline-none"
                      />
                    ) : (
                      <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mt-1">
                        {ev.subhead || ev.date || ev.eventTag || proposal.eventDate}
                      </p>
                    )}
                  </div>

                  {/* Crew Bullets */}
                  <ul className="space-y-2.5 pt-1">
                    {(ev.crew || []).map((cr, cIdx) => (
                      <li key={cIdx} className="flex items-center justify-between text-xs sm:text-[13px] font-light">
                        <div className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B4975A] shrink-0" />
                          {editMode ? (
                            <input
                              type="text"
                              value={cr}
                              onChange={(e) => updateCrewMember(evIdx, cIdx, e.target.value)}
                              className="text-xs font-mono uppercase tracking-wider text-stone-800 bg-amber-50/50 border border-stone-300 rounded px-1.5 py-0.5 outline-none"
                            />
                          ) : (
                            <span className="font-mono uppercase tracking-wider text-stone-800 font-medium">
                              {cr}
                            </span>
                          )}
                        </div>
                        {editMode && (
                          <button
                            onClick={() => removeCrewMember(evIdx, cIdx)}
                            className="text-red-400 hover:text-red-600 p-0.5 no-print"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>

                  {editMode && (
                    <button
                      onClick={() => addCrewMember(evIdx)}
                      className="text-[10px] text-[#B4975A] hover:underline font-mono uppercase font-bold flex items-center gap-1 pt-1 no-print"
                    >
                      <Plus className="w-3 h-3" /> Add Crew Member
                    </button>
                  )}

                  {ev.description && (
                    <p className="text-xs text-stone-600 leading-relaxed pt-2">
                      {ev.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 text-center font-mono text-[10px] text-stone-400 tracking-widest">
            PAGE 3 OF 6 • DREAMWED STORIES
          </div>
        </section>

        {/* --------------------------------------------------------------------- */}
        {/* PAGE 4: DELIVERABLES & INVESTMENT (TWO COLUMNS + GOLD VALUE CARD)    */}
        {/* --------------------------------------------------------------------- */}
        <section
          id="page-4-deliverables"
          className="proposal-page relative w-full max-w-[850px] min-h-[1130px] bg-[#FAF8F5] rounded-sm shadow-2xl flex flex-col justify-between p-10 sm:p-14 mb-12 print:mb-0 print:shadow-none print:min-h-screen print:h-screen print:p-12 print:rounded-none"
        >
          {/* Top Header */}
          <div className="space-y-1 pt-2">
            <span className="text-[10.5px] tracking-[0.35em] uppercase font-bold text-stone-400 block font-mono">
              D R E A M W E D &nbsp; S T O R I E S
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-stone-900 font-light">
              Deliverables & Investment
            </h2>
            <div className="w-14 h-0.5 bg-[#B4975A] mt-2" />
          </div>

          {/* Two-Column Deliverables List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 my-auto py-6">
            {/* Column 1: Physical & Digital Assets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-[11px] tracking-[0.2em] font-mono uppercase font-bold text-stone-500">
                  P H Y S I C A L &nbsp; & &nbsp; D I G I T A L &nbsp; A S S E T S
                </span>
                {editMode && (
                  <button
                    onClick={() => addDeliverableItem("albums")}
                    className="text-[10px] text-[#8C6A23] hover:underline font-bold flex items-center gap-0.5 no-print"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                )}
              </div>

              <ul className="space-y-3.5 text-xs sm:text-[13px] font-light">
                {(proposal.deliverables?.albums || []).map((alb, i) => {
                  const norm = normalizeItem(alb);
                  return (
                    <li key={`alb-${i}`} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        {editMode ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={norm.title}
                              onChange={(e) => updateDeliverableItem("albums", i, e.target.value)}
                              className="text-xs font-medium text-stone-800 bg-amber-50/50 border border-stone-300 rounded px-1.5 py-0.5 w-full outline-none"
                            />
                            <button
                              onClick={() => removeDeliverableItem("albums", i)}
                              className="text-red-400 hover:text-red-600 p-0.5 no-print"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium text-stone-800 leading-snug">{norm.title}</span>
                        )}
                        {norm.desc && <p className="text-[11px] text-stone-500 mt-0.5">{norm.desc}</p>}
                      </div>
                    </li>
                  );
                })}
                {(proposal.deliverables?.films || []).map((film, i) => {
                  const norm = normalizeItem(film);
                  return (
                    <li key={`film-${i}`} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        {editMode ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={norm.title}
                              onChange={(e) => updateDeliverableItem("films", i, e.target.value)}
                              className="text-xs font-medium text-stone-800 bg-amber-50/50 border border-stone-300 rounded px-1.5 py-0.5 w-full outline-none"
                            />
                            <button
                              onClick={() => removeDeliverableItem("films", i)}
                              className="text-red-400 hover:text-red-600 p-0.5 no-print"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium text-stone-800 leading-snug">{norm.title}</span>
                        )}
                        {norm.desc && <p className="text-[11px] text-stone-500 mt-0.5">{norm.desc}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 2: Complimentary Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-[11px] tracking-[0.2em] font-mono uppercase font-bold text-[#8C6A23]">
                  C O M P L I M E N T A R Y &nbsp; I T E M S
                </span>
                {editMode && (
                  <button
                    onClick={() => addDeliverableItem("complimentary")}
                    className="text-[10px] text-[#8C6A23] hover:underline font-bold flex items-center gap-0.5 no-print"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                )}
              </div>

              <ul className="space-y-3.5 text-xs sm:text-[13px] font-light">
                {(proposal.deliverables?.complimentary || []).map((comp, i) => {
                  const norm = normalizeItem(comp);
                  return (
                    <li key={`comp-${i}`} className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#D1A852] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        {editMode ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={norm.title}
                              onChange={(e) => updateDeliverableItem("complimentary", i, e.target.value)}
                              className="text-xs font-medium text-stone-800 bg-amber-50/50 border border-stone-300 rounded px-1.5 py-0.5 w-full outline-none"
                            />
                            <button
                              onClick={() => removeDeliverableItem("complimentary", i)}
                              className="text-red-400 hover:text-red-600 p-0.5 no-print"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium text-stone-800 leading-snug">{norm.title}</span>
                        )}
                        {norm.desc && <p className="text-[11px] text-stone-500 mt-0.5">{norm.desc}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Bottom Card: Investment Details Box */}
          <div className="rounded-[20px] border border-[#D1A852]/60 bg-amber-50/40 p-6 sm:p-7 shadow-xs space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-[10.5px] font-mono tracking-widest text-[#8C6A23] uppercase font-bold">
                  INVESTMENT DETAILS
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  Package price (excludes travel & accommodation)
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono tracking-wider uppercase text-stone-400 block">
                  TOTAL ESTIMATED VALUE
                </span>
                {editMode ? (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-2xl font-serif text-[#B4975A]">₹</span>
                    <input
                      type="text"
                      value={proposal.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      className="text-2xl sm:text-3xl font-serif font-bold text-[#B4975A] bg-white border border-stone-300 rounded px-2 py-0.5 w-36 outline-none"
                    />
                    <span className="text-xs font-mono text-stone-500">INR</span>
                  </div>
                ) : (
                  <p className="text-3xl sm:text-4xl font-serif text-[#B4975A] font-bold tracking-wide leading-none mt-1">
                    ₹{proposal.price} <span className="text-xs font-sans font-normal text-stone-500">INR</span>
                  </p>
                )}
              </div>
            </div>
            <p className="text-[10px] italic text-stone-500 pt-2 border-t border-[#D1A852]/20">
              * Note: Travel & accommodation charges for the crew are excluded and will be extra.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-4 text-center font-mono text-[10px] text-stone-400 tracking-widest">
            PAGE 4 OF 6 • DREAMWED STORIES
          </div>
        </section>

        {/* --------------------------------------------------------------------- */}
        {/* PAGE 5: OUR PHILOSOPHY (LETTER + B&W EDITORIAL PORTRAIT)              */}
        {/* --------------------------------------------------------------------- */}
        <section
          id="page-5-philosophy"
          className="proposal-page relative w-full max-w-[850px] min-h-[1130px] bg-[#FAF8F5] rounded-sm shadow-2xl flex flex-col justify-between p-10 sm:p-14 mb-12 print:mb-0 print:shadow-none print:min-h-screen print:h-screen print:p-12 print:rounded-none"
        >
          {/* Top Header */}
          <div className="space-y-2 pt-2">
            <span className="inline-block px-4 py-1 rounded-full border border-[#B4975A]/50 bg-[#B4975A]/10 text-[#8C6A23] text-[10px] tracking-[0.3em] uppercase font-bold font-mono">
              O U R &nbsp; P H I L O S O P H Y
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-wide text-stone-900">
              Capturing the Poetry of <span className="italic font-normal text-[#B4975A]">Your Love Story</span>
            </h2>
            <div className="w-12 h-[1px] bg-[#B4975A]/40 mt-2" />
          </div>

          {/* Two-Column Grid matching PDF Page 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center my-auto py-6">
            {/* Left Column: Personal Note */}
            <div className="sm:col-span-7 space-y-4 text-xs sm:text-sm font-light text-stone-700 leading-relaxed">
              <p className="font-serif font-semibold text-base text-[#8C6A23]">
                Dear {proposal.clientName},
              </p>
              <p>
                {proposal.directorNote?.p1 ||
                  "Your wedding day is not just a schedule of events; it is a tapestry of quiet glances, unchoreographed laughter, and raw emotions. At Dreamwed Stories, we dedicate our lenses to documenting your legacy with a mixture of fine-art photography and cinematic storytelling."}
              </p>
              <p>
                {proposal.directorNote?.p2 ||
                  "We believe in an unobtrusive approach. We blend into your celebrations, allowing you to live fully in the moment while we capture the fleeting details that standard photography often misses. This digital proposal outlines a tailored collection built specifically for your milestones."}
              </p>

              {/* Signature Block */}
              <div className="pt-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#B4975A]/15 text-[#8C6A23] font-serif text-sm font-bold flex items-center justify-center shrink-0 border border-[#B4975A]/30">
                  U
                </div>
                <div>
                  <p className="font-serif font-semibold text-xs text-stone-900 leading-none">
                    {proposal.directorNote?.sign || "Unni Krishnan & Team"}
                  </p>
                  <p className="text-stone-400 text-[10px] mt-1 font-mono">
                    {proposal.directorNote?.role || "Lead Photographer & Director, Dreamwed Stories"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Couple Portrait */}
            <div className="sm:col-span-5 relative rounded-[22px] overflow-hidden shadow-xl border border-stone-200 group bg-stone-100">
              <img
                src={proposal.photos?.philosophyPhoto || "./images/uploaded_couple_blackwhite.jpg"}
                alt="Philosophy"
                className="w-full h-80 sm:h-96 object-cover"
                style={{
                  objectPosition: `${philosophyAlign.x}% ${philosophyAlign.y}%`,
                  transform: `scale(${philosophyAlign.scale / 100})`,
                  transformOrigin: `${philosophyAlign.x}% ${philosophyAlign.y}%`
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

              {/* Philosophy Photo Controls */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 no-print">
                <button
                  onClick={() => openAlignModalFor("philosophyAlign")}
                  className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-[#D1A852] hover:text-stone-950 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <Sliders className="w-3 h-3 text-amber-400" />
                </button>
                <button
                  onClick={() => openPhotoPickerFor("philosophy")}
                  className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-[#D1A852] hover:text-stone-950 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Change</span>
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[9px] font-mono tracking-widest text-[#D1A852] uppercase block font-bold">
                  DW CAPTURE
                </span>
                <p className="font-serif italic text-xs text-stone-200 mt-0.5">
                  "Timeless, honest, fine-art"
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 text-center font-mono text-[10px] text-stone-400 tracking-widest">
            PAGE 5 OF 6 • DREAMWED STORIES
          </div>
        </section>

        {/* --------------------------------------------------------------------- */}
        {/* PAGE 6: LOCK IN YOUR DATE (SECURE BOOKING STEPS + WHATSAPP CONFIRM)   */}
        {/* --------------------------------------------------------------------- */}
        <section
          id="page-6-lock-date"
          className="proposal-page relative w-full max-w-[850px] min-h-[1130px] bg-[#FAF8F5] rounded-sm shadow-2xl flex flex-col justify-between p-10 sm:p-14 mb-12 print:mb-0 print:shadow-none print:min-h-screen print:h-screen print:p-12 print:rounded-none"
        >
          {/* Top Header */}
          <div className="text-center space-y-2 pt-4">
            <span className="inline-block px-4 py-1 rounded-full border border-stone-300 bg-white text-stone-600 text-[10px] tracking-[0.3em] uppercase font-bold font-mono">
              F I N A L &nbsp; S T E P
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-light tracking-wide text-stone-900 mt-2">
              Lock in <span className="italic font-normal text-[#B4975A]">Your Date</span>
            </h2>
            <p className="text-xs sm:text-sm font-light text-stone-600 max-w-md mx-auto mt-2">
              To approve this proposal, review the details and click the WhatsApp booking button below to lock your draft.
            </p>
          </div>

          {/* Secure Booking Steps Card */}
          <div className="bg-white rounded-[24px] border border-amber-200/80 p-7 sm:p-9 shadow-sm space-y-6 max-w-xl mx-auto my-auto w-full">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6A23] flex items-center gap-2 font-mono">
              <Lock className="w-3.5 h-3.5 text-[#B4975A]" />
              <span>SECURE BOOKING STEPS</span>
            </h4>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 text-[#8C6A23] flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-stone-900">Verify Configuration</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Ensure pricing, coverage staff, and deliverables are correct.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 text-[#8C6A23] flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-stone-900">Draft Advance Payment</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Transfer 10% booking advance to:{" "}
                    <strong className="text-[#8C6A23] font-mono">
                      {proposal.upiId || "dreamwedstories@okaxis"}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 text-[#8C6A23] flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-stone-900">Send WhatsApp Confirmation</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Click approval button to send booking parameters to our team.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary WhatsApp Action Button */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-[#D1A852] hover:bg-[#b8913e] text-stone-950 shadow-lg hover:scale-[1.01] active:scale-98 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Lock Date Via WhatsApp</span>
            </a>
          </div>

          {/* Guarantees Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-4 text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#B4975A]" />
              <span>Licensed Photography Team</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Star className="w-4 h-4 text-[#B4975A] fill-[#B4975A]" />
              <span>5-Star Rated Service</span>
            </span>
          </div>

          {/* Footer */}
          <div className="pt-4 text-center font-mono text-[10px] text-stone-400 tracking-widest">
            PAGE 6 OF 6 • DREAMWED STORIES
          </div>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* PHOTO PICKER MODAL (NO-PRINT)                                            */}
      {/* ========================================================================= */}
      {photoPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Choose or Upload Photo</span>
                </h3>
                <span className="text-[11px] text-stone-400 font-mono">
                  Slot: {activePhotoSlot}
                </span>
              </div>
              <button
                onClick={() => setPhotoPickerOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300 block mb-2 font-mono">
                  1. Upload from your Computer
                </span>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D1A852]/60 hover:border-[#D1A852] bg-stone-800/50 hover:bg-stone-800/80 rounded-2xl p-6 cursor-pointer transition-all group">
                  <Upload className="w-8 h-8 text-[#D1A852] group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-semibold text-white">Click to Browse Photo (JPG, PNG)</span>
                  <span className="text-[10px] text-stone-400 font-mono mt-1">Photo will immediately update in your proposal</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCustomUpload}
                  />
                </label>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-300 block mb-2 font-mono">
                  2. Or Pick from Dreamwed High-Res Library
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVAILABLE_STOCK_PHOTOS.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPhoto(img.url)}
                      className="group relative rounded-xl overflow-hidden border border-stone-700 hover:border-[#D1A852] transition-all aspect-video cursor-pointer text-left bg-stone-950"
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] text-white font-medium truncate block">
                          {img.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHOTO ALIGNMENT MODAL (NO-PRINT)                                         */}
      {/* ========================================================================= */}
      {alignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Photo Focal Alignment
                </h3>
              </div>
              <button
                onClick={() => setAlignModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Selection Tabs */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                Select Photo to Adjust:
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-stone-800/80 p-1 rounded-xl">
                <button
                  onClick={() => setActiveAlignSlot("coverAlign")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeAlignSlot === "coverAlign"
                      ? "bg-[#D1A852] text-stone-950 font-bold shadow-sm"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  Cover (P1)
                </button>
                <button
                  onClick={() => setActiveAlignSlot("bannerAlign")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeAlignSlot === "bannerAlign"
                      ? "bg-[#D1A852] text-stone-950 font-bold shadow-sm"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  Banner (P3)
                </button>
                <button
                  onClick={() => setActiveAlignSlot("philosophyAlign")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeAlignSlot === "philosophyAlign"
                      ? "bg-[#D1A852] text-stone-950 font-bold shadow-sm"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  Portrait (P5)
                </button>
              </div>
            </div>

            {/* Quick Position Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                Quick Focal Presets:
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setAlignPreset(activeAlignSlot, 50, 15)}
                  className="py-2 rounded-xl bg-stone-800 hover:bg-[#D1A852] hover:text-stone-950 text-stone-200 text-xs font-semibold transition-all"
                >
                  Top / Face
                </button>
                <button
                  onClick={() => setAlignPreset(activeAlignSlot, 50, 50)}
                  className="py-2 rounded-xl bg-stone-800 hover:bg-[#D1A852] hover:text-stone-950 text-stone-200 text-xs font-semibold transition-all"
                >
                  Center
                </button>
                <button
                  onClick={() => setAlignPreset(activeAlignSlot, 50, 85)}
                  className="py-2 rounded-xl bg-stone-800 hover:bg-[#D1A852] hover:text-stone-950 text-stone-200 text-xs font-semibold transition-all"
                >
                  Bottom
                </button>
                <button
                  onClick={() => {
                    setAlignPreset(activeAlignSlot, 50, 50);
                    updateAlignment(activeAlignSlot, "scale", 100);
                  }}
                  className="py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs font-semibold transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Fine Sliders */}
            <div className="space-y-4 pt-2">
              {/* Vertical Y */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-stone-300">Vertical Offset (Y):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {(proposal.photos?.[activeAlignSlot]?.y ?? 50)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={proposal.photos?.[activeAlignSlot]?.y ?? 50}
                  onChange={(e) => updateAlignment(activeAlignSlot, "y", e.target.value)}
                  className="w-full accent-[#D1A852] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-500">
                  <span>Top (0%)</span>
                  <span>Center (50%)</span>
                  <span>Bottom (100%)</span>
                </div>
              </div>

              {/* Horizontal X */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-stone-300">Horizontal Offset (X):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {(proposal.photos?.[activeAlignSlot]?.x ?? 50)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={proposal.photos?.[activeAlignSlot]?.x ?? 50}
                  onChange={(e) => updateAlignment(activeAlignSlot, "x", e.target.value)}
                  className="w-full accent-[#D1A852] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-500">
                  <span>Left (0%)</span>
                  <span>Center (50%)</span>
                  <span>Right (100%)</span>
                </div>
              </div>

              {/* Zoom Scale */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-stone-300">Zoom / Scale:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {(proposal.photos?.[activeAlignSlot]?.scale ?? 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="180"
                  value={proposal.photos?.[activeAlignSlot]?.scale ?? 100}
                  onChange={(e) => updateAlignment(activeAlignSlot, "scale", e.target.value)}
                  className="w-full accent-[#D1A852] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-500">
                  <span>Normal (100%)</span>
                  <span>Max Zoom (180%)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setAlignModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#D1A852] hover:bg-[#b8913e] text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Done Adjusting
            </button>
          </div>
        </div>
      )}

      {/* Saved Proposals Modal */}
      {savedProposalsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 no-print">
          <div className="bg-stone-900 border border-amber-400/30 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-light tracking-wide text-stone-100">
                  Saved <span className="italic text-[#D1A852]">Proposals Library</span>
                </h3>
              </div>
              <button
                onClick={() => setSavedProposalsModalOpen(false)}
                className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
              {savedProposalsList.length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-6">No saved proposals found yet.</p>
              ) : (
                savedProposalsList.map((p, i) => (
                  <div
                    key={p.id || i}
                    onClick={() => {
                      setProposal(p);
                      localStorage.setItem("active_vip_proposal", JSON.stringify(p));
                      setSavedProposalsModalOpen(false);
                      showToast(`✨ Loaded proposal for ${p.clientName}!`);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      proposal.id === p.id || proposal.clientName?.toLowerCase() === p.clientName?.toLowerCase()
                        ? "bg-[#D1A852]/20 border-amber-400/60 shadow-md"
                        : "bg-stone-800/60 border-stone-700/60 hover:bg-stone-800 hover:border-stone-600"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base font-medium text-white">
                          {p.clientName || "Unnamed Client"}
                        </h4>
                        {(p.id === "proposal_sreenidhi" || p.clientName?.toLowerCase().includes("sreenidhi")) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-mono">
                            Sreenidhi Oct 2026
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 font-mono">
                        {p.eventDate || "Date TBD"} • {p.venue || "Venue"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-amber-400 block font-mono">
                        ₹{p.price || "Custom"}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {p.events?.length || 0} Events
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSavedProposalsModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Close Library
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINT STYLESHEET: GUARANTEES EXACT A4 6-PAGE EXPORT                       */}
      {/* ========================================================================= */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            background-color: #FAF8F5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            filter: none !important;
            -webkit-filter: none !important;
          }
          .no-print {
            display: none !important;
          }
          .proposal-page {
            page-break-after: always !important;
            break-after: page !important;
            min-height: 297mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            width: 210mm !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            padding: 16mm 18mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            position: relative !important;
            overflow: hidden !important;
          }
          #page-1-cover {
            background-color: #FAF8F5 !important;
            padding: 16mm 18mm !important;
            position: relative !important;
          }
          #page-1-cover img.cover-img-tag {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            z-index: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            filter: none !important;
            -webkit-filter: none !important;
          }
        }
      `}</style>
    </div>
  );
}
