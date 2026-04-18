// ========== Navbar Scroll Effect ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ========== Mobile Menu ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ========== Floating Particles ==========
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}
createParticles();

// ========== Counter Animation ==========
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    });
}

// ========== Scroll Reveal ==========
const revealElements = document.querySelectorAll(
    '.service-card, .gallery-item, .testimonial-card, .about-grid, .contact-grid, .cta-content, .section-header'
);
revealElements.forEach(el => el.classList.add('reveal'));

let countersAnimated = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger counter animation when stats bar is visible
            if (entry.target.closest('.stats-bar') && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

// Also observe the stats bar
const statsBar = document.querySelector('.stats-bar');
if (statsBar) observer.observe(statsBar);

// ========== Smooth Active Nav Link ==========
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.style.color = (scrollY >= top && scrollY < top + height)
                ? 'var(--text-primary)' : '';
        }
    });
});

// ========== Form Submission ==========
const form = document.getElementById('bookingForm');
// Thay thế URL này bằng Webhook của bạn (n8n, Make, Telegram, etc.)
const WEBHOOK_URL = ''; 

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString()
    };

    btn.disabled = true;
    btn.textContent = 'Đang gửi...';

    try {
        if (WEBHOOK_URL) {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }
        
        // Success feedback
        btn.textContent = '✓ Đã gửi thành công!';
        btn.style.background = 'linear-gradient(135deg, #2e7d32, #4caf50)';
        form.reset();

    } catch (error) {
        console.error('Lỗi gửi form:', error);
        btn.textContent = '❌ Lỗi! Thử lại sau';
        btn.style.background = 'linear-gradient(135deg, #c62828, #f44336)';
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    }
});

// ========== Set minimum date for date picker ==========
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}
