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
  
  // Explicitly dual-side packages:
  if (
    name.includes("elite signature") || 
    name.includes("premium couture") || 
    name.includes("bride & groom luxury")
  ) {
    return false;
  }
  
  // Explicitly single-side packages:
  if (
    name.includes("classic heritage") ||
    name.includes("wedding photography") ||
    name.includes("wedding photo & pre-wedding") ||
    name.includes("candid photo & videography") ||
    name.includes("engagement package") || // "Bride or Groom Engagement Package"
    name.includes("premium candid") ||
    name.includes("standalone") ||
    name.includes("haldi") ||
    name.includes("promo")
  ) {
    return true;
  }
  
  // General fallback
  if (name.includes("dual") || name.includes("both") || name.includes("bride & groom") || name.includes("luxury")) {
    return false;
  }
  return true; // Default to single-side for other packages
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

  const API_BASE = typeof window !== "undefined"
    ? (localStorage.getItem("dreamwed_api_base") || import.meta.env.VITE_API_BASE_URL || "https://dreamwed-backend.onrender.com")
    : "https://dreamwed-backend.onrender.com";

  const isSingleEvent = 
    selectedPackage.toLowerCase().includes("engagement") ||
    selectedPackage.toLowerCase().includes("haldi") ||
    selectedPackage.toLowerCase().includes("standalone");

  const isEngagement = 
    selectedPackage.toLowerCase().includes("engagement");

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
    // Proactively wake up the Render backend container when page loads
    fetch(`${API_BASE}/api/bookings`).catch(() => null);

    if (!localStorage.getItem("dreamwed_bookings")) {
      localStorage.setItem("dreamwed_bookings", JSON.stringify(INITIAL_BOOKINGS));
    }
    
    // Parse package parameters from URL
    let search = window.location.search;
    if (!search && window.location.hash.includes('?')) {
      search = window.location.hash.substring(window.location.hash.indexOf('?'));
    }
    const params = new URLSearchParams(search);
    const pkg = params.get("package");
    const prc = params.get("price");
    if (pkg) {
      const decodedPkg = decodeURIComponent(pkg);
      setSelectedPackage(decodedPkg);
      setActiveMode("signup");
      
      if (isSingleSidePackage(decodedPkg)) {
        setBookingRole("bride");
      } else {
        setBookingRole("both");
      }
      
      // Attempt to set matching price or use parameter price
      if (prc) {
        setPackagePrice(Number(prc));
      } else {
        const pName = decodedPkg;
        if (pName === "Elite Signature Package") setPackagePrice(180000);
        else if (pName === "Premium Couture Package") setPackagePrice(135000);
        else if (pName === "Classic Heritage Package") setPackagePrice(95000);
        else if (pName === "Wedding Photography") setPackagePrice(39999);
        else if (pName === "Wedding Photo & Pre-Wedding") setPackagePrice(54999);
        else if (pName === "Candid Photo & Videography") setPackagePrice(69999);
        else if (pName === "Bride & Groom Luxury Package") setPackagePrice(110000);
        else if (pName === "Premium Candid Package") setPackagePrice(79999);
        else if (pName === "Bride or Groom Engagement Package") setPackagePrice(28999);
        else if (pName === "Standalone Wedding Day") setPackagePrice(39999);
        else if (pName === "Standalone Reception") setPackagePrice(19999);
        else if (pName === "Haldi Photography (Only)") setPackagePrice(10000);
        else if (pName === "Haldi Photography with Album") setPackagePrice(15000);
        else if (pName === "Haldi & Madhuram") setPackagePrice(28000);
        else if (pName === "Promo Rates Booking") setPackagePrice(5000);
        else {
          if (decodedPkg.toLowerCase().includes("signature")) {
            setPackagePrice(180000);
          } else if (decodedPkg.toLowerCase().includes("couture")) {
            setPackagePrice(135000);
          } else {
            setPackagePrice(95000);
          }
        }
      }
    }
  }, []);

  const handlePackageChange = (pName) => {
    setSelectedPackage(pName);
    if (isSingleSidePackage(pName)) {
      setBookingRole("bride");
    } else {
      setBookingRole("both");
    }
    
    const isSingle = 
      pName.toLowerCase().includes("engagement") ||
      pName.toLowerCase().includes("haldi") ||
      pName.toLowerCase().includes("standalone");
    if (isSingle) {
      setWeddingReceptionMode("same");
    }

    if (pName === "Elite Signature Package") setPackagePrice(180000);
    else if (pName === "Premium Couture Package") setPackagePrice(135000);
    else if (pName === "Classic Heritage Package") setPackagePrice(95000);
    else if (pName === "Wedding Photography") setPackagePrice(39999);
    else if (pName === "Wedding Photo & Pre-Wedding") setPackagePrice(54999);
    else if (pName === "Candid Photo & Videography") setPackagePrice(69999);
    else if (pName === "Bride & Groom Luxury Package") setPackagePrice(110000);
    else if (pName === "Premium Candid Package") setPackagePrice(79999);
    else if (pName === "Bride or Groom Engagement Package") setPackagePrice(28999);
    else if (pName === "Standalone Wedding Day") setPackagePrice(39999);
    else if (pName === "Standalone Reception") setPackagePrice(19999);
    else if (pName === "Haldi Photography (Only)") setPackagePrice(10000);
    else if (pName === "Haldi Photography with Album") setPackagePrice(15000);
    else if (pName === "Haldi & Madhuram") setPackagePrice(28000);
    else if (pName === "Promo Rates Booking") setPackagePrice(5000);
    else {
      if (pName.toLowerCase().includes("signature")) setPackagePrice(180000);
      else if (pName.toLowerCase().includes("couture")) setPackagePrice(135000);
      else if (pName.toLowerCase().includes("heritage")) setPackagePrice(95000);
      else setPackagePrice(95000);
    }
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

    if (isSingleEvent) {
      if (!eventDate || !eventVenue.trim()) {
        const eventLabel = isEngagement ? "Engagement" : selectedPackage.toLowerCase().includes("haldi") ? "Haldi" : "Event";
        alert(`${eventLabel} Date and ${eventLabel} Venue are required.`);
        return;
      }
    } else {
      if (weddingReceptionMode === "same" && (!eventDate || !eventVenue.trim())) {
        alert("Wedding Date and Wedding Venue are required.");
        return;
      }

      if (weddingReceptionMode === "different" && (!weddingDateDiff || !weddingVenueDiff.trim())) {
        alert("Wedding Date and Wedding Venue are required.");
        return;
      }
    }

    if (Number(advancePaid) < minAdvance) {
      alert(`Minimum advance payment is ₹${minAdvance.toLocaleString("en-IN")}.`);
      return;
    }

    const eventDateFinal = (isSingleEvent || weddingReceptionMode === "same") ? eventDate : weddingDateDiff;
    const eventVenueFinal = (isSingleEvent || weddingReceptionMode === "same") ? eventVenue.trim() : weddingVenueDiff.trim();

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
      
      coverage_type: isSingleSide ? "single" : "both",
      coverage_side: isSingleSide ? bookingRole : "both",
      wedding_reception_mode: isSingleEvent ? "same" : weddingReceptionMode,
      event_date: eventDateFinal,
      event_venue: eventVenueFinal,
      reception_venue: isSingleEvent ? "" : (weddingReceptionMode === "same" ? receptionVenue.trim() : receptionVenueDiff.trim()),
      
      same_date_details: (isSingleEvent || weddingReceptionMode === "same") ? {
        wedding_venue: eventVenue.trim(),
        reception_venue: isSingleEvent ? "" : receptionVenue.trim(),
        wedding_time: weddingTime,
        reception_time: isSingleEvent ? "" : receptionTime
      } : null,
      
      different_date_details: (!isSingleEvent && weddingReceptionMode === "different") ? {
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
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout to support Render cold starts

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
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
        isLocalOnly: true,
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
      alert("✅ Booking saved offline on your device! Please make sure to sync it with our server under the 'Find My Invoice' tab once the server connection is back online.");
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
          setBooking({ ...match, isLocalOnly: true });
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
        setBooking({ ...match, isLocalOnly: true });
        setStatus("success");
        return;
      }

      setStatus("error");
      setErrorMessage("Could not connect to the booking server. Please check if your number is correct or try again shortly.");
    }
  };

  const [syncing, setSyncing] = useState(false);

  const handleSyncBooking = async (localBooking) => {
    setSyncing(true);
    try {
      // Strip local flags
      const { isLocalOnly, id: tempId, ...syncPayload } = localBooking;
      
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(syncPayload)
      });
      
      if (res.ok) {
        const serverBooking = await res.json();
        
        // Update local storage
        const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
        const updated = localBookings.map(b => b.id === localBooking.id ? serverBooking : b);
        localStorage.setItem("dreamwed_bookings", JSON.stringify(updated));
        
        setBooking(serverBooking);
        alert("✅ Booking synced successfully with the live server database!");
      } else {
        alert("❌ Failed to sync booking. The server returned an error.");
      }
    } catch (err) {
      console.error("Sync error:", err);
      alert("❌ Unable to connect to the backend server. Please make sure the server is awake and try again.");
    } finally {
      setSyncing(false);
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
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-zinc-950 pt-28 pb-24 text-zinc-800 dark:text-zinc-100 font-sans select-none overflow-x-hidden">
      <SEO 
        title="Client Invoice Portal | Dreamwed Stories"
        description="Access your custom photography booking, track milestone schedules, and download approved tax-invoice PDFs."
      />

      <div className="max-w-xl mx-auto px-6 space-y-8">
        {/* Portal Header */}
        <div className="text-center space-y-3">
          <span className="text-[#b4975a] text-xs font-semibold tracking-[0.25em] uppercase block">Client Console</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl sm:text-5xl text-zinc-900 dark:text-white font-light tracking-tight">
            Wedding <span className="italic font-serif text-[#b4975a]">Booking Console</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm mx-auto">
            Find your tax invoice, register a new wedding project booking request, or review milestone schedules.
          </p>
        </div>

        {/* Toggle between Find Invoice and Request Booking */}
        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-fit mx-auto border border-zinc-200 dark:border-zinc-800 shadow-sm z-10 relative">
          <button 
            onClick={() => { setActiveMode("lookup"); setSignupSuccess(false); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === "lookup" 
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200"
            }`}
          >
            Find My Invoice
          </button>
          <button 
            onClick={() => { setActiveMode("signup"); setStatus("idle"); setBooking(null); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === "signup" 
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200"
            }`}
          >
            Request New Booking
          </button>
        </div>

        {/* Search Input Box / Signup Form */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.02)] space-y-6">
          {activeMode === "lookup" ? (
            <form onSubmit={handleLookup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] text-zinc-400 dark:text-zinc-400 font-bold tracking-widest uppercase block text-left">Registered Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 9995412955"
                    value={phoneQuery}
                    onChange={(e) => setPhoneQuery(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-800 dark:text-zinc-100 text-sm focus:border-[#b4975a] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-black dark:hover:bg-white transition-all text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search size={14} />
                {status === "loading" ? "Searching Booking DB..." : "Find Invoice"}
              </button>
            </form>
          ) : !signupSuccess ? (
            <form onSubmit={handleSignupSubmit} className="space-y-6 text-left">
              
              {/* SECTION: Package Details (Auto Filled) */}
              <div className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span>📦</span> Package Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Package Name</label>
                    <select 
                      value={selectedPackage}
                      onChange={(e) => handlePackageChange(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
                    >
                      <option value="Elite Signature Package">Elite Signature Package (₹1,80,000)</option>
                      <option value="Premium Couture Package">Premium Couture Package (₹1,35,000)</option>
                      <option value="Classic Heritage Package">Classic Heritage Package (₹95,000)</option>
                      <option value="Wedding Photography">Wedding Photography (₹39,999)</option>
                      <option value="Wedding Photo & Pre-Wedding">Wedding Photo & Pre-Wedding (₹54,999)</option>
                      <option value="Candid Photo & Videography">Candid Photo & Videography (₹69,999)</option>
                      <option value="Bride & Groom Luxury Package">Bride & Groom Luxury Package (₹1,10,000)</option>
                      <option value="Premium Candid Package">Premium Candid Package (₹79,999)</option>
                      <option value="Bride or Groom Engagement Package">Bride or Groom Engagement Package (₹28,999)</option>
                      <option value="Standalone Wedding Day">Standalone Wedding Day (₹39,999)</option>
                      <option value="Standalone Reception">Standalone Reception (₹19,999)</option>
                      <option value="Haldi Photography (Only)">Haldi Photography (Only) (₹10,000)</option>
                      <option value="Haldi Photography with Album">Haldi Photography with Album (₹15,000)</option>
                      <option value="Haldi & Madhuram">Haldi & Madhuram (₹28,000)</option>
                      <option value="Promo Rates Booking">Promo Rates Booking (₹5,000)</option>
                      {!["Elite Signature Package", "Premium Couture Package", "Classic Heritage Package", "Wedding Photography", "Wedding Photo & Pre-Wedding", "Candid Photo & Videography", "Bride & Groom Luxury Package", "Premium Candid Package", "Bride or Groom Engagement Package", "Standalone Wedding Day", "Standalone Reception", "Haldi Photography (Only)", "Haldi Photography with Album", "Haldi & Madhuram", "Promo Rates Booking"].includes(selectedPackage) && (
                        <option value={selectedPackage}>{selectedPackage}</option>
                      )}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Package Price (₹)</label>
                    <input 
                      type="text" 
                      readOnly
                      value={`₹ ${formatCurrency(packagePrice)}`}
                      className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-600 dark:text-zinc-400 text-xs focus:outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <div className="text-[10px] text-[#b4975a] font-bold uppercase flex justify-between bg-[#b4975a]/5 dark:bg-[#b4975a]/10 border border-[#b4975a]/10 dark:border-[#b4975a]/20 p-3.5 rounded-xl">
                      <span>Min Advance Required:</span>
                      <span>₹ {formatCurrency(minAdvance)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Role Selection (Single-side only) */}
              {isSingleSidePackage(selectedPackage) && (
                <div className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span>👤</span> Booking Side / Role
                  </div>
                  <div className="space-y-3 text-left">
                    <p className="text-[11px] text-zinc-550 dark:text-zinc-400 font-light leading-relaxed">
                      This is a single-side coverage package. Please choose whose details you want to provide for this booking:
                    </p>
                    <div className="grid grid-cols-2 gap-2 bg-zinc-200/50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full relative z-10">
                      {[
                        { value: "bride", label: "👰 Bride" },
                        { value: "groom", label: "🎩 Groom" }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setBookingRole(opt.value)}
                          className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            bookingRole === opt.value
                              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                              : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
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
                <div className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span>👰</span> Bride Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Full Name *</label>
                      <input 
                        type="text" 
                        required={!isSingleSidePackage(selectedPackage) || bookingRole === "bride" || bookingRole === "both"}
                        placeholder="Bride's Full Name"
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Phone Number *</label>
                      <input 
                        type="tel" 
                        required={!isSingleSidePackage(selectedPackage) || bookingRole === "bride" || bookingRole === "both"}
                        placeholder="Bride's Phone Number"
                        value={bridePhone}
                        onChange={(e) => setBridePhone(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Email</label>
                      <input 
                        type="email" 
                        placeholder="bride@example.com"
                        value={brideEmail}
                        onChange={(e) => setBrideEmail(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Address</label>
                      <textarea 
                        rows={2}
                        placeholder="Bride's Address"
                        value={brideAddress}
                        onChange={(e) => setBrideAddress(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Groom Details */}
              {(!isSingleSidePackage(selectedPackage) || bookingRole === "groom" || bookingRole === "both") && (
                <div className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span>🎩</span> Groom Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Full Name *</label>
                      <input 
                        type="text" 
                        required={!isSingleSidePackage(selectedPackage) || bookingRole === "groom" || bookingRole === "both"}
                        placeholder="Groom's Full Name"
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Phone Number *</label>
                      <input 
                        type="tel" 
                        required={!isSingleSidePackage(selectedPackage) || bookingRole === "groom" || bookingRole === "both"}
                        placeholder="Groom's Phone Number"
                        value={groomPhone}
                        onChange={(e) => setGroomPhone(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Email</label>
                      <input 
                        type="email" 
                        placeholder="groom@example.com"
                        value={groomEmail}
                        onChange={(e) => setGroomEmail(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Address</label>
                      <textarea 
                        rows={2}
                        placeholder="Groom's Address"
                        value={groomAddress}
                        onChange={(e) => setGroomAddress(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Event Schedule Details */}
              <div className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span>📅</span> {isSingleEvent ? (isEngagement ? "Engagement Details" : selectedPackage.toLowerCase().includes("haldi") ? "Haldi Details" : "Event Details") : "Event Schedule Details"}
                </div>
                
                {!isSingleEvent && (
                  <div className="pt-1 pb-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none group">
                      <input 
                        type="checkbox"
                        checked={weddingReceptionMode === "same"}
                        onChange={(e) => setWeddingReceptionMode(e.target.checked ? "same" : "different")}
                        className="w-5 h-5 accent-[#b4975a] border-zinc-300 dark:border-zinc-700 rounded focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        Wedding & Reception are on the same date (Tick for same date)
                      </span>
                    </label>
                  </div>
                )}

                {(isSingleEvent || weddingReceptionMode === "same") ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">
                        {isEngagement ? "Engagement Date *" : selectedPackage.toLowerCase().includes("haldi") ? "Haldi Date *" : "Event Date *"}
                      </label>
                      <input 
                        type="date" 
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        style={{ colorScheme: "light" }}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
                      />
                    </div>
                    <div className={isSingleEvent ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">
                        {isEngagement ? "Engagement Venue *" : selectedPackage.toLowerCase().includes("haldi") ? "Haldi Venue *" : "Event Venue *"}
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder={isEngagement ? "Engagement Venue" : selectedPackage.toLowerCase().includes("haldi") ? "Haldi Venue" : "Event Venue"}
                        value={eventVenue}
                        onChange={(e) => setEventVenue(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                      />
                    </div>
                    {!isSingleEvent && (
                      <div className="space-y-1.5">
                        <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Reception Venue</label>
                        <input 
                          type="text" 
                          placeholder="Reception Venue"
                          value={receptionVenue}
                          onChange={(e) => setReceptionVenue(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">
                        {isSingleEvent ? "Event Time" : "Wedding Time"}
                      </label>
                      <input 
                        type="time" 
                        value={weddingTime}
                        onChange={(e) => setWeddingTime(e.target.value)}
                        style={{ colorScheme: "light" }}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
                      />
                    </div>
                    {!isSingleEvent && (
                      <div className="space-y-1.5">
                        <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">Reception Time</label>
                        <input 
                          type="time" 
                          value={receptionTime}
                          onChange={(e) => setReceptionTime(e.target.value)}
                          style={{ colorScheme: "light" }}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    {/* Wedding Date Info */}
                    <div className="p-4 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
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
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Time</label>
                          <input 
                            type="time" 
                            value={weddingTimeDiff}
                            onChange={(e) => setWeddingTimeDiff(e.target.value)}
                            style={{ colorScheme: "light" }}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
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
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reception Date Info */}
                    <div className="p-4 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                      <span className="text-[9px] text-[#b4975a] font-bold uppercase tracking-wider block">Reception details</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Date</label>
                          <input 
                            type="date" 
                            value={receptionDateDiff}
                            onChange={(e) => setReceptionDateDiff(e.target.value)}
                            style={{ colorScheme: "light" }}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Time</label>
                          <input 
                            type="time" 
                            value={receptionTimeDiff}
                            onChange={(e) => setReceptionTimeDiff(e.target.value)}
                            style={{ colorScheme: "light" }}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Venue</label>
                          <input 
                            type="text" 
                            placeholder="Reception Venue"
                            value={receptionVenueDiff}
                            onChange={(e) => setReceptionVenueDiff(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-light"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>


              {/* SECTION: Wedding Invitation Upload */}
              {!isEngagement && (
                <div className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span>✉️</span> Wedding / Reception Invitation (Optional)
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-zinc-450 dark:text-zinc-400 font-bold uppercase tracking-widest block text-left">Upload Invitation (Optional) (JPG, PNG, PDF)</label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm select-none">
                        Choose File
                        <input 
                          type="file" 
                          accept="image/*,application/pdf"
                          onChange={handleInvitationChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-zinc-500 dark:text-zinc-400 text-xs font-light truncate">
                        {invitationFileName || "No file uploaded (PDF or Images)"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Advance Payment */}
              <div className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span>💳</span> Advance Payment
                </div>
                <div className="space-y-4">
                  <div className="bg-[#b4975a]/10 dark:bg-[#b4975a]/5 border border-[#b4975a]/20 dark:border-[#b4975a]/30 p-4 rounded-xl text-left space-y-1.5 text-zinc-700 dark:text-zinc-350">
                    <span className="block text-[9px] font-bold text-[#b4975a] uppercase tracking-wider">Payment Details</span>
                    <p className="text-xs font-light leading-normal">
                      Please send your advance booking fee of <strong>₹5,000/-</strong> using the credentials below:
                    </p>
                    <div className="text-[10px] font-mono bg-white/60 dark:bg-zinc-900/60 p-2.5 rounded-lg border border-[#b4975a]/10 dark:border-[#b4975a]/25 space-y-1">
                      <div>UPI ID: <strong className="text-zinc-900 dark:text-zinc-100">dreamwedstories@okaxis</strong></div>
                      <div>GPay / PhonePe: <strong className="text-zinc-900 dark:text-zinc-100">+91 99954 12955</strong></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Amount Paying (₹) *</label>
                      <input 
                        type="number" 
                        required
                        placeholder="5000"
                        value={advancePaid}
                        onChange={(e) => setAdvancePaid(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Payment Method *</label>
                      <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none"
                      >
                        <option value="UPI">UPI</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Bank Transfer">Bank/IMPS Transfer</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Transaction ID / Reference No (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Enter 12-digit transaction ID or cash details"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 text-xs focus:border-[#b4975a] focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[8px] text-zinc-400 dark:text-zinc-400 font-bold uppercase tracking-widest block">Upload Payment Screenshot (Optional)</label>
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm select-none">
                          Choose Screenshot
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs font-light truncate">
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
                className="w-full py-4 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl transition-all text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] mt-2"
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
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Booking Request Received</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light leading-relaxed max-w-sm mx-auto">
                  Thank you! Your wedding booking request and advance payment proof (Transaction ID: <span className="font-mono font-medium">{transactionId}</span>) have been received.
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light leading-relaxed max-w-sm mx-auto">
                  Our coordinator is verifying your payment and calendar slot. Once approved, your invoice will generate, and couple credentials will be created.
                </p>
              </div>
              <button 
                onClick={() => {
                  setSignupSuccess(false);
                  setActiveMode("lookup");
                }}
                className="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
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
                className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 p-5 rounded-2xl text-xs space-y-3"
              >
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100">
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
                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 text-red-800 dark:text-red-300 p-5 rounded-2xl text-xs space-y-2"
              >
                <div className="flex items-center gap-2 font-bold text-red-900 dark:text-red-100">
                  <AlertCircle size={16} className="shrink-0 text-red-600" />
                  <span>Connection Issue</span>
                </div>
                <p className="font-light leading-relaxed text-left">{errorMessage}</p>
              </motion.div>
            )}

            {activeMode === "signup" && signupSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                               className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 p-5 rounded-2xl text-xs space-y-2 text-left"
              >
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-100">
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
              className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6"
            >
              <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Client Profile</span>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">{booking.customer_name}</h2>
                  <p className="text-zinc-505 dark:text-zinc-400 text-xs font-light mt-0.5">{booking.customer_email || booking.customer_phone}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</span>
                  {booking.status === "confirmed" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 border border-emerald-200/20 dark:border-emerald-800/30">
                      <CheckCircle size={12} className="fill-emerald-700 stroke-emerald-50" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-450 border border-amber-200/20 dark:border-amber-800/30">
                      <Clock size={12} className="fill-amber-700 stroke-amber-50" />
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>

              {booking.isLocalOnly && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl text-xs space-y-3 text-left text-amber-500">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                    <AlertCircle size={14} className="text-amber-500 shrink-0" />
                    <span>Offline Booking (Local Only)</span>
                  </div>
                  <p className="font-light leading-relaxed text-zinc-700 dark:text-zinc-300">
                    This booking request is currently saved only inside this browser's local memory. The admin cannot view or approve it because it has not been uploaded to our server database.
                  </p>
                  <button
                    onClick={() => handleSyncBooking(booking)}
                    disabled={syncing}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {syncing ? "Uploading to Server..." : "Sync / Upload to Live Server"}
                  </button>
                </div>
              )}

              {/* Event details */}
              <div className="grid grid-cols-2 gap-4 text-xs font-light text-left">
                {booking.wedding_reception_mode === "different" && booking.different_date_details ? (
                  <>
                    <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Wedding Date</span>
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                        <Calendar size={14} className="text-zinc-400" />
                        <span>{formatDate(booking.different_date_details.wedding?.date)}</span>
                      </div>
                    </div>
                    <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Reception Date</span>
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                        <Calendar size={14} className="text-zinc-400" />
                        <span>{formatDate(booking.different_date_details.reception?.date)}</span>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Selected Package</span>
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                        <Gift size={14} className="text-zinc-400" />
                        <span className="truncate">{booking.package_name}</span>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Wedding Venue</span>
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                        <MapPin size={14} className="text-zinc-400 shrink-0" />
                        <span className="line-clamp-1">{booking.different_date_details.wedding?.venue || booking.event_venue}</span>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Reception Venue</span>
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                        <MapPin size={14} className="text-zinc-400 shrink-0" />
                        <span className="line-clamp-1">{booking.different_date_details.reception?.venue || booking.reception_venue}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                        {isSingleEvent ? (isEngagement ? "Engagement Date" : selectedPackage.toLowerCase().includes("haldi") ? "Haldi Date" : "Event Date") : "Wedding Date"}
                      </span>
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                        <Calendar size={14} className="text-zinc-400" />
                        <span>{formatDate(booking.event_date)}</span>
                      </div>
                    </div>

                    <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Selected Package</span>
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                        <Gift size={14} className="text-zinc-400" />
                        <span className="truncate">{booking.package_name}</span>
                      </div>
                    </div>

                    <div className="col-span-2 space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                        {isSingleEvent ? (isEngagement ? "Engagement Venue" : selectedPackage.toLowerCase().includes("haldi") ? "Haldi Venue" : "Event Venue") : "Wedding Venue"}
                      </span>
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                        <MapPin size={14} className="text-zinc-400 shrink-0" />
                        <span className="line-clamp-1">{booking.event_venue}</span>
                      </div>
                    </div>

                    {booking.reception_venue && (
                      <div className="col-span-2 space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                        <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Reception Venue</span>
                        <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                          <MapPin size={14} className="text-zinc-400 shrink-0" />
                          <span className="line-clamp-1">{booking.reception_venue}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Custom Status message mapping user's exact approval condition */}
              {booking.status !== "confirmed" ? (
                <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 p-5 rounded-2xl text-xs space-y-2 text-zinc-700 dark:text-zinc-300 text-left">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wide text-[10px]">
                    <Clock size={14} className="text-amber-600" />
                    <span>Invoice Pending Approval</span>
                  </div>
                  <p className="font-light leading-relaxed">
                    Your wedding booking request is received! However, your invoice details are currently undergoing admin date confirmation. Once approved by our team, your printable brand invoice will be instantly unlocked for download here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 pt-2">
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 p-5 rounded-2xl text-xs space-y-1.5 text-zinc-700 dark:text-zinc-300 text-left">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-wide text-[10px]">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <span>Invoice Unlocked</span>
                    </div>
                    <p className="font-light leading-relaxed">
                      Congratulations! Your wedding booking is approved. Your printable custom brand invoice is locked and ready below.
                    </p>
                  </div>

                  {/* Financial breakdown */}
                  <div className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 p-5 rounded-2xl flex justify-between items-center border dark:border-zinc-800">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-bold">Total Package Price</span>
                      <div className="text-lg font-bold text-white">₹ {formatCurrency(booking.total_price)}</div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-bold">Advance Paid</span>
                      <div className="text-xs font-semibold text-emerald-400">₹ {formatCurrency(booking.advance_paid)}</div>
                    </div>
                    <div className="text-right space-y-0.5 border-l border-zinc-800 dark:border-zinc-800 pl-5">
                      <span className="text-[9px] text-[#b4975a] uppercase tracking-wider font-bold">Remaining Balance</span>
                      <div className="text-base font-bold text-[#b4975a]">₹ {formatCurrency(booking.total_price - booking.advance_paid)}</div>
                    </div>
                  </div>

                  {/* PDF Download Button */}
                  <button 
                    onClick={() => setIsInvoicePrintOpen(true)}
                    className="w-full py-4 bg-[#b4975a] text-zinc-950 font-bold rounded-xl hover:bg-[#c5a86b] active:scale-98 transition-all text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2.5 cursor-pointer font-Montserrat"
                  >
                    <Download size={15} />
                    Download Printable Invoice
                  </button>

                  {/* Private Access Credentials */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-[#b4975a]/25 dark:border-[#b4975a]/45 p-5 rounded-2xl space-y-3.5 text-left mt-4 shadow-sm select-none">
                    <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      <span className="text-base">🔑</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#b4975a]">Couple Client Portal Access Credentials</h4>
                    </div>
                    <p className="text-[11px] text-zinc-550 dark:text-zinc-400 font-light leading-relaxed">
                      Use these private access credentials to log into your wedding dashboard workspace client portal (instead of OTP):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-center">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-400 uppercase tracking-widest font-bold block">👰 Bride Password:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold text-xs">{booking.bride_password || "—"}</span>
                      </div>
                      <div className="bg-white dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-center">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-400 uppercase tracking-widest font-bold block">🤵 Groom Password:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold text-xs">{booking.groom_password || "—"}</span>
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
            <style dangerouslySetInnerHTML={{ __html: `
              .invoice-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #fff;
                color: #000;
                z-index: 10000;
                overflow-y: auto;
                padding: 40px 0;
              }
              .invoice-container {
                width: 800px;
                margin: 0 auto;
                background: #fff;
                padding: 40px;
                font-family: 'Inter', sans-serif;
                position: relative;
                color: #000;
              }
              .invoice-brand {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #eaeaea;
                padding-bottom: 24px;
                margin-bottom: 30px;
              }
              .brand-logo-circle {
                width: 42px;
                height: 42px;
                border: 1.5px solid #000;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 15px;
                font-family: 'Inter', sans-serif;
                color: #000;
              }
              .brand-text-name {
                font-family: 'Montserrat', sans-serif;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: #000;
                margin-left: 10px;
              }
              .invoice-header-title {
                text-align: center;
                margin: 20px 0 25px 0;
              }
              .invoice-header-title h2 {
                font-family: 'Cormorant Garamond', serif;
                font-size: 44px;
                font-weight: 400;
                letter-spacing: 0.02em;
                color: #000;
                font-style: italic;
              }
              .invoice-meta-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                font-size: 13px;
                line-height: 1.7;
              }
              .invoice-to {
                width: 50%;
                text-align: left;
              }
              .invoice-to h3 {
                font-size: 12px;
                font-weight: 700;
                color: #222;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 6px;
              }
              .invoice-to-name {
                font-size: 16px;
                font-weight: 500;
                color: #000;
                margin-bottom: 2px;
              }
              .invoice-to-details {
                color: #444;
                font-size: 12px;
                font-weight: 300;
              }
              .invoice-details-right {
                text-align: right;
                width: 45%;
                font-size: 12px;
              }
              .invoice-details-right table {
                width: 100%;
                border-collapse: collapse;
              }
              .invoice-details-right td {
                padding: 3px 0;
                vertical-align: top;
              }
              .invoice-details-right td.lbl {
                text-align: right;
                color: #444;
                font-weight: 500;
                padding-right: 12px;
              }
              .invoice-details-right td.val {
                text-align: right;
                font-weight: 500;
                color: #000;
                width: 130px;
              }
              .invoice-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                font-size: 12px;
              }
              .invoice-table th {
                background: #b69675;
                color: #fff;
                font-family: 'Montserrat', sans-serif;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                padding: 10px 14px;
                text-align: left;
                font-size: 11px;
              }
              .invoice-table th.amount-col {
                text-align: right;
              }
              .invoice-table td {
                padding: 14px;
                border-bottom: 1px solid #eaeaea;
                color: #333;
                text-align: left;
              }
              .invoice-table td.amount-col {
                text-align: right;
                font-weight: 500;
                color: #000;
              }
              .invoice-summary {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 40px;
                font-size: 13px;
              }
              .invoice-summary-table {
                width: 320px;
                border-collapse: collapse;
              }
              .invoice-summary-table td {
                padding: 5px 0;
                text-align: right;
              }
              .invoice-summary-table td.lbl {
                color: #555;
                font-weight: 500;
              }
              .invoice-summary-table td.val {
                font-weight: 600;
                color: #000;
                width: 120px;
              }
              .invoice-summary-table tr.total-payable-row td {
                border-top: 1.5px solid #000;
                padding-top: 10px;
                font-size: 14px;
                font-weight: 800;
                color: #000;
              }
              .invoice-summary-table tr.total-payable-row td.val {
                font-size: 16px;
              }
              .invoice-footer {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                border-top: 1px solid #eaeaea;
                padding-top: 30px;
                margin-top: 40px;
                font-size: 11px;
                text-align: left;
              }
              .payment-instructions {
                color: #555;
                line-height: 1.6;
              }
              .payment-instructions strong {
                color: #000;
                font-size: 12px;
                display: block;
                margin-bottom: 4px;
              }
              .signature-thankyou {
                text-align: right;
                font-family: 'Cormorant Garamond', serif;
                font-size: 38px;
                font-style: italic;
                font-weight: 400;
                color: #000;
                margin-bottom: 8px;
              }
              .invoice-control-bar {
                background: #161616;
                padding: 12px 24px;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                display: flex;
                justify-content: center;
                gap: 16px;
                border-bottom: 1px solid #2a2a2a;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                z-index: 10001;
              }
              .invoice-control-bar .action-btn {
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 6px;
                border: none;
              }
              @media print {
                body * {
                  visibility: hidden !important;
                }
                .invoice-overlay, .invoice-overlay * {
                  visibility: visible !important;
                }
                .invoice-overlay {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  height: auto !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  background: #fff !important;
                  color: #000 !important;
                }
                .invoice-container {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 10px !important;
                  box-shadow: none !important;
                  border: none !important;
                }
                .no-print {
                  display: none !important;
                }
                .invoice-table th {
                  background: #b69675 !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                  color: #fff !important;
                }
              }
            `}} />
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
                  +91 99954 12955
                </div>
              </div>

              {/* Bold Minimalist Title */}
              <div className="invoice-header-title">
                <h2>Invoice</h2>
              </div>

              {/* Meta details split */}
              <div className="invoice-meta-section">
                <div className="invoice-to">
                  <h3>INVOICE TO:</h3>
                  <div className="invoice-to-name">{booking.customer_name}</div>
                  {booking.customer_address && (
                    <div className="invoice-to-address text-[10px] text-zinc-550 dark:text-zinc-400 font-light mt-0.5 leading-normal max-w-[280px]">
                      📍 Address: {booking.customer_address}
                    </div>
                  )}
                  {booking.customer_address_2 && (
                    <div className="invoice-to-address text-[10px] text-zinc-550 dark:text-zinc-400 font-light mt-0.5 leading-normal max-w-[280px]">
                      📍 Address 2: {booking.customer_address_2}
                    </div>
                  )}
                  <div className="invoice-to-details">
                    <div>{booking.customer_phone}</div>
                    {booking.wedding_reception_mode === "different" && booking.different_date_details ? (
                      <>
                        <div>Wedding: {formatDate(booking.different_date_details.wedding?.date)}</div>
                        <div>Reception: {formatDate(booking.different_date_details.reception?.date)}</div>
                      </>
                    ) : (
                      <div>Date: {formatDate(booking.event_date)}</div>
                    )}
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
                        <td className="lbl">{booking.package_name} Price:</td>
                        <td className="val">₹ {formatCurrency(booking.package_price)}</td>
                      </tr>
                      {booking.package_price > booking.total_price && (
                        <tr>
                          <td className="lbl">Discount:</td>
                          <td className="val">₹ {formatCurrency(booking.package_price - booking.total_price)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sub-header title */}
              <div style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "18px", color: "#000", marginBottom: "25px", fontWeight: "normal" }}>
                Invoice For Photography Service
              </div>

              {/* Milestone items list */}
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>PRODUCT/SERVICE</th>
                    <th className="amount-col" style={{ width: "140px" }}>PRICE</th>
                    <th style={{ width: "150px", paddingLeft: "20px" }}>DATE</th>
                    <th className="amount-col" style={{ width: "140px" }}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.payment_milestones.map((m, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ fontWeight: 500, color: "#000", marginBottom: "2px" }}>{m.label}</div>
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
                  GPay / PhonePe: +91 99954 12955
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
