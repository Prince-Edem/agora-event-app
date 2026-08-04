const http = require('http');
http.get('http://localhost:3000/_next/static/chunks/%5Broot-of-the-server%5D__0dgusam._.css', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const fs = require('fs');
    // Search for border-2 CSS rule
    let idx = d.indexOf('border-2 {');
    while (idx !== -1) {
      console.log('--- border-2 rule ---');
      console.log(d.substring(idx, idx + 150));
      idx = d.indexOf('border-2 {', idx + 1);
    }
    // Search for border CSS rule (border-width)
    idx = d.indexOf('.border {');
    if (idx !== -1) {
      console.log('--- .border rule ---');
      console.log(d.substring(idx, idx + 200));
    }
    // Save full CSS for inspection
    fs.writeFileSync('border_debug.css', d);
    console.log('\nCSS saved to border_debug.css for inspection');
  });
}).on('error', e => console.error(e.message));
