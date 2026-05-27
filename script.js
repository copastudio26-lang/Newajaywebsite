// --- MALHAR MOBILE SHOP AND ELECTRONIC CORE LOGIC GATEWAY ---

const WEB3FORMS_ACCESS_KEY = "f9e40d87-2638-482c-8b43-3444d8fc825d";

// 1. DESIRED RUNTIME STATE INITIALIZATION & SESSION ANALYSIS
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

// Dynamic Sidebar Links Deployment Engine
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
    const authTitle = document.getElementById('auth-title');
    const btnLogin = document.getElementById('btn-login-active');
    const btnSignup = document.getElementById('btn-signup');

    resetLoginFormState();

    if (mode === 'signup') {
        if(loginForm) loginForm.classList.add('hidden');
        if(signupForm) signupForm.classList.remove('hidden');
        if(authTitle) authTitle.innerText = "CREATE ACCOUNT";
        if(btnSignup) btnSignup.classList.add('active');
        if(btnLogin) btnLogin.classList.remove('active');
    } else {
        if(signupForm) signupForm.classList.add('hidden');
        if(loginForm) loginForm.classList.remove('hidden');
        if(authTitle) authTitle.innerText = "WELCOME BACK";
        if(btnLogin) btnLogin.classList.add('active');
        if(btnSignup) btnSignup.classList.remove('active');
    }
}

let generatedSignupOTP = null;
let generatedLoginOTP = null;

// 2. WEB3FORMS SYSTEM OTP DISPATCH (FREE LIFETIME CHANNELS)
function sendOTP() {
    const contact = document.getElementById('reg-contact').value;
    const otpBtn = document.getElementById('send-otp-btn');
    
    if (!contact || !contact.includes('@')) {
        alert("⚠️ Please enter a valid Email Address!");
        return;
    }

    generatedSignupOTP = Math.floor(1000 + Math.random() * 9000).toString();
    if(otpBtn) { otpBtn.innerText = "Sending..."; otpBtn.disabled = true; }

    const formData = new FormData();
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "🛡️ MALHAR SHOP - Registration Verification Code");
    formData.append("from_name", "Malhar Shop Gateway");
    formData.append("email", contact);
    formData.append("message", `Welcome to Malhar Mobile & Electronic Shop.\n\nYour 4-Digit Registration Security OTP is: ${generatedSignupOTP}`);

    fetch("https://api.web3forms.com/submit", { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert(`📩 Registration code successfully sent to ${contact}! Check your inbox.`);
            document.getElementById('otp-input-field').classList.remove('hidden');
            if(otpBtn) { otpBtn.innerText = "RESEND OTP"; otpBtn.disabled = false; }
        }
    }).catch(() => { alert("❌ Network submission failure."); if(otpBtn) otpBtn.disabled = false; });
}

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const contact = document.getElementById('reg-contact').value;
    const otp = document.getElementById('reg-otp').value;
    const password = document.getElementById('reg-password').value;

    if (otp !== generatedSignupOTP) {
        alert("❌ Invalid Verification OTP code parameters.");
        return;
    }

    localStorage.setItem('malhar_user', contact);
    localStorage.setItem('malhar_pass', password);
    localStorage.setItem('malhar_name', name);

    alert("🎉 Account Registered Successfully! Switching to Secure Login Panel.");
    switchAuthMode('login');
});

// 3. SECURE VERIFICATION FOR INSTANT LOGIN TRANSFERS
function sendLoginOTP() {
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    const savedUser = localStorage.getItem('malhar_user');
    const savedPass = localStorage.getItem('malhar_pass');

    // Master Admin Direct Login Core Override Configuration
    if (user === "admin" && pass === "malhar@admin") {
        executeAdminLogin();
        return;
    }

    if (user === savedUser && pass === savedPass) {
        generatedLoginOTP = Math.floor(1000 + Math.random() * 9000).toString();
        const sendOtpBtn = document.getElementById('btn-login-send-otp');
        sendOtpBtn.innerText = "Sending Login Code...";
        sendOtpBtn.disabled = true;

        const formData = new FormData();
        formData.append("access_key", WEB3FORMS_ACCESS_KEY);
        formData.append("subject", "🔑 MALHAR SHOP - Secure Login Attempt Code");
        formData.append("from_name", "Malhar System Security");
        formData.append("email", user);
        formData.append("message", `Security Alert: User is logging into Malhar Shop Portal.\n\nYour 4-Digit Secure Login Code is: ${generatedLoginOTP}`);

        fetch("https://api.web3forms.com/submit", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                alert(`📩 Access authorization token has been sent to ${user}. Check your inbox!`);
                document.getElementById('login-otp-section').classList.remove('hidden');
                document.getElementById('btn-login-submit').classList.remove('hidden');
                sendOtpBtn.classList.add('hidden');
                document.getElementById('login-username').readOnly = true;
                document.getElementById('login-password').readOnly = true;
            }
        });
    } else {
        alert("❌ Invalid Username or Password credentials!");
    }
}

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredOTP = document.getElementById('login-otp-input').value;

    if (enteredOTP !== generatedLoginOTP) {
        alert("❌ Access Denied! Verification token mismatch error.");
        return;
    }

    localStorage.setItem('current_role', 'customer');
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    setupNavigationLinks('customer');
    loadSection('home');
});

function resetLoginFormState() {
    document.getElementById('login-form').reset();
    document.getElementById('login-username').readOnly = false;
    document.getElementById('login-password').readOnly = false;
    document.getElementById('login-otp-section').classList.add('hidden');
    document.getElementById('btn-login-submit').classList.add('hidden');
    const sendOtpBtn = document.getElementById('btn-login-send-otp');
    if(sendOtpBtn) { sendOtpBtn.classList.remove('hidden'); sendOtpBtn.innerText = "VERIFY & SEND OTP"; sendOtpBtn.disabled = false; }
}

function executeAdminLogin() {
    alert("👑 Welcome Master Admin Aditya Madavi! Opening Live Customer Database Records.");
    localStorage.setItem('current_role', 'admin');
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    setupNavigationLinks('admin');
    loadSection('admin_orders');
}

// 4. DISPLAY COMPONENT VIEWS DICTIONARY (MATCHED WITH SHOP POSTER ADVERTS)
const sections = {
    home: `
        <h2>🚀 Our Premium Repairing & Services</h2>
        <p style="color: var(--text-gray); margin-bottom: 20px;">Quality You Trust, Service You Deserve</p>
        <div class="grid-container">
            <div class="neon-card">
                <div class="phone-img-frame"><i class="fas fa-tools"></i></div>
                <h3>🛠️ Mobile Repairing</h3><p>All types of hardware, motherboard & complex circuit fixes.</p>
                <button class="btn-neon" style="width:100%; margin-top:10px;" onclick="initiateBookingFlow('Mobile Repairing Service')">Book Repair</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame"><i class="fas fa-mobile"></i></div>
                <h3>📱 Display Replacement</h3><p>Broken glass or screen damage swap with high-grade components.</p>
                <button class="btn-neon" style="width:100%; margin-top:10px;" onclick="initiateBookingFlow('Display Replacement Service')">Book Panel Swap</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame"><i class="fas fa-battery-full"></i></div>
                <h3>⚡ Battery & Port Repair</h3><p>Long backup replacement cells & high-speed charging ports replacement.</p>
                <button class="btn-neon" style="width:100%; margin-top:10px;" onclick="initiateBookingFlow('Battery & Charging Port Service')">Book Diagnostics</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame"><i class="fas fa-tv"></i></div>
                <h3>📺 LED TV & Home Appliances</h3><p>Professional fix tracking for AC, Cooler, Fridge & Washing Machines.</p>
                <button class="btn-neon" style="width:100%; margin-top:10px;" onclick="initiateBookingFlow('Home Appliance/TV Service')">Book Setup Repair</button>
            </div>
        </div>
    `,
    mobiles: `
        <h2>📱 Stock & Online Bookings (Smartphones)</h2>
        <p style="color: var(--text-gray); margin-bottom: 20px;">All major premium mobile tech devices available with active finance plans</p>
        <div class="grid-container">
            <div class="neon-card">
                <div class="phone-img-frame"><i class="fas fa-mobile-alt" style="color:#d4af37;"></i></div>
                <h3>iPhone 15 Pro Max</h3><p>Natural Titanium Variant | 256GB Super Retina XDR</p>
                <span class="badge">Bajaj Finserv EMI Available</span>
                <button class="btn-neon" style="width:100%;" onclick="initiateBookingFlow('iPhone 15 Pro Max')">Book Order</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame"><i class="fas fa-mobile-alt" style="color:#a442f5;"></i></div>
                <h3>Samsung S24 Ultra</h3><p>Titanium Gray | 12GB RAM | Galaxy AI Processing Suite</p>
                <span class="badge">TVS Credit Quick Verification</span>
                <button class="btn-neon" style="width:100%;" onclick="initiateBookingFlow('Samsung S24 Ultra')">Book Order</button>
            </div>
            <div class="neon-card">
                <div class="phone-img-frame"><i class="fas fa-mobile-alt" style="color:#00ffaa;"></i></div>
                <h3>OnePlus 12R</h3><p>Iron Gray Flagship Unit | 16GB RAM + 256GB Storage</p>
                <span class="badge">Zero Down Payment Scheme</span>
                <button class="btn-neon" style="width:100%;" onclick="initiateBookingFlow('OnePlus 12R')">Book Order</button>
            </div>
        </div>
    `,
    profile: `
        <h2>📋 My Active Bookings Tracking Status</h2>
        <p style="color: var(--text-gray); margin-bottom: 20px;">Real-time validation updates for ongoing product requests</p>
        <div class="neon-card" style="overflow-x: auto;">
            <table>
                <thead>
                    <tr style="color: var(--gold);">
                        <th>Item/Service Name</th>
                        <th>Contact Mobile No</th>
                        <th>Current Status Level</th>
                    </tr>
                </thead>
                <tbody id="customer-tracker-table"></tbody>
            </table>
        </div>
    `,
    about: `
        <h2>🏪 Store Directory & Authorized Operations</h2>
        <div class="neon-card" style="margin-top: 20px; max-width:600px; text-align:left;">
            <h3 style="color:var(--gold); font-family:'Orbitron',sans-serif;"><i class="fas fa-user-tie"></i> Managed By: Aditya Madavi</h3>
            <p style="margin-top: 15px;"><i class="fas fa-phone-alt" style="color:var(--neon-blue);"></i> <strong>Calling Lines:</strong> +91 8788461756</p>
            <p><i class="fab fa-whatsapp" style="color: #25d366;"></i> <strong>WhatsApp Support Channel:</strong> +91 9112390404</p>
            <p style="color: var(--text-gray); font-size:0.85rem; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px; margin-top:15px;"><i class="fas fa-check-double"></i> Verified Premium Quality Center. 100% Customer Satisfaction Rate Guaranteed.</p>
        </div>
    `,
    admin_orders: `
        <h2>📋 Live Customer Bookings Database (Master Controller View)</h2>
        <p style="color: var(--text-gray); margin-bottom: 20px;">Manage token parameters, verify transactions data and update statuses</p>
        <div class="neon-card" style="overflow-x: auto;">
            <table>
                <thead>
                    <tr style="color: var(--gold);">
                        <th>Buyer Name</th>
                        <th>Email ID</th>
                        <th>Phone Number</th>
                        <th>Booked Item</th>
                        <th>Fee Parameters</th>
                        <th>Operational Actions</th>
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
    
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.remove('active');
}

// 5. SECURE UPSTREAM BOOKING PIPELINE CONTROLLERS
let temporaryBookingItemName = null;

function initiateBookingFlow(itemName) {
    temporaryBookingItemName = itemName;
    const modal = document.getElementById('payment-modal');
    if(modal) {
        document.getElementById('order-phone').value = "";
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
    if (!phoneInput || phoneInput.length < 10) {
        alert("⚠️ Please enter a valid 10-Digit Mobile Phone Number first!");
        return;
    }

    const custName = localStorage.getItem('malhar_name') || "Customer Profile";
    const custEmail = localStorage.getItem('malhar_user') || "no-email@portal.io";

    let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];

    const newOrderPayload = {
        name: custName,
        email: custEmail,
        phone: phoneInput,
        product: temporaryBookingItemName,
        status: "Pending Admin Verification (Paid ₹50)"
    };

    databaseOrders.push(newOrderPayload);
    localStorage.setItem('malhar_master_orders', JSON.stringify(databaseOrders));

    // TRANSMITTING AUTOMATIC SECURE LIVE ALERT NOTIFICATION TO OWNERS EMAIL VIA WEB3FORMS PIPELINE
    const adminMailForm = new FormData();
    adminMailForm.append("access_key", WEB3FORMS_ACCESS_KEY);
    adminMailForm.append("subject", `🚨 NEW ORDER BOOKING REQUEST - ${temporaryBookingItemName}`);
    adminMailForm.append("from_name", "Malhar Portal Automation");
    adminMailForm.append("email", "onlainajay@gmail.com"); 
    adminMailForm.append("message", `New Secure Booking Entry Created!\n\nCustomer Name: ${custName}\nRegistered Email ID: ${custEmail}\nActive Phone Number: ${phoneInput}\nItem Booked: ${temporaryBookingItemName}\nAdvance Status: ₹50 Token Payment Registered.\n\nPlease log in to the system via Master Admin parameters to review or approve this ticket payload.`);

    fetch("https://api.web3forms.com/submit", { method: "POST", body: adminMailForm });

    alert(`🎉 Booking Successful! Your order request data for ${temporaryBookingItemName} along with transaction records have been sent to Admin Aditya Madavi.`);
    closePaymentModal();
    loadSection('profile');
}

// 6. RENDER TRACKING VIEWS DATA INJECTIONS
function renderCustomerTracker() {
    const tableBody = document.getElementById('customer-tracker-table');
    if(!tableBody) return;

    let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];
    const currentEmail = localStorage.getItem('malhar_user');
    const profileOrders = databaseOrders.filter(o => o.email === currentEmail);

    if (profileOrders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3" style="padding: 20px; text-align: center; color: var(--text-gray);">No live active bookings under this session parameters. 📭</td></tr>`;
        return;
    }

    tableBody.innerHTML = "";
    profileOrders.forEach(order => {
        tableBody.innerHTML += `
            <tr>
                <td style="font-weight: bold; color:var(--text-white);">${order.product}</td>
                <td style="color: var(--neon-blue); font-weight:500;">${order.phone}</td>
                <td><span style="color: ${order.status.includes('Confirmed') ? '#00ff88' : '#ffaa00'}; font-weight:bold;">${order.status}</span></td>
            </tr>
        `;
    });
}

function renderAdminOrders() {
    const tableBody = document.getElementById('admin-orders-table');
    if (!tableBody) return;

    let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];

    if (databaseOrders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-gray);">Database records storage pipeline is empty. 📭</td></tr>`;
        return;
    }

    tableBody.innerHTML = "";
    databaseOrders.forEach((order, idx) => {
        tableBody.innerHTML += `
            <tr>
                <td>${order.name}</td>
                <td style="color: var(--text-gray); font-size:0.85rem;">${order.email}</td>
                <td style="color: var(--neon-blue); font-weight:500;">${order.phone}</td>
                <td style="color: var(--gold); font-weight:bold;">${order.product}</td>
                <td><span style="color:#00ff88; font-weight:bold;">${order.status}</span></td>
                <td style="display:flex; gap:8px;">
                    <button onclick="approveOrder(${idx})" style="background:#00cc66; border:none; color:white; padding:6px 10px; cursor:pointer; border-radius:4px; font-weight:bold; font-family:'Poppins'; font-size:0.8rem;">Approve</button>
                    <button onclick="clearAdminEntry(${idx})" style="background:#ff3333; border:none; color:white; padding:6px 10px; cursor:pointer; border-radius:4px; font-family:'Poppins'; font-size:0.8rem;">Delete</button>
                </td>
            </tr>
        `;
    });
}

function approveOrder(index) {
    let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];
    databaseOrders[index].status = "Booking Verified & Confirmed ✅";
    localStorage.setItem('malhar_master_orders', JSON.stringify(databaseOrders));
    alert("🚀 Order State Verified! Customer tracking dashboard parameter has been updated instantly.");
    renderAdminOrders();
}

function clearAdminEntry(index) {
    if(confirm("Permanently delete this customer order data payload entry?")) {
        let databaseOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];
        databaseOrders.splice(index, 1);
        localStorage.setItem('malhar_master_orders', JSON.stringify(databaseOrders));
        renderAdminOrders();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('active');
}

function logout() {
    if (confirm("Terminate active session token dashboard visibility?")) {
        document.getElementById('dashboard-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        resetLoginFormState();
        localStorage.removeItem('current_role');
    }
}
