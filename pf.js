// Improved skill detail toggle with smooth animation

// Setup smooth slide for detail sections
function setupDetailToggles() {
    document.querySelectorAll('.card-body .card-body-js').forEach(p => {
        // ensure baseline styles for animation
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

// Initialize contact form UX after DOM is ready
if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupContactFormUX);
} else {
    setupContactFormUX();
}
    });

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
                // set to 0 first to enable transition from 0 -> scrollHeight
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

// init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDetailToggles);
} else {
    setupDetailToggles();
}

// cleaned stray/broken code above

function revealSkillCards() {
    document.querySelectorAll('.skill-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            card.classList.add('visible');
        }
    });
}
// Toggle navbar glass effect on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Use IntersectionObserver for better performance
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));

window.addEventListener('load', revealSkillCards);
