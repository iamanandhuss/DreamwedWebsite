const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const id = 'pkgCandidCard';
const idx = html.indexOf(`id="${id}"`);
if (idx !== -1) {
    const startIdx = html.lastIndexOf('<div', idx);
    console.log(html.substring(startIdx + 6000, startIdx + 11000));
}
