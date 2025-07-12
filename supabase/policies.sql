-- Row Level Security (RLS) Policies for POS System
-- This file contains all security policies to control data access

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = 'admin' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is manager or admin
CREATE OR REPLACE FUNCTION public.is_manager_or_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role IN ('admin', 'manager') AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is authenticated and active
CREATE OR REPLACE FUNCTION public.is_authenticated_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES TABLE POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

-- Admins can insert new profiles
CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (public.is_admin());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON public.profiles
    FOR UPDATE USING (public.is_admin());

-- Managers can view profiles of cashiers
CREATE POLICY "Managers can view cashier profiles" ON public.profiles
    FOR SELECT USING (
        public.is_manager_or_admin() AND 
        (role = 'cashier' OR auth.uid() = id)
    );

-- CATEGORIES TABLE POLICIES
-- All authenticated users can view active categories
CREATE POLICY "Authenticated users can view active categories" ON public.categories
    FOR SELECT USING (public.is_authenticated_user() AND is_active = true);

-- Managers and admins can view all categories
CREATE POLICY "Managers can view all categories" ON public.categories
    FOR SELECT USING (public.is_manager_or_admin());

-- Managers and admins can insert categories
CREATE POLICY "Managers can insert categories" ON public.categories
    FOR INSERT WITH CHECK (public.is_manager_or_admin());

-- Managers and admins can update categories
CREATE POLICY "Managers can update categories" ON public.categories
    FOR UPDATE USING (public.is_manager_or_admin());

-- Only admins can delete categories
CREATE POLICY "Admins can delete categories" ON public.categories
    FOR DELETE USING (public.is_admin());

-- PRODUCTS TABLE POLICIES
-- All authenticated users can view active products
CREATE POLICY "Authenticated users can view active products" ON public.products
    FOR SELECT USING (public.is_authenticated_user() AND is_active = true);

-- Managers and admins can view all products
CREATE POLICY "Managers can view all products" ON public.products
    FOR SELECT USING (public.is_manager_or_admin());

-- Managers and admins can insert products
CREATE POLICY "Managers can insert products" ON public.products
    FOR INSERT WITH CHECK (public.is_manager_or_admin());

-- Managers and admins can update products
CREATE POLICY "Managers can update products" ON public.products
    FOR UPDATE USING (public.is_manager_or_admin());

-- Only admins can delete products
CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (public.is_admin());

-- TRANSACTIONS TABLE POLICIES
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (cashier_id = auth.uid());

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (
        public.is_authenticated_user() AND 
        (cashier_id = auth.uid() OR cashier_id IS NULL)
    );

-- Users can update their own pending transactions
CREATE POLICY "Users can update own pending transactions" ON public.transactions
    FOR UPDATE USING (
        cashier_id = auth.uid() AND 
        status = 'pending'
    );

-- Managers and admins can view all transactions
CREATE POLICY "Managers can view all transactions" ON public.transactions
    FOR SELECT USING (public.is_manager_or_admin());

-- Managers and admins can update any transaction
CREATE POLICY "Managers can update any transaction" ON public.transactions
    FOR UPDATE USING (public.is_manager_or_admin());

-- Only admins can delete transactions
CREATE POLICY "Admins can delete transactions" ON public.transactions
    FOR DELETE USING (public.is_admin());

-- TRANSACTION ITEMS TABLE POLICIES
-- Users can view items of their own transactions
CREATE POLICY "Users can view own transaction items" ON public.transaction_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.transactions 
            WHERE id = transaction_id AND cashier_id = auth.uid()
        )
    );

-- Users can insert items to their own transactions
CREATE POLICY "Users can insert own transaction items" ON public.transaction_items
    FOR INSERT WITH CHECK (
        public.is_authenticated_user() AND
        EXISTS (
            SELECT 1 FROM public.transactions 
            WHERE id = transaction_id AND 
            (cashier_id = auth.uid() OR cashier_id IS NULL) AND
            status = 'pending'
        )
    );

-- Users can update items of their own pending transactions
CREATE POLICY "Users can update own transaction items" ON public.transaction_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.transactions 
            WHERE id = transaction_id AND 
            cashier_id = auth.uid() AND 
            status = 'pending'
        )
    );

-- Users can delete items from their own pending transactions
CREATE POLICY "Users can delete own transaction items" ON public.transaction_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.transactions 
            WHERE id = transaction_id AND 
            cashier_id = auth.uid() AND 
            status = 'pending'
        )
    );

-- Managers and admins can view all transaction items
CREATE POLICY "Managers can view all transaction items" ON public.transaction_items
    FOR SELECT USING (public.is_manager_or_admin());

-- Managers and admins can modify any transaction items
CREATE POLICY "Managers can modify any transaction items" ON public.transaction_items
    FOR ALL USING (public.is_manager_or_admin());

-- INVENTORY MOVEMENTS TABLE POLICIES
-- Users can view movements for products they've transacted
CREATE POLICY "Users can view related inventory movements" ON public.inventory_movements
    FOR SELECT USING (
        reference_type = 'transaction' AND
        EXISTS (
            SELECT 1 FROM public.transactions 
            WHERE id = reference_id AND cashier_id = auth.uid()
        )
    );

-- Managers and admins can view all inventory movements
CREATE POLICY "Managers can view all inventory movements" ON public.inventory_movements
    FOR SELECT USING (public.is_manager_or_admin());

-- Managers and admins can insert inventory movements
CREATE POLICY "Managers can insert inventory movements" ON public.inventory_movements
    FOR INSERT WITH CHECK (public.is_manager_or_admin());

-- Only admins can update or delete inventory movements
CREATE POLICY "Admins can modify inventory movements" ON public.inventory_movements
    FOR ALL USING (public.is_admin());

-- DISCOUNTS TABLE POLICIES
-- All authenticated users can view active discounts
CREATE POLICY "Authenticated users can view active discounts" ON public.discounts
    FOR SELECT USING (
        public.is_authenticated_user() AND 
        is_active = true AND 
        (start_date IS NULL OR start_date <= NOW()) AND
        (end_date IS NULL OR end_date >= NOW())
    );

-- Managers and admins can view all discounts
CREATE POLICY "Managers can view all discounts" ON public.discounts
    FOR SELECT USING (public.is_manager_or_admin());

-- Managers and admins can insert discounts
CREATE POLICY "Managers can insert discounts" ON public.discounts
    FOR INSERT WITH CHECK (public.is_manager_or_admin());

-- Managers and admins can update discounts
CREATE POLICY "Managers can update discounts" ON public.discounts
    FOR UPDATE USING (public.is_manager_or_admin());

-- Only admins can delete discounts
CREATE POLICY "Admins can delete discounts" ON public.discounts
    FOR DELETE USING (public.is_admin());

-- SETTINGS TABLE POLICIES
-- All authenticated users can view public settings
CREATE POLICY "Authenticated users can view public settings" ON public.settings
    FOR SELECT USING (public.is_authenticated_user() AND is_public = true);

-- Managers and admins can view all settings
CREATE POLICY "Managers can view all settings" ON public.settings
    FOR SELECT USING (public.is_manager_or_admin());

-- Only admins can modify settings
CREATE POLICY "Admins can modify settings" ON public.settings
    FOR ALL USING (public.is_admin());

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to anon users (for public data only)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.settings TO anon;

-- Create policies for anon users to view public data
CREATE POLICY "Anonymous users can view active categories" ON public.categories
    FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous users can view active products" ON public.products
    FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous users can view public settings" ON public.settings
    FOR SELECT TO anon USING (is_public = true);

-- Create function to check low stock products
CREATE OR REPLACE FUNCTION public.get_low_stock_products()
RETURNS TABLE (
    id UUID,
    name TEXT,
    sku TEXT,
    current_stock INTEGER,
    min_stock_level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.name, p.sku, p.stock_quantity, p.min_stock_level
    FROM public.products p
    WHERE p.is_active = true 
    AND p.stock_quantity <= p.min_stock_level
    AND public.is_manager_or_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get sales analytics
CREATE OR REPLACE FUNCTION public.get_sales_analytics(
    start_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() - INTERVAL '30 days'),
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    total_sales DECIMAL,
    total_transactions INTEGER,
    avg_transaction_value DECIMAL,
    top_products JSONB
) AS $$
DECLARE
    result_total_sales DECIMAL;
    result_total_transactions INTEGER;
    result_avg_transaction_value DECIMAL;
    result_top_products JSONB;
BEGIN
    -- Check if user has permission
    IF NOT public.is_manager_or_admin() THEN
        RAISE EXCEPTION 'Access denied. Manager or admin role required.';
    END IF;
    
    -- Calculate total sales
    SELECT COALESCE(SUM(total_amount), 0) INTO result_total_sales
    FROM public.transactions
    WHERE created_at BETWEEN start_date AND end_date
    AND status = 'completed';
    
    -- Calculate total transactions
    SELECT COUNT(*) INTO result_total_transactions
    FROM public.transactions
    WHERE created_at BETWEEN start_date AND end_date
    AND status = 'completed';
    
    -- Calculate average transaction value
    result_avg_transaction_value := CASE 
        WHEN result_total_transactions > 0 THEN result_total_sales / result_total_transactions
        ELSE 0
    END;
    
    -- Get top products
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'product_name', ti.product_name,
            'total_quantity', SUM(ti.quantity),
            'total_revenue', SUM(ti.total_price)
        ) ORDER BY SUM(ti.total_price) DESC
    ), '[]'::jsonb) INTO result_top_products
    FROM public.transaction_items ti
    JOIN public.transactions t ON ti.transaction_id = t.id
    WHERE t.created_at BETWEEN start_date AND end_date
    AND t.status = 'completed'
    GROUP BY ti.product_name
    LIMIT 10;
    
    RETURN QUERY SELECT 
        result_total_sales,
        result_total_transactions,
        result_avg_transaction_value,
        result_top_products;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;