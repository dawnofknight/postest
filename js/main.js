// Main application entry point
import { products, renderProducts, setCurrentCategory } from "./products.js";
import { cart, updateCartUI } from "./cart.js";
import { ProductService } from "./services/ProductService.js";
import { CartService } from "./services/CartService.js";
import { TransactionService } from "./services/TransactionService.js";
import { AuthService } from "./services/AuthService.js";

// Application state
let isInitialized = false;
let initializationPromise = null;

// Initialize services
const productService = new ProductService();
const cartService = new CartService();
const transactionService = new TransactionService();
const authService = new AuthService();

// DOM elements
const categoryTabs = document.querySelectorAll(".category-tab");
const searchInput = document.getElementById("search-input");
const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");
const paymentAmountInput = document.getElementById("payment-amount");
const changeElement = document.getElementById("change");
const processPaymentBtn = document.getElementById("process-payment");

// Loading indicator functions
function showLoading(message = "Loading...") {
  const existingLoader = document.getElementById('app-loader');
  if (existingLoader) return;
  
  const loader = document.createElement('div');
  loader.id = 'app-loader';
  loader.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      color: white;
      font-size: 18px;
    ">
      <div style="text-align: center;">
        <div style="margin-bottom: 10px;">⏳</div>
        <div>${message}</div>
      </div>
    </div>
  `;
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.remove();
  }
}

// Error handling
function showError(message, error = null) {
  console.error(message, error);
  
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 15px;
    border-radius: 5px;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;
  errorDiv.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">⚠️ Error</div>
    <div>${message}</div>
    <button onclick="this.parentElement.remove()" style="
      background: none;
      border: none;
      color: white;
      float: right;
      cursor: pointer;
      font-size: 16px;
      margin-top: 5px;
    ">×</button>
  `;
  
  document.body.appendChild(errorDiv);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

// Success notification
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px;
    border-radius: 5px;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;
  successDiv.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">✅ Success</div>
    <div>${message}</div>
    <button onclick="this.parentElement.remove()" style="
      background: none;
      border: none;
      color: white;
      float: right;
      cursor: pointer;
      font-size: 16px;
      margin-top: 5px;
    ">×</button>
  `;
  
  document.body.appendChild(successDiv);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (successDiv.parentElement) {
      successDiv.remove();
    }
  }, 3000);
}



// Initialize the application
async function initializeApp() {
  if (isInitialized || initializationPromise) {
    return initializationPromise;
  }
  
  showLoading("Initializing POS System...");
  
  initializationPromise = (async () => {
    try {
      console.log("🚀 Starting POS application initialization...");
      
      // Initialize authentication first
      console.log("🔐 Initializing authentication...");
      await authService.initializeAuth();
      
      // Load products from service with retry
      console.log("📦 Loading products...");
      let loadedProducts;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          loadedProducts = await productService.fetchProducts();
          break;
        } catch (error) {
          retryCount++;
          console.warn(`Product loading attempt ${retryCount} failed:`, error);
          if (retryCount >= maxRetries) {
            throw new Error(`Failed to load products after ${maxRetries} attempts`);
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      // Update products array
      products.splice(0, products.length, ...loadedProducts);
      console.log(`✅ Loaded ${loadedProducts.length} products`);
      
      // Render initial products
      renderProducts();
      
      // Update cart UI
      updateCartUI();
      
      // Sync any pending transactions
      console.log("🔄 Syncing pending transactions...");
      try {
        await transactionService.syncPendingTransactions();
      } catch (error) {
        console.warn("Failed to sync pending transactions:", error);
      }
      
      // Setup auth state listener
      authService.addAuthListener((user) => {
        console.log('Auth state changed:', user ? `Logged in as ${user.email}` : 'Logged out');
        updateUIForAuthState(user);
      });
      
      isInitialized = true;
      console.log("✅ Application initialized successfully");
      
    } catch (error) {
      console.error("❌ Error initializing application:", error);
      showError("Failed to initialize the application. Some features may not work properly.", error);
      throw error;
    } finally {
      hideLoading();
    }
  })();
  
  return initializationPromise;
}

// Update UI based on auth state
function updateUIForAuthState(user) {
  // You can add auth-specific UI updates here
  // For example, show/hide admin features based on user role
  const userRole = authService.getUserRole();
  
  // Example: Show admin features for admin users
  const adminElements = document.querySelectorAll('.admin-only');
  adminElements.forEach(element => {
    element.style.display = userRole === 'admin' ? 'block' : 'none';
  });
}

// Enhanced error handling for async operations
function handleAsyncError(operation, errorMessage) {
  return async (...args) => {
    try {
      return await operation(...args);
    } catch (error) {
      console.error(errorMessage, error);
      showError(errorMessage);
      throw error;
    }
  };
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);

// Category tab event listeners
categoryTabs.forEach((tab) => {
  tab.addEventListener("click", handleAsyncError(async () => {
    const category = tab.dataset.category;
    
    // Update active tab
    categoryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    setCurrentCategory(category);
    renderProducts();
  }, "Failed to switch category"));
});

// Enhanced search functionality with debouncing
let searchTimeout;
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value;
  
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Debounce search to avoid excessive calls
  searchTimeout = setTimeout(() => {
    try {
      renderProducts(searchTerm);
    } catch (error) {
      console.error("Search error:", error);
      showError("Search failed. Please try again.");
    }
  }, 300);
});

// Payment calculation with validation
paymentAmountInput.addEventListener("input", () => {
  try {
    const paymentAmount = parseFloat(paymentAmountInput.value) || 0;
    const total = cart.getTotal();
    const change = Math.max(0, paymentAmount - total);
    
    changeElement.textContent = `$${change.toFixed(2)}`;
    
    // Visual feedback for sufficient payment
    if (paymentAmount >= total && total > 0) {
      paymentAmountInput.style.borderColor = '#4CAF50';
      processPaymentBtn.disabled = false;
    } else {
      paymentAmountInput.style.borderColor = '#ddd';
      processPaymentBtn.disabled = cart.items.length === 0;
    }
  } catch (error) {
    console.error("Payment calculation error:", error);
  }
});

// Enhanced payment processing
processPaymentBtn.addEventListener("click", handleAsyncError(async () => {
  const paymentAmount = parseFloat(paymentAmountInput.value) || 0;
  const total = cart.getTotal();
  
  // Validation
  if (cart.items.length === 0) {
    showError("Cart is empty. Please add items before processing payment.");
    return;
  }
  
  if (paymentAmount < total) {
    showError(`Insufficient payment. Required: $${total.toFixed(2)}, Received: $${paymentAmount.toFixed(2)}`);
    paymentAmountInput.focus();
    return;
  }
  
  // Disable button to prevent double-clicks
  processPaymentBtn.disabled = true;
  processPaymentBtn.textContent = "Processing...";
  
  try {
    // Create transaction with additional metadata
    const transaction = {
      items: cart.items.map(item => ({
        ...item,
        timestamp: new Date().toISOString()
      })),
      subtotal: cart.getSubtotal(),
      tax: cart.getTax(),
      total: cart.getTotal(),
      paymentAmount,
      change: paymentAmount - total,
      timestamp: new Date().toISOString(),
      cashier: authService.getCurrentUser()?.email || 'Unknown',
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    console.log("💳 Processing payment...", transaction);
    
    // Save transaction
    const result = await transactionService.saveTransaction(transaction);
    
    if (result.success) {
      // Clear cart
      cart.clear();
      updateCartUI();
      
      // Reset payment form
      paymentAmountInput.value = "";
      changeElement.textContent = "$0.00";
      paymentAmountInput.style.borderColor = '#ddd';
      
      showSuccess(`Payment processed successfully! Transaction ID: ${transaction.transactionId}`);
      console.log("✅ Payment processed successfully", result);
    } else {
      throw new Error(result.error || "Unknown error occurred");
    }
  } catch (error) {
    console.error("❌ Payment processing error:", error);
    showError("Payment processing failed. Please try again.");
  } finally {
    // Re-enable button
    processPaymentBtn.disabled = false;
    processPaymentBtn.textContent = "Process Payment";
  }
}, "Payment processing failed"));

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter to process payment
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    if (!processPaymentBtn.disabled && cart.items.length > 0) {
      processPaymentBtn.click();
    }
  }
  
  // Escape to clear search
  if (e.key === 'Escape') {
    if (searchInput.value) {
      searchInput.value = '';
      renderProducts();
    }
  }
});

// Periodic sync for offline transactions
setInterval(async () => {
  try {
    await transactionService.syncPendingTransactions();
  } catch (error) {
    console.warn("Periodic sync failed:", error);
  }
}, 5 * 60 * 1000); // Every 5 minutes

// Export for debugging
window.POS = {
  productService,
  cartService,
  transactionService,
  authService,
  cart,
  products,
  reinitialize: initializeApp
};

console.log("🎯 POS System loaded. Access via window.POS for debugging.");
