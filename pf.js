// Improved skill detail toggle with smooth animation

// Setup smooth slide for detail sections (and button toggles)
function setupDetailToggles() {
    // baseline for hidden detail paragraphs
    document.querySelectorAll('.card-body .card-body-js').forEach(p => {
        p.style.overflow = 'hidden';
        if (!p.classList.contains('open')) {
            p.style.maxHeight = '0px';
            p.style.opacity = '0';
            p.style.display = 'none';
        } else {
            p.style.display = 'block';
            p.style.maxHeight = p.scrollHeight + 'px';
            p.style.opacity = '1';
        }
    });

    // toggle buttons
    document.querySelectorAll('.skill-card .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const container = btn.closest('.card-body');
            const detail = container ? container.querySelector('.card-body-js') : null;
            if (!detail) return;

            const isOpen = detail.classList.contains('open');

            if (!isOpen) {
                detail.classList.add('open');
                detail.style.display = 'block';
                // enable transition from 0 -> scrollHeight
                detail.style.maxHeight = '0px';
                detail.style.opacity = '0';
                requestAnimationFrame(() => {
                    detail.style.maxHeight = detail.scrollHeight + 'px';
                    detail.style.opacity = '1';
                });
            } else {
                // collapse: set current height then transition to 0
                detail.style.maxHeight = detail.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    detail.style.maxHeight = '0px';
                    detail.style.opacity = '0';
                });
                detail.addEventListener('transitionend', function onEnd(ev) {
                    if (ev.propertyName === 'max-height') {
                        detail.style.display = 'none';
                        detail.classList.remove('open');
                        detail.removeEventListener('transitionend', onEnd);
                    }
                });
            }

            btn.textContent = !isOpen ? 'Hide' : 'Details';
        });
    });
}

// Contact form UX: disable button and show "Sending..." on submit
function setupContactFormUX(){
    const form = document.querySelector('#contact-sec .contact-form');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    const alertBox = document.getElementById('contact-alert');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // basic validity check since form has novalidate
        const requiredInputs = form.querySelectorAll('[required]');
        let hasError = false;
        requiredInputs.forEach(el => {
            const invalid = !el.value || (el.type === 'email' && !el.checkValidity());
            el.classList.toggle('is-invalid', invalid);
            if (invalid) hasError = true;
        });
        if (hasError) return;

        if (alertBox){
            alertBox.className = 'mt-3 alert d-none';
            alertBox.textContent = '';
        }

        if (submitBtn){
            const sendingText = submitBtn.getAttribute('data-sending-text') || 'Sending...';
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.textContent;
            submitBtn.textContent = sendingText;
        }

        // Build AJAX endpoint for FormSubmit
        const actionUrl = form.getAttribute('action') || '';
        const ajaxUrl = actionUrl.replace('formsubmit.co/', 'formsubmit.co/ajax/');
        const formData = new FormData(form);

        fetch(ajaxUrl, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        }).then(async (res) => {
            const ok = res.ok;
            let data = null;
            try { data = await res.json(); } catch {}

            if (ok){
                // success UI
                if (alertBox){
                    alertBox.className = 'mt-3 alert alert-success';
                    alertBox.textContent = 'Thanks! Your message has been sent.';
                }
                form.reset();
                // clear invalid states
                requiredInputs.forEach(el => el.classList.remove('is-invalid'));
            } else {
                // error UI
                const msg = (data && (data.message || data.error)) || 'Something went wrong. Please try again.';
                if (alertBox){
                    alertBox.className = 'mt-3 alert alert-danger';
                    alertBox.textContent = msg;
                }
            }
        }).catch(() => {
            if (alertBox){
                alertBox.className = 'mt-3 alert alert-danger';
                alertBox.textContent = 'Network error. Please check your connection and try again.';
            }
        }).finally(() => {
            if (submitBtn){
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.dataset.originalText || 'Send';
            }
        });
    });
}

// Navbar glass effect on scroll
function setupNavbarScroll(){
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Anime.js page-load animations
function animeInit(){
    if (typeof window.anime === 'undefined') return; // graceful fallback

    // navbar + title stagger
    anime.timeline({ easing: 'easeOutQuad' })
      .add({
        targets: '#navbar',
        translateY: [-40, 0],
        opacity: [0, 1],
        duration: 700
      })
      .add({
        targets: '.title',
        translateY: [24, 0],
        opacity: [0, 1],
        duration: 800
      }, '-=250')
      .add({
        targets: '#navbar .nav-link',
        translateY: [8, 0],
        opacity: [0, 1],
        duration: 500,
        delay: anime.stagger(70)
      }, '-=400');
}

// IntersectionObserver + anime.js reveal
function setupRevealAnimations(){
    const useAnime = typeof window.anime !== 'undefined';

    const playCardAnimation = (el) => {
        if (!useAnime) {
            // Fallback: ensure element becomes visible even without anime.js
            el.classList.add('visible');
            el.style.opacity = '1';
            el.style.transform = 'none';
            return;
        }
        anime({
            targets: el,
            translateY: [28, 0],
            opacity: [0, 1],
            scale: [0.96, 1],
            easing: 'easeOutCubic',
            duration: 750
        });
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playCardAnimation(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('.skill-card, .projects-card, .contact-card').forEach(el => {
        // set initial state to ensure visible effect
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        observer.observe(el);
    });
}

// init on DOM ready
function init(){
    setupDetailToggles();
    setupContactFormUX();
    setupNavbarScroll();
    // Pre-state for load animations to be noticeable
    const titleEl = document.querySelector('.title');
    if (titleEl) { titleEl.style.opacity = '0'; }
    document.querySelectorAll('#navbar .nav-link').forEach(a => a.style.opacity = '0');

    animeInit();
    setupRevealAnimations();
}

if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// cleaned stray/broken code above
