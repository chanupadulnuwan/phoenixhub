// Ensure DOM is fully loaded before running script

document.addEventListener("DOMContentLoaded", () => {

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let favorites = [];
  
  // DOM Elements
  const productSections = document.getElementById("productSections");
  const cartTableBody = document.getElementById("cf-cartTableBody");
  const cartTotal = document.getElementById("cf-cartTotal");
  const favoritesList = document.getElementById("cf-favoritesList");
  
  const viewCartBtn = document.getElementById("cf-viewCartBtn");
  const viewFavoritesBtn = document.getElementById("cf-viewFavoritesBtn");
  const cartSection = document.getElementById("cf-cartSection");
  const favoritesSection = document.getElementById("cf-favoritesSection");
  const addFavoritesBtn = document.getElementById("cf-addFavoritesBtn");
  const applyFavoritesBtn = document.getElementById("cf-applyFavoritesBtn");
  
  // Load and Render Products from JSON
  fetch("./Data/products.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(category => renderCategory(category));
      restoreQuantitiesFromCart();
      renderCart();
    });
  
  // Render Each Category and Product Cards
  function renderCategory(category) {
    const wrapper = document.createElement("div");
  
    const heading = document.createElement("h2");
    heading.textContent = category.category;
    wrapper.appendChild(heading);
  
    const section = document.createElement("section");
    section.className = "category";
    section.id = category.category.replace(/\s+/g, '');
  
    category.items.forEach(item => {
      const div = document.createElement("div");
      div.className = "product";
      div.dataset.name = item.name;
      div.dataset.price = item.price;
  
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <strong class="product-title">${item.name}</strong>
        <p class="product-price">LKR ${item.price}</p>
        <label class="quantity-label">Quantity</label>
        <input type="number" value="0" min="0">
        <div class="icons">
          <button class="cart-icon">🛒</button>
        </div>
      `;
  
      const cartBtn = div.querySelector(".cart-icon");
      cartBtn.addEventListener("click", () => {
        const qty = parseInt(div.querySelector("input").value) || 0;
        if (qty > 0) {
          const existing = cart.find(p => p.name === item.name);
          if (existing) {
            existing.qty += qty;
          } else {
            cart.push({ name: item.name, price: item.price, qty });
          }
          cartBtn.classList.add("added"); // Highlight added cart icon
          renderCart();
        } else {
          alert("Please enter a quantity greater than 0.");
        }
      });
  
      section.appendChild(div);
    });
  
    wrapper.appendChild(section);
    productSections.appendChild(wrapper);
  }
  
  // Render Cart Items and Total
  function renderCart() {
    cartTableBody.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>LKR ${(item.price * item.qty).toFixed(2)}</td>
        <td><button onclick="removeFromCart(${index})">❌</button></td>
      `;
      total += item.price * item.qty;
      cartTableBody.appendChild(row);
    });
    cartTotal.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart)); // Save cart on every change
  }
  
  // Remove Item from Cart
  function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
  }
  
  // Restore Quantity Inputs and Cart Icon State from Stored Cart
  function restoreQuantitiesFromCart() {
    cart.forEach(item => {
      const product = [...document.querySelectorAll(".product")].find(p => p.dataset.name === item.name);
      if (product) {
        product.querySelector("input").value = item.qty;
        const cartBtn = product.querySelector(".cart-icon");
        if (cartBtn) cartBtn.classList.add("added");
      }
    });
  }
  
  // Toggle Cart Section
  viewCartBtn.addEventListener("click", () => {
    cartSection.classList.toggle("cf-hidden");
    favoritesSection.classList.add("cf-hidden");
    renderCart();
  });
  
  // Toggle Favorites Section
  viewFavoritesBtn.addEventListener("click", () => {
    favoritesSection.classList.toggle("cf-hidden");
    cartSection.classList.add("cf-hidden");
    renderFavorites();
  });
  
  // Save Current Cart to Favorites
  addFavoritesBtn.addEventListener("click", () => {
    localStorage.setItem("favorites", JSON.stringify(cart));
    alert("Current order saved as favorite!");
  });
  
  // Apply Favorite Items into Cart
  applyFavoritesBtn.addEventListener("click", () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    favs.forEach(fav => {
      const product = [...document.querySelectorAll(".product")].find(p => p.dataset.name === fav.name);
      if (product) {
        product.querySelector("input").value = fav.qty;
        const cartBtn = product.querySelector(".cart-icon");
        if (cartBtn) cartBtn.classList.add("added");
      }
    });
    cart.length = 0;
    cart.push(...favs);
    renderCart();
  });
  
  // Render Favorites List
  function renderFavorites() {
    favoritesList.innerHTML = "";
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    favs.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.qty} x ${item.name} - LKR ${(item.qty * item.price).toFixed(2)}`;
      favoritesList.appendChild(li);
    });
  }
  
  // Buy Now - Go to Checkout Page
  const buyBtn = document.getElementById("cf-buyNowBtn");
  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("🛑 Your cart is empty. Please add items before checking out.");
        return;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "pay.html";
    });
  }
  
  }); 
  
