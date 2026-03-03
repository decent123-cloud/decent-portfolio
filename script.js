// ==================== EMAILJS INITIALIZATION ====================
// Only initialize if EmailJS library is loaded
if (typeof emailjs !== 'undefined') {
    emailjs.init('YOUR_PUBLIC_KEY');
} else {
    console.warn('EmailJS library not loaded. Contact form may not work.');
}

// ==================== AOS INITIALIZATION ====================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    offset: 100,
});

// ==================== MOBILE MENU TOGGLE ====================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ==================== CONTACT FORM HANDLING ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form elements
        const submitBtn = document.getElementById('submitBtn');
        const formStatus = document.getElementById('formStatus');
        const originalBtnText = submitBtn.textContent;

        // Clear previous messages
        formStatus.textContent = '';
        formStatus.className = '';

        // Validate form
        const isValid = validateForm();
        if (!isValid) return;

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Prepare template parameters
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                phone: document.getElementById('phone').value || 'Not provided',
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                to_email: 'emmanuelabershi483@gmail.com'
            };

            // Send email using EmailJS
            const response = await emailjs.send(
                'service_YOUR_SERVICE_ID',  // Replace with your EmailJS service ID
                'template_YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                templateParams
            );

            // Success message
            formStatus.className = 'form-status success';
            formStatus.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
            contactForm.reset();

            // Log the response
            console.log('Email sent successfully:', response);

        } catch (error) {
            // Error message
            console.error('Error sending email:', error);
            formStatus.className = 'form-status error';
            formStatus.textContent = '❌ Failed to send message. Please try again or email me directly.';
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;

            // Scroll to status message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// ==================== FORM VALIDATION ====================
function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.classList.remove('show');
    });

    // Validate name
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'nameError', 'Please enter your name');
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
        showError(emailInput, 'emailError', 'Please enter your email');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate subject
    if (subjectInput.value.trim() === '') {
        showError(subjectInput, 'subjectError', 'Please enter a subject');
        isValid = false;
    }

    // Validate message
    if (messageInput.value.trim() === '') {
        showError(messageInput, 'messageError', 'Please enter your message');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'messageError', 'Message must be at least 10 characters');
        isValid = false;
    }

    return isValid;
}

function showError(inputElement, errorId, message) {
    inputElement.parentElement.classList.add('error');
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.project-card, .skill-category, .stat').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ==================== ACTIVE NAVIGATION HIGHLIGHTING ====================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.style.color = 'var(--text-dark)';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-color)';
        }
    });
});

// ==================== SCROLL TO TOP BUTTON ====================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-to-top';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 99;
    box-shadow: 0 5px 20px rgba(99, 102, 241, 0.4);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
});

// ==================== PRELOAD IMAGES ====================
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const imageLoader = new Image();
        imageLoader.src = img.src;
    });
}

window.addEventListener('load', preloadImages);

// ==================== LAZY LOADING ====================
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.loading = 'lazy';
    });
}

console.log('Portfolio loaded successfully! ✨');