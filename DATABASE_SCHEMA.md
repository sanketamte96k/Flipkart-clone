# 🗄️ Database Schema & ERD Documentation

The **Flipkart Clone** application uses a MySQL 8.0 relational database managed via **Flask-SQLAlchemy ORM**.

---

## 📐 Entity Relationship Diagram (ERD)

```
 +------------------+           +------------------+
 |      users       |           |     products     |
 +------------------+           +------------------+
 | id (PK)          |<---+     +| id (PK)          |
 | name             |    |     || name             |
 | email (UNIQUE)   |    |     || category         |
 | password         |    |     || price            |
 | role             |    |     || stock            |
 +------------------+    |     || image            |
       ^   ^   ^         |     || description      |
       |   |   |         |     +------------------+
       |   |   |         |       ^   ^   ^   ^
       |   |   +---------|-------|---|---|---+
       |   |             |       |   |   |   |
       |   +-------------|-------|---|---+   |
       |                 |       |   |       |
 +-----+------------+    | +-----+---|----+  |
 |       cart       |    | |    wishlist  |  |
 +------------------+    | +--------------+  |
 | id (PK)          |    | | id (PK)      |  |
 | user_id (FK)-----+    | | user_id (FK)-+  |
 | product_id (FK)-------+ | product_id(FK)--+
 | quantity         |      +--------------+
 | created_at       |
 +------------------+

 +------------------+      +--------------------+
 |      orders      |      |     order_items    |
 +------------------+      +--------------------+
 | id (PK)          |<-----+ order_id (FK)      |
 | user_id (FK)-----+      | product_id (FK)----+
 | total_amount     |      | quantity           |
 | status           |      | price              |
 | payment_status   |      +--------------------+
 | payment_method   |
 | shipping_address |
 | created_at       |
 +------------------+

 +------------------+
 |     reviews      |
 +------------------+
 | id (PK)          |
 | user_id (FK)-----+
 | product_id (FK)--+
 | rating           |
 | review_text      |
 | created_at       |
 +------------------+
```

---

## 📋 Table Definitions

### 1. `users`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique user identifier |
| `name` | `VARCHAR(100)` | `NOT NULL` | Customer or Admin full name |
| `email` | `VARCHAR(120)` | `UNIQUE`, `NOT NULL` | User email address |
| `password` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed password string |
| `role` | `VARCHAR(20)` | `DEFAULT 'customer'` | User role (`customer` or `admin`) |

---

### 2. `products`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique product identifier |
| `name` | `VARCHAR(255)` | `NOT NULL` | Product title |
| `category` | `VARCHAR(100)` | `NOT NULL` | Product category |
| `price` | `INT` | `NOT NULL` | Product price in INR |
| `stock` | `INT` | `NOT NULL` | Available inventory quantity |
| `image` | `TEXT` | `NULLABLE` | Image URL |
| `description` | `TEXT` | `NULLABLE` | Detailed description text |

---

### 3. `cart`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Cart item identifier |
| `user_id` | `INT` | `FOREIGN KEY (users.id)` | Owner user ID |
| `product_id` | `INT` | `FOREIGN KEY (products.id)` | Selected product ID |
| `quantity` | `INT` | `DEFAULT 1` | Cart item quantity |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Addition timestamp |

---

### 4. `wishlist`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Wishlist item identifier |
| `user_id` | `INT` | `FOREIGN KEY (users.id)` | Owner user ID |
| `product_id` | `INT` | `FOREIGN KEY (products.id)` | Wishlisted product ID |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Addition timestamp |

**Unique Constraint**: `UNIQUE KEY (user_id, product_id)` to prevent duplicate wishlist additions per user.

---

### 5. `orders` & `order_items`
`orders`:
- `id` (PK), `user_id` (FK), `total_amount`, `status`, `payment_status`, `payment_method`, `shipping_address`, `created_at`.

`order_items`:
- `id` (PK), `order_id` (FK), `product_id` (FK), `quantity`, `price`.

---

### 6. `reviews`
- `id` (PK), `user_id` (FK), `product_id` (FK), `rating`, `review_text`, `created_at`.
- **Unique Constraint**: `UNIQUE KEY (user_id, product_id)` to enforce 1 review per product per customer.
