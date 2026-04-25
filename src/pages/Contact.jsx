import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Send, Heart } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', date: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-24 bg-white">
      <section>
        <div className="container">
          <SectionHeader subtitle="Get in Touch" title="Let’s Start Crafting Your Story" />
          
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-serif mb-8 text-[var(--color-text-main)]">Contact Details</h3>
              <p className="text-[var(--color-text-muted)] text-lg mb-10">
                We'd love to hear more about your vision. Drop us a message, and we'll get back to you within 24 hours.
              </p>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[var(--color-bg-light)] rounded-2xl text-[var(--color-primary)]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-[var(--color-text-main)] mb-1">Email Us</h4>
                    <p className="text-[var(--color-text-muted)]">hello@dreamwedstories.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[var(--color-bg-light)] rounded-2xl text-[var(--color-primary)]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-[var(--color-text-main)] mb-1">Call Us</h4>
                    <p className="text-[var(--color-text-muted)]">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[var(--color-bg-light)] rounded-2xl text-[var(--color-primary)]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-[var(--color-text-main)] mb-1">Studio Location</h4>
                    <p className="text-[var(--color-text-muted)]">123 Romance Ave, Love City</p>
                  </div>
                </div>
              </div>
              
              <div className="p-10 glass rounded-[2.5rem] border border-[var(--color-primary)]/10">
                <h4 className="font-serif text-2xl mb-6 flex items-center gap-3">
                  Follow the Journey <Heart className="text-[var(--color-primary)] fill-[var(--color-primary)]" size={20} />
                </h4>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Globe size={18} /> Instagram
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Globe size={18} /> Facebook
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--color-bg-light)] p-12 rounded-[3rem] shadow-sm relative overflow-hidden"
            >
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-[var(--color-bg-light)] z-10"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <Send size={32} />
                  </div>
                  <h3 className="text-3xl font-serif mb-4">Message Sent!</h3>
                  <p className="text-[var(--color-text-muted)]">Thank you for reaching out. We'll be in touch very soon to chat about your story.</p>
                </motion.div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-2">Your Name</label>
                  <input 
                    htmlFor="name"
                    required
                    className="w-full px-6 py-4 rounded-2xl glass border border-transparent focus:border-[var(--color-primary)] outline-none transition-all"
                    placeholder="E.g. Sarah & Leo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-2">Email Address</label>
                  <input 
                    htmlFor="email"
                    type="email"
                    required
                    className="w-full px-6 py-4 rounded-2xl glass border border-transparent focus:border-[var(--color-primary)] outline-none transition-all"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-2">Wedding Date (Approx)</label>
                  <input 
                    htmlFor="date"
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl glass border border-transparent focus:border-[var(--color-primary)] outline-none transition-all"
                    placeholder="Spring 2027"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-2">Tell Us Your Vision</label>
                  <textarea 
                    htmlFor="message"
                    rows="5"
                    required
                    className="w-full px-6 py-4 rounded-2xl glass border border-transparent focus:border-[var(--color-primary)] outline-none transition-all resize-none"
                    placeholder="Share a little bit about your wedding style and what's important to you..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                
                <Button variant="primary" className="w-full flex items-center justify-center gap-3">
                  Send Message <Send size={18} />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Embed Simulation */}
      <section className="p-0 h-[400px] bg-gray-100 grayscale hover:grayscale-0 transition-all duration-700">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976373946229!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2s!4v1650000000000!5m2!1sen!2s" 
          width="100%" 
          height="100%" 
          style={{ border:0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
