// 🔍 Get product ID from the URL
// ✅ Get product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// ✅ Where to display the product
const productDetail = document.getElementById("product-details");

if (!productId) {
  productDetail.innerHTML = "<p>Invalid product ID.</p>";
} else {
  // ✅ Fetch the product data from API
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      productDetail.innerHTML = `
        <div style="display:flex; gap:20px; align-items:start; padding:20px;">
          <img src="${product.image}" alt="${product.title}" width="300">
          <div>
            <h2>${product.title}</h2>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <button class="btn">Add to Cart</button>
          </div>
        </div>
      `;
    })
    .catch(error => {
      console.error("Error:", error);
      productDetail.innerHTML = "<p>Failed to load product.</p>";
    });
}

// 🧠 Save to localStorage
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
  updateCartCount();
}

// 🧮 Update Cart Count
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").textContent = cart.length;
}

updateCartCount(); // Call on page load


<a href="product.html?id=${product.id}">
