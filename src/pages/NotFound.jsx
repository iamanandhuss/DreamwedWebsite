import React from 'react';
import { motion } from 'framer-motion';
import { HeartOff } from 'lucide-react';
import Button from '../components/Button';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center p-8 bg-[var(--color-bg-light)]">
      <div className="container max-w-lg text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ type: "spring", stiffness: 100 }}
           className="mb-10 flex justify-center"
        >
          <div className="relative">
            <HeartOff size={120} className="text-[var(--color-primary)] opacity-20" />
            <span className="absolute inset-0 flex items-center justify-center text-6xl font-serif">404</span>
          </div>
        </motion.div>
        
        <h1 className="text-4xl font-serif mb-6 text-[var(--color-text-main)]">Oops, love got lost.</h1>
        <p className="text-[var(--color-text-muted)] text-lg mb-10">
          The page you are looking for seems to have wandered away. Let’s bring you back home.
        </p>
        
        <NavLink to="/">
          <Button variant="primary">Return Home</Button>
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
