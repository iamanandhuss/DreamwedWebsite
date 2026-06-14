import React from 'react';
import PricingSection from '../components/pricing/PricingSection';
import InstagramFeed from '../components/sections/InstagramFeed';
import TestimonialSection from '../components/sections/TestimonialSection';
import CinemaSpotlight from '../components/sections/CinemaSpotlight';
import SEO from '../components/SEO';

const Packages = () => {
  return (
    <div className="bg-[#0a0a0c] text-white pt-24 min-h-screen">
      <SEO 
        title="Wedding Packages & Pricing"
        description="View our premium wedding photography and cinematic videography packages. Select from essential single-side coverage to all-inclusive cinematic cinema stories."
      />

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden text-center select-none">
        {/* Decorative gold background orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d1a852]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-4">
          <span className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#d1a852] text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-bold">
            Curated Collections
          </span>
          <h1 className="text-[40px] sm:text-[52px] md:text-[68px] leading-[1.05] tracking-tight font-serif font-light text-white">
            Your Legacy, Told in <br />
            <span className="italic text-[#d1a852] font-normal font-serif">Cinema & Fine Art</span>
          </h1>
          <p className="text-[15px] md:text-[18px] text-zinc-400 font-light max-w-xl mx-auto leading-relaxed pt-2">
            Watch our featured films and couple endorsements below, then select the perfect package for your milestone.
          </p>
        </div>
      </div>

      {/* Cinema Spotlight - VALUE FIRST (The 3 Videos) */}
      <CinemaSpotlight />

      {/* Testimonials Section - SOCIAL PROOF (The Reviews) */}
      <TestimonialSection dark={true} />

      {/* Pricing Section - THE INVESTMENT (Pricing cards, countdown, urgency widget) */}
      <div className="border-t border-white/5 bg-[#0a0a0c]">
        <PricingSection />
      </div>

      {/* Instagram Feed - RECENT STORIES */}
      <div className="border-t border-white/5 bg-[#0a0a0c] pt-10">
        <InstagramFeed dark={true} />
      </div>
    </div>
  );
};

export default Packages;
