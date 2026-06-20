import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Film, Award, Clock } from 'lucide-react';

const SPOTLIGHT_VIDEOS = [
  {
    id: "I2g1nTniIEs",
    title: "Nripan & Sariga Wedding Film",
    subtitle: "Grand Destination Wedding at Leela Raviz",
    duration: "4:32 Min Cinema Teaser",
    metric: "4.8K+ Views",
    tag: "FEATURED FILM",
    desc: "A breathtaking celebration of traditional elegance and contemporary grandeur on the tranquil shores of Kovalam.",
    thumbnail: "https://img.youtube.com/vi/I2g1nTniIEs/maxresdefault.jpg"
  },
  {
    id: "S9-SrdnKsMs",
    title: "Mathew & Jismy Cinematic Story",
    subtitle: "Elegant Cathedral Ceremony & Resort Reception",
    duration: "5:10 Min Cinematic Reel",
    metric: "6.2K+ Views",
    tag: "BEST EDITOR CHOICE",
    desc: "Capturing the deep emotional vows and high-energy celebrations of a beautiful Christian ceremony in Central Kerala.",
    thumbnail: "https://img.youtube.com/vi/S9-SrdnKsMs/maxresdefault.jpg"
  },
  {
    id: "jnSAu-C6OmQ",
    title: "Chindhu & Dr. Arunima Story",
    subtitle: "Vibrant Traditional Kasavu Theme Wedding",
    duration: "3:45 Min Love Highlight",
    metric: "8.1K+ Views",
    tag: "TRENDING REEL",
    desc: "An absolute riot of vibrant colors, traditional percussion rhythm, and infectious smiles in a historic temple town.",
    thumbnail: "https://img.youtube.com/vi/jnSAu-C6OmQ/maxresdefault.jpg"
  }
];

export default function CinemaSpotlight() {
  const [activeVideoId, setActiveVideoId] = useState(null);

  return (
    <section className="py-24 bg-[#0a0a0c] relative overflow-hidden select-none">
      {/* Blurred background gold light orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#d1a852]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-500/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#d1a852] text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-bold mb-4">
            <Film size={12} className="text-[#d1a852]" /> Featured Cinematic Works
          </span>
          <h2 className="text-[32px] sm:text-[44px] md:text-[52px] leading-tight tracking-tight font-serif text-white font-light mb-4 text-balance">
            Stories Told in <span className="italic text-[#d1a852]">Cinema & Fine Art</span>
          </h2>
          <p className="text-[14px] md:text-[16px] leading-relaxed text-zinc-400 max-w-xl mx-auto font-light">
            Every smile, tear, and celebration captured in high-fidelity 4K optics. Watch our three best wedding films.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SPOTLIGHT_VIDEOS.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0.85, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="bg-[#121215] border border-white/5 rounded-[32px] overflow-hidden group hover:border-[#d1a852]/30 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_60px_rgba(209,168,82,0.05)] flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                {/* Thumbnail Layer */}
                <div 
                  className="relative aspect-[16/9] w-full overflow-hidden bg-black cursor-pointer group-hover:opacity-90 transition-opacity"
                  onClick={() => setActiveVideoId(video.id)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Subtle Dark Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30 transition-all group-hover:bg-[#d1a852] group-hover:border-[#d1a852]/20"
                    >
                      <Play fill={activeVideoId === video.id ? "#d1a852" : "black"} size={20} className="text-black ml-1 group-hover:fill-white group-hover:text-white" />
                    </motion.div>
                  </div>

                  {/* Badge */}
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[#d1a852] border border-[#d1a852]/30 text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full">
                    {video.tag}
                  </span>

                  {/* Duration tag */}
                  <span className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Clock size={10} /> {video.duration}
                  </span>
                </div>

                {/* Details area */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    <span>{video.subtitle}</span>
                  </div>
                  <h3 className="text-[20px] font-normal leading-snug font-serif text-white group-hover:text-[#d1a852] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-light">
                    {video.desc}
                  </p>
                </div>
              </div>

              {/* View stats bottom bar */}
              <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
                <span className="flex items-center gap-1.5 text-[#d1a852]">
                  <Award size={13} /> {video.metric}
                </span>
                <button 
                  onClick={() => setActiveVideoId(video.id)}
                  className="text-white hover:text-[#d1a852] transition-colors flex items-center gap-1 font-bold tracking-wider text-[10px] uppercase cursor-pointer"
                >
                  Play Film 🎥
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Video Player Modal */}
      <AnimatePresence>
        {activeVideoId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setActiveVideoId(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoId(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:rotate-90 hover:scale-105 z-[1010] cursor-pointer"
              title="Close Player"
            >
              <X size={24} />
            </button>

            {/* Video container */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-5xl aspect-[16/9] bg-black rounded-[24px] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title="Cinematic Wedding Teaser"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
