/* --- 1. Navigation Elements --- */
const facMenuBtn = document.getElementById('mobile-menu-btn');
const facMobileMenu = document.getElementById('mobile-menu');
const facHamburgerIcon = document.getElementById('hamburger-icon');
const facUserButton = document.getElementById('user-menu-button');
const facUserDropdown = document.getElementById('user-dropdown');

/* --- 2. Centralized Dropdown Logic --- */
if (facUserButton && facUserDropdown) {
    facUserButton.addEventListener('click', (e) => {
        e.stopPropagation();
        facUserDropdown.classList.toggle('hidden');
    });
}

// Global click to close dropdowns
window.addEventListener('click', (e) => {
    if (facUserDropdown && facUserButton && !facUserButton.contains(e.target)) {
        facUserDropdown.classList.add('hidden');
    }
});

/* --- 3. Mobile Menu Logic --- */
if (facMenuBtn && facMobileMenu) {
    facMenuBtn.addEventListener('click', () => {
        const isHidden = facMobileMenu.classList.toggle('hidden');
        if (facHamburgerIcon) {
            facHamburgerIcon.classList.toggle('fa-bars', isHidden);
            facHamburgerIcon.classList.toggle('fa-times', !isHidden);
        }
    });
}

/* --- 4. Page Specific Actions (Common for Faculty) --- */

// Profile Image Preview (For Faculty Profile Page)
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

// Approval Actions (For Proposals & Supervision)
window.approveItem = function(id, type) {
    if (confirm(`Are you sure you want to approve this ${type}?`)) {
        alert(`${type} ${id} has been approved.`);
        // Backend integration point
    }
};