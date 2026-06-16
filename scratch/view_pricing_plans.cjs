const fs = require('fs');
const js = fs.readFileSync('src/components/pricing/PricingSection.jsx', 'utf8');
const lines = js.split('\n');

let start = -1;
lines.forEach((line, i) => {
    if (line.includes('const pricingPlans') || line.includes('pricingPlans = [')) {
        start = i;
    }
});

if (start !== -1) {
    console.log(lines.slice(start, start + 120).join('\n'));
} else {
    console.log("Could not find pricingPlans definition");
}
