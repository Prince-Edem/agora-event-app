const fs = require('fs');
const css = fs.readFileSync('border_debug.css', 'utf8');

// Check layer structure around border-2 rule
const border2Idx = css.indexOf('.border-2');
const border2Start = css.lastIndexOf('@layer', border2Idx);
const borderTransparentIdx = css.indexOf('.border-transparent');
const borderTransparentStart = css.lastIndexOf('@layer', borderTransparentIdx);

console.log('=== Context around .border-2 ===');
console.log(css.substring(border2Idx - 200, border2Idx + 200));

console.log('\n=== Context around .border-[var(--brand)] ===');
const idx = css.indexOf('border-\\[var\\(--brand\\)\\]');
console.log(css.substring(idx - 300, idx + 200));

// Check for @layer declarations
const layerMatches = [...css.matchAll(/@layer\s+\w+/g)];
console.log('\n=== All @layer declarations ===');
layerMatches.forEach(m => console.log(m[0]));

// Check what layer border-2 is in
console.log('\n=== What comes before border-2 ===');
console.log(css.substring(Math.max(0, border2Idx - 1000), border2Idx));
