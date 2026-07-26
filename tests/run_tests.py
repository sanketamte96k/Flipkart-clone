import unittest
import os
import sys
import json

# Add backend directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app import app, db, User, Product, Cart, Order, OrderItem, Wishlist, Review

class FlipkartCloneTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()

        with app.app_context():
            db.create_all()
            p1 = Product(name="Test Phone", category="Mobile", price=15000, stock=10, image="test.jpg", description="Test phone")
            p2 = Product(name="Test Laptop", category="Laptop", price=55000, stock=5, image="laptop.jpg", description="Test laptop")
            db.session.add_all([p1, p2])
            db.session.commit()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_1_registration_and_login(self):
        # Register User
        reg_res = self.client.post('/api/register', json={
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "password123"
        })
        self.assertEqual(reg_res.status_code, 201)
        self.assertTrue(reg_res.get_json()['success'])

        # Login User
        login_res = self.client.post('/api/login', json={
            "email": "testuser@example.com",
            "password": "password123"
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.get_json()
        self.assertTrue(login_data['success'])
        self.assertEqual(login_data['user']['email'], "testuser@example.com")

    def test_2_products_list_api(self):
        res = self.client.get('/api/products')
        self.assertEqual(res.status_code, 200)
        products = res.get_json()
        self.assertGreaterEqual(len(products), 2)
        self.assertEqual(products[0]['name'], "Test Phone")

    def test_3_shopping_cart_workflow(self):
        self.client.post('/api/register', json={"name": "Cart User", "email": "cart@example.com", "password": "password123"})
        login_res = self.client.post('/api/login', json={"email": "cart@example.com", "password": "password123"})
        user_id = login_res.get_json()['user']['id']

        cart_add_res = self.client.post('/api/cart/add', json={"user_id": user_id, "product_id": 1, "quantity": 2})
        self.assertEqual(cart_add_res.status_code, 200)

        get_cart_res = self.client.get(f'/api/cart/{user_id}')
        self.assertEqual(get_cart_res.status_code, 200)
        cart_items = get_cart_res.get_json()
        self.assertEqual(len(cart_items), 1)
        self.assertEqual(cart_items[0]['quantity'], 2)

    def test_4_wishlist_workflow(self):
        self.client.post('/api/register', json={"name": "Wish User", "email": "wish@example.com", "password": "password123"})
        login_res = self.client.post('/api/login', json={"email": "wish@example.com", "password": "password123"})
        user_id = login_res.get_json()['user']['id']

        add_res = self.client.post('/api/wishlist/add', json={"user_id": user_id, "product_id": 1})
        self.assertEqual(add_res.status_code, 200)

        dup_res = self.client.post('/api/wishlist/add', json={"user_id": user_id, "product_id": 1})
        self.assertFalse(dup_res.get_json()['success'])

        get_res = self.client.get(f'/api/wishlist/{user_id}')
        self.assertEqual(get_res.status_code, 200)
        items = get_res.get_json()
        self.assertEqual(len(items), 1)

    def test_5_order_placement_workflow(self):
        self.client.post('/api/register', json={"name": "Order User", "email": "order@example.com", "password": "password123"})
        login_res = self.client.post('/api/login', json={"email": "order@example.com", "password": "password123"})
        user_id = login_res.get_json()['user']['id']

        self.client.post('/api/cart/add', json={"user_id": user_id, "product_id": 1, "quantity": 1})

        place_res = self.client.post('/api/orders/place', json={
            "user_id": user_id,
            "payment_method": "COD",
            "shipping_address": "123 Tech Street, Silicon Valley"
        })
        self.assertEqual(place_res.status_code, 200)
        self.assertTrue(place_res.get_json()['success'])

        orders_res = self.client.get(f'/api/orders/{user_id}')
        self.assertEqual(orders_res.status_code, 200)
        orders = orders_res.get_json()
        self.assertEqual(len(orders), 1)
        self.assertEqual(orders[0]['shipping_address'], "123 Tech Street, Silicon Valley")

if __name__ == '__main__':
    unittest.main()
