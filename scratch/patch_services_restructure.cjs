const fs = require('fs');

// 1. Read arrays from PricingSection.jsx
const pricingPath = 'src/components/pricing/PricingSection.jsx';
const pricingContent = fs.readFileSync(pricingPath, 'utf8');

const arraysStartMarker = 'const weddingPlans =';
const arraysEndMarker = 'const PricingSection =';

const startIdx = pricingContent.indexOf(arraysStartMarker);
const endIdx = pricingContent.indexOf(arraysEndMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find package arrays in PricingSection.jsx!');
  process.exit(1);
}

// All package arrays extracted from PricingSection.jsx
const extractedArrays = pricingContent.substring(startIdx, endIdx).trim();

// 2. Read Services.jsx
const servicesPath = 'src/pages/Services.jsx';
let servicesContent = fs.readFileSync(servicesPath, 'utf8');

// Replace imports in Services.jsx
const oldImports = "import { Camera, Video, BookOpen, Clock, Users, Heart, X, Check, Gift } from 'lucide-react';";
const newImports = "import { Camera, Video, BookOpen, Clock, Users, Heart, X, Check, Gift, Sparkles, CheckCircle, Tag, ArrowRight, Share2 } from 'lucide-react';";

servicesContent = servicesContent.replace(oldImports, newImports);

// Replace state variables in Services.jsx
// From const [activePlanIndex, setActivePlanIndex] = useState(null);
// To activePlan state
const oldStateAndHooks = `  const [activePlanIndex, setActivePlanIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard Escape listener to exit modal smoothly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActivePlanIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-play slideshow for active modal gallery
  useEffect(() => {
    if (activePlanIndex === null) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [activePlanIndex]);

  const packages = [`;

// Let's search for this block using index and replace it.
// Note: We need to handle both CRLF and LF line endings
const oldStateAndHooksClean = servicesContent.indexOf('const [activePlanIndex, setActivePlanIndex]');
const packagesStartClean = servicesContent.indexOf('const packages = [');
const packagesEndClean = servicesContent.indexOf('  return (\r\n    <div className="pt-24');
const packagesEndCleanLF = servicesContent.indexOf('  return (\n    <div className="pt-24');
let packagesEnd = packagesEndClean !== -1 ? packagesEndClean : packagesEndCleanLF;

if (oldStateAndHooksClean === -1 || packagesStartClean === -1 || packagesEnd === -1) {
  console.error('Could not find state hooks or packages definition block in Services.jsx!');
  process.exit(1);
}

// We will insert package arrays at the top (before const Services = () => {)
const servicesDecl = 'const Services = () => {';
const servicesDeclIdx = servicesContent.indexOf(servicesDecl);

if (servicesDeclIdx === -1) {
  console.error('Could not find const Services declaration in Services.jsx!');
  process.exit(1);
}

// Insert arrays before the component declaration
servicesContent = servicesContent.substring(0, servicesDeclIdx) + 
                  extractedArrays + '\n\n' + 
                  servicesContent.substring(servicesDeclIdx);

// Now re-calculate index of state hooks because of insertion
const offset = extractedArrays.length + 2;
const stateStart = servicesContent.indexOf('const [activePlanIndex, setActivePlanIndex]');
const stateEndIdx = servicesContent.indexOf('  return (\r\n    <div className="pt-24');
const stateEndIdxLF = servicesContent.indexOf('  return (\n    <div className="pt-24');
let stateEnd = stateEndIdx !== -1 ? stateEndIdx : stateEndIdxLF;

if (stateStart === -1 || stateEnd === -1) {
  console.error('Could not locate state hooks or packages block after insertion!');
  process.exit(1);
}

const newStateAndHelper = `  const [activePlan, setActivePlan] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likedPlans, setLikedPlans] = useState({});

  // Keyboard Escape listener to exit modal smoothly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActivePlan(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-play slideshow for active modal gallery
  useEffect(() => {
    if (activePlan === null) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [activePlan]);

  const toggleLike = (e, planId) => {
    e.stopPropagation();
    setLikedPlans((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

  const renderCard = (plan) => {
    const isSpecial = plan.title.toLowerCase().includes("luxury") || plan.title.toLowerCase().includes("candid");
    return (
      <motion.div
        key={plan.shareId}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8 }}
        onClick={() => {
          setActivePlan(plan);
          setCurrentSlide(0);
        }}
        className={\`relative bg-white p-8 md:p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-700 border border-transparent cursor-pointer group flex flex-col justify-between \${isSpecial ? 'border-zinc-200 shadow-lg' : ''}\`}
      >
        {/* Click hint inside card */}
        <div className="absolute top-4 left-8 text-[8px] font-bold tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity duration-300 text-zinc-500">
          ✨ Click for photos & details
        </div>

        <div>
          <div className="text-black mb-8 flex justify-center pt-2">
            {plan.title.toLowerCase().includes("haldi") ? <Video className="w-10 h-10" /> :
             plan.title.toLowerCase().includes("engagement") ? <Heart className="w-10 h-10" /> :
             <Camera className="w-10 h-10" />}
          </div>
          <h3 className="text-[26px] font-normal text-center mb-4 tracking-tight leading-tight">{plan.title}</h3>
          <p className="text-[36px] font-normal text-center mb-8 text-black numbers-pro">{plan.price}</p>
          
          <ul className="space-y-4 mb-10">
            {plan.features.slice(0, 5).map((feat, idx) => (
              <li key={idx} className="flex gap-3 items-start text-[#66706a]">
                <Heart size={16} className="text-[#5d665f] shrink-0 mt-1" />
                <span className="numbers-pro font-light text-sm">{feat}</span>
              </li>
            ))}
            {plan.features.length > 5 && (
              <li className="text-[11px] font-bold tracking-wider uppercase text-center mt-2 text-[#5d665f]">
                + View \${plan.features.length - 5} More...
              </li>
            )}
          </ul>
        </div>
        
        <div className="text-center mt-auto">
          <Button to="/contact" variant={isSpecial ? 'primary' : 'outline'} className="w-full" onClick={(e) => e.stopPropagation()}>
            Book a Consultation
          </Button>
        </div>
      </motion.div>
    );
  };\n\n`;

servicesContent = servicesContent.substring(0, stateStart) + newStateAndHelper + servicesContent.substring(stateEnd);

// 3. Replace old packages grid section
const gridSectionStart = servicesContent.indexOf('<section className="py-24">');
// Find where Section 1 ends, which is before {/* AI Photo Search Highlights Section */}
const section1End = servicesContent.indexOf('{/* AI Photo Search Highlights Section */}');

if (gridSectionStart === -1 || section1End === -1) {
  console.error('Could not find first section start or AI search section start!');
  process.exit(1);
}

const newGridSection = `<section className="py-24">
        <div className="container">
          <SectionHeader 
            subtitle="Our Offerings" 
            title="Curated Storytelling Packages" 
            description="Premium photography and cinematic videography tailored to your unique love story."
          />

          {/* Sticky Sub-navigation Bar (Light Theme) */}
          <div className="sticky top-[72px] md:top-[88px] z-30 py-4 bg-[#f5f5f3]/90 backdrop-blur-md border-b border-zinc-200 mb-16 select-none flex justify-center">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
                {weddingPlans.map((plan) => renderCard(plan))}
              </div>

              {/* Standalone Wedding Row */}
              <div className="space-y-8 pt-12 border-t border-zinc-200">
                <div className="text-center space-y-2">
                  <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">Standalone Wedding Coverages</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                  {weddingStandalonePlans.map((plan) => renderCard(plan))}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                {engagementPlans.map((plan) => renderCard(plan))}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                {haldiPlans.map((plan) => renderCard(plan))}
              </div>
            </div>

            {/* SECTION 4: ADD-ONS */}
            <div id="sec-add-ons" className="scroll-mt-36 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[#b4975a] text-xs font-bold tracking-[0.25em] uppercase">Customizations</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl sm:text-4xl text-zinc-900 font-light tracking-tight">
                  Premium <span className="italic font-serif text-[#b4975a]">Add-ons</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
                {addOnPlans.map((addon, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[40px] border border-zinc-200/60 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:border-[#1e3f20]/25 group">
                    <div className="space-y-4">
                      <span className="inline-flex bg-[#1e3f20]/5 text-[#1e3f20] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">Add-on Option</span>
                      <h4 className="text-[20px] font-normal leading-tight text-zinc-900">{addon.title}</h4>
                      <p className="text-[28px] font-normal text-[#9b1c1c] numbers-pro">{addon.price}</p>
                      <p className="text-zinc-500 text-xs font-light leading-relaxed">{addon.desc}</p>
                      <div className="text-[10px] text-zinc-400 font-medium border-t border-zinc-100 pt-3">
                        {addon.details}
                      </div>
                    </div>
                    <Button to="/contact" variant="outline" className="w-full mt-8" onClick={(e) => e.stopPropagation()}>
                      Inquire Add-on
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>\n\n      `;

servicesContent = servicesContent.substring(0, gridSectionStart) + newGridSection + servicesContent.substring(section1End);

// 4. Delete the redundant Section 4 (Standalone & Special Coverage Collections)
const standaloneStart = servicesContent.indexOf('{/* Standalone & Special Coverage Collections */}');
const standaloneEnd = servicesContent.indexOf('{/* Additional Info Section */}');

if (standaloneStart === -1 || standaloneEnd === -1) {
  console.error('Could not find Standalone section or Additional Info section in Services.jsx!');
  process.exit(1);
}

servicesContent = servicesContent.substring(0, standaloneStart) + servicesContent.substring(standaloneEnd);

// 5. Replace Modal section
const modalStart = servicesContent.indexOf('{/* DYNAMIC IMMERSIVE DETAILED MODAL */}');
const modalEnd = servicesContent.indexOf('{/* Additional Info Section */}'); // Note: since we deleted Standalone, Additional Info is the next block

if (modalStart === -1 || modalEnd === -1) {
  console.error('Could not find modal section or additional info section start!');
  process.exit(1);
}

const newModalCode = `{/* DYNAMIC IMMERSIVE DETAILED MODAL */}
      <AnimatePresence>
        {activePlan !== null && (() => {
          const plan = activePlan;
          const imagesLength = plan.images && plan.images.length ? plan.images.length : 1;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              onClick={() => setActivePlan(null)}
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
                  onClick={() => setActivePlan(null)}
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
                      key={\`bg-\${plan.images[currentSlide % imagesLength]}\`}
                      src={plan.images[currentSlide % imagesLength]}
                      alt=""
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-25 select-none pointer-events-none"
                    />
                    {/* Semi-transparent dark overlay to ensure dynamic color contrast and block clear leaks */}
                    <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

                    {/* Crisp Foreground Layer */}
                    <motion.img
                      key={\`fg-\${plan.images[currentSlide % imagesLength]}\`}
                      src={plan.images[currentSlide % imagesLength]}
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
                    {plan.images && plan.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={\`w-1 h-1 rounded-full transition-all duration-300 \${
                          (currentSlide % imagesLength) === i ? "bg-[#b4975a] scale-125" : "bg-white/40"
                        }\`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Side: Package Inclusions and Booking Option (Redesigned with Fixed Headers/CTA & Dynamic Scroll checklist) */}
                <div className="p-6 sm:p-10 flex flex-col justify-between gap-5 md:max-h-[650px] md:overflow-hidden overflow-visible h-auto">
                  
                  {/* Header detail */}
                  <div className="space-y-2 select-none">
                    <span className="inline-flex items-center gap-1 bg-[#1e3f20]/5 text-[#1e3f20] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                      {plan.modalTag || plan.tag || "Collection"}
                    </span>
                    <h3 className="text-2xl sm:text-3xl text-zinc-900 font-semibold tracking-tight font-serif leading-tight">
                      {plan.title.toLowerCase().includes("package") ? plan.title : \`\${plan.title} Package\`}
                    </h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-[#1e3f20]">{plan.price}/-</span>
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

                  {/* Main Scroll Stream (Checklist) */}
                  <div className="flex-grow md:overflow-y-auto pr-2 space-y-5 md:scrollbar-thin relative min-h-0 overflow-visible h-auto">
                    
                    {/* Short intro bio */}
                    <p className="text-zinc-500 font-light text-xs leading-relaxed select-none">
                      {plan.desc}
                    </p>

                    {/* Bonus highlight box */}
                    {plan.preweddingOffer && (
                      <div className="bg-[#d1a852]/5 border border-[#d1a852]/15 p-4 rounded-2xl flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#d1a852]/15 flex items-center justify-center text-[#b8903b] shrink-0">
                          <Gift size={16} />
                        </div>
                        <div>
                          <span className="block text-[#b8903b] text-xs font-bold uppercase tracking-wide">
                            Special Inclusions
                          </span>
                          <span className="text-zinc-600 text-[10px] font-medium leading-snug block mt-0.5">
                            {plan.preweddingOffer} is fully included in this offer.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="w-full h-px bg-zinc-100" />

                    {/* Complete inclusions list */}
                    <div className="space-y-3.5 relative">
                      <span className="text-[10px] text-zinc-800 tracking-wider uppercase font-bold block select-none">
                        Complete Deliverables (Scroll for all {plan.features ? plan.features.length : 0} items 👇):
                      </span>
                      <div className="space-y-3">
                        {plan.features && plan.features.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 text-xs text-zinc-600 font-light leading-relaxed">
                            <span className="w-4.5 h-4.5 rounded-full bg-[#1e3f20]/10 text-[#1e3f20] flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={10} strokeWidth={3} />
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-4" />
                  </div>

                  <div className="w-full h-px bg-zinc-100 select-none" />

                  {/* Book Consultation button */}
                  <div className="space-y-3">
                    <Button
                      to="/contact"
                      variant="primary"
                      className="w-full py-4.5 rounded-2xl text-center text-xs uppercase tracking-widest font-bold select-none"
                      onClick={() => setActivePlan(null)}
                    >
                      Book a Consultation Now 🌟
                    </Button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>\n\n      `;

servicesContent = servicesContent.substring(0, modalStart) + newModalCode + servicesContent.substring(modalEnd);

fs.writeFileSync(servicesPath, servicesContent, 'utf8');
console.log('Successfully restructured Services.jsx!');
