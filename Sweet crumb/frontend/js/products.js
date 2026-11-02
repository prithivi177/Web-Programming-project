// ====================================================================
// SWEET CRUMBS — PRODUCTS CATALOG SCRIPT (products.js)
// ====================================================================

let allProducts = [];
let currentCategory = 'All';
let currentSearch = '';
let currentSort = 'default';

// Determine API base URL dynamically
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
  setupEventListeners();
  loadAllProducts();
});

function setupEventListeners() {
  // Category tabs
  const filterTabs = document.getElementById('category-filter-tabs');
  if (filterTabs) {
    filterTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'All';
      applyFiltersAndRender();
    });
  }

  // Search input with debounce
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentSearch = e.target.value.trim().toLowerCase();
        applyFiltersAndRender();
      }, 250);
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndRender();
    });
  }
}

async function loadAllProducts() {
  const container = document.getElementById('products-catalog-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-3 text-muted">Fetching our latest treats from the oven...</p>
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
    } catch (parseErr) {
      data = null;
    }

    if (!response.ok || !data || !data.success || !Array.isArray(data.data)) {
      const serverMsg = (data && data.message) ? data.message : `HTTP ${response.status} ${response.statusText}`;
      const serverErr = (data && data.error) ? data.error : '';
      const detailedErr = serverErr ? `${serverMsg} — Reason: ${serverErr}` : serverMsg;
      throw new Error(detailedErr);
    }

    allProducts = data.data;
    applyFiltersAndRender();
  } catch (error) {
    console.error('Error loading products catalog:', error);
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-danger d-inline-block text-start rounded-4 p-4 shadow-sm" style="max-width: 640px;">
          <div class="d-flex align-items-center gap-2 mb-2 text-danger fw-bold fs-5">
            <i class="bi bi-exclamation-triangle-fill fs-3"></i>
            <span>Unable to Load Bakery Treats</span>
          </div>
          <p class="mb-2 text-dark">${escapeHtml(error.message)}</p>
          <div class="bg-white border rounded p-3 mt-3">
            <div class="small fw-bold text-secondary mb-1">To fix this issue:</div>
            <ol class="small text-muted mb-0 ps-3">
              <li>Ensure the Express server is running (<code>npm start</code>) at <a href="http://localhost:3000/products.html" class="text-decoration-underline" target="_blank">http://localhost:3000</a>.</li>
              <li>Refresh your page to load the fresh treats.</li>
            </ol>
          </div>
        </div>
      </div>
    `;
    updateCounter(0);
  }
}

function applyFiltersAndRender() {
  const container = document.getElementById('products-catalog-grid');
  if (!container) return;

  // Check if database has zero products seeded
  if (allProducts.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-cake2 text-warning fs-1"></i>
        <h4 class="mt-3 font-heading">No Treats Available Yet</h4>
        <p class="text-muted">The bakery products catalog currently has 0 items. Run <code>npm run setup-db</code> to re-seed the artisan collection.</p>
      </div>
    `;
    updateCounter(0);
    return;
  }

  let filtered = [...allProducts];

  // 1. Filter by category
  if (currentCategory !== 'All') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // 2. Filter by search query
  if (currentSearch) {
    filtered = filtered.filter(p =>
      (p.name && p.name.toLowerCase().includes(currentSearch)) ||
      (p.description && p.description.toLowerCase().includes(currentSearch)) ||
      (p.category && p.category.toLowerCase().includes(currentSearch))
    );
  }

  // 3. Sort
  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (currentSort === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  updateCounter(filtered.length);

  // 4. Render
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search text-warning fs-1"></i>
        <h4 class="mt-3 font-heading">No Treats Match Your Search</h4>
        <p class="text-muted">Try checking for typos or clear your search filter to see our full artisan menu.</p>
        <button class="btn btn-outline-bakery btn-sm rounded-pill" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => renderCatalogCard(product)).join('');
}

function renderCatalogCard(p) {
  const priceFormatted = Number(p.price).toFixed(2);
  const isAvailable = p.available == 1 || p.available === true;
  const availBadge = isAvailable
    ? '<span class="product-badge-availability product-badge-in-stock"><i class="bi bi-check-circle me-1"></i> In Stock</span>'
    : '<span class="product-badge-availability product-badge-out-of-stock"><i class="bi bi-x-circle me-1"></i> Sold Out</span>';

  const orderButton = isAvailable
    ? `<a href="order.html?product=${p.id}" class="btn btn-order-card"><i class="bi bi-bag-plus me-1"></i> Order Now</a>`
    : `<button class="btn btn-order-card" disabled>Sold Out</button>`;

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

function updateCounter(count) {
  const counterEl = document.getElementById('product-count');
  if (counterEl) {
    counterEl.textContent = count;
  }
}

function resetFilters() {
  currentCategory = 'All';
  currentSearch = '';
  currentSort = 'default';

  const searchInput = document.getElementById('product-search-input');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'default';

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === 'All');
  });

  applyFiltersAndRender();
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
