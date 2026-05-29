// ========================================
// SERVICE PROVIDER REGISTRATION MODULE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initializeProviderRegistration();
});

function initializeProviderRegistration() {
  const form = document.getElementById('providerRegistrationForm');

  if (form) {
    form.addEventListener('submit', handleProviderRegistration);
    setupFileUploads();
    setupFormValidation();
  }
}

// ========================================
// FILE UPLOAD HANDLING
// ========================================

function setupFileUploads() {
  const fileInputs = document.querySelectorAll('input[type="file"]');

  fileInputs.forEach(input => {
    input.addEventListener('change', function() {
      const fileUpload = this.closest('.file-upload');
      const fileName = this.files[0]?.name || '';

      if (fileName) {
        fileUpload.querySelector('.file-upload-text').textContent = `✓ ${fileName} uploaded`;
        fileUpload.style.borderColor = 'var(--secondary)';
        fileUpload.style.backgroundColor = '#d1fae5';
      }
    });
  });
}

// ========================================
// FORM VALIDATION
// ========================================

function setupFormValidation() {
  const form = document.getElementById('providerRegistrationForm');
  const inputs = form.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    input.addEventListener('change', updateProgress);
  });
}

function updateProgress() {
  const form = document.getElementById('providerRegistrationForm');
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  const filledInputs = Array.from(inputs).filter(input => {
    if (input.type === 'checkbox') {
      return input.checked;
    }
    return input.value.trim() !== '';
  });

  const progress = (filledInputs.length / inputs.length) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
}

// ========================================
// FORM SUBMISSION
// ========================================

function handleProviderRegistration(e) {
  e.preventDefault();

  const form = document.getElementById('providerRegistrationForm');
  const errorElement = document.getElementById('errorMessage');
  const successElement = document.getElementById('successMessage');

  // Validate form
  const validation = validateProviderForm(form);

  if (!validation.isValid) {
    errorElement.textContent = validation.message;
    errorElement.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Hide error message
  errorElement.classList.remove('show');

  // Collect form data
  const formData = new FormData(form);
  const providerData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    dob: formData.get('dob'),
    gender: formData.get('gender'),
    category: formData.get('category'),
    title: formData.get('title'),
    experience: formData.get('experience'),
    bio: formData.get('bio'),
    certifications: formData.get('certifications'),
    rate: formData.get('rate'),
    street: formData.get('street'),
    city: formData.get('city'),
    state: formData.get('state'),
    postal: formData.get('postal'),
    bankName: formData.get('bankName'),
    accountNumber: formData.get('accountNumber'),
    accountHolder: formData.get('accountHolder'),
    registrationDate: new Date().toISOString(),
    status: 'pending_verification',
    verified: false
  };

  // Save to localStorage
  saveProviderRegistration(providerData);

  // Show success message
  form.style.display = 'none';
  successElement.classList.add('show');

  // Log for backend integration
  console.log('Provider Registration:', providerData);
}

// ========================================
// VALIDATION LOGIC
// ========================================

function validateProviderForm(form) {
  const email = form.querySelector('input[name="email"]').value;
  const phone = form.querySelector('input[name="phone"]').value;
  const rate = form.querySelector('input[name="rate"]').value;
  const accountNumber = form.querySelector('input[name="accountNumber"]').value;
  const terms = form.querySelector('input[name="terms"]').checked;
  const privacy = form.querySelector('input[name="privacy"]').checked;
  const background = form.querySelector('input[name="background"]').checked;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }

  // Phone validation
  const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number.' };
  }

  // Rate validation
  if (rate <= 0) {
    return { isValid: false, message: 'Please enter a valid hourly rate.' };
  }

  // Account number validation
  if (accountNumber.length < 10) {
    return { isValid: false, message: 'Please enter a valid account number.' };
  }

  // Terms validation
  if (!terms || !privacy || !background) {
    return { isValid: false, message: 'Please accept all terms and conditions.' };
  }

  return { isValid: true };
}

// ========================================
// LOCAL STORAGE FUNCTIONS
// ========================================

function saveProviderRegistration(providerData) {
  let providers = JSON.parse(localStorage.getItem('provider_registrations')) || [];
  
  // Check if email already exists
  const existingProvider = providers.find(p => p.email === providerData.email);
  if (existingProvider) {
    console.warn('Provider with this email already exists');
    return false;
  }

  providers.push(providerData);
  localStorage.setItem('provider_registrations', JSON.stringify(providers));
  return true;
}

function getProviderRegistrations() {
  return JSON.parse(localStorage.getItem('provider_registrations')) || [];
}

function getProviderByEmail(email) {
  const providers = getProviderRegistrations();
  return providers.find(p => p.email === email);
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

window.ProviderRegistration = {
  saveRegistration: saveProviderRegistration,
  getRegistrations: getProviderRegistrations,
  getByEmail: getProviderByEmail,
  validateForm: validateProviderForm
};

document.getElementById("providerRegistrationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // optional: collect basic data
  const formData = new FormData(this);

  const user = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    category: formData.get("category"),
    title: formData.get("title")
  };

  // save temporarily (frontend demo)
  localStorage.setItem("providerRegistered", "true");
  localStorage.setItem("providerData", JSON.stringify(user));

  // show success UI
  document.getElementById("successMessage").style.display = "block";
  document.getElementById("providerRegistrationForm").style.display = "none";

  // redirect after delay
  setTimeout(() => {
    window.location.href = "login.html"; 
    // OR use dashboard directly:
    // window.location.href = "provider-dashboard.html";
  }, 3000);

});
