
// Firebase Authentication functionality
import { auth } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

console.log("Firebase Authentication system loaded");

// Current user state
let currentUser = null;

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

// Firebase error handling
function handleFirebaseError(error) {
    let message = 'An error occurred. Please try again.';
    
    switch (error.code) {
        case 'auth/user-not-found':
            message = 'No account found with this email address.';
            break;
        case 'auth/wrong-password':
            message = 'Incorrect password. Please try again.';
            break;
        case 'auth/email-already-in-use':
            message = 'An account with this email already exists.';
            break;
        case 'auth/weak-password':
            message = 'Password should be at least 6 characters long.';
            break;
        case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            break;
        case 'auth/too-many-requests':
            message = 'Too many failed attempts. Please try again later.';
            break;
        case 'auth/network-request-failed':
            message = 'Network error. Please check your connection.';
            break;
        default:
            message = error.message;
    }
    
    return message;
}

// Update UI based on authentication state
function updateAuthUI(user) {
    const accountLink = document.querySelector('.account a');
    const cartIcon = document.querySelector('.cart span');
    
    if (user) {
        // User is logged in
        currentUser = user;
        
        // Update account icon/link
        if (accountLink) {
            accountLink.innerHTML = '<i class="fa-solid fa-user-check"></i>';
            accountLink.title = `Logged in as ${user.email}`;
        }
        
        // Update cart count
        if (window.CartUtils && cartIcon) {
            const totalItems = CartUtils.getTotalCount();
            cartIcon.textContent = totalItems;
        }
        
        // If on login page, redirect to home
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    } else {
        // User is logged out
        currentUser = null;
        
        // Reset account icon
        if (accountLink) {
            accountLink.innerHTML = '<i class="fa-solid fa-circle-user"></i>';
            accountLink.title = 'Login';
        }
        
        // Clear any user-specific data
        localStorage.removeItem('userPreferences');
    }
}

// Firebase signup function
async function signupWithFirebase(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update user profile with display name
        await updateProfile(user, {
            displayName: fullName
        });
        
        showNotification('Account created successfully! Welcome!', 'success');
        return { success: true, user };
    } catch (error) {
        const errorMessage = handleFirebaseError(error);
        showNotification(errorMessage, 'error');
        return { success: false, error: errorMessage };
    }
}

// Firebase login function
async function loginWithFirebase(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        showNotification('Login successful! Welcome back!', 'success');
        return { success: true, user };
    } catch (error) {
        const errorMessage = handleFirebaseError(error);
        showNotification(errorMessage, 'error');
        return { success: false, error: errorMessage };
    }
}

// Firebase logout function
async function logoutFromFirebase() {
    try {
        await signOut(auth);
        showNotification('You have been logged out successfully.', 'success');
        
        // Redirect to login page after logout
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        
        return { success: true };
    } catch (error) {
        const errorMessage = handleFirebaseError(error);
        showNotification(errorMessage, 'error');
        return { success: false, error: errorMessage };
    }
}

// Firebase password reset function
async function resetPasswordWithFirebase(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        showNotification('Password reset email sent! Check your inbox.', 'success');
        return { success: true };
    } catch (error) {
        const errorMessage = handleFirebaseError(error);
        showNotification(errorMessage, 'error');
        return { success: false, error: errorMessage };
    }
}

// Check if user is logged in
function isUserLoggedIn() {
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Validate forms (keeping existing validation logic)
function validateLoginForm() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let isValid = true;
    
    clearErrors();
    
    if (!email) {
        showError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('loginEmail', 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess('loginEmail');
    }
    
    if (!password) {
        showError('loginPassword', 'Password is required');
        isValid = false;
    } else {
        showSuccess('loginPassword');
    }
    
    return isValid;
}

function validateSignupForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    let isValid = true;
    
    clearErrors();
    
    if (!fullName) {
        showError('fullName', 'Full name is required');
        isValid = false;
    } else if (fullName.length < 2) {
        showError('fullName', 'Full name must be at least 2 characters');
        isValid = false;
    } else {
        showSuccess('fullName');
    }
    
    if (!email) {
        showError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('signupEmail', 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess('signupEmail');
    }
    
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
    
    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    } else {
        showSuccess('confirmPassword');
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        isValid = false;
    }
    
    return isValid;
}

function validateForgotForm() {
    const email = document.getElementById('forgotEmail').value.trim();
    let isValid = true;
    
    clearErrors();
    
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

// Add logout functionality to navigation
function addLogoutButton() {
    const accountLink = document.querySelector('.account a');
    if (accountLink && currentUser) {
        accountLink.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                const submitBtn = e.target.closest('a');
                submitBtn.style.opacity = '0.6';
                submitBtn.style.pointerEvents = 'none';
                
                await logoutFromFirebase();
                
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            }
        });
    }
}

// Initialize Firebase Auth State Listener
function initializeAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
        updateAuthUI(user);
        if (user) {
            addLogoutButton();
        }
    });
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase auth state listener
    initializeAuthStateListener();
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateLoginForm()) {
                const submitBtn = document.querySelector('.login-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
                submitBtn.disabled = true;
                
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value;
                
                const result = await loginWithFirebase(email, password);
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                if (result.success) {
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            }
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateSignupForm()) {
                const submitBtn = document.querySelector('.signup-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';
                submitBtn.disabled = true;
                
                const fullName = document.getElementById('fullName').value.trim();
                const email = document.getElementById('signupEmail').value.trim();
                const password = document.getElementById('signupPassword').value;
                
                const result = await signupWithFirebase(email, password, fullName);
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                if (result.success) {
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }
            }
        });
    }
    
    // Forgot password form submission
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateForgotForm()) {
                const submitBtn = document.querySelector('.forgot-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                const email = document.getElementById('forgotEmail').value.trim();
                
                const result = await resetPasswordWithFirebase(email);
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                if (result.success) {
                    setTimeout(() => {
                        switchToLogin();
                    }, 2000);
                }
            }
        });
    }
    
    // Real-time password strength checking
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
    
    // Real-time confirm password validation
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('blur', function() {
            const password = document.getElementById('signupPassword').value;
            const confirmPasswordValue = this.value;
            
            if (confirmPasswordValue && password !== confirmPasswordValue) {
                showError('confirmPassword', 'Passwords do not match');
            } else if (confirmPasswordValue && password === confirmPasswordValue) {
                showSuccess('confirmPassword');
            }
        });
    }
    
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

// Make functions globally available
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.showForgotPassword = showForgotPassword;
window.togglePassword = togglePassword;
window.isUserLoggedIn = isUserLoggedIn;
window.getCurrentUser = getCurrentUser;
window.logoutFromFirebase = logoutFromFirebase;
