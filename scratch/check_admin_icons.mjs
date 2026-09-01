import fs from 'fs';

function checkFile(f) {
  const content = fs.readFileSync(f, 'utf8');
  const lucideMatch = content.match(/import\s*\{([\s\S]*?)\}\s*from\s*["']lucide-react["']/);
  const importedIcons = new Set();
  if (lucideMatch) {
    lucideMatch[1].split(',').forEach(i => {
      const parts = i.trim().split(/\s+as\s+/);
      const name = parts[parts.length - 1].trim();
      if (name) importedIcons.add(name);
    });
  }

  console.log(`File: ${f}, imported ${importedIcons.size} icons:`, [...importedIcons]);

  const jsxTags = content.match(/<([A-Z][a-zA-Z0-9]+)/g) || [];
  const missing = new Set();
  jsxTags.forEach(tag => {
    const name = tag.substring(1);
    const isDeclared = new RegExp(`\\b(const|let|var|function|class)\\s+${name}\\b`).test(content);
    const isImported = importedIcons.has(name) || new RegExp(`import\\s+.*\\b${name}\\b.*from`).test(content);
    const isMotionOrRouter = name.startsWith('motion') || ['AnimatePresence', 'NavLink', 'Link', 'SEO', 'ErrorBoundary'].includes(name);

    if (!isDeclared && !isImported && !isMotionOrRouter) {
      missing.add(name);
    }
  });

  console.log(`Missing components/icons in ${f}:`, [...missing]);
}

checkFile('src/pages/Admin.jsx');
checkFile('src/pages/ClientGallery.jsx');
