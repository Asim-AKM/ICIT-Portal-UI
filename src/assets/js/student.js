/* --- 1. Global Navigation & Dropdowns --- */
const stdMenuBtn = document.getElementById('mobile-menu-btn');
const stdMobileMenu = document.getElementById('mobile-menu');
const stdHamburgerIcon = document.getElementById('hamburger-icon');
const stdUserBtn = document.getElementById('user-menu-button');
const stdUserDropdown = document.getElementById('user-dropdown');

// FYP Mobile Sidebar Nested Menu
const fypToggle = document.getElementById('fyp-mobile-toggle');
const fypMenu = document.getElementById('fyp-mobile-menu');
const fypChevron = document.getElementById('fyp-chevron');

// Toggle User Dropdown
if (stdUserBtn && stdUserDropdown) {
    stdUserBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stdUserDropdown.classList.toggle('hidden');
    });
}

// Toggle Main Mobile Menu
if (stdMenuBtn && stdMobileMenu) {
    stdMenuBtn.addEventListener('click', () => {
        const isHidden = stdMobileMenu.classList.toggle('hidden');
        if (stdHamburgerIcon) {
            stdHamburgerIcon.classList.toggle('fa-bars', isHidden);
            stdHamburgerIcon.classList.toggle('fa-times', !isHidden);
        }
    });
}

// Toggle Nested FYP Menu (Mobile Only)
if (fypToggle && fypMenu) {
    fypToggle.addEventListener('click', () => {
        fypMenu.classList.toggle('hidden');
        if (fypChevron) fypChevron.classList.toggle('rotate-180');
    });
}

// Close dropdowns on outside click
window.addEventListener('click', (e) => {
    if (stdUserDropdown && stdUserBtn && !stdUserBtn.contains(e.target)) {
        stdUserDropdown.classList.add('hidden');
    }
});


/* --- 2. FYP Submission Stepper Logic --- */
let currentStep = 1;

window.updateUI = function() {
    // Content Sections check
    const step1 = document.getElementById('step1-content');
    if (!step1) return; // Exit if not on submission page

    document.getElementById('step1-content').classList.toggle('hidden', currentStep !== 1);
    document.getElementById('step2-content').classList.toggle('hidden', currentStep !== 2);
    document.getElementById('step3-content').classList.toggle('hidden', currentStep !== 3);

    // Tabs Styling
    [1, 2, 3].forEach(num => {
        const tab = document.getElementById(`step${num}-tab`);
        if (!tab) return;
        const dot = tab.querySelector('span');
        
        if (num === currentStep) {
            tab.className = "pb-4 border-b-2 border-indigo-600 text-indigo-600 font-bold text-sm flex items-center gap-2";
            dot.className = "w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center";
            dot.innerHTML = num;
        } else if (num < currentStep) {
            tab.className = "pb-4 border-b-2 border-emerald-500 text-emerald-500 font-bold text-sm flex items-center gap-2";
            dot.className = "w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center";
            dot.innerHTML = '<i class="fas fa-check"></i>';
        } else {
            tab.className = "pb-4 border-b-2 border-transparent text-slate-400 font-bold text-sm flex items-center gap-2";
            dot.className = "w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[10px] flex items-center justify-center";
            dot.innerHTML = num;
        }
    });

    // Navigation Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.classList.toggle('hidden', currentStep === 3);
    if (submitBtn) submitBtn.classList.toggle('hidden', currentStep !== 3);
};

window.nextStep = function() {
    if (currentStep < 3) { currentStep++; updateUI(); }
};

window.prevStep = function() {
    if (currentStep > 1) { currentStep--; updateUI(); }
};


/* --- 3. Profile & Forms --- */

// Image Preview
const imgInput = document.getElementById('img-upload');
if (imgInput) {
    imgInput.onchange = function (evt) {
        const files = evt.target.files;
        const preview = document.getElementById('profile-preview');
        if (FileReader && files && files.length && preview) {
            const fr = new FileReader();
            fr.onload = () => preview.src = fr.result;
            fr.readAsDataURL(files[0]);
        }
    };
}

// Form Submission
const proposalForm = document.getElementById('proposal-form');
if (proposalForm) {
    proposalForm.onsubmit = (e) => {
        e.preventDefault();
        alert("Proposal submitted successfully!");
        window.location.href = "dashboard.html";
    };
}