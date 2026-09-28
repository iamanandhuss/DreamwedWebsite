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

      {/* Hero Section matching User's Editorial Reference */}
      <section className="relative w-full min-h-[92vh] md:min-h-[88vh] flex flex-col justify-between overflow-hidden bg-stone-950 -mt-24 pt-28 pb-12 sm:pb-16 select-none">
        {/* Full-bleed Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/stories/akash_parvathi/outdoor_laughter.jpg"
            onError={(e) => {
              e.currentTarget.src = "/images/stories/akash_parvathi/intimate_embrace.jpg";
            }}
            alt="Dreamwed Stories Wedding Photography"
            className="w-full h-full object-cover object-[78%_25%] sm:object-[72%_center] md:object-[68%_center] filter brightness-[0.78] contrast-[1.05]"
          />
          {/* Multi-layer luxury dark gradients matching user screenshot */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/50 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
        </div>

        {/* Top Brand Name */}
        <div className="relative z-10 px-6 sm:px-12 pt-4">
          <span className="font-serif font-bold tracking-[0.28em] text-white/90 text-sm sm:text-lg uppercase">
            DREAMWED STORIES
          </span>
        </div>

        {/* Center-Left Editorial Offer Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 my-auto py-8 space-y-6 text-left">
          {/* Limited Offer Badge */}
          <div className="inline-block border border-white/40 bg-black/30 backdrop-blur-xs px-4 py-1.5 rounded-[2px]">
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-mono font-medium text-white/90">
              LIMITED TIME OFFER
            </span>
          </div>

          {/* Luxury Large Headline */}
          <h1 className="text-[42px] sm:text-[56px] md:text-[68px] font-serif font-light leading-[1.05] tracking-tight text-white">
            Your <br />
            wedding <br />
            deserves a <br />
            story. <br />
            <span className="text-[#c89b53] font-normal italic font-serif">
              Starting at ₹39,999.
            </span>
          </h1>

          {/* Description Copy */}
          <p className="text-[14px] sm:text-[16px] md:text-[18px] text-zinc-200/90 font-light max-w-md leading-relaxed">
            Premium wedding photography & films for couples who want beautiful photographs, real emotions and memories that still feel alive years later.
          </p>

          {/* CTA Action Button */}
          <div className="pt-2">
            <a
              href="#packages"
              className="inline-block w-full sm:w-auto text-center bg-[#b48a52] hover:bg-[#9c743e] active:scale-98 text-white font-semibold text-xs sm:text-sm tracking-[0.12em] uppercase py-4 px-8 rounded shadow-2xl transition-all cursor-pointer"
            >
              SEE PACKAGES & WHAT'S INCLUDED
            </a>
          </div>

          {/* Trust Checkmarks */}
          <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-[11px] sm:text-xs text-zinc-300 font-light pt-1">
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

        {/* Bottom subtle indicator */}
        <div className="relative z-10 px-6 sm:px-12 hidden sm:block">
          <div className="w-12 h-[1px] bg-[#c89b53]/40" />
        </div>
      </section>

      {/* Cinema Spotlight - VALUE FIRST (The 3 Videos) */}
      <CinemaSpotlight />

      {/* Pricing Section - THE INVESTMENT (Pricing cards, countdown, urgency widget) */}
      <div id="packages" className="scroll-mt-24 border-t border-white/5 bg-[#0a0a0c]">
        <PricingSection />
      </div>

      {/* Testimonials Section - SOCIAL PROOF (The Reviews) */}
      <TestimonialSection dark={true} />

      {/* Real Engagement Story - SOCIAL PROOF & FINE-ART EXCELLENCE */}
      <AkashParvathiStory dark={true} />

      {/* Instagram Feed - RECENT STORIES */}
      <div className="border-t border-white/5 bg-[#0a0a0c] pt-10">
        <InstagramFeed dark={true} />
      </div>
    </div>
  );
};

export default Packages;
