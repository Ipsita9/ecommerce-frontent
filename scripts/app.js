console.log("E-Commerce Website Loaded");
// JS for toggling menu
function toggleMenu() {
  const nav = document.getElementById("nav");
  nav.classList.toggle("show");
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

  loadingMessage.style.display = "block";
  errorMessage.style.display = "none";

  fetch("https://fakestoreapi.com/products?limit=8")
    .then((res) => res.json())
    .then((data) => {
      loadingMessage.style.display = "none";

      data.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
          <img src="${product.image}" alt="${product.title}" loading="lazy">
          <h3>${product.title}</h3>
          <p class="description">${product.description.substring(0, 100)}...</p>
          <div class="price">$${product.price.toFixed(2)}</div>
          <button class="btn add-to-cart">Add to Cart</button>
        `;

        productGrid.appendChild(card);
      });

      // Add-to-cart click event
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
          alert("Added to cart!");
        });
      });
    })
    .catch((error) => {
      loadingMessage.style.display = "none";
      errorMessage.textContent = "Failed to load products. Please try again later.";
      errorMessage.style.display = "block";
      console.error("Fetch error:", error);
    });
