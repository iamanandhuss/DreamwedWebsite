const fs = require('fs');

const files = [
  'src/components/pricing/PricingSection.jsx',
  'src/pages/TrivandrumOffer.jsx',
  'src/pages/Services.jsx'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(f + ':');
  
  // Find lines containing max-h
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('max-h')) {
      console.log(`  Line ${idx + 1}: ${line.trim()}`);
    }
  });
});
