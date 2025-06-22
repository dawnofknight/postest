// Cart service for managing the shopping cart
import { CartItem } from "../models/CartItem.js";

export class CartService {
  constructor() {
    this.items = [];
    this.listeners = [];
  }

  // Add item to cart
  addItem(product) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push(new CartItem(product));
    }

    this.notifyListeners();
  }

  // Remove item from cart
  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.notifyListeners();
  }

  // Increase item quantity
  increaseQuantity(id) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.quantity += 1;
      this.notifyListeners();
    }
  }

  // Decrease item quantity
  decreaseQuantity(id) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.notifyListeners();
      }
    }
  }

  // Clear cart
  clear() {
    this.items = [];
    this.notifyListeners();
  }

  // Get cart item count
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Get subtotal
  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.getTotal(), 0);
  }

  // Get tax amount
  getTax() {
    return this.getSubtotal() * 0.1; // 10% tax
  }

  // Get total
  getTotal() {
    return this.getSubtotal() + this.getTax();
  }

  // Add change listener
  addChangeListener(callback) {
    this.listeners.push(callback);
  }

  // Remove change listener
  removeChangeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this));
  }
}
