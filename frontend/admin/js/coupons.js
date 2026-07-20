/* ============================================================
   FLIPKART CLONE - ADMIN COUPONS MANAGEMENT JS LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Theme Toggle Sync
    initTheme();

    // Layout Sidebar & Profile dropdown toggles
    initLayoutToggles();

    // Mock Data and Core Operations
    initCouponsManager();
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
    });
}

/* ============================================================
   LAYOUT HANDLERS (SIDEBAR, PROFILE DROPDOWN)
   ============================================================ */
function initLayoutToggles() {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");

    // Sidebar Mobile Toggle
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

    // Profile Dropdown Toggle
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
   COUPONS MANAGEMENT CONTROLLER
   ============================================================ */
function initCouponsManager() {
    // 1. Mock Coupons & Offers Catalog
    let couponsList = [
        {
            id: "CPN001",
            code: "WELCOME100",
            description: "Flat ₹100 off on first purchase",
            discountType: "Flat",
            discountValue: 100,
            minOrder: 499,
            maxDiscount: 100,
            usageLimit: 2000,
            usedCount: 1450,
            startDate: "2026-07-01T00:00",
            endDate: "2026-08-01T23:59",
            manuallyDisabled: false,
            applicableCategories: ["All"],
            applicableProducts: "All Items",
            userEligibility: "New Users Only",
            revenueGenerated: 725000,
            conversionRate: 18.2,
            discountDistributed: 145000
        },
        {
            id: "CPN002",
            code: "FLIPKART10",
            description: "10% off on all electronics items",
            discountType: "Percentage",
            discountValue: 10,
            minOrder: 9999,
            maxDiscount: 2000,
            usageLimit: 1000,
            usedCount: 420,
            startDate: "2026-07-10T00:00",
            endDate: "2026-07-25T23:59",
            manuallyDisabled: false,
            applicableCategories: ["Electronics"],
            applicableProducts: "SKU-SONY-XM5, SKU-SAMS-S23U",
            userEligibility: "All Users",
            revenueGenerated: 5249000,
            conversionRate: 11.4,
            discountDistributed: 840000
        },
        {
            id: "CPN003",
            code: "FASHION500",
            description: "Flat ₹500 off on fashion apparel",
            discountType: "Flat",
            discountValue: 500,
            minOrder: 2999,
            maxDiscount: 500,
            usageLimit: 500,
            usedCount: 500,
            startDate: "2026-06-01T00:00",
            endDate: "2026-07-15T23:59",
            manuallyDisabled: false,
            applicableCategories: ["Fashion"],
            applicableProducts: "All Items",
            userEligibility: "All Users",
            revenueGenerated: 1499500,
            conversionRate: 25.0,
            discountDistributed: 250000
        },
        {
            id: "CPN004",
            code: "FREESHIP",
            description: "Free shipping on orders above ₹999",
            discountType: "Free Shipping",
            discountValue: 40,
            minOrder: 999,
            maxDiscount: 40,
            usageLimit: 5000,
            usedCount: 2130,
            startDate: "2026-07-01T00:00",
            endDate: "2026-08-31T23:59",
            manuallyDisabled: false,
            applicableCategories: ["All"],
            applicableProducts: "All Items",
            userEligibility: "All Users",
            revenueGenerated: 2127870,
            conversionRate: 8.5,
            discountDistributed: 85200
        },
        {
            id: "CPN005",
            code: "FESTIVE30",
            description: "30% off on Home & Kitchen items",
            discountType: "Percentage",
            discountValue: 30,
            minOrder: 1999,
            maxDiscount: 1500,
            usageLimit: 1000,
            usedCount: 0,
            startDate: "2026-08-01T00:00",
            endDate: "2026-08-15T23:59",
            manuallyDisabled: false,
            applicableCategories: ["Home & Kitchen"],
            applicableProducts: "All Items",
            userEligibility: "All Users",
            revenueGenerated: 0,
            conversionRate: 0.0,
            discountDistributed: 0
        },
        {
            id: "CPN006",
            code: "BEAUTY150",
            description: "Flat ₹150 off on cosmetics items",
            discountType: "Flat",
            discountValue: 150,
            minOrder: 999,
            maxDiscount: 150,
            usageLimit: 800,
            usedCount: 600,
            startDate: "2026-07-05T00:00",
            endDate: "2026-07-28T23:59",
            manuallyDisabled: false,
            applicableCategories: ["Beauty"],
            applicableProducts: "SKU-LORE-HA",
            userEligibility: "All Users",
            revenueGenerated: 599400,
            conversionRate: 15.6,
            discountDistributed: 90000
        },
        {
            id: "CPN007",
            code: "PREMIUM1000",
            description: "Flat ₹1000 off for premium spenders",
            discountType: "Flat",
            discountValue: 1000,
            minOrder: 9999,
            maxDiscount: 1000,
            usageLimit: 300,
            usedCount: 120,
            startDate: "2026-07-01T00:00",
            endDate: "2026-07-31T23:59",
            manuallyDisabled: false,
            applicableCategories: ["All"],
            applicableProducts: "All Items",
            userEligibility: "Premium Spenders Only",
            revenueGenerated: 1199880,
            conversionRate: 14.2,
            discountDistributed: 120000
        },
        {
            id: "CPN008",
            code: "DEAL20",
            description: "20% off site-wide discount deal",
            discountType: "Percentage",
            discountValue: 20,
            minOrder: 1499,
            maxDiscount: 500,
            usageLimit: 1500,
            usedCount: 950,
            startDate: "2026-07-12T00:00",
            endDate: "2026-07-22T23:59",
            manuallyDisabled: true, // Manually Disabled
            applicableCategories: ["All"],
            applicableProducts: "All Items",
            userEligibility: "All Users",
            revenueGenerated: 1424050,
            conversionRate: 9.8,
            discountDistributed: 142500
        },
        {
            id: "CPN009",
            code: "SNEAKERS20",
            description: "20% off on sneakers & athletic shoes",
            discountType: "Percentage",
            discountValue: 20,
            minOrder: 4999,
            maxDiscount: 2000,
            usageLimit: 600,
            usedCount: 150,
            startDate: "2026-07-11T00:00",
            endDate: "2026-07-24T23:59",
            manuallyDisabled: false,
            applicableCategories: ["Fashion"],
            applicableProducts: "SKU-NIKE-AMX, SKU-PUMA-SOF",
            userEligibility: "All Users",
            revenueGenerated: 749850,
            conversionRate: 12.0,
            discountDistributed: 149850
        },
        {
            id: "CPN010",
            code: "APPL1000",
            description: "Flat ₹1000 off on Apple Smart Watches",
            discountType: "Flat",
            discountValue: 1000,
            minOrder: 25000,
            maxDiscount: 1000,
            usageLimit: 100,
            usedCount: 5,
            startDate: "2026-07-15T00:00",
            endDate: "2026-07-25T23:59",
            manuallyDisabled: false,
            applicableCategories: ["Electronics"],
            applicableProducts: "SKU-APPL-W8",
            userEligibility: "All Users",
            revenueGenerated: 229500,
            conversionRate: 5.0,
            discountDistributed: 5000
        }
    ];

    // Validity Date calculations reference (Current: 2026-07-20T11:05:00)
    const currentDate = new Date("2026-07-20T11:05:00");

    // Pagination/Filtering State
    let filteredCoupons = [...couponsList];
    let currentPage = 1;
    const rowsPerPage = 10;

    // DOM Element Selectors
    const tableBody = document.getElementById("coupons-table-body");
    const showingText = document.getElementById("showing-text");
    const paginationContainer = document.getElementById("pagination-container");

    // Metrics Selectors
    const totalCouponsEl = document.getElementById("total-coupons-cnt");
    const activeCouponsEl = document.getElementById("active-coupons-cnt");
    const expiredCouponsEl = document.getElementById("expired-coupons-cnt");
    const scheduledCouponsEl = document.getElementById("scheduled-coupons-cnt");
    const discountGivenEl = document.getElementById("discount-given-cnt");

    // Filter Inputs Selectors
    const searchCodeInput = document.getElementById("c-search-code");
    const statusFilter = document.getElementById("c-filter-status");
    const typeFilter = document.getElementById("c-filter-type");
    const dateFilter = document.getElementById("c-filter-date");
    const sortFilter = document.getElementById("c-sort");

    // Action Buttons
    const btnClearFilters = document.getElementById("btn-clear-filters");
    const btnRefresh = document.getElementById("btn-refresh");
    const btnExport = document.getElementById("btn-export");
    const btnCreateCoupon = document.getElementById("btn-create-coupon");

    // Modal Elements
    const couponModal = document.getElementById("coupon-modal");
    const viewModal = document.getElementById("view-coupon-modal");
    const deleteModal = document.getElementById("delete-confirm-modal");

    // Form Input elements
    const couponForm = document.getElementById("coupon-form");
    const modalTitleEl = document.getElementById("coupon-modal-title");
    const couponModeInput = document.getElementById("coupon-mode");
    const editCouponIdInput = document.getElementById("edit-coupon-id");

    const codeInput = document.getElementById("coupon-code-input");
    const descInput = document.getElementById("coupon-desc-input");
    const typeInput = document.getElementById("coupon-type-input");
    const valInput = document.getElementById("coupon-val-input");
    const minOrderInput = document.getElementById("coupon-min-order-input");
    const maxDiscInput = document.getElementById("coupon-max-disc-input");
    const limitInput = document.getElementById("coupon-limit-input");
    const startInput = document.getElementById("coupon-start-input");
    const expiryInput = document.getElementById("coupon-expiry-input");
    const categoriesSelect = document.getElementById("coupon-categories-input");
    const productsInput = document.getElementById("coupon-products-input");
    const eligibilitySelect = document.getElementById("coupon-eligibility-input");

    // Modal state controllers
    let selectedCouponId = null;

    // Initialize Layout Events & Data
    initModalCloseListeners();
    initFilters();
    initCSVExport();
    initCreateButton();
    
    // Core Initial Render
    updateDashboard();

    /* ============================================================
       DYNAMIC STATUS CALCULATOR
       ============================================================ */
    function getCouponStatus(coupon) {
        if (coupon.manuallyDisabled) return "Inactive";
        const start = new Date(coupon.startDate);
        const end = new Date(coupon.endDate);

        if (currentDate > end) return "Expired";
        if (currentDate < start) return "Scheduled";
        return "Active";
    }

    /* ============================================================
       METRICS CALCULATION
       ============================================================ */
    function updateDashboard() {
        const total = couponsList.length;
        let active = 0;
        let expired = 0;
        let scheduled = 0;
        let totalDiscount = 0;

        couponsList.forEach(c => {
            const status = getCouponStatus(c);
            if (status === "Active") active++;
            else if (status === "Expired") expired++;
            else if (status === "Scheduled") scheduled++;

            totalDiscount += c.discountDistributed;
        });

        // Set DOM Text
        totalCouponsEl.innerText = total;
        activeCouponsEl.innerText = active;
        expiredCouponsEl.innerText = expired;
        scheduledCouponsEl.innerText = scheduled;
        discountGivenEl.innerText = "₹" + totalDiscount.toLocaleString();

        // Refresh dynamic list table
        applyFiltersAndRender();
    }

    /* ============================================================
       CSV EXPORT FEATURE
       ============================================================ */
    function initCSVExport() {
        if (btnExport) {
            btnExport.addEventListener("click", () => {
                if (filteredCoupons.length === 0) {
                    showToast("No coupons available to export.");
                    return;
                }

                // CSV headers definition
                const headers = ["Coupon ID", "Code", "Description", "Discount Type", "Value", "Min Order (INR)", "Max Discount (INR)", "Limit", "Used Count", "Start Date", "Expiry Date", "Status", "Categories", "Products", "User Eligibility", "Revenue (INR)", "Conversion Rate (%)", "Discount Distributed (INR)"];
                
                // Construct CSV lines
                let csvRows = [headers.join(",")];
                
                filteredCoupons.forEach(c => {
                    const status = getCouponStatus(c);
                    const row = [
                        c.id,
                        c.code,
                        `"${c.description.replace(/"/g, '""')}"`,
                        c.discountType,
                        c.discountValue,
                        c.minOrder,
                        c.maxDiscount,
                        c.usageLimit,
                        c.usedCount,
                        c.startDate,
                        c.endDate,
                        status,
                        `"${c.applicableCategories.join(', ')}"`,
                        `"${c.applicableProducts.replace(/"/g, '""')}"`,
                        c.userEligibility,
                        c.revenueGenerated,
                        c.conversionRate,
                        c.discountDistributed
                    ];
                    csvRows.push(row.join(","));
                });

                const csvString = csvRows.join("\n");
                const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                
                // Trigger download
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `flipkart_admin_coupons_${Date.now()}.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showToast("Coupons catalog exported to CSV.");
            });
        }
    }

    /* ============================================================
       FILTER & SORT CONTROL EVENTS
       ============================================================ */
    function initFilters() {
        const triggers = [searchCodeInput, statusFilter, typeFilter, dateFilter, sortFilter];
        triggers.forEach(input => {
            if (input) {
                input.addEventListener("input", () => {
                    currentPage = 1;
                    applyFiltersAndRender();
                });
            }
        });

        // Clear Filters Action
        if (btnClearFilters) {
            btnClearFilters.addEventListener("click", () => {
                searchCodeInput.value = "";
                statusFilter.value = "All";
                typeFilter.value = "All";
                dateFilter.value = "";
                sortFilter.value = "expiry-near";

                currentPage = 1;
                applyFiltersAndRender();
                showToast("Filters cleared.");
            });
        }

        // Refresh Data Action
        if (btnRefresh) {
            btnRefresh.addEventListener("click", () => {
                const refreshIcon = btnRefresh.querySelector("i");
                refreshIcon.classList.add("spin");
                btnRefresh.disabled = true;

                // Temporary opacity drop on table body
                tableBody.style.opacity = 0.4;

                setTimeout(() => {
                    refreshIcon.classList.remove("spin");
                    btnRefresh.disabled = false;
                    tableBody.style.opacity = 1;

                    // Clear filter controls
                    searchCodeInput.value = "";
                    statusFilter.value = "All";
                    typeFilter.value = "All";
                    dateFilter.value = "";
                    sortFilter.value = "expiry-near";
                    currentPage = 1;

                    // Redraw
                    updateDashboard();
                    showToast("Coupons catalog refreshed.");
                }, 500);
            });
        }
    }

    function applyFiltersAndRender() {
        filteredCoupons = [...couponsList];

        // 1. Filter by Code
        const codeQuery = searchCodeInput.value.toUpperCase().trim();
        if (codeQuery) {
            filteredCoupons = filteredCoupons.filter(c => c.code.includes(codeQuery));
        }

        // 2. Filter by Status
        const statusVal = statusFilter.value;
        if (statusVal !== "All") {
            filteredCoupons = filteredCoupons.filter(c => getCouponStatus(c) === statusVal);
        }

        // 3. Filter by Discount Type
        const typeVal = typeFilter.value;
        if (typeVal !== "All") {
            filteredCoupons = filteredCoupons.filter(c => c.discountType === typeVal);
        }

        // 4. Filter by Date (Checks if date is within validity range of coupon)
        const dateVal = dateFilter.value;
        if (dateVal) {
            const queryTime = new Date(dateVal + "T00:00:00");
            filteredCoupons = filteredCoupons.filter(c => {
                const start = new Date(c.startDate);
                const end = new Date(c.endDate);
                return queryTime >= start && queryTime <= end;
            });
        }

        // 5. Apply Sorting
        const sortVal = sortFilter.value;
        filteredCoupons.sort((a, b) => {
            if (sortVal === "expiry-near") {
                return new Date(a.endDate) - new Date(b.endDate);
            } else if (sortVal === "expiry-far") {
                return new Date(b.endDate) - new Date(a.endDate);
            } else if (sortVal === "val-high") {
                return b.discountValue - a.discountValue;
            } else if (sortVal === "usage-high") {
                return b.usedCount - a.usedCount;
            } else if (sortVal === "code-asc") {
                return a.code.localeCompare(b.code);
            }
            return 0;
        });

        // 6. Render Table & Pagination
        renderTable();
    }

    /* ============================================================
       TABLE RENDERER
       ============================================================ */
    function renderTable() {
        tableBody.innerHTML = "";
        const totalRows = filteredCoupons.length;

        // If no records, draw empty state
        if (totalRows === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="12" style="padding: 0;">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-ticket-alt"></i></div>
                            <h4 class="empty-state-title">No Coupons Found</h4>
                            <p class="empty-state-desc">We couldn't find any coupon codes matching your criteria. Try adjusting filters.</p>
                            <button type="button" class="clear-filters-btn" id="btn-empty-clear" style="margin-top: 8px;">
                                <i class="fas fa-undo"></i> Clear All Filters
                            </button>
                        </div>
                    </td>
                </tr>
            `;

            // Bind the clear filters click within empty state
            const emptyClear = document.getElementById("btn-empty-clear");
            if (emptyClear) {
                emptyClear.addEventListener("click", () => {
                    btnClearFilters.click();
                });
            }

            showingText.innerText = "Showing 0 of 0 coupons";
            paginationContainer.innerHTML = "";
            return;
        }

        // Slice pagination records
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
        const paginatedRecords = filteredCoupons.slice(startIndex, endIndex);

        showingText.innerText = `Showing ${startIndex + 1}-${endIndex} of ${totalRows} coupons`;

        // Render rows
        paginatedRecords.forEach(c => {
            // Compute status badge
            const status = getCouponStatus(c);

            // Format dates
            const startObj = new Date(c.startDate);
            const formattedStart = startObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
            
            const expiryObj = new Date(c.endDate);
            const formattedExpiry = expiryObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });

            // Display value
            let valText = "Free";
            if (c.discountType === "Percentage") {
                valText = `${c.discountValue}%`;
            } else if (c.discountType === "Flat") {
                valText = `₹${c.discountValue}`;
            }

            // Create row tr
            const tr = document.createElement("tr");
            tr.id = `row-coupon-${c.id}`;
            tr.innerHTML = `
                <td>
                    <span class="coupon-code-txt" data-id="${c.id}" style="cursor: pointer;">${c.code}</span>
                </td>
                <td>
                    <div style="font-weight: 500; font-size: 0.84rem; max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.description}">${c.description}</div>
                </td>
                <td>
                    <span style="font-weight: 500;">${c.discountType}</span>
                </td>
                <td style="text-align: right; font-weight: bold;">
                    <span>${valText}</span>
                </td>
                <td style="text-align: right; font-weight: 500; color: var(--text-muted);">
                    ₹${c.minOrder}
                </td>
                <td style="text-align: right; font-weight: 500; color: var(--text-muted);">
                    ${c.discountType === 'Percentage' ? '₹' + c.maxDiscount : 'N/A'}
                </td>
                <td style="text-align: center;">
                    <span class="qty-badge">${c.usageLimit}</span>
                </td>
                <td style="text-align: center;">
                    <span class="qty-badge" style="background-color: var(--bg-main); border-color: transparent;">${c.usedCount}</span>
                </td>
                <td>
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">${formattedStart}</div>
                </td>
                <td>
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">${formattedExpiry}</div>
                </td>
                <td>
                    <span class="status-badge ${status.toLowerCase()}">${status}</span>
                </td>
                <td>
                    <div class="action-actions-cell">
                        <button type="button" class="row-action-btn view-btn" data-id="${c.id}" title="View Details and Analytics">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="row-action-btn edit-btn" data-id="${c.id}" title="Edit Coupon">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="row-action-btn block-btn" data-id="${c.id}" title="${c.manuallyDisabled ? 'Activate Coupon' : 'Deactivate Coupon'}">
                            <i class="fas ${c.manuallyDisabled ? 'fa-check-circle' : 'fa-ban'}"></i>
                        </button>
                        <button type="button" class="row-action-btn duplicate-btn" data-id="${c.id}" title="Duplicate Coupon">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button type="button" class="row-action-btn delete-btn" data-id="${c.id}" title="Delete Coupon">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(tr);
        });

        // Event hooks for Actions within the table body
        bindTableActionButtons();

        // Render Pagination buttons
        renderPagination(totalRows);
    }

    /* ============================================================
       TABLE ROW ACTION HANDLERS
       ============================================================ */
    function bindTableActionButtons() {
        // ID click
        tableBody.querySelectorAll(".coupon-code-txt").forEach(el => {
            el.addEventListener("click", () => {
                viewCouponDetails(el.dataset.id);
            });
        });

        // View Profile button
        tableBody.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                viewCouponDetails(btn.dataset.id);
            });
        });

        // Edit profile button
        tableBody.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                openEditModal(btn.dataset.id);
            });
        });

        // Activate / Deactivate button
        tableBody.querySelectorAll(".block-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                toggleCouponActivation(btn.dataset.id);
            });
        });

        // Duplicate button
        tableBody.querySelectorAll(".duplicate-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                duplicateCoupon(btn.dataset.id);
            });
        });

        // Delete User button
        tableBody.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                openDeleteModal(btn.dataset.id);
            });
        });
    }

    /* ============================================================
       PAGINATION GENERATOR
       ============================================================ */
    function renderPagination(totalRows) {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        if (totalPages <= 1) return;

        // Previous button
        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "pagination-btn";
        prevBtn.disabled = currentPage === 1;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
        paginationContainer.appendChild(prevBtn);

        // Page buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.type = "button";
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.innerText = i;
            pageBtn.addEventListener("click", () => {
                currentPage = i;
                renderTable();
            });
            paginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "pagination-btn";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    /* ============================================================
       MODAL VIEW DETAILS AND ANALYTICS LOGIC
       ============================================================ */
    function viewCouponDetails(id) {
        const c = couponsList.find(item => item.id === id);
        if (!c) return;

        selectedCouponId = id;

        // Header details
        document.getElementById("detail-coupon-code").innerText = c.code;
        document.getElementById("detail-coupon-desc").innerText = c.description;
        document.getElementById("detail-coupon-type").innerText = `${c.discountType} discount offer rules`;

        // Analytics Widgets
        document.getElementById("widget-total-usage").innerText = c.usedCount;
        document.getElementById("widget-revenue").innerText = "₹" + c.revenueGenerated.toLocaleString();
        document.getElementById("widget-discount").innerText = "₹" + c.discountDistributed.toLocaleString();
        document.getElementById("widget-conversion").innerText = `${c.conversionRate}%`;

        // Configurations details Left card
        document.getElementById("detail-min-order").innerText = "₹" + c.minOrder.toLocaleString();
        document.getElementById("detail-max-discount").innerText = c.discountType === 'Percentage' ? "₹" + c.maxDiscount.toLocaleString() : "N/A";
        document.getElementById("detail-usage-limit").innerText = c.usageLimit;
        document.getElementById("detail-eligibility").innerText = c.userEligibility;

        // Configuration details Right card
        const startObj = new Date(c.startDate);
        document.getElementById("detail-start-date").innerText = startObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + " " + startObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const expiryObj = new Date(c.endDate);
        document.getElementById("detail-expiry-date").innerText = expiryObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + " " + expiryObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        document.getElementById("detail-categories").innerText = c.applicableCategories.join(", ");
        document.getElementById("detail-products").innerText = c.applicableProducts;

        viewModal.classList.add("active");
    }

    /* ============================================================
       MODAL CREATE / EDIT COUPON LOGIC
       ============================================================ */
    function initCreateButton() {
        if (btnCreateCoupon) {
            btnCreateCoupon.addEventListener("click", () => {
                selectedCouponId = null;
                modalTitleEl.innerText = "Create New Coupon";
                couponModeInput.value = "create";
                editCouponIdInput.value = "";

                // Reset forms
                codeInput.value = "";
                codeInput.disabled = false;
                descInput.value = "";
                typeInput.value = "Percentage";
                valInput.value = "";
                minOrderInput.value = "";
                maxDiscInput.value = "";
                limitInput.value = "";
                startInput.value = "";
                expiryInput.value = "";
                eligibilitySelect.value = "All Users";
                productsInput.value = "All Items";
                
                // Clear category multiple selects
                for (let i = 0; i < categoriesSelect.options.length; i++) {
                    categoriesSelect.options[i].selected = (categoriesSelect.options[i].value === "All");
                }

                couponModal.classList.add("active");
            });
        }
    }

    function openEditModal(id) {
        const c = couponsList.find(item => item.id === id);
        if (!c) return;

        selectedCouponId = id;
        modalTitleEl.innerText = "Edit Coupon Details";
        couponModeInput.value = "edit";
        editCouponIdInput.value = c.id;

        // Pre-fill values
        codeInput.value = c.code;
        codeInput.disabled = true; // Lock code renaming in edit mode
        descInput.value = c.description;
        typeInput.value = c.discountType;
        valInput.value = c.discountValue;
        minOrderInput.value = c.minOrder;
        maxDiscInput.value = c.maxDiscount;
        limitInput.value = c.usageLimit;
        startInput.value = c.startDate;
        expiryInput.value = c.endDate;
        eligibilitySelect.value = c.userEligibility;
        productsInput.value = c.applicableProducts;

        // Pre-select categories multiple
        for (let i = 0; i < categoriesSelect.options.length; i++) {
            const opt = categoriesSelect.options[i];
            opt.selected = c.applicableCategories.includes(opt.value);
        }

        couponModal.classList.add("active");
    }

    // Submit coupon create / edit form
    if (couponForm) {
        couponForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const mode = couponModeInput.value;
            const code = codeInput.value.toUpperCase().trim();
            const desc = descInput.value.trim();
            const type = typeInput.value;
            const val = parseInt(valInput.value, 10);
            const minOrder = parseInt(minOrderInput.value, 10);
            const maxDisc = parseInt(maxDiscInput.value, 10);
            const limit = parseInt(limitInput.value, 10);
            const start = startInput.value;
            const expiry = expiryInput.value;
            const eligibility = eligibilitySelect.value;
            const products = productsInput.value.trim() || "All Items";

            // Validate dates sequence
            if (new Date(start) >= new Date(expiry)) {
                showToast("Error: Expiry Date must be after Start Date.");
                return;
            }

            // Gather multiple selected categories
            let categories = [];
            for (let i = 0; i < categoriesSelect.options.length; i++) {
                if (categoriesSelect.options[i].selected) {
                    categories.push(categoriesSelect.options[i].value);
                }
            }
            if (categories.length === 0) categories.push("All");

            if (mode === "create") {
                // Code uniqueness validation
                const codeExists = couponsList.some(item => item.code === code);
                if (codeExists) {
                    showToast(`Error: Coupon Code ${code} already exists.`);
                    return;
                }

                // Append new coupon record
                const newId = `CPN${Math.floor(100 + Math.random() * 900)}`;
                const newCoupon = {
                    id: newId,
                    code: code,
                    description: desc,
                    discountType: type,
                    discountValue: val,
                    minOrder: minOrder,
                    maxDiscount: maxDisc,
                    usageLimit: limit,
                    usedCount: 0,
                    startDate: start,
                    endDate: expiry,
                    manuallyDisabled: false,
                    applicableCategories: categories,
                    applicableProducts: products,
                    userEligibility: eligibility,
                    revenueGenerated: 0,
                    conversionRate: 0.0,
                    discountDistributed: 0
                };

                couponsList.unshift(newCoupon);
                couponModal.classList.remove("active");
                updateDashboard();
                showToast(`Coupon ${code} created successfully.`);
            } else if (mode === "edit") {
                const targetId = editCouponIdInput.value;
                const c = couponsList.find(item => item.id === targetId);
                if (c) {
                    c.description = desc;
                    c.discountType = type;
                    c.discountValue = val;
                    c.minOrder = minOrder;
                    c.maxDiscount = maxDisc;
                    c.usageLimit = limit;
                    c.startDate = start;
                    c.endDate = expiry;
                    c.userEligibility = eligibility;
                    c.applicableCategories = categories;
                    c.applicableProducts = products;

                    couponModal.classList.remove("active");
                    updateDashboard();
                    showToast(`Coupon ${c.code} details saved.`);
                }
            }
        });
    }

    /* ============================================================
       ACTIVATE / DEACTIVATE SWITCHER
       ============================================================ */
    function toggleCouponActivation(id) {
        const c = couponsList.find(item => item.id === id);
        if (!c) return;

        const originalState = c.manuallyDisabled;
        c.manuallyDisabled = !originalState;

        updateDashboard();
        showToast(`Coupon ${c.code} has been ${c.manuallyDisabled ? 'Deactivated' : 'Activated'}.`);
    }

    /* ============================================================
       DUPLICATE COUPON LOGIC
       ============================================================ */
    function duplicateCoupon(id) {
        const c = couponsList.find(item => item.id === id);
        if (!c) return;

        // Clone target and open details modal under create mode
        selectedCouponId = null;
        modalTitleEl.innerText = "Duplicate / Copy Coupon";
        couponModeInput.value = "create";
        editCouponIdInput.value = "";

        codeInput.value = `${c.code}-COPY`;
        codeInput.disabled = false;
        descInput.value = c.description;
        typeInput.value = c.discountType;
        valInput.value = c.discountValue;
        minOrderInput.value = c.minOrder;
        maxDiscInput.value = c.maxDiscount;
        limitInput.value = c.usageLimit;
        startInput.value = c.startDate;
        expiryInput.value = c.endDate;
        eligibilitySelect.value = c.userEligibility;
        productsInput.value = c.applicableProducts;

        // Select categories
        for (let i = 0; i < categoriesSelect.options.length; i++) {
            const opt = categoriesSelect.options[i];
            opt.selected = c.applicableCategories.includes(opt.value);
        }

        couponModal.classList.add("active");
        showToast("Coupon cloned. Please customize code and click Save.");
    }

    /* ============================================================
       MODAL DELETE COUPON LOGIC
       ============================================================ */
    function openDeleteModal(id) {
        const c = couponsList.find(item => item.id === id);
        if (!c) return;

        selectedCouponId = id;
        document.getElementById("delete-modal-desc").innerText = `Are you sure you want to remove coupon ${c.code}? This deletes all configurations and analytics logs permanently.`;
        deleteModal.classList.add("active");
    }

    const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", () => {
            deleteModal.classList.remove("active");
            selectedCouponId = null;
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (selectedCouponId !== null) {
                const tr = document.getElementById(`row-coupon-${selectedCouponId}`);
                const c = couponsList.find(item => item.id === selectedCouponId);
                const code = c ? c.code : "Coupon";

                if (tr) {
                    tr.style.opacity = 0;
                    tr.style.transform = "translateX(-20px)";
                    setTimeout(() => {
                        couponsList = couponsList.filter(item => item.id !== selectedCouponId);
                        selectedCouponId = null;
                        deleteModal.classList.remove("active");
                        updateDashboard();
                        showToast(`Coupon ${code} removed successfully.`);
                    }, 300);
                } else {
                    couponsList = couponsList.filter(item => item.id !== selectedCouponId);
                    selectedCouponId = null;
                    deleteModal.classList.remove("active");
                    updateDashboard();
                    showToast(`Coupon ${code} removed successfully.`);
                }
            }
        });
    }

    /* ============================================================
       MODAL CLOSE LISTENERS INITIALIZER
       ============================================================ */
    function initModalCloseListeners() {
        // Coupon Modal Close
        const closeCoupon = document.getElementById("close-coupon-modal");
        const cancelCoupon = document.getElementById("cancel-coupon-btn");
        if (closeCoupon) closeCoupon.addEventListener("click", () => couponModal.classList.remove("active"));
        if (cancelCoupon) cancelCoupon.addEventListener("click", () => couponModal.classList.remove("active"));

        // View close
        const closeView = document.getElementById("close-view-modal");
        const okView = document.getElementById("ok-view-modal");
        if (closeView) closeView.addEventListener("click", () => viewModal.classList.remove("active"));
        if (okView) okView.addEventListener("click", () => viewModal.classList.remove("active"));

        // Delete close
        const closeDelete = document.getElementById("cancel-delete-btn"); // shared element

        // Click outside overlay to close modal boxes
        window.addEventListener("click", (e) => {
            if (e.target === couponModal) couponModal.classList.remove("active");
            if (e.target === viewModal) viewModal.classList.remove("active");
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
        toast.innerHTML = `
            <i class="fas fa-check-circle toast-icon"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        
        // Trigger slide in animation
        setTimeout(() => {
            toast.classList.add("show");
        }, 50);

        // Slide out and clean DOM
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }
}
