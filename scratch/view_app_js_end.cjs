const fs = require('fs');
const js = fs.readFileSync('public/app.js', 'utf8');
const lines = js.split('\n');
console.log(lines.slice(-30).join('\n'));
