// 1. Modal Management
function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    document.body.classList.add('modal-active');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.body.classList.remove('modal-active');
}

// 2. Escape Key to close all modals
window.onkeydown = (e) => {
    if(e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        document.body.classList.remove('modal-active');
    }
}

// 3. Public Pages Mobile Menu
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        icon.classList.replace('fa-times', 'fa-bars');
    } else {
        menu.classList.add('active');
        icon.classList.replace('fa-bars', 'fa-times');
    }
}