const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/style.css');
let css = fs.readFileSync(filePath, 'utf8');

css = css.replace(/\r\n/g, '\n');

// Update image opacity to 0.95 (almost fully visible/clear)
css = css.replace('opacity: 0.85 !important;', 'opacity: 0.95 !important;');

// Update overlay gradient to start fading much lower (leaves top 40% completely bright and clear)
css = css.replace(
    'background: linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.96) 100%) !important;',
    'background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.7) 75%, #000000 100%) !important;'
);

fs.writeFileSync(filePath, css, 'utf8');
console.log("CSS overlay and opacity patch complete!");
