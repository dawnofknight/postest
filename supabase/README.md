# Supabase Database Setup for POS System

This directory contains all the SQL files needed to set up your Supabase database for the Point of Sale (POS) system.

## 📁 Files Overview

- **`schema.sql`** - Complete database schema with tables, indexes, triggers, and functions
- **`policies.sql`** - Row Level Security (RLS) policies for data access control
- **`seed.sql`** - Sample data to populate the database for testing
- **`README.md`** - This deployment guide

## 🚀 Quick Deployment

### Option 1: Supabase Dashboard (Recommended)

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and enter project details
   - Wait for the project to be created

2. **Execute SQL files in order**
   - Go to your project dashboard
   - Navigate to "SQL Editor" in the sidebar
   - Execute the files in this exact order:

   ```sql
   -- 1. First, run schema.sql
   -- Copy and paste the entire content of schema.sql and execute
   
   -- 2. Then, run policies.sql
   -- Copy and paste the entire content of policies.sql and execute
   
   -- 3. Finally, run seed.sql (optional, for sample data)
   -- Copy and paste the entire content of seed.sql and execute
   ```

3. **Get your project credentials**
   - Go to "Settings" → "API"
   - Copy your `Project URL` and `anon public` key
   - Update your `.env` file with these credentials

### Option 2: Supabase CLI

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link to your project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Run migrations**
   ```bash
   # Execute schema
   supabase db reset
   
   # Or run individual files
   psql -h YOUR_DB_HOST -U postgres -d postgres -f schema.sql
   psql -h YOUR_DB_HOST -U postgres -d postgres -f policies.sql
   psql -h YOUR_DB_HOST -U postgres -d postgres -f seed.sql
   ```

## 📊 Database Schema Overview

### Core Tables

1. **`profiles`** - User profiles extending Supabase auth
   - Stores user roles (admin, manager, cashier)
   - Links to Supabase auth.users

2. **`categories`** - Product categories
   - Hierarchical organization of products
   - Customizable icons and colors

3. **`products`** - Product catalog
   - Complete product information
   - Stock management
   - Pricing and cost tracking

4. **`transactions`** - Sales transactions
   - Complete transaction records
   - Payment method tracking
   - Customer information

5. **`transaction_items`** - Individual items in transactions
   - Line-item details
   - Quantity and pricing

6. **`inventory_movements`** - Stock movement tracking
   - Automatic tracking of stock changes
   - Audit trail for inventory

7. **`discounts`** - Discount management
   - Flexible discount system
   - Category or product-specific

8. **`settings`** - System configuration
   - Store settings
   - Tax rates, currency, etc.

### Key Features

- **Automatic Stock Management**: Stock levels update automatically when transactions are completed
- **Transaction Numbering**: Auto-generated unique transaction numbers
- **Role-Based Access**: Different permissions for admin, manager, and cashier roles
- **Audit Trail**: Complete tracking of inventory movements
- **Flexible Discounts**: Support for percentage and fixed-amount discounts
- **Analytics Functions**: Built-in functions for sales analytics and reporting

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:

- **Cashiers** can only access their own transactions and view products
- **Managers** can view all data and manage products/categories
- **Admins** have full access to all data and system settings
- **Anonymous users** can only view public product information

### User Roles

- **`admin`** - Full system access, user management, settings
- **`manager`** - Product management, sales reports, inventory
- **`cashier`** - Process transactions, view products

## 🔧 Configuration

### Environment Variables

After deployment, update your `.env` file:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Initial Setup

1. **Create your first admin user**:
   - Sign up through your application
   - Manually update the user's role in the database:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```

2. **Configure store settings**:
   - Update the `settings` table with your store information
   - Modify tax rates, currency, and other preferences

## 📈 Sample Data

The `seed.sql` file includes:

- **8 product categories** (Electronics, Clothing, Food & Beverages, etc.)
- **22 sample products** with realistic pricing and stock levels
- **System settings** with default configurations
- **Sample discounts** for testing
- **One sample transaction** for demonstration

## 🔍 Useful Queries

### Check Low Stock Products
```sql
SELECT * FROM public.get_low_stock_products();
```

### Get Sales Analytics
```sql
SELECT * FROM public.get_sales_analytics(
    '2024-01-01'::timestamp,
    '2024-12-31'::timestamp
);
```

### View Daily Sales Summary
```sql
SELECT * FROM public.daily_sales_summary 
WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days';
```

### Product Sales Performance
```sql
SELECT * FROM public.product_sales_summary 
ORDER BY total_revenue DESC 
LIMIT 10;
```

## 🛠️ Maintenance

### Regular Tasks

1. **Monitor stock levels**:
   ```sql
   SELECT name, stock_quantity, min_stock_level 
   FROM products 
   WHERE stock_quantity <= min_stock_level;
   ```

2. **Clean old transactions** (if needed):
   ```sql
   -- Archive transactions older than 2 years
   DELETE FROM transactions 
   WHERE created_at < NOW() - INTERVAL '2 years' 
   AND status = 'completed';
   ```

3. **Update product costs** (bulk update):
   ```sql
   -- Example: Increase all costs by 5%
   UPDATE products 
   SET cost = cost * 1.05 
   WHERE is_active = true;
   ```

### Backup

Supabase automatically backs up your database, but you can also:

1. **Export data via Dashboard**:
   - Go to "Settings" → "Database"
   - Use the backup/restore features

2. **Use pg_dump** (for advanced users):
   ```bash
   pg_dump -h your-db-host -U postgres -d postgres > backup.sql
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Permission Denied Errors**:
   - Check if RLS policies are correctly applied
   - Verify user roles in the `profiles` table

2. **Foreign Key Violations**:
   - Ensure referenced records exist before inserting
   - Check category_id when creating products

3. **Stock Calculation Issues**:
   - Verify inventory movement triggers are working
   - Check transaction_items for correct quantities

### Reset Database

If you need to start fresh:

```sql
-- WARNING: This will delete all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then re-run schema.sql, policies.sql, and seed.sql
```

## 📞 Support

For issues related to:
- **Supabase platform**: [Supabase Documentation](https://supabase.com/docs)
- **POS System**: Check the main README.md in the project root
- **SQL queries**: Refer to PostgreSQL documentation

## 🔄 Updates

When updating the schema:

1. Always backup your data first
2. Test changes in a development environment
3. Use migrations for production updates
4. Update RLS policies if table structure changes

---

**Note**: This database schema is designed for a modern POS system with multi-user support, inventory management, and comprehensive reporting capabilities. All tables include proper indexing for performance and RLS policies for security.