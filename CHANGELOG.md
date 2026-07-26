# 📜 Changelog - Flipkart Clone

All notable changes to the **Flipkart Clone** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-07-26
### Added
- **Global Loading Spinner**: Fixed overlay with glassmorphism backdrop and CSS animation ring.
- **Enhanced Toast System**: Support for `success`, `error`, `warning`, and `info` status notifications with icons.
- **Custom Error Pages**: Created brand-styled 404 (Page Not Found) and 500 (Internal Server Error) pages.
- **Skeleton Shimmer Loaders**: Integrated skeleton placeholder cards into product catalog, user orders list, and wishlist.
- **Product Catalog Pagination**: Added 8-item client-side pagination with Next/Prev and page number controls.
- **Image Fallbacks**: Implemented `loading="lazy"` and `onerror` fallback triggers across image assets.
- **DevOps Configuration**: Added Dockerfile, `docker-compose.yml`, and GitHub Actions CI workflow.
- **Automated Test Suite**: Added `tests/test_api.py` and `tests/run_tests.py` covering Auth, Products, Cart, Wishlist, and Orders.

### Changed
- **Environment Secrets**: Moved hardcoded configuration keys to `.env` using `python-dotenv`.
- **Structured Logging**: Replaced raw print statements with Python `logging` module.

---

## [1.1.0] - 2026-07-25
### Added
- **Customer Reviews & Ratings System**:
  - `Review` database model with `(user_id, product_id)` unique constraint.
  - APIs: `POST /api/reviews/add`, `GET /api/reviews/<product_id>`, `GET /api/reviews/check-eligible/<user_id>/<product_id>`, `PUT /api/reviews/<review_id>`, `DELETE /api/reviews/<review_id>`, `GET /api/admin/reviews`.
  - Frontend interactive 5-star rating selector and review form for verified buyers.
  - Admin Reviews moderation table with search, rating filter, and deletion actions.
- **Wishlist System**:
  - `Wishlist` model and API routes (`POST /api/wishlist/add`, `GET /api/wishlist/<user_id>`, `DELETE /api/wishlist/remove/<id>`).
  - Navbar live wishlist count badge (`#wishlist-count`).
  - Wishlist page with "Move to Cart" and "Remove" actions.

---

## [1.0.0] - 2026-07-20
### Added
- **Order Management & Checkout**:
  - `Order` and `OrderItem` models.
  - `POST /api/orders/place`, `GET /api/orders/<user_id>`, `GET /api/admin/orders`, `PUT /api/admin/orders/<id>`.
  - Order success confirmation page and customer order tracking list.
- **Shopping Cart System**:
  - `Cart` model and APIs (`GET /api/cart/<user_id>`, `POST /api/cart/add`, `PUT /api/cart/update/<id>`, `DELETE /api/cart/remove/<id>`).
- **User Authentication**:
  - Bcrypt password hashing and Flask user registration / login APIs.
  - Role-based authorization (`auth.js` guard for admin dashboard).
- **Admin Dashboard**:
  - Sales metrics, revenue counters, order status charts, and product CRUD management.
