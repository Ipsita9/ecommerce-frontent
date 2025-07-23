
// Checkout page functionality
document.addEventListener("DOMContentLoaded", () => {
    loadCheckoutItems();
    setupPaymentMethodToggle();
    setupFormValidation();
    setupCardFormatting();
    updateCartCount();
});

function loadCheckoutItems() {
    const cart = CartUtils.getCart();
    const checkoutItemsContainer = document.getElementById("checkout-items");
    
    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = `
            <div class="empty-checkout">
                <p>Your cart is empty!</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        document.getElementById("place-order-btn").disabled = true;
        return;
    }

    checkoutItemsContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemDiv = document.createElement("div");
        itemDiv.className = "checkout-item";
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}" />
            <div class="item-info">
                <h4>${item.title}</h4>
                <p>Size: ${item.size || 'M'}</p>
                <p>Qty: ${item.quantity}</p>
            </div>
            <div class="item-price">$${itemTotal.toFixed(2)}</div>
        `;
        checkoutItemsContainer.appendChild(itemDiv);
    });

    updateOrderSummary(subtotal);
}

function updateOrderSummary(subtotal) {
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("shipping").textContent = shipping.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("final-total").textContent = total.toFixed(2);

    // Free shipping indicator
    if (shipping === 0) {
        document.getElementById("shipping").parentElement.innerHTML = `
            <span>Shipping:</span>
            <span style="color: green;">FREE</span>
        `;
    }
}

function setupPaymentMethodToggle() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById("card-details");

    paymentOptions.forEach(option => {
        option.addEventListener("change", (e) => {
            if (e.target.value === "credit-card") {
                cardDetails.style.display = "block";
                setCardFieldsRequired(true);
            } else {
                cardDetails.style.display = "none";
                setCardFieldsRequired(false);
            }
        });
    });
}

function setCardFieldsRequired(required) {
    const cardFields = ["cardNumber", "expiryDate", "cvv", "cardName"];
    cardFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (required) {
                field.setAttribute("required", "");
            } else {
                field.removeAttribute("required");
            }
        }
    });
}

function setupCardFormatting() {
    // Format card number
    document.getElementById("cardNumber").addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
        e.target.value = formattedValue;
    });

    // Format expiry date
    document.getElementById("expiryDate").addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) {
            value = value.substring(0, 2) + "/" + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // CVV numbers only
    document.getElementById("cvv").addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
    });
}

function setupFormValidation() {
    document.getElementById("place-order-btn").addEventListener("click", (e) => {
        e.preventDefault();
        
        if (validateAllForms()) {
            processOrder();
        }
    });
}

function validateAllForms() {
    const requiredFields = document.querySelectorAll("input[required], select[required]");
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = "#ff4444";
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            field.style.borderColor = "#ddd";
        }
    });

    // Validate email format
    const email = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        email.style.borderColor = "#ff4444";
        isValid = false;
        if (!firstInvalidField) firstInvalidField = email;
    }

    // Validate card number if credit card is selected
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    if (paymentMethod === "credit-card") {
        const cardNumber = document.getElementById("cardNumber");
        if (cardNumber.value.replace(/\s/g, "").length < 13) {
            cardNumber.style.borderColor = "#ff4444";
            isValid = false;
            if (!firstInvalidField) firstInvalidField = cardNumber;
        }
    }

    if (!isValid) {
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        showNotification("Please fill in all required fields correctly.", "error");
    }

    return isValid;
}

function processOrder() {
    const orderButton = document.getElementById("place-order-btn");
    const originalText = orderButton.innerHTML;
    
    // Show loading state
    orderButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    orderButton.disabled = true;

    // Simulate order processing
    setTimeout(() => {
        const orderData = collectOrderData();
        
        // Save order to localStorage (in real app, send to server)
        saveOrder(orderData);
        
        // Clear cart
        CartUtils.saveCart([]);
        
        // Show success and redirect
        showOrderConfirmation(orderData);
        
    }, 2000);
}

function collectOrderData() {
    const cart = CartUtils.getCart();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    return {
        orderId: 'ORD-' + Date.now(),
        timestamp: new Date().toISOString(),
        customer: {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        },
        shipping: {
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            zipCode: document.getElementById("zipCode").value,
            country: document.getElementById("country").value
        },
        payment: {
            method: paymentMethod,
            // Don't store actual card details in real app
        },
        items: cart,
        totals: {
            subtotal: parseFloat(document.getElementById("subtotal").textContent),
            shipping: parseFloat(document.getElementById("shipping").textContent),
            tax: parseFloat(document.getElementById("tax").textContent),
            total: parseFloat(document.getElementById("final-total").textContent)
        }
    };
}

function saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(orders));
}

function showOrderConfirmation(orderData) {
    // Create confirmation modal
    const modal = document.createElement("div");
    modal.className = "order-confirmation-modal";
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">
                <i class="fa-solid fa-check-circle"></i>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase, ${orderData.customer.firstName}!</p>
            <div class="order-details">
                <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                <p><strong>Total:</strong> $${orderData.totals.total.toFixed(2)}</p>
                <p><strong>Email:</strong> ${orderData.customer.email}</p>
            </div>
            <p>A confirmation email has been sent to your email address.</p>
            <div class="modal-actions">
                <button onclick="redirectToHome()" class="btn">Continue Shopping</button>
                <button onclick="viewOrderHistory()" class="btn btn-secondary">View Orders</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto redirect after 10 seconds
    setTimeout(() => {
        redirectToHome();
    }, 10000);
}

function redirectToHome() {
    window.location.href = "index.html";
}

function viewOrderHistory() {
    // In a real app, this would go to an orders page
    alert("Order history feature coming soon!");
    redirectToHome();
}

function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fa-solid fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function updateCartCount() {
    const totalItems = CartUtils.getTotalCount();
    const cartIcon = document.querySelector(".cart span");
    if (cartIcon) {
        cartIcon.textContent = totalItems;
    }
}
