/* --- 1. Global Navigation Logic (All Clerk Pages) --- */

// Elements ko initialize karein checks ke sath
const clerkMenuBtn = document.getElementById('userMenuBtn');
const clerkDropdown = document.getElementById('userDropdown');
const clerkMobileBtn = document.getElementById('mobileMenuBtn');
const clerkMobileMenu = document.getElementById('mobileMenu');

// Profile Dropdown Toggle
if (clerkMenuBtn && clerkDropdown) {
    clerkMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clerkDropdown.classList.toggle('hidden');
        if (clerkMobileMenu) clerkMobileMenu.classList.add('hidden');
    });
}

// Mobile Menu Toggle
if (clerkMobileBtn && clerkMobileMenu) {
    clerkMobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clerkMobileMenu.classList.toggle('hidden');
        if (clerkDropdown) clerkDropdown.classList.add('hidden');
        
        // Icon Swap (Bars to Times)
        const icon = clerkMobileBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

// Global Click-to-Close
window.addEventListener('click', () => {
    if (clerkDropdown) clerkDropdown.classList.add('hidden');
    if (clerkMobileMenu) {
        clerkMobileMenu.classList.add('hidden');
        const icon = clerkMobileBtn?.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
});

// Resize Guard
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && clerkMobileMenu) {
        clerkMobileMenu.classList.add('hidden');
    }
});


/* --- 2. Shared Functional Logic --- */

// Image Preview for Profile Page (If present)
window.previewImage = function(input) {
    const preview = document.getElementById('previewImg');
    const initials = document.getElementById('initials');
    if (input.files && input.files[0] && preview) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            if (initials) initials.classList.add('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
};

// Generic Notification (For Add Student / Bulk Entry)
window.notifyAction = function(message) {
    alert(message);
};