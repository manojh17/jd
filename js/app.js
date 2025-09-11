// app.js - Main application logic with color selection
(function() {
    const productsContainer = document.getElementById('products-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    // Smooth scrolling for navigation
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = 90;
            const elementPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            smoothScroll(target);
        });
    });

    // Handle mobile navigation clicks
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Update active nav link
            mobileNavLinks.forEach(l => l.classList.remove('active'));
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            
            smoothScroll(target);
        });
    });

    // Handle hero section buttons
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Close mobile menu if open
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            
            smoothScroll(target);
        });
    });

    // Create product card with color options
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Get first color as default
        const defaultColor = Object.keys(product.colors)[0];
        const defaultColorData = product.colors[defaultColor];
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${defaultColorData.img}" alt="${product.title}" loading="lazy" class="main-product-image">
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-description">${product.description}</div>
                
                <div class="color-selection" style="margin: 1rem 0;">
                    <label style="font-size: 0.9rem; font-weight: 500; margin-bottom: 0.5rem; display: block;">Color:</label>
                    <div class="product-color-options" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        ${Object.entries(product.colors).map(([color, data]) => `
                            <div class="product-color-option ${color === defaultColor ? 'active' : ''}" 
                                 data-color="${color}" 
                                 data-img="${data.img}" 
                                 data-price="${data.price}"
                                 style="width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 2px solid ${color === defaultColor ? 'var(--accent-color)' : 'transparent'}; background-color: ${color}; transition: all 0.3s ease;"
                                 title="${color.charAt(0).toUpperCase() + color.slice(1)}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    <label style="flex: 1;">
                        Size:
                        <select class="size-select" style="width: 100%; padding: 0.25rem; margin-top: 0.25rem; border: 1px dotted #ccc; border-radius: 4px;">
                            <option value="S">S</option>
                            <option value="M" selected>M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </label>
                    
                </div>
                
                <div class="product-price" data-base-price="${defaultColorData.price}">₹${defaultColorData.price}</div>
                <button class="btn add-to-cart-btn" style="width: 100%; margin-top: 0.5rem;">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
            </div>
        `;

        // Handle color selection
        const colorOptions = card.querySelectorAll('.product-color-option');
        const mainImage = card.querySelector('.main-product-image');
        const priceElement = card.querySelector('.product-price');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                colorOptions.forEach(opt => {
                    opt.classList.remove('active');
                    opt.style.border = '2px solid transparent';
                });
                
                // Add active class to clicked option
                option.classList.add('active');
                option.style.border = '2px solid var(--accent-color)';
                
                // Update image and price
                const newImg = option.dataset.img;
                const newPrice = option.dataset.price;
                
                mainImage.src = newImg;
                priceElement.textContent = `₹${newPrice}`;
                priceElement.dataset.basePrice = newPrice;
            });
        });

        // Add event listener for add to cart
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            const sizeSelect = card.querySelector('.size-select');
            
            const activeColor = card.querySelector('.product-color-option.active');
            const selectedColor = activeColor.dataset.color;
            const selectedPrice = parseInt(activeColor.dataset.price);
            const selectedImg = activeColor.dataset.img;
            
            const productToAdd = {
                id: `${product.id}-${selectedColor}`,
                title: product.title,
                price: selectedPrice,
                category: product.category,
                img: selectedImg,
                size: sizeSelect.value,
               
                color: selectedColor,
                isCustom: false,
                quantity: 1
            };

            if (window.addToCart) {
                window.addToCart(productToAdd);
            }
        });

        return card;
    }

    // Render products
    function renderProducts(filter = 'all') {
        productsContainer.innerHTML = '';
        
        if (!window.JD_PRODUCTS) {
            productsContainer.innerHTML = '<p>Loading products...</p>';
            return;
        }

        const filteredProducts = window.JD_PRODUCTS.filter(product => 
            filter === 'all' || product.category === filter
        );

        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found in this category.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            productsContainer.appendChild(createProductCard(product));
        });
    }

    // Handle filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            const filter = btn.dataset.filter;
            renderProducts(filter);
        });
    });

    // Update active nav on scroll
    function updateActiveNav() {
        const sections = ['home', 'products', 'custom', 'about', 'contact'];
        const scrollPos = window.scrollY + 100;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const navLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (section && navLink) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    mobileNavLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                    
                    // Update mobile nav active state
                    const mobileNavLink = document.querySelector(`.mobile-nav-link[href="#${sectionId}"]`);
                    if (mobileNavLink) {
                        mobileNavLink.classList.add('active');
                    }
                }
            }
        });
    }

    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNav, 100);
    });

    // Fade in animation for elements
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    // Add fade-in class to elements that should animate
    document.addEventListener('DOMContentLoaded', () => {
        const animateElements = document.querySelectorAll('.product-card, .contact-item, .about-content > div');
        animateElements.forEach(el => el.classList.add('fade-in'));
        
        handleScrollAnimations();
    });

    window.addEventListener('scroll', handleScrollAnimations);

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        renderProducts('all');
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        // Any resize-specific logic can go here
    });
})();