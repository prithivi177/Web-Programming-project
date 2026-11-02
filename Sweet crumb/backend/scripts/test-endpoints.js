const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env'), override: true });

async function runTests() {
  console.log('====================================================');
  console.log('  Sweet Crumbs — Automated Endpoints & Routes Test  ');
  console.log('====================================================');

  const app = require('../server');
  // Wait 1.5 seconds for server listen
  await new Promise(r => setTimeout(r, 1500));

  const port = process.env.PORT || 3000;
  const baseUrl = `http://localhost:${port}`;

  let passed = 0;
  let failed = 0;

  async function testRoute(name, url, expectedStatus, validator) {
    try {
      const res = await fetch(url);
      const isExpected = Array.isArray(expectedStatus)
        ? expectedStatus.includes(res.status)
        : res.status === expectedStatus;
      let bodyCheck = true;

      if (validator) {
        const text = await res.text();
        bodyCheck = validator(text, res);
      }

      if (isExpected && bodyCheck) {
        console.log(`[PASS] ${name} -> HTTP ${res.status}`);
        passed++;
      } else {
        console.error(`[FAIL] ${name} -> Expected HTTP ${expectedStatus}, got ${res.status}`);
        failed++;
      }
    } catch (e) {
      console.error(`[FAIL] ${name} -> Network error: ${e.message}`);
      failed++;
    }
  }

  // 1. Static HTML Pages
  await testRoute('Home Page (index.html)', `${baseUrl}/index.html`, 200, t => t.includes('Sweet Crumbs'));
  await testRoute('About Page (about.html)', `${baseUrl}/about.html`, 200, t => t.includes('About Us'));
  await testRoute('Products Page (products.html)', `${baseUrl}/products.html`, 200, t => t.includes('Our Artisan Collection'));
  await testRoute('Order Page (order.html)', `${baseUrl}/order.html`, 200, t => t.includes('Place Your Order'));
  await testRoute('Contact Page (contact.html)', `${baseUrl}/contact.html`, 200, t => t.includes('Contact Us'));
  await testRoute('Admin Login (admin-login.html)', `${baseUrl}/admin-login.html`, 200, t => t.includes('Admin Portal'));
  await testRoute('Admin Dashboard (admin-dashboard.html)', `${baseUrl}/admin-dashboard.html`, 200, t => t.includes('Admin Dashboard'));

  // 2. Health & Public API
  await testRoute('API Health (/api/health)', `${baseUrl}/api/health`, 200, t => t.includes('"status":"ok"'));

  // 3. Products & Sweets API Routes (verifies endpoints exist and return structured JSON)
  await testRoute('Products API (/api/products)', `${baseUrl}/api/products`, [200, 500], (text, res) => {
    try {
      const json = JSON.parse(text);
      return typeof json.success === 'boolean';
    } catch (e) {
      return false;
    }
  });

  await testRoute('Sweets API (/api/sweets)', `${baseUrl}/api/sweets`, [200, 500], (text, res) => {
    try {
      const json = JSON.parse(text);
      return typeof json.success === 'boolean';
    } catch (e) {
      return false;
    }
  });

  // 4. Admin Route Protection (must be 401 Unauthorized without session)
  await testRoute('Admin Stats Route (Protected)', `${baseUrl}/api/admin/stats`, 401);
  await testRoute('Admin Orders Route (Protected)', `${baseUrl}/api/admin/orders`, 401);
  await testRoute('Admin Enquiries Route (Protected)', `${baseUrl}/api/admin/enquiries`, 401);

  // 5. API Input Validation Tests
  try {
    const badOrder = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (badOrder.status === 400) {
      console.log('[PASS] Order Validation Check (Empty body rejected) -> HTTP 400');
      passed++;
    } else {
      console.error('[FAIL] Order Validation Check expected 400, got', badOrder.status);
      failed++;
    }
  } catch (e) {
    console.error('[FAIL] Order Validation Check error:', e.message);
    failed++;
  }

  try {
    const badEnquiry = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (badEnquiry.status === 400) {
      console.log('[PASS] Enquiry Validation Check (Empty body rejected) -> HTTP 400');
      passed++;
    } else {
      console.error('[FAIL] Enquiry Validation Check expected 400, got', badEnquiry.status);
      failed++;
    }
  } catch (e) {
    console.error('[FAIL] Enquiry Validation Check error:', e.message);
    failed++;
  }

  console.log('====================================================');
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  process.exit(failed === 0 ? 0 : 1);
}

runTests();
