const fs = require('fs');
const css = fs.readFileSync('border_debug.css', 'utf8');
// Split into rules and check each one for border-width: 0 or border: 0
const rules = css.split(/[{}]/).filter(s => s.trim());
for (let i = 0; i < rules.length; i++) {
  const sel = rules[i].trim();
  const prop = rules[i+1] || '';
  if (prop.includes('border-width') && prop.includes('0')) {
    console.log(`Selector: ${sel}`);
    console.log(`Props: ${prop.trim().substring(0, 200)}`);
    console.log('---');
  }
  if (prop.includes('border:') && prop.includes('0')) {
    if (prop.match(/border:\s*0/) || prop.match(/border:\s*none/)) {
      console.log(`Selector: ${sel}`);
      console.log(`Props: ${prop.trim().substring(0, 200)}`);
      console.log('---');
    }
  }
}
// Also search for universal selector border rules
const universalIdx = css.indexOf('*:where');
if (universalIdx !== -1) {
  console.log('Universal selector rule:');
  console.log(css.substring(universalIdx - 10, universalIdx + 500));
}
