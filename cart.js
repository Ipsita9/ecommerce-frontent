// 📄 cart.js

// function renderCartItems() {
//   const cartItemsContainer = document.getElementById("cart-items");
//   const totalEl = document.getElementById("total-price");
//   const checkoutBtn = document.getElementById("checkout-btn");

//   const cart = CartUtils.getCart();
//   cartItemsContainer.innerHTML = "";
//   let total = 0;

//   if (cart.length === 0) {
//     cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
//     checkoutBtn.disabled = true;
//     totalEl.textContent = "0.00";
//     return;
//   }

//   cart.forEach((item, index) => {
//     total += item.price * item.quantity;

//     const itemEl = document.createElement("div");
//     itemEl.className = "cart-item";
//     itemEl.innerHTML = `
//       <img src="${item.image}" alt="${item.title}" />
//       <div class="item-details">
//         <h3>${item.title}</h3>
//         <p>Size: ${item.size}</p>
//         <p>Price: ₹${item.price.toFixed(2)}</p>
//         <div class="quantity-controls">
//           <button onclick="updateQuantity(${index}, -1)">−</button>
//           <span>${item.quantity}</span>
//           <button onclick="updateQuantity(${index}, 1)">+</button>
//         </div>
//         <p>Subtotal: ₹${(item.price * item.quantity).toFixed(2)}</p>
//         <button onclick="removeItem(${index})" class="remove-btn">Remove</button>
//       </div>
//     `;
//     cartItemsContainer.appendChild(itemEl);
//   });

//   totalEl.textContent = total.toFixed(2);
//   checkoutBtn.disabled = false;
//   updateCartCount();
// }

// function updateQuantity(index, change) {
//   const cart = CartUtils.getCart();
//   const item = cart[index];

//   item.quantity += change;
//   if (item.quantity < 1) item.quantity = 1;

//   CartUtils.saveCart(cart);
//   renderCartItems();
// }

// function removeItem(index) {
//   const cart = CartUtils.getCart();
//   cart.splice(index, 1);
//   CartUtils.saveCart(cart);
//   renderCartItems();
// }

// function updateCartCount() {
//   const totalItems = CartUtils.getTotalCount();
//   const cartSpan = document.querySelector(".cart span");
//   if (cartSpan) {
//     cartSpan.textContent = totalItems;
//   }
// }

// window.addEventListener("DOMContentLoaded", () => {
//   renderCartItems();
// });

function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p class='empty-message'>🛒 Your cart is empty.</p>";
    document.getElementById("checkout-btn").disabled = true;
    document.getElementById("cart-total").textContent = "0.00";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div class="details">
        <h4>${item.title}</h4>
        <p><strong>Size:</strong> ${item.size}</p>
        <p><strong>Unit Price:</strong> ₹${item.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="decrease" data-index="${index}">−</button>
          <span class="qty">${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <p><strong>Subtotal:</strong> ₹${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove" data-index="${index}">🗑️ Remove</button>
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
  document.querySelectorAll(".remove").forEach(btn =>
    btn.addEventListener("click", e => removeItem(+e.target.dataset.index))
  );

  updateCartSummary(cart);
}

function updateQuantity(index, delta) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;

  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1; // Prevent 0 or negative

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function updateCartSummary(cart) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-total").textContent = total.toFixed(2);
  document.getElementById("cart-count").textContent = cart.length;
  document.getElementById("checkout-btn").disabled = cart.length === 0;
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // remove item
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (JSON.parse(localStorage.getItem("cart")).length > 0) {
    window.location.href = "checkout.html";
  }
});

document.getElementById("continue-shopping").addEventListener("click", () => {
  window.location.href = "products.html";
});

window.addEventListener("DOMContentLoaded", loadCart);
