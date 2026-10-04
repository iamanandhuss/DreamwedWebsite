import React from 'react';
import PricingSection from '../components/pricing/PricingSection';
import InstagramFeed from '../components/sections/InstagramFeed';
import TestimonialSection from '../components/sections/TestimonialSection';
import CinemaSpotlight from '../components/sections/CinemaSpotlight';
import AkashParvathiStory from '../components/sections/AkashParvathiStory';
import SEO from '../components/SEO';

const Packages = () => {
  return (
    <div className="bg-[#0a0a0c] text-white pt-24 min-h-screen">
      <SEO 
        title="Wedding Packages & Pricing"
        description="View our premium wedding photography and cinematic videography packages. Select from essential single-side coverage to all-inclusive cinematic cinema stories."
      />

      {/* Editorial Hero Section */}
      <section className="relative w-full min-h-[95vh] md:min-h-[85vh] flex flex-col justify-end md:justify-center overflow-hidden bg-[#0a0a0c] -mt-24 pt-20 pb-8 sm:pb-12 md:pb-16 select-none">
        {/* Full-bleed Natural Sunlight Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/stories/akash_parvathi/outdoor_laughter.jpg"
            onError={(e) => {
              e.currentTarget.src = "/images/stories/akash_parvathi/intimate_embrace.jpg";
            }}
            alt="Dreamwed Stories Wedding Photography"
            className="w-full h-[62%] md:h-full object-cover object-[center_12%] md:object-[72%_top] filter brightness-[1.08] contrast-[1.02]"
          />
          {/* Mobile: Gradient coming from bottom up over lower portion */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/90 via-45% to-transparent md:hidden pointer-events-none" />
          
          {/* Desktop: Gradient from left to right */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 via-38% to-transparent pointer-events-none" />
          {/* Desktop top/bottom blends */}
          <div className="hidden md:block absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
          <div className="hidden md:block absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none" />
        </div>

        {/* Content Block: Docked at bottom on mobile, side-aligned on desktop */}
        <div className="relative z-10 w-full max-w-xl md:max-w-2xl px-6 sm:px-10 md:px-12 pt-4 pb-2 md:py-6 space-y-3.5 sm:space-y-4 md:space-y-6 text-left">
          {/* Limited Offer Badge */}
          <div className="inline-block border border-white/40 bg-black/60 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-[2px] shadow-sm">
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-mono font-medium text-white/95">
              LIMITED TIME OFFER
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[30px] sm:text-[44px] md:text-[64px] font-serif font-light leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Your wedding deserves a story. <br />
            <span className="text-[#c89b53] font-normal italic font-serif">
              Starting at ₹44,999.
            </span>
          </h1>

          {/* Description Copy */}
          <p className="text-[12.5px] sm:text-[15px] md:text-[18px] text-zinc-300 font-light max-w-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Premium wedding photography & films for couples who want beautiful photographs, real emotions and memories that still feel alive years later.
          </p>

          {/* CTA Action Button */}
          <div className="pt-1">
            <a
              href="#packages"
              className="inline-block w-full sm:w-auto text-center bg-[#b48a52] hover:bg-[#9c743e] active:scale-98 text-white font-semibold text-xs sm:text-sm tracking-[0.14em] uppercase py-3.5 px-7 sm:py-4 sm:px-8 rounded shadow-2xl transition-all cursor-pointer"
            >
              SEE PACKAGES & WHAT'S INCLUDED
            </a>
          </div>

          {/* Trust Checkmarks */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-zinc-300 font-light pt-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
            <span className="flex items-center gap-1.5">
              <span className="text-white font-bold">✓</span> Transparent packages
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-white font-bold">✓</span> Customisable coverage
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-white font-bold">✓</span> Kerala + destination weddings
            </span>
          </div>
        </div>

        {/* Bottom subtle gold indicator on desktop */}
        <div className="relative z-10 px-12 hidden md:block">
          <div className="w-12 h-[1px] bg-[#c89b53]/40" />
        </div>
      </section>

      {/* Cinema Spotlight - VALUE FIRST (The 3 Videos) */}
      <CinemaSpotlight />

      {/* Testimonials Section - SOCIAL PROOF (The Reviews) */}
      <TestimonialSection dark={true} />

      {/* Real Engagement Story - SOCIAL PROOF & FINE-ART EXCELLENCE */}
      <AkashParvathiStory dark={true} />

      {/* Pricing Section - THE INVESTMENT (Pricing cards, countdown, urgency widget) */}
      <div id="packages" className="scroll-mt-24 border-t border-white/5 bg-[#0a0a0c]">
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
