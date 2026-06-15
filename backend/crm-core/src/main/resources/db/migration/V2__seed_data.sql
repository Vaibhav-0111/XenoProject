-- ============================================================
-- Seed data for local development / demos
-- ============================================================

INSERT INTO customers (name, email, phone, city, gender, age, total_spend, last_order_date) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', '+919810000001', 'Delhi', 'MALE', 29, 12500.00, now() - interval '5 days'),
('Priya Verma', 'priya.verma@example.com', '+919810000002', 'Mumbai', 'FEMALE', 34, 8200.00, now() - interval '70 days'),
('Rohan Mehta', 'rohan.mehta@example.com', '+919810000003', 'Bengaluru', 'MALE', 41, 21000.00, now() - interval '12 days'),
('Sneha Iyer', 'sneha.iyer@example.com', '+919810000004', 'Chennai', 'FEMALE', 25, 3400.00, now() - interval '90 days'),
('Karan Malhotra', 'karan.malhotra@example.com', '+919810000005', 'Delhi', 'MALE', 37, 15600.00, now() - interval '3 days'),
('Ananya Gupta', 'ananya.gupta@example.com', '+919810000006', 'Pune', 'FEMALE', 30, 6700.00, now() - interval '65 days'),
('Vikram Rao', 'vikram.rao@example.com', '+919810000007', 'Hyderabad', 'MALE', 45, 28900.00, now() - interval '20 days'),
('Ishita Singh', 'ishita.singh@example.com', '+919810000008', 'Kolkata', 'FEMALE', 27, 4100.00, now() - interval '100 days'),
('Aditya Nair', 'aditya.nair@example.com', '+919810000009', 'Chennai', 'MALE', 33, 9900.00, now() - interval '8 days'),
('Meera Joshi', 'meera.joshi@example.com', '+919810000010', 'Mumbai', 'FEMALE', 39, 17800.00, now() - interval '45 days');

INSERT INTO orders (customer_id, amount, status, order_date)
SELECT id, total_spend * 0.6, 'COMPLETED', last_order_date - interval '30 days' FROM customers;

INSERT INTO orders (customer_id, amount, status, order_date)
SELECT id, total_spend * 0.4, 'COMPLETED', last_order_date FROM customers;
