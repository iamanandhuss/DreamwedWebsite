import fs from 'fs';
import path from 'path';

const files = [
  'src/pages/Admin.jsx',
  'src/pages/ClientGallery.jsx',
  'src/pages/Home.jsx',
  'src/pages/About.jsx',
  'src/pages/Services.jsx',
  'src/pages/Blog.jsx',
  'src/pages/Contact.jsx',
  'src/pages/Policies.jsx',
  'src/pages/ClientPortal.jsx',
  'src/pages/EditorPortal.jsx',
  'src/pages/DesignerPortal.jsx',
  'src/pages/MyBooking.jsx',
  'src/pages/AiSearch.jsx',
  'src/pages/GroomBrideSignup.jsx',
  'src/pages/Packages.jsx',
  'src/pages/DigitalProposal.jsx',
  'src/pages/TrivandrumOffer.jsx',
  'src/pages/CustomPackage.jsx',
  'src/components/layout/Header.jsx',
  'src/components/layout/Footer.jsx',
  'src/components/ui/CustomCursor.jsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  
  // Find import from 'lucide-react'
  const lucideMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']/);
  const importedIcons = new Set();
  if (lucideMatch) {
    lucideMatch[1].split(',').forEach(i => {
      const parts = i.trim().split(/\s+as\s+/);
      importedIcons.add(parts[parts.length - 1].trim());
    });
  }

  // Find all JSX tags <PascalCase ...
  const jsxTags = content.match(/<([A-Z][a-zA-Z0-9]+)/g) || [];
  jsxTags.forEach(tag => {
    const name = tag.substring(1);
    // Ignore native components or components declared in file or common react components
    const isDeclared = new RegExp(`\\b(const|let|var|function|class)\\s+${name}\\b`).test(content);
    const isImported = new RegExp(`import\\s+.*\\b${name}\\b.*from`).test(content);
    const isMotion = name.startsWith('motion') || name === 'AnimatePresence' || name === 'NavLink' || name === 'Link' || name === 'SEO';

    if (!isDeclared && !isImported && !isMotion) {
      console.log(`❌ FILE: ${f} -> MISSING JSX COMPONENT / ICON: <${name}>`);
    }
  });
});

console.log('JSX Icon & Component Audit Completed.');
