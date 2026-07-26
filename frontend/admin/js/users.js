/* ============================================================
   FLIPKART CLONE - ADMIN USERS MANAGEMENT MODULE JS LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Theme Toggle Sync
    initTheme();

    // Layout Sidebar & Profile dropdown toggles
    initLayoutToggles();

    // Mock Data and Core Operations
    initUsersManager();
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
   USERS MANAGEMENT CONTROLLER
   ============================================================ */
function initUsersManager() {
    // 1. Core Users Database Mock
    let usersList = [
        {
            id: "USR10293847",
            name: "Sanket Amte",
            email: "sanket.amte@gmail.com",
            phone: "+91 98765 43210",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
            role: "Admin",
            status: "Active",
            gender: "Male",
            joinDate: "2026-07-20",
            lastLogin: "2026-07-20 10:15",
            address: {
                line: "Flat 402, Sunshine Towers, Senapati Bapat Marg",
                city: "Mumbai",
                state: "Maharashtra",
                zip: "400013",
                country: "India"
            },
            wishlistCount: 8,
            cartItemsCount: 2,
            totalOrders: 3,
            totalSpending: 31289,
            orderHistory: [
                { id: "OD9281938472", date: "2026-07-20", amount: 31289, status: "Delivered" },
                { id: "OD9081298319", date: "2026-07-10", amount: 1299, status: "Delivered" }
            ]
        },
        {
            id: "USR29381029",
            name: "Rajesh Kumar",
            email: "rajesh.kr@yahoo.com",
            phone: "+91 91234 56789",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
            role: "Customer",
            status: "Active",
            gender: "Male",
            joinDate: "2026-07-15",
            lastLogin: "2026-07-20 09:30",
            address: {
                line: "H.No. 42-A, Block C, Sector 15",
                city: "Noida",
                state: "Uttar Pradesh",
                zip: "201301",
                country: "India"
            },
            wishlistCount: 15,
            cartItemsCount: 4,
            totalOrders: 10,
            totalSpending: 124999,
            orderHistory: [
                { id: "OD2839485721", date: "2026-07-19", amount: 124999, status: "Shipped" }
            ]
        },
        {
            id: "USR38471029",
            name: "Priya Sharma",
            email: "priya.sharma@outlook.com",
            phone: "+91 99887 76655",
            photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
            role: "Customer",
            status: "Active",
            gender: "Female",
            joinDate: "2026-07-10",
            lastLogin: "2026-07-20 08:00",
            address: {
                line: "Apt 902, Rosewood Heights, Baner Road",
                city: "Pune",
                state: "Maharashtra",
                zip: "411045",
                country: "India"
            },
            wishlistCount: 22,
            cartItemsCount: 1,
            totalOrders: 5,
            totalSpending: 7898,
            orderHistory: [
                { id: "OD3849182730", date: "2026-07-20", amount: 7898, status: "Packed" }
            ]
        },
        {
            id: "USR47391029",
            name: "Amit Patel",
            email: "amit.patel@rediffmail.com",
            phone: "+91 97766 55443",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
            role: "Seller",
            status: "Active",
            gender: "Male",
            joinDate: "2026-07-19",
            lastLogin: "2026-07-20 10:05",
            address: {
                line: "12, Shanti Kunj Society, Ashram Road",
                city: "Ahmedabad",
                state: "Gujarat",
                zip: "380009",
                country: "India"
            },
            wishlistCount: 3,
            cartItemsCount: 5,
            totalOrders: 20,
            totalSpending: 42199,
            orderHistory: [
                { id: "OD4859201938", date: "2026-07-20", amount: 2199, status: "Pending" }
            ]
        },
        {
            id: "USR58291029",
            name: "Neha Gupta",
            email: "neha.gupta@gmail.com",
            phone: "+91 93322 11000",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
            role: "Customer",
            status: "Blocked",
            gender: "Female",
            joinDate: "2026-06-05",
            lastLogin: "2026-07-15 12:00",
            address: {
                line: "Flat 101, Block B, Royal Enclave, Salt Lake",
                city: "Kolkata",
                state: "West Bengal",
                zip: "700091",
                country: "India"
            },
            wishlistCount: 0,
            cartItemsCount: 0,
            totalOrders: 3,
            totalSpending: 2997,
            orderHistory: [
                { id: "OD5829102948", date: "2026-07-15", amount: 2997, status: "Delivered" }
            ]
        },
        {
            id: "USR67812903",
            name: "Vikram Singh",
            email: "vikram.singh@gmail.com",
            phone: "+91 94567 89012",
            photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces",
            role: "Customer",
            status: "Active",
            gender: "Male",
            joinDate: "2026-07-02",
            lastLogin: "2026-07-18 16:20",
            address: {
                line: "C-112, Malviya Nagar",
                city: "Jaipur",
                state: "Rajasthan",
                zip: "302017",
                country: "India"
            },
            wishlistCount: 12,
            cartItemsCount: 3,
            totalOrders: 8,
            totalSpending: 8995,
            orderHistory: [
                { id: "OD6781290345", date: "2026-07-18", amount: 8995, status: "Cancelled" }
            ]
        },
        {
            id: "USR78912345",
            name: "Ananya Roy",
            email: "ananya.roy@live.com",
            phone: "+91 96543 21098",
            photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=faces",
            role: "Customer",
            status: "Active",
            gender: "Female",
            joinDate: "2026-07-14",
            lastLogin: "2026-07-17 14:00",
            address: {
                line: "Flat 5C, Sunrise Apartments, Gariahat Road",
                city: "Kolkata",
                state: "West Bengal",
                zip: "700029",
                country: "India"
            },
            wishlistCount: 19,
            cartItemsCount: 0,
            totalOrders: 12,
            totalSpending: 18990,
            orderHistory: [
                { id: "OD7891234567", date: "2026-07-14", amount: 6299, status: "Delivered" }
            ]
        },
        {
            id: "USR89012345",
            name: "Sandeep Verma",
            email: "sandeep.v@gmail.com",
            phone: "+91 95432 10987",
            photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
            role: "Seller",
            status: "Active",
            gender: "Male",
            joinDate: "2026-05-18",
            lastLogin: "2026-07-20 07:30",
            address: {
                line: "Qtr No. 12/B, Type-4, Railway Colony",
                city: "Lucknow",
                state: "Uttar Pradesh",
                zip: "226001",
                country: "India"
            },
            wishlistCount: 2,
            cartItemsCount: 1,
            totalOrders: 15,
            totalSpending: 56999,
            orderHistory: [
                { id: "OD8901234568", date: "2026-07-19", amount: 54499, status: "Confirmed" }
            ]
        },
        {
            id: "USR90123456",
            name: "Karan Malhotra",
            email: "karan.mal@gmail.com",
            phone: "+91 94321 09876",
            photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=faces",
            role: "Customer",
            status: "Blocked",
            gender: "Male",
            joinDate: "2026-06-25",
            lastLogin: "2026-07-16 18:50",
            address: {
                line: "88, Phase 2, DLF Cyber City",
                city: "Gurugram",
                state: "Haryana",
                zip: "122002",
                country: "India"
            },
            wishlistCount: 0,
            cartItemsCount: 0,
            totalOrders: 2,
            totalSpending: 45900,
            orderHistory: [
                { id: "OD9012345679", date: "2026-07-16", amount: 42900, status: "Delivered" }
            ]
        },
        {
            id: "USR01234567",
            name: "Meera Nair",
            email: "meera.nair@hotmail.com",
            phone: "+91 93210 98765",
            photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
            role: "Customer",
            status: "Active",
            gender: "Female",
            joinDate: "2026-07-18",
            lastLogin: "2026-07-20 09:10",
            address: {
                line: "Flat S-2, Tulip Block, Prestige Lakeside Habitat",
                city: "Bengaluru",
                state: "Karnataka",
                zip: "560087",
                country: "India"
            },
            wishlistCount: 7,
            cartItemsCount: 3,
            totalOrders: 7,
            totalSpending: 4197,
            orderHistory: [
                { id: "OD0123456789", date: "2026-07-20", amount: 2839, status: "Out For Delivery" }
            ]
        },
        {
            id: "USR11223344",
            name: "Rohan Das",
            email: "rohan.das@gmail.com",
            phone: "+91 92109 87654",
            photo: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=100&h=100&fit=crop&crop=faces",
            role: "Customer",
            status: "Active",
            gender: "Male",
            joinDate: "2026-07-20",
            lastLogin: "2026-07-20 10:15",
            address: {
                line: "Block D-3, 3rd Floor, Mansarovar Heights",
                city: "Secunderabad",
                state: "Telangana",
                zip: "500009",
                country: "India"
            },
            wishlistCount: 4,
            cartItemsCount: 1,
            totalOrders: 1,
            totalSpending: 9995,
            orderHistory: [
                { id: "OD1122334455", date: "2026-07-20", amount: 9495, status: "Pending" }
            ]
        },
        {
            id: "USR22334455",
            name: "Divya Deshmukh",
            email: "divya.d@gmail.com",
            phone: "+91 91098 76543",
            photo: "https://images.unsplash.com/photo-1534751516642-a131fed10495?w=100&h=100&fit=crop&crop=faces",
            role: "Customer",
            status: "Active",
            gender: "Female",
            joinDate: "2026-07-17",
            lastLogin: "2026-07-18 09:00",
            address: {
                line: "404, Pride Residency, Shivaji Nagar",
                city: "Nagpur",
                state: "Maharashtra",
                zip: "440010",
                country: "India"
            },
            wishlistCount: 6,
            cartItemsCount: 1,
            totalOrders: 4,
            totalSpending: 4999,
            orderHistory: [
                { id: "OD2233445566", date: "2026-07-17", amount: 4199, status: "Cancelled" }
            ]
        }
    ];

    // Pagination/Filtering State
    let filteredUsers = [...usersList];
    let currentPage = 1;
    const rowsPerPage = 10;

    // DOM Element Selectors
    const tableBody = document.getElementById("users-table-body");
    const showingText = document.getElementById("showing-text");
    const paginationContainer = document.getElementById("pagination-container");

    // Metrics Selectors
    const totalUsersEl = document.getElementById("total-users-cnt");
    const activeUsersEl = document.getElementById("active-users-cnt");
    const newUsersEl = document.getElementById("new-users-cnt");
    const premiumUsersEl = document.getElementById("premium-users-cnt");
    const blockedUsersEl = document.getElementById("blocked-users-cnt");

    // Filter Inputs Selectors
    const searchNameInput = document.getElementById("u-search-name");
    const searchEmailInput = document.getElementById("u-search-email");
    const searchPhoneInput = document.getElementById("u-search-phone");
    const roleFilter = document.getElementById("u-filter-role");
    const statusFilter = document.getElementById("u-filter-status");
    const sortFilter = document.getElementById("u-sort");

    // Action Buttons
    const btnClearFilters = document.getElementById("btn-clear-filters");
    const btnRefresh = document.getElementById("btn-refresh");
    const btnExport = document.getElementById("btn-export");

    // Modal elements
    const viewModal = document.getElementById("view-user-modal");
    const editModal = document.getElementById("edit-user-modal");
    const blockModal = document.getElementById("block-confirm-modal");
    const deleteModal = document.getElementById("delete-confirm-modal");

    // State tracks
    let selectedUserId = null;

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
        const total = usersList.length;
        const active = usersList.filter(u => u.status === "Active").length;
        const blocked = usersList.filter(u => u.status === "Blocked").length;

        // New Users This Month (Joined 2026-07-xx)
        const newThisMonth = usersList.filter(u => u.joinDate.startsWith("2026-07")).length;

        // Premium Users (Spenders of >= ₹25,000)
        const premium = usersList.filter(u => u.totalSpending >= 25000).length;

        // Set DOM Text
        totalUsersEl.innerText = total;
        activeUsersEl.innerText = active;
        newUsersEl.innerText = newThisMonth;
        premiumUsersEl.innerText = premium;
        blockedUsersEl.innerText = blocked;

        // Render Table list matching active search queries
        applyFiltersAndRender();
    }

    /* ============================================================
       CSV EXPORT FEATURE
       ============================================================ */
    function initCSVExport() {
        if (btnExport) {
            btnExport.addEventListener("click", () => {
                if (filteredUsers.length === 0) {
                    showToast("No users available to export.");
                    return;
                }

                // CSV headers definition
                const headers = ["User ID", "Name", "Email", "Phone", "Gender", "Role", "Status", "Join Date", "Last Login", "Total Orders", "Total Spending (INR)", "Address Line", "City", "State", "Zip Code", "Country"];
                
                // Construct CSV lines
                let csvRows = [headers.join(",")];
                
                filteredUsers.forEach(u => {
                    const row = [
                        u.id,
                        `"${u.name.replace(/"/g, '""')}"`,
                        u.email,
                        u.phone,
                        u.gender,
                        u.role,
                        u.status,
                        u.joinDate,
                        u.lastLogin,
                        u.totalOrders,
                        u.totalSpending,
                        `"${u.address.line.replace(/"/g, '""')}"`,
                        u.address.city,
                        u.address.state,
                        u.address.zip,
                        u.address.country
                    ];
                    csvRows.push(row.join(","));
                });

                const csvString = csvRows.join("\n");
                const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                
                // Trigger download
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `flipkart_admin_users_${Date.now()}.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showToast("Users catalog exported to CSV.");
            });
        }
    }

    /* ============================================================
       FILTER & SORT CONTROL EVENTS
       ============================================================ */
    function initFilters() {
        const triggers = [searchNameInput, searchEmailInput, searchPhoneInput, roleFilter, statusFilter, sortFilter];
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
                searchEmailInput.value = "";
                searchPhoneInput.value = "";
                roleFilter.value = "All";
                statusFilter.value = "All";
                sortFilter.value = "join-desc";

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
                    searchEmailInput.value = "";
                    searchPhoneInput.value = "";
                    roleFilter.value = "All";
                    statusFilter.value = "All";
                    sortFilter.value = "join-desc";
                    currentPage = 1;

                    // Redraw
                    updateDashboard();
                    showToast("Users catalog refreshed.");
                }, 500);
            });
        }
    }

    function applyFiltersAndRender() {
        filteredUsers = [...usersList];

        // 1. Filter by Name
        const nameQuery = searchNameInput.value.toLowerCase().trim();
        if (nameQuery) {
            filteredUsers = filteredUsers.filter(u => u.name.toLowerCase().includes(nameQuery));
        }

        // 2. Filter by Email
        const emailQuery = searchEmailInput.value.toLowerCase().trim();
        if (emailQuery) {
            filteredUsers = filteredUsers.filter(u => u.email.toLowerCase().includes(emailQuery));
        }

        // 3. Filter by Phone
        const phoneQuery = searchPhoneInput.value.toLowerCase().trim();
        if (phoneQuery) {
            filteredUsers = filteredUsers.filter(u => u.phone.toLowerCase().includes(phoneQuery));
        }

        // 4. Filter by Role
        const roleVal = roleFilter.value;
        if (roleVal !== "All") {
            filteredUsers = filteredUsers.filter(u => u.role === roleVal);
        }

        // 5. Filter by Status
        const statusVal = statusFilter.value;
        if (statusVal !== "All") {
            filteredUsers = filteredUsers.filter(u => u.status === statusVal);
        }

        // 6. Apply Sorting
        const sortVal = sortFilter.value;
        filteredUsers.sort((a, b) => {
            if (sortVal === "join-desc") {
                return new Date(b.joinDate) - new Date(a.joinDate);
            } else if (sortVal === "join-asc") {
                return new Date(a.joinDate) - new Date(b.joinDate);
            } else if (sortVal === "spending-desc") {
                return b.totalSpending - a.totalSpending;
            } else if (sortVal === "spending-asc") {
                return a.totalSpending - b.totalSpending;
            } else if (sortVal === "orders-desc") {
                return b.totalOrders - a.totalOrders;
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
        const totalRows = filteredUsers.length;

        // If no records, draw empty state
        if (totalRows === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="11" style="padding: 0;">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-users-slash"></i></div>
                            <h4 class="empty-state-title">No Users Found</h4>
                            <p class="empty-state-desc">We couldn't find any user profiles matching your criteria. Try adjusting filters.</p>
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

            showingText.innerText = "Showing 0 of 0 users";
            paginationContainer.innerHTML = "";
            return;
        }

        // Slice pagination records
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
        const paginatedRecords = filteredUsers.slice(startIndex, endIndex);

        showingText.innerText = `Showing ${startIndex + 1}-${endIndex} of ${totalRows} users`;

        // Render rows
        paginatedRecords.forEach(user => {
            // Format join date: YYYY-MM-DD to DD-MMM-YYYY
            const dateObj = new Date(user.joinDate);
            const formattedJoin = dateObj.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            // Create row tr
            const tr = document.createElement("tr");
            tr.id = `row-user-${user.id}`;
            tr.innerHTML = `
                <td style="text-align: center;">
                    <img src="${user.photo}" alt="${user.name}" class="user-avatar-cell">
                </td>
                <td>
                    <span class="order-id-txt" data-id="${user.id}">${user.id}</span>
                </td>
                <td>
                    <div class="cust-name">${user.name}</div>
                    <div class="cust-sub">${user.gender}</div>
                </td>
                <td>
                    <span style="font-weight: 500;">${user.email}</span>
                </td>
                <td>
                    <span style="color: var(--text-muted); font-weight: 500;">${user.phone}</span>
                </td>
                <td>
                    <span class="role-badge ${user.role.toLowerCase()}">${user.role}</span>
                </td>
                <td>
                    <span class="status-badge ${user.status.toLowerCase()}">${user.status}</span>
                </td>
                <td>
                    <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">${formattedJoin}</div>
                </td>
                <td style="text-align: center;">
                    <span class="qty-badge">${user.totalOrders}</span>
                </td>
                <td>
                    <span class="amount-txt">₹${user.totalSpending.toLocaleString()}</span>
                </td>
                <td>
                    <div class="action-actions-cell">
                        <button type="button" class="row-action-btn view-btn" data-id="${user.id}" title="View Details Profile">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="row-action-btn edit-btn" data-id="${user.id}" title="Edit User Information">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="row-action-btn block-btn" data-id="${user.id}" title="${user.status === 'Active' ? 'Block User' : 'Unblock User'}">
                            <i class="fas ${user.status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                        </button>
                        <button type="button" class="row-action-btn reset-btn" data-id="${user.id}" title="Reset User Password">
                            <i class="fas fa-key"></i>
                        </button>
                        <button type="button" class="row-action-btn delete-btn" data-id="${user.id}" title="Delete User">
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
        tableBody.querySelectorAll(".order-id-txt").forEach(el => {
            el.addEventListener("click", () => {
                viewUserProfile(el.dataset.id);
            });
        });

        // View Profile button
        tableBody.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                viewUserProfile(btn.dataset.id);
            });
        });

        // Edit profile button
        tableBody.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                openEditModal(btn.dataset.id);
            });
        });

        // Block / Unblock button
        tableBody.querySelectorAll(".block-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                openBlockModal(btn.dataset.id);
            });
        });

        // Reset password key button
        tableBody.querySelectorAll(".reset-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                triggerPasswordReset(btn.dataset.id);
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
       MODAL VIEW USER DETAILS LOGIC
       ============================================================ */
    function viewUserProfile(id) {
        const user = usersList.find(u => u.id === id);
        if (!user) return;

        selectedUserId = id;

        // Setup top header
        document.getElementById("detail-profile-img").src = user.photo;
        document.getElementById("detail-user-name").innerText = user.name;
        
        const roleB = document.getElementById("detail-user-role-badge");
        roleB.className = `role-badge ${user.role.toLowerCase()}`;
        roleB.innerText = user.role;

        const statusB = document.getElementById("detail-user-status-badge");
        statusB.className = `status-badge ${user.status.toLowerCase()}`;
        statusB.innerText = user.status;

        // Personal Info fields
        document.getElementById("detail-user-id").innerText = user.id;
        document.getElementById("detail-user-email").innerText = user.email;
        document.getElementById("detail-user-phone").innerText = user.phone;
        document.getElementById("detail-user-gender").innerText = user.gender;

        // Dates formatting
        const joinDateObj = new Date(user.joinDate);
        document.getElementById("detail-user-join-date").innerText = joinDateObj.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        document.getElementById("detail-user-last-login").innerText = user.lastLogin;

        // Address Lines
        const addr = user.address;
        document.getElementById("detail-user-address").innerText = `${addr.line}, ${addr.city}, ${addr.state} - ${addr.zip}, ${addr.country}`;

        // Engagement Summary values
        document.getElementById("detail-wishlist-cnt").innerText = user.wishlistCount;
        document.getElementById("detail-cart-cnt").innerText = user.cartItemsCount;
        document.getElementById("detail-spending-cnt").innerText = "₹" + user.totalSpending.toLocaleString();

        // Orders Table history rendering
        const orderHistoryBody = document.getElementById("detail-orders-body");
        orderHistoryBody.innerHTML = "";

        if (user.orderHistory && user.orderHistory.length > 0) {
            user.orderHistory.forEach(ord => {
                const dateObj = new Date(ord.date);
                const formattedDate = dateObj.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td style="font-weight: 700; color: var(--brand-primary);">${ord.id}</td>
                    <td>${formattedDate}</td>
                    <td style="font-weight: 600;">₹${ord.amount.toLocaleString()}</td>
                    <td style="text-align: right;"><span class="status-badge ${ord.status.toLowerCase().replace(/ /g, '-')}">${ord.status}</span></td>
                `;
                orderHistoryBody.appendChild(tr);
            });
        } else {
            orderHistoryBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 12px 0;">No order history found for this user.</td>
                </tr>
            `;
        }

        // Display Modal
        viewModal.classList.add("active");
    }

    /* ============================================================
       MODAL EDIT USER LOGIC
       ============================================================ */
    function openEditModal(id) {
        const user = usersList.find(u => u.id === id);
        if (!user) return;

        selectedUserId = id;

        // Set form fields matching user
        document.getElementById("edit-user-id-hidden").value = user.id;
        document.getElementById("edit-user-name-input").value = user.name;
        document.getElementById("edit-user-gender-input").value = user.gender;
        document.getElementById("edit-user-email-input").value = user.email;
        document.getElementById("edit-user-phone-input").value = user.phone;
        document.getElementById("edit-user-role-input").value = user.role;
        document.getElementById("edit-user-status-input").value = user.status;

        // Address lines
        document.getElementById("edit-address-line").value = user.address.line;
        document.getElementById("edit-address-city").value = user.address.city;
        document.getElementById("edit-address-state").value = user.address.state;
        document.getElementById("edit-address-zip").value = user.address.zip;
        document.getElementById("edit-address-country").value = user.address.country;

        editModal.classList.add("active");
    }

    const editForm = document.getElementById("edit-user-form");
    if (editForm) {
        editForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const user = usersList.find(u => u.id === selectedUserId);
            if (!user) return;

            // Gather elements input values
            user.name = document.getElementById("edit-user-name-input").value.trim();
            user.gender = document.getElementById("edit-user-gender-input").value;
            user.email = document.getElementById("edit-user-email-input").value.trim();
            user.phone = document.getElementById("edit-user-phone-input").value.trim();
            user.role = document.getElementById("edit-user-role-input").value;
            user.status = document.getElementById("edit-user-status-input").value;

            // Shipping lines
            user.address.line = document.getElementById("edit-address-line").value.trim();
            user.address.city = document.getElementById("edit-address-city").value.trim();
            user.address.state = document.getElementById("edit-address-state").value.trim();
            user.address.zip = document.getElementById("edit-address-zip").value.trim();
            user.address.country = document.getElementById("edit-address-country").value.trim();

            // Clear and render
            editModal.classList.remove("active");
            updateDashboard();
            showToast(`User ${user.name} profiles updated.`);
        });
    }

    /* ============================================================
       MODAL BLOCK / UNBLOCK CONFIRMATION LOGIC
       ============================================================ */
    function openBlockModal(id) {
        const user = usersList.find(u => u.id === id);
        if (!user) return;

        selectedUserId = id;

        // Set dynamic headers
        const blockTitle = document.getElementById("block-modal-title");
        const blockDesc = document.getElementById("block-modal-desc");
        const confirmBtn = document.getElementById("confirm-block-btn");

        if (user.status === "Active") {
            blockTitle.innerText = "Block User Account?";
            blockDesc.innerText = `Are you sure you want to block ${user.name}? This restricts their capability to login and make orders.`;
            confirmBtn.innerText = "Confirm Block";
        } else {
            blockTitle.innerText = "Unblock User Account?";
            blockDesc.innerText = `Are you sure you want to unblock ${user.name}? This will restore their active profile operations.`;
            confirmBtn.innerText = "Confirm Unblock";
        }

        blockModal.classList.add("active");
    }

    const cancelBlockBtn = document.getElementById("cancel-block-btn");
    const confirmBlockBtn = document.getElementById("confirm-block-btn");

    if (cancelBlockBtn) {
        cancelBlockBtn.addEventListener("click", () => {
            blockModal.classList.remove("active");
            selectedUserId = null;
        });
    }

    if (confirmBlockBtn) {
        confirmBlockBtn.addEventListener("click", () => {
            if (selectedUserId !== null) {
                const user = usersList.find(u => u.id === selectedUserId);
                if (user) {
                    // Toggle Status
                    const oldStatus = user.status;
                    user.status = oldStatus === "Active" ? "Blocked" : "Active";
                    
                    blockModal.classList.remove("active");
                    updateDashboard();
                    showToast(`User ${user.name} has been ${user.status === "Active" ? "Unblocked" : "Blocked"}.`);
                }
                selectedUserId = null;
            }
        });
    }

    /* ============================================================
       MODAL DELETE CONFIRMATION LOGIC
       ============================================================ */
    function openDeleteModal(id) {
        const user = usersList.find(u => u.id === id);
        if (!user) return;

        selectedUserId = id;
        document.getElementById("delete-modal-desc").innerText = `Are you sure you want to delete user ${user.name}? This removes their order database record permanently.`;
        deleteModal.classList.add("active");
    }

    const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", () => {
            deleteModal.classList.remove("active");
            selectedUserId = null;
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (selectedUserId !== null) {
                const tr = document.getElementById(`row-user-${selectedUserId}`);
                const user = usersList.find(u => u.id === selectedUserId);
                const name = user ? user.name : "User";

                if (tr) {
                    tr.style.opacity = 0;
                    tr.style.transform = "translateX(-20px)";
                    setTimeout(() => {
                        usersList = usersList.filter(u => u.id !== selectedUserId);
                        selectedUserId = null;
                        deleteModal.classList.remove("active");
                        updateDashboard();
                        showToast(`User ${name} deleted successfully.`);
                    }, 300);
                } else {
                    usersList = usersList.filter(u => u.id !== selectedUserId);
                    selectedUserId = null;
                    deleteModal.classList.remove("active");
                    updateDashboard();
                    showToast(`User ${name} deleted successfully.`);
                }
            }
        });
    }

    /* ============================================================
       RESET PASSWORD ACTION
       ============================================================ */
    function triggerPasswordReset(id) {
        const user = usersList.find(u => u.id === id);
        if (!user) return;

        // Reset password directly triggers a custom toast alert
        showToast(`Password reset link sent successfully to ${user.email}.`);
    }

    /* ============================================================
       MODAL CLOSE LISTENERS INITIALIZER
       ============================================================ */
    function initModalCloseListeners() {
        // View close
        const closeView = document.getElementById("close-view-modal");
        const okView = document.getElementById("ok-view-modal");
        if (closeView) closeView.addEventListener("click", () => viewModal.classList.remove("active"));
        if (okView) okView.addEventListener("click", () => viewModal.classList.remove("active"));

        // Edit close
        const closeEdit = document.getElementById("close-edit-modal");
        const cancelEdit = document.getElementById("cancel-edit-btn");
        if (closeEdit) closeEdit.addEventListener("click", () => editModal.classList.remove("active"));
        if (cancelEdit) cancelEdit.addEventListener("click", () => editModal.classList.remove("active"));

        // Block close
        const closeBlock = document.getElementById("cancel-block-btn"); // shared element

        // Click outside overlay to close modal boxes
        window.addEventListener("click", (e) => {
            if (e.target === viewModal) viewModal.classList.remove("active");
            if (e.target === editModal) editModal.classList.remove("active");
            if (e.target === blockModal) blockModal.classList.remove("active");
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
