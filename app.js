document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger icon animation
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // --- 2. Emotional Hook Section Accordion ---
    const hookCards = document.querySelectorAll('.hook-question-card');
    
    hookCards.forEach(card => {
        card.addEventListener('click', () => {
            const isCurrentlyActive = card.classList.contains('active');
            
            // Close all first
            hookCards.forEach(c => {
                c.classList.remove('active');
                const icon = c.querySelector('.hook-question-icon');
                if (icon) icon.textContent = '+';
            });
            
            // Toggle clicked card
            if (!isCurrentlyActive) {
                card.classList.add('active');
                const icon = card.querySelector('.hook-question-icon');
                if (icon) icon.textContent = '×';
            }
        });
    });


    // --- 4. Scroll Reveal & Stats Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const statBars = document.querySelectorAll('.stat-bar-inner');
    let statsAnimated = false;

    // Helper function to animate stat numbers
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + "%";
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function triggerStatsAnimation() {
        if (statsAnimated) return;
        statsAnimated = true;
        
        statBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            // Animate bar width
            bar.style.width = percentage + '%';
            
            // Find corresponding label text count
            const valId = bar.id.replace('bar-', 'val-');
            const labelObj = document.getElementById(valId);
            if (labelObj) {
                animateValue(labelObj, 0, parseInt(percentage), 1500);
            }
        });
    }

    const observerOptions = {
        threshold: 0.02,
        rootMargin: '0px 0px 80px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If this is the why-ei section or contains stats-visual, trigger stats counters
                if (entry.target.id === 'why-ei' || entry.target.querySelector('.stats-visual')) {
                    triggerStatsAnimation();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Also observe the stats visual directly in case it triggers alone
    const statsVisual = document.querySelector('.stats-visual');
    if (statsVisual) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                triggerStatsAnimation();
            }
        }, { threshold: 0.2 });
        statsObserver.observe(statsVisual);
    }

    // --- 5. Emolit Mockup App Screen Selector ---
    const featureBtns = document.querySelectorAll('.feature-select-btn');
    const appScreens = document.querySelectorAll('.app-screen-content');

    featureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active status
            featureBtns.forEach(b => b.classList.remove('active'));
            appScreens.forEach(s => s.classList.remove('active'));
            
            // Make current active
            btn.classList.add('active');
            const screenId = btn.getAttribute('data-screen');
            const targetScreen = document.getElementById(screenId);
            if (targetScreen) {
                targetScreen.classList.add('active');
            }
        });
    });



    // --- 7. Modals: Partner, Community & Legal Dialogs ---
    const modalPartner = document.getElementById('modal-partner');
    const modalCommunity = document.getElementById('modal-community');
    const modalLegal = document.getElementById('modal-legal');
    
    const triggerPartner = document.getElementById('btn-partner-trigger');
    const triggerCommunity = document.getElementById('btn-community-trigger');
    const triggerJoinBtn = document.querySelector('.nav-btn');
    const triggerLegalLinks = document.querySelectorAll('.btn-legal-link');
    
    const closePartner = document.getElementById('partner-close');
    const closeCommunity = document.getElementById('community-close');
    const closeLegal = document.getElementById('legal-close');
    
    // Legal body text examples
    const legalContents = {
        'Privacy Policy': `
            <h4>1. Information Collection</h4>
            <p>We respect your privacy. Sthirabhava Private Limited does not collect, sell, or rent personal mood logs or private reflections generated within the Emolit app or our website. If you sign up for early updates, we collect only your name and email address.</p>
            <br>
            <h4>2. Data Security</h4>
            <p>All data shared via waitlist requests or partner forms is securely stored in encrypted formats. We implement industry-standard administrative, physical, and technical safeguards.</p>
            <br>
            <h4>3. Compliance</h4>
            <p>Our solutions comply with the General Data Protection Regulation (GDPR) and other international data privacy boundaries. You retain complete rights to view, export, or permanently delete your contact data at any time by contacting us.</p>
        `,
        'Terms & Conditions': `
            <h4>1. General Use</h4>
            <p>Welcome to Sthirabhava. By accessing this website or signing up for our updates, you agree to comply with and be bound by these terms. Our ecosystem, products, and articles are built to support emotional learning and self-awareness.</p>
            <br>
            <h4>2. Medical Disclaimer</h4>
            <p>Our tools, including the Emolit companion app and breathing widget, are designed to assist in emotional education and daily reflection. They do not constitute professional therapy, medical diagnostics, or psychiatric crisis management. If you are experiencing severe distress, please consult a qualified mental health professional.</p>
            <br>
            <h4>3. Intellectual Property</h4>
            <p>The code, layouts, custom text, and graphics presented on this website remain the sole intellectual property of Sthirabhava Private Limited. Any replication or public distribution requires written approval.</p>
        `
    };

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Unlock scroll
        
        // Reset success states after animation closes
        setTimeout(() => {
            const success = modal.querySelector('.form-success');
            const formContainer = modal.querySelector('[id$="-form-container"]');
            if (success && formContainer) {
                success.style.display = 'none';
                formContainer.style.display = 'block';
            }
        }, 400);
    }

    // Event listeners
    if (triggerPartner && modalPartner) {
        triggerPartner.addEventListener('click', () => openModal(modalPartner));
    }
    
    if (triggerCommunity && modalCommunity) {
        triggerCommunity.addEventListener('click', () => openModal(modalCommunity));
    }
    
    if (triggerJoinBtn && modalCommunity) {
        triggerJoinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modalCommunity);
        });
    }

    triggerLegalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const textType = link.textContent.trim();
            const legalTitle = document.getElementById('legal-title');
            const legalBody = document.getElementById('legal-body');
            
            if (legalTitle && legalBody && legalContents[textType]) {
                legalTitle.textContent = textType;
                legalBody.innerHTML = legalContents[textType];
                openModal(modalLegal);
            }
        });
    });

    [
        { close: closePartner, modal: modalPartner },
        { close: closeCommunity, modal: modalCommunity },
        { close: closeLegal, modal: modalLegal }
    ].forEach(item => {
        if (item.close && item.modal) {
            item.close.addEventListener('click', () => closeModal(item.modal));
            item.modal.addEventListener('click', (e) => {
                if (e.target === item.modal) closeModal(item.modal);
            });
        }
    });

    // --- 8. Form Submission Handlers ---
    const partnerForm = document.getElementById('form-partner');
    const partnerSuccess = document.getElementById('partner-success');
    const partnerContainer = document.getElementById('partner-form-container');

    if (partnerForm && partnerSuccess && partnerContainer) {
        partnerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate API request delay
            const submitBtn = partnerForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Sending Proposal...";
            submitBtn.disabled = true;
            
            setTimeout(() => {
                partnerContainer.style.display = 'none';
                partnerSuccess.style.display = 'block';
                partnerForm.reset();
                submitBtn.textContent = "Send Collaboration Proposal";
                submitBtn.disabled = false;
            }, 800);
        });
    }

    const communityForm = document.getElementById('form-community');
    const communitySuccess = document.getElementById('community-success');
    const communityContainer = document.getElementById('community-form-container');

    if (communityForm && communitySuccess && communityContainer) {
        communityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate API request delay
            const submitBtn = communityForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Requesting Invitation...";
            submitBtn.disabled = true;
            
            setTimeout(() => {
                communityContainer.style.display = 'none';
                communitySuccess.style.display = 'block';
                communityForm.reset();
                submitBtn.textContent = "Request Invitation";
                submitBtn.disabled = false;
            }, 800);
        });
    }
});
