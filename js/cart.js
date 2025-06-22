// Cart state
export let cart = [];

// Add product to cart
export function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
  showCart();
}

// Update cart UI
export function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const cartCount = document.getElementById("cart-count");
  const mobileCartCount = document.getElementById("mobile-cart-count");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<div style="text-align: center; padding: 20px; color: #64748b;">Your cart is empty</div>';
  } else {
    cart.forEach((item) => {
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
        decreaseQuantity(id);
      });
    });

    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        increaseQuantity(id);
      });
    });

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        removeFromCart(id);
      });
    });
  }

  // Update totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  // Update cart count
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  cartCount.textContent = itemCount;
  mobileCartCount.textContent = itemCount;
}

// Increase item quantity
export function increaseQuantity(id) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += 1;
    updateCart();
  }
}

// Decrease item quantity
export function decreaseQuantity(id) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter((item) => item.id !== id);
    }
    updateCart();
  }
}

// Remove item from cart
export function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

// Show cart section
export function showCart() {
  const cartSection = document.getElementById("cart-section");
  cartSection.classList.add("open");
}

// Hide cart section
export function hideCart() {
  const cartSection = document.getElementById("cart-section");
  cartSection.classList.remove("open");
}

// Process checkout
export function checkout() {
  if (cart.length === 0) return;

  // Show payment modal
  const paymentModal = document.getElementById("payment-modal");
  const amountTendered = document.getElementById("amount-tendered");
  const changeEl = document.getElementById("change");

  paymentModal.classList.add("active");
  amountTendered.value = "";
  changeEl.value = "0.00";

  // Focus on amount tendered
  setTimeout(() => {
    amountTendered.focus();
  }, 100);
}
