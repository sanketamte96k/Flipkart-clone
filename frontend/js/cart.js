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
    let totalDiscount = 0;
    document.getElementById("cart-item-count").innerText = cart.length;
    document.getElementById("summary-count").innerText = cart.length;

    cart.forEach(product => {
        let productTotal = product.price * product.quantity;
        total += productTotal;
        let originalPrice = Math.floor(productTotal * 1.3); // Fake 30% discount
        let discountAmt = originalPrice - productTotal;
        totalDiscount += discountAmt;

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

    // Update Price Details Summary
    let totalOriginalPrice = total + totalDiscount;
    document.getElementById("summary-price").innerText = "₹" + totalOriginalPrice.toLocaleString();
    document.getElementById("summary-discount").innerText = totalDiscount.toLocaleString();
    document.getElementById("total-price").innerText = "₹" + total.toLocaleString();
    document.getElementById("summary-savings").innerText = totalDiscount.toLocaleString();
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
        // Simple logic: remove from cart and show toast
        // In a real app, this would move to a separate 'saved' list
        cart = cart.filter(p => p.id !== id);
        localStorage.setItem("cart", JSON.stringify(cart));
        showToast(item.name + " saved for later", "info");
        
        setTimeout(() => {
            location.reload();
        }, 800);
    }
}