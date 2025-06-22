// Sample product data
export const products = [
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
  {
    id: 3,
    name: "Fries",
    price: 4.99,
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    name: "Soda",
    price: 2.49,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 5,
    name: "Coffee",
    price: 3.99,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 6,
    name: "Beer",
    price: 5.99,
    category: "Alcohol",
    image:
      "https://images.unsplash.com/photo-1513309914637-65c20a5962e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 7,
    name: "Chips",
    price: 2.99,
    category: "Snacks",
    image:
      "https://images.unsplash.com/photo-1576479557421-ef5348adb8c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 8,
    name: "Ice Cream",
    price: 4.49,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1560008581-09826d1de69e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 9,
    name: "Salad",
    price: 7.99,
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 10,
    name: "Water",
    price: 1.99,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1560869713-9d9f4579d1a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 11,
    name: "Wine",
    price: 9.99,
    category: "Alcohol",
    image:
      "https://images.unsplash.com/photo-1551751299-1b51cab2694c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 12,
    name: "Chocolate",
    price: 3.49,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1575377427642-087cf684f29d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
];

// Current category and search state
export let currentCategory = "All Items";

// Product rendering functions
export function renderProducts(productGrid, searchTerm = "") {
  productGrid.innerHTML = "";

  let filteredProducts = products;

  // Filter by category
  if (currentCategory !== "All Items") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === currentCategory
    );
  }

  // Filter by search term
  if (searchTerm) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Render products
  filteredProducts.forEach((product) => {
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
      // Import addToCart dynamically to avoid circular dependency
      import("./cart.js").then((module) => {
        module.addToCart(product);
      });
    });
    productGrid.appendChild(productCard);
  });
}

// Set current category
export function setCategory(category) {
  currentCategory = category;
}
