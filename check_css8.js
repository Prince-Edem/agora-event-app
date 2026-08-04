const fs = require('fs');
const css = fs.readFileSync('border_debug.css', 'utf8');

// Find @layer neon section
const neonIdx = css.indexOf('@layer neon');
if (neonIdx !== -1) {
  console.log('=== @layer neon section (first 2000 chars) ===');
  console.log(css.substring(neonIdx, neonIdx + 2000));
} else {
  console.log('@layer neon not found');
}

// Also check the @layer base section for the universal selector
const baseIdx = css.indexOf('@layer base');
if (baseIdx !== -1) {
  console.log('\n=== @layer base section (first 2000 chars) ===');
  console.log(css.substring(baseIdx, baseIdx + 2000));
}
