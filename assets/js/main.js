document.addEventListener('DOMContentLoaded', function () {
    // Load shared header
    loadHeader();
    
    // Load shared footer
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
                
                // Update aria-expanded and remove focus highlight when closing
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
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--coral-accent)';
                    input.style.animation = 'shake 0.5s ease-in-out';
                } else {
                    input.style.borderColor = 'var(--ocean-teal)';
                    input.style.animation = '';
                }
            });

            if (isValid) {
                showMessage('Thank you! Your message has been received.', 'success');
                form.reset();
            } else {
                showMessage('Please fill in all required fields.', 'error');
            }
        });
    });

    // Donation amount selection
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.querySelector('input[name="customAmount"]');
    
    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            amountButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            if (customAmountInput) {
                customAmountInput.value = this.dataset.amount;
            }
        });
    });
    
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            amountButtons.forEach(b => b.classList.remove('selected'));
        });
    }

    // Message display function
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
            ${type === 'success' ? 'background: var(--success-green);' : 'background: var(--coral-accent);'}
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @media (max-width: 768px) {
            .main-nav {
                display: none;
            }
            
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