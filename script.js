// --- MALHAR MOBILE SHOP CORE LOGIC (WEB3FORMS REAL OTP SYSTEM) ---

// 🔑 Free Web3Forms Token Key Integrated Successfully
const WEB3FORMS_ACCESS_KEY = "f9e40d87-2638-482c-8b43-3444d8fc825d";

// 1. SPLASH SCREEN TO AUTH SCREEN TRANSITION & SESSION CHECK
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
                if (activeRole === 'admin') {
                    document.querySelector('.nav-links').innerHTML = `
                        <li onclick="loadSection('admin_orders')" class="active-nav"><i class="fas fa-list-alt"></i> All Customer Orders</li>
                        <li onclick="logout()" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</li>
                    `;
                    loadSection('admin_orders');
                } else {
                    document.querySelector('.nav-links').innerHTML = `
                        <li onclick="loadSection('home')" class="active-nav"><i class="fas fa-home"></i> Home</li>
                        <li onclick="loadSection('mobiles')"><i class="fas fa-mobile-alt"></i> Order Mobiles</li>
                        <li onclick="loadSection('profile')"><i class="fas fa-user"></i> My Profile</li>
                        <li onclick="loadSection('about')"><i class="fas fa-info-circle"></i> About Shop</li>
                        <li onclick="logout()" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</li>
                    `;
                    loadSection('home');
                }
            } else {
                if(auth) auth.classList.remove('hidden');
            }
        }, 800);
    }, 3500);
});

// 2. TOGGLE BETWEEN LOGIN & SIGNUP FORMS
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

// Global scope tracker variables for access code validation
let generatedSignupOTP = null;
let generatedLoginOTP = null;

// 3. SECURE SIGNUP OTP ACTION (Web3Forms)
function sendOTP() {
    const contact = document.getElementById('reg-contact').value;
    const otpBtn = document.getElementById('send-otp-btn');
    
    if (!contact || !contact.includes('@')) {
        alert("⚠️ Please enter a valid Email Address to receive the OTP!");
        return;
    }

    generatedSignupOTP = Math.floor(1000 + Math.random() * 9000).toString();
    if(otpBtn) { otpBtn.innerText = "Sending..."; otpBtn.disabled = true; }

    const formData = new FormData();
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "🛡️ MALHAR SHOP - Registration Verification OTP");
    formData.append("from_name", "Malhar Shop Gateway");
    formData.append("email", contact);
    formData.append("message", `Welcome to Malhar Mobile & Electronic Shop.\n\nYour 4-Digit Security Registration OTP is: ${generatedSignupOTP}\n\nPlease verify this to finalize registration setup.`);

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert(`📩 Verification OTP Sent Successfully to ${contact}! Please check your email inbox.`);
            document.getElementById('otp-input-field').classList.remove('hidden');
            if(otpBtn) { otpBtn.innerText = "RESEND OTP"; otpBtn.disabled = false; }
        } else {
            alert("❌ Web3Forms Engine rejection error. Please try again.");
            if(otpBtn) { otpBtn.innerText = "TRY AGAIN"; otpBtn.disabled = false; }
        }
    })
    .catch(error => {
        alert("❌ Dynamic Network Request Failed. Check data connectivity.");
        if(otpBtn) { otpBtn.innerText = "TRY AGAIN"; otpBtn.disabled = false; }
    });
}

// 4. REGISTRATION SUBMIT COMPLIANCE CHECK
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const contact = document.getElementById('reg-contact').value;
    const otp = document.getElementById('reg-otp').value;
    const password = document.getElementById('reg-password').value;

    if (otp !== generatedSignupOTP) {
        alert("❌ Invalid Verification OTP! Registration process terminated.");
        return;
    }

    localStorage.setItem('malhar_user', contact);
    localStorage.setItem('malhar_pass', password);
    localStorage.setItem('malhar_name', name);

    alert("🎉 Account Registered Successfully! Switching to Secure Login Panel.");
    switchAuthMode('login');
});

// 5. SECURE LOGIN OTP ENGINE (Web3Forms)
function sendLoginOTP() {
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    const savedUser = localStorage.getItem('malhar_user');
    const savedPass = localStorage.getItem('malhar_pass');

    if (!user || !pass) {
        alert("⚠️ Credentials fields missing data input values!");
        return;
    }

    // Direct Bypass Logic Control for System Admin
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
        formData.append("subject", "🔑 MALHAR SHOP - Secure Login Verification Code");
        formData.append("from_name", "Malhar Mobile System Security");
        formData.append("email", user);
        formData.append("message", `Security Notification: Login request triggered for Malhar Portal.\n\nYour 4-Digit Secure Login Code is: ${generatedLoginOTP}`);

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                alert(`📩 Security Access Code has been dispatched to ${user}. Check your inbox!`);
                document.getElementById('login-otp-section').classList.remove('hidden');
                document.getElementById('btn-login-submit').classList.remove('hidden');
                sendOtpBtn.classList.add('hidden');
                
                document.getElementById('login-username').readOnly = true;
                document.getElementById('login-password').readOnly = true;
            } else {
                alert("❌ Web3Forms API failed to process dispatch payload.");
                sendOtpBtn.innerText = "TRY AGAIN";
                sendOtpBtn.disabled = false;
            }
        })
        .catch(error => {
            alert("❌ Execution pipeline error encountered.");
            sendOtpBtn.innerText = "TRY AGAIN";
            sendOtpBtn.disabled = false;
        });
    } else {
        alert("❌ Credentials match mismatch. Invalid input parameters!");
    }
}

// 6. CUSTOMER DASHBOARD AUTHORIZATION DISPATCH
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredOTP = document.getElementById('login-otp-input').value;

    if (enteredOTP !== generatedLoginOTP) {
        alert("❌ Authentication Verification Fault! Bad Access Code Token.");
        return;
    }

    alert(`👋 Security Profile Confirmed! Welcome to Malhar Shop Dashboard.`);
    localStorage.setItem('current_role', 'customer');
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    
    document.querySelector('.nav-links').innerHTML = `
        <li onclick="loadSection('home')" class="active-nav"><i class="fas fa-home"></i> Home</li>
        <li onclick="loadSection('mobiles')"><i class="fas fa-mobile-alt"></i> Order Mobiles</li>
        <li onclick="loadSection('profile')"><i class="fas fa-user"></i> My Profile</li>
        <li onclick="loadSection('about')"><i class="fas fa-info-circle"></i> About Shop</li>
        <li onclick="logout()" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</li>
    `;
    loadSection('home');
});

// Helper clean-state layout controllers
function resetLoginFormState() {
    document.getElementById('login-form').reset();
    document.getElementById('login-username').readOnly = false;
    document.getElementById('login-password').readOnly = false;
    document.getElementById('login-otp-section').classList.add('hidden');
    document.getElementById('btn-login-submit').classList.add('hidden');
    const sendOtpBtn = document.getElementById('btn-login-send-otp');
    if(sendOtpBtn) {
        sendOtpBtn.classList.remove('hidden');
        sendOtpBtn.innerText = "VERIFY & SEND OTP";
        sendOtpBtn.disabled = false;
    }
}

function executeAdminLogin() {
    alert("👑 Welcome Master Admin! Opening Central Logging Controls.");
    localStorage.setItem('current_role', 'admin');
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    document.querySelector('.nav-links').innerHTML = `
        <li onclick="loadSection('admin_orders')" class="active-nav"><i class="fas fa-list-alt"></i> All Customer Orders</li>
        <li onclick="logout()" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</li>
    `;
    loadSection('admin_orders');
}

// 7. VIEW COMPONENT DICTIONARY
const sections = {
    home: `
        <h2>🚀 Our Premium Services</h2>
        <p style="color: var(--text-gray); margin-bottom: 20px;">Quality You Trust, Service You Deserve</p>
        <div class="grid-container">
            <div class="neon-card"><h3>🛠️ Mobile Repairing</h3><p>All Types of Mobile Repair</p></div>
            <div class="neon-card"><h3>💻 Software Solutions</h3><p>Software Update & Flashing</p></div>
            <div class="neon-card"><h3>⚡ Electronic Items</h3><p>High Quality Accessories</p></div>
            <div class="neon-card"><h3>🏠 Home Appliances</h3><p>AC, Cooler, Fridge, Washing Machine</p></div>
        </div>
    `,
    mobiles: `
        <h2>📱 Stock & Online Bookings</h2>
        <p style="color: var(--text-gray); margin-bottom: 20px;">All major brands available with easy finance options</p>
        <div class="grid-container">
            <div class="neon-card">
                <h3>iPhone 15 Pro Max</h3>
                <p>Natural Titanium | 256GB Storage</p>
                <span class="badge">Bajaj Finserv EMI</span>
                <button class="btn-neon" style="margin-top:15px; padding:8px;" onclick="bookItem('iPhone 15 Pro Max')">Book Order</button>
            </div>
            <div class="neon-card">
                <h3>Samsung S24 Ultra</h3>
                <p>Titanium Gray | 12GB RAM | AI Enabled</p>
                <span class="badge">TVS Credit Available</span>
                <button class="btn-neon" style="margin-top:15px; padding:8px;" onclick="bookItem('Samsung S24 Ultra')">Book Order</button>
            </div>
            <div class="neon-card">
                <h3>OnePlus 12R</h3>
                <p>Iron Gray | 16GB RAM + 256GB</p>
                <span class="badge">Low Down Payment</span>
                <button class="btn-neon" style="margin-top:15px; padding:8px;" onclick="bookItem('OnePlus 12R')">Book Order</button>
            </div>
        </div>
    `,
    profile: `
        <h2>👤 Active Session Details</h2>
        <div class="neon-card" style="margin-top: 20px; max-width: 500px;">
            <p style="margin-bottom: 10px;"><strong>Customer Name:</strong> <span id="dash-cust-name" style="color:var(--neon-blue);"></span></p>
            <p style="margin-bottom: 10px;"><strong>Registered ID/Email:</strong> <span id="dash-cust-user" style="color:var(--gold);"></span></p>
            <p><strong>Verification Rank:</strong> <span style="color:#00ff88;">Premium Buyer Tier</span></p>
        </div>
    `,
    about: `
        <h2>🏪 Store Directory & Contact Information</h2>
        <div class="neon-card" style="margin-top: 20px;">
            <h3>👑 Managed By: Aditya Madavi</h3>
            <p style="margin-top: 10px;"><i class="fas fa-phone-alt"></i> +91 8788461756</p>
            <p><i class="fab fa-whatsapp" style="color: #25d366;"></i> +91 9112390404</p>
        </div>
    `,
    admin_orders: `
        <h2>📋 Live Customer Orders (Admin View)</h2>
        <p style="color: var(--text-gray); margin-bottom: 20px;">Manage bookings and contact details for finance/EMI verification</p>
        <div class="neon-card" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; color: var(--text-white);">
                <thead>
                    <tr style="border-bottom: 2px solid var(--neon-blue); color: var(--gold);">
                        <th style="padding: 12px;">Customer Name</th>
                        <th style="padding: 12px;">Email ID</th>
                        <th style="padding: 12px;">Product Booked</th>
                        <th style="padding: 12px;">Action</th>
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

    if (sectionName === 'profile') {
        const dName = document.getElementById('dash-cust-name');
        const dUser = document.getElementById('dash-cust-user');
        if(dName) dName.innerText = localStorage.getItem('malhar_name') || "N/A";
        if(dUser) dUser.innerText = localStorage.getItem('malhar_user') || "N/A";
    }

    if (sectionName === 'admin_orders') {
        renderAdminOrders();
    }
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.remove('active');
}

// 8. DATA CONTROLLERS & DATA LOGGING INTERFACES
function bookItem(itemName) {
    const custName = localStorage.getItem('malhar_name') || "Walk-in Customer";
    const custContact = localStorage.getItem('malhar_user') || "Not Provided";

    let allOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];

    const newOrder = { name: custName, contact: custContact, product: itemName };
    allOrders.push(newOrder);
    localStorage.setItem('malhar_master_orders', JSON.stringify(allOrders));

    alert(`🎉 Success! Your booking request for ${itemName} has been securely submitted.`);
}

function renderAdminOrders() {
    const tableBody = document.getElementById('admin-orders-table');
    if (!tableBody) return;

    let allOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];

    if (allOrders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: var(--text-gray);">No orders received yet. 📭</td></tr>`;
        return;
    }

    tableBody.innerHTML = "";
    allOrders.forEach((order, index) => {
        tableBody.innerHTML += `
            <tr style="border-bottom: 1px solid var(--glass-border);">
                <td style="padding: 12px;">${order.name}</td>
                <td style="padding: 12px; color: var(--neon-blue);">${order.contact}</td>
                <td style="padding: 12px; color: var(--gold);">${order.product}</td>
                <td style="padding: 12px;"><button onclick="deleteOrder(${index})" style="background:#ff4d4d; border:none; color:white; padding:5px 10px; cursor:pointer; border-radius:4px;">Complete</button></td>
            </tr>
        `;
    });
}

function deleteOrder(index) {
    let allOrders = JSON.parse(localStorage.getItem('malhar_master_orders')) || [];
    allOrders.splice(index, 1);
    localStorage.setItem('malhar_master_orders', JSON.stringify(allOrders));
    renderAdminOrders();
}

// 9. RESPONSIVE SIDEBAR ACTIONS
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('active');
}

// 10. SESSION TERMINATION
function logout() {
    if (confirm("Are you sure you want to log out from Malhar Mobile Shop?")) {
        document.getElementById('dashboard-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        resetLoginFormState();
        localStorage.removeItem('current_role');
    }
        }
:root {
    --bg-dark: #070714;
    --neon-blue: #00f3ff;
    --gold: #ffaa00;
    --card-bg: rgba(255, 255, 255, 0.04);
    --glass-border: rgba(0, 243, 255, 0.2);
    --text-white: #ffffff;
    --text-gray: #a5a5b5;
}

body {
    background-color: var(--bg-dark);
    color: var(--text-white);
    font-family: 'Poppins', sans-serif;
    margin: 0; padding: 0;
}

.hidden { display: none !important; }

/* Grid Cards with Hover Animations */
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px; padding: 20px 0;
}

.neon-card {
    background: var(--card-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
}

.neon-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
    border-color: var(--neon-blue);
}

/* Simulated Image Boxes */
.phone-img-frame {
    width: 100%;
    height: 160px;
    background: linear-gradient(45deg, #121232, #1c1c4a);
    border-radius: 8px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    color: var(--neon-blue);
    text-shadow: 0 0 10px var(--neon-blue);
}

.badge {
    background: rgba(255, 170, 0, 0.15);
    color: var(--gold);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    display: inline-block;
    margin-top: 5px;
    border: 1px solid rgba(255, 170, 0, 0.3);
}

/* Modal Popup Window */
.modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 15px;
}

.modal-box {
    background: #0d0d26;
    border: 2px solid var(--neon-blue);
    box-shadow: 0 0 30px rgba(0, 243, 255, 0.3);
    padding: 25px; border-radius: 16px;
    max-width: 450px; width: 100%;
}

.qr-placeholder {
    width: 180px; height: 180px;
    margin: 15px auto;
    background: white;
    padding: 10px; border-radius: 8px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: #333; font-weight: bold; font-size: 0.9rem;
}


        
