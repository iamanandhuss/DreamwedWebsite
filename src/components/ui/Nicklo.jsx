import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import pic1 from "../../assets/images/pic1.jpeg";
import pic2 from "../../assets/images/pic2.jpeg";
import pic3 from "../../assets/images/pic3.jpeg";
import pic4 from "../../assets/images/pic4.jpeg";

const segments = [
  {
    num: "01",
    title: "Bridal Portraits",
    subtitle: "Traditional & Portraiture",
    image: pic1,
    desc: "Capturing the regal grace, intricate jewelry, and delicate details of traditional wedding couture.",
  },
  {
    num: "02",
    title: "Couple Stories",
    subtitle: "Candid & Narrative",
    image: pic2,
    desc: "Every glance, every gentle touch. Capturing the authentic connection and candid joy of your romance.",
  },
  {
    num: "03",
    title: "Venue Details",
    subtitle: "Ambience & Artistry",
    image: pic3,
    desc: "Focusing on the majestic decor, warm lights, and elegant venue curation that define your big day.",
  },
  {
    num: "04",
    title: "Fine Art Moments",
    subtitle: "Creative Cinematic",
    image: pic4,
    desc: "Creating timeless, cinematic wedding frames that feel like scenes from an exquisite classic film.",
  },
];

export const Nicklo = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="w-full bg-[#fbfbfa] py-28 px-6 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#b4975a] font-semibold text-[13px] tracking-[0.25em] uppercase block mb-3">
              Our Portfolios
            </span>
            <h2 className="text-[52px] md:text-[68px] leading-[0.95] tracking-[-3px] text-black font-normal" style={{ fontFamily: "Inter, sans-serif" }}>
              Signature Stories
            </h2>
          </div>
          <p className="text-[18px] text-[#6b736c] max-w-md font-light leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Explore our curated collections detailing every emotional highlight, traditional ritual, and cinematic romance.
          </p>
        </div>

        {/* ACCORDION GRID */}
        <div className="w-full h-[600px] md:h-[680px] flex flex-col md:flex-row gap-4 overflow-hidden rounded-[36px]">
          {segments.map((item, index) => {
            const isActive = active === index;

            return (
              <div
                key={item.num}
                onMouseEnter={() => setActive(index)}
                onClick={() => setActive(index)}
                className={`relative h-full overflow-hidden rounded-[28px] cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group ${
                  isActive ? "flex-[2.5] md:flex-[3.5]" : "flex-1"
                }`}
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />

                {/* GRADIENT OVERLAYS */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 transition-opacity duration-700 ${
                    isActive ? "opacity-90" : "opacity-75 group-hover:opacity-65"
                  }`} 
                />

                {/* CONTENT CONTAINER */}
                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10 text-white select-none">
                  {/* Top: Collection Number & Vertical Text when Collapsed */}
                  <div className="flex justify-between items-start">
                    <span className="text-[20px] font-light tracking-wider opacity-85">
                      {item.num}
                    </span>
                    
                    {/* Vertically oriented subtitle when collapsed, fades out when expanded */}
                    <span 
                      className={`text-[11px] tracking-[0.25em] uppercase font-semibold text-[#b4975a] transition-all duration-500 origin-top-right block ${
                        isActive 
                          ? "opacity-0 invisible pointer-events-none" 
                          : "opacity-100 md:rotate-90 md:translate-x-4 md:translate-y-8"
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  </div>

                  {/* Bottom details */}
                  <div className="text-left">
                    {/* Active tag */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 0.85, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.4 }}
                          className="text-[#b4975a] font-semibold text-[11px] tracking-[0.25em] uppercase block mb-2"
                        >
                          {item.subtitle}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Title */}
                    <h3 
                      className="text-3xl md:text-4xl font-normal tracking-tight text-white mb-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {item.title}
                    </h3>

                    {/* Description - expanded only */}
                    <div 
                      className={`transition-all duration-700 overflow-hidden ${
                        isActive ? "max-h-[150px] opacity-100 mt-4" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-[15px] font-light leading-relaxed text-zinc-200 max-w-md">
                        {item.desc}
                      </p>
                      
                      <div className="mt-6 flex items-center gap-2 text-[#b4975a] text-[14px] font-semibold hover:underline">
                        <span>Explore Collection</span>
                        <FiArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
