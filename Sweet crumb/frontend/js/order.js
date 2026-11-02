// ====================================================================
// SWEET CRUMBS — CUSTOMER ORDER FORM SCRIPT (order.js)
// ====================================================================

let productsCache = [];
let selectedProduct = null;

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
  setupDateRestrictions();
  setupFulfilmentToggle();
  setupFormListeners();
  loadProductsDropdown();
});

// Restrict delivery date picker to today or future dates
function setupDateRestrictions() {
  const dateInput = document.getElementById('order_date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    updateSummary();
  }
}

// Toggle delivery address visibility and required attribute
function setupFulfilmentToggle() {
  const pickupRadio = document.getElementById('type-pickup');
  const deliveryRadio = document.getElementById('type-delivery');
  const addressGroup = document.getElementById('delivery-address-group');
  const addressInput = document.getElementById('delivery_address');

  function updateFulfilment() {
    if (deliveryRadio.checked) {
      addressGroup.classList.remove('d-none');
      addressInput.setAttribute('required', 'required');
    } else {
      addressGroup.classList.add('d-none');
      addressInput.removeAttribute('required');
      addressInput.value = '';
    }
    updateSummary();
  }

  if (pickupRadio && deliveryRadio) {
    pickupRadio.addEventListener('change', updateFulfilment);
    deliveryRadio.addEventListener('change', updateFulfilment);
  }
}

// Setup change listeners for live price & summary recalculation
function setupFormListeners() {
  const productSelect = document.getElementById('product_id');
  const qtyInput = document.getElementById('quantity');
  const dateInput = document.getElementById('order_date');

  if (productSelect) {
    productSelect.addEventListener('change', () => {
      const pId = parseInt(productSelect.value, 10);
      selectedProduct = productsCache.find(p => p.id === pId) || null;
      updateSummary();
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener('input', updateSummary);
  }

  if (dateInput) {
    dateInput.addEventListener('change', updateSummary);
  }

  const orderForm = document.getElementById('bakery-order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmit);
  }
}

// Load products from MySQL backend API
async function loadProductsDropdown() {
  const select = document.getElementById('product_id');
  if (!select) return;

  select.innerHTML = '<option value="" disabled selected>Loading bakery delights...</option>';

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
      const serverMsg = (data && data.message) ? data.message : `HTTP ${response.status}`;
      const serverErr = (data && data.error) ? ` (${data.error})` : '';
      throw new Error(`${serverMsg}${serverErr}`);
    }

    productsCache = data.data;

    if (productsCache.length === 0) {
      select.innerHTML = '<option value="" disabled selected>No products found in database (run npm run setup-db)</option>';
      showAlert('warning', 'No products found in database. Please run <code>npm run setup-db</code> to initialize sample treats.');
      return;
    }

    select.innerHTML = '<option value="" disabled selected>— Choose your bakery delight —</option>';
    productsCache.forEach(p => {
      const isAvail = p.available == 1 || p.available === true;
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = `${p.name} (₹${Number(p.price).toFixed(2)}) ${isAvail ? '' : '[SOLD OUT]'}`;
      if (!isAvail) option.disabled = true;
      select.appendChild(option);
    });

    // Check URL parameters for preselected product
    const urlParams = new URLSearchParams(window.location.search);
    const prefillId = parseInt(urlParams.get('product'), 10);
    if (prefillId) {
      const match = productsCache.find(p => p.id === prefillId);
      if (match && (match.available == 1 || match.available === true)) {
        select.value = prefillId;
        selectedProduct = match;
        updateSummary();
      }
    }
  } catch (error) {
    console.error('Error populating product dropdown:', error);
    select.innerHTML = '<option value="" disabled selected>Error loading menu. Please check backend server.</option>';
    showAlert('danger', `<strong>Unable to load products:</strong> ${escapeHtml(error.message)}. Please ensure the backend server is running.`);
  }
}

// Real-time Order Summary Update
function updateSummary() {
  const summaryImg = document.getElementById('summary-img');
  const summaryName = document.getElementById('summary-name');
  const summaryCat = document.getElementById('summary-category');
  const summaryUnitPrice = document.getElementById('summary-unit-price');
  const summaryQty = document.getElementById('summary-qty');
  const summaryFulfilment = document.getElementById('summary-fulfilment');
  const summaryDate = document.getElementById('summary-date');
  const summaryTotal = document.getElementById('summary-total-amount');

  const qtyInput = document.getElementById('quantity');
  let qty = parseInt(qtyInput ? qtyInput.value : 1, 10);
  if (isNaN(qty) || qty < 1) qty = 1;

  const dateInput = document.getElementById('order_date');
  const deliveryRadio = document.getElementById('type-delivery');

  if (selectedProduct) {
    summaryImg.src = selectedProduct.image_url;
    summaryName.textContent = selectedProduct.name;
    summaryCat.textContent = `Category: ${selectedProduct.category}`;
    summaryUnitPrice.textContent = `₹${Number(selectedProduct.price).toFixed(2)} each`;

    const total = Number(selectedProduct.price) * qty;
    summaryTotal.textContent = `₹${total.toFixed(2)}`;
  } else {
    summaryImg.src = 'assets/images/cake-chocolate.svg';
    summaryName.textContent = 'Select a delicacy';
    summaryCat.textContent = 'Category: —';
    summaryUnitPrice.textContent = '₹0.00 each';
    summaryTotal.textContent = '₹0.00';
  }

  summaryQty.textContent = qty;
  summaryDate.textContent = dateInput && dateInput.value ? dateInput.value : '—';

  if (deliveryRadio && deliveryRadio.checked) {
    summaryFulfilment.textContent = 'Doorstep Delivery';
    summaryFulfilment.className = 'fw-semibold text-primary';
  } else {
    summaryFulfilment.textContent = 'Store Pickup (Free)';
    summaryFulfilment.className = 'fw-semibold text-success';
  }
}

// Order Form Submission Handler
async function handleOrderSubmit(e) {
  e.preventDefault();
  const form = e.target;

  // HTML5 Form Validation
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    return;
  }

  const submitBtn = document.getElementById('submit-order-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');

  // Prevent accidental duplicate submission
  submitBtn.disabled = true;
  btnText.classList.add('d-none');
  btnSpinner.classList.remove('d-none');
  hideAlert();

  const formData = {
    customer_name: document.getElementById('customer_name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    product_id: parseInt(document.getElementById('product_id').value, 10),
    quantity: parseInt(document.getElementById('quantity').value, 10),
    order_date: document.getElementById('order_date').value,
    fulfilment_type: document.querySelector('input[name="fulfilment_type"]:checked').value,
    delivery_address: document.getElementById('delivery_address').value.trim(),
    additional_instructions: document.getElementById('additional_instructions').value.trim()
  };

  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    let result;
    try {
      result = await response.json();
    } catch (e) {
      result = null;
    }

    if (!response.ok || !result || !result.success) {
      const msg = (result && (result.message || result.error)) ? result.message : `HTTP ${response.status} failed`;
      throw new Error(msg);
    }

    // Success: Populate and show confirmation modal
    const orderData = result.data;
    document.getElementById('modal-order-ref').textContent = orderData.order_reference;
    document.getElementById('modal-customer-name').textContent = orderData.customer_name;
    document.getElementById('modal-product-name').textContent = `${orderData.product_name} (x${orderData.quantity})`;
    document.getElementById('modal-total-amount').textContent = `₹${Number(orderData.total_amount).toFixed(2)}`;
    document.getElementById('modal-fulfilment').textContent = `${orderData.fulfilment_type} on ${orderData.order_date}`;

    const modal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
    modal.show();

  } catch (error) {
    console.error('Order submission error:', error);
    showAlert('danger', `<strong>Order Failed:</strong> ${escapeHtml(error.message)}`);
  } finally {
    submitBtn.disabled = false;
    btnText.classList.remove('d-none');
    btnSpinner.classList.add('d-none');
  }
}

function resetOrderForm() {
  const form = document.getElementById('bakery-order-form');
  if (form) {
    form.reset();
    form.classList.remove('was-validated');
  }
  selectedProduct = null;
  setupDateRestrictions();
  setupFulfilmentToggle();
  updateSummary();
}

function showAlert(type, message) {
  const box = document.getElementById('order-alert-box');
  if (!box) return;
  box.className = `alert alert-${type} alert-dismissible fade show rounded-4 shadow-sm mb-4`;
  box.innerHTML = `
    <div>${message}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
}

function hideAlert() {
  const box = document.getElementById('order-alert-box');
  if (box) box.className = 'd-none';
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
