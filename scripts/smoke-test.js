const https = require('https');

const BASE_URL = process.env.SITE_URL || 'https://olehi-davis-portfolio.vercel.app';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';

const routes = [
  '/',
  '/projects/clintons-inventory-app',
  '/blog',
  '/blog/building-distributed-idempotency-keys',
  '/admin/login',
  '/sitemap.xml',
  '/api/rss.xml',
  '/api/visitors',
];

function testRoute(route) {
  return new Promise((resolve) => {
    const url = new URL(route, BASE_URL);
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; PortfolioSmokeTest/1.0)',
    };
    if (VERCEL_TOKEN) {
      headers['x-vercel-protection-bypass'] = VERCEL_TOKEN;
    }

    https
      .get(url, { headers }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          resolve({
            route,
            statusCode: res.statusCode,
            snippet: body.substring(0, 120).replace(/\s+/g, ' '),
          });
        });
      })
      .on('error', (err) => {
        resolve({ route, error: err.message });
      });
  });
}

async function run() {
  console.log(`Running smoke tests on ${BASE_URL}...`);
  for (const r of routes) {
    const result = await testRoute(r);
    if (result.error) {
      console.error(`Route: ${r.padEnd(20)} -> ERROR: ${result.error}`);
    } else {
      console.log(`Route: ${r.padEnd(20)} -> Status: ${result.statusCode} | Preview: ${result.snippet}`);
    }
  }
}

run();
