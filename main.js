/* ============================================================
   PORTFOLIO - Md. Mahfuzur Rahman Hridoy
   main.js — All Interactive Features
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1. LOADER
───────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Trigger initial reveal animations after loader hides
    revealOnScroll();
  }, 1800);
});


/* ─────────────────────────────────────────
   2. PARTICLES CANVAS
───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };
  const COUNT = window.innerWidth < 768 ? 40 : 80;
  const COLORS = ['rgba(99,179,237,', 'rgba(118,228,247,', 'rgba(159,122,234,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: rand(0, W), y: rand(0, H),
      r: rand(0.5, 2.2),
      vx: rand(-0.3, 0.3), vy: rand(-0.4, -0.1),
      alpha: rand(0.15, 0.6),
      color
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function drawLine(a, b, dist) {
    const alpha = (1 - dist / 130) * 0.12;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(99,179,237,${alpha})`;
    ctx.lineWidth = 0.6;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) drawLine(particles[i], particles[j], dist);
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx += dx * 0.0008;
          p.vy += dy * 0.0008;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      // Speed cap
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) { p.vx *= 0.97; p.vy *= 0.97; }

      // Wrap around
      if (p.y < -10) { p.y = H + 10; p.x = rand(0, W); }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  init();
  animate();
})();


/* ─────────────────────────────────────────
   3. TYPING ANIMATION
───────────────────────────────────────── */
(function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;

  const phrases = [
    'CSE Student',
    'Web Developer',
    'SQA Enthusiast'
  ];

  let phraseIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 95);
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 55);
    }
  }

  // Small delay before starting
  setTimeout(type, 1200);
})();


/* ─────────────────────────────────────────
   4. NAVBAR — scroll behaviour + active link
───────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  // Scroll styling
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  // Mobile hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();


/* ─────────────────────────────────────────
   5. SCROLL REVEAL
───────────────────────────────────────── */
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const siblings = [...entry.target.parentElement.children];
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// Also run on DOM ready (in case loader has already gone)
document.addEventListener('DOMContentLoaded', revealOnScroll);


/* ─────────────────────────────────────────
   6. PROJECT FILTER TABS
───────────────────────────────────────── */
(function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (match) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (card.style.opacity === '0') card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
})();


/* ─────────────────────────────────────────
   7. SCROLL TO TOP
───────────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─────────────────────────────────────────
   8. CONTACT FORM
───────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const successMsg = form.querySelector('.form-success');

    // Animate button
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate sending (replace with real fetch/EmailJS/etc.)
    setTimeout(() => {
      btn.style.display = 'none';
      successMsg.style.display = 'block';
      successMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
      form.reset();

      // Reset after 4s
      setTimeout(() => {
        btn.style.display = '';
        btn.textContent = 'Send Message';
        btn.disabled = false;
        successMsg.style.display = 'none';
      }, 4000);
    }, 1600);
  });
})();


/* ─────────────────────────────────────────
   9. SMOOTH ANCHOR SCROLLING (with offset)
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────
   10. SKILL TAG hover micro-animation
───────────────────────────────────────── */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
  });
  tag.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});
