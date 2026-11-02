// ====================================================================
// SWEET CRUMBS — ADMIN DASHBOARD CONTROLLER (admin-dashboard.js)
// ====================================================================

let currentViewingOrderId = null;
let currentProducts = [];

function getApiBaseUrl() {
  if (window.location.protocol === 'file:') {
    return 'http://localhost:3000';
  }
  if (window.location.port && window.location.port !== '3000') {
    return 'http://localhost:3000';
  }
  return '';
}

async function authFetch(endpoint, options = {}) {
  const apiBase = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint}`;
  const mergedOptions = {
    ...options,
    credentials: 'include'
  };
  return fetch(url, mergedOptions);
}

document.addEventListener('DOMContentLoaded', async () => {
  const isAuth = await verifySession();
  if (!isAuth) return;

  setupNavigation();
  setupEventListeners();
  loadDashboardData();
});

// Verify server-side session authentication
async function verifySession() {
  try {
    const res = await authFetch('/api/admin/me');
    if (!res.ok) {
      window.location.replace('admin-login.html');
      return false;
    }
    const data = await res.json();
    if (!data.success || !data.authenticated) {
      window.location.replace('admin-login.html');
      return false;
    }

    const badge = document.getElementById('admin-username-badge');
    if (badge && data.admin) {
      badge.textContent = data.admin.username;
    }
    return true;
  } catch (err) {
    console.error('Session verification failed:', err);
    window.location.replace('admin-login.html');
    return false;
  }
}

// Setup Tab Switching & Mobile Sidebar
function setupNavigation() {
  const tabLinks = document.querySelectorAll('.nav-tab-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = link.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

function switchTab(tabName) {
  // Update nav links
  document.querySelectorAll('.nav-tab-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-tab') === tabName);
  });

  // Update sections
  document.querySelectorAll('.tab-content-section').forEach(sec => {
    sec.classList.add('d-none');
  });

  const activeSec = document.getElementById(`tab-${tabName}`);
  if (activeSec) {
    activeSec.classList.remove('d-none');
  }

  // Update header text
  const titleEl = document.getElementById('page-title-text');
  const titles = {
    overview: 'Bakery Overview & Statistics',
    orders: 'Customer Orders Management',
    products: 'Bakery Menu & Catalog Management',
    enquiries: 'Customer Inquiries & Messages'
  };
  if (titleEl) titleEl.textContent = titles[tabName] || 'Admin Dashboard';

  // Lazy-load data based on tab
  if (tabName === 'overview') loadDashboardStats();
  if (tabName === 'orders') loadAdminOrders();
  if (tabName === 'products') loadAdminProducts();
  if (tabName === 'enquiries') loadAdminEnquiries();
}

function setupEventListeners() {
  // Orders toolbar
  const orderSearch = document.getElementById('order-search-input');
  const orderStatus = document.getElementById('order-status-filter');
  if (orderSearch) {
    let timer;
    orderSearch.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(loadAdminOrders, 300);
    });
  }
  if (orderStatus) {
    orderStatus.addEventListener('change', loadAdminOrders);
  }

  // Add Product Form
  const addForm = document.getElementById('add-product-form');
  if (addForm) {
    addForm.addEventListener('submit', handleAddProduct);
  }

  // Edit Product Form
  const editForm = document.getElementById('edit-product-form');
  if (editForm) {
    editForm.addEventListener('submit', handleEditProduct);
  }

  // Modal Status Update Button
  const saveStatusBtn = document.getElementById('modal-save-status-btn');
  if (saveStatusBtn) {
    saveStatusBtn.addEventListener('click', handleModalStatusSave);
  }
}

// Initial Data Load
function loadDashboardData() {
  loadDashboardStats();
}

// --------------------------------------------------------------------
// STATS & OVERVIEW
// --------------------------------------------------------------------
async function loadDashboardStats() {
  try {
    const res = await authFetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to load stats');
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const s = data.stats;
    document.getElementById('stat-total-orders').textContent = s.totalOrders;
    document.getElementById('stat-pending-orders').textContent = s.pendingOrders;
    document.getElementById('stat-total-products').textContent = s.totalProducts;
    document.getElementById('stat-total-revenue').textContent = `₹${s.totalRevenue}`;

    // Render recent orders
    const tableBody = document.getElementById('recent-orders-table-body');
    if (tableBody) {
      if (!s.recentOrders || s.recentOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No orders placed yet.</td></tr>';
      } else {
        tableBody.innerHTML = s.recentOrders.map(o => `
          <tr>
            <td><span class="font-monospace fw-semibold text-primary">${escapeHtml(o.order_reference)}</span></td>
            <td>${escapeHtml(o.customer_name)}</td>
            <td>₹${Number(o.total_amount).toFixed(2)}</td>
            <td><span class="badge-status badge-${o.status}">${o.status}</span></td>
            <td>${new Date(o.created_at).toLocaleDateString()}</td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Error loading admin stats:', err);
  }
}

// --------------------------------------------------------------------
// ORDERS MANAGEMENT
// --------------------------------------------------------------------
async function loadAdminOrders() {
  const tableBody = document.getElementById('orders-table-body');
  if (!tableBody) return;

  const search = document.getElementById('order-search-input')?.value.trim() || '';
  const status = document.getElementById('order-status-filter')?.value || 'All';

  tableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading orders...</td></tr>';

  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== 'All') params.append('status', status);

    const res = await authFetch(`/api/admin/orders?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();

    if (!data.success || !data.data || data.data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No orders found matching criteria.</td></tr>';
      return;
    }

    tableBody.innerHTML = data.data.map(o => `
      <tr>
        <td>
          <span class="font-monospace fw-bold text-primary">${escapeHtml(o.order_reference)}</span><br>
          <small class="text-muted">${new Date(o.created_at).toLocaleDateString()}</small>
        </td>
        <td>
          <strong>${escapeHtml(o.customer_name)}</strong><br>
          <small class="text-muted"><i class="bi bi-telephone"></i> ${escapeHtml(o.phone)}</small>
        </td>
        <td>
          <span class="fw-semibold">${o.order_date ? new Date(o.order_date).toISOString().split('T')[0] : '—'}</span><br>
          <small class="badge bg-light text-dark border">${o.fulfilment_type}</small>
        </td>
        <td style="max-width: 200px;">
          <small class="text-truncate d-block">${escapeHtml(o.item_summary || 'No items')}</small>
        </td>
        <td>
          <span class="fw-bold">₹${Number(o.total_amount).toFixed(2)}</span>
        </td>
        <td>
          <span class="badge-status badge-${o.status}">${o.status}</span>
        </td>
        <td>
          <button class="btn btn-outline-bakery btn-sm rounded-pill px-3" onclick="viewOrderDetails(${o.id})">
            <i class="bi bi-eye me-1"></i> Details
          </button>
        </td>
      </tr>
    `).join('');

  } catch (err) {
    console.error('Error fetching admin orders:', err);
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">${err.message}</td></tr>`;
  }
}

async function viewOrderDetails(orderId) {
  currentViewingOrderId = orderId;
  try {
    const res = await authFetch(`/api/admin/orders/${orderId}`);
    if (!res.ok) throw new Error('Could not fetch order');
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const o = data.data;
    document.getElementById('view-order-ref').textContent = o.order_reference;
    document.getElementById('view-customer-name').textContent = o.customer_name;
    document.getElementById('view-customer-phone').textContent = o.phone;
    document.getElementById('view-customer-email').textContent = o.email || 'None';
    document.getElementById('view-order-date').textContent = o.order_date ? new Date(o.order_date).toISOString().split('T')[0] : '—';
    document.getElementById('view-fulfilment-type').textContent = o.fulfilment_type;
    document.getElementById('view-delivery-address').textContent = o.delivery_address || 'N/A (Store Pickup)';
    document.getElementById('view-order-instructions').textContent = o.additional_instructions || 'None provided';
    document.getElementById('view-order-total').textContent = `₹${Number(o.total_amount).toFixed(2)}`;
    document.getElementById('modal-update-status-select').value = o.status;

    // Order items
    const itemsBody = document.getElementById('view-order-items-body');
    if (itemsBody) {
      itemsBody.innerHTML = (o.items || []).map(item => `
        <tr>
          <td><strong>${escapeHtml(item.product_name)}</strong></td>
          <td>₹${Number(item.unit_price).toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>₹${Number(item.subtotal).toFixed(2)}</td>
        </tr>
      `).join('');
    }

    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
  } catch (err) {
    showDashboardAlert('danger', err.message);
  }
}

async function handleModalStatusSave() {
  if (!currentViewingOrderId) return;
  const newStatus = document.getElementById('modal-update-status-select').value;

  try {
    const res = await authFetch(`/api/admin/orders/${currentViewingOrderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Status update failed');

    // Close modal
    const modalEl = document.getElementById('orderDetailsModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    showDashboardAlert('success', `Order status updated to "${newStatus}".`);
    loadAdminOrders();
    loadDashboardStats();
  } catch (err) {
    showDashboardAlert('danger', err.message);
  }
}

// --------------------------------------------------------------------
// PRODUCTS CRUD
// --------------------------------------------------------------------
async function loadAdminProducts() {
  const tableBody = document.getElementById('admin-products-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading menu...</td></tr>';

  try {
    const res = await authFetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    currentProducts = data.data || [];

    if (currentProducts.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No bakery products in database.</td></tr>';
      return;
    }

    tableBody.innerHTML = currentProducts.map(p => {
      const isAvail = p.available == 1 || p.available === true;
      return `
        <tr>
          <td>
            <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" class="product-thumb" onerror="this.src='assets/images/cake-chocolate.svg'">
          </td>
          <td>
            <strong>${escapeHtml(p.name)}</strong><br>
            <small class="text-muted text-truncate d-inline-block" style="max-width: 250px;">${escapeHtml(p.description)}</small>
          </td>
          <td><span class="badge bg-light text-dark border">${escapeHtml(p.category)}</span></td>
          <td><strong>₹${Number(p.price).toFixed(2)}</strong></td>
          <td>
            <button class="btn btn-sm ${isAvail ? 'btn-success' : 'btn-secondary'} rounded-pill px-3 py-1" onclick="toggleProductAvailability(${p.id}, ${isAvail ? 0 : 1})">
              ${isAvail ? '<i class="bi bi-check-circle me-1"></i> Available' : '<i class="bi bi-x-circle me-1"></i> Sold Out'}
            </button>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary" onclick="openEditProductModal(${p.id})"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-outline-danger" onclick="deleteProduct(${p.id}, '${escapeHtml(p.name)}')"><i class="bi bi-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error('Error loading products for admin:', err);
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-danger">${err.message}</td></tr>`;
  }
}

async function handleAddProduct(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const payload = {
    name: formData.get('name').trim(),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    description: formData.get('description').trim(),
    image_url: formData.get('image_url') ? formData.get('image_url').trim() : 'assets/images/cake-chocolate.svg',
    available: formData.get('available') !== null
  };

  try {
    const res = await authFetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Creation failed');

    // Close modal
    const modalEl = document.getElementById('addProductModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
    form.reset();

    showDashboardAlert('success', `Product "${payload.name}" created successfully.`);
    loadAdminProducts();
    loadDashboardStats();
  } catch (err) {
    showDashboardAlert('danger', err.message);
  }
}

function openEditProductModal(productId) {
  const p = currentProducts.find(item => item.id === productId);
  if (!p) return;

  document.getElementById('edit-p-id').value = p.id;
  document.getElementById('edit-p-name').value = p.name;
  document.getElementById('edit-p-category').value = p.category;
  document.getElementById('edit-p-price').value = p.price;
  document.getElementById('edit-p-desc').value = p.description;
  document.getElementById('edit-p-img').value = p.image_url;
  document.getElementById('edit-p-available').checked = (p.available == 1 || p.available === true);

  const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
  modal.show();
}

async function handleEditProduct(e) {
  e.preventDefault();
  const id = document.getElementById('edit-p-id').value;

  const payload = {
    name: document.getElementById('edit-p-name').value.trim(),
    category: document.getElementById('edit-p-category').value,
    price: parseFloat(document.getElementById('edit-p-price').value),
    description: document.getElementById('edit-p-desc').value.trim(),
    image_url: document.getElementById('edit-p-img').value.trim(),
    available: document.getElementById('edit-p-available').checked
  };

  try {
    const res = await authFetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Update failed');

    const modalEl = document.getElementById('editProductModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    showDashboardAlert('success', `Product "${payload.name}" updated successfully.`);
    loadAdminProducts();
  } catch (err) {
    showDashboardAlert('danger', err.message);
  }
}

async function toggleProductAvailability(productId, newAvailability) {
  try {
    const res = await authFetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: newAvailability === 1 })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Update failed');

    loadAdminProducts();
  } catch (err) {
    showDashboardAlert('danger', err.message);
  }
}

async function deleteProduct(productId, productName) {
  if (!confirm(`Are you sure you want to delete product "${productName}"?`)) return;

  try {
    const res = await authFetch(`/api/admin/products/${productId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Delete failed');

    showDashboardAlert('success', data.message || `Product "${productName}" removed.`);
    loadAdminProducts();
    loadDashboardStats();
  } catch (err) {
    showDashboardAlert('danger', err.message);
  }
}

// --------------------------------------------------------------------
// ENQUIRIES MANAGEMENT
// --------------------------------------------------------------------
async function loadAdminEnquiries() {
  const tableBody = document.getElementById('enquiries-table-body');
  if (!tableBody) return;

  const status = document.getElementById('enquiry-status-filter')?.value || 'All';
  tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading inquiries...</td></tr>';

  try {
    const params = new URLSearchParams();
    if (status !== 'All') params.append('status', status);

    const res = await authFetch(`/api/admin/enquiries?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load inquiries');
    const data = await res.json();

    if (!data.success || !data.data || data.data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No customer inquiries found.</td></tr>';
      return;
    }

    tableBody.innerHTML = data.data.map(enq => `
      <tr>
        <td>#${enq.id}</td>
        <td>
          <strong>${escapeHtml(enq.name)}</strong><br>
          <small class="text-muted">${escapeHtml(enq.email)}</small>
        </td>
        <td><strong>${escapeHtml(enq.subject)}</strong></td>
        <td style="max-width: 320px;">
          <small class="text-muted d-block">${escapeHtml(enq.message)}</small>
        </td>
        <td>
          <span class="badge-status badge-${enq.status}">${enq.status}</span>
        </td>
        <td>
          ${enq.status === 'Pending'
            ? `<button class="btn btn-success btn-sm rounded-pill px-3" onclick="updateEnquiryStatus(${enq.id}, 'Resolved')"><i class="bi bi-check-lg me-1"></i> Resolve</button>`
            : `<button class="btn btn-outline-secondary btn-sm rounded-pill px-3" onclick="updateEnquiryStatus(${enq.id}, 'Pending')">Reopen</button>`}
        </td>
      </tr>
    `).join('');

  } catch (err) {
    console.error('Error fetching admin enquiries:', err);
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-danger">${err.message}</td></tr>`;
  }
}

async function updateEnquiryStatus(enquiryId, newStatus) {
  try {
    const res = await authFetch(`/api/admin/enquiries/${enquiryId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update enquiry status');

    showDashboardAlert('success', `Inquiry #${enquiryId} marked as ${newStatus}.`);
    loadAdminEnquiries();
  } catch (err) {
    showDashboardAlert('danger', err.message);
  }
}

// --------------------------------------------------------------------
// LOGOUT
// --------------------------------------------------------------------
async function handleLogout() {
  try {
    await authFetch('/api/admin/logout', { method: 'POST' });
  } catch (e) {
    // Ignore errors during logout
  }
  window.location.replace('admin-login.html');
}

// --------------------------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------------------------
function showDashboardAlert(type, message) {
  const box = document.getElementById('dashboard-alert-box');
  if (!box) return;
  box.className = `alert alert-${type} alert-dismissible fade show rounded-3 shadow-sm mb-4`;
  box.innerHTML = `
    <div>${message}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
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
