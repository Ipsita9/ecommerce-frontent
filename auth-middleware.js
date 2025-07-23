
// Authentication Middleware
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';

// Pages that require authentication
const protectedPages = ['checkout.html', 'cart.html'];

// Check if current page requires authentication
function requiresAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    return protectedPages.includes(currentPage);
}

// Redirect to login if not authenticated
function redirectToLogin() {
    if (window.location.pathname !== '/login.html') {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
    }
}

// Redirect after successful login
function redirectAfterLogin() {
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
    } else {
        window.location.href = 'index.html';
    }
}

// Initialize auth middleware
function initAuthMiddleware() {
    onAuthStateChanged(auth, (user) => {
        if (requiresAuth() && !user) {
            // User is not authenticated and trying to access protected page
            redirectToLogin();
        } else if (user && window.location.pathname.includes('login.html')) {
            // User is authenticated and on login page, redirect them
            redirectAfterLogin();
        }
    });
}

// Run middleware when page loads
document.addEventListener('DOMContentLoaded', initAuthMiddleware);

// Export functions
window.redirectAfterLogin = redirectAfterLogin;
