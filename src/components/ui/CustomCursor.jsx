import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [cursorType, setCursorType] = useState("default");
  const [isVisible, setIsVisible] = useState(false);

  // Position of mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring configuration for lagging luxury effect
  const springConfig = { damping: 35, stiffness: 350, mass: 0.5 };
  const cursorXSpring = useSpring(mouseX, springConfig);
  const cursorYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      // Offset by half of outer circle dimensions (32px / 2 = 16px)
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const addHoverListeners = () => {
      const hoverElements = document.querySelectorAll(
        "a, button, [role='button'], .cursor-pointer, input, textarea, iframe"
      );
      
      hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorType("hover"));
        el.addEventListener("mouseleave", () => setCursorType("default"));
      });
    };

    addHoverListeners();

    // Listen for dynamic DOM adjustments to keep cursor bounds accurate
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Lagging outer spring ring */}
      <motion.div
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        animate={{
          scale: cursorType === "hover" ? 1.7 : 1,
          borderColor: cursorType === "hover" ? "#b4975a" : "rgba(180, 151, 90, 0.4)",
          backgroundColor: cursorType === "hover" ? "rgba(180, 151, 90, 0.12)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="fixed w-8 h-8 rounded-full border-2 pointer-events-none z-[9999] hidden md:block"
      />
      {/* Tight inner tracking dot */}
      <motion.div
        style={{
          left: mouseX,
          top: mouseY,
        }}
        animate={{
          scale: cursorType === "hover" ? 0 : 1,
          x: 12,
          y: 12,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 20 }}
        className="fixed w-2 h-2 rounded-full bg-[#b4975a] pointer-events-none z-[9999] hidden md:block"
      />
    </>
  );
};

export default CustomCursor;
