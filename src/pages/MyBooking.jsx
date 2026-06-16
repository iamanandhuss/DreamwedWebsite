import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, Calendar, MapPin, Search, Download, CheckCircle, 
  Clock, AlertCircle, X, Printer, Mail, Gift 
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import SEO from "../components/SEO";

const isSingleSidePackage = (pName) => {
  if (!pName) return false;
  const name = pName.toLowerCase();
  if (name.includes("dual") || name.includes("both") || name.includes("bride & groom") || name.includes("elite") || name.includes("signature") || name.includes("couture")) {
    return false;
  }
  return name.includes("single") || 
         name.includes("classic") || 
         name.includes("heritage") || 
         name.includes("essential") || 
         name.includes("standalone") || 
         name.includes("promo") || 
         name.includes("photography");
};

const MyBooking = () => {
  const [activeMode, setActiveMode] = useState("lookup");
  const [bookingRole, setBookingRole] = useState("both"); // bride, groom, both
  const [phoneQuery, setPhoneQuery] = useState("");
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error, not_found
  const [errorMessage, setErrorMessage] = useState("");
  const [isInvoicePrintOpen, setIsInvoicePrintOpen] = useState(false);

  // Signup form states
  const [groomName, setGroomName] = useState("");
  const [groomPhone, setGroomPhone] = useState("");
  const [groomEmail, setGroomEmail] = useState("");
  const [groomAddress, setGroomAddress] = useState("");

  const [brideName, setBrideName] = useState("");
  const [bridePhone, setBridePhone] = useState("");
  const [brideEmail, setBrideEmail] = useState("");
  const [brideAddress, setBrideAddress] = useState("");

  // Wedding Date & Venue Selection details
  const [weddingReceptionMode, setWeddingReceptionMode] = useState("same"); // same, different
  const [eventDate, setEventDate] = useState(""); // Same date: date
  const [eventVenue, setEventVenue] = useState(""); // Same date: wedding venue
  const [receptionVenue, setReceptionVenue] = useState(""); // Same date: reception venue
  const [weddingTime, setWeddingTime] = useState(""); // Same date: wedding time
  const [receptionTime, setReceptionTime] = useState(""); // Same date: reception time

  // Different dates states
  const [weddingDateDiff, setWeddingDateDiff] = useState("");
  const [weddingTimeDiff, setWeddingTimeDiff] = useState("");
  const [weddingVenueDiff, setWeddingVenueDiff] = useState("");
  const [receptionDateDiff, setReceptionDateDiff] = useState("");
  const [receptionTimeDiff, setReceptionTimeDiff] = useState("");
  const [receptionVenueDiff, setReceptionVenueDiff] = useState("");

  // Additional details states
  const [needDrone, setNeedDrone] = useState("no"); // yes, no
  const [needCinematic, setNeedCinematic] = useState("no"); // yes, no
  const [preferredAlbumSize, setPreferredAlbumSize] = useState("12x18");
  const [specialNotes, setSpecialNotes] = useState("");

  // Package & Price selection
  const [selectedPackage, setSelectedPackage] = useState("Elite Signature Package");
  const [packagePrice, setPackagePrice] = useState(180000);
  const minAdvance = 5000;
  
  // Payment States
  const [advancePaid, setAdvancePaid] = useState(5000);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [transactionId, setTransactionId] = useState("");

  // Uploaded Files (Invitations & Screenshot)
  const [invitationFileName, setInvitationFileName] = useState("");
  const [invitationFileData, setInvitationFileData] = useState("");
  const [screenshotFileName, setScreenshotFileName] = useState("");
  const [screenshotFileData, setScreenshotFileData] = useState("");

  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const INITIAL_BOOKINGS = [
    {
      id: 3,
      customer_name: "Adarsh & Anjali",
      customer_phone: "9042544997",
      customer_email: "adarsh.anjali@gmail.com",
      event_date: "2026-12-18",
      event_venue: "Taj Green Cove, Kovalam",
      package_name: "Elite Signature Package",
      package_price: 180000,
      add_ons: ["Pre-wedding Cinematic Video (Offer Price - 9999/-)", "Drone Coverage Upgrade"],
      total_price: 189999,
      advance_paid: 50000,
      balance_amount: 139999,
      invoice_number: "DW-2026-003",
      invoice_date: "2026-05-28",
      status: "confirmed",
      payment_milestones: [
        { label: "Advance - Wedding Photography (Elite Signature Package)", amount: 50000, date: "2026-05-28", status: "Paid" },
        { label: "Second Payment (Event Day)", amount: 0, date: "2026-12-18", status: "Pending" },
        { label: "Final Payment (Before Delivery)", amount: 139999, date: "", status: "Pending" }
      ],
      created_at: "2026-05-28 18:26:08",
      updated_at: "2026-05-28 18:26:08"
    },
    {
      id: 4,
      customer_name: "Rahul & Sneha",
      customer_phone: "9895412895",
      customer_email: "rahul.sneha@gmail.com",
      event_date: "2026-11-20",
      event_venue: "The Leela Raviz, Kovalam",
      package_name: "Elite Signature Package",
      package_price: 180000,
      add_ons: ["Pre-wedding Cinematic Video (Offer Price - 9999/-)", "Drone Coverage Upgrade"],
      total_price: 189999,
      advance_paid: 50000,
      balance_amount: 139999,
      invoice_number: "DW-2026-004",
      invoice_date: "2026-05-28",
      status: "confirmed",
      payment_milestones: [
        { label: "Advance - Wedding Photography (Elite Signature Package)", amount: 50000, date: "2026-05-28", status: "Paid" },
        { label: "Second Payment (Event Day)", amount: 0, date: "2026-11-20", status: "Pending" },
        { label: "Final Payment (Before Delivery)", amount: 139999, date: "", status: "Pending" }
      ],
      created_at: "2026-05-28 18:26:08",
      updated_at: "2026-05-28 18:26:08"
    }
  ];

  useEffect(() => {
    if (!localStorage.getItem("dreamwed_bookings")) {
      localStorage.setItem("dreamwed_bookings", JSON.stringify(INITIAL_BOOKINGS));
    }
    
    // Parse package parameters from URL
    const params = new URLSearchParams(window.location.search);
    const pkg = params.get("package");
    const prc = params.get("price");
    if (pkg) {
      const decodedPkg = decodeURIComponent(pkg);
      setSelectedPackage(decodedPkg);
      setActiveMode("signup");
      
      // Attempt to set matching price or use parameter price
      if (prc) {
        setPackagePrice(Number(prc));
      } else {
        if (decodedPkg.toLowerCase().includes("signature") || decodedPkg.toLowerCase().includes("candid")) {
          setPackagePrice(180000);
        } else if (decodedPkg.toLowerCase().includes("couture") || decodedPkg.toLowerCase().includes("photo & pre")) {
          setPackagePrice(135000);
        } else {
          setPackagePrice(95000);
        }
      }
    }
  }, []);

  const handlePackageChange = (pName) => {
    setSelectedPackage(pName);
    if (pName === "Elite Signature Package" || pName.toLowerCase().includes("signature")) setPackagePrice(180000);
    else if (pName === "Premium Couture Package" || pName.toLowerCase().includes("couture") || pName.toLowerCase().includes("pre-wedding")) setPackagePrice(135000);
    else setPackagePrice(95000);
  };

  const handleInvitationChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setInvitationFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setInvitationFileData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotFileData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    const isSingleSide = isSingleSidePackage(selectedPackage);
    
    if (isSingleSide) {
      if (bookingRole === "bride") {
        if (!brideName.trim() || !bridePhone.trim()) {
          alert("Bride name and phone number are required.");
          return;
        }
      } else if (bookingRole === "groom") {
        if (!groomName.trim() || !groomPhone.trim()) {
          alert("Groom name and phone number are required.");
          return;
        }
      } else {
        if (!groomName.trim() || !groomPhone.trim() || !brideName.trim() || !bridePhone.trim()) {
          alert("Bride & Groom names and phone numbers are required.");
          return;
        }
      }
    } else {
      if (!groomName.trim() || !groomPhone.trim() || !brideName.trim() || !bridePhone.trim()) {
        alert("Bride & Groom names and phone numbers are required.");
        return;
      }
    }

    if (weddingReceptionMode === "same" && (!eventDate || !eventVenue.trim())) {
      alert("Wedding Date and Wedding Venue are required.");
      return;
    }

    if (weddingReceptionMode === "different" && (!weddingDateDiff || !weddingVenueDiff.trim())) {
      alert("Wedding Date and Wedding Venue are required.");
      return;
    }

    if (Number(advancePaid) < minAdvance) {
      alert(`Minimum advance payment is ₹${minAdvance.toLocaleString("en-IN")}.`);
      return;
    }

    const eventDateFinal = weddingReceptionMode === "same" ? eventDate : weddingDateDiff;
    const eventVenueFinal = weddingReceptionMode === "same" ? eventVenue.trim() : weddingVenueDiff.trim();

    const addOns = [];
    if (needDrone === "yes") addOns.push("Drone Coverage Upgrade");
    if (needCinematic === "yes") addOns.push("Cinematic Video Upgrade");

    let customerNameFinal = "";
    let customerPhoneFinal = "";
    let customerEmailFinal = "";
    let customerAddressFinal = "";
    
    let customerName2Final = "";
    let customerPhone2Final = "";
    let customerEmail2Final = "";
    let customerAddress2Final = "";

    if (isSingleSide && bookingRole === "bride") {
      customerNameFinal = brideName.trim();
      customerPhoneFinal = bridePhone.trim();
      customerEmailFinal = brideEmail.trim();
      customerAddressFinal = brideAddress.trim();
    } else if (isSingleSide && bookingRole === "groom") {
      customerNameFinal = groomName.trim();
      customerPhoneFinal = groomPhone.trim();
      customerEmailFinal = groomEmail.trim();
      customerAddressFinal = groomAddress.trim();
    } else {
      customerNameFinal = `${groomName.trim()} & ${brideName.trim()}`;
      customerPhoneFinal = groomPhone.trim();
      customerEmailFinal = groomEmail.trim();
      customerAddressFinal = groomAddress.trim();
      
      customerName2Final = brideName.trim();
      customerPhone2Final = bridePhone.trim();
      customerEmail2Final = brideEmail.trim();
      customerAddress2Final = brideAddress.trim();
    }

    const payload = {
      customer_name: customerNameFinal,
      customer_phone: customerPhoneFinal,
      customer_email: customerEmailFinal,
      customer_address: customerAddressFinal,
      customer_name_2: customerName2Final,
      customer_phone_2: customerPhone2Final,
      customer_email_2: customerEmail2Final,
      customer_address_2: customerAddress2Final,
      
      coverage_type: "both",
      wedding_reception_mode: weddingReceptionMode,
      event_date: eventDateFinal,
      event_venue: eventVenueFinal,
      reception_venue: weddingReceptionMode === "same" ? receptionVenue.trim() : receptionVenueDiff.trim(),
      
      same_date_details: weddingReceptionMode === "same" ? {
        wedding_venue: eventVenue.trim(),
        reception_venue: receptionVenue.trim(),
        wedding_time: weddingTime,
        reception_time: receptionTime
      } : null,
      
      different_date_details: weddingReceptionMode === "different" ? {
        wedding: { date: weddingDateDiff, time: weddingTimeDiff, venue: weddingVenueDiff },
        reception: { date: receptionDateDiff, time: receptionTimeDiff, venue: receptionVenueDiff }
      } : null,
      
      need_drone: needDrone,
      need_cinematic: needCinematic,
      preferred_album_size: preferredAlbumSize,
      special_notes: specialNotes.trim(),
      add_ons: addOns,

      invitation_file_name: invitationFileName,
      invitation_file_data: invitationFileData,

      package_name: selectedPackage,
      package_price: packagePrice,
      total_price: packagePrice,
      advance_paid: Number(advancePaid) || 0,
      payment_method: paymentMethod,
      transaction_id: transactionId.trim(),
      screenshot_file_name: screenshotFileName,
      screenshot_file_data: screenshotFileData,
      status: "pending"
    };
    
    setSigningUp(true);
    setSignupSuccess(false);
    
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newBooking = await res.json();
        
        // Save locally
        const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
        localStorage.setItem("dreamwed_bookings", JSON.stringify([newBooking, ...localBookings]));
        setSignupSuccess(true);
        alert("✅ Wedding booking request submitted! Awaiting Admin Approval.");
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      console.error("Signup error, falling back locally:", err);
      
      const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
      const id = localBookings.length > 0 ? Math.max(...localBookings.map(b => b.id)) + 1 : 5;
      const invoiceNo = `DW-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`;
      
      const newBooking = {
        id,
        ...payload,
        invoice_number: invoiceNo,
        invoice_date: new Date().toISOString().split('T')[0],
        status: "pending",
        payment_milestones: [
          { label: `Advance - Wedding Photography (${payload.package_name})`, amount: payload.advance_paid, date: new Date().toISOString().split('T')[0], status: 'Paid' },
          { label: 'Second Payment (Event Day)', amount: 0, date: payload.event_date, status: 'Pending' },
          { label: 'Final Payment (Before Delivery)', amount: payload.total_price - payload.advance_paid, date: '', status: 'Pending' }
        ],
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      localStorage.setItem("dreamwed_bookings", JSON.stringify([newBooking, ...localBookings]));
      setSignupSuccess(true);
      alert("✅ Booking submitted locally (Offline Sync Active)! Awaiting Admin Review.");
    } finally {
      setSigningUp(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!phoneQuery.trim()) return;

    setStatus("loading");
    setBooking(null);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/client/booking?phone=${encodeURIComponent(phoneQuery.trim())}`);
      
      if (res.status === 404) {
        // Local fallback
        const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
        const normalizedInput = phoneQuery.trim().replace(/\D/g, '');
        const match = localBookings.find(b => {
          const normalizedBookingPhone = (b.customer_phone || '').replace(/\D/g, '');
          const normalizedBookingPhone2 = (b.customer_phone_2 || '').replace(/\D/g, '');
          return normalizedBookingPhone === normalizedInput || 
                 normalizedBookingPhone.endsWith(normalizedInput) || 
                 normalizedInput.endsWith(normalizedBookingPhone) ||
                 (normalizedBookingPhone2 && (
                   normalizedBookingPhone2 === normalizedInput ||
                   normalizedBookingPhone2.endsWith(normalizedInput) ||
                   normalizedInput.endsWith(normalizedBookingPhone2)
                 ));
        });

        if (match) {
          setBooking(match);
          setStatus("success");
          return;
        }

        setStatus("not_found");
        return;
      }
      
      if (!res.ok) {
        throw new Error("Unable to contact backend server");
      }

      const data = await res.json();
      setBooking(data);
      setStatus("success");
    } catch (err) {
      console.error("Lookup error, falling back locally:", err);
      
      // Local fallback
      const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
      const normalizedInput = phoneQuery.trim().replace(/\D/g, '');
      const match = localBookings.find(b => {
        const normalizedBookingPhone = (b.customer_phone || '').replace(/\D/g, '');
        const normalizedBookingPhone2 = (b.customer_phone_2 || '').replace(/\D/g, '');
        return normalizedBookingPhone === normalizedInput || 
               normalizedBookingPhone.endsWith(normalizedInput) || 
               normalizedInput.endsWith(normalizedBookingPhone) ||
               (normalizedBookingPhone2 && (
                 normalizedBookingPhone2 === normalizedInput ||
                 normalizedBookingPhone2.endsWith(normalizedInput) ||
                 normalizedInput.endsWith(normalizedBookingPhone2)
               ));
      });

      if (match) {
        setBooking(match);
        setStatus("success");
        return;
      }

      setStatus("error");
      setErrorMessage("Could not connect to the booking server. Please check if your number is correct or try again shortly.");
    }
  };

  const formatCurrency = (num) => {
    return Number(num).toLocaleString("en-IN", { style: "decimal", maximumFractionDigits: 0 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).replace(/\//g, "-");
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] pt-28 pb-24 text-zinc-800 font-sans select-none overflow-x-hidden">
      <SEO 
        title="Client Invoice Portal | Dreamwed Stories"
        description="Access your custom photography booking, track milestone schedules, and download approved tax-invoice PDFs."
      />

      <div className="max-w-xl mx-auto px-6 space-y-8">
        {/* Portal Header */}
        <div className="text-center space-y-3">
          <span className="text-[#b4975a] text-xs font-semibold tracking-[0.25em] uppercase block">Client Console</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl sm:text-5xl text-zinc-900 font-light tracking-tight">
            Wedding <span className="italic font-serif text-[#b4975a]">Booking Console</span>
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed max-w-sm mx-auto">
            Find your tax invoice, register a new wedding project booking request, or review milestone schedules.
          </p>
        </div>

        {/* Toggle between Find Invoice and Request Booking */}
        <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit mx-auto border border-zinc-200 shadow-sm z-10 relative">
          <button 
            onClick={() => { setActiveMode("lookup"); setSignupSuccess(false); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === "lookup" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-850"
            }`}
          >
            Find My Invoice
          </button>
          <button 
            onClick={() => { setActiveMode("signup"); setStatus("idle"); setBooking(null); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === "signup" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-850"
            }`}
          >
            Request New Booking
          </button>
        </div>

        {/* Search Input Box / Signup Form */}
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-zinc-200 shadow-[0_15px_40px_rgba(0,0,0,0.02)] space-y-6">
          {activeMode === "lookup" ? (
            <form onSubmit={handleLookup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase block text-left">Registered Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 9995412955"
                    value={phoneQuery}
                    onChange={(e) => setPhoneQuery(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 text-zinc-800 text-sm focus:border-[#b4975a] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-zinc-950 text-white font-bold rounded-xl hover:bg-black transition-all text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search size={14} />
                {status === "loading" ? "Searching Booking DB..." : "Find Invoice"}
              </button>
            </form>
          ) : !signupSuccess ? (
            <form onSubmit={handleSignupSubmit} className="space-y-6 text-left">
              
              {/* SECTION: Package Details (Auto Filled) */}
              <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs border-b border-zinc-200 pb-2">
                  <span>📦</span> Package Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest block">Package Name</label>
                    <select 
                      value={selectedPackage}
                      onChange={(e) => handlePackageChange(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                    >
                      <option value="Elite Signature Package">Elite Signature Package</option>
                      <option value="Premium Couture Package">Premium Couture Package</option>
                      <option value="Classic Heritage Package">Classic Heritage Package</option>
                      <option value="Promo Rates Booking">Promo Rates Booking</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest block">Package Price (₹)</label>
                    <input 
                      type="text" 
                      readOnly
                      value={`₹ ${formatCurrency(packagePrice)}`}
                      className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-600 text-xs focus:outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <div className="text-[10px] text-[#b4975a] font-bold uppercase flex justify-between bg-[#b4975a]/5 border border-[#b4975a]/10 p-3.5 rounded-xl">
                      <span>Min Advance Required:</span>
                      <span>₹ {formatCurrency(minAdvance)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Role Selection (Single-side only) */}
              {isSingleSidePackage(selectedPackage) && (
                <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs border-b border-zinc-200 pb-2">
                    <span>👤</span> Booking Side / Role
                  </div>
                  <div className="space-y-3 text-left">
                    <p className="text-[11px] text-zinc-550 font-light leading-relaxed">
                      This is a single-side coverage package. Please choose whose details you want to provide for this booking:
                    </p>
                    <div className="grid grid-cols-3 gap-2 bg-zinc-200/50 p-1 rounded-xl border border-zinc-200 w-full relative z-10">
                      {[
                        { value: "bride", label: "👰 Bride" },
                        { value: "groom", label: "🎩 Groom" },
                        { value: "both", label: "💑 Both" }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setBookingRole(opt.value)}
                          className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            bookingRole === opt.value
                              ? "bg-zinc-900 text-white shadow-xs"
                              : "bg-white text-zinc-500 hover:text-zinc-800"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Bride Details */}
              {(!isSingleSidePackage(selectedPackage) || bookingRole === "bride" || bookingRole === "both") && (
                <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs border-b border-zinc-200 pb-2">
                    <span>👰</span> Bride Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Full Name *</label>
                      <input 
                        type="text" 
                        required={!isSingleSidePackage(selectedPackage) || bookingRole === "bride" || bookingRole === "both"}
                        placeholder="Bride's Full Name"
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Phone Number *</label>
                      <input 
                        type="tel" 
                        required={!isSingleSidePackage(selectedPackage) || bookingRole === "bride" || bookingRole === "both"}
                        placeholder="Bride's Phone Number"
                        value={bridePhone}
                        onChange={(e) => setBridePhone(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Email</label>
                      <input 
                        type="email" 
                        placeholder="bride@example.com"
                        value={brideEmail}
                        onChange={(e) => setBrideEmail(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Address</label>
                      <textarea 
                        rows={2}
                        placeholder="Bride's Address"
                        value={brideAddress}
                        onChange={(e) => setBrideAddress(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Groom Details */}
              {(!isSingleSidePackage(selectedPackage) || bookingRole === "groom" || bookingRole === "both") && (
                <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs border-b border-zinc-200 pb-2">
                    <span>🎩</span> Groom Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Full Name *</label>
                      <input 
                        type="text" 
                        required={!isSingleSidePackage(selectedPackage) || bookingRole === "groom" || bookingRole === "both"}
                        placeholder="Groom's Full Name"
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Phone Number *</label>
                      <input 
                        type="tel" 
                        required={!isSingleSidePackage(selectedPackage) || bookingRole === "groom" || bookingRole === "both"}
                        placeholder="Groom's Phone Number"
                        value={groomPhone}
                        onChange={(e) => setGroomPhone(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Email</label>
                      <input 
                        type="email" 
                        placeholder="groom@example.com"
                        value={groomEmail}
                        onChange={(e) => setGroomEmail(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Address</label>
                      <textarea 
                        rows={2}
                        placeholder="Groom's Address"
                        value={groomAddress}
                        onChange={(e) => setGroomAddress(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Wedding & Reception Schedule */}
              <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs border-b border-zinc-200 pb-2">
                  <span>📅</span> Event Schedule Details
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase block">Schedule Configuration</label>
                  <div className="grid grid-cols-2 gap-3 bg-zinc-200/50 p-1 rounded-xl border border-zinc-200 w-full relative z-10">
                    <button 
                      type="button"
                      onClick={() => setWeddingReceptionMode("same")}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        weddingReceptionMode === "same" ? "bg-zinc-900 text-white shadow-xs" : "bg-white text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      Same Date
                    </button>
                    <button 
                      type="button"
                      onClick={() => setWeddingReceptionMode("different")}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        weddingReceptionMode === "different" ? "bg-zinc-900 text-white shadow-xs" : "bg-white text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      Different Dates
                    </button>
                  </div>
                </div>

                {weddingReceptionMode === "same" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Event Date *</label>
                      <input 
                        type="date" 
                        required={weddingReceptionMode === "same"}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        style={{ colorScheme: "light" }}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Wedding Venue *</label>
                      <input 
                        type="text" 
                        required={weddingReceptionMode === "same"}
                        placeholder="Wedding Venue"
                        value={eventVenue}
                        onChange={(e) => setEventVenue(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Reception Venue</label>
                      <input 
                        type="text" 
                        placeholder="Reception Venue"
                        value={receptionVenue}
                        onChange={(e) => setReceptionVenue(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Wedding Time</label>
                      <input 
                        type="time" 
                        value={weddingTime}
                        onChange={(e) => setWeddingTime(e.target.value)}
                        style={{ colorScheme: "light" }}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Reception Time</label>
                      <input 
                        type="time" 
                        value={receptionTime}
                        onChange={(e) => setReceptionTime(e.target.value)}
                        style={{ colorScheme: "light" }}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    {/* Wedding Date Info */}
                    <div className="p-4 bg-zinc-200/30 rounded-2xl border border-zinc-200 space-y-3">
                      <span className="text-[9px] text-[#b4975a] font-bold uppercase tracking-wider block">Wedding details</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Date *</label>
                          <input 
                            type="date" 
                            required={weddingReceptionMode === "different"}
                            value={weddingDateDiff}
                            onChange={(e) => setWeddingDateDiff(e.target.value)}
                            style={{ colorScheme: "light" }}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Time</label>
                          <input 
                            type="time" 
                            value={weddingTimeDiff}
                            onChange={(e) => setWeddingTimeDiff(e.target.value)}
                            style={{ colorScheme: "light" }}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Venue *</label>
                          <input 
                            type="text" 
                            required={weddingReceptionMode === "different"}
                            placeholder="Wedding Venue"
                            value={weddingVenueDiff}
                            onChange={(e) => setWeddingVenueDiff(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reception Date Info */}
                    <div className="p-4 bg-zinc-200/30 rounded-2xl border border-zinc-200 space-y-3">
                      <span className="text-[9px] text-[#b4975a] font-bold uppercase tracking-wider block">Reception details</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Date</label>
                          <input 
                            type="date" 
                            value={receptionDateDiff}
                            onChange={(e) => setReceptionDateDiff(e.target.value)}
                            style={{ colorScheme: "light" }}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Time</label>
                          <input 
                            type="time" 
                            value={receptionTimeDiff}
                            onChange={(e) => setReceptionTimeDiff(e.target.value)}
                            style={{ colorScheme: "light" }}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Venue</label>
                          <input 
                            type="text" 
                            placeholder="Reception Venue"
                            value={receptionVenueDiff}
                            onChange={(e) => setReceptionVenueDiff(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: Additional Details */}
              <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs border-b border-zinc-200 pb-2">
                  <span>✨</span> Additional Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Need Drone?</label>
                    <select 
                      value={needDrone}
                      onChange={(e) => setNeedDrone(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Need Cinematic Video?</label>
                    <select 
                      value={needCinematic}
                      onChange={(e) => setNeedCinematic(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Preferred Album Size</label>
                    <select 
                      value={preferredAlbumSize}
                      onChange={(e) => setPreferredAlbumSize(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                    >
                      <option value="12x18">12 x 18 Premium Couture (Standard)</option>
                      <option value="12x15">12 x 15 Couture</option>
                      <option value="10x15">10 x 15 Signature</option>
                      <option value="8x12">8 x 12 Mini Companion</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Special Notes</label>
                    <textarea 
                      rows={3}
                      placeholder="Add any specific requests or questions..."
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Wedding Invitation Upload */}
              <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs border-b border-zinc-200 pb-2">
                  <span>✉️</span> Wedding Invitation
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest block text-left">Upload Invitation (JPG, PNG, PDF)</label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm select-none">
                      Choose File
                      <input 
                        type="file" 
                        accept="image/*,application/pdf"
                        onChange={handleInvitationChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-zinc-500 text-xs font-light truncate">
                      {invitationFileName || "No file uploaded (PDF or Images)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION: Advance Payment */}
              <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs border-b border-zinc-200 pb-2">
                  <span>💳</span> Advance Payment
                </div>
                <div className="space-y-4">
                  <div className="bg-[#b4975a]/10 border border-[#b4975a]/20 p-4 rounded-xl text-left space-y-1.5 text-zinc-700">
                    <span className="block text-[9px] font-bold text-[#b4975a] uppercase tracking-wider">Payment Details</span>
                    <p className="text-xs font-light leading-normal">
                      Please send your advance booking fee of <strong>₹5,000/-</strong> using the credentials below:
                    </p>
                    <div className="text-[10px] font-mono bg-white/60 p-2.5 rounded-lg border border-[#b4975a]/10 space-y-1">
                      <div>UPI ID: <strong className="text-zinc-900">dreamwedstories@okaxis</strong></div>
                      <div>GPay / PhonePe: <strong className="text-zinc-900">+91 98954 12895</strong></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Amount Paying (₹) *</label>
                      <input 
                        type="number" 
                        required
                        placeholder="5000"
                        value={advancePaid}
                        onChange={(e) => setAdvancePaid(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Payment Method *</label>
                      <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none"
                      >
                        <option value="UPI">UPI</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Bank Transfer">Bank/IMPS Transfer</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Transaction ID / Reference No *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter 12-digit transaction ID or cash details"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-800 text-xs focus:border-[#b4975a] focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Upload Payment Screenshot *</label>
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm select-none">
                          Choose Screenshot
                          <input 
                            type="file" 
                            required
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-zinc-500 text-xs font-light truncate">
                          {screenshotFileName || "No screenshot uploaded"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={signingUp}
                className="w-full py-4.5 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl transition-all text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] mt-2"
              >
                {signingUp ? "Submitting Booking..." : "Submit Booking"}
              </button>
            </form>
          ) : (
            <div className="p-6 text-center space-y-6">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-xl animate-pulse">
                🟡
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Awaiting Admin Approval</span>
                <h3 className="text-lg font-bold text-zinc-900">Booking Request Received</h3>
                <p className="text-zinc-500 text-xs font-light leading-relaxed max-w-sm mx-auto">
                  Thank you! Your wedding booking request and advance payment proof (Transaction ID: <span className="font-mono font-medium">{transactionId}</span>) have been received.
                </p>
                <p className="text-zinc-500 text-xs font-light leading-relaxed max-w-sm mx-auto">
                  Our coordinator is verifying your payment and calendar slot. Once approved, your invoice will generate, and couple credentials will be created.
                </p>
              </div>
              <button 
                onClick={() => {
                  setSignupSuccess(false);
                  setActiveMode("lookup");
                }}
                className="px-6 py-2.5 rounded-xl border border-zinc-200 text-zinc-650 hover:bg-zinc-50 transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Go to Invoice Search
              </button>
            </div>
          )}

          {/* Feedback states */}
          <AnimatePresence mode="wait">
            {activeMode === "lookup" && status === "not_found" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-2xl text-xs space-y-3"
              >
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle size={16} className="shrink-0 text-amber-600" />
                  <span>No Booking Found</span>
                </div>
                <p className="font-light leading-relaxed text-left">
                  We couldn't locate a booking request matching <strong>{phoneQuery}</strong>. Please ensure you entered the exact contact number used during submission.
                </p>
                <a 
                  href="https://wa.me/919995412955?text=Hello%20Dreamwed%20Stories,%20I%20am%20unable%20to%20find%20my%20invoice%20for%20phone%20number"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#b4975a] hover:underline"
                >
                  <FaWhatsapp size={14} /> Contact Coordinator
                </a>
              </motion.div>
            )}

            {activeMode === "lookup" && status === "error" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl text-xs space-y-2"
              >
                <div className="flex items-center gap-2 font-bold text-red-900">
                  <AlertCircle size={16} className="shrink-0 text-red-600" />
                  <span>Connection Issue</span>
                </div>
                <p className="font-light leading-relaxed text-left">{errorMessage}</p>
              </motion.div>
            )}

            {activeMode === "signup" && signupSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl text-xs space-y-2 text-left"
              >
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle size={16} className="shrink-0 text-emerald-600" />
                  <span>Request Received!</span>
                </div>
                <p className="font-light leading-relaxed">
                  Thank you! Your wedding photography and cinematic film booking request has been submitted. Our team will review the date and venue shortly. Once approved by the administrator, you can search using your registered number to access your tax invoice.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Booking Details Card */}
        <AnimatePresence>
          {status === "success" && booking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 sm:p-8 rounded-[32px] border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6"
            >
              <div className="flex justify-between items-start border-b border-zinc-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Client Profile</span>
                  <h2 className="text-xl font-bold text-zinc-900 mt-1">{booking.customer_name}</h2>
                  <p className="text-zinc-500 text-xs font-light mt-0.5">{booking.customer_email || booking.customer_phone}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</span>
                  {booking.status === "confirmed" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/20">
                      <CheckCircle size={12} className="fill-emerald-700 stroke-emerald-50" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/20">
                      <Clock size={12} className="fill-amber-700 stroke-amber-50" />
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>

              {/* Event details */}
              <div className="grid grid-cols-2 gap-4 text-xs font-light">
                <div className="space-y-1 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Wedding Date</span>
                  <div className="flex items-center gap-1.5 text-zinc-800 font-medium mt-1">
                    <Calendar size={14} className="text-zinc-400" />
                    <span>{formatDate(booking.event_date)}</span>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Selected Package</span>
                  <div className="flex items-center gap-1.5 text-zinc-800 font-medium mt-1">
                    <Gift size={14} className="text-zinc-400" />
                    <span className="truncate">{booking.package_name}</span>
                  </div>
                </div>

                <div className="col-span-2 space-y-1 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Wedding Venue</span>
                  <div className="flex items-center gap-1.5 text-zinc-800 font-medium mt-1">
                    <MapPin size={14} className="text-zinc-400 shrink-0" />
                    <span className="line-clamp-1">{booking.event_venue}</span>
                  </div>
                </div>
              </div>

              {/* Custom Status message mapping user's exact approval condition */}
              {booking.status !== "confirmed" ? (
                <div className="bg-amber-50/50 border border-amber-200/60 p-5 rounded-2xl text-xs space-y-2 text-zinc-700">
                  <div className="flex items-center gap-2 font-bold text-amber-900 uppercase tracking-wide text-[10px]">
                    <Clock size={14} className="text-amber-600" />
                    <span>Invoice Pending Approval</span>
                  </div>
                  <p className="font-light leading-relaxed">
                    Your wedding booking request is received! However, your invoice details are currently undergoing admin date confirmation. Once approved by our team, your printable brand invoice will be instantly unlocked for download here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 pt-2">
                  <div className="bg-emerald-50/50 border border-emerald-200/60 p-5 rounded-2xl text-xs space-y-1.5 text-zinc-700">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 uppercase tracking-wide text-[10px]">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <span>Invoice Unlocked</span>
                    </div>
                    <p className="font-light leading-relaxed">
                      Congratulations! Your wedding booking is approved. Your printable custom brand invoice is locked and ready below.
                    </p>
                  </div>

                  {/* Financial breakdown */}
                  <div className="bg-zinc-900 text-zinc-100 p-5 rounded-2xl flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-bold">Total Package Price</span>
                      <div className="text-lg font-bold text-white">₹ {formatCurrency(booking.total_price)}</div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-bold">Advance Paid</span>
                      <div className="text-xs font-semibold text-emerald-400">₹ {formatCurrency(booking.advance_paid)}</div>
                    </div>
                    <div className="text-right space-y-0.5 border-l border-zinc-800 pl-5">
                      <span className="text-[9px] text-[#b4975a] uppercase tracking-wider font-bold">Remaining Balance</span>
                      <div className="text-base font-bold text-[#b4975a]">₹ {formatCurrency(booking.total_price - booking.advance_paid)}</div>
                    </div>
                  </div>

                  {/* PDF Download Button */}
                  <button 
                    onClick={() => setIsInvoicePrintOpen(true)}
                    className="w-full py-4.5 bg-[#b4975a] text-zinc-950 font-bold rounded-xl hover:bg-[#c5a86b] active:scale-98 transition-all text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2.5 cursor-pointer font-Montserrat"
                  >
                    <Download size={15} />
                    Download Printable Invoice
                  </button>

                  {/* Private Access Credentials */}
                  <div className="bg-zinc-50 border border-[#b4975a]/25 p-5 rounded-2xl space-y-3.5 text-left mt-4 shadow-sm select-none">
                    <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                      <span className="text-base">🔑</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#b4975a]">Couple Client Portal Access Credentials</h4>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
                      Use these private access credentials to log into your wedding dashboard workspace client portal (instead of OTP):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-3 border border-zinc-200 rounded-xl flex justify-between items-center">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">👰 Bride Password:</span>
                        <span className="text-zinc-900 font-mono font-bold text-xs">{booking.bride_password || "—"}</span>
                      </div>
                      <div className="bg-white p-3 border border-zinc-200 rounded-xl flex justify-between items-center">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">🤵 Groom Password:</span>
                        <span className="text-zinc-900 font-mono font-bold text-xs">{booking.groom_password || "—"}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link
                        to="/my-booking"
                        className="w-full py-3.5 bg-zinc-950 hover:bg-black text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                      >
                        🚀 Go to Client Portal Login
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RENDER DYNAMIC BRAND A4 PRINT INVOICE MODAL */}
      <AnimatePresence>
        {isInvoicePrintOpen && booking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="invoice-overlay !block"
          >
            {/* Control Bar (hidden during PDF print) */}
            <div className="invoice-control-bar no-print">
              <button 
                onClick={() => setIsInvoicePrintOpen(false)}
                className="action-btn"
                style={{ background: "#222", color: "#fff", border: "1px solid #333" }}
              >
                ✕ Close Portal
              </button>
              <button 
                onClick={() => window.print()}
                className="action-btn"
                style={{ background: "#b4975a", color: "#000" }}
              >
                <Printer size={14} /> Print / Save as PDF
              </button>
            </div>

            {/* A4 Container */}
            <div className="invoice-container">
              {/* Branding header exactly styled like invoice images */}
              <div className="invoice-brand">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="brand-logo-circle">DW</div>
                  <div className="brand-text-name">Dreamwed Stories</div>
                </div>
                <div style={{ fontSize: "11px", textAlign: "right", color: "#555", lineHeight: "1.5" }}>
                  dreamwedstories.co.in<br />
                  +91 98954 12895
                </div>
              </div>

              {/* Bold Minimalist Title */}
              <div className="invoice-header-title">
                <h2>Invoice</h2>
              </div>

              {/* Meta details split */}
              <div className="invoice-meta-section">
                <div className="invoice-to">
                  <h3>Invoice To:</h3>
                  <div className="invoice-to-name">{booking.customer_name}</div>
                  <div className="invoice-to-details">
                    <div>{booking.event_venue}</div>
                    <div>Ph: {booking.customer_phone}</div>
                    {booking.customer_email && <div>Email: {booking.customer_email}</div>}
                  </div>
                </div>

                <div className="invoice-details-right">
                  <table>
                    <tbody>
                      <tr>
                        <td className="lbl">Issued:</td>
                        <td className="val">{formatDate(booking.invoice_date || booking.created_at.split(" ")[0])}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Invoice:</td>
                        <td className="val">{booking.invoice_number}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Due:</td>
                        <td className="val">On Receipt</td>
                      </tr>
                      <tr>
                        <td className="lbl">Package Price:</td>
                        <td className="val">₹ {formatCurrency(booking.package_price)}/-</td>
                      </tr>
                      <tr>
                        <td className="lbl">Element:</td>
                        <td className="val">{booking.package_name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Milestone items list */}
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Product / Service</th>
                    <th className="amount-col" style={{ width: "140px" }}>Price</th>
                    <th style={{ width: "150px", paddingLeft: "20px" }}>Date</th>
                    <th class="amount-col" style={{ width: "140px" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.payment_milestones.map((m, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ fontWeight: 700, color: "#000", marginBottom: "2px" }}>{m.label}</div>
                        <div style={{ fontSize: "10px", color: "#666", fontStyle: "italic" }}>Stage {index + 1} ({m.status})</div>
                      </td>
                      <td className="amount-col">₹ {formatCurrency(m.amount)}</td>
                      <td style={{ paddingLeft: "20px" }}>{m.date ? formatDate(m.date) : "TBD"}</td>
                      <td className="amount-col">₹ {formatCurrency(m.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Right Summary breakdown */}
              <div className="invoice-summary">
                <table className="invoice-summary-table">
                  <tbody>
                    <tr>
                      <td className="lbl">Subtotal:</td>
                      <td className="val">
                        ₹ {formatCurrency(booking.payment_milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0))}/-
                      </td>
                    </tr>
                    <tr>
                      <td className="lbl">Tax (0%):</td>
                      <td className="val">₹ 0/-</td>
                    </tr>
                    <tr>
                      <td className="lbl">Total:</td>
                      <td className="val">
                        ₹ {formatCurrency(booking.payment_milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0))}/-
                      </td>
                    </tr>
                    <tr className="total-payable-row">
                      <td class="lbl">Total Payable Amount:</td>
                      <td className="val">₹ {formatCurrency(booking.total_price - booking.advance_paid)}/-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cursive Signature script footer matching templates */}
              <div className="invoice-footer">
                <div className="payment-instructions">
                  <strong>Send Payments To:</strong>
                  Dreamwed Stories<br />
                  UPI: dreamwedstories@okaxis<br />
                  GPay / PhonePe: +91 98954 12895
                </div>
                <div>
                  <div className="signature-thankyou">Thank You!</div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyBooking;
