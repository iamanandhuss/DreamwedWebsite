const fs = require('fs');
const css = fs.readFileSync('public/style.css', 'utf8');
const lines = css.split('\n');

lines.forEach((line, i) => {
    if (line.includes('.package-event-section') && !line.includes('package-event-sections')) {
        console.log(`=== LINE ${i+1} ===`);
        console.log(lines.slice(i, i + 25).join('\n'));
    }
});
