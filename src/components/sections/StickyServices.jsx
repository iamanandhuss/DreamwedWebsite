import React from "react";
import { motion } from "framer-motion";
import { ScrollPic } from "../scrollPic";

// Assets
import scroll1 from "../../assets/images/scroll1.png";
import scroll2 from "../../assets/images/scroll2.png";
import scroll3 from "../../assets/images/scroll3.png";

const servicesData = [
  {
    image: scroll1,
    title: "Cinematic Wedding Films",
    subtitle: "High-end storytelling that captures every emotional nuance of your big day."
  },
  {
    image: scroll2,
    title: "Candid Photography",
    subtitle: "Unscripted, raw moments preserved forever with artistic precision."
  },
  {
    image: scroll3,
    title: "Traditional Portraits",
    subtitle: "Respecting ritual and heritage through timeless, elegant portraiture."
  }
];

const StickyServices = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-white relative">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start relative">
        
        {/* LEFT STICKY CONTENT */}
        <div className="lg:sticky lg:top-[15%] flex flex-col justify-center h-auto lg:h-[70vh] mb-12 lg:mb-0">
          <div className="mb-6 md:mb-8">
            <span className="px-4 py-2 rounded-full bg-[#f5f5f3] text-[#8a9289] text-[11px] md:text-[13px] font-bold tracking-[0.2em] uppercase">
              Our Expertise
            </span>
          </div>
          <h2 className="text-[36px] sm:text-[48px] md:text-[68px] leading-[1.1] md:leading-[1] tracking-[-0.04em] text-black font-normal mb-6 md:mb-8 text-balance">
            Book Wedding <br className="hidden md:block" /> Photography in <br className="hidden md:block" /> Trivandrum for <br className="hidden md:block" /> Your Big Day
          </h2>
          <p className="text-[17px] md:text-[20px] leading-relaxed text-[#66706a] max-w-lg font-light">
            Our expert team offers professional wedding photography in Trivandrum, capturing every emotion from pre-wedding shoots to cinematic wedding films.
          </p>
          <div className="mt-8 md:mt-12 w-20 md:w-24 h-[1px] bg-zinc-200" />
        </div>

        {/* RIGHT SCROLLING IMAGES */}
        <div className="flex flex-col space-y-16 md:space-y-32 pb-10 md:pb-20">
          {servicesData.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            >
              <ScrollPic 
                allServices={servicesData}
                currentIndex={i}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StickyServices;
