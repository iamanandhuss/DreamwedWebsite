import React, { useState, useEffect } from "react";
import {
  Upload, FileText, Sparkles, Share2, Eye, Edit2, CheckCircle,
  Camera, Video, Plane, Trash2, Plus, MessageCircle, ExternalLink,
  ChevronRight, RefreshCw, X, Image as ImageIcon, Bot, Check,
  Sliders, Calendar, MapPin, DollarSign
} from "lucide-react";
import {
  PARVATHY_SAMPLE_PROPOSAL,
  AVAILABLE_STOCK_PHOTOS,
  parseProposalWithAI
} from "../../utils/pdfProposalParser";

export default function AdminVipProposals() {
  const [proposalsList, setProposalsList] = useState([]);
  const [activeProposal, setActiveProposal] = useState(PARVATHY_SAMPLE_PROPOSAL);
  const [isParsing, setIsParsing] = useState(false);
  const [aiStatusStep, setAiStatusStep] = useState("");
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [activePhotoSlot, setActivePhotoSlot] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Load proposals from localStorage on mount
  useEffect(() => {
    try {
      const savedList = JSON.parse(
        (localStorage.getItem("dreamwed_vip_proposals_list") || "[]").replace(/"\/images\//g, '"./images/').replace(/"\/videos\//g, '"./videos/')
      );
      if (savedList.length === 0) {
        const initialList = [PARVATHY_SAMPLE_PROPOSAL];
        localStorage.setItem("dreamwed_vip_proposals_list", JSON.stringify(initialList));
        localStorage.setItem("active_vip_proposal", JSON.stringify(PARVATHY_SAMPLE_PROPOSAL));
        setProposalsList(initialList);
        setActiveProposal(PARVATHY_SAMPLE_PROPOSAL);
      } else {
        setProposalsList(savedList);
        const activeSaved = localStorage.getItem("active_vip_proposal");
        if (activeSaved) {
          setActiveProposal(JSON.parse(activeSaved));
        } else {
          setActiveProposal(savedList[0]);
        }
      }
    } catch (e) {
      console.error("Error loading proposals from localStorage", e);
      setProposalsList([PARVATHY_SAMPLE_PROPOSAL]);
      setActiveProposal(PARVATHY_SAMPLE_PROPOSAL);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processPdfWithAi(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith(".pdf")) {
        await processPdfWithAi(file);
      } else {
        alert("Please upload a valid .pdf proposal document!");
      }
    }
  };

  const processPdfWithAi = async (file) => {
    setIsParsing(true);
    setAiStatusStep("Extracting text from PDF pages...");
    try {
      setTimeout(() => {
        setAiStatusStep("🤖 Gemini 2.5 Flash AI reading and understanding event structure, crew, deliverables & rates...");
      }, 700);

      const parsed = await parseProposalWithAI(file, file.name);

      setAiStatusStep("✨ Generating interactive luxury proposal...");
      await new Promise((r) => setTimeout(r, 600));

      setActiveProposal(parsed);
      localStorage.setItem("active_vip_proposal", JSON.stringify(parsed));

      const updatedList = [parsed, ...proposalsList.filter((p) => p.id !== parsed.id)];
      setProposalsList(updatedList);
      localStorage.setItem("dreamwed_vip_proposals_list", JSON.stringify(updatedList));

      showToast("🎉 AI successfully parsed and created proposal for " + parsed.clientName + "!");
    } catch (err) {
      console.error(err);
      alert("Error reading PDF with AI: " + err.message);
    } finally {
      setIsParsing(false);
      setAiStatusStep("");
    }
  };

  const handleSelectProposal = (item) => {
    setActiveProposal(item);
    localStorage.setItem("active_vip_proposal", JSON.stringify(item));
    showToast("Switched active proposal to: " + item.clientName);
  };

  const handleDeleteProposal = (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this proposal?")) {
      const updatedList = proposalsList.filter((p) => p.id !== id);
      setProposalsList(updatedList);
      localStorage.setItem("dreamwed_vip_proposals_list", JSON.stringify(updatedList));
      if (activeProposal.id === id && updatedList.length > 0) {
        setActiveProposal(updatedList[0]);
        localStorage.setItem("active_vip_proposal", JSON.stringify(updatedList[0]));
      }
      showToast("Proposal deleted.");
    }
  };

  const copyClientLink = (proposalId) => {
    const pId = proposalId || activeProposal.id;
    const url = window.location.origin + "/proposal?id=" + pId;
    navigator.clipboard.writeText(url);
    showToast("📋 Client Proposal link copied to clipboard!");
  };

  const openPhotoPickerFor = (slotKey) => {
    setActivePhotoSlot(slotKey);
    setPhotoPickerOpen(true);
  };

  const handleSelectPhoto = (photoUrl) => {
    if (!activePhotoSlot) return;

    const updated = { ...activeProposal };
    const photos = { ...updated.photos };

    if (activePhotoSlot.startsWith("cover-")) {
      const idx = parseInt(activePhotoSlot.replace("cover-", ""), 10);
      const newSlideshow = [...photos.coverSlideshow];
      newSlideshow[idx] = photoUrl;
      photos.coverSlideshow = newSlideshow;
    } else if (activePhotoSlot.startsWith("event-")) {
      photos[activePhotoSlot] = photoUrl;
    } else if (activePhotoSlot === "event1") {
      photos.event1Photo = photoUrl;
    } else if (activePhotoSlot === "event2") {
      photos.event2Photo = photoUrl;
    } else if (activePhotoSlot.startsWith("gallery-")) {
      const gKey = "gallery" + (parseInt(activePhotoSlot.replace("gallery-", ""), 10) + 1);
      photos[gKey] = photoUrl;
    }

    updated.photos = photos;
    setActiveProposal(updated);
    localStorage.setItem("active_vip_proposal", JSON.stringify(updated));

    const updatedList = proposalsList.map((p) => (p.id === updated.id ? updated : p));
    setProposalsList(updatedList);
    localStorage.setItem("dreamwed_vip_proposals_list", JSON.stringify(updatedList));

    setPhotoPickerOpen(false);
    showToast("🖼️ Photo updated for proposal!");
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

  const handleEventChange = (evIdx, field, value) => {
    const newEvents = [...activeProposal.events];
    newEvents[evIdx] = { ...newEvents[evIdx], [field]: value };
    handleFieldChange("events", newEvents);
  };
  const handleCrewChange = (evIdx, crewIdx, value) => {
    const newEvents = [...activeProposal.events];
    const newCrew = [...newEvents[evIdx].crew];
    newCrew[crewIdx] = value;
    newEvents[evIdx] = { ...newEvents[evIdx], crew: newCrew };
    handleFieldChange("events", newEvents);
  };
  const addCrewMember = (evIdx) => {
    const newEvents = [...activeProposal.events];
    newEvents[evIdx].crew = [...(newEvents[evIdx].crew || []), "1 New Crew Member"];
    handleFieldChange("events", newEvents);
  };
  const removeCrewMember = (evIdx, crewIdx) => {
    const newEvents = [...activeProposal.events];
    newEvents[evIdx].crew.splice(crewIdx, 1);
    handleFieldChange("events", newEvents);
  };

  const handleDeliverableChange = (category, idx, value) => {
    const newDelivs = { ...activeProposal.deliverables };
    const newArray = [...newDelivs[category]];
    newArray[idx] = { ...newArray[idx], desc: value };
    newDelivs[category] = newArray;
    handleFieldChange("deliverables", newDelivs);
  };
  const addDeliverable = (category) => {
    const newDelivs = { ...activeProposal.deliverables };
    newDelivs[category] = [...(newDelivs[category] || []), { desc: "New Item" }];
    handleFieldChange("deliverables", newDelivs);
  };
  const removeDeliverable = (category, idx) => {
    const newDelivs = { ...activeProposal.deliverables };
    newDelivs[category].splice(idx, 1);
    handleFieldChange("deliverables", newDelivs);
  };

  const handleFieldChange = (field, value) => {
    const updated = { ...activeProposal, [field]: value };
    setActiveProposal(updated);
    localStorage.setItem("active_vip_proposal", JSON.stringify(updated));
    const updatedList = proposalsList.map((p) => (p.id === updated.id ? updated : p));
    setProposalsList(updatedList);
    localStorage.setItem("dreamwed_vip_proposals_list", JSON.stringify(updatedList));
  };

  return (
    <div className="space-y-6 text-left office-theme-container bg-[#0b0f19] p-6 sm:p-8 rounded-[32px] border border-zinc-800/40">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0e2d3e] border border-sky-400/40 text-sky-200 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce-slow">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/40 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
              <Bot className="w-3 h-3 text-sky-400" />
              <span>AI PROPOSAL ENGINE</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ⚡ GEMINI 2.5 FLASH
            </span>
            <span className="text-zinc-500 text-xs font-mono">• Automated Client Proposal Generator</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light mt-1">
            VIP Client <span className="italic font-serif text-[#d4af37]">Proposal Studio</span>
          </h2>
          <p className="text-zinc-400 text-xs font-light mt-1">
            Upload any Dreamwed proposal PDF (e.g. Wedding_Proposal_PARVATHY.pdf) — our AI analyzes every page, understands the events, crew & package specs, and creates an online proposal to impress your client.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={"/proposal?id=" + activeProposal.id}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Open Online Proposal</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>

          <button
            onClick={() => copyClientLink()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Copy WhatsApp Link</span>
          </button>
        </div>
      </div>

      {/* PDF Drag & Drop AI Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative rounded-2xl border-2 border-dashed border-sky-500/30 hover:border-sky-400/60 bg-gradient-to-b from-[#081824]/60 to-[#050e17]/80 p-6 sm:p-8 text-center transition-all group cursor-pointer"
      >
        <input
          type="file"
          accept=".pdf"
          id="admin-pdf-upload"
          className="hidden"
          onChange={handlePdfUpload}
        />
        <label htmlFor="admin-pdf-upload" className="cursor-pointer block space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
            {isParsing ? (
              <RefreshCw className="w-7 h-7 animate-spin text-amber-300" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>

          <div>
            <h4 className="text-white text-sm sm:text-base font-bold">
              {isParsing
                ? aiStatusStep || "AI Reading & Understanding Proposal Document..."
                : "Drag & Drop Any Proposal PDF Here (or Click to Browse)"}
            </h4>
            <p className="text-zinc-400 text-xs mt-1">
              Supports <code className="text-sky-300">Wedding_Proposal_PARVATHY.pdf</code> or any custom wedding booking quote.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-[11px] text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Powered by Gemini 2.5 Flash: Understands event schedules, multicam crew, albums & rates</span>
          </div>
        </label>
      </div>

      {/* Active Proposal Details & Photos Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Proposal Details & Photo Customizer */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                  Active Proposal: {activeProposal.clientName}
                </h3>
                {activeProposal.isAiGenerated && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Bot className="w-2.5 h-2.5" />
                    <span>AI Parsed</span>
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-zinc-500">ID: {activeProposal.id}</span>
            </div>

            {/* Quick Editable Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase font-bold text-zinc-400 block mb-1 flex items-center gap-1">
                  <span>Client / Couple Name</span>
                </label>
                <input
                  type="text"
                  value={activeProposal.clientName}
                  onChange={(e) => handleFieldChange("clientName", e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs font-bold focus:border-sky-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-zinc-400 block mb-1">
                  Event Date
                </label>
                <input
                  type="text"
                  value={activeProposal.eventDate}
                  onChange={(e) => handleFieldChange("eventDate", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs font-bold focus:border-sky-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1.5">
                  Venue / Location
                </label>
                <textarea
                  value={activeProposal.venue}
                  onChange={(e) => handleFieldChange("venue", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-sky-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-zinc-400 block mb-1">
                  Package Investment (INR)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={activeProposal.price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    placeholder="1,45,000"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-emerald-400 text-xs font-bold focus:border-emerald-400 outline-none"
                  />
                  <span className="text-zinc-400 text-xs font-bold">INR</span>
                </div>
              </div>
            </div>

            {/* AI Detected Events Summary (EDITABLE) */}
            {activeProposal.events && activeProposal.events.length > 0 && (
              <div className="border-t border-zinc-800/80 pt-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Edit Events & Package Includes ({activeProposal.events.length} Events)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProposal.events.map((ev, evIdx) => (
                    <div key={evIdx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <input 
                        type="text" 
                        value={ev.title || ""} 
                        onChange={(e) => handleEventChange(evIdx, "title", e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-sky-400 text-xs font-bold text-white outline-none pb-1"
                        placeholder="Event Title (e.g. WEDDING COVERAGE)"
                      />
                      <input 
                        type="text" 
                        value={ev.eventTag || ev.date || ""} 
                        onChange={(e) => handleEventChange(evIdx, "eventTag", e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-sky-400 text-[10px] font-mono text-sky-400 outline-none pb-1"
                        placeholder="Date / Subtitle"
                      />
                      <div className="space-y-1.5 pt-1">
                        {ev.crew && ev.crew.map((c, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#b4975a] shrink-0" />
                            <input 
                              type="text" 
                              value={c} 
                              onChange={(e) => handleCrewChange(evIdx, cIdx, e.target.value)}
                              className="flex-1 bg-transparent border-b border-transparent focus:border-zinc-700 hover:border-zinc-800 text-[10px] text-zinc-300 outline-none"
                            />
                            <button onClick={() => removeCrewMember(evIdx, cIdx)} className="text-zinc-600 hover:text-red-400 p-0.5"><Trash2 size={10} /></button>
                          </div>
                        ))}
                        <button onClick={() => addCrewMember(evIdx)} className="text-[9px] text-sky-500 hover:text-sky-400 flex items-center gap-1 mt-1 font-bold">
                          <Plus size={10} /> Add Crew Member
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editable Deliverables */}
            {activeProposal.deliverables && (
              <div className="border-t border-zinc-800/80 pt-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Edit Deliverables (Physical, Digital & Complimentary)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['albums', 'films', 'complimentary'].map(category => (
                    <div key={category} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] uppercase font-bold text-sky-400 block mb-2">{category.toUpperCase()}</span>
                      <div className="space-y-1.5">
                        {(activeProposal.deliverables[category] || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <input 
                              type="text" 
                              value={item.desc || item} 
                              onChange={(e) => handleDeliverableChange(category, idx, e.target.value)}
                              className="flex-1 bg-transparent border-b border-zinc-800 focus:border-zinc-500 text-[10px] text-zinc-300 outline-none"
                            />
                            <button onClick={() => removeDeliverable(category, idx)} className="text-zinc-600 hover:text-red-400"><Trash2 size={10} /></button>
                          </div>
                        ))}
                        <button onClick={() => addDeliverable(category)} className="text-[9px] text-sky-500 hover:text-sky-400 flex items-center gap-1 mt-1 font-bold">
                          <Plus size={10} /> Add Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Customizer Grid */}
            <div className="border-t border-zinc-800/80 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Proposal Photos (Choose photos for each page)
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Click "Change" on any image slot to swap with stock photos or upload a file.
                  </p>
                </div>
              </div>

              {/* Cover 3D Carousel Photos */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                  1. Cover Page 3D Carousel (7 Photos)
                </span>
                <div className="grid grid-cols-7 gap-1.5">
                  {activeProposal.photos.coverSlideshow.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => openPhotoPickerFor("cover-" + idx)}
                      className="aspect-square rounded-lg overflow-hidden border border-zinc-700 relative group cursor-pointer hover:border-sky-400 bg-zinc-950"
                    >
                      <img src={imgUrl} alt={"Cover " + (idx + 1)} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold transition-opacity">
                        Change
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event 1 & Event 2 Coverage Photos */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
                    2. Pre-Wedding Shoot Photo
                  </span>
                  <div
                    onClick={() => openPhotoPickerFor("event1")}
                    className="h-24 rounded-xl overflow-hidden border border-zinc-700 relative group cursor-pointer hover:border-sky-400 bg-zinc-950"
                  >
                    <img
                      src={activeProposal.photos.event1Photo}
                      alt="Event 1"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-bold transition-opacity">
                      Change Pre-Wed Photo
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
                    3. Wedding & Reception Photo
                  </span>
                  <div
                    onClick={() => openPhotoPickerFor("event2")}
                    className="h-24 rounded-xl overflow-hidden border border-zinc-700 relative group cursor-pointer hover:border-sky-400 bg-zinc-950"
                  >
                    <img
                      src={activeProposal.photos.event2Photo}
                      alt="Event 2"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-bold transition-opacity">
                      Change Wedding Photo
                    </div>
                  </div>
                </div>
              </div>

              {/* Showcase Photos */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
                  4. Photographic Showcase (3 Real Moments)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[activeProposal.photos.gallery1, activeProposal.photos.gallery2, activeProposal.photos.gallery3].map(
                    (gUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => openPhotoPickerFor("gallery-" + idx)}
                        className="h-20 rounded-xl overflow-hidden border border-zinc-700 relative group cursor-pointer hover:border-sky-400 bg-zinc-950"
                      >
                        <img src={gUrl} alt={"Gallery " + (idx + 1)} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-bold transition-opacity">
                          Change
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Share Bar */}
            <div className="border-t border-zinc-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={
                  "https://wa.me/91" +
                  activeProposal.phone +
                  "?text=" +
                  encodeURIComponent(
                    "Dear " +
                      activeProposal.clientName +
                      ", Dreamwed Stories is delighted to present your personalized digital wedding photography proposal! View your interactive online proposal here: " +
                      window.location.origin +
                      "/proposal?id=" +
                      activeProposal.id
                  )
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send to Client on WhatsApp</span>
              </a>

              <a
                href={"/proposal?id=" + activeProposal.id}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Live Client View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Col: Saved Proposals Archive */}
        <div className="space-y-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider">
                Saved Proposals ({proposalsList.length})
              </h3>
              <label
                htmlFor="admin-pdf-upload-side"
                className="px-2 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-sky-500/30"
              >
                <Plus className="w-3 h-3" />
                <span>Add PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  id="admin-pdf-upload-side"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
              </label>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {proposalsList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectProposal(item)}
                  className={"p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between " + (
                    activeProposal.id === item.id
                      ? "bg-sky-950/40 border-sky-500/50 shadow-md"
                      : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate block">
                        {item.clientName}
                      </span>
                      {activeProposal.id === item.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      )}
                      {item.isAiGenerated && (
                        <span className="text-[8px] font-bold text-amber-300 bg-amber-950/60 px-1 rounded">AI</span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">
                      {item.eventDate} • {item.venue}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 block">
                      ₹ {item.price} INR
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyClientLink(item.id);
                      }}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="Copy Client Link"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                    <a
                      href={"/proposal?id=" + item.id}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-sky-900/40 hover:bg-sky-900/60 text-sky-300 transition-colors"
                      title="Open Proposal"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {proposalsList.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteProposal(item.id, e)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Photo Picker Modal */}
      {photoPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c2231] border border-sky-500/30 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Select Photo for Slot
                </h3>
                <span className="text-[11px] text-sky-300">
                  Pick from stock photos or upload a file
                </span>
              </div>
              <button
                onClick={() => setPhotoPickerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {AVAILABLE_STOCK_PHOTOS.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPhoto(p.url)}
                  className="rounded-xl overflow-hidden aspect-square border border-sky-500/20 cursor-pointer hover:border-sky-400 hover:scale-105 transition-all relative group bg-slate-900"
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 text-center text-[10px] text-white font-medium transition-opacity">
                    {p.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sky-500/20 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Or upload custom photo:</span>
              <label className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium cursor-pointer">
                <span>Upload File</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleCustomUpload} />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
