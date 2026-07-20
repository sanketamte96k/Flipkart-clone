/* ============================================================
   FLIPKART CLONE - ADMIN REPORTS & ANALYTICS JS
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initLayoutToggles();
    initReportsManager();
});

/* ============================================================
   THEME
   ============================================================ */
function initTheme() {
    const themeBtn = document.getElementById("theme-btn");
    const bodyEl = document.body;
    const saved = localStorage.getItem("admin-theme") || "light";
    if (saved === "dark") { bodyEl.classList.add("dark-mode"); themeBtn.innerHTML = '<i class="fas fa-sun"></i>'; }
    themeBtn.addEventListener("click", () => {
        const isDark = bodyEl.classList.toggle("dark-mode");
        localStorage.setItem("admin-theme", isDark ? "dark" : "light");
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        if (typeof rebuildAllCharts === "function") rebuildAllCharts();
    });
}

/* ============================================================
   LAYOUT
   ============================================================ */
function initLayoutToggles() {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", (e) => { e.stopPropagation(); sidebar.classList.toggle("active"); });
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 991 && sidebar.classList.contains("active") && !sidebar.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) sidebar.classList.remove("active");
        });
    }
    const profileTrigger = document.getElementById("profile-trigger");
    const profileMenu = document.getElementById("profile-menu");
    if (profileTrigger && profileMenu) {
        profileTrigger.addEventListener("click", (e) => { e.stopPropagation(); profileMenu.classList.toggle("active"); });
        document.addEventListener("click", () => profileMenu.classList.remove("active"));
    }
}

/* ============================================================
   REPORTS CONTROLLER
   ============================================================ */
function initReportsManager() {
    // ======== MOCK DATA ========
    const mockData = {
        revenue: { daily: 285600, weekly: 1847500, monthly: 8234000, yearly: 48750000 },
        totalRevenue: 48750000,
        totalOrders: 3842,
        totalCustomers: 1256,
        totalProducts: 148,
        avgOrderValue: 12688,
        conversionRate: 4.8,
        refundRate: 2.1,

        // Daily sales over last 20 days of July 2026
        salesTrend: {
            labels: ["1 Jul","2 Jul","3 Jul","4 Jul","5 Jul","6 Jul","7 Jul","8 Jul","9 Jul","10 Jul","11 Jul","12 Jul","13 Jul","14 Jul","15 Jul","16 Jul","17 Jul","18 Jul","19 Jul","20 Jul"],
            orders: [145,168,152,189,201,178,165,192,210,198,175,220,245,232,215,248,260,275,258,285],
            revenue: [184000,213000,193000,240000,255000,226000,209000,244000,267000,251000,222000,279000,311000,294000,273000,315000,330000,349000,327000,362000]
        },

        // Categories
        categoryOrders: {
            labels: ["Electronics","Fashion","Home & Kitchen","Beauty","Sports"],
            data: [1420,890,645,512,375]
        },

        // Payment Methods
        paymentMethods: {
            labels: ["UPI","Credit Card","Debit Card","COD","Net Banking"],
            data: [1250,820,640,750,382]
        },

        // Top Selling Products
        topProducts: [
            { name: "Samsung Galaxy S23 Ultra", units: 245, revenue: 30624755, rating: 4.6 },
            { name: "Sony WH-1000XM5", units: 189, revenue: 5662110, rating: 4.8 },
            { name: "Apple Watch Series 8", units: 156, revenue: 7160400, rating: 4.7 },
            { name: "Levi's 511 Slim Jeans", units: 312, revenue: 904488, rating: 4.2 },
            { name: "Nike Air Max Shoes", units: 278, revenue: 2778610, rating: 4.5 },
            { name: "Mi Smart Air Fryer", units: 198, revenue: 1385802, rating: 4.4 },
            { name: "L'Oreal Revitalift Serum", units: 420, revenue: 419580, rating: 4.3 },
            { name: "Philips Beard Trimmer", units: 265, revenue: 582735, rating: 4.1 }
        ],

        // Customer Growth (monthly)
        customerGrowth: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
            data: [680,745,810,890,985,1120,1256]
        },

        // Monthly Comparison
        monthlyComparison: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
            revenue: [5200000,5800000,6100000,6500000,7200000,7800000,8234000],
            orders: [380,420,445,480,535,580,620]
        },

        // Top Customers
        topCustomers: [
            { name: "Rajesh Kumar", orders: 28, spending: 352800 },
            { name: "Priya Sharma", orders: 24, spending: 289600 },
            { name: "Sneha Patel", orders: 22, spending: 276400 },
            { name: "Vikram Singh", orders: 19, spending: 241300 },
            { name: "Ananya Gupta", orders: 17, spending: 198500 },
            { name: "Deepika Verma", orders: 16, spending: 187200 },
            { name: "Karan Mehta", orders: 15, spending: 175800 },
            { name: "Meera Nair", orders: 14, spending: 168400 }
        ]
    };

    // Chart instances storage
    let charts = {};

    // Expose rebuild for theme toggle
    window.rebuildAllCharts = function() { buildAllCharts(); };

    // Init
    updateSummary();
    buildAllCharts();
    renderTables();
    initFilters();
    initExport();

    /* ============================================================
       SUMMARY METRICS
       ============================================================ */
    function updateSummary() {
        document.getElementById("rev-daily").innerText = "₹" + mockData.revenue.daily.toLocaleString();
        document.getElementById("rev-weekly").innerText = "₹" + mockData.revenue.weekly.toLocaleString();
        document.getElementById("rev-monthly").innerText = "₹" + mockData.revenue.monthly.toLocaleString();
        document.getElementById("rev-yearly").innerText = "₹" + mockData.revenue.yearly.toLocaleString();

        document.getElementById("total-revenue").innerText = "₹" + mockData.totalRevenue.toLocaleString();
        document.getElementById("revenue-sub").innerText = "↑ 15.7% vs last month";
        document.getElementById("total-orders").innerText = mockData.totalOrders.toLocaleString();
        document.getElementById("orders-sub").innerText = "↑ 12.3% vs last month";
        document.getElementById("total-customers").innerText = mockData.totalCustomers.toLocaleString();
        document.getElementById("customers-sub").innerText = "↑ 8.5% vs last month";
        document.getElementById("total-products").innerText = mockData.totalProducts;
        document.getElementById("products-sub").innerText = "12 added this month";
        document.getElementById("avg-order-value").innerText = "₹" + mockData.avgOrderValue.toLocaleString();
        document.getElementById("conversion-rate").innerText = mockData.conversionRate + "%";
        document.getElementById("refund-rate").innerText = mockData.refundRate + "%";
    }

    /* ============================================================
       CHART HELPERS
       ============================================================ */
    function getChartColors() {
        const isDark = document.body.classList.contains("dark-mode");
        return {
            grid: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            text: isDark ? "#94a3b8" : "#64748b",
            tooltipBg: isDark ? "#1e293b" : "#ffffff",
            tooltipText: isDark ? "#f8fafc" : "#1e293b",
            tooltipBorder: isDark ? "#334155" : "#e2e8f0"
        };
    }

    function chartDefaults() {
        const c = getChartColors();
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: c.text, font: { size: 11, weight: 600 } } },
                tooltip: {
                    backgroundColor: c.tooltipBg, titleColor: c.tooltipText,
                    bodyColor: c.tooltipText, borderColor: c.tooltipBorder, borderWidth: 1,
                    cornerRadius: 8, padding: 10
                }
            },
            scales: {
                x: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 11, weight: 500 } } },
                y: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 11, weight: 500 } } }
            }
        };
    }

    function destroyAll() {
        Object.values(charts).forEach(ch => { if (ch) ch.destroy(); });
        charts = {};
    }

    /* ============================================================
       BUILD ALL CHARTS
       ============================================================ */
    function buildAllCharts() {
        destroyAll();
        const c = getChartColors();

        // 1. Sales Trend (Line)
        charts.sales = new Chart(document.getElementById("chart-sales-trend"), {
            type: "line",
            data: {
                labels: mockData.salesTrend.labels,
                datasets: [{
                    label: "Orders",
                    data: mockData.salesTrend.orders,
                    borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.08)",
                    borderWidth: 2.5, tension: 0.35, fill: true,
                    pointBackgroundColor: "#3b82f6", pointRadius: 3, pointHoverRadius: 6
                }]
            },
            options: { ...chartDefaults(), plugins: { ...chartDefaults().plugins, legend: { display: false } } }
        });

        // 2. Revenue Trend (Area)
        charts.revenue = new Chart(document.getElementById("chart-revenue-trend"), {
            type: "line",
            data: {
                labels: mockData.salesTrend.labels,
                datasets: [{
                    label: "Revenue (₹)",
                    data: mockData.salesTrend.revenue,
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16,185,129,0.12)",
                    borderWidth: 2.5, tension: 0.35, fill: true,
                    pointBackgroundColor: "#10b981", pointRadius: 3, pointHoverRadius: 6
                }]
            },
            options: {
                ...chartDefaults(),
                plugins: { ...chartDefaults().plugins, legend: { display: false } },
                scales: {
                    ...chartDefaults().scales,
                    y: { ...chartDefaults().scales.y, ticks: { ...chartDefaults().scales.y.ticks, callback: v => "₹" + (v / 1000).toFixed(0) + "K" } }
                }
            }
        });

        // 3. Orders by Category (Pie)
        charts.category = new Chart(document.getElementById("chart-category"), {
            type: "pie",
            data: {
                labels: mockData.categoryOrders.labels,
                datasets: [{
                    data: mockData.categoryOrders.data,
                    backgroundColor: ["#3b82f6","#8b5cf6","#14b8a6","#f59e0b","#ef4444"],
                    borderWidth: 2, borderColor: getComputedStyle(document.body).getPropertyValue('--bg-card').trim() || "#ffffff"
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom", labels: { color: c.text, font: { size: 11, weight: 600 }, padding: 16 } },
                    tooltip: chartDefaults().plugins.tooltip
                }
            }
        });

        // 4. Payment Methods (Doughnut)
        charts.payment = new Chart(document.getElementById("chart-payment"), {
            type: "doughnut",
            data: {
                labels: mockData.paymentMethods.labels,
                datasets: [{
                    data: mockData.paymentMethods.data,
                    backgroundColor: ["#6366f1","#ec4899","#f97316","#22c55e","#06b6d4"],
                    borderWidth: 2, borderColor: getComputedStyle(document.body).getPropertyValue('--bg-card').trim() || "#ffffff"
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                cutout: "60%",
                plugins: {
                    legend: { position: "bottom", labels: { color: c.text, font: { size: 11, weight: 600 }, padding: 16 } },
                    tooltip: chartDefaults().plugins.tooltip
                }
            }
        });

        // 5. Top Selling Products (Horizontal Bar)
        const topNames = mockData.topProducts.slice(0, 6).map(p => p.name.length > 20 ? p.name.substring(0, 20) + "…" : p.name);
        const topUnits = mockData.topProducts.slice(0, 6).map(p => p.units);
        charts.topProducts = new Chart(document.getElementById("chart-top-products"), {
            type: "bar",
            data: {
                labels: topNames,
                datasets: [{
                    label: "Units Sold",
                    data: topUnits,
                    backgroundColor: ["#3b82f6","#8b5cf6","#14b8a6","#f59e0b","#ec4899","#ef4444"],
                    borderRadius: 6, borderSkipped: false, barThickness: 22
                }]
            },
            options: {
                ...chartDefaults(),
                indexAxis: "y",
                plugins: { ...chartDefaults().plugins, legend: { display: false } },
                scales: {
                    x: { ...chartDefaults().scales.x },
                    y: { ...chartDefaults().scales.y, grid: { display: false } }
                }
            }
        });

        // 6. Customer Growth (Line)
        charts.customerGrowth = new Chart(document.getElementById("chart-customer-growth"), {
            type: "line",
            data: {
                labels: mockData.customerGrowth.labels,
                datasets: [{
                    label: "Total Customers",
                    data: mockData.customerGrowth.data,
                    borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.1)",
                    borderWidth: 2.5, tension: 0.35, fill: true,
                    pointBackgroundColor: "#8b5cf6", pointRadius: 4, pointHoverRadius: 7
                }]
            },
            options: { ...chartDefaults(), plugins: { ...chartDefaults().plugins, legend: { display: false } } }
        });

        // 7. Monthly Comparison (Bar)
        charts.monthlyCompare = new Chart(document.getElementById("chart-monthly-compare"), {
            type: "bar",
            data: {
                labels: mockData.monthlyComparison.labels,
                datasets: [
                    {
                        label: "Revenue (₹ Lakhs)",
                        data: mockData.monthlyComparison.revenue.map(v => v / 100000),
                        backgroundColor: "rgba(59,130,246,0.7)",
                        borderRadius: 6, yAxisID: "y"
                    },
                    {
                        label: "Orders",
                        data: mockData.monthlyComparison.orders,
                        type: "line",
                        borderColor: "#f59e0b", backgroundColor: "transparent",
                        borderWidth: 2.5, tension: 0.35,
                        pointBackgroundColor: "#f59e0b", pointRadius: 4, pointHoverRadius: 7,
                        yAxisID: "y1"
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: c.text, font: { size: 11, weight: 600 } } },
                    tooltip: chartDefaults().plugins.tooltip
                },
                scales: {
                    x: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 11, weight: 500 } } },
                    y: {
                        position: "left",
                        grid: { color: c.grid },
                        ticks: { color: c.text, font: { size: 11, weight: 500 }, callback: v => "₹" + v + "L" },
                        title: { display: true, text: "Revenue (₹ Lakhs)", color: c.text, font: { size: 11 } }
                    },
                    y1: {
                        position: "right",
                        grid: { drawOnChartArea: false },
                        ticks: { color: c.text, font: { size: 11, weight: 500 } },
                        title: { display: true, text: "Orders", color: c.text, font: { size: 11 } }
                    }
                }
            }
        });
    }

    /* ============================================================
       RENDER TABLES
       ============================================================ */
    function renderTables() {
        // Best Sellers
        const bsBody = document.getElementById("best-sellers-body");
        bsBody.innerHTML = "";
        mockData.topProducts.forEach((p, i) => {
            let rankClass = i < 3 ? `rank-${i + 1}` : "rank-other";
            let stars = "";
            for (let s = 1; s <= 5; s++) {
                stars += `<i class="fas fa-star ${s > Math.round(p.rating) ? 'empty' : ''}"></i>`;
            }
            bsBody.innerHTML += `
                <tr>
                    <td><span class="rank-badge ${rankClass}">${i + 1}</span></td>
                    <td style="font-weight: 600;">${p.name}</td>
                    <td style="text-align: center; font-weight: 700;">${p.units}</td>
                    <td style="text-align: right; font-weight: 700;">₹${p.revenue.toLocaleString()}</td>
                    <td style="text-align: center;"><span class="table-stars">${stars}</span> <span style="font-size:0.78rem; color: var(--text-muted); margin-left: 4px;">${p.rating}</span></td>
                </tr>`;
        });

        // Top Customers
        const tcBody = document.getElementById("top-customers-body");
        tcBody.innerHTML = "";
        mockData.topCustomers.forEach((c, i) => {
            let rankClass = i < 3 ? `rank-${i + 1}` : "rank-other";
            tcBody.innerHTML += `
                <tr>
                    <td><span class="rank-badge ${rankClass}">${i + 1}</span></td>
                    <td style="font-weight: 600;">${c.name}</td>
                    <td style="text-align: center; font-weight: 700;">${c.orders}</td>
                    <td style="text-align: right; font-weight: 700;">₹${c.spending.toLocaleString()}</td>
                </tr>`;
        });
    }

    /* ============================================================
       FILTERS
       ============================================================ */
    function initFilters() {
        document.getElementById("btn-apply-filters").addEventListener("click", () => {
            // Simulate filter application with a brief reload animation
            document.querySelector(".content-wrapper").style.opacity = "0.5";
            setTimeout(() => {
                document.querySelector(".content-wrapper").style.opacity = "1";
                showToast("Filters applied — displaying data for selected range.");
            }, 400);
        });
    }

    /* ============================================================
       EXPORT
       ============================================================ */
    function initExport() {
        // CSV Export
        document.getElementById("btn-export-csv").addEventListener("click", () => {
            let csvRows = ["Metric,Value"];
            csvRows.push(`Total Revenue,${mockData.totalRevenue}`);
            csvRows.push(`Total Orders,${mockData.totalOrders}`);
            csvRows.push(`Total Customers,${mockData.totalCustomers}`);
            csvRows.push(`Total Products,${mockData.totalProducts}`);
            csvRows.push(`Avg Order Value,${mockData.avgOrderValue}`);
            csvRows.push(`Conversion Rate,${mockData.conversionRate}%`);
            csvRows.push(`Refund Rate,${mockData.refundRate}%`);
            csvRows.push("");
            csvRows.push("Product,Units Sold,Revenue,Rating");
            mockData.topProducts.forEach(p => {
                csvRows.push(`"${p.name}",${p.units},${p.revenue},${p.rating}`);
            });
            csvRows.push("");
            csvRows.push("Customer,Orders,Spending");
            mockData.topCustomers.forEach(c => {
                csvRows.push(`"${c.name}",${c.orders},${c.spending}`);
            });
            csvRows.push("");
            csvRows.push("Date,Orders,Revenue");
            mockData.salesTrend.labels.forEach((lbl, i) => {
                csvRows.push(`"${lbl}",${mockData.salesTrend.orders[i]},${mockData.salesTrend.revenue[i]}`);
            });

            const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `flipkart_admin_report_${Date.now()}.csv`;
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("Report exported as CSV.");
        });

        // PDF Export (simulated with print dialog)
        document.getElementById("btn-export-pdf").addEventListener("click", () => {
            showToast("Generating PDF — opening print dialog...");
            setTimeout(() => window.print(), 500);
        });

        // Print Report
        document.getElementById("btn-print").addEventListener("click", () => {
            window.print();
        });
    }

    /* ============================================================
       TOAST
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
