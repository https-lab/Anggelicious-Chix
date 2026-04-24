// Product Data
const products = [
    { id: 1, name: "Classic Fried Chicken", price: 99.00, image: "images/Classic Fried Chicken.jpg" },
    { id: 2, name: "Spicy Wings (6pcs)", price: 149.00, image: "images/Spicy Wings.jpg" },
    { id: 3, name: "Chicken Fillet with Rice", price: 119.00, image: "images/Chicken Fillet with Rice.webp" },
    { id: 4, name: "Garlic Parmesan Chix", price: 159.00, image: "images/Garlic Parmesan Chix.jpg" },
    { id: 5, name: "Korean Soy Garlic Chix", price: 169.00, image: "images/Korean Soy Garlic Chix.jpg" },
    { id: 6, name: "Honey Glazed Chix", price: 159.00, image: "images/Honey Glazed Chix.jpg" },
    { id: 7, name: "Chicken Burger", price: 89.00, image: "images/Chicken Burger.jpg" },
    { id: 8, name: "Buffalo Wings (12pcs)", price: 279.00, image: "images/Buffalo Wings.jpg" },
    { id: 9, name: "Family Bucket (8pcs)", price: 549.00, image: "images/Family Bucket.jpg" },
    { id: 10, name: "Salted Egg Chix", price: 179.00, image: "images/Salted Egg Chix.jpg" },
    { id: 11, name: "BBQ Glazed Chicken", price: 159.00, image: "images/BBQ Glazed Chicken.jpg" },
    { id: 12, name: "Chicken Tenders (5pcs)", price: 129.00, image: "images/Chicken Tenders.jpg" },
    { id: 13, name: "Cheesy Fried Chicken", price: 169.00, image: "images/Cheesy Fried Chicken.jpg" },
    { id: 14, name: "Chicken & Waffles", price: 199.00, image: "images/Chicken and Waffles.jpg" },
    { id: 15, name: "Lemon Glazed Chix", price: 159.00, image: "images/Lemon Glazed Chix.jpg" },
    { id: 16, name: "Spicy Chicken Sandwich", price: 129.00, image: "images/Spicy Chicken Sandwich.jpg" },
    { id: 17, name: "Buttermilk Fried Chix", price: 149.00, image: "images/Buttermilk Fried Chix.jpg" },
    { id: 18, name: "Teriyaki Wings", price: 159.00, image: "images/Teriyaki Wings.webp" },
    { id: 19, name: "Chicken Salad", price: 139.00, image: "images/Chicken Salad.jpg" },
    { id: 20, name: "Extra Large Chicken Leg", price: 89.00, image: "images/Extra Large Chicken Leg.jpg" }
];

let previewProductId = null;
let previewQuantity = 1;

// Helper to create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" data-preview-image>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">₱${product.price.toFixed(2)}</p>
            <button class="add-to-cart" type="button">Add to Cart</button>
        </div>
    `;

    const image = card.querySelector('[data-preview-image]');
    const addBtn = card.querySelector('.add-to-cart');

    image.addEventListener('click', () => {
        openImagePreview(product);
    });

    addBtn.addEventListener('click', () => {
        addToCart(product.id, 1);
    });

    return card;
}

// Cart Functions
function addToCart(productId, quantity = 1) {
    if (!localStorage.getItem('isLoggedIn')) {
        showNotification('Please login first to add products to your cart.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    const product = products.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElements = [
        document.getElementById('cart-count'),
        document.getElementById('mobile-cart-count')
    ];
    countElements.forEach((countElement) => {
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

// Auth Functions
function updateAuthLink() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;

    if (localStorage.getItem('isLoggedIn')) {
        authLink.textContent = 'LOGOUT';
        authLink.href = '#';
        authLink.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            showNotification('Logged out successfully.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        };
    } else {
        authLink.textContent = 'MEMBER LOGIN';
        authLink.href = 'login.html';
        authLink.onclick = null;
    }
}

// Notification Function
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

function initImagePreviewModal() {
    if (document.getElementById('image-preview-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'image-preview-modal';
    modal.className = 'image-preview-modal';
    modal.innerHTML = `
        <div class="image-preview-backdrop" data-close-preview></div>
        <div class="image-preview-content" role="dialog" aria-modal="true">
            <button class="image-preview-close" type="button" aria-label="Close preview" data-close-preview>&times;</button>
            <img src="" alt="" id="image-preview-target">
            <p id="image-preview-name"></p>
            <div class="image-preview-actions">
                <div class="product-qty-controls">
                    <button class="qty-btn" type="button" id="preview-qty-minus">-</button>
                    <span class="qty-val" id="preview-qty-value">1</span>
                    <button class="qty-btn" type="button" id="preview-qty-plus">+</button>
                </div>
                <button class="add-to-cart" type="button" id="preview-add-to-cart">Add to Cart</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (event) => {
        if (event.target.dataset.closePreview !== undefined) {
            closeImagePreview();
        }
    });

    const minusBtn = document.getElementById('preview-qty-minus');
    const plusBtn = document.getElementById('preview-qty-plus');
    const addBtn = document.getElementById('preview-add-to-cart');

    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            previewQuantity = Math.max(1, previewQuantity - 1);
            updatePreviewQuantityDisplay();
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            previewQuantity += 1;
            updatePreviewQuantityDisplay();
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (!previewProductId) return;
            addToCart(previewProductId, previewQuantity);
            closeImagePreview();
        });
    }
}

function updatePreviewQuantityDisplay() {
    const qtyElement = document.getElementById('preview-qty-value');
    if (qtyElement) {
        qtyElement.textContent = String(previewQuantity);
    }
}

function openImagePreview(product) {
    const modal = document.getElementById('image-preview-modal');
    const previewImage = document.getElementById('image-preview-target');
    const previewName = document.getElementById('image-preview-name');

    if (!modal || !previewImage || !previewName) return;

    previewProductId = product.id;
    previewQuantity = 1;
    updatePreviewQuantityDisplay();

    previewImage.src = product.image;
    previewImage.alt = product.name;
    previewName.textContent = `${product.name} - ₱${product.price.toFixed(2)}`;
    modal.classList.add('is-open');
}

function closeImagePreview() {
    const modal = document.getElementById('image-preview-modal');
    if (modal) {
        modal.classList.remove('is-open');
    }
}

function initMobileHeaderMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('header nav');
    const navList = nav ? nav.querySelector('ul') : null;
    const existingCart = navList ? navList.querySelector('.cart-icon') : null;

    if (!header || !nav || !navList || !existingCart || header.querySelector('.mobile-header-actions')) return;

    const actions = document.createElement('div');
    actions.className = 'mobile-header-actions';
    actions.innerHTML = `
        <a href="cart.html" class="cart-icon mobile-cart-shortcut" aria-label="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count" id="mobile-cart-count">0</span>
        </a>
        <button type="button" class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    `;

    header.appendChild(actions);

    const toggleBtn = actions.querySelector('.menu-toggle');
    toggleBtn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('mobile-open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('mobile-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Initial count update
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initImagePreviewModal();
        initMobileHeaderMenu();
        updateCartCount();
        updateAuthLink();
    });
}
