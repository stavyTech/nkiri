// ========================================
// SERVICE SEEKER REGISTRATION MODULE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initializeSeekerRegistration();
});

function initializeSeekerRegistration() {
  const form = document.getElementById('seekerRegistrationForm');

  if (form) {
    form.addEventListener('submit', handleSeekerRegistration);
    setupPasswordValidation();
  }
}

// ========================================
// PASSWORD VALIDATION
// ========================================

function setupPasswordValidation() {
  const passwordInput = document.querySelector('input[name="password"]');
  const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');

  if (passwordInput && confirmPasswordInput) {
    confirmPasswordInput.addEventListener('blur', function() {
      if (this.value && passwordInput.value !== this.value) {
        this.style.borderColor = '#ef4444';
      } else {
        this.style.borderColor = 'var(--gray-300)';
      }
    });
  }
}

// ========================================
// FORM SUBMISSION
// ========================================

function handleSeekerRegistration(e) {
  e.preventDefault();

  const form = document.getElementById('seekerRegistrationForm');
  const errorElement = document.getElementById('errorMessage');
  const successElement = document.getElementById('successMessage');

  // Validate form
  const validation = validateSeekerForm(form);

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
  const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(el => el.value);

  const seekerData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    dob: formData.get('dob'),
    gender: formData.get('gender'),
    street: formData.get('street'),
    city: formData.get('city'),
    state: formData.get('state'),
    postal: formData.get('postal'),
    accountType: formData.get('accountType'),
    interests: interests,
    source: formData.get('source'),
    newsletter: document.querySelector('input[name="newsletter"]').checked,
    registrationDate: new Date().toISOString(),
    verified: false,
    status: 'active'
  };

  // Save to localStorage
  saveSeekerRegistration(seekerData);

  // Show success message
  form.style.display = 'none';
  successElement.classList.add('show');

  // Log for backend integration
  console.log('Seeker Registration:', seekerData);
}

// ========================================
// VALIDATION LOGIC
// ========================================

function validateSeekerForm(form) {
  const firstName = form.querySelector('input[name="firstName"]').value;
  const lastName = form.querySelector('input[name="lastName"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const phone = form.querySelector('input[name="phone"]').value;
  const street = form.querySelector('input[name="street"]').value;
  const city = form.querySelector('input[name="city"]').value;
  const state = form.querySelector('input[name="state"]').value;
  const password = form.querySelector('input[name="password"]').value;
  const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;
  const accountType = form.querySelector('select[name="accountType"]').value;
  const terms = form.querySelector('input[name="terms"]').checked;
  const privacy = form.querySelector('input[name="privacy"]').checked;

  // Required fields
  if (!firstName || !lastName || !email || !phone || !street || !city || !state) {
    return { isValid: false, message: 'Please fill in all required fields.' };
  }

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

  // Password validation
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match.' };
  }

  // Account type validation
  if (!accountType) {
    return { isValid: false, message: 'Please select an account type.' };
  }

  // Terms validation
  if (!terms || !privacy) {
    return { isValid: false, message: 'Please accept all terms and conditions.' };
  }

  // Check if email already exists
  const existingSeeker = getSeekerByEmail(email);
  if (existingSeeker) {
    return { isValid: false, message: 'An account with this email already exists.' };
  }

  return { isValid: true };
}

// ========================================
// LOCAL STORAGE FUNCTIONS
// ========================================

function saveSeekerRegistration(seekerData) {
  let seekers = JSON.parse(localStorage.getItem('seeker_registrations')) || [];
  
  // Check if email already exists
  const existingSeeker = seekers.find(s => s.email === seekerData.email);
  if (existingSeeker) {
    console.warn('Seeker with this email already exists');
    return false;
  }

  seekers.push(seekerData);
  localStorage.setItem('seeker_registrations', JSON.stringify(seekers));
  return true;
}

function getSeekerRegistrations() {
  return JSON.parse(localStorage.getItem('seeker_registrations')) || [];
}

function getSeekerByEmail(email) {
  const seekers = getSeekerRegistrations();
  return seekers.find(s => s.email === email);
}

function updateSeekerProfile(email, updates) {
  let seekers = getSeekerRegistrations();
  const index = seekers.findIndex(s => s.email === email);

  if (index !== -1) {
    seekers[index] = { ...seekers[index], ...updates };
    localStorage.setItem('seeker_registrations', JSON.stringify(seekers));
    return true;
  }

  return false;
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

window.SeekerRegistration = {
  saveRegistration: saveSeekerRegistration,
  getRegistrations: getSeekerRegistrations,
  getByEmail: getSeekerByEmail,
  updateProfile: updateSeekerProfile,
  validateForm: validateSeekerForm
};
