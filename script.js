// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Burger menu toggle
const burgerMenu = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');

burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a navigation link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll reveal animation
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Check on load

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CV Modal functionality
const cvModal = document.getElementById('cvModal');
const downloadCVBtn = document.getElementById('downloadCVBtn');
const closeCVModal = document.getElementById('closeCVModal');

// Open modal
downloadCVBtn.addEventListener('click', () => {
    cvModal.classList.add('active');
});

// Close modal when clicking close button
closeCVModal.addEventListener('click', () => {
    cvModal.classList.remove('active');
});

// Close modal when clicking outside
cvModal.addEventListener('click', (e) => {
    if (e.target === cvModal) {
        cvModal.classList.remove('active');
    }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal.classList.contains('active')) {
        cvModal.classList.remove('active');
    }
});

// Get nested translation value
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
}

// Change language function
function changeLanguage(lang) {
    // Save preference
    localStorage.setItem('preferredLanguage', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update meta tags
    document.title = translations[lang].meta.title;
    document.querySelector('meta[name="description"]').setAttribute('content', translations[lang].meta.description);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) {
            element.textContent = translation;
        }
    });

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

// Language button click handlers
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        changeLanguage(lang);
    });
});

// Load saved language preference or default to French
const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
changeLanguage(savedLang);

// Project Filters Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const techFilterButtons = document.querySelectorAll('.tech-filter-btn');
const projectCards = document.querySelectorAll('.project-card');

let currentTypeFilter = 'all';
let currentTechFilter = 'all';

// Type filter (Academic/Personal/All)
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(b => {
            b.classList.remove('active');
            b.style.background = 'white';
            b.style.color = 'var(--primary)';
        });
        btn.classList.add('active');
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';

        // Get filter value
        currentTypeFilter = btn.getAttribute('data-filter');
        applyFilters();
    });
});

// Tech filter (Python/Web/Database/All)
techFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        techFilterButtons.forEach(b => {
            b.classList.remove('active');
            b.style.background = 'white';
            b.style.color = 'var(--accent-purple)';
        });
        btn.classList.add('active');
        btn.style.background = 'var(--accent-purple)';
        btn.style.color = 'white';

        // Get filter value
        currentTechFilter = btn.getAttribute('data-tech');
        applyFilters();
    });
});

// Apply both filters
function applyFilters() {
    projectCards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        const cardTech = card.getAttribute('data-tech') || '';

        const typeMatch = currentTypeFilter === 'all' || cardType === currentTypeFilter;
        const techMatch = currentTechFilter === 'all' || cardTech.includes(currentTechFilter);

        if (typeMatch && techMatch) {
            card.style.display = '';
            // Re-trigger reveal animation
            setTimeout(() => card.classList.add('active'), 100);
        } else {
            card.style.display = 'none';
        }
    });
}
