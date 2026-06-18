// --- MOCK DATABASE ---
const PRODUCTS = [
    { id: 1, name: "Amoxicillin 500mg", category: "medicines", type: "Rx", price: 120, desc: "Broad-spectrum antibiotic for bacterial infections." },
    { id: 2, name: "Metformin 500mg", category: "medicines", type: "Rx", price: 90, desc: "Oral diabetes medicine for Type 2 diabetes." },
    { id: 3, name: "Atorvastatin 10mg", category: "medicines", type: "Rx", price: 150, desc: "Statin to prevent cardiovascular disease." },
    { id: 4, name: "Amlodipine 5mg", category: "medicines", type: "Rx", price: 80, desc: "Calcium channel blocker for high blood pressure." },
    { id: 5, name: "Paracetamol 650mg", category: "medicines", type: "OTC", price: 30, desc: "Fever and mild-to-moderate pain relief." },
    { id: 6, name: "Cetirizine 10mg", category: "medicines", type: "OTC", price: 45, desc: "Antihistamine for allergy symptoms." },
    { id: 7, name: "Ibuprofen 400mg", category: "medicines", type: "OTC", price: 50, desc: "NSAID for pain, fever, and inflammation." },
    { id: 8, name: "Cough Syrup (Herbal)", category: "medicines", type: "OTC", price: 110, desc: "Fast-acting herbal throat relief formula." },
    { id: 9, name: "Multivitamin Gold capsules", category: "wellness", type: "OTC", price: 350, desc: "Daily health supplement containing essential vitamins." },
    { id: 10, name: "Calcium & Vitamin D3", category: "wellness", type: "OTC", price: 210, desc: "Bones, teeth, and muscle health support." },
    { id: 11, name: "Organic Whey Protein (500g)", category: "wellness", type: "OTC", price: 990, desc: "Grass-fed whey protein for muscle recovery." },
    { id: 12, name: "Aloe Vera Hydrating Gel", category: "personal-care", type: "OTC", price: 140, desc: "Pure soothing gel for skin hydration." },
    { id: 13, name: "Gentle Facial Cleanser", category: "personal-care", type: "OTC", price: 280, desc: "pH-balanced, soap-free cleanser." },
    { id: 14, name: "Medicated Anti-Dandruff Shampoo", category: "personal-care", type: "OTC", price: 220, desc: "Relief from dandruff and itching." },
    { id: 15, name: "Hypoallergenic Baby Wipes", category: "baby-care", type: "OTC", price: 120, desc: "Fragrance-free wipes with Aloe & Vitamin E." },
    { id: 16, name: "Gentle Baby Moisturizing Lotion", category: "baby-care", type: "OTC", price: 195, desc: "Nourishing formula for baby's skin." }
];

// --- APP STATE ---
let cart = [];
let selectedCategory = "all";
let searchFilter = "";
let uploadedFile = null;

// --- DOM ELEMENTS ---
document.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);
    
    // Theme Switcher
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    $("theme-toggle")?.addEventListener("click", () => {
        const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    // Mobile Menu Control
    const mobBtn = $("mobile-menu-btn"), nav = $("nav-links");
    mobBtn?.addEventListener("click", () => {
        mobBtn.classList.toggle("open");
        nav?.classList.toggle("open");
    });

    document.querySelectorAll(".nav-link").forEach(link => 
        link.addEventListener("click", () => {
            mobBtn?.classList.remove("open");
            nav?.classList.remove("open");
        })
    );

    // Initializations
    renderProducts();
    setupFilters();
    setupCart();
    setupPrescriptionForm();
    setupCalculators();
    setupContactForm();
});

// --- RENDER PRODUCTS ---
function renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    const filtered = PRODUCTS.filter(p => 
        (selectedCategory === "all" || p.category === selectedCategory) &&
        (p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.desc.toLowerCase().includes(searchFilter.toLowerCase()))
    );

    if (!filtered.length) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);"><p>No products found matching your criteria.</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const cls = p.type === "Rx" ? "badge-rx" : (p.category === "wellness" ? "badge-wellness" : "badge-otc");
        return `
            <div class="glass-card product-card" data-id="${p.id}">
                <div class="product-badge ${cls}">${p.type} / ${p.category.replace('-', ' ')}</div>
                <h3>${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-meta">
                    <span class="product-price">₹${p.price.toFixed(2)}</span>
                    <button class="btn-icon add-to-cart-btn" aria-label="Add to cart" data-id="${p.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            addToCart(parseInt(btn.getAttribute("data-id")));
            btn.style.transform = "scale(0.8)";
            setTimeout(() => btn.style.transform = "scale(1)", 150);
        });
    });
}

// --- FILTER & SEARCH SYSTEM ---
function setupFilters() {
    document.getElementById("catalog-search")?.addEventListener("input", (e) => {
        searchFilter = e.target.value;
        renderProducts();
    });

    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(btn => {
        btn.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            selectedCategory = btn.getAttribute("data-category");
            renderProducts();
        });
    });
}

// --- CART LOGIC ---
function setupCart() {
    const $ = id => document.getElementById(id);
    const panel = $("cart-panel"), overlay = $("cart-overlay"), openBtn = $("cart-open-btn");
    const toggle = (show) => {
        panel?.classList.toggle("open", show);
        overlay?.classList.toggle("open", show);
    };

    openBtn?.addEventListener("click", () => toggle(true));
    [$("close-cart"), overlay].forEach(el => el?.addEventListener("click", () => toggle(false)));

    const stored = localStorage.getItem("medical_cart");
    if (stored) {
        cart = JSON.parse(stored);
        updateCartBadge();
        renderCartItems();
    }

    $("checkout-btn")?.addEventListener("click", () => {
        if (!cart.length) return;
        let msg = "*Laxmi Narsima Medical & General Store*\n*New Order Inquiry:*\n\n" +
            cart.map((it, idx) => {
                const prod = PRODUCTS.find(p => p.id === it.id);
                return `${idx + 1}. ${it.name} x ${it.qty} - ₹${(it.price * it.qty).toFixed(2)}${prod?.type === "Rx" ? " (Requires Rx)" : ""}`;
            }).join('\n') +
            `\n\n*Total Estimate: ₹${cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2)}*\n\n_Note: Please upload any required prescriptions if you have Rx items in your list._`;

        window.open(`https://wa.me/919000000000?text=${encodeURIComponent(msg)}`, '_blank');
        cart = [];
        saveCart();
        updateCartBadge();
        renderCartItems();
        toggle(false);
        alert("Order draft generated! You are being redirected to WhatsApp to send your list to Laxmi Narsima Store.");
    });
}

function addToCart(id) {
    const prod = PRODUCTS.find(p => p.id === id);
    if (!prod) return;
    const existing = cart.find(it => it.id === id);
    if (existing) existing.qty++;
    else cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
    saveCart();
    updateCartBadge();
    renderCartItems();
    document.getElementById("cart-panel")?.classList.contains("open") || document.getElementById("cart-open-btn")?.click();
}

function updateQty(id, delta) {
    const item = cart.find(it => it.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(it => it.id !== id);
    saveCart();
    updateCartBadge();
    renderCartItems();
}

const saveCart = () => localStorage.setItem("medical_cart", JSON.stringify(cart));

function updateCartBadge() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const count = cart.reduce((acc, curr) => acc + curr.qty, 0);
    badge.innerText = count;
    badge.style.display = count > 0 ? "flex" : "none";
}

function renderCartItems() {
    const container = document.getElementById("cart-items-container"), totalEl = document.getElementById("cart-total-price"), checkoutBtn = document.getElementById("checkout-btn");
    if (!container || !totalEl || !checkoutBtn) return;
    
    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><p>Your medicine cart is empty.</p></div>`;
        totalEl.innerText = "₹0.00";
        Object.assign(checkoutBtn.style, { opacity: "0.5", pointerEvents: "none" });
        checkoutBtn.setAttribute("disabled", "true");
        return;
    }

    Object.assign(checkoutBtn.style, { opacity: "1", pointerEvents: "auto" });
    checkoutBtn.removeAttribute("disabled");
    container.innerHTML = cart.map(it => `
        <div class="cart-item">
            <div class="cart-item-info"><h4>${it.name}</h4><div class="cart-item-price">₹${(it.price * it.qty).toFixed(2)}</div></div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQty(${it.id}, -1)">-</button>
                <span>${it.qty}</span>
                <button class="qty-btn" onclick="updateQty(${it.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
    totalEl.innerText = `₹${cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2)}`;
}

// --- PRESCRIPTION FORM ---
function setupPrescriptionForm() {
    const dropzone = document.getElementById("dropzone"), input = document.getElementById("file-input"), preview = document.getElementById("file-preview");
    if (!dropzone || !input) return;

    dropzone.addEventListener("click", () => input.click());
    dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    input.addEventListener("change", (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    document.getElementById("remove-file")?.addEventListener("click", (e) => {
        e.stopPropagation();
        uploadedFile = null;
        input.value = "";
        preview.style.display = "none";
        dropzone.style.display = "flex";
    });

    function handleFile(file) {
        if (file.size > 5 * 1024 * 1024) return alert("File size exceeds 5MB.");
        if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) return alert("Invalid file format.");
        uploadedFile = file;
        document.getElementById("file-name").innerText = file.name;
        dropzone.style.display = "none";
        preview.style.display = "flex";
    }

    const opts = document.querySelectorAll(".delivery-option");
    opts.forEach(opt => {
        opt.addEventListener("click", () => {
            opts.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            const radio = opt.querySelector("input[type='radio']");
            if (radio) radio.checked = true;
        });
    });

    document.getElementById("prescription-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!uploadedFile) return alert("Please upload an image or PDF copy of your prescription first.");
        const val = id => document.getElementById(id).value;
        const delType = document.querySelector("input[name='delivery-type']:checked").value;
        
        let msg = `*Laxmi Narsima Medical & General Store*\n*Prescription Upload Request:*\n\n` +
            `*Customer:* ${val("rx-name")}\n*Contact Phone:* ${val("rx-phone")}\n*Service Option:* ${delType === "home" ? "Home Delivery" : "Store Pickup"}\n`;
        if (delType === "home") msg += `*Delivery Address:* ${val("rx-address")}\n`;
        if (val("rx-notes")) msg += `*Notes:* ${val("rx-notes")}\n`;
        msg += `\n*Prescription attached:* [Ref: ${uploadedFile.name}]\n_Note: Please attach your prescription image in the WhatsApp chat immediately after opening._`;

        window.open(`https://wa.me/919000000000?text=${encodeURIComponent(msg)}`, '_blank');
        e.target.reset();
        uploadedFile = null;
        preview.style.display = "none";
        dropzone.style.display = "flex";
        alert("Prescription order generated! You are being redirected to WhatsApp. Please attach your prescription file.");
    });
}

// --- HEALTH CALCULATORS ---
function setupCalculators() {
    // BMI
    document.getElementById("calculate-bmi-btn")?.addEventListener("click", () => {
        const w = parseFloat(document.getElementById("bmi-weight").value);
        const h = parseFloat(document.getElementById("bmi-height").value);
        if (!w || !h || w <= 0 || h <= 0) return alert("Please enter valid positive numbers.");
        const bmi = w / ((h / 100) ** 2);
        const bmiVal = document.getElementById("bmi-val");
        bmiVal.innerText = bmi.toFixed(1);
        
        let desc = "Normal: Congratulations on maintaining a healthy weight!", color = "var(--success)";
        if (bmi < 18.5) { desc = "Underweight: We suggest consultation and protein-rich wellness diets."; color = "var(--warning)"; }
        else if (bmi >= 25 && bmi < 29.9) { desc = "Overweight: Moderate calorie diets and physical exercises recommended."; color = "var(--warning)"; }
        else if (bmi >= 30) { desc = "Obese: Consult doctors regarding obesity risks and cardiovascular wellness."; color = "var(--accent)"; }
        
        bmiVal.style.color = color;
        document.getElementById("bmi-desc").innerText = desc;
    });

    // Water Tracker
    const wtIn = document.getElementById("water-weight"), actSel = document.getElementById("water-activity");
    const goalVal = document.getElementById("water-goal-val"), progVal = document.getElementById("water-progress-val"), wave = document.getElementById("water-wave");
    let currentWater = 0, waterGoal = 2500;

    const update = () => {
        const wt = parseFloat(wtIn.value);
        if (wt > 0) {
            waterGoal = Math.round(wt * 35 + (actSel.value === "medium" ? 500 : actSel.value === "high" ? 1000 : 0));
            goalVal.innerText = `${waterGoal} ml`;
        }
        progVal.innerText = currentWater;
        const pct = Math.min((currentWater / waterGoal) * 100, 100);
        wave.style.height = `${pct}%`;
        document.getElementById("water-text-indicator").style.color = pct > 50 ? "#fff" : "var(--text-main)";
    };

    [wtIn, actSel].forEach(el => el?.addEventListener("input", update));
    document.getElementById("add-glass-btn")?.addEventListener("click", () => { currentWater += 250; update(); });
    document.getElementById("reset-water-btn")?.addEventListener("click", () => { currentWater = 0; update(); });
    update();
}

// --- CONTACT FORM ---
function setupContactForm() {
    document.getElementById("store-contact-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const phone = document.getElementById("contact-phone")?.value || "";
        const subject = document.getElementById("contact-subject")?.value || "General Query";
        const message = document.getElementById("contact-message")?.value || "";

        // Construct email body and redirect via mailto
        const emailBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`;
        window.location.href = `mailto:harshithuppunutula@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

        alert(`Thank you, ${name}! Preparing email to send to harshithuppunutula@gmail.com...`);
        e.target.reset();
    });
}
