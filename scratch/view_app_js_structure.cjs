const fs = require('fs');
const js = fs.readFileSync('public/app.js', 'utf8');
const lines = js.split('\n');

// Find DOMContentLoaded listener
lines.forEach((line, i) => {
    if (line.includes('document.addEventListener(\'DOMContentLoaded\'')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
