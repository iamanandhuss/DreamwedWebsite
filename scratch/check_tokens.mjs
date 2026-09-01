import fs from 'fs';

const admin = fs.readFileSync('src/pages/Admin.jsx', 'utf8');
const lines = admin.split('\n');

// Find lines with {activeTab === "ai-galleries" && (
const tabStart = lines.findIndex((l, i) => i > 2500 && l.includes('activeTab === "ai-galleries"'));
console.log('Main ai-galleries tab starts at line:', tabStart + 1);

let tabEnd = lines.findIndex((l, i) => i > tabStart && l.includes('activeTab === "ai-orders"'));
console.log('Main ai-galleries tab ends at line:', tabEnd + 1);

const blockCode = lines.slice(tabStart, tabEnd).join('\n');

// Find all words/identifiers in blockCode
const idRegex = /[a-zA-Z_$][a-zA-Z0-9_$]*/g;
const tokens = new Set(blockCode.match(idRegex) || []);

// Exclude builtins and keywords
const builtins = new Set([
  'div', 'span', 'h1', 'h2', 'h3', 'p', 'form', 'label', 'input', 'button', 'select', 'option', 'img', 'a', 'strong', 'true', 'false', 'null', 'undefined', 'key', 'className', 'type', 'placeholder', 'value', 'onChange', 'onSubmit', 'required', 'style', 'src', 'alt', 'onClick', 'title', 'disabled', 'href', 'target', 'rel', 'e', 'pos', 'align', 'f', 'c', 'g', 'i', 'index', 'item', 'Array', 'isArray', 'length', 'map', 'find', 'toLowerCase', 'Math', 'random', 'navigator', 'clipboard', 'writeText', 'alert', 'typeof', 'window', 'location', 'origin', 'activeTab', 'bg', 'text', 'border', 'flex', 'px', 'py', 'rounded', 'font', 'grid', 'hidden', 'block', 'w', 'h', 'gap', 'items', 'justify', 'relative', 'absolute', 'inset', 'shrink', 'truncate', 'leading', 'object', 'cursor', 'transition', 'hover', 'shadow', 'blur', 'filter', 'duration', 'capitalize', 'uppercase', 'lowercase', 'space', 'ring', 'fill', 'animate', 'mono', 'serif', 'sans', 'solid', 'outline', 'none', 'auto', 'md', 'sm', 'lg', 'col', 'row', 'start', 'end', 'center', 'top', 'bottom', 'left', 'right', 'copy', 'id', 'name', 'hex', 'label', 'family', 'url', 'coverUrl', 'coverAlign', 'coverTextAlign', 'coverFont', 'coverColor', 'groomName', 'brideName', 'gdriveLink', 'extraDriveLink', 'accessCode', 'selectedCount', 'selectedPhotoIds', 'photosCount', 'photos', 'target', 'value'
]);

const userTokens = [...tokens].filter(t => !builtins.has(t) && t.length > 1);

console.log('User tokens in ai-galleries tab block:', userTokens);

// Check if each token is defined in Admin.jsx
const headerCode = admin.substring(0, 1800);
userTokens.forEach(t => {
  const isImported = new RegExp(`\\b${t}\\b`).test(admin.substring(0, 2000));
  const isDeclared = new RegExp(`\\b(const|let|var|function)\\s+${t}\\b`).test(admin);
  
  if (!isImported && !isDeclared) {
    console.log(`⚠️ POTENTIAL UNDEFINED TOKEN: "${t}"`);
  }
});
