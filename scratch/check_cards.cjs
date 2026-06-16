const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const regex = /id="(pkg[a-zA-Z0-9_-]+)"/g;
let match;
const ids = [];
while ((match = regex.exec(html)) !== null) {
    ids.push(match[1]);
}
console.log('Found card IDs:', ids);

// Also look at titles or headers inside those elements
ids.forEach(id => {
    const startIdx = html.indexOf(`id="${id}"`);
    if (startIdx !== -1) {
        // extract up to 1000 characters to see the headers
        const chunk = html.substring(startIdx, startIdx + 1500);
        console.log(`\n=== CARD ID: ${id} ===`);
        // Extract H3 text
        const h3Match = chunk.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
        const subtitleMatch = chunk.match(/class="package-subtitle"[^>]*>([\s\S]*?)<\/div>/i);
        const priceMatch = chunk.match(/class="package-price"[^>]*>([\s\S]*?)<\/div>/i);
        console.log('H3 text:', h3Match ? h3Match[1].trim() : 'Not found');
        console.log('Subtitle:', subtitleMatch ? subtitleMatch[1].trim() : 'Not found');
        console.log('Price:', priceMatch ? priceMatch[1].trim() : 'Not found');
    }
});
