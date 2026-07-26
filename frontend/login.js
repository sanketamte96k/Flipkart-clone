/* ============================================================
   FLIPKART AUTHENTICATION MANAGER (LOGIN & SIGNUP UX)
============================================================ */

// Global Toast Manager
function showToastNotification(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';

    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3000);
}

if (typeof window.showToast !== 'function') {
    window.showToast = showToastNotification;
}

// Tab Switcher Logic
function switchAuthTab(tab) {
    const loginTabBtn = document.getElementById('tab-login-btn');
    const signupTabBtn = document.getElementById('tab-signup-btn');
    const loginPanel = document.getElementById('login-panel');
    const signupPanel = document.getElementById('signup-panel');
    const titleEl = document.getElementById('auth-panel-title');
    const descEl = document.getElementById('auth-panel-desc');
    const heroIcon = document.getElementById('auth-hero-icon');

    if (!loginPanel || !signupPanel) return;

    if (tab === 'login') {
        if (loginTabBtn) loginTabBtn.classList.add('active');
        if (signupTabBtn) signupTabBtn.classList.remove('active');
        loginPanel.classList.add('active');
        signupPanel.classList.remove('active');

        if (titleEl) titleEl.textContent = 'Login';
        if (descEl) descEl.textContent = 'Get access to your Orders, Wishlist and Recommendations';
        if (heroIcon) heroIcon.className = 'fas fa-user-lock auth-hero-icon';
    } else {
        if (signupTabBtn) signupTabBtn.classList.add('active');
        if (loginTabBtn) loginTabBtn.classList.remove('active');
        signupPanel.classList.add('active');
        loginPanel.classList.remove('active');

        if (titleEl) titleEl.textContent = "Looks like you're new here!";
        if (descEl) descEl.textContent = 'Sign up with your email or mobile to get started';
        if (heroIcon) heroIcon.className = 'fas fa-user-plus auth-hero-icon';
    }
}

// Show/Hide Password Toggle
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        if (btn) { btn.classList.remove('fa-eye'); btn.classList.add('fa-eye-slash'); }
    } else {
        input.type = 'password';
        if (btn) { btn.classList.remove('fa-eye-slash'); btn.classList.add('fa-eye'); }
    }
}

// Field Error Helpers
function showFieldError(errorElId, message) {
    const errEl = document.getElementById(errorElId);
    if (errEl) {
        errEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errEl.classList.add('active');
    }
}

function hideFieldError(errorElId) {
    const errEl = document.getElementById(errorElId);
    if (errEl) {
        errEl.innerHTML = '';
        errEl.classList.remove('active');
    }
}

function clearAllFieldErrors() {
    document.querySelectorAll('.field-error-msg').forEach(el => {
        el.innerHTML = '';
        el.classList.remove('active');
    });
}

function shakeForm(formEl) {
    if (!formEl) return;
    formEl.classList.remove('shake-form');
    void formEl.offsetWidth;
    formEl.classList.add('shake-form');
    setTimeout(() => formEl.classList.remove('shake-form'), 400);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidMobile(mobile) {
    return /^\d{10}$/.test(mobile);
}

function validateEmailOrMobile(value) {
    if (!value) return 'Email Address or 10-digit Mobile is required.';
    if (!isValidEmail(value) && !isValidMobile(value)) {
        return 'Please enter a valid Email (e.g. user@domain.com) or 10-digit Mobile.';
    }
    return null;
}

function validatePassword(value) {
    if (!value) return 'Password is required.';
    if (value.length < 4) return 'Password must be at least 4 characters long.';
    return null;
}

function initRippleButtons() {
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const circle = document.createElement('span');
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple-effect');

            const existing = btn.querySelector('.ripple-effect');
            if (existing) existing.remove();

            btn.appendChild(circle);
        });
    });
}

function initPasswordStrengthMeter() {
    const passInput = document.getElementById('signup-password');
    const meter = document.getElementById('password-strength-meter');
    const textEl = document.getElementById('strength-text');
    const seg1 = document.getElementById('seg-1');
    const seg2 = document.getElementById('seg-2');
    const seg3 = document.getElementById('seg-3');
    const seg4 = document.getElementById('seg-4');

    if (!passInput || !meter) return;

    passInput.addEventListener('input', () => {
        const val = passInput.value;
        if (!val) {
            meter.style.display = 'none';
            return;
        }

        meter.style.display = 'block';
        let score = 0;

        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/\d/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        const colors = ['#e2e8f0', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
        const labels = ['Weak', 'Weak password', 'Medium strength', 'Strong password', 'Very strong password! ✔'];

        const currentColor = colors[score] || colors[1];
        if (textEl) textEl.textContent = labels[score] || 'Weak';
        if (textEl) textEl.style.color = currentColor;

        if (seg1) seg1.style.background = score >= 1 ? currentColor : '#e2e8f0';
        if (seg2) seg2.style.background = score >= 2 ? currentColor : '#e2e8f0';
        if (seg3) seg3.style.background = score >= 3 ? currentColor : '#e2e8f0';
        if (seg4) seg4.style.background = score >= 4 ? currentColor : '#e2e8f0';
    });
}

function handleForgotPassword(e) {
    if (e) e.preventDefault();
    showToastNotification('Password reset link sent to your registered email/mobile.', 'info');
}

function handleGoogleLogin() {
    showToastNotification('Connecting to Google Authentication...', 'info');
}

function handleGuestLogin() {
    showToastNotification('Continuing as Guest User.', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 600);
}

// ============================================================
// MAIN LOGIN SUBMISSION (POST FETCH WITHOUT URL PARAMS)
// ============================================================
async function handleLoginSubmit(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    clearAllFieldErrors();

    const emailInput = document.getElementById('email') || document.getElementById('login-email') || document.querySelector('input[name="email"]');
    const passwordInput = document.getElementById('password') || document.getElementById('login-password') || document.querySelector('input[name="password"]');
    const loginBtn = document.getElementById('login-btn') || document.getElementById('login-submit-btn');
    const loginForm = document.getElementById('login-form');

    const emailVal = emailInput ? emailInput.value.trim() : '';
    const passVal = passwordInput ? passwordInput.value.trim() : '';

    let hasError = false;

    const emailErr = validateEmailOrMobile(emailVal);
    if (emailErr) {
        showFieldError('email-error', emailErr);
        hasError = true;
    }

    const passErr = validatePassword(passVal);
    if (passErr) {
        showFieldError('password-error', passErr);
        hasError = true;
    }

    if (hasError) {
        if (loginForm) shakeForm(loginForm);
        showToastNotification('Please resolve validation errors before continuing.', 'error');
        return false;
    }

    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Logging in...</span>';
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailVal, password: passVal })
        });

        let data = null;
        try {
            data = await response.json();
        } catch (jsonErr) {
            data = null;
        }

        if (response.ok && data && data.success) {
            const userObj = data.user || {};
            userObj.isLoggedIn = true;

            localStorage.setItem('user', JSON.stringify(userObj));
            localStorage.setItem('currentUser', JSON.stringify(userObj));

            showToastNotification(data.message || 'Login successful!', 'success');

            if (typeof closeLogin === 'function') closeLogin();
            if (typeof updateUserArea === 'function') updateUserArea(userObj.name);

            setTimeout(() => {
                if (userObj.role === 'admin') {
                    window.location.href = 'admin/dashboard.html';
                } else if (window.location.pathname.endsWith('login.html')) {
                    window.location.href = 'index.html';
                }
            }, 600);
        } else {
            const errMsg = (data && (data.message || data.error)) ? (data.message || data.error) : 'Invalid email or password.';
            showToastNotification(errMsg, 'error');
            if (loginForm) shakeForm(loginForm);
        }
    } catch (err) {
        console.error('Login POST request failed:', err);
        showToastNotification('Network error connecting to server. Please try again.', 'error');
        if (loginForm) shakeForm(loginForm);
    } finally {
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Login</span>';
        }
    }

    return false;
}

window.handleLoginSubmit = handleLoginSubmit;

document.addEventListener('DOMContentLoaded', () => {
    initRippleButtons();
    initPasswordStrengthMeter();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = function (e) {
            e.preventDefault();
            handleLoginSubmit(e);
            return false;
        };
    }
});
