const fs = require('fs');

const css = fs.readFileSync('public/style.css', 'utf8');

// A simple parser to extract @media blocks
let pos = 0;
while (true) {
    const mediaIdx = css.indexOf('@media', pos);
    if (mediaIdx === -1) break;
    
    // Find the opening bracket
    const openBracketIdx = css.indexOf('{', mediaIdx);
    if (openBracketIdx === -1) break;
    
    const mediaQueryHeader = css.substring(mediaIdx, openBracketIdx).trim();
    
    // Match nested brackets to find the end of the @media block
    let bracketCount = 1;
    let endIdx = openBracketIdx + 1;
    while (bracketCount > 0 && endIdx < css.length) {
        if (css[endIdx] === '{') {
            bracketCount++;
        } else if (css[endIdx] === '}') {
            bracketCount--;
        }
        endIdx++;
    }
    
    const mediaQueryBody = css.substring(openBracketIdx + 1, endIdx - 1);
    
    if (mediaQueryHeader.includes('768px') || mediaQueryHeader.includes('576px') || mediaQueryHeader.includes('480px')) {
        console.log(`=== MEDIA QUERY: ${mediaQueryHeader} ===`);
        console.log(mediaQueryBody.trim());
        console.log('\n');
    }
    
    pos = endIdx;
}
