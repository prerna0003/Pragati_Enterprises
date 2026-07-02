
        // Sample product data
        const products = [
            {
                id: 1,
                name: "Royal Banarasi Silk Saree",
                image: "https://placehold.co/500x700",
                alt: "Deep maroon Banarasi silk saree with intricate gold peacock motif pallu and heavy zari border",
                category: "Banarasi Silk",
                price: 8999,
                originalPrice: 12999,
                tag: "Bestseller",
                inStock: true
            },
            {
                id: 2,
                name: "Traditional Kanjivaram Saree",
                image: "https://placehold.co/500x700",
                alt: "Vibrant green Kanjivaram silk saree with golden temple border and ruby red stripes",
                category: "Kanjivaram",
                price: 12500,
                originalPrice: 15999,
                tag: "New",
                inStock: true
            },
            {
                id: 3,
                name: "Lightweight Chanderi Cotton",
                image: "https://placehold.co/500x700",
                alt: "Sky blue Chanderi cotton saree with delicate gold coin motifs and minimal border",
                category: "Chanderi",
                price: 4299,
                originalPrice: 5599,
                tag: "",
                inStock: true
            },
            {
                id: 4,
                name: "Tussar Silk with Tribal Prints",
                image: "https://placehold.co/500x700",
                alt: "Earthy mustard yellow Tussar silk saree with geometric hand-block prints in maroon",
                category: "Tussar Silk",
                price: 6499,
                originalPrice: 8499,
                tag: "Limited Edition",
                inStock: true
            },
            {
                id: 5,
                name: "Bridal Banarasi Red",
                image: "https://placehold.co/500x700",
                alt: "Rich red Banarasi silk wedding saree with elaborate gold brocade work and floral border",
                category: "Banarasi Silk",
                price: 18999,
                originalPrice: 24999,
                tag: "Premium",
                inStock: true
            },
            {
                id: 6,
                name: "Soft Silk Daily Wear",
                image: "https://placehold.co/500x700",
                alt: "Pastel pink soft silk saree with subtle silver thread work and narrow border",
                category: "Silk",
                price: 5699,
                originalPrice: 6999,
                tag: "Everyday Elegance",
                inStock: true
            }
        ];

        // Cart functionality
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // DOM Elements
        const productContainer = document.getElementById('product-container');
        const cartIcon = document.getElementById('cart-icon');
        const cartModal = document.getElementById('cart-modal');
        const closeModal = document.querySelector('.close-modal');
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartCount = document.querySelector('.cart-count');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');

        // Render products
        function renderProducts() {
            productContainer.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.alt}">
                        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
                        <div class="product-actions">
                            <button title="Quick View">
                                👁
                            </button>
                            <button title="Add to Wishlist">
                                ♥
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.category}</p>
                        <div class="product-price">
                            <div>
                                <span class="price">₹${product.price.toLocaleString()}</span>
                                ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : ''}
                            </div>
                            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                `;
                productContainer.appendChild(productCard);
            });
        }

        // Render cart items
        function renderCartItems() {
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <img src="https://placehold.co/300x300" alt="Empty shopping cart illustration with soft pastel background">
                        <p>Your cart is empty</p>
                        <a href="#shop" class="cta-button">Continue Shopping</a>
                    </div>
                `;
                return;
            }
            
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (!product) return;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${product.image}" alt="${product.alt}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${product.name}</h4>
                        <p class="cart-item-price">₹${product.price.toLocaleString()}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${product.id}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${product.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${product.id}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            
            updateCartTotals();
        }

        // Update cart totals
        function updateCartTotals() {
            const subtotal = cart.reduce((sum, item) => {
                const product = products.find(p => p.id === item.id);
                return sum + (product.price * item.quantity);
            }, 0);
            
            cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
            cartTotal.textContent = `₹${subtotal.toLocaleString()}`;
            
            // Update cart count
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Add to cart
        function addToCart(productId) {
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }
            
            updateCartTotals();
            renderCartItems();
        }

        // Remove from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            renderCartItems();
        }

        // Update quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (!item) return;
            
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCartTotals();
                renderCartItems();
            }
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            renderCartItems();
        });

        // Add to cart button
        productContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                addToCart(productId);
            }
        });

        // Cart modal
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'flex';
        });

        closeModal.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });

        // Cart item controls
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('decrease')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                updateQuantity(productId, -1);
            } else if (e.target.classList.contains('increase')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                updateQuantity(productId, 1);
            } else if (e.target.classList.contains('remove-item')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(productId);
            }
        });
    