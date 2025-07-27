function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cart = CartUtils.getCart();

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-message">
        Your cart is empty
        <br><br>
        <a href="index.html" class="btn" style="display: inline-block; margin-top: 20px;">
          <i class="fa-solid fa-shopping-bag"></i> Start Shopping
        </a>
      </div>
    `;
    document.getElementById("checkout-btn").disabled = true;
    document.getElementById("cart-subtotal").textContent = "0.00";
    document.getElementById("cart-shipping").textContent = "0.00";
    document.getElementById("cart-total").textContent = "0.00";
    document.getElementById("cart-count").textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    // Ensure proper image display with fallback
    const imageUrl = item.image || 'placeholder.png';
    const itemPrice = parseFloat(item.price) || 0;
    const itemQuantity = parseInt(item.quantity) || 1;
    const itemSubtotal = itemPrice * itemQuantity;

    itemDiv.innerHTML = `
      <img src="${imageUrl}" alt="${item.title || 'Product'}" onerror="this.src='placeholder.png'" loading="lazy" />
      <div class="item-details">
        <h4>${item.title || 'Unknown Product'}</h4>
        <p><strong>Category:</strong> ${item.category || 'General'}</p>
        <p><strong>Size:</strong> ${item.size || 'Standard'}</p>
        <p><strong>Unit Price:</strong> ₹${itemPrice.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="decrease" data-index="${index}" ${itemQuantity <= 1 ? 'disabled' : ''}>−</button>
          <span class="qty">${itemQuantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <p><strong>Subtotal:</strong> ₹${itemSubtotal.toFixed(2)}</p>
        <button class="remove-btn" data-index="${index}">
          <i class="fa-solid fa-trash"></i> Remove
        </button>
      </div>
    `;

    cartItemsContainer.appendChild(itemDiv);
  });

  // Add button event listeners with improved error handling
  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      updateQuantity(+e.target.dataset.index, 1);
    });
  });
  
  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      updateQuantity(+e.target.dataset.index, -1);
    });
  });
  
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      if (confirm("Are you sure you want to remove this item from your cart?")) {
        removeItem(+e.target.dataset.index);
      }
    });
  });

  updateCartSummary(cart);
  updateCartCount();
}

function updateQuantity(index, delta) {
  const cart = CartUtils.getCart();
  if (!cart[index]) return;

  const newQuantity = (cart[index].quantity || 1) + delta;
  
  // Prevent quantity from going below 1
  if (newQuantity < 1) {
    return;
  }
  
  // Prevent unreasonably high quantities
  if (newQuantity > 99) {
    alert("Maximum quantity per item is 99");
    return;
  }

  cart[index].quantity = newQuantity;
  CartUtils.saveCart(cart);
  loadCart();
  
  // Show visual feedback
  showQuantityUpdateFeedback(index, newQuantity);
}

function showQuantityUpdateFeedback(index, quantity) {
  const cartItem = document.querySelectorAll('.cart-item')[index];
  if (cartItem) {
    cartItem.style.transform = 'scale(1.02)';
    setTimeout(() => {
      cartItem.style.transform = 'scale(1)';
    }, 200);
  }
}

function updateCartSummary(cart) {
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return sum + (price * quantity);
  }, 0);
  
  const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
  const shipping = cart.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Update display elements
  const elements = {
    'cart-subtotal': subtotal.toFixed(2),
    'cart-shipping': shipping.toFixed(2),
    'cart-total': total.toFixed(2),
    'cart-count': totalItems
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });

  // Enable/disable checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
    checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
  }
  
  // Update cart badge in header
  updateCartBadge(totalItems);
}

function updateCartBadge(count) {
  const cartBadge = document.querySelector('.cart span');
  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'block' : 'none';
  }
}

function removeItem(index) {
  const cart = CartUtils.getCart();
  
  if (!cart[index]) return;
  
  const cartItem = document.querySelectorAll('.cart-item')[index];
  
  // Add removal animation
  if (cartItem) {
    cartItem.style.transition = 'all 0.3s ease';
    cartItem.style.transform = 'translateX(-100%)';
    cartItem.style.opacity = '0';
    
    setTimeout(() => {
      cart.splice(index, 1);
      CartUtils.saveCart(cart);
      loadCart();
      showRemovalFeedback();
    }, 300);
  } else {
    cart.splice(index, 1);
    CartUtils.saveCart(cart);
    loadCart();
  }
}

function showRemovalFeedback() {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <i class="fa-solid fa-check-circle"></i>
    Item removed from cart
  `;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 12px 20px;
    border-radius: 5px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function updateCartCount() {
  const totalItems = CartUtils.getTotalCount();
  const cartIcon = document.querySelector(".cart span");
  if (cartIcon) {
    cartIcon.textContent = totalItems;
  }
}

// Enhanced checkout functionality
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  const continueShoppingBtn = document.getElementById("continue-shopping");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = CartUtils.getCart();
      if (cart.length > 0) {
        // Save cart state before checkout
        sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
        window.location.href = "checkout.html";
      } else {
        alert("Your cart is empty. Please add some items before checkout.");
      }
    });
  }

  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});

// Initialize when page loads
window.addEventListener("DOMContentLoaded", () => {
  loadCart();
});