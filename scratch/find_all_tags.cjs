const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const id = 'pkgWeddingBasicCard';
const idx = html.indexOf(id);
if (idx !== -1) {
    const chunk = html.substring(idx, idx + 12000);
    // Find all HTML elements with tags (like <div, <span, <ul, <li, <p, etc.)
    const matches = chunk.match(/<[a-zA-Z0-9]+[^>]*>/gi);
    if (matches) {
        console.log("Found tags count:", matches.length);
        // print first 100 tags
        matches.slice(0, 100).forEach(tag => {
            console.log(tag);
        });
    }
}
