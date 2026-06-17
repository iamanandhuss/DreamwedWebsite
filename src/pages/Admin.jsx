import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn, LogOut, ShieldCheck, AlertCircle, Link2, Calendar, CheckCircle2,
  ChevronRight, FileText, Package, Users, MessageSquare, Plus, Trash2, Edit3,
  Eye, EyeOff, Save, X, Camera, Video, BookOpen, RefreshCw, Search, Share2,
  Download, Heart, Printer
} from "lucide-react";
import SEO from "../components/SEO";

const ADMIN_PASS = "dreamwed2026";
const API_BASE = typeof window !== "undefined"
  ? (localStorage.getItem("dreamwed_api_base") || import.meta.env.VITE_API_BASE_URL || (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? window.location.origin : "https://dreamwed-backend.onrender.com"))
  : "http://localhost:3000";

const INITIAL_GALLERIES = [];

const formatCurrency = (num) => Number(num || 0).toLocaleString("en-IN");

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("projects"); // projects | staff | chats

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

  // Chats tab state
  const [chatProject, setChatProject] = useState(null);
  const [chatChannel, setChatChannel] = useState("client-admin");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // AI Galleries & Orders state
  const [aiGalleries, setAiGalleries] = useState([]);
  const [aiOrders, setAiOrders] = useState([]);
  const [newGalName, setNewGalName] = useState("");
  const [newGalDrive, setNewGalDrive] = useState("");
  const [newGalType, setNewGalType] = useState("After Event Gallery");
  const [newGalCover, setNewGalCover] = useState("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800");
  const [selectedGalForPhotos, setSelectedGalForPhotos] = useState(null);
  const [bulkPhotoUrls, setBulkPhotoUrls] = useState("");

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

      // Load AI galleries & orders
      if (!localStorage.getItem("dreamwed_galleries")) {
        localStorage.setItem("dreamwed_galleries", JSON.stringify(INITIAL_GALLERIES));
      }
      const storedGals = JSON.parse(localStorage.getItem("dreamwed_galleries") || "[]");
      const storedOrds = JSON.parse(localStorage.getItem("dreamwed_orders") || "[]");
      setAiGalleries(storedGals);
      setAiOrders(storedOrds);

      // Auto-poll for new booking requests every 15 seconds
      const bookingPoller = setInterval(() => {
        fetchBookings();
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

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
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
      } else {
        throw new Error("Server error");
      }
    } catch (e) {
      console.error("Error fetching bookings, falling back locally:", e);
      const localBookings = JSON.parse(localStorage.getItem("dreamwed_bookings") || "[]");
      setBookings(localBookings);
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

  const handleCreateAiGallery = (e) => {
    e.preventDefault();
    if (!newGalName || !newGalDrive) return;
    const newId = `wedding-${newGalName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const newGal = {
      id: newId,
      name: newGalName,
      gdriveLink: newGalDrive,
      type: newGalType,
      coverUrl: newGalCover,
      photos: []
    };
    const updated = [newGal, ...aiGalleries];
    setAiGalleries(updated);
    localStorage.setItem("dreamwed_galleries", JSON.stringify(updated));
    setNewGalName("");
    setNewGalDrive("");
    alert("💍 AI Photo Gallery created successfully!");
  };


  const handleDeleteAiGallery = (id) => {
    if (aiGalleries.length <= 1) {
      alert("Cannot delete the last remaining AI gallery!");
      return;
    }
    if (!confirm("Are you sure you want to delete this gallery?")) return;
    const updated = aiGalleries.filter(g => g.id !== id);
    setAiGalleries(updated);
    localStorage.setItem("dreamwed_galleries", JSON.stringify(updated));
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
    <div className="min-h-screen bg-[#080808] pt-20 pb-16">
      <SEO title="Admin Control Center" description="Dreamwed Stories secure management portal." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 text-white"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-zinc-800">
          <div>
            <span className="text-[#b4975a] font-bold text-[10px] tracking-[0.3em] uppercase block mb-1">Client Portal Console</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-white font-light tracking-tight">
              Admin <span className="italic font-serif text-[#b4975a]">Control Panel</span>
            </h1>
          </div>
          <div className="flex gap-2.5">
            <a href="/"
              className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-[#b4975a] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#b4975a]/20 hover:border-[#b4975a]/40 transition-all cursor-pointer active:scale-95">
              <span>←</span> Back to Home
            </a>
            <button onClick={handleLogout}
              className="px-4 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-zinc-100 transition-all cursor-pointer active:scale-95">
              <LogOut size={13} /> Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {(() => {
          const pendingCount = bookings.filter(b => b.status !== "confirmed" && b.status !== "rejected").length;
          return (
            <>
              {/* New Request Alert Banner */}
              {pendingCount > 0 && activeTab !== "bookings" && (
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="flex items-center gap-3 w-full mb-4 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/15 transition-all cursor-pointer text-left group"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex-1">
                    🔔 New Request ({pendingCount}) — {pendingCount === 1 ? "1 booking" : `${pendingCount} bookings`} pending approval! Click to review.
                  </span>
                  <span className="text-amber-400/60 text-[10px] font-bold uppercase tracking-widest group-hover:text-amber-400 transition-colors">
                    Review →
                  </span>
                </button>
              )}

              <div className="flex flex-wrap gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 mb-8 w-fit">
                {[
                  { id: "projects", label: "🗂 Projects" },
                  { id: "bookings", label: "📖 Booking Approvals", badge: pendingCount },
                  { id: "clients", label: "👑 Client Management" },
                  { id: "staff", label: "👥 Staff Management" },
                  { id: "chats", label: "💬 Chat Viewer" },
                  { id: "ai-galleries", label: "💍 AI Galleries" },
                  { id: "ai-orders", label: "🧾 AI Print Orders" }
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`relative px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === tab.id ? "bg-[#b4975a] text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-white"
                    }`}>
                    {tab.label}
                    {tab.badge > 0 && (
                      <span className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black flex items-center justify-center shadow-lg ${
                        activeTab === tab.id ? "bg-red-600 text-white" : "bg-red-500 text-white animate-bounce"
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          );
        })()}

        {/* =============================== PROJECTS TAB ================================ */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            {/* Left: Project list */}
            <div className="md:col-span-2 space-y-4 text-left">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Projects ({projects.length})</span>
              {projects.map((p) => {
                const isSelected = selectedProject?.id === p.id;
                const progress = getProgressPct(p);
                const currentStepName = p.timeline_steps[p.current_step - 1]?.name || "Pending";
                return (
                  <button key={p.id} onClick={() => setSelectedProject(p)}
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
            <div className="md:col-span-3">
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
                      <span>Stage: {selectedProject.timeline_steps[selectedProject.current_step - 1]?.name}</span>
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
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">
                          Event Venue: <strong className="text-white">{b.event_venue}</strong> • Date: <strong className="text-white">{formatDateString(b.event_date)}</strong>
                        </p>
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
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-white font-light">
                Client <span className="italic font-serif text-[#b4975a]">Management</span>
              </h2>
              <p className="text-zinc-500 text-[11px] font-light mt-1">Manage client passwords, access details, invoice receipts, and review photo selections.</p>
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
                            Date: {formatDateString(b.event_date)} • Phone: {b.customer_phone}
                          </p>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Right Panel: Client Workspace Details, Passwords, Selections, Invoices */}
              <div className="md:col-span-3">
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
                      <p className="text-zinc-500 text-[10px] font-light mt-1 flex flex-wrap gap-2">
                        <span>Date: {formatDateString(selectedClient.event_date)}</span>
                        <span>•</span>
                        <span>Venue: {selectedClient.event_venue || "TBA"}</span>
                        <span>•</span>
                        <span>Pkg: {selectedClient.package_name}</span>
                      </p>
                    </div>

                    {/* Password management */}
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

                    {/* Selected Photos Inspection Section */}
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

                    {/* Invoice Actions */}
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
                  </div>
                ) : (
                  <div className="h-96 rounded-[32px] border border-dashed border-zinc-800 bg-zinc-950/20 flex items-center justify-center text-zinc-500 text-xs">
                    Select a client workspace from the left pane to manage access, receipts, and co-selections.
                  </div>
                )}
              </div>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start text-left">
            {/* Gallery Creation Sidebar */}
            <div className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-[28px] p-6 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Camera size={16} className="text-[#b4975a]" /> Create AI Photo Gallery
              </h3>
              
              <form onSubmit={handleCreateAiGallery} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Wedding Name</label>
                  <input type="text" placeholder="e.g., Kabir & Ananya's Royal Vows" required
                    value={newGalName} onChange={(e) => setNewGalName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Google Drive Link</label>
                  <input type="url" placeholder="https://drive.google.com/..." required
                    value={newGalDrive} onChange={(e) => setNewGalDrive(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Gallery Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setNewGalType("After Event Gallery")}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                        newGalType === "After Event Gallery" ? "bg-zinc-800 text-[#b4975a] border-[#b4975a]/30" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                      }`}>
                      After Event
                    </button>
                    <button type="button" onClick={() => setNewGalType("Live Gallery")}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                        newGalType === "Live Gallery" ? "bg-zinc-800 text-[#b4975a] border-[#b4975a]/30" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                      }`}>
                      Live Gallery
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Client Cover Photo Preset</label>
                  <select value={newGalCover} onChange={(e) => setNewGalCover(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:border-[#b4975a] focus:outline-none">
                    <option value="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800">Wedding Altar & Florals (Warm Rose)</option>
                    <option value="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800">Couple Walkout Celebration</option>
                    <option value="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800">Traditional Golden Mandap</option>
                    <option value="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800">Bridal Luxury Details</option>
                  </select>
                </div>

                <button type="submit"
                  className="w-full py-3 bg-[#b4975a] hover:bg-[#c5a86b] text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2">
                  <Plus size={14} /> Create AI Gallery
                </button>
              </form>
            </div>

            {/* Galleries list */}
            <div className="md:col-span-3 bg-zinc-950 border border-zinc-800 rounded-[28px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
                💍 Active AI Galleries ({aiGalleries.length})
              </h3>
              
              {aiGalleries.length === 0 ? (
                <div className="text-center py-16 text-zinc-600 text-xs font-light">No active AI galleries found.</div>
              ) : (
                <div className="space-y-3.5">
                  {aiGalleries.map((g) => (
                    <div key={g.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img src={g.coverUrl} className="w-12 h-12 rounded-lg object-cover border border-zinc-750" alt="Wedding Cover" />
                        <div>
                          <span className="font-bold text-white text-sm block">{g.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[8px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${
                              g.type === "Live Gallery" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            }`}>
                              {g.type}
                            </span>
                            <span className="text-[9px] text-zinc-500">ID: {g.id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3.5 shrink-0">
                        <button 
                          onClick={() => setSelectedGalForPhotos(g)}
                          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-[#b4975a] hover:text-zinc-950 text-white text-[10px] font-bold uppercase tracking-wider border border-zinc-750 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Camera size={12} /> Manage Photos ({g.photos ? g.photos.length : 0})
                        </button>
                        <a href={g.gdriveLink} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-[#b4975a] font-bold uppercase tracking-wider hover:underline">
                          Drive Folder ↗
                        </a>
                        <button onClick={() => handleDeleteAiGallery(g.id)}
                          className="p-1.5 text-zinc-650 hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
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
                  <h3>INVOICE TO:</h3>
                  <div className="invoice-to-name">{activeInvoiceBooking.customer_name}</div>
                  <div className="invoice-to-details">
                    <div>{activeInvoiceBooking.customer_phone}</div>
                    <div>{formatDateString(activeInvoiceBooking.event_date)}</div>
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
                  GPay / PhonePe: +91 98954 12895
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

      </motion.div>
    </div>
  );
};

export default Admin;
