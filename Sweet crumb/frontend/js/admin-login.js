// ====================================================================
// SWEET CRUMBS — ADMIN LOGIN SCRIPT (admin-login.js)
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
  checkExistingSession();

  const form = document.getElementById('admin-login-form');
  if (form) {
    form.addEventListener('submit', handleLoginSubmit);
  }
});

// If already logged in, redirect directly to dashboard
async function checkExistingSession() {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/admin/me`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.authenticated) {
        window.location.replace('admin-dashboard.html');
      }
    }
  } catch (e) {
    // Session not active, stay on login page
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showAlert('danger', 'Please enter both username and password.');
    return;
  }

  const submitBtn = document.getElementById('login-submit-btn');
  const btnText = document.getElementById('login-btn-text');
  const btnSpinner = document.getElementById('login-btn-spinner');

  submitBtn.disabled = true;
  btnText.classList.add('d-none');
  btnSpinner.classList.remove('d-none');
  hideAlert();

  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    let result;
    try {
      result = await response.json();
    } catch (e) {
      result = null;
    }

    if (!response.ok || !result || !result.success) {
      const errMsg = (result && (result.message || result.error)) ? result.message : `HTTP ${response.status} Authentication failed`;
      throw new Error(errMsg);
    }

    // Success: Redirect to dashboard
    showAlert('success', 'Authentication successful. Redirecting to Bakery Management Suite...');
    setTimeout(() => {
      window.location.replace('admin-dashboard.html');
    }, 600);

  } catch (error) {
    console.error('Login error:', error);
    showAlert('danger', error.message || 'Login failed. Please check credentials or database status.');
  } finally {
    submitBtn.disabled = false;
    btnText.classList.remove('d-none');
    btnSpinner.classList.add('d-none');
  }
}

function showAlert(type, message) {
  const box = document.getElementById('login-alert-box');
  if (!box) return;
  box.className = `alert alert-${type} py-2 mb-3 rounded-3 small`;
  box.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i> ${escapeHtml(message)}`;
}

function hideAlert() {
  const box = document.getElementById('login-alert-box');
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
