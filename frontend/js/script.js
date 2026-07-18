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
// FETCH & DISPLAY PRODUCTS
// ============================================================
async function fetchProducts() {
    try {
        let response = await fetch('http://127.0.0.1:5000/products');
        allProducts = await response.json();
        applyFiltersAndSort(); // Unified entry point
        setupIntersectionObserver();
    } catch (error) {
        console.error('Error fetching products:', error);
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

    displayProducts(filtered);
    setupIntersectionObserver(); // CRITICAL for visibility
}

function filterProducts(category, btnElement) {
    currentCategory = category;
    
    // Update active state for category tabs
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    
    if (btnElement && btnElement.classList.contains('cat-tab')) {
        btnElement.classList.add('active');
    } else {
        // Find matching tab from sidebar interaction
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

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    container.innerHTML = "";
    products.forEach((product, index) => {
        const isWishlisted = wishlist.find(item => item.id === product.id);
        const heartColor = isWishlisted ? "#ff4343" : "rgba(0,0,0,0.2)";
        
        const card = document.createElement('div');
        card.className = 'product-card reveal';
        card.style.transitionDelay = `${(index % 4) * 0.1}s`;
        card.onclick = () => window.location.href = `product.html?id=${product.id}`;
        
        let offerBadge = "";
        if (product.category === "Mobile") {
            offerBadge = `<div style="position: absolute; top: 12px; left: 0; background: #ff4343; color: white; padding: 4px 8px; font-size: 0.7rem; font-weight: 700; border-radius: 0 4px 4px 0; z-index: 2; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">Sale</div>`;
        } else if (product.category === "Laptop") {
            offerBadge = `<div style="position: absolute; top: 12px; left: 0; background: #388e3c; color: white; padding: 4px 8px; font-size: 0.7rem; font-weight: 700; border-radius: 0 4px 4px 0; z-index: 2; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">Bank Offer</div>`;
        } else if (product.category === "Fashion") {
            offerBadge = `<div style="position: absolute; top: 12px; left: 0; background: #ff9f00; color: white; padding: 4px 8px; font-size: 0.7rem; font-weight: 700; border-radius: 0 4px 4px 0; z-index: 2; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">Min 50% Off</div>`;
        } else if (product.category === "Fitness") {
            offerBadge = `<div style="position: absolute; top: 12px; left: 0; background: #388e3c; color: white; padding: 4px 8px; font-size: 0.7rem; font-weight: 700; border-radius: 0 4px 4px 0; z-index: 2; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">Fitness Offer</div>`;
        }

        let minutesBadge = "";
        if (product.isMinutesEligible) {
            minutesBadge = `<div style="position: absolute; top: 38px; left: 0; background: #2874f0; color: white; padding: 4px 8px; font-size: 0.65rem; font-weight: 700; border-radius: 0 4px 4px 0; z-index: 2; box-shadow: 0 2px 4px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 4px;"><i class="fas fa-bolt"></i> 5 Min Delivery</div>`;
        }

        let originalPrice = Math.floor(product.price * 1.4); // 40% more
        let discount = 40;
        let savings = originalPrice - product.price;

        card.innerHTML = `
            ${offerBadge}
            ${minutesBadge}
            <span class="wishlist-icon" style="color: ${heartColor};" onclick="toggleWishlist(event, ${product.id}, this)">
                ${isWishlisted ? '❤️' : '🤍'}
            </span>
            <img src="${product.image}" alt="${product.name}" referrerpolicy="no-referrer">
            <h2>${product.name}</h2>
            
            <div class="price-row">
                <span class="price">₹${product.price.toLocaleString()}</span>
                <span class="original-price">₹${originalPrice.toLocaleString()}</span>
                <span class="discount-percent">${discount}% off</span>
            </div>
            
            <span class="save-msg">Get it for ₹${product.price.toLocaleString()} (Save ₹${savings.toLocaleString()})</span>

            <div class="card-footer" style="display: flex; gap: 10px; margin-top: auto;">
                <button onclick="event.stopPropagation(); window.location.href='product.html?id=${product.id}'" style="flex: 1; background: #f1f3f6; color: var(--text-main); border: 1px solid var(--border-soft); padding: 8px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.85rem;">View</button>
                <button onclick="event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" style="flex: 1; background: var(--brand-primary); color: white; border: none; padding: 8px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 0.85rem;">Add</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleWishlist(event, productId, element) {
    if (event) event.stopPropagation();
    
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const productIndex = wishlist.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        wishlist.splice(productIndex, 1);
        element.innerHTML = '🤍';
        element.style.color = "rgba(0,0,0,0.2)";
        showToast("Removed from wishlist");
    } else {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            wishlist.push(product);
            element.innerHTML = '❤️';
            element.style.color = "#ff4343";
            element.style.animation = "pulse 0.4s ease";
            showToast("Added to wishlist!");
        }
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Redundant functions removed for cleanup

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function showToast(message, type = 'success') {
    const toast = document.getElementById("toast");
    if (!toast) return;
    
    // Set message
    toast.innerText = message;
    
    // Set type classes
    toast.classList.remove('success', 'error', 'info');
    toast.classList.add(type);
    
    // Show toast
    toast.classList.add("show");
    
    // Hide after 3 seconds
    setTimeout(() => { 
        toast.classList.remove("show"); 
    }, 3000);
}

fetchProducts();


// Redundant theme logic removed


// =========================
// MODALS LOGIC
// =========================

function openLogin() {
    let modal = document.getElementById("login-modal");
    if (modal) modal.style.display = "flex";
}

function closeLogin() {
    let modal = document.getElementById("login-modal");
    if (modal) modal.style.display = "none";
}

function openSignup() {
    closeLogin();
    let modal = document.getElementById("signup-modal");
    if (modal) modal.style.display = "flex";
}

function closeSignup() {
    let modal = document.getElementById("signup-modal");
    if (modal) modal.style.display = "none";
}

function loginUser() {
    console.log("Attempting login...");
    let mobile = document.getElementById("login-mobile").value.trim();
    let password = document.getElementById("login-password").value.trim();

    if (!mobile || !password) {
        showToast("Please enter both mobile number and password.", "error");
        return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
        showToast("Please enter a valid 10-digit mobile number.", "error");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userIndex = users.findIndex(u => u.mobile === mobile && u.password === password);

    if (userIndex !== -1) {
        let user = users[userIndex];
        
        // Track login count
        user.loginCount = (user.loginCount || 0) + 1;
        users[userIndex] = user;
        localStorage.setItem("users", JSON.stringify(users));
        
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        // Personalized welcome message
        let welcomeMsg = user.loginCount === 1 
            ? "Welcome to Flipkart, " + user.name + "!"
            : "Welcome back, Sank and " + user.name + "!";
            
        showToast(welcomeMsg);
        
        closeLogin();
        updateUserArea(user.name);
    } else {
        showToast("Login failed! Try again or enter valid mobile number and password.", "error");
    }
}

function signupUser() {
    console.log("Attempting signup...");
    let name = document.getElementById("signup-name").value.trim();
    let mobile = document.getElementById("signup-mobile").value.trim();
    let password = document.getElementById("signup-password").value.trim();

    if (!name || !mobile || !password) {
        showToast("Please fill in all fields to sign up.", "error");
        return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
        showToast("Please enter a valid 10-digit mobile number.", "error");
        return;
    }

    if (password === mobile || password.toLowerCase() === name.toLowerCase()) {
        showToast("Password cannot be same as number or name.", "error");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let existingUser = users.find(u => u.mobile === mobile);

    if (existingUser) {
        console.warn("Signup failed: Mobile number already exists.");
        showToast("An account with this mobile number already exists! Please login.", "info");
        return;
    }

    // Initialize loginCount to 0 for new users
    let newUser = { name, mobile, password, loginCount: 0 };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    console.log("Signup successful for:", mobile);
    showToast("Account created successfully! Please login to continue.", "success");
    closeSignup();
    openLogin(); // Open login modal automatically
}

// Add Enter key listener for login fields
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let loginModal = document.getElementById('login-modal');
        let signupModal = document.getElementById('signup-modal');
        
        if (loginModal && loginModal.style.display === 'flex') {
            loginUser();
        } else if (signupModal && signupModal.style.display === 'flex') {
            signupUser();
        }
    }
});

// Helper to update the navbar when logged in
function updateUserArea(name) {
    let userArea = document.getElementById("user-area");
    if (userArea) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        userArea.innerHTML = `
            <div class="user-greeting" id="user-greeting-btn">
                <i class="fas fa-user-circle" style="font-size: 1.2rem;"></i>
                <span>${name}</span>
                <i class="fas fa-chevron-down" style="font-size: 0.7rem; opacity: 0.7;"></i>
                
                <div class="user-dropdown" id="user-dropdown-menu">
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

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let countEl = document.getElementById("cart-count");
    if (countEl) {
        countEl.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cart.length})`;
    }
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast(product.name + " added to cart!", "success");
}

updateCartCount();

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