// auth.js - Admin Protection & Authentication Manager

(function () {
    let user = null;
    try {
        const storedUser = localStorage.getItem('user') || localStorage.getItem('currentUser');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        user = null;
    }

    // 1. If not logged in: Redirect to Login page
    if (!user) {
        window.location.href = '../login.html';
        return;
    }

    // 2. If logged in but role !== "admin": Store error toast notice and redirect to Home
    if (user.role !== 'admin') {
        sessionStorage.setItem('auth_error_toast', 'Administrator access required.');
        window.location.href = '../index.html';
        return;
    }

    // 3. Update Admin Navbar & Attach Logout Listener
    function initNavbarAndLogout() {
        const adminNameElements = document.querySelectorAll('.admin-name');
        adminNameElements.forEach(el => {
            if (user && user.name) {
                el.textContent = user.name;
            }
        });

        const adminAvatarElements = document.querySelectorAll('.admin-avatar');
        adminAvatarElements.forEach(img => {
            if (user && user.avatar) {
                img.src = user.avatar;
            }
        });

        const logoutElements = document.querySelectorAll('.logout, #logout-btn, .logout-btn');
        logoutElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                localStorage.removeItem('currentUser');
                if (typeof showToast === 'function') {
                    showToast('Logged out successfully', 'info');
                }
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 300);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbarAndLogout);
    } else {
        initNavbarAndLogout();
    }
})();
