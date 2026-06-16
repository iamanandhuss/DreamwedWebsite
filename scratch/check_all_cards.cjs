const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const regex = /<div class="package-card[^"]*" id="([^"]+)" data-plan="([^"]+)" data-price="([^"]+)"/g;
let match;
while ((match = regex.exec(html)) !== null) {
    const id = match[1];
    const plan = match[2];
    const price = match[3];
    
    // Find H3 text
    const cardStart = match.index;
    const chunk = html.substring(cardStart, cardStart + 2000);
    const h3Match = chunk.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const subtitleMatch = chunk.match(/class="package-subtitle"[^>]*>([\s\S]*?)<\/p>/i);
    const imgMatch = chunk.match(/src="([^"]+)"/i);
    
    console.log(`Card ID: ${id}`);
    console.log(`  Plan: ${plan}`);
    console.log(`  Price: ${price}`);
    console.log(`  H3 text: ${h3Match ? h3Match[1].trim() : 'Not found'}`);
    console.log(`  Subtitle: ${subtitleMatch ? subtitleMatch[1].trim().replace(/<[^>]+>/g, '') : 'Not found'}`);
    console.log(`  Image: ${imgMatch ? imgMatch[1] : 'Not found'}`);
    console.log('-----------------------------------');
}
