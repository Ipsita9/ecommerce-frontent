// 📄 cart.js

function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  const cart = CartUtils.getCart();
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    checkoutBtn.disabled = true;
    totalEl.textContent = "0.00";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div class="item-details">
        <h3>${item.title}</h3>
        <p>Size: ${item.size}</p>
        <p>Price: ₹${item.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${index}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <p>Subtotal: ₹${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeItem(${index})" class="remove-btn">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  totalEl.textContent = total.toFixed(2);
  checkoutBtn.disabled = false;
  updateCartCount();
}

function updateQuantity(index, change) {
  const cart = CartUtils.getCart();
  const item = cart[index];

  item.quantity += change;
  if (item.quantity < 1) item.quantity = 1;

  CartUtils.saveCart(cart);
  renderCartItems();
}

function removeItem(index) {
  const cart = CartUtils.getCart();
  cart.splice(index, 1);
  CartUtils.saveCart(cart);
  renderCartItems();
}

function updateCartCount() {
  const cart = CartUtils.getCart();
  document.getElementById("cart-count").textContent = cart.length;
}

window.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
});
