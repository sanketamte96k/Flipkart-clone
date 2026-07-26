/* ============================================================
   FLIPKART REGISTRATION MANAGER (REGISTER & AUTO-LOGIN)
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const nameInput = document.getElementById('signup-name') || document.getElementById('name');
    const emailInput = document.getElementById('signup-email') || document.getElementById('email');
    const passwordInput = document.getElementById('signup-password') || document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password') || document.getElementById('signup-confirm-password');
    const registerBtn = document.getElementById('register-btn') || document.getElementById('signup-submit-btn');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (typeof clearAllFieldErrors === 'function') clearAllFieldErrors();

            const nameVal = nameInput ? nameInput.value.trim() : '';
            const emailVal = emailInput ? emailInput.value.trim() : '';
            const passVal = passwordInput ? passwordInput.value.trim() : '';
            const confirmPassVal = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';

            let hasError = false;

            // Name Validation
            if (!nameVal || nameVal.length < 2) {
                if (typeof showFieldError === 'function') showFieldError('signup-name-error', 'Please enter your full name (at least 2 characters).');
                hasError = true;
            }

            // Email/Mobile Validation
            if (typeof validateEmailOrMobile === 'function') {
                const emailErr = validateEmailOrMobile(emailVal);
                if (emailErr) {
                    showFieldError('signup-email-error', emailErr);
                    hasError = true;
                }
            } else if (!emailVal) {
                if (typeof showFieldError === 'function') showFieldError('signup-email-error', 'Email or Mobile is required.');
                hasError = true;
            }

            // Password Validation
            if (typeof validatePassword === 'function') {
                const passErr = validatePassword(passVal);
                if (passErr) {
                    showFieldError('signup-password-error', passErr);
                    hasError = true;
                }
            } else if (!passVal || passVal.length < 8) {
                if (typeof showFieldError === 'function') showFieldError('signup-password-error', 'Password must be at least 8 characters long.');
                hasError = true;
            }

            // Confirm Password Validation
            if (passVal !== confirmPassVal) {
                if (typeof showFieldError === 'function') showFieldError('confirm-password-error', 'Passwords do not match.');
                hasError = true;
            }

            if (hasError) {
                if (typeof shakeForm === 'function') shakeForm(registerForm);
                if (typeof showToastNotification === 'function') showToastNotification('Please resolve validation errors before continuing.', 'error');
                return;
            }

            // Disable button & show spinner
            if (registerBtn) {
                registerBtn.disabled = true;
                registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Creating Account...</span>';
            }

            try {
                // 1. Call Register API
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: nameVal, email: emailVal, password: passVal })
                });

                let data = null;
                try {
                    data = await response.json();
                } catch (jsonErr) {
                    data = null;
                }

                if (response.ok && data && data.success) {
                    if (typeof showToastNotification === 'function') {
                        showToastNotification('Account created successfully! Auto-logging in...', 'success');
                    }

                    // 2. Auto-login after successful signup
                    try {
                        const loginResp = await fetch('/api/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: emailVal, password: passVal })
                        });

                        let loginData = null;
                        try { loginData = await loginResp.json(); } catch (e) { loginData = null; }

                        if (loginResp.ok && loginData && loginData.success) {
                            if (loginData.user) {
                                localStorage.setItem('user', JSON.stringify(loginData.user));
                                localStorage.setItem('currentUser', JSON.stringify(loginData.user));
                            }
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 800);
                            return;
                        }
                    } catch (autoLoginErr) {
                        console.warn('Auto login failed:', autoLoginErr);
                    }

                    // Fallback redirect to login
                    setTimeout(() => {
                        if (typeof switchAuthTab === 'function') {
                            switchAuthTab('login');
                        } else {
                            window.location.href = 'login.html';
                        }
                    }, 1200);

                } else {
                    const errMsg = (data && data.message) ? data.message : 'Registration failed. Please try again.';
                    if (typeof showToastNotification === 'function') showToastNotification(errMsg, 'error');
                    if (typeof shakeForm === 'function') shakeForm(registerForm);

                    if (registerBtn) {
                        registerBtn.disabled = false;
                        registerBtn.innerHTML = '<span>Create Account & Continue</span>';
                    }
                }
            } catch (err) {
                console.error('Registration request failed:', err);
                if (typeof showToastNotification === 'function') {
                    showToastNotification('An error occurred during registration. Please try again.', 'error');
                }
                if (typeof shakeForm === 'function') shakeForm(registerForm);

                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.innerHTML = '<span>Create Account & Continue</span>';
                }
            }
        });
    }
});
