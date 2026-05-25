/* ============================================
   Genztech Shared JavaScript
   ============================================ */

const GENZTECH_AUTH_KEY = 'genztech_logged_in';
const GENZTECH_ROUTES = {
    home: 'homepage.html',
    career: 'career-counselling.html',
    internships: 'internships.html',
    certifications: 'certifications.html',
    courses: 'short-term-courses.html',
    placement: 'placement.html',
    contact: 'contact.html',
    domainCs: 'domain-cs.html',
    domainMechanical: 'domain-mechanical.html',
    domainMba: 'domain-mba.html',
    domainEtc: 'domain-etc.html',
    login: 'loginpage.html',
    signup: 'signuppage.html'
};

function isPagesView() {
    return window.location.pathname.replace(/\\/g, '/').includes('/pages/');
}

function routeTo(fileName) {
    return isPagesView() ? fileName : `pages/${fileName}`;
}

function rootTo(fileName) {
    return isPagesView() ? `../${fileName}` : fileName;
}

function isLoggedIn() {
    return localStorage.getItem(GENZTECH_AUTH_KEY) === 'true';
}

function setLoggedIn(value) {
    localStorage.setItem(GENZTECH_AUTH_KEY, value ? 'true' : 'false');
}

function getCurrentPageName() {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || 'index.html';
}

function protectCurrentPage() {
    const currentPage = getCurrentPageName();
    const publicPages = new Set(['loginpage.html', 'signuppage.html']);
    const protectedPages = new Set([
        'index.html',
        'homepage.html',
        'career-counselling.html',
        'internships.html',
        'certifications.html',
        'short-term-courses.html',
        'placement.html',
        'contact.html',
        'domain-cs.html',
        'domain-mechanical.html',
        'domain-mba.html',
        'domain-etc.html'
    ]);

    if (publicPages.has(currentPage)) {
        if (isLoggedIn()) {
            window.location.replace(routeTo(GENZTECH_ROUTES.home));
        }
        return;
    }

    if (protectedPages.has(currentPage) && !isLoggedIn()) {
        window.location.replace(rootTo(GENZTECH_ROUTES.login));
    }
}

function normalizeSiteLinks() {
    const replacements = new Map([
        ['homepage.html', routeTo(GENZTECH_ROUTES.home)],
        ['pages/homepage.html', routeTo(GENZTECH_ROUTES.home)],
        ['career-counselling.html', routeTo(GENZTECH_ROUTES.career)],
        ['pages/career-counselling.html', routeTo(GENZTECH_ROUTES.career)],
        ['internships.html', routeTo(GENZTECH_ROUTES.internships)],
        ['pages/internships.html', routeTo(GENZTECH_ROUTES.internships)],
        ['certifications.html', routeTo(GENZTECH_ROUTES.certifications)],
        ['pages/certifications.html', routeTo(GENZTECH_ROUTES.certifications)],
        ['short-term-courses.html', routeTo(GENZTECH_ROUTES.courses)],
        ['pages/short-term-courses.html', routeTo(GENZTECH_ROUTES.courses)],
        ['placement.html', routeTo(GENZTECH_ROUTES.placement)],
        ['pages/placement.html', routeTo(GENZTECH_ROUTES.placement)],
        ['contact.html', routeTo(GENZTECH_ROUTES.contact)],
        ['pages/contact.html', routeTo(GENZTECH_ROUTES.contact)],
        ['domain-cs.html', routeTo(GENZTECH_ROUTES.domainCs)],
        ['pages/domain-cs.html', routeTo(GENZTECH_ROUTES.domainCs)],
        ['domain-mechanical.html', routeTo(GENZTECH_ROUTES.domainMechanical)],
        ['pages/domain-mechanical.html', routeTo(GENZTECH_ROUTES.domainMechanical)],
        ['domain-mba.html', routeTo(GENZTECH_ROUTES.domainMba)],
        ['pages/domain-mba.html', routeTo(GENZTECH_ROUTES.domainMba)],
        ['domain-etc.html', routeTo(GENZTECH_ROUTES.domainEtc)],
        ['pages/domain-etc.html', routeTo(GENZTECH_ROUTES.domainEtc)],
        ['loginpage.html', rootTo(GENZTECH_ROUTES.login)],
        ['pages/loginpage.html', rootTo(GENZTECH_ROUTES.login)],
        ['signuppage.html', rootTo(GENZTECH_ROUTES.signup)],
        ['pages/signuppage.html', rootTo(GENZTECH_ROUTES.signup)]
    ]);

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        const cleanHref = href.replace(/^\.\//, '');
        if (replacements.has(cleanHref)) {
            link.setAttribute('href', replacements.get(cleanHref));
        }
    });
}

function wireTransactionalButtons() {
    document.querySelectorAll('button').forEach(button => {
        const text = button.textContent.trim().toLowerCase();
        if (text === 'contact us' && !button.closest('a')) {
            button.addEventListener('click', () => {
                window.location.href = routeTo(GENZTECH_ROUTES.contact);
            });
        }
    });
}

function wireHeroImages() {
    document.querySelectorAll('.page-hero[data-hero-image]').forEach(hero => {
        const imageUrl = hero.dataset.heroImage?.trim();
        if (!imageUrl) {
            return;
        }
        hero.style.setProperty('--hero-image', `url("${imageUrl}")`);
    });
}

function wireLoginForm() {
    const loginForm = document.querySelector('form');
    if (!loginForm || getCurrentPageName() !== GENZTECH_ROUTES.login) {
        return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!submitBtn) {
            setLoggedIn(true);
            window.location.href = routeTo(GENZTECH_ROUTES.home);
            return;
        }

        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="animate-spin material-symbols-outlined">progress_activity</span> Authenticating...`;

        setTimeout(() => {
            setLoggedIn(true);
            submitBtn.innerHTML = `<span class="material-symbols-outlined">check_circle</span> Success`;
            submitBtn.classList.remove('bg-primary');
            submitBtn.classList.add('bg-secondary');

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                submitBtn.classList.remove('bg-secondary');
                submitBtn.classList.add('bg-primary');
                window.location.href = routeTo(GENZTECH_ROUTES.home);
            }, 500);
        }, 1200);
    });
}

function wireSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm || getCurrentPageName() !== GENZTECH_ROUTES.signup) {
        return;
    }

    const submitBtn = signupForm.querySelector('button[type="submit"]');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!submitBtn) {
            window.location.href = rootTo(GENZTECH_ROUTES.login);
            return;
        }

        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span> Processing...`;

        setTimeout(() => {
            submitBtn.innerHTML = `<span class="material-symbols-outlined">check_circle</span> Account Created`;
            submitBtn.classList.remove('bg-primary');
            submitBtn.classList.add('bg-secondary');

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                submitBtn.classList.remove('bg-secondary');
                submitBtn.classList.add('bg-primary');
                window.location.href = rootTo(GENZTECH_ROUTES.login);
            }, 700);
        }, 1200);
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('open');
}

// Mobile accordion for dropdowns
document.addEventListener('DOMContentLoaded', function () {
    protectCurrentPage();
    normalizeSiteLinks();
    wireTransactionalButtons();
    wireHeroImages();
    wireLoginForm();
    wireSignupForm();

    // Mobile accordion
    document.querySelectorAll('.mobile-acc-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.nextElementSibling;
            if (target) target.classList.toggle('hidden');
            const icon = btn.querySelector('.acc-icon');
            if (icon) icon.style.transform = target.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Card hover icon animation
    document.querySelectorAll('.card-hover').forEach(card => {
        const icon = card.querySelector('.card-icon');
        card.addEventListener('mouseenter', () => {
            if (icon) { icon.style.transform = 'scale(1.2) rotate(5deg)'; icon.style.transition = 'transform 0.3s ease'; }
        });
        card.addEventListener('mouseleave', () => {
            if (icon) { icon.style.transform = 'scale(1) rotate(0deg)'; }
        });
    });

    // Enroll form submit handler
    const enrollForm = document.getElementById('enroll-form');
    if (enrollForm) {
        enrollForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = enrollForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span> Submitting...`;
            setTimeout(() => {
                btn.innerHTML = `<span class="material-symbols-outlined">check_circle</span> Submitted!`;
                btn.classList.replace('bg-primary', 'bg-secondary');
                setTimeout(() => { btn.disabled = false; btn.innerHTML = orig; btn.classList.replace('bg-secondary', 'bg-primary'); enrollForm.reset(); }, 3000);
            }, 1500);
        });
    }
});
