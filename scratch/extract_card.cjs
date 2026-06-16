const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const id = 'pkgWeddingBasicCard';
const idIdx = html.indexOf(`id="${id}"`);
if (idIdx !== -1) {
    const startIdx = html.lastIndexOf('<div', idIdx);
    if (startIdx !== -1) {
        console.log(html.substring(startIdx, startIdx + 3500));
    }
}
