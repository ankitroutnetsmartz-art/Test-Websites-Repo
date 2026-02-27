// Simple cart functionality for e-commerce page

const cart = [];
const cartLink = document.getElementById('cart-link');

function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartLink.textContent = `Cart (${totalItems})`;
}

function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
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

function showCart() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    let message = 'Shopping Cart:\n';
    cart.forEach(item => {
        message += `${item.name} – $${item.price.toFixed(2)} x ${item.quantity}\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `Total: $${total.toFixed(2)}`;
    alert(message);
}

// Event binding
function attachListeners() {
    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', e => {
            const productEl = e.target.closest('.product');
            const name = productEl.getAttribute('data-name');
            const price = productEl.getAttribute('data-price');
            addToCart(name, price);
        });
    });

    cartLink.addEventListener('click', e => {
        e.preventDefault();
        showCart();
    });
}

// initialize
loadCart();
attachListeners();
