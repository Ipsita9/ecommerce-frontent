// Products listing page - shows all products
const productDetail = document.getElementById("product-details");

// Show loading message initially
productDetail.innerHTML = "<p>Loading products...</p>";

// Fetch all products from API
fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(products => {
    productDetail.innerHTML = `
      <div class="products-container" style="padding: 20px;">
        <h2>Our Products</h2>
        <div class="product-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
          ${products.map(product => `
            <div class="product-card" style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; text-align: center;">
              <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 200px; object-fit: contain; margin-bottom: 15px;">
              <h3 style="font-size: 1.1rem; margin-bottom: 10px;">${product.title}</h3>
              <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">${product.description.substring(0, 100)}...</p>
              <div class="price" style="font-weight: bold; color: #333; margin-bottom: 15px;">$${product.price.toFixed(2)}</div>
              <button class="btn add-to-cart" onclick="addToCart(${product.id})" style="background-color: #ff6f61; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Add to Cart</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  })
  .catch(error => {
    console.error("Error:", error);
    productDetail.innerHTML = "<p>Failed to load products. Please try again later.</p>";
  });

// Add to cart function
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
  updateCartCount();
}

// Update cart count
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartElement = document.querySelector(".cart span");
  if (cartElement) {
    cartElement.textContent = cart.length;
  }
}

// Call on page load
updateCartCount();
// Extract product ID from URL
// const urlParams = new URLSearchParams(window.location.search);
// const productId = urlParams.get('id');

// // DOM Elements
// const productImage = document.getElementById("productImage");
// const productTitle = document.getElementById("productTitle");
// const productDescription = document.getElementById("productDescription");
// const productPrice = document.getElementById("productPrice");
// const totalPrice = document.getElementById("totalPrice");
// const qtyInput = document.getElementById("qty");
// const increaseBtn = document.getElementById("increase");
// const decreaseBtn = document.getElementById("decrease");
// const addToCartBtn = document.getElementById("addToCart");
// const feedback = document.getElementById("feedback");
// const cartCount = document.getElementById("cartCount");

// // Fetch product data
// fetch(`https://fakestoreapi.com/products/${productId}`)
//   .then(res => res.json())
//   .then(product => {
//     productImage.src = product.image;
//     productTitle.textContent = product.title;
//     productDescription.textContent = product.description;
//     productPrice.textContent = product.price.toFixed(2);
//     totalPrice.textContent = product.price.toFixed(2);

//     // Add quantity control
//     increaseBtn.onclick = () => updateQty(1, product.price);
//     decreaseBtn.onclick = () => updateQty(-1, product.price);

//     // Add to cart
//     addToCartBtn.onclick = () => {
//       const size = document.getElementById("size").value;
//       const quantity = parseInt(qtyInput.value);
//       const cartItem = {
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         image: product.image,
//         size: size,
//         quantity: quantity,
//       };

//       // Save to localStorage
//       let cart = JSON.parse(localStorage.getItem("cart")) || [];
//       cart.push(cartItem);
//       localStorage.setItem("cart", JSON.stringify(cart));

//       feedback.classList.remove("hidden");
//       setTimeout(() => feedback.classList.add("hidden"), 2000);

//       // Update cart count
//       cartCount.textContent = cart.length;
//     };
//   });

// function updateQty(change, price) {
//   let qty = parseInt(qtyInput.value);
//   qty += change;
//   if (qty < 1) qty = 1;
//   qtyInput.value = qty;
//   totalPrice.textContent = (qty * price).toFixed(2);
// }

// // Load cart count on page load
// document.addEventListener("DOMContentLoaded", () => {
//   const cart = JSON.parse(localStorage.getItem("cart")) || [];
//   cartCount.textContent = cart.length;
// });

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("No product ID found in URL");
    return;
  }

  fetch("https://fakestoreapi.com/products/" + productId)
    .then((res) => res.json())
    .then((product) => {
      // Update UI elements
      document.getElementById("product-image").src = product.image;
      document.getElementById("product-title").textContent = product.title;
      document.getElementById("product-description").textContent = product.description;
      document.getElementById("product-price").textContent = "$" + product.price.toFixed(2);

      // Set default total price
      updateTotal(product.price);
    });
});

function updateTotal(price) {
  const qty = parseInt(document.getElementById("quantity-input").value);
  const total = qty * price;
  document.getElementById("product-total").textContent = "Total: $" + total.toFixed(2);
}

function increaseQty() {
  const input = document.getElementById("quantity-input");
  let qty = parseInt(input.value);
  input.value = ++qty;
  updateTotal(parseFloat(document.getElementById("product-price").textContent.slice(1)));
}

function decreaseQty() {
  const input = document.getElementById("quantity-input");
  let qty = parseInt(input.value);
  if (qty > 1) input.value = --qty;
  updateTotal(parseFloat(document.getElementById("product-price").textContent.slice(1)));
}
function addToCart() {
  const productId = new URLSearchParams(window.location.search).get("id");
  const qty = parseInt(document.getElementById("quantity-input").value) || 1;
  const size = document.getElementById("size").value;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    id: productId,
    quantity: qty,
    size: size,
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  // Show feedback message if element exists
  const feedbackElement = document.getElementById("cart-feedback");
  if (feedbackElement) {
    feedbackElement.textContent = "Added to cart!";
  }

  updateCartCount();
}

// Update cart count function
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartElement = document.querySelector(".cart span");
  if (cartElement) {
    cartElement.textContent = cart.length;
  }
}