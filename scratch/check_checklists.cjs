const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const regex = /id="(pkg[a-zA-Z0-9_-]+)"/g;
let match;
const ids = [];
while (match = regex.exec(html)) {
    ids.push(match[1]);
}

// deduplicate
const uniqueIds = Array.from(new Set(ids));

uniqueIds.forEach(id => {
    const startIdx = html.indexOf(`id="${id}"`);
    if (startIdx !== -1) {
        const chunk = html.substring(startIdx, startIdx + 3000);
        console.log(`\n=== CARD ID: ${id} ===`);
        const liRegex = /<li>([\s\S]*?)<\/li>/gi;
        let liMatch;
        let count = 0;
        while ((liMatch = liRegex.exec(chunk)) !== null && count < 10) {
            console.log(`  - ${liMatch[1].replace(/<[^>]+>/g, '').trim()}`);
            count++;
        }
    }
});
