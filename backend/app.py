from flask import Flask, jsonify, send_from_directory
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
# API Products Route
# =========================

@app.route('/products')
@app.route('/api/products')
def products():
    data = [
        # --- MOBILES ---
        {
            "id": 1,
            "name": "iPhone 14 (Blue)",
            "price": 69999,
            "category": "Mobile",
            "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500",
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
            "image": "images/pixel.png"
        },
        {
            "id": 7,
            "name": "OnePlus 11R",
            "price": 39999,
            "category": "Mobile",
            "image": "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500"
        },

        # --- LAPTOPS ---
        {
            "id": 2,
            "name": "HP Pavilion Laptop",
            "price": 58990,
            "category": "Laptop",
            "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
        },
        {
            "id": 5,
            "name": "MacBook Air M2",
            "price": 114900,
            "category": "Laptop",
            "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
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
            "image": "images/dell.png"
        },
        {
            "id": 9,
            "name": "ASUS Vivobook 16X",
            "price": 64990,
            "category": "Laptop",
            "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500"
        },

        # --- FASHION ---
        {
            "id": 3,
            "name": "Nike Running Shoes",
            "price": 4999,
            "category": "Fashion",
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
        },
        {
            "id": 10,
            "name": "Adidas Men's Sneakers",
            "price": 3499,
            "category": "Fashion",
            "image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500"
        },
        {
            "id": 11,
            "name": "Puma Men's T-Shirt",
            "price": 1299,
            "category": "Fashion",
            "image": "images/puma.png"
        },
        {
            "id": 12,
            "name": "Levi's Men's Jeans",
            "price": 2599,
            "category": "Fashion",
            "image": "images/levis.png"
        },

        # --- BEAUTY ---
        {
            "id": 13,
            "name": "Dior Sauvage Perfume",
            "price": 9500,
            "category": "Beauty",
            "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500"
        },
        {
            "id": 14,
            "name": "Chanel No.5 Perfume",
            "price": 12000,
            "category": "Beauty",
            "image": "images/chanel.png"
        },
        {
            "id": 15,
            "name": "L'Oreal Face Cream",
            "price": 899,
            "category": "Beauty",
            "image": "images/loreal.png"
        },
        {
            "id": 16,
            "name": "Lakme Sunscreen",
            "price": 450,
            "category": "Beauty",
            "image": "images/lakme.png"
        },
        {
            "id": 17,
            "name": "Bella Vita Perfume Set",
            "price": 1899,
            "category": "Beauty",
            "image": "images/bellavita.png"
        },
        {
            "id": 18,
            "name": "Skechers Men's Glide",
            "price": 4500,
            "category": "Fashion",
            "image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500"
        },
        {
            "id": 19,
            "name": "Reebok Men's Floatride",
            "price": 5500,
            "category": "Fashion",
            "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500"
        },
        {
            "id": 20,
            "name": "Allen Solly Men's Shirt",
            "price": 1499,
            "category": "Fashion",
            "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"
        },
        {
            "id": 21,
            "name": "US Polo Assn T-Shirt",
            "price": 1199,
            "category": "Fashion",
            "image": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500"
        },
        {
            "id": 22,
            "name": "Sony WH-1000XM5",
            "price": 29990,
            "category": "Mobile",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
        },
        {
            "id": 23,
            "name": "Apple Watch Series 8",
            "price": 45900,
            "category": "Mobile",
            "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500"
        },
        {
            "id": 24,
            "name": "ON Gold Standard Whey Protein (2kg)",
            "price": 6499,
            "category": "Fitness",
            "image": "/images/fitness/whey_protein.png",
            "isMinutesEligible": True,
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
            "image": "/images/fitness/creatine.png",
            "isMinutesEligible": True,
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
            "image": "/images/fitness/gym_shaker.png",
            "isMinutesEligible": True,
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
            "image": "/images/fitness/preworkout.png",
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
            "image": "/images/fitness/bcaa.png",
            "isMinutesEligible": True,
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
            "image": "/images/fitness/resistance_bands.png",
            "isMinutesEligible": True,
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
            "image": "/images/fitness/multivitamin.png",
            "specs": [
                ["Tablets", "60"],
                ["Vitamins & Minerals", "24 Essential Nutrients"],
                ["Suitable For", "Men & Women"],
                ["Form", "Coated Tablets"]
            ]
        }
    ]
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)