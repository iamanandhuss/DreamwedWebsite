const fs = require('fs');
let content = fs.readFileSync('src/components/pricing/PricingSection.jsx', 'utf8');

// 1. Replace card container classes
content = content.replaceAll(
  'bg-white p-6 sm:p-8 rounded-[32px] border border-zinc-200/60 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 h-full group hover:border-[#d1a852]/25',
  'bg-[#121215] p-6 sm:p-8 rounded-[32px] border border-white/5 shadow-2xl flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(209,168,82,0.06)] transition-all duration-500 h-full group hover:border-[#d1a852]/40'
);

// 2. Replace red price color with champagne gold
content = content.replaceAll(
  'text-[#9b1c1c]',
  'text-[#d1a852]'
);

// 3. Replace standalone CTA button styles
content = content.replaceAll(
  'mt-8 py-3 w-full rounded-[16px] border border-zinc-300 text-black hover:bg-zinc-50 transition-all text-center text-xs font-bold uppercase tracking-wider block',
  'mt-8 py-3 w-full rounded-[16px] border border-white/10 text-white hover:bg-white/5 hover:border-[#d1a852]/30 transition-all text-center text-xs font-bold uppercase tracking-wider block'
);

// 4. Replace subheader tag colors
content = content.replaceAll(
  'text-[#5d665f] text-xs font-bold tracking-[0.2em] uppercase',
  'text-[#d1a852] text-xs font-bold tracking-[0.2em] uppercase'
);
content = content.replaceAll(
  'text-[#5d665f] text-xs font-bold tracking-[0.25em] uppercase',
  'text-[#d1a852] text-xs font-bold tracking-[0.25em] uppercase'
);

// 5. Replace subheader titles text-zinc-900 to text-white
content = content.replaceAll(
  'text-2xl text-zinc-900 font-normal tracking-tight font-serif italic',
  'text-2xl text-white font-normal tracking-tight font-serif italic'
);

// 6. Replace subheader border border-zinc-300 to border-white/5
content = content.replaceAll(
  'space-y-2 border-b border-zinc-300 pb-4',
  'space-y-2 border-b border-white/5 pb-4'
);

// 7. Replace heart icon colors
content = content.replaceAll(
  'text-[#5d665f] shrink-0 mt-0.5',
  'text-[#d1a852] shrink-0 mt-0.5'
);

// 8. Replace list item text-zinc-500 to text-zinc-400
content = content.replaceAll(
  'text-zinc-500 text-xs',
  'text-zinc-400 text-xs'
);

// 9. Replace bold item text-zinc-800 to text-zinc-100
content = content.replaceAll(
  'text-zinc-800',
  'text-zinc-100'
);

// 10. Replace badge colors in Standalone packs (bg-[#1e3f20]/5 to bg-white/5)
content = content.replaceAll(
  'bg-[#1e3f20]/5 text-[#1e3f20]',
  'bg-white/5 text-[#d1a852] border border-[#d1a852]/20'
);

fs.writeFileSync('src/components/pricing/PricingSection.jsx', content, 'utf8');
console.log('Successfully styled Standalone section in PricingSection.jsx');
