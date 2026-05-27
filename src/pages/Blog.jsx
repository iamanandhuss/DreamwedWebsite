import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

// Import high-res portfolio images to eliminate stock/placeholders
import pic1 from '../assets/images/pic1.jpeg';
import pic2 from '../assets/images/pic2.jpeg';
import pic3 from '../assets/images/pic3.jpeg';
import pic4 from '../assets/images/pic4.jpeg';

const Blog = () => {
  const posts = [
    {
      title: "Top 10 Wedding Trends for 2026",
      category: "Planning Tips",
      date: "May 15, 2026",
      image: pic1,
      excerpt: "From minimalist ceremonies to high-tech guest experiences, discover what's shaping the future of weddings."
    },
    {
      title: "Sarah & Leo's Coastal Romance",
      category: "Real Couple Stories",
      date: "June 2, 2026",
      image: pic2,
      excerpt: "A look inside their intimate beach wedding that focused on sunset vows and candlelight dinner."
    },
    {
      title: "How to Choose Your Perfect Venue",
      category: "Planning Tips",
      date: "April 20, 2026",
      image: pic3,
      excerpt: "Your venue sets the stage for your entire story. Here are the key factors to consider before booking."
    },
    {
      title: "The Magic of Golden Hour Photos",
      category: "Photography Tips",
      date: "March 10, 2026",
      image: pic4,
      excerpt: "Why the hour before sunset is the most critical time for capturing dreamy, romantic wedding portraits."
    }
  ];


  return (
    <div className="pt-24 bg-[var(--color-bg-light)]">
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
