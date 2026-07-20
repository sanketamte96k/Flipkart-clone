/* ============================================================
   FLIPKART CLONE - ADMIN INVENTORY MANAGEMENT JS LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Theme Toggle Sync
    initTheme();

    // Layout Sidebar & Profile dropdown toggles
    initLayoutToggles();

    // Mock Data and Core Operations
    initInventoryManager();
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
   INVENTORY MANAGEMENT CONTROLLER
   ============================================================ */
function initInventoryManager() {
    // 1. Mock Inventory Products database
    let inventoryList = [
        {
            id: "PRD101",
            sku: "SKU-SONY-XM5",
            name: "Sony WH-1000XM5 Wireless Headphones (Silver)",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
            category: "Electronics",
            supplier: "Sony India",
            currentStock: 45,
            reservedStock: 5,
            unitPrice: 29990,
            reorderLevel: 10,
            lastUpdated: "20-Jul-2026 09:45 AM",
            history: [
                { date: "20-Jul-2026 09:45 AM", change: "+15", prevStock: 30, newStock: 45, updatedBy: "Sanket Amte (Admin)", reason: "Restock", notes: "Regular inventory refill shipment." },
                { date: "15-Jul-2026 02:00 PM", change: "-2", prevStock: 32, newStock: 30, updatedBy: "System (Order)", reason: "Order Allocation", notes: "Allocated to Order OD9081298319" }
            ]
        },
        {
            id: "PRD102",
            sku: "SKU-SAMS-S23U",
            name: "Samsung Galaxy S23 Ultra 5G (Phantom Black, 256GB)",
            image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop",
            category: "Electronics",
            supplier: "Samsung India",
            currentStock: 15,
            reservedStock: 2,
            unitPrice: 124999,
            reorderLevel: 5,
            lastUpdated: "19-Jul-2026 03:00 PM",
            history: [
                { date: "19-Jul-2026 03:00 PM", change: "+5", prevStock: 10, newStock: 15, updatedBy: "Sanket Amte (Admin)", reason: "Restock", notes: "Urgent restocking shipment." }
            ]
        },
        {
            id: "PRD103",
            sku: "SKU-HP-SLV",
            name: "HP Laptop Sleeve Case (Black, Waterproof)",
            image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=100&h=100&fit=crop",
            category: "Electronics",
            supplier: "HP Corp",
            currentStock: 8,
            reservedStock: 1,
            unitPrice: 1299,
            reorderLevel: 12, // Low Stock! Current = 8 <= Reorder = 12
            lastUpdated: "20-Jul-2026 10:15 AM",
            history: [
                { date: "20-Jul-2026 10:15 AM", change: "-5", prevStock: 13, newStock: 8, updatedBy: "System (Order)", reason: "Order Allocation", notes: "Deducted for orders check allocation." }
            ]
        },
        {
            id: "PRD104",
            sku: "SKU-LEVI-511",
            name: "Levi's Men's 511 Slim Fit Jeans (Blue)",
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
            category: "Fashion",
            supplier: "Levis Retail",
            currentStock: 60,
            reservedStock: 12,
            unitPrice: 2899,
            reorderLevel: 15,
            lastUpdated: "20-Jul-2026 09:10 AM",
            history: [
                { date: "20-Jul-2026 09:10 AM", change: "+20", prevStock: 40, newStock: 60, updatedBy: "Sanket Amte (Admin)", reason: "Restock", notes: "Seasonal wardrobe restock." }
            ]
        },
        {
            id: "PRD105",
            sku: "SKU-PUMA-SOF",
            name: "Puma Softride running shoes (Red, Size 9)",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
            category: "Fashion",
            supplier: "Levis Retail",
            currentStock: 0, // Out of Stock!
            reservedStock: 0,
            unitPrice: 4999,
            reorderLevel: 8,
            lastUpdated: "17-Jul-2026 03:45 PM",
            history: [
                { date: "17-Jul-2026 03:45 PM", change: "-4", prevStock: 4, newStock: 0, updatedBy: "System (Order)", reason: "Order Allocation", notes: "Sold out of local stock levels." }
            ]
        },
        {
            id: "PRD106",
            sku: "SKU-PHIL-TRM",
            name: "Philips Series 3000 Beard Trimmer (Cordless)",
            image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=100&h=100&fit=crop",
            category: "Beauty",
            supplier: "Philips Direct",
            currentStock: 35,
            reservedStock: 4,
            unitPrice: 2199,
            reorderLevel: 8,
            lastUpdated: "20-Jul-2026 10:00 AM",
            history: [
                { date: "20-Jul-2026 10:00 AM", change: "+15", prevStock: 20, newStock: 35, updatedBy: "Sanket Amte (Admin)", reason: "Restock", notes: "Supplier direct batch shipment." }
            ]
        },
        {
            id: "PRD107",
            sku: "SKU-LORE-HA",
            name: "L'Oreal Paris Revitalift Hyaluronic Acid Serum",
            image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100&h=100&fit=crop",
            category: "Beauty",
            supplier: "L'Oreal Distrib",
            currentStock: 4, // Low Stock! Current = 4 <= Reorder = 10
            reservedStock: 3,
            unitPrice: 999,
            reorderLevel: 10,
            lastUpdated: "18-Jul-2026 03:00 PM",
            history: [
                { date: "18-Jul-2026 03:00 PM", change: "-3", prevStock: 7, newStock: 4, updatedBy: "System (Order)", reason: "Order Allocation", notes: "Purchased by local customers." }
            ]
        },
        {
            id: "PRD108",
            sku: "SKU-MIAI-FRY",
            name: "Mi Smart Air Fryer (4L, White)",
            image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=100&h=100&fit=crop",
            category: "Home & Kitchen",
            supplier: "Samsung India",
            currentStock: 18,
            reservedStock: 0,
            unitPrice: 6999,
            reorderLevel: 5,
            lastUpdated: "15-Jul-2026 08:10 AM",
            history: [
                { date: "15-Jul-2026 08:10 AM", change: "+10", prevStock: 8, newStock: 18, updatedBy: "Sanket Amte (Admin)", reason: "Restock", notes: "Kitchen items replenishment." }
            ]
        },
        {
            id: "PRD109",
            sku: "SKU-APPL-W8",
            name: "Apple Watch Series 8 GPS (Midnight Aluminium, 45mm)",
            image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=100&h=100&fit=crop",
            category: "Electronics",
            supplier: "Sony India",
            currentStock: 2, // Low Stock! Current = 2 <= Reorder = 5
            reservedStock: 1,
            unitPrice: 45900,
            reorderLevel: 5,
            lastUpdated: "19-Jul-2026 11:15 AM",
            history: [
                { date: "19-Jul-2026 11:15 AM", change: "-1", prevStock: 3, newStock: 2, updatedBy: "System (Order)", reason: "Order Allocation", notes: "Fulfillment check deduct." }
            ]
        },
        {
            id: "PRD110",
            sku: "SKU-NIKE-AMX",
            name: "Nike Air Max Sports Shoes (Grey/Yellow)",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
            category: "Fashion",
            supplier: "Levis Retail",
            currentStock: 22,
            reservedStock: 0,
            unitPrice: 9995,
            reorderLevel: 6,
            lastUpdated: "16-Jul-2026 10:15 AM",
            history: [
                { date: "16-Jul-2026 10:15 AM", change: "+10", prevStock: 12, newStock: 22, updatedBy: "Sanket Amte (Admin)", reason: "Restock", notes: "Sports footwear audit shipment." }
            ]
        }
    ];

    // Pagination/Filtering State
    let filteredInventory = [...inventoryList];
    let currentPage = 1;
    const rowsPerPage = 10;

    // DOM Element Selectors
    const tableBody = document.getElementById("inventory-table-body");
    const showingText = document.getElementById("showing-text");
    const paginationContainer = document.getElementById("pagination-container");

    // Metrics Selectors
    const totalProductsEl = document.getElementById("total-products-cnt");
    const inStockEl = document.getElementById("in-stock-cnt");
    const lowStockEl = document.getElementById("low-stock-cnt");
    const outOfStockEl = document.getElementById("out-of-stock-cnt");
    const inventoryValueEl = document.getElementById("inventory-value-cnt");

    // Filter Inputs Selectors
    const searchNameInput = document.getElementById("inv-search-name");
    const searchSkuInput = document.getElementById("inv-search-sku");
    const categoryFilter = document.getElementById("inv-filter-category");
    const statusFilter = document.getElementById("inv-filter-status");
    const supplierFilter = document.getElementById("inv-filter-supplier");
    const sortFilter = document.getElementById("inv-sort");

    // Action Buttons
    const btnClearFilters = document.getElementById("btn-clear-filters");
    const btnRefresh = document.getElementById("btn-refresh");
    const btnExport = document.getElementById("btn-export");

    // Modal Elements
    const updateModal = document.getElementById("update-stock-modal");
    const historyModal = document.getElementById("history-modal");
    const deleteModal = document.getElementById("delete-confirm-modal");

    // Update Stock Form Input Refs
    const adjustActionSelect = document.getElementById("adjust-action");
    const adjustQtyInput = document.getElementById("adjust-qty");
    const adjustReasonSelect = document.getElementById("adjust-reason");
    const adjustNotesInput = document.getElementById("adjust-notes");

    // Modal state controllers
    let selectedProductId = null;

    // Initialize Layout Events & Data
    initModalCloseListeners();
    initFilters();
    initCSVExport();
    
    // Core Initial Render
    updateDashboard();

    /* ============================================================
       METRICS CALCULATION
       ============================================================ */
    function updateDashboard() {
        const total = inventoryList.length;
        const outOfStock = inventoryList.filter(p => p.currentStock === 0).length;
        const lowStock = inventoryList.filter(p => p.currentStock > 0 && p.currentStock <= p.reorderLevel).length;
        const inStock = inventoryList.filter(p => p.currentStock > p.reorderLevel).length;

        // Inventory Value calculation (Stock level * Unit Price)
        let totalValue = 0;
        inventoryList.forEach(p => {
            totalValue += (p.currentStock * p.unitPrice);
        });

        // Set DOM Text
        totalProductsEl.innerText = total;
        inStockEl.innerText = inStock;
        lowStockEl.innerText = lowStock;
        outOfStockEl.innerText = outOfStock;
        inventoryValueEl.innerText = "₹" + totalValue.toLocaleString();

        // Refresh dynamic table view
        applyFiltersAndRender();
    }

    /* ============================================================
       CSV EXPORT FEATURE
       ============================================================ */
    function initCSVExport() {
        if (btnExport) {
            btnExport.addEventListener("click", () => {
                if (filteredInventory.length === 0) {
                    showToast("No products available to export.");
                    return;
                }

                // CSV headers definition
                const headers = ["Product ID", "SKU", "Product Name", "Category", "Supplier", "Current Stock", "Reserved Stock", "Available Stock", "Unit Price (INR)", "Inventory Value (INR)", "Reorder Level", "Status", "Last Updated"];
                
                // Construct CSV lines
                let csvRows = [headers.join(",")];
                
                filteredInventory.forEach(p => {
                    const available = p.currentStock - p.reservedStock;
                    const value = p.currentStock * p.unitPrice;
                    
                    let status = "In Stock";
                    if (p.currentStock === 0) status = "Out of Stock";
                    else if (p.currentStock <= p.reorderLevel) status = "Low Stock";

                    const row = [
                        p.id,
                        p.sku,
                        `"${p.name.replace(/"/g, '""')}"`,
                        p.category,
                        p.supplier,
                        p.currentStock,
                        p.reservedStock,
                        available,
                        p.unitPrice,
                        value,
                        p.reorderLevel,
                        status,
                        `"${p.lastUpdated}"`
                    ];
                    csvRows.push(row.join(","));
                });

                const csvString = csvRows.join("\n");
                const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                
                // Trigger download
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `flipkart_admin_inventory_${Date.now()}.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showToast("Inventory catalog exported to CSV.");
            });
        }
    }

    /* ============================================================
       FILTER & SORT CONTROL EVENTS
       ============================================================ */
    function initFilters() {
        const triggers = [searchNameInput, searchSkuInput, categoryFilter, statusFilter, supplierFilter, sortFilter];
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
                searchNameInput.value = "";
                searchSkuInput.value = "";
                categoryFilter.value = "All";
                statusFilter.value = "All";
                supplierFilter.value = "All";
                sortFilter.value = "stock-asc";

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
                    searchNameInput.value = "";
                    searchSkuInput.value = "";
                    categoryFilter.value = "All";
                    statusFilter.value = "All";
                    supplierFilter.value = "All";
                    sortFilter.value = "stock-asc";
                    currentPage = 1;

                    // Redraw
                    updateDashboard();
                    showToast("Inventory catalog refreshed.");
                }, 500);
            });
        }
    }

    function applyFiltersAndRender() {
        filteredInventory = [...inventoryList];

        // 1. Filter by Name
        const nameQuery = searchNameInput.value.toLowerCase().trim();
        if (nameQuery) {
            filteredInventory = filteredInventory.filter(p => p.name.toLowerCase().includes(nameQuery));
        }

        // 2. Filter by SKU
        const skuQuery = searchSkuInput.value.toLowerCase().trim();
        if (skuQuery) {
            filteredInventory = filteredInventory.filter(p => p.sku.toLowerCase().includes(skuQuery));
        }

        // 3. Filter by Category
        const categoryVal = categoryFilter.value;
        if (categoryVal !== "All") {
            filteredInventory = filteredInventory.filter(p => p.category === categoryVal);
        }

        // 4. Filter by Stock Status
        const statusVal = statusFilter.value;
        if (statusVal !== "All") {
            filteredInventory = filteredInventory.filter(p => {
                if (statusVal === "In Stock") return p.currentStock > p.reorderLevel;
                if (statusVal === "Low Stock") return p.currentStock > 0 && p.currentStock <= p.reorderLevel;
                if (statusVal === "Out of Stock") return p.currentStock === 0;
                return true;
            });
        }

        // 5. Filter by Supplier
        const supplierVal = supplierFilter.value;
        if (supplierVal !== "All") {
            filteredInventory = filteredInventory.filter(p => p.supplier === supplierVal);
        }

        // 6. Apply Sorting
        const sortVal = sortFilter.value;
        filteredInventory.sort((a, b) => {
            if (sortVal === "stock-asc") {
                return a.currentStock - b.currentStock;
            } else if (sortVal === "stock-desc") {
                return b.currentStock - a.currentStock;
            } else if (sortVal === "value-desc") {
                return (b.currentStock * b.unitPrice) - (a.currentStock * a.unitPrice);
            } else if (sortVal === "name-asc") {
                return a.name.localeCompare(b.name);
            } else if (sortVal === "name-desc") {
                return b.name.localeCompare(a.name);
            }
            return 0;
        });

        // 7. Render Table & Pagination
        renderTable();
    }

    /* ============================================================
       TABLE RENDERER
       ============================================================ */
    function renderTable() {
        tableBody.innerHTML = "";
        const totalRows = filteredInventory.length;

        // If no records, draw empty state
        if (totalRows === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="12" style="padding: 0;">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-warehouse"></i></div>
                            <h4 class="empty-state-title">No Inventory Items</h4>
                            <p class="empty-state-desc">We couldn't find any catalog listings matching your search. Try resetting filters.</p>
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

            showingText.innerText = "Showing 0 of 0 products";
            paginationContainer.innerHTML = "";
            return;
        }

        // Slice pagination records
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
        const paginatedRecords = filteredInventory.slice(startIndex, endIndex);

        showingText.innerText = `Showing ${startIndex + 1}-${endIndex} of ${totalRows} products`;

        // Render rows
        paginatedRecords.forEach(prod => {
            // Compute available stock and status badges
            const available = prod.currentStock - prod.reservedStock;
            
            let status = "in-stock";
            let statusText = "In Stock";
            let rowAlertClass = "";

            if (prod.currentStock === 0) {
                status = "out-of-stock";
                statusText = "Out of Stock";
            } else if (prod.currentStock <= prod.reorderLevel) {
                status = "low-stock";
                statusText = "Low Stock";
                rowAlertClass = "row-low-stock-alert"; // Row alert color trigger
            }

            // Available stock text color critical checks
            let availableStockClass = "";
            if (available === 0) {
                availableStockClass = "stock-critical";
            } else if (available <= prod.reorderLevel) {
                availableStockClass = "stock-warning";
            }

            // Inventory Value calculations
            const invValue = prod.currentStock * prod.unitPrice;

            // Create row tr
            const tr = document.createElement("tr");
            tr.id = `row-prod-${prod.id}`;
            if (rowAlertClass) tr.className = rowAlertClass;
            tr.innerHTML = `
                <td>
                    <div class="product-details-cell">
                        <img src="${prod.image}" alt="${prod.name}" class="product-img-thumbnail">
                        <div class="product-info-text">
                            <span class="product-name-title" title="${prod.name}">${prod.name}</span>
                            <span class="product-supplier-subtitle">${prod.supplier}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="sku-txt">${prod.sku}</span>
                </td>
                <td>
                    <span style="font-weight: 500;">${prod.category}</span>
                </td>
                <td style="text-align: center;">
                    <span class="qty-badge">${prod.currentStock}</span>
                </td>
                <td style="text-align: center;">
                    <span class="qty-badge" style="opacity: 0.85;">${prod.reservedStock}</span>
                </td>
                <td style="text-align: center;">
                    <span class="qty-badge ${availableStockClass}">${available}</span>
                </td>
                <td>
                    <span style="font-weight: 500;">₹${prod.unitPrice.toLocaleString()}</span>
                </td>
                <td>
                    <span class="amount-txt">₹${invValue.toLocaleString()}</span>
                </td>
                <td style="text-align: center;">
                    <span class="qty-badge" style="background-color: transparent; border-style: dashed; font-weight: 600;">${prod.reorderLevel}</span>
                </td>
                <td>
                    <span class="status-badge ${status}">${statusText}</span>
                </td>
                <td>
                    <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500; min-width: 130px;">${prod.lastUpdated}</div>
                </td>
                <td>
                    <div class="action-actions-cell">
                        <button type="button" class="row-action-btn edit-btn" data-id="${prod.id}" title="Update Stock Levels">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="row-action-btn view-btn" data-id="${prod.id}" title="View Stock Modifications Ledger">
                            <i class="fas fa-history"></i>
                        </button>
                        <button type="button" class="row-action-btn delete-btn" data-id="${prod.id}" title="Remove Catalog Product">
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
        // Edit Stock button
        tableBody.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                openUpdateModal(btn.dataset.id);
            });
        });

        // Ledger History button
        tableBody.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                openHistoryModal(btn.dataset.id);
            });
        });

        // Delete Product button
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
       MODAL UPDATE STOCK LOGIC
       ============================================================ */
    function openUpdateModal(id) {
        const prod = inventoryList.find(p => p.id === id);
        if (!prod) return;

        selectedProductId = id;

        // Populate fields labels
        document.getElementById("update-prod-id").value = prod.id;
        document.getElementById("update-prod-sku").innerText = prod.sku;
        document.getElementById("update-prod-name").innerText = prod.name.split(" (")[0];

        // Reset inputs
        adjustActionSelect.value = "add";
        adjustQtyInput.value = "";
        adjustReasonSelect.value = "Restock";
        adjustNotesInput.value = "";

        updateModal.classList.add("active");
    }

    // Submit stock adjustment form
    const updateStockForm = document.getElementById("update-stock-form");
    if (updateStockForm) {
        updateStockForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const prod = inventoryList.find(p => p.id === selectedProductId);
            if (!prod) return;

            const action = adjustActionSelect.value;
            const qty = parseInt(adjustQtyInput.value, 10);
            const reason = adjustReasonSelect.value;
            const notes = adjustNotesInput.value.trim() || "No additional logs.";

            // Validation: quantity must be positive
            if (isNaN(qty) || qty <= 0) {
                showToast("Quantity must be a valid positive number.");
                return;
            }

            const prevStock = prod.currentStock;
            let newStock = prevStock;
            let changeLabel = "";

            if (action === "add") {
                newStock = prevStock + qty;
                changeLabel = `+${qty}`;
            } else if (action === "remove") {
                newStock = prevStock - qty;
                if (newStock < 0) {
                    showToast(`Error: Stock cannot fall below 0. (Current stock is ${prevStock})`);
                    return;
                }
                changeLabel = `-${qty}`;
            } else if (action === "set") {
                newStock = qty;
                changeLabel = `=${qty}`;
            }

            // Save variables and update lastUpdated timestamp
            const now = new Date();
            const timeStr = now.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) + " " + now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            prod.currentStock = newStock;
            prod.lastUpdated = timeStr;

            // Push ledger transaction record
            prod.history.unshift({
                date: timeStr,
                change: changeLabel,
                prevStock: prevStock,
                newStock: newStock,
                updatedBy: "Sanket Amte (Admin)",
                reason: reason,
                notes: notes
            });

            updateModal.classList.remove("active");
            updateDashboard();
            showToast(`Inventory updated for SKU ${prod.sku}.`);
        });
    }

    /* ============================================================
       MODAL VIEW STOCK HISTORY LOGS LEDGER
       ============================================================ */
    function openHistoryModal(id) {
        const prod = inventoryList.find(p => p.id === id);
        if (!prod) return;

        selectedProductId = id;

        // Set top labels
        document.getElementById("history-prod-sku").innerText = prod.sku;
        document.getElementById("history-prod-name").innerText = prod.name.split(" (")[0];

        // Loop history logs rows
        const historyTableBody = document.getElementById("history-table-body");
        historyTableBody.innerHTML = "";

        if (prod.history && prod.history.length > 0) {
            prod.history.forEach(log => {
                let changeClass = "history-change-audit";
                if (log.change.startsWith("+")) changeClass = "history-change-add";
                else if (log.change.startsWith("-")) changeClass = "history-change-remove";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td style="font-size: 0.8rem; font-weight: 500; min-width: 120px;">${log.date}</td>
                    <td style="text-align: center;"><span class="${changeClass}">${log.change}</span></td>
                    <td style="text-align: center;">${log.prevStock}</td>
                    <td style="text-align: center; font-weight: bold;">${log.newStock}</td>
                    <td>${log.updatedBy}</td>
                    <td><span class="status-badge" style="background-color: rgba(59, 130, 246, 0.08); color: var(--info-color); padding: 2px 6px; font-size: 0.72rem; border-radius: 4px; text-transform: none; display: inline-block;">${log.reason}</span></td>
                    <td style="font-size: 0.8rem; color: var(--text-muted);">${log.notes}</td>
                `;
                historyTableBody.appendChild(tr);
            });
        } else {
            historyTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 16px 0;">No stock modifications history found for this product.</td>
                </tr>
            `;
        }

        historyModal.classList.add("active");
    }

    /* ============================================================
       MODAL DELETE PRODUCT FROM WAREHOUSE LOGIC
       ============================================================ */
    function openDeleteModal(id) {
        const prod = inventoryList.find(p => p.id === id);
        if (!prod) return;

        selectedProductId = id;
        document.getElementById("delete-modal-desc").innerText = `Are you sure you want to remove ${prod.name} from the warehouse catalog? This action will completely erase all stock records and ledger transaction logs.`;
        deleteModal.classList.add("active");
    }

    const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", () => {
            deleteModal.classList.remove("active");
            selectedProductId = null;
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (selectedProductId !== null) {
                const tr = document.getElementById(`row-prod-${selectedProductId}`);
                const prod = inventoryList.find(p => p.id === selectedProductId);
                const name = prod ? prod.name : "Product";

                if (tr) {
                    tr.style.opacity = 0;
                    tr.style.transform = "translateX(-20px)";
                    setTimeout(() => {
                        inventoryList = inventoryList.filter(p => p.id !== selectedProductId);
                        selectedProductId = null;
                        deleteModal.classList.remove("active");
                        updateDashboard();
                        showToast(`${name} removed successfully.`);
                    }, 300);
                } else {
                    inventoryList = inventoryList.filter(p => p.id !== selectedProductId);
                    selectedProductId = null;
                    deleteModal.classList.remove("active");
                    updateDashboard();
                    showToast(`${name} removed successfully.`);
                }
            }
        });
    }

    /* ============================================================
       MODAL CLOSE LISTENERS INITIALIZER
       ============================================================ */
    function initModalCloseListeners() {
        // Update close
        const closeUpdate = document.getElementById("close-update-modal");
        const cancelUpdate = document.getElementById("cancel-update-btn");
        if (closeUpdate) closeUpdate.addEventListener("click", () => updateModal.classList.remove("active"));
        if (cancelUpdate) cancelUpdate.addEventListener("click", () => updateModal.classList.remove("active"));

        // History close
        const closeHistory = document.getElementById("close-history-modal");
        const okHistory = document.getElementById("ok-history-modal");
        if (closeHistory) closeHistory.addEventListener("click", () => historyModal.classList.remove("active"));
        if (okHistory) okHistory.addEventListener("click", () => historyModal.classList.remove("active"));

        // Delete close
        const closeDelete = document.getElementById("cancel-delete-btn"); // shared element

        // Click outside overlay to close modal boxes
        window.addEventListener("click", (e) => {
            if (e.target === updateModal) updateModal.classList.remove("active");
            if (e.target === historyModal) historyModal.classList.remove("active");
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
