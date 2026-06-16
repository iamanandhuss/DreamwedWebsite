import fs from 'fs';
import path from 'path';

const srcPath = "C:/Users/HP/.gemini/antigravity/brain/4ec37a4c-fb7a-426f-9bed-507f39e5e8c5/favicon_premium_1781452319359.png";
const destDir = "C:/Users/HP/.gemini/antigravity/scratch/DreamwedWebsite/public";

// Ensure destination exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy PNG files
fs.copyFileSync(srcPath, path.join(destDir, 'favicon.png'));
fs.copyFileSync(srcPath, path.join(destDir, 'favicon2.png'));
fs.copyFileSync(srcPath, path.join(destDir, 'appIcon.png'));
console.log("PNG copies created successfully.");

// Create ICO file
const pngBuffer = fs.readFileSync(srcPath);

// Header (6 bytes)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

// Directory entry (16 bytes)
const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(0, 0); // width (0 = 256)
dirEntry.writeUInt8(0, 1); // height (0 = 256)
dirEntry.writeUInt8(0, 2); // color palette
dirEntry.writeUInt8(0, 3); // reserved
dirEntry.writeUInt16LE(1, 4); // planes
dirEntry.writeUInt16LE(32, 6); // bpp
dirEntry.writeUInt32LE(pngBuffer.length, 8); // size
dirEntry.writeUInt32LE(22, 12); // offset

const icoBuffer = Buffer.concat([header, dirEntry, pngBuffer]);
fs.writeFileSync(path.join(destDir, 'favicon.ico'), icoBuffer);
console.log("ICO file created successfully.");
