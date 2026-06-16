const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const id = 'pkgWeddingBasicCard';
const startIdx = html.indexOf(`id="${id}"`);
if (startIdx !== -1) {
    const chunk = html.substring(startIdx - 100, startIdx + 2000);
    console.log(`HTML for ${id}:`);
    console.log(chunk);
} else {
    console.log(`Could not find ${id}`);
}
