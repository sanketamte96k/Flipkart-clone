/* ============================================================
   FLIPKART CLONE - ADMIN ORDERS MANAGEMENT MODULE JS LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Theme Toggle Sync
    initTheme();

    // Layout Sidebar & Profile dropdown toggles
    initLayoutToggles();

    // Mock Data and Core Operations
    initOrdersManager();
});

// Global reference to Chart instances for theme switching
let revenueChart = null;
let monthlyOrdersChart = null;

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
        
        // Sync Chart colors if charts are initialized
        updateChartsTheme();
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
   ORDERS MANAGEMENT CONTROLLER
   ============================================================ */
function initOrdersManager() {
    // 1. Core Mock Data (Redistributed with the 7 Statuses)
    let ordersList = [
        {
            id: "OD9281938472",
            customer: {
                name: "Sanket Amte",
                email: "sanket.amte@gmail.com",
                phone: "+91 98765 43210",
                address: {
                    line: "Flat 402, Sunshine Towers, Senapati Bapat Marg",
                    city: "Mumbai",
                    state: "Maharashtra",
                    zip: "400013",
                    country: "India"
                }
            },
            items: [
                {
                    id: 1,
                    name: "Sony WH-1000XM5 Wireless Headphones (Silver)",
                    price: 29990,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
                },
                {
                    id: 2,
                    name: "HP Laptop Sleeve Case (Black, Waterproof)",
                    price: 1299,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 99,
            discount: 1500,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            orderStatus: "Delivered",
            deliveryPartner: "Blue Dart",
            trackingId: "#BD98271034",
            date: "2026-07-20T09:45:00",
            timeline: [
                { status: "Pending", time: "20-Jul-2026 09:45 AM", desc: "Order placed successfully via UPI." },
                { status: "Confirmed", time: "20-Jul-2026 10:00 AM", desc: "Order payment verified by gateway." },
                { status: "Packed", time: "20-Jul-2026 10:15 AM", desc: "Packaging completed. Handed over to courier." },
                { status: "Shipped", time: "20-Jul-2026 11:30 AM", desc: "Dispatched via Blue Dart (AWB: #BD98271034)." },
                { status: "Out For Delivery", time: "20-Jul-2026 02:00 PM", desc: "Out for delivery from local hub." },
                { status: "Delivered", time: "20-Jul-2026 04:30 PM", desc: "Delivered and signed by Sanket." }
            ]
        },
        {
            id: "OD2839485721",
            customer: {
                name: "Rajesh Kumar",
                email: "rajesh.kr@yahoo.com",
                phone: "+91 91234 56789",
                address: {
                    line: "H.No. 42-A, Block C, Sector 15",
                    city: "Noida",
                    state: "Uttar Pradesh",
                    zip: "201301",
                    country: "India"
                }
            },
            items: [
                {
                    id: 3,
                    name: "Samsung Galaxy S23 Ultra 5G (Phantom Black, 256GB)",
                    price: 124999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 5000,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            orderStatus: "Shipped",
            deliveryPartner: "Delhivery Express",
            trackingId: "#DL91823094",
            date: "2026-07-19T14:30:00",
            timeline: [
                { status: "Pending", time: "19-Jul-2026 02:30 PM", desc: "Order received." },
                { status: "Confirmed", time: "19-Jul-2026 03:00 PM", desc: "Seller confirmed order availability." },
                { status: "Packed", time: "19-Jul-2026 04:00 PM", desc: "Packed at Delhi fulfillment center." },
                { status: "Shipped", time: "20-Jul-2026 08:00 AM", desc: "In transit via Delhivery Express (AWB: #DL91823094)." }
            ]
        },
        {
            id: "OD3849182730",
            customer: {
                name: "Priya Sharma",
                email: "priya.sharma@outlook.com",
                phone: "+91 99887 76655",
                address: {
                    line: "Apt 902, Rosewood Heights, Baner Road",
                    city: "Pune",
                    state: "Maharashtra",
                    zip: "411045",
                    country: "India"
                }
            },
            items: [
                {
                    id: 4,
                    name: "Levi's Men's 511 Slim Fit Jeans (Blue)",
                    price: 2899,
                    quantity: 2,
                    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop"
                },
                {
                    id: 5,
                    name: "Puma Softride running shoes (Red, Size 9)",
                    price: 4999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 1000,
            paymentMethod: "Card",
            paymentStatus: "Paid",
            orderStatus: "Packed",
            deliveryPartner: "",
            trackingId: "",
            date: "2026-07-20T08:15:00",
            timeline: [
                { status: "Pending", time: "20-Jul-2026 08:15 AM", desc: "Order details confirmed." },
                { status: "Confirmed", time: "20-Jul-2026 09:00 AM", desc: "Order accepted by merchant." },
                { status: "Packed", time: "20-Jul-2026 10:00 AM", desc: "Items gathered at Pune hub. Packed and sealed." }
            ]
        },
        {
            id: "OD4859201938",
            customer: {
                name: "Amit Patel",
                email: "amit.patel@rediffmail.com",
                phone: "+91 97766 55443",
                address: {
                    line: "12, Shanti Kunj Society, Ashram Road",
                    city: "Ahmedabad",
                    state: "Gujarat",
                    zip: "380009",
                    country: "India"
                }
            },
            items: [
                {
                    id: 6,
                    name: "Philips Series 3000 Beard Trimmer (Cordless)",
                    price: 2199,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 40,
            discount: 200,
            paymentMethod: "COD",
            paymentStatus: "Unpaid",
            orderStatus: "Pending",
            deliveryPartner: "",
            trackingId: "",
            date: "2026-07-20T10:05:00",
            timeline: [
                { status: "Pending", time: "20-Jul-2026 10:05 AM", desc: "Order created under Cash On Delivery." }
            ]
        },
        {
            id: "OD5829102948",
            customer: {
                name: "Neha Gupta",
                email: "neha.gupta@gmail.com",
                phone: "+91 93322 11000",
                address: {
                    line: "Flat 101, Block B, Royal Enclave, Salt Lake",
                    city: "Kolkata",
                    state: "West Bengal",
                    zip: "700091",
                    country: "India"
                }
            },
            items: [
                {
                    id: 7,
                    name: "L'Oreal Paris Revitalift Hyaluronic Acid Serum",
                    price: 999,
                    quantity: 3,
                    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 300,
            paymentMethod: "Card",
            paymentStatus: "Paid",
            orderStatus: "Delivered",
            deliveryPartner: "Ecom Express",
            trackingId: "#EC10293847",
            date: "2026-07-15T12:00:00",
            timeline: [
                { status: "Pending", time: "15-Jul-2026 12:00 PM", desc: "Order submitted." },
                { status: "Confirmed", time: "15-Jul-2026 01:00 PM", desc: "Order confirmed." },
                { status: "Packed", time: "15-Jul-2026 02:00 PM", desc: "Quality checks passed." },
                { status: "Shipped", time: "16-Jul-2026 09:30 AM", desc: "Left Kolkata warehouse." },
                { status: "Out For Delivery", time: "18-Jul-2026 08:00 AM", desc: "Out for delivery from Gariahat hub." },
                { status: "Delivered", time: "18-Jul-2026 03:00 PM", desc: "Successfully delivered." }
            ]
        },
        {
            id: "OD6781290345",
            customer: {
                name: "Vikram Singh",
                email: "vikram.singh@gmail.com",
                phone: "+91 94567 89012",
                address: {
                    line: "C-112, Malviya Nagar",
                    city: "Jaipur",
                    state: "Rajasthan",
                    zip: "302017",
                    country: "India"
                }
            },
            items: [
                {
                    id: 8,
                    name: "Nike Air Max Sports Shoes (Grey/Yellow)",
                    price: 9995,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 1000,
            paymentMethod: "Card",
            paymentStatus: "Refunded",
            orderStatus: "Cancelled",
            deliveryPartner: "",
            trackingId: "",
            date: "2026-07-18T16:20:00",
            timeline: [
                { status: "Pending", time: "18-Jul-2026 04:20 PM", desc: "Order registered." },
                { status: "Cancelled", time: "19-Jul-2026 11:00 AM", desc: "Cancelled by buyer. Refund processed to original card." }
            ]
        },
        {
            id: "OD7891234567",
            customer: {
                name: "Ananya Roy",
                email: "ananya.roy@live.com",
                phone: "+91 96543 21098",
                address: {
                    line: "Flat 5C, Sunrise Apartments, Gariahat Road",
                    city: "Kolkata",
                    state: "West Bengal",
                    zip: "700029",
                    country: "India"
                }
            },
            items: [
                {
                    id: 9,
                    name: "Mi Smart Air Fryer (4L, White)",
                    price: 6999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 700,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            orderStatus: "Delivered",
            deliveryPartner: "DHL Express",
            trackingId: "#DH81729384",
            date: "2026-07-14T10:15:00",
            timeline: [
                { status: "Pending", time: "14-Jul-2026 10:15 AM", desc: "Placed successfully." },
                { status: "Confirmed", time: "14-Jul-2026 11:30 AM", desc: "Merchant accepted order." },
                { status: "Packed", time: "14-Jul-2026 02:40 PM", desc: "Inventory checked and packed." },
                { status: "Shipped", time: "15-Jul-2026 08:10 AM", desc: "Dispatched via Professional Couriers." },
                { status: "Out For Delivery", time: "17-Jul-2026 09:00 AM", desc: "Out for delivery from Garia hub." },
                { status: "Delivered", time: "17-Jul-2026 14:00 PM", desc: "Delivered at doorstep." }
            ]
        },
        {
            id: "OD8901234568",
            customer: {
                name: "Sandeep Verma",
                email: "sandeep.v@gmail.com",
                phone: "+91 95432 10987",
                address: {
                    line: "Qtr No. 12/B, Type-4, Railway Colony",
                    city: "Lucknow",
                    state: "Uttar Pradesh",
                    zip: "226001",
                    country: "India"
                }
            },
            items: [
                {
                    id: 10,
                    name: "OnePlus 11 5G (Eternal Green, 128GB)",
                    price: 56999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 2500,
            paymentMethod: "Net Banking",
            paymentStatus: "Paid",
            orderStatus: "Confirmed",
            deliveryPartner: "",
            trackingId: "",
            date: "2026-07-19T11:30:00",
            timeline: [
                { status: "Pending", time: "19-Jul-2026 11:30 AM", desc: "Order paid via Net Banking." },
                { status: "Confirmed", time: "20-Jul-2026 10:00 AM", desc: "Gateway payment confirmed. Processing catalog." }
            ]
        },
        {
            id: "OD9012345679",
            customer: {
                name: "Karan Malhotra",
                email: "karan.mal@gmail.com",
                phone: "+91 94321 09876",
                address: {
                    line: "88, Phase 2, DLF Cyber City",
                    city: "Gurugram",
                    state: "Haryana",
                    zip: "122002",
                    country: "India"
                }
            },
            items: [
                {
                    id: 11,
                    name: "Apple Watch Series 8 GPS (Midnight Aluminium, 45mm)",
                    price: 45900,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 3000,
            paymentMethod: "Card",
            paymentStatus: "Paid",
            orderStatus: "Delivered",
            deliveryPartner: "Ecom Express",
            trackingId: "#EC82716293",
            date: "2026-07-16T18:50:00",
            timeline: [
                { status: "Pending", time: "16-Jul-2026 06:50 PM", desc: "Placed online." },
                { status: "Confirmed", time: "16-Jul-2026 08:00 PM", desc: "Order payment verified." },
                { status: "Packed", time: "17-Jul-2026 10:00 AM", desc: "Processed at Delhi hub." },
                { status: "Shipped", time: "17-Jul-2026 14:00 PM", desc: "Dispatched via Ecom Express." },
                { status: "Out For Delivery", time: "19-Jul-2026 09:00 AM", desc: "Out for delivery from Gurugram center." },
                { status: "Delivered", time: "19-Jul-2026 11:15 AM", desc: "Delivered." }
            ]
        },
        {
            id: "OD0123456789",
            customer: {
                name: "Meera Nair",
                email: "meera.nair@hotmail.com",
                phone: "+91 93210 98765",
                address: {
                    line: "Flat S-2, Tulip Block, Prestige Lakeside Habitat",
                    city: "Bengaluru",
                    state: "Karnataka",
                    zip: "560087",
                    country: "India"
                }
            },
            items: [
                {
                    id: 12,
                    name: "Philips Series 3000 Beard Trimmer (Cordless)",
                    price: 2199,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=100&h=100&fit=crop"
                },
                {
                    id: 7,
                    name: "L'Oreal Paris Revitalift Hyaluronic Acid Serum",
                    price: 999,
                    quantity: 2,
                    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 40,
            discount: 400,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            orderStatus: "Out For Delivery",
            deliveryPartner: "DHL Express",
            trackingId: "#DH19283746",
            date: "2026-07-20T09:10:00",
            timeline: [
                { status: "Pending", time: "20-Jul-2026 09:10 AM", desc: "Order details received." },
                { status: "Confirmed", time: "20-Jul-2026 09:40 AM", desc: "Verified payment via UPI." },
                { status: "Packed", time: "20-Jul-2026 11:00 AM", desc: "Items gathered at Bengaluru center." },
                { status: "Shipped", time: "20-Jul-2026 01:10 PM", desc: "Dispatched via DHL Express." },
                { status: "Out For Delivery", time: "20-Jul-2026 03:00 PM", desc: "Out for delivery by agent Dinesh." }
            ]
        },
        {
            id: "OD1122334455",
            customer: {
                name: "Rohan Das",
                email: "rohan.das@gmail.com",
                phone: "+91 92109 87654",
                address: {
                    line: "Block D-3, 3rd Floor, Mansarovar Heights",
                    city: "Secunderabad",
                    state: "Telangana",
                    zip: "500009",
                    country: "India"
                }
            },
            items: [
                {
                    id: 13,
                    name: "Nike Air Max Sports Shoes (Grey/Yellow)",
                    price: 9995,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 500,
            paymentMethod: "COD",
            paymentStatus: "Unpaid",
            orderStatus: "Pending",
            deliveryPartner: "",
            trackingId: "",
            date: "2026-07-20T10:15:00",
            timeline: [
                { status: "Pending", time: "20-Jul-2026 10:15 AM", desc: "Order booked under Cash On Delivery." }
            ]
        },
        {
            id: "OD2233445566",
            customer: {
                name: "Divya Deshmukh",
                email: "divya.d@gmail.com",
                phone: "+91 91098 76543",
                address: {
                    line: "404, Pride Residency, Shivaji Nagar",
                    city: "Nagpur",
                    state: "Maharashtra",
                    zip: "440010",
                    country: "India"
                }
            },
            items: [
                {
                    id: 5,
                    name: "Puma Softride running shoes (Red, Size 9)",
                    price: 4999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 800,
            paymentMethod: "Card",
            paymentStatus: "Paid",
            orderStatus: "Cancelled",
            deliveryPartner: "",
            trackingId: "",
            date: "2026-07-17T15:45:00",
            timeline: [
                { status: "Pending", time: "17-Jul-2026 03:45 PM", desc: "Placed online." },
                { status: "Cancelled", time: "18-Jul-2026 09:00 AM", desc: "Cancelled due to size mismatches. Refund initiated." }
            ]
        },
        {
            id: "OD3344556677",
            customer: {
                name: "Vikram Rathore",
                email: "rathore.v@yahoo.com",
                phone: "+91 90987 65432",
                address: {
                    line: "23, Udai Marg, Tilak Nagar",
                    city: "Jaipur",
                    state: "Rajasthan",
                    zip: "302004",
                    country: "India"
                }
            },
            items: [
                {
                    id: 1,
                    name: "Sony WH-1000XM5 Wireless Headphones (Silver)",
                    price: 29990,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 2000,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            orderStatus: "Delivered",
            deliveryPartner: "DHL Express",
            trackingId: "#DH72619283",
            date: "2026-07-12T11:00:00",
            timeline: [
                { status: "Pending", time: "12-Jul-2026 11:00 AM", desc: "Order confirmation received." },
                { status: "Confirmed", time: "12-Jul-2026 12:00 PM", desc: "Order confirmed." },
                { status: "Packed", time: "12-Jul-2026 14:00 PM", desc: "Packaging verified." },
                { status: "Shipped", time: "13-Jul-2026 10:00 AM", desc: "Dispatched via DHL Courier." },
                { status: "Out For Delivery", time: "15-Jul-2026 09:00 AM", desc: "Out for delivery by local hub." },
                { status: "Delivered", time: "15-Jul-2026 16:30 PM", desc: "Delivered directly." }
            ]
        },
        {
            id: "OD4455667788",
            customer: {
                name: "Sneha Reddy",
                email: "sneha.reddy@gmail.com",
                phone: "+91 99876 54321",
                address: {
                    line: "Apt 205, Diamond Block, My Home Jewel, Madinaguda",
                    city: "Hyderabad",
                    state: "Telangana",
                    zip: "500049",
                    country: "India"
                }
            },
            items: [
                {
                    id: 10,
                    name: "OnePlus 11 5G (Eternal Green, 128GB)",
                    price: 56999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 1000,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            orderStatus: "Delivered",
            deliveryPartner: "FedEx India",
            trackingId: "#FD29384729",
            date: "2026-07-13T16:20:00",
            timeline: [
                { status: "Pending", time: "13-Jul-2026 04:20 PM", desc: "Order successfully booked." },
                { status: "Confirmed", time: "13-Jul-2026 05:00 PM", desc: "Gateway payment confirmed." },
                { status: "Packed", time: "13-Jul-2026 18:00 PM", desc: "Packed and invoiced." },
                { status: "Shipped", time: "14-Jul-2026 09:00 AM", desc: "Dispatched via Trackon Couriers." },
                { status: "Out For Delivery", time: "16-Jul-2026 08:30 AM", desc: "Out for delivery in Miyapur area." },
                { status: "Delivered", time: "16-Jul-2026 15:45 PM", desc: "Delivered to customer." }
            ]
        },
        {
            id: "OD5566778899",
            customer: {
                name: "Abhishek Mishra",
                email: "abhishek.m@live.in",
                phone: "+91 98765 01234",
                address: {
                    line: "Fl. 2A, Block-4, Paradise Apartments, Indirapuram",
                    city: "Ghaziabad",
                    state: "Uttar Pradesh",
                    zip: "201014",
                    country: "India"
                }
            },
            items: [
                {
                    id: 3,
                    name: "Samsung Galaxy S23 Ultra 5G (Phantom Black, 256GB)",
                    price: 124999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop"
                }
            ],
            shippingCharge: 0,
            discount: 4999,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            orderStatus: "Delivered",
            deliveryPartner: "Delhivery Express",
            trackingId: "#DL82739102",
            date: "2026-07-10T13:00:00",
            timeline: [
                { status: "Pending", time: "10-Jul-2026 01:00 PM", desc: "Order confirmed." },
                { status: "Confirmed", time: "10-Jul-2026 02:00 PM", desc: "Order confirmation sent." },
                { status: "Packed", time: "10-Jul-2026 16:30 PM", desc: "Quality inspection cleared." },
                { status: "Shipped", time: "11-Jul-2026 10:15 AM", desc: "Sent via Professional Couriers." },
                { status: "Out For Delivery", time: "13-Jul-2026 09:00 AM", desc: "Out for delivery from Indirapuram hub." },
                { status: "Delivered", time: "13-Jul-2026 12:30 PM", desc: "Delivered." }
            ]
        }
    ];

    // Pagination/Filtering State
    let filteredOrders = [...ordersList];
    let currentPage = 1;
    const rowsPerPage = 10;

    // DOM Element Selectors
    const tableBody = document.getElementById("orders-table-body");
    const showingText = document.getElementById("showing-text");
    const paginationContainer = document.getElementById("pagination-container");

    // Metrics Selectors
    const totalOrdersEl = document.getElementById("total-orders-cnt");
    const todayOrdersEl = document.getElementById("today-orders-cnt");
    const weeklyRevenueEl = document.getElementById("weekly-revenue-cnt");
    const pendingEl = document.getElementById("pending-cnt");
    const confirmedEl = document.getElementById("confirmed-cnt");
    const packedEl = document.getElementById("packed-cnt");
    const shippedEl = document.getElementById("shipped-cnt");
    const outForDeliveryEl = document.getElementById("out-for-delivery-cnt");
    const deliveredEl = document.getElementById("delivered-cnt");
    const cancelledEl = document.getElementById("cancelled-cnt");
    const aovEl = document.getElementById("aov-cnt");
    const revenueEl = document.getElementById("revenue-cnt");

    // Filter Inputs Selectors
    const searchIdInput = document.getElementById("o-search-id");
    const searchCustInput = document.getElementById("o-search-customer");
    const statusFilter = document.getElementById("o-filter-status");
    const paymentFilter = document.getElementById("o-filter-payment");
    const dateFilter = document.getElementById("o-filter-date");
    const sortFilter = document.getElementById("o-sort");

    // Action Buttons
    const btnClearFilters = document.getElementById("btn-clear-filters");
    const btnRefresh = document.getElementById("btn-refresh");
    const btnExport = document.getElementById("btn-export");

    // Modal elements
    const detailModal = document.getElementById("detail-modal");
    const statusModal = document.getElementById("status-modal");
    const deleteModal = document.getElementById("delete-confirm-modal");

    // Status logistics DOM refs
    const statusSelect = document.getElementById("status-select-input");
    const statusLogisticsFields = document.getElementById("status-logistics-fields");
    const statusDeliveryPartner = document.getElementById("status-delivery-partner");
    const statusTrackingIdInput = document.getElementById("status-tracking-id");

    // Modal state controllers
    let selectedOrderId = null;

    // Initialize Layout Events & Data
    initModalCloseListeners();
    initFilters();
    initStatusLogisticsToggles();
    initCSVExport();
    
    // Create Chart.js Graphics
    initCharts();
    
    // Core Initial Render
    updateDashboard();

    /* ============================================================
       METRICS CALCULATION
       ============================================================ */
    function updateDashboard() {
        const total = ordersList.length;
        const pending = ordersList.filter(o => o.orderStatus === "Pending").length;
        const confirmed = ordersList.filter(o => o.orderStatus === "Confirmed").length;
        const packed = ordersList.filter(o => o.orderStatus === "Packed").length;
        const shipped = ordersList.filter(o => o.orderStatus === "Shipped").length;
        const outForDelivery = ordersList.filter(o => o.orderStatus === "Out For Delivery").length;
        const delivered = ordersList.filter(o => o.orderStatus === "Delivered").length;
        const cancelled = ordersList.filter(o => o.orderStatus === "Cancelled").length;

        // Today's Orders (placed on 2026-07-20)
        const todayStr = "2026-07-20";
        const todayOrders = ordersList.filter(o => o.date.startsWith(todayStr)).length;

        // Calculate Revenue, Weekly Revenue and AOV (inclusive of 18% GST)
        let revenue = 0;
        let weeklyRevenue = 0;
        let activeOrdersCount = 0;

        const startWeeklyDate = new Date("2026-07-14T00:00:00");
        const endWeeklyDate = new Date("2026-07-20T23:59:59");

        ordersList.forEach(o => {
            if (o.orderStatus !== "Cancelled") {
                const subtotal = o.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const gst = Math.round(subtotal * 0.18);
                const grandTotal = subtotal + gst + o.shippingCharge - o.discount;
                
                revenue += grandTotal;
                activeOrdersCount++;

                // Weekly Revenue calculation (Jul 14 to Jul 20)
                const orderDate = new Date(o.date);
                if (orderDate >= startWeeklyDate && orderDate <= endWeeklyDate) {
                    weeklyRevenue += grandTotal;
                }
            }
        });

        // Average Order Value (AOV)
        const aov = activeOrdersCount > 0 ? Math.round(revenue / activeOrdersCount) : 0;

        // Set DOM Text
        totalOrdersEl.innerText = total;
        todayOrdersEl.innerText = todayOrders;
        weeklyRevenueEl.innerText = "₹" + weeklyRevenue.toLocaleString();
        pendingEl.innerText = pending;
        confirmedEl.innerText = confirmed;
        packedEl.innerText = packed;
        shippedEl.innerText = shipped;
        outForDeliveryEl.innerText = outForDelivery;
        deliveredEl.innerText = delivered;
        cancelledEl.innerText = cancelled;
        aovEl.innerText = "₹" + aov.toLocaleString();
        revenueEl.innerText = "₹" + revenue.toLocaleString();

        // Apply filters and refresh tables
        applyFiltersAndRender();
        updateChartsData();
        renderTopProducts();
    }

    /* ============================================================
       TOP SELLING PRODUCTS CALCULATION & RENDERER
       ============================================================ */
    function renderTopProducts() {
        const topProductsContainer = document.getElementById("top-products-list");
        if (!topProductsContainer) return;

        // Aggregate items across non-cancelled orders
        let itemAggregation = {};

        ordersList.forEach(order => {
            if (order.orderStatus !== "Cancelled") {
                order.items.forEach(item => {
                    // Extract basic clean name
                    const cleanName = item.name.split(" (")[0];
                    if (!itemAggregation[cleanName]) {
                        itemAggregation[cleanName] = {
                            name: cleanName,
                            image: item.image,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    itemAggregation[cleanName].quantity += item.quantity;
                    itemAggregation[cleanName].revenue += (item.price * item.quantity);
                });
            }
        });

        // Convert to array and sort descending by quantity
        let sortedProducts = Object.values(itemAggregation);
        sortedProducts.sort((a, b) => b.quantity - a.quantity);

        // Get Top 4 items
        const top4 = sortedProducts.slice(0, 4);

        topProductsContainer.innerHTML = "";
        
        if (top4.length === 0) {
            topProductsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.86rem; padding-top: 60px;">No sales data available.</div>`;
            return;
        }

        // Determine max quantity as progress bar base (100%)
        const maxQty = top4[0].quantity;

        top4.forEach(p => {
            const itemPercent = maxQty > 0 ? Math.round((p.quantity / maxQty) * 100) : 0;
            const div = document.createElement("div");
            div.className = "top-prod-item";
            div.innerHTML = `
                <img src="${p.image}" alt="${p.name}" class="top-prod-img">
                <div class="top-prod-details">
                    <div class="top-prod-name" title="${p.name}">${p.name}</div>
                    <div class="top-prod-meta">
                        <span>${p.quantity} items sold</span>
                        <strong>₹${p.revenue.toLocaleString()}</strong>
                    </div>
                    <div class="top-prod-progress-bar">
                        <div class="top-prod-progress-fill" style="width: ${itemPercent}%"></div>
                    </div>
                </div>
            `;
            topProductsContainer.appendChild(div);
        });
    }

    /* ============================================================
       CHART.JS IMPLEMENTATION
       ============================================================ */
    function initCharts() {
        const isDark = document.body.classList.contains("dark-mode");
        const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
        const textColor = isDark ? "#94a3b8" : "#64748b";

        // 1. Revenue Analytics Chart
        const revCtx = document.getElementById("orderRevenueChart").getContext("2d");
        const revGradient = revCtx.createLinearGradient(0, 0, 0, 250);
        revGradient.addColorStop(0, "rgba(40, 116, 240, 0.22)");
        revGradient.addColorStop(1, "rgba(40, 116, 240, 0)");

        revenueChart = new Chart(revCtx, {
            type: "line",
            data: {
                labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [{
                    label: "Monthly Revenue",
                    data: [142000, 215000, 178000, 269000, 312000, 0], // Jul populated dynamically
                    borderColor: "#2874f0",
                    backgroundColor: revGradient,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: "#2874f0",
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        padding: 12,
                        backgroundColor: "rgba(15, 23, 42, 0.94)",
                        callbacks: {
                            label: function(context) {
                                return " Revenue: ₹" + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { family: "Inter", size: 10 } }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: {
                            color: textColor,
                            font: { family: "Inter", size: 10 },
                            callback: function(val) { return "₹" + val.toLocaleString(); }
                        }
                    }
                }
            }
        });

        // 2. Monthly Orders Volume Chart
        const volCtx = document.getElementById("orderMonthlyChart").getContext("2d");
        monthlyOrdersChart = new Chart(volCtx, {
            type: "bar",
            data: {
                labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [{
                    label: "Orders Volume",
                    data: [22, 35, 29, 44, 53, 0], // Jul populated dynamically
                    backgroundColor: "#ff9f00",
                    hoverBackgroundColor: "#e08c00",
                    borderRadius: 6,
                    borderWidth: 0,
                    barThickness: 24
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        padding: 12,
                        backgroundColor: "rgba(15, 23, 42, 0.94)",
                        callbacks: {
                            label: function(context) {
                                return " Vol: " + context.parsed.y + " orders";
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { family: "Inter", size: 10 } }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: {
                            color: textColor,
                            font: { family: "Inter", size: 10 },
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    function updateChartsData() {
        if (!revenueChart || !monthlyOrdersChart) return;

        // Calculate dynamic values for July 2026 (excluding cancelled, including GST)
        let julRevenue = 0;
        let julOrdersCount = 0;

        ordersList.forEach(o => {
            if (o.date.startsWith("2026-07")) {
                if (o.orderStatus !== "Cancelled") {
                    const subtotal = o.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    const gst = Math.round(subtotal * 0.18);
                    const total = subtotal + gst + o.shippingCharge - o.discount;
                    julRevenue += total;
                    julOrdersCount++;
                }
            }
        });

        // Update July index (5)
        revenueChart.data.datasets[0].data[5] = julRevenue;
        revenueChart.update();

        monthlyOrdersChart.data.datasets[0].data[5] = julOrdersCount;
        monthlyOrdersChart.update();
    }

    /* ============================================================
       STATUS MODAL LOGISTICS INPUTS TOGGLE
       ============================================================ */
    function initStatusLogisticsToggles() {
        if (statusSelect && statusLogisticsFields) {
            statusSelect.addEventListener("change", () => {
                const val = statusSelect.value;
                if (val === "Shipped" || val === "Out For Delivery" || val === "Delivered") {
                    statusLogisticsFields.style.display = "block";
                } else {
                    statusLogisticsFields.style.display = "none";
                }
            });
        }
    }

    /* ============================================================
       CSV EXPORT FEATURE
       ============================================================ */
    function initCSVExport() {
        if (btnExport) {
            btnExport.addEventListener("click", () => {
                if (filteredOrders.length === 0) {
                    showToast("No orders available to export.");
                    return;
                }

                // CSV headers definition
                const headers = ["Order ID", "Customer Name", "Customer Email", "Customer Phone", "Quantity", "Subtotal", "GST (18%)", "Shipping Charges", "Discounts", "Grand Total (INR)", "Payment Method", "Payment Status", "Order Status", "Courier Partner", "Tracking ID", "Order Date"];
                
                // Construct CSV lines
                let csvRows = [headers.join(",")];
                
                filteredOrders.forEach(o => {
                    const subtotal = o.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
                    const gst = Math.round(subtotal * 0.18);
                    const total = subtotal + gst + o.shippingCharge - o.discount;
                    const totalQty = o.items.reduce((sum, i) => sum + i.quantity, 0);
                    
                    const row = [
                        o.id,
                        `"${o.customer.name.replace(/"/g, '""')}"`,
                        o.customer.email,
                        o.customer.phone,
                        totalQty,
                        subtotal,
                        gst,
                        o.shippingCharge,
                        o.discount,
                        total,
                        o.paymentMethod,
                        o.paymentStatus,
                        o.orderStatus,
                        o.deliveryPartner ? `"${o.deliveryPartner}"` : "N/A",
                        o.trackingId ? `"${o.trackingId}"` : "N/A",
                        o.date
                    ];
                    csvRows.push(row.join(","));
                });

                const csvString = csvRows.join("\n");
                const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                
                // Trigger download
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `flipkart_admin_orders_${Date.now()}.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showToast("Orders exported to CSV successfully.");
            });
        }
    }

    /* ============================================================
       FILTER & SORT CONTROL EVENTS
       ============================================================ */
    function initFilters() {
        const triggers = [searchIdInput, searchCustInput, statusFilter, paymentFilter, dateFilter, sortFilter];
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
                searchIdInput.value = "";
                searchCustInput.value = "";
                statusFilter.value = "All";
                paymentFilter.value = "All";
                dateFilter.value = "";
                sortFilter.value = "date-desc";

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
                    searchIdInput.value = "";
                    searchCustInput.value = "";
                    statusFilter.value = "All";
                    paymentFilter.value = "All";
                    dateFilter.value = "";
                    sortFilter.value = "date-desc";
                    currentPage = 1;

                    // Redraw
                    updateDashboard();
                    showToast("Orders list refreshed.");
                }, 500);
            });
        }
    }

    function applyFiltersAndRender() {
        filteredOrders = [...ordersList];

        // 1. Filter by Order ID
        const idQuery = searchIdInput.value.toLowerCase().trim();
        if (idQuery) {
            filteredOrders = filteredOrders.filter(o => o.id.toLowerCase().includes(idQuery));
        }

        // 2. Filter by Customer Name
        const custQuery = searchCustInput.value.toLowerCase().trim();
        if (custQuery) {
            filteredOrders = filteredOrders.filter(o => o.customer.name.toLowerCase().includes(custQuery));
        }

        // 3. Filter by Order Status
        const statusVal = statusFilter.value;
        if (statusVal !== "All") {
            filteredOrders = filteredOrders.filter(o => o.orderStatus === statusVal);
        }

        // 4. Filter by Payment Status
        const paymentVal = paymentFilter.value;
        if (paymentVal !== "All") {
            filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentVal);
        }

        // 5. Filter by Date (YYYY-MM-DD)
        const dateVal = dateFilter.value;
        if (dateVal) {
            filteredOrders = filteredOrders.filter(o => o.date.startsWith(dateVal));
        }

        // 6. Apply Sorting
        const sortVal = sortFilter.value;
        filteredOrders.sort((a, b) => {
            const subtotalA = a.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const gstA = Math.round(subtotalA * 0.18);
            const totalA = subtotalA + gstA + a.shippingCharge - a.discount;

            const subtotalB = b.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const gstB = Math.round(subtotalB * 0.18);
            const totalB = subtotalB + gstB + b.shippingCharge - b.discount;

            if (sortVal === "date-desc") {
                return new Date(b.date) - new Date(a.date);
            } else if (sortVal === "date-asc") {
                return new Date(a.date) - new Date(b.date);
            } else if (sortVal === "amount-high") {
                return totalB - totalA;
            } else if (sortVal === "amount-low") {
                return totalA - totalB;
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
        const totalRows = filteredOrders.length;

        // If no records, draw empty state
        if (totalRows === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" style="padding: 0;">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-shopping-basket"></i></div>
                            <h4 class="empty-state-title">No Orders Found</h4>
                            <p class="empty-state-desc">We couldn't find any orders matching your criteria. Try adjusting or clearing filters.</p>
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

            showingText.innerText = "Showing 0 of 0 orders";
            paginationContainer.innerHTML = "";
            return;
        }

        // Slice pagination records
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
        const paginatedRecords = filteredOrders.slice(startIndex, endIndex);

        showingText.innerText = `Showing ${startIndex + 1}-${endIndex} of ${totalRows} orders`;

        // Render rows
        paginatedRecords.forEach(order => {
            // Compute order items summary
            let productsText = "";
            if (order.items.length > 0) {
                productsText = order.items[0].name.split(" (")[0];
                if (order.items.length > 1) {
                    productsText += ` (+${order.items.length - 1} more)`;
                }
            } else {
                productsText = "No items";
            }

            // Compute total amount (including GST)
            const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const gst = Math.round(subtotal * 0.18);
            const grandTotal = subtotal + gst + order.shippingCharge - order.discount;

            // Compute total quantity
            const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

            // Format date: YYYY-MM-DD to DD-MMM-YYYY HH:MM AM/PM
            const dateObj = new Date(order.date);
            const formattedDate = dateObj.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) + " " + dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            // Create row tr
            const tr = document.createElement("tr");
            tr.id = `row-order-${order.id}`;
            tr.innerHTML = `
                <td>
                    <span class="order-id-txt" data-id="${order.id}">${order.id}</span>
                </td>
                <td>
                    <div class="cust-name">${order.customer.name}</div>
                    <div class="cust-sub">${order.customer.phone}</div>
                </td>
                <td>
                    <div class="product-summary" title="${order.items.map(i => i.name).join(', ')}">${productsText}</div>
                </td>
                <td>
                    <span class="qty-badge">${totalQty}</span>
                </td>
                <td>
                    <span class="amount-txt">₹${grandTotal.toLocaleString()}</span>
                </td>
                <td>
                    <span style="font-weight: 500;">${order.paymentMethod}</span>
                </td>
                <td>
                    <span class="payment-badge ${order.paymentStatus.toLowerCase()}">${order.paymentStatus}</span>
                </td>
                <td>
                    <span class="status-badge ${order.orderStatus.toLowerCase().replace(/ /g, '-')}">${order.orderStatus}</span>
                </td>
                <td>
                    <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">${formattedDate}</div>
                </td>
                <td>
                    <div class="action-actions-cell">
                        <button type="button" class="row-action-btn view-btn" data-id="${order.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="row-action-btn edit-btn" data-id="${order.id}" title="Update Status">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="row-action-btn print-btn" data-id="${order.id}" title="Print Invoice">
                            <i class="fas fa-print"></i>
                        </button>
                        <button type="button" class="row-action-btn delete-btn" data-id="${order.id}" title="Delete Order">
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
                viewOrderDetails(el.dataset.id);
            });
        });

        // View Order Details button
        tableBody.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                viewOrderDetails(btn.dataset.id);
            });
        });

        // Edit Order Status button
        tableBody.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                openStatusModal(btn.dataset.id);
            });
        });

        // Print Invoice button
        tableBody.querySelectorAll(".print-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                triggerPrintInvoice(btn.dataset.id);
            });
        });

        // Delete Order button
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
       MODAL VIEW ORDER DETAILS LOGIC
       ============================================================ */
    function viewOrderDetails(id) {
        const order = ordersList.find(o => o.id === id);
        if (!order) return;

        selectedOrderId = id;

        // Set IDs/Title
        document.getElementById("detail-order-id").innerText = order.id;

        // Parse and Formate date
        const dateObj = new Date(order.date);
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) + " " + dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        document.getElementById("detail-order-date").innerText = formattedDate;

        // Expected Delivery calculations
        const expectedDeliveryEl = document.getElementById("detail-expected-delivery");
        if (order.orderStatus === "Delivered") {
            expectedDeliveryEl.innerText = "Delivered";
            expectedDeliveryEl.style.color = "var(--success-color)";
        } else if (order.orderStatus === "Cancelled") {
            expectedDeliveryEl.innerText = "Cancelled";
            expectedDeliveryEl.style.color = "var(--danger-color)";
        } else {
            const expectedDate = new Date(order.date);
            expectedDate.setDate(expectedDate.getDate() + 3);
            const expectedDateStr = expectedDate.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            expectedDeliveryEl.innerText = `Expected by ${expectedDateStr}`;
            expectedDeliveryEl.style.color = "var(--warning-color)";
        }

        // Customer Details
        document.getElementById("detail-cust-name").innerText = order.customer.name;
        document.getElementById("detail-cust-email").innerText = order.customer.email;
        document.getElementById("detail-cust-phone").innerText = order.customer.phone;

        // Shipping Address
        const addr = order.customer.address;
        document.getElementById("detail-shipping-address").innerText = `${addr.line}, ${addr.city}, ${addr.state} - ${addr.zip}, ${addr.country}`;

        // Payment and Delivery Details
        document.getElementById("detail-payment-method").innerText = order.paymentMethod;
        const pStatusBadge = document.getElementById("detail-payment-status");
        pStatusBadge.className = `payment-badge ${order.paymentStatus.toLowerCase()}`;
        pStatusBadge.innerText = order.paymentStatus;

        // Courier logistics details
        document.getElementById("detail-delivery-partner").innerText = order.deliveryPartner || "N/A (Not Dispatched)";
        document.getElementById("detail-tracking-id").innerText = order.trackingId || "N/A (Not Dispatched)";

        // Ordered Products List
        const itemsTable = document.getElementById("detail-items-body");
        itemsTable.innerHTML = "";

        let subtotal = 0;
        order.items.forEach(item => {
            const total = item.price * item.quantity;
            subtotal += total;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="modal-prod-cell">
                        <img src="${item.image}" alt="${item.name}" class="modal-prod-img">
                        <div class="modal-prod-name" title="${item.name}">${item.name}</div>
                    </div>
                </td>
                <td>₹${item.price.toLocaleString()}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right; font-weight: 600;">₹${total.toLocaleString()}</td>
            `;
            itemsTable.appendChild(tr);
        });

        // Totals calculations (calculating GST 18%)
        const gst = Math.round(subtotal * 0.18);
        const grandTotal = subtotal + gst + order.shippingCharge - order.discount;

        document.getElementById("detail-subtotal").innerText = "₹" + subtotal.toLocaleString();
        document.getElementById("detail-gst").innerText = "₹" + gst.toLocaleString();
        document.getElementById("detail-shipping").innerText = order.shippingCharge > 0 ? "+ ₹" + order.shippingCharge : "Free";
        document.getElementById("detail-discount").innerText = order.discount > 0 ? "- ₹" + order.discount : "₹0";
        document.getElementById("detail-grand-total").innerText = "₹" + grandTotal.toLocaleString();

        // Render Order Timeline trace (6-stage system)
        renderTimelineTrace(order);

        // Show Modal
        detailModal.classList.add("active");
    }

    function renderTimelineTrace(order) {
        const timelineList = document.getElementById("detail-timeline-list");
        timelineList.innerHTML = "";

        // Standard timeline steps
        const stages = ["Pending", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered"];
        const isCancelled = order.orderStatus === "Cancelled";

        if (isCancelled) {
            // Cancelled flow
            const pendingEvent = order.timeline.find(t => t.status === "Pending") || { time: "", desc: "Order registered." };
            const cancelledEvent = order.timeline.find(t => t.status === "Cancelled") || { time: "", desc: "Cancelled by Administrator." };

            timelineList.innerHTML = `
                <div class="timeline-step completed">
                    <div class="timeline-step-header">
                        <span class="timeline-step-title">Order Placed</span>
                        <span class="timeline-step-time">${pendingEvent.time}</span>
                    </div>
                    <div class="timeline-step-desc">${pendingEvent.desc}</div>
                </div>
                <div class="timeline-step active-cancelled">
                    <div class="timeline-step-header">
                        <span class="timeline-step-title">Order Cancelled</span>
                        <span class="timeline-step-time">${cancelledEvent.time}</span>
                    </div>
                    <div class="timeline-step-desc">${cancelledEvent.desc}</div>
                </div>
            `;
            return;
        }

        // Active progressive timeline rendering (6 stages)
        let currentStageIdx = stages.indexOf(order.orderStatus);

        stages.forEach((stage, idx) => {
            const matchingEvent = order.timeline.find(t => t.status === stage);
            let stateClass = "";
            let timeStr = "";
            let descStr = "";

            if (matchingEvent) {
                timeStr = matchingEvent.time;
                descStr = matchingEvent.desc;
            }

            if (idx < currentStageIdx) {
                stateClass = "completed";
                if (!descStr) descStr = `${stage} phase completed.`;
            } else if (idx === currentStageIdx) {
                stateClass = "active";
                if (!descStr) descStr = `Order is currently in ${stage} state.`;
            } else {
                stateClass = "";
                descStr = `Waiting for order to be ${stage.toLowerCase()}.`;
            }

            // Adjust descriptions for custom logistics tracking numbers
            if (stage === "Shipped" && order.deliveryPartner && order.trackingId) {
                descStr = `Dispatched via ${order.deliveryPartner} (AWB: ${order.trackingId}).`;
            } else if (stage === "Out For Delivery" && order.deliveryPartner && order.trackingId) {
                descStr = `Out for delivery via courier agent (AWB: ${order.trackingId}).`;
            }

            let titleText = "";
            switch (stage) {
                case "Pending": titleText = "Order Placed"; break;
                case "Confirmed": titleText = "Order Confirmed"; break;
                case "Packed": titleText = "Packed & Ready"; break;
                case "Shipped": titleText = "Shipped / Dispatched"; break;
                case "Out For Delivery": titleText = "Out For Delivery"; break;
                case "Delivered": titleText = "Delivered"; break;
            }

            const step = document.createElement("div");
            step.className = `timeline-step ${stateClass}`;
            step.innerHTML = `
                <div class="timeline-step-header">
                    <span class="timeline-step-title">${titleText}</span>
                    <span class="timeline-step-time">${timeStr}</span>
                </div>
                <div class="timeline-step-desc">${descStr}</div>
            `;
            timelineList.appendChild(step);
        });
    }

    /* ============================================================
       MODAL UPDATE ORDER STATUS LOGIC
       ============================================================ */
    function openStatusModal(id) {
        const order = ordersList.find(o => o.id === id);
        if (!order) return;

        selectedOrderId = id;
        document.getElementById("status-order-id").innerText = order.id;
        statusSelect.value = order.orderStatus;

        // Toggle logistics fields matching the order's state
        if (order.orderStatus === "Shipped" || order.orderStatus === "Out For Delivery" || order.orderStatus === "Delivered") {
            statusLogisticsFields.style.display = "block";
            statusDeliveryPartner.value = order.deliveryPartner || "";
            statusTrackingIdInput.value = order.trackingId || "";
        } else {
            statusLogisticsFields.style.display = "none";
            statusDeliveryPartner.value = "";
            statusTrackingIdInput.value = "";
        }
        
        statusModal.classList.add("active");
    }

    // Submit status change form
    const statusForm = document.getElementById("status-form");
    if (statusForm) {
        statusForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const order = ordersList.find(o => o.id === selectedOrderId);
            if (!order) return;

            const nextStatus = statusSelect.value;
            const prevStatus = order.orderStatus;

            // Generate timeline note
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

            // Adjust payment status automatically for specific states
            if (nextStatus === "Delivered") {
                order.paymentStatus = "Paid";
            } else if (nextStatus === "Cancelled") {
                order.paymentStatus = order.paymentStatus === "Paid" ? "Refunded" : "Unpaid";
            }

            // Save logistics details if status is Shipped, Out For Delivery, or Delivered
            if (nextStatus === "Shipped" || nextStatus === "Out For Delivery" || nextStatus === "Delivered") {
                order.deliveryPartner = statusDeliveryPartner.value || "Courier Partner";
                order.trackingId = statusTrackingIdInput.value || `#AWB${Math.floor(100000 + Math.random() * 900000)}`;
            }

            // Update status in list
            order.orderStatus = nextStatus;

            // Create new timeline object
            const notes = {
                "Pending": "Placed successfully.",
                "Confirmed": "Order accepted and confirmed by seller.",
                "Packed": "Order gathered, verified, packed, and sealed.",
                "Shipped": `Dispatched via ${order.deliveryPartner} (AWB: ${order.trackingId}).`,
                "Out For Delivery": `Handed over to local courier delivery agent (AWB: ${order.trackingId}).`,
                "Delivered": "Handed over to customer.",
                "Cancelled": "Order cancelled by Administrator."
            };

            const existingTimelineEvent = order.timeline.find(t => t.status === nextStatus);
            if (existingTimelineEvent) {
                existingTimelineEvent.time = timeStr;
                existingTimelineEvent.desc = notes[nextStatus];
            } else {
                order.timeline.push({
                    status: nextStatus,
                    time: timeStr,
                    desc: notes[nextStatus]
                });
            }

            statusModal.classList.remove("active");
            updateDashboard();
            showToast(`Order status updated to ${nextStatus}.`);
        });
    }

    /* ============================================================
       MODAL DELETE CONFIRM LOGIC
       ============================================================ */
    function openDeleteModal(id) {
        selectedOrderId = id;
        deleteModal.classList.add("active");
    }

    const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", () => {
            deleteModal.classList.remove("active");
            selectedOrderId = null;
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (selectedOrderId !== null) {
                const tr = document.getElementById(`row-order-${selectedOrderId}`);
                if (tr) {
                    tr.style.opacity = 0;
                    tr.style.transform = "translateX(-20px)";
                    setTimeout(() => {
                        // Delete order from list
                        ordersList = ordersList.filter(o => o.id !== selectedOrderId);
                        selectedOrderId = null;
                        deleteModal.classList.remove("active");
                        updateDashboard();
                        showToast("Order deleted successfully.");
                    }, 300);
                } else {
                    ordersList = ordersList.filter(o => o.id !== selectedOrderId);
                    selectedOrderId = null;
                    deleteModal.classList.remove("active");
                    updateDashboard();
                    showToast("Order deleted successfully.");
                }
            }
        });
    }

    /* ============================================================
       PRINT INVOICE SYSTEM
       ============================================================ */
    function triggerPrintInvoice(id) {
        const order = ordersList.find(o => o.id === id);
        if (!order) return;

        // Subtotal and calculations (inclusive of GST)
        const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const gst = Math.round(subtotal * 0.18);
        const grandTotal = subtotal + gst + order.shippingCharge - order.discount;

        // Date conversions
        const dateObj = new Date(order.date);
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) + " " + dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // Open print window
        const printWindow = window.open("", "_blank", "width=800,height=900");
        
        // Write Invoice markup
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Invoice - ${order.id}</title>
                <style>
                    body {
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        color: #333;
                        line-height: 1.5;
                        padding: 30px;
                        background: #fff;
                    }
                    .invoice-box {
                        max-width: 800px;
                        margin: auto;
                        border: 1px solid #eee;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                        padding: 30px;
                        border-radius: 8px;
                    }
                    .invoice-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2px solid #2874f0;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .brand-logo img {
                        height: 36px;
                    }
                    .invoice-title {
                        text-align: right;
                    }
                    .invoice-title h1 {
                        margin: 0;
                        color: #2874f0;
                        font-size: 2rem;
                        font-weight: 700;
                    }
                    .invoice-title p {
                        margin: 5px 0 0;
                        color: #777;
                        font-size: 0.9rem;
                    }
                    .grid-2 {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .bill-section h3 {
                        margin-top: 0;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 5px;
                        color: #555;
                        font-size: 1rem;
                    }
                    .bill-section p {
                        margin: 6px 0;
                        font-size: 0.9rem;
                        color: #444;
                    }
                    .invoice-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    .invoice-table th {
                        background-color: #f8f9fa;
                        color: #555;
                        font-weight: bold;
                        text-align: left;
                        padding: 12px;
                        border-bottom: 2px solid #ddd;
                        font-size: 0.9rem;
                    }
                    .invoice-table td {
                        padding: 12px;
                        border-bottom: 1px solid #eee;
                        font-size: 0.88rem;
                        color: #555;
                    }
                    .summary-calc {
                        width: 250px;
                        margin-left: auto;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        font-size: 0.9rem;
                    }
                    .calc-row {
                        display: flex;
                        justify-content: space-between;
                        color: #666;
                    }
                    .calc-row.grand-total {
                        border-top: 2px solid #2874f0;
                        padding-top: 8px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        color: #2874f0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 50px;
                        border-top: 1px solid #eee;
                        padding-top: 20px;
                        color: #999;
                        font-size: 0.8rem;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .invoice-box {
                            border: none;
                            box-shadow: none;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-box">
                    <div class="invoice-header">
                        <div class="brand-logo">
                            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" alt="Flipkart">
                        </div>
                        <div class="invoice-title">
                            <h1>TAX INVOICE</h1>
                            <p>Invoice No: INV-${order.id.slice(2)}</p>
                            <p>Date: ${formattedDate.split(" ")[0]}</p>
                        </div>
                    </div>
                    
                    <div class="grid-2">
                        <div class="bill-section">
                            <h3>Sold By:</h3>
                            <p><strong>Flipkart India Private Limited</strong></p>
                            <p>Fulfillment Center BLR-2</p>
                            <p>Outer Ring Road, Devarabeesanahalli</p>
                            <p>Bengaluru, Karnataka - 560103</p>
                            <p>GSTIN: 29AAFCD9088R1ZP</p>
                        </div>
                        <div class="bill-section">
                            <h3>Shipping Address:</h3>
                            <p><strong>${order.customer.name}</strong></p>
                            <p>${order.customer.address.line}</p>
                            <p>${order.customer.address.city}, ${order.customer.address.state}</p>
                            <p>PIN: ${order.customer.address.zip}</p>
                            <p>Phone: ${order.customer.phone}</p>
                        </div>
                    </div>
                    
                    <div class="bill-section" style="margin-bottom: 20px;">
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Order Date:</strong> ${formattedDate}</p>
                        <p><strong>Payment Mode:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
                        ${order.deliveryPartner ? `<p><strong>Courier:</strong> ${order.deliveryPartner} (Tracking: ${order.trackingId})</p>` : ""}
                    </div>
                    
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th style="width: 50px;">S.No</th>
                                <th>Product Details</th>
                                <th style="width: 100px; text-align: right;">Price</th>
                                <th style="width: 80px; text-align: center;">Qty</th>
                                <th style="width: 120px; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map((item, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td><strong>${item.name}</strong></td>
                                    <td style="text-align: right;">₹${item.price.toLocaleString()}</td>
                                    <td style="text-align: center;">${item.quantity}</td>
                                    <td style="text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                    
                    <div class="summary-calc">
                        <div class="calc-row">
                            <span>Subtotal:</span>
                            <span>₹${subtotal.toLocaleString()}</span>
                        </div>
                        <div class="calc-row">
                            <span>GST (18%):</span>
                            <span>₹${gst.toLocaleString()}</span>
                        </div>
                        <div class="calc-row">
                            <span>Shipping Charges:</span>
                            <span>${order.shippingCharge > 0 ? "₹" + order.shippingCharge : "Free"}</span>
                        </div>
                        <div class="calc-row">
                            <span>Discount Applied:</span>
                            <span>${order.discount > 0 ? "- ₹" + order.discount : "₹0"}</span>
                        </div>
                        <div class="calc-row grand-total">
                            <span>Grand Total:</span>
                            <span>₹${grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>This is a computer generated invoice and does not require a physical signature.</p>
                        <p>Thank you for shopping with Flipkart!</p>
                    </div>
                </div>
            </body>
            </html>
        `);

        // Trigger print dialog after DOM updates
        printWindow.document.close();
        
        // Wait briefly for images to complete loading, then print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
        
        showToast(`Invoice for ${order.id} sent to printer.`);
    }

    /* ============================================================
       MODAL CLOSE LISTENERS INITIALIZER
       ============================================================ */
    function initModalCloseListeners() {
        // Detail close
        const closeDetail = document.getElementById("close-detail-modal");
        const okDetail = document.getElementById("ok-detail-modal");
        if (closeDetail) closeDetail.addEventListener("click", () => detailModal.classList.remove("active"));
        if (okDetail) okDetail.addEventListener("click", () => detailModal.classList.remove("active"));

        // Status close
        const closeStatus = document.getElementById("close-status-modal");
        const cancelStatus = document.getElementById("cancel-status-btn");
        if (closeStatus) closeStatus.addEventListener("click", () => statusModal.classList.remove("active"));
        if (cancelStatus) cancelStatus.addEventListener("click", () => statusModal.classList.remove("active"));

        // Delete close
        const closeDelete = document.getElementById("close-delete-modal");
        if (closeDelete) closeDelete.addEventListener("click", () => deleteModal.classList.remove("active"));

        // Click outside overlay to close modal boxes
        window.addEventListener("click", (e) => {
            if (e.target === detailModal) detailModal.classList.remove("active");
            if (e.target === statusModal) statusModal.classList.remove("active");
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

/* ============================================================
   CHART.JS COLOR SWITCHER UTILITY (DARK MODE COMPATIBILITY)
   ============================================================ */
function updateChartsTheme() {
    if (!revenueChart || !monthlyOrdersChart) return;

    const isDark = document.body.classList.contains("dark-mode");
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDark ? "#94a3b8" : "#64748b";

    // 1. Update Revenue Chart ticks & grid colors
    revenueChart.options.scales.x.grid.color = gridColor;
    revenueChart.options.scales.x.ticks.color = textColor;
    revenueChart.options.scales.y.grid.color = gridColor;
    revenueChart.options.scales.y.ticks.color = textColor;
    revenueChart.update();

    // 2. Update Monthly Orders Chart ticks & grid colors
    monthlyOrdersChart.options.scales.x.grid.color = gridColor;
    monthlyOrdersChart.options.scales.x.ticks.color = textColor;
    monthlyOrdersChart.options.scales.y.grid.color = gridColor;
    monthlyOrdersChart.options.scales.y.ticks.color = textColor;
    monthlyOrdersChart.update();
}
