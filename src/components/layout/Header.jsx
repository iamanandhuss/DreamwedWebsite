import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import uImage from "../../assets/images/uIcon.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);

  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // background effect
      setScrolled(currentScrollY > 50);

      // hide navbar when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        // show navbar when scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        w-full
        z-50
        transition-all
        duration-500
        ${
          showNavbar
            ? "translate-y-0"
            : "-translate-y-full"
        }
        ${
          scrolled
            ? "glass py-4 shadow-sm backdrop-blur-xl"
            : "bg-transparent py-6"
        }
      `}
    >
      <div className="container flex justify-between items-center px-6 md:px-10">
        
        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src={uImage}
            alt="Logo"
            className="w-12 h-12 object-contain"
          />

          <h1 className="text-xl font-light tracking-tight text-gray-800">
            Dreamwed Stories
          </h1>
        </NavLink>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `
                text-sm
                font-medium
                uppercase
                tracking-[2px]
                transition-all
                duration-300
                hover:-translate-y-1
                ${
                  isActive
                    ? "text-black"
                    : "text-gray-700"
                }
              `
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="
              absolute
              top-full
              left-0
              w-full
              glass
              backdrop-blur-xl
              p-8
              flex
              flex-col
              gap-6
              md:hidden
              items-center
              shadow-lg
            "
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="
                  text-lg
                  tracking-wide
                  text-black
                  hover:opacity-70
                  transition-all
                "
              >
                {link.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;