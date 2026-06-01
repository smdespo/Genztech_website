/* ============================================
   Genztech Shared JavaScript
   ============================================ */

const GENZTECH_AUTH_KEY = 'genztech_logged_in';
const GENZTECH_USER_KEY = 'genztech_user';
const GENZTECH_USERS_KEY = 'genztech_users';
const GENZTECH_ENROLLMENTS_KEY = 'genztech_enrollments';
const GENZTECH_APPLICATIONS_KEY = 'genztech_applications';
const GENZTECH_API_BASE = (function resolveApiBase() {
    if (typeof window !== 'undefined' && window.GENZTECH_API_BASE_OVERRIDE) {
        return window.GENZTECH_API_BASE_OVERRIDE;
    }
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    if (host === 'localhost' || host === '127.0.0.1' || host === '') {
        return 'http://127.0.0.1:8000';
    }
    // PRODUCTION: replace with your Render service URL after deploying the backend
    return 'https://genztech-backend.onrender.com';
})();
const GENZTECH_ADMIN_TOKEN_KEY = 'genztech_admin_token';
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
    signup: 'signuppage.html',
    adminPanel: 'adminpanel.html'
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

function readJsonStorage(key, fallbackValue) {
    try {
        const rawValue = localStorage.getItem(key);
        return rawValue ? JSON.parse(rawValue) : fallbackValue;
    } catch (error) {
        return fallbackValue;
    }
}

function writeJsonStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function isLoggedIn() {
    return localStorage.getItem(GENZTECH_AUTH_KEY) === 'true';
}

function setLoggedIn(value) {
    localStorage.setItem(GENZTECH_AUTH_KEY, value ? 'true' : 'false');
}

function normalizeUser(user) {
    if (!user) {
        return null;
    }

    return {
        fullName: user.fullName || user.Full_Name || user.fullname || user.name || '',
        email: user.email || user.Email || '',
        phone: user.phone || user.Phone_Number || user.phoneNumber || '',
        course: user.course || user.Course || user.courseInterest || ''
    };
}

function getStoredUser() {
    return normalizeUser(readJsonStorage(GENZTECH_USER_KEY, null));
}

function setStoredUser(user) {
    const normalizedUser = normalizeUser(user);
    if (!normalizedUser) {
        localStorage.removeItem(GENZTECH_USER_KEY);
        return;
    }

    writeJsonStorage(GENZTECH_USER_KEY, normalizedUser);
}

function setAuthSession(user) {
    setLoggedIn(true);
    setStoredUser(user);
}

function clearAuthSession() {
    setLoggedIn(false);
    localStorage.removeItem(GENZTECH_USER_KEY);
}

function getLocalUsers() {
    return readJsonStorage(GENZTECH_USERS_KEY, []);
}

function saveLocalUser(user) {
    const currentUsers = getLocalUsers();
    const normalizedEmail = user.email.trim().toLowerCase();
    const filteredUsers = currentUsers.filter(item => item.email.trim().toLowerCase() !== normalizedEmail);
    filteredUsers.push(user);
    writeJsonStorage(GENZTECH_USERS_KEY, filteredUsers);
}

function findLocalUserByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    return getLocalUsers().find(user => user.email.trim().toLowerCase() === normalizedEmail) || null;
}

function getEnrollmentRecords() {
    return readJsonStorage(GENZTECH_ENROLLMENTS_KEY, []);
}

function saveEnrollmentRecord(record) {
    const enrollments = getEnrollmentRecords();
    enrollments.unshift({
        ...record,
        submittedAt: new Date().toISOString()
    });
    writeJsonStorage(GENZTECH_ENROLLMENTS_KEY, enrollments);
}

function getApplicationRecords() {
    return readJsonStorage(GENZTECH_APPLICATIONS_KEY, []);
}

function saveApplicationRecord(record) {
    const applications = getApplicationRecords();
    applications.unshift({
        ...record,
        submittedAt: new Date().toISOString()
    });
    writeJsonStorage(GENZTECH_APPLICATIONS_KEY, applications);
}

function getCurrentPageName() {
    const parts = window.location.pathname.split('/');
    const name = parts[parts.length - 1] || 'index.html';
    return name.includes('.') ? name : name + '.html';
}

function isAuthPage() {
    const currentPage = getCurrentPageName();
    return currentPage === GENZTECH_ROUTES.login || currentPage === GENZTECH_ROUTES.signup;
}

function protectCurrentPage() {
    return;
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
        ['pages/signuppage.html', rootTo(GENZTECH_ROUTES.signup)],
        ['adminpanel.html', rootTo(GENZTECH_ROUTES.adminPanel)],
        ['pages/adminpanel.html', rootTo(GENZTECH_ROUTES.adminPanel)]
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

function showFormMessage(form, message, type) {
    const status = form.querySelector('[data-form-message]');
    if (!status) {
        return;
    }

    const baseClasses = 'rounded-lg border px-4 py-3 text-sm font-semibold';
    const typeClasses = {
        info: 'border-outline-variant bg-surface-container text-on-surface',
        success: 'border-secondary/30 bg-secondary/10 text-secondary',
        error: 'border-error/30 bg-error-container text-on-error-container'
    };

    status.className = `${baseClasses} ${typeClasses[type] || typeClasses.info}`;
    status.textContent = message;
    status.classList.remove('hidden');
}

function setSubmittingState(button, label) {
    if (!button) {
        return;
    }

    button.dataset.originalContent = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span> ${label}`;
}

function setSuccessState(button, label) {
    if (!button) {
        return;
    }

    button.innerHTML = `<span class="material-symbols-outlined">check_circle</span> ${label}`;
    button.classList.remove('bg-primary');
    button.classList.add('bg-secondary');
}

function restoreButtonState(button) {
    if (!button) {
        return;
    }

    button.disabled = false;
    button.innerHTML = button.dataset.originalContent || button.innerHTML;
    button.classList.remove('bg-secondary');
    button.classList.add('bg-primary');
}

async function postJson(path, payload) {
    let response;

    try {
        response = await fetch(`${GENZTECH_API_BASE}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        throw new Error('Backend is not reachable. Start the FastAPI server and try again.');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.detail || data.message || 'Request failed.');
    }

    return data;
}

async function fetchJson(path) {
    let response;

    const headers = {};
    if (path.startsWith('/admin')) {
        const token = localStorage.getItem(GENZTECH_ADMIN_TOKEN_KEY);
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    try {
        response = await fetch(`${GENZTECH_API_BASE}${path}`, { headers });
    } catch (error) {
        throw new Error('Backend is not reachable. Check the API URL or try again later.');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.detail || data.message || 'Request failed.');
    }

    return data;
}

async function adminLogin(email, password) {
    const response = await fetch(`${GENZTECH_API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.detail || 'Admin login failed.');
    }
    localStorage.setItem(GENZTECH_ADMIN_TOKEN_KEY, data.token);
    return data;
}

function adminLogout() {
    localStorage.removeItem(GENZTECH_ADMIN_TOKEN_KEY);
}

function setAsyncButtonState(button, label) {
    if (!button) {
        return;
    }

    button.dataset.originalContent = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span> ${label}`;
}

function setAsyncButtonSuccess(button, label) {
    if (!button) {
        return;
    }

    button.disabled = true;
    button.innerHTML = `<span class="material-symbols-outlined">check_circle</span> ${label}`;
}

function restoreAsyncButtonState(button) {
    if (!button) {
        return;
    }

    button.disabled = false;
    button.innerHTML = button.dataset.originalContent || button.innerHTML;
}

function createGuestAccountMarkup() {
    return `
        <button type="button" class="navbar-account-trigger" aria-label="Account access">
            <span class="navbar-account-avatar">GT</span>
        </button>
        <div class="navbar-account-panel">
            <div class="font-title-md text-title-md text-primary mb-xs">Guest Access</div>
            <div class="font-body-md text-body-md text-on-surface-variant">Log in to access your profile and save your learning journey.</div>
            <div class="navbar-account-actions">
                <a class="primary-action inline-flex items-center justify-center" href="${rootTo(GENZTECH_ROUTES.login)}">Log In</a>
                <a class="secondary-action inline-flex items-center justify-center" href="${rootTo(GENZTECH_ROUTES.signup)}">Sign Up</a>
            </div>
        </div>
    `;
}

function createLoggedInAccountMarkup(user) {
    return `
        <button type="button" class="navbar-account-trigger" aria-label="Open account panel">
            <span class="navbar-account-avatar">${getUserInitials(user)}</span>
        </button>
        <div class="navbar-account-panel">
            <div class="font-title-md text-title-md text-primary mb-sm">${user.fullName || 'Genztech Member'}</div>
            <div class="navbar-account-line">
                <span class="material-symbols-outlined">mail</span>
                <span>${user.email || 'No email saved'}</span>
            </div>
            <div class="navbar-account-line">
                <span class="material-symbols-outlined">call</span>
                <span>${user.phone || 'No phone saved'}</span>
            </div>
            <div class="navbar-account-line">
                <span class="material-symbols-outlined">school</span>
                <span>${user.course || 'Course not selected yet'}</span>
            </div>
            <div class="navbar-account-actions">
                <a class="primary-action inline-flex items-center justify-center" href="${routeTo(GENZTECH_ROUTES.home)}">Go Home</a>
                <button type="button" class="secondary-action" id="genztech-logout-btn">Log Out</button>
            </div>
        </div>
    `;
}

function getUserInitials(user) {
    if (!user || !user.fullName) {
        return 'GT';
    }

    return user.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join('');
}

function renderAccountControl() {
    let slot = document.querySelector('[data-account-slot]');
    if (!slot) {
        const rightContainer = document.querySelector('header > div:last-child');
        if (!rightContainer) {
            return;
        }
        slot = document.createElement('div');
        slot.setAttribute('data-account-slot', 'generated');
        rightContainer.appendChild(slot);
    }

    if (slot.dataset.accountReady === 'true') {
        return;
    }

    slot.parentElement?.appendChild(slot);

    const user = getStoredUser();
    slot.classList.add('navbar-account');
    slot.innerHTML = isLoggedIn() && user ? createLoggedInAccountMarkup(user) : createGuestAccountMarkup();
    slot.dataset.accountReady = 'true';

    const trigger = slot.querySelector('.navbar-account-trigger');
    trigger?.addEventListener('click', event => {
        event.stopPropagation();
        slot.classList.toggle('open');
    });

    document.addEventListener('click', event => {
        if (!slot.contains(event.target)) {
            slot.classList.remove('open');
        }
    });

    slot.querySelector('#genztech-logout-btn')?.addEventListener('click', () => {
        clearAuthSession();
        window.location.replace(rootTo(GENZTECH_ROUTES.login));
    });
}

function getCurrentContextTitle() {
    const title = document.querySelector('h1')?.textContent?.trim();
    return title || document.title.replace(/\s+\|.*$/, '').trim() || 'Genztech Program';
}

function injectGeneralModals() {
    if (isAuthPage()) {
        return;
    }

    if (document.getElementById('general-enrollment-modal')) {
        if (!document.getElementById('enrollment-success-toast')) {
            const toastOnly = document.createElement('div');
            toastOnly.innerHTML = `
                <div id="enrollment-success-toast" class="success-toast" aria-live="polite">
                  <div class="success-toast-icon">
                    <span class="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <div class="font-title-md text-title-md text-primary">Success</div>
                    <div class="font-body-md text-body-md text-on-surface-variant">Thank you! Our counsellor will contact you shortly.</div>
                  </div>
                </div>
            `;
            document.body.appendChild(toastOnly);
        }
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="general-enrollment-modal" class="general-modal" aria-hidden="true">
          <div class="enrollment-backdrop" data-modal-close="general-enrollment-modal"></div>
          <div class="general-modal-dialog">
            <div class="enrollment-grid">
              <aside class="enrollment-aside">
                <div class="badge badge-teal mb-md"><span class="material-symbols-outlined text-[16px]">school</span> Course Enrollment</div>
                <h2 class="font-headline-lg text-headline-lg text-white mb-md">Enroll for courses</h2>
                <p class="font-body-md text-body-md text-white/80 mb-lg">Pick your preferred course, tell us your background, and our counsellor will help you with the right batch and learning mode.</p>
                <div class="space-y-md">
                  <div class="rounded-xl bg-white/10 p-md">
                    <div class="font-title-md text-title-md text-white">Ideal for</div>
                    <p class="mt-xs font-body-md text-body-md text-white/75">Students, freshers, and working professionals looking to upskill into a career-focused program.</p>
                  </div>
                </div>
              </aside>
              <div class="enrollment-form-panel">
                <div class="flex items-start justify-between gap-md mb-lg">
                  <div>
                    <p class="font-label-md text-label-md text-secondary uppercase tracking-wider">Enroll Now</p>
                    <h3 class="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-lg text-primary">Course Enrollment Form</h3>
                  </div>
                  <button type="button" class="btn-secondary !min-h-[42px] !px-4" data-modal-close="general-enrollment-modal">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <form id="general-enrollment-form" class="space-y-md" novalidate>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div class="premium-field" data-field="fullName">
                      <label for="general-enroll-fullname">Full Name <span class="required-mark">*</span></label>
                      <input id="general-enroll-fullname" name="fullName" class="premium-input" type="text" placeholder="Enter your full name"/>
                      <div class="field-error" data-error-for="fullName"></div>
                    </div>
                    <div class="premium-field" data-field="email">
                      <label for="general-enroll-email">Email Address <span class="required-mark">*</span></label>
                      <input id="general-enroll-email" name="email" class="premium-input" type="email" placeholder="name@example.com"/>
                      <div class="field-error" data-error-for="email"></div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div class="premium-field" data-field="phone">
                      <label for="general-enroll-phone">Phone Number <span class="required-mark">*</span></label>
                      <input id="general-enroll-phone" name="phone" class="premium-input" type="tel" placeholder="+91 98765 43210"/>
                      <div class="field-error" data-error-for="phone"></div>
                    </div>
                    <div class="premium-field" data-field="category">
                      <label for="general-enroll-category">College / Working Professional <span class="required-mark">*</span></label>
                      <select id="general-enroll-category" name="category" class="premium-select">
                        <option value="">Select an option</option>
                        <option value="College Student">College Student</option>
                        <option value="Working Professional">Working Professional</option>
                      </select>
                      <div class="field-error" data-error-for="category"></div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div class="premium-field" data-field="course">
                      <label for="general-enroll-course">Course Interested In <span class="required-mark">*</span></label>
                      <select id="general-enroll-course" name="course" class="premium-select">
                        <option value="">Select a course</option>
                        <option value="Full Stack Development">Full Stack Development</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="Cyber Security">Cyber Security</option>
                        <option value="Internship Program">Internship Program</option>
                        <option value="Other">Other</option>
                      </select>
                      <div class="field-error" data-error-for="course"></div>
                    </div>
                    <div class="premium-field" data-field="qualification">
                      <label for="general-enroll-qualification">Current Qualification <span class="required-mark">*</span></label>
                      <input id="general-enroll-qualification" name="qualification" class="premium-input" type="text" placeholder="B.E., MCA, BCA, Working Professional"/>
                      <div class="field-error" data-error-for="qualification"></div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div class="premium-field" data-field="learningMode">
                      <label for="general-enroll-learning-mode">Preferred Learning Mode <span class="required-mark">*</span></label>
                      <select id="general-enroll-learning-mode" name="learningMode" class="premium-select">
                        <option value="">Select mode</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      <div class="field-error" data-error-for="learningMode"></div>
                    </div>
                    <div class="premium-field" data-field="message">
                      <label for="general-enroll-message">Message / Career Goal</label>
                      <textarea id="general-enroll-message" name="message" class="premium-textarea" placeholder="Tell us your target role, domain, or preferred outcome."></textarea>
                      <div class="field-error" data-error-for="message"></div>
                    </div>
                  </div>
                  <div class="enrollment-actions">
                    <button class="btn-secondary" type="button" data-modal-close="general-enrollment-modal">Cancel</button>
                    <button class="btn-primary" type="submit">Submit Enrollment <span class="material-symbols-outlined text-[18px]">send</span></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div id="general-application-modal" class="general-modal" aria-hidden="true">
          <div class="enrollment-backdrop" data-modal-close="general-application-modal"></div>
          <div class="general-modal-dialog">
            <div class="enrollment-grid">
              <aside class="enrollment-aside">
                <div class="badge badge-teal mb-md"><span class="material-symbols-outlined text-[16px]">assignment_ind</span> Application Form</div>
                <h2 class="font-headline-lg text-headline-lg text-white mb-md">Apply for the program</h2>
                <p class="font-body-md text-body-md text-white/80 mb-lg">Share your background and the role or program you are applying for. Our team will guide you on the next steps.</p>
                <div class="rounded-xl bg-white/10 p-md">
                  <div class="font-title-md text-title-md text-white">Recommended for</div>
                  <p class="mt-xs font-body-md text-body-md text-white/75">Internships, placement tracks, and course applications that need more intent than a general enquiry.</p>
                </div>
              </aside>
              <div class="enrollment-form-panel">
                <div class="flex items-start justify-between gap-md mb-lg">
                  <div>
                    <p class="font-label-md text-label-md text-secondary uppercase tracking-wider">Apply Now</p>
                    <h3 class="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-lg text-primary">Program Application Form</h3>
                  </div>
                  <button type="button" class="btn-secondary !min-h-[42px] !px-4" data-modal-close="general-application-modal">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <form id="general-application-form" class="space-y-md" novalidate>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div class="premium-field" data-field="fullName">
                      <label for="general-apply-fullname">Full Name <span class="required-mark">*</span></label>
                      <input id="general-apply-fullname" name="fullName" class="premium-input" type="text" placeholder="Enter your full name"/>
                      <div class="field-error" data-error-for="fullName"></div>
                    </div>
                    <div class="premium-field" data-field="email">
                      <label for="general-apply-email">Email Address <span class="required-mark">*</span></label>
                      <input id="general-apply-email" name="email" class="premium-input" type="email" placeholder="name@example.com"/>
                      <div class="field-error" data-error-for="email"></div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div class="premium-field" data-field="phone">
                      <label for="general-apply-phone">Phone Number <span class="required-mark">*</span></label>
                      <input id="general-apply-phone" name="phone" class="premium-input" type="tel" placeholder="+91 98765 43210"/>
                      <div class="field-error" data-error-for="phone"></div>
                    </div>
                    <div class="premium-field" data-field="program">
                      <label for="general-apply-program">Applying For <span class="required-mark">*</span></label>
                      <input id="general-apply-program" name="program" class="premium-input" type="text" placeholder="Internship, course, or track"/>
                      <div class="field-error" data-error-for="program"></div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div class="premium-field" data-field="qualification">
                      <label for="general-apply-qualification">Current Qualification <span class="required-mark">*</span></label>
                      <input id="general-apply-qualification" name="qualification" class="premium-input" type="text" placeholder="B.E., MCA, Diploma, Working Professional"/>
                      <div class="field-error" data-error-for="qualification"></div>
                    </div>
                    <div class="premium-field" data-field="experience">
                      <label for="general-apply-experience">Experience Level <span class="required-mark">*</span></label>
                      <select id="general-apply-experience" name="experience" class="premium-select">
                        <option value="">Select level</option>
                        <option value="Student">Student</option>
                        <option value="Fresher">Fresher</option>
                        <option value="0-2 Years">0-2 Years</option>
                        <option value="2+ Years">2+ Years</option>
                      </select>
                      <div class="field-error" data-error-for="experience"></div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div class="premium-field" data-field="learningMode">
                      <label for="general-apply-learning-mode">Preferred Learning Mode <span class="required-mark">*</span></label>
                      <select id="general-apply-learning-mode" name="learningMode" class="premium-select">
                        <option value="">Select mode</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      <div class="field-error" data-error-for="learningMode"></div>
                    </div>
                    <div class="premium-field" data-field="motivation">
                      <label for="general-apply-motivation">Why are you applying? <span class="required-mark">*</span></label>
                      <textarea id="general-apply-motivation" name="motivation" class="premium-textarea" placeholder="Tell us your career goal, motivation, or expected outcome."></textarea>
                      <div class="field-error" data-error-for="motivation"></div>
                    </div>
                  </div>
                  <div class="enrollment-actions">
                    <button class="btn-secondary" type="button" data-modal-close="general-application-modal">Cancel</button>
                    <button class="btn-primary" type="submit">Submit Application <span class="material-symbols-outlined text-[18px]">send</span></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div id="enrollment-success-toast" class="success-toast" aria-live="polite">
          <div class="success-toast-icon">
            <span class="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <div class="font-title-md text-title-md text-primary">Success</div>
            <div class="font-body-md text-body-md text-on-surface-variant">Thank you! Our counsellor will contact you shortly.</div>
          </div>
        </div>
    `;
    document.body.appendChild(wrapper);
}

function showToast(message) {
    const toast = document.getElementById('enrollment-success-toast');
    if (!toast) {
        return;
    }

    const messageNode = toast.querySelector('.font-body-md');
    if (messageNode) {
        messageNode.textContent = message;
    }

    toast.classList.add('show');
    window.clearTimeout(toast.dataset.timeoutId);
    const timeoutId = window.setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
    toast.dataset.timeoutId = String(timeoutId);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
}

function clearEnrollmentErrors(form) {
    form.querySelectorAll('[data-field]').forEach(field => field.classList.remove('form-error'));
    form.querySelectorAll('[data-error-for]').forEach(node => {
        node.textContent = '';
    });
}

function setEnrollmentError(form, fieldName, message) {
    const field = form.querySelector(`[data-field="${fieldName}"]`);
    const error = form.querySelector(`[data-error-for="${fieldName}"]`);
    field?.classList.add('form-error');
    if (error) {
        error.textContent = message;
    }
}

function getEnrollmentPayload(form) {
    return {
        fullName: form.querySelector('[name="fullName"]')?.value.trim() || '',
        email: form.querySelector('[name="email"]')?.value.trim() || '',
        phone: form.querySelector('[name="phone"]')?.value.trim() || '',
        category: form.querySelector('[name="category"]')?.value || '',
        course: form.querySelector('[name="course"]')?.value || '',
        qualification: form.querySelector('[name="qualification"]')?.value.trim() || '',
        learningMode: form.querySelector('[name="learningMode"]')?.value || '',
        message: form.querySelector('[name="message"]')?.value.trim() || ''
    };
}

function validateEnrollmentPayload(form, payload) {
    clearEnrollmentErrors(form);
    let isValid = true;

    if (!payload.fullName) {
        setEnrollmentError(form, 'fullName', 'Full name is required.');
        isValid = false;
    }

    if (!payload.email) {
        setEnrollmentError(form, 'email', 'Email address is required.');
        isValid = false;
    } else if (!validateEmail(payload.email)) {
        setEnrollmentError(form, 'email', 'Enter a valid email address.');
        isValid = false;
    }

    if (!payload.phone) {
        setEnrollmentError(form, 'phone', 'Phone number is required.');
        isValid = false;
    } else if (!validatePhone(payload.phone)) {
        setEnrollmentError(form, 'phone', 'Enter a valid phone number.');
        isValid = false;
    }

    if (!payload.category) {
        setEnrollmentError(form, 'category', 'Please select your profile type.');
        isValid = false;
    }

    if (!payload.course) {
        setEnrollmentError(form, 'course', 'Please select a course.');
        isValid = false;
    }

    if (!payload.qualification) {
        setEnrollmentError(form, 'qualification', 'Current qualification is required.');
        isValid = false;
    }

    if (!payload.learningMode) {
        setEnrollmentError(form, 'learningMode', 'Please select a learning mode.');
        isValid = false;
    }

    return isValid;
}

function validateApplicationPayload(form, payload) {
    clearEnrollmentErrors(form);
    let isValid = true;

    if (!payload.fullName) {
        setEnrollmentError(form, 'fullName', 'Full name is required.');
        isValid = false;
    }
    if (!payload.email) {
        setEnrollmentError(form, 'email', 'Email address is required.');
        isValid = false;
    } else if (!validateEmail(payload.email)) {
        setEnrollmentError(form, 'email', 'Enter a valid email address.');
        isValid = false;
    }
    if (!payload.phone) {
        setEnrollmentError(form, 'phone', 'Phone number is required.');
        isValid = false;
    } else if (!validatePhone(payload.phone)) {
        setEnrollmentError(form, 'phone', 'Enter a valid phone number.');
        isValid = false;
    }
    if (!payload.program) {
        setEnrollmentError(form, 'program', 'Please mention the program you are applying for.');
        isValid = false;
    }
    if (!payload.qualification) {
        setEnrollmentError(form, 'qualification', 'Current qualification is required.');
        isValid = false;
    }
    if (!payload.experience) {
        setEnrollmentError(form, 'experience', 'Please select your experience level.');
        isValid = false;
    }
    if (!payload.learningMode) {
        setEnrollmentError(form, 'learningMode', 'Please select a learning mode.');
        isValid = false;
    }
    if (!payload.motivation) {
        setEnrollmentError(form, 'motivation', 'Please add a short reason for applying.');
        isValid = false;
    }

    return isValid;
}

function populateEnrollmentDefaults(form) {
    const user = getStoredUser();
    if (!user) {
        return;
    }

    const fullNameInput = form.querySelector('[name="fullName"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');

    if (fullNameInput && !fullNameInput.value) {
        fullNameInput.value = user.fullName || '';
    }
    if (emailInput && !emailInput.value) {
        emailInput.value = user.email || '';
    }
    if (phoneInput && !phoneInput.value) {
        phoneInput.value = user.phone || '';
    }
}

function getApplicationPayload(form) {
    return {
        fullName: form.querySelector('[name="fullName"]')?.value.trim() || '',
        email: form.querySelector('[name="email"]')?.value.trim() || '',
        phone: form.querySelector('[name="phone"]')?.value.trim() || '',
        program: form.querySelector('[name="program"]')?.value.trim() || '',
        qualification: form.querySelector('[name="qualification"]')?.value.trim() || '',
        experience: form.querySelector('[name="experience"]')?.value || '',
        learningMode: form.querySelector('[name="learningMode"]')?.value || '',
        motivation: form.querySelector('[name="motivation"]')?.value.trim() || ''
    };
}

function populateApplicationDefaults(form, contextLabel) {
    populateEnrollmentDefaults(form);
    const programInput = form.querySelector('[name="program"]');
    if (programInput && !programInput.value) {
        programInput.value = contextLabel || getCurrentContextTitle();
    }
}

function inferCourseFromContext(label) {
    const text = (label || '').toLowerCase();
    if (!text) {
        return '';
    }
    if (text.includes('full stack')) return 'Full Stack Development';
    if (text.includes('ai') || text.includes('ml')) return 'AI/ML';
    if (text.includes('data science') || text.includes('data analytics')) return 'Data Science';
    if (text.includes('web')) return 'Web Development';
    if (text.includes('cloud')) return 'Cloud Computing';
    if (text.includes('cyber')) return 'Cyber Security';
    if (text.includes('internship') || text.includes('placement')) return 'Internship Program';
    return 'Other';
}

function populateEnrollmentCourse(form, trigger) {
    const contextLabel =
        trigger?.closest('[class*="card"]')?.querySelector('h3, h4')?.textContent?.trim() ||
        trigger?.closest('section')?.querySelector('h1, h2')?.textContent?.trim() ||
        getCurrentContextTitle();
    const courseSelect = form.querySelector('[name="course"]');
    if (!courseSelect) {
        return;
    }
    const value = inferCourseFromContext(contextLabel);
    if ([...courseSelect.options].some(option => option.value === value)) {
        courseSelect.value = value;
    }
}

function findGeneralTriggerElements() {
    const triggerMap = {
        enroll: [],
        apply: []
    };

    document.querySelectorAll('a, button').forEach(element => {
        const label = element.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
        if (!label) {
            return;
        }

        if (
            label.includes('enroll now') ||
            label.includes('enroll for courses') ||
            label === 'enroll' ||
            label.startsWith('enroll ')
        ) {
            triggerMap.enroll.push(element);
        }

        if (
            label.includes('apply now') ||
            label.includes('apply for internship') ||
            label === 'apply' ||
            label.includes('apply via internship')
        ) {
            triggerMap.apply.push(element);
        }
    });

    return triggerMap;
}

function wireEnrollmentModal() {
    if (isAuthPage() || getCurrentPageName() === GENZTECH_ROUTES.adminPanel) {
        return;
    }

    injectGeneralModals();

    const enrollmentModal = document.getElementById('general-enrollment-modal');
    const enrollmentForm = document.getElementById('general-enrollment-form');
    const applicationModal = document.getElementById('general-application-modal');
    const applicationForm = document.getElementById('general-application-form');
    if (!enrollmentModal || !enrollmentForm || !applicationModal || !applicationForm) {
        return;
    }

    const openModal = modal => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = modal => {
        if (!modal) {
            return;
        }
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const triggerGroups = findGeneralTriggerElements();
    triggerGroups.enroll.forEach(trigger => {
        trigger.addEventListener('click', event => {
            event.preventDefault();
            populateEnrollmentDefaults(enrollmentForm);
            populateEnrollmentCourse(enrollmentForm, trigger);
            openModal(enrollmentModal);
        });
    });

    triggerGroups.apply.forEach(trigger => {
        trigger.addEventListener('click', event => {
            event.preventDefault();
            const contextLabel = trigger.closest('a')?.getAttribute('href') === '#apply'
                ? `${getCurrentContextTitle()} Application`
                : trigger.closest('[class*="card"]')?.querySelector('h3, h4')?.textContent?.trim() || `${getCurrentContextTitle()} Application`;
            populateApplicationDefaults(applicationForm, contextLabel);
            openModal(applicationModal);
        });
    });

    document.querySelectorAll('[data-modal-close]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            closeModal(document.getElementById(trigger.dataset.modalClose));
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeModal(enrollmentModal);
            closeModal(applicationModal);
        }
    });

    [enrollmentForm, applicationForm].forEach(form => form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            const wrapper = field.closest('[data-field]');
            wrapper?.classList.remove('form-error');
            const error = wrapper?.querySelector('[data-error-for]');
            if (error) {
                error.textContent = '';
            }
        });
    }));

    enrollmentForm.addEventListener('submit', async event => {
        event.preventDefault();
        const payload = getEnrollmentPayload(enrollmentForm);
        if (!validateEnrollmentPayload(enrollmentForm, payload)) {
            return;
        }

        const submitButton = enrollmentForm.querySelector('button[type="submit"]');
        setAsyncButtonState(submitButton, 'Submitting...');

        try {
            await postJson('/enroll', {
                Full_Name: payload.fullName,
                Email: payload.email,
                Phone_Number: payload.phone,
                Category: payload.category,
                Course: payload.course,
                Qualification: payload.qualification,
                Interested_course: payload.course,
                collegeorlearning_institute: payload.category,
                prefrred_mode_of_learning: payload.learningMode,
                goal: payload.message,
                Source_Page: 'general_enroll_modal',
                Context: getCurrentContextTitle()
            });

            saveEnrollmentRecord({
                ...payload,
                source: 'general_enroll_modal',
                context: getCurrentContextTitle()
            });
            setAsyncButtonSuccess(submitButton, 'Submitted');
            closeModal(enrollmentModal);
            enrollmentForm.reset();
            clearEnrollmentErrors(enrollmentForm);
            showToast('Thank you! Our counsellor will contact you shortly.');
        } catch (error) {
            showToast(error.message || 'Enrollment submission failed.');
            restoreAsyncButtonState(submitButton);
            return;
        }

        window.setTimeout(() => {
            restoreAsyncButtonState(submitButton);
        }, 800);
    });

    applicationForm.addEventListener('submit', async event => {
        event.preventDefault();
        const payload = getApplicationPayload(applicationForm);
        if (!validateApplicationPayload(applicationForm, payload)) {
            return;
        }

        const submitButton = applicationForm.querySelector('button[type="submit"]');
        setAsyncButtonState(submitButton, 'Submitting...');

        try {
            await postJson('/apply', {
                Full_Name: payload.fullName,
                Email: payload.email,
                Phone_Number: payload.phone,
                applying_for: payload.program,
                Qualification: payload.qualification,
                Experience_level: payload.experience,
                prefrred_mode_of_learning: payload.learningMode,
                goal: payload.motivation,
                Source_Page: 'general_application_modal',
                Context: getCurrentContextTitle()
            });

            saveApplicationRecord({
                ...payload,
                source: 'general_application_modal',
                context: getCurrentContextTitle()
            });
            setAsyncButtonSuccess(submitButton, 'Submitted');
            closeModal(applicationModal);
            applicationForm.reset();
            clearEnrollmentErrors(applicationForm);
            showToast('Application submitted successfully. Our team will contact you shortly.');
        } catch (error) {
            showToast(error.message || 'Application submission failed.');
            restoreAsyncButtonState(submitButton);
            return;
        }

        window.setTimeout(() => {
            restoreAsyncButtonState(submitButton);
        }, 800);
    });
}

function polishPageHeaders() {
    const header = document.querySelector('header');
    if (!header || isAuthPage()) {
        return;
    }

    if (!header.classList.contains('site-navbar')) {
        header.classList.add('site-navbar');
        header.style.height = '';
    }

    const navLinks = header.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const text = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
        if (text === 'contact') {
            link.remove();
            return;
        }

        if (!link.classList.contains('nav-link') && link.closest('nav')) {
            link.classList.add('nav-link');
        }
    });

    const rightContainer = Array.from(header.children).filter(node => node.tagName === 'DIV').pop();
    if (rightContainer) {
        rightContainer.style.gap = '10px';

        rightContainer.querySelectorAll('a, button').forEach(node => {
            const label = node.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
            const wrappedAnchor = node.tagName === 'A' ? node : node.closest('a');
            const shouldRemove =
                label === 'contact' ||
                label === 'contact us' ||
                label === 'enroll now' ||
                label === 'enroll for courses' ||
                label === 'enroll';
            if (shouldRemove && wrappedAnchor && wrappedAnchor.parentElement === rightContainer) {
                wrappedAnchor.remove();
            } else if (shouldRemove && node.parentElement === rightContainer) {
                node.remove();
            }
        });

        if (!rightContainer.querySelector('.navbar-contact-link')) {
            const contactLink = document.createElement('a');
            contactLink.href = routeTo(GENZTECH_ROUTES.contact);
            contactLink.className = 'navbar-contact-link hidden xl:inline-flex shrink-0 whitespace-nowrap';
            contactLink.innerHTML = '<span class="material-symbols-outlined text-[18px]">support_agent</span>Contact Us';
            rightContainer.insertBefore(contactLink, rightContainer.firstChild);
        }

        if (!rightContainer.querySelector('[data-enroll-trigger]')) {
            const enrollButton = document.createElement('button');
            enrollButton.type = 'button';
            enrollButton.className = 'enroll-cta shrink-0 whitespace-nowrap text-[14px] xl:text-[15px]';
            enrollButton.setAttribute('data-enroll-trigger', 'header');
            enrollButton.innerHTML = 'Enroll for Courses <span class="material-symbols-outlined text-[18px]">arrow_forward</span>';
            rightContainer.appendChild(enrollButton);
        }
    }

    header.querySelectorAll('button').forEach(button => {
        const label = button.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
        if (label.includes('enroll now') || label.includes('enroll for courses') || label === 'enroll') {
            button.classList.add('enroll-cta');
            if (button.closest('header')) {
                button.innerHTML = `Enroll for Courses <span class="material-symbols-outlined text-[18px]">arrow_forward</span>`;
                button.type = 'button';
                button.setAttribute('data-enroll-trigger', 'header');
            }
        }
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        const text = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
        if (text === 'contact') {
            link.textContent = 'Contact Us';
        }
    });
}

function wireLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm || getCurrentPageName() !== GENZTECH_ROUTES.login) {
        return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    loginForm.addEventListener('submit', async event => {
        event.preventDefault();

        const email = loginForm.querySelector('#email')?.value.trim() || '';
        const password = loginForm.querySelector('#password')?.value || '';

        if (!email || !password) {
            showFormMessage(loginForm, 'Please enter your email and password.', 'error');
            return;
        }

        showFormMessage(loginForm, 'Checking your account details...', 'info');
        setSubmittingState(submitBtn, 'Authenticating...');

        try {
            const response = await postJson('/login', {
                Email: email,
                Password: password
            });

            const localUser = findLocalUserByEmail(email);
            const authenticatedUser = {
                ...normalizeUser(response.user || {}),
                course: localUser?.course || ''
            };

            saveLocalUser({
                fullName: authenticatedUser.fullName || email.split('@')[0],
                email: authenticatedUser.email || email,
                phone: authenticatedUser.phone || '',
                course: authenticatedUser.course || '',
                password
            });

            setAuthSession(authenticatedUser);
            showFormMessage(loginForm, 'Login successful. Redirecting to your homepage...', 'success');
            setSuccessState(submitBtn, 'Success');

            window.setTimeout(() => {
                window.location.replace(routeTo(GENZTECH_ROUTES.home));
            }, 700);
        } catch (error) {
            showFormMessage(loginForm, error.message || 'Login failed.', 'error');
            restoreButtonState(submitBtn);
        }
    });
}

function wireSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm || getCurrentPageName() !== GENZTECH_ROUTES.signup) {
        return;
    }

    const submitBtn = signupForm.querySelector('button[type="submit"]');
    signupForm.addEventListener('submit', async event => {
        event.preventDefault();

        const formData = {
            fullName: signupForm.querySelector('#fullname')?.value.trim() || '',
            email: signupForm.querySelector('#email')?.value.trim() || '',
            phone: signupForm.querySelector('#phone')?.value.trim() || '',
            course: signupForm.querySelector('#course')?.value || '',
            password: signupForm.querySelector('#password')?.value || '',
            confirmPassword: signupForm.querySelector('#confirm-password')?.value || ''
        };

        if (formData.password.length < 6) {
            showFormMessage(signupForm, 'Password must be at least 6 characters long.', 'error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showFormMessage(signupForm, 'Password and confirm password must match.', 'error');
            return;
        }

        showFormMessage(signupForm, 'Creating your account...', 'info');
        setSubmittingState(submitBtn, 'Processing...');

        const localUserRecord = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            course: formData.course,
            password: formData.password
        };

        try {
            const response = await postJson('/signup', {
                Full_Name: formData.fullName,
                Email: formData.email,
                Phone_Number: formData.phone,
                Password: formData.password,
                Confirm_Password: formData.confirmPassword
            });

            saveLocalUser(localUserRecord);
            setAuthSession({
                ...normalizeUser(response.user || {}),
                course: formData.course
            });
            showFormMessage(signupForm, 'Account created successfully. Redirecting to your homepage...', 'success');
            setSuccessState(submitBtn, 'Account Created');

            window.setTimeout(() => {
                window.location.replace(routeTo(GENZTECH_ROUTES.home));
            }, 900);
        } catch (error) {
            showFormMessage(signupForm, error.message || 'Signup failed.', 'error');
            restoreButtonState(submitBtn);
        }
    });
}

function wireInquiryForms() {
    document.querySelectorAll('[data-form-kind="enquiry"]').forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async event => {
            event.preventDefault();

            const fullName = form.querySelector('[name="fullName"]')?.value.trim() || '';
            const email = form.querySelector('[name="email"]')?.value.trim() || '';
            const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
            const subject = form.querySelector('[name="subject"]')?.value.trim() || '';
            const message = form.querySelector('[name="message"]')?.value.trim() || '';

            if (!fullName || !email || !subject || !message) {
                showFormMessage(form, 'Please fill in all required enquiry fields.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showFormMessage(form, 'Enter a valid email address.', 'error');
                return;
            }

            setAsyncButtonState(submitBtn, 'Sending...');
            showFormMessage(form, 'Submitting your enquiry...', 'info');

            try {
                await postJson('/query', {
                    Full_Name: fullName,
                    Email: email,
                    Phone_Number: phone,
                    Subject: subject,
                    Course_Interest: subject,
                    message,
                    Source_Page: form.dataset.sourcePage || getCurrentPageName()
                });

                form.reset();
                showFormMessage(form, 'Enquiry submitted successfully.', 'success');
                setAsyncButtonSuccess(submitBtn, 'Sent');
            } catch (error) {
                showFormMessage(form, error.message || 'Failed to submit enquiry.', 'error');
                restoreAsyncButtonState(submitBtn);
                return;
            }

            window.setTimeout(() => {
                restoreAsyncButtonState(submitBtn);
            }, 1200);
        });
    });
}

function wireCounsellingForm() {
    const form = document.getElementById('free-counselling-form');
    if (!form) {
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async event => {
        event.preventDefault();

        const fullName = form.querySelector('[name="fullName"]')?.value.trim() || '';
        const email = form.querySelector('[name="email"]')?.value.trim() || '';
        const domain = form.querySelector('[name="domain"]')?.value || '';

        if (!fullName || !email || !domain) {
            showFormMessage(form, 'Please fill in your name, email, and domain of interest.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showFormMessage(form, 'Enter a valid email address.', 'error');
            return;
        }

        setAsyncButtonState(submitBtn, 'Booking...');
        showFormMessage(form, 'Saving your counselling request...', 'info');

        try {
            await postJson('/book_session', {
                Full_Name: fullName,
                Email: email,
                Domain_of_interest: domain,
                Source_Page: form.dataset.sourcePage || getCurrentPageName()
            });

            form.reset();
            showFormMessage(form, 'Free counselling session booked successfully.', 'success');
            setAsyncButtonSuccess(submitBtn, 'Booked');
        } catch (error) {
            showFormMessage(form, error.message || 'Failed to book counselling session.', 'error');
            restoreAsyncButtonState(submitBtn);
            return;
        }

        window.setTimeout(() => {
            restoreAsyncButtonState(submitBtn);
        }, 1200);
    });
}

function formatAdminDate(value) {
    if (!value) {
        return 'Not available';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

function escapeAdminHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildAdminCard(record, fields) {
    const details = fields.map(field => {
        const value = record[field.key];
        return `
            <div class="rounded-2xl bg-surface-container-low p-4">
              <div class="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">${escapeAdminHtml(field.label)}</div>
              <div class="mt-2 text-sm font-medium text-on-surface">${escapeAdminHtml(value || '—')}</div>
            </div>
        `;
    }).join('');

    return `
        <article class="rounded-3xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
          <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-xl font-bold text-primary">${escapeAdminHtml(record.Full_Name || 'Unnamed submission')}</h3>
              <p class="text-sm text-on-surface-variant">${escapeAdminHtml(record.Email || 'No email provided')}</p>
            </div>
            <div class="flex flex-col gap-2 text-sm text-on-surface-variant md:items-end">
              <span>${escapeAdminHtml(record.Source_Page || record.Context || 'General')}</span>
              <span>${escapeAdminHtml(formatAdminDate(record.created_at))}</span>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            ${details}
          </div>
        </article>
    `;
}

function renderAdminSection(listElement, records, fields, emptyText) {
    if (!listElement) {
        return;
    }

    if (!records.length) {
        listElement.innerHTML = `
            <div class="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center text-on-surface-variant">
              ${escapeAdminHtml(emptyText)}
            </div>
        `;
        return;
    }

    listElement.innerHTML = records.map(record => buildAdminCard(record, fields)).join('');
}

function wireAdminTabs() {
    const buttons = [...document.querySelectorAll('[data-admin-tab]')];
    const panels = [...document.querySelectorAll('[data-admin-panel]')];
    const title = document.querySelector('[data-admin-title]');

    if (!buttons.length || !panels.length) {
        return;
    }

    const labels = {
        enquiries: 'Enquiry Forms',
        enrollments: 'Enrollment Forms',
        applications: 'Application Forms',
        counselling: 'Free Counselling'
    };

    const activateTab = key => {
        buttons.forEach(button => {
            const isActive = button.dataset.adminTab === key;
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('border', !isActive);
            button.classList.toggle('border-outline-variant', !isActive);
            button.classList.toggle('bg-surface-container-lowest', !isActive);
            button.classList.toggle('text-primary', !isActive);
        });

        panels.forEach(panel => {
            panel.classList.toggle('admin-panel-hidden', panel.dataset.adminPanel !== key);
        });

        if (title) {
            title.textContent = labels[key] || 'Admin Records';
        }
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => activateTab(button.dataset.adminTab));
    });

    activateTab(buttons[0].dataset.adminTab);
}

async function loadAdminDashboard() {
    const wrapper = document.querySelector('[data-admin-dashboard]');
    if (!wrapper) {
        return;
    }

    const status = document.querySelector('[data-admin-status]');
    if (status) {
        status.textContent = 'Loading submissions...';
        status.classList.remove('hidden');
    }

    try {
        const data = await fetchJson('/admin/dashboard');

        Object.entries(data.summary || {}).forEach(([key, value]) => {
            const target = document.querySelector(`[data-summary-count="${key}"]`);
            if (target) {
                target.textContent = String(value);
            }
        });

        renderAdminSection(
            document.querySelector('[data-admin-list="enquiries"]'),
            data.enquiries || [],
            [
                { key: 'Phone_Number', label: 'Phone' },
                { key: 'Subject', label: 'Subject' },
                { key: 'Course_Interest', label: 'Interest' },
                { key: 'message', label: 'Message' }
            ],
            'No enquiry submissions yet.'
        );

        renderAdminSection(
            document.querySelector('[data-admin-list="enrollments"]'),
            data.enrollments || [],
            [
                { key: 'Phone_Number', label: 'Phone' },
                { key: 'Category', label: 'Profile' },
                { key: 'Course', label: 'Course' },
                { key: 'Qualification', label: 'Qualification' },
                { key: 'prefrred_mode_of_learning', label: 'Learning Mode' },
                { key: 'goal', label: 'Goal' }
            ],
            'No enrollment submissions yet.'
        );

        renderAdminSection(
            document.querySelector('[data-admin-list="applications"]'),
            data.applications || [],
            [
                { key: 'Phone_Number', label: 'Phone' },
                { key: 'applying_for', label: 'Applying For' },
                { key: 'Qualification', label: 'Qualification' },
                { key: 'Experience_level', label: 'Experience' },
                { key: 'prefrred_mode_of_learning', label: 'Learning Mode' },
                { key: 'goal', label: 'Goal' }
            ],
            'No application submissions yet.'
        );

        renderAdminSection(
            document.querySelector('[data-admin-list="counselling"]'),
            data.counselling || [],
            [
                { key: 'Phone_Number', label: 'Phone' },
                { key: 'Domain_of_interest', label: 'Domain of Interest' }
            ],
            'No counselling submissions yet.'
        );

        if (status) {
            status.textContent = `Last synced: ${formatAdminDate(new Date().toISOString())}`;
        }
    } catch (error) {
        if (/token|admin|401|expired|missing/i.test(error.message || '')) {
            adminLogout();
            injectAdminLoginOverlay();
            return;
        }
        if (status) {
            status.textContent = error.message || 'Unable to load admin dashboard.';
        }
    }
}

function injectAdminLoginOverlay() {
    if (document.getElementById('admin-login-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'admin-login-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(22,44,67,0.92);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:32px;max-width:420px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.2);">
        <h2 style="font-size:24px;font-weight:800;color:#162c43;margin:0 0 8px;">Admin Login</h2>
        <p style="color:#43474d;margin:0 0 20px;font-size:14px;">Enter the owner credentials configured on the backend.</p>
        <form id="admin-login-form" style="display:flex;flex-direction:column;gap:12px;">
          <input id="admin-login-email" type="email" placeholder="Admin email" required style="padding:12px 14px;border:1px solid #c4c6cd;border-radius:8px;font-size:15px;" />
          <input id="admin-login-password" type="password" placeholder="Admin password" required style="padding:12px 14px;border:1px solid #c4c6cd;border-radius:8px;font-size:15px;" />
          <div id="admin-login-error" style="color:#ba1a1a;font-size:13px;min-height:18px;"></div>
          <button type="submit" style="background:#162c43;color:#fff;border:none;padding:12px;border-radius:9999px;font-weight:700;cursor:pointer;font-size:15px;">Log In</button>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#admin-login-form').addEventListener('submit', async event => {
        event.preventDefault();
        const errBox = overlay.querySelector('#admin-login-error');
        errBox.textContent = '';
        const email = overlay.querySelector('#admin-login-email').value.trim();
        const password = overlay.querySelector('#admin-login-password').value;
        try {
            await adminLogin(email, password);
            overlay.remove();
            loadAdminDashboard();
        } catch (err) {
            errBox.textContent = err.message || 'Login failed.';
        }
    });
}

function wireAdminPanel() {
    const wrapper = document.querySelector('[data-admin-dashboard]');
    if (!wrapper) {
        return;
    }

    wireAdminTabs();

    if (!localStorage.getItem(GENZTECH_ADMIN_TOKEN_KEY)) {
        injectAdminLoginOverlay();
    } else {
        loadAdminDashboard();
    }

    document.querySelector('[data-admin-refresh]')?.addEventListener('click', () => {
        loadAdminDashboard();
    });

    document.querySelector('[data-admin-logout]')?.addEventListener('click', () => {
        adminLogout();
        injectAdminLoginOverlay();
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    protectCurrentPage();
    normalizeSiteLinks();
    wireTransactionalButtons();
    wireHeroImages();
    polishPageHeaders();
    wireLoginForm();
    wireSignupForm();
    wireInquiryForms();
    wireCounsellingForm();
    wireAdminPanel();
    renderAccountControl();
    wireEnrollmentModal();

    document.querySelectorAll('.mobile-acc-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.nextElementSibling;
            if (target) {
                target.classList.toggle('hidden');
            }
            const icon = btn.querySelector('.acc-icon');
            if (icon) {
                icon.style.transform = target.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('.card-hover').forEach(card => {
        const icon = card.querySelector('.card-icon');
        card.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

});
