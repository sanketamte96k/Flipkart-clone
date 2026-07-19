let container = document.getElementById("product-details");

// =========================
// Fetch and Display Product
// =========================

let currentProductList = [];

async function fetchProductDetails() {
    try {
        let response = await fetch('http://127.0.0.1:5000/products');
        currentProductList = await response.json();

        let params = new URLSearchParams(window.location.search);
        let productId = params.get("id");

        let product = currentProductList.find(item => item.id == productId);

        if (!product) {
            container.innerHTML = `<h1 style="padding:40px;">Product Not Found</h1>`;
            return;
        }

        displayProduct(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        container.innerHTML = `<h1 style="padding:40px;">Error loading product details</h1>`;
    }
}

function displayProduct(product) {
    // Set default rating if missing
    product.rating = product.rating || "4.5 ★";

    // 1. Dynamic Bank Offers based on name and category
    if (product.name.includes("Watch")) {
        product.offers = [
            "Bank Offer 10% off on Axis Bank Credit Cards, up to ₹1,250",
            "Special Price Get extra ₹1,500 off on exchange of old smartwatches",
            "Partner Offer Sign up for Flipkart Pay Later and get ₹500 Gift Voucher"
        ];
    } else if (product.name.includes("Sony") || product.name.includes("WH-1000")) {
        product.offers = [
            "Bank Offer 10% off on HDFC Bank Credit Cards, up to ₹2,000",
            "Partner Offer Get 3 Months Spotify Premium Subscription Free",
            "No Cost EMI available on major credit cards"
        ];
    } else if (product.category === "Mobile") {
        product.offers = [
            "Bank Offer 10% off on HDFC Bank Credit Card EMI Transactions, up to ₹1,500",
            "Special Price Get extra ₹3,000 off (price inclusive of cashback/coupon)",
            "Buy this Product and Get Extra ₹500 Off on Next Purchase"
        ];
    } else if (product.category === "Laptop") {
        product.offers = [
            "Bank Offer 10% off on SBI Credit Card, up to ₹1,750",
            "Exchange Offer: Up to ₹15,000 off on exchange",
            "No cost EMI starting from ₹3,333/month"
        ];
    } else if (product.category === "Fashion") {
        product.offers = [
            "Bank Offer 5% Cashback on Flipkart Axis Bank Card",
            "Special Price Get extra 10% off on select apparel & footwear",
            "Buy 2 get 10% off, Buy 3 get 15% off"
        ];
    } else {
        product.offers = [
            "Bank Offer 10% off on ICICI Bank Credit Cards, up to ₹1,250",
            "Free Delivery on first order",
            "Save ₹100 with SuperCoins on your purchase"
        ];
    }

    // 2. Respect existing backend specs if provided, else dynamically generate realistic ones
    if (!product.specs || product.specs.length === 0) {
        if (product.name.includes("Watch")) {
            product.specs = [
                ["Brand", "Apple"],
                ["Model Name", "Watch Series 8 GPS"],
                ["Dial Size", "45 mm"],
                ["Display Type", "Always-On Retina LTPO OLED"],
                ["Battery Life", "Up to 18 hours"],
                ["Water Resistant", "Yes, WR50 (50 meters)"]
            ];
        } else if (product.name.includes("Sony") || product.name.includes("WH-1000")) {
            product.specs = [
                ["Brand", "Sony"],
                ["Model Name", "WH-1000XM5 Wireless Headphones"],
                ["Headphone Type", "Over the Ear"],
                ["Connectivity", "Bluetooth 5.2 & 3.5mm Jack"],
                ["Battery Life", "Up to 30 Hours (ANC ON)"],
                ["Noise Cancelling", "Yes, Industry Leading Dual Noise Canceling"]
            ];
        } else if (product.category === "Mobile") {
            // High-fidelity fallback for mobiles
            const ram = product.name.includes("Pixel") ? "8 GB" : "12 GB";
            const storage = "128 GB";
            const processor = product.name.includes("Pixel") ? "Google Tensor G2" : "Snapdragon 8+ Gen 1";
            product.specs = [
                ["Model Name", product.name],
                ["Display Size", "16.51 cm (6.5 inch) OLED"],
                ["Processor", processor],
                ["RAM / Storage", `${ram} / ${storage}`],
                ["Battery", "4500 mAh"]
            ];
        } else if (product.category === "Laptop") {
            const ram = "8 GB";
            const storage = "512 GB SSD";
            const cpu = product.name.includes("Vivobook") ? "AMD Ryzen 5" : "Intel Core i5 12th Gen";
            product.specs = [
                ["Model Name", product.name],
                ["Processor", cpu],
                ["RAM / Storage", `${ram} / ${storage}`],
                ["Operating System", "Windows 11 Home"],
                ["Screen Size", "39.62 cm (15.6 inch) FHD Display"]
            ];
        } else if (product.category === "Fashion") {
            const material = product.name.includes("Shoes") || product.name.includes("Sneakers") ? "Mesh & Premium Leather" : "100% Premium Cotton";
            const type = product.name.includes("Shoes") || product.name.includes("Sneakers") ? "Sports & Lifestyle" : "Casual Apparel";
            let brand = product.name.split(" ")[0];
            if (product.name.startsWith("US Polo")) brand = "US Polo Assn";
            product.specs = [
                ["Brand", brand],
                ["Material", material],
                ["Product Type", type],
                ["Fit / Size", "Standard Fit"],
                ["Ideal For", "Men"]
            ];
        } else if (product.category === "Beauty") {
            const type = product.name.includes("Perfume") ? "Eau de Parfum" : "Skincare Gel";
            const size = product.name.includes("Perfume") ? "100 ml" : "50 g";
            product.specs = [
                ["Brand", product.name.split(" ")[0]],
                ["Product Type", type],
                ["Volume / Size", size],
                ["Fragrance Family", product.name.includes("Sauvage") ? "Fresh & Woody" : "Floral & Fresh"],
                ["Skin Type", "All Skin Types"]
            ];
        } else {
            product.specs = [
                ["Brand", product.name.split(" ")[0]],
                ["Warranty", "1 Year Brand Warranty"],
                ["In the Box", "1 Unit, Charging Cable, User Manual"]
            ];
        }
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let isWishlisted = wishlist.find(item => item.id === product.id);
    let heartColor = isWishlisted ? "#ff4343" : "#c2c2c2";

    let galleryImages = getProductImages(product);

    container.innerHTML = `
        <div class="product-page-container">
            <div class="product-left-section">
                <div class="gallery-wrapper">
                    <!-- Left: Gallery Thumbnails -->
                    <div class="thumbnail-container">
                        ${galleryImages.map((img, idx) => `
                            <img src="${img}" 
                                 class="thumbnail-item ${idx === 0 ? 'active' : ''}" 
                                 onmouseover="changeMainImage('${img}', this)"
                                 onclick="changeMainImage('${img}', this)"
                                 referrerpolicy="no-referrer">
                        `).join("")}
                    </div>
                    
                    <!-- Right: Main Image Box -->
                    <div class="main-image-box">
                        <img src="${product.image}" id="main-product-image" referrerpolicy="no-referrer">
                    </div>
                </div>
                
                <div class="product-action-buttons">
                    <button class="add-to-cart-btn" onclick='addToCart(${JSON.stringify(product)})'>
                        <i class="fas fa-shopping-cart"></i> ADD TO CART
                    </button>
                    <button class="buy-now-btn" onclick="window.location.href='checkout.html?id=${product.id}'">
                        <i class="fas fa-bolt"></i> BUY NOW
                    </button>
                </div>
            </div>

            <div class="product-right-section">
                <div class="product-header">
                    <span class="wishlist-btn" style="color: ${heartColor};" onclick="toggleWishlist(event, ${product.id}, this)">♥</span>
                    <div class="breadcrumb">Home > ${product.category} > ${product.name}</div>
                    <h1>${product.name}</h1>
                    <div class="rating-badge">${product.rating} (Verified Buyer)</div>
                    
                    ${product.isMinutesEligible ? `
                        <div style="background: rgba(40, 116, 240, 0.08); border: 1px solid var(--brand-primary); padding: 12px 15px; border-radius: 6px; margin: 15px 0; display: flex; align-items: center; gap: 12px; max-width: 450px;">
                            <div style="background: var(--brand-primary); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: bold;">
                                ⚡
                            </div>
                            <div>
                                <h5 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 2px;">⚡ Flipkart Minutes Eligible</h5>
                                <p style="font-size: 0.78rem; color: #388e3c; font-weight: 600; margin: 0;">Get this item delivered to your address in <strong>5 minutes!</strong></p>
                            </div>
                        </div>
                    ` : ''}
                    <div class="price-container">
                        <span class="current-price">₹${product.price.toLocaleString()}</span>
                        <span class="original-price">₹${(product.price * 1.3).toFixed(0)}</span>
                        <span class="discount-percent">30% off</span>
                    </div>
                </div>

                <div class="offers-section">
                    <h3>Available Offers</h3>
                    <ul>
                        ${product.offers.map(offer => `
                            <li>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#388e3c" style="margin-top: 2px;">
                                    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 8.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75z"/>
                                </svg>
                                <span><b>Bank Offer</b> ${offer}</span>
                            </li>
                        `).join("")}
                    </ul>
                </div>

                <div class="specs-section">
                    <h3>Specifications</h3>
                    <table class="specs-table">
                        ${product.specs.map(spec => `
                            <tr>
                                <td class="spec-label">${spec[0]}</td>
                                <td class="spec-value">${spec[1]}</td>
                            </tr>
                        `).join("")}
                    </table>
                </div>

                <div class="description-section">
                    <h3>Description</h3>
                    <p>
                        Experience the ultimate in quality and performance with the <b>${product.name}</b>. 
                        This top-rated product from our ${product.category} collection combines sleek design with 
                        powerful features to enhance your lifestyle. Includes premium materials and 
                        industry-leading performance benchmarks.
                    </p>
                </div>

                <!-- Customer Reviews Section -->
                <div class="reviews-section">
                    <div class="reviews-header">
                        <h3>Ratings & Reviews</h3>
                        <div class="rating-summary">
                            <div class="big-rating">${product.rating}</div>
                            <div class="rating-info">
                                <div>2,456 Ratings &</div>
                                <div>412 Reviews</div>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Images -->
                    <div class="customer-images">
                        <h4>Images from Customers</h4>
                        <div class="image-gallery" style="display: flex; gap: 10px; margin-top: 15px;">
                            <img src="${galleryImages[0] || product.image}" alt="user-photo" onclick="openCustomerLightbox(0)" style="width: 64px; height: 64px; object-fit: cover; background: #fff; border-radius: 4px; border: 1px solid #e0e0e0; padding: 2px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" referrerpolicy="no-referrer">
                            <img src="${galleryImages[1] || product.image}" alt="user-photo" onclick="openCustomerLightbox(1)" style="width: 64px; height: 64px; object-fit: cover; background: #fff; border-radius: 4px; border: 1px solid #e0e0e0; padding: 2px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" referrerpolicy="no-referrer">
                            <img src="${galleryImages[2] || product.image}" alt="user-photo" onclick="openCustomerLightbox(2)" style="width: 64px; height: 64px; object-fit: cover; background: #fff; border-radius: 4px; border: 1px solid #e0e0e0; padding: 2px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" referrerpolicy="no-referrer">
                            <div class="more-images" onclick="openCustomerLightbox(3)" style="width: 64px; height: 64px; background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${galleryImages[3] || product.image}'); background-size: cover; background-position: center; color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.9rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">+38</div>
                        </div>
                    </div>

                    <!-- Individual Reviews -->
                    <div class="user-reviews">
                        <div class="review-card">
                            <div class="review-header">
                                <span class="review-rating">5 ★</span>
                                <span class="review-title">Excellent Quality!</span>
                            </div>
                            <p class="review-text">Absolutely love this ${product.name}. The quality is exactly as described and it was delivered within 2 days. Highly recommend!</p>
                            <div class="review-footer">
                                <span class="user-name">Sanket Amte</span>
                                <span class="verified-buyer">✔ Verified Buyer</span>
                                <span class="review-date">Oct, 2023</span>
                            </div>
                        </div>

                        <div class="review-card">
                            <div class="review-header">
                                <span class="review-rating">4 ★</span>
                                <span class="review-title">Value for Money</span>
                            </div>
                            <p class="review-text">Good product for the price. The packaging was a bit damaged but the product inside was perfect.</p>
                            <div class="review-footer">
                                <span class="user-name">Rahul Sharma</span>
                                <span class="verified-buyer">✔ Verified Buyer</span>
                                <span class="review-date">Sept, 2023</span>
                            </div>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
        </div>
    `;
}

fetchProductDetails();



function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let countEl = document.getElementById("cart-count");
    if (countEl) {
        countEl.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cart.length})`;
    }
}

function toggleWishlist(event, productId, element) {
    if (event) event.stopPropagation();
    
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let productIndex = wishlist.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        wishlist.splice(productIndex, 1);
        element.style.color = "#c2c2c2";
    } else {
        let product = currentProductList.find(p => p.id === productId);
        if (product) {
            wishlist.push(product);
            element.style.color = "#ff4343";
        }
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// ============================================================
// Vertical Product Image Gallery Logic
// ============================================================

function changeMainImage(src, element) {
    let mainImg = document.getElementById("main-product-image");
    if (mainImg) {
        mainImg.src = src;
    }
    
    // Remove active class from all sibling thumbnails
    let thumbs = document.querySelectorAll(".thumbnail-item");
    thumbs.forEach(t => t.classList.remove("active"));
    
    // Add active class to selected thumbnail
    if (element) {
        element.classList.add("active");
    }
}

function getProductImages(product) {
    const id = parseInt(product.id);
    
    // Curated high-fidelity unique image galleries per product ID to avoid duplicates.
    const imageMap = {
        // iPhone 14 (Blue)
        1: [
            product.image,
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500",
            "https://images.unsplash.com/photo-1512054835335-4308509742df?w=500"
        ],
        // HP Pavilion Laptop
        2: [
            product.image,
            "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500",
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&sig=hp"
        ],
        // Nike Running Shoes
        3: [
            product.image,
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
        ],
        // Samsung Galaxy S23
        4: [
            product.image,
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&sig=samsung"
        ],
        // MacBook Air M2
        5: [
            product.image,
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500",
            "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500"
        ],
        // Google Pixel 7
        6: [
            product.image,
            "https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=500",
            "https://images.unsplash.com/photo-1601784551148-7347497686f4?w=500",
            "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500"
        ],
        // OnePlus 11R
        7: [
            product.image,
            "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=500",
            "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500",
            "https://images.unsplash.com/photo-1574757568689-3d8583e4144e?w=500"
        ],
        // Dell Vostro 3420
        8: [
            product.image,
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
            "https://images.unsplash.com/photo-1602080858428-5717be6add77?w=500",
            "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500"
        ],
        // ASUS Vivobook 16X
        9: [
            product.image,
            "https://images.unsplash.com/photo-1660798030915-b44e549d41d9?w=500",
            "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500&sig=asus",
            "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500&sig=asus"
        ],
        // Adidas Men's Sneakers
        10: [
            product.image,
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500",
            "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500",
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500"
        ],
        // Puma Men's T-Shirt
        11: [
            product.image,
            "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&sig=puma",
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&sig=puma",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&sig=puma"
        ],
        // Levi's Men's Jeans
        12: [
            product.image,
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500"
        ],
        // Dior Sauvage Perfume
        13: [
            product.image,
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&sig=dior",
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500",
            "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=500&sig=dior"
        ],
        // Chanel No.5 Perfume
        14: [
            product.image,
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500",
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
            "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500"
        ],
        // L'Oreal Face Cream
        15: [
            product.image,
            "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500",
            "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500"
        ],
        // Lakme Sunscreen
        16: [
            product.image,
            "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500",
            "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&sig=lakme",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&sig=lakme"
        ],
        // Bella Vita Perfume Set
        17: [
            product.image,
            "https://images.unsplash.com/photo-1588405748373-122b2321bc31?w=500",
            "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=500&sig=bellavita",
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&sig=bellavita"
        ],
        // Skechers Men's Glide
        18: [
            product.image,
            "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500"
        ],
        // Reebok Men's Floatride
        19: [
            product.image,
            "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=500",
            "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500",
            "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500"
        ],
        // Allen Solly Men's Shirt
        20: [
            product.image,
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
            "https://images.unsplash.com/photo-159833129183-c4f50c736f10?w=500",
            "https://images.unsplash.com/photo-1620012253295-c05518e993be?w=500"
        ],
        // US Polo Assn T-Shirt
        21: [
            product.image,
            "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500",
            "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500",
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500"
        ],
        // Sony WH-1000XM5
        22: [
            product.image,
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
            "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500",
            "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500"
        ],
        // Apple Watch Series 8
        23: [
            product.image,
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500",
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500",
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"
        ],
        // ON Gold Standard Whey Protein (2kg)
        24: [
            product.image,
            "images/fitness/gym_shaker.png",
            "images/fitness/creatine.png",
            "images/fitness/bcaa.png"
        ],
        // MuscleBlaze Creatine Monohydrate
        25: [
            product.image,
            "images/fitness/gym_shaker.png",
            "images/fitness/bcaa.png",
            "images/fitness/whey_protein.png"
        ],
        // Premium Stainless Steel Gym Shaker
        26: [
            product.image,
            "images/fitness/whey_protein.png",
            "images/fitness/bcaa.png",
            "images/fitness/preworkout.png"
        ],
        // C4 Original Pre-Workout (30 Servings)
        27: [
            product.image,
            "images/fitness/gym_shaker.png",
            "images/fitness/creatine.png",
            "images/fitness/multivitamin.png"
        ],
        // MuscleBlaze BCAA Pro (450g)
        28: [
            product.image,
            "images/fitness/gym_shaker.png",
            "images/fitness/creatine.png",
            "images/fitness/whey_protein.png"
        ],
        // Resistance Bands Set (5 Levels)
        29: [
            product.image,
            "images/fitness/gym_shaker.png",
            "images/fitness/multivitamin.png",
            "images/fitness/creatine.png"
        ],
        // HealthKart Daily Multivitamin (60 Tabs)
        30: [
            product.image,
            "images/fitness/creatine.png",
            "images/fitness/gym_shaker.png",
            "images/fitness/bcaa.png"
        ]
    };
    
    if (imageMap[id]) {
        return imageMap[id];
    }
    
    // Fallback if not specifically mapped
    return [
        product.image,
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500",
        "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=500"
    ];
}

// ============================================================
// Customer Images Lightbox logic
// ============================================================

let currentLightboxIndex = 0;
let customerLightboxImages = [];

function openCustomerLightbox(index) {
    let params = new URLSearchParams(window.location.search);
    let productId = params.get("id");
    let product = currentProductList.find(item => item.id == productId);
    if (!product) return;

    customerLightboxImages = getProductImages(product);
    currentLightboxIndex = index;

    // Create modal if it doesn't exist
    let modal = document.getElementById("customer-lightbox-modal");
    if (!modal) {
        // Inject styles
        const style = document.createElement("style");
        style.innerHTML = `
            .lightbox-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(15, 23, 42, 0.94);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .lightbox-modal.active {
                display: flex;
                opacity: 1;
            }
            .lightbox-content {
                position: relative;
                width: 100%;
                max-width: 700px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .lightbox-img-wrapper {
                width: 100%;
                height: 60vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #fff;
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                box-sizing: border-box;
            }
            .lightbox-img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 4px;
                animation: zoomInLight 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes zoomInLight {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .lightbox-close {
                position: absolute;
                top: -50px;
                right: 20px;
                color: #fff;
                font-size: 2.2rem;
                background: none;
                border: none;
                cursor: pointer;
                transition: transform 0.25s, color 0.25s;
            }
            .lightbox-close:hover {
                transform: scale(1.15) rotate(90deg);
                color: #ff4343;
            }
            .lightbox-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                border: 1px solid rgba(255, 255, 255, 0.25);
                color: #fff;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.25s;
                user-select: none;
            }
            .lightbox-arrow:hover {
                background: rgba(255, 255, 255, 0.25);
                border-color: #fff;
                transform: translateY(-50%) scale(1.1);
            }
            .lightbox-arrow:active {
                transform: translateY(-50%) scale(0.95);
            }
            .lightbox-arrow.left {
                left: -80px;
            }
            .lightbox-arrow.right {
                right: -80px;
            }
            .lightbox-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-top: 20px;
                color: #fff;
            }
            .lightbox-caption {
                font-size: 1rem;
                font-weight: 500;
                font-family: 'Inter', sans-serif;
            }
            .lightbox-counter {
                font-size: 0.9rem;
                opacity: 0.8;
                font-weight: 600;
                background: rgba(255, 255, 255, 0.15);
                padding: 4px 12px;
                border-radius: 12px;
            }
            @media (max-width: 900px) {
                .lightbox-arrow.left { left: 10px; }
                .lightbox-arrow.right { right: 10px; }
                .lightbox-close { top: 10px; right: 10px; font-size: 1.8rem; z-index: 10001; }
                .lightbox-img-wrapper { height: 50vh; }
                .lightbox-content { max-width: 95%; }
            }
        `;
        document.head.appendChild(style);

        // Inject HTML
        modal = document.createElement("div");
        modal.id = "customer-lightbox-modal";
        modal.className = "lightbox-modal";
        modal.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="closeCustomerLightbox()">&times;</button>
                
                <button class="lightbox-arrow left" onclick="changeCustomerLightboxSlide(-1)">❮</button>
                <button class="lightbox-arrow right" onclick="changeCustomerLightboxSlide(1)">❯</button>
                
                <div class="lightbox-img-wrapper">
                    <img id="lightbox-main-img" class="lightbox-img" src="" referrerpolicy="no-referrer">
                </div>
                
                <div class="lightbox-footer">
                    <span class="lightbox-caption" id="lightbox-main-caption">Customer Photo</span>
                    <span class="lightbox-counter" id="lightbox-main-counter">1 / 4</span>
                </div>
            </div>
        `;
        
        // Close modal when clicking outside content (on the modal backdrop)
        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                closeCustomerLightbox();
            }
        });
        
        document.body.appendChild(modal);

        // Add keyboard listener
        document.addEventListener("keydown", function(e) {
            let activeModal = document.getElementById("customer-lightbox-modal");
            if (activeModal && activeModal.classList.contains("active")) {
                if (e.key === "Escape") closeCustomerLightbox();
                if (e.key === "ArrowLeft") changeCustomerLightboxSlide(-1);
                if (e.key === "ArrowRight") changeCustomerLightboxSlide(1);
            }
        });
    }

    updateCustomerLightboxSlide();
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("active");
    }, 10);
}

function closeCustomerLightbox() {
    let modal = document.getElementById("customer-lightbox-modal");
    if (modal) {
        modal.classList.remove("active");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }
}

function changeCustomerLightboxSlide(direction) {
    if (customerLightboxImages.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + direction + customerLightboxImages.length) % customerLightboxImages.length;
    updateCustomerLightboxSlide();
}

function updateCustomerLightboxSlide() {
    let img = document.getElementById("lightbox-main-img");
    let counter = document.getElementById("lightbox-main-counter");
    let caption = document.getElementById("lightbox-main-caption");
    
    if (img && counter && caption && customerLightboxImages.length > 0) {
        img.style.animation = 'none';
        img.offsetHeight;
        img.style.animation = null;
        
        img.src = customerLightboxImages[currentLightboxIndex];
        counter.innerText = `${currentLightboxIndex + 1} / ${customerLightboxImages.length}`;
        
        const captions = [
            "Customer Review Photo - Full View",
            "Customer Review Photo - Side Angle",
            "Customer Review Photo - Quality Close-up",
            "Customer Review Photo - Product Unboxing"
        ];
        caption.innerText = captions[currentLightboxIndex] || "Customer Photo";
    }
}