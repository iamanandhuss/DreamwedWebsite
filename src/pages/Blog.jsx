import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

// Import high-res portfolio images to eliminate stock/placeholders
import pic1 from '../assets/images/pic1.jpeg';
import pic2 from '../assets/images/pic2.jpeg';
import pic3 from '../assets/images/pic3.jpeg';
import pic4 from '../assets/images/pic4.jpeg';

const Blog = () => {
  const posts = [
    {
      title: "Top 7 Pre-Wedding Shoot Locations in Trivandrum (2026 Guide)",
      category: "Location Guides",
      date: "September 2026",
      image: pic1,
      excerpt: "Discover the most romantic backdrops in Trivandrum for pre-wedding photography, from Kovalam Lighthouse and Varkala Cliff to Ponmudi Hills."
    },
    {
      title: "Traditional Kerala Wedding Photography: Rituals & Candid Moments",
      category: "Wedding Traditions",
      date: "August 2026",
      image: pic2,
      excerpt: "Capturing the sacred beauty of Kerala Hindu, Christian, and Muslim wedding ceremonies in Trivandrum with timeless candid elegance."
    },
    {
      title: "How to Choose the Best Wedding Photographer in Trivandrum",
      category: "Planning Tips",
      date: "August 2026",
      image: pic3,
      excerpt: "Everything you need to know about wedding photography packages, candid styles, drone coverage, and pricing in Trivandrum."
    },
    {
      title: "Grand Wedding Venues in Trivandrum & Photography Ideas",
      category: "Venue Inspiration",
      date: "July 2026",
      image: pic4,
      excerpt: "A photographer’s perspective on top wedding convention centers in Trivandrum including Al Saj, Girideepam, and beach resorts in Kovalam."
    }
  ];

  return (
    <div className="pt-24 bg-[var(--color-bg-light)]">
      <SEO 
        title="Wedding Journal & Trivandrum Photography Guides" 
        description="Expert wedding planning tips, top pre-wedding shoot locations in Trivandrum, and real love stories by Dreamwed Stories."
        keywords="wedding photography Trivandrum blog, pre-wedding shoot locations Trivandrum, best wedding photographers in Trivandrum, Kovalam wedding shoot"
      />
      <section>
        <div className="container">
          <SectionHeader subtitle="The Journal" title="Stories, Tips & Inspiration" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12">
            {posts.map((post, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group flex flex-col md:flex-row glass rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
              >
                <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="md:w-3/5 p-10 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">{post.category}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div>
                    <Button variant="outline" className="!px-6 !py-2 !text-xs uppercase tracking-widest">Read Story</Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Button variant="secondary">Load More Stories</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
