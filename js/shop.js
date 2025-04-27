let products = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
            loadDealOfTheDay();
            startCountdownTimer();
        })
        .catch(error => console.error('Error loading products:', error));

    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);
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
                <a href="#" class="btn-primary">View Details</a>
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

