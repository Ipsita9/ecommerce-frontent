// Get product ID from URL
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Fetch product data from fakestoreapi.com
async function fetchProduct(id) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return await res.json();
}

// Render product detail with size, quantity, price, and cart button
function renderProduct(product) {
  const imageHTML = `
    <div class="image-zoom-wrapper">
      <img src="${product.image}" alt="${product.title}" />
    </div>
  `;

  const infoHTML = `
    <div class="details">
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p class="price">Price: ₹<span id="unit-price">${(product.price * 80).toFixed(2)}</span></p>

      <label for="size">Size:</label>
      <select id="size">
        <option value="S">S</option>
        <option value="M" selected>M</option>
        <option value="L">L</option>
      </select>

      <div class="quantity" style="margin: 10px 0;">
        <button id="decrease">−</button>
        <span id="quantity">1</span>
        <button id="increase">+</button>
      </div>

      <p class="total">Total: ₹<span id="total-price">${(product.price * 80).toFixed(2)}</span></p>

      <button id="add-to-cart">Add to Cart</button>
      <p id="feedback" style="display:none;color:green;">✅ Added to cart!</p>
    </div>
  `;

  // Insert content into page
  document.getElementById("product-image-wrapper").innerHTML = imageHTML;
  document.getElementById("product-info").innerHTML = infoHTML;

  // Quantity functionality
//   let quantity = 1;
//   const quantitySpan = document.getElementById("quantity");
//   const totalSpan = document.getElementById("total-price");
//   const unitPrice = parseFloat(document.getElementById("unit-price").textContent);

//   const updateTotal = () => {
//     totalSpan.textContent = (unitPrice * quantity).toFixed(2);
//   };

//   document.getElementById("increase").onclick = () => {
//     quantity++;
//     quantitySpan.textContent = quantity;
//     updateTotal();
//   };

//   document.getElementById("decrease").onclick = () => {
//     if (quantity > 1) {
//       quantity--;
//       quantitySpan.textContent = quantity;
//       updateTotal();
//     }
//   };

//   // Add to cart with size and quantity
//   document.getElementById("add-to-cart").addEventListener("click", () => {
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];
//     const size = document.getElementById("size").value;

//     cart.push({
//       id: product.id,
//       title: product.title,
//       price: product.price,
//       image: product.image,
//       size,
//       quantity,
//     });

//     localStorage.setItem("cart", JSON.stringify(cart));
//     updateCartCount();
//     document.getElementById("feedback").style.display = "block";
//   });
// }

// // Update cart icon count
// function updateCartCount() {
//   const cart = JSON.parse(localStorage.getItem("cart")) || [];
//   const cartCountElement = document.querySelector(".cart span");
//   if (cartCountElement) {
//     cartCountElement.textContent = cart.length;
//   }
// }

// // Main logic: fetch product & render
// window.addEventListener("DOMContentLoaded", async () => {
//   updateCartCount();
//   const id = getProductIdFromUrl();
//   if (id) {
//     const product = await fetchProduct(id);
//     renderProduct(product);
//   }
// });
   let quantity = 1;
    const quantitySpan = document.getElementById("quantity");
    const totalSpan = document.getElementById("total-price");
    const unitPrice = parseFloat(document.getElementById("unit-price").textContent);

    const updateTotal = () => {
      totalSpan.textContent = (unitPrice * quantity).toFixed(2);
    };

    document.getElementById("increase").onclick = () => {
      quantity++;
      quantitySpan.textContent = quantity;
      updateTotal();
    };

    document.getElementById("decrease").onclick = () => {
      if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
        updateTotal();
      }
    };

    // Add to cart with duplicate check
    document.getElementById("add-to-cart").addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const size = document.getElementById("size").value;

      const uniqueId = `${product.id}-${size}`; // handle variations
      const existingIndex = cart.findIndex(item => item.id === uniqueId || item.uniqueId === uniqueId);

      if (existingIndex !== -1) {
        // Update quantity if same item exists
        cart[existingIndex].quantity += quantity;
        document.getElementById("feedback").textContent = "✅ Quantity updated in cart!";
      } else {
        // Add new item
        cart.push({
          id: product.id,
          uniqueId: uniqueId,
          title: product.title,
          price: parseFloat((product.price * 80).toFixed(2)),  // converted to INR
          image: product.image,
          size,
          quantity,
        });
        document.getElementById("feedback").textContent = "✅ Added to cart!";
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      document.getElementById("feedback").style.display = "block";
      
      // Hide feedback after 3 seconds
      setTimeout(() => {
        document.getElementById("feedback").style.display = "none";
      }, 3000);
    });
  }

  // Update total cart quantity
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartIcon = document.querySelector(".cart span");
    if (cartIcon) {
      cartIcon.textContent = totalItems;
    }
  }

  // Main logic
  window.addEventListener("DOMContentLoaded", async () => {
    updateCartCount();
    const id = getProductIdFromUrl();
    if (id) {
      const product = await fetchProduct(id);
      renderProduct(product);
    }
  });