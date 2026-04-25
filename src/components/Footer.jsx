import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-bg-light)] pt-20 pb-10 border-t border-gray-100">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Heart className="text-[var(--color-primary)] fill-[var(--color-primary)]" />
              <span className="text-2xl font-bold font-serif text-[var(--color-text-main)]">
                Dreamwed <span className="text-[var(--color-primary)]">Stories</span>
              </span>
            </div>
            <p className="text-[var(--color-text-muted)] mb-6">
              Capturing the essence of your love story with elegance and emotion. Every wedding is a unique masterpiece.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 glass rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="p-2 glass rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="p-2 glass rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all">
                <Globe size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-serif mb-6 text-[var(--color-text-main)]">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {['Home', 'About', 'Services', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <NavLink to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-serif mb-6 text-[var(--color-text-main)]">Get in Touch</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-[var(--color-text-muted)]">
                <Phone size={18} className="text-[var(--color-primary)]" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-[var(--color-text-muted)]">
                <Mail size={18} className="text-[var(--color-primary)]" />
                <span>hello@dreamwedstories.com</span>
              </li>
              <li className="flex items-center gap-3 text-[var(--color-text-muted)]">
                <MapPin size={18} className="text-[var(--color-primary)]" />
                <span>123 Romance Ave, Love City</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-serif mb-6 text-[var(--color-text-main)]">Join Our Journey</h4>
            <p className="text-[var(--color-text-muted)] mb-4 italic text-sm">
              Subscribe for wedding tips and real stories.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-4 py-2 glass rounded-l-lg focus:outline-none text-sm"
              />
              <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-r-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-text-muted)]">
          <p>© 2026 Dreamwed Stories. All rights reserved.</p>
          <div className="flex gap-6">
            <NavLink to="/policies" className="hover:text-[var(--color-primary)]">Privacy Policy</NavLink>
            <NavLink to="/policies" className="hover:text-[var(--color-primary)]">Terms & Conditions</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
