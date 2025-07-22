const CartUtils = {
  // Get cart from localStorage
  getCart: function () {
    return JSON.parse(localStorage.getItem("cart")) || [];
  },

  // Save cart to localStorage
  saveCart: function (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  // Add item to cart with duplicate check
  addToCart: function (newItem) {
    const cart = this.getCart();
    const index = cart.findIndex(item => item.uniqueId === newItem.uniqueId);

    if (index !== -1) {
      // If item exists, increase quantity
      cart[index].quantity += newItem.quantity;
      this.saveCart(cart);
      return { success: true, message: "Item quantity updated in cart!" };
    } else {
      // Else add as new item
      cart.push(newItem);
      this.saveCart(cart);
      return { success: true, message: "Item added to cart!" };
    }
  },

  // Remove item by unique ID
  removeFromCart: function (uniqueId) {
    const cart = this.getCart().filter(item => item.uniqueId !== uniqueId);
    this.saveCart(cart);
  },

  // Get total item count
  getCartCount: function () {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }
};
