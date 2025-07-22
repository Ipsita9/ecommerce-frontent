
// Cart utility functions
const CartUtils = {
  // Get cart from localStorage
  getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  },

  // Save cart to localStorage
  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  // Add item to cart with duplicate check
  addToCart(item) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(cartItem => 
      cartItem.uniqueId === item.uniqueId ||
      (cartItem.id === item.id && cartItem.size === item.size)
    );

    if (existingIndex !== -1) {
      // Update quantity for existing item
      cart[existingIndex].quantity += item.quantity || 1;
      return { success: true, message: "Quantity updated in cart!", isUpdate: true };
    } else {
      // Add new item
      cart.push({
        ...item,
        uniqueId: item.uniqueId || `${item.id}-${item.size || 'default'}`
      });
      return { success: true, message: "Added to cart!", isUpdate: false };
    }
  },

  // Remove duplicates from existing cart
  removeDuplicates() {
    const cart = this.getCart();
    const uniqueCart = [];
    const seen = new Set();

    cart.forEach(item => {
      const uniqueKey = item.uniqueId || `${item.id}-${item.size || 'default'}`;
      
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        uniqueCart.push({
          ...item,
          uniqueId: uniqueKey
        });
      } else {
        // If duplicate found, merge quantities
        const existingItem = uniqueCart.find(u => u.uniqueId === uniqueKey);
        if (existingItem) {
          existingItem.quantity += item.quantity || 1;
        }
      }
    });

    this.saveCart(uniqueCart);
    return uniqueCart;
  },

  // Get total item count
  getTotalCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }
};

// Make CartUtils available globally
window.CartUtils = CartUtils;
