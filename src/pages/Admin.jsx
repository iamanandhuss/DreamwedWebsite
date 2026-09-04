import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn, LogOut, ShieldCheck, AlertCircle, Link2, Calendar, CheckCircle2, Check,
  ChevronRight, FileText, Package, Users, MessageSquare, Plus, Trash2, Edit3,
  Eye, EyeOff, Save, X, Camera, Video, BookOpen, RefreshCw, Search, Share2,
  Download, Heart, Printer, Coins, Percent, Sliders, ArrowLeft, Copy, Wallet,
  Settings, Moon, Sun, Info, TrendingDown, ArrowUpRight, Upload, Sparkles, Lock, Image as ImageIcon
} from "lucide-react";
import SEO from "../components/SEO";
import { downloadPhotosAsZip } from "../utils/zipDownloader";
import WebsiteMediaManager from "../components/admin/WebsiteMediaManager";

const ADMIN_PASS = "dreamwed2026";
const API_BASE = typeof window !== "undefined"
  ? (localStorage.getItem("dreamwed_api_base") || import.meta.env.VITE_API_BASE_URL || "https://dreamwed-backend.onrender.com")
  : "https://dreamwed-backend.onrender.com";

const INITIAL_GALLERIES = [];

const GALLERY_FONTS = [
  { id: "cormorant", name: "Cormorant", family: "'Cormorant Garamond', serif", label: "Royal Serif" },
  { id: "playfair", name: "Playfair", family: "'Playfair Display', serif", label: "Editorial Serif" },
  { id: "cinzel", name: "Cinzel", family: "'Cinzel', serif", label: "Regal Roman" },
  { id: "greatvibes", name: "Great Vibes", family: "'Great Vibes', cursive", label: "Handwritten" },
  { id: "alexbrush", name: "Alex Brush", family: "'Alex Brush', cursive", label: "Calligraphy" },
  { id: "inter", name: "Inter Sans", family: "'Inter', sans-serif", label: "Clean Modern" }
];

const GALLERY_COLORS = [
  { hex: "#b4975a", name: "Royal Gold" },
  { hex: "#e0a899", name: "Rose Gold" },
  { hex: "#10b981", name: "Emerald" },
  { hex: "#e11d48", name: "Ruby Rose" },
  { hex: "#38bdf8", name: "Sky Celestial" },
  { hex: "#c084fc", name: "Royal Purple" },
  { hex: "#f8fafc", name: "Pearl White" }
];

const formatCurrency = (num) => Number(num || 0).toLocaleString("en-IN");

const getObjectPositionStyle = (val) => {
  if (val === "top" || val === 0 || val === "0") return "center 0%";
  if (val === "bottom" || val === 100 || val === "100") return "center 100%";
  if (val === "center" || val === 50 || val === "50" || !val) return "center 50%";
  const num = Number(String(val).replace("%", ""));
  if (!isNaN(num)) return `center ${num}%`;
  return "center 50%";
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview | projects | staff | chats
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Projects tab state
  const [projects, setProjects] = useState([]);
  const [viewingProof, setViewingProof] = useState(null);
  const [viewingInvitation, setViewingInvitation] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [driveLink, setDriveLink] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [videoDrive1, setVideoDrive1] = useState("");
  const [videoDrive2, setVideoDrive2] = useState("");
  const [videoDrive3, setVideoDrive3] = useState("");
  const [videoDrive4, setVideoDrive4] = useState("");
  const [bookings, setBookings] = useState([]);
  const [isOffline, setIsOffline] = useState(false);

  // Staff tab state
  const [staffUsers, setStaffUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ username: "", password: "", role: "editor", display_name: "" });
  const [staffSaving, setStaffSaving] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // staff user being edited
  const [showPassId, setShowPassId] = useState(null); // id of staff whose password is visible
  const [assigningStaffId, setAssigningStaffId] = useState(null); // staff id being assigned

  // Client management tab state
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearch, setClientSearch] = useState("");
  const [editBridePassword, setEditBridePassword] = useState("");
  const [editGroomPassword, setEditGroomPassword] = useState("");
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState(null);
  const [activeClientPhotoTab, setActiveClientPhotoTab] = useState("bride"); // bride | groom | matches
  const [selectedClientTab, setSelectedClientTab] = useState("details"); // details | passwords | photos | billing
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [clientFormSaving, setClientFormSaving] = useState(false);
  const [newClientFormData, setNewClientFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
    pincode: "",
    coverage_scope: "both",
    package_name: "",
    package_price: "",
    advance_paid: "",
    event_date: "",
    event_venue: "",
    wedding_reception_mode: "same",
    different_date_details: {
      wedding: { date: "", venue: "" },
      reception: { date: "", venue: "" }
    },
    need_drone: "no",
    need_cinematic: "no",
    preferred_album_size: "12x18",
    special_notes: "",
    custom_bride_password: "",
    custom_groom_password: "",
    show_secondary: false,
    customer_name_2: "",
    customer_phone_2: "",
    customer_email_2: "",
    customer_address_2: ""
  });

  // Chats tab state
  const [chatProject, setChatProject] = useState(null);
  const [chatChannel, setChatChannel] = useState("client-admin");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Dreamwed Galleries & Orders state
  const [aiGalleries, setAiGalleries] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch (e) {
      return [];
    }
  });
  const [aiOrders, setAiOrders] = useState([]);
  const [newGroomName, setNewGroomName] = useState("");
  const [newBrideName, setNewBrideName] = useState("");
  const [newGalName, setNewGalName] = useState("");
  const [newWeddingDate, setNewWeddingDate] = useState("");
  const [newWeddingLocation, setNewWeddingLocation] = useState("");
  const [newLoginMode, setNewLoginMode] = useState("two_code_mode");
  const [newSelectionCode, setNewSelectionCode] = useState(() => {
    return String(Math.floor(5000 + Math.random() * 4000));
  });
  const [newGuestCode, setNewGuestCode] = useState(() => {
    return String(Math.floor(1000 + Math.random() * 4000));
  });
  const [newBrideCode, setNewBrideCode] = useState("");
  const [newGroomCode, setNewGroomCode] = useState("");
  const [newGalDrive, setNewGalDrive] = useState("");
  const [newGalExtraDrive, setNewGalExtraDrive] = useState("");
  const [newGalCover, setNewGalCover] = useState("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800");
  const [newGalCoverAlign, setNewGalCoverAlign] = useState("center"); // 'top' | 'center' | 'bottom'
  const [newGalCoverTextAlign, setNewGalCoverTextAlign] = useState("center"); // 'left' | 'center' | 'right'
  const [newGalCoverFont, setNewGalCoverFont] = useState("cormorant");
  const [newGalCoverColor, setNewGalCoverColor] = useState("#b4975a");
  const [coverInputMode, setCoverInputMode] = useState("upload");
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  
  // AI Story & Curation Modal states
  const [aiStoryModalGal, setAiStoryModalGal] = useState(null);
  const [isRecurating, setIsRecurating] = useState(false);
  const [curationProgress, setCurationProgress] = useState(null);
  
  // Edit modal states
  const [editingCoverGallery, setEditingCoverGallery] = useState(null);
  const [editCoverValue, setEditCoverValue] = useState("");
  const [editCoverMode, setEditCoverMode] = useState("upload");
  const [editCoverAlign, setEditCoverAlign] = useState("center");
  const [editCoverTextAlign, setEditCoverTextAlign] = useState("center");
  const [editCoverFont, setEditCoverFont] = useState("cormorant");
  const [editCoverColor, setEditCoverColor] = useState("#b4975a");

  const [selectedGalForPhotos, setSelectedGalForPhotos] = useState(null);
  const [selectedPhotosModalData, setSelectedPhotosModalData] = useState(null);
  const [adminSelectedFilter, setAdminSelectedFilter] = useState("all");
  const [bulkPhotoUrls, setBulkPhotoUrls] = useState("");
  const [syncingGalId, setSyncingGalId] = useState(null);
  const [zippingState, setZippingState] = useState(null);

  // Dreamwed Office states
  const [officeBudgets, setOfficeBudgets] = useState([]);
  const [officeInvoices, setOfficeInvoices] = useState([]);
  const [officeSettings, setOfficeSettings] = useState({
    photoCharge: 15000,
    videoCharge: 20000,
    albumCoverCharge: 2000,
    albumLeafCharge: 75,
    albumDesigningCharge: 300,
    videoEditingCharge: 8000,
    pendriveCharge: 500
  });
  
  // Budget Tracker workspace states
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgetSearch, setBudgetSearch] = useState("");
  const [budgetSort, setBudgetSort] = useState("newest");
  const [budgetEditorTab, setBudgetEditorTab] = useState("basics");
  
  // Invoice Studio workspace states
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceTaxRate, setInvoiceTaxRate] = useState(0); // 0 or 18
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchOfficeData = async () => {
    try {
      const [budgetsRes, invoicesRes, settingsRes] = await Promise.all([
        fetch(`${API_BASE}/api/office/budgets`),
        fetch(`${API_BASE}/api/office/invoices`),
        fetch(`${API_BASE}/api/office/settings`)
      ]);
      if (budgetsRes.ok) setOfficeBudgets(await budgetsRes.ok ? await budgetsRes.json() : []);
      if (invoicesRes.ok) setOfficeInvoices(await invoicesRes.ok ? await invoicesRes.json() : []);
      if (settingsRes.ok) setOfficeSettings(await settingsRes.ok ? await settingsRes.json() : {
        photoCharge: 15000,
        videoCharge: 20000,
        albumCoverCharge: 2000,
        albumLeafCharge: 75,
        albumDesigningCharge: 300,
        videoEditingCharge: 8000,
        pendriveCharge: 500
      });
    } catch (e) {
      console.error("Error fetching office data, loading from localStorage:", e);
      setOfficeBudgets(JSON.parse(localStorage.getItem("vows_and_values_events") || "[]"));
      setOfficeInvoices(JSON.parse(localStorage.getItem("dreamwed_saved_invoices") || "[]"));
      setOfficeSettings(JSON.parse(localStorage.getItem("vows_and_values_default_rates") || JSON.stringify({
        photoCharge: 15000,
        videoCharge: 20000,
        albumCoverCharge: 2000,
        albumLeafCharge: 75,
        albumDesigningCharge: 300,
        videoEditingCharge: 8000,
        pendriveCharge: 500
      })));
    }
  };

  const saveOfficeBudgetAPI = async (budget) => {
    try {
      const res = await fetch(`${API_BASE}/api/office/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget)
      });
      if (res.ok) {
        const saved = await res.json();
        const updated = officeBudgets.some(b => b.id === saved.id)
          ? officeBudgets.map(b => b.id === saved.id ? saved : b)
          : [saved, ...officeBudgets];
        setOfficeBudgets(updated);
        localStorage.setItem("vows_and_values_events", JSON.stringify(updated));
        return saved;
      }
    } catch (e) {
      console.error("Error saving budget, saving locally:", e);
      const updated = officeBudgets.some(b => b.id === budget.id)
        ? officeBudgets.map(b => b.id === budget.id ? budget : b)
        : [budget, ...officeBudgets];
      setOfficeBudgets(updated);
      localStorage.setItem("vows_and_values_events", JSON.stringify(updated));
      return budget;
    }
  };

  const deleteOfficeBudgetAPI = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/office/budgets/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const updated = officeBudgets.filter(b => b.id !== id);
        setOfficeBudgets(updated);
        localStorage.setItem("vows_and_values_events", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Error deleting budget, deleting locally:", e);
      const updated = officeBudgets.filter(b => b.id !== id);
      setOfficeBudgets(updated);
      localStorage.setItem("vows_and_values_events", JSON.stringify(updated));
    }
  };

  const saveOfficeInvoiceAPI = async (invoice) => {
    try {
      const res = await fetch(`${API_BASE}/api/office/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice)
      });
      if (res.ok) {
        const saved = await res.json();
        const updated = officeInvoices.some(i => i.invoiceNo === saved.invoiceNo || i.id === saved.id)
          ? officeInvoices.map(i => (i.invoiceNo === saved.invoiceNo || i.id === saved.id) ? saved : i)
          : [saved, ...officeInvoices];
        setOfficeInvoices(updated);
        localStorage.setItem("dreamwed_saved_invoices", JSON.stringify(updated));
        return saved;
      }
    } catch (e) {
      console.error("Error saving invoice, saving locally:", e);
      const updated = officeInvoices.some(i => i.invoiceNo === invoice.invoiceNo || i.id === invoice.id)
        ? officeInvoices.map(i => (i.invoiceNo === invoice.invoiceNo || i.id === invoice.id) ? invoice : i)
        : [invoice, ...officeInvoices];
      setOfficeInvoices(updated);
      localStorage.setItem("dreamwed_saved_invoices", JSON.stringify(updated));
      return invoice;
    }
  };

  const deleteOfficeInvoiceAPI = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/office/invoices/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const updated = officeInvoices.filter(i => i.invoiceNo !== id && i.id !== id);
        setOfficeInvoices(updated);
        localStorage.setItem("dreamwed_saved_invoices", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Error deleting invoice, deleting locally:", e);
      const updated = officeInvoices.filter(i => i.invoiceNo !== id && i.id !== id);
      setOfficeInvoices(updated);
      localStorage.setItem("dreamwed_saved_invoices", JSON.stringify(updated));
    }
  };

  const saveOfficeSettingsAPI = async (settings) => {
    try {
      const res = await fetch(`${API_BASE}/api/office/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const saved = await res.json();
        setOfficeSettings(saved);
        localStorage.setItem("vows_and_values_default_rates", JSON.stringify(saved));
        return saved;
      }
    } catch (e) {
      console.error("Error saving settings, saving locally:", e);
      setOfficeSettings(settings);
      localStorage.setItem("vows_and_values_default_rates", JSON.stringify(settings));
      return settings;
    }
  };

  // ==========================================================
  // DREAMWED OFFICE CORE FINANCIAL CALCULATIONS
  // ==========================================================
  const calculateBudgetFinancials = (b) => {
    if (!b) return {};
    const travelCharge = Number(b.travelCharge) || 0;
    const stayExpense = Number(b.stayExpense) || 0;
    const foodExpense = Number(b.foodExpense) || 0;
    const droneCharge = Number(b.droneCharge) || 0;
    const videoEditingCharge = Number(b.videoEditingCharge) || 0;
    const pendriveCharge = Number(b.pendriveCharge) || 0;
    
    const logisticsExpense = (b.travelPaidByCustomer ? 0 : travelCharge) + stayExpense + foodExpense;
    const crewPhotoExpense = (b.photographers || []).reduce((sum, p) => sum + (Number(p.charge) || 0), 0);
    const crewVideoExpense = (b.videographers || []).reduce((sum, v) => sum + (Number(v.charge) || 0), 0);
    const crewExpense = crewPhotoExpense + crewVideoExpense + droneCharge;
    
    const stdPhotoCharge = Number(b.stdPhotoCharge) || 0;
    const stdVideoCharge = Number(b.stdVideoCharge) || 0;
    const stdPerPhotoCharge = Number(b.stdPerPhotoCharge) || 0;
    const stdPhotoQty = Number(b.stdPhotoQty) || 0;
    const stdEditingCharge = Number(b.stdEditingCharge) || 0;
    const stdExpense = stdPhotoCharge + stdVideoCharge + (stdPhotoQty * stdPerPhotoCharge) + stdEditingCharge;
    
    const albumQty = Number(b.albumQty) || 0;
    const albumCoverCharge = Number(b.albumCoverCharge) || 0;
    const albumLeafs = Number(b.albumLeafs) || 0;
    const albumLeafCharge = Number(b.albumLeafCharge) || 0;
    const albumDesigningCharge = Number(b.albumDesigningCharge) || 0;
    
    const albumPrintingExpense = albumQty * (albumCoverCharge + (albumLeafs * albumLeafCharge));
    const albumDesigningExpense = albumQty * albumLeafs * albumDesigningCharge;
    const albumExpense = albumPrintingExpense + albumDesigningExpense;
    
    const framesExpense = (b.frames || []).reduce((sum, f) => sum + ((Number(f.qty) || 0) * (Number(f.charge) || 0)), 0);
    const mediaExpense = videoEditingCharge + pendriveCharge;
    const customExpense = (b.customExpenses || []).reduce((sum, c) => sum + (Number(c.charge) || 0), 0);
    
    const totalExpense = logisticsExpense + crewExpense + stdExpense + albumExpense + framesExpense + mediaExpense + customExpense;
    
    let packagePrice = Number(b.packagePrice) || 0;
    let netProfit = 0;
    
    if (b.budgetMode === 'inverse') {
      netProfit = Number(b.targetProfit) || 0;
      packagePrice = netProfit + totalExpense;
    } else {
      netProfit = packagePrice - totalExpense;
    }
    
    const marginPercent = packagePrice > 0 ? Math.round((netProfit / packagePrice) * 100) : 0;
    
    const myPhotoFees = (b.photographers || []).reduce((sum, p) => sum + (p.isMe ? (Number(p.charge) || 0) : 0), 0);
    const myVideoFees = (b.videographers || []).reduce((sum, v) => sum + (v.isMe ? (Number(v.charge) || 0) : 0), 0);
    const myStdPhotoFees = b.stdPhotoIsMe ? stdPhotoCharge : 0;
    const myStdVideoFees = b.stdVideoIsMe ? stdVideoCharge : 0;
    const myTotalEarnings = netProfit + myPhotoFees + myVideoFees + myStdPhotoFees + myStdVideoFees;
    
    return {
      packagePrice,
      logisticsExpense,
      crewExpense,
      stdExpense,
      albumExpense,
      framesExpense,
      mediaExpense,
      customExpense,
      totalExpense,
      netProfit,
      marginPercent,
      myTotalEarnings
    };
  };

  // Budget Tracker helper actions
  const handleCreateNewBudget = () => {
    const name = prompt("Enter Client / Couple Name:", "Couple Name");
    if (!name) return;
    const location = prompt("Enter Venue / Location City:", "Location");
    if (!location) return;
    
    const newB = {
      id: "_" + Math.random().toString(36).substr(2, 9),
      clientName: name,
      date: "",
      location: location,
      packagePrice: 125000,
      travelCharge: 0,
      travelPaidByCustomer: false,
      stayExpense: 0,
      foodExpense: 0,
      budgetMode: "standard",
      targetProfit: 0,
      photographers: [
        { id: "_" + Math.random().toString(36).substr(2, 9), name: "Photographer 1", charge: officeSettings.photoCharge, isMe: false }
      ],
      videographers: [
        { id: "_" + Math.random().toString(36).substr(2, 9), name: "Cinematographer 1", charge: officeSettings.videoCharge, isMe: false }
      ],
      droneCharge: 0,
      stdPhotoCharge: 0,
      stdVideoCharge: 0,
      stdPerPhotoCharge: 0,
      stdPhotoQty: 0,
      stdEditingCharge: 0,
      stdPhotoIsMe: false,
      stdVideoIsMe: false,
      albumQty: 1,
      albumCoverCharge: officeSettings.albumCoverCharge,
      albumLeafs: 30,
      albumLeafCharge: officeSettings.albumLeafCharge,
      albumDesigningCharge: officeSettings.albumDesigningCharge,
      frames: [],
      customExpenses: [],
      eventsList: [
        { id: "_" + Math.random().toString(36).substr(2, 9), name: "Wedding Ceremony", date: "" }
      ],
      videoEditingCharge: officeSettings.videoEditingCharge,
      pendriveCharge: officeSettings.pendriveCharge,
      includeHdHighlight: true,
      includeReel: true,
      includeFullHd: true,
      include2Frames: true,
      createdAt: new Date().toISOString()
    };
    saveOfficeBudgetAPI(newB);
    setSelectedBudget(newB);
    setBudgetEditorTab("basics");
  };

  const handleSaveBudget = async (b) => {
    await saveOfficeBudgetAPI(b);
    alert("✨ Wedding Budget Planner saved successfully!");
    setSelectedBudget(null);
  };

  const handleDeleteBudget = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this wedding budget?")) return;
    await deleteOfficeBudgetAPI(id);
  };

  const handleDuplicateBudget = async (b) => {
    const cloned = JSON.parse(JSON.stringify(b));
    cloned.id = "_" + Math.random().toString(36).substr(2, 9);
    cloned.clientName = b.clientName + " (Copy)";
    cloned.createdAt = new Date().toISOString();
    
    // regenerate IDs for subitems
    (cloned.photographers || []).forEach(p => p.id = "_" + Math.random().toString(36).substr(2, 9));
    (cloned.videographers || []).forEach(v => v.id = "_" + Math.random().toString(36).substr(2, 9));
    (cloned.frames || []).forEach(f => f.id = "_" + Math.random().toString(36).substr(2, 9));
    (cloned.customExpenses || []).forEach(c => c.id = "_" + Math.random().toString(36).substr(2, 9));
    (cloned.eventsList || []).forEach(ev => ev.id = "_" + Math.random().toString(36).substr(2, 9));
    
    await saveOfficeBudgetAPI(cloned);
  };

  const handleExportBudgets = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(officeBudgets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dreamwed_budgets_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBudgets = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          for (let budget of parsed) {
            await saveOfficeBudgetAPI(budget);
          }
          alert("✨ Imported budgets successfully!");
        } else {
          alert("Invalid JSON structure: file must contain a budget array.");
        }
      } catch (err) {
        alert("Failed to parse JSON file: " + err.message);
      }
    };
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const updateBudgetField = (field, val) => {
    setSelectedBudget({ ...selectedBudget, [field]: val });
  };

  const updateBudgetEventItem = (index, field, val) => {
    const updated = [...(selectedBudget.eventsList || [])];
    updated[index] = { ...updated[index], [field]: val };
    setSelectedBudget({ ...selectedBudget, eventsList: updated });
  };

  const handleAddEventToBudget = () => {
    const updated = [...(selectedBudget.eventsList || [])];
    updated.push({ id: "_" + Math.random().toString(36).substr(2, 9), name: "", date: "" });
    setSelectedBudget({ ...selectedBudget, eventsList: updated });
  };

  const handleRemoveEventFromBudget = (index) => {
    const updated = (selectedBudget.eventsList || []).filter((_, idx) => idx !== index);
    setSelectedBudget({ ...selectedBudget, eventsList: updated });
  };

  const updateCrewMember = (listType, index, field, val) => {
    const updated = [...(selectedBudget[listType] || [])];
    updated[index] = { ...updated[index], [field]: val };
    setSelectedBudget({ ...selectedBudget, [listType]: updated });
  };

  const handleAddCrewMember = (listType) => {
    const updated = [...(selectedBudget[listType] || [])];
    if (listType === "photographers") {
      updated.push({ id: "_" + Math.random().toString(36).substr(2, 9), name: "Photographer Name", charge: officeSettings.photoCharge, isMe: false });
    } else if (listType === "videographers") {
      updated.push({ id: "_" + Math.random().toString(36).substr(2, 9), name: "Cinematographer Name", charge: officeSettings.videoCharge, isMe: false });
    } else if (listType === "frames") {
      updated.push({ id: "_" + Math.random().toString(36).substr(2, 9), size: "12x18", qty: 1, charge: 2500 });
    } else if (listType === "customExpenses") {
      updated.push({ id: "_" + Math.random().toString(36).substr(2, 9), name: "Add-on Expense", charge: 1000 });
    }
    setSelectedBudget({ ...selectedBudget, [listType]: updated });
  };

  const handleRemoveCrewMember = (listType, index) => {
    const updated = (selectedBudget[listType] || []).filter((_, idx) => idx !== index);
    setSelectedBudget({ ...selectedBudget, [listType]: updated });
  };

  const handlePrintBudgetReport = (b) => {
    window.print();
  };

  // Invoice Studio actions
  const handleCreateBlankInvoice = () => {
    const yr = new Date().getFullYear();
    const rand = String(Math.floor(100 + Math.random() * 900));
    
    setSelectedInvoice({
      id: `inv_${Date.now()}`,
      clientName: "CLIENT COUPLE NAME",
      venue: "Venue & Location City",
      phone: "+91 99954 12955",
      invoiceNo: `DW-${yr}-${rand}`,
      discount: 0,
      advance: 0,
      savedAt: new Date().toISOString(),
      items: [
        { id: "1", label: "Wedding Candid Photography & Cinematic Film Coverage", price: 100000, date: "Event Date" },
        { id: "2", label: "Luxury Leatherette Wedding Album (30 Sheets) & Designing", price: 25000, date: "On Delivery" }
      ]
    });
  };

  const handleConvertBudgetToInvoice = (b) => {
    const yr = new Date().getFullYear();
    const rand = String(Math.floor(100 + Math.random() * 900));
    const financials = calculateBudgetFinancials(b);
    
    // milestone distributions logic
    let items = [];
    let numPhoto = (b.photographers || []).length;
    let numVideo = (b.videographers || []).length;
    
    let photoLabel = "Wedding Photography & Cinematic Film Coverage";
    if (numPhoto > 0 || numVideo > 0) {
      photoLabel = `Comprehensive Wedding Coverage (${numPhoto} Photographers, ${numVideo} Cinematographers)`;
    }

    let allocatedTotal = 0;

    // albums
    let albumCost = (Number(b.albumCoverCharge) || 0) + (Number(b.albumLeafs) || 0) * (Number(b.albumLeafCharge) || 0) + (Number(b.albumDesigningCharge) || 0);
    if (albumCost > 0 || Number(b.albumQty) > 0) {
      if (albumCost === 0) albumCost = 20000;
      items.push({
        id: Math.random().toString(),
        label: `Luxury Leatherette Wedding Album (${b.albumQty || 1} Album, ${b.albumLeafs || 30} Sheets) & Layout Design`,
        price: Math.round(albumCost),
        date: "On Album Delivery"
      });
      allocatedTotal += Math.round(albumCost);
    }

    // frames
    if (b.frames && b.frames.length > 0) {
      let frameCost = b.frames.reduce((sum, f) => sum + ((Number(f.qty) || 0) * (Number(f.charge) || 0)), 0);
      const frameDesc = b.frames.map(f => `${f.qty}x [${f.size}]`).join(', ');
      items.push({
        id: Math.random().toString(),
        label: `Wall Mount Framed Keepsakes & Prints (${frameDesc})`,
        price: Math.round(frameCost),
        date: "With Deliverables"
      });
      allocatedTotal += Math.round(frameCost);
    }

    // video editing
    let videoEditCost = (Number(b.videoEditingCharge) || 0) + (Number(b.pendriveCharge) || 0);
    if (videoEditCost > 0 || b.includeHdHighlight || b.includeReel || b.includeFullHd) {
      if (videoEditCost === 0) videoEditCost = 15000;
      items.push({
        id: Math.random().toString(),
        label: "HD Wedding Cinematic Highlights, Social Reels & USB Flash Drive Post-Production",
        price: Math.round(videoEditCost),
        date: "Post-Production"
      });
      allocatedTotal += Math.round(videoEditCost);
    }

    // save the date
    if (Number(b.stdPhotoCharge) > 0 || Number(b.stdVideoCharge) > 0) {
      let stdCost = (Number(b.stdPhotoCharge) || 0) + (Number(b.stdVideoCharge) || 0) + (Number(b.stdEditingCharge) || 0);
      items.push({
        id: Math.random().toString(),
        label: "Pre-Wedding Outdoor Photography & Cinematic Film Suite",
        price: Math.round(stdCost),
        date: "Prior to Wedding"
      });
      allocatedTotal += Math.round(stdCost);
    }

    // primary coverage
    let primaryPrice = financials.packagePrice - allocatedTotal;
    if (primaryPrice <= 0) primaryPrice = Math.round(financials.packagePrice * 0.65);

    items.unshift({
      id: Math.random().toString(),
      label: photoLabel,
      price: Math.round(primaryPrice),
      date: b.date || "Event Date"
    });

    setSelectedInvoice({
      id: `inv_${Date.now()}`,
      clientName: (b.clientName || "").toUpperCase(),
      venue: b.location || "Venue TBD",
      phone: "+91 99954 12955",
      invoiceNo: `DW-${yr}-${rand}`,
      discount: 0,
      advance: 0,
      savedAt: new Date().toISOString(),
      items: items
    });
  };

  const handleParseProposalText = () => {
    const pastedText = document.getElementById("pasted-proposal-text")?.value || "";
    if (!pastedText.trim()) {
      alert("Please paste proposal description text first!");
      return;
    }

    let clientName = "PROPOSAL CLIENT";
    let venue = "Venue Location";
    let price = 125000;

    const priceMatches = pastedText.match(/(?:₹|Rs\.?|INR)\s*([0-9,]+)/i) || pastedText.match(/([1-9][0-9]{4,6})/);
    if (priceMatches && priceMatches[1]) {
      const p = parseInt(priceMatches[1].replace(/,/g, ''));
      if (p > 10000) price = p;
    }

    const matchedBudget = officeBudgets.find(b => 
      pastedText.toLowerCase().includes((b.clientName || "").toLowerCase())
    );

    if (matchedBudget) {
      handleConvertBudgetToInvoice(matchedBudget);
      alert(`✨ Matched proposal text and converted from budget planner for: ${matchedBudget.clientName}`);
      return;
    }

    setSelectedInvoice({
      id: `inv_${Date.now()}`,
      clientName: clientName.toUpperCase(),
      venue: venue,
      phone: "+91 99954 12955",
      invoiceNo: `DW-${new Date().getFullYear()}-${Math.floor(100+Math.random()*900)}`,
      discount: 0,
      advance: 0,
      savedAt: new Date().toISOString(),
      items: [
        { id: "1", label: "Wedding Photography & Cinematic Film Suite Coverage", price: Math.round(price * 0.75), date: "Event Date" },
        { id: "2", label: "Premium Leatherette Wedding Keepsake Albums", price: Math.round(price * 0.25), date: "On Delivery" }
      ]
    });
  };

  const processUploadedPdf = async (file) => {
    setIsPdfLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const pdfjsLib = await new Promise((resolve, reject) => {
        if (window.pdfjsLib) return resolve(window.pdfjsLib);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        };
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });

      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      let extractedText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        extractedText += content.items.map(item => item.str).join("\n") + "\n";
      }

      let clientName = file.name.replace(/\.[^/.]+$/, "").replace(/dreamwed|proposal|invoice|budget|_|-/gi, " ").trim();
      if (!clientName) clientName = "Estimated Client";
      let venue = "Venue / Location";
      let price = 125000;
      let items = [];

      // 1. Check if any budget project matches this filename or text
      const match = officeBudgets.find(b => 
        clientName.toLowerCase().includes((b.clientName || "").toLowerCase()) || 
        (b.clientName || "").toLowerCase().includes(clientName.toLowerCase()) ||
        (extractedText && extractedText.toLowerCase().includes((b.clientName || "").toLowerCase()))
      );
      if (match) {
        handleConvertBudgetToInvoice(match);
        alert(`✨ Automatically matched Proposal PDF with saved budget for ${match.clientName}!`);
        setIsPdfLoading(false);
        return;
      }

      // 2. Parse lines from PDF text
      if (extractedText) {
        // Try to find price numbers in text
        const priceMatches = extractedText.match(/(?:₹|Rs\.?|INR)\s*([0-9,]+)/i) || extractedText.match(/([1-9][0-9]{4,6})/);
        if (priceMatches && priceMatches[1]) {
          const p = parseInt(priceMatches[1].replace(/,/g, ''));
          if (p > 10000) price = p;
        }

        // Look for known locations or names
        const lines = extractedText.split("\n").map(l => l.trim()).filter(Boolean);
        lines.forEach(line => {
          if (line.toLowerCase().includes('wedding') || line.toLowerCase().includes('candid') || line.toLowerCase().includes('film') || line.toLowerCase().includes('album') || line.toLowerCase().includes('drone')) {
            if (line.length > 5 && line.length < 90) {
              items.push({
                id: Math.random().toString(),
                label: line,
                price: Math.round(price / (items.length + 1)),
                date: 'Event Milestone'
              });
            }
          }
        });
      }

      // Fallback items if none found
      if (items.length === 0) {
        items = [
          { id: '1', label: `Wedding Photography & Cinematic Film Suite (${clientName.toUpperCase()})`, price: Math.round(price * 0.75), date: 'Event Date' },
          { id: '2', label: 'Luxury Leatherette Photo Album (30 Sheets) & Designing', price: Math.round(price * 0.25), date: 'Post-Wedding Delivery' }
        ];
      }

      setSelectedInvoice({
        id: `inv_${Date.now()}`,
        clientName: clientName.toUpperCase(),
        venue: venue,
        phone: "+91 99954 12955",
        invoiceNo: `DW-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`,
        discount: 0,
        advance: 0,
        savedAt: new Date().toISOString(),
        items: items
      });
      alert(`📄 PDF Converted! Review & edit your invoice below.`);
    } catch (e) {
      console.error("PDF Parsing failed:", e);
      alert("Failed to parse PDF file. Please copy-paste text or start a blank invoice instead.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleSaveInvoice = async (inv) => {
    await saveOfficeInvoiceAPI(inv);
    alert("✨ Custom Tax Invoice saved successfully!");
    setSelectedInvoice(null);
  };

  const handleDeleteInvoice = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this invoice draft?")) return;
    await deleteOfficeInvoiceAPI(id);
  };

  const handlePrintInvoice = (inv) => {
    window.print();
  };

  // Check auth on mount
  useEffect(() => {
    if (localStorage.getItem("dreamwed_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchStaff();
      fetchBookings();
      fetchOfficeData();
      fetchGalleries();

      // Load AI orders (local storage) and galleries
      const storedOrds = JSON.parse(localStorage.getItem("dreamwed_orders") || "[]");
      setAiOrders(storedOrds);

      // Auto-poll for new booking requests, projects, and galleries every 15 seconds
      const bookingPoller = setInterval(() => {
        fetchBookings();
        fetchProjects();
        fetchOfficeData();
        fetchGalleries();
      }, 15000);
      return () => clearInterval(bookingPoller);
    }
  }, [isAuthenticated]);

  // Sync editor fields when project is selected
  useEffect(() => {
    if (selectedProject) {
      setDriveLink(selectedProject.deliveries?.raw_photos_url || "");
      setDeadlineDate(selectedProject.deadline_date || "");
      setVideoDrive1(selectedProject.deliveries?.raw_video_drive_url_1 || "");
      setVideoDrive2(selectedProject.deliveries?.raw_video_drive_url_2 || "");
      setVideoDrive3(selectedProject.deliveries?.raw_video_drive_url_3 || "");
      setVideoDrive4(selectedProject.deliveries?.raw_video_drive_url_4 || "");
    }
  }, [selectedProject]);

  // Load chats when chatProject or chatChannel changes
  useEffect(() => {
    if (chatProject && isAuthenticated) {
      loadChats();
    }
  }, [chatProject, chatChannel]);

  const fetchGalleries = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/galleries`);
      if (res.ok) {
        const remoteData = await res.json();
        if (Array.isArray(remoteData)) {
          setAiGalleries(remoteData);
          try { localStorage.setItem("dreamwed_galleries", JSON.stringify(remoteData)); } catch (e) {}
          return;
        }
      }
      throw new Error("Invalid response from server");
    } catch (e) {
      console.warn("Using local galleries fallback:", e);
      try {
        const stored = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
        setAiGalleries(Array.isArray(stored) ? stored : []);
      } catch (err) {
        setAiGalleries([]);
      }
    }
  };

  const handleSyncDrivePhotos = async (id) => {
    setSyncingGalId(id);
    try {
      const res = await fetch(`${API_BASE}/api/galleries/${id}/sync`, {
        method: "POST"
      });
      if (res.ok) {
        alert("🔄 Photos synchronized successfully from Google Drive!");
        await fetchGalleries();
      } else {
        const errData = await res.json();
        alert(`⚠️ Sync failed: ${errData.error || "no photos found"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server connection error during sync");
    } finally {
      setSyncingGalId(null);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        setIsOffline(false);
        if (data.length > 0 && !selectedProject) {
          setSelectedProject(data[0]);
        } else if (selectedProject) {
          const updatedSelected = data.find(p => p.id === selectedProject.id);
          if (updatedSelected) setSelectedProject(updatedSelected);
        }
        if (!chatProject && data.length > 0) {
          setChatProject(data[0]);
        }
      } else {
        throw new Error("Server error");
      }
    } catch (e) {
      console.error("Error fetching projects, falling back locally:", e);
      const localProjects = JSON.parse(localStorage.getItem("dreamwed_projects") || "[]");
      setProjects(localProjects);
      setIsOffline(true);
      if (localProjects.length > 0 && !selectedProject) {
        setSelectedProject(localProjects[0]);
      } else if (selectedProject) {
        const updatedSelected = localProjects.find(p => p.id === selectedProject.id);
        if (updatedSelected) setSelectedProject(updatedSelected);
      }
      if (!chatProject && localProjects.length > 0) {
        setChatProject(localProjects[0]);
      }
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/staff`);
      if (res.ok) {
        setStaffUsers(await res.json());
      } else {
        throw new Error("Server error");
      }
    } catch (e) {
      console.error("Error fetching staff, falling back locally:", e);
      const localStaff = JSON.parse(localStorage.getItem("dreamwed_staff") || JSON.stringify([
        { id: 1, username: "designer", display_name: "Lead Album Designer", role: "designer", assigned_projects: [2, 3] },
        { id: 2, username: "editor", display_name: "Lead Video Editor", role: "editor", assigned_projects: [2, 3] }
      ]));
      if (!localStorage.getItem("dreamwed_staff")) {
        localStorage.setItem("dreamwed_staff", JSON.stringify(localStaff));
      }
      setStaffUsers(localStaff);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings`);
      if (res.ok) {
        setBookings(await res.json());
        setIsOffline(false);
      } else {
        throw new Error("Server error");
      }
    } catch (e) {
      console.error("Error fetching bookings, falling back locally:", e);
      const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
      setBookings(localBookings);
      setIsOffline(true);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/confirm`, {
        method: "POST"
      });
      if (res.ok) {
        const confirmedBooking = await res.json();
        
        // Post logs to server
        const logs = [
          `Booking status confirmed, invoice DW2026-${String(bookingId).padStart(3, '0')} generated successfully with status: Verified`,
          "Automatically scheduled Wedding & Reception slots in Google Calendar",
          "Created workspace folders: RAW, Edited, SaveTheDate, Wedding, Reception, Album_Selected, Album_Design, Final_Delivery"
        ];
        for (const act of logs) {
          await fetch(`${API_BASE}/api/projects/${bookingId}/logs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: "System", action: act })
          }).catch(() => null);
        }

        const isBoth = confirmedBooking.coverage_type === 'both' || confirmedBooking.coverage_scope === 'both';
        const loginMsg = isBoth
          ? `Bride: ${confirmedBooking.bride_password}\nGroom: ${confirmedBooking.groom_password}`
          : `Login: ${confirmedBooking.groom_password}`;
        alert(`✅ Booking approved successfully! The client can now log in.\n${loginMsg}`);
        await fetchBookings();
        await fetchProjects();
      } else {
        throw new Error("Server confirm failed");
      }
    } catch (e) {
      console.error("Approval error, falling back locally:", e);
      
      const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
      const localProjects = JSON.parse(localStorage.getItem("dreamwed_projects") || "[]");
      
      const bookingToConfirm = localBookings.find(b => b.id === Number(bookingId));
      if (bookingToConfirm) {
        bookingToConfirm.status = "confirmed";
        const isBothSide = bookingToConfirm.coverage_type === 'both' || bookingToConfirm.coverage_scope === 'both';
        if (isBothSide) {
          bookingToConfirm.bride_password = bookingToConfirm.bride_password || `bride${String(Math.floor(Math.random() * 900) + 100)}`;
        } else {
          bookingToConfirm.bride_password = null;
        }
        bookingToConfirm.groom_password = bookingToConfirm.groom_password || `groom${String(Math.floor(Math.random() * 900) + 100)}`;
        bookingToConfirm.invoice_number = bookingToConfirm.invoice_number || `DW-2026-${String(bookingToConfirm.id).padStart(3, '0')}`;
        bookingToConfirm.invoice_date = bookingToConfirm.invoice_date || new Date().toISOString().split('T')[0];
        bookingToConfirm.updated_at = new Date().toISOString();
        
        // Spawn project
        let projectMatch = localProjects.find(p => p.booking_id === bookingToConfirm.id);
        if (!projectMatch) {
          projectMatch = {
            id: bookingToConfirm.id,
            booking_id: bookingToConfirm.id,
            couple_name: bookingToConfirm.customer_name,
            wedding_date: bookingToConfirm.event_date,
            current_step: 3, // start at step 3
            timeline_steps: [
              { name: "Photos Uploaded", completed: true, updated_at: new Date().toISOString() },
              { name: "Client Selected Photos", completed: false, updated_at: null },
              { name: "Video Editing Completed", completed: false, updated_at: null },
              { name: "Album Design Pending Approval", completed: false, updated_at: null },
              { name: "Final Delivery Completed", completed: false, updated_at: null }
            ],
            package_details: {
              photography: "Traditional + Candid (4-Camera coverage)",
              video: "Cinematic Pre-Wedding Video + Teaser Reel + Highlight Film",
              album: "One 80-Page Premium Couture Leather Layflat Album",
              edited_photos: "120 color-corrected high-res photos included",
              delivery_items: "Premium Signature bag, custom photo calendar & USB drive"
            },
            gallery_images: [
              { id: 1, url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600", favorited: false, categories: [], comment: "" },
              { id: 2, url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600", favorited: false, categories: [], comment: "" },
              { id: 3, url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600", favorited: false, categories: [], comment: "" },
              { id: 4, url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600", favorited: false, categories: [], comment: "" }
            ],
            deliveries: {
              video_teaser_url: "https://www.youtube.com/embed/S9-SrdnKsMs",
              video_status: "pending",
              album_pdf_url: "https://dreamwedstories.co.in/draft-album.pdf",
              album_status: "pending",
              final_download_url: ""
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          localProjects.push(projectMatch);
        }
        
        localStorage.setItem("dreamwed_bookings", JSON.stringify(localBookings));
        localStorage.setItem("dreamwed_projects", JSON.stringify(localProjects));
        
        // Log local activities
        const localLogs = JSON.parse(localStorage.getItem(`dreamwed_logs_${bookingToConfirm.id}`) || "[]");
        localLogs.push({
          id: localLogs.length + 1,
          project_id: bookingToConfirm.id,
          user: "System",
          action: `Booking status confirmed, invoice DW2026-${String(bookingToConfirm.id).padStart(3, '0')} generated successfully with status: Verified`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
        localLogs.push({
          id: localLogs.length + 2,
          project_id: bookingToConfirm.id,
          user: "System",
          action: "Automatically scheduled Wedding & Reception slots in Google Calendar",
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
        localLogs.push({
          id: localLogs.length + 3,
          project_id: bookingToConfirm.id,
          user: "System",
          action: "Created workspace folders: RAW, Edited, SaveTheDate, Wedding, Reception, Album_Selected, Album_Design, Final_Delivery",
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
        localStorage.setItem(`dreamwed_logs_${bookingToConfirm.id}`, JSON.stringify(localLogs));

        const loginDisplay = isBothSide
          ? `Bride Password: ${bookingToConfirm.bride_password}\nGroom Password: ${bookingToConfirm.groom_password}`
          : `Login Password: ${bookingToConfirm.groom_password}`;
        alert(`✅ Booking approved successfully (Local Offline Sync Active)!\n${loginDisplay}`);
        
        // Refresh local views
        setBookings(localBookings);
        setProjects(localProjects);
        if (localProjects.length > 0 && !selectedProject) setSelectedProject(localProjects[0]);
      } else {
        alert("Booking not found locally.");
      }
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to REJECT this booking request?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      });
      if (res.ok) {
        alert("❌ Booking request has been rejected.");
        await fetchBookings();
      }
    } catch (e) {
      console.warn("Reject error, falling back locally:", e);
      const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
      const match = localBookings.find(b => b.id === Number(bookingId));
      if (match) {
        match.status = "rejected";
        match.updated_at = new Date().toISOString();
        localStorage.setItem("dreamwed_bookings", JSON.stringify(localBookings));
        setBookings(localBookings);
        alert("❌ Booking request rejected locally (Offline Sync Active).");
      }
    }
  };

  const handleRequestNewProof = async (bookingId) => {
    const reason = prompt("Enter the reason for requesting new proof (e.g. Blurry screenshot, incorrect amount):", "Blurry screenshot / transaction details mismatch");
    if (reason === null) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "proof_requested", special_notes: `Proof Requested: ${reason}` })
      });
      if (res.ok) {
        alert("🟡 Request sent to client for new payment proof.");
        await fetchBookings();
      }
    } catch (e) {
      console.warn("Request proof error, falling back locally:", e);
      const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
      const match = localBookings.find(b => b.id === Number(bookingId));
      if (match) {
        match.status = "proof_requested";
        match.special_notes = `Proof Requested: ${reason}`;
        match.updated_at = new Date().toISOString();
        localStorage.setItem("dreamwed_bookings", JSON.stringify(localBookings));
        setBookings(localBookings);
        alert("🟡 Request sent locally (Offline Sync Active).");
      }
    }
  };

  const handleSaveAdminNotes = async (bookingId, notesText) => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: notesText })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, admin_notes: notesText } : b));
      }
    } catch (e) {
      console.warn("Save notes error, falling back locally:", e);
      const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
      const match = localBookings.find(b => b.id === Number(bookingId));
      if (match) {
        match.admin_notes = notesText;
        match.updated_at = new Date().toISOString();
        localStorage.setItem("dreamwed_bookings", JSON.stringify(localBookings));
        setBookings(localBookings);
      }
    }
  };

  const loadChats = async () => {
    if (!chatProject) return;
    setChatLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/${chatProject.id}/chats/${chatChannel}`);
      if (res.ok) {
        setChatMessages(await res.json());
      }
    } catch (e) {
      console.error("Error loading chats:", e);
    } finally {
      setChatLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === "admin" && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError("");
      localStorage.setItem("dreamwed_admin_auth", "true");
    } else {
      setLoginError("Invalid username or password credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("dreamwed_admin_auth");
    setUsername("");
    setPassword("");
    setSelectedProject(null);
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;
    setSaving(true);
    try {
      const payload = {
        deadline_date: deadlineDate,
        deliveries: { 
          ...selectedProject.deliveries, 
          raw_photos_url: driveLink.trim(),
          raw_video_drive_url_1: videoDrive1.trim(),
          raw_video_drive_url_2: videoDrive2.trim(),
          raw_video_drive_url_3: videoDrive3.trim(),
          raw_video_drive_url_4: videoDrive4.trim()
        }
      };
      const res = await fetch(`${API_BASE}/api/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("✅ Project deliverables link & deadline saved successfully!");
        await fetchProjects();
      } else {
        alert("Error saving updates to project.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error updating project.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (clientFormSaving) return;
    
    setClientFormSaving(true);
    try {
      const payload = {
        customer_name: newClientFormData.customer_name,
        customer_phone: newClientFormData.customer_phone,
        customer_email: newClientFormData.customer_email,
        customer_address: newClientFormData.customer_address,
        pincode: newClientFormData.pincode,
        coverage_type: newClientFormData.coverage_scope === "both" ? "both" : "single",
        coverage_scope: newClientFormData.coverage_scope,
        package_name: newClientFormData.package_name,
        package_price: Number(newClientFormData.package_price) || 0,
        advance_paid: Number(newClientFormData.advance_paid) || 0,
        total_price: Number(newClientFormData.package_price) || 0,
        event_date: newClientFormData.event_date,
        event_venue: newClientFormData.event_venue,
        wedding_reception_mode: newClientFormData.wedding_reception_mode,
        different_date_details: newClientFormData.different_date_details,
        need_drone: newClientFormData.need_drone,
        need_cinematic: newClientFormData.need_cinematic,
        preferred_album_size: newClientFormData.preferred_album_size,
        special_notes: newClientFormData.special_notes,
        status: "confirmed",
        customer_name_2: newClientFormData.customer_name_2,
        customer_phone_2: newClientFormData.customer_phone_2,
        customer_email_2: newClientFormData.customer_email_2,
        customer_address_2: newClientFormData.customer_address_2
      };

      if (newClientFormData.custom_bride_password) {
        payload.bride_password = newClientFormData.custom_bride_password;
      }
      if (newClientFormData.custom_groom_password) {
        payload.groom_password = newClientFormData.custom_groom_password;
      }

      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned status code: ${res.status}`);
      }

      const createdBooking = await res.json();
      
      // Update local state bookings list
      setBookings(prev => [createdBooking, ...prev]);
      setSelectedClient(createdBooking);
      setSelectedClientTab("details");
      
      // Show confirmation message
      const hasBridePass = createdBooking.bride_password !== null;
      const passInfo = hasBridePass 
        ? `Bride: ${createdBooking.bride_password}\nGroom: ${createdBooking.groom_password}`
        : `Login Password: ${createdBooking.groom_password}`;
        
      alert(`🎉 Custom Workspace Created Successfully!\n\n👤 Name: ${createdBooking.customer_name}\n📞 Phone: ${createdBooking.customer_phone}\n\nGenerated Passwords:\n${passInfo}`);
      
      setShowCreateClientModal(false);
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to create custom workspace: ${err.message}`);
    } finally {
      setClientFormSaving(false);
    }
  };

  const handleSavePasswords = async (bookingId, newBridePass, newGroomPass) => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bride_password: newBridePass,
          groom_password: newGroomPass
        })
      });
      if (res.ok) {
        alert("🎉 Client access passwords updated successfully!");
        fetchBookings();
        setSelectedClient(prev => prev ? { ...prev, bride_password: newBridePass, groom_password: newGroomPass } : null);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn("Error updating password in database, syncing locally:", e);
      const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
      const match = localBookings.find(b => b.id === Number(bookingId));
      if (match) {
        match.bride_password = newBridePass;
        match.groom_password = newGroomPass;
        localStorage.setItem("dreamwed_bookings", JSON.stringify(localBookings));
        setBookings(localBookings);
        setSelectedClient({ ...match });
        alert("🎉 Client access passwords updated successfully (Offline Sync Active)!");
      } else {
        alert("Failed to save changes. Client booking not found.");
      }
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.username || !newStaff.password) return;
    setStaffSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newStaff, display_name: newStaff.display_name || newStaff.username })
      });
      if (res.ok) {
        await fetchStaff();
        setNewStaff({ username: "", password: "", role: "editor", display_name: "" });
        setShowCreateForm(false);
        alert("✅ Staff account created successfully!");
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (e) {
      alert("Network error creating staff account.");
    } finally {
      setStaffSaving(false);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/staff/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchStaff();
      }
    } catch (e) {
      alert("Error deleting staff account.");
    }
  };

  const handleAssignProject = async (staffId, projectId, assign) => {
    const staff = staffUsers.find(u => u.id === staffId);
    if (!staff) return;
    const current = staff.assigned_projects || [];
    const updated = assign
      ? [...new Set([...current, Number(projectId)])]
      : current.filter(id => id !== Number(projectId));
    try {
      const res = await fetch(`${API_BASE}/api/staff/${staffId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_projects: updated })
      });
      if (res.ok) {
        await fetchStaff();
      }
    } catch (e) {
      alert("Error updating assignment.");
    }
  };

  const formatDateString = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return d; }
  };

  const getProgressPct = (p) => {
    if (!p || !p.timeline_steps) return 0;
    return Math.round((p.current_step / p.timeline_steps.length) * 100);
  };

  const getSelectedPhotosCount = (p) => {
    if (!p || !p.gallery_images) return 0;
    return p.gallery_images.filter(img => img.favorited || img.categories?.includes("album")).length;
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    try { return new Date(ts.includes("T") ? ts : ts.replace(" ", "T") + "Z").toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }
    catch { return ts; }
  };

  const handleRegenerateRandomCodes = () => {
    const gCode = String(Math.floor(1000 + Math.random() * 4000));
    const sCode = String(Math.floor(5000 + Math.random() * 4000));
    setNewGuestCode(gCode);
    setNewSelectionCode(sCode);
  };

  const handleCopyWhatsAppInvite = (gallery) => {
    if (!gallery) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://dreamwedstories.co.in";
    const guestUrl = `${origin}/gallery/${gallery.id}?view=guest`;
    const selectionUrl = `${origin}/gallery/${gallery.id}?view=selection`;
    const groom = gallery.groomName || "";
    const bride = gallery.brideName || "";
    const couple = groom && bride ? `${groom} & ${bride}` : (gallery.name || "Wedding Gallery");
    const gCode = gallery.guestCode || (gallery.accessCode && !gallery.selectionCode ? gallery.accessCode : '1000');
    const sCode = gallery.selectionCode || (gallery.accessCode && gallery.accessCode !== gCode ? gallery.accessCode : '8000');

    const message = `✨ *Private Wedding Gallery: ${couple}* ✨\n\n📸 *1. View the Cinematic Story (Guests):*\n🔗 ${guestUrl}\n👥 *Guest Passcode:* \`${gCode}\`\n\n💍 *2. Album Photo Selection (Bride & Groom):*\n🔗 ${selectionUrl}\n👰🤵 *Selection Passcode:* \`${sCode}\` (Prompts for Bride or Groom selection)\n\n_Protected & Curated by Dreamwed Stories_`;

    navigator.clipboard.writeText(message);
    alert(`💬 WhatsApp Group Invitation with 2 Dedicated Links Copied!\n\n${message}`);
  };

  const handleCreateAiGallery = async (e) => {
    e.preventDefault();
    const finalName = newGalName.trim() || 
      ((newGroomName.trim() && newBrideName.trim()) 
        ? `${newGroomName.trim()} & ${newBrideName.trim()}` 
        : (newGroomName.trim() || newBrideName.trim() || "Dreamwed Wedding"));

    if (!finalName || !newGalDrive) {
      alert("Please enter Groom/Bride name (or Wedding name) and Google Drive link.");
      return;
    }
    
    const randomGuestCode = String(Math.floor(1000 + Math.random() * 4000));
    const randomSelectCode = String(Math.floor(5000 + Math.random() * 4000));
    const finalGuestCode = newGuestCode.trim() || randomGuestCode;
    let finalSelectCode = newSelectionCode.trim() || randomSelectCode;
    if (finalGuestCode === finalSelectCode) {
      finalSelectCode = String(Math.floor(5000 + Math.random() * 4000));
    }
    const generatedId = `gallery-${finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;

    const newGal = {
      id: generatedId,
      name: finalName,
      groomName: newGroomName.trim(),
      brideName: newBrideName.trim(),
      weddingDate: newWeddingDate.trim(),
      location: newWeddingLocation.trim(),
      gdriveLink: newGalDrive.trim(),
      extraDriveLink: newGalExtraDrive.trim(),
      coverUrl: newGalCover.trim() || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
      coverAlign: newGalCoverAlign,
      coverTextAlign: newGalCoverTextAlign,
      coverFont: newGalCoverFont,
      coverColor: newGalCoverColor,
      accessCode: finalGuestCode,
      selectionCode: finalSelectCode,
      guestCode: finalGuestCode,
      brideCode: finalSelectCode,
      groomCode: finalSelectCode,
      loginMode: "two_code_mode",
      photos: [],
      photosCount: 0,
      selectedCount: 0
    };

    // 1. Instant UI update - gallery appears immediately!
    setAiGalleries(prev => {
      const existing = Array.isArray(prev) ? prev : [];
      const updated = [newGal, ...existing.filter(g => g?.id !== newGal.id)];
      try { localStorage.setItem("dreamwed_galleries", JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
    
    try {
      const res = await fetch(`${API_BASE}/api/galleries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGal)
      });
      if (res.ok) {
        const saved = await res.json();
        setAiGalleries(prev => {
          const existing = Array.isArray(prev) ? prev : [];
          const updated = [saved, ...existing.filter(g => g?.id !== saved.id && g?.id !== newGal.id)];
          try { localStorage.setItem("dreamwed_galleries", JSON.stringify(updated)); } catch (err) {}
          return updated;
        });
        await fetchGalleries();
      }
    } catch (err) {
      console.warn("Backend save failed, saved locally in dreamwed_galleries fallback:", err);
    }

    const nextGCode = String(Math.floor(1000 + Math.random() * 4000));
    const nextSCode = String(Math.floor(5000 + Math.random() * 4000));
    setNewGroomName("");
    setNewBrideName("");
    setNewGalName("");
    setNewWeddingDate("");
    setNewWeddingLocation("");
    setNewSelectionCode(nextSCode);
    setNewGuestCode(nextGCode);
    setNewGalDrive("");
    setNewGalExtraDrive("");
    alert("💍 AI-Powered Cinematic Wedding Gallery created successfully!\n\nGallery is listed and active.");
  };


  const handleDeleteAiGallery = async (id, name = "this gallery") => {
    if (!id) return;
    if (!confirm(`⚠️ Are you sure you want to permanently delete "${name}"?\n\nThis action cannot be undone.`)) {
      return;
    }
    
    // 1. Instant UI update - gallery disappears immediately!
    setAiGalleries(prev => {
      const existing = Array.isArray(prev) ? prev : [];
      const updated = existing.filter(g => g?.id !== id);
      try { localStorage.setItem("dreamwed_galleries", JSON.stringify(updated)); } catch (err) {}
      return updated;
    });

    // 2. Server delete sync
    try {
      const res = await fetch(`${API_BASE}/api/galleries/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchGalleries();
      }
    } catch (err) {
      console.warn("Backend delete failed, removed locally from dreamwed_galleries:", err);
    }
    alert(`🗑️ "${name}" deleted successfully!`);
  };

  const handleCoverFileUpload = (file, isEdit = false) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert("Image is larger than 15MB. Please choose a slightly smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (isEdit) {
        setEditCoverValue(e.target.result);
      } else {
        setNewGalCover(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateGalleryCover = async () => {
    if (!editingCoverGallery || !editCoverValue) return;
    try {
      const res = await fetch(`${API_BASE}/api/galleries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCoverGallery.id,
          name: editingCoverGallery.name,
          coverUrl: editCoverValue,
          coverAlign: editCoverAlign,
          coverTextAlign: editCoverTextAlign,
          coverFont: editCoverFont,
          coverColor: editCoverColor
        })
      });
      if (res.ok) {
        await fetchGalleries();
        setEditingCoverGallery(null);
        setEditCoverValue("");
        alert("✨ Cover design & styling updated successfully!");
      } else {
        throw new Error("Failed to update cover on server");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating cover image.");
    }
  };

  const handleOpenSelectedPhotos = async (galleryId) => {
    try {
      const res = await fetch(`${API_BASE}/api/galleries/${galleryId}/selected-photos`);
      if (!res.ok) throw new Error("Failed to load selected photos");
      const data = await res.json();
      if (!data.photos || data.photos.length === 0) {
        alert("ℹ️ The client has not selected/favorited any photos yet in this gallery.");
        return;
      }
      setSelectedPhotosModalData(data);
    } catch (e) {
      console.error(e);
      alert("Error loading selected photos.");
    }
  };

  const handleDownloadAllSelected = async (modalData) => {
    if (!modalData?.photos || modalData.photos.length === 0) return;
    try {
      setZippingState({ isZipping: true, percent: 5, status: `Packaging ${modalData.photos.length} HD photos...` });
      await downloadPhotosAsZip({
        photos: modalData.photos,
        galleryName: modalData.galleryName || "Wedding",
        groomName: modalData.groomName || "",
        brideName: modalData.brideName || "",
        apiBase: API_BASE,
        onProgress: (p) => setZippingState({ isZipping: true, percent: p.percent, status: p.status })
      });
      setZippingState({ isZipping: false, percent: 100, status: "✅ ZIP Downloaded Successfully!" });
      setTimeout(() => setZippingState(null), 3500);
    } catch (err) {
      console.error("Zipping error:", err);
      alert("Error generating ZIP download: " + err.message);
      setZippingState(null);
    }
  };

  const handleCopyShareDownloadLink = (galleryId) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://dreamwedstories.co.in";
    const shareUrl = `${origin}/gallery/${galleryId}?download=favorites`;
    navigator.clipboard.writeText(shareUrl);
    alert(`🔗 Shareable Selections Download Link Copied!\n\n${shareUrl}\n\nAnyone (album designers, clients, or printing partners) can open this link to download all selected photos as a ZIP in 1 click!`);
  };

  const convertGoogleDriveUrl = (url) => {
    const matchd = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchd && matchd[1]) return `https://lh3.googleusercontent.com/d/${matchd[1]}`;
    
    const matchid = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (matchid && matchid[1]) return `https://lh3.googleusercontent.com/d/${matchid[1]}`;
    
    return url;
  };

  const handleAddBulkPhotos = (e) => {
    e.preventDefault();
    if (!selectedGalForPhotos || !bulkPhotoUrls.trim()) return;

    const urls = bulkPhotoUrls
      .split(/[,\n]/)
      .map(url => url.trim())
      .filter(url => url.length > 0 && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") || url.startsWith("data:image")));

    if (urls.length === 0) {
      alert("Please enter at least one valid image URL starting with http://, https://, or data:image");
      return;
    }

    const processedUrls = urls.map(url => convertGoogleDriveUrl(url));

    const currentPhotos = selectedGalForPhotos.photos || [];
    const newPhotos = processedUrls.map((url, index) => ({
      id: `photo-${Date.now()}-${index}-${Math.floor(Math.random() * 1050)}`,
      url: url
    }));

    const updatedGal = {
      ...selectedGalForPhotos,
      photos: [...currentPhotos, ...newPhotos]
    };

    const updatedGalleries = aiGalleries.map(g => g.id === selectedGalForPhotos.id ? updatedGal : g);
    setAiGalleries(updatedGalleries);
    localStorage.setItem("dreamwed_galleries", JSON.stringify(updatedGalleries));
    
    setSelectedGalForPhotos(updatedGal);
    setBulkPhotoUrls("");
  };

  const handleDeletePhotoFromGal = (photoId) => {
    if (!selectedGalForPhotos) return;

    const currentPhotos = selectedGalForPhotos.photos || [];
    const updatedPhotos = currentPhotos.filter(p => p.id !== photoId);

    const updatedGal = {
      ...selectedGalForPhotos,
      photos: updatedPhotos
    };

    const updatedGalleries = aiGalleries.map(g => g.id === selectedGalForPhotos.id ? updatedGal : g);
    setAiGalleries(updatedGalleries);
    localStorage.setItem("dreamwed_galleries", JSON.stringify(updatedGalleries));

    setSelectedGalForPhotos(updatedGal);
  };

  const handleUpdateAiOrderStatus = (orderId, newStatus) => {
    const updated = aiOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setAiOrders(updated);
    localStorage.setItem("dreamwed_orders", JSON.stringify(updated));
  };

  const getRoleIcon = (role) => {
    if (role === "designer") return <BookOpen size={14} className="text-purple-400" />;
    return <Video size={14} className="text-blue-400" />;
  };

  const CHANNELS = [
    { id: "client-admin", label: "👥 Client ↔ Coordinator" },
    { id: "client-editor", label: "🎥 Client ↔ Video Editor" },
    { id: "client-designer", label: "📖 Client ↔ Album Designer" }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#f5f5f3] flex items-center justify-center relative">
        {/* Floating Back to Home button */}
        <a 
          href="/" 
          className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 transition-all text-xs font-semibold text-zinc-700 hover:text-zinc-950 uppercase tracking-wider backdrop-blur-sm shadow-md active:scale-95 group cursor-pointer"
        >
          <span>←</span> Back to Home
        </a>
        <SEO title="Admin Control Center" description="Dreamwed Stories secure management portal." />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-auto px-6 py-12 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-zinc-100 text-zinc-800"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#b4975a]/10 border border-[#b4975a]/20 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} className="text-[#b4975a]" />
            </div>
            <span className="text-[#b4975a] font-bold text-[10px] tracking-[0.3em] uppercase block mb-1">Secure Portal</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl text-zinc-900 font-light">Dreamwed Admin</h2>
            <p className="text-zinc-400 text-xs font-light mt-2">Enter credentials to manage wedding projects</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="admin" required
                className="w-full px-5 py-3.5 border border-zinc-200 rounded-xl text-zinc-800 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#b4975a]/20 focus:border-[#b4975a] transition-all" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-5 py-3.5 border border-zinc-200 rounded-xl text-zinc-800 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#b4975a]/20 focus:border-[#b4975a] transition-all" />
            </div>
            {loginError && (
              <div className="flex items-center gap-2.5 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            <button type="submit"
              className="w-full py-4 bg-zinc-950 hover:bg-black text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]">
              <LogIn size={16} /> Access Control
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] flex text-white font-sans office-theme-container selection:bg-[#d4af37]/30 selection:text-white">
      <SEO title="Admin Control Center" description="Dreamwed Stories secure management portal." />

      {/* Desktop Sidebar */}
      <aside className="w-72 hidden lg:flex flex-col bg-[#131a2b]/95 backdrop-blur-md border-r border-zinc-800/40 h-screen sticky top-0 z-40 p-6 shrink-0 justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <div className="pb-4 border-b border-zinc-800/40 select-none">
            <span className="text-[#d4af37] font-bold text-[9px] tracking-[0.3em] uppercase block mb-1">Dreamwed Stories</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-white font-light tracking-tight">
              Admin <span className="italic font-serif text-[#d4af37]">Console</span>
            </h1>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "📊 Dashboard", icon: <Users size={16} /> },
              { id: "projects", label: "🗂 Projects", icon: <Package size={16} /> },
              { id: "bookings", label: "📖 Bookings", icon: <Calendar size={16} />, badge: bookings.filter(b => b.status !== "confirmed" && b.status !== "rejected").length },
              { id: "clients", label: "👑 Client Portal", icon: <ShieldCheck size={16} /> },
              { id: "staff", label: "👥 Staff Accounts", icon: <Users size={16} /> },
              {id: "chats", label: "💬 Chat Room", icon: <MessageSquare size={16} />},
              {id: "ai-galleries", label: "💍 Dreamwed Galleries", icon: <Camera size={16} />},
              {id: "ai-orders", label: "🧾 Print Orders", icon: <FileText size={16} />},
              { id: "budget-tracker", label: "💰 Budget Tracker", icon: <Package size={16} /> },
              { id: "invoice-studio", label: "🧾 Invoice Studio", icon: <FileText size={16} /> },
              { id: "website-media", label: "🖼 Website Media", icon: <ImageIcon size={16} /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMobileSidebar(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? "bg-[#d4af37] text-zinc-950 shadow-md shadow-[#d4af37]/10" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-850/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    activeTab === item.id ? "bg-zinc-950 text-[#d4af37]" : "bg-red-500 text-white animate-pulse"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer profile */}
        <div className="pt-4 border-t border-zinc-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
              <ShieldCheck size={18} className="text-[#d4af37]" />
            </div>
            <div className="text-left">
              <span className="text-white text-xs font-bold block">Administrator</span>
              <span className="text-zinc-500 text-[10px] block">Live Connected</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 bg-zinc-850 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 rounded-xl transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 w-80 bg-[#131a2b] border-r border-zinc-800/40 z-50 p-6 flex flex-col justify-between lg:hidden"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/40">
                  <div>
                    <span className="text-[#d4af37] font-bold text-[9px] tracking-[0.25em] uppercase block mb-1">Dreamwed Stories</span>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-white font-light tracking-tight">
                      Admin <span className="italic font-serif text-[#d4af37]">Console</span>
                    </h1>
                  </div>
                  <button onClick={() => setShowMobileSidebar(false)} className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-850">
                    <X size={16} />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {[
                    { id: "overview", label: "📊 Dashboard", icon: <Users size={16} /> },
                    { id: "projects", label: "🗂 Projects", icon: <Package size={16} /> },
                    { id: "bookings", label: "📖 Bookings", icon: <Calendar size={16} />, badge: bookings.filter(b => b.status !== "confirmed" && b.status !== "rejected").length },
                    { id: "clients", label: "👑 Client Portal", icon: <ShieldCheck size={16} /> },
                    { id: "staff", label: "👥 Staff Accounts", icon: <Users size={16} /> },
                    {id: "chats", label: "💬 Chat Room", icon: <MessageSquare size={16} />},
                    { id: "budget-tracker", label: "💰 Budget Tracker", icon: <Package size={16} /> },
                    { id: "invoice-studio", label: "🧾 Invoice Studio", icon: <FileText size={16} /> },
                    { id: "website-media", label: "🖼 Website Media", icon: <ImageIcon size={16} /> }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setShowMobileSidebar(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === item.id 
                          ? "bg-[#d4af37] text-zinc-950 shadow-md" 
                          : "text-zinc-400 hover:text-white hover:bg-zinc-850/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          activeTab === item.id ? "bg-zinc-950 text-[#d4af37]" : "bg-red-500 text-white animate-pulse"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-zinc-800/40">
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 bg-zinc-850 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace Pane */}
      <div className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        {/* Workspace Top Header Bar */}
        <header className="h-16 px-6 lg:px-8 border-b border-zinc-800/40 flex items-center justify-between sticky top-0 bg-[#0b0f19]/80 backdrop-blur-md z-30 select-none">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl cursor-pointer"
            >
              <Users size={16} />
            </button>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest hidden sm:block">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "projects" && "Client Deliverables & Projects"}
              {activeTab === "bookings" && "Booking Registrations"}
              {activeTab === "clients" && "Client Workspace Portal"}
              {activeTab === "staff" && "Crew & Staff Management"}
              {activeTab === "chats" && "Client Communication"}
              {activeTab === "ai-galleries" && "AI face Gallery Database"}
              {activeTab === "ai-orders" && "Print Frame Orders"}
              {activeTab === "budget-tracker" && "Budget Planner & Settings"}
              {activeTab === "invoice-studio" && "Tax Invoice Studio"}
              {activeTab === "website-media" && "Website Media & Cloudinary CDN"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800/60 rounded-lg text-[10px] font-bold text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Server: Connected</span>
            </div>
            <a href="/" className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider border border-[#d4af37]/20 hover:border-[#d4af37]/45 transition-all cursor-pointer select-none">
              ← Main Website
            </a>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="p-6 lg:p-10 flex-1 space-y-6">
          {/* Offline alert banner */}
          {isOffline && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-amber-400 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <div>
                  <strong className="font-bold uppercase tracking-wider block sm:inline">Offline Mode:</strong>{' '}
                  <span className="font-light text-zinc-300">Displaying local cached data. Server at {API_BASE} is offline.</span>
                </div>
              </div>
            </div>
          )}

          {/* =============================== DASHBOARD OVERVIEW TAB ================================ */}
          {activeTab === "overview" && (
            <div className="space-y-8 text-left">
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl text-white font-light">
                  Dashboard <span className="italic font-serif text-[#d4af37]">Overview</span>
                </h1>
                <p className="text-zinc-500 text-[11px] font-light mt-1">Quick insights, stat summaries, and studio operational metrics.</p>
              </div>

              {/* Stats Widgets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Total Active Projects", value: projects.length, icon: <Package size={22} className="text-[#d4af37]" />, desc: "Client deliverables on timeline" },
                  { label: "Pending Approvals", value: bookings.filter(b => b.status !== "confirmed" && b.status !== "rejected").length, icon: <Calendar size={22} className="text-[#d4af37]" />, desc: "Awaiting invoice approvals", alert: bookings.filter(b => b.status !== "confirmed" && b.status !== "rejected").length > 0 },
                  { label: "Active Face Galleries", value: aiGalleries.length, icon: <Camera size={22} className="text-[#d4af37]" />, desc: "AI Face Recognition databases" },
                  { label: "Dispatch Queue", value: aiOrders.filter(o => o.status !== "Delivered").length, icon: <FileText size={22} className="text-[#d4af37]" />, desc: "Print frame orders pending delivery" }
                ].map((stat, i) => (
                  <div key={i} className="office-theme-card p-6 rounded-3xl border border-zinc-800/40 relative overflow-hidden flex flex-col justify-between h-36">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/2 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">{stat.label}</span>
                      <div className="w-10 h-10 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/10 flex items-center justify-center">
                        {stat.icon}
                      </div>
                    </div>
                    <div>
                      <span className={`text-4xl font-light font-mono block ${stat.alert ? "text-red-400 font-bold animate-pulse" : "text-white"}`}>
                        {stat.value}
                      </span>
                      <span className="text-zinc-500 text-[9px] font-light mt-0.5 block">{stat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid: Actions & Recent projects */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Upcoming Weddings / Project tracker */}
                <div className="lg:col-span-2 office-theme-card p-6 rounded-3xl space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-zinc-800/40">
                    <Package size={14} className="text-[#d4af37]" /> Active Project Deadlines
                  </h3>
                  {projects.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 text-xs font-light">
                      No active projects. Register or approve a booking to create one.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-zinc-500 uppercase tracking-wider text-[9px] border-b border-zinc-800/40">
                            <th className="pb-3 font-bold">Couple Name</th>
                            <th className="pb-3 font-bold">Wedding Date</th>
                            <th className="pb-3 font-bold">Current Stage</th>
                            <th className="pb-3 font-bold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/20">
                          {projects.slice(0, 4).map((p) => {
                            const currentStepName = p.timeline_steps?.[p.current_step - 1]?.name || "Pending";
                            return (
                              <tr key={p.id} className="hover:bg-zinc-850/10">
                                <td className="py-3 font-bold text-white">{p.couple_name}</td>
                                <td className="py-3 text-zinc-400">{p.wedding_date}</td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded-md bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold">
                                    {currentStepName}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  <button
                                    onClick={() => {
                                      setSelectedProject(p);
                                      setActiveTab("projects");
                                    }}
                                    className="px-3 py-1 bg-zinc-900 border border-zinc-850 hover:border-[#d4af37] text-zinc-300 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right: Studio Quick Actions */}
                <div className="office-theme-card p-6 rounded-3xl space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-zinc-800/40">
                    <ShieldCheck size={14} className="text-[#d4af37]" /> Quick Operations
                  </h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setActiveTab("clients");
                        setTimeout(() => {
                          setShowCreateClientModal(true);
                        }, 50);
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-[#d4af37]/45 rounded-2xl text-xs text-left cursor-pointer transition-all"
                    >
                      <div>
                        <strong className="font-bold text-white block">➕ New Custom Booking</strong>
                        <span className="text-[9px] text-zinc-500 font-light block mt-0.5">Register client details & passwords manually</span>
                      </div>
                      <ChevronRight size={14} className="text-[#d4af37]" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("invoice-studio");
                        handleCreateBlankInvoice();
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-[#d4af37]/45 rounded-2xl text-xs text-left cursor-pointer transition-all"
                    >
                      <div>
                        <strong className="font-bold text-white block">📄 Tax Invoice Builder</strong>
                        <span className="text-[9px] text-zinc-500 font-light block mt-0.5">Generate customized tax receipts</span>
                      </div>
                      <ChevronRight size={14} className="text-[#d4af37]" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("ai-galleries");
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-[#d4af37]/45 rounded-2xl text-xs text-left cursor-pointer transition-all"
                    >
                      <div>
                        <strong className="font-bold text-white block">💍 Create Dreamwed Gallery</strong>
                        <span className="text-[9px] text-zinc-500 font-light block mt-0.5">Set up custom password-protected photo gallery</span>
                      </div>
                      <ChevronRight size={14} className="text-[#d4af37]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* =============================== PROJECTS TAB ================================ */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            {/* Left: Project list */}
            <div className="md:col-span-2 space-y-4 text-left max-h-[60vh] md:max-h-[75vh] overflow-y-auto pr-1">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Projects ({projects.length})</span>
              {projects.map((p) => {
                const isSelected = selectedProject?.id === p.id;
                const progress = getProgressPct(p);
                const currentStepName = p.timeline_steps?.[p.current_step - 1]?.name || "Pending";
                return (
                  <button key={p.id} onClick={() => {
                    setSelectedProject(p);
                    if (window.innerWidth < 768) {
                      setTimeout(() => {
                        document.getElementById("project-details-card")?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }
                  }}
                    className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3.5 relative overflow-hidden ${
                      isSelected ? "bg-zinc-900 border-[#b4975a]/45 shadow-[0_10px_30px_rgba(180,151,90,0.05)]" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    }`}>
                    {isSelected && <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white truncate">{p.couple_name}</h4>
                        <span className="text-[9px] text-zinc-500 font-light flex items-center gap-1 mt-0.5">
                          <Calendar size={10} className="text-[#b4975a]" /> {formatDateString(p.wedding_date)}
                        </span>
                      </div>
                      <ChevronRight size={16} className={`text-zinc-500 transition-transform ${isSelected ? "translate-x-1 text-[#b4975a]" : ""}`} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider">{currentStepName}</span>
                        <span className="text-[#b4975a] font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-[#b4975a] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: project details editor */}
            <div id="project-details-card" className="md:col-span-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-4 text-left">Project Details & Link Editor</span>
              {selectedProject ? (
                <div className="bg-zinc-950 border border-zinc-800 rounded-[32px] p-6 sm:p-8 space-y-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="border-b border-zinc-800 pb-4">
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-white font-light">
                      {selectedProject.couple_name}'s <span className="italic font-serif text-[#b4975a]">Wedding Portal</span>
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-light mt-1 flex items-center gap-1.5">
                      <span>Wedding: {formatDateString(selectedProject.wedding_date)}</span>
                      <span>•</span>
                      <span>Stage: {selectedProject.timeline_steps?.[selectedProject.current_step - 1]?.name || "Pending"}</span>
                    </p>
                  </div>

                  {/* Photo Drive link */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Link2 size={16} className="text-[#b4975a]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Google Drive / High-Res Photo Link</h4>
                    </div>
                    <input type="url" placeholder="Paste full Google Drive folder link here..."
                      value={driveLink} onChange={(e) => setDriveLink(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none transition-colors" />
                  </div>

                  {/* Raw Video Footage Drive Links (up to 4) */}
                  <div className="space-y-4 bg-zinc-900/50 p-4 border border-zinc-800 rounded-2xl">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5">
                      <Video size={16} className="text-[#b4975a]" />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Raw Video Footage Drive Links (Up to 4)</h4>
                        <p className="text-[9px] text-zinc-500 font-light mt-0.5">Assign raw video streams (e.g. multi-cams, events, folders) for editing.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Drive Link 1 (e.g., Event 1 / Cam A)</label>
                        <input type="url" placeholder="Paste Google Drive link 1..."
                          value={videoDrive1} onChange={(e) => setVideoDrive1(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Drive Link 2 (e.g., Event 2 / Cam B)</label>
                        <input type="url" placeholder="Paste Google Drive link 2..."
                          value={videoDrive2} onChange={(e) => setVideoDrive2(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Drive Link 3 (e.g., Event 3 / Cam C)</label>
                        <input type="url" placeholder="Paste Google Drive link 3..."
                          value={videoDrive3} onChange={(e) => setVideoDrive3(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Drive Link 4 (e.g., Raw Audio / drone)</label>
                        <input type="url" placeholder="Paste Google Drive link 4..."
                          value={videoDrive4} onChange={(e) => setVideoDrive4(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#b4975a]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Work Deadline Date</h4>
                    </div>
                    <input type="date" value={deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)}
                      style={{ colorScheme: "dark" }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none transition-colors" />
                  </div>

                  <button onClick={handleUpdateProject} disabled={saving}
                    className="w-full py-3.5 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(180,151,90,0.15)] active:scale-[0.98]">
                    {saving ? "Saving Updates..." : "Save Link & Deadline"}
                  </button>

                  {selectedProject.deliveries?.raw_photos_url && (
                    <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400">Current Saved Link:</span>
                      <a href={selectedProject.deliveries.raw_photos_url} target="_blank" rel="noopener noreferrer"
                        className="text-[#b4975a] hover:underline font-bold uppercase flex items-center gap-1">
                        View Drive Folder ↗
                      </a>
                    </div>
                  )}

                  {/* Client letter */}
                  {(selectedProject.wedding_letter_url || selectedProject.wedding_letter_text) && (
                    <div className="pt-4 border-t border-zinc-800 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText size={15} className="text-[#b4975a]" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Client Letter & Story Wishes</h4>
                        </div>
                        {selectedProject.wedding_letter_url && (
                          <a href={selectedProject.wedding_letter_url} target="_blank" rel="noopener noreferrer"
                            className="text-[9px] text-[#b4975a] font-bold uppercase hover:underline">
                            Open PDF ↗
                          </a>
                        )}
                      </div>
                      {selectedProject.wedding_letter_text && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300 text-xs font-light leading-relaxed whitespace-pre-wrap">
                          {selectedProject.wedding_letter_text}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Nudge */}
                  <div className="pt-4 border-t border-zinc-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400 font-bold uppercase tracking-wider">Client Selection Action</span>
                      <span className="text-[10px] text-zinc-500">{getSelectedPhotosCount(selectedProject)} photos hearted</span>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`${API_BASE}/api/projects/${selectedProject.id}/whatsapp-reminder`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ type: "photo_selection" })
                          });
                          if (res.ok) {
                            const data = await res.json();
                            alert(`💬 WhatsApp nudge simulated:\n"${data.reminder}"`);
                          }
                        } catch (e) {
                          alert("Connection error sending reminder.");
                        }
                      }}
                      className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-[#b4975a] hover:text-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer">
                      💬 Nudge Selection Process
                    </button>
                  </div>

                  <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500 font-light">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      Client Marked: <strong>{getSelectedPhotosCount(selectedProject)} Album Photos</strong>
                    </span>
                    <span>Booking: #{selectedProject.booking_id}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-950 border border-zinc-800 rounded-[32px] p-8 text-center text-zinc-500 text-xs font-light">
                  Select a wedding project from the list to update details.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =============================== BOOKINGS APPROVAL TAB ================================ */}
        {activeTab === "bookings" && (() => {
          const pendingCount = bookings.filter(b => b.status !== "confirmed" && b.status !== "rejected").length;
          return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light">
                  Booking <span className="italic font-serif text-[#b4975a]">Approvals</span>
                </h2>
                <p className="text-zinc-500 text-[11px] font-light mt-1">Review new client registration requests and approve invoices to unlock workspaces.</p>
              </div>
              <div className="flex items-center gap-3">
                {pendingCount > 0 && (
                  <span className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    {pendingCount} New Request{pendingCount !== 1 ? "s" : ""}
                  </span>
                )}
                <button
                  onClick={fetchBookings}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-all cursor-pointer"
                  title="Refresh bookings list"
                >
                  <RefreshCw size={12} />
                  Refresh
                </button>
              </div>
            </div>


            {bookings.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-[24px] text-zinc-500 text-xs">
                No booking requests found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {bookings.map((b) => {
                  const groomName = b.customer_name ? b.customer_name.split(" & ")[0] : "Groom";
                  const brideName = b.customer_name_2 || "Bride";
                  return (
                    <div key={b.id} className="bg-zinc-950 border border-zinc-800 p-6 rounded-[24px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-base font-bold text-white">
                            👰 Bride: <span className="text-[#b4975a]">{brideName}</span> <span className="text-zinc-600 mx-1">❤️</span> 🤵 Groom: <span className="text-zinc-300">{groomName}</span>
                          </h4>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            b.status === "rejected" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                            b.status === "proof_requested" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-zinc-800 text-zinc-400 border border-zinc-700"
                          }`}>
                            {b.status === "confirmed" ? "Approved" :
                             b.status === "rejected" ? "Rejected" :
                             b.status === "proof_requested" ? "Proof Requested" :
                             "Pending Approval"}
                          </span>
                        </div>
                        {b.wedding_reception_mode === "different" && b.different_date_details ? (
                          <div className="space-y-1 text-xs text-zinc-400 font-light leading-relaxed">
                            <div>
                              💒 Wedding Venue: <strong className="text-white">{b.different_date_details.wedding?.venue || b.event_venue}</strong> • Date: <strong className="text-white">{formatDateString(b.different_date_details.wedding?.date || b.event_date)}</strong>
                            </div>
                            <div>
                              🥂 Reception Venue: <strong className="text-white">{b.different_date_details.reception?.venue || b.reception_venue || "TBA"}</strong> • Date: <strong className="text-white">{formatDateString(b.different_date_details.reception?.date)}</strong>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-400 font-light leading-relaxed">
                            Event Venue: <strong className="text-white">{b.event_venue}</strong> • Date: <strong className="text-white">{formatDateString(b.event_date)}</strong>
                            {b.reception_venue && <span> • Reception Venue: <strong className="text-white">{b.reception_venue}</strong></span>}
                          </p>
                        )}
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          <span>
                            🤵 Groom Contact: <strong className="text-zinc-300">{b.customer_phone}</strong> {b.customer_email && `(${b.customer_email})`} • 
                            👰 Bride Contact: <strong className="text-zinc-300">{b.customer_phone_2}</strong> {b.customer_email_2 && `(${b.customer_email_2})`}
                          </span>
                        </p>
                        <p className="text-[10px] text-zinc-550 leading-normal">
                          Package: <strong className="text-[#b4975a]">{b.package_name}</strong> (₹{Number(b.package_price || 0).toLocaleString("en-IN")}) • Advance paid: <strong className="text-emerald-400">₹{Number(b.advance_paid || 0).toLocaleString("en-IN")}</strong> via {b.payment_method || "UPI"} • Transaction ID: <strong className="text-zinc-350">{b.transaction_id || "N/A"}</strong>
                        </p>
                        
                        {/* File attachments review */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {b.invitation_file_data ? (
                            <button
                              onClick={() => setViewingInvitation({ url: b.invitation_file_data, name: `${groomName}_${brideName}_Invitation` })}
                              className="px-3 py-1.5 bg-zinc-905 hover:bg-zinc-900 text-zinc-300 text-[10px] font-bold rounded-lg border border-zinc-800 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                            >
                              📂 View Invitation Card
                            </button>
                          ) : (
                            <span className="text-[10px] text-zinc-600 bg-zinc-950 px-3 py-1.5 border border-zinc-900 rounded-lg inline-block">No Invitation Uploaded</span>
                          )}

                          {b.screenshot_file_data ? (
                            <button
                              onClick={() => setViewingProof({ url: b.screenshot_file_data, name: `${groomName}_${brideName}_PaymentProof`, transId: b.transaction_id })}
                              className="px-3 py-1.5 bg-zinc-905 hover:bg-zinc-900 text-zinc-300 text-[10px] font-bold rounded-lg border border-zinc-800 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                            >
                              🧾 View Payment Proof
                            </button>
                          ) : (
                            <span className="text-[10px] text-zinc-650 bg-zinc-950 px-3 py-1.5 border border-zinc-900 rounded-lg inline-block">No Payment Screenshot</span>
                          )}
                        </div>

                        {/* Admin Description / Notes Box */}
                        <div className="pt-3 space-y-1 w-full max-w-xl">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Admin Internal Description / Custom Details</label>
                          <textarea 
                            placeholder="Type private notes, special discounts, custom billing milestones details, or scheduling info..."
                            defaultValue={b.admin_notes || ""}
                            onBlur={(e) => {
                              const text = e.target.value.trim();
                              handleSaveAdminNotes(b.id, text);
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-xs focus:border-[#b4975a] focus:outline-none resize-none h-14"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0 w-full md:w-auto items-center">
                        {b.status !== "confirmed" ? (
                          <>
                            <button 
                              onClick={() => handleApproveBooking(b.id)}
                              className="px-4 py-2.5 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl text-[11px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1 active:scale-95 hover:shadow-lg"
                            >
                              <CheckCircle2 size={12} /> Approve
                            </button>
                            {b.status !== "proof_requested" && (
                              <button 
                                onClick={() => handleRequestNewProof(b.id)}
                                className="px-4 py-2.5 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-amber-400 font-bold rounded-xl text-[11px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                              >
                                ⚠️ Request Proof
                              </button>
                            )}
                            {b.status !== "rejected" && (
                              <button 
                                onClick={() => handleRejectBooking(b.id)}
                                className="px-4 py-2.5 bg-zinc-900 border border-zinc-850 hover:bg-rose-950/20 text-rose-400 font-bold rounded-xl text-[11px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                              >
                                ❌ Reject
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-zinc-500 text-xs font-semibold px-4 py-2 border border-zinc-800 rounded-xl inline-block bg-zinc-900/30 font-bold uppercase tracking-wider">
                            Workspace Unlocked ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          );
        })()}


        {/* =============================== CLIENT MANAGEMENT TAB ================================ */}
        {activeTab === "clients" && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light">
                  Client <span className="italic font-serif text-[#b4975a]">Management</span>
                </h2>
                <p className="text-zinc-500 text-[11px] font-light mt-1">Manage client passwords, access details, invoice receipts, and review photo selections.</p>
              </div>
              <button 
                onClick={() => {
                  setNewClientFormData({
                    customer_name: "",
                    customer_phone: "",
                    customer_email: "",
                    customer_address: "",
                    pincode: "",
                    coverage_scope: "both",
                    package_name: "",
                    package_price: "",
                    advance_paid: "",
                    event_date: "",
                    event_venue: "",
                    wedding_reception_mode: "same",
                    different_date_details: {
                      wedding: { date: "", venue: "" },
                      reception: { date: "", venue: "" }
                    },
                    need_drone: "no",
                    need_cinematic: "no",
                    preferred_album_size: "12x18",
                    special_notes: "",
                    custom_bride_password: "",
                    custom_groom_password: "",
                    show_secondary: false,
                    customer_name_2: "",
                    customer_phone_2: "",
                    customer_email_2: "",
                    customer_address_2: ""
                  });
                  setShowCreateClientModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Plus size={14} /> New Custom Booking
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
              {/* Left Panel: Search & List */}
              <div className="md:col-span-2 space-y-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Search size={14} />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search client by name or phone..." 
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                  />
                </div>

                <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                  {bookings
                    .filter(b => {
                      const query = clientSearch.toLowerCase();
                      return b.customer_name?.toLowerCase().includes(query) || 
                             b.customer_phone?.includes(query) || 
                             (b.customer_phone_2 && b.customer_phone_2.includes(query));
                    })
                    .map(b => {
                      const isSelected = selectedClient?.id === b.id;
                      return (
                        <button 
                          key={b.id}
                          onClick={() => {
                            setSelectedClient(b);
                            setEditBridePassword(b.bride_password || "");
                            setEditGroomPassword(b.groom_password || "");
                            setSelectedClientTab("details");
                            if (window.innerWidth < 768) {
                              setTimeout(() => {
                                document.getElementById("client-details-card")?.scrollIntoView({ behavior: "smooth" });
                              }, 100);
                            }
                          }}
                          className={`w-full text-left p-4.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                            isSelected ? "bg-zinc-900 border-[#b4975a]/45 shadow-sm" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <h4 className="text-sm font-bold text-white truncate">{b.customer_name}</h4>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                            }`}>
                              {b.status === "confirmed" ? "Active" : "Pending"}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate leading-normal">
                            {b.wedding_reception_mode === "different" && b.different_date_details ? (
                              <span>Date: {formatDateString(b.different_date_details.wedding?.date || b.event_date)} & {formatDateString(b.different_date_details.reception?.date)}</span>
                            ) : (
                              <span>Date: {formatDateString(b.event_date)}</span>
                            )}
                            <span> • Phone: {b.customer_phone}</span>
                          </p>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Right Panel: Client Workspace Details, Passwords, Selections, Invoices */}
              <div id="client-details-card" className="md:col-span-3">
                {selectedClient ? (
                  <div className="bg-zinc-950 border border-zinc-800 rounded-[32px] p-6 sm:p-8 space-y-6 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                    {/* Top Info */}
                    <div className="border-b border-zinc-800 pb-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-white truncate">{selectedClient.customer_name}</h3>
                        <span className="text-[9px] text-[#b4975a] font-mono tracking-wider bg-[#b4975a]/10 border border-[#b4975a]/20 px-2.5 py-1 rounded-full uppercase">
                          {selectedClient.invoice_number || `INV-${selectedClient.id}`}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-[10px] font-light mt-1 flex flex-wrap gap-x-2 gap-y-1">
                        {selectedClient.wedding_reception_mode === "different" && selectedClient.different_date_details ? (
                          <>
                            <span>💒 Wedding: {formatDateString(selectedClient.different_date_details.wedding?.date || selectedClient.event_date)} ({selectedClient.different_date_details.wedding?.venue || selectedClient.event_venue})</span>
                            <span>•</span>
                            <span>🥂 Reception: {formatDateString(selectedClient.different_date_details.reception?.date)} ({selectedClient.different_date_details.reception?.venue || selectedClient.reception_venue || "TBA"})</span>
                          </>
                        ) : (
                          <>
                            <span>Date: {formatDateString(selectedClient.event_date)}</span>
                            <span>•</span>
                            <span>Venue: {selectedClient.event_venue || "TBA"}</span>
                            {selectedClient.reception_venue && (
                              <>
                                <span>•</span>
                                <span>Reception Venue: {selectedClient.reception_venue}</span>
                              </>
                            )}
                          </>
                        )}
                        <span>•</span>
                        <span>Pkg: {selectedClient.package_name}</span>
                      </p>
                    </div>

                    {/* Sub-tab Navigation */}
                    <div className="flex border-b border-zinc-800 gap-1 pb-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide">
                      {[
                        { id: "details", label: "📋 Entered Details" },
                        { id: "passwords", label: "🔑 Access Passwords" },
                        { id: "photos", label: "📸 Hearts & Selections" },
                        { id: "billing", label: "🧾 Billing & Invoices" }
                      ].map((subTab) => (
                        <button
                          key={subTab.id}
                          type="button"
                          onClick={() => setSelectedClientTab(subTab.id)}
                          className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            selectedClientTab === subTab.id
                              ? "bg-[#b4975a] text-zinc-950 shadow-sm"
                              : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                          }`}
                        >
                          {subTab.label}
                        </button>
                      ))}
                    </div>

                    {/* Password management */}
                    {selectedClientTab === "passwords" && (
                      <div className="space-y-4 bg-zinc-900/40 p-5 border border-zinc-800 rounded-2xl">
                        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                          <ShieldCheck size={16} className="text-[#b4975a]" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Client Access Passwords</h4>
                        </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">👰 Bride Password</label>
                          <input 
                            type="text" 
                            placeholder="Assign password..."
                            value={editBridePassword} 
                            onChange={(e) => setEditBridePassword(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">🤵 Groom Password</label>
                          <input 
                            type="text" 
                            placeholder="Assign password..."
                            value={editGroomPassword} 
                            onChange={(e) => setEditGroomPassword(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => handleSavePasswords(selectedClient.id, editBridePassword, editGroomPassword)}
                        className="px-4 py-2 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        Save Passwords
                      </button>
                    </div>
                    )}

                    {/* Client Entered Details Section */}
                    {selectedClientTab === "details" && (
                      <div className="space-y-4 bg-zinc-900/40 p-5 border border-zinc-800 rounded-2xl">
                        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                          <Users size={16} className="text-[#b4975a]" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Client Entered Details</h4>
                        </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs text-zinc-300">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Primary Contact Name</span>
                          <span className="text-zinc-200 font-medium">{selectedClient.customer_name || "N/A"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Primary Phone / Email</span>
                          <span className="text-zinc-200 font-medium">{selectedClient.customer_phone || "N/A"} {selectedClient.customer_email ? `• ${selectedClient.customer_email}` : ""}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Address & Pincode</span>
                          <span className="text-zinc-200 font-medium">{selectedClient.customer_address || "N/A"} {selectedClient.pincode ? `(PIN: ${selectedClient.pincode})` : ""}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Coverage Side / Scope</span>
                          <span className="text-zinc-200 font-medium capitalize">{selectedClient.coverage_side || "N/A"} Side • {selectedClient.coverage_type || selectedClient.coverage_scope || "N/A"} Side</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Drone Upgrade</span>
                          <span className="text-zinc-200 font-medium capitalize">{selectedClient.need_drone || "no"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Cinematic Video</span>
                          <span className="text-zinc-200 font-medium capitalize">{selectedClient.need_cinematic || "no"}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Preferred Album Size</span>
                          <span className="text-zinc-200 font-medium">{selectedClient.preferred_album_size || "12x18"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Travel / Stay Charges</span>
                          <span className="text-zinc-200 font-medium">Travel: {selectedClient.travel_charges || "Excluded"} • Stay: {selectedClient.stay_charges || "Excluded"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Advance Paid / Balance</span>
                          <span className="text-zinc-200 font-medium">Paid: ₹{formatCurrency(selectedClient.advance_paid)} • Balance: ₹{formatCurrency((selectedClient.total_price || selectedClient.package_price) - (selectedClient.advance_paid || 5000))}</span>
                        </div>

                        {/* Secondary contact details if present */}
                        {(selectedClient.customer_name_2 || selectedClient.customer_phone_2 || selectedClient.customer_email_2 || selectedClient.customer_address_2) && (
                          <>
                            <div className="space-y-1 border-t border-zinc-800/50 pt-2 col-span-1 sm:col-span-2 md:col-span-3">
                              <span className="text-[9px] font-bold text-[#b4975a] uppercase tracking-wider block">Secondary/Alternate Contact Info</span>
                            </div>
                            {selectedClient.customer_name_2 && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Secondary Name</span>
                                <span className="text-zinc-200 font-medium">{selectedClient.customer_name_2}</span>
                              </div>
                            )}
                            {(selectedClient.customer_phone_2 || selectedClient.customer_email_2) && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Secondary Contact</span>
                                <span className="text-zinc-200 font-medium">{selectedClient.customer_phone_2 || "N/A"} {selectedClient.customer_email_2 ? `• ${selectedClient.customer_email_2}` : ""}</span>
                              </div>
                            )}
                            {selectedClient.customer_address_2 && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Secondary Address</span>
                                <span className="text-zinc-200 font-medium">{selectedClient.customer_address_2}</span>
                              </div>
                            )}
                          </>
                        )}

                        {/* Special crew notes / instructions */}
                        {selectedClient.special_notes && (
                          <div className="space-y-1 col-span-1 sm:col-span-2 md:col-span-3">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Special Instructions / Notes</span>
                            <p className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-zinc-400 italic leading-relaxed text-[11px] font-light">
                              "{selectedClient.special_notes}"
                            </p>
                          </div>
                        )}

                        {/* Add-ons */}
                        {selectedClient.add_ons && selectedClient.add_ons.length > 0 && (
                          <div className="space-y-1.5 col-span-1 sm:col-span-2 md:col-span-3">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Selected Add-ons</span>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedClient.add_ons.map((addon, idx) => (
                                <span key={idx} className="bg-[#b4975a]/10 border border-[#b4975a]/20 text-[#b4975a] px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                                  ✨ {addon}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    )}

                    {/* Selected Photos Inspection Section */}
                    {selectedClientTab === "photos" && (
                      <div className="space-y-4 bg-zinc-900/40 p-5 border border-zinc-800 rounded-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <div className="flex items-center gap-2">
                            <Camera size={16} className="text-[#b4975a]" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Client Selected Photos</h4>
                          </div>
                        
                        {/* Quick toggles */}
                        {(() => {
                          const p = projects.find(proj => proj.booking_id === selectedClient.id || proj.couple_name === selectedClient.customer_name);
                          if (!p) return null;
                          return (
                            <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                              {["bride", "groom", "matches"].map(tab => (
                                <button 
                                  key={tab}
                                  onClick={() => setActiveClientPhotoTab(tab)}
                                  className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-wide transition-all cursor-pointer ${
                                    activeClientPhotoTab === tab ? "bg-[#b4975a] text-zinc-950" : "text-zinc-500 hover:text-white"
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      {(() => {
                        const p = projects.find(proj => proj.booking_id === selectedClient.id || proj.couple_name === selectedClient.customer_name);
                        if (!p) {
                          return (
                            <p className="text-[10px] text-zinc-500 italic py-2">
                              No active wedding project spawned yet. Approval unlocks workspace gallery.
                            </p>
                          );
                        }

                        let list = [];
                        if (activeClientPhotoTab === "bride") {
                          list = (p.gallery_images || []).filter(img => img.selected_by_bride !== undefined ? img.selected_by_bride : img.favorited);
                        } else if (activeClientPhotoTab === "groom") {
                          list = (p.gallery_images || []).filter(img => img.selected_by_groom !== undefined ? img.selected_by_groom : img.favorited);
                        } else {
                          list = (p.gallery_images || []).filter(img => {
                            const b = img.selected_by_bride !== undefined ? img.selected_by_bride : img.favorited;
                            const g = img.selected_by_groom !== undefined ? img.selected_by_groom : img.favorited;
                            return b && g;
                          });
                        }

                        const downloadAdminPhotosOneClick = () => {
                          if (list.length === 0) return;
                          list.forEach((img, idx) => {
                            setTimeout(() => {
                              const a = document.createElement("a");
                              a.href = img.url;
                              a.download = `${(p.couple_name || "photo").replace(/\s+/g, "_")}_selected_${img.id}.jpg`;
                              a.target = "_blank";
                              a.rel = "noopener noreferrer";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }, idx * 300);
                          });
                          alert(`📥 Downloading ${list.length} photos in one click. Please allow popups if prompted.`);
                        };

                        const downloadAdminPhotosLinksText = () => {
                          if (list.length === 0) return;
                          const urlsText = list.map(img => img.url).join("\n");
                          const blob = new Blob([urlsText], { type: "text/plain;charset=utf-8" });
                          const blobUrl = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = blobUrl;
                          a.download = `${(p.couple_name || "project").replace(/\s+/g, "_")}_${activeClientPhotoTab}_photo_links.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(blobUrl);
                          alert(`📄 Text file with ${list.length} download links generated!`);
                        };

                        return (
                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <p className="text-[10px] text-zinc-400">
                                Total items: <strong>{list.length} photos</strong> found in {activeClientPhotoTab} list.
                              </p>
                              {list.length > 0 && (
                                <div className="flex gap-1.5 mt-1 sm:mt-0">
                                  <button
                                    onClick={downloadAdminPhotosOneClick}
                                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1 transition-colors cursor-pointer border border-zinc-700"
                                    title="Download all selected photos in one click (staggered)"
                                  >
                                    <Download size={10} />
                                    Download (1-Click)
                                  </button>
                                  <button
                                    onClick={downloadAdminPhotosLinksText}
                                    className="px-2.5 py-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-350 border border-zinc-800 hover:border-zinc-700 text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Generate a text file containing direct download URLs"
                                  >
                                    <FileText size={10} />
                                    Get Links (.txt)
                                  </button>
                                </div>
                              )}
                            </div>
                            {list.length === 0 ? (
                              <div className="py-8 text-center text-[10px] text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                                No hearted photos found for this filter.
                              </div>
                            ) : (
                              <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1 bg-zinc-950/45 rounded-xl border border-zinc-850">
                                {list.map(img => (
                                  <a key={img.id} href={img.url} target="_blank" rel="noreferrer" className="block relative aspect-square group overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                                    <img src={img.url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300" alt="" />
                                    <span className="absolute bottom-1 right-1 bg-black/75 px-1 py-0.5 text-[7px] font-mono text-zinc-400 rounded">
                                      #{img.id}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    )}

                    {/* Invoice Actions */}
                    {selectedClientTab === "billing" && (
                      <div className="space-y-4 bg-zinc-900/40 p-5 border border-zinc-800 rounded-2xl">
                        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                          <FileText size={16} className="text-[#b4975a]" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Invoice Billing & Actions</h4>
                        </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Net balance due</span>
                          <p className="text-base font-bold text-white">
                            ₹ {Number((selectedClient.total_price || selectedClient.package_price) - (selectedClient.advance_paid || 5000)).toLocaleString("en-IN")}/-
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => setActiveInvoiceBooking(selectedClient)}
                            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <FileText size={11} /> Invoice Receipt
                          </button>
                          
                          <button 
                            onClick={() => {
                              const includesPrewedding = (parseInt(selectedClient.package_price || selectedClient.total_price) === 49999 || parseInt(selectedClient.package_price || selectedClient.total_price) === 99999 || parseInt(selectedClient.package_price || selectedClient.total_price) === 110000);
                              const surpriseBonusText = includesPrewedding ? `🎁 SURPRISE BONUS: Free Save the Date Photoshoot (worth ₹9,999/-) included!\n` : '';
                              const message = `Hi ${selectedClient.customer_name}! Here is your Digital Invoice Receipt for locking in your Wedding Package slot:\n\n` +
                                              `👤 Name: ${selectedClient.customer_name}\n` +
                                              `📞 Phone: ${selectedClient.customer_phone}\n` +
                                              `📍 Pincode: ${selectedClient.pincode || ''}\n` +
                                              `📦 Plan: ${selectedClient.package_name}\n` +
                                              `💰 Quote: ₹${parseInt(selectedClient.package_price || selectedClient.total_price).toLocaleString()}/- Net\n` +
                                              surpriseBonusText + `\n` +
                                              `UPI: dreamwedstories@okaxis\n` +
                                              `Passwords Assigned:\n` +
                                              (selectedClient.coverage_type === 'both' || selectedClient.coverage_scope === 'both' ? `Bride: ${selectedClient.bride_password}\nGroom: ${selectedClient.groom_password}` : `Login: ${selectedClient.groom_password}`);
                              window.open(`https://wa.me/91${selectedClient.customer_phone}?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Share2 size={11} /> Share
                          </button>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                ) : (
                  <div className="h-96 rounded-[32px] border border-dashed border-zinc-800 bg-zinc-950/20 flex items-center justify-center text-zinc-500 text-xs">
                    Select a client workspace from the left pane to manage access, receipts, and co-selections.
                  </div>
                  )}
                </div>
              </div>
            {/* Create Client Modal */}
            {showCreateClientModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl rounded-[32px] p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6 relative text-left shadow-2xl">
                  <button 
                    type="button"
                    onClick={() => setShowCreateClientModal(false)}
                    className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-full transition-all border border-zinc-800 cursor-pointer"
                  >
                    <X size={16} />
                  </button>

                  <div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-white font-light">
                      Create <span className="italic font-serif text-[#b4975a]">Custom Booking</span>
                    </h3>
                    <p className="text-zinc-500 text-[11px] font-light mt-1">Fill out the package customization and contact details below to generate passwords and invoice.</p>
                  </div>

                  <form onSubmit={handleCreateClient} className="space-y-6">
                    {/* 1. Core Contact Information */}
                    <div className="bg-zinc-900/30 p-5 border border-zinc-800 rounded-2xl space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#b4975a] border-b border-zinc-800 pb-1.5">1. Primary Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Client Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Amritha & Sandeep"
                            value={newClientFormData.customer_name}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, customer_name: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Phone Number *</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="10-digit number"
                            value={newClientFormData.customer_phone}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, customer_phone: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="client@gmail.com"
                            value={newClientFormData.customer_email}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, customer_email: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Home/Billing Address</label>
                          <input 
                            type="text" 
                            placeholder="Full street name, building number"
                            value={newClientFormData.customer_address}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, customer_address: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Pincode</label>
                          <input 
                            type="text" 
                            placeholder="695001"
                            value={newClientFormData.pincode}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, pincode: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Package Customization Details */}
                    <div className="bg-zinc-900/30 p-5 border border-zinc-800 rounded-2xl space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#b4975a] border-b border-zinc-800 pb-1.5">2. Customized Package Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Package Plan Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Custom Premium Photo + Cinematic Package"
                            value={newClientFormData.package_name}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, package_name: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Total Price / Quote (₹) *</label>
                          <input 
                            type="number" 
                            required
                            placeholder="Total Quote"
                            value={newClientFormData.package_price}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, package_price: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Advance Paid (₹) *</label>
                          <input 
                            type="number" 
                            required
                            placeholder="Advance paid"
                            value={newClientFormData.advance_paid}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, advance_paid: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Schedule & Locations */}
                    <div className="bg-zinc-900/30 p-5 border border-zinc-800 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#b4975a]">3. Event Schedule & Venues</h4>
                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                              type="radio" 
                              name="wedding_reception_mode"
                              checked={newClientFormData.wedding_reception_mode === "same"}
                              onChange={() => setNewClientFormData({ ...newClientFormData, wedding_reception_mode: "same" })}
                              className="accent-[#b4975a]"
                            />
                            Same Day Event
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                              type="radio" 
                              name="wedding_reception_mode"
                              checked={newClientFormData.wedding_reception_mode === "different"}
                              onChange={() => setNewClientFormData({ ...newClientFormData, wedding_reception_mode: "different" })}
                              className="accent-[#b4975a]"
                            />
                            Different Days
                          </label>
                        </div>
                      </div>

                      {newClientFormData.wedding_reception_mode === "same" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Event Date *</label>
                            <input 
                              type="date" 
                              required={newClientFormData.wedding_reception_mode === "same"}
                              value={newClientFormData.event_date}
                              onChange={(e) => setNewClientFormData({ ...newClientFormData, event_date: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Event Venue *</label>
                            <input 
                              type="text" 
                              required={newClientFormData.wedding_reception_mode === "same"}
                              placeholder="Convention Center name / Location"
                              value={newClientFormData.event_venue}
                              onChange={(e) => setNewClientFormData({ ...newClientFormData, event_venue: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-zinc-800/40 pb-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold text-[#b4975a] uppercase tracking-wider">Wedding Date *</label>
                              <input 
                                type="date" 
                                required={newClientFormData.wedding_reception_mode === "different"}
                                value={newClientFormData.different_date_details.wedding.date}
                                onChange={(e) => {
                                  const updated = { ...newClientFormData.different_date_details };
                                  updated.wedding.date = e.target.value;
                                  setNewClientFormData({ ...newClientFormData, different_date_details: updated, event_date: e.target.value });
                                }}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold text-[#b4975a] uppercase tracking-wider">Wedding Venue *</label>
                              <input 
                                type="text" 
                                required={newClientFormData.wedding_reception_mode === "different"}
                                placeholder="Wedding location / Auditorium"
                                value={newClientFormData.different_date_details.wedding.venue}
                                onChange={(e) => {
                                  const updated = { ...newClientFormData.different_date_details };
                                  updated.wedding.venue = e.target.value;
                                  setNewClientFormData({ ...newClientFormData, different_date_details: updated, event_venue: e.target.value });
                                }}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold text-[#b4975a] uppercase tracking-wider">Reception Date *</label>
                              <input 
                                type="date" 
                                required={newClientFormData.wedding_reception_mode === "different"}
                                value={newClientFormData.different_date_details.reception.date}
                                onChange={(e) => {
                                  const updated = { ...newClientFormData.different_date_details };
                                  updated.reception.date = e.target.value;
                                  setNewClientFormData({ ...newClientFormData, different_date_details: updated });
                                }}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold text-[#b4975a] uppercase tracking-wider">Reception Venue *</label>
                              <input 
                                type="text" 
                                required={newClientFormData.wedding_reception_mode === "different"}
                                placeholder="Reception location / Auditorium"
                                value={newClientFormData.different_date_details.reception.venue}
                                onChange={(e) => {
                                  const updated = { ...newClientFormData.different_date_details };
                                  updated.reception.venue = e.target.value;
                                  setNewClientFormData({ ...newClientFormData, different_date_details: updated });
                                }}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Creative Scope & Specs */}
                    <div className="bg-zinc-900/30 p-5 border border-zinc-800 rounded-2xl space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#b4975a] border-b border-zinc-800 pb-1.5">4. Coverage Scope & specifications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Coverage Scope</label>
                          <select 
                            value={newClientFormData.coverage_scope}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, coverage_scope: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-[#b4975a] focus:outline-none"
                          >
                            <option value="both">Both (Bride & Groom sides)</option>
                            <option value="bride">Bride Side Only</option>
                            <option value="groom">Groom Side Only</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Drone Upgrade</label>
                          <select 
                            value={newClientFormData.need_drone}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, need_drone: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-[#b4975a] focus:outline-none"
                          >
                            <option value="no">No Drone Included</option>
                            <option value="yes">Yes (Standard Dual Drone)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Cinematic Film</label>
                          <select 
                            value={newClientFormData.need_cinematic}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, need_cinematic: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-[#b4975a] focus:outline-none"
                          >
                            <option value="no">Traditional Video Only</option>
                            <option value="yes">Yes (Cinematic + Teaser)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Album Size Spec</label>
                          <select 
                            value={newClientFormData.preferred_album_size}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, preferred_album_size: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-[#b4975a] focus:outline-none"
                          >
                            <option value="12x18">12x18 Inches Standard</option>
                            <option value="12x15">12x15 Inches Compact</option>
                            <option value="10x14">10x14 Inches Portrait</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 5. Custom Client Logins */}
                    <div className="bg-zinc-900/30 p-5 border border-zinc-800 rounded-2xl space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#b4975a] border-b border-zinc-800 pb-1.5">5. Access Passwords (Optional)</h4>
                      <p className="text-[9px] text-zinc-500 -mt-2">Leave blank to let the system generate randomized passwords automatically.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {newClientFormData.coverage_scope === "both" && (
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">👰 Bride Login Password</label>
                            <input 
                              type="text" 
                              placeholder="e.g. bride778"
                              value={newClientFormData.custom_bride_password}
                              onChange={(e) => setNewClientFormData({ ...newClientFormData, custom_bride_password: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                            />
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                            {newClientFormData.coverage_scope === "both" ? "🤵 Groom Login Password" : "🔑 Portal Login Password"}
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. groom442"
                            value={newClientFormData.custom_groom_password}
                            onChange={(e) => setNewClientFormData({ ...newClientFormData, custom_groom_password: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 6. Alternate / Secondary Contact Toggle */}
                    <div className="bg-zinc-900/30 p-5 border border-zinc-800 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#b4975a]">6. Secondary / Alternate Contact Info (Optional)</h4>
                        <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={newClientFormData.show_secondary}
                            onChange={() => setNewClientFormData({ ...newClientFormData, show_secondary: !newClientFormData.show_secondary })}
                            className="rounded border-zinc-800 text-[#b4975a] focus:ring-0 accent-[#b4975a]"
                          />
                          Add Alternate Contact
                        </label>
                      </div>

                      {newClientFormData.show_secondary && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Alternate Contact Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Brother / Parent Name"
                              value={newClientFormData.customer_name_2}
                              onChange={(e) => setNewClientFormData({ ...newClientFormData, customer_name_2: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Alternate Phone</label>
                            <input 
                              type="tel" 
                              placeholder="10-digit number"
                              value={newClientFormData.customer_phone_2}
                              onChange={(e) => setNewClientFormData({ ...newClientFormData, customer_phone_2: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Alternate Email</label>
                            <input 
                              type="email" 
                              placeholder="alternate@gmail.com"
                              value={newClientFormData.customer_email_2}
                              onChange={(e) => setNewClientFormData({ ...newClientFormData, customer_email_2: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5 md:col-span-3">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Alternate Address</label>
                            <input 
                              type="text" 
                              placeholder="Secondary billing address"
                              value={newClientFormData.customer_address_2}
                              onChange={(e) => setNewClientFormData({ ...newClientFormData, customer_address_2: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 7. Special Crew Notes */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Special Crew Instructions / Custom Details Notes</label>
                      <textarea 
                        placeholder="Enter any customization specifications, location requests, or delivery notes..."
                        rows={4}
                        value={newClientFormData.special_notes}
                        onChange={(e) => setNewClientFormData({ ...newClientFormData, special_notes: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-zinc-900 pt-5">
                      <button 
                        type="button"
                        onClick={() => setShowCreateClientModal(false)}
                        className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-zinc-800"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={clientFormSaving}
                        className="px-7 py-2.5 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center gap-2"
                      >
                        {clientFormSaving ? "Creating..." : "Create Workspace"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =============================== STAFF TAB ================================ */}
        {activeTab === "staff" && (
          <div className="space-y-8 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light">
                  Staff <span className="italic font-serif text-[#b4975a]">Accounts</span>
                </h2>
                <p className="text-zinc-500 text-[11px] font-light mt-1">Create, manage, and assign editor & designer accounts to wedding projects.</p>
              </div>
              <button onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95">
                <Plus size={14} /> New Staff Account
              </button>
            </div>

            {/* Create Staff Form */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-6 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create New Staff Account</h3>
                    <button onClick={() => setShowCreateForm(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                  <form onSubmit={handleCreateStaff} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Display Name</label>
                      <input type="text" placeholder="e.g. Rahul Editor"
                        value={newStaff.display_name}
                        onChange={(e) => setNewStaff({ ...newStaff, display_name: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Role</label>
                      <select value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none">
                        <option value="editor">🎥 Video Editor</option>
                        <option value="designer">📖 Album Designer</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Username *</label>
                      <input type="text" placeholder="e.g. rahul_editor" required
                        value={newStaff.username}
                        onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Password *</label>
                      <input type="text" placeholder="Set a secure password" required
                        value={newStaff.password}
                        onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <button type="submit" disabled={staffSaving}
                        className="w-full py-3 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2">
                        <Save size={14} /> {staffSaving ? "Creating..." : "Create Account"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Staff List */}
            {staffUsers.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-[24px] text-zinc-500 text-xs">
                No staff accounts created yet. Click "New Staff Account" to add editors and designers.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {staffUsers.map((staff) => (
                  <div key={staff.id} className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-5 space-y-4 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/3 rounded-full blur-2xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm uppercase border ${
                          staff.role === "designer" ? "bg-purple-500/10 border-purple-500/20 text-purple-300" : "bg-blue-500/10 border-blue-500/20 text-blue-300"
                        }`}>
                          {staff.display_name?.charAt(0) || staff.username?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{staff.display_name || staff.username}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {getRoleIcon(staff.role)}
                            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                              {staff.role === "designer" ? "Album Designer" : "Video Editor"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteStaff(staff.id, staff.display_name || staff.username)}
                        className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Credentials display */}
                    <div className="bg-zinc-800 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Login Username</span>
                        <span className="text-zinc-200 font-mono">{staff.username}</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Password</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-200 font-mono">
                            {showPassId === staff.id ? staff.password : "••••••••"}
                          </span>
                          <button onClick={() => setShowPassId(showPassId === staff.id ? null : staff.id)}
                            className="text-zinc-500 hover:text-[#b4975a] transition-colors cursor-pointer">
                            {showPassId === staff.id ? <EyeOff size={11} /> : <Eye size={11} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Project assignment */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Assigned Projects</span>
                        <button onClick={() => setAssigningStaffId(assigningStaffId === staff.id ? null : staff.id)}
                          className="text-[9px] text-[#b4975a] font-bold uppercase tracking-wider hover:underline cursor-pointer">
                          {assigningStaffId === staff.id ? "Done" : "Manage"}
                        </button>
                      </div>

                      {assigningStaffId === staff.id ? (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {projects.map((p) => {
                            const isAssigned = (staff.assigned_projects || []).includes(p.id);
                            return (
                              <label key={p.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 cursor-pointer">
                                <input type="checkbox" checked={isAssigned}
                                  onChange={(e) => handleAssignProject(staff.id, p.id, e.target.checked)}
                                  className="accent-[#b4975a] w-3.5 h-3.5 cursor-pointer" />
                                <span className="text-[10px] text-zinc-300 font-medium">{p.couple_name}</span>
                                <span className="text-[9px] text-zinc-500 ml-auto">{formatDateString(p.wedding_date)}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {(staff.assigned_projects || []).length === 0 ? (
                            <span className="text-[9px] text-zinc-600 italic">No projects assigned yet</span>
                          ) : (
                            (staff.assigned_projects || []).map((pId) => {
                              const proj = projects.find(p => p.id === pId);
                              return proj ? (
                                <span key={pId} className="text-[9px] bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-700 font-medium">
                                  {proj.couple_name}
                                </span>
                              ) : null;
                            })
                          )}
                        </div>
                      )}
                    </div>

                    {/* Portal link hint */}
                    <div className="pt-2 border-t border-zinc-800 text-[9px] text-zinc-500 font-light">
                      Login at: <span className="text-[#b4975a] font-bold">
                        {staff.role === "designer" ? "/designer" : "/editor"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================== CHATS TAB ================================ */}
        {activeTab === "chats" && (
          <div className="space-y-6 text-left">
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light">
                Chat <span className="italic font-serif text-[#b4975a]">Viewer</span>
              </h2>
              <p className="text-zinc-500 text-[11px] font-light mt-1">Monitor all project communication channels in real-time.</p>
            </div>

            {/* Project selector + channel selector */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-1.5 flex-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Select Project</label>
                <select value={chatProject?.id || ""}
                  onChange={(e) => {
                    const p = projects.find(proj => proj.id === Number(e.target.value));
                    setChatProject(p || null);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none">
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.couple_name} — {formatDateString(p.wedding_date)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 flex-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Select Channel</label>
                <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  {CHANNELS.map((ch) => (
                    <button key={ch.id} onClick={() => setChatChannel(ch.id)}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wide transition-all cursor-pointer text-center whitespace-nowrap ${
                        chatChannel === ch.id ? "bg-zinc-950 text-white shadow-sm border border-zinc-700" : "text-zinc-500 hover:text-white"
                      }`}>
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <button onClick={loadChats}
                  className="flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>
            </div>

            {/* Chat feed */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[24px] overflow-hidden">
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">{chatProject?.couple_name || "—"}</span>
                  <span className="text-zinc-500 text-[10px] font-light ml-2">
                    {CHANNELS.find(c => c.id === chatChannel)?.label}
                  </span>
                </div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  {chatMessages.length} message{chatMessages.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Messages */}
              <div className="p-6 min-h-[300px] max-h-[500px] overflow-y-auto bg-[#1a1a1a] flex flex-col gap-3.5">
                {chatLoading ? (
                  <div className="my-auto text-center text-zinc-500 text-xs">Loading messages...</div>
                ) : chatMessages.length === 0 ? (
                  <div className="my-auto text-center text-zinc-600 text-xs font-light">
                    No messages in this channel yet.
                  </div>
                ) : (
                  chatMessages.map((m) => {
                    const isClient = m.sender === "client";
                    const senderLabel = isClient ? "Client" :
                      m.sender === "admin" ? "Admin" :
                      m.sender === "editor" ? "Video Editor" :
                      m.sender === "designer" ? "Album Designer" : m.sender;
                    return (
                      <div key={m.id} className={`flex flex-col ${isClient ? "items-end" : "items-start"} max-w-[80%] ${isClient ? "self-end" : "self-start"}`}>
                        <span className="text-[8px] text-zinc-500 mb-0.5 px-1">{senderLabel} • {formatTime(m.timestamp)}</span>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                          isClient
                            ? "bg-[#d9fdd3] border-[#d9fdd3] text-zinc-800 rounded-br-sm"
                            : m.sender === "admin"
                            ? "bg-amber-500/15 border-amber-500/20 text-amber-100 rounded-bl-sm"
                            : "bg-zinc-800 border-zinc-700 text-zinc-200 rounded-bl-sm"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* =============================== AI GALLERIES TAB ================================ */}
        {activeTab === "ai-galleries" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* Gallery Creation Sidebar */}
            <div className="lg:col-span-5 xl:col-span-4 bg-zinc-950 border border-zinc-800 rounded-[28px] p-6 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Camera size={16} className="text-[#b4975a]" /> Create Dreamwed Gallery
              </h3>
              
              <form onSubmit={handleCreateAiGallery} className="space-y-4">
                {/* Groom & Bride Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Groom Name</label>
                    <input type="text" placeholder="e.g., Akash"
                      value={newGroomName} onChange={(e) => setNewGroomName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Bride Name</label>
                    <input type="text" placeholder="e.g., Ananya"
                      value={newBrideName} onChange={(e) => setNewBrideName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                  </div>
                </div>

                {/* Wedding Date & Location */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Wedding Date (Optional)</label>
                    <input type="text" placeholder="e.g., 12 Feb 2026"
                      value={newWeddingDate} onChange={(e) => setNewWeddingDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Location / Venue</label>
                    <input type="text" placeholder="e.g., Kochi, Kerala"
                      value={newWeddingLocation} onChange={(e) => setNewWeddingLocation(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                  </div>
                </div>

                {/* 2 Dedicated Access Passcodes */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold text-[#b4975a] uppercase tracking-widest flex items-center gap-1.5">
                      <Lock size={11} /> 2 Dedicated Access Passcodes
                    </label>
                    <button
                      type="button"
                      onClick={handleRegenerateRandomCodes}
                      className="text-[9px] text-[#b4975a] hover:text-white font-bold transition-all cursor-pointer flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800 hover:border-[#b4975a] active:scale-95"
                      title="Generate Fresh Random Codes"
                    >
                      <RefreshCw size={10} /> Auto-Generate
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                        👥 Guest Code (AI Story)
                      </label>
                      <input type="text" placeholder="e.g. 4821"
                        value={newGuestCode} onChange={(e) => setNewGuestCode(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#b4975a] focus:outline-none font-bold tracking-widest" />
                      <span className="text-[7.5px] text-zinc-500 block leading-tight">Numeric code for guests to view AI story</span>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-pink-400 uppercase tracking-wider block flex items-center gap-1">
                        💍 Selection Code (Couple)
                      </label>
                      <input type="text" placeholder="e.g. 8392"
                        value={newSelectionCode} onChange={(e) => setNewSelectionCode(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#b4975a] focus:outline-none font-bold tracking-widest" />
                      <span className="text-[7.5px] text-zinc-500 block leading-tight">Prompts Bride or Groom to select photos</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Wedding Event Title (Optional)</label>
                  <input type="text" placeholder="e.g., The Royal Wedding Ceremony (or leave blank)"
                    value={newGalName} onChange={(e) => setNewGalName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Primary Google Drive Link</label>
                  <input type="url" placeholder="https://drive.google.com/drive/folders/..." required
                    value={newGalDrive} onChange={(e) => setNewGalDrive(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Additional Drive Link (Optional / Secondary)</label>
                  <input type="url" placeholder="https://drive.google.com/... (e.g. Extra photos, Haldi, Reception, or RAW files)"
                    value={newGalExtraDrive} onChange={(e) => setNewGalExtraDrive(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                </div>

                {/* ================= COVER IMAGE DESIGNER & STUDIO ================= */}
                <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold text-[#b4975a] uppercase tracking-widest flex items-center gap-1.5">
                      <ImageIcon size={12} /> Gallery Cover Studio
                    </label>
                    <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-mono">Hero Branding</span>
                  </div>

                  {/* Mode Switcher */}
                  <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-850">
                    <button
                      type="button"
                      onClick={() => setCoverInputMode("upload")}
                      className={`py-1.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        coverInputMode === "upload" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <Upload size={10} /> Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverInputMode("url")}
                      className={`py-1.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        coverInputMode === "url" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <Link2 size={10} /> Paste Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverInputMode("presets")}
                      className={`py-1.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        coverInputMode === "presets" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <Sparkles size={10} /> Presets
                    </button>
                  </div>

                  {/* Tab 1: Upload File */}
                  {coverInputMode === "upload" && (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingCover(true); }}
                      onDragLeave={() => setIsDraggingCover(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingCover(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleCoverFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                        isDraggingCover
                          ? "border-[#b4975a] bg-[#b4975a]/10"
                          : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/60"
                      }`}
                    >
                      <input
                        type="file"
                        id="cover-upload-input"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleCoverFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                      <label htmlFor="cover-upload-input" className="cursor-pointer block space-y-1.5">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#b4975a]">
                          <Upload size={14} />
                        </div>
                        <div className="text-[10px] text-zinc-300 font-medium">
                          Click to browse device or drag & drop photo
                        </div>
                        <div className="text-[8px] text-zinc-500">Supports high-res JPG, PNG, WEBP</div>
                      </label>
                    </div>
                  )}

                  {/* Tab 2: URL Input */}
                  {coverInputMode === "url" && (
                    <input
                      type="url"
                      placeholder="https://... (Direct image link or Google Drive thumbnail)"
                      value={newGalCover}
                      onChange={(e) => setNewGalCover(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                    />
                  )}

                  {/* Tab 3: Presets */}
                  {coverInputMode === "presets" && (
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "Warm Rose Altar", url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800" },
                        { name: "Couple Celebration", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800" },
                        { name: "Golden Mandap", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800" },
                        { name: "Luxury Details", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800" }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setNewGalCover(preset.url)}
                          className={`relative rounded-xl overflow-hidden border text-left p-1.5 transition-all cursor-pointer group ${
                            newGalCover === preset.url ? "border-[#b4975a] ring-1 ring-[#b4975a]" : "border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-12 object-cover rounded-lg" />
                          <span className="text-[8px] font-bold text-zinc-300 truncate block mt-1 px-0.5">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ================= STYLING CONTROLS ================= */}
                  <div className="pt-2 border-t border-zinc-800/80 space-y-3">
                    {/* 1. Photo Focus Precision Slider Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">
                          Photo Focus Alignment
                        </label>
                        <span className="text-[8px] font-mono text-[#b4975a] font-bold">
                          {typeof newGalCoverAlign === 'number' || !isNaN(Number(newGalCoverAlign)) 
                            ? `${newGalCoverAlign}%` 
                            : (newGalCoverAlign === 'top' ? '0% (Top)' : (newGalCoverAlign === 'bottom' ? '100% (Bottom)' : '50% (Center)'))}
                        </span>
                      </div>
                      
                      <div className="space-y-1 bg-zinc-950 p-2.5 rounded-xl border border-zinc-850">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={typeof newGalCoverAlign === 'number' || !isNaN(Number(newGalCoverAlign)) ? Number(newGalCoverAlign) : (newGalCoverAlign === 'top' ? 0 : (newGalCoverAlign === 'bottom' ? 100 : 50))}
                          onChange={(e) => setNewGalCoverAlign(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#b4975a]"
                        />
                        <div className="flex justify-between text-[7px] text-zinc-500 font-mono px-0.5 pt-0.5">
                          <button type="button" onClick={() => setNewGalCoverAlign(0)} className="hover:text-white cursor-pointer">0% Top</button>
                          <button type="button" onClick={() => setNewGalCoverAlign(25)} className="hover:text-white cursor-pointer">25% Upper</button>
                          <button type="button" onClick={() => setNewGalCoverAlign(50)} className="hover:text-[#b4975a] font-bold cursor-pointer">50% Center</button>
                          <button type="button" onClick={() => setNewGalCoverAlign(75)} className="hover:text-white cursor-pointer">75% Lower</button>
                          <button type="button" onClick={() => setNewGalCoverAlign(100)} className="hover:text-white cursor-pointer">100% Bottom</button>
                        </div>
                      </div>
                    </div>

                    {/* Text Alignment */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Text Align</label>
                      <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-850">
                        {["left", "center", "right"].map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => setNewGalCoverTextAlign(align)}
                            className={`py-1 text-[8px] font-bold uppercase rounded capitalize transition-all cursor-pointer ${
                              newGalCoverTextAlign === align ? "bg-[#b4975a] text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Typography Font Style */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Typography Font Style</label>
                      <select
                        value={newGalCoverFont}
                        onChange={(e) => setNewGalCoverFont(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 text-xs focus:border-[#b4975a] focus:outline-none cursor-pointer"
                      >
                        {GALLERY_FONTS.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.label})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Theme & Accent Color Palette */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Theme / Accent Color</label>
                        <span className="text-[8px] font-mono text-zinc-500">{newGalCoverColor}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap bg-zinc-950 p-2 rounded-xl border border-zinc-850">
                        {GALLERY_COLORS.map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setNewGalCoverColor(c.hex)}
                            title={c.name}
                            className={`w-6 h-6 rounded-full transition-transform cursor-pointer border relative flex items-center justify-center ${
                              (newGalCoverColor || "#b4975a").toLowerCase() === c.hex.toLowerCase()
                                ? "scale-110 border-white ring-2 ring-[#b4975a]"
                                : "border-zinc-700 hover:scale-105 opacity-80 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: c.hex }}
                          >
                            {(newGalCoverColor || "#b4975a").toLowerCase() === c.hex.toLowerCase() && (
                              <Check size={11} className={c.hex === "#f8fafc" ? "text-black" : "text-white"} />
                            )}
                          </button>
                        ))}
                        <input
                          type="color"
                          value={newGalCoverColor || "#b4975a"}
                          onChange={(e) => setNewGalCoverColor(e.target.value)}
                          className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0 p-0 overflow-hidden"
                          title="Custom Hex Color"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ================= LIVE REALISTIC MOCKUP STUDIO ================= */}
                  {newGalCover && (
                    <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-xl group">
                      <div className="relative h-32 w-full">
                        <img 
                          src={newGalCover} 
                          alt="Cover Preview" 
                          style={{ objectPosition: getObjectPositionStyle(newGalCoverAlign) }}
                          className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3.5 text-${newGalCoverTextAlign || "center"} items-${newGalCoverTextAlign === "left" ? "start" : (newGalCoverTextAlign === "right" ? "end" : "center")}`}>
                          <span style={{ color: newGalCoverColor || "#b4975a" }} className="text-[7px] uppercase font-bold tracking-widest">
                            Live Lock Preview
                          </span>
                          <span 
                            style={{ 
                              fontFamily: GALLERY_FONTS.find(f => f.id === newGalCoverFont)?.family || "'Cormorant Garamond', serif"
                            }} 
                            className="text-base text-white font-medium truncate leading-tight mt-0.5"
                          >
                            {newGroomName && newBrideName ? (
                              <>
                                <span>{newGroomName}</span>{" "}
                                <span style={{ color: newGalCoverColor || "#b4975a" }} className="italic font-serif">&amp;</span>{" "}
                                <span>{newBrideName}</span>
                              </>
                            ) : (
                              newGalName || "Groom & Bride"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="bg-zinc-950 px-3 py-1.5 border-t border-zinc-850 flex items-center justify-between text-[9px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: newGalCoverColor || "#b4975a" }} />
                          Custom Style Configured
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewGalCover("")}
                          className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit"
                  className="w-full py-3.5 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#b4975a]/10">
                  <Plus size={14} /> Create Dreamwed Gallery
                </button>
              </form>
            </div>

            {/* Galleries list */}
            <div className="lg:col-span-7 xl:col-span-8 bg-zinc-950 border border-zinc-800 rounded-[28px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
                💍 Active Dreamwed Galleries ({Array.isArray(aiGalleries) ? aiGalleries.length : 0})
              </h3>
              
              {(!Array.isArray(aiGalleries) || aiGalleries.length === 0) ? (
                <div className="text-center py-16 text-zinc-600 text-xs font-light">No active Dreamwed galleries found.</div>
              ) : (
                <div className="space-y-3.5">
                  {aiGalleries.map((g) => {
                    const gCode = g?.guestCode || (g?.accessCode && !g?.selectionCode ? g.accessCode : "1000");
                    const sCode = g?.selectionCode || (g?.accessCode && g?.accessCode !== gCode ? g.accessCode : "8000");
                    const selectedCount = (g?.selectedCount || (Array.isArray(g?.selectedPhotoIds) ? g.selectedPhotoIds.length : 0)) || 0;
                    const photosCount = (g?.photosCount || (Array.isArray(g?.photos) ? g.photos.length : 0)) || 0;
                    const galleryUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/gallery/${g?.id || ""}`;

                    return (
                      <div key={g?.id || Math.random()} className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg hover:border-zinc-700/80 transition-all">
                        {/* 1. Header: Thumbnail, Name, Passcodes & Link */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <img 
                              src={g?.coverUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"} 
                              className="w-14 h-14 rounded-xl object-cover border border-zinc-750 shrink-0 shadow-md" 
                              alt="Wedding Cover" 
                            />
                            <div className="space-y-1 min-w-0">
                              <h4 className="font-bold text-white text-sm truncate">{g?.name || "Dreamwed Wedding"}</h4>
                              
                              {/* 2 Dedicated Links Copy Buttons */}
                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const link = `${galleryUrl}?view=guest`;
                                    navigator.clipboard.writeText(link);
                                    alert(`✨ Guest AI Story Link Copied!\n\n${link}\nPasscode: ${gCode}`);
                                  }}
                                  className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 border border-amber-500/25 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                                  title="Copy Guest Link (AI 3-Tier Story)"
                                >
                                  <Sparkles size={10} /> Copy Guest Link
                                </button>

                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const link = `${galleryUrl}?view=selection`;
                                    navigator.clipboard.writeText(link);
                                    alert(`💍 Couple Selection Link Copied!\n\n${link}\nPasscode: ${sCode}`);
                                  }}
                                  className="px-2 py-1 bg-pink-500/10 hover:bg-pink-500 hover:text-white text-pink-300 border border-pink-500/25 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                                  title="Copy Couple Album Selection Link"
                                >
                                  <Heart size={10} /> Copy Selection Link
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Passcode Badges */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                            <span className="text-[10px] text-amber-400 font-bold bg-amber-950/40 px-2.5 py-1 border border-amber-800/40 rounded-lg flex items-center gap-1.5 shadow-sm">
                              👥 Guest: <strong className="text-white font-mono tracking-wider">{gCode}</strong>
                            </span>
                            <span className="text-[10px] text-pink-400 font-bold bg-pink-950/40 px-2.5 py-1 border border-pink-800/40 rounded-lg flex items-center gap-1.5 shadow-sm">
                              💍 Selection: <strong className="text-white font-mono tracking-wider">{sCode}</strong>
                            </span>
                          </div>
                        </div>

                        {/* 2. Action Toolbar: Clean, fully visible, non-overflowing buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-zinc-800/70">
                          {/* Left Action Group (Sharing & Selections) */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* 💬 WhatsApp Invite Button */}
                            <button
                              onClick={() => handleCopyWhatsAppInvite(g)}
                              className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 hover:text-white text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                              title="Copy WhatsApp Group Invite Message"
                            >
                              <Share2 size={12} />
                              <span>Invite Group</span>
                            </button>

                            {/* 📥 View & Download Selected Photos */}
                            <button 
                              onClick={() => handleOpenSelectedPhotos(g?.id)}
                              className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                                selectedCount > 0 
                                  ? "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-600 hover:text-white" 
                                  : "bg-zinc-800/80 text-zinc-400 border-zinc-750 hover:text-white"
                              }`}
                              title="View & Download Selected Photos in 1 Click"
                            >
                              <Heart size={12} className={selectedCount > 0 ? "fill-red-400 text-red-400" : ""} />
                              <span>Selected ({selectedCount})</span>
                            </button>

                            {/* Shareable Download Link */}
                            <button 
                              onClick={() => handleCopyShareDownloadLink(g?.id)}
                              className="p-2 rounded-xl bg-[#b4975a]/10 hover:bg-[#b4975a] hover:text-zinc-950 text-[#b4975a] border border-[#b4975a]/30 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                              title="Copy Shareable Selections Download Link"
                            >
                              <Share2 size={13} />
                            </button>
                          </div>

                          {/* Right Action Group (Sync, Drive, Cover, Delete) */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* 🔄 Sync Photos from Drive */}
                            <button 
                              onClick={() => handleSyncDrivePhotos(g?.id)}
                              disabled={syncingGalId === g?.id}
                              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-[#b4975a] hover:text-zinc-950 text-white text-[10px] font-bold uppercase tracking-wider border border-zinc-750 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                            >
                              {syncingGalId === g?.id ? (
                                <>
                                  <RefreshCw size={12} className="animate-spin" />
                                  <span>Syncing...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw size={12} />
                                  <span>Sync ({photosCount})</span>
                                </>
                              )}
                            </button>
                            
                            {/* Drive Links */}
                            {g?.gdriveLink && (
                              <a 
                                href={g.gdriveLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-2.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-[#b4975a] border border-zinc-750 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                title="Open Google Drive Folder"
                              >
                                <span>Drive ↗</span>
                              </a>
                            )}

                            {/* 🎨 Edit Cover Button */}
                            <button
                              onClick={() => {
                                setEditingCoverGallery(g);
                                setEditCoverValue(g?.coverUrl || "");
                                setEditCoverAlign(g?.coverAlign || "center");
                                setEditCoverTextAlign(g?.coverTextAlign || "center");
                                setEditCoverFont(g?.coverFont || "cormorant");
                                setEditCoverColor(g?.coverColor || "#b4975a");
                                setEditCoverMode("upload");
                              }}
                              className="px-2.5 py-2 rounded-xl bg-zinc-800 hover:bg-[#b4975a] hover:text-zinc-950 text-zinc-300 text-[10px] font-bold uppercase tracking-wider border border-zinc-750 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                              title="Change Cover Photo & Styling"
                            >
                              <ImageIcon size={11} />
                              <span>Cover</span>
                            </button>

                            {/* 🗑️ Delete Gallery Button */}
                            <button 
                              onClick={() => handleDeleteAiGallery(g?.id, g?.name)}
                              className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-800/60 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0"
                              title={`Permanently Delete "${g?.name || 'this gallery'}"`}
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =============================== AI ORDERS TAB ================================ */}
        {activeTab === "ai-orders" && (
          <div className="space-y-6 text-left">
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light">
                AI Photo <span className="italic font-serif text-[#b4975a]">Print Orders</span>
              </h2>
              <p className="text-zinc-500 text-[11px] font-light mt-1">Fulfill physical frame print orders submitted by wedding guests.</p>
            </div>

            {aiOrders.length === 0 ? (
              <div className="text-center py-16 border border-zinc-800 rounded-[28px] text-zinc-500 text-xs font-light">
                No print orders found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {aiOrders.map((o) => (
                  <div key={o.id} className="bg-zinc-950 border border-zinc-800 p-6 rounded-[24px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/3 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row gap-5">
                      <img src={o.photoUrl} className="w-16 h-20 rounded-lg object-cover border border-zinc-850" alt="Order Thumbnail" />
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{o.customerName}</h4>
                          <span className="text-[10px] text-zinc-500">ID: {o.id}</span>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{o.printSize} Frame (₹{o.price})</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">
                          📞 Mobile: <strong className="text-zinc-300">{o.phone}</strong> • Ordered: <strong className="text-zinc-300">{formatDateString(o.date)}</strong>
                        </p>
                        <p className="text-xs text-zinc-500 font-light">
                          🏠 Dispatch Address: {o.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                      <select value={o.status} onChange={(e) => handleUpdateAiOrderStatus(o.id, e.target.value)}
                        style={{ colorScheme: "dark" }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full md:w-40 cursor-pointer">
                        <option value="New Order">New Order</option>
                        <option value="Processing">Processing</option>
                        <option value="Couriered">Couriered</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "budget-tracker" && (
          <div className="space-y-6 text-left office-theme-container bg-[#0b0f19] p-6 sm:p-8 rounded-[32px] border border-zinc-800/40">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light">
                  Budget <span className="italic font-serif text-[#b4975a]">Tracker &amp; Planner</span>
                </h2>
                <p className="text-zinc-500 text-[11px] font-light mt-1">Manage studio expenses, calculate profit margins, and track crew allocations.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Settings size={14} className="text-[#b4975a]" /> Configure Defaults
                </button>
                <button
                  onClick={handleExportBudgets}
                  className="bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download size={14} /> Export Budgets
                </button>
                <label className="bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-zinc-800 transition-all flex items-center gap-2 cursor-pointer select-none">
                  <Upload size={14} /> Import JSON
                  <input type="file" accept=".json" onChange={handleImportBudgets} className="hidden" />
                </label>
                {!selectedBudget ? (
                  <button
                    onClick={handleCreateNewBudget}
                    className="bg-[#b4975a] hover:bg-[#c5ab73] text-zinc-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#b4975a]/10"
                  >
                    <Plus size={14} /> Track Budget
                  </button>
                ) : (
                  <button
                    onClick={() => handleSaveBudget(selectedBudget)}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-green-600/10"
                  >
                    <Save size={14} /> Save Budget Changes
                  </button>
                )}
              </div>
            </div>

            {/* View switching */}
            {!selectedBudget ? (
              <>
                {/* KPI cards */}
                {(() => {
                  let totalRev = 0, totalExp = 0, totalProf = 0;
                  officeBudgets.forEach(b => {
                    const fin = calculateBudgetFinancials(b);
                    totalRev += fin.packagePrice;
                    totalExp += fin.totalExpense;
                    totalProf += fin.netProfit;
                  });
                  const avgMargin = totalRev > 0 ? Math.round((totalProf / totalRev) * 100) : 0;
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/3 rounded-full blur-lg pointer-events-none" />
                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Total Revenue</span>
                        <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-[#b4975a] font-light mt-1">₹ {formatCurrency(totalRev)}</h4>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/3 rounded-full blur-lg pointer-events-none" />
                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Total Expenses</span>
                        <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-red-500/80 font-light mt-1">₹ {formatCurrency(totalExp)}</h4>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/3 rounded-full blur-lg pointer-events-none" />
                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Total Net Profit</span>
                        <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-green-500/80 font-light mt-1">₹ {formatCurrency(totalProf)}</h4>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-[#b4975a]/3 rounded-full blur-lg pointer-events-none" />
                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Avg Profit Margin</span>
                        <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-white font-light mt-1">{avgMargin}%</h4>
                      </div>
                    </div>
                  );
                })()}

                {/* Search & filters */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search events by client name, venue..."
                      value={budgetSearch}
                      onChange={(e) => setBudgetSearch(e.target.value)}
                      className="bg-zinc-900 border border-zinc-850 rounded-xl pl-10 pr-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">Sort By</span>
                    <select
                      value={budgetSort}
                      onChange={(e) => setBudgetSort(e.target.value)}
                      className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="revenue-high">Revenue: High to Low</option>
                      <option value="profit-high">Profit: High to Low</option>
                      <option value="margin-high">Margin %: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Budget lists */}
                {(() => {
                  const filtered = officeBudgets
                    .filter(b => 
                      (b.clientName || "").toLowerCase().includes(budgetSearch.toLowerCase()) ||
                      (b.location || "").toLowerCase().includes(budgetSearch.toLowerCase())
                    )
                    .sort((a, b) => {
                      if (budgetSort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
                      if (budgetSort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
                      const fa = calculateBudgetFinancials(a);
                      const fb = calculateBudgetFinancials(b);
                      if (budgetSort === "revenue-high") return fb.packagePrice - fa.packagePrice;
                      if (budgetSort === "profit-high") return fb.netProfit - fa.netProfit;
                      if (budgetSort === "margin-high") return fb.marginPercent - fa.marginPercent;
                      return 0;
                    });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-16 border border-zinc-800 rounded-[28px] text-zinc-500 text-xs font-light bg-zinc-950/20">
                        No wedding budgets tracked yet. Click "Track Budget" to start!
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {filtered.map(b => {
                        const fin = calculateBudgetFinancials(b);
                        const marginText = fin.marginPercent >= 40 ? "High Margin" : fin.marginPercent >= 20 ? "Healthy" : fin.marginPercent > 0 ? "Low Margin" : fin.marginPercent === 0 ? "Break Even" : "Loss Alert";
                        const marginColor = fin.marginPercent >= 40 ? "bg-green-500/10 text-green-500 border border-green-500/20" : fin.marginPercent >= 20 ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20";
                        return (
                          <div key={b.id} className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4 text-left relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#b4975a]/2 rounded-full blur-xl pointer-events-none" />
                            <div className="space-y-1">
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="font-bold text-white text-base truncate pr-2">{b.clientName}</h3>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${marginColor}`}>{marginText}</span>
                              </div>
                              <p className="text-zinc-500 text-xs flex items-center gap-1">
                                <Calendar size={12} className="text-zinc-600" /> {b.date || "TBD Date"} &bull; {b.location || "Venue TBD"}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 border-y border-zinc-900 py-3 text-xs select-none">
                              <div>
                                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-bold">Revenue</span>
                                <span className="text-white font-bold block mt-0.5">₹ {formatCurrency(fin.packagePrice)}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-bold">Expenses</span>
                                <span className="text-red-400 font-bold block mt-0.5">₹ {formatCurrency(fin.totalExpense)}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-bold">Net Profit</span>
                                <span className="text-green-400 font-bold block mt-0.5">₹ {formatCurrency(fin.netProfit)} ({fin.marginPercent}%)</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setSelectedBudget(JSON.parse(JSON.stringify(b))); // clone to edit
                                  setBudgetEditorTab("basics");
                                }}
                                className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-2 rounded-xl text-xs border border-zinc-800 transition-all text-center cursor-pointer"
                              >
                                Edit Planner
                              </button>
                              <button
                                onClick={() => handleDuplicateBudget(b)}
                                className="bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 hover:border-zinc-700 p-2 rounded-xl transition-all cursor-pointer"
                                title="Duplicate"
                              >
                                <Copy size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteBudget(b.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25 p-2 rounded-xl transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </>
            ) : (
              /* Split Screen Workspace Editor */
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedBudget(null)}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white p-2 rounded-xl border border-zinc-800 transition-all cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <div>
                      <h3 className="font-bold text-white text-sm">Editing Budget: {selectedBudget.clientName}</h3>
                      <p className="text-zinc-500 text-[10px] mt-0.5">{selectedBudget.location || "Venue TBD"} &bull; {selectedBudget.date || "Date TBD"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintBudgetReport(selectedBudget)}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-2 px-4 rounded-xl text-xs border border-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Printer size={13} /> PDF Report
                    </button>
                    <button
                      onClick={() => handleSaveBudget(selectedBudget)}
                      className="bg-[#b4975a] hover:bg-[#c5ab73] text-zinc-950 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#b4975a]/10"
                    >
                      <Save size={13} /> Save Changes
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Left input workspace panel */}
                  <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6">
                    {/* Navigation inside editor */}
                    <div className="flex border-b border-zinc-850 pb-1 gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide select-none">
                      {[
                        { id: "basics", label: "Basics & Travel" },
                        { id: "crew", label: "Media Crew" },
                        { id: "std", label: "Save the Date" },
                        { id: "albums", label: "Albums & Frames" },
                        { id: "outputs", label: "Outputs & Custom" }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setBudgetEditorTab(t.id)}
                          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                            budgetEditorTab === t.id
                              ? "border-[#b4975a] text-[#b4975a]"
                              : "border-transparent text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Basics tab content */}
                    {budgetEditorTab === "basics" && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Budgeting Mode</label>
                            <select
                              value={selectedBudget.budgetMode || "standard"}
                              onChange={(e) => updateBudgetField("budgetMode", e.target.value)}
                              className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full cursor-pointer"
                            >
                              <option value="standard">Standard (Input Revenue)</option>
                              <option value="inverse">Inverse (Input Target Profit)</option>
                            </select>
                          </div>
                          {selectedBudget.budgetMode === "inverse" ? (
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Target Net Profit (₹)</label>
                              <input
                                type="number"
                                value={selectedBudget.targetProfit || 0}
                                onChange={(e) => updateBudgetField("targetProfit", parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Package Price / Revenue (₹)</label>
                              <input
                                type="number"
                                value={selectedBudget.packagePrice || 0}
                                onChange={(e) => updateBudgetField("packagePrice", parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Client / Couple Name</label>
                          <input
                            type="text"
                            value={selectedBudget.clientName || ""}
                            onChange={(e) => updateBudgetField("clientName", e.target.value)}
                            className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Event Venue / Location</label>
                            <input
                              type="text"
                              value={selectedBudget.location || ""}
                              onChange={(e) => updateBudgetField("location", e.target.value)}
                              className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Event Start Date</label>
                            <input
                              type="date"
                              value={selectedBudget.date || ""}
                              onChange={(e) => updateBudgetField("date", e.target.value)}
                              className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                            />
                          </div>
                        </div>

                        <div className="border-t border-zinc-850 pt-4 space-y-4">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Logistics &amp; Travel Expenses</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Travel Cost (₹)</label>
                              <input
                                type="number"
                                value={selectedBudget.travelCharge || 0}
                                onChange={(e) => updateBudgetField("travelCharge", parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                              <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={selectedBudget.travelPaidByCustomer || false}
                                  onChange={(e) => updateBudgetField("travelPaidByCustomer", e.target.checked)}
                                  className="rounded border-zinc-800 text-[#b4975a] bg-zinc-900 focus:ring-0"
                                />
                                <span className="text-[10px] text-zinc-400 font-medium">Paid by client</span>
                              </label>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Stay / Accommodation (₹)</label>
                              <input
                                type="number"
                                value={selectedBudget.stayExpense || 0}
                                onChange={(e) => updateBudgetField("stayExpense", parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Food / Catering (₹)</label>
                              <input
                                type="number"
                                value={selectedBudget.foodExpense || 0}
                                onChange={(e) => updateBudgetField("foodExpense", parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Events list coverage scheduler */}
                        <div className="border-t border-zinc-850 pt-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Events Schedule &amp; Coverage</h4>
                            <button
                              onClick={handleAddEventToBudget}
                              className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={11} /> Add Event
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(selectedBudget.eventsList || []).map((ev, index) => (
                              <div key={ev.id} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  value={ev.name}
                                  onChange={(e) => updateBudgetEventItem(index, "name", e.target.value)}
                                  placeholder="e.g. Wedding Ceremony, Haldi"
                                  className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none flex-1"
                                />
                                <input
                                  type="date"
                                  value={ev.date}
                                  onChange={(e) => updateBudgetEventItem(index, "date", e.target.value)}
                                  className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-36"
                                />
                                <button
                                  onClick={() => handleRemoveEventFromBudget(index)}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25 p-2 rounded-xl transition-all cursor-pointer shrink-0"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Crew tab content */}
                    {budgetEditorTab === "crew" && (
                      <div className="space-y-6">
                        {/* Photographers list */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Camera size={13} className="text-[#b4975a]" /> Photographers Coverage
                            </h4>
                            <button
                              onClick={() => handleAddCrewMember("photographers")}
                              className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={11} /> Add Photographer
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(selectedBudget.photographers || []).map((p, index) => (
                              <div key={p.id} className="flex gap-3 items-center bg-zinc-900/20 p-3 rounded-xl border border-zinc-850/50">
                                <input
                                  type="text"
                                  value={p.name}
                                  onChange={(e) => updateCrewMember("photographers", index, "name", e.target.value)}
                                  placeholder="Photographer Name"
                                  className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none flex-1"
                                />
                                <div className="relative w-32 shrink-0">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">₹</span>
                                  <input
                                    type="number"
                                    value={p.charge}
                                    onChange={(e) => updateCrewMember("photographers", index, "charge", parseFloat(e.target.value) || 0)}
                                    className="bg-zinc-900 border border-zinc-850 rounded-xl pl-6 pr-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full text-right"
                                  />
                                </div>
                                <label className="flex items-center gap-1.5 shrink-0 select-none cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={p.isMe || false}
                                    onChange={(e) => updateCrewMember("photographers", index, "isMe", e.target.checked)}
                                    className="rounded border-zinc-800 text-[#b4975a] bg-zinc-900 focus:ring-0 w-3.5 h-3.5"
                                  />
                                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">I did it</span>
                                </label>
                                <button
                                  onClick={() => handleRemoveCrewMember("photographers", index)}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25 p-2 rounded-xl transition-all cursor-pointer shrink-0"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Videographers list */}
                        <div className="space-y-3 border-t border-zinc-850 pt-5">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Video size={13} className="text-[#b4975a]" /> Cinematographers Coverage
                            </h4>
                            <button
                              onClick={() => handleAddCrewMember("videographers")}
                              className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={11} /> Add Cinematographer
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(selectedBudget.videographers || []).map((v, index) => (
                              <div key={v.id} className="flex gap-3 items-center bg-zinc-900/20 p-3 rounded-xl border border-zinc-850/50">
                                <input
                                  type="text"
                                  value={v.name}
                                  onChange={(e) => updateCrewMember("videographers", index, "name", e.target.value)}
                                  placeholder="Cinematographer Name"
                                  className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none flex-1"
                                />
                                <div className="relative w-32 shrink-0">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">₹</span>
                                  <input
                                    type="number"
                                    value={v.charge}
                                    onChange={(e) => updateCrewMember("videographers", index, "charge", parseFloat(e.target.value) || 0)}
                                    className="bg-zinc-900 border border-zinc-850 rounded-xl pl-6 pr-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full text-right"
                                  />
                                </div>
                                <label className="flex items-center gap-1.5 shrink-0 select-none cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={v.isMe || false}
                                    onChange={(e) => updateCrewMember("videographers", index, "isMe", e.target.checked)}
                                    className="rounded border-zinc-800 text-[#b4975a] bg-zinc-900 focus:ring-0 w-3.5 h-3.5"
                                  />
                                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">I did it</span>
                                </label>
                                <button
                                  onClick={() => handleRemoveCrewMember("videographers", index)}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25 p-2 rounded-xl transition-all cursor-pointer shrink-0"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Drone operators charge */}
                        <div className="space-y-1.5 border-t border-zinc-850 pt-5">
                          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">Drone / Aerial Coverage Charge (₹)</label>
                          <input
                            type="number"
                            value={selectedBudget.droneCharge || 0}
                            onChange={(e) => updateBudgetField("droneCharge", parseFloat(e.target.value) || 0)}
                            className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Save the Date tab */}
                    {budgetEditorTab === "std" && (
                      <div className="space-y-5">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Heart size={13} className="text-[#b4975a]" /> Save the Date / Pre-Shoot Expenses
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/10 border border-zinc-850 p-5 rounded-2xl">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Photographer Cost (₹)</label>
                            <input
                              type="number"
                              value={selectedBudget.stdPhotoCharge || 0}
                              onChange={(e) => updateBudgetField("stdPhotoCharge", parseFloat(e.target.value) || 0)}
                              className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                            />
                            <label className="flex items-center gap-1.5 mt-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={selectedBudget.stdPhotoIsMe || false}
                                onChange={(e) => updateBudgetField("stdPhotoIsMe", e.target.checked)}
                                className="rounded border-zinc-800 text-[#b4975a] bg-zinc-900 focus:ring-0 w-3.5 h-3.5"
                              />
                              <span className="text-[9px] text-[#b4975a] font-bold uppercase tracking-wider">I am the photographer</span>
                            </label>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Cinematographer Cost (₹)</label>
                            <input
                              type="number"
                              value={selectedBudget.stdVideoCharge || 0}
                              onChange={(e) => updateBudgetField("stdVideoCharge", parseFloat(e.target.value) || 0)}
                              className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                            />
                            <label className="flex items-center gap-1.5 mt-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={selectedBudget.stdVideoIsMe || false}
                                onChange={(e) => updateBudgetField("stdVideoIsMe", e.target.checked)}
                                className="rounded border-zinc-800 text-[#b4975a] bg-zinc-900 focus:ring-0 w-3.5 h-3.5"
                              />
                              <span className="text-[9px] text-[#b4975a] font-bold uppercase tracking-wider">I am the videographer</span>
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Per Photo Print Fee (₹)</label>
                            <input
                              type="number"
                              value={selectedBudget.stdPerPhotoCharge || 0}
                              onChange={(e) => updateBudgetField("stdPerPhotoCharge", parseFloat(e.target.value) || 0)}
                              className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Number of Photos</label>
                            <input
                              type="number"
                              value={selectedBudget.stdPhotoQty || 0}
                              onChange={(e) => updateBudgetField("stdPhotoQty", parseInt(e.target.value) || 0)}
                              className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Video Editing Fee (₹)</label>
                            <input
                              type="number"
                              value={selectedBudget.stdEditingCharge || 0}
                              onChange={(e) => updateBudgetField("stdEditingCharge", parseFloat(e.target.value) || 0)}
                              className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Albums & Frames tab */}
                    {budgetEditorTab === "albums" && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen size={13} className="text-[#b4975a]" /> Wedding Albums Specifications
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Album Qty</label>
                              <input
                                type="number"
                                value={selectedBudget.albumQty || 0}
                                onChange={(e) => updateBudgetField("albumQty", parseInt(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Cover Cost (₹)</label>
                              <input
                                type="number"
                                value={selectedBudget.albumCoverCharge || 0}
                                onChange={(e) => updateBudgetField("albumCoverCharge", parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Total Leafs/Sheets</label>
                              <input
                                type="number"
                                value={selectedBudget.albumLeafs || 0}
                                onChange={(e) => updateBudgetField("albumLeafs", parseInt(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Leaf Print Rate (₹)</label>
                              <input
                                type="number"
                                value={selectedBudget.albumLeafCharge || 0}
                                onChange={(e) => updateBudgetField("albumLeafCharge", parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Design / Leaf (₹)</label>
                              <input
                                type="number"
                                value={selectedBudget.albumDesigningCharge || 0}
                                onChange={(e) => updateBudgetField("albumDesigningCharge", parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Wall mount frames list */}
                        <div className="space-y-3 border-t border-zinc-850 pt-5">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                              <FileText size={13} className="text-[#b4975a]" /> Wall Mount Framed Prints
                            </h4>
                            <button
                              onClick={() => handleAddCrewMember("frames")}
                              className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={11} /> Add Frame
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(selectedBudget.frames || []).map((f, index) => (
                              <div key={f.id} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  value={f.size}
                                  onChange={(e) => updateCrewMember("frames", index, "size", e.target.value)}
                                  placeholder="Frame Size, e.g. 12x18, 20x30"
                                  className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none flex-1"
                                />
                                <div className="w-20 shrink-0">
                                  <input
                                    type="number"
                                    value={f.qty}
                                    placeholder="Qty"
                                    onChange={(e) => updateCrewMember("frames", index, "qty", parseInt(e.target.value) || 1)}
                                    className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full text-center"
                                  />
                                </div>
                                <div className="relative w-28 shrink-0">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">₹</span>
                                  <input
                                    type="number"
                                    value={f.charge}
                                    placeholder="Rate"
                                    onChange={(e) => updateCrewMember("frames", index, "charge", parseFloat(e.target.value) || 0)}
                                    className="bg-zinc-900 border border-zinc-850 rounded-xl pl-6 pr-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full text-right"
                                  />
                                </div>
                                <button
                                  onClick={() => handleRemoveCrewMember("frames", index)}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25 p-2 rounded-xl transition-all cursor-pointer shrink-0"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Outputs & Custom tab */}
                    {budgetEditorTab === "outputs" && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Deliverables &amp; Post Production</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-3 bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
                              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Media deliverables inclusions</label>
                              <div className="space-y-2 text-xs">
                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={selectedBudget.includeHdHighlight || false}
                                    onChange={(e) => updateBudgetField("includeHdHighlight", e.target.checked)}
                                    className="rounded border-zinc-850 text-[#b4975a] bg-zinc-900 focus:ring-0 w-3.5 h-3.5"
                                  />
                                  <span className="text-zinc-300">HD Cinematic Film / Highlight</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={selectedBudget.includeReel || false}
                                    onChange={(e) => updateBudgetField("includeReel", e.target.checked)}
                                    className="rounded border-zinc-850 text-[#b4975a] bg-zinc-900 focus:ring-0 w-3.5 h-3.5"
                                  />
                                  <span className="text-zinc-300">Instagram Reel / Teaser</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={selectedBudget.includeFullHd || false}
                                    onChange={(e) => updateBudgetField("includeFullHd", e.target.checked)}
                                    className="rounded border-zinc-850 text-[#b4975a] bg-zinc-900 focus:ring-0 w-3.5 h-3.5"
                                  />
                                  <span className="text-zinc-300">Full Video Output / Documentation</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={selectedBudget.include2Frames || false}
                                    onChange={(e) => updateBudgetField("include2Frames", e.target.checked)}
                                    className="rounded border-zinc-850 text-[#b4975a] bg-zinc-900 focus:ring-0 w-3.5 h-3.5"
                                  />
                                  <span className="text-zinc-300">Complimentary 2x Keepsake Frames</span>
                                </label>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Video Editor Fee (₹)</label>
                                <input
                                  type="number"
                                  value={selectedBudget.videoEditingCharge || 0}
                                  onChange={(e) => updateBudgetField("videoEditingCharge", parseFloat(e.target.value) || 0)}
                                  className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Deliverable USB/Pendrives Cost (₹)</label>
                                <input
                                  type="number"
                                  value={selectedBudget.pendriveCharge || 0}
                                  onChange={(e) => updateBudgetField("pendriveCharge", parseFloat(e.target.value) || 0)}
                                  className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Custom Extra Expenses */}
                        <div className="space-y-3 border-t border-zinc-850 pt-5">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Sliders size={13} className="text-[#b4975a]" /> Custom Add-on Expenses
                            </h4>
                            <button
                              onClick={() => handleAddCrewMember("customExpenses")}
                              className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={11} /> Add Expense
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(selectedBudget.customExpenses || []).map((c, index) => (
                              <div key={c.id} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  value={c.name}
                                  onChange={(e) => updateCrewMember("customExpenses", index, "name", e.target.value)}
                                  placeholder="Expense description, e.g. Helicopter rental, specific drone upgrade"
                                  className="bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none flex-1"
                                />
                                <div className="relative w-36 shrink-0">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">₹</span>
                                  <input
                                    type="number"
                                    value={c.charge}
                                    placeholder="Expense rate"
                                    onChange={(e) => updateCrewMember("customExpenses", index, "charge", parseFloat(e.target.value) || 0)}
                                    className="bg-zinc-900 border border-zinc-850 rounded-xl pl-6 pr-3 py-1.5 text-white text-xs focus:border-[#b4975a] focus:outline-none w-full text-right"
                                  />
                                </div>
                                <button
                                  onClick={() => handleRemoveCrewMember("customExpenses", index)}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25 p-2 rounded-xl transition-all cursor-pointer shrink-0"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right live calculations dashboard panel */}
                  {(() => {
                    const fin = calculateBudgetFinancials(selectedBudget);
                    const marginText = fin.marginPercent >= 40 ? "High Profitability" : fin.marginPercent >= 20 ? "Healthy Profit" : fin.marginPercent > 0 ? "Low Profit" : fin.marginPercent === 0 ? "Break Even" : "Net Loss Alert";
                    const marginColor = fin.marginPercent >= 40 ? "text-green-400" : fin.marginPercent >= 20 ? "text-amber-400" : "text-red-400";
                    return (
                      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5 sticky top-24 select-none">
                        <div className="space-y-1 border-b border-zinc-900 pb-3">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Financial Performance</span>
                          <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-white font-light flex justify-between items-center">
                            Summary Output
                            <span className={`text-xs px-2 py-0.5 rounded border border-zinc-800 font-bold uppercase tracking-wider bg-zinc-900 ${marginColor}`}>{marginText}</span>
                          </h4>
                        </div>

                        <div className="space-y-3 text-xs leading-relaxed">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-500">Gross Revenue (Revenue)</span>
                            <span className="text-white font-bold">₹ {formatCurrency(fin.packagePrice)}</span>
                          </div>
                          
                          <div className="space-y-2 border-t border-zinc-900/60 pt-3">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-zinc-500">Logistics (Travel, Stay, Food)</span>
                              <span className="text-zinc-400">₹ {formatCurrency(fin.logisticsExpense)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-zinc-500">Media Crew &amp; Drone Cost</span>
                              <span className="text-zinc-400">₹ {formatCurrency(fin.crewExpense)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-zinc-500">Save the Date Expenses</span>
                              <span className="text-zinc-400">₹ {formatCurrency(fin.stdExpense)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-zinc-500">Albums (Cover, printing, design)</span>
                              <span className="text-zinc-400">₹ {formatCurrency(fin.albumExpense)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-zinc-500">Wall Keepsake Frames</span>
                              <span className="text-zinc-400">₹ {formatCurrency(fin.framesExpense)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-zinc-500">Video Editing &amp; Media</span>
                              <span className="text-zinc-400">₹ {formatCurrency(fin.mediaExpense)}</span>
                            </div>
                            {fin.customExpense > 0 && (
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-zinc-500">Custom Add-on Expenses</span>
                                <span className="text-zinc-400">₹ {formatCurrency(fin.customExpense)}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center border-t border-zinc-900 pt-3 font-bold text-sm select-all">
                            <span className="text-zinc-400">Total Project Expense</span>
                            <span className="text-red-400 font-bold">₹ {formatCurrency(fin.totalExpense)}</span>
                          </div>

                          <div className="flex justify-between items-center border-t border-zinc-900 pt-3 font-bold text-sm select-all">
                            <span className="text-zinc-400">Net Studio Profit</span>
                            <span className="text-green-400 font-bold">₹ {formatCurrency(fin.netProfit)} ({fin.marginPercent}%)</span>
                          </div>

                          {/* My Personal Crew Earnings highlight */}
                          <div className="bg-[#b4975a]/5 border border-[#b4975a]/15 p-4 rounded-2xl flex flex-col gap-1 mt-4">
                            <span className="text-zinc-400 text-[10px] uppercase font-black tracking-wider flex items-center gap-1">
                              <Coins size={12} className="text-[#b4975a]" /> My Personal Earnings
                            </span>
                            <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-[#b4975a] font-bold">
                              ₹ {formatCurrency(fin.myTotalEarnings)}
                            </h4>
                            <p className="text-zinc-500 text-[9px] font-medium leading-relaxed">
                              Includes Net Profit + all allocated crew fees where you checked "I did it".
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <button
                            onClick={() => handleSaveBudget(selectedBudget)}
                            className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                          >
                            <Save size={13} /> Save Planner Changes
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBudget(null);
                            }}
                            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-zinc-800 transition-all cursor-pointer text-center"
                          >
                            Return to Dashboard
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "invoice-studio" && (
          <div className="space-y-6 text-left office-theme-container bg-[#0b0f19] p-6 sm:p-8 rounded-[32px] border border-zinc-800/40">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light">
                  Invoice <span className="italic font-serif text-[#b4975a]">Studio Dashboard</span>
                </h2>
                <p className="text-zinc-500 text-[11px] font-light mt-1">Convert proposals and budget plans to printable A4 GST/Tax invoices instantly.</p>
              </div>
              <div className="flex items-center gap-3">
                {!selectedInvoice ? (
                  <button
                    onClick={handleCreateBlankInvoice}
                    className="bg-[#b4975a] hover:bg-[#c5ab73] text-zinc-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#b4975a]/10"
                  >
                    <Plus size={14} /> Start Blank Invoice
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInvoiceTaxRate(r => r === 0 ? 18 : 0)}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-2 px-4 rounded-xl text-xs border border-zinc-800 transition-all cursor-pointer"
                    >
                      🏷️ Tax Rate: {invoiceTaxRate}%
                    </button>
                    <button
                      onClick={() => {
                        const updatedItems = [...(selectedInvoice.items || [])];
                        updatedItems.push({
                          id: Math.random().toString(),
                          label: "Additional Service / Custom milestone",
                          price: 15000,
                          date: "TBD Date"
                        });
                        setSelectedInvoice({ ...selectedInvoice, items: updatedItems });
                      }}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-2 px-4 rounded-xl text-xs border border-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={13} /> Add Row
                    </button>
                    <button
                      onClick={() => handleSaveInvoice(selectedInvoice)}
                      className="bg-[#b4975a] hover:bg-[#c5ab73] text-zinc-950 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#b4975a]/10"
                    >
                      <Save size={13} /> Save Invoice
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* View switching */}
            {!selectedInvoice ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left col: Invoice dropzone & budget converter picker */}
                <div className="lg:col-span-2 space-y-6">
                  {/* PDF Drag & Drop Upload Zone */}
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        processUploadedPdf(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => document.getElementById('pdf-file-picker')?.click()}
                    className={`office-theme-card border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                      dragOver 
                        ? "border-[#d4af37] bg-[#d4af37]/10 shadow-lg shadow-[#d4af37]/10" 
                        : "border-[#d4af37]/40 bg-zinc-900/20 hover:bg-[#d4af37]/5 hover:border-[#d4af37]"
                    }`}
                  >
                    <input 
                      type="file" 
                      id="pdf-file-picker" 
                      accept=".pdf" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processUploadedPdf(e.target.files[0]);
                        }
                      }}
                    />
                    <Upload size={32} className="mx-auto text-[#d4af37] mb-3 animate-pulse" />
                    <h3 className="font-bold text-white text-sm select-none">
                      {isPdfLoading ? "⏳ Scanning PDF & Extracting Package Specs..." : "Drag & Drop Any Proposal or Budget PDF Here"}
                    </h3>
                    <p className="text-zinc-500 text-[10px] leading-relaxed mt-2 select-none">
                      Our automated engine will scan your proposal document, extract client names, venues, dates, and package rates, and convert them instantly into an interactive, editable invoice!
                    </p>
                    <button className="bg-[#d4af37]/20 hover:bg-[#d4af37]/35 text-[#d4af37] border border-[#d4af37]/30 text-xs font-bold py-1.5 px-4 rounded-xl mt-4 select-none cursor-pointer">
                      Select PDF From Computer
                    </button>
                  </div>

                  {/* Text pasting zone */}
                  <div className="office-theme-card p-6 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={14} className="text-[#d4af37]" /> Convert Proposal or Booking Quote Text
                    </h3>
                    <p className="text-zinc-500 text-[10px] leading-relaxed">
                      Paste details of a custom wedding booking proposal quote below to extract pricing and generate invoice milestones automatically.
                    </p>
                    <div className="space-y-3">
                      <textarea
                        rows="3"
                        id="pasted-proposal-text"
                        placeholder="Paste proposal details here... e.g. Wedding Photography & Video on Aug 15: Rs. 1,50000/- with leatherette wedding album..."
                        className="w-full office-theme-input rounded-xl px-4 py-3 text-white text-xs focus:border-[#d4af37] focus:outline-none leading-relaxed"
                      />
                      <button
                        onClick={handleParseProposalText}
                        className="bg-[#d4af37]/25 hover:bg-[#d4af37]/35 text-[#d4af37] border border-[#d4af37]/30 py-2.5 px-5 rounded-xl text-xs font-bold transition-all cursor-pointer w-full text-center"
                      >
                        Extract &amp; Build Invoice
                      </button>
                    </div>
                  </div>

                  {/* Budget Projects list picker */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Wallet size={14} className="text-[#b4975a]" /> Convert from Tracked Studio Budget
                    </h3>
                    <p className="text-zinc-500 text-[10px] leading-relaxed">
                      Choose an active wedding budget planner from your database to convert it into a structured, milestone-based invoice.
                    </p>
                    
                    {officeBudgets.length === 0 ? (
                      <div className="text-center py-6 text-zinc-500 text-xs font-light border border-dashed border-zinc-800 rounded-2xl">
                        No active wedding budgets found. Track a budget first!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-1">
                        {officeBudgets.map(b => {
                          const fin = calculateBudgetFinancials(b);
                          return (
                            <div
                              key={b.id}
                              onClick={() => handleConvertBudgetToInvoice(b)}
                              className="bg-zinc-900/40 border border-zinc-850/60 p-4 rounded-xl hover:border-[#b4975a]/45 hover:bg-[#b4975a]/2 transition-all cursor-pointer text-left flex flex-col justify-between h-28"
                            >
                              <div>
                                <h4 className="font-bold text-white text-xs truncate">{b.clientName}</h4>
                                <span className="text-zinc-500 text-[9px] block mt-0.5">📍 {b.location || "Venue TBD"}</span>
                              </div>
                              <div className="flex justify-between items-center border-t border-zinc-900 pt-2 mt-2">
                                <span className="text-[#b4975a] font-bold text-xs">₹ {formatCurrency(fin.packagePrice)}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-0.5">Convert &rarr;</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right col: Saved invoice drafts list */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Save size={14} className="text-[#b4975a]" /> Saved Invoice Drafts
                  </h3>
                  <div className="relative">
                    <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={invoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                      className="bg-zinc-900 border border-zinc-850 rounded-xl pl-9 pr-3 py-1.5 text-white text-[11px] focus:border-[#b4975a] focus:outline-none w-full"
                    />
                  </div>
                  <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                    {officeInvoices
                      .filter(inv => (inv.clientName || "").toLowerCase().includes(invoiceSearch.toLowerCase()) || (inv.invoiceNo || "").toLowerCase().includes(invoiceSearch.toLowerCase()))
                      .map(inv => {
                        const subtotal = (inv.items || []).reduce((s, it) => s + (Number(it.price) || 0), 0);
                        const discount = Number(inv.discount) || 0;
                        const advance = Number(inv.advance) || 0;
                        const subtotalAfterDiscount = subtotal - discount;
                        const tax = Math.round(subtotalAfterDiscount * (invoiceTaxRate / 100));
                        const total = subtotalAfterDiscount + tax;
                        const due = total - advance;
                        return (
                          <div key={inv.invoiceNo || inv.id} className="bg-zinc-900/30 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between gap-3 text-xs text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#b4975a]/2 rounded-full blur-xl pointer-events-none" />
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-zinc-500 font-bold tracking-wider">{inv.invoiceNo}</span>
                                <span className="text-[#b4975a] font-bold">₹ {formatCurrency(due)} due</span>
                              </div>
                              <h4 className="font-bold text-white text-xs truncate">{inv.clientName}</h4>
                              <p className="text-[10px] text-zinc-500">{inv.venue || "Venue TBD"}</p>
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setSelectedInvoice(JSON.parse(JSON.stringify(inv)));
                                  setInvoiceTaxRate(0); // reset initially
                                }}
                                className="flex-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white font-bold py-1.5 rounded-lg text-[10px] text-center cursor-pointer transition-all"
                              >
                                Edit Invoice
                              </button>
                              <button
                                onClick={() => handleDeleteInvoice(inv.invoiceNo || inv.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25 p-1.5 rounded-lg transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    {officeInvoices.length === 0 && (
                      <div className="text-center py-8 text-zinc-500 text-[10px] font-light">
                        No saved invoice history.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* A4 Digital Invoice Editor Workspace */
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-2xl no-print">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white p-2 rounded-xl border border-zinc-800 transition-all cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <div>
                      <h3 className="font-bold text-white text-sm">Editing A4 Invoice: {selectedInvoice.clientName}</h3>
                      <p className="text-zinc-500 text-[10px] mt-0.5">Invoice No: {selectedInvoice.invoiceNo} &bull; Date: {selectedInvoice.savedAt ? selectedInvoice.savedAt.split('T')[0] : "TBD"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintInvoice(selectedInvoice)}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-2 px-4 rounded-xl text-xs border border-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Printer size={13} /> Print / Export PDF
                    </button>
                    <button
                      onClick={() => handleSaveInvoice(selectedInvoice)}
                      className="bg-[#b4975a] hover:bg-[#c5ab73] text-zinc-950 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#b4975a]/10"
                    >
                      <Save size={13} /> Save Changes
                    </button>
                  </div>
                </div>

                {/* Printable A4 Card Panel */}
                <div className="flex justify-center py-6 bg-zinc-900/20 border border-zinc-800 rounded-3xl overflow-x-auto">
                  <div className="print-invoice-sheet bg-white text-black w-[800px] min-h-[1130px] p-12 shadow-2xl flex flex-col justify-between font-sans shrink-0 border border-zinc-200">
                    <div className="space-y-8">
                      {/* Luxury Brand Header */}
                      <div className="flex justify-between items-center pb-5 select-none">
                        <div className="flex items-center gap-3">
                          <img src="/appIcon.png" alt="Logo" className="w-16 h-16 object-contain" />
                        </div>
                        <div className="text-right text-[11px] text-zinc-500 leading-relaxed font-medium">
                          <span className="block font-bold text-zinc-800">dreamwedstories.co.in</span>
                          <span>+91 99954 12955</span>
                        </div>
                      </div>

                      {/* Header Title */}
                      <div className="text-center my-4">
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "46px" }} className="font-light tracking-wide text-zinc-900 select-none">Invoice</h2>
                      </div>

                      {/* Billing Meta Data Grid */}
                      <div className="grid grid-cols-2 gap-8 text-left text-xs text-zinc-600 leading-relaxed">
                        <div className="space-y-4">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-800 select-none">Invoice To:</span>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={selectedInvoice.clientName || ""}
                              onChange={(e) => setSelectedInvoice({ ...selectedInvoice, clientName: e.target.value })}
                              placeholder="CLIENT NAME"
                              className="font-bold text-zinc-900 text-sm border-b border-dashed border-[#b4975a]/40 hover:border-[#b4975a] focus:border-[#b4975a] bg-transparent focus:outline-none w-full py-0.5 capitalize printable-input"
                            />
                            <input
                              type="text"
                              value={selectedInvoice.venue || ""}
                              onChange={(e) => setSelectedInvoice({ ...selectedInvoice, venue: e.target.value })}
                              placeholder="Venue & City Location"
                              className="border-b border-dashed border-[#b4975a]/40 hover:border-[#b4975a] focus:border-[#b4975a] bg-transparent focus:outline-none w-full py-0.5 printable-input font-medium"
                            />
                            <input
                              type="text"
                              value={selectedInvoice.phone || ""}
                              onChange={(e) => setSelectedInvoice({ ...selectedInvoice, phone: e.target.value })}
                              placeholder="Contact Phone"
                              className="border-b border-dashed border-[#b4975a]/40 hover:border-[#b4975a] focus:border-[#b4975a] bg-transparent focus:outline-none w-full py-0.5 printable-input font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-end">
                          <div className="w-64 space-y-2 text-right">
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-zinc-500 font-bold text-[10px] uppercase select-none">Issued:</span>
                              <input
                                type="date"
                                value={selectedInvoice.savedAt ? selectedInvoice.savedAt.split('T')[0] : new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSelectedInvoice({ ...selectedInvoice, savedAt: new Date(e.target.value).toISOString() })}
                                className="border-b border-dashed border-[#b4975a]/40 hover:border-[#b4975a] bg-transparent focus:outline-none w-32 text-right py-0.5 printable-input text-zinc-900 font-medium"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-zinc-500 font-bold text-[10px] uppercase select-none">Invoice:</span>
                              <input
                                type="text"
                                value={selectedInvoice.invoiceNo || ""}
                                onChange={(e) => setSelectedInvoice({ ...selectedInvoice, invoiceNo: e.target.value })}
                                className="font-bold text-zinc-900 border-b border-dashed border-[#b4975a]/40 hover:border-[#b4975a] bg-transparent focus:outline-none w-32 text-right py-0.5 printable-input"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-zinc-500 font-bold text-[10px] uppercase select-none">Due:</span>
                              <input
                                type="text"
                                value={selectedInvoice.dueText || "On Receipt"}
                                onChange={(e) => setSelectedInvoice({ ...selectedInvoice, dueText: e.target.value })}
                                className="font-medium text-zinc-900 border-b border-dashed border-[#b4975a]/40 hover:border-[#b4975a] bg-transparent focus:outline-none w-32 text-right py-0.5 printable-input"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-zinc-500 font-bold text-[10px] uppercase select-none">Package Price:</span>
                              <div className="relative w-32 no-print">
                                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                                <input
                                  type="number"
                                  value={selectedInvoice.packagePrice || 60000}
                                  onChange={(e) => setSelectedInvoice({ ...selectedInvoice, packagePrice: parseFloat(e.target.value) || 0 })}
                                  className="font-bold border-b border-dashed border-[#b4975a]/40 hover:border-[#b4975a] bg-transparent focus:outline-none w-full text-right py-0.5 text-zinc-900 printable-input pl-4"
                                />
                              </div>
                              <span className="hidden print:inline font-bold">₹ {formatCurrency(selectedInvoice.packagePrice || 60000)}/-</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Title: Invoice for Photography Service */}
                      <div className="text-center my-6 select-none">
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-zinc-900 font-medium">
                          Invoice For Photography Service {new Date(selectedInvoice.savedAt || new Date()).getFullYear()}
                        </h3>
                      </div>

                      {/* Items Milestones Table */}
                      <div className="overflow-x-auto pt-3">
                        <table className="w-full border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#b69675] text-white uppercase tracking-wider text-[10px] font-bold select-none">
                              <th className="py-3 px-4 text-left font-bold rounded-l-lg">Product/Service</th>
                              <th className="py-3 px-4 text-center font-bold w-32">Price</th>
                              <th className="py-3 px-4 text-center font-bold w-36">Date</th>
                              <th className="py-3 px-4 text-center font-bold w-36">Total</th>
                              <th className="py-3 px-4 text-center font-bold w-12 no-print rounded-r-lg"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 text-zinc-800">
                            {(selectedInvoice.items || []).map((it, idx) => (
                              <tr key={it.id || idx}>
                                <td className="py-3.5 px-4 text-left">
                                  <input
                                    type="text"
                                    value={it.label}
                                    onChange={(e) => {
                                      const updatedItems = [...selectedInvoice.items];
                                      updatedItems[idx].label = e.target.value;
                                      setSelectedInvoice({ ...selectedInvoice, items: updatedItems });
                                    }}
                                    placeholder="Service Milestone description"
                                    className="bg-transparent focus:outline-none w-full border-b border-transparent hover:border-zinc-200 focus:border-[#b4975a] py-0.5 text-zinc-950 printable-input"
                                  />
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <input
                                    type="text"
                                    value={it.date}
                                    onChange={(e) => {
                                      const updatedItems = [...selectedInvoice.items];
                                      updatedItems[idx].date = e.target.value;
                                      setSelectedInvoice({ ...selectedInvoice, items: updatedItems });
                                    }}
                                    placeholder="e.g. 09-03-2025"
                                    className="bg-transparent focus:outline-none w-full text-center border-b border-transparent hover:border-zinc-200 focus:border-[#b4975a] py-0.5 printable-input font-medium text-zinc-700"
                                  />
                                </td>
                                <td className="py-3.5 px-4 text-center font-bold text-zinc-900">
                                  ₹ {formatCurrency(it.price || 0)}
                                </td>
                                <td className="py-3.5 px-4 text-center no-print">
                                  <button
                                    onClick={() => {
                                      const updatedItems = selectedInvoice.items.filter((_, i) => i !== idx);
                                      setSelectedInvoice({ ...selectedInvoice, items: updatedItems });
                                    }}
                                    className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Calculations breakdown summary */}
                      {(() => {
                        const subtotal = (selectedInvoice.items || []).reduce((s, it) => s + (Number(it.price) || 0), 0);
                        const packagePrice = Number(selectedInvoice.packagePrice) || 60000;
                        const remainingPayable = packagePrice - subtotal;
                        return (
                          <div className="flex justify-end pt-5 select-all">
                            <table className="w-80 text-xs border-collapse divide-y divide-zinc-100/60 leading-relaxed text-right">
                              <tbody>
                                <tr className="text-zinc-600">
                                  <td className="py-2 text-left font-medium select-none uppercase text-[10px] text-zinc-400">Subtotal:</td>
                                  <td className="py-2 text-right font-bold text-zinc-900">₹ {formatCurrency(subtotal)}</td>
                                </tr>
                                <tr className="text-zinc-600">
                                  <td className="py-2 text-left font-medium select-none uppercase text-[10px] text-zinc-400">Tax (0%):</td>
                                  <td className="py-2 text-right font-bold text-zinc-900">₹ 0.00</td>
                                </tr>
                                <tr className="text-sm font-black border-t-2 border-zinc-900/80 text-zinc-900">
                                  <td className="py-3.5 text-left uppercase select-none text-[11px]">Total Payable Amount:</td>
                                  <td className="py-3.5 text-right text-lg text-zinc-950 font-black">₹ {formatCurrency(remainingPayable)}/-</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Luxury Footer instructions & signature block */}
                    <div className="border-t border-zinc-100 pt-8 mt-8 flex justify-between items-end text-[10px] text-zinc-500 leading-relaxed font-medium text-left select-none font-sans">
                      <div className="space-y-1">
                        <strong className="text-zinc-800 block text-[11px] font-bold uppercase tracking-wider">Send Payments To:</strong>
                        <span className="text-zinc-900 font-bold text-xs">Dreamwed Stories</span><br />
                        <span className="text-zinc-500 font-light">+91 99954 12955</span>
                      </div>
                      <div className="text-right">
                        {/* Inject Google handwriting font */}
                        <style dangerouslySetInnerHTML={{ __html: `
                          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
                          .signature-handwritten {
                            font-family: 'Great Vibes', cursive;
                            font-size: 44px;
                            color: #000;
                            line-height: 1;
                            margin-bottom: 2px;
                            transform: rotate(-3deg);
                          }
                        `}} />
                        <div className="signature-handwritten">Thank You!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "website-media" && (
          <WebsiteMediaManager />
        )}


      {/* 4. AI Gallery Photos Manager Modal */}
      <AnimatePresence>
        {selectedGalForPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedGalForPhotos(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-950 border border-zinc-800 max-w-2xl w-full rounded-[32px] p-6 sm:p-8 space-y-6 text-zinc-300 relative shadow-2xl overflow-y-auto max-h-[90vh] text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedGalForPhotos(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/5 flex items-center justify-center transition-all cursor-pointer z-10"
              >
                <X size={15} />
              </button>

              <div className="space-y-1 select-none border-b border-zinc-850 pb-4">
                <span className="text-[#b4975a] font-bold text-[9px] tracking-[0.2em] uppercase block">Biometric Repository</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-white font-light">
                  Manage <span className="italic font-serif text-[#b4975a]">{selectedGalForPhotos.name}</span> Photos
                </h3>
                <p className="text-zinc-500 text-[10px] font-light">Add custom direct photo URLs for guests to query via AI face recognition.</p>
              </div>

              {/* Bulk add textarea */}
              <form onSubmit={handleAddBulkPhotos} className="space-y-3.5 bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                    📸 Bulk Import Direct Photo URLs
                  </label>
                  <textarea 
                    rows="3"
                    value={bulkPhotoUrls}
                    onChange={(e) => setBulkPhotoUrls(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&#10;https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&#10;(Separate multiple URLs with commas or new lines)"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-[#b4975a] focus:outline-none leading-relaxed"
                  />
                  <p className="text-[9px] text-zinc-500 leading-relaxed mt-1 select-none">
                    💡 <strong>Google Drive Auto-Sync</strong>: Paste standard Google Drive share links directly! The portal converts them instantly into high-res rendering URLs.
                  </p>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add Direct Photo URLs
                </button>
              </form>

              {/* Photos list count */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-zinc-400 font-bold uppercase tracking-wider">Cataloged Photos ({selectedGalForPhotos.photos ? selectedGalForPhotos.photos.length : 0})</span>
                <span className="text-[10px] text-zinc-500 font-light">Guests see these matches upon biometric search</span>
              </div>

              {/* Photos grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[30vh] overflow-y-auto p-1 bg-zinc-900/20 border border-zinc-850 rounded-2xl">
                {!selectedGalForPhotos.photos || selectedGalForPhotos.photos.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-zinc-600 text-xs font-light italic">
                    No custom photos added yet. Paste direct URLs above to begin!
                  </div>
                ) : (
                  selectedGalForPhotos.photos.map(p => (
                    <div key={p.id} className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-zinc-800 shadow-sm bg-zinc-950">
                      <img src={p.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Gallery item" />
                      
                      {/* Delete Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                          onClick={() => handleDeletePhotoFromGal(p.id)}
                          className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-zinc-850">
                <button 
                  onClick={() => setSelectedGalForPhotos(null)}
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-zinc-800 transition-all cursor-pointer text-center"
                >
                  Save & Finish Management
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4.5. Selected Photos 1-Click Download Modal */}
      <AnimatePresence>
        {selectedPhotosModalData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedPhotosModalData(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-950 border border-zinc-800 max-w-4xl w-full rounded-[32px] p-6 sm:p-8 space-y-6 text-zinc-300 relative shadow-2xl overflow-y-auto max-h-[90vh] text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPhotosModalData(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/5 flex items-center justify-center transition-all cursor-pointer z-10"
              >
                <X size={15} />
              </button>

              {/* Helper computations for Role-based voter filtering */}
              {(() => {
                const allModalPhotos = selectedPhotosModalData.photos || [];
                const bridePhotos = allModalPhotos.filter(p => (p.selectedBy || []).some(u => u.role === 'Bride'));
                const groomPhotos = allModalPhotos.filter(p => (p.selectedBy || []).some(u => u.role === 'Groom'));
                const brideFamPhotos = allModalPhotos.filter(p => (p.selectedBy || []).some(u => u.role === 'BrideFamily'));
                const groomFamPhotos = allModalPhotos.filter(p => (p.selectedBy || []).some(u => u.role === 'GroomFamily'));
                const guestPhotos = allModalPhotos.filter(p => (p.selectedBy || []).some(u => u.role === 'Guest'));

                let filteredModalPhotos = allModalPhotos;
                let activeRoleLabel = "All Selections";
                if (adminSelectedFilter === 'Bride') { filteredModalPhotos = bridePhotos; activeRoleLabel = "Bride's Picks"; }
                else if (adminSelectedFilter === 'Groom') { filteredModalPhotos = groomPhotos; activeRoleLabel = "Groom's Picks"; }
                else if (adminSelectedFilter === 'BrideFamily') { filteredModalPhotos = brideFamPhotos; activeRoleLabel = "Bride's Family"; }
                else if (adminSelectedFilter === 'GroomFamily') { filteredModalPhotos = groomFamPhotos; activeRoleLabel = "Groom's Family"; }
                else if (adminSelectedFilter === 'Guest') { filteredModalPhotos = guestPhotos; activeRoleLabel = "Friends & Guests"; }

                return (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-850 pb-5">
                      <div className="space-y-1">
                        <span className="text-red-400 font-bold text-[9px] tracking-[0.2em] uppercase flex items-center gap-1">
                          <Heart size={11} className="fill-current" /> Client Selections Repository
                        </span>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-white font-light">
                          Selected Photos for <span className="italic font-serif text-[#b4975a]">{selectedPhotosModalData.galleryName}</span>
                        </h3>
                        <p className="text-zinc-500 text-[11px] font-light">
                          {selectedPhotosModalData.count} total favorites with member &amp; role attribution.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => {
                            const summaryText = filteredModalPhotos.map((p, i) => {
                              const voters = (p.selectedBy || []).map(u => `${u.name} (${u.role})`).join(", ");
                              return `Photo #${i + 1}: ${p.url}\nSelected by: ${voters || 'Client'}\n`;
                            }).join("\n");
                            navigator.clipboard.writeText(summaryText);
                            alert(`📋 Copied ${filteredModalPhotos.length} photo URLs with selection details!`);
                          }}
                          className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Copy size={13} /> Copy Details
                        </button>

                        <button
                          onClick={() => handleCopyShareDownloadLink(selectedPhotosModalData.galleryId)}
                          className="px-3 py-2 rounded-xl bg-[#b4975a]/10 hover:bg-[#b4975a]/20 border border-[#b4975a]/30 text-[#b4975a] hover:text-[#d4b97a] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
                          title="Generate client/designer shareable 1-click download link"
                        >
                          <Share2 size={13} /> Share Link
                        </button>

                        <button
                          disabled={zippingState?.isZipping || filteredModalPhotos.length === 0}
                          onClick={() => handleDownloadAllSelected({
                            ...selectedPhotosModalData,
                            photos: filteredModalPhotos,
                            galleryName: `${selectedPhotosModalData.galleryName || "Wedding"}_${activeRoleLabel.replace(/[^a-zA-Z0-9]/g, '_')}`
                          })}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/25 transition-all"
                        >
                          <Download size={14} className={zippingState?.isZipping ? "animate-bounce" : ""} /> 
                          {zippingState?.isZipping ? "Zipping..." : `⚡ Download ZIP (${filteredModalPhotos.length})`}
                        </button>
                      </div>
                    </div>

                    {/* Filter Tabs by Member & Role */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <button
                        onClick={() => setAdminSelectedFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          adminSelectedFilter === 'all' ? "bg-white text-black shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                        }`}
                      >
                        All Selections ({allModalPhotos.length})
                      </button>

                      {bridePhotos.length > 0 && (
                        <button
                          onClick={() => setAdminSelectedFilter('Bride')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            adminSelectedFilter === 'Bride' ? "bg-pink-600 text-white shadow-md" : "bg-zinc-900 text-pink-300 hover:text-white border border-pink-900/40"
                          }`}
                        >
                          <span>👰 Bride ({bridePhotos.length})</span>
                        </button>
                      )}

                      {groomPhotos.length > 0 && (
                        <button
                          onClick={() => setAdminSelectedFilter('Groom')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            adminSelectedFilter === 'Groom' ? "bg-sky-600 text-white shadow-md" : "bg-zinc-900 text-sky-300 hover:text-white border border-sky-900/40"
                          }`}
                        >
                          <span>🤵 Groom ({groomPhotos.length})</span>
                        </button>
                      )}

                      {brideFamPhotos.length > 0 && (
                        <button
                          onClick={() => setAdminSelectedFilter('BrideFamily')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSelectedFilter === 'BrideFamily' ? "bg-purple-600 text-white shadow-md" : "bg-zinc-900 text-purple-300 hover:text-white border border-purple-900/40"
                          }`}
                        >
                          👨‍👩‍👧 Bride's Family ({brideFamPhotos.length})
                        </button>
                      )}

                      {groomFamPhotos.length > 0 && (
                        <button
                          onClick={() => setAdminSelectedFilter('GroomFamily')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSelectedFilter === 'GroomFamily' ? "bg-blue-600 text-white shadow-md" : "bg-zinc-900 text-blue-300 hover:text-white border border-blue-900/40"
                          }`}
                        >
                          👨‍👩‍👦 Groom's Family ({groomFamPhotos.length})
                        </button>
                      )}

                      {guestPhotos.length > 0 && (
                        <button
                          onClick={() => setAdminSelectedFilter('Guest')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSelectedFilter === 'Guest' ? "bg-[#b4975a] text-zinc-950 shadow-md" : "bg-zinc-900 text-amber-300 hover:text-white border border-amber-900/40"
                          }`}
                        >
                          ✨ Guests ({guestPhotos.length})
                        </button>
                      )}
                    </div>

                    {/* Real-time ZIP Compression Progress Bar */}
                    {zippingState && (
                      <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-300 font-medium flex items-center gap-2">
                            <RefreshCw size={13} className="animate-spin text-[#b4975a]" /> {zippingState.status}
                          </span>
                          <span className="text-[#b4975a] font-mono font-bold">{zippingState.percent}%</span>
                        </div>
                        <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                          <div 
                            className="bg-gradient-to-r from-[#b4975a] to-amber-300 h-full rounded-full transition-all duration-300"
                            style={{ width: `${zippingState.percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Photos Grid with Voter Attribution Badges */}
                    {filteredModalPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[55vh] overflow-y-auto pr-1">
                        {filteredModalPhotos.map((photo, idx) => {
                          const voters = photo.selectedBy || [];
                          return (
                            <div key={photo.id || idx} className="relative group rounded-2xl overflow-hidden border border-zinc-800 aspect-[4/5] bg-zinc-900 flex flex-col justify-between">
                              <img src={photo.url} alt={`Selection ${idx+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                              
                              {/* Top Index & Role Badges */}
                              <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap gap-1 items-start z-10 pointer-events-none">
                                <span className="text-[9px] text-zinc-300 font-mono bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                                  #{idx + 1}
                                </span>
                                {voters.map((u, uIdx) => (
                                  <span 
                                    key={uIdx} 
                                    className={`text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                                      u.role === 'Bride' ? 'bg-pink-600 text-white' : 
                                      u.role === 'Groom' ? 'bg-sky-600 text-white' : 
                                      u.role === 'BrideFamily' ? 'bg-purple-600 text-white' : 
                                      u.role === 'GroomFamily' ? 'bg-blue-600 text-white' : 
                                      'bg-[#b4975a] text-zinc-950'
                                    }`}
                                  >
                                    {u.role === 'Bride' ? '👰' : u.role === 'Groom' ? '🤵' : '👤'} {u.name}
                                  </span>
                                ))}
                              </div>

                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                                <span className="text-[10px] text-zinc-300 font-mono">#{idx + 1}</span>
                                <a
                                  href={photo.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  download={`photo_${idx+1}.jpg`}
                                  className="p-2 rounded-xl bg-white text-black hover:bg-[#b4975a] hover:text-white transition-all"
                                  title="Download HD"
                                >
                                  <Download size={13} />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16 border border-zinc-800 rounded-2xl text-zinc-500 text-xs">
                        No photos selected under this role filter.
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4.6. Edit / Redesign Gallery Cover Modal */}
      <AnimatePresence>
        {editingCoverGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setEditingCoverGallery(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-950 border border-zinc-800 max-w-lg w-full rounded-[32px] p-6 sm:p-8 space-y-5 text-zinc-300 relative shadow-2xl overflow-y-auto max-h-[90vh] text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setEditingCoverGallery(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/5 flex items-center justify-center transition-all cursor-pointer z-10"
              >
                <X size={15} />
              </button>

              <div className="space-y-1 border-b border-zinc-850 pb-4">
                <span className="text-[#b4975a] font-bold text-[9px] tracking-[0.2em] uppercase flex items-center gap-1">
                  <ImageIcon size={11} /> Cover Image Studio
                </span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-white font-light">
                  Redesign Cover for <span className="italic font-serif text-[#b4975a]">{editingCoverGallery.name}</span>
                </h3>
              </div>

              {/* Mode Switcher */}
              <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditCoverMode("upload")}
                  className={`py-1.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    editCoverMode === "upload" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Upload size={10} /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setEditCoverMode("url")}
                  className={`py-1.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    editCoverMode === "url" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Link2 size={10} /> Paste Link
                </button>
                <button
                  type="button"
                  onClick={() => setEditCoverMode("presets")}
                  className={`py-1.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    editCoverMode === "presets" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Sparkles size={10} /> Presets
                </button>
              </div>

              {/* Upload */}
              {editCoverMode === "upload" && (
                <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-5 text-center bg-zinc-900/40">
                  <input
                    type="file"
                    id="edit-cover-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCoverFileUpload(e.target.files[0], true);
                      }
                    }}
                  />
                  <label htmlFor="edit-cover-upload" className="cursor-pointer block space-y-2">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#b4975a]">
                      <Upload size={16} />
                    </div>
                    <div className="text-xs text-zinc-300 font-medium">Click to choose image from device</div>
                    <div className="text-[9px] text-zinc-500">JPG, PNG, or WEBP (up to 15MB)</div>
                  </label>
                </div>
              )}

              {/* URL */}
              {editCoverMode === "url" && (
                <input
                  type="url"
                  placeholder="https://... (Direct image link or Google Drive thumbnail)"
                  value={editCoverValue}
                  onChange={(e) => setEditCoverValue(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none"
                />
              )}

              {/* Presets */}
              {editCoverMode === "presets" && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Warm Rose Altar", url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800" },
                    { name: "Couple Celebration", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800" },
                    { name: "Golden Mandap", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800" },
                    { name: "Luxury Details", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800" }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setEditCoverValue(preset.url)}
                      className={`relative rounded-xl overflow-hidden border text-left p-1.5 transition-all cursor-pointer group ${
                        editCoverValue === preset.url ? "border-[#b4975a] ring-1 ring-[#b4975a]" : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-14 object-cover rounded-lg" />
                      <span className="text-[9px] font-bold text-zinc-300 truncate block mt-1 px-0.5">{preset.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* ================= EDIT STYLING CONTROLS ================= */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-3">
                {/* 1. Photo Focus Precision Slider Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Photo Focus Alignment
                    </label>
                    <span className="text-[8px] font-mono text-[#b4975a] font-bold">
                      {typeof editCoverAlign === 'number' || !isNaN(Number(editCoverAlign)) 
                        ? `${editCoverAlign}%` 
                        : (editCoverAlign === 'top' ? '0% (Top)' : (editCoverAlign === 'bottom' ? '100% (Bottom)' : '50% (Center)'))}
                    </span>
                  </div>
                  
                  <div className="space-y-1 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={typeof editCoverAlign === 'number' || !isNaN(Number(editCoverAlign)) ? Number(editCoverAlign) : (editCoverAlign === 'top' ? 0 : (editCoverAlign === 'bottom' ? 100 : 50))}
                      onChange={(e) => setEditCoverAlign(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#b4975a]"
                    />
                    <div className="flex justify-between text-[7px] text-zinc-500 font-mono px-0.5 pt-0.5">
                      <button type="button" onClick={() => setEditCoverAlign(0)} className="hover:text-white cursor-pointer">0% Top</button>
                      <button type="button" onClick={() => setEditCoverAlign(25)} className="hover:text-white cursor-pointer">25% Upper</button>
                      <button type="button" onClick={() => setEditCoverAlign(50)} className="hover:text-[#b4975a] font-bold cursor-pointer">50% Center</button>
                      <button type="button" onClick={() => setEditCoverAlign(75)} className="hover:text-white cursor-pointer">75% Lower</button>
                      <button type="button" onClick={() => setEditCoverAlign(100)} className="hover:text-white cursor-pointer">100% Bottom</button>
                    </div>
                  </div>
                </div>

                {/* Text Alignment */}
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Text Align</label>
                  <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    {["left", "center", "right"].map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => setEditCoverTextAlign(align)}
                        className={`py-1 text-[8px] font-bold uppercase rounded capitalize transition-all cursor-pointer ${
                          editCoverTextAlign === align ? "bg-[#b4975a] text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Typography Font Style */}
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Typography Font Style</label>
                  <select
                    value={editCoverFont}
                    onChange={(e) => setEditCoverFont(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 text-xs focus:border-[#b4975a] focus:outline-none cursor-pointer"
                  >
                    {GALLERY_FONTS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.label})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Theme & Accent Color Palette */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Theme / Accent Color</label>
                    <span className="text-[8px] font-mono text-zinc-500">{editCoverColor}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                    {GALLERY_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setEditCoverColor(c.hex)}
                        title={c.name}
                        className={`w-6 h-6 rounded-full transition-transform cursor-pointer border relative flex items-center justify-center ${
                          (editCoverColor || "#b4975a").toLowerCase() === c.hex.toLowerCase()
                            ? "scale-110 border-white ring-2 ring-[#b4975a]"
                            : "border-zinc-700 hover:scale-105 opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {(editCoverColor || "#b4975a").toLowerCase() === c.hex.toLowerCase() && (
                          <Check size={11} className={c.hex === "#f8fafc" ? "text-black" : "text-white"} />
                        )}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={editCoverColor || "#b4975a"}
                      onChange={(e) => setEditCoverColor(e.target.value)}
                      className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0 p-0 overflow-hidden"
                      title="Custom Hex Color"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              {editCoverValue && (
                <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-xl h-36">
                  <img 
                    src={editCoverValue} 
                    alt="Cover Preview" 
                    style={{ objectPosition: getObjectPositionStyle(editCoverAlign) }}
                    className="w-full h-full object-cover" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 text-${editCoverTextAlign || "center"} items-${editCoverTextAlign === "left" ? "start" : (editCoverTextAlign === "right" ? "end" : "center")}`}>
                    <span style={{ color: editCoverColor || "#b4975a" }} className="text-[7px] uppercase font-bold tracking-widest block mb-0.5">
                      Deliverable Cover Preview
                    </span>
                    <span 
                      style={{ 
                        fontFamily: GALLERY_FONTS.find(f => f.id === editCoverFont)?.family || "'Cormorant Garamond', serif"
                      }} 
                      className="text-lg text-white font-medium truncate leading-tight"
                    >
                      {editingCoverGallery?.groomName && editingCoverGallery?.brideName ? (
                        <>
                          <span>{editingCoverGallery.groomName}</span>{" "}
                          <span style={{ color: editCoverColor || "#b4975a" }} className="italic font-serif">&amp;</span>{" "}
                          <span>{editingCoverGallery.brideName}</span>
                        </>
                      ) : (
                        editingCoverGallery?.name || "Dreamwed Wedding"
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCoverGallery(null)}
                  className="w-1/2 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateGalleryCover}
                  className="w-1/2 py-3 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#b4975a]/10"
                >
                  Save Cover Style
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Client Invoice Modal */}
      <AnimatePresence>
        {activeInvoiceBooking && (
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
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
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
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
                @page {
                  size: A4 portrait !important;
                  margin: 0 !important;
                }
                body * {
                  visibility: hidden !important;
                }
                .invoice-overlay, .invoice-overlay * {
                  visibility: visible !important;
                }
                html, body, #root, #root > div, .proposal-root-container {
                  position: static !important;
                  overflow: visible !important;
                  height: auto !important;
                  min-height: 0 !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  transform: none !important;
                  background: #fff !important;
                }
                .invoice-overlay {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 210mm !important;
                  height: 297mm !important;
                  box-sizing: border-box !important;
                  padding: 20mm !important;
                  margin: 0 !important;
                  background: #fff !important;
                  color: #000 !important;
                  page-break-after: always !important;
                  break-after: page !important;
                }
                .invoice-container {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
                  background: #fff !important;
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
                onClick={() => setActiveInvoiceBooking(null)}
                className="action-btn"
                style={{ background: "#222", color: "#fff", border: "1px solid #333" }}
              >
                ✕ Close Receipt
              </button>
              <button
                onClick={() => {
                  const includesPrewedding = (parseInt(activeInvoiceBooking.package_price || activeInvoiceBooking.total_price) === 49999 || parseInt(activeInvoiceBooking.package_price || activeInvoiceBooking.total_price) === 99999 || parseInt(activeInvoiceBooking.package_price || activeInvoiceBooking.total_price) === 110000);
                  const surpriseBonusText = includesPrewedding ? `🎁 SURPRISE BONUS: Free Save the Date Photoshoot (worth ₹9,999/-) included!\n` : '';
                  const message = `Hi ${activeInvoiceBooking.customer_name}! Here is your Digital Invoice Receipt for locking in your Wedding Package slot:\n\n` +
                                  `Invoice Number: ${activeInvoiceBooking.invoice_number || `DW-2026-${String(activeInvoiceBooking.id).padStart(3, '0')}`}\n` +
                                  `Plan: ${activeInvoiceBooking.package_name}\n` +
                                  `Quote: ₹${parseInt(activeInvoiceBooking.package_price || activeInvoiceBooking.total_price).toLocaleString()}/- Net\n` +
                                  `Advance Paid: ₹${(activeInvoiceBooking.advance_paid || 0).toLocaleString()}/-\n` +
                                  surpriseBonusText + `\n` +
                                  `Your Private Access Credentials:\n` +
                                  (activeInvoiceBooking.coverage_type === 'both' || activeInvoiceBooking.coverage_scope === 'both'
                                    ? `👰 Bride Password: ${activeInvoiceBooking.bride_password || '—'}\n`
                                    : '') +
                                  `🤵 Groom Password: ${activeInvoiceBooking.groom_password || '—'}\n` +
                                  `Link to selections: ${window.location.origin}/`;
                  window.open(`https://wa.me/91${activeInvoiceBooking.customer_phone}?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="action-btn"
                style={{ background: "#10b981", color: "#fff" }}
              >
                <Share2 size={14} /> Share Details
              </button>
              <button 
                onClick={() => {
                  if (window.electronAPI && typeof window.electronAPI.exportToPDF === 'function') {
                    window.electronAPI.exportToPDF({
                      landscape: false,
                      defaultName: `Dreamwed_Invoice_${activeInvoiceBooking ? activeInvoiceBooking.customer_name : 'Client'}.pdf`
                    });
                  } else {
                    window.print();
                  }
                }}
                className="action-btn"
                style={{ background: "#b4975a", color: "#000" }}
              >
                <Printer size={14} /> Print / Save as PDF
              </button>
            </div>

            {/* A4 Container */}
            <div className="invoice-container">
              {/* Branding header exactly styled like invoice images */}
              <div className="invoice-brand" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "none", paddingBottom: "0", marginBottom: "20px" }}>
                <div>
                  <img src="/appIcon.png" alt="Logo" style={{ width: "80px", height: "80px", objectFit: "contain" }} />
                </div>
                <div style={{ fontSize: "11px", textAlign: "right", color: "#555", lineHeight: "1.5" }}>
                  dreamwedstories.co.in<br />
                  +91 99954 12955
                </div>
              </div>

              {/* Bold Minimalist Title */}
              <div className="invoice-header-title" style={{ textAlign: "center", margin: "20px 0 35px 0" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "48px", fontWeight: "400", letterSpacing: "0.02em", color: "#000" }}>Invoice</h2>
              </div>

              {/* Meta details split */}
              <div className="invoice-meta-section">
                <div className="invoice-to">
                  <h3>INVOICE TO:</h3>
                  <div className="invoice-to-name">{activeInvoiceBooking.customer_name}</div>
                  {activeInvoiceBooking.customer_address && (
                    <div className="invoice-to-address text-[10px] text-zinc-500 dark:text-zinc-400 font-light mt-0.5 leading-normal max-w-[280px]">
                      {activeInvoiceBooking.customer_address}
                    </div>
                  )}
                  {activeInvoiceBooking.customer_address_2 && (
                    <div className="invoice-to-address text-[10px] text-zinc-500 dark:text-zinc-400 font-light mt-0.5 leading-normal max-w-[280px]">
                      {activeInvoiceBooking.customer_address_2}
                    </div>
                  )}
                  <div className="invoice-to-details">
                    <div>{activeInvoiceBooking.customer_phone}</div>
                    {activeInvoiceBooking.wedding_reception_mode === "different" && activeInvoiceBooking.different_date_details ? (
                      <>
                        <div>Wedding: {formatDateString(activeInvoiceBooking.different_date_details.wedding?.date)}</div>
                        <div>Reception: {formatDateString(activeInvoiceBooking.different_date_details.reception?.date)}</div>
                      </>
                    ) : (
                      <div>Date: {formatDateString(activeInvoiceBooking.event_date)}</div>
                    )}
                  </div>
                </div>

                <div className="invoice-details-right">
                  <table>
                    <tbody>
                      <tr>
                        <td className="lbl">Issued:</td>
                        <td className="val">{formatDateString(activeInvoiceBooking.invoice_date || activeInvoiceBooking.created_at)}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Invoice:</td>
                        <td className="val">{activeInvoiceBooking.invoice_number || `DW-2026-${String(activeInvoiceBooking.id).padStart(3, '0')}`}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Due:</td>
                        <td className="val">On Receipt</td>
                      </tr>
                      <tr>
                        <td className="lbl">{activeInvoiceBooking.package_name} Price:</td>
                        <td className="val">₹ {formatCurrency(activeInvoiceBooking.package_price || activeInvoiceBooking.total_price)}</td>
                      </tr>
                      {activeInvoiceBooking.package_price > activeInvoiceBooking.total_price && (
                        <tr>
                          <td className="lbl">Discount:</td>
                          <td className="val">₹ {formatCurrency(activeInvoiceBooking.package_price - activeInvoiceBooking.total_price)}</td>
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
                  {activeInvoiceBooking.payment_milestones && activeInvoiceBooking.payment_milestones.length > 0 ? (
                    activeInvoiceBooking.payment_milestones.map((m, index) => (
                      <tr key={index}>
                        <td>
                          <div style={{ fontWeight: 500, color: "#000", marginBottom: "2px" }}>{m.label}</div>
                        </td>
                        <td className="amount-col">₹ {formatCurrency(m.amount)}</td>
                        <td style={{ paddingLeft: "20px" }}>{m.date ? formatDateString(m.date) : "TBD"}</td>
                        <td className="amount-col">₹ {formatCurrency(m.amount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>
                        <div style={{ fontWeight: 500, color: "#000", marginBottom: "2px" }}>{activeInvoiceBooking.package_name}</div>
                      </td>
                      <td className="amount-col">₹ {formatCurrency(activeInvoiceBooking.package_price || activeInvoiceBooking.total_price)}</td>
                      <td style={{ paddingLeft: "20px" }}>{formatDateString(activeInvoiceBooking.event_date)}</td>
                      <td className="amount-col">₹ {formatCurrency(activeInvoiceBooking.package_price || activeInvoiceBooking.total_price)}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Right Summary breakdown */}
              <div className="invoice-summary">
                <table className="invoice-summary-table">
                  <tbody>
                    <tr>
                      <td className="lbl">Subtotal:</td>
                      <td className="val">
                        ₹ {formatCurrency(activeInvoiceBooking.payment_milestones && activeInvoiceBooking.payment_milestones.length > 0
                          ? activeInvoiceBooking.payment_milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0)
                          : (activeInvoiceBooking.total_price || activeInvoiceBooking.package_price || 0)
                        )}/-
                      </td>
                    </tr>
                    <tr>
                      <td className="lbl">Tax (0%):</td>
                      <td className="val">₹ 0/-</td>
                    </tr>
                    <tr>
                      <td className="lbl">Total:</td>
                      <td className="val">
                        ₹ {formatCurrency(activeInvoiceBooking.payment_milestones && activeInvoiceBooking.payment_milestones.length > 0
                          ? activeInvoiceBooking.payment_milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0)
                          : (activeInvoiceBooking.total_price || activeInvoiceBooking.package_price || 0)
                        )}/-
                      </td>
                    </tr>
                    <tr className="total-payable-row">
                      <td className="lbl">Total Payable Amount:</td>
                      <td className="val">₹ {formatCurrency(activeInvoiceBooking.total_price - activeInvoiceBooking.advance_paid)}/-</td>
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

            {/* Credentials Card (visible on screen but hidden during print) */}
            <div className="no-print max-w-[800px] mx-auto mt-6 mb-12 px-4">
              <div className="bg-zinc-900 border border-[#b4975a]/20 p-6 rounded-[24px] space-y-4 text-left shadow-xl">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <span className="text-base">🔑</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#b4975a]">Couple Client Portal Access Credentials</h4>
                </div>
                <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                  Share these generated private passwords with the couple so they can sign into the Client Portal selection lounge:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(activeInvoiceBooking.coverage_type === 'both' || activeInvoiceBooking.coverage_scope === 'both') && activeInvoiceBooking.bride_password && (
                    <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">👰 Bride Password:</span>
                      <span className="text-white font-mono font-bold text-xs">{activeInvoiceBooking.bride_password}</span>
                    </div>
                  )}
                  <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">🤵 Groom Password:</span>
                    <span className="text-white font-mono font-bold text-xs">{activeInvoiceBooking.groom_password || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewing Payment Proof Modal */}
      <AnimatePresence>
        {viewingProof && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md no-print"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl p-6 relative flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-zinc-850 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Payment Proof Screenshot</h3>
                  {viewingProof.transId && (
                    <p className="text-[10px] text-zinc-500 font-light mt-0.5">Transaction ID: <span className="font-mono text-zinc-300 font-bold">{viewingProof.transId}</span></p>
                  )}
                </div>
                <button 
                  onClick={() => setViewingProof(null)}
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-auto rounded-2xl bg-zinc-900 border border-zinc-850 flex items-center justify-center p-2 min-h-[300px]">
                {viewingProof.url.startsWith("data:") || viewingProof.url.startsWith("http") ? (
                  <img 
                    src={viewingProof.url} 
                    alt="Payment Proof" 
                    className="max-h-[50vh] object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center p-8 text-zinc-500 text-xs">
                    📁 Filename: {viewingProof.url} (Preview unavailable)
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-850">
                {viewingProof.url.startsWith("data:") && (
                  <a 
                    href={viewingProof.url} 
                    download={`${viewingProof.name}.png`}
                    className="px-4 py-2 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center active:scale-95"
                  >
                    Download File
                  </a>
                )}
                <button 
                  onClick={() => setViewingProof(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-[11px] uppercase tracking-wider transition-all border border-zinc-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewing Invitation Modal */}
      <AnimatePresence>
        {viewingInvitation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md no-print"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl p-6 relative flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-zinc-850 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Client Invitation Details</h3>
                  <p className="text-[10px] text-zinc-500 font-light mt-0.5">Uploaded during booking registration</p>
                </div>
                <button 
                  onClick={() => setViewingInvitation(null)}
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-auto rounded-2xl bg-zinc-900 border border-zinc-850 flex items-center justify-center p-2 min-h-[300px]">
                {viewingInvitation.url.startsWith("data:") || viewingInvitation.url.startsWith("http") ? (
                  <img 
                    src={viewingInvitation.url} 
                    alt="Invitation Card" 
                    className="max-h-[50vh] object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center p-8 text-zinc-500 text-xs">
                    📁 Filename: {viewingInvitation.url} (Preview unavailable)
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#3f3f46]">
                {viewingInvitation.url.startsWith("data:") && (
                  <a 
                    href={viewingInvitation.url} 
                    download={`${viewingInvitation.name}.png`}
                    className="px-4 py-2 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center active:scale-95"
                  >
                    Download File
                  </a>
                )}
                <button 
                  onClick={() => setViewingInvitation(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-[11px] uppercase tracking-wider transition-all border border-zinc-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        </main>
      </div>
    </div>
  );
};

export default Admin;
