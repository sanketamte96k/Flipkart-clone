import pytest
import os
import sys

# Add backend directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app import app, db, User, Product, Cart, Order, OrderItem, Wishlist, Review

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['WTF_CSRF_ENABLED'] = False

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            
            # Seed test products
            p1 = Product(name="Test Phone", category="Mobile", price=15000, stock=10, image="test.jpg", description="Test phone")
            p2 = Product(name="Test Laptop", category="Laptop", price=55000, stock=5, image="laptop.jpg", description="Test laptop")
            db.session.add_all([p1, p2])
            db.session.commit()
            
            yield client
            
            db.session.remove()
            db.drop_all()

def test_registration_and_login(client):
    # 1. Register User
    reg_res = client.post('/api/register', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    assert reg_res.status_code == 201
    assert reg_res.get_json()['success'] == True

    # 2. Login User
    login_res = client.post('/api/login', json={
        "email": "testuser@example.com",
        "password": "password123"
    })
    assert login_res.status_code == 200
    login_data = login_res.get_json()
    assert login_data['success'] == True
    assert login_data['user']['email'] == "testuser@example.com"

def test_products_list_api(client):
    res = client.get('/api/products')
    assert res.status_code == 200
    products = res.get_json()
    assert len(products) >= 2
    assert products[0]['name'] == "Test Phone"

def test_shopping_cart_workflow(client):
    # Register & Login
    client.post('/api/register', json={"name": "Cart User", "email": "cart@example.com", "password": "password123"})
    login_res = client.post('/api/login', json={"email": "cart@example.com", "password": "password123"})
    user_id = login_res.get_json()['user']['id']

    # Add item to cart
    cart_add_res = client.post('/api/cart/add', json={"user_id": user_id, "product_id": 1, "quantity": 2})
    assert cart_add_res.status_code == 200

    # Fetch Cart
    get_cart_res = client.get(f'/api/cart/{user_id}')
    assert get_cart_res.status_code == 200
    cart_items = get_cart_res.get_json()
    assert len(cart_items) == 1
    assert cart_items[0]['quantity'] == 2

def test_wishlist_workflow(client):
    # Register & Login
    client.post('/api/register', json={"name": "Wish User", "email": "wish@example.com", "password": "password123"})
    login_res = client.post('/api/login', json={"email": "wish@example.com", "password": "password123"})
    user_id = login_res.get_json()['user']['id']

    # Add to wishlist
    add_res = client.post('/api/wishlist/add', json={"user_id": user_id, "product_id": 1})
    assert add_res.status_code == 200

    # Duplicate add check
    dup_res = client.post('/api/wishlist/add', json={"user_id": user_id, "product_id": 1})
    assert dup_res.get_json()['success'] == False

    # Get wishlist
    get_res = client.get(f'/api/wishlist/{user_id}')
    assert get_res.status_code == 200
    items = get_res.get_json()
    assert len(items) == 1

def test_order_placement_workflow(client):
    # Register & Login
    client.post('/api/register', json={"name": "Order User", "email": "order@example.com", "password": "password123"})
    login_res = client.post('/api/login', json={"email": "order@example.com", "password": "password123"})
    user_id = login_res.get_json()['user']['id']

    # Add item to cart first
    client.post('/api/cart/add', json={"user_id": user_id, "product_id": 1, "quantity": 1})

    # Place order
    place_res = client.post('/api/orders/place', json={
        "user_id": user_id,
        "payment_method": "COD",
        "shipping_address": "123 Tech Street, Silicon Valley"
    })
    assert place_res.status_code == 200
    assert place_res.get_json()['success'] == True

    # Check orders list
    orders_res = client.get(f'/api/orders/{user_id}')
    assert orders_res.status_code == 200
    orders = orders_res.get_json()
    assert len(orders) == 1
    assert orders[0]['shipping_address'] == "123 Tech Street, Silicon Valley"
