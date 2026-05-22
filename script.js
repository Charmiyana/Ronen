/* ============================================
   RONEN'S MAGICAL BIRTHDAY INVITATION
   Interactive JavaScript — Particles, Animations,
   Confetti, Floating Decorations & More
   ============================================ */

(function () {
  'use strict';

  // ============ UTILITY ============
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }
  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  // ============ STARS GENERATION ============
  function generateStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    const count = window.innerWidth < 600 ? 40 : 80;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star' + (Math.random() > 0.85 ? ' large' : '');
      star.style.left = rand(0, 100) + '%';
      star.style.top = rand(0, 100) + '%';
      star.style.animationDuration = rand(1.5, 4) + 's';
      star.style.animationDelay = rand(0, 3) + 's';
      container.appendChild(star);
    }
  }

  // ============ PARTICLE CANVAS ============
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  const PARTICLE_COUNT = window.innerWidth < 600 ? 25 : 50;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      size: rand(1, 3.5),
      speedY: rand(-0.3, -0.08),
      speedX: rand(-0.15, 0.15),
      opacity: rand(0.15, 0.5),
      pulse: rand(0.005, 0.02),
      pulseDir: 1,
      color: pick([
        'rgba(255,255,255,',
        'rgba(135,206,235,',
        'rgba(174,214,241,',
        'rgba(255,215,0,'
      ])
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
      // update
      p.y += p.speedY;
      p.x += p.speedX;
      p.opacity += p.pulse * p.pulseDir;
      if (p.opacity >= 0.6 || p.opacity <= 0.1) p.pulseDir *= -1;

      // wrap around
      if (p.y < -10) { p.y = canvas.height + 10; p.x = rand(0, canvas.width); }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      // draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.opacity.toFixed(2) + ')';
      ctx.fill();

      // glow
      if (p.size > 2.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.opacity * 0.2).toFixed(2) + ')';
        ctx.fill();
      }
    }

    requestAnimationFrame(animateParticles);
  }

  // ============ FLOATING DECORATIONS ============
  function spawnFloatingDecorations() {
    const container = document.getElementById('floating-decorations');
    if (!container) return;

    const balloons = ['🎈', '🎈', '🎈', '🩵', '💙'];
    const leaves = ['🍃', '🌿', '☘️'];

    // Balloons
    function addBalloon() {
      const el = document.createElement('div');
      el.className = 'floating-balloon';
      el.textContent = pick(balloons);
      el.style.left = rand(5, 95) + '%';
      el.style.animationDuration = rand(12, 22) + 's';
      el.style.animationDelay = rand(0, 5) + 's';
      el.style.fontSize = rand(1.5, 3) + 'rem';
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }

    // Leaves
    function addLeaf() {
      const el = document.createElement('div');
      el.className = 'floating-leaf';
      el.textContent = pick(leaves);
      el.style.left = rand(0, 100) + '%';
      el.style.animationDuration = rand(10, 18) + 's';
      el.style.animationDelay = rand(0, 3) + 's';
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }

    // Bubbles
    function addBubble() {
      const el = document.createElement('div');
      el.className = 'floating-bubble';
      el.style.left = rand(5, 95) + '%';
      el.style.animationDuration = rand(8, 16) + 's';
      el.style.animationDelay = rand(0, 3) + 's';
      const size = rand(8, 28);
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }

    // Initial burst
    for (let i = 0; i < 5; i++) { addBalloon(); addLeaf(); addBubble(); }

    // Recurring
    setInterval(addBalloon, 4000);
    setInterval(addLeaf, 5000);
    setInterval(addBubble, 3500);
  }

  // ============ SCROLL ANIMATIONS ============
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, parseInt(delay));
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // ============ CONFETTI BURST ============
  function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#ffd700', '#87ceeb', '#aed6f1', '#48c9b0', '#ff6b81', '#fff', '#76d7c4', '#5dade2'];
    const shapes = ['square', 'circle'];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = pick(colors);
      const shape = pick(shapes);
      piece.style.backgroundColor = color;
      piece.style.left = rand(10, 90) + '%';
      piece.style.top = rand(-10, 30) + '%';
      piece.style.animationDuration = rand(2, 5) + 's';
      piece.style.animationDelay = rand(0, 1.5) + 's';
      piece.style.width = rand(6, 14) + 'px';
      piece.style.height = rand(6, 14) + 'px';
      if (shape === 'circle') piece.style.borderRadius = '50%';
      piece.style.transform = `rotate(${rand(0, 360)}deg)`;
      container.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove());
    }
  }

  // Trigger confetti when invitation section is in view
  function initConfettiOnScroll() {
    const invSection = document.getElementById('invitation');
    if (!invSection) return;
    let fired = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          setTimeout(triggerConfetti, 400);
          // repeat every so often for fun
          setInterval(triggerConfetti, 12000);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(invSection);
  }

  // ============ PARALLAX SCROLL EFFECT ============
  function initParallax() {
    const moon = document.querySelector('.moon');
    const clouds = document.querySelectorAll('.cloud');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (moon) {
        moon.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
      clouds.forEach((cloud, i) => {
        const speed = 0.03 + i * 0.02;
        cloud.style.transform = `translateX(${Math.sin(scrollY * 0.002 + i) * 30}px) translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // ============ SCROLL INDICATOR FADE ============
  function initScrollIndicatorFade() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 300);
      indicator.style.opacity = opacity;
      if (scrollY > 300) indicator.style.pointerEvents = 'none';
      else indicator.style.pointerEvents = 'auto';
    }, { passive: true });
  }

  // ============ MUSIC TOGGLE (cosmetic) ============
  function initMusicToggle() {
    const btn = document.getElementById('music-toggle');
    if (!btn) return;
    let muted = true;
    btn.classList.add('muted');
    btn.addEventListener('click', () => {
      muted = !muted;
      btn.classList.toggle('muted', muted);
      btn.textContent = muted ? '🎵' : '🎶';
    });
  }

  // ============ SMOOTH SECTION REVEALS ============
  function addSectionRevealEffects() {
    // Add a subtle scale-in for each section
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transition = 'opacity 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
        }
      });
    }, { threshold: 0.05 });

    sections.forEach(s => observer.observe(s));

    // Make opening visible immediately
    const opening = document.getElementById('opening');
    if (opening) opening.style.opacity = '1';
  }

  // ============ HOVER SPARKLE EFFECT ON CARDS ============
  function initCardSparkles() {
    const cards = document.querySelectorAll('.animal-card, .detail-item');
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        for (let i = 0; i < 5; i++) {
          const spark = document.createElement('span');
          spark.textContent = pick(['✦', '✧', '⭐', '✨']);
          spark.style.cssText = `
            position: absolute;
            font-size: ${rand(0.6, 1.2)}rem;
            color: #ffd700;
            pointer-events: none;
            left: ${rand(10, 90)}%;
            top: ${rand(10, 90)}%;
            animation: sparkleFloat ${rand(0.6, 1.2)}s ease-out forwards;
            z-index: 10;
          `;
          card.style.position = 'relative';
          card.appendChild(spark);
          spark.addEventListener('animationend', () => spark.remove());
        }
      });
    });
  }

  // ============ COUNTDOWN ELEMENT ============
  function initCountdown() {
    // Event date: 27 May 2026, 8:30 PM IST
    const eventDate = new Date('2026-05-27T19:30:00+05:30');

    function updateCountdown() {
      const now = new Date();
      const diff = eventDate - now;

      if (diff <= 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // Insert countdown under subtitle if it doesn't exist
      let countdownEl = document.getElementById('countdown-timer');
      if (!countdownEl) {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
          countdownEl = document.createElement('div');
          countdownEl.id = 'countdown-timer';
          countdownEl.className = 'animate-on-scroll';
          countdownEl.style.cssText = `
            display: flex;
            gap: 16px;
            justify-content: center;
            margin: 24px auto 0;
            flex-wrap: wrap;
          `;
          subtitle.parentNode.insertBefore(countdownEl, subtitle.nextSibling);
        }
      }

      if (countdownEl) {
        countdownEl.innerHTML = `
          <div style="text-align:center; background:rgba(255,255,255,0.18); backdrop-filter:blur(10px); border-radius:16px; padding:14px 20px; min-width:80px; border:1px solid rgba(255,255,255,0.25);">
            <div style="font-family:'Fredoka',sans-serif; font-size:2rem; font-weight:700; color:#ffd700; text-shadow:0 2px 8px rgba(255,215,0,0.3);">${days}</div>
            <div style="font-family:'Quicksand',sans-serif; font-size:0.7rem; text-transform:uppercase; letter-spacing:2px; color:rgba(255,255,255,0.8); margin-top:4px;">Days</div>
          </div>
          <div style="text-align:center; background:rgba(255,255,255,0.18); backdrop-filter:blur(10px); border-radius:16px; padding:14px 20px; min-width:80px; border:1px solid rgba(255,255,255,0.25);">
            <div style="font-family:'Fredoka',sans-serif; font-size:2rem; font-weight:700; color:#ffd700; text-shadow:0 2px 8px rgba(255,215,0,0.3);">${hours}</div>
            <div style="font-family:'Quicksand',sans-serif; font-size:0.7rem; text-transform:uppercase; letter-spacing:2px; color:rgba(255,255,255,0.8); margin-top:4px;">Hours</div>
          </div>
          <div style="text-align:center; background:rgba(255,255,255,0.18); backdrop-filter:blur(10px); border-radius:16px; padding:14px 20px; min-width:80px; border:1px solid rgba(255,255,255,0.25);">
            <div style="font-family:'Fredoka',sans-serif; font-size:2rem; font-weight:700; color:#ffd700; text-shadow:0 2px 8px rgba(255,215,0,0.3);">${mins}</div>
            <div style="font-family:'Quicksand',sans-serif; font-size:0.7rem; text-transform:uppercase; letter-spacing:2px; color:rgba(255,255,255,0.8); margin-top:4px;">Minutes</div>
          </div>
        `;
        // Ensure it becomes visible
        setTimeout(() => countdownEl.classList.add('visible'), 100);
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 60000);
  }

  // ============ INITIALIZE EVERYTHING ============
  function init() {
    generateStars();
    resizeCanvas();
    initParticles();
    animateParticles();
    spawnFloatingDecorations();
    initScrollAnimations();
    initConfettiOnScroll();
    initParallax();
    initScrollIndicatorFade();
    initMusicToggle();
    addSectionRevealEffects();
    initCountdown();

    // Delay sparkle init so DOM is ready
    setTimeout(initCardSparkles, 1000);

    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
