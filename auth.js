
// Authentication functionality
console.log("Authentication system loaded");

// Form switching functions
function switchToSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('forgot-form').classList.add('hidden');
    clearErrors();
}

function switchToLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('forgot-form').classList.add('hidden');
    clearErrors();
}

function showForgotPassword() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('forgot-form').classList.remove('hidden');
    clearErrors();
}

// Password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    const icon = toggle.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation
function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        isValid: minLength && hasUppercase && hasLowercase && hasNumber,
        minLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial,
        score: [minLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length
    };
}

// Password strength indicator
function updatePasswordStrength(password) {
    const validation = validatePassword(password);
    const progressBar = document.getElementById('strengthProgress');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        progressBar.className = 'strength-progress';
        strengthText.textContent = 'Password strength';
        return;
    }
    
    let strengthClass = '';
    let strengthLabel = '';
    
    if (validation.score <= 2) {
        strengthClass = 'weak';
        strengthLabel = 'Weak';
    } else if (validation.score === 3) {
        strengthClass = 'fair';
        strengthLabel = 'Fair';
    } else if (validation.score === 4) {
        strengthClass = 'good';
        strengthLabel = 'Good';
    } else {
        strengthClass = 'strong';
        strengthLabel = 'Strong';
    }
    
    progressBar.className = `strength-progress ${strengthClass}`;
    strengthText.textContent = strengthLabel;
}

// Show error message
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
}

// Show success state
function showSuccess(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
}

// Clear all errors
function clearErrors() {
    const inputs = document.querySelectorAll('.form-group input');
    const errors = document.querySelectorAll('.error-message');
    
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    errors.forEach(error => {
        error.textContent = '';
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Validate login form
function validateLoginForm() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Email validation
    if (!email) {
        showError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('loginEmail', 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess('loginEmail');
    }
    
    // Password validation
    if (!password) {
        showError('loginPassword', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('loginPassword', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        showSuccess('loginPassword');
    }
    
    return isValid;
}

// Validate signup form
function validateSignupForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Full name validation
    if (!fullName) {
        showError('fullName', 'Full name is required');
        isValid = false;
    } else if (fullName.length < 2) {
        showError('fullName', 'Full name must be at least 2 characters');
        isValid = false;
    } else {
        showSuccess('fullName');
    }
    
    // Email validation
    if (!email) {
        showError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('signupEmail', 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess('signupEmail');
    }
    
    // Password validation
    const passwordValidation = validatePassword(password);
    if (!password) {
        showError('signupPassword', 'Password is required');
        isValid = false;
    } else if (!passwordValidation.isValid) {
        showError('signupPassword', 'Password must be at least 8 characters with uppercase, lowercase, and number');
        isValid = false;
    } else {
        showSuccess('signupPassword');
    }
    
    // Confirm password validation
    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    } else {
        showSuccess('confirmPassword');
    }
    
    // Terms validation
    if (!agreeTerms) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Validate forgot password form
function validateForgotForm() {
    const email = document.getElementById('forgotEmail').value.trim();
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Email validation
    if (!email) {
        showError('forgotEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('forgotEmail', 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess('forgotEmail');
    }
    
    return isValid;
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateLoginForm()) {
            const submitBtn = document.querySelector('.login-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect to home page after successful login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 2000);
        }
    });
    
    // Signup form submission
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateSignupForm()) {
            const submitBtn = document.querySelector('.signup-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showNotification('Account created successfully! Please check your email for verification.', 'success');
                
                // Switch to login form after successful signup
                setTimeout(() => {
                    switchToLogin();
                }, 2000);
            }, 2000);
        }
    });
    
    // Forgot password form submission
    document.getElementById('forgotForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForgotForm()) {
            const submitBtn = document.querySelector('.forgot-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showNotification('Password reset link sent to your email!', 'success');
                
                // Switch to login form after sending reset link
                setTimeout(() => {
                    switchToLogin();
                }, 2000);
            }, 2000);
        }
    });
    
    // Real-time password strength checking
    document.getElementById('signupPassword').addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
    
    // Real-time confirm password validation
    document.getElementById('confirmPassword').addEventListener('blur', function() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
        } else if (confirmPassword && password === confirmPassword) {
            showSuccess('confirmPassword');
        }
    });
    
    // Real-time email validation
    const emailInputs = ['loginEmail', 'signupEmail', 'forgotEmail'];
    emailInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('blur', function() {
                const email = this.value.trim();
                if (email && !isValidEmail(email)) {
                    showError(inputId, 'Please enter a valid email address');
                } else if (email && isValidEmail(email)) {
                    showSuccess(inputId);
                }
            });
        }
    });
});

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.CartUtils) {
        const totalItems = CartUtils.getTotalCount();
        const cartIcon = document.querySelector('.cart span');
        if (cartIcon) {
            cartIcon.textContent = totalItems;
        }
    }
});
