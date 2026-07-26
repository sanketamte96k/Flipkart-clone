from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import os
import logging
import urllib.parse
from datetime import datetime
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Setup Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("flipkart_app")

# Initialize Flask with the static folder pointing to the frontend directory
app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'flipkart_super_secret_key_2026')

# Database Configuration with Environment Override & Fallback
db_uri = os.environ.get('DATABASE_URL')
if not db_uri:
    db_user = os.environ.get('DB_USER', 'root')
    db_password = urllib.parse.quote_plus(os.environ.get('DB_PASSWORD', 'abd@123'))
    db_host = os.environ.get('DB_HOST', 'localhost')
    db_name = os.environ.get('DB_NAME', 'flipkart_clone')
    db_uri = f'mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}'

app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)

RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_mockkey123')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'mocksecret123')

# =========================
# Database Model
# =========================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="customer")
    avatar = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "avatar": self.avatar or "",
            "isLoggedIn": True
        }

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "price": self.price,
            "stock": self.stock,
            "image": self.image,
            "description": self.description
        }

class Cart(db.Model):
    __tablename__ = "cart"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('cart_items', lazy=True))
    product = db.relationship('Product', backref=db.backref('cart_items', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "product": self.product.to_dict() if self.product else None
        }

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default="Pending")
    payment_status = db.Column(db.String(50), default="Pending")
    payment_method = db.Column(db.String(50), nullable=False)
    shipping_address = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else None,
            "user_email": self.user.email if self.user else None,
            "total_amount": self.total_amount,
            "status": self.status,
            "payment_status": self.payment_status,
            "payment_method": self.payment_method,
            "shipping_address": self.shipping_address,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "items": [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)

    product = db.relationship('Product', backref=db.backref('order_items', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "price": self.price,
            "product": self.product.to_dict() if self.product else None
        }

class Wishlist(db.Model):
    __tablename__ = "wishlist"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='_user_product_uc'),)

    user = db.relationship('User', backref=db.backref('wishlist_items', lazy=True))
    product = db.relationship('Product', backref=db.backref('wishlist_items', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "product": self.product.to_dict() if self.product else None
        }

class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='_user_product_review_uc'),)

    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
    product = db.relationship('Product', backref=db.backref('reviews', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else "Anonymous",
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else "",
            "rating": self.rating,
            "review_text": self.review_text,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# Initial Product Data (Used for one-time automatic seeding if DB is empty)
INITIAL_PRODUCTS = [
    # --- MOBILES ---
    {
        "id": 1,
        "name": "iPhone 14 (Blue)",
        "price": 69999,
        "category": "Mobile",
        "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500",
        "stock": 45,
        "description": "Super Retina XDR display, advanced dual-camera system, and high battery endurance."
    },
    {
        "id": 4,
        "name": "Samsung Galaxy S23",
        "price": 74999,
        "category": "Mobile",
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        "stock": 32,
        "description": "Dynamic AMOLED 2X display with 120Hz refresh rate and flagship performance."
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
        "description": "Apple M2 system on chip, quiet fanless design, and Liquid Retina display."
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
        "stock": 40,
        "description": "Premium whey protein isolate powder supporting muscle recovery and growth."
    },
    {
        "id": 25,
        "name": "MuscleBlaze Creatine Monohydrate",
        "price": 1099,
        "category": "Fitness",
        "image": "images/fitness/creatine.png",
        "stock": 25,
        "description": "Pure micronized creatine supporting energy output and training intensity."
    },
    {
        "id": 26,
        "name": "Premium Stainless Steel Gym Shaker",
        "price": 699,
        "category": "Fitness",
        "image": "images/fitness/gym_shaker.png",
        "stock": 60,
        "description": "Leak-proof stainless steel shaker bottle with wire mixing ball."
    },
    {
        "id": 27,
        "name": "C4 Original Pre-Workout (30 Servings)",
        "price": 2499,
        "category": "Fitness",
        "image": "images/fitness/preworkout.png",
        "stock": 15,
        "description": "High energy fitness supplement with beta-alanine and caffeine."
    },
    {
        "id": 28,
        "name": "MuscleBlaze BCAA Pro (450g)",
        "price": 1799,
        "category": "Fitness",
        "image": "images/fitness/bcaa.png",
        "stock": 30,
        "description": "Intra-workout drink containing branched-chain amino acids."
    },
    {
        "id": 29,
        "name": "Resistance Bands Set (5 Levels)",
        "price": 899,
        "category": "Fitness",
        "image": "images/fitness/resistance_bands.png",
        "stock": 50,
        "description": "5 levels latex loop bands for physical therapy, strength training and yoga."
    },
    {
        "id": 30,
        "name": "HealthKart Daily Multivitamin (60 Tabs)",
        "price": 649,
        "category": "Fitness",
        "image": "images/fitness/multivitamin.png",
        "stock": 80,
        "description": "Multivitamin supplements with 24 vitamins and minerals."
    }
]

# Database Initialization and One-Time Seeding
def init_db_and_seed():
    try:
        db.create_all()

        try:
            db.session.execute(db.text("ALTER TABLE users ADD COLUMN avatar TEXT NULL"))
            db.session.commit()
        except Exception:
            db.session.rollback()
        
        # Seed Default Admin Account if no admin exists
        admin_user = User.query.filter((User.role == "admin") | (User.email == "admin@flipkartclone.com")).first()
        if not admin_user:
            logger.info("Creating default admin account (admin@flipkartclone.com)...")
            hashed_admin_pass = bcrypt.generate_password_hash("Admin@123").decode("utf-8")
            default_admin = User(
                name="Sanket Amte",
                email="admin@flipkartclone.com",
                password=hashed_admin_pass,
                role="admin"
            )
            db.session.add(default_admin)
            db.session.commit()
            logger.info("Successfully created default admin user.")

        if Product.query.count() == 0:
            logger.info("Seeding initial products into database...")
            for item in INITIAL_PRODUCTS:
                product = Product(
                    id=item["id"],
                    name=item["name"],
                    category=item["category"],
                    price=int(item["price"]),
                    stock=int(item["stock"]),
                    image=item.get("image", "images/image1.jpeg"),
                    description=item.get("description", "")
                )
                db.session.add(product)
            db.session.commit()
            logger.info("Successfully seeded initial products.")
    except Exception as err:
        logger.error(f"Database initialization warning: {err}")
        db.session.rollback()
        try:
            db.create_all()
        except Exception as e2:
            logger.error(f"Secondary db.create_all error: {e2}")

with app.app_context():
    init_db_and_seed()

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
# Authentication APIs
# =========================
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "All fields are required"}), 400

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"success": False, "message": "All fields are required"}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            role="customer"
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Registration successful"
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": "An error occurred during registration"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Email and password are required"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"success": False, "message": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": "An error occurred during login"}), 500

# =========================
# Shopping Cart APIs
# =========================
@app.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    try:
        cart_items = Cart.query.filter_by(user_id=user_id).all()
        return jsonify([item.to_dict() for item in cart_items]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing payload"}), 400

        user_id = data.get("user_id")
        product_id = data.get("product_id")
        quantity = int(data.get("quantity", 1))

        if not user_id or not product_id:
            return jsonify({"error": "user_id and product_id are required"}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        existing_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing_item:
            existing_item.quantity += quantity
        else:
            new_item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
            db.session.add(new_item)

        db.session.commit()
        return jsonify({"success": True, "message": "Item added to cart"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/cart/update/<int:cart_id>', methods=['PUT'])
def update_cart_item(cart_id):
    try:
        data = request.get_json()
        if not data or 'quantity' not in data:
            return jsonify({"error": "Quantity is required"}), 400

        quantity = int(data.get("quantity"))
        cart_item = Cart.query.get(cart_id)
        if not cart_item:
            return jsonify({"error": "Cart item not found"}), 404

        if quantity <= 0:
            db.session.delete(cart_item)
        else:
            cart_item.quantity = quantity

        db.session.commit()
        return jsonify({"success": True, "message": "Cart item updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/cart/remove/<int:cart_id>', methods=['DELETE'])
def remove_cart_item(cart_id):
    try:
        cart_item = Cart.query.get(cart_id)
        if not cart_item:
            return jsonify({"error": "Cart item not found"}), 404

        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"success": True, "message": "Item removed from cart"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/cart/clear/<int:user_id>', methods=['DELETE'])
def clear_cart(user_id):
    try:
        Cart.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return jsonify({"success": True, "message": "Cart cleared successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# =========================
# Order APIs
# =========================
@app.route('/api/orders/place', methods=['POST'])
def place_order():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing payload"}), 400

        user_id = data.get("user_id")
        payment_method = data.get("payment_method", "COD")
        shipping_address = data.get("shipping_address")

        if not user_id or not shipping_address:
            return jsonify({"error": "user_id and shipping_address are required"}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # 1. Load user's cart
        cart_items = Cart.query.filter_by(user_id=user_id).all()

        # 2. If cart is empty: Return HTTP 400
        if not cart_items:
            return jsonify({"success": False, "message": "Cart is empty"}), 400

        # 3. Calculate total
        total_amount = 0
        for item in cart_items:
            if item.product:
                total_amount += item.product.price * item.quantity

        payment_status = "Paid" if payment_method.upper() != "COD" else "Pending"

        # 4. Create Order
        new_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            status="Pending",
            payment_status=payment_status,
            payment_method=payment_method,
            shipping_address=shipping_address
        )
        db.session.add(new_order)
        db.session.flush()

        # 5. Create OrderItems & 6. Reduce product stock
        for item in cart_items:
            if item.product:
                order_item = OrderItem(
                    order_id=new_order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.product.price
                )
                db.session.add(order_item)
                item.product.stock = max(0, item.product.stock - item.quantity)

        # 7. Clear cart
        Cart.query.filter_by(user_id=user_id).delete()

        db.session.commit()

        # 8. Return response
        return jsonify({
            "success": True,
            "message": "Order placed successfully",
            "order_id": new_order.id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    try:
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
        return jsonify([order.to_dict() for order in orders]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/orders', methods=['GET'])
def get_admin_orders():
    try:
        orders = Order.query.order_by(Order.created_at.desc()).all()
        return jsonify([order.to_dict() for order in orders]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/orders/<int:order_id>', methods=['PUT'])
def update_admin_order_status(order_id):
    try:
        data = request.get_json()
        if not data or "status" not in data:
            return jsonify({"error": "Status is required"}), 400

        status = data.get("status")
        valid_statuses = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"]
        if status not in valid_statuses:
            return jsonify({"error": f"Status must be one of {valid_statuses}"}), 400

        order = Order.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order.status = status
        if status == "Delivered":
            order.payment_status = "Paid"

        db.session.commit()
        return jsonify({"success": True, "message": "Order status updated", "order": order.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# =========================
# Wishlist APIs
# =========================
@app.route('/api/wishlist/add', methods=['POST'])
def add_to_wishlist():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing payload"}), 400

        user_id = data.get("user_id")
        product_id = data.get("product_id")

        if not user_id or not product_id:
            return jsonify({"error": "user_id and product_id are required"}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        existing_item = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing_item:
            return jsonify({"success": False, "message": "Product is already in your wishlist"}), 200

        new_wishlist = Wishlist(user_id=user_id, product_id=product_id)
        db.session.add(new_wishlist)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Product added to wishlist",
            "id": new_wishlist.id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/wishlist/<int:user_id>', methods=['GET'])
def get_wishlist(user_id):
    try:
        wishlist_items = Wishlist.query.filter_by(user_id=user_id).order_by(Wishlist.created_at.desc()).all()
        return jsonify([item.to_dict() for item in wishlist_items]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/wishlist/remove/<int:wishlist_id>', methods=['DELETE'])
def remove_from_wishlist(wishlist_id):
    try:
        item = Wishlist.query.get(wishlist_id)
        if not item:
            return jsonify({"error": "Wishlist item not found"}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({"success": True, "message": "Product removed from wishlist"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# =========================
# Review APIs
# =========================
@app.route('/api/reviews/add', methods=['POST'])
def add_review():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing payload"}), 400

        user_id = data.get("user_id")
        product_id = data.get("product_id")
        rating = data.get("rating")
        review_text = data.get("review_text", "").strip()

        if not user_id or not product_id or rating is None or not review_text:
            return jsonify({"error": "user_id, product_id, rating, and review_text are required"}), 400

        try:
            rating = int(rating)
        except ValueError:
            return jsonify({"error": "Rating must be an integer"}), 400

        if rating < 1 or rating > 5:
            return jsonify({"error": "Rating must be between 1 and 5"}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # 1. Rules: Only users who have purchased the product can review it.
        purchased = OrderItem.query.join(Order).filter(Order.user_id == user_id, OrderItem.product_id == product_id).first()
        if not purchased:
            return jsonify({"success": False, "message": "Only customers who have purchased this product can review it."}), 403

        # 2. Rules: A user can submit only one review per product.
        existing_review = Review.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing_review:
            return jsonify({"success": False, "message": "You have already submitted a review for this product."}), 400

        new_review = Review(
            user_id=user_id,
            product_id=product_id,
            rating=rating,
            review_text=review_text
        )
        db.session.add(new_review)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Review submitted successfully",
            "review": new_review.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/reviews/<int:product_id>', methods=['GET'])
def get_product_reviews(product_id):
    try:
        reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
        total_reviews = len(reviews)
        average_rating = round(sum(r.rating for r in reviews) / total_reviews, 1) if total_reviews > 0 else 0

        return jsonify({
            "average_rating": average_rating,
            "total_reviews": total_reviews,
            "reviews": [r.to_dict() for r in reviews]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reviews/check-eligible/<int:user_id>/<int:product_id>', methods=['GET'])
def check_review_eligibility(user_id, product_id):
    try:
        purchased = OrderItem.query.join(Order).filter(Order.user_id == user_id, OrderItem.product_id == product_id).first()
        existing_review = Review.query.filter_by(user_id=user_id, product_id=product_id).first()

        can_review = bool(purchased) and not bool(existing_review)
        already_reviewed = bool(existing_review)
        has_purchased = bool(purchased)

        return jsonify({
            "can_review": can_review,
            "has_purchased": has_purchased,
            "already_reviewed": already_reviewed,
            "existing_review": existing_review.to_dict() if existing_review else None
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing payload"}), 400

        user_id = data.get("user_id")
        rating = data.get("rating")
        review_text = data.get("review_text", "").strip()

        review = Review.query.get(review_id)
        if not review:
            return jsonify({"error": "Review not found"}), 404

        if user_id and review.user_id != int(user_id):
            return jsonify({"error": "Unauthorized to edit this review"}), 403

        if rating is not None:
            try:
                rating = int(rating)
                if 1 <= rating <= 5:
                    review.rating = rating
            except ValueError:
                pass

        if review_text:
            review.review_text = review_text

        db.session.commit()
        return jsonify({"success": True, "message": "Review updated successfully", "review": review.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({"error": "Review not found"}), 404

        db.session.delete(review)
        db.session.commit()
        return jsonify({"success": True, "message": "Review deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/reviews', methods=['GET'])
def get_admin_reviews():
    try:
        reviews = Review.query.order_by(Review.created_at.desc()).all()
        return jsonify([r.to_dict() for r in reviews]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500






# =========================
# Public Catalog Routes
# =========================
@app.route('/products')
@app.route('/api/products')
def products():
    try:
        all_products = Product.query.all()
    except Exception as e:
        logger.warning(f"Error querying products table ({e}). Self-healing DB setup...")
        db.session.rollback()
        init_db_and_seed()
        all_products = Product.query.all()

    return jsonify([p.to_dict() for p in all_products])

@app.route('/products/<int:product_id>', methods=['GET'])
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_single_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product.to_dict()), 200
    except Exception as e:
        logger.warning(f"Error querying single product ({e}). Self-healing DB setup...")
        db.session.rollback()
        init_db_and_seed()
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product.to_dict()), 200

# =========================
# Admin CRUD Products APIs
# =========================
@app.route('/admin/products', methods=['GET'])
def get_admin_products():
    all_products = Product.query.all()
    return jsonify([p.to_dict() for p in all_products])

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

    new_product = Product(
        name=name,
        category=category,
        price=int(price),
        stock=int(stock),
        image=image or "images/image1.jpeg",
        description=description
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

@app.route('/admin/products/<int:product_id>', methods=['PUT'])
def update_admin_product(product_id):
    req_data = request.get_json()
    if not req_data:
        return jsonify({"error": "Missing payload"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if 'name' in req_data:
        product.name = req_data['name']
    if 'category' in req_data:
        product.category = req_data['category']
    if 'price' in req_data:
        product.price = int(req_data['price'])
    if 'stock' in req_data:
        product.stock = int(req_data['stock'])
    if 'image' in req_data:
        product.image = req_data['image']
    if 'description' in req_data:
        product.description = req_data['description']

    db.session.commit()
    return jsonify(product.to_dict()), 200

@app.route('/admin/products/<int:product_id>', methods=['DELETE'])
def delete_admin_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()
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

@app.route('/api/admin/profile', methods=['POST'])
def update_admin_profile():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No input data provided"}), 400

        user_id = data.get("id")
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        avatar = data.get("avatar")

        user = User.query.get(user_id)
        if not user:
            return jsonify({"success": False, "message": "Admin user not found"}), 404

        if name:
            user.name = name.strip()
        if email:
            clean_email = email.strip()
            existing = User.query.filter(User.email == clean_email, User.id != user.id).first()
            if existing:
                return jsonify({"success": False, "message": "Email is already in use by another user"}), 400
            user.email = clean_email
        if password and len(password.strip()) > 0:
            user.password = bcrypt.generate_password_hash(password.strip()).decode("utf-8")
        if avatar is not None:
            user.avatar = avatar

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Admin profile updated successfully",
            "user": user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating admin profile: {e}")
        return jsonify({"success": False, "message": "Failed to update profile"}), 500

# =========================
# Error Handlers
# =========================
@app.errorhandler(404)
def page_not_found(e):
    if request.path.startswith('/api/'):
        return jsonify({"error": "Resource not found", "status": 404}), 404
    return send_from_directory('../frontend', '404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    if request.path.startswith('/api/'):
        return jsonify({"error": "Internal server error", "status": 500}), 500
    return send_from_directory('../frontend', '500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)