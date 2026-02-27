/* project-wide script */

// product catalog – could be fetched from API later
const products = [
    { id: 1, name: 'Product 1', price: 19.99, image: 'https://via.placeholder.com/200' },
    { id: 2, name: 'Product 2', price: 29.99, image: 'https://via.placeholder.com/200' },
    { id: 3, name: 'Product 3', price: 39.99, image: 'https://via.placeholder.com/200' },
    { id: 4, name: 'Product 4', price: 24.99, image: 'https://via.placeholder.com/200' },
    { id: 5, name: 'Product 5', price: 14.99, image: 'https://via.placeholder.com/200' }
];

const cart = [];
const cartLink = document.getElementById('cart-link');

function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartLink) cartLink.textContent = `Cart (${totalItems})`;
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name: prod.name, price: prod.price, quantity: 1 });
    }
    updateCartCounter();
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) {
        const items = JSON.parse(stored);
        items.forEach(i => cart.push(i));
        updateCartCounter();
    }
}

function renderProducts(filter = '') {
    const container = document.getElementById('product-list');
    if (!container) return;
    container.innerHTML = '';
    const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.setAttribute('data-id', p.id);
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price.toFixed(2)}</p>
            <button class="add-cart">Add to Cart</button>
        `;
        container.appendChild(div);
    });
    attachProductListeners();
}

function attachProductListeners() {
    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', e => {
            const productEl = e.target.closest('.product');
            const id = parseInt(productEl.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

function setupSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', e => {
        renderProducts(e.target.value);
    });
}

function setupNavToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    if (!menuToggle || !nav) return;
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// cart page functions
function renderCartPage() {
    const tbody = document.getElementById('cart-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    cart.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="qty-input"></td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-item" data-id="${item.id}">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });
    setupCartPageListeners();
    updateCartSummary();
}

function updateCartSummary() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const summary = document.getElementById('cart-total');
    if (summary) summary.textContent = `$${total.toFixed(2)}`;
}

function setupCartPageListeners() {
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', e => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const qty = parseInt(e.target.value);
            const item = cart.find(i => i.id === id);
            if (item && qty > 0) {
                item.quantity = qty;
                saveCart();
                renderCartPage();
            }
        });
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const idx = cart.findIndex(i => i.id === id);
            if (idx > -1) {
                cart.splice(idx, 1);
                saveCart();
                renderCartPage();
            }
        });
    });
    const checkout = document.getElementById('checkout-btn');
    if (checkout) {
        checkout.addEventListener('click', () => {
            alert('Checkout is not implemented in this demo.');
        });
    }
}

// initialization
loadCart();
setupNavToggle();

if (document.body.classList.contains('cart-page')) {
    renderCartPage();
} else {
    renderProducts();
    setupSearch();
}
