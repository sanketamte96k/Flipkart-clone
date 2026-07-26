/* ============================================================
   FLIPKART CLONE - ADMIN SETTINGS INTERACTION SCRIPT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Tab Switching Logic
    const tabBtns = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".settings-panel");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            tabBtns.forEach(b => b.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const activePanel = document.getElementById(`panel-${targetTab}`);
            if (activePanel) {
                activePanel.classList.add("active");
            }
        });
    });

    // 2. Theme Toggle (Light / Dark mode)
    const themeBtn = document.getElementById("theme-btn");
    if (themeBtn) {
        const savedTheme = localStorage.getItem("admin_theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("admin_theme", isDark ? "dark" : "light");
            themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // 3. Mobile Sidebar Toggle
    const menuToggleBtn = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    // 4. Profile Dropdown Toggle
    const profileTrigger = document.getElementById("profile-trigger");
    const profileMenu = document.getElementById("profile-menu");
    if (profileTrigger && profileMenu) {
        profileTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle("active");
        });

        document.addEventListener("click", () => {
            profileMenu.classList.remove("active");
        });
    }

    // 5. Settings Save Handler
    const saveButtons = document.querySelectorAll(".btn-save, button[type='submit']");
    saveButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            btn.disabled = true;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                if (typeof showToast === 'function') {
                    showToast("Settings updated successfully!", "success");
                }
            }, 500);
        });
    });
});
