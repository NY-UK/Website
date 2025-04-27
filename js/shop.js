let products = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);

		/*
            loadDealOfTheDay();
            startCountdownTimer();
		*/
	    loadDeals();
	    startCountdown(5); // 5-hour countdown
        })
        .catch(error => console.error('Error loading products:', error));

    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);


    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
});


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

function displayProducts(productsToDisplay) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        let badges = '';

        if (product.featured) {
            badges += `<span class="badge featured">Featured</span>`;
        }

        if (product.sale_price) {
            badges += `<span class="badge sale">Flash Sale!</span>`;
        }

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


function loadDealOfTheDay() {
    const dealProduct = products.find(p => p.sale_price); // Pick first item on sale
    const dealContainer = document.getElementById('deal-product');

    if (!dealProduct) return;

    dealContainer.innerHTML = `
        <img src="${dealProduct.image_url}" alt="${dealProduct.name}">
        <h3>${dealProduct.name}</h3>
        <p><span class="old-price">$${dealProduct.price.toFixed(2)}</span> <strong>$${dealProduct.sale_price.toFixed(2)}</strong></p>
    `;
}

// Countdown Timer
function startCountdownTimer() {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 6); // Flash sale lasts 6 hours

    function updateTimer() {
        const now = new Date();
        const distance = endTime - now;

        if (distance < 0) {
            document.getElementById('timer').innerHTML = "Deal Ended!";
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('timer').innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateTimer, 1000);
}


let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        addToCart(id);
    } else if (event.target.id === 'cart-button') {
        toggleCart();
    } else if (event.target.id === 'close-cart') {
        toggleCart();
    } else if (event.target.classList.contains('remove-item')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        removeFromCart(index);
    }


});

function addToCart(id) {
    const product = products.find(p => p.id === id);
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
    const price = item.sale_price || item.price;
    total += price;

    const li = document.createElement('li');
    li.innerHTML = `
        ${item.name} - $${price.toFixed(2)} 
        <button class="remove-item" data-index="${index}">❌</button>
    `;
    cartItems.appendChild(li);
});

    cartTotal.textContent = total.toFixed(2);

    // Add pop effect
    const cartButton = document.getElementById('cart-button');
    cartButton.classList.add('pop');

    // Remove animation class after it plays so you can reuse it
    setTimeout(() => {
        cartButton.classList.remove('pop');
    }, 400);

}

function toggleCart() {
    document.getElementById('mini-cart').classList.toggle('hidden');
}

// Initialize cart display at load
updateCartDisplay();

window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});


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

// Render Deal Products
function loadDeals() {
    const dealContainer = document.querySelector(".deal-products");
    dealContainer.innerHTML = "";

    deals.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("deal-product-card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="deal-product-prices">
                <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                <span class="deal-price">$${product.dealPrice.toFixed(2)}</span>
            </div>
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.dealPrice})">Add to Cart</button>
        `;

        dealContainer.appendChild(card);
    });
}

// Countdown Timer
function startCountdown(hours = 5) {
    const countdownEl = document.getElementById("deal-countdown");
    let timeLeft = hours * 60 * 60; // in seconds

    const timer = setInterval(() => {
        const hoursLeft = Math.floor(timeLeft / 3600);
        const minutesLeft = Math.floor((timeLeft % 3600) / 60);
        const secondsLeft = timeLeft % 60;

        countdownEl.textContent = `Time left: ${String(hoursLeft).padStart(2,'0')}:${String(minutesLeft).padStart(2,'0')}:${String(secondsLeft).padStart(2,'0')}`;

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            countdownEl.textContent = "Deal expired!";
        }
    }, 1000);
}

const dealContainer = document.getElementById('deal-container');
const prevButton = document.getElementById('prevDeal');
const nextButton = document.getElementById('nextDeal');

prevButton.addEventListener('click', () => {
    dealContainer.scrollBy({
        left: -260, // match item width (250px + gap)
        behavior: 'smooth'
    });
});

nextButton.addEventListener('click', () => {
    dealContainer.scrollBy({
        left: 260,
        behavior: 'smooth'
    });
});


function highlightActiveDeal() {
    const items = document.querySelectorAll('.deal-item');
    const containerRect = dealContainer.getBoundingClientRect();
    
    items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        if (Math.abs(itemCenter - containerCenter) < 130) { // 130px threshold
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

dealContainer.addEventListener('scroll', () => {
    highlightActiveDeal();
});

// Initial highlight
highlightActiveDeal();

function createDots() {
    const dotsContainer = document.getElementById('deal-dots');
    const items = document.querySelectorAll('.deal-item');
    dotsContainer.innerHTML = '';

    items.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('deal-dot');
        dot.addEventListener('click', () => {
            dealContainer.scrollTo({
                left: idx * 260,
                behavior: 'smooth'
            });
        });
        dotsContainer.appendChild(dot);
    });
}

function updateActiveDot() {
    const items = document.querySelectorAll('.deal-item');
    const dots = document.querySelectorAll('.deal-dot');
    const containerRect = dealContainer.getBoundingClientRect();

    items.forEach((item, idx) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        if (Math.abs(itemCenter - containerCenter) < 130) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[idx].classList.add('active');
        }
    });
}

dealContainer.addEventListener('scroll', () => {
    highlightActiveDeal();
    updateActiveDot();
});

// Run once on page load:
createDots();
updateActiveDot();

let currentIndex = 0;

function autoScrollDeals() {
    const items = document.querySelectorAll('.deal-item');
    currentIndex = (currentIndex + 1) % items.length;

    dealContainer.scrollTo({
        left: currentIndex * 260,
        behavior: 'smooth'
    });
}

// Start auto-scroll every 5 seconds
setInterval(autoScrollDeals, 5000);