const fs = require('fs');
const html = fs.readFileSync('public/packages.html', 'utf8');

const regex = /<div class="package-card[^"]*"[^>]*>/g;
let match;
while ((match = regex.exec(html)) !== null) {
    console.log('Match:', match[0]);
    // find next 500 chars to see headers
    const startIdx = match.index;
    const endIdx = html.indexOf('</div>', startIdx + 2000);
    console.log(html.substring(startIdx, startIdx + 800));
    console.log('\n-----------------------------------------\n');
}
