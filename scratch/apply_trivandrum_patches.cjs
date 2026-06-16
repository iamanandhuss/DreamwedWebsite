const fs = require('fs');

const filePath = 'src/pages/TrivandrumOffer.jsx';
let content = fs.readFileSync(filePath, 'utf8');

console.log('Starting patch execution for TrivandrumOffer.jsx...');

// ================= STEP 1: RESTORE AND SPLIT DATA ARRAYS =================
const startMarker = 'const packagesInfo = [';
const endMarker = '  ];\r\n\r\n  // Auto play';
const altEndMarker = '  ];\n\n  // Auto play';

let startIdx = content.indexOf(startMarker);
let endIdx = content.indexOf(endMarker);
let endOffset = 0; // we want to replace the whole packagesInfo declaration including the closing '  ];'
if (endIdx === -1) {
  endIdx = content.indexOf(altEndMarker);
}

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find packagesInfo start or end indexes! Check if file is already patched or format changed.');
  process.exit(1);
}

// Set endIdx to skip the '  ];' part of endMarker to avoid duplicating it
const newDefinitions = `const weddingPlans = [
    {
      id: 1,
      shareId: "pkgWeddingBasicCard",
      title: "Wedding Photography",
      subtitle: "Essential Single-Side",
      regularPrice: "60,000",
      offerPrice: "39,999",
      bonus: "LIMITED TIME OFFER",
      bonusDesc: "Save ₹20,001! Essential single-side coverage at an unbeatable price.",
      images: ["/uploaded_bride_yellow.jpg", "/athulraj.jpg", "/anandha_lekshmi.jpg"],
      details: [
        "Wedding Reception Photography",
        "Wedding Reception Videography",
        "Wedding Day Photography",
        "Wedding Day Videography",
        "One 70 Pages Premium Album",
        "Highlights Video",
        "Full HD Wedding Video",
        "Wedding Reel",
        "1 Photographer Setup",
        "1 Videographer Setup",
        "1 Calendar",
        "1 Pen Drive",
        "2 Wall Frames",
        "Edited Photos & High-speed Pendrive"
      ],
      description: "Our highly sought-after single-side coverage package. Designed to capture every detail of your celebrations with elite creative precision and beautiful physical heirlooms."
    },
    {
      id: 2,
      shareId: "pkgWeddingPreCard",
      title: "Wedding Photo & Pre-Wedding",
      subtitle: "Pre-Wedding & Photo",
      regularPrice: "75,000",
      offerPrice: "54,999",
      bonus: "LIMITED TIME OFFER",
      bonusDesc: "Save ₹20,001! Includes both Pre-wedding session and Wedding day coverage.",
      images: ["/couple_fun_glasses.jpg", pic1, pic2],
      details: [
        "Pre-Wedding Photo + Video (Save The Date)",
        "Wedding Reception Photography",
        "Wedding Reception Videography",
        "Wedding Day Photography",
        "Wedding Day Videography",
        "One 80 Pages Premium Album",
        "80 Pages Mini Album",
        "Highlights Video",
        "Full HD Wedding Video",
        "Wedding Reel",
        "1 Photographer Setup",
        "1 Videographer Setup",
        "1 Calendar",
        "1 Pen Drive",
        "2 Wall Frames",
        "Edited Photos & High-speed Pendrive"
      ],
      description: "Perfect for capturing your beautiful pre-wedding love story and the complete wedding day celebrations. Includes comprehensive coverage and professional deliverables."
    },
    {
      id: 3,
      shareId: "pkgCandidCard",
      title: "Candid Photo & Videography",
      subtitle: "Artistic Candid Shots",
      regularPrice: "75,000",
      offerPrice: "69,999",
      bonus: "LIMITED TIME OFFER",
      bonusDesc: "Save ₹5,001! Professional Candid coverage for artistic wedding stories.",
      images: ["/uploaded_bride_traditional.jpg", "/uploaded_bride_gold.jpg", pic3],
      details: [
        "Pre-Wedding Photo + Video (Save The Date)",
        "Wedding Reception Photography",
        "Wedding Reception Videography",
        "Wedding Day Photography",
        "Wedding Day Candid-Photography",
        "Wedding Day Videography",
        "One 80 Pages Premium Album",
        "80 Pages Mini Album",
        "Highlights Video",
        "Full HD Wedding Video",
        "Wedding Reel",
        "1 Photographer Setup",
        "1 Candid Photographer Setup",
        "1 Videographer Setup",
        "1 Calendar",
        "1 Pen Drive",
        "2 Wall Frames",
        "Edited Photos & High-speed Pendrive"
      ],
      description: "Our creative 3-camera setup featuring dedicated candid photography. Ideal for couples who want artistic, natural, and unstaged storytelling of their special day."
    },
    {
      id: 5,
      shareId: "pkgLuxuryCard",
      title: "Bride & Groom Luxury Package",
      subtitle: "4-Camera Dual-Side Luxury Coverage",
      regularPrice: "1,30,000",
      offerPrice: "1,10,000",
      bonus: "LIMITED TIME OFFER",
      bonusDesc: "Save ₹20,000! Ultimate luxury package with helicam, custom album boxes, and complete dual-side coverage.",
      images: ["/bride_christian_white.jpg", pic1, pic2],
      details: [
        "Pre-Wedding Photography & Videography (Save the Date)",
        "Wedding & Reception Photography (Dual-side)",
        "Wedding & Reception Videography (Dual-side)",
        "Wedding Candid Photography & Videography",
        "Helicam (Drone) Aerial Coverage",
        "One 80-Pages Premium Album with Handcrafted Album Box",
        "One 80-Pages Mini Album",
        "Cinematic Highlights Film & Instagram Reels",
        "Full HD Wedding Video Film",
        "2 Premium Wall Frames",
        "1 Customized Photo Calendar",
        "1 High-Speed USB Pen Drive",
        "Edited Photos & High-speed Pendrive"
      ],
      description: "Our ultimate dual-side wedding collection. Features comprehensive coverage, drone photography, and physical custom boxes for your handcrafted albums."
    }
  ];

  const weddingStandalonePlans = [
    {
      id: 10,
      shareId: "pkgWeddingStandaloneDay",
      title: "Standalone Wedding Day",
      subtitle: "8-Hour Wedding Day Only",
      regularPrice: "50,000",
      offerPrice: "39,999",
      bonus: "STANDALONE DAY ONLY",
      bonusDesc: "Professional photography & videography team for your wedding ceremony day coverage.",
      images: ["/uploaded_couple_blackwhite.jpg"],
      details: [
        "Professional Photo & Video Team",
        "Up to 8 Hours Event Coverage",
        "Premium 70-Page Layflat Album",
        "Full HD Video Film + Reels",
        "Edited Photos & High-speed Pendrive"
      ],
      description: "Dedicated professional photography & videography team for your wedding ceremony day coverage."
    },
    {
      id: 11,
      shareId: "pkgWeddingStandaloneReception",
      title: "Standalone Reception",
      subtitle: "5-Hour Reception Day Only",
      regularPrice: "40,000",
      offerPrice: "29,999",
      bonus: "RECEPTION ONLY",
      bonusDesc: "Sleek professional photo & video coverage optimized for your grand reception event.",
      images: ["/kochi_couple.jpg"],
      details: [
        "Professional Photo & Video Team",
        "Up to 5 Hours Reception Coverage",
        "Premium 50-Page Layflat Album",
        "Full HD Video Film + Highlights",
        "Edited Photos & High-speed Pendrive"
      ],
      description: "Sleek professional photo & video coverage optimized for your grand reception event."
    }
  ];

  const engagementPlans = [
    {
      id: 20,
      shareId: "pkgEngagementBasicCard",
      title: "Engagement Photography",
      subtitle: "Essential Single-Side",
      regularPrice: "20,000",
      offerPrice: "12,000",
      bonus: "Photo Only",
      bonusDesc: "Single-side photography coverage for your engagement ceremony.",
      images: ["/uploaded_bride_yellow.jpg"],
      details: [
        "Dedicated Candid & Traditional Photographer",
        "4 Hours Coverage",
        "Edited High-Res Photos"
      ],
      description: "Dedicated candid & traditional photographer coverage for your engagement ceremony."
    },
    {
      id: 21,
      shareId: "pkgEngagementPreCard",
      title: "Bride & Groom Engagement Package",
      subtitle: "Complete Single-Side Coverage",
      regularPrice: "45,000",
      offerPrice: "28,999",
      bonus: "Single-Side Photo + Video + Album",
      bonusDesc: "Our complete single-side engagement package including cinematic video, album, and reels.",
      images: ["/couple_fun_glasses.jpg"],
      details: [
        "1 Photographer + 1 Videographer",
        "4 Hours Full Event Coverage",
        "Edited High-Res Photos",
        "Premium Layflat Panoramic Album (50 Pages)",
        "Cinematic Engagement Reel",
        "Engagement Full HD Video",
        "1 Tabletop Calendar",
        "2 Premium Photo Frames",
        "1 USB Pen Drive"
      ],
      description: "Our complete single-side engagement package including cinematic video, premium layflat album, and creative reels."
    },
    {
      id: 4,
      shareId: "pkgPremiumCandidCard",
      title: "Premium Candid Package",
      subtitle: "4-Camera Dual-Side & Helicam",
      regularPrice: "1,15,000",
      offerPrice: "79,999",
      bonus: "Ultimate Engagement Coverage",
      bonusDesc: "Save ₹35,001! Full candid storytelling with advanced post-production.",
      images: ["/couple_traditional_red.jpg", pic1, pic2],
      isSpecial: true,
      details: [
        "Engagement Day Candid Photography",
        "Engagement Day Candid Videography",
        "Engagement Day Traditional Photography",
        "Engagement Day Traditional Videography",
        "Helicam (Drone) Aerial Coverage",
        "1 Premium 80-Page Album for Groom (with Complimentary Mini Album)",
        "1 Premium 80-Page Album for Bride (with Complimentary Mini Album)",
        "Highlights Video Film",
        "Full HD Engagement Video",
        "Engagement Reels",
        "1 Tabletop Calendar",
        "1 USB Pen Drive",
        "2 Premium Photo Frames",
        "Edited Photos & High-speed Pendrive"
      ],
      description: "Our comprehensive 4-camera premium package featuring dedicated candid & traditional teams. Includes dual custom 80-page albums for both bride & groom sides and complimentary mini albums."
    }
  ];

  const haldiPlans = [
    {
      id: 30,
      shareId: "pkgHaldiBasicCard",
      title: "Haldi Photography (Only)",
      subtitle: "Essential Haldi",
      regularPrice: "15,000",
      offerPrice: "10,000",
      bonus: "Photo Only",
      bonusDesc: "Dedicated single photographer capturing the vibrant colors of your Haldi ceremony.",
      images: [pic3],
      details: [
        "Dedicated Candid & Traditional Photographer",
        "4 Hours Coverage",
        "Edited High-Res Photos"
      ],
      description: "Dedicated single photographer capturing the vibrant colors and joy of your Haldi ceremony."
    },
    {
      id: 31,
      shareId: "pkgHaldiAlbumCard",
      title: "Haldi Photography with Album",
      subtitle: "Haldi with Heirloom",
      regularPrice: "22,000",
      offerPrice: "15,000",
      bonus: "Photo + Album",
      bonusDesc: "Premium Haldi photography including a beautifully printed layflat album.",
      images: ["/anandha_lekshmi.jpg"],
      details: [
        "Dedicated Candid & Traditional Photographer",
        "4 Hours Coverage",
        "Edited High-Res Photos",
        "Custom Layflat Panoramic Album (30 Pages)"
      ],
      description: "Premium Haldi photography including a beautifully printed customized layflat panoramic album."
    },
    {
      id: 32,
      shareId: "pkgHaldiPhotoVideoCard",
      title: "Haldi Photo & Videography",
      subtitle: "Haldi Photo + Video",
      regularPrice: "38,000",
      offerPrice: "28,000",
      bonus: "Complete Coverage",
      bonusDesc: "Full-spectrum cinematic and traditional coverage of your Haldi celebrations.",
      images: ["/kochi_couple.jpg"],
      details: [
        "1 Photographer + 1 Videographer",
        "4 Hours Full Haldi Coverage",
        "Edited High-Res Photos",
        "Cinematic Haldi Highlight Reel",
        "Full HD Event Video Film"
      ],
      description: "Full-spectrum cinematic and traditional coverage of your Haldi celebrations."
    }
  ];

  const addOnPlans = [
    {
      shareId: "addonLedWall",
      title: "LED Wall Setup",
      subtitle: "Receptions & Events",
      regularPrice: "22,000",
      offerPrice: "14,999",
      bonus: "Premium Live Feeds",
      desc: "Massive high-definition modular LED screen setup for receptions, displaying live feeds and cinematic videos.",
      details: "Single 8x10ft high-density LED screen with live mixer setup."
    },
    {
      shareId: "addonLiveStream",
      title: "Live Streaming Service",
      subtitle: "Global Broadcast",
      regularPrice: "18,000",
      offerPrice: "12,000",
      bonus: "HD Streaming",
      desc: "Multi-camera YouTube live streaming of your ceremony in full HD, allowing remote family to join.",
      details: "High-stability broadcast link with overlay graphics."
    },
    {
      shareId: "addonDrone",
      title: "Aerial Drone (Helicam) Coverage",
      subtitle: "Cinematic Drone",
      regularPrice: "12,000",
      offerPrice: "8,000",
      bonus: "4K Drone Views",
      desc: "Stunning 4K aerial drone coverage of your venue, entrance, and outdoor shoots.",
      details: "Licensed operator, full day event coverage."
    },
    {
      shareId: "addonPreWedding",
      title: "Cinematic Pre-Wedding Shoot",
      subtitle: "Save The Date",
      regularPrice: "15,000",
      offerPrice: "9,999",
      bonus: "Teaser Film Extra",
      desc: "A romantic cinematic pre-wedding photo and video session including edited teaser film.",
      details: "Full day shoot, cinematic output."
    }
  ];`;

// endIdx points to '  ];'. We skip the '  ];' by doing endIdx + 4 to ensure we don't duplicate it.
content = content.substring(0, startIdx) + newDefinitions + content.substring(endIdx + 4);
console.log('Step 1: Arrays updated successfully.');

// ================= STEP 2: UPDATE RENDER CARD AND SECTION LAYOUTS =================
const renderCardOldStart = '  const renderPackageCard = (pack, idx) => {\r\n    const isBestDeal = pack.id === 3;';
const renderCardOldStartLF = '  const renderPackageCard = (pack, idx) => {\n    const isBestDeal = pack.id === 3;';
const renderCardNew = `  const renderPackageCard = (pack, idx) => {
    const isBestDeal = pack.isSpecial || pack.id === 3;
    const badgeText = isBestDeal ? "BEST DEAL (RECOMMENDED)" : pack.bonus;
    const badgeStyles = isBestDeal 
      ? "bg-amber-500/20 text-amber-200 border border-amber-500/30" 
      : "bg-zinc-500/25 text-zinc-200 border border-zinc-500/35";

    // Inclusion tag
    const inclusionLabel = 
      pack.id === 1 ? "📷 1 Photographer Setup" 
      : pack.id === 4 ? "🚁 Drone Aerial Coverage"
      : "📷 4 Camera Setup";

    return (
      <motion.div
        key={pack.shareId || pack.id}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        onClick={() => { setActiveDetailPackage(pack); setCurrentSlide(0); }}
        className={\`relative rounded-[30px] md:rounded-[40px] overflow-hidden flex flex-col transition-all duration-700 ease-[0.22, 1, 0.36, 1] group cursor-pointer hover:scale-[1.02] shadow-xl hover:shadow-2xl aspect-[3/4.8] md:aspect-auto min-h-[540px] \${
          isBestDeal ? "border-2 border-amber-500/80 shadow-amber-500/5" : "border border-zinc-800/20"
        }\`}
      >
        {/* Background Cover Image with Zoom Effect */}
        <div className="absolute inset-0 z-0">
          <img
            src={pack.images[0]}
            alt={pack.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-[0.16, 1, 0.3, 1] group-hover:scale-105"
          />
          {/* Rich dark gradient for high typography contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10" />
        </div>

        {/* Click hint inside card in top-left */}
        <div className="absolute top-6 left-6 text-[8px] font-bold tracking-widest uppercase text-white/50 group-hover:text-white/95 transition-colors duration-300 z-20">
          ✨ CLICK FOR PHOTOS & DETAILS
        </div>

        {/* Floating Heart Icon Button in Top Right */}
        <button
          onClick={(e) => toggleLikePack(e, pack.shareId || pack.id)}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
          title="Add to wishlist"
        >
          <Heart
            size={18}
            className={\`transition-colors duration-300 \${likedPacks[pack.shareId || pack.id] ? "fill-red-500 stroke-red-500" : "stroke-white"}\`}
          />
        </button>

        {/* Card Content Overlaid on Bottom */}
        <div className="relative z-10 flex flex-col h-full justify-between p-6 sm:p-8 flex-1">
          {/* Top Tag */}
          <div>
            <span className={\`inline-block px-3 py-1.5 rounded-full text-[8px] tracking-widest uppercase font-bold mt-4 \${badgeStyles}\`}>
              ✦ {badgeText}
            </span>
          </div>

          {/* Bottom Info Details and CTA */}
          <div className="mt-auto">
            <h3 className="text-xl sm:text-2xl leading-[1.1] tracking-tight font-serif text-white font-normal mb-1">
              {pack.title}
            </h3>
            <p className="text-[#b4975a] text-[9px] font-bold tracking-wider uppercase mb-2">
              {pack.subtitle}
            </p>
            
            <p className="text-zinc-300 text-xs font-light mb-4 line-clamp-2 leading-relaxed">
              {pack.description}
            </p>

            {/* Info labels row matching the travel card style */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-white/90 text-xs font-light">
              <div className="flex items-center gap-1.2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/5">
                <Tag size={12} className="text-amber-400" />
                <span>from <strong className="font-semibold text-white">₹{pack.offerPrice}</strong></span>
              </div>
              <div className="flex items-center gap-1.2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/5">
                <span>{inclusionLabel}</span>
              </div>
            </div>

            {/* CTA Button centered at bottom - stacked on two lines as requested */}
            <Button
              variant="secondary"
              className="w-full py-4 rounded-[24px] bg-white text-black hover:bg-zinc-100 hover:shadow-lg transition-all duration-300 text-[11px] font-bold tracking-wider flex flex-col items-center justify-center leading-snug"
              onClick={(e) => {
                e.stopPropagation();
                triggerBookingModal(pack.title, parseInt(pack.offerPrice.replace(/[^0-9]/g, "")));
              }}
            >
              <span className="block">SECURE</span>
              <span className="block">OFFER</span>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const dummyPlaceHolder = () => {`;

content = content.replace(renderCardOldStart, renderCardNew);
content = content.replace(renderCardOldStartLF, renderCardNew);

// Replace the package sections (Wedding grid all the way to Haldi section end)
const sectionStartMarker = '          {/* Pricing Grid Split in 2 Rows */}';
const sectionEndMarker = '      {/* 4. PREMIUM HANDCRAFTED ALBUMS SHOWCASE */}';

const sectionStartIdx = content.indexOf(sectionStartMarker);
const sectionEndIdx = content.indexOf(sectionEndMarker);

if (sectionStartIdx === -1 || sectionEndIdx === -1) {
  console.error('Could not find package grid sections start or end index in TrivandrumOffer.jsx!');
  process.exit(1);
}

const newSectionsContent = `          {/* Sticky Sub-navigation Bar (Light Theme) */}
          <div className="sticky top-[72px] md:top-[88px] z-30 py-4 bg-[#fbfbfa]/90 backdrop-blur-md border-b border-zinc-200 mb-16 select-none flex justify-center">
            <div className="flex gap-2 p-1 bg-white border border-zinc-200 rounded-full max-w-lg shadow-md">
              {["Wedding", "Engagement", "Haldi", "Add-ons"].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    const id = \`sec-\${sec.toLowerCase().replace(" ", "-")}\`;
                    const target = document.getElementById(id);
                    if (target) {
                      const yOffset = -150;
                      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-all hover:bg-zinc-100 active:scale-95 cursor-pointer"
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          <div id="pricing-grid-container" className="space-y-32">
            {/* SECTION 1: WEDDING PACKAGES */}
            <div id="sec-wedding" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.2em] uppercase">Collections 01</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Wedding <span className="italic font-serif text-[#b4975a]">Collections</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
                {weddingPlans.map((pack, idx) => renderPackageCard(pack, idx))}
              </div>

              {/* Standalone Wedding Row */}
              <div className="space-y-8 pt-12 border-t border-zinc-200">
                <div className="text-center space-y-2">
                  <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">Standalone Wedding Coverages</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
                  {weddingStandalonePlans.map((pack, idx) => renderPackageCard(pack, idx))}
                </div>
              </div>
            </div>

            {/* SECTION 2: ENGAGEMENT PACKAGES */}
            <div id="sec-engagement" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.2em] uppercase">Collections 02</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Engagement <span className="italic font-serif text-[#b4975a]">Collections</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                {engagementPlans.map((pack, idx) => renderPackageCard(pack, idx))}
              </div>
            </div>

            {/* SECTION 3: HALDI PACKAGES */}
            <div id="sec-haldi" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.2em] uppercase">Collections 03</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Haldi <span className="italic font-serif text-[#b4975a]">Collections</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                {haldiPlans.map((pack, idx) => renderPackageCard(pack, idx))}
              </div>
            </div>

            {/* SECTION 4: ADD-ONS */}
            <div id="sec-add-ons" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.2em] uppercase">Customizations</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Premium <span className="italic font-serif text-[#b4975a]">Add-ons</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
                {addOnPlans.map((addon) => (
                  <div key={addon.shareId} className="bg-white p-6 sm:p-8 rounded-[32px] border border-zinc-200/60 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:border-[#1e3f20]/25 group">
                    <div className="space-y-4">
                      <span className="inline-flex bg-[#1e3f20]/5 text-[#1e3f20] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">Add-on Option</span>
                      <h4 className="text-[20px] font-normal leading-tight text-zinc-900">{addon.title}</h4>
                      <p className="text-[28px] font-normal text-[#9b1c1c] numbers-pro">{addon.offerPrice}</p>
                      <p className="text-zinc-500 text-xs font-light leading-relaxed">{addon.desc}</p>
                      <div className="text-[10px] text-zinc-400 font-medium border-t border-zinc-100 pt-3">
                        {addon.details}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, message: \`Hi! I am interested in adding the \${addon.title} (\${addon.offerPrice}) to my package.\` }); scrollToForm(); }}
                      className="w-full py-3 mt-8 bg-gradient-to-r from-zinc-50 to-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-[10px] tracking-widest uppercase font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] select-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Add to Booking
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

`;

content = content.substring(0, sectionStartIdx) + newSectionsContent + content.substring(sectionEndIdx);
console.log('Step 2: UI sections and card helper updated successfully.');


// ================= STEP 3: UPDATE DETAILED MODAL =================
// Locate modal start after the recent UI updates
const modalSearchStart = '{activeDetailPackage !== null && (() => {';
const modalStartIdx = content.indexOf(modalSearchStart);

if (modalStartIdx === -1) {
  console.error('Could not find modal start after UI replacements!');
  process.exit(1);
}

// Find closing AnimatePresence block at the end of the file
const closingAnimatePresence = '      </AnimatePresence>\r\n\r\n    </div>\r\n  );\r\n};\r\n\r\nexport default TrivandrumOffer;';
const closingAnimatePresenceLF = '      </AnimatePresence>\n\n    </div>\n  );\n};\n\nexport default TrivandrumOffer;';

let modalEndIdx = content.indexOf(closingAnimatePresence);
if (modalEndIdx === -1) {
  modalEndIdx = content.indexOf(closingAnimatePresenceLF);
}

if (modalEndIdx === -1) {
  console.error('Could not find closing AnimatePresence block for modal!');
  process.exit(1);
}

const newModalCode = `{activeDetailPackage !== null && (() => {
          const pack = activeDetailPackage;
          const imagesLength = pack.images && pack.images.length ? pack.images.length : 1;
          const hasPrewed = /Pre-Wedding|Candid|Luxury/i.test(pack.title);

          // Dynamic calculation of final price inside the AnimatePresence closure
          const basePriceNum = parseInt(pack.offerPrice.replace(/[^0-9]/g, ""));
          const addonPrice = 
            (selectedAddons.ledScreen === "single" ? 14999 : selectedAddons.ledScreen === "double" ? 24999 : 0) +
            ((selectedAddons.prewedVideo && !hasPrewed) ? 9999 : 0);
          const finalCalculatedPrice = basePriceNum + addonPrice;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              onClick={() => setActiveDetailPackage(null)}
            >
              <motion.div
                initial={{ scale: 0.93, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.93, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative w-full max-w-4xl rounded-[40px] bg-white border border-zinc-100 overflow-y-auto md:overflow-hidden max-h-[90vh] md:max-h-[650px] shadow-[0_30px_80px_rgba(0,0,0,0.4)] grid grid-cols-1 md:grid-cols-2 text-zinc-800"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Extremely Prominent Close Button */}
                <button
                  onClick={() => setActiveDetailPackage(null)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-black/75 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white shadow-2xl transition-all hover:rotate-90 hover:scale-105 duration-300 z-50 cursor-pointer"
                  title="Close popup"
                >
                  <X size={22} strokeWidth={2.5} />
                </button>

                {/* Left Side: Auto-playing Wedding Photo Gallery with Dynamic Blurred Backdrop */}
                <div className="relative aspect-[4/5] md:aspect-auto w-full h-full bg-zinc-950 overflow-hidden min-h-[300px] md:min-h-[550px] flex items-center justify-center group select-none">
                  
                  {/* Dynamic Auto-rotating slideshow wrapper */}
                  <div className="absolute inset-0 w-full h-full">
                    {/* Zoomed Blurred Background Layer */}
                    <motion.img
                      key={\`bg-\${pack.images[currentSlide % imagesLength]}\`}
                      src={pack.images[currentSlide % imagesLength]}
                      alt=""
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-25 select-none pointer-events-none"
                    />
                    {/* Semi-transparent dark overlay to ensure dynamic color contrast and block leaks */}
                    <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

                    {/* Crisp Foreground Layer */}
                    <motion.img
                      key={\`fg-\${pack.images[currentSlide % imagesLength]}\`}
                      src={pack.images[currentSlide % imagesLength]}
                      alt="Dreamwed Stories Actual Wedding Capture"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full h-full object-cover z-10" style={{ objectPosition: "center 30%" }}
                    />
                    {/* Subtle vignette shade overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none z-20" />
                  </div>

                  {/* Floating branding watermark */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-1 text-white z-10 pointer-events-none">
                    <span className="text-[#b4975a] text-[9px] font-bold tracking-[0.25em] uppercase block">Dreamwed Stories</span>
                    <h4 className="text-lg font-light tracking-tight text-white font-serif italic">
                      Actual Wedding Work Captures
                    </h4>
                    <p className="text-white/60 text-[9px] font-light">
                      Every pixel captured with high-fidelity professional optics.
                    </p>
                  </div>

                  {/* Slide indicator dots */}
                  <div className="absolute top-6 left-6 flex gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/5 z-10 pointer-events-none">
                    {pack.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={\`w-1 h-1 rounded-full transition-all duration-300 \${
                          (currentSlide % imagesLength) === i ? "bg-[#b4975a] scale-125" : "bg-white/40"
                        }\`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Side: Package Inclusions and Booking Option (Redesigned with Fixed Headers/CTA & Unified Scroll Stream) */}
                <div className="p-6 sm:p-10 flex flex-col justify-between gap-5 md:max-h-[650px] md:overflow-hidden overflow-visible h-auto">
                  
                  {/* Header detail */}
                  <div className="space-y-2 select-none">
                    <span className="inline-flex items-center gap-1 bg-[#1e3f20]/10 text-[#1e3f20] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                      {pack.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl text-zinc-900 font-semibold tracking-tight leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {pack.title.toLowerCase().includes("package") ? pack.title : \`\${pack.title} Package\`}
                    </h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-[#9b1c1c]">Rs. {pack.offerPrice}/-</span>
                      <span className="text-zinc-400 text-xs line-through">Regular: {pack.regularPrice}/-</span>
                    </div>

                    {/* Symbolic Animated Scroll Arrow for Mobile */}
                    <div className="md:hidden flex justify-center pt-2 select-none pointer-events-none">
                      <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="text-[#b4975a] flex flex-col items-center gap-1"
                      >
                        <span className="text-[9px] font-semibold tracking-[0.25em] uppercase opacity-75">Scroll</span>
                        <svg className="w-5 h-5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Main Scroll Stream (Checklist + Integrated Add-ons) */}
                  <div className="flex-1 md:overflow-y-auto pr-2 space-y-6 md:scrollbar-thin relative min-h-0 overflow-visible h-auto">
                    
                    {/* Short intro bio */}
                    <p className="text-zinc-500 font-light text-xs leading-relaxed select-none">
                      {pack.description}
                    </p>

                    {/* Bonus highlight box */}
                    {hasPrewed && (
                      <div className="bg-[#d1a852]/5 border border-[#d1a852]/15 p-4 rounded-2xl flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#d1a852]/15 flex items-center justify-center text-[#b8903b] shrink-0">
                          <Gift size={16} />
                        </div>
                        <div>
                          <span className="block text-[#b8903b] text-xs font-bold uppercase tracking-wide">
                            Free Pre-Wedding Shoot
                          </span>
                          <span className="text-zinc-600 text-[10px] font-medium leading-snug block mt-0.5">
                            Free Pre-Wedding (Save the date photography) is included with this package.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* What's Included list */}
                    <div className="space-y-4 pt-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 select-none">
                        <span>🎁 What's Included ({pack.details ? pack.details.length : 0} Inclusions):</span>
                      </div>
                      <ul className="grid grid-cols-1 gap-2.5">
                        {pack.details && pack.details.map((item, index) => (
                          <li key={index} className="flex gap-2.5 items-start text-xs text-zinc-600 hover:text-zinc-900 transition-colors">
                            <CheckCircle size={15} className="text-[#1e3f20] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-full h-px bg-zinc-100" />

                    {/* INTEGRATED ADD-ONS SECTION (Scroll completely down to reveal) */}
                    <div className="space-y-4 pt-1">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 bg-[#1e3f20]/10 text-[#1e3f20] px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase select-none">
                          Step 2
                        </span>
                        <h4 className="text-sm font-bold text-zinc-900 select-none">
                          ✨ Customize with Premium Extras (Optional):
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {/* ITEM 2: PRE-WEDDING CINEMATIC VIDEO */}
                        {hasPrewed ? (
                          <div className="p-3.5 rounded-2xl border bg-[#1e3f20]/5 border-[#1e3f20]/20">
                            <div className="flex justify-between items-center mb-2 select-none">
                              <span className="font-bold text-xs text-[#1e3f20]">Pre-Wedding Cinematic Video</span>
                              <span className="text-[9px] font-extrabold bg-[#1e3f20] text-white px-2 py-0.5 rounded uppercase">Included Free</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-light leading-relaxed block select-none">
                              Save ₹35,000! Pre-wedding cinematic video film is fully included free in this cinematic package!
                            </span>
                          </div>
                        ) : (
                          <div className={\`p-3.5 rounded-2xl border transition-all duration-300 \${selectedAddons.prewedVideo ? 'bg-[#1e3f20]/5 border-[#1e3f20]/30 shadow-sm' : 'bg-zinc-50/50 border-zinc-200'}\`}>
                            <div className="flex justify-between items-center mb-2 select-none">
                              <span className="font-bold text-xs text-zinc-900">Pre-Wedding Cinematic Video</span>
                              <span className="text-[9px] font-semibold text-zinc-500">Romantic Film Extra</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-light leading-relaxed block mb-3 select-none">
                              High-end cinematic video shoot before the wedding, creating a beautiful romantic story film.
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { value: false, label: "No Video", price: "—" },
                                { value: true, label: "Add Video Film", price: "₹9,999" }
                              ].map((opt) => (
                                <button
                                  key={opt.label}
                                  type="button"
                                  onClick={() => setSelectedAddons({ ...selectedAddons, prewedVideo: opt.value })}
                                  className={\`py-2 px-1 rounded-xl text-center flex flex-col gap-0.5 border cursor-pointer transition-all duration-300 select-none \${
                                    selectedAddons.prewedVideo === opt.value
                                      ? "bg-[#1e3f20] border-[#1e3f20] text-white shadow-sm scale-[1.02]"
                                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                                  }\`}
                                >
                                  <span className="text-[10px] font-bold">{opt.label}</span>
                                  <span className={\`text-[9px] font-extrabold \${selectedAddons.prewedVideo === opt.value ? "text-amber-300" : "text-[#9b1c1c]"}\`}>
                                    {opt.price}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ITEM 3: LED SCREEN SETUP */}
                        <div className={\`p-3.5 rounded-2xl border transition-all duration-300 \${selectedAddons.ledScreen !== "none" ? 'bg-[#1e3f20]/5 border-[#1e3f20]/30 shadow-sm' : 'bg-zinc-50/50 border-zinc-200'}\`}>
                          <div className="flex justify-between items-center mb-2 select-none">
                            <span className="font-bold text-xs text-zinc-900">Premium LED Screen Setup</span>
                            <span className="text-[9px] font-semibold text-zinc-500">Live Broadcast Extra</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-light leading-relaxed block mb-3 select-none">
                            High-definition modular live video streaming screen for receptions.
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: "none", label: "No Screen", price: "—" },
                              { value: "single", label: "Single (8x10ft)", price: "₹14,999" },
                              { value: "double", label: "Double Side", price: "₹24,999" }
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setSelectedAddons({ ...selectedAddons, ledScreen: opt.value })}
                                className={\`py-2 px-1 rounded-xl text-center flex flex-col gap-0.5 border cursor-pointer transition-all duration-300 select-none \${
                                  selectedAddons.ledScreen === opt.value
                                    ? "bg-[#1e3f20] border-[#1e3f20] text-white shadow-sm scale-[1.02]"
                                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                                }\`}
                              >
                                <span className="text-[10px] font-bold">{opt.label}</span>
                                <span className={\`text-[9px] font-extrabold \${selectedAddons.ledScreen === opt.value ? "text-amber-300" : "text-[#9b1c1c]"}\`}>
                                  {opt.price}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Direct Book Now Button below the LED selector */}
                          <div className="mt-4 pt-1 select-none">
                            <button
                              type="button"
                              onClick={() => {
                                let extras = [];

                                if (selectedAddons.prewedVideo && !hasPrewed) extras.push("Pre-Wedding Cinematic Video (₹9,999)");
                                if (selectedAddons.ledScreen === "single") extras.push("Single 8x10ft LED Screen (₹14,999)");
                                if (selectedAddons.ledScreen === "double") extras.push("Double Side Dual-LED Display (₹24,999)");

                                let messageStr = \`Hi! I would like to book the special package slot: [\${pack.title} - Rs. \${pack.offerPrice}/-]\`;
                                if (extras.length > 0) {
                                  messageStr += \` customized with these Add-ons: [\${extras.join(", ")}]. Total Calculated Investment: Rs. \${finalCalculatedPrice.toLocaleString("en-IN")}/-.\`;
                                } else {
                                  messageStr += ".";
                                }
                                messageStr += " Please contact me to secure this offer!";

                                setFormData({
                                  ...formData,
                                  message: messageStr
                                });
                                setActiveDetailPackage(null);
                                setTimeout(() => {
                                  scrollToForm();
                                }, 200);
                              }}
                              className="w-full py-3 bg-[#9b1c1c] hover:bg-[#801414] text-white font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs tracking-widest uppercase shadow-sm cursor-pointer text-center flex items-center justify-center gap-2"
                            >
                              <span>Book Package Now</span>
                              <span>🌟</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="h-6" />
                  </div>

                  {/* Absolute subtle bottom fade for active scroll stream */}
                  <div className="w-full h-px bg-zinc-100 select-none" />

                  {/* Anchored CTA Button at the bottom (Static & Dynamically updating price) */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        let extras = [];

                        if (selectedAddons.prewedVideo && !hasPrewed) extras.push("Pre-Wedding Cinematic Video (₹9,999)");
                        if (selectedAddons.ledScreen === "single") extras.push("Single 8x10ft LED Screen (₹14,999)");
                        if (selectedAddons.ledScreen === "double") extras.push("Double Side Dual-LED Display (₹24,999)");

                        let messageStr = \`Hi! I would like to book the special package slot: [\${pack.title} - Rs. \${pack.offerPrice}/-]\`;
                        if (extras.length > 0) {
                          messageStr += \` customized with these Add-ons: [\${extras.join(", ")}]. Total Calculated Investment: Rs. \${finalCalculatedPrice.toLocaleString("en-IN")}/-.\`;
                        } else {
                          messageStr += ".";
                        }
                        messageStr += " Please contact me to secure this offer!";

                        setFormData({
                          ...formData,
                          message: messageStr
                        });
                        setActiveDetailPackage(null);
                        setTimeout(() => {
                          scrollToForm();
                        }, 200);
                      }}
                      className="w-full py-4.5 bg-[#9b1c1c] hover:bg-[#801414] text-white font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs tracking-widest uppercase shadow-md cursor-pointer text-center select-none"
                    >
                      Secure Slot (Total: Rs. \${finalCalculatedPrice.toLocaleString("en-IN")}/-) 🌟
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}\n`;

content = content.substring(0, modalStartIdx) + newModalCode + content.substring(modalEndIdx);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Step 3: Modal sections updated successfully.');
console.log('All patches executed successfully for TrivandrumOffer.jsx!');
