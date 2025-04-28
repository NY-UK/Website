//--------------------------------------
// GLOBAL VARIABLES
//--------------------------------------
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const deals = [
    { id: 1, name: "All-Terrain Survival Tent", originalPrice: 199.99, dealPrice: 149.99, image: "images/tent.JPG" },
    { id: 2, name: "Carbon Steel Survival Knife", originalPrice: 89.99, dealPrice: 59.99, image: "images/survival-knife.JPG" },
    { id: 3, name: "Fire Starters Kit", originalPrice: 49.99, dealPrice: 29.99, image: "images/firestarter.JPG" }
];

//--------------------------------------
// INITIALIZATION
//--------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    setupFilters();
    setupMenuToggle();
    setupCartButtonHandlers();
    updateCartDisplay();
    setupScrollShrink();

    setupDealCarousel();
});

//--------------------------------------
// LOAD PRODUCTS
//--------------------------------------
function loadProducts() {
    fetch('../data/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
            loadDeals();
            startCountdown(5); // 5-hour countdown
        })
        .catch(error => console.error('Error loading products:', error));
}

//--------------------------------------
// SETUP EVENT LISTENERS
//--------------------------------------
function setupFilters() {
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);
}

function setupMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

function setupCartButtonHandlers() {
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            addToCart(id);
        } else if (event.target.id === 'cart-button' || event.target.id === 'close-cart') {
            toggleCart();
        } else if (event.target.classList.contains('remove-item')) {
            const index = parseInt(event.target.getAttribute('data-index'));
            removeFromCart(index);
        }
    });
}

function setupScrollShrink() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        header.classList.toggle('shrink', window.scrollY > 50);
    });
}

//--------------------------------------
// FILTERING PRODUCTS
//--------------------------------------
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    let filteredProducts = [...products];

    if (category !== 'All') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (sortBy === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    displayProducts(filteredProducts);
}

//--------------------------------------
// DISPLAY PRODUCTS
//--------------------------------------
function displayProducts(productsToDisplay) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const badges = `
            ${product.featured ? `<span class="badge featured">Featured</span>` : ''}
            ${product.sale_price ? `<span class="badge sale">Flash Sale!</span>` : ''}
        `;

        const priceHTML = product.sale_price
            ? `<p><span class="old-price">$${product.price.toFixed(2)}</span> <strong>$${product.sale_price.toFixed(2)}</strong></p>`
            : `<p><strong>$${product.price.toFixed(2)}</strong></p>`;

        productItem.innerHTML = `
            <div class="image-container">
                ${badges}
                <img src="${product.image_url}" alt="${product.name}">
            </div>
            <div class="info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                ${priceHTML}
                <button class="btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;

        productGrid.appendChild(productItem);
    });
}

//--------------------------------------
// CART MANAGEMENT
//--------------------------------------
function addToCart(id) {
    const product = products.find(p => p.id === id) || deals.find(d => d.id === id);
    if (!product) return;

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartCount.textContent = cart.length;
    cartItems.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        const price = item.sale_price || item.dealPrice || item.price;
        total += price;

        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - $${price.toFixed(2)}
            <button class="remove-item" data-index="${index}">❌</button>
        `;
        cartItems.appendChild(li);
    });

    cartTotal.textContent = total.toFixed(2);
}

function toggleCart() {
    document.getElementById('mini-cart').classList.toggle('hidden');
}

//--------------------------------------
// DEALS SECTION
//--------------------------------------
function loadDeals() {
    const dealContainer = document.querySelector('.deal-of-the-day');
    dealContainer.innerHTML = '';

    deals.forEach(deal => {
        const card = document.createElement('div');
        card.className = 'deal-product-card';

        card.innerHTML = `
            <img src="${deal.image}" alt="${deal.name}">
            <h3>${deal.name}</h3>
            <div class="deal-product-prices">
                <span class="original-price">$${deal.originalPrice.toFixed(2)}</span>
                <span class="deal-price">$${deal.dealPrice.toFixed(2)}</span>
            </div>
            <button class="btn-primary add-to-cart" data-id="${deal.id}">Add to Cart</button>
        `;

        dealContainer.appendChild(card);
    });
}

//--------------------------------------
// COUNTDOWN TIMER
//--------------------------------------
function startCountdown(hours = 5) {
    const countdownEl = document.getElementById('deal-countdown');
    let timeLeft = hours * 3600; // seconds

    const timer = setInterval(() => {
        const hoursLeft = Math.floor(timeLeft / 3600);
        const minutesLeft = Math.floor((timeLeft % 3600) / 60);
        const secondsLeft = timeLeft % 60;

        countdownEl.textContent = `Time left: ${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            countdownEl.textContent = "Deal expired!";
        }
    }, 1000);
}

//--------------------------------------
// CAROUSEL STUFF
//--------------------------------------
function setupDealCarousel() {
    const dealContainer = document.getElementById('deal-container');
    const dealDots = document.getElementById('deal-dots');
    const prevButton = document.getElementById('prevDeal');
    const nextButton = document.getElementById('nextDeal');

    let currentDeal = 0;

    function updateCarousel() {
        const deals = document.querySelectorAll('#deal-container .deal-item');
        const offset = currentDeal * -100;
        dealContainer.style.transform = `translateX(${offset}%)`;

        // Update dots
        const dots = document.querySelectorAll('.deal-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentDeal]) {
            dots[currentDeal].classList.add('active');
        }
    }

    function createDots() {
        const deals = document.querySelectorAll('#deal-container .deal-item');
        dealDots.innerHTML = '';
        deals.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('deal-dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentDeal = idx;
                updateCarousel();
            });
            dealDots.appendChild(dot);
        });
    }

    prevButton.addEventListener('click', () => {
        const deals = document.querySelectorAll('#deal-container .deal-item');
        currentDeal = (currentDeal - 1 + deals.length) % deals.length;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        const deals = document.querySelectorAll('#deal-container .deal-item');
        currentDeal = (currentDeal + 1) % deals.length;
        updateCarousel();
    });

    // Initialize carousel right away:
    createDots();
    updateCarousel();
}
