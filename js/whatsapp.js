// whatsapp.js - WhatsApp order integration
(function() {
    const BUSINESS_PHONE = '917397792752'; // +91 73977 92752 in international format
    
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutClose = document.getElementById('checkout-close');
    const checkoutModal = document.getElementById('checkout-modal');

    function formatOrderMessage(customerData, cartItems) {
        const lines = [];
        
        lines.push('🛍️ *JD T-SHIRTS - NEW ORDER*');
        lines.push('═══════════════════════════');
        lines.push('');
        
        // Customer details
        lines.push('👤 *CUSTOMER DETAILS:*');
        lines.push(`Name: ${customerData.name}`);
        lines.push(`WhatsApp: ${customerData.whatsapp}`);
        lines.push(`Address: ${customerData.address}`);
        lines.push('');
        
        // Order items
        lines.push('📦 *ORDER ITEMS:*');
        let total = 0;
        let hasCustomItems = false;
        
        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            lines.push(`${index + 1}. *${item.title}*`);
            lines.push(`   Price: ₹${item.price} × ${item.quantity} = ₹${itemTotal}`);
          
            
            if (item.isCustom) {
                lines.push(`   🎨 *CUSTOM DESIGN* - Image will be attached below`);
                hasCustomItems = true;
            }
            lines.push('');
        });
        
        lines.push('💰 *TOTAL AMOUNT: ₹' + total + '*');
        lines.push('');
        
        if (hasCustomItems) {
            lines.push('📎 *IMPORTANT:*');
            lines.push('Please attach the HIGH-QUALITY design images for custom items in this chat.');
            lines.push('Accepted formats: PNG, JPG, SVG');
            lines.push('');
        }
        
      
        
        return lines.join('\n');
    }

    function openWhatsApp(phoneNumber, message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Open in new tab/window
        window.open(whatsappURL, '_blank');
    }

    // Handle checkout form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const customerData = {
            name: document.getElementById('customer-name').value.trim(),
            whatsapp: document.getElementById('customer-whatsapp').value.trim(),
            address: document.getElementById('customer-address').value.trim()
        };

        // Validate required fields
        if (!customerData.name || !customerData.whatsapp || !customerData.address) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate WhatsApp number format
        const whatsappRegex = /^(\+91|91)?[6789]\d{9}$/;
        const cleanNumber = customerData.whatsapp.replace(/\s+/g, '');
        if (!whatsappRegex.test(cleanNumber)) {
            alert('Please enter a valid Indian WhatsApp number');
            return;
        }

        const cart = window.getCart();
        if (!cart || cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Format and send WhatsApp message
        const message = formatOrderMessage(customerData, cart);
        openWhatsApp(BUSINESS_PHONE, message);

        // Clear cart and close modal
        window.clearCartData();
        checkoutModal.style.display = 'none';
        
        // Reset form
        checkoutForm.reset();
        
        // Show success message
        if (window.showNotification) {
            window.showNotification = (msg, type) => {
                const notification = document.getElementById('notification');
                const notificationText = document.getElementById('notification-text');
                notificationText.textContent = msg;
                notification.className = `notification ${type} show`;
                setTimeout(() => notification.classList.remove('show'), 5000);
            };
        }
        
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        notificationText.textContent = 'Order sent via WhatsApp! Please attach design images for custom items.';
        notification.className = 'notification success show';
        setTimeout(() => notification.classList.remove('show'), 5000);
    });

    // Close checkout modal
    checkoutClose.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
})();