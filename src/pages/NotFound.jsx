import React from 'react';
import { motion } from 'framer-motion';
import { HeartOff } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center p-8 bg-[#f5f5f3]">
      <div className="container max-w-lg text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ type: "spring", stiffness: 100 }}
           className="mb-10 flex justify-center"
        >
          <div className="relative">
            <HeartOff size={120} className="text-black opacity-10" />
            <span className="absolute inset-0 flex items-center justify-center text-6xl font-light">404</span>
          </div>
        </motion.div>
        
        <h1 className="text-[42px] md:text-[52px] leading-tight tracking-tight mb-6 font-normal">Oops, love got lost.</h1>
        <p className="text-[#66706a] text-lg mb-10 font-light">
          The page you are looking for seems to have wandered away. Let’s bring you back home.
        </p>
        
        <Button to="/" variant="primary">Return Home</Button>
      </div>
    </div>
  );
};

export default NotFound;
