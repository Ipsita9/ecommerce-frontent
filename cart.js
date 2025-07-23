function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cart = CartUtils.getCart();

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p class='empty-message'>🛒 Your cart is empty.</p>";
    document.getElementById("checkout-btn").disabled = true;
    document.getElementById("cart-total").textContent = "0.00";
    document.getElementById("cart-count").textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div class="item-details">
        <h4>${item.title}</h4>
        <p><strong>Size:</strong> ${item.size || 'M'}</p>
        <p><strong>Unit Price:</strong> $${item.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="decrease" data-index="${index}">−</button>
          <span class="qty">${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <p><strong>Subtotal:</strong> $${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-btn" data-index="${index}">🗑️ Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(itemDiv);
  });

  // Add button event listeners
  document.querySelectorAll(".increase").forEach(btn =>
    btn.addEventListener("click", e => updateQuantity(+e.target.dataset.index, 1))
  );
  document.querySelectorAll(".decrease").forEach(btn =>
    btn.addEventListener("click", e => updateQuantity(+e.target.dataset.index, -1))
  );
  document.querySelectorAll(".remove-btn").forEach(btn =>
    btn.addEventListener("click", e => removeItem(+e.target.dataset.index))
  );

  updateCartSummary(cart);
  updateCartCount();
}

function updateQuantity(index, delta) {
  const cart = CartUtils.getCart();
  if (!cart[index]) return;

  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1;

  CartUtils.saveCart(cart);
  loadCart();
}

function updateCartSummary(cart) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("cart-total").textContent = total.toFixed(2);
  document.getElementById("cart-count").textContent = totalItems;
  document.getElementById("checkout-btn").disabled = cart.length === 0;
}

function removeItem(index) {
  let cart = CartUtils.getCart();
  cart.splice(index, 1);
  CartUtils.saveCart(cart);
  loadCart();
}

function updateCartCount() {
  const totalItems = CartUtils.getTotalCount();
  const cartIcon = document.querySelector(".cart span");
  if (cartIcon) {
    cartIcon.textContent = totalItems;
  }
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  const cart = CartUtils.getCart();
  if (cart.length > 0) {
    alert("Checkout functionality coming soon!");
  }
});

document.getElementById("continue-shopping").addEventListener("click", () => {
  window.location.href = "products.html";
});

// Initialize when page loads
window.addEventListener("DOMContentLoaded", () => {
  loadCart();
});