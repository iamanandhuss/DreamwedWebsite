const fs = require('fs');

const filePath = 'src/pages/TrivandrumOffer.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find the start of DETAILED PACKAGE DETAILS & WEDDING GALLERY MODAL AnimatePresence block
const searchStart = '{activeDetailPackage !== null && (() => {';
const searchEnd = '      {/* DETAILED PACKAGE DETAILS & WEDDING GALLERY MODAL */}';

const startIdx = content.indexOf(searchStart);
if (startIdx === -1) {
  console.error('Could not find modal start marker!');
  process.exit(1);
}

// Find the corresponding end of the AnimatePresence block
// It should be followed by:
//       </AnimatePresence>
// 
//     </div>
//   );
// };
// 
// export default TrivandrumOffer;
const closingAnimatePresence = '      </AnimatePresence>\r\n\r\n    </div>\r\n  );\r\n};\r\n\r\nexport default TrivandrumOffer;';
const closingAnimatePresenceLF = '      </AnimatePresence>\n\n    </div>\n  );\n};\n\nexport default TrivandrumOffer;';

let endIdx = content.indexOf(closingAnimatePresence);
let hasLF = false;
if (endIdx === -1) {
  endIdx = content.indexOf(closingAnimatePresenceLF);
  hasLF = true;
}

if (endIdx === -1) {
  console.error('Could not find closing AnimatePresence block!');
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
        })()}\r\n`;

content = content.substring(0, startIdx) + newModalCode + content.substring(endIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched modal in TrivandrumOffer.jsx!');
