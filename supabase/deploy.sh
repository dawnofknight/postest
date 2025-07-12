#!/bin/bash

# Supabase POS System Database Deployment Script
# This script automates the deployment of the POS system database to Supabase

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check if psql is installed
    if ! command -v psql &> /dev/null; then
        print_error "psql is not installed. Please install PostgreSQL client."
        exit 1
    fi
    
    # Check if supabase CLI is installed (optional)
    if command -v supabase &> /dev/null; then
        print_success "Supabase CLI found"
        SUPABASE_CLI=true
    else
        print_warning "Supabase CLI not found. Manual deployment will be used."
        SUPABASE_CLI=false
    fi
}

# Function to validate environment variables
validate_env() {
    print_status "Validating environment variables..."
    
    if [ -z "$SUPABASE_DB_URL" ] && [ -z "$DATABASE_URL" ]; then
        print_error "Database URL not found. Please set SUPABASE_DB_URL or DATABASE_URL environment variable."
        print_status "Example: export SUPABASE_DB_URL='postgresql://postgres:[password]@[host]:5432/postgres'"
        exit 1
    fi
    
    # Use SUPABASE_DB_URL if available, otherwise use DATABASE_URL
    DB_URL=${SUPABASE_DB_URL:-$DATABASE_URL}
    
    print_success "Database URL configured"
}

# Function to test database connection
test_connection() {
    print_status "Testing database connection..."
    
    if psql "$DB_URL" -c "SELECT version();" &> /dev/null; then
        print_success "Database connection successful"
    else
        print_error "Failed to connect to database. Please check your connection string."
        exit 1
    fi
}

# Function to execute SQL file
execute_sql_file() {
    local file=$1
    local description=$2
    
    if [ ! -f "$file" ]; then
        print_error "File $file not found!"
        exit 1
    fi
    
    print_status "Executing $description..."
    
    if psql "$DB_URL" -f "$file" &> /dev/null; then
        print_success "$description completed successfully"
    else
        print_error "Failed to execute $description"
        print_status "Attempting to show error details..."
        psql "$DB_URL" -f "$file"
        exit 1
    fi
}

# Function to deploy schema
deploy_schema() {
    print_status "Deploying database schema..."
    execute_sql_file "schema.sql" "Schema deployment"
}

# Function to deploy policies
deploy_policies() {
    print_status "Deploying security policies..."
    execute_sql_file "policies.sql" "Security policies deployment"
}

# Function to deploy seed data
deploy_seed_data() {
    if [ "$SKIP_SEED" = "true" ]; then
        print_warning "Skipping seed data deployment (SKIP_SEED=true)"
        return
    fi
    
    print_status "Deploying seed data..."
    
    # Ask user if they want to deploy seed data
    if [ "$FORCE_SEED" != "true" ]; then
        echo -n "Do you want to deploy sample data? This will add test products and categories. (y/N): "
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            print_warning "Skipping seed data deployment"
            return
        fi
    fi
    
    execute_sql_file "seed.sql" "Seed data deployment"
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check if main tables exist
    local tables=("profiles" "categories" "products" "transactions" "transaction_items" "inventory_movements" "discounts" "settings")
    
    for table in "${tables[@]}"; do
        if psql "$DB_URL" -c "SELECT COUNT(*) FROM public.$table;" &> /dev/null; then
            print_success "Table '$table' exists and accessible"
        else
            print_error "Table '$table' not found or not accessible"
            exit 1
        fi
    done
    
    # Check if RLS is enabled
    local rls_check=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname IN ('profiles', 'products', 'transactions') AND c.relrowsecurity = true;")
    
    if [ "$rls_check" -eq 3 ]; then
        print_success "Row Level Security (RLS) is properly enabled"
    else
        print_warning "RLS might not be properly configured on all tables"
    fi
    
    # Check if functions exist
    local functions=("is_admin" "is_manager_or_admin" "get_sales_analytics")
    
    for func in "${functions[@]}"; do
        if psql "$DB_URL" -c "SELECT proname FROM pg_proc WHERE proname = '$func';" | grep -q "$func"; then
            print_success "Function '$func' exists"
        else
            print_warning "Function '$func' not found"
        fi
    done
}

# Function to show post-deployment instructions
show_instructions() {
    print_success "\n🎉 Database deployment completed successfully!"
    
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo "1. Update your .env file with Supabase credentials:"
    echo "   SUPABASE_URL=https://your-project-ref.supabase.co"
    echo "   SUPABASE_ANON_KEY=your-anon-key"
    echo ""
    echo "2. Create your first admin user:"
    echo "   - Sign up through your application"
    echo "   - Run: UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';"
    echo ""
    echo "3. Configure store settings in the 'settings' table"
    echo ""
    echo "4. Start your POS application and test the functionality"
    echo ""
    echo -e "${GREEN}Happy selling! 🛒${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  --skip-seed         Skip seed data deployment"
    echo "  --force-seed        Deploy seed data without confirmation"
    echo "  --schema-only       Deploy only schema (no policies or seed data)"
    echo "  --verify-only       Only verify existing deployment"
    echo ""
    echo "Environment Variables:"
    echo "  SUPABASE_DB_URL     PostgreSQL connection string for Supabase"
    echo "  DATABASE_URL        Alternative to SUPABASE_DB_URL"
    echo "  SKIP_SEED          Set to 'true' to skip seed data"
    echo "  FORCE_SEED         Set to 'true' to deploy seed data without confirmation"
    echo ""
    echo "Examples:"
    echo "  # Full deployment with confirmation"
    echo "  ./deploy.sh"
    echo ""
    echo "  # Deploy without seed data"
    echo "  ./deploy.sh --skip-seed"
    echo ""
    echo "  # Deploy with environment variables"
    echo "  SUPABASE_DB_URL='postgresql://...' ./deploy.sh"
    echo ""
    echo "  # Schema only deployment"
    echo "  ./deploy.sh --schema-only"
}

# Main deployment function
main() {
    echo -e "${BLUE}🚀 Supabase POS System Database Deployment${NC}"
    echo "============================================"
    
    # Parse command line arguments
    SKIP_SEED=false
    FORCE_SEED=false
    SCHEMA_ONLY=false
    VERIFY_ONLY=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            --skip-seed)
                SKIP_SEED=true
                shift
                ;;
            --force-seed)
                FORCE_SEED=true
                shift
                ;;
            --schema-only)
                SCHEMA_ONLY=true
                shift
                ;;
            --verify-only)
                VERIFY_ONLY=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Check requirements
    check_requirements
    
    # Validate environment
    validate_env
    
    # Test connection
    test_connection
    
    if [ "$VERIFY_ONLY" = "true" ]; then
        verify_deployment
        exit 0
    fi
    
    # Deploy components
    deploy_schema
    
    if [ "$SCHEMA_ONLY" != "true" ]; then
        deploy_policies
        deploy_seed_data
    fi
    
    # Verify deployment
    verify_deployment
    
    # Show instructions
    show_instructions
}

# Change to script directory
cd "$(dirname "$0")"

# Run main function
main "$@"