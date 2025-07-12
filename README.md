# 🏪 BizPOS - Modern Point of Sale System

A modern, responsive Point of Sale (POS) system built with vanilla JavaScript and integrated with Supabase for real-time data management.

## ✨ Features

### 🔧 Core Functionality
- **Product Management**: Browse, search, and filter products by category
- **Shopping Cart**: Add, remove, and modify items with real-time calculations
- **Payment Processing**: Handle cash transactions with change calculation
- **Transaction History**: Track all sales with detailed records
- **User Authentication**: Secure login/logout with role-based permissions

### 🚀 Advanced Features
- **Offline Support**: Works without internet connection with local storage fallback
- **Real-time Sync**: Automatic synchronization with Supabase when online
- **Caching System**: Intelligent caching for improved performance
- **Error Handling**: Robust error handling with user-friendly notifications
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Quick actions for power users

### 🔐 Authentication & Security
- **Role-based Access**: Admin, Manager, and Cashier roles with different permissions
- **Session Management**: Automatic session handling and state persistence
- **Secure API Integration**: Proper error handling and data validation

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Architecture**: Modular ES6 modules with service-oriented design
- **Storage**: Supabase + Local Storage fallback

## 📁 Project Structure

```
postest/
├── index.html                 # Main HTML file
├── css/
│   └── styles.css            # Responsive CSS styles
├── js/
│   ├── main.js               # Application entry point
│   ├── products.js           # Product display logic
│   ├── cart.js               # Cart management
│   ├── config/
│   │   └── supabase.js       # Supabase configuration
│   ├── models/
│   │   ├── Product.js        # Product data model
│   │   ├── CartItem.js       # Cart item model
│   │   └── Transaction.js    # Transaction model
│   └── services/
│       ├── ProductService.js # Product CRUD operations
│       ├── CartService.js    # Cart state management
│       ├── TransactionService.js # Transaction handling
│       └── AuthService.js    # Authentication service
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd postest
```

### 2. Set Up Supabase (Optional)

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Update `js/config/supabase.js` with your credentials:

```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_KEY = 'your-anon-key';
```

### 3. Database Schema (Supabase)

Create these tables in your Supabase project:

#### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image TEXT,
  description TEXT,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Transactions Table
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(100) UNIQUE,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  total DECIMAL(10,2),
  payment_amount DECIMAL(10,2),
  change_amount DECIMAL(10,2),
  cashier VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Run the Application

Since this is a client-side application, you can:

**Option A: Use a local server**
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

**Option B: Open directly in browser**
- Simply open `index.html` in your web browser
- Note: Some features may be limited due to CORS restrictions

### 5. Access the Application

Open your browser and navigate to:
- Local server: `http://localhost:8000`
- Direct file: Open `index.html` in your browser

## 🎯 Usage Guide

### Basic Operations

1. **Browse Products**: Use category tabs to filter products
2. **Search**: Type in the search box to find specific items
3. **Add to Cart**: Click on any product to add it to the cart
4. **Manage Cart**: Adjust quantities or remove items in the cart section
5. **Process Payment**: Enter payment amount and click "Process Payment"

### Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Process payment (when cart has items)
- `Escape`: Clear search input

### Authentication

- The system supports user authentication with Supabase
- Different user roles have different permissions
- Fallback mode works without authentication for testing

## 🔧 Configuration

### Environment Variables

You can set Supabase credentials via:

1. **Direct configuration** in `js/config/supabase.js`
2. **Environment variables** (if using a build system):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Customization

- **Tax Rate**: Modify in `js/cart.js` (default: 8.5%)
- **Currency**: Update display format in relevant files
- **Product Categories**: Modify in `js/products.js`
- **Styling**: Customize `css/styles.css`

## 🏗️ Architecture

### Service Layer

- **ProductService**: Handles product CRUD operations with caching
- **CartService**: Manages cart state and calculations
- **TransactionService**: Processes and stores transactions
- **AuthService**: Handles user authentication and sessions

### Data Models

- **Product**: Represents product data with validation
- **CartItem**: Represents items in the shopping cart
- **Transaction**: Represents completed sales transactions

### Key Features

- **Caching**: 5-minute cache for products to reduce API calls
- **Offline Support**: Local storage fallback when Supabase is unavailable
- **Error Handling**: Comprehensive error handling with user notifications
- **Retry Logic**: Automatic retry for failed operations
- **Real-time Updates**: Live synchronization with Supabase

## 🔍 Debugging

The application exposes a global `POS` object for debugging:

```javascript
// Access in browser console
window.POS.productService.fetchProducts()
window.POS.cart.items
window.POS.authService.getCurrentUser()
```

## 🚨 Troubleshooting

### Common Issues

1. **Products not loading**:
   - Check Supabase configuration
   - Verify internet connection
   - Check browser console for errors

2. **Authentication issues**:
   - Verify Supabase auth settings
   - Check if RLS (Row Level Security) is properly configured

3. **Payment processing fails**:
   - Check transaction table permissions
   - Verify all required fields are present

### Error Messages

- Red notifications indicate errors
- Green notifications indicate success
- Check browser console for detailed error logs

## 🔒 Security Considerations

- Never commit Supabase keys to version control
- Use environment variables for sensitive data
- Implement proper Row Level Security (RLS) in Supabase
- Validate all user inputs
- Use HTTPS in production

## 🚀 Performance Optimizations

- **Caching**: Products cached for 5 minutes
- **Debounced Search**: 300ms delay to reduce API calls
- **Lazy Loading**: Services initialized on demand
- **Batch Operations**: Bulk operations for multiple items
- **Local Storage**: Offline functionality and faster loading

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review browser console for errors
- Verify Supabase configuration
- Ensure all dependencies are loaded

---

**Built with ❤️ using modern web technologies**