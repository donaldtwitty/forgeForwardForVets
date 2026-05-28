document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const hashIndex = href.indexOf('#');
            if (hashIndex !== -1) {
                const hash = href.substring(hashIndex + 1);
                const target = document.getElementById(hash);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    loadHeader();
    loadFooter();

    function loadHeader() {
        fetch('assets/includes/header.html')
            .then(response => response.text())
            .then(html => {
                document.body.insertAdjacentHTML('afterbegin', html);
                setActiveNavLink();
                initMobileMenu();
            })
            .catch(error => console.error('Error loading header:', error));
    }

    function loadFooter() {
        fetch('assets/includes/footer.html')
            .then(response => response.text())
            .then(html => {
                const script = document.querySelector('script[src="assets/js/main.js"]');
                script.insertAdjacentHTML('beforebegin', html);
            })
            .catch(error => console.error('Error loading footer:', error));
    }

    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');

        if (mobileToggle && mainNav) {
            mobileToggle.addEventListener('click', function () {
                const isOpen = mainNav.classList.contains('mobile-open');
                mainNav.classList.toggle('mobile-open');
                mobileToggle.setAttribute('aria-expanded', !isOpen);
                if (isOpen) {
                    mobileToggle.blur();
                }
            });
        }
    }

    // Scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function () {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Form handling — submits to Formspree endpoint specified via data-formspree-id
    const forms = document.querySelectorAll('form[data-formspree-id]');
    forms.forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.dataset.originalText = submitBtn.textContent;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--warning-orange)';
                } else {
                    input.style.borderColor = 'var(--primary-blue)';
                }
            });

            if (!isValid) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending…';
            }

            try {
                const response = await fetch(`https://formspree.io/f/${form.dataset.formspreeId}`, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showMessage('Thank you! Your submission has been received.', 'success');
                    form.reset();
                    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
                } else {
                    throw new Error('Submission failed');
                }
            } catch {
                showMessage('Something went wrong. Please try again or contact us directly.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText;
                }
            }
        });
    });

    // Donation amount selection
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.querySelector('input[name="customAmount"]');

    amountButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            amountButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            if (customAmountInput) {
                customAmountInput.value = this.dataset.amount;
            }
        });
    });

    if (customAmountInput) {
        customAmountInput.addEventListener('input', function () {
            amountButtons.forEach(b => b.classList.remove('selected'));
        });
    }

    function showMessage(text, type) {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background: var(--success-green);' : 'background: var(--warning-orange);'}
        `;
        document.body.appendChild(message);
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(100%); opacity: 0; }
        }
        @media (max-width: 768px) {
            .main-nav { display: none; }
            .main-nav.mobile-open {
                display: flex !important;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--dark-navy);
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                z-index: 1000;
            }
            .main-nav.mobile-open .nav-link {
                color: var(--white);
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .main-nav.mobile-open .nav-link:hover,
            .main-nav.mobile-open .nav-link.active {
                color: var(--white);
                background: var(--primary-blue);
            }
            .nav-dropdown .dropdown-menu {
                position: static;
                opacity: 1;
                visibility: visible;
                transform: none;
                background: rgba(0,0,0,0.2);
                box-shadow: none;
                margin-left: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
});
