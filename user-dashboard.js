
// User Dashboard Functionality
import { auth } from './firebase-config.js';
import { onAuthStateChanged, updateProfile, updatePassword } from 'firebase/auth';

// Update user profile
async function updateUserProfile(displayName, photoURL = null) {
    try {
        const user = auth.currentUser;
        if (user) {
            const updateData = { displayName };
            if (photoURL) updateData.photoURL = photoURL;
            
            await updateProfile(user, updateData);
            showNotification('Profile updated successfully!', 'success');
            return { success: true };
        }
    } catch (error) {
        showNotification('Failed to update profile: ' + error.message, 'error');
        return { success: false, error: error.message };
    }
}

// Update user password
async function updateUserPassword(newPassword) {
    try {
        const user = auth.currentUser;
        if (user) {
            await updatePassword(user, newPassword);
            showNotification('Password updated successfully!', 'success');
            return { success: true };
        }
    } catch (error) {
        showNotification('Failed to update password: ' + error.message, 'error');
        return { success: false, error: error.message };
    }
}

// Get user orders (placeholder for future implementation)
function getUserOrders() {
    // This would typically fetch from your database
    return JSON.parse(localStorage.getItem('userOrders') || '[]');
}

// Save user preferences
function saveUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// Get user preferences
function getUserPreferences() {
    return JSON.parse(localStorage.getItem('userPreferences') || '{}');
}

// Show notification function (reused from auth.js)
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

// Export functions
window.updateUserProfile = updateUserProfile;
window.updateUserPassword = updateUserPassword;
window.getUserOrders = getUserOrders;
window.saveUserPreferences = saveUserPreferences;
window.getUserPreferences = getUserPreferences;
