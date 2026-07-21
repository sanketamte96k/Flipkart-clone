from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os

# Initialize Flask with the static folder pointing to the frontend directory
app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# =========================
# Serve Frontend Files
# =========================

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    # This serves all other files (css, js, images, other html)
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return jsonify({"error": "File not found"}), 404

# =========================
# Shared Product Database
# =========================
PRODUCTS_DB = [
    # --- MOBILES ---
    {
        "id": 1,
        "name": "iPhone 14 (Blue)",
        "price": 69999,
        "category": "Mobile",
        "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500",
        "stock": 45,
        "description": "Super Retina XDR display, advanced dual-camera system, and high battery endurance.",
        "specs": [
            ["Display", "6.1-inch Super Retina XDR"],
            ["Processor", "A15 Bionic Chip"],
            ["Camera", "12MP Main + 12MP Ultra Wide"],
            ["Battery", "Up to 20 hours video playback"]
        ]
    },
    {
        "id": 4,
        "name": "Samsung Galaxy S23",
        "price": 74999,
        "category": "Mobile",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        "stock": 32,
        "description": "Dynamic AMOLED 2X display with 120Hz refresh rate and flagship performance.",
        "specs": [
            ["Display", "6.1-inch Dynamic AMOLED 2X"],
            ["Processor", "Snapdragon 8 Gen 2"],
            ["RAM", "8 GB"],
            ["Battery", "3900 mAh"]
        ]
    },
    {
        "id": 6,
        "name": "Google Pixel 7",
        "price": 59999,
        "category": "Mobile",
        "image": "images/pixel.png",
        "stock": 15,
        "description": "State of the art Google Tensor G2 processor and legendary Pixel photography system."
    },
    {
        "id": 7,
        "name": "OnePlus 11R",
        "price": 39999,
        "category": "Mobile",
        "image": "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500",
        "stock": 25,
        "description": "Ultra fast charging speeds, sleek display and robust gaming features."
    },

    # --- LAPTOPS ---
    {
        "id": 2,
        "name": "HP Pavilion Laptop",
        "price": 58990,
        "category": "Laptop",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
        "stock": 0,
        "description": "Premium workhorse laptop with high definition anti-glare screen layout."
    },
    {
        "id": 5,
        "name": "MacBook Air M2",
        "price": 114900,
        "category": "Laptop",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        "stock": 24,
        "description": "Apple M2 system on chip, quiet fanless design, and Liquid Retina display.",
        "specs": [
            ["Processor", "Apple M2 Chip"],
            ["Memory", "8 GB Unified RAM"],
            ["Storage", "256 GB SSD"],
            ["Display", "13.6-inch Liquid Retina"]
        ]
    },
    {
        "id": 8,
        "name": "Dell Vostro 3420",
        "price": 42990,
        "category": "Laptop",
        "image": "images/dell.png",
        "stock": 4,
        "description": "Reliable commercial enterprise laptop with robust security features."
    },
    {
        "id": 9,
        "name": "ASUS Vivobook 16X",
        "price": 64990,
        "category": "Laptop",
        "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        "stock": 18,
        "description": "Spacious 16-inch display perfect for content creation and daily tasks."
    },

    # --- FASHION ---
    {
        "id": 3,
        "name": "Nike Running Shoes",
        "price": 4999,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        "stock": 68,
        "description": "Lightweight breathable fabrics and modern cushion systems."
    },
    {
        "id": 10,
        "name": "Adidas Men's Sneakers",
        "price": 3499,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500",
        "stock": 8,
        "description": "Sleek casual streetwear sneakers built for long lasting comfort."
    },
    {
        "id": 11,
        "name": "Puma Men's T-Shirt",
        "price": 1299,
        "category": "Fashion",
        "image": "images/puma.png",
        "stock": 120,
        "description": "100% organic cotton sporty slim-fit t-shirt."
    },
    {
        "id": 12,
        "name": "Levi's Men's Jeans",
        "price": 2599,
        "category": "Fashion",
        "image": "images/levis.png",
        "stock": 0,
        "description": "Classic fit durable denim jeans."
    },

    # --- BEAUTY ---
    {
        "id": 13,
        "name": "Dior Sauvage Perfume",
        "price": 9500,
        "category": "Beauty",
        "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
        "stock": 12,
        "description": "Premium luxury men's fragrance with raw woody elements."
    },
    {
        "id": 14,
        "name": "Chanel No.5 Perfume",
        "price": 12000,
        "category": "Beauty",
        "image": "images/chanel.png",
        "stock": 9,
        "description": "Timeless legendary women's luxury floral scent."
    },
    {
        "id": 15,
        "name": "L'Oreal Face Cream",
        "price": 899,
        "category": "Beauty",
        "image": "images/loreal.png",
        "stock": 50,
        "description": "Daily hydration cream with hyaluronic acid."
    },
    {
        "id": 16,
        "name": "Lakme Sunscreen",
        "price": 450,
        "category": "Beauty",
        "image": "images/lakme.png",
        "stock": 75,
        "description": "SPF 50 matte finish sunscreen protection."
    },
    {
        "id": 17,
        "name": "Bella Vita Perfume Set",
        "price": 1899,
        "category": "Beauty",
        "image": "images/bellavita.png",
        "stock": 30,
        "description": "Exclusive collection of 4 mini luxury perfume fragrances."
    },
    {
        "id": 18,
        "name": "Skechers Men's Glide",
        "price": 4500,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
        "stock": 14,
        "description": "Memory foam slip-on walking sneakers."
    },
    {
        "id": 19,
        "name": "Reebok Men's Floatride",
        "price": 5500,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
        "stock": 20,
        "description": "High performance responsive foam road running shoe."
    },
    {
        "id": 20,
        "name": "Allen Solly Men's Shirt",
        "price": 1499,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
        "stock": 35,
        "description": "100% premium cotton casual check shirt."
    },
    {
        "id": 21,
        "name": "US Polo Assn T-Shirt",
        "price": 1199,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500",
        "stock": 42,
        "description": "Signature cotton polo shirt with brand embroidery."
    },
    {
        "id": 22,
        "name": "Sony WH-1000XM5",
        "price": 29990,
        "category": "Mobile",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "stock": 18,
        "description": "Industry leading active noise cancelling bluetooth headphones."
    },
    {
        "id": 23,
        "name": "Apple Watch Series 8",
        "price": 45900,
        "category": "Mobile",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
        "stock": 10,
        "description": "Advanced health tracking sensors, temperature sensing, and ECG monitor."
    },

    # --- FITNESS ---
    {
        "id": 24,
        "name": "ON Gold Standard Whey Protein (2kg)",
        "price": 6499,
        "category": "Fitness",
        "image": "images/fitness/whey_protein.png",
        "isMinutesEligible": True,
        "stock": 40,
        "description": "Premium whey protein isolate powder supporting muscle recovery and growth.",
        "specs": [
            ["Flavor", "Double Rich Chocolate"],
            ["Protein per Serving", "24 g"],
            ["Total Servings", "74"],
            ["Weight", "2 kg"]
        ]
    },
    {
        "id": 25,
        "name": "MuscleBlaze Creatine Monohydrate",
        "price": 1099,
        "category": "Fitness",
        "image": "images/fitness/creatine.png",
        "isMinutesEligible": True,
        "stock": 25,
        "description": "Pure micronized creatine supporting energy output and training intensity.",
        "specs": [
            ["Type", "Micronized Creatine Monohydrate"],
            ["Weight", "250 g"],
            ["Servings", "83"],
            ["Purity", "99.9%"]
        ]
    },
    {
        "id": 26,
        "name": "Premium Stainless Steel Gym Shaker",
        "price": 699,
        "category": "Fitness",
        "image": "images/fitness/gym_shaker.png",
        "isMinutesEligible": True,
        "stock": 60,
        "description": "Leak-proof stainless steel shaker bottle with wire mixing ball.",
        "specs": [
            ["Material", "BPA-Free Stainless Steel"],
            ["Capacity", "750 ml"],
            ["Leakproof", "Yes"],
            ["Mixing Mechanism", "Blender Ball Included"]
        ]
    },
    {
        "id": 27,
        "name": "C4 Original Pre-Workout (30 Servings)",
        "price": 2499,
        "category": "Fitness",
        "image": "images/fitness/preworkout.png",
        "stock": 15,
        "description": "High energy fitness supplement with beta-alanine and caffeine.",
        "specs": [
            ["Flavor", "Fruit Punch"],
            ["Servings", "30"],
            ["Caffeine", "150 mg per serving"]
        ]
    },
    {
        "id": 28,
        "name": "MuscleBlaze BCAA Pro (450g)",
        "price": 1799,
        "category": "Fitness",
        "image": "images/fitness/bcaa.png",
        "isMinutesEligible": True,
        "stock": 30,
        "description": "Intra-workout drink containing branched-chain amino acids.",
        "specs": [
            ["Flavor", "Blue Raspberry"],
            ["BCAA Ratio", "2:1:1 (L-Leucine, L-Isoleucine, L-Valine)"],
            ["Servings", "30"],
            ["Weight", "450 g"]
        ]
    },
    {
        "id": 29,
        "name": "Resistance Bands Set (5 Levels)",
        "price": 899,
        "category": "Fitness",
        "image": "images/fitness/resistance_bands.png",
        "isMinutesEligible": True,
        "stock": 50,
        "description": "5 levels latex loop bands for physical therapy, strength training and yoga.",
        "specs": [
            ["Bands Included", "5 (Extra Light to Extra Heavy)"],
            ["Material", "Premium Natural Latex"],
            ["Use", "Home/Gym Workout, Yoga, Stretching"],
            ["Comes With", "Carry Bag & Guide Book"]
        ]
    },
    {
        "id": 30,
        "name": "HealthKart Daily Multivitamin (60 Tabs)",
        "price": 649,
        "category": "Fitness",
        "image": "images/fitness/multivitamin.png",
        "stock": 80,
        "description": "Multivitamin supplements with 24 vitamins and minerals.",
        "specs": [
            ["Tablets", "60"],
            ["Vitamins & Minerals", "24 Essential Nutrients"],
            ["Suitable For", "Men & Women"],
            ["Form", "Coated Tablets"]
        ]
    }
]

# =========================
# Public Catalog Routes
# =========================
@app.route('/products')
@app.route('/api/products')
def products():
    return jsonify(PRODUCTS_DB)

# =========================
# Admin CRUD Products APIs
# =========================
@app.route('/admin/products', methods=['GET'])
def get_admin_products():
    return jsonify(PRODUCTS_DB)

@app.route('/admin/products', methods=['POST'])
def add_admin_product():
    req_data = request.get_json()
    if not req_data:
        return jsonify({"error": "Missing payload"}), 400
        
    name = req_data.get('name')
    category = req_data.get('category')
    price = req_data.get('price')
    stock = req_data.get('stock')
    image = req_data.get('image')
    description = req_data.get('description', '')

    if not name or not category or price is None or stock is None:
        return jsonify({"error": "Missing required fields"}), 400

    new_id = max([p['id'] for p in PRODUCTS_DB]) + 1 if PRODUCTS_DB else 1
    new_product = {
        "id": new_id,
        "name": name,
        "category": category,
        "price": int(price),
        "stock": int(stock),
        "image": image or "images/image1.jpeg",
        "description": description
    }
    PRODUCTS_DB.append(new_product)
    return jsonify(new_product), 201

@app.route('/admin/products/<int:product_id>', methods=['PUT'])
def update_admin_product(product_id):
    req_data = request.get_json()
    if not req_data:
        return jsonify({"error": "Missing payload"}), 400

    product = next((p for p in PRODUCTS_DB if p['id'] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    product['name'] = req_data.get('name', product['name'])
    product['category'] = req_data.get('category', product['category'])
    if 'price' in req_data:
        product['price'] = int(req_data['price'])
    if 'stock' in req_data:
        product['stock'] = int(req_data['stock'])
    product['image'] = req_data.get('image', product['image'])
    product['description'] = req_data.get('description', product.get('description', ''))

    return jsonify(product), 200

@app.route('/admin/products/<int:product_id>', methods=['DELETE'])
def delete_admin_product(product_id):
    global PRODUCTS_DB
    product = next((p for p in PRODUCTS_DB if p['id'] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    PRODUCTS_DB = [p for p in PRODUCTS_DB if p['id'] != product_id]
    return jsonify({"success": True, "message": "Product deleted successfully"}), 200


@app.route('/admin/dashboard')
def admin_dashboard():
    dashboard_data = {
        "products": 128,
        "users": 1250,
        "orders": 842,
        "revenue": 1240000,
        "sales": [15000, 22000, 18000, 30000, 27000, 35000, 40000],
        "orderStatus": {
            "delivered": 520,
            "pending": 180,
            "cancelled": 42,
            "returned": 28
        }
    }
    return jsonify(dashboard_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)