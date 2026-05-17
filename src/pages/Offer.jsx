import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Sparkles, Clock, CheckCircle2, 
  Send, Loader2, Play, Award, ShieldCheck, Star, Quote, ArrowRight
} from "lucide-react";
import { FaInstagram } from "react-icons/fa6";
import Button from "../components/ui/Button";
import SEO from "../components/SEO";

// Images
import HeroBg from "../assets/images/RED.jpg";
import Promise1 from "../assets/images/new_portrait_1.jpg";
import Promise2 from "../assets/images/new_portrait_2.jpg";
import Promise3 from "../assets/images/new_portrait_3.jpg";
import Promise4 from "../assets/images/new_portrait_4.jpg";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzy15y5t2F5uM9NiYPimHvlS6xDw2N1Z5oTHF3SQnR6AI_fxo6y6mhIepsUj-kav31g/exec";

const Offer = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", date: "", message: "" });
  const [status, setStatus] = useState("idle"); 

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 1, hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("date", formData.date);
      form.append("message", `[SPECIAL OFFER ₹59,999 INQUIRY] ${formData.message}`);
      form.append("timestamp", new Date().toLocaleString());

      await fetch(SCRIPT_URL, { method: "POST", body: form, mode: "no-cors" });
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", date: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  const scrollToForm = () => {
    document.getElementById("booking-form").scrollIntoView({ behavior: "smooth" });
  };

  const videos = [
    { id: "c310o24XVN0", title: "The Symphony of Rituals", desc: "Cinematic traditional wedding highlights with epic drone captures." },
    { id: "S9-SrdnKsMs", title: "Glimpses of Forever", desc: "Emotional highlights showing wedding candids and shared glances." },
    { id: "jnSAu-C6OmQ", title: "An Elegant Rhapsody", desc: "Modern reception storytelling capturing high-energy events." }
  ];

  const reviews = [
    { name: "Deepak Kollam", text: "Superb work bro! We had a great experience with the team. I am someone who doesn't pose for photos at all, but you guys managed to capture such incredible shots and made me feel so comfortable. Thank you so much!" },
    { name: "Prajith", text: "Superb! We are so incredibly happy ❤️ The photo edits turned out absolutely amazing! Thank you for capturing our moments perfectly." },
    { name: "Chindu", text: "What you did is one of the best I have seen so far. I've been searching for wedding videographers for 7 months, and I can say without any doubt... the cinematic video you guys did is one of the best!" }
  ];

  const instagramLink = "https://www.instagram.com/dreamwed_stories.co?igsh=MWxuOXZkcHZ2cWgwdw==";

  return (
    <div className="bg-zinc-950 text-white min-h-screen select-none overflow-hidden pb-16 font-sans">
      <SEO 
        title="Exclusive Flash Sale | Dreamwed Stories"
        description="Claim our limited-time premium wedding photography package starting @ ₹59,999/- only. Only 2 slots remaining. Cinematic films & custom albums included."
      />

      {/* STICKY URGENCY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-3 md:py-4 z-50 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 text-[10px] md:text-xs tracking-widest font-bold shadow-[0_-15px_40px_rgba(220,38,38,0.4)] px-4">
        <span className="animate-pulse flex items-center gap-2"><Sparkles size={14}/> FLASH SALE ALERT</span>
        <span className="hidden md:inline">|</span>
        <span>🔥 ONLY 2 SLOTS REMAINING FOR ₹59,999/-</span>
        <span className="hidden md:inline">|</span>
        <button onClick={scrollToForm} className="bg-white text-red-700 px-5 py-1.5 md:py-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md">
          CLAIM YOUR DATE
        </button>
      </div>

      {/* HERO SECTION (CINEMATIC FULL-SCREEN) */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-20 border-b border-zinc-900">
        <div className="absolute inset-0 z-0">
          <img src={HeroBg} alt="Luxury Wedding Portrait" className="w-full h-full object-cover object-top opacity-30 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,151,90,0.15),transparent_70%)]"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-7 space-y-6 md:space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/60 border border-[#b4975a]/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[#b4975a] text-[10px] tracking-[0.3em] uppercase font-bold">Limited Time Discount</span>
            </div>
            
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-5xl md:text-7xl lg:text-[90px] font-light leading-[1.05] tracking-tight">
              Cinematic Luxury, <br/>
              <span className="italic font-normal text-[#b4975a]">Now Accessible.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-xl">
              Lock in Trivandrum's most elite complete wedding photography and cinematography package. Save ₹10,000 instantly.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={scrollToForm} className="px-8 py-4.5 rounded-full bg-gradient-to-r from-[#d1a852] to-[#b4975a] text-zinc-950 font-bold text-sm tracking-wider uppercase hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(180,151,90,0.4)] transition-all duration-300">
                Secure ₹59,999/- Pricing
              </button>
            </div>
          </motion.div>

          {/* DYNAMIC COUNTDOWN WIDGET */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-5 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[30px] p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
            
            <div className="text-center mb-8">
              <span className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-bold block mb-2">Offer Expires In</span>
              <div className="flex justify-center gap-3 md:gap-5 text-center numbers-pro">
                {[
                  { label: "Days", val: timeLeft.days },
                  { label: "Hrs", val: timeLeft.hours },
                  { label: "Min", val: timeLeft.minutes },
                  { label: "Sec", val: timeLeft.seconds }
                ].map((time, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-zinc-950 border border-zinc-800 text-[#b4975a] rounded-xl flex items-center justify-center text-2xl md:text-3xl font-light shadow-inner">
                      {String(time.val).padStart(2, "0")}
                    </div>
                    <span className="text-[9px] uppercase font-bold text-zinc-500 mt-2 tracking-widest">{time.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-8" />

            <div className="text-center">
              <span className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-bold block mb-2">The Gold Lite Package</span>
              <div className="flex justify-center items-center gap-4 mb-4">
                <span className="text-5xl font-light tracking-tight text-white numbers-pro">₹59,999/-</span>
              </div>
              <span className="text-zinc-400 text-sm line-through decoration-red-500/50 decoration-2 numbers-pro block mb-6">Regularly ₹69,999</span>
              
              <ul className="text-left space-y-3">
                {["Complete Photo & Video Coverage", "Full Pre & Post Wedding Edits", "70-Page Layflat Album"].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-light">
                    <CheckCircle2 size={16} className="text-[#b4975a] shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VISUAL SERVICE BENTO GRID (THE PROMISE) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[#b4975a] text-[10px] tracking-[0.3em] uppercase font-bold">What You Get</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl md:text-6xl font-light">
            Visual Proof. <span className="italic text-zinc-500">Uncompromised Quality.</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
            Unlike standard studios, we don't just list our services. We guarantee breathtaking cinematic outcomes across every single medium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1 */}
          <div className="lg:col-span-2 lg:row-span-2 relative rounded-[32px] overflow-hidden group">
            <img src={Promise1} alt="Wedding Photography" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <span className="px-3 py-1 bg-[#b4975a]/20 text-[#b4975a] border border-[#b4975a]/30 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 inline-block backdrop-blur-sm">Included</span>
              <h3 className="text-3xl md:text-4xl font-serif mb-2">Cinematic Photography</h3>
              <p className="text-zinc-300 text-sm md:text-base font-light max-w-md">Unobtrusive candid wedding & reception coverage capturing raw, unfiltered emotional moments.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-[32px] overflow-hidden group">
            <img src={Promise2} alt="Wedding Films" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="text-2xl font-serif mb-2">4K Documentary Films</h3>
              <p className="text-zinc-400 text-xs font-light">Full HD wedding video & cinematic highlights reel.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative rounded-[32px] overflow-hidden group">
            <img src={Promise3} alt="Premium Albums" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="text-2xl font-serif mb-2">70-Page Layflat Album</h3>
              <p className="text-zinc-400 text-xs font-light">Lustre-finish premium heirloom printed albums.</p>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="lg:col-span-3 relative rounded-[32px] overflow-hidden group bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center p-8 gap-8">
             <div className="flex-1 space-y-4">
                <span className="text-[#b4975a] text-[10px] tracking-[0.3em] uppercase font-bold">Bonus Additions</span>
                <h3 className="text-3xl font-serif">Social Reels & Calendar</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xl">
                  Get custom-edited vertical reels ready for Instagram immediately after the event, plus a gorgeous personalized desktop calendar of your best shots.
                </p>
             </div>
             <div className="w-full md:w-1/3 aspect-[21/9] md:aspect-video rounded-2xl overflow-hidden relative">
                <img src={Promise4} alt="Reels & Extras" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaInstagram size={32} className="text-white/80" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS (SOCIAL PROOF) */}
      <section className="py-24 bg-zinc-900 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[#b4975a] text-[10px] tracking-[0.3em] uppercase font-bold">Client Love</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl md:text-5xl font-light">
              Trusted by 500+ Couples
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-zinc-950 p-8 rounded-[30px] border border-zinc-800/60 shadow-xl relative"
              >
                <Quote size={40} className="text-zinc-800 absolute top-6 right-6" />
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-[#b4975a] text-[#b4975a]" />)}
                </div>
                <p className="text-zinc-300 font-light text-sm leading-relaxed mb-8 relative z-10 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#b4975a] font-serif font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <span className="font-bold text-xs uppercase tracking-widest text-zinc-100">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUTUBE CINEMATIC SHOWCASE */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[#b4975a] text-[10px] tracking-[0.3em] uppercase font-bold block">Cinema Standard</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl md:text-5xl font-light leading-tight">
            Watch The Quality We Guarantee
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {videos.map((vid, idx) => (
            <div key={idx} className="bg-zinc-900 rounded-[32px] overflow-hidden border border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
              <div className="relative aspect-video w-full bg-black">
                <iframe 
                  width="100%" height="100%" 
                  src={`https://www.youtube.com/embed/${vid.id}?modestbranding=1&rel=0&controls=0`} 
                  title={vid.title} 
                  style={{ border: 0 }} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0"
                ></iframe>
              </div>
              <div className="p-8">
                <h4 className="font-serif text-xl font-normal text-white mb-2">{vid.title}</h4>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">{vid.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP BOOKING FORM */}
      <section id="booking-form" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-[40px] p-8 md:p-16 border border-zinc-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            
            {status === "success" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-zinc-900 z-20">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-4xl font-serif font-light mb-4 text-white">Offer Pricing Locked!</h3>
                <p className="text-zinc-400 text-sm font-light max-w-md">Our luxury coordination team will contact you within 24 hours to proceed with the booking formalities.</p>
              </motion.div>
            )}

            <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
              <span className="text-red-500 text-[10px] tracking-[0.3em] uppercase font-bold flex items-center justify-center gap-2">
                <Clock size={14} className="animate-pulse"/> Secure Your Date Now
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
                Claim The ₹59,999/- Package
              </h2>
              <p className="text-sm text-zinc-400 font-light">Submitting this form guarantees your eligibility for the promotional pricing if your dates are available.</p>
            </div>

            <form onSubmit={handleSubmit} className={`space-y-8 ${status === "loading" ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-3 ml-2">Couple Names</label>
                  <input name="name" required className="w-full px-6 py-4.5 rounded-[20px] bg-zinc-950 border border-zinc-800 text-white focus:border-[#b4975a] focus:ring-1 focus:ring-[#b4975a]/30 outline-none transition-all text-sm font-light placeholder-zinc-700" placeholder="E.g. Sarah & Leo" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-3 ml-2">Phone Number</label>
                  <input name="phone" type="tel" required className="w-full px-6 py-4.5 rounded-[20px] bg-zinc-950 border border-zinc-800 text-white focus:border-[#b4975a] focus:ring-1 focus:ring-[#b4975a]/30 outline-none transition-all text-sm font-light placeholder-zinc-700 numbers-pro" placeholder="+91 90000 00000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-3 ml-2">Email Address</label>
                  <input name="email" type="email" required className="w-full px-6 py-4.5 rounded-[20px] bg-zinc-950 border border-zinc-800 text-white focus:border-[#b4975a] focus:ring-1 focus:ring-[#b4975a]/30 outline-none transition-all text-sm font-light placeholder-zinc-700" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-3 ml-2">Wedding Date</label>
                  <input name="date" type="text" required className="w-full px-6 py-4.5 rounded-[20px] bg-zinc-950 border border-zinc-800 text-white focus:border-[#b4975a] focus:ring-1 focus:ring-[#b4975a]/30 outline-none transition-all text-sm font-light placeholder-zinc-700 numbers-pro" placeholder="E.g. November 2026" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-3 ml-2">Event Details & Locations</label>
                <textarea name="message" rows="3" className="w-full px-6 py-4.5 rounded-[20px] bg-zinc-950 border border-zinc-800 text-white focus:border-[#b4975a] focus:ring-1 focus:ring-[#b4975a]/30 outline-none transition-all text-sm font-light placeholder-zinc-700 resize-none" placeholder="Tell us about the venues and your vision..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
              </div>

              <button type="submit" disabled={status === "loading"} className="w-full py-5 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#d1a852] to-[#b4975a] hover:from-[#e3ba64] hover:to-[#c5a86b] text-zinc-950 shadow-[0_0_20px_rgba(180,151,90,0.3)] hover:shadow-[0_0_30px_rgba(180,151,90,0.5)] active:scale-95 transition-all duration-300">
                {status === "loading" ? <>Locking Details... <Loader2 className="animate-spin" size={18} /></> : <>Claim Offer & Save ₹10,000 <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Offer;
