import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiInstagram, FiHeart, FiMessageCircle, FiSend, FiBookmark, FiRefreshCw, FiExternalLink, FiPlay, FiX } from "react-icons/fi";

import pic1 from "../../assets/images/pic1.jpeg";
import pic2 from "../../assets/images/pic2.jpeg";
import pic3 from "../../assets/images/pic3.jpeg";
import pic4 from "../../assets/images/pic4.jpeg";

// Live-simulated Instagram posts from dreamwed_stories.co
const ALL_POSTS = [
  {
    id: "DDaS9ZmzV7B",
    image: "/athulraj.jpg",
    location: "Trivandrum, Kerala",
    likes: 4821,
    comments: 142,
    caption: "A timeless laugh shared amidst whispered promises. 🕊️ Capturing Dr. Athulraj & Aswathy's beautiful wedding day at Trivandrum.",
    shortcode: "DDaS9ZmzV7B",
  },
  {
    id: "C_h29g-pqCj",
    image: "/chindu.jpg",
    location: "Kochi, Kerala",
    likes: 3954,
    comments: 89,
    caption: "Unveiling moments of pure joy. Chindu & Athira's gorgeous celebration of love and traditional elegance. ✨",
    shortcode: "C_h29g-pqCj",
  },
  {
    id: "DDaTabyzzIl",
    image: "/anandha_lekshmi.jpg",
    location: "Kottayam, Kerala",
    likes: 5102,
    comments: 167,
    caption: "A pristine moment of traditional grace and quiet elegance. Anandha Lekshmi looking absolutely breathtaking on her big day. 🌸",
    shortcode: "DDaTabyzzIl",
  },
  {
    id: "C17kPchBivV",
    image: "/deepak.jpg",
    location: "Kollam, Kerala",
    likes: 2710,
    comments: 65,
    caption: "Candid portraits that tell a beautiful story. Deepak & Anjali's wedding highlights captured in Kollam. ❤️",
    shortcode: "C17kPchBivV",
  },
  {
    id: "pic1-post",
    image: pic1,
    location: "Thrissur, Kerala",
    likes: 6241,
    comments: 204,
    caption: "Dancing through life, hand in hand. The vibrant emerald and gold themes of Kerala's finest traditional celebrations. 🌿",
    shortcode: "C_h29g-pqCj",
  },
  {
    id: "pic2-post",
    image: pic2,
    location: "Alappuzha, Kerala",
    likes: 5892,
    comments: 180,
    caption: "Golden hour romance by the backwaters. Capturing beautiful rays of light as they promise forever. 🌅",
    shortcode: "DDaS9ZmzV7B",
  },
  {
    id: "pic3-post",
    image: pic3,
    location: "Calicut, Kerala",
    likes: 4115,
    comments: 98,
    caption: "Every detail crafted with absolute passion. Traditional attire that radiates timeless elegance and grace. 👑",
    shortcode: "DDaTabyzzIl",
  },
  {
    id: "pic4-post",
    image: pic4,
    location: "Varkala, Kerala",
    likes: 6304,
    comments: 215,
    caption: "A cinematic frame from an unforgettable story. Capturing love in its purest, most raw and candid form on the cliffs. 🎬",
    shortcode: "C17kPchBivV",
  },
];

// Cinematic Reels dataset with vertical aspect ratios
const ALL_REELS = [
  {
    id: "reel-1",
    image: "/chindu.jpg",
    location: "Kochi, Kerala",
    likes: 12450,
    comments: 242,
    caption: "A cinematic teaser of Chindu & Athira's spectacular entrance under a canopy of sparklers! ✨ Pure gold.",
    videoId: "jnSAu-C6OmQ",
    shortcode: "C_h29g-pqCj",
  },
  {
    id: "reel-2",
    image: "/athulraj.jpg",
    location: "Trivandrum, Kerala",
    likes: 14820,
    comments: 188,
    caption: "The beautiful silent tears of a mother watching her daughter walk down the aisle. Moments like these are forever. ❤️",
    videoId: "c310o24XVN0",
    shortcode: "DDaS9ZmzV7B",
  },
  {
    id: "reel-3",
    image: "/anandha_lekshmi.jpg",
    location: "Kottayam, Kerala",
    likes: 9850,
    comments: 142,
    caption: "Traditional elegance meets timeless grandeur. Anandha Lekshmi in her stunning crimson Kasavu saree. 👑",
    videoId: "S9-SrdnKsMs",
    shortcode: "DDaTabyzzIl",
  },
  {
    id: "reel-4",
    image: "/deepak.jpg",
    location: "Kollam, Kerala",
    likes: 11200,
    comments: 165,
    caption: "High energy, rich laughter, and the most infectious dance moves from Deepak & Anjali's sangeet night! 💃",
    videoId: "O4zR8hS1tA0",
    shortcode: "C17kPchBivV",
  },
  {
    id: "reel-5",
    image: pic1,
    location: "Thrissur, Kerala",
    likes: 15340,
    comments: 310,
    caption: "The mesmerizing beats of Kerala's traditional wedding orchestra. An experience that stays in your soul. 🥁",
    videoId: "eC-z1oW-bUo",
    shortcode: "C_h29g-pqCj",
  },
  {
    id: "reel-6",
    image: pic4,
    location: "Varkala, Kerala",
    likes: 13980,
    comments: 215,
    caption: "Sunsets, sea breeze, and endless romance. Capturing beautiful vows on the majestic cliffs of Varkala. 🌅",
    videoId: "8r9NEx29o4w",
    shortcode: "C17kPchBivV",
  },
];

const POSTS_PER_PAGE = 4;

const InstagramCard = ({ post, index, dark = false }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showHeartPop, setShowHeartPop] = useState(false);
  
  let lastTap = 0;
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (!liked) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
    lastTap = now;
  };

  const handleLikeClick = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
  };

  const postUrl = `https://www.instagram.com/p/${post.shortcode}/`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % POSTS_PER_PAGE) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[24px] border overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] transition-all duration-500 group ${dark ? "bg-[#121215] border-white/5 shadow-2xl hover:border-[#d1a852]/20" : "bg-white border-[#ececea]"}`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* HEADER */}
      <div className={`flex items-center justify-between p-4 border-b ${dark ? "border-white/5" : "border-[#f5f5f3]"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
            <div className={`w-full h-full rounded-full p-[2px] ${dark ? "bg-[#121215]" : "bg-white"}`}>
              <img
                src="/favicon.png"
                alt="dreamwed_stories.co avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[14px] font-semibold leading-none ${dark ? "text-white" : "text-black"}`}>
                dreamwed_stories.co
              </span>
              <svg className="w-4 h-4 text-[#0095f6]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className={`text-[12px] leading-none block mt-0.5 ${dark ? "text-zinc-500" : "text-[#8e8e8e]"}`}>
              {post.location}
            </span>
          </div>
        </div>
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={dark ? "text-zinc-500 hover:text-white transition-colors" : "text-zinc-400 hover:text-black transition-colors"}
        >
          <FiExternalLink size={16} />
        </a>
      </div>

      {/* IMAGE CONTAINER WITH INTERACTIVE HOVER */}
      <div 
        onClick={handleDoubleTap}
        className={`relative aspect-square w-full overflow-hidden cursor-pointer select-none ${dark ? "bg-[#0a0a0c]" : "bg-[#fbfbfa]"}`}
      >
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Dynamic Double-Tap Heart Overlay */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0.9, 1], opacity: [0, 0.9, 0.9, 0] }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <FiHeart size={80} fill="white" stroke="white" className="drop-shadow-lg text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* View on Instagram Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md text-black text-[14px] font-medium shadow-lg hover:scale-105 hover:bg-white transition-all duration-300"
          >
            <FiInstagram size={16} className="text-[#bc1888]" />
            View Post
          </a>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeClick}
              className="transition-transform active:scale-75 duration-200 cursor-pointer"
            >
              <FiHeart
                size={24}
                className={`transition-colors ${
                  liked ? "text-[#ed4956] fill-[#ed4956]" : (dark ? "text-white hover:text-zinc-400" : "text-black hover:text-[#8e8e8e]")
                }`}
              />
            </button>
            <a href={postUrl} target="_blank" rel="noopener noreferrer">
              <FiMessageCircle size={24} className={dark ? "text-white hover:text-zinc-400 transition-colors" : "text-black hover:text-[#8e8e8e] transition-colors"} />
            </a>
            <a href={postUrl} target="_blank" rel="noopener noreferrer">
              <FiSend size={24} className={dark ? "text-white hover:text-zinc-400 transition-colors" : "text-black hover:text-[#8e8e8e] transition-colors"} />
            </a>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className="transition-transform active:scale-75 duration-200 cursor-pointer"
          >
            <FiBookmark
              size={24}
              className={`transition-colors ${
                saved ? (dark ? "text-white fill-white" : "text-black fill-black") : (dark ? "text-white hover:text-zinc-400" : "text-black hover:text-[#8e8e8e]")
              }`}
            />
          </button>
        </div>

        {/* LIKES */}
        <div className={`text-[14px] font-semibold leading-none ${dark ? "text-white" : "text-black"}`}>
          {likesCount.toLocaleString()} likes
        </div>

        {/* CAPTION */}
        <div className={`text-[14px] leading-relaxed font-light mt-1 ${dark ? "text-zinc-400" : "text-zinc-800"}`}>
          <span className={`font-semibold mr-2 ${dark ? "text-white" : "text-black"}`}>dreamwed_stories.co</span>
          {post.caption}
          <div className="mt-1.5 text-[13px] text-[#00376b] font-normal hover:underline cursor-pointer">
            #weddingphotography #keralawedding #dreamwedstories #candid
          </div>
        </div>

        {/* VIEW COMMENTS LINK */}
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[13px] hover:underline mt-0.5 block ${dark ? "text-zinc-500" : "text-[#8e8e8e]"}`}
        >
          View all {post.comments} comments
        </a>
      </div>
    </motion.div>
  );
};

const InstagramReelCard = ({ reel, index, dark = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes);
  const [showHeartPop, setShowHeartPop] = useState(false);

  let lastTap = 0;
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (!liked) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
    lastTap = now;
  };

  const handleLikeClick = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
  };

  const reelUrl = `https://www.instagram.com/reel/${reel.shortcode}/`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % POSTS_PER_PAGE) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[24px] border overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] transition-all duration-500 group ${dark ? "bg-[#121215] border-white/5 shadow-2xl hover:border-[#d1a852]/20" : "bg-white border-[#ececea]"}`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* HEADER */}
      <div className={`flex items-center justify-between p-4 border-b ${dark ? "border-white/5" : "border-[#f5f5f3]"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
            <div className={`w-full h-full rounded-full p-[2px] ${dark ? "bg-[#121215]" : "bg-white"}`}>
              <img
                src="/favicon.png"
                alt="dreamwed_stories.co avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[14px] font-semibold leading-none ${dark ? "text-white" : "text-black"}`}>
                dreamwed_stories.co
              </span>
              <svg className="w-4 h-4 text-[#0095f6]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className={`text-[12px] leading-none block mt-0.5 ${dark ? "text-zinc-500" : "text-[#8e8e8e]"}`}>
              {reel.location}
            </span>
          </div>
        </div>
        <a
          href={reelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={dark ? "text-zinc-500 hover:text-white transition-colors" : "text-zinc-400 hover:text-black transition-colors"}
        >
          <FiExternalLink size={16} />
        </a>
      </div>

      {/* PORTRAIT VIDEO/COVER CONTAINER */}
      <div
        onClick={handleDoubleTap}
        className="relative aspect-[9/16] w-full overflow-hidden bg-black cursor-pointer select-none"
      >
        {isPlaying ? (
          <div className="absolute inset-0 w-full h-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${reel.videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&loop=1&playlist=${reel.videoId}`}
              title={reel.caption}
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full pointer-events-auto"
            ></iframe>
            {/* Close/Pause overlay button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(false);
              }}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:scale-110 active:scale-90 transition-transform"
            >
              <FiX size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full h-full relative" onClick={() => setIsPlaying(true)}>
            <img
              src={reel.image}
              alt={reel.caption}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Dark gradient shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25"></div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30"
              >
                <FiPlay fill="black" size={24} className="text-black ml-1" />
              </motion.div>
            </div>

            {/* Reels Tag in Bottom-Left */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[12px] font-medium">
              <svg className="w-3.5 h-3.5 fill-white text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Reel
            </div>
          </div>
        )}

        {/* Heart Animation Overlay */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0.9, 1], opacity: [0, 0.9, 0.9, 0] }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <FiHeart size={80} fill="white" stroke="white" className="drop-shadow-lg text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTION BAR */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeClick}
              className="transition-transform active:scale-75 duration-200 cursor-pointer"
            >
              <FiHeart
                size={24}
                className={`transition-colors ${
                  liked ? "text-[#ed4956] fill-[#ed4956]" : (dark ? "text-white hover:text-zinc-400" : "text-black hover:text-[#8e8e8e]")
                }`}
              />
            </button>
            <a href={reelUrl} target="_blank" rel="noopener noreferrer">
              <FiMessageCircle size={24} className={dark ? "text-white hover:text-zinc-400 transition-colors" : "text-black hover:text-[#8e8e8e] transition-colors"} />
            </a>
            <a href={reelUrl} target="_blank" rel="noopener noreferrer">
              <FiSend size={24} className={dark ? "text-white hover:text-zinc-400 transition-colors" : "text-black hover:text-[#8e8e8e] transition-colors"} />
            </a>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className="transition-transform active:scale-75 duration-200 cursor-pointer"
          >
            <FiBookmark
              size={24}
              className={`transition-colors ${
                saved ? (dark ? "text-white fill-white" : "text-black fill-black") : (dark ? "text-white hover:text-zinc-400" : "text-black hover:text-[#8e8e8e]")
              }`}
            />
          </button>
        </div>

        {/* VIEWS / LIKES */}
        <div className={`text-[14px] font-semibold leading-none ${dark ? "text-white" : "text-black"}`}>
          {likesCount.toLocaleString()} views
        </div>

        {/* CAPTION */}
        <div className={`text-[14px] leading-relaxed font-light mt-1 ${dark ? "text-zinc-400" : "text-zinc-800"}`}>
          <span className={`font-semibold mr-2 ${dark ? "text-white" : "text-black"}`}>dreamwed_stories.co</span>
          {reel.caption}
          <div className="mt-1.5 text-[13px] text-[#00376b] font-normal hover:underline cursor-pointer">
            #weddingreels #cinematicwedding #weddinghighlights #dreamwedstories
          </div>
        </div>

        {/* VIEW COMMENTS LINK */}
        <a
          href={reelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[13px] hover:underline mt-0.5 block ${dark ? "text-zinc-500" : "text-[#8e8e8e]"}`}
        >
          View all {reel.comments} comments
        </a>
      </div>
    </motion.div>
  );
};

const InstagramFeed = ({ dark = false }) => {
  const [activeTab, setActiveTab] = useState("photos");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const currentFeed = activeTab === "photos" ? ALL_POSTS : ALL_REELS;
  const visiblePosts = currentFeed.slice(0, visibleCount);
  const hasMore = visibleCount < currentFeed.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, currentFeed.length));
      setIsLoading(false);
    }, 600);
  };

  return (
    <section className={`w-full py-28 px-6 ${dark ? "bg-[#0a0a0c]" : "bg-[#fbfbfa]"}`}>
      <div className="max-w-7xl mx-auto">
        {/* TOP TAG */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <a
            href="https://www.instagram.com/dreamwed_stories.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-7 py-3 rounded-full text-white text-[15px] tracking-wide transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              boxShadow: "0 4px 20px rgba(188,24,136,0.3)",
            }}
          >
            <FiInstagram size={18} />
            @dreamwed_stories.co
          </a>
        </motion.div>

        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mt-10"
        >
          <h2
            className={`text-[56px] md:text-[76px] leading-[0.95] tracking-[-4px] font-normal font-serif ${dark ? "text-white" : "text-black"}`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            From our feed
          </h2>
          <p
            className={`mt-8 text-[20px] leading-relaxed max-w-2xl mx-auto ${dark ? "text-zinc-400" : "text-[#6b736c]"}`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Real moments, real couples. Follow us on Instagram for daily inspiration
            from weddings across Kerala.
          </p>
        </motion.div>

        {/* PREMIUM TAB TOGGLE */}
        <div className="flex justify-center mt-14">
          <div className={`p-1 rounded-full flex items-center gap-1 border shadow-inner ${dark ? "bg-white/5 border-white/10" : "bg-zinc-100/90 border-zinc-200/50"}`}>
            {["photos", "reels"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setVisibleCount(POSTS_PER_PAGE); // Reset count on tab switch
                }}
                className="px-8 py-3 rounded-full text-[14px] font-medium transition-all duration-300 relative cursor-pointer outline-none select-none"
              >
                {tab === "photos" ? (
                  <span className={`flex items-center gap-2 relative z-10 transition-colors duration-300 ${activeTab === tab ? (dark ? "text-black font-semibold" : "text-black font-semibold") : (dark ? "text-zinc-400" : "text-zinc-500")}`}>
                    <FiInstagram size={14} className={activeTab === tab ? "text-[#bc1888]" : ""} />
                    Photos
                  </span>
                ) : (
                  <span className={`flex items-center gap-2 relative z-10 transition-colors duration-300 ${activeTab === tab ? "text-black font-semibold" : "text-zinc-500"}`}>
                    <svg
                      className={`w-3.5 h-3.5 transition-colors duration-300 ${activeTab === tab ? "text-[#dc2743]" : "text-zinc-500"}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="23 7 16 12 23 17 23 7" fill="currentColor" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    Cinematic Reels
                  </span>
                )}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className={`absolute inset-0 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border ${dark ? "border-white/20" : "border-zinc-200/50"}`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* INSTAGRAM GRID */}
        <div className={`grid grid-cols-1 ${activeTab === "reels" ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"} gap-8 mt-16 max-w-5xl mx-auto`}>
          <AnimatePresence mode="popLayout">
            {visiblePosts.map((post, i) => (
              activeTab === "photos" ? (
                <InstagramCard key={post.id} post={post} index={i} dark={dark} />
              ) : (
                <InstagramReelCard key={post.id} reel={post} index={i} dark={dark} />
              )
            ))}
          </AnimatePresence>
        </div>

        {/* LOAD MORE + FOLLOW BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
        >
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`flex items-center gap-3 px-10 py-4 rounded-full border-2 text-[16px] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${dark ? "border-white/20 text-white bg-transparent hover:bg-white hover:text-black hover:border-white" : "border-black text-black bg-white hover:bg-black hover:text-white"}`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {isLoading ? (
                <>
                  <FiRefreshCw size={18} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FiRefreshCw size={18} />
                  Load More {activeTab === "photos" ? "Posts" : "Reels"}
                </>
              )}
            </button>
          )}

          <a
            href="https://www.instagram.com/dreamwed_stories.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-10 py-4 rounded-full text-white text-[16px] font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              boxShadow: "0 4px 20px rgba(188,24,136,0.25)",
            }}
          >
            <FiInstagram size={18} />
            Follow on Instagram
            <FiExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
