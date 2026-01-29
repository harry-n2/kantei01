
// Initialize Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.reveal-text', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out'
    })
    .to('.hero-subtitle', {
        opacity: 1,
        duration: 1,
        y: 0,
        ease: 'power2.out'
    }, '-=1');
});

// Magnetic Button Effect
const btn = document.querySelector('.magnetic-btn');
const btnArea = document.querySelector('.magnetic-area');

btnArea.addEventListener('mousemove', (e) => {
    const rect = btnArea.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
    });
});

btnArea.addEventListener('mouseleave', () => {
    gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
    });
});
