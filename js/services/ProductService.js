// Product service for handling product data
import { Product } from "../models/Product.js";
import { getSupabaseClient } from "../config/supabase.js";

export class ProductService {
  constructor() {
    this.supabase = getSupabaseClient();
    this.products = []; // Cache for products
    this.categories = new Set(); // Cache for categories
    this.lastFetch = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Check if cache is valid
  isCacheValid() {
    return this.lastFetch && (Date.now() - this.lastFetch) < this.cacheTimeout;
  }

  // Fetch products from Supabase with fallback
  async fetchProducts(forceRefresh = false) {
    try {
      // Return cached data if valid and not forcing refresh
      if (!forceRefresh && this.isCacheValid() && this.products.length > 0) {
        return this.products;
      }

      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('products')
          .select('*')
          .order('name');

        if (error) throw error;

        this.products = data.map(product => Product.fromSupabase(product));
        this.updateCategories();
        this.lastFetch = Date.now();
        console.log(`Fetched ${this.products.length} products from Supabase`);
        return this.products;
      } else {
        // Fallback to sample data when Supabase is not available
        console.log("Supabase not available, using sample data");
        this.products = sampleProducts.map(
          (p) => new Product(p.id, p.name, p.price, p.category, p.image)
        );
        this.updateCategories();
        this.lastFetch = Date.now();
        return this.products;
      }
    } catch (error) {
      console.error("Error fetching products:", error);

      // Use sample data as fallback when fetch fails
      if (this.products.length === 0) {
        console.log("Using sample products as fallback due to error");
        this.products = sampleProducts.map(
          (p) => new Product(p.id, p.name, p.price, p.category, p.image)
        );
        this.updateCategories();
      }

      return this.products;
    }
  }

  // Update categories cache
  updateCategories() {
    this.categories.clear();
    this.products.forEach(product => {
      this.categories.add(product.category);
    });
  }

  // Get products by category with optimized filtering
  async getProductsByCategory(category) {
    if (this.products.length === 0) {
      await this.fetchProducts();
    }

    if (category === "All Items") {
      return this.products;
    }

    return this.products.filter((product) => product.category === category);
  }

  // Enhanced search with fuzzy matching and performance optimization
  async searchProducts(query, category = "All Items") {
    if (this.products.length === 0) {
      await this.fetchProducts();
    }

    let products = category === "All Items" 
      ? this.products 
      : this.products.filter((product) => product.category === category);

    if (!query || query.trim() === "") return products;

    const lowerQuery = query.toLowerCase().trim();
    
    // Optimized search with scoring
    const searchResults = products.map(product => {
      const name = product.name.toLowerCase();
      let score = 0;
      
      // Exact match gets highest score
      if (name === lowerQuery) score = 100;
      // Starts with query gets high score
      else if (name.startsWith(lowerQuery)) score = 80;
      // Contains query gets medium score
      else if (name.includes(lowerQuery)) score = 60;
      // No match gets 0
      else score = 0;
      
      return { product, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);

    return searchResults;
  }

  // Get product by ID with caching
  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  // Get all categories
  getCategories() {
    return Array.from(this.categories).sort();
  }

  // Add new product (for Supabase integration)
  async addProduct(productData) {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not available");
      }

      const { data, error } = await this.supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      const newProduct = Product.fromSupabase(data);
      this.products.push(newProduct);
      this.categories.add(newProduct.category);
      
      return { success: true, product: newProduct };
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false, error: error.message };
    }
  }

  // Update product (for Supabase integration)
  async updateProduct(id, updates) {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not available");
      }

      const { data, error } = await this.supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update local cache
      const index = this.products.findIndex(p => p.id === id);
      if (index !== -1) {
        this.products[index] = Product.fromSupabase(data);
        this.updateCategories();
      }
      
      return { success: true, product: Product.fromSupabase(data) };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, error: error.message };
    }
  }

  // Delete product (for Supabase integration)
  async deleteProduct(id) {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not available");
      }

      const { error } = await this.supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local cache
      this.products = this.products.filter(p => p.id !== id);
      this.updateCategories();
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }
  }

  // Clear cache and force refresh
  clearCache() {
    this.products = [];
    this.categories.clear();
    this.lastFetch = null;
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
