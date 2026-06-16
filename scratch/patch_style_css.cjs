const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/style.css');
let css = fs.readFileSync(filePath, 'utf8');

css = css.replace(/\r\n/g, '\n');

// Find the index of '.packages-grid .package-card {'
const key = `.packages-grid .package-card {`;
const idx = css.indexOf(key);

if (idx === -1) {
    console.error("Could not find packages-grid package-card style block!");
} else {
    const beforeStyleText = `.packages-grid .package-card::before {
    display: none !important;
    content: none !important;
}\n\n`;
    css = css.substring(0, idx) + beforeStyleText + css.substring(idx);
    console.log("Successfully injected beforeStyleText.");
}

fs.writeFileSync(filePath, css, 'utf8');
console.log("CSS patch complete!");
