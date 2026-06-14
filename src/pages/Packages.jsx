import React from 'react';
import PricingSection from '../components/pricing/PricingSection';
import InstagramFeed from '../components/sections/InstagramFeed';
import TestimonialSection from '../components/sections/TestimonialSection';
import SEO from '../components/SEO';

const Packages = () => {
  return (
    <div className="pt-24">
      <SEO 
        title="Wedding Packages & Pricing"
        description="View our premium wedding photography and cinematic videography packages. Select from essential single-side coverage to all-inclusive cinematic cinema stories."
      />
      <PricingSection />

      {/* Premium Gallery & Reels Section */}
      <div className="border-t border-zinc-200/50 bg-[#f5f5f3] pt-10">
        <InstagramFeed />
      </div>

      {/* Customer Reviews Section */}
      <TestimonialSection />
    </div>
  );
};

export default Packages;
