const carData = [
    { id: 1, name: "Nebula X-GT", fuel: "electric", price: 345000, img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800" },
    { id: 2, name: "Vanguard Overlord", fuel: "gas", price: 285000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800" },
    { id: 3, name: "Summit Zenith", fuel: "electric", price: 195000, img: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=800" },
    { id: 4, name: "Phantom Seraph", fuel: "electric", price: 420000, img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800" },
    { id: 5, name: "Titan Monarch", fuel: "gas", price: 310000, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800" },
    { id: 6, name: "Aether Flux", fuel: "electric", price: 275000, img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800" }
];

// --- 1. Fleet Rendering ---
function renderFleet() {
    const grid = document.getElementById('car-grid');
    if (!grid) return;

    grid.innerHTML = carData.map(car => `
        <div class="car-card reveal active">
            <div class="car-image" style="background-image: url('${car.img}')"></div>
            <div class="car-body">
                <span class="car-type">${car.fuel} MASTERPIECE</span>
                <h3 class="car-name">${car.name}</h3>
                <div class="car-price">$${car.price.toLocaleString()}</div>
                <button class="card-btn" onclick="selectCarForFinance(${car.id})">Details & Acquisition</button>
            </div>
        </div>
    `).join('');
}

// --- 2. Finance Logic ---
function updateEMI() {
    const price = parseFloat(document.getElementById('car-price').value) || 0;
    const down = parseFloat(document.getElementById('down-payment').value) || 0;
    const term = parseInt(document.getElementById('loan-term').value) || 12;

    const principal = price - down;

    // We assume 0% interest for Tier 1 Clients as per the redesign theme
    let monthly = principal > 0 ? (principal / term) : 0;

    document.getElementById('emi-display').innerText = monthly.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function selectCarForFinance(id) {
    const car = carData.find(c => c.id === id);
    if (!car) return;

    document.getElementById('car-select').value = car.name;
    document.getElementById('car-price').value = car.price;
    updateEMI();
    document.getElementById('finance').scrollIntoView({ behavior: 'smooth' });
}

// --- 3. Scroll Reveal ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

// --- 4. Initialization ---
function init() {
    renderFleet();

    // Populate Select
    const select = document.getElementById('car-select');
    if (select) {
        select.innerHTML = carData.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
        select.addEventListener('change', (e) => {
            const car = carData.find(c => c.name === e.target.value);
            if (car) {
                document.getElementById('car-price').value = car.price;
                updateEMI();
            }
        });
    }

    // Calculator Listeners
    ['car-price', 'down-payment', 'loan-term'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateEMI);
    });

    // Observe Reveals
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    updateEMI();
}

window.onload = init;