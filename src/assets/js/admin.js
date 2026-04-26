/* --- 1. Navigation & Dropdowns --- */

const adminBtn = document.getElementById('adminMenuBtn');
const adminDropdown = document.getElementById('adminDropdown');
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

const enrollmentBtn = document.getElementById('enrollmentBtn');
const mobileDropdown = document.getElementById('mobileDropdown');
const mobileArrow = document.getElementById('mobileArrow');

/* Admin Dropdown */
if (adminBtn && adminDropdown) {
    adminBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        adminDropdown.classList.toggle('hidden');
        mobileMenu?.classList.add('hidden');
    });
}

/* Mobile Menu Toggle */
if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        mobileMenu.classList.toggle('hidden');
        adminDropdown?.classList.add('hidden');

        const icon = mobileBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

/* 🔥 Enrollment Dropdown (FIXED) */
if (enrollmentBtn) {
    enrollmentBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 🔥 prevent auto close

        mobileDropdown?.classList.toggle('hidden');
        mobileArrow?.classList.toggle('rotate-180');
    });
}

/* 🔥 Smart Outside Click */
window.addEventListener('click', (e) => {

    // Close admin dropdown
    if (!e.target.closest('#adminMenuBtn') && !e.target.closest('#adminDropdown')) {
        adminDropdown?.classList.add('hidden');
    }

    // Close mobile menu ONLY if clicked outside
    if (!e.target.closest('#mobileMenuBtn') && !e.target.closest('#mobileMenu')) {
        mobileMenu?.classList.add('hidden');

        const icon = mobileBtn?.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
});
/* --- 2. Modal Logic --- */
window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-active');
    }
}

window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-active');
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = ['categoryModal', 'uploadModal', 'clearModal'];
        modals.forEach(id => {
            const m = document.getElementById(id);
            if (m) m.classList.add('hidden');
        });
        document.body.classList.remove('modal-active');
    }
});

/* --- 3. Profile Page (Image Preview) --- */

// Added window context so it works from HTML onchange
window.previewImage = function(input) {
    const file = input.files[0];
    const preview = document.getElementById('previewImg');
    const initials = document.getElementById('initials');

    if (file && preview) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            if (initials) initials.classList.add('hidden');
        }
        reader.readAsDataURL(file);
    }
}

/* --- 4. Page Specific Actions --- */
window.handleExport = function() {
    alert("Exporting current view to CSV...");
}

window.confirmAction = function(type) {
    const message = type === 'all' ? "Wiping all logs..." : "Clearing old logs...";
    if (confirm(message)) {
        alert("Action successful!");
        closeModal('clearModal');
    }
}

/* session Page*/

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}


/* session Detail Page*/
function filterByStatus(statusId) {

    const tabs = document.querySelectorAll('.status-tab');

    tabs.forEach(tab => {
        tab.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-sm');
        tab.classList.add('text-slate-500');
    });

    const activeTab = document.getElementById(`tab-${statusId}`);
    activeTab.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-sm');
    activeTab.classList.remove('text-slate-500');

    const rows = document.querySelectorAll('.student-row');

    rows.forEach(row => {
        if (row.classList.contains(`row-status-${statusId}`)) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
}
const sessionDropdown = document.getElementById('sessionDropdown');

if (sessionDropdown) {
    sessionDropdown.addEventListener('change', () => {
        const activeTab = document.querySelector('.status-tab.active');
        if (activeTab) {
            const statusId = activeTab.id.split('-')[1];
            filterByStatus(statusId);
        }
    });
}



// /* Student-verification Page*/

// function filterByStatus(statusId) {
//     // 1. Tab Visual Swap
//     document.querySelectorAll('.status-tab').forEach(tab => {
//         tab.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-sm');
//         tab.classList.add('text-slate-500');
//     });

//     const activeTab = document.getElementById(`tab-${statusId}`);
//     activeTab.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-sm');
//     activeTab.classList.remove('text-slate-500');

//     // 2. Row Filtering (For Static Rows)
//     // Real API use karte waqt yahan fetch call hoga
//     document.querySelectorAll('.student-row').forEach(row => {
//         if (row.classList.contains(`row-status-${statusId}`)) {
//             row.classList.remove('hidden');
//         } else {
//             row.classList.add('hidden');
//         }
//     });
// }
