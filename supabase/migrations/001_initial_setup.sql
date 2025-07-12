-- Migration: 001_initial_setup.sql
-- Description: Initial database setup for POS System
-- Created: 2024-01-01
-- Author: POS System Setup

-- This migration sets up the complete database schema for the POS system
-- including tables, indexes, triggers, policies, and initial data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Migration metadata
CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version TEXT PRIMARY KEY,
    description TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    execution_time_ms INTEGER,
    checksum TEXT
);

-- Record this migration
INSERT INTO public.schema_migrations (version, description) 
VALUES ('001', 'Initial database setup for POS System')
ON CONFLICT (version) DO NOTHING;

-- Note: The actual schema, policies, and seed data are in separate files
-- This migration file serves as a template for future database changes

-- Example of how to structure future migrations:
/*

-- Migration: 002_add_customer_table.sql
-- Description: Add customer management functionality
-- Created: 2024-02-01

BEGIN;

-- Add new table
CREATE TABLE public.customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address JSONB,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_phone ON public.customers(phone);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Authenticated users can view customers" ON public.customers
    FOR SELECT USING (public.is_authenticated_user());

CREATE POLICY "Managers can manage customers" ON public.customers
    FOR ALL USING (public.is_manager_or_admin());

-- Add foreign key to transactions
ALTER TABLE public.transactions 
ADD COLUMN customer_id UUID REFERENCES public.customers(id);

-- Update trigger
CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON public.customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Record migration
INSERT INTO public.schema_migrations (version, description) 
VALUES ('002', 'Add customer management functionality');

COMMIT;

*/

-- Migration best practices:
-- 1. Always use transactions (BEGIN/COMMIT)
-- 2. Include rollback instructions in comments
-- 3. Test migrations on a copy of production data
-- 4. Keep migrations small and focused
-- 5. Include proper indexing for new columns
-- 6. Update RLS policies for new tables
-- 7. Record the migration in schema_migrations table

-- Rollback instructions for this migration:
/*
To rollback this migration, you would need to:
1. Drop all tables in reverse dependency order
2. Drop all functions and triggers
3. Remove the migration record

WARNING: This will delete all data!

DROP TABLE IF EXISTS public.transaction_items CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.inventory_movements CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.discounts CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.schema_migrations CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.generate_transaction_number() CASCADE;
DROP FUNCTION IF EXISTS public.set_transaction_number() CASCADE;
DROP FUNCTION IF EXISTS public.update_product_stock() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_manager_or_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_authenticated_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_low_stock_products() CASCADE;
DROP FUNCTION IF EXISTS public.get_sales_analytics(TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) CASCADE;

-- Drop views
DROP VIEW IF EXISTS public.product_sales_summary CASCADE;
DROP VIEW IF EXISTS public.daily_sales_summary CASCADE;

-- Drop types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;

DELETE FROM public.schema_migrations WHERE version = '001';
*/