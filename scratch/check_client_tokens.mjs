import fs from 'fs';

const client = fs.readFileSync('src/pages/ClientGallery.jsx', 'utf8');

// Find all words/identifiers in client
const idRegex = /[a-zA-Z_$][a-zA-Z0-9_$]*/g;
const tokens = new Set(client.match(idRegex) || []);

const builtins = new Set([
  'div', 'span', 'h1', 'h2', 'h3', 'p', 'form', 'label', 'input', 'button', 'select', 'option', 'img', 'a', 'strong', 'true', 'false', 'null', 'undefined', 'key', 'className', 'type', 'placeholder', 'value', 'onChange', 'onSubmit', 'required', 'style', 'src', 'alt', 'onClick', 'title', 'disabled', 'href', 'target', 'rel', 'e', 'pos', 'align', 'f', 'c', 'g', 'i', 'index', 'item', 'Array', 'isArray', 'length', 'map', 'find', 'toLowerCase', 'Math', 'random', 'navigator', 'clipboard', 'writeText', 'alert', 'typeof', 'window', 'location', 'origin', 'activeTab', 'bg', 'text', 'border', 'flex', 'px', 'py', 'rounded', 'font', 'grid', 'hidden', 'block', 'w', 'h', 'gap', 'items', 'justify', 'relative', 'absolute', 'inset', 'shrink', 'truncate', 'leading', 'object', 'cursor', 'transition', 'hover', 'shadow', 'blur', 'filter', 'duration', 'capitalize', 'uppercase', 'lowercase', 'space', 'ring', 'fill', 'animate', 'mono', 'serif', 'sans', 'solid', 'outline', 'none', 'auto', 'md', 'sm', 'lg', 'col', 'row', 'start', 'end', 'center', 'top', 'bottom', 'left', 'right', 'copy', 'id', 'name', 'hex', 'label', 'family', 'url', 'coverUrl', 'coverAlign', 'coverTextAlign', 'coverFont', 'coverColor', 'groomName', 'brideName', 'gdriveLink', 'extraDriveLink', 'accessCode', 'selectedCount', 'selectedPhotoIds', 'photosCount', 'photos', 'target', 'value', 'has', 'add', 'delete', 'Set', 'from', 'size', 'prev', 'next', 'clearTimeout', 'setTimeout', 'current', 'findIndex', 'addEventListener', 'removeEventListener', 'share', 'catch', 'console', 'error', 'replace', 'trim', 'JSON', 'parse', 'stringify', 'localStorage', 'getItem', 'setItem', 'fetch', 'then', 'response', 'res', 'ok', 'status', 'json', 'Error', 'import', 'meta', 'env', 'VITE_API_BASE_URL', 'new', 'const', 'let', 'var', 'function', 'if', 'else', 'return', 'try', 'finally', 'await', 'async'
]);

const userTokens = [...tokens].filter(t => !builtins.has(t) && t.length > 1);

console.log('User tokens in ClientGallery.jsx:', userTokens);

// Check if each token is defined in ClientGallery.jsx
userTokens.forEach(t => {
  const isImported = new RegExp(`\\b${t}\\b`).test(client.substring(0, 1000));
  const isDeclared = new RegExp(`\\b(const|let|var|function|class)\\s+${t}\\b`).test(client);
  
  if (!isImported && !isDeclared) {
    console.log(`⚠️ POTENTIAL UNDEFINED TOKEN IN CLIENT GALLERY: "${t}"`);
  }
});
