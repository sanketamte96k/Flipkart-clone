# 🛒 Flipkart Clone - Enterprise Full-Stack E-Commerce Platform

A production-ready, high-performance E-Commerce platform built with **Flask**, **MySQL**, **SQLAlchemy**, and **Vanilla Modern JS / CSS**. The system features end-to-end customer workflows (Authentication, Product Catalog, Search & Filtering, Cart, Wishlist, Checkout, Orders, Reviews, Razorpay Payments) alongside a feature-rich Admin Management Portal.

---

## 🚀 Key Features

### 🛍️ Customer Features
- **User Authentication**: Secure Registration & Login with Bcrypt password hashing and local session state.
- **Product Catalog**: Dynamic product grid with real-time category filtering, search, multi-factor price & rating filters, and sorting (Price Low/High, Rating, Newest).
- **Product Details & Ratings**: High-res gallery, specs table, certified customer reviews list, and interactive star-rating review submission for verified buyers.
- **Shopping Cart**: Real-time cart calculations, stock checking, coupon application, and instant cart count synchronization across tabs.
- **Wishlist Management**: One-click product wishlist toggle (❤️), dedicated wishlist page, and seamless "Move to Cart" workflow.
- **Checkout & Razorpay Payments**: Address details input, Order Summary calculation, COD, and Razorpay online gateway payment integration.
- **Order Tracking & History**: Order summary with itemized details, status badge tracking (Pending, Confirmed, Packed, Shipped, Delivered), and invoice printing.

### 🛡️ Admin Management Portal
- **Protected Routes**: Custom `auth.js` authentication guard redirecting unauthorized users.
- **Dashboard Analytics**: Real-time sales metrics, revenue statistics, order status breakdowns, and interactive Chart.js graphs.
- **Product Management**: Full CRUD operations for products (Add, Edit, Delete, Stock update).
- **Order Management**: Status updates (Pending → Delivered), order filtering, and customer details view.
- **Reviews Moderation**: Admin reviews table with search, rating filter, and review deletion capabilities.

---

## 🏗️ Architecture & Technology Stack

```
                     +----------------------------------+
                     |      Frontend Client Layer       |
                     |  (HTML5, CSS3, ES6 JavaScript)   |
                     +----------------------------------+
                                      |
                                  fetch() API
                                      v
                     +----------------------------------+
                     |       Flask Application API      |
                     |  (Flask, Bcrypt, Flask-CORS)     |
                     +----------------------------------+
                                      |
                              SQLAlchemy ORM
                                      v
                     +----------------------------------+
                     |         Database Layer           |
                     |  (MySQL 8.0 / SQLite Fallback)   |
                     +----------------------------------+
```

| Component | Technology |
|---|---|
| **Backend Framework** | Python 3.10+, Flask 3.0 |
| **Database ORM** | Flask-SQLAlchemy 3.1 |
| **Authentication** | Flask-Bcrypt |
| **Payments** | Razorpay SDK Integration |
| **Frontend Stack** | HTML5, Modern Vanilla CSS3, JavaScript ES6 |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions Pipeline |
| **Testing** | Python Unittest & Pytest |

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in the root directory (see `.env.example`):

```env
FLASK_APP=backend/app.py
FLASK_ENV=development
SECRET_KEY=flipkart_super_secret_key_2026
DATABASE_URL=mysql+pymysql://root:password@localhost/flipkart_clone
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=5000
```

---

## 💻 Local Installation & Setup

### 1. Prerequisites
- Python 3.10 or higher
- MySQL Server (optional, SQLite in-memory fallback enabled for testing)

### 2. Setup Virtual Environment
```bash
# Clone the repository
git clone https://github.com/sanketamte96k/Flipkart-clone.git
cd Flipkart-clone

# Create virtual environment
python -m venv venv

# Activate environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run Backend Server
```bash
python backend/app.py
```
The application will start on `http://127.0.0.1:5000`.

---

## 🐳 Docker Setup

Run the application stack with a single command using Docker Compose:

```bash
# Build and start services
docker-compose up --build

# Stop services
docker-compose down
```

---

## 🧪 Running Automated Tests

The repository includes comprehensive automated unit and API integration tests:

```bash
# Run unit & API integration tests
python tests/run_tests.py
```

---

## 📡 API Reference Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | User Registration |
| `POST` | `/api/login` | User Login |
| `GET` | `/api/products` | Fetch All Products |
| `GET` | `/api/cart/<user_id>` | Fetch User Cart Items |
| `POST` | `/api/cart/add` | Add Item to Cart |
| `PUT` | `/api/cart/update/<cart_id>` | Update Cart Item Quantity |
| `DELETE` | `/api/cart/remove/<cart_id>` | Delete Cart Item |
| `GET` | `/api/wishlist/<user_id>` | Fetch User Wishlist |
| `POST` | `/api/wishlist/add` | Add Product to Wishlist |
| `DELETE` | `/api/wishlist/remove/<id>` | Remove Wishlist Item |
| `POST` | `/api/orders/place` | Place Customer Order |
| `GET` | `/api/orders/<user_id>` | Fetch User Orders |
| `GET` | `/api/reviews/<product_id>` | Fetch Product Reviews & Average Rating |
| `POST` | `/api/reviews/add` | Submit Review (Purchased Users Only) |
| `DELETE` | `/api/reviews/<id>` | Delete Review (Owner/Admin) |
| `GET` | `/api/admin/orders` | Fetch All Admin Orders |
| `PUT` | `/api/admin/orders/<id>` | Update Order Status |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.