//--------------------------------------
// GLOBAL VARIABLES
//--------------------------------------
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const deals = [
    {
        id: 1,
        name: "All-Terrain Survival Tent",
        originalPrice: 199.99,
        dealPrice: 149.99,
        image: "images/tent.JPG"
    },
    {
        id: 2,
        name: "Carbon Steel Survival Knife",
        originalPrice: 89.99,
        dealPrice: 59.99,
        image: "images/survival-knife.JPG"
    },
    {
        id: 3,
        name: "Fire Starters Kit",
        originalPrice: 49.99,
        dealPrice: 29.99,
        image: "images/firestarter.JPG"
    }
];

//--------------------------------------
// INITIALIZATION
//--------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    updateCartDisplay();
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
// EVENT LISTENERS
//--------------------------------------
function setupEventListeners() {
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);

    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.addEventListener('click', handleDocumentClick);
    
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        header.classList.toggle('shrink', window.scrollY > 50);
    });
}

function handleDocumentClick(event) {
    if (event.target.classList.contains('add-to-cart')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        addToCart(id);
    } else if (event.target.id === 'cart-button' || event.target.id === 'close-cart') {
        toggleCart();
    } else if (event.target.classList.contains('remove-item')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        removeFromCart(index);
    }
}

//--------------------------------------
// FILTERING AND SORTING
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
// PRODUCT DISPLAY
//--------------------------------------
function displayProducts(productsToDisplay) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        let badges = '';
        if (product.featured) badges += `<span class="badge featured">Featured</span>`;
        if (product.sale_price) badges += `<span class="badge sale">Flash Sale!</span>`;

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
// CART FUNCTIONS
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
    const dealContainer = document.querySelector('.deal-products');
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
            <button onclick="addToCart(${deal.id})">Add to Cart</button>
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
