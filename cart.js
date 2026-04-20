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

// Helper to create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">₱${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    return card;
}

// Cart Functions
function addToCart(productId) {
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
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = count;
    }
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

// Initial count update
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        updateCartCount();
        updateAuthLink();
    });
}
