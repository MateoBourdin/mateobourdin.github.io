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

// CV Modal functionality (only on pages that have the CV button)
const cvModal = document.getElementById('cvModal');
const downloadCVBtn = document.getElementById('downloadCVBtn');
const closeCVModal = document.getElementById('closeCVModal');

if (cvModal && downloadCVBtn && closeCVModal) {
    downloadCVBtn.addEventListener('click', () => {
        cvModal.classList.add('active');
    });

    closeCVModal.addEventListener('click', () => {
        cvModal.classList.remove('active');
    });

    cvModal.addEventListener('click', (e) => {
        if (e.target === cvModal) {
            cvModal.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cvModal.classList.contains('active')) {
            cvModal.classList.remove('active');
        }
    });
}

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
    const page = document.body.dataset.page;
    document.title = (translations[lang].metaPages && translations[lang].metaPages[page]) || translations[lang].meta.title;
    if (!page || page === 'home') document.querySelector('meta[name="description"]').setAttribute('content', translations[lang].meta.description);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) {
            element.textContent = translation;
        }
    });

    // Update translated image alt texts
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const translation = getNestedTranslation(translations[lang], element.getAttribute('data-i18n-alt'));
        if (translation) {
            element.setAttribute('alt', translation);
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

// Project filter (academic / personal), on the projects page only.
// Category sections left with no visible project are hidden too.
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.toggle('active', b === btn));
        const filter = btn.getAttribute('data-filter');

        document.querySelectorAll('.project-category').forEach(section => {
            let visible = 0;
            section.querySelectorAll('.project-card').forEach(card => {
                const show = filter === 'all' || card.getAttribute('data-type') === filter;
                card.style.display = show ? '' : 'none';
                if (show) {
                    visible++;
                    card.classList.add('active');
                }
            });
            section.hidden = visible === 0;
        });
    });
});
