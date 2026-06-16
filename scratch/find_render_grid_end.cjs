const fs = require('fs');
const js = fs.readFileSync('public/app.js', 'utf8');
const lines = js.split('\n');

let startLine = -1;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function renderPackagesGrid()')) {
        startLine = i + 1;
        break;
    }
}

if (startLine !== -1) {
    let openBrackets = 0;
    let foundStart = false;
    for (let i = startLine - 1; i < lines.length; i++) {
        const line = lines[i];
        for (let char of line) {
            if (char === '{') {
                openBrackets++;
                foundStart = true;
            } else if (char === '}') {
                openBrackets--;
                if (foundStart && openBrackets === 0) {
                    endLine = i + 1;
                    break;
                }
            }
        }
        if (endLine !== -1) break;
    }
}

console.log('Start Line:', startLine);
console.log('End Line:', endLine);
if (endLine !== -1) {
    console.log('Lines around end:');
    console.log(lines.slice(endLine - 5, endLine + 5).join('\n'));
}
