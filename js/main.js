document.addEventListener('DOMContentLoaded', () => {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const productGrid = document.getElementById('product-grid');

            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';

                productItem.innerHTML = `
                    <img src="${product.image_url}" alt="${product.name}">
                    <div class="info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p><strong>$${product.price.toFixed(2)}</strong></p>
                        <a href="#" class="btn-primary">View Details</a>
                    </div>
                `;

                productGrid.appendChild(productItem);
            });
        })
        .catch(error => console.error('Error loading products:', error));
});
