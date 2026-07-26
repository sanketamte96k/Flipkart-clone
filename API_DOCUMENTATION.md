# 📡 API Documentation - Flipkart Clone Backend

This document details all REST API endpoints exposed by the Flask backend application (`backend/app.py`).

---

## 🔐 1. Authentication APIs

### 1.1 User Registration
- **Endpoint**: `POST /api/register`
- **Request Body**:
```json
{
  "name": "Sanket Amte",
  "email": "sanket@example.com",
  "password": "password123"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Sanket Amte",
    "email": "sanket@example.com",
    "role": "customer"
  }
}
```

### 1.2 User Login
- **Endpoint**: `POST /api/login`
- **Request Body**:
```json
{
  "email": "sanket@example.com",
  "password": "password123"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Sanket Amte",
    "email": "sanket@example.com",
    "role": "customer"
  }
}
```

---

## 📦 2. Product Catalog APIs

### 2.1 Fetch All Products
- **Endpoint**: `GET /api/products` or `GET /products`
- **Response** (`200 OK`):
```json
[
  {
    "id": 1,
    "name": "Samsung Galaxy S23 Ultra 5G",
    "category": "Mobile",
    "price": 124999,
    "stock": 25,
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    "description": "Experience peak smartphone technology with 200MP camera and Snapdragon 8 Gen 2."
  }
]
```

### 2.2 Fetch Single Product
- **Endpoint**: `GET /products/<int:product_id>`
- **Response** (`200 OK`):
```json
{
  "id": 1,
  "name": "Samsung Galaxy S23 Ultra 5G",
  "category": "Mobile",
  "price": 124999,
  "stock": 25,
  "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
  "description": "Experience peak smartphone technology."
}
```

---

## 🛒 3. Shopping Cart APIs

### 3.1 Get User Cart
- **Endpoint**: `GET /api/cart/<int:user_id>`
- **Response** (`200 OK`):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "product_id": 5,
    "quantity": 2,
    "product": {
      "id": 5,
      "name": "Sony WH-1000XM5",
      "price": 29990,
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    }
  }
]
```

### 3.2 Add to Cart
- **Endpoint**: `POST /api/cart/add`
- **Request Body**:
```json
{
  "user_id": 1,
  "product_id": 5,
  "quantity": 1
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Product added to cart",
  "id": 1
}
```

### 3.3 Update Cart Quantity
- **Endpoint**: `PUT /api/cart/update/<int:cart_id>`
- **Request Body**:
```json
{
  "quantity": 3
}
```

### 3.4 Delete Cart Item
- **Endpoint**: `DELETE /api/cart/remove/<int:cart_id>`

---

## 💖 4. Wishlist APIs

### 4.1 Get User Wishlist
- **Endpoint**: `GET /api/wishlist/<int:user_id>`

### 4.2 Add to Wishlist
- **Endpoint**: `POST /api/wishlist/add`
- **Request Body**:
```json
{
  "user_id": 1,
  "product_id": 5
}
```

### 4.3 Remove from Wishlist
- **Endpoint**: `DELETE /api/wishlist/remove/<int:wishlist_id>`

---

## 🚚 5. Order & Checkout APIs

### 5.1 Place Order
- **Endpoint**: `POST /api/orders/place`
- **Request Body**:
```json
{
  "user_id": 1,
  "payment_method": "COD",
  "shipping_address": "123 Tech Street, Silicon Valley, CA"
}
```

### 5.2 Get User Orders
- **Endpoint**: `GET /api/orders/<int:user_id>`

---

## ⭐ 6. Reviews & Ratings APIs

### 6.1 Get Product Reviews & Average Rating
- **Endpoint**: `GET /api/reviews/<int:product_id>`
- **Response** (`200 OK`):
```json
{
  "average_rating": 4.8,
  "total_reviews": 12,
  "reviews": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "Sanket Amte",
      "rating": 5,
      "review_text": "Excellent quality!",
      "created_at": "2026-07-25T18:45:00"
    }
  ]
}
```

### 6.2 Submit Product Review
- **Endpoint**: `POST /api/reviews/add`
- **Request Body**:
```json
{
  "user_id": 1,
  "product_id": 5,
  "rating": 5,
  "review_text": "Top notch sound quality."
}
```

---

## 📊 7. Admin Portal APIs

### 7.1 Fetch All Orders (Admin)
- **Endpoint**: `GET /api/admin/orders`

### 7.2 Update Order Status (Admin)
- **Endpoint**: `PUT /api/admin/orders/<int:order_id>`
- **Request Body**:
```json
{
  "status": "Delivered"
}
```

### 7.3 Fetch All Reviews (Admin)
- **Endpoint**: `GET /api/admin/reviews`
