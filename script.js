// Initialize Lenis for smooth scrolling
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// Initialize Lucide Icons will be handled inside DOMContentLoaded

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

// Theme & RTL Global Controller
(function() {
  function applyPreferences() {
    const theme = localStorage.getItem('theme') || 'dark';
    const dir = localStorage.getItem('dir') || 'ltr';
    
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', dir);
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('dir', dir);

    // Update Icons
    document.querySelectorAll('#theme-toggle i').forEach(icon => {
      if (icon.classList.contains('fa-solid')) {
        icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      } else {
        icon.setAttribute('data-lucide', theme === 'light' ? 'moon' : 'sun');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  }

  // Highlight Active Link
  function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Initial Apply
  applyPreferences();
  highlightActiveLink();
  window.addEventListener('DOMContentLoaded', () => {
    applyPreferences();
    highlightActiveLink();
  });

  // Delegated Click Handler
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('#theme-toggle');
    const rtlBtn = e.target.closest('#rtl-toggle');

    if (themeBtn) {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyPreferences();
    }

    if (rtlBtn) {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      localStorage.setItem('dir', newDir);
      applyPreferences();
    }
  });
})();

// GSAP Animations
document.addEventListener("DOMContentLoaded", (event) => {
  lucide.createIcons();
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
    gsap.fromTo(bg, 
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: bg.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  });

  // Signature Pad Logic
  const canvas = document.getElementById('signature-pad');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const startDrawing = (e) => {
      drawing = true;
      draw(e);
    };

    const stopDrawing = () => {
      drawing = false;
      ctx.beginPath();
    };

    const draw = (e) => {
      if (!drawing) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      // Prevent scrolling while drawing on touch devices
      if (e.touches) e.preventDefault();
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    const clearBtn = document.getElementById('clear-signature');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }
  }

  // Password Toggle Logic
  const passwordToggles = document.querySelectorAll('.toggle-password');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-target') || 'password-input';
      const input = document.getElementById(targetId);
      
      if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Toggle icon
        toggle.classList.toggle('fa-eye');
        toggle.classList.toggle('fa-eye-slash');
      }
    });
  });

  // Support for specific single ID (backward compatibility for login page)
  const singleToggle = document.getElementById('toggle-password');
  const singleInput = document.getElementById('password-input');
  if (singleToggle && singleInput && !singleToggle.classList.contains('toggle-password')) {
    singleToggle.addEventListener('click', () => {
      const type = singleInput.getAttribute('type') === 'password' ? 'text' : 'password';
      singleInput.setAttribute('type', type);
      singleToggle.classList.toggle('fa-eye');
      singleToggle.classList.toggle('fa-eye-slash');
    });
  }

  // Mobile Menu Toggle Logic
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuWrapper = document.querySelector('.nav-menu-wrapper');
  
  if (menuToggle && menuWrapper) {
    menuToggle.addEventListener('click', () => {
      menuWrapper.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
      } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });

    // Close menu when clicking a link
    const navLinks = menuWrapper.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuWrapper.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.replace('fa-xmark', 'fa-bars');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuWrapper.contains(e.target) && !menuToggle.contains(e.target) && menuWrapper.classList.contains('active')) {
        menuWrapper.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });
  }
});

// Back to Top Logic
(function() {
  const backToTopBtn = document.createElement('div');
  backToTopBtn.id = 'back-to-top';
  backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  document.body.appendChild(backToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    if (typeof lenis !== 'undefined') {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();
