let cart = JSON.parse(localStorage.getItem("cart")) || [];

let container = document.getElementById("cart-items");

let total = 0;

container.innerHTML = "";



// Display Cart Products
if (cart.length === 0) {
    container.innerHTML = `
        <div style="padding: 40px; text-align: center;">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/empty-cart_ee3a54.png" alt="Empty Cart" style="width: 200px; margin-bottom: 20px;">
            <h3>Your cart is empty!</h3>
            <p style="color: #878787; margin-top: 10px;">Explore our wide selection and find something you like</p>
            <button onclick="window.location.href='index.html'" style="margin-top: 20px; background: #fb641b; color: white; padding: 12px 40px; border: none; border-radius: 2px; font-weight: 600; cursor: pointer;">Shop Now</button>
        </div>
    `;
    document.querySelector('.cart-left-footer').style.display = 'none';
    document.querySelector('.cart-right').style.display = 'none';
    document.getElementById("cart-item-count").innerText = 0;
} else {
    document.getElementById("cart-item-count").innerText = cart.length;
    document.getElementById("summary-count").innerText = cart.length;

    cart.forEach(product => {
        let productTotal = product.price * product.quantity;
        let originalPrice = Math.floor(productTotal * 1.3); // Fake 30% discount

        container.innerHTML += `
            <div class="cart-product">
                <div class="cart-img-box">
                    <img src="${product.image}" alt="product">
                    <div class="quantity-buttons">
                        <button onclick="decreaseQuantity(${product.id})">-</button>
                        <span>${product.quantity}</span>
                        <button onclick="increaseQuantity(${product.id})">+</button>
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
                        <button class="save-btn" onclick="saveForLater(${product.id})">
                            <i class="far fa-bookmark"></i> Save for later
                        </button>
                        <button class="remove-btn" onclick="removeItem(${product.id})">
                            <i class="far fa-trash-alt"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    // Update Price Details Summary using the unified function
    updatePriceSummary();
}





// Increase Quantity

function increaseQuantity(id) {

    cart.forEach(product => {

        if(product.id === id) {

            product.quantity += 1;

        }

    });

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();
}





// Decrease Quantity

function decreaseQuantity(id) {

    cart.forEach(product => {

        if(product.id === id) {

            if(product.quantity > 1) {

                product.quantity -= 1;

            }

        }

    });

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();
}





// Remove Product

function removeItem(id) {
    const itemToRemove = cart.find(p => p.id === id);
    cart = cart.filter(product => product.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    
    if (itemToRemove) {
        showToast(itemToRemove.name + " removed from cart", "error");
    }
    
    setTimeout(() => {
        location.reload();
    }, 500);
}

function saveForLater(id) {
    const item = cart.find(p => p.id === id);
    if (item) {
        cart = cart.filter(p => p.id !== id);
        localStorage.setItem("cart", JSON.stringify(cart));
        showToast(item.name + " saved for later", "info");
        
        setTimeout(() => {
            location.reload();
        }, 800);
    }
}

// ==========================================
// COUPON MANAGEMENT LOGIC FOR CART SUMMARY
// ==========================================
function updatePriceSummary() {
    let subtotal = 0;
    let baseDiscount = 0;
    cart.forEach(product => {
        let productTotal = product.price * product.quantity;
        subtotal += productTotal;
        let originalPrice = Math.floor(productTotal * 1.3);
        baseDiscount += (originalPrice - productTotal);
    });

    let totalOriginalPrice = subtotal + baseDiscount;
    let finalPayable = subtotal;
    let couponDiscount = 0;

    let applied = JSON.parse(localStorage.getItem("appliedCoupon"));
    if (applied) {
        const validation = validateCouponRules(applied.code, subtotal);
        if (validation.isValid) {
            couponDiscount = validation.discount;
            finalPayable -= couponDiscount;
            
            document.getElementById("applied-coupon-info").style.display = "flex";
            document.getElementById("active-coupon-code").innerText = applied.code + ` (-₹${couponDiscount})`;
            document.getElementById("coupon-code-input").value = applied.code;
            
            localStorage.setItem("appliedCoupon", JSON.stringify({ code: applied.code, discount: couponDiscount }));
        } else {
            localStorage.removeItem("appliedCoupon");
            document.getElementById("applied-coupon-info").style.display = "none";
        }
    } else {
        document.getElementById("applied-coupon-info").style.display = "none";
    }

    document.getElementById("summary-price").innerText = "₹" + totalOriginalPrice.toLocaleString();
    let totalSavings = baseDiscount + couponDiscount;
    document.getElementById("summary-discount").innerText = totalSavings.toLocaleString();
    document.getElementById("total-price").innerText = "₹" + finalPayable.toLocaleString();
    document.getElementById("summary-savings").innerText = totalSavings.toLocaleString();
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
        cart.forEach(p => {
            if (p.category === "Mobile" || p.category === "Laptop") {
                eligibleTotal += p.price * p.quantity;
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
        cart.forEach(p => {
            if (p.category === "Beauty") {
                eligibleTotal += p.price * p.quantity;
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
    document.getElementById("coupon-code-input").value = code;
    applyCoupon();
}

function applyCoupon() {
    const codeInput = document.getElementById("coupon-code-input");
    const msgEl = document.getElementById("coupon-message");
    
    if (!codeInput) return;
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        showToast("Please enter a coupon code.", "error");
        return;
    }
    
    let subtotal = 0;
    cart.forEach(product => {
        subtotal += product.price * product.quantity;
    });
    
    const validation = validateCouponRules(code, subtotal);
    
    if (validation.isValid) {
        localStorage.setItem("appliedCoupon", JSON.stringify({ code: code, discount: validation.discount }));
        
        msgEl.style.display = "block";
        msgEl.style.color = "#388e3c";
        msgEl.innerText = `Coupon code ${code} applied successfully! Discount of ₹${validation.discount} applied.`;
        
        showToast(`Coupon ${code} applied!`, "success");
        updatePriceSummary();
    } else {
        msgEl.style.display = "block";
        msgEl.style.color = "#d32f2f";
        msgEl.innerText = validation.message;
        showToast(validation.message, "error");
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
    
    showToast("Coupon removed.", "info");
    updatePriceSummary();
}