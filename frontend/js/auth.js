// auth.js - Admin Protection & Authentication Manager

(function () {
    // 1. Read user object from localStorage
    let user = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        user = null;
    }

    // 2. If no user exists: Redirect to /login.html
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // 3. If user.role !== "admin": Show alert "Access Denied" and redirect to index.html
    if (user.role !== 'admin') {
        alert('Access Denied');
        window.location.href = '/index.html';
        return;
    }

    // 4. Update Admin Navbar & Attach Logout Listener once DOM is loaded
    function initNavbarAndLogout() {
        // Display logged-in admin's name in navbar
        const adminNameElements = document.querySelectorAll('.admin-name');
        adminNameElements.forEach(el => {
            if (user && user.name) {
                el.textContent = user.name;
            }
        });

        // Attach Logout Event Handler
        const logoutElements = document.querySelectorAll('.logout, #logout-btn, .logout-btn');
        logoutElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.href = '/login.html';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbarAndLogout);
    } else {
        initNavbarAndLogout();
    }
})();
