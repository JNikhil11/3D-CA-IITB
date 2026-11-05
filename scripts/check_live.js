import https from 'https';

async function checkLive() {
  const url = 'https://3d-ca-iitb.vercel.app';
  const res = await fetch(url);
  console.log('Status:', res.status);
  console.log('--- Response Headers ---');
  for (const [k, v] of res.headers.entries()) {
    console.log(`${k}: ${v}`);
  }

  const html = await res.text();
  console.log('\n--- Live HTML (first 1500 chars) ---');
  console.log(html.slice(0, 1500));

  const scriptMatches = [...html.matchAll(/src=["']([^"']+\.js)["']/g)].map(m => m[1]);
  const cssMatches = [...html.matchAll(/href=["']([^"']+\.css)["']/g)].map(m => m[1]);

  console.log('\n--- Script Assets Found on Live ---');
  for (const s of scriptMatches) {
    const sUrl = s.startsWith('http') ? s : `${url}${s}`;
    const sRes = await fetch(sUrl);
    console.log(`${s}: ${sRes.status} (bytes: ${sRes.headers.get('content-length')})`);
  }

  console.log('\n--- CSS Assets Found on Live ---');
  for (const c of cssMatches) {
    const cUrl = c.startsWith('http') ? c : `${url}${c}`;
    const cRes = await fetch(cUrl);
    console.log(`${c}: ${cRes.status} (bytes: ${cRes.headers.get('content-length')})`);
  }
}

checkLive().catch(console.error);
