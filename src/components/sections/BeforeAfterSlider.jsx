import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import newPortrait1 from "../../assets/images/new_portrait_1.jpg";

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // Measure container dimensions for pixel-perfect clipping align
  const updateDimensions = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <section className="w-full py-28 bg-[#fbfbfa] select-none overflow-hidden border-t border-[#ececea]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#b4975a] font-semibold text-xs sm:text-sm tracking-[0.3em] uppercase block"
          >
            Retouching Artistry
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-4xl sm:text-5xl md:text-6xl text-zinc-900 font-light tracking-tight leading-tight text-balance"
          >
            Crafting the <span className="italic">Timeless Heirloom</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#6b736c] font-light text-sm sm:text-base leading-relaxed"
          >
            Witness our meticulous art of luxury color grading and professional retouching. 
            Slide the golden handle to see how we transform a raw camera frame into a stunning, warm masterpiece.
          </motion.p>
        </div>

        {/* COMPARISON SLIDER */}
        <div 
          ref={containerRef}
          className="relative max-w-4xl mx-auto aspect-[3/2] w-full rounded-[32px] overflow-hidden border border-[#ececea] shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-zinc-200 cursor-ew-resize select-none touch-none"
          onMouseDown={() => { isDragging.current = true; }}
          onTouchStart={() => { isDragging.current = true; }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* 1. AFTER IMAGE (Luxury Edited - full background) */}
          <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
            <img 
              src={newPortrait1} 
              alt="Cinematic graded gold edit" 
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            {/* FLOATING TAG RIGHT */}
            <div className="absolute top-3 md:top-6 right-3 md:right-6 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 text-white text-[8px] md:text-[10px] font-semibold tracking-widest uppercase">
              Dreamwed Color Grade
            </div>
          </div>

          {/* 2. BEFORE IMAGE (Raw flat camera shot - clipped left) */}
          <div 
            className="absolute inset-0 h-full overflow-hidden select-none pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="absolute inset-0 h-full aspect-[3/2]" style={{ width: `${containerWidth}px` }}>
              <img 
                src={newPortrait1} 
                alt="Raw camera shot unedited" 
                className="w-full h-full object-cover filter contrast-[0.82] saturate-[0.62] brightness-[0.98] select-none pointer-events-none"
                style={{ width: `${containerWidth}px`, maxWidth: "none" }}
              />
            </div>
            {/* FLOATING TAG LEFT */}
            <div className="absolute top-3 md:top-6 left-3 md:left-6 z-10 bg-zinc-900/60 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 text-white text-[8px] md:text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap">
              Raw Camera Frame
            </div>
          </div>

          {/* 3. GOLD DRAG HANDLE & DIVIDER LINE */}
          <div 
            className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#d1a852] via-[#b4975a] to-[#d1a852] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Center Drag Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-black shadow-2xl border-2 border-[#b4975a] flex items-center justify-center pointer-events-auto hover:scale-110 active:scale-95 transition-transform duration-300">
              <svg className="w-5 h-5 text-[#b4975a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" className="rotate-90 origin-center" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default BeforeAfterSlider;
