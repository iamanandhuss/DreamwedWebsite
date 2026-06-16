const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const id = 'pkgWeddingBasicCard';
const startIdx = html.indexOf(`id="${id}"`);
if (startIdx !== -1) {
    // find matching end of the card div. since divs nest, let's just grab 4500 chars to be safe.
    const chunk = html.substring(startIdx - 100, startIdx + 4500);
    console.log(chunk);
}
