
// Test script to add sample products to cart for testing
function populateCartWithTestData() {
  const testProducts = [
    {
      id: 1,
      title: "Fjallraven - Foldsack No. 1 Backpack",
      price: 109.95,
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      category: "men's clothing",
      size: "L",
      quantity: 2,
      uniqueId: "1-L"
    },
    {
      id: 2,
      title: "Mens Casual Premium Slim Fit T-Shirts",
      price: 22.3,
      image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
      category: "men's clothing",
      size: "M",
      quantity: 1,
      uniqueId: "2-M"
    },
    {
      id: 3,
      title: "Mens Cotton Jacket",
      price: 55.99,
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      category: "men's clothing",
      size: "XL",
      quantity: 1,
      uniqueId: "3-XL"
    }
  ];

  // Clear existing cart and add test data
  CartUtils.saveCart(testProducts);
  console.log("Test cart data added!");
  
  // Reload cart if on cart page
  if (typeof loadCart === 'function') {
    loadCart();
  }
  
  // Update cart count
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
}

// Add a button to test cart functionality (for development)
if (window.location.pathname.includes('cart.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.createElement('button');
    testButton.textContent = 'Add Test Data';
    testButton.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: #007bff;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      z-index: 1000;
      cursor: pointer;
    `;
    testButton.onclick = populateCartWithTestData;
    document.body.appendChild(testButton);
  });
}
