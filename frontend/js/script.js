/* Theme Logic */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update dropdown if it exists
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        updateUserArea(currentUser.name);
    }
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

document.addEventListener('DOMContentLoaded', initTheme);

let allProducts = [];
let currentCategory = 'All';
let currentSort = 'newest';
let currentSearch = '';

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

// ============================================================
let currentPageNum = 1;
const itemsPerPage = 8;

function showGlobalSpinner() {
    let overlay = document.getElementById("global-spinner-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "global-spinner-overlay";
        overlay.innerHTML = '<div class="spinner-ring"></div>';
        document.body.appendChild(overlay);
    }
    overlay.style.display = "flex";
}

function hideGlobalSpinner() {
    const overlay = document.getElementById("global-spinner-overlay");
    if (overlay) overlay.style.display = "none";
}

// FETCH & DISPLAY PRODUCTS
// ============================================================
async function fetchProducts() {
    const container = document.getElementById("products");
    if (container) {
        container.innerHTML = Array(8).fill(`
            <div class="skeleton-card">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-price"></div>
            </div>
        `).join("");
    }

    showGlobalSpinner();
    try {
        let response = await fetch('/api/products');
        allProducts = await response.json();
        applyFiltersAndSort();
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        hideGlobalSpinner();
    }
}

function applyFiltersAndSort() {
    let filtered = [...allProducts];

    // 1. Category Filter
    if (currentCategory !== 'All') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    // 2. Search Filter
    if (currentSearch) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
            p.category.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }

    // 3. Price Range Filter
    const minVal = document.getElementById('min-price')?.value;
    const maxVal = document.getElementById('max-price')?.value;
    const minPrice = (minVal && !isNaN(minVal) && minVal.trim() !== '') ? parseInt(minVal) : 0;
    const maxPrice = (maxVal && !isNaN(maxVal) && maxVal.trim() !== '') ? parseInt(maxVal) : Infinity;
    
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // 4. Rating Filter
    const ratingCheckboxes = document.querySelectorAll('.sidebar .filter-options input[type="checkbox"]:checked');
    const ratingFilters = Array.from(ratingCheckboxes).map(cb => parseInt(cb.value));
    if (ratingFilters.length > 0) {
        const minRating = Math.min(...ratingFilters);
        filtered = filtered.filter(p => (p.rating || 0) >= minRating);
    }

    // 5. Sorting
    if (currentSort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (currentSort === 'newest') {
        filtered.reverse();
    }

    currentPageNum = 1;
    displayProducts(filtered);
    setupIntersectionObserver();
}

function filterProducts(category, btnElement) {
    currentCategory = category;
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    
    if (btnElement && btnElement.classList.contains('cat-tab')) {
        btnElement.classList.add('active');
    } else {
        document.querySelectorAll('.cat-tab').forEach(tab => {
            if (tab.innerText.includes(category) || (category === 'All' && tab.innerText.includes('All'))) {
                tab.classList.add('active');
            }
        });
    }

    applyFiltersAndSort();
}

function applySort(val) {
    currentSort = val;
    applyFiltersAndSort();
}

function displayProducts(products) {
    const container = document.getElementById("products");
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 8px; border: 1px solid #e0e0e0; margin: 20px 0;">
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-500_f9fa1d.png" style="width: 140px; margin-bottom: 15px; opacity: 0.8;" alt="No Products Found">
                <h3 style="font-size: 1.3rem; color: #212121; font-weight: 700; margin-bottom: 8px;">No Products Found</h3>
                <p style="color: #878787; font-size: 0.95rem; margin-bottom: 20px;">Try adjusting your search terms or filter criteria.</p>
                <button onclick="resetFilters()" style="background: #2874f0; color: white; border: none; padding: 10px 24px; font-weight: 600; border-radius: 4px; cursor: pointer;">Clear All Filters</button>
            </div>
        `;
        renderPagination(0);
        return;
    }

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIdx = (currentPageNum - 1) * itemsPerPage;
    const paginatedProducts = products.slice(startIdx, startIdx + itemsPerPage);

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    container.innerHTML = "";
    paginatedProducts.forEach((product, index) => {
        const isWishlisted = typeof isInWishlist === 'function' ? isInWishlist(product.id) : false;
        
        const card = document.createElement('div');
        card.className = 'product-card reveal';
        card.style.transitionDelay = `${(index % 4) * 0.1}s`;
        card.onclick = () => window.location.href = `product.html?id=${product.id}`;
        
        let originalPrice = Math.floor(product.price * 1.4);
        let discount = 40;
        let savings = originalPrice - product.price;

        card.innerHTML = `
            <span class="wishlist-icon ${isWishlisted ? 'active' : ''}" data-wishlist-id="${product.id}" onclick="toggleWishlist(event, ${product.id}, this)">
                <i class="${isWishlisted ? 'fas' : 'far'} fa-heart" style="color: ${isWishlisted ? '#ff4343' : '#878787'}; font-size: 1.2rem;"></i>
            </span>
            <img src="${product.image}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500';">
            <h2>${product.name}</h2>
            
            <div class="price-row">
                <span class="price">₹${product.price.toLocaleString()}</span>
                <span class="original-price">₹${originalPrice.toLocaleString()}</span>
                <span class="discount-percent">${discount}% off</span>
            </div>
            
            <span class="save-msg">Get it for ₹${product.price.toLocaleString()} (Save ₹${savings.toLocaleString()})</span>

            <div class="card-footer" style="display: flex; gap: 10px; margin-top: auto;">
                <button onclick="event.stopPropagation(); window.location.href='product.html?id=${product.id}'" style="flex: 1; background: #f1f3f6; color: var(--text-main); border: 1px solid var(--border-soft); padding: 8px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.85rem;" aria-label="View product details">View</button>
                <button onclick="event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" style="flex: 1; background: var(--brand-primary); color: white; border: none; padding: 8px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 0.85rem;" aria-label="Add to cart">Add</button>
            </div>
        `;
        container.appendChild(card);
    });

    renderPagination(totalPages, products);
}

function renderPagination(totalPages, allFiltered = []) {
    let pagContainer = document.getElementById("pagination-container");
    if (!pagContainer) {
        const prodSection = document.querySelector(".products-wrapper") || document.getElementById("products")?.parentElement;
        if (!prodSection) return;
        pagContainer = document.createElement("div");
        pagContainer.id = "pagination-container";
        pagContainer.className = "pagination-wrapper";
        prodSection.appendChild(pagContainer);
    }

    if (totalPages <= 1) {
        pagContainer.innerHTML = "";
        return;
    }

    let buttonsHTML = `<button class="page-btn" ${currentPageNum === 1 ? 'disabled' : ''} onclick="goToPage(${currentPageNum - 1})"><i class="fas fa-chevron-left"></i> Prev</button>`;

    for (let i = 1; i <= totalPages; i++) {
        buttonsHTML += `<button class="page-btn ${i === currentPageNum ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    buttonsHTML += `<button class="page-btn" ${currentPageNum === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPageNum + 1})">Next <i class="fas fa-chevron-right"></i></button>`;

    pagContainer.innerHTML = buttonsHTML;
}

function goToPage(page) {
    currentPageNum = page;
    displayProducts(allProducts);
    window.scrollTo({ top: 400, behavior: 'smooth' });
}

function setupIntersectionObserver() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements || revealElements.length === 0) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for environment without IntersectionObserver
        revealElements.forEach(el => el.classList.add('active'));
    }
}

function resetFilters() {
    currentCategory = 'All';
    currentSearch = '';
    currentSort = 'newest';
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    fetchProducts();
}

function showToast(message, type = 'info') {
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

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showWarning(message) {
    showToast(message, 'warning');
}

function showInfo(message) {
    showToast(message, 'info');
}

window.showToast = showToast;
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showInfo = showInfo;

fetchProducts();


// Redundant theme logic removed


// =========================
// MODALS LOGIC
// =========================

function openLogin(tab = 'login') {
    if (!document.getElementById("auth-styles-link")) {
        const link = document.createElement("link");
        link.id = "auth-styles-link";
        link.rel = "stylesheet";
        link.href = "css/login.css";
        document.head.appendChild(link);
    }
    if (!document.getElementById("google-fonts-inter")) {
        const fontLink = document.createElement("link");
        fontLink.id = "google-fonts-inter";
        fontLink.rel = "stylesheet";
        fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
        document.head.appendChild(fontLink);
    }
    if (!document.getElementById("font-awesome-icons")) {
        const faLink = document.createElement("link");
        faLink.id = "font-awesome-icons";
        faLink.rel = "stylesheet";
        faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
        document.head.appendChild(faLink);
    }

    let overlay = document.getElementById("auth-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "auth-modal-overlay";
        overlay.className = "auth-modal-overlay";
        overlay.innerHTML = `
            <div class="auth-container">
                <button class="modal-close-btn" onclick="closeLogin()">&times;</button>
                <div class="auth-left">
                    <div>
                        <div class="auth-left-content">
                            <h2 id="modal-panel-title">Login</h2>
                            <p id="modal-panel-desc">Get access to your Orders, Wishlist and Recommendations</p>
                        </div>
                        <div class="auth-left-highlights">
                            <div class="highlight-item"><i class="fas fa-bolt"></i> ⚡ Flipkart Minutes Eligible</div>
                            <div class="highlight-item"><i class="fas fa-shield-alt"></i> 🛡️ 100% Safe & Secure Payments</div>
                            <div class="highlight-item"><i class="fas fa-truck"></i> 🚚 Fast & Free Shipping Options</div>
                        </div>
                    </div>
                    <div class="auth-left-illustration">
                        <i class="fas fa-user-lock auth-hero-icon" id="modal-hero-icon"></i>
                    </div>
                </div>
                <div class="auth-right">
                    <div class="auth-tabs">
                        <button class="auth-tab active" id="tab-login-btn" onclick="switchAuthTab('login')">Login</button>
                        <button class="auth-tab" id="tab-signup-btn" onclick="switchAuthTab('signup')">Sign Up</button>
                    </div>

                    <div class="auth-forms-container">
                        <!-- LOGIN PANEL -->
                        <div class="auth-form-panel active" id="login-panel">
                            <form id="login-form" class="auth-form" novalidate onsubmit="event.preventDefault(); handleLoginSubmit(event); return false;">
                                <div class="floating-group">
                                    <i class="fas fa-envelope input-icon"></i>
                                    <input type="text" id="email" name="email" class="float-input" placeholder=" " required autocomplete="username">
                                    <label for="email" class="floating-label">Email Address or 10-digit Mobile</label>
                                    <div class="field-error-msg" id="email-error"></div>
                                </div>

                                <div class="floating-group">
                                    <i class="fas fa-lock input-icon"></i>
                                    <input type="password" id="password" name="password" class="float-input" placeholder=" " required autocomplete="current-password">
                                    <label for="password" class="floating-label">Enter Password</label>
                                    <i class="fas fa-eye toggle-password-btn" onclick="togglePasswordVisibility('password', this)"></i>
                                    <div class="field-error-msg" id="password-error"></div>
                                </div>

                                <div class="auth-extras-row">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="remember-me">
                                        <span>Remember Me</span>
                                    </label>
                                    <a href="#" onclick="handleForgotPassword(event)" class="forgot-password-link">Forgot Password?</a>
                                </div>

                                <p class="terms-text">
                                    By continuing, you agree to Flipkart's <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
                                </p>

                                <button type="submit" id="login-btn" class="auth-btn auth-btn-primary ripple-btn">
                                    <span>Login</span>
                                </button>

                                <div class="auth-divider">
                                    <span>OR</span>
                                </div>

                                <button type="button" class="auth-btn auth-btn-google ripple-btn" onclick="handleGoogleLogin()">
                                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                                    <span>Continue with Google</span>
                                </button>

                                <button type="button" class="auth-btn auth-btn-secondary ripple-btn" onclick="handleGuestLogin()">
                                    <i class="fas fa-user-clock"></i> <span>Continue as Guest</span>
                                </button>
                            </form>
                        </div>

                        <!-- SIGNUP PANEL -->
                        <div class="auth-form-panel" id="signup-panel">
                            <form id="register-form" class="auth-form" novalidate onsubmit="event.preventDefault(); handleRegisterSubmit(event); return false;">
                                <div class="floating-group">
                                    <i class="fas fa-user input-icon"></i>
                                    <input type="text" id="signup-name" name="name" class="float-input" placeholder=" " required autocomplete="name">
                                    <label for="signup-name" class="floating-label">Full Name</label>
                                    <div class="field-error-msg" id="signup-name-error"></div>
                                </div>

                                <div class="floating-group">
                                    <i class="fas fa-envelope input-icon"></i>
                                    <input type="text" id="signup-email" name="email" class="float-input" placeholder=" " required autocomplete="email">
                                    <label for="signup-email" class="floating-label">Email Address or 10-digit Mobile</label>
                                    <div class="field-error-msg" id="signup-email-error"></div>
                                </div>

                                <div class="floating-group">
                                    <i class="fas fa-lock input-icon"></i>
                                    <input type="password" id="signup-password" name="password" class="float-input" placeholder=" " required autocomplete="new-password">
                                    <label for="signup-password" class="floating-label">Set Password (min 8 chars)</label>
                                    <i class="fas fa-eye toggle-password-btn" onclick="togglePasswordVisibility('signup-password', this)"></i>
                                    <div class="field-error-msg" id="signup-password-error"></div>
                                </div>

                                <div class="password-strength-container" id="password-strength-meter" style="display:none;">
                                    <div class="strength-bars">
                                        <div class="strength-bar-segment" id="seg-1"></div>
                                        <div class="strength-bar-segment" id="seg-2"></div>
                                        <div class="strength-bar-segment" id="seg-3"></div>
                                        <div class="strength-bar-segment" id="seg-4"></div>
                                    </div>
                                    <span class="strength-label" id="strength-text">Password strength</span>
                                </div>

                                <div class="floating-group">
                                    <i class="fas fa-shield-alt input-icon"></i>
                                    <input type="password" id="confirm-password" name="confirmPassword" class="float-input" placeholder=" " required autocomplete="new-password">
                                    <label for="confirm-password" class="floating-label">Confirm Password</label>
                                    <i class="fas fa-eye toggle-password-btn" onclick="togglePasswordVisibility('confirm-password', this)"></i>
                                    <div class="field-error-msg" id="confirm-password-error"></div>
                                </div>

                                <p class="terms-text">
                                    By registering, you agree to Flipkart's <a href="#">Terms of Use</a> & <a href="#">Privacy Policy</a>.
                                </p>

                                <button type="submit" id="register-btn" class="auth-btn auth-btn-primary ripple-btn">
                                    <span>Create Account & Continue</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeLogin();
            }
        });

        document.body.appendChild(overlay);
        if (typeof initRippleButtons === 'function') initRippleButtons();
        if (typeof initPasswordStrengthMeter === 'function') initPasswordStrengthMeter();
    }

    let oldLogin = document.getElementById("login-modal");
    let oldSignup = document.getElementById("signup-modal");
    if (oldLogin) oldLogin.style.display = "none";
    if (oldSignup) oldSignup.style.display = "none";

    if (typeof switchAuthTab === 'function') switchAuthTab(tab);

    overlay.style.display = "flex";
    setTimeout(() => {
        overlay.classList.add("active");
        let firstInput = overlay.querySelector('input:not([type="hidden"])');
        if (firstInput) firstInput.focus();
    }, 10);
}

function closeLogin() {
    let overlay = document.getElementById("auth-modal-overlay");
    if (overlay) {
        overlay.classList.remove("active");
        setTimeout(() => {
            overlay.style.display = "none";
        }, 250);
    }
    let oldLogin = document.getElementById("login-modal");
    let oldSignup = document.getElementById("signup-modal");
    if (oldLogin) oldLogin.style.display = "none";
    if (oldSignup) oldSignup.style.display = "none";
}

function openSignup() {
    openLogin('signup');
}

function closeSignup() {
    closeLogin();
}

// ESC Key & Focus Trap Accessibility Handler
document.addEventListener('keydown', function(e) {
    let overlay = document.getElementById("auth-modal-overlay");
    if (overlay && overlay.classList.contains("active")) {
        if (e.key === "Escape") {
            closeLogin();
        }
        if (e.key === "Tab") {
            let focusables = overlay.querySelectorAll('input, button, a, [tabindex="0"]');
            if (focusables.length > 0) {
                let first = focusables[0];
                let last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    }
});

// Helper to update the navbar when logged in
function updateUserArea(name) {
    let userArea = document.getElementById("user-area");
    if (userArea) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        let adminItemHTML = "";
        const lowerName = name.toLowerCase();
        if (lowerName.includes("sanket") || lowerName.includes("sank")) {
            adminItemHTML = `<a href="admin/dashboard.html"><i class="fas fa-chart-line"></i> Admin Dashboard</a>`;
        }
        
        userArea.innerHTML = `
            <div class="user-greeting" id="user-greeting-btn">
                <i class="fas fa-user-circle" style="font-size: 1.2rem;"></i>
                <span>${name}</span>
                <i class="fas fa-chevron-down" style="font-size: 0.7rem; opacity: 0.7;"></i>
                
                <div class="user-dropdown" id="user-dropdown-menu">
                    ${adminItemHTML}
                    <a href="orders.html"><i class="fas fa-box"></i> My Orders</a>
                    <a href="wishlist.html"><i class="fas fa-heart"></i> Wishlist</a>
                    <a href="profile.html"><i class="fas fa-user-cog"></i> Account Settings</a>
                    <hr>
                    <button onclick="toggleTheme()" class="theme-toggle-item">
                        <i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
                        <span>${isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <hr>
                    <button onclick="logoutUser()" class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        `;
        
        // Setup dropdown toggle
        const btn = document.getElementById("user-greeting-btn");
        const menu = document.getElementById("user-dropdown-menu");
        if (btn && menu) {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                menu.style.display = menu.style.display === "block" ? "none" : "block";
            });
            
            // Close when clicking outside
            document.addEventListener("click", () => {
                menu.style.display = "none";
            });
        }
    }
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    showToast("Logged out successfully.");
}

// Check if user is already logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        updateUserArea(currentUser.name);
    }
});

// =========================
// SEARCH
// =========================

let searchInput = document.getElementById("search");

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        currentSearch = this.value;
        applyFiltersAndSort();

        let searchText = this.value.toLowerCase();
        let filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText)
        );

        let suggestions = document.getElementById("suggestions");
        suggestions.innerHTML = "";

        if (searchText !== "" && filteredProducts.length > 0) {
            suggestions.style.display = "block";
            filteredProducts.slice(0, 5).forEach(product => {
                suggestions.innerHTML += `
                    <div class="suggestion-item" onclick="selectSuggestion('${product.name.replace(/'/g, "\\'")}')" style="display: flex; align-items: center; gap: 12px; padding: 8px 15px;">
                        <img src="${product.image}" style="width: 32px; height: 32px; object-fit: contain; border-radius: 2px; border: 1px solid var(--border-soft);" referrerpolicy="no-referrer">
                        <div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <span style="font-weight: 500; color: var(--text-main);">${product.name}</span>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${product.category}</span>
                        </div>
                    </div>
                `;
            });
        } else {
            suggestions.style.display = "none";
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = "none";
        }
    });
}




// =========================
// SELECT SUGGESTION
// =========================

function selectSuggestion(name) {

    // Put selected text in search box

    document.getElementById("search").value = name;



    // Filter Products

    let filteredProducts = allProducts.filter(product =>

        product.name === name

    );



    // Display Products

    displayProducts(filteredProducts);



    // Remove Suggestions

    document.getElementById("suggestions").innerHTML = "";

}



// =========================
// CART COUNT LOGIC
// =========================

async function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (!countEl) return;

    let user = null;
    try {
        const userData = localStorage.getItem("user");
        if (userData) user = JSON.parse(userData);
    } catch (e) {
        user = null;
    }

    if (!user) {
        countEl.innerHTML = `<i class="fas fa-shopping-cart cart-icon"></i> Cart`;
        return;
    }

    try {
        const response = await fetch(`/api/cart/${user.id}`);
        if (response.ok) {
            const cartItems = await response.json();
            countEl.innerHTML = `<i class="fas fa-shopping-cart cart-icon"></i> Cart (${cartItems.length})`;
        }
    } catch (err) {
        console.error("Error updating cart count:", err);
    }
}

async function addToCart(productOrId, quantity = 1) {
    let user = null;
    try {
        const userData = localStorage.getItem("user");
        if (userData) user = JSON.parse(userData);
    } catch (e) {
        user = null;
    }

    if (!user) {
        showWarning("Please log in to add items to your cart.");
        if (typeof openLogin === 'function') {
            openLogin();
        } else {
            window.location.href = "login.html";
        }
        return;
    }

    const productId = (typeof productOrId === 'object') ? productOrId.id : productOrId;

    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                product_id: productId,
                quantity: quantity
            })
        });

        const data = await response.json();
        if (response.ok) {
            showSuccess("Product added to cart");
            await updateCartCount();
        } else {
            showError(data.error || "Failed to add item to cart");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        showError("Network error. Could not add item to cart.");
    }
}

updateCartCount();

// =========================
// WISHLIST LOGIC (LocalStorage Persistence)
// =========================
function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem("flipkart_wishlist")) || [];
    } catch (e) {
        return [];
    }
}

function saveWishlist(list) {
    localStorage.setItem("flipkart_wishlist", JSON.stringify(list));
}

function isInWishlist(productId) {
    const list = getWishlist();
    return list.some(item => Number(item.id) === Number(productId));
}

function updateWishlistCount() {
    const countEl = document.getElementById("wishlist-count");
    const badgeEl = document.getElementById("wishlist-count-badge");
    const list = getWishlist();
    const count = list.length;

    if (countEl) countEl.innerHTML = `<i class="fas fa-heart" style="color: ${count > 0 ? '#ff4343' : 'inherit'};"></i> Wishlist (${count})`;
    if (badgeEl) badgeEl.innerText = count;

    updateWishlistHeartIcons();
}

function updateWishlistHeartIcons() {
    const wishlistBtns = document.querySelectorAll(".wishlist-btn, .wishlist-icon");
    wishlistBtns.forEach(btn => {
        const pid = btn.getAttribute("data-wishlist-id") || btn.getAttribute("onclick")?.match(/\d+/)?.[0];
        if (pid) {
            if (isInWishlist(pid)) {
                btn.innerHTML = '<i class="fas fa-heart" style="color: #ff4343;"></i>';
                btn.classList.add("active");
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.classList.remove("active");
            }
        }
    });
}

function toggleWishlist(event, productOrId, element) {
    if (event) event.stopPropagation();

    let productId = null;
    let productObj = null;

    if (typeof productOrId === 'object' && productOrId !== null) {
        productObj = productOrId;
        productId = productOrId.id;
    } else {
        productId = Number(productOrId);
        if (typeof currentProductList !== 'undefined' && Array.isArray(currentProductList)) {
            productObj = currentProductList.find(p => Number(p.id) === productId);
        }
        if (!productObj && typeof currentProduct !== 'undefined' && currentProduct && Number(currentProduct.id) === productId) {
            productObj = currentProduct;
        }
        if (!productObj && typeof allProducts !== 'undefined' && Array.isArray(allProducts)) {
            productObj = allProducts.find(p => Number(p.id) === productId);
        }
    }

    if (!productId) return;

    if (!productObj) {
        productObj = {
            id: productId,
            name: "Product " + productId,
            price: 999,
            image: "https://via.placeholder.com/200",
            category: "General",
            rating: 4.2,
            reviews_count: 15
        };
    }

    let list = getWishlist();
    const index = list.findIndex(item => Number(item.id) === Number(productId));

    if (index !== -1) {
        list.splice(index, 1);
        saveWishlist(list);
        if (element) {
            element.innerHTML = '<i class="far fa-heart"></i>';
            element.classList.remove("active");
        }
        showInfo("Removed from Wishlist");
    } else {
        list.push(productObj);
        saveWishlist(list);
        if (element) {
            element.innerHTML = '<i class="fas fa-heart" style="color: #ff4343;"></i>';
            element.classList.add("active");
        }
        showSuccess("Added to Wishlist");
    }

    updateWishlistCount();

    if (typeof loadWishlist === 'function') {
        loadWishlist();
    }
}

updateWishlistCount();

// =========================
// HERO SLIDER LOGIC
// =========================

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function setSlide(index) {
    const slider = document.querySelector(".slider");
    if (slides.length === 0 || !slider) return;
    
    // Calculate translate value
    let translateValue = -(index * 100);
    slider.style.transform = `translateX(${translateValue}%)`;

    // Update dots
    dots.forEach(dot => dot.classList.remove("active"));
    currentSlide = index;
    dots[currentSlide].classList.add("active");
}

function nextSlide() {
    if (slides.length === 0) return;
    let next = (currentSlide + 1) % slides.length;
    setSlide(next);
}

function prevSlide() {
    if (slides.length === 0) return;
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    setSlide(prev);
}

// Auto Slide every 3 seconds
let slideInterval = null;
if (slides.length > 0) {
    slideInterval = setInterval(nextSlide, 3000);

    // Pause auto-slide on hover
    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
        sliderContainer.addEventListener("mouseenter", () => clearInterval(slideInterval));
        sliderContainer.addEventListener("mouseleave", () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3000);
        });
    }
}