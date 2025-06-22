// Product service for handling product data
import { Product } from "../models/Product.js";
import { initSupabase } from "../config/supabase.js";

export class ProductService {
  constructor() {
    this.supabase = initSupabase();
    this.products = []; // Cache for products
  }

  // Fetch products from Supabase
  async fetchProducts() {
    try {
      // When Supabase is implemented:
      // const { data, error } = await this.supabase
      //   .from('products')
      //   .select('*');
      //
      // if (error) throw error;
      //
      // this.products = data.map(product => Product.fromSupabase(product));
      // return this.products;

      // For now, use the sample data
      this.products = sampleProducts.map(
        (p) => new Product(p.id, p.name, p.price, p.category, p.image)
      );
      return this.products;
    } catch (error) {
      console.error("Error fetching products:", error);

      // Use sample data as fallback when fetch fails
      if (this.products.length === 0) {
        console.log("Using sample products as fallback");
        this.products = sampleProducts.map(
          (p) => new Product(p.id, p.name, p.price, p.category, p.image)
        );
      }

      return this.products;
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    if (this.products.length === 0) {
      await this.fetchProducts();
    }

    if (category === "All Items") {
      return this.products;
    }

    return this.products.filter((product) => product.category === category);
  }

  // Search products
  async searchProducts(query, category = "All Items") {
    const products =
      category === "All Items"
        ? this.products
        : this.products.filter((product) => product.category === category);

    if (!query) return products;

    const lowerQuery = query.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerQuery)
    );
  }

  // Get product by ID
  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }
}

// Sample product data (will be replaced with Supabase data)
const sampleProducts = [
  {
    id: 1,
    name: "Burger",
    price: 8.99,
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    name: "Pizza",
    price: 12.99,
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  // ... other products
];
