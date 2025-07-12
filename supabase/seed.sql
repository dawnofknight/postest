-- Seed Data for POS System
-- This file contains initial data to populate the database

-- Insert default categories
INSERT INTO public.categories (id, name, description, icon, color, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Electronics', 'Electronic devices and accessories', '📱', '#3B82F6', 1),
    ('550e8400-e29b-41d4-a716-446655440002', 'Clothing', 'Apparel and fashion items', '👕', '#10B981', 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'Food & Beverages', 'Food items and drinks', '🍔', '#F59E0B', 3),
    ('550e8400-e29b-41d4-a716-446655440004', 'Books', 'Books and educational materials', '📚', '#8B5CF6', 4),
    ('550e8400-e29b-41d4-a716-446655440005', 'Home & Garden', 'Home improvement and garden supplies', '🏠', '#06B6D4', 5),
    ('550e8400-e29b-41d4-a716-446655440006', 'Sports', 'Sports equipment and accessories', '⚽', '#EF4444', 6),
    ('550e8400-e29b-41d4-a716-446655440007', 'Beauty', 'Beauty and personal care products', '💄', '#EC4899', 7),
    ('550e8400-e29b-41d4-a716-446655440008', 'Toys', 'Toys and games for children', '🧸', '#F97316', 8)
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (id, name, description, price, cost, sku, category_id, image_url, stock_quantity, min_stock_level, is_featured, tags) VALUES
    -- Electronics
    ('650e8400-e29b-41d4-a716-446655440001', 'iPhone 15 Pro', 'Latest Apple smartphone with advanced features', 999.99, 750.00, 'IPH15PRO', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 25, 5, true, ARRAY['smartphone', 'apple', 'premium']),
    ('650e8400-e29b-41d4-a716-446655440002', 'Samsung Galaxy S24', 'High-performance Android smartphone', 849.99, 650.00, 'SGS24', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 30, 5, true, ARRAY['smartphone', 'samsung', 'android']),
    ('650e8400-e29b-41d4-a716-446655440003', 'MacBook Air M3', 'Lightweight laptop with M3 chip', 1299.99, 1000.00, 'MBA-M3', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 15, 3, true, ARRAY['laptop', 'apple', 'portable']),
    ('650e8400-e29b-41d4-a716-446655440004', 'AirPods Pro', 'Wireless earbuds with noise cancellation', 249.99, 180.00, 'APP-2ND', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 50, 10, false, ARRAY['earbuds', 'wireless', 'apple']),
    ('650e8400-e29b-41d4-a716-446655440005', 'iPad Air', 'Versatile tablet for work and entertainment', 599.99, 450.00, 'IPAD-AIR', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 20, 5, false, ARRAY['tablet', 'apple', 'productivity']),
    
    -- Clothing
    ('650e8400-e29b-41d4-a716-446655440006', 'Classic White T-Shirt', 'Comfortable cotton t-shirt', 19.99, 8.00, 'TEE-WHT-M', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 100, 20, false, ARRAY['t-shirt', 'cotton', 'casual']),
    ('650e8400-e29b-41d4-a716-446655440007', 'Denim Jeans', 'Classic blue denim jeans', 79.99, 35.00, 'JEAN-BLU-32', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 75, 15, true, ARRAY['jeans', 'denim', 'casual']),
    ('650e8400-e29b-41d4-a716-446655440008', 'Running Shoes', 'Comfortable athletic shoes for running', 129.99, 65.00, 'SHOE-RUN-9', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 40, 8, true, ARRAY['shoes', 'athletic', 'running']),
    ('650e8400-e29b-41d4-a716-446655440009', 'Winter Jacket', 'Warm winter jacket with hood', 199.99, 90.00, 'JAC-WIN-L', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 25, 5, false, ARRAY['jacket', 'winter', 'warm']),
    
    -- Food & Beverages
    ('650e8400-e29b-41d4-a716-446655440010', 'Organic Coffee Beans', 'Premium organic coffee beans', 24.99, 12.00, 'COF-ORG-1LB', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 60, 12, true, ARRAY['coffee', 'organic', 'premium']),
    ('650e8400-e29b-41d4-a716-446655440011', 'Green Tea', 'Healthy green tea bags', 12.99, 6.00, 'TEA-GRN-20', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 80, 15, false, ARRAY['tea', 'green', 'healthy']),
    ('650e8400-e29b-41d4-a716-446655440012', 'Dark Chocolate', 'Premium dark chocolate bar', 8.99, 4.00, 'CHOC-DRK-100G', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400', 120, 25, false, ARRAY['chocolate', 'dark', 'premium']),
    
    -- Books
    ('650e8400-e29b-41d4-a716-446655440013', 'JavaScript: The Good Parts', 'Essential JavaScript programming guide', 34.99, 20.00, 'BOOK-JS-GP', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 45, 10, true, ARRAY['book', 'programming', 'javascript']),
    ('650e8400-e29b-41d4-a716-446655440014', 'Clean Code', 'A handbook of agile software craftsmanship', 42.99, 25.00, 'BOOK-CC', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 30, 8, true, ARRAY['book', 'programming', 'software']),
    
    -- Home & Garden
    ('650e8400-e29b-41d4-a716-446655440015', 'Indoor Plant Pot', 'Decorative ceramic plant pot', 29.99, 15.00, 'POT-CER-MED', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', 35, 8, false, ARRAY['pot', 'ceramic', 'indoor']),
    ('650e8400-e29b-41d4-a716-446655440016', 'LED Desk Lamp', 'Adjustable LED desk lamp', 59.99, 30.00, 'LAMP-LED-DSK', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', 25, 5, false, ARRAY['lamp', 'led', 'desk']),
    
    -- Sports
    ('650e8400-e29b-41d4-a716-446655440017', 'Yoga Mat', 'Non-slip exercise yoga mat', 39.99, 18.00, 'YOG-MAT-6MM', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 50, 10, true, ARRAY['yoga', 'exercise', 'mat']),
    ('650e8400-e29b-41d4-a716-446655440018', 'Basketball', 'Official size basketball', 24.99, 12.00, 'BALL-BASK', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400', 30, 8, false, ARRAY['basketball', 'sports', 'ball']),
    
    -- Beauty
    ('650e8400-e29b-41d4-a716-446655440019', 'Face Moisturizer', 'Hydrating face moisturizer', 32.99, 16.00, 'MOIST-FACE', '550e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 40, 10, false, ARRAY['moisturizer', 'skincare', 'face']),
    ('650e8400-e29b-41d4-a716-446655440020', 'Lipstick Set', 'Set of 5 premium lipsticks', 49.99, 25.00, 'LIP-SET-5', '550e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 20, 5, true, ARRAY['lipstick', 'makeup', 'set']),
    
    -- Toys
    ('650e8400-e29b-41d4-a716-446655440021', 'LEGO Building Set', 'Creative building blocks set', 79.99, 40.00, 'LEGO-CITY', '550e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 15, 3, true, ARRAY['lego', 'building', 'creative']),
    ('650e8400-e29b-41d4-a716-446655440022', 'Teddy Bear', 'Soft and cuddly teddy bear', 19.99, 8.00, 'BEAR-TED-MED', '550e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400', 25, 5, false, ARRAY['teddy', 'bear', 'soft'])
ON CONFLICT (id) DO NOTHING;

-- Insert system settings
INSERT INTO public.settings (key, value, description, is_public) VALUES
    ('tax_rate', '0.08', 'Default tax rate (8%)', true),
    ('currency', '{"code": "USD", "symbol": "$", "name": "US Dollar"}', 'Default currency settings', true),
    ('store_info', '{
        "name": "Modern POS Store",
        "address": "123 Main Street, City, State 12345",
        "phone": "+1 (555) 123-4567",
        "email": "info@modernpos.com",
        "website": "https://modernpos.com"
    }', 'Store information', true),
    ('receipt_settings', '{
        "show_logo": true,
        "show_store_info": true,
        "show_tax_breakdown": true,
        "footer_message": "Thank you for your business!",
        "return_policy": "Returns accepted within 30 days with receipt."
    }', 'Receipt printing settings', false),
    ('low_stock_threshold', '10', 'Default low stock alert threshold', false),
    ('auto_backup', '{"enabled": true, "frequency": "daily", "time": "02:00"}', 'Automatic backup settings', false),
    ('payment_methods', '[
        {"id": "cash", "name": "Cash", "enabled": true},
        {"id": "card", "name": "Credit/Debit Card", "enabled": true},
        {"id": "digital_wallet", "name": "Digital Wallet", "enabled": true},
        {"id": "bank_transfer", "name": "Bank Transfer", "enabled": false}
    ]', 'Available payment methods', true),
    ('business_hours', '{
        "monday": {"open": "09:00", "close": "18:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "18:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "18:00", "closed": false},
        "thursday": {"open": "09:00", "close": "18:00", "closed": false},
        "friday": {"open": "09:00", "close": "20:00", "closed": false},
        "saturday": {"open": "10:00", "close": "20:00", "closed": false},
        "sunday": {"open": "12:00", "close": "17:00", "closed": false}
    }', 'Business operating hours', true),
    ('inventory_alerts', '{"low_stock": true, "out_of_stock": true, "email_notifications": true}', 'Inventory alert settings', false),
    ('discount_settings', '{
        "max_discount_percent": 50,
        "require_manager_approval": true,
        "allow_stacking": false
    }', 'Discount policy settings', false)
ON CONFLICT (key) DO NOTHING;

-- Insert sample discounts
INSERT INTO public.discounts (id, name, description, type, value, min_purchase_amount, applicable_to, start_date, end_date, usage_limit, is_active) VALUES
    ('750e8400-e29b-41d4-a716-446655440001', 'New Customer 10%', '10% discount for new customers', 'percentage', 10.00, 50.00, 'all', NOW(), NOW() + INTERVAL '30 days', 100, true),
    ('750e8400-e29b-41d4-a716-446655440002', 'Electronics Sale', '$50 off electronics over $500', 'fixed_amount', 50.00, 500.00, 'category', NOW(), NOW() + INTERVAL '14 days', NULL, true),
    ('750e8400-e29b-41d4-a716-446655440003', 'Student Discount', '15% discount for students', 'percentage', 15.00, 0.00, 'all', NOW(), NOW() + INTERVAL '365 days', NULL, true),
    ('750e8400-e29b-41d4-a716-446655440004', 'Holiday Special', '20% off clothing items', 'percentage', 20.00, 100.00, 'category', NOW(), NOW() + INTERVAL '7 days', 50, true)
ON CONFLICT (id) DO NOTHING;

-- Update discount applicable_ids for category-specific discounts
UPDATE public.discounts 
SET applicable_ids = ARRAY['550e8400-e29b-41d4-a716-446655440001'::UUID] 
WHERE id = '750e8400-e29b-41d4-a716-446655440002'; -- Electronics

UPDATE public.discounts 
SET applicable_ids = ARRAY['550e8400-e29b-41d4-a716-446655440002'::UUID] 
WHERE id = '750e8400-e29b-41d4-a716-446655440004'; -- Clothing

-- Create a sample admin user profile (this will be created when a user signs up)
-- The actual user creation happens through Supabase Auth
-- This is just a placeholder to show the expected structure

-- Insert sample transaction for demonstration (optional)
-- Note: In production, transactions should only be created through the application
INSERT INTO public.transactions (
    id, 
    transaction_number, 
    customer_name, 
    customer_email, 
    subtotal, 
    tax_amount, 
    total_amount, 
    payment_method, 
    amount_paid, 
    change_amount, 
    status,
    notes
) VALUES (
    '850e8400-e29b-41d4-a716-446655440001',
    'TXN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-0001',
    'John Doe',
    'john.doe@example.com',
    999.99,
    80.00,
    1079.99,
    'card',
    1079.99,
    0.00,
    'completed',
    'Sample transaction for testing'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample transaction items
INSERT INTO public.transaction_items (
    transaction_id,
    product_id,
    product_name,
    product_sku,
    quantity,
    unit_price,
    total_price
) VALUES (
    '850e8400-e29b-41d4-a716-446655440001',
    '650e8400-e29b-41d4-a716-446655440001',
    'iPhone 15 Pro',
    'IPH15PRO',
    1,
    999.99,
    999.99
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_transactions_total ON public.transactions(total_amount);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_method ON public.transactions(payment_method);
CREATE INDEX IF NOT EXISTS idx_transaction_items_quantity ON public.transaction_items(quantity);
CREATE INDEX IF NOT EXISTS idx_transaction_items_price ON public.transaction_items(unit_price);

-- Create a view for product sales summary
CREATE OR REPLACE VIEW public.product_sales_summary AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.price,
    p.stock_quantity,
    COALESCE(SUM(ti.quantity), 0) as total_sold,
    COALESCE(SUM(ti.total_price), 0) as total_revenue,
    COALESCE(COUNT(DISTINCT ti.transaction_id), 0) as transaction_count
FROM public.products p
LEFT JOIN public.transaction_items ti ON p.id = ti.product_id
LEFT JOIN public.transactions t ON ti.transaction_id = t.id AND t.status = 'completed'
WHERE p.is_active = true
GROUP BY p.id, p.name, p.sku, p.price, p.stock_quantity;

-- Create a view for daily sales summary
CREATE OR REPLACE VIEW public.daily_sales_summary AS
SELECT 
    DATE(created_at) as sale_date,
    COUNT(*) as transaction_count,
    SUM(subtotal) as total_subtotal,
    SUM(tax_amount) as total_tax,
    SUM(total_amount) as total_sales,
    AVG(total_amount) as avg_transaction_value,
    COUNT(DISTINCT cashier_id) as active_cashiers
FROM public.transactions
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

-- Grant permissions on views
GRANT SELECT ON public.product_sales_summary TO authenticated;
GRANT SELECT ON public.daily_sales_summary TO authenticated;

-- Create RLS policies for views
CREATE POLICY "Managers can view product sales summary" ON public.product_sales_summary
    FOR SELECT USING (public.is_manager_or_admin());

CREATE POLICY "Managers can view daily sales summary" ON public.daily_sales_summary
    FOR SELECT USING (public.is_manager_or_admin());

-- Enable RLS on views
ALTER VIEW public.product_sales_summary SET (security_barrier = true);
ALTER VIEW public.daily_sales_summary SET (security_barrier = true);

-- Final message
SELECT 'Database seeded successfully! You can now start using the POS system.' as message;