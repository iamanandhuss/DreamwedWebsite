import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  to,
  ...props 
}) => {
  const baseStyles = "px-10 py-5 rounded-[20px] text-[17px] font-medium transition-all duration-500 transform active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer";
  
  const variants = {
    primary: "bg-[#1a1a1a] text-white hover:bg-black hover:shadow-2xl",
    secondary: "bg-white text-black hover:bg-zinc-100 hover:shadow-lg",
    outline: "bg-transparent border border-[#d8d8d8] text-black hover:border-black hover:bg-zinc-50",
    dark: "bg-zinc-800 text-white hover:bg-zinc-900 shadow-xl",
    ghost: "bg-transparent text-black hover:bg-zinc-100",
  };

  const Component = to ? Link : (props.href ? 'a' : motion.button);
  const componentProps = to ? { to, ...props } : (props.href ? { ...props } : { onClick, ...props });

  return (
    <Component
      {...(to || props.href ? {} : { whileHover: { y: -2 } })}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...componentProps}
    >
      {children}
    </Component>
  );
};

export default Button;
