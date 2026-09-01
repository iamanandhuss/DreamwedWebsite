import fs from 'fs';

const content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('selectedPhotosModalData') || l.includes('CLIENT SELECTIONS REPOSITORY') || l.includes('DOWNLOAD ALL (')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
