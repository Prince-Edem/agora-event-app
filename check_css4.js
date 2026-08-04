const fs = require('fs');
const css = fs.readFileSync('border_debug.css', 'utf8');

// Search for --tw-border-style
let idx = css.indexOf('--tw-border-style');
while (idx !== -1) {
  console.log('--- found --tw-border-style ---');
  console.log(css.substring(idx - 50, idx + 100));
  idx = css.indexOf('--tw-border-style', idx + 1);
}

// Also search for "border-style" in the CSS
const matches = [...css.matchAll(/border-style[^{]*\{[^}]*\}/g)];
matches.slice(0, 10).forEach(m => console.log(m[0]));
