const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const ids = ['pkgWeddingBasicCard', 'pkgWeddingPreCard', 'pkgCandidCard', 'pkgCandidVideoCard', 'pkgBrideGroomCard'];

ids.forEach(id => {
    console.log(`\nOccurrences of ID: ${id}`);
    let idx = -1;
    while ((idx = html.indexOf(`id="${id}"`, idx + 1)) !== -1) {
        console.log(`  - Found at index: ${idx}`);
        // print parent container info
        const parentStart = html.lastIndexOf('<div', idx);
        const parentTag = html.substring(parentStart, parentStart + 150);
        console.log(`    Parent Tag: ${parentTag}`);
    }
});
