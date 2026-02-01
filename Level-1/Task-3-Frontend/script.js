const productList = document.getElementById('product-list');
const fetchBtn = document.getElementById('fetch-btn');

const API_URL = 'http://localhost:3000/products';

async function fetchProducts() {
    try {
        productList.innerHTML = '<p>Loading...</p>';
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productList.innerHTML = `<p style="color: red;">Failed to load products. Ensure the server is running.</p>`;
    }
}

function displayProducts(products) {
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');
        productDiv.innerHTML = `
            <span class="name">${product.name}</span>
            <span class="price">$${product.price}</span>
        `;
        productList.appendChild(productDiv);
    });
}

fetchBtn.addEventListener('click', fetchProducts);

// Fetch on load
fetchProducts();
