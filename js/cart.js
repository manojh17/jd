// cart.js - Shopping cart management
(function() {
    const CART_KEY = 'jd_cart_v1';
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

    // DOM elements
    const cartCountEl = document.getElementById('cart-count');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const cartClose = document.getElementById('cart-close');
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Notification elements
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    const notificationClose = document.getElementById('notification-close');

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountEl.textContent = totalItems;
    }

    function showNotification(message, type = 'success') {
        notificationText.textContent = message;
        notification.className = `notification ${type} show`;
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    function addToCart(product) {
        const existingItem = cart.find(item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color && 
         
            item.isCustom === product.isCustom
        );

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        saveCart();
        showNotification('Item added to cart!');
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        renderCartItems();
    }

    function updateQuantity(index, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(index);
        } else {
            cart[index].quantity = newQuantity;
            saveCart();
            renderCartItems();
        }
    }

    function clearCart() {
        if (confirm('Are you sure you want to clear the cart?')) {
            cart = [];
            saveCart();
            renderCartItems();
            showNotification('Cart cleared');
        }
    }

    function renderCartItems() {
        cartItemsEl.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Your cart is empty</p>';
            cartTotalEl.textContent = '₹0';
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <img src="${item.img || 'https://via.placeholder.com/80'}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}${item.isCustom ? ' (Custom)' : ''}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="custom-design-info">
                        Size: ${item.size || 'M'} | Color: ${item.color || 'White'} }
                        ${item.isCustom ? '<br><small style="color: var(--accent-color);">Custom design included</small>' : ''}
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${index}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
            
            cartItemsEl.appendChild(cartItem);
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = `₹${total}`;
    }

    // Event listeners
    cartIcon.addEventListener('click', () => {
        renderCartItems();
        cartModal.style.display = 'block';
    });

    cartClose.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    clearCartBtn.addEventListener('click', clearCart);

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        cartModal.style.display = 'none';
        openCheckoutModal();
    });

    notificationClose.addEventListener('click', () => {
        notification.classList.remove('show');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    function openCheckoutModal() {
        const checkoutModal = document.getElementById('checkout-modal');
        const checkoutItemsEl = document.getElementById('checkout-items');
        const checkoutTotalEl = document.getElementById('checkout-total');

        // Render checkout items
        checkoutItemsEl.innerHTML = '';
        cart.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-custom-preview';
            
            checkoutItem.innerHTML = `
                <div class="garment-mini">
                    <img class="garment" src="${item.img || 'https://via.placeholder.com/80'}" alt="${item.title}">
                    ${item.designImage ? `<img class="design" src="${item.designImage}" style="position:absolute;left:10px;top:10px;max-width:40px;max-height:40px;">` : ''}
                </div>
                <div class="checkout-custom-details">
                    <h5>${item.title}${item.isCustom ? ' (Custom)' : ''}</h5>
                    <p>Price: ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>
                    <p>Size: ${item.size || 'M'} | Color: ${item.color || 'White'} }</p>
                    ${item.isCustom ? '<p style="color: var(--accent-color); font-weight: 500;"><i class="fas fa-palette"></i> Custom design will be attached in WhatsApp</p>' : ''}
                </div>
            `;
            
            checkoutItemsEl.appendChild(checkoutItem);
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        checkoutTotalEl.textContent = `₹${total}`;

        checkoutModal.style.display = 'block';
    }

    // Make functions available globally
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
    window.getCart = () => cart;
    window.clearCartData = () => {
        cart = [];
        saveCart();
    };

    // Initialize
    updateCartCount();
})();