
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
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
    });
});

// Show toast notification
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    
    toastMessage.textContent = message;
    
    // Change color based on type
    if (type === "error") {
        toast.style.background = "var(--danger)";
    } else if (type === "warning") {
        toast.style.background = "var(--warning)";
    } else {
        toast.style.background = "var(--success)";
    }
    
    toast.classList.add("show");
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Form validation and submission
document.getElementById("registerForm").addEventListener("submit", function(e){
    e.preventDefault();
    const formData = new FormData(this);
    const spinner = document.getElementById("registerSpinner");
    
    // Show loading spinner
    spinner.style.display = "inline-block";
    
    // Simulate registration after a short delay
    setTimeout(() => {
        currentUser = {
            firstName: this.querySelector("input[type='text']").value,
            email: this.querySelector("input[type='email']").value,
            phone: this.querySelector("input[type='number']").value,
            nid: this.querySelectorAll("input[type='number']")[1].value
        };
        
        // Hide spinner
        spinner.style.display = "none";
        
        showToast("Registration successful! Welcome to Online GD System.");
        closeModal('registerModal');
        showUserDashboard();
        this.reset();
    }, 1500);
});

document.getElementById("signinForm").addEventListener("submit", function(e){
    e.preventDefault();
    const email = this.querySelector("input[type='email']").value;
    const password = this.querySelector("input[type='password']").value;
    const spinner = document.getElementById("loginSpinner");
    
    // Show loading spinner
    spinner.style.display = "inline-block";
    
    // Simulate login after a short delay
    setTimeout(() => {
        currentUser = {
            firstName: email.split('@')[0],
            email: email,
            phone: "+8801XXXXXXXXX",
            nid: "XXXXXXXXXXXX"
        };
        
        // Hide spinner
        spinner.style.display = "none";
        
        showToast("Login successful! Welcome back.");
        closeModal('signinModal');
        showUserDashboard();
        this.reset();
    }, 1500);
});

document.getElementById("contactForm").addEventListener("submit", function(e){
    e.preventDefault();
    showToast("Your message has been sent successfully! We'll contact you soon.");
    closeModal('contactModal');
    this.reset();
});

// GD Form Submission
document.getElementById("gdForm").addEventListener("submit", function(e){
    e.preventDefault();
    
    // Show loading state
    const submitBtn = this.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showToast("Your General Diary has been submitted successfully! GD Number: #2023-GD-98765");
        this.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
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
        
        // Update profile information
        document.getElementById("profileName").textContent = currentUser.firstName;
        document.getElementById("profileEmail").textContent = currentUser.email;
        document.getElementById("profilePhone").textContent = currentUser.phone;
        document.getElementById("profileNid").textContent = currentUser.nid;
        document.getElementById("profileAddress").textContent = "Dhaka, Bangladesh";
    }
}

// Check if user is already logged in (for demo purposes)
// In a real application, this would check localStorage or a session
window.addEventListener('DOMContentLoaded', function() {
    // Check if we should show the dashboard (for demo purposes)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('loggedin') === 'true') {
        currentUser = { 
            firstName: "Demo User", 
            email: "demo@example.com",
            phone: "+8801712345678",
            nid: "1990123456789"
        };
        showUserDashboard();
    }
});

