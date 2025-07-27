console.log("E-Commerce Website Loaded");

// JS for toggling menu
function toggleMenu() {
  const nav = document.getElementById("nav");
  nav.classList.toggle("show");
}

// Make toggleMenu available globally
window.toggleMenu = toggleMenu;

// Update cart count function
function updateCartCount() {
  const totalItems = CartUtils.getTotalCount();
  const cartIcon = document.querySelector(".cart span");
  if (cartIcon) {
    cartIcon.textContent = totalItems;
  }
}

// Prevent multiple initializations during hot reload
if (!window.appInitialized) {
  // Initialize cart count on page load
  document.addEventListener("DOMContentLoaded", () => {
    // Clean up any existing duplicates
    if (window.CartUtils) {
      CartUtils.removeDuplicates();
    }
    updateCartCount();

    // Ensure page is fully visible after loading
    document.body.style.opacity = '1';

    // Mark as initialized
    window.appInitialized = true;
  });
}

// const productGrid = document.getElementById("productGrid");

// // Fetch data from FakeStoreAPI
// fetch("https://fakestoreapi.com/products?limit=8")
//   .then(res => res.json())
//   .then(data => {
//     data.forEach(product => {
//       const card = document.createElement("div");
//       card.className = "product-card";
//       card.innerHTML = `
//         <img src="${product.image}" alt="${product.title}" />
//         <h3>${product.title}</h3>
//         <div class="price">$${product.price.toFixed(2)}</div>
//         <a href="#" class="btn">Add to Cart</a>
//       `;
//       productGrid.appendChild(card);
//     });
//   })
//   .catch(err => {
//     productGrid.innerHTML = "<p>Failed to load products.</p>";
//     console.error(err);
//   });
// function createProductCard(product) {
//   const card = document.createElement("div");
//   card.classList.add("product-card");

//   card.innerHTML = `
//     <img src="${product.image}" alt="${product.title}" loading="lazy">
//     <h3>${product.title}</h3>
//     <p>${product.description.substring(0, 80)}...</p>
//     <div class="price">$${product.price.toFixed(2)}</div>
//     <button class="btn add-to-cart">Add to Cart</button>
//   `;

//   return card;
// }






// fetch("https://fakestoreapi.com/products?limit=8")
//   .then((res) => res.json())
//   .then((data) => {
//     const productGrid = document.getElementById("productGrid");

//     data.forEach((product) => {
//       const card = document.createElement("div");
//       card.classList.add("product-card");

//       // ✅ Use backticks to inject the HTML
//       card.innerHTML = `
//       <img src="${product.image}" alt="${product.title}" loading="lazy">
//       <h3>${product.title}</h3>
//       <div class="price">$${product.price.toFixed(2)}</div>
//       <button class="btn add-to-cart">Add to Cart</button>
//     `;

//       productGrid.appendChild(card);
//     });

//     // ✅ Attach event listener AFTER cards are created
//     const cartButtons = document.querySelectorAll(".add-to-cart");
//     cartButtons.forEach((button) => {
//       button.addEventListener("click", () => {
//         alert("Added to cart!");
//       });
//     });
//   })
//   .catch((error) => {
//     console.error("Product load failed:", error);
//   });
  const loadingMessage = document.getElementById("loadingMessage");
  const errorMessage = document.getElementById("errorMessage");
  const productGrid = document.getElementById("productGrid");

  if (loadingMessage) loadingMessage.style.display = "block";
  if (errorMessage) errorMessage.style.display = "none";

  // Pre-allocate space to prevent layout shift
  if (productGrid) {
    productGrid.style.minHeight = "400px";
  }

  fetch("https://fakestoreapi.com/products?limit=8")
    .then((res) => res.json())
    .then((data) => {
      if (loadingMessage) loadingMessage.style.display = "none";
      if (productGrid) productGrid.style.minHeight = "auto";

      // Store data globally for cart functionality
      window.homepageProducts = data;

      data.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.dataset.productIndex = index; // Store index for reference

        // Convert price to INR for display
        const priceInINR = (product.price * 80).toFixed(2);

        card.innerHTML = `
          <picture>
            <source media="(max-width: 480px)" srcset="${product.image}?w=150&h=150&fit=crop&auto=format,webp" type="image/webp">
            <source media="(max-width: 768px)" srcset="${product.image}?w=250&h=250&fit=crop&auto=format,webp" type="image/webp">
            <source srcset="${product.image}?w=300&h=300&fit=crop&auto=format,webp" type="image/webp">
            <img src="${product.image}" alt="${product.title}" loading="lazy" 
                 srcset="${product.image}?w=150 150w, ${product.image}?w=250 250w, ${product.image}?w=300 300w"
                 sizes="(max-width: 480px) 150px, (max-width: 768px) 250px, 300px">
          </picture>
          <h3>${product.title}</h3>
          <p class="description">${product.description.substring(0, 100)}...</p>
          <div class="price">₹${priceInINR}</div>
          <button class="btn add-to-cart">Add to Cart</button>
        `;

        productGrid.appendChild(card);
      });

      // Add-to-cart click event
      document.querySelectorAll(".add-to-cart").forEach((button, index) => {
        button.addEventListener("click", (e) => {
          const productCard = e.target.closest(".product-card");
          const productTitle = productCard.querySelector("h3").textContent;
          const productPrice = parseFloat(productCard.querySelector(".price").textContent.replace("₹", ""));
          const productImage = productCard.querySelector("img").src;

          const productId = `homepage-${index}`;
          const uniqueId = `${productId}-M`; // Default size M for homepage products

          const newItem = {
            id: productId,
            uniqueId: uniqueId,
            title: productTitle,
            price: productPrice,
            image: productImage,
            size: "M", // Default size
            quantity: 1
          };

          // Use CartUtils to add item with duplicate checking
          const result = CartUtils.addToCart(newItem);

          alert(result.message);
          updateCartCount();
        });
      });
    })
    .catch((error) => {
      loadingMessage.style.display = "none";
      errorMessage.textContent = "Failed to load products. Please try again later.";
      errorMessage.style.display = "block";
      console.error("Fetch error:", error);
    });