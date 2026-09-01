import fs from 'fs';
import path from 'path';

const clientPath = path.resolve('src/pages/ClientGallery.jsx');
const content = fs.readFileSync(clientPath, 'utf8');
const lines = content.split('\n');
console.log('ClientGallery total lines:', lines.length);

const checks = [
  'useParams',
  'useNavigate',
  'Link',
  'useState',
  'useEffect',
  'useRef',
  'isLocked',
  'meta',
  'gallery',
  'activePhoto',
  'selectedPhotoIds',
  'filterMode',
  'saveStatus',
  'activeColor',
  'activeFontKey',
  'activeFontFamily',
  'activeAlignClass',
  'activeTextAlign',
  'handleUnlock',
  'handlePrevPhoto',
  'handleNextPhoto',
  'toggleHeartPhoto'
];

checks.forEach(chk => {
  let found = [];
  lines.forEach((l, i) => {
    if (l.includes(chk)) found.push(i + 1);
  });
  console.log(`Check ${chk}: found on lines (${found.length} total):`, found.slice(0, 5));
});
