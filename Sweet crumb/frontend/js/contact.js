// ====================================================================
// SWEET CRUMBS — CONTACT FORM SCRIPT (contact.js)
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
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
});

async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;

  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    return;
  }

  const submitBtn = document.getElementById('contact-submit-btn');
  const btnText = document.getElementById('contact-btn-text');
  const btnSpinner = document.getElementById('contact-btn-spinner');

  submitBtn.disabled = true;
  btnText.classList.add('d-none');
  btnSpinner.classList.remove('d-none');
  hideAlert();

  const payload = {
    name: document.getElementById('contact-name').value.trim(),
    email: document.getElementById('contact-email').value.trim(),
    subject: document.getElementById('contact-subject').value.trim(),
    message: document.getElementById('contact-message').value.trim()
  };

  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/api/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    let result;
    try {
      result = await response.json();
    } catch (e) {
      result = null;
    }

    // Verification check: Only display success when the backend explicitly confirms DB record saved
    if (!response.ok || !result || !result.success) {
      const errMsg = (result && (result.message || result.error)) ? result.message : `HTTP ${response.status} failed`;
      throw new Error(errMsg);
    }

    // Success confirmed by backend
    showAlert('success', `
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-check-circle-fill fs-4 text-success"></i>
        <div>
          <strong>Message Received!</strong> Reference #${result.enquiry_id || ''}.
          ${escapeHtml(result.message)}
        </div>
      </div>
    `);

    form.reset();
    form.classList.remove('was-validated');

  } catch (error) {
    console.error('Contact submission error:', error);
    showAlert('danger', `
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill fs-4 text-danger"></i>
        <div>
          <strong>Submission Failed:</strong> ${escapeHtml(error.message)}
        </div>
      </div>
    `);
  } finally {
    submitBtn.disabled = false;
    btnText.classList.remove('d-none');
    btnSpinner.classList.add('d-none');
  }
}

function showAlert(type, htmlContent) {
  const box = document.getElementById('contact-alert-box');
  if (!box) return;
  box.className = `alert alert-${type} alert-dismissible fade show rounded-4 shadow-sm mb-4`;
  box.innerHTML = `
    <div>${htmlContent}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
}

function hideAlert() {
  const box = document.getElementById('contact-alert-box');
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
