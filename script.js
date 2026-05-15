// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Initialize Lucide Icons
lucide.createIcons();

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
if(navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
if(themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    
    // Toggle icon
    const icon = themeToggle.querySelector('i');
    if (newTheme === 'light') {
      icon.setAttribute('data-lucide', 'moon');
    } else {
      icon.setAttribute('data-lucide', 'sun');
    }
    lucide.createIcons();
  });
}

// RTL Toggle
const rtlToggle = document.getElementById('rtl-toggle');
if(rtlToggle) {
  rtlToggle.addEventListener('click', () => {
    const currentDir = document.documentElement.getAttribute('dir');
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
  });
}

// GSAP Animations
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  // Fade up elements
  const fadeUpElements = document.querySelectorAll('.fade-up');
  fadeUpElements.forEach((el) => {
    gsap.fromTo(el, 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        }
      }
    );
  });
  
  // Parallax background
  const parallaxBgs = document.querySelectorAll('.parallax-bg');
  parallaxBgs.forEach((bg) => {
    gsap.to(bg, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: bg.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
});
