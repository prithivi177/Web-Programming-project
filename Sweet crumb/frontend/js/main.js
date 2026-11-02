// ====================================================================
// SWEET CRUMBS — MAIN JAVASCRIPT (main.js)
// ====================================================================

function getApiBaseUrl() {
  if (window.location.protocol === 'file:') {
    return 'http://localhost:3000';
  }
  if (window.location.port && window.location.port !== '3000') {
    return 'http://localhost:3000';
  }
  return '';
}

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
});

async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-3 text-muted">Loading fresh bakery treats from the oven...</p>
    </div>
  `;

  try {
    const apiBase = getApiBaseUrl();
    let response;
    try {
      response = await fetch(`${apiBase}/api/products`);
    } catch (netErr) {
      if (apiBase !== 'http://localhost:3000') {
        response = await fetch('http://localhost:3000/api/products');
      } else {
        throw netErr;
      }
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok || !data || !data.success || !Array.isArray(data.data)) {
      const serverMsg = (data && data.message) ? data.message : `HTTP ${response.status} ${response.statusText}`;
      const serverErr = (data && data.error) ? data.error : '';
      const detailedErr = serverErr ? `${serverMsg} — Reason: ${serverErr}` : serverMsg;
      throw new Error(detailedErr);
    }

    if (data.data.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-cake2 text-warning fs-1"></i>
          <h4 class="mt-3 font-heading">Our Oven is Warming Up</h4>
          <p class="text-muted">Bakery catalog is currently empty. Run <code>npm run setup-db</code> to initialize the sample menu.</p>
        </div>
      `;
      return;
    }

    // Display first 6 signature items for the homepage
    const featured = data.data.slice(0, 6);
    container.innerHTML = featured.map(product => renderProductCard(product)).join('');
  } catch (error) {
    console.error('Failed to load featured products:', error);
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-danger d-inline-block text-start rounded-4 p-4 shadow-sm" style="max-width: 640px;">
          <div class="d-flex align-items-center gap-2 mb-2 text-danger fw-bold fs-5">
            <i class="bi bi-exclamation-triangle-fill fs-3"></i>
            <span>Database / API Connection Notice</span>
          </div>
          <p class="mb-2 text-dark">${escapeHtml(error.message)}</p>
          <div class="bg-white border rounded p-3 mt-3">
            <div class="small fw-bold text-secondary mb-1">To view live bakery products:</div>
            <ol class="small text-muted mb-0 ps-3">
              <li>Ensure Express server is running (<code>npm start</code>).</li>
              <li>Visit <a href="http://localhost:3000/index.html" class="text-decoration-underline" target="_blank">http://localhost:3000</a> in your browser.</li>
            </ol>
          </div>
        </div>
      </div>
    `;
  }
}

function renderProductCard(p) {
  const priceFormatted = Number(p.price).toFixed(2);
  const isAvailable = p.available == 1 || p.available === true;
  const availBadge = isAvailable
    ? '<span class="product-badge-availability product-badge-in-stock"><i class="bi bi-check-circle me-1"></i> Fresh</span>'
    : '<span class="product-badge-availability product-badge-out-of-stock"><i class="bi bi-x-circle me-1"></i> Sold Out</span>';

  const orderButton = isAvailable
    ? `<a href="order.html?product=${p.id}" class="btn btn-order-card"><i class="bi bi-bag-plus me-1"></i> Order Now</a>`
    : `<button class="btn btn-order-card" disabled>Unavailable</button>`;

  return `
    <div class="col-md-6 col-lg-4">
      <div class="product-card">
        <div class="product-img-container">
          <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" class="product-card-img" onerror="this.src='assets/images/cake-chocolate.svg'">
          <span class="product-badge-category">${escapeHtml(p.category)}</span>
          ${availBadge}
        </div>
        <div class="product-body">
          <h4 class="product-title">${escapeHtml(p.name)}</h4>
          <p class="product-desc">${escapeHtml(p.description)}</p>
          <div class="product-footer">
            <div class="product-price">
              ₹${priceFormatted}
            </div>
            ${orderButton}
          </div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
