let cartItems = [];

document.addEventListener("DOMContentLoaded", async () => {
    await fetchAndRenderCart();
});

async function fetchAndRenderCart() {
    let user = null;
    try {
        const userData = localStorage.getItem("user");
        if (userData) user = JSON.parse(userData);
    } catch (e) {
        user = null;
    }

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const container = document.getElementById("cart-items");
    if (!container) return;

    try {
        const response = await fetch(`/api/cart/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch cart items");

        cartItems = await response.json();
        renderCart(cartItems);
    } catch (error) {
        console.error("Error loading cart:", error);
        container.innerHTML = `<div style="padding: 20px; text-align: center; color: red;">Failed to load cart items.</div>`;
    }
}

function renderCart(items) {
    const container = document.getElementById("cart-items");
    if (!container) return;

    container.innerHTML = "";

    const cartLeftFooter = document.querySelector('.cart-left-footer');
    const cartRight = document.querySelector('.cart-right');
    const itemCountEl = document.getElementById("cart-item-count");
    const summaryCountEl = document.getElementById("summary-count");

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/empty-cart_ee3a54.png" alt="Empty Cart" style="width: 200px; margin-bottom: 20px;">
                <h3>Your cart is empty!</h3>
                <p style="color: #878787; margin-top: 10px;">Explore our wide selection and find something you like</p>
                <button onclick="window.location.href='index.html'" style="margin-top: 20px; background: #fb641b; color: white; padding: 12px 40px; border: none; border-radius: 2px; font-weight: 600; cursor: pointer;">Shop Now</button>
            </div>
        `;
        if (cartLeftFooter) cartLeftFooter.style.display = 'none';
        if (cartRight) cartRight.style.display = 'none';
        if (itemCountEl) itemCountEl.innerText = 0;
        if (summaryCountEl) summaryCountEl.innerText = 0;
        return;
    }

    if (cartLeftFooter) cartLeftFooter.style.display = 'block';
    if (cartRight) cartRight.style.display = 'block';
    if (itemCountEl) itemCountEl.innerText = items.length;
    if (summaryCountEl) summaryCountEl.innerText = items.length;

    items.forEach(item => {
        const product = item.product || { name: 'Product', price: 0, image: '' };
        const productTotal = product.price * item.quantity;
        const originalPrice = Math.floor(productTotal * 1.3);

        container.innerHTML += `
            <div class="cart-product" id="cart-item-${item.id}">
                <div class="cart-img-box">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="quantity-buttons">
                        <button onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-details">
                    <h2>${product.name}</h2>
                    <div class="cart-seller">Seller: RetailNet <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" style="height: 15px; margin-left: 5px; vertical-align: middle;"></div>
                    <div class="cart-price-row">
                        <span class="original">₹${originalPrice.toLocaleString()}</span>
                        <span class="current">₹${productTotal.toLocaleString()}</span>
                        <span class="discount">30% Off</span>
                    </div>
                    <div class="cart-actions">
                        <button class="remove-btn" onclick="removeCartItem(${item.id}, '${product.name.replace(/'/g, "\\'")}')">
                            <i class="far fa-trash-alt"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    updatePriceSummary();
}

async function updateItemQuantity(cartId, newQuantity) {
    if (newQuantity <= 0) {
        await removeCartItem(cartId);
        return;
    }

    try {
        const response = await fetch(`/api/cart/update/${cartId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (response.ok) {
            await fetchAndRenderCart();
            if (typeof updateCartCount === 'function') updateCartCount();
        } else {
            const data = await response.json();
            if (typeof showToast === 'function') showToast(data.error || "Failed to update item", "error");
        }
    } catch (err) {
        console.error("Error updating cart quantity:", err);
    }
}

async function removeCartItem(cartId, productName = "Item") {
    try {
        const response = await fetch(`/api/cart/remove/${cartId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            if (typeof showToast === 'function') showToast(`${productName} removed from cart`, "info");
            await fetchAndRenderCart();
            if (typeof updateCartCount === 'function') updateCartCount();
        } else {
            const data = await response.json();
            if (typeof showToast === 'function') showToast(data.error || "Failed to remove item", "error");
        }
    } catch (err) {
        console.error("Error removing cart item:", err);
    }
}

async function clearUserCart() {
    let user = null;
    try {
        const userData = localStorage.getItem("user");
        if (userData) user = JSON.parse(userData);
    } catch (e) {
        user = null;
    }

    if (!user) return;

    try {
        const response = await fetch(`/api/cart/clear/${user.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            if (typeof showToast === 'function') showToast("Cart cleared", "info");
            await fetchAndRenderCart();
            if (typeof updateCartCount === 'function') updateCartCount();
        }
    } catch (err) {
        console.error("Error clearing cart:", err);
    }
}

function updatePriceSummary() {
    let subtotal = 0;
    let baseDiscount = 0;

    cartItems.forEach(item => {
        const product = item.product || { price: 0 };
        let productTotal = product.price * item.quantity;
        subtotal += productTotal;
        let originalPrice = Math.floor(productTotal * 1.3);
        baseDiscount += (originalPrice - productTotal);
    });

    let totalOriginalPrice = subtotal + baseDiscount;
    let finalPayable = subtotal;
    let couponDiscount = 0;

    let applied = null;
    try {
        applied = JSON.parse(localStorage.getItem("appliedCoupon"));
    } catch(e) {}

    const couponInfoEl = document.getElementById("applied-coupon-info");
    const activeCouponCodeEl = document.getElementById("active-coupon-code");
    const couponCodeInputEl = document.getElementById("coupon-code-input");

    if (applied) {
        const validation = validateCouponRules(applied.code, subtotal);
        if (validation.isValid) {
            couponDiscount = validation.discount;
            finalPayable -= couponDiscount;

            if (couponInfoEl) couponInfoEl.style.display = "flex";
            if (activeCouponCodeEl) activeCouponCodeEl.innerText = applied.code + ` (-₹${couponDiscount})`;
            if (couponCodeInputEl) couponCodeInputEl.value = applied.code;
            
            localStorage.setItem("appliedCoupon", JSON.stringify({ code: applied.code, discount: couponDiscount }));
        } else {
            localStorage.removeItem("appliedCoupon");
            if (couponInfoEl) couponInfoEl.style.display = "none";
        }
    } else {
        if (couponInfoEl) couponInfoEl.style.display = "none";
    }

    const summaryPriceEl = document.getElementById("summary-price");
    const summaryDiscountEl = document.getElementById("summary-discount");
    const totalPriceEl = document.getElementById("total-price");
    const summarySavingsEl = document.getElementById("summary-savings");

    if (summaryPriceEl) summaryPriceEl.innerText = "₹" + totalOriginalPrice.toLocaleString();
    let totalSavings = baseDiscount + couponDiscount;
    if (summaryDiscountEl) summaryDiscountEl.innerText = totalSavings.toLocaleString();
    if (totalPriceEl) totalPriceEl.innerText = "₹" + finalPayable.toLocaleString();
    if (summarySavingsEl) summarySavingsEl.innerText = totalSavings.toLocaleString();
}

function validateCouponRules(code, cartTotal) {
    code = code.trim().toUpperCase();
    
    if (code === "WELCOME100") {
        if (cartTotal >= 499) {
            return { isValid: true, discount: 100 };
        } else {
            return { isValid: false, message: "WELCOME100 requires a minimum order value of ₹499." };
        }
    }
    
    if (code === "FLIPKART10") {
        let eligibleTotal = 0;
        cartItems.forEach(item => {
            const p = item.product;
            if (p && (p.category === "Mobile" || p.category === "Laptop")) {
                eligibleTotal += p.price * item.quantity;
            }
        });
        
        if (eligibleTotal === 0) {
            return { isValid: false, message: "FLIPKART10 is only applicable on Laptops and Mobiles." };
        }
        
        if (cartTotal >= 9999) {
            let discount = Math.floor(eligibleTotal * 0.1);
            if (discount > 2000) discount = 2000;
            return { isValid: true, discount: discount };
        } else {
            return { isValid: false, message: "FLIPKART10 requires a minimum order value of ₹9,999." };
        }
    }
    
    if (code === "BEAUTY150") {
        let eligibleTotal = 0;
        cartItems.forEach(item => {
            const p = item.product;
            if (p && p.category === "Beauty") {
                eligibleTotal += p.price * item.quantity;
            }
        });
        
        if (eligibleTotal === 0) {
            return { isValid: false, message: "BEAUTY150 is only applicable on Beauty & Personal Care items." };
        }
        
        if (cartTotal >= 899) {
            return { isValid: true, discount: 150 };
        } else {
            return { isValid: false, message: "BEAUTY150 requires a minimum order value of ₹899." };
        }
    }
    
    return { isValid: false, message: "Invalid coupon code." };
}

function toggleCouponsList() {
    const drawer = document.getElementById("available-coupons-drawer");
    if (drawer) {
        drawer.style.display = (drawer.style.display === "flex" || drawer.style.display === "block") ? "none" : "flex";
    }
}

function quickApplyCoupon(code) {
    const input = document.getElementById("coupon-code-input");
    if (input) input.value = code;
    applyCoupon();
}

function applyCoupon() {
    const codeInput = document.getElementById("coupon-code-input");
    const msgEl = document.getElementById("coupon-message");
    
    if (!codeInput) return;
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        if (typeof showToast === 'function') showToast("Please enter a coupon code.", "error");
        return;
    }
    
    let subtotal = 0;
    cartItems.forEach(item => {
        const p = item.product || { price: 0 };
        subtotal += p.price * item.quantity;
    });
    
    const validation = validateCouponRules(code, subtotal);
    
    if (validation.isValid) {
        localStorage.setItem("appliedCoupon", JSON.stringify({ code: code, discount: validation.discount }));
        
        if (msgEl) {
            msgEl.style.display = "block";
            msgEl.style.color = "#388e3c";
            msgEl.innerText = `Coupon code ${code} applied successfully! Discount of ₹${validation.discount} applied.`;
        }
        
        if (typeof showToast === 'function') showToast(`Coupon ${code} applied!`, "success");
        updatePriceSummary();
    } else {
        if (msgEl) {
            msgEl.style.display = "block";
            msgEl.style.color = "#d32f2f";
            msgEl.innerText = validation.message;
        }
        if (typeof showToast === 'function') showToast(validation.message, "error");
    }
}

function removeCoupon() {
    localStorage.removeItem("appliedCoupon");
    
    const codeInput = document.getElementById("coupon-code-input");
    if (codeInput) codeInput.value = "";
    
    const msgEl = document.getElementById("coupon-message");
    if (msgEl) {
        msgEl.style.display = "none";
        msgEl.innerText = "";
    }
    
    if (typeof showToast === 'function') showToast("Coupon removed.", "info");
    updatePriceSummary();
}