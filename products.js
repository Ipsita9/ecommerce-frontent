
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
