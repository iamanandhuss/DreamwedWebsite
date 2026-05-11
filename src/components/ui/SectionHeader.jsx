import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ subtitle, title, description, center = true, dark = false }) => {
  return (
    <div className={`mb-20 ${center ? 'text-center' : 'text-left'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {subtitle && (
          <span className={`inline-block px-5 py-2 rounded-full text-[13px] tracking-[0.2em] uppercase font-semibold mb-6 ${
            dark ? 'bg-zinc-800 text-zinc-400' : 'bg-[#ececea] text-[#5d665f]'
          }`}>
            {subtitle}
          </span>
        )}
        
        <h2 className={`text-[42px] md:text-[64px] leading-[1.1] tracking-[-0.04em] font-normal mb-8 ${
          dark ? 'text-white' : 'text-black'
        }`}>
          {title}
        </h2>

        {description && (
          <p className={`text-[18px] md:text-[20px] leading-relaxed max-w-2xl ${
            center ? 'mx-auto' : ''
          } ${
            dark ? 'text-zinc-400' : 'text-[#6f766f]'
          }`}>
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default SectionHeader;
