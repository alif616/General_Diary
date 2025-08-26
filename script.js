// Global variables
let currentUser = null;

// DOM Elements
const registerBtn = document.getElementById("registerBtn");
const signinBtn = document.querySelector(".signin-btn");
const registerModal = document.getElementById("registerModal");
const signinModal = document.getElementById("signinModal");
const aboutBtn = document.querySelectorAll(".about-btn");
const faqBtn = document.querySelectorAll(".faq-btn");
const contactBtn = document.querySelectorAll(".contact-btn");
const heroSection = document.getElementById("hero");
const userDashboard = document.querySelector(".user-dashboard");
const gdFormContainer = document.querySelector(".gd-form-container");
const logoutBtn = document.getElementById("logoutBtn");
const userNameSpan = document.getElementById("userName");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const toast = document.getElementById("toast");

// API Base URL
const API_URL = "http://localhost:5000/api";

// Show modals
registerBtn.addEventListener("click", () => registerModal.classList.add("show"));
signinBtn.addEventListener("click", () => signinModal.classList.add("show"));
aboutBtn.forEach(btn => btn.addEventListener("click", () => document.getElementById("aboutModal").classList.add("show")));
faqBtn.forEach(btn => btn.addEventListener("click", () => document.getElementById("faqModal").classList.add("show")));
contactBtn.forEach(btn => btn.addEventListener("click", () => document.getElementById("contactModal").classList.add("show")));

// Close modal
function closeModal(id){
    document.getElementById(id).classList.remove("show");
}

// Switch modal
function switchModal(closeId, openId){
    closeModal(closeId);
    document.getElementById(openId).classList.add("show");
}

// Close when clicking outside
window.addEventListener("click", e => {
    if(e.target.classList.contains("modal-overlay")){
        e.target.classList.remove("show");
    }
});

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
    });
});

// Show toast notification
function showToast(message, type = "success") {
    const toastMessage = document.getElementById("toastMessage");
    toastMessage.textContent = message;
    if (type === "error") toast.style.background = "var(--danger)";
    else if (type === "warning") toast.style.background = "var(--warning)";
    else toast.style.background = "var(--success)";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// ✅ Registration API Call
document.getElementById("registerForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const spinner = document.getElementById("registerSpinner");
    spinner.style.display = "inline-block";

    const formData = {
        firstName: this.querySelector("input[name='firstName']").value,
        lastName: this.querySelector("input[name='lastName']").value,
        fatherName: this.querySelector("input[name='fatherName']").value,
        motherName: this.querySelector("input[name='motherName']").value,
        nid: this.querySelector("input[name='nid']").value,
        phone: this.querySelector("input[name='phone']").value,
        email: this.querySelector("input[name='email']").value,
        password: this.querySelector("input[name='password']").value,
    };

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        spinner.style.display = "none";
        if(res.ok){
            // Include returned userId
            currentUser = { ...formData, id: data.userId };
            showToast(data.message);
            closeModal('registerModal');
            showUserDashboard();
            this.reset();
        } else {
            showToast(data.error, "error");
        }
    } catch (err) {
        spinner.style.display = "none";
        showToast("Server error!", "error");
    }
});

// ✅ Login API Call
document.getElementById("signinForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const spinner = document.getElementById("loginSpinner");
    spinner.style.display = "inline-block";

    const email = this.querySelector("input[name='email']").value;
    const password = this.querySelector("input[name='password']").value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        spinner.style.display = "none";
        if(res.ok){
            currentUser = data.user;
            showToast("Login successful! Welcome back.");
            closeModal('signinModal');
            showUserDashboard();
            this.reset();
        } else {
            showToast(data.error, "error");
        }
    } catch (err) {
        spinner.style.display = "none";
        showToast("Server error!", "error");
    }
});

// ✅ Contact Form API Call
document.getElementById("contactForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const name = this.querySelector("input[name='name']").value;
    const email = this.querySelector("input[name='email']").value;
    const message = this.querySelector("textarea[name='message']").value;

    try {
        const res = await fetch(`${API_URL}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
        });
        const data = await res.json();
        if(res.ok){
            showToast(data.message);
            closeModal('contactModal');
            this.reset();
        } else {
            showToast(data.error, "error");
        }
    } catch (err) {
        showToast("Server error!", "error");
    }
});

// ✅ GD Form API Call
document.getElementById("gdForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const submitBtn = this.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
    submitBtn.disabled = true;

    const gdData = {
        userId: currentUser?.id,
        incidentType: this.querySelector("input[name='incidentType']").value,
        incidentDate: this.querySelector("input[name='incidentDate']").value,
        incidentLocation: this.querySelector("input[name='incidentLocation']").value,
        policeStation: this.querySelector("input[name='policeStation']").value,
        incidentDetails: this.querySelector("textarea[name='incidentDetails']").value,
        witness: this.querySelector("input[name='witness']").value
    };

    try {
        const res = await fetch(`${API_URL}/gd`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gdData)
        });
        const data = await res.json();
        if(res.ok){
            showToast(data.message + ` GD Number: #${data.gdId}`);
            this.reset();
        } else {
            showToast(data.error, "error");
        }
    } catch (err) {
        showToast("Server error!", "error");
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

// Logout functionality
logoutBtn.addEventListener("click", function() {
    currentUser = null;
    userDashboard.style.display = "none";
    heroSection.style.display = "block";
    showToast("You have been logged out successfully.");
});

// Show user dashboard after login/registration
function showUserDashboard() {
    heroSection.style.display = "none";
    userDashboard.style.display = "block";
    gdFormContainer.style.display = "block";
    if (currentUser) {
        userNameSpan.textContent = currentUser.firstName;
        document.getElementById("profileName").textContent = currentUser.firstName;
        document.getElementById("profileEmail").textContent = currentUser.email;
        document.getElementById("profilePhone").textContent = currentUser.phone || "";
        document.getElementById("profileNid").textContent = currentUser.nid || "";
        document.getElementById("profileAddress").textContent = "Dhaka, Bangladesh";
    }
}
