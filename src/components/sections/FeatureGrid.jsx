import React from "react";
import { motion } from "framer-motion";
import { Heart, Play, Camera, Star } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

const features = [
  {
    title: "Candid Excellence",
    desc: "Capturing those raw, unscripted moments that truly define your day.",
    icon: <Heart className="w-8 h-8" />
  },
  {
    title: "Cinematic Film",
    desc: "High-end wedding films that feel like a private screening of your love story.",
    icon: <Play className="w-8 h-8" />
  },
  {
    title: "Traditional Art",
    desc: "Respecting and beautifully documenting every ritual and tradition.",
    icon: <Camera className="w-8 h-8" />
  },
  {
    title: "Premium Quality",
    desc: "Using state-of-the-art equipment for crisp, timeless, high-resolution memories.",
    icon: <Star className="w-8 h-8" />
  }
];

const FeatureGrid = () => {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container">
        <SectionHeader 
          subtitle="Our Expertise" 
          title="Why Choose Our Wedding Photography?" 
          description="We don't just take photos; we preserve emotions. Our approach combines artistic vision with technical precision to tell your unique love story."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#f9f9f7] p-8 md:p-10 rounded-[30px] md:rounded-[40px] hover:bg-[#ececea] transition-all duration-700 group border border-transparent hover:border-zinc-200 shadow-sm"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-[20px] flex items-center justify-center mb-6 md:mb-8 shadow-sm group-hover:scale-110 transition-transform duration-700">
                <div className="text-black">{feature.icon}</div>
              </div>
              <h3 className="text-[22px] md:text-[24px] font-normal tracking-tight mb-4">{feature.title}</h3>
              <p className="text-[#66706a] leading-relaxed font-light text-[15px] md:text-[16px]">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
