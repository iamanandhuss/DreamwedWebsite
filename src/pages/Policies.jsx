import React from 'react';
import SectionHeader from '../components/SectionHeader';

const Policies = () => {
  return (
    <div className="pt-24 bg-white">
      <section>
        <div className="container max-w-4xl">
          <SectionHeader subtitle="Legal" title="Policies & Terms" />
          
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-serif mb-6 text-[var(--color-text-main)]">Terms & Conditions</h3>
              <div className="prose prose-pink text-[var(--color-text-muted)] space-y-4">
                <p>Welcome to Dreamwed Stories. By accessing our website and services, you agree to be bound by the following terms and conditions.</p>
                <p><strong>Booking:</strong> A non-refundable retainer and a signed contract are required to secure your wedding date. Dates are held on a first-come, first-served basis.</p>
                <p><strong>Cancellations:</strong> In the event of a cancellation, the retainer is non-refundable. Cancellations must be made in writing at least 90 days prior to the wedding date.</p>
                <p><strong>Image Usage:</strong> Dreamwed Stories reserves the right to use images and videos captured during weddings for promotional purposes on our website and social media platforms, unless otherwise agreed upon in writing.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-serif mb-6 text-[var(--color-text-main)]">Privacy Policy</h3>
              <div className="prose prose-pink text-[var(--color-text-muted)] space-y-4">
                <p>Your privacy is of the utmost importance to us. This policy outlines how we collect, use, and protect your personal information.</p>
                <p><strong>Information Collection:</strong> We collect personal information such as names, email addresses, and wedding details through our contact form for the purpose of communicating about our services.</p>
                <p><strong>Data Security:</strong> We implement standard security measures to protect your information from unauthorized access or disclosure.</p>
                <p><strong>Third Parties:</strong> We do not sell, trade, or otherwise transfer your personal information to third parties without your explicit consent.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Policies;
