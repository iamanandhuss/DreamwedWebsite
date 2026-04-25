import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, BookOpen, Clock, Users, Heart } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';

const Services = () => {
  const packages = [
    {
      title: "The Classic Story",
      price: "$2,500",
      icon: <Camera className="w-10 h-10" />,
      features: ["8 Hours Coverage", "2 Professional Photographers", "500+ Edited High-Res Photos", "Online Gallery Access", "Personalized Story Consultation"]
    },
    {
      title: "The Cinematic Heart",
      price: "$4,200",
      icon: <Video className="w-10 h-10" />,
      features: ["10 Hours Coverage", "Full Cinematic Film (8-10 mins)", "Social Media Highlight Reel", "Drone Videography (where legal)", "4K Digital Delivery"]
    },
    {
      title: "The Eternal Legacy",
      price: "$6,500",
      icon: <BookOpen className="w-10 h-10" />,
      features: ["Full Day Coverage (Unlimited)", "Photo & Video Fusion Team", "Handcrafted Heirloom Album", "Engagement Session Included", "Premium Digital Archive Box"]
    }
  ];

  return (
    <div className="pt-24 bg-[var(--color-bg-light)]">
      <section>
        <div className="container">
          <SectionHeader subtitle="Our Offerings" title="Curated Storytelling Packages" />
          
          <div className="grid lg:grid-cols-3 gap-10">
            {packages.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`bg-white p-12 rounded-[2.5rem] shadow-xl border-2 ${i === 1 ? 'border-[var(--color-primary)]' : 'border-transparent'}`}
              >
                <div className="text-[var(--color-primary)] mb-8 flex justify-center">{pkg.icon}</div>
                <h3 className="text-2xl font-serif text-center mb-4 text-[var(--color-text-main)]">{pkg.title}</h3>
                <p className="text-4xl font-serif text-center mb-10 text-[var(--color-primary)]">{pkg.price}</p>
                
                <ul className="space-y-5 mb-12">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex gap-4 items-start text-[var(--color-text-muted)]">
                      <Heart size={18} className="text-[var(--color-primary)] shrink-0 mt-1" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="text-center">
                  <Button variant={i === 1 ? 'primary' : 'secondary'} className="w-full">Book a Consultation</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif mb-8 text-[var(--color-text-main)]">Looking for Something Custom?</h2>
              <p className="text-[var(--color-text-muted)] text-lg mb-8">
                Every wedding is unique, and sometimes a standard package doesn't quite fit your vision. We offer customizable add-ons and bespoke collections for destination weddings, multi-day celebrations, and elopements.
              </p>
              <ul className="grid grid-cols-2 gap-6 mb-10">
                <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                  <Clock size={20} className="text-[var(--color-primary)]" /> Extra Hours
                </li>
                <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                  <Users size={20} className="text-[var(--color-primary)]" /> Additional Shooters
                </li>
                <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                  <BookOpen size={20} className="text-[var(--color-primary)]" /> Luxury Albums
                </li>
                <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                  <Camera size={20} className="text-[var(--color-primary)]" /> Film Photography
                </li>
              </ul>
              <Button variant="outline">Request Bespoke Quote</Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-100"
            >
              <img src="https://images.unsplash.com/photo-1510076857177-744361488957?auto=format&fit=crop&q=80&w=1000" alt="Process" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
