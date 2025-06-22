// Import modules
import {
  products,
  renderProducts,
  setCategory,
  currentCategory,
} from "./products.js";
import {
  cart,
  addToCart,
  updateCart,
  showCart,
  hideCart,
  checkout,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "./cart.js";

// Import services
import { ProductService } from "./services/ProductService.js";
import { CartService } from "./services/CartService.js";
import { TransactionService } from "./services/TransactionService.js";
import { AuthService } from "./services/AuthService.js";

// Initialize services
const productService = new ProductService();
const cartService = new CartService();
const transactionService = new TransactionService();
const authService = new AuthService();

// Global state
let selectedPaymentMethod = "cash";

// DOM elements
const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const mobileCartCount = document.getElementById("mobile-cart-count");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const cartSection = document.getElementById("cart-section");
const cartToggle = document.getElementById("cart-toggle");
const mobileCartToggle = document.getElementById("mobile-cart-toggle");
const closeCart = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const paymentModal = document.getElementById("payment-modal");
const closePaymentModal = document.getElementById("close-payment-modal");
const cancelPayment = document.getElementById("cancel-payment");
const confirmPayment = document.getElementById("confirm-payment");
const amountTendered = document.getElementById("amount-tendered");
const changeEl = document.getElementById("change");
const paymentMethods = document.querySelectorAll(".payment-method");
const successMessage = document.getElementById("success-message");
const checkoutText = document.getElementById("checkout-text");
const checkoutSpinner = document.getElementById("checkout-spinner");
const categoryTabs = document.querySelectorAll(".category-tab");
const productSearch = document.querySelector(".product-search");

// Calculate change
function calculateChange() {
  const total = parseFloat(totalEl.textContent.replace("$", ""));
  const tendered = parseFloat(amountTendered.value) || 0;
  const change = tendered - total;

  if (change >= 0) {
    changeEl.value = change.toFixed(2);
  } else {
    changeEl.value = "0.00";
  }
}

// Complete payment
async function completePayment() {
  const total = parseFloat(totalEl.textContent.replace("$", ""));
  const tendered = parseFloat(amountTendered.value) || 0;

  if (tendered < total && selectedPaymentMethod === "cash") {
    alert(
      "Amount tendered must be greater than or equal to total for cash payments."
    );
    return;
  }

  // Show processing state
  checkoutText.textContent = "Processing...";
  checkoutSpinner.style.display = "inline-block";

  try {
    // Create transaction from cart
    const transaction = {
      items: cartService.items,
      subtotal: cartService.getSubtotal(),
      tax: cartService.getTax(),
      total: cartService.getTotal(),
      paymentMethod: selectedPaymentMethod,
      timestamp: new Date(),
    };

    // Save transaction
    const result = await transactionService.saveTransaction(transaction);

    if (result.success) {
      // Clear cart
      cartService.clear();

      // Hide modals
      paymentModal.classList.remove("active");
      hideCart();

      // Show success message
      successMessage.classList.add("show");
      setTimeout(() => {
        successMessage.classList.remove("show");
      }, 3000);
    } else {
      alert("Transaction failed. Please try again.");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("An error occurred during payment. Please try again.");
  } finally {
    // Reset checkout button
    checkoutText.textContent = "Checkout";
    checkoutSpinner.style.display = "none";
  }
}

// Render products
async function renderProductGrid(searchTerm = "") {
  productGrid.innerHTML = "";

  // Get active category
  const activeTab = document.querySelector(".category-tab.active");
  const category = activeTab ? activeTab.textContent : "All Items";

  // Get products
  let products;
  if (searchTerm) {
    products = await productService.searchProducts(searchTerm, category);
  } else {
    products = await productService.getProductsByCategory(category);
  }

  // Render products
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
      </div>
    `;
    productCard.addEventListener("click", () => {
      cartService.addItem(product);
      showCart();
    });
    productGrid.appendChild(productCard);
  });
}

// Update cart UI
function updateCartUI(cart) {
  cartItems.innerHTML = "";

  if (cart.items.length === 0) {
    cartItems.innerHTML =
      '<div style="text-align: center; padding: 20px; color: #64748b;">Your cart is empty</div>';
  } else {
    cart.items.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="quantity-btn decrease" data-id="${
              item.id
            }">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase" data-id="${
              item.id
            }">+</button>
            <button class="remove-item" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });

    // Add event listeners to quantity buttons
    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        cartService.decreaseQuantity(id);
      });
    });

    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        cartService.increaseQuantity(id);
      });
    });

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Get the button element (which has the data-id)
        const button = e.target.closest(".remove-item");
        if (!button) return;

        const id = parseInt(button.getAttribute("data-id"));
        cartService.removeItem(id);
      });
    });
  }

  // Update totals
  subtotalEl.textContent = `$${cart.getSubtotal().toFixed(2)}`;
  taxEl.textContent = `$${cart.getTax().toFixed(2)}`;
  totalEl.textContent = `$${cart.getTotal().toFixed(2)}`;

  // Update cart count
  const itemCount = cart.getItemCount();
  cartCount.textContent = itemCount;
  mobileCartCount.textContent = itemCount;
}

// Show cart section
function toggleCartVisibility() {
  cartSection.classList.add("open");
}

// Hide cart section
function hideCartSection() {
  cartSection.classList.remove("open");
}

// Process checkout
function checkout() {
  if (cartService.items.length === 0) return;

  // Show payment modal
  paymentModal.classList.add("active");
  amountTendered.value = "";
  changeEl.value = "0.00";

  // Focus on amount tendered
  setTimeout(() => {
    amountTendered.focus();
  }, 100);
}

// Setup event listeners
function setupEventListeners() {
  // Cart toggle
  cartToggle.addEventListener("click", showCart);
  mobileCartToggle.addEventListener("click", showCart);
  closeCart.addEventListener("click", hideCart);

  // Checkout
  checkoutBtn.addEventListener("click", checkout);

  // Payment modal
  closePaymentModal.addEventListener("click", () => {
    paymentModal.classList.remove("active");
  });

  cancelPayment.addEventListener("click", () => {
    paymentModal.classList.remove("active");
  });

  confirmPayment.addEventListener("click", completePayment);

  // Payment method selection
  paymentMethods.forEach((method) => {
    method.addEventListener("click", () => {
      paymentMethods.forEach((m) => m.classList.remove("selected"));
      method.classList.add("selected");
      selectedPaymentMethod = method.getAttribute("data-method");

      if (selectedPaymentMethod === "cash") {
        amountTendered.style.display = "block";
        document.querySelector('label[for="amount-tendered"]').style.display =
          "block";
        changeEl.style.display = "block";
        document.querySelector('label[for="change"]').style.display = "block";
      } else {
        amountTendered.style.display = "none";
        document.querySelector('label[for="amount-tendered"]').style.display =
          "none";
        changeEl.style.display = "none";
        document.querySelector('label[for="change"]').style.display = "none";
      }
    });
  });

  // Amount tendered input
  amountTendered.addEventListener("input", calculateChange);

  // Category tabs
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderProducts(productSearch.value);
    });
  });

  // Product search
  productSearch.addEventListener("input", () => {
    renderProducts(productSearch.value);
  });

  // Close cart when clicking outside on desktop
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth >= 768 &&
      !cartSection.contains(e.target) &&
      !cartToggle.contains(e.target) &&
      cartSection.classList.contains("open")
    ) {
      hideCart();
    }
  });
}

// Initialize the app
async function init() {
  // Add cart change listener
  cartService.addChangeListener(updateCartUI);

  // Load products
  await productService.fetchProducts();

  // Render initial products
  renderProducts();

  // Setup event listeners
  setupEventListeners();
}

// Run initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
