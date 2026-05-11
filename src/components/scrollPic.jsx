import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ArrowRight, Search, Heart, Camera, Clock } from "lucide-react";
import uImage from "../assets/images/uIcon.png";
import Footer from "./layout/Footer";

export const ScrollPic = ({ 
  allServices = [], 
  currentIndex = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(currentIndex);
  
  // Update internal index when the prop changes (e.g. when opening from a different card)
  useEffect(() => {
    setActiveIdx(currentIndex);
  }, [currentIndex, isOpen]);

  const currentService = allServices[activeIdx] || {};

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIdx = (activeIdx + 1) % allServices.length;
    setActiveIdx(nextIdx);
    
    // Scroll back to top smoothly when switching service
    const modalContent = document.getElementById("modal-scroll-container");
    if (modalContent) {
      modalContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="group cursor-default relative">
        <div className="overflow-hidden rounded-[40px] bg-[#f9f9f7] shadow-sm group-hover:shadow-2xl transition-all duration-700 relative">
          <img
            src={currentService.image}
            alt={currentService.title}
            className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* ARROW BUTTON - TOP RIGHT */}
          <button 
            onClick={() => setIsOpen(true)}
            className="absolute top-8 right-8 w-14 h-14 bg-white/90 backdrop-blur-sm text-black rounded-full flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 hover:bg-black hover:text-white z-10"
          >
            <ArrowUpRight size={28} />
          </button>
        </div>
        
        <div className="pt-8 px-4">
          <h3 className="text-[32px] md:text-[38px] tracking-[-0.03em] leading-tight text-black font-normal mb-3 group-hover:translate-x-2 transition-transform duration-700">
            {currentService.title}
          </h3>
          <p className="text-[17px] md:text-[19px] leading-relaxed text-[#66706a] max-w-lg font-light">
            {currentService.subtitle}
          </p>
        </div>
      </div>

      {/* EXPANDED UI MODAL - FULL PAGE SCROLL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-white overflow-hidden"
          >
            <div id="modal-scroll-container" className="h-full overflow-y-auto scroll-smooth">
              
              {/* STICKY HEADER */}
              <div className="sticky top-0 w-full px-8 md:px-16 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md z-20 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="text-[32px] font-serif tracking-tight leading-none">DW</div>
                  <h2 className="text-[18px] md:text-[20px] font-normal tracking-tight text-black">Dreamwed Stories</h2>
                </div>
                
                <div className="hidden lg:flex gap-10 items-center text-[15px] font-normal text-[#666]">
                  {["Home", "Services", "About", "Blog", "Contact"].map(nav => (
                    <span key={nav} className="cursor-pointer hover:text-black transition-colors">{nav}</span>
                  ))}
                  <Search size={20} className="cursor-pointer hover:text-black" />
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f5f5f3] hover:bg-black hover:text-white transition-all duration-500"
                >
                  <X size={24} />
                </button>
              </div>

              {/* HERO SECTION */}
              <div className="pt-10 md:pt-16 px-6 md:px-16 flex flex-col items-center">
                <motion.div 
                  key={activeIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full max-w-[1500px] aspect-[21/8] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl group mb-12"
                >
                  <img 
                    src={currentService.image} 
                    alt={currentService.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-10">
                    <h1 className="text-white text-[42px] sm:text-[64px] md:text-[96px] leading-[0.95] tracking-[-0.05em] font-normal text-center max-w-6xl drop-shadow-2xl text-balance">
                      {currentService.title}
                    </h1>
                  </div>
                </motion.div>

                {/* FOOTER ACTION (STAYS BELOW IMAGE) */}
                <div className="w-full max-w-[1500px] mb-24 flex justify-end px-4">
                  <button 
                    onClick={handleNext}
                    className="flex items-center gap-4 text-[20px] md:text-[24px] font-normal group hover:opacity-70 transition-all duration-500"
                  >
                    Next service
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center transition-transform group-hover:translate-x-3 duration-500 shadow-xl">
                      <ArrowRight size={22} />
                    </div>
                  </button>
                </div>
              </div>

              {/* REST OF THE UI - CONTENT SECTIONS */}
              <div className="w-full bg-[#f9f9f7] py-32 px-6">
                <div className="max-w-5xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div>
                      <h2 className="text-[42px] md:text-[56px] tracking-tight leading-[1.1] mb-8">Crafting your narrative with soul.</h2>
                      <p className="text-[18px] md:text-[20px] text-[#66706a] leading-relaxed font-light mb-10">
                        We believe every wedding has a unique heartbeat. Our approach is to listen, observe, and capture the moments that often go unnoticed but mean everything.
                      </p>
                      <div className="space-y-6">
                        {[
                          { icon: <Heart size={20} />, text: "Emotionally resonant imagery" },
                          { icon: <Camera size={20} />, text: "Professional-grade cinematic production" },
                          { icon: <Clock size={20} />, text: "Prompt delivery and heirloom quality" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 text-black font-medium">
                            <div className="text-[#8a9289]">{item.icon}</div>
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[40px] overflow-hidden aspect-square shadow-xl">
                      <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000" className="w-full h-full object-cover" alt="Detail" />
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <Footer />

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
