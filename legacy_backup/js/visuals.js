// Visuals for Presentation Slide Deck

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fade-In Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed 
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // 2. Slide Counter Update
    const main = document.querySelector('main');
    const sections = document.querySelectorAll('section');
    const indicator = document.querySelector('.slide-count');

    // Simple scroll detection to update slide number
    if (main && indicator) {
        main.addEventListener('scroll', () => {
            let currentSlide = 1;
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top >= -window.innerHeight / 2 && rect.top < window.innerHeight / 2) {
                    currentSlide = index + 1;
                }
            });
            indicator.textContent = `0${currentSlide} / 0${sections.length}`;
        });
    }
});
