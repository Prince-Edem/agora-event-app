const fs = require('fs');
const css = fs.readFileSync('border_debug.css', 'utf8');
const rules = css.split('}');
rules.forEach((r) => {
  const sel = r.split('{')[0].trim();
  if (sel.includes('button') || sel.includes('Button') || sel.includes('[data-slot')) {
    console.log(r.trim().substring(0, 400));
    console.log('---');
  }
});
