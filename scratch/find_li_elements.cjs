const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const id = 'pkgWeddingBasicCard';
const idx = html.indexOf(id);
if (idx !== -1) {
    const chunk = html.substring(idx, idx + 4000);
    // Find all <li> elements inside the chunk
    console.log("Chunk search around ID:", id);
    const lines = chunk.split('\n');
    lines.forEach(line => {
        if (line.includes('<li') || line.includes('</li')) {
            console.log(line.trim());
        }
    });
}
