const fs = require('fs');
const css = fs.readFileSync('public/style.css', 'utf8');
const lines = css.split('\n');

lines.forEach((line, i) => {
    if (line.includes('package-event-') || line.includes('package-event-section')) {
        console.log(i + 1, ':', line.trim());
    }
});
