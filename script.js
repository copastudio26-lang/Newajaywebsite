// --- MALHAR MOBILE SHOP AND ELECTRONIC CORE LOGICAL SYSTEM ---

const WEB3FORMS_ACCESS_KEY = "f9e40d87-2638-482c-8b43-3444d8fc825d";

// 1. ENGINE RUNTIME STATE HANDLERS
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const auth = document.getElementById('auth-screen');
        const dashboard = document.getElementById('dashboard-screen');
        const activeRole = localStorage.getItem('current_role');

        if(splash) splash.style.opacity = '0';

        setTimeout(() => {
            if(splash) splash.classList.add('hidden');
            
            if (activeRole === 'admin' || activeRole === 'customer') {
                if(dashboard) dashboard.classList.remove('hidden');
                setupNavigationLinks(activeRole);
                loadSection(activeRole === 'admin' ? 'admin_orders' : 'home');
            } else {
                if(auth) auth.classList.remove('hidden');
            }
        }, 800);
    }, 3500);
});

function setupNavigationLinks(role) {
    const navLinks = document.querySelector('.nav-links');
    if(!navLinks) return;
    
    if (role === 'admin') {
        navLinks.innerHTML = `
            <li onclick="loadSection('admin_orders')" class="active-nav"><i class="fas fa-list-alt"></i> Live Customer Bookings</li>
            <li onclick="logout()" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</li>
        `;
    } else {
        navLinks.innerHTML = `
            <li onclick="loadSection('home')" class="active-nav"><i class="fas fa-home"></i> Home & Services</li>
            <li onclick="loadSection('mobiles')"><i class="fas fa-mobile-alt"></i> Order Mobiles</li>
            <li onclick="loadSection('profile')"><i class="fas fa-clock"></i> My Bookings Track</li>
            <li onclick="loadSection('about')"><i class="fas fa-info-circle"></i> About Shop</li>
            <li onclick="logout()" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</li>
        `;
    }
}

function switchAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const btnLogin = document.getElementById('btn-login-active');
    const btnSignup = document.getElementById('btn-signup');

    if (mode === 'signup') {
        if(loginForm) loginForm.classList.add('hidden');
        if(signupForm) signupForm.classList.remove('hidden');
        if(btnSignup) btnSignup.classList.add('active');
        if(btnLogin) btnLogin.classList.remove('active');
    } else {
        if(signupForm) signupForm.classList.add('hidden');
        if(loginForm) loginForm.classList.remove('hidden');
        if(btnLogin) btnLogin.classList.add('active');
        if(btnSignup) btnSignup.classList.remove('active');
    }
}

let generatedSignupOTP = null;

// 2. LIFETIME SINGLE OTP VERIFICATION MATRIX FOR SIGNUPS
function sendOTP() {
    const contact = document.getElementById('reg-contact').value;
    const otpBtn = document.getElementById('send-otp-btn');
    
    if (!contact || !contact.includes('@')) {
        alert("⚠️ Please enter a valid Email Address!");
        return;
    }

    generatedSignupOTP = Math.floor(1000 + Math.random() * 9000).toString();
    if(otpBtn) { otpBtn.innerText = "Sending Secure OTP..."; otpBtn.disabled = true; }

    const formData = new FormData();
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "🛡️ MALHAR SHOP - Registration Passcode Token");
    formData.append("from_name", "Malhar Safety Center");
    formData.append("email", contact);
    formData.append("message", `Welcome to Malhar Shop.\n\nYour 4-Digit Secure Sign-Up Verification Code is: ${generatedSignupOTP}`);

    fetch("https://api.web3forms.com/submit", { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert(`📩 Access registration token code dispatched to ${contact}. Check mail inbox.`);
            document.getElementById('otp-input-field').classList.remove('hidden');
            if(otpBtn) { otpBtn.innerText = "RESEND SECURITY OTP"; otpBtn.disabled = false; }
        }
    });
}

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const contact = document.getElementById('reg-contact').value;
    const otp = document.getElementById('reg-otp').value;
    const password = document.getElementById('reg-password').value;

    if (otp !== generatedSignupOTP) {
        alert("❌ Registration failure. Verification token code match failed.");
        return;
    }

    localStorage.setItem('malhar_user', contact);
    localStorage.setItem('malhar_pass', password);
    localStorage.setItem('malhar_name', name);

    alert("🎉 Account created successfully! Now use your Email & Password to login instantly anytime.");
    switchAuthMode('login');
});

// 3. FAST EMAIL + PASSWORD INSTANT CHECKOUT (NO MORE RETURNING USER OTP LOGS)
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    const savedUser = localStorage.getItem('malhar_user');
    const savedPass = localStorage.getItem('malhar_pass');

    // Master System Admin Bypass Check Configuration
    if (user === "admin" && pass === "malhar@admin") {
        alert("👑 Welcome Master Admin Aditya Madavi!");
        localStorage.setItem('current_role', 'admin');
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('dashboard-screen').classList.remove('hidden');
        setupNavigationLinks('admin');
        loadSection('admin_orders');
        return;
    }

    if (user === savedUser && pass === savedPass) {
        localStorage.setItem('current_role', 'customer');
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('dashboard-screen').classList.remove('hidden');
        setupNavigationLinks('customer');
        loadSection('home');
    } else {
        alert("❌ Invalid Username or Access Password configuration!");
    }
});

// 4. POWERFUL GLOWING LAYOUT TEMPLATES WITH INTEGRATED TICKERS & SMART Mockups
const sections = {
    home: `
        <!-- LIVE ORDER TICKER NOTIFICATION DEPLOYMENT -->
        <div class="ticker-wrap">
            <div class="ticker-content">
                🔥 Recent Bookings Tracker: Amit Kumar just booked Screen Panel Replacement ... Rajesh M. ordered iPhone 15 Pro Max ... Nilesh Patel processed Advance Fix Token!
            </div>
        </div>

        <h2 class="section-title">🚀 Premium Diagnostic Repair Center</h2>
        <p style="color: var(--text-gray); margin-bottom: 25px;">Quality You Trust, Service You Deserve — Premium Malhar Infrastructure</p>
        <div class="grid-container">
            <div class="neon-card">
                <div class="phone-img-frame">
                    <i class="fas fa-tools service-icon-render"></i>
                </div>
                <h3>🛠️ Mobile Repairing</h3>
                <p style="font-size:0.88rem; color:var(--text-gray); margin-top:5px;">Complex circuit engineering, chip-level logic tracks repairs.</p>
                <button class="btn-neon" style="width:100%; margin-top:20px;" onclick="initiateBookingFlow('Mobile Repairing Service')">Book Repair Entry</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame">
                    <div class="virtual-phone"><div class="phone-screen-content"><i class="fas fa-tint"></i></div></div>
                </div>
                <h3>📱 Display Replacement</h3>
                <p style="font-size:0.88rem; color:var(--text-gray); margin-top:5px;">Original high-density touch panel glass assembly replacements.</p>
                <button class="btn-neon" style="width:100%; margin-top:20px;" onclick="initiateBookingFlow('Display Replacement Service')">Book Panel Swap</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame">
                    <i class="fas fa-battery-full service-icon-render" style="color: #00ffaa; text-shadow:0 0 10px #00ffaa;"></i>
                </div>
                <h3>⚡ Battery & Ports</h3>
                <p style="font-size:0.88rem; color:var(--text-gray); margin-top:5px;">High capacity backup power cell installations & superfast ports.</p>
                <button class="btn-neon" style="width:100%; margin-top:20px;" onclick="initiateBookingFlow('Battery & Charging Port Service')">Book Fix</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame">
                    <i class="fas fa-tv service-icon-render" style="color: #ff0077; text-shadow:0 0 10px #ff0077;"></i>
                </div>
                <h3>📺 Smart LED TV Repair</h3>
                <p style="font-size:0.88rem; color:var(--text-gray); margin-top:5px;">Authorized service for AC, Cooler, Fridge & Washing Machines.</p>
                <button class="btn-neon" style="width:100%; margin-top:20px;" onclick="initiateBookingFlow('Home Appliance/TV Service')">Book Inspection</button>
            </div>
        </div>
    `,
    mobiles: `
        <h2 class="section-title">📱 Premium Flagship Smartphone Stock</h2>
        <p style="color: var(--text-gray); margin-bottom: 25px;">Verified authentic tech configurations available with fast approval finance options</p>
        <div class="grid-container">
            <div class="neon-card">
                <div class="phone-img-frame">
                    <div class="virtual-phone" style="border-color:#d4af37;"><div class="phone-screen-content" style="background:linear-gradient(45deg, #111, #d4af37)"><i class="fab fa-apple"></i></div></div>
                </div>
                <h3>iPhone 15 Pro Max</h3>
                <p style="font-size:0.88rem; color:var(--text-gray); margin-top:5px;">Natural Titanium Structure | Pro Camera Layout | 256GB Elite Variant</p>
                <span class="badge">Bajaj Finserv EMI Active</span>
                <button class="btn-neon" style="width:100%;" onclick="initiateBookingFlow('iPhone 15 Pro Max')">Book Order</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame">
                    <div class="virtual-phone" style="border-color:var(--neon-blue);"><div class="phone-screen-content" style="background:linear-gradient(45deg, #03030b, var(--neon-blue))"><i class="fas fa-robot"></i></div></div>
                </div>
                <h3>Samsung S24 Ultra</h3>
                <p style="font-size:0.88rem; color:var(--text-gray); margin-top:5px;">Titanium Gray Armor Frame | Built-in S-Pen Slot | Galaxy Space AI Integration</p>
                <span class="badge">TVS Credit Verification Option</span>
                <button class="btn-neon" style="width:100%;" onclick="initiateBookingFlow('Samsung S24 Ultra')">Book Order</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame">
                    <div class="virtual-phone" style="border-color:#ff3333;"><div class="phone-screen-content" style="background:linear-gradient(45deg, #ff3333, #550000)"><i class="fas fa-infinity"></i></div></div>
                </div>
                <h3>OnePlus 12R</h3>
                <p style="font-size:0.88rem; color:var(--text-gray); margin-top:5px;">Iron Gray Smooth Matte Body | 16GB High Performance RAM Unit</p>
                <span class="badge">Zero Low Down Payment Layout</span>
                <button class="btn-neon" style="width:100%;" onclick="initiateBookingFlow('OnePlus 12R')">Book Order</button>
            </div>
        </div>
    `,
    profile: `
        <h2 class="section-title">📋 Secure Order Tracker System</h2>
        <p style="color: var(--text-gray); margin-bottom: 25px;">Track your token operations state live from database pipeline parameters</p>
        <div class="neon-card" style="overflow-x: auto;">
            <table>
                <thead>
                    <tr style="color: var(--gold);">
                        <th>Item Description</th>
                        <th>Registered Phone No</th>
                        <th>Txn Ref Note</th>
                        <th>Verification Status State</th>
                    </tr>
                </thead>
                <tbody id="customer-tracker-table"></tbody>
            </table>
        </div>
    `,
    about: `
        <h2 class="section-title">🏪 Store Operational Information</h2>
        <div class="neon-card" style="margin-top: 25px; max-width:620px; text-align:left;">
            <h3 style="color:var(--gold); font-family:'Orbitron',sans-serif;"><i class="fas fa-user-tie"></i> Chief Administrator: Aditya Madavi</h3>
            <p style="margin-top: 18px;"><i class="fas fa-phone-alt" style="color:var(--neon-blue);"></i> <strong>Calling Assistance Lines:</strong> +91 8788461756</p>
            <p style="margin-top: 5px;"><i class="fab fa-whatsapp" style="color: #25d366;"></i> <strong>WhatsApp Support Node:</strong> +91 9112390404</p>
            <p style="color: var(--text-gray); font-size:0.88rem; border-top:1px solid rgba(255,255,255,0.08); padding-top:15px; margin-top:20px;"><i class="fas fa-check-double"></i> Verified Premium Quality Center Setup. 100% Satisfaction Rate Guaranteed.</p>
        </div>
    `,
    admin_orders: `
        <h2 class="section-title">👑 Core Database Master Hub</h2>
        <p style="color: var(--text-gray); margin-bottom: 25px;">Process customer token fee logs, approve queues and alter parameters state values</p>
        <div class="neon-card" style="overflow-x: auto;">
            <table>
                <thead>
                    <tr style="color: var(--gold);">
                        <th>Customer</th>
                        <th>Email / Phone</th>
                        <th>Requested Unit</th>
                        <th>Receipt Note</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="admin-orders-table"></tbody>
            </table>
        </div>
    `
};

function loadSection(sectionName) {
    const mainArea = document.getElementById('main-content');
    if(mainArea) mainArea.innerHTML = sections[sectionName];

    const links = document.querySelectorAll('.nav-links li');
    links.forEach(link => link.classList.remove('active-nav'));
    
    links.forEach(link => {
        if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionName)) {
            link.classList.add('active-nav');
        }
    });

    if (sectionName === 'profile') renderCustomerTracker();
    if (sectionName === 'admin_orders') renderAdminOrders();
}

// 5. MASTER UPSTREAM DATA PIPELINE CONTROLLER WITH RECEIPT MANAGEMENT
let temporaryBookingItemName = null;

function initiateBookingFlow(itemName) {
    temporaryBookingItemName = itemName;
    const modal = document.getElementById('payment-modal');
    if(modal) {
        document.getElementById('order-phone').value = "";
        document.getElementById('order-receipt-note').value = "";
        modal.classList.remove('hidden');
    }
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if(modal) modal.classList.add('hidden');
    temporaryBookingItemName = null;
}

function confirmAdvancePayment() {
    const phoneInput = document.getElementById('order-phone').value;
    const receiptInput = document.getElementById('order-receipt-note').value || "None Provided";

    if (!phoneInput || phoneInput.length < 10) {
        alert("⚠️ Please enter a valid 10-Digit Mobile/WhatsApp Number!");
        return;
    }

    const custName = localStorage.getItem('malhar_name') || "Client Member";
    const custEmail = localStorage.getItem('malhar_user') || "no-email@portal.in";

    let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];

    const newOrderPayload = {
        name: custName,
        email: custEmail,
        phone: phoneInput,
        product: temporaryBookingItemName,
        receipt: receiptInput,
        status: "Waiting Verification (Paid ₹50)"
    };

    databaseOrders.push(newOrderPayload);
    localStorage.setItem('malhar_master_orders', JSON.stringify(databaseOrders));

    // DYNAMIC TRANSMISSION OF RECEIPT DATA AND DETAILS DIRECT TO ADITYA'S EMAIL
    const adminMailForm = new FormData();
    adminMailForm.append("access_key", WEB3FORMS_ACCESS_KEY);
    adminMailForm.append("subject", `🚨 NEW MALHAR BOOKING LOGGED - Ref: ${receiptInput}`);
    adminMailForm.append("from_name", "Malhar Automated Notification Node");
    adminMailForm.append("email", "onlainajay@gmail.com"); 
    adminMailForm.append("message", `New Secure Booking Registered!\n\nCustomer Name: ${custName}\nMail ID: ${custEmail}\nPhone / WhatsApp: ${phoneInput}\nBooked Unit: ${temporaryBookingItemName}\n\n[RECEIPT DATA NOTE]: ${receiptInput}\nToken Parameter Status: ₹50 Advance Transferred.`);

    fetch("https://api.web3forms.com/submit", { method: "POST", body: adminMailForm });

    alert(`🎉 Booking Parameters Dispatched! Your reference confirmation state for ${temporaryBookingItemName} is now live.`);
    closePaymentModal();
    loadSection('profile');
}

// 6. STORAGE PIPELINE VISUAL RENDERS
function renderCustomerTracker() {
    const tableBody = document.getElementById('customer-tracker-table');
    if(!tableBody) return;

    let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];
    const currentEmail = localStorage.getItem('malhar_user');
    const profileOrders = databaseOrders.filter(o => o.email === currentEmail);

    if (profileOrders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: var(--text-gray);">No live parameters tracked under this account logs. 📭</td></tr>`;
        return;
    }

    tableBody.innerHTML = "";
    profileOrders.forEach(order => {
        tableBody.innerHTML += `
            <tr>
                <td style="font-weight: bold;">${order.product}</td>
                <td style="color: var(--neon-blue);">${order.phone}</td>
                <td style="color: var(--text-gray); font-size:0.85rem;">${order.receipt || 'None'}</td>
                <td><span style="color: ${order.status.includes('Verified') ? '#00ff88' : '#ffaa00'}; font-weight:bold;">${order.status}</span></td>
            </tr>
        `;
    });
}

function renderAdminOrders() {
    const tableBody = document.getElementById('admin-orders-table');
    if (!tableBody) return;

    let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];

    if (databaseOrders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-gray);">No active customer tickets saved inside cache pipeline. 📭</td></tr>`;
        return;
    }

    tableBody.innerHTML = "";
    databaseOrders.forEach((order, idx) => {
        tableBody.innerHTML += `
            <tr>
                <td><strong>${order.name}</strong></td>
                <td style="font-size:0.85rem; line-height:1.4;">${order.email}<br><span style="color:var(--neon-blue); font-weight:bold;">${order.phone}</span></td>
                <td style="color: var(--gold); font-weight:bold;">${order.product}</td>
                <td style="color: #a5a5b5; font-size: 0.85rem; max-width:120px; overflow:hidden;">${order.receipt || 'None'}</td>
                <td><span style="color:#00ff88; font-weight:bold;">${order.status}</span></td>
                <td style="display:flex; gap:8px;">
                    <button onclick="approveOrder(${index=idx})" style="background:#00cc66; border:none; color:white; padding:6px 12px; cursor:pointer; border-radius:5px; font-weight:bold;">Approve</button>
                    <button onclick="clearAdminEntry(${index=idx})" style="background:#ff3333; border:none; color:white; padding:6px 12px; cursor:pointer; border-radius:5px;">Delete</button>
                </td>
            </tr>
        `;
    });
}

function approveOrder(index) {
    let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];
    databaseOrders[index].status = "Booking Verified & Confirmed ✅";
    localStorage.setItem('malhar_master_orders', JSON.stringify(databaseOrders));
    alert("🚀 Token parameter update verified successfully!");
    renderAdminOrders();
}

function clearAdminEntry(index) {
    if(confirm("Purge selected record parameter from system?")) {
        let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];
        databaseOrders.splice(index, 1);
        localStorage.setItem('malhar_master_orders', JSON.stringify(databaseOrders));
        renderAdminOrders();
    }
}

function logout() {
    if (confirm("Terminate user core tracking terminal window visibility?")) {
        document.getElementById('dashboard-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        localStorage.removeItem('current_role');
    }
}
