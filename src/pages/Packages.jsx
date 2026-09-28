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
      <section className="relative w-full min-h-[92vh] md:min-h-[88vh] flex flex-col justify-center overflow-hidden bg-stone-950 -mt-24 pt-24 pb-12 sm:pb-16 select-none">
        {/* Full-bleed Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/stories/akash_parvathi/outdoor_laughter.jpg"
            onError={(e) => {
              e.currentTarget.src = "/images/stories/akash_parvathi/intimate_embrace.jpg";
            }}
            alt="Dreamwed Stories Wedding Photography"
            className="w-full h-full object-cover object-[15%_18%] sm:object-[28%_20%] md:object-[68%_center] filter brightness-[0.88] contrast-[1.03]"
          />
          {/* Multi-layer luxury dark gradients matching user screenshot */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent via-55% sm:via-50%" />
        </div>

        {/* Center-Left Editorial Offer Content */}
        <div className="relative z-10 max-w-[320px] sm:max-w-xl md:max-w-2xl px-5 sm:px-10 md:px-12 my-auto pt-6 pb-6 space-y-4 sm:space-y-6 text-left">
          {/* Limited Offer Badge */}
          <div className="inline-block border border-white/40 bg-black/40 backdrop-blur-xs px-3.5 py-1 sm:py-1.5 rounded-[2px]">
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-mono font-medium text-white/95">
              LIMITED TIME OFFER
            </span>
          </div>

          {/* Luxury Large Headline */}
          <h1 className="text-[34px] sm:text-[50px] md:text-[64px] font-serif font-light leading-[1.08] tracking-tight text-white">
            Your <br />
            wedding <br />
            deserves a <br />
            story. <br />
            <span className="text-[#c89b53] font-normal italic font-serif">
              Starting at ₹39,999.
            </span>
          </h1>

          {/* Description Copy */}
          <p className="text-[13px] sm:text-[15px] md:text-[18px] text-zinc-300 font-light max-w-[270px] sm:max-w-md leading-relaxed">
            Premium wedding photography & films for couples who want beautiful photographs, real emotions and memories that still feel alive years later.
          </p>

          {/* CTA Action Button */}
          <div className="pt-1 sm:pt-2">
            <a
              href="#packages"
              className="inline-block w-auto text-center bg-[#b48a52] hover:bg-[#9c743e] active:scale-98 text-white font-semibold text-[11px] sm:text-xs md:text-sm tracking-[0.12em] uppercase py-3.5 px-6 sm:py-4 sm:px-8 rounded shadow-2xl transition-all cursor-pointer"
            >
              SEE PACKAGES & WHAT'S INCLUDED
            </a>
          </div>

          {/* Trust Checkmarks */}
          <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs text-zinc-300 font-light pt-1">
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5">
                <span className="text-white font-bold">✓</span> Transparent packages
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-white font-bold">✓</span> Customisable coverage
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <span className="text-white font-bold">✓</span> Kerala + destination weddings
            </span>
          </div>
        </div>

        {/* Bottom subtle indicator */}
        <div className="relative z-10 px-5 sm:px-12 hidden sm:block">
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
