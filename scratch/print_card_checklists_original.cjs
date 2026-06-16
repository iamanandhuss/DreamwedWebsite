const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const ids = ['pkgWeddingBasicCard', 'pkgWeddingPreCard', 'pkgCandidCard', 'pkgCandidVideoCard', 'pkgBrideGroomCard'];

ids.forEach(id => {
    console.log(`\n================= ${id} =================`);
    const idIdx = html.indexOf(`id="${id}"`);
    if (idIdx === -1) {
        console.log("Not found");
        return;
    }
    const startIdx = html.lastIndexOf('<div', idIdx);
    
    // Scan matching closing tag to get the entire card block
    let openDivs = 0;
    let endIdx = startIdx;
    let i = startIdx;
    while (i < html.length) {
        if (html.substring(i, i + 4) === '<div') {
            openDivs++;
            i += 4;
        } else if (html.substring(i, i + 6) === '</div') {
            openDivs--;
            i += 6;
            if (openDivs === 0) {
                endIdx = i;
                break;
            }
        } else {
            i++;
        }
    }
    
    const block = html.substring(startIdx, endIdx);
    
    // Find event sections
    const eventSecIdx = block.indexOf('class="package-event-sections"');
    if (eventSecIdx === -1) {
        console.log("No event sections");
        return;
    }
    
    const eventSecBlock = block.substring(eventSecIdx);
    // Print all li elements
    const liMatches = eventSecBlock.match(/<li>([\s\S]*?)<\/li>/gi);
    if (liMatches) {
        liMatches.forEach(li => {
            console.log("  - " + li.replace(/<[^>]+>/g, '').trim());
        });
    } else {
        console.log("No li elements found");
    }
});
