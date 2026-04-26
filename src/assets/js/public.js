/**
 * ICIT Portal - Public Scripts
 * Handles Shared UI components like Navbar and Image Sliders
 */

// --- 1. Global Navigation (Mobile Menu) ---
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    
    if (!menu || !icon) return; // Guard clause: if element not on page

    const isActive = menu.classList.toggle('active');
    
    // Toggle Icon between Bars and Times (X)
    if (isActive) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
}

// Auto-close menu on link click (Mobile UX Best Practice)
document.addEventListener('click', (e) => {
    // Check if the click was on a link inside the mobile menu
    if (e.target.closest('#mobile-menu a')) {
        const menu = document.getElementById('mobile-menu');
        const icon = document.getElementById('menu-icon');
        
        menu.classList.remove('active');
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
    }
});

// --- 2. Image Slider (Home Page Only) ---
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return; // Exit if no slider on current page

    let currentSlide = 0;
    const totalSlides = slides.length;

    function showNextSlide() {
        // Hide current
        slides[currentSlide].classList.replace('opacity-100', 'opacity-0');
        // Move index
        currentSlide = (currentSlide + 1) % totalSlides;
        // Show next
        slides[currentSlide].classList.replace('opacity-0', 'opacity-100');
    }

    setInterval(showNextSlide, 3000);
}

// Run slider initialization
initSlider();