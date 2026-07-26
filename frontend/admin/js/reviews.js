/* ============================================================
   FLIPKART CLONE - ADMIN REVIEWS MANAGEMENT JS LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initLayoutToggles();
    initReviewsManager();
});

/* ============================================================
   THEME TOGGLE SYSTEM
   ============================================================ */
function initTheme() {
    const themeBtn = document.getElementById("theme-btn");
    const bodyEl = document.body;
    const savedTheme = localStorage.getItem("admin-theme") || "light";
    if (savedTheme === "dark") {
        bodyEl.classList.add("dark-mode");
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    themeBtn.addEventListener("click", () => {
        const isDark = bodyEl.classList.toggle("dark-mode");
        localStorage.setItem("admin-theme", isDark ? "dark" : "light");
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        // Rebuild charts for theme color updates
        if (typeof rebuildCharts === "function") rebuildCharts();
    });
}

/* ============================================================
   LAYOUT HANDLERS
   ============================================================ */
function initLayoutToggles() {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("active");
        });
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 991 && sidebar.classList.contains("active")) {
                if (!sidebar.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove("active");
                }
            }
        });
    }

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
}

/* ============================================================
   REVIEWS MANAGEMENT CONTROLLER
   ============================================================ */
function initReviewsManager() {
    // Mock Reviews Database
    let reviewsList = [
        {
            id: "REV001",
            productName: "Sony WH-1000XM5 Wireless Headphones",
            productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
            productCategory: "Electronics",
            customerName: "Rajesh Kumar",
            customerEmail: "rajesh.kumar@email.com",
            rating: 5,
            title: "Best noise cancellation headphones ever!",
            text: "These headphones are incredible. The noise cancellation is top-notch, the sound quality is crystal clear, and the comfort level is unmatched. Battery life easily lasts 30+ hours. Worth every penny spent. Highly recommended for daily commuters and music lovers.",
            images: [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop"
            ],
            date: "2026-07-19",
            status: "Approved",
            moderationHistory: [
                { action: "Approved", by: "Sanket Amte (Admin)", date: "2026-07-19 03:15 PM", note: "Genuine review with images" }
            ]
        },
        {
            id: "REV002",
            productName: "Samsung Galaxy S23 Ultra 5G",
            productImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop",
            productCategory: "Electronics",
            customerName: "Priya Sharma",
            customerEmail: "priya.sharma@email.com",
            rating: 4,
            title: "Great phone with amazing camera",
            text: "The camera quality is stunning, especially the 200MP sensor. Night mode is brilliant. Only drawback is it's slightly heavy for one-handed use. The S Pen integration is a nice bonus. Overall a fantastic flagship phone.",
            images: [],
            date: "2026-07-18",
            status: "Approved",
            moderationHistory: [
                { action: "Approved", by: "Sanket Amte (Admin)", date: "2026-07-18 11:30 AM", note: "" }
            ]
        },
        {
            id: "REV003",
            productName: "Levi's Men's 511 Slim Fit Jeans",
            productImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
            productCategory: "Fashion",
            customerName: "Amit Deshmukh",
            customerEmail: "amit.desh@email.com",
            rating: 3,
            title: "Decent quality but sizing is off",
            text: "The fabric quality is good but the sizing runs a bit smaller than expected. Had to exchange for a larger size. Color is exactly as shown. Stitching quality could be better for the price point.",
            images: [
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop"
            ],
            date: "2026-07-17",
            status: "Pending",
            moderationHistory: []
        },
        {
            id: "REV004",
            productName: "Apple Watch Series 8 GPS",
            productImage: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=100&h=100&fit=crop",
            productCategory: "Electronics",
            customerName: "Sneha Patel",
            customerEmail: "sneha.p@email.com",
            rating: 5,
            title: "Perfect smartwatch for fitness tracking",
            text: "Love the health monitoring features! The crash detection and temperature sensing are innovative additions. The always-on display is bright even outdoors. Pairs seamlessly with my iPhone. Battery lasts about 18 hours with heavy usage.",
            images: [],
            date: "2026-07-16",
            status: "Approved",
            moderationHistory: [
                { action: "Approved", by: "Sanket Amte (Admin)", date: "2026-07-16 09:45 AM", note: "Verified purchase review" }
            ]
        },
        {
            id: "REV005",
            productName: "L'Oreal Paris Revitalift Hyaluronic Acid Serum",
            productImage: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100&h=100&fit=crop",
            productCategory: "Beauty",
            customerName: "Ananya Gupta",
            customerEmail: "ananya.g@email.com",
            rating: 4,
            title: "Noticeable results in just 2 weeks",
            text: "My skin feels much more hydrated and plump after using this serum regularly. The texture is lightweight and absorbs quickly. No irritation on sensitive skin. The packaging could be better though - the dropper sometimes gets stuck.",
            images: [
                "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop"
            ],
            date: "2026-07-15",
            status: "Approved",
            moderationHistory: [
                { action: "Approved", by: "Sanket Amte (Admin)", date: "2026-07-15 04:00 PM", note: "" }
            ]
        },
        {
            id: "REV006",
            productName: "Puma Softride Running Shoes",
            productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
            productCategory: "Fashion",
            customerName: "Vikram Singh",
            customerEmail: "vikram.s@email.com",
            rating: 1,
            title: "Terrible quality - sole came off in 2 weeks",
            text: "Extremely disappointed. The sole started separating from the shoe within just 2 weeks of regular use. The cushioning went flat very quickly. Not worth the price at all. Definitely would not recommend. Requesting a refund immediately.",
            images: [],
            date: "2026-07-14",
            status: "Pending",
            moderationHistory: []
        },
        {
            id: "REV007",
            productName: "Mi Smart Air Fryer",
            productImage: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=100&h=100&fit=crop",
            productCategory: "Home & Kitchen",
            customerName: "Meera Nair",
            customerEmail: "meera.n@email.com",
            rating: 5,
            title: "Changed how I cook everyday",
            text: "This air fryer is a game changer! Everything comes out perfectly crispy with minimal oil. The app connectivity is super convenient. Can cook for a family of 4 easily. Very easy to clean. Best kitchen purchase this year.",
            images: [
                "https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=200&h=200&fit=crop"
            ],
            date: "2026-07-13",
            status: "Approved",
            moderationHistory: [
                { action: "Approved", by: "Sanket Amte (Admin)", date: "2026-07-13 10:30 AM", note: "Great detailed review" }
            ]
        },
        {
            id: "REV008",
            productName: "Philips Series 3000 Beard Trimmer",
            productImage: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=100&h=100&fit=crop",
            productCategory: "Beauty",
            customerName: "Rohan Das",
            customerEmail: "rohan.d@email.com",
            rating: 4,
            title: "Good trimmer with long battery life",
            text: "Performs well for daily trimming. The DuraPower technology really extends battery life. Multiple length settings are convenient. The self-sharpening blades work as advertised. Only wish it came with a travel pouch.",
            images: [],
            date: "2026-07-12",
            status: "Pending",
            moderationHistory: []
        },
        {
            id: "REV009",
            productName: "Nike Air Max Sports Shoes",
            productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
            productCategory: "Fashion",
            customerName: "Deepika Verma",
            customerEmail: "deepika.v@email.com",
            rating: 5,
            title: "Most comfortable sneakers I've owned",
            text: "The Air Max cushioning is phenomenal. Perfect for both running and casual wear. The design gets compliments everywhere I go. True to size and very breathable. Already planning to buy another pair in a different color.",
            images: [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
                "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop"
            ],
            date: "2026-07-11",
            status: "Approved",
            moderationHistory: [
                { action: "Approved", by: "Sanket Amte (Admin)", date: "2026-07-12 02:20 PM", note: "" }
            ]
        },
        {
            id: "REV010",
            productName: "HP Laptop Sleeve Case",
            productImage: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=100&h=100&fit=crop",
            productCategory: "Electronics",
            customerName: "Karan Mehta",
            customerEmail: "karan.m@email.com",
            rating: 2,
            title: "Cheap material, zipper broke quickly",
            text: "The sleeve looks nice but the material is quite thin and offers minimal protection. The zipper stopped working after just 3 uses. Not suitable for daily laptop carrying. Very disappointing for an HP branded product.",
            images: [],
            date: "2026-07-10",
            status: "Rejected",
            moderationHistory: [
                { action: "Rejected", by: "Sanket Amte (Admin)", date: "2026-07-10 05:15 PM", note: "Contains unverifiable product defect claims" }
            ]
        },
        {
            id: "REV011",
            productName: "Samsung Galaxy S23 Ultra 5G",
            productImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop",
            productCategory: "Electronics",
            customerName: "Lakshmi Iyer",
            customerEmail: "lakshmi.i@email.com",
            rating: 5,
            title: "Absolute beast of a phone",
            text: "Upgraded from S21 and the difference is night and day. The 200MP camera is insane. Gaming performance is butter smooth. The display quality is the best I've seen on any phone. Worth the premium price tag. Samsung has outdone themselves.",
            images: [],
            date: "2026-07-09",
            status: "Approved",
            moderationHistory: [
                { action: "Approved", by: "Sanket Amte (Admin)", date: "2026-07-09 01:30 PM", note: "" }
            ]
        },
        {
            id: "REV012",
            productName: "Sony WH-1000XM5 Wireless Headphones",
            productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
            productCategory: "Electronics",
            customerName: "Arjun Reddy",
            customerEmail: "arjun.r@email.com",
            rating: 4,
            title: "Great ANC but lacks bass punch",
            text: "The noise cancellation is superb and arguably the best in the market. Comfort is excellent for long listening sessions. However, audiophiles might find the bass slightly lacking compared to the XM4. Overall still an excellent purchase.",
            images: [],
            date: "2026-07-08",
            status: "Pending",
            moderationHistory: []
        },
        {
            id: "REV013",
            productName: "Levi's Men's 511 Slim Fit Jeans",
            productImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
            productCategory: "Fashion",
            customerName: "Surbhi Jain",
            customerEmail: "surbhi.j@email.com",
            rating: 2,
            title: "Color faded after first wash",
            text: "Very disappointed with the color retention. Despite following all washing instructions, the indigo color faded significantly after the very first wash. The fit was nice but quality doesn't justify the price. Expected better from Levi's.",
            images: [],
            date: "2026-07-07",
            status: "Pending",
            moderationHistory: []
        },
        {
            id: "REV014",
            productName: "Mi Smart Air Fryer",
            productImage: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=100&h=100&fit=crop",
            productCategory: "Home & Kitchen",
            customerName: "Pooja Malhotra",
            customerEmail: "pooja.m@email.com",
            rating: 3,
            title: "Good product with some shortcomings",
            text: "The air fryer works well for most recipes but the basket is smaller than expected. The non-stick coating started chipping after 2 months of use. The app features are useful but could be more intuitive. Decent value for money.",
            images: [],
            date: "2026-07-06",
            status: "Approved",
            moderationHistory: [
                { action: "Approved", by: "Sanket Amte (Admin)", date: "2026-07-07 08:00 AM", note: "Balanced review" }
            ]
        },
        {
            id: "REV015",
            productName: "L'Oreal Paris Revitalift Hyaluronic Acid Serum",
            productImage: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100&h=100&fit=crop",
            productCategory: "Beauty",
            customerName: "Shreya Kapoor",
            customerEmail: "shreya.k@email.com",
            rating: 5,
            title: "Holy grail skincare product!",
            text: "This serum has completely transformed my skincare routine. My fine lines are visibly reduced and skin looks so much more radiant. The 1.5% hyaluronic acid concentration is perfect. I've repurchased this 3 times already. Absolute must-have!",
            images: [
                "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop"
            ],
            date: "2026-07-05",
            status: "Approved",
            moderationHistory: [
                { action: "Approved", by: "Sanket Amte (Admin)", date: "2026-07-05 06:00 PM", note: "Repeat customer, trusted review" }
            ]
        }
    ];

    // State
    let filteredReviews = [...reviewsList];
    let currentPage = 1;
    const rowsPerPage = 10;
    let selectedReviewId = null;
    let ratingTrendChart = null;

    // DOM elements
    const tableBody = document.getElementById("reviews-table-body");
    const showingText = document.getElementById("showing-text");
    const paginationContainer = document.getElementById("pagination-container");

    const totalReviewsEl = document.getElementById("total-reviews-cnt");
    const pendingEl = document.getElementById("pending-reviews-cnt");
    const approvedEl = document.getElementById("approved-reviews-cnt");
    const rejectedEl = document.getElementById("rejected-reviews-cnt");
    const avgRatingEl = document.getElementById("avg-rating-cnt");

    const searchProductInput = document.getElementById("r-search-product");
    const searchCustomerInput = document.getElementById("r-search-customer");
    const ratingFilter = document.getElementById("r-filter-rating");
    const statusFilter = document.getElementById("r-filter-status");
    const dateFilter = document.getElementById("r-filter-date");
    const sortFilter = document.getElementById("r-sort");

    const btnClearFilters = document.getElementById("btn-clear-filters");
    const btnRefresh = document.getElementById("btn-refresh");
    const btnExport = document.getElementById("btn-export");

    const viewModal = document.getElementById("view-review-modal");
    const moderationModal = document.getElementById("moderation-modal");
    const deleteModal = document.getElementById("delete-confirm-modal");

    // Expose chart rebuild for theme toggle
    window.rebuildCharts = function() {
        buildAnalytics();
    };

    // Init
    initModalCloseListeners();
    initFilters();
    initCSVExport();
    updateDashboard();
    fetchAdminReviews();

    async function fetchAdminReviews() {
        try {
            const response = await fetch('/api/admin/reviews');
            if (response.ok) {
                const apiReviews = await response.json();
                if (apiReviews && apiReviews.length > 0) {
                    reviewsList = apiReviews.map(r => ({
                        id: `REV${r.id}`,
                        rawId: r.id,
                        productName: r.product_name || `Product #${r.product_id}`,
                        productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
                        productCategory: "General",
                        customerName: r.user_name || `Customer #${r.user_id}`,
                        customerEmail: `user${r.user_id}@example.com`,
                        rating: r.rating,
                        title: `${r.rating} Star Review`,
                        text: r.review_text,
                        images: [],
                        date: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                        status: "Approved",
                        moderationHistory: []
                    }));
                    updateDashboard();
                }
            }
        } catch (e) {
            console.error("Error fetching admin reviews:", e);
        }
    }

    /* ============================================================
       METRICS
       ============================================================ */
    function updateDashboard() {
        const total = reviewsList.length;
        const pending = reviewsList.filter(r => r.status === "Pending").length;
        const approved = reviewsList.filter(r => r.status === "Approved").length;
        const rejected = reviewsList.filter(r => r.status === "Rejected").length;

        let avgRating = 0;
        if (total > 0) {
            const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
            avgRating = (sum / total).toFixed(1);
        }

        totalReviewsEl.innerText = total;
        pendingEl.innerText = pending;
        approvedEl.innerText = approved;
        rejectedEl.innerText = rejected;
        avgRatingEl.innerHTML = `${avgRating} <i class="fas fa-star" style="font-size: 0.85rem; color: var(--brand-gold);"></i>`;

        buildAnalytics();
        applyFiltersAndRender();
    }

    /* ============================================================
       ANALYTICS BUILDERS
       ============================================================ */
    function buildAnalytics() {
        buildRatingDistribution();
        buildRatingTrendChart();
        buildMostReviewedList();
    }

    function buildRatingDistribution() {
        const container = document.getElementById("rating-dist-container");
        container.innerHTML = "";
        const total = reviewsList.length;

        for (let star = 5; star >= 1; star--) {
            const count = reviewsList.filter(r => r.rating === star).length;
            const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;

            const row = document.createElement("div");
            row.className = "rating-bar-row";
            row.innerHTML = `
                <span class="rating-bar-label">${star} <i class="fas fa-star"></i></span>
                <div class="rating-bar-track">
                    <div class="rating-bar-fill star-${star}" style="width: ${pct}%;"></div>
                </div>
                <span class="rating-bar-count">${count}</span>
            `;
            container.appendChild(row);
        }
    }

    function buildRatingTrendChart() {
        const ctx = document.getElementById("rating-trend-chart");
        if (!ctx) return;

        // Monthly average ratings (mock trend data)
        const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
        const avgRatings = [3.8, 4.0, 3.9, 4.2, 4.1, 4.3];

        const isDark = document.body.classList.contains("dark-mode");
        const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
        const textColor = isDark ? "#94a3b8" : "#64748b";

        if (ratingTrendChart) ratingTrendChart.destroy();

        ratingTrendChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: months,
                datasets: [{
                    label: "Avg Rating",
                    data: avgRatings,
                    borderColor: "#f59e0b",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    borderWidth: 2,
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: "#f59e0b",
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { size: 11, weight: 600 } }
                    },
                    y: {
                        min: 1, max: 5,
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { size: 11, weight: 600 }, stepSize: 1 }
                    }
                }
            }
        });
    }

    function buildMostReviewedList() {
        const container = document.getElementById("most-reviewed-list");
        container.innerHTML = "";

        // Count reviews per product
        const productCounts = {};
        reviewsList.forEach(r => {
            productCounts[r.productName] = (productCounts[r.productName] || 0) + 1;
        });

        // Sort by count descending
        const sorted = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        sorted.forEach((item, index) => {
            const el = document.createElement("div");
            el.className = "top-list-item";
            el.innerHTML = `
                <span class="top-list-rank">${index + 1}</span>
                <span class="top-list-name" title="${item[0]}">${item[0].split(" (")[0]}</span>
                <span class="top-list-count">${item[1]} reviews</span>
            `;
            container.appendChild(el);
        });
    }

    /* ============================================================
       CSV EXPORT
       ============================================================ */
    function initCSVExport() {
        if (btnExport) {
            btnExport.addEventListener("click", () => {
                if (filteredReviews.length === 0) {
                    showToast("No reviews available to export.");
                    return;
                }

                const headers = ["Review ID", "Product Name", "Category", "Customer Name", "Customer Email", "Rating", "Title", "Review Text", "Date", "Status"];
                let csvRows = [headers.join(",")];

                filteredReviews.forEach(r => {
                    const row = [
                        r.id,
                        `"${r.productName.replace(/"/g, '""')}"`,
                        r.productCategory,
                        `"${r.customerName}"`,
                        r.customerEmail,
                        r.rating,
                        `"${r.title.replace(/"/g, '""')}"`,
                        `"${r.text.replace(/"/g, '""').substring(0, 200)}"`,
                        r.date,
                        r.status
                    ];
                    csvRows.push(row.join(","));
                });

                const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `flipkart_admin_reviews_${Date.now()}.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast("Reviews exported to CSV.");
            });
        }
    }

    /* ============================================================
       FILTERS & SORT
       ============================================================ */
    function initFilters() {
        [searchProductInput, searchCustomerInput, ratingFilter, statusFilter, dateFilter, sortFilter].forEach(input => {
            if (input) {
                input.addEventListener("input", () => { currentPage = 1; applyFiltersAndRender(); });
            }
        });

        if (btnClearFilters) {
            btnClearFilters.addEventListener("click", () => {
                searchProductInput.value = "";
                searchCustomerInput.value = "";
                ratingFilter.value = "All";
                statusFilter.value = "All";
                dateFilter.value = "";
                sortFilter.value = "date-desc";
                currentPage = 1;
                applyFiltersAndRender();
                showToast("Filters cleared.");
            });
        }

        if (btnRefresh) {
            btnRefresh.addEventListener("click", () => {
                const icon = btnRefresh.querySelector("i");
                icon.classList.add("spin");
                btnRefresh.disabled = true;
                tableBody.style.opacity = 0.4;
                setTimeout(() => {
                    icon.classList.remove("spin");
                    btnRefresh.disabled = false;
                    tableBody.style.opacity = 1;
                    searchProductInput.value = "";
                    searchCustomerInput.value = "";
                    ratingFilter.value = "All";
                    statusFilter.value = "All";
                    dateFilter.value = "";
                    sortFilter.value = "date-desc";
                    currentPage = 1;
                    updateDashboard();
                    showToast("Reviews refreshed.");
                }, 500);
            });
        }
    }

    function applyFiltersAndRender() {
        filteredReviews = [...reviewsList];

        const productQuery = searchProductInput.value.toLowerCase().trim();
        if (productQuery) filteredReviews = filteredReviews.filter(r => r.productName.toLowerCase().includes(productQuery));

        const customerQuery = searchCustomerInput.value.toLowerCase().trim();
        if (customerQuery) filteredReviews = filteredReviews.filter(r => r.customerName.toLowerCase().includes(customerQuery));

        const ratingVal = ratingFilter.value;
        if (ratingVal !== "All") filteredReviews = filteredReviews.filter(r => r.rating === parseInt(ratingVal));

        const statusVal = statusFilter.value;
        if (statusVal !== "All") filteredReviews = filteredReviews.filter(r => r.status === statusVal);

        const dateVal = dateFilter.value;
        if (dateVal) filteredReviews = filteredReviews.filter(r => r.date === dateVal);

        const sortVal = sortFilter.value;
        filteredReviews.sort((a, b) => {
            if (sortVal === "date-desc") return new Date(b.date) - new Date(a.date);
            if (sortVal === "date-asc") return new Date(a.date) - new Date(b.date);
            if (sortVal === "rating-high") return b.rating - a.rating;
            if (sortVal === "rating-low") return a.rating - b.rating;
            return 0;
        });

        renderTable();
    }

    /* ============================================================
       TABLE RENDERER
       ============================================================ */
    function renderTable() {
        tableBody.innerHTML = "";
        const totalRows = filteredReviews.length;

        if (totalRows === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="8" style="padding: 0;">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-star-half-alt"></i></div>
                        <h4 class="empty-state-title">No Reviews Found</h4>
                        <p class="empty-state-desc">No customer reviews match the current filter criteria.</p>
                        <button type="button" class="clear-filters-btn" id="btn-empty-clear" style="margin-top: 8px;">
                            <i class="fas fa-undo"></i> Clear All Filters
                        </button>
                    </div>
                </td></tr>`;
            const emptyClear = document.getElementById("btn-empty-clear");
            if (emptyClear) emptyClear.addEventListener("click", () => btnClearFilters.click());
            showingText.innerText = "Showing 0 of 0 reviews";
            paginationContainer.innerHTML = "";
            return;
        }

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
        const page = filteredReviews.slice(startIndex, endIndex);

        showingText.innerText = `Showing ${startIndex + 1}-${endIndex} of ${totalRows} reviews`;

        page.forEach(r => {
            const stars = renderStarsHTML(r.rating, "table-stars");
            const dateObj = new Date(r.date);
            const formattedDate = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });

            const tr = document.createElement("tr");
            tr.id = `row-review-${r.id}`;
            tr.innerHTML = `
                <td><span style="font-family: monospace; font-weight: 600; color: var(--brand-primary);">${r.id}</span></td>
                <td>
                    <div class="product-cell">
                        <img src="${r.productImage}" alt="" class="product-cell-img">
                        <span class="product-cell-name" title="${r.productName}">${r.productName.length > 25 ? r.productName.substring(0, 25) + '...' : r.productName}</span>
                    </div>
                </td>
                <td><span style="font-weight: 500;">${r.customerName}</span></td>
                <td>${stars}</td>
                <td><span class="review-truncated" title="${r.title}">${r.title}</span></td>
                <td><span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">${formattedDate}</span></td>
                <td><span class="status-badge ${r.status.toLowerCase()}">${r.status}</span></td>
                <td>
                    <div class="action-actions-cell">
                        <button type="button" class="row-action-btn view-btn" data-id="${r.id}" title="View Full Review"><i class="fas fa-eye"></i></button>
                        ${r.status === "Pending" ? `<button type="button" class="row-action-btn approve-btn" data-id="${r.id}" title="Approve Review"><i class="fas fa-check"></i></button>` : ''}
                        ${r.status !== "Rejected" ? `<button type="button" class="row-action-btn reject-btn" data-id="${r.id}" title="Reject Review"><i class="fas fa-ban"></i></button>` : ''}
                        <button type="button" class="row-action-btn delete-btn" data-id="${r.id}" title="Delete Review"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        bindTableActions();
        renderPagination(totalRows);
    }

    function renderStarsHTML(rating, className) {
        let html = `<span class="${className}">`;
        for (let i = 1; i <= 5; i++) {
            html += `<i class="fas fa-star ${i > rating ? 'empty' : ''}"></i>`;
        }
        html += '</span>';
        return html;
    }

    function bindTableActions() {
        tableBody.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", () => openViewModal(btn.dataset.id));
        });
        tableBody.querySelectorAll(".approve-btn").forEach(btn => {
            btn.addEventListener("click", () => openModerationModal(btn.dataset.id, "Approve"));
        });
        tableBody.querySelectorAll(".reject-btn").forEach(btn => {
            btn.addEventListener("click", () => openModerationModal(btn.dataset.id, "Reject"));
        });
        tableBody.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => openDeleteModal(btn.dataset.id));
        });
    }

    /* ============================================================
       PAGINATION
       ============================================================ */
    function renderPagination(totalRows) {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        if (totalPages <= 1) return;

        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "pagination-btn";
        prevBtn.disabled = currentPage === 1;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderTable(); } });
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.type = "button";
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.innerText = i;
            pageBtn.addEventListener("click", () => { currentPage = i; renderTable(); });
            paginationContainer.appendChild(pageBtn);
        }

        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "pagination-btn";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener("click", () => { if (currentPage < totalPages) { currentPage++; renderTable(); } });
        paginationContainer.appendChild(nextBtn);
    }

    /* ============================================================
       VIEW REVIEW MODAL
       ============================================================ */
    function openViewModal(id) {
        const r = reviewsList.find(item => item.id === id);
        if (!r) return;

        document.getElementById("detail-product-img").src = r.productImage;
        document.getElementById("detail-product-name").innerText = r.productName;
        document.getElementById("detail-product-category").innerText = r.productCategory;

        document.getElementById("detail-customer-name").innerText = r.customerName;
        document.getElementById("detail-customer-email").innerText = r.customerEmail;

        // Star display
        const starContainer = document.getElementById("detail-star-display");
        starContainer.innerHTML = "";
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("i");
            star.className = `fas fa-star ${i > r.rating ? 'empty' : ''}`;
            starContainer.appendChild(star);
        }
        document.getElementById("detail-rating-number").innerText = `${r.rating}.0`;

        document.getElementById("detail-review-title").innerText = r.title;
        document.getElementById("detail-review-text").innerText = r.text;

        // Images
        const imagesSection = document.getElementById("detail-images-section");
        const imagesGrid = document.getElementById("detail-images-grid");
        imagesGrid.innerHTML = "";
        if (r.images && r.images.length > 0) {
            imagesSection.style.display = "block";
            r.images.forEach(src => {
                const img = document.createElement("img");
                img.src = src;
                img.alt = "Review Image";
                imagesGrid.appendChild(img);
            });
        } else {
            imagesSection.style.display = "none";
        }

        // Date & Status
        const dateObj = new Date(r.date);
        document.getElementById("detail-review-date").innerText = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const statusEl = document.getElementById("detail-review-status");
        statusEl.innerHTML = `<span class="status-badge ${r.status.toLowerCase()}">${r.status}</span>`;

        // Moderation History
        const modSection = document.getElementById("detail-moderation-section");
        const modLog = document.getElementById("detail-moderation-log");
        modLog.innerHTML = "";
        if (r.moderationHistory && r.moderationHistory.length > 0) {
            modSection.style.display = "block";
            r.moderationHistory.forEach(entry => {
                const el = document.createElement("div");
                el.className = "moderation-log-entry";
                const iconClass = entry.action === "Approved" ? "approve" : "reject";
                const iconSymbol = entry.action === "Approved" ? "fa-check" : "fa-times";
                el.innerHTML = `
                    <div class="moderation-log-icon ${iconClass}"><i class="fas ${iconSymbol}"></i></div>
                    <div class="moderation-log-details">
                        <span class="moderation-log-action">${entry.action} by ${entry.by}</span>
                        <span class="moderation-log-meta">${entry.date}${entry.note ? ' — ' + entry.note : ''}</span>
                    </div>
                `;
                modLog.appendChild(el);
            });
        } else {
            modSection.style.display = "none";
        }

        viewModal.classList.add("active");
    }

    /* ============================================================
       APPROVE / REJECT MODAL
       ============================================================ */
    function openModerationModal(id, action) {
        const r = reviewsList.find(item => item.id === id);
        if (!r) return;

        selectedReviewId = id;
        document.getElementById("moderation-review-id").value = id;
        document.getElementById("moderation-action").value = action;
        document.getElementById("moderator-note").value = "";

        const titleEl = document.getElementById("moderation-modal-title");
        const iconEl = document.getElementById("moderation-modal-icon");
        const descEl = document.getElementById("moderation-modal-desc");
        const confirmBtn = document.getElementById("confirm-moderation-btn");

        if (action === "Approve") {
            titleEl.innerText = "Approve Review";
            iconEl.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success-color);"></i>';
            descEl.innerText = `Approve the review by ${r.customerName} for "${r.productName}"? This review will be visible to all customers.`;
            confirmBtn.className = "modal-btn btn-submit";
            confirmBtn.style.backgroundColor = "var(--success-color)";
            confirmBtn.innerText = "Approve";
        } else {
            titleEl.innerText = "Reject Review";
            iconEl.innerHTML = '<i class="fas fa-times-circle" style="color: var(--danger-color);"></i>';
            descEl.innerText = `Reject the review by ${r.customerName} for "${r.productName}"? This review will be hidden from customers.`;
            confirmBtn.className = "modal-btn btn-danger";
            confirmBtn.style.backgroundColor = "";
            confirmBtn.innerText = "Reject";
        }

        moderationModal.classList.add("active");
    }

    // Confirm moderation action
    const confirmModBtn = document.getElementById("confirm-moderation-btn");
    if (confirmModBtn) {
        confirmModBtn.addEventListener("click", () => {
            const id = document.getElementById("moderation-review-id").value;
            const action = document.getElementById("moderation-action").value;
            const note = document.getElementById("moderator-note").value.trim();

            const r = reviewsList.find(item => item.id === id);
            if (!r) return;

            const newStatus = action === "Approve" ? "Approved" : "Rejected";
            r.status = newStatus;

            // Timestamp
            const now = new Date();
            const timeStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + " " + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            r.moderationHistory.push({
                action: newStatus,
                by: "Sanket Amte (Admin)",
                date: timeStr,
                note: note
            });

            moderationModal.classList.remove("active");
            updateDashboard();
            showToast(`Review ${r.id} ${newStatus.toLowerCase()} successfully.`);
        });
    }

    /* ============================================================
       DELETE REVIEW
       ============================================================ */
    function openDeleteModal(id) {
        const r = reviewsList.find(item => item.id === id);
        if (!r) return;
        selectedReviewId = id;
        document.getElementById("delete-modal-desc").innerText = `Are you sure you want to permanently delete the review by ${r.customerName} (${r.id})? This action cannot be undone.`;
        deleteModal.classList.add("active");
    }

    const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", () => { deleteModal.classList.remove("active"); selectedReviewId = null; });

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (selectedReviewId !== null) {
                const tr = document.getElementById(`row-review-${selectedReviewId}`);
                const r = reviewsList.find(item => item.id === selectedReviewId);
                const label = r ? r.id : "Review";

                if (r && r.rawId) {
                    try {
                        fetch(`/api/reviews/${r.rawId}`, { method: 'DELETE' });
                    } catch(err) {
                        console.error("API error deleting review:", err);
                    }
                }

                if (tr) {
                    tr.style.opacity = 0;
                    tr.style.transform = "translateX(-20px)";
                    setTimeout(() => {
                        reviewsList = reviewsList.filter(item => item.id !== selectedReviewId);
                        selectedReviewId = null;
                        deleteModal.classList.remove("active");
                        updateDashboard();
                        showToast(`Review ${label} deleted successfully.`);
                    }, 300);
                } else {
                    reviewsList = reviewsList.filter(item => item.id !== selectedReviewId);
                    selectedReviewId = null;
                    deleteModal.classList.remove("active");
                    updateDashboard();
                    showToast(`Review ${label} deleted successfully.`);
                }
            }
        });
    }

    /* ============================================================
       MODAL CLOSE LISTENERS
       ============================================================ */
    function initModalCloseListeners() {
        const closeView = document.getElementById("close-view-modal");
        const okView = document.getElementById("ok-view-modal");
        if (closeView) closeView.addEventListener("click", () => viewModal.classList.remove("active"));
        if (okView) okView.addEventListener("click", () => viewModal.classList.remove("active"));

        const closeMod = document.getElementById("close-moderation-modal");
        const cancelMod = document.getElementById("cancel-moderation-btn");
        if (closeMod) closeMod.addEventListener("click", () => moderationModal.classList.remove("active"));
        if (cancelMod) cancelMod.addEventListener("click", () => moderationModal.classList.remove("active"));

        window.addEventListener("click", (e) => {
            if (e.target === viewModal) viewModal.classList.remove("active");
            if (e.target === moderationModal) moderationModal.classList.remove("active");
            if (e.target === deleteModal) deleteModal.classList.remove("active");
        });
    }

    /* ============================================================
       TOAST UTILITY
       ============================================================ */
    function showToast(message) {
        const container = document.getElementById("toast-container");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<i class="fas fa-check-circle toast-icon"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add("show"), 50);
        setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3500);
    }
}
