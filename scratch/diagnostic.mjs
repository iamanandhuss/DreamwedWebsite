import fs from 'fs';
import path from 'path';

const adminPath = path.resolve('src/pages/Admin.jsx');
const clientPath = path.resolve('src/pages/ClientGallery.jsx');

console.log('Admin path exists:', fs.existsSync(adminPath));
console.log('Client path exists:', fs.existsSync(clientPath));

if (fs.existsSync(adminPath)) {
  const content = fs.readFileSync(adminPath, 'utf8');
  const lines = content.split('\n');
  console.log('Admin total lines:', lines.length);
  
  const checks = [
    'newGalCover',
    'newGalCoverAlign',
    'newGalCoverFont',
    'newGalCoverColor',
    'newGalCoverTextAlign',
    'coverInputMode',
    'editingCoverGallery',
    'editCoverValue',
    'GALLERY_FONTS',
    'GALLERY_COLORS',
    'handleOpenSelectedPhotos',
    'selectedGalForPhotos',
    'selectedPhotoIds',
    'syncingGalId',
    'handleSyncDrivePhotos',
    'handleDeleteAiGallery'
  ];

  checks.forEach(chk => {
    let found = [];
    lines.forEach((l, i) => {
      if (l.includes(chk)) found.push(i + 1);
    });
    console.log(`Check ${chk}: found on lines (${found.length} total):`, found.slice(0, 5));
  });
}
