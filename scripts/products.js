// Fetch products from Fake Store API and render them in the grid
async function fetchAndRenderProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    document.getElementById("product-grid").innerHTML = "<p>Unable to load products.</p>";
  }
}

// Render products into HTML
function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = ""; // clear any existing content

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>₹${(product.price * 80).toFixed(2)}</p>
      </a>
    `;

    grid.appendChild(productCard);
  });
}

// Update cart count in nav
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSpan = document.querySelector(".cart span");
  if (cartSpan) {
    cartSpan.textContent = cart.length;
  }
}

// Initialize when page loads
window.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  fetchAndRenderProducts();
});
